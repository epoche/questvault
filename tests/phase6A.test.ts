import { describe, expect, it } from 'vitest';
import {
  ARCADE_DAILY_TOKEN_CAP,
  awardBossSessionRewards,
  awardTowerSessionRewards,
  createInitialPlayerState,
  getTodayArcadeTokensEarned,
} from '../src/core/economy';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  calculateQuizEnergyGain,
  calculateTowerRawTokens,
  createInitialTowerSlots,
  getTotalDefensePower,
  getTowerPower,
  getTowerUpgradeCost,
  resolveAvailableTowerRoster,
  resolveTowerWave,
  SHINY_TOWER_MULTIPLIER,
  TOWER_DEPLOY_COST,
  TOWER_LEVEL_BASE_POWER,
  TOWER_SLOT_COUNT,
  TOWER_WAVES,
} from '../src/core/towerDefenseEngine';

describe('Phase 6A Layer 1 — Critter Tower Defense Engine & Shared Arcade Cap', () => {
  it('defines 6 tower slots, 5 escalating waves, and exact Shiny +25% firepower multiplier', () => {
    const slots = createInitialTowerSlots();
    expect(slots).toHaveLength(TOWER_SLOT_COUNT);
    expect(TOWER_WAVES).toHaveLength(5);

    // Monotonically increasing wave total HP
    let prevTotalHp = 0;
    for (const w of TOWER_WAVES) {
      const hp = w.monsterCount * w.hpPerMonster;
      expect(hp).toBeGreaterThan(prevTotalHp);
      prevTotalHp = hp;
    }

    // Empty slot = 0 power, deploy cost = 25
    expect(getTowerPower(slots[0])).toBe(0);
    expect(getTowerUpgradeCost(slots[0])).toBe(TOWER_DEPLOY_COST);

    // Lv.1 / Lv.2 / Lv.3 regular vs Shiny +25%
    for (const lv of [1, 2, 3] as const) {
      const s = { slotIndex: 0, collectibleId: 'critter-sprout-bunny', level: lv };
      expect(getTowerPower(s, {})).toBe(TOWER_LEVEL_BASE_POWER[lv]);
      expect(getTowerPower(s, { 'critter-sprout-bunny': true })).toBe(
        Math.round(TOWER_LEVEL_BASE_POWER[lv] * SHINY_TOWER_MULTIPLIER),
      );
    }

    // Max level upgrade cost is null
    expect(getTowerUpgradeCost({ slotIndex: 0, collectibleId: 'critter-sprout-bunny', level: 3 })).toBeNull();
  });

  it('deterministically resolves all 5 waves across empty, partial, and maxed squads', () => {
    const empty = createInitialTowerSlots();
    const resEmpty = resolveTowerWave(empty, 0);
    expect(resEmpty.defeatedMonsters).toBe(0);
    expect(resEmpty.leakedMonsters).toBe(TOWER_WAVES[0].monsterCount);
    expect(resEmpty.castleDamage).toBe(TOWER_WAVES[0].monsterCount);
    expect(resEmpty.perfectClear).toBe(false);

    // 6 maxed Lv.3 Shiny towers easily clear Wave 5 perfectly
    const maxed = createInitialTowerSlots().map((s) => ({
      ...s,
      collectibleId: 'critter-sprout-bunny',
      level: 3 as const,
    }));
    const shinyMap = { 'critter-sprout-bunny': true };
    expect(getTotalDefensePower(maxed, shinyMap)).toBe(6 * Math.round(72 * 1.25));
    for (let w = 0; w < TOWER_WAVES.length; w += 1) {
      const res = resolveTowerWave(maxed, w, shinyMap);
      expect(res.perfectClear).toBe(true);
      expect(res.castleDamage).toBe(0);
      expect(res.defeatedMonsters).toBe(TOWER_WAVES[w].monsterCount);
    }
  });

  it('enforces 0-correct anti-cheese, combo energy curve, and shared 150-token daily arcade cap', () => {
    expect(calculateTowerRawTokens(0, 5, true)).toBe(0);
    expect(calculateTowerRawTokens(Number.NaN, 5, true)).toBe(0);
    expect(calculateTowerRawTokens(4, Number.POSITIVE_INFINITY, false)).toBe(12);
    expect(calculateTowerRawTokens(4, 2, false)).toBe(20);
    expect(calculateTowerRawTokens(10, 5, true)).toBe(45); // clamped at 45

    expect(calculateQuizEnergyGain(Number.NaN)).toBe(25);
    expect(calculateQuizEnergyGain(Number.POSITIVE_INFINITY)).toBe(25);
    expect(calculateQuizEnergyGain(1)).toBe(25);
    expect(calculateQuizEnergyGain(2)).toBe(30);
    expect(calculateQuizEnergyGain(4)).toBe(40);
    expect(calculateQuizEnergyGain(10)).toBe(40); // capped at +15 bonus

    const nanWaveRes = resolveTowerWave(createInitialTowerSlots(), Number.NaN);
    expect(nanWaveRes.wave.waveNumber).toBe(1);

    const p0 = createInitialPlayerState('Mia');
    // Earn 120 via Boss Battle first, then Tower Defense can only earn remaining 30
    const b1 = awardBossSessionRewards(p0, 'english', 900, 120, '2026-11-23');
    const t1 = awardTowerSessionRewards(b1.state, 'math', 1850, 45, '2026-11-23');
    expect(t1.tokensAwarded).toBe(ARCADE_DAILY_TOKEN_CAP - 120);
    expect(t1.remainingDailyCap).toBe(0);
    expect(getTodayArcadeTokensEarned(t1.state, '2026-11-23')).toBe(ARCADE_DAILY_TOKEN_CAP);
    expect(t1.state.towerHighScores?.math).toBe(1850);

    // Subsequent same-day run awards 0 tokens but still updates higher score
    const t2 = awardTowerSessionRewards(t1.state, 'math', 2400, 45, '2026-11-23');
    expect(t2.tokensAwarded).toBe(0);
    expect(t2.state.towerHighScores?.math).toBe(2400);

    // v1 JSON roundtrip preserves towerHighScores
    const restored = importPlayerStateJson(exportPlayerStateJson(t2.state));
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;
    expect(restored.state.towerHighScores?.math).toBe(2400);
  });

  it('prioritizes favorite and Shiny critters in Tower Defense roster', () => {
    const roster = resolveAvailableTowerRoster(
      {
        'critter-sprout-bunny': 1,
        'sweet-boba-bear': 2,
        'space-astro-corgi': 1,
      },
      ['space-astro-corgi'],
      { 'sweet-boba-bear': true },
    );
    expect(roster[0]).toBe('space-astro-corgi'); // favorite first
    expect(roster[1]).toBe('sweet-boba-bear'); // shiny second
  });
});

import { describe, expect, it } from 'vitest';
import {
  ACHIEVEMENTS,
  claimAchievementReward,
  evaluateAchievements,
} from '../src/core/achievements';
import { computeLogicLabOverview, formatWeeklyReportText } from '../src/core/analytics';
import { buildCertificateSummary } from '../src/core/certificate';
import { awardLogicModuleRewards, createInitialPlayerState } from '../src/core/economy';
import { ALL_LOGIC_MODULES, LOGIC_REASONING_MODULES, SPATIAL_MODULES } from '../src/subjects/logic/logicTypes';

describe('Phase 7C — 38 Achievement Badges, Parent Corner Logic Stats & Certificate Highlights', () => {
  it('ships 38 unique achievement badges (including 8 Logic & Spatial badges) with unique IDs and titles', () => {
    expect(ACHIEVEMENTS).toHaveLength(38);
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(38);
    expect(new Set(ACHIEVEMENTS.map((a) => a.title)).size).toBe(38);
    expect(new Set(ACHIEVEMENTS.map((a) => a.zhTitle)).size).toBe(38);

    const logicBadges = ACHIEVEMENTS.filter((a) => a.category === 'logic');
    expect(logicBadges).toHaveLength(8);
  });

  it('accurately evaluates and unlocks all 8 Logic & Spatial badges with lifetime once-per-badge claim lock', () => {
    let player = createInitialPlayerState('Chloe');

    // Before playing any logic module, 0 logic badges unlocked
    const initEval = evaluateAchievements(player).filter((a) => a.def.category === 'logic');
    expect(initEval.every((a) => !a.unlocked)).toBe(true);

    // Clear all 4 spatial modules (5/5 each -> 20 correct, 4 runs)
    for (const mod of SPATIAL_MODULES) {
      player = awardLogicModuleRewards(player, mod.id, 5, 5, '2026-11-24').state;
    }
    const afterSpatial = Object.fromEntries(
      evaluateAchievements(player).map((a) => [a.def.id, a]),
    );
    expect(afterSpatial['ach-spatial-first'].unlocked).toBe(true);
    expect(afterSpatial['ach-spatial-all'].unlocked).toBe(true);
    expect(afterSpatial['ach-logic-first'].unlocked).toBe(false);
    expect(afterSpatial['ach-logic-lab-8'].unlocked).toBe(false);
    expect(afterSpatial['ach-logic-runs-5'].unlocked).toBe(false);

    // Clear all 4 logic reasoning modules + extra runs to reach 60 correct answers
    for (const mod of LOGIC_REASONING_MODULES) {
      player = awardLogicModuleRewards(player, mod.id, 5, 5, '2026-11-25').state;
    }
    for (let i = 0; i < 4; i++) {
      player = awardLogicModuleRewards(player, 'balance-scale', 5, 5, '2026-11-26').state;
    }

    const afterAll = evaluateAchievements(player).filter((a) => a.def.category === 'logic');
    expect(afterAll).toHaveLength(8);
    expect(afterAll.every((a) => a.unlocked)).toBe(true);

    // Claim ach-logic-lab-8 once, verify double-claim is rejected
    const dustBefore = player.starDust ?? 0;
    const claim1 = claimAchievementReward(player, 'ach-logic-lab-8');
    expect(claim1.ok).toBe(true);
    if (claim1.ok) {
      expect(claim1.rewardType).toBe('starDust');
      expect(claim1.rewardAmount).toBe(60);
      expect(claim1.state.starDust).toBe(dustBefore + 60);
      const claim2 = claimAchievementReward(claim1.state, 'ach-logic-lab-8');
      expect(claim2.ok).toBe(false);
    }
  });

  it('computes Parent Corner LogicLabOverview, Weekly Report line, and Printable Certificate highlight', () => {
    let player = createInitialPlayerState('Chloe');
    player = awardLogicModuleRewards(player, 'rotation-mirror', 4, 5, '2026-11-24').state;
    player = awardLogicModuleRewards(player, 'balance-scale', 5, 5, '2026-11-24').state;
    player = awardLogicModuleRewards(player, 'robot-coding', 2, 5, '2026-11-24').state; // 40% -> not cleared, still tracked in runs/accuracy

    const overview = computeLogicLabOverview(player);
    expect(overview.spatialCleared).toBe(1);
    expect(overview.spatialTotal).toBe(4);
    expect(overview.logicCleared).toBe(1);
    expect(overview.logicTotal).toBe(4);
    expect(overview.totalCleared).toBe(2);
    expect(overview.totalModules).toBe(ALL_LOGIC_MODULES.length);
    expect(overview.totalRuns).toBe(3);
    expect(overview.totalCorrect).toBe(11);
    expect(overview.totalQuestions).toBe(15);
    expect(overview.avgAccuracyPct).toBe(73);
    expect(overview.modules).toHaveLength(8);

    const report = formatWeeklyReportText(player, '2026-11-24T12:00:00.000Z');
    expect(report).toContain('邏輯與空間思維館：通關 2 / 8 模組');
    expect(report).toContain('正確率 73%');

    const cert = buildCertificateSummary(player, new Date(2026, 10, 24));
    expect(cert.logicModulesCleared).toBe(2);
    expect(cert.logicModulesTotal).toBe(8);
    expect(cert.achievementsTotal).toBe(38);
  });

  it('resists duplicate IDs, unknown IDs, NaN/Infinity logicStats, and runs>0 with totalQuestions=0', () => {
    const corrupted = {
      ...createInitialPlayerState('Corrupt'),
      completedLogicModuleIds: [
        'rotation-mirror',
        'rotation-mirror',
        'rotation-mirror',
        'rotation-mirror',
        'invalid-module-id',
      ],
      logicStats: {
        'rotation-mirror': { runs: Number.NaN, totalCorrect: Number.NaN, totalQuestions: 5 },
        'iso-cubes': { runs: Number.POSITIVE_INFINITY, totalCorrect: 999, totalQuestions: 5 },
        'balance-scale': { runs: 2, totalCorrect: 0, totalQuestions: 0 },
      },
    };

    const evalMap = Object.fromEntries(
      evaluateAchievements(corrupted).map((a) => [a.def.id, a]),
    );
    // Duplicate 'rotation-mirror' x4 must count as 1, NOT 4!
    expect(evalMap['ach-spatial-first'].current).toBe(1);
    expect(evalMap['ach-spatial-all'].current).toBe(1);
    expect(evalMap['ach-spatial-all'].unlocked).toBe(false);
    expect(evalMap['ach-logic-runs-5'].current).toBe(2);
    expect(evalMap['ach-logic-runs-5'].unlocked).toBe(false);
    // totalCorrect clamped to totalQuestions (5) for iso-cubes, 0 for NaN
    expect(evalMap['ach-logic-correct-25'].current).toBe(5);
    expect(evalMap['ach-logic-correct-25'].unlocked).toBe(false);

    // Ensure NaN/corrupted stats can never bypass claimAchievementReward
    expect(claimAchievementReward(corrupted, 'ach-spatial-all').ok).toBe(false);
    expect(claimAchievementReward(corrupted, 'ach-logic-runs-5').ok).toBe(false);

    // Certificate & overview deduplicate cleanly and handle runs>0 with totalQuestions=0
    const cert = buildCertificateSummary(corrupted, new Date(2026, 10, 24));
    expect(cert.logicModulesCleared).toBe(1);
    const overview = computeLogicLabOverview(corrupted);
    expect(overview.spatialCleared).toBe(1);
    const balItem = overview.modules.find((m) => m.meta.id === 'balance-scale')!;
    expect(balItem.runs).toBe(2);
    expect(balItem.accuracyPct).toBeNull();
  });
});

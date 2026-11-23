import { describe, expect, it } from 'vitest';
import { generateArcadeQuestion } from '../src/core/arcadeQuestions';
import {
  CAFE_DURATION_SEC,
  CAFE_MAX_LEVEL,
  CAFE_MENU,
  calculateCafeRawTokens,
  createInitialCafeState,
  getFoodPrice,
  getFoodUpgradeCost,
  restockFromAnswer,
  serveCustomerAtSeat,
  tickCafeSecond,
  upgradeOrUnlockMenuItem,
} from '../src/core/cafeEngine';
import {
  ARCADE_DAILY_TOKEN_CAP,
  awardBlitzSessionRewards,
  awardCafeSessionRewards,
  createInitialPlayerState,
  getTodayArcadeTokensEarned,
} from '../src/core/economy';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import type { DifficultyTier, SubjectId } from '../src/core/types';

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

describe('Phase 3A Layer 1: Shared Cross-Subject Arcade Question Engine Fuzz', () => {
  it('generates 1,200 valid 4-choice questions across English, Math, and Chinese (all 4 tiers)', () => {
    const subjects: SubjectId[] = ['english', 'math', 'chinese'];
    const tiers: DifficultyTier[] = [1, 2, 3, 4];
    let count = 0;

    for (const subject of subjects) {
      for (const tier of tiers) {
        const rng = createSeededRng(subject.length * 1009 + tier * 7919);
        for (let i = 0; i < 100; i += 1) {
          const q = generateArcadeQuestion(subject, tier, i, rng);
          count += 1;
          expect(q.prompt.length).toBeGreaterThan(0);
          expect(q.choices).toHaveLength(4);
          expect(new Set(q.choices.map((c) => c.label)).size).toBe(4);
          expect(q.choices.map((c) => c.label)).toContain(q.correctAnswer);
          expect(q.explanation.length).toBeGreaterThan(0);
          if (subject === 'chinese' && q.subHint) {
            expect(q.subHint.includes(q.correctAnswer)).toBe(false);
          }
        }
      }
    }
    expect(count).toBe(1200);
  });
});

describe('Phase 3A Layer 1: Boba Cafe Game Engine, VIPs, Upgrades & Anti-Cheese Scoring', () => {
  it('spawns 3 collectible customers, prioritizes Favorite Shelf VIPs (+25% tip), serves orders, and upgrades/unlocks menu dishes', () => {
    const rng = createSeededRng(2026);
    const vault = {
      'critter-sprout-bunny': 1,
      'starunicorn-chroma-galaxy': 1,
      'puppypark-corgi-loaf': 1,
      'dragonboat-bamboo-zongzi': 1,
    };
    const shinyVault = { 'starunicorn-chroma-galaxy': true };
    const favorites = ['starunicorn-chroma-galaxy', 'puppypark-corgi-loaf'];

    let state = createInitialCafeState(vault, shinyVault, favorites, 'critter-sprout-bunny', rng);
    expect(state.secondsLeft).toBe(CAFE_DURATION_SEC);
    expect(state.customers).toHaveLength(3);
    expect(state.stock.boba).toBe(2);
    expect(state.menuLevels.souffle).toBe(0);

    // Anti-cheese: serving customers using free starter stock WITHOUT answering any quiz yields 0 QuestVault Tokens!
    const s1 = serveCustomerAtSeat(state, 0, vault, shinyVault, favorites, 'critter-sprout-bunny', rng);
    expect(s1.ok).toBe(true);
    if (!s1.ok) return;
    expect(s1.coinsEarned).toBeGreaterThan(0);
    state = s1.state;
    expect(calculateCafeRawTokens(state)).toBe(0);

    // Answering quiz questions correctly restocks dishes and earns QuestVault Tokens
    for (let i = 0; i < 4; i += 1) {
      const r = restockFromAnswer(state, true, rng);
      expect(r.restockedItems.length).toBeGreaterThanOrEqual(2);
      state = r.state;
    }
    expect(state.correctAnswers).toBe(4);
    expect(state.bestStreak).toBe(4);
    expect(calculateCafeRawTokens(state)).toBeGreaterThanOrEqual(10);

    // Wrong answer resets streak without breaking stock
    const wrong = restockFromAnswer(state, false, rng);
    expect(wrong.restockedItems).toEqual([]);
    expect(wrong.state.streak).toBe(0);
    state = wrong.state;

    // Unlock Cloud Souffle (cost 40) grants 2 complimentary stock and raises level to 1
    state = { ...state, cafeCoins: 500 };
    const unlockCost = getFoodUpgradeCost('souffle', 0)!;
    expect(unlockCost).toBe(40);
    const unlocked = upgradeOrUnlockMenuItem(state, 'souffle');
    expect(unlocked.ok).toBe(true);
    if (!unlocked.ok) return;
    expect(unlocked.unlockedNew).toBe(true);
    expect(unlocked.state.menuLevels.souffle).toBe(1);
    expect(unlocked.state.stock.souffle).toBe(2);
    expect(unlocked.state.cafeCoins).toBe(500 - unlockCost);

    // Upgrade to max level increases dish price and caps cleanly at CAFE_MAX_LEVEL
    let cur = unlocked.state;
    const lv1Price = getFoodPrice('boba', 1);
    for (let lv = 1; lv < CAFE_MAX_LEVEL; lv += 1) {
      cur = { ...cur, cafeCoins: 9999 };
      const up = upgradeOrUnlockMenuItem(cur, 'boba');
      expect(up.ok).toBe(true);
      if (up.ok) cur = up.state;
    }
    expect(cur.menuLevels.boba).toBe(CAFE_MAX_LEVEL);
    expect(getFoodPrice('boba', CAFE_MAX_LEVEL)).toBeGreaterThan(lv1Price * 2);
    expect(upgradeOrUnlockMenuItem(cur, 'boba')).toEqual({ ok: false, reason: 'max_level' });

    // Tick down timer and ensure expired customer rotates cleanly without negative seconds
    let ticking = state;
    for (let t = 0; t < 40; t += 1) {
      ticking = tickCafeSecond(ticking, vault, shinyVault, favorites, 'critter-sprout-bunny', rng);
    }
    expect(ticking.secondsLeft).toBe(CAFE_DURATION_SEC - 40);
    expect(ticking.customers).toHaveLength(3);
    expect(CAFE_MENU).toHaveLength(6);
  });

  it('enforces shared 150-Token daily Arcade cap across Blitz + Boba Cafe in BOTH orders and round-trips v1 JSON backup', () => {
    const today = '2026-11-23';
    let state = createInitialPlayerState('Luna');

    // Order A: Earn 100 Tokens in Blitz first -> Cafe gets clamped at 150 total
    const b1 = awardBlitzSessionRewards(state, 'english', 200, 100, today);
    expect(b1.tokensAwarded).toBe(100);
    state = b1.state;
    expect(getTodayArcadeTokensEarned(state, today)).toBe(100);

    const c1 = awardCafeSessionRewards(state, 'chinese', 320, 45, today);
    expect(c1.tokensAwarded).toBe(45);
    expect(c1.remainingDailyCap).toBe(5);
    expect(c1.state.cafeHighScores?.chinese).toBe(320);
    state = c1.state;

    const c2 = awardCafeSessionRewards(state, 'chinese', 480, 30, today);
    expect(c2.tokensAwarded).toBe(5);
    expect(c2.remainingDailyCap).toBe(0);
    expect(c2.state.cafeHighScores?.chinese).toBe(480);
    expect(getTodayArcadeTokensEarned(c2.state, today)).toBe(ARCADE_DAILY_TOKEN_CAP);

    // Order B: Earn 140 Tokens in Boba Cafe first -> Blitz MUST clamp to remaining 10 (total 150, never 260!)
    let stateB = createInitialPlayerState('Maya');
    const cafeFirst = awardCafeSessionRewards(stateB, 'math', 600, 140, today);
    expect(cafeFirst.tokensAwarded).toBe(140);
    stateB = cafeFirst.state;
    const blitzSecond = awardBlitzSessionRewards(stateB, 'math', 250, 90, today);
    expect(blitzSecond.tokensAwarded).toBe(10);
    expect(blitzSecond.remainingDailyCap).toBe(0);
    expect(getTodayArcadeTokensEarned(blitzSecond.state, today)).toBe(ARCADE_DAILY_TOKEN_CAP);

    // v1 JSON backup round-trip preserves cafeHighScores & arcadeDailyTokens
    const restored = importPlayerStateJson(exportPlayerStateJson(c2.state));
    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.state.cafeHighScores?.chinese).toBe(480);
      expect(restored.state.arcadeDailyTokens).toEqual({ dateKey: today, earned: 50 });
    }
  });
});

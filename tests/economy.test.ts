import { describe, expect, it } from 'vitest';
import {
  applyQuestRewardMultiplier,
  calculateForgeChestTokens,
  calculateQuestionTokens,
  createInitialPlayerState,
  equipCollectibleAvatar,
  getQuestRewardPolicy,
  openMysteryPack,
  recordDailyQuestClaim,
  sellDuplicateCollectible,
} from '../src/core/economy';
import { recordWordOutcome } from '../src/core/mastery';
import { PACK_COST, STARTER_COLLECTIBLE_ID } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';

describe('QuestVault Economy Seam', () => {
  it('calculates escalating Token payouts with Combo streaks up to a cap', () => {
    expect(calculateQuestionTokens(4, 0)).toBe(4);
    expect(calculateQuestionTokens(4, 1)).toBe(5);
    expect(calculateQuestionTokens(4, 3)).toBe(7);
    expect(calculateQuestionTokens(4, 10)).toBe(9);
  });

  it('awards a generous Writer Forge Token Chest on completed checks', () => {
    expect(calculateForgeChestTokens(4, 4)).toBe(25);
    expect(calculateForgeChestTokens(3, 4)).toBe(15);
    expect(calculateForgeChestTokens(0, 4)).toBe(0);
  });

  it('opens a Mystery Pack, deducts 25 Tokens, and records a new Collectible in the Vault', () => {
    const start = { ...createInitialPlayerState('Maya'), tokens: 30 };
    // rng = 0.995 falls in the Chroma slice (top 0.8%)
    const outcome = openMysteryPack(start, 'critter', () => 0.995);

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    expect(outcome.state.tokens).toBe(30 - PACK_COST);
    expect(outcome.collectible.packId).toBe('critter');
    expect(outcome.collectible.rarity).toBe('chroma');
    expect(outcome.isNew).toBe(true);
    expect(outcome.state.vault[outcome.collectible.id]).toBe(1);
  });

  it('rejects opening a Mystery Pack when Tokens are below PACK_COST', () => {
    const broke = { ...createInitialPlayerState('Maya'), tokens: 10 };
    const outcome = openMysteryPack(broke, 'sweet', () => 0.2);

    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.reason).toBe('insufficient_tokens');
  });

  it('marks repeat pulls as duplicates and allows selling only extra copies', () => {
    const start = {
      ...createInitialPlayerState('Maya'),
      tokens: 50,
      vault: {
        [STARTER_COLLECTIBLE_ID]: 1,
        'critter-sun-phoenix': 2,
      },
    };

    const sold = sellDuplicateCollectible(start, 'critter-sun-phoenix');
    expect(sold.ok).toBe(true);
    if (!sold.ok) return;
    expect(sold.tokensRefunded).toBe(75);
    expect(sold.state.tokens).toBe(125);
    expect(sold.state.vault['critter-sun-phoenix']).toBe(1);

    // Attempting to sell the last remaining copy is blocked
    const blocked = sellDuplicateCollectible(sold.state, 'critter-sun-phoenix');
    expect(blocked.ok).toBe(false);
  });

  it('equips only owned Collectibles as the Player avatar', () => {
    const start = {
      ...createInitialPlayerState('Maya'),
      vault: {
        [STARTER_COLLECTIBLE_ID]: 1,
        'space-astro-corgi': 1,
      },
    };

    const equipped = equipCollectibleAvatar(start, 'space-astro-corgi');
    expect(equipped.equippedCollectibleId).toBe('space-astro-corgi');

    const unchanged = equipCollectibleAvatar(equipped, 'space-chroma-narwhal');
    expect(unchanged.equippedCollectibleId).toBe('space-astro-corgi');
  });

  it('guarantees the very first Mystery Pack pull is always a brand-new Collectible (never starter Clover Bunny)', () => {
    const fresh = { ...createInitialPlayerState('Maya'), tokens: 25 };
    // rng = 0 normally hits the first common item in Critter Pack (Clover Bunny)
    const outcome = openMysteryPack(fresh, 'critter', () => 0);

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    expect(outcome.isNew).toBe(true);
    expect(outcome.collectible.id).not.toBe(STARTER_COLLECTIBLE_ID);
    expect(outcome.state.vault[outcome.collectible.id]).toBe(1);
  });

  it('enforces Plan A anti-farming policy for static quests (100% new, 0% same-day repeat, 50% later-day review, 100% SRS-due)', () => {
    const day1 = '2026-11-23';
    const day2 = '2026-11-24';
    const day5 = '2026-11-27';
    const words = ['curious', 'sparkle'];

    let state = createInitialPlayerState('Maya');

    // 1) Brand-new quest on day 1 -> 100%
    const pNew = getQuestRewardPolicy(state, {
      questSetId: 'en-t2-s1',
      kind: 'static',
      subjectId: 'english',
      todayKey: day1,
      words,
    });
    expect(pNew.tier).toBe('full-new');
    expect(pNew.multiplier).toBe(1);
    expect(applyQuestRewardMultiplier(60, pNew.multiplier)).toBe(60);

    // Record completion + fresh mastery (nextReviewAt is +1 day => 2026-11-24T12:00:00Z,
    // plus a second clean outcome pushes nextReviewAt to +3 days => 2026-11-26T12:00:00Z)
    let mastery = recordWordOutcome(state.wordMastery, {
      word: 'curious',
      subjectId: 'english',
      tier: 2,
      outcome: 'clean',
      nowIso: '2026-11-23T12:00:00.000Z',
    });
    mastery = recordWordOutcome(mastery, {
      word: 'curious',
      subjectId: 'english',
      tier: 2,
      outcome: 'clean',
      nowIso: '2026-11-23T12:00:00.000Z',
    });
    state = recordDailyQuestClaim(
      {
        ...state,
        completedQuestSetIds: ['en-t2-s1'],
        wordMastery: mastery,
      },
      'en-t2-s1',
      day1,
    );

    // 2) Immediate same-day replay -> 0% Practice Mode!
    const pSameDay = getQuestRewardPolicy(state, {
      questSetId: 'en-t2-s1',
      kind: 'static',
      subjectId: 'english',
      todayKey: day1,
      words,
    });
    expect(pSameDay.tier).toBe('practice-0');
    expect(pSameDay.multiplier).toBe(0);
    expect(applyQuestRewardMultiplier(60, pSameDay.multiplier)).toBe(0);

    // 3) Next day (not yet SRS-due because nextReviewAt is Nov 26) -> 50% Review Mode!
    const pReview = getQuestRewardPolicy(state, {
      questSetId: 'en-t2-s1',
      kind: 'static',
      subjectId: 'english',
      todayKey: day2,
      words,
      nowIso: '2026-11-24T12:00:00.000Z',
    });
    expect(pReview.tier).toBe('review-50');
    expect(pReview.multiplier).toBe(0.5);
    expect(applyQuestRewardMultiplier(60, pReview.multiplier)).toBe(30);

    // Claiming once on day2 locks day2 2nd run to 0%
    const stateDay2Done = recordDailyQuestClaim(state, 'en-t2-s1', day2);
    const pDay2Repeat = getQuestRewardPolicy(stateDay2Done, {
      questSetId: 'en-t2-s1',
      kind: 'static',
      subjectId: 'english',
      todayKey: day2,
      words,
      nowIso: '2026-11-24T13:00:00.000Z',
    });
    expect(pDay2Repeat.tier).toBe('practice-0');
    expect(pDay2Repeat.multiplier).toBe(0);

    // 4) Day 5 (past SRS nextReviewAt Nov 26) -> 100% SRS Due Review!
    const pSrsDue = getQuestRewardPolicy(state, {
      questSetId: 'en-t2-s1',
      kind: 'static',
      subjectId: 'english',
      todayKey: day5,
      words,
      nowIso: '2026-11-27T12:00:00.000Z',
    });
    expect(pSrsDue.tier).toBe('full-srs-due');
    expect(pSrsDue.multiplier).toBe(1);
    expect(pSrsDue.dueWordCount).toBe(1);
  });

  it('enforces Plan A dynamic Math limit (2 full runs/day, 30% on 3rd+) and keeps special review modes at 100%', () => {
    const day1 = '2026-11-23';
    const day2 = '2026-11-24';
    let state = createInitialPlayerState('Maya');

    // Math 1st & 2nd runs today -> 100%
    expect(
      getQuestRewardPolicy(state, {
        questSetId: 'math-t2-u1',
        kind: 'math',
        subjectId: 'math',
        todayKey: day1,
      }).multiplier,
    ).toBe(1);
    state = recordDailyQuestClaim(state, 'math-t2-u1', day1);

    expect(
      getQuestRewardPolicy(state, {
        questSetId: 'math-t2-u1',
        kind: 'math',
        subjectId: 'math',
        todayKey: day1,
      }).multiplier,
    ).toBe(1);
    state = recordDailyQuestClaim(state, 'math-t2-u1', day1);

    // Math 3rd run today -> 30%
    const third = getQuestRewardPolicy(state, {
      questSetId: 'math-t2-u1',
      kind: 'math',
      subjectId: 'math',
      todayKey: day1,
    });
    expect(third.tier).toBe('math-diminished');
    expect(third.multiplier).toBe(0.3);
    expect(applyQuestRewardMultiplier(70, third.multiplier)).toBe(21);

    // Resets to 100% on a new day
    expect(
      getQuestRewardPolicy(state, {
        questSetId: 'math-t2-u1',
        kind: 'math',
        subjectId: 'math',
        todayKey: day2,
      }).multiplier,
    ).toBe(1);

    // Exempt special quests stay 100% even if repeated
    for (const specialId of [
      'en-srs-review',
      'zh-tricky-rematch',
      'en-weekly-parent-review',
      'custom-en-demo',
    ]) {
      const claimed = recordDailyQuestClaim(
        { ...state, completedQuestSetIds: [specialId] },
        specialId,
        day1,
      );
      const p = getQuestRewardPolicy(claimed, {
        questSetId: specialId,
        kind: 'static',
        subjectId: 'english',
        todayKey: day1,
      });
      expect(p.tier).toBe('full-special');
      expect(p.multiplier).toBe(1);
    }

    // dailyQuestClaims survives JSON export/import cleanly
    const json = exportPlayerStateJson(state);
    const imported = importPlayerStateJson(json);
    expect(imported.ok).toBe(true);
    if (!imported.ok) return;
    expect(imported.state.dailyQuestClaims).toEqual({
      dateKey: day1,
      counts: { 'math-t2-u1': 2 },
    });
  });
});


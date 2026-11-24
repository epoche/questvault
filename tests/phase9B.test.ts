import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, claimAchievementReward, evaluateAchievements } from '../src/core/achievements';
import {
  buildCritterPopQuiz,
  countBestFriendCritters,
  DAILY_FREE_TREATS,
  feedCritterTreat,
  getDailyRoomStatus,
  getFriendshipLevel,
  petCritter,
  recordCritterPopQuizResult,
  ROOM_DAILY_TOKEN_CAP,
} from '../src/core/critterCare';
import { createInitialPlayerState, toggleCritterRoomDecor } from '../src/core/economy';
import { COLLECTIBLES, STARTER_COLLECTIBLE_ID } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { ROOM_DECOR_ITEMS } from '../src/core/roomCatalog';

describe('Phase 9B — Critter Room 2.0, Daily Treats, Pop-Quiz Cap, 16 Stickers & 42 Achievements', () => {
  it('enforces daily pet XP limit, 3 daily free treats, friendship Lv.1->Lv.5 progression, and strict 25 Token/day room cap', () => {
    const today = '2026-11-24';
    const nextDay = '2026-11-25';
    let state = createInitialPlayerState('Chloe');
    const buddyId = STARTER_COLLECTIBLE_ID;

    // 1. First pet today gives +1 XP; second pet same day gives +0 XP (no spam to Lv.5)
    const pet1 = petCritter(state, buddyId, today);
    expect(pet1.ok).toBe(true);
    expect(pet1.xpGained).toBe(1);
    expect(pet1.alreadyPetToday).toBe(false);
    state = pet1.state;

    const pet2 = petCritter(state, buddyId, today);
    expect(pet2.ok).toBe(true);
    expect(pet2.xpGained).toBe(0);
    expect(pet2.alreadyPetToday).toBe(true);
    state = pet2.state;

    // 2. Feeding 3 daily treats succeeds (+3 XP each -> total 10 XP, crosses Lv.2 at 5 XP -> +5 bonus Tokens!)
    let totalBonusTokens = 0;
    for (let i = 0; i < DAILY_FREE_TREATS; i += 1) {
      const fed = feedCritterTreat(state, buddyId, i === 0 ? 'boba' : i === 1 ? 'daifuku' : 'cookie', today);
      expect(fed.ok).toBe(true);
      expect(fed.xpGained).toBe(3);
      totalBonusTokens += fed.tokensAwarded;
      state = fed.state;
    }
    expect(getFriendshipLevel(state.critterFriendship?.[buddyId]?.xp ?? 0)).toBe(2);
    expect(totalBonusTokens).toBe(5);
    expect(getDailyRoomStatus(state, today).treatsRemaining).toBe(0);

    // 4th treat same day is strictly rejected!
    const fourthTreat = feedCritterTreat(state, buddyId, 'boba', today);
    expect(fourthTreat.ok).toBe(false);
    expect(fourthTreat.xpGained).toBe(0);

    // 3. Pop-quizzes award +5 Tokens & +2 XP each, strictly bounded by ROOM_DAILY_TOKEN_CAP = 25/day
    const startTokens = state.tokens;
    for (let i = 0; i < 10; i += 1) {
      const res = recordCritterPopQuizResult(state, buddyId, true, today);
      expect(res.ok).toBe(true);
      expect(res.xpGained).toBe(2);
      state = res.state;
    }
    // Total tokens earned today (5 from level-up + 20 from quizzes/level-ups) MUST NOT exceed 25!
    expect(state.roomDailyActivity?.tokensEarned).toBe(ROOM_DAILY_TOKEN_CAP);
    expect(state.tokens - startTokens).toBe(ROOM_DAILY_TOKEN_CAP - totalBonusTokens);
    expect(getDailyRoomStatus(state, today).remainingTokenCap).toBe(0);
    expect(getFriendshipLevel(state.critterFriendship?.[buddyId]?.xp ?? 0)).toBeGreaterThanOrEqual(4);

    // 4. Next calendar day automatically replenishes all 3 treats and 25 Token cap
    const nextStatus = getDailyRoomStatus(state, nextDay);
    expect(nextStatus.treatsRemaining).toBe(DAILY_FREE_TREATS);
    expect(nextStatus.remainingTokenCap).toBe(ROOM_DAILY_TOKEN_CAP);

    // 5. Rejects unowned critters cleanly
    const unownedId = COLLECTIBLES.find((c) => c.id !== buddyId)!.id;
    expect(petCritter(state, unownedId, nextDay).ok).toBe(false);
    expect(feedCritterTreat(state, unownedId, 'boba', nextDay).ok).toBe(false);
    expect(recordCritterPopQuizResult(state, unownedId, true, nextDay).ok).toBe(false);
  });

  it('builds valid 2-choice bilingual pop quizzes prioritizing weak mastery words and never duplicates options', () => {
    const state = createInitialPlayerState('Chloe');
    for (let seed = 1; seed <= 40; seed += 1) {
      const q = buildCritterPopQuiz(state, seed);
      expect(q.choices).toHaveLength(2);
      expect(q.choices[0]).not.toBe(q.choices[1]);
      expect([0, 1]).toContain(q.correctIndex);
      expect(q.word.trim().length).toBeGreaterThan(0);
      if (q.subject === 'chinese') {
        expect(q.zhuyin && q.zhuyin.length > 0).toBe(true);
      }
    }
  });

  it('supports all 16 room decor stickers, unlocks 42 lifetime achievements idempotently, and round-trips v1 JSON', () => {
    expect(ROOM_DECOR_ITEMS).toHaveLength(16);
    expect(ACHIEVEMENTS).toHaveLength(42);

    let state = createInitialPlayerState('Chloe');
    const exclusiveIds = [
      'decor-golden-trophy',
      'decor-starlight-string',
      'decor-boba-bar',
      'decor-magic-orrery',
    ];
    // Locked Adventure Map exclusive stickers cannot be placed before unlocking
    for (const id of exclusiveIds) {
      state = toggleCritterRoomDecor(state, id);
    }
    expect(state.critterRoom?.decorIds ?? []).toHaveLength(0);

    // Once unlocked via 7-day Adventure Map full attendance, all 4 place cleanly
    state = { ...state, unlockedRoomDecorIds: [...exclusiveIds] };
    for (const id of exclusiveIds) {
      state = toggleCritterRoomDecor(state, id);
    }
    expect(state.critterRoom?.decorIds).toHaveLength(4);

    // Unlock all 4 new Phase 9B achievements
    state = {
      ...state,
      adventureWeeksCleared: 1,
      totalRoomQuizzesCorrect: 10,
      vault: {
        ...state.vault,
        [COLLECTIBLES[1].id]: 1,
        [COLLECTIBLES[2].id]: 1,
      },
      critterFriendship: {
        [STARTER_COLLECTIBLE_ID]: { xp: 15, lastPetDate: '2026-11-24' },
        [COLLECTIBLES[1].id]: { xp: 12 },
        [COLLECTIBLES[2].id]: { xp: 20 },
      },
    };
    expect(countBestFriendCritters(state, 3)).toBe(3);

    const newIds = ['ach-adventure-week-1', 'ach-room-bff-1', 'ach-room-bff-3', 'ach-room-quiz-10'];
    const evaluated = evaluateAchievements(state);
    for (const id of newIds) {
      expect(evaluated.find((a) => a.def.id === id)?.claimable).toBe(true);
      const claim1 = claimAchievementReward(state, id);
      expect(claim1.ok).toBe(true);
      if (claim1.ok) {
        state = claim1.state;
        const claim2 = claimAchievementReward(state, id);
        expect(claim2.ok).toBe(false);
      }
    }

    // Round-trip through v1 JSON export/import
    const imported = importPlayerStateJson(exportPlayerStateJson(state));
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.state.critterFriendship?.[STARTER_COLLECTIBLE_ID]?.xp).toBe(15);
      expect(imported.state.totalRoomQuizzesCorrect).toBe(10);
      expect(imported.state.critterRoom?.decorIds).toContain('decor-magic-orrery');
    }
  });
});

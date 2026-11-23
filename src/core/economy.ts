import {
  getCollectibleById,
  getCollectiblesByPack,
  getPackById,
  RARITY_CONFIGS,
  RARITY_ORDER,
  STARTER_COLLECTIBLE_ID,
} from './packs';
import type { Collectible, PackId, PlayerState, Rarity } from './types';

export const STARTER_TOKENS = 25;
export const SHINY_CRAFT_COPIES_REQUIRED = 3;
export const DAILY_TRI_SUBJECT_BONUS = 30;
export const BLITZ_DAILY_TOKEN_CAP = 120;
const MAX_COMBO_BONUS = 5;

export function createInitialPlayerState(displayName = 'Player'): PlayerState {
  return {
    version: 1,
    displayName: displayName.trim() || 'Player',
    tokens: STARTER_TOKENS,
    activeSubjectId: 'english',
    activeTier: 2,
    subjectTiers: { english: 2, math: 2, chinese: 2 },
    placementCompleted: false,
    subjectPlacementCompleted: { english: false, math: false, chinese: false },
    equippedCollectibleId: STARTER_COLLECTIBLE_ID,
    vault: {
      [STARTER_COLLECTIBLE_ID]: 1,
    },
    shinyVault: {},
    wordMastery: {},
    completedQuestSetIds: [],
    runHistory: [],
    writingLog: [],
    customWordSets: [],
    subjectBossRematchDate: {},
    streakDays: 0,
    blitzHighScores: {},
    showZhuyin: false,
    muted: false,
  };
}

export function calculateQuestionTokens(baseTokens: number, comboCount: number): number {
  const safeBase = Math.max(1, Math.floor(baseTokens));
  const bonus = Math.min(MAX_COMBO_BONUS, Math.max(0, Math.floor(comboCount)));
  return safeBase + bonus;
}

export function calculateForgeChestTokens(passedChecks: number, totalChecks: number): number {
  if (totalChecks <= 0 || passedChecks <= 0) return 0;
  if (passedChecks >= totalChecks) return 25;
  const ratio = passedChecks / totalChecks;
  if (ratio >= 0.75) return 15;
  return 8;
}

function drawRarity(roll: number): Rarity {
  const totalWeight = RARITY_ORDER.reduce((sum, r) => sum + RARITY_CONFIGS[r].weight, 0);
  const clamped = Math.min(0.999999, Math.max(0, roll));
  let cursor = clamped * totalWeight;

  for (const rarity of RARITY_ORDER) {
    cursor -= RARITY_CONFIGS[rarity].weight;
    if (cursor < 0) return rarity;
  }
  return 'common';
}

export type OpenPackResult =
  | {
      ok: true;
      state: PlayerState;
      collectible: Collectible;
      isNew: boolean;
      newCount: number;
    }
  | {
      ok: false;
      reason: 'unknown_pack' | 'insufficient_tokens' | 'empty_pack';
    };

export function openMysteryPack(
  state: PlayerState,
  packId: PackId,
  rng: () => number = Math.random,
): OpenPackResult {
  const pack = getPackById(packId);
  if (!pack) {
    return { ok: false, reason: 'unknown_pack' };
  }
  if (state.tokens < pack.cost) {
    return { ok: false, reason: 'insufficient_tokens' };
  }

  const pool = getCollectiblesByPack(packId);
  if (pool.length === 0) {
    return { ok: false, reason: 'empty_pack' };
  }

  const isFirstPull = Object.keys(state.vault).length <= 1;
  const rarity = drawRarity(rng());
  const byRarity = pool.filter((item) => item.rarity === rarity);
  const unownedByRarity = byRarity.filter((item) => (state.vault[item.id] ?? 0) === 0);
  const unownedInPack = pool.filter((item) => (state.vault[item.id] ?? 0) === 0);

  const pickPool = isFirstPull
    ? unownedByRarity.length > 0
      ? unownedByRarity
      : unownedInPack.length > 0
        ? unownedInPack
        : pool
    : byRarity.length > 0
      ? byRarity
      : pool;
  const pickIdx = Math.min(
    pickPool.length - 1,
    Math.floor(Math.max(0, Math.min(0.999999, rng())) * pickPool.length),
  );
  const collectible = pickPool[pickIdx];

  const prevCount = state.vault[collectible.id] ?? 0;
  const newCount = prevCount + 1;

  return {
    ok: true,
    collectible,
    isNew: prevCount === 0,
    newCount,
    state: {
      ...state,
      tokens: state.tokens - pack.cost,
      vault: {
        ...state.vault,
        [collectible.id]: newCount,
      },
    },
  };
}

export type SellDuplicateResult =
  | { ok: true; state: PlayerState; tokensRefunded: number }
  | { ok: false; reason: 'not_found' | 'cannot_sell_last_copy' };

export function sellDuplicateCollectible(
  state: PlayerState,
  collectibleId: string,
): SellDuplicateResult {
  const collectible = getCollectibleById(collectibleId);
  if (!collectible) {
    return { ok: false, reason: 'not_found' };
  }

  const count = state.vault[collectibleId] ?? 0;
  if (count <= 1) {
    return { ok: false, reason: 'cannot_sell_last_copy' };
  }

  const tokensRefunded = RARITY_CONFIGS[collectible.rarity].resaleTokens;
  return {
    ok: true,
    tokensRefunded,
    state: {
      ...state,
      tokens: state.tokens + tokensRefunded,
      vault: {
        ...state.vault,
        [collectibleId]: count - 1,
      },
    },
  };
}

export type CraftShinyResult =
  | { ok: true; state: PlayerState; collectible: Collectible }
  | { ok: false; reason: 'not_found' | 'already_shiny' | 'insufficient_copies' };

/**
 * 3-to-1 Shiny Foil crafting: requires at least 3 copies in Vault,
 * consumes 2 extra copies (leaving >= 1 copy so ownership/avatar stays intact)
 * and permanently unlocks the Shiny Foil version.
 */
export function craftShinyCollectible(
  state: PlayerState,
  collectibleId: string,
): CraftShinyResult {
  const collectible = getCollectibleById(collectibleId);
  if (!collectible) {
    return { ok: false, reason: 'not_found' };
  }
  if (state.shinyVault?.[collectibleId]) {
    return { ok: false, reason: 'already_shiny' };
  }
  const count = state.vault[collectibleId] ?? 0;
  if (count < SHINY_CRAFT_COPIES_REQUIRED) {
    return { ok: false, reason: 'insufficient_copies' };
  }

  return {
    ok: true,
    collectible,
    state: {
      ...state,
      vault: {
        ...state.vault,
        [collectibleId]: count - (SHINY_CRAFT_COPIES_REQUIRED - 1),
      },
      shinyVault: {
        ...state.shinyVault,
        [collectibleId]: true,
      },
    },
  };
}

export function equipCollectibleAvatar(
  state: PlayerState,
  collectibleId: string,
): PlayerState {
  if ((state.vault[collectibleId] ?? 0) < 1) {
    return state;
  }
  return {
    ...state,
    equippedCollectibleId: collectibleId,
  };
}

function getPreviousDateKey(dateKey: string): string {
  const parts = dateKey.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return '';
  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
  dt.setDate(dt.getDate() - 1);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function recordDailySubjectCompletion(
  state: PlayerState,
  subjectId: 'english' | 'math' | 'chinese',
  todayKey: string,
): PlayerState {
  const prevDaily = state.dailyQuest?.dateKey === todayKey
    ? state.dailyQuest
    : { dateKey: todayKey, completedSubjects: [], rewardClaimed: false };

  const completedSubjects = prevDaily.completedSubjects.includes(subjectId)
    ? prevDaily.completedSubjects
    : [...prevDaily.completedSubjects, subjectId];

  let nextStreak = state.streakDays ?? 0;
  if (state.lastActiveDate !== todayKey) {
    const yesterday = getPreviousDateKey(todayKey);
    nextStreak = state.lastActiveDate === yesterday ? nextStreak + 1 : 1;
  }

  return {
    ...state,
    dailyQuest: {
      ...prevDaily,
      completedSubjects,
    },
    streakDays: nextStreak,
    lastActiveDate: todayKey,
  };
}

export function claimDailyTriSubjectReward(
  state: PlayerState,
  todayKey: string,
): { ok: true; state: PlayerState; bonusTokens: number } | { ok: false; reason: 'incomplete' | 'already_claimed' } {
  const daily = state.dailyQuest;
  if (!daily || daily.dateKey !== todayKey) {
    return { ok: false, reason: 'incomplete' };
  }
  if (daily.rewardClaimed) {
    return { ok: false, reason: 'already_claimed' };
  }
  const hasAllThree =
    daily.completedSubjects.includes('english') &&
    daily.completedSubjects.includes('math') &&
    daily.completedSubjects.includes('chinese');
  if (!hasAllThree) {
    return { ok: false, reason: 'incomplete' };
  }

  const streakBonus = Math.min(15, Math.max(0, ((state.streakDays ?? 1) - 1) * 3));
  const bonusTokens = DAILY_TRI_SUBJECT_BONUS + streakBonus;

  return {
    ok: true,
    bonusTokens,
    state: {
      ...state,
      tokens: state.tokens + bonusTokens,
      dailyQuest: {
        ...daily,
        rewardClaimed: true,
      },
    },
  };
}

export function awardBlitzSessionRewards(
  state: PlayerState,
  subjectId: 'english' | 'math' | 'chinese',
  score: number,
  rawTokensEarned: number,
  todayKey: string,
): { state: PlayerState; tokensAwarded: number; remainingDailyCap: number } {
  const prevDaily =
    state.blitzDailyTokens?.dateKey === todayKey ? state.blitzDailyTokens.earned : 0;
  const remainingBefore = Math.max(0, BLITZ_DAILY_TOKEN_CAP - prevDaily);
  const safeEarned = Math.max(0, Math.floor(rawTokensEarned));
  const tokensAwarded = Math.min(remainingBefore, safeEarned);
  const prevBest = state.blitzHighScores?.[subjectId] ?? 0;

  return {
    tokensAwarded,
    remainingDailyCap: Math.max(0, remainingBefore - tokensAwarded),
    state: {
      ...state,
      tokens: state.tokens + tokensAwarded,
      blitzHighScores: {
        ...state.blitzHighScores,
        [subjectId]: Math.max(prevBest, Math.max(0, Math.floor(score))),
      },
      blitzDailyTokens: {
        dateKey: todayKey,
        earned: prevDaily + tokensAwarded,
      },
    },
  };
}

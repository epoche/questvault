import {
  COLLECTIBLES,
  getCollectibleById,
  getCollectiblesByPack,
  getPackById,
  RARITY_CONFIGS,
  RARITY_ORDER,
  STARTER_COLLECTIBLE_ID,
} from './packs';
import { getMasteryKey, isItemDueForReview } from './mastery';
import type { Collectible, PackId, PlayerState, Rarity, SubjectId } from './types';

export const STARTER_TOKENS = 25;
export const SHINY_CRAFT_COPIES_REQUIRED = 3;
export const FUSE_COPIES_REQUIRED = 5;
export const MAX_FAVORITE_COLLECTIBLES = 6;
export const DAILY_TRI_SUBJECT_BONUS = 30;
export const BLITZ_DAILY_TOKEN_CAP = 120;
export const ARCADE_DAILY_TOKEN_CAP = 150;
export const STATIC_REVIEW_MULTIPLIER = 0.5;
export const MATH_FULL_REWARD_RUNS_PER_DAY = 2;
export const MATH_DIMINISHED_MULTIPLIER = 0.3;
const MAX_COMBO_BONUS = 5;

export const STAR_DUST_MELT_VALUE: Record<Rarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 5,
  epic: 12,
  legendary: 25,
  chroma: 60,
};

export const STAR_DUST_WISH_COST: Record<Rarity, number> = {
  common: 10,
  uncommon: 15,
  rare: 25,
  epic: 50,
  legendary: 95,
  chroma: 180,
};

export const FUSE_NEXT_RARITY: Partial<Record<Rarity, Rarity>> = {
  common: 'uncommon',
  uncommon: 'rare',
  rare: 'epic',
  epic: 'legendary',
};

export function createInitialPlayerState(displayName = 'Player'): PlayerState {
  return {
    version: 1,
    displayName: displayName.trim() || 'Player',
    tokens: STARTER_TOKENS,
    starDust: 0,
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
    favoriteCollectibleIds: [STARTER_COLLECTIBLE_ID],
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
  const remainingBlitz = Math.max(0, BLITZ_DAILY_TOKEN_CAP - prevDaily);
  const remainingArcade = Math.max(
    0,
    ARCADE_DAILY_TOKEN_CAP - getTodayArcadeTokensEarned(state, todayKey),
  );
  const remainingBefore = Math.min(remainingBlitz, remainingArcade);
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

export function getTodayArcadeTokensEarned(state: PlayerState, todayKey: string): number {
  const blitz = state.blitzDailyTokens?.dateKey === todayKey ? state.blitzDailyTokens.earned : 0;
  const arcade = state.arcadeDailyTokens?.dateKey === todayKey ? state.arcadeDailyTokens.earned : 0;
  return blitz + arcade;
}

export function awardCafeSessionRewards(
  state: PlayerState,
  subjectId: 'english' | 'math' | 'chinese',
  coinsScore: number,
  rawTokensEarned: number,
  todayKey: string,
): { state: PlayerState; tokensAwarded: number; remainingDailyCap: number } {
  const earnedSoFar = getTodayArcadeTokensEarned(state, todayKey);
  const remainingBefore = Math.max(0, ARCADE_DAILY_TOKEN_CAP - earnedSoFar);
  const safeEarned = Math.max(0, Math.floor(rawTokensEarned));
  const tokensAwarded = Math.min(remainingBefore, safeEarned);
  const prevBest = state.cafeHighScores?.[subjectId] ?? 0;
  const prevArcade =
    state.arcadeDailyTokens?.dateKey === todayKey ? state.arcadeDailyTokens.earned : 0;

  return {
    tokensAwarded,
    remainingDailyCap: Math.max(0, remainingBefore - tokensAwarded),
    state: {
      ...state,
      tokens: state.tokens + tokensAwarded,
      cafeHighScores: {
        ...state.cafeHighScores,
        [subjectId]: Math.max(prevBest, Math.max(0, Math.floor(coinsScore))),
      },
      arcadeDailyTokens: {
        dateKey: todayKey,
        earned: prevArcade + tokensAwarded,
      },
    },
  };
}

export function awardFishingSessionRewards(
  state: PlayerState,
  subjectId: 'english' | 'math' | 'chinese',
  totalLbs: number,
  rawTokensEarned: number,
  todayKey: string,
): { state: PlayerState; tokensAwarded: number; remainingDailyCap: number } {
  const earnedSoFar = getTodayArcadeTokensEarned(state, todayKey);
  const remainingBefore = Math.max(0, ARCADE_DAILY_TOKEN_CAP - earnedSoFar);
  const safeEarned = Math.max(0, Math.floor(rawTokensEarned));
  const tokensAwarded = Math.min(remainingBefore, safeEarned);
  const prevBest = state.fishingHighScores?.[subjectId] ?? 0;
  const prevArcade =
    state.arcadeDailyTokens?.dateKey === todayKey ? state.arcadeDailyTokens.earned : 0;

  return {
    tokensAwarded,
    remainingDailyCap: Math.max(0, remainingBefore - tokensAwarded),
    state: {
      ...state,
      tokens: state.tokens + tokensAwarded,
      fishingHighScores: {
        ...state.fishingHighScores,
        [subjectId]: Math.max(prevBest, Math.max(0, Math.floor(totalLbs))),
      },
      arcadeDailyTokens: {
        dateKey: todayKey,
        earned: prevArcade + tokensAwarded,
      },
    },
  };
}

export function claimChapterSeriesChest(
  state: PlayerState,
  seriesId: string,
  requiredEpisodeIds: string[],
  bonusTokens = 40,
): { ok: true; state: PlayerState; bonusTokens: number } | { ok: false; reason: 'incomplete' | 'already_claimed' } {
  const claimed = state.claimedChapterSeriesIds ?? [];
  if (claimed.includes(seriesId)) {
    return { ok: false, reason: 'already_claimed' };
  }
  const completed = state.completedChapterEpisodeIds ?? [];
  const allDone =
    requiredEpisodeIds.length > 0 && requiredEpisodeIds.every((id) => completed.includes(id));
  if (!allDone) {
    return { ok: false, reason: 'incomplete' };
  }
  return {
    ok: true,
    bonusTokens,
    state: {
      ...state,
      tokens: state.tokens + bonusTokens,
      claimedChapterSeriesIds: [...claimed, seriesId],
    },
  };
}

export function getExtraDuplicateCountByRarity(state: PlayerState, rarity: Rarity): number {
  let extras = 0;
  for (const item of COLLECTIBLES) {
    if (item.rarity !== rarity) continue;
    const count = state.vault[item.id] ?? 0;
    if (count > 1) {
      extras += count - 1;
    }
  }
  return extras;
}

export type MeltStarDustResult =
  | { ok: true; state: PlayerState; dustGained: number; collectible: Collectible }
  | { ok: false; reason: 'not_found' | 'cannot_melt_last_copy' };

/**
 * Melts 1 extra duplicate copy into Star Dust (always preserving >= 1 copy in Vault).
 */
export function meltDuplicateForStarDust(
  state: PlayerState,
  collectibleId: string,
): MeltStarDustResult {
  const collectible = getCollectibleById(collectibleId);
  if (!collectible) {
    return { ok: false, reason: 'not_found' };
  }
  const count = state.vault[collectibleId] ?? 0;
  if (count <= 1) {
    return { ok: false, reason: 'cannot_melt_last_copy' };
  }
  const dustGained = STAR_DUST_MELT_VALUE[collectible.rarity];
  return {
    ok: true,
    dustGained,
    collectible,
    state: {
      ...state,
      starDust: (state.starDust ?? 0) + dustGained,
      vault: {
        ...state.vault,
        [collectibleId]: count - 1,
      },
    },
  };
}

export type WishUnlockResult =
  | { ok: true; state: PlayerState; collectible: Collectible; dustSpent: number }
  | { ok: false; reason: 'not_found' | 'already_owned' | 'insufficient_dust' };

/**
 * Star Dust Wish Pool pity system: spend Star Dust to directly unlock ANY unowned
 * collectible (including Chroma!).
 */
export function wishUnlockWithStarDust(
  state: PlayerState,
  collectibleId: string,
): WishUnlockResult {
  const collectible = getCollectibleById(collectibleId);
  if (!collectible) {
    return { ok: false, reason: 'not_found' };
  }
  if ((state.vault[collectibleId] ?? 0) > 0) {
    return { ok: false, reason: 'already_owned' };
  }
  const cost = STAR_DUST_WISH_COST[collectible.rarity];
  const currentDust = state.starDust ?? 0;
  if (currentDust < cost) {
    return { ok: false, reason: 'insufficient_dust' };
  }
  return {
    ok: true,
    collectible,
    dustSpent: cost,
    state: {
      ...state,
      starDust: currentDust - cost,
      vault: {
        ...state.vault,
        [collectibleId]: 1,
      },
    },
  };
}

export type FuseFiveResult =
  | {
      ok: true;
      state: PlayerState;
      awarded: Collectible;
      isNew: boolean;
      targetRarity: Rarity;
    }
  | { ok: false; reason: 'unsupported_rarity' | 'insufficient_duplicates' | 'empty_target_pool' };

/**
 * 5-to-1 Same-Rarity Fuse Upgrader: fuses any 5 extra duplicate copies of `sourceRarity`
 * (always keeping >= 1 copy of every owned card!) into 1 random collectible of the next
 * higher rarity (preferring unowned collectibles first!).
 */
export function fuseFiveDuplicatesUp(
  state: PlayerState,
  sourceRarity: Rarity,
  rng: () => number = Math.random,
): FuseFiveResult {
  const targetRarity = FUSE_NEXT_RARITY[sourceRarity];
  if (!targetRarity) {
    return { ok: false, reason: 'unsupported_rarity' };
  }

  const extraCount = getExtraDuplicateCountByRarity(state, sourceRarity);
  if (extraCount < FUSE_COPIES_REQUIRED) {
    return { ok: false, reason: 'insufficient_duplicates' };
  }

  const targetAll = COLLECTIBLES.filter((c) => c.rarity === targetRarity);
  if (targetAll.length === 0) {
    return { ok: false, reason: 'empty_target_pool' };
  }

  // Deduct 5 extra copies from cards with the highest surplus first, never dropping any card below 1
  const nextVault: Record<string, number> = { ...state.vault };
  const surplusEntries = COLLECTIBLES.filter(
    (c) => c.rarity === sourceRarity && (nextVault[c.id] ?? 0) > 1,
  )
    .map((c) => ({ id: c.id, extra: (nextVault[c.id] ?? 0) - 1 }))
    .sort((a, b) => b.extra - a.extra || a.id.localeCompare(b.id));

  let remainingToConsume = FUSE_COPIES_REQUIRED;
  for (const entry of surplusEntries) {
    if (remainingToConsume <= 0) break;
    const take = Math.min(entry.extra, remainingToConsume);
    nextVault[entry.id] = (nextVault[entry.id] ?? 1) - take;
    remainingToConsume -= take;
  }

  const unownedTargets = targetAll.filter((c) => (nextVault[c.id] ?? 0) === 0);
  const pickPool = unownedTargets.length > 0 ? unownedTargets : targetAll;
  const pickIdx = Math.min(
    pickPool.length - 1,
    Math.floor(Math.max(0, Math.min(0.999999, rng())) * pickPool.length),
  );
  const awarded = pickPool[pickIdx];
  const prevCount = nextVault[awarded.id] ?? 0;
  nextVault[awarded.id] = prevCount + 1;

  return {
    ok: true,
    awarded,
    isNew: prevCount === 0,
    targetRarity,
    state: {
      ...state,
      vault: nextVault,
    },
  };
}

export type ToggleFavoriteResult =
  | { ok: true; state: PlayerState; pinned: boolean }
  | { ok: false; reason: 'not_owned' | 'shelf_full' };

/**
 * Vault 6-Slot Favorite Showcase Shelf: pins/unpins up to 6 owned collectibles.
 */
export function toggleFavoriteCollectible(
  state: PlayerState,
  collectibleId: string,
): ToggleFavoriteResult {
  const prev = state.favoriteCollectibleIds ?? [];
  if (prev.includes(collectibleId)) {
    return {
      ok: true,
      pinned: false,
      state: {
        ...state,
        favoriteCollectibleIds: prev.filter((id) => id !== collectibleId),
      },
    };
  }
  if ((state.vault[collectibleId] ?? 0) < 1) {
    return { ok: false, reason: 'not_owned' };
  }
  if (prev.length >= MAX_FAVORITE_COLLECTIBLES) {
    return { ok: false, reason: 'shelf_full' };
  }
  return {
    ok: true,
    pinned: true,
    state: {
      ...state,
      favoriteCollectibleIds: [...prev, collectibleId],
    },
  };
}

export type QuestRewardKind = 'static' | 'math';

export type QuestRewardTier =
  | 'full-new'
  | 'full-special'
  | 'full-srs-due'
  | 'full-math'
  | 'review-50'
  | 'math-diminished'
  | 'practice-0';

export interface QuestRewardPolicy {
  multiplier: number;
  tier: QuestRewardTier;
  todayCount: number;
  isAlreadyCompleted: boolean;
  dueWordCount: number;
  badgeLabel: string;
  zhBadgeLabel: string;
}

const EXEMPT_FULL_REWARD_IDS = new Set([
  'en-srs-review',
  'zh-srs-review',
  'math-srs-review',
  'en-tricky-rematch',
  'zh-tricky-rematch',
  'math-tricky-rematch',
  'en-weekly-parent-review',
  'zh-weekly-parent-review',
]);

export function isExemptFullRewardQuest(questSetId: string): boolean {
  return EXEMPT_FULL_REWARD_IDS.has(questSetId) || questSetId.startsWith('custom-');
}

export function getTodayQuestClaimCount(
  state: PlayerState,
  questSetId: string,
  todayKey: string,
): number {
  const claims = state.dailyQuestClaims;
  if (!claims || claims.dateKey !== todayKey) return 0;
  return claims.counts[questSetId] ?? 0;
}

export interface QuestRewardPolicyInput {
  questSetId: string;
  kind: QuestRewardKind;
  subjectId: SubjectId;
  todayKey: string;
  words?: string[];
  completedIds?: string[];
  nowIso?: string;
}

/**
 * Plan A anti-farming reward policy:
 * - Special review / custom quests (SRS Warm-Up, Boss Rematch, Weekly Parent Review, Custom Sets): always 100%.
 * - Dynamic Math units: up to 2 full-reward runs per unit per day (100%), 3rd+ run same day = 30%.
 * - Static quests (EN/ZH vocab sets, Reading Quests, Radicals, Chapter Episodes):
 *   - Already rewarded today (todayCount >= 1) => 0% Practice Mode (prevents same-day farming).
 *   - First time ever (!isAlreadyCompleted) => 100% Full Reward.
 *   - Previously completed on an earlier day:
 *     - If any word/char in this quest is currently SRS-due => 100% Full SRS Review Reward.
 *     - Otherwise => 50% Review Reward.
 */
export function getQuestRewardPolicy(
  state: PlayerState,
  input: QuestRewardPolicyInput,
): QuestRewardPolicy {
  const { questSetId, kind, subjectId, todayKey, words, nowIso } = input;
  const todayCount = getTodayQuestClaimCount(state, questSetId, todayKey);
  const completedPool = input.completedIds ?? state.completedQuestSetIds;
  const isAlreadyCompleted = completedPool.includes(questSetId);

  if (isExemptFullRewardQuest(questSetId)) {
    return {
      multiplier: 1,
      tier: 'full-special',
      todayCount,
      isAlreadyCompleted,
      dueWordCount: 0,
      badgeLabel: '100% Full Reward',
      zhBadgeLabel: '100% 全額獎勵',
    };
  }

  if (kind === 'math') {
    if (todayCount < MATH_FULL_REWARD_RUNS_PER_DAY) {
      return {
        multiplier: 1,
        tier: 'full-math',
        todayCount,
        isAlreadyCompleted,
        dueWordCount: 0,
        badgeLabel: '100% Dynamic Math',
        zhBadgeLabel: '100% 動態出題獎勵',
      };
    }
    return {
      multiplier: MATH_DIMINISHED_MULTIPLIER,
      tier: 'math-diminished',
      todayCount,
      isAlreadyCompleted,
      dueWordCount: 0,
      badgeLabel: '30% Extra Practice',
      zhBadgeLabel: '今日第 3+ 次 · 30% 練習獎勵',
    };
  }

  // Static quests: same-day repeat => 0% pure practice
  if (todayCount >= 1) {
    return {
      multiplier: 0,
      tier: 'practice-0',
      todayCount,
      isAlreadyCompleted,
      dueWordCount: 0,
      badgeLabel: 'Claimed Today · Practice (+0)',
      zhBadgeLabel: '今日已領獎 · 純練習 (+0)',
    };
  }

  if (!isAlreadyCompleted) {
    return {
      multiplier: 1,
      tier: 'full-new',
      todayCount,
      isAlreadyCompleted: false,
      dueWordCount: 0,
      badgeLabel: '100% New Quest',
      zhBadgeLabel: '100% 新關卡首通',
    };
  }

  // Completed previously on an earlier day: reward 100% if SRS review is due!
  let dueWordCount = 0;
  if (words && words.length > 0) {
    const checkIso = nowIso ?? new Date().toISOString();
    for (const w of words) {
      const rec = state.wordMastery[getMasteryKey(w, subjectId)];
      if (rec && isItemDueForReview(rec, checkIso)) {
        dueWordCount += 1;
      }
    }
  }

  if (dueWordCount > 0) {
    return {
      multiplier: 1,
      tier: 'full-srs-due',
      todayCount,
      isAlreadyCompleted: true,
      dueWordCount,
      badgeLabel: 'SRS Review Due · 100%',
      zhBadgeLabel: '遺忘曲線到期複習 · 100%',
    };
  }

  return {
    multiplier: STATIC_REVIEW_MULTIPLIER,
    tier: 'review-50',
    todayCount,
    isAlreadyCompleted: true,
    dueWordCount: 0,
    badgeLabel: 'Review Mode · 50%',
    zhBadgeLabel: '複習模式 · 50% 代幣',
  };
}

export function applyQuestRewardMultiplier(rawTokens: number, multiplier: number): number {
  if (rawTokens <= 0 || multiplier <= 0) return 0;
  if (multiplier >= 1) return Math.round(rawTokens);
  return Math.max(1, Math.round(rawTokens * multiplier));
}

export function recordDailyQuestClaim(
  state: PlayerState,
  questSetId: string,
  todayKey: string,
): PlayerState {
  const prevCounts =
    state.dailyQuestClaims?.dateKey === todayKey ? state.dailyQuestClaims.counts : {};
  return {
    ...state,
    dailyQuestClaims: {
      dateKey: todayKey,
      counts: {
        ...prevCounts,
        [questSetId]: (prevCounts[questSetId] ?? 0) + 1,
      },
    },
  };
}

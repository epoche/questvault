import { hashParentPin, ISO_WEEK_KEY_RE, PARENT_PIN_HASH_RE } from './analytics';
import { createInitialPlayerState } from './economy';
import { getCollectibleById, STARTER_COLLECTIBLE_ID } from './packs';
import type { PlayerState } from './types';

export const STORAGE_KEY = 'questvault.player.v1';

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface PlayerRepository {
  load(): PlayerState;
  save(state: PlayerState): void;
}

function sanitizePlayerState(raw: unknown): PlayerState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (obj.version !== 1 || typeof obj.tokens !== 'number' || !obj.vault || typeof obj.vault !== 'object') {
    return null;
  }

  const base = createInitialPlayerState(
    typeof obj.displayName === 'string' ? obj.displayName : 'Player',
  );

  const sanitizedVault: Record<string, number> = { [STARTER_COLLECTIBLE_ID]: 1 };
  for (const [id, count] of Object.entries(obj.vault as Record<string, unknown>)) {
    if (typeof count === 'number' && count > 0 && Number.isFinite(count) && getCollectibleById(id)) {
      sanitizedVault[id] = Math.floor(count);
    }
  }

  const equipped =
    typeof obj.equippedCollectibleId === 'string' && (sanitizedVault[obj.equippedCollectibleId] ?? 0) > 0
      ? obj.equippedCollectibleId
      : STARTER_COLLECTIBLE_ID;

  const safeTokens =
    Number.isFinite(obj.tokens) && obj.tokens >= 0 ? Math.floor(obj.tokens) : base.tokens;

  const isRecord = (v: unknown): v is Record<string, unknown> => Boolean(v && typeof v === 'object');
  const rawTier = obj.activeTier;
  const activeTier =
    rawTier === 1 || rawTier === 2 || rawTier === 3 || rawTier === 4 ? rawTier : base.activeTier;

  const sanitizedMastery: PlayerState['wordMastery'] = {};
  if (isRecord(obj.wordMastery)) {
    for (const [k, v] of Object.entries(obj.wordMastery)) {
      if (
        isRecord(v) &&
        typeof v.word === 'string' &&
        typeof v.seen === 'number' &&
        typeof v.correctFirstTry === 'number' &&
        typeof v.missed === 'number'
      ) {
        const recTier = v.tier === 1 || v.tier === 2 || v.tier === 3 || v.tier === 4 ? v.tier : 2;
        const recSubject =
          v.subjectId === 'english' || v.subjectId === 'math' || v.subjectId === 'chinese'
            ? v.subjectId
            : 'english';
        sanitizedMastery[k] = {
          word: v.word,
          subjectId: recSubject,
          tier: recTier,
          seen: Math.max(0, Math.floor(v.seen)),
          correctFirstTry: Math.max(0, Math.floor(v.correctFirstTry)),
          missed: Math.max(0, Math.floor(v.missed)),
          usedInWriting: typeof v.usedInWriting === 'number' ? Math.max(0, Math.floor(v.usedInWriting)) : 0,
          lastSeenAt: typeof v.lastSeenAt === 'string' ? v.lastSeenAt : new Date().toISOString(),
          ...(typeof v.lastMissedAt === 'string' ? { lastMissedAt: v.lastMissedAt } : {}),
          ...(typeof v.srsLevel === 'number' && Number.isFinite(v.srsLevel)
            ? { srsLevel: Math.max(0, Math.min(4, Math.floor(v.srsLevel))) }
            : {}),
          ...(typeof v.nextReviewAt === 'string' ? { nextReviewAt: v.nextReviewAt } : {}),
        };
      }
    }
  }

  const sanitizedShinyVault: Record<string, boolean> = {};
  if (isRecord(obj.shinyVault)) {
    for (const [id, isShiny] of Object.entries(obj.shinyVault)) {
      if (isShiny === true && (sanitizedVault[id] ?? 0) > 0 && getCollectibleById(id)) {
        sanitizedShinyVault[id] = true;
      }
    }
  }

  let sanitizedDailyQuest: PlayerState['dailyQuest'] = undefined;
  if (isRecord(obj.dailyQuest) && typeof obj.dailyQuest.dateKey === 'string') {
    const rawSubs = Array.isArray(obj.dailyQuest.completedSubjects)
      ? obj.dailyQuest.completedSubjects.filter(
          (s): s is 'english' | 'math' | 'chinese' =>
            s === 'english' || s === 'math' || s === 'chinese',
        )
      : [];
    sanitizedDailyQuest = {
      dateKey: obj.dailyQuest.dateKey,
      completedSubjects: Array.from(new Set(rawSubs)),
      rewardClaimed: Boolean(obj.dailyQuest.rewardClaimed),
    };
  }

  const sanitizedBlitzHighScores: Partial<Record<'english' | 'math' | 'chinese', number>> = {};
  if (isRecord(obj.blitzHighScores)) {
    for (const subj of ['english', 'math', 'chinese'] as const) {
      const sc = obj.blitzHighScores[subj];
      if (typeof sc === 'number' && Number.isFinite(sc) && sc >= 0) {
        sanitizedBlitzHighScores[subj] = Math.floor(sc);
      }
    }
  }

  let sanitizedBlitzDailyTokens: PlayerState['blitzDailyTokens'] = undefined;
  if (
    isRecord(obj.blitzDailyTokens) &&
    typeof obj.blitzDailyTokens.dateKey === 'string' &&
    typeof obj.blitzDailyTokens.earned === 'number' &&
    Number.isFinite(obj.blitzDailyTokens.earned)
  ) {
    sanitizedBlitzDailyTokens = {
      dateKey: obj.blitzDailyTokens.dateKey,
      earned: Math.max(0, Math.floor(obj.blitzDailyTokens.earned)),
    };
  }

  const sanitizedCafeHighScores: Partial<Record<'english' | 'math' | 'chinese', number>> = {};
  if (isRecord(obj.cafeHighScores)) {
    for (const subj of ['english', 'math', 'chinese'] as const) {
      const sc = obj.cafeHighScores[subj];
      if (typeof sc === 'number' && Number.isFinite(sc) && sc >= 0) {
        sanitizedCafeHighScores[subj] = Math.floor(sc);
      }
    }
  }

  const sanitizedFishingHighScores: Partial<Record<'english' | 'math' | 'chinese', number>> = {};
  if (isRecord(obj.fishingHighScores)) {
    for (const subj of ['english', 'math', 'chinese'] as const) {
      const sc = obj.fishingHighScores[subj];
      if (typeof sc === 'number' && Number.isFinite(sc) && sc >= 0) {
        sanitizedFishingHighScores[subj] = Math.floor(sc);
      }
    }
  }

  const sanitizedBossHighScores: Partial<Record<'english' | 'math' | 'chinese', number>> = {};
  if (isRecord(obj.bossHighScores)) {
    for (const subj of ['english', 'math', 'chinese'] as const) {
      const sc = obj.bossHighScores[subj];
      if (typeof sc === 'number' && Number.isFinite(sc) && sc >= 0) {
        sanitizedBossHighScores[subj] = Math.floor(sc);
      }
    }
  }

  let sanitizedArcadeDailyTokens: PlayerState['arcadeDailyTokens'] = undefined;
  if (
    isRecord(obj.arcadeDailyTokens) &&
    typeof obj.arcadeDailyTokens.dateKey === 'string' &&
    typeof obj.arcadeDailyTokens.earned === 'number' &&
    Number.isFinite(obj.arcadeDailyTokens.earned)
  ) {
    sanitizedArcadeDailyTokens = {
      dateKey: obj.arcadeDailyTokens.dateKey,
      earned: Math.max(0, Math.floor(obj.arcadeDailyTokens.earned)),
    };
  }

  let sanitizedDailyQuestClaims: PlayerState['dailyQuestClaims'] = undefined;
  if (
    isRecord(obj.dailyQuestClaims) &&
    typeof obj.dailyQuestClaims.dateKey === 'string' &&
    isRecord(obj.dailyQuestClaims.counts)
  ) {
    const counts: Record<string, number> = {};
    for (const [questId, rawCount] of Object.entries(obj.dailyQuestClaims.counts)) {
      if (typeof rawCount === 'number' && Number.isFinite(rawCount) && rawCount > 0) {
        counts[questId] = Math.floor(rawCount);
      }
    }
    sanitizedDailyQuestClaims = {
      dateKey: obj.dailyQuestClaims.dateKey,
      counts,
    };
  }

  const activeSubjectId =
    obj.activeSubjectId === 'english' ||
    obj.activeSubjectId === 'math' ||
    obj.activeSubjectId === 'chinese'
      ? obj.activeSubjectId
      : 'english';

  const sanitizeTier = (val: unknown, fallback: 1 | 2 | 3 | 4): 1 | 2 | 3 | 4 =>
    val === 1 || val === 2 || val === 3 || val === 4 ? val : fallback;

  const rawSubjTiers = isRecord(obj.subjectTiers) ? obj.subjectTiers : {};
  const subjectTiers = {
    english: sanitizeTier(rawSubjTiers.english, activeTier),
    math: sanitizeTier(rawSubjTiers.math, 2),
    chinese: sanitizeTier(rawSubjTiers.chinese, 2),
  };

  const rawSubjPlacement = isRecord(obj.subjectPlacementCompleted)
    ? obj.subjectPlacementCompleted
    : {};
  const subjectPlacementCompleted = {
    english:
      typeof rawSubjPlacement.english === 'boolean'
        ? rawSubjPlacement.english
        : Boolean(obj.placementCompleted),
    math: Boolean(rawSubjPlacement.math),
    chinese: Boolean(rawSubjPlacement.chinese),
  };

  const rawSubjBoss = isRecord(obj.subjectBossRematchDate) ? obj.subjectBossRematchDate : {};
  const subjectBossRematchDate: Partial<Record<'english' | 'math' | 'chinese', string>> = {};
  if (typeof rawSubjBoss.english === 'string') subjectBossRematchDate.english = rawSubjBoss.english;
  else if (typeof obj.lastBossRematchDate === 'string') {
    subjectBossRematchDate.english = obj.lastBossRematchDate;
  }
  if (typeof rawSubjBoss.math === 'string') subjectBossRematchDate.math = rawSubjBoss.math;
  if (typeof rawSubjBoss.chinese === 'string') subjectBossRematchDate.chinese = rawSubjBoss.chinese;

  const safeStarDust =
    typeof obj.starDust === 'number' && Number.isFinite(obj.starDust) && obj.starDust >= 0
      ? Math.floor(obj.starDust)
      : 0;

  const sanitizedFavorites: string[] = Array.isArray(obj.favoriteCollectibleIds)
    ? Array.from(
        new Set(
          obj.favoriteCollectibleIds.filter(
            (id): id is string =>
              typeof id === 'string' && (sanitizedVault[id] ?? 0) > 0 && Boolean(getCollectibleById(id)),
          ),
        ),
      ).slice(0, 6)
    : [];

  let sanitizedCritterRoom: PlayerState['critterRoom'] = undefined;
  if (isRecord(obj.critterRoom)) {
    const validThemes = new Set([
      'strawberry-cafe',
      'starlight-attic',
      'boba-beach',
      'fairy-treehouse',
    ]);
    const themeId =
      typeof obj.critterRoom.themeId === 'string' && validThemes.has(obj.critterRoom.themeId)
        ? (obj.critterRoom.themeId as NonNullable<PlayerState['critterRoom']>['themeId'])
        : 'strawberry-cafe';
    const rawSlots = Array.isArray(obj.critterRoom.slots) ? obj.critterRoom.slots : [];
    const usedIds = new Set<string>();
    const slots: (string | null)[] = Array.from({ length: 8 }, (_, idx) => {
      const val = rawSlots[idx];
      if (
        typeof val === 'string' &&
        !usedIds.has(val) &&
        (sanitizedVault[val] ?? 0) > 0 &&
        Boolean(getCollectibleById(val))
      ) {
        usedIds.add(val);
        return val;
      }
      return null;
    });
    sanitizedCritterRoom = { themeId, slots };
  }

  return {
    ...base,
    tokens: safeTokens,
    starDust: safeStarDust,
    activeSubjectId,
    activeTier: subjectTiers.english,
    subjectTiers,
    placementCompleted: subjectPlacementCompleted.english,
    subjectPlacementCompleted,
    equippedCollectibleId: equipped,
    vault: sanitizedVault,
    shinyVault: sanitizedShinyVault,
    favoriteCollectibleIds: sanitizedFavorites,
    ...(sanitizedCritterRoom ? { critterRoom: sanitizedCritterRoom } : {}),
    wordMastery: sanitizedMastery,
    completedQuestSetIds: Array.isArray(obj.completedQuestSetIds)
      ? obj.completedQuestSetIds.filter((id): id is string => typeof id === 'string')
      : [],
    completedRadicalIds: Array.isArray(obj.completedRadicalIds)
      ? Array.from(
          new Set(obj.completedRadicalIds.filter((id): id is string => typeof id === 'string')),
        )
      : [],
    completedMeasureIds: Array.isArray(obj.completedMeasureIds)
      ? Array.from(
          new Set(obj.completedMeasureIds.filter((id): id is string => typeof id === 'string')),
        )
      : [],
    completedEnglishRootIds: Array.isArray(obj.completedEnglishRootIds)
      ? Array.from(
          new Set(
            obj.completedEnglishRootIds.filter((id): id is string => typeof id === 'string'),
          ),
        )
      : [],
    completedGrammarIds: Array.isArray(obj.completedGrammarIds)
      ? Array.from(
          new Set(obj.completedGrammarIds.filter((id): id is string => typeof id === 'string')),
        )
      : [],
    completedSpellingIds: Array.isArray(obj.completedSpellingIds)
      ? Array.from(
          new Set(obj.completedSpellingIds.filter((id): id is string => typeof id === 'string')),
        )
      : [],
    completedEnglishChapterIds: Array.isArray(obj.completedEnglishChapterIds)
      ? Array.from(
          new Set(
            obj.completedEnglishChapterIds.filter((id): id is string => typeof id === 'string'),
          ),
        )
      : [],
    claimedEnglishChapterSeriesIds: Array.isArray(obj.claimedEnglishChapterSeriesIds)
      ? Array.from(
          new Set(
            obj.claimedEnglishChapterSeriesIds.filter(
              (id): id is string => typeof id === 'string',
            ),
          ),
        )
      : [],
    completedChapterEpisodeIds: Array.isArray(obj.completedChapterEpisodeIds)
      ? Array.from(
          new Set(
            obj.completedChapterEpisodeIds.filter((id): id is string => typeof id === 'string'),
          ),
        )
      : [],
    claimedChapterSeriesIds: Array.isArray(obj.claimedChapterSeriesIds)
      ? Array.from(
          new Set(
            obj.claimedChapterSeriesIds.filter((id): id is string => typeof id === 'string'),
          ),
        )
      : [],
    claimedAchievementIds: Array.isArray(obj.claimedAchievementIds)
      ? Array.from(
          new Set(obj.claimedAchievementIds.filter((id): id is string => typeof id === 'string')),
        )
      : [],
    runHistory: Array.isArray(obj.runHistory)
      ? (obj.runHistory.filter(
          (r) => isRecord(r) && typeof r.id === 'string' && typeof r.tokensEarned === 'number',
        ) as PlayerState['runHistory'])
      : [],
    writingLog: Array.isArray(obj.writingLog)
      ? (obj.writingLog.filter(
          (w) => isRecord(w) && typeof w.id === 'string' && typeof w.sentence === 'string',
        ) as PlayerState['writingLog'])
      : [],
    customWordSets: Array.isArray(obj.customWordSets)
      ? (obj.customWordSets.filter(
          (c) =>
            isRecord(c) &&
            typeof c.id === 'string' &&
            typeof c.title === 'string' &&
            Array.isArray(c.words),
        ) as PlayerState['customWordSets'])
      : [],
    ...(typeof subjectBossRematchDate.english === 'string'
      ? { lastBossRematchDate: subjectBossRematchDate.english }
      : {}),
    subjectBossRematchDate,
    ...(sanitizedDailyQuest ? { dailyQuest: sanitizedDailyQuest } : {}),
    ...(sanitizedDailyQuestClaims ? { dailyQuestClaims: sanitizedDailyQuestClaims } : {}),
    streakDays:
      typeof obj.streakDays === 'number' && Number.isFinite(obj.streakDays) && obj.streakDays >= 0
        ? Math.floor(obj.streakDays)
        : 0,
    ...(typeof obj.lastActiveDate === 'string' ? { lastActiveDate: obj.lastActiveDate } : {}),
    blitzHighScores: sanitizedBlitzHighScores,
    ...(sanitizedBlitzDailyTokens ? { blitzDailyTokens: sanitizedBlitzDailyTokens } : {}),
    cafeHighScores: sanitizedCafeHighScores,
    fishingHighScores: sanitizedFishingHighScores,
    bossHighScores: sanitizedBossHighScores,
    ...(sanitizedArcadeDailyTokens ? { arcadeDailyTokens: sanitizedArcadeDailyTokens } : {}),
    ...(() => {
      if (!obj.weeklyGoal || typeof obj.weeklyGoal !== 'object' || Array.isArray(obj.weeklyGoal)) {
        return {};
      }
      const wg = obj.weeklyGoal as Record<string, unknown>;
      const clampTarget = (v: unknown) =>
        typeof v === 'number' && Number.isFinite(v)
          ? Math.max(0, Math.min(14, Math.floor(v)))
          : 0;
      const rewardText =
        typeof wg.rewardText === 'string' ? wg.rewardText.trim().slice(0, 80) : '';
      const redeemedWeekKey =
        typeof wg.redeemedWeekKey === 'string' && ISO_WEEK_KEY_RE.test(wg.redeemedWeekKey)
          ? wg.redeemedWeekKey
          : undefined;
      return {
        weeklyGoal: {
          enTarget: clampTarget(wg.enTarget),
          zhTarget: clampTarget(wg.zhTarget),
          mathTarget: clampTarget(wg.mathTarget),
          rewardText,
          ...(redeemedWeekKey ? { redeemedWeekKey } : {}),
        },
      };
    })(),
    ...(typeof obj.lastBackupAt === 'string' && Number.isFinite(Date.parse(obj.lastBackupAt))
      ? { lastBackupAt: obj.lastBackupAt }
      : {}),
    ...(typeof obj.parentPinHash === 'string' && PARENT_PIN_HASH_RE.test(obj.parentPinHash)
      ? { parentPinHash: obj.parentPinHash }
      : typeof obj.parentPin === 'string' && /^\d{4}$/.test(obj.parentPin)
        ? { parentPinHash: hashParentPin(obj.parentPin) }
        : {}),
    showZhuyin: Boolean(obj.showZhuyin),
    muted: Boolean(obj.muted),
  };
}

export function exportPlayerStateJson(state: PlayerState): string {
  // Never include the parent PIN or PIN hash in portable JSON backups
  const { parentPinHash: _omittedPinHash, ...exportable } = state;
  void _omittedPinHash;
  return JSON.stringify(exportable, null, 2);
}

export function importPlayerStateJson(
  rawJson: string,
): { ok: true; state: PlayerState } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(rawJson);
    const state = sanitizePlayerState(parsed);
    if (!state) {
      return { ok: false, error: 'That file does not look like a valid QuestVault backup.' };
    }
    return { ok: true, state };
  } catch {
    return { ok: false, error: 'Could not read that JSON backup file.' };
  }
}

function resolveDefaultStorage(): KeyValueStorage | null {
  if (typeof window === 'undefined') return null;
  try {
    const ls = window.localStorage;
    if (!ls) return null;
    // Probe access in case iframe sandbox blocks storage reads/writes
    ls.getItem(STORAGE_KEY);
    return ls;
  } catch {
    return null;
  }
}

export function createLocalStorageRepository(
  storage?: KeyValueStorage | null,
): PlayerRepository {
  const resolvedStorage: KeyValueStorage | null =
    storage !== undefined ? storage : resolveDefaultStorage();
  let memoryFallback: PlayerState | null = null;

  return {
    load(): PlayerState {
      if (!resolvedStorage) return memoryFallback ?? createInitialPlayerState();
      try {
        const raw = resolvedStorage.getItem(STORAGE_KEY);
        if (!raw) return createInitialPlayerState();
        const imported = importPlayerStateJson(raw);
        return imported.ok ? imported.state : createInitialPlayerState();
      } catch {
        return memoryFallback ?? createInitialPlayerState();
      }
    },
    save(state: PlayerState): void {
      memoryFallback = state;
      if (!resolvedStorage) return;
      try {
        resolvedStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore storage quota or sandbox errors cleanly
      }
    },
  };
}

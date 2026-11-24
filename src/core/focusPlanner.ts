import type { FocusTrackId, PlayerState, SubjectId } from './types';
import { CHINESE_READING_QUESTS } from '../subjects/chinese/readingQuests';
import { BUILTIN_WORD_SETS } from '../subjects/english/wordSets';
import type { WordSet } from '../subjects/english/types';
import { ALL_LOGIC_MODULES } from '../subjects/logic/logicTypes';
import { BAR_MODEL_UNITS, type BarModelUnitMeta } from '../subjects/math/barModelEngine';
import { CLOCK_MEASURE_UNITS, type ClockMeasureUnitMeta } from '../subjects/math/clockMeasureEngine';
import type { ReadingQuestSet } from './readingTypes';

export const MAX_WEEKLY_FOCUS_TRACKS = 2;

export interface FocusTrackMeta {
  id: FocusTrackId;
  emoji: string;
  titleEn: string;
  titleZh: string;
  subtitleZh: string;
  accentHex: string;
  bgHex: string;
  primarySubject: SubjectId | 'logic';
}

export const FOCUS_TRACK_CATALOG: readonly FocusTrackMeta[] = [
  {
    id: 'clock-measure',
    emoji: '⏰',
    titleEn: 'Clock & Measure',
    titleZh: '時鐘＆度量衡',
    subtitleZh: '指針撥鐘、經過時間、直尺量杯與美制／公制換算',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    primarySubject: 'math',
  },
  {
    id: 'math-bar',
    emoji: '📊',
    titleEn: 'Math Bar Models',
    titleZh: '數學畫圖解題',
    subtitleZh: '新加坡數學兩步驟線段圖應用題',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    primarySubject: 'math',
  },
  {
    id: 'chinese-reading',
    emoji: '📖',
    titleEn: 'Chinese Reading',
    titleZh: '繁體中文閱讀',
    subtitleZh: '生活短篇故事閱讀理解＋注音開關',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    primarySubject: 'chinese',
  },
  {
    id: 'english-ela',
    emoji: '📘',
    titleEn: 'English ELA Vocab',
    titleZh: '英文讀寫核心字彙',
    subtitleZh: '小四核心字彙遷移例句＋造句寶箱',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    primarySubject: 'english',
  },
  {
    id: 'logic-spatial',
    emoji: '🧠',
    titleEn: 'Logic & Spatial',
    titleZh: '邏輯與空間思維',
    subtitleZh: '旋轉鏡像、3D 積木、天平代數與機器人積木',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    primarySubject: 'logic',
  },
] as const;

export const VALID_FOCUS_TRACK_IDS = new Set<string>(FOCUS_TRACK_CATALOG.map((t) => t.id));

export function sanitizeFocusTracks(raw: readonly unknown[] | undefined | null): FocusTrackId[] {
  if (!Array.isArray(raw)) return [];
  const out: FocusTrackId[] = [];
  for (const item of raw) {
    if (typeof item !== 'string' || !VALID_FOCUS_TRACK_IDS.has(item)) continue;
    const id = item as FocusTrackId;
    if (!out.includes(id)) {
      out.push(id);
      if (out.length >= MAX_WEEKLY_FOCUS_TRACKS) break;
    }
  }
  return out;
}

/**
 * Toggles a Weekly Focus track while strictly enforcing the max-2 limit.
 * Clicking a 3rd track replaces the oldest selection (sliding window of 2) for effortless parent UX.
 */
export function toggleFocusTrack(
  current: readonly FocusTrackId[] | undefined,
  trackId: FocusTrackId,
): FocusTrackId[] {
  const clean = sanitizeFocusTracks(current);
  if (!VALID_FOCUS_TRACK_IDS.has(trackId)) {
    return clean;
  }
  if (clean.includes(trackId)) {
    return clean.filter((id) => id !== trackId);
  }
  if (clean.length < MAX_WEEKLY_FOCUS_TRACKS) {
    return [...clean, trackId];
  }
  return [...clean.slice(1), trackId];
}

export type FocusRecommendationAction =
  | { kind: 'clock-measure'; unit: ClockMeasureUnitMeta }
  | { kind: 'bar-model'; unit: BarModelUnitMeta }
  | { kind: 'chinese-reading'; set: ReadingQuestSet }
  | { kind: 'english-word'; set: WordSet }
  | { kind: 'logic-lab' };

export interface FocusRecommendation {
  trackId: FocusTrackId;
  badgeEn: string;
  badgeZh: string;
  ctaTitleEn: string;
  ctaTitleZh: string;
  action: FocusRecommendationAction;
}

function lastPlayedTimestamp(player: PlayerState, questSetId: string): number {
  if (!Array.isArray(player.runHistory)) return -Infinity;
  let latest = -Infinity;
  for (const run of player.runHistory) {
    if (!run || typeof run !== 'object' || run.questSetId !== questSetId) continue;
    const ts = typeof run.completedAt === 'string' ? Date.parse(run.completedAt) : NaN;
    if (Number.isFinite(ts) && ts > latest) {
      latest = ts;
    }
  }
  return latest;
}

function pickLeastRecentlyPlayed<T extends { id: string }>(
  items: readonly T[],
  player: PlayerState,
): T {
  let best = items[0];
  let bestTs = lastPlayedTimestamp(player, best.id);
  for (let i = 1; i < items.length; i += 1) {
    const ts = lastPlayedTimestamp(player, items[i].id);
    if (ts < bestTs) {
      best = items[i];
      bestTs = ts;
    }
  }
  return best;
}

function buildRecommendationForTrack(
  player: PlayerState,
  trackId: FocusTrackId,
): FocusRecommendation {
  const badgeEn = '🎯 Weekly Focus';
  const badgeZh = '🎯 本週重點';

  switch (trackId) {
    case 'clock-measure': {
      const done = new Set(player.completedClockMeasureIds ?? []);
      const next =
        CLOCK_MEASURE_UNITS.find((u) => !done.has(u.id)) ??
        pickLeastRecentlyPlayed(CLOCK_MEASURE_UNITS, player);
      return {
        trackId,
        badgeEn,
        badgeZh,
        ctaTitleEn: `Play ${next.title}`,
        ctaTitleZh: `開始 ${next.zhTitle}`,
        action: { kind: 'clock-measure', unit: next },
      };
    }

    case 'math-bar': {
      const done = new Set(player.completedBarModelIds ?? []);
      const next =
        BAR_MODEL_UNITS.find((u) => !done.has(u.id)) ??
        pickLeastRecentlyPlayed(BAR_MODEL_UNITS, player);
      return {
        trackId,
        badgeEn,
        badgeZh,
        ctaTitleEn: `Play ${next.title}`,
        ctaTitleZh: `畫圖解題 · ${next.title}`,
        action: { kind: 'bar-model', unit: next },
      };
    }

    case 'chinese-reading': {
      const done = new Set(player.completedQuestSetIds ?? []);
      const zhTier = player.subjectTiers?.chinese ?? player.activeTier ?? 1;
      const tierPreferred = CHINESE_READING_QUESTS.filter((s) => s.tier === zhTier);
      const next =
        tierPreferred.find((s) => !done.has(s.id)) ??
        CHINESE_READING_QUESTS.find((s) => !done.has(s.id)) ??
        pickLeastRecentlyPlayed(CHINESE_READING_QUESTS, player);
      return {
        trackId,
        badgeEn,
        badgeZh,
        ctaTitleEn: `Read ${next.title}`,
        ctaTitleZh: `閱讀 ${next.title}`,
        action: { kind: 'chinese-reading', set: next },
      };
    }

    case 'english-ela': {
      const done = new Set(player.completedQuestSetIds ?? []);
      const enTier = player.subjectTiers?.english ?? player.activeTier ?? 1;
      const tierPreferred = BUILTIN_WORD_SETS.filter((s) => s.tier === enTier);
      const next =
        tierPreferred.find((s) => !done.has(s.id)) ??
        BUILTIN_WORD_SETS.find((s) => !done.has(s.id)) ??
        pickLeastRecentlyPlayed(BUILTIN_WORD_SETS, player);
      return {
        trackId,
        badgeEn,
        badgeZh,
        ctaTitleEn: `Play ${next.title}`,
        ctaTitleZh: `開始 ${next.title}`,
        action: { kind: 'english-word', set: next },
      };
    }

    case 'logic-spatial': {
      const done = new Set(player.completedLogicModuleIds ?? []);
      const nextMod = ALL_LOGIC_MODULES.find((m) => !done.has(m.id)) ?? ALL_LOGIC_MODULES[0];
      return {
        trackId,
        badgeEn,
        badgeZh,
        ctaTitleEn: `Logic Lab · ${nextMod.enTitle}`,
        ctaTitleZh: `邏輯館 · ${nextMod.zhTitle}`,
        action: { kind: 'logic-lab' },
      };
    }
  }
}

function trackMatchesSubject(trackId: FocusTrackId, subjectId: SubjectId): boolean {
  if (subjectId === 'math') return trackId === 'clock-measure' || trackId === 'math-bar';
  if (subjectId === 'chinese') return trackId === 'chinese-reading';
  if (subjectId === 'english') return trackId === 'english-ela';
  return false;
}

/**
 * Pure recommendation engine for HomeView's HeroStage primary CTA.
 * Returns null when no Weekly Focus tracks are enabled (preserving default subject flow).
 * When 1–2 focus tracks are enabled:
 * - Prefers a focus track matching the currently viewed subject tab if available;
 * - Otherwise picks the first configured focus track so the child can tap 1 button and start immediately.
 */
export function pickFocusRecommendation(
  player: PlayerState,
  activeSubjectId: SubjectId,
): FocusRecommendation | null {
  const tracks = sanitizeFocusTracks(player.weeklyFocusTracks);
  if (tracks.length === 0) return null;

  const matched = tracks.find((t) => trackMatchesSubject(t, activeSubjectId));
  const chosenTrack = matched ?? tracks[0];
  return buildRecommendationForTrack(player, chosenTrack);
}

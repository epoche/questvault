import type {
  DifficultyTier,
  PlayerState,
  SubjectId,
  WordMasteryRecord,
} from './types';
import { BUILTIN_CHAPTER_SERIES, isSeriesFullyCompleted } from '../subjects/chinese/chapterStories';
import { BUILTIN_RADICAL_FAMILIES } from '../subjects/chinese/radicalFamilies';
import { CHINESE_READING_QUESTS } from '../subjects/chinese/readingQuests';
import type { ChineseTargetWord, ChineseWordSet } from '../subjects/chinese/types';
import { BUILTIN_CHINESE_SETS } from '../subjects/chinese/wordSets';
import { ENGLISH_READING_QUESTS } from '../subjects/english/readingQuests';
import type { TargetWord, WordSet } from '../subjects/english/types';
import { BUILTIN_WORD_SETS } from '../subjects/english/wordSets';
import {
  ALL_LOGIC_MODULES,
  LOGIC_REASONING_MODULES,
  SPATIAL_MODULES,
  type LogicModuleMeta,
} from '../subjects/logic/logicTypes';
import { BUILTIN_MATH_SETS } from '../subjects/math/questSets';
import { countTotalCompletedQuests } from './achievements';
import { getAdventureMapSnapshot } from './adventureMap';
import { isoToLocalDateKey } from './date';
import { classifyWordMastery } from './mastery';

const VALID_EN_CORE_IDS = new Set<string>([
  ...BUILTIN_WORD_SETS.map((s) => s.id),
  ...ENGLISH_READING_QUESTS.map((r) => r.id),
]);
const VALID_MATH_CORE_IDS = new Set<string>(BUILTIN_MATH_SETS.map((m) => m.id));
const VALID_ZH_CORE_IDS = new Set<string>([
  ...BUILTIN_CHINESE_SETS.map((s) => s.id),
  ...CHINESE_READING_QUESTS.map((r) => r.id),
]);
const VALID_RADICAL_IDS = new Set<string>(BUILTIN_RADICAL_FAMILIES.map((r) => r.id));
const VALID_ZH_CHAPTER_EP_IDS = new Set<string>(
  BUILTIN_CHAPTER_SERIES.flatMap((sr) => sr.episodes.map((ep) => ep.id)),
);

export interface WeeklySnapshot {
  windowDays: number;
  totalRuns: number;
  runsBySubject: Record<SubjectId, number>;
  avgAccuracyPct: number;
  tokensEarned: number;
  activeDays: number;
  streakDays: number;
  writingCountThisWeek: number;
  masteredWordsCount: number;
  practicedWordsCount: number;
  completedQuestsTotal: number;
  completedRadicalsCount: number;
  totalRadicalsCount: number;
  completedChapterEpisodesCount: number;
  totalChapterEpisodesCount: number;
  completedChapterSeriesCount: number;
  totalChapterSeriesCount: number;
}

export interface WeakSpotItem {
  word: string;
  subjectId: SubjectId;
  tier: DifficultyTier;
  missed: number;
  seen: number;
  correctFirstTry: number;
  accuracyPct: number;
  srsLevel: number;
}

export interface ParentGateChallenge {
  categoryLabel: string;
  prompt: string;
  answer: number;
  choices: number[];
}

export const PARENT_PIN_HASH_RE = /^v1:[0-9a-f]{16}$/;

/**
 * Pure synchronous salted one-way hash for the 4-digit Parent PIN.
 * Works identically inside strict offline <iframe sandbox="allow-scripts"> where crypto.subtle
 * may be unavailable, so plaintext PIN digits are never written to localStorage or backups.
 */
export function hashParentPin(pin: string): string {
  const input = `qv::parent-pin::v1::${pin}::salt#9f4c`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let round = 0; round < 64; round += 1) {
    for (let i = 0; i < input.length; i += 1) {
      const ch = input.charCodeAt(i) ^ ((round * 31 + i * 17) & 0xff);
      h1 = Math.imul(h1 ^ ch, 0x01000193) >>> 0;
      h2 = Math.imul(h2 ^ ((h1 >>> 13) ^ ch), 0x85ebca6b) >>> 0;
    }
    h1 = (Math.imul(h1 ^ (h1 >>> 16), 0x85ebca6b) ^ h2) >>> 0;
    h2 = (Math.imul(h2 ^ (h2 >>> 13), 0xc2b2ae35) ^ h1) >>> 0;
  }
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `v1:${hex1}${hex2}`;
}

export function verifyParentPin(pin: string, storedHash: string | undefined): boolean {
  if (!/^\d{4}$/.test(pin) || !storedHash || !PARENT_PIN_HASH_RE.test(storedHash)) {
    return false;
  }
  const candidate = hashParentPin(pin);
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) {
    diff |= candidate.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return diff === 0;
}

function pickInt(min: number, max: number, rng: () => number): number {
  const clamped = Math.max(0, Math.min(0.999999, rng()));
  return min + Math.floor(clamped * (max - min + 1));
}

const EXPONENT_BANK: { prompt: string; answer: number }[] = [
  { prompt: '2⁵ − 13 = ?', answer: 19 },
  { prompt: '3⁴ − 26 = ?', answer: 55 },
  { prompt: '5³ − 48 = ?', answer: 77 },
  { prompt: '4³ + 19 = ?', answer: 83 },
  { prompt: '2⁶ − 17 = ?', answer: 47 },
  { prompt: '3³ × 2 − 15 = ?', answer: 39 },
  { prompt: '6² + 29 = ?', answer: 65 },
  { prompt: '7² − 18 = ?', answer: 31 },
];

const PERCENT_BANK: { prompt: string; answer: number }[] = [
  { prompt: '15% of 240 = ?', answer: 36 },
  { prompt: '25% of 184 = ?', answer: 46 },
  { prompt: '35% of 120 = ?', answer: 42 },
  { prompt: '15% of 160 = ?', answer: 24 },
  { prompt: '45% of 80 = ?', answer: 36 },
  { prompt: '30% of 140 = ?', answer: 42 },
  { prompt: '12% of 250 = ?', answer: 30 },
  { prompt: '18% of 150 = ?', answer: 27 },
];

export function createParentGateChallenge(rng: () => number = Math.random): ParentGateChallenge {
  const kind = pickInt(0, 4, rng);
  let categoryLabel = '一元一次方程式';
  let prompt = '';
  let answer = 12;

  if (kind === 0) {
    // Linear equation: a*x - b = c or a*x + b = c -> solve for x
    categoryLabel = '一元一次方程式';
    const a = pickInt(3, 7, rng);
    const x = pickInt(8, 19, rng);
    const b = pickInt(5, 19, rng);
    const subtract = pickInt(0, 1, rng) === 0;
    const c = subtract ? a * x - b : a * x + b;
    prompt = subtract ? `${a}x − ${b} = ${c}，求 x = ?` : `${a}x + ${b} = ${c}，求 x = ?`;
    answer = x;
  } else if (kind === 1) {
    // Exponents
    categoryLabel = '次方運算';
    const item = EXPONENT_BANK[pickInt(0, EXPONENT_BANK.length - 1, rng)];
    prompt = item.prompt;
    answer = item.answer;
  } else if (kind === 2) {
    // Square roots
    categoryLabel = '平方根運算';
    const root = pickInt(9, 16, rng);
    const sq = root * root;
    const extra = pickInt(13, 29, rng);
    prompt = `√${sq} + ${extra} = ?`;
    answer = root + extra;
  } else if (kind === 3) {
    // Percentages
    categoryLabel = '百分比計算';
    const item = PERCENT_BANK[pickInt(0, PERCENT_BANK.length - 1, rng)];
    prompt = item.prompt;
    answer = item.answer;
  } else {
    // Signed negative multiplication: (-a) * (-b) - k = ?
    categoryLabel = '負數運算';
    const a = pickInt(6, 12, rng);
    const b = pickInt(5, 9, rng);
    const k = pickInt(11, Math.min(27, a * b - 5), rng);
    prompt = `(−${a}) × (−${b}) − ${k} = ?`;
    answer = a * b - k;
  }

  const candidateOffsets = [-10, -4, 4, 6, 10, 12];
  const distractors: number[] = [];
  for (const off of candidateOffsets) {
    const val = answer + off;
    if (val > 0 && val !== answer && !distractors.includes(val)) {
      distractors.push(val);
    }
    if (distractors.length >= 3) break;
  }
  const choices = [answer, ...distractors];
  for (let i = choices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return {
    categoryLabel,
    prompt,
    answer,
    choices,
  };
}

export function computeWeeklySnapshot(
  player: PlayerState,
  nowIso: string = new Date().toISOString(),
  windowDays = 7,
): WeeklySnapshot {
  const nowMs = Date.parse(nowIso);
  const cutoffMs = Number.isFinite(nowMs) ? nowMs - windowDays * 24 * 60 * 60 * 1000 : 0;

  const recentRuns = player.runHistory.filter((r) => {
    const t = Date.parse(r.completedAt);
    return Number.isFinite(t) && t >= cutoffMs && t <= nowMs + 60_000;
  });

  const runsBySubject: Record<SubjectId, number> = { english: 0, math: 0, chinese: 0 };
  let accSum = 0;
  let tokensEarned = 0;
  const daySet = new Set<string>();

  for (const r of recentRuns) {
    runsBySubject[r.subjectId] = (runsBySubject[r.subjectId] ?? 0) + 1;
    accSum += r.accuracyPct;
    tokensEarned += r.tokensEarned;
    daySet.add(isoToLocalDateKey(r.completedAt));
  }

  const writingCountThisWeek = player.writingLog.filter((w) => {
    const t = Date.parse(w.createdAt);
    return Number.isFinite(t) && t >= cutoffMs && t <= nowMs + 60_000;
  }).length;

  const masteryValues = Object.values(player.wordMastery);
  const masteredWordsCount = masteryValues.filter(
    (rec) => classifyWordMastery(rec) === 'mastered',
  ).length;

  const radicalIdSet = new Set(BUILTIN_RADICAL_FAMILIES.map((f) => f.id));
  const completedRadicalsCount = (player.completedRadicalIds ?? []).filter((id) =>
    radicalIdSet.has(id),
  ).length;

  const allEpIds = new Set(
    BUILTIN_CHAPTER_SERIES.flatMap((s) => s.episodes.map((e) => e.id)),
  );
  const completedEpIds = player.completedChapterEpisodeIds ?? [];
  const completedChapterEpisodesCount = completedEpIds.filter((id) => allEpIds.has(id)).length;
  const completedChapterSeriesCount = BUILTIN_CHAPTER_SERIES.filter((s) =>
    isSeriesFullyCompleted(s, completedEpIds),
  ).length;

  return {
    windowDays,
    totalRuns: recentRuns.length,
    runsBySubject,
    avgAccuracyPct: recentRuns.length > 0 ? Math.round(accSum / recentRuns.length) : 0,
    tokensEarned,
    activeDays: daySet.size,
    streakDays: player.streakDays ?? 0,
    writingCountThisWeek,
    masteredWordsCount,
    practicedWordsCount: masteryValues.length,
    completedQuestsTotal: countTotalCompletedQuests(player),
    completedRadicalsCount,
    totalRadicalsCount: BUILTIN_RADICAL_FAMILIES.length,
    completedChapterEpisodesCount,
    totalChapterEpisodesCount: allEpIds.size,
    completedChapterSeriesCount,
    totalChapterSeriesCount: BUILTIN_CHAPTER_SERIES.length,
  };
}

export function getWeakSpotRadar(
  wordMastery: Record<string, WordMasteryRecord>,
  subjectId?: SubjectId,
  limit = 10,
): WeakSpotItem[] {
  const rows: WeakSpotItem[] = [];
  for (const rec of Object.values(wordMastery)) {
    const recSubj: SubjectId = rec.subjectId ?? 'english';
    if (subjectId && recSubj !== subjectId) continue;
    if (rec.missed <= 0 && rec.correctFirstTry >= rec.seen) continue;
    const accuracyPct =
      rec.seen > 0 ? Math.round((rec.correctFirstTry / rec.seen) * 100) : 0;
    rows.push({
      word: rec.word,
      subjectId: recSubj,
      tier: rec.tier,
      missed: rec.missed,
      seen: rec.seen,
      correctFirstTry: rec.correctFirstTry,
      accuracyPct,
      srsLevel: rec.srsLevel ?? 0,
    });
  }

  return rows
    .sort((a, b) => {
      if (b.missed !== a.missed) return b.missed - a.missed;
      if (a.accuracyPct !== b.accuracyPct) return a.accuracyPct - b.accuracyPct;
      return a.word.localeCompare(b.word);
    })
    .slice(0, Math.max(1, limit));
}

export function buildWeeklyReviewEnglishSet(player: PlayerState): WordSet {
  const lookup = new Map<string, TargetWord>();
  for (const set of BUILTIN_WORD_SETS) {
    for (const w of set.words) {
      lookup.set(w.word.toLowerCase(), w);
    }
  }

  const picked: TargetWord[] = [];
  const seenKeys = new Set<string>();
  const addWord = (tw: TargetWord | undefined) => {
    if (!tw || picked.length >= 5) return;
    const k = tw.word.toLowerCase();
    if (seenKeys.has(k)) return;
    seenKeys.add(k);
    picked.push(tw);
  };

  // 1. Weak-spot missed words first
  for (const weak of getWeakSpotRadar(player.wordMastery, 'english', 15)) {
    addWord(lookup.get(weak.word.toLowerCase()));
  }

  // 2. Fallback: least-recently-seen English words in wordMastery
  if (picked.length < 5) {
    const enRecs = Object.values(player.wordMastery)
      .filter((r) => (r.subjectId ?? 'english') === 'english')
      .sort((a, b) => a.lastSeenAt.localeCompare(b.lastSeenAt));
    for (const rec of enRecs) {
      addWord(lookup.get(rec.word.toLowerCase()));
    }
  }

  // 3. Final fallback: player's active English tier words
  if (picked.length < 5) {
    const tier = player.subjectTiers?.english ?? player.activeTier ?? 2;
    const tierSets = BUILTIN_WORD_SETS.filter((s) => s.tier === tier);
    for (const s of tierSets) {
      for (const w of s.words) {
        addWord(w);
      }
    }
  }

  return {
    id: 'en-weekly-parent-review',
    subjectId: 'english',
    tier: picked[0]?.tier ?? 2,
    title: 'Weekly Review Spotlight',
    shortTag: 'Weekly 1.5×',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    emblemCollectibleId: 'fairytale-slipper-bunny',
    isRematch: true,
    tokenMultiplier: 1.5,
    forgeScenario: 'Show off your Weekly Review mastery! Write 1 vivid sentence using your focus words.',
    starterChips: ['This week I mastered how to ', 'During our weekend adventure, ', 'I felt proud when '],
    words: picked,
  };
}

export function buildWeeklyReviewChineseSet(player: PlayerState): ChineseWordSet {
  const lookup = new Map<string, ChineseTargetWord>();
  for (const set of BUILTIN_CHINESE_SETS) {
    for (const w of set.words) {
      lookup.set(w.word, w);
    }
  }

  const picked: ChineseTargetWord[] = [];
  const seenKeys = new Set<string>();
  const addWord = (tw: ChineseTargetWord | undefined) => {
    if (!tw || picked.length >= 5) return;
    if (seenKeys.has(tw.word)) return;
    seenKeys.add(tw.word);
    picked.push(tw);
  };

  // 1. Weak-spot missed Chinese words first
  for (const weak of getWeakSpotRadar(player.wordMastery, 'chinese', 15)) {
    addWord(lookup.get(weak.word));
  }

  // 2. Fallback: least-recently-seen Chinese words
  if (picked.length < 5) {
    const zhRecs = Object.values(player.wordMastery)
      .filter((r) => r.subjectId === 'chinese')
      .sort((a, b) => a.lastSeenAt.localeCompare(b.lastSeenAt));
    for (const rec of zhRecs) {
      addWord(lookup.get(rec.word));
    }
  }

  // 3. Final fallback: player's active Chinese tier words
  if (picked.length < 5) {
    const tier = player.subjectTiers?.chinese ?? 2;
    const tierSets = BUILTIN_CHINESE_SETS.filter((s) => s.tier === tier);
    for (const s of tierSets) {
      for (const w of s.words) {
        addWord(w);
      }
    }
  }

  return {
    id: 'zh-weekly-parent-review',
    subjectId: 'chinese',
    tier: picked[0]?.tier ?? 2,
    title: '每週錯題特訓關',
    shortTag: '每週 1.5×',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    emblemCollectibleId: 'lunar-hongbao-bunny',
    isRematch: true,
    tokenMultiplier: 1.5,
    forgeScenario: '把本週重點複習的中文詞語收進一句生動句子裡，拿下 1.5× 週複習獎勵！',
    starterChips: ['這星期我最拿手的詞語是', '週末和家人一起出門時，我', '經過這次複習，我終於學會'],
    words: picked,
  };
}

export interface LogicModuleOverviewItem {
  meta: LogicModuleMeta;
  cleared: boolean;
  runs: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracyPct: number | null;
}

export interface LogicLabOverview {
  spatialCleared: number;
  spatialTotal: number;
  logicCleared: number;
  logicTotal: number;
  totalCleared: number;
  totalModules: number;
  totalRuns: number;
  totalCorrect: number;
  totalQuestions: number;
  avgAccuracyPct: number | null;
  modules: LogicModuleOverviewItem[];
}

export function computeLogicLabOverview(player: PlayerState): LogicLabOverview {
  const completedSet = new Set(
    Array.isArray(player.completedLogicModuleIds) ? player.completedLogicModuleIds : [],
  );
  const statsMap =
    player.logicStats && typeof player.logicStats === 'object' ? player.logicStats : {};

  let totalRuns = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;

  const modules: LogicModuleOverviewItem[] = ALL_LOGIC_MODULES.map((meta) => {
    const stat = statsMap[meta.id];
    const runs = stat && Number.isFinite(stat.runs) ? Math.max(0, Math.floor(stat.runs)) : 0;
    const q =
      stat && Number.isFinite(stat.totalQuestions)
        ? Math.max(0, Math.floor(stat.totalQuestions))
        : 0;
    const c =
      stat && Number.isFinite(stat.totalCorrect)
        ? Math.max(0, Math.min(q, Math.floor(stat.totalCorrect)))
        : 0;
    totalRuns += runs;
    totalCorrect += c;
    totalQuestions += q;
    return {
      meta,
      cleared: completedSet.has(meta.id),
      runs,
      totalCorrect: c,
      totalQuestions: q,
      accuracyPct: q > 0 ? Math.round((c / q) * 100) : null,
    };
  });

  const spatialCleared = SPATIAL_MODULES.filter((m) => completedSet.has(m.id)).length;
  const logicCleared = LOGIC_REASONING_MODULES.filter((m) => completedSet.has(m.id)).length;

  return {
    spatialCleared,
    spatialTotal: SPATIAL_MODULES.length,
    logicCleared,
    logicTotal: LOGIC_REASONING_MODULES.length,
    totalCleared: spatialCleared + logicCleared,
    totalModules: ALL_LOGIC_MODULES.length,
    totalRuns,
    totalCorrect,
    totalQuestions,
    avgAccuracyPct: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null,
    modules,
  };
}

export function formatWeeklyReportText(
  player: PlayerState,
  nowIso: string = new Date().toISOString(),
): string {
  const snap = computeWeeklySnapshot(player, nowIso);
  const logicOverview = computeLogicLabOverview(player);
  const weakEn = getWeakSpotRadar(player.wordMastery, 'english', 5);
  const weakZh = getWeakSpotRadar(player.wordMastery, 'chinese', 5);
  const weakMath = getWeakSpotRadar(player.wordMastery, 'math', 5);
  const dateLabel = isoToLocalDateKey(nowIso);
  const adventure = getAdventureMapSnapshot(player, dateLabel);
  const clearedWeeks = player.adventureWeeksCleared ?? 0;

  const lines: string[] = [
    `QuestVault 每週學習報告（${player.displayName}｜截至 ${dateLabel}）`,
    `========================================`,
    `近 7 天完成關卡：${snap.totalRuns} 次（英文 ${snap.runsBySubject.english}｜數學 ${snap.runsBySubject.math}｜中文 ${snap.runsBySubject.chinese}）`,
    `平均正確率：${snap.totalRuns > 0 ? `${snap.avgAccuracyPct}%` : '尚無本週紀錄'}`,
    `近 7 天活躍天數：${snap.activeDays} 天｜連續學習：${snap.streakDays} 天`,
    `本週 7 天尋寶地圖：${adventure.stampedCount} / 7 天（${adventure.weekKey}${clearedWeeks > 0 ? `｜累計全勤 ${clearedWeeks} 週` : ''}）`,
    `近 7 天賺取 Tokens：+${snap.tokensEarned}｜本週造句：${snap.writingCountThisWeek} 句`,
    `累積精熟詞彙／技能：${snap.masteredWordsCount} / ${snap.practicedWordsCount}`,
    `中文偏旁工廠：${snap.completedRadicalsCount} / ${snap.totalRadicalsCount} 家族｜章節微小說：${snap.completedChapterEpisodesCount} / ${snap.totalChapterEpisodesCount} 集（全系列通關 ${snap.completedChapterSeriesCount}/${snap.totalChapterSeriesCount}）`,
    `邏輯與空間思維館：通關 ${logicOverview.totalCleared} / ${logicOverview.totalModules} 模組（空間 ${logicOverview.spatialCleared}/${logicOverview.spatialTotal}｜邏輯運算 ${logicOverview.logicCleared}/${logicOverview.logicTotal}）｜累計 ${logicOverview.totalRuns} 回合${logicOverview.avgAccuracyPct !== null ? `（正確率 ${logicOverview.avgAccuracyPct}%）` : ''}`,
    ``,
    `【待加強弱點雷達】`,
    `- 英文重點詞：${weakEn.length > 0 ? weakEn.map((w) => `${w.word}（錯 ${w.missed} 次）`).join('、') : '目前無常錯詞，表現很棒！'}`,
    `- 中文重點詞：${weakZh.length > 0 ? weakZh.map((w) => `${w.word}（錯 ${w.missed} 次）`).join('、') : '目前無常錯詞，表現很棒！'}`,
    `- 數學重點題：${weakMath.length > 0 ? weakMath.map((w) => `${w.word}（錯 ${w.missed} 次）`).join('、') : '目前無常錯題型，表現很棒！'}`,
  ];

  const recentWritings = player.writingLog.slice(0, 3);
  if (recentWritings.length > 0) {
    lines.push('', '【近期精選造句】');
    for (const w of recentWritings) {
      const tag = w.subjectId === 'chinese' ? '中文' : '英文';
      lines.push(`- [${tag}] ${w.sentence}`);
    }
  }

  return lines.join('\n');
}

export interface WeeklyGoalProgress {
  enabled: boolean;
  weekKey: string;
  enDone: number;
  enTarget: number;
  zhDone: number;
  zhTarget: number;
  mathDone: number;
  mathTarget: number;
  totalDone: number;
  totalTarget: number;
  pct: number;
  isMet: boolean;
  isRedeemed: boolean;
  rewardText: string;
}

export const WEEKLY_REWARD_PRESETS = [
  '🧋 週末喝一杯珍珠奶茶',
  '🍦 挑一球最愛的冰淇淋',
  '🎬 週末家庭電影夜挑片權',
  '📚 書店挑一本喜歡的新書',
] as const;

export const ISO_WEEK_KEY_RE = /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/;

/**
 * Computes the local Monday-to-Sunday ISO week key (e.g., "2026-W48") so weekly goals
 * automatically reset cleanly every Monday at local midnight.
 * Uses UTC arithmetic over the local calendar date so Daylight Saving Time (DST) transitions
 * never shift the week number.
 */
export function getIsoWeekKey(now: Date = new Date()): string {
  const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  // Thursday in current week determines the ISO week-year
  const dayNum = utcDate.getUTCDay() || 7; // Mon=1 .. Sun=7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = Date.UTC(utcDate.getUTCFullYear(), 0, 1);
  const weekNo = Math.ceil(((utcDate.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getWeekStartTimestamp(now: Date = new Date()): number {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayNum = d.getDay() || 7; // Mon=1 .. Sun=7
  d.setDate(d.getDate() - (dayNum - 1));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function getNextWeekStartTimestamp(now: Date = new Date()): number {
  const start = new Date(getWeekStartTimestamp(now));
  start.setDate(start.getDate() + 7);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

/**
 * Counts valid rewarded quest runs (tokensEarned > 0) within the current local Mon-Sun week
 * against the parent's configured Weekly Goal targets.
 */
export function computeWeeklyGoalProgress(
  player: PlayerState,
  now: Date = new Date(),
): WeeklyGoalProgress {
  const weekKey = getIsoWeekKey(now);
  const goal = player.weeklyGoal;
  const enTarget = goal ? Math.max(0, Math.min(14, Math.floor(goal.enTarget))) : 0;
  const zhTarget = goal ? Math.max(0, Math.min(14, Math.floor(goal.zhTarget))) : 0;
  const mathTarget = goal ? Math.max(0, Math.min(14, Math.floor(goal.mathTarget))) : 0;
  const totalTarget = enTarget + zhTarget + mathTarget;
  const enabled = totalTarget > 0;

  const weekStartMs = getWeekStartTimestamp(now);
  const weekEndMs = getNextWeekStartTimestamp(now);

  let enDone = 0;
  let zhDone = 0;
  let mathDone = 0;

  for (const run of player.runHistory) {
    if (run.tokensEarned <= 0) continue; // Exclude 0-token practice replays from weekly goal credit
    const ts = Date.parse(run.completedAt);
    if (!Number.isFinite(ts) || ts < weekStartMs || ts >= weekEndMs) continue;
    if (run.subjectId === 'english') enDone += 1;
    else if (run.subjectId === 'chinese') zhDone += 1;
    else if (run.subjectId === 'math') mathDone += 1;
  }

  const cappedTotalDone =
    Math.min(enDone, enTarget) + Math.min(zhDone, zhTarget) + Math.min(mathDone, mathTarget);
  const pct = totalTarget > 0 ? Math.min(100, Math.round((cappedTotalDone / totalTarget) * 100)) : 0;
  const isMet = enabled && enDone >= enTarget && zhDone >= zhTarget && mathDone >= mathTarget;
  const isRedeemed = Boolean(goal?.redeemedWeekKey && goal.redeemedWeekKey === weekKey);

  return {
    enabled,
    weekKey,
    enDone,
    enTarget,
    zhDone,
    zhTarget,
    mathDone,
    mathTarget,
    totalDone: cappedTotalDone,
    totalTarget,
    pct,
    isMet,
    isRedeemed,
    rewardText: goal?.rewardText?.trim() || WEEKLY_REWARD_PRESETS[0],
  };
}

export const BACKUP_REMINDER_MIN_RUNS = 3;
export const BACKUP_REMINDER_DAYS = 7;

/**
 * Triggers a gentle backup reminder in Parent Corner once the player has completed >= 3 runs
 * and has never exported a backup or hasn't backed up in more than 7 days.
 */
export function isBackupOverdue(
  player: PlayerState,
  nowMs: number = Date.now(),
): { overdue: boolean; daysSinceBackup: number | null } {
  if (player.runHistory.length < BACKUP_REMINDER_MIN_RUNS) {
    return { overdue: false, daysSinceBackup: null };
  }
  if (!player.lastBackupAt) {
    return { overdue: true, daysSinceBackup: null };
  }
  const ts = Date.parse(player.lastBackupAt);
  if (!Number.isFinite(ts)) {
    return { overdue: true, daysSinceBackup: null };
  }
  const diffDays = Math.floor(Math.max(0, nowMs - ts) / 86_400_000);
  return {
    overdue: nowMs - ts > BACKUP_REMINDER_DAYS * 86_400_000,
    daysSinceBackup: diffDays,
  };
}

export interface DailyTrendPoint {
  dateKey: string;
  shortLabel: string;
  runs: number;
  avgAccuracyPct: number | null;
  tokensEarned: number;
}

export interface LabCoverageItem {
  id: 'english' | 'math' | 'chinese' | 'logic';
  label: string;
  zhLabel: string;
  emoji: string;
  completed: number;
  total: number;
  pct: number;
  colorHex: string;
  bgHex: string;
}

export interface Learning14DayTrend {
  days: DailyTrendPoint[];
  totalRuns14d: number;
  activeDays14d: number;
  avgAccuracy14d: number | null;
  maxDailyRuns: number;
  labCoverage: LabCoverageItem[];
}

function parseDateKeyLocal(dateKey: string): { y: number; m: number; d: number } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const day = Number(m[3]);
    const dt = new Date(y, mo - 1, day);
    if (dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === day) {
      return { y, m: mo, d: day };
    }
  }
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

function formatDateKeyYmd(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function countUniqueIds(ids?: string[], whitelist?: Set<string>): number {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const unique = new Set<string>();
  for (const id of ids) {
    if (typeof id !== 'string' || id.length === 0) continue;
    if (whitelist && !whitelist.has(id)) continue;
    unique.add(id);
  }
  return unique.size;
}

/**
 * Pure 14-day learning trend + 4-Hall coverage breakdown for Parent Corner SVG charts.
 * Uses local calendar arithmetic so month/year boundaries (including leap years) stay exact.
 */
export function compute14DayTrend(
  player: PlayerState,
  todayKey: string,
): Learning14DayTrend {
  const { y, m, d } = parseDateKeyLocal(todayKey);
  const buckets = new Map<
    string,
    { runs: number; accSum: number; accCount: number; tokens: number }
  >();
  const orderedKeys: { dateKey: string; shortLabel: string }[] = [];

  for (let offset = 13; offset >= 0; offset -= 1) {
    const dt = new Date(y, m - 1, d - offset);
    const dk = formatDateKeyYmd(dt);
    const shortLabel = `${dt.getMonth() + 1}/${dt.getDate()}`;
    orderedKeys.push({ dateKey: dk, shortLabel });
    buckets.set(dk, { runs: 0, accSum: 0, accCount: 0, tokens: 0 });
  }

  for (const run of player.runHistory) {
    if (
      !run ||
      typeof run.completedAt !== 'string' ||
      !Number.isFinite(Date.parse(run.completedAt))
    ) {
      continue;
    }
    const dk = isoToLocalDateKey(run.completedAt);
    const bucket = buckets.get(dk);
    if (!bucket) continue;
    bucket.runs += 1;
    if (typeof run.accuracyPct === 'number' && Number.isFinite(run.accuracyPct)) {
      bucket.accSum += Math.max(0, Math.min(100, run.accuracyPct));
      bucket.accCount += 1;
    }
    if (typeof run.tokensEarned === 'number' && Number.isFinite(run.tokensEarned) && run.tokensEarned > 0) {
      bucket.tokens += Math.floor(run.tokensEarned);
    }
  }

  let totalRuns14d = 0;
  let activeDays14d = 0;
  let totalAccSum = 0;
  let totalAccCount = 0;
  let maxDailyRuns = 1;

  const days: DailyTrendPoint[] = orderedKeys.map(({ dateKey, shortLabel }) => {
    const b = buckets.get(dateKey)!;
    totalRuns14d += b.runs;
    if (b.runs > 0) activeDays14d += 1;
    if (b.runs > maxDailyRuns) maxDailyRuns = b.runs;
    totalAccSum += b.accSum;
    totalAccCount += b.accCount;
    return {
      dateKey,
      shortLabel,
      runs: b.runs,
      avgAccuracyPct: b.accCount > 0 ? Math.round(b.accSum / b.accCount) : null,
      tokensEarned: b.tokens,
    };
  });

  const completedEnCore = countUniqueIds(player.completedQuestSetIds, VALID_EN_CORE_IDS);
  const enDone =
    completedEnCore +
    countUniqueIds(player.completedEnglishRootIds) +
    countUniqueIds(player.completedGrammarIds) +
    countUniqueIds(player.completedSpellingIds) +
    countUniqueIds(player.completedFigurativeIds) +
    countUniqueIds(player.completedEnglishChapterIds);
  // 80 Word Sets + 8 Reading Quests + 16 Roots + 12 Grammar + 16 Spelling + 12 Figurative + 20 Chapter Episodes = 164
  const enTotal = Math.max(1, VALID_EN_CORE_IDS.size + 16 + 12 + 16 + 12 + 20);

  const completedMathCore = countUniqueIds(player.completedQuestSetIds, VALID_MATH_CORE_IDS);
  const mathDone =
    completedMathCore +
    countUniqueIds(player.completedBarModelIds) +
    countUniqueIds(player.completedClockMeasureIds);
  // 28 Core Math Units + 8 Bar Model Labs + 8 Clock & Measure Units = 44
  const mathTotal = Math.max(1, VALID_MATH_CORE_IDS.size + 8 + 8);

  const completedZhCore = countUniqueIds(player.completedQuestSetIds, VALID_ZH_CORE_IDS);
  const zhDone =
    completedZhCore +
    countUniqueIds(player.completedRadicalIds, VALID_RADICAL_IDS) +
    countUniqueIds(player.completedMeasureIds) +
    countUniqueIds(player.completedSentencePatternIds) +
    countUniqueIds(player.completedLookAlikeIds) +
    countUniqueIds(player.completedChapterEpisodeIds, VALID_ZH_CHAPTER_EP_IDS);
  // 80 Word Sets + 8 Reading Quests + 24 Radicals + 24 Measure/Idiom + 16 Sentence Patterns + 16 Look-Alike + 40 Chapter Episodes = 208
  const zhTotal = Math.max(
    1,
    VALID_ZH_CORE_IDS.size + VALID_RADICAL_IDS.size + 24 + 16 + 16 + VALID_ZH_CHAPTER_EP_IDS.size,
  );

  const logicOverview = computeLogicLabOverview(player);

  const mkCoverage = (
    id: LabCoverageItem['id'],
    label: string,
    zhLabel: string,
    emoji: string,
    completed: number,
    total: number,
    colorHex: string,
    bgHex: string,
  ): LabCoverageItem => {
    const safeTotal = Math.max(1, total);
    const safeCompleted = Math.max(0, Math.min(safeTotal, completed));
    return {
      id,
      label,
      zhLabel,
      emoji,
      completed: safeCompleted,
      total: safeTotal,
      pct: Math.min(100, Math.round((safeCompleted / safeTotal) * 100)),
      colorHex,
      bgHex,
    };
  };

  return {
    days,
    totalRuns14d,
    activeDays14d,
    avgAccuracy14d: totalAccCount > 0 ? Math.round(totalAccSum / totalAccCount) : null,
    maxDailyRuns,
    labCoverage: [
      mkCoverage('english', 'English ELA', '英文讀寫', '📘', enDone, enTotal, '#2563EB', '#EFF6FF'),
      mkCoverage('math', 'Math & Measure', '數學＆時鐘度量衡', '🧮', mathDone, mathTotal, '#059669', '#ECFDF5'),
      mkCoverage('chinese', 'Traditional Chinese', '繁體中文', '🏮', zhDone, zhTotal, '#DB2777', '#FDF2F8'),
      mkCoverage(
        'logic',
        'Logic & Spatial',
        '邏輯與空間',
        '🧠',
        logicOverview.totalCleared,
        logicOverview.totalModules,
        '#7C3AED',
        '#F5F3FF',
      ),
    ],
  };
}



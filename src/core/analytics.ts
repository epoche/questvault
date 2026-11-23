import type {
  DifficultyTier,
  PlayerState,
  SubjectId,
  WordMasteryRecord,
} from './types';
import { BUILTIN_CHAPTER_SERIES, isSeriesFullyCompleted } from '../subjects/chinese/chapterStories';
import { BUILTIN_RADICAL_FAMILIES } from '../subjects/chinese/radicalFamilies';
import type { ChineseTargetWord, ChineseWordSet } from '../subjects/chinese/types';
import { BUILTIN_CHINESE_SETS } from '../subjects/chinese/wordSets';
import type { TargetWord, WordSet } from '../subjects/english/types';
import { BUILTIN_WORD_SETS } from '../subjects/english/wordSets';
import { classifyWordMastery } from './mastery';

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
  prompt: string;
  answer: number;
  choices: number[];
}

const PARENT_GATE_POOL: { a: number; b: number }[] = [
  { a: 12, b: 7 },
  { a: 13, b: 6 },
  { a: 14, b: 7 },
  { a: 16, b: 4 },
  { a: 17, b: 5 },
  { a: 18, b: 6 },
  { a: 19, b: 4 },
  { a: 23, b: 3 },
  { a: 24, b: 4 },
  { a: 15, b: 7 },
];

export function createParentGateChallenge(rng: () => number = Math.random): ParentGateChallenge {
  const idx = Math.floor(Math.max(0, Math.min(0.999999, rng())) * PARENT_GATE_POOL.length);
  const { a, b } = PARENT_GATE_POOL[idx];
  const answer = a * b;
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
  // Deterministic Fisher-Yates shuffle using rng
  for (let i = choices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return {
    prompt: `${a} × ${b} = ?`,
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
    daySet.add(r.completedAt.slice(0, 10));
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
    completedQuestsTotal: player.completedQuestSetIds.length,
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

export function formatWeeklyReportText(
  player: PlayerState,
  nowIso: string = new Date().toISOString(),
): string {
  const snap = computeWeeklySnapshot(player, nowIso);
  const weakEn = getWeakSpotRadar(player.wordMastery, 'english', 5);
  const weakZh = getWeakSpotRadar(player.wordMastery, 'chinese', 5);
  const weakMath = getWeakSpotRadar(player.wordMastery, 'math', 5);
  const dateLabel = nowIso.slice(0, 10);

  const lines: string[] = [
    `QuestVault 每週學習報告（${player.displayName}｜截至 ${dateLabel}）`,
    `========================================`,
    `近 7 天完成關卡：${snap.totalRuns} 次（英文 ${snap.runsBySubject.english}｜數學 ${snap.runsBySubject.math}｜中文 ${snap.runsBySubject.chinese}）`,
    `平均正確率：${snap.totalRuns > 0 ? `${snap.avgAccuracyPct}%` : '尚無本週紀錄'}`,
    `近 7 天活躍天數：${snap.activeDays} 天｜連續學習：${snap.streakDays} 天`,
    `近 7 天賺取 Tokens：+${snap.tokensEarned}｜本週造句：${snap.writingCountThisWeek} 句`,
    `累積精熟詞彙／技能：${snap.masteredWordsCount} / ${snap.practicedWordsCount}`,
    `中文偏旁工廠：${snap.completedRadicalsCount} / ${snap.totalRadicalsCount} 家族｜章節微小說：${snap.completedChapterEpisodesCount} / ${snap.totalChapterEpisodesCount} 集（全系列通關 ${snap.completedChapterSeriesCount}/${snap.totalChapterSeriesCount}）`,
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

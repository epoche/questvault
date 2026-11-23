import type { DifficultyTier } from '../../core/types';
import type { ChineseTargetWord, ChineseWordSet } from './types';

export const CHINESE_PLACEMENT_QUESTION_COUNT = 8;
export const CHINESE_PLACEMENT_BONUS_TOKENS = 50;

export interface ChinesePlacementQuestion {
  index: number;
  tier: DifficultyTier;
  targetWord: ChineseTargetWord;
  promptText: string;
  correctWord: string;
  choices: { word: string; zhuyin: string }[];
}

export interface ChinesePlacementRecord {
  word: string;
  tier: DifficultyTier;
  correct: boolean;
}

export interface ChinesePlacementSession {
  totalQuestions: number;
  currentTier: DifficultyTier;
  consecutiveCorrect: number;
  consecutiveMissed: number;
  usedWords: string[];
  history: ChinesePlacementRecord[];
  currentQuestion: ChinesePlacementQuestion | null;
  completed: boolean;
  recommendedTier: DifficultyTier;
  recommendationReason: string;
  poolByTier: Record<DifficultyTier, ChineseTargetWord[]>;
  rng: () => number;
}

function pickRandom<T>(items: T[], rng: () => number): T {
  const idx = Math.floor(Math.max(0, Math.min(0.999999, rng())) * items.length);
  return items[idx];
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickSamePosDistractors(
  targetWord: ChineseTargetWord,
  poolByTier: Record<DifficultyTier, ChineseTargetWord[]>,
  tier: DifficultyTier,
  rng: () => number,
): { word: string; zhuyin: string }[] {
  const all = Object.values(poolByTier).flat();
  const picked: { word: string; zhuyin: string }[] = [];

  const addFrom = (list: ChineseTargetWord[]) => {
    for (const c of shuffle(list, rng)) {
      if (picked.length >= 3) break;
      if (c.word === targetWord.word || picked.some((p) => p.word === c.word)) continue;
      picked.push({ word: c.word, zhuyin: c.zhuyin });
    }
  };

  addFrom(poolByTier[tier].filter((w) => w.partOfSpeech === targetWord.partOfSpeech));
  addFrom(
    all.filter((w) => w.partOfSpeech === targetWord.partOfSpeech && Math.abs(w.tier - tier) <= 1),
  );
  addFrom(all.filter((w) => w.partOfSpeech === targetWord.partOfSpeech));
  addFrom(poolByTier[tier]);

  return picked;
}

function buildNextQuestion(
  poolByTier: Record<DifficultyTier, ChineseTargetWord[]>,
  tier: DifficultyTier,
  usedWords: string[],
  index: number,
  rng: () => number,
): ChinesePlacementQuestion {
  const pool = poolByTier[tier];
  const unused = pool.filter((w) => !usedWords.includes(w.word));
  const targetWord = pickRandom(unused.length > 0 ? unused : pool, rng);
  const distractors = pickSamePosDistractors(targetWord, poolByTier, tier, rng);
  const choices = shuffle(
    [{ word: targetWord.word, zhuyin: targetWord.zhuyin }, ...distractors],
    rng,
  );

  return {
    index,
    tier,
    targetWord,
    promptText: targetWord.sprintSentence,
    correctWord: targetWord.word,
    choices,
  };
}

export function createChinesePlacementSession(
  wordSets: ChineseWordSet[],
  rng: () => number = Math.random,
): ChinesePlacementSession {
  const poolByTier: Record<DifficultyTier, ChineseTargetWord[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const set of wordSets) {
    for (const w of set.words) {
      poolByTier[set.tier].push(w);
    }
  }

  const startTier: DifficultyTier = 2;
  const first = buildNextQuestion(poolByTier, startTier, [], 0, rng);

  return {
    totalQuestions: CHINESE_PLACEMENT_QUESTION_COUNT,
    currentTier: startTier,
    consecutiveCorrect: 0,
    consecutiveMissed: 0,
    usedWords: [first.correctWord],
    history: [],
    currentQuestion: first,
    completed: false,
    recommendedTier: startTier,
    recommendationReason: '',
    poolByTier,
    rng,
  };
}

function computeRecommendation(
  history: ChinesePlacementRecord[],
  finalTier: DifficultyTier,
): { tier: DifficultyTier; reason: string } {
  const tier4Correct = history.filter((h) => h.tier === 4 && h.correct).length;
  const tier3Correct = history.filter((h) => h.tier === 3 && h.correct).length;
  const totalCorrect = history.filter((h) => h.correct).length;

  if (finalTier === 4 && tier4Correct >= 2 && totalCorrect >= 7) {
    return {
      tier: 4,
      reason: `答對 ${totalCorrect}/${history.length} 題（含進階詞彙）——直接挑戰 Tier 4 進階寫作！`,
    };
  }
  if (totalCorrect >= 6 && tier3Correct >= 2) {
    return {
      tier: 3,
      reason: `答對 ${totalCorrect}/${history.length} 題——非常適合從 Tier 3 四年級閱讀開始！`,
    };
  }
  if (totalCorrect <= 3) {
    return {
      tier: 1,
      reason: `先從 Tier 1 生活高頻字詞建立信心，隨時都能往上升級！`,
    };
  }
  return {
    tier: 2,
    reason: `答對 ${totalCorrect}/${history.length} 題——推薦從 Tier 2 故事核心出發！`,
  };
}

export function submitChinesePlacementAnswer(
  session: ChinesePlacementSession,
  selectedWord: string,
): ChinesePlacementSession {
  if (session.completed || !session.currentQuestion) return session;

  const q = session.currentQuestion;
  const isCorrect = selectedWord === q.correctWord;
  const nextHistory: ChinesePlacementRecord[] = [
    ...session.history,
    { word: q.correctWord, tier: q.tier, correct: isCorrect },
  ];

  let nextTier: DifficultyTier = session.currentTier;
  let consecutiveCorrect = isCorrect ? session.consecutiveCorrect + 1 : 0;
  let consecutiveMissed = isCorrect ? 0 : session.consecutiveMissed + 1;

  if (consecutiveCorrect >= 2 && nextTier < 4) {
    nextTier = (nextTier + 1) as DifficultyTier;
    consecutiveCorrect = 0;
  } else if (consecutiveMissed >= 2 && nextTier > 1) {
    nextTier = (nextTier - 1) as DifficultyTier;
    consecutiveMissed = 0;
  } else if (!isCorrect && nextTier >= 3) {
    nextTier = (nextTier - 1) as DifficultyTier;
    consecutiveMissed = 0;
  }

  if (nextHistory.length >= session.totalQuestions) {
    const rec = computeRecommendation(nextHistory, nextTier);
    return {
      ...session,
      currentTier: nextTier,
      consecutiveCorrect,
      consecutiveMissed,
      history: nextHistory,
      currentQuestion: null,
      completed: true,
      recommendedTier: rec.tier,
      recommendationReason: rec.reason,
    };
  }

  const nextQ = buildNextQuestion(
    session.poolByTier,
    nextTier,
    session.usedWords,
    nextHistory.length,
    session.rng,
  );

  return {
    ...session,
    currentTier: nextTier,
    consecutiveCorrect,
    consecutiveMissed,
    usedWords: [...session.usedWords, nextQ.correctWord],
    history: nextHistory,
    currentQuestion: nextQ,
    completed: false,
    recommendedTier: nextTier,
  };
}

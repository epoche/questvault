import type { DifficultyTier } from '../../core/types';
import type { TargetWord, WordSet } from './types';

export const PLACEMENT_QUESTION_COUNT = 8;
export const PLACEMENT_BONUS_TOKENS = 50;

export interface PlacementQuestion {
  index: number;
  tier: DifficultyTier;
  targetWord: TargetWord;
  promptText: string;
  correctWord: string;
  choices: string[];
}

export interface PlacementRecord {
  word: string;
  tier: DifficultyTier;
  correct: boolean;
}

export interface PlacementSession {
  totalQuestions: number;
  currentTier: DifficultyTier;
  consecutiveCorrect: number;
  consecutiveMissed: number;
  usedWords: string[];
  history: PlacementRecord[];
  currentQuestion: PlacementQuestion | null;
  completed: boolean;
  recommendedTier: DifficultyTier;
  recommendationReason: string;
  poolByTier: Record<DifficultyTier, TargetWord[]>;
  rng: () => number;
}

function isPastTenseVerb(w: TargetWord): boolean {
  return w.partOfSpeech === 'verb' && w.word.toLowerCase().endsWith('ed');
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
  targetWord: TargetWord,
  poolByTier: Record<DifficultyTier, TargetWord[]>,
  tier: DifficultyTier,
  rng: () => number,
): string[] {
  const allWords = Object.values(poolByTier).flat();
  const targetLower = targetWord.word.toLowerCase();
  const targetPast = isPastTenseVerb(targetWord);
  const picked: string[] = [];

  const addFrom = (list: TargetWord[]) => {
    for (const candidate of shuffle(list, rng)) {
      if (picked.length >= 3) break;
      const lower = candidate.word.toLowerCase();
      if (lower === targetLower || picked.some((p) => p.toLowerCase() === lower)) continue;
      picked.push(candidate.word);
    }
  };

  // 1. Same tier + same POS + same verb tense
  addFrom(
    poolByTier[tier].filter(
      (w) => w.partOfSpeech === targetWord.partOfSpeech && isPastTenseVerb(w) === targetPast,
    ),
  );
  // 2. Adjacent tiers + same POS + same verb tense
  addFrom(
    allWords.filter(
      (w) =>
        w.partOfSpeech === targetWord.partOfSpeech &&
        isPastTenseVerb(w) === targetPast &&
        Math.abs(w.tier - tier) <= 1,
    ),
  );
  // 3. Any tier + same POS + same verb tense
  addFrom(
    allWords.filter(
      (w) => w.partOfSpeech === targetWord.partOfSpeech && isPastTenseVerb(w) === targetPast,
    ),
  );
  // 4. Any tier + same POS
  addFrom(allWords.filter((w) => w.partOfSpeech === targetWord.partOfSpeech));
  // 5. Fallback to same tier
  addFrom(poolByTier[tier]);

  return picked;
}

function buildNextQuestion(
  poolByTier: Record<DifficultyTier, TargetWord[]>,
  tier: DifficultyTier,
  usedWords: string[],
  index: number,
  rng: () => number,
): PlacementQuestion {
  const tierPool = poolByTier[tier];
  const unused = tierPool.filter((w) => !usedWords.includes(w.word.toLowerCase()));
  const candidates = unused.length > 0 ? unused : tierPool;
  const targetWord = pickRandom(candidates, rng);

  const distractors = pickSamePosDistractors(targetWord, poolByTier, tier, rng);
  const choices = shuffle([targetWord.word, ...distractors], rng);

  return {
    index,
    tier,
    targetWord,
    promptText: targetWord.sprintSentence ?? targetWord.contextSentence,
    correctWord: targetWord.word,
    choices,
  };
}

export function createPlacementSession(
  wordSets: WordSet[],
  rng: () => number = Math.random,
): PlacementSession {
  const poolByTier: Record<DifficultyTier, TargetWord[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const set of wordSets) {
    for (const w of set.words) {
      poolByTier[set.tier].push(w);
    }
  }

  const startTier: DifficultyTier = 2;
  const firstQuestion = buildNextQuestion(poolByTier, startTier, [], 0, rng);

  return {
    totalQuestions: PLACEMENT_QUESTION_COUNT,
    currentTier: startTier,
    consecutiveCorrect: 0,
    consecutiveMissed: 0,
    usedWords: [firstQuestion.correctWord.toLowerCase()],
    history: [],
    currentQuestion: firstQuestion,
    completed: false,
    recommendedTier: startTier,
    recommendationReason: '',
    poolByTier,
    rng,
  };
}

function computeRecommendation(
  history: PlacementRecord[],
  finalTier: DifficultyTier,
): { tier: DifficultyTier; reason: string } {
  const tier4Correct = history.filter((h) => h.tier === 4 && h.correct).length;
  const tier3Correct = history.filter((h) => h.tier === 3 && h.correct).length;
  const totalCorrect = history.filter((h) => h.correct).length;

  if (finalTier === 4 && tier4Correct >= 2 && totalCorrect >= 7) {
    return {
      tier: 4,
      reason: `You nailed ${totalCorrect}/${history.length} including Challenge words — starting at Tier 4!`,
    };
  }
  if (totalCorrect >= 6 && tier3Correct >= 2) {
    return {
      tier: 3,
      reason: `Strong ${totalCorrect}/${history.length} warm-up — you’re ready for Grade 4 Core (Tier 3)!`,
    };
  }
  if (totalCorrect <= 3) {
    return {
      tier: 1,
      reason: `Let’s build fast wins with fun Tier 1 Bridge words first — you can switch up anytime!`,
    };
  }
  return {
    tier: 2,
    reason: `Nice ${totalCorrect}/${history.length} warm-up — Tier 2 Grade 3 Core is a great launching pad!`,
  };
}

export function submitPlacementAnswer(
  session: PlacementSession,
  selectedWord: string,
): PlacementSession {
  if (session.completed || !session.currentQuestion) return session;

  const q = session.currentQuestion;
  const isCorrect = selectedWord.toLowerCase() === q.correctWord.toLowerCase();
  const nextHistory: PlacementRecord[] = [
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

  const done = nextHistory.length >= session.totalQuestions;
  if (done) {
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

  const nextQuestion = buildNextQuestion(
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
    usedWords: [...session.usedWords, nextQuestion.correctWord.toLowerCase()],
    history: nextHistory,
    currentQuestion: nextQuestion,
    completed: false,
    recommendedTier: nextTier,
  };
}

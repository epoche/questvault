import type { DifficultyTier } from '../../core/types';
import type { MathQuestSet, MathSkillItem, MathVisualSpec } from './types';

export const MATH_PLACEMENT_QUESTION_COUNT = 8;
export const MATH_PLACEMENT_BONUS_TOKENS = 50;

export interface MathPlacementQuestion {
  index: number;
  tier: DifficultyTier;
  item: MathSkillItem;
  promptText: string;
  visual?: MathVisualSpec;
  correctAnswer: string;
  choices: string[];
  explanation: string;
}

export interface MathPlacementRecord {
  skillLabel: string;
  tier: DifficultyTier;
  correct: boolean;
}

export interface MathPlacementSession {
  totalQuestions: number;
  currentTier: DifficultyTier;
  consecutiveCorrect: number;
  consecutiveMissed: number;
  usedIds: string[];
  history: MathPlacementRecord[];
  currentQuestion: MathPlacementQuestion | null;
  completed: boolean;
  recommendedTier: DifficultyTier;
  recommendationReason: string;
  poolByTier: Record<DifficultyTier, MathSkillItem[]>;
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

function buildNextQuestion(
  poolByTier: Record<DifficultyTier, MathSkillItem[]>,
  tier: DifficultyTier,
  usedIds: string[],
  index: number,
  rng: () => number,
): MathPlacementQuestion {
  const pool = poolByTier[tier];
  const unused = pool.filter((item) => !usedIds.includes(item.id));
  const target = pickRandom(unused.length > 0 ? unused : pool, rng);

  return {
    index,
    tier,
    item: target,
    promptText: target.sprintPrompt,
    visual: target.sprintVisual,
    correctAnswer: target.correctAnswer,
    choices: shuffle([target.correctAnswer, ...target.distractors], rng),
    explanation: target.explanation,
  };
}

export function createMathPlacementSession(
  questSets: MathQuestSet[],
  rng: () => number = Math.random,
): MathPlacementSession {
  const poolByTier: Record<DifficultyTier, MathSkillItem[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const set of questSets) {
    for (const item of set.items) {
      poolByTier[set.tier].push(item);
    }
  }

  const startTier: DifficultyTier = 2;
  const first = buildNextQuestion(poolByTier, startTier, [], 0, rng);

  return {
    totalQuestions: MATH_PLACEMENT_QUESTION_COUNT,
    currentTier: startTier,
    consecutiveCorrect: 0,
    consecutiveMissed: 0,
    usedIds: [first.item.id],
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
  history: MathPlacementRecord[],
  finalTier: DifficultyTier,
): { tier: DifficultyTier; reason: string } {
  const tier4Correct = history.filter((h) => h.tier === 4 && h.correct).length;
  const tier3Correct = history.filter((h) => h.tier === 3 && h.correct).length;
  const totalCorrect = history.filter((h) => h.correct).length;

  if (finalTier === 4 && tier4Correct >= 2 && totalCorrect >= 7) {
    return {
      tier: 4,
      reason: `Awesome ${totalCorrect}/${history.length} math warm-up — ready for G4+ Challenge (Tier 4)!`,
    };
  }
  if (totalCorrect >= 6 && tier3Correct >= 2) {
    return {
      tier: 3,
      reason: `Strong ${totalCorrect}/${history.length} score — starting right at Grade 4 Core (Tier 3)!`,
    };
  }
  if (totalCorrect <= 3) {
    return {
      tier: 1,
      reason: `Let’s lock in visual arrays & fraction bars in Tier 1 first — you can jump up anytime!`,
    };
  }
  return {
    tier: 2,
    reason: `Nice ${totalCorrect}/${history.length} warm-up — Tier 2 (G3–4 Core) is a great launch pad!`,
  };
}

export function submitMathPlacementAnswer(
  session: MathPlacementSession,
  selectedAnswer: string,
): MathPlacementSession {
  if (session.completed || !session.currentQuestion) return session;

  const q = session.currentQuestion;
  const isCorrect = selectedAnswer === q.correctAnswer;
  const nextHistory: MathPlacementRecord[] = [
    ...session.history,
    { skillLabel: q.item.skillLabel, tier: q.tier, correct: isCorrect },
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
    session.usedIds,
    nextHistory.length,
    session.rng,
  );

  return {
    ...session,
    currentTier: nextTier,
    consecutiveCorrect,
    consecutiveMissed,
    usedIds: [...session.usedIds, nextQ.item.id],
    history: nextHistory,
    currentQuestion: nextQ,
    completed: false,
    recommendedTier: nextTier,
  };
}

import { getDueReviewItems, getTrickyWords } from '../../core/mastery';
import type { WordMasteryRecord } from '../../core/types';
import { getLocalDateKey } from '../english/runEngine';
import { hydrateDynamicMathSet } from './mathGenerator';
import type {
  MathChallengeQuestion,
  MathQuestSet,
  MathRunPlan,
  MathSkillItem,
  MathSprintQuestion,
} from './types';

function shuffleWithRng<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildMathTrickyRematchSet(
  wordMastery: Record<string, WordMasteryRecord>,
  builtinSets: MathQuestSet[],
  lastBossRematchDate?: string,
  todayKey: string = getLocalDateKey(),
): MathQuestSet | null {
  if (lastBossRematchDate && lastBossRematchDate === todayKey) {
    return null;
  }

  const tricky = getTrickyWords(wordMastery, 'math');
  if (tricky.length < 3) return null;

  const lookup = new Map<string, MathSkillItem>();
  for (const set of builtinSets) {
    for (const item of set.items) {
      lookup.set(item.skillLabel.toLowerCase(), item);
    }
  }

  const matched: MathSkillItem[] = [];
  for (const rec of tricky) {
    if (matched.length >= 4) break;
    const found = lookup.get(rec.word.toLowerCase());
    if (found) matched.push(found);
  }

  if (matched.length < 3) return null;

  return {
    id: 'math-tricky-rematch',
    subjectId: 'math',
    tier: matched[0].tier,
    title: 'Tricky Math Boss Rematch',
    shortTag: '1.5× Daily',
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    emblemCollectibleId: 'space-nova-phoenix',
    isRematch: true,
    tokenMultiplier: 1.5,
    items: matched,
  };
}

export function buildMathSrsReviewSet(
  wordMastery: Record<string, WordMasteryRecord>,
  builtinSets: MathQuestSet[],
  nowIso?: string,
): MathQuestSet | null {
  const due = getDueReviewItems(wordMastery, 'math', nowIso);
  if (due.length < 3) return null;

  const lookup = new Map<string, MathSkillItem>();
  for (const set of builtinSets) {
    for (const item of set.items) {
      lookup.set(item.skillLabel.toLowerCase(), item);
    }
  }

  const matched: MathSkillItem[] = [];
  for (const rec of due) {
    if (matched.length >= 4) break;
    const found = lookup.get(rec.word.toLowerCase());
    if (found) matched.push(found);
  }
  if (matched.length < 3) return null;

  return {
    id: 'math-srs-review',
    subjectId: 'math',
    tier: matched[0].tier,
    title: 'Daily Memory Review',
    shortTag: 'SRS Due',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    emblemCollectibleId: 'crystal-sapphire-fox',
    items: matched,
  };
}

export function buildMathRun(
  questSet: MathQuestSet,
  rng: () => number = Math.random,
): MathRunPlan {
  const hydrated = hydrateDynamicMathSet(questSet, rng);
  const ordered = shuffleWithRng(hydrated.items, rng);

  const sprintQuestions: MathSprintQuestion[] = ordered.map((item, idx) => ({
    id: `msprint-${idx}-${item.id}`,
    item,
    promptText: item.sprintPrompt,
    visual: item.sprintVisual,
    revealVisualOnFeedback: item.revealVisualOnFeedback,
    correctAnswer: item.correctAnswer,
    choices: shuffleWithRng([item.correctAnswer, ...item.distractors], rng),
    explanation: item.explanation,
  }));

  const challengeSource = ordered.slice(0, Math.min(3, ordered.length));
  const challengeQuestions: MathChallengeQuestion[] = challengeSource.map((item, idx) => ({
    id: `mchal-${idx}-${item.id}`,
    item,
    promptText: item.wordProblemPrompt,
    visual: item.wordProblemVisual,
    correctAnswer: item.wordProblemAnswer,
    choices: shuffleWithRng([item.wordProblemAnswer, ...item.wordProblemDistractors], rng),
    stepHint: item.wordProblemStepHint,
  }));

  return {
    questSet: hydrated,
    conceptItems: ordered,
    sprintQuestions,
    challengeQuestions,
  };
}

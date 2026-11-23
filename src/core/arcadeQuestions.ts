import type { DifficultyTier, SubjectId } from './types';
import type { ChineseTargetWord } from '../subjects/chinese/types';
import { BUILTIN_CHINESE_SETS } from '../subjects/chinese/wordSets';
import type { TargetWord } from '../subjects/english/types';
import { BUILTIN_WORD_SETS } from '../subjects/english/wordSets';
import { generateDynamicMathItem } from '../subjects/math/mathGenerator';
import { BUILTIN_MATH_SETS } from '../subjects/math/questSets';
import type { MathVisualSpec } from '../subjects/math/types';

export interface ArcadeQuestion {
  id: string;
  prompt: string;
  subHint?: string;
  speakText?: string;
  speakLang?: 'en-US' | 'zh-TW';
  visual?: MathVisualSpec;
  revealVisualOnFeedback?: boolean;
  correctAnswer: string;
  choices: { label: string; zhuyin?: string }[];
  explanation: string;
}

function shuffleWithRng<T>(arr: readonly T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(arr: readonly T[], rng: () => number): T {
  const idx = Math.min(arr.length - 1, Math.floor(Math.max(0, Math.min(0.999999, rng())) * arr.length));
  return arr[idx];
}

export function buildEnglishArcadeQuestion(
  activeTier: DifficultyTier,
  seq: number,
  rng: () => number = Math.random,
): ArcadeQuestion {
  const allSets = BUILTIN_WORD_SETS;
  const preferredSets = allSets.filter((s) => Math.abs(s.tier - activeTier) <= 1);
  const chosenSet =
    preferredSets.length > 0 && rng() < 0.78
      ? pickRandom(preferredSets, rng)
      : pickRandom(allSets, rng);

  const target: TargetWord = pickRandom(chosenSet.words, rng);
  const allWords = allSets.flatMap((s) => s.words);

  const picked: string[] = [];
  const tryPush = (pool: TargetWord[]) => {
    for (const w of shuffleWithRng(pool, rng)) {
      if (picked.length >= 3) break;
      if (w.word.toLowerCase() === target.word.toLowerCase()) continue;
      if (picked.some((p) => p.toLowerCase() === w.word.toLowerCase())) continue;
      picked.push(w.word);
    }
  };

  if (target.partOfSpeech === 'word') {
    tryPush(chosenSet.words);
  } else {
    tryPush(chosenSet.words.filter((w) => w.partOfSpeech === target.partOfSpeech));
    tryPush(
      allWords.filter(
        (w) => w.partOfSpeech === target.partOfSpeech && Math.abs(w.tier - target.tier) <= 1,
      ),
    );
    tryPush(allWords.filter((w) => w.partOfSpeech === target.partOfSpeech));
  }
  if (picked.length < 3) tryPush(allWords);

  const promptText = target.sprintSentence ?? target.contextSentence;
  return {
    id: `en-arcade-${seq}-${target.word}`,
    prompt: promptText,
    subHint: `Hint: ${target.plainBridge}`,
    speakText: promptText.replace(/___/g, 'blank'),
    speakLang: 'en-US',
    correctAnswer: target.word,
    choices: shuffleWithRng([target.word, ...picked], rng).map((w) => ({ label: w })),
    explanation: `"${target.word}" means ${target.plainBridge} (${target.definition}).`,
  };
}

export function buildMathArcadeQuestion(
  activeTier: DifficultyTier,
  seq: number,
  rng: () => number = Math.random,
): ArcadeQuestion {
  const preferredSets = BUILTIN_MATH_SETS.filter((s) => Math.abs(s.tier - activeTier) <= 1);
  const chosenSet =
    preferredSets.length > 0 && rng() < 0.8
      ? pickRandom(preferredSets, rng)
      : pickRandom(BUILTIN_MATH_SETS, rng);

  const baseSkill = pickRandom(chosenSet.items, rng);
  const dynamic = generateDynamicMathItem(baseSkill, rng);

  return {
    id: `math-arcade-${seq}-${dynamic.id}`,
    prompt: dynamic.sprintPrompt,
    subHint: `${chosenSet.title} · Tier ${dynamic.tier}`,
    visual: dynamic.sprintVisual,
    revealVisualOnFeedback: dynamic.revealVisualOnFeedback,
    correctAnswer: dynamic.correctAnswer,
    choices: shuffleWithRng([dynamic.correctAnswer, ...dynamic.distractors], rng).map((c) => ({
      label: c,
    })),
    explanation: dynamic.explanation,
  };
}

export function buildChineseArcadeQuestion(
  activeTier: DifficultyTier,
  seq: number,
  rng: () => number = Math.random,
): ArcadeQuestion {
  const preferredSets = BUILTIN_CHINESE_SETS.filter((s) => Math.abs(s.tier - activeTier) <= 1);
  const chosenSet =
    preferredSets.length > 0 && rng() < 0.78
      ? pickRandom(preferredSets, rng)
      : pickRandom(BUILTIN_CHINESE_SETS, rng);

  const target: ChineseTargetWord = pickRandom(chosenSet.words, rng);
  const allWords = BUILTIN_CHINESE_SETS.flatMap((s) => s.words);

  const picked: { label: string; zhuyin: string }[] = [];
  const tryPush = (pool: ChineseTargetWord[]) => {
    for (const w of shuffleWithRng(pool, rng)) {
      if (picked.length >= 3) break;
      if (w.word === target.word) continue;
      if (picked.some((p) => p.label === w.word)) continue;
      picked.push({ label: w.word, zhuyin: w.zhuyin });
    }
  };

  if (target.partOfSpeech === 'word') {
    tryPush(chosenSet.words);
  } else {
    tryPush(chosenSet.words.filter((w) => w.partOfSpeech === target.partOfSpeech));
    tryPush(
      allWords.filter(
        (w) => w.partOfSpeech === target.partOfSpeech && Math.abs(w.tier - target.tier) <= 1,
      ),
    );
    tryPush(allWords.filter((w) => w.partOfSpeech === target.partOfSpeech));
  }
  if (picked.length < 3) tryPush(allWords);

  const subHint = target.plainBridge.includes(target.word)
    ? target.englishBridge
    : `${target.englishBridge} · ${target.plainBridge}`;

  return {
    id: `zh-arcade-${seq}-${target.word}`,
    prompt: target.sprintSentence,
    subHint,
    speakText: target.sprintSentence.replace(/___/g, '什麼'),
    speakLang: 'zh-TW',
    correctAnswer: target.word,
    choices: shuffleWithRng([{ label: target.word, zhuyin: target.zhuyin }, ...picked], rng),
    explanation: `「${target.word}」＝ ${target.plainBridge}（${target.englishBridge}）`,
  };
}

export function generateArcadeQuestion(
  subjectId: SubjectId,
  activeTier: DifficultyTier,
  seq: number,
  rng: () => number = Math.random,
): ArcadeQuestion {
  if (subjectId === 'math') return buildMathArcadeQuestion(activeTier, seq, rng);
  if (subjectId === 'chinese') return buildChineseArcadeQuestion(activeTier, seq, rng);
  return buildEnglishArcadeQuestion(activeTier, seq, rng);
}

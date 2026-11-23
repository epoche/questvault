import type { RadicalCharItem, RadicalFamily } from './radicalTypes';

export const RADICAL_BASE_TOKENS = 25;
export const RADICAL_PERFECT_BONUS = 5;

export interface RadicalChoiceOption {
  id: string;
  radical: string;
  radicalName: string;
  isCorrect: boolean;
}

export interface RadicalBuilderQuestion {
  id: string;
  item: RadicalCharItem;
  maskedSampleWord: string;
  promptZh: string;
  choices: RadicalChoiceOption[];
}

export interface RadicalSprintChoice {
  char: string;
  zhuyin: string;
  isCorrect: boolean;
}

export interface RadicalSprintQuestion {
  id: string;
  item: RadicalCharItem;
  prompt: string;
  hintEn: string;
  speakText: string;
  choices: RadicalSprintChoice[];
}

const COMMON_RADICAL_POOL: { radical: string; radicalName: string }[] = [
  { radical: '氵', radicalName: '三點水' },
  { radical: '木', radicalName: '木字旁' },
  { radical: '火', radicalName: '火字旁' },
  { radical: '口', radicalName: '口字旁' },
  { radical: '忄', radicalName: '豎心旁' },
  { radical: '訁', radicalName: '言字旁' },
  { radical: '釒', radicalName: '金字旁' },
  { radical: '糹', radicalName: '糸字旁' },
  { radical: '扌', radicalName: '提手旁' },
  { radical: '足', radicalName: '足字旁' },
  { radical: '目', radicalName: '目字旁' },
  { radical: '艹', radicalName: '草字頭' },
  { radical: '土', radicalName: '土字旁' },
  { radical: '日', radicalName: '日字旁' },
  { radical: '石', radicalName: '石字旁' },
  { radical: '女', radicalName: '女字旁' },
];

function shuffleWithRng<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function maskTargetChar(text: string, targetChar: string): string {
  return text.split(targetChar).join('□');
}

/**
 * Stage 1: Radical Block Builder.
 * Shows the partner component + masked sample word + English clue,
 * and asks the learner to snap the right semantic radical block onto it.
 */
export function buildRadicalBuilderQuestions(
  family: RadicalFamily,
  rng: () => number = Math.random,
): RadicalBuilderQuestion[] {
  const ordered = shuffleWithRng(family.items, rng);

  return ordered.map((item, idx) => {
    const distractors: { radical: string; radicalName: string }[] = [];
    const seen = new Set<string>([item.radical]);

    // Prefer sibling radicals from the same family first (for phonetic families)
    for (const sibling of shuffleWithRng(family.items, rng)) {
      if (distractors.length >= 3) break;
      if (seen.has(sibling.radical)) continue;
      seen.add(sibling.radical);
      distractors.push({ radical: sibling.radical, radicalName: sibling.radicalName });
    }

    // Fill remaining distractors from curated elementary radical pool (for semantic families)
    for (const entry of shuffleWithRng(COMMON_RADICAL_POOL, rng)) {
      if (distractors.length >= 3) break;
      if (seen.has(entry.radical)) continue;
      seen.add(entry.radical);
      distractors.push(entry);
    }

    const choices: RadicalChoiceOption[] = shuffleWithRng(
      [
        {
          id: `${item.char}-correct-${item.radical}`,
          radical: item.radical,
          radicalName: item.radicalName,
          isCorrect: true,
        },
        ...distractors.map((d, dIdx) => ({
          id: `${item.char}-dist-${dIdx}-${d.radical}`,
          radical: d.radical,
          radicalName: d.radicalName,
          isCorrect: false,
        })),
      ],
      rng,
    );

    const maskedSampleWord = maskTargetChar(item.sampleWord, item.char);

    return {
      id: `${family.id}-build-${idx}-${item.char}`,
      item,
      maskedSampleWord,
      promptZh: `要拼出「${maskedSampleWord}」裡的字，該幫「${item.component}」加上哪個部首？`,
      choices,
    };
  });
}

/**
 * Stage 2: Same-Family Context Sprint.
 * Distinguishes the 5 look-alike / same-family characters inside authentic context sentences.
 */
export function buildRadicalSprintQuestions(
  family: RadicalFamily,
  rng: () => number = Math.random,
): RadicalSprintQuestion[] {
  const ordered = shuffleWithRng(family.items, rng);

  return ordered.map((item, idx) => {
    const siblings = shuffleWithRng(
      family.items.filter((other) => other.char !== item.char),
      rng,
    ).slice(0, 3);

    const choices: RadicalSprintChoice[] = shuffleWithRng(
      [
        { char: item.char, zhuyin: item.zhuyin, isCorrect: true },
        ...siblings.map((s) => ({ char: s.char, zhuyin: s.zhuyin, isCorrect: false })),
      ],
      rng,
    );

    return {
      id: `${family.id}-sprint-${idx}-${item.char}`,
      item,
      prompt: item.blankSentence,
      hintEn: item.blankHintEn,
      speakText: item.blankSentence.replace(/___/g, '什麼'),
      choices,
    };
  });
}

export function calculateRadicalRunTokens(totalQuestions: number, firstTryCorrect: number): number {
  const safeTotal = Math.max(1, totalQuestions);
  const ratio = Math.max(0, Math.min(1, firstTryCorrect / safeTotal));
  const bonus = ratio >= 0.9 ? RADICAL_PERFECT_BONUS : ratio >= 0.7 ? 2 : 0;
  return RADICAL_BASE_TOKENS + bonus;
}

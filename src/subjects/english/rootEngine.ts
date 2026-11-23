import type { EnglishRootFamily, EnglishRootItem } from './rootsGrammarTypes';

export interface EnglishRootBuilderChoice {
  id: string;
  basePart: string;
  isCorrect: boolean;
}

export interface EnglishRootBuilderQuestion {
  id: string;
  item: EnglishRootItem;
  choices: EnglishRootBuilderChoice[];
}

export interface EnglishRootSprintChoice {
  word: string;
  isCorrect: boolean;
}

export interface EnglishRootSprintQuestion {
  id: string;
  item: EnglishRootItem;
  choices: EnglishRootSprintChoice[];
}

function deterministicShuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = [...arr];
  let s = seed >>> 0;
  for (let i = out.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/**
 * Stage 1: Root Block Builder — given the morpheme block + word meaning clue,
 * pick the matching base part from 4 choices within the same family.
 */
export function buildEnglishRootBuilderQuestions(
  family: EnglishRootFamily,
): EnglishRootBuilderQuestion[] {
  return family.items.map((item, idx) => {
    const others = family.items.filter((o) => o.word !== item.word);
    const distractors = deterministicShuffle(others, hashSeed(`${family.id}:b:${idx}`)).slice(0, 3);
    const rawChoices: EnglishRootBuilderChoice[] = [
      { id: `${item.word}-ok`, basePart: item.basePart, isCorrect: true },
      ...distractors.map((d, di) => ({
        id: `${item.word}-d${di}`,
        basePart: d.basePart,
        isCorrect: false,
      })),
    ];
    return {
      id: `${family.id}-build-${idx}`,
      item,
      choices: deterministicShuffle(rawChoices, hashSeed(`${family.id}:bc:${item.word}`)),
    };
  });
}

/**
 * Stage 2: Same-Family Context Sprint — fill in the blank in a fresh transfer sentence
 * by choosing the exact word out of 4 same-family words.
 */
export function buildEnglishRootSprintQuestions(
  family: EnglishRootFamily,
): EnglishRootSprintQuestion[] {
  const ordered = deterministicShuffle(family.items, hashSeed(`${family.id}:sprint`));
  return ordered.map((item, idx) => {
    const others = family.items.filter((o) => o.word !== item.word);
    const distractors = deterministicShuffle(others, hashSeed(`${family.id}:s:${idx}`)).slice(0, 3);
    const rawChoices: EnglishRootSprintChoice[] = [
      { word: item.word, isCorrect: true },
      ...distractors.map((d) => ({ word: d.word, isCorrect: false })),
    ];
    return {
      id: `${family.id}-sprint-${idx}`,
      item,
      choices: deterministicShuffle(rawChoices, hashSeed(`${family.id}:sc:${item.word}`)),
    };
  });
}

export function calculateEnglishRootRunTokens(
  totalQuestions: number,
  firstTryCorrect: number,
): number {
  const base = 30;
  const accuracyBonus = Math.round((firstTryCorrect / Math.max(1, totalQuestions)) * 20);
  return base + accuracyBonus;
}

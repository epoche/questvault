import type { DifficultyTier } from '../../core/types';

export interface SpellingItem {
  id: string;
  word: string;
  ruleTag: string;
  trickyPart: string;
  definition: string;
  /** Context sentence with ___ masking the target word (strictly no spoiler). */
  contextSentence: string;
  memoryTip: string;
}

export interface SpellingSet {
  id: string;
  tier: DifficultyTier;
  title: string;
  subtitle: string;
  badge: string;
  emblemCollectibleId: string;
  items: SpellingItem[];
}

export const SPELLING_BASE_TOKENS = 25;
export const SPELLING_PERFECT_BONUS = 10;

export function calculateSpellingRunTokens(firstTryCorrect: number, totalItems = 5): number {
  const perfect = firstTryCorrect >= totalItems;
  return SPELLING_BASE_TOKENS + (perfect ? SPELLING_PERFECT_BONUS : 0);
}

/**
 * Builds deterministic letter tiles for iPad tap-to-spell mode:
 * all letters of the target word + 3 plausible decoy letters (never duplicates beyond reasonable count),
 * deterministically shuffled.
 */
export function buildSpellingLetterTiles(word: string, seed = 1): string[] {
  const lower = word.toLowerCase();
  const baseLetters = Array.from(lower);
  const decoyPool = ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'l', 'c', 'h', 'd', 'p'];
  const decoys: string[] = [];
  let idx = (seed * 7 + lower.length * 3) % decoyPool.length;
  while (decoys.length < 3) {
    const ch = decoyPool[idx % decoyPool.length];
    if (!baseLetters.includes(ch) || decoys.length >= 2) {
      decoys.push(ch);
    }
    idx += 5;
  }
  const combined = [...baseLetters, ...decoys];
  // Deterministic Fisher-Yates using LCG
  let s = (seed * 1664525 + 1013904223) >>> 0;
  for (let i = combined.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}

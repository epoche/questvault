import type { DifficultyTier } from '../../core/types';
import { SENTENCE_PATTERN_SETS_PART1 } from './sentencePatternSetsPart1';
import { SENTENCE_PATTERN_SETS_PART2 } from './sentencePatternSetsPart2';
import type { SentencePatternSet } from './sentencePatternTypes';

export * from './sentencePatternTypes';

export const BUILTIN_SENTENCE_PATTERN_SETS: SentencePatternSet[] = [
  ...SENTENCE_PATTERN_SETS_PART1,
  ...SENTENCE_PATTERN_SETS_PART2,
];

export function getSentencePatternSetsByTier(tier: DifficultyTier): SentencePatternSet[] {
  return BUILTIN_SENTENCE_PATTERN_SETS.filter((set) => set.tier === tier);
}

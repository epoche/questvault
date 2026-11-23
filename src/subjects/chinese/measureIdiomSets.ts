import type { DifficultyTier } from '../../core/types';
import { IDIOM_CONTEXT_SETS } from './idiomContextSets';
import type { MeasureIdiomSet } from './measureIdiomTypes';
import { MEASURE_WORD_SETS } from './measureSets';

export type { MeasureIdiomKind, MeasureIdiomQuestion, MeasureIdiomSet } from './measureIdiomTypes';
export { IDIOM_CONTEXT_SETS } from './idiomContextSets';
export { MEASURE_WORD_SETS } from './measureSets';

export const BUILTIN_MEASURE_IDIOM_SETS: MeasureIdiomSet[] = [
  ...MEASURE_WORD_SETS,
  ...IDIOM_CONTEXT_SETS,
];

export function getMeasureIdiomSetsByTier(tier: DifficultyTier): MeasureIdiomSet[] {
  return BUILTIN_MEASURE_IDIOM_SETS.filter((s) => s.tier === tier);
}

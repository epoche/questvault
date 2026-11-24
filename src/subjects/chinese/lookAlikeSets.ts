import type { DifficultyTier } from '../../core/types';
import { LOOK_ALIKE_SETS_PART1 } from './lookAlikeSetsPart1';
import { LOOK_ALIKE_SETS_PART2 } from './lookAlikeSetsPart2';
import type { LookAlikeHanziSet } from './lookAlikeTypes';

export type {
  LookAlikeHanziSet,
  LookAlikeQuestion,
  LookAlikeTwinCard,
} from './lookAlikeTypes';

export const BUILTIN_LOOK_ALIKE_SETS: LookAlikeHanziSet[] = [
  ...LOOK_ALIKE_SETS_PART1,
  ...LOOK_ALIKE_SETS_PART2,
];

export function getLookAlikeSetsByTier(tier: DifficultyTier): LookAlikeHanziSet[] {
  return BUILTIN_LOOK_ALIKE_SETS.filter((s) => s.tier === tier);
}

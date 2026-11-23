import type { DifficultyTier } from '../../core/types';
import { RADICAL_FAMILIES_PART1 } from './radicalFamiliesPart1';
import { RADICAL_FAMILIES_PART2 } from './radicalFamiliesPart2';
import type { RadicalFamily } from './radicalTypes';

export type {
  RadicalCharItem,
  RadicalFamily,
  RadicalFamilyKind,
  RadicalLayout,
} from './radicalTypes';

export const BUILTIN_RADICAL_FAMILIES: RadicalFamily[] = [
  ...RADICAL_FAMILIES_PART1,
  ...RADICAL_FAMILIES_PART2,
];

export function getRadicalFamiliesByTier(tier: DifficultyTier): RadicalFamily[] {
  return BUILTIN_RADICAL_FAMILIES.filter((f) => f.tier === tier);
}

export function getRadicalFamilyById(id: string): RadicalFamily | undefined {
  return BUILTIN_RADICAL_FAMILIES.find((f) => f.id === id);
}

export interface LetterChoiceStyle {
  bg: string;
  border: string;
  badge: string;
}

export interface BlooketChoiceStyle {
  bg: string;
  border: string;
  shape: string;
}

/**
 * Canonical 4-option A/B/C/D palette used across Logic, Mixed Warm-Up,
 * Look-Alike Hanzi, and Figurative Lab views.
 */
export const LETTER_CHOICE_PALETTE: readonly LetterChoiceStyle[] = [
  { bg: '#2563EB', border: '#1E3A8A', badge: 'A' },
  { bg: '#059669', border: '#065F46', badge: 'B' },
  { bg: '#D97706', border: '#92400E', badge: 'C' },
  { bg: '#DB2777', border: '#9D174D', badge: 'D' },
] as const;

/**
 * Canonical Blooket-style 4-color + shape palette (color-blind accessible)
 * used across Arcade games, Chapter Series, Grammar, Roots, Radicals,
 * Bar Models, Sentence Patterns, and Fact Fluency.
 */
export const BLOOKET_CHOICE_PALETTE: readonly BlooketChoiceStyle[] = [
  { bg: '#EF4444', border: '#991B1B', shape: '▲' },
  { bg: '#2563EB', border: '#1E3A8A', shape: '◆' },
  { bg: '#F59E0B', border: '#B45309', shape: '●' },
  { bg: '#059669', border: '#065F46', shape: '■' },
] as const;

import type { DifficultyTier } from '../../core/types';

export type SentencePatternCategory = 'conjunction' | 'structure' | 'rhetoric';

export interface SentencePatternItem {
  id: string;
  category: SentencePatternCategory;
  patternLabel: string;
  englishBridge: string;
  /** Stage 1: Fill-in-the-blank prompt using （　　） placeholders */
  fillPrompt: string;
  /** Space-separated MOE Zhuyin aligned 1:1 to every CJK character in fillPrompt */
  fillPromptZhuyin: string;
  fillAnswer: string;
  fillAnswerZhuyin: string;
  fillChoices: [string, string, string, string];
  /** Stage 2: Reorder semantic chunks to form the complete sentence */
  reorderTarget: string;
  /** Space-separated MOE Zhuyin aligned 1:1 to every CJK character in reorderTarget */
  reorderTargetZhuyin: string;
  /** 4–5 chunks whose exact concatenation equals reorderTarget */
  reorderChunks: string[];
  /** Space-separated MOE Zhuyin per chunk, aligned 1:1 to CJK chars in each chunk */
  reorderChunksZhuyin: string[];
  explanation: string;
}

export interface SentencePatternSet {
  id: string;
  tier: DifficultyTier;
  category: SentencePatternCategory;
  title: string;
  subtitle: string;
  patternBadge: string;
  emblemCollectibleId: string;
  accentHex: string;
  bgHex: string;
  items: SentencePatternItem[];
}

export const SENTENCE_PATTERN_BASE_TOKENS = 35;
export const SENTENCE_PATTERN_PERFECT_BONUS = 15;

import type { DifficultyTier } from '../../core/types';

export type EnglishRootKind = 'prefix' | 'suffix' | 'root';

export interface EnglishRootItem {
  word: string;
  /** Highlighted prefix, suffix, or Greek/Latin root (e.g. 'un-', '-ful', 'tele') */
  morpheme: string;
  /** Companion base word or root part (e.g. 'fair', 'hope', 'scope') */
  basePart: string;
  /** Visual order of the two color blocks */
  order: 'morpheme-first' | 'base-first';
  /** Concise kid-friendly definition of the complete word */
  meaning: string;
  /** Short formula showing how the parts build the meaning */
  formula: string;
  /** Stage 0 example sentence using the word naturally */
  exampleSentence: string;
  /** Stage 2 fill-in-the-blank context sentence containing '___' (must NOT contain the word itself!) */
  sprintSentence: string;
}

export interface EnglishRootFamily {
  id: string;
  kind: EnglishRootKind;
  tier: DifficultyTier;
  morpheme: string;
  morphemeMeaning: string;
  title: string;
  subtitle: string;
  emblemCollectibleId: string;
  accentHex: string;
  bgHex: string;
  items: EnglishRootItem[];
}

export interface GrammarRepairQuestion {
  id: string;
  emoji: string;
  /** Context sentence with a single '___' blank */
  promptSentence: string;
  /** Complete corrected sentence for en-US audio playback */
  spokenFullSentence: string;
  /** Correct repair option */
  targetAnswer: string;
  /** Exactly 4 unique choices */
  choices: [string, string, string, string];
  /** 0-based index of targetAnswer in choices */
  correctIndex: 0 | 1 | 2 | 3;
  /** Short, memorable G4 ELA grammar tip */
  ruleTip: string;
}

export interface GrammarRepairSet {
  id: string;
  tier: DifficultyTier;
  categoryTag: string;
  title: string;
  subtitle: string;
  emblemCollectibleId: string;
  accentHex: string;
  bgHex: string;
  questions: GrammarRepairQuestion[];
}

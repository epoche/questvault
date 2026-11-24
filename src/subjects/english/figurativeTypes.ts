import type { DifficultyTier } from '../../core/types';

export type FigurativeCategory =
  | 'simile'
  | 'metaphor'
  | 'personification'
  | 'idiom'
  | 'hyperbole-alliteration'
  | 'context-clues'
  | 'mixed';

export interface FigurativeQuestion {
  id: string;
  emoji: string;
  /** Highlighted literary sentence or short 1–2 sentence passage */
  passage: string;
  /** Clear question stem (e.g. 'What does this metaphor mean?' or 'Which word best matches the bold word?') */
  question: string;
  /** Highlighted target phrase or clue word to emphasize visually */
  highlightPhrase?: string;
  /** Spoken text for en-US TTS button */
  spokenText: string;
  /** Exactly 4 unique Grade-4 friendly choices */
  choices: [string, string, string, string];
  /** 0-based index of correct choice */
  correctIndex: 0 | 1 | 2 | 3;
  /** Short memorable Grade 4 ELA explanation in English */
  explanationEn: string;
  /** Helpful Traditional Chinese (Taiwan) bridge note */
  explanationZh: string;
}

export interface FigurativeQuestSet {
  id: string;
  tier: DifficultyTier;
  category: FigurativeCategory;
  categoryTag: string;
  title: string;
  subtitle: string;
  emblemCollectibleId: string;
  accentHex: string;
  bgHex: string;
  questions: FigurativeQuestion[];
}

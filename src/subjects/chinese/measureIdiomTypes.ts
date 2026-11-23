import type { DifficultyTier } from '../../core/types';

export type MeasureIdiomKind = 'measure' | 'idiom';

export interface MeasureIdiomQuestion {
  id: string;
  /** Kid-friendly visual icon cue */
  visualEmoji: string;
  /** Correct Traditional Chinese answer (measure word, confusable word, or 4-char idiom) */
  targetAnswer: string;
  /** Taiwan MOE standard Zhuyin for targetAnswer (space-separated per character) */
  targetZhuyin: string;
  /** Context sentence containing '___' (must not contain targetAnswer verbatim) */
  promptSentence: string;
  /** Full Traditional Chinese sentence with targetAnswer filled in for zh-TW audio playback */
  spokenFullSentence: string;
  /** Concise English meaning / usage bridge for bilingual G4 learner */
  englishBridge: string;
  /** Exactly 4 unique Traditional Chinese choices */
  choices: [string, string, string, string];
  /** Taiwan MOE standard Zhuyin for each of the 4 choices */
  choiceZhuyins: [string, string, string, string];
  /** 0-based index of targetAnswer in choices */
  correctIndex: 0 | 1 | 2 | 3;
  /** Short Taiwan Traditional Chinese explanation / rule of thumb */
  explanation: string;
}

export interface MeasureIdiomSet {
  id: string;
  kind: MeasureIdiomKind;
  tier: DifficultyTier;
  title: string;
  subtitle: string;
  shortTag: string;
  emblemCollectibleId: string;
  accentHex: string;
  bgHex: string;
  questions: MeasureIdiomQuestion[];
}

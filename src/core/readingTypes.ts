import type { DifficultyTier } from './types';

export type ReadingSkillTag =
  | 'Context Clues'
  | 'Inference'
  | 'Main Idea'
  | 'Figurative'
  | '語境理解'
  | '成語運用'
  | '文意推論'
  | '細節閱讀';

export interface ReadingSpotlightWord {
  word: string;
  zhuyin?: string;
  hint: string;
}

export interface ReadingQuestion {
  id: string;
  skillTag: ReadingSkillTag;
  prompt: string;
  choices: [string, string, string, string];
  /** Optional parallel Zhuyin strings for Chinese choices when showZhuyin is ON */
  choiceZhuyin?: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  titleZhuyin?: string;
  /** 2 to 4 concise, engaging sentences */
  sentences: string[];
  /**
   * Optional per-sentence MOE Zhuyin for Traditional Chinese passages.
   * Each space-separated syllable aligns 1-to-1 with every CJK Han character
   * in the corresponding sentence (skipping punctuation, spaces, and digits).
   */
  sentencesZhuyin?: string[];
  /** Optional English gist hint for Traditional Chinese stories */
  englishGist?: string;
  spotlightVocab: ReadingSpotlightWord[];
  questions: [ReadingQuestion, ReadingQuestion, ReadingQuestion];
}

export interface ReadingQuestSet {
  id: string;
  subjectId: 'english' | 'chinese';
  tier: DifficultyTier;
  title: string;
  shortTag: string;
  accentHex: string;
  bgHex: string;
  emblemCollectibleId: string;
  passages: [ReadingPassage, ReadingPassage];
}

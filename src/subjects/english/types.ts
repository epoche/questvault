import type { DifficultyTier } from '../../core/types';

export interface TargetWord {
  word: string;
  tier: DifficultyTier;
  partOfSpeech: 'verb' | 'adjective' | 'noun' | 'word';
  plainBridge: string;
  definition: string;
  contextSentence: string;
  sprintSentence?: string;
  upgradeBefore?: string;
  upgradePlainSpan?: string;
  upgradeAfter?: string;
  tip?: string;
}

export interface WordSet {
  id: string;
  subjectId: 'english';
  tier: DifficultyTier;
  title: string;
  shortTag: string;
  accentHex: string;
  bgHex: string;
  emblemCollectibleId: string;
  isCustom?: boolean;
  isRematch?: boolean;
  tokenMultiplier?: number;
  forgeScenario: string;
  starterChips?: string[];
  words: TargetWord[];
}

export interface SprintQuestion {
  id: string;
  targetWord: TargetWord;
  promptText: string;
  correctWord: string;
  choices: string[];
}

export interface UpgradeQuestion {
  id: string;
  targetWord: TargetWord;
  sentenceBefore: string;
  plainSpan: string;
  sentenceAfter: string;
  correctWord: string;
  choices: string[];
}

export interface ForgePrompt {
  scenario: string;
  targetWords: string[];
  starterChips: string[];
  wordGlossary: { word: string; plainBridge: string; definition: string }[];
}

export interface EnglishRunPlan {
  wordSet: WordSet;
  spotlightWords: TargetWord[];
  sprintQuestions: SprintQuestion[];
  upgradeQuestions: UpgradeQuestion[];
  forgePrompt: ForgePrompt;
}

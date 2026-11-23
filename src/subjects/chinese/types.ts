import type { DifficultyTier } from '../../core/types';

export interface ChineseTargetWord {
  word: string;
  zhuyin: string;
  tier: DifficultyTier;
  partOfSpeech: 'verb' | 'adjective' | 'noun' | 'idiom' | 'word';
  englishBridge: string;
  plainBridge: string;
  contextSentence: string;
  sprintSentence: string;
  upgradeBefore?: string;
  upgradePlainSpan?: string;
  upgradeAfter?: string;
}

export interface ChineseWordSet {
  id: string;
  subjectId: 'chinese';
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
  starterChips: string[];
  words: ChineseTargetWord[];
}

export interface ChineseSprintQuestion {
  id: string;
  targetWord: ChineseTargetWord;
  promptText: string;
  correctWord: string;
  choices: { word: string; zhuyin: string }[];
}

export interface ChineseUpgradeQuestion {
  id: string;
  targetWord: ChineseTargetWord;
  sentenceBefore: string;
  plainSpan: string;
  sentenceAfter: string;
  correctWord: string;
  choices: { word: string; zhuyin: string }[];
}

export interface ChineseForgePrompt {
  scenario: string;
  targetWords: string[];
  starterChips: string[];
  wordGlossary: { word: string; zhuyin: string; englishBridge: string; plainBridge: string }[];
}

export interface ChineseRunPlan {
  wordSet: ChineseWordSet;
  spotlightWords: ChineseTargetWord[];
  sprintQuestions: ChineseSprintQuestion[];
  upgradeQuestions: ChineseUpgradeQuestion[];
  forgePrompt: ChineseForgePrompt;
}

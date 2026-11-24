import type { DifficultyTier } from '../../core/types';

export interface LookAlikeTwinCard {
  /** Single Traditional Chinese character (e.g. '晴') */
  char: string;
  /** Taiwan MOE standard Zhuyin for the single character (e.g. 'ㄑㄧㄥˊ') */
  zhuyin: string;
  /** Highlighted visual radical / stroke cue (e.g. '日部（太陽）') */
  radicalCue: string;
  /** Concise Taiwan Traditional Chinese memory tip distinguishing this twin */
  diffTipZh: string;
  /** Concise English meaning bridge for bilingual G4 learner */
  diffTipEn: string;
  /** Vivid 2-character sample word using this character (e.g. '晴天') */
  sampleWord: string;
  /** Space-separated Taiwan MOE Zhuyin matching sampleWord 1:1 (e.g. 'ㄑㄧㄥˊ ㄊㄧㄢ') */
  sampleZhuyin: string;
}

export interface LookAlikeQuestion {
  id: string;
  emoji: string;
  /** Target single Traditional Chinese character */
  targetChar: string;
  /** Taiwan MOE standard Zhuyin for targetChar in this context */
  targetZhuyin: string;
  /** Context sentence containing a single '___' blank (must NOT contain targetChar!) */
  promptSentence: string;
  /** Space-separated Taiwan MOE Zhuyin for EVERY CJK character in promptSentence (excluding '___') */
  promptZhuyin: string;
  /** Complete Traditional Chinese sentence with targetChar filled in for zh-TW speech */
  spokenFullSentence: string;
  /** Concise English bridge for the target word/phrase */
  englishBridge: string;
  /** Exactly 4 unique single-character Traditional Chinese choices */
  choices: [string, string, string, string];
  /** Taiwan MOE standard Zhuyin for each of the 4 choices */
  choiceZhuyins: [string, string, string, string];
  /** 0-based index of targetChar in choices */
  correctIndex: 0 | 1 | 2 | 3;
  /** Short Taiwan Traditional Chinese visual/radical explanation */
  explanation: string;
}

export interface LookAlikeHanziSet {
  id: string;
  tier: DifficultyTier;
  /** Short group title (e.g. '晴・睛・請・清') */
  title: string;
  subtitle: string;
  shortTag: string;
  emblemCollectibleId: string;
  accentHex: string;
  bgHex: string;
  /** Stage 1 side-by-side visual comparison cards (2–4 twin characters) */
  twins: LookAlikeTwinCard[];
  /** Stage 2 context fill-in-the-blank sprint (exactly 5 questions) */
  questions: LookAlikeQuestion[];
}

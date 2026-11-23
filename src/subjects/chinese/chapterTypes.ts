import type { DifficultyTier } from '../../core/types';

export interface ChapterQuestion {
  id: string;
  skillTag: '主旨理解' | '細節閱讀' | '詞義推論' | '劇情推理';
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface ChapterVocabSpot {
  word: string;
  zhuyin: string;
  hint: string;
}

export interface ChapterEpisode {
  id: string;
  episodeNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  titleZhuyin: string;
  /** Short 1-line recap of previous episode (empty for EP1) */
  prevRecap?: string;
  /** 3–5 vivid Traditional Chinese sentences */
  sentences: string[];
  /** Taiwan MOE Zhuyin aligned 1:1 with every CJK Han character in each sentence */
  sentencesZhuyin: string[];
  /** Kid-friendly English episode summary bridge */
  englishGist: string;
  /** 2–3 spotlight vocabulary words from the episode */
  spotlightVocab: ChapterVocabSpot[];
  /** Exactly 3 distinct reading comprehension questions */
  questions: [ChapterQuestion, ChapterQuestion, ChapterQuestion];
}

export interface ChapterSeries {
  id: string;
  tier: DifficultyTier;
  title: string;
  tagline: string;
  genreTag: string;
  accentHex: string;
  bgHex: string;
  emblemCollectibleId: string;
  episodes: [
    ChapterEpisode,
    ChapterEpisode,
    ChapterEpisode,
    ChapterEpisode,
    ChapterEpisode,
  ];
}

export const CHAPTER_EPISODE_BASE_TOKENS = 20;
export const CHAPTER_EPISODE_PERFECT_BONUS = 5;
export const CHAPTER_SERIES_CHEST_BONUS = 40;

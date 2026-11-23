import type { DifficultyTier } from '../../core/types';

export interface EnglishChapterQuestion {
  id: string;
  skillTag: 'Main Idea' | 'Detail' | 'Inference' | 'Vocabulary' | 'Character';
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface EnglishChapterVocab {
  word: string;
  meaning: string;
}

export interface EnglishChapterEpisode {
  id: string;
  episodeNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  cliffhanger?: string;
  paragraphs: string[];
  keyVocab: EnglishChapterVocab[];
  questions: [EnglishChapterQuestion, EnglishChapterQuestion, EnglishChapterQuestion];
}

export interface EnglishChapterSeries {
  id: string;
  tier: DifficultyTier;
  title: string;
  subtitle: string;
  genreTag: string;
  accentHex: string;
  bgHex: string;
  emblemCollectibleId: string;
  synopsis: string;
  episodes: [
    EnglishChapterEpisode,
    EnglishChapterEpisode,
    EnglishChapterEpisode,
    EnglishChapterEpisode,
    EnglishChapterEpisode,
  ];
}

export const EN_CHAPTER_EPISODE_BASE_TOKENS = 20;
export const EN_CHAPTER_EPISODE_PERFECT_BONUS = 10;
export const EN_CHAPTER_SERIES_CHEST_BONUS = 40;

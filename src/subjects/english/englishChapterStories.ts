import { ENGLISH_CHAPTER_SERIES_PART1 } from './englishChapterStoriesPart1';
import { ENGLISH_CHAPTER_SERIES_PART2 } from './englishChapterStoriesPart2';
import {
  EN_CHAPTER_EPISODE_BASE_TOKENS,
  EN_CHAPTER_EPISODE_PERFECT_BONUS,
  EN_CHAPTER_SERIES_CHEST_BONUS,
  type EnglishChapterSeries,
} from './englishChapterTypes';

export {
  EN_CHAPTER_EPISODE_BASE_TOKENS,
  EN_CHAPTER_EPISODE_PERFECT_BONUS,
  EN_CHAPTER_SERIES_CHEST_BONUS,
};
export type {
  EnglishChapterEpisode,
  EnglishChapterQuestion,
  EnglishChapterSeries,
  EnglishChapterVocab,
} from './englishChapterTypes';

export const BUILTIN_ENGLISH_CHAPTER_SERIES: EnglishChapterSeries[] = [
  ...ENGLISH_CHAPTER_SERIES_PART1,
  ...ENGLISH_CHAPTER_SERIES_PART2,
];

export function isEnglishEpisodeUnlocked(
  series: EnglishChapterSeries,
  episodeNumber: 1 | 2 | 3 | 4 | 5,
  completedEpisodeIds: string[],
): boolean {
  if (episodeNumber === 1) return true;
  const prevEp = series.episodes.find((e) => e.episodeNumber === episodeNumber - 1);
  return Boolean(prevEp && completedEpisodeIds.includes(prevEp.id));
}

export function getEnglishSeriesCompletedCount(
  series: EnglishChapterSeries,
  completedEpisodeIds: string[],
): number {
  return series.episodes.filter((ep) => completedEpisodeIds.includes(ep.id)).length;
}

export function isEnglishSeriesFullyCompleted(
  series: EnglishChapterSeries,
  completedEpisodeIds: string[],
): boolean {
  return getEnglishSeriesCompletedCount(series, completedEpisodeIds) === series.episodes.length;
}

export function calculateEnglishChapterTokens(firstTryCorrect: number, totalQuestions = 3): number {
  const perfect = firstTryCorrect >= totalQuestions;
  return EN_CHAPTER_EPISODE_BASE_TOKENS + (perfect ? EN_CHAPTER_EPISODE_PERFECT_BONUS : 0);
}

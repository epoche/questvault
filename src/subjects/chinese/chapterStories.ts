import { CHAPTER_SERIES_PART1 } from './chapterStoriesPart1';
import { CHAPTER_SERIES_PART2 } from './chapterStoriesPart2';
import { CHAPTER_SERIES_SEASON2_PART1 } from './chapterStoriesSeason2Part1';
import { CHAPTER_SERIES_SEASON2_PART2 } from './chapterStoriesSeason2Part2';
import {
  CHAPTER_EPISODE_BASE_TOKENS,
  CHAPTER_EPISODE_PERFECT_BONUS,
  CHAPTER_SERIES_CHEST_BONUS,
  type ChapterEpisode,
  type ChapterSeries,
} from './chapterTypes';

export {
  CHAPTER_EPISODE_BASE_TOKENS,
  CHAPTER_EPISODE_PERFECT_BONUS,
  CHAPTER_SERIES_CHEST_BONUS,
};
export type {
  ChapterEpisode,
  ChapterQuestion,
  ChapterSeries,
  ChapterVocabSpot,
} from './chapterTypes';

export const BUILTIN_CHAPTER_SERIES: ChapterSeries[] = [
  ...CHAPTER_SERIES_PART1,
  ...CHAPTER_SERIES_PART2,
  ...CHAPTER_SERIES_SEASON2_PART1,
  ...CHAPTER_SERIES_SEASON2_PART2,
];

export function getChapterSeriesById(id: string): ChapterSeries | undefined {
  return BUILTIN_CHAPTER_SERIES.find((s) => s.id === id);
}

/**
 * Episode 1 is always unlocked. Episode N (N >= 2) unlocks as soon as Episode N-1
 * is present in completedEpisodeIds.
 */
export function isEpisodeUnlocked(
  series: ChapterSeries,
  episodeNumber: 1 | 2 | 3 | 4 | 5,
  completedEpisodeIds: string[],
): boolean {
  if (episodeNumber === 1) return true;
  const prevEp = series.episodes.find((e) => e.episodeNumber === episodeNumber - 1);
  return Boolean(prevEp && completedEpisodeIds.includes(prevEp.id));
}

export function getSeriesCompletedCount(
  series: ChapterSeries,
  completedEpisodeIds: string[],
): number {
  return series.episodes.filter((ep) => completedEpisodeIds.includes(ep.id)).length;
}

export function isSeriesFullyCompleted(
  series: ChapterSeries,
  completedEpisodeIds: string[],
): boolean {
  return getSeriesCompletedCount(series, completedEpisodeIds) === series.episodes.length;
}

export function calculateChapterEpisodeTokens(firstTryCorrect: number, totalQuestions = 3): number {
  const perfect = firstTryCorrect >= totalQuestions;
  return CHAPTER_EPISODE_BASE_TOKENS + (perfect ? CHAPTER_EPISODE_PERFECT_BONUS : 0);
}

export function getNextUnlockedEpisode(
  series: ChapterSeries,
  completedEpisodeIds: string[],
): ChapterEpisode {
  for (const ep of series.episodes) {
    if (!completedEpisodeIds.includes(ep.id)) return ep;
  }
  return series.episodes[series.episodes.length - 1];
}

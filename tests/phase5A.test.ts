import { describe, expect, it } from 'vitest';
import {
  claimEnglishChapterSeriesChest,
  createInitialPlayerState,
} from '../src/core/economy';
import { getCollectibleById } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  BUILTIN_ENGLISH_CHAPTER_SERIES,
  calculateEnglishChapterTokens,
  EN_CHAPTER_SERIES_CHEST_BONUS,
  isEnglishEpisodeUnlocked,
} from '../src/subjects/english/englishChapterStories';
import { ENGLISH_SPELLING_SETS, getSpellingSetsByTier } from '../src/subjects/english/spellingSets';
import {
  buildSpellingLetterTiles,
  calculateSpellingRunTokens,
} from '../src/subjects/english/spellingTypes';

describe('Phase 5A Layer 1: English Spelling Bee (80 words) & Chapter Stories (4 series / 60 Qs)', () => {
  it('validates all 16 Spelling Bee sets (80 unique words) with zero spoilers and accurate letter tiles', () => {
    expect(ENGLISH_SPELLING_SETS).toHaveLength(16);
    for (const t of [1, 2, 3, 4] as const) {
      expect(getSpellingSetsByTier(t)).toHaveLength(4);
    }

    const seenWords = new Set<string>();
    const seenIds = new Set<string>();
    for (const set of ENGLISH_SPELLING_SETS) {
      expect(getCollectibleById(set.emblemCollectibleId)).toBeTruthy();
      expect(set.items).toHaveLength(5);
      for (const item of set.items) {
        expect(seenIds.has(item.id)).toBe(false);
        seenIds.add(item.id);
        expect(item.word).toMatch(/^[a-z]+$/);
        expect(seenWords.has(item.word)).toBe(false);
        seenWords.add(item.word);

        // trickyPart must exist in word (or be a documented pattern)
        expect(item.word.includes(item.trickyPart.toLowerCase())).toBe(true);

        // Exactly one ___ mask in contextSentence and zero literal word leaks
        const blankMatches = item.contextSentence.match(/___/g) ?? [];
        expect(blankMatches).toHaveLength(1);
        const wordRe = new RegExp(`\\b${item.word}\\b`, 'i');
        expect(wordRe.test(item.contextSentence)).toBe(false);
        expect(wordRe.test(item.definition)).toBe(false);

        // Letter tiles must contain every character of target word (with multiplicity)
        const tiles = buildSpellingLetterTiles(item.word, 3);
        expect(tiles.length).toBe(item.word.length + 3);
        const remaining = [...tiles];
        for (const ch of item.word) {
          const idx = remaining.indexOf(ch);
          expect(idx).toBeGreaterThanOrEqual(0);
          remaining.splice(idx, 1);
        }
      }
    }
    expect(seenWords.size).toBe(80);
    expect(calculateSpellingRunTokens(5, 5)).toBe(35);
    expect(calculateSpellingRunTokens(3, 5)).toBe(25);
  });

  it('validates all 4 English Chapter Story Series (20 episodes / 60 questions) and series chest locking', () => {
    expect(BUILTIN_ENGLISH_CHAPTER_SERIES).toHaveLength(4);
    const seenEpIds = new Set<string>();
    const seenQIds = new Set<string>();

    for (const series of BUILTIN_ENGLISH_CHAPTER_SERIES) {
      expect(getCollectibleById(series.emblemCollectibleId)).toBeTruthy();
      expect(series.episodes).toHaveLength(5);

      for (let i = 0; i < 5; i += 1) {
        const ep = series.episodes[i];
        expect(ep.episodeNumber).toBe(i + 1);
        expect(seenEpIds.has(ep.id)).toBe(false);
        seenEpIds.add(ep.id);
        expect(ep.paragraphs.length).toBeGreaterThanOrEqual(3);
        expect(ep.keyVocab).toHaveLength(3);
        expect(ep.questions).toHaveLength(3);

        const bodyLower = ep.paragraphs.join(' ').toLowerCase();
        for (const kv of ep.keyVocab) {
          expect(bodyLower.includes(kv.word.toLowerCase())).toBe(true);
        }

        for (const q of ep.questions) {
          expect(seenQIds.has(q.id)).toBe(false);
          seenQIds.add(q.id);
          expect(q.choices).toHaveLength(4);
          expect(new Set(q.choices.map((c) => c.trim().toLowerCase())).size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation.length).toBeGreaterThan(10);
        }
      }

      // Unlock logic
      expect(isEnglishEpisodeUnlocked(series, 1, [])).toBe(true);
      expect(isEnglishEpisodeUnlocked(series, 2, [])).toBe(false);
      expect(isEnglishEpisodeUnlocked(series, 2, [series.episodes[0].id])).toBe(true);
    }

    expect(seenEpIds.size).toBe(20);
    expect(seenQIds.size).toBe(60);
    expect(calculateEnglishChapterTokens(3, 3)).toBe(30);
    expect(calculateEnglishChapterTokens(2, 3)).toBe(20);

    // Series chest claiming & anti-double-claim
    const s1 = BUILTIN_ENGLISH_CHAPTER_SERIES[0];
    const reqIds = s1.episodes.map((e) => e.id);
    const incomplete = claimEnglishChapterSeriesChest(createInitialPlayerState(), s1.id, reqIds);
    expect(incomplete.ok).toBe(false);

    const ready = {
      ...createInitialPlayerState(),
      completedEnglishChapterIds: reqIds,
    };
    const claimed = claimEnglishChapterSeriesChest(ready, s1.id, reqIds, EN_CHAPTER_SERIES_CHEST_BONUS);
    expect(claimed.ok).toBe(true);
    if (!claimed.ok) return;
    expect(claimed.state.tokens).toBe(ready.tokens + EN_CHAPTER_SERIES_CHEST_BONUS);

    const dup = claimEnglishChapterSeriesChest(claimed.state, s1.id, reqIds);
    expect(dup.ok).toBe(false);
  });

  it('roundtrips Phase 5A completion fields cleanly through v1 JSON backup/restore', () => {
    const state = {
      ...createInitialPlayerState('Chloe'),
      completedSpellingIds: ['en-spell-t1-01'],
      completedEnglishChapterIds: ['en-ch-mystery-ep1', 'en-ch-mystery-ep2'],
      claimedEnglishChapterSeriesIds: ['en-ch-mystery'],
    };
    const json = exportPlayerStateJson(state);
    const res = importPlayerStateJson(json);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.state.completedSpellingIds).toEqual(['en-spell-t1-01']);
    expect(res.state.completedEnglishChapterIds).toEqual(['en-ch-mystery-ep1', 'en-ch-mystery-ep2']);
    expect(res.state.claimedEnglishChapterSeriesIds).toEqual(['en-ch-mystery']);
  });
});

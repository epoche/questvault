import { describe, expect, it } from 'vitest';
import { computeWeeklySnapshot, formatWeeklyReportText } from '../src/core/analytics';
import {
  ARCADE_DAILY_TOKEN_CAP,
  awardBlitzSessionRewards,
  awardCafeSessionRewards,
  awardFishingSessionRewards,
  claimChapterSeriesChest,
  createInitialPlayerState,
  getTodayArcadeTokensEarned,
} from '../src/core/economy';
import {
  calculateFishingRawTokens,
  createInitialFishingState,
  FISHING_TOTAL_CASTS,
  getLureFrenzyMultiplier,
  resolveFishingCast,
  STAR_SEA_SPECIES,
} from '../src/core/fishingEngine';
import { getCollectibleById } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  BUILTIN_CHAPTER_SERIES,
  CHAPTER_SERIES_CHEST_BONUS,
  isEpisodeUnlocked,
  isSeriesFullyCompleted,
} from '../src/subjects/chinese/chapterStories';

const CJK_CHAR_RE = /[\u4E00-\u9FFF]/;
const VALID_ZHUYIN_SYL = /^(?:˙)?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/;
const TRUE_SIMPLIFIED_RE =
  /[这为发点气让们个时说语读记纸练组线结银铁钟镜针课请访纺红蓝画体乐车马风鱼鸟龙龟爱学国来对关开见觉亲听头买卖边远进还过动写]/;

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

describe('Phase 3C Layer 1: Chinese Chapter Story Series (4 Series x 5 Episodes = 20 Episodes / 60 Qs)', () => {
  it('validates all 8 series (Season 1 + 2), 40 episodes, 120 Qs, 1:1 CJK-to-MOE Zhuyin alignment, zero Simplified chars, and sequential unlock + one-time +40 chest', () => {
    expect(BUILTIN_CHAPTER_SERIES).toHaveLength(8);
    const seriesIds = new Set<string>();
    const episodeIds = new Set<string>();
    const questionIds = new Set<string>();
    let totalQuestions = 0;

    for (const series of BUILTIN_CHAPTER_SERIES) {
      expect(seriesIds.has(series.id)).toBe(false);
      seriesIds.add(series.id);
      expect(getCollectibleById(series.emblemCollectibleId)).toBeDefined();
      expect(series.episodes).toHaveLength(5);

      for (let eIdx = 0; eIdx < series.episodes.length; eIdx += 1) {
        const ep = series.episodes[eIdx];
        expect(ep.episodeNumber).toBe(eIdx + 1);
        expect(episodeIds.has(ep.id)).toBe(false);
        episodeIds.add(ep.id);

        if (ep.episodeNumber > 1) {
          expect(Boolean(ep.prevRecap && ep.prevRecap.trim().length > 0)).toBe(true);
        }

        // Title 1:1 CJK-to-Zhuyin alignment
        const titleCjkCount = Array.from(ep.title).filter((ch) => CJK_CHAR_RE.test(ch)).length;
        const titleSyls = ep.titleZhuyin.trim().split(/\s+/);
        expect(titleSyls).toHaveLength(titleCjkCount);
        for (const syl of titleSyls) expect(VALID_ZHUYIN_SYL.test(syl)).toBe(true);

        // Sentences 1:1 CJK-to-Zhuyin alignment
        expect(ep.sentences.length).toBeGreaterThanOrEqual(3);
        expect(ep.sentencesZhuyin).toHaveLength(ep.sentences.length);
        const fullText = ep.sentences.join('');
        for (let sIdx = 0; sIdx < ep.sentences.length; sIdx += 1) {
          const sentCjk = Array.from(ep.sentences[sIdx]).filter((ch) => CJK_CHAR_RE.test(ch)).length;
          const sentSyls = ep.sentencesZhuyin[sIdx].trim().split(/\s+/);
          expect(sentSyls).toHaveLength(sentCjk);
          for (const syl of sentSyls) expect(VALID_ZHUYIN_SYL.test(syl)).toBe(true);
        }

        // Spotlight vocab appears in story & aligns 1:1 with Zhuyin
        expect(ep.spotlightVocab.length).toBeGreaterThanOrEqual(2);
        for (const v of ep.spotlightVocab) {
          expect(fullText.includes(v.word)).toBe(true);
          const vSyls = v.zhuyin.trim().split(/\s+/);
          expect(vSyls).toHaveLength(Array.from(v.word).length);
          for (const syl of vSyls) expect(VALID_ZHUYIN_SYL.test(syl)).toBe(true);
        }

        // 3 distinct reading comprehension questions
        expect(ep.questions).toHaveLength(3);
        for (const q of ep.questions) {
          totalQuestions += 1;
          expect(questionIds.has(q.id)).toBe(false);
          questionIds.add(q.id);
          expect(q.choices).toHaveLength(4);
          expect(new Set(q.choices).size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation.length).toBeGreaterThan(0);
        }

        // Zero Simplified Chinese chars
        const combined = `${series.title}${series.tagline}${ep.title}${ep.prevRecap ?? ''}${fullText}${ep.questions.map((q) => q.prompt + q.choices.join('') + q.explanation).join('')}`;
        expect(TRUE_SIMPLIFIED_RE.test(combined)).toBe(false);
      }
    }

    expect(episodeIds.size).toBe(40);
    expect(totalQuestions).toBe(120);

    // Sequential Episode Unlock + One-Time +40 Chest
    const firstSeries = BUILTIN_CHAPTER_SERIES[0];
    expect(isEpisodeUnlocked(firstSeries, 1, [])).toBe(true);
    expect(isEpisodeUnlocked(firstSeries, 2, [])).toBe(false);
    expect(isEpisodeUnlocked(firstSeries, 2, [firstSeries.episodes[0].id])).toBe(true);
    expect(isSeriesFullyCompleted(firstSeries, [firstSeries.episodes[0].id])).toBe(false);

    let player = createInitialPlayerState('Luna');
    const reqIds = firstSeries.episodes.map((e) => e.id);
    expect(claimChapterSeriesChest(player, firstSeries.id, reqIds)).toEqual({
      ok: false,
      reason: 'incomplete',
    });

    player = { ...player, completedChapterEpisodeIds: reqIds };
    expect(isSeriesFullyCompleted(firstSeries, reqIds)).toBe(true);
    const claim1 = claimChapterSeriesChest(player, firstSeries.id, reqIds, CHAPTER_SERIES_CHEST_BONUS);
    expect(claim1.ok).toBe(true);
    if (!claim1.ok) return;
    expect(claim1.bonusTokens).toBe(40);
    expect(claim1.state.tokens).toBe(player.tokens + 40);
    // Double-claim blocked
    expect(claimChapterSeriesChest(claim1.state, firstSeries.id, reqIds)).toEqual({
      ok: false,
      reason: 'already_claimed',
    });
  });
});

describe('Phase 3C Layer 1: Star Sea Fishing Engine, Shared 150-Token Arcade Cap, Parent Analytics & v1 JSON', () => {
  it('reels in 14 Star Sea species + Vault Buddy cameos, applies Lure Frenzy streak multipliers, and enforces 0-correct anti-cheese', () => {
    expect(STAR_SEA_SPECIES).toHaveLength(14);
    expect(getLureFrenzyMultiplier(2)).toBe(1);
    expect(getLureFrenzyMultiplier(3)).toBe(1.5);
    expect(getLureFrenzyMultiplier(5)).toBe(2);

    const vault = { 'critter-sprout-bunny': 1, 'sweet-boba-bear': 1 };
    const shinyVault = { 'sweet-boba-bear': true };
    const favorites = ['sweet-boba-bear'];

    // Anti-cheese: missing/quitting with 0 correct answers yields 0 Tokens
    let missState = createInitialFishingState();
    missState = resolveFishingCast(missState, false, vault, shinyVault, favorites, createSeededRng(1)).state;
    expect(missState.totalLbs).toBe(0);
    expect(calculateFishingRawTokens(missState)).toBe(0);

    // Full 10-cast streak session
    const rng = createSeededRng(777);
    let state = createInitialFishingState();
    for (let i = 0; i < FISHING_TOTAL_CASTS; i += 1) {
      const res = resolveFishingCast(state, true, vault, shinyVault, favorites, rng);
      expect(res.catchRecord).not.toBeNull();
      state = res.state;
    }
    expect(state.castsUsed).toBe(FISHING_TOTAL_CASTS);
    expect(state.bestStreak).toBe(FISHING_TOTAL_CASTS);
    expect(state.totalLbs).toBeGreaterThan(100);
    expect(calculateFishingRawTokens(state)).toBeGreaterThan(20);
  });

  it('clamps Blitz + Boba Cafe + Fishing cleanly at 150 Tokens/day, updates Parent Analytics, and round-trips v1 JSON backup', () => {
    const today = '2026-11-23';
    let state = createInitialPlayerState('Luna');

    state = awardBlitzSessionRewards(state, 'english', 180, 60, today).state;
    state = awardCafeSessionRewards(state, 'math', 400, 60, today).state;
    const fishRes = awardFishingSessionRewards(state, 'chinese', 650, 50, today);
    expect(fishRes.tokensAwarded).toBe(30); // 60 + 60 + 30 = 150 cap!
    expect(fishRes.remainingDailyCap).toBe(0);
    expect(getTodayArcadeTokensEarned(fishRes.state, today)).toBe(ARCADE_DAILY_TOKEN_CAP);

    const enriched = {
      ...fishRes.state,
      completedRadicalIds: ['rad-t1-qing', 'rad-t2-fire'],
      completedChapterEpisodeIds: BUILTIN_CHAPTER_SERIES[0].episodes.map((e) => e.id),
      claimedChapterSeriesIds: [BUILTIN_CHAPTER_SERIES[0].id],
    };

    const snap = computeWeeklySnapshot(enriched);
    expect(snap.completedRadicalsCount).toBe(2);
    expect(snap.totalRadicalsCount).toBe(24);
    expect(snap.completedChapterEpisodesCount).toBe(5);
    expect(snap.totalChapterEpisodesCount).toBe(40);
    expect(snap.completedChapterSeriesCount).toBe(1);

    const reportText = formatWeeklyReportText(enriched);
    expect(reportText).toContain('中文偏旁工廠：2 / 24 家族');
    expect(reportText).toContain('章節微小說：5 / 40 集');

    const restored = importPlayerStateJson(exportPlayerStateJson(enriched));
    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.state.fishingHighScores?.chinese).toBe(650);
      expect(restored.state.completedChapterEpisodeIds).toHaveLength(5);
      expect(restored.state.claimedChapterSeriesIds).toEqual([BUILTIN_CHAPTER_SERIES[0].id]);
    }
  });
});

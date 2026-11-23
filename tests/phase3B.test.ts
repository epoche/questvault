import { describe, expect, it } from 'vitest';
import { getCollectibleById } from '../src/core/packs';
import { createInitialPlayerState } from '../src/core/economy';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  buildRadicalBuilderQuestions,
  buildRadicalSprintQuestions,
  calculateRadicalRunTokens,
  RADICAL_BASE_TOKENS,
  RADICAL_PERFECT_BONUS,
} from '../src/subjects/chinese/radicalEngine';
import {
  BUILTIN_RADICAL_FAMILIES,
  getRadicalFamiliesByTier,
} from '../src/subjects/chinese/radicalFamilies';
import type { DifficultyTier } from '../src/core/types';

// Taiwan MOE standard Zhuyin syllable validator (neutral tone dot MUST precede syllable)
const VALID_ZHUYIN_SYL = /^(?:˙)?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/;

// Strictly Simplified Chinese characters that NEVER exist in standard Taiwan MOE Traditional Chinese
const TRUE_SIMPLIFIED_RE =
  /[这为发点气让们个时说语读记纸练组线结银铁钟镜针课请访纺红蓝画体乐车马风鱼鸟龙龟爱学国来对关开见觉亲听头买卖边远进还过动写]/;

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

describe('Phase 3B Layer 1: Chinese Radical Builder (24 Families / 120 Taiwan MOE Characters)', () => {
  it('contains exactly 24 families (6 per tier × 4 tiers) totaling 120 unique Traditional Chinese characters with valid MOE Zhuyin, zero Simplified chars, and zero blank spoilers', () => {
    expect(BUILTIN_RADICAL_FAMILIES).toHaveLength(24);

    const tiers: DifficultyTier[] = [1, 2, 3, 4];
    for (const tier of tiers) {
      expect(getRadicalFamiliesByTier(tier)).toHaveLength(6);
    }

    const familyIds = new Set<string>();
    const allChars = new Set<string>();

    for (const fam of BUILTIN_RADICAL_FAMILIES) {
      expect(familyIds.has(fam.id)).toBe(false);
      familyIds.add(fam.id);
      expect(getCollectibleById(fam.emblemCollectibleId)).toBeDefined();
      expect(fam.items).toHaveLength(5);

      const radicalsInFamily = new Set<string>();

      for (const item of fam.items) {
        // Unique single CJK character across all 120 items
        expect(Array.from(item.char)).toHaveLength(1);
        expect(allChars.has(item.char)).toBe(false);
        allChars.add(item.char);

        // Valid Taiwan MOE Zhuyin on character
        expect(VALID_ZHUYIN_SYL.test(item.zhuyin)).toBe(true);

        // Sample word contains target char and aligns 1:1 with Zhuyin syllables
        expect(item.sampleWord.includes(item.char)).toBe(true);
        const wordChars = Array.from(item.sampleWord);
        const wordSyls = item.sampleWordZhuyin.trim().split(/\s+/);
        expect(wordSyls).toHaveLength(wordChars.length);
        for (const syl of wordSyls) {
          expect(VALID_ZHUYIN_SYL.test(syl)).toBe(true);
        }

        // Blank sentence has exactly one `___` and ZERO leaks of target char
        const blankMatches = item.blankSentence.match(/___/g) ?? [];
        expect(blankMatches).toHaveLength(1);
        expect(item.blankSentence.includes(item.char)).toBe(false);

        // Zero Simplified Chinese characters across all Chinese strings
        const combinedZh = `${fam.title}${fam.subtitle}${item.char}${item.radicalName}${item.radicalMeaning}${item.sampleWord}${item.memoryTip}${item.blankSentence}`;
        expect(TRUE_SIMPLIFIED_RE.test(combinedZh)).toBe(false);

        radicalsInFamily.add(item.radical);
      }

      // Phonetic families must have 5 distinct radicals & matching anchor component; semantic families share 1 anchor radical
      if (fam.kind === 'phonetic') {
        expect(radicalsInFamily.size).toBe(5);
        for (const item of fam.items) {
          expect(item.component).toBe(fam.anchor);
        }
      } else {
        expect(radicalsInFamily.size).toBe(1);
        expect(radicalsInFamily.has(fam.anchor)).toBe(true);
      }
    }

    expect(allChars.size).toBe(120);
  });

  it('fuzzes Stage 1 (Radical Builder) and Stage 2 (Same-Family Sprint) across all 24 families × 5 seeds (1,200 questions) with zero leaks or duplicate choices', () => {
    let totalQuestions = 0;

    for (let fIdx = 0; fIdx < BUILTIN_RADICAL_FAMILIES.length; fIdx += 1) {
      const fam = BUILTIN_RADICAL_FAMILIES[fIdx];
      for (let seed = 1; seed <= 5; seed += 1) {
        const rng = createSeededRng(fIdx * 997 + seed * 131);

        const buildQs = buildRadicalBuilderQuestions(fam, rng);
        expect(buildQs).toHaveLength(5);
        for (const q of buildQs) {
          totalQuestions += 1;
          expect(q.choices).toHaveLength(4);
          expect(q.choices.filter((c) => c.isCorrect)).toHaveLength(1);
          expect(new Set(q.choices.map((c) => c.radical)).size).toBe(4);
          // Zero target-char spoiler in Stage 1 prompt or masked sample word, and never fully masked □□
          expect(q.maskedSampleWord.includes(q.item.char)).toBe(false);
          expect(/^□+$/.test(q.maskedSampleWord)).toBe(false);
          expect(q.promptZh.includes(q.item.char)).toBe(false);
        }

        const sprintQs = buildRadicalSprintQuestions(fam, rng);
        expect(sprintQs).toHaveLength(5);
        for (const q of sprintQs) {
          totalQuestions += 1;
          expect(q.choices).toHaveLength(4);
          expect(q.choices.filter((c) => c.isCorrect)).toHaveLength(1);
          expect(new Set(q.choices.map((c) => c.char)).size).toBe(4);
          expect(q.prompt.includes(q.item.char)).toBe(false);
          expect(q.prompt.includes('___')).toBe(true);
        }
      }
    }

    expect(totalQuestions).toBe(1200);
  });

  it('calculates Radical Builder rewards accurately and round-trips completedRadicalIds in v1 JSON backup', () => {
    expect(calculateRadicalRunTokens(10, 10)).toBe(RADICAL_BASE_TOKENS + RADICAL_PERFECT_BONUS);
    expect(calculateRadicalRunTokens(10, 7)).toBe(RADICAL_BASE_TOKENS + 2);
    expect(calculateRadicalRunTokens(10, 4)).toBe(RADICAL_BASE_TOKENS);

    const state = {
      ...createInitialPlayerState('Luna'),
      completedRadicalIds: ['rad-t1-qing', 'rad-t2-fire', 'rad-t1-qing'],
    };
    const restored = importPlayerStateJson(exportPlayerStateJson(state));
    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.state.completedRadicalIds).toEqual(['rad-t1-qing', 'rad-t2-fire']);
    }
  });
});

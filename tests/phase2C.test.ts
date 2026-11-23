import { describe, expect, it } from 'vitest';
import { getCollectibleById } from '../src/core/packs';
import type { DifficultyTier } from '../src/core/types';
import { buildChineseListeningSession } from '../src/subjects/chinese/listeningEngine';
import { BUILTIN_CHINESE_SETS } from '../src/subjects/chinese/wordSets';
import { buildMathRun } from '../src/subjects/math/mathEngine';
import {
  hydrateDynamicMathSet,
  validateMathItemInvariants,
} from '../src/subjects/math/mathGenerator';
import { generatePhase2MathItem } from '../src/subjects/math/mathGeneratorPhase2';
import { BUILTIN_MATH_SETS, getAllMathSkills } from '../src/subjects/math/questSets';
import { PHASE2_MATH_SETS } from '../src/subjects/math/questSetsPhase2';

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function normalizeZhuyin(z: string): string {
  return z.trim().replace(/\s+/g, ' ');
}

describe('Phase 2C Layer 1: Math G4→G5 8 New Dynamic Visual Units (32 templates / 6,400+ fuzz items)', () => {
  it('registers 8 new Math units (2 per tier, 32 unique templates) into 28 total sets / 112 unique skills', () => {
    expect(PHASE2_MATH_SETS).toHaveLength(8);
    expect(BUILTIN_MATH_SETS).toHaveLength(28);
    expect(getAllMathSkills().size).toBe(112);

    const tierCounts: Record<DifficultyTier, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const set of PHASE2_MATH_SETS) {
      tierCounts[set.tier] += 1;
      expect(set.items).toHaveLength(4);
      expect(getCollectibleById(set.emblemCollectibleId)).toBeDefined();
    }
    expect(tierCounts).toEqual({ 1: 2, 2: 2, 3: 2, 4: 2 });
  });

  it('fuzzes all 8 Phase 2C Math units across 200 seeds (6,400 generated items) with zero errors and anti-spoiler visuals', () => {
    const errors: string[] = [];
    let count = 0;

    for (let u = 0; u < PHASE2_MATH_SETS.length; u += 1) {
      const unit = PHASE2_MATH_SETS[u];
      const sigs = new Set<string>();

      for (let s = 0; s < 200; s += 1) {
        const rng = createSeededRng((u + 11) * 13001 + (s + 1) * 6271);
        const hydrated = hydrateDynamicMathSet(unit, rng);
        sigs.add(hydrated.items.map((i) => i.sprintPrompt).join(' | '));

        for (const item of hydrated.items) {
          count += 1;
          expect(generatePhase2MathItem(item, rng)).not.toBeNull();
          const errs = validateMathItemInvariants(item);
          if (errs.length > 0) {
            errors.push(`[${unit.id} seed=${s}] ${errs.join('; ')}`);
          }
          // Anti-spoiler checks on new visual specs
          if (item.sprintVisual?.kind === 'symmetry-shape' && item.sprintVisual.showLines) {
            errors.push(`${item.id}: symmetry-shape sprintVisual leaks showLines=true`);
          }
          if (item.sprintVisual?.kind === 'area-model-2x2' && !item.sprintVisual.hideProducts) {
            errors.push(`${item.id}: area-model-2x2 sprintVisual leaks hideProducts=false`);
          }
          if (item.sprintVisual?.kind === 'coord-grid' && item.sprintVisual.showCoords) {
            errors.push(`${item.id}: coord-grid sprintVisual leaks showCoords=true`);
          }
        }
      }

      expect(sigs.size).toBeGreaterThanOrEqual(20);
    }

    expect(count).toBe(6400);
    expect(errors).toEqual([]);
  });

  it('builds playable MathRun plans for every new Phase 2C unit', () => {
    for (const set of PHASE2_MATH_SETS) {
      const plan = buildMathRun(set, createSeededRng(42));
      expect(plan.conceptItems).toHaveLength(4);
      expect(plan.sprintQuestions).toHaveLength(4);
      expect(plan.challengeQuestions).toHaveLength(3);
    }
  });
});

describe('Phase 2C Layer 1: Chinese Listening Quest (聽音辨字) Engine Fuzz', () => {
  it('generates 400 listening sessions (4 tiers × 100 seeds = 3,200 questions) with zero duplicate choices and zero real-word homophone ambiguity', () => {
    const tiers: DifficultyTier[] = [1, 2, 3, 4];
    let totalQuestions = 0;

    for (const tier of tiers) {
      for (let s = 0; s < 100; s += 1) {
        const rng = createSeededRng(tier * 99991 + (s + 1) * 4099);
        const session = buildChineseListeningSession(tier, BUILTIN_CHINESE_SETS, rng);

        expect(session.tier).toBe(tier);
        expect(session.questions).toHaveLength(8);

        const targetWords = new Set<string>();
        for (const q of session.questions) {
          totalQuestions += 1;
          expect(targetWords.has(q.targetWord.word)).toBe(false);
          targetWords.add(q.targetWord.word);

          expect(q.choices).toHaveLength(4);
          expect(new Set(q.choices.map((c) => c.word)).size).toBe(4);

          const targets = q.choices.filter((c) => c.isTarget);
          expect(targets).toHaveLength(1);
          expect(targets[0].word).toBe(q.targetWord.word);

          const targetZy = normalizeZhuyin(q.targetWord.zhuyin);
          expect(targetZy.length).toBeGreaterThan(0);

          for (const ch of q.choices) {
            if (!ch.isTarget && ch.zhuyin.trim().length > 0) {
              expect(
                normalizeZhuyin(ch.zhuyin),
                `Real-word homophone collision on ${q.targetWord.word} vs ${ch.word}`,
              ).not.toBe(targetZy);
            }
          }
        }
      }
    }

    expect(totalQuestions).toBe(3200);
  });
});

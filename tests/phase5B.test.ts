import { describe, expect, it } from 'vitest';
import {
  awardMathFluencyRewards,
  createInitialPlayerState,
  MATH_FLUENCY_DAILY_CAP,
} from '../src/core/economy';
import {
  exportPlayerStateJson,
  importPlayerStateJson,
} from '../src/core/repository';
import {
  BAR_MODEL_UNITS,
  buildBarModelSession,
  calculateBarModelTokens,
  generateBarModelQuestion,
  type BarModelKind,
} from '../src/subjects/math/barModelEngine';
import {
  buildFactFluencyRound,
  calculateFactFluencyRawTokens,
  classifyHeatmapCell,
  generateFactFluencyQuestion,
  getFactHeatmapKey,
  recordFactAttempt,
  type FactOperationMode,
} from '../src/subjects/math/factFluencyEngine';

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

describe('Phase 5B — Math Fact Fluency Dojo (Fuzz & Adaptive Heatmap)', () => {
  const modes: FactOperationMode[] = ['multiplication', 'division', 'addition', 'subtraction'];

  it('independently verifies 880+ generated Fact Fluency questions (220 seeds × 4 modes)', () => {
    for (const mode of modes) {
      for (let seed = 1; seed <= 220; seed += 1) {
        const rng = createSeededRng(seed * 97 + mode.length * 31);
        const q = generateFactFluencyQuestion(mode, seed, undefined, rng);

        // 4 unique positive integer choices including exact answer
        expect(q.choices).toHaveLength(4);
        expect(new Set(q.choices).size).toBe(4);
        expect(q.choices).toContain(q.correctAnswer);
        for (const c of q.choices) {
          expect(Number.isInteger(c)).toBe(true);
          expect(c).toBeGreaterThan(0);
        }

        // Independent reverse-parse of prompt string
        if (mode === 'multiplication') {
          const m = q.prompt.match(/^(\d+) × (\d+) = \?$/);
          expect(m).not.toBeNull();
          const a = Number(m![1]);
          const b = Number(m![2]);
          expect(a).toBeGreaterThanOrEqual(2);
          expect(a).toBeLessThanOrEqual(12);
          expect(b).toBeGreaterThanOrEqual(2);
          expect(b).toBeLessThanOrEqual(12);
          expect(q.correctAnswer).toBe(a * b);
          expect(q.factKey).toBe(`${a}x${b}`);
        } else if (mode === 'division') {
          const m = q.prompt.match(/^(\d+) ÷ (\d+) = \?$/);
          expect(m).not.toBeNull();
          const dividend = Number(m![1]);
          const divisor = Number(m![2]);
          expect(dividend % divisor).toBe(0);
          expect(q.correctAnswer).toBe(dividend / divisor);
          expect(divisor).toBeGreaterThanOrEqual(2);
          expect(divisor).toBeLessThanOrEqual(12);
          expect(q.correctAnswer).toBeGreaterThanOrEqual(2);
          expect(q.correctAnswer).toBeLessThanOrEqual(12);
        } else if (mode === 'addition') {
          const m = q.prompt.match(/^(\d+) \+ (\d+) = \?$/);
          expect(m).not.toBeNull();
          expect(q.correctAnswer).toBe(Number(m![1]) + Number(m![2]));
        } else {
          const m = q.prompt.match(/^(\d+) − (\d+) = \?$/);
          expect(m).not.toBeNull();
          expect(q.correctAnswer).toBe(Number(m![1]) - Number(m![2]));
          expect(q.correctAnswer).toBeGreaterThan(0);
        }
      }
    }
  });

  it('builds 10 unique prompts per Fact Fluency round', () => {
    for (const mode of modes) {
      const round = buildFactFluencyRound(mode, undefined, 10, createSeededRng(42));
      expect(round).toHaveLength(10);
      expect(new Set(round.map((q) => q.prompt)).size).toBe(10);
    }
  });

  it('classifies 12x12 heatmap cells and weights weak spots higher than mastered facts', () => {
    expect(classifyHeatmapCell(undefined)).toBe('unseen');
    expect(classifyHeatmapCell({ attempts: 3, correct: 1, avgMs: 3000 })).toBe('needs-focus');
    expect(classifyHeatmapCell({ attempts: 3, correct: 2, avgMs: 5000 })).toBe('building');
    expect(classifyHeatmapCell({ attempts: 3, correct: 3, avgMs: 2500 })).toBe('mastered');

    // Mark everything mastered EXCEPT 7x8 which is needs-focus
    let mastery: Record<string, { attempts: number; correct: number; avgMs: number }> = {};
    for (let a = 2; a <= 12; a += 1) {
      for (let b = 2; b <= 12; b += 1) {
        mastery[getFactHeatmapKey(a, b)] = { attempts: 3, correct: 3, avgMs: 2000 };
      }
    }
    mastery = recordFactAttempt(mastery, '7x8', false, 6000);
    mastery['7x8'] = { attempts: 4, correct: 1, avgMs: 6000 };

    const rng = createSeededRng(1337);
    let hit7x8 = 0;
    let hit2x2 = 0;
    for (let i = 0; i < 6000; i += 1) {
      const q = generateFactFluencyQuestion('multiplication', i, mastery, rng);
      if (q.factKey === '7x8') hit7x8 += 1;
      if (q.factKey === '2x2') hit2x2 += 1;
    }
    // 7x8 has weight 4 vs 2x2 weight 1 -> should appear significantly more often
    expect(hit7x8).toBeGreaterThan(hit2x2 * 2);
  });

  it('enforces accuracy threshold and 60-token daily cap for Fact Fluency Dojo', () => {
    expect(calculateFactFluencyRawTokens(10, 10)).toBe(20);
    expect(calculateFactFluencyRawTokens(8, 10)).toBe(15);
    expect(calculateFactFluencyRawTokens(5, 10)).toBe(10);
    expect(calculateFactFluencyRawTokens(4, 10)).toBe(0);

    const p0 = createInitialPlayerState('Mia');
    const r1 = awardMathFluencyRewards(p0, 20, '2026-11-23', { '7x8': { attempts: 2, correct: 2, avgMs: 2100 } });
    expect(r1.tokensAwarded).toBe(20);
    expect(r1.remainingDailyCap).toBe(MATH_FLUENCY_DAILY_CAP - 20);

    const r2 = awardMathFluencyRewards(r1.state, 20, '2026-11-23', r1.state.mathFactMastery);
    const r3 = awardMathFluencyRewards(r2.state, 20, '2026-11-23', r2.state.mathFactMastery);
    const r4 = awardMathFluencyRewards(r3.state, 20, '2026-11-23', r3.state.mathFactMastery);
    expect(r3.tokensAwarded).toBe(20);
    expect(r3.remainingDailyCap).toBe(0);
    expect(r4.tokensAwarded).toBe(0);
    expect(r4.state.tokens).toBe(p0.tokens + MATH_FLUENCY_DAILY_CAP);

    // Next day resets cap
    const rNext = awardMathFluencyRewards(r4.state, 15, '2026-11-24', r4.state.mathFactMastery);
    expect(rNext.tokensAwarded).toBe(15);
  });
});

describe('Phase 5B — Two-Step Bar Model Lab (1,760+ Reverse-Formula Fuzz Audit)', () => {
  it('defines 8 unique Bar Model units across Tiers 1–4', () => {
    expect(BAR_MODEL_UNITS).toHaveLength(8);
    expect(new Set(BAR_MODEL_UNITS.map((u) => u.id)).size).toBe(8);
    expect(BAR_MODEL_UNITS.map((u) => u.tier)).toEqual([1, 1, 2, 2, 3, 3, 4, 4]);
  });

  it('independently reverse-verifies all 8 Bar Model formulas across 220 seeds each (1,760 items) + anti-spoiler checks', () => {
    const allKinds: BarModelKind[] = BAR_MODEL_UNITS.map((u) => u.id);

    for (const kind of allKinds) {
      for (let seed = 1; seed <= 220; seed += 1) {
        const rng = createSeededRng(seed * 131 + kind.length * 17);
        const q = generateBarModelQuestion(kind, seed, rng);

        // Choice integrity
        expect(q.choices).toHaveLength(4);
        expect(new Set(q.choices).size).toBe(4);
        expect(q.choices).toContain(q.correctChoice);
        expect(Number.isInteger(q.correctAnswer)).toBe(true);
        expect(q.correctAnswer).toBeGreaterThan(0);

        // Anti-spoiler checks on visual spec
        if (q.visual.totalHidden) {
          expect(q.visual.totalLabel).not.toContain(String(q.correctAnswer));
          expect(q.visual.totalLabel).not.toContain(q.visual.totalValue);
        }
        // No duplicate embedded value inside totalLabel
        expect(q.visual.totalLabel).not.toMatch(/\(\s*\$?\d+\s*\)/);

        // At least one unknown in visual spec (either totalHidden or a hidden segment)
        const hasHiddenSegment =
          q.visual.segments.some((s) => s.hidden) ||
          Boolean(q.visual.secondaryRow?.segments.some((s) => s.hidden));
        expect(Boolean(q.visual.totalHidden) || hasHiddenSegment).toBe(true);

        // Independent reverse-parse from storyPrompt
        if (kind === 'bm-mult-add') {
          const m = q.storyPrompt.match(/buys (\d+) packs of star stickers with (\d+) stickers in each pack\. She also finds (\d+) loose/);
          expect(m).not.toBeNull();
          const [boxes, perBox, extra] = [Number(m![1]), Number(m![2]), Number(m![3])];
          expect(q.step1Answer).toBe(boxes * perBox);
          expect(q.correctAnswer).toBe(boxes * perBox + extra);
          expect(q.visual.segments).toHaveLength(boxes + 1);
        } else if (kind === 'bm-mult-sub') {
          const m = q.storyPrompt.match(/brings \$(\d+) to the book fair\. She buys (\d+) graphic novels that cost \$(\d+) each/);
          expect(m).not.toBeNull();
          const [budget, qty, price] = [Number(m![1]), Number(m![2]), Number(m![3])];
          expect(q.step1Answer).toBe(qty * price);
          expect(q.correctAnswer).toBe(budget - qty * price);
          expect(q.visual.segments.find((s) => s.label === 'Money Left')?.hidden).toBe(true);
        } else if (kind === 'bm-add-div') {
          const m = q.storyPrompt.match(/picks (\d+) strawberries on Saturday and (\d+) strawberries on Sunday\. She shares all of them equally into (\d+) gift bags/);
          expect(m).not.toBeNull();
          const [d1, d2, bags] = [Number(m![1]), Number(m![2]), Number(m![3])];
          expect((d1 + d2) % bags).toBe(0);
          expect(q.step1Answer).toBe(d1 + d2);
          expect(q.correctAnswer).toBe((d1 + d2) / bags);
          expect(q.visual.totalHidden).toBe(true);
          expect(q.visual.secondaryRow?.segments.every((s) => s.hidden)).toBe(true);
        } else if (kind === 'bm-sub-div') {
          const m = q.storyPrompt.match(/has (\d+) pastel bracelet beads\. She keeps (\d+) beads for herself and splits the remaining beads equally among (\d+) friends/);
          expect(m).not.toBeNull();
          const [total, kept, friends] = [Number(m![1]), Number(m![2]), Number(m![3])];
          expect((total - kept) % friends).toBe(0);
          expect(q.step1Answer).toBe(total - kept);
          expect(q.correctAnswer).toBe((total - kept) / friends);
        } else if (kind === 'bm-compare-mult-sum') {
          const m = q.storyPrompt.match(/collected (\d+) critter cards\. Her older sister collected (\d+) times as many/);
          expect(m).not.toBeNull();
          const [base, mult] = [Number(m![1]), Number(m![2])];
          expect(q.step1Answer).toBe(base * mult);
          expect(q.correctAnswer).toBe(base + base * mult);
          expect(q.visual.segments[0].widthRatio).toBeCloseTo(1 / mult, 5);
        } else if (kind === 'bm-compare-diff-sum') {
          const m = q.storyPrompt.match(/Blue Team scored (\d+) points\. The Gold Team scored (\d+) more points/);
          expect(m).not.toBeNull();
          const [teamA, more] = [Number(m![1]), Number(m![2])];
          expect(q.step1Answer).toBe(teamA + more);
          expect(q.correctAnswer).toBe(teamA + (teamA + more));
        } else if (kind === 'bm-rect-perimeter-side') {
          const m = q.storyPrompt.match(/perimeter of (\d+) feet\. Each of its two long sides measures (\d+) feet/);
          expect(m).not.toBeNull();
          const [perim, len] = [Number(m![1]), Number(m![2])];
          expect((perim - 2 * len) % 2).toBe(0);
          expect(q.step1Answer).toBe(perim - 2 * len);
          expect(q.correctAnswer).toBe((perim - 2 * len) / 2);
          expect(q.correctAnswer).toBeLessThan(len);
        } else if (kind === 'bm-fraction-of-set') {
          const m = q.storyPrompt.match(/makes (\d+) brown-sugar pearls\. They use (\d+)\/(\d+) of the pearls/);
          expect(m).not.toBeNull();
          const [total, numer, denom] = [Number(m![1]), Number(m![2]), Number(m![3])];
          expect(total % denom).toBe(0);
          const used = (total / denom) * numer;
          expect(q.step1Answer).toBe(used);
          expect(q.correctAnswer).toBe(total - used);
        }
      }
    }
  });

  it('builds a 4-question session and calculates tokens cleanly', () => {
    const session = buildBarModelSession('bm-mult-add', 4, createSeededRng(7));
    expect(session).toHaveLength(4);
    expect(calculateBarModelTokens(4, 4)).toBe(40);
    expect(calculateBarModelTokens(3, 4)).toBe(30);
  });

  it('preserves Phase 5B fields cleanly through v1 JSON export/import roundtrip', () => {
    const base = createInitialPlayerState('Mia');
    const rich = {
      ...base,
      completedBarModelIds: ['bm-mult-add', 'bm-fraction-of-set'],
      mathFactMastery: {
        '7x8': { attempts: 3, correct: 3, avgMs: 2400 },
        'invalid-key': { attempts: 1, correct: 1, avgMs: 1000 },
      },
      mathFluencyDailyTokens: { dateKey: '2026-11-23', earned: 40 },
    };
    const json = exportPlayerStateJson(rich);
    const parsed = importPlayerStateJson(json);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.state.completedBarModelIds).toEqual(['bm-mult-add', 'bm-fraction-of-set']);
    expect(parsed.state.mathFactMastery?.['7x8']).toEqual({ attempts: 3, correct: 3, avgMs: 2400 });
    expect(parsed.state.mathFactMastery?.['invalid-key']).toBeUndefined();
    expect(parsed.state.mathFluencyDailyTokens).toEqual({ dateKey: '2026-11-23', earned: 40 });
  });
});

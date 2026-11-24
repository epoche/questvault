import { describe, expect, it } from 'vitest';
import { generateDynamicMathItem } from '../src/subjects/math/mathGenerator';
import { BUILTIN_MATH_SETS } from '../src/subjects/math/questSets';
import type { MathVisualSpec, UsBillDenomination, UsCoinKind } from '../src/subjects/math/types';

function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sumUsMoneyCents(
  spec: Extract<MathVisualSpec, { kind: 'us-money' }>,
): number {
  const billValue = (b: UsBillDenomination) => b * 100;
  const coinValue = (c: UsCoinKind) =>
    c === 'quarter' ? 25 : c === 'dime' ? 10 : c === 'nickel' ? 5 : 1;
  const billsCents = (spec.bills ?? []).reduce((sum, b) => sum + billValue(b), 0);
  const coinsCents = spec.coins.reduce((sum, c) => sum + coinValue(c), 0);
  return billsCents + coinsCents;
}

function parseDollarToCents(str: string): number {
  const m = /^\$(\d+)(?:\.(\d{2}))?$/.exec(str.trim());
  if (!m) throw new Error(`Invalid money format: ${str}`);
  return Number(m[1]) * 100 + (m[2] ? Number(m[2]) : 0);
}

describe('Phase 10C — U.S. Coins & Bills Visual Math Fuzz (250+ Seeds Exact-Cent Audit)', () => {
  const moneySet = BUILTIN_MATH_SETS.find((s) => s.id === 'math-t2-money');

  it('verifies static concept & sprint us-money visuals in math-t2-money match exact cent totals', () => {
    expect(moneySet).toBeDefined();
    const coinsItem = moneySet!.items.find((i) => i.id === 'm-t2-money-coins')!;
    expect(coinsItem.visual.kind).toBe('us-money');
    if (coinsItem.visual.kind === 'us-money') {
      expect(sumUsMoneyCents(coinsItem.visual)).toBe(100); // 3Q + 2D + 1N = $1.00
    }
    expect(coinsItem.sprintVisual?.kind).toBe('us-money');
    if (coinsItem.sprintVisual?.kind === 'us-money') {
      expect(sumUsMoneyCents(coinsItem.sprintVisual)).toBe(85); // 2Q + 3D + 1N = $0.85
    }

    const changeItem = moneySet!.items.find((i) => i.id === 'm-t2-money-change')!;
    expect(changeItem.visual.kind).toBe('us-money');
    expect(changeItem.sprintVisual?.kind).toBe('us-money');
    if (changeItem.sprintVisual?.kind === 'us-money') {
      expect(sumUsMoneyCents(changeItem.sprintVisual)).toBe(1000);
      expect(changeItem.sprintVisual.priceLabel).toBe('$6.50');
    }
  });

  it('independently reverse-verifies 250 seeds across m-t2-money-coins, m-t2-money-change, and m-t2-money-multi', () => {
    expect(moneySet).toBeDefined();
    const coinsBase = moneySet!.items.find((i) => i.id === 'm-t2-money-coins')!;
    const changeBase = moneySet!.items.find((i) => i.id === 'm-t2-money-change')!;
    const multiBase = moneySet!.items.find((i) => i.id === 'm-t2-money-multi')!;

    let sawDollarBill = false;
    let sawPenny = false;

    for (let seed = 1; seed <= 250; seed += 1) {
      const rng = makeRng(seed * 7919 + 13);

      // 1. Count Coins & $1 Bill
      const cItem = generateDynamicMathItem(coinsBase, rng);
      expect(cItem.sprintVisual?.kind).toBe('us-money');
      expect(cItem.revealVisualOnFeedback).toBe(false);
      if (cItem.sprintVisual?.kind === 'us-money') {
        expect(cItem.sprintVisual.mode).toBe('count');
        const visualCents = sumUsMoneyCents(cItem.sprintVisual);
        const answerCents = parseDollarToCents(cItem.correctAnswer);
        expect(visualCents).toBe(answerCents);
        if ((cItem.sprintVisual.bills?.length ?? 0) > 0) sawDollarBill = true;
        if (cItem.sprintVisual.coins.includes('penny')) sawPenny = true;
        // Zero duplicate choices
        const allChoices = [cItem.correctAnswer, ...cItem.distractors];
        expect(new Set(allChoices).size).toBe(4);
      }

      // 2. Making Change (Single Item)
      const chItem = generateDynamicMathItem(changeBase, rng);
      expect(chItem.sprintVisual?.kind).toBe('us-money');
      expect(chItem.revealVisualOnFeedback).toBe(false);
      if (chItem.sprintVisual?.kind === 'us-money') {
        expect(chItem.sprintVisual.mode).toBe('change');
        expect(chItem.sprintVisual.priceLabel).toBeTruthy();
        const paidCents = sumUsMoneyCents(chItem.sprintVisual);
        const priceCents = parseDollarToCents(chItem.sprintVisual.priceLabel!);
        const changeCents = parseDollarToCents(chItem.correctAnswer);
        expect(paidCents - priceCents).toBe(changeCents);
        expect(changeCents).toBeGreaterThan(0);
        // Zero spoiler: priceLabel never equals answer unless cost === change (which is a price, not labeled as change)
        expect(new Set([chItem.correctAnswer, ...chItem.distractors]).size).toBe(4);
      }

      // 3. Multi-Item Making Change
      const mItem = generateDynamicMathItem(multiBase, rng);
      expect(mItem.sprintVisual?.kind).toBe('us-money');
      expect(mItem.revealVisualOnFeedback).toBe(false);
      if (mItem.sprintVisual?.kind === 'us-money') {
        expect(mItem.sprintVisual.mode).toBe('change');
        const paidCents = sumUsMoneyCents(mItem.sprintVisual);
        const match = /^(\d+)\s*×\s*(\$\d+(?:\.\d{2})?)$/.exec(mItem.sprintVisual.priceLabel ?? '');
        expect(match).not.toBeNull();
        const spentCents = Number(match![1]) * parseDollarToCents(match![2]);
        const changeCents = parseDollarToCents(mItem.correctAnswer);
        expect(paidCents - spentCents).toBe(changeCents);
        expect(changeCents).toBeGreaterThan(0);
        expect(new Set([mItem.correctAnswer, ...mItem.distractors]).size).toBe(4);
      }
    }

    // Confirm both $1 bills and pennies appear in generated pool across 250 seeds
    expect(sawDollarBill).toBe(true);
    expect(sawPenny).toBe(true);
  });
});

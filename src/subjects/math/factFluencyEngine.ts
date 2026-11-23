import type { FactMasteryEntry } from '../../core/types';

export type FactOperationMode = 'multiplication' | 'division' | 'addition' | 'subtraction';

export interface FactFluencyQuestion {
  id: string;
  mode: FactOperationMode;
  factKey: string; // e.g. "7x8" for 2..12 multiplication heatmap tracking
  prompt: string;
  correctAnswer: number;
  choices: number[];
  hint: string;
}

export type HeatmapCellStatus = 'unseen' | 'needs-focus' | 'building' | 'mastered';

export const FACT_FLUENCY_DAILY_TOKEN_CAP = 60;
export const FACT_FLUENCY_ROUND_SIZE = 10;

export function getFactHeatmapKey(a: number, b: number): string {
  return `${a}x${b}`;
}

export function classifyHeatmapCell(entry?: FactMasteryEntry): HeatmapCellStatus {
  if (!entry || entry.attempts <= 0) return 'unseen';
  const acc = entry.correct / entry.attempts;
  if (acc >= 0.85 && entry.avgMs <= 4200 && entry.attempts >= 2) return 'mastered';
  if (acc >= 0.65) return 'building';
  return 'needs-focus';
}

export function recordFactAttempt(
  map: Record<string, FactMasteryEntry> | undefined,
  factKey: string,
  correct: boolean,
  elapsedMs: number,
): Record<string, FactMasteryEntry> {
  const prev = map?.[factKey];
  const clampedMs = Math.max(250, Math.min(20_000, Math.round(elapsedMs)));
  const attempts = (prev?.attempts ?? 0) + 1;
  const nextCorrect = (prev?.correct ?? 0) + (correct ? 1 : 0);
  const nextAvgMs = prev
    ? Math.round((prev.avgMs * prev.attempts + clampedMs) / attempts)
    : clampedMs;
  return {
    ...(map ?? {}),
    [factKey]: { attempts, correct: nextCorrect, avgMs: nextAvgMs },
  };
}

function pickInt(min: number, max: number, rng: () => number): number {
  const r = Math.max(0, Math.min(0.999999, rng()));
  return min + Math.floor(r * (max - min + 1));
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildNumericChoices(
  answer: number,
  candidates: number[],
  rng: () => number,
): number[] {
  const set = new Set<number>([answer]);
  for (const c of candidates) {
    if (set.size >= 4) break;
    if (Number.isInteger(c) && c > 0 && c !== answer) {
      set.add(c);
    }
  }
  let offset = 1;
  while (set.size < 4) {
    const up = answer + offset;
    const down = answer - offset;
    if (up > 0 && !set.has(up)) set.add(up);
    if (set.size < 4 && down > 0 && !set.has(down)) set.add(down);
    offset += 1;
  }
  return shuffle(Array.from(set), rng);
}

/**
 * Picks a (a, b) pair in 2..12 with adaptive weighting:
 * needs-focus = 4x, building = 3x, unseen = 2x, mastered = 1x.
 */
function pickWeightedMultPair(
  mastery: Record<string, FactMasteryEntry> | undefined,
  rng: () => number,
): [number, number] {
  const weighted: { a: number; b: number; w: number }[] = [];
  let totalWeight = 0;
  for (let a = 2; a <= 12; a += 1) {
    for (let b = 2; b <= 12; b += 1) {
      const status = classifyHeatmapCell(mastery?.[getFactHeatmapKey(a, b)]);
      const w =
        status === 'needs-focus'
          ? 4
          : status === 'building'
            ? 3
            : status === 'unseen'
              ? 2
              : 1;
      weighted.push({ a, b, w });
      totalWeight += w;
    }
  }
  let target = Math.max(0, Math.min(0.999999, rng())) * totalWeight;
  for (const item of weighted) {
    target -= item.w;
    if (target <= 0) return [item.a, item.b];
  }
  return [7, 8];
}

export function generateFactFluencyQuestion(
  mode: FactOperationMode,
  seq: number,
  mastery?: Record<string, FactMasteryEntry>,
  rng: () => number = Math.random,
): FactFluencyQuestion {
  if (mode === 'multiplication') {
    const [a, b] = pickWeightedMultPair(mastery, rng);
    const ans = a * b;
    const key = getFactHeatmapKey(a, b);
    return {
      id: `ff-mul-${seq}-${key}`,
      mode,
      factKey: key,
      prompt: `${a} × ${b} = ?`,
      correctAnswer: ans,
      choices: buildNumericChoices(
        ans,
        [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, ans + 10, ans - 10],
        rng,
      ),
      hint: `Think of ${a} groups of ${b}: ${a} × ${b} = ${ans}.`,
    };
  }

  if (mode === 'division') {
    const [a, b] = pickWeightedMultPair(mastery, rng);
    const dividend = a * b;
    const key = getFactHeatmapKey(a, b);
    return {
      id: `ff-div-${seq}-${key}`,
      mode,
      factKey: key,
      prompt: `${dividend} ÷ ${a} = ?`,
      correctAnswer: b,
      choices: buildNumericChoices(b, [b + 1, b - 1, b + 2, b - 2, a], rng),
      hint: `Inverse fact: ${a} × ${b} = ${dividend}, so ${dividend} ÷ ${a} = ${b}.`,
    };
  }

  if (mode === 'addition') {
    // Mental make-10 / two-digit carrying addition
    const a = pickInt(17, 79, rng);
    const b = pickInt(14, 68, rng);
    const ans = a + b;
    return {
      id: `ff-add-${seq}-${a}-${b}`,
      mode,
      factKey: `add-${a}+${b}`,
      prompt: `${a} + ${b} = ?`,
      correctAnswer: ans,
      choices: buildNumericChoices(ans, [ans + 10, ans - 10, ans + 1, ans - 1, ans + 2], rng),
      hint: `Add tens first, then ones: ${a} + ${b} = ${ans}.`,
    };
  }

  // subtraction: two-digit mental regrouping
  const b = pickInt(14, 58, rng);
  const diff = pickInt(15, 64, rng);
  const a = b + diff;
  return {
    id: `ff-sub-${seq}-${a}-${b}`,
    mode,
    factKey: `sub-${a}-${b}`,
    prompt: `${a} − ${b} = ?`,
    correctAnswer: diff,
    choices: buildNumericChoices(diff, [diff + 10, diff - 10, diff + 1, diff - 1, diff + 2], rng),
    hint: `Check with addition: ${diff} + ${b} = ${a}.`,
  };
}

export function buildFactFluencyRound(
  mode: FactOperationMode,
  mastery?: Record<string, FactMasteryEntry>,
  count = FACT_FLUENCY_ROUND_SIZE,
  rng: () => number = Math.random,
): FactFluencyQuestion[] {
  const round: FactFluencyQuestion[] = [];
  const usedPrompts = new Set<string>();
  let guard = 0;
  while (round.length < count && guard < count * 8) {
    guard += 1;
    const q = generateFactFluencyQuestion(mode, guard, mastery, rng);
    if (!usedPrompts.has(q.prompt)) {
      usedPrompts.add(q.prompt);
      round.push(q);
    }
  }
  return round;
}

export function calculateFactFluencyRawTokens(correctCount: number, total = 10): number {
  const acc = total > 0 ? correctCount / total : 0;
  if (acc >= 0.9) return 20;
  if (acc >= 0.7) return 15;
  if (acc >= 0.5) return 10;
  return 0;
}

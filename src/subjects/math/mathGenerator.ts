import { generatePhase2MathItem } from './mathGeneratorPhase2';
import type { MathQuestSet, MathSkillItem } from './types';

function randInt(rng: () => number, min: number, max: number): number {
  const r = Math.max(0, Math.min(0.999999, rng()));
  return min + Math.floor(r * (max - min + 1));
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.min(arr.length - 1, Math.floor(Math.max(0, Math.min(0.999999, rng())) * arr.length))];
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

function uniqueDistractors(
  correct: string,
  candidates: string[],
  fallback: (attempt: number) => string,
): [string, string, string] {
  const out: string[] = [];
  const seen = new Set<string>([correct]);
  for (const c of candidates) {
    if (!c || seen.has(c)) continue;
    seen.add(c);
    out.push(c);
    if (out.length === 3) break;
  }
  let attempt = 1;
  while (out.length < 3 && attempt < 50) {
    const f = fallback(attempt);
    attempt += 1;
    if (f && !seen.has(f)) {
      seen.add(f);
      out.push(f);
    }
  }
  return [out[0], out[1], out[2]];
}

function formatTime12(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 720) + 720) % 720;
  const h24 = Math.floor(wrapped / 60);
  const h12 = h24 === 0 ? 12 : h24;
  const m = wrapped % 60;
  return `${h12}:${String(m).padStart(2, '0')}`;
}

function formatMoney(cents: number): string {
  const safe = Math.max(0, Math.round(cents));
  const d = Math.floor(safe / 100);
  const c = safe % 100;
  return c === 0 ? `$${d}` : `$${d}.${String(c).padStart(2, '0')}`;
}

const KID_NAMES = ['Maya', 'Leo', 'Nora', 'Kai', 'Ava', 'Sam', 'Zoe', 'Eli'] as const;

/**
 * Dynamically regenerates fresh numbers, distractors, explanations, word problems,
 * and exact matching SVG visuals for a MathSkillItem so replaying any of the 20 units
 * produces infinite non-memorizable practice!
 */
export function generateDynamicMathItem(
  base: MathSkillItem,
  rng: () => number = Math.random,
): MathSkillItem {
  const name = pick(rng, KID_NAMES);
  const name2 = pick(rng, KID_NAMES.filter((n) => n !== name));

  switch (base.id) {
    // ═══════════ TIER 1: MULTIPLY ARRAYS ═══════════
    case 'm-t1-6x4': {
      const a = randInt(rng, 3, 6);
      const b = randInt(rng, 4, 9);
      const ans = a * b;
      const wa = randInt(rng, 3, 6);
      const wb = randInt(rng, 5, 9);
      const wAns = wa * wb;
      return {
        ...base,
        sprintPrompt: `What is ${a} × ${b}?`,
        sprintVisual: { kind: 'array', rows: a, cols: b, color: '#2563EB' },
        revealVisualOnFeedback: true,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans - b), String(ans + b), String(a + b), String(ans + a)],
          (k) => String(ans + k * 2),
        ),
        explanation: `${a} rows of ${b} = ${ans}!`,
        wordProblemPrompt: `A sticker sheet has ${wa} rows with ${wb} stars in each row. How many stars in all?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: `${wAns} stars`,
        wordProblemDistractors: uniqueDistractors(
          `${wAns} stars`,
          [`${wAns - wb} stars`, `${wAns + wb} stars`, `${wa + wb} stars`],
          (k) => `${wAns + k * 3} stars`,
        ),
        wordProblemStepHint: `Multiply rows × columns: ${wa} × ${wb} = ${wAns}.`,
      };
    }

    case 'm-t1-6x7': {
      const a = pick(rng, [6, 7]);
      const b = randInt(rng, 6, 9);
      const ans = a * b;
      const wa = randInt(rng, 5, 8);
      const wb = randInt(rng, 6, 9);
      const wAns = wa * wb;
      return {
        ...base,
        sprintPrompt: `What is ${a} × ${b}?`,
        sprintVisual: { kind: 'array', rows: a, cols: b, color: '#0D9488' },
        revealVisualOnFeedback: true,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans - b), String(ans + b), String(ans - a), String(ans + 2)],
          (k) => String(ans + k * 3),
        ),
        explanation: `Break apart: 5 × ${b} = ${5 * b}, plus ${a - 5} × ${b} = ${ans}!`,
        wordProblemPrompt: `${name} packs ${wa} lunch bags with ${wb} strawberries in each bag. How many strawberries?`,
        wordProblemAnswer: `${wAns} strawberries`,
        wordProblemDistractors: uniqueDistractors(
          `${wAns} strawberries`,
          [`${wAns - wb} strawberries`, `${wAns + wb} strawberries`, `${wa + wb} strawberries`],
          (k) => `${wAns + k * 4} strawberries`,
        ),
        wordProblemStepHint: `${wa} groups of ${wb}: ${wa} × ${wb} = ${wAns}.`,
      };
    }

    case 'm-t1-9x4': {
      const b = randInt(rng, 3, 9);
      const ans = 9 * b;
      const wb = randInt(rng, 4, 8);
      const wAns = 9 * wb;
      return {
        ...base,
        sprintPrompt: `What is 9 × ${b}?`,
        sprintVisual: {
          kind: 'bar-model',
          totalLabel: `9 × ${b} = ${ans}`,
          parts: [
            { label: `10 × ${b} = ${10 * b}`, color: '#2563EB', weight: 9 },
            { label: `− ${b}`, color: '#F59E0B', weight: 2 },
          ],
        },
        revealVisualOnFeedback: true,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(10 * b), String(ans - 9), String(ans + 9), String(8 * b)],
          (k) => String(ans + k * 2),
        ),
        explanation: `10 × ${b} = ${10 * b}, minus ${b} = ${ans}!`,
        wordProblemPrompt: `A bookshelf has 9 shelves with ${wb} comic books on each shelf. How many comic books?`,
        wordProblemAnswer: `${wAns} comics`,
        wordProblemDistractors: uniqueDistractors(
          `${wAns} comics`,
          [`${10 * wb} comics`, `${wAns - wb} comics`, `${wAns + 9} comics`],
          (k) => `${wAns + k * 3} comics`,
        ),
        wordProblemStepHint: `9 × ${wb} = ${10 * wb} − ${wb} = ${wAns}.`,
      };
    }

    case 'm-t1-7x8': {
      const pairs: [number, number][] = [
        [7, 8],
        [8, 7],
        [8, 8],
        [7, 7],
        [8, 6],
        [7, 9],
      ];
      const [a, b] = pick(rng, pairs);
      const ans = a * b;
      const [wa, wb] = pick(rng, [
        [7, 8],
        [8, 6],
        [7, 6],
        [8, 9],
      ] as const);
      const wAns = wa * wb;
      return {
        ...base,
        sprintPrompt: `What is ${a} × ${b}?`,
        sprintVisual: { kind: 'array', rows: a, cols: b, color: '#7C3AED' },
        revealVisualOnFeedback: true,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans - b), String(ans + b), String(ans - a), String(ans + a)],
          (k) => String(ans + k * 2),
        ),
        explanation: `${a} × ${b} = ${ans}!`,
        wordProblemPrompt: `Each canoe holds ${wb} campers. If ${wa} canoes cross the lake, how many campers are there?`,
        wordProblemAnswer: `${wAns} campers`,
        wordProblemDistractors: uniqueDistractors(
          `${wAns} campers`,
          [`${wAns - wb} campers`, `${wAns + wb} campers`, `${wa + wb} campers`],
          (k) => `${wAns + k * 4} campers`,
        ),
        wordProblemStepHint: `${wa} canoes × ${wb} campers each = ${wAns}.`,
      };
    }

    // ═══════════ TIER 1: FRACTION BARS ═══════════
    case 'm-t1-unit-frac': {
      const den = pick(rng, [4, 5, 6, 8]);
      const num = randInt(rng, 1, den - 1);
      const wDen = pick(rng, [5, 6, 8]);
      const wNum = randInt(rng, 2, wDen - 1);
      return {
        ...base,
        sprintPrompt: 'Which fraction matches the shaded bar?',
        sprintVisual: { kind: 'fraction-bar', numerator: num, denominator: den, color: '#2563EB' },
        revealVisualOnFeedback: false,
        correctAnswer: `${num}/${den}`,
        distractors: uniqueDistractors(
          `${num}/${den}`,
          [`${den - num}/${den}`, `${num}/${Math.max(2, den - 1)}`, `${den}/${num}`, `${Math.min(den, num + 1)}/${den}`],
          (k) => `${((num + k) % den) || 1}/${den + 1}`,
        ),
        explanation: `${num} shaded pieces out of ${den} equal parts = ${num}/${den}!`,
        wordProblemPrompt: `A granola bar is cut into ${wDen} equal pieces. ${name} eats ${wNum} pieces. What fraction did ${name} eat?`,
        wordProblemVisual: { kind: 'fraction-bar', numerator: wNum, denominator: wDen, color: '#0D9488' },
        wordProblemAnswer: `${wNum}/${wDen}`,
        wordProblemDistractors: uniqueDistractors(
          `${wNum}/${wDen}`,
          [`${wDen - wNum}/${wDen}`, `1/${wDen}`, `${wDen}/${wNum}`],
          (k) => `${k}/${wDen + 1}`,
        ),
        wordProblemStepHint: `Numerator = eaten (${wNum}), denominator = total equal pieces (${wDen}).`,
      };
    }

    case 'm-t1-same-den': {
      const den = pick(rng, [5, 6, 8, 10]);
      const a = randInt(rng, 2, den - 1);
      let b = randInt(rng, 1, den - 1);
      if (b === a) b = a > 1 ? a - 1 : a + 1;
      const bigger = Math.max(a, b);
      const smaller = Math.min(a, b);
      const wDen = pick(rng, [6, 8, 10]);
      const wSmall = randInt(rng, 1, Math.floor(wDen / 2));
      const wBig = randInt(rng, wSmall + 1, wDen - 1);
      return {
        ...base,
        sprintPrompt: `Which fraction is GREATER: ${a}/${den} or ${b}/${den}?`,
        sprintVisual: { kind: 'fraction-compare', leftNum: a, leftDen: den, rightNum: b, rightDen: den },
        revealVisualOnFeedback: true,
        correctAnswer: `${bigger}/${den}`,
        distractors: uniqueDistractors(
          `${bigger}/${den}`,
          [`${smaller}/${den}`, 'They are equal', `1/${den}`],
          (k) => `${k}/${den + 2}`,
        ),
        explanation: `Same denominator (${den}): ${bigger} pieces is more than ${smaller} pieces!`,
        wordProblemPrompt: `${name} painted ${wSmall}/${wDen} of a mural and ${name2} painted ${wBig}/${wDen} of an equal mural. Who painted MORE?`,
        wordProblemAnswer: `${name2} (${wBig}/${wDen})`,
        wordProblemDistractors: [
          `${name} (${wSmall}/${wDen})`,
          'They painted the same',
          'Cannot tell',
        ],
        wordProblemStepHint: `Compare ${wBig}/${wDen} vs ${wSmall}/${wDen} — both use the same size pieces.`,
      };
    }

    case 'm-t1-unit-compare': {
      const pairs: [number, number][] = [
        [3, 6],
        [4, 8],
        [2, 5],
        [3, 8],
        [4, 6],
        [2, 6],
      ];
      const [smallDen, bigDen] = pick(rng, pairs);
      const flip = rng() > 0.5;
      const leftDen = flip ? bigDen : smallDen;
      const rightDen = flip ? smallDen : bigDen;
      return {
        ...base,
        sprintPrompt: `Which single slice is BIGGER: 1/${leftDen} or 1/${rightDen}?`,
        sprintVisual: { kind: 'fraction-compare', leftNum: 1, leftDen, rightNum: 1, rightDen },
        revealVisualOnFeedback: true,
        correctAnswer: `1/${smallDen}`,
        distractors: uniqueDistractors(
          `1/${smallDen}`,
          [`1/${bigDen}`, 'They are equal', `1/${smallDen + bigDen}`],
          (k) => `1/${bigDen + k}`,
        ),
        explanation: `Fewer cuts (${smallDen}) means bigger slices than ${bigDen} cuts!`,
      };
    }

    case 'm-t1-whole-frac': {
      const den = pick(rng, [4, 5, 6, 8, 10]);
      const names: Record<number, string> = { 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths' };
      const wDen = pick(rng, [5, 6, 8]);
      const used = randInt(rng, 1, wDen - 2);
      const left = wDen - used;
      return {
        ...base,
        sprintPrompt: `How many ${names[den]} make 1 whole?`,
        sprintVisual: { kind: 'fraction-bar', numerator: den, denominator: den, color: '#EA580C' },
        revealVisualOnFeedback: true,
        correctAnswer: `${den}/${den}`,
        distractors: uniqueDistractors(
          `${den}/${den}`,
          [`1/${den}`, `${Math.floor(den / 2)}/${den}`, `${den + 2}/${den}`],
          (k) => `${den - 1}/${den + k}`,
        ),
        explanation: `All ${den} out of ${den} equal parts = ${den}/${den} = 1 whole!`,
        wordProblemPrompt: `A ribbon is split into ${wDen} equal parts. You already used ${used}/${wDen}. What fraction is LEFT?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: `${left}/${wDen}`,
        wordProblemDistractors: uniqueDistractors(
          `${left}/${wDen}`,
          [`${used}/${wDen}`, `${wDen}/${wDen}`, `1/${wDen}`],
          (k) => `${Math.max(1, (left + k) % wDen)}/${wDen + 1}`,
        ),
        wordProblemStepHint: `1 whole is ${wDen}/${wDen}. Subtract ${used}/${wDen} → ${left}/${wDen} left.`,
      };
    }

    // ═══════════ TIER 1: AREA & PERIMETER INTRO ═══════════
    case 'm-t1-count-area': {
      const w = randInt(rng, 4, 8);
      const h = randInt(rng, 2, 5);
      const area = w * h;
      const perim = 2 * (w + h);
      const ww = randInt(rng, 5, 8);
      const wh = randInt(rng, 3, 6);
      const wArea = ww * wh;
      return {
        ...base,
        sprintPrompt: `What is the AREA of ${w === 8 ? 'an' : 'a'} ${w} cm by ${h} cm rectangle?`,
        sprintVisual: { kind: 'area-grid', width: w, height: h, unit: 'cm' },
        revealVisualOnFeedback: true,
        correctAnswer: `${area} sq cm`,
        distractors: uniqueDistractors(
          `${area} sq cm`,
          [`${perim} sq cm`, `${w + h} sq cm`, `${area + w} sq cm`],
          (k) => `${area + k * 2} sq cm`,
        ),
        explanation: `Area = length × width = ${w} × ${h} = ${area} sq cm!`,
        wordProblemPrompt: `A puppy playpen is ${ww} ft long and ${wh} ft wide. What is its AREA?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: `${wArea} sq ft`,
        wordProblemDistractors: uniqueDistractors(
          `${wArea} sq ft`,
          [`${2 * (ww + wh)} sq ft`, `${ww + wh} sq ft`, `${wArea + ww} sq ft`],
          (k) => `${wArea + k * 3} sq ft`,
        ),
        wordProblemStepHint: `Area = length × width = ${ww} × ${wh} = ${wArea} sq ft.`,
      };
    }

    case 'm-t1-perim-rect': {
      const w = randInt(rng, 5, 9);
      const h = randInt(rng, 2, w - 1);
      const p = 2 * (w + h);
      const area = w * h;
      const ww = randInt(rng, 6, 10);
      const wh = randInt(rng, 3, ww - 1);
      const wp = 2 * (ww + wh);
      return {
        ...base,
        sprintPrompt: `What is the PERIMETER of this ${w} m by ${h} m rectangle?`,
        sprintVisual: { kind: 'perimeter-rect', width: w, height: h, unit: 'm' },
        revealVisualOnFeedback: false,
        correctAnswer: `${p} m`,
        distractors: uniqueDistractors(
          `${p} m`,
          [`${area} m`, `${w + h} m`, `${p - 2} m`],
          (k) => `${p + k * 2} m`,
        ),
        explanation: `Add all 4 sides: ${w} + ${h} + ${w} + ${h} = ${p} m!`,
        wordProblemPrompt: `You put ribbon around a rectangular card that is ${ww} in long and ${wh} in wide. How much ribbon?`,
        wordProblemVisual: { kind: 'perimeter-rect', width: ww, height: wh, unit: 'in' },
        wordProblemAnswer: `${wp} in`,
        wordProblemDistractors: uniqueDistractors(
          `${wp} in`,
          [`${ww * wh} in`, `${ww + wh} in`, `${wp + 4} in`],
          (k) => `${wp + k * 2} in`,
        ),
        wordProblemStepHint: `Add all 4 sides: ${ww} + ${wh} + ${ww} + ${wh} = ${wp} in.`,
      };
    }

    case 'm-t1-square-perim': {
      const s = randInt(rng, 4, 9);
      const p = 4 * s;
      const ws = randInt(rng, 5, 11);
      const wp = 4 * ws;
      return {
        ...base,
        sprintPrompt: `A square has sides of ${s} cm. What is its PERIMETER?`,
        sprintVisual: { kind: 'perimeter-rect', width: s, height: s, unit: 'cm' },
        revealVisualOnFeedback: false,
        correctAnswer: `${p} cm`,
        distractors: uniqueDistractors(
          `${p} cm`,
          [`${s * s} cm`, `${2 * s} cm`, `${3 * s} cm`],
          (k) => `${p + k * 4} cm`,
        ),
        explanation: `A square has 4 equal sides: 4 × ${s} = ${p} cm!`,
        wordProblemPrompt: `A square garden has sides of ${ws} ft. How many feet of fencing go around it?`,
        wordProblemAnswer: `${wp} ft`,
        wordProblemDistractors: uniqueDistractors(
          `${wp} ft`,
          [`${ws * ws} ft`, `${2 * ws} ft`, `${3 * ws} ft`],
          (k) => `${wp + k * 4} ft`,
        ),
        wordProblemStepHint: `4 equal sides of ${ws} ft: 4 × ${ws} = ${wp} ft.`,
      };
    }

    case 'm-t1-square-area': {
      const s = randInt(rng, 4, 9);
      const area = s * s;
      const ws = randInt(rng, 5, 10);
      const wArea = ws * ws;
      return {
        ...base,
        sprintPrompt: `What is the AREA of a square with ${s} in sides?`,
        sprintVisual: { kind: 'area-grid', width: s, height: s, unit: 'in' },
        revealVisualOnFeedback: true,
        correctAnswer: `${area} sq in`,
        distractors: uniqueDistractors(
          `${area} sq in`,
          [`${4 * s} sq in`, `${2 * s} sq in`, `${area - s} sq in`],
          (k) => `${area + k * 3} sq in`,
        ),
        explanation: `Area of a square = side × side = ${s} × ${s} = ${area} sq in!`,
        wordProblemPrompt: `A square tile patio is ${ws} units wide on each side. How many square tiles cover it?`,
        wordProblemAnswer: `${wArea} tiles`,
        wordProblemDistractors: uniqueDistractors(
          `${wArea} tiles`,
          [`${4 * ws} tiles`, `${2 * ws} tiles`, `${wArea - ws} tiles`],
          (k) => `${wArea + k * 4} tiles`,
        ),
        wordProblemStepHint: `${ws} rows × ${ws} columns = ${wArea} square tiles.`,
      };
    }

    // ═══════════ TIER 1 NEW: PLACE VALUE & ROUNDING ═══════════
    case 'm-t1-pv-digit': {
      const th = randInt(rng, 1, 8);
      const h = randInt(rng, 1, 9);
      const t = randInt(rng, 1, 9);
      const o = randInt(rng, 1, 9);
      const val = th * 1000 + h * 100 + t * 10 + o;
      const place = pick(rng, ['thousands', 'hundreds', 'tens'] as const);
      const ans = place === 'thousands' ? th * 1000 : place === 'hundreds' ? h * 100 : t * 10;
      const digit = place === 'thousands' ? th : place === 'hundreds' ? h : t;
      return {
        ...base,
        sprintPrompt: `In ${val.toLocaleString()}, what is the VALUE of the highlighted digit (${digit})?`,
        sprintVisual: { kind: 'place-value', value: val, highlightPlace: place },
        revealVisualOnFeedback: false,
        correctAnswer: ans.toLocaleString(),
        distractors: uniqueDistractors(
          ans.toLocaleString(),
          [String(digit), (digit * 10).toLocaleString(), (digit * 100).toLocaleString(), (digit * 1000).toLocaleString()],
          (k) => String(ans + k * 10),
        ),
        explanation: `The digit ${digit} is in the ${place} place, so its value is ${ans.toLocaleString()}!`,
      };
    }

    case 'm-t1-pv-expanded': {
      const h = randInt(rng, 2, 9);
      const t = randInt(rng, 1, 9);
      const o = randInt(rng, 1, 9);
      const val = h * 100 + t * 10 + o;
      return {
        ...base,
        sprintPrompt: `Which number equals ${h * 100} + ${t * 10} + ${o}?`,
        correctAnswer: String(val),
        distractors: uniqueDistractors(
          String(val),
          [String(h * 100 + o * 10 + t), String(h * 1000 + t * 10 + o), String(h * 100 + t + o)],
          (k) => String(val + k * 10),
        ),
        explanation: `${h} hundreds + ${t} tens + ${o} ones = ${val}!`,
      };
    }

    case 'm-t1-round-10': {
      const baseTen = randInt(rng, 3, 28) * 10;
      const ones = pick(rng, [1, 2, 3, 4, 6, 7, 8, 9, 5]);
      const val = baseTen + ones;
      const rounded = ones >= 5 ? baseTen + 10 : baseTen;
      const other = ones >= 5 ? baseTen : baseTen + 10;
      return {
        ...base,
        sprintPrompt: `Round ${val} to the nearest TEN.`,
        sprintVisual: { kind: 'number-line-round', low: baseTen, mid: baseTen + 5, high: baseTen + 10, value: val },
        revealVisualOnFeedback: true,
        correctAnswer: String(rounded),
        distractors: uniqueDistractors(
          String(rounded),
          [String(other), String(rounded + 10), String(Math.max(10, baseTen - 10))],
          (k) => String(rounded + k * 10),
        ),
        explanation: `Ones digit is ${ones} (${ones >= 5 ? '5 or more → round UP' : '4 or less → stay down'}) → ${rounded}!`,
      };
    }

    case 'm-t1-round-100': {
      const baseHun = randInt(rng, 2, 8) * 100;
      const rem = pick(rng, [14, 28, 37, 42, 50, 58, 67, 74, 86]);
      const val = baseHun + rem;
      const rounded = rem >= 50 ? baseHun + 100 : baseHun;
      const other = rem >= 50 ? baseHun : baseHun + 100;
      return {
        ...base,
        sprintPrompt: `Round ${val} to the nearest HUNDRED.`,
        sprintVisual: { kind: 'number-line-round', low: baseHun, mid: baseHun + 50, high: baseHun + 100, value: val },
        revealVisualOnFeedback: true,
        correctAnswer: String(rounded),
        distractors: uniqueDistractors(
          String(rounded),
          [String(other), String(rounded + 100), String(Math.max(100, baseHun - 100))],
          (k) => String(rounded + k * 100),
        ),
        explanation: `Tens digit is ${Math.floor(rem / 10)} → ${val} rounds to ${rounded}!`,
      };
    }

    // ═══════════ TIER 1 NEW: CLOCK & ELAPSED TIME ═══════════
    case 'm-t1-time-add': {
      const startH = randInt(rng, 1, 9);
      const startM = pick(rng, [0, 10, 15, 20, 25]);
      const addM = pick(rng, [15, 20, 25, 30]);
      const startTotal = startH * 60 + startM;
      const endTotal = startTotal + addM;
      const startStr = formatTime12(startTotal);
      const endStr = formatTime12(endTotal);
      return {
        ...base,
        sprintPrompt: `It is ${startStr}. What time will it be in ${addM} minutes?`,
        sprintVisual: { kind: 'time-jump', startLabel: startStr, jumps: [`+${addM} min`], endLabel: '?' },
        revealVisualOnFeedback: false,
        correctAnswer: endStr,
        distractors: uniqueDistractors(
          endStr,
          [formatTime12(endTotal + 10), formatTime12(endTotal - 10), formatTime12(endTotal + 60)],
          (k) => formatTime12(endTotal + k * 5),
        ),
        explanation: `${startStr} + ${addM} minutes = ${endStr}!`,
      };
    }

    case 'm-t1-time-cross': {
      const startH = randInt(rng, 1, 9);
      const startM = pick(rng, [35, 40, 45, 50]);
      const toHour = 60 - startM;
      const addM = pick(rng, [30, 35, 40, 45].filter((m) => m > toHour));
      const startTotal = startH * 60 + startM;
      const endTotal = startTotal + addM;
      const rem = addM - toHour;
      const startStr = formatTime12(startTotal);
      const endStr = formatTime12(endTotal);
      return {
        ...base,
        sprintPrompt: `Soccer starts at ${startStr} and lasts ${addM} minutes. When does it end?`,
        sprintVisual: { kind: 'time-jump', startLabel: startStr, jumps: [`+${toHour}m`, `+${rem}m`], endLabel: '?' },
        revealVisualOnFeedback: false,
        correctAnswer: endStr,
        distractors: uniqueDistractors(
          endStr,
          [formatTime12(endTotal - 15), formatTime12(endTotal + 15), formatTime12(endTotal + 60)],
          (k) => formatTime12(endTotal + k * 5),
        ),
        explanation: `Jump +${toHour} min to ${formatTime12(startTotal + toHour)}, then +${rem} min → ${endStr}!`,
      };
    }

    case 'm-t1-time-elapsed': {
      const startH = randInt(rng, 2, 7);
      const startM = pick(rng, [10, 15, 20, 30]);
      const dur = pick(rng, [35, 45, 50, 75, 80]);
      const startTotal = startH * 60 + startM;
      const endTotal = startTotal + dur;
      const startStr = formatTime12(startTotal);
      const endStr = formatTime12(endTotal);
      return {
        ...base,
        sprintPrompt: `Reading time runs from ${startStr} to ${endStr}. How many minutes is that?`,
        correctAnswer: `${dur} min`,
        distractors: uniqueDistractors(
          `${dur} min`,
          [`${dur + 10} min`, `${dur - 10} min`, `${dur + 15} min`],
          (k) => `${dur + k * 5} min`,
        ),
        explanation: `From ${startStr} to ${endStr} is ${dur} minutes!`,
      };
    }

    case 'm-t1-time-hr-min': {
      const startH = randInt(rng, 1, 8);
      const startM = pick(rng, [10, 15, 20, 30, 45]);
      const addH = pick(rng, [1, 2]);
      const addM = pick(rng, [15, 20, 25, 30]);
      const startTotal = startH * 60 + startM;
      const endTotal = startTotal + addH * 60 + addM;
      const startStr = formatTime12(startTotal);
      const endStr = formatTime12(endTotal);
      return {
        ...base,
        sprintPrompt: `A movie starts at ${startStr} and is ${addH} hr ${addM} min long. When does it finish?`,
        sprintVisual: { kind: 'time-jump', startLabel: startStr, jumps: [`+${addH} hr`, `+${addM} min`], endLabel: '?' },
        revealVisualOnFeedback: false,
        correctAnswer: endStr,
        distractors: uniqueDistractors(
          endStr,
          [formatTime12(endTotal + 15), formatTime12(endTotal - 15), formatTime12(endTotal - 60)],
          (k) => formatTime12(endTotal + k * 5),
        ),
        explanation: `${startStr} + ${addH} hr = ${formatTime12(startTotal + addH * 60)}, plus ${addM} min = ${endStr}!`,
      };
    }

    // ═══════════ TIER 2: DIVISION & FACT FAMILIES ═══════════
    case 'm-t2-56div7': {
      const divisor = randInt(rng, 4, 9);
      const quot = randInt(rng, 5, 9);
      const dividend = divisor * quot;
      return {
        ...base,
        sprintPrompt: `What is ${dividend} ÷ ${divisor}?`,
        correctAnswer: String(quot),
        distractors: uniqueDistractors(
          String(quot),
          [String(quot - 1), String(quot + 1), String(quot + 2)],
          (k) => String(quot + k + 2),
        ),
        explanation: `${divisor} × ${quot} = ${dividend}, so ${dividend} ÷ ${divisor} = ${quot}!`,
      };
    }

    case 'm-t2-48div6': {
      const divisor = randInt(rng, 4, 9);
      const quot = randInt(rng, 4, 9);
      const dividend = divisor * quot;
      return {
        ...base,
        sprintPrompt: `What is ${dividend} ÷ ${divisor}?`,
        sprintVisual: {
          kind: 'bar-model',
          totalLabel: `${dividend} total`,
          parts: Array.from({ length: divisor }, (_, i) => ({
            label: String(quot),
            color: i % 2 === 0 ? '#2563EB' : '#0D9488',
          })),
        },
        revealVisualOnFeedback: true,
        correctAnswer: String(quot),
        distractors: uniqueDistractors(
          String(quot),
          [String(quot - 1), String(quot + 1), String(divisor)],
          (k) => String(quot + k + 1),
        ),
        explanation: `${dividend} split into ${divisor} equal groups gives ${quot} in each group!`,
      };
    }

    case 'm-t2-mult-tens': {
      const a = randInt(rng, 3, 9);
      const tens = randInt(rng, 3, 9) * 10;
      const ans = a * tens;
      return {
        ...base,
        sprintPrompt: `What is ${a} × ${tens}?`,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans / 10), String(ans + tens), String(ans - tens)],
          (k) => String(ans + k * 10),
        ),
        explanation: `${a} × ${tens / 10} = ${a * (tens / 10)}, then add one zero → ${ans}!`,
      };
    }

    case 'm-t2-remainder': {
      const divisor = pick(rng, [4, 5, 6, 7]);
      const quot = randInt(rng, 3, 8);
      const rem = randInt(rng, 1, divisor - 1);
      const dividend = divisor * quot + rem;
      const ans = `${quot} R${rem}`;
      return {
        ...base,
        sprintPrompt: `What is ${dividend} ÷ ${divisor}?`,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `${quot} R${(rem % (divisor - 1)) + 1}`,
            `${quot + 1} R${rem}`,
            `${Math.max(1, quot - 1)} R${rem}`,
            `${quot} R0`,
          ],
          (k) => `${quot + k} R1`,
        ),
        explanation: `${divisor} × ${quot} = ${divisor * quot}, with ${rem} left over → ${ans}!`,
      };
    }

    // ═══════════ TIER 2: EQUIVALENT FRACTIONS ═══════════
    case 'm-t2-half-equiv': {
      const mult = pick(rng, [3, 4, 5, 6]);
      const ans = `${mult}/${mult * 2}`;
      return {
        ...base,
        sprintPrompt: 'Which fraction is EQUAL to 1/2?',
        sprintVisual: { kind: 'fraction-bar', numerator: 1, denominator: 2, color: '#0284C7' },
        revealVisualOnFeedback: true,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`${mult - 1}/${mult * 2}`, `${mult + 1}/${mult * 2}`, `${mult}/${mult * 2 + 2}`],
          (k) => `${k}/${mult * 2 + 1}`,
        ),
        explanation: `${mult} is exactly half of ${mult * 2}, so ${ans} = 1/2!`,
      };
    }

    case 'm-t2-scale-frac': {
      const [bn, bd] = pick(rng, [
        [2, 3],
        [3, 4],
        [2, 5],
        [3, 5],
      ] as const);
      const mult = pick(rng, [2, 3, 4]);
      const ans = `${bn * mult}/${bd * mult}`;
      return {
        ...base,
        sprintPrompt: `Which fraction is EQUAL to ${bn}/${bd}?`,
        sprintVisual: { kind: 'fraction-bar', numerator: bn, denominator: bd, color: '#7C3AED' },
        revealVisualOnFeedback: true,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`${bn * mult}/${bd + mult}`, `${bn + mult}/${bd + mult}`, `${bn * mult - 1}/${bd * mult}`],
          (k) => `${bn + k}/${bd * mult}`,
        ),
        explanation: `Multiply top and bottom by ${mult}: ${bn}×${mult}/${bd}×${mult} = ${ans}!`,
      };
    }

    case 'm-t2-benchmark-half': {
      const pairs: [number, number, number, number][] = [
        [3, 4, 2, 5],
        [5, 6, 3, 8],
        [4, 5, 2, 6],
        [5, 8, 1, 3],
        [7, 10, 2, 5],
      ];
      const [ln, ld, rn, rd] = pick(rng, pairs);
      const flip = rng() > 0.5;
      const aN = flip ? rn : ln;
      const aD = flip ? rd : ld;
      const bN = flip ? ln : rn;
      const bD = flip ? ld : rd;
      return {
        ...base,
        sprintPrompt: `Which fraction is GREATER: ${aN}/${aD} or ${bN}/${bD}?`,
        sprintVisual: { kind: 'fraction-compare', leftNum: aN, leftDen: aD, rightNum: bN, rightDen: bD },
        revealVisualOnFeedback: true,
        correctAnswer: `${ln}/${ld}`,
        distractors: [`${rn}/${rd}`, 'They are equal', `1/${ld}`],
        explanation: `${ln}/${ld} is MORE than 1/2, while ${rn}/${rd} is LESS than 1/2!`,
      };
    }

    case 'm-t2-simplify': {
      const [sn, sd] = pick(rng, [
        [1, 3],
        [1, 4],
        [2, 3],
        [3, 4],
        [2, 5],
      ] as const);
      const mult = pick(rng, [2, 3, 4]);
      const n = sn * mult;
      const d = sd * mult;
      return {
        ...base,
        sprintPrompt: `Which fraction equals ${n}/${d} in simplest form?`,
        sprintVisual: { kind: 'fraction-bar', numerator: n, denominator: d, color: '#059669' },
        revealVisualOnFeedback: true,
        correctAnswer: `${sn}/${sd}`,
        distractors: uniqueDistractors(
          `${sn}/${sd}`,
          [`${sn}/${sd + 1}`, `${Math.min(sd, sn + 1)}/${sd + 1}`, `1/${sd + 2}`],
          (k) => `${sn}/${sd + k + 1}`,
        ),
        explanation: `Divide top and bottom by ${mult}: ${n}÷${mult}/${d}÷${mult} = ${sn}/${sd}!`,
      };
    }

    // ═══════════ TIER 2: AREA & MISSING SIDES ═══════════
    case 'm-t2-missing-area': {
      const w = randInt(rng, 5, 11);
      const h = randInt(rng, 3, 8);
      const area = w * h;
      return {
        ...base,
        sprintPrompt: `A rectangle has Area = ${area} sq cm and Width = ${w} cm. What is its Height?`,
        sprintVisual: { kind: 'area-grid', width: w, height: h, unit: 'cm', showMissing: 'height' },
        revealVisualOnFeedback: false,
        correctAnswer: `${h} cm`,
        distractors: uniqueDistractors(
          `${h} cm`,
          [`${h + 1} cm`, `${Math.max(1, h - 1)} cm`, `${area - w} cm`],
          (k) => `${h + k + 1} cm`,
        ),
        explanation: `${w} × ? = ${area} → ${area} ÷ ${w} = ${h} cm!`,
      };
    }

    case 'm-t2-missing-perim': {
      const w = randInt(rng, 5, 12);
      const h = randInt(rng, 3, 8);
      const p = 2 * (w + h);
      return {
        ...base,
        sprintPrompt: `A rectangle has Perimeter = ${p} m and Width = ${w} m. What is its Height?`,
        sprintVisual: { kind: 'perimeter-rect', width: w, height: h, unit: 'm', unknownSide: true },
        revealVisualOnFeedback: false,
        correctAnswer: `${h} m`,
        distractors: uniqueDistractors(
          `${h} m`,
          [`${p - w} m`, `${h * 2} m`, `${Math.max(1, h - 1)} m`],
          (k) => `${h + k + 1} m`,
        ),
        explanation: `Half of ${p} is ${w + h}. ${w + h} − ${w} = ${h} m!`,
      };
    }

    case 'm-t2-compare-ap': {
      const a1 = randInt(rng, 4, 7);
      const b1 = randInt(rng, 4, 6);
      const area1 = a1 * b1;
      const a2 = randInt(rng, 6, 9);
      const b2 = randInt(rng, 2, 3);
      const area2 = a2 * b2;
      if (area1 === area2) return base;
      const firstBig = area1 > area2;
      const winText = firstBig ? `${a1} × ${b1} (${area1} sq units)` : `${a2} × ${b2} (${area2} sq units)`;
      const loseText = firstBig ? `${a2} × ${b2} (${area2} sq units)` : `${a1} × ${b1} (${area1} sq units)`;
      return {
        ...base,
        sprintPrompt: `Which rectangle has the LARGER area: ${a1}×${b1} or ${a2}×${b2}?`,
        correctAnswer: winText,
        distractors: [loseText, 'Both have the same area', `Area = ${area1 + area2}`],
        explanation: `${a1} × ${b1} = ${area1} and ${a2} × ${b2} = ${area2}, so ${winText} is larger!`,
      };
    }

    case 'm-t2-rect-perim-big': {
      const w = randInt(rng, 10, 16);
      const h = randInt(rng, 3, 8);
      const p = 2 * (w + h);
      return {
        ...base,
        sprintPrompt: `What is the PERIMETER of a ${w} ft by ${h} ft rectangle?`,
        sprintVisual: { kind: 'perimeter-rect', width: w, height: h, unit: 'ft' },
        revealVisualOnFeedback: false,
        correctAnswer: `${p} ft`,
        distractors: uniqueDistractors(
          `${p} ft`,
          [`${w * h} ft`, `${w + h} ft`, `${p - 4} ft`],
          (k) => `${p + k * 2} ft`,
        ),
        explanation: `Add ${w} + ${h} = ${w + h}, then double: ${w + h} × 2 = ${p} ft!`,
      };
    }

    // ═══════════ TIER 2 NEW: MONEY & MAKING CHANGE ═══════════
    case 'm-t2-money-coins': {
      const q = randInt(rng, 1, 4);
      const d = randInt(rng, 1, 4);
      const n = randInt(rng, 1, 3);
      const total = q * 25 + d * 10 + n * 5;
      const ans = formatMoney(total);
      return {
        ...base,
        sprintPrompt: `How much money is ${q} ${q === 1 ? 'quarter' : 'quarters'}, ${d} ${d === 1 ? 'dime' : 'dimes'}, and ${n} ${n === 1 ? 'nickel' : 'nickels'}?`,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [formatMoney(total + 10), formatMoney(total - 10), formatMoney(total + 25), formatMoney(total + 5)],
          (k) => formatMoney(total + k * 15),
        ),
        explanation: `${q}×25¢ (${q * 25}¢) + ${d}×10¢ (${d * 10}¢) + ${n}×5¢ (${n * 5}¢) = ${ans}!`,
      };
    }

    case 'm-t2-money-total': {
      const p1 = randInt(rng, 2, 6) * 100 + pick(rng, [25, 50, 75]);
      const p2 = randInt(rng, 1, 5) * 100 + pick(rng, [25, 50, 75]);
      const total = p1 + p2;
      const ans = formatMoney(total);
      return {
        ...base,
        sprintPrompt: `A comic costs ${formatMoney(p1)} and a snack costs ${formatMoney(p2)}. What is the total?`,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [formatMoney(total + 100), formatMoney(total - 50), formatMoney(total + 50)],
          (k) => formatMoney(total + k * 25),
        ),
        explanation: `${formatMoney(p1)} + ${formatMoney(p2)} = ${ans}!`,
      };
    }

    case 'm-t2-money-change': {
      const bill = pick(rng, [500, 1000, 2000]);
      const cost =
        bill === 500
          ? randInt(rng, 1, 3) * 100 + pick(rng, [25, 50, 75])
          : randInt(rng, 3, Math.floor(bill / 100) - 2) * 100 + pick(rng, [25, 50, 75]);
      const change = bill - cost;
      const ans = formatMoney(change);
      return {
        ...base,
        sprintPrompt: `You buy a toy for ${formatMoney(cost)} and pay with ${formatMoney(bill)}. How much change do you get?`,
        sprintVisual: {
          kind: 'bar-model',
          totalLabel: formatMoney(bill),
          parts: [
            { label: formatMoney(cost), color: '#EA580C', weight: cost },
            { label: '? change', color: '#059669', weight: change },
          ],
        },
        revealVisualOnFeedback: true,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [formatMoney(change + 100), formatMoney(Math.max(25, change - 50)), formatMoney(change + 50)],
          (k) => formatMoney(change + k * 25),
        ),
        explanation: `${formatMoney(bill)} − ${formatMoney(cost)} = ${ans} change!`,
      };
    }

    case 'm-t2-money-multi': {
      const count = randInt(rng, 2, 5);
      const each = pick(rng, [150, 200, 250, 300]);
      const bill = count * each + pick(rng, [100, 200, 250, 300]);
      const roundedBill = bill <= 1000 ? 1000 : 2000;
      const spent = count * each;
      const left = roundedBill - spent;
      if (left <= 0) return base;
      const ans = formatMoney(left);
      return {
        ...base,
        sprintPrompt: `${name} buys ${count} stickers at ${formatMoney(each)} each and pays with ${formatMoney(roundedBill)}. How much change?`,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [formatMoney(spent), formatMoney(left + 100), formatMoney(Math.max(50, left - 100))],
          (k) => formatMoney(left + k * 50),
        ),
        explanation: `${count} × ${formatMoney(each)} = ${formatMoney(spent)}; ${formatMoney(roundedBill)} − ${formatMoney(spent)} = ${ans}!`,
      };
    }

    // ═══════════ TIER 2 NEW: ANGLES & LINES ═══════════
    case 'm-t2-angle-type': {
      const kind = pick(rng, ['acute', 'right', 'obtuse'] as const);
      const deg =
        kind === 'right'
          ? 90
          : kind === 'acute'
            ? pick(rng, [30, 40, 45, 55, 65])
            : pick(rng, [115, 125, 135, 145, 155]);
      const ans = kind === 'right' ? 'Right angle (90°)' : kind === 'acute' ? 'Acute angle (< 90°)' : 'Obtuse angle (> 90°)';
      return {
        ...base,
        sprintPrompt: 'What type of angle is shown?',
        sprintVisual: { kind: 'angle-view', degrees: deg, showDegrees: false },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          ['Acute angle (< 90°)', 'Right angle (90°)', 'Obtuse angle (> 90°)', 'Straight angle (180°)'],
          () => 'Straight angle (180°)',
        ),
        explanation: `This angle measures ${deg}°, which is ${kind === 'right' ? 'exactly 90° (Right)' : kind === 'acute' ? 'less than 90° (Acute)' : 'greater than 90° (Obtuse)'}!`,
      };
    }

    case 'm-t2-line-rel': {
      const rel = pick(rng, ['parallel', 'perpendicular', 'intersecting'] as const);
      const ans =
        rel === 'parallel'
          ? 'Parallel lines'
          : rel === 'perpendicular'
            ? 'Perpendicular lines'
            : 'Intersecting (not perpendicular)';
      return {
        ...base,
        sprintPrompt: 'How are these two lines related?',
        sprintVisual: { kind: 'line-relation', relation: rel },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          ['Parallel lines', 'Perpendicular lines', 'Intersecting (not perpendicular)', 'Curved lines'],
          () => 'Curved lines',
        ),
        explanation:
          rel === 'parallel'
            ? 'Parallel lines stay the same distance apart and never cross!'
            : rel === 'perpendicular'
              ? 'Perpendicular lines cross to make a 90° square corner!'
              : 'These lines cross at a point, but do not form a 90° right angle!',
      };
    }

    case 'm-t2-angle-degree-class': {
      const deg = pick(rng, [25, 42, 78, 90, 108, 135, 162]);
      const ans = deg < 90 ? 'Acute' : deg === 90 ? 'Right' : 'Obtuse';
      return {
        ...base,
        sprintPrompt: `An angle measures ${deg}°. Is it Acute, Right, or Obtuse?`,
        sprintVisual: { kind: 'angle-view', degrees: deg, showDegrees: true },
        revealVisualOnFeedback: true,
        correctAnswer: ans,
        distractors: uniqueDistractors(ans, ['Acute', 'Right', 'Obtuse', 'Straight'], () => 'Straight'),
        explanation: `${deg}° is ${deg < 90 ? 'less than 90° → Acute' : deg === 90 ? 'exactly 90° → Right' : 'between 90° and 180° → Obtuse'}!`,
      };
    }

    // ═══════════ TIER 3: FACTORS, FRACTIONS, WORD PROBS, ROUNDING, UNITS ═══════════
    case 'm-t3-multiples': {
      const n = pick(rng, [6, 7, 8, 9]);
      const ans = n * randInt(rng, 4, 9);
      return {
        ...base,
        sprintPrompt: `Which number is a MULTIPLE of ${n}?`,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans - 2), String(ans + 3), String(ans - 4), String(ans + 2)].filter((s) => Number(s) % n !== 0),
          (k) => String(ans + k * n + 1),
        ),
        explanation: `${n} × ${ans / n} = ${ans}, so ${ans} is a multiple of ${n}!`,
      };
    }

    case 'm-t3-times-as-many': {
      const mult = randInt(rng, 3, 8);
      const val = randInt(rng, 5, 9);
      const ans = mult * val;
      return {
        ...base,
        sprintPrompt: `What number is ${mult} times as many as ${val}?`,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(mult + val), String(ans - val), String(ans + val)],
          (k) => String(ans + k * 2),
        ),
        explanation: `${mult} times as many as ${val} = ${mult} × ${val} = ${ans}!`,
      };
    }

    case 'm-t3-add-like': {
      const den = pick(rng, [6, 8, 10, 12]);
      const a = randInt(rng, 1, Math.floor(den / 2) - 1);
      const b = randInt(rng, 1, den - a - 1);
      const sum = a + b;
      return {
        ...base,
        sprintPrompt: `What is ${a}/${den} + ${b}/${den}?`,
        sprintVisual: { kind: 'fraction-op', aNum: a, bNum: b, denominator: den, op: '+' },
        revealVisualOnFeedback: true,
        correctAnswer: `${sum}/${den}`,
        distractors: uniqueDistractors(
          `${sum}/${den}`,
          [`${sum}/${den * 2}`, `${Math.max(1, sum - 1)}/${den}`, `${Math.abs(a - b) || 1}/${den}`],
          (k) => `${sum + k}/${den}`,
        ),
        explanation: `Keep denominator ${den} and add tops: ${a} + ${b} = ${sum} → ${sum}/${den}!`,
      };
    }

    case 'm-t3-sub-like': {
      const den = pick(rng, [6, 8, 10, 12]);
      const a = randInt(rng, Math.floor(den / 2) + 1, den - 1);
      const b = randInt(rng, 1, a - 1);
      const diff = a - b;
      return {
        ...base,
        sprintPrompt: `What is ${a}/${den} − ${b}/${den}?`,
        sprintVisual: { kind: 'fraction-op', aNum: a, bNum: b, denominator: den, op: '-' },
        revealVisualOnFeedback: true,
        correctAnswer: `${diff}/${den}`,
        distractors: uniqueDistractors(
          `${diff}/${den}`,
          [`${diff}/0`, `${diff + 1}/${den}`, `${Math.max(1, diff - 1)}/${den}`],
          (k) => `${diff + k}/${den + 2}`,
        ),
        explanation: `Keep denominator ${den} and subtract tops: ${a} − ${b} = ${diff} → ${diff}/${den}!`,
      };
    }

    case 'm-t3-mixed-add': {
      const den = pick(rng, [4, 5, 6, 8]);
      const a = randInt(rng, Math.floor(den / 2) + 1, den - 1);
      const b = randInt(rng, den - a + 1, den - 1);
      const sum = a + b;
      const rem = sum - den;
      const ans = `1 ${rem}/${den}`;
      return {
        ...base,
        sprintPrompt: `What is ${a}/${den} + ${b}/${den} as a mixed number?`,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`1 ${Math.max(1, rem - 1)}/${den}`, `2 ${rem}/${den}`, `${sum}/${den * 2}`, `1 ${(rem % (den - 1)) + 1}/${den}`],
          (k) => `1 ${k}/${den + 1}`,
        ),
        explanation: `${a}/${den} + ${b}/${den} = ${sum}/${den} = ${den}/${den} + ${rem}/${den} = ${ans}!`,
      };
    }

    case 'm-t3-mult-frac': {
      const den = pick(rng, [3, 4, 5, 6]);
      const num = randInt(rng, 1, den - 1);
      const whole = randInt(rng, 2, 5);
      const top = whole * num;
      const ans = `${top}/${den}`;
      return {
        ...base,
        sprintPrompt: `What is ${whole} × ${num}/${den}?`,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`${top}/${den * whole}`, `${whole + num}/${den}`, `${top + 1}/${den}`],
          (k) => `${top + k}/${den}`,
        ),
        explanation: `Multiply the whole number by the numerator only: ${whole} × ${num} = ${top} → ${ans}!`,
      };
    }

    case 'm-t3-wp-tickets': {
      const qty = randInt(rng, 3, 5);
      const price = randInt(rng, 2, 4);
      const total = qty * price;
      const pay = total < 10 ? 10 : total < 15 ? 15 : total < 20 ? 20 : 25;
      const change = pay - total;
      return {
        ...base,
        sprintPrompt: `${qty} notebooks cost $${price} each. You pay with $${pay}. How much change do you get?`,
        sprintVisual: {
          kind: 'bar-model',
          totalLabel: `$${pay}`,
          parts: [
            { label: `${qty} × $${price} = $${total}`, color: '#EA580C', weight: total },
            { label: '? change', color: '#059669', weight: change },
          ],
        },
        revealVisualOnFeedback: true,
        correctAnswer: `$${change}`,
        distractors: uniqueDistractors(
          `$${change}`,
          [`$${total}`, `$${change + 2}`, `$${Math.max(1, pay - price)}`],
          (k) => `$${change + k}`,
        ),
        explanation: `${qty} × $${price} = $${total}, then $${pay} − $${total} = $${change} change!`,
      };
    }

    case 'm-t3-wp-packs': {
      const boxes = randInt(rng, 3, 6);
      const perBox = randInt(rng, 6, 9);
      const extra = randInt(rng, 3, 8);
      const total = boxes * perBox + extra;
      return {
        ...base,
        sprintPrompt: `${name} has ${boxes} boxes of ${perBox} crayons plus ${extra} loose crayons. How many crayons total?`,
        correctAnswer: String(total),
        distractors: uniqueDistractors(
          String(total),
          [String(boxes * perBox), String(boxes * perBox - extra), String(boxes + perBox + extra)],
          (k) => String(total + k * 2),
        ),
        explanation: `${boxes} × ${perBox} = ${boxes * perBox}, plus ${extra} = ${total}!`,
      };
    }

    case 'm-t3-wp-split': {
      const jars = pick(rng, [3, 4, 5, 6]);
      const perJar = randInt(rng, 4, 9);
      const total = jars * perJar;
      const p1 = randInt(rng, 5, total - 5);
      const p2 = total - p1;
      return {
        ...base,
        sprintPrompt: `${name} picked ${p1} shells and ${name2} picked ${p2} shells. They split ALL shells equally into ${jars} jars. How many per jar?`,
        correctAnswer: `${perJar} shells`,
        distractors: uniqueDistractors(
          `${perJar} shells`,
          [`${perJar + 1} shells`, `${Math.max(1, perJar - 1)} shells`, `${total} shells`],
          (k) => `${perJar + k + 1} shells`,
        ),
        explanation: `${p1} + ${p2} = ${total} shells total; ${total} ÷ ${jars} = ${perJar} per jar!`,
      };
    }

    case 'm-t3-wp-remainder-up': {
      const cap = pick(rng, [5, 6, 8]);
      const full = randInt(rng, 3, 6);
      const extra = randInt(rng, 1, cap - 1);
      const kids = full * cap + extra;
      const vans = full + 1;
      const fmtVans = (v: number) => `${v} ${v === 1 ? 'van' : 'vans'}`;
      return {
        ...base,
        sprintPrompt: `${kids} campers ride in vans that hold ${cap} campers each. How many vans are needed so EVERYONE rides?`,
        correctAnswer: fmtVans(vans),
        distractors: uniqueDistractors(
          fmtVans(vans),
          [fmtVans(full), fmtVans(vans + 1), fmtVans(extra)],
          (k) => fmtVans(vans + k + 1),
        ),
        explanation: `${kids} ÷ ${cap} = ${full} R${extra}. You need 1 extra van for the remaining ${extra} → ${fmtVans(vans)}!`,
      };
    }

    // ═══════════ TIER 3 NEW: ROUNDING BIG NUMBERS ═══════════
    case 'm-t3-round-1000': {
      const baseTh = randInt(rng, 2, 8) * 1000;
      const rem = pick(rng, [180, 320, 440, 500, 560, 740, 890]);
      const val = baseTh + rem;
      const rounded = rem >= 500 ? baseTh + 1000 : baseTh;
      const other = rem >= 500 ? baseTh : baseTh + 1000;
      return {
        ...base,
        sprintPrompt: `Round ${val.toLocaleString()} to the nearest THOUSAND.`,
        sprintVisual: { kind: 'number-line-round', low: baseTh, mid: baseTh + 500, high: baseTh + 1000, value: val },
        revealVisualOnFeedback: true,
        correctAnswer: rounded.toLocaleString(),
        distractors: uniqueDistractors(
          rounded.toLocaleString(),
          [other.toLocaleString(), (rounded + 1000).toLocaleString(), Math.max(1000, baseTh - 1000).toLocaleString()],
          (k) => (rounded + k * 1000).toLocaleString(),
        ),
        explanation: `Hundreds digit is ${Math.floor(rem / 100)} (${rem >= 500 ? '5 or more → round UP' : '4 or less → stay down'}) → ${rounded.toLocaleString()}!`,
      };
    }

    case 'm-t3-pv-10x': {
      const d = randInt(rng, 2, 8);
      const thousands = (d * 1000).toLocaleString('en-US');
      const shift = pick(rng, [
        { from: d * 10, to: d * 100, q: `How many times greater is ${d * 100} than ${d * 10}?`, a: '10 times' },
        { from: d * 10, to: d * 1000, q: `How many times greater is ${thousands} than ${d * 10}?`, a: '100 times' },
        { from: d * 100, to: d * 1000, q: `How many times greater is ${thousands} than ${d * 100}?`, a: '10 times' },
      ]);
      return {
        ...base,
        sprintPrompt: shift.q,
        correctAnswer: shift.a,
        distractors: uniqueDistractors(shift.a, ['10 times', '100 times', '1,000 times', '2 times'], () => '5 times'),
        explanation: `Each place to the left is 10× greater (${shift.to.toLocaleString('en-US')} ÷ ${shift.from.toLocaleString('en-US')} = ${shift.to / shift.from})!`,
      };
    }

    case 'm-t3-est-sum': {
      const a = randInt(rng, 2, 5) * 100 + pick(rng, [12, 24, 82, 91]);
      const b = randInt(rng, 2, 5) * 100 + pick(rng, [14, 28, 79, 88]);
      const ra = Math.round(a / 100) * 100;
      const rb = Math.round(b / 100) * 100;
      const ans = ra + rb;
      return {
        ...base,
        sprintPrompt: `Round each number to the nearest 100 to ESTIMATE ${a} + ${b}:`,
        correctAnswer: ans.toLocaleString('en-US'),
        distractors: uniqueDistractors(
          ans.toLocaleString('en-US'),
          [(ans - 100).toLocaleString('en-US'), (ans + 100).toLocaleString('en-US'), (ans + 200).toLocaleString('en-US')],
          (k) => (ans + k * 100).toLocaleString('en-US'),
        ),
        explanation: `${a} ≈ ${ra} and ${b} ≈ ${rb}, so ${ra} + ${rb} = ${ans.toLocaleString('en-US')}!`,
      };
    }

    // ═══════════ TIER 3 NEW: UNITS & CONVERSIONS ═══════════
    case 'm-t3-unit-ft-in': {
      const ft = randInt(rng, 2, 7);
      const ans = ft * 12;
      return {
        ...base,
        sprintPrompt: `1 foot = 12 inches. How many inches are in ${ft} feet?`,
        correctAnswer: `${ans} in`,
        distractors: uniqueDistractors(
          `${ans} in`,
          [`${ft * 10} in`, `${ans + 12} in`, `${ans - 12} in`],
          (k) => `${ans + k * 6} in`,
        ),
        explanation: `${ft} × 12 = ${ans} inches!`,
      };
    }

    case 'm-t3-unit-m-cm': {
      const m = randInt(rng, 2, 9);
      const extraCm = pick(rng, [0, 25, 40, 50, 75]);
      const ans = m * 100 + extraCm;
      const prompt =
        extraCm === 0
          ? `1 meter = 100 cm. How many centimeters are in ${m} meters?`
          : `1 meter = 100 cm. Convert ${m} m ${extraCm} cm to centimeters:`;
      return {
        ...base,
        sprintPrompt: prompt,
        correctAnswer: `${ans} cm`,
        distractors: uniqueDistractors(
          `${ans} cm`,
          [`${m * 10 + extraCm} cm`, `${ans + 100} cm`, `${Math.max(10, ans - 100)} cm`],
          (k) => `${ans + k * 10} cm`,
        ),
        explanation: `${m} × 100${extraCm ? ` + ${extraCm}` : ''} = ${ans} cm!`,
      };
    }

    case 'm-t3-unit-lb-oz': {
      const lb = randInt(rng, 2, 5);
      const ans = lb * 16;
      return {
        ...base,
        sprintPrompt: `1 pound = 16 ounces. How many ounces are in ${lb} pounds?`,
        correctAnswer: `${ans} oz`,
        distractors: uniqueDistractors(
          `${ans} oz`,
          [`${lb * 12} oz`, `${ans + 16} oz`, `${ans - 8} oz`],
          (k) => `${ans + k * 4} oz`,
        ),
        explanation: `${lb} × 16 = ${ans} ounces!`,
      };
    }

    case 'm-t3-unit-hr-min': {
      const hrs = randInt(rng, 2, 5);
      const extra = pick(rng, [0, 15, 20, 30]);
      const ans = hrs * 60 + extra;
      const prompt =
        extra === 0
          ? `1 hour = 60 minutes. How many minutes are in ${hrs} hours?`
          : `How many minutes are in ${hrs} hours and ${extra} minutes?`;
      return {
        ...base,
        sprintPrompt: prompt,
        correctAnswer: `${ans} min`,
        distractors: uniqueDistractors(
          `${ans} min`,
          [`${hrs * 100 + extra} min`, `${ans + 60} min`, `${ans - 30} min`],
          (k) => `${ans + k * 10} min`,
        ),
        explanation: `${hrs} × 60 = ${hrs * 60}${extra ? `, plus ${extra} = ${ans}` : ''} minutes!`,
      };
    }

    // ═══════════ TIER 4: MULTI-DIGIT, DECIMALS, ANGLES, LINE PLOTS ═══════════
    case 'm-t4-24x6': {
      const tens = randInt(rng, 2, 5) * 10;
      const ones = randInt(rng, 2, 8);
      const mult = randInt(rng, 3, 6);
      const ans = (tens + ones) * mult;
      return {
        ...base,
        sprintPrompt: `Use the area model: what is ${tens + ones} × ${mult}?`,
        sprintVisual: { kind: 'area-model', tens, ones, multiplier: mult },
        revealVisualOnFeedback: false,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans - 10), String(ans + 10), String(tens * mult + ones)],
          (k) => String(ans + k * 4),
        ),
        explanation: `(${tens}×${mult}) + (${ones}×${mult}) = ${tens * mult} + ${ones * mult} = ${ans}!`,
      };
    }

    case 'm-t4-35x8': {
      const tens = randInt(rng, 3, 6) * 10;
      const ones = randInt(rng, 2, 8);
      const mult = randInt(rng, 6, 9);
      const ans = (tens + ones) * mult;
      return {
        ...base,
        sprintPrompt: `What is ${tens + ones} × ${mult}?`,
        sprintVisual: { kind: 'area-model', tens, ones, multiplier: mult },
        revealVisualOnFeedback: true,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans - 10), String(ans + 10), String(ans - mult)],
          (k) => String(ans + k * 6),
        ),
        explanation: `(${tens}×${mult}) + (${ones}×${mult}) = ${tens * mult} + ${ones * mult} = ${ans}!`,
      };
    }

    case 'm-t4-14x12': {
      const a = randInt(rng, 12, 18);
      const b = pick(rng, [11, 12, 13, 14, 15]);
      const ans = a * b;
      return {
        ...base,
        sprintPrompt: `What is ${a} × ${b}?`,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans - a), String(ans + a), String(ans - 10)],
          (k) => String(ans + k * 5),
        ),
        explanation: `Break ${b} into 10 + ${b - 10}: (${a}×10) + (${a}×${b - 10}) = ${a * 10} + ${a * (b - 10)} = ${ans}!`,
      };
    }

    case 'm-t4-long-div': {
      const div = pick(rng, [3, 4, 5, 6]);
      const q = randInt(rng, 21, 39);
      const dividend = div * q;
      return {
        ...base,
        sprintPrompt: `What is ${dividend} ÷ ${div}?`,
        correctAnswer: String(q),
        distractors: uniqueDistractors(
          String(q),
          [String(q - 2), String(q + 2), String(q + 5)],
          (k) => String(q + k),
        ),
        explanation: `${div} × ${q} = ${dividend}, so ${dividend} ÷ ${div} = ${q}!`,
      };
    }

    case 'm-t4-tenths-dec': {
      const t = randInt(rng, 2, 9);
      const ans = `0.${t}`;
      return {
        ...base,
        sprintPrompt: `Which decimal equals ${t}/10?`,
        sprintVisual: { kind: 'decimal-grid', shaded: t * 10, label: `${t}/10` },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`0.0${t}`, `${t}.0`, `0.${Math.max(1, t - 1)}5`],
          (k) => `0.${((t + k) % 9) + 1}`,
        ),
        explanation: `${t} tenths = 0.${t} (also written 0.${t}0)!`,
      };
    }

    case 'm-t4-add-10-100': {
      const t = randInt(rng, 2, 6);
      const h = randInt(rng, 11, 35);
      const sum = t * 10 + h;
      const ans = `${sum}/100`;
      return {
        ...base,
        sprintPrompt: `What is ${t}/10 + ${h}/100?`,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`${t + h}/100`, `${t + h}/110`, `${sum - 10}/100`],
          (k) => `${sum + k}/100`,
        ),
        explanation: `${t}/10 = ${t * 10}/100; ${t * 10}/100 + ${h}/100 = ${sum}/100!`,
      };
    }

    case 'm-t4-compare-dec': {
      const t = randInt(rng, 3, 8);
      const lowerH = (t - 1) * 10 + randInt(rng, 5, 9);
      const aStr = `0.${t}`;
      const bStr = `0.${String(lowerH).padStart(2, '0')}`;
      return {
        ...base,
        sprintPrompt: `Which decimal is GREATER: ${aStr} or ${bStr}?`,
        correctAnswer: aStr,
        distractors: [bStr, 'They are equal', `0.0${t}`],
        explanation: `${aStr} = 0.${t}0, which is greater than ${bStr}!`,
      };
    }

    case 'm-t4-frac-of-set': {
      const den = pick(rng, [3, 4, 5, 6]);
      const num = randInt(rng, 2, den - 1);
      const unit = randInt(rng, 4, 9);
      const total = den * unit;
      const ans = num * unit;
      return {
        ...base,
        sprintPrompt: `What is ${num}/${den} of ${total}?`,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(unit), String(ans - unit), String(ans + unit)],
          (k) => String(ans + k * 2),
        ),
        explanation: `1/${den} of ${total} is ${unit}; ${num} parts = ${num} × ${unit} = ${ans}!`,
      };
    }

    // ═══════════ TIER 4 NEW: MEASURING & MISSING ANGLES ═══════════
    case 'm-t4-ang-90': {
      const part = pick(rng, [20, 25, 30, 35, 40, 50, 55, 65]);
      const miss = 90 - part;
      return {
        ...base,
        sprintPrompt: `Two angles form a 90° right angle. One angle is ${part}°. What is the missing angle?`,
        sprintVisual: { kind: 'angle-view', degrees: 90, showDegrees: true, label: `${part}° + ? = 90°` },
        revealVisualOnFeedback: false,
        correctAnswer: `${miss}°`,
        distractors: uniqueDistractors(
          `${miss}°`,
          [`${180 - part}°`, `${miss + 10}°`, `${Math.max(5, miss - 10)}°`],
          (k) => `${miss + k * 5}°`,
        ),
        explanation: `90° − ${part}° = ${miss}°!`,
      };
    }

    case 'm-t4-ang-180': {
      const part = pick(rng, [35, 45, 55, 65, 70, 110, 125, 135]);
      const miss = 180 - part;
      return {
        ...base,
        sprintPrompt: `Two angles lie on a straight line (180°). One angle is ${part}°. What is the other angle?`,
        sprintVisual: { kind: 'angle-view', degrees: part, showDegrees: true, label: `${part}° + ? = 180°` },
        revealVisualOnFeedback: false,
        correctAnswer: `${miss}°`,
        distractors: uniqueDistractors(
          `${miss}°`,
          [`${Math.abs(90 - part) || 40}°`, `${miss + 10}°`, `${Math.max(10, miss - 10)}°`],
          (k) => `${miss + k * 5}°`,
        ),
        explanation: `A straight line is 180°: 180° − ${part}° = ${miss}°!`,
      };
    }

    case 'm-t4-ang-add': {
      const a = pick(rng, [25, 35, 40, 45, 55]);
      const b = pick(rng, [30, 45, 50, 60, 75]);
      const sum = a + b;
      return {
        ...base,
        sprintPrompt: `Two side-by-side angles measure ${a}° and ${b}°. What is their combined angle?`,
        sprintVisual: { kind: 'angle-view', degrees: sum, showDegrees: false, label: `${a}° + ${b}° = ?` },
        revealVisualOnFeedback: true,
        correctAnswer: `${sum}°`,
        distractors: uniqueDistractors(
          `${sum}°`,
          [`${Math.abs(b - a) || 15}°`, `${sum + 10}°`, `${sum - 10}°`],
          (k) => `${sum + k * 5}°`,
        ),
        explanation: `Add the two adjacent angles: ${a}° + ${b}° = ${sum}°!`,
      };
    }

    case 'm-t4-ang-circle': {
      const turns = pick(rng, [
        { q: 'How many degrees is 1/4 of a full circle turn?', a: '90°', exp: '360° ÷ 4 = 90°!' },
        { q: 'How many degrees is 1/2 of a full circle turn?', a: '180°', exp: '360° ÷ 2 = 180°!' },
        { q: 'How many degrees is 3/4 of a full circle turn?', a: '270°', exp: '3 × 90° = 270°!' },
        { q: 'How many degrees is 1 full circle turn?', a: '360°', exp: 'A full circle is 360°!' },
      ]);
      return {
        ...base,
        sprintPrompt: turns.q,
        correctAnswer: turns.a,
        distractors: uniqueDistractors(turns.a, ['90°', '180°', '270°', '360°'], () => '45°'),
        explanation: turns.exp,
      };
    }

    // ═══════════ TIER 4 NEW: LINE PLOTS & FRACTION DATA ═══════════
    case 'm-t4-lp-count': {
      const counts = [randInt(rng, 1, 3), randInt(rng, 1, 4), randInt(rng, 1, 3), randInt(rng, 1, 3)];
      const marks = [
        { label: '1/4', count: counts[0] },
        { label: '2/4', count: counts[1] },
        { label: '3/4', count: counts[2] },
        { label: '1', count: counts[3] },
      ];
      const total = counts.reduce((s, c) => s + c, 0);
      return {
        ...base,
        sprintPrompt: 'How many total measurements (✕ marks) are shown on this line plot?',
        sprintVisual: { kind: 'line-plot', title: 'Ribbon Lengths (feet)', marks },
        revealVisualOnFeedback: false,
        correctAnswer: String(total),
        distractors: uniqueDistractors(
          String(total),
          [String(total - 1), String(total + 1), String(total + 2)],
          (k) => String(total + k + 2),
        ),
        explanation: `Count all ✕ marks: ${counts.join(' + ')} = ${total}!`,
      };
    }

    case 'm-t4-lp-mode': {
      const labels = ['1/4 in', '2/4 in', '3/4 in', '1 in'];
      const winIdx = randInt(rng, 0, 3);
      const counts = labels.map((_, idx) => (idx === winIdx ? 4 : randInt(rng, 1, 2)));
      const marks = labels.map((label, idx) => ({ label, count: counts[idx] }));
      const ans = labels[winIdx];
      return {
        ...base,
        sprintPrompt: 'Which length appeared MOST often on this line plot?',
        sprintVisual: { kind: 'line-plot', title: 'Bug Lengths (inches)', marks },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(ans, labels, () => '1/2 in'),
        explanation: `${ans} has the tallest stack of ✕ marks (${counts[winIdx]} times)!`,
      };
    }

    case 'm-t4-lp-range': {
      const scenarios = [
        {
          marks: [
            { label: '1/4', count: 2 },
            { label: '2/4', count: 3 },
            { label: '3/4', count: 1 },
            { label: '4/4', count: 2 },
          ],
          ans: '3/4',
          distractors: ['1/4', '2/4', '4/4'] as string[],
          exp: 'Greatest (4/4) − Least (1/4) = 3/4!',
        },
        {
          marks: [
            { label: '1/8', count: 1 },
            { label: '3/8', count: 3 },
            { label: '5/8', count: 2 },
            { label: '7/8', count: 2 },
          ],
          ans: '6/8',
          distractors: ['2/8', '4/8', '5/8'] as string[],
          exp: 'Greatest (7/8) − Least (1/8) = 6/8!',
        },
        {
          marks: [
            { label: '2/6', count: 2 },
            { label: '3/6', count: 1 },
            { label: '4/6', count: 0 },
            { label: '5/6', count: 3 },
            { label: '6/6', count: 1 },
          ],
          ans: '4/6',
          distractors: ['1/6', '2/6', '3/6'] as string[],
          exp: 'Greatest (6/6) − Least (2/6) = 4/6!',
        },
      ];
      const sc = pick(rng, scenarios);
      return {
        ...base,
        sprintPrompt: 'What is the DIFFERENCE between the greatest and least lengths on the plot?',
        sprintVisual: { kind: 'line-plot', title: 'Leaf Widths (in)', marks: sc.marks },
        revealVisualOnFeedback: false,
        correctAnswer: sc.ans,
        distractors: uniqueDistractors(sc.ans, sc.distractors, (k) => `${k}/8`),
        explanation: sc.exp,
      };
    }

    case 'm-t4-lp-sum': {
      const numMarks = randInt(rng, 2, 4);
      const den = pick(rng, [4, 5, 8]);
      const valNum = pick(rng, [1, 2, 3].filter((n) => n < den));
      const sumNum = numMarks * valNum;
      const ans = `${sumNum}/${den}`;
      const marks = [
        { label: `1/${den}`, count: valNum === 1 ? numMarks : 1 },
        { label: `2/${den}`, count: valNum === 2 ? numMarks : 2 },
        { label: `3/${den}`, count: valNum === 3 ? numMarks : 1 },
      ];
      return {
        ...base,
        sprintPrompt: `If you line up all ${numMarks} sticks that measure ${valNum}/${den} ft, what is their TOTAL length?`,
        sprintVisual: { kind: 'line-plot', title: 'Craft Sticks (feet)', marks },
        revealVisualOnFeedback: false,
        correctAnswer: `${ans} ft`,
        distractors: uniqueDistractors(
          `${ans} ft`,
          [`${sumNum}/${den * numMarks} ft`, `${sumNum + 1}/${den} ft`, `${Math.max(1, sumNum - 1)}/${den} ft`],
          (k) => `${sumNum + k + 1}/${den} ft`,
        ),
        explanation: `${numMarks} × ${valNum}/${den} = ${ans} ft!`,
      };
    }

    case 'm-t2-shape-angles': {
      const shapes = [
        { name: 'a rectangle', rightAngles: 4, d: ['2', '3', '0'] },
        { name: 'a square', rightAngles: 4, d: ['2', '3', '1'] },
        { name: 'a right triangle', rightAngles: 1, d: ['2', '3', '0'] },
        { name: 'an equilateral triangle', rightAngles: 0, d: ['1', '2', '3'] },
      ] as const;
      const chosen = pick(rng, shapes);
      return {
        ...base,
        sprintPrompt: `How many RIGHT angles (90°) does ${chosen.name} have?`,
        correctAnswer: String(chosen.rightAngles),
        distractors: [chosen.d[0], chosen.d[1], chosen.d[2]],
        explanation: `${chosen.name[0].toUpperCase()}${chosen.name.slice(1)} has ${chosen.rightAngles} right angle${chosen.rightAngles === 1 ? '' : 's'}!`,
      };
    }

    case 'm-t3-factors-24': {
      const banks: { n: number; factor: number; non: [string, string, string]; pairs: [number, number][] }[] = [
        { n: 24, factor: 6, non: ['5', '7', '9'], pairs: [[1, 24], [2, 12], [3, 8], [4, 6]] },
        { n: 36, factor: 9, non: ['5', '7', '8'], pairs: [[1, 36], [2, 18], [3, 12], [4, 9], [6, 6]] },
        { n: 28, factor: 7, non: ['3', '6', '8'], pairs: [[1, 28], [2, 14], [4, 7]] },
        { n: 32, factor: 8, non: ['3', '5', '6'], pairs: [[1, 32], [2, 16], [4, 8]] },
        { n: 30, factor: 6, non: ['4', '7', '8'], pairs: [[1, 30], [2, 15], [3, 10], [5, 6]] },
      ];
      const b = pick(rng, banks);
      return {
        ...base,
        sprintPrompt: `Which number is a FACTOR of ${b.n}?`,
        sprintVisual: { kind: 'factor-pairs', value: b.n, pairs: b.pairs },
        revealVisualOnFeedback: true,
        correctAnswer: String(b.factor),
        distractors: [b.non[0], b.non[1], b.non[2]],
        explanation: `${b.n} ÷ ${b.factor} = ${b.n / b.factor} with no remainder, so ${b.factor} is a factor of ${b.n}!`,
      };
    }

    case 'm-t3-prime-comp': {
      const primes = [11, 13, 17, 19, 23, 29];
      const comps = [9, 12, 14, 15, 18, 21, 25, 27];
      const p = pick(rng, primes);
      const d1 = pick(rng, comps);
      const d2 = pick(rng, comps.filter((x) => x !== d1));
      const d3 = pick(rng, comps.filter((x) => x !== d1 && x !== d2));
      return {
        ...base,
        sprintPrompt: 'Which of these numbers is a PRIME number?',
        correctAnswer: String(p),
        distractors: [String(d1), String(d2), String(d3)],
        explanation: `${p} has only two factors: 1 and ${p}!`,
      };
    }

    case 'm-t3-big-compare': {
      const baseThousands = randInt(rng, 2, 8) * 10000;
      const h1 = randInt(rng, 2, 7);
      const h2 = h1 + randInt(rng, 1, 2);
      const a = baseThousands + h1 * 1000 + randInt(rng, 100, 900);
      const b = baseThousands + h2 * 1000 + randInt(rng, 100, 900);
      const askGreater = rng() < 0.5;
      const ans = askGreater ? b : a;
      const other = askGreater ? a : b;
      const fmt = (v: number) => v.toLocaleString('en-US');
      return {
        ...base,
        sprintPrompt: `Which number is ${askGreater ? 'GREATEST' : 'SMALLEST'}?`,
        correctAnswer: fmt(ans),
        distractors: uniqueDistractors(
          fmt(ans),
          [fmt(other), fmt(askGreater ? a - 1000 : b + 1000), fmt(askGreater ? a - 500 : b + 500)],
          (k) => fmt(askGreater ? a - k * 100 : b + k * 100),
        ),
        explanation: `Compare from the left: ${fmt(ans)} is the ${askGreater ? 'greatest' : 'smallest'}!`,
      };
    }

    case 'm-t4-pro-garden': {
      const len = randInt(rng, 7, 12);
      const wid = randInt(rng, 4, 7);
      const area = len * wid;
      const perim = 2 * (len + wid);
      const askArea = rng() < 0.5;
      const ans = askArea ? `${area} sq ft` : `${perim} ft`;
      return {
        ...base,
        sprintPrompt: `A garden is ${len} ft long and ${wid} ft wide. What is its ${askArea ? 'AREA' : 'PERIMETER'}?`,
        sprintVisual: { kind: 'perimeter-rect', width: len, height: wid, unit: 'ft' },
        revealVisualOnFeedback: true,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          askArea
            ? [`${perim} sq ft`, `${area + len} sq ft`, `${area - wid} sq ft`]
            : [`${area} ft`, `${len + wid} ft`, `${perim + 4} ft`],
          (k) => (askArea ? `${area + k * 2} sq ft` : `${perim + k * 2} ft`),
        ),
        explanation: askArea
          ? `Area = ${len} × ${wid} = ${area} sq ft!`
          : `Perimeter = ${len} + ${wid} + ${len} + ${wid} = ${perim} ft!`,
      };
    }

    case 'm-t4-pro-twice-plus': {
      const baseNum = randInt(rng, 12, 26);
      const extra = randInt(rng, 4, 11);
      const total = baseNum * 2 + extra;
      return {
        ...base,
        sprintPrompt: `${name} has ${baseNum} stickers. ${name2} has TWICE as many PLUS ${extra} more. How many does ${name2} have?`,
        correctAnswer: `${total} stickers`,
        distractors: uniqueDistractors(
          `${total} stickers`,
          [`${baseNum * 2} stickers`, `${baseNum + extra} stickers`, `${total + extra} stickers`],
          (k) => `${total + k * 2} stickers`,
        ),
        explanation: `Twice ${baseNum} is ${baseNum * 2}, plus ${extra} = ${total} stickers!`,
      };
    }

    case 'm-t4-pro-fraction-left': {
      const den = pick(rng, [4, 5, 6]);
      const mult = randInt(rng, 4, 8);
      const total = den * mult;
      const usedNum = randInt(rng, 1, den - 1);
      const left = ((den - usedNum) * total) / den;
      const fmtMarbles = (v: number) => `${v} ${v === 1 ? 'marble' : 'marbles'}`;
      return {
        ...base,
        sprintPrompt: `${name} had ${total} marbles and gave away ${usedNum}/${den} of them. How many marbles are LEFT?`,
        correctAnswer: fmtMarbles(left),
        distractors: uniqueDistractors(
          fmtMarbles(left),
          [fmtMarbles(total - left), fmtMarbles(left + mult), fmtMarbles(Math.max(1, left - mult))],
          (k) => fmtMarbles(left + k * 2),
        ),
        explanation: `${usedNum}/${den} of ${total} is ${total - left} given away, leaving ${total} − ${total - left} = ${fmtMarbles(left)}!`,
      };
    }

    case 'm-t4-pro-schedule': {
      const perHr = randInt(rng, 12, 24);
      const hrs = randInt(rng, 3, 6);
      const total = perHr * hrs;
      return {
        ...base,
        sprintPrompt: `A robot prints ${perHr} stickers every hour. How many stickers in ${hrs} hours?`,
        correctAnswer: `${total} stickers`,
        distractors: uniqueDistractors(
          `${total} stickers`,
          [`${total - perHr} stickers`, `${total + perHr} stickers`, `${total + hrs} stickers`],
          (k) => `${total + k * 4} stickers`,
        ),
        explanation: `${perHr} × ${hrs} = ${total} stickers!`,
      };
    }

    default:
      return generatePhase2MathItem(base, rng) ?? base;
  }
}

export function hydrateDynamicMathSet(
  questSet: MathQuestSet,
  rng: () => number = Math.random,
): MathQuestSet {
  return {
    ...questSet,
    items: questSet.items.map((item) => generateDynamicMathItem(item, rng)),
  };
}

/**
 * Independent sanity & mathematical validity verifier used by our Vitest 1,000-problem Fuzz suite.
 */
export function validateMathItemInvariants(item: MathSkillItem): string[] {
  const errors: string[] = [];
  const sprintChoices = [item.correctAnswer, ...item.distractors];
  if (new Set(sprintChoices).size !== 4) {
    errors.push(`${item.id}: duplicate sprint choices [${sprintChoices.join(', ')}]`);
  }
  const wpChoices = [item.wordProblemAnswer, ...item.wordProblemDistractors];
  if (new Set(wpChoices).size !== 4) {
    errors.push(`${item.id}: duplicate word problem choices [${wpChoices.join(', ')}]`);
  }
  for (const c of [...sprintChoices, ...wpChoices]) {
    if (!c || c.includes('NaN') || c.includes('undefined') || c.includes('Infinity')) {
      errors.push(`${item.id}: invalid choice "${c}"`);
    }
  }
  const validSymmetryShapes = new Set([
    'square',
    'rectangle',
    'equilateral-triangle',
    'isosceles-triangle',
    'regular-hexagon',
    'heart',
  ]);
  const checkVisual = (v: MathSkillItem['sprintVisual'], label: string) => {
    if (!v) return;
    if (v.kind === 'fraction-bar' && (v.denominator <= 0 || v.numerator < 0 || v.numerator > v.denominator)) {
      errors.push(`${item.id} (${label}): invalid fraction-bar ${v.numerator}/${v.denominator}`);
    }
    if (v.kind === 'angle-view' && (v.degrees <= 0 || v.degrees >= 180)) {
      errors.push(`${item.id} (${label}): invalid angle ${v.degrees}`);
    }
    if (v.kind === 'number-line-round' && !(v.low <= v.value && v.value <= v.high)) {
      errors.push(`${item.id} (${label}): value ${v.value} outside [${v.low}, ${v.high}]`);
    }
    if (v.kind === 'array' && (v.rows <= 0 || v.cols <= 0)) {
      errors.push(`${item.id} (${label}): invalid array ${v.rows}x${v.cols}`);
    }
    if (v.kind === 'decimal-grid' && (v.shaded < 0 || v.shaded > 100 || !Number.isInteger(v.shaded))) {
      errors.push(`${item.id} (${label}): invalid decimal-grid shaded ${v.shaded}`);
    }
    if (v.kind === 'symmetry-shape') {
      if (!validSymmetryShapes.has(v.shape)) {
        errors.push(`${item.id} (${label}): invalid symmetry-shape "${v.shape}"`);
      }
      if (label === 'sprintVisual' && v.showLines !== false) {
        errors.push(`${item.id} (${label}): symmetry-shape sprintVisual leaks symmetry lines`);
      }
    }
    if (v.kind === 'area-model-2x2') {
      if (v.aTens <= 0 || v.aOnes <= 0 || v.bTens <= 0 || v.bOnes <= 0) {
        errors.push(
          `${item.id} (${label}): area-model-2x2 parts must be > 0 (${v.aTens}+${v.aOnes} × ${v.bTens}+${v.bOnes})`,
        );
      }
      if (label === 'sprintVisual' && v.hideProducts !== true) {
        errors.push(`${item.id} (${label}): area-model-2x2 sprintVisual must set hideProducts: true`);
      }
    }
    if (v.kind === 'coord-grid') {
      if (!Number.isInteger(v.maxCoord) || v.maxCoord < 4 || v.maxCoord > 8) {
        errors.push(`${item.id} (${label}): invalid coord-grid maxCoord ${v.maxCoord}`);
      }
      const inBounds = (pt: [number, number]) =>
        Number.isInteger(pt[0]) &&
        Number.isInteger(pt[1]) &&
        pt[0] >= 0 &&
        pt[0] <= v.maxCoord &&
        pt[1] >= 0 &&
        pt[1] <= v.maxCoord;
      if (!inBounds(v.point)) {
        errors.push(`${item.id} (${label}): coord-grid point (${v.point[0]}, ${v.point[1]}) out of 0..${v.maxCoord}`);
      }
      if (v.secondPoint && !inBounds(v.secondPoint)) {
        errors.push(
          `${item.id} (${label}): coord-grid secondPoint (${v.secondPoint[0]}, ${v.secondPoint[1]}) out of 0..${v.maxCoord}`,
        );
      }
      if (label === 'sprintVisual' && v.showCoords === true) {
        errors.push(`${item.id} (${label}): coord-grid sprintVisual must not leak showCoords: true`);
      }
    }
  };
  checkVisual(item.visual, 'visual');
  checkVisual(item.sprintVisual, 'sprintVisual');
  checkVisual(item.wordProblemVisual, 'wordProblemVisual');

  // Independent arithmetic cross-check for direct expression prompts
  const multMatch = item.sprintPrompt.match(/^What is (\d+) × (\d+)\?$/);
  if (multMatch) {
    const prod = Number(multMatch[1]) * Number(multMatch[2]);
    const expected = prod >= 1000 ? prod.toLocaleString('en-US') : String(prod);
    if (item.correctAnswer !== expected) {
      errors.push(`${item.id}: ${item.sprintPrompt} expected ${expected}, got ${item.correctAnswer}`);
    }
  }
  const divMatch = item.sprintPrompt.match(/^What is (\d+) ÷ (\d+)\?$/);
  if (divMatch) {
    const a = Number(divMatch[1]);
    const b = Number(divMatch[2]);
    const q = Math.floor(a / b);
    const r = a % b;
    const expected = r === 0 ? String(q) : `${q} R${r}`;
    if (item.correctAnswer !== expected) {
      errors.push(`${item.id}: ${item.sprintPrompt} expected ${expected}, got ${item.correctAnswer}`);
    }
  }
  const fracAddMatch = item.sprintPrompt.match(/^What is (\d+)\/(\d+) \+ (\d+)\/(\d+)\?$/);
  if (fracAddMatch && fracAddMatch[2] === fracAddMatch[4]) {
    const expected = `${Number(fracAddMatch[1]) + Number(fracAddMatch[3])}/${fracAddMatch[2]}`;
    if (item.correctAnswer !== expected) {
      errors.push(`${item.id}: ${item.sprintPrompt} expected ${expected}, got ${item.correctAnswer}`);
    }
  }
  const fracSubMatch = item.sprintPrompt.match(/^What is (\d+)\/(\d+) − (\d+)\/(\d+)\?$/);
  if (fracSubMatch && fracSubMatch[2] === fracSubMatch[4]) {
    const expected = `${Number(fracSubMatch[1]) - Number(fracSubMatch[3])}/${fracSubMatch[2]}`;
    if (item.correctAnswer !== expected) {
      errors.push(`${item.id}: ${item.sprintPrompt} expected ${expected}, got ${item.correctAnswer}`);
    }
  }
  const simplifyMatch = item.sprintPrompt.match(/^Which fraction equals (\d+)\/(\d+) in simplest form\?$/);
  if (simplifyMatch) {
    const n = Number(simplifyMatch[1]);
    const d = Number(simplifyMatch[2]);
    const g = gcd(n, d);
    const expected = `${n / g}/${d / g}`;
    if (item.correctAnswer !== expected) {
      errors.push(`${item.id}: ${item.sprintPrompt} expected ${expected}, got ${item.correctAnswer}`);
    }
  }
  return errors;
}

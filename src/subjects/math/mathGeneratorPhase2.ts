import type { MathSkillItem } from './types';

function randInt(rng: () => number, min: number, max: number): number {
  const r = Math.max(0, Math.min(0.999999, rng()));
  return min + Math.floor(r * (max - min + 1));
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.min(arr.length - 1, Math.floor(Math.max(0, Math.min(0.999999, rng())) * arr.length))];
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
  while (out.length < 3 && attempt < 60) {
    const f = fallback(attempt);
    attempt += 1;
    if (f && !seen.has(f)) {
      seen.add(f);
      out.push(f);
    }
  }
  return [out[0], out[1], out[2]];
}

function fmtInt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

function fmtTenths(tenths: number): string {
  const safe = Math.max(0, Math.round(tenths));
  const whole = Math.floor(safe / 10);
  const rem = safe % 10;
  return `${whole}.${rem}`;
}

function fmtHundredths(hundredths: number): string {
  const safe = Math.max(0, Math.round(hundredths));
  const whole = Math.floor(safe / 100);
  const rem = safe % 100;
  return `${whole}.${String(rem).padStart(2, '0')}`;
}

function fmtMoney(cents: number): string {
  return `$${fmtHundredths(cents)}`;
}

function fmtMixed(totalNum: number, den: number): string {
  const whole = Math.floor(totalNum / den);
  const rem = totalNum % den;
  if (rem === 0) return String(whole);
  if (whole === 0) return `${rem}/${den}`;
  return `${whole} ${rem}/${den}`;
}

function plural(n: number, singular: string, pluralForm: string): string {
  return `${n} ${n === 1 ? singular : pluralForm}`;
}

const KID_NAMES = ['Maya', 'Leo', 'Nora', 'Kai', 'Ava', 'Sam', 'Zoe', 'Eli'] as const;

type SymmetryShapeKind =
  | 'square'
  | 'rectangle'
  | 'equilateral-triangle'
  | 'isosceles-triangle'
  | 'regular-hexagon'
  | 'heart';

const SYMMETRY_CATALOG: {
  shape: SymmetryShapeKind;
  name: string;
  articleName: string;
  lines: number;
  why: string;
}[] = [
  {
    shape: 'square',
    name: 'Square',
    articleName: 'a square',
    lines: 4,
    why: 'A square folds evenly vertically, horizontally, and across both diagonals → 4 lines!',
  },
  {
    shape: 'rectangle',
    name: 'Rectangle',
    articleName: 'this non-square rectangle',
    lines: 2,
    why: 'A non-square rectangle folds evenly vertically and horizontally → 2 lines (diagonals do not match)!',
  },
  {
    shape: 'equilateral-triangle',
    name: 'Equilateral triangle',
    articleName: 'this equilateral triangle',
    lines: 3,
    why: 'An equilateral triangle has 3 equal sides, giving 3 lines of symmetry!',
  },
  {
    shape: 'isosceles-triangle',
    name: 'Isosceles triangle',
    articleName: 'this isosceles triangle',
    lines: 1,
    why: 'This isosceles triangle has only 1 vertical line of symmetry down the center!',
  },
  {
    shape: 'regular-hexagon',
    name: 'Regular hexagon',
    articleName: 'this regular hexagon',
    lines: 6,
    why: 'A regular hexagon has 6 equal sides and 6 lines of symmetry!',
  },
  {
    shape: 'heart',
    name: 'Heart',
    articleName: 'this heart shape',
    lines: 1,
    why: 'A heart only folds evenly along 1 vertical line down the middle!',
  },
];

/**
 * Dynamic question generator for all 32 Phase 2C Grade 4→5 bridge Math skills.
 * Returns null if `base.id` does not belong to Phase 2C.
 */
export function generatePhase2MathItem(
  base: MathSkillItem,
  rng: () => number = Math.random,
): MathSkillItem | null {
  const name = pick(rng, KID_NAMES);
  const name2 = pick(rng, KID_NAMES.filter((n) => n !== name));

  switch (base.id) {
    // ═══════════ TIER 1: NUMBER PATTERNS & RULES ═══════════
    case 'm-t1-pat-add': {
      const start = randInt(rng, 2, 18);
      const step = randInt(rng, 3, 9);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const ans = start + step * 4;

      const wStart = randInt(rng, 3, 12);
      const wStep = randInt(rng, 4, 8);
      const wSeq = [wStart, wStart + wStep, wStart + wStep * 2, wStart + wStep * 3];
      const wAns = wStart + wStep * 4;
      const itemWord = pick(rng, ['stars', 'stickers', 'shells', 'tokens'] as const);

      return {
        ...base,
        sprintPrompt: `Follow the pattern rule: ${seq.join(', ')}, ___`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans - 1), String(ans + 1), String(ans + step), String(seq[3] + step - 2)],
          (k) => String(ans + k * 2),
        ),
        explanation: `The rule is +${step} each time: ${seq[3]} + ${step} = ${ans}!`,
        wordProblemPrompt: `${name} collects ${wStart} ${itemWord} on Day 1 and adds ${wStep} more each day (${wSeq.join(', ')}…). How many ${itemWord} on Day 5?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: `${wAns} ${itemWord}`,
        wordProblemDistractors: uniqueDistractors(
          `${wAns} ${itemWord}`,
          [`${wAns - wStep} ${itemWord}`, `${wAns + wStep} ${itemWord}`, `${wAns - 2} ${itemWord}`],
          (k) => `${wAns + k * 2} ${itemWord}`,
        ),
        wordProblemStepHint: `Add ${wStep} to Day 4: ${wSeq[3]} + ${wStep} = ${wAns} ${itemWord}.`,
      };
    }

    case 'm-t1-pat-sub': {
      const step = randInt(rng, 3, 9);
      const ans = randInt(rng, 6, 28);
      const seq = [ans + step * 4, ans + step * 3, ans + step * 2, ans + step];

      const wStep = randInt(rng, 4, 9);
      const wAns = randInt(rng, 8, 25);
      const wSeq = [wAns + wStep * 4, wAns + wStep * 3, wAns + wStep * 2, wAns + wStep];

      return {
        ...base,
        sprintPrompt: `Follow the pattern rule: ${seq.join(', ')}, ___`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(ans + 1), String(Math.max(1, ans - 1)), String(ans + step), String(Math.max(1, ans - 2))],
          (k) => String(ans + k * 2),
        ),
        explanation: `The rule is −${step} each time: ${seq[3]} − ${step} = ${ans}!`,
        wordProblemPrompt: `A rocket countdown drops by ${wStep} each beep: ${wSeq.join(', ')}, ___. What number comes next?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: String(wAns),
        wordProblemDistractors: uniqueDistractors(
          String(wAns),
          [String(wAns + 2), String(Math.max(1, wAns - 2)), String(wAns + wStep)],
          (k) => String(wAns + k * 3),
        ),
        wordProblemStepHint: `Subtract ${wStep} from ${wSeq[3]}: ${wSeq[3]} − ${wStep} = ${wAns}.`,
      };
    }

    case 'm-t1-pat-mult': {
      const mult = pick(rng, [2, 3] as const);
      const start = mult === 2 ? randInt(rng, 1, 6) : randInt(rng, 1, 3);
      const seq = [start, start * mult, start * mult ** 2, start * mult ** 3];
      const ans = start * mult ** 4;

      const wStart = randInt(rng, 2, 5);
      const wSeq = [wStart, wStart * 2, wStart * 4, wStart * 8];
      const wAns = wStart * 16;

      return {
        ...base,
        sprintPrompt: `Follow the pattern rule: ${seq.join(', ')}, ___`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [
            String(seq[3] + (seq[3] - seq[2])),
            String(seq[3] + mult),
            String(ans * mult),
            String(Math.max(2, ans - seq[2])),
          ],
          (k) => String(ans + k * 4),
        ),
        explanation: `The rule is ×${mult} each step: ${seq[3]} × ${mult} = ${ans}!`,
        wordProblemPrompt: `Every time ${name} folds a craft strip, the sections double: ${wSeq.join(', ')}. How many sections after the 5th fold?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: `${wAns} sections`,
        wordProblemDistractors: uniqueDistractors(
          `${wAns} sections`,
          [`${wSeq[3] + wSeq[2]} sections`, `${wSeq[3] + 2} sections`, `${wAns * 2} sections`],
          (k) => `${wAns + k * 4} sections`,
        ),
        wordProblemStepHint: `Double the 4th term: ${wSeq[3]} × 2 = ${wAns} sections.`,
      };
    }

    case 'm-t1-pat-io': {
      const mult = pick(rng, [2, 3, 4] as const);
      const add = randInt(rng, 1, 5);
      const out = (x: number) => x * mult + add;
      const targetIn = pick(rng, [5, 6, 7, 8] as const);
      const ans = out(targetIn);

      const perShape = pick(rng, [3, 4, 5] as const);
      const baseExtra = pick(rng, [1, 2] as const);
      const tOut = (n: number) => n * perShape + baseExtra;
      const wTarget = pick(rng, [5, 6] as const);
      const wAns = tOut(wTarget);

      return {
        ...base,
        sprintPrompt: `An Input → Output machine gives: 2→${out(2)}, 3→${out(3)}, 4→${out(4)}. When Input = ${targetIn}, what is Output?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: String(ans),
        distractors: uniqueDistractors(
          String(ans),
          [String(targetIn * mult), String(ans - mult), String(ans + mult), String(ans + 1)],
          (k) => String(ans + k * 2),
        ),
        explanation: `Rule is (Input × ${mult}) + ${add}. So (${targetIn} × ${mult}) + ${add} = ${ans}!`,
        wordProblemPrompt: `A tile pattern uses 1 shape = ${tOut(1)} tiles, 2 shapes = ${tOut(2)} tiles, 3 shapes = ${tOut(3)} tiles. How many tiles for ${wTarget} shapes?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: `${wAns} tiles`,
        wordProblemDistractors: uniqueDistractors(
          `${wAns} tiles`,
          [`${wTarget * perShape} tiles`, `${wAns - perShape} tiles`, `${wAns + perShape} tiles`],
          (k) => `${wAns + k * 2} tiles`,
        ),
        wordProblemStepHint: `Rule is (${perShape} × shapes) + ${baseExtra}: (${perShape} × ${wTarget}) + ${baseExtra} = ${wAns} tiles.`,
      };
    }

    // ═══════════ TIER 1: SYMMETRY & POLYGONS ═══════════
    case 'm-t1-sym-count': {
      const entry = pick(rng, SYMMETRY_CATALOG);
      const ans = plural(entry.lines, 'line', 'lines');
      const wEntry = pick(
        rng,
        SYMMETRY_CATALOG.filter((s) => s.shape !== entry.shape),
      );
      const wAns = plural(wEntry.lines, 'way', 'ways');

      return {
        ...base,
        sprintPrompt: `How many lines of symmetry does ${entry.articleName} have?`,
        sprintVisual: {
          kind: 'symmetry-shape',
          shape: entry.shape,
          showLines: false,
          label: entry.name,
        },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          ['1 line', '2 lines', '3 lines', '4 lines', '6 lines', '0 lines'],
          (k) => `${k + 4} lines`,
        ),
        explanation: entry.why,
        wordProblemPrompt: `${name} cuts out a paper ${wEntry.name.toLowerCase()}. How many different ways can ${name} fold it in half so both halves match exactly?`,
        wordProblemVisual: {
          kind: 'symmetry-shape',
          shape: wEntry.shape,
          showLines: false,
        },
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          ['1 way', '2 ways', '3 ways', '4 ways', '6 ways'],
          (k) => `${k + 5} ways`,
        ),
        wordProblemStepHint: wEntry.why,
      };
    }

    case 'm-t1-sym-identify': {
      const target = pick(rng, [
        { shape: 'square' as const, name: 'Square', lines: 4, others: ['Rectangle', 'Isosceles triangle', 'Equilateral triangle'] },
        { shape: 'rectangle' as const, name: 'Rectangle', lines: 2, others: ['Square', 'Regular hexagon', 'Heart'] },
        { shape: 'equilateral-triangle' as const, name: 'Equilateral triangle', lines: 3, others: ['Square', 'Rectangle', 'Heart'] },
        { shape: 'isosceles-triangle' as const, name: 'Isosceles triangle', lines: 1, others: ['Square', 'Regular hexagon', 'Equilateral triangle'] },
        { shape: 'regular-hexagon' as const, name: 'Regular hexagon', lines: 6, others: ['Square', 'Rectangle', 'Equilateral triangle'] },
      ]);

      const comparePairs = [
        {
          high: 'Regular hexagon (6 lines)',
          low: 'Square (4 lines)',
          q: 'Which shape has MORE lines of symmetry: a regular hexagon or a square?',
          shape: 'regular-hexagon' as const,
          hint: 'A regular hexagon has 6 lines of symmetry, while a square has 4.',
        },
        {
          high: 'Square (4 lines)',
          low: 'Non-square rectangle (2 lines)',
          q: 'Which shape has MORE lines of symmetry: a square or a non-square rectangle?',
          shape: 'square' as const,
          hint: 'A square has 4 lines (including diagonals), while a non-square rectangle has only 2.',
        },
        {
          high: 'Equilateral triangle (3 lines)',
          low: 'Isosceles triangle (1 line)',
          q: 'Which triangle has MORE lines of symmetry: an equilateral triangle or a non-equilateral isosceles triangle?',
          shape: 'equilateral-triangle' as const,
          hint: 'An equilateral triangle has 3 equal sides (3 lines); an isosceles triangle has only 1 line.',
        },
      ];
      const cmp = pick(rng, comparePairs);

      return {
        ...base,
        sprintPrompt: `Which shape shown below has EXACTLY ${plural(target.lines, 'line', 'lines')} of symmetry?`,
        sprintVisual: {
          kind: 'symmetry-shape',
          shape: target.shape,
          showLines: false,
          label: 'Count carefully!',
        },
        revealVisualOnFeedback: false,
        correctAnswer: target.name,
        distractors: uniqueDistractors(
          target.name,
          target.others,
          (k) => `Shape ${k}`,
        ),
        explanation: `${target.name} has exactly ${plural(target.lines, 'line', 'lines')} of symmetry!`,
        wordProblemPrompt: cmp.q,
        wordProblemVisual: undefined,
        wordProblemAnswer: cmp.high,
        wordProblemDistractors: [cmp.low, 'They have the same', 'Neither is symmetric'],
        wordProblemStepHint: cmp.hint,
      };
    }

    case 'm-t1-poly-sides': {
      const polygons: {
        name: string;
        sides: number;
        visualShape?: SymmetryShapeKind;
        story: string;
        sideLen: number;
      }[] = [
        { name: 'Triangle', sides: 3, visualShape: 'equilateral-triangle', story: 'triangular traffic yield sign', sideLen: randInt(rng, 4, 9) },
        { name: 'Quadrilateral', sides: 4, visualShape: 'square', story: 'square patio tile', sideLen: randInt(rng, 4, 9) },
        { name: 'Pentagon', sides: 5, story: 'regular pentagon clubhouse plaque', sideLen: randInt(rng, 3, 8) },
        { name: 'Hexagon', sides: 6, visualShape: 'regular-hexagon', story: 'regular hexagon beehive cell', sideLen: randInt(rng, 3, 8) },
        { name: 'Octagon', sides: 8, story: 'regular octagon stop sign', sideLen: randInt(rng, 3, 7) },
      ];
      const poly = pick(rng, polygons);
      const wPoly = pick(
        rng,
        polygons.filter((p) => p.sides >= 5),
      );
      const wPerim = wPoly.sides * wPoly.sideLen;

      return {
        ...base,
        sprintPrompt: `How many straight sides does a ${poly.name.toUpperCase()} have?`,
        sprintVisual: poly.visualShape
          ? { kind: 'symmetry-shape', shape: poly.visualShape, showLines: false }
          : undefined,
        revealVisualOnFeedback: false,
        correctAnswer: `${poly.sides} sides`,
        distractors: uniqueDistractors(
          `${poly.sides} sides`,
          ['3 sides', '4 sides', '5 sides', '6 sides', '8 sides'],
          (k) => `${poly.sides + k + 2} sides`,
        ),
        explanation: `A ${poly.name.toLowerCase()} always has ${poly.sides} straight sides!`,
        wordProblemPrompt: `A ${wPoly.story} has ${wPoly.sides} equal sides, each ${wPoly.sideLen} cm long. What is its perimeter?`,
        wordProblemVisual: wPoly.visualShape
          ? { kind: 'symmetry-shape', shape: wPoly.visualShape, showLines: false }
          : undefined,
        wordProblemAnswer: `${wPerim} cm`,
        wordProblemDistractors: uniqueDistractors(
          `${wPerim} cm`,
          [`${(wPoly.sides - 1) * wPoly.sideLen} cm`, `${(wPoly.sides + 1) * wPoly.sideLen} cm`, `${wPoly.sides + wPoly.sideLen} cm`],
          (k) => `${wPerim + k * 2} cm`,
        ),
        wordProblemStepHint: `${wPoly.sides} equal sides × ${wPoly.sideLen} cm = ${wPerim} cm.`,
      };
    }

    case 'm-t1-poly-classify': {
      const modes = [
        {
          prompt: 'A triangle has 3 EQUAL sides. How many lines of symmetry does it have?',
          shape: 'equilateral-triangle' as const,
          ans: '3 lines',
          d: ['1 line', '2 lines', '6 lines'],
          exp: 'An equilateral triangle has 3 equal sides and 3 lines of symmetry!',
        },
        {
          prompt: 'This triangle has exactly 2 EQUAL sides and 1 shorter base. How many lines of symmetry does it have?',
          shape: 'isosceles-triangle' as const,
          ans: '1 line',
          d: ['3 lines', '2 lines', '0 lines'],
          exp: 'A non-equilateral isosceles triangle has exactly 1 line of symmetry!',
        },
        {
          prompt: 'This shape has 4 equal sides and 4 right angles. How many lines of symmetry does it have?',
          shape: 'square' as const,
          ans: '4 lines',
          d: ['2 lines', '1 line', '8 lines'],
          exp: 'A square has 4 equal sides and 4 lines of symmetry!',
        },
        {
          prompt: 'This rectangle is wider than it is tall. How many lines of symmetry does it have?',
          shape: 'rectangle' as const,
          ans: '2 lines',
          d: ['4 lines', '1 line', '3 lines'],
          exp: 'A non-square rectangle has only 2 lines of symmetry (horizontal and vertical)!',
        },
      ];
      const chosen = pick(rng, modes);

      const isEqui = rng() < 0.5;
      const sideA = randInt(rng, 5, 9);
      const sideB = isEqui ? sideA : sideA - randInt(rng, 2, 3);
      const wAns = isEqui ? 'Equilateral triangle' : 'Isosceles triangle';

      return {
        ...base,
        sprintPrompt: chosen.prompt,
        sprintVisual: {
          kind: 'symmetry-shape',
          shape: chosen.shape,
          showLines: false,
        },
        revealVisualOnFeedback: false,
        correctAnswer: chosen.ans,
        distractors: chosen.d as [string, string, string],
        explanation: chosen.exp,
        wordProblemPrompt: `A pennant flag has sides measuring ${sideA} in, ${sideA} in, and ${sideB} in. What type of triangle is it?`,
        wordProblemVisual: {
          kind: 'symmetry-shape',
          shape: isEqui ? 'equilateral-triangle' : 'isosceles-triangle',
          showLines: false,
        },
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          ['Equilateral triangle', 'Isosceles triangle', 'Rectangle', 'Hexagon'],
          (k) => `Polygon ${k}`,
        ),
        wordProblemStepHint: isEqui
          ? `All 3 sides equal (${sideA}, ${sideA}, ${sideA}) → Equilateral triangle!`
          : `Exactly 2 sides equal (${sideA} and ${sideA}) → Isosceles triangle!`,
      };
    }

    // ═══════════ TIER 2: DIVISION & REMAINDERS ═══════════
    case 'm-t2-rem-basic': {
      const divisor = pick(rng, [3, 4, 5, 6, 7, 8, 9] as const);
      const quot = randInt(rng, 4, 9);
      const rem = randInt(rng, 1, divisor - 1);
      const dividend = divisor * quot + rem;
      const ans = `${quot} R${rem}`;

      const wDiv = pick(rng, [4, 5, 6, 7, 8] as const);
      const wQ = randInt(rng, 4, 8);
      const wR = randInt(rng, 1, wDiv - 1);
      const wTotal = wDiv * wQ + wR;
      const wAns = `${wQ} R${wR}`;

      return {
        ...base,
        sprintPrompt: `What is ${dividend} ÷ ${divisor}?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
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
        explanation: `${divisor} × ${quot} = ${divisor * quot}, and ${dividend} − ${divisor * quot} = ${rem} left over → ${ans}!`,
        wordProblemPrompt: `${name} shares ${wTotal} stickers equally among ${wDiv} friends. Write the quotient and remainder (each friend gets ___ with ___ left):`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${wQ} R${(wR % (wDiv - 1)) + 1}`,
            `${wQ + 1} R${wR}`,
            `${Math.max(1, wQ - 1)} R${wR + 1}`,
          ],
          (k) => `${wQ + k} R1`,
        ),
        wordProblemStepHint: `${wDiv} × ${wQ} = ${wDiv * wQ}, leaving ${wTotal} − ${wDiv * wQ} = ${wR} → ${wAns}.`,
      };
    }

    case 'm-t2-rem-find': {
      const divisor = pick(rng, [4, 5, 6, 7, 8, 9] as const);
      const quot = randInt(rng, 4, 9);
      const rem = randInt(rng, 1, divisor - 1);
      const dividend = divisor * quot + rem;

      const wDiv = pick(rng, [5, 6, 7, 8] as const);
      const wQ = randInt(rng, 4, 8);
      const wR = randInt(rng, 1, wDiv - 1);
      const wTotal = wDiv * wQ + wR;
      const fmtCookie = (n: number) => plural(n, 'cookie', 'cookies');

      return {
        ...base,
        sprintPrompt: `When ${dividend} is divided by ${divisor}, what is the REMAINDER?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: String(rem),
        distractors: uniqueDistractors(
          String(rem),
          [String(quot), String(rem + 1), String(Math.max(0, rem - 1)), String(divisor)],
          (k) => String(rem + k + 1),
        ),
        explanation: `${divisor} × ${quot} = ${divisor * quot}, so ${dividend} − ${divisor * quot} = ${rem} left over!`,
        wordProblemPrompt: `A baker packs ${wTotal} cookies into boxes of ${wDiv}. How many cookies are LEFT OVER outside the full boxes?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: fmtCookie(wR),
        wordProblemDistractors: uniqueDistractors(
          fmtCookie(wR),
          [fmtCookie(wQ), fmtCookie(wR + 1), fmtCookie(Math.max(0, wR - 1)), fmtCookie(wDiv)],
          (k) => fmtCookie(wR + k + 1),
        ),
        wordProblemStepHint: `${wDiv} × ${wQ} = ${wDiv * wQ} packed; ${wTotal} − ${wDiv * wQ} = ${fmtCookie(wR)} left over.`,
      };
    }

    case 'm-t2-rem-roundup': {
      const cap = pick(rng, [4, 5, 6, 7, 8] as const);
      const q = randInt(rng, 3, 8);
      const rem = randInt(rng, 1, cap - 1);
      const total = cap * q + rem;
      const ans = `${q + 1} vans`;

      const wCap = pick(rng, [5, 6, 7, 8] as const);
      const wQ = randInt(rng, 4, 8);
      const wRem = randInt(rng, 1, wCap - 1);
      const wTotal = wCap * wQ + wRem;
      const wAns = `${wQ + 1} crates`;

      return {
        ...base,
        sprintPrompt: `${total} students ride in vans holding ${cap} students each. How many vans are needed so EVERYONE rides?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`${q} vans`, `${q + 2} vans`, plural(rem, 'van', 'vans')],
          (k) => `${q + k + 2} vans`,
        ),
        explanation: `${total} ÷ ${cap} = ${q} R${rem}. Those ${rem} extra ${rem === 1 ? 'student needs' : 'students need'} 1 more van → ${ans}!`,
        wordProblemPrompt: `A librarian packs ${wTotal} books into crates holding ${wCap} books each. How many crates are needed to pack ALL ${wTotal} books?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [`${wQ} crates`, `${wQ + 2} crates`, plural(wRem, 'crate', 'crates')],
          (k) => `${wQ + k + 2} crates`,
        ),
        wordProblemStepHint: `${wTotal} ÷ ${wCap} = ${wQ} R${wRem}. Round up to pack the leftover ${wRem} → ${wAns}!`,
      };
    }

    case 'm-t2-rem-drop': {
      const cap = pick(rng, [4, 5, 6, 7, 8] as const);
      const q = randInt(rng, 3, 8);
      const rem = randInt(rng, 1, cap - 1);
      const total = cap * q + rem;
      const ans = `${q} pouches`;

      const price = pick(rng, [4, 5, 6, 7, 8] as const);
      const wQ = randInt(rng, 3, 8);
      const wRem = randInt(rng, 1, price - 1);
      const budget = price * wQ + wRem;
      const wAns = `${wQ} notebooks`;

      return {
        ...base,
        sprintPrompt: `${total} charms are packed ${cap} to a pouch. What is the GREATEST number of FULL pouches you can make?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`${q + 1} pouches`, `${Math.max(1, q - 1)} pouches`, plural(rem, 'pouch', 'pouches')],
          (k) => `${q + k + 1} pouches`,
        ),
        explanation: `${total} ÷ ${cap} = ${q} R${rem}. The ${rem} leftover cannot fill another pouch → ${ans}!`,
        wordProblemPrompt: `Notebooks cost $${price} each. ${name} has $${budget}. What is the MOST notebooks ${name} can buy?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [`${wQ + 1} notebooks`, `${Math.max(1, wQ - 1)} notebooks`, plural(wRem, 'notebook', 'notebooks')],
          (k) => `${wQ + k + 1} notebooks`,
        ),
        wordProblemStepHint: `${budget} ÷ ${price} = ${wQ} R${wRem}. $${wRem} left is not enough for another notebook → ${wAns}.`,
      };
    }

    // ═══════════ TIER 2: MIXED NUMBERS ═══════════
    case 'm-t2-mix-to-mixed': {
      const den = pick(rng, [3, 4, 5, 6, 8] as const);
      const whole = randInt(rng, 1, 4);
      const rem = randInt(rng, 1, den - 1);
      const num = whole * den + rem;
      const ans = `${whole} ${rem}/${den}`;

      const wDen = pick(rng, [3, 4, 5, 6] as const);
      const wWhole = randInt(rng, 1, 4);
      const wRem = randInt(rng, 1, wDen - 1);
      const wNum = wWhole * wDen + wRem;
      const wAns = `${wWhole} ${wRem}/${wDen} pizzas`;

      return {
        ...base,
        sprintPrompt: `Write ${num}/${den} as a mixed number.`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `${whole + 1} ${rem}/${den}`,
            `${whole} ${(rem % (den - 1)) + 1}/${den}`,
            `${Math.max(1, whole - 1)} ${rem}/${den}`,
            ...(whole < den ? [`${rem} ${whole}/${den}`] : []),
            `${whole + 2} ${rem}/${den}`,
          ],
          (k) => `${whole + k} 1/${den}`,
        ),
        explanation: `${num} ÷ ${den} = ${whole} R${rem}, so ${num}/${den} = ${ans}!`,
        wordProblemPrompt: `A party ate ${wNum}/${wDen} pizzas in total. Write that amount as a mixed number.`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${wWhole + 1} ${wRem}/${wDen} pizzas`,
            `${wWhole} ${(wRem % (wDen - 1)) + 1}/${wDen} pizzas`,
            ...(wWhole < wDen ? [`${wRem} ${wWhole}/${wDen} pizzas`] : []),
            `${Math.max(1, wWhole - 1)} ${wRem}/${wDen} pizzas`,
            `${wWhole + 2} ${wRem}/${wDen} pizzas`,
          ],
          (k) => `${wWhole + k} 1/${wDen} pizzas`,
        ),
        wordProblemStepHint: `${wNum} ÷ ${wDen} = ${wWhole} R${wRem} → ${wAns}.`,
      };
    }

    case 'm-t2-mix-to-imp': {
      const den = pick(rng, [3, 4, 5, 6, 8] as const);
      const whole = randInt(rng, 1, 4);
      const rem = randInt(rng, 1, den - 1);
      const num = whole * den + rem;
      const ans = `${num}/${den}`;

      const wDen = pick(rng, [3, 4, 5, 6] as const);
      const wWhole = randInt(rng, 1, 3);
      const wRem = randInt(rng, 1, wDen - 1);
      const wNum = wWhole * wDen + wRem;
      const wAns = `${wNum} scoops (${wNum}/${wDen})`;

      return {
        ...base,
        sprintPrompt: `Write ${whole} ${rem}/${den} as an improper fraction.`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `${whole * den}/${den}`,
            `${whole + den + rem}/${den}`,
            `${num + 1}/${den}`,
            `${num}/${den * whole}`,
          ],
          (k) => `${num + k + 1}/${den}`,
        ),
        explanation: `(${whole} × ${den}) + ${rem} = ${num}, keep the denominator ${den} → ${ans}!`,
        wordProblemPrompt: `A pancake recipe needs ${wWhole} ${wRem}/${wDen} cups of milk. Using only a 1/${wDen}-cup scoop, how many scoops is that?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${wWhole * wDen} scoops (${wWhole * wDen}/${wDen})`,
            `${wNum - 1} scoops (${wNum - 1}/${wDen})`,
            `${wNum + 1} scoops (${wNum + 1}/${wDen})`,
          ],
          (k) => `${wNum + k + 1} scoops (${wNum + k + 1}/${wDen})`,
        ),
        wordProblemStepHint: `${wWhole} ${wRem}/${wDen} = (${wWhole}×${wDen} + ${wRem})/${wDen} = ${wNum}/${wDen} → ${wNum} scoops!`,
      };
    }

    case 'm-t2-mix-add': {
      const den = pick(rng, [3, 4, 5, 6, 8] as const);
      const w1 = randInt(rng, 1, 3);
      const w2 = randInt(rng, 1, 3);
      const n1 = randInt(rng, 1, den - 1);
      const n2 = randInt(rng, 1, den - 1);
      const totalNum = (w1 + w2) * den + n1 + n2;
      const ans = fmtMixed(totalNum, den);

      const wDen = pick(rng, [4, 5, 6, 8] as const);
      const ww1 = randInt(rng, 1, 3);
      const ww2 = randInt(rng, 1, 3);
      const wn1 = randInt(rng, Math.ceil(wDen / 2), wDen - 1);
      const wn2 = randInt(rng, Math.ceil(wDen / 2), wDen - 1);
      const wTotal = (ww1 + ww2) * wDen + wn1 + wn2;
      const wAns = `${fmtMixed(wTotal, wDen)} miles`;

      return {
        ...base,
        sprintPrompt: `What is ${w1} ${n1}/${den} + ${w2} ${n2}/${den}?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `${w1 + w2} ${n1 + n2}/${den * 2}`,
            fmtMixed(totalNum - den, den),
            fmtMixed(totalNum + 1, den),
            fmtMixed(Math.max(1, totalNum - 1), den),
          ],
          (k) => fmtMixed(totalNum + k + 1, den),
        ),
        explanation: `Add wholes (${w1}+${w2}=${w1 + w2}) and fractions (${n1}/${den}+${n2}/${den}=${n1 + n2}/${den}) → ${ans}!`,
        wordProblemPrompt: `${name} hiked ${ww1} ${wn1}/${wDen} miles before lunch and ${ww2} ${wn2}/${wDen} miles after lunch. How far did ${name} hike in all?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${ww1 + ww2} ${wn1 + wn2}/${wDen * 2} miles`,
            `${fmtMixed(wTotal - wDen, wDen)} miles`,
            `${fmtMixed(wTotal + 1, wDen)} miles`,
          ],
          (k) => `${fmtMixed(wTotal + k + 1, wDen)} miles`,
        ),
        wordProblemStepHint: `${ww1}+${ww2}=${ww1 + ww2}, and ${wn1}/${wDen}+${wn2}/${wDen}=${wn1 + wn2}/${wDen} → ${wAns}.`,
      };
    }

    case 'm-t2-mix-sub': {
      const den = pick(rng, [3, 4, 5, 6, 8] as const);
      const w1 = randInt(rng, 3, 6);
      const w2 = randInt(rng, 1, w1 - 2);
      const borrow = rng() < 0.65;
      const n1 = borrow ? randInt(rng, 1, den - 2) : randInt(rng, 2, den - 1);
      const n2 = borrow ? randInt(rng, n1 + 1, den - 1) : randInt(rng, 1, n1 - 1);
      const diffNum = w1 * den + n1 - (w2 * den + n2);
      const ans = fmtMixed(diffNum, den);

      const wDen = pick(rng, [4, 5, 6, 8] as const);
      const ww1 = randInt(rng, 4, 6);
      const ww2 = randInt(rng, 1, ww1 - 2);
      const wn1 = randInt(rng, 1, wDen - 2);
      const wn2 = randInt(rng, wn1 + 1, wDen - 1);
      const wDiff = ww1 * wDen + wn1 - (ww2 * wDen + wn2);
      const wAns = `${fmtMixed(wDiff, wDen)} ft`;

      return {
        ...base,
        sprintPrompt: `What is ${w1} ${n1}/${den} − ${w2} ${n2}/${den}?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `${w1 - w2} ${Math.abs(n1 - n2)}/${den}`,
            fmtMixed(diffNum + den, den),
            fmtMixed(diffNum + 1, den),
            fmtMixed(Math.max(1, diffNum - 1), den),
          ],
          (k) => fmtMixed(diffNum + k + 1, den),
        ),
        explanation: borrow
          ? `Trade 1 whole: ${w1} ${n1}/${den} = ${w1 - 1} ${n1 + den}/${den}. Subtract ${w2} ${n2}/${den} → ${ans}!`
          : `Subtract wholes (${w1}−${w2}=${w1 - w2}) and fractions (${n1}/${den}−${n2}/${den}=${n1 - n2}/${den}) → ${ans}!`,
        wordProblemPrompt: `A ribbon is ${ww1} ${wn1}/${wDen} feet long. ${name} cuts off ${ww2} ${wn2}/${wDen} feet. How much ribbon is left?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${ww1 - ww2} ${wn2 - wn1}/${wDen} ft`,
            `${fmtMixed(wDiff + wDen, wDen)} ft`,
            `${fmtMixed(wDiff + 1, wDen)} ft`,
          ],
          (k) => `${fmtMixed(wDiff + k + 1, wDen)} ft`,
        ),
        wordProblemStepHint: `Rewrite ${ww1} ${wn1}/${wDen} as ${ww1 - 1} ${wn1 + wDen}/${wDen}, then subtract ${ww2} ${wn2}/${wDen} → ${wAns}.`,
      };
    }

    // ═══════════ TIER 3: 2-DIGIT × 2-DIGIT ═══════════
    case 'm-t3-2x2-area': {
      const aTens = pick(rng, [20, 30, 40, 50] as const);
      const aOnes = randInt(rng, 2, 9);
      const bTens = pick(rng, [20, 30, 40, 50] as const);
      const bOnes = randInt(rng, 2, 9);
      const a = aTens + aOnes;
      const b = bTens + bOnes;
      const prod = a * b;
      const p11 = aTens * bTens;
      const p12 = aOnes * bTens;
      const p21 = aTens * bOnes;
      const p22 = aOnes * bOnes;

      const waTens = pick(rng, [20, 30, 40] as const);
      const waOnes = randInt(rng, 2, 8);
      const wbTens = pick(rng, [20, 30, 40] as const);
      const wbOnes = randInt(rng, 2, 8);
      const wa = waTens + waOnes;
      const wb = wbTens + wbOnes;
      const wProd = wa * wb;

      return {
        ...base,
        sprintPrompt: `Use the 2×2 area model: what is ${a} × ${b}?`,
        sprintVisual: {
          kind: 'area-model-2x2',
          aTens,
          aOnes,
          bTens,
          bOnes,
          hideProducts: true,
        },
        revealVisualOnFeedback: false,
        correctAnswer: fmtInt(prod),
        distractors: uniqueDistractors(
          fmtInt(prod),
          [fmtInt(p11 + p22), fmtInt(prod - 100), fmtInt(prod + 100), fmtInt(prod - 10)],
          (k) => fmtInt(prod + k * 20),
        ),
        explanation: `${fmtInt(p11)} + ${fmtInt(p12)} + ${fmtInt(p21)} + ${fmtInt(p22)} = ${fmtInt(prod)}!`,
        wordProblemPrompt: `An orchard has ${wa} rows with ${wb} apple trees in each row. How many apple trees in all?`,
        wordProblemVisual: {
          kind: 'area-model-2x2',
          aTens: waTens,
          aOnes: waOnes,
          bTens: wbTens,
          bOnes: wbOnes,
          hideProducts: true,
        },
        wordProblemAnswer: `${fmtInt(wProd)} trees`,
        wordProblemDistractors: uniqueDistractors(
          `${fmtInt(wProd)} trees`,
          [
            `${fmtInt(waTens * wbTens + waOnes * wbOnes)} trees`,
            `${fmtInt(wProd - 100)} trees`,
            `${fmtInt(wProd + 100)} trees`,
          ],
          (k) => `${fmtInt(wProd + k * 20)} trees`,
        ),
        wordProblemStepHint: `${fmtInt(waTens * wbTens)} + ${fmtInt(waOnes * wbTens)} + ${fmtInt(waTens * wbOnes)} + ${fmtInt(waOnes * wbOnes)} = ${fmtInt(wProd)} trees.`,
      };
    }

    case 'm-t3-2x2-partial': {
      const aTens = pick(rng, [30, 40, 50, 60] as const);
      const aOnes = randInt(rng, 2, 9);
      const bTens = pick(rng, [20, 30, 40] as const);
      const bOnes = randInt(rng, 2, 9);
      const a = aTens + aOnes;
      const b = bTens + bOnes;
      const prod = a * b;
      const p11 = aTens * bTens;
      const p12 = aOnes * bTens;
      const p21 = aTens * bOnes;
      const p22 = aOnes * bOnes;

      const waTens = pick(rng, [30, 40, 50] as const);
      const waOnes = randInt(rng, 2, 8);
      const wbTens = pick(rng, [20, 30, 40] as const);
      const wbOnes = randInt(rng, 2, 8);
      const wa = waTens + waOnes;
      const wb = wbTens + wbOnes;
      const wProd = wa * wb;

      return {
        ...base,
        sprintPrompt: `Find the total of all 4 boxes in the area model for ${a} × ${b}:`,
        sprintVisual: {
          kind: 'area-model-2x2',
          aTens,
          aOnes,
          bTens,
          bOnes,
          hideProducts: true,
        },
        revealVisualOnFeedback: false,
        correctAnswer: fmtInt(prod),
        distractors: uniqueDistractors(
          fmtInt(prod),
          [fmtInt(prod - p21), fmtInt(prod - 100), fmtInt(prod + 100), fmtInt(prod + 20)],
          (k) => fmtInt(prod + k * 30),
        ),
        explanation: `Add all 4 partial products: ${fmtInt(p11)} + ${fmtInt(p12)} + ${fmtInt(p21)} + ${fmtInt(p22)} = ${fmtInt(prod)}!`,
        wordProblemPrompt: `A school orders ${wa} boxes with ${wb} pencils in each box. How many pencils arrive in total?`,
        wordProblemVisual: {
          kind: 'area-model-2x2',
          aTens: waTens,
          aOnes: waOnes,
          bTens: wbTens,
          bOnes: wbOnes,
          hideProducts: true,
        },
        wordProblemAnswer: `${fmtInt(wProd)} pencils`,
        wordProblemDistractors: uniqueDistractors(
          `${fmtInt(wProd)} pencils`,
          [
            `${fmtInt(waTens * wbTens + waOnes * wbOnes)} pencils`,
            `${fmtInt(wProd - 100)} pencils`,
            `${fmtInt(wProd + 100)} pencils`,
          ],
          (k) => `${fmtInt(wProd + k * 25)} pencils`,
        ),
        wordProblemStepHint: `${fmtInt(waTens * wbTens)} + ${fmtInt(waOnes * wbTens)} + ${fmtInt(waTens * wbOnes)} + ${fmtInt(waOnes * wbOnes)} = ${fmtInt(wProd)} pencils.`,
      };
    }

    case 'm-t3-2x2-tens': {
      const a = pick(rng, [30, 40, 50, 60, 70, 80, 90] as const);
      const b = pick(rng, [20, 30, 40, 50, 60, 70] as const);
      const prod = a * b;

      const wa = pick(rng, [30, 40, 50, 60] as const);
      const wb = pick(rng, [40, 50, 60, 70, 80] as const);
      const wProd = wa * wb;

      return {
        ...base,
        sprintPrompt: `What is ${a} × ${b}?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: fmtInt(prod),
        distractors: uniqueDistractors(
          fmtInt(prod),
          [fmtInt(prod / 10), fmtInt(prod * 10), fmtInt(prod + 100), fmtInt(prod - 100)],
          (k) => fmtInt(prod + k * 200),
        ),
        explanation: `${a / 10} × ${b / 10} = ${(a / 10) * (b / 10)}, plus TWO zeros → ${fmtInt(prod)}!`,
        wordProblemPrompt: `A concert hall has ${wa} rows with ${wb} seats in each row. How many seats are in the hall?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: `${fmtInt(wProd)} seats`,
        wordProblemDistractors: uniqueDistractors(
          `${fmtInt(wProd)} seats`,
          [`${fmtInt(wProd / 10)} seats`, `${fmtInt(wProd * 10)} seats`, `${fmtInt(wProd + 100)} seats`],
          (k) => `${fmtInt(wProd + k * 200)} seats`,
        ),
        wordProblemStepHint: `${wa / 10} × ${wb / 10} = ${(wa / 10) * (wb / 10)}, then attach two zeros → ${fmtInt(wProd)} seats.`,
      };
    }

    case 'm-t3-2x2-word': {
      const aTens = pick(rng, [30, 40, 50] as const);
      const aOnes = randInt(rng, 2, 9);
      const bTens = pick(rng, [30, 40, 50] as const);
      const bOnes = randInt(rng, 2, 8);
      const a = aTens + aOnes;
      const b = bTens + bOnes;
      const prod = a * b;

      const waTens = pick(rng, [20, 30, 40] as const);
      const waOnes = randInt(rng, 2, 9);
      const wbTens = pick(rng, [30, 40, 50] as const);
      const wbOnes = randInt(rng, 2, 8);
      const wa = waTens + waOnes;
      const wb = wbTens + wbOnes;
      const wProd = wa * wb;

      return {
        ...base,
        sprintPrompt: `Each book crate holds ${a} books. How many books are in ${b} crates?`,
        sprintVisual: {
          kind: 'area-model-2x2',
          aTens,
          aOnes,
          bTens,
          bOnes,
          hideProducts: true,
        },
        revealVisualOnFeedback: false,
        correctAnswer: `${fmtInt(prod)} books`,
        distractors: uniqueDistractors(
          `${fmtInt(prod)} books`,
          [
            `${fmtInt(aTens * bTens + aOnes * bOnes)} books`,
            `${fmtInt(prod - 100)} books`,
            `${fmtInt(prod + 100)} books`,
          ],
          (k) => `${fmtInt(prod + k * 20)} books`,
        ),
        explanation: `${fmtInt(aTens * bTens)} + ${fmtInt(aOnes * bTens)} + ${fmtInt(aTens * bOnes)} + ${fmtInt(aOnes * bOnes)} = ${fmtInt(prod)} books!`,
        wordProblemPrompt: `Tickets for a museum trip cost $${wa} each. If ${wb} students go, what is the total cost?`,
        wordProblemVisual: {
          kind: 'area-model-2x2',
          aTens: waTens,
          aOnes: waOnes,
          bTens: wbTens,
          bOnes: wbOnes,
          hideProducts: true,
        },
        wordProblemAnswer: `$${fmtInt(wProd)}`,
        wordProblemDistractors: uniqueDistractors(
          `$${fmtInt(wProd)}`,
          [
            `$${fmtInt(waTens * wbTens + waOnes * wbOnes)}`,
            `$${fmtInt(wProd - 100)}`,
            `$${fmtInt(wProd + 100)}`,
          ],
          (k) => `$${fmtInt(wProd + k * 20)}`,
        ),
        wordProblemStepHint: `${fmtInt(waTens * wbTens)} + ${fmtInt(waOnes * wbTens)} + ${fmtInt(waTens * wbOnes)} + ${fmtInt(waOnes * wbOnes)} = $${fmtInt(wProd)}.`,
      };
    }

    // ═══════════ TIER 3: FRACTION × WHOLE ═══════════
    case 'm-t3-fw-unit': {
      const den = pick(rng, [4, 5, 6, 8, 10, 12] as const);
      const w = randInt(rng, 2, den - 1);
      const ans = `${w}/${den}`;

      const wDen = pick(rng, [5, 6, 8, 10] as const);
      const ww = randInt(rng, 2, wDen - 1);
      const wAns = `${ww}/${wDen} cup`;

      return {
        ...base,
        sprintPrompt: `What is ${w} × 1/${den}?`,
        sprintVisual: {
          kind: 'fraction-bar',
          numerator: w,
          denominator: den,
          color: '#7C3AED',
        },
        revealVisualOnFeedback: true,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`${w}/${w * den}`, `1/${w * den}`, `${Math.min(den, w + 1)}/${den}`, `${w - 1}/${den}`],
          (k) => `${w}/${den + k}`,
        ),
        explanation: `${w} copies of 1/${den} equals ${w}/${den} (keep the denominator ${den})!`,
        wordProblemPrompt: `Each puppy eats 1/${wDen} cup of treats. How much do ${ww} puppies eat altogether?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [`${ww}/${ww * wDen} cup`, `1/${ww * wDen} cup`, `${ww + 1}/${wDen} cup`],
          (k) => `${ww}/${wDen + k} cup`,
        ),
        wordProblemStepHint: `Multiply whole × numerator: ${ww} × 1/${wDen} = ${ww}/${wDen} cup.`,
      };
    }

    case 'm-t3-fw-nonunit': {
      const den = pick(rng, [3, 4, 5, 6, 8, 10] as const);
      const num = randInt(rng, 2, den - 1);
      const w = randInt(rng, 2, 5);
      const prodNum = w * num;
      const ans = `${prodNum}/${den}`;

      const wDen = pick(rng, [4, 5, 6, 8] as const);
      const wNum = randInt(rng, 2, wDen - 1);
      const ww = randInt(rng, 3, 5);
      const wProdNum = ww * wNum;
      const wAns = `${wProdNum}/${wDen} meters`;

      return {
        ...base,
        sprintPrompt: `What is ${w} × ${num}/${den}?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `${prodNum}/${w * den}`,
            `${w + num}/${den}`,
            ...(w > 2 ? [`${prodNum - num}/${den}`] : [`${prodNum + num}/${den}`]),
            `${prodNum + 1}/${den}`,
          ],
          (k) => `${prodNum + k}/${den}`,
        ),
        explanation: `Multiply whole × numerator and keep the denominator: (${w} × ${num})/${den} = ${ans}!`,
        wordProblemPrompt: `Each bookmark uses ${wNum}/${wDen} meter of ribbon. How many meters of ribbon do ${ww} bookmarks need?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${wProdNum}/${ww * wDen} meters`,
            `${ww + wNum}/${wDen} meters`,
            `${wProdNum - wNum}/${wDen} meters`,
          ],
          (k) => `${wProdNum + k}/${wDen} meters`,
        ),
        wordProblemStepHint: `${ww} × ${wNum}/${wDen} = (${ww} × ${wNum})/${wDen} = ${wProdNum}/${wDen} meters.`,
      };
    }

    case 'm-t3-fw-mixed': {
      const den = pick(rng, [3, 4, 5, 6, 8] as const);
      const num = randInt(rng, 2, den - 1);
      const minW = Math.max(2, Math.ceil(den / num));
      const w = randInt(rng, minW, minW + 3);
      const prodNum = w * num;
      const ans = fmtMixed(prodNum, den);
      const isWhole = prodNum % den === 0;

      const wDen = pick(rng, [3, 4, 5, 6] as const);
      const wNum = randInt(rng, 2, wDen - 1);
      const wMin = Math.max(2, Math.ceil(wDen / wNum));
      const ww = randInt(rng, wMin, wMin + 3);
      const wProdNum = ww * wNum;
      const wUnit = (v: string) => `${v} ${v === '1' ? 'hour' : 'hours'}`;
      const wAns = wUnit(fmtMixed(wProdNum, wDen));

      return {
        ...base,
        sprintPrompt: `Write ${w} × ${num}/${den} as a mixed number or whole number.`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `${prodNum}/${w * den}`,
            fmtMixed(prodNum + 1, den),
            fmtMixed(Math.max(1, prodNum - 1), den),
            fmtMixed(prodNum + den, den),
          ],
          (k) => fmtMixed(prodNum + k + 1, den),
        ),
        explanation: isWhole
          ? `${w} × ${num}/${den} = ${prodNum}/${den} = ${ans} whole!`
          : `${w} × ${num}/${den} = ${prodNum}/${den}. Divide ${prodNum} ÷ ${den} → ${ans}!`,
        wordProblemPrompt: `${name} practices music for ${wNum}/${wDen} hour each day for ${ww} days. How many hours in all?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${wProdNum}/${ww * wDen} hours`,
            wUnit(fmtMixed(wProdNum + 1, wDen)),
            wUnit(fmtMixed(Math.max(1, wProdNum - 1), wDen)),
          ],
          (k) => wUnit(fmtMixed(wProdNum + k + 1, wDen)),
        ),
        wordProblemStepHint: `${ww} × ${wNum}/${wDen} = ${wProdNum}/${wDen} = ${wAns}.`,
      };
    }

    case 'm-t3-fw-story': {
      const den = pick(rng, [3, 4, 5, 6] as const);
      const num = randInt(rng, 2, den - 1);
      const minB = Math.max(3, Math.ceil((den + 1) / num));
      const batches = randInt(rng, minB, minB + 3);
      const prodNum = batches * num;
      const cupUnit = (v: string) => `${v} ${v === '1' ? 'cup' : 'cups'}`;
      const ans = cupUnit(fmtMixed(prodNum, den));

      const wDen = pick(rng, [3, 4, 5, 6, 8] as const);
      const wNum = randInt(rng, 2, wDen - 1);
      const minL = Math.max(3, Math.ceil((wDen + 1) / wNum));
      const laps = randInt(rng, minL, minL + 3);
      const wProdNum = laps * wNum;
      const mileUnit = (v: string) => `${v} ${v === '1' ? 'mile' : 'miles'}`;
      const wAns = mileUnit(fmtMixed(wProdNum, wDen));

      return {
        ...base,
        sprintPrompt: `A smoothie recipe uses ${num}/${den} cup of berries per batch. How many cups for ${batches} batches?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `${prodNum}/${batches * den} cups`,
            cupUnit(fmtMixed(prodNum + 1, den)),
            cupUnit(fmtMixed(Math.max(1, prodNum - 1), den)),
            cupUnit(fmtMixed(prodNum + den, den)),
          ],
          (k) => cupUnit(fmtMixed(prodNum + k + 1, den)),
        ),
        explanation: `${batches} × ${num}/${den} = ${prodNum}/${den} = ${ans}!`,
        wordProblemPrompt: `One lap around the school track is ${wNum}/${wDen} mile. ${name} runs ${laps} laps. How far did ${name} run?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${wProdNum}/${laps * wDen} miles`,
            mileUnit(fmtMixed(wProdNum + 1, wDen)),
            mileUnit(fmtMixed(Math.max(1, wProdNum - 1), wDen)),
          ],
          (k) => mileUnit(fmtMixed(wProdNum + k + 1, wDen)),
        ),
        wordProblemStepHint: `${laps} × ${wNum}/${wDen} = ${wProdNum}/${wDen} = ${wAns}.`,
      };
    }

    // ═══════════ TIER 4: COORDINATE GRID ═══════════
    case 'm-t4-coord-read': {
      const maxC = 6;
      const x = randInt(rng, 1, maxC - 1);
      let y = randInt(rng, 1, maxC - 1);
      if (y === x) y = x < maxC - 1 ? x + 1 : x - 1;
      const ans = `(${x}, ${y})`;

      const wx = randInt(rng, 1, maxC - 1);
      let wy = randInt(rng, 1, maxC - 1);
      if (wy === wx) wy = wx < maxC - 1 ? wx + 1 : wx - 1;
      const wAns = `(${wx}, ${wy})`;

      return {
        ...base,
        sprintPrompt: 'What are the coordinates of point A on the grid?',
        sprintVisual: {
          kind: 'coord-grid',
          maxCoord: maxC,
          point: [x, y],
          showCoords: false,
        },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [`(${y}, ${x})`, `(${x}, ${Math.min(maxC, y + 1)})`, `(${Math.max(0, x - 1)}, ${y})`, `(${Math.min(maxC, x + 1)}, ${y})`],
          (k) => `(${(x + k) % maxC}, ${y})`,
        ),
        explanation: `Read across x = ${x} first, then up y = ${y} → ${ans}!`,
        wordProblemPrompt: 'On this treasure map, point A marks the hidden chest. What is the ordered pair for point A?',
        wordProblemVisual: {
          kind: 'coord-grid',
          maxCoord: maxC,
          point: [wx, wy],
          showCoords: false,
        },
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [`(${wy}, ${wx})`, `(${wx}, ${Math.max(0, wy - 1)})`, `(${Math.min(maxC, wx + 1)}, ${wy})`],
          (k) => `(${wx}, ${(wy + k) % maxC})`,
        ),
        wordProblemStepHint: `Go across ${wx} on the x-axis, then up ${wy} on the y-axis → ${wAns}.`,
      };
    }

    case 'm-t4-coord-xy': {
      const maxC = 6;
      const x = randInt(rng, 1, maxC - 1);
      let y = randInt(rng, 1, maxC - 1);
      if (y === x) y = x < maxC - 1 ? x + 1 : x - 1;
      const askY = rng() < 0.5;
      const ansNum = askY ? y : x;
      const ans = plural(ansNum, 'unit', 'units');

      const wx = randInt(rng, 1, maxC);
      let wy = randInt(rng, 1, maxC);
      if (wy === wx) wy = wx < maxC ? wx + 1 : wx - 1;
      const wAns = `(${wx}, ${wy})`;

      return {
        ...base,
        sprintPrompt: askY
          ? `In the ordered pair (${x}, ${y}), how many units UP from the x-axis is point A?`
          : `In the ordered pair (${x}, ${y}), how many units RIGHT from the y-axis is point A?`,
        sprintVisual: {
          kind: 'coord-grid',
          maxCoord: maxC,
          point: [x, y],
          showCoords: false,
        },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            plural(askY ? x : y, 'unit', 'units'),
            plural(x + y, 'unit', 'units'),
            plural(Math.abs(x - y), 'unit', 'units'),
            plural(ansNum + 1, 'unit', 'units'),
          ],
          (k) => plural(ansNum + k + 1, 'unit', 'units'),
        ),
        explanation: askY
          ? `The second number (y = ${y}) tells how many units UP from the x-axis!`
          : `The first number (x = ${x}) tells how many units RIGHT from the y-axis!`,
        wordProblemPrompt: `From the origin (0, 0), ${name} walks ${plural(wx, 'unit', 'units')} right and ${plural(wy, 'unit', 'units')} up to reach the fountain. What is the fountain’s coordinate?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [`(${wy}, ${wx})`, `(${wx}, 0)`, `(0, ${wy})`],
          (k) => `(${(wx + k) % (maxC + 1)}, ${wy})`,
        ),
        wordProblemStepHint: `Right is x (${wx}) and up is y (${wy}) → ${wAns}.`,
      };
    }

    case 'm-t4-coord-move': {
      const maxC = 6;
      const goRight = rng() < 0.6;
      const goUp = rng() < 0.6;
      const dx = randInt(rng, 1, 3);
      const dy = randInt(rng, 1, 3);
      const x1 = goRight ? randInt(rng, 0, maxC - dx) : randInt(rng, dx, maxC);
      const y1 = goUp ? randInt(rng, 0, maxC - dy) : randInt(rng, dy, maxC);
      const x2 = goRight ? x1 + dx : x1 - dx;
      const y2 = goUp ? y1 + dy : y1 - dy;
      const ans = `(${x2}, ${y2})`;

      const wdx = randInt(rng, 1, 3);
      const wdy = randInt(rng, 1, 3);
      const wx1 = randInt(rng, wdx, maxC);
      const wy1 = randInt(rng, wdy, maxC);
      const wx2 = wx1 - wdx;
      const wy2 = wy1 - wdy;
      const wAns = `(${wx2}, ${wy2})`;

      return {
        ...base,
        sprintPrompt: `Start at point A (${x1}, ${y1}). Move ${plural(dx, 'unit', 'units')} ${goRight ? 'RIGHT' : 'LEFT'} and ${plural(dy, 'unit', 'units')} ${goUp ? 'UP' : 'DOWN'}. Where do you land?`,
        sprintVisual: {
          kind: 'coord-grid',
          maxCoord: maxC,
          point: [x1, y1],
          showCoords: false,
          label: 'Start at A, then move!',
        },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            `(${y2}, ${x2})`,
            `(${Math.min(maxC, Math.max(0, goRight ? x1 + dy : x1 - dy))}, ${Math.min(maxC, Math.max(0, goUp ? y1 + dx : y1 - dx))})`,
            `(${Math.min(maxC, x2 + 1)}, ${y2})`,
            `(${x2}, ${Math.min(maxC, y2 + 1)})`,
            `(${Math.max(0, x2 - 1)}, ${y2})`,
          ],
          (k) => `(${(x2 + k) % (maxC + 1)}, ${y2})`,
        ),
        explanation: `x: ${x1} ${goRight ? '+' : '−'} ${dx} = ${x2}; y: ${y1} ${goUp ? '+' : '−'} ${dy} = ${y2} → ${ans}!`,
        wordProblemPrompt: `A rover sits at (${wx1}, ${wy1}). It drives ${plural(wdx, 'unit', 'units')} LEFT and ${plural(wdy, 'unit', 'units')} DOWN. What is its new location?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `(${wy2}, ${wx2})`,
            `(${Math.min(maxC, wx1 + wdx)}, ${wy2})`,
            `(${wx2}, ${Math.min(maxC, wy1 + wdy)})`,
            `(${Math.min(maxC, wx2 + 1)}, ${wy2})`,
            `(${wx2}, ${Math.min(maxC, wy2 + 1)})`,
          ],
          (k) => `(${(wx2 + k) % (maxC + 1)}, ${wy2})`,
        ),
        wordProblemStepHint: `Left subtracts x (${wx1}−${wdx}=${wx2}); down subtracts y (${wy1}−${wdy}=${wy2}) → ${wAns}.`,
      };
    }

    case 'm-t4-coord-dist': {
      const maxC = 6;
      const x1 = randInt(rng, 0, maxC - 2);
      const y1 = randInt(rng, 0, maxC - 2);
      const x2 = randInt(rng, x1 + 1, maxC);
      const y2 = randInt(rng, y1 + 1, maxC);
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const dist = dx + dy;
      const ans = plural(dist, 'unit', 'units');

      const wx1 = randInt(rng, 0, 2);
      const wy1 = randInt(rng, 0, 2);
      const wx2 = randInt(rng, wx1 + 2, maxC);
      const wy2 = randInt(rng, wy1 + 2, maxC);
      const wDist = Math.abs(wx2 - wx1) + Math.abs(wy2 - wy1);
      const wAns = plural(wDist, 'block', 'blocks');

      return {
        ...base,
        sprintPrompt: `Along the grid lines, how many units is the shortest path from A (${x1}, ${y1}) to B (${x2}, ${y2})?`,
        sprintVisual: {
          kind: 'coord-grid',
          maxCoord: maxC,
          point: [x1, y1],
          secondPoint: [x2, y2],
          showCoords: false,
        },
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            plural(Math.max(1, dist - 1), 'unit', 'units'),
            plural(dist + 1, 'unit', 'units'),
            plural(Math.max(1, Math.max(dx, dy)), 'unit', 'units'),
            plural(dx * dy, 'unit', 'units'),
          ],
          (k) => plural(dist + k + 1, 'unit', 'units'),
        ),
        explanation: `Horizontal steps |${x2} − ${x1}| = ${dx}, vertical steps |${y2} − ${y1}| = ${dy}. Total: ${dx} + ${dy} = ${ans}!`,
        wordProblemPrompt: `The library is at (${wx1}, ${wy1}) and the park is at (${wx2}, ${wy2}). Walking only along grid streets, how many blocks apart are they?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            plural(Math.max(1, wDist - 1), 'block', 'blocks'),
            plural(wDist + 1, 'block', 'blocks'),
            plural(Math.abs(wx2 - wx1), 'block', 'blocks'),
            plural(wDist + 2, 'block', 'blocks'),
          ],
          (k) => plural(wDist + k + 2, 'block', 'blocks'),
        ),
        wordProblemStepHint: `|${wx2} − ${wx1}| + |${wy2} − ${wy1}| = ${Math.abs(wx2 - wx1)} + ${Math.abs(wy2 - wy1)} = ${wAns}.`,
      };
    }

    // ═══════════ TIER 4: DECIMALS & HUNDREDTHS ═══════════
    case 'm-t4-dec-tenths-op': {
      const isAdd = rng() < 0.5;
      const pickNonZeroTenths = (min: number, max: number) => {
        let v = randInt(rng, min, max);
        if (v % 10 === 0) v += 1;
        return v;
      };
      const bumpAvoidZero = (v: number) => v + (v % 10 === 9 ? 2 : 1);
      const safeTenthsVal = (v: number) => {
        const c = Math.max(1, v);
        return c % 10 === 0 ? c + 1 : c;
      };
      let aT: number;
      let bT: number;
      let ansT: number;
      if (isAdd) {
        aT = pickNonZeroTenths(6, 36);
        bT = pickNonZeroTenths(4, 28);
        if ((aT + bT) % 10 === 0) bT = bumpAvoidZero(bT);
        ansT = aT + bT;
      } else {
        bT = pickNonZeroTenths(5, 24);
        ansT = pickNonZeroTenths(4, 28);
        if ((bT + ansT) % 10 === 0) ansT = bumpAvoidZero(ansT);
        aT = bT + ansT;
      }
      const ans = fmtTenths(ansT);

      const waT = pickNonZeroTenths(11, 34);
      let wbT = pickNonZeroTenths(6, 19);
      if ((waT + wbT) % 10 === 0) wbT = bumpAvoidZero(wbT);
      const wAnsT = waT + wbT;
      const wAns = `${fmtTenths(wAnsT)} m`;

      return {
        ...base,
        sprintPrompt: `What is ${fmtTenths(aT)} ${isAdd ? '+' : '−'} ${fmtTenths(bT)}?`,
        sprintVisual:
          ansT > 0 && ansT <= 10
            ? {
                kind: 'decimal-grid',
                shaded: ansT * 10,
                label: `${fmtTenths(aT)} ${isAdd ? '+' : '−'} ${fmtTenths(bT)} = ${ans}`,
              }
            : undefined,
        revealVisualOnFeedback: true,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            fmtTenths(safeTenthsVal(ansT + 1)),
            fmtTenths(safeTenthsVal(ansT - 1)),
            fmtTenths(safeTenthsVal(ansT + 10)),
            fmtTenths(safeTenthsVal(ansT - 10)),
          ],
          (k) => fmtTenths(safeTenthsVal(ansT + k * 2)),
        ),
        explanation: `${aT} tenths ${isAdd ? '+' : '−'} ${bT} tenths = ${ansT} tenths → ${ans}!`,
        wordProblemPrompt: `A snail crawled ${fmtTenths(waT)} meters in the morning and ${fmtTenths(wbT)} meters in the afternoon. How far did it crawl in all?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${fmtTenths(safeTenthsVal(wAnsT + 1))} m`,
            `${fmtTenths(safeTenthsVal(wAnsT - 1))} m`,
            `${fmtTenths(safeTenthsVal(wAnsT - 10))} m`,
            `${fmtTenths(safeTenthsVal(wAnsT + 10))} m`,
          ],
          (k) => `${fmtTenths(safeTenthsVal(wAnsT + k * 2))} m`,
        ),
        wordProblemStepHint: `Line up the decimal points: ${fmtTenths(waT)} + ${fmtTenths(wbT)} = ${wAns}.`,
      };
    }

    case 'm-t4-dec-hundredths-op': {
      const isAdd = rng() < 0.5;
      const pickNonZeroHundredths = (min: number, max: number) => {
        let v = randInt(rng, min, max);
        if (v % 10 === 0) v += 3;
        return v;
      };
      const bumpAvoidZero = (v: number) => v + (v % 10 === 9 ? 2 : 1);
      let aH: number;
      let bH: number;
      let ansH: number;
      if (isAdd) {
        aH = pickNonZeroHundredths(115, 385);
        bH = pickNonZeroHundredths(105, 295);
        if ((aH + bH) % 10 === 0) bH = bumpAvoidZero(bH);
        ansH = aH + bH;
      } else {
        bH = pickNonZeroHundredths(105, 245);
        ansH = pickNonZeroHundredths(105, 285);
        if ((bH + ansH) % 10 === 0) ansH = bumpAvoidZero(ansH);
        aH = bH + ansH;
      }
      const ans = fmtHundredths(ansH);

      const wbH = pickNonZeroHundredths(112, 238);
      let wAnsH = pickNonZeroHundredths(115, 265);
      if ((wbH + wAnsH) % 10 === 0) wAnsH = bumpAvoidZero(wAnsH);
      const waH = wbH + wAnsH;
      const wAns = `${fmtHundredths(wAnsH)} L`;

      return {
        ...base,
        sprintPrompt: `What is ${fmtHundredths(aH)} ${isAdd ? '+' : '−'} ${fmtHundredths(bH)}?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            fmtHundredths(ansH + 10),
            fmtHundredths(Math.max(1, ansH - 10)),
            fmtHundredths(ansH + 1),
            fmtHundredths(ansH + 100),
          ],
          (k) => fmtHundredths(ansH + k * 2),
        ),
        explanation: `${aH} ${isAdd ? '+' : '−'} ${bH} = ${ansH} hundredths → ${ans}!`,
        wordProblemPrompt: `A science beaker held ${fmtHundredths(waH)} liters of water. After pouring out ${fmtHundredths(wbH)} liters, how much water remains?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${fmtHundredths(wAnsH + 10)} L`,
            `${fmtHundredths(Math.max(1, wAnsH - 10))} L`,
            `${fmtHundredths(wAnsH + 100)} L`,
          ],
          (k) => `${fmtHundredths(wAnsH + k * 3)} L`,
        ),
        wordProblemStepHint: `${waH} − ${wbH} = ${wAnsH} hundredths → ${wAns}.`,
      };
    }

    case 'm-t4-dec-frac-compare': {
      const mode = pick(rng, ['tenths-wins', 'decimal-wins', 'hundredths-wins'] as const);
      let leftStr: string;
      let rightStr: string;
      let winner: string;
      let loser: string;
      let shaded: number;
      let visualLabel: string;
      let explanation: string;

      if (mode === 'tenths-wins') {
        const t = randInt(rng, 3, 9);
        const h = (t - 1) * 10 + randInt(rng, 5, 9);
        const fracStr = `${t}/10`;
        const decStr = fmtHundredths(h);
        const flip = rng() < 0.5;
        leftStr = flip ? decStr : fracStr;
        rightStr = flip ? fracStr : decStr;
        winner = fracStr;
        loser = decStr;
        shaded = t * 10;
        visualLabel = `${fracStr} = ${fmtHundredths(t * 10)}`;
        explanation = `${fracStr} = ${fmtHundredths(t * 10)}, which is greater than ${decStr}!`;
      } else if (mode === 'decimal-wins') {
        const d = randInt(rng, 2, 9);
        const fracStr = `${d}/100`;
        const decStr = `0.${d}`;
        const flip = rng() < 0.5;
        leftStr = flip ? decStr : fracStr;
        rightStr = flip ? fracStr : decStr;
        winner = decStr;
        loser = fracStr;
        shaded = d * 10;
        visualLabel = `${decStr} = ${d * 10}/100 > ${fracStr}`;
        explanation = `${decStr} = ${d * 10}/100, which is 10 times bigger than ${fracStr} (${fmtHundredths(d)})!`;
      } else {
        const t = randInt(rng, 2, 8);
        const h = t * 10 + randInt(rng, 2, 9);
        const fracStr = `${h}/100`;
        const decStr = `0.${t}`;
        const flip = rng() < 0.5;
        leftStr = flip ? decStr : fracStr;
        rightStr = flip ? fracStr : decStr;
        winner = fracStr;
        loser = decStr;
        shaded = h;
        visualLabel = `${fracStr} = ${fmtHundredths(h)} > ${fmtHundredths(t * 10)}`;
        explanation = `${fracStr} = ${fmtHundredths(h)}, which is greater than ${decStr} (${fmtHundredths(t * 10)})!`;
      }

      const wt = randInt(rng, 3, 8);
      const wh = wt * 10 - randInt(rng, 1, 5);
      const wFrac = `${wt}/10 m`;
      const wDec = `${fmtHundredths(wh)} m`;

      return {
        ...base,
        sprintPrompt: `Which value is GREATER: ${leftStr} or ${rightStr}?`,
        sprintVisual: {
          kind: 'decimal-grid',
          shaded,
          label: visualLabel,
        },
        revealVisualOnFeedback: true,
        correctAnswer: winner,
        distractors: uniqueDistractors(
          winner,
          [loser, 'They are equal', 'Cannot tell'],
          (k) => `0.0${k}`,
        ),
        explanation,
        wordProblemPrompt: `${name} jumped ${wFrac} and ${name2} jumped ${wDec}. Who jumped FARTHER?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: `${name} (${wFrac})`,
        wordProblemDistractors: [`${name2} (${wDec})`, 'They tied', 'Cannot tell'],
        wordProblemStepHint: `${wt}/10 = ${fmtHundredths(wt * 10)} m, which beats ${wDec}!`,
      };
    }

    case 'm-t4-dec-money-length': {
      const c1 = randInt(rng, 13, 46) * 10 + pick(rng, [0, 5] as const);
      const c2 = randInt(rng, 12, 38) * 10 + pick(rng, [0, 5] as const);
      const spent = c1 + c2;
      const bill = spent < 950 ? 1000 : 2000;
      const change = bill - spent;
      const ans = fmtMoney(change);

      const cut1 = randInt(rng, 11, 24) * 10 + 5; // e.g. 1.15 .. 2.45 m
      const cut2 = randInt(rng, 10, 22) * 10 + 5;
      const totalCut = cut1 + cut2;
      const remCm = randInt(rng, 11, 28) * 10 + 5;
      const boardCm = totalCut + remCm;
      const wAns = `${fmtHundredths(remCm)} m`;

      return {
        ...base,
        sprintPrompt: `You buy a notebook for ${fmtMoney(c1)} and a pen for ${fmtMoney(c2)}, then pay with ${fmtMoney(bill)}. How much change do you get?`,
        sprintVisual: undefined,
        revealVisualOnFeedback: false,
        correctAnswer: ans,
        distractors: uniqueDistractors(
          ans,
          [
            fmtMoney(spent),
            fmtMoney(change + 100),
            fmtMoney(Math.max(5, change - 100)),
            fmtMoney(change + 10),
          ],
          (k) => fmtMoney(change + k * 25),
        ),
        explanation: `Spent: ${fmtMoney(c1)} + ${fmtMoney(c2)} = ${fmtMoney(spent)}. Change: ${fmtMoney(bill)} − ${fmtMoney(spent)} = ${ans}!`,
        wordProblemPrompt: `A craft board is ${fmtHundredths(boardCm)} meters long. ${name} cuts a ${fmtHundredths(cut1)} m piece and a ${fmtHundredths(cut2)} m piece. How much board is LEFT?`,
        wordProblemVisual: undefined,
        wordProblemAnswer: wAns,
        wordProblemDistractors: uniqueDistractors(
          wAns,
          [
            `${fmtHundredths(totalCut)} m`,
            `${fmtHundredths(remCm + 10)} m`,
            `${fmtHundredths(Math.max(5, remCm - 10))} m`,
            `${fmtHundredths(remCm + 100)} m`,
          ],
          (k) => `${fmtHundredths(remCm + k * 20)} m`,
        ),
        wordProblemStepHint: `Total cut: ${fmtHundredths(cut1)} + ${fmtHundredths(cut2)} = ${fmtHundredths(totalCut)} m. Left: ${fmtHundredths(boardCm)} − ${fmtHundredths(totalCut)} = ${wAns}.`,
      };
    }

    default:
      return null;
  }
}

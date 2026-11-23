import type { DifficultyTier } from '../../core/types';

export type BarModelKind =
  | 'bm-mult-add'
  | 'bm-mult-sub'
  | 'bm-add-div'
  | 'bm-sub-div'
  | 'bm-compare-mult-sum'
  | 'bm-compare-diff-sum'
  | 'bm-rect-perimeter-side'
  | 'bm-fraction-of-set';

export interface BarModelSpec {
  layout: 'part-whole' | 'comparison' | 'equal-groups' | 'perimeter' | 'fraction-bar';
  totalLabel: string;
  totalValue: string;
  totalHidden?: boolean;
  segments: { label: string; value: string; color: string; hidden?: boolean; widthRatio?: number }[];
  secondaryRow?: {
    title: string;
    segments: { label: string; value: string; color: string; hidden?: boolean; widthRatio?: number }[];
  };
}

export interface BarModelQuestion {
  id: string;
  modelId: BarModelKind;
  tier: DifficultyTier;
  title: string;
  storyPrompt: string;
  step1Question: string;
  step1Equation: string;
  step1Answer: number;
  step2Equation: string;
  correctAnswer: number;
  unit: string;
  choices: string[];
  correctChoice: string;
  explanation: string;
  visual: BarModelSpec;
}

export interface BarModelUnitMeta {
  id: BarModelKind;
  tier: DifficultyTier;
  title: string;
  subtitle: string;
  ccssTag: string;
  emblemCollectibleId: string;
  accentHex: string;
  bgHex: string;
}

export const BAR_MODEL_UNITS: BarModelUnitMeta[] = [
  {
    id: 'bm-mult-add',
    tier: 1,
    title: 'Groups + Extras',
    subtitle: 'Multiply equal groups, then add leftover items',
    ccssTag: '4.OA.A.3',
    emblemCollectibleId: 'sweet-boba-bear',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
  },
  {
    id: 'bm-mult-sub',
    tier: 1,
    title: 'Shopping & Change',
    subtitle: 'Find total cost of equal items, then subtract from budget',
    ccssTag: '4.OA.A.3',
    emblemCollectibleId: 'sweet-honey-toast',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
  },
  {
    id: 'bm-add-div',
    tier: 2,
    title: 'Combine & Share Equally',
    subtitle: 'Add two collections together, then divide into equal bags',
    ccssTag: '4.OA.A.3',
    emblemCollectibleId: 'critter-sprout-bunny',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
  },
  {
    id: 'bm-sub-div',
    tier: 2,
    title: 'Keep Some, Split the Rest',
    subtitle: 'Subtract what you keep, then share the remainder equally',
    ccssTag: '4.OA.A.3',
    emblemCollectibleId: 'critter-red-panda',
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
  },
  {
    id: 'bm-compare-mult-sum',
    tier: 3,
    title: 'Times-As-Many Total',
    subtitle: 'Use a multiplicative comparison bar to find the combined total',
    ccssTag: '4.OA.A.2',
    emblemCollectibleId: 'critter-crystal-fox',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
  },
  {
    id: 'bm-compare-diff-sum',
    tier: 3,
    title: 'More-Than Comparison',
    subtitle: 'Find the larger bar first, then add both bars together',
    ccssTag: '4.OA.A.3',
    emblemCollectibleId: 'space-astro-corgi',
    accentHex: '#0891B2',
    bgHex: '#ECFEFF',
  },
  {
    id: 'bm-rect-perimeter-side',
    tier: 4,
    title: 'Perimeter Reverse Width',
    subtitle: 'Subtract both lengths from perimeter, then divide by 2',
    ccssTag: '4.MD.A.3',
    emblemCollectibleId: 'critter-moon-owl',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
  },
  {
    id: 'bm-fraction-of-set',
    tier: 4,
    title: 'Fraction Used & Left Over',
    subtitle: 'Split the bar into equal fractional units to find what remains',
    ccssTag: '4.NF.B.4',
    emblemCollectibleId: 'space-saturn-cat',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
  },
];

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

function formatNum(n: number): string {
  return n.toLocaleString('en-US');
}

function buildChoiceStrings(
  answer: number,
  unit: string,
  distractors: number[],
  rng: () => number,
): { choices: string[]; correctChoice: string } {
  const fmt = (n: number) => (unit === '$' ? `$${formatNum(n)}` : `${formatNum(n)} ${unit}`);
  const nums = new Set<number>([answer]);
  for (const d of distractors) {
    if (nums.size >= 4) break;
    if (Number.isInteger(d) && d > 0 && d !== answer) nums.add(d);
  }
  let step = 2;
  while (nums.size < 4) {
    if (answer + step > 0) nums.add(answer + step);
    if (nums.size < 4 && answer - step > 0) nums.add(answer - step);
    step += 3;
  }
  return {
    choices: shuffle(Array.from(nums).map(fmt), rng),
    correctChoice: fmt(answer),
  };
}

export function generateBarModelQuestion(
  modelId: BarModelKind,
  seq: number,
  rng: () => number = Math.random,
): BarModelQuestion {
  switch (modelId) {
    case 'bm-mult-add': {
      const boxes = pickInt(3, 6, rng);
      const perBox = pickInt(6, 12, rng);
      const extra = pickInt(4, 15, rng);
      const step1 = boxes * perBox;
      const ans = step1 + extra;
      const { choices, correctChoice } = buildChoiceStrings(
        ans,
        'stickers',
        [step1, boxes + perBox + extra, step1 - extra, ans + perBox],
        rng,
      );
      return {
        id: `bm-ma-${seq}-${boxes}-${perBox}-${extra}`,
        modelId,
        tier: 1,
        title: 'Groups + Extras',
        storyPrompt: `Chloe buys ${boxes} packs of star stickers with ${perBox} stickers in each pack. She also finds ${extra} loose stickers in her desk. How many stickers does she have in all?`,
        step1Question: `Step 1: Find stickers in the ${boxes} packs (${boxes} × ${perBox})`,
        step1Equation: `${boxes} × ${perBox} = ${step1}`,
        step1Answer: step1,
        step2Equation: `${step1} + ${extra} = ${ans}`,
        correctAnswer: ans,
        unit: 'stickers',
        choices,
        correctChoice,
        explanation: `First multiply the equal packs: ${boxes} × ${perBox} = ${step1}. Then add the extra stickers: ${step1} + ${extra} = ${ans} stickers.`,
        visual: {
          layout: 'part-whole',
          totalLabel: 'Total Stickers',
          totalValue: `${ans}`,
          totalHidden: true,
          segments: [
            ...Array.from({ length: boxes }, (_, i) => ({
              label: `Pack ${i + 1}`,
              value: `${perBox}`,
              color: '#3B82F6',
            })),
            { label: 'Extra', value: `${extra}`, color: '#F59E0B' },
          ],
        },
      };
    }

    case 'bm-mult-sub': {
      const qty = pickInt(3, 6, rng);
      const price = pickInt(4, 9, rng);
      const spent = qty * price;
      const change = pickInt(6, 28, rng);
      const budget = spent + change;
      const { choices, correctChoice } = buildChoiceStrings(
        change,
        '$',
        [spent, budget - price, change + price, Math.max(1, change - qty)],
        rng,
      );
      return {
        id: `bm-ms-${seq}-${qty}-${price}-${budget}`,
        modelId,
        tier: 1,
        title: 'Shopping & Change',
        storyPrompt: `Maya brings $${budget} to the book fair. She buys ${qty} graphic novels that cost $${price} each. How much money does she have left?`,
        step1Question: `Step 1: Find the cost of ${qty} books (${qty} × $${price})`,
        step1Equation: `${qty} × $${price} = $${spent}`,
        step1Answer: spent,
        step2Equation: `$${budget} − $${spent} = $${change}`,
        correctAnswer: change,
        unit: '$',
        choices,
        correctChoice,
        explanation: `First find the total cost: ${qty} × $${price} = $${spent}. Then subtract from her $${budget}: $${budget} − $${spent} = $${change} left.`,
        visual: {
          layout: 'part-whole',
          totalLabel: 'Starting Budget',
          totalValue: `$${budget}`,
          segments: [
            ...Array.from({ length: qty }, (_, i) => ({
              label: `Book ${i + 1}`,
              value: `$${price}`,
              color: '#10B981',
            })),
            { label: 'Money Left', value: `$${change}`, color: '#F59E0B', hidden: true },
          ],
        },
      };
    }

    case 'bm-add-div': {
      const bags = pickInt(3, 6, rng);
      const each = pickInt(6, 14, rng);
      const total = bags * each;
      const day1 = pickInt(Math.max(5, Math.floor(total * 0.3)), Math.floor(total * 0.65), rng);
      const day2 = total - day1;
      const { choices, correctChoice } = buildChoiceStrings(
        each,
        'strawberries',
        [total, each + 2, Math.max(2, each - 2), each + bags],
        rng,
      );
      return {
        id: `bm-ad-${seq}-${day1}-${day2}-${bags}`,
        modelId,
        tier: 2,
        title: 'Combine & Share Equally',
        storyPrompt: `Lily picks ${day1} strawberries on Saturday and ${day2} strawberries on Sunday. She shares all of them equally into ${bags} gift bags. How many strawberries go in each bag?`,
        step1Question: `Step 1: Add both days (${day1} + ${day2})`,
        step1Equation: `${day1} + ${day2} = ${total}`,
        step1Answer: total,
        step2Equation: `${total} ÷ ${bags} = ${each}`,
        correctAnswer: each,
        unit: 'strawberries',
        choices,
        correctChoice,
        explanation: `First find the combined total: ${day1} + ${day2} = ${total} strawberries. Then divide equally into ${bags} bags: ${total} ÷ ${bags} = ${each} strawberries per bag.`,
        visual: {
          layout: 'part-whole',
          totalLabel: 'Combined Total',
          totalValue: `${total}`,
          totalHidden: true,
          segments: [
            { label: 'Saturday', value: `${day1}`, color: '#EC4899' },
            { label: 'Sunday', value: `${day2}`, color: '#8B5CF6' },
          ],
          secondaryRow: {
            title: `Split into ${bags} Equal Bags`,
            segments: Array.from({ length: bags }, (_, i) => ({
              label: `Bag ${i + 1}`,
              value: `${each}`,
              color: '#10B981',
              hidden: true,
            })),
          },
        },
      };
    }

    case 'bm-sub-div': {
      const friends = pickInt(3, 6, rng);
      const each = pickInt(5, 12, rng);
      const shared = friends * each;
      const kept = pickInt(8, 20, rng);
      const total = shared + kept;
      const { choices, correctChoice } = buildChoiceStrings(
        each,
        'beads',
        [shared, each + 2, Math.max(2, each - 2), Math.floor(total / friends)],
        rng,
      );
      return {
        id: `bm-sd-${seq}-${total}-${kept}-${friends}`,
        modelId,
        tier: 2,
        title: 'Keep Some, Split the Rest',
        storyPrompt: `Zoe has ${total} pastel bracelet beads. She keeps ${kept} beads for herself and splits the remaining beads equally among ${friends} friends. How many beads does each friend get?`,
        step1Question: `Step 1: Subtract the beads Zoe keeps (${total} − ${kept})`,
        step1Equation: `${total} − ${kept} = ${shared}`,
        step1Answer: shared,
        step2Equation: `${shared} ÷ ${friends} = ${each}`,
        correctAnswer: each,
        unit: 'beads',
        choices,
        correctChoice,
        explanation: `First subtract what Zoe keeps: ${total} − ${kept} = ${shared} beads left to share. Then divide among ${friends} friends: ${shared} ÷ ${friends} = ${each} beads each.`,
        visual: {
          layout: 'part-whole',
          totalLabel: 'All Beads',
          totalValue: `${total}`,
          segments: [
            { label: 'Kept', value: `${kept}`, color: '#F97316' },
            ...Array.from({ length: friends }, (_, i) => ({
              label: `Friend ${i + 1}`,
              value: `${each}`,
              color: '#3B82F6',
              hidden: true,
            })),
          ],
        },
      };
    }

    case 'bm-compare-mult-sum': {
      const base = pickInt(6, 15, rng);
      const mult = pickInt(3, 5, rng);
      const bigger = base * mult;
      const ans = base + bigger;
      const { choices, correctChoice } = buildChoiceStrings(
        ans,
        'cards',
        [bigger, base + mult, bigger - base, ans + base],
        rng,
      );
      return {
        id: `bm-cms-${seq}-${base}-${mult}`,
        modelId,
        tier: 3,
        title: 'Times-As-Many Total',
        storyPrompt: `Nora collected ${base} critter cards. Her older sister collected ${mult} times as many cards as Nora. How many cards did the two sisters collect altogether?`,
        step1Question: `Step 1: Find the sister's cards (${base} × ${mult})`,
        step1Equation: `${base} × ${mult} = ${bigger}`,
        step1Answer: bigger,
        step2Equation: `${base} + ${bigger} = ${ans}`,
        correctAnswer: ans,
        unit: 'cards',
        choices,
        correctChoice,
        explanation: `First find the sister's total: ${base} × ${mult} = ${bigger} cards. Then add Nora's ${base} cards: ${base} + ${bigger} = ${ans} cards altogether.`,
        visual: {
          layout: 'comparison',
          totalLabel: 'Both Sisters Total',
          totalValue: `${ans}`,
          totalHidden: true,
          segments: [{ label: 'Nora (1 unit)', value: `${base}`, color: '#7C3AED', widthRatio: 1 / mult }],
          secondaryRow: {
            title: `Sister (${mult}× as many)`,
            segments: Array.from({ length: mult }, (_, i) => ({
              label: `Unit ${i + 1}`,
              value: `${base}`,
              color: '#A855F7',
              widthRatio: 1 / mult,
            })),
          },
        },
      };
    }

    case 'bm-compare-diff-sum': {
      const teamA = pickInt(18, 45, rng);
      const more = pickInt(7, 19, rng);
      const teamB = teamA + more;
      const ans = teamA + teamB;
      const { choices, correctChoice } = buildChoiceStrings(
        ans,
        'points',
        [teamB, teamA + more + more, ans + more, teamA * 2],
        rng,
      );
      return {
        id: `bm-cds-${seq}-${teamA}-${more}`,
        modelId,
        tier: 3,
        title: 'More-Than Comparison',
        storyPrompt: `In a trivia match, the Blue Team scored ${teamA} points. The Gold Team scored ${more} more points than the Blue Team. How many points did both teams score in total?`,
        step1Question: `Step 1: Find the Gold Team's score (${teamA} + ${more})`,
        step1Equation: `${teamA} + ${more} = ${teamB}`,
        step1Answer: teamB,
        step2Equation: `${teamA} + ${teamB} = ${ans}`,
        correctAnswer: ans,
        unit: 'points',
        choices,
        correctChoice,
        explanation: `First find the Gold Team's score: ${teamA} + ${more} = ${teamB} points. Then add both teams together: ${teamA} + ${teamB} = ${ans} points.`,
        visual: {
          layout: 'comparison',
          totalLabel: 'Both Teams Total',
          totalValue: `${ans}`,
          totalHidden: true,
          segments: [{ label: 'Blue Team', value: `${teamA}`, color: '#0284C7', widthRatio: 0.7 }],
          secondaryRow: {
            title: 'Gold Team',
            segments: [
              { label: 'Same as Blue', value: `${teamA}`, color: '#F59E0B', widthRatio: 0.7 },
              { label: 'Extra', value: `+${more}`, color: '#FB923C', widthRatio: 0.3 },
            ],
          },
        },
      };
    }

    case 'bm-rect-perimeter-side': {
      const length = pickInt(11, 22, rng);
      const width = pickInt(5, length - 2, rng);
      const twoLengths = length * 2;
      const perimeter = twoLengths + width * 2;
      const { choices, correctChoice } = buildChoiceStrings(
        width,
        'ft',
        [width * 2, perimeter - length, length - width, width + 3],
        rng,
      );
      return {
        id: `bm-rp-${seq}-${length}-${width}`,
        modelId,
        tier: 4,
        title: 'Perimeter Reverse Width',
        storyPrompt: `A rectangular school garden has a total perimeter of ${perimeter} feet. Each of its two long sides measures ${length} feet. What is the width of one short side?`,
        step1Question: `Step 1: Subtract both long sides (${perimeter} − 2 × ${length})`,
        step1Equation: `${perimeter} − ${twoLengths} = ${width * 2}`,
        step1Answer: width * 2,
        step2Equation: `${width * 2} ÷ 2 = ${width}`,
        correctAnswer: width,
        unit: 'ft',
        choices,
        correctChoice,
        explanation: `The two long sides use ${length} + ${length} = ${twoLengths} ft, leaving ${perimeter} − ${twoLengths} = ${width * 2} ft for the two widths. Divide by 2: ${width * 2} ÷ 2 = ${width} ft.`,
        visual: {
          layout: 'perimeter',
          totalLabel: 'Perimeter',
          totalValue: `${perimeter} ft`,
          segments: [
            { label: 'Length', value: `${length} ft`, color: '#4F46E5' },
            { label: 'Length', value: `${length} ft`, color: '#4F46E5' },
            { label: 'Width', value: `${width} ft`, color: '#10B981', hidden: true },
            { label: 'Width', value: `${width} ft`, color: '#10B981', hidden: true },
          ],
        },
      };
    }

    case 'bm-fraction-of-set': {
      const denom = pickInt(4, 6, rng);
      const unitVal = pickInt(4, 9, rng);
      const total = denom * unitVal;
      const numer = pickInt(1, denom - 2, rng);
      const used = numer * unitVal;
      const left = total - used;
      const { choices, correctChoice } = buildChoiceStrings(
        left,
        'pearls',
        [used, unitVal, left + unitVal, Math.max(2, left - unitVal)],
        rng,
      );
      return {
        id: `bm-fs-${seq}-${total}-${numer}-${denom}`,
        modelId,
        tier: 4,
        title: 'Fraction Used & Left Over',
        storyPrompt: `A boba shop makes ${total} brown-sugar pearls. They use ${numer}/${denom} of the pearls for morning orders. How many pearls are left for the afternoon?`,
        step1Question: `Step 1: Find 1/${denom} of ${total} (${total} ÷ ${denom}), then multiply by ${numer}`,
        step1Equation: `(${total} ÷ ${denom}) × ${numer} = ${used}`,
        step1Answer: used,
        step2Equation: `${total} − ${used} = ${left}`,
        correctAnswer: left,
        unit: 'pearls',
        choices,
        correctChoice,
        explanation: `Each 1/${denom} unit equals ${total} ÷ ${denom} = ${unitVal} pearls. Morning orders used ${numer} ${numer === 1 ? 'unit' : 'units'} = ${used} pearls, leaving ${total} − ${used} = ${left} pearls.`,
        visual: {
          layout: 'fraction-bar',
          totalLabel: 'All Pearls',
          totalValue: `${total}`,
          segments: Array.from({ length: denom }, (_, i) => ({
            label: i < numer ? 'Used' : 'Left',
            value: `${unitVal}`,
            color: i < numer ? '#D97706' : '#10B981',
            hidden: true,
          })),
        },
      };
    }
  }
}

export const BAR_MODEL_RUN_SIZE = 4;
export const BAR_MODEL_BASE_TOKENS = 30;
export const BAR_MODEL_PERFECT_BONUS = 10;

export function buildBarModelSession(
  modelId: BarModelKind,
  count = BAR_MODEL_RUN_SIZE,
  rng: () => number = Math.random,
): BarModelQuestion[] {
  const session: BarModelQuestion[] = [];
  const usedPrompts = new Set<string>();
  let guard = 0;
  while (session.length < count && guard < count * 12) {
    guard += 1;
    const q = generateBarModelQuestion(modelId, guard, rng);
    if (!usedPrompts.has(q.storyPrompt)) {
      usedPrompts.add(q.storyPrompt);
      session.push(q);
    }
  }
  return session;
}

export function calculateBarModelTokens(firstTryCorrect: number, total = BAR_MODEL_RUN_SIZE): number {
  return BAR_MODEL_BASE_TOKENS + (firstTryCorrect >= total ? BAR_MODEL_PERFECT_BONUS : 0);
}

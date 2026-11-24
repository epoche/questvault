import type {
  BalanceScaleRow,
  LogicChoice,
  LogicClue,
  LogicGridEntity,
  LogicGridSolutionRow,
  LogicQuestion,
  LogicReasoningModuleId,
  MatrixCellSpec,
  MatrixFill,
  MatrixShape,
  RobotCmd,
  RobotDir,
  RobotFlagMarker,
  ScaleIconItem,
  ScalePanItem,
} from './logicTypes';

// ── Deterministic PRNG (Mulberry32) ──
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function shuffleWithRng<T>(items: readonly T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================================================
// MODULE 5: BALANCE SCALE LOGIC (天平代數推理)
// ============================================================================

const SCALE_ICONS: readonly ScaleIconItem[] = [
  { kind: 'icon', iconId: 'berry', emoji: '🍓', nameEn: 'Strawberry', nameZh: '草莓', color: '#E11D48' },
  { kind: 'icon', iconId: 'star', emoji: '⭐', nameEn: 'Star', nameZh: '星星', color: '#D97706' },
  { kind: 'icon', iconId: 'cupcake', emoji: '🧁', nameEn: 'Cupcake', nameZh: '杯子蛋糕', color: '#DB2777' },
  { kind: 'icon', iconId: 'gem', emoji: '💎', nameEn: 'Gem', nameZh: '寶石', color: '#2563EB' },
  { kind: 'icon', iconId: 'cookie', emoji: '🍪', nameEn: 'Cookie', nameZh: '餅乾', color: '#B45309' },
  { kind: 'icon', iconId: 'apple', emoji: '🍎', nameEn: 'Apple', nameZh: '蘋果', color: '#DC2626' },
  { kind: 'icon', iconId: 'clover', emoji: '🍀', nameEn: 'Clover', nameZh: '幸運草', color: '#059669' },
  { kind: 'icon', iconId: 'melon', emoji: '🍉', nameEn: 'Melon', nameZh: '西瓜', color: '#16A34A' },
];

function pluralizeIconEn(nameEn: string): string {
  return nameEn.endsWith('y') ? `${nameEn.slice(0, -1)}ies` : `${nameEn}s`;
}

function repeatIcon(icon: ScaleIconItem, count: number): ScaleIconItem[] {
  return Array.from({ length: count }, () => icon);
}

/**
 * Independent Gaussian-elimination solver for balance scale linear systems.
 * Returns exact map of iconId -> value ONLY when the system has a unique solution
 * and every equation balances identically upon reverse substitution.
 */
export function solveBalanceSystem(
  scales: BalanceScaleRow[],
  iconIds: string[],
  fixedUnitIconId?: string,
): Record<string, number> | null {
  const n = iconIds.length;
  if (n === 0) return null;
  const idxMap = new Map(iconIds.map((id, idx) => [id, idx]));

  const rows: number[][] = [];
  for (const scale of scales) {
    const coeffs = new Array<number>(n + 1).fill(0);
    // left - right = 0 => sum(left_icons) - sum(right_icons) = sum(right_weights) - sum(left_weights)
    for (const item of scale.left) {
      if (item.kind === 'icon') {
        const idx = idxMap.get(item.iconId);
        if (idx === undefined) return null;
        coeffs[idx] += 1;
      } else {
        coeffs[n] -= item.value;
      }
    }
    for (const item of scale.right) {
      if (item.kind === 'icon') {
        const idx = idxMap.get(item.iconId);
        if (idx === undefined) return null;
        coeffs[idx] -= 1;
      } else {
        coeffs[n] += item.value;
      }
    }
    rows.push(coeffs);
  }

  if (fixedUnitIconId !== undefined) {
    const idx = idxMap.get(fixedUnitIconId);
    if (idx === undefined) return null;
    const unitRow = new Array<number>(n + 1).fill(0);
    unitRow[idx] = 1;
    unitRow[n] = 1;
    rows.push(unitRow);
  }

  if (rows.length < n) return null;

  // Gaussian elimination with partial pivoting
  const mat = rows.map((r) => [...r]);
  let pivotRow = 0;
  for (let col = 0; col < n && pivotRow < mat.length; col++) {
    let best = pivotRow;
    for (let r = pivotRow + 1; r < mat.length; r++) {
      if (Math.abs(mat[r][col]) > Math.abs(mat[best][col])) {
        best = r;
      }
    }
    if (Math.abs(mat[best][col]) < 1e-9) {
      return null; // Rank deficient -> not unique!
    }
    [mat[pivotRow], mat[best]] = [mat[best], mat[pivotRow]];
    const pivot = mat[pivotRow][col];
    for (let c = col; c <= n; c++) {
      mat[pivotRow][c] /= pivot;
    }
    for (let r = 0; r < mat.length; r++) {
      if (r === pivotRow) continue;
      const factor = mat[r][col];
      if (Math.abs(factor) < 1e-12) continue;
      for (let c = col; c <= n; c++) {
        mat[r][c] -= factor * mat[pivotRow][c];
      }
    }
    pivotRow++;
  }

  if (pivotRow < n) return null;

  // Verify overdetermined rows are consistent
  for (let r = n; r < mat.length; r++) {
    if (Math.abs(mat[r][n]) > 1e-7) return null;
  }

  const result: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const val = mat[i][n];
    const rounded = Math.round(val);
    if (Math.abs(val - rounded) > 1e-6 || rounded <= 0) return null;
    result[iconIds[i]] = rounded;
  }

  // Reverse-substitution check on every scale
  const evalPan = (pan: ScalePanItem[]): number =>
    pan.reduce((acc, item) => acc + (item.kind === 'weight' ? item.value : result[item.iconId]), 0);
  for (const scale of scales) {
    if (evalPan(scale.left) !== evalPan(scale.right)) return null;
  }
  return result;
}

function buildPositiveIntChoices(
  answer: number,
  candidates: number[],
  rng: () => number,
  unitEn: string,
  unitZh: string,
): { choices: LogicChoice[]; correctIndex: number } {
  const distractors: number[] = [];
  for (const c of candidates) {
    if (Number.isInteger(c) && c > 0 && c !== answer && !distractors.includes(c)) {
      distractors.push(c);
    }
    if (distractors.length === 3) break;
  }
  let delta = 1;
  while (distractors.length < 3) {
    const hi = answer + delta;
    if (hi > 0 && hi !== answer && !distractors.includes(hi)) {
      distractors.push(hi);
    }
    if (distractors.length < 3) {
      const lo = answer - delta;
      if (lo > 0 && lo !== answer && !distractors.includes(lo)) {
        distractors.push(lo);
      }
    }
    delta++;
  }
  const all = shuffleWithRng([answer, ...distractors.slice(0, 3)], rng);
  const correctIndex = all.indexOf(answer);
  const choices: LogicChoice[] = all.map((val, idx) => ({
    id: `opt-${idx}`,
    labelEn: unitEn ? `${val} ${unitEn}` : `${val}`,
    labelZh: unitZh ? `${val} ${unitZh}` : `${val}`,
  }));
  return { choices, correctIndex };
}

export function generateBalanceScaleQuestion(seed: number): LogicQuestion {
  const rng = mulberry32(seed);
  const archetype = seed % 4;
  const icons = shuffleWithRng(SCALE_ICONS, rng);
  const A = icons[0];
  const B = icons[1];
  const C = icons[2];

  let scales: BalanceScaleRow[] = [];
  let askItems: ScaleIconItem[] = [];
  let answer = 0;
  let promptEn = '';
  let promptZh = '';
  let explanationEn = '';
  let explanationZh = '';
  let unitEn = '';
  let unitZh = '';
  let candidateDistractors: number[] = [];
  let revealedValues: { emoji: string; nameEn: string; nameZh: string; value: number }[] = [];

  if (archetype === 0) {
    // 2 scales: a*A = total1, A + b*B = total2 -> ask B
    const a = randInt(rng, 2, 3);
    const b = randInt(rng, 2, 3);
    const valA = randInt(rng, 2, 8);
    let valB = randInt(rng, 2, 9);
    if (valB === valA) valB = valA + 1;
    scales = [
      { left: repeatIcon(A, a), right: [{ kind: 'weight', value: a * valA }] },
      { left: [A, ...repeatIcon(B, b)], right: [{ kind: 'weight', value: valA + b * valB }] },
    ];
    askItems = [B];
    answer = valB;
    const solved = solveBalanceSystem(scales, [A.iconId, B.iconId]);
    if (!solved || solved[B.iconId] !== answer) {
      throw new Error(`Balance archetype 0 solver failed on seed ${seed}`);
    }
    promptEn = `Both scales are balanced! What number does 1 ${B.emoji} (${B.nameEn}) weigh?`;
    promptZh = `兩座天平都剛好平衡！請問 1 個 ${B.emoji}（${B.nameZh}）代表多少？`;
    explanationEn = `Scale 1: ${a} × ${A.emoji} = ${a * valA}, so ${A.emoji} = ${valA}. Scale 2: ${valA} + ${b} × ${B.emoji} = ${valA + b * valB}, so ${b} × ${B.emoji} = ${b * valB} and ${B.emoji} = ${valB}.`;
    explanationZh = `第 1 座天平：${a} 個 ${A.emoji} = ${a * valA}，所以 ${A.emoji} = ${valA}。代入第 2 座：${valA} + ${b} 個 ${B.emoji} = ${valA + b * valB}，推得 ${b} 個 ${B.emoji} = ${b * valB}，因此 ${B.emoji} = ${valB}。`;
    candidateDistractors = [valB + 1, valB - 1, valA, b * valB, valB + 2];
    revealedValues = [
      { emoji: A.emoji, nameEn: A.nameEn, nameZh: A.nameZh, value: valA },
      { emoji: B.emoji, nameEn: B.nameEn, nameZh: B.nameZh, value: valB },
    ];
  } else if (archetype === 1) {
    // 3 scales chain: 2*A = 2*valA, A + B = valA + valB, B + C = valB + valC -> ask C
    const valA = randInt(rng, 3, 9);
    const valB = randInt(rng, 2, 8);
    let valC = randInt(rng, 2, 10);
    if (valC === valB) valC = valB + 2;
    scales = [
      { left: [A, A], right: [{ kind: 'weight', value: 2 * valA }] },
      { left: [A, B], right: [{ kind: 'weight', value: valA + valB }] },
      { left: [B, C], right: [{ kind: 'weight', value: valB + valC }] },
    ];
    askItems = [C];
    answer = valC;
    const solved = solveBalanceSystem(scales, [A.iconId, B.iconId, C.iconId]);
    if (!solved || solved[C.iconId] !== answer) {
      throw new Error(`Balance archetype 1 solver failed on seed ${seed}`);
    }
    promptEn = `All three scales are balanced! What is the value of 1 ${C.emoji} (${C.nameEn})?`;
    promptZh = `三座天平都剛好平衡！請問 1 個 ${C.emoji}（${C.nameZh}）代表多少？`;
    explanationEn = `Scale 1 gives ${A.emoji} = ${valA}. Scale 2 gives ${B.emoji} = ${valA + valB} − ${valA} = ${valB}. Scale 3 gives ${C.emoji} = ${valB + valC} − ${valB} = ${valC}.`;
    explanationZh = `由第 1 座得 ${A.emoji} = ${valA}；第 2 座得 ${B.emoji} = ${valA + valB} − ${valA} = ${valB}；第 3 座得 ${C.emoji} = ${valB + valC} − ${valB} = ${valC}。`;
    candidateDistractors = [valC + 1, valC - 1, valB, valA, valC + 2];
    revealedValues = [
      { emoji: A.emoji, nameEn: A.nameEn, nameZh: A.nameZh, value: valA },
      { emoji: B.emoji, nameEn: B.nameEn, nameZh: B.nameZh, value: valB },
      { emoji: C.emoji, nameEn: C.nameEn, nameZh: C.nameZh, value: valC },
    ];
  } else if (archetype === 2) {
    // Pure trade substitution: 1 A = k B, 1 C = m A -> ask how many B equal 1 C (or 1 C + 1 B)
    const k = randInt(rng, 2, 4);
    const m = randInt(rng, 2, 3);
    const extraB = rng() < 0.4 ? 1 : 0;
    scales = [
      { left: [A], right: repeatIcon(B, k) },
      { left: [C], right: repeatIcon(A, m) },
    ];
    askItems = extraB ? [C, B] : [C];
    answer = m * k + extraB;
    const solved = solveBalanceSystem(scales, [A.iconId, B.iconId, C.iconId], B.iconId);
    if (!solved || solved[C.iconId] + extraB * solved[B.iconId] !== answer) {
      throw new Error(`Balance archetype 2 solver failed on seed ${seed}`);
    }
    unitEn = B.emoji;
    unitZh = `個 ${B.emoji}`;
    const pluralBEn = pluralizeIconEn(B.nameEn);
    promptEn = extraB
      ? `How many ${B.emoji} (${pluralBEn}) balance 1 ${C.emoji} + 1 ${B.emoji}?`
      : `How many ${B.emoji} (${pluralBEn}) balance 1 ${C.emoji} (${C.nameEn})?`;
    promptZh = extraB
      ? `1 個 ${C.emoji} 加上 1 個 ${B.emoji}，總共等於幾個 ${B.emoji}（${B.nameZh}）？`
      : `1 個 ${C.emoji}（${C.nameZh}）的重量，剛好等於幾個 ${B.emoji}（${B.nameZh}）？`;
    explanationEn = extraB
      ? `1 ${C.emoji} = ${m} ${A.emoji}, and each ${A.emoji} = ${k} ${B.emoji}, so 1 ${C.emoji} = ${m} × ${k} = ${m * k} ${B.emoji}. Adding 1 more ${B.emoji} makes ${answer} ${B.emoji}.`
      : `1 ${C.emoji} = ${m} ${A.emoji}, and each ${A.emoji} = ${k} ${B.emoji}. Multiply: ${m} × ${k} = ${answer} ${B.emoji}.`;
    explanationZh = extraB
      ? `1 個 ${C.emoji} = ${m} 個 ${A.emoji}，而每個 ${A.emoji} = ${k} 個 ${B.emoji}，所以 1 個 ${C.emoji} = ${m} × ${k} = ${m * k} 個 ${B.emoji}，再加 1 個共 ${answer} 個 ${B.emoji}。`
      : `1 個 ${C.emoji} = ${m} 個 ${A.emoji}，每個 ${A.emoji} = ${k} 個 ${B.emoji}，相乘得 ${m} × ${k} = ${answer} 個 ${B.emoji}。`;
    candidateDistractors = [m + k + extraB, answer + 1, answer - 1, answer + k, m * (k + 1)];
    revealedValues = [
      { emoji: B.emoji, nameEn: B.nameEn, nameZh: B.nameZh, value: 1 },
      { emoji: A.emoji, nameEn: A.nameEn, nameZh: A.nameZh, value: k },
      { emoji: C.emoji, nameEn: C.nameEn, nameZh: C.nameZh, value: m * k },
    ];
  } else {
    // Simultaneous elimination: A + B = S1, A + B + B = S2 -> B = S2 - S1, A = S1 - B
    const valA = randInt(rng, 3, 10);
    let valB = randInt(rng, 2, 9);
    if (valB === valA) valB = valA + 2;
    const askA = rng() < 0.5;
    scales = [
      { left: [A, B], right: [{ kind: 'weight', value: valA + valB }] },
      { left: [A, B, B], right: [{ kind: 'weight', value: valA + 2 * valB }] },
    ];
    askItems = [askA ? A : B];
    answer = askA ? valA : valB;
    const solved = solveBalanceSystem(scales, [A.iconId, B.iconId]);
    if (!solved || solved[(askA ? A : B).iconId] !== answer) {
      throw new Error(`Balance archetype 3 solver failed on seed ${seed}`);
    }
    const target = askA ? A : B;
    promptEn = `Compare the two balanced scales! What is the value of 1 ${target.emoji} (${target.nameEn})?`;
    promptZh = `比較這兩座平衡天平的差別！請問 1 個 ${target.emoji}（${target.nameZh}）代表多少？`;
    explanationEn = askA
      ? `Scale 2 has one extra ${B.emoji}, so ${B.emoji} = ${valA + 2 * valB} − ${valA + valB} = ${valB}. Then from Scale 1, ${A.emoji} = ${valA + valB} − ${valB} = ${valA}.`
      : `Scale 2 has everything from Scale 1 plus one extra ${B.emoji}. Subtract: ${valA + 2 * valB} − ${valA + valB} = ${valB}, so ${B.emoji} = ${valB}.`;
    explanationZh = askA
      ? `第 2 座比第 1 座多 1 個 ${B.emoji}，重量多 ${valA + 2 * valB} − ${valA + valB} = ${valB}，所以 ${B.emoji} = ${valB}；再回第 1 座得 ${A.emoji} = ${valA + valB} − ${valB} = ${valA}。`
      : `第 2 座剛好比第 1 座多 1 個 ${B.emoji}，相減得 ${valA + 2 * valB} − ${valA + valB} = ${valB}，所以 ${B.emoji} = ${valB}。`;
    candidateDistractors = [askA ? valB : valA, answer + 1, answer - 1, answer + 2, valA + valB];
    revealedValues = [
      { emoji: A.emoji, nameEn: A.nameEn, nameZh: A.nameZh, value: valA },
      { emoji: B.emoji, nameEn: B.nameEn, nameZh: B.nameZh, value: valB },
    ];
  }

  const { choices, correctIndex } = buildPositiveIntChoices(
    answer,
    candidateDistractors,
    rng,
    unitEn,
    unitZh,
  );

  return {
    id: `bal-${seed}`,
    moduleId: 'balance-scale',
    promptEn,
    promptZh,
    promptVisual: {
      kind: 'balance-scale',
      scales,
      askItems,
    },
    choices,
    correctIndex,
    explanationEn,
    explanationZh,
    feedbackVisual: {
      kind: 'balance-scale',
      scales,
      askItems,
      revealedValues,
    },
  };
}

// ============================================================================
// MODULE 6: PATTERN MATRIX (圖形矩陣規律)
// ============================================================================

const MATRIX_SHAPES: readonly MatrixShape[] = ['circle', 'square', 'diamond', 'triangle', 'star4'];
const MATRIX_COLORS: readonly { hex: string; en: string; zh: string }[] = [
  { hex: '#2563EB', en: 'blue', zh: '藍色' },
  { hex: '#EA580C', en: 'orange', zh: '橘色' },
  { hex: '#059669', en: 'green', zh: '綠色' },
  { hex: '#9333EA', en: 'purple', zh: '紫色' },
  { hex: '#E11D48', en: 'pink', zh: '粉紅色' },
];
const MATRIX_FILLS: readonly { fill: MatrixFill; en: string; zh: string }[] = [
  { fill: 'solid', en: 'solid', zh: '實心' },
  { fill: 'outline', en: 'hollow', zh: '空心' },
  { fill: 'striped', en: 'striped', zh: '條紋' },
];

const SHAPE_NAMES: Record<MatrixShape, { en: string; zh: string }> = {
  circle: { en: 'circle', zh: '圓形' },
  square: { en: 'square', zh: '正方形' },
  diamond: { en: 'diamond', zh: '菱形' },
  triangle: { en: 'triangle', zh: '三角形' },
  star4: { en: '4-point star', zh: '四角星' },
};

export function serializeMatrixCell(cell: MatrixCellSpec): string {
  return `${cell.shape}|${cell.color}|${cell.count}|${cell.fill}`;
}

export function generatePatternMatrixQuestion(seed: number): LogicQuestion {
  const rng = mulberry32(seed);
  const ruleKind = seed % 4;
  const shapes = shuffleWithRng(MATRIX_SHAPES, rng).slice(0, 3);
  const colors = shuffleWithRng(MATRIX_COLORS, rng).slice(0, 3);
  const fills = shuffleWithRng(MATRIX_FILLS, rng);

  const fullGrid: MatrixCellSpec[][] = Array.from({ length: 3 }, () => []);
  let explanationEn = '';
  let explanationZh = '';
  const distractorPool: MatrixCellSpec[] = [];

  if (ruleKind === 0) {
    // Latin square for BOTH shape (shift +1) and color (shift +2)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        fullGrid[r][c] = {
          shape: shapes[(r + c) % 3],
          color: colors[(r + 2 * c) % 3].hex,
          count: 1,
          fill: 'solid',
        };
      }
    }
    const ans = fullGrid[2][2];
    const ansColor = colors.find((c) => c.hex === ans.color)!;
    explanationEn = `Every row and column has all 3 shapes and all 3 colors once! The missing cell needs the ${ansColor.en} ${SHAPE_NAMES[ans.shape].en}.`;
    explanationZh = `每一橫列和每一直行都剛好有 3 種形狀和 3 種顏色各出現一次！缺漏格需要「${ansColor.zh}${SHAPE_NAMES[ans.shape].zh}」。`;
    distractorPool.push(
      { ...ans, shape: shapes[0] },
      { ...ans, color: colors[1].hex },
      { ...ans, shape: shapes[2], color: colors[2].hex },
      { ...ans, shape: shapes[1], color: colors[0].hex },
      { ...ans, fill: 'outline' },
    );
  } else if (ruleKind === 1) {
    // Row determines shape & color; Column determines count (1, 2, 3)
    const ascending = rng() < 0.7;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const count = (ascending ? c + 1 : 3 - c) as 1 | 2 | 3;
        fullGrid[r][c] = {
          shape: shapes[r],
          color: colors[r].hex,
          count,
          fill: 'solid',
        };
      }
    }
    const ans = fullGrid[2][2];
    explanationEn = ascending
      ? `Each row uses one shape & color, and each column counts 1 → 2 → 3! Row 3 needs 3 ${colors[2].en} ${SHAPE_NAMES[shapes[2]].en}s.`
      : `Each row uses one shape & color, and each column counts down 3 → 2 → 1! Row 3 needs 1 ${colors[2].en} ${SHAPE_NAMES[shapes[2]].en}.`;
    explanationZh = ascending
      ? `每一列固定一種形狀與顏色，從左到右數量依序是 1 → 2 → 3！第 3 列最後一格需要 3 個${colors[2].zh}${SHAPE_NAMES[shapes[2]].zh}。`
      : `每一列固定一種形狀與顏色，從左到右數量依序遞減 3 → 2 → 1！第 3 列最後一格需要 1 個${colors[2].zh}${SHAPE_NAMES[shapes[2]].zh}。`;
    distractorPool.push(
      { ...ans, count: 2 },
      { ...ans, shape: shapes[1] },
      { ...ans, color: colors[0].hex },
      { ...ans, count: (ans.count === 3 ? 1 : 3) as 1 | 2 | 3 },
      { ...ans, shape: shapes[0], color: colors[1].hex },
    );
  } else if (ruleKind === 2) {
    // Row determines shape; Column determines color + fill
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        fullGrid[r][c] = {
          shape: shapes[r],
          color: colors[c].hex,
          count: 1,
          fill: fills[c].fill,
        };
      }
    }
    const ans = fullGrid[2][2];
    explanationEn = `Row 3 always uses a ${SHAPE_NAMES[shapes[2]].en}, and Column 3 always uses ${fills[2].en} ${colors[2].en}!`;
    explanationZh = `第 3 橫列全部都是${SHAPE_NAMES[shapes[2]].zh}，而第 3 直行全部都是${fills[2].zh}${colors[2].zh}！`;
    distractorPool.push(
      { ...ans, fill: fills[0].fill },
      { ...ans, shape: shapes[1] },
      { ...ans, color: colors[1].hex },
      { ...ans, fill: fills[1].fill, color: colors[0].hex },
      { ...ans, shape: shapes[0], fill: fills[0].fill },
    );
  } else {
    // Latin square for shape, Row color, Column count (1 -> 2 -> 3)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        fullGrid[r][c] = {
          shape: shapes[(r + c) % 3],
          color: colors[r].hex,
          count: (c + 1) as 1 | 2 | 3,
          fill: 'solid',
        };
      }
    }
    const ans = fullGrid[2][2];
    explanationEn = `Row 3 is ${colors[2].en}, Column 3 has 3 icons, and each row/column uses all 3 shapes once — so the missing cell has 3 ${colors[2].en} ${SHAPE_NAMES[ans.shape].en}s!`;
    explanationZh = `第 3 列全是${colors[2].zh}、第 3 行都是 3 個圖案，且每列每行 3 種形狀不重複，所以缺漏格是 3 個${colors[2].zh}${SHAPE_NAMES[ans.shape].zh}！`;
    distractorPool.push(
      { ...ans, shape: shapes[0] },
      { ...ans, count: 2 },
      { ...ans, color: colors[1].hex },
      { ...ans, shape: shapes[2], count: 2 },
      { ...ans, count: 1 },
    );
  }

  const answerCell = fullGrid[2][2];
  const answerKey = serializeMatrixCell(answerCell);

  const uniqueDistractors: MatrixCellSpec[] = [];
  const seen = new Set<string>([answerKey]);
  for (const cand of distractorPool) {
    const k = serializeMatrixCell(cand);
    if (!seen.has(k)) {
      seen.add(k);
      uniqueDistractors.push(cand);
    }
    if (uniqueDistractors.length === 3) break;
  }

  // Fallback sweep if needed
  for (const s of shapes) {
    for (const col of colors) {
      for (const cnt of [1, 2, 3] as const) {
        if (uniqueDistractors.length >= 3) break;
        const cand: MatrixCellSpec = { shape: s, color: col.hex, count: cnt, fill: answerCell.fill };
        const k = serializeMatrixCell(cand);
        if (!seen.has(k)) {
          seen.add(k);
          uniqueDistractors.push(cand);
        }
      }
    }
  }

  const promptCells: (MatrixCellSpec | null)[][] = fullGrid.map((row, r) =>
    row.map((cell, c) => (r === 2 && c === 2 ? null : cell)),
  );

  const optionCells = shuffleWithRng([answerCell, ...uniqueDistractors.slice(0, 3)], rng);
  const correctIndex = optionCells.findIndex((c) => serializeMatrixCell(c) === answerKey);

  const choices: LogicChoice[] = optionCells.map((cell, idx) => ({
    id: `opt-${idx}`,
    visual: { kind: 'matrix-cell', cell },
  }));

  return {
    id: `mat-${seed}`,
    moduleId: 'pattern-matrix',
    promptEn: 'Study the row and column pattern! Which tile completes the "?" box?',
    promptZh: '觀察橫列與直行的圖形規律！「？」格應該填入哪一張圖卡？',
    promptVisual: {
      kind: 'pattern-matrix',
      size: 3,
      cells: promptCells,
      highlightMissing: true,
    },
    choices,
    correctIndex,
    explanationEn,
    explanationZh,
    feedbackVisual: {
      kind: 'pattern-matrix',
      size: 3,
      cells: promptCells,
      solvedCell: answerCell,
    },
  };
}

// ============================================================================
// MODULE 7: 3×3 LOGIC DEDUCTION GRID (邏輯推理網格 · 獨立 Constraint Solver)
// ============================================================================

const PERMS_3: readonly [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

/**
 * Independent exhaustive Constraint Solver across all 36 (3! × 3!) permutations.
 * Proves whether a set of clues yields exactly ONE unique solution.
 */
export function solve3x3LogicGrid(clues: readonly LogicClue[]): LogicGridSolutionRow[][] {
  const valid: LogicGridSolutionRow[][] = [];
  for (const permA of PERMS_3) {
    for (const permB of PERMS_3) {
      let ok = true;
      for (const clue of clues) {
        if (clue.kind === 'person-has-a') {
          const holds = permA[clue.personIdx] === clue.aIdx;
          if (clue.negated ? holds : !holds) {
            ok = false;
            break;
          }
        } else if (clue.kind === 'person-has-b') {
          const holds = permB[clue.personIdx] === clue.bIdx;
          if (clue.negated ? holds : !holds) {
            ok = false;
            break;
          }
        } else {
          // a-with-b: find the unique person p with permA[p] === clue.aIdx
          const p = permA.indexOf(clue.aIdx);
          const holds = permB[p] === clue.bIdx;
          if (clue.negated ? holds : !holds) {
            ok = false;
            break;
          }
        }
      }
      if (ok) {
        valid.push([
          { personIdx: 0, aIdx: permA[0], bIdx: permB[0] },
          { personIdx: 1, aIdx: permA[1], bIdx: permB[1] },
          { personIdx: 2, aIdx: permA[2], bIdx: permB[2] },
        ]);
      }
    }
  }
  return valid;
}

interface LogicGridTheme {
  people: LogicGridEntity[];
  attrA: LogicGridEntity[];
  attrB: LogicGridEntity[];
  attrATitleEn: string;
  attrATitleZh: string;
  attrBTitleEn: string;
  attrBTitleZh: string;
  verbAEn: string;
  verbANegEn: string;
  verbAZh: string;
  verbANegZh: string;
  verbBEn: string;
  verbBNegEn: string;
  verbBZh: string;
  verbBNegZh: string;
  holderAEn: (a: LogicGridEntity) => string;
  holderAZh: (a: LogicGridEntity) => string;
}

const LOGIC_GRID_THEMES: readonly LogicGridTheme[] = [
  {
    people: [
      { id: 'bunny', emoji: '🐰', labelEn: 'Bunny', labelZh: '小兔', colorHex: '#EC4899' },
      { id: 'fox', emoji: '🦊', labelEn: 'Fox', labelZh: '小狐狸', colorHex: '#EA580C' },
      { id: 'panda', emoji: '🐼', labelEn: 'Panda', labelZh: '熊貓', colorHex: '#0F172A' },
    ],
    attrA: [
      { id: 'red', emoji: '🔴', labelEn: 'Red Hat', labelZh: '紅帽', colorHex: '#DC2626' },
      { id: 'blue', emoji: '🔵', labelEn: 'Blue Hat', labelZh: '藍帽', colorHex: '#2563EB' },
      { id: 'gold', emoji: '🟡', labelEn: 'Yellow Hat', labelZh: '黃帽', colorHex: '#D97706' },
    ],
    attrB: [
      { id: 'berry', emoji: '🍓', labelEn: 'Berry', labelZh: '草莓', colorHex: '#E11D48' },
      { id: 'cake', emoji: '🧁', labelEn: 'Cupcake', labelZh: '蛋糕', colorHex: '#9333EA' },
      { id: 'cookie', emoji: '🍪', labelEn: 'Cookie', labelZh: '餅乾', colorHex: '#B45309' },
    ],
    attrATitleEn: 'Hat',
    attrATitleZh: '帽子',
    attrBTitleEn: 'Snack',
    attrBTitleZh: '點心',
    verbAEn: 'wears the',
    verbANegEn: 'does NOT wear the',
    verbAZh: '戴著',
    verbANegZh: '沒有戴',
    verbBEn: 'eats the',
    verbBNegEn: 'does NOT eat the',
    verbBZh: '吃',
    verbBNegZh: '不吃',
    holderAEn: (a) => `The friend in the ${a.emoji} ${a.labelEn}`,
    holderAZh: (a) => `戴著 ${a.emoji} ${a.labelZh} 的朋友`,
  },
  {
    people: [
      { id: 'cat', emoji: '🐱', labelEn: 'Mimi', labelZh: '咪咪貓', colorHex: '#D97706' },
      { id: 'dog', emoji: '🐶', labelEn: 'Bobo', labelZh: '波波狗', colorHex: '#2563EB' },
      { id: 'owl', emoji: '🦉', labelEn: 'Ollie', labelZh: '歐力鴞', colorHex: '#7C3AED' },
    ],
    attrA: [
      { id: 'art', emoji: '🎨', labelEn: 'Art Club', labelZh: '美術社', colorHex: '#DB2777' },
      { id: 'music', emoji: '🎵', labelEn: 'Music Club', labelZh: '音樂社', colorHex: '#2563EB' },
      { id: 'sci', emoji: '🔬', labelEn: 'Science Club', labelZh: '科學社', colorHex: '#059669' },
    ],
    attrB: [
      { id: 'boba', emoji: '🧋', labelEn: 'Boba Tea', labelZh: '珍奶', colorHex: '#92400E' },
      { id: 'juice', emoji: '🍊', labelEn: 'Juice', labelZh: '果汁', colorHex: '#EA580C' },
      { id: 'milk', emoji: '🥛', labelEn: 'Milk', labelZh: '牛奶', colorHex: '#0284C7' },
    ],
    attrATitleEn: 'Club',
    attrATitleZh: '社團',
    attrBTitleEn: 'Drink',
    attrBTitleZh: '飲料',
    verbAEn: 'joins the',
    verbANegEn: 'is NOT in the',
    verbAZh: '參加',
    verbANegZh: '沒有參加',
    verbBEn: 'drinks',
    verbBNegEn: 'does NOT drink',
    verbBZh: '喝',
    verbBNegZh: '不喝',
    holderAEn: (a) => `The student in ${a.emoji} ${a.labelEn}`,
    holderAZh: (a) => `參加 ${a.emoji} ${a.labelZh} 的同學`,
  },
  {
    people: [
      { id: 'bear', emoji: '🐻', labelEn: 'Bear', labelZh: '小熊', colorHex: '#92400E' },
      { id: 'frog', emoji: '🐸', labelEn: 'Frog', labelZh: '青蛙', colorHex: '#16A34A' },
      { id: 'chick', emoji: '🐥', labelEn: 'Chick', labelZh: '小雞', colorHex: '#D97706' },
    ],
    attrA: [
      { id: 'sun', emoji: '☀️', labelEn: 'Sun Badge', labelZh: '太陽徽章', colorHex: '#EA580C' },
      { id: 'moon', emoji: '🌙', labelEn: 'Moon Badge', labelZh: '月亮徽章', colorHex: '#4F46E5' },
      { id: 'star', emoji: '⭐', labelEn: 'Star Badge', labelZh: '星星徽章', colorHex: '#CA8A04' },
    ],
    attrB: [
      { id: 'train', emoji: '🚆', labelEn: 'Train', labelZh: '火車', colorHex: '#2563EB' },
      { id: 'boat', emoji: '⛵', labelEn: 'Boat', labelZh: '小船', colorHex: '#DB2777' },
      { id: 'bus', emoji: '🚌', labelEn: 'Bus', labelZh: '公車', colorHex: '#059669' },
    ],
    attrATitleEn: 'Badge',
    attrATitleZh: '徽章',
    attrBTitleEn: 'Ride',
    attrBTitleZh: '交通',
    verbAEn: 'has the',
    verbANegEn: 'does NOT have the',
    verbAZh: '擁有',
    verbANegZh: '沒有',
    verbBEn: 'takes the',
    verbBNegEn: 'does NOT take the',
    verbBZh: '搭乘',
    verbBNegZh: '不搭',
    holderAEn: (a) => `The camper with the ${a.emoji} ${a.labelEn}`,
    holderAZh: (a) => `擁有 ${a.emoji} ${a.labelZh} 的營友`,
  },
];

function formatClue(clue: LogicClue, theme: LogicGridTheme): { en: string; zh: string } {
  if (clue.kind === 'person-has-a') {
    const p = theme.people[clue.personIdx];
    const a = theme.attrA[clue.aIdx];
    return {
      en: `${p.emoji} ${p.labelEn} ${clue.negated ? theme.verbANegEn : theme.verbAEn} ${a.emoji} ${a.labelEn}.`,
      zh: `${p.emoji} ${p.labelZh}${clue.negated ? theme.verbANegZh : theme.verbAZh} ${a.emoji} ${a.labelZh}。`,
    };
  }
  if (clue.kind === 'person-has-b') {
    const p = theme.people[clue.personIdx];
    const b = theme.attrB[clue.bIdx];
    return {
      en: `${p.emoji} ${p.labelEn} ${clue.negated ? theme.verbBNegEn : theme.verbBEn} ${b.emoji} ${b.labelEn}.`,
      zh: `${p.emoji} ${p.labelZh}${clue.negated ? theme.verbBNegZh : theme.verbBZh} ${b.emoji} ${b.labelZh}。`,
    };
  }
  const a = theme.attrA[clue.aIdx];
  const b = theme.attrB[clue.bIdx];
  return {
    en: `${theme.holderAEn(a)} ${clue.negated ? theme.verbBNegEn : theme.verbBEn} ${b.emoji} ${b.labelEn}.`,
    zh: `${theme.holderAZh(a)}${clue.negated ? theme.verbBNegZh : theme.verbBZh} ${b.emoji} ${b.labelZh}。`,
  };
}

export function generateLogicGridQuestion(seed: number): LogicQuestion {
  const rng = mulberry32(seed);
  const theme = LOGIC_GRID_THEMES[Math.floor(rng() * LOGIC_GRID_THEMES.length)];
  const trueA = PERMS_3[Math.floor(rng() * PERMS_3.length)];
  const trueB = PERMS_3[Math.floor(rng() * PERMS_3.length)];

  // Pick a target person to ask about (we will make sure their pair is NOT directly given away)
  const targetP = Math.floor(rng() * 3);
  const otherPs = [0, 1, 2].filter((p) => p !== targetP);
  const p1 = otherPs[0];
  const p2 = otherPs[1];

  // Build strictly minimal 4-clue templates (every clue is necessary, zero redundant clues,
  // and targetP's pair is never directly given away by positive clues alone)
  const cluePatterns: LogicClue[][] = [
    // Pattern 0: p1 has A, targetP does NOT have p2's A -> pins all A; link targetP's A with targetP's B; p1 does NOT have p2's B -> pins all B
    [
      { kind: 'person-has-a', personIdx: p1, aIdx: trueA[p1], negated: false },
      { kind: 'person-has-a', personIdx: targetP, aIdx: trueA[p2], negated: true },
      { kind: 'a-with-b', aIdx: trueA[targetP], bIdx: trueB[targetP], negated: false },
      { kind: 'person-has-b', personIdx: p1, bIdx: trueB[p2], negated: true },
    ],
    // Pattern 1: p2 has A, p1 does NOT have targetP's A -> pins all A; link p1's A with p1's B; p2's A does NOT have targetP's B -> pins all B
    [
      { kind: 'person-has-a', personIdx: p2, aIdx: trueA[p2], negated: false },
      { kind: 'person-has-a', personIdx: p1, aIdx: trueA[targetP], negated: true },
      { kind: 'a-with-b', aIdx: trueA[p1], bIdx: trueB[p1], negated: false },
      { kind: 'a-with-b', aIdx: trueA[p2], bIdx: trueB[targetP], negated: true },
    ],
    // Pattern 2: Pure elimination + cross-links (4 clues)
    [
      { kind: 'person-has-a', personIdx: p1, aIdx: trueA[p1], negated: false },
      { kind: 'person-has-a', personIdx: p2, aIdx: trueA[targetP], negated: true },
      { kind: 'a-with-b', aIdx: trueA[targetP], bIdx: trueB[targetP], negated: false },
      { kind: 'a-with-b', aIdx: trueA[p1], bIdx: trueB[p1], negated: false },
    ],
    // Pattern 3: 4 clues with negation on cross-link + person-has-b
    [
      { kind: 'person-has-a', personIdx: p2, aIdx: trueA[p2], negated: false },
      { kind: 'person-has-a', personIdx: targetP, aIdx: trueA[p1], negated: true },
      { kind: 'person-has-b', personIdx: p1, bIdx: trueB[p1], negated: false },
      { kind: 'a-with-b', aIdx: trueA[p2], bIdx: trueB[targetP], negated: true },
    ],
  ];

  const chosenTemplate = cluePatterns[Math.floor(rng() * cluePatterns.length)];
  const clues = shuffleWithRng(chosenTemplate, rng);

  // INDEPENDENT SOLVER PROOF: must have validSolutions.length === 1
  const solutions = solve3x3LogicGrid(clues);
  if (solutions.length !== 1) {
    throw new Error(`Logic grid solver failed uniqueness (count=${solutions.length}) on seed ${seed}`);
  }
  const uniqueSol = solutions[0];
  const targetSol = uniqueSol.find((row) => row.personIdx === targetP)!;
  if (targetSol.aIdx !== trueA[targetP] || targetSol.bIdx !== trueB[targetP]) {
    throw new Error(`Logic grid solution mismatch on seed ${seed}`);
  }

  const formatted = clues.map((c) => formatClue(c, theme));
  const targetPerson = theme.people[targetP];
  const correctPair = { aIdx: targetSol.aIdx, bIdx: targetSol.bIdx };

  // Build 4 distinct (attrA, attrB) pairs
  const wrongPairs: { aIdx: number; bIdx: number }[] = [
    { aIdx: targetSol.aIdx, bIdx: trueB[p1] },
    { aIdx: trueA[p1], bIdx: targetSol.bIdx },
    { aIdx: trueA[p2], bIdx: trueB[p2] },
    { aIdx: trueA[p1], bIdx: trueB[p1] },
    { aIdx: targetSol.aIdx, bIdx: trueB[p2] },
    { aIdx: trueA[p2], bIdx: targetSol.bIdx },
  ];
  const chosenPairs: { aIdx: number; bIdx: number }[] = [correctPair];
  const pairKeys = new Set<string>([`${correctPair.aIdx}-${correctPair.bIdx}`]);
  for (const wp of shuffleWithRng(wrongPairs, rng)) {
    const k = `${wp.aIdx}-${wp.bIdx}`;
    if (!pairKeys.has(k)) {
      pairKeys.add(k);
      chosenPairs.push(wp);
    }
    if (chosenPairs.length === 4) break;
  }

  const shuffledPairs = shuffleWithRng(chosenPairs, rng);
  const correctIndex = shuffledPairs.findIndex(
    (p) => p.aIdx === correctPair.aIdx && p.bIdx === correctPair.bIdx,
  );

  const choices: LogicChoice[] = shuffledPairs.map((pair, idx) => {
    const ea = theme.attrA[pair.aIdx];
    const eb = theme.attrB[pair.bIdx];
    return {
      id: `opt-${idx}`,
      labelEn: `${ea.emoji} ${ea.labelEn} + ${eb.emoji} ${eb.labelEn}`,
      labelZh: `${ea.emoji} ${ea.labelZh} ＋ ${eb.emoji} ${eb.labelZh}`,
    };
  });

  const solSummaryEn = uniqueSol
    .map((row) => {
      const p = theme.people[row.personIdx];
      const a = theme.attrA[row.aIdx];
      const b = theme.attrB[row.bIdx];
      return `${p.emoji} ${p.labelEn}: ${a.emoji} ${a.labelEn} & ${b.emoji} ${b.labelEn}`;
    })
    .join(' · ');
  const solSummaryZh = uniqueSol
    .map((row) => {
      const p = theme.people[row.personIdx];
      const a = theme.attrA[row.aIdx];
      const b = theme.attrB[row.bIdx];
      return `${p.emoji}${p.labelZh}＝${a.emoji}${a.labelZh}＋${b.emoji}${b.labelZh}`;
    })
    .join('；');

  return {
    id: `grid-${seed}`,
    moduleId: 'logic-grid',
    promptEn: `Use the clues to match every friend! Which pair belongs to ${targetPerson.emoji} ${targetPerson.labelEn}?`,
    promptZh: `根據線索找出唯一配對！請問 ${targetPerson.emoji} ${targetPerson.labelZh} 的組合是哪一項？`,
    promptVisual: {
      kind: 'logic-grid',
      people: theme.people,
      attrA: theme.attrA,
      attrB: theme.attrB,
      attrATitleEn: theme.attrATitleEn,
      attrATitleZh: theme.attrATitleZh,
      attrBTitleEn: theme.attrBTitleEn,
      attrBTitleZh: theme.attrBTitleZh,
      cluesEn: formatted.map((f) => f.en),
      cluesZh: formatted.map((f) => f.zh),
    },
    choices,
    correctIndex,
    explanationEn: `Unique deduction: ${solSummaryEn}.`,
    explanationZh: `唯一推論結果：${solSummaryZh}。`,
    feedbackVisual: {
      kind: 'logic-grid',
      people: theme.people,
      attrA: theme.attrA,
      attrB: theme.attrB,
      attrATitleEn: theme.attrATitleEn,
      attrATitleZh: theme.attrATitleZh,
      attrBTitleEn: theme.attrBTitleEn,
      attrBTitleZh: theme.attrBTitleZh,
      cluesEn: formatted.map((f) => f.en),
      cluesZh: formatted.map((f) => f.zh),
      solution: uniqueSol,
    },
  };
}

// ============================================================================
// MODULE 8: 5×5 ROBOT BLOCK CODING (機器人積木解謎 · 狀態機模擬器)
// ============================================================================

const DIR_ORDER: readonly RobotDir[] = ['N', 'E', 'S', 'W'];
const DIR_DELTA: Record<RobotDir, { dr: number; dc: number }> = {
  N: { dr: -1, dc: 0 },
  E: { dr: 0, dc: 1 },
  S: { dr: 1, dc: 0 },
  W: { dr: 0, dc: -1 },
};

export interface RobotSimResult {
  crashed: boolean;
  end: { r: number; c: number; dir: RobotDir };
  trail: { r: number; c: number }[];
}

export function simulateRobotProgram(
  size: number,
  start: { r: number; c: number; dir: RobotDir },
  obstacles: readonly { r: number; c: number }[],
  program: readonly RobotCmd[],
): RobotSimResult {
  const obsSet = new Set(obstacles.map((o) => `${o.r},${o.c}`));
  let r = start.r;
  let c = start.c;
  let dirIdx = DIR_ORDER.indexOf(start.dir);
  const trail: { r: number; c: number }[] = [{ r, c }];

  for (const cmd of program) {
    if (cmd === 'LEFT') {
      dirIdx = (dirIdx + 3) % 4;
    } else if (cmd === 'RIGHT') {
      dirIdx = (dirIdx + 1) % 4;
    } else {
      const steps = cmd === 'LOOP2_FWD' ? 2 : 1;
      const { dr, dc } = DIR_DELTA[DIR_ORDER[dirIdx]];
      for (let s = 0; s < steps; s++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size || obsSet.has(`${nr},${nc}`)) {
          return { crashed: true, end: { r, c, dir: DIR_ORDER[dirIdx] }, trail };
        }
        r = nr;
        c = nc;
        trail.push({ r, c });
      }
    }
  }

  return { crashed: false, end: { r, c, dir: DIR_ORDER[dirIdx] }, trail };
}

export function formatRobotCmd(cmd: RobotCmd, isZh: boolean): string {
  switch (cmd) {
    case 'FWD':
      return isZh ? '⬆️ 前進' : '⬆️ FWD';
    case 'LOOP2_FWD':
      return isZh ? '🔁×2 前進' : '🔁×2 FWD';
    case 'LEFT':
      return isZh ? '↩️ 左轉' : '↩️ LEFT';
    case 'RIGHT':
      return isZh ? '↪️ 右轉' : '↪️ RIGHT';
  }
}

function formatProgramLine(program: readonly RobotCmd[], isZh: boolean): string {
  return program.map((c) => formatRobotCmd(c, isZh)).join(' → ');
}

function buildRandomValidRobotPath(rng: () => number): {
  start: { r: number; c: number; dir: RobotDir };
  obstacles: { r: number; c: number }[];
  program: RobotCmd[];
  sim: RobotSimResult;
} {
  const size = 5;
  for (let attempt = 0; attempt < 200; attempt++) {
    const start: { r: number; c: number; dir: RobotDir } = {
      r: randInt(rng, 1, 3),
      c: randInt(rng, 1, 3),
      dir: DIR_ORDER[Math.floor(rng() * 4)],
    };

    // Build an L-shaped or Z-shaped 4-to-5 command path with at least one turn and one LOOP2_FWD
    const leg1: RobotCmd = rng() < 0.65 ? 'LOOP2_FWD' : 'FWD';
    const turn1: RobotCmd = rng() < 0.5 ? 'LEFT' : 'RIGHT';
    const leg2: RobotCmd = leg1 === 'LOOP2_FWD' ? (rng() < 0.5 ? 'FWD' : 'LOOP2_FWD') : 'LOOP2_FWD';
    const addThirdLeg = rng() < 0.55;
    const turn2: RobotCmd = rng() < 0.5 ? 'LEFT' : 'RIGHT';
    const leg3: RobotCmd = 'FWD';

    const program: RobotCmd[] = addThirdLeg
      ? [leg1, turn1, leg2, turn2, leg3]
      : [leg1, turn1, leg2];

    const sim = simulateRobotProgram(size, start, [], program);
    if (sim.crashed) continue;
    if (sim.end.r === start.r && sim.end.c === start.c) continue;
    // Require path to visit at least 4 distinct cells so it feels substantial
    const visitedKeys = new Set(sim.trail.map((p) => `${p.r},${p.c}`));
    if (visitedKeys.size < 4) continue;

    // Place 4 obstacles on non-visited cells
    const freeCells: { r: number; c: number }[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!visitedKeys.has(`${r},${c}`)) {
          freeCells.push({ r, c });
        }
      }
    }
    if (freeCells.length < 7) continue; // need room for obstacles + candidate flags
    const obstacles = shuffleWithRng(freeCells, rng).slice(0, 4);
    const verified = simulateRobotProgram(size, start, obstacles, program);
    if (!verified.crashed && verified.end.r === sim.end.r && verified.end.c === sim.end.c) {
      return { start, obstacles, program, sim: verified };
    }
  }

  // Deterministic guaranteed fallback
  const start: { r: number; c: number; dir: RobotDir } = { r: 3, c: 1, dir: 'N' };
  const program: RobotCmd[] = ['LOOP2_FWD', 'RIGHT', 'LOOP2_FWD'];
  const obstacles = [
    { r: 0, c: 0 },
    { r: 2, c: 2 },
    { r: 4, c: 4 },
    { r: 3, c: 3 },
  ];
  const sim = simulateRobotProgram(5, start, obstacles, program);
  return { start, obstacles, program, sim };
}

const FLAG_META: readonly { badge: 'A' | 'B' | 'C' | 'D'; color: string }[] = [
  { badge: 'A', color: '#2563EB' },
  { badge: 'B', color: '#059669' },
  { badge: 'C', color: '#D97706' },
  { badge: 'D', color: '#DB2777' },
];

export function generateRobotCodingQuestion(seed: number): LogicQuestion {
  const rng = mulberry32(seed);
  const mode: 'find-destination' | 'pick-program' = seed % 2 === 0 ? 'find-destination' : 'pick-program';
  const { start, obstacles, program, sim } = buildRandomValidRobotPath(rng);
  const obsSet = new Set(obstacles.map((o) => `${o.r},${o.c}`));

  if (mode === 'find-destination') {
    // Generate 3 distinct decoy flag cells (prefer plausible wrong-turn endpoints!)
    const candidateCoords: { r: number; c: number }[] = [];
    const flippedTurns: RobotCmd[][] = [
      program.map((cmd) => (cmd === 'LEFT' ? 'RIGHT' : cmd === 'RIGHT' ? 'LEFT' : cmd)),
      program.map((cmd) => (cmd === 'LOOP2_FWD' ? 'FWD' : cmd)),
      [...program.slice(0, -1)],
    ];
    for (const alt of flippedTurns) {
      const altSim = simulateRobotProgram(5, start, obstacles, alt);
      if (!altSim.crashed) {
        candidateCoords.push({ r: altSim.end.r, c: altSim.end.c });
      }
    }
    // Add all other open non-start non-end cells as backup
    const allOpen: { r: number; c: number }[] = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const key = `${r},${c}`;
        if (!obsSet.has(key)) allOpen.push({ r, c });
      }
    }
    candidateCoords.push(...shuffleWithRng(allOpen, rng));

    const endKey = `${sim.end.r},${sim.end.c}`;
    const startKey = `${start.r},${start.c}`;
    const decoys: { r: number; c: number }[] = [];
    const used = new Set<string>([endKey, startKey]);
    for (const pt of candidateCoords) {
      const k = `${pt.r},${pt.c}`;
      if (!used.has(k) && !obsSet.has(k)) {
        used.add(k);
        decoys.push(pt);
      }
      if (decoys.length === 3) break;
    }

    const flagCoords = shuffleWithRng([{ r: sim.end.r, c: sim.end.c }, ...decoys], rng);
    const correctIndex = flagCoords.findIndex((p) => p.r === sim.end.r && p.c === sim.end.c);
    const flags: RobotFlagMarker[] = flagCoords.map((pt, idx) => ({
      badge: FLAG_META[idx].badge,
      color: FLAG_META[idx].color,
      r: pt.r,
      c: pt.c,
    }));

    const choices: LogicChoice[] = flags.map((fl, idx) => ({
      id: `opt-${idx}`,
      labelEn: `Flag ${fl.badge}`,
      labelZh: `旗子 ${fl.badge}`,
    }));

    return {
      id: `robo-dest-${seed}`,
      moduleId: 'robot-coding',
      promptEn: 'Trace the Robot’s code blocks step by step! Which flag will it land on?',
      promptZh: '照著下方機器人的積木指令一步一步走，最後會停在哪一支旗子？',
      promptVisual: {
        kind: 'robot-grid',
        size: 5,
        start,
        obstacles,
        flags,
        program,
      },
      choices,
      correctIndex,
      explanationEn: `Following ${formatProgramLine(program, false)} without hitting obstacles brings the robot straight to Flag ${flags[correctIndex].badge}!`,
      explanationZh: `依序執行「${formatProgramLine(program, true)}」，避開石頭障礙後剛好停在旗子 ${flags[correctIndex].badge}！`,
      feedbackVisual: {
        kind: 'robot-grid',
        size: 5,
        start,
        obstacles,
        flags,
        program,
        trail: sim.trail,
        highlightEnd: { r: sim.end.r, c: sim.end.c },
      },
    };
  }

  // Mode B: pick-program (Which block sequence safely reaches the ⭐ Star?)
  const star = { r: sim.end.r, c: sim.end.c };
  const correctSig = program.join('|');
  const distractorCandidates: RobotCmd[][] = [
    program.map((c) => (c === 'LEFT' ? 'RIGHT' : c === 'RIGHT' ? 'LEFT' : c)),
    program.map((c, idx) => (idx === 0 ? (c === 'LOOP2_FWD' ? 'FWD' : 'LOOP2_FWD') : c)),
    program.map((c, idx) => (idx === program.length - 1 ? (c === 'LOOP2_FWD' ? 'FWD' : 'LOOP2_FWD') : c)),
    [...program].reverse(),
    ['LEFT', ...program.slice(0, -1)],
    ['RIGHT', ...program.slice(0, -1)],
    [...program.slice(0, -1), 'FWD'],
    [...program.slice(0, -1), 'LOOP2_FWD'],
    ['FWD', 'LEFT', 'LOOP2_FWD'],
    ['FWD', 'RIGHT', 'LOOP2_FWD'],
    ['LOOP2_FWD', 'LEFT', 'FWD'],
    ['LOOP2_FWD', 'RIGHT', 'FWD'],
  ];

  const distractors: RobotCmd[][] = [];
  const seenSigs = new Set<string>([correctSig]);
  const passesOrLandsOnStar = (simRes: RobotSimResult) =>
    simRes.trail.some((pt) => pt.r === star.r && pt.c === star.c);

  for (const cand of shuffleWithRng(distractorCandidates, rng)) {
    const sig = cand.join('|');
    if (seenSigs.has(sig)) continue;
    const testSim = simulateRobotProgram(5, start, obstacles, cand);
    if (!passesOrLandsOnStar(testSim)) {
      seenSigs.add(sig);
      distractors.push(cand);
    }
    if (distractors.length === 3) break;
  }

  // Deterministic guarantee of 3 non-winning, non-pass-through distractors
  const fallbackPool: RobotCmd[][] = [
    ['FWD', 'FWD'],
    ['LEFT', 'FWD', 'FWD'],
    ['RIGHT', 'FWD', 'FWD'],
    ['LEFT', 'LEFT', 'FWD'],
    ['FWD', 'LEFT', 'FWD'],
    ['FWD', 'RIGHT', 'FWD'],
    ['LEFT', 'LOOP2_FWD'],
    ['RIGHT', 'LOOP2_FWD'],
    ['LEFT', 'LEFT', 'LOOP2_FWD'],
  ];
  for (const fb of fallbackPool) {
    if (distractors.length >= 3) break;
    const sig = fb.join('|');
    if (seenSigs.has(sig)) continue;
    const testSim = simulateRobotProgram(5, start, obstacles, fb);
    if (!passesOrLandsOnStar(testSim)) {
      seenSigs.add(sig);
      distractors.push(fb);
    }
  }
  // Second-tier fallback (in the rare case all fallbacks touch star, still guarantee non-landing)
  for (const fb of fallbackPool) {
    if (distractors.length >= 3) break;
    const sig = fb.join('|');
    if (seenSigs.has(sig)) continue;
    const testSim = simulateRobotProgram(5, start, obstacles, fb);
    if (testSim.crashed || testSim.end.r !== star.r || testSim.end.c !== star.c) {
      seenSigs.add(sig);
      distractors.push(fb);
    }
  }

  const allPrograms = shuffleWithRng([program, ...distractors.slice(0, 3)], rng);
  const correctIndex = allPrograms.findIndex((p) => p.join('|') === correctSig);
  const choices: LogicChoice[] = allPrograms.map((prog, idx) => ({
    id: `opt-${idx}`,
    labelEn: formatProgramLine(prog, false),
    labelZh: formatProgramLine(prog, true),
  }));

  return {
    id: `robo-prog-${seed}`,
    moduleId: 'robot-coding',
    promptEn: 'Which code sequence guides the Robot to land right on the ⭐ Star without hitting rocks?',
    promptZh: '哪一組積木指令能讓機器人避開石頭，最後剛好停在 ⭐ 星星上？',
    promptVisual: {
      kind: 'robot-grid',
      size: 5,
      start,
      obstacles,
      star,
    },
    choices,
    correctIndex,
    explanationEn: `Only "${formatProgramLine(program, false)}" avoids all rocks and lands right on the ⭐ Star!`,
    explanationZh: `只有「${formatProgramLine(program, true)}」能避開石頭並準確停在 ⭐ 星星上！`,
    feedbackVisual: {
      kind: 'robot-grid',
      size: 5,
      start,
      obstacles,
      star,
      program,
      trail: sim.trail,
      highlightEnd: star,
    },
  };
}

// ============================================================================
// SESSION BUILDER
// ============================================================================

export function generateLogicReasoningQuestion(
  moduleId: LogicReasoningModuleId,
  seed: number,
): LogicQuestion {
  switch (moduleId) {
    case 'balance-scale':
      return generateBalanceScaleQuestion(seed);
    case 'pattern-matrix':
      return generatePatternMatrixQuestion(seed);
    case 'logic-grid':
      return generateLogicGridQuestion(seed);
    case 'robot-coding':
      return generateRobotCodingQuestion(seed);
  }
}

export function buildLogicReasoningSession(
  moduleId: LogicReasoningModuleId,
  baseSeed: number,
  count = 5,
): LogicQuestion[] {
  const qs: LogicQuestion[] = [];
  const seen = new Set<string>();
  let offset = 0;
  while (qs.length < count && offset < count * 12) {
    const seed = Math.abs((baseSeed + offset * 9973) | 0) + 1;
    offset++;
    const q = generateLogicReasoningQuestion(moduleId, seed);
    const sig = `${q.promptEn}|${JSON.stringify(q.promptVisual)}`;
    if (seen.has(sig)) continue;
    seen.add(sig);
    qs.push(q);
  }
  return qs;
}

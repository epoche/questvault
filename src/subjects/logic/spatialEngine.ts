import type {
  FoldAxis,
  FoldHole,
  LogicChoice,
  LogicQuestion,
  NetCell,
  PatternTile,
  SpatialModuleId,
  TileShape,
} from './logicTypes';

// ────────────────────────────────────────────────────────────
// Deterministic Seeded PRNG (mulberry32)
// ────────────────────────────────────────────────────────────

export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffle<T>(rng: () => number, arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ────────────────────────────────────────────────────────────
// 1. ROTATION & MIRROR FLIP ENGINE (2D Matrix Transformations)
// ────────────────────────────────────────────────────────────

export type GridTransformId = 'rot90' | 'rot180' | 'rot270' | 'flipH' | 'flipV';

export function transformGrid<T>(grid: readonly (readonly T[])[], op: GridTransformId): T[][] {
  const n = grid.length;
  const out: T[][] = Array.from({ length: n }, () => Array<T>(n));
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      const val = grid[r][c];
      if (op === 'rot90') {
        out[c][n - 1 - r] = val;
      } else if (op === 'rot180') {
        out[n - 1 - r][n - 1 - c] = val;
      } else if (op === 'rot270') {
        out[n - 1 - c][r] = val;
      } else if (op === 'flipH') {
        out[r][n - 1 - c] = val;
      } else {
        out[n - 1 - r][c] = val;
      }
    }
  }
  return out;
}

export function serializePatternGrid(grid: readonly (readonly (PatternTile | null)[])[]): string {
  return grid
    .map((row) => row.map((cell) => (cell ? `${cell.shape}:${cell.color}` : '.')).join(','))
    .join('|');
}

const TILE_PALETTE: readonly { shape: TileShape; color: string }[] = [
  { shape: 'star4', color: '#F59E0B' },
  { shape: 'circle', color: '#EC4899' },
  { shape: 'square', color: '#2563EB' },
  { shape: 'plus', color: '#10B981' },
  { shape: 'diamond', color: '#8B5CF6' },
];

const TRANSFORM_META: Record<
  GridTransformId,
  {
    promptEn: string;
    promptZh: string;
    explainEn: string;
    explainZh: string;
    mirrorAxis?: FoldAxis;
  }
> = {
  rot90: {
    promptEn: 'Rotate this 3×3 pattern 90° CLOCKWISE (a quarter turn right). Which grid matches?',
    promptZh: '把這個 3×3 圖案「順時針旋轉 90°（向右轉 1/4 圈）」，會變成哪一個？',
    explainEn: 'Turning 90° clockwise moves the top row into the right column!',
    explainZh: '順時針轉 90° 時，原本「最上面那排」會轉到「最右邊那欄」！',
  },
  rot180: {
    promptEn: 'Rotate this 3×3 pattern 180° (a half turn upside-down). Which grid matches?',
    promptZh: '把這個 3×3 圖案「旋轉 180°（上下顛倒轉半圈）」，會變成哪一個？',
    explainEn: 'A 180° half-turn moves the top-left corner to the bottom-right corner!',
    explainZh: '旋轉 180°（半圈）會把「左上角」轉到「右下角」，整個圖案倒過來！',
  },
  rot270: {
    promptEn: 'Rotate this 3×3 pattern 90° COUNTER-CLOCKWISE (a quarter turn left). Which grid matches?',
    promptZh: '把這個 3×3 圖案「逆時針旋轉 90°（向左轉 1/4 圈）」，會變成哪一個？',
    explainEn: 'Turning 90° counter-clockwise moves the top row into the left column!',
    explainZh: '逆時針轉 90° 時，原本「最上面那排」會轉到「最左邊那欄」！',
  },
  flipH: {
    promptEn: 'Flip this 3×3 pattern LEFT-TO-RIGHT across a vertical mirror. Which grid matches?',
    promptZh: '沿著中間的「垂直鏡子」左右鏡像翻轉，會變成哪一個圖案？',
    explainEn: 'A left-right mirror swaps the left and right columns while keeping each row at the same height!',
    explainZh: '左右鏡像會把「最左欄與最右欄」互換，每一排的上下高度保持不變！',
    mirrorAxis: 'vertical',
  },
  flipV: {
    promptEn: 'Flip this 3×3 pattern TOP-TO-BOTTOM across a horizontal mirror. Which grid matches?',
    promptZh: '沿著中間的「水平鏡子」上下鏡像翻轉，會變成哪一個圖案？',
    explainEn: 'A top-bottom mirror swaps the top and bottom rows while keeping left and right the same!',
    explainZh: '上下鏡像會把「最上排與最下排」互換，左右位置保持不變！',
    mirrorAxis: 'horizontal',
  },
};

const ALL_GRID_OPS: readonly GridTransformId[] = ['rot90', 'rot180', 'rot270', 'flipH', 'flipV'];

function generateAsymmetricGrid(rng: () => number): (PatternTile | null)[][] {
  // Choose 4 distinct asymmetric coordinates & distinct tiles so all D4 transforms are strictly distinct
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const grid: (PatternTile | null)[][] = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    const coords = shuffle(rng, [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]).slice(0, 4);
    const tiles = shuffle(rng, TILE_PALETTE).slice(0, 4);
    coords.forEach(([r, c], idx) => {
      grid[r][c] = tiles[idx];
    });

    const sigs = new Set<string>([serializePatternGrid(grid)]);
    for (const op of ALL_GRID_OPS) {
      sigs.add(serializePatternGrid(transformGrid(grid, op)));
    }
    // Original + 5 transforms must ALL be pairwise distinct (6 distinct patterns!)
    if (sigs.size === 6) {
      return grid;
    }
  }
  // Guaranteed asymmetric fallback
  return [
    [TILE_PALETTE[0], TILE_PALETTE[1], null],
    [null, null, TILE_PALETTE[2]],
    [null, TILE_PALETTE[3], null],
  ];
}

export function generateRotationMirrorQuestion(seed: number): LogicQuestion {
  const rng = createSeededRng(seed);
  const baseGrid = generateAsymmetricGrid(rng);
  const targetOp = pick(rng, ALL_GRID_OPS);
  const meta = TRANSFORM_META[targetOp];

  const correctGrid = transformGrid(baseGrid, targetOp);
  const correctSig = serializePatternGrid(correctGrid);

  const distractorCandidates = shuffle(
    rng,
    ALL_GRID_OPS.filter((op) => op !== targetOp).map((op) => transformGrid(baseGrid, op)),
  );
  const distractorGrids: (PatternTile | null)[][][] = [];
  const used = new Set<string>([correctSig]);

  for (const cand of distractorCandidates) {
    const sig = serializePatternGrid(cand);
    if (!used.has(sig)) {
      used.add(sig);
      distractorGrids.push(cand);
      if (distractorGrids.length === 3) break;
    }
  }

  const allOptions = shuffle(rng, [
    { grid: correctGrid, isCorrect: true },
    ...distractorGrids.map((g) => ({ grid: g, isCorrect: false })),
  ]);
  const correctIndex = allOptions.findIndex((o) => o.isCorrect);

  return {
    id: `logic-rot-${seed}`,
    moduleId: 'rotation-mirror',
    promptEn: meta.promptEn,
    promptZh: meta.promptZh,
    promptVisual: {
      kind: 'pattern-grid',
      size: 3,
      cells: baseGrid,
      mirrorAxis: meta.mirrorAxis,
    },
    choices: allOptions.map((o, idx) => ({
      id: `opt-${idx}`,
      visual: {
        kind: 'pattern-grid',
        size: 3,
        cells: o.grid,
      },
    })),
    correctIndex,
    explanationEn: meta.explainEn,
    explanationZh: meta.explainZh,
    feedbackVisual: {
      kind: 'pattern-grid',
      size: 3,
      cells: correctGrid,
      mirrorAxis: meta.mirrorAxis,
    },
  };
}

// ────────────────────────────────────────────────────────────
// 2. 3D ISOMETRIC CUBES & TOP VIEW ENGINE (Visibility-Verified)
// ────────────────────────────────────────────────────────────

/**
 * Checks the strict Isometric Visibility Invariant for a 3×3 height matrix:
 * 1. Gravity-supported integers in 0..3.
 * 2. Non-increasing along viewer-frontward axes (+r and +c), guaranteeing
 *    NO taller column in front ever hides a shorter column or empty cell behind it!
 * 3. Every cell with height === 0 has no taller/blocking cube along its isometric sightline
 *    (enforced automatically by non-increasing monotonicity: if h[r][c] === 0, then
 *    h[r+1][c] === 0, h[r][c+1] === 0, h[r+1][c+1] === 0).
 */
export function isIsoStructureUnambiguous(heights: readonly (readonly number[])[]): boolean {
  if (heights.length !== 3 || heights.some((row) => row.length !== 3)) return false;
  let total = 0;
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      const v = heights[r][c];
      if (!Number.isInteger(v) || v < 0 || v > 3) return false;
      total += v;
      if (r < 2 && heights[r + 1][c] > v) return false;
      if (c < 2 && heights[r][c + 1] > v) return false;
    }
  }
  return total >= 3;
}

export function sumHeights(heights: readonly (readonly number[])[]): number {
  let s = 0;
  for (const row of heights) {
    for (const v of row) s += v;
  }
  return s;
}

export function heightsToTopView(heights: readonly (readonly number[])[]): boolean[][] {
  return heights.map((row) => row.map((v) => v > 0));
}

export function serializeTopView(grid: readonly (readonly boolean[])[]): string {
  return grid.map((row) => row.map((b) => (b ? '1' : '0')).join('')).join('|');
}

function generateMonotonicHeights(rng: () => number, requireAsymmetricFootprint = false): number[][] {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const h: number[][] = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    h[0][0] = randInt(rng, 2, 3);
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        if (r === 0 && c === 0) continue;
        const maxAllowed = Math.min(
          r > 0 ? h[r - 1][c] : 3,
          c > 0 ? h[r][c - 1] : 3,
        );
        h[r][c] = randInt(rng, 0, maxAllowed);
      }
    }
    const total = sumHeights(h);
    if (!isIsoStructureUnambiguous(h) || total < 4 || total > 14) continue;

    if (requireAsymmetricFootprint) {
      const footprint = heightsToTopView(h);
      const filledCount = footprint.flat().filter(Boolean).length;
      if (filledCount < 4 || filledCount > 7) continue;
      // Ensure footprint is distinct from its 90°/180°/270° rotations so distractors are clean
      const sigs = new Set<string>([
        serializeTopView(footprint),
        serializeTopView(transformGrid(footprint, 'rot90')),
        serializeTopView(transformGrid(footprint, 'rot180')),
        serializeTopView(transformGrid(footprint, 'rot270')),
      ]);
      if (sigs.size < 4) continue;
    }

    return h;
  }
  // Guaranteed unambiguous fallback with asymmetric footprint (filled=5, total=8)
  return [
    [3, 2, 1],
    [1, 1, 0],
    [0, 0, 0],
  ];
}

export function generateIsoCubesQuestion(seed: number): LogicQuestion {
  const rng = createSeededRng(seed);
  const mode: 'count' | 'top-view' = rng() < 0.55 ? 'count' : 'top-view';

  if (mode === 'count') {
    const heights = generateMonotonicHeights(rng, false);
    const total = sumHeights(heights);

    // Build 3 realistic nearby integer distractors (e.g. off by ±1, ±2, or missing hidden bottom layer)
    const layer1 = heights.flat().filter((v) => v >= 1).length;
    const layer2 = heights.flat().filter((v) => v >= 2).length;
    const layer3 = heights.flat().filter((v) => v >= 3).length;

    const candNums = shuffle(rng, [
      total - 1,
      total + 1,
      total - 2,
      total + 2,
      Math.max(2, layer1 + layer2),
    ]).filter((n) => n >= 2 && n !== total);

    const distractorNums: number[] = [];
    for (const n of candNums) {
      if (!distractorNums.includes(n)) distractorNums.push(n);
      if (distractorNums.length === 3) break;
    }
    let bump = 3;
    while (distractorNums.length < 3) {
      if (!distractorNums.includes(total + bump)) distractorNums.push(total + bump);
      bump += 1;
    }

    const opts = shuffle(rng, [
      { val: total, isCorrect: true },
      ...distractorNums.map((v) => ({ val: v, isCorrect: false })),
    ]);
    const correctIndex = opts.findIndex((o) => o.isCorrect);

    const layerPartsEn = [`Layer 1: ${layer1}`];
    const layerPartsZh = [`第 1 層 ${layer1} 塊`];
    if (layer2 > 0) {
      layerPartsEn.push(`Layer 2: ${layer2}`);
      layerPartsZh.push(`第 2 層 ${layer2} 塊`);
    }
    if (layer3 > 0) {
      layerPartsEn.push(`Layer 3: ${layer3}`);
      layerPartsZh.push(`第 3 層 ${layer3} 塊`);
    }

    return {
      id: `logic-iso-count-${seed}`,
      moduleId: 'iso-cubes',
      promptEn: 'How many total unit cubes build this 3D staircase? (Count every supporting block underneath!)',
      promptZh: '這個立體階梯積木總共用了幾塊小正方體？（記得算進底層支撐的方塊喔！）',
      promptVisual: { kind: 'iso-cubes', heights, showHeights: false },
      choices: opts.map((o, idx) => ({
        id: `opt-${idx}`,
        labelEn: `${o.val} cubes`,
        labelZh: `${o.val} 塊積木`,
      })),
      correctIndex,
      explanationEn: `Count layer by layer: ${layerPartsEn.join(' + ')} = ${total} cubes!`,
      explanationZh: `由下往上逐層數：${layerPartsZh.join(' ＋ ')} ＝ 共 ${total} 塊積木！`,
      feedbackVisual: { kind: 'iso-cubes', heights, showHeights: true },
    };
  }

  // Top-view matching mode
  const heights = generateMonotonicHeights(rng, true);
  const topView = heightsToTopView(heights);
  const correctSig = serializeTopView(topView);

  const candidates = shuffle(rng, [
    transformGrid(topView, 'rot90'),
    transformGrid(topView, 'rot180'),
    transformGrid(topView, 'rot270'),
    transformGrid(topView, 'flipH'),
    transformGrid(topView, 'flipV'),
  ]);

  const distractors: boolean[][][] = [];
  const used = new Set<string>([correctSig]);
  for (const cand of candidates) {
    const sig = serializeTopView(cand);
    if (!used.has(sig)) {
      used.add(sig);
      distractors.push(cand);
      if (distractors.length === 3) break;
    }
  }
  // Safety mutation if needed
  let mutIdx = 0;
  while (distractors.length < 3 && mutIdx < 9) {
    const copy = topView.map((row) => [...row]);
    const mr = Math.floor(mutIdx / 3);
    const mc = mutIdx % 3;
    copy[mr][mc] = !copy[mr][mc];
    const sig = serializeTopView(copy);
    if (!used.has(sig)) {
      used.add(sig);
      distractors.push(copy);
    }
    mutIdx += 1;
  }

  const allViews = shuffle(rng, [
    { grid: topView, isCorrect: true },
    ...distractors.map((g) => ({ grid: g, isCorrect: false })),
  ]);
  const correctIndex = allViews.findIndex((o) => o.isCorrect);

  return {
    id: `logic-iso-top-${seed}`,
    moduleId: 'iso-cubes',
    promptEn: 'Imagine looking straight DOWN from above this 3D block tower (Top View). Which 3×3 map matches?',
    promptZh: '想像從正上方往下看這座立體積木（俯視圖），哪一張 3×3 平面圖完全吻合？',
    promptVisual: { kind: 'iso-cubes', heights, showHeights: false },
    choices: allViews.map((o, idx) => ({
      id: `opt-${idx}`,
      visual: { kind: 'top-view-grid', size: 3, filled: o.grid },
    })),
    correctIndex,
    explanationEn: 'Look at the top-left back corner (highest stack) and trace which grid squares have at least 1 cube!',
    explanationZh: '對照最左上（後方最高柱）的位置，凡是有放積木的格子在俯視圖上都會塗色！',
    feedbackVisual: { kind: 'iso-cubes', heights, showHeights: true },
  };
}

// ────────────────────────────────────────────────────────────
// 3. CUBE NETS & OPPOSITE FACES ENGINE (True 3D Fold Simulator)
// ────────────────────────────────────────────────────────────

type Vec3 = readonly [number, number, number];

function negVec(v: Vec3): Vec3 {
  return [-v[0], -v[1], -v[2]];
}

function vecKey(v: Vec3): string {
  return `${v[0]},${v[1]},${v[2]}`;
}

export type CubeFaceName = 'Bottom' | 'Top' | 'Front' | 'Back' | 'Left' | 'Right';

const FACE_NAME_BY_NORMAL: Record<string, { en: CubeFaceName; zh: string }> = {
  '0,0,-1': { en: 'Bottom', zh: '底面' },
  '0,0,1': { en: 'Top', zh: '頂面' },
  '0,1,0': { en: 'Front', zh: '前面' },
  '0,-1,0': { en: 'Back', zh: '後面' },
  '-1,0,0': { en: 'Left', zh: '左面' },
  '1,0,0': { en: 'Right', zh: '右面' },
};

export interface CubeFoldResult {
  valid: boolean;
  /** Map from cell index -> 3D face normal key */
  faceNormals: Vec3[];
  /** Map from cell index -> opposite cell index (only when valid) */
  oppositeIndex: Record<number, number>;
}

/**
 * Pure 3D orthogonal frame folding simulator.
 * Walks the 4-connected graph of net squares and rotates the local basis (n, u, v)
 * by 90° across each shared edge. A 6-square polyomino folds into a valid closed cube
 * if and only if it is connected and visits all 6 distinct unit normal vectors.
 */
export function simulateCubeNetFold(coords: readonly (readonly [number, number])[]): CubeFoldResult {
  if (coords.length !== 6) {
    return { valid: false, faceNormals: [], oppositeIndex: {} };
  }
  const indexByCoord = new Map<string, number>();
  for (let i = 0; i < coords.length; i += 1) {
    const key = `${coords[i][0]},${coords[i][1]}`;
    if (indexByCoord.has(key)) {
      return { valid: false, faceNormals: [], oppositeIndex: {} };
    }
    indexByCoord.set(key, i);
  }

  interface Frame {
    n: Vec3;
    u: Vec3; // +col direction
    v: Vec3; // +row direction
  }

  const visited = new Map<number, Frame>();
  const queue: number[] = [0];
  visited.set(0, { n: [0, 0, -1], u: [1, 0, 0], v: [0, 1, 0] });

  while (queue.length > 0) {
    const cur = queue.shift()!;
    const [r, c] = coords[cur];
    const f = visited.get(cur)!;

    const neighbors: Array<{ nr: number; nc: number; next: Frame }> = [
      { nr: r, nc: c + 1, next: { n: f.u, u: negVec(f.n), v: f.v } },
      { nr: r, nc: c - 1, next: { n: negVec(f.u), u: f.n, v: f.v } },
      { nr: r + 1, nc: c, next: { n: f.v, u: f.u, v: negVec(f.n) } },
      { nr: r - 1, nc: c, next: { n: negVec(f.v), u: f.u, v: f.n } },
    ];

    for (const nb of neighbors) {
      const idx = indexByCoord.get(`${nb.nr},${nb.nc}`);
      if (idx !== undefined && !visited.has(idx)) {
        visited.set(idx, nb.next);
        queue.push(idx);
      }
    }
  }

  if (visited.size !== 6) {
    return { valid: false, faceNormals: [], oppositeIndex: {} };
  }

  const faceNormals: Vec3[] = [];
  const idxByNormal = new Map<string, number>();
  for (let i = 0; i < 6; i += 1) {
    const n = visited.get(i)!.n;
    const nk = vecKey(n);
    if (idxByNormal.has(nk)) {
      return { valid: false, faceNormals: [], oppositeIndex: {} };
    }
    idxByNormal.set(nk, i);
    faceNormals.push(n);
  }

  const oppositeIndex: Record<number, number> = {};
  for (let i = 0; i < 6; i += 1) {
    const opp = idxByNormal.get(vecKey(negVec(faceNormals[i])));
    if (opp === undefined) {
      return { valid: false, faceNormals: [], oppositeIndex: {} };
    }
    oppositeIndex[i] = opp;
  }

  return { valid: true, faceNormals, oppositeIndex };
}

/**
 * All 11 mathematically distinct valid hexomino cube nets.
 */
export const ALL_11_VALID_CUBE_NETS: readonly (readonly (readonly [number, number])[])[] = [
  // 1-4-1 family (6 nets)
  [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 0]],
  [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]],
  [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]],
  [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 3]],
  [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]],
  [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]],
  // 2-3-1 family (3 nets)
  [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 1]],
  [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 2]],
  [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 3]],
  // 2-2-2 staircase (1 net)
  [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3]],
  // 3-3 offset (1 net)
  [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [1, 4]],
];

/**
 * 10 classic INVALID 6-square nets (all 4-connected, pairwise non-isomorphic under D4,
 * and mathematically proven invalid by simulateCubeNetFold === false).
 */
export const INVALID_CUBE_NETS: readonly (readonly (readonly [number, number])[])[] = [
  // 2x3 rectangle (contains 2x2)
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
  // Two flaps on the same side of 4-strip
  [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2], [1, 3]],
  // Two adjacent flaps on the same side (2x2 loop)
  [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [1, 3]],
  // Five in a row + 1
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 2]],
  // Z-bridge with overhanging ears (2 overlapping top faces)
  [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2], [0, 3]],
  // C-shape arch (top & bottom flaps collide onto the exact same face)
  [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1]],
  // 2x2 block + tail
  [[0, 0], [0, 1], [1, 0], [1, 1], [2, 1], [2, 2]],
  // 3-strip + 2-strip overlapping
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [2, 0]],
  // Plus with extra ear on same axis
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1], [0, 2]],
  // 4-strip with both end flaps on top
  [[0, 0], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3]],
];

function normalizeCoords(coords: readonly (readonly [number, number])[]): [number, number][] {
  const minR = Math.min(...coords.map(([r]) => r));
  const minC = Math.min(...coords.map(([, c]) => c));
  return coords.map(([r, c]) => [r - minR, c - minC]);
}

export function serializeNetCoords(coords: readonly (readonly [number, number])[]): string {
  return normalizeCoords(coords)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .map(([r, c]) => `${r},${c}`)
    .join('|');
}

function orientNet(
  rng: () => number,
  coords: readonly (readonly [number, number])[],
): [number, number][] {
  let pts: [number, number][] = coords.map(([r, c]) => [r, c]);
  // Optionally flip horizontally or rotate 180° (keep wide horizontal orientation compact on screen)
  if (rng() < 0.5) {
    pts = pts.map(([r, c]) => [r, -c]);
  }
  if (rng() < 0.5) {
    pts = pts.map(([r, c]) => [-r, -c]);
  }
  return normalizeCoords(pts);
}

const CUBE_FACE_SYMBOLS: readonly { symbol: string; en: string; zh: string; color: string }[] = [
  { symbol: '⭐', en: 'Star', zh: '星星', color: '#FEF3C7' },
  { symbol: '❤️', en: 'Heart', zh: '愛心', color: '#FFE4E6' },
  { symbol: '🍀', en: 'Clover', zh: '幸運草', color: '#DCFCE7' },
  { symbol: '🌙', en: 'Moon', zh: '月亮', color: '#EDE9FE' },
  { symbol: '💎', en: 'Gem', zh: '寶石', color: '#E0F2FE' },
  { symbol: '☀️', en: 'Sun', zh: '太陽', color: '#FFEDD5' },
];

export function generateCubeNetQuestion(seed: number): LogicQuestion {
  const rng = createSeededRng(seed);
  const mode: 'opposite' | 'valid-net' = rng() < 0.6 ? 'opposite' : 'valid-net';

  if (mode === 'opposite') {
    const rawNet = pick(rng, ALL_11_VALID_CUBE_NETS);
    const coords = orientNet(rng, rawNet);
    const fold = simulateCubeNetFold(coords);
    const symbols = shuffle(rng, CUBE_FACE_SYMBOLS);
    const targetIdx = randInt(rng, 0, 5);
    const oppIdx = fold.oppositeIndex[targetIdx];

    const targetSym = symbols[targetIdx];
    const oppSym = symbols[oppIdx];

    const distractorSyms = shuffle(
      rng,
      symbols.filter((_, idx) => idx !== targetIdx && idx !== oppIdx),
    ).slice(0, 3);

    const opts = shuffle(rng, [
      { sym: oppSym, isCorrect: true },
      ...distractorSyms.map((s) => ({ sym: s, isCorrect: false })),
    ]);
    const correctIndex = opts.findIndex((o) => o.isCorrect);

    const cells: NetCell[] = coords.map(([r, c], idx) => ({
      r,
      c,
      symbol: symbols[idx].symbol,
      color: symbols[idx].color,
    }));

    const feedbackCells: NetCell[] = coords.map(([r, c], idx) => {
      const faceMeta = FACE_NAME_BY_NORMAL[vecKey(fold.faceNormals[idx])];
      return {
        r,
        c,
        symbol: symbols[idx].symbol,
        color: symbols[idx].color,
        faceLabelEn: idx === targetIdx ? 'Start' : idx === oppIdx ? 'Opp' : faceMeta?.en ?? '',
        faceLabelZh: idx === targetIdx ? '起點' : idx === oppIdx ? '對面' : faceMeta?.zh ?? '',
      };
    });

    return {
      id: `logic-net-opp-${seed}`,
      moduleId: 'cube-nets',
      promptEn: `Fold this net into a closed cube. Which symbol lands directly OPPOSITE the ${targetSym.symbol} ${targetSym.en}?`,
      promptZh: `把這張展開圖摺成完整的正方體，${targetSym.symbol}（${targetSym.zh}）的正對面會是哪一個圖案？`,
      promptVisual: {
        kind: 'cube-net',
        cells,
        highlightCoord: { r: coords[targetIdx][0], c: coords[targetIdx][1] },
      },
      choices: opts.map((o, idx) => ({
        id: `opt-${idx}`,
        labelEn: `${o.sym.symbol} ${o.sym.en}`,
        labelZh: `${o.sym.symbol} ${o.sym.zh}`,
      })),
      correctIndex,
      explanationEn: `When folded in 3D, ${targetSym.symbol} ${targetSym.en} and ${oppSym.symbol} ${oppSym.en} sit on exact opposite faces!`,
      explanationZh: `以 3D 空間摺起後，${targetSym.symbol}（${targetSym.zh}）與 ${oppSym.symbol}（${oppSym.zh}）剛好互為正對面！`,
      feedbackVisual: {
        kind: 'cube-net',
        cells: feedbackCells,
        highlightCoord: { r: coords[oppIdx][0], c: coords[oppIdx][1] },
        showFaceLabels: true,
      },
    };
  }

  // Valid vs Invalid Net Recognition (with explicit oriented-coordinate deduplication)
  const validCoords = orientNet(rng, pick(rng, ALL_11_VALID_CUBE_NETS));
  const validFold = simulateCubeNetFold(validCoords);
  const usedSigs = new Set<string>([serializeNetCoords(validCoords)]);
  const pickedInvalids: [number, number][][] = [];
  for (const net of shuffle(rng, INVALID_CUBE_NETS)) {
    const oriented = orientNet(rng, net);
    const sig = serializeNetCoords(oriented);
    if (!usedSigs.has(sig)) {
      usedSigs.add(sig);
      pickedInvalids.push(oriented);
      if (pickedInvalids.length === 3) break;
    }
  }

  const allNets = shuffle(rng, [
    { coords: validCoords, isCorrect: true },
    ...pickedInvalids.map((coords) => ({ coords, isCorrect: false })),
  ]);
  const correctIndex = allNets.findIndex((n) => n.isCorrect);

  return {
    id: `logic-net-valid-${seed}`,
    moduleId: 'cube-nets',
    promptEn: 'Which 6-square net can fold cleanly into a CLOSED CUBE without any overlapping faces?',
    promptZh: '下面哪一張 6 格展開圖可以剛好摺成「完整不重疊」的正方體？',
    choices: allNets.map((item, idx) => ({
      id: `opt-${idx}`,
      visual: {
        kind: 'cube-net',
        cells: item.coords.map(([r, c]) => ({ r, c, color: '#EDE9FE' })),
      },
    })),
    correctIndex,
    explanationEn: 'A legal cube net never has a 2×2 block or two flaps on the exact same side — all 6 squares fold onto 6 different faces!',
    explanationZh: '合法的正方體展開圖不會出現 2×2 田字塊或同側重疊翼，摺起後 6 個正方形剛好對應上下前後左右 6 個面！',
    feedbackVisual: {
      kind: 'cube-net',
      cells: validCoords.map(([r, c], idx) => {
        const meta = FACE_NAME_BY_NORMAL[vecKey(validFold.faceNormals[idx])];
        return {
          r,
          c,
          color: '#DCFCE7',
          faceLabelEn: meta?.en ?? '',
          faceLabelZh: meta?.zh ?? '',
        };
      }),
      showFaceLabels: true,
    },
  };
}

// ────────────────────────────────────────────────────────────
// 4. PAPER FOLDING & SYMMETRY ENGINE (Multi-Axis Reflection)
// ────────────────────────────────────────────────────────────

/**
 * Pure reflection solver on a 4×4 square paper (x, y ∈ {0, 1, 2, 3}):
 * - 'vertical' fold folds the left half (x=0,1) onto the right half (x=2,3); unfolding reflects x -> 3 - x.
 * - 'horizontal' fold folds the top half (y=0,1) onto the bottom half (y=2,3); unfolding reflects y -> 3 - y.
 */
export function computeUnfoldedHoles(
  folds: readonly FoldAxis[],
  punchedHoles: readonly FoldHole[],
): FoldHole[] {
  let current: FoldHole[] = punchedHoles.map((h) => ({ ...h }));
  // Unfold in reverse order (commutes for orthogonal vertical/horizontal axes!)
  for (let i = folds.length - 1; i >= 0; i -= 1) {
    const axis = folds[i];
    const next: FoldHole[] = [];
    const seen = new Set<string>();
    for (const h of current) {
      const variants: FoldHole[] =
        axis === 'vertical'
          ? [h, { x: 3 - h.x, y: h.y, shape: h.shape }]
          : [h, { x: h.x, y: 3 - h.y, shape: h.shape }];
      for (const v of variants) {
        const k = `${v.x},${v.y},${v.shape}`;
        if (!seen.has(k)) {
          seen.add(k);
          next.push(v);
        }
      }
    }
    current = next;
  }
  return current.sort((a, b) => a.y - b.y || a.x - b.x || a.shape.localeCompare(b.shape));
}

export function serializeHoles(holes: readonly FoldHole[]): string {
  return [...holes]
    .sort((a, b) => a.y - b.y || a.x - b.x || a.shape.localeCompare(b.shape))
    .map((h) => `${h.x},${h.y},${h.shape}`)
    .join('|');
}

export function generatePaperFoldingQuestion(seed: number): LogicQuestion {
  const rng = createSeededRng(seed);
  const foldPreset = pick(rng, [
    ['vertical'] as FoldAxis[],
    ['horizontal'] as FoldAxis[],
    ['vertical', 'horizontal'] as FoldAxis[],
  ]);

  const punched: FoldHole[] = [];
  if (foldPreset.length === 1 && foldPreset[0] === 'vertical') {
    // Active half is right side: x ∈ {2, 3}, y ∈ {0, 1, 2, 3}
    const candidates: [number, number][] = [
      [2, 0],
      [3, 0],
      [2, 1],
      [3, 1],
      [2, 2],
      [3, 2],
      [2, 3],
      [3, 3],
    ];
    const chosen = shuffle(rng, candidates).slice(0, 2);
    // Ensure asymmetric along y and x so wrong reflections produce distinct distractors
    if (chosen[0][0] === chosen[1][0]) {
      chosen[1] = [chosen[0][0] === 2 ? 3 : 2, chosen[1][1]];
    }
    punched.push({ x: chosen[0][0], y: chosen[0][1], shape: 'circle' });
    punched.push({ x: chosen[1][0], y: chosen[1][1], shape: 'diamond' });
  } else if (foldPreset.length === 1 && foldPreset[0] === 'horizontal') {
    // Active half is bottom side: x ∈ {0, 1, 2, 3}, y ∈ {2, 3}
    const candidates: [number, number][] = [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    const chosen = shuffle(rng, candidates).slice(0, 2);
    if (chosen[0][1] === chosen[1][1]) {
      chosen[1] = [chosen[1][0], chosen[0][1] === 2 ? 3 : 2];
    }
    punched.push({ x: chosen[0][0], y: chosen[0][1], shape: 'circle' });
    punched.push({ x: chosen[1][0], y: chosen[1][1], shape: 'diamond' });
  } else {
    // Double fold: active quadrant is bottom-right x ∈ {2, 3}, y ∈ {2, 3}
    const qCoords = shuffle(rng, [
      [2, 2],
      [3, 2],
      [2, 3],
      [3, 3],
    ] as [number, number][]);
    punched.push({ x: qCoords[0][0], y: qCoords[0][1], shape: pick(rng, ['circle', 'diamond']) });
    if (rng() < 0.45) {
      punched.push({ x: qCoords[1][0], y: qCoords[1][1], shape: punched[0].shape === 'circle' ? 'diamond' : 'circle' });
    }
  }

  const correctHoles = computeUnfoldedHoles(foldPreset, punched);
  const correctSig = serializeHoles(correctHoles);

  // Build clever, strictly distinct distractors:
  // 1) Translation (copied without mirroring!)
  // 2) Wrong-axis reflection
  // 3) Single-axis unfold (forgot 2nd fold) or shifted hole
  const distractorPool: FoldHole[][] = [];

  // Distractor A: shift-copy instead of mirror
  if (foldPreset.length === 1 && foldPreset[0] === 'vertical') {
    distractorPool.push([
      ...punched,
      ...punched.map((h) => ({ x: h.x - 2, y: h.y, shape: h.shape })),
    ]);
    // Distractor B: mirror + flip y accidentally
    distractorPool.push([
      ...punched,
      ...punched.map((h) => ({ x: 3 - h.x, y: 3 - h.y, shape: h.shape })),
    ]);
    // Distractor C: wrong horizontal mirror
    distractorPool.push(computeUnfoldedHoles(['horizontal'], punched));
  } else if (foldPreset.length === 1 && foldPreset[0] === 'horizontal') {
    distractorPool.push([
      ...punched,
      ...punched.map((h) => ({ x: h.x, y: h.y - 2, shape: h.shape })),
    ]);
    distractorPool.push([
      ...punched,
      ...punched.map((h) => ({ x: 3 - h.x, y: 3 - h.y, shape: h.shape })),
    ]);
    distractorPool.push(computeUnfoldedHoles(['vertical'], punched));
  } else {
    // Double fold distractors:
    // 1) Only unfolded once vertically
    distractorPool.push(computeUnfoldedHoles(['vertical'], punched));
    // 2) Only unfolded once horizontally
    distractorPool.push(computeUnfoldedHoles(['horizontal'], punched));
    // 3) Translated to all 4 quadrants without mirroring!
    distractorPool.push([
      ...punched,
      ...punched.map((h) => ({ x: h.x - 2, y: h.y, shape: h.shape })),
      ...punched.map((h) => ({ x: h.x, y: h.y - 2, shape: h.shape })),
      ...punched.map((h) => ({ x: h.x - 2, y: h.y - 2, shape: h.shape })),
    ]);
    // 4) Shifted inner/outer ring
    distractorPool.push(
      computeUnfoldedHoles(
        foldPreset,
        punched.map((h) => ({ x: h.x === 2 ? 3 : 2, y: h.y, shape: h.shape })),
      ),
    );
    distractorPool.push(
      computeUnfoldedHoles(
        foldPreset,
        punched.map((h) => ({ x: h.x, y: h.y === 2 ? 3 : 2, shape: h.shape })),
      ),
    );
  }

  // Fallback shifted variants to guarantee 3 strictly unique distractors
  const fallbackShifts: FoldHole[][] = [
    computeUnfoldedHoles(
      foldPreset,
      punched.map((h) => ({ x: (h.x + 1) % 4, y: h.y, shape: h.shape })),
    ),
    computeUnfoldedHoles(
      foldPreset,
      punched.map((h) => ({ x: h.x, y: (h.y + 1) % 4, shape: h.shape })),
    ),
    computeUnfoldedHoles(
      foldPreset,
      punched.map((h) => ({ x: 3 - h.x, y: 3 - h.y, shape: h.shape })),
    ),
  ];

  const distractors: FoldHole[][] = [];
  const used = new Set<string>([correctSig]);
  for (const cand of [...distractorPool, ...fallbackShifts]) {
    const sig = serializeHoles(cand);
    if (!used.has(sig)) {
      used.add(sig);
      distractors.push(cand);
      if (distractors.length === 3) break;
    }
  }

  const allOpts = shuffle(rng, [
    { holes: correctHoles, isCorrect: true },
    ...distractors.map((h) => ({ holes: h, isCorrect: false })),
  ]);
  const correctIndex = allOpts.findIndex((o) => o.isCorrect);

  const foldDescEn =
    foldPreset.length === 2
      ? 'folded in half TWICE (left-to-right, then top-to-bottom)'
      : foldPreset[0] === 'vertical'
        ? 'folded in half LEFT-TO-RIGHT'
        : 'folded in half TOP-TO-BOTTOM';
  const foldDescZh =
    foldPreset.length === 2
      ? '先左右對摺、再上下對摺（共摺兩次）'
      : foldPreset[0] === 'vertical'
        ? '沿中線左右對摺一次'
        : '沿中線上下對摺一次';

  return {
    id: `logic-fold-${seed}`,
    moduleId: 'paper-folding',
    promptEn: `A square sheet is ${foldDescEn}, then punched as shown. What does it look like when completely UNFOLDED?`,
    promptZh: `正方形色紙${foldDescZh}後，在圖中位置打洞。完全展開後會變成哪一張圖案？`,
    promptVisual: {
      kind: 'paper-fold',
      folds: foldPreset,
      holes: punched,
      unfolded: false,
      showAxes: true,
    },
    choices: allOpts.map((o, idx): LogicChoice => ({
      id: `opt-${idx}`,
      visual: {
        kind: 'paper-fold',
        folds: foldPreset,
        holes: o.holes,
        unfolded: true,
        showAxes: false,
      },
    })),
    correctIndex,
    explanationEn:
      foldPreset.length === 2
        ? 'Each fold creates a mirror axis! Unfolding reflects the holes across BOTH the horizontal and vertical fold lines.'
        : 'Unfolding reflects every punched hole like a mirror across the dashed fold crease!',
    explanationZh:
      foldPreset.length === 2
        ? '每摺一次就多一條鏡像對稱軸！展開時洞口會沿「水平＋垂直」兩條虛線摺痕完全對稱！'
        : '展開時，每個洞都會以虛線摺痕為鏡子，對稱出現在另一側！',
    feedbackVisual: {
      kind: 'paper-fold',
      folds: foldPreset,
      holes: correctHoles,
      unfolded: true,
      showAxes: true,
    },
  };
}

// ────────────────────────────────────────────────────────────
// Session Builder (5 fresh, deduplicated questions per run)
// ────────────────────────────────────────────────────────────

export function generateSpatialQuestion(moduleId: SpatialModuleId, seed: number): LogicQuestion {
  switch (moduleId) {
    case 'rotation-mirror':
      return generateRotationMirrorQuestion(seed);
    case 'iso-cubes':
      return generateIsoCubesQuestion(seed);
    case 'cube-nets':
      return generateCubeNetQuestion(seed);
    case 'paper-folding':
      return generatePaperFoldingQuestion(seed);
  }
}

export function buildSpatialSession(
  moduleId: SpatialModuleId,
  baseSeed: number = Date.now(),
  count = 5,
): LogicQuestion[] {
  const out: LogicQuestion[] = [];
  const seen = new Set<string>();
  let attempt = 0;
  while (out.length < count && attempt < count * 8) {
    const q = generateSpatialQuestion(moduleId, (baseSeed + attempt * 9973) >>> 0);
    const sig = `${q.promptEn}|${JSON.stringify(q.promptVisual ?? q.choices[q.correctIndex])}`;
    if (!seen.has(sig)) {
      seen.add(sig);
      out.push(q);
    }
    attempt += 1;
  }
  while (out.length < count) {
    out.push(generateSpatialQuestion(moduleId, (baseSeed + attempt * 9973) >>> 0));
    attempt += 1;
  }
  return out;
}

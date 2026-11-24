export type SpatialModuleId =
  | 'rotation-mirror'
  | 'iso-cubes'
  | 'cube-nets'
  | 'paper-folding';

export type LogicReasoningModuleId =
  | 'balance-scale'
  | 'pattern-matrix'
  | 'logic-grid'
  | 'robot-coding';

export type LogicModuleId = SpatialModuleId | LogicReasoningModuleId;

export type LogicCategory = 'spatial' | 'logic';

export interface LogicModuleMeta {
  id: LogicModuleId;
  category: LogicCategory;
  emoji: string;
  enTitle: string;
  zhTitle: string;
  enSubtitle: string;
  zhSubtitle: string;
  accentHex: string;
  bgHex: string;
}

export type TileShape = 'circle' | 'square' | 'diamond' | 'plus' | 'star4';

export interface PatternTile {
  shape: TileShape;
  color: string;
}

export interface NetCell {
  r: number;
  c: number;
  symbol?: string;
  color?: string;
  faceLabelEn?: string;
  faceLabelZh?: string;
}

export interface FoldHole {
  x: number;
  y: number;
  shape: 'circle' | 'diamond';
}

export type FoldAxis = 'vertical' | 'horizontal';

export type SpatialVisualSpec =
  | {
      kind: 'pattern-grid';
      size: 3;
      cells: (PatternTile | null)[][];
      mirrorAxis?: FoldAxis;
    }
  | {
      kind: 'iso-cubes';
      /** 3x3 gravity-supported column height matrix (values 0..3) */
      heights: number[][];
      showHeights?: boolean;
    }
  | {
      kind: 'top-view-grid';
      size: 3;
      filled: boolean[][];
    }
  | {
      kind: 'cube-net';
      cells: NetCell[];
      highlightCoord?: { r: number; c: number };
      showFaceLabels?: boolean;
    }
  | {
      kind: 'paper-fold';
      folds: FoldAxis[];
      holes: FoldHole[];
      unfolded: boolean;
      showAxes?: boolean;
    };

export interface ScaleIconItem {
  kind: 'icon';
  iconId: string;
  emoji: string;
  nameEn: string;
  nameZh: string;
  color: string;
}

export interface ScaleWeightItem {
  kind: 'weight';
  value: number;
}

export type ScalePanItem = ScaleIconItem | ScaleWeightItem;

export interface BalanceScaleRow {
  left: ScalePanItem[];
  right: ScalePanItem[];
}

export type MatrixShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'star4';
export type MatrixFill = 'solid' | 'outline' | 'striped';

export interface MatrixCellSpec {
  shape: MatrixShape;
  color: string;
  count: 1 | 2 | 3;
  fill: MatrixFill;
}

export interface LogicGridEntity {
  id: string;
  emoji: string;
  labelEn: string;
  labelZh: string;
  colorHex: string;
}

export type LogicClue =
  | { kind: 'person-has-a'; personIdx: number; aIdx: number; negated: boolean }
  | { kind: 'person-has-b'; personIdx: number; bIdx: number; negated: boolean }
  | { kind: 'a-with-b'; aIdx: number; bIdx: number; negated: boolean };

export interface LogicGridSolutionRow {
  personIdx: number;
  aIdx: number;
  bIdx: number;
}

export type RobotDir = 'N' | 'E' | 'S' | 'W';
export type RobotCmd = 'FWD' | 'LEFT' | 'RIGHT' | 'LOOP2_FWD';

export interface RobotFlagMarker {
  badge: 'A' | 'B' | 'C' | 'D';
  r: number;
  c: number;
  color: string;
}

export type LogicVisualSpec =
  | SpatialVisualSpec
  | {
      kind: 'balance-scale';
      scales: BalanceScaleRow[];
      askItems: ScaleIconItem[];
      revealedValues?: { emoji: string; nameEn: string; nameZh: string; value: number }[];
    }
  | {
      kind: 'pattern-matrix';
      size: 3;
      cells: (MatrixCellSpec | null)[][];
      highlightMissing?: boolean;
      solvedCell?: MatrixCellSpec;
    }
  | {
      kind: 'matrix-cell';
      cell: MatrixCellSpec;
    }
  | {
      kind: 'logic-grid';
      people: LogicGridEntity[];
      attrA: LogicGridEntity[];
      attrB: LogicGridEntity[];
      attrATitleEn: string;
      attrATitleZh: string;
      attrBTitleEn: string;
      attrBTitleZh: string;
      cluesEn: string[];
      cluesZh: string[];
      solution?: LogicGridSolutionRow[];
    }
  | {
      kind: 'robot-grid';
      size: 5;
      start: { r: number; c: number; dir: RobotDir };
      obstacles: { r: number; c: number }[];
      star?: { r: number; c: number };
      flags?: RobotFlagMarker[];
      program?: RobotCmd[];
      trail?: { r: number; c: number }[];
      highlightEnd?: { r: number; c: number };
    };

export interface LogicChoice {
  id: string;
  labelEn?: string;
  labelZh?: string;
  visual?: LogicVisualSpec;
}

export interface LogicQuestion {
  id: string;
  moduleId: LogicModuleId;
  promptEn: string;
  promptZh: string;
  promptVisual?: LogicVisualSpec;
  choices: LogicChoice[];
  correctIndex: number;
  explanationEn: string;
  explanationZh: string;
  feedbackVisual?: LogicVisualSpec;
}

export const SPATIAL_MODULES: readonly LogicModuleMeta[] = [
  {
    id: 'rotation-mirror',
    category: 'spatial',
    emoji: '🔄',
    enTitle: 'Rotation & Mirror Flip',
    zhTitle: '旋轉與鏡像偵探',
    enSubtitle: 'Spin 90°/180°/270° or mirror-flip colorful pattern grids',
    zhSubtitle: '辨識 90°/180°/270° 旋轉與左右／上下鏡像翻轉圖騰',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
  },
  {
    id: 'iso-cubes',
    category: 'spatial',
    emoji: '🧊',
    enTitle: '3D Cubes & Top View',
    zhTitle: '立體積木與俯視圖',
    enSubtitle: 'Count 3D isometric blocks and match bird’s-eye top views',
    zhSubtitle: '精準數出等角立體積木總塊數，並配對正上方俯視圖',
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
  },
  {
    id: 'cube-nets',
    category: 'spatial',
    emoji: '📦',
    enTitle: 'Cube Nets & Opposite Faces',
    zhTitle: '正方體展開圖大挑戰',
    enSubtitle: 'Explore all 11 legal cube nets and predict opposite faces',
    zhSubtitle: '挑戰全部 11 種合法正方體展開圖與摺疊對面圖案推理',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
  },
  {
    id: 'paper-folding',
    category: 'spatial',
    emoji: '✂️',
    enTitle: 'Paper Folding & Symmetry',
    zhTitle: '摺紙對稱剪紙室',
    enSubtitle: 'Fold, punch holes, and predict the symmetric unfolded sheet',
    zhSubtitle: '預測方紙對摺打洞展開後的鏡像對稱圖案與對稱軸',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
  },
];

export const LOGIC_REASONING_MODULES: readonly LogicModuleMeta[] = [
  {
    id: 'balance-scale',
    category: 'logic',
    emoji: '⚖️',
    enTitle: 'Balance Scale Logic',
    zhTitle: '天平代數推理',
    enSubtitle: 'Use cute balance scales to solve algebraic mystery weights',
    zhSubtitle: '觀察多座平衡天平，用等量代換解出神祕圖示的重量',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
  },
  {
    id: 'pattern-matrix',
    category: 'logic',
    emoji: '🧩',
    enTitle: 'Pattern Matrix',
    zhTitle: '圖形矩陣規律',
    enSubtitle: 'Crack 3×3 row & column rules to complete visual matrices',
    zhSubtitle: '找出 3×3 圖形矩陣的橫列與直行規律，補上缺漏方塊',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
  },
  {
    id: 'logic-grid',
    category: 'logic',
    emoji: '🕵️',
    enTitle: 'Logic Deduction Grid',
    zhTitle: '邏輯推理網格',
    enSubtitle: 'Combine 3×3 detective clues with an interactive check grid',
    zhSubtitle: '閱讀 3×3 偵探線索並搭配互動筆記表，推論唯一正解',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
  },
  {
    id: 'robot-coding',
    category: 'logic',
    emoji: '🤖',
    enTitle: 'Robot Block Coding',
    zhTitle: '機器人積木解謎',
    enSubtitle: 'Trace turns, steps & repeat loops on a 5×5 treasure board',
    zhSubtitle: '在 5×5 寶藏地圖模擬前進、轉向與迴圈積木指令',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
  },
];

export const ALL_LOGIC_MODULES: readonly LogicModuleMeta[] = [
  ...SPATIAL_MODULES,
  ...LOGIC_REASONING_MODULES,
];

export const LOGIC_DAILY_TOKEN_CAP = 90;

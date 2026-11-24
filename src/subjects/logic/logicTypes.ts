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

export interface LogicChoice {
  id: string;
  labelEn?: string;
  labelZh?: string;
  visual?: SpatialVisualSpec;
}

export interface LogicQuestion {
  id: string;
  moduleId: LogicModuleId;
  promptEn: string;
  promptZh: string;
  promptVisual?: SpatialVisualSpec;
  choices: LogicChoice[];
  correctIndex: number;
  explanationEn: string;
  explanationZh: string;
  feedbackVisual?: SpatialVisualSpec;
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

export const LOGIC_DAILY_TOKEN_CAP = 90;

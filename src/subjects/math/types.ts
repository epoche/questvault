import type { DifficultyTier } from '../../core/types';

export type MathStrand =
  | 'multiply'
  | 'fractions'
  | 'geometry'
  | 'word-problems'
  | 'place-value'
  | 'measurement'
  | 'data';

export type MathVisualSpec =
  | { kind: 'array'; rows: number; cols: number; color?: string; caption?: string }
  | { kind: 'fraction-bar'; numerator: number; denominator: number; color?: string; label?: string }
  | {
      kind: 'fraction-compare';
      leftNum: number;
      leftDen: number;
      rightNum: number;
      rightDen: number;
    }
  | {
      kind: 'fraction-op';
      aNum: number;
      bNum: number;
      denominator: number;
      op: '+' | '-';
    }
  | { kind: 'area-grid'; width: number; height: number; unit?: string; showMissing?: 'width' | 'height' }
  | {
      kind: 'dual-area-grid';
      leftW: number;
      leftH: number;
      leftCaption: string;
      rightW: number;
      rightH: number;
      rightCaption: string;
    }
  | { kind: 'perimeter-rect'; width: number; height: number; unit?: string; unknownSide?: boolean }
  | { kind: 'factor-pairs'; value: number; pairs: [number, number][] }
  | {
      kind: 'dual-factor-pairs';
      leftValue: number;
      leftTag: string;
      leftPairs: [number, number][];
      rightValue: number;
      rightTag: string;
      rightPairs: [number, number][];
    }
  | { kind: 'area-model'; tens: number; ones: number; multiplier: number }
  | { kind: 'bar-model'; totalLabel: string; parts: { label: string; color: string; weight?: number }[] }
  | { kind: 'decimal-grid'; shaded: number; label: string }
  | { kind: 'angle-view'; degrees: number; showDegrees?: boolean; label?: string }
  | { kind: 'line-relation'; relation: 'parallel' | 'perpendicular' | 'intersecting'; label?: string }
  | { kind: 'rectangle-angles'; label?: string }
  | { kind: 'number-line-round'; low: number; mid: number; high: number; value: number; showMid?: boolean }
  | { kind: 'place-value'; value: number; highlightPlace: 'thousands' | 'hundreds' | 'tens' | 'ones' }
  | { kind: 'time-jump'; startLabel: string; jumps: string[]; endLabel?: string }
  | { kind: 'line-plot'; title: string; marks: { label: string; count: number }[] }
  | {
      kind: 'symmetry-shape';
      shape: 'square' | 'rectangle' | 'equilateral-triangle' | 'isosceles-triangle' | 'regular-hexagon' | 'heart';
      showLines?: boolean;
      label?: string;
    }
  | {
      kind: 'area-model-2x2';
      aTens: number;
      aOnes: number;
      bTens: number;
      bOnes: number;
      hideProducts?: boolean;
    }
  | {
      kind: 'coord-grid';
      maxCoord: number;
      point: [number, number];
      secondPoint?: [number, number];
      showCoords?: boolean;
      label?: string;
    };

export interface MathSkillItem {
  id: string;
  skillLabel: string;
  tier: DifficultyTier;
  strand: MathStrand;
  conceptTitle: string;
  conceptFormula: string;
  visual: MathVisualSpec;
  sprintPrompt: string;
  sprintVisual?: MathVisualSpec;
  revealVisualOnFeedback?: boolean;
  correctAnswer: string;
  distractors: [string, string, string];
  explanation: string;
  wordProblemPrompt: string;
  wordProblemVisual?: MathVisualSpec;
  wordProblemAnswer: string;
  wordProblemDistractors: [string, string, string];
  wordProblemStepHint: string;
}

export interface MathQuestSet {
  id: string;
  subjectId: 'math';
  tier: DifficultyTier;
  title: string;
  shortTag: string;
  accentHex: string;
  bgHex: string;
  emblemCollectibleId: string;
  isRematch?: boolean;
  tokenMultiplier?: number;
  items: MathSkillItem[];
}

export interface MathSprintQuestion {
  id: string;
  item: MathSkillItem;
  promptText: string;
  visual?: MathVisualSpec;
  revealVisualOnFeedback?: boolean;
  correctAnswer: string;
  choices: string[];
  explanation: string;
}

export interface MathChallengeQuestion {
  id: string;
  item: MathSkillItem;
  promptText: string;
  visual?: MathVisualSpec;
  correctAnswer: string;
  choices: string[];
  stepHint: string;
}

export interface MathRunPlan {
  questSet: MathQuestSet;
  conceptItems: MathSkillItem[];
  sprintQuestions: MathSprintQuestion[];
  challengeQuestions: MathChallengeQuestion[];
}

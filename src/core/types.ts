export type SubjectId = 'english' | 'math' | 'chinese';

export type DifficultyTier = 1 | 2 | 3 | 4;

export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'chroma';

export type PackCategory =
  | 'classic'
  | 'food'
  | 'nature'
  | 'adventure'
  | 'arts'
  | 'holidays'
  | 'pets'
  | 'squishy';

export type PackId =
  | 'critter'
  | 'sweet'
  | 'space'
  | 'ocean'
  | 'dino'
  | 'magic'
  | 'boba'
  | 'bakery'
  | 'sushi'
  | 'botanical'
  | 'arctic'
  | 'butterfly'
  | 'safari'
  | 'festival'
  | 'mythology'
  | 'music'
  | 'arcade'
  | 'crystal'
  | 'halloween'
  | 'lunar'
  | 'winter'
  | 'midautumn'
  | 'easter'
  | 'catcafe'
  | 'capybara'
  | 'forest'
  | 'mochi'
  | 'cloudsquishy'
  | 'fairytale'
  | 'fairyland';

export interface RarityConfig {
  id: Rarity;
  label: string;
  weight: number;
  resaleTokens: number;
  colorHex: string;
  bgTintHex: string;
}

export interface Collectible {
  id: string;
  name: string;
  packId: PackId;
  rarity: Rarity;
  tagline: string;
  accentHex: string;
  bgHex: string;
}

export interface MysteryPack {
  id: PackId;
  name: string;
  subtitle: string;
  category: PackCategory;
  cost: number;
  accentHex: string;
  surfaceHex: string;
}

export interface WordMasteryRecord {
  word: string;
  subjectId?: SubjectId;
  tier: DifficultyTier;
  seen: number;
  correctFirstTry: number;
  missed: number;
  usedInWriting: number;
  lastSeenAt: string;
  lastMissedAt?: string;
  /** SRS stage: 0 = due now / new, 1 = 1d, 2 = 3d, 3 = 7d, 4 = 21d */
  srsLevel?: number;
  /** ISO timestamp when this item is next due for spaced-repetition review */
  nextReviewAt?: string;
}

export interface WritingEntry {
  id: string;
  subjectId: SubjectId;
  questSetId: string;
  questSetTitle: string;
  targetWords: string[];
  sentence: string;
  createdAt: string;
}

export interface RunSummary {
  id: string;
  subjectId: SubjectId;
  questSetId: string;
  questSetTitle: string;
  tokensEarned: number;
  maxCombo: number;
  accuracyPct: number;
  completedAt: string;
}

export interface CustomWordInput {
  word: string;
  definition: string;
  zhuyin?: string;
  englishBridge?: string;
  partOfSpeech?: string;
  example?: string;
}

export interface CustomWordSetRecord {
  id: string;
  subjectId: 'english' | 'chinese';
  title: string;
  createdAt: string;
  words: CustomWordInput[];
}

export interface DailyQuestProgress {
  dateKey: string;
  completedSubjects: SubjectId[];
  rewardClaimed: boolean;
}

export interface BlitzDailyTokens {
  dateKey: string;
  earned: number;
}

export interface PlayerState {
  version: 1;
  displayName: string;
  tokens: number;
  activeSubjectId?: SubjectId;
  activeTier: DifficultyTier;
  subjectTiers?: Record<SubjectId, DifficultyTier>;
  placementCompleted: boolean;
  subjectPlacementCompleted?: Record<SubjectId, boolean>;
  equippedCollectibleId: string;
  vault: Record<string, number>;
  shinyVault?: Record<string, boolean>;
  wordMastery: Record<string, WordMasteryRecord>;
  completedQuestSetIds: string[];
  runHistory: RunSummary[];
  writingLog: WritingEntry[];
  customWordSets: CustomWordSetRecord[];
  lastBossRematchDate?: string;
  subjectBossRematchDate?: Partial<Record<SubjectId, string>>;
  dailyQuest?: DailyQuestProgress;
  streakDays?: number;
  lastActiveDate?: string;
  blitzHighScores?: Partial<Record<SubjectId, number>>;
  blitzDailyTokens?: BlitzDailyTokens;
  showZhuyin?: boolean;
  muted: boolean;
}

export interface SubjectDescriptor {
  id: SubjectId;
  label: string;
  shortLabel: string;
  gradeTag: string;
  speechLang: string;
  status: 'active' | 'coming-soon';
  description: string;
}

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
  | 'fairyland'
  | 'valentine'
  | 'dragonboat'
  | 'thanksgiving'
  | 'deepsea'
  | 'puppypark'
  | 'dessertsquishy'
  | 'fairycottage'
  | 'starunicorn';

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

export interface DailyQuestClaims {
  dateKey: string;
  counts: Record<string, number>;
}

export type CritterRoomThemeId =
  | 'strawberry-cafe'
  | 'starlight-attic'
  | 'boba-beach'
  | 'fairy-treehouse';

export interface CritterRoomState {
  themeId: CritterRoomThemeId;
  slots: (string | null)[];
}

export interface WeeklyGoalConfig {
  enTarget: number;
  zhTarget: number;
  mathTarget: number;
  rewardText: string;
  redeemedWeekKey?: string;
}

export interface FactMasteryEntry {
  attempts: number;
  correct: number;
  avgMs: number;
}

export interface PlayerState {
  version: 1;
  displayName: string;
  tokens: number;
  starDust?: number;
  activeSubjectId?: SubjectId;
  activeTier: DifficultyTier;
  subjectTiers?: Record<SubjectId, DifficultyTier>;
  placementCompleted: boolean;
  subjectPlacementCompleted?: Record<SubjectId, boolean>;
  equippedCollectibleId: string;
  vault: Record<string, number>;
  shinyVault?: Record<string, boolean>;
  favoriteCollectibleIds?: string[];
  critterRoom?: CritterRoomState;
  wordMastery: Record<string, WordMasteryRecord>;
  completedQuestSetIds: string[];
  completedRadicalIds?: string[];
  completedMeasureIds?: string[];
  completedEnglishRootIds?: string[];
  completedGrammarIds?: string[];
  completedSpellingIds?: string[];
  completedEnglishChapterIds?: string[];
  claimedEnglishChapterSeriesIds?: string[];
  completedBarModelIds?: string[];
  completedSentencePatternIds?: string[];
  completedChapterEpisodeIds?: string[];
  claimedChapterSeriesIds?: string[];
  claimedAchievementIds?: string[];
  mathFactMastery?: Record<string, FactMasteryEntry>;
  mathFluencyDailyTokens?: BlitzDailyTokens;
  runHistory: RunSummary[];
  writingLog: WritingEntry[];
  customWordSets: CustomWordSetRecord[];
  lastBossRematchDate?: string;
  subjectBossRematchDate?: Partial<Record<SubjectId, string>>;
  dailyQuest?: DailyQuestProgress;
  dailyQuestClaims?: DailyQuestClaims;
  streakDays?: number;
  lastActiveDate?: string;
  blitzHighScores?: Partial<Record<SubjectId, number>>;
  blitzDailyTokens?: BlitzDailyTokens;
  cafeHighScores?: Partial<Record<SubjectId, number>>;
  fishingHighScores?: Partial<Record<SubjectId, number>>;
  bossHighScores?: Partial<Record<SubjectId, number>>;
  arcadeDailyTokens?: BlitzDailyTokens;
  weeklyGoal?: WeeklyGoalConfig;
  lastBackupAt?: string;
  parentPinHash?: string;
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

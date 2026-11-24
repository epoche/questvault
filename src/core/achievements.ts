import {
  ALL_LOGIC_MODULES,
  LOGIC_REASONING_MODULES,
  SPATIAL_MODULES,
} from '../subjects/logic/logicTypes';
import { classifyHeatmapCell, getFactHeatmapKey } from '../subjects/math/factFluencyEngine';
import { getCollectiblesByPack, MYSTERY_PACKS } from './packs';
import type { PlayerState } from './types';

export type AchievementCategory = 'learning' | 'streak' | 'collection' | 'chinese' | 'logic';

export type AchievementRewardType = 'tokens' | 'starDust';

export interface AchievementDefinition {
  id: string;
  category: AchievementCategory;
  emoji: string;
  title: string;
  zhTitle: string;
  description: string;
  target: number;
  rewardType: AchievementRewardType;
  rewardAmount: number;
  accentHex: string;
  bgHex: string;
  getCurrent: (state: PlayerState) => number;
}

export interface AchievementProgress {
  def: AchievementDefinition;
  current: number;
  target: number;
  pct: number;
  unlocked: boolean;
  claimed: boolean;
  claimable: boolean;
}

function countOwnedCollectibles(state: PlayerState): number {
  return Object.values(state.vault).filter((c) => c > 0).length;
}

function countShinyCollectibles(state: PlayerState): number {
  return Object.values(state.shinyVault ?? {}).filter(Boolean).length;
}

function countCompletedPacks(state: PlayerState): number {
  let crowns = 0;
  for (const pack of MYSTERY_PACKS) {
    const items = getCollectiblesByPack(pack.id);
    if (items.length > 0 && items.every((it) => (state.vault[it.id] ?? 0) > 0)) {
      crowns += 1;
    }
  }
  return crowns;
}

const SPATIAL_ID_SET = new Set<string>(SPATIAL_MODULES.map((m) => m.id));
const LOGIC_REASONING_ID_SET = new Set<string>(LOGIC_REASONING_MODULES.map((m) => m.id));
const ALL_LOGIC_ID_SET = new Set<string>(ALL_LOGIC_MODULES.map((m) => m.id));

function getUniqueValidLogicIds(state: PlayerState): Set<string> {
  const raw = Array.isArray(state.completedLogicModuleIds) ? state.completedLogicModuleIds : [];
  const valid = new Set<string>();
  for (const id of raw) {
    if (typeof id === 'string' && ALL_LOGIC_ID_SET.has(id)) {
      valid.add(id);
    }
  }
  return valid;
}

function countClearedSpatialModules(state: PlayerState): number {
  let count = 0;
  for (const id of getUniqueValidLogicIds(state)) {
    if (SPATIAL_ID_SET.has(id)) count += 1;
  }
  return count;
}

function countClearedLogicReasoningModules(state: PlayerState): number {
  let count = 0;
  for (const id of getUniqueValidLogicIds(state)) {
    if (LOGIC_REASONING_ID_SET.has(id)) count += 1;
  }
  return count;
}

function countClearedAllLogicModules(state: PlayerState): number {
  return getUniqueValidLogicIds(state).size;
}

function countTotalLogicRuns(state: PlayerState): number {
  const stats = state.logicStats;
  if (!stats || typeof stats !== 'object') return 0;
  return Object.entries(stats).reduce((sum, [id, s]) => {
    if (!ALL_LOGIC_ID_SET.has(id) || !s || typeof s !== 'object') return sum;
    const runs = typeof s.runs === 'number' && Number.isFinite(s.runs) ? Math.max(0, Math.floor(s.runs)) : 0;
    return sum + runs;
  }, 0);
}

function countTotalLogicCorrect(state: PlayerState): number {
  const stats = state.logicStats;
  if (!stats || typeof stats !== 'object') return 0;
  return Object.entries(stats).reduce((sum, [id, s]) => {
    if (!ALL_LOGIC_ID_SET.has(id) || !s || typeof s !== 'object') return sum;
    const q =
      typeof s.totalQuestions === 'number' && Number.isFinite(s.totalQuestions)
        ? Math.max(0, Math.floor(s.totalQuestions))
        : 0;
    const c =
      typeof s.totalCorrect === 'number' && Number.isFinite(s.totalCorrect)
        ? Math.max(0, Math.min(q, Math.floor(s.totalCorrect)))
        : 0;
    return sum + c;
  }, 0);
}

function countTotalCompletedQuests(state: PlayerState): number {
  return (
    state.completedQuestSetIds.length +
    (state.completedRadicalIds?.length ?? 0) +
    (state.completedMeasureIds?.length ?? 0) +
    (state.completedEnglishRootIds?.length ?? 0) +
    (state.completedGrammarIds?.length ?? 0) +
    (state.completedSpellingIds?.length ?? 0) +
    (state.completedEnglishChapterIds?.length ?? 0) +
    (state.completedBarModelIds?.length ?? 0) +
    (state.completedSentencePatternIds?.length ?? 0) +
    (state.completedChapterEpisodeIds?.length ?? 0) +
    countClearedAllLogicModules(state)
  );
}

function countReadingAndChapters(state: PlayerState): number {
  const readingDone = state.completedQuestSetIds.filter(
    (id) => id.includes('-read-') || id.startsWith('en-read') || id.startsWith('zh-read'),
  ).length;
  return (
    readingDone +
    (state.completedChapterEpisodeIds?.length ?? 0) +
    (state.completedEnglishChapterIds?.length ?? 0)
  );
}

function countMasteredFluencyFacts(state: PlayerState): number {
  const map = state.mathFactMastery ?? {};
  let count = 0;
  for (let a = 2; a <= 12; a += 1) {
    for (let b = 2; b <= 12; b += 1) {
      const entry = map[getFactHeatmapKey(a, b)];
      if (classifyHeatmapCell(entry) === 'mastered') count += 1;
    }
  }
  return count;
}

function getBestTowerScore(state: PlayerState): number {
  const scores = Object.values(state.towerHighScores ?? {}).filter(
    (v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0,
  );
  return scores.length > 0 ? Math.max(...scores) : 0;
}

function getRoomDesignerProgress(state: PlayerState): number {
  const placedCritters = new Set(
    (state.critterRoom?.slots ?? []).filter((id): id is string => typeof id === 'string' && id.length > 0),
  ).size;
  const placedDecor = new Set(
    (state.critterRoom?.decorIds ?? []).filter((id): id is string => typeof id === 'string' && id.length > 0),
  ).size;
  return Math.min(4, placedCritters) + Math.min(3, placedDecor);
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Learning Milestones
  {
    id: 'ach-first-quest',
    category: 'learning',
    emoji: '🚀',
    title: 'First Quest Clear',
    zhTitle: '新手出擊',
    description: '完成任意 1 個學習關卡',
    target: 1,
    rewardType: 'tokens',
    rewardAmount: 15,
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    getCurrent: countTotalCompletedQuests,
  },
  {
    id: 'ach-10-quests',
    category: 'learning',
    emoji: '🌟',
    title: 'Quest Explorer',
    zhTitle: '闖關探險家',
    description: '累積完成 10 個不同學習關卡',
    target: 10,
    rewardType: 'tokens',
    rewardAmount: 25,
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    getCurrent: countTotalCompletedQuests,
  },
  {
    id: 'ach-25-quests',
    category: 'learning',
    emoji: '🏅',
    title: 'Quest Champion',
    zhTitle: '全能闖關王',
    description: '累積完成 25 個不同學習關卡',
    target: 25,
    rewardType: 'starDust',
    rewardAmount: 20,
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    getCurrent: countTotalCompletedQuests,
  },
  {
    id: 'ach-words-30',
    category: 'learning',
    emoji: '📖',
    title: 'Word Sprout',
    zhTitle: '字彙小嫩芽',
    description: '學習並記錄 30 個英／中字詞或數學技巧',
    target: 30,
    rewardType: 'tokens',
    rewardAmount: 20,
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    getCurrent: (s) => Object.keys(s.wordMastery).length,
  },
  {
    id: 'ach-words-100',
    category: 'learning',
    emoji: '🎓',
    title: 'Bilingual Scholar',
    zhTitle: '雙語小學霸',
    description: '累積學習 100 個英／中字詞或數學技巧',
    target: 100,
    rewardType: 'starDust',
    rewardAmount: 25,
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    getCurrent: (s) => Object.keys(s.wordMastery).length,
  },
  {
    id: 'ach-words-250',
    category: 'learning',
    emoji: '👑',
    title: 'Grand Lexicon',
    zhTitle: '詞庫大百科',
    description: '累積學習 250 個英／中字詞或數學技巧',
    target: 250,
    rewardType: 'starDust',
    rewardAmount: 45,
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    getCurrent: (s) => Object.keys(s.wordMastery).length,
  },

  // Streak Milestones
  {
    id: 'ach-streak-3',
    category: 'streak',
    emoji: '🔥',
    title: '3-Day Spark',
    zhTitle: '連勝小火花',
    description: '連續 3 天完成學習任務',
    target: 3,
    rewardType: 'tokens',
    rewardAmount: 20,
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    getCurrent: (s) => s.streakDays ?? 0,
  },
  {
    id: 'ach-streak-7',
    category: 'streak',
    emoji: '⚡',
    title: '7-Day Superstar',
    zhTitle: '一週不間斷',
    description: '連續 7 天完成學習任務',
    target: 7,
    rewardType: 'starDust',
    rewardAmount: 25,
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    getCurrent: (s) => s.streakDays ?? 0,
  },
  {
    id: 'ach-streak-14',
    category: 'streak',
    emoji: '🌠',
    title: '14-Day Unstoppable',
    zhTitle: '雙週毅力之星',
    description: '連續 14 天完成學習任務',
    target: 14,
    rewardType: 'starDust',
    rewardAmount: 50,
    accentHex: '#9333EA',
    bgHex: '#FAF5FF',
    getCurrent: (s) => s.streakDays ?? 0,
  },

  // Collection Milestones
  {
    id: 'ach-vault-10',
    category: 'collection',
    emoji: '🎁',
    title: 'Pocket Collector',
    zhTitle: '盲盒初體驗',
    description: '在收藏櫃解鎖 10 隻不同盲盒夥伴',
    target: 10,
    rewardType: 'tokens',
    rewardAmount: 15,
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    getCurrent: countOwnedCollectibles,
  },
  {
    id: 'ach-vault-35',
    category: 'collection',
    emoji: '🧸',
    title: 'Plushie Curator',
    zhTitle: '盲盒收藏家',
    description: '在收藏櫃解鎖 35 隻不同盲盒夥伴',
    target: 35,
    rewardType: 'starDust',
    rewardAmount: 25,
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    getCurrent: countOwnedCollectibles,
  },
  {
    id: 'ach-vault-80',
    category: 'collection',
    emoji: '💎',
    title: 'Vault Legend',
    zhTitle: '傳說級收藏館',
    description: '在收藏櫃解鎖 80 隻不同盲盒夥伴',
    target: 80,
    rewardType: 'starDust',
    rewardAmount: 60,
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    getCurrent: countOwnedCollectibles,
  },
  {
    id: 'ach-shiny-1',
    category: 'collection',
    emoji: '✨',
    title: 'First Shiny Foil',
    zhTitle: '閃亮亮初合成',
    description: '合成第 1 張金色閃卡（Shiny）',
    target: 1,
    rewardType: 'starDust',
    rewardAmount: 20,
    accentHex: '#CA8A04',
    bgHex: '#FEFCE8',
    getCurrent: countShinyCollectibles,
  },
  {
    id: 'ach-shiny-5',
    category: 'collection',
    emoji: '🌈',
    title: 'Shiny Atelier',
    zhTitle: '閃卡工坊大師',
    description: '累積擁有 5 張金色閃卡（Shiny）',
    target: 5,
    rewardType: 'starDust',
    rewardAmount: 45,
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    getCurrent: countShinyCollectibles,
  },
  {
    id: 'ach-pack-crown-1',
    category: 'collection',
    emoji: '👑',
    title: 'Pack Crown Champion',
    zhTitle: '全套制霸皇冠',
    description: '集滿任 1 個盲盒系列全部夥伴',
    target: 1,
    rewardType: 'starDust',
    rewardAmount: 30,
    accentHex: '#B45309',
    bgHex: '#FEF3C7',
    getCurrent: countCompletedPacks,
  },

  // Chinese & Reading Specialty Milestones
  {
    id: 'ach-radicals-3',
    category: 'chinese',
    emoji: '🧩',
    title: 'Radical Architect',
    zhTitle: '偏旁建築師',
    description: '解鎖 3 組中文偏旁部首家族',
    target: 3,
    rewardType: 'tokens',
    rewardAmount: 20,
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    getCurrent: (s) => s.completedRadicalIds?.length ?? 0,
  },
  {
    id: 'ach-stories-3',
    category: 'chinese',
    emoji: '📚',
    title: 'Story Bookworm',
    zhTitle: '閱讀小書蟲',
    description: '完成 3 篇閱讀理解短文或章節微小說',
    target: 3,
    rewardType: 'tokens',
    rewardAmount: 20,
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    getCurrent: countReadingAndChapters,
  },
  {
    id: 'ach-measure-3',
    category: 'chinese',
    emoji: '📏',
    title: 'Measure & Idiom Pro',
    zhTitle: '量詞成語達人',
    description: '完成 3 組中文量詞大作戰或成語情境特訓',
    target: 3,
    rewardType: 'starDust',
    rewardAmount: 25,
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    getCurrent: (s) => s.completedMeasureIds?.length ?? 0,
  },

  // Phase 5–6 Expansion Milestones (+12 -> 30 Total)
  {
    id: 'ach-spelling-1',
    category: 'learning',
    emoji: '🐝',
    title: 'Spelling Spark',
    zhTitle: '拼字小萌芽',
    description: '完成 1 組英文聽音拼字館關卡',
    target: 1,
    rewardType: 'tokens',
    rewardAmount: 15,
    accentHex: '#CA8A04',
    bgHex: '#FEFCE8',
    getCurrent: (s) => s.completedSpellingIds?.length ?? 0,
  },
  {
    id: 'ach-spelling-8',
    category: 'learning',
    emoji: '🏆',
    title: 'Spelling Bee Star',
    zhTitle: '拼字大賽之星',
    description: '累積完成 8 組英文聽音拼字館關卡',
    target: 8,
    rewardType: 'starDust',
    rewardAmount: 30,
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    getCurrent: (s) => s.completedSpellingIds?.length ?? 0,
  },
  {
    id: 'ach-en-chapters-5',
    category: 'learning',
    emoji: '📘',
    title: 'English Novel Explorer',
    zhTitle: '英文小說探險家',
    description: '完成 5 集原創英文連貫章節小說',
    target: 5,
    rewardType: 'tokens',
    rewardAmount: 25,
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    getCurrent: (s) => s.completedEnglishChapterIds?.length ?? 0,
  },
  {
    id: 'ach-math-fluency-10',
    category: 'learning',
    emoji: '⚡',
    title: 'Fact Fluency Flash',
    zhTitle: '心算閃電手',
    description: '在 12×12 心算熱力圖精熟 10 個算式',
    target: 10,
    rewardType: 'tokens',
    rewardAmount: 20,
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    getCurrent: countMasteredFluencyFacts,
  },
  {
    id: 'ach-math-fluency-40',
    category: 'learning',
    emoji: '🔥',
    title: 'Mental Math Master',
    zhTitle: '心算熱力圖大師',
    description: '在 12×12 心算熱力圖精熟 40 個算式',
    target: 40,
    rewardType: 'starDust',
    rewardAmount: 40,
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    getCurrent: countMasteredFluencyFacts,
  },
  {
    id: 'ach-bar-model-4',
    category: 'learning',
    emoji: '📊',
    title: 'Bar Model Builder',
    zhTitle: '線段圖解題能手',
    description: '完成 4 種數學兩步驟線段圖應用題模型',
    target: 4,
    rewardType: 'tokens',
    rewardAmount: 25,
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    getCurrent: (s) => s.completedBarModelIds?.length ?? 0,
  },
  {
    id: 'ach-bar-model-8',
    category: 'learning',
    emoji: '🧠',
    title: 'Two-Step Strategist',
    zhTitle: '兩步驟圖解大師',
    description: '全制霸 8 種數學兩步驟線段圖應用題模型',
    target: 8,
    rewardType: 'starDust',
    rewardAmount: 35,
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    getCurrent: (s) => s.completedBarModelIds?.length ?? 0,
  },
  {
    id: 'ach-tower-1000',
    category: 'streak',
    emoji: '🏰',
    title: 'Tower Defense Guardian',
    zhTitle: '夥伴防線守護者',
    description: '在夥伴防線塔防單局達成 1,000 分以上',
    target: 1000,
    rewardType: 'tokens',
    rewardAmount: 25,
    accentHex: '#DC2626',
    bgHex: '#FEF2F2',
    getCurrent: getBestTowerScore,
  },
  {
    id: 'ach-vault-150',
    category: 'collection',
    emoji: '🌟',
    title: 'Grand Vault Curator',
    zhTitle: '百五盲盒大館長',
    description: '在收藏櫃解鎖 150 隻不同盲盒夥伴',
    target: 150,
    rewardType: 'starDust',
    rewardAmount: 75,
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    getCurrent: countOwnedCollectibles,
  },
  {
    id: 'ach-room-designer',
    category: 'collection',
    emoji: '🏠',
    title: 'Cozy Room Designer',
    zhTitle: '夢幻小屋設計師',
    description: '在盲盒小屋同時擺放 4 隻夥伴與 3 件免費擺飾',
    target: 7,
    rewardType: 'tokens',
    rewardAmount: 25,
    accentHex: '#EC4899',
    bgHex: '#FDF2F8',
    getCurrent: getRoomDesignerProgress,
  },
  {
    id: 'ach-sentence-pattern-4',
    category: 'chinese',
    emoji: '🧱',
    title: 'Sentence Pattern Pro',
    zhTitle: '關聯詞句型建築師',
    description: '完成 4 組中文句型與關聯詞魔方關卡',
    target: 4,
    rewardType: 'tokens',
    rewardAmount: 25,
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    getCurrent: (s) => s.completedSentencePatternIds?.length ?? 0,
  },
  {
    id: 'ach-zh-chapters-15',
    category: 'chinese',
    emoji: '🏮',
    title: 'Chapter Story Master',
    zhTitle: '章節小說全能讀者',
    description: '累積完成 15 集原創中文章節微小說',
    target: 15,
    rewardType: 'starDust',
    rewardAmount: 40,
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    getCurrent: (s) => s.completedChapterEpisodeIds?.length ?? 0,
  },

  // Phase 7C Logic & Spatial Lab Milestones (+8 -> 38 Total)
  {
    id: 'ach-spatial-first',
    category: 'logic',
    emoji: '📐',
    title: 'Spatial Spark',
    zhTitle: '空間偵探新手',
    description: '通關任意 1 個空間視覺推理模組',
    target: 1,
    rewardType: 'tokens',
    rewardAmount: 15,
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    getCurrent: countClearedSpatialModules,
  },
  {
    id: 'ach-spatial-all',
    category: 'logic',
    emoji: '🧊',
    title: 'Spatial Master',
    zhTitle: '空間幾何全制霸',
    description: '通關全部 4 個空間視覺推理模組',
    target: 4,
    rewardType: 'starDust',
    rewardAmount: 35,
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    getCurrent: countClearedSpatialModules,
  },
  {
    id: 'ach-logic-first',
    category: 'logic',
    emoji: '⚖️',
    title: 'Logic Detective',
    zhTitle: '邏輯推理新手',
    description: '通關任意 1 個邏輯推演與運算模組',
    target: 1,
    rewardType: 'tokens',
    rewardAmount: 15,
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    getCurrent: countClearedLogicReasoningModules,
  },
  {
    id: 'ach-logic-all',
    category: 'logic',
    emoji: '🤖',
    title: 'Logic & Coding Pro',
    zhTitle: '邏輯運算全制霸',
    description: '通關全部 4 個邏輯推演與運算模組',
    target: 4,
    rewardType: 'starDust',
    rewardAmount: 35,
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    getCurrent: countClearedLogicReasoningModules,
  },
  {
    id: 'ach-logic-lab-8',
    category: 'logic',
    emoji: '🧠',
    title: 'Grand Thinker',
    zhTitle: '邏輯空間大滿貫',
    description: '通關全部 8 個邏輯與空間思維館模組',
    target: 8,
    rewardType: 'starDust',
    rewardAmount: 60,
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    getCurrent: countClearedAllLogicModules,
  },
  {
    id: 'ach-logic-runs-5',
    category: 'logic',
    emoji: '🎯',
    title: 'Puzzle Enthusiast',
    zhTitle: '燒腦解謎達人',
    description: '在邏輯與空間思維館完成 5 回合挑戰',
    target: 5,
    rewardType: 'tokens',
    rewardAmount: 20,
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    getCurrent: countTotalLogicRuns,
  },
  {
    id: 'ach-logic-correct-25',
    category: 'logic',
    emoji: '💡',
    title: 'Sharp Mind',
    zhTitle: '靈光一閃小博士',
    description: '在邏輯與空間思維館累計答對 25 題',
    target: 25,
    rewardType: 'tokens',
    rewardAmount: 25,
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    getCurrent: countTotalLogicCorrect,
  },
  {
    id: 'ach-logic-correct-60',
    category: 'logic',
    emoji: '🌟',
    title: 'Genius Strategist',
    zhTitle: '超強思維戰略家',
    description: '在邏輯與空間思維館累計答對 60 題',
    target: 60,
    rewardType: 'starDust',
    rewardAmount: 45,
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    getCurrent: countTotalLogicCorrect,
  },
];

export function evaluateAchievements(state: PlayerState): AchievementProgress[] {
  const claimedSet = new Set(state.claimedAchievementIds ?? []);
  return ACHIEVEMENTS.map((def) => {
    const raw = def.getCurrent(state);
    const rawCurrent = Number.isFinite(raw) ? Math.max(0, raw) : 0;
    const current = Math.min(def.target, rawCurrent);
    const unlocked = rawCurrent >= def.target;
    const claimed = claimedSet.has(def.id);
    const pct = Math.min(100, Math.round((current / Math.max(1, def.target)) * 100));
    return {
      def,
      current,
      target: def.target,
      pct,
      unlocked,
      claimed,
      claimable: unlocked && !claimed,
    };
  });
}

export function getClaimableAchievementCount(state: PlayerState): number {
  return evaluateAchievements(state).filter((a) => a.claimable).length;
}

export type ClaimAchievementResult =
  | {
      ok: true;
      state: PlayerState;
      achievement: AchievementDefinition;
      rewardType: AchievementRewardType;
      rewardAmount: number;
    }
  | { ok: false; reason: 'not_found' | 'not_unlocked' | 'already_claimed' };

/**
 * Lifetime once-per-badge reward claim (strict anti-farming check).
 */
export function claimAchievementReward(
  state: PlayerState,
  achievementId: string,
): ClaimAchievementResult {
  const def = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!def) return { ok: false, reason: 'not_found' };

  const prevClaimed = state.claimedAchievementIds ?? [];
  if (prevClaimed.includes(achievementId)) {
    return { ok: false, reason: 'already_claimed' };
  }

  const raw = def.getCurrent(state);
  if (!Number.isFinite(raw) || raw < def.target) {
    return { ok: false, reason: 'not_unlocked' };
  }

  const nextState: PlayerState = {
    ...state,
    claimedAchievementIds: [...prevClaimed, achievementId],
    ...(def.rewardType === 'tokens'
      ? { tokens: state.tokens + def.rewardAmount }
      : { starDust: (state.starDust ?? 0) + def.rewardAmount }),
  };

  return {
    ok: true,
    state: nextState,
    achievement: def,
    rewardType: def.rewardType,
    rewardAmount: def.rewardAmount,
  };
}

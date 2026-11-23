import { getCollectiblesByPack, MYSTERY_PACKS } from './packs';
import type { PlayerState } from './types';

export type AchievementCategory = 'learning' | 'streak' | 'collection' | 'chinese';

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

function countTotalCompletedQuests(state: PlayerState): number {
  return (
    state.completedQuestSetIds.length +
    (state.completedRadicalIds?.length ?? 0) +
    (state.completedMeasureIds?.length ?? 0) +
    (state.completedChapterEpisodeIds?.length ?? 0)
  );
}

function countReadingAndChapters(state: PlayerState): number {
  const readingDone = state.completedQuestSetIds.filter(
    (id) => id.includes('-read-') || id.startsWith('en-read') || id.startsWith('zh-read'),
  ).length;
  return readingDone + (state.completedChapterEpisodeIds?.length ?? 0);
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
];

export function evaluateAchievements(state: PlayerState): AchievementProgress[] {
  const claimedSet = new Set(state.claimedAchievementIds ?? []);
  return ACHIEVEMENTS.map((def) => {
    const rawCurrent = Math.max(0, def.getCurrent(state));
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

  if (def.getCurrent(state) < def.target) {
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

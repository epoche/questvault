import { ALL_LOGIC_MODULES } from '../subjects/logic/logicTypes';
import { ACHIEVEMENTS, evaluateAchievements } from './achievements';
import { computeWeeklySnapshot } from './analytics';
import { COLLECTIBLES } from './packs';
import type { PlayerState } from './types';

export interface CertificateSummary {
  displayName: string;
  equippedId: string;
  equippedIsShiny: boolean;
  weeklyEnRuns: number;
  weeklyMathRuns: number;
  weeklyZhRuns: number;
  weeklyTotalRuns: number;
  weeklyTokens: number;
  streakDays: number;
  vaultOwned: number;
  vaultTotal: number;
  shinyCount: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  logicModulesCleared: number;
  logicModulesTotal: number;
  zhDate: string;
  enDate: string;
  honorTitleZh: string;
  honorTitleEn: string;
}

const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatCertificateDates(date: Date): { zhDate: string; enDate: string } {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const monthName = EN_MONTHS[date.getMonth()] ?? 'January';
  return {
    zhDate: `${y} 年 ${m} 月 ${d} 日`,
    enDate: `${monthName} ${d}, ${y}`,
  };
}

const VALID_LOGIC_ID_SET = new Set<string>(ALL_LOGIC_MODULES.map((m) => m.id));

export function buildCertificateSummary(
  player: PlayerState,
  now: Date = new Date(),
): CertificateSummary {
  const weekly = computeWeeklySnapshot(player, now.toISOString());
  const displayName = player.displayName.trim() || 'QuestVault Scholar';
  const vaultOwned = Object.values(player.vault).filter((c) => c > 0).length;
  const shinyCount = Object.values(player.shinyVault ?? {}).filter(Boolean).length;
  const equippedId = player.equippedCollectibleId;
  const equippedIsShiny = Boolean(
    (player.vault[equippedId] ?? 0) > 0 && player.shinyVault?.[equippedId],
  );
  const achievementsUnlocked = evaluateAchievements(player).filter((a) => a.unlocked).length;
  const streakDays = Math.max(0, player.streakDays ?? 0);
  const logicModulesCleared = new Set(
    (Array.isArray(player.completedLogicModuleIds) ? player.completedLogicModuleIds : []).filter(
      (id) => typeof id === 'string' && VALID_LOGIC_ID_SET.has(id),
    ),
  ).size;

  let honorTitleZh = '勤學小冒險家';
  let honorTitleEn = 'Rising Quest Scholar';
  if (weekly.totalRuns >= 10 || achievementsUnlocked >= 18) {
    honorTitleZh = '雙語全能榮譽金星';
    honorTitleEn = 'Grand Bilingual Superstar';
  } else if (weekly.totalRuns >= 5 || streakDays >= 5 || achievementsUnlocked >= 8) {
    honorTitleZh = '三科學習模範生';
    honorTitleEn = 'Tri-Subject Honor Champion';
  } else if (weekly.totalRuns >= 1 || vaultOwned >= 5 || logicModulesCleared >= 1) {
    honorTitleZh = '閃耀學習之星';
    honorTitleEn = 'Shining Learning Star';
  }

  const { zhDate, enDate } = formatCertificateDates(now);

  return {
    displayName,
    equippedId,
    equippedIsShiny,
    weeklyEnRuns: weekly.runsBySubject.english,
    weeklyMathRuns: weekly.runsBySubject.math,
    weeklyZhRuns: weekly.runsBySubject.chinese,
    weeklyTotalRuns: weekly.totalRuns,
    weeklyTokens: weekly.tokensEarned,
    streakDays,
    vaultOwned,
    vaultTotal: COLLECTIBLES.length,
    shinyCount,
    achievementsUnlocked,
    achievementsTotal: ACHIEVEMENTS.length,
    logicModulesCleared,
    logicModulesTotal: ALL_LOGIC_MODULES.length,
    zhDate,
    enDate,
    honorTitleZh,
    honorTitleEn,
  };
}

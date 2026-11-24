import type {
  AdventureMilestoneDays,
  PlayerState,
  WeeklyAdventureState,
} from './types';

export const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface AdventureMilestoneMeta {
  days: AdventureMilestoneDays;
  tokens: number;
  emoji: string;
  label: string;
  zhLabel: string;
  unlocksDecor?: boolean;
}

export const ADVENTURE_MILESTONES: readonly AdventureMilestoneMeta[] = [
  {
    days: 3,
    tokens: 20,
    emoji: '🥉',
    label: 'Bronze Star Chest',
    zhLabel: '銅星寶箱',
  },
  {
    days: 5,
    tokens: 35,
    emoji: '🥈',
    label: 'Silver Moon Chest',
    zhLabel: '銀月寶箱',
  },
  {
    days: 7,
    tokens: 55,
    emoji: '🥇',
    label: 'Golden Crown Chest',
    zhLabel: '黃金王冠大寶箱',
    unlocksDecor: true,
  },
] as const;

/**
 * 4 special room decor sticker IDs awarded on completing 7-day Adventure Map weeks.
 * (Rendered in CritterRoomArt alongside the 12 starter decor stickers in Phase 9B.)
 */
export const ADVENTURE_REWARD_DECOR_IDS = [
  'decor-golden-trophy',
  'decor-starlight-string',
  'decor-boba-bar',
  'decor-magic-orrery',
] as const;

const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const DAY_LABELS_ZH = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'] as const;

export function parseDateKeyParts(dateKey: string): { y: number; m: number; d: number } | null {
  if (!DATE_KEY_RE.test(dateKey)) return null;
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

function formatUtcDateKey(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * DST-safe ISO week key (YYYY-Www) derived strictly from a YYYY-MM-DD local date key.
 */
export function getIsoWeekKeyFromDateKey(dateKey: string): string {
  const parts = parseDateKeyParts(dateKey);
  const utcDate = parts
    ? new Date(Date.UTC(parts.y, parts.m - 1, parts.d))
    : new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const dayNum = utcDate.getUTCDay() || 7; // Mon=1..Sun=7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = Date.UTC(utcDate.getUTCFullYear(), 0, 1);
  const weekNo = Math.ceil(((utcDate.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Returns the 7 ordered YYYY-MM-DD date keys [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
 * for the ISO week containing `todayKey`.
 */
export function getWeekDateKeys(todayKey: string): string[] {
  const parts = parseDateKeyParts(todayKey);
  const base = parts
    ? new Date(Date.UTC(parts.y, parts.m - 1, parts.d))
    : new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const dayNum = base.getUTCDay() || 7; // Mon=1..Sun=7
  base.setUTCDate(base.getUTCDate() - (dayNum - 1));
  const result: string[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(base.getTime());
    d.setUTCDate(base.getUTCDate() + i);
    result.push(formatUtcDateKey(d));
  }
  return result;
}

export function getNormalizedWeeklyAdventure(
  player: PlayerState,
  todayKey: string,
): WeeklyAdventureState {
  const weekKey = getIsoWeekKeyFromDateKey(todayKey);
  const validDates = new Set(getWeekDateKeys(todayKey));
  const existing = player.weeklyAdventure;
  if (!existing || existing.weekKey !== weekKey) {
    return {
      weekKey,
      stampedDates: [],
      claimedMilestones: [],
      subjectsByDate: {},
      makeupUsed: false,
    };
  }

  const stampedDates = Array.from(
    new Set((existing.stampedDates ?? []).filter((d) => validDates.has(d))),
  ).sort();

  const claimedMilestones = Array.from(
    new Set(
      (existing.claimedMilestones ?? []).filter(
        (m): m is AdventureMilestoneDays => m === 3 || m === 5 || m === 7,
      ),
    ),
  ).sort((a, b) => a - b);

  const subjectsByDate: Record<string, string[]> = {};
  if (existing.subjectsByDate && typeof existing.subjectsByDate === 'object') {
    for (const [dk, arr] of Object.entries(existing.subjectsByDate)) {
      if (!validDates.has(dk) || !Array.isArray(arr)) continue;
      const cleaned = Array.from(
        new Set(arr.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)),
      );
      if (cleaned.length > 0) {
        subjectsByDate[dk] = cleaned;
      }
    }
  }

  return {
    weekKey,
    stampedDates,
    claimedMilestones,
    subjectsByDate,
    makeupUsed: Boolean(existing.makeupUsed),
  };
}

/**
 * Records today's adventure stamp when a player completes any learning quest
 * (English, Math, Chinese, Logic & Spatial, Fact Fluency, or 5-Min Warm-Up).
 * Also records distinct subject/activity tags per date to unlock the 1/week free makeup star.
 */
export function recordAdventureStamp(
  player: PlayerState,
  todayKey: string,
  activityTag: string,
): PlayerState {
  if (!parseDateKeyParts(todayKey)) return player;
  const current = getNormalizedWeeklyAdventure(player, todayKey);
  const stampedDates = current.stampedDates.includes(todayKey)
    ? current.stampedDates
    : [...current.stampedDates, todayKey].sort();

  const safeTag = activityTag.trim().toLowerCase() || 'quest';
  const prevTags = current.subjectsByDate?.[todayKey] ?? [];
  const nextTags = prevTags.includes(safeTag) ? prevTags : [...prevTags, safeTag];

  return {
    ...player,
    weeklyAdventure: {
      ...current,
      stampedDates,
      subjectsByDate: {
        ...(current.subjectsByDate ?? {}),
        [todayKey]: nextTags,
      },
    },
  };
}

export interface AdventureDayCell {
  dateKey: string;
  dayIndex: number;
  shortEn: string;
  shortZh: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  stamped: boolean;
}

export interface AdventureMilestoneStatus extends AdventureMilestoneMeta {
  unlocked: boolean;
  claimed: boolean;
  claimable: boolean;
}

export interface AdventureMapSnapshot {
  weekKey: string;
  days: AdventureDayCell[];
  stampedCount: number;
  makeupEarned: boolean;
  makeupUsed: boolean;
  makeupAvailable: boolean;
  eligibleMakeupDates: string[];
  milestones: AdventureMilestoneStatus[];
  claimableCount: number;
}

export function getAdventureMapSnapshot(
  player: PlayerState,
  todayKey: string,
): AdventureMapSnapshot {
  const adv = getNormalizedWeeklyAdventure(player, todayKey);
  const weekDates = getWeekDateKeys(todayKey);
  const stampedSet = new Set(adv.stampedDates);

  const days: AdventureDayCell[] = weekDates.map((dateKey, idx) => ({
    dateKey,
    dayIndex: idx,
    shortEn: DAY_LABELS_EN[idx],
    shortZh: DAY_LABELS_ZH[idx],
    isToday: dateKey === todayKey,
    isPast: dateKey < todayKey,
    isFuture: dateKey > todayKey,
    stamped: stampedSet.has(dateKey),
  }));

  const stampedCount = days.filter((d) => d.stamped).length;
  const makeupEarned = Object.values(adv.subjectsByDate ?? {}).some((tags) => tags.length >= 2);
  const makeupUsed = Boolean(adv.makeupUsed);
  const eligibleMakeupDates = days
    .filter((d) => d.isPast && !d.stamped)
    .map((d) => d.dateKey);
  const makeupAvailable = makeupEarned && !makeupUsed && eligibleMakeupDates.length > 0;

  const claimedSet = new Set(adv.claimedMilestones);
  const milestones: AdventureMilestoneStatus[] = ADVENTURE_MILESTONES.map((m) => {
    const unlocked = stampedCount >= m.days;
    const claimed = claimedSet.has(m.days);
    return {
      ...m,
      unlocked,
      claimed,
      claimable: unlocked && !claimed,
    };
  });

  const claimableCount = milestones.filter((m) => m.claimable).length;

  return {
    weekKey: adv.weekKey,
    days,
    stampedCount,
    makeupEarned,
    makeupUsed,
    makeupAvailable,
    eligibleMakeupDates,
    milestones,
    claimableCount,
  };
}

/**
 * Applies the 1-per-week free makeup star to stamp a missed past date in the current week.
 */
export function applyAdventureMakeupStamp(
  player: PlayerState,
  targetDateKey: string,
  todayKey: string,
): { state: PlayerState; applied: boolean } {
  const snap = getAdventureMapSnapshot(player, todayKey);
  if (!snap.makeupAvailable || !snap.eligibleMakeupDates.includes(targetDateKey)) {
    return { state: player, applied: false };
  }

  const adv = getNormalizedWeeklyAdventure(player, todayKey);
  const stampedDates = Array.from(new Set([...adv.stampedDates, targetDateKey])).sort();

  return {
    state: {
      ...player,
      weeklyAdventure: {
        ...adv,
        stampedDates,
        makeupUsed: true,
      },
    },
    applied: true,
  };
}

/**
 * Claims a 3-day, 5-day, or 7-day weekly adventure chest.
 * Strictly idempotent per ISO weekKey: claiming an already-claimed or locked milestone is a no-op.
 */
export function claimAdventureMilestone(
  player: PlayerState,
  milestoneDays: AdventureMilestoneDays,
  todayKey: string,
): { state: PlayerState; tokensAwarded: number; unlockedDecorId: string | null } {
  const snap = getAdventureMapSnapshot(player, todayKey);
  const target = snap.milestones.find((m) => m.days === milestoneDays);
  if (!target || !target.claimable) {
    return { state: player, tokensAwarded: 0, unlockedDecorId: null };
  }

  const adv = getNormalizedWeeklyAdventure(player, todayKey);
  const nextClaimed = Array.from(new Set([...adv.claimedMilestones, milestoneDays])).sort(
    (a, b) => a - b,
  ) as AdventureMilestoneDays[];

  let unlockedDecorId: string | null = null;
  let nextUnlockedDecorIds = player.unlockedRoomDecorIds ?? [];
  let nextWeeksCleared = player.adventureWeeksCleared ?? 0;

  if (milestoneDays === 7) {
    nextWeeksCleared += 1;
    const nextLocked = ADVENTURE_REWARD_DECOR_IDS.find((id) => !nextUnlockedDecorIds.includes(id));
    if (nextLocked) {
      unlockedDecorId = nextLocked;
      nextUnlockedDecorIds = [...nextUnlockedDecorIds, nextLocked];
    }
  }

  return {
    state: {
      ...player,
      tokens: player.tokens + target.tokens,
      weeklyAdventure: {
        ...adv,
        claimedMilestones: nextClaimed,
      },
      ...(nextUnlockedDecorIds.length > 0 ? { unlockedRoomDecorIds: nextUnlockedDecorIds } : {}),
      ...(nextWeeksCleared > 0 ? { adventureWeeksCleared: nextWeeksCleared } : {}),
    },
    tokensAwarded: target.tokens,
    unlockedDecorId,
  };
}

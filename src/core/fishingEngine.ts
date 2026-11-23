import { COLLECTIBLES, getCollectibleById } from './packs';
import type { Rarity } from './types';

export type StarSeaCatchId =
  | 'star-clownfish'
  | 'boba-jelly'
  | 'mochi-puffer'
  | 'lantern-shrimp'
  | 'moon-seahorse'
  | 'coral-turtle'
  | 'crystal-octopus'
  | 'prism-ray'
  | 'aurora-dolphin'
  | 'comet-koi'
  | 'nebula-narwhal'
  | 'celestial-whale'
  | 'treasure-clam'
  | 'chroma-leviathan';

export interface StarSeaSpecies {
  id: StarSeaCatchId;
  nameEn: string;
  nameZh: string;
  rarity: Rarity;
  minLbs: number;
  maxLbs: number;
  weight: number;
  accentHex: string;
  bgHex: string;
}

export const FISHING_TOTAL_CASTS = 10;

export const STAR_SEA_SPECIES: StarSeaSpecies[] = [
  {
    id: 'star-clownfish',
    nameEn: 'Starlight Clownfish',
    nameZh: '星砂小丑魚',
    rarity: 'common',
    minLbs: 4,
    maxLbs: 11,
    weight: 22,
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
  },
  {
    id: 'boba-jelly',
    nameEn: 'Boba Pearl Jelly',
    nameZh: '珍珠水母',
    rarity: 'common',
    minLbs: 6,
    maxLbs: 14,
    weight: 20,
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
  },
  {
    id: 'mochi-puffer',
    nameEn: 'Mochi Pufferfish',
    nameZh: '麻糬河豚',
    rarity: 'common',
    minLbs: 7,
    maxLbs: 16,
    weight: 18,
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
  },
  {
    id: 'lantern-shrimp',
    nameEn: 'Lantern Glow Shrimp',
    nameZh: '燈籠光蝦',
    rarity: 'uncommon',
    minLbs: 12,
    maxLbs: 22,
    weight: 14,
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
  },
  {
    id: 'moon-seahorse',
    nameEn: 'Crescent Seahorse',
    nameZh: '弦月海馬',
    rarity: 'uncommon',
    minLbs: 14,
    maxLbs: 25,
    weight: 13,
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
  },
  {
    id: 'coral-turtle',
    nameEn: 'Coral Crown Turtle',
    nameZh: '珊瑚海龜',
    rarity: 'uncommon',
    minLbs: 18,
    maxLbs: 32,
    weight: 12,
    accentHex: '#059669',
    bgHex: '#ECFDF5',
  },
  {
    id: 'crystal-octopus',
    nameEn: 'Crystal Ink Octopus',
    nameZh: '水晶章魚',
    rarity: 'rare',
    minLbs: 28,
    maxLbs: 46,
    weight: 9,
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
  },
  {
    id: 'prism-ray',
    nameEn: 'Prism Star Ray',
    nameZh: '稜鏡鬼蝠魟',
    rarity: 'rare',
    minLbs: 32,
    maxLbs: 54,
    weight: 8,
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
  },
  {
    id: 'aurora-dolphin',
    nameEn: 'Aurora Ribbon Dolphin',
    nameZh: '極光海豚',
    rarity: 'rare',
    minLbs: 38,
    maxLbs: 62,
    weight: 7,
    accentHex: '#0891B2',
    bgHex: '#ECFEFF',
  },
  {
    id: 'comet-koi',
    nameEn: 'Comet Golden Koi',
    nameZh: '彗星金錦鯉',
    rarity: 'epic',
    minLbs: 55,
    maxLbs: 85,
    weight: 5,
    accentHex: '#D97706',
    bgHex: '#FEF3C7',
  },
  {
    id: 'nebula-narwhal',
    nameEn: 'Nebula Horn Narwhal',
    nameZh: '星雲獨角鯨',
    rarity: 'epic',
    minLbs: 65,
    maxLbs: 98,
    weight: 4,
    accentHex: '#6D28D9',
    bgHex: '#EDE9FE',
  },
  {
    id: 'treasure-clam',
    nameEn: 'Starlight Pearl Chest',
    nameZh: '星海珍珠寶箱',
    rarity: 'legendary',
    minLbs: 95,
    maxLbs: 145,
    weight: 3,
    accentHex: '#B45309',
    bgHex: '#FEF3C7',
  },
  {
    id: 'celestial-whale',
    nameEn: 'Celestial Galaxy Whale',
    nameZh: '銀河星際巨鯨',
    rarity: 'legendary',
    minLbs: 120,
    maxLbs: 185,
    weight: 2,
    accentHex: '#1D4ED8',
    bgHex: '#DBEAFE',
  },
  {
    id: 'chroma-leviathan',
    nameEn: 'Chroma Prism Sea Dragon',
    nameZh: '炫彩星海神龍',
    rarity: 'chroma',
    minLbs: 190,
    maxLbs: 280,
    weight: 1,
    accentHex: '#C026D3',
    bgHex: '#FAE8FF',
  },
];

export interface FishingCatchRecord {
  uid: string;
  castNumber: number;
  kind: 'fish' | 'cameo';
  speciesId?: StarSeaCatchId;
  collectibleId?: string;
  isShinyCameo?: boolean;
  nameEn: string;
  nameZh: string;
  rarity: Rarity;
  lbs: number;
  frenzyMultiplier: number;
  accentHex: string;
  bgHex: string;
}

export interface FishingGameState {
  castsUsed: number;
  totalCasts: number;
  totalLbs: number;
  correctAnswers: number;
  attemptsCount: number;
  streak: number;
  bestStreak: number;
  catches: FishingCatchRecord[];
  lastCatch: FishingCatchRecord | null;
}

export function createInitialFishingState(): FishingGameState {
  return {
    castsUsed: 0,
    totalCasts: FISHING_TOTAL_CASTS,
    totalLbs: 0,
    correctAnswers: 0,
    attemptsCount: 0,
    streak: 0,
    bestStreak: 0,
    catches: [],
    lastCatch: null,
  };
}

export function getLureFrenzyMultiplier(streak: number): number {
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

function pickWeightedSpecies(streak: number, rng: () => number): StarSeaSpecies {
  // Higher streak gently boosts rare+ odds (classic Blooket Fishing Frenzy Lure!)
  const luckBoost = streak >= 5 ? 1.8 : streak >= 3 ? 1.35 : 1;
  const weighted = STAR_SEA_SPECIES.map((sp) => ({
    sp,
    w:
      sp.rarity === 'common' || sp.rarity === 'uncommon'
        ? sp.weight
        : sp.weight * luckBoost,
  }));
  const totalW = weighted.reduce((sum, x) => sum + x.w, 0);
  let r = rng() * totalW;
  for (const entry of weighted) {
    r -= entry.w;
    if (r <= 0) return entry.sp;
  }
  return STAR_SEA_SPECIES[0];
}

/**
 * Resolves 1 Fishing Frenzy cast answer.
 * - Correct: consumes 1 cast, reels in either a Star Sea creature OR a surprise Vault Collectible Cameo (18% chance)!
 * - Wrong: resets streak and records attempt without awarding lbs (fish slipped away!), still consumes 1 cast so a 10-cast round finishes crisply.
 */
export function resolveFishingCast(
  state: FishingGameState,
  isCorrect: boolean,
  vault: Record<string, number>,
  shinyVault: Record<string, boolean> = {},
  favoriteCollectibleIds: string[] = [],
  rng: () => number = Math.random,
): { state: FishingGameState; catchRecord: FishingCatchRecord | null } {
  if (state.castsUsed >= state.totalCasts) {
    return { state, catchRecord: null };
  }

  const nextCasts = state.castsUsed + 1;
  const nextAttempts = state.attemptsCount + 1;

  if (!isCorrect) {
    return {
      catchRecord: null,
      state: {
        ...state,
        castsUsed: nextCasts,
        attemptsCount: nextAttempts,
        streak: 0,
        lastCatch: null,
      },
    };
  }

  const nextStreak = state.streak + 1;
  const nextBestStreak = Math.max(state.bestStreak, nextStreak);
  const mult = getLureFrenzyMultiplier(nextStreak);

  // 18% chance for a fun Vault Collectible buddy cameo swimming by with bonus lbs!
  const ownedIds = Object.keys(vault).filter((id) => (vault[id] ?? 0) > 0 && getCollectibleById(id));
  const cameoPool =
    favoriteCollectibleIds.filter((id) => ownedIds.includes(id)).length > 0 && rng() < 0.65
      ? favoriteCollectibleIds.filter((id) => ownedIds.includes(id))
      : ownedIds.length > 0
        ? ownedIds
        : [COLLECTIBLES[0].id];

  let catchRecord: FishingCatchRecord;

  if (rng() < 0.18 && cameoPool.length > 0) {
    const pickedId = cameoPool[Math.floor(rng() * cameoPool.length)];
    const col = getCollectibleById(pickedId) ?? COLLECTIBLES[0];
    const baseLbs = Math.round(45 + rng() * 65);
    const lbs = Math.round(baseLbs * mult);
    catchRecord = {
      uid: `catch-${nextCasts}-${col.id}`,
      castNumber: nextCasts,
      kind: 'cameo',
      collectibleId: col.id,
      isShinyCameo: Boolean(shinyVault[col.id]),
      nameEn: `${col.name} (Buddy Cameo!)`,
      nameZh: `${col.name}（盲盒夥伴客串！）`,
      rarity: col.rarity,
      lbs,
      frenzyMultiplier: mult,
      accentHex: col.accentHex,
      bgHex: col.bgHex,
    };
  } else {
    const sp = pickWeightedSpecies(nextStreak, rng);
    const baseLbs = sp.minLbs + rng() * (sp.maxLbs - sp.minLbs);
    const lbs = Math.max(1, Math.round(baseLbs * mult));
    catchRecord = {
      uid: `catch-${nextCasts}-${sp.id}`,
      castNumber: nextCasts,
      kind: 'fish',
      speciesId: sp.id,
      nameEn: sp.nameEn,
      nameZh: sp.nameZh,
      rarity: sp.rarity,
      lbs,
      frenzyMultiplier: mult,
      accentHex: sp.accentHex,
      bgHex: sp.bgHex,
    };
  }

  return {
    catchRecord,
    state: {
      ...state,
      castsUsed: nextCasts,
      attemptsCount: nextAttempts,
      correctAnswers: state.correctAnswers + 1,
      streak: nextStreak,
      bestStreak: nextBestStreak,
      totalLbs: state.totalLbs + catchRecord.lbs,
      catches: [catchRecord, ...state.catches],
      lastCatch: catchRecord,
    },
  };
}

/**
 * Anti-cheese Token payout: requires at least 1 correct answer (0 correct => 0 Tokens).
 * Scales smoothly with total lbs caught + accuracy/correct count (max ~55 raw Tokens per 10-cast round,
 * further clamped by the shared 150-Token daily Arcade cap in economy.ts).
 */
export function calculateFishingRawTokens(state: FishingGameState): number {
  if (state.correctAnswers <= 0) return 0;
  const fromAnswers = state.correctAnswers * 2;
  const fromWeight = Math.floor(state.totalLbs / 25);
  const streakBonus = state.bestStreak >= 5 ? 6 : state.bestStreak >= 3 ? 3 : 0;
  return Math.min(55, fromAnswers + fromWeight + streakBonus);
}

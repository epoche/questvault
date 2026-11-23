import { getCollectibleById, STARTER_COLLECTIBLE_ID } from './packs';

export const TOWER_SLOT_COUNT = 6;
export const TOWER_MAX_LEVEL = 3;
export const TOWER_MAX_CASTLE_HP = 10;
export const TOWER_STARTING_ENERGY = 35;
export const TOWER_DEPLOY_COST = 25;
export const TOWER_UPGRADE_COSTS: Record<1 | 2, number> = {
  1: 30,
  2: 45,
};
export const TOWER_LEVEL_BASE_POWER: Record<1 | 2 | 3, number> = {
  1: 24,
  2: 44,
  3: 72,
};
export const SHINY_TOWER_MULTIPLIER = 1.25;

export interface TowerSlotState {
  slotIndex: number;
  collectibleId: string | null;
  level: 1 | 2 | 3;
}

export interface TowerWaveDefinition {
  waveNumber: 1 | 2 | 3 | 4 | 5;
  id: string;
  enName: string;
  zhName: string;
  monsterKind: 'slime' | 'cloud-boo' | 'cookie-bot' | 'star-bat' | 'jelly-king';
  monsterCount: number;
  hpPerMonster: number;
  accentHex: string;
  rewardEnergy: number;
  rewardScore: number;
}

export const TOWER_WAVES: TowerWaveDefinition[] = [
  {
    waveNumber: 1,
    id: 'wave-1-slime',
    enName: 'Mint Jelly Slimes',
    zhName: '薄荷果凍史萊姆',
    monsterKind: 'slime',
    monsterCount: 3,
    hpPerMonster: 14,
    accentHex: '#10B981',
    rewardEnergy: 15,
    rewardScore: 150,
  },
  {
    waveNumber: 2,
    id: 'wave-2-boo',
    enName: 'Fluffy Cloud Boos',
    zhName: '軟綿雲朵小幽靈',
    monsterKind: 'cloud-boo',
    monsterCount: 4,
    hpPerMonster: 22,
    accentHex: '#6366F1',
    rewardEnergy: 20,
    rewardScore: 220,
  },
  {
    waveNumber: 3,
    id: 'wave-3-bot',
    enName: 'Crunchy Cookie Bots',
    zhName: '酥脆餅乾機器人',
    monsterKind: 'cookie-bot',
    monsterCount: 4,
    hpPerMonster: 36,
    accentHex: '#EA580C',
    rewardEnergy: 25,
    rewardScore: 300,
  },
  {
    waveNumber: 4,
    id: 'wave-4-bat',
    enName: 'Starlight Flutter Bats',
    zhName: '星空小蝙蝠大軍',
    monsterKind: 'star-bat',
    monsterCount: 5,
    hpPerMonster: 44,
    accentHex: '#7C3AED',
    rewardEnergy: 30,
    rewardScore: 400,
  },
  {
    waveNumber: 5,
    id: 'wave-5-king',
    enName: 'Rainbow Jelly King',
    zhName: '彩虹果凍大王軍團',
    monsterKind: 'jelly-king',
    monsterCount: 5,
    hpPerMonster: 60,
    accentHex: '#DB2777',
    rewardEnergy: 35,
    rewardScore: 550,
  },
];

export function createInitialTowerSlots(): TowerSlotState[] {
  return Array.from({ length: TOWER_SLOT_COUNT }, (_, idx) => ({
    slotIndex: idx,
    collectibleId: null,
    level: 1,
  }));
}

export function getTowerPower(
  slot: TowerSlotState,
  shinyVault?: Record<string, boolean>,
): number {
  if (!slot.collectibleId) return 0;
  const base = TOWER_LEVEL_BASE_POWER[slot.level];
  const isShiny = Boolean(shinyVault?.[slot.collectibleId]);
  return isShiny ? Math.round(base * SHINY_TOWER_MULTIPLIER) : base;
}

export function getTotalDefensePower(
  slots: readonly TowerSlotState[],
  shinyVault?: Record<string, boolean>,
): number {
  return slots.reduce((sum, s) => sum + getTowerPower(s, shinyVault), 0);
}

export function getTowerUpgradeCost(slot: TowerSlotState): number | null {
  if (!slot.collectibleId) return TOWER_DEPLOY_COST;
  if (slot.level === 1) return TOWER_UPGRADE_COSTS[1];
  if (slot.level === 2) return TOWER_UPGRADE_COSTS[2];
  return null;
}

export function calculateQuizEnergyGain(streak: number): number {
  const safeStreak = Number.isFinite(streak) ? Math.max(1, Math.floor(streak)) : 1;
  return 25 + Math.min(15, (safeStreak - 1) * 5);
}

export interface TowerWaveResolution {
  wave: TowerWaveDefinition;
  totalPower: number;
  waveTotalHp: number;
  defeatedMonsters: number;
  leakedMonsters: number;
  castleDamage: number;
  energyGained: number;
  scoreGained: number;
  perfectClear: boolean;
}

/**
 * Pure deterministic wave combat resolution:
 * Compares total critter tower firepower against the incoming wave's monsters.
 */
export function resolveTowerWave(
  slots: readonly TowerSlotState[],
  waveIndex: number,
  shinyVault?: Record<string, boolean>,
): TowerWaveResolution {
  const safeIdx = Number.isFinite(waveIndex)
    ? Math.max(0, Math.min(TOWER_WAVES.length - 1, Math.floor(waveIndex)))
    : 0;
  const wave = TOWER_WAVES[safeIdx];
  const totalPower = getTotalDefensePower(slots, shinyVault);
  const waveTotalHp = wave.monsterCount * wave.hpPerMonster;

  const defeatedMonsters = Math.min(
    wave.monsterCount,
    Math.floor(totalPower / Math.max(1, wave.hpPerMonster)),
  );
  const leakedMonsters = Math.max(0, wave.monsterCount - defeatedMonsters);
  const castleDamage = leakedMonsters * (wave.waveNumber === 5 ? 2 : 1);
  const perfectClear = leakedMonsters === 0;

  const clearRatio = defeatedMonsters / Math.max(1, wave.monsterCount);
  const energyGained = Math.round(wave.rewardEnergy * (0.4 + 0.6 * clearRatio));
  const scoreGained = Math.round(wave.rewardScore * clearRatio) + (perfectClear ? 80 : 0);

  return {
    wave,
    totalPower,
    waveTotalHp,
    defeatedMonsters,
    leakedMonsters,
    castleDamage,
    energyGained,
    scoreGained,
    perfectClear,
  };
}

/**
 * Anti-cheese reward calculation: 0 correct answers ALWAYS yields 0 tokens.
 */
export function calculateTowerRawTokens(
  correctCount: number,
  wavesCleared: number,
  victory: boolean,
): number {
  const safeCorrect = Number.isFinite(correctCount) ? Math.max(0, Math.floor(correctCount)) : 0;
  if (safeCorrect <= 0) return 0;
  const safeWaves = Number.isFinite(wavesCleared)
    ? Math.max(0, Math.min(TOWER_WAVES.length, Math.floor(wavesCleared)))
    : 0;
  const raw = safeCorrect * 3 + safeWaves * 4 + (victory ? 8 : 0);
  return Math.min(45, raw);
}

export function resolveAvailableTowerRoster(
  vault: Record<string, number>,
  favoriteCollectibleIds?: string[],
  shinyVault?: Record<string, boolean>,
): string[] {
  const owned = Object.entries(vault)
    .filter(([id, count]) => count > 0 && Boolean(getCollectibleById(id)))
    .map(([id]) => id);
  if (owned.length === 0) return [STARTER_COLLECTIBLE_ID];

  const favSet = new Set(favoriteCollectibleIds ?? []);
  return [...owned].sort((a, b) => {
    const aFav = favSet.has(a) ? 1 : 0;
    const bFav = favSet.has(b) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;
    const aShiny = shinyVault?.[a] ? 1 : 0;
    const bShiny = shinyVault?.[b] ? 1 : 0;
    if (aShiny !== bShiny) return bShiny - aShiny;
    return a.localeCompare(b);
  });
}

import { COLLECTIBLES, getCollectibleById } from './packs';
import type { DifficultyTier, PlayerState } from './types';

export type BossId = 'slime-king' | 'typo-kraken' | 'chaos-dragon' | 'ink-owl';

export interface BossDefinition {
  id: BossId;
  name: string;
  zhName: string;
  title: string;
  maxHp: number;
  accentHex: string;
  bgHex: string;
  taunt: string;
  defeatLine: string;
}

export const BOSS_ROSTER: BossDefinition[] = [
  {
    id: 'slime-king',
    name: 'Slime of Forgetfulness',
    zhName: '失憶果凍王',
    title: 'Wobbly Memory Boss · 180 HP',
    maxHp: 180,
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    taunt: 'Bloop! Can your critter squad remember every clue?',
    defeatLine: 'Bloop-pop! Your memory squad melted my jelly crown!',
  },
  {
    id: 'typo-kraken',
    name: 'Typo Kraken',
    zhName: '錯字章魚怪',
    title: 'Eight-Arm Trickster · 220 HP',
    maxHp: 220,
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    taunt: 'Splish! My eight tentacles scrambled your answers!',
    defeatLine: 'Splash! Not a single typo survived your squad!',
  },
  {
    id: 'chaos-dragon',
    name: 'Chaos Gear Dragon',
    zhName: '亂數齒輪龍',
    title: 'Clockwork Guardian · 260 HP',
    maxHp: 260,
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    taunt: 'Clank-roar! Let’s see how fast your brain gears spin!',
    defeatLine: 'Whirrr—ding! Your squad cracked every single gear!',
  },
  {
    id: 'ink-owl',
    name: 'Shadow Ink Owl',
    zhName: '墨影貓頭鷹',
    title: 'Grand Library Boss · 300 HP',
    maxHp: 300,
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    taunt: 'Hoo-hoo! Only true QuestVault champions can outsmart me!',
    defeatLine: 'Hoo-ray! You proved your squad rules the Library!',
  },
];

export const DEFAULT_GUEST_SQUAD_IDS = [
  'critter-sprout-bunny',
  'sweet-boba-bear',
  'space-astro-corgi',
] as const;

export function getDefaultBossForTier(tier: DifficultyTier): BossDefinition {
  return BOSS_ROSTER[Math.min(BOSS_ROSTER.length - 1, Math.max(0, tier - 1))];
}

/**
 * Resolves a 3-critter battle squad from favorites -> owned vault -> guest buddies.
 */
export function resolveDefaultBossSquad(
  vault: Record<string, number>,
  favoriteIds?: string[],
): string[] {
  const squad: string[] = [];
  const pushUnique = (id: string) => {
    if (squad.length < 3 && !squad.includes(id) && getCollectibleById(id)) {
      squad.push(id);
    }
  };

  for (const fav of favoriteIds ?? []) {
    if ((vault[fav] ?? 0) > 0) pushUnique(fav);
  }
  for (const [id, count] of Object.entries(vault)) {
    if (count > 0) pushUnique(id);
    if (squad.length >= 3) break;
  }
  for (const guest of DEFAULT_GUEST_SQUAD_IDS) {
    pushUnique(guest);
  }
  if (squad.length < 3) {
    for (const c of COLLECTIBLES) {
      pushUnique(c.id);
      if (squad.length >= 3) break;
    }
  }
  return squad;
}

export interface BossHitResult {
  damage: number;
  isUltimate: boolean;
  shinyBonus: number;
}

/**
 * Pure combat damage formula:
 * - Base attack = 24
 * - Combo bonus = min(12, max(0, nextCombo - 1) * 3)
 * - Shiny bonus = +4 per Shiny squad member
 * - Every 3rd consecutive hit triggers 2x Team Ultimate!
 */
export function calculateBossAttackDamage(
  nextCombo: number,
  shinySquadCount: number,
): BossHitResult {
  const isUltimate = nextCombo > 0 && nextCombo % 3 === 0;
  const comboBonus = Math.min(12, Math.max(0, nextCombo - 1) * 3);
  const shinyBonus = Math.min(3, Math.max(0, shinySquadCount)) * 4;
  const baseDamage = 24 + comboBonus + shinyBonus;
  return {
    damage: isUltimate ? baseDamage * 2 : baseDamage,
    isUltimate,
    shinyBonus,
  };
}

/**
 * Calculates raw arcade tokens earned on Boss Victory (capped downstream by ARCADE_DAILY_TOKEN_CAP = 150).
 */
export function calculateBossVictoryTokens(
  boss: BossDefinition,
  correctCount: number,
  totalAttempts: number,
): number {
  const acc = totalAttempts > 0 ? correctCount / totalAttempts : 1;
  const tierBase = Math.round(boss.maxHp / 8); // 23..38
  const accBonus = Math.round(acc * 12);
  return Math.min(50, Math.max(20, tierBase + accBonus));
}

export function getOwnedCollectibleIds(state: PlayerState): string[] {
  return Object.entries(state.vault)
    .filter(([id, count]) => count > 0 && Boolean(getCollectibleById(id)))
    .map(([id]) => id);
}

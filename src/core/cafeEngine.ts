import { COLLECTIBLES, getCollectibleById } from './packs';

export type CafeFoodId = 'boba' | 'mochi' | 'pudding' | 'souffle' | 'matcha' | 'toast';

export interface CafeMenuItemSpec {
  id: CafeFoodId;
  nameEn: string;
  nameZh: string;
  basePrice: number;
  unlockCost: number; // 0 = unlocked from start
  accentHex: string;
  bgHex: string;
}

export const CAFE_DURATION_SEC = 120;
export const CAFE_MAX_LEVEL = 5;
export const CAFE_SEAT_COUNT = 3;

export const CAFE_MENU: CafeMenuItemSpec[] = [
  {
    id: 'boba',
    nameEn: 'Brown Sugar Boba',
    nameZh: '黑糖珍奶',
    basePrice: 12,
    unlockCost: 0,
    accentHex: '#B45309',
    bgHex: '#FEF3C7',
  },
  {
    id: 'mochi',
    nameEn: 'Berry Daifuku',
    nameZh: '草莓大福',
    basePrice: 15,
    unlockCost: 0,
    accentHex: '#E11D48',
    bgHex: '#FFE4E6',
  },
  {
    id: 'pudding',
    nameEn: 'Caramel Pudding',
    nameZh: '焦糖布丁',
    basePrice: 18,
    unlockCost: 0,
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
  },
  {
    id: 'souffle',
    nameEn: 'Cloud Soufflé',
    nameZh: '雲朵舒芙蕾',
    basePrice: 28,
    unlockCost: 40,
    accentHex: '#EA580C',
    bgHex: '#FFEDD5',
  },
  {
    id: 'matcha',
    nameEn: 'Matcha Roll',
    nameZh: '抹茶生乳捲',
    basePrice: 38,
    unlockCost: 75,
    accentHex: '#059669',
    bgHex: '#ECFDF5',
  },
  {
    id: 'toast',
    nameEn: 'Honey Brick Toast',
    nameZh: '蜜糖金磚吐司',
    basePrice: 52,
    unlockCost: 115,
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
  },
];

export interface CafeCustomer {
  uid: string;
  seatIndex: number;
  collectibleId: string;
  name: string;
  isVip: boolean;
  isShiny: boolean;
  order: CafeFoodId[];
  patience: number;
  maxPatience: number;
}

export interface CafeGameState {
  secondsLeft: number;
  cafeCoins: number;
  totalEarnedCoins: number;
  servedCount: number;
  correctAnswers: number;
  attemptsCount: number;
  streak: number;
  bestStreak: number;
  stock: Record<CafeFoodId, number>;
  menuLevels: Record<CafeFoodId, number>; // 0 = locked, 1..5 = unlocked level
  customers: CafeCustomer[];
  customerSeq: number;
}

const FALLBACK_GUEST_IDS = [
  'critter-sprout-bunny',
  'sweet-boba-bear',
  'mochi-ichigo-daifuku',
  'catcafe-toast-tabby',
  'capybara-yuzu-chill',
  'puppypark-corgi-loaf',
  'starunicorn-cloud-pony',
  'dragonboat-bamboo-zongzi',
];

function randIndex(len: number, rng: () => number): number {
  return Math.min(len - 1, Math.floor(Math.max(0, Math.min(0.999999, rng())) * len));
}

export function getFoodPrice(foodId: CafeFoodId, level: number): number {
  const spec = CAFE_MENU.find((m) => m.id === foodId);
  if (!spec || level <= 0) return 0;
  return Math.round(spec.basePrice * (1 + (level - 1) * 0.5));
}

export function getFoodUpgradeCost(foodId: CafeFoodId, currentLevel: number): number | null {
  const spec = CAFE_MENU.find((m) => m.id === foodId);
  if (!spec) return null;
  if (currentLevel <= 0) return spec.unlockCost;
  if (currentLevel >= CAFE_MAX_LEVEL) return null;
  return Math.round(spec.basePrice * 2.2 * currentLevel);
}

export function getUnlockedFoods(menuLevels: Record<CafeFoodId, number>): CafeFoodId[] {
  return CAFE_MENU.filter((m) => menuLevels[m.id] > 0).map((m) => m.id);
}

export function buildGuestPool(
  vault: Record<string, number>,
  favoriteIds: string[] = [],
  equippedId?: string,
): { id: string; isVip: boolean }[] {
  const favSet = new Set(favoriteIds.filter((id) => (vault[id] ?? 0) > 0 && id !== equippedId));
  const ownedIds = Object.keys(vault).filter(
    (id) => (vault[id] ?? 0) > 0 && Boolean(getCollectibleById(id)) && id !== equippedId,
  );

  const pool: { id: string; isVip: boolean }[] = [];
  for (const id of favSet) {
    // VIPs from Favorite Shelf appear with higher priority!
    pool.push({ id, isVip: true });
    pool.push({ id, isVip: true });
  }
  for (const id of ownedIds) {
    if (!favSet.has(id)) {
      pool.push({ id, isVip: false });
    }
  }
  // Ensure at least 6 varied guests even for brand-new players
  if (pool.length < 6) {
    for (const id of FALLBACK_GUEST_IDS) {
      if (id !== equippedId && getCollectibleById(id) && !pool.some((p) => p.id === id)) {
        pool.push({ id, isVip: false });
      }
    }
  }
  if (pool.length === 0) {
    pool.push({ id: COLLECTIBLES[0].id, isVip: false });
  }
  return pool;
}

export function spawnCafeCustomer(
  seatIndex: number,
  seq: number,
  menuLevels: Record<CafeFoodId, number>,
  vault: Record<string, number>,
  shinyVault: Record<string, boolean> = {},
  favoriteIds: string[] = [],
  equippedId?: string,
  excludeIds: string[] = [],
  rng: () => number = Math.random,
): CafeCustomer {
  const unlocked = getUnlockedFoods(menuLevels);
  const fullPool = buildGuestPool(vault, favoriteIds, equippedId);
  const filtered = fullPool.filter((g) => !excludeIds.includes(g.id));
  const guest = (filtered.length > 0 ? filtered : fullPool)[
    randIndex(filtered.length > 0 ? filtered.length : fullPool.length, rng)
  ];

  const col = getCollectibleById(guest.id);
  const orderLen = rng() < 0.45 && unlocked.length >= 2 ? 2 : 1;
  const order: CafeFoodId[] = [];
  for (let i = 0; i < orderLen; i += 1) {
    order.push(unlocked[randIndex(unlocked.length, rng)]);
  }

  const maxPatience = guest.isVip ? 34 : 28;
  return {
    uid: `guest-${seq}-${seatIndex}`,
    seatIndex,
    collectibleId: guest.id,
    name: col?.name ?? 'Guest',
    isVip: guest.isVip,
    isShiny: Boolean(shinyVault[guest.id]),
    order,
    patience: maxPatience,
    maxPatience,
  };
}

export function createInitialCafeState(
  vault: Record<string, number>,
  shinyVault: Record<string, boolean> = {},
  favoriteIds: string[] = [],
  equippedId?: string,
  rng: () => number = Math.random,
): CafeGameState {
  const menuLevels: Record<CafeFoodId, number> = {
    boba: 1,
    mochi: 1,
    pudding: 1,
    souffle: 0,
    matcha: 0,
    toast: 0,
  };
  const stock: Record<CafeFoodId, number> = {
    boba: 2,
    mochi: 2,
    pudding: 2,
    souffle: 0,
    matcha: 0,
    toast: 0,
  };

  const customers: CafeCustomer[] = [];
  const usedIds: string[] = [];
  for (let seat = 0; seat < CAFE_SEAT_COUNT; seat += 1) {
    const c = spawnCafeCustomer(
      seat,
      seat + 1,
      menuLevels,
      vault,
      shinyVault,
      favoriteIds,
      equippedId,
      usedIds,
      rng,
    );
    customers.push(c);
    usedIds.push(c.collectibleId);
  }

  return {
    secondsLeft: CAFE_DURATION_SEC,
    cafeCoins: 0,
    totalEarnedCoins: 0,
    servedCount: 0,
    correctAnswers: 0,
    attemptsCount: 0,
    streak: 0,
    bestStreak: 0,
    stock,
    menuLevels,
    customers,
    customerSeq: CAFE_SEAT_COUNT + 1,
  };
}

export function restockFromAnswer(
  state: CafeGameState,
  isCorrect: boolean,
  rng: () => number = Math.random,
): { state: CafeGameState; restockedItems: CafeFoodId[] } {
  if (!isCorrect) {
    return {
      restockedItems: [],
      state: {
        ...state,
        attemptsCount: state.attemptsCount + 1,
        streak: 0,
      },
    };
  }

  const nextStreak = state.streak + 1;
  const bestStreak = Math.max(state.bestStreak, nextStreak);
  const unlocked = getUnlockedFoods(state.menuLevels);
  const unitsToAdd = nextStreak >= 5 ? 3 : nextStreak >= 2 ? 2 : 2;
  const nextStock: Record<CafeFoodId, number> = { ...state.stock };
  const restockedItems: CafeFoodId[] = [];

  // Prioritize foods currently wanted by waiting customers with the lowest stock
  const wantedSet = new Set<CafeFoodId>();
  for (const cust of state.customers) {
    for (const f of cust.order) wantedSet.add(f);
  }

  for (let i = 0; i < unitsToAdd; i += 1) {
    const candidates = [...unlocked].sort((a, b) => {
      const aWanted = wantedSet.has(a) ? 0 : 1;
      const bWanted = wantedSet.has(b) ? 0 : 1;
      if (aWanted !== bWanted) return aWanted - bWanted;
      return nextStock[a] - nextStock[b];
    });
    const pickTop = candidates.slice(0, Math.min(2, candidates.length));
    const chosen = pickTop[randIndex(pickTop.length, rng)];
    nextStock[chosen] = Math.min(12, nextStock[chosen] + 1);
    restockedItems.push(chosen);
  }

  return {
    restockedItems,
    state: {
      ...state,
      correctAnswers: state.correctAnswers + 1,
      attemptsCount: state.attemptsCount + 1,
      streak: nextStreak,
      bestStreak,
      stock: nextStock,
    },
  };
}

export type ServeResult =
  | {
      ok: true;
      state: CafeGameState;
      foodServed: CafeFoodId;
      coinsEarned: number;
      customerCompleted: boolean;
      wasVip: boolean;
    }
  | { ok: false; reason: 'invalid_seat' | 'out_of_stock' | 'empty_order' };

export function serveCustomerAtSeat(
  state: CafeGameState,
  seatIndex: number,
  vault: Record<string, number>,
  shinyVault: Record<string, boolean> = {},
  favoriteIds: string[] = [],
  equippedId?: string,
  rng: () => number = Math.random,
): ServeResult {
  const customer = state.customers.find((c) => c.seatIndex === seatIndex);
  if (!customer) return { ok: false, reason: 'invalid_seat' };
  if (customer.order.length === 0) return { ok: false, reason: 'empty_order' };

  const neededFood = customer.order.find((f) => state.stock[f] > 0);
  if (!neededFood) return { ok: false, reason: 'out_of_stock' };

  const level = Math.max(1, state.menuLevels[neededFood]);
  const baseCoins = getFoodPrice(neededFood, level);
  const vipMultiplier = customer.isVip ? 1.25 : 1;
  const remainingOrder = [...customer.order];
  const removeIdx = remainingOrder.indexOf(neededFood);
  remainingOrder.splice(removeIdx, 1);

  const customerCompleted = remainingOrder.length === 0;
  const completionTip = customerCompleted ? 6 : 0;
  const coinsEarned = Math.round(baseCoins * vipMultiplier) + completionTip;

  const nextStock: Record<CafeFoodId, number> = {
    ...state.stock,
    [neededFood]: Math.max(0, state.stock[neededFood] - 1),
  };

  let nextSeq = state.customerSeq;
  const activeIds = state.customers
    .filter((c) => c.seatIndex !== seatIndex)
    .map((c) => c.collectibleId);

  const nextCustomers = state.customers.map((c) => {
    if (c.seatIndex !== seatIndex) return c;
    if (!customerCompleted) {
      return {
        ...c,
        order: remainingOrder,
        patience: Math.min(c.maxPatience, c.patience + 8),
      };
    }
    const replacement = spawnCafeCustomer(
      seatIndex,
      nextSeq,
      state.menuLevels,
      vault,
      shinyVault,
      favoriteIds,
      equippedId,
      activeIds,
      rng,
    );
    nextSeq += 1;
    return replacement;
  });

  return {
    ok: true,
    foodServed: neededFood,
    coinsEarned,
    customerCompleted,
    wasVip: customer.isVip,
    state: {
      ...state,
      cafeCoins: state.cafeCoins + coinsEarned,
      totalEarnedCoins: state.totalEarnedCoins + coinsEarned,
      servedCount: state.servedCount + (customerCompleted ? 1 : 0),
      stock: nextStock,
      customers: nextCustomers,
      customerSeq: nextSeq,
    },
  };
}

export type UpgradeMenuResult =
  | { ok: true; state: CafeGameState; newLevel: number; costPaid: number; unlockedNew: boolean }
  | { ok: false; reason: 'max_level' | 'insufficient_coins' };

export function upgradeOrUnlockMenuItem(
  state: CafeGameState,
  foodId: CafeFoodId,
): UpgradeMenuResult {
  const currentLevel = state.menuLevels[foodId] ?? 0;
  const cost = getFoodUpgradeCost(foodId, currentLevel);
  if (cost === null) return { ok: false, reason: 'max_level' };
  if (state.cafeCoins < cost) return { ok: false, reason: 'insufficient_coins' };

  const unlockedNew = currentLevel === 0;
  const newLevel = currentLevel + 1;
  return {
    ok: true,
    newLevel,
    costPaid: cost,
    unlockedNew,
    state: {
      ...state,
      cafeCoins: state.cafeCoins - cost,
      menuLevels: {
        ...state.menuLevels,
        [foodId]: newLevel,
      },
      stock: {
        ...state.stock,
        // Grant 2 complimentary portions when unlocking a brand-new recipe!
        [foodId]: unlockedNew ? Math.min(12, state.stock[foodId] + 2) : state.stock[foodId],
      },
    },
  };
}

export function tickCafeSecond(
  state: CafeGameState,
  vault: Record<string, number>,
  shinyVault: Record<string, boolean> = {},
  favoriteIds: string[] = [],
  equippedId?: string,
  rng: () => number = Math.random,
): CafeGameState {
  const nextSeconds = Math.max(0, state.secondsLeft - 1);
  let nextSeq = state.customerSeq;
  const nextCustomers = state.customers.map((c) => {
    const nextPatience = c.patience - 1;
    if (nextPatience > 0) {
      return { ...c, patience: nextPatience };
    }
    const otherIds = state.customers
      .filter((o) => o.seatIndex !== c.seatIndex)
      .map((o) => o.collectibleId);
    const replacement = spawnCafeCustomer(
      c.seatIndex,
      nextSeq,
      state.menuLevels,
      vault,
      shinyVault,
      favoriteIds,
      equippedId,
      otherIds,
      rng,
    );
    nextSeq += 1;
    return replacement;
  });

  return {
    ...state,
    secondsLeft: nextSeconds,
    customers: nextCustomers,
    customerSeq: nextSeq,
  };
}

/**
 * Converts a Boba Cafe session into raw QuestVault Tokens with anti-cheese low-accuracy damping.
 */
export function calculateCafeRawTokens(state: CafeGameState): number {
  if (state.correctAnswers <= 0) return 0;
  const raw = Math.min(
    45,
    Math.floor(
      state.correctAnswers * 2.5 +
        Math.floor(state.servedCount / 2) * 2 +
        Math.floor(state.bestStreak / 3) * 2,
    ),
  );
  if (state.attemptsCount >= 5 && state.correctAnswers / state.attemptsCount < 0.5) {
    return Math.max(1, Math.floor(raw * 0.5));
  }
  return Math.max(1, raw);
}

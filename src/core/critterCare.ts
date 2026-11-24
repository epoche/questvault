import { BUILTIN_CHINESE_SETS } from '../subjects/chinese/wordSets';
import { BUILTIN_WORD_SETS } from '../subjects/english/wordSets';
import { getCollectibleById } from './packs';
import type { PlayerState, RoomDailyActivity } from './types';

export const DAILY_FREE_TREATS = 3;
export const ROOM_DAILY_TOKEN_CAP = 25;
export const ROOM_QUIZ_REWARD_TOKENS = 5;
export const ROOM_LEVELUP_BONUS_TOKENS = 5;

export interface RoomTreatItem {
  id: 'boba' | 'daifuku' | 'cookie';
  emoji: string;
  name: string;
  zhName: string;
  xp: number;
}

export const ROOM_TREATS: readonly RoomTreatItem[] = [
  { id: 'boba', emoji: '🧋', name: 'Boba Tea', zhName: '珍珠奶茶', xp: 3 },
  { id: 'daifuku', emoji: '🍓', name: 'Strawberry Daifuku', zhName: '草莓大福', xp: 3 },
  { id: 'cookie', emoji: '⭐', name: 'Starlight Cookie', zhName: '星光餅乾', xp: 3 },
] as const;

/** Friendship level XP thresholds for Lv.1 .. Lv.5 */
export const FRIENDSHIP_THRESHOLDS = [0, 5, 12, 22, 35] as const;

export function getFriendshipLevel(xp: number): 1 | 2 | 3 | 4 | 5 {
  const safeXp = Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;
  if (safeXp >= FRIENDSHIP_THRESHOLDS[4]) return 5;
  if (safeXp >= FRIENDSHIP_THRESHOLDS[3]) return 4;
  if (safeXp >= FRIENDSHIP_THRESHOLDS[2]) return 3;
  if (safeXp >= FRIENDSHIP_THRESHOLDS[1]) return 2;
  return 1;
}

export function getFriendshipProgress(xp: number): {
  level: 1 | 2 | 3 | 4 | 5;
  xp: number;
  floorXp: number;
  nextThreshold: number | null;
  pct: number;
  isMax: boolean;
} {
  const safeXp = Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;
  const level = getFriendshipLevel(safeXp);
  const floorXp = FRIENDSHIP_THRESHOLDS[level - 1];
  if (level === 5) {
    return { level: 5, xp: safeXp, floorXp, nextThreshold: null, pct: 100, isMax: true };
  }
  const nextThreshold: number = FRIENDSHIP_THRESHOLDS[level];
  const pct = Math.min(100, Math.round(((safeXp - floorXp) / Math.max(1, nextThreshold - floorXp)) * 100));
  return { level, xp: safeXp, floorXp, nextThreshold, pct, isMax: false };
}

export function getNormalizedRoomDailyActivity(
  player: PlayerState,
  todayKey: string,
): RoomDailyActivity {
  const existing = player.roomDailyActivity;
  if (!existing || existing.dateKey !== todayKey) {
    return {
      dateKey: todayKey,
      treatsUsed: 0,
      tokensEarned: 0,
      quizzesCorrect: 0,
    };
  }
  return {
    dateKey: todayKey,
    treatsUsed: Math.max(0, Math.min(DAILY_FREE_TREATS, Math.floor(existing.treatsUsed || 0))),
    tokensEarned: Math.max(0, Math.min(ROOM_DAILY_TOKEN_CAP, Math.floor(existing.tokensEarned || 0))),
    quizzesCorrect: Math.max(0, Math.floor(existing.quizzesCorrect || 0)),
  };
}

export function getDailyRoomStatus(player: PlayerState, todayKey: string) {
  const daily = getNormalizedRoomDailyActivity(player, todayKey);
  return {
    treatsUsed: daily.treatsUsed,
    treatsRemaining: Math.max(0, DAILY_FREE_TREATS - daily.treatsUsed),
    treatsTotal: DAILY_FREE_TREATS,
    tokensEarnedToday: daily.tokensEarned,
    remainingTokenCap: Math.max(0, ROOM_DAILY_TOKEN_CAP - daily.tokensEarned),
    dailyTokenCap: ROOM_DAILY_TOKEN_CAP,
    quizzesCorrectToday: daily.quizzesCorrect,
  };
}

export function countBestFriendCritters(player: PlayerState, minLevel: 2 | 3 | 4 | 5 = 3): number {
  const map = player.critterFriendship ?? {};
  let count = 0;
  for (const [id, rec] of Object.entries(map)) {
    if ((player.vault[id] ?? 0) > 0 && rec && getFriendshipLevel(rec.xp) >= minLevel) {
      count += 1;
    }
  }
  return count;
}

function applyRoomTokensWithCap(
  daily: RoomDailyActivity,
  rawTokens: number,
): { awarded: number; nextDaily: RoomDailyActivity } {
  const safeRaw = Number.isFinite(rawTokens) ? Math.max(0, Math.floor(rawTokens)) : 0;
  const remaining = Math.max(0, ROOM_DAILY_TOKEN_CAP - daily.tokensEarned);
  const awarded = Math.min(safeRaw, remaining);
  return {
    awarded,
    nextDaily: {
      ...daily,
      tokensEarned: daily.tokensEarned + awarded,
    },
  };
}

export interface CritterCareResult {
  state: PlayerState;
  ok: boolean;
  xpGained: number;
  leveledUp: boolean;
  newLevel: 1 | 2 | 3 | 4 | 5;
  tokensAwarded: number;
  alreadyPetToday?: boolean;
  treatsRemaining: number;
  remainingTokenCap: number;
}

/**
 * Pets an owned critter in My Critter Room.
 * Grants +1 friendship XP on the first pet of that critter each day (prevents click-spam to Lv.5),
 * and awards a capped +5 Token level-up bonus if friendship crosses a level boundary.
 */
export function petCritter(
  player: PlayerState,
  collectibleId: string,
  todayKey: string,
): CritterCareResult {
  const daily = getNormalizedRoomDailyActivity(player, todayKey);
  if ((player.vault[collectibleId] ?? 0) <= 0 || !getCollectibleById(collectibleId)) {
    return {
      state: player,
      ok: false,
      xpGained: 0,
      leveledUp: false,
      newLevel: 1,
      tokensAwarded: 0,
      treatsRemaining: Math.max(0, DAILY_FREE_TREATS - daily.treatsUsed),
      remainingTokenCap: Math.max(0, ROOM_DAILY_TOKEN_CAP - daily.tokensEarned),
    };
  }

  const prevRec = player.critterFriendship?.[collectibleId] ?? { xp: 0 };
  const prevXp = Number.isFinite(prevRec.xp) ? Math.max(0, Math.floor(prevRec.xp)) : 0;
  const alreadyPetToday = prevRec.lastPetDate === todayKey;
  const oldLevel = getFriendshipLevel(prevXp);
  const xpGained = alreadyPetToday ? 0 : 1;
  const nextXp = prevXp + xpGained;
  const newLevel = getFriendshipLevel(nextXp);
  const leveledUp = newLevel > oldLevel;

  const { awarded, nextDaily } = applyRoomTokensWithCap(
    daily,
    leveledUp ? ROOM_LEVELUP_BONUS_TOKENS : 0,
  );

  const nextState: PlayerState = {
    ...player,
    tokens: player.tokens + awarded,
    critterFriendship: {
      ...(player.critterFriendship ?? {}),
      [collectibleId]: {
        xp: nextXp,
        lastPetDate: todayKey,
      },
    },
    roomDailyActivity: nextDaily,
  };

  return {
    state: nextState,
    ok: true,
    xpGained,
    leveledUp,
    newLevel,
    tokensAwarded: awarded,
    alreadyPetToday,
    treatsRemaining: Math.max(0, DAILY_FREE_TREATS - nextDaily.treatsUsed),
    remainingTokenCap: Math.max(0, ROOM_DAILY_TOKEN_CAP - nextDaily.tokensEarned),
  };
}

/**
 * Feeds 1 of the 3 daily free treats to an owned critter (+3 friendship XP).
 * Strictly limited to DAILY_FREE_TREATS (3) per local day and ROOM_DAILY_TOKEN_CAP (25).
 */
export function feedCritterTreat(
  player: PlayerState,
  collectibleId: string,
  treatId: RoomTreatItem['id'],
  todayKey: string,
): CritterCareResult {
  const daily = getNormalizedRoomDailyActivity(player, todayKey);
  const treat = ROOM_TREATS.find((t) => t.id === treatId) ?? ROOM_TREATS[0];
  if (
    (player.vault[collectibleId] ?? 0) <= 0 ||
    !getCollectibleById(collectibleId) ||
    daily.treatsUsed >= DAILY_FREE_TREATS
  ) {
    const prevXp = player.critterFriendship?.[collectibleId]?.xp ?? 0;
    return {
      state: player,
      ok: false,
      xpGained: 0,
      leveledUp: false,
      newLevel: getFriendshipLevel(prevXp),
      tokensAwarded: 0,
      treatsRemaining: Math.max(0, DAILY_FREE_TREATS - daily.treatsUsed),
      remainingTokenCap: Math.max(0, ROOM_DAILY_TOKEN_CAP - daily.tokensEarned),
    };
  }

  const prevRec = player.critterFriendship?.[collectibleId] ?? { xp: 0 };
  const prevXp = Number.isFinite(prevRec.xp) ? Math.max(0, Math.floor(prevRec.xp)) : 0;
  const oldLevel = getFriendshipLevel(prevXp);
  const xpGained = treat.xp;
  const nextXp = prevXp + xpGained;
  const newLevel = getFriendshipLevel(nextXp);
  const leveledUp = newLevel > oldLevel;

  const dailyAfterTreat: RoomDailyActivity = {
    ...daily,
    treatsUsed: daily.treatsUsed + 1,
  };
  const { awarded, nextDaily } = applyRoomTokensWithCap(
    dailyAfterTreat,
    leveledUp ? ROOM_LEVELUP_BONUS_TOKENS : 0,
  );

  const nextState: PlayerState = {
    ...player,
    tokens: player.tokens + awarded,
    critterFriendship: {
      ...(player.critterFriendship ?? {}),
      [collectibleId]: {
        ...prevRec,
        xp: nextXp,
      },
    },
    roomDailyActivity: nextDaily,
  };

  return {
    state: nextState,
    ok: true,
    xpGained,
    leveledUp,
    newLevel,
    tokensAwarded: awarded,
    treatsRemaining: Math.max(0, DAILY_FREE_TREATS - nextDaily.treatsUsed),
    remainingTokenCap: Math.max(0, ROOM_DAILY_TOKEN_CAP - nextDaily.tokensEarned),
  };
}

export interface CritterPopQuiz {
  id: string;
  subject: 'english' | 'chinese';
  word: string;
  zhuyin?: string;
  prompt: string;
  speakText: string;
  speakLang: 'en-US' | 'zh-TW';
  choices: [string, string];
  correctIndex: 0 | 1;
  tip: string;
}

/**
 * Builds a fast, kid-friendly 2-choice pop quiz bubble from the player's weak/practiced
 * English or Traditional Chinese words (falling back cleanly to built-in Tier 1–2 sets).
 */
export function buildCritterPopQuiz(
  player: PlayerState,
  seed: number = Date.now(),
): CritterPopQuiz {
  const safeSeed = Math.abs(Math.floor(Number.isFinite(seed) ? seed : 1));
  const enWords = BUILTIN_WORD_SETS.flatMap((s) => s.words);
  const zhWords = BUILTIN_CHINESE_SETS.flatMap((s) => s.words);

  const enByWord = new Map(enWords.map((w) => [w.word.toLowerCase(), w]));
  const zhByWord = new Map(zhWords.map((w) => [w.word, w]));

  // Gather weak or practiced candidates first
  const candidates: { subject: 'english' | 'chinese'; key: string; score: number }[] = [];
  for (const rec of Object.values(player.wordMastery)) {
    if (rec.subjectId === 'english') {
      const hit = enByWord.get(rec.word.toLowerCase());
      if (hit) {
        candidates.push({
          subject: 'english',
          key: hit.word.toLowerCase(),
          score: rec.missed * 4 + (rec.srsLevel === 0 ? 2 : 1),
        });
      }
    } else if (rec.subjectId === 'chinese') {
      const hit = zhByWord.get(rec.word);
      if (hit) {
        candidates.push({
          subject: 'chinese',
          key: hit.word,
          score: rec.missed * 4 + (rec.srsLevel === 0 ? 2 : 1),
        });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const topPool = candidates.slice(0, 12);

  let chosenSubject: 'english' | 'chinese';
  let chosenEn = enWords[safeSeed % enWords.length];
  let chosenZh = zhWords[safeSeed % zhWords.length];

  if (topPool.length > 0) {
    const picked = topPool[safeSeed % topPool.length];
    chosenSubject = picked.subject;
    if (picked.subject === 'english') {
      chosenEn = enByWord.get(picked.key) ?? chosenEn;
    } else {
      chosenZh = zhByWord.get(picked.key) ?? chosenZh;
    }
  } else {
    chosenSubject = safeSeed % 2 === 0 ? 'english' : 'chinese';
  }

  const flip = safeSeed % 2 === 1;

  if (chosenSubject === 'english') {
    const startIdx = (safeSeed * 7 + 3) % enWords.length;
    const distractor =
      enWords.find(
        (w, idx) =>
          idx >= startIdx &&
          w.word.toLowerCase() !== chosenEn.word.toLowerCase() &&
          w.definition.toLowerCase() !== chosenEn.definition.toLowerCase(),
      ) ??
      enWords.find(
        (w) =>
          w.word.toLowerCase() !== chosenEn.word.toLowerCase() &&
          w.definition.toLowerCase() !== chosenEn.definition.toLowerCase(),
      ) ??
      enWords.find((w) => w.word.toLowerCase() !== chosenEn.word.toLowerCase())!;

    const correctText = chosenEn.definition;
    const wrongText = distractor.definition;
    const choices: [string, string] = flip ? [wrongText, correctText] : [correctText, wrongText];
    return {
      id: `room-quiz-en-${chosenEn.word}-${safeSeed}`,
      subject: 'english',
      word: chosenEn.word,
      prompt: `What does “${chosenEn.word}” mean?`,
      speakText: chosenEn.word,
      speakLang: 'en-US',
      choices,
      correctIndex: flip ? 1 : 0,
      tip: `${chosenEn.word} = ${chosenEn.definition} (${chosenEn.plainBridge})`,
    };
  }

  const startZhIdx = (safeSeed * 7 + 5) % zhWords.length;
  const distractorZh =
    zhWords.find(
      (w, idx) =>
        idx >= startZhIdx &&
        w.word !== chosenZh.word &&
        w.englishBridge.toLowerCase() !== chosenZh.englishBridge.toLowerCase() &&
        w.plainBridge !== chosenZh.plainBridge,
    ) ??
    zhWords.find(
      (w) =>
        w.word !== chosenZh.word &&
        w.englishBridge.toLowerCase() !== chosenZh.englishBridge.toLowerCase() &&
        w.plainBridge !== chosenZh.plainBridge,
    ) ??
    zhWords.find((w) => w.word !== chosenZh.word)!;

  const correctText = `${chosenZh.englishBridge}（${chosenZh.plainBridge}）`;
  const wrongText = `${distractorZh.englishBridge}（${distractorZh.plainBridge}）`;
  const choices: [string, string] = flip ? [wrongText, correctText] : [correctText, wrongText];
  return {
    id: `room-quiz-zh-${chosenZh.word}-${safeSeed}`,
    subject: 'chinese',
    word: chosenZh.word,
    zhuyin: chosenZh.zhuyin,
    prompt: `這個中文詞是什麼意思？`,
    speakText: chosenZh.word,
    speakLang: 'zh-TW',
    choices,
    correctIndex: flip ? 1 : 0,
    tip: `${chosenZh.word}：${chosenZh.plainBridge}（${chosenZh.englishBridge}）`,
  };
}

/**
 * Records a Critter Room pop-quiz answer.
 * Correct answers grant +2 friendship XP and +5 Tokens (strictly bounded by ROOM_DAILY_TOKEN_CAP = 25/day).
 */
export function recordCritterPopQuizResult(
  player: PlayerState,
  collectibleId: string,
  isCorrect: boolean,
  todayKey: string,
): CritterCareResult {
  const daily = getNormalizedRoomDailyActivity(player, todayKey);
  if ((player.vault[collectibleId] ?? 0) <= 0 || !getCollectibleById(collectibleId)) {
    return {
      state: player,
      ok: false,
      xpGained: 0,
      leveledUp: false,
      newLevel: 1,
      tokensAwarded: 0,
      treatsRemaining: Math.max(0, DAILY_FREE_TREATS - daily.treatsUsed),
      remainingTokenCap: Math.max(0, ROOM_DAILY_TOKEN_CAP - daily.tokensEarned),
    };
  }

  const prevRec = player.critterFriendship?.[collectibleId] ?? { xp: 0 };
  const prevXp = Number.isFinite(prevRec.xp) ? Math.max(0, Math.floor(prevRec.xp)) : 0;
  const oldLevel = getFriendshipLevel(prevXp);

  if (!isCorrect) {
    return {
      state: player,
      ok: true,
      xpGained: 0,
      leveledUp: false,
      newLevel: oldLevel,
      tokensAwarded: 0,
      treatsRemaining: Math.max(0, DAILY_FREE_TREATS - daily.treatsUsed),
      remainingTokenCap: Math.max(0, ROOM_DAILY_TOKEN_CAP - daily.tokensEarned),
    };
  }

  const xpGained = 2;
  const nextXp = prevXp + xpGained;
  const newLevel = getFriendshipLevel(nextXp);
  const leveledUp = newLevel > oldLevel;

  const rawReward = ROOM_QUIZ_REWARD_TOKENS + (leveledUp ? ROOM_LEVELUP_BONUS_TOKENS : 0);
  const { awarded, nextDaily } = applyRoomTokensWithCap(
    { ...daily, quizzesCorrect: daily.quizzesCorrect + 1 },
    rawReward,
  );

  const nextState: PlayerState = {
    ...player,
    tokens: player.tokens + awarded,
    critterFriendship: {
      ...(player.critterFriendship ?? {}),
      [collectibleId]: {
        ...prevRec,
        xp: nextXp,
      },
    },
    roomDailyActivity: nextDaily,
    totalRoomQuizzesCorrect: (player.totalRoomQuizzesCorrect ?? 0) + 1,
  };

  return {
    state: nextState,
    ok: true,
    xpGained,
    leveledUp,
    newLevel,
    tokensAwarded: awarded,
    treatsRemaining: Math.max(0, DAILY_FREE_TREATS - nextDaily.treatsUsed),
    remainingTokenCap: Math.max(0, ROOM_DAILY_TOKEN_CAP - nextDaily.tokensEarned),
  };
}

import type { DifficultyTier } from '../../core/types';
import type { ChineseTargetWord, ChineseWordSet } from './types';
import { BUILTIN_CHINESE_SETS } from './wordSets';

export interface ChineseListeningChoice {
  word: string;
  zhuyin: string;
  isTarget: boolean;
}

export interface ChineseListeningQuestion {
  id: string;
  targetWord: ChineseTargetWord;
  spokenText: string;
  choices: ChineseListeningChoice[];
}

export interface ChineseListeningSession {
  id: string;
  tier: DifficultyTier;
  questions: ChineseListeningQuestion[];
}

interface PoolEntry {
  word: ChineseTargetWord;
  setId: string;
  shortTag: string;
}

const LISTENING_QUESTION_COUNT = 8;
const CHOICE_COUNT = 4;

/**
 * Valid standard Traditional Chinese homophones that may appear in `upgradePlainSpan`
 * for contrast exercises (e.g., 記錄 vs 紀錄) and therefore MUST NOT be used as
 * audio-only wrong-character distractors.
 */
const VALID_STANDARD_HOMOPHONES = new Set(['紀錄', '須要']);

function normalizeZhuyin(zhuyin: string): string {
  return zhuyin.trim().replace(/\s+/g, ' ');
}

function clampRng(rng: () => number): number {
  const value = rng();
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(0.999999, value));
}

function shuffleWithRng<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(clampRng(rng) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shareAnyChar(a: string, b: string): boolean {
  const charsA = new Set(Array.from(a));
  for (const ch of Array.from(b)) {
    if (charsA.has(ch)) return true;
  }
  return false;
}

function getSelectionWeight(entry: PoolEntry): number {
  const tag = entry.shortTag;
  const charLen = Array.from(entry.word.word).length;
  if (tag === '易錯辨析' || tag === '多音字' || tag === '形近辨析') {
    return charLen >= 2 ? 3.2 : 1.4;
  }
  if (tag === '成語' || tag === '高階成語' || tag === '疊字詞') {
    return 1.5;
  }
  return 1.0;
}

function weightedSampleWithoutReplacement(
  entries: PoolEntry[],
  count: number,
  rng: () => number,
): PoolEntry[] {
  const remaining = [...entries];
  const chosen: PoolEntry[] = [];

  while (chosen.length < count && remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, item) => sum + getSelectionWeight(item), 0);
    let threshold = clampRng(rng) * totalWeight;
    let pickedIdx = remaining.length - 1;

    for (let i = 0; i < remaining.length; i += 1) {
      threshold -= getSelectionWeight(remaining[i]);
      if (threshold <= 0) {
        pickedIdx = i;
        break;
      }
    }

    chosen.push(remaining[pickedIdx]);
    remaining.splice(pickedIdx, 1);
  }

  return chosen;
}

function flattenUniqueEntries(wordSets: ChineseWordSet[]): PoolEntry[] {
  const seen = new Set<string>();
  const entries: PoolEntry[] = [];
  for (const set of wordSets) {
    for (const word of set.words) {
      const trimmed = word.word.trim();
      if (!trimmed || seen.has(trimmed)) continue;
      seen.add(trimmed);
      entries.push({
        word,
        setId: set.id,
        shortTag: set.shortTag,
      });
    }
  }
  return entries;
}

function buildTypoDistractor(
  entry: PoolEntry,
  allValidWords: Set<string>,
): ChineseListeningChoice | null {
  if (entry.shortTag !== '易錯辨析') return null;

  const rawSpan = entry.word.upgradePlainSpan?.trim();
  if (!rawSpan) return null;

  const targetLen = Array.from(entry.word.word).length;
  const spanLen = Array.from(rawSpan).length;
  if (targetLen < 2 || spanLen !== targetLen) return null;
  if (rawSpan === entry.word.word) return null;
  if (allValidWords.has(rawSpan)) return null;
  if (VALID_STANDARD_HOMOPHONES.has(rawSpan)) return null;
  if (/[，。、；！？「」『』（）()\s]/.test(rawSpan)) return null;

  return {
    word: rawSpan,
    zhuyin: '',
    isTarget: false,
  };
}

function pickListeningChoices(
  targetEntry: PoolEntry,
  pool: PoolEntry[],
  allValidWords: Set<string>,
  rng: () => number,
): ChineseListeningChoice[] {
  const targetWord = targetEntry.word;
  const targetNormZhuyin = normalizeZhuyin(targetWord.zhuyin);
  const targetLen = Array.from(targetWord.word).length;

  const distractors: ChineseListeningChoice[] = [];
  const usedWords = new Set<string>([targetWord.word]);
  const usedRealZhuyin = new Set<string>([targetNormZhuyin]);

  // 1. Optional confirmed-typo distractor for 易錯辨析 sets (unambiguous character shape test)
  const typoChoice = buildTypoDistractor(targetEntry, allValidWords);
  if (typoChoice && !usedWords.has(typoChoice.word)) {
    usedWords.add(typoChoice.word);
    distractors.push(typoChoice);
  }

  const addFromCandidates = (candidates: PoolEntry[], avoidDuplicateDistractorSound: boolean) => {
    for (const candidate of shuffleWithRng(candidates, rng)) {
      if (distractors.length >= CHOICE_COUNT - 1) break;
      const candWord = candidate.word.word;
      if (usedWords.has(candWord)) continue;

      const candNormZhuyin = normalizeZhuyin(candidate.word.zhuyin);
      // Hard rule: a valid dictionary word with identical pronunciation as target is ambiguous
      if (candNormZhuyin === targetNormZhuyin) continue;
      if (avoidDuplicateDistractorSound && usedRealZhuyin.has(candNormZhuyin)) continue;

      usedWords.add(candWord);
      usedRealZhuyin.add(candNormZhuyin);
      distractors.push({
        word: candWord,
        zhuyin: candidate.word.zhuyin,
        isTarget: false,
      });
    }
  };

  const sameLen = pool.filter((c) => Array.from(c.word.word).length === targetLen);
  const sameLenSharedChar = sameLen.filter((c) => shareAnyChar(c.word.word, targetWord.word));
  const sameSetSameLen = sameLen.filter((c) => c.setId === targetEntry.setId);
  const sameLenNearbyTier = sameLen.filter(
    (c) => Math.abs(c.word.tier - targetWord.tier) <= 1,
  );
  const sameSetAnyLen = pool.filter((c) => c.setId === targetEntry.setId);
  const nearLen = pool.filter((c) => Math.abs(Array.from(c.word.word).length - targetLen) === 1);

  // Ranked distractor tiers: prefer high visual/phonetic similarity without ambiguity
  addFromCandidates(sameLenSharedChar, true);
  addFromCandidates(sameSetSameLen, true);
  addFromCandidates(sameLenNearbyTier, true);
  addFromCandidates(sameLen, true);
  addFromCandidates(sameSetAnyLen, true);
  addFromCandidates(nearLen, true);
  addFromCandidates(pool, true);

  // Relax duplicate-between-distractors sound check only if pool is tiny
  if (distractors.length < CHOICE_COUNT - 1) {
    addFromCandidates(sameLen, false);
    addFromCandidates(nearLen, false);
    addFromCandidates(pool, false);
  }

  const allChoices: ChineseListeningChoice[] = [
    {
      word: targetWord.word,
      zhuyin: targetWord.zhuyin,
      isTarget: true,
    },
    ...distractors.slice(0, CHOICE_COUNT - 1),
  ];

  return shuffleWithRng(allChoices, rng);
}

/**
 * Builds an 8-question Traditional Chinese "Listen & Identify" (聽音辨字) session.
 * Guarantees 4 unique Traditional Chinese choices per question, exactly 1 target choice,
 * and zero ambiguous valid-word homophone collisions with the target word.
 */
export function buildChineseListeningSession(
  tier: DifficultyTier,
  wordSets: ChineseWordSet[] = BUILTIN_CHINESE_SETS,
  rng: () => number = Math.random,
): ChineseListeningSession {
  const primaryPool = flattenUniqueEntries(wordSets);
  const fallbackPool =
    wordSets === BUILTIN_CHINESE_SETS
      ? primaryPool
      : flattenUniqueEntries([...wordSets, ...BUILTIN_CHINESE_SETS]);

  const allValidWords = new Set<string>(fallbackPool.map((e) => e.word.word));

  const tierExact = primaryPool.filter((e) => e.word.tier === tier);
  const tierAdjacent = primaryPool.filter((e) => Math.abs(e.word.tier - tier) === 1);
  const tierRest = primaryPool.filter((e) => Math.abs(e.word.tier - tier) > 1);

  const selectedTargets: PoolEntry[] = [];
  const chosenWords = new Set<string>();

  const takeFrom = (bucket: PoolEntry[]) => {
    const needed = LISTENING_QUESTION_COUNT - selectedTargets.length;
    if (needed <= 0) return;
    const available = bucket.filter((e) => !chosenWords.has(e.word.word));
    const sampled = weightedSampleWithoutReplacement(available, needed, rng);
    for (const item of sampled) {
      chosenWords.add(item.word.word);
      selectedTargets.push(item);
    }
  };

  takeFrom(tierExact);
  takeFrom(tierAdjacent);
  takeFrom(tierRest);
  if (selectedTargets.length < LISTENING_QUESTION_COUNT && fallbackPool !== primaryPool) {
    takeFrom(fallbackPool.filter((e) => e.word.tier === tier));
    takeFrom(fallbackPool);
  }

  const orderedTargets = shuffleWithRng(selectedTargets, rng);
  const distractorPool = fallbackPool.length >= CHOICE_COUNT ? fallbackPool : primaryPool;

  const questions: ChineseListeningQuestion[] = orderedTargets.map((entry, idx) => ({
    id: `zhlisten-t${tier}-${idx}-${entry.word.word}`,
    targetWord: entry.word,
    spokenText: entry.word.word,
    choices: pickListeningChoices(entry, distractorPool, allValidWords, rng),
  }));

  const sessionToken = Math.floor(clampRng(rng) * 0x7fffffff).toString(36);

  return {
    id: `zhlisten-session-t${tier}-${sessionToken}`,
    tier,
    questions,
  };
}

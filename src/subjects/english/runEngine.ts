import { getDueReviewItems, getTrickyWords } from '../../core/mastery';
import type { WordMasteryRecord } from '../../core/types';
import type {
  EnglishRunPlan,
  SprintQuestion,
  TargetWord,
  UpgradeQuestion,
  WordSet,
} from './types';
import { BUILTIN_WORD_SETS } from './wordSets';

const DEFAULT_STARTER_CHIPS = [
  'Suddenly, my friend and I ',
  'Yesterday at school, I ',
  'With a big smile, we ',
];

const FALLBACK_BY_POS: Record<TargetWord['partOfSpeech'], string[]> = {
  verb: ['observe', 'predict', 'explore', 'protect', 'persuade', 'rescue'],
  adjective: ['enormous', 'reluctant', 'peculiar', 'fragile', 'determined', 'vibrant'],
  noun: ['shelter', 'triumph', 'evidence', 'consequence', 'perspective'],
  word: ['enormous', 'reluctant', 'observe', 'persuade', 'fragile', 'vibrant'],
};

function isPastTenseVerb(w: TargetWord): boolean {
  return w.partOfSpeech === 'verb' && w.word.toLowerCase().endsWith('ed');
}

function shuffleWithRng<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getLocalDateKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function pickDistractors(
  targetWord: TargetWord,
  wordSetWords: TargetWord[],
  count: number,
  rng: () => number,
  globalPool: TargetWord[],
): string[] {
  const targetLower = targetWord.word.toLowerCase();
  const targetPast = isPastTenseVerb(targetWord);
  const picked: string[] = [];

  const pushFrom = (candidates: TargetWord[]) => {
    for (const candidate of shuffleWithRng(candidates, rng)) {
      if (picked.length >= count) break;
      const lower = candidate.word.toLowerCase();
      if (lower === targetLower) continue;
      if (picked.some((p) => p.toLowerCase() === lower)) continue;
      picked.push(candidate.word);
    }
  };

  if (targetWord.partOfSpeech !== 'word') {
    // 1. Same set + exact POS (and matching -ed tense for past-tense verbs)
    pushFrom(
      wordSetWords.filter(
        (w) => w.partOfSpeech === targetWord.partOfSpeech && isPastTenseVerb(w) === targetPast,
      ),
    );
    // 2. Same or adjacent tier across built-ins with exact POS + tense
    pushFrom(
      globalPool.filter(
        (w) =>
          w.partOfSpeech === targetWord.partOfSpeech &&
          isPastTenseVerb(w) === targetPast &&
          Math.abs(w.tier - targetWord.tier) <= 1,
      ),
    );
    // 3. Any built-in with exact POS + tense
    pushFrom(
      globalPool.filter(
        (w) => w.partOfSpeech === targetWord.partOfSpeech && isPastTenseVerb(w) === targetPast,
      ),
    );
    // 4. Same POS regardless of tense
    pushFrom(globalPool.filter((w) => w.partOfSpeech === targetWord.partOfSpeech));
  } else {
    // Custom word sets without POS tags: pull from the same custom set first
    pushFrom(wordSetWords);
  }

  // 5. Fallback to same set, then POS fallback words
  if (picked.length < count) {
    pushFrom(wordSetWords);
  }
  if (picked.length < count) {
    const fallbacks = shuffleWithRng(FALLBACK_BY_POS[targetWord.partOfSpeech], rng);
    for (const w of fallbacks) {
      if (picked.length >= count) break;
      if (w.toLowerCase() === targetLower || picked.some((p) => p.toLowerCase() === w.toLowerCase())) {
        continue;
      }
      picked.push(w);
    }
  }

  return picked;
}

export function buildTrickyRematchWordSet(
  wordMastery: Record<string, WordMasteryRecord>,
  builtinSets: WordSet[],
  lastBossRematchDate?: string,
  todayKey: string = getLocalDateKey(),
): WordSet | null {
  if (lastBossRematchDate && lastBossRematchDate === todayKey) {
    return null;
  }

  const tricky = getTrickyWords(wordMastery);
  if (tricky.length < 3) return null;

  const lookup = new Map<string, TargetWord>();
  for (const set of builtinSets) {
    for (const w of set.words) {
      lookup.set(w.word.toLowerCase(), w);
    }
  }

  const matchedWords: TargetWord[] = [];
  for (const rec of tricky) {
    if (matchedWords.length >= 5) break;
    const found = lookup.get(rec.word.toLowerCase());
    if (found) matchedWords.push(found);
  }

  if (matchedWords.length < 3) return null;

  return {
    id: 'en-tricky-rematch',
    subjectId: 'english',
    tier: matchedWords[0].tier,
    title: 'Tricky Words Boss Rematch',
    shortTag: '1.5× Daily',
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    emblemCollectibleId: 'critter-sun-phoenix',
    isRematch: true,
    tokenMultiplier: 1.5,
    forgeScenario: 'Conquer your trickiest words in 1 awesome sentence for a 1.5× Daily Bonus!',
    starterChips: ['Today I finally mastered ', 'When things got tricky, I ', 'In my story, the hero '],
    words: matchedWords,
  };
}

export function buildEnglishSrsReviewSet(
  wordMastery: Record<string, WordMasteryRecord>,
  builtinSets: WordSet[],
  nowIso?: string,
): WordSet | null {
  const due = getDueReviewItems(wordMastery, 'english', nowIso);
  if (due.length < 3) return null;

  const lookup = new Map<string, TargetWord>();
  for (const set of builtinSets) {
    for (const w of set.words) {
      lookup.set(w.word.toLowerCase(), w);
    }
  }

  const matchedWords: TargetWord[] = [];
  for (const rec of due) {
    if (matchedWords.length >= 5) break;
    const found = lookup.get(rec.word.toLowerCase());
    if (found) matchedWords.push(found);
  }
  if (matchedWords.length < 3) return null;

  return {
    id: 'en-srs-review',
    subjectId: 'english',
    tier: matchedWords[0].tier,
    title: 'Daily Memory Review',
    shortTag: 'SRS Due',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    emblemCollectibleId: 'crystal-sapphire-fox',
    forgeScenario: 'Lock these due words into long-term memory by weaving 1 into a vivid sentence!',
    starterChips: ['Today I remembered how to ', 'In my favorite scene, the hero ', 'Right before sunset, we '],
    words: matchedWords,
  };
}

export function buildEnglishRun(
  wordSet: WordSet,
  rng: () => number = Math.random,
): EnglishRunPlan {
  const orderedWords = shuffleWithRng(wordSet.words, rng);
  const globalPool = BUILTIN_WORD_SETS.flatMap((s) => s.words);

  const sprintQuestions: SprintQuestion[] = orderedWords.map((targetWord, idx) => {
    const distractors = pickDistractors(targetWord, wordSet.words, 3, rng, globalPool);
    const choices = shuffleWithRng([targetWord.word, ...distractors], rng);
    const sprintPrompt = targetWord.sprintSentence ?? targetWord.contextSentence;
    const hasFillBlank = sprintPrompt.includes('___');

    return {
      id: `sprint-${idx}-${targetWord.word}`,
      targetWord,
      promptText: hasFillBlank ? sprintPrompt : targetWord.definition,
      correctWord: targetWord.word,
      choices,
    };
  });

  const upgradeSource = orderedWords.slice(0, Math.min(3, orderedWords.length));
  const upgradeQuestions: UpgradeQuestion[] = upgradeSource.map((targetWord, idx) => {
    const distractors = pickDistractors(targetWord, wordSet.words, 2, rng, globalPool);
    const choices = shuffleWithRng([targetWord.word, ...distractors], rng);

    return {
      id: `upgrade-${idx}-${targetWord.word}`,
      targetWord,
      sentenceBefore: targetWord.upgradeBefore ?? 'Pick the best word for "',
      plainSpan: targetWord.upgradePlainSpan ?? targetWord.plainBridge,
      sentenceAfter: targetWord.upgradeAfter ?? '".',
      correctWord: targetWord.word,
      choices,
    };
  });

  const forgeWords = orderedWords;

  return {
    wordSet,
    spotlightWords: orderedWords,
    sprintQuestions,
    upgradeQuestions,
    forgePrompt: {
      scenario: wordSet.forgeScenario,
      targetWords: forgeWords.map((w) => w.word),
      starterChips: wordSet.starterChips ?? DEFAULT_STARTER_CHIPS,
      wordGlossary: forgeWords.map((w) => ({
        word: w.word,
        plainBridge: w.plainBridge,
        definition: w.definition,
      })),
    },
  };
}

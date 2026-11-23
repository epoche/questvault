import { getDueReviewItems, getTrickyWords } from '../../core/mastery';
import type { WordMasteryRecord } from '../../core/types';
import { getLocalDateKey } from '../english/runEngine';
import type {
  ChineseRunPlan,
  ChineseSprintQuestion,
  ChineseTargetWord,
  ChineseUpgradeQuestion,
  ChineseWordSet,
} from './types';
import { BUILTIN_CHINESE_SETS } from './wordSets';

const DEFAULT_CHINESE_STARTERS = [
  '今天在學校裡，我',
  '週末和家人出門時，我們',
  '看到這個畫面，我覺得',
];

function shuffleWithRng<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(
  targetWord: ChineseTargetWord,
  setWords: ChineseTargetWord[],
  count: number,
  rng: () => number,
  globalPool: ChineseTargetWord[],
): { word: string; zhuyin: string }[] {
  const picked: { word: string; zhuyin: string }[] = [];

  const addFrom = (candidates: ChineseTargetWord[]) => {
    for (const c of shuffleWithRng(candidates, rng)) {
      if (picked.length >= count) break;
      if (c.word === targetWord.word) continue;
      if (picked.some((p) => p.word === c.word)) continue;
      picked.push({ word: c.word, zhuyin: c.zhuyin });
    }
  };

  if (targetWord.partOfSpeech !== 'word') {
    addFrom(setWords.filter((w) => w.partOfSpeech === targetWord.partOfSpeech));
    addFrom(
      globalPool.filter(
        (w) => w.partOfSpeech === targetWord.partOfSpeech && Math.abs(w.tier - targetWord.tier) <= 1,
      ),
    );
    addFrom(globalPool.filter((w) => w.partOfSpeech === targetWord.partOfSpeech));
  } else {
    addFrom(setWords);
  }

  if (picked.length < count) addFrom(setWords);
  if (picked.length < count) addFrom(globalPool);

  return picked;
}

export function buildChineseTrickyRematchSet(
  wordMastery: Record<string, WordMasteryRecord>,
  builtinSets: ChineseWordSet[],
  lastBossRematchDate?: string,
  todayKey: string = getLocalDateKey(),
): ChineseWordSet | null {
  if (lastBossRematchDate && lastBossRematchDate === todayKey) {
    return null;
  }

  const tricky = getTrickyWords(wordMastery, 'chinese');
  if (tricky.length < 3) return null;

  const lookup = new Map<string, ChineseTargetWord>();
  for (const set of builtinSets) {
    for (const w of set.words) {
      lookup.set(w.word, w);
    }
  }

  const matched: ChineseTargetWord[] = [];
  for (const rec of tricky) {
    if (matched.length >= 5) break;
    const found = lookup.get(rec.word);
    if (found) matched.push(found);
  }

  if (matched.length < 3) return null;

  return {
    id: 'zh-tricky-rematch',
    subjectId: 'chinese',
    tier: matched[0].tier,
    title: '錯詞大魔王挑戰',
    shortTag: '1.5× 每日',
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    emblemCollectibleId: 'critter-sun-phoenix',
    isRematch: true,
    tokenMultiplier: 1.5,
    forgeScenario: '把最常錯的詞語收進一句超帥的中文句子裡，拿下 1.5× 每日獎金！',
    starterChips: ['今天我終於學會了', '練習過後，我現在能', '在我的故事裡，主角'],
    words: matched,
  };
}

export function buildChineseSrsReviewSet(
  wordMastery: Record<string, WordMasteryRecord>,
  builtinSets: ChineseWordSet[],
  nowIso?: string,
): ChineseWordSet | null {
  const due = getDueReviewItems(wordMastery, 'chinese', nowIso);
  if (due.length < 3) return null;

  const lookup = new Map<string, ChineseTargetWord>();
  for (const set of builtinSets) {
    for (const w of set.words) {
      lookup.set(w.word, w);
    }
  }

  const matched: ChineseTargetWord[] = [];
  for (const rec of due) {
    if (matched.length >= 5) break;
    const found = lookup.get(rec.word);
    if (found) matched.push(found);
  }
  if (matched.length < 3) return null;

  return {
    id: 'zh-srs-review',
    subjectId: 'chinese',
    tier: matched[0].tier,
    title: '記憶曲線複習關',
    shortTag: 'SRS 到期',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    emblemCollectibleId: 'crystal-amethyst-owl',
    forgeScenario: '把今天到期的複習詞語收進一句生動的繁體中文句子裡，鎖進長期記憶！',
    starterChips: ['今天複習過後，我終於能用', '在生活裡，我常常', '透過仔細觀察，我'],
    words: matched,
  };
}

export function buildChineseRun(
  wordSet: ChineseWordSet,
  rng: () => number = Math.random,
): ChineseRunPlan {
  const ordered = shuffleWithRng(wordSet.words, rng);
  const globalPool = BUILTIN_CHINESE_SETS.flatMap((s) => s.words);

  const sprintQuestions: ChineseSprintQuestion[] = ordered.map((targetWord, idx) => {
    const distractors = pickDistractors(targetWord, wordSet.words, 3, rng, globalPool);
    const choices = shuffleWithRng(
      [{ word: targetWord.word, zhuyin: targetWord.zhuyin }, ...distractors],
      rng,
    );
    const hasBlank = targetWord.sprintSentence.includes('___');
    return {
      id: `zhsprint-${idx}-${targetWord.word}`,
      targetWord,
      promptText: hasBlank ? targetWord.sprintSentence : `${targetWord.plainBridge}（${targetWord.englishBridge}）`,
      correctWord: targetWord.word,
      choices,
    };
  });

  const upgradeSource = ordered.slice(0, Math.min(3, ordered.length));
  const upgradeQuestions: ChineseUpgradeQuestion[] = upgradeSource.map((targetWord, idx) => {
    const excludeSpan = targetWord.upgradePlainSpan?.trim();
    const filteredSetWords = excludeSpan
      ? wordSet.words.filter((w) => w.word !== excludeSpan)
      : wordSet.words;
    const filteredGlobalPool = excludeSpan
      ? globalPool.filter((w) => w.word !== excludeSpan)
      : globalPool;
    const distractors = pickDistractors(targetWord, filteredSetWords, 2, rng, filteredGlobalPool);
    const choices = shuffleWithRng(
      [{ word: targetWord.word, zhuyin: targetWord.zhuyin }, ...distractors],
      rng,
    );
    return {
      id: `zhup-${idx}-${targetWord.word}`,
      targetWord,
      sentenceBefore: targetWord.upgradeBefore ?? '請選出代表「',
      plainSpan: targetWord.upgradePlainSpan ?? targetWord.plainBridge,
      sentenceAfter: targetWord.upgradeAfter ?? '」的詞語。',
      correctWord: targetWord.word,
      choices,
    };
  });

  const forgeWords = ordered;

  return {
    wordSet,
    spotlightWords: ordered,
    sprintQuestions,
    upgradeQuestions,
    forgePrompt: {
      scenario: wordSet.forgeScenario,
      targetWords: forgeWords.map((w) => w.word),
      starterChips: wordSet.starterChips.length > 0 ? wordSet.starterChips : DEFAULT_CHINESE_STARTERS,
      wordGlossary: forgeWords.map((w) => ({
        word: w.word,
        zhuyin: w.zhuyin,
        englishBridge: w.englishBridge,
        plainBridge: w.plainBridge,
      })),
    },
  };
}

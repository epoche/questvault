import {
  buildChineseArcadeQuestion,
  buildEnglishArcadeQuestion,
  buildMathArcadeQuestion,
  type ArcadeQuestion,
} from './arcadeQuestions';
import { getDueReviewItems, getTrickyWords } from './mastery';
import type { DifficultyTier, PlayerState, SubjectId } from './types';
import { BUILTIN_CHINESE_SETS } from '../subjects/chinese/wordSets';
import type { ChineseTargetWord } from '../subjects/chinese/types';
import { BUILTIN_WORD_SETS } from '../subjects/english/wordSets';
import type { TargetWord } from '../subjects/english/types';
import { generateLogicReasoningQuestion } from '../subjects/logic/logicReasoningEngine';
import {
  LOGIC_REASONING_MODULES,
  SPATIAL_MODULES,
  type LogicQuestion,
  type LogicReasoningModuleId,
  type LogicVisualSpec,
  type SpatialModuleId,
} from '../subjects/logic/logicTypes';
import { generateSpatialQuestion } from '../subjects/logic/spatialEngine';
import {
  generateClockMeasureQuestion,
  type ClockMeasureUnitId,
  type ClockMeasureVisualSpec,
} from '../subjects/math/clockMeasureEngine';
import { classifyHeatmapCell, getFactHeatmapKey } from '../subjects/math/factFluencyEngine';
import { generateDynamicMathItem } from '../subjects/math/mathGenerator';
import { BUILTIN_MATH_SETS } from '../subjects/math/questSets';
import type { MathVisualSpec } from '../subjects/math/types';

export type MixedWarmupMode = 'daily-warmup' | 'mistake-clinic';
export type MixedWarmupSubjectTag = 'english' | 'math' | 'chinese' | 'logic';

export type MixedWarmupMasteryRef =
  | { kind: 'word'; word: string; subjectId: SubjectId; tier: DifficultyTier }
  | { kind: 'math-fact'; a: number; b: number };

export interface MixedWarmupChoice {
  id: string;
  label: string;
  zhuyin?: string;
  logicVisual?: LogicVisualSpec;
}

export interface MixedWarmupItem {
  id: string;
  subjectTag: MixedWarmupSubjectTag;
  sourceLabelEn: string;
  sourceLabelZh: string;
  prompt: string;
  subHint?: string;
  speakText?: string;
  speakLang?: 'en-US' | 'zh-TW';
  mathVisual?: MathVisualSpec;
  revealMathVisualOnFeedback?: boolean;
  clockMeasureVisual?: ClockMeasureVisualSpec;
  logicVisual?: LogicVisualSpec;
  logicFeedbackVisual?: LogicVisualSpec;
  choices: MixedWarmupChoice[];
  correctIndex: number;
  explanation: string;
  masteryRef?: MixedWarmupMasteryRef;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng<T>(items: readonly T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Lookup Caches ──
let _enLookup: Map<string, { word: TargetWord; setWords: TargetWord[] }> | null = null;
function getEnglishLookup() {
  if (!_enLookup) {
    const map = new Map<string, { word: TargetWord; setWords: TargetWord[] }>();
    for (const set of BUILTIN_WORD_SETS) {
      for (const w of set.words) {
        map.set(w.word.toLowerCase(), { word: w, setWords: set.words });
      }
    }
    _enLookup = map;
  }
  return _enLookup;
}

let _zhLookup: Map<string, { word: ChineseTargetWord; setWords: ChineseTargetWord[] }> | null = null;
function getChineseLookup() {
  if (!_zhLookup) {
    const map = new Map<string, { word: ChineseTargetWord; setWords: ChineseTargetWord[] }>();
    for (const set of BUILTIN_CHINESE_SETS) {
      for (const w of set.words) {
        map.set(w.word, { word: w, setWords: set.words });
      }
    }
    _zhLookup = map;
  }
  return _zhLookup;
}

let _mathLookup: Map<
  string,
  { skill: (typeof BUILTIN_MATH_SETS)[number]['items'][number]; setTitle: string }
> | null = null;
function getMathLookup() {
  if (!_mathLookup) {
    const map = new Map<
      string,
      { skill: (typeof BUILTIN_MATH_SETS)[number]['items'][number]; setTitle: string }
    >();
    for (const set of BUILTIN_MATH_SETS) {
      for (const item of set.items) {
        map.set(item.skillLabel.toLowerCase(), { skill: item, setTitle: set.title });
      }
    }
    _mathLookup = map;
  }
  return _mathLookup;
}

function arcadeToMixedItem(
  aq: ArcadeQuestion,
  subjectTag: 'english' | 'math' | 'chinese',
  sourceLabelEn: string,
  sourceLabelZh: string,
  masteryRef?: MixedWarmupMasteryRef,
): MixedWarmupItem {
  const choices: MixedWarmupChoice[] = aq.choices.map((c, idx) => ({
    id: `${aq.id}-opt-${idx}`,
    label: c.label,
    zhuyin: c.zhuyin,
  }));
  const correctIndex = aq.choices.findIndex((c) => c.label === aq.correctAnswer);
  return {
    id: aq.id,
    subjectTag,
    sourceLabelEn,
    sourceLabelZh,
    prompt: aq.prompt,
    subHint: aq.subHint,
    speakText: aq.speakText,
    speakLang: aq.speakLang,
    mathVisual: aq.visual,
    revealMathVisualOnFeedback: aq.revealVisualOnFeedback,
    choices,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation: aq.explanation,
    masteryRef,
  };
}

function buildTargetedEnglishItem(
  target: TargetWord,
  setWords: TargetWord[],
  seq: number,
  sourceLabelEn: string,
  sourceLabelZh: string,
  rng: () => number,
): MixedWarmupItem {
  const allWords = BUILTIN_WORD_SETS.flatMap((s) => s.words);
  const picked: string[] = [];
  const tryPush = (pool: TargetWord[]) => {
    for (const w of shuffleWithRng(pool, rng)) {
      if (picked.length >= 3) break;
      if (w.word.toLowerCase() === target.word.toLowerCase()) continue;
      if (picked.some((p) => p.toLowerCase() === w.word.toLowerCase())) continue;
      picked.push(w.word);
    }
  };
  if (target.partOfSpeech === 'word') {
    tryPush(setWords);
  } else {
    tryPush(setWords.filter((w) => w.partOfSpeech === target.partOfSpeech));
    tryPush(
      allWords.filter(
        (w) => w.partOfSpeech === target.partOfSpeech && Math.abs(w.tier - target.tier) <= 1,
      ),
    );
    tryPush(allWords.filter((w) => w.partOfSpeech === target.partOfSpeech));
  }
  if (picked.length < 3) tryPush(allWords);

  const shuffled = shuffleWithRng([target.word, ...picked.slice(0, 3)], rng);
  const correctIndex = shuffled.indexOf(target.word);
  const promptText = target.sprintSentence ?? target.contextSentence;

  return {
    id: `mw-en-${seq}-${target.word}`,
    subjectTag: 'english',
    sourceLabelEn,
    sourceLabelZh,
    prompt: promptText,
    subHint: `Hint: ${target.plainBridge}`,
    speakText: promptText.replace(/___/g, 'blank'),
    speakLang: 'en-US',
    choices: shuffled.map((label, idx) => ({ id: `opt-${idx}`, label })),
    correctIndex,
    explanation: `"${target.word}" means ${target.plainBridge} (${target.definition}).`,
    masteryRef: { kind: 'word', word: target.word, subjectId: 'english', tier: target.tier },
  };
}

function buildTargetedChineseItem(
  target: ChineseTargetWord,
  setWords: ChineseTargetWord[],
  seq: number,
  sourceLabelEn: string,
  sourceLabelZh: string,
  rng: () => number,
): MixedWarmupItem {
  const allWords = BUILTIN_CHINESE_SETS.flatMap((s) => s.words);
  const picked: { label: string; zhuyin: string }[] = [];
  const tryPush = (pool: ChineseTargetWord[]) => {
    for (const w of shuffleWithRng(pool, rng)) {
      if (picked.length >= 3) break;
      if (w.word === target.word) continue;
      if (picked.some((p) => p.label === w.word)) continue;
      picked.push({ label: w.word, zhuyin: w.zhuyin });
    }
  };
  if (target.partOfSpeech === 'word') {
    tryPush(setWords);
  } else {
    tryPush(setWords.filter((w) => w.partOfSpeech === target.partOfSpeech));
    tryPush(
      allWords.filter(
        (w) => w.partOfSpeech === target.partOfSpeech && Math.abs(w.tier - target.tier) <= 1,
      ),
    );
    tryPush(allWords.filter((w) => w.partOfSpeech === target.partOfSpeech));
  }
  if (picked.length < 3) tryPush(allWords);

  const allChoices = shuffleWithRng(
    [{ label: target.word, zhuyin: target.zhuyin }, ...picked.slice(0, 3)],
    rng,
  );
  const correctIndex = allChoices.findIndex((c) => c.label === target.word);
  const subHint = target.plainBridge.includes(target.word)
    ? target.englishBridge
    : `${target.englishBridge} · ${target.plainBridge}`;

  return {
    id: `mw-zh-${seq}-${target.word}`,
    subjectTag: 'chinese',
    sourceLabelEn,
    sourceLabelZh,
    prompt: target.sprintSentence,
    subHint,
    speakText: target.sprintSentence.replace(/___/g, '什麼'),
    speakLang: 'zh-TW',
    choices: allChoices.map((c, idx) => ({ id: `opt-${idx}`, label: c.label, zhuyin: c.zhuyin })),
    correctIndex,
    explanation: `「${target.word}」＝ ${target.plainBridge}（${target.englishBridge}）`,
    masteryRef: { kind: 'word', word: target.word, subjectId: 'chinese', tier: target.tier },
  };
}

function buildMathFactItem(
  a: number,
  b: number,
  seq: number,
  sourceLabelEn: string,
  sourceLabelZh: string,
  rng: () => number,
): MixedWarmupItem {
  const answer = a * b;
  const candidates = shuffleWithRng(
    [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, answer + 2, answer - 2, answer + 10],
    rng,
  );
  const distractors: number[] = [];
  for (const c of candidates) {
    if (distractors.length >= 3) break;
    if (Number.isInteger(c) && c > 0 && c !== answer && !distractors.includes(c)) {
      distractors.push(c);
    }
  }
  let delta = 1;
  while (distractors.length < 3) {
    if (!distractors.includes(answer + delta)) distractors.push(answer + delta);
    if (distractors.length < 3 && answer - delta > 0 && !distractors.includes(answer - delta)) {
      distractors.push(answer - delta);
    }
    delta += 1;
  }
  const all = shuffleWithRng([answer, ...distractors.slice(0, 3)], rng);
  const correctIndex = all.indexOf(answer);
  const itemId = `mw-fact-${seq}-${a}x${b}`;

  return {
    id: itemId,
    subjectTag: 'math',
    sourceLabelEn,
    sourceLabelZh,
    prompt: `${a} × ${b} = ?`,
    subHint: `${sourceLabelEn} · ${sourceLabelZh} (${a} × ${b})`,
    choices: all.map((v, idx) => ({ id: `${itemId}-opt-${idx}`, label: String(v) })),
    correctIndex,
    explanation: `${a} × ${b} = ${answer}! Great mental math focus!`,
    masteryRef: { kind: 'math-fact', a, b },
  };
}

function logicQuestionToMixedItem(lq: LogicQuestion, isZhPreferred: boolean): MixedWarmupItem {
  return {
    id: `mw-${lq.id}`,
    subjectTag: 'logic',
    sourceLabelEn: 'Logic & Spatial',
    sourceLabelZh: '邏輯與空間',
    prompt: isZhPreferred ? lq.promptZh : lq.promptEn,
    logicVisual: lq.promptVisual,
    logicFeedbackVisual: lq.feedbackVisual,
    choices: lq.choices.map((c, idx) => ({
      id: c.id || `opt-${idx}`,
      label: (isZhPreferred ? c.labelZh : c.labelEn) ?? '',
      logicVisual: c.visual,
    })),
    correctIndex: lq.correctIndex,
    explanation: isZhPreferred ? lq.explanationZh : lq.explanationEn,
  };
}

function getWeakMathFacts(player: PlayerState): { a: number; b: number; severity: number }[] {
  const map = player.mathFactMastery;
  if (!map || typeof map !== 'object') return [];
  const results: { a: number; b: number; severity: number }[] = [];
  for (let a = 2; a <= 12; a += 1) {
    for (let b = 2; b <= 12; b += 1) {
      const entry = map[getFactHeatmapKey(a, b)];
      const status = classifyHeatmapCell(entry);
      if (status === 'needs-focus' || status === 'building') {
        const acc = entry && entry.attempts > 0 ? entry.correct / entry.attempts : 0;
        const severity = (status === 'needs-focus' ? 100 : 50) + Math.round((1 - acc) * 40);
        results.push({ a, b, severity });
      }
    }
  }
  return results.sort((x, y) => y.severity - x.severity);
}

/**
 * Maps a Clock & Measure Lab `wordMastery` skillKey (e.g. "Clock: Read 3:15", "Ruler (in): Zero 3 1/2 in",
 * "Convert: 1 ft = 12 in") back to its ClockMeasureUnitId so Mistake Clinic and Daily Warmup can
 * dynamically generate matching visual review problems and heal the exact mastery entry.
 */
export function matchClockMeasureUnitFromSkillKey(skillKey: string): ClockMeasureUnitId | null {
  const s = skillKey.trim().toLowerCase();
  if (s.startsWith('clock 1-min:')) return 'clock-exact';
  if (s.startsWith('clock:')) return 'clock-basic';
  if (s.startsWith('elapsed:')) return 'clock-elapsed';
  if (s.startsWith('am/pm:')) return 'clock-schedule';
  if (s.startsWith('ruler (')) return 'measure-ruler';
  if (s.startsWith('unit sense:')) return 'measure-unit-sense';
  if (s.startsWith('beaker (') || s.startsWith('scale (')) return 'measure-beaker-scale';
  if (s.startsWith('convert:')) return 'measure-conversions';
  return null;
}

function buildClockMeasureMixedItem(
  unitId: ClockMeasureUnitId,
  skillWord: string,
  tier: DifficultyTier,
  seq: number,
  sourceLabelEn: string,
  sourceLabelZh: string,
  rng: () => number,
  usedIds?: Set<string>,
): MixedWarmupItem {
  const q = generateClockMeasureQuestion(unitId, seq, rng, {
    allowInteractive: false,
    usedIds,
  });
  const itemId = `mw-cm-${seq}-${q.id}`;
  const correctIdx = q.choices.indexOf(q.correctChoice);
  return {
    id: itemId,
    subjectTag: 'math',
    sourceLabelEn,
    sourceLabelZh,
    prompt: q.prompt,
    subHint:
      unitId === 'measure-conversions'
        ? '大單位轉小單位用「乘法」（先回想換算倍率再相乘）！'
        : q.zhHint,
    speakText: q.prompt,
    speakLang: 'en-US',
    clockMeasureVisual: q.visual,
    choices: q.choices.map((label, idx) => ({ id: `${itemId}-opt-${idx}`, label })),
    correctIndex: correctIdx >= 0 ? correctIdx : 0,
    explanation: `${q.explanation}（${q.zhExplanation}）`,
    masteryRef: { kind: 'word', word: skillWord, subjectId: 'math', tier },
  };
}

/**
 * Counts how many active mistakes / weak spots are currently waiting in the Mistake Clinic.
 */
export function countClinicPatients(player: PlayerState): number {
  const enLookup = getEnglishLookup();
  const zhLookup = getChineseLookup();
  const mathLookup = getMathLookup();

  const trickyEn = getTrickyWords(player.wordMastery, 'english').filter((r) =>
    enLookup.has(r.word.toLowerCase()),
  );
  const trickyZh = getTrickyWords(player.wordMastery, 'chinese').filter((r) =>
    zhLookup.has(r.word),
  );
  const trickyMath = getTrickyWords(player.wordMastery, 'math').filter(
    (r) => mathLookup.has(r.word.toLowerCase()) || matchClockMeasureUnitFromSkillKey(r.word) !== null,
  );
  const weakFacts = getWeakMathFacts(player).filter((f) => f.severity >= 100);

  return trickyEn.length + trickyZh.length + trickyMath.length + weakFacts.length;
}

/**
 * Builds an 8-question interleaved Daily 5-Min Mixed Warm-Up:
 * 2 English + 2 Math + 2 Chinese + 2 Logic & Spatial (prioritizing SRS due & weak spots).
 */
export function buildDailyMixedWarmup(
  player: PlayerState,
  seed: number,
  nowIso: string = new Date().toISOString(),
  isZhLogic = true,
): MixedWarmupItem[] {
  const rng = mulberry32(seed || 12345);
  const enLookup = getEnglishLookup();
  const zhLookup = getChineseLookup();
  const mathLookup = getMathLookup();

  const enTier: DifficultyTier = player.subjectTiers?.english ?? player.activeTier ?? 2;
  const mathTier: DifficultyTier = player.subjectTiers?.math ?? player.activeTier ?? 2;
  const zhTier: DifficultyTier = player.subjectTiers?.chinese ?? player.activeTier ?? 2;

  // 1. Pick 2 English items (SRS due -> tricky -> fresh arcade)
  const enItems: MixedWarmupItem[] = [];
  const usedEn = new Set<string>();
  const enPriority = [
    ...getDueReviewItems(player.wordMastery, 'english', nowIso),
    ...getTrickyWords(player.wordMastery, 'english'),
  ];
  for (const rec of enPriority) {
    if (enItems.length >= 2) break;
    const key = rec.word.toLowerCase();
    if (usedEn.has(key)) continue;
    const hit = enLookup.get(key);
    if (!hit) continue;
    usedEn.add(key);
    enItems.push(
      buildTargetedEnglishItem(
        hit.word,
        hit.setWords,
        enItems.length + 1,
        'English · SRS Review',
        '英文 · SRS 複習',
        rng,
      ),
    );
  }
  let guard = 0;
  while (enItems.length < 2 && guard < 30) {
    guard += 1;
    const aq = buildEnglishArcadeQuestion(enTier, enItems.length + guard, rng);
    const key = aq.correctAnswer.toLowerCase();
    if (usedEn.has(key)) continue;
    usedEn.add(key);
    const hit = enLookup.get(key);
    enItems.push(
      arcadeToMixedItem(
        aq,
        'english',
        'English · Warm-Up',
        '英文 · 暖身題',
        hit ? { kind: 'word', word: hit.word.word, subjectId: 'english', tier: hit.word.tier } : undefined,
      ),
    );
  }

  // 2. Pick 2 Math items (weak math facts -> tricky math skills -> fresh dynamic math)
  const mathItems: MixedWarmupItem[] = [];
  const usedMathKeys = new Set<string>();
  const weakFacts = getWeakMathFacts(player);
  if (weakFacts.length > 0) {
    const wf = weakFacts[0];
    usedMathKeys.add(`fact:${wf.a}x${wf.b}`);
    mathItems.push(
      buildMathFactItem(wf.a, wf.b, 1, 'Math · Fact Focus', '數學 · 心算加強', rng),
    );
  }
  const mathPriority = [
    ...getDueReviewItems(player.wordMastery, 'math', nowIso),
    ...getTrickyWords(player.wordMastery, 'math'),
  ];
  for (const rec of mathPriority) {
    if (mathItems.length >= 2) break;
    const key = rec.word.toLowerCase();
    if (usedMathKeys.has(key)) continue;
    const cmUnitId = matchClockMeasureUnitFromSkillKey(rec.word);
    if (cmUnitId) {
      usedMathKeys.add(key);
      mathItems.push(
        buildClockMeasureMixedItem(
          cmUnitId,
          rec.word,
          rec.tier,
          mathItems.length + 1,
          'Math · Clock & Measure Review',
          '數學 · 時鐘度量衡複習',
          rng,
        ),
      );
      continue;
    }
    const hit = mathLookup.get(key);
    if (!hit) continue;
    usedMathKeys.add(key);
    usedMathKeys.add(hit.skill.id.toLowerCase());
    const dynamic = generateDynamicMathItem(hit.skill, rng);
    const allChoices = shuffleWithRng([dynamic.correctAnswer, ...dynamic.distractors], rng);
    const itemId = `mw-math-${mathItems.length + 1}-${dynamic.id}`;
    mathItems.push({
      id: itemId,
      subjectTag: 'math',
      sourceLabelEn: 'Math · SRS Review',
      sourceLabelZh: '數學 · SRS 複習',
      prompt: dynamic.sprintPrompt,
      subHint: `${hit.setTitle} · Tier ${dynamic.tier}`,
      mathVisual: dynamic.sprintVisual,
      revealMathVisualOnFeedback: dynamic.revealVisualOnFeedback,
      choices: allChoices.map((label, idx) => ({ id: `${itemId}-opt-${idx}`, label })),
      correctIndex: allChoices.indexOf(dynamic.correctAnswer),
      explanation: dynamic.explanation,
      masteryRef: { kind: 'word', word: hit.skill.skillLabel, subjectId: 'math', tier: hit.skill.tier },
    });
  }
  const preferredMathPool = BUILTIN_MATH_SETS.filter((s) => Math.abs(s.tier - mathTier) <= 1).flatMap(
    (s) => s.items.map((skill) => ({ skill, setTitle: s.title })),
  );
  const allMathPool = BUILTIN_MATH_SETS.flatMap((s) =>
    s.items.map((skill) => ({ skill, setTitle: s.title })),
  );
  const shuffledMathPool = shuffleWithRng(
    preferredMathPool.length >= 4 ? preferredMathPool : allMathPool,
    rng,
  );
  for (const entry of shuffledMathPool) {
    if (mathItems.length >= 2) break;
    const idKey = entry.skill.id.toLowerCase();
    const labelKey = entry.skill.skillLabel.toLowerCase();
    if (usedMathKeys.has(idKey) || usedMathKeys.has(labelKey)) continue;
    usedMathKeys.add(idKey);
    usedMathKeys.add(labelKey);
    const dynamic = generateDynamicMathItem(entry.skill, rng);
    const allChoices = shuffleWithRng([dynamic.correctAnswer, ...dynamic.distractors], rng);
    const itemId = `mw-math-${mathItems.length + 1}-${dynamic.id}`;
    mathItems.push({
      id: itemId,
      subjectTag: 'math',
      sourceLabelEn: 'Math · Warm-Up',
      sourceLabelZh: '數學 · 暖身題',
      prompt: dynamic.sprintPrompt,
      subHint: `${entry.setTitle} · Tier ${dynamic.tier}`,
      mathVisual: dynamic.sprintVisual,
      revealMathVisualOnFeedback: dynamic.revealVisualOnFeedback,
      choices: allChoices.map((label, idx) => ({ id: `${itemId}-opt-${idx}`, label })),
      correctIndex: allChoices.indexOf(dynamic.correctAnswer),
      explanation: dynamic.explanation,
      masteryRef: {
        kind: 'word',
        word: entry.skill.skillLabel,
        subjectId: 'math',
        tier: entry.skill.tier,
      },
    });
  }
  let mathFallbackGuard = 0;
  while (mathItems.length < 2 && mathFallbackGuard < 10) {
    mathFallbackGuard += 1;
    const aq = buildMathArcadeQuestion(mathTier, mathItems.length + mathFallbackGuard, rng);
    mathItems.push(arcadeToMixedItem(aq, 'math', 'Math · Warm-Up', '數學 · 暖身題'));
  }

  // 3. Pick 2 Chinese items (SRS due -> tricky -> fresh arcade)
  const zhItems: MixedWarmupItem[] = [];
  const usedZh = new Set<string>();
  const zhPriority = [
    ...getDueReviewItems(player.wordMastery, 'chinese', nowIso),
    ...getTrickyWords(player.wordMastery, 'chinese'),
  ];
  for (const rec of zhPriority) {
    if (zhItems.length >= 2) break;
    if (usedZh.has(rec.word)) continue;
    const hit = zhLookup.get(rec.word);
    if (!hit) continue;
    usedZh.add(rec.word);
    zhItems.push(
      buildTargetedChineseItem(
        hit.word,
        hit.setWords,
        zhItems.length + 1,
        'Chinese · SRS Review',
        '中文 · SRS 複習',
        rng,
      ),
    );
  }
  guard = 0;
  while (zhItems.length < 2 && guard < 30) {
    guard += 1;
    const aq = buildChineseArcadeQuestion(zhTier, zhItems.length + guard, rng);
    if (usedZh.has(aq.correctAnswer)) continue;
    usedZh.add(aq.correctAnswer);
    const hit = zhLookup.get(aq.correctAnswer);
    zhItems.push(
      arcadeToMixedItem(
        aq,
        'chinese',
        'Chinese · Warm-Up',
        '中文 · 暖身題',
        hit ? { kind: 'word', word: hit.word.word, subjectId: 'chinese', tier: hit.word.tier } : undefined,
      ),
    );
  }

  // 4. Pick 2 Logic & Spatial items (1 Spatial + 1 Logic Reasoning)
  const spatialMod = SPATIAL_MODULES[Math.floor(rng() * SPATIAL_MODULES.length)].id as SpatialModuleId;
  const logicMod =
    LOGIC_REASONING_MODULES[Math.floor(rng() * LOGIC_REASONING_MODULES.length)]
      .id as LogicReasoningModuleId;
  const lq1 = generateSpatialQuestion(spatialMod, Math.abs((seed * 31 + 17) | 0) + 1);
  const lq2 = generateLogicReasoningQuestion(logicMod, Math.abs((seed * 73 + 29) | 0) + 1);
  const logicItems: MixedWarmupItem[] = [
    logicQuestionToMixedItem(lq1, isZhLogic),
    logicQuestionToMixedItem(lq2, isZhLogic),
  ];

  // Interleave cleanly: EN -> Math -> ZH -> Logic -> EN -> Math -> ZH -> Logic
  return [
    enItems[0],
    mathItems[0],
    zhItems[0],
    logicItems[0],
    enItems[1],
    mathItems[1],
    zhItems[1],
    logicItems[1],
  ].filter(Boolean);
}

/**
 * Builds up to `maxItems` (default 6) Mistake Clinic healing questions drawn exclusively
 * from the student's active tricky EN/ZH/Math words and red/needs-focus 2–12 math facts.
 * Returns an empty array when the student has zero active mistakes!
 */
export function buildMistakeClinicSession(
  player: PlayerState,
  seed: number,
  maxItems = 6,
): MixedWarmupItem[] {
  const rng = mulberry32(seed || 54321);
  const enLookup = getEnglishLookup();
  const zhLookup = getChineseLookup();
  const mathLookup = getMathLookup();

  interface Candidate {
    priority: number;
    build: (seq: number) => MixedWarmupItem;
  }

  const candidates: Candidate[] = [];

  for (const rec of getTrickyWords(player.wordMastery, 'english')) {
    const hit = enLookup.get(rec.word.toLowerCase());
    if (!hit) continue;
    candidates.push({
      priority: rec.missed * 10 - rec.correctFirstTry,
      build: (seq) =>
        buildTargetedEnglishItem(
          hit.word,
          hit.setWords,
          seq,
          `Clinic · Missed ${rec.missed}×`,
          `英文急救 · 曾錯 ${rec.missed} 次`,
          rng,
        ),
    });
  }

  for (const rec of getTrickyWords(player.wordMastery, 'chinese')) {
    const hit = zhLookup.get(rec.word);
    if (!hit) continue;
    candidates.push({
      priority: rec.missed * 10 - rec.correctFirstTry,
      build: (seq) =>
        buildTargetedChineseItem(
          hit.word,
          hit.setWords,
          seq,
          `Clinic · Missed ${rec.missed}×`,
          `中文急救 · 曾錯 ${rec.missed} 次`,
          rng,
        ),
    });
  }

  const cmUsedIds = new Set<string>();
  for (const rec of getTrickyWords(player.wordMastery, 'math')) {
    const cmUnitId = matchClockMeasureUnitFromSkillKey(rec.word);
    if (cmUnitId) {
      candidates.push({
        priority: rec.missed * 10 - rec.correctFirstTry,
        build: (seq) =>
          buildClockMeasureMixedItem(
            cmUnitId,
            rec.word,
            rec.tier,
            seq,
            `Clinic · Clock & Measure (${rec.missed}×)`,
            `時鐘度量衡急救 · 曾錯 ${rec.missed} 次`,
            rng,
            cmUsedIds,
          ),
      });
      continue;
    }
    const hit = mathLookup.get(rec.word.toLowerCase());
    if (!hit) continue;
    candidates.push({
      priority: rec.missed * 10 - rec.correctFirstTry,
      build: (seq) => {
        const dynamic = generateDynamicMathItem(hit.skill, rng);
        const allChoices = shuffleWithRng([dynamic.correctAnswer, ...dynamic.distractors], rng);
        return {
          id: `clinic-math-${seq}-${dynamic.id}`,
          subjectTag: 'math',
          sourceLabelEn: `Clinic · Missed ${rec.missed}×`,
          sourceLabelZh: `數學急救 · 曾錯 ${rec.missed} 次`,
          prompt: dynamic.sprintPrompt,
          subHint: `${hit.setTitle} · Tier ${dynamic.tier}`,
          mathVisual: dynamic.sprintVisual,
          revealMathVisualOnFeedback: dynamic.revealVisualOnFeedback,
          choices: allChoices.map((label, idx) => ({ id: `opt-${idx}`, label })),
          correctIndex: allChoices.indexOf(dynamic.correctAnswer),
          explanation: dynamic.explanation,
          masteryRef: {
            kind: 'word',
            word: hit.skill.skillLabel,
            subjectId: 'math',
            tier: hit.skill.tier,
          },
        };
      },
    });
  }

  for (const wf of getWeakMathFacts(player)) {
    if (wf.severity < 100) continue; // Only red 'needs-focus' facts in Mistake Clinic
    candidates.push({
      priority: wf.severity,
      build: (seq) =>
        buildMathFactItem(wf.a, wf.b, seq, 'Clinic · Fact Heal', '心算急救 · 弱點補強', rng),
    });
  }

  candidates.sort((a, b) => b.priority - a.priority);
  return candidates.slice(0, maxItems).map((c, idx) => c.build(idx + 1));
}

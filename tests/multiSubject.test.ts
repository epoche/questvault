import { describe, expect, it } from 'vitest';
import { createInitialPlayerState } from '../src/core/economy';
import {
  classifyWordMastery,
  getTierAccuracySummary,
  getTrickyWords,
  recordWordOutcome,
} from '../src/core/mastery';
import { SUBJECTS } from '../src/core/registry';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import type { WordMasteryRecord } from '../src/core/types';
import { parseCustomChineseList } from '../src/subjects/chinese/chineseCustomParser';
import {
  buildChineseRun,
  buildChineseTrickyRematchSet,
} from '../src/subjects/chinese/chineseEngine';
import {
  createChinesePlacementSession,
  submitChinesePlacementAnswer,
} from '../src/subjects/chinese/chinesePlacement';
import { evaluateChineseWriting } from '../src/subjects/chinese/chineseWritingChecks';
import {
  BUILTIN_CHINESE_SETS,
  getAllBuiltinChineseWords,
  getChineseTierWordCounts,
} from '../src/subjects/chinese/wordSets';
import { buildMathRun, buildMathTrickyRematchSet } from '../src/subjects/math/mathEngine';
import {
  createMathPlacementSession,
  submitMathPlacementAnswer,
} from '../src/subjects/math/mathPlacement';
import { BUILTIN_MATH_SETS, getMathTierSkillCounts } from '../src/subjects/math/questSets';

describe('Multi-Subject Registry & Isolation', () => {
  it('activates English, Math, and Chinese subjects in the shared registry', () => {
    expect(SUBJECTS.map((s) => s.id)).toEqual(['english', 'math', 'chinese']);
    for (const s of SUBJECTS) {
      expect(s.status).toBe('active');
    }
  });

  it('tracks English, Math, and Chinese mastery independently and round-trips via JSON backup', () => {
    let mastery: Record<string, WordMasteryRecord> = {};
    mastery = recordWordOutcome(mastery, { word: 'observe', subjectId: 'english', tier: 3, outcome: 'missed' });
    mastery = recordWordOutcome(mastery, { word: '6 × 7', subjectId: 'math', tier: 1, outcome: 'missed' });
    mastery = recordWordOutcome(mastery, { word: '觀察', subjectId: 'chinese', tier: 2, outcome: 'missed' });
    mastery = recordWordOutcome(mastery, { word: 'Unit Fractions', subjectId: 'math', tier: 1, outcome: 'clean' });
    mastery = recordWordOutcome(mastery, { word: 'Unit Fractions', subjectId: 'math', tier: 1, outcome: 'clean' });

    expect(getTrickyWords(mastery, 'english').map((r) => r.word)).toEqual(['observe']);
    expect(getTrickyWords(mastery, 'math').map((r) => r.word)).toEqual(['6 × 7']);
    expect(getTrickyWords(mastery, 'chinese').map((r) => r.word)).toEqual(['觀察']);
    expect(classifyWordMastery(mastery['math:unit fractions'])).toBe('mastered');

    const mathT1 = getTierAccuracySummary(mastery, getMathTierSkillCounts(), 'math').find((r) => r.tier === 1)!;
    expect(mathT1.practicedWords).toBe(2);
    expect(mathT1.totalWords).toBe(28);

    const state = {
      ...createInitialPlayerState('Mia'),
      activeSubjectId: 'chinese' as const,
      subjectTiers: { english: 3 as const, math: 2 as const, chinese: 1 as const },
      showZhuyin: true,
      wordMastery: mastery,
    };
    const res = importPlayerStateJson(exportPlayerStateJson(state));
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.state.activeSubjectId).toBe('chinese');
      expect(res.state.subjectTiers).toEqual({ english: 3, math: 2, chinese: 1 });
      expect(res.state.showZhuyin).toBe(true);
      expect(getTrickyWords(res.state.wordMastery, 'math').map((r) => r.word)).toEqual(['6 × 7']);
    }
  });
});

describe('Math Subject (28 Quest Sets, Visuals, Placement, Boss Rematch)', () => {
  it('ships 28 Math Quest Sets (112 skills across 4 Tiers) with unique valid choices', () => {
    expect(BUILTIN_MATH_SETS).toHaveLength(28);
    const seenIds = new Set<string>();
    for (const set of BUILTIN_MATH_SETS) {
      expect(set.items.length).toBeGreaterThanOrEqual(4);
      for (const item of set.items) {
        expect(seenIds.has(item.id)).toBe(false);
        seenIds.add(item.id);
        expect(new Set([item.correctAnswer, ...item.distractors]).size).toBe(4);
        expect(new Set([item.wordProblemAnswer, ...item.wordProblemDistractors]).size).toBe(4);
        expect(item.sprintPrompt).not.toBe(item.wordProblemPrompt);
      }
    }
    expect(seenIds.size).toBe(112);
  });

  it('builds Math runs, adaptive Placement (Tier 4 up / Tier 1 down), and 1.5x Daily Boss Rematch', () => {
    const plan = buildMathRun(BUILTIN_MATH_SETS[0], () => 0.3);
    expect(plan.conceptItems).toHaveLength(4);
    expect(plan.sprintQuestions).toHaveLength(4);
    expect(plan.challengeQuestions).toHaveLength(3);

    let up = createMathPlacementSession(BUILTIN_MATH_SETS, () => 0.25);
    while (!up.completed && up.currentQuestion) {
      up = submitMathPlacementAnswer(up, up.currentQuestion.correctAnswer);
    }
    expect(up.recommendedTier).toBe(4);

    let down = createMathPlacementSession(BUILTIN_MATH_SETS, () => 0.25);
    while (!down.completed && down.currentQuestion) {
      const wrong = down.currentQuestion.choices.find((c) => c !== down.currentQuestion?.correctAnswer)!;
      down = submitMathPlacementAnswer(down, wrong);
    }
    expect(down.recommendedTier).toBe(1);

    let map: Record<string, WordMasteryRecord> = {};
    for (const skill of ['6 × 4', '6 × 7', '9 × Facts']) {
      map = recordWordOutcome(map, { word: skill, subjectId: 'math', tier: 1, outcome: 'missed' });
    }
    const boss = buildMathTrickyRematchSet(map, BUILTIN_MATH_SETS, undefined, '2026-11-22');
    expect(boss).not.toBeNull();
    expect(boss?.tokenMultiplier).toBe(1.5);
    expect(buildMathTrickyRematchSet(map, BUILTIN_MATH_SETS, '2026-11-22', '2026-11-22')).toBeNull();
  });
});

describe('Traditional Chinese Subject (60 Sets, Zhuyin, Anti-Cheese Writing, Importer)', () => {
  it('ships 60 Chinese Word Sets (300 words) with exact per-char Zhuyin and distinct transfer sprintSentences', () => {
    expect(BUILTIN_CHINESE_SETS).toHaveLength(60);
    const tierCounts = getChineseTierWordCounts();
    expect(tierCounts).toEqual({ 1: 70, 2: 80, 3: 80, 4: 70 });

    for (const set of BUILTIN_CHINESE_SETS) {
      expect(set.starterChips.length).toBeGreaterThanOrEqual(3);
      for (const w of set.words) {
        expect(Array.from(w.word).length).toBe(w.zhuyin.trim().split(/\s+/).length);
        expect(w.sprintSentence).toContain('___');
        expect(w.sprintSentence).not.toBe(w.contextSentence);
      }
    }
  });

  it('matches part-of-speech distractors in Chinese Sprint & Placement', () => {
    const lookup = getAllBuiltinChineseWords();
    const run = buildChineseRun(BUILTIN_CHINESE_SETS[5], () => 0.4);
    for (const q of run.sprintQuestions) {
      for (const c of q.choices) {
        expect(lookup.get(c.word)?.word.partOfSpeech).toBe(q.targetWord.partOfSpeech);
      }
    }

    let up = createChinesePlacementSession(BUILTIN_CHINESE_SETS, () => 0.2);
    while (!up.completed && up.currentQuestion) {
      up = submitChinesePlacementAnswer(up, up.currentQuestion.correctWord);
    }
    expect(up.recommendedTier).toBe(4);
  });

  it('blocks Chinese repetition spam & mash while accepting real sentences, and imports plain Chinese word lists', () => {
    const targets = ['觀察', '躲藏', '追趕', '分享'];
    const scenario = '下課時間你在操場跟同學玩遊戲！用一個生動動作詞寫一句話。';

    expect(evaluateChineseWriting('我的的的的觀察的。', targets, scenario).canUnlockChest).toBe(false);
    expect(evaluateChineseWriting('觀察觀察觀察觀察。', targets, scenario).canUnlockChest).toBe(false);
    expect(evaluateChineseWriting('asdfghjkl 觀察。', targets, scenario).canUnlockChest).toBe(false);
    expect(
      evaluateChineseWriting('下課時間我在操場觀察一隻可愛的蝴蝶。', targets, scenario).allPassed,
    ).toBe(true);

    const parsed = parseCustomChineseList('第 12 課', '觀察、勇敢、森林、彩虹、猶豫');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.record.words).toHaveLength(5);
      expect(parsed.record.words[0].zhuyin).toBe('ㄍㄨㄢ ㄔㄚˊ');
    }

    expect(parseCustomChineseList('無效', '一、一、二、三').ok).toBe(false);

    let map: Record<string, WordMasteryRecord> = {};
    for (const w of ['觀察', '猶豫', '專心致志']) {
      map = recordWordOutcome(map, { word: w, subjectId: 'chinese', tier: 3, outcome: 'missed' });
    }
    const boss = buildChineseTrickyRematchSet(map, BUILTIN_CHINESE_SETS, undefined, '2026-11-22');
    expect(boss).not.toBeNull();
    expect(boss?.tokenMultiplier).toBe(1.5);
  });

  it('includes all 5 quest words in Chinese Stage 3 Forge and never leaks unmatched custom words in Sprint', () => {
    const run = buildChineseRun(BUILTIN_CHINESE_SETS[6], () => 0.3);
    expect(run.forgePrompt.targetWords).toHaveLength(BUILTIN_CHINESE_SETS[6].words.length);

    const parsed = parseCustomChineseList('太空詞庫', '星際艦長\n火星基地\n黑洞探險');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.unmatchedWords).toEqual(['星際艦長', '火星基地', '黑洞探險']);
      for (const w of parsed.wordSet.words) {
        expect(w.plainBridge).not.toContain(w.word);
        expect(w.sprintSentence).not.toContain(w.word);
      }
    }

    const factorSet = BUILTIN_MATH_SETS.find((s) => s.id === 'math-t3-factors-primes')!;
    const factorItem = factorSet.items.find((i) => i.id === 'm-t3-factors-24')!;
    expect(factorItem.revealVisualOnFeedback).toBe(true);
  });
});

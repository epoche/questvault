import { describe, expect, it } from 'vitest';
import {
  classifyWordMastery,
  getLearningWords,
  getTierAccuracySummary,
  getTrickyWords,
  recordWordOutcome,
} from '../src/core/mastery';
import { COLLECTIBLES, MYSTERY_PACKS } from '../src/core/packs';
import type { WordMasteryRecord } from '../src/core/types';
import { parseCustomWordList } from '../src/subjects/english/customParser';
import {
  createPlacementSession,
  submitPlacementAnswer,
} from '../src/subjects/english/placement';
import {
  buildEnglishRun,
  buildTrickyRematchWordSet,
} from '../src/subjects/english/runEngine';
import {
  BUILTIN_WORD_SETS,
  getAllBuiltinTargetWords,
  getTierWordCounts,
} from '../src/subjects/english/wordSets';
import { evaluateWritingSubmission } from '../src/subjects/english/writingChecks';

describe('v2+ 30-Pack 240-Collectible Catalog', () => {
  it('ships 30 Mystery Packs with 8 Collectibles each (240 total) and 1 Chroma per pack', () => {
    expect(MYSTERY_PACKS).toHaveLength(30);
    expect(COLLECTIBLES).toHaveLength(240);

    for (const pack of MYSTERY_PACKS) {
      const items = COLLECTIBLES.filter((c) => c.packId === pack.id);
      expect(items).toHaveLength(8);
      expect(items.filter((c) => c.rarity === 'chroma')).toHaveLength(1);
    }
  });
});

describe('v2 Word Mastery Tracking, Coverage & Daily Boss Rematch', () => {
  it('classifies missed, learning, and mastered words and computes accurate tier coverage', () => {
    let map: Record<string, WordMasteryRecord> = {};
    map = recordWordOutcome(map, { word: 'reluctant', tier: 3, outcome: 'missed', nowIso: '2026-11-22T01:00:00Z' });
    map = recordWordOutcome(map, { word: 'reluctant', tier: 3, outcome: 'missed', nowIso: '2026-11-22T01:01:00Z' });
    map = recordWordOutcome(map, { word: 'peculiar', tier: 3, outcome: 'missed', nowIso: '2026-11-22T01:02:00Z' });
    map = recordWordOutcome(map, { word: 'observe', tier: 3, outcome: 'clean', nowIso: '2026-11-22T01:02:30Z' });
    map = recordWordOutcome(map, { word: 'brave', tier: 1, outcome: 'clean', nowIso: '2026-11-22T01:03:00Z' });
    map = recordWordOutcome(map, { word: 'brave', tier: 1, outcome: 'clean', nowIso: '2026-11-22T01:04:00Z' });
    map = recordWordOutcome(map, { word: 'brave', tier: 1, outcome: 'writing', nowIso: '2026-11-22T01:05:00Z' });

    expect(classifyWordMastery(map['reluctant'])).toBe('tricky');
    expect(classifyWordMastery(map['observe'])).toBe('learning');
    expect(classifyWordMastery(map['brave'])).toBe('mastered');

    expect(getTrickyWords(map).map((t) => t.word)).toEqual(['reluctant', 'peculiar']);
    expect(getLearningWords(map).map((t) => t.word)).toEqual(['observe']);

    const tier3Row = getTierAccuracySummary(map, getTierWordCounts()).find((r) => r.tier === 3)!;
    expect(tier3Row.practicedWords).toBe(3);
    expect(tier3Row.totalWords).toBe(85);
    expect(tier3Row.coveragePct).toBe(4);
  });

  it('builds a 1.5x Daily Boss Rematch when 3+ tricky words exist and caps it to once per day', () => {
    let map: Record<string, WordMasteryRecord> = {};
    for (const w of ['reluctant', 'peculiar', 'observe', 'persuade']) {
      map = recordWordOutcome(map, { word: w, tier: 3, outcome: 'missed', nowIso: '2026-11-22T01:00:00Z' });
    }
    const rematch = buildTrickyRematchWordSet(map, BUILTIN_WORD_SETS, undefined, '2026-11-22');
    expect(rematch).not.toBeNull();
    expect(rematch?.words).toHaveLength(4);
    expect(rematch?.isRematch).toBe(true);
    expect(rematch?.tokenMultiplier).toBe(1.5);

    const cappedToday = buildTrickyRematchWordSet(map, BUILTIN_WORD_SETS, '2026-11-22', '2026-11-22');
    expect(cappedToday).toBeNull();

    const availableTomorrow = buildTrickyRematchWordSet(map, BUILTIN_WORD_SETS, '2026-11-22', '2026-11-23');
    expect(availableTomorrow).not.toBeNull();
  });
});

describe('v2 Fresh Transfer Sentences & Same-POS Distractors', () => {
  it('gives every built-in word a distinct transfer sprintSentence and starterChips per set', () => {
    for (const set of BUILTIN_WORD_SETS) {
      expect(set.starterChips && set.starterChips.length).toBeGreaterThanOrEqual(3);
      for (const w of set.words) {
        expect(w.sprintSentence).toBeTruthy();
        expect(w.sprintSentence).toContain('___');
        expect(w.sprintSentence).not.toBe(w.contextSentence);
      }
    }
  });

  it('matches part-of-speech for Sprint and Placement distractors (no verb/adjective leaks)', () => {
    const lookup = getAllBuiltinTargetWords();
    const mixedSet = BUILTIN_WORD_SETS.find((s) => s.id === 'en-t2-smart-thinkers')!;
    const run = buildEnglishRun(mixedSet, () => 0.35);

    for (const q of run.sprintQuestions) {
      for (const choice of q.choices) {
        const meta = lookup.get(choice.toLowerCase());
        expect(meta?.word.partOfSpeech).toBe(q.targetWord.partOfSpeech);
      }
    }

    const session = createPlacementSession(BUILTIN_WORD_SETS, () => 0.35);
    const pq = session.currentQuestion!;
    for (const choice of pq.choices) {
      const meta = lookup.get(choice.toLowerCase());
      expect(meta?.word.partOfSpeech).toBe(pq.targetWord.partOfSpeech);
    }
  });
});

describe('v2 Adaptive Placement Quest Seam', () => {
  it('steps up to Tier 4 when Player answers all 8 placement questions cleanly', () => {
    let session = createPlacementSession(BUILTIN_WORD_SETS, () => 0.25);
    expect(session.currentTier).toBe(2);
    expect(session.totalQuestions).toBe(8);

    while (!session.completed && session.currentQuestion) {
      session = submitPlacementAnswer(session, session.currentQuestion.correctWord);
    }

    expect(session.completed).toBe(true);
    expect(session.recommendedTier).toBe(4);
    expect(session.recommendationReason.length).toBeGreaterThan(10);
  });

  it('steps down to Tier 1 when Player scores poorly on placement questions', () => {
    let session = createPlacementSession(BUILTIN_WORD_SETS, () => 0.25);

    while (!session.completed && session.currentQuestion) {
      const wrong = session.currentQuestion.choices.find(
        (c) => c !== session.currentQuestion?.correctWord,
      )!;
      session = submitPlacementAnswer(session, wrong);
    }

    expect(session.completed).toBe(true);
    expect(session.recommendedTier).toBe(1);
  });
});

describe('v2 Anti-Cheese Writer Forge & Plain-Word Importer', () => {
  it('blocks repeated-word spam, keyboard gibberish, and prompt copying while listing all target words', () => {
    const targets = ['dash', 'shatter', 'stumble', 'glare'];
    const scenario = 'A sudden windstorm blows your kite loose at the park! Write 1 exciting sentence.';

    const emptyEval = evaluateWritingSubmission('', targets, scenario);
    expect(emptyEval.checks.find((c) => c.id === 'target-word')?.label).toContain('glare');

    const repeatSpam = evaluateWritingSubmission('The the the the dash the.', targets, scenario);
    expect(repeatSpam.canUnlockChest).toBe(false);
    expect(repeatSpam.allPassed).toBe(false);

    const gibberish = evaluateWritingSubmission('Asdfghjkl qwertyuiop dash zxcvbnm 12345 aa.', targets, scenario);
    expect(gibberish.canUnlockChest).toBe(false);

    const promptCopy = evaluateWritingSubmission('A sudden windstorm blows your kite dash.', targets, scenario);
    expect(promptCopy.canUnlockChest).toBe(false);

    const realSentence = evaluateWritingSubmission(
      'When the gust blew hard, I dashed across the grassy park to grab my kite!',
      targets,
      scenario,
    );
    expect(realSentence.allPassed).toBe(true);
    expect(realSentence.canUnlockChest).toBe(true);
  });

  it('imports plain comma-separated school word lists with auto-definitions and rejects 1-letter duplicates', () => {
    const plainRes = parseCustomWordList('Week 12 Vocab', 'cautious, shimmer, boulder, fragile, rescue');
    expect(plainRes.ok).toBe(true);
    if (plainRes.ok) {
      expect(plainRes.record.words).toHaveLength(5);
      expect(plainRes.autoFilledCount).toBe(5);
      expect(plainRes.record.words.find((w) => w.word === 'boulder')?.definition).toContain('rock');
    }

    const junkRes = parseCustomWordList('Bad List', 'a, a, a, b, c');
    expect(junkRes.ok).toBe(false);
  });
});

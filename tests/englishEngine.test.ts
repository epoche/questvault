import { describe, expect, it } from 'vitest';
import { parseCustomWordList } from '../src/subjects/english/customParser';
import { buildEnglishRun } from '../src/subjects/english/runEngine';
import { BUILTIN_WORD_SETS } from '../src/subjects/english/wordSets';

describe('Custom Word Set Parser Seam', () => {
  it('parses messy weekly school vocab lists with numbers, colons, dashes, tabs, and optional examples', () => {
    const raw = `
      1. reluctant - not wanting to do something
      2) observe: to watch very carefully | Scientists observe whales in winter.
      • peculiar\tstrange or unusual
      well-known — famous or widely recognized
    `;

    const result = parseCustomWordList('Week 12 School Words', raw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.wordSet.title).toBe('Week 12 School Words');
    expect(result.wordSet.words).toHaveLength(4);
    expect(result.wordSet.words[0]).toMatchObject({
      word: 'reluctant',
      definition: 'not wanting to do something',
    });
    expect(result.record.words[1].example).toBe('Scientists observe whales in winter.');
    expect(result.wordSet.words[1].contextSentence).toBe('Scientists ___ whales in winter.');
    expect(result.wordSet.words[2].word).toBe('peculiar');
    expect(result.wordSet.words[3].word).toBe('well-known');
  });

  it('requires at least 3 valid word-definition lines so multiple-choice questions work', () => {
    const tooShort = parseCustomWordList('Tiny List', 'brave - showing courage\njust a broken line');
    expect(tooShort.ok).toBe(false);
  });
});

describe('English Run Engine Seam', () => {
  it('builds a complete 3-stage Run from every built-in Grade 4 Word Set', () => {
    expect(BUILTIN_WORD_SETS.length).toBeGreaterThanOrEqual(6);

    for (const set of BUILTIN_WORD_SETS) {
      const run = buildEnglishRun(set, () => 0.42);
      expect(run.sprintQuestions.length).toBe(set.words.length);
      expect(run.upgradeQuestions.length).toBeGreaterThanOrEqual(3);
      expect(run.forgePrompt.targetWords.length).toBeGreaterThanOrEqual(3);

      for (const q of run.sprintQuestions) {
        expect(q.choices).toHaveLength(4);
        expect(q.choices).toContain(q.correctWord);
        expect(new Set(q.choices).size).toBe(4);
      }

      for (const u of run.upgradeQuestions) {
        expect(u.choices).toHaveLength(3);
        expect(u.choices).toContain(u.correctWord);
      }
    }
  });

  it('builds a full playable 3-stage Run from a parent-imported Custom Word Set', () => {
    const parsed = parseCustomWordList(
      'Ms. Lee Week 8',
      `
      fragile - easily broken or damaged
      sturdy - strong and solidly built
      glimpse - a quick, brief look at something
      vanish - to disappear suddenly
      `,
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const run = buildEnglishRun(parsed.wordSet, () => 0.3);
    expect(run.sprintQuestions).toHaveLength(4);
    expect(run.upgradeQuestions.length).toBeGreaterThanOrEqual(3);
    expect(run.forgePrompt.targetWords).toContain('fragile');
  });
});

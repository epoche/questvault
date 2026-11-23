import { describe, expect, it } from 'vitest';
import { evaluateWritingSubmission } from '../src/subjects/english/writingChecks';

describe('English Writer Forge Writing Checks Seam', () => {
  it('passes all four checks for a complete descriptive Grade 4 sentence', () => {
    const result = evaluateWritingSubmission(
      'My sister was reluctant to jump into the freezing pool.',
      ['reluctant', 'enormous'],
    );

    expect(result.allPassed).toBe(true);
    expect(result.passedCount).toBe(4);
    expect(result.totalCount).toBe(4);
    expect(result.matchedWords).toEqual(['reluctant']);
  });

  it('matches natural English inflections of Target Words (past tense, -ing, -ly)', () => {
    const observed = evaluateWritingSubmission(
      'We quietly observed a tiny owl resting on the oak branch!',
      ['observe'],
    );
    expect(observed.matchedWords).toEqual(['observe']);
    expect(observed.allPassed).toBe(true);

    const eagerly = evaluateWritingSubmission(
      'The puppy eagerly chased the bright yellow ball across the grass.',
      ['eager'],
    );
    expect(eagerly.matchedWords).toEqual(['eager']);
    expect(eagerly.allPassed).toBe(true);

    const persuaded = evaluateWritingSubmission(
      'Maya persuaded her dad to let her adopt a rescue bunny.',
      ['persuade'],
    );
    expect(persuaded.matchedWords).toEqual(['persuade']);
    expect(persuaded.allPassed).toBe(true);
  });

  it('catches missing capital letter, missing ending punctuation, and short sentences with helpful tips', () => {
    const result = evaluateWritingSubmission('it was enormous', ['enormous']);

    expect(result.allPassed).toBe(false);
    expect(result.checks.find((c) => c.id === 'target-word')?.passed).toBe(true);
    expect(result.checks.find((c) => c.id === 'capitalization')?.passed).toBe(false);
    expect(result.checks.find((c) => c.id === 'punctuation')?.passed).toBe(false);
    expect(result.checks.find((c) => c.id === 'detail')?.passed).toBe(false);
  });

  it('does not falsely match a Target Word hidden inside an unrelated word', () => {
    const result = evaluateWritingSubmission(
      'The cat sat quietly near the bright window today.',
      ['at'],
    );
    expect(result.matchedWords).toEqual([]);
    expect(result.checks.find((c) => c.id === 'target-word')?.passed).toBe(false);
    expect(result.canUnlockChest).toBe(false);
  });

  it('matches base/present and irregular forms when Target Word is past-tense or gerund', () => {
    expect(
      evaluateWritingSubmission('She tends to mutter softly before math tests.', ['muttered'])
        .allPassed,
    ).toBe(true);
    expect(
      evaluateWritingSubmission('The polished trophy began to gleam under the stage lights!', [
        'gleaming',
      ]).allPassed,
    ).toBe(true);
    expect(
      evaluateWritingSubmission('We rebuilt our tall Lego castle after the puppy bumped it.', [
        'rebuild',
      ]).allPassed,
    ).toBe(true);
  });
});

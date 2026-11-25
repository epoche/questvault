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

  it('blocks cheesing via Quick-Start starter chip + target word + period (including long starters)', () => {
    const starters = [
      'When the wind blew my kite away, I had to ',
      'In my story, the hero ',
    ];

    // Exact user-reported cheese: starter + target word + "."
    const cheese1 = evaluateWritingSubmission(
      'In my story, the hero brave.',
      ['brave', 'dash'],
      undefined,
      starters,
    );
    expect(cheese1.usedStarter).toBe(true);
    expect(cheese1.ownWordCount).toBe(0);
    expect(cheese1.allPassed).toBe(false);
    expect(cheese1.canUnlockChest).toBe(false);

    // Long 10-word starter + target word + "." (previously passed >=6 words!)
    const cheese2 = evaluateWritingSubmission(
      'When the wind blew my kite away, I had to dash.',
      ['dash', 'sprint'],
      undefined,
      starters,
    );
    expect(cheese2.usedStarter).toBe(true);
    expect(cheese2.ownWordCount).toBe(0);
    expect(cheese2.allPassed).toBe(false);
    expect(cheese2.canUnlockChest).toBe(false);

    // Starter + target word + only 2 filler words (< 4 own words)
    const cheese3 = evaluateWritingSubmission(
      'In my story, the hero is brave today.',
      ['brave'],
      undefined,
      starters,
    );
    expect(cheese3.ownWordCount).toBeLessThan(4);
    expect(cheese3.canUnlockChest).toBe(false);

    // Stacking 2 starter chips + target word
    const stacked = evaluateWritingSubmission(
      'In my story, the hero When the wind blew my kite away, I had to dash.',
      ['dash'],
      undefined,
      starters,
    );
    expect(stacked.canUnlockChest).toBe(false);
  });

  it('blocks verbless fragments, target-word lists, and the old 3-of-4 partial chest loophole', () => {
    // Old 3/4 loophole: capital + target word + period ONLY
    const oneWord = evaluateWritingSubmission('Brave.', ['brave']);
    expect(oneWord.passedCount).toBe(3);
    expect(oneWord.canUnlockChest).toBe(false);

    // Verbless phrase (even with 6+ words and "to the" preposition)
    const verbless = evaluateWritingSubmission(
      'My little sister very brave to the sunny park.',
      ['brave'],
    );
    expect(verbless.allPassed).toBe(false);
    expect(verbless.canUnlockChest).toBe(false);

    // Starter without main verb + verbless continuation
    const starterVerbless = evaluateWritingSubmission(
      'In my story, the hero very brave across the dark forest.',
      ['brave'],
      undefined,
      ['In my story, the hero '],
    );
    expect(starterVerbless.allPassed).toBe(false);
    expect(starterVerbless.canUnlockChest).toBe(false);

    // Target-word-only list
    const listOnly = evaluateWritingSubmission(
      'Dash sprint leap bolt rush zoom.',
      ['dash', 'sprint', 'leap', 'bolt', 'rush', 'zoom'],
    );
    expect(listOnly.ownWordCount).toBe(0);
    expect(listOnly.canUnlockChest).toBe(false);
  });

  it('accepts genuine Grade 4 sentences using a starter + 4+ own words + verb, and handles iPadOS curly apostrophes', () => {
    const genuineWithStarter = evaluateWritingSubmission(
      'In my story, the hero showed brave teamwork to rescue the lost puppy!',
      ['brave', 'dash'],
      undefined,
      ['In my story, the hero '],
    );
    expect(genuineWithStarter.usedStarter).toBe(true);
    expect(genuineWithStarter.ownWordCount).toBeGreaterThanOrEqual(4);
    expect(genuineWithStarter.allPassed).toBe(true);
    expect(genuineWithStarter.canUnlockChest).toBe(true);

    // iPadOS Smart Punctuation produces U+2019 curly apostrophe in contractions
    const curlyApostrophe = evaluateWritingSubmission(
      'I’m eager to bake chocolate cupcakes with my sister today!',
      ['eager'],
    );
    expect(curlyApostrophe.allPassed).toBe(true);
    expect(curlyApostrophe.canUnlockChest).toBe(true);
  });

  it('verifies all 80 English word sets (240 starters + 119 built-in verbs) have zero starter collisions, zero 1-word-edit cheese, and zero verb false negatives', async () => {
    const { BUILTIN_WORD_SETS } = await import('../src/subjects/english/wordSets');

    // 1. Hand-typed natural sentences starting with "Yesterday, I" / "At school," / "One day," must pass when no starterChips match
    expect(
      evaluateWritingSubmission('Yesterday, I saw an enormous whale.', ['enormous']).allPassed,
    ).toBe(true);
    expect(
      evaluateWritingSubmission('One day, my dog felt brave.', ['brave']).allPassed,
    ).toBe(true);

    // 2. "At school today, I felt " and "Nobody expected it—it happened " must NEVER self-collide or false-repeat
    expect(
      evaluateWritingSubmission(
        'At school today, I felt eager when our teacher shared shiny stickers!',
        ['eager'],
        undefined,
        ['At school today, I felt '],
      ).allPassed,
    ).toBe(true);
    expect(
      evaluateWritingSubmission(
        'Nobody expected it—it happened out of the blue during our science parade!',
        ['out of the blue'],
        undefined,
        ['Nobody expected it—it happened '],
      ).allPassed,
    ).toBe(true);

    // 3. Possessive nouns ("Earth's") and non-verb "-ing" nouns ("morning") must NOT fool verb check
    expect(
      evaluateWritingSubmission(
        'Without Earth’s invisible pull of gravity every morning.',
        ['gravity'],
        undefined,
        ['Without Earth’s invisible pull of '],
      ).canUnlockChest,
    ).toBe(false);

    // 4. Exhaustive check across ALL 80 built-in English sets
    for (const set of BUILTIN_WORD_SETS) {
      const targetWords = set.words.map((w) => w.word);
      const sampleTarget = targetWords[0];
      const starters = set.starterChips ?? [];

      for (const chip of starters) {
        // Starter + target + "." MUST fail
        const cheese = evaluateWritingSubmission(
          `${chip}${sampleTarget}.`,
          targetWords,
          set.forgeScenario,
          starters,
        );
        expect(cheese.canUnlockChest, `Cheese passed for ${set.id}: ${chip}`).toBe(false);

        // 1-word deleted from end of starter (for >=4 token starters) + target + "." MUST fail
        const words = chip.trim().split(/\s+/);
        if (words.length >= 4) {
          const edited = `${words.slice(0, -1).join(' ')} ${sampleTarget}.`;
          const editedRes = evaluateWritingSubmission(
            edited,
            targetWords,
            set.forgeScenario,
            starters,
          );
          expect(editedRes.canUnlockChest, `1-word-edit bypass in ${set.id}: ${edited}`).toBe(false);
        }

        // Starter + genuine 6-word continuation with verb MUST pass
        const genuine = evaluateWritingSubmission(
          `${chip}two clever kittens happily saw ${sampleTarget} near the sunny cabin!`,
          targetWords,
          set.forgeScenario,
          starters,
        );
        expect(genuine.canUnlockChest, `Genuine failed for ${set.id} starter "${chip}": ${genuine.encouragement}`).toBe(true);
      }

      // Every built-in verb must be recognized in a simple present-tense sentence without extra verbs
      for (const entry of set.words) {
        if (entry.partOfSpeech !== 'verb') continue;
        const sent = `Clever students always ${entry.word} near the bright library.`;
        const res = evaluateWritingSubmission(sent, [entry.word]);
        expect(res.canUnlockChest, `Verb false negative for "${entry.word}": ${res.encouragement}`).toBe(true);
      }
    }
  });
});



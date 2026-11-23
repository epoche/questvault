export interface WritingCheckItem {
  id: 'target-word' | 'capitalization' | 'punctuation' | 'detail';
  label: string;
  passed: boolean;
  hint: string;
}

export interface WritingEvaluation {
  checks: WritingCheckItem[];
  matchedWords: string[];
  passedCount: number;
  totalCount: number;
  allPassed: boolean;
  canUnlockChest: boolean;
  wordCount: number;
  encouragement: string;
}

export interface WritingEvaluator {
  evaluate(sentence: string, targetWords: string[], promptScenario?: string): WritingEvaluation;
}

const MIN_WORD_COUNT = 6;
const MIN_UNIQUE_WORDS = 5;

const IRREGULAR_FAMILIES: string[][] = [
  ['rebuild', 'rebuilds', 'rebuilt', 'rebuilding'],
  ['build', 'builds', 'built', 'building'],
];

function addSuffixesForStem(stem: string, forms: Set<string>): void {
  if (stem.length < 2) return;
  forms.add(stem);
  forms.add(`${stem}s`);
  forms.add(`${stem}es`);
  forms.add(`${stem}ed`);
  forms.add(`${stem}d`);
  forms.add(`${stem}ing`);
  forms.add(`${stem}ly`);
  forms.add(`${stem}er`);
  forms.add(`${stem}est`);
  forms.add(`${stem}ness`);

  if (stem.endsWith('e') && stem.length > 2) {
    const noE = stem.slice(0, -1);
    forms.add(`${noE}ing`);
    forms.add(`${noE}ed`);
    forms.add(`${noE}er`);
    forms.add(`${noE}est`);
    forms.add(`${noE}ly`);
  }

  if (stem.endsWith('y') && stem.length > 2) {
    const noY = stem.slice(0, -1);
    forms.add(`${noY}ies`);
    forms.add(`${noY}ied`);
    forms.add(`${noY}ier`);
    forms.add(`${noY}iest`);
    forms.add(`${noY}ily`);
  }
}

function buildInflectionForms(rawWord: string): string[] {
  const base = rawWord.trim().toLowerCase();
  if (!base) return [];

  const forms = new Set<string>();
  addSuffixesForStem(base, forms);

  if (base.endsWith('ed') && base.length > 4) {
    addSuffixesForStem(base.slice(0, -2), forms);
    addSuffixesForStem(base.slice(0, -1), forms);
  }
  if (base.endsWith('ing') && base.length > 5) {
    const stem = base.slice(0, -3);
    addSuffixesForStem(stem, forms);
    addSuffixesForStem(`${stem}e`, forms);
  }

  for (const family of IRREGULAR_FAMILIES) {
    if (family.includes(base)) {
      for (const variant of family) forms.add(variant);
    }
  }

  return Array.from(forms);
}

function tokenizeWords(sentence: string): string[] {
  const matches = sentence.toLowerCase().match(/[a-z]+(?:[-'][a-z]+)*/g);
  return matches ?? [];
}

function looksLikeKeyboardMash(token: string): boolean {
  // Reject repeated single letters (aaaa), keyboard rows (qwerty / asdf / zxcv), or 5+ consonants in a row
  if (/(.)\1{3,}/.test(token)) return true;
  if (/qwerty|asdf|zxcv|hjkl|uiop/.test(token)) return true;
  if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(token)) return true;
  // Reject 5+ letter words with zero vowels (including y)
  if (token.length >= 5 && !/[aeiouy]/.test(token)) return true;
  return false;
}

function hasAdjacentDuplicateWord(tokens: string[]): boolean {
  for (let i = 1; i < tokens.length; i += 1) {
    if (tokens[i] === tokens[i - 1]) return true;
  }
  return false;
}

function looksLikePromptCopy(tokens: string[], promptScenario?: string): boolean {
  if (!promptScenario) return false;
  const promptSet = new Set(tokenizeWords(promptScenario));
  const originalWords = tokens.filter((t) => !promptSet.has(t));
  // Require at least 3 words that were not simply copied verbatim from the prompt text
  return tokens.length >= MIN_WORD_COUNT && originalWords.length < 3;
}

function matchesTargetWord(tokens: string[], targetWord: string): boolean {
  const normalizedTarget = targetWord.trim().toLowerCase();
  if (!normalizedTarget) return false;

  if (normalizedTarget.includes(' ')) {
    const joined = tokens.join(' ');
    return joined.includes(normalizedTarget);
  }

  const forms = new Set(buildInflectionForms(normalizedTarget));
  return tokens.some((token) => forms.has(token));
}

export function evaluateWritingSubmission(
  sentence: string,
  targetWords: string[],
  promptScenario?: string,
): WritingEvaluation {
  const trimmed = sentence.trim();
  const tokens = tokenizeWords(trimmed);
  const validTokens = tokens.filter((t) => !looksLikeKeyboardMash(t));
  const wordCount = validTokens.length;
  const uniqueWordCount = new Set(validTokens).size;
  const hasGibberish = tokens.some(looksLikeKeyboardMash);
  const hasAdjRepeat = hasAdjacentDuplicateWord(tokens);
  const copiedPrompt = looksLikePromptCopy(validTokens, promptScenario);

  const matchedWords = targetWords.filter((w) => matchesTargetWord(validTokens, w));
  const usedTargetWord = matchedWords.length > 0;

  const startsWithCapital = /^["'“‘(]*[A-Z]/.test(trimmed);
  const endsWithPunctuation = /[.!?]["'”’)]*$/.test(trimmed);
  const hasEnoughDetail =
    wordCount >= MIN_WORD_COUNT &&
    uniqueWordCount >= MIN_UNIQUE_WORDS &&
    !hasGibberish &&
    !hasAdjRepeat &&
    !copiedPrompt;

  let detailLabel = `${wordCount}/${MIN_WORD_COUNT}+ words`;
  let detailHint = 'Add one more detail about who, where, or why!';
  if (hasGibberish) {
    detailLabel = 'Use real words (no keyboard mash!)';
    detailHint = 'Replace random letter strings with real English words.';
  } else if (hasAdjRepeat || (wordCount >= MIN_WORD_COUNT && uniqueWordCount < MIN_UNIQUE_WORDS)) {
    detailLabel = 'Use different words (no repeats!)';
    detailHint = 'Avoid repeating the same word to fill space.';
  } else if (copiedPrompt) {
    detailLabel = 'Write your own idea (not prompt!)';
    detailHint = 'Use your own words instead of copying the prompt.';
  }

  const checks: WritingCheckItem[] = [
    {
      id: 'target-word',
      label:
        matchedWords.length > 0
          ? `Used: ${matchedWords.join(', ')}`
          : `Use 1 word (${targetWords.join(', ')})`,
      passed: usedTargetWord,
      hint: `Weave "${targetWords[0] ?? 'a target word'}" into your sentence.`,
    },
    {
      id: 'capitalization',
      label: 'Starts with capital letter',
      passed: startsWithCapital,
      hint: 'Make the first letter uppercase.',
    },
    {
      id: 'punctuation',
      label: 'Ends with .  !  or ?',
      passed: endsWithPunctuation,
      hint: 'Add .  !  or ? at the end.',
    },
    {
      id: 'detail',
      label: detailLabel,
      passed: hasEnoughDetail,
      hint: detailHint,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const allPassed = passedCount === checks.length;
  // Require both target-word AND non-cheesed detail check (or 3+ checks when not gibberish/spam)
  const canUnlockChest =
    usedTargetWord && !hasGibberish && !hasAdjRepeat && !copiedPrompt && passedCount >= 3;

  let encouragement = 'Awesome Grade 4 sentence! Your Token Chest is ready!';
  if (!allPassed) {
    if (hasGibberish || hasAdjRepeat || copiedPrompt) {
      encouragement = detailHint;
    } else if (!usedTargetWord && passedCount >= 2) {
      encouragement = 'Nice writing! Add one Target Word from the pills above to unlock your chest.';
    } else if (canUnlockChest) {
      encouragement = 'Almost there — one quick tweak unlocks the full 25-Token Chest!';
    } else if (passedCount >= 1) {
      encouragement = 'Great start! Check off the remaining bubbles to unlock your chest.';
    } else {
      encouragement = 'Pick one Target Word above and build a vivid sentence around it.';
    }
  }

  return {
    checks,
    matchedWords,
    passedCount,
    totalCount: checks.length,
    allPassed,
    canUnlockChest,
    wordCount,
    encouragement,
  };
}

export const deterministicWritingEvaluator: WritingEvaluator = {
  evaluate: evaluateWritingSubmission,
};

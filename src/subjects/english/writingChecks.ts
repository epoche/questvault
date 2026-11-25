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
  ownWordCount: number;
  usedStarter: boolean;
  encouragement: string;
}

export interface WritingEvaluator {
  evaluate(
    sentence: string,
    targetWords: string[],
    promptScenario?: string,
    starterChips?: string[],
  ): WritingEvaluation;
}

const MIN_WORD_COUNT = 6;
const MIN_UNIQUE_WORDS = 5;
const MIN_OWN_WORDS_WITH_STARTER = 4;
const MIN_OWN_WORDS_NO_STARTER = 4;

const IRREGULAR_FAMILIES: string[][] = [
  ['rebuild', 'rebuilds', 'rebuilt', 'rebuilding'],
  ['build', 'builds', 'built', 'building'],
];

/**
 * Irregular verbs, auxiliaries, modals, and short verb forms (<= 4 chars where
 * suffix rules alone would miss them, e.g. "used", "lay", "roam", "cost").
 */
const IRREGULAR_AND_CORE_VERBS: readonly string[] = [
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'done',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'go', 'goes', 'went', 'gone', 'come', 'comes', 'came',
  'see', 'sees', 'saw', 'seen', 'make', 'makes', 'made',
  'take', 'takes', 'took', 'taken', 'give', 'gives', 'gave', 'given',
  'get', 'gets', 'got', 'gotten', 'say', 'says', 'said',
  'tell', 'tells', 'told', 'speak', 'speaks', 'spoke', 'spoken',
  'think', 'thinks', 'thought', 'know', 'knows', 'knew', 'known',
  'feel', 'feels', 'felt', 'become', 'becomes', 'became',
  'find', 'finds', 'found', 'keep', 'keeps', 'kept', 'leave', 'leaves', 'left',
  'bring', 'brings', 'brought', 'buy', 'buys', 'bought', 'catch', 'catches', 'caught',
  'teach', 'teaches', 'taught', 'fight', 'fights', 'fought', 'hear', 'hears', 'heard',
  'hold', 'holds', 'held', 'lose', 'loses', 'lost', 'meet', 'meets', 'met',
  'pay', 'pays', 'paid', 'put', 'puts', 'read', 'reads', 'misread', 'misreads',
  'write', 'writes', 'wrote', 'written', 'run', 'runs', 'ran',
  'swim', 'swims', 'swam', 'swum', 'fly', 'flies', 'flew', 'flown',
  'ride', 'rides', 'rode', 'ridden', 'drive', 'drives', 'drove', 'driven',
  'eat', 'eats', 'ate', 'eaten', 'drink', 'drinks', 'drank', 'drunk',
  'sleep', 'sleeps', 'slept', 'sit', 'sits', 'sat', 'stand', 'stands', 'stood',
  'fall', 'falls', 'fell', 'fallen', 'grow', 'grows', 'grew', 'grown',
  'draw', 'draws', 'drew', 'drawn', 'break', 'breaks', 'broke', 'broken',
  'choose', 'chooses', 'chose', 'chosen', 'begin', 'begins', 'began', 'begun',
  'win', 'wins', 'won', 'wear', 'wears', 'wore', 'worn', 'throw', 'throws', 'thrown', 'threw',
  'send', 'sends', 'sent', 'spend', 'spends', 'spent', 'sing', 'sings', 'sang', 'sung',
  'show', 'shows', 'shown', 'shine', 'shines', 'shone', 'blow', 'blows', 'blew', 'blown',
  'build', 'builds', 'built', 'rebuild', 'rebuilds', 'rebuilt',
  'let', 'lets', 'hide', 'hides', 'hid', 'hidden', 'hurt', 'hurts', 'hit', 'hits',
  'cut', 'cuts', 'shut', 'shuts', 'cost', 'costs', 'set', 'sets', 'quit', 'quits',
  'feed', 'feeds', 'fed', 'lead', 'leads', 'led', 'shake', 'shakes', 'shook', 'shaken',
  'wake', 'wakes', 'woke', 'woken', 'bite', 'bites', 'bit', 'bitten',
  'freeze', 'freezes', 'froze', 'frozen', 'steal', 'steals', 'stole', 'stolen',
  'swing', 'swings', 'swung', 'hang', 'hangs', 'hung', 'dig', 'digs', 'dug',
  'stick', 'sticks', 'stuck', 'ring', 'rings', 'rang', 'rung', 'sink', 'sinks', 'sank', 'sunk',
  'tear', 'tears', 'tore', 'torn', 'slide', 'slides', 'slid', 'lend', 'lends', 'lent',
  'forget', 'forgets', 'forgot', 'forgotten', 'forgive', 'forgives', 'forgave', 'forgiven',
  'understand', 'understands', 'understood', 'spin', 'spins', 'spun', 'bend', 'bends', 'bent',
  'lay', 'lays', 'laid', 'lie', 'lies', 'burn', 'burns', 'burnt', 'leap', 'leaps', 'leapt',
  'use', 'uses', 'used', 'cry', 'cries', 'cried', 'try', 'tries', 'tried',
  'die', 'dies', 'died', 'tie', 'ties', 'tied', 'fry', 'fries', 'fried', 'dry', 'dries', 'dried',
  'carry', 'carries', 'carried', 'study', 'studies', 'studied', 'tidy', 'tidies', 'tidied',
  'verify', 'verifies', 'verified', 'classify', 'classifies', 'classified',
  'justify', 'justifies', 'justified', 'reply', 'replies', 'replied',
];

/**
 * Regular Grade 1–5 verbs + EVERY verb stem across all 80 built-in English QuestVault sets
 * and verb idioms. Expanded at module load with base, -s/-es, -ed/-d, and -ing forms.
 */
const REGULAR_VERB_STEMS: readonly string[] = [
  // Everyday Grade 1–5 actions
  'accept', 'add', 'agree', 'allow', 'answer', 'appear', 'arrive', 'ask', 'avoid',
  'bake', 'bark', 'believe', 'belong', 'bloom', 'borrow', 'call', 'cause', 'change',
  'chase', 'check', 'chirp', 'clean', 'climb', 'close', 'collect', 'cook', 'count',
  'crawl', 'create', 'cross', 'dance', 'decide', 'decorate', 'describe', 'dive',
  'drop', 'earn', 'enjoy', 'enter', 'escape', 'expect', 'explain', 'finish', 'fix',
  'float', 'fold', 'follow', 'giggle', 'glow', 'grab', 'greet', 'guard', 'guess',
  'happen', 'help', 'hope', 'hug', 'imagine', 'improve', 'invent', 'invite', 'join',
  'jump', 'kick', 'knock', 'laugh', 'learn', 'lift', 'like', 'live', 'look', 'love',
  'matter', 'measure', 'melt', 'miss', 'mix', 'move', 'need', 'notice', 'offer',
  'open', 'pack', 'paint', 'pass', 'pet', 'pick', 'plan', 'plant', 'play', 'pour',
  'practice', 'prefer', 'pretend', 'prevent', 'promise', 'pull', 'push', 'rain',
  'reach', 'realize', 'recognize', 'refuse', 'remember', 'repair', 'return', 'roam',
  'roar', 'roll', 'save', 'scream', 'search', 'seem', 'shimmer', 'shout', 'sigh',
  'slip', 'smell', 'smile', 'solve', 'sound', 'sparkle', 'spill', 'splash', 'squeeze',
  'stare', 'start', 'stay', 'stir', 'stop', 'stretch', 'succeed', 'survive', 'talk',
  'taste', 'tend', 'thank', 'touch', 'travel', 'trip', 'turn', 'visit', 'wait',
  'walk', 'want', 'warn', 'wash', 'watch', 'wave', 'weather', 'wish', 'wonder',
  'work', 'wrap', 'yell',
  // All 119 built-in English word-set verbs (base stems)
  'acknowledge', 'analyze', 'anticipate', 'apologize', 'applaud', 'arrange', 'attract',
  'bounce', 'celebrate', 'chatter', 'cheer', 'clamber', 'collaborate', 'comfort',
  'compare', 'conclude', 'construct', 'contradict', 'convince', 'cooperate', 'dart',
  'dash', 'defend', 'deliver', 'demonstrate', 'dictate', 'disagree', 'disappear',
  'discover', 'dissolve', 'distinguish', 'distract', 'dodge', 'elaborate', 'emphasize',
  'encourage', 'evaluate', 'exclaim', 'explore', 'flicker', 'gallop', 'gasp', 'gather',
  'glare', 'glide', 'gleam', 'hesitate', 'huddle', 'illustrate', 'include', 'innovate',
  'inscribe', 'inspect', 'instruct', 'interpret', 'interrupt', 'investigate', 'knead',
  'march', 'misplace', 'murmur', 'mutter', 'navigate', 'nudge', 'observe', 'obstruct',
  'overflow', 'overlook', 'peek', 'persevere', 'persuade', 'plunge', 'pounce', 'predict',
  'preheat', 'prepare', 'preview', 'propose', 'protect', 'quote', 'recheck', 'recommend',
  'remind', 'replay', 'rescue', 'saunter', 'scatter', 'share', 'shatter', 'shiver',
  'sift', 'simmer', 'snatch', 'soar', 'sprinkle', 'sprint', 'stroll', 'stumble',
  'summarize', 'tangle', 'tinker', 'tiptoe', 'transform', 'transport', 'trudge',
  'tumble', 'twirl', 'unlock', 'unwrap', 'vanish', 'venture', 'wander', 'whisper',
];

function buildCommonVerbsSet(): Set<string> {
  const verbs = new Set<string>(IRREGULAR_AND_CORE_VERBS);
  for (const stem of REGULAR_VERB_STEMS) {
    verbs.add(stem);
    if (/(?:s|sh|ch|x|z|o)$/.test(stem)) {
      verbs.add(`${stem}es`);
    } else if (stem.endsWith('y') && !/[aeiou]y$/.test(stem)) {
      verbs.add(`${stem.slice(0, -1)}ies`);
      verbs.add(`${stem.slice(0, -1)}ied`);
    } else {
      verbs.add(`${stem}s`);
    }
    if (stem.endsWith('e')) {
      verbs.add(`${stem}d`);
      verbs.add(`${stem.slice(0, -1)}ing`);
    } else {
      verbs.add(`${stem}ed`);
      verbs.add(`${stem}ing`);
    }
  }
  return verbs;
}

const COMMON_VERBS = buildCommonVerbsSet();

/**
 * Common non-verb nouns/adjectives ending in -ing or -ed so they never falsely
 * pass the verb-presence check on verbless fragments.
 */
const NON_VERB_ING_ED = new Set<string>([
  'morning', 'evening', 'spring', 'thing', 'nothing', 'something', 'everything', 'anything',
  'ceiling', 'wedding', 'pudding', 'lightning', 'string', 'hundred', 'wicked', 'sacred',
  'crooked', 'ragged', 'jagged', 'rugged', 'speed', 'greed', 'creed', 'steed', 'shred',
]);

/**
 * Pronouns/wh-words where "'s" represents the contraction "is"/"has" rather than
 * a possessive noun like "Earth's" or "Maya's".
 */
const CONTRACTION_S_PREFIX =
  /^(?:he|she|it|that|there|here|what|who|where|when|how|let|everyone|everybody|someone|somebody|nobody)'s$/;

/**
 * Fallback starter patterns used ONLY when caller omits explicit `starterChips`.
 * Deliberately excludes short generic time phrases ("At school,", "One day,", "Yesterday, I")
 * so hand-typed sentences are never falsely penalized.
 */
const FALLBACK_STARTER_PATTERNS: readonly string[] = [
  'Yesterday at school, I ',
  'Today I finally mastered ',
  'When things got tricky, I ',
  'In my story, the hero ',
  'Today I remembered how to ',
  'In my favorite scene, the hero ',
  'Right before sunset, we ',
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
  // Normalize iPadOS Smart Punctuation curly apostrophes & dashes before tokenizing
  const normalized = sentence
    .replace(/[’‘]/g, "'")
    .replace(/[—–]/g, ' ')
    .toLowerCase();
  const matches = normalized.match(/[a-z]+(?:[-'][a-z]+)*/g);
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

function hasAdjacentDuplicateWord(tokens: string[], starterMask?: boolean[]): boolean {
  for (let i = 1; i < tokens.length; i += 1) {
    if (tokens[i] === tokens[i - 1]) {
      // Never penalize intentional repetition inside a built-in starter chip
      // (e.g., "Nobody expected it—it happened ")
      if (starterMask && starterMask[i] && starterMask[i - 1]) continue;
      return true;
    }
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

function markSubsequenceMatches(
  haystack: string[],
  needle: string[],
  mask: boolean[],
): { hits: number; newlyMasked: number } {
  if (needle.length === 0 || needle.length > haystack.length) {
    return { hits: 0, newlyMasked: 0 };
  }
  let hits = 0;
  let newlyMasked = 0;
  for (let i = 0; i <= haystack.length - needle.length; i += 1) {
    let ok = true;
    for (let j = 0; j < needle.length; j += 1) {
      if (haystack[i + j] !== needle[j]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      let freshInSpan = 0;
      for (let j = 0; j < needle.length; j += 1) {
        if (!mask[i + j]) {
          mask[i + j] = true;
          freshInSpan += 1;
        }
      }
      if (freshInSpan > 0) {
        hits += 1;
        newlyMasked += freshInSpan;
      }
    }
  }
  return { hits, newlyMasked };
}

function hasVerbLikeToken(tokens: string[]): boolean {
  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];
    if (COMMON_VERBS.has(t)) return true;
    // English contractions with auxiliary/linking verbs (I'm, they're, didn't, she'll, we've, it's)
    // excluding possessive nouns like "Earth's" or "Maya's"
    if (/(?:n't|'m|'re|'ve|'ll|'d)$/.test(t) || CONTRACTION_S_PREFIX.test(t)) return true;
    // Regular past-tense (-ed) or progressive (-ing) verb forms (len >= 5, excluding common non-verbs)
    if (t.length >= 5 && !NON_VERB_ING_ED.has(t) && (t.endsWith('ed') || t.endsWith('ing'))) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether a starter chip already supplies a finite clause verb after its comma
 * (e.g., "At school today, I felt " -> true; "In my story, the hero " -> false;
 * "When the wind blew my kite away, I " -> false because "blew" is inside the subordinate clause).
 */
function starterSuppliesMainVerb(starterText: string): boolean {
  const afterComma = starterText.includes(',')
    ? starterText.slice(starterText.lastIndexOf(',') + 1)
    : starterText;
  const tailTokens = tokenizeWords(afterComma);
  return hasVerbLikeToken(tailTokens);
}

export function evaluateWritingSubmission(
  sentence: string,
  targetWords: string[],
  promptScenario?: string,
  starterChips?: string[],
): WritingEvaluation {
  const trimmed = sentence.trim();
  const tokens = tokenizeWords(trimmed);
  const validTokens = tokens.filter((t) => !looksLikeKeyboardMash(t));
  const wordCount = validTokens.length;
  const uniqueWordCount = new Set(validTokens).size;
  const hasGibberish = tokens.some(looksLikeKeyboardMash);
  const copiedPrompt = looksLikePromptCopy(validTokens, promptScenario);

  const matchedWords = targetWords.filter((w) => matchesTargetWord(validTokens, w));
  const usedTargetWord = matchedWords.length > 0;

  // Mask out starter chip tokens so quick-start chips NEVER count as the student's own words.
  // Use the active quest's starterChips when supplied; otherwise fall back to default multi-word starters.
  const rawStarterPool =
    starterChips && starterChips.length > 0 ? starterChips : FALLBACK_STARTER_PATTERNS;
  const sortedStarters = Array.from(new Set(rawStarterPool))
    .map((chip) => ({ chip, chipTokens: tokenizeWords(chip) }))
    .filter((item) => item.chipTokens.length >= 2)
    .sort((a, b) => b.chipTokens.length - a.chipTokens.length);

  const starterMask = new Array<boolean>(validTokens.length).fill(false);
  const exactMatchedIdx = new Set<number>();
  let matchedStarterCount = 0;
  let starterHasMainVerb = false;

  // Pass 1: Match all exact starters first (longest to shortest) so a longer starter's
  // fuzzy slice can never cannibalize a shorter starter that matches verbatim.
  for (let idx = 0; idx < sortedStarters.length; idx += 1) {
    const { chip, chipTokens } = sortedStarters[idx];
    const exact = markSubsequenceMatches(validTokens, chipTokens, starterMask);
    if (exact.hits > 0 && exact.newlyMasked >= Math.min(2, chipTokens.length)) {
      exactMatchedIdx.add(idx);
      matchedStarterCount += exact.hits;
      if (starterSuppliesMainVerb(chip)) {
        starterHasMainVerb = true;
      }
    }
  }

  // Pass 2: Anti-1-word-edit guard for unmatched starters with >= 4 tokens.
  // Detect 3-token contiguous overlaps on a candidate mask and only commit when >= 60%
  // of the starter's tokens match, preventing incidental 3-word phrases from false-triggering.
  for (let idx = 0; idx < sortedStarters.length; idx += 1) {
    if (exactMatchedIdx.has(idx)) continue;
    const { chip, chipTokens } = sortedStarters[idx];
    if (chipTokens.length < 4) continue;

    const candidateMask = starterMask.slice();
    let fuzzyNewlyMasked = 0;
    const winLen = 3;
    for (let start = 0; start <= chipTokens.length - winLen; start += 1) {
      const slice = chipTokens.slice(start, start + winLen);
      const sub = markSubsequenceMatches(validTokens, slice, candidateMask);
      fuzzyNewlyMasked += sub.newlyMasked;
    }
    const minFuzzyTokens = Math.max(3, Math.ceil(chipTokens.length * 0.6));
    if (fuzzyNewlyMasked >= minFuzzyTokens) {
      for (let k = 0; k < starterMask.length; k += 1) {
        starterMask[k] = candidateMask[k];
      }
      matchedStarterCount += 1;
      if (starterSuppliesMainVerb(chip)) {
        starterHasMainVerb = true;
      }
    }
  }

  const usedStarter = matchedStarterCount > 0;
  const stackedStarters = matchedStarterCount >= 2;
  const hasAdjRepeat = hasAdjacentDuplicateWord(validTokens, starterMask);

  // Mask out target word tokens so pasting only target words doesn't satisfy originality
  const targetMask = new Array<boolean>(validTokens.length).fill(false);
  for (const tw of matchedWords) {
    const norm = tw.trim().toLowerCase();
    if (norm.includes(' ')) {
      markSubsequenceMatches(validTokens, tokenizeWords(norm), targetMask);
    } else {
      const forms = new Set(buildInflectionForms(norm));
      for (let i = 0; i < validTokens.length; i += 1) {
        if (forms.has(validTokens[i])) targetMask[i] = true;
      }
    }
  }

  const ownTokens = validTokens.filter((_, i) => !starterMask[i] && !targetMask[i]);
  const nonStarterTokens = validTokens.filter((_, i) => !starterMask[i]);
  const ownWordCount = new Set(ownTokens).size;
  const minOwnRequired = usedStarter ? MIN_OWN_WORDS_WITH_STARTER : MIN_OWN_WORDS_NO_STARTER;
  const enoughOwnWords = ownWordCount >= minOwnRequired;

  // Require a complete sentence with a verb:
  // - If no starter used: any verb-like token in the sentence counts.
  // - If starter used without a main-clause verb (e.g. "In my story, the hero "): require a verb in the student's continuation!
  const hasClauseVerb =
    usedStarter && !starterHasMainVerb
      ? hasVerbLikeToken(nonStarterTokens)
      : hasVerbLikeToken(validTokens);

  const startsWithCapital = /^["'“‘(]*[A-Z]/.test(trimmed);
  const endsWithPunctuation = /[.!?]["'”’)]*$/.test(trimmed);
  const hasEnoughDetail =
    wordCount >= MIN_WORD_COUNT &&
    uniqueWordCount >= MIN_UNIQUE_WORDS &&
    enoughOwnWords &&
    hasClauseVerb &&
    !stackedStarters &&
    !hasGibberish &&
    !hasAdjRepeat &&
    !copiedPrompt;

  let detailLabel = usedStarter
    ? `${ownWordCount}/${MIN_OWN_WORDS_WITH_STARTER}+ own words`
    : `${wordCount}/${MIN_WORD_COUNT}+ words`;
  let detailHint = usedStarter
    ? 'Finish the sentence with at least 4 of your own words (not just the starter + target word)!'
    : 'Add one more detail about who, where, or why!';

  if (hasGibberish) {
    detailLabel = 'Use real words (no keyboard mash!)';
    detailHint = 'Replace random letter strings with real English words.';
  } else if (stackedStarters) {
    detailLabel = 'Use only 1 quick start';
    detailHint = 'Pick just 1 starter, then finish the idea in your own words!';
  } else if (hasAdjRepeat || (wordCount >= MIN_WORD_COUNT && uniqueWordCount < MIN_UNIQUE_WORDS)) {
    detailLabel = 'Use different words (no repeats!)';
    detailHint = 'Avoid repeating the same word to fill space.';
  } else if (copiedPrompt) {
    detailLabel = 'Write your own idea (not prompt!)';
    detailHint = 'Use your own words instead of copying the prompt.';
  } else if (usedStarter && !enoughOwnWords) {
    detailLabel = `Add ${MIN_OWN_WORDS_WITH_STARTER - ownWordCount} more of your own words (${ownWordCount}/${MIN_OWN_WORDS_WITH_STARTER})`;
    detailHint = 'Starters are just a boost — write at least 4 of your own words to complete the thought!';
  } else if (!enoughOwnWords && wordCount >= MIN_WORD_COUNT) {
    detailLabel = 'Add your own words around the target word';
    detailHint = 'Write a full story sentence instead of listing target words.';
  } else if (wordCount >= MIN_WORD_COUNT && !hasClauseVerb) {
    detailLabel = 'Add an action or linking verb (was, saw, felt…)';
    detailHint = 'Every complete sentence needs an action or linking verb (like is, was, felt, ran, saw)!';
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
  // Require ALL 4 checks (target word, capital, punctuation, AND genuine original sentence with verb)
  // so clicking starter + target word + "." can NEVER bypass the chest check!
  const canUnlockChest = allPassed;

  let encouragement = 'Awesome Grade 4 sentence! Tap 🔊 to hear it, then open your Token Chest!';
  if (!allPassed) {
    if (hasGibberish || hasAdjRepeat || copiedPrompt || stackedStarters) {
      encouragement = detailHint;
    } else if (usedStarter && !enoughOwnWords) {
      encouragement = detailHint;
    } else if (wordCount >= MIN_WORD_COUNT && !hasClauseVerb) {
      encouragement = detailHint;
    } else if (!usedTargetWord && passedCount >= 2) {
      encouragement = 'Nice writing! Add one Target Word from the pills above to unlock your chest.';
    } else if (passedCount >= 1) {
      encouragement = 'Keep going! Check off all 4 bubbles to unlock your 25-Token Chest.';
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
    ownWordCount,
    usedStarter,
    encouragement,
  };
}

export const deterministicWritingEvaluator: WritingEvaluator = {
  evaluate: evaluateWritingSubmission,
};

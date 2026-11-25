export interface ChineseWritingCheckItem {
  id: 'target-word' | 'length' | 'punctuation' | 'authentic';
  label: string;
  passed: boolean;
  hint: string;
}

export interface ChineseWritingEvaluation {
  checks: ChineseWritingCheckItem[];
  matchedWords: string[];
  passedCount: number;
  totalCount: number;
  allPassed: boolean;
  canUnlockChest: boolean;
  charCount: number;
  ownCharCount: number;
  usedStarter: boolean;
  encouragement: string;
}

const MIN_CJK_CHARS = 7;
const MIN_UNIQUE_CJK = 5;
const MIN_OWN_CJK_WITH_STARTER = 5;
const MIN_UNIQUE_OWN_WITH_STARTER = 4;
const MIN_OWN_CJK_NO_STARTER = 4;
const MIN_UNIQUE_OWN_NO_STARTER = 3;

function extractCjkChars(text: string): string[] {
  return text.match(/[\u4e00-\u9fff]/g) ?? [];
}

function hasSpamRepetition(text: string, cjk: string[]): boolean {
  // Reject 3+ identical adjacent CJK/alphanumeric characters (e.g. 的的的), while allowing expressive punctuation like ！！！ / ...
  if (/([\u4e00-\u9fffA-Za-z0-9])\1{2,}/.test(text.replace(/\s+/g, ''))) return true;
  // Reject repeated 2-char chunk 3+ times (e.g. 觀察觀察觀察)
  if (/([\u4e00-\u9fff]{2})\1{2,}/.test(text)) return true;
  // Reject keyboard mash Latin/digits mixed in as padding
  if (/qwerty|asdf|zxcv|hjkl|uiop|[a-z]{5,}|\d{4,}/i.test(text)) return true;
  if (cjk.length >= MIN_CJK_CHARS && new Set(cjk).size < MIN_UNIQUE_CJK) return true;
  return false;
}

function looksLikePromptCopy(cjk: string[], promptScenario?: string): boolean {
  if (!promptScenario || cjk.length < MIN_CJK_CHARS) return false;
  const promptSet = new Set(extractCjkChars(promptScenario));
  const novelChars = cjk.filter((ch) => !promptSet.has(ch));
  return novelChars.length < 3;
}

function markCjkSubsequence(
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
      let fresh = 0;
      for (let j = 0; j < needle.length; j += 1) {
        if (!mask[i + j]) {
          mask[i + j] = true;
          fresh += 1;
        }
      }
      if (fresh > 0) {
        hits += 1;
        newlyMasked += fresh;
      }
    }
  }
  return { hits, newlyMasked };
}

export function evaluateChineseWriting(
  sentence: string,
  targetWords: string[],
  promptScenario?: string,
  starterChips?: string[],
): ChineseWritingEvaluation {
  const trimmed = sentence.trim();
  const cjk = extractCjkChars(trimmed);
  const charCount = cjk.length;

  const matchedWords = targetWords.filter((w) => w.trim() && trimmed.includes(w.trim()));
  const usedTargetWord = matchedWords.length > 0;
  const hasEnoughLength = charCount >= MIN_CJK_CHARS;
  const endsWithPunctuation = /[。！？.!?][」』”’)]*$/.test(trimmed);

  // Mask matched starter chips on pure CJK sequences (punctuation-agnostic + 3-char fuzzy overlap guard)
  // so deleting a comma or 1 trailing char cannot bypass starter subtraction!
  const sortedStarters = Array.from(new Set(starterChips ?? []))
    .map((chip) => extractCjkChars(chip))
    .filter((chars) => chars.length >= 2)
    .sort((a, b) => b.length - a.length);

  const starterMask = new Array<boolean>(cjk.length).fill(false);
  const exactMatchedIdx = new Set<number>();
  let matchedStarterCount = 0;

  // Pass 1: Match all exact starters first (longest to shortest) so a longer starter's
  // fuzzy slice can never cannibalize a shorter starter that shares a prefix (e.g. "為了把").
  for (let idx = 0; idx < sortedStarters.length; idx += 1) {
    const chipCjk = sortedStarters[idx];
    const exact = markCjkSubsequence(cjk, chipCjk, starterMask);
    if (exact.hits > 0 && exact.newlyMasked >= Math.min(2, chipCjk.length)) {
      exactMatchedIdx.add(idx);
      matchedStarterCount += exact.hits;
    }
  }

  // Pass 2: Fuzzy 3-char overlap check on unmatched starters (>= 4 CJK chars),
  // requiring >= 60% newly matched characters on a candidate mask before committing.
  for (let idx = 0; idx < sortedStarters.length; idx += 1) {
    if (exactMatchedIdx.has(idx)) continue;
    const chipCjk = sortedStarters[idx];
    if (chipCjk.length < 4) continue;

    const candidateMask = starterMask.slice();
    let fuzzyNewlyMasked = 0;
    const winLen = 3;
    for (let start = 0; start <= chipCjk.length - winLen; start += 1) {
      const slice = chipCjk.slice(start, start + winLen);
      const sub = markCjkSubsequence(cjk, slice, candidateMask);
      fuzzyNewlyMasked += sub.newlyMasked;
    }
    const minFuzzyChars = Math.max(3, Math.ceil(chipCjk.length * 0.6));
    if (fuzzyNewlyMasked >= minFuzzyChars) {
      for (let k = 0; k < starterMask.length; k += 1) {
        starterMask[k] = candidateMask[k];
      }
      matchedStarterCount += 1;
    }
  }

  const usedStarter = matchedStarterCount > 0;
  const stackedStarters = matchedStarterCount >= 2;

  // Mask all matched target words so pasting target words back-to-back cannot pass with 0 original writing
  const targetMask = new Array<boolean>(cjk.length).fill(false);
  for (const tw of matchedWords) {
    const twCjk = extractCjkChars(tw);
    if (twCjk.length > 0) {
      markCjkSubsequence(cjk, twCjk, targetMask);
    }
  }

  const ownCjk = cjk.filter((_, i) => !starterMask[i] && !targetMask[i]);
  const ownCharCount = ownCjk.length;
  const uniqueOwnCjk = new Set(ownCjk).size;

  const minOwnRequired = usedStarter ? MIN_OWN_CJK_WITH_STARTER : MIN_OWN_CJK_NO_STARTER;
  const minUniqueOwnRequired = usedStarter
    ? MIN_UNIQUE_OWN_WITH_STARTER
    : MIN_UNIQUE_OWN_NO_STARTER;
  const enoughOwnCount = ownCharCount >= minOwnRequired;
  const enoughOwnVariety = uniqueOwnCjk >= minUniqueOwnRequired;
  const enoughOwnCjk = enoughOwnCount && enoughOwnVariety;

  const isSpam = hasSpamRepetition(trimmed, cjk);
  const isPromptCopy = looksLikePromptCopy(cjk, promptScenario);
  const isAuthentic =
    charCount >= MIN_CJK_CHARS &&
    enoughOwnCjk &&
    !stackedStarters &&
    !isSpam &&
    !isPromptCopy;

  let authLabel = usedStarter
    ? `自寫內容 ${ownCharCount}/${MIN_OWN_CJK_WITH_STARTER}+ 字`
    : '句子內容豐富不重複';
  let authHint = usedStarter
    ? `快速開頭不算字數喔！請在開頭和目標詞之外自己多寫至少 ${MIN_OWN_CJK_WITH_STARTER} 個中文字。`
    : '多加一點人物、地點或感受的細節！';

  if (isSpam) {
    authLabel = '請勿重複字或亂打字元';
    authHint = '把重複字或亂碼換成真實的中文詞語。';
  } else if (stackedStarters) {
    authLabel = '快速開頭限用 1 個喔！';
    authHint = '選 1 個快速開頭就好，剩下的用自己的話完成句子！';
  } else if (isPromptCopy) {
    authLabel = '請用自己的話造句（勿照抄題目）';
    authHint = '試著用自己的點子寫一個新句子！';
  } else if (!enoughOwnCount) {
    const remaining = Math.max(1, minOwnRequired - ownCharCount);
    authLabel = usedStarter
      ? `再多寫 ${remaining} 個自己的字`
      : `再多寫 ${remaining} 個自寫中文字`;
    authHint = usedStarter
      ? `快速開頭只是靈感幫手，還差 ${remaining} 個自己寫的中文字就能開寶箱！`
      : `不要只貼上目標詞喔！請用自己的話圍繞目標詞再多寫 ${remaining} 個中文字。`;
  } else if (!enoughOwnVariety) {
    authLabel = '請使用更多不同的中文字（避免重複字）';
    authHint = '試著換幾個不同的字把故事說得更生動！';
  }

  const checks: ChineseWritingCheckItem[] = [
    {
      id: 'target-word',
      label:
        matchedWords.length > 0
          ? `已使用：${matchedWords.join('、')}`
          : `使用 1 個目標詞（${targetWords.join('、')}）`,
      passed: usedTargetWord,
      hint: `把「${targetWords[0] ?? '目標詞語'}」放進句子裡。`,
    },
    {
      id: 'length',
      label: `${charCount}/${MIN_CJK_CHARS}+ 個中文字`,
      passed: hasEnoughLength,
      hint: `至少寫 ${MIN_CJK_CHARS} 個中文字讓句子更完整！`,
    },
    {
      id: 'punctuation',
      label: '結尾加上 。 ！ 或 ？',
      passed: endsWithPunctuation,
      hint: '在句子最後加上句號、驚嘆號或問號。',
    },
    {
      id: 'authentic',
      label: authLabel,
      passed: isAuthentic,
      hint: authHint,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const allPassed = passedCount === checks.length;
  const canUnlockChest = allPassed;

  let encouragement = '太棒的繁體中文好句子！點 🔊 聽聽看順不順，就能開寶箱囉！';
  if (!allPassed) {
    if (isSpam || isPromptCopy || stackedStarters || !enoughOwnCjk) {
      encouragement = authHint;
    } else if (!usedTargetWord && passedCount >= 2) {
      encouragement = '寫得不錯！再放進一個上方目標詞就能開寶箱。';
    } else {
      encouragement = '完成全部 4 個小勾勾就能開啟 +25 代幣寶箱！';
    }
  }

  return {
    checks,
    matchedWords,
    passedCount,
    totalCount: checks.length,
    allPassed,
    canUnlockChest,
    charCount,
    ownCharCount,
    usedStarter,
    encouragement,
  };
}

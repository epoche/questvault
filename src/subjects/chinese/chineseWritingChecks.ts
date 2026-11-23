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
  encouragement: string;
}

const MIN_CJK_CHARS = 7;
const MIN_UNIQUE_CJK = 5;

function extractCjkChars(text: string): string[] {
  return text.match(/[\u4e00-\u9fff]/g) ?? [];
}

function hasSpamRepetition(text: string, cjk: string[]): boolean {
  // Reject 3+ identical adjacent characters (e.g. 的的的, 悄悄悄悄)
  if (/(.)\1{2,}/.test(text.replace(/\s+/g, ''))) return true;
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

export function evaluateChineseWriting(
  sentence: string,
  targetWords: string[],
  promptScenario?: string,
): ChineseWritingEvaluation {
  const trimmed = sentence.trim();
  const cjk = extractCjkChars(trimmed);
  const charCount = cjk.length;

  const matchedWords = targetWords.filter((w) => w.trim() && trimmed.includes(w.trim()));
  const usedTargetWord = matchedWords.length > 0;
  const hasEnoughLength = charCount >= MIN_CJK_CHARS;
  const endsWithPunctuation = /[。！？.!?][」』”’)]*$/.test(trimmed);

  const isSpam = hasSpamRepetition(trimmed, cjk);
  const isPromptCopy = looksLikePromptCopy(cjk, promptScenario);
  const isAuthentic = charCount >= MIN_CJK_CHARS && !isSpam && !isPromptCopy;

  let authLabel = '句子內容豐富不重複';
  let authHint = '多加一點人物、地點或感受的細節！';
  if (isSpam) {
    authLabel = '請勿重複字或亂打字元';
    authHint = '把重複字或亂碼換成真實的中文詞語。';
  } else if (isPromptCopy) {
    authLabel = '請用自己的話造句（勿照抄題目）';
    authHint = '試著用自己的點子寫一個新句子！';
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
  const canUnlockChest = usedTargetWord && !isSpam && !isPromptCopy && passedCount >= 3;

  let encouragement = '太棒的繁體中文好句子！快來開寶箱吧！';
  if (!allPassed) {
    if (isSpam || isPromptCopy) encouragement = authHint;
    else if (!usedTargetWord && passedCount >= 2) encouragement = '寫得不錯！再放進一個上方目標詞就能開寶箱。';
    else if (canUnlockChest) encouragement = '快完成了！補完最後一個勾勾就能拿滿 +25 Token 寶箱！';
    else encouragement = '點一個「快速開頭」積木＋目標詞，輕鬆寫出一句好中文！';
  }

  return {
    checks,
    matchedWords,
    passedCount,
    totalCount: checks.length,
    allPassed,
    canUnlockChest,
    charCount,
    encouragement,
  };
}

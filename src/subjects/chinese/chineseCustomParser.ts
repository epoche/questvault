import type { CustomWordInput, CustomWordSetRecord } from '../../core/types';
import type { ChineseTargetWord, ChineseWordSet } from './types';
import { getAllBuiltinChineseWords } from './wordSets';

export type ParseChineseCustomResult =
  | {
      ok: true;
      record: CustomWordSetRecord;
      wordSet: ChineseWordSet;
      autoFilledCount: number;
      unmatchedWords: string[];
    }
  | { ok: false; error: string };

const UNMATCHED_FALLBACK_DEF = '學校指定生字（請聽語音辨認）';

const EXTRA_CHINESE_GLOSSARY: Record<
  string,
  { zhuyin: string; englishBridge: string; definition: string; example?: string }
> = {
  悄悄: {
    zhuyin: 'ㄑㄧㄠ ㄑㄧㄠ',
    englishBridge: 'quietly / secretly',
    definition: '安靜不發出聲音地',
    example: '我悄悄走進房間，不想吵醒正在午睡的小狗。',
  },
  開心: {
    zhuyin: 'ㄎㄞ ㄒㄧㄣ',
    englishBridge: 'happy',
    definition: '心情快樂高興',
    example: '收到好朋友的卡片讓我覺得好開心。',
  },
  努力: {
    zhuyin: 'ㄋㄨˇ ㄌㄧˋ',
    englishBridge: 'work hard',
    definition: '盡力認真去做',
    example: '只要每天努力練習，一定會有進步。',
  },
  感謝: {
    zhuyin: 'ㄍㄢˇ ㄒㄧㄝˋ',
    englishBridge: 'thankful / appreciate',
    definition: '心存謝意謝謝別人',
    example: '我們寫了一張卡片感謝老師這學期的照顧。',
  },
  美麗: {
    zhuyin: 'ㄇㄟˇ ㄌㄧˋ',
    englishBridge: 'beautiful',
    definition: '好看動人',
    example: '夕陽把整片海面染成美麗的金橘色。',
  },
  冒險: {
    zhuyin: 'ㄇㄠˋ ㄒㄧㄢˇ',
    englishBridge: 'adventure',
    definition: '勇敢探索未知的新體驗',
    example: '這本故事書描寫兩隻小狐狸的奇幻冒險。',
  },
  蝴蝶: {
    zhuyin: 'ㄏㄨˊ ㄉㄧㄝˊ',
    englishBridge: 'butterfly',
    definition: '有著彩色翅膀的昆蟲',
    example: '幾隻彩色的蝴蝶在花園裡翩翩起舞。',
  },
  夢想: {
    zhuyin: 'ㄇㄥˋ ㄒㄧㄤˇ',
    englishBridge: 'dream / wish',
    definition: '心裡最想實現的願望',
    example: '成為一位太空科學家是我從小的夢想。',
  },
  安靜: {
    zhuyin: 'ㄢ ㄐㄧㄥˋ',
    englishBridge: 'quiet / peaceful',
    definition: '沒有吵雜聲很平靜',
    example: '圖書館裡非常安靜，適合專心閱讀。',
  },
  聰明: {
    zhuyin: 'ㄘㄨㄥ ㄇㄧㄥˊ',
    englishBridge: 'clever / smart',
    definition: '反應快很會動腦筋',
    example: '這隻聰明的小狗學會了自己開門。',
  },
  耐心: {
    zhuyin: 'ㄋㄞˋ ㄒㄧㄣ',
    englishBridge: 'patience',
    definition: '不著急、願意慢慢等',
    example: '學鋼琴需要每天有耐心地練習指法。',
  },
  禮貌: {
    zhuyin: 'ㄌㄧˇ ㄇㄠˋ',
    englishBridge: 'polite / manners',
    definition: '待人客氣有規矩',
    example: '見到長輩主動打招呼是非常有禮貌的表現。',
  },
  善良: {
    zhuyin: 'ㄕㄢˋ ㄌㄧㄤˊ',
    englishBridge: 'kind-hearted',
    definition: '心地好、樂於助人',
    example: '善良的小女孩把雨傘借給了淋雨的同學。',
  },
  認真: {
    zhuyin: 'ㄖㄣˋ ㄓㄣ',
    englishBridge: 'earnest / focused',
    definition: '用心不馬虎',
    example: '上課認真聽講，回家寫功課就會更輕鬆。',
  },
  尊重: {
    zhuyin: 'ㄗㄨㄣ ㄓㄨㄥˋ',
    englishBridge: 'respect',
    definition: '看重並體諒別人的感受',
    example: '討論時要尊重每位同學發表意見的機會。',
  },
  責任: {
    zhuyin: 'ㄗㄜˊ ㄖㄣˋ',
    englishBridge: 'responsibility',
    definition: '應該做好份內的事',
    example: '按時餵養寵物是主人最重要的責任。',
  },
  團結: {
    zhuyin: 'ㄊㄨㄢˊ ㄐㄧㄝˊ',
    englishBridge: 'united / teamwork',
    definition: '大家同心協力合作',
    example: '只要全班團結合作，一定能贏得拔河比賽。',
  },
  珍惜: {
    zhuyin: 'ㄓㄣ ㄒㄧˊ',
    englishBridge: 'cherish / treasure',
    definition: '愛惜並好好保護',
    example: '我們要珍惜水資源，刷牙時記得關水龍頭。',
  },
  分享: {
    zhuyin: 'ㄈㄣ ㄒㄧㄤˇ',
    englishBridge: 'share',
    definition: '把好東西分給別人一起享受',
    example: '我帶了自己烤的餅乾到學校和朋友分享。',
  },
  進步: {
    zhuyin: 'ㄐㄧㄣˋ ㄅㄨˋ',
    englishBridge: 'improve / progress',
    definition: '比以前做得更好',
    example: '經過一個月的練習，她的中文閱讀進步很多。',
  },
  溫暖: {
    zhuyin: 'ㄨㄣ ㄋㄨㄢˇ',
    englishBridge: 'warm',
    definition: '暖和讓人感到舒服',
    example: '冬天喝一碗熱呼呼的玉米湯讓人覺得好溫暖。',
  },
  自信: {
    zhuyin: 'ㄗˋ ㄒㄧㄣˋ',
    englishBridge: 'confident',
    definition: '相信自己做得到',
    example: '她站在舞台上露出自信的笑容開始演講。',
  },
  仔細: {
    zhuyin: 'ㄗˇ ㄒㄧˋ',
    englishBridge: 'careful / thorough',
    definition: '細心不遺漏細節',
    example: '交考卷前要仔細檢查每一題的算式。',
  },
};

function isValidChineseVocab(word: string): boolean {
  const cjk = word.match(/[\u4e00-\u9fff]/g) ?? [];
  return cjk.length >= 2 && cjk.length <= 8 && /^[\u4e00-\u9fff]+$/.test(word);
}

export function customChineseRecordToWordSet(record: CustomWordSetRecord): ChineseWordSet {
  const words: ChineseTargetWord[] = record.words.map((item) => {
    const isUnmatched = item.definition === UNMATCHED_FALLBACK_DEF;
    const hasWordInExample = Boolean(item.example && item.example.includes(item.word));
    const blanked =
      hasWordInExample && item.example
        ? item.example.replace(item.word, '___')
        : isUnmatched
          ? '請選出這張生字卡的目標詞語：___（點右上角 🔊 可聽語音）'
          : `哪個詞語代表「${item.definition}」？`;
    return {
      word: item.word,
      zhuyin: item.zhuyin ?? '',
      tier: 3,
      partOfSpeech: 'word',
      englishBridge: item.englishBridge ?? 'Chinese school vocab',
      plainBridge: item.definition.length > 22 ? `${item.definition.slice(0, 22)}…` : item.definition,
      contextSentence: blanked,
      sprintSentence: blanked,
      upgradeBefore: isUnmatched ? '請選出正確的學校生詞：' : '請選出代表「',
      upgradePlainSpan: isUnmatched ? '目標生詞' : item.definition,
      upgradeAfter: isUnmatched ? '。' : '」的詞語。',
    };
  });

  return {
    id: record.id,
    subjectId: 'chinese',
    tier: 3,
    title: record.title,
    shortTag: `${words.length} 詞`,
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    emblemCollectibleId: 'magic-quill-sprite',
    isCustom: true,
    forgeScenario: `從「${record.title}」挑一個生字詞，寫一句有趣的繁體中文句子！`,
    starterChips: ['今天中文課我學了', '在我的故事裡，', '放學回家後，我和家人'],
    words,
  };
}

export function parseCustomChineseList(
  rawTitle: string,
  rawText: string,
): ParseChineseCustomResult {
  const title = rawTitle.trim() || '我的中文生字表';
  const builtinLookup = getAllBuiltinChineseWords();

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedWords: CustomWordInput[] = [];
  const seen = new Set<string>();
  let autoFilledCount = 0;
  const unmatchedWords: string[] = [];

  const tryAddPlainWord = (rawToken: string) => {
    const cleaned = rawToken.replace(/^(?:\d+[.)、]\s*|[-•*]\s+)/, '').trim();
    if (!isValidChineseVocab(cleaned) || seen.has(cleaned)) return;
    seen.add(cleaned);

    const builtin = builtinLookup.get(cleaned);
    if (builtin) {
      autoFilledCount += 1;
      parsedWords.push({
        word: cleaned,
        zhuyin: builtin.word.zhuyin,
        englishBridge: builtin.word.englishBridge,
        definition: builtin.word.plainBridge,
        example: builtin.word.contextSentence.replace('___', cleaned),
      });
      return;
    }

    const extra = EXTRA_CHINESE_GLOSSARY[cleaned];
    if (extra) {
      autoFilledCount += 1;
      parsedWords.push({
        word: cleaned,
        zhuyin: extra.zhuyin,
        englishBridge: extra.englishBridge,
        definition: extra.definition,
        ...(extra.example ? { example: extra.example } : {}),
      });
      return;
    }

    unmatchedWords.push(cleaned);
    parsedWords.push({
      word: cleaned,
      definition: UNMATCHED_FALLBACK_DEF,
    });
  };

  for (const line of lines) {
    const cleaned = line.replace(/^(?:\d+[.)、]\s*|[-•*]\s+)/, '').trim();
    if (!cleaned) continue;

    const [mainPart, examplePart] = cleaned.split(/[|｜]/).map((s) => s.trim());
    // Format 1: "詞彙 - 解釋" or "詞彙：解釋"
    const match = mainPart.match(/^([\u4e00-\u9fff]{2,8})(?:\s*(?:\t|—|–|:|：)\s*|\s*-\s+)(.+)$/);
    if (match) {
      const word = match[1].trim();
      const definition = match[2].trim();
      if (!isValidChineseVocab(word) || definition.length < 1 || seen.has(word)) continue;
      seen.add(word);
      const builtin = builtinLookup.get(word);
      const extra = EXTRA_CHINESE_GLOSSARY[word];
      parsedWords.push({
        word,
        definition,
        ...(builtin
          ? { zhuyin: builtin.word.zhuyin, englishBridge: builtin.word.englishBridge }
          : extra
            ? { zhuyin: extra.zhuyin, englishBridge: extra.englishBridge }
            : {}),
        ...(examplePart ? { example: examplePart } : {}),
      });
      continue;
    }

    // Format 2: Plain word list separated by 、 , ， ; or whitespace
    if (/[、,，;；\s]/.test(cleaned)) {
      for (const token of cleaned.split(/[、,，;；\s]+/)) {
        tryAddPlainWord(token);
      }
    } else if (isValidChineseVocab(cleaned)) {
      tryAddPlainWord(cleaned);
    }
  }

  if (parsedWords.length < 3) {
    return {
      ok: false,
      error:
        '請輸入至少 3 個不重複的繁體中文詞彙（每詞 2–8 字），可直接貼「觀察、勇敢、森林」或每行「詞彙 - 解釋」。',
    };
  }

  const record: CustomWordSetRecord = {
    id: `custom-zh-${Date.now().toString(36)}`,
    subjectId: 'chinese',
    title,
    createdAt: new Date().toISOString(),
    words: parsedWords.slice(0, 12),
  };

  return {
    ok: true,
    record,
    wordSet: customChineseRecordToWordSet(record),
    autoFilledCount,
    unmatchedWords,
  };
}

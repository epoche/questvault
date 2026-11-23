import type { SentencePatternSet } from './sentencePatternTypes';

/**
 * Chinese Sentence Pattern & Rhetoric Sets — Part 2 (Tier 3 & Tier 4):
 * - 8 sets (4 Tier 3 + 4 Tier 4), 5 unique items each = 40 items total
 * - 100% Taiwan MOE Standard Traditional Chinese & Standard Zhuyin
 */
export const SENTENCE_PATTERN_SETS_PART2: SentencePatternSet[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 3 · 進階複句與語氣結構（4 組 / 20 題）
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'zh-sp-t3-condition',
    tier: 3,
    category: 'conjunction',
    title: '條件魔法鎖',
    subtitle: '分辨「只要⋯⋯就⋯⋯」的充分條件與「只有⋯⋯才⋯⋯」的唯一條件',
    patternBadge: '只要⋯⋯就⋯⋯ / 只有⋯⋯才⋯⋯',
    emblemCollectibleId: 'critter-otter-mage',
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    items: [
      {
        id: 'zh-sp-t3-condition-1',
        category: 'conjunction',
        patternLabel: '只要⋯⋯就⋯⋯',
        englishBridge: 'As long as ... then ... (sufficient condition)',
        fillPrompt: '（　　）每天練習十分鐘，（　　）能把這首鋼琴曲彈得很流暢。',
        fillPromptZhuyin:
          'ㄇㄟˇ ㄊㄧㄢ ㄌㄧㄢˋ ㄒㄧˊ ㄕˊ ㄈㄣ ㄓㄨㄥ ㄋㄥˊ ㄅㄚˇ ㄓㄜˋ ㄕㄡˇ ㄍㄤ ㄑㄧㄣˊ ㄑㄩˇ ㄊㄢˊ ˙ㄉㄜ ㄏㄣˇ ㄌㄧㄡˊ ㄔㄤˋ',
        fillAnswer: '只要⋯⋯就',
        fillAnswerZhuyin: 'ㄓˇ ㄧㄠˋ ㄐㄧㄡˋ',
        fillChoices: ['只要⋯⋯就', '雖然⋯⋯但是', '不但⋯⋯而且', '一邊⋯⋯一邊'],
        reorderTarget: '只要每天練習十分鐘，就能把這首鋼琴曲彈得很流暢。',
        reorderTargetZhuyin:
          'ㄓˇ ㄧㄠˋ ㄇㄟˇ ㄊㄧㄢ ㄌㄧㄢˋ ㄒㄧˊ ㄕˊ ㄈㄣ ㄓㄨㄥ ㄐㄧㄡˋ ㄋㄥˊ ㄅㄚˇ ㄓㄜˋ ㄕㄡˇ ㄍㄤ ㄑㄧㄣˊ ㄑㄩˇ ㄊㄢˊ ˙ㄉㄜ ㄏㄣˇ ㄌㄧㄡˊ ㄔㄤˋ',
        reorderChunks: [
          '只要每天練習',
          '十分鐘，',
          '就能把這首鋼琴曲',
          '彈得很流暢。',
        ],
        reorderChunksZhuyin: [
          'ㄓˇ ㄧㄠˋ ㄇㄟˇ ㄊㄧㄢ ㄌㄧㄢˋ ㄒㄧˊ',
          'ㄕˊ ㄈㄣ ㄓㄨㄥ',
          'ㄐㄧㄡˋ ㄋㄥˊ ㄅㄚˇ ㄓㄜˋ ㄕㄡˇ ㄍㄤ ㄑㄧㄣˊ ㄑㄩˇ',
          'ㄊㄢˊ ˙ㄉㄜ ㄏㄣˇ ㄌㄧㄡˊ ㄔㄤˋ',
        ],
        explanation:
          '「只要⋯⋯就⋯⋯」表示具備這個條件就能達成結果，語氣輕鬆正向。',
      },
      {
        id: 'zh-sp-t3-condition-2',
        category: 'conjunction',
        patternLabel: '只要⋯⋯就⋯⋯',
        englishBridge: 'As long as you press the button, it starts right away',
        fillPrompt: '（　　）按下這顆綠色按鈕，小機器人就會開始唱兒歌。',
        fillPromptZhuyin:
          'ㄢˋ ㄒㄧㄚˋ ㄓㄜˋ ㄎㄜ ㄌㄩˋ ㄙㄜˋ ㄢˋ ㄋㄧㄡˇ ㄒㄧㄠˇ ㄐㄧ ㄑㄧˋ ㄖㄣˊ ㄐㄧㄡˋ ㄏㄨㄟˋ ㄎㄞ ㄕˇ ㄔㄤˋ ㄦˊ ㄍㄜ',
        fillAnswer: '只要',
        fillAnswerZhuyin: 'ㄓˇ ㄧㄠˋ',
        fillChoices: ['只要', '只有', '雖然', '即使'],
        reorderTarget: '只要按下這顆綠色按鈕，小機器人就會開始唱兒歌。',
        reorderTargetZhuyin:
          'ㄓˇ ㄧㄠˋ ㄢˋ ㄒㄧㄚˋ ㄓㄜˋ ㄎㄜ ㄌㄩˋ ㄙㄜˋ ㄢˋ ㄋㄧㄡˇ ㄒㄧㄠˇ ㄐㄧ ㄑㄧˋ ㄖㄣˊ ㄐㄧㄡˋ ㄏㄨㄟˋ ㄎㄞ ㄕˇ ㄔㄤˋ ㄦˊ ㄍㄜ',
        reorderChunks: [
          '只要按下',
          '這顆綠色按鈕，',
          '小機器人就會',
          '開始唱兒歌。',
        ],
        reorderChunksZhuyin: [
          'ㄓˇ ㄧㄠˋ ㄢˋ ㄒㄧㄚˋ',
          'ㄓㄜˋ ㄎㄜ ㄌㄩˋ ㄙㄜˋ ㄢˋ ㄋㄧㄡˇ',
          'ㄒㄧㄠˇ ㄐㄧ ㄑㄧˋ ㄖㄣˊ ㄐㄧㄡˋ ㄏㄨㄟˋ',
          'ㄎㄞ ㄕˇ ㄔㄤˋ ㄦˊ ㄍㄜ',
        ],
        explanation:
          '後半句已經有「就」，與「就」搭配表示條件的關聯詞是「只要」；「只有」要搭配「才」。',
      },
      {
        id: 'zh-sp-t3-condition-3',
        category: 'conjunction',
        patternLabel: '只有⋯⋯才⋯⋯',
        englishBridge: 'Only if you find the golden key can you open it',
        fillPrompt: '（　　）找到隱藏的金色鑰匙，才能打開這個神祕寶箱。',
        fillPromptZhuyin:
          'ㄓㄠˇ ㄉㄠˋ ㄧㄣˇ ㄘㄤˊ ˙ㄉㄜ ㄐㄧㄣ ㄙㄜˋ ㄧㄠˋ ˙ㄕ ㄘㄞˊ ㄋㄥˊ ㄉㄚˇ ㄎㄞ ㄓㄜˋ ˙ㄍㄜ ㄕㄣˊ ㄇㄧˋ ㄅㄠˇ ㄒㄧㄤ',
        fillAnswer: '只有',
        fillAnswerZhuyin: 'ㄓˇ ㄧㄡˇ',
        fillChoices: ['只有', '只要', '如果', '因為'],
        reorderTarget: '只有找到隱藏的金色鑰匙，才能打開這個神祕寶箱。',
        reorderTargetZhuyin:
          'ㄓˇ ㄧㄡˇ ㄓㄠˇ ㄉㄠˋ ㄧㄣˇ ㄘㄤˊ ˙ㄉㄜ ㄐㄧㄣ ㄙㄜˋ ㄧㄠˋ ˙ㄕ ㄘㄞˊ ㄋㄥˊ ㄉㄚˇ ㄎㄞ ㄓㄜˋ ˙ㄍㄜ ㄕㄣˊ ㄇㄧˋ ㄅㄠˇ ㄒㄧㄤ',
        reorderChunks: [
          '只有找到',
          '隱藏的金色鑰匙，',
          '才能打開',
          '這個神祕寶箱。',
        ],
        reorderChunksZhuyin: [
          'ㄓˇ ㄧㄡˇ ㄓㄠˇ ㄉㄠˋ',
          'ㄧㄣˇ ㄘㄤˊ ˙ㄉㄜ ㄐㄧㄣ ㄙㄜˋ ㄧㄠˋ ˙ㄕ',
          'ㄘㄞˊ ㄋㄥˊ ㄉㄚˇ ㄎㄞ',
          'ㄓㄜˋ ˙ㄍㄜ ㄕㄣˊ ㄇㄧˋ ㄅㄠˇ ㄒㄧㄤ',
        ],
        explanation:
          '後半句使用「才能」，強調這是唯一必備的條件，必須搭配「只有」。',
      },
      {
        id: 'zh-sp-t3-condition-4',
        category: 'conjunction',
        patternLabel: '只有⋯⋯才⋯⋯',
        englishBridge: 'Only by working together will we win the relay race',
        fillPrompt: '只有大家團結合作，我們（　　）能贏得這場大隊接力。',
        fillPromptZhuyin:
          'ㄓˇ ㄧㄡˇ ㄉㄚˋ ㄐㄧㄚ ㄊㄨㄢˊ ㄐㄧㄝˊ ㄏㄜˊ ㄗㄨㄛˋ ㄨㄛˇ ˙ㄇㄣ ㄋㄥˊ ㄧㄥˊ ㄉㄜˊ ㄓㄜˋ ㄔㄤˇ ㄉㄚˋ ㄉㄨㄟˋ ㄐㄧㄝ ㄌㄧˋ',
        fillAnswer: '才',
        fillAnswerZhuyin: 'ㄘㄞˊ',
        fillChoices: ['才', '就', '卻', '也'],
        reorderTarget: '只有大家團結合作，我們才能贏得這場大隊接力。',
        reorderTargetZhuyin:
          'ㄓˇ ㄧㄡˇ ㄉㄚˋ ㄐㄧㄚ ㄊㄨㄢˊ ㄐㄧㄝˊ ㄏㄜˊ ㄗㄨㄛˋ ㄨㄛˇ ˙ㄇㄣ ㄘㄞˊ ㄋㄥˊ ㄧㄥˊ ㄉㄜˊ ㄓㄜˋ ㄔㄤˇ ㄉㄚˋ ㄉㄨㄟˋ ㄐㄧㄝ ㄌㄧˋ',
        reorderChunks: [
          '只有大家',
          '團結合作，',
          '我們才能贏得',
          '這場大隊接力。',
        ],
        reorderChunksZhuyin: [
          'ㄓˇ ㄧㄡˇ ㄉㄚˋ ㄐㄧㄚ',
          'ㄊㄨㄢˊ ㄐㄧㄝˊ ㄏㄜˊ ㄗㄨㄛˋ',
          'ㄨㄛˇ ˙ㄇㄣ ㄘㄞˊ ㄋㄥˊ ㄧㄥˊ ㄉㄜˊ',
          'ㄓㄜˋ ㄔㄤˇ ㄉㄚˋ ㄉㄨㄟˋ ㄐㄧㄝ ㄌㄧˋ',
        ],
        explanation:
          '「只有」一定要配「才」，用來強調沒有這個必要條件就無法成功。',
      },
      {
        id: 'zh-sp-t3-condition-5',
        category: 'conjunction',
        patternLabel: '只有⋯⋯才⋯⋯',
        englishBridge: 'Only if you speak the right spell will the door open',
        fillPrompt: '這扇魔法門（　　）唸出正確咒語，（　　）會慢慢打開。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄕㄢˋ ㄇㄛˊ ㄈㄚˇ ㄇㄣˊ ㄋㄧㄢˋ ㄔㄨ ㄓㄥˋ ㄑㄩㄝˋ ㄓㄡˋ ㄩˇ ㄏㄨㄟˋ ㄇㄢˋ ㄇㄢˋ ㄉㄚˇ ㄎㄞ',
        fillAnswer: '只有⋯⋯才',
        fillAnswerZhuyin: 'ㄓˇ ㄧㄡˇ ㄘㄞˊ',
        fillChoices: ['只有⋯⋯才', '雖然⋯⋯但是', '不但⋯⋯而且', '一邊⋯⋯一邊'],
        reorderTarget: '這扇魔法門只有唸出正確咒語，才會慢慢打開。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄕㄢˋ ㄇㄛˊ ㄈㄚˇ ㄇㄣˊ ㄓˇ ㄧㄡˇ ㄋㄧㄢˋ ㄔㄨ ㄓㄥˋ ㄑㄩㄝˋ ㄓㄡˋ ㄩˇ ㄘㄞˊ ㄏㄨㄟˋ ㄇㄢˋ ㄇㄢˋ ㄉㄚˇ ㄎㄞ',
        reorderChunks: [
          '這扇魔法門',
          '只有唸出',
          '正確咒語，',
          '才會慢慢打開。',
        ],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄕㄢˋ ㄇㄛˊ ㄈㄚˇ ㄇㄣˊ',
          'ㄓˇ ㄧㄡˇ ㄋㄧㄢˋ ㄔㄨ',
          'ㄓㄥˋ ㄑㄩㄝˋ ㄓㄡˋ ㄩˇ',
          'ㄘㄞˊ ㄏㄨㄟˋ ㄇㄢˋ ㄇㄢˋ ㄉㄚˇ ㄎㄞ',
        ],
        explanation:
          '唸出正確咒語是打開魔法門的唯一方法，因此用「只有⋯⋯才⋯⋯」。',
      },
    ],
  },

  {
    id: 'zh-sp-t3-hypothesis',
    tier: 3,
    category: 'conjunction',
    title: '假設任意門',
    subtitle: '練習「如果⋯⋯就⋯⋯」的假設推論與「即使⋯⋯也⋯⋯」的讓步假設',
    patternBadge: '如果⋯⋯就⋯⋯ / 即使⋯⋯也⋯⋯',
    emblemCollectibleId: 'space-saturn-cat',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    items: [
      {
        id: 'zh-sp-t3-hypothesis-1',
        category: 'conjunction',
        patternLabel: '如果⋯⋯就⋯⋯',
        englishBridge: 'If ... then ... (future hypothesis)',
        fillPrompt: '（　　）明天早上放晴，我們（　　）去海邊堆沙堡。',
        fillPromptZhuyin:
          'ㄇㄧㄥˊ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄈㄤˋ ㄑㄧㄥˊ ㄨㄛˇ ˙ㄇㄣ ㄑㄩˋ ㄏㄞˇ ㄅㄧㄢ ㄉㄨㄟ ㄕㄚ ㄅㄠˇ',
        fillAnswer: '如果⋯⋯就',
        fillAnswerZhuyin: 'ㄖㄨˊ ㄍㄨㄛˇ ㄐㄧㄡˋ',
        fillChoices: ['如果⋯⋯就', '雖然⋯⋯卻', '因為⋯⋯所以', '不但⋯⋯還'],
        reorderTarget: '如果明天早上放晴，我們就去海邊堆沙堡。',
        reorderTargetZhuyin:
          'ㄖㄨˊ ㄍㄨㄛˇ ㄇㄧㄥˊ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄈㄤˋ ㄑㄧㄥˊ ㄨㄛˇ ˙ㄇㄣ ㄐㄧㄡˋ ㄑㄩˋ ㄏㄞˇ ㄅㄧㄢ ㄉㄨㄟ ㄕㄚ ㄅㄠˇ',
        reorderChunks: [
          '如果明天',
          '早上放晴，',
          '我們就去',
          '海邊堆沙堡。',
        ],
        reorderChunksZhuyin: [
          'ㄖㄨˊ ㄍㄨㄛˇ ㄇㄧㄥˊ ㄊㄧㄢ',
          'ㄗㄠˇ ㄕㄤˋ ㄈㄤˋ ㄑㄧㄥˊ',
          'ㄨㄛˇ ˙ㄇㄣ ㄐㄧㄡˋ ㄑㄩˋ',
          'ㄏㄞˇ ㄅㄧㄢ ㄉㄨㄟ ㄕㄚ ㄅㄠˇ',
        ],
        explanation:
          '明天還沒到，先假設放晴的狀況再說出計畫，最適合用「如果⋯⋯就⋯⋯」。',
      },
      {
        id: 'zh-sp-t3-hypothesis-2',
        category: 'conjunction',
        patternLabel: '如果⋯⋯就⋯⋯',
        englishBridge: 'If I had wings, then I would fly to the clouds',
        fillPrompt: '（　　）我有一雙彩色翅膀，我就要飛到雲朵上玩捉迷藏。',
        fillPromptZhuyin:
          'ㄨㄛˇ ㄧㄡˇ ㄧ ㄕㄨㄤ ㄘㄞˇ ㄙㄜˋ ㄔˋ ㄅㄤˇ ㄨㄛˇ ㄐㄧㄡˋ ㄧㄠˋ ㄈㄟ ㄉㄠˋ ㄩㄣˊ ㄉㄨㄛˇ ㄕㄤˋ ㄨㄢˊ ㄓㄨㄛ ㄇㄧˊ ㄘㄤˊ',
        fillAnswer: '如果',
        fillAnswerZhuyin: 'ㄖㄨˊ ㄍㄨㄛˇ',
        fillChoices: ['如果', '既然', '即使', '雖然'],
        reorderTarget: '如果我有一雙彩色翅膀，我就要飛到雲朵上玩捉迷藏。',
        reorderTargetZhuyin:
          'ㄖㄨˊ ㄍㄨㄛˇ ㄨㄛˇ ㄧㄡˇ ㄧ ㄕㄨㄤ ㄘㄞˇ ㄙㄜˋ ㄔˋ ㄅㄤˇ ㄨㄛˇ ㄐㄧㄡˋ ㄧㄠˋ ㄈㄟ ㄉㄠˋ ㄩㄣˊ ㄉㄨㄛˇ ㄕㄤˋ ㄨㄢˊ ㄓㄨㄛ ㄇㄧˊ ㄘㄤˊ',
        reorderChunks: [
          '如果我有',
          '一雙彩色翅膀，',
          '我就要飛到',
          '雲朵上玩捉迷藏。',
        ],
        reorderChunksZhuyin: [
          'ㄖㄨˊ ㄍㄨㄛˇ ㄨㄛˇ ㄧㄡˇ',
          'ㄧ ㄕㄨㄤ ㄘㄞˇ ㄙㄜˋ ㄔˋ ㄅㄤˇ',
          'ㄨㄛˇ ㄐㄧㄡˋ ㄧㄠˋ ㄈㄟ ㄉㄠˋ',
          'ㄩㄣˊ ㄉㄨㄛˇ ㄕㄤˋ ㄨㄢˊ ㄓㄨㄛ ㄇㄧˊ ㄘㄤˊ',
        ],
        explanation:
          '有彩色翅膀是天馬行空的想像假設，後半句用「就」，因此選「如果」而非表示既成事實的「既然」。',
      },
      {
        id: 'zh-sp-t3-hypothesis-3',
        category: 'conjunction',
        patternLabel: '即使⋯⋯也⋯⋯',
        englishBridge: 'Even if it storms outside, I will still go to practice',
        fillPrompt: '（　　）外面刮風下雨，我（　　）會準時到舞蹈教室練習。',
        fillPromptZhuyin:
          'ㄨㄞˋ ㄇㄧㄢˋ ㄍㄨㄚ ㄈㄥ ㄒㄧㄚˋ ㄩˇ ㄨㄛˇ ㄏㄨㄟˋ ㄓㄨㄣˇ ㄕˊ ㄉㄠˋ ㄨˇ ㄉㄠˋ ㄐㄧㄠˋ ㄕˋ ㄌㄧㄢˋ ㄒㄧˊ',
        fillAnswer: '即使⋯⋯也',
        fillAnswerZhuyin: 'ㄐㄧˊ ㄕˇ ㄧㄝˇ',
        fillChoices: ['即使⋯⋯也', '因為⋯⋯所以', '不但⋯⋯而且', '一邊⋯⋯一邊'],
        reorderTarget: '即使外面刮風下雨，我也會準時到舞蹈教室練習。',
        reorderTargetZhuyin:
          'ㄐㄧˊ ㄕˇ ㄨㄞˋ ㄇㄧㄢˋ ㄍㄨㄚ ㄈㄥ ㄒㄧㄚˋ ㄩˇ ㄨㄛˇ ㄧㄝˇ ㄏㄨㄟˋ ㄓㄨㄣˇ ㄕˊ ㄉㄠˋ ㄨˇ ㄉㄠˋ ㄐㄧㄠˋ ㄕˋ ㄌㄧㄢˋ ㄒㄧˊ',
        reorderChunks: [
          '即使外面',
          '刮風下雨，',
          '我也會準時',
          '到舞蹈教室練習。',
        ],
        reorderChunksZhuyin: [
          'ㄐㄧˊ ㄕˇ ㄨㄞˋ ㄇㄧㄢˋ',
          'ㄍㄨㄚ ㄈㄥ ㄒㄧㄚˋ ㄩˇ',
          'ㄨㄛˇ ㄧㄝˇ ㄏㄨㄟˋ ㄓㄨㄣˇ ㄕˊ',
          'ㄉㄠˋ ㄨˇ ㄉㄠˋ ㄐㄧㄠˋ ㄕˋ ㄌㄧㄢˋ ㄒㄧˊ',
        ],
        explanation:
          '「即使⋯⋯也⋯⋯」先退一步假設困難情況，再強調結果依然不會改變。',
      },
      {
        id: 'zh-sp-t3-hypothesis-4',
        category: 'conjunction',
        patternLabel: '即使⋯⋯也⋯⋯',
        englishBridge: 'Even if the math problem is hard, she will not give up',
        fillPrompt: '（　　）這道數學題很難，小晴也絕不輕易放棄。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄉㄠˋ ㄕㄨˋ ㄒㄩㄝˊ ㄊㄧˊ ㄏㄣˇ ㄋㄢˊ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄧㄝˇ ㄐㄩㄝˊ ㄅㄨˋ ㄑㄧㄥ ㄧˋ ㄈㄤˋ ㄑㄧˋ',
        fillAnswer: '即使',
        fillAnswerZhuyin: 'ㄐㄧˊ ㄕˇ',
        fillChoices: ['即使', '只要', '因為', '除了'],
        reorderTarget: '即使這道數學題很難，小晴也絕不輕易放棄。',
        reorderTargetZhuyin:
          'ㄐㄧˊ ㄕˇ ㄓㄜˋ ㄉㄠˋ ㄕㄨˋ ㄒㄩㄝˊ ㄊㄧˊ ㄏㄣˇ ㄋㄢˊ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄧㄝˇ ㄐㄩㄝˊ ㄅㄨˋ ㄑㄧㄥ ㄧˋ ㄈㄤˋ ㄑㄧˋ',
        reorderChunks: [
          '即使這道',
          '數學題很難，',
          '小晴也絕不',
          '輕易放棄。',
        ],
        reorderChunksZhuyin: [
          'ㄐㄧˊ ㄕˇ ㄓㄜˋ ㄉㄠˋ',
          'ㄕㄨˋ ㄒㄩㄝˊ ㄊㄧˊ ㄏㄣˇ ㄋㄢˊ',
          'ㄒㄧㄠˇ ㄑㄧㄥˊ ㄧㄝˇ ㄐㄩㄝˊ ㄅㄨˋ',
          'ㄑㄧㄥ ㄧˋ ㄈㄤˋ ㄑㄧˋ',
        ],
        explanation:
          '前後句帶有「退一步假設仍堅持不放棄」的讓步關係，且後半句有「也」，應選「即使」。',
      },
      {
        id: 'zh-sp-t3-hypothesis-5',
        category: 'conjunction',
        patternLabel: '即使⋯⋯也⋯⋯',
        englishBridge: 'Even if we move far away, we will still write letters',
        fillPrompt: '即使搬到遙遠的城市，我們（　　）要常常寫信聯絡。',
        fillPromptZhuyin:
          'ㄐㄧˊ ㄕˇ ㄅㄢ ㄉㄠˋ ㄧㄠˊ ㄩㄢˇ ˙ㄉㄜ ㄔㄥˊ ㄕˋ ㄨㄛˇ ˙ㄇㄣ ㄧㄠˋ ㄔㄤˊ ㄔㄤˊ ㄒㄧㄝˇ ㄒㄧㄣˋ ㄌㄧㄢˊ ㄌㄨㄛˋ',
        fillAnswer: '也',
        fillAnswerZhuyin: 'ㄧㄝˇ',
        fillChoices: ['也', '就', '才', '卻'],
        reorderTarget: '即使搬到遙遠的城市，我們也要常常寫信聯絡。',
        reorderTargetZhuyin:
          'ㄐㄧˊ ㄕˇ ㄅㄢ ㄉㄠˋ ㄧㄠˊ ㄩㄢˇ ˙ㄉㄜ ㄔㄥˊ ㄕˋ ㄨㄛˇ ˙ㄇㄣ ㄧㄝˇ ㄧㄠˋ ㄔㄤˊ ㄔㄤˊ ㄒㄧㄝˇ ㄒㄧㄣˋ ㄌㄧㄢˊ ㄌㄨㄛˋ',
        reorderChunks: [
          '即使搬到',
          '遙遠的城市，',
          '我們也要',
          '常常寫信聯絡。',
        ],
        reorderChunksZhuyin: [
          'ㄐㄧˊ ㄕˇ ㄅㄢ ㄉㄠˋ',
          'ㄧㄠˊ ㄩㄢˇ ˙ㄉㄜ ㄔㄥˊ ㄕˋ',
          'ㄨㄛˇ ˙ㄇㄣ ㄧㄝˇ ㄧㄠˋ',
          'ㄔㄤˊ ㄔㄤˊ ㄒㄧㄝˇ ㄒㄧㄣˋ ㄌㄧㄢˊ ㄌㄨㄛˋ',
        ],
        explanation:
          '「即使」固定與「也」呼應，表達不管距離多遠依然維持友誼。',
      },
    ],
  },

  {
    id: 'zh-sp-t3-unconditional',
    tier: 3,
    category: 'conjunction',
    title: '堅定意志句',
    subtitle: '學會「無論⋯⋯都⋯⋯」的無條件堅持與「既然⋯⋯就⋯⋯」的事實推論',
    patternBadge: '無論⋯⋯都⋯⋯ / 既然⋯⋯就⋯⋯',
    emblemCollectibleId: 'critter-moon-owl',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    items: [
      {
        id: 'zh-sp-t3-unconditional-1',
        category: 'conjunction',
        patternLabel: '無論⋯⋯都⋯⋯',
        englishBridge: 'No matter rain or shine, he always delivers on time',
        fillPrompt: '（　　）晴天還是雨天，郵差叔叔（　　）準時送信。',
        fillPromptZhuyin:
          'ㄑㄧㄥˊ ㄊㄧㄢ ㄏㄞˊ ㄕˋ ㄩˇ ㄊㄧㄢ ㄧㄡˊ ㄔㄞ ㄕㄨˊ ˙ㄕㄨ ㄓㄨㄣˇ ㄕˊ ㄙㄨㄥˋ ㄒㄧㄣˋ',
        fillAnswer: '無論⋯⋯都',
        fillAnswerZhuyin: 'ㄨˊ ㄌㄨㄣˋ ㄉㄡ',
        fillChoices: ['無論⋯⋯都', '因為⋯⋯所以', '不但⋯⋯而且', '既然⋯⋯就'],
        reorderTarget: '無論晴天還是雨天，郵差叔叔都準時送信。',
        reorderTargetZhuyin:
          'ㄨˊ ㄌㄨㄣˋ ㄑㄧㄥˊ ㄊㄧㄢ ㄏㄞˊ ㄕˋ ㄩˇ ㄊㄧㄢ ㄧㄡˊ ㄔㄞ ㄕㄨˊ ˙ㄕㄨ ㄉㄡ ㄓㄨㄣˇ ㄕˊ ㄙㄨㄥˋ ㄒㄧㄣˋ',
        reorderChunks: [
          '無論晴天',
          '還是雨天，',
          '郵差叔叔',
          '都準時送信。',
        ],
        reorderChunksZhuyin: [
          'ㄨˊ ㄌㄨㄣˋ ㄑㄧㄥˊ ㄊㄧㄢ',
          'ㄏㄞˊ ㄕˋ ㄩˇ ㄊㄧㄢ',
          'ㄧㄡˊ ㄔㄞ ㄕㄨˊ ˙ㄕㄨ',
          'ㄉㄡ ㄓㄨㄣˇ ㄕˊ ㄙㄨㄥˋ ㄒㄧㄣˋ',
        ],
        explanation:
          '「無論⋯⋯都⋯⋯」用來表示在任何情況下結果都一樣，常搭配「還是」列舉不同狀況。',
      },
      {
        id: 'zh-sp-t3-unconditional-2',
        category: 'conjunction',
        patternLabel: '無論⋯⋯都⋯⋯',
        englishBridge: 'No matter how tired you are, always brush your teeth',
        fillPrompt: '（　　）玩得多麼累，睡前都要把牙齒刷乾淨。',
        fillPromptZhuyin:
          'ㄨㄢˊ ˙ㄉㄜ ㄉㄨㄛ ˙ㄇㄜ ㄌㄟˋ ㄕㄨㄟˋ ㄑㄧㄢˊ ㄉㄡ ㄧㄠˋ ㄅㄚˇ ㄧㄚˊ ㄔˇ ㄕㄨㄚ ㄍㄢ ㄐㄧㄥˋ',
        fillAnswer: '無論',
        fillAnswerZhuyin: 'ㄨˊ ㄌㄨㄣˋ',
        fillChoices: ['無論', '既然', '因為', '只有'],
        reorderTarget: '無論玩得多麼累，睡前都要把牙齒刷乾淨。',
        reorderTargetZhuyin:
          'ㄨˊ ㄌㄨㄣˋ ㄨㄢˊ ˙ㄉㄜ ㄉㄨㄛ ˙ㄇㄜ ㄌㄟˋ ㄕㄨㄟˋ ㄑㄧㄢˊ ㄉㄡ ㄧㄠˋ ㄅㄚˇ ㄧㄚˊ ㄔˇ ㄕㄨㄚ ㄍㄢ ㄐㄧㄥˋ',
        reorderChunks: [
          '無論玩得',
          '多麼累，',
          '睡前都要把',
          '牙齒刷乾淨。',
        ],
        reorderChunksZhuyin: [
          'ㄨˊ ㄌㄨㄣˋ ㄨㄢˊ ˙ㄉㄜ',
          'ㄉㄨㄛ ˙ㄇㄜ ㄌㄟˋ',
          'ㄕㄨㄟˋ ㄑㄧㄢˊ ㄉㄡ ㄧㄠˋ ㄅㄚˇ',
          'ㄧㄚˊ ㄔˇ ㄕㄨㄚ ㄍㄢ ㄐㄧㄥˋ',
        ],
        explanation:
          '前面有「多麼」涵蓋各種程度，後面有「都」，最標準的無條件關聯詞是「無論」。',
      },
      {
        id: 'zh-sp-t3-unconditional-3',
        category: 'conjunction',
        patternLabel: '無論⋯⋯都⋯⋯',
        englishBridge: 'No matter what difficulties arise, friends always stand by me',
        fillPrompt: '無論遇到什麼困難，好朋友（　　）會陪在我身邊。',
        fillPromptZhuyin:
          'ㄨˊ ㄌㄨㄣˋ ㄩˋ ㄉㄠˋ ㄕㄣˊ ˙ㄇㄜ ㄎㄨㄣˋ ㄋㄢˊ ㄏㄠˇ ㄆㄥˊ ˙ㄧㄡ ㄏㄨㄟˋ ㄆㄟˊ ㄗㄞˋ ㄨㄛˇ ㄕㄣ ㄅㄧㄢ',
        fillAnswer: '都',
        fillAnswerZhuyin: 'ㄉㄡ',
        fillChoices: ['都', '才', '卻', '但'],
        reorderTarget: '無論遇到什麼困難，好朋友都會陪在我身邊。',
        reorderTargetZhuyin:
          'ㄨˊ ㄌㄨㄣˋ ㄩˋ ㄉㄠˋ ㄕㄣˊ ˙ㄇㄜ ㄎㄨㄣˋ ㄋㄢˊ ㄏㄠˇ ㄆㄥˊ ˙ㄧㄡ ㄉㄡ ㄏㄨㄟˋ ㄆㄟˊ ㄗㄞˋ ㄨㄛˇ ㄕㄣ ㄅㄧㄢ',
        reorderChunks: [
          '無論遇到',
          '什麼困難，',
          '好朋友都會',
          '陪在我身邊。',
        ],
        reorderChunksZhuyin: [
          'ㄨˊ ㄌㄨㄣˋ ㄩˋ ㄉㄠˋ',
          'ㄕㄣˊ ˙ㄇㄜ ㄎㄨㄣˋ ㄋㄢˊ',
          'ㄏㄠˇ ㄆㄥˊ ˙ㄧㄡ ㄉㄡ ㄏㄨㄟˋ',
          'ㄆㄟˊ ㄗㄞˋ ㄨㄛˇ ㄕㄣ ㄅㄧㄢ',
        ],
        explanation:
          '「無論」總括所有情況，後半句要用「都」來強調毫無例外的支持。',
      },
      {
        id: 'zh-sp-t3-unconditional-4',
        category: 'conjunction',
        patternLabel: '既然⋯⋯就⋯⋯',
        englishBridge: 'Since you promised, then you should keep your word',
        fillPrompt: '（　　）答應了要幫同學整理圖書，（　　）應該說到做到。',
        fillPromptZhuyin:
          'ㄉㄚ ˙ㄧㄥ ˙ㄌㄜ ㄧㄠˋ ㄅㄤ ㄊㄨㄥˊ ㄒㄩㄝˊ ㄓㄥˇ ㄌㄧˇ ㄊㄨˊ ㄕㄨ ㄧㄥ ㄍㄞ ㄕㄨㄛ ㄉㄠˋ ㄗㄨㄛˋ ㄉㄠˋ',
        fillAnswer: '既然⋯⋯就',
        fillAnswerZhuyin: 'ㄐㄧˋ ㄖㄢˊ ㄐㄧㄡˋ',
        fillChoices: ['既然⋯⋯就', '無論⋯⋯都', '即使⋯⋯也', '雖然⋯⋯但是'],
        reorderTarget: '既然答應了要幫同學整理圖書，就應該說到做到。',
        reorderTargetZhuyin:
          'ㄐㄧˋ ㄖㄢˊ ㄉㄚ ˙ㄧㄥ ˙ㄌㄜ ㄧㄠˋ ㄅㄤ ㄊㄨㄥˊ ㄒㄩㄝˊ ㄓㄥˇ ㄌㄧˇ ㄊㄨˊ ㄕㄨ ㄐㄧㄡˋ ㄧㄥ ㄍㄞ ㄕㄨㄛ ㄉㄠˋ ㄗㄨㄛˋ ㄉㄠˋ',
        reorderChunks: [
          '既然答應了',
          '要幫同學',
          '整理圖書，',
          '就應該說到做到。',
        ],
        reorderChunksZhuyin: [
          'ㄐㄧˋ ㄖㄢˊ ㄉㄚ ˙ㄧㄥ ˙ㄌㄜ',
          'ㄧㄠˋ ㄅㄤ ㄊㄨㄥˊ ㄒㄩㄝˊ',
          'ㄓㄥˇ ㄌㄧˇ ㄊㄨˊ ㄕㄨ',
          'ㄐㄧㄡˋ ㄧㄥ ㄍㄞ ㄕㄨㄛ ㄉㄠˋ ㄗㄨㄛˋ ㄉㄠˋ',
        ],
        explanation:
          '「既然⋯⋯就⋯⋯」先承認已經發生的事實（已經答應了），再推論出應該採取的行動。',
      },
      {
        id: 'zh-sp-t3-unconditional-5',
        category: 'conjunction',
        patternLabel: '既然⋯⋯就⋯⋯',
        englishBridge: 'Since we are already at the night market, let us try boba',
        fillPrompt: '（　　）都來到臺南夜市了，就一定要品嘗道地的珍珠奶茶。',
        fillPromptZhuyin:
          'ㄉㄡ ㄌㄞˊ ㄉㄠˋ ㄊㄞˊ ㄋㄢˊ ㄧㄝˋ ㄕˋ ˙ㄌㄜ ㄐㄧㄡˋ ㄧ ㄉㄧㄥˋ ㄧㄠˋ ㄆㄧㄣˇ ㄔㄤˊ ㄉㄠˋ ㄉㄧˋ ˙ㄉㄜ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ',
        fillAnswer: '既然',
        fillAnswerZhuyin: 'ㄐㄧˋ ㄖㄢˊ',
        fillChoices: ['既然', '無論', '除非', '雖然'],
        reorderTarget: '既然都來到臺南夜市了，就一定要品嘗道地的珍珠奶茶。',
        reorderTargetZhuyin:
          'ㄐㄧˋ ㄖㄢˊ ㄉㄡ ㄌㄞˊ ㄉㄠˋ ㄊㄞˊ ㄋㄢˊ ㄧㄝˋ ㄕˋ ˙ㄌㄜ ㄐㄧㄡˋ ㄧ ㄉㄧㄥˋ ㄧㄠˋ ㄆㄧㄣˇ ㄔㄤˊ ㄉㄠˋ ㄉㄧˋ ˙ㄉㄜ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ',
        reorderChunks: [
          '既然都來到',
          '臺南夜市了，',
          '就一定要品嘗',
          '道地的珍珠奶茶。',
        ],
        reorderChunksZhuyin: [
          'ㄐㄧˋ ㄖㄢˊ ㄉㄡ ㄌㄞˊ ㄉㄠˋ',
          'ㄊㄞˊ ㄋㄢˊ ㄧㄝˋ ㄕˋ ˙ㄌㄜ',
          'ㄐㄧㄡˋ ㄧ ㄉㄧㄥˋ ㄧㄠˋ ㄆㄧㄣˇ ㄔㄤˊ',
          'ㄉㄠˋ ㄉㄧˋ ˙ㄉㄜ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ',
        ],
        explanation:
          '已經來到夜市是確定的事實，接著用「就」提出決定，因此用「既然」。',
      },
    ],
  },

  {
    id: 'zh-sp-t3-emphasis',
    tier: 3,
    category: 'structure',
    title: '語氣加強術',
    subtitle: '用「連⋯⋯都⋯⋯」凸顯極端例子，用「除了⋯⋯還⋯⋯」補充更多細節',
    patternBadge: '連⋯⋯都⋯⋯ / 除了⋯⋯還⋯⋯',
    emblemCollectibleId: 'ocean-dolphin-scout',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    items: [
      {
        id: 'zh-sp-t3-emphasis-1',
        category: 'structure',
        patternLabel: '連⋯⋯都⋯⋯',
        englishBridge: 'Even ... also ... (highlighting a surprising example)',
        fillPrompt: '這本偵探小說太精彩了，（　　）最愛睡覺的小貓（　　）聽得入迷。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄅㄣˇ ㄓㄣ ㄊㄢˋ ㄒㄧㄠˇ ㄕㄨㄛ ㄊㄞˋ ㄐㄧㄥ ㄘㄞˇ ˙ㄌㄜ ㄗㄨㄟˋ ㄞˋ ㄕㄨㄟˋ ㄐㄧㄠˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄇㄠ ㄊㄧㄥ ˙ㄉㄜ ㄖㄨˋ ㄇㄧˊ',
        fillAnswer: '連⋯⋯都',
        fillAnswerZhuyin: 'ㄌㄧㄢˊ ㄉㄡ',
        fillChoices: ['連⋯⋯都', '除了⋯⋯還', '因為⋯⋯所以', '雖然⋯⋯但是'],
        reorderTarget: '這本偵探小說太精彩了，連最愛睡覺的小貓都聽得入迷。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄅㄣˇ ㄓㄣ ㄊㄢˋ ㄒㄧㄠˇ ㄕㄨㄛ ㄊㄞˋ ㄐㄧㄥ ㄘㄞˇ ˙ㄌㄜ ㄌㄧㄢˊ ㄗㄨㄟˋ ㄞˋ ㄕㄨㄟˋ ㄐㄧㄠˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄇㄠ ㄉㄡ ㄊㄧㄥ ˙ㄉㄜ ㄖㄨˋ ㄇㄧˊ',
        reorderChunks: [
          '這本偵探小說',
          '太精彩了，',
          '連最愛睡覺的',
          '小貓都聽得入迷。',
        ],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄅㄣˇ ㄓㄣ ㄊㄢˋ ㄒㄧㄠˇ ㄕㄨㄛ',
          'ㄊㄞˋ ㄐㄧㄥ ㄘㄞˇ ˙ㄌㄜ',
          'ㄌㄧㄢˊ ㄗㄨㄟˋ ㄞˋ ㄕㄨㄟˋ ㄐㄧㄠˋ ˙ㄉㄜ',
          'ㄒㄧㄠˇ ㄇㄠ ㄉㄡ ㄊㄧㄥ ˙ㄉㄜ ㄖㄨˋ ㄇㄧˊ',
        ],
        explanation:
          '「連⋯⋯都⋯⋯」舉出最意想不到的例子，讓「小說很精彩」的語氣更有說服力！',
      },
      {
        id: 'zh-sp-t3-emphasis-2',
        category: 'structure',
        patternLabel: '連⋯⋯都⋯⋯',
        englishBridge: 'Even my kindergarten brother learned how to fold it',
        fillPrompt: '這個摺紙教學非常簡單，（　　）幼稚園的弟弟都學會摺紙鶴了。',
        fillPromptZhuyin:
          'ㄓㄜˋ ˙ㄍㄜ ㄓㄜˊ ㄓˇ ㄐㄧㄠˋ ㄒㄩㄝˊ ㄈㄟ ㄔㄤˊ ㄐㄧㄢˇ ㄉㄢ ㄧㄡˋ ㄓˋ ㄩㄢˊ ˙ㄉㄜ ㄉㄧˋ ˙ㄉㄧ ㄉㄡ ㄒㄩㄝˊ ㄏㄨㄟˋ ㄓㄜˊ ㄓˇ ㄏㄜˋ ˙ㄌㄜ',
        fillAnswer: '連',
        fillAnswerZhuyin: 'ㄌㄧㄢˊ',
        fillChoices: ['連', '把', '被', '從'],
        reorderTarget: '這個摺紙教學非常簡單，連幼稚園的弟弟都學會摺紙鶴了。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ˙ㄍㄜ ㄓㄜˊ ㄓˇ ㄐㄧㄠˋ ㄒㄩㄝˊ ㄈㄟ ㄔㄤˊ ㄐㄧㄢˇ ㄉㄢ ㄌㄧㄢˊ ㄧㄡˋ ㄓˋ ㄩㄢˊ ˙ㄉㄜ ㄉㄧˋ ˙ㄉㄧ ㄉㄡ ㄒㄩㄝˊ ㄏㄨㄟˋ ㄓㄜˊ ㄓˇ ㄏㄜˋ ˙ㄌㄜ',
        reorderChunks: [
          '這個摺紙教學',
          '非常簡單，',
          '連幼稚園的弟弟',
          '都學會摺紙鶴了。',
        ],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ˙ㄍㄜ ㄓㄜˊ ㄓˇ ㄐㄧㄠˋ ㄒㄩㄝˊ',
          'ㄈㄟ ㄔㄤˊ ㄐㄧㄢˇ ㄉㄢ',
          'ㄌㄧㄢˊ ㄧㄡˋ ㄓˋ ㄩㄢˊ ˙ㄉㄜ ㄉㄧˋ ˙ㄉㄧ',
          'ㄉㄡ ㄒㄩㄝˊ ㄏㄨㄟˋ ㄓㄜˊ ㄓˇ ㄏㄜˋ ˙ㄌㄜ',
        ],
        explanation:
          '用年紀最小的弟弟當例子，搭配後面的「都」，要填「連」來強調真的超級簡單。',
      },
      {
        id: 'zh-sp-t3-emphasis-3',
        category: 'structure',
        patternLabel: '除了⋯⋯還⋯⋯',
        englishBridge: 'Besides drawing comics, she is also great at ukulele',
        fillPrompt: '（　　）會畫漫畫，小芸（　　）很擅長彈烏克麗麗。',
        fillPromptZhuyin:
          'ㄏㄨㄟˋ ㄏㄨㄚˋ ㄇㄢˋ ㄏㄨㄚˋ ㄒㄧㄠˇ ㄩㄣˊ ㄏㄣˇ ㄕㄢˋ ㄔㄤˊ ㄊㄢˊ ㄨ ㄎㄜˋ ㄌㄧˋ ㄌㄧˋ',
        fillAnswer: '除了⋯⋯還',
        fillAnswerZhuyin: 'ㄔㄨˊ ˙ㄌㄜ ㄏㄞˊ',
        fillChoices: ['除了⋯⋯還', '只要⋯⋯就', '雖然⋯⋯但是', '連⋯⋯都'],
        reorderTarget: '除了會畫漫畫，小芸還很擅長彈烏克麗麗。',
        reorderTargetZhuyin:
          'ㄔㄨˊ ˙ㄌㄜ ㄏㄨㄟˋ ㄏㄨㄚˋ ㄇㄢˋ ㄏㄨㄚˋ ㄒㄧㄠˇ ㄩㄣˊ ㄏㄞˊ ㄏㄣˇ ㄕㄢˋ ㄔㄤˊ ㄊㄢˊ ㄨ ㄎㄜˋ ㄌㄧˋ ㄌㄧˋ',
        reorderChunks: [
          '除了會畫漫畫，',
          '小芸還',
          '很擅長彈',
          '烏克麗麗。',
        ],
        reorderChunksZhuyin: [
          'ㄔㄨˊ ˙ㄌㄜ ㄏㄨㄟˋ ㄏㄨㄚˋ ㄇㄢˋ ㄏㄨㄚˋ',
          'ㄒㄧㄠˇ ㄩㄣˊ ㄏㄞˊ',
          'ㄏㄣˇ ㄕㄢˋ ㄔㄤˊ ㄊㄢˊ',
          'ㄨ ㄎㄜˋ ㄌㄧˋ ㄌㄧˋ',
        ],
        explanation:
          '「除了⋯⋯還⋯⋯」表示「不只前面這一樣，另外還有後面這一樣」，用來補充更多優點或項目。',
      },
      {
        id: 'zh-sp-t3-emphasis-4',
        category: 'structure',
        patternLabel: '除了⋯⋯還⋯⋯',
        englishBridge: 'In addition to strawberries, it is topped with mango',
        fillPrompt: '（　　）新鮮草莓，這碗剉冰裡還鋪滿了香甜芒果。',
        fillPromptZhuyin:
          'ㄒㄧㄣ ㄒㄧㄢ ㄘㄠˇ ㄇㄟˊ ㄓㄜˋ ㄨㄢˇ ㄘㄨㄛˋ ㄅㄧㄥ ㄌㄧˇ ㄏㄞˊ ㄆㄨ ㄇㄢˇ ˙ㄌㄜ ㄒㄧㄤ ㄊㄧㄢˊ ㄇㄤˊ ㄍㄨㄛˇ',
        fillAnswer: '除了',
        fillAnswerZhuyin: 'ㄔㄨˊ ˙ㄌㄜ',
        fillChoices: ['除了', '因為', '如果', '無論'],
        reorderTarget: '除了新鮮草莓，這碗剉冰裡還鋪滿了香甜芒果。',
        reorderTargetZhuyin:
          'ㄔㄨˊ ˙ㄌㄜ ㄒㄧㄣ ㄒㄧㄢ ㄘㄠˇ ㄇㄟˊ ㄓㄜˋ ㄨㄢˇ ㄘㄨㄛˋ ㄅㄧㄥ ㄌㄧˇ ㄏㄞˊ ㄆㄨ ㄇㄢˇ ˙ㄌㄜ ㄒㄧㄤ ㄊㄧㄢˊ ㄇㄤˊ ㄍㄨㄛˇ',
        reorderChunks: [
          '除了新鮮草莓，',
          '這碗剉冰裡',
          '還鋪滿了',
          '香甜芒果。',
        ],
        reorderChunksZhuyin: [
          'ㄔㄨˊ ˙ㄌㄜ ㄒㄧㄣ ㄒㄧㄢ ㄘㄠˇ ㄇㄟˊ',
          'ㄓㄜˋ ㄨㄢˇ ㄘㄨㄛˋ ㄅㄧㄥ ㄌㄧˇ',
          'ㄏㄞˊ ㄆㄨ ㄇㄢˇ ˙ㄌㄜ',
          'ㄒㄧㄤ ㄊㄧㄢˊ ㄇㄤˊ ㄍㄨㄛˇ',
        ],
        explanation:
          '後半句出現「還」表示額外加上芒果，開頭要配「除了」來列舉草莓以外的配料。',
      },
      {
        id: 'zh-sp-t3-emphasis-5',
        category: 'structure',
        patternLabel: '除了⋯⋯還⋯⋯',
        englishBridge: 'Besides visiting the space exhibit, we also watched a star movie',
        fillPrompt: '除了參觀太空展覽，我們（　　）在天文館看了星空電影。',
        fillPromptZhuyin:
          'ㄔㄨˊ ˙ㄌㄜ ㄘㄢ ㄍㄨㄢ ㄊㄞˋ ㄎㄨㄥ ㄓㄢˇ ㄌㄢˇ ㄨㄛˇ ˙ㄇㄣ ㄗㄞˋ ㄊㄧㄢ ㄨㄣˊ ㄍㄨㄢˇ ㄎㄢˋ ˙ㄌㄜ ㄒㄧㄥ ㄎㄨㄥ ㄉㄧㄢˋ ㄧㄥˇ',
        fillAnswer: '還',
        fillAnswerZhuyin: 'ㄏㄞˊ',
        fillChoices: ['還', '卻', '才', '但'],
        reorderTarget: '除了參觀太空展覽，我們還在天文館看了星空電影。',
        reorderTargetZhuyin:
          'ㄔㄨˊ ˙ㄌㄜ ㄘㄢ ㄍㄨㄢ ㄊㄞˋ ㄎㄨㄥ ㄓㄢˇ ㄌㄢˇ ㄨㄛˇ ˙ㄇㄣ ㄏㄞˊ ㄗㄞˋ ㄊㄧㄢ ㄨㄣˊ ㄍㄨㄢˇ ㄎㄢˋ ˙ㄌㄜ ㄒㄧㄥ ㄎㄨㄥ ㄉㄧㄢˋ ㄧㄥˇ',
        reorderChunks: [
          '除了參觀',
          '太空展覽，',
          '我們還在天文館',
          '看了星空電影。',
        ],
        reorderChunksZhuyin: [
          'ㄔㄨˊ ˙ㄌㄜ ㄘㄢ ㄍㄨㄢ',
          'ㄊㄞˋ ㄎㄨㄥ ㄓㄢˇ ㄌㄢˇ',
          'ㄨㄛˇ ˙ㄇㄣ ㄏㄞˊ ㄗㄞˋ ㄊㄧㄢ ㄨㄣˊ ㄍㄨㄢˇ',
          'ㄎㄢˋ ˙ㄌㄜ ㄒㄧㄥ ㄎㄨㄥ ㄉㄧㄢˋ ㄧㄥˇ',
        ],
        explanation:
          '「除了」後面補充第二項活動，要搭配「還」表示兩件事都有做。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 4 · 經典修辭魔法（4 組 / 20 題）
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'zh-sp-t4-simile',
    tier: 4,
    category: 'rhetoric',
    title: '譬喻魔法筆',
    subtitle: '運用明喻詞「彷彿、宛如、像」，把風景描寫得更有畫面感',
    patternBadge: '明喻：彷彿／宛如／像',
    emblemCollectibleId: 'sweet-macaron-unicorn',
    accentHex: '#9333EA',
    bgHex: '#FAF5FF',
    items: [
      {
        id: 'zh-sp-t4-simile-1',
        category: 'rhetoric',
        patternLabel: '明喻：彷彿',
        englishBridge: 'Simile: as if / just like glowing flames',
        fillPrompt: '秋天的楓葉紅通通的，（　　）燃燒著一團團溫暖的小火苗。',
        fillPromptZhuyin:
          'ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ ㄈㄥ ㄧㄝˋ ㄏㄨㄥˊ ㄊㄨㄥ ㄊㄨㄥ ˙ㄉㄜ ㄖㄢˊ ㄕㄠ ˙ㄓㄜ ㄧ ㄊㄨㄢˊ ㄊㄨㄢˊ ㄨㄣ ㄋㄨㄢˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄏㄨㄛˇ ㄇㄧㄠˊ',
        fillAnswer: '彷彿',
        fillAnswerZhuyin: 'ㄈㄤˇ ㄈㄨˊ',
        fillChoices: ['彷彿', '雖然', '因為', '除非'],
        reorderTarget: '秋天的楓葉紅通通的，彷彿燃燒著一團團溫暖的小火苗。',
        reorderTargetZhuyin:
          'ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ ㄈㄥ ㄧㄝˋ ㄏㄨㄥˊ ㄊㄨㄥ ㄊㄨㄥ ˙ㄉㄜ ㄈㄤˇ ㄈㄨˊ ㄖㄢˊ ㄕㄠ ˙ㄓㄜ ㄧ ㄊㄨㄢˊ ㄊㄨㄢˊ ㄨㄣ ㄋㄨㄢˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄏㄨㄛˇ ㄇㄧㄠˊ',
        reorderChunks: [
          '秋天的楓葉',
          '紅通通的，',
          '彷彿燃燒著',
          '一團團溫暖的小火苗。',
        ],
        reorderChunksZhuyin: [
          'ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ ㄈㄥ ㄧㄝˋ',
          'ㄏㄨㄥˊ ㄊㄨㄥ ㄊㄨㄥ ˙ㄉㄜ',
          'ㄈㄤˇ ㄈㄨˊ ㄖㄢˊ ㄕㄠ ˙ㄓㄜ',
          'ㄧ ㄊㄨㄢˊ ㄊㄨㄢˊ ㄨㄣ ㄋㄨㄢˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄏㄨㄛˇ ㄇㄧㄠˊ',
        ],
        explanation:
          '「彷彿」是優美的明喻詞，把紅色的楓葉比喻成燃燒的小火苗，讓句子更有詩意。',
      },
      {
        id: 'zh-sp-t4-simile-2',
        category: 'rhetoric',
        patternLabel: '明喻：宛如',
        englishBridge: 'Simile: resembling a giant silver mirror',
        fillPrompt: '平靜的湖面閃閃發亮，（　　）一面巨大的銀色鏡子。',
        fillPromptZhuyin:
          'ㄆㄧㄥˊ ㄐㄧㄥˋ ˙ㄉㄜ ㄏㄨˊ ㄇㄧㄢˋ ㄕㄢˇ ㄕㄢˇ ㄈㄚ ㄌㄧㄤˋ ㄧ ㄇㄧㄢˋ ㄐㄩˋ ㄉㄚˋ ˙ㄉㄜ ㄧㄣˊ ㄙㄜˋ ㄐㄧㄥˋ ˙ㄗ',
        fillAnswer: '宛如',
        fillAnswerZhuyin: 'ㄨㄢˇ ㄖㄨˊ',
        fillChoices: ['宛如', '既然', '不但', '即使'],
        reorderTarget: '平靜的湖面閃閃發亮，宛如一面巨大的銀色鏡子。',
        reorderTargetZhuyin:
          'ㄆㄧㄥˊ ㄐㄧㄥˋ ˙ㄉㄜ ㄏㄨˊ ㄇㄧㄢˋ ㄕㄢˇ ㄕㄢˇ ㄈㄚ ㄌㄧㄤˋ ㄨㄢˇ ㄖㄨˊ ㄧ ㄇㄧㄢˋ ㄐㄩˋ ㄉㄚˋ ˙ㄉㄜ ㄧㄣˊ ㄙㄜˋ ㄐㄧㄥˋ ˙ㄗ',
        reorderChunks: [
          '平靜的湖面',
          '閃閃發亮，',
          '宛如一面',
          '巨大的銀色鏡子。',
        ],
        reorderChunksZhuyin: [
          'ㄆㄧㄥˊ ㄐㄧㄥˋ ˙ㄉㄜ ㄏㄨˊ ㄇㄧㄢˋ',
          'ㄕㄢˇ ㄕㄢˇ ㄈㄚ ㄌㄧㄤˋ',
          'ㄨㄢˇ ㄖㄨˊ ㄧ ㄇㄧㄢˋ',
          'ㄐㄩˋ ㄉㄚˋ ˙ㄉㄜ ㄧㄣˊ ㄙㄜˋ ㄐㄧㄥˋ ˙ㄗ',
        ],
        explanation:
          '「宛如」意思是「好像、如同」，把平靜發亮的湖面比喻成大鏡子，是作文常用的明喻修辭。',
      },
      {
        id: 'zh-sp-t4-simile-3',
        category: 'rhetoric',
        patternLabel: '明喻：像⋯⋯一樣',
        englishBridge: 'Simile: as soft as sweet cotton candy',
        fillPrompt: '蓬鬆的白雲飄在藍天上，（　　）甜甜的棉花糖（　　）柔軟。',
        fillPromptZhuyin:
          'ㄆㄥˊ ㄙㄨㄥ ˙ㄉㄜ ㄅㄞˊ ㄩㄣˊ ㄆㄧㄠ ㄗㄞˋ ㄌㄢˊ ㄊㄧㄢ ㄕㄤˋ ㄊㄧㄢˊ ㄊㄧㄢˊ ˙ㄉㄜ ㄇㄧㄢˊ ㄏㄨㄚ ㄊㄤˊ ㄖㄡˊ ㄖㄨㄢˇ',
        fillAnswer: '像⋯⋯一樣',
        fillAnswerZhuyin: 'ㄒㄧㄤˋ ㄧ ㄧㄤˋ',
        fillChoices: ['像⋯⋯一樣', '只要⋯⋯就', '雖然⋯⋯但是', '因為⋯⋯所以'],
        reorderTarget: '蓬鬆的白雲飄在藍天上，像甜甜的棉花糖一樣柔軟。',
        reorderTargetZhuyin:
          'ㄆㄥˊ ㄙㄨㄥ ˙ㄉㄜ ㄅㄞˊ ㄩㄣˊ ㄆㄧㄠ ㄗㄞˋ ㄌㄢˊ ㄊㄧㄢ ㄕㄤˋ ㄒㄧㄤˋ ㄊㄧㄢˊ ㄊㄧㄢˊ ˙ㄉㄜ ㄇㄧㄢˊ ㄏㄨㄚ ㄊㄤˊ ㄧ ㄧㄤˋ ㄖㄡˊ ㄖㄨㄢˇ',
        reorderChunks: [
          '蓬鬆的白雲',
          '飄在藍天上，',
          '像甜甜的棉花糖',
          '一樣柔軟。',
        ],
        reorderChunksZhuyin: [
          'ㄆㄥˊ ㄙㄨㄥ ˙ㄉㄜ ㄅㄞˊ ㄩㄣˊ',
          'ㄆㄧㄠ ㄗㄞˋ ㄌㄢˊ ㄊㄧㄢ ㄕㄤˋ',
          'ㄒㄧㄤˋ ㄊㄧㄢˊ ㄊㄧㄢˊ ˙ㄉㄜ ㄇㄧㄢˊ ㄏㄨㄚ ㄊㄤˊ',
          'ㄧ ㄧㄤˋ ㄖㄡˊ ㄖㄨㄢˇ',
        ],
        explanation:
          '「像⋯⋯一樣」是最親切清楚的明喻句型，點出白雲和棉花糖都一樣蓬鬆柔軟。',
      },
      {
        id: 'zh-sp-t4-simile-4',
        category: 'rhetoric',
        patternLabel: '明喻：彷彿',
        englishBridge: 'Simile: fireflies glowing as if tiny lanterns float by',
        fillPrompt: '夏夜的螢火蟲提著微光飛舞，（　　）在森林裡飄動的小燈籠。',
        fillPromptZhuyin:
          'ㄒㄧㄚˋ ㄧㄝˋ ˙ㄉㄜ ㄧㄥˊ ㄏㄨㄛˇ ㄔㄨㄥˊ ㄊㄧˊ ˙ㄓㄜ ㄨㄟˊ ㄍㄨㄤ ㄈㄟ ㄨˇ ㄗㄞˋ ㄙㄣ ㄌㄧㄣˊ ㄌㄧˇ ㄆㄧㄠ ㄉㄨㄥˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄉㄥ ˙ㄌㄨㄥ',
        fillAnswer: '彷彿',
        fillAnswerZhuyin: 'ㄈㄤˇ ㄈㄨˊ',
        fillChoices: ['彷彿', '只有', '無論', '既然'],
        reorderTarget: '夏夜的螢火蟲提著微光飛舞，彷彿在森林裡飄動的小燈籠。',
        reorderTargetZhuyin:
          'ㄒㄧㄚˋ ㄧㄝˋ ˙ㄉㄜ ㄧㄥˊ ㄏㄨㄛˇ ㄔㄨㄥˊ ㄊㄧˊ ˙ㄓㄜ ㄨㄟˊ ㄍㄨㄤ ㄈㄟ ㄨˇ ㄈㄤˇ ㄈㄨˊ ㄗㄞˋ ㄙㄣ ㄌㄧㄣˊ ㄌㄧˇ ㄆㄧㄠ ㄉㄨㄥˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄉㄥ ˙ㄌㄨㄥ',
        reorderChunks: [
          '夏夜的螢火蟲',
          '提著微光飛舞，',
          '彷彿在森林裡',
          '飄動的小燈籠。',
        ],
        reorderChunksZhuyin: [
          'ㄒㄧㄚˋ ㄧㄝˋ ˙ㄉㄜ ㄧㄥˊ ㄏㄨㄛˇ ㄔㄨㄥˊ',
          'ㄊㄧˊ ˙ㄓㄜ ㄨㄟˊ ㄍㄨㄤ ㄈㄟ ㄨˇ',
          'ㄈㄤˇ ㄈㄨˊ ㄗㄞˋ ㄙㄣ ㄌㄧㄣˊ ㄌㄧˇ',
          'ㄆㄧㄠ ㄉㄨㄥˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄉㄥ ˙ㄌㄨㄥ',
        ],
        explanation:
          '用「彷彿」把發光的螢火蟲比作小燈籠，讀者立刻就能在腦海浮現森林夜色。',
      },
      {
        id: 'zh-sp-t4-simile-5',
        category: 'rhetoric',
        patternLabel: '明喻：宛如',
        englishBridge: 'Simile: a rainbow just like a colorful bridge to fairy land',
        fillPrompt: '大雨過後，天空出現一道七色彩虹，（　　）通往童話王國的彩橋。',
        fillPromptZhuyin:
          'ㄉㄚˋ ㄩˇ ㄍㄨㄛˋ ㄏㄡˋ ㄊㄧㄢ ㄎㄨㄥ ㄔㄨ ㄒㄧㄢˋ ㄧ ㄉㄠˋ ㄑㄧ ㄙㄜˋ ㄘㄞˇ ㄏㄨㄥˊ ㄊㄨㄥ ㄨㄤˇ ㄊㄨㄥˊ ㄏㄨㄚˋ ㄨㄤˊ ㄍㄨㄛˊ ˙ㄉㄜ ㄘㄞˇ ㄑㄧㄠˊ',
        fillAnswer: '宛如',
        fillAnswerZhuyin: 'ㄨㄢˇ ㄖㄨˊ',
        fillChoices: ['宛如', '如果', '除了', '即使'],
        reorderTarget: '大雨過後，天空出現一道七色彩虹，宛如通往童話王國的彩橋。',
        reorderTargetZhuyin:
          'ㄉㄚˋ ㄩˇ ㄍㄨㄛˋ ㄏㄡˋ ㄊㄧㄢ ㄎㄨㄥ ㄔㄨ ㄒㄧㄢˋ ㄧ ㄉㄠˋ ㄑㄧ ㄙㄜˋ ㄘㄞˇ ㄏㄨㄥˊ ㄨㄢˇ ㄖㄨˊ ㄊㄨㄥ ㄨㄤˇ ㄊㄨㄥˊ ㄏㄨㄚˋ ㄨㄤˊ ㄍㄨㄛˊ ˙ㄉㄜ ㄘㄞˇ ㄑㄧㄠˊ',
        reorderChunks: [
          '大雨過後，',
          '天空出現一道',
          '七色彩虹，',
          '宛如通往童話王國的彩橋。',
        ],
        reorderChunksZhuyin: [
          'ㄉㄚˋ ㄩˇ ㄍㄨㄛˋ ㄏㄡˋ',
          'ㄊㄧㄢ ㄎㄨㄥ ㄔㄨ ㄒㄧㄢˋ ㄧ ㄉㄠˋ',
          'ㄑㄧ ㄙㄜˋ ㄘㄞˇ ㄏㄨㄥˊ',
          'ㄨㄢˇ ㄖㄨˊ ㄊㄨㄥ ㄨㄤˇ ㄊㄨㄥˊ ㄏㄨㄚˋ ㄨㄤˊ ㄍㄨㄛˊ ˙ㄉㄜ ㄘㄞˇ ㄑㄧㄠˊ',
        ],
        explanation:
          '用「宛如」把彎彎的彩虹比喻成通往童話王國的彩橋，讓描寫更夢幻動人。',
      },
    ],
  },

  {
    id: 'zh-sp-t4-personify',
    tier: 4,
    category: 'rhetoric',
    title: '擬人童話屋',
    subtitle: '把大自然與日常小物當作人來描寫，賦予表情、動作與心情',
    patternBadge: '擬人修辭',
    emblemCollectibleId: 'critter-sun-phoenix',
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    items: [
      {
        id: 'zh-sp-t4-personify-1',
        category: 'rhetoric',
        patternLabel: '擬人：表情與招呼',
        englishBridge: 'Personification: the sun smiles and says hello to the earth',
        fillPrompt: '清晨時，太陽公公從山頭探出臉龐，開心地對著大地（　　）。',
        fillPromptZhuyin:
          'ㄑㄧㄥ ㄔㄣˊ ㄕˊ ㄊㄞˋ ㄧㄤˊ ㄍㄨㄥ ˙ㄍㄨㄥ ㄘㄨㄥˊ ㄕㄢ ㄊㄡˊ ㄊㄢˋ ㄔㄨ ㄌㄧㄢˇ ㄆㄤˊ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄉㄨㄟˋ ˙ㄓㄜ ㄉㄚˋ ㄉㄧˋ',
        fillAnswer: '微笑打招呼',
        fillAnswerZhuyin: 'ㄨㄟˊ ㄒㄧㄠˋ ㄉㄚˇ ㄓㄠ ˙ㄏㄨ',
        fillChoices: ['微笑打招呼', '慢慢往上升', '發出熱光芒', '變成金黃色'],
        reorderTarget: '清晨時，太陽公公從山頭探出臉龐，開心地對著大地微笑打招呼。',
        reorderTargetZhuyin:
          'ㄑㄧㄥ ㄔㄣˊ ㄕˊ ㄊㄞˋ ㄧㄤˊ ㄍㄨㄥ ˙ㄍㄨㄥ ㄘㄨㄥˊ ㄕㄢ ㄊㄡˊ ㄊㄢˋ ㄔㄨ ㄌㄧㄢˇ ㄆㄤˊ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄉㄨㄟˋ ˙ㄓㄜ ㄉㄚˋ ㄉㄧˋ ㄨㄟˊ ㄒㄧㄠˋ ㄉㄚˇ ㄓㄠ ˙ㄏㄨ',
        reorderChunks: [
          '清晨時，',
          '太陽公公從山頭',
          '探出臉龐，',
          '開心地對著大地',
          '微笑打招呼。',
        ],
        reorderChunksZhuyin: [
          'ㄑㄧㄥ ㄔㄣˊ ㄕˊ',
          'ㄊㄞˋ ㄧㄤˊ ㄍㄨㄥ ˙ㄍㄨㄥ ㄘㄨㄥˊ ㄕㄢ ㄊㄡˊ',
          'ㄊㄢˋ ㄔㄨ ㄌㄧㄢˇ ㄆㄤˊ',
          'ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄉㄨㄟˋ ˙ㄓㄜ ㄉㄚˋ ㄉㄧˋ',
          'ㄨㄟˊ ㄒㄧㄠˋ ㄉㄚˇ ㄓㄠ ˙ㄏㄨ',
        ],
        explanation:
          '賦予太陽「探出臉龐、微笑打招呼」等人的動作與表情，就是生動的擬人修辭！',
      },
      {
        id: 'zh-sp-t4-personify-2',
        category: 'rhetoric',
        patternLabel: '擬人：跳舞與節奏',
        englishBridge: 'Personification: sunflowers waltzing to the breeze',
        fillPrompt: '微風輕輕吹過草地，向日葵排成一列，隨著音樂（　　）。',
        fillPromptZhuyin:
          'ㄨㄟˊ ㄈㄥ ㄑㄧㄥ ㄑㄧㄥ ㄔㄨㄟ ㄍㄨㄛˋ ㄘㄠˇ ㄉㄧˋ ㄒㄧㄤˋ ㄖˋ ㄎㄨㄟˊ ㄆㄞˊ ㄔㄥˊ ㄧ ㄌㄧㄝˋ ㄙㄨㄟˊ ˙ㄓㄜ ㄧㄣ ㄩㄝˋ',
        fillAnswer: '跳起圓舞曲',
        fillAnswerZhuyin: 'ㄊㄧㄠˋ ㄑㄧˇ ㄩㄢˊ ㄨˇ ㄑㄩˇ',
        fillChoices: ['跳起圓舞曲', '吸收了水分', '長出新葉子', '面向著北方'],
        reorderTarget: '微風輕輕吹過草地，向日葵排成一列，隨著音樂跳起圓舞曲。',
        reorderTargetZhuyin:
          'ㄨㄟˊ ㄈㄥ ㄑㄧㄥ ㄑㄧㄥ ㄔㄨㄟ ㄍㄨㄛˋ ㄘㄠˇ ㄉㄧˋ ㄒㄧㄤˋ ㄖˋ ㄎㄨㄟˊ ㄆㄞˊ ㄔㄥˊ ㄧ ㄌㄧㄝˋ ㄙㄨㄟˊ ˙ㄓㄜ ㄧㄣ ㄩㄝˋ ㄊㄧㄠˋ ㄑㄧˇ ㄩㄢˊ ㄨˇ ㄑㄩˇ',
        reorderChunks: [
          '微風輕輕',
          '吹過草地，',
          '向日葵排成一列，',
          '隨著音樂跳起圓舞曲。',
        ],
        reorderChunksZhuyin: [
          'ㄨㄟˊ ㄈㄥ ㄑㄧㄥ ㄑㄧㄥ',
          'ㄔㄨㄟ ㄍㄨㄛˋ ㄘㄠˇ ㄉㄧˋ',
          'ㄒㄧㄤˋ ㄖˋ ㄎㄨㄟˊ ㄆㄞˊ ㄔㄥˊ ㄧ ㄌㄧㄝˋ',
          'ㄙㄨㄟˊ ˙ㄓㄜ ㄧㄣ ㄩㄝˋ ㄊㄧㄠˋ ㄑㄧˇ ㄩㄢˊ ㄨˇ ㄑㄩˇ',
        ],
        explanation:
          '把隨風搖曳的向日葵寫成「隨著音樂跳起圓舞曲」，畫面立刻活潑起來。',
      },
      {
        id: 'zh-sp-t4-personify-3',
        category: 'rhetoric',
        patternLabel: '擬人：神態與互動',
        englishBridge: 'Personification: playful stars winking at us behind clouds',
        fillPrompt: '夜空中的小星星像愛玩的孩子，躲在雲後面對我們（　　）。',
        fillPromptZhuyin:
          'ㄧㄝˋ ㄎㄨㄥ ㄓㄨㄥ ˙ㄉㄜ ㄒㄧㄠˇ ㄒㄧㄥ ˙ㄒㄧㄥ ㄒㄧㄤˋ ㄞˋ ㄨㄢˊ ˙ㄉㄜ ㄏㄞˊ ˙ㄗ ㄉㄨㄛˇ ㄗㄞˋ ㄩㄣˊ ㄏㄡˋ ㄇㄧㄢˋ ㄉㄨㄟˋ ㄨㄛˇ ˙ㄇㄣ',
        fillAnswer: '眨眨眼睛',
        fillAnswerZhuyin: 'ㄓㄚˇ ㄓㄚˇ ㄧㄢˇ ㄐㄧㄥ',
        fillChoices: ['眨眨眼睛', '距離很遙遠', '發出白光線', '繞著地球轉'],
        reorderTarget: '夜空中的小星星像愛玩的孩子，躲在雲後面對我們眨眨眼睛。',
        reorderTargetZhuyin:
          'ㄧㄝˋ ㄎㄨㄥ ㄓㄨㄥ ˙ㄉㄜ ㄒㄧㄠˇ ㄒㄧㄥ ˙ㄒㄧㄥ ㄒㄧㄤˋ ㄞˋ ㄨㄢˊ ˙ㄉㄜ ㄏㄞˊ ˙ㄗ ㄉㄨㄛˇ ㄗㄞˋ ㄩㄣˊ ㄏㄡˋ ㄇㄧㄢˋ ㄉㄨㄟˋ ㄨㄛˇ ˙ㄇㄣ ㄓㄚˇ ㄓㄚˇ ㄧㄢˇ ㄐㄧㄥ',
        reorderChunks: [
          '夜空中的小星星',
          '像愛玩的孩子，',
          '躲在雲後面',
          '對我們眨眨眼睛。',
        ],
        reorderChunksZhuyin: [
          'ㄧㄝˋ ㄎㄨㄥ ㄓㄨㄥ ˙ㄉㄜ ㄒㄧㄠˇ ㄒㄧㄥ ˙ㄒㄧㄥ',
          'ㄒㄧㄤˋ ㄞˋ ㄨㄢˊ ˙ㄉㄜ ㄏㄞˊ ˙ㄗ',
          'ㄉㄨㄛˇ ㄗㄞˋ ㄩㄣˊ ㄏㄡˋ ㄇㄧㄢˋ',
          'ㄉㄨㄟˋ ㄨㄛˇ ˙ㄇㄣ ㄓㄚˇ ㄓㄚˇ ㄧㄢˇ ㄐㄧㄥ',
        ],
        explanation:
          '用「躲在雲後面、眨眨眼睛」形容星光閃爍，讓星星充滿調皮可愛的個性。',
      },
      {
        id: 'zh-sp-t4-personify-4',
        category: 'rhetoric',
        patternLabel: '擬人：說話與催促',
        englishBridge: 'Personification: the alarm clock shouting to get out of bed',
        fillPrompt: '星期一早上，床頭的小鬧鐘大聲地對我（　　），催我快點起床。',
        fillPromptZhuyin:
          'ㄒㄧㄥ ㄑㄧˊ ㄧ ㄗㄠˇ ㄕㄤˋ ㄔㄨㄤˊ ㄊㄡˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄋㄠˋ ㄓㄨㄥ ㄉㄚˋ ㄕㄥ ˙ㄉㄜ ㄉㄨㄟˋ ㄨㄛˇ ㄘㄨㄟ ㄨㄛˇ ㄎㄨㄞˋ ㄉㄧㄢˇ ㄑㄧˇ ㄔㄨㄤˊ',
        fillAnswer: '喊著別賴床',
        fillAnswerZhuyin: 'ㄏㄢˇ ˙ㄓㄜ ㄅㄧㄝˊ ㄌㄞˋ ㄔㄨㄤˊ',
        fillChoices: ['喊著別賴床', '顯示七點整', '電池沒電了', '擺在書桌上'],
        reorderTarget: '星期一早上，床頭的小鬧鐘大聲地對我喊著別賴床，催我快點起床。',
        reorderTargetZhuyin:
          'ㄒㄧㄥ ㄑㄧˊ ㄧ ㄗㄠˇ ㄕㄤˋ ㄔㄨㄤˊ ㄊㄡˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄋㄠˋ ㄓㄨㄥ ㄉㄚˋ ㄕㄥ ˙ㄉㄜ ㄉㄨㄟˋ ㄨㄛˇ ㄏㄢˇ ˙ㄓㄜ ㄅㄧㄝˊ ㄌㄞˋ ㄔㄨㄤˊ ㄘㄨㄟ ㄨㄛˇ ㄎㄨㄞˋ ㄉㄧㄢˇ ㄑㄧˇ ㄔㄨㄤˊ',
        reorderChunks: [
          '星期一早上，',
          '床頭的小鬧鐘',
          '大聲地對我',
          '喊著別賴床，',
          '催我快點起床。',
        ],
        reorderChunksZhuyin: [
          'ㄒㄧㄥ ㄑㄧˊ ㄧ ㄗㄠˇ ㄕㄤˋ',
          'ㄔㄨㄤˊ ㄊㄡˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄋㄠˋ ㄓㄨㄥ',
          'ㄉㄚˋ ㄕㄥ ˙ㄉㄜ ㄉㄨㄟˋ ㄨㄛˇ',
          'ㄏㄢˇ ˙ㄓㄜ ㄅㄧㄝˊ ㄌㄞˋ ㄔㄨㄤˊ',
          'ㄘㄨㄟ ㄨㄛˇ ㄎㄨㄞˋ ㄉㄧㄢˇ ㄑㄧˇ ㄔㄨㄤˊ',
        ],
        explanation:
          '把鬧鐘響聲擬人化成「喊著別賴床」，讓平凡的早晨變得像童話故事一樣有趣。',
      },
      {
        id: 'zh-sp-t4-personify-5',
        category: 'rhetoric',
        patternLabel: '擬人：敲門與聊天',
        englishBridge: 'Personification: naughty raindrops tapping the window to chat',
        fillPrompt: '頑皮的小雨滴跳到玻璃窗上，輕輕（　　）想找我聊天。',
        fillPromptZhuyin:
          'ㄨㄢˊ ㄆㄧˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄩˇ ㄉㄧ ㄊㄧㄠˋ ㄉㄠˋ ㄅㄛ ˙ㄌㄧ ㄔㄨㄤ ㄕㄤˋ ㄑㄧㄥ ㄑㄧㄥ ㄒㄧㄤˇ ㄓㄠˇ ㄨㄛˇ ㄌㄧㄠˊ ㄊㄧㄢ',
        fillAnswer: '敲著窗戶',
        fillAnswerZhuyin: 'ㄑㄧㄠ ˙ㄓㄜ ㄔㄨㄤ ˙ㄏㄨ',
        fillChoices: ['敲著窗戶', '蒸發成水氣', '流進排水溝', '變成小水窪'],
        reorderTarget: '頑皮的小雨滴跳到玻璃窗上，輕輕敲著窗戶想找我聊天。',
        reorderTargetZhuyin:
          'ㄨㄢˊ ㄆㄧˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄩˇ ㄉㄧ ㄊㄧㄠˋ ㄉㄠˋ ㄅㄛ ˙ㄌㄧ ㄔㄨㄤ ㄕㄤˋ ㄑㄧㄥ ㄑㄧㄥ ㄑㄧㄠ ˙ㄓㄜ ㄔㄨㄤ ˙ㄏㄨ ㄒㄧㄤˇ ㄓㄠˇ ㄨㄛˇ ㄌㄧㄠˊ ㄊㄧㄢ',
        reorderChunks: [
          '頑皮的小雨滴',
          '跳到玻璃窗上，',
          '輕輕敲著窗戶',
          '想找我聊天。',
        ],
        reorderChunksZhuyin: [
          'ㄨㄢˊ ㄆㄧˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄩˇ ㄉㄧ',
          'ㄊㄧㄠˋ ㄉㄠˋ ㄅㄛ ˙ㄌㄧ ㄔㄨㄤ ㄕㄤˋ',
          'ㄑㄧㄥ ㄑㄧㄥ ㄑㄧㄠ ˙ㄓㄜ ㄔㄨㄤ ˙ㄏㄨ',
          'ㄒㄧㄤˇ ㄓㄠˇ ㄨㄛˇ ㄌㄧㄠˊ ㄊㄧㄢ',
        ],
        explanation:
          '讓雨滴擁有「敲著窗戶、想找我聊天」的擬人行為，把下雨天寫得溫暖又親切。',
      },
    ],
  },

  {
    id: 'zh-sp-t4-rhetorical',
    tier: 4,
    category: 'rhetoric',
    title: '設問與反問',
    subtitle: '學會用「難道⋯⋯嗎？」加強反問語氣，用「為什麼⋯⋯」引起好奇思考',
    patternBadge: '難道⋯⋯嗎？ / 為什麼⋯⋯',
    emblemCollectibleId: 'space-comet-whale',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    items: [
      {
        id: 'zh-sp-t4-rhetorical-1',
        category: 'rhetoric',
        patternLabel: '反問：難道⋯⋯嗎？',
        englishBridge: 'Rhetorical question: Could it not be ...? (strongly means yes!)',
        fillPrompt: '這幅畫的色彩這麼繽紛，（　　）不是你用心畫出來的（　　）？',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄈㄨˊ ㄏㄨㄚˋ ˙ㄉㄜ ㄙㄜˋ ㄘㄞˇ ㄓㄜˋ ˙ㄇㄜ ㄅㄧㄣ ㄈㄣ ㄅㄨˋ ㄕˋ ㄋㄧˇ ㄩㄥˋ ㄒㄧㄣ ㄏㄨㄚˋ ㄔㄨ ㄌㄞˊ ˙ㄉㄜ',
        fillAnswer: '難道⋯⋯嗎',
        fillAnswerZhuyin: 'ㄋㄢˊ ㄉㄠˋ ˙ㄇㄚ',
        fillChoices: ['難道⋯⋯嗎', '雖然⋯⋯但是', '因為⋯⋯所以', '只要⋯⋯就'],
        reorderTarget: '這幅畫的色彩這麼繽紛，難道不是你用心畫出來的嗎？',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄈㄨˊ ㄏㄨㄚˋ ˙ㄉㄜ ㄙㄜˋ ㄘㄞˇ ㄓㄜˋ ˙ㄇㄜ ㄅㄧㄣ ㄈㄣ ㄋㄢˊ ㄉㄠˋ ㄅㄨˋ ㄕˋ ㄋㄧˇ ㄩㄥˋ ㄒㄧㄣ ㄏㄨㄚˋ ㄔㄨ ㄌㄞˊ ˙ㄉㄜ ˙ㄇㄚ',
        reorderChunks: [
          '這幅畫的色彩',
          '這麼繽紛，',
          '難道不是你',
          '用心畫出來的嗎？',
        ],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄈㄨˊ ㄏㄨㄚˋ ˙ㄉㄜ ㄙㄜˋ ㄘㄞˇ',
          'ㄓㄜˋ ˙ㄇㄜ ㄅㄧㄣ ㄈㄣ',
          'ㄋㄢˊ ㄉㄠˋ ㄅㄨˋ ㄕˋ ㄋㄧˇ',
          'ㄩㄥˋ ㄒㄧㄣ ㄏㄨㄚˋ ㄔㄨ ㄌㄞˊ ˙ㄉㄜ ˙ㄇㄚ',
        ],
        explanation:
          '「難道不是⋯⋯嗎？」是激問（反問）修辭，答案就在問題裡，強烈肯定「就是你用心畫出來的」。',
      },
      {
        id: 'zh-sp-t4-rhetorical-2',
        category: 'rhetoric',
        patternLabel: '反問：難道⋯⋯嗎？',
        englishBridge: 'Rhetorical question: Shouldn’t we treasure precious water?',
        fillPrompt: '地球上的水資源很珍貴，（　　）我們不應該好好珍惜嗎？',
        fillPromptZhuyin:
          'ㄉㄧˋ ㄑㄧㄡˊ ㄕㄤˋ ˙ㄉㄜ ㄕㄨㄟˇ ㄗ ㄩㄢˊ ㄏㄣˇ ㄓㄣ ㄍㄨㄟˋ ㄨㄛˇ ˙ㄇㄣ ㄅㄨˋ ㄧㄥ ㄍㄞ ㄏㄠˇ ㄏㄠˇ ㄓㄣ ㄒㄧˊ ˙ㄇㄚ',
        fillAnswer: '難道',
        fillAnswerZhuyin: 'ㄋㄢˊ ㄉㄠˋ',
        fillChoices: ['難道', '既然', '即使', '只要'],
        reorderTarget: '地球上的水資源很珍貴，難道我們不應該好好珍惜嗎？',
        reorderTargetZhuyin:
          'ㄉㄧˋ ㄑㄧㄡˊ ㄕㄤˋ ˙ㄉㄜ ㄕㄨㄟˇ ㄗ ㄩㄢˊ ㄏㄣˇ ㄓㄣ ㄍㄨㄟˋ ㄋㄢˊ ㄉㄠˋ ㄨㄛˇ ˙ㄇㄣ ㄅㄨˋ ㄧㄥ ㄍㄞ ㄏㄠˇ ㄏㄠˇ ㄓㄣ ㄒㄧˊ ˙ㄇㄚ',
        reorderChunks: [
          '地球上的水資源',
          '很珍貴，',
          '難道我們不應該',
          '好好珍惜嗎？',
        ],
        reorderChunksZhuyin: [
          'ㄉㄧˋ ㄑㄧㄡˊ ㄕㄤˋ ˙ㄉㄜ ㄕㄨㄟˇ ㄗ ㄩㄢˊ',
          'ㄏㄣˇ ㄓㄣ ㄍㄨㄟˋ',
          'ㄋㄢˊ ㄉㄠˋ ㄨㄛˇ ˙ㄇㄣ ㄅㄨˋ ㄧㄥ ㄍㄞ',
          'ㄏㄠˇ ㄏㄠˇ ㄓㄣ ㄒㄧˊ ˙ㄇㄚ',
        ],
        explanation:
          '句尾有「嗎？」且語氣強烈反問「應該好好珍惜」，開頭最合適的反問副詞是「難道」。',
      },
      {
        id: 'zh-sp-t4-rhetorical-3',
        category: 'rhetoric',
        patternLabel: '反問：難道⋯⋯嗎？',
        englishBridge: 'Rhetorical question: Could you really have forgotten the card?',
        fillPrompt: '今天是好朋友的生日，難道你真的忘記準備卡片了（　　）？',
        fillPromptZhuyin:
          'ㄐㄧㄣ ㄊㄧㄢ ㄕˋ ㄏㄠˇ ㄆㄥˊ ˙ㄧㄡ ˙ㄉㄜ ㄕㄥ ㄖˋ ㄋㄢˊ ㄉㄠˋ ㄋㄧˇ ㄓㄣ ˙ㄉㄜ ㄨㄤˋ ㄐㄧˋ ㄓㄨㄣˇ ㄅㄟˋ ㄎㄚˇ ㄆㄧㄢˋ ˙ㄌㄜ',
        fillAnswer: '嗎',
        fillAnswerZhuyin: '˙ㄇㄚ',
        fillChoices: ['嗎', '就', '才', '卻'],
        reorderTarget: '今天是好朋友的生日，難道你真的忘記準備卡片了嗎？',
        reorderTargetZhuyin:
          'ㄐㄧㄣ ㄊㄧㄢ ㄕˋ ㄏㄠˇ ㄆㄥˊ ˙ㄧㄡ ˙ㄉㄜ ㄕㄥ ㄖˋ ㄋㄢˊ ㄉㄠˋ ㄋㄧˇ ㄓㄣ ˙ㄉㄜ ㄨㄤˋ ㄐㄧˋ ㄓㄨㄣˇ ㄅㄟˋ ㄎㄚˇ ㄆㄧㄢˋ ˙ㄌㄜ ˙ㄇㄚ',
        reorderChunks: [
          '今天是好朋友的',
          '生日，',
          '難道你真的忘記',
          '準備卡片了嗎？',
        ],
        reorderChunksZhuyin: [
          'ㄐㄧㄣ ㄊㄧㄢ ㄕˋ ㄏㄠˇ ㄆㄥˊ ˙ㄧㄡ ˙ㄉㄜ',
          'ㄕㄥ ㄖˋ',
          'ㄋㄢˊ ㄉㄠˋ ㄋㄧˇ ㄓㄣ ˙ㄉㄜ ㄨㄤˋ ㄐㄧˋ',
          'ㄓㄨㄣˇ ㄅㄟˋ ㄎㄚˇ ㄆㄧㄢˋ ˙ㄌㄜ ˙ㄇㄚ',
        ],
        explanation:
          '「難道」在反問句尾常搭配疑問助詞「嗎」，表達驚訝與提醒。',
      },
      {
        id: 'zh-sp-t4-rhetorical-4',
        category: 'rhetoric',
        patternLabel: '提問：為什麼⋯⋯原來⋯⋯',
        englishBridge: 'Ask-and-answer rhetoric: Why do sunflowers face the sun? It turns out...',
        fillPrompt: '（　　）向日葵總是面向太陽？原來是因為植物會追逐陽光。',
        fillPromptZhuyin:
          'ㄒㄧㄤˋ ㄖˋ ㄎㄨㄟˊ ㄗㄨㄥˇ ㄕˋ ㄇㄧㄢˋ ㄒㄧㄤˋ ㄊㄞˋ ㄧㄤˊ ㄩㄢˊ ㄌㄞˊ ㄕˋ ㄧㄣ ㄨㄟˋ ㄓˊ ㄨˋ ㄏㄨㄟˋ ㄓㄨㄟ ㄓㄨˊ ㄧㄤˊ ㄍㄨㄤ',
        fillAnswer: '為什麼',
        fillAnswerZhuyin: 'ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ',
        fillChoices: ['為什麼', '無論如何', '只要這樣', '雖然如此'],
        reorderTarget: '為什麼向日葵總是面向太陽？原來是因為植物會追逐陽光。',
        reorderTargetZhuyin:
          'ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ ㄒㄧㄤˋ ㄖˋ ㄎㄨㄟˊ ㄗㄨㄥˇ ㄕˋ ㄇㄧㄢˋ ㄒㄧㄤˋ ㄊㄞˋ ㄧㄤˊ ㄩㄢˊ ㄌㄞˊ ㄕˋ ㄧㄣ ㄨㄟˋ ㄓˊ ㄨˋ ㄏㄨㄟˋ ㄓㄨㄟ ㄓㄨˊ ㄧㄤˊ ㄍㄨㄤ',
        reorderChunks: [
          '為什麼向日葵',
          '總是面向太陽？',
          '原來是因為',
          '植物會追逐陽光。',
        ],
        reorderChunksZhuyin: [
          'ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ ㄒㄧㄤˋ ㄖˋ ㄎㄨㄟˊ',
          'ㄗㄨㄥˇ ㄕˋ ㄇㄧㄢˋ ㄒㄧㄤˋ ㄊㄞˋ ㄧㄤˊ',
          'ㄩㄢˊ ㄌㄞˊ ㄕˋ ㄧㄣ ㄨㄟˋ',
          'ㄓˊ ㄨˋ ㄏㄨㄟˋ ㄓㄨㄟ ㄓㄨˊ ㄧㄤˊ ㄍㄨㄤ',
        ],
        explanation:
          '先用「為什麼⋯⋯？」提問引起好奇，再自問自答揭曉原因，稱為設問修辭中的「提問」。',
      },
      {
        id: 'zh-sp-t4-rhetorical-5',
        category: 'rhetoric',
        patternLabel: '提問：為什麼⋯⋯因為⋯⋯',
        englishBridge: 'Ask-and-answer rhetoric: Why do autumn leaves change color?',
        fillPrompt: '（　　）秋天的葉子會變黃變紅？因為天氣變冷讓葉綠素減少了。',
        fillPromptZhuyin:
          'ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ ㄧㄝˋ ˙ㄗ ㄏㄨㄟˋ ㄅㄧㄢˋ ㄏㄨㄤˊ ㄅㄧㄢˋ ㄏㄨㄥˊ ㄧㄣ ㄨㄟˋ ㄊㄧㄢ ㄑㄧˋ ㄅㄧㄢˋ ㄌㄥˇ ㄖㄤˋ ㄧㄝˋ ㄌㄩˋ ㄙㄨˋ ㄐㄧㄢˇ ㄕㄠˇ ˙ㄌㄜ',
        fillAnswer: '為什麼',
        fillAnswerZhuyin: 'ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ',
        fillChoices: ['為什麼', '如果說', '既然是', '除了讓'],
        reorderTarget: '為什麼秋天的葉子會變黃變紅？因為天氣變冷讓葉綠素減少了。',
        reorderTargetZhuyin:
          'ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ ㄧㄝˋ ˙ㄗ ㄏㄨㄟˋ ㄅㄧㄢˋ ㄏㄨㄤˊ ㄅㄧㄢˋ ㄏㄨㄥˊ ㄧㄣ ㄨㄟˋ ㄊㄧㄢ ㄑㄧˋ ㄅㄧㄢˋ ㄌㄥˇ ㄖㄤˋ ㄧㄝˋ ㄌㄩˋ ㄙㄨˋ ㄐㄧㄢˇ ㄕㄠˇ ˙ㄌㄜ',
        reorderChunks: [
          '為什麼秋天的',
          '葉子會變黃變紅？',
          '因為天氣變冷',
          '讓葉綠素減少了。',
        ],
        reorderChunksZhuyin: [
          'ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ',
          'ㄧㄝˋ ˙ㄗ ㄏㄨㄟˋ ㄅㄧㄢˋ ㄏㄨㄤˊ ㄅㄧㄢˋ ㄏㄨㄥˊ',
          'ㄧㄣ ㄨㄟˋ ㄊㄧㄢ ㄑㄧˋ ㄅㄧㄢˋ ㄌㄥˇ',
          'ㄖㄤˋ ㄧㄝˋ ㄌㄩˋ ㄙㄨˋ ㄐㄧㄢˇ ㄕㄠˇ ˙ㄌㄜ',
        ],
        explanation:
          '用「為什麼」引出問題，接著馬上用「因為」回答，能讓科普文章讀起來更吸引人！',
      },
    ],
  },

  {
    id: 'zh-sp-t4-parallelism',
    tier: 4,
    category: 'rhetoric',
    title: '排比交響曲',
    subtitle: '運用「有的⋯⋯有的⋯⋯還有的⋯⋯」與三段排比，寫出熱鬧有節奏的句子',
    patternBadge: '有的⋯⋯有的⋯⋯有的⋯⋯',
    emblemCollectibleId: 'critter-chroma-dragon',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    items: [
      {
        id: 'zh-sp-t4-parallelism-1',
        category: 'rhetoric',
        patternLabel: '排比：有的⋯⋯有的⋯⋯還有的⋯⋯',
        englishBridge: 'Parallelism: some ... some ... and some ... at recess',
        fillPrompt: '下課鐘一響，操場上（　　）同學在跳繩，（　　）在踢足球，還有的在樹下聊天。',
        fillPromptZhuyin:
          'ㄒㄧㄚˋ ㄎㄜˋ ㄓㄨㄥ ㄧ ㄒㄧㄤˇ ㄘㄠ ㄔㄤˇ ㄕㄤˋ ㄊㄨㄥˊ ㄒㄩㄝˊ ㄗㄞˋ ㄊㄧㄠˋ ㄕㄥˊ ㄗㄞˋ ㄊㄧ ㄗㄨˊ ㄑㄧㄡˊ ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄕㄨˋ ㄒㄧㄚˋ ㄌㄧㄠˊ ㄊㄧㄢ',
        fillAnswer: '有的⋯⋯有的',
        fillAnswerZhuyin: 'ㄧㄡˇ ˙ㄉㄜ ㄧㄡˇ ˙ㄉㄜ',
        fillChoices: ['有的⋯⋯有的', '雖然⋯⋯但是', '因為⋯⋯所以', '只要⋯⋯就'],
        reorderTarget: '下課鐘一響，操場上有的同學在跳繩，有的在踢足球，還有的在樹下聊天。',
        reorderTargetZhuyin:
          'ㄒㄧㄚˋ ㄎㄜˋ ㄓㄨㄥ ㄧ ㄒㄧㄤˇ ㄘㄠ ㄔㄤˇ ㄕㄤˋ ㄧㄡˇ ˙ㄉㄜ ㄊㄨㄥˊ ㄒㄩㄝˊ ㄗㄞˋ ㄊㄧㄠˋ ㄕㄥˊ ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄊㄧ ㄗㄨˊ ㄑㄧㄡˊ ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄕㄨˋ ㄒㄧㄚˋ ㄌㄧㄠˊ ㄊㄧㄢ',
        reorderChunks: [
          '下課鐘一響，',
          '操場上有的同學在跳繩，',
          '有的在踢足球，',
          '還有的在樹下聊天。',
        ],
        reorderChunksZhuyin: [
          'ㄒㄧㄚˋ ㄎㄜˋ ㄓㄨㄥ ㄧ ㄒㄧㄤˇ',
          'ㄘㄠ ㄔㄤˇ ㄕㄤˋ ㄧㄡˇ ˙ㄉㄜ ㄊㄨㄥˊ ㄒㄩㄝˊ ㄗㄞˋ ㄊㄧㄠˋ ㄕㄥˊ',
          'ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄊㄧ ㄗㄨˊ ㄑㄧㄡˊ',
          'ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄕㄨˋ ㄒㄧㄚˋ ㄌㄧㄠˊ ㄊㄧㄢ',
        ],
        explanation:
          '連續使用三個結構相似的「有的⋯⋯，有的⋯⋯，還有的⋯⋯」排比，能把下課的熱鬧場面寫得栩栩如生。',
      },
      {
        id: 'zh-sp-t4-parallelism-2',
        category: 'rhetoric',
        patternLabel: '排比：有的⋯⋯有的⋯⋯還有的⋯⋯',
        englishBridge: 'Parallelism: describing colorful flowers in a spring garden',
        fillPrompt: '春天來了，花園裡（　　）花朵紅得像太陽，（　　）黃得像檸檬，還有的紫得像葡萄。',
        fillPromptZhuyin:
          'ㄔㄨㄣ ㄊㄧㄢ ㄌㄞˊ ˙ㄌㄜ ㄏㄨㄚ ㄩㄢˊ ㄌㄧˇ ㄏㄨㄚ ㄉㄨㄛˇ ㄏㄨㄥˊ ˙ㄉㄜ ㄒㄧㄤˋ ㄊㄞˋ ㄧㄤˊ ㄏㄨㄤˊ ˙ㄉㄜ ㄒㄧㄤˋ ㄋㄧㄥˊ ㄇㄥˊ ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ ㄗˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄆㄨˊ ˙ㄊㄠ',
        fillAnswer: '有的⋯⋯有的',
        fillAnswerZhuyin: 'ㄧㄡˇ ˙ㄉㄜ ㄧㄡˇ ˙ㄉㄜ',
        fillChoices: ['有的⋯⋯有的', '不但⋯⋯而且', '即使⋯⋯也', '無論⋯⋯都'],
        reorderTarget: '春天來了，花園裡有的花朵紅得像太陽，有的黃得像檸檬，還有的紫得像葡萄。',
        reorderTargetZhuyin:
          'ㄔㄨㄣ ㄊㄧㄢ ㄌㄞˊ ˙ㄌㄜ ㄏㄨㄚ ㄩㄢˊ ㄌㄧˇ ㄧㄡˇ ˙ㄉㄜ ㄏㄨㄚ ㄉㄨㄛˇ ㄏㄨㄥˊ ˙ㄉㄜ ㄒㄧㄤˋ ㄊㄞˋ ㄧㄤˊ ㄧㄡˇ ˙ㄉㄜ ㄏㄨㄤˊ ˙ㄉㄜ ㄒㄧㄤˋ ㄋㄧㄥˊ ㄇㄥˊ ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ ㄗˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄆㄨˊ ˙ㄊㄠ',
        reorderChunks: [
          '春天來了，',
          '花園裡有的花朵紅得像太陽，',
          '有的黃得像檸檬，',
          '還有的紫得像葡萄。',
        ],
        reorderChunksZhuyin: [
          'ㄔㄨㄣ ㄊㄧㄢ ㄌㄞˊ ˙ㄌㄜ',
          'ㄏㄨㄚ ㄩㄢˊ ㄌㄧˇ ㄧㄡˇ ˙ㄉㄜ ㄏㄨㄚ ㄉㄨㄛˇ ㄏㄨㄥˊ ˙ㄉㄜ ㄒㄧㄤˋ ㄊㄞˋ ㄧㄤˊ',
          'ㄧㄡˇ ˙ㄉㄜ ㄏㄨㄤˊ ˙ㄉㄜ ㄒㄧㄤˋ ㄋㄧㄥˊ ㄇㄥˊ',
          'ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ ㄗˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄆㄨˊ ˙ㄊㄠ',
        ],
        explanation:
          '同時結合排比與譬喻，用三種顏色呈現百花盛開的豐富層次。',
      },
      {
        id: 'zh-sp-t4-parallelism-3',
        category: 'rhetoric',
        patternLabel: '排比：有的⋯⋯有的⋯⋯有的⋯⋯',
        englishBridge: 'Parallelism: clouds shifting into three fun shapes',
        fillPrompt: '天上的白雲真會變魔術：有的像綿羊，有的像帆船，（　　）像張開翅膀的大老鷹。',
        fillPromptZhuyin:
          'ㄊㄧㄢ ㄕㄤˋ ˙ㄉㄜ ㄅㄞˊ ㄩㄣˊ ㄓㄣ ㄏㄨㄟˋ ㄅㄧㄢˋ ㄇㄛˊ ㄕㄨˋ ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄇㄧㄢˊ ㄧㄤˊ ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄈㄢˊ ㄔㄨㄢˊ ㄒㄧㄤˋ ㄓㄤ ㄎㄞ ㄔˋ ㄅㄤˇ ˙ㄉㄜ ㄉㄚˋ ㄌㄠˇ ㄧㄥ',
        fillAnswer: '有的',
        fillAnswerZhuyin: 'ㄧㄡˇ ˙ㄉㄜ',
        fillChoices: ['有的', '因為', '雖然', '只有'],
        reorderTarget: '天上的白雲真會變魔術：有的像綿羊，有的像帆船，有的像張開翅膀的大老鷹。',
        reorderTargetZhuyin:
          'ㄊㄧㄢ ㄕㄤˋ ˙ㄉㄜ ㄅㄞˊ ㄩㄣˊ ㄓㄣ ㄏㄨㄟˋ ㄅㄧㄢˋ ㄇㄛˊ ㄕㄨˋ ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄇㄧㄢˊ ㄧㄤˊ ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄈㄢˊ ㄔㄨㄢˊ ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄓㄤ ㄎㄞ ㄔˋ ㄅㄤˇ ˙ㄉㄜ ㄉㄚˋ ㄌㄠˇ ㄧㄥ',
        reorderChunks: [
          '天上的白雲',
          '真會變魔術：',
          '有的像綿羊，有的像帆船，',
          '有的像張開翅膀的大老鷹。',
        ],
        reorderChunksZhuyin: [
          'ㄊㄧㄢ ㄕㄤˋ ˙ㄉㄜ ㄅㄞˊ ㄩㄣˊ',
          'ㄓㄣ ㄏㄨㄟˋ ㄅㄧㄢˋ ㄇㄛˊ ㄕㄨˋ',
          'ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄇㄧㄢˊ ㄧㄤˊ ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄈㄢˊ ㄔㄨㄢˊ',
          'ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄤˋ ㄓㄤ ㄎㄞ ㄔˋ ㄅㄤˇ ˙ㄉㄜ ㄉㄚˋ ㄌㄠˇ ㄧㄥ',
        ],
        explanation:
          '排比修辭通常需要三個結構整齊的短句，補上第三個「有的」就能完成節奏感滿滿的三連排比！',
      },
      {
        id: 'zh-sp-t4-parallelism-4',
        category: 'rhetoric',
        patternLabel: '排比：愛⋯⋯愛⋯⋯更愛⋯⋯',
        englishBridge: 'Parallelism: I love spring..., love summer..., and love autumn even more',
        fillPrompt: '我愛春天的微風，愛夏天的海浪，（　　）秋天的涼爽星空。',
        fillPromptZhuyin:
          'ㄨㄛˇ ㄞˋ ㄔㄨㄣ ㄊㄧㄢ ˙ㄉㄜ ㄨㄟˊ ㄈㄥ ㄞˋ ㄒㄧㄚˋ ㄊㄧㄢ ˙ㄉㄜ ㄏㄞˇ ㄌㄤˋ ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ ㄌㄧㄤˊ ㄕㄨㄤˇ ㄒㄧㄥ ㄎㄨㄥ',
        fillAnswer: '更愛',
        fillAnswerZhuyin: 'ㄍㄥˋ ㄞˋ',
        fillChoices: ['更愛', '雖然', '因為', '既然'],
        reorderTarget: '我愛春天的微風，愛夏天的海浪，更愛秋天的涼爽星空。',
        reorderTargetZhuyin:
          'ㄨㄛˇ ㄞˋ ㄔㄨㄣ ㄊㄧㄢ ˙ㄉㄜ ㄨㄟˊ ㄈㄥ ㄞˋ ㄒㄧㄚˋ ㄊㄧㄢ ˙ㄉㄜ ㄏㄞˇ ㄌㄤˋ ㄍㄥˋ ㄞˋ ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ ㄌㄧㄤˊ ㄕㄨㄤˇ ㄒㄧㄥ ㄎㄨㄥ',
        reorderChunks: [
          '我愛春天的微風，',
          '愛夏天的海浪，',
          '更愛秋天的',
          '涼爽星空。',
        ],
        reorderChunksZhuyin: [
          'ㄨㄛˇ ㄞˋ ㄔㄨㄣ ㄊㄧㄢ ˙ㄉㄜ ㄨㄟˊ ㄈㄥ',
          'ㄞˋ ㄒㄧㄚˋ ㄊㄧㄢ ˙ㄉㄜ ㄏㄞˇ ㄌㄤˋ',
          'ㄍㄥˋ ㄞˋ ㄑㄧㄡ ㄊㄧㄢ ˙ㄉㄜ',
          'ㄌㄧㄤˊ ㄕㄨㄤˇ ㄒㄧㄥ ㄎㄨㄥ',
        ],
        explanation:
          '用「愛⋯⋯，愛⋯⋯，更愛⋯⋯」組成三段遞進式排比，讓情感一層比一層更強烈。',
      },
      {
        id: 'zh-sp-t4-parallelism-5',
        category: 'rhetoric',
        patternLabel: '排比：有的⋯⋯有的⋯⋯還有的⋯⋯',
        englishBridge: 'Parallelism: a lively weekend park full of activities',
        fillPrompt: '週末的公園真熱鬧，草地上（　　）小朋友在放風箏，有的在吹泡泡，（　　）在樹下野餐。',
        fillPromptZhuyin:
          'ㄓㄡ ㄇㄛˋ ˙ㄉㄜ ㄍㄨㄥ ㄩㄢˊ ㄓㄣ ㄖㄜˋ ˙ㄋㄠ ㄘㄠˇ ㄉㄧˋ ㄕㄤˋ ㄒㄧㄠˇ ㄆㄥˊ ˙ㄧㄡ ㄗㄞˋ ㄈㄤˋ ㄈㄥ ㄓㄥ ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄔㄨㄟ ㄆㄠˋ ˙ㄆㄠ ㄗㄞˋ ㄕㄨˋ ㄒㄧㄚˋ ㄧㄝˇ ㄘㄢ',
        fillAnswer: '有的⋯⋯還有的',
        fillAnswerZhuyin: 'ㄧㄡˇ ˙ㄉㄜ ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ',
        fillChoices: ['有的⋯⋯還有的', '只要⋯⋯就', '如果⋯⋯就', '既然⋯⋯就'],
        reorderTarget: '週末的公園真熱鬧，草地上有的小朋友在放風箏，有的在吹泡泡，還有的在樹下野餐。',
        reorderTargetZhuyin:
          'ㄓㄡ ㄇㄛˋ ˙ㄉㄜ ㄍㄨㄥ ㄩㄢˊ ㄓㄣ ㄖㄜˋ ˙ㄋㄠ ㄘㄠˇ ㄉㄧˋ ㄕㄤˋ ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄆㄥˊ ˙ㄧㄡ ㄗㄞˋ ㄈㄤˋ ㄈㄥ ㄓㄥ ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄔㄨㄟ ㄆㄠˋ ˙ㄆㄠ ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄕㄨˋ ㄒㄧㄚˋ ㄧㄝˇ ㄘㄢ',
        reorderChunks: [
          '週末的公園真熱鬧，',
          '草地上有的小朋友在放風箏，',
          '有的在吹泡泡，',
          '還有的在樹下野餐。',
        ],
        reorderChunksZhuyin: [
          'ㄓㄡ ㄇㄛˋ ˙ㄉㄜ ㄍㄨㄥ ㄩㄢˊ ㄓㄣ ㄖㄜˋ ˙ㄋㄠ',
          'ㄘㄠˇ ㄉㄧˋ ㄕㄤˋ ㄧㄡˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄆㄥˊ ˙ㄧㄡ ㄗㄞˋ ㄈㄤˋ ㄈㄥ ㄓㄥ',
          'ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄔㄨㄟ ㄆㄠˋ ˙ㄆㄠ',
          'ㄏㄞˊ ㄧㄡˇ ˙ㄉㄜ ㄗㄞˋ ㄕㄨˋ ㄒㄧㄚˋ ㄧㄝˇ ㄘㄢ',
        ],
        explanation:
          '以「有的⋯⋯，有的⋯⋯，還有的⋯⋯」串起公園裡三組畫面，讀起來節奏明快又充滿生活感。',
      },
    ],
  },
];

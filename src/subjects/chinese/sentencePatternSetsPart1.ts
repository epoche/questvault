import type { SentencePatternSet } from './sentencePatternTypes';

/**
 * Chinese Sentence Pattern Builder (句型與修辭大挑戰) — Part 1 (Tiers 1–2)
 * 8 Sets × 5 Unique Items = 40 Items.
 * 100% Taiwan MOE Standard Traditional Chinese & 1-to-1 aligned Zhuyin.
 */
export const SENTENCE_PATTERN_SETS_PART1: SentencePatternSet[] = [
  // =========================================================================
  // TIER 1 · 基礎句型與高頻關聯詞 (4 Sets, 20 Items)
  // =========================================================================
  {
    id: 'zh-sp-t1-cause',
    tier: 1,
    category: 'conjunction',
    title: '因果小偵探',
    subtitle: '找出事情的原因和結果，學會用「因為⋯⋯所以⋯⋯」把理由說清楚！',
    patternBadge: '因為⋯⋯所以⋯⋯',
    emblemCollectibleId: 'critter-sprout-bunny',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    items: [
      {
        id: 'zh-sp-t1-cause-1',
        category: 'conjunction',
        patternLabel: '因為⋯⋯所以⋯⋯',
        englishBridge: 'Because ... therefore ... (Cause → Effect)',
        fillPrompt: '（　　）今天下起大雨，（　　）體育課改在禮堂上課。',
        fillPromptZhuyin:
          'ㄐㄧㄣ ㄊㄧㄢ ㄒㄧㄚˋ ㄑㄧˇ ㄉㄚˋ ㄩˇ ㄊㄧˇ ㄩˋ ㄎㄜˋ ㄍㄞˇ ㄗㄞˋ ㄌㄧˇ ㄊㄤˊ ㄕㄤˋ ㄎㄜˋ',
        fillAnswer: '因為⋯⋯所以',
        fillAnswerZhuyin: 'ㄧㄣ ㄨㄟˋ ㄙㄨㄛˇ ㄧˇ',
        fillChoices: ['因為⋯⋯所以', '雖然⋯⋯但是', '一邊⋯⋯一邊', '不是⋯⋯就是'],
        reorderTarget: '因為今天下起大雨，所以體育課改在禮堂上課。',
        reorderTargetZhuyin:
          'ㄧㄣ ㄨㄟˋ ㄐㄧㄣ ㄊㄧㄢ ㄒㄧㄚˋ ㄑㄧˇ ㄉㄚˋ ㄩˇ ㄙㄨㄛˇ ㄧˇ ㄊㄧˇ ㄩˋ ㄎㄜˋ ㄍㄞˇ ㄗㄞˋ ㄌㄧˇ ㄊㄤˊ ㄕㄤˋ ㄎㄜˋ',
        reorderChunks: ['因為今天', '下起大雨，', '所以體育課', '改在禮堂上課。'],
        reorderChunksZhuyin: [
          'ㄧㄣ ㄨㄟˋ ㄐㄧㄣ ㄊㄧㄢ',
          'ㄒㄧㄚˋ ㄑㄧˇ ㄉㄚˋ ㄩˇ',
          'ㄙㄨㄛˇ ㄧˇ ㄊㄧˇ ㄩˋ ㄎㄜˋ',
          'ㄍㄞˇ ㄗㄞˋ ㄌㄧˇ ㄊㄤˊ ㄕㄤˋ ㄎㄜˋ',
        ],
        explanation:
          '「下起大雨」是原因，「改在禮堂上課」是結果，中文常用「因為⋯⋯所以⋯⋯」把因果關係連起來。',
      },
      {
        id: 'zh-sp-t1-cause-2',
        category: 'conjunction',
        patternLabel: '因為⋯⋯所以⋯⋯',
        englishBridge: 'Because ... so ... (Matching the result connector)',
        fillPrompt: '因為弟弟昨晚忘記充電，（　　）平板電腦今天開不了機。',
        fillPromptZhuyin:
          'ㄧㄣ ㄨㄟˋ ㄉㄧˋ ˙ㄉㄧ ㄗㄨㄛˊ ㄨㄢˇ ㄨㄤˋ ㄐㄧˋ ㄔㄨㄥ ㄉㄧㄢˋ ㄆㄧㄥˊ ㄅㄢˇ ㄉㄧㄢˋ ㄋㄠˇ ㄐㄧㄣ ㄊㄧㄢ ㄎㄞ ㄅㄨˋ ㄌㄧㄠˇ ㄐㄧ',
        fillAnswer: '所以',
        fillAnswerZhuyin: 'ㄙㄨㄛˇ ㄧˇ',
        fillChoices: ['所以', '但是', '而且', '或者'],
        reorderTarget: '因為弟弟昨晚忘記充電，所以平板電腦今天開不了機。',
        reorderTargetZhuyin:
          'ㄧㄣ ㄨㄟˋ ㄉㄧˋ ˙ㄉㄧ ㄗㄨㄛˊ ㄨㄢˇ ㄨㄤˋ ㄐㄧˋ ㄔㄨㄥ ㄉㄧㄢˋ ㄙㄨㄛˇ ㄧˇ ㄆㄧㄥˊ ㄅㄢˇ ㄉㄧㄢˋ ㄋㄠˇ ㄐㄧㄣ ㄊㄧㄢ ㄎㄞ ㄅㄨˋ ㄌㄧㄠˇ ㄐㄧ',
        reorderChunks: ['因為弟弟', '昨晚忘記充電，', '所以平板電腦', '今天開不了機。'],
        reorderChunksZhuyin: [
          'ㄧㄣ ㄨㄟˋ ㄉㄧˋ ˙ㄉㄧ',
          'ㄗㄨㄛˊ ㄨㄢˇ ㄨㄤˋ ㄐㄧˋ ㄔㄨㄥ ㄉㄧㄢˋ',
          'ㄙㄨㄛˇ ㄧˇ ㄆㄧㄥˊ ㄅㄢˇ ㄉㄧㄢˋ ㄋㄠˇ',
          'ㄐㄧㄣ ㄊㄧㄢ ㄎㄞ ㄅㄨˋ ㄌㄧㄠˇ ㄐㄧ',
        ],
        explanation:
          '前半句已經有「因為」說明原因，後半句就要搭配「所以」來引出自然發生的結果！',
      },
      {
        id: 'zh-sp-t1-cause-3',
        category: 'conjunction',
        patternLabel: '因為⋯⋯所以⋯⋯',
        englishBridge: 'Because ... so ... (Introducing the cause)',
        fillPrompt: '（　　）小狗在泥巴裡打滾，所以全身沾滿了灰土。',
        fillPromptZhuyin:
          'ㄒㄧㄠˇ ㄍㄡˇ ㄗㄞˋ ㄋㄧˊ ㄅㄚ ㄌㄧˇ ㄉㄚˇ ㄍㄨㄣˇ ㄙㄨㄛˇ ㄧˇ ㄑㄩㄢˊ ㄕㄣ ㄓㄢ ㄇㄢˇ ˙ㄌㄜ ㄏㄨㄟ ㄊㄨˇ',
        fillAnswer: '因為',
        fillAnswerZhuyin: 'ㄧㄣ ㄨㄟˋ',
        fillChoices: ['因為', '雖然', '不但', '還是'],
        reorderTarget: '因為小狗在泥巴裡打滾，所以全身沾滿了灰土。',
        reorderTargetZhuyin:
          'ㄧㄣ ㄨㄟˋ ㄒㄧㄠˇ ㄍㄡˇ ㄗㄞˋ ㄋㄧˊ ㄅㄚ ㄌㄧˇ ㄉㄚˇ ㄍㄨㄣˇ ㄙㄨㄛˇ ㄧˇ ㄑㄩㄢˊ ㄕㄣ ㄓㄢ ㄇㄢˇ ˙ㄌㄜ ㄏㄨㄟ ㄊㄨˇ',
        reorderChunks: ['因為小狗', '在泥巴裡打滾，', '所以全身', '沾滿了灰土。'],
        reorderChunksZhuyin: [
          'ㄧㄣ ㄨㄟˋ ㄒㄧㄠˇ ㄍㄡˇ',
          'ㄗㄞˋ ㄋㄧˊ ㄅㄚ ㄌㄧˇ ㄉㄚˇ ㄍㄨㄣˇ',
          'ㄙㄨㄛˇ ㄧˇ ㄑㄩㄢˊ ㄕㄣ',
          'ㄓㄢ ㄇㄢˇ ˙ㄌㄜ ㄏㄨㄟ ㄊㄨˇ',
        ],
        explanation:
          '後半句出現了「所以」，前半句就要填入「因為」，點出全身變髒的原因。',
      },
      {
        id: 'zh-sp-t1-cause-4',
        category: 'conjunction',
        patternLabel: '因為⋯⋯所以⋯⋯',
        englishBridge: 'Because ... therefore ... (Effort → Achievement)',
        fillPrompt: '（　　）姊姊每天認真練琴，（　　）她在音樂比賽拿到第一名。',
        fillPromptZhuyin:
          'ㄐㄧㄝˇ ˙ㄐㄧㄝ ㄇㄟˇ ㄊㄧㄢ ㄖㄣˋ ㄓㄣ ㄌㄧㄢˋ ㄑㄧㄣˊ ㄊㄚ ㄗㄞˋ ㄧㄣ ㄩㄝˋ ㄅㄧˇ ㄙㄞˋ ㄋㄚˊ ㄉㄠˋ ㄉㄧˋ ㄧ ㄇㄧㄥˊ',
        fillAnswer: '因為⋯⋯所以',
        fillAnswerZhuyin: 'ㄧㄣ ㄨㄟˋ ㄙㄨㄛˇ ㄧˇ',
        fillChoices: ['因為⋯⋯所以', '雖然⋯⋯但是', '不是⋯⋯就是', '一邊⋯⋯一邊'],
        reorderTarget: '因為姊姊每天認真練琴，所以她在音樂比賽拿到第一名。',
        reorderTargetZhuyin:
          'ㄧㄣ ㄨㄟˋ ㄐㄧㄝˇ ˙ㄐㄧㄝ ㄇㄟˇ ㄊㄧㄢ ㄖㄣˋ ㄓㄣ ㄌㄧㄢˋ ㄑㄧㄣˊ ㄙㄨㄛˇ ㄧˇ ㄊㄚ ㄗㄞˋ ㄧㄣ ㄩㄝˋ ㄅㄧˇ ㄙㄞˋ ㄋㄚˊ ㄉㄠˋ ㄉㄧˋ ㄧ ㄇㄧㄥˊ',
        reorderChunks: ['因為姊姊', '每天認真練琴，', '所以她在音樂比賽', '拿到第一名。'],
        reorderChunksZhuyin: [
          'ㄧㄣ ㄨㄟˋ ㄐㄧㄝˇ ˙ㄐㄧㄝ',
          'ㄇㄟˇ ㄊㄧㄢ ㄖㄣˋ ㄓㄣ ㄌㄧㄢˋ ㄑㄧㄣˊ',
          'ㄙㄨㄛˇ ㄧˇ ㄊㄚ ㄗㄞˋ ㄧㄣ ㄩㄝˋ ㄅㄧˇ ㄙㄞˋ',
          'ㄋㄚˊ ㄉㄠˋ ㄉㄧˋ ㄧ ㄇㄧㄥˊ',
        ],
        explanation:
          '「每天認真練琴」帶來了「拿到第一名」的好結果，最適合用因果關聯詞「因為⋯⋯所以⋯⋯」。',
      },
      {
        id: 'zh-sp-t1-cause-5',
        category: 'conjunction',
        patternLabel: '因為⋯⋯所以⋯⋯',
        englishBridge: 'Because ... so ... (Reason → Popular outcome)',
        fillPrompt: '因為這家店的奶茶很香甜，（　　）門口總是排滿了客人。',
        fillPromptZhuyin:
          'ㄧㄣ ㄨㄟˋ ㄓㄜˋ ㄐㄧㄚ ㄉㄧㄢˋ ˙ㄉㄜ ㄋㄞˇ ㄔㄚˊ ㄏㄣˇ ㄒㄧㄤ ㄊㄧㄢˊ ㄇㄣˊ ㄎㄡˇ ㄗㄨㄥˇ ㄕˋ ㄆㄞˊ ㄇㄢˇ ˙ㄌㄜ ㄎㄜˋ ㄖㄣˊ',
        fillAnswer: '所以',
        fillAnswerZhuyin: 'ㄙㄨㄛˇ ㄧˇ',
        fillChoices: ['所以', '但是', '一邊', '不是'],
        reorderTarget: '因為這家店的奶茶很香甜，所以門口總是排滿了客人。',
        reorderTargetZhuyin:
          'ㄧㄣ ㄨㄟˋ ㄓㄜˋ ㄐㄧㄚ ㄉㄧㄢˋ ˙ㄉㄜ ㄋㄞˇ ㄔㄚˊ ㄏㄣˇ ㄒㄧㄤ ㄊㄧㄢˊ ㄙㄨㄛˇ ㄧˇ ㄇㄣˊ ㄎㄡˇ ㄗㄨㄥˇ ㄕˋ ㄆㄞˊ ㄇㄢˇ ˙ㄌㄜ ㄎㄜˋ ㄖㄣˊ',
        reorderChunks: ['因為這家店的', '奶茶很香甜，', '所以門口總是', '排滿了客人。'],
        reorderChunksZhuyin: [
          'ㄧㄣ ㄨㄟˋ ㄓㄜˋ ㄐㄧㄚ ㄉㄧㄢˋ ˙ㄉㄜ',
          'ㄋㄞˇ ㄔㄚˊ ㄏㄣˇ ㄒㄧㄤ ㄊㄧㄢˊ',
          'ㄙㄨㄛˇ ㄧˇ ㄇㄣˊ ㄎㄡˇ ㄗㄨㄥˇ ㄕˋ',
          'ㄆㄞˊ ㄇㄢˇ ˙ㄌㄜ ㄎㄜˋ ㄖㄣˊ',
        ],
        explanation:
          '「奶茶很香甜」是吸引大家排隊的原因，搭配「所以」就能把因果順暢地接起來！',
      },
    ],
  },
  {
    id: 'zh-sp-t1-sequence',
    tier: 1,
    category: 'structure',
    title: '動作連連看',
    subtitle: '掌握先後順序「先⋯⋯再⋯⋯」和立刻發生的「一⋯⋯就⋯⋯」！',
    patternBadge: '先⋯⋯再⋯⋯ / 一⋯⋯就⋯⋯',
    emblemCollectibleId: 'sweet-honey-toast',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    items: [
      {
        id: 'zh-sp-t1-sequence-1',
        category: 'structure',
        patternLabel: '先⋯⋯再⋯⋯',
        englishBridge: 'First ... then ... (Step-by-step order)',
        fillPrompt: '回到家以後，我（　　）洗手，（　　）吃桌上的水果。',
        fillPromptZhuyin:
          'ㄏㄨㄟˊ ㄉㄠˋ ㄐㄧㄚ ㄧˇ ㄏㄡˋ ㄨㄛˇ ㄒㄧˇ ㄕㄡˇ ㄔ ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄕㄨㄟˇ ㄍㄨㄛˇ',
        fillAnswer: '先⋯⋯再',
        fillAnswerZhuyin: 'ㄒㄧㄢ ㄗㄞˋ',
        fillChoices: ['先⋯⋯再', '雖然⋯⋯但是', '因為⋯⋯所以', '不是⋯⋯就是'],
        reorderTarget: '回到家以後，我先洗手，再吃桌上的水果。',
        reorderTargetZhuyin:
          'ㄏㄨㄟˊ ㄉㄠˋ ㄐㄧㄚ ㄧˇ ㄏㄡˋ ㄨㄛˇ ㄒㄧㄢ ㄒㄧˇ ㄕㄡˇ ㄗㄞˋ ㄔ ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄕㄨㄟˇ ㄍㄨㄛˇ',
        reorderChunks: ['回到家以後，', '我先洗手，', '再吃', '桌上的水果。'],
        reorderChunksZhuyin: [
          'ㄏㄨㄟˊ ㄉㄠˋ ㄐㄧㄚ ㄧˇ ㄏㄡˋ',
          'ㄨㄛˇ ㄒㄧㄢ ㄒㄧˇ ㄕㄡˇ',
          'ㄗㄞˋ ㄔ',
          'ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄕㄨㄟˇ ㄍㄨㄛˇ',
        ],
        explanation:
          '表達兩個動作有明確的先後步驟時，用「先⋯⋯再⋯⋯」最清楚，注意「再」不是「在」喔！',
      },
      {
        id: 'zh-sp-t1-sequence-2',
        category: 'structure',
        patternLabel: '先⋯⋯再⋯⋯',
        englishBridge: 'First ... and then ... (Sequential actions)',
        fillPrompt: '老師提醒大家先仔細讀題目，（　　）動筆寫下答案。',
        fillPromptZhuyin:
          'ㄌㄠˇ ㄕ ㄊㄧˊ ㄒㄧㄥˇ ㄉㄚˋ ㄐㄧㄚ ㄒㄧㄢ ㄗˇ ㄒㄧˋ ㄉㄨˊ ㄊㄧˊ ㄇㄨˋ ㄉㄨㄥˋ ㄅㄧˇ ㄒㄧㄝˇ ㄒㄧㄚˋ ㄉㄚˊ ㄢˋ',
        fillAnswer: '再',
        fillAnswerZhuyin: 'ㄗㄞˋ',
        fillChoices: ['再', '被', '雖然', '但是'],
        reorderTarget: '老師提醒大家先仔細讀題目，再動筆寫下答案。',
        reorderTargetZhuyin:
          'ㄌㄠˇ ㄕ ㄊㄧˊ ㄒㄧㄥˇ ㄉㄚˋ ㄐㄧㄚ ㄒㄧㄢ ㄗˇ ㄒㄧˋ ㄉㄨˊ ㄊㄧˊ ㄇㄨˋ ㄗㄞˋ ㄉㄨㄥˋ ㄅㄧˇ ㄒㄧㄝˇ ㄒㄧㄚˋ ㄉㄚˊ ㄢˋ',
        reorderChunks: ['老師提醒大家', '先仔細讀題目，', '再動筆', '寫下答案。'],
        reorderChunksZhuyin: [
          'ㄌㄠˇ ㄕ ㄊㄧˊ ㄒㄧㄥˇ ㄉㄚˋ ㄐㄧㄚ',
          'ㄒㄧㄢ ㄗˇ ㄒㄧˋ ㄉㄨˊ ㄊㄧˊ ㄇㄨˋ',
          'ㄗㄞˋ ㄉㄨㄥˋ ㄅㄧˇ',
          'ㄒㄧㄝˇ ㄒㄧㄚˋ ㄉㄚˊ ㄢˋ',
        ],
        explanation:
          '前面有「先」代表第一個步驟，接著用「再」連接第二個步驟：先讀題目，再寫答案！',
      },
      {
        id: 'zh-sp-t1-sequence-3',
        category: 'structure',
        patternLabel: '先⋯⋯再⋯⋯',
        englishBridge: 'First ... then ... (Baking steps)',
        fillPrompt: '烤餅乾時，我們（　　）切出形狀，（　　）放進烤箱烤熟。',
        fillPromptZhuyin:
          'ㄎㄠˇ ㄅㄧㄥˇ ㄍㄢ ㄕˊ ㄨㄛˇ ˙ㄇㄣ ㄑㄧㄝ ㄔㄨ ㄒㄧㄥˊ ㄓㄨㄤˋ ㄈㄤˋ ㄐㄧㄣˋ ㄎㄠˇ ㄒㄧㄤ ㄎㄠˇ ㄕㄨˊ',
        fillAnswer: '先⋯⋯再',
        fillAnswerZhuyin: 'ㄒㄧㄢ ㄗㄞˋ',
        fillChoices: ['先⋯⋯再', '因為⋯⋯所以', '雖然⋯⋯但是', '又⋯⋯又'],
        reorderTarget: '烤餅乾時，我們先切出形狀，再放進烤箱烤熟。',
        reorderTargetZhuyin:
          'ㄎㄠˇ ㄅㄧㄥˇ ㄍㄢ ㄕˊ ㄨㄛˇ ˙ㄇㄣ ㄒㄧㄢ ㄑㄧㄝ ㄔㄨ ㄒㄧㄥˊ ㄓㄨㄤˋ ㄗㄞˋ ㄈㄤˋ ㄐㄧㄣˋ ㄎㄠˇ ㄒㄧㄤ ㄎㄠˇ ㄕㄨˊ',
        reorderChunks: ['烤餅乾時，', '我們先切出形狀，', '再放進烤箱', '烤熟。'],
        reorderChunksZhuyin: [
          'ㄎㄠˇ ㄅㄧㄥˇ ㄍㄢ ㄕˊ',
          'ㄨㄛˇ ˙ㄇㄣ ㄒㄧㄢ ㄑㄧㄝ ㄔㄨ ㄒㄧㄥˊ ㄓㄨㄤˋ',
          'ㄗㄞˋ ㄈㄤˋ ㄐㄧㄣˋ ㄎㄠˇ ㄒㄧㄤ',
          'ㄎㄠˇ ㄕㄨˊ',
        ],
        explanation:
          '做料理和烘焙都有固定步驟，用「先⋯⋯再⋯⋯」就能有條理地說出先後順序。',
      },
      {
        id: 'zh-sp-t1-sequence-4',
        category: 'structure',
        patternLabel: '一⋯⋯就⋯⋯',
        englishBridge: 'As soon as ... immediately ... (Instant reaction)',
        fillPrompt: '下課鐘聲（　　）響，同學們（　　）開心地衝向操場。',
        fillPromptZhuyin:
          'ㄒㄧㄚˋ ㄎㄜˋ ㄓㄨㄥ ㄕㄥ ㄒㄧㄤˇ ㄊㄨㄥˊ ㄒㄩㄝˊ ˙ㄇㄣ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄔㄨㄥ ㄒㄧㄤˋ ㄘㄠ ㄔㄤˇ',
        fillAnswer: '一⋯⋯就',
        fillAnswerZhuyin: 'ㄧ ㄐㄧㄡˋ',
        fillChoices: ['一⋯⋯就', '雖然⋯⋯但是', '不是⋯⋯就是', '不但⋯⋯而且'],
        reorderTarget: '下課鐘聲一響，同學們就開心地衝向操場。',
        reorderTargetZhuyin:
          'ㄒㄧㄚˋ ㄎㄜˋ ㄓㄨㄥ ㄕㄥ ㄧ ㄒㄧㄤˇ ㄊㄨㄥˊ ㄒㄩㄝˊ ˙ㄇㄣ ㄐㄧㄡˋ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄔㄨㄥ ㄒㄧㄤˋ ㄘㄠ ㄔㄤˇ',
        reorderChunks: ['下課鐘聲一響，', '同學們就', '開心地', '衝向操場。'],
        reorderChunksZhuyin: [
          'ㄒㄧㄚˋ ㄎㄜˋ ㄓㄨㄥ ㄕㄥ ㄧ ㄒㄧㄤˇ',
          'ㄊㄨㄥˊ ㄒㄩㄝˊ ˙ㄇㄣ ㄐㄧㄡˋ',
          'ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ',
          'ㄔㄨㄥ ㄒㄧㄤˋ ㄘㄠ ㄔㄤˇ',
        ],
        explanation:
          '「一⋯⋯就⋯⋯」表示第一件事剛發生，第二件事馬上緊接著發生，節奏超級快！',
      },
      {
        id: 'zh-sp-t1-sequence-5',
        category: 'structure',
        patternLabel: '一⋯⋯就⋯⋯',
        englishBridge: 'The moment ... right away ... (Instant reaction)',
        fillPrompt: '小貓一聽見開罐頭的聲音，（　　）立刻從沙發上跳下來。',
        fillPromptZhuyin:
          'ㄒㄧㄠˇ ㄇㄠ ㄧ ㄊㄧㄥ ㄐㄧㄢˋ ㄎㄞ ㄍㄨㄢˋ ˙ㄊㄡ ˙ㄉㄜ ㄕㄥ ㄧㄣ ㄌㄧˋ ㄎㄜˋ ㄘㄨㄥˊ ㄕㄚ ㄈㄚ ㄕㄤˋ ㄊㄧㄠˋ ㄒㄧㄚˋ ㄌㄞˊ',
        fillAnswer: '就',
        fillAnswerZhuyin: 'ㄐㄧㄡˋ',
        fillChoices: ['就', '把', '雖然', '還是'],
        reorderTarget: '小貓一聽見開罐頭的聲音，就立刻從沙發上跳下來。',
        reorderTargetZhuyin:
          'ㄒㄧㄠˇ ㄇㄠ ㄧ ㄊㄧㄥ ㄐㄧㄢˋ ㄎㄞ ㄍㄨㄢˋ ˙ㄊㄡ ˙ㄉㄜ ㄕㄥ ㄧㄣ ㄐㄧㄡˋ ㄌㄧˋ ㄎㄜˋ ㄘㄨㄥˊ ㄕㄚ ㄈㄚ ㄕㄤˋ ㄊㄧㄠˋ ㄒㄧㄚˋ ㄌㄞˊ',
        reorderChunks: ['小貓一聽見', '開罐頭的聲音，', '就立刻從沙發上', '跳下來。'],
        reorderChunksZhuyin: [
          'ㄒㄧㄠˇ ㄇㄠ ㄧ ㄊㄧㄥ ㄐㄧㄢˋ',
          'ㄎㄞ ㄍㄨㄢˋ ˙ㄊㄡ ˙ㄉㄜ ㄕㄥ ㄧㄣ',
          'ㄐㄧㄡˋ ㄌㄧˋ ㄎㄜˋ ㄘㄨㄥˊ ㄕㄚ ㄈㄚ ㄕㄤˋ',
          'ㄊㄧㄠˋ ㄒㄧㄚˋ ㄌㄞˊ',
        ],
        explanation:
          '前半句用了「一聽見」，後半句要配「就」來表現小貓馬上跳下來的敏捷反應！',
      },
    ],
  },
  {
    id: 'zh-sp-t1-ba',
    tier: 1,
    category: 'structure',
    title: '神奇把字句',
    subtitle: '學會用「主詞＋把＋東西＋動作結果」清楚說出動作的影響！',
    patternBadge: '把字句',
    emblemCollectibleId: 'critter-red-panda',
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    items: [
      {
        id: 'zh-sp-t1-ba-1',
        category: 'structure',
        patternLabel: '把字句',
        englishBridge: 'Subject + 把 + Object + Verb + Result (Active disposal)',
        fillPrompt: '我已經（　　）明天的書包整理得整整齊齊。',
        fillPromptZhuyin:
          'ㄨㄛˇ ㄧˇ ㄐㄧㄥ ㄇㄧㄥˊ ㄊㄧㄢ ˙ㄉㄜ ㄕㄨ ㄅㄠ ㄓㄥˇ ㄌㄧˇ ˙ㄉㄜ ㄓㄥˇ ㄓㄥˇ ㄑㄧˊ ㄑㄧˊ',
        fillAnswer: '把',
        fillAnswerZhuyin: 'ㄅㄚˇ',
        fillChoices: ['把', '被', '因為', '但是'],
        reorderTarget: '我已經把明天的書包整理得整整齊齊。',
        reorderTargetZhuyin:
          'ㄨㄛˇ ㄧˇ ㄐㄧㄥ ㄅㄚˇ ㄇㄧㄥˊ ㄊㄧㄢ ˙ㄉㄜ ㄕㄨ ㄅㄠ ㄓㄥˇ ㄌㄧˇ ˙ㄉㄜ ㄓㄥˇ ㄓㄥˇ ㄑㄧˊ ㄑㄧˊ',
        reorderChunks: ['我已經', '把明天的書包', '整理得', '整整齊齊。'],
        reorderChunksZhuyin: [
          'ㄨㄛˇ ㄧˇ ㄐㄧㄥ',
          'ㄅㄚˇ ㄇㄧㄥˊ ㄊㄧㄢ ˙ㄉㄜ ㄕㄨ ㄅㄠ',
          'ㄓㄥˇ ㄌㄧˇ ˙ㄉㄜ',
          'ㄓㄥˇ ㄓㄥˇ ㄑㄧˊ ㄑㄧˊ',
        ],
        explanation:
          '主動對「書包」做出「整理得整整齊齊」的動作結果時，要用「把」字句，把受詞放在動詞前面！',
      },
      {
        id: 'zh-sp-t1-ba-2',
        category: 'structure',
        patternLabel: '把字句',
        englishBridge: 'Subject + 把 + Object + Verb + Result (Accidental action)',
        fillPrompt: '今天早上，弟弟不小心（　　）桌上的牛奶打翻了。',
        fillPromptZhuyin:
          'ㄐㄧㄣ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄉㄧˋ ˙ㄉㄧ ㄅㄨˋ ㄒㄧㄠˇ ㄒㄧㄣ ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄋㄧㄡˊ ㄋㄞˇ ㄉㄚˇ ㄈㄢ ˙ㄌㄜ',
        fillAnswer: '把',
        fillAnswerZhuyin: 'ㄅㄚˇ',
        fillChoices: ['把', '被', '雖然', '而且'],
        reorderTarget: '今天早上，弟弟不小心把桌上的牛奶打翻了。',
        reorderTargetZhuyin:
          'ㄐㄧㄣ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄉㄧˋ ˙ㄉㄧ ㄅㄨˋ ㄒㄧㄠˇ ㄒㄧㄣ ㄅㄚˇ ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄋㄧㄡˊ ㄋㄞˇ ㄉㄚˇ ㄈㄢ ˙ㄌㄜ',
        reorderChunks: ['今天早上，', '弟弟不小心', '把桌上的牛奶', '打翻了。'],
        reorderChunksZhuyin: [
          'ㄐㄧㄣ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ',
          'ㄉㄧˋ ˙ㄉㄧ ㄅㄨˋ ㄒㄧㄠˇ ㄒㄧㄣ',
          'ㄅㄚˇ ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄋㄧㄡˊ ㄋㄞˇ',
          'ㄉㄚˇ ㄈㄢ ˙ㄌㄜ',
        ],
        explanation:
          '這裡的主角「弟弟」是發出動作的人，「牛奶」是被打翻的東西，所以要用「把」而不是「被」。',
      },
      {
        id: 'zh-sp-t1-ba-3',
        category: 'structure',
        patternLabel: '把字句',
        englishBridge: 'Please + 把 + Object + put into + Place',
        fillPrompt: '請你先（　　）這張美術畫紙放進資料夾裡。',
        fillPromptZhuyin:
          'ㄑㄧㄥˇ ㄋㄧˇ ㄒㄧㄢ ㄓㄜˋ ㄓㄤ ㄇㄟˇ ㄕㄨˋ ㄏㄨㄚˋ ㄓˇ ㄈㄤˋ ㄐㄧㄣˋ ㄗ ㄌㄧㄠˋ ㄐㄧㄚˊ ㄌㄧˇ',
        fillAnswer: '把',
        fillAnswerZhuyin: 'ㄅㄚˇ',
        fillChoices: ['把', '被', '所以', '或者'],
        reorderTarget: '請你先把這張美術畫紙放進資料夾裡。',
        reorderTargetZhuyin:
          'ㄑㄧㄥˇ ㄋㄧˇ ㄒㄧㄢ ㄅㄚˇ ㄓㄜˋ ㄓㄤ ㄇㄟˇ ㄕㄨˋ ㄏㄨㄚˋ ㄓˇ ㄈㄤˋ ㄐㄧㄣˋ ㄗ ㄌㄧㄠˋ ㄐㄧㄚˊ ㄌㄧˇ',
        reorderChunks: ['請你先', '把這張美術畫紙', '放進', '資料夾裡。'],
        reorderChunksZhuyin: [
          'ㄑㄧㄥˇ ㄋㄧˇ ㄒㄧㄢ',
          'ㄅㄚˇ ㄓㄜˋ ㄓㄤ ㄇㄟˇ ㄕㄨˋ ㄏㄨㄚˋ ㄓˇ',
          'ㄈㄤˋ ㄐㄧㄣˋ',
          'ㄗ ㄌㄧㄠˋ ㄐㄧㄚˊ ㄌㄧˇ',
        ],
        explanation:
          '要把某個物品移動到特定位置（放進資料夾裡），中文一定要用「把＋物品＋放進＋地點」喔！',
      },
      {
        id: 'zh-sp-t1-ba-4',
        category: 'structure',
        patternLabel: '把字句',
        englishBridge: 'Subject + 把 + Object + ate all up',
        fillPrompt: '小熊貓開心地（　　）籃子裡的竹筍吃得精光。',
        fillPromptZhuyin:
          'ㄒㄧㄠˇ ㄒㄩㄥˊ ㄇㄠ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄌㄢˊ ˙ㄗ ㄌㄧˇ ˙ㄉㄜ ㄓㄨˊ ㄙㄨㄣˇ ㄔ ˙ㄉㄜ ㄐㄧㄥ ㄍㄨㄤ',
        fillAnswer: '把',
        fillAnswerZhuyin: 'ㄅㄚˇ',
        fillChoices: ['把', '被', '但是', '還是'],
        reorderTarget: '小熊貓開心地把籃子裡的竹筍吃得精光。',
        reorderTargetZhuyin:
          'ㄒㄧㄠˇ ㄒㄩㄥˊ ㄇㄠ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄅㄚˇ ㄌㄢˊ ˙ㄗ ㄌㄧˇ ˙ㄉㄜ ㄓㄨˊ ㄙㄨㄣˇ ㄔ ˙ㄉㄜ ㄐㄧㄥ ㄍㄨㄤ',
        reorderChunks: ['小熊貓開心地', '把籃子裡的', '竹筍', '吃得精光。'],
        reorderChunksZhuyin: [
          'ㄒㄧㄠˇ ㄒㄩㄥˊ ㄇㄠ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ',
          'ㄅㄚˇ ㄌㄢˊ ˙ㄗ ㄌㄧˇ ˙ㄉㄜ',
          'ㄓㄨˊ ㄙㄨㄣˇ',
          'ㄔ ˙ㄉㄜ ㄐㄧㄥ ㄍㄨㄤ',
        ],
        explanation:
          '小熊貓主動吃了竹筍，而且強調「吃得精光」的結果，用「把」字句最生動自然！',
      },
      {
        id: 'zh-sp-t1-ba-5',
        category: 'structure',
        patternLabel: '把字句',
        englishBridge: 'Subject + 把 + Object + pumped full of air',
        fillPrompt: '星期天早上，爸爸（　　）腳踏車的輪胎打滿了氣。',
        fillPromptZhuyin:
          'ㄒㄧㄥ ㄑㄧˊ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄅㄚˋ ˙ㄅㄚ ㄐㄧㄠˇ ㄊㄚˋ ㄔㄜ ˙ㄉㄜ ㄌㄨㄣˊ ㄊㄞ ㄉㄚˇ ㄇㄢˇ ˙ㄌㄜ ㄑㄧˋ',
        fillAnswer: '把',
        fillAnswerZhuyin: 'ㄅㄚˇ',
        fillChoices: ['把', '被', '因為', '雖然'],
        reorderTarget: '星期天早上，爸爸把腳踏車的輪胎打滿了氣。',
        reorderTargetZhuyin:
          'ㄒㄧㄥ ㄑㄧˊ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄅㄚˋ ˙ㄅㄚ ㄅㄚˇ ㄐㄧㄠˇ ㄊㄚˋ ㄔㄜ ˙ㄉㄜ ㄌㄨㄣˊ ㄊㄞ ㄉㄚˇ ㄇㄢˇ ˙ㄌㄜ ㄑㄧˋ',
        reorderChunks: ['星期天早上，', '爸爸', '把腳踏車的輪胎', '打滿了氣。'],
        reorderChunksZhuyin: [
          'ㄒㄧㄥ ㄑㄧˊ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ',
          'ㄅㄚˋ ˙ㄅㄚ',
          'ㄅㄚˇ ㄐㄧㄠˇ ㄊㄚˋ ㄔㄜ ˙ㄉㄜ ㄌㄨㄣˊ ㄊㄞ',
          'ㄉㄚˇ ㄇㄢˇ ˙ㄌㄜ ㄑㄧˋ',
        ],
        explanation:
          '「爸爸」對「輪胎」執行了「打滿了氣」的動作，讓輪胎狀態改變，正是標準的「把字句」！',
      },
    ],
  },
  {
    id: 'zh-sp-t1-parallel',
    tier: 1,
    category: 'conjunction',
    title: '快樂並列句',
    subtitle: '用「一邊⋯⋯一邊⋯⋯」描述同時做兩件事，用「又⋯⋯又⋯⋯」形容雙重特色！',
    patternBadge: '一邊⋯⋯一邊⋯⋯ / 又⋯⋯又⋯⋯',
    emblemCollectibleId: 'sweet-boba-bear',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    items: [
      {
        id: 'zh-sp-t1-parallel-1',
        category: 'conjunction',
        patternLabel: '一邊⋯⋯一邊⋯⋯',
        englishBridge: 'Doing A while doing B at the same time',
        fillPrompt: '妹妹（　　）聽輕快的音樂，（　　）畫彩色圖畫。',
        fillPromptZhuyin:
          'ㄇㄟˋ ˙ㄇㄟ ㄊㄧㄥ ㄑㄧㄥ ㄎㄨㄞˋ ˙ㄉㄜ ㄧㄣ ㄩㄝˋ ㄏㄨㄚˋ ㄘㄞˇ ㄙㄜˋ ㄊㄨˊ ㄏㄨㄚˋ',
        fillAnswer: '一邊⋯⋯一邊',
        fillAnswerZhuyin: 'ㄧ ㄅㄧㄢ ㄧ ㄅㄧㄢ',
        fillChoices: ['一邊⋯⋯一邊', '因為⋯⋯所以', '雖然⋯⋯但是', '即使⋯⋯也'],
        reorderTarget: '妹妹一邊聽輕快的音樂，一邊畫彩色圖畫。',
        reorderTargetZhuyin:
          'ㄇㄟˋ ˙ㄇㄟ ㄧ ㄅㄧㄢ ㄊㄧㄥ ㄑㄧㄥ ㄎㄨㄞˋ ˙ㄉㄜ ㄧㄣ ㄩㄝˋ ㄧ ㄅㄧㄢ ㄏㄨㄚˋ ㄘㄞˇ ㄙㄜˋ ㄊㄨˊ ㄏㄨㄚˋ',
        reorderChunks: ['妹妹', '一邊聽輕快的音樂，', '一邊畫', '彩色圖畫。'],
        reorderChunksZhuyin: [
          'ㄇㄟˋ ˙ㄇㄟ',
          'ㄧ ㄅㄧㄢ ㄊㄧㄥ ㄑㄧㄥ ㄎㄨㄞˋ ˙ㄉㄜ ㄧㄣ ㄩㄝˋ',
          'ㄧ ㄅㄧㄢ ㄏㄨㄚˋ',
          'ㄘㄞˇ ㄙㄜˋ ㄊㄨˊ ㄏㄨㄚˋ',
        ],
        explanation:
          '「聽音樂」和「畫圖畫」可以同時進行，用「一邊⋯⋯一邊⋯⋯」就能生動呈現一心二用的畫面！',
      },
      {
        id: 'zh-sp-t1-parallel-2',
        category: 'conjunction',
        patternLabel: '一邊⋯⋯一邊⋯⋯',
        englishBridge: 'While walking ... also admiring ...',
        fillPrompt: '大家在公園裡一邊散步，（　　）欣賞盛開的櫻花。',
        fillPromptZhuyin:
          'ㄉㄚˋ ㄐㄧㄚ ㄗㄞˋ ㄍㄨㄥ ㄩㄢˊ ㄌㄧˇ ㄧ ㄅㄧㄢ ㄙㄢˋ ㄅㄨˋ ㄒㄧㄣ ㄕㄤˇ ㄕㄥˋ ㄎㄞ ˙ㄉㄜ ㄧㄥ ㄏㄨㄚ',
        fillAnswer: '一邊',
        fillAnswerZhuyin: 'ㄧ ㄅㄧㄢ',
        fillChoices: ['一邊', '所以', '但是', '還是'],
        reorderTarget: '大家在公園裡一邊散步，一邊欣賞盛開的櫻花。',
        reorderTargetZhuyin:
          'ㄉㄚˋ ㄐㄧㄚ ㄗㄞˋ ㄍㄨㄥ ㄩㄢˊ ㄌㄧˇ ㄧ ㄅㄧㄢ ㄙㄢˋ ㄅㄨˋ ㄧ ㄅㄧㄢ ㄒㄧㄣ ㄕㄤˇ ㄕㄥˋ ㄎㄞ ˙ㄉㄜ ㄧㄥ ㄏㄨㄚ',
        reorderChunks: ['大家在公園裡', '一邊散步，', '一邊欣賞', '盛開的櫻花。'],
        reorderChunksZhuyin: [
          'ㄉㄚˋ ㄐㄧㄚ ㄗㄞˋ ㄍㄨㄥ ㄩㄢˊ ㄌㄧˇ',
          'ㄧ ㄅㄧㄢ ㄙㄢˋ ㄅㄨˋ',
          'ㄧ ㄅㄧㄢ ㄒㄧㄣ ㄕㄤˇ',
          'ㄕㄥˋ ㄎㄞ ˙ㄉㄜ ㄧㄥ ㄏㄨㄚ',
        ],
        explanation:
          '前半句出現了「一邊散步」，後半句成對使用「一邊」，表現散步和賞花同時發生！',
      },
      {
        id: 'zh-sp-t1-parallel-3',
        category: 'conjunction',
        patternLabel: '一邊⋯⋯一邊⋯⋯',
        englishBridge: 'Slicing strawberries while teaching how to make jam',
        fillPrompt: '外婆在廚房（　　）切新鮮草莓，（　　）教我做果醬。',
        fillPromptZhuyin:
          'ㄨㄞˋ ㄆㄛˊ ㄗㄞˋ ㄔㄨˊ ㄈㄤˊ ㄑㄧㄝ ㄒㄧㄣ ㄒㄧㄢ ㄘㄠˇ ㄇㄟˊ ㄐㄧㄠ ㄨㄛˇ ㄗㄨㄛˋ ㄍㄨㄛˇ ㄐㄧㄤˋ',
        fillAnswer: '一邊⋯⋯一邊',
        fillAnswerZhuyin: 'ㄧ ㄅㄧㄢ ㄧ ㄅㄧㄢ',
        fillChoices: ['一邊⋯⋯一邊', '雖然⋯⋯但是', '因為⋯⋯所以', '即使⋯⋯也'],
        reorderTarget: '外婆在廚房一邊切新鮮草莓，一邊教我做果醬。',
        reorderTargetZhuyin:
          'ㄨㄞˋ ㄆㄛˊ ㄗㄞˋ ㄔㄨˊ ㄈㄤˊ ㄧ ㄅㄧㄢ ㄑㄧㄝ ㄒㄧㄣ ㄒㄧㄢ ㄘㄠˇ ㄇㄟˊ ㄧ ㄅㄧㄢ ㄐㄧㄠ ㄨㄛˇ ㄗㄨㄛˋ ㄍㄨㄛˇ ㄐㄧㄤˋ',
        reorderChunks: ['外婆在廚房', '一邊切新鮮草莓，', '一邊教我', '做果醬。'],
        reorderChunksZhuyin: [
          'ㄨㄞˋ ㄆㄛˊ ㄗㄞˋ ㄔㄨˊ ㄈㄤˊ',
          'ㄧ ㄅㄧㄢ ㄑㄧㄝ ㄒㄧㄣ ㄒㄧㄢ ㄘㄠˇ ㄇㄟˊ',
          'ㄧ ㄅㄧㄢ ㄐㄧㄠ ㄨㄛˇ',
          'ㄗㄨㄛˋ ㄍㄨㄛˇ ㄐㄧㄤˋ',
        ],
        explanation:
          '外婆同時間在做「切草莓」和「教我做果醬」兩件事，用「一邊⋯⋯一邊⋯⋯」最貼切！',
      },
      {
        id: 'zh-sp-t1-parallel-4',
        category: 'conjunction',
        patternLabel: '又⋯⋯又⋯⋯',
        englishBridge: 'Both ... and ... (Two qualities together)',
        fillPrompt: '剛出爐的蜂蜜吐司（　　）香（　　）軟，大家都很喜歡。',
        fillPromptZhuyin:
          'ㄍㄤ ㄔㄨ ㄌㄨˊ ˙ㄉㄜ ㄈㄥ ㄇㄧˋ ㄊㄨˇ ㄙ ㄒㄧㄤ ㄖㄨㄢˇ ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄏㄣˇ ㄒㄧˇ ㄏㄨㄢ',
        fillAnswer: '又⋯⋯又',
        fillAnswerZhuyin: 'ㄧㄡˋ ㄧㄡˋ',
        fillChoices: ['又⋯⋯又', '因為⋯⋯所以', '雖然⋯⋯但是', '先⋯⋯再'],
        reorderTarget: '剛出爐的蜂蜜吐司又香又軟，大家都很喜歡。',
        reorderTargetZhuyin:
          'ㄍㄤ ㄔㄨ ㄌㄨˊ ˙ㄉㄜ ㄈㄥ ㄇㄧˋ ㄊㄨˇ ㄙ ㄧㄡˋ ㄒㄧㄤ ㄧㄡˋ ㄖㄨㄢˇ ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄏㄣˇ ㄒㄧˇ ㄏㄨㄢ',
        reorderChunks: ['剛出爐的', '蜂蜜吐司', '又香又軟，', '大家都很喜歡。'],
        reorderChunksZhuyin: [
          'ㄍㄤ ㄔㄨ ㄌㄨˊ ˙ㄉㄜ',
          'ㄈㄥ ㄇㄧˋ ㄊㄨˇ ㄙ',
          'ㄧㄡˋ ㄒㄧㄤ ㄧㄡˋ ㄖㄨㄢˇ',
          'ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄏㄣˇ ㄒㄧˇ ㄏㄨㄢ',
        ],
        explanation:
          '同時形容食物的兩種優點（「香」和「軟」），用「又⋯⋯又⋯⋯」簡短又有畫面感！',
      },
      {
        id: 'zh-sp-t1-parallel-5',
        category: 'conjunction',
        patternLabel: '又⋯⋯又⋯⋯',
        englishBridge: 'Both round and chubby (Paired adjectives)',
        fillPrompt: '這隻橘貓長得又圓（　　）胖，跑起來像一顆毛球。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄓ ㄐㄩˊ ㄇㄠ ㄓㄤˇ ˙ㄉㄜ ㄧㄡˋ ㄩㄢˊ ㄆㄤˋ ㄆㄠˇ ㄑㄧˇ ㄌㄞˊ ㄒㄧㄤˋ ㄧ ㄎㄜ ㄇㄠˊ ㄑㄧㄡˊ',
        fillAnswer: '又',
        fillAnswerZhuyin: 'ㄧㄡˋ',
        fillChoices: ['又', '把', '被', '才'],
        reorderTarget: '這隻橘貓長得又圓又胖，跑起來像一顆毛球。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄓ ㄐㄩˊ ㄇㄠ ㄓㄤˇ ˙ㄉㄜ ㄧㄡˋ ㄩㄢˊ ㄧㄡˋ ㄆㄤˋ ㄆㄠˇ ㄑㄧˇ ㄌㄞˊ ㄒㄧㄤˋ ㄧ ㄎㄜ ㄇㄠˊ ㄑㄧㄡˊ',
        reorderChunks: ['這隻橘貓', '長得又圓又胖，', '跑起來', '像一顆毛球。'],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄓ ㄐㄩˊ ㄇㄠ',
          'ㄓㄤˇ ˙ㄉㄜ ㄧㄡˋ ㄩㄢˊ ㄧㄡˋ ㄆㄤˋ',
          'ㄆㄠˇ ㄑㄧˇ ㄌㄞˊ',
          'ㄒㄧㄤˋ ㄧ ㄎㄜ ㄇㄠˊ ㄑㄧㄡˊ',
        ],
        explanation:
          '「又圓又胖」把兩個可愛的外型特徵並列在一起，記住「又」字要成對出現！',
      },
    ],
  },

  // =========================================================================
  // TIER 2 · 進階複句與被動結構 (4 Sets, 20 Items)
  // =========================================================================
  {
    id: 'zh-sp-t2-contrast',
    tier: 2,
    category: 'conjunction',
    title: '轉折大翻轉',
    subtitle: '學會用「雖然⋯⋯但是⋯⋯」說出出乎意料的轉折與堅持！',
    patternBadge: '雖然⋯⋯但是⋯⋯',
    emblemCollectibleId: 'critter-crystal-fox',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    items: [
      {
        id: 'zh-sp-t2-contrast-1',
        category: 'conjunction',
        patternLabel: '雖然⋯⋯但是⋯⋯',
        englishBridge: 'Although ... still/but ... (Unexpected success)',
        fillPrompt: '（　　）這道數學應用題有點難，（　　）我最後還是解出來了。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄉㄠˋ ㄕㄨˋ ㄒㄩㄝˊ ㄧㄥˋ ㄩㄥˋ ㄊㄧˊ ㄧㄡˇ ㄉㄧㄢˇ ㄋㄢˊ ㄨㄛˇ ㄗㄨㄟˋ ㄏㄡˋ ㄏㄞˊ ㄕˋ ㄐㄧㄝˇ ㄔㄨ ㄌㄞˊ ˙ㄌㄜ',
        fillAnswer: '雖然⋯⋯但是',
        fillAnswerZhuyin: 'ㄙㄨㄟ ㄖㄢˊ ㄉㄢˋ ㄕˋ',
        fillChoices: ['雖然⋯⋯但是', '因為⋯⋯所以', '一邊⋯⋯一邊', '不是⋯⋯就是'],
        reorderTarget: '雖然這道數學應用題有點難，但是我最後還是解出來了。',
        reorderTargetZhuyin:
          'ㄙㄨㄟ ㄖㄢˊ ㄓㄜˋ ㄉㄠˋ ㄕㄨˋ ㄒㄩㄝˊ ㄧㄥˋ ㄩㄥˋ ㄊㄧˊ ㄧㄡˇ ㄉㄧㄢˇ ㄋㄢˊ ㄉㄢˋ ㄕˋ ㄨㄛˇ ㄗㄨㄟˋ ㄏㄡˋ ㄏㄞˊ ㄕˋ ㄐㄧㄝˇ ㄔㄨ ㄌㄞˊ ˙ㄌㄜ',
        reorderChunks: ['雖然這道數學應用題', '有點難，', '但是我最後', '還是解出來了。'],
        reorderChunksZhuyin: [
          'ㄙㄨㄟ ㄖㄢˊ ㄓㄜˋ ㄉㄠˋ ㄕㄨˋ ㄒㄩㄝˊ ㄧㄥˋ ㄩㄥˋ ㄊㄧˊ',
          'ㄧㄡˇ ㄉㄧㄢˇ ㄋㄢˊ',
          'ㄉㄢˋ ㄕˋ ㄨㄛˇ ㄗㄨㄟˋ ㄏㄡˋ',
          'ㄏㄞˊ ㄕˋ ㄐㄧㄝˇ ㄔㄨ ㄌㄞˊ ˙ㄌㄜ',
        ],
        explanation:
          '「題目有點難」和「還是解出來了」語氣大翻轉，中文要用「雖然⋯⋯但是⋯⋯」一起出現（不像英文只選一個喔）！',
      },
      {
        id: 'zh-sp-t2-contrast-2',
        category: 'conjunction',
        patternLabel: '雖然⋯⋯但是⋯⋯',
        englishBridge: 'Even though it is cold ... the soup warms me up',
        fillPrompt: '雖然今天氣溫很低，（　　）熱騰騰的玉米濃湯讓我全身暖呼呼。',
        fillPromptZhuyin:
          'ㄙㄨㄟ ㄖㄢˊ ㄐㄧㄣ ㄊㄧㄢ ㄑㄧˋ ㄨㄣ ㄏㄣˇ ㄉㄧ ㄖㄜˋ ㄊㄥˊ ㄊㄥˊ ˙ㄉㄜ ㄩˋ ㄇㄧˇ ㄋㄨㄥˊ ㄊㄤ ㄖㄤˋ ㄨㄛˇ ㄑㄩㄢˊ ㄕㄣ ㄋㄨㄢˇ ㄏㄨ ㄏㄨ',
        fillAnswer: '但是',
        fillAnswerZhuyin: 'ㄉㄢˋ ㄕˋ',
        fillChoices: ['但是', '所以', '而且', '或者'],
        reorderTarget: '雖然今天氣溫很低，但是熱騰騰的玉米濃湯讓我全身暖呼呼。',
        reorderTargetZhuyin:
          'ㄙㄨㄟ ㄖㄢˊ ㄐㄧㄣ ㄊㄧㄢ ㄑㄧˋ ㄨㄣ ㄏㄣˇ ㄉㄧ ㄉㄢˋ ㄕˋ ㄖㄜˋ ㄊㄥˊ ㄊㄥˊ ˙ㄉㄜ ㄩˋ ㄇㄧˇ ㄋㄨㄥˊ ㄊㄤ ㄖㄤˋ ㄨㄛˇ ㄑㄩㄢˊ ㄕㄣ ㄋㄨㄢˇ ㄏㄨ ㄏㄨ',
        reorderChunks: ['雖然今天氣溫很低，', '但是熱騰騰的', '玉米濃湯讓我', '全身暖呼呼。'],
        reorderChunksZhuyin: [
          'ㄙㄨㄟ ㄖㄢˊ ㄐㄧㄣ ㄊㄧㄢ ㄑㄧˋ ㄨㄣ ㄏㄣˇ ㄉㄧ',
          'ㄉㄢˋ ㄕˋ ㄖㄜˋ ㄊㄥˊ ㄊㄥˊ ˙ㄉㄜ',
          'ㄩˋ ㄇㄧˇ ㄋㄨㄥˊ ㄊㄤ ㄖㄤˋ ㄨㄛˇ',
          'ㄑㄩㄢˊ ㄕㄣ ㄋㄨㄢˇ ㄏㄨ ㄏㄨ',
        ],
        explanation:
          '前半句用「雖然」說氣溫很低，後半句要用「但是」轉折到全身暖呼呼的對比感受！',
      },
      {
        id: 'zh-sp-t2-contrast-3',
        category: 'conjunction',
        patternLabel: '雖然⋯⋯但是⋯⋯',
        englishBridge: 'Although tiny ... surprisingly strong jump',
        fillPrompt: '（　　）小狐狸個子很小，但是牠的彈跳力非常驚人。',
        fillPromptZhuyin:
          'ㄒㄧㄠˇ ㄏㄨˊ ˙ㄌㄧ ㄍㄜˋ ˙ㄗ ㄏㄣˇ ㄒㄧㄠˇ ㄉㄢˋ ㄕˋ ㄊㄚ ˙ㄉㄜ ㄊㄢˊ ㄊㄧㄠˋ ㄌㄧˋ ㄈㄟ ㄔㄤˊ ㄐㄧㄥ ㄖㄣˊ',
        fillAnswer: '雖然',
        fillAnswerZhuyin: 'ㄙㄨㄟ ㄖㄢˊ',
        fillChoices: ['雖然', '因為', '不但', '不是'],
        reorderTarget: '雖然小狐狸個子很小，但是牠的彈跳力非常驚人。',
        reorderTargetZhuyin:
          'ㄙㄨㄟ ㄖㄢˊ ㄒㄧㄠˇ ㄏㄨˊ ˙ㄌㄧ ㄍㄜˋ ˙ㄗ ㄏㄣˇ ㄒㄧㄠˇ ㄉㄢˋ ㄕˋ ㄊㄚ ˙ㄉㄜ ㄊㄢˊ ㄊㄧㄠˋ ㄌㄧˋ ㄈㄟ ㄔㄤˊ ㄐㄧㄥ ㄖㄣˊ',
        reorderChunks: ['雖然小狐狸', '個子很小，', '但是牠的彈跳力', '非常驚人。'],
        reorderChunksZhuyin: [
          'ㄙㄨㄟ ㄖㄢˊ ㄒㄧㄠˇ ㄏㄨˊ ˙ㄌㄧ',
          'ㄍㄜˋ ˙ㄗ ㄏㄣˇ ㄒㄧㄠˇ',
          'ㄉㄢˋ ㄕˋ ㄊㄚ ˙ㄉㄜ ㄊㄢˊ ㄊㄧㄠˋ ㄌㄧˋ',
          'ㄈㄟ ㄔㄤˊ ㄐㄧㄥ ㄖㄣˊ',
        ],
        explanation:
          '後半句出現「但是」，前半句就要填入「雖然」，形成「個子小 vs. 彈跳力驚人」的反差。',
      },
      {
        id: 'zh-sp-t2-contrast-4',
        category: 'conjunction',
        patternLabel: '雖然⋯⋯但是⋯⋯',
        englishBridge: 'Although we did not win ... we still cheered',
        fillPrompt: '（　　）這次接力賽沒有拿到冠軍，（　　）我們依然為隊友鼓掌。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄘˋ ㄐㄧㄝ ㄌㄧˋ ㄙㄞˋ ㄇㄟˊ ㄧㄡˇ ㄋㄚˊ ㄉㄠˋ ㄍㄨㄢˋ ㄐㄩㄣ ㄨㄛˇ ˙ㄇㄣ ㄧ ㄖㄢˊ ㄨㄟˋ ㄉㄨㄟˋ ㄧㄡˇ ㄍㄨˇ ㄓㄤˇ',
        fillAnswer: '雖然⋯⋯但是',
        fillAnswerZhuyin: 'ㄙㄨㄟ ㄖㄢˊ ㄉㄢˋ ㄕˋ',
        fillChoices: ['雖然⋯⋯但是', '因為⋯⋯所以', '不但⋯⋯而且', '先⋯⋯再'],
        reorderTarget: '雖然這次接力賽沒有拿到冠軍，但是我們依然為隊友鼓掌。',
        reorderTargetZhuyin:
          'ㄙㄨㄟ ㄖㄢˊ ㄓㄜˋ ㄘˋ ㄐㄧㄝ ㄌㄧˋ ㄙㄞˋ ㄇㄟˊ ㄧㄡˇ ㄋㄚˊ ㄉㄠˋ ㄍㄨㄢˋ ㄐㄩㄣ ㄉㄢˋ ㄕˋ ㄨㄛˇ ˙ㄇㄣ ㄧ ㄖㄢˊ ㄨㄟˋ ㄉㄨㄟˋ ㄧㄡˇ ㄍㄨˇ ㄓㄤˇ',
        reorderChunks: ['雖然這次接力賽', '沒有拿到冠軍，', '但是我們依然', '為隊友鼓掌。'],
        reorderChunksZhuyin: [
          'ㄙㄨㄟ ㄖㄢˊ ㄓㄜˋ ㄘˋ ㄐㄧㄝ ㄌㄧˋ ㄙㄞˋ',
          'ㄇㄟˊ ㄧㄡˇ ㄋㄚˊ ㄉㄠˋ ㄍㄨㄢˋ ㄐㄩㄣ',
          'ㄉㄢˋ ㄕˋ ㄨㄛˇ ˙ㄇㄣ ㄧ ㄖㄢˊ',
          'ㄨㄟˋ ㄉㄨㄟˋ ㄧㄡˇ ㄍㄨˇ ㄓㄤˇ',
        ],
        explanation:
          '沒拿冠軍原本可能讓人失落，卻依然替隊友鼓掌，用「雖然⋯⋯但是⋯⋯」更能襯托運動家精神！',
      },
      {
        id: 'zh-sp-t2-contrast-5',
        category: 'conjunction',
        patternLabel: '雖然⋯⋯但是⋯⋯',
        englishBridge: 'Although the book is thick ... finished it in two days',
        fillPrompt: '雖然這本偵探故事很厚，（　　）情節太精彩了，我兩天就看完了。',
        fillPromptZhuyin:
          'ㄙㄨㄟ ㄖㄢˊ ㄓㄜˋ ㄅㄣˇ ㄓㄣ ㄊㄢˋ ㄍㄨˋ ˙ㄕ ㄏㄣˇ ㄏㄡˋ ㄑㄧㄥˊ ㄐㄧㄝˊ ㄊㄞˋ ㄐㄧㄥ ㄘㄞˇ ˙ㄌㄜ ㄨㄛˇ ㄌㄧㄤˇ ㄊㄧㄢ ㄐㄧㄡˋ ㄎㄢˋ ㄨㄢˊ ˙ㄌㄜ',
        fillAnswer: '但是',
        fillAnswerZhuyin: 'ㄉㄢˋ ㄕˋ',
        fillChoices: ['但是', '所以', '一邊', '不是'],
        reorderTarget: '雖然這本偵探故事很厚，但是情節太精彩了，我兩天就看完了。',
        reorderTargetZhuyin:
          'ㄙㄨㄟ ㄖㄢˊ ㄓㄜˋ ㄅㄣˇ ㄓㄣ ㄊㄢˋ ㄍㄨˋ ˙ㄕ ㄏㄣˇ ㄏㄡˋ ㄉㄢˋ ㄕˋ ㄑㄧㄥˊ ㄐㄧㄝˊ ㄊㄞˋ ㄐㄧㄥ ㄘㄞˇ ˙ㄌㄜ ㄨㄛˇ ㄌㄧㄤˇ ㄊㄧㄢ ㄐㄧㄡˋ ㄎㄢˋ ㄨㄢˊ ˙ㄌㄜ',
        reorderChunks: ['雖然這本偵探故事', '很厚，', '但是情節太精彩了，', '我兩天就看完了。'],
        reorderChunksZhuyin: [
          'ㄙㄨㄟ ㄖㄢˊ ㄓㄜˋ ㄅㄣˇ ㄓㄣ ㄊㄢˋ ㄍㄨˋ ˙ㄕ',
          'ㄏㄣˇ ㄏㄡˋ',
          'ㄉㄢˋ ㄕˋ ㄑㄧㄥˊ ㄐㄧㄝˊ ㄊㄞˋ ㄐㄧㄥ ㄘㄞˇ ˙ㄌㄜ',
          'ㄨㄛˇ ㄌㄧㄤˇ ㄊㄧㄢ ㄐㄧㄡˋ ㄎㄢˋ ㄨㄢˊ ˙ㄌㄜ',
        ],
        explanation:
          '書很厚照理說要看很久，卻兩天就看完，前面有「雖然」，後面就用「但是」接住這個轉折！',
      },
    ],
  },
  {
    id: 'zh-sp-t2-progressive',
    tier: 2,
    category: 'conjunction',
    title: '層層遞進塔',
    subtitle: '用「不但⋯⋯而且⋯⋯」把優點或驚喜一層一層往上加！',
    patternBadge: '不但⋯⋯而且⋯⋯',
    emblemCollectibleId: 'space-astro-corgi',
    accentHex: '#0891B2',
    bgHex: '#ECFEFF',
    items: [
      {
        id: 'zh-sp-t2-progressive-1',
        category: 'conjunction',
        patternLabel: '不但⋯⋯而且⋯⋯',
        englishBridge: 'Not only ... but also ... (Leveling up)',
        fillPrompt: '這隻柯基犬（　　）會握手，（　　）還會幫忙撿飛盤。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄓ ㄎㄜ ㄐㄧ ㄑㄩㄢˇ ㄏㄨㄟˋ ㄨㄛˋ ㄕㄡˇ ㄏㄞˊ ㄏㄨㄟˋ ㄅㄤ ㄇㄤˊ ㄐㄧㄢˇ ㄈㄟ ㄆㄢˊ',
        fillAnswer: '不但⋯⋯而且',
        fillAnswerZhuyin: 'ㄅㄨˋ ㄉㄢˋ ㄦˊ ㄑㄧㄝˇ',
        fillChoices: ['不但⋯⋯而且', '雖然⋯⋯但是', '因為⋯⋯所以', '不是⋯⋯就是'],
        reorderTarget: '這隻柯基犬不但會握手，而且還會幫忙撿飛盤。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄓ ㄎㄜ ㄐㄧ ㄑㄩㄢˇ ㄅㄨˋ ㄉㄢˋ ㄏㄨㄟˋ ㄨㄛˋ ㄕㄡˇ ㄦˊ ㄑㄧㄝˇ ㄏㄞˊ ㄏㄨㄟˋ ㄅㄤ ㄇㄤˊ ㄐㄧㄢˇ ㄈㄟ ㄆㄢˊ',
        reorderChunks: ['這隻柯基犬', '不但會握手，', '而且還會', '幫忙撿飛盤。'],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄓ ㄎㄜ ㄐㄧ ㄑㄩㄢˇ',
          'ㄅㄨˋ ㄉㄢˋ ㄏㄨㄟˋ ㄨㄛˋ ㄕㄡˇ',
          'ㄦˊ ㄑㄧㄝˇ ㄏㄞˊ ㄏㄨㄟˋ',
          'ㄅㄤ ㄇㄤˊ ㄐㄧㄢˇ ㄈㄟ ㄆㄢˊ',
        ],
        explanation:
          '會握手已經很厲害了，還會撿飛盤更進一階，用「不但⋯⋯而且⋯⋯」就能表達「不只如此，甚至更棒」！',
      },
      {
        id: 'zh-sp-t2-progressive-2',
        category: 'conjunction',
        patternLabel: '不但⋯⋯而且⋯⋯',
        englishBridge: 'Not only rich in books ... but also bright and cozy',
        fillPrompt: '新開的圖書館不但藏書豐富，（　　）閱讀區也非常明亮舒適。',
        fillPromptZhuyin:
          'ㄒㄧㄣ ㄎㄞ ˙ㄉㄜ ㄊㄨˊ ㄕㄨ ㄍㄨㄢˇ ㄅㄨˋ ㄉㄢˋ ㄘㄤˊ ㄕㄨ ㄈㄥ ㄈㄨˋ ㄩㄝˋ ㄉㄨˊ ㄑㄩ ㄧㄝˇ ㄈㄟ ㄔㄤˊ ㄇㄧㄥˊ ㄌㄧㄤˋ ㄕㄨ ㄕˋ',
        fillAnswer: '而且',
        fillAnswerZhuyin: 'ㄦˊ ㄑㄧㄝˇ',
        fillChoices: ['而且', '但是', '所以', '或者'],
        reorderTarget: '新開的圖書館不但藏書豐富，而且閱讀區也非常明亮舒適。',
        reorderTargetZhuyin:
          'ㄒㄧㄣ ㄎㄞ ˙ㄉㄜ ㄊㄨˊ ㄕㄨ ㄍㄨㄢˇ ㄅㄨˋ ㄉㄢˋ ㄘㄤˊ ㄕㄨ ㄈㄥ ㄈㄨˋ ㄦˊ ㄑㄧㄝˇ ㄩㄝˋ ㄉㄨˊ ㄑㄩ ㄧㄝˇ ㄈㄟ ㄔㄤˊ ㄇㄧㄥˊ ㄌㄧㄤˋ ㄕㄨ ㄕˋ',
        reorderChunks: ['新開的圖書館', '不但藏書豐富，', '而且閱讀區也', '非常明亮舒適。'],
        reorderChunksZhuyin: [
          'ㄒㄧㄣ ㄎㄞ ˙ㄉㄜ ㄊㄨˊ ㄕㄨ ㄍㄨㄢˇ',
          'ㄅㄨˋ ㄉㄢˋ ㄘㄤˊ ㄕㄨ ㄈㄥ ㄈㄨˋ',
          'ㄦˊ ㄑㄧㄝˇ ㄩㄝˋ ㄉㄨˊ ㄑㄩ ㄧㄝˇ',
          'ㄈㄟ ㄔㄤˊ ㄇㄧㄥˊ ㄌㄧㄤˋ ㄕㄨ ㄕˋ',
        ],
        explanation:
          '前半句有「不但」，後面要接「而且」加上第二個優點，語氣層層疊加！',
      },
      {
        id: 'zh-sp-t2-progressive-3',
        category: 'conjunction',
        patternLabel: '不但⋯⋯而且⋯⋯',
        englishBridge: 'Not only fossils ... but also a planetarium',
        fillPrompt: '這座科學館（　　）有恐龍化石，而且還有星象劇場。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄗㄨㄛˋ ㄎㄜ ㄒㄩㄝˊ ㄍㄨㄢˇ ㄧㄡˇ ㄎㄨㄥˇ ㄌㄨㄥˊ ㄏㄨㄚˋ ㄕˊ ㄦˊ ㄑㄧㄝˇ ㄏㄞˊ ㄧㄡˇ ㄒㄧㄥ ㄒㄧㄤˋ ㄐㄩˋ ㄔㄤˇ',
        fillAnswer: '不但',
        fillAnswerZhuyin: 'ㄅㄨˋ ㄉㄢˋ',
        fillChoices: ['不但', '雖然', '因為', '不是'],
        reorderTarget: '這座科學館不但有恐龍化石，而且還有星象劇場。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄗㄨㄛˋ ㄎㄜ ㄒㄩㄝˊ ㄍㄨㄢˇ ㄅㄨˋ ㄉㄢˋ ㄧㄡˇ ㄎㄨㄥˇ ㄌㄨㄥˊ ㄏㄨㄚˋ ㄕˊ ㄦˊ ㄑㄧㄝˇ ㄏㄞˊ ㄧㄡˇ ㄒㄧㄥ ㄒㄧㄤˋ ㄐㄩˋ ㄔㄤˇ',
        reorderChunks: ['這座科學館', '不但有恐龍化石，', '而且還有', '星象劇場。'],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄗㄨㄛˋ ㄎㄜ ㄒㄩㄝˊ ㄍㄨㄢˇ',
          'ㄅㄨˋ ㄉㄢˋ ㄧㄡˇ ㄎㄨㄥˇ ㄌㄨㄥˊ ㄏㄨㄚˋ ㄕˊ',
          'ㄦˊ ㄑㄧㄝˇ ㄏㄞˊ ㄧㄡˇ',
          'ㄒㄧㄥ ㄒㄧㄤˋ ㄐㄩˋ ㄔㄤˇ',
        ],
        explanation:
          '看到後半句的「而且還有」，就可以立刻判斷前半句要填「不但」，同一個主詞要放在「不但」前面喔！',
      },
      {
        id: 'zh-sp-t2-progressive-4',
        category: 'conjunction',
        patternLabel: '不但⋯⋯而且⋯⋯',
        englishBridge: 'Not only great grades ... but also kind and helpful',
        fillPrompt: '班長（　　）功課優秀，（　　）常常主動幫助新轉來的同學。',
        fillPromptZhuyin:
          'ㄅㄢ ㄓㄤˇ ㄍㄨㄥ ㄎㄜˋ ㄧㄡ ㄒㄧㄡˋ ㄔㄤˊ ㄔㄤˊ ㄓㄨˇ ㄉㄨㄥˋ ㄅㄤ ㄓㄨˋ ㄒㄧㄣ ㄓㄨㄢˇ ㄌㄞˊ ˙ㄉㄜ ㄊㄨㄥˊ ㄒㄩㄝˊ',
        fillAnswer: '不但⋯⋯而且',
        fillAnswerZhuyin: 'ㄅㄨˋ ㄉㄢˋ ㄦˊ ㄑㄧㄝˇ',
        fillChoices: ['不但⋯⋯而且', '雖然⋯⋯但是', '不是⋯⋯就是', '因為⋯⋯所以'],
        reorderTarget: '班長不但功課優秀，而且常常主動幫助新轉來的同學。',
        reorderTargetZhuyin:
          'ㄅㄢ ㄓㄤˇ ㄅㄨˋ ㄉㄢˋ ㄍㄨㄥ ㄎㄜˋ ㄧㄡ ㄒㄧㄡˋ ㄦˊ ㄑㄧㄝˇ ㄔㄤˊ ㄔㄤˊ ㄓㄨˇ ㄉㄨㄥˋ ㄅㄤ ㄓㄨˋ ㄒㄧㄣ ㄓㄨㄢˇ ㄌㄞˊ ˙ㄉㄜ ㄊㄨㄥˊ ㄒㄩㄝˊ',
        reorderChunks: ['班長', '不但功課優秀，', '而且常常主動', '幫助新轉來的同學。'],
        reorderChunksZhuyin: [
          'ㄅㄢ ㄓㄤˇ',
          'ㄅㄨˋ ㄉㄢˋ ㄍㄨㄥ ㄎㄜˋ ㄧㄡ ㄒㄧㄡˋ',
          'ㄦˊ ㄑㄧㄝˇ ㄔㄤˊ ㄔㄤˊ ㄓㄨˇ ㄉㄨㄥˋ',
          'ㄅㄤ ㄓㄨˋ ㄒㄧㄣ ㄓㄨㄢˇ ㄌㄞˊ ˙ㄉㄜ ㄊㄨㄥˊ ㄒㄩㄝˊ',
        ],
        explanation:
          '稱讚一個人兼具「功課優秀」和「熱心助人」兩個優點，用「不但⋯⋯而且⋯⋯」最有說服力！',
      },
      {
        id: 'zh-sp-t2-progressive-5',
        category: 'conjunction',
        patternLabel: '不但⋯⋯而且⋯⋯',
        englishBridge: 'Not only quenches thirst ... but also supports health',
        fillPrompt: '多喝開水不但能解渴，（　　）對身體健康也很有幫助。',
        fillPromptZhuyin:
          'ㄉㄨㄛ ㄏㄜ ㄎㄞ ㄕㄨㄟˇ ㄅㄨˋ ㄉㄢˋ ㄋㄥˊ ㄐㄧㄝˇ ㄎㄜˇ ㄉㄨㄟˋ ㄕㄣ ㄊㄧˇ ㄐㄧㄢˋ ㄎㄤ ㄧㄝˇ ㄏㄣˇ ㄧㄡˇ ㄅㄤ ㄓㄨˋ',
        fillAnswer: '而且',
        fillAnswerZhuyin: 'ㄦˊ ㄑㄧㄝˇ',
        fillChoices: ['而且', '但是', '所以', '還是'],
        reorderTarget: '多喝開水不但能解渴，而且對身體健康也很有幫助。',
        reorderTargetZhuyin:
          'ㄉㄨㄛ ㄏㄜ ㄎㄞ ㄕㄨㄟˇ ㄅㄨˋ ㄉㄢˋ ㄋㄥˊ ㄐㄧㄝˇ ㄎㄜˇ ㄦˊ ㄑㄧㄝˇ ㄉㄨㄟˋ ㄕㄣ ㄊㄧˇ ㄐㄧㄢˋ ㄎㄤ ㄧㄝˇ ㄏㄣˇ ㄧㄡˇ ㄅㄤ ㄓㄨˋ',
        reorderChunks: ['多喝開水', '不但能解渴，', '而且對身體健康', '也很有幫助。'],
        reorderChunksZhuyin: [
          'ㄉㄨㄛ ㄏㄜ ㄎㄞ ㄕㄨㄟˇ',
          'ㄅㄨˋ ㄉㄢˋ ㄋㄥˊ ㄐㄧㄝˇ ㄎㄜˇ',
          'ㄦˊ ㄑㄧㄝˇ ㄉㄨㄟˋ ㄕㄣ ㄊㄧˇ ㄐㄧㄢˋ ㄎㄤ',
          'ㄧㄝˇ ㄏㄣˇ ㄧㄡˇ ㄅㄤ ㄓㄨˋ',
        ],
        explanation:
          '「解渴」是基本好處，「對身體健康很有幫助」更進一層，所以「不但」要搭配「而且」！',
      },
    ],
  },
  {
    id: 'zh-sp-t2-bei',
    tier: 2,
    category: 'structure',
    title: '趣味被字句',
    subtitle: '學會用「受詞＋被＋動作發出者＋結果」表達被動的趣味事件！',
    patternBadge: '被字句',
    emblemCollectibleId: 'ocean-bubble-turtle',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    items: [
      {
        id: 'zh-sp-t2-bei-1',
        category: 'structure',
        patternLabel: '被字句',
        englishBridge: 'Object + 被 + Doer + Verb + Result (Passive voice)',
        fillPrompt: '客廳桌上的草莓蛋糕（　　）貪吃的小狗偷吃光了。',
        fillPromptZhuyin:
          'ㄎㄜˋ ㄊㄧㄥ ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄘㄠˇ ㄇㄟˊ ㄉㄢˋ ㄍㄠ ㄊㄢ ㄔ ˙ㄉㄜ ㄒㄧㄠˇ ㄍㄡˇ ㄊㄡ ㄔ ㄍㄨㄤ ˙ㄌㄜ',
        fillAnswer: '被',
        fillAnswerZhuyin: 'ㄅㄟˋ',
        fillChoices: ['被', '把', '因為', '雖然'],
        reorderTarget: '客廳桌上的草莓蛋糕被貪吃的小狗偷吃光了。',
        reorderTargetZhuyin:
          'ㄎㄜˋ ㄊㄧㄥ ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄘㄠˇ ㄇㄟˊ ㄉㄢˋ ㄍㄠ ㄅㄟˋ ㄊㄢ ㄔ ˙ㄉㄜ ㄒㄧㄠˇ ㄍㄡˇ ㄊㄡ ㄔ ㄍㄨㄤ ˙ㄌㄜ',
        reorderChunks: ['客廳桌上的', '草莓蛋糕', '被貪吃的小狗', '偷吃光了。'],
        reorderChunksZhuyin: [
          'ㄎㄜˋ ㄊㄧㄥ ㄓㄨㄛ ㄕㄤˋ ˙ㄉㄜ',
          'ㄘㄠˇ ㄇㄟˊ ㄉㄢˋ ㄍㄠ',
          'ㄅㄟˋ ㄊㄢ ㄔ ˙ㄉㄜ ㄒㄧㄠˇ ㄍㄡˇ',
          'ㄊㄡ ㄔ ㄍㄨㄤ ˙ㄌㄜ',
        ],
        explanation:
          '句子開頭是承受動作的「草莓蛋糕」，後面是做出動作的「小狗」，所以要用表示被動的「被」！',
      },
      {
        id: 'zh-sp-t2-bei-2',
        category: 'structure',
        patternLabel: '被字句',
        englishBridge: 'The cap + was blown by + a strong gust of wind',
        fillPrompt: '那頂藍色棒球帽（　　）一陣強風吹到樹梢上了。',
        fillPromptZhuyin:
          'ㄋㄚˋ ㄉㄧㄥˇ ㄌㄢˊ ㄙㄜˋ ㄅㄤˋ ㄑㄧㄡˊ ㄇㄠˋ ㄧ ㄓㄣˋ ㄑㄧㄤˊ ㄈㄥ ㄔㄨㄟ ㄉㄠˋ ㄕㄨˋ ㄕㄠ ㄕㄤˋ ˙ㄌㄜ',
        fillAnswer: '被',
        fillAnswerZhuyin: 'ㄅㄟˋ',
        fillChoices: ['被', '把', '但是', '而且'],
        reorderTarget: '那頂藍色棒球帽被一陣強風吹到樹梢上了。',
        reorderTargetZhuyin:
          'ㄋㄚˋ ㄉㄧㄥˇ ㄌㄢˊ ㄙㄜˋ ㄅㄤˋ ㄑㄧㄡˊ ㄇㄠˋ ㄅㄟˋ ㄧ ㄓㄣˋ ㄑㄧㄤˊ ㄈㄥ ㄔㄨㄟ ㄉㄠˋ ㄕㄨˋ ㄕㄠ ㄕㄤˋ ˙ㄌㄜ',
        reorderChunks: ['那頂藍色棒球帽', '被一陣強風', '吹到', '樹梢上了。'],
        reorderChunksZhuyin: [
          'ㄋㄚˋ ㄉㄧㄥˇ ㄌㄢˊ ㄙㄜˋ ㄅㄤˋ ㄑㄧㄡˊ ㄇㄠˋ',
          'ㄅㄟˋ ㄧ ㄓㄣˋ ㄑㄧㄤˊ ㄈㄥ',
          'ㄔㄨㄟ ㄉㄠˋ',
          'ㄕㄨˋ ㄕㄠ ㄕㄤˋ ˙ㄌㄜ',
        ],
        explanation:
          '帽子自己不會飛，是受到「一陣強風」吹動才跑到樹梢上，因此要填入「被」！',
      },
      {
        id: 'zh-sp-t2-bei-3',
        category: 'structure',
        patternLabel: '被字句',
        englishBridge: 'The painting + was posted by + the teacher',
        fillPrompt: '這幅色彩繽紛的海底畫（　　）老師貼在教室公布欄上。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄈㄨˊ ㄙㄜˋ ㄘㄞˇ ㄅㄧㄣ ㄈㄣ ˙ㄉㄜ ㄏㄞˇ ㄉㄧˇ ㄏㄨㄚˋ ㄌㄠˇ ㄕ ㄊㄧㄝ ㄗㄞˋ ㄐㄧㄠˋ ㄕˋ ㄍㄨㄥ ㄅㄨˋ ㄌㄢˊ ㄕㄤˋ',
        fillAnswer: '被',
        fillAnswerZhuyin: 'ㄅㄟˋ',
        fillChoices: ['被', '把', '所以', '還是'],
        reorderTarget: '這幅色彩繽紛的海底畫被老師貼在教室公布欄上。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄈㄨˊ ㄙㄜˋ ㄘㄞˇ ㄅㄧㄣ ㄈㄣ ˙ㄉㄜ ㄏㄞˇ ㄉㄧˇ ㄏㄨㄚˋ ㄅㄟˋ ㄌㄠˇ ㄕ ㄊㄧㄝ ㄗㄞˋ ㄐㄧㄠˋ ㄕˋ ㄍㄨㄥ ㄅㄨˋ ㄌㄢˊ ㄕㄤˋ',
        reorderChunks: ['這幅色彩繽紛的', '海底畫', '被老師貼在', '教室公布欄上。'],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄈㄨˊ ㄙㄜˋ ㄘㄞˇ ㄅㄧㄣ ㄈㄣ ˙ㄉㄜ',
          'ㄏㄞˇ ㄉㄧˇ ㄏㄨㄚˋ',
          'ㄅㄟˋ ㄌㄠˇ ㄕ ㄊㄧㄝ ㄗㄞˋ',
          'ㄐㄧㄠˋ ㄕˋ ㄍㄨㄥ ㄅㄨˋ ㄌㄢˊ ㄕㄤˋ',
        ],
        explanation:
          '「被字句」不只用在倒楣的事，像作品被老師展示在公布欄上這種開心的事也能用喔！',
      },
      {
        id: 'zh-sp-t2-bei-4',
        category: 'structure',
        patternLabel: '被字句',
        englishBridge: 'The lost key + was found by + the kind guard',
        fillPrompt: '昨天弄丟的鑰匙（　　）熱心的管理員伯伯找到了。',
        fillPromptZhuyin:
          'ㄗㄨㄛˊ ㄊㄧㄢ ㄋㄨㄥˋ ㄉㄧㄡ ˙ㄉㄜ ㄧㄠˋ ˙ㄕ ㄖㄜˋ ㄒㄧㄣ ˙ㄉㄜ ㄍㄨㄢˇ ㄌㄧˇ ㄩㄢˊ ㄅㄛˊ ˙ㄅㄛ ㄓㄠˇ ㄉㄠˋ ˙ㄌㄜ',
        fillAnswer: '被',
        fillAnswerZhuyin: 'ㄅㄟˋ',
        fillChoices: ['被', '把', '雖然', '或者'],
        reorderTarget: '昨天弄丟的鑰匙被熱心的管理員伯伯找到了。',
        reorderTargetZhuyin:
          'ㄗㄨㄛˊ ㄊㄧㄢ ㄋㄨㄥˋ ㄉㄧㄡ ˙ㄉㄜ ㄧㄠˋ ˙ㄕ ㄅㄟˋ ㄖㄜˋ ㄒㄧㄣ ˙ㄉㄜ ㄍㄨㄢˇ ㄌㄧˇ ㄩㄢˊ ㄅㄛˊ ˙ㄅㄛ ㄓㄠˇ ㄉㄠˋ ˙ㄌㄜ',
        reorderChunks: ['昨天弄丟的鑰匙', '被熱心的', '管理員伯伯', '找到了。'],
        reorderChunksZhuyin: [
          'ㄗㄨㄛˊ ㄊㄧㄢ ㄋㄨㄥˋ ㄉㄧㄡ ˙ㄉㄜ ㄧㄠˋ ˙ㄕ',
          'ㄅㄟˋ ㄖㄜˋ ㄒㄧㄣ ˙ㄉㄜ',
          'ㄍㄨㄢˇ ㄌㄧˇ ㄩㄢˊ ㄅㄛˊ ˙ㄅㄛ',
          'ㄓㄠˇ ㄉㄠˋ ˙ㄌㄜ',
        ],
        explanation:
          '「鑰匙」是找到的對象，「管理員伯伯」是找到鑰匙的人，受詞在句首時就要用「被」來連接！',
      },
      {
        id: 'zh-sp-t2-bei-5',
        category: 'structure',
        patternLabel: '被字句',
        englishBridge: 'The sandcastle + was washed flat by + the rising waves',
        fillPrompt: '海邊的沙堡（　　）漲潮的海浪輕輕沖平了。',
        fillPromptZhuyin:
          'ㄏㄞˇ ㄅㄧㄢ ˙ㄉㄜ ㄕㄚ ㄅㄠˇ ㄓㄤˇ ㄔㄠˊ ˙ㄉㄜ ㄏㄞˇ ㄌㄤˋ ㄑㄧㄥ ㄑㄧㄥ ㄔㄨㄥ ㄆㄧㄥˊ ˙ㄌㄜ',
        fillAnswer: '被',
        fillAnswerZhuyin: 'ㄅㄟˋ',
        fillChoices: ['被', '把', '因為', '不但'],
        reorderTarget: '海邊的沙堡被漲潮的海浪輕輕沖平了。',
        reorderTargetZhuyin:
          'ㄏㄞˇ ㄅㄧㄢ ˙ㄉㄜ ㄕㄚ ㄅㄠˇ ㄅㄟˋ ㄓㄤˇ ㄔㄠˊ ˙ㄉㄜ ㄏㄞˇ ㄌㄤˋ ㄑㄧㄥ ㄑㄧㄥ ㄔㄨㄥ ㄆㄧㄥˊ ˙ㄌㄜ',
        reorderChunks: ['海邊的沙堡', '被漲潮的海浪', '輕輕', '沖平了。'],
        reorderChunksZhuyin: [
          'ㄏㄞˇ ㄅㄧㄢ ˙ㄉㄜ ㄕㄚ ㄅㄠˇ',
          'ㄅㄟˋ ㄓㄤˇ ㄔㄠˊ ˙ㄉㄜ ㄏㄞˇ ㄌㄤˋ',
          'ㄑㄧㄥ ㄑㄧㄥ',
          'ㄔㄨㄥ ㄆㄧㄥˊ ˙ㄌㄜ',
        ],
        explanation:
          '沙堡承受了「海浪沖平」的結果，用「沙堡＋被＋海浪＋沖平了」就能清楚交代事件經過！',
      },
    ],
  },
  {
    id: 'zh-sp-t2-choice',
    tier: 2,
    category: 'conjunction',
    title: '選擇小達人',
    subtitle: '學會用「不是⋯⋯就是⋯⋯」表示二選一，以及問句裡必用的「還是」！',
    patternBadge: '不是⋯⋯就是⋯⋯ / 還是',
    emblemCollectibleId: 'sweet-berry-shortcake',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    items: [
      {
        id: 'zh-sp-t2-choice-1',
        category: 'conjunction',
        patternLabel: '不是⋯⋯就是⋯⋯',
        englishBridge: 'Either ... or ... (One of two choices)',
        fillPrompt: '週末下午，我們家（　　）去騎腳踏車，（　　）去逛書店。',
        fillPromptZhuyin:
          'ㄓㄡ ㄇㄛˋ ㄒㄧㄚˋ ㄨˇ ㄨㄛˇ ˙ㄇㄣ ㄐㄧㄚ ㄑㄩˋ ㄑㄧˊ ㄐㄧㄠˇ ㄊㄚˋ ㄔㄜ ㄑㄩˋ ㄍㄨㄤˋ ㄕㄨ ㄉㄧㄢˋ',
        fillAnswer: '不是⋯⋯就是',
        fillAnswerZhuyin: 'ㄅㄨˋ ㄕˋ ㄐㄧㄡˋ ㄕˋ',
        fillChoices: ['不是⋯⋯就是', '因為⋯⋯所以', '雖然⋯⋯但是', '一邊⋯⋯一邊'],
        reorderTarget: '週末下午，我們家不是去騎腳踏車，就是去逛書店。',
        reorderTargetZhuyin:
          'ㄓㄡ ㄇㄛˋ ㄒㄧㄚˋ ㄨˇ ㄨㄛˇ ˙ㄇㄣ ㄐㄧㄚ ㄅㄨˋ ㄕˋ ㄑㄩˋ ㄑㄧˊ ㄐㄧㄠˇ ㄊㄚˋ ㄔㄜ ㄐㄧㄡˋ ㄕˋ ㄑㄩˋ ㄍㄨㄤˋ ㄕㄨ ㄉㄧㄢˋ',
        reorderChunks: ['週末下午，', '我們家不是', '去騎腳踏車，', '就是去逛書店。'],
        reorderChunksZhuyin: [
          'ㄓㄡ ㄇㄛˋ ㄒㄧㄚˋ ㄨˇ',
          'ㄨㄛˇ ˙ㄇㄣ ㄐㄧㄚ ㄅㄨˋ ㄕˋ',
          'ㄑㄩˋ ㄑㄧˊ ㄐㄧㄠˇ ㄊㄚˋ ㄔㄜ',
          'ㄐㄧㄡˋ ㄕˋ ㄑㄩˋ ㄍㄨㄤˋ ㄕㄨ ㄉㄧㄢˋ',
        ],
        explanation:
          '「不是⋯⋯就是⋯⋯」表示兩個活動裡一定選其中一個，就像英文的 either ... or ...！',
      },
      {
        id: 'zh-sp-t2-choice-2',
        category: 'conjunction',
        patternLabel: '不是⋯⋯就是⋯⋯',
        englishBridge: 'If it is not A, then it must be B',
        fillPrompt: '這支自動鉛筆不是小宇掉的，（　　）小晴掉的。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄓ ㄗˋ ㄉㄨㄥˋ ㄑㄧㄢ ㄅㄧˇ ㄅㄨˋ ㄕˋ ㄒㄧㄠˇ ㄩˇ ㄉㄧㄠˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄉㄧㄠˋ ˙ㄉㄜ',
        fillAnswer: '就是',
        fillAnswerZhuyin: 'ㄐㄧㄡˋ ㄕˋ',
        fillChoices: ['就是', '但是', '所以', '而且'],
        reorderTarget: '這支自動鉛筆不是小宇掉的，就是小晴掉的。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄓ ㄗˋ ㄉㄨㄥˋ ㄑㄧㄢ ㄅㄧˇ ㄅㄨˋ ㄕˋ ㄒㄧㄠˇ ㄩˇ ㄉㄧㄠˋ ˙ㄉㄜ ㄐㄧㄡˋ ㄕˋ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄉㄧㄠˋ ˙ㄉㄜ',
        reorderChunks: ['這支自動鉛筆', '不是小宇掉的，', '就是小晴', '掉的。'],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄓ ㄗˋ ㄉㄨㄥˋ ㄑㄧㄢ ㄅㄧˇ',
          'ㄅㄨˋ ㄕˋ ㄒㄧㄠˇ ㄩˇ ㄉㄧㄠˋ ˙ㄉㄜ',
          'ㄐㄧㄡˋ ㄕˋ ㄒㄧㄠˇ ㄑㄧㄥˊ',
          'ㄉㄧㄠˋ ˙ㄉㄜ',
        ],
        explanation:
          '範圍縮小到兩個人時，前半句說「不是小宇」，後半句就配「就是」指出另一種可能！',
      },
      {
        id: 'zh-sp-t2-choice-3',
        category: 'conjunction',
        patternLabel: '不是⋯⋯就是⋯⋯',
        englishBridge: 'Either basking by the window or napping in a box',
        fillPrompt: '這隻愛睡覺的貓咪（　　）趴在窗邊曬太陽，（　　）窩在紙箱裡打盹。',
        fillPromptZhuyin:
          'ㄓㄜˋ ㄓ ㄞˋ ㄕㄨㄟˋ ㄐㄧㄠˋ ˙ㄉㄜ ㄇㄠ ㄇㄧ ㄆㄚ ㄗㄞˋ ㄔㄨㄤ ㄅㄧㄢ ㄕㄞˋ ㄊㄞˋ ㄧㄤˊ ㄨㄛ ㄗㄞˋ ㄓˇ ㄒㄧㄤ ㄌㄧˇ ㄉㄚˇ ㄉㄨㄣˇ',
        fillAnswer: '不是⋯⋯就是',
        fillAnswerZhuyin: 'ㄅㄨˋ ㄕˋ ㄐㄧㄡˋ ㄕˋ',
        fillChoices: ['不是⋯⋯就是', '雖然⋯⋯但是', '因為⋯⋯所以', '一邊⋯⋯一邊'],
        reorderTarget: '這隻愛睡覺的貓咪不是趴在窗邊曬太陽，就是窩在紙箱裡打盹。',
        reorderTargetZhuyin:
          'ㄓㄜˋ ㄓ ㄞˋ ㄕㄨㄟˋ ㄐㄧㄠˋ ˙ㄉㄜ ㄇㄠ ㄇㄧ ㄅㄨˋ ㄕˋ ㄆㄚ ㄗㄞˋ ㄔㄨㄤ ㄅㄧㄢ ㄕㄞˋ ㄊㄞˋ ㄧㄤˊ ㄐㄧㄡˋ ㄕˋ ㄨㄛ ㄗㄞˋ ㄓˇ ㄒㄧㄤ ㄌㄧˇ ㄉㄚˇ ㄉㄨㄣˇ',
        reorderChunks: ['這隻愛睡覺的貓咪', '不是趴在窗邊曬太陽，', '就是窩在紙箱裡', '打盹。'],
        reorderChunksZhuyin: [
          'ㄓㄜˋ ㄓ ㄞˋ ㄕㄨㄟˋ ㄐㄧㄠˋ ˙ㄉㄜ ㄇㄠ ㄇㄧ',
          'ㄅㄨˋ ㄕˋ ㄆㄚ ㄗㄞˋ ㄔㄨㄤ ㄅㄧㄢ ㄕㄞˋ ㄊㄞˋ ㄧㄤˊ',
          'ㄐㄧㄡˋ ㄕˋ ㄨㄛ ㄗㄞˋ ㄓˇ ㄒㄧㄤ ㄌㄧˇ',
          'ㄉㄚˇ ㄉㄨㄣˇ',
        ],
        explanation:
          '貓咪無法同時待在窗邊又窩在紙箱裡，兩個地點二選一，要用「不是⋯⋯就是⋯⋯」！',
      },
      {
        id: 'zh-sp-t2-choice-4',
        category: 'conjunction',
        patternLabel: '還是',
        englishBridge: '... or ... ? (Choice connector for questions)',
        fillPrompt: '今天的點心你想吃草莓蛋糕，（　　）想喝珍珠奶茶呢？',
        fillPromptZhuyin:
          'ㄐㄧㄣ ㄊㄧㄢ ˙ㄉㄜ ㄉㄧㄢˇ ˙ㄒㄧㄣ ㄋㄧˇ ㄒㄧㄤˇ ㄔ ㄘㄠˇ ㄇㄟˊ ㄉㄢˋ ㄍㄠ ㄒㄧㄤˇ ㄏㄜ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ ˙ㄋㄜ',
        fillAnswer: '還是',
        fillAnswerZhuyin: 'ㄏㄞˊ ㄕˋ',
        fillChoices: ['還是', '因為', '雖然', '而且'],
        reorderTarget: '今天的點心你想吃草莓蛋糕，還是想喝珍珠奶茶呢？',
        reorderTargetZhuyin:
          'ㄐㄧㄣ ㄊㄧㄢ ˙ㄉㄜ ㄉㄧㄢˇ ˙ㄒㄧㄣ ㄋㄧˇ ㄒㄧㄤˇ ㄔ ㄘㄠˇ ㄇㄟˊ ㄉㄢˋ ㄍㄠ ㄏㄞˊ ㄕˋ ㄒㄧㄤˇ ㄏㄜ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ ˙ㄋㄜ',
        reorderChunks: ['今天的點心', '你想吃草莓蛋糕，', '還是想喝', '珍珠奶茶呢？'],
        reorderChunksZhuyin: [
          'ㄐㄧㄣ ㄊㄧㄢ ˙ㄉㄜ ㄉㄧㄢˇ ˙ㄒㄧㄣ',
          'ㄋㄧˇ ㄒㄧㄤˇ ㄔ ㄘㄠˇ ㄇㄟˊ ㄉㄢˋ ㄍㄠ',
          'ㄏㄞˊ ㄕˋ ㄒㄧㄤˇ ㄏㄜ',
          'ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ ˙ㄋㄜ',
        ],
        explanation:
          '在疑問句裡請對方二選一時，中文要用「還是」來連接兩個選項！',
      },
      {
        id: 'zh-sp-t2-choice-5',
        category: 'conjunction',
        patternLabel: '還是',
        englishBridge: 'Take the bus or take the MRT? (Question choice)',
        fillPrompt: '請問我們要搭公車去動物園，（　　）搭捷運去呢？',
        fillPromptZhuyin:
          'ㄑㄧㄥˇ ㄨㄣˋ ㄨㄛˇ ˙ㄇㄣ ㄧㄠˋ ㄉㄚ ㄍㄨㄥ ㄔㄜ ㄑㄩˋ ㄉㄨㄥˋ ㄨˋ ㄩㄢˊ ㄉㄚ ㄐㄧㄝˊ ㄩㄣˋ ㄑㄩˋ ˙ㄋㄜ',
        fillAnswer: '還是',
        fillAnswerZhuyin: 'ㄏㄞˊ ㄕˋ',
        fillChoices: ['還是', '所以', '但是', '不但'],
        reorderTarget: '請問我們要搭公車去動物園，還是搭捷運去呢？',
        reorderTargetZhuyin:
          'ㄑㄧㄥˇ ㄨㄣˋ ㄨㄛˇ ˙ㄇㄣ ㄧㄠˋ ㄉㄚ ㄍㄨㄥ ㄔㄜ ㄑㄩˋ ㄉㄨㄥˋ ㄨˋ ㄩㄢˊ ㄏㄞˊ ㄕˋ ㄉㄚ ㄐㄧㄝˊ ㄩㄣˋ ㄑㄩˋ ˙ㄋㄜ',
        reorderChunks: ['請問我們要', '搭公車去動物園，', '還是搭捷運', '去呢？'],
        reorderChunksZhuyin: [
          'ㄑㄧㄥˇ ㄨㄣˋ ㄨㄛˇ ˙ㄇㄣ ㄧㄠˋ',
          'ㄉㄚ ㄍㄨㄥ ㄔㄜ ㄑㄩˋ ㄉㄨㄥˋ ㄨˋ ㄩㄢˊ',
          'ㄏㄞˊ ㄕˋ ㄉㄚ ㄐㄧㄝˊ ㄩㄣˋ',
          'ㄑㄩˋ ˙ㄋㄜ',
        ],
        explanation:
          '「請問⋯⋯呢？」是標準疑問句，要在「搭公車」和「搭捷運」之間詢問選擇，必用「還是」！',
      },
    ],
  },
];

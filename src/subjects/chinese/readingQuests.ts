import type { ReadingQuestSet } from '../../core/readingTypes';
import type { DifficultyTier } from '../../core/types';

export const CHINESE_READING_QUESTS: ReadingQuestSet[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 1 · 生活高頻（2 組 / 4 篇故事 / 12 題）
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'zh-read-t1-nightmarket',
    subjectId: 'chinese',
    tier: 1,
    title: '台灣夜市小旅行',
    shortTag: '夜市探索',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    emblemCollectibleId: 'boba-milk-cat',
    passages: [
      {
        id: 'zh-read-t1-nm-p1',
        title: '珍珠奶茶排隊記',
        titleZhuyin: 'ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ ㄆㄞˊ ㄉㄨㄟˋ ㄐㄧˋ',
        sentences: [
          '週末晚上，小晴和外婆走進熱鬧的夜市。',
          '茶攤飄出濃濃的黑糖香味，排隊的人潮長得像一條龍。',
          '小晴終於拿到冰涼的珍珠奶茶，吸了一口就開心地笑出來。',
        ],
        sentencesZhuyin: [
          'ㄓㄡ ㄇㄛˋ ㄨㄢˇ ㄕㄤˋ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄏㄢˋ ㄨㄞˋ ㄆㄛˊ ㄗㄡˇ ㄐㄧㄣˋ ㄖㄜˋ ˙ㄋㄠ ˙ㄉㄜ ㄧㄝˋ ㄕˋ',
          'ㄔㄚˊ ㄊㄢ ㄆㄧㄠ ㄔㄨ ㄋㄨㄥˊ ㄋㄨㄥˊ ˙ㄉㄜ ㄏㄟ ㄊㄤˊ ㄒㄧㄤ ㄨㄟˋ ㄆㄞˊ ㄉㄨㄟˋ ˙ㄉㄜ ㄖㄣˊ ㄔㄠˊ ㄔㄤˊ ˙ㄉㄜ ㄒㄧㄤˋ ㄧ ㄊㄧㄠˊ ㄌㄨㄥˊ',
          'ㄒㄧㄠˇ ㄑㄧㄥˊ ㄓㄨㄥ ㄩˊ ㄋㄚˊ ㄉㄠˋ ㄅㄧㄥ ㄌㄧㄤˊ ˙ㄉㄜ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ ㄒㄧ ˙ㄌㄜ ㄧ ㄎㄡˇ ㄐㄧㄡˋ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄒㄧㄠˋ ㄔㄨ ㄌㄞˊ',
        ],
        englishGist:
          'Xiaoqing and her grandma visit a lively night market, wait in a long line for brown-sugar boba tea, and happily enjoy the cool drink.',
        spotlightVocab: [
          {
            word: '熱鬧',
            zhuyin: 'ㄖㄜˋ ˙ㄋㄠ',
            hint: 'lively and bustling（人很多、很熱烈的樣子）',
          },
          {
            word: '濃濃',
            zhuyin: 'ㄋㄨㄥˊ ㄋㄨㄥˊ',
            hint: 'rich and strong（香味或味道很重）',
          },
          {
            word: '終於',
            zhuyin: 'ㄓㄨㄥ ㄩˊ',
            hint: 'finally / at last（等了很久以後總算實現）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t1-nm-p1-q1',
            skillTag: '細節閱讀',
            prompt: '小晴和誰一起去逛台灣夜市？',
            choices: ['和哥哥', '和外婆', '和同學', '和老師'],
            choiceZhuyin: [
              'ㄏㄢˋ ㄍㄜ ˙ㄍㄜ',
              'ㄏㄢˋ ㄨㄞˋ ㄆㄛˊ',
              'ㄏㄢˋ ㄊㄨㄥˊ ㄒㄩㄝˊ',
              'ㄏㄢˋ ㄌㄠˇ ㄕ',
            ],
            correctIndex: 1,
            explanation: '文章第一句提到：「週末晚上，小晴和外婆走進熱鬧的夜市。」',
          },
          {
            id: 'zh-read-t1-nm-p1-q2',
            skillTag: '語境理解',
            prompt: '文中說「排隊的人潮長得像一條龍」，意思是什麼？',
            choices: [
              '夜裡出現了舞龍表演',
              '茶攤掛著龍形燈籠',
              '外婆正在講龍的故事',
              '排隊買茶的人非常多',
            ],
            correctIndex: 3,
            explanation: '把排隊隊伍比喻成一條長龍，形容排隊的人很多、隊伍排得很長。',
          },
          {
            id: 'zh-read-t1-nm-p1-q3',
            skillTag: '文意推論',
            prompt: '從最後一句「吸了一口就開心地笑出來」，可以看出什麼？',
            choices: [
              '這杯珍珠奶茶很好喝，讓等待很值得',
              '珍珠奶茶太燙了，小晴被嚇了一跳',
              '外婆買錯了飲料的口味',
              '夜市準備打烊，所以大家急著離開',
            ],
            correctIndex: 0,
            explanation: '小晴喝到冰涼的珍珠奶茶就開心大笑，表示她覺得這杯奶茶十分美味。',
          },
        ],
      },
      {
        id: 'zh-read-t1-nm-p2',
        title: '套圈圈小高手',
        titleZhuyin: 'ㄊㄠˋ ㄑㄩㄢ ㄑㄩㄢ ㄒㄧㄠˇ ㄍㄠ ㄕㄡˇ',
        sentences: [
          '夜市轉角有一攤彩色的套圈圈遊戲，架子上排滿可愛的玩偶。',
          '小晴深吸一口氣，瞄準最喜歡的綠色小青蛙輕輕一丟。',
          '圈圈穩穩套中目標，老闆笑著把玩偶遞給她！',
        ],
        sentencesZhuyin: [
          'ㄧㄝˋ ㄕˋ ㄓㄨㄢˇ ㄐㄧㄠˇ ㄧㄡˇ ㄧ ㄊㄢ ㄘㄞˇ ㄙㄜˋ ˙ㄉㄜ ㄊㄠˋ ㄑㄩㄢ ㄑㄩㄢ ㄧㄡˊ ㄒㄧˋ ㄐㄧㄚˋ ˙ㄗ ㄕㄤˋ ㄆㄞˊ ㄇㄢˇ ㄎㄜˇ ㄞˋ ˙ㄉㄜ ㄨㄢˊ ㄡˇ',
          'ㄒㄧㄠˇ ㄑㄧㄥˊ ㄕㄣ ㄒㄧ ㄧ ㄎㄡˇ ㄑㄧˋ ㄇㄧㄠˊ ㄓㄨㄣˇ ㄗㄨㄟˋ ㄒㄧˇ ㄏㄨㄢ ˙ㄉㄜ ㄌㄩˋ ㄙㄜˋ ㄒㄧㄠˇ ㄑㄧㄥ ㄨㄚ ㄑㄧㄥ ㄑㄧㄥ ㄧ ㄉㄧㄡ',
          'ㄑㄩㄢ ㄑㄩㄢ ㄨㄣˇ ㄨㄣˇ ㄊㄠˋ ㄓㄨㄥˋ ㄇㄨˋ ㄅㄧㄠ ㄌㄠˇ ㄅㄢˇ ㄒㄧㄠˋ ˙ㄓㄜ ㄅㄚˇ ㄨㄢˊ ㄡˇ ㄉㄧˋ ㄍㄟˇ ㄊㄚ',
        ],
        englishGist:
          'At a night-market ring-toss booth, Xiaoqing takes a deep breath, aims carefully at a green frog plushie, and wins it.',
        spotlightVocab: [
          {
            word: '瞄準',
            zhuyin: 'ㄇㄧㄠˊ ㄓㄨㄣˇ',
            hint: 'aim carefully at（眼睛對準目標）',
          },
          {
            word: '穩穩',
            zhuyin: 'ㄨㄣˇ ㄨㄣˇ',
            hint: 'steadily and cleanly（很平穩、沒有晃動）',
          },
          {
            word: '目標',
            zhuyin: 'ㄇㄨˋ ㄅㄧㄠ',
            hint: 'target / goal（想要對準或達成的對象）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t1-nm-p2-q1',
            skillTag: '語境理解',
            prompt: '句中「瞄準」最接近哪一個意思？',
            choices: ['隨便亂丟', '大聲加油', '仔細對準', '快速跑開'],
            choiceZhuyin: [
              'ㄙㄨㄟˊ ㄅㄧㄢˋ ㄌㄨㄢˋ ㄉㄧㄡ',
              'ㄉㄚˋ ㄕㄥ ㄐㄧㄚ ㄧㄡˊ',
              'ㄗˇ ㄒㄧˋ ㄉㄨㄟˋ ㄓㄨㄣˇ',
              'ㄎㄨㄞˋ ㄙㄨˋ ㄆㄠˇ ㄎㄞ',
            ],
            correctIndex: 2,
            explanation: '「瞄準」是指眼睛專心看準想要套中的目標，再丟出圈圈。',
          },
          {
            id: 'zh-read-t1-nm-p2-q2',
            skillTag: '細節閱讀',
            prompt: '小晴最想套中架子上的哪一個玩偶？',
            choices: ['綠色小青蛙', '黃色小鴨子', '粉紅小兔子', '藍色小海龜'],
            choiceZhuyin: [
              'ㄌㄩˋ ㄙㄜˋ ㄒㄧㄠˇ ㄑㄧㄥ ㄨㄚ',
              'ㄏㄨㄤˊ ㄙㄜˋ ㄒㄧㄠˇ ㄧㄚ ˙ㄗ',
              'ㄈㄣˇ ㄏㄨㄥˊ ㄒㄧㄠˇ ㄊㄨˋ ˙ㄗ',
              'ㄌㄢˊ ㄙㄜˋ ㄒㄧㄠˇ ㄏㄞˇ ㄍㄨㄟ',
            ],
            correctIndex: 0,
            explanation: '文章第二句寫道，小晴瞄準的是她最喜歡的「綠色小青蛙」。',
          },
          {
            id: 'zh-read-t1-nm-p2-q3',
            skillTag: '文意推論',
            prompt: '小晴丟圈圈前先「深吸一口氣」，這表現了她怎樣的態度？',
            choices: [
              '她覺得太累了不想玩',
              '她讓自己冷靜專心，認真丟好這一圈',
              '她想把架子上的灰塵吹掉',
              '她其實不太喜歡這個遊戲',
            ],
            correctIndex: 1,
            explanation: '深吸一口氣再輕輕丟出，代表小晴讓心情平靜下來、專注瞄準目標。',
          },
        ],
      },
    ],
  },

  {
    id: 'zh-read-t1-pet-friends',
    subjectId: 'chinese',
    tier: 1,
    title: '萌寵生活日記',
    shortTag: '萌寵日記',
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    emblemCollectibleId: 'catcafe-toast-tabby',
    passages: [
      {
        id: 'zh-read-t1-pet-p1',
        title: '橘貓麻糬的祕密',
        titleZhuyin: 'ㄐㄩˊ ㄇㄠ ㄇㄚˊ ㄕㄨˇ ˙ㄉㄜ ㄇㄧˋ ㄇㄧˋ',
        sentences: [
          '橘貓麻糬每天下午都會躲到書桌下面，安靜地守著一個紙箱。',
          '小美偷偷蹲下來一看，原來紙箱裡藏著她不見的毛線球！',
          '麻糬舔舔爪子，好像在得意地炫耀自己的寶藏。',
        ],
        sentencesZhuyin: [
          'ㄐㄩˊ ㄇㄠ ㄇㄚˊ ㄕㄨˇ ㄇㄟˇ ㄊㄧㄢ ㄒㄧㄚˋ ㄨˇ ㄉㄡ ㄏㄨㄟˋ ㄉㄨㄛˇ ㄉㄠˋ ㄕㄨ ㄓㄨㄛ ㄒㄧㄚˋ ㄇㄧㄢˋ ㄢ ㄐㄧㄥˋ ˙ㄉㄜ ㄕㄡˇ ˙ㄓㄜ ㄧ ㄍㄜˋ ㄓˇ ㄒㄧㄤ',
          'ㄒㄧㄠˇ ㄇㄟˇ ㄊㄡ ㄊㄡ ㄉㄨㄣ ㄒㄧㄚˋ ㄌㄞˊ ㄧ ㄎㄢˋ ㄩㄢˊ ㄌㄞˊ ㄓˇ ㄒㄧㄤ ㄌㄧˇ ㄘㄤˊ ˙ㄓㄜ ㄊㄚ ㄅㄨˋ ㄐㄧㄢˋ ˙ㄉㄜ ㄇㄠˊ ㄒㄧㄢˋ ㄑㄧㄡˊ',
          'ㄇㄚˊ ㄕㄨˇ ㄊㄧㄢˇ ㄊㄧㄢˇ ㄓㄨㄚˇ ˙ㄗ ㄏㄠˇ ㄒㄧㄤˋ ㄗㄞˋ ㄉㄜˊ ㄧˋ ˙ㄉㄜ ㄒㄩㄢˋ ㄧㄠˋ ㄗˋ ㄐㄧˇ ˙ㄉㄜ ㄅㄠˇ ㄗㄤˋ',
        ],
        englishGist:
          'Xiaomei discovers why her orange tabby Mochi guards a cardboard box under the desk—he hid her missing yarn ball inside like treasure!',
        spotlightVocab: [
          {
            word: '安靜',
            zhuyin: 'ㄢ ㄐㄧㄥˋ',
            hint: 'quiet and calm（不出聲音、很平靜）',
          },
          {
            word: '原來',
            zhuyin: 'ㄩㄢˊ ㄌㄞˊ',
            hint: 'it turns out that（發現真相時的說法）',
          },
          {
            word: '炫耀',
            zhuyin: 'ㄒㄩㄢˋ ㄧㄠˋ',
            hint: 'show off proudly（得意地展示給別人看）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t1-pet-p1-q1',
            skillTag: '細節閱讀',
            prompt: '小美在紙箱裡發現了什麼不見的東西？',
            choices: ['小魚餅乾', '彩色鉛筆', '紅色鈴鐺', '毛線球'],
            choiceZhuyin: [
              'ㄒㄧㄠˇ ㄩˊ ㄅㄧㄥˇ ㄍㄢ',
              'ㄘㄞˇ ㄙㄜˋ ㄑㄧㄢ ㄅㄧˇ',
              'ㄏㄨㄥˊ ㄙㄜˋ ㄌㄧㄥˊ ㄉㄤ',
              'ㄇㄠˊ ㄒㄧㄢˋ ㄑㄧㄡˊ',
            ],
            correctIndex: 3,
            explanation: '文章第二句寫著：「原來紙箱裡藏著她不見的毛線球！」',
          },
          {
            id: 'zh-read-t1-pet-p1-q2',
            skillTag: '語境理解',
            prompt: '文中「得意地炫耀」是指麻糬看起來怎麼樣？',
            choices: [
              '很怕被人發現',
              '很驕傲地展示自己的戰利品',
              '肚子餓了想吃飯',
              '在紙箱裡睡著了',
            ],
            correctIndex: 1,
            explanation: '「炫耀」是把自認為很棒的東西展示出來，搭配「得意」更顯得驕傲可愛。',
          },
          {
            id: 'zh-read-t1-pet-p1-q3',
            skillTag: '文意推論',
            prompt: '為什麼麻糬每天下午都要守著那個紙箱？',
            choices: [
              '因為外面正在下大雨',
              '因為小美叫牠幫忙看管書桌',
              '因為牠把毛線球當成心愛的寶藏藏在裡面',
              '因為紙箱裡面裝滿了貓糧',
            ],
            correctIndex: 2,
            explanation: '紙箱裡藏著毛線球，而麻糬像是守護寶藏一樣守在旁邊，可見牠非常喜歡這個毛線球。',
          },
        ],
      },
      {
        id: 'zh-read-t1-pet-p2',
        title: '柴犬布丁愛散步',
        titleZhuyin: 'ㄔㄞˊ ㄑㄩㄢˇ ㄅㄨˋ ㄉㄧㄥ ㄞˋ ㄙㄢˋ ㄅㄨˋ',
        sentences: [
          '每天清晨，柴犬布丁一看到牽繩就興奮地原地轉圈圈。',
          '走進公園時，牠先禮貌地聞聞小花，再和鄰居的小狗點頭打招呼。',
          '微風吹過草地，布丁蓬鬆的尾巴開心地搖個不停。',
        ],
        sentencesZhuyin: [
          'ㄇㄟˇ ㄊㄧㄢ ㄑㄧㄥ ㄔㄣˊ ㄔㄞˊ ㄑㄩㄢˇ ㄅㄨˋ ㄉㄧㄥ ㄧ ㄎㄢˋ ㄉㄠˋ ㄑㄧㄢ ㄕㄥˊ ㄐㄧㄡˋ ㄒㄧㄥ ㄈㄣˋ ˙ㄉㄜ ㄩㄢˊ ㄉㄧˋ ㄓㄨㄢˋ ㄑㄩㄢ ㄑㄩㄢ',
          'ㄗㄡˇ ㄐㄧㄣˋ ㄍㄨㄥ ㄩㄢˊ ㄕˊ ㄊㄚ ㄒㄧㄢ ㄌㄧˇ ㄇㄠˋ ˙ㄉㄜ ㄨㄣˊ ㄨㄣˊ ㄒㄧㄠˇ ㄏㄨㄚ ㄗㄞˋ ㄏㄢˋ ㄌㄧㄣˊ ㄐㄩ ˙ㄉㄜ ㄒㄧㄠˇ ㄍㄡˇ ㄉㄧㄢˇ ㄊㄡˊ ㄉㄚˇ ㄓㄠ ˙ㄏㄨ',
          'ㄨㄟˊ ㄈㄥ ㄔㄨㄟ ㄍㄨㄛˋ ㄘㄠˇ ㄉㄧˋ ㄅㄨˋ ㄉㄧㄥ ㄆㄥˊ ㄙㄨㄥ ˙ㄉㄜ ㄨㄟˇ ˙ㄅㄚ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄧㄠˊ ˙ㄍㄜ ㄅㄨˋ ㄊㄧㄥˊ',
        ],
        englishGist:
          'Every morning, Shiba Inu Pudding spins excitedly for his walk, politely greets flowers and neighborhood dogs, and wags his fluffy tail.',
        spotlightVocab: [
          {
            word: '興奮',
            zhuyin: 'ㄒㄧㄥ ㄈㄣˋ',
            hint: 'excited（非常激動、開心）',
          },
          {
            word: '禮貌',
            zhuyin: 'ㄌㄧˇ ㄇㄠˋ',
            hint: 'polite（有教養、待人友善）',
          },
          {
            word: '蓬鬆',
            zhuyin: 'ㄆㄥˊ ㄙㄨㄥ',
            hint: 'fluffy and soft（毛髮鬆鬆軟軟的樣子）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t1-pet-p2-q1',
            skillTag: '細節閱讀',
            prompt: '布丁看到什麼東西會興奮地原地轉圈圈？',
            choices: ['牽繩', '飼料碗', '飛盤', '雨衣'],
            choiceZhuyin: ['ㄑㄧㄢ ㄕㄥˊ', 'ㄙˋ ㄌㄧㄠˋ ㄨㄢˇ', 'ㄈㄟ ㄆㄢˊ', 'ㄩˇ ㄧ'],
            correctIndex: 0,
            explanation: '文章第一句清楚說明：「柴犬布丁一看到牽繩就興奮地原地轉圈圈。」',
          },
          {
            id: 'zh-read-t1-pet-p2-q2',
            skillTag: '語境理解',
            prompt: '文中形容尾巴「蓬鬆」，表示尾巴摸起來像什麼感覺？',
            choices: ['硬硬冰冰的', '溼答答的', '鬆鬆軟軟的', '細細光禿的'],
            choiceZhuyin: [
              'ㄧㄥˋ ㄧㄥˋ ㄅㄧㄥ ㄅㄧㄥ ˙ㄉㄜ',
              'ㄕ ㄉㄚ ㄉㄚ ˙ㄉㄜ',
              'ㄙㄨㄥ ㄙㄨㄥ ㄖㄨㄢˇ ㄖㄨㄢˇ ˙ㄉㄜ',
              'ㄒㄧˋ ㄒㄧˋ ㄍㄨㄤ ㄊㄨ ˙ㄉㄜ',
            ],
            correctIndex: 2,
            explanation: '「蓬鬆」形容毛髮或物體鬆軟飽滿、不扁塌的樣子。',
          },
          {
            id: 'zh-read-t1-pet-p2-q3',
            skillTag: '文意推論',
            prompt: '從布丁在公園裡的表現，可以推測牠是一隻個性怎樣的小狗？',
            choices: [
              '很膽小，不敢靠近別人',
              '喜歡亂咬公園裡的花朵',
              '討厭出門散步',
              '友善活潑、非常喜歡與大家互動',
            ],
            correctIndex: 3,
            explanation: '布丁會禮貌聞花、和鄰居小狗打招呼，還開心地搖尾巴，顯示牠既活潑又友善。',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 2 · 故事核心（2 組 / 4 篇故事 / 12 題）
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'zh-read-t2-festivals',
    subjectId: 'chinese',
    tier: 2,
    title: '節慶奇遇故事',
    shortTag: '節慶故事',
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    emblemCollectibleId: 'midautumn-mochi-rabbit',
    passages: [
      {
        id: 'zh-read-t2-fest-p1',
        title: '中秋柚子帽大賽',
        titleZhuyin: 'ㄓㄨㄥ ㄑㄧㄡ ㄧㄡˋ ˙ㄗ ㄇㄠˋ ㄉㄚˋ ㄙㄞˋ',
        sentences: [
          '中秋節晚上，全家人坐在院子裡一邊賞月，一邊品嘗香甜的文旦柚。',
          '爸爸靈機一動，把柚子皮戴在妹妹頭上，做成一頂清香的柚子帽。',
          '大家看著她滑稽的模樣，忍不住哈哈大笑。',
        ],
        sentencesZhuyin: [
          'ㄓㄨㄥ ㄑㄧㄡ ㄐㄧㄝˊ ㄨㄢˇ ㄕㄤˋ ㄑㄩㄢˊ ㄐㄧㄚ ㄖㄣˊ ㄗㄨㄛˋ ㄗㄞˋ ㄩㄢˋ ˙ㄗ ㄌㄧˇ ㄧ ㄅㄧㄢ ㄕㄤˇ ㄩㄝˋ ㄧ ㄅㄧㄢ ㄆㄧㄣˇ ㄔㄤˊ ㄒㄧㄤ ㄊㄧㄢˊ ˙ㄉㄜ ㄨㄣˊ ㄉㄢˋ ㄧㄡˋ',
          'ㄅㄚˋ ˙ㄅㄚ ㄌㄧㄥˊ ㄐㄧ ㄧ ㄉㄨㄥˋ ㄅㄚˇ ㄧㄡˋ ˙ㄗ ㄆㄧˊ ㄉㄞˋ ㄗㄞˋ ㄇㄟˋ ˙ㄇㄟ ㄊㄡˊ ㄕㄤˋ ㄗㄨㄛˋ ㄔㄥˊ ㄧ ㄉㄧㄥˇ ㄑㄧㄥ ㄒㄧㄤ ˙ㄉㄜ ㄧㄡˋ ˙ㄗ ㄇㄠˋ',
          'ㄉㄚˋ ㄐㄧㄚ ㄎㄢˋ ˙ㄓㄜ ㄊㄚ ㄏㄨㄚˊ ㄐㄧ ˙ㄉㄜ ㄇㄨˊ ㄧㄤˋ ㄖㄣˇ ㄅㄨˋ ㄓㄨˋ ㄏㄚ ㄏㄚ ㄉㄚˋ ㄒㄧㄠˋ',
        ],
        englishGist:
          'While admiring the Mid-Autumn moon and eating pomelos, Dad suddenly turns a fragrant pomelo peel into a funny hat for little sister.',
        spotlightVocab: [
          {
            word: '賞月',
            zhuyin: 'ㄕㄤˇ ㄩㄝˋ',
            hint: 'admire the full moon（觀賞美麗的月亮）',
          },
          {
            word: '靈機一動',
            zhuyin: 'ㄌㄧㄥˊ ㄐㄧ ㄧ ㄉㄨㄥˋ',
            hint: 'have a sudden bright idea（腦中突然閃出好點子）',
          },
          {
            word: '滑稽',
            zhuyin: 'ㄏㄨㄚˊ ㄐㄧ',
            hint: 'funny and comical（逗趣、讓人發笑的樣子）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t2-fest-p1-q1',
            skillTag: '成語運用',
            prompt: '爸爸突然想到把柚子皮做成帽子，最適合用哪個成語形容？',
            choices: ['垂頭喪氣', '靈機一動', '目瞪口呆', '半途而廢'],
            choiceZhuyin: [
              'ㄔㄨㄟˊ ㄊㄡˊ ㄙㄤˋ ㄑㄧˋ',
              'ㄌㄧㄥˊ ㄐㄧ ㄧ ㄉㄨㄥˋ',
              'ㄇㄨˋ ㄉㄥˋ ㄎㄡˇ ㄉㄞ',
              'ㄅㄢˋ ㄊㄨˊ ㄦˊ ㄈㄟˋ',
            ],
            correctIndex: 1,
            explanation: '「靈機一動」形容腦筋一轉，忽然想出巧妙有趣的好辦法。',
          },
          {
            id: 'zh-read-t2-fest-p1-q2',
            skillTag: '細節閱讀',
            prompt: '全家人中秋節晚上是在哪裡賞月吃文旦柚？',
            choices: ['在書房裡', '在公園草地', '在院子裡', '在學校禮堂'],
            choiceZhuyin: [
              'ㄗㄞˋ ㄕㄨ ㄈㄤˊ ㄌㄧˇ',
              'ㄗㄞˋ ㄍㄨㄥ ㄩㄢˊ ㄘㄠˇ ㄉㄧˋ',
              'ㄗㄞˋ ㄩㄢˋ ˙ㄗ ㄌㄧˇ',
              'ㄗㄞˋ ㄒㄩㄝˊ ㄒㄧㄠˋ ㄌㄧˇ ㄊㄤˊ',
            ],
            correctIndex: 2,
            explanation: '文章第一句提到：「全家人坐在院子裡一邊賞月，一邊品嘗香甜的文旦柚。」',
          },
          {
            id: 'zh-read-t2-fest-p1-q3',
            skillTag: '文意推論',
            prompt: '大家忍不住哈哈大笑，可以看出當時家裡的氣氛如何？',
            choices: [
              '溫馨歡樂，充滿笑聲',
              '大家生氣爸爸浪費水果',
              '妹妹因為帽子太重哭了出來',
              '大家忘記看月亮覺得很可惜',
            ],
            correctIndex: 0,
            explanation: '全家一起賞月、玩柚子帽並哈哈大笑，呈現出溫馨又歡樂的節慶氣氛。',
          },
        ],
      },
      {
        id: 'zh-read-t2-fest-p2',
        title: '元宵燈籠猜謎趣',
        titleZhuyin: 'ㄩㄢˊ ㄒㄧㄠ ㄉㄥ ˙ㄌㄨㄥ ㄘㄞ ㄇㄧˊ ㄑㄩˋ',
        sentences: [
          '元宵夜的廣場掛滿五顏六色的花燈，把夜空照得亮晶晶的。',
          '小琳拿著自己摺的小兔子燈籠，在燈謎牆前絞盡腦汁地思考。',
          '猜中謎底的那一刻，她開心得手舞足蹈！',
        ],
        sentencesZhuyin: [
          'ㄩㄢˊ ㄒㄧㄠ ㄧㄝˋ ˙ㄉㄜ ㄍㄨㄤˇ ㄔㄤˇ ㄍㄨㄚˋ ㄇㄢˇ ㄨˇ ㄧㄢˊ ㄌㄧㄡˋ ㄙㄜˋ ˙ㄉㄜ ㄏㄨㄚ ㄉㄥ ㄅㄚˇ ㄧㄝˋ ㄎㄨㄥ ㄓㄠˋ ˙ㄉㄜ ㄌㄧㄤˋ ㄐㄧㄥ ㄐㄧㄥ ˙ㄉㄜ',
          'ㄒㄧㄠˇ ㄌㄧㄣˊ ㄋㄚˊ ˙ㄓㄜ ㄗˋ ㄐㄧˇ ㄓㄜˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄊㄨˋ ˙ㄗ ㄉㄥ ˙ㄌㄨㄥ ㄗㄞˋ ㄉㄥ ㄇㄧˊ ㄑㄧㄤˊ ㄑㄧㄢˊ ㄐㄧㄠˇ ㄐㄧㄣˋ ㄋㄠˇ ㄓ ˙ㄉㄜ ㄙ ㄎㄠˇ',
          'ㄘㄞ ㄓㄨㄥˋ ㄇㄧˊ ㄉㄧˇ ˙ㄉㄜ ㄋㄚˋ ㄧ ㄎㄜˋ ㄊㄚ ㄎㄞ ㄒㄧㄣ ˙ㄉㄜ ㄕㄡˇ ㄨˇ ㄗㄨˊ ㄉㄠˋ',
        ],
        englishGist:
          'At the colorful Lantern Festival square, Xiaolin holds her handmade bunny lantern, thinks hard at the riddle wall, and dances with joy when she solves one!',
        spotlightVocab: [
          {
            word: '五顏六色',
            zhuyin: 'ㄨˇ ㄧㄢˊ ㄌㄧㄡˋ ㄙㄜˋ',
            hint: 'colorful / full of bright colors（顏色非常繽紛多樣）',
          },
          {
            word: '絞盡腦汁',
            zhuyin: 'ㄐㄧㄠˇ ㄐㄧㄣˋ ㄋㄠˇ ㄓ',
            hint: 'rack one’s brains（費盡心思、非常用力思考）',
          },
          {
            word: '手舞足蹈',
            zhuyin: 'ㄕㄡˇ ㄨˇ ㄗㄨˊ ㄉㄠˋ',
            hint: 'dance for joy（高興到手腳都跟著舞動）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t2-fest-p2-q1',
            skillTag: '語境理解',
            prompt: '小琳在燈謎牆前「絞盡腦汁」，表示她正在做什麼？',
            choices: [
              '隨意猜一個答案',
              '請旁邊的大人直接告訴她',
              '忙著畫兔子燈籠',
              '非常用力地動腦思考謎底',
            ],
            correctIndex: 3,
            explanation: '「絞盡腦汁」比喻把腦袋裡所有的心思都用上，全力思考難題。',
          },
          {
            id: 'zh-read-t2-fest-p2-q2',
            skillTag: '成語運用',
            prompt: '哪一個成語最適合形容「高興到忍不住揮手跳起來」的樣子？',
            choices: ['手舞足蹈', '井底之蛙', '畫蛇添足', '風平浪靜'],
            choiceZhuyin: [
              'ㄕㄡˇ ㄨˇ ㄗㄨˊ ㄉㄠˋ',
              'ㄐㄧㄥˇ ㄉㄧˇ ㄓ ㄨㄚ',
              'ㄏㄨㄚˋ ㄕㄜˊ ㄊㄧㄢ ㄗㄨˊ',
              'ㄈㄥ ㄆㄧㄥˊ ㄌㄤˋ ㄐㄧㄥˋ',
            ],
            correctIndex: 0,
            explanation: '「手舞足蹈」就是手揮舞、腳跳動，用來形容非常開心的模樣。',
          },
          {
            id: 'zh-read-t2-fest-p2-q3',
            skillTag: '細節閱讀',
            prompt: '小琳手上拿的小兔子燈籠是從哪裡來的？',
            choices: ['在夜市攤位買的', '猜燈謎贏來的獎品', '她自己動手摺的', '朋友借給她的'],
            correctIndex: 2,
            explanation: '第二句提到：「小琳拿著自己摺的小兔子燈籠」。',
          },
        ],
      },
    ],
  },

  {
    id: 'zh-read-t2-school-club',
    subjectId: 'chinese',
    tier: 2,
    title: '校園社團趣事',
    shortTag: '校園社團',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    emblemCollectibleId: 'music-palette-otter',
    passages: [
      {
        id: 'zh-read-t2-club-p1',
        title: '壁報合作大作戰',
        titleZhuyin: 'ㄅㄧˋ ㄅㄠˋ ㄏㄜˊ ㄗㄨㄛˋ ㄉㄚˋ ㄗㄨㄛˋ ㄓㄢˋ',
        sentences: [
          '美術社要做海洋保護海報，大家決定分工合作。',
          '小安畫海龜，小芸仔細幫珊瑚塗水彩，我則寫下工整的標題。',
          '因為全組同心協力，海報最後贏得了全校第一名！',
        ],
        sentencesZhuyin: [
          'ㄇㄟˇ ㄕㄨˋ ㄕㄜˋ ㄧㄠˋ ㄗㄨㄛˋ ㄏㄞˇ ㄧㄤˊ ㄅㄠˇ ㄏㄨˋ ㄏㄞˇ ㄅㄠˋ ㄉㄚˋ ㄐㄧㄚ ㄐㄩㄝˊ ㄉㄧㄥˋ ㄈㄣ ㄍㄨㄥ ㄏㄜˊ ㄗㄨㄛˋ',
          'ㄒㄧㄠˇ ㄢ ㄏㄨㄚˋ ㄏㄞˇ ㄍㄨㄟ ㄒㄧㄠˇ ㄩㄣˊ ㄗˇ ㄒㄧˋ ㄅㄤ ㄕㄢ ㄏㄨˊ ㄊㄨˊ ㄕㄨㄟˇ ㄘㄞˇ ㄨㄛˇ ㄗㄜˊ ㄒㄧㄝˇ ㄒㄧㄚˋ ㄍㄨㄥ ㄓㄥˇ ˙ㄉㄜ ㄅㄧㄠ ㄊㄧˊ',
          'ㄧㄣ ㄨㄟˋ ㄑㄩㄢˊ ㄗㄨˇ ㄊㄨㄥˊ ㄒㄧㄣ ㄒㄧㄝˊ ㄌㄧˋ ㄏㄞˇ ㄅㄠˋ ㄗㄨㄟˋ ㄏㄡˋ ㄧㄥˊ ㄉㄜˊ ˙ㄌㄜ ㄑㄩㄢˊ ㄒㄧㄠˋ ㄉㄧˋ ㄧ ㄇㄧㄥˊ',
        ],
        englishGist:
          'Art club teammates divide the work on an ocean-protection poster—drawing turtles, painting coral, and lettering—and win first place together!',
        spotlightVocab: [
          {
            word: '分工合作',
            zhuyin: 'ㄈㄣ ㄍㄨㄥ ㄏㄜˊ ㄗㄨㄛˋ',
            hint: 'divide tasks and work together（各自負責不同部分再合作完成）',
          },
          {
            word: '工整',
            zhuyin: 'ㄍㄨㄥ ㄓㄥˇ',
            hint: 'neat and tidy（字跡或排列端正整齊）',
          },
          {
            word: '同心協力',
            zhuyin: 'ㄊㄨㄥˊ ㄒㄧㄣ ㄒㄧㄝˊ ㄌㄧˋ',
            hint: 'work together with one heart（齊心合作、一起努力）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t2-club-p1-q1',
            skillTag: '成語運用',
            prompt: '全組同學朝同一個目標互相配合、一起努力，最適合用哪一個成語？',
            choices: ['自言自語', '東張西望', '同心協力', '一舉兩得'],
            choiceZhuyin: [
              'ㄗˋ ㄧㄢˊ ㄗˋ ㄩˇ',
              'ㄉㄨㄥ ㄓㄤ ㄒㄧ ㄨㄤˋ',
              'ㄊㄨㄥˊ ㄒㄧㄣ ㄒㄧㄝˊ ㄌㄧˋ',
              'ㄧ ㄐㄩˇ ㄌㄧㄤˇ ㄉㄜˊ',
            ],
            correctIndex: 2,
            explanation: '「同心協力」指大家心意一致、共同出力完成任務。',
          },
          {
            id: 'zh-read-t2-club-p1-q2',
            skillTag: '細節閱讀',
            prompt: '在這張海洋海報的分工中，小芸負責做哪一項工作？',
            choices: ['畫海龜', '幫珊瑚塗水彩', '寫標題', '張貼海報'],
            choiceZhuyin: [
              'ㄏㄨㄚˋ ㄏㄞˇ ㄍㄨㄟ',
              'ㄅㄤ ㄕㄢ ㄏㄨˊ ㄊㄨˊ ㄕㄨㄟˇ ㄘㄞˇ',
              'ㄒㄧㄝˇ ㄅㄧㄠ ㄊㄧˊ',
              'ㄓㄤ ㄊㄧㄝ ㄏㄞˇ ㄅㄠˋ',
            ],
            correctIndex: 1,
            explanation: '第二句寫著：「小芸仔細幫珊瑚塗水彩」。',
          },
          {
            id: 'zh-read-t2-club-p1-q3',
            skillTag: '文意推論',
            prompt: '這篇短文最想告訴我們什麼道理？',
            choices: [
              '畫畫一定要用水彩才會得獎',
              '寫字比畫畫更重要',
              '參加美術社比其他社團好玩',
              '團隊善用分工並齊心合作，更容易做出好作品',
            ],
            correctIndex: 3,
            explanation: '三人各展所長、分工合作又同心協力，才讓海報贏得全校第一名。',
          },
        ],
      },
      {
        id: 'zh-read-t2-club-p2',
        title: '音樂會前的小插曲',
        titleZhuyin: 'ㄧㄣ ㄩㄝˋ ㄏㄨㄟˋ ㄑㄧㄢˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄔㄚ ㄑㄩˇ',
        sentences: [
          '音樂會前五分鐘，小宇發現直笛少了一截，急得像熱鍋上的螞蟻。',
          '小真立刻借出備用直笛，還溫柔地安慰他別緊張。',
          '兩人上台後默契十足，吹出清脆動聽的樂曲。',
        ],
        sentencesZhuyin: [
          'ㄧㄣ ㄩㄝˋ ㄏㄨㄟˋ ㄑㄧㄢˊ ㄨˇ ㄈㄣ ㄓㄨㄥ ㄒㄧㄠˇ ㄩˇ ㄈㄚ ㄒㄧㄢˋ ㄓˊ ㄉㄧˊ ㄕㄠˇ ˙ㄌㄜ ㄧ ㄐㄧㄝˊ ㄐㄧˊ ˙ㄉㄜ ㄒㄧㄤˋ ㄖㄜˋ ㄍㄨㄛ ㄕㄤˋ ˙ㄉㄜ ㄇㄚˇ ㄧˇ',
          'ㄒㄧㄠˇ ㄓㄣ ㄌㄧˋ ㄎㄜˋ ㄐㄧㄝˋ ㄔㄨ ㄅㄟˋ ㄩㄥˋ ㄓˊ ㄉㄧˊ ㄏㄞˊ ㄨㄣ ㄖㄡˊ ˙ㄉㄜ ㄢ ㄨㄟˋ ㄊㄚ ㄅㄧㄝˊ ㄐㄧㄣˇ ㄓㄤ',
          'ㄌㄧㄤˇ ㄖㄣˊ ㄕㄤˋ ㄊㄞˊ ㄏㄡˋ ㄇㄛˋ ㄑㄧˋ ㄕˊ ㄗㄨˊ ㄔㄨㄟ ㄔㄨ ㄑㄧㄥ ㄘㄨㄟˋ ㄉㄨㄥˋ ㄊㄧㄥ ˙ㄉㄜ ㄩㄝˋ ㄑㄩˇ',
        ],
        englishGist:
          'Five minutes before the school recital, Xiaoyu’s recorder is missing a piece, so Xiaozhen lends her spare and calms him down for a crisp performance.',
        spotlightVocab: [
          {
            word: '插曲',
            zhuyin: 'ㄔㄚ ㄑㄩˇ',
            hint: 'unexpected little incident（過程中突然發生的小意外）',
          },
          {
            word: '默契',
            zhuyin: 'ㄇㄛˋ ㄑㄧˋ',
            hint: 'unspoken teamwork / harmony（不用多說就能配合得很好）',
          },
          {
            word: '清脆',
            zhuyin: 'ㄑㄧㄥ ㄘㄨㄟˋ',
            hint: 'clear and crisp sound（聲音明亮好聽）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t2-club-p2-q1',
            skillTag: '語境理解',
            prompt: '文中說小宇「急得像熱鍋上的螞蟻」，意思是小宇當時怎麼了？',
            choices: [
              '焦急萬分、坐立不安',
              '覺得舞台燈光太熱了',
              '在後台看到好多螞蟻',
              '肚子餓得想吃熱湯',
            ],
            correctIndex: 0,
            explanation: '「熱鍋上的螞蟻」是常見俗諺，比喻人非常慌張著急、不知如何是好。',
          },
          {
            id: 'zh-read-t2-club-p2-q2',
            skillTag: '細節閱讀',
            prompt: '小真用了哪兩種方式幫助小宇？',
            choices: [
              '幫他修直笛，並請老師延後演出',
              '陪他跑回家拿直笛，並幫他拿樂譜',
              '替他上台獨奏，並借他節拍器',
              '借他備用直笛，還溫柔安慰他別緊張',
            ],
            correctIndex: 3,
            explanation: '第二句提到，小真既借出備用直笛，又溫柔地安慰小宇別緊張。',
          },
          {
            id: 'zh-read-t2-club-p2-q3',
            skillTag: '文意推論',
            prompt: '最後演出非常成功，除了練習以外，還有什麼重要原因？',
            choices: [
              '比賽評審給分很寬鬆',
              '小真及時伸出援手，讓小宇安定下來並發揮默契',
              '他們臨時改唱歌曲代替吹直笛',
              '舞台下面幾乎沒有觀眾',
            ],
            correctIndex: 1,
            explanation: '因為小真的幫忙與安慰化解了突發狀況，兩人才得以在台上展現十足默契。',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 3 · 四年級閱讀（2 組 / 4 篇故事 / 12 題）
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'zh-read-t3-fable-idioms',
    subjectId: 'chinese',
    tier: 3,
    title: '寓言成語小劇場',
    shortTag: '寓言成語',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    emblemCollectibleId: 'critter-moon-owl',
    passages: [
      {
        id: 'zh-read-t3-fable-p1',
        title: '井底之蛙看大海',
        titleZhuyin: 'ㄐㄧㄥˇ ㄉㄧˇ ㄓ ㄨㄚ ㄎㄢˋ ㄉㄚˋ ㄏㄞˇ',
        sentences: [
          '住在古井裡的小青蛙，一直以為頭頂圓圓的天空就是全世界。',
          '某天大海龜路過井口，向牠描繪無邊無際的蔚藍海洋。',
          '青蛙這才恍然大悟，決心跳出深井去探索世界。',
        ],
        sentencesZhuyin: [
          'ㄓㄨˋ ㄗㄞˋ ㄍㄨˇ ㄐㄧㄥˇ ㄌㄧˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄑㄧㄥ ㄨㄚ ㄧ ㄓˊ ㄧˇ ㄨㄟˊ ㄊㄡˊ ㄉㄧㄥˇ ㄩㄢˊ ㄩㄢˊ ˙ㄉㄜ ㄊㄧㄢ ㄎㄨㄥ ㄐㄧㄡˋ ㄕˋ ㄑㄩㄢˊ ㄕˋ ㄐㄧㄝˋ',
          'ㄇㄡˇ ㄊㄧㄢ ㄉㄚˋ ㄏㄞˇ ㄍㄨㄟ ㄌㄨˋ ㄍㄨㄛˋ ㄐㄧㄥˇ ㄎㄡˇ ㄒㄧㄤˋ ㄊㄚ ㄇㄧㄠˊ ㄏㄨㄟˋ ㄨˊ ㄅㄧㄢ ㄨˊ ㄐㄧˋ ˙ㄉㄜ ㄨㄟˋ ㄌㄢˊ ㄏㄞˇ ㄧㄤˊ',
          'ㄑㄧㄥ ㄨㄚ ㄓㄜˋ ㄘㄞˊ ㄏㄨㄤˇ ㄖㄢˊ ㄉㄚˋ ㄨˋ ㄐㄩㄝˊ ㄒㄧㄣ ㄊㄧㄠˋ ㄔㄨ ㄕㄣ ㄐㄧㄥˇ ㄑㄩˋ ㄊㄢˋ ㄙㄨㄛˇ ㄕˋ ㄐㄧㄝˋ',
        ],
        englishGist:
          'A frog living in an old well thinks the round sky above is the whole world until a sea turtle describes the endless ocean, inspiring it to leap out and explore.',
        spotlightVocab: [
          {
            word: '無邊無際',
            zhuyin: 'ㄨˊ ㄅㄧㄢ ㄨˊ ㄐㄧˋ',
            hint: 'boundless / stretching without end（廣大得看不到邊界）',
          },
          {
            word: '恍然大悟',
            zhuyin: 'ㄏㄨㄤˇ ㄖㄢˊ ㄉㄚˋ ㄨˋ',
            hint: 'suddenly realize the truth（一下子完全明白過來）',
          },
          {
            word: '探索',
            zhuyin: 'ㄊㄢˋ ㄙㄨㄛˇ',
            hint: 'explore and discover（主動去尋找和認識新事物）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t3-fable-p1-q1',
            skillTag: '成語運用',
            prompt: '人們常說的「井底之蛙」，通常用來提醒我們避免哪種心態？',
            choices: [
              '做事太過匆忙急躁',
              '眼界狹小卻自以為懂得很多',
              '遇到困難就放棄練習',
              '花太多時間和朋友聊天',
            ],
            correctIndex: 1,
            explanation: '「井底之蛙」比喻見識短淺，卻把小小範圍當成整個世界。',
          },
          {
            id: 'zh-read-t3-fable-p1-q2',
            skillTag: '語境理解',
            prompt: '小青蛙聽完大海龜的描述後「恍然大悟」，代表牠此刻的心情是？',
            choices: ['迷迷糊糊', '氣呼呼的', '半信半疑', '突然明白'],
            choiceZhuyin: [
              'ㄇㄧˊ ㄇㄧˊ ㄏㄨˊ ㄏㄨˊ',
              'ㄑㄧˋ ㄏㄨ ㄏㄨ ˙ㄉㄜ',
              'ㄅㄢˋ ㄒㄧㄣˋ ㄅㄢˋ ㄧˊ',
              'ㄊㄨˊ ㄖㄢˊ ㄇㄧㄥˊ ㄅㄞˊ',
            ],
            correctIndex: 3,
            explanation: '「恍然大悟」指原本不懂或誤會的事，在聽見說明後豁然明白。',
          },
          {
            id: 'zh-read-t3-fable-p1-q3',
            skillTag: '文意推論',
            prompt: '最後小青蛙決定跳出深井，最符合哪一種成長態度？',
            choices: [
              '願意打開眼界、勇敢認識更大的世界',
              '不想再跟大海龜當朋友',
              '覺得古井裡的水不夠冰涼',
              '想找一口比原來更深的井',
            ],
            correctIndex: 0,
            explanation: '小青蛙不再滿足於狹小的井底，決心走出去探索外面的世界，展現了開放與勇氣。',
          },
        ],
      },
      {
        id: 'zh-read-t3-fable-p2',
        title: '畫蛇添足的教訓',
        titleZhuyin: 'ㄏㄨㄚˋ ㄕㄜˊ ㄊㄧㄢ ㄗㄨˊ ˙ㄉㄜ ㄐㄧㄠˋ ㄒㄩㄣˋ',
        sentences: [
          '古代朋友比賽畫蛇，約定最先畫完的人能喝一壺甜酒。',
          '一人畫得飛快，卻得意忘形地幫蛇多畫了四隻腳。',
          '第二位畫完的人搶先拿走酒壺，笑說蛇本來就沒有腳！',
        ],
        sentencesZhuyin: [
          'ㄍㄨˇ ㄉㄞˋ ㄆㄥˊ ˙ㄧㄡ ㄅㄧˇ ㄙㄞˋ ㄏㄨㄚˋ ㄕㄜˊ ㄩㄝ ㄉㄧㄥˋ ㄗㄨㄟˋ ㄒㄧㄢ ㄏㄨㄚˋ ㄨㄢˊ ˙ㄉㄜ ㄖㄣˊ ㄋㄥˊ ㄏㄜ ㄧ ㄏㄨˊ ㄊㄧㄢˊ ㄐㄧㄡˇ',
          'ㄧ ㄖㄣˊ ㄏㄨㄚˋ ˙ㄉㄜ ㄈㄟ ㄎㄨㄞˋ ㄑㄩㄝˋ ㄉㄜˊ ㄧˋ ㄨㄤˋ ㄒㄧㄥˊ ˙ㄉㄜ ㄅㄤ ㄕㄜˊ ㄉㄨㄛ ㄏㄨㄚˋ ˙ㄌㄜ ㄙˋ ㄓ ㄐㄧㄠˇ',
          'ㄉㄧˋ ㄦˋ ㄨㄟˋ ㄏㄨㄚˋ ㄨㄢˊ ˙ㄉㄜ ㄖㄣˊ ㄑㄧㄤˇ ㄒㄧㄢ ㄋㄚˊ ㄗㄡˇ ㄐㄧㄡˇ ㄏㄨˊ ㄒㄧㄠˋ ㄕㄨㄛ ㄕㄜˊ ㄅㄣˇ ㄌㄞˊ ㄐㄧㄡˋ ㄇㄟˊ ㄧㄡˇ ㄐㄧㄠˇ',
        ],
        englishGist:
          'In a snake-drawing race for a jug of sweet wine, the fastest artist gets cocky and adds four feet—losing the prize because snakes do not have feet!',
        spotlightVocab: [
          {
            word: '約定',
            zhuyin: 'ㄩㄝ ㄉㄧㄥˋ',
            hint: 'agree upon a rule（事先說好並共同遵守）',
          },
          {
            word: '得意忘形',
            zhuyin: 'ㄉㄜˊ ㄧˋ ㄨㄤˋ ㄒㄧㄥˊ',
            hint: 'get carried away by pride（太驕傲而忘記分寸）',
          },
          {
            word: '畫蛇添足',
            zhuyin: 'ㄏㄨㄚˋ ㄕㄜˊ ㄊㄧㄢ ㄗㄨˊ',
            hint: 'ruin something by adding unneeded extras（多此一舉，反而弄巧成拙）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t3-fable-p2-q1',
            skillTag: '成語運用',
            prompt: '這張卡片已經很完美了，如果再硬加上多餘的貼紙反而變雜亂，這種情況叫什麼？',
            choices: ['雪中送炭', '一舉兩得', '畫蛇添足', '持之以恆'],
            choiceZhuyin: [
              'ㄒㄩㄝˇ ㄓㄨㄥ ㄙㄨㄥˋ ㄊㄢˋ',
              'ㄧ ㄐㄩˇ ㄌㄧㄤˇ ㄉㄜˊ',
              'ㄏㄨㄚˋ ㄕㄜˊ ㄊㄧㄢ ㄗㄨˊ',
              'ㄔˊ ㄓ ㄧˇ ㄏㄥˊ',
            ],
            correctIndex: 2,
            explanation: '「畫蛇添足」比喻做了多餘的事，不但沒加分，反而把原本的好成果搞砸。',
          },
          {
            id: 'zh-read-t3-fable-p2-q2',
            skillTag: '細節閱讀',
            prompt: '原本畫得最快的人，最後為什麼沒有喝到甜酒？',
            choices: [
              '因為他多畫了四隻腳，畫的不再是蛇',
              '因為他的毛筆突然斷掉了',
              '因為他主動把酒壺讓給朋友',
              '因為他忘記畫蛇的眼睛',
            ],
            correctIndex: 0,
            explanation: '蛇本來沒有腳，他多畫四隻腳反而失去贏得比賽的資格。',
          },
          {
            id: 'zh-read-t3-fable-p2-q3',
            skillTag: '文意推論',
            prompt: '這則寓言給了我們什麼提醒？',
            choices: [
              '畫畫比賽速度越慢越好',
              '比賽前不用先訂好規則',
              '動物畫一定要畫出四隻腳才好看',
              '做事適可而止，不要因為驕傲而多此一舉',
            ],
            correctIndex: 3,
            explanation: '原本已經完成得很好，卻因得意忘形多此一舉，提醒我們做事應恰到好處。',
          },
        ],
      },
    ],
  },

  {
    id: 'zh-read-t3-nature-explorer',
    subjectId: 'chinese',
    tier: 3,
    title: '自然觀察筆記',
    shortTag: '自然筆記',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    emblemCollectibleId: 'butterfly-firefly-jar',
    passages: [
      {
        id: 'zh-read-t3-nature-p1',
        title: '夏夜的螢火蟲祕境',
        titleZhuyin: 'ㄒㄧㄚˋ ㄧㄝˋ ˙ㄉㄜ ㄧㄥˊ ㄏㄨㄛˇ ㄔㄨㄥˊ ㄇㄧˋ ㄐㄧㄥˋ',
        sentences: [
          '初夏夜晚，我們沿著沒有路燈的溪邊步道安靜前行。',
          '草叢裡閃起點點黃綠微光，像星星落進了森林。',
          '解說員提醒，手電筒會驚擾螢火蟲，賞螢時要保持黑暗與安靜。',
        ],
        sentencesZhuyin: [
          'ㄔㄨ ㄒㄧㄚˋ ㄧㄝˋ ㄨㄢˇ ㄨㄛˇ ˙ㄇㄣ ㄧㄢˊ ˙ㄓㄜ ㄇㄟˊ ㄧㄡˇ ㄌㄨˋ ㄉㄥ ˙ㄉㄜ ㄒㄧ ㄅㄧㄢ ㄅㄨˋ ㄉㄠˋ ㄢ ㄐㄧㄥˋ ㄑㄧㄢˊ ㄒㄧㄥˊ',
          'ㄘㄠˇ ㄘㄨㄥˊ ㄌㄧˇ ㄕㄢˇ ㄑㄧˇ ㄉㄧㄢˇ ㄉㄧㄢˇ ㄏㄨㄤˊ ㄌㄩˋ ㄨㄟˊ ㄍㄨㄤ ㄒㄧㄤˋ ㄒㄧㄥ ㄒㄧㄥ ㄌㄨㄛˋ ㄐㄧㄣˋ ˙ㄌㄜ ㄙㄣ ㄌㄧㄣˊ',
          'ㄐㄧㄝˇ ㄕㄨㄛ ㄩㄢˊ ㄊㄧˊ ㄒㄧㄥˇ ㄕㄡˇ ㄉㄧㄢˋ ㄊㄨㄥˇ ㄏㄨㄟˋ ㄐㄧㄥ ㄖㄠˇ ㄧㄥˊ ㄏㄨㄛˇ ㄔㄨㄥˊ ㄕㄤˇ ㄧㄥˊ ㄕˊ ㄧㄠˋ ㄅㄠˇ ㄔˊ ㄏㄟ ㄢˋ ㄩˇ ㄢ ㄐㄧㄥˋ',
        ],
        englishGist:
          'On an early summer walk along a dark creek trail, yellow-green fireflies sparkle like stars, and the guide reminds everyone to keep lights off and stay quiet.',
        spotlightVocab: [
          {
            word: '初夏',
            zhuyin: 'ㄔㄨ ㄒㄧㄚˋ',
            hint: 'early summer（夏天剛開始的時候）',
          },
          {
            word: '微光',
            zhuyin: 'ㄨㄟˊ ㄍㄨㄤ',
            hint: 'soft, gentle glow（微微發亮的光芒）',
          },
          {
            word: '驚擾',
            zhuyin: 'ㄐㄧㄥ ㄖㄠˇ',
            hint: 'startle and disturb（嚇到並打擾到生物）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t3-nature-p1-q1',
            skillTag: '細節閱讀',
            prompt: '解說員提醒大家賞螢時要怎麼做，才能保護螢火蟲？',
            choices: [
              '打開手電筒照亮草叢',
              '保持黑暗與安靜，不拿手電筒直射',
              '大聲呼喊螢火蟲飛過來',
              '把螢火蟲裝進玻璃瓶觀察',
            ],
            correctIndex: 1,
            explanation: '第三句明確指出：「手電筒會驚擾螢火蟲，賞螢時要保持黑暗與安靜。」',
          },
          {
            id: 'zh-read-t3-nature-p1-q2',
            skillTag: '語境理解',
            prompt: '句中「驚擾」最接近哪一個詞語的意思？',
            choices: ['照顧保護', '仔細觀察', '驚嚇打擾', '溫暖陪伴'],
            choiceZhuyin: [
              'ㄓㄠˋ ㄍㄨˋ ㄅㄠˇ ㄏㄨˋ',
              'ㄗˇ ㄒㄧˋ ㄍㄨㄢ ㄔㄚˊ',
              'ㄐㄧㄥ ㄒㄧㄚˋ ㄉㄚˇ ㄖㄠˇ',
              'ㄨㄣ ㄋㄨㄢˇ ㄆㄟˊ ㄅㄢˋ',
            ],
            correctIndex: 2,
            explanation: '「驚擾」就是使生物受到驚嚇與干擾，影響牠們原本的生活。',
          },
          {
            id: 'zh-read-t3-nature-p1-q3',
            skillTag: '文意推論',
            prompt: '為什麼作者把螢火蟲比喻成「星星落進了森林」？',
            choices: [
              '因為許多閃爍的微光在暗夜裡既美麗又夢幻',
              '因為那天晚上正好下起流星雨',
              '因為森林裡裝滿了星星形狀的路燈',
              '因為螢火蟲只會停在最高的樹頂',
            ],
            correctIndex: 0,
            explanation: '草叢裡點點閃耀的黃綠微光，在黑暗中就像滿天繁星降落到樹林裡一樣迷人。',
          },
        ],
      },
      {
        id: 'zh-read-t3-nature-p2',
        title: '蒲公英的降落傘',
        titleZhuyin: 'ㄆㄨˊ ㄍㄨㄥ ㄧㄥ ˙ㄉㄜ ㄐㄧㄤˋ ㄌㄨㄛˋ ㄙㄢˇ',
        sentences: [
          '春天草坪上，蒲公英開完黃花後，會變成毛茸茸的白色絨球。',
          '每顆種子都頂著輕巧的白色小傘，微風一吹就能隨風遠行。',
          '這種巧妙設計，讓它能在新土地生根發芽。',
        ],
        sentencesZhuyin: [
          'ㄔㄨㄣ ㄊㄧㄢ ㄘㄠˇ ㄆㄧㄥˊ ㄕㄤˋ ㄆㄨˊ ㄍㄨㄥ ㄧㄥ ㄎㄞ ㄨㄢˊ ㄏㄨㄤˊ ㄏㄨㄚ ㄏㄡˋ ㄏㄨㄟˋ ㄅㄧㄢˋ ㄔㄥˊ ㄇㄠˊ ㄖㄨㄥˊ ㄖㄨㄥˊ ˙ㄉㄜ ㄅㄞˊ ㄙㄜˋ ㄖㄨㄥˊ ㄑㄧㄡˊ',
          'ㄇㄟˇ ㄎㄜ ㄓㄨㄥˇ ˙ㄗ ㄉㄡ ㄉㄧㄥˇ ˙ㄓㄜ ㄑㄧㄥ ㄑㄧㄠˇ ˙ㄉㄜ ㄅㄞˊ ㄙㄜˋ ㄒㄧㄠˇ ㄙㄢˇ ㄨㄟˊ ㄈㄥ ㄧ ㄔㄨㄟ ㄐㄧㄡˋ ㄋㄥˊ ㄙㄨㄟˊ ㄈㄥ ㄩㄢˇ ㄒㄧㄥˊ',
          'ㄓㄜˋ ㄓㄨㄥˇ ㄑㄧㄠˇ ㄇㄧㄠˋ ㄕㄜˋ ㄐㄧˋ ㄖㄤˋ ㄊㄚ ㄋㄥˊ ㄗㄞˋ ㄒㄧㄣ ㄊㄨˇ ㄉㄧˋ ㄕㄥ ㄍㄣ ㄈㄚ ㄧㄚˊ',
        ],
        englishGist:
          'After blooming yellow, dandelions turn into fluffy white puffs whose tiny parachute seeds ride the breeze to sprout in new soil.',
        spotlightVocab: [
          {
            word: '毛茸茸',
            zhuyin: 'ㄇㄠˊ ㄖㄨㄥˊ ㄖㄨㄥˊ',
            hint: 'fuzzy and fluffy（細毛多而柔軟的樣子）',
          },
          {
            word: '巧妙',
            zhuyin: 'ㄑㄧㄠˇ ㄇㄧㄠˋ',
            hint: 'clever and ingenious（構想精巧又神奇）',
          },
          {
            word: '生根發芽',
            zhuyin: 'ㄕㄥ ㄍㄣ ㄈㄚ ㄧㄚˊ',
            hint: 'take root and sprout（長出根和新芽，開始成長）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t3-nature-p2-q1',
            skillTag: '細節閱讀',
            prompt: '蒲公英的種子主要是靠什麼力量飛到遠方？',
            choices: ['溪水沖刷', '蝴蝶搬運', '小狗毛髮', '微風吹送'],
            choiceZhuyin: [
              'ㄒㄧ ㄕㄨㄟˇ ㄔㄨㄥ ㄕㄨㄚ',
              'ㄏㄨˊ ㄉㄧㄝˊ ㄅㄢ ㄩㄣˋ',
              'ㄒㄧㄠˇ ㄍㄡˇ ㄇㄠˊ ㄈㄚˇ',
              'ㄨㄟˊ ㄈㄥ ㄔㄨㄟ ㄙㄨㄥˋ',
            ],
            correctIndex: 3,
            explanation: '第二句提到：「每顆種子都頂著輕巧的白色小傘，微風一吹就能隨風遠行。」',
          },
          {
            id: 'zh-read-t3-nature-p2-q2',
            skillTag: '語境理解',
            prompt: '標題裡的「降落傘」其實是指蒲公英的哪一個部分？',
            choices: ['黃色的花瓣', '種子頂端輕巧的白色絨毛', '埋在土裡的樹根', '綠色鋸齒狀葉片'],
            correctIndex: 1,
            explanation: '文章把種子頂著的輕巧白色小傘比喻為「降落傘」，幫助種子在空中飄飛。',
          },
          {
            id: 'zh-read-t3-nature-p2-q3',
            skillTag: '文意推論',
            prompt: '如果蒲公英的種子變得又重又沒有絨毛，最可能發生什麼事？',
            choices: [
              '它會飛得比以前更高更遠',
              '它會變成藍色的花朵',
              '它很難乘著微風飄去遠方的新土地',
              '它不需要陽光也能開花',
            ],
            correctIndex: 2,
            explanation: '正因種子輕巧又帶有白色絨毛小傘，才能隨風遠行到新土地生根發芽。',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 4 · 進階寫作（2 組 / 4 篇故事 / 12 題）
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'zh-read-t4-history-idioms',
    subjectId: 'chinese',
    tier: 4,
    title: '經典成語典故館',
    shortTag: '成語典故',
    accentHex: '#B45309',
    bgHex: '#FEF3C7',
    emblemCollectibleId: 'festival-golden-dragon',
    passages: [
      {
        id: 'zh-read-t4-hist-p1',
        title: '鐵杵磨成繡花針',
        titleZhuyin: 'ㄊㄧㄝˇ ㄔㄨˇ ㄇㄛˊ ㄔㄥˊ ㄒㄧㄡˋ ㄏㄨㄚ ㄓㄣ',
        sentences: [
          '李白年少時曾想放棄讀書，路過溪邊卻見老婆婆用石頭磨粗鐵棒。',
          '婆婆說，只要堅持不懈，粗鐵棒也能磨成細細的繡花針。',
          '李白深受感動，從此發憤用功，成了大詩人。',
        ],
        sentencesZhuyin: [
          'ㄌㄧˇ ㄅㄞˊ ㄋㄧㄢˊ ㄕㄠˋ ㄕˊ ㄘㄥˊ ㄒㄧㄤˇ ㄈㄤˋ ㄑㄧˋ ㄉㄨˊ ㄕㄨ ㄌㄨˋ ㄍㄨㄛˋ ㄒㄧ ㄅㄧㄢ ㄑㄩㄝˋ ㄐㄧㄢˋ ㄌㄠˇ ㄆㄛˊ ˙ㄆㄛ ㄩㄥˋ ㄕˊ ˙ㄊㄡ ㄇㄛˊ ㄘㄨ ㄊㄧㄝˇ ㄅㄤˋ',
          'ㄆㄛˊ ˙ㄆㄛ ㄕㄨㄛ ㄓˇ ㄧㄠˋ ㄐㄧㄢ ㄔˊ ㄅㄨˋ ㄒㄧㄝˋ ㄘㄨ ㄊㄧㄝˇ ㄅㄤˋ ㄧㄝˇ ㄋㄥˊ ㄇㄛˊ ㄔㄥˊ ㄒㄧˋ ㄒㄧˋ ˙ㄉㄜ ㄒㄧㄡˋ ㄏㄨㄚ ㄓㄣ',
          'ㄌㄧˇ ㄅㄞˊ ㄕㄣ ㄕㄡˋ ㄍㄢˇ ㄉㄨㄥˋ ㄘㄨㄥˊ ㄘˇ ㄈㄚ ㄈㄣˋ ㄩㄥˋ ㄍㄨㄥ ㄔㄥˊ ˙ㄌㄜ ㄉㄚˋ ㄕ ㄖㄣˊ',
        ],
        englishGist:
          'Young poet Li Bai wanted to quit studying until he saw an old woman grinding a thick iron rod into a needle through persistence, inspiring him to work hard.',
        spotlightVocab: [
          {
            word: '堅持不懈',
            zhuyin: 'ㄐㄧㄢ ㄔˊ ㄅㄨˋ ㄒㄧㄝˋ',
            hint: 'persevere without slacking off（持續努力、絕不鬆懈）',
          },
          {
            word: '深受感動',
            zhuyin: 'ㄕㄣ ㄕㄡˋ ㄍㄢˇ ㄉㄨㄥˋ',
            hint: 'deeply moved（內心受到很大的觸動）',
          },
          {
            word: '發憤',
            zhuyin: 'ㄈㄚ ㄈㄣˋ',
            hint: 'strive with determination（下定決心振作努力）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t4-hist-p1-q1',
            skillTag: '成語運用',
            prompt: '下列哪一個成語與老婆婆「持續磨鐵棒、絕不放棄」的精神最相近？',
            choices: ['持之以恆', '畫蛇添足', '狐假虎威', '守株待兔'],
            choiceZhuyin: [
              'ㄔˊ ㄓ ㄧˇ ㄏㄥˊ',
              'ㄏㄨㄚˋ ㄕㄜˊ ㄊㄧㄢ ㄗㄨˊ',
              'ㄏㄨˊ ㄐㄧㄚˇ ㄏㄨˇ ㄨㄟ',
              'ㄕㄡˇ ㄓㄨ ㄉㄞˋ ㄊㄨˋ',
            ],
            correctIndex: 0,
            explanation: '「持之以恆」與「堅持不懈」意思相近，都強調長久且穩定地努力不懈。',
          },
          {
            id: 'zh-read-t4-hist-p1-q2',
            skillTag: '細節閱讀',
            prompt: '老婆婆在溪邊用石頭把粗鐵棒磨細，最後想做成什麼？',
            choices: ['小鐵錘', '釣魚鉤', '繡花針', '菜刀'],
            choiceZhuyin: [
              'ㄒㄧㄠˇ ㄊㄧㄝˇ ㄔㄨㄟˊ',
              'ㄉㄧㄠˋ ㄩˊ ㄍㄡ',
              'ㄒㄧㄡˋ ㄏㄨㄚ ㄓㄣ',
              'ㄘㄞˋ ㄉㄠ',
            ],
            correctIndex: 2,
            explanation: '文章第二句提到，婆婆要把粗鐵棒磨成「細細的繡花針」。',
          },
          {
            id: 'zh-read-t4-hist-p1-q3',
            skillTag: '文意推論',
            prompt: '為什麼李白聽完婆婆的話後，就改變了原本想放棄讀書的念頭？',
            choices: [
              '因為婆婆送了他一本詩集',
              '因為他體會到只要下苦功不放棄，再難的事也能成功',
              '因為他不想在溪邊幫忙磨鐵棒',
              '因為他發現讀書比磨鐵棒輕鬆太多',
            ],
            correctIndex: 1,
            explanation: '連粗鐵棒都能靠堅持磨成繡花針，李白因而明白讀書求學也同樣需要恆心。',
          },
        ],
      },
      {
        id: 'zh-read-t4-hist-p2',
        title: '曹沖稱象的智慧',
        titleZhuyin: 'ㄘㄠˊ ㄔㄨㄥ ㄔㄥ ㄒㄧㄤˋ ˙ㄉㄜ ㄓˋ ㄏㄨㄟˋ',
        sentences: [
          '有人送來一頭大象，大臣們都想不出秤出重量的辦法。',
          '曹沖把象牽上船，畫下吃水記號，再改裝石頭沉到同條線。',
          '最後分批秤完石頭重量，大家對他的機智讚不絕口！',
        ],
        sentencesZhuyin: [
          'ㄧㄡˇ ㄖㄣˊ ㄙㄨㄥˋ ㄌㄞˊ ㄧ ㄊㄡˊ ㄉㄚˋ ㄒㄧㄤˋ ㄉㄚˋ ㄔㄣˊ ˙ㄇㄣ ㄉㄡ ㄒㄧㄤˇ ㄅㄨˋ ㄔㄨ ㄔㄥˋ ㄔㄨ ㄓㄨㄥˋ ㄌㄧㄤˋ ˙ㄉㄜ ㄅㄢˋ ㄈㄚˇ',
          'ㄘㄠˊ ㄔㄨㄥ ㄅㄚˇ ㄒㄧㄤˋ ㄑㄧㄢ ㄕㄤˋ ㄔㄨㄢˊ ㄏㄨㄚˋ ㄒㄧㄚˋ ㄔ ㄕㄨㄟˇ ㄐㄧˋ ㄏㄠˋ ㄗㄞˋ ㄍㄞˇ ㄓㄨㄤ ㄕˊ ˙ㄊㄡ ㄔㄣˊ ㄉㄠˋ ㄊㄨㄥˊ ㄊㄧㄠˊ ㄒㄧㄢˋ',
          'ㄗㄨㄟˋ ㄏㄡˋ ㄈㄣ ㄆㄧ ㄔㄥˋ ㄨㄢˊ ㄕˊ ˙ㄊㄡ ㄓㄨㄥˋ ㄌㄧㄤˋ ㄉㄚˋ ㄐㄧㄚ ㄉㄨㄟˋ ㄊㄚ ˙ㄉㄜ ㄐㄧ ㄓˋ ㄗㄢˋ ㄅㄨˋ ㄐㄩㄝˊ ㄎㄡˇ',
        ],
        englishGist:
          'When no adult can weigh a giant elephant, young Cao Chong marks a boat’s waterline with the elephant aboard, matches it with stones, and weighs the stones in batches.',
        spotlightVocab: [
          {
            word: '機智',
            zhuyin: 'ㄐㄧ ㄓˋ',
            hint: 'quick-witted and clever（聰明靈活、善於解決問題）',
          },
          {
            word: '讚不絕口',
            zhuyin: 'ㄗㄢˋ ㄅㄨˋ ㄐㄩㄝˊ ㄎㄡˇ',
            hint: 'praise endlessly（不停地稱讚）',
          },
          {
            word: '分批',
            zhuyin: 'ㄈㄣ ㄆㄧ',
            hint: 'in batches / group by group（分成幾次處理）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t4-hist-p2-q1',
            skillTag: '細節閱讀',
            prompt: '曹沖把大象牽下船後，在船上改裝了什麼東西來對齊水位線？',
            choices: ['木頭', '稻米', '沙包', '石頭'],
            choiceZhuyin: ['ㄇㄨˋ ˙ㄊㄡ', 'ㄉㄠˋ ㄇㄧˇ', 'ㄕㄚ ㄅㄠ', 'ㄕˊ ˙ㄊㄡ'],
            correctIndex: 3,
            explanation: '第二句寫道：「再改裝石頭沉到同條線。」',
          },
          {
            id: 'zh-read-t4-hist-p2-q2',
            skillTag: '成語運用',
            prompt: '大家對曹沖的聰明辦法「讚不絕口」，意思是什麼？',
            choices: ['一句話都說不出來', '不停地誇獎稱讚', '覺得這個方法太麻煩', '懷疑大象會害怕坐船'],
            correctIndex: 1,
            explanation: '「讚不絕口」是指嘴裡一直稱讚不停，表達高度佩服。',
          },
          {
            id: 'zh-read-t4-hist-p2-q3',
            skillTag: '文意推論',
            prompt: '曹沖解決難題最關鍵的思考方式是什麼？',
            choices: [
              '找來全城力氣最大的壯丁一起抬象',
              '先等大象長大一點再測量',
              '把無法直接秤的大象，轉換成可以分批秤量的石頭',
              '只靠眼睛猜測大象的體重',
            ],
            correctIndex: 2,
            explanation: '他運用船身吃水深度相同的原理，將整頭大象的重量「化整為零」改用石頭分批秤重。',
          },
        ],
      },
    ],
  },

  {
    id: 'zh-read-t4-creative-thinker',
    subjectId: 'chinese',
    tier: 4,
    title: '小小觀察家思辨',
    shortTag: '思辨閱讀',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    emblemCollectibleId: 'crystal-sapphire-fox',
    passages: [
      {
        id: 'zh-read-t4-think-p1',
        title: '圖書館的靜音實驗',
        titleZhuyin: 'ㄊㄨˊ ㄕㄨ ㄍㄨㄢˇ ˙ㄉㄜ ㄐㄧㄥˋ ㄧㄣ ㄕˊ ㄧㄢˋ',
        sentences: [
          '班上閱讀角太吵，同學原本建議貼滿「禁止說話」警告牌。',
          '小晴卻提出新點子：鋪上軟地毯，放張溫馨的「悄悄話小沙發」。',
          '氣氛變得輕鬆，大家反而主動輕聲細語。',
        ],
        sentencesZhuyin: [
          'ㄅㄢ ㄕㄤˋ ㄩㄝˋ ㄉㄨˊ ㄐㄧㄠˇ ㄊㄞˋ ㄔㄠˇ ㄊㄨㄥˊ ㄒㄩㄝˊ ㄩㄢˊ ㄅㄣˇ ㄐㄧㄢˋ ㄧˋ ㄊㄧㄝ ㄇㄢˇ ㄐㄧㄣˋ ㄓˇ ㄕㄨㄛ ㄏㄨㄚˋ ㄐㄧㄥˇ ㄍㄠˋ ㄆㄞˊ',
          'ㄒㄧㄠˇ ㄑㄧㄥˊ ㄑㄩㄝˋ ㄊㄧˊ ㄔㄨ ㄒㄧㄣ ㄉㄧㄢˇ ˙ㄗ ㄆㄨ ㄕㄤˋ ㄖㄨㄢˇ ㄉㄧˋ ㄊㄢˇ ㄈㄤˋ ㄓㄤ ㄨㄣ ㄒㄧㄣ ˙ㄉㄜ ㄑㄧㄠˇ ㄑㄧㄠˇ ㄏㄨㄚˋ ㄒㄧㄠˇ ㄕㄚ ㄈㄚ',
          'ㄑㄧˋ ㄈㄣ ㄅㄧㄢˋ ˙ㄉㄜ ㄑㄧㄥ ㄙㄨㄥ ㄉㄚˋ ㄐㄧㄚ ㄈㄢˇ ㄦˊ ㄓㄨˇ ㄉㄨㄥˋ ㄑㄧㄥ ㄕㄥ ㄒㄧˋ ㄩˇ',
        ],
        englishGist:
          'Instead of posting strict “No Talking” signs in a noisy reading corner, Xiaoqing adds a soft rug and a cozy “Whisper Sofa,” inspiring everyone to speak softly on their own.',
        spotlightVocab: [
          {
            word: '點子',
            zhuyin: 'ㄉㄧㄢˇ ˙ㄗ',
            hint: 'clever idea（想法、好主意）',
          },
          {
            word: '溫馨',
            zhuyin: 'ㄨㄣ ㄒㄧㄣ',
            hint: 'warm and cozy（溫暖又讓人感到舒適）',
          },
          {
            word: '輕聲細語',
            zhuyin: 'ㄑㄧㄥ ㄕㄥ ㄒㄧˋ ㄩˇ',
            hint: 'speak softly and gently（輕輕柔柔地小聲說話）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t4-think-p1-q1',
            skillTag: '細節閱讀',
            prompt: '小晴在閱讀角做了哪兩項改變？',
            choices: [
              '鋪上軟地毯，並放置「悄悄話小沙發」',
              '貼滿警告牌，並請老師在門口計時',
              '把書櫃搬到走廊，減少座位數量',
              '規定大家閱讀時完全不能翻頁',
            ],
            correctIndex: 0,
            explanation: '第二句說明小晴在閱讀角鋪上軟地毯，還放了一張溫馨的「悄悄話小沙發」。',
          },
          {
            id: 'zh-read-t4-think-p1-q2',
            skillTag: '成語運用',
            prompt: '哪一個成語最適合形容同學們後來「小聲又溫柔交談」的表現？',
            choices: ['震耳欲聾', '七嘴八舌', '繪聲繪影', '輕聲細語'],
            choiceZhuyin: [
              'ㄓㄣˋ ㄦˇ ㄩˋ ㄌㄨㄥˊ',
              'ㄑㄧ ㄗㄨㄟˇ ㄅㄚ ㄕㄜˊ',
              'ㄏㄨㄟˋ ㄕㄥ ㄏㄨㄟˋ ㄧㄥˇ',
              'ㄑㄧㄥ ㄕㄥ ㄒㄧˋ ㄩˇ',
            ],
            correctIndex: 3,
            explanation: '「輕聲細語」形容說話聲音輕柔細小，正好符合安靜閱讀角的氛圍。',
          },
          {
            id: 'zh-read-t4-think-p1-q3',
            skillTag: '文意推論',
            prompt: '為什麼小晴的方法比貼滿警告牌更有效？',
            choices: [
              '因為警告牌的字大家看不懂',
              '因為溫暖友善的環境設計，能引導大家心甘情願配合',
              '因為同學們只顧著坐沙發睡覺',
              '因為閱讀角裡的書變少了',
            ],
            correctIndex: 1,
            explanation: '硬性禁止容易讓人有壓力，而溫暖巧思的環境能自然引導大家主動放低音量。',
          },
        ],
      },
      {
        id: 'zh-read-t4-think-p2',
        title: '失敗的餅乾食譜',
        titleZhuyin: 'ㄕ ㄅㄞˋ ˙ㄉㄜ ㄅㄧㄥˇ ㄍㄢ ㄕˊ ㄆㄨˇ',
        sentences: [
          '小敏首次烤餅乾，看錯時間把餅乾烤得又乾又硬。',
          '她沒氣餒，在筆記本記錄烤箱溫度與麵糰比例，重新調整。',
          '第三次餅乾外酥內軟，原來失敗也是通往成功的線索。',
        ],
        sentencesZhuyin: [
          'ㄒㄧㄠˇ ㄇㄧㄣˇ ㄕㄡˇ ㄘˋ ㄎㄠˇ ㄅㄧㄥˇ ㄍㄢ ㄎㄢˋ ㄘㄨㄛˋ ㄕˊ ㄐㄧㄢ ㄅㄚˇ ㄅㄧㄥˇ ㄍㄢ ㄎㄠˇ ˙ㄉㄜ ㄧㄡˋ ㄍㄢ ㄧㄡˋ ㄧㄥˋ',
          'ㄊㄚ ㄇㄟˊ ㄑㄧˋ ㄋㄟˇ ㄗㄞˋ ㄅㄧˇ ㄐㄧˋ ㄅㄣˇ ㄐㄧˋ ㄌㄨˋ ㄎㄠˇ ㄒㄧㄤ ㄨㄣ ㄉㄨˋ ㄩˇ ㄇㄧㄢˋ ㄊㄨㄢˊ ㄅㄧˇ ㄌㄧˋ ㄔㄨㄥˊ ㄒㄧㄣ ㄊㄧㄠˊ ㄓㄥˇ',
          'ㄉㄧˋ ㄙㄢ ㄘˋ ㄅㄧㄥˇ ㄍㄢ ㄨㄞˋ ㄙㄨ ㄋㄟˋ ㄖㄨㄢˇ ㄩㄢˊ ㄌㄞˊ ㄕ ㄅㄞˋ ㄧㄝˇ ㄕˋ ㄊㄨㄥ ㄨㄤˇ ㄔㄥˊ ㄍㄨㄥ ˙ㄉㄜ ㄒㄧㄢˋ ㄙㄨㄛˇ',
        ],
        englishGist:
          'After baking hard, dry cookies on her first try, Xiaomin logs oven temperatures and dough ratios instead of giving up—and bakes crispy, chewy cookies on try three!',
        spotlightVocab: [
          {
            word: '氣餒',
            zhuyin: 'ㄑㄧˋ ㄋㄟˇ',
            hint: 'feel discouraged / lose heart（灰心喪氣、失去信心）',
          },
          {
            word: '記錄',
            zhuyin: 'ㄐㄧˋ ㄌㄨˋ',
            hint: 'record / write down carefully（把觀察到的資料寫下來）',
          },
          {
            word: '線索',
            zhuyin: 'ㄒㄧㄢˋ ㄙㄨㄛˇ',
            hint: 'clue / lead（幫助找出答案的重要提示）',
          },
        ],
        questions: [
          {
            id: 'zh-read-t4-think-p2-q1',
            skillTag: '語境理解',
            prompt: '第二句說「她沒氣餒」，其中「氣餒」是指什麼情緒？',
            choices: ['開心得意', '好奇興奮', '灰心放棄', '生氣大叫'],
            choiceZhuyin: [
              'ㄎㄞ ㄒㄧㄣ ㄉㄜˊ ㄧˋ',
              'ㄏㄠˋ ㄑㄧˊ ㄒㄧㄥ ㄈㄣˋ',
              'ㄏㄨㄟ ㄒㄧㄣ ㄈㄤˋ ㄑㄧˋ',
              'ㄕㄥ ㄑㄧˋ ㄉㄚˋ ㄐㄧㄠˋ',
            ],
            correctIndex: 2,
            explanation: '「氣餒」指遇到挫折後失去勇氣和信心；小敏沒氣餒，反而繼續改進。',
          },
          {
            id: 'zh-read-t4-think-p2-q2',
            skillTag: '細節閱讀',
            prompt: '小敏在筆記本上記錄了哪兩項重要資訊？',
            choices: [
              '烤箱溫度與麵糰比例',
              '巧克力價格與餅乾形狀',
              '家人評分與包裝顏色',
              '烘焙店地址與食譜作者',
            ],
            correctIndex: 0,
            explanation: '第二句提到，小敏記錄了「烤箱溫度與麵糰比例」，並據此重新調整。',
          },
          {
            id: 'zh-read-t4-think-p2-q3',
            skillTag: '文意推論',
            prompt: '為什麼小敏覺得「失敗也是通往成功的線索」？',
            choices: [
              '因為失敗三次就會自動獲得大獎',
              '因為把烤焦的餅乾當點心也很好吃',
              '因為她其實靠運氣才烤出好餅乾',
              '因為從失敗記錄中找出原因並改進，就能一步步接近成功',
            ],
            correctIndex: 3,
            explanation: '就像偵探分析線索一樣，記錄並調整每次失敗的原因，最終就能找到成功的做法。',
          },
        ],
      },
    ],
  },
];

export function getChineseReadingByTier(tier: DifficultyTier): ReadingQuestSet[] {
  return CHINESE_READING_QUESTS.filter((set) => set.tier === tier);
}

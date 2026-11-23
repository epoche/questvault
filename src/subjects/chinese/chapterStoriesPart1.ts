import type { ChapterSeries } from './chapterTypes';

export const CHAPTER_SERIES_PART1: ChapterSeries[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SERIES 1 · Tier 1 · 奇幻甜點（5 集 / 15 題）
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ch-boba-magic',
    tier: 1,
    title: '珍珠奶茶魔法屋',
    tagline: '外婆茶店裡的神祕茶杯，竟藏著會變魔法的波霸小熊！',
    genreTag: '奇幻甜點',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    emblemCollectibleId: 'sweet-boba-bear',
    episodes: [
      {
        id: 'ch-boba-magic-ep1',
        episodeNumber: 1,
        title: '發光的神祕茶杯',
        titleZhuyin: 'ㄈㄚ ㄍㄨㄤ ˙ㄉㄜ ㄕㄣˊ ㄇㄧˋ ㄔㄚˊ ㄅㄟ',
        sentences: [
          '星期五傍晚，小晴在外婆的珍珠奶茶店幫忙整理架子。',
          '突然，廚房角落的木盒裡，傳來一陣淡淡的黑糖香氣。',
          '小晴小心打開蓋子，看見一個會發光的金色小茶杯。',
          '杯子裡冒出一串閃亮的小泡泡，像在邀請她展開一次奇幻冒險！',
        ],
        sentencesZhuyin: [
          'ㄒㄧㄥ ㄑㄧˊ ㄨˇ ㄅㄤˋ ㄨㄢˇ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄗㄞˋ ㄨㄞˋ ㄆㄛˊ ˙ㄉㄜ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ ㄉㄧㄢˋ ㄅㄤ ㄇㄤˊ ㄓㄥˇ ㄌㄧˇ ㄐㄧㄚˋ ˙ㄗ',
          'ㄊㄨˊ ㄖㄢˊ ㄔㄨˊ ㄈㄤˊ ㄐㄧㄠˇ ㄌㄨㄛˋ ˙ㄉㄜ ㄇㄨˋ ㄏㄜˊ ㄌㄧˇ ㄔㄨㄢˊ ㄌㄞˊ ㄧ ㄓㄣˋ ㄉㄢˋ ㄉㄢˋ ˙ㄉㄜ ㄏㄟ ㄊㄤˊ ㄒㄧㄤ ㄑㄧˋ',
          'ㄒㄧㄠˇ ㄑㄧㄥˊ ㄒㄧㄠˇ ㄒㄧㄣ ㄉㄚˇ ㄎㄞ ㄍㄞˋ ˙ㄗ ㄎㄢˋ ㄐㄧㄢˋ ㄧ ㄍㄜˋ ㄏㄨㄟˋ ㄈㄚ ㄍㄨㄤ ˙ㄉㄜ ㄐㄧㄣ ㄙㄜˋ ㄒㄧㄠˇ ㄔㄚˊ ㄅㄟ',
          'ㄅㄟ ˙ㄗ ㄌㄧˇ ㄇㄠˋ ㄔㄨ ㄧ ㄔㄨㄢˋ ㄕㄢˇ ㄌㄧㄤˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄆㄠˋ ˙ㄆㄠ ㄒㄧㄤˋ ㄗㄞˋ ㄧㄠ ㄑㄧㄥˇ ㄊㄚ ㄓㄢˇ ㄎㄞ ㄧ ㄘˋ ㄑㄧˊ ㄏㄨㄢˋ ㄇㄠˋ ㄒㄧㄢˇ',
        ],
        englishGist:
          "While helping tidy up her grandma's boba shop on Friday evening, Xiaoqing follows a sweet brown-sugar scent to a wooden box and discovers a glowing golden teacup bubbling with magical sparkles.",
        spotlightVocab: [
          {
            word: '傍晚',
            zhuyin: 'ㄅㄤˋ ㄨㄢˇ',
            hint: 'early evening / dusk（太陽快下山、天色漸暗的時候）',
          },
          {
            word: '角落',
            zhuyin: 'ㄐㄧㄠˇ ㄌㄨㄛˋ',
            hint: 'corner（房間或空間最邊緣的地方）',
          },
          {
            word: '冒險',
            zhuyin: 'ㄇㄠˋ ㄒㄧㄢˇ',
            hint: 'adventure（充滿驚奇的新奇旅程）',
          },
        ],
        questions: [
          {
            id: 'ch-boba-magic-ep1-q1',
            skillTag: '細節閱讀',
            prompt: '小晴是在哪裡發現金色小茶杯的？',
            choices: [
              '夜市門口的攤位',
              '學校教室的抽屜',
              '廚房角落的木盒裡',
              '客廳沙發的後面',
            ],
            correctIndex: 2,
            explanation:
              '文章第二、三句提到，廚房角落的木盒裡傳來黑糖香氣，打開蓋子就看見發光的金色小茶杯。',
          },
          {
            id: 'ch-boba-magic-ep1-q2',
            skillTag: '詞義推論',
            prompt: '文中提到「傳來一陣淡淡的黑糖香氣」，這裡的「淡淡」是什麼意思？',
            choices: [
              '輕輕的、不濃烈但聞得到',
              '味道又苦又辣',
              '完全沒有任何氣味',
              '聲音非常響亮',
            ],
            correctIndex: 0,
            explanation: '「淡淡的香氣」形容香味柔和清淡，不會太刺鼻，卻能吸引人注意。',
          },
          {
            id: 'ch-boba-magic-ep1-q3',
            skillTag: '劇情推理',
            prompt: '看到茶杯發光又冒出閃亮泡泡，接下來最可能發生什麼事？',
            choices: [
              '茶杯只是沾到冷水而已',
              '茶杯裡藏著某種神奇的魔法祕密',
              '外婆會把木盒直接丟掉',
              '小晴馬上關燈去睡覺',
            ],
            correctIndex: 1,
            explanation:
              '茶杯不只會發光，還冒出像在邀請她展開奇幻冒險的閃亮泡泡，暗示裡面藏著神奇的魔法。',
          },
        ],
      },
      {
        id: 'ch-boba-magic-ep2',
        episodeNumber: 2,
        title: '迷你波霸熊精靈',
        titleZhuyin: 'ㄇㄧˊ ㄋㄧˇ ㄅㄛ ㄅㄚˋ ㄒㄩㄥˊ ㄐㄧㄥ ㄌㄧㄥˊ',
        prevRecap: '小晴在外婆奶茶店的廚房角落，發現了一個會發光的金色小茶杯。',
        sentences: [
          '正當小晴好奇地湊近茶杯時，一隻掌心大的棕色小熊從泡泡裡跳了出來！',
          '牠戴著白色小廚師帽，圓圓的肚子上還印著一顆亮晶晶的珍珠圖案。',
          '小熊自我介紹說，牠叫「波波」，是守護外婆奶茶店的魔法精靈。',
          '波波焦急地搖著小耳朵，拜託小晴幫忙找回不小心弄丟的三顆風味珍珠。',
        ],
        sentencesZhuyin: [
          'ㄓㄥˋ ㄉㄤ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄏㄠˋ ㄑㄧˊ ˙ㄉㄜ ㄘㄡˋ ㄐㄧㄣˋ ㄔㄚˊ ㄅㄟ ㄕˊ ㄧ ㄓ ㄓㄤˇ ㄒㄧㄣ ㄉㄚˋ ˙ㄉㄜ ㄗㄨㄥ ㄙㄜˋ ㄒㄧㄠˇ ㄒㄩㄥˊ ㄘㄨㄥˊ ㄆㄠˋ ˙ㄆㄠ ㄌㄧˇ ㄊㄧㄠˋ ˙ㄌㄜ ㄔㄨ ㄌㄞˊ',
          'ㄊㄚ ㄉㄞˋ ˙ㄓㄜ ㄅㄞˊ ㄙㄜˋ ㄒㄧㄠˇ ㄔㄨˊ ㄕ ㄇㄠˋ ㄩㄢˊ ㄩㄢˊ ˙ㄉㄜ ㄉㄨˋ ˙ㄗ ㄕㄤˋ ㄏㄞˊ ㄧㄣˋ ˙ㄓㄜ ㄧ ㄎㄜ ㄌㄧㄤˋ ㄐㄧㄥ ㄐㄧㄥ ˙ㄉㄜ ㄓㄣ ㄓㄨ ㄊㄨˊ ㄢˋ',
          'ㄒㄧㄠˇ ㄒㄩㄥˊ ㄗˋ ㄨㄛˇ ㄐㄧㄝˋ ㄕㄠˋ ㄕㄨㄛ ㄊㄚ ㄐㄧㄠˋ ㄅㄛ ㄅㄛ ㄕˋ ㄕㄡˇ ㄏㄨˋ ㄨㄞˋ ㄆㄛˊ ㄋㄞˇ ㄔㄚˊ ㄉㄧㄢˋ ˙ㄉㄜ ㄇㄛˊ ㄈㄚˇ ㄐㄧㄥ ㄌㄧㄥˊ',
          'ㄅㄛ ㄅㄛ ㄐㄧㄠ ㄐㄧˊ ˙ㄉㄜ ㄧㄠˊ ˙ㄓㄜ ㄒㄧㄠˇ ㄦˇ ˙ㄉㄨㄛ ㄅㄞˋ ㄊㄨㄛ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄅㄤ ㄇㄤˊ ㄓㄠˇ ㄏㄨㄟˊ ㄅㄨˋ ㄒㄧㄠˇ ㄒㄧㄣ ㄋㄨㄥˋ ㄉㄧㄡ ˙ㄉㄜ ㄙㄢ ㄎㄜ ㄈㄥ ㄨㄟˋ ㄓㄣ ㄓㄨ',
        ],
        englishGist:
          "A palm-sized brown bear spirit named Bobo pops out of the bubbles wearing a tiny chef hat. Bobo guards Grandma's tea shop and asks Xiaoqing to help find three missing magical flavor pearls.",
        spotlightVocab: [
          {
            word: '守護',
            zhuyin: 'ㄕㄡˇ ㄏㄨˋ',
            hint: 'to protect and watch over（細心保護、看守）',
          },
          {
            word: '焦急',
            zhuyin: 'ㄐㄧㄠ ㄐㄧˊ',
            hint: 'anxious / worried（心裡非常著急）',
          },
          {
            word: '拜託',
            zhuyin: 'ㄅㄞˋ ㄊㄨㄛ',
            hint: 'to politely ask for help（禮貌地請求別人幫忙）',
          },
        ],
        questions: [
          {
            id: 'ch-boba-magic-ep2-q1',
            skillTag: '細節閱讀',
            prompt: '波霸小熊精靈「波波」頭上戴著什麼東西？',
            choices: ['藍色游泳帽', '紅色蝴蝶結', '黃色棒球帽', '白色小廚師帽'],
            correctIndex: 3,
            explanation: '文章第二句清楚寫著：「牠戴著白色小廚師帽」。',
          },
          {
            id: 'ch-boba-magic-ep2-q2',
            skillTag: '主旨理解',
            prompt: '這一集主要在說哪一件事？',
            choices: [
              '小晴遇見了奶茶精靈波波，並得知需要尋找三顆珍珠',
              '小晴和外婆一起去公園散步',
              '波波教小晴怎麼騎腳踏車',
              '外婆決定明天把奶茶店關起來',
            ],
            correctIndex: 0,
            explanation: '本集重點是波波從茶杯泡泡中現身自我介紹，並請小晴協助找回三顆風味珍珠。',
          },
          {
            id: 'ch-boba-magic-ep2-q3',
            skillTag: '詞義推論',
            prompt: '波波「焦急地搖著小耳朵」，這表示牠現在的心情怎麼樣？',
            choices: [
              '覺得非常無聊想睡覺',
              '生氣到不想跟人說話',
              '很擔心珍珠找不到，心裡著急',
              '剛吃飽所以很放鬆',
            ],
            correctIndex: 2,
            explanation: '「焦急」表示非常著急、擔心，因為波波不小心弄丟了三顆重要的風味珍珠。',
          },
        ],
      },
      {
        id: 'ch-boba-magic-ep3',
        episodeNumber: 3,
        title: '尋找三顆風味珍珠',
        titleZhuyin: 'ㄒㄩㄣˊ ㄓㄠˇ ㄙㄢ ㄎㄜ ㄈㄥ ㄨㄟˋ ㄓㄣ ㄓㄨ',
        prevRecap: '掌心大的波霸熊精靈「波波」現身，拜託小晴幫忙找回三顆不見的風味珍珠。',
        sentences: [
          '小晴拿著小湯匙當探險工具，跟著波波在店裡仔細搜尋線索。',
          '他們先在茶葉罐旁找到散發花香的茉莉珍珠，又在糖罐下發現亮黃色的芒果珍珠。',
          '最後一顆黑糖珍珠跑去哪了呢？小晴聽見窗邊傳來輕輕的滾動聲。',
          '原來它正躲在可愛的小花盆裡，像在和大家玩捉迷藏一樣！',
        ],
        sentencesZhuyin: [
          'ㄒㄧㄠˇ ㄑㄧㄥˊ ㄋㄚˊ ˙ㄓㄜ ㄒㄧㄠˇ ㄊㄤ ㄔˊ ㄉㄤ ㄊㄢˋ ㄒㄧㄢˇ ㄍㄨㄥ ㄐㄩˋ ㄍㄣ ˙ㄓㄜ ㄅㄛ ㄅㄛ ㄗㄞˋ ㄉㄧㄢˋ ㄌㄧˇ ㄗˇ ㄒㄧˋ ㄙㄡ ㄒㄩㄣˊ ㄒㄧㄢˋ ㄙㄨㄛˇ',
          'ㄊㄚ ˙ㄇㄣ ㄒㄧㄢ ㄗㄞˋ ㄔㄚˊ ㄧㄝˋ ㄍㄨㄢˋ ㄆㄤˊ ㄓㄠˇ ㄉㄠˋ ㄙㄢˋ ㄈㄚ ㄏㄨㄚ ㄒㄧㄤ ˙ㄉㄜ ㄇㄛˋ ㄌㄧˋ ㄓㄣ ㄓㄨ ㄧㄡˋ ㄗㄞˋ ㄊㄤˊ ㄍㄨㄢˋ ㄒㄧㄚˋ ㄈㄚ ㄒㄧㄢˋ ㄌㄧㄤˋ ㄏㄨㄤˊ ㄙㄜˋ ˙ㄉㄜ ㄇㄤˊ ㄍㄨㄛˇ ㄓㄣ ㄓㄨ',
          'ㄗㄨㄟˋ ㄏㄡˋ ㄧ ㄎㄜ ㄏㄟ ㄊㄤˊ ㄓㄣ ㄓㄨ ㄆㄠˇ ㄑㄩˋ ㄋㄚˇ ˙ㄌㄜ ˙ㄋㄜ ㄒㄧㄠˇ ㄑㄧㄥˊ ㄊㄧㄥ ㄐㄧㄢˋ ㄔㄨㄤ ㄅㄧㄢ ㄔㄨㄢˊ ㄌㄞˊ ㄑㄧㄥ ㄑㄧㄥ ˙ㄉㄜ ㄍㄨㄣˇ ㄉㄨㄥˋ ㄕㄥ',
          'ㄩㄢˊ ㄌㄞˊ ㄊㄚ ㄓㄥˋ ㄉㄨㄛˇ ㄗㄞˋ ㄎㄜˇ ㄞˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄏㄨㄚ ㄆㄣˊ ㄌㄧˇ ㄒㄧㄤˋ ㄗㄞˋ ㄏㄢˋ ㄉㄚˋ ㄐㄧㄚ ㄨㄢˊ ㄓㄨㄛ ㄇㄧˊ ㄘㄤˊ ㄧ ㄧㄤˋ',
        ],
        englishGist:
          'Armed with a small spoon, Xiaoqing and Bobo search the shop and recover the jasmine pearl by the tea tins, the mango pearl under the sugar jar, and the brown-sugar pearl hiding inside a little flowerpot by the window.',
        spotlightVocab: [
          {
            word: '搜尋',
            zhuyin: 'ㄙㄡ ㄒㄩㄣˊ',
            hint: 'to search carefully（到處仔細找尋）',
          },
          {
            word: '線索',
            zhuyin: 'ㄒㄧㄢˋ ㄙㄨㄛˇ',
            hint: 'clue（幫助找到答案的跡象）',
          },
          {
            word: '捉迷藏',
            zhuyin: 'ㄓㄨㄛ ㄇㄧˊ ㄘㄤˊ',
            hint: 'hide-and-seek（輪流躲起來讓別人找的遊戲）',
          },
        ],
        questions: [
          {
            id: 'ch-boba-magic-ep3-q1',
            skillTag: '細節閱讀',
            prompt: '第三顆黑糖珍珠最後是在哪裡找到的？',
            choices: [
              '放在茶葉罐旁邊',
              '躲在窗邊的小花盆裡',
              '藏在冰箱的最上層',
              '掉在外婆的圍裙口袋裡',
            ],
            correctIndex: 1,
            explanation: '第三、四句寫到小晴聽見窗邊傳來滾動聲，發現黑糖珍珠躲在可愛的小花盆裡。',
          },
          {
            id: 'ch-boba-magic-ep3-q2',
            skillTag: '細節閱讀',
            prompt: '小晴和波波一共找回了哪三種口味的珍珠？',
            choices: [
              '草莓、抹茶、蜂蜜',
              '巧克力、花生、芝麻',
              '葡萄、檸檬、蘋果',
              '茉莉、芒果、黑糖',
            ],
            correctIndex: 3,
            explanation: '文章中依序找到的三顆珍珠是茉莉珍珠、芒果珍珠和黑糖珍珠。',
          },
          {
            id: 'ch-boba-magic-ep3-q3',
            skillTag: '劇情推理',
            prompt: '小晴之所以能找到最後一顆珍珠，是因為她做了什麼？',
            choices: [
              '細心聽見窗邊傳來的滾動聲',
              '把整間店的茶杯都打破',
              '請路過的小狗幫忙聞味道',
              '打電話問遠方的同學',
            ],
            correctIndex: 0,
            explanation: '小晴沒有放棄，而是仔細傾聽周圍動靜，憑著輕輕的滾動聲找到花盆裡的黑糖珍珠。',
          },
        ],
      },
      {
        id: 'ch-boba-magic-ep4',
        episodeNumber: 4,
        title: '雨天的暖心茶譜',
        titleZhuyin: 'ㄩˇ ㄊㄧㄢ ˙ㄉㄜ ㄋㄨㄢˇ ㄒㄧㄣ ㄔㄚˊ ㄆㄨˇ',
        prevRecap: '小晴細心搜尋線索，幫波波找回了茉莉、芒果和黑糖三顆風味珍珠。',
        sentences: [
          '第二天突然下起大雨，奶茶店冷清了不少，外婆看著窗外輕輕嘆氣。',
          '波波翻開一本泛黃的魔法茶譜，上面寫著雨天必備的「微笑暖茶」配方，卻缺了最後一種材料。',
          '小晴想起外婆總說：「喝茶最暖心的祕訣，是加進滿滿的關心和笑聲！」',
          '她立刻把三顆珍珠放進熱奶茶裡，再寫上祝福小紙條，金色的暖光瞬間照亮了整間店！',
        ],
        sentencesZhuyin: [
          'ㄉㄧˋ ㄦˋ ㄊㄧㄢ ㄊㄨˊ ㄖㄢˊ ㄒㄧㄚˋ ㄑㄧˇ ㄉㄚˋ ㄩˇ ㄋㄞˇ ㄔㄚˊ ㄉㄧㄢˋ ㄌㄥˇ ㄑㄧㄥ ˙ㄌㄜ ㄅㄨˋ ㄕㄠˇ ㄨㄞˋ ㄆㄛˊ ㄎㄢˋ ˙ㄓㄜ ㄔㄨㄤ ㄨㄞˋ ㄑㄧㄥ ㄑㄧㄥ ㄊㄢˋ ㄑㄧˋ',
          'ㄅㄛ ㄅㄛ ㄈㄢ ㄎㄞ ㄧ ㄅㄣˇ ㄈㄢˋ ㄏㄨㄤˊ ˙ㄉㄜ ㄇㄛˊ ㄈㄚˇ ㄔㄚˊ ㄆㄨˇ ㄕㄤˋ ㄇㄧㄢˋ ㄒㄧㄝˇ ˙ㄓㄜ ㄩˇ ㄊㄧㄢ ㄅㄧˋ ㄅㄟˋ ˙ㄉㄜ ㄨㄟˊ ㄒㄧㄠˋ ㄋㄨㄢˇ ㄔㄚˊ ㄆㄟˋ ㄈㄤ ㄑㄩㄝˋ ㄑㄩㄝ ˙ㄌㄜ ㄗㄨㄟˋ ㄏㄡˋ ㄧ ㄓㄨㄥˇ ㄘㄞˊ ㄌㄧㄠˋ',
          'ㄒㄧㄠˇ ㄑㄧㄥˊ ㄒㄧㄤˇ ㄑㄧˇ ㄨㄞˋ ㄆㄛˊ ㄗㄨㄥˇ ㄕㄨㄛ ㄏㄜ ㄔㄚˊ ㄗㄨㄟˋ ㄋㄨㄢˇ ㄒㄧㄣ ˙ㄉㄜ ㄇㄧˋ ㄐㄩㄝˊ ㄕˋ ㄐㄧㄚ ㄐㄧㄣˋ ㄇㄢˇ ㄇㄢˇ ˙ㄉㄜ ㄍㄨㄢ ㄒㄧㄣ ㄏㄢˋ ㄒㄧㄠˋ ㄕㄥ',
          'ㄊㄚ ㄌㄧˋ ㄎㄜˋ ㄅㄚˇ ㄙㄢ ㄎㄜ ㄓㄣ ㄓㄨ ㄈㄤˋ ㄐㄧㄣˋ ㄖㄜˋ ㄋㄞˇ ㄔㄚˊ ㄌㄧˇ ㄗㄞˋ ㄒㄧㄝˇ ㄕㄤˋ ㄓㄨˋ ㄈㄨˊ ㄒㄧㄠˇ ㄓˇ ㄊㄧㄠˊ ㄐㄧㄣ ㄙㄜˋ ˙ㄉㄜ ㄋㄨㄢˇ ㄍㄨㄤ ㄕㄨㄣˋ ㄐㄧㄢ ㄓㄠˋ ㄌㄧㄤˋ ˙ㄌㄜ ㄓㄥˇ ㄐㄧㄢ ㄉㄧㄢˋ',
        ],
        englishGist:
          'When heavy rain makes the shop quiet, Bobo opens an old recipe book for a rainy-day Warm Smile Tea with one missing ingredient. Xiaoqing realizes the secret is kindness and warmth, adds the three pearls and cheerful notes, and the shop glows!',
        spotlightVocab: [
          {
            word: '冷清',
            zhuyin: 'ㄌㄥˇ ㄑㄧㄥ',
            hint: 'quiet and empty（客人或人潮很少的樣子）',
          },
          {
            word: '祕訣',
            zhuyin: 'ㄇㄧˋ ㄐㄩㄝˊ',
            hint: 'secret tip / key trick（最有效、特別的方法）',
          },
          {
            word: '祝福',
            zhuyin: 'ㄓㄨˋ ㄈㄨˊ',
            hint: 'good wishes / blessing（祝別人平安開心的話語）',
          },
        ],
        questions: [
          {
            id: 'ch-boba-magic-ep4-q1',
            skillTag: '細節閱讀',
            prompt: '為什麼第二天奶茶店裡看起來冷清了不少？',
            choices: [
              '店裡忘記開電燈',
              '珍珠全都賣光了',
              '外面突然下起大雨',
              '外婆出國去旅行了',
            ],
            correctIndex: 2,
            explanation: '文章第一句說明：「第二天突然下起大雨，奶茶店冷清了不少」。',
          },
          {
            id: 'ch-boba-magic-ep4-q2',
            skillTag: '主旨理解',
            prompt: '小晴發現「微笑暖茶」缺少的最後一種材料其實是什麼？',
            choices: [
              '多加十塊冰塊',
              '滿滿的關心、祝福和笑聲',
              '一瓶很貴的辣椒醬',
              '非常大顆的檸檬',
            ],
            correctIndex: 1,
            explanation: '小晴想起外婆說的話，把滿滿的關心和祝福放進茶裡，成功喚醒了暖光魔法。',
          },
          {
            id: 'ch-boba-magic-ep4-q3',
            skillTag: '詞義推論',
            prompt: '句中說「金色的暖光瞬間照亮了整間店」，「瞬間」的意思是什麼？',
            choices: [
              '過了好幾天以後',
              '慢慢等了一整個下午',
              '只有晚上才會發生',
              '在非常短的一眨眼之間',
            ],
            correctIndex: 3,
            explanation: '「瞬間」指極短的時間、一轉眼之間，形容暖光立刻亮了起來。',
          },
        ],
      },
      {
        id: 'ch-boba-magic-ep5',
        episodeNumber: 5,
        title: '奇幻夜市慶祝會',
        titleZhuyin: 'ㄑㄧˊ ㄏㄨㄢˋ ㄧㄝˋ ㄕˋ ㄑㄧㄥˋ ㄓㄨˋ ㄏㄨㄟˋ',
        prevRecap: '小晴用三顆珍珠和祝福小紙條，完成了能帶來溫暖的「微笑暖茶」配方。',
        sentences: [
          '雨停後的週末夜晚，外婆的奶茶店亮起彩燈，附近的鄰居聞香而來，場面熱鬧極了。',
          '大家喝下香甜的「微笑暖茶」，讀到杯子上的祝福紙條，每個人都露出了燦爛的笑容。',
          '波波悄悄躲在金色茶杯旁，揮動小小湯匙灑下星光般的黑糖泡泡，為這場慶祝會加油。',
          '小晴和波波相視一笑，約好以後還要一起做出更多讓人幸福的魔法珍珠奶茶！',
        ],
        sentencesZhuyin: [
          'ㄩˇ ㄊㄧㄥˊ ㄏㄡˋ ˙ㄉㄜ ㄓㄡ ㄇㄛˋ ㄧㄝˋ ㄨㄢˇ ㄨㄞˋ ㄆㄛˊ ˙ㄉㄜ ㄋㄞˇ ㄔㄚˊ ㄉㄧㄢˋ ㄌㄧㄤˋ ㄑㄧˇ ㄘㄞˇ ㄉㄥ ㄈㄨˋ ㄐㄧㄣˋ ˙ㄉㄜ ㄌㄧㄣˊ ㄐㄩ ㄨㄣˊ ㄒㄧㄤ ㄦˊ ㄌㄞˊ ㄔㄤˇ ㄇㄧㄢˋ ㄖㄜˋ ˙ㄋㄠ ㄐㄧˊ ˙ㄌㄜ',
          'ㄉㄚˋ ㄐㄧㄚ ㄏㄜ ㄒㄧㄚˋ ㄒㄧㄤ ㄊㄧㄢˊ ˙ㄉㄜ ㄨㄟˊ ㄒㄧㄠˋ ㄋㄨㄢˇ ㄔㄚˊ ㄉㄨˊ ㄉㄠˋ ㄅㄟ ˙ㄗ ㄕㄤˋ ˙ㄉㄜ ㄓㄨˋ ㄈㄨˊ ㄓˇ ㄊㄧㄠˊ ㄇㄟˇ ㄍㄜˋ ㄖㄣˊ ㄉㄡ ㄌㄨˋ ㄔㄨ ˙ㄌㄜ ㄘㄢˋ ㄌㄢˋ ˙ㄉㄜ ㄒㄧㄠˋ ㄖㄨㄥˊ',
          'ㄅㄛ ㄅㄛ ㄑㄧㄠˇ ㄑㄧㄠˇ ㄉㄨㄛˇ ㄗㄞˋ ㄐㄧㄣ ㄙㄜˋ ㄔㄚˊ ㄅㄟ ㄆㄤˊ ㄏㄨㄟ ㄉㄨㄥˋ ㄒㄧㄠˇ ㄒㄧㄠˇ ㄊㄤ ㄔˊ ㄙㄚˇ ㄒㄧㄚˋ ㄒㄧㄥ ㄍㄨㄤ ㄅㄢ ˙ㄉㄜ ㄏㄟ ㄊㄤˊ ㄆㄠˋ ˙ㄆㄠ ㄨㄟˋ ㄓㄜˋ ㄔㄤˇ ㄑㄧㄥˋ ㄓㄨˋ ㄏㄨㄟˋ ㄐㄧㄚ ㄧㄡˊ',
          'ㄒㄧㄠˇ ㄑㄧㄥˊ ㄏㄢˋ ㄅㄛ ㄅㄛ ㄒㄧㄤ ㄕˋ ㄧ ㄒㄧㄠˋ ㄩㄝ ㄏㄠˇ ㄧˇ ㄏㄡˋ ㄏㄞˊ ㄧㄠˋ ㄧ ㄑㄧˇ ㄗㄨㄛˋ ㄔㄨ ㄍㄥˋ ㄉㄨㄛ ㄖㄤˋ ㄖㄣˊ ㄒㄧㄥˋ ㄈㄨˊ ˙ㄉㄜ ㄇㄛˊ ㄈㄚˇ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ',
        ],
        englishGist:
          "After the rain clears, Grandma's shop lights up for a lively weekend celebration. Neighbors love the Warm Smile Tea and kind notes while Bobo secretly sprinkles starry bubbles, and Xiaoqing and Bobo promise to make more magical tea together!",
        spotlightVocab: [
          {
            word: '燦爛',
            zhuyin: 'ㄘㄢˋ ㄌㄢˋ',
            hint: 'bright and radiant（非常明亮動人，常形容笑容或陽光）',
          },
          {
            word: '慶祝',
            zhuyin: 'ㄑㄧㄥˋ ㄓㄨˋ',
            hint: 'to celebrate（大家一起開心紀念好事）',
          },
          {
            word: '幸福',
            zhuyin: 'ㄒㄧㄥˋ ㄈㄨˊ',
            hint: 'happy and warm-hearted（心裡滿足又溫暖的感覺）',
          },
        ],
        questions: [
          {
            id: 'ch-boba-magic-ep5-q1',
            skillTag: '細節閱讀',
            prompt: '慶祝會上，波波偷偷躲在茶杯旁做了什麼事？',
            choices: [
              '揮動小湯匙灑下像星光一樣的黑糖泡泡',
              '自己喝光了所有的芒果奶茶',
              '跑去夜市買了一頂新帽子',
              '跳到屋頂上大聲唱歌',
            ],
            correctIndex: 0,
            explanation: '第三句寫到：「波波悄悄躲在金色茶杯旁，揮動小小湯匙灑下星光般的黑糖泡泡」。',
          },
          {
            id: 'ch-boba-magic-ep5-q2',
            skillTag: '主旨理解',
            prompt: '讀完這五集《珍珠奶茶魔法屋》，故事最想傳達什麼感受？',
            choices: [
              '下雨天千萬不要出門買東西',
              '只有買昂貴的機器才能做出好茶',
              '用心分享溫暖和關懷，就像最棒的魔法',
              '小熊精靈不喜歡跟人類交朋友',
            ],
            correctIndex: 2,
            explanation: '從找回珍珠到完成微笑暖茶，故事告訴我們用真心傳遞關懷與快樂，就是最動人的魔法。',
          },
          {
            id: 'ch-boba-magic-ep5-q3',
            skillTag: '劇情推理',
            prompt: '為什麼鄰居們喝完茶都露出燦爛的笑容？',
            choices: [
              '因為奶茶免費送了一百杯',
              '因為大家都在店裡看到了真的魔術師',
              '因為外婆正在發放禮物盒',
              '因為奶茶既香甜，杯上又有溫暖的祝福紙條',
            ],
            correctIndex: 3,
            explanation: '第二句提到大家喝下香甜的微笑暖茶，又讀到杯子上的祝福紙條，心裡覺得很溫暖。',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIES 2 · Tier 2 · 城市解謎（5 集 / 15 題）
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ch-taipei-detective',
    tier: 2,
    title: '小偵探逛台北',
    tagline: '捷運上撿到一張神祕手繪明信片，跟著線索展開台北大冒險！',
    genreTag: '城市解謎',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    emblemCollectibleId: 'critter-otter-mage',
    episodes: [
      {
        id: 'ch-taipei-detective-ep1',
        episodeNumber: 1,
        title: '捷運上的神祕明信片',
        titleZhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ ㄕㄤˋ ˙ㄉㄜ ㄕㄣˊ ㄇㄧˋ ㄇㄧㄥˊ ㄒㄧㄣˋ ㄆㄧㄢˋ',
        sentences: [
          '星期六早上，小安和表姊小羽搭上台北捷運，準備去市區逛街。',
          '列車進站時，小安在座位旁邊撿到一張被風吹落的彩色手繪明信片。',
          '明信片上畫著古色古香的紅磚老街，背面還寫著：「我的速寫畫冊留在老茶行前。」',
          '兩人立刻化身小小偵探，決定先查出畫中的紅磚老街在哪裡，幫失主找回珍貴的畫冊！',
        ],
        sentencesZhuyin: [
          'ㄒㄧㄥ ㄑㄧˊ ㄌㄧㄡˋ ㄗㄠˇ ㄕㄤˋ ㄒㄧㄠˇ ㄢ ㄏㄢˋ ㄅㄧㄠˇ ㄐㄧㄝˇ ㄒㄧㄠˇ ㄩˇ ㄉㄚ ㄕㄤˋ ㄊㄞˊ ㄅㄟˇ ㄐㄧㄝˊ ㄩㄣˋ ㄓㄨㄣˇ ㄅㄟˋ ㄑㄩˋ ㄕˋ ㄑㄩ ㄍㄨㄤˋ ㄐㄧㄝ',
          'ㄌㄧㄝˋ ㄔㄜ ㄐㄧㄣˋ ㄓㄢˋ ㄕˊ ㄒㄧㄠˇ ㄢ ㄗㄞˋ ㄗㄨㄛˋ ㄨㄟˋ ㄆㄤˊ ㄅㄧㄢ ㄐㄧㄢˇ ㄉㄠˋ ㄧ ㄓㄤ ㄅㄟˋ ㄈㄥ ㄔㄨㄟ ㄌㄨㄛˋ ˙ㄉㄜ ㄘㄞˇ ㄙㄜˋ ㄕㄡˇ ㄏㄨㄟˋ ㄇㄧㄥˊ ㄒㄧㄣˋ ㄆㄧㄢˋ',
          'ㄇㄧㄥˊ ㄒㄧㄣˋ ㄆㄧㄢˋ ㄕㄤˋ ㄏㄨㄚˋ ˙ㄓㄜ ㄍㄨˇ ㄙㄜˋ ㄍㄨˇ ㄒㄧㄤ ˙ㄉㄜ ㄏㄨㄥˊ ㄓㄨㄢ ㄌㄠˇ ㄐㄧㄝ ㄅㄟˋ ㄇㄧㄢˋ ㄏㄞˊ ㄒㄧㄝˇ ˙ㄓㄜ ㄨㄛˇ ˙ㄉㄜ ㄙㄨˋ ㄒㄧㄝˇ ㄏㄨㄚˋ ㄘㄜˋ ㄌㄧㄡˊ ㄗㄞˋ ㄌㄠˇ ㄔㄚˊ ㄏㄤˊ ㄑㄧㄢˊ',
          'ㄌㄧㄤˇ ㄖㄣˊ ㄌㄧˋ ㄎㄜˋ ㄏㄨㄚˋ ㄕㄣ ㄒㄧㄠˇ ㄒㄧㄠˇ ㄓㄣ ㄊㄢˋ ㄐㄩㄝˊ ㄉㄧㄥˋ ㄒㄧㄢ ㄔㄚˊ ㄔㄨ ㄏㄨㄚˋ ㄓㄨㄥ ˙ㄉㄜ ㄏㄨㄥˊ ㄓㄨㄢ ㄌㄠˇ ㄐㄧㄝ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ ㄅㄤ ㄕ ㄓㄨˇ ㄓㄠˇ ㄏㄨㄟˊ ㄓㄣ ㄍㄨㄟˋ ˙ㄉㄜ ㄏㄨㄚˋ ㄘㄜˋ',
        ],
        englishGist:
          "On the Taipei MRT, Xiao'an and his cousin Xiaoyu find a hand-painted postcard showing a historic red-brick street and a note about a lost sketchbook at an old tea shop. They become junior detectives to track it down!",
        spotlightVocab: [
          {
            word: '手繪',
            zhuyin: 'ㄕㄡˇ ㄏㄨㄟˋ',
            hint: 'hand-drawn / hand-painted（用雙手親自畫出來的）',
          },
          {
            word: '古色古香',
            zhuyin: 'ㄍㄨˇ ㄙㄜˋ ㄍㄨˇ ㄒㄧㄤ',
            hint: 'classic and historic charm（帶有古老建築與傳統味道）',
          },
          {
            word: '偵探',
            zhuyin: 'ㄓㄣ ㄊㄢˋ',
            hint: 'detective（專門觀察線索、解開謎題的人）',
          },
        ],
        questions: [
          {
            id: 'ch-taipei-detective-ep1-q1',
            skillTag: '細節閱讀',
            prompt: '小安和表姊小羽是在哪裡撿到這張手繪明信片的？',
            choices: [
              '在公車站的長椅下',
              '在台北捷運的座位旁邊',
              '在公園的盪鞦韆上',
              '在便利商店的門口',
            ],
            correctIndex: 1,
            explanation: '前兩句提到他們搭上台北捷運，小安在座位旁邊撿到這張明信片。',
          },
          {
            id: 'ch-taipei-detective-ep1-q2',
            skillTag: '主旨理解',
            prompt: '小安和小羽決定化身小小偵探的原因是什麼？',
            choices: [
              '他們想參加學校的畫畫比賽',
              '他們在捷運上不小心坐過站了',
              '他們想買最多張特別的明信片',
              '他們想循著線索幫失主找回珍貴的畫冊',
            ],
            correctIndex: 3,
            explanation: '最後一句寫明他們想先查出紅磚老街的位置，幫忙把珍貴的畫冊物歸原主。',
          },
          {
            id: 'ch-taipei-detective-ep1-q3',
            skillTag: '詞義推論',
            prompt: '明信片上畫著「古色古香」的紅磚老街，「古色古香」形容老街看起來怎麼樣？',
            choices: [
              '保有古老傳統建築的典雅韻味',
              '全部都是最新蓋好的玻璃高樓',
              '街上到處都飄著濃濃的香水味',
              '牆壁都漆成螢光粉紅色',
            ],
            correctIndex: 0,
            explanation: '「古色古香」常拿來形容建築或街景很有歷史感與古典風味。',
          },
        ],
      },
      {
        id: 'ch-taipei-detective-ep2',
        episodeNumber: 2,
        title: '大稻埕紅磚線索',
        titleZhuyin: 'ㄉㄚˋ ㄉㄠˋ ㄔㄥˊ ㄏㄨㄥˊ ㄓㄨㄢ ㄒㄧㄢˋ ㄙㄨㄛˇ',
        prevRecap: '小安和表姊小羽在捷運上撿到一張手繪明信片，決定出發尋找畫中老茶行的畫冊。',
        sentences: [
          '表姊小羽仔細觀察明信片的屋頂花紋，一眼認出這正是歷史悠久的大稻埕老街！',
          '他們搭車來到大稻埕，沿著飄滿茶香和乾貨香味的騎樓，果然找到了畫裡那間老茶行。',
          '親切的茶行老闆笑著說，早上確實有位愛畫畫的阿姨來買烏龍茶，還把速寫畫冊交給他暫時保管。',
          '畫冊裡夾著一張小紙條，畫著高聳入雲的台北一零一大樓和一盞紅燈籠，指引他們前往下一站！',
        ],
        sentencesZhuyin: [
          'ㄅㄧㄠˇ ㄐㄧㄝˇ ㄒㄧㄠˇ ㄩˇ ㄗˇ ㄒㄧˋ ㄍㄨㄢ ㄔㄚˊ ㄇㄧㄥˊ ㄒㄧㄣˋ ㄆㄧㄢˋ ˙ㄉㄜ ㄨ ㄉㄧㄥˇ ㄏㄨㄚ ㄨㄣˊ ㄧ ㄧㄢˇ ㄖㄣˋ ㄔㄨ ㄓㄜˋ ㄓㄥˋ ㄕˋ ㄌㄧˋ ㄕˇ ㄧㄡ ㄐㄧㄡˇ ˙ㄉㄜ ㄉㄚˋ ㄉㄠˋ ㄔㄥˊ ㄌㄠˇ ㄐㄧㄝ',
          'ㄊㄚ ˙ㄇㄣ ㄉㄚ ㄔㄜ ㄌㄞˊ ㄉㄠˋ ㄉㄚˋ ㄉㄠˋ ㄔㄥˊ ㄧㄢˊ ˙ㄓㄜ ㄆㄧㄠ ㄇㄢˇ ㄔㄚˊ ㄒㄧㄤ ㄏㄢˋ ㄍㄢ ㄏㄨㄛˋ ㄒㄧㄤ ㄨㄟˋ ˙ㄉㄜ ㄑㄧˊ ㄌㄡˊ ㄍㄨㄛˇ ㄖㄢˊ ㄓㄠˇ ㄉㄠˋ ˙ㄌㄜ ㄏㄨㄚˋ ㄌㄧˇ ㄋㄚˋ ㄐㄧㄢ ㄌㄠˇ ㄔㄚˊ ㄏㄤˊ',
          'ㄑㄧㄣ ㄑㄧㄝˋ ˙ㄉㄜ ㄔㄚˊ ㄏㄤˊ ㄌㄠˇ ㄅㄢˇ ㄒㄧㄠˋ ˙ㄓㄜ ㄕㄨㄛ ㄗㄠˇ ㄕㄤˋ ㄑㄩㄝˋ ㄕˊ ㄧㄡˇ ㄨㄟˋ ㄞˋ ㄏㄨㄚˋ ㄏㄨㄚˋ ˙ㄉㄜ ㄚ ㄧˊ ㄌㄞˊ ㄇㄞˇ ㄨ ㄌㄨㄥˊ ㄔㄚˊ ㄏㄞˊ ㄅㄚˇ ㄙㄨˋ ㄒㄧㄝˇ ㄏㄨㄚˋ ㄘㄜˋ ㄐㄧㄠ ㄍㄟˇ ㄊㄚ ㄓㄢˋ ㄕˊ ㄅㄠˇ ㄍㄨㄢˇ',
          'ㄏㄨㄚˋ ㄘㄜˋ ㄌㄧˇ ㄐㄧㄚˊ ˙ㄓㄜ ㄧ ㄓㄤ ㄒㄧㄠˇ ㄓˇ ㄊㄧㄠˊ ㄏㄨㄚˋ ˙ㄓㄜ ㄍㄠ ㄙㄨㄥˇ ㄖㄨˋ ㄩㄣˊ ˙ㄉㄜ ㄊㄞˊ ㄅㄟˇ ㄧ ㄌㄧㄥˊ ㄧ ㄉㄚˋ ㄌㄡˊ ㄏㄢˋ ㄧ ㄓㄢˇ ㄏㄨㄥˊ ㄉㄥ ˙ㄌㄨㄥ ㄓˇ ㄧㄣˇ ㄊㄚ ˙ㄇㄣ ㄑㄧㄢˊ ㄨㄤˇ ㄒㄧㄚˋ ㄧ ㄓㄢˋ',
        ],
        englishGist:
          "Xiaoyu recognizes the roof details as historic Dadaocheng! At the old tea shop, the kind owner hands over the painter's sketchbook—inside is a note showing Taipei 101 and a red lantern, pointing to the next clue.",
        spotlightVocab: [
          {
            word: '觀察',
            zhuyin: 'ㄍㄨㄢ ㄔㄚˊ',
            hint: 'to observe closely（用心仔細地查看細節）',
          },
          {
            word: '保管',
            zhuyin: 'ㄅㄠˇ ㄍㄨㄢˇ',
            hint: 'to keep safe for someone（幫忙妥善收好、照顧物品）',
          },
          {
            word: '指引',
            zhuyin: 'ㄓˇ ㄧㄣˇ',
            hint: 'to guide / point the way（指出正確的方向或線索）',
          },
        ],
        questions: [
          {
            id: 'ch-taipei-detective-ep2-q1',
            skillTag: '細節閱讀',
            prompt: '小羽是怎麼認出明信片畫的地方是大稻埕的？',
            choices: [
              '明信片背面直接印著大稻埕地圖',
              '路邊的司機主動告訴她',
              '她仔細觀察畫上的屋頂花紋',
              '她在畫裡看到自己家的陽台',
            ],
            correctIndex: 2,
            explanation: '第一句寫到：「表姊小羽仔細觀察明信片的屋頂花紋，一眼認出這正是歷史悠久的大稻埕老街」。',
          },
          {
            id: 'ch-taipei-detective-ep2-q2',
            skillTag: '細節閱讀',
            prompt: '畫冊裡夾著的小紙條畫了哪兩樣提示？',
            choices: [
              '台北一零一大樓和一盞紅燈籠',
              '一隻大象和兩艘帆船',
              '一座雪山和一把雨傘',
              '一碗牛肉麵和三支湯匙',
            ],
            correctIndex: 0,
            explanation: '第四句指出，小紙條上畫著台北一零一大樓和一盞紅燈籠。',
          },
          {
            id: 'ch-taipei-detective-ep2-q3',
            skillTag: '劇情推理',
            prompt: '茶行老闆把畫冊拿給小安和小羽後，他們接下來應該怎麼做？',
            choices: [
              '把畫冊帶回家自己收藏起來',
              '照著紙條上的圖案線索，前往台北一零一附近尋找畫家',
              '把畫冊送給隔壁的點心店',
              '直接把紙條揉成一團丟掉',
            ],
            correctIndex: 1,
            explanation: '紙條上的圖案是指引下一站的線索，所以他們會前往台北一零一附近繼續尋找畫家阿姨。',
          },
        ],
      },
      {
        id: 'ch-taipei-detective-ep3',
        episodeNumber: 3,
        title: '高塔旁的燈籠謎題',
        titleZhuyin: 'ㄍㄠ ㄊㄚˇ ㄆㄤˊ ˙ㄉㄜ ㄉㄥ ˙ㄌㄨㄥ ㄇㄧˊ ㄊㄧˊ',
        prevRecap: '兩人在大稻埕老茶行領回畫冊，發現裡面夾著畫有台北一零一大樓和紅燈籠的新線索。',
        sentences: [
          '小安和小羽來到台北一零一旁的文創廣場，抬頭望見高聳的大樓在陽光下閃閃發亮。',
          '廣場角落果然掛著一排紅燈籠，其中一盞燈籠下綁著一道有趣的文字謎題。',
          '謎題寫著：「滿屋紙頁藏故事，安靜閱讀飄書香，找找印有貓頭鷹印章的地方。」',
          '小安眼睛一亮，拍手喊道：「滿屋紙頁又飄書香，這一定是指附近的獨立書店！」',
        ],
        sentencesZhuyin: [
          'ㄒㄧㄠˇ ㄢ ㄏㄢˋ ㄒㄧㄠˇ ㄩˇ ㄌㄞˊ ㄉㄠˋ ㄊㄞˊ ㄅㄟˇ ㄧ ㄌㄧㄥˊ ㄧ ㄆㄤˊ ˙ㄉㄜ ㄨㄣˊ ㄔㄨㄤˋ ㄍㄨㄤˇ ㄔㄤˇ ㄊㄞˊ ㄊㄡˊ ㄨㄤˋ ㄐㄧㄢˋ ㄍㄠ ㄙㄨㄥˇ ˙ㄉㄜ ㄉㄚˋ ㄌㄡˊ ㄗㄞˋ ㄧㄤˊ ㄍㄨㄤ ㄒㄧㄚˋ ㄕㄢˇ ㄕㄢˇ ㄈㄚ ㄌㄧㄤˋ',
          'ㄍㄨㄤˇ ㄔㄤˇ ㄐㄧㄠˇ ㄌㄨㄛˋ ㄍㄨㄛˇ ㄖㄢˊ ㄍㄨㄚˋ ˙ㄓㄜ ㄧ ㄆㄞˊ ㄏㄨㄥˊ ㄉㄥ ˙ㄌㄨㄥ ㄑㄧˊ ㄓㄨㄥ ㄧ ㄓㄢˇ ㄉㄥ ˙ㄌㄨㄥ ㄒㄧㄚˋ ㄅㄤˇ ˙ㄓㄜ ㄧ ㄉㄠˋ ㄧㄡˇ ㄑㄩˋ ˙ㄉㄜ ㄨㄣˊ ㄗˋ ㄇㄧˊ ㄊㄧˊ',
          'ㄇㄧˊ ㄊㄧˊ ㄒㄧㄝˇ ˙ㄓㄜ ㄇㄢˇ ㄨ ㄓˇ ㄧㄝˋ ㄘㄤˊ ㄍㄨˋ ˙ㄕ ㄢ ㄐㄧㄥˋ ㄩㄝˋ ㄉㄨˊ ㄆㄧㄠ ㄕㄨ ㄒㄧㄤ ㄓㄠˇ ㄓㄠˇ ㄧㄣˋ ㄧㄡˇ ㄇㄠ ㄊㄡˊ ㄧㄥ ㄧㄣˋ ㄓㄤ ˙ㄉㄜ ㄉㄧˋ ˙ㄈㄤ',
          'ㄒㄧㄠˇ ㄢ ㄧㄢˇ ㄐㄧㄥ ㄧ ㄌㄧㄤˋ ㄆㄞ ㄕㄡˇ ㄏㄢˇ ㄉㄠˋ ㄇㄢˇ ㄨ ㄓˇ ㄧㄝˋ ㄧㄡˋ ㄆㄧㄠ ㄕㄨ ㄒㄧㄤ ㄓㄜˋ ㄧ ㄉㄧㄥˋ ㄕˋ ㄓˇ ㄈㄨˋ ㄐㄧㄣˋ ˙ㄉㄜ ㄉㄨˊ ㄌㄧˋ ㄕㄨ ㄉㄧㄢˋ',
        ],
        englishGist:
          "Near the towering Taipei 101, Xiao'an and Xiaoyu spot a row of red lanterns hiding a riddle about a quiet room full of book pages and an owl stamp. Xiao'an excitedly cracks it: they need to visit a nearby independent bookstore!",
        spotlightVocab: [
          {
            word: '高聳',
            zhuyin: 'ㄍㄠ ㄙㄨㄥˇ',
            hint: 'towering / very tall（高高直立、非常高大）',
          },
          {
            word: '謎題',
            zhuyin: 'ㄇㄧˊ ㄊㄧˊ',
            hint: 'riddle / puzzle（需要動腦筋猜答案的題目）',
          },
          {
            word: '閱讀',
            zhuyin: 'ㄩㄝˋ ㄉㄨˊ',
            hint: 'to read（專心看書、理解文字內容）',
          },
        ],
        questions: [
          {
            id: 'ch-taipei-detective-ep3-q1',
            skillTag: '細節閱讀',
            prompt: '燈籠底下的謎題要他們尋找印有哪種動物印章的地方？',
            choices: ['小兔子印章', '大熊貓印章', '蝴蝶印章', '貓頭鷹印章'],
            correctIndex: 3,
            explanation: '第三句謎題提到：「找找印有貓頭鷹印章的地方。」',
          },
          {
            id: 'ch-taipei-detective-ep3-q2',
            skillTag: '劇情推理',
            prompt: '小安為什麼能馬上猜出謎底指的是「書店」？',
            choices: [
              '因為燈籠旁邊直接寫著書店電話',
              '因為「滿屋紙頁藏故事」和「飄書香」都符合書店的特色',
              '因為書店老闆在廣場大聲廣播',
              '因為只有書店才賣紅燈籠',
            ],
            correctIndex: 1,
            explanation: '謎題中的「滿屋紙頁」、「藏故事」、「安靜閱讀」、「飄書香」都是在描寫書店的樣子。',
          },
          {
            id: 'ch-taipei-detective-ep3-q3',
            skillTag: '詞義推論',
            prompt: '文中寫「小安眼睛一亮，拍手喊道」，這句話表現出小安當時的什麼反應？',
            choices: [
              '被陽光刺得睜不開眼睛',
              '覺得太累了想要馬上回家',
              '突然想到答案，非常興奮開心',
              '不小心把畫冊掉在地上了',
            ],
            correctIndex: 2,
            explanation: '「眼睛一亮」加上「拍手喊道」，生動展現小安靈光一閃、猜出謎底時的興奮模樣。',
          },
        ],
      },
      {
        id: 'ch-taipei-detective-ep4',
        episodeNumber: 4,
        title: '書店裡的印章密碼',
        titleZhuyin: 'ㄕㄨ ㄉㄧㄢˋ ㄌㄧˇ ˙ㄉㄜ ㄧㄣˋ ㄓㄤ ㄇㄧˋ ㄇㄚˇ',
        prevRecap: '小安和小羽在台北一零一旁解開紅燈籠謎題，鎖定了有貓頭鷹印章的獨立書店。',
        sentences: [
          '推開木門走進溫馨的獨立書店，櫃子上果然放著一顆可愛的貓頭鷹紀念印章。',
          '小羽拿出明信片仔細比對，發現明信片角落蓋著半個貓頭鷹印記，旁邊還有四個神祕符號。',
          '兩人將明信片和書店的導覽地圖拼在一起，符號剛好連成一條通往河濱公園畫架的路線！',
          '書店店員聽完驚呼：「那位愛畫畫的林阿姨每逢週末下午都會去河邊寫生，快去找她吧！」',
        ],
        sentencesZhuyin: [
          'ㄊㄨㄟ ㄎㄞ ㄇㄨˋ ㄇㄣˊ ㄗㄡˇ ㄐㄧㄣˋ ㄨㄣ ㄒㄧㄣ ˙ㄉㄜ ㄉㄨˊ ㄌㄧˋ ㄕㄨ ㄉㄧㄢˋ ㄍㄨㄟˋ ˙ㄗ ㄕㄤˋ ㄍㄨㄛˇ ㄖㄢˊ ㄈㄤˋ ˙ㄓㄜ ㄧ ㄎㄜ ㄎㄜˇ ㄞˋ ˙ㄉㄜ ㄇㄠ ㄊㄡˊ ㄧㄥ ㄐㄧˋ ㄋㄧㄢˋ ㄧㄣˋ ㄓㄤ',
          'ㄒㄧㄠˇ ㄩˇ ㄋㄚˊ ㄔㄨ ㄇㄧㄥˊ ㄒㄧㄣˋ ㄆㄧㄢˋ ㄗˇ ㄒㄧˋ ㄅㄧˇ ㄉㄨㄟˋ ㄈㄚ ㄒㄧㄢˋ ㄇㄧㄥˊ ㄒㄧㄣˋ ㄆㄧㄢˋ ㄐㄧㄠˇ ㄌㄨㄛˋ ㄍㄞˋ ˙ㄓㄜ ㄅㄢˋ ㄍㄜˋ ㄇㄠ ㄊㄡˊ ㄧㄥ ㄧㄣˋ ㄐㄧˋ ㄆㄤˊ ㄅㄧㄢ ㄏㄞˊ ㄧㄡˇ ㄙˋ ㄍㄜˋ ㄕㄣˊ ㄇㄧˋ ㄈㄨˊ ㄏㄠˋ',
          'ㄌㄧㄤˇ ㄖㄣˊ ㄐㄧㄤ ㄇㄧㄥˊ ㄒㄧㄣˋ ㄆㄧㄢˋ ㄏㄢˋ ㄕㄨ ㄉㄧㄢˋ ˙ㄉㄜ ㄉㄠˇ ㄌㄢˇ ㄉㄧˋ ㄊㄨˊ ㄆㄧㄣ ㄗㄞˋ ㄧ ㄑㄧˇ ㄈㄨˊ ㄏㄠˋ ㄍㄤ ㄏㄠˇ ㄌㄧㄢˊ ㄔㄥˊ ㄧ ㄊㄧㄠˊ ㄊㄨㄥ ㄨㄤˇ ㄏㄜˊ ㄅㄧㄣ ㄍㄨㄥ ㄩㄢˊ ㄏㄨㄚˋ ㄐㄧㄚˋ ˙ㄉㄜ ㄌㄨˋ ㄒㄧㄢˋ',
          'ㄕㄨ ㄉㄧㄢˋ ㄉㄧㄢˋ ㄩㄢˊ ㄊㄧㄥ ㄨㄢˊ ㄐㄧㄥ ㄏㄨ ㄋㄚˋ ㄨㄟˋ ㄞˋ ㄏㄨㄚˋ ㄏㄨㄚˋ ˙ㄉㄜ ㄌㄧㄣˊ ㄚ ㄧˊ ㄇㄟˇ ㄈㄥˊ ㄓㄡ ㄇㄛˋ ㄒㄧㄚˋ ㄨˇ ㄉㄡ ㄏㄨㄟˋ ㄑㄩˋ ㄏㄜˊ ㄅㄧㄢ ㄒㄧㄝˇ ㄕㄥ ㄎㄨㄞˋ ㄑㄩˋ ㄓㄠˇ ㄊㄚ ˙ㄅㄚ',
        ],
        englishGist:
          "Inside the cozy bookstore, Xiaoyu matches the postcard's half owl stamp and four secret symbols with the shop's neighborhood map, revealing a path to the riverside park where Auntie Lin paints every weekend afternoon!",
        spotlightVocab: [
          {
            word: '溫馨',
            zhuyin: 'ㄨㄣ ㄒㄧㄣ',
            hint: 'warm and cozy（令人感到溫暖舒服的氣氛）',
          },
          {
            word: '比對',
            zhuyin: 'ㄅㄧˇ ㄉㄨㄟˋ',
            hint: 'to compare and match（把兩樣東西放在一起仔細對照）',
          },
          {
            word: '寫生',
            zhuyin: 'ㄒㄧㄝˇ ㄕㄥ',
            hint: 'to sketch from real life outdoors（看著真實風景直接畫下來）',
          },
        ],
        questions: [
          {
            id: 'ch-taipei-detective-ep4-q1',
            skillTag: '細節閱讀',
            prompt: '小安和小羽把明信片和什麼東西拼在一起，才解開了符號密碼？',
            choices: [
              '書店的導覽地圖',
              '捷運的車票背面',
              '茶行的價目表',
              '公園的門票',
            ],
            correctIndex: 0,
            explanation: '第三句寫到他們把明信片和書店的導覽地圖拼在一起，符號連成了通往河濱公園的路線。',
          },
          {
            id: 'ch-taipei-detective-ep4-q2',
            skillTag: '詞義推論',
            prompt: '店員說林阿姨喜歡去河邊「寫生」，「寫生」是什麼活動？',
            choices: [
              '在河邊練習寫書法',
              '在日記本上記錄生日',
              '比賽誰寫字速度最快',
              '看著眼前的真實風景畫畫',
            ],
            correctIndex: 3,
            explanation: '「寫生」是指到戶外或現場，直接觀察真實的風景與事物來作畫。',
          },
          {
            id: 'ch-taipei-detective-ep4-q3',
            skillTag: '劇情推理',
            prompt: '從這集的故事可以推測，這場城市尋人任務現在進行到哪個階段了？',
            choices: [
              '線索完全中斷，只好放棄',
              '還不知道畫冊是誰弄丟的',
              '已經找到畫家的去處，就快完成任務了',
              '兩人決定改去吃冰淇淋不再找人',
            ],
            correctIndex: 2,
            explanation: '他們不只解開了路線密碼，還從店員口中知道林阿姨週末下午就在河邊寫生，離任務成功只差最後一步！',
          },
        ],
      },
      {
        id: 'ch-taipei-detective-ep5',
        episodeNumber: 5,
        title: '河畔的感謝水彩畫',
        titleZhuyin: 'ㄏㄜˊ ㄆㄢˋ ˙ㄉㄜ ㄍㄢˇ ㄒㄧㄝˋ ㄕㄨㄟˇ ㄘㄞˇ ㄏㄨㄚˋ',
        prevRecap: '小安和小羽在獨立書店解開印章密碼，得知畫家林阿姨正在河濱公園寫生。',
        sentences: [
          '微風輕拂著河濱公園，小安和小羽遠遠看見林阿姨正專心地在畫架前調配水彩。',
          '當他們雙手遞上失而復得的速寫畫冊時，林阿姨驚喜得眼眶微微泛紅，連聲向這對小夥伴道謝。',
          '原來這本畫冊記錄了她走遍台灣各地的珍貴回憶，少了它就無法完成下個月的繪本展覽。',
          '為了感謝他們，林阿姨現場畫了一張兩人在夕陽下探險的水彩畫送給他們，成為最棒的台北紀念！',
        ],
        sentencesZhuyin: [
          'ㄨㄟˊ ㄈㄥ ㄑㄧㄥ ㄈㄨˊ ˙ㄓㄜ ㄏㄜˊ ㄅㄧㄣ ㄍㄨㄥ ㄩㄢˊ ㄒㄧㄠˇ ㄢ ㄏㄢˋ ㄒㄧㄠˇ ㄩˇ ㄩㄢˇ ㄩㄢˇ ㄎㄢˋ ㄐㄧㄢˋ ㄌㄧㄣˊ ㄚ ㄧˊ ㄓㄥˋ ㄓㄨㄢ ㄒㄧㄣ ˙ㄉㄜ ㄗㄞˋ ㄏㄨㄚˋ ㄐㄧㄚˋ ㄑㄧㄢˊ ㄊㄧㄠˊ ㄆㄟˋ ㄕㄨㄟˇ ㄘㄞˇ',
          'ㄉㄤ ㄊㄚ ˙ㄇㄣ ㄕㄨㄤ ㄕㄡˇ ㄉㄧˋ ㄕㄤˋ ㄕ ㄦˊ ㄈㄨˋ ㄉㄜˊ ˙ㄉㄜ ㄙㄨˋ ㄒㄧㄝˇ ㄏㄨㄚˋ ㄘㄜˋ ㄕˊ ㄌㄧㄣˊ ㄚ ㄧˊ ㄐㄧㄥ ㄒㄧˇ ˙ㄉㄜ ㄧㄢˇ ㄎㄨㄤ ㄨㄟˊ ㄨㄟˊ ㄈㄢˋ ㄏㄨㄥˊ ㄌㄧㄢˊ ㄕㄥ ㄒㄧㄤˋ ㄓㄜˋ ㄉㄨㄟˋ ㄒㄧㄠˇ ㄏㄨㄛˇ ㄅㄢˋ ㄉㄠˋ ㄒㄧㄝˋ',
          'ㄩㄢˊ ㄌㄞˊ ㄓㄜˋ ㄅㄣˇ ㄏㄨㄚˋ ㄘㄜˋ ㄐㄧˋ ㄌㄨˋ ˙ㄌㄜ ㄊㄚ ㄗㄡˇ ㄅㄧㄢˋ ㄊㄞˊ ㄨㄢ ㄍㄜˋ ㄉㄧˋ ˙ㄉㄜ ㄓㄣ ㄍㄨㄟˋ ㄏㄨㄟˊ ㄧˋ ㄕㄠˇ ˙ㄌㄜ ㄊㄚ ㄐㄧㄡˋ ㄨˊ ㄈㄚˇ ㄨㄢˊ ㄔㄥˊ ㄒㄧㄚˋ ㄍㄜˋ ㄩㄝˋ ˙ㄉㄜ ㄏㄨㄟˋ ㄅㄣˇ ㄓㄢˇ ㄌㄢˇ',
          'ㄨㄟˋ ˙ㄌㄜ ㄍㄢˇ ㄒㄧㄝˋ ㄊㄚ ˙ㄇㄣ ㄌㄧㄣˊ ㄚ ㄧˊ ㄒㄧㄢˋ ㄔㄤˇ ㄏㄨㄚˋ ˙ㄌㄜ ㄧ ㄓㄤ ㄌㄧㄤˇ ㄖㄣˊ ㄗㄞˋ ㄒㄧˋ ㄧㄤˊ ㄒㄧㄚˋ ㄊㄢˋ ㄒㄧㄢˇ ˙ㄉㄜ ㄕㄨㄟˇ ㄘㄞˇ ㄏㄨㄚˋ ㄙㄨㄥˋ ㄍㄟˇ ㄊㄚ ˙ㄇㄣ ㄔㄥˊ ㄨㄟˊ ㄗㄨㄟˋ ㄅㄤˋ ˙ㄉㄜ ㄊㄞˊ ㄅㄟˇ ㄐㄧˋ ㄋㄧㄢˋ',
        ],
        englishGist:
          "At the breezy riverside park, Xiao'an and Xiaoyu return the sketchbook to Auntie Lin, who is deeply moved because it holds sketches for her upcoming picture-book show. In thanks, she paints a sunset watercolor of their adventure!",
        spotlightVocab: [
          {
            word: '失而復得',
            zhuyin: 'ㄕ ㄦˊ ㄈㄨˋ ㄉㄜˊ',
            hint: 'lost and found again（原本弄丟的東西又重新找回來）',
          },
          {
            word: '記錄',
            zhuyin: 'ㄐㄧˋ ㄌㄨˋ',
            hint: 'to record（把見聞或畫面保存記載下來）',
          },
          {
            word: '夥伴',
            zhuyin: 'ㄏㄨㄛˇ ㄅㄢˋ',
            hint: 'partner / teammate（一起合作、互相幫忙的好同伴）',
          },
        ],
        questions: [
          {
            id: 'ch-taipei-detective-ep5-q1',
            skillTag: '細節閱讀',
            prompt: '為什麼這本速寫畫冊對林阿姨這麼重要？',
            choices: [
              '裡面夾著捷運的免費票券',
              '它記錄了台灣各地的回憶，也是下個月繪本展覽的重要作品',
              '它是書店老闆借給她的漫畫書',
              '裡面寫著大稻埕茶行的茶譜',
            ],
            correctIndex: 1,
            explanation: '第三句寫明畫冊記錄了她走遍台灣各地的珍貴回憶，也是下個月繪本展覽不可或缺的資料。',
          },
          {
            id: 'ch-taipei-detective-ep5-q2',
            skillTag: '主旨理解',
            prompt: '林阿姨最後用什麼方式感謝小安和小羽的熱心幫忙？',
            choices: [
              '請他們去百貨公司買新玩具',
              '送給他們一大盒烏龍茶葉',
              '帶他們去搭摩天輪看夜景',
              '現場畫了一張兩人在夕陽下探險的水彩畫送給他們',
            ],
            correctIndex: 3,
            explanation: '最後一句提到林阿姨現場畫了一張兩人在夕陽下探險的水彩畫當作感謝禮物。',
          },
          {
            id: 'ch-taipei-detective-ep5-q3',
            skillTag: '詞義推論',
            prompt: '文章說林阿姨看到「失而復得」的畫冊感動極了，「失而復得」的意思是什麼？',
            choices: [
              '原本遺失的珍貴東西又重新找回來了',
              '不小心把東西弄壞了',
              '花了很久時間還是找不到',
              '買了一本一模一樣的新畫冊',
            ],
            correctIndex: 0,
            explanation: '「失」是遺失，「復得」是重新得到，合起來表示弄丟後又找回來。',
          },
        ],
      },
    ],
  },
];

import type { DifficultyTier } from '../../core/types';
import type { FigurativeQuestSet } from './figurativeTypes';

export type {
  FigurativeCategory,
  FigurativeQuestion,
  FigurativeQuestSet,
} from './figurativeTypes';

export const BUILTIN_FIGURATIVE_SETS: FigurativeQuestSet[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 1: FOUNDATIONS — Similes, Everyday Idioms & Definition Clues (15 Qs)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'en-fig-01',
    tier: 1,
    category: 'simile',
    categoryTag: 'Simile',
    title: 'Simile Sparkles (like & as)',
    subtitle: 'Compare two unlike things with "like" or "as"',
    emblemCollectibleId: 'critter-sprout-bunny',
    accentHex: '#16A34A',
    bgHex: '#F0FDF4',
    questions: [
      {
        id: 'en-fig-01-q1',
        emoji: '🐾',
        passage:
          "After playing in the fresh snow, Mochi the puppy's paws felt as cold as ice cubes.",
        question: "What does this simile tell us about Mochi's paws?",
        highlightPhrase: 'as cold as ice cubes',
        spokenText:
          "After playing in the fresh snow, Mochi the puppy's paws felt as cold as ice cubes.",
        choices: [
          'They were freezing cold.',
          'They were shaped like squares.',
          'They were covered in sugar.',
          'They were warm and fuzzy.',
        ],
        correctIndex: 0,
        explanationEn:
          'This simile uses "as ... as" to compare Mochi’s chilly paws to ice cubes, showing they felt freezing cold.',
        explanationZh:
          '這句「明喻（Simile）」用 as...as 把小狗冰涼的腳掌比喻成冰塊，表示牠的腳掌冷得像結冰一樣！',
      },
      {
        id: 'en-fig-01-q2',
        emoji: '🐱',
        passage:
          'When Chloe opened her birthday box, the golden kitten curled up like a fluffy cotton ball.',
        question: 'Which two unlike things is this simile comparing?',
        highlightPhrase: 'like a fluffy cotton ball',
        spokenText:
          'When Chloe opened her birthday box, the golden kitten curled up like a fluffy cotton ball.',
        choices: [
          'A birthday box and a shiny ribbon',
          'A golden kitten and a fluffy cotton ball',
          'Chloe and her birthday cake',
          'Soft cotton and a bedroom pillow',
        ],
        correctIndex: 1,
        explanationEn:
          'A simile compares two different things using "like" or "as"—here, the curled-up kitten is compared to a fluffy cotton ball.',
        explanationZh:
          '明喻會用 like 或 as 比較兩種不同的事物；這裡把蜷縮成一團的小貓比喻成蓬鬆的棉花球。',
      },
      {
        id: 'en-fig-01-q3',
        emoji: '🎒',
        passage:
          'Her backpack was as heavy as a boulder after she packed three library books and her art kit.',
        question: 'Why did the author compare the backpack to a boulder?',
        highlightPhrase: 'as heavy as a boulder',
        spokenText:
          'Her backpack was as heavy as a boulder after she packed three library books and her art kit.',
        choices: [
          'To show the backpack was gray and bumpy.',
          'To show she hiked up a rocky mountain.',
          'To show the backpack weighed a lot.',
          'To show the library books were about stones.',
        ],
        correctIndex: 2,
        explanationEn:
          'Boulders are giant, super-heavy rocks, so "as heavy as a boulder" helps the reader feel how weighty her stuffed backpack was.',
        explanationZh:
          'boulder 是巨石；用「像巨石一樣重」來形容書包，讓讀者立刻感受到書包沉甸甸的重量。',
      },
      {
        id: 'en-fig-01-q4',
        emoji: '🔔',
        passage:
          "Not every sentence with the word 'like' is a simile! A true simile compares two unlike things.",
        question: 'Which sentence below is a TRUE simile?',
        highlightPhrase: 'compares two unlike things',
        spokenText:
          "Not every sentence with the word like is a simile! A true simile compares two unlike things.",
        choices: [
          'Maya likes strawberry cupcakes with rainbow sprinkles.',
          'The twin sisters look just like each other.',
          'Her bright laugh sparkled like tiny silver bells.',
          'I would like to visit the science museum on Saturday.',
        ],
        correctIndex: 2,
        explanationEn:
          '"Sparkled like tiny silver bells" compares a laugh to bells (two unlike things!). In the other choices, "like" means enjoy, wish, or look literally similar.',
        explanationZh:
          '要注意！並不是看到 like 就是明喻：like 當動詞「喜歡」或比較長相相似的雙胞胎都不算；把「笑聲」比喻成「銀鈴」才是真正的明喻！',
      },
      {
        id: 'en-fig-01-q5',
        emoji: '🪁',
        passage:
          'The ribbon kite soared through the breezy park sky like a painted dragon.',
        question: 'What picture does this simile help the reader imagine?',
        highlightPhrase: 'like a painted dragon',
        spokenText:
          'The ribbon kite soared through the breezy park sky like a painted dragon.',
        choices: [
          'A kite breathing real fire onto the grass.',
          'A heavy stone statue resting on a bench.',
          'A tiny lizard hiding inside a backpack.',
          'A colorful kite swooping gracefully through the air.',
        ],
        correctIndex: 3,
        explanationEn:
          'Comparing the ribbon kite to a painted dragon paints a lively picture of bright colors gliding and twisting across the sky.',
        explanationZh:
          '把彩帶風箏比喻成「彩繪飛龍」，讓畫面立刻生動起來，彷彿看到色彩繽紛的風箏在天空中優雅盤旋。',
      },
    ],
  },

  {
    id: 'en-fig-02',
    tier: 1,
    category: 'idiom',
    categoryTag: 'Idiom',
    title: 'Everyday Idiom Magic',
    subtitle: 'Unlock fun phrases whose real meaning is a surprise',
    emblemCollectibleId: 'sweet-honey-toast',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    questions: [
      {
        id: 'en-fig-02-q1',
        emoji: '🍰',
        passage:
          'After practicing her multiplication facts all week, Hannah thought the Friday quiz was a piece of cake.',
        question: 'What does the idiom "a piece of cake" mean here?',
        highlightPhrase: 'a piece of cake',
        spokenText:
          'After practicing her multiplication facts all week, Hannah thought the Friday quiz was a piece of cake.',
        choices: [
          'The teacher handed out frosted birthday cake.',
          'The quiz was very easy to complete.',
          'The quiz took all afternoon to finish.',
          'Hannah forgot to eat her lunch first.',
        ],
        correctIndex: 1,
        explanationEn:
          '"A piece of cake" is a classic idiom meaning something is super easy—not literal dessert!',
        explanationZh:
          'a piece of cake 字面是「一塊蛋糕」，其實是英文超常見的慣用語，意思是「輕而易舉、超簡單」（就像中文說「小菜一碟」）。',
      },
      {
        id: 'en-fig-02-q2',
        emoji: '🦋',
        passage:
          'Right before stepping onto the stage for her violin recital, Lily felt butterflies in her stomach.',
        question: 'What does "butterflies in her stomach" mean?',
        highlightPhrase: 'butterflies in her stomach',
        spokenText:
          'Right before stepping onto the stage for her violin recital, Lily felt butterflies in her stomach.',
        choices: [
          'She felt nervous and fluttery inside.',
          'She caught real insects in the school garden.',
          'She was hungry for a huge dinner.',
          'She felt sleepy after practicing music.',
        ],
        correctIndex: 0,
        explanationEn:
          'Having "butterflies in your stomach" describes that jittery, fluttery feeling when you are nervous or excited before a big moment.',
        explanationZh:
          'butterflies in one’s stomach 形容緊張時肚子七上八下、像有蝴蝶在裡面飛的感覺，中文常說「心裡小鹿亂撞」。',
      },
      {
        id: 'en-fig-02-q3',
        emoji: '🎭',
        passage:
          "Our whole class cheered, 'Break a leg!' right before Nora walked onstage for the school play.",
        question: 'Why did Nora’s classmates say "Break a leg!"?',
        highlightPhrase: 'Break a leg!',
        spokenText:
          'Our whole class cheered, Break a leg! right before Nora walked onstage for the school play.',
        choices: [
          'They wanted her to trip over a prop.',
          'They were warning her about slippery stairs.',
          'They were wishing her good luck in the show.',
          'They asked her to take a long nap.',
        ],
        correctIndex: 2,
        explanationEn:
          'In theater tradition, "Break a leg!" is a friendly idiom that actually means "Good luck and do a great job!"',
        explanationZh:
          'Break a leg! 在表演場合千萬別照字面翻譯喔！它是歐美劇場界祝福「祝你演出大成功、好運加油」的慣用語。',
      },
      {
        id: 'en-fig-02-q4',
        emoji: '🫘',
        passage:
          "Sam promised to keep Mom's surprise party a secret, so we begged him not to spill the beans.",
        question: 'What does the idiom "spill the beans" mean?',
        highlightPhrase: 'spill the beans',
        spokenText:
          "Sam promised to keep Mom's surprise party a secret, so we begged him not to spill the beans.",
        choices: [
          'Drop a hot pot of soup on the kitchen floor.',
          'Plant magic seeds in the sunny backyard.',
          'Forget to frost the birthday cupcakes.',
          'Accidentally tell a secret to someone.',
        ],
        correctIndex: 3,
        explanationEn:
          'To "spill the beans" means to let out a secret—usually before it is supposed to be shared!',
        explanationZh:
          'spill the beans 字面是「把豆子打翻」，實際意思是「說漏嘴、把祕密洩漏出去」。',
      },
      {
        id: 'en-fig-02-q5',
        emoji: '🌦️',
        passage:
          'When Maya woke up with a sniffle and a sore throat, she stayed home to rest because she felt under the weather.',
        question: 'What does "under the weather" mean in this sentence?',
        highlightPhrase: 'under the weather',
        spokenText:
          'When Maya woke up with a sniffle and a sore throat, she stayed home to rest because she felt under the weather.',
        choices: [
          'Standing outside during a summer rainstorm.',
          'Feeling a little sick or unwell.',
          'Watching fluffy clouds drift past the window.',
          'Wearing a bright yellow raincoat indoors.',
        ],
        correctIndex: 1,
        explanationEn:
          'Feeling "under the weather" is a common idiom meaning you feel slightly sick or not your usual healthy self.',
        explanationZh:
          'under the weather 意思是「身體微恙、有點不舒服」，搭配前面的流鼻水和喉嚨痛線索，就能輕鬆記住！',
      },
    ],
  },

  {
    id: 'en-fig-03',
    tier: 1,
    category: 'context-clues',
    categoryTag: 'Context Clues',
    title: 'Context Clue Detective: Definitions',
    subtitle: 'Spot built-in definitions hiding right inside the sentence',
    emblemCollectibleId: 'space-astro-corgi',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    questions: [
      {
        id: 'en-fig-03-q1',
        emoji: '🦉',
        passage:
          'Owls are nocturnal animals, which means they stay awake at night and sleep during the day.',
        question: 'Use the definition clue in the sentence. What does "nocturnal" mean?',
        highlightPhrase: 'nocturnal',
        spokenText:
          'Owls are nocturnal animals, which means they stay awake at night and sleep during the day.',
        choices: [
          'Active during the night',
          'Able to swim deep underwater',
          'Living only in snowy mountains',
          'Eating only sweet forest berries',
        ],
        correctIndex: 0,
        explanationEn:
          'The signal phrase "which means" gives the exact definition right away: nocturnal animals stay awake at night.',
        explanationZh:
          '看到 which means（意思是……）就是作者藏好的定義線索！nocturnal 指的就是「夜行性的、夜晚活動的」。',
      },
      {
        id: 'en-fig-03-q2',
        emoji: '🌿',
        passage:
          'At the science museum, we saw an ancient fossil—a hardened print of a fern left in rock millions of years ago.',
        question: 'Based on the clue after the dash, what is a "fossil"?',
        highlightPhrase: 'fossil',
        spokenText:
          'At the science museum, we saw an ancient fossil, a hardened print of a fern left in rock millions of years ago.',
        choices: [
          'A shiny brass telescope',
          'A fresh green leaf picked in a park',
          'A hardened trace of an ancient plant or animal in rock',
          'A colorful map of the solar system',
        ],
        correctIndex: 2,
        explanationEn:
          'Authors often put a dash (—) followed by an explanation! Here it directly defines a fossil as a hardened print left in rock long ago.',
        explanationZh:
          '破折號（—）後面常直接解釋前面的生字！這裡直接說明 fossil 是「幾百萬年前留在岩石上的硬印痕（化石）」。',
      },
      {
        id: 'en-fig-03-q3',
        emoji: '🫖',
        passage:
          "Be careful carrying Grandma's porcelain teacup because it is fragile, or very easy to break.",
        question: 'Use the clue after "or." What does "fragile" mean?',
        highlightPhrase: 'fragile',
        spokenText:
          "Be careful carrying Grandma's porcelain teacup because it is fragile, or very easy to break.",
        choices: [
          'Painted with shiny gold stars',
          'Delicate and easily broken',
          'Too hot to hold safely',
          'Made for rough outdoor picnics',
        ],
        correctIndex: 1,
        explanationEn:
          'The word "or" followed by a phrase often restates a tricky word in simpler terms: fragile = very easy to break.',
        explanationZh:
          '逗號加上 or 後面常放同義解釋；fragile, or very easy to break 直接告訴你 fragile 是「脆弱的、易碎的」。',
      },
      {
        id: 'en-fig-03-q4',
        emoji: '🦎',
        passage:
          'A chameleon uses camouflage, a special ability to blend in with its surroundings, to hide from hungry birds.',
        question: 'What does the word "camouflage" mean in this sentence?',
        highlightPhrase: 'camouflage',
        spokenText:
          'A chameleon uses camouflage, a special ability to blend in with its surroundings, to hide from hungry birds.',
        choices: [
          'Climbing up to the tallest branch',
          'Singing a loud warning song',
          'Running faster than every predator',
          'Blending in with the background to stay hidden',
        ],
        correctIndex: 3,
        explanationEn:
          'The phrase tucked between commas defines "camouflage" right in place: blending in with surroundings to stay hidden.',
        explanationZh:
          '夾在兩個逗號之間的補充說明（同位語）直接點破答案：camouflage 就是「偽裝、保護色」，讓變色龍融入周遭環境。',
      },
      {
        id: 'en-fig-03-q5',
        emoji: '🦋',
        passage:
          'Every autumn, monarch butterflies migrate, meaning they travel a long distance from one region to another as the seasons change.',
        question: 'Using the sentence clue, what does "migrate" mean?',
        highlightPhrase: 'migrate',
        spokenText:
          'Every autumn, monarch butterflies migrate, meaning they travel a long distance from one region to another as the seasons change.',
        choices: [
          'Build a tiny twig nest on a porch',
          'Travel far away to a new place with the seasons',
          'Sleep inside a cave all winter long',
          'Change wing colors every afternoon',
        ],
        correctIndex: 1,
        explanationEn:
          'The clue word "meaning" tells you directly that migrate means traveling a long distance to a new region when seasons shift.',
        explanationZh:
          'meaning（意思是）是最明顯的語境線索！migrate 指動物隨季節變化長途「遷徙」。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 2: BUILDING POWER — Metaphors, Personification & Syn/Ant Clues (15 Qs)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'en-fig-04',
    tier: 2,
    category: 'metaphor',
    categoryTag: 'Metaphor',
    title: 'Metaphor Worlds',
    subtitle: 'Discover bold comparisons without "like" or "as"',
    emblemCollectibleId: 'critter-crystal-fox',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    questions: [
      {
        id: 'en-fig-04-q1',
        emoji: '🐝',
        passage:
          'During the art fair setup, our fourth-grade classroom was a busy beehive of painting, folding, and laughing.',
        question: 'What does this metaphor mean about the classroom?',
        highlightPhrase: 'was a busy beehive',
        spokenText:
          'During the art fair setup, our fourth-grade classroom was a busy beehive of painting, folding, and laughing.',
        choices: [
          'Real honeybees flew through the classroom window.',
          'Students were buzzing with lively activity and teamwork.',
          'The classroom was completely silent and empty.',
          'Everyone stopped working to eat honey toast.',
        ],
        correctIndex: 1,
        explanationEn:
          'Calling the classroom a "busy beehive" directly compares the energetic, hard-working students to bustling bees—no "like" or "as" needed!',
        explanationZh:
          '「暗喻／隱喻（Metaphor）」不用 like 或 as，而是直接說 A 就是 B；把教室說成「忙碌的蜂巢」，形容同學們熱鬧又專心忙進忙出。',
      },
      {
        id: 'en-fig-04-q2',
        emoji: '❄️',
        passage:
          'After the blizzard ended overnight, a soft white blanket covered the entire backyard.',
        question: 'In this metaphor, what is the "soft white blanket"?',
        highlightPhrase: 'a soft white blanket',
        spokenText:
          'After the blizzard ended overnight, a soft white blanket covered the entire backyard.',
        choices: [
          'A thick layer of fresh snow',
          'A quilted bedspread left on a lawn chair',
          'A tall pile of folded laundry',
          'A flock of white geese resting on grass',
        ],
        correctIndex: 0,
        explanationEn:
          'The author calls the fallen snow "a soft white blanket" because snow spreads smoothly and snugly across the ground just like a blanket.',
        explanationZh:
          '暴風雪過後覆蓋整個院子的「柔軟白色毛毯」，暗喻的就是厚厚一層剛下的白雪！',
      },
      {
        id: 'en-fig-04-q3',
        emoji: '📚',
        passage:
          'Grandpa always tells me that books are magic carpets that carry your mind to faraway kingdoms.',
        question: 'Why does Grandpa call books "magic carpets"?',
        highlightPhrase: 'books are magic carpets',
        spokenText:
          'Grandpa always tells me that books are magic carpets that carry your mind to faraway kingdoms.',
        choices: [
          'Because books belong flat on the living room rug.',
          'Because books are stitched out of colorful yarn.',
          'Because library buildings can float through clouds.',
          'Because reading takes your imagination to exciting new places.',
        ],
        correctIndex: 3,
        explanationEn:
          'This metaphor says books ARE magic carpets because stories whisk your imagination across time and space without leaving your chair.',
        explanationZh:
          '爺爺把書本比喻成「魔毯」，是因為閱讀能帶著想像力飛往遙遠的奇幻世界。',
      },
      {
        id: 'en-fig-04-q4',
        emoji: '🌪️',
        passage:
          "Remember: a metaphor says one thing IS another unlike thing—without using 'like' or 'as.'",
        question: 'Which sentence below is a METAPHOR (not a simile)?',
        highlightPhrase: "without using 'like' or 'as.'",
        spokenText:
          'Remember: a metaphor says one thing is another unlike thing, without using like or as.',
        choices: [
          'The full moon glowed like a silver coin in the night sky.',
          'Her satin ribbon fluttered as softly as a butterfly wing.',
          'My little puppy is a furry tornado whenever he sees his leash.',
          'The fresh lemonade tasted as sweet as summer peaches.',
        ],
        correctIndex: 2,
        explanationEn:
          '"My little puppy is a furry tornado" directly equates the excited puppy to a tornado without using "like" or "as"—the other three are similes!',
        explanationZh:
          '其他三個選項都用了 like 或 as（都是明喻）；只有「我的小狗是一陣毛茸茸的龍捲風」直接用 is 連接，才是真正的暗喻！',
      },
      {
        id: 'en-fig-04-q5',
        emoji: '☀️',
        passage:
          "Even on rainy Mondays, Sofia's warm smile is a ray of sunshine for everyone at her table.",
        question: 'What does calling Sofia’s smile "a ray of sunshine" tell us?',
        highlightPhrase: 'a ray of sunshine',
        spokenText:
          "Even on rainy Mondays, Sofia's warm smile is a ray of sunshine for everyone at her table.",
        choices: [
          'She always sits directly underneath a bright lamp.',
          'She draws yellow suns on every math worksheet.',
          'She only smiles when the weather forecast is sunny.',
          'Her cheerful smile brightens everyone’s mood.',
        ],
        correctIndex: 3,
        explanationEn:
          'Just as sunshine warms up a gloomy day, Sofia’s friendly smile lifts the spirits of everyone sitting near her.',
        explanationZh:
          '把笑容比喻成「一道陽光」，用來形容她的親切笑容能溫暖大家、掃走雨天的憂鬱心情。',
      },
    ],
  },

  {
    id: 'en-fig-05',
    tier: 2,
    category: 'personification',
    categoryTag: 'Personification',
    title: 'Bringing Nature to Life (Personification)',
    subtitle: 'Spot human actions and feelings given to non-human things',
    emblemCollectibleId: 'critter-moon-owl',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    questions: [
      {
        id: 'en-fig-05-q1',
        emoji: '🍂',
        passage:
          'The golden autumn leaves danced across the playground as the cool October breeze blew by.',
        question: 'What makes "the golden autumn leaves danced" an example of personification?',
        highlightPhrase: 'leaves danced',
        spokenText:
          'The golden autumn leaves danced across the playground as the cool October breeze blew by.',
        choices: [
          'Leaves turn bright yellow and gold in October.',
          'Dancing is a human action given to non-human leaves.',
          'The sentence compares leaves to music with "like."',
          'The playground is surrounded by tall maple trees.',
        ],
        correctIndex: 1,
        explanationEn:
          'Personification gives human traits or actions to non-human things—real leaves cannot dance, so saying they danced brings them to life!',
        explanationZh:
          '「擬人法（Personification）」就是把人的動作或情緒賦予非人類的事物；落葉本身不會跳舞，說它「起舞」就是擬人法！',
      },
      {
        id: 'en-fig-05-q2',
        emoji: '⏰',
        passage:
          'At 6:30 a.m., the grumpy alarm clock shouted at Mia until she finally popped out of bed.',
        question: 'Which human traits are given to the alarm clock?',
        highlightPhrase: 'grumpy alarm clock shouted',
        spokenText:
          'At 6:30 a.m., the grumpy alarm clock shouted at Mia until she finally popped out of bed.',
        choices: [
          'Sitting neatly on a wooden nightstand',
          'Displaying the exact morning hour',
          'Feeling grumpy and shouting out loud',
          'Running on two small silver batteries',
        ],
        correctIndex: 2,
        explanationEn:
          'Alarm clocks cannot actually feel grumpy or shout like a person, so those human traits make the morning wakeup feel funny and vivid.',
        explanationZh:
          '鬧鐘不會真的「脾氣暴躁（grumpy）」或「大吼（shouted）」，賦予它人類的情緒和說話動作，讀起來特別有趣！',
      },
      {
        id: 'en-fig-05-q3',
        emoji: '⛈️',
        passage:
          'Dark storm clouds frowned overhead while distant thunder grumbled behind the hills.',
        question: 'What mood does this personification create in the scene?',
        highlightPhrase: 'clouds frowned',
        spokenText:
          'Dark storm clouds frowned overhead while distant thunder grumbled behind the hills.',
        choices: [
          'A dramatic, tense mood right before a storm arrives',
          'A cheerful, sunny afternoon at the swimming pool',
          'A silly, giggly birthday party mood',
          'A quiet, cozy winter bedtime',
        ],
        correctIndex: 0,
        explanationEn:
          'Words like "frowned" and "grumbled" make the sky seem moody and serious, building suspense right before rain begins.',
        explanationZh:
          '烏雲「皺眉（frowned）」、雷聲「抱怨低吼（grumbled）」，用擬人法營造出暴風雨來臨前緊張又戲劇化的氣氛。',
      },
      {
        id: 'en-fig-05-q4',
        emoji: '🌻',
        passage:
          'The thirsty sunflowers stretched their necks toward the morning rain and drank up every drop.',
        question: 'Why is this sentence an example of personification?',
        highlightPhrase: 'thirsty sunflowers stretched',
        spokenText:
          'The thirsty sunflowers stretched their necks toward the morning rain and drank up every drop.',
        choices: [
          'It lists a gardening rule for planting flower seeds.',
          'It uses a common idiom about summer tools.',
          'It repeats the same starting letter five times.',
          'It describes flowers acting like thirsty people stretching to drink.',
        ],
        correctIndex: 3,
        explanationEn:
          'Sunflowers do not have real necks or drink like people—describing them as thirsty and stretching their necks gives them human-like behavior.',
        explanationZh:
          '向日葵並沒有真的脖子可以伸長喝水；作者把花描寫得像口渴的人一樣仰頭暢飲，正是生動的擬人法。',
      },
      {
        id: 'en-fig-05-q5',
        emoji: '🌲',
        passage:
          'Personification gives human feelings, speech, or actions to non-human things.',
        question: 'Which sentence below uses PERSONIFICATION?',
        highlightPhrase: 'human feelings, speech, or actions',
        spokenText:
          'Personification gives human feelings, speech, or actions to non-human things.',
        choices: [
          'The friendly brown puppy wagged its tail by the front door.',
          'The playful wind whispered secrets through the tall pine trees.',
          'Our wooden sailboat glided smoothly across the blue lake.',
          'Cool raindrops fell steadily onto the kitchen windowsill.',
        ],
        correctIndex: 1,
        explanationEn:
          'Wind cannot really be playful or whisper secrets! A puppy wagging its tail, a boat gliding, and rain falling are all normal literal actions.',
        explanationZh:
          '小狗搖尾巴、帆船滑行、雨滴落下都是真實會發生的動作；只有「頑皮的風低聲說祕密」賦予了風人類的性格和說話行為！',
      },
    ],
  },

  {
    id: 'en-fig-06',
    tier: 2,
    category: 'context-clues',
    categoryTag: 'Context Clues',
    title: 'Context Clues: Synonym & Antonym',
    subtitle: 'Use same-meaning and opposite-meaning clues to crack new words',
    emblemCollectibleId: 'ocean-pearl-clam',
    accentHex: '#0891B2',
    bgHex: '#ECFEFF',
    questions: [
      {
        id: 'en-fig-06-q1',
        emoji: '🐢',
        passage:
          'The newly hatched sea turtle was so diminutive—tiny enough to fit right in the palm of my hand!',
        question: 'Use the synonym clue in the sentence. What does "diminutive" mean?',
        highlightPhrase: 'diminutive',
        spokenText:
          'The newly hatched sea turtle was so diminutive, tiny enough to fit right in the palm of my hand!',
        choices: [
          'Very small or tiny',
          'Extremely fast in ocean waves',
          'Covered in bright green spots',
          'Heavy and difficult to lift',
        ],
        correctIndex: 0,
        explanationEn:
          'The word "tiny" right after the dash is a synonym clue showing that "diminutive" means very small.',
        explanationZh:
          '破折號後面的 tiny（極小的）就是同義詞線索，馬上就能推斷 diminutive 的意思是「非常小巧的」。',
      },
      {
        id: 'en-fig-06-q2',
        emoji: '🎬',
        passage:
          'Unlike her boisterous younger brother who shouted through the whole movie, Claire stayed calm and quiet.',
        question: 'Use the contrast clue "Unlike... calm and quiet." What does "boisterous" mean?',
        highlightPhrase: 'boisterous',
        spokenText:
          'Unlike her boisterous younger brother who shouted through the whole movie, Claire stayed calm and quiet.',
        choices: [
          'Shy and nervous around crowds',
          'Sleepy and ready for an afternoon nap',
          'Noisy and full of loud energy',
          'Careful and polite inside theaters',
        ],
        correctIndex: 2,
        explanationEn:
          '"Unlike" signals an antonym (opposite)! Since Claire was calm and quiet, her boisterous brother was the opposite—noisy and rowdy.',
        explanationZh:
          'Unlike（不像……）是反義詞訊號！姊姊安靜冷靜，弟弟相反又一直大叫，所以 boisterous 就是「喧鬧、精力過剩的」。',
      },
      {
        id: 'en-fig-06-q3',
        emoji: '🏆',
        passage:
          'Everyone cheered when our class won the reading trophy; the room was filled with jubilant, joyful smiles.',
        question: 'Use the synonym clue right next to the word. What does "jubilant" mean?',
        highlightPhrase: 'jubilant',
        spokenText:
          'Everyone cheered when our class won the reading trophy; the room was filled with jubilant, joyful smiles.',
        choices: [
          'Confused and puzzled',
          'Overjoyed and celebrating',
          'Exhausted after a long hike',
          'Curious about a hidden clue',
        ],
        correctIndex: 1,
        explanationEn:
          'Paired right beside "joyful" and "cheered," the synonym clue tells us "jubilant" means thrilled and full of celebration.',
        explanationZh:
          '緊接在旁邊的 joyful（喜悅的）和前面的 cheered（歡呼）都是同義線索，jubilant 就是「歡欣鼓舞、超開心的」。',
      },
      {
        id: 'en-fig-06-q4',
        emoji: '🌵',
        passage:
          'Although the desert trail looked arid and cracked, a hidden spring nearby kept the canyon green and moist.',
        question: 'Use the contrast with "green and moist." What does "arid" mean?',
        highlightPhrase: 'arid',
        spokenText:
          'Although the desert trail looked arid and cracked, a hidden spring nearby kept the canyon green and moist.',
        choices: [
          'Covered in slippery winter ice',
          'Full of blooming wildflowers',
          'Shaded by giant coastal redwoods',
          'Very dry with almost no water',
        ],
        correctIndex: 3,
        explanationEn:
          '"Although" sets up a contrast: while the canyon was moist, the arid desert trail was the opposite—extremely dry.',
        explanationZh:
          'Although（雖然）帶出前後對比：後面是「綠意盎然又濕潤（moist）」，所以前面 arid 就是相反的「極度乾燥的」。',
      },
      {
        id: 'en-fig-06-q5',
        emoji: '⚽',
        passage:
          'Instead of being timid at her new soccer camp, Zoe felt bold and introduced herself to three teammates.',
        question: 'Since "instead of" signals an opposite of "bold," what does "timid" mean?',
        highlightPhrase: 'timid',
        spokenText:
          'Instead of being timid at her new soccer camp, Zoe felt bold and introduced herself to three teammates.',
        choices: [
          'Shy or easily frightened',
          'Super athletic and speedy',
          'Loud and bossy on the field',
          'Excited to kick the winning goal',
        ],
        correctIndex: 0,
        explanationEn:
          '"Instead of" signals an antonym clue. The opposite of feeling bold and outgoing is feeling timid—shy or hesitant.',
        explanationZh:
          'Instead of（不是……而是……）是反義線索！bold 是「勇敢大方的」，它的相反詞 timid 就是「害羞膽怯的」。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 3: LEVELING UP — Hyperbole/Alliteration, Idioms & Inference (15 Qs)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'en-fig-07',
    tier: 3,
    category: 'hyperbole-alliteration',
    categoryTag: 'Hyperbole & Alliteration',
    title: 'Hyperbole & Alliteration Show',
    subtitle: 'Spot wild exaggerations and catchy repeated opening sounds',
    emblemCollectibleId: 'sweet-macaron-unicorn',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    questions: [
      {
        id: 'en-fig-07-q1',
        emoji: '🥞',
        passage:
          "After hiking up the steep canyon trail, Leo groaned, 'I am so hungry I could eat a whole mountain of pancakes!'",
        question: 'Why did Leo use this hyperbole?',
        highlightPhrase: 'eat a whole mountain of pancakes',
        spokenText:
          'After hiking up the steep canyon trail, Leo groaned, I am so hungry I could eat a whole mountain of pancakes!',
        choices: [
          'To prove he can actually climb a real pancake mountain.',
          'To exaggerate wildly and show how very hungry he felt.',
          'To compare pancakes to rocks using the word "like."',
          'To give human feelings to his breakfast plate.',
        ],
        correctIndex: 1,
        explanationEn:
          'Hyperbole is extreme exaggeration that is not meant literally—Leo obviously cannot eat a mountain, so it humorously emphasizes his big appetite.',
        explanationZh:
          '「誇飾法（Hyperbole）」用極度誇張、不可能成真的說法來強調感受；吃下一座鬆餅山只是幽默強調他真的餓壞了！',
      },
      {
        id: 'en-fig-07-q2',
        emoji: '🌋',
        passage:
          'Hyperbole uses wild, impossible exaggeration to add humor or strong emphasis.',
        question: 'Which sentence below is an example of HYPERBOLE?',
        highlightPhrase: 'wild, impossible exaggeration',
        spokenText:
          'Hyperbole uses wild, impossible exaggeration to add humor or strong emphasis.',
        choices: [
          'I waited in the cafeteria lunch line for five minutes today.',
          'The classroom library shelves were neat and freshly dusted.',
          'My science diorama took a million years to finish!',
          'Our tabby cat napped peacefully on the sunny windowsill.',
        ],
        correctIndex: 2,
        explanationEn:
          'No fourth-grade project could literally take a million years! That huge exaggeration makes it clear hyperbole.',
        explanationZh:
          '沒有任何科展作業真的會花上「一百萬年」，這種超級浮誇的強調正是誇飾法（Hyperbole）。',
      },
      {
        id: 'en-fig-07-q3',
        emoji: '🫐',
        passage:
          'Busy bakers blended bright blueberry batter before breakfast.',
        question: 'Which sound device makes this sentence fun and catchy to read aloud?',
        highlightPhrase: 'Busy bakers blended bright blueberry batter',
        spokenText:
          'Busy bakers blended bright blueberry batter before breakfast.',
        choices: [
          'Alliteration—repeating the beginning /b/ consonant sound',
          'Metaphor—saying bakers are sweet blueberries',
          'Personification—making batter talk like a human',
          'Idiom—using a hidden phrase about cooking',
        ],
        correctIndex: 0,
        explanationEn:
          'Alliteration repeats the same starting consonant sound across nearby words—here, every word kicks off with a bouncy /b/ sound!',
        explanationZh:
          '「頭韻（Alliteration）」是指相鄰的多個單字重複相同的開頭子音，像這句連續出現活潑的 /b/ 音，唸起來像繞口令一樣有節奏感！',
      },
      {
        id: 'en-fig-07-q4',
        emoji: '🍪',
        passage:
          'Alliteration repeats the same beginning consonant SOUND across nearby words.',
        question: 'Which bakery sign below uses ALLITERATION?',
        highlightPhrase: 'same beginning consonant SOUND',
        spokenText:
          'Alliteration repeats the same beginning consonant sound across nearby words.',
        choices: [
          'Warm Vanilla Cupcakes Ready Now',
          'Hot Peach Tarts Every Morning',
          'Sweet Lemon Pie Baked Daily',
          'Crispy Caramel Cookies Crumbled Cleanly',
        ],
        correctIndex: 3,
        explanationEn:
          '"Crispy Caramel Cookies Crumbled Cleanly" repeats the hard /k/ opening sound five times in a row—classic alliteration!',
        explanationZh:
          'Crispy、Caramel、Cookies、Crumbled、Cleanly 連續五個字都以 /k/ 音開頭，是最標準又響亮的頭韻！',
      },
      {
        id: 'en-fig-07-q5',
        emoji: '🧸',
        passage:
          "My little sister's backpack weighs at least ten tons when she brings her whole plushie collection!",
        question: 'Which literary device is used in this sentence, and why?',
        highlightPhrase: 'weighs at least ten tons',
        spokenText:
          "My little sister's backpack weighs at least ten tons when she brings her whole plushie collection!",
        choices: [
          'Alliteration, because every word begins with the letter T.',
          'Hyperbole, because a backpack cannot literally weigh ten tons.',
          'Simile, because it compares plushies using "like."',
          'Personification, because the backpack is feeling sleepy.',
        ],
        correctIndex: 1,
        explanationEn:
          'Ten tons is heavier than an elephant! Saying a backpack weighs ten tons is hyperbole to show how packed and heavy it feels.',
        explanationZh:
          '十公噸比一頭大象還重！說書包重達十公噸是不可能的誇張說法，屬於誇飾法（Hyperbole）。',
      },
    ],
  },

  {
    id: 'en-fig-08',
    tier: 3,
    category: 'idiom',
    categoryTag: 'Idiom',
    title: 'School & Nature Idioms',
    subtitle: 'Decode colorful expressions from classrooms and the wild',
    emblemCollectibleId: 'sweet-boba-bear',
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    questions: [
      {
        id: 'en-fig-08-q1',
        emoji: '📖',
        passage:
          'With the big state capitals test coming up tomorrow, Ava decided to hit the books right after snack time.',
        question: 'What does the idiom "hit the books" mean?',
        highlightPhrase: 'hit the books',
        spokenText:
          'With the big state capitals test coming up tomorrow, Ava decided to hit the books right after snack time.',
        choices: [
          'Begin studying seriously and with focus.',
          'Slam her textbooks loudly onto the desk.',
          'Return overdue novels to the school library.',
          'Stack tall hardcover books into a tower.',
        ],
        correctIndex: 0,
        explanationEn:
          '"Hit the books" is a popular school idiom that means to buckle down and study hard—never literally smacking a book!',
        explanationZh:
          'hit the books 不是去打書，而是校園超常用的慣用語，意思是「開始認真K書、專心複習功課」。',
      },
      {
        id: 'en-fig-08-q2',
        emoji: '🌕',
        passage:
          'Our neighborhood bakery only makes strawberry-matcha croissants once in a blue moon, so we rushed over early!',
        question: 'What does "once in a blue moon" mean?',
        highlightPhrase: 'once in a blue moon',
        spokenText:
          'Our neighborhood bakery only makes strawberry-matcha croissants once in a blue moon, so we rushed over early!',
        choices: [
          'Only at midnight when the moon turns bright blue.',
          'Every single morning before school starts.',
          'Very rarely—almost never.',
          'Only during rainy spring afternoons.',
        ],
        correctIndex: 2,
        explanationEn:
          'A "blue moon" happens rarely, so the idiom "once in a blue moon" means something happens very seldom.',
        explanationZh:
          'once in a blue moon 字面是「藍月出現時才一次」，用來形容「千載難逢、極為罕見」。',
      },
      {
        id: 'en-fig-08-q3',
        emoji: '🌳',
        passage:
          'Ben blamed his puppy for eating the missing puzzle piece, but he was barking up the wrong tree—it was stuck under his own shoe!',
        question: 'What does "barking up the wrong tree" mean here?',
        highlightPhrase: 'barking up the wrong tree',
        spokenText:
          'Ben blamed his puppy for eating the missing puzzle piece, but he was barking up the wrong tree; it was stuck under his own shoe!',
        choices: [
          'Climbing the tallest oak tree in the yard.',
          'Looking in the wrong place or blaming the wrong cause.',
          'Teaching a dog a brand-new backyard trick.',
          'Shouting loudly during a forest nature walk.',
        ],
        correctIndex: 1,
        explanationEn:
          'Just like a dog barking at a tree where the squirrel isn’t, "barking up the wrong tree" means pursuing the wrong idea or blaming the wrong suspect.',
        explanationZh:
          'barking up the wrong tree 原指小狗對著沒松鼠的樹亂吠，引申為「找錯方向、冤枉好人、搞錯對象」。',
      },
      {
        id: 'en-fig-08-q4',
        emoji: '🤖',
        passage:
          'Even though our robotics team lost the first two practice rounds, Coach told us to hang in there and keep improving.',
        question: 'What advice is Coach giving with the idiom "hang in there"?',
        highlightPhrase: 'hang in there',
        spokenText:
          'Even though our robotics team lost the first two practice rounds, Coach told us to hang in there and keep improving.',
        choices: [
          'Hang the cardboard robot from the classroom ceiling.',
          'Stop building immediately and join another club.',
          'Wait quietly outside in the hallway until lunch.',
          'Do not give up—stay determined through a tough moment.',
        ],
        correctIndex: 3,
        explanationEn:
          '"Hang in there" is an encouraging idiom meaning "keep going and don’t quit even when things get tricky."',
        explanationZh:
          'hang in there 是溫暖的打氣用語，意思是「撐住、堅持下去，千萬別輕言放棄！」',
      },
      {
        id: 'en-fig-08-q5',
        emoji: '🗺️',
        passage:
          'During the camping mystery game, Maya accidentally let the cat out of the bag about where the treasure map was hidden.',
        question: 'What does "let the cat out of the bag" mean?',
        highlightPhrase: 'let the cat out of the bag',
        spokenText:
          'During the camping mystery game, Maya accidentally let the cat out of the bag about where the treasure map was hidden.',
        choices: [
          'Opened a pet carrier so a sleepy kitten could stretch.',
          'Revealed a secret before it was supposed to be told.',
          'Packed extra cat treats inside her hiking backpack.',
          'Dropped her shiny compass in the tall meadow grass.',
        ],
        correctIndex: 1,
        explanationEn:
          'To "let the cat out of the bag" means to reveal a secret (often by accident), just like "spill the beans"!',
        explanationZh:
          'let the cat out of the bag 跟 spill the beans 很像，意思都是「不小心說漏嘴、把祕密曝光了」。',
      },
    ],
  },

  {
    id: 'en-fig-09',
    tier: 3,
    category: 'context-clues',
    categoryTag: 'Context Clues',
    title: 'Context Clues: Inference Sleuth',
    subtitle: 'Connect cause, effect, and actions to deduce tricky vocabulary',
    emblemCollectibleId: 'ocean-dolphin-scout',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    questions: [
      {
        id: 'en-fig-09-q1',
        emoji: '🚲',
        passage:
          'After biking uphill for three miles in the July sun, Elena collapsed onto the porch steps, completely parched and begging for cold water.',
        question: 'Use the clues in the sentence. What does "parched" mean?',
        highlightPhrase: 'parched',
        spokenText:
          'After biking uphill for three miles in the July sun, Elena collapsed onto the porch steps, completely parched and begging for cold water.',
        choices: [
          'Extremely thirsty',
          'Shivering from chilly winter wind',
          'Excited to pedal even faster',
          'Proud of a freshly washed bicycle',
        ],
        correctIndex: 0,
        explanationEn:
          'Biking uphill in the hot July sun and begging for cold water let you infer that "parched" means very thirsty and dried out.',
        explanationZh:
          '大太陽下騎上坡又急著討冰水喝，從前後情境就能推論出 parched 的意思是「口乾舌燥、渴極了」。',
      },
      {
        id: 'en-fig-09-q2',
        emoji: '⛈️',
        passage:
          'When the stray kitten heard thunder boom outside, it scurried under the sofa and trembled until the storm passed.',
        question: 'Based on how the scared kitten moved, what does "scurried" mean?',
        highlightPhrase: 'scurried',
        spokenText:
          'When the stray kitten heard thunder boom outside, it scurried under the sofa and trembled until the storm passed.',
        choices: [
          'Strolled slowly and proudly across the rug',
          'Fell fast asleep right away',
          'Moved quickly with short, hurried steps',
          'Leaped gracefully onto the dining table',
        ],
        correctIndex: 2,
        explanationEn:
          'A frightened kitten rushing under the sofa to hide from loud thunder helps you infer that "scurried" means ran quickly in tiny, hurried steps.',
        explanationZh:
          '聽到打雷嚇到立刻鑽到沙發下發抖，從小貓害怕的反應可以推論 scurried 是「急促地小步快跑、慌忙竄逃」。',
      },
      {
        id: 'en-fig-09-q3',
        emoji: '🧁',
        passage:
          'Before baking the delicate meringue cookies, Chef Marco gave us meticulous instructions—measuring every quarter-teaspoon and checking the oven every two minutes.',
        question: 'What do the examples in the sentence show "meticulous" means?',
        highlightPhrase: 'meticulous',
        spokenText:
          'Before baking the delicate meringue cookies, Chef Marco gave us meticulous instructions, measuring every quarter-teaspoon and checking the oven every two minutes.',
        choices: [
          'Messy and rushed without a plan',
          'Very careful about every tiny detail',
          'Secretive and unwilling to share recipes',
          'Loud and goofy in the bakery kitchen',
        ],
        correctIndex: 1,
        explanationEn:
          'Measuring every quarter-teaspoon and checking the oven every two minutes are examples of extreme care—showing "meticulous" means paying close attention to tiny details.',
        explanationZh:
          '精準量到四分之一茶匙、每兩分鐘檢查一次烤箱，這些具體例子說明 meticulous 是「一絲不苟、非常講究細節的」。',
      },
      {
        id: 'en-fig-09-q4',
        emoji: '⛴️',
        passage:
          'Because the fog was so dense over the harbor, the ferry captain slowed down and sounded the horn; passengers could barely see ten feet ahead.',
        question: 'Use the cause-and-effect clues. What does "dense" mean here?',
        highlightPhrase: 'dense',
        spokenText:
          'Because the fog was so dense over the harbor, the ferry captain slowed down and sounded the horn; passengers could barely see ten feet ahead.',
        choices: [
          'Brightly colored like a summer rainbow',
          'Warm and breezy at golden sunset',
          'Completely vanished within seconds',
          'So thick that it is hard to see through',
        ],
        correctIndex: 3,
        explanationEn:
          'The ferry slowing down and passengers barely seeing ten feet ahead prove that "dense" fog is thick and heavy.',
        explanationZh:
          '渡輪必須減速鳴笛、乘客幾乎看不清前方十英尺，從因果線索可推斷 dense 在這裡是「濃密的、厚重的」。',
      },
      {
        id: 'en-fig-09-q5',
        emoji: '🎨',
        passage:
          'Even after her watercolor painting smudged twice, Tessa stayed resilient—she took a deep breath, grabbed a fresh sheet, and painted her best sunset yet.',
        question: "From Tessa's actions, what does \"resilient\" mean?",
        highlightPhrase: 'resilient',
        spokenText:
          'Even after her watercolor painting smudged twice, Tessa stayed resilient; she took a deep breath, grabbed a fresh sheet, and painted her best sunset yet.',
        choices: [
          'Able to bounce back quickly after a setback',
          'Quick to lose temper and quit a project',
          'Forgetful about packing watercolor brushes',
          'Afraid to blend bright orange and purple paint',
        ],
        correctIndex: 0,
        explanationEn:
          'Tessa didn’t give up after two smudges; she stayed calm and tried again, showing that "resilient" means recovering strongly from difficulties.',
        explanationZh:
          '畫紙弄髒兩次卻沒放棄，深呼吸後重來還畫出最棒的作品，可見 resilient 的意思是「有韌性的、受挫後能迅速振作的」。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 4: MASTER STORYTELLER — Mixed Lab, Craft & Nuance/Multi-Meaning (15 Qs)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'en-fig-10',
    tier: 4,
    category: 'mixed',
    categoryTag: 'Mixed Mastery',
    title: 'Figurative Language Challenge',
    subtitle: 'Identify and analyze all five figurative devices like a pro',
    emblemCollectibleId: 'critter-sun-phoenix',
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    questions: [
      {
        id: 'en-fig-10-q1',
        emoji: '🪜',
        passage:
          'The old wooden floorboards sighed and complained under our tiptoeing sneakers as we crept downstairs for midnight cocoa.',
        question: 'Which type of figurative language is highlighted in this sentence?',
        highlightPhrase: 'floorboards sighed and complained',
        spokenText:
          'The old wooden floorboards sighed and complained under our tiptoeing sneakers as we crept downstairs for midnight cocoa.',
        choices: ['Simile', 'Personification', 'Hyperbole', 'Idiom'],
        correctIndex: 1,
        explanationEn:
          'Floorboards cannot literally sigh or complain—giving those human actions to creaky wood is personification!',
        explanationZh:
          '木頭地板不會真的「嘆氣（sighed）」和「抱怨（complained）」，把人的反應加在物品上就是擬人法（Personification）。',
      },
      {
        id: 'en-fig-10-q2',
        emoji: '🗼',
        passage:
          'Her kindness was a lighthouse guiding the new fourth-grade student through a confusing first week.',
        question: 'Which figurative device is used here, and what does it show?',
        highlightPhrase: 'kindness was a lighthouse',
        spokenText:
          'Her kindness was a lighthouse guiding the new fourth-grade student through a confusing first week.',
        choices: [
          'Simile—it compares kindness to a sunny beach.',
          'Idiom—it means they took a field trip to the ocean.',
          'Metaphor—it shows her kindness gave steady guidance when someone felt lost.',
          'Hyperbole—it exaggerates how tall the school hallway was.',
        ],
        correctIndex: 2,
        explanationEn:
          'Saying her kindness "was a lighthouse" is a metaphor (no "like" or "as") showing how her warmth safely guided a new classmate.',
        explanationZh:
          '不用 like 或 as，直接說「她的善良是一座燈塔」，是優美的暗喻（Metaphor），表示她的善意為迷茫的新同學指引方向。',
      },
      {
        id: 'en-fig-10-q3',
        emoji: '☄️',
        passage:
          'My puppy raced across the lawn like a furry comet chasing a bright yellow tennis ball.',
        question: 'Identify the figurative language in the highlighted phrase.',
        highlightPhrase: 'like a furry comet',
        spokenText:
          'My puppy raced across the lawn like a furry comet chasing a bright yellow tennis ball.',
        choices: ['Simile', 'Metaphor', 'Idiom', 'Personification'],
        correctIndex: 0,
        explanationEn:
          'Using "like" to compare a zooming puppy to a blazing comet is a classic simile!',
        explanationZh:
          '用 like 把狂奔的小狗比喻成「毛茸茸的彗星」，比較兩種不同事物，正是標準的明喻（Simile）！',
      },
      {
        id: 'en-fig-10-q4',
        emoji: '🧪',
        passage:
          'When our science volcano finally erupted with sparkling pink foam, I laughed so hard I nearly floated up to the ceiling!',
        question: 'Which type of figurative language is the narrator using?',
        highlightPhrase: 'nearly floated up to the ceiling',
        spokenText:
          'When our science volcano finally erupted with sparkling pink foam, I laughed so hard I nearly floated up to the ceiling!',
        choices: ['Alliteration', 'Personification', 'Simile', 'Hyperbole'],
        correctIndex: 3,
        explanationEn:
          'Laughter cannot actually lift you into the air—this playful, impossible exaggeration is hyperbole showing pure joy!',
        explanationZh:
          '笑到「差點飄上天花板」是不可能發生的極度誇張，屬於誇飾法（Hyperbole），生動表現出開懷大笑的程度。',
      },
      {
        id: 'en-fig-10-q5',
        emoji: '💡',
        passage:
          "When both teammates suggested building a solar-powered treehouse for the STEM fair, Aria beamed, 'We are totally on the same wavelength!'",
        question: 'What does the idiom "on the same wavelength" mean?',
        highlightPhrase: 'on the same wavelength',
        spokenText:
          'When both teammates suggested building a solar-powered treehouse for the STEM fair, Aria beamed, We are totally on the same wavelength!',
        choices: [
          'Surfing side by side at a sunny beach',
          'Sharing the same ideas and understanding each other well',
          'Listening to a science show on a pocket radio',
          'Measuring ocean waves with a wooden yardstick',
        ],
        correctIndex: 1,
        explanationEn:
          'Being "on the same wavelength" is an idiom meaning two people think alike and click smoothly as a team.',
        explanationZh:
          'on the same wavelength 字面是「在同一條波長上」，意思是「非常有默契、想法不謀而合、頻率超合拍」。',
      },
    ],
  },

  {
    id: 'en-fig-11',
    tier: 4,
    category: 'mixed',
    categoryTag: "Author's Craft",
    title: 'Vivid Storyteller’s Toolkit',
    subtitle: 'See how great authors choose figurative language for mood and imagery',
    emblemCollectibleId: 'space-comet-whale',
    accentHex: '#9333EA',
    bgHex: '#FAF5FF',
    questions: [
      {
        id: 'en-fig-11-q1',
        emoji: '✨',
        passage:
          "Instead of writing 'The night sky had lots of stars,' Zoe revised her story to: 'Diamonds scattered across a velvet curtain above the campsite.'",
        question: "Why does Zoe's metaphor make her story more vivid?",
        highlightPhrase: 'Diamonds scattered across a velvet curtain',
        spokenText:
          'Instead of writing The night sky had lots of stars, Zoe revised her story to: Diamonds scattered across a velvet curtain above the campsite.',
        choices: [
          'It proves campers discovered real jewels in the forest.',
          'It paints a glittering, rich picture of bright stars against a dark sky.',
          'It explains how astronomers measure faraway galaxies.',
          'It uses silly exaggeration to make the reader giggle.',
        ],
        correctIndex: 1,
        explanationEn:
          'Comparing stars to sparkling diamonds and the dark sky to rich velvet helps the reader vividly "see" and feel the beauty of the night.',
        explanationZh:
          '把星星比喻成鑽石、夜空比喻成絲絨布幕，能讓讀者腦海立刻浮現閃耀又華麗的畫面，比平鋪直敘迷人多了！',
      },
      {
        id: 'en-fig-11-q2',
        emoji: '🌬️',
        passage:
          "Compare these two sentences: (1) 'The cold wind blew hard.' (2) 'The icy winter wind pinched our cheeks and shouted down the chimney.'",
        question: 'How does the personification in Sentence 2 improve the writing?',
        highlightPhrase: 'pinched our cheeks and shouted',
        spokenText:
          'Compare these two sentences: One, The cold wind blew hard. Two, The icy winter wind pinched our cheeks and shouted down the chimney.',
        choices: [
          'It makes the winter wind feel fierce and alive, like an angry person shouting.',
          'It turns the chilly story into a warm beach vacation.',
          'It hides a playful idiom about baking gingerbread.',
          'It shortens the sentence so there are fewer sensory details.',
        ],
        correctIndex: 0,
        explanationEn:
          'Human actions like "pinched" and "shouted" bring the cold wind to life so the reader can almost feel the chill and hear the storm.',
        explanationZh:
          '用「捏紅臉頰（pinched）」和「對著煙囪大吼（shouted）」這些人類動作來擬人化寒風，讓讀者彷彿身歷其境感受到刺骨冷風！',
      },
      {
        id: 'en-fig-11-q3',
        emoji: '🪶',
        passage:
          'A poet wants to show how softly snow is falling in a peaceful winter poem without sounding loud or chaotic.',
        question: 'Which figurative line best matches a PEACEFUL, gentle mood?',
        highlightPhrase: 'softly snow is falling',
        spokenText:
          'A poet wants to show how softly snow is falling in a peaceful winter poem without sounding loud or chaotic.',
        choices: [
          'Snow pounded the rooftop like a marching band of giant drums.',
          'A fierce blizzard roared like an angry monster shaking the oaks.',
          'Silver snowflakes drifted downward like sleepy feathers.',
          'Frozen slush exploded across the noisy city intersection.',
        ],
        correctIndex: 2,
        explanationEn:
          '"Drifted downward like sleepy feathers" pairs soft verbs and delicate imagery to match a calm, peaceful tone—while drums, monsters, and explosions sound loud!',
        explanationZh:
          '要營造寧靜柔和的氣氛，把雪花比喻成「昏昏欲睡的羽毛輕輕飄落」最契合；其他選項的鼓聲、怒吼和爆炸都太吵雜了。',
      },
      {
        id: 'en-fig-11-q4',
        emoji: '⏳',
        passage:
          'Read carefully! One sentence uses FIGURATIVE language, while the other three are completely LITERAL.',
        question: 'Which sentence below uses FIGURATIVE language?',
        highlightPhrase: 'FIGURATIVE language',
        spokenText:
          'Read carefully! One sentence uses figurative language, while the other three are completely literal.',
        choices: [
          'The neighborhood library closes at five o’clock on Thursdays.',
          'My grandmother baked two warm loaves of sourdough bread.',
          'A bright red cardinal perched quietly on the maple branch.',
          'Time slipped through our fingers during the fun afternoon at the fair.',
        ],
        correctIndex: 3,
        explanationEn:
          'You cannot literally hold time in your hand—saying "time slipped through our fingers" is figurative language showing how quickly a fun afternoon flew by.',
        explanationZh:
          '前面三句都是真實字面敘述（Literal）；「時間從指縫間溜走」把無形的時間當成握不住的沙或水，形容快樂時光過得飛快，屬於修辭語言！',
      },
      {
        id: 'en-fig-11-q5',
        emoji: '🌊',
        passage:
          'Silver stars sparkled softly above the sleeping sea.',
        question: 'What effect does the gentle /s/ alliteration create in this poem line?',
        highlightPhrase: 'Silver stars sparkled softly',
        spokenText:
          'Silver stars sparkled softly above the sleeping sea.',
        choices: [
          'A harsh, banging noise like a summer thunderstorm',
          'A calm, hush-like musical rhythm that fits a quiet night',
          'A funny exaggeration about how big the ocean is',
          'A direct comparison between stars and loud fireworks',
        ],
        correctIndex: 1,
        explanationEn:
          'Repeating the soft /s/ sound ("Silver stars sparkled softly... sleeping sea") mimics a gentle whisper or ocean hush, matching the serene night scene.',
        explanationZh:
          '連續柔和的 /s/ 頭韻聽起來就像輕輕的「噓——」或海浪低語，為靜謐的夜晚增添溫柔的音樂節奏感。',
      },
    ],
  },

  {
    id: 'en-fig-12',
    tier: 4,
    category: 'context-clues',
    categoryTag: 'Nuance & Multi-Meaning',
    title: 'Context Clues: Nuance & Multiple Meanings',
    subtitle: 'Pick the exact meaning and shade of feeling from rich context',
    emblemCollectibleId: 'space-nebula-axolotl',
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    questions: [
      {
        id: 'en-fig-12-q1',
        emoji: '🛶',
        passage:
          "Our kayak glided effortlessly downstream because the river's strong current pushed us toward the sandy cove.",
        question: 'The word "current" has multiple meanings. What does it mean in this sentence?',
        highlightPhrase: 'current',
        spokenText:
          "Our kayak glided effortlessly downstream because the river's strong current pushed us toward the sandy cove.",
        choices: [
          'Happening right now in the present time',
          'A steady flow of moving water in a river or ocean',
          'A small dried berry baked into warm scones',
          'A stream of electricity running through a wire',
        ],
        correctIndex: 1,
        explanationEn:
          'Clues like "kayak," "downstream," and "river’s" show that "current" here means the flowing movement of water (not present time or electric current).',
        explanationZh:
          '一詞多義題要看上下文！current 可以指「目前的」或「電流」，但這裡搭配獨木舟、順流與河流，顯然是指「水流」。',
      },
      {
        id: 'en-fig-12-q2',
        emoji: '⛺',
        passage:
          'Before the thunderstorm rolled in, the campers hurried to pitch their blue tent on dry, level ground.',
        question: 'What does "pitch" mean in this camping sentence?',
        highlightPhrase: 'pitch',
        spokenText:
          'Before the thunderstorm rolled in, the campers hurried to pitch their blue tent on dry, level ground.',
        choices: [
          'To set up and fasten a tent',
          'To throw a baseball across home plate',
          'How high or low a musical note sounds',
          'Sticky dark tree sap from a pine trunk',
        ],
        correctIndex: 0,
        explanationEn:
          'Although "pitch" can mean throw a ball or musical tone, the clues "campers," "tent," and "level ground" tell us it means to set up a tent.',
        explanationZh:
          'pitch 在棒球裡是「投球」、在音樂裡是「音高」，但在露營語境搭配 tent（帳篷）時，意思是「搭設（帳篷）」。',
      },
      {
        id: 'en-fig-12-q3',
        emoji: '🧲',
        passage:
          "Maya's science partner was genuinely inquisitive, asking thoughtful questions about how magnets pull paper clips through cardboard.",
        question: 'Based on the positive tone and clues, what does "inquisitive" mean here?',
        highlightPhrase: 'inquisitive',
        spokenText:
          "Maya's science partner was genuinely inquisitive, asking thoughtful questions about how magnets pull paper clips through cardboard.",
        choices: [
          'Rude and peeking into private diaries',
          'Bored and wishing science class would end early',
          'Eager to learn and ask thoughtful questions',
          'Confused and unable to follow lab steps',
        ],
        correctIndex: 2,
        explanationEn:
          '"Thoughtful questions" gives a positive shade of meaning: unlike "nosy," "inquisitive" describes a curious learner eager to discover how things work.',
        explanationZh:
          '這題考語氣細微差別（Nuance）：搭配「有深度的好問題」，inquisitive 帶有正面涵義，指「求知慾強、愛發問探索的」（而不是愛管閒事的 nosy）。',
      },
      {
        id: 'en-fig-12-q4',
        emoji: '🧭',
        passage:
          "Using the map's printed scale in the bottom corner, Noah figured out that one inch stood for fifty miles of mountain trail.",
        question: 'Which meaning of "scale" fits this sentence?',
        highlightPhrase: 'scale',
        spokenText:
          "Using the map's printed scale in the bottom corner, Noah figured out that one inch stood for fifty miles of mountain trail.",
        choices: [
          'A shiny flat plate covering a fish’s skin',
          'To climb straight up a steep rocky cliff',
          'A machine that weighs fresh orchard apples',
          'A guide showing how map distances match real distances',
        ],
        correctIndex: 3,
        explanationEn:
          'Because Noah compared "one inch" on the map to "fifty miles" of real trail, "scale" clearly refers to a map’s distance guide.',
        explanationZh:
          'scale 有魚鱗、攀爬、體重計等多種意思；但這句提到地圖角落「一英寸代表五十英里」，指的就是地圖上的「比例尺」。',
      },
      {
        id: 'en-fig-12-q5',
        emoji: '🏊',
        passage:
          'At first, Chloe was reluctant to dive off the high board, gripping the silver railing and peeking nervously down at the sparkling pool.',
        question: "Use the clues about Chloe's actions. What does \"reluctant\" mean?",
        highlightPhrase: 'reluctant',
        spokenText:
          'At first, Chloe was reluctant to dive off the high board, gripping the silver railing and peeking nervously down at the sparkling pool.',
        choices: [
          'Eager and racing to jump in first',
          'Hesitant and unwilling to do something right away',
          'Thrilled to show off a brand-new flip',
          'Careless about following pool safety signs',
        ],
        correctIndex: 1,
        explanationEn:
          'Gripping the railing and peeking nervously show that Chloe felt hesitant—so "reluctant" means holding back and not eager to jump yet.',
        explanationZh:
          '緊抓欄杆又緊張地往下偷看，細膩的動作線索告訴我們 reluctant 的意思是「猶豫不決、不太情願立刻行動的」。',
      },
    ],
  },
];

export function getFigurativeSetsByTier(tier: DifficultyTier): FigurativeQuestSet[] {
  return BUILTIN_FIGURATIVE_SETS.filter((set) => set.tier === tier);
}

import type { DifficultyTier } from '../../core/types';
import type { GrammarRepairSet } from './rootsGrammarTypes';

export const ENGLISH_GRAMMAR_SETS: GrammarRepairSet[] = [
  // ═══════════ TIER 1: FOUNDATIONAL MECHANICS (3 sets · 15 questions) ═══════════
  {
    id: 'en-gram-t1-1',
    tier: 1,
    categoryTag: 'Homophones',
    title: 'Homophone Heroes 1',
    subtitle: "Master their / there / they're and to / too / two",
    emblemCollectibleId: 'dino-baby-tricera',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    questions: [
      {
        id: 'en-gq-1',
        emoji: '🎨',
        promptSentence:
          'The fourth-graders proudly hung ___ watercolor paintings in the hallway.',
        spokenFullSentence:
          'The fourth-graders proudly hung their watercolor paintings in the hallway.',
        targetAnswer: 'their',
        choices: ['their', 'there', "they're", 'theirs'],
        correctIndex: 0,
        ruleTip:
          "Use 'their' to show ownership—like 'their paintings' or 'their backpacks.'",
      },
      {
        id: 'en-gq-2',
        emoji: '🌧️',
        promptSentence:
          'Grab your raincoats because ___ expecting heavy showers this afternoon.',
        spokenFullSentence:
          "Grab your raincoats because they're expecting heavy showers this afternoon.",
        targetAnswer: "they're",
        choices: ['their', 'there', "they're", 'theirs'],
        correctIndex: 2,
        ruleTip:
          "'They're' is short for 'they are'—swap in 'they are' to test if it fits!",
      },
      {
        id: 'en-gq-3',
        emoji: '🧁',
        promptSentence:
          'Set the tray of fresh cupcakes over ___ by the lemonade pitcher.',
        spokenFullSentence:
          'Set the tray of fresh cupcakes over there by the lemonade pitcher.',
        targetAnswer: 'there',
        choices: ['their', 'there', "they're", 'they'],
        correctIndex: 1,
        ruleTip:
          "'There' has 'here' hiding inside it—use it to point to a place!",
      },
      {
        id: 'en-gq-4',
        emoji: '🦕',
        promptSentence:
          'My little brother packed way ___ many plush dinosaurs for our weekend trip.',
        spokenFullSentence:
          'My little brother packed way too many plush dinosaurs for our weekend trip.',
        targetAnswer: 'too',
        choices: ['to', 'two', 'tow', 'too'],
        correctIndex: 3,
        ruleTip:
          "'Too' has an extra 'o'—use it for 'also' or 'more than enough'!",
      },
      {
        id: 'en-gq-5',
        emoji: '🍩',
        promptSentence:
          'The baker placed ___ chocolate-frosted donuts inside each pink box.',
        spokenFullSentence:
          'The baker placed two chocolate-frosted donuts inside each pink box.',
        targetAnswer: 'two',
        choices: ['two', 'to', 'too', 'tow'],
        correctIndex: 0,
        ruleTip:
          "'Two' is always the number 2, just like 'twin' and 'twelve' start with 'tw'!",
      },
    ],
  },
  {
    id: 'en-gram-t1-2',
    tier: 1,
    categoryTag: 'Subject-Verb',
    title: 'Verb Match-Up',
    subtitle: 'Match verbs with singular, plural, and compound subjects',
    emblemCollectibleId: 'dino-leaf-stego',
    accentHex: '#16A34A',
    bgHex: '#F0FDF4',
    questions: [
      {
        id: 'en-gq-6',
        emoji: '🍓',
        promptSentence:
          'The basket of juicy strawberries ___ on the kitchen counter.',
        spokenFullSentence:
          'The basket of juicy strawberries sits on the kitchen counter.',
        targetAnswer: 'sits',
        choices: ['sit', 'sits', 'sitting', 'are sitting'],
        correctIndex: 1,
        ruleTip:
          "Ignore 'of...' phrases—the singular subject 'basket' needs the -s verb 'sits.'",
      },
      {
        id: 'en-gq-7',
        emoji: '🤖',
        promptSentence:
          'Chloe and her cousin ___ robotics club every Thursday afternoon.',
        spokenFullSentence:
          'Chloe and her cousin attend robotics club every Thursday afternoon.',
        targetAnswer: 'attend',
        choices: ['attend', 'attends', 'attending', 'is attending'],
        correctIndex: 0,
        ruleTip:
          "Two subjects joined by 'and' make a plural team—drop the -s on the verb!",
      },
      {
        id: 'en-gq-8',
        emoji: '🐶',
        promptSentence:
          'Each puppy at the shelter ___ a cozy blanket and a squeaky toy.',
        spokenFullSentence:
          'Each puppy at the shelter gets a cozy blanket and a squeaky toy.',
        targetAnswer: 'gets',
        choices: ['get', 'getting', 'are getting', 'gets'],
        correctIndex: 3,
        ruleTip:
          "'Each' and 'every' are always singular, so pair them with an -s verb!",
      },
      {
        id: 'en-gq-9',
        emoji: '🏮',
        promptSentence:
          'The bright paper lanterns ___ glowing softly above the night market.',
        spokenFullSentence:
          'The bright paper lanterns are glowing softly above the night market.',
        targetAnswer: 'are',
        choices: ['is', 'was', 'are', 'be'],
        correctIndex: 2,
        ruleTip:
          "Plural subjects like 'lanterns' match plural helping verbs like 'are.'",
      },
      {
        id: 'en-gq-10',
        emoji: '🦦',
        promptSentence:
          'A curious sea otter ___ shiny pebbles inside its furry pocket.',
        spokenFullSentence:
          'A curious sea otter keeps shiny pebbles inside its furry pocket.',
        targetAnswer: 'keeps',
        choices: ['keep', 'keeps', 'keeping', 'were keeping'],
        correctIndex: 1,
        ruleTip:
          "One singular animal ('otter') pairs with a verb ending in -s ('keeps').",
      },
    ],
  },
  {
    id: 'en-gram-t1-3',
    tier: 1,
    categoryTag: 'Irregular Verbs',
    title: 'Past Tense Time Machine 1',
    subtitle: 'Use high-frequency irregular past-tense verbs accurately',
    emblemCollectibleId: 'dino-amber-raptor',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    questions: [
      {
        id: 'en-gq-11',
        emoji: '🏛️',
        promptSentence:
          'Last Saturday, our whole family ___ to the science museum downtown.',
        spokenFullSentence:
          'Last Saturday, our whole family went to the science museum downtown.',
        targetAnswer: 'went',
        choices: ['goed', 'gone', 'went', 'going'],
        correctIndex: 2,
        ruleTip:
          "'Go' changes completely to 'went' in simple past—never say 'goed'!",
      },
      {
        id: 'en-gq-12',
        emoji: '🍪',
        promptSentence:
          'Grandma ___ warm almond cookies to our school bake sale yesterday.',
        spokenFullSentence:
          'Grandma brought warm almond cookies to our school bake sale yesterday.',
        targetAnswer: 'brought',
        choices: ['bringed', 'brang', 'brung', 'brought'],
        correctIndex: 3,
        ruleTip:
          "The past tense of 'bring' is 'brought'—rhymes with 'thought'!",
      },
      {
        id: 'en-gq-13',
        emoji: '⚾',
        promptSentence:
          'Our outfielder leaped high and ___ the pop fly right before the fence.',
        spokenFullSentence:
          'Our outfielder leaped high and caught the pop fly right before the fence.',
        targetAnswer: 'caught',
        choices: ['caught', 'catched', 'catch', 'catching'],
        correctIndex: 0,
        ruleTip:
          "'Catch' turns into 'caught' in the past—never add -ed to make 'catched.'",
      },
      {
        id: 'en-gq-14',
        emoji: '⚽',
        promptSentence:
          'Coach Rivera ___ us a clever passing drill during soccer practice yesterday.',
        spokenFullSentence:
          'Coach Rivera taught us a clever passing drill during soccer practice yesterday.',
        targetAnswer: 'taught',
        choices: ['teached', 'taught', 'teach', 'teaching'],
        correctIndex: 1,
        ruleTip:
          "The past tense of 'teach' is 'taught'—remember 'caught' and 'taught' match!",
      },
      {
        id: 'en-gq-15',
        emoji: '🦢',
        promptSentence:
          'A flock of wild geese ___ southward across the golden autumn sky.',
        spokenFullSentence:
          'A flock of wild geese flew southward across the golden autumn sky.',
        targetAnswer: 'flew',
        choices: ['flied', 'flown', 'flew', 'flying'],
        correctIndex: 2,
        ruleTip:
          "'Fly' becomes 'flew' in simple past; save 'flown' for 'has,' 'have,' or 'had.'",
      },
    ],
  },

  // ═══════════ TIER 2: CORE GRADE 4 USAGE (3 sets · 15 questions) ═══════════
  {
    id: 'en-gram-t2-1',
    tier: 2,
    categoryTag: 'Homophones',
    title: 'Homophone Heroes 2',
    subtitle: "Untangle its/it's, your/you're, whose/who's, and hear/here",
    emblemCollectibleId: 'dino-fossil-rex',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    questions: [
      {
        id: 'en-gq-16',
        emoji: '🦔',
        promptSentence:
          'The sleepy hedgehog curled into a tight ball and tucked ___ nose away.',
        spokenFullSentence:
          'The sleepy hedgehog curled into a tight ball and tucked its nose away.',
        targetAnswer: 'its',
        choices: ["it's", "its'", 'is', 'its'],
        correctIndex: 3,
        ruleTip:
          "Possessive 'its' NEVER takes an apostrophe—use 'it's' only for 'it is' or 'it has.'",
      },
      {
        id: 'en-gq-17',
        emoji: '❄️',
        promptSentence:
          'Check the weather chart before recess because ___ supposed to snow!',
        spokenFullSentence:
          "Check the weather chart before recess because it's supposed to snow!",
        targetAnswer: "it's",
        choices: ['its', "it's", "its'", 'it'],
        correctIndex: 1,
        ruleTip:
          "Swap in 'it is'—if the sentence still makes sense, choose 'it's'!",
      },
      {
        id: 'en-gq-18',
        emoji: '🎸',
        promptSentence:
          'Let me know when ___ ready to rehearse our ukulele duet.',
        spokenFullSentence:
          "Let me know when you're ready to rehearse our ukulele duet.",
        targetAnswer: "you're",
        choices: ["you're", 'your', 'yours', 'yore'],
        correctIndex: 0,
        ruleTip:
          "'You're' means 'you are,' while 'your' shows ownership like 'your book.'",
      },
      {
        id: 'en-gq-19',
        emoji: '📚',
        promptSentence:
          'The librarian asked ___ turquoise water bottle was left beside the printer.',
        spokenFullSentence:
          'The librarian asked whose turquoise water bottle was left beside the printer.',
        targetAnswer: 'whose',
        choices: ["who's", 'who', 'whose', 'whom'],
        correctIndex: 2,
        ruleTip:
          "Use 'whose' to ask who owns something; 'who's' means 'who is' or 'who has'!",
      },
      {
        id: 'en-gq-20',
        emoji: '🐸',
        promptSentence:
          'Stand quietly near the pond and you can ___ bullfrogs croaking at dusk.',
        spokenFullSentence:
          'Stand quietly near the pond and you can hear bullfrogs croaking at dusk.',
        targetAnswer: 'hear',
        choices: ['here', 'hare', 'heir', 'hear'],
        correctIndex: 3,
        ruleTip:
          "'Hear' has the word 'ear' right inside it—you hear with your ear!",
      },
    ],
  },
  {
    id: 'en-gram-t2-2',
    tier: 2,
    categoryTag: 'Modifiers',
    title: 'Comparatives & Superlatives',
    subtitle: 'Compare two or more things with crisp modifiers',
    emblemCollectibleId: 'dino-cloud-ptero',
    accentHex: '#0891B2',
    bgHex: '#ECFEFF',
    questions: [
      {
        id: 'en-gq-21',
        emoji: '🦢',
        promptSentence:
          "Between the two origami cranes, Ethan's paper crane looks much ___.",
        spokenFullSentence:
          "Between the two origami cranes, Ethan's paper crane looks much better.",
        targetAnswer: 'better',
        choices: ['better', 'more better', 'gooder', 'best'],
        correctIndex: 0,
        ruleTip:
          "Comparing TWO things uses 'better'—never say 'gooder' or 'more better'!",
      },
      {
        id: 'en-gq-22',
        emoji: '🧊',
        promptSentence:
          "Of all the storms this winter, Tuesday's ice storm was the ___.",
        spokenFullSentence:
          "Of all the storms this winter, Tuesday's ice storm was the worst.",
        targetAnswer: 'worst',
        choices: ['worse', 'baddest', 'worst', 'most worst'],
        correctIndex: 2,
        ruleTip:
          "Use 'worst' with 'the' for 3 or more items; 'worse' is for just 2!",
      },
      {
        id: 'en-gq-23',
        emoji: '🐠',
        promptSentence:
          'The coral reef display is ___ than the desert exhibit next door.',
        spokenFullSentence:
          'The coral reef display is more colorful than the desert exhibit next door.',
        targetAnswer: 'more colorful',
        choices: [
          'colorfuller',
          'most colorful',
          'more colorfuller',
          'more colorful',
        ],
        correctIndex: 3,
        ruleTip:
          "Long adjectives (3+ syllables) use 'more' before them—never add '-er'!",
      },
      {
        id: 'en-gq-24',
        emoji: '🌲',
        promptSentence:
          'That giant redwood is the ___ tree in the entire national park.',
        spokenFullSentence:
          'That giant redwood is the tallest tree in the entire national park.',
        targetAnswer: 'tallest',
        choices: ['most tallest', 'tallest', 'taller', 'more tall'],
        correctIndex: 1,
        ruleTip:
          "Short adjectives add '-est' for superlatives—never double up with 'most'!",
      },
      {
        id: 'en-gq-25',
        emoji: '🖌️',
        promptSentence:
          'After spilling paint once, Priya carried the palette ___ than before.',
        spokenFullSentence:
          'After spilling paint once, Priya carried the palette more carefully than before.',
        targetAnswer: 'more carefully',
        choices: [
          'more carefully',
          'carefuller',
          'more careful',
          'most carefully',
        ],
        correctIndex: 0,
        ruleTip:
          "Adverbs ending in '-ly' use 'more' to compare actions—like 'more carefully.'",
      },
    ],
  },
  {
    id: 'en-gram-t2-3',
    tier: 2,
    categoryTag: 'Pronouns',
    title: 'Pronoun Check-Up',
    subtitle: 'Choose the right subject, object, and reflexive pronouns',
    emblemCollectibleId: 'dino-crystal-ankylo',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    questions: [
      {
        id: 'en-gq-26',
        emoji: '🌋',
        promptSentence:
          '___ built a cardboard volcano that actually fizzed with baking soda.',
        spokenFullSentence:
          'Maya and I built a cardboard volcano that actually fizzed with baking soda.',
        targetAnswer: 'Maya and I',
        choices: ['Maya and me', 'Maya and I', 'Me and Maya', 'Maya and myself'],
        correctIndex: 1,
        ruleTip:
          "Drop the other person to test: 'I built it' sounds right, not 'Me built it'!",
      },
      {
        id: 'en-gq-27',
        emoji: '🪐',
        promptSentence:
          'Uncle Leo bought front-row planetarium tickets for ___.',
        spokenFullSentence:
          'Uncle Leo bought front-row planetarium tickets for Maya and me.',
        targetAnswer: 'Maya and me',
        choices: ['Maya and I', 'I and Maya', 'Maya and myself', 'Maya and me'],
        correctIndex: 3,
        ruleTip:
          "Test without the other name: 'tickets for me' works, so pick 'Maya and me'!",
      },
      {
        id: 'en-gq-28',
        emoji: '🦉',
        promptSentence:
          'The park ranger showed ___ how to spot owl pellets along the trail.',
        spokenFullSentence:
          'The park ranger showed us how to spot owl pellets along the trail.',
        targetAnswer: 'us',
        choices: ['we', 'ours', 'us', 'ourselves'],
        correctIndex: 2,
        ruleTip:
          "Use object pronoun 'us' after an action verb—save 'we' for the subject!",
      },
      {
        id: 'en-gq-29',
        emoji: '⛺',
        promptSentence:
          'The young campers pitched the bright green tent all by ___.',
        spokenFullSentence:
          'The young campers pitched the bright green tent all by themselves.',
        targetAnswer: 'themselves',
        choices: ['themselves', 'theirselves', 'themself', 'them'],
        correctIndex: 0,
        ruleTip:
          "Standard English uses 'themselves'—'theirselves' is never a standard word!",
      },
      {
        id: 'en-gq-30',
        emoji: '🎭',
        promptSentence:
          'Mr. Chen handed the glowing stage lanterns to Noah and ___.',
        spokenFullSentence:
          'Mr. Chen handed the glowing stage lanterns to Noah and her.',
        targetAnswer: 'her',
        choices: ['she', 'her', 'hers', 'herself'],
        correctIndex: 1,
        ruleTip:
          "After 'to,' use an object pronoun: 'to her' fits, never 'to she'!",
      },
    ],
  },

  // ═══════════ TIER 3: GRADE 4 MASTERY (3 sets · 15 questions) ═══════════
  {
    id: 'en-gram-t3-1',
    tier: 3,
    categoryTag: 'Dialogue',
    title: 'Quotation & Dialogue Clinic',
    subtitle: 'Place commas and quotation marks accurately in dialogue',
    emblemCollectibleId: 'dino-volcanic-rex',
    accentHex: '#DC2626',
    bgHex: '#FEF2F2',
    questions: [
      {
        id: 'en-gq-31',
        emoji: '🐦',
        promptSentence: 'Pointing toward the oak tree, ___',
        spokenFullSentence:
          'Pointing toward the oak tree, Nora asked, "Can you spot the nest?"',
        targetAnswer: 'Nora asked, "Can you spot the nest?"',
        choices: [
          'Nora asked "Can you spot the nest?"',
          'Nora asked, "can you spot the nest?"',
          'Nora asked, "Can you spot the nest?"',
          'Nora asked, Can you spot the nest?',
        ],
        correctIndex: 2,
        ruleTip:
          'Put a comma before the opening quote and capitalize the first spoken word!',
      },
      {
        id: 'en-gq-32',
        emoji: '🏆',
        promptSentence:
          '___ announced Coach Kim after the final whistle.',
        spokenFullSentence:
          '"You played as a true team," announced Coach Kim after the final whistle.',
        targetAnswer: '"You played as a true team,"',
        choices: [
          '"You played as a true team,"',
          '"You played as a true team",',
          '"You played as a true team."',
          '"You played as a true team"',
        ],
        correctIndex: 0,
        ruleTip:
          'In US English, put the comma INSIDE the closing quotation mark before a tag!',
      },
      {
        id: 'en-gq-33',
        emoji: '🃏',
        promptSentence:
          '___ asked Liam as he shuffled the game cards.',
        spokenFullSentence:
          '"Who wants to go first?" asked Liam as he shuffled the game cards.',
        targetAnswer: '"Who wants to go first?"',
        choices: [
          '"Who wants to go first?",',
          '"Who wants to go first?"',
          '"Who wants to go first"?',
          '"Who wants to go first,"',
        ],
        correctIndex: 1,
        ruleTip:
          'Keep the question mark inside the quotes—and never add an extra comma!',
      },
      {
        id: 'en-gq-34',
        emoji: '🚀',
        promptSentence:
          '___ cheered Sofia when the rocket launched skyward.',
        spokenFullSentence:
          '"Our model actually lifted off!" cheered Sofia when the rocket launched skyward.',
        targetAnswer: '"Our model actually lifted off!"',
        choices: [
          '"Our model actually lifted off"!',
          '"Our model actually lifted off!",',
          'Our model actually lifted off!,',
          '"Our model actually lifted off!"',
        ],
        correctIndex: 3,
        ruleTip:
          'Put the exclamation mark inside the closing quote with no extra comma!',
      },
      {
        id: 'en-gq-35',
        emoji: '🎻',
        promptSentence:
          '"Before the bell rings," ___ "please stack your violins neatly."',
        spokenFullSentence:
          '"Before the bell rings," said Ms. Brooks, "please stack your violins neatly."',
        targetAnswer: 'said Ms. Brooks,',
        choices: [
          'said Ms. Brooks',
          'said Ms. Brooks.',
          'said Ms. Brooks,',
          'Said Ms. Brooks,',
        ],
        correctIndex: 2,
        ruleTip:
          'When a tag splits one sentence, lowercase the tag and end it with a comma!',
      },
    ],
  },
  {
    id: 'en-gram-t3-2',
    tier: 3,
    categoryTag: 'Irregular Verbs',
    title: 'Irregular Verb Workshop 2',
    subtitle: 'Master tricky past-tense and past-participle verb forms',
    emblemCollectibleId: 'dino-chroma-bronto',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    questions: [
      {
        id: 'en-gq-36',
        emoji: '✏️',
        promptSentence:
          'During art class, Tessa ___ a detailed map of a floating treehouse.',
        spokenFullSentence:
          'During art class, Tessa drew a detailed map of a floating treehouse.',
        targetAnswer: 'drew',
        choices: ['drawed', 'drawn', 'draw', 'drew'],
        correctIndex: 3,
        ruleTip:
          "'Draw' becomes 'drew' in simple past; use 'drawn' with helping verbs like 'has,' 'have,' or 'had.'",
      },
      {
        id: 'en-gq-37',
        emoji: '🐢',
        promptSentence:
          'Our class ___ the sea turtle as our Earth Day mascot last Friday.',
        spokenFullSentence:
          'Our class chose the sea turtle as our Earth Day mascot last Friday.',
        targetAnswer: 'chose',
        choices: ['choosed', 'chose', 'chosen', 'choose'],
        correctIndex: 1,
        ruleTip:
          "Drop one 'o' for simple past: today we 'choose,' yesterday we 'chose'!",
      },
      {
        id: 'en-gq-38',
        emoji: '🐬',
        promptSentence:
          'Three silver dolphins ___ gracefully alongside the ferry boat.',
        spokenFullSentence:
          'Three silver dolphins swam gracefully alongside the ferry boat.',
        targetAnswer: 'swam',
        choices: ['swimmed', 'swum', 'swam', 'swimming'],
        correctIndex: 2,
        ruleTip:
          "Simple past is 'swam'—save 'swum' for helping verbs like 'have swum'!",
      },
      {
        id: 'en-gq-39',
        emoji: '📖',
        promptSentence:
          'Jaden has already ___ three hilarious chapters of his comic book.',
        spokenFullSentence:
          'Jaden has already written three hilarious chapters of his comic book.',
        targetAnswer: 'written',
        choices: ['written', 'wrote', 'writed', 'writing'],
        correctIndex: 0,
        ruleTip:
          "Pair helping verbs ('has,' 'have,' 'had') with 'written,' never 'wrote'!",
      },
      {
        id: 'en-gq-40',
        emoji: '🐿️',
        promptSentence:
          'By lunchtime, the hungry squirrels had ___ every single sunflower seed.',
        spokenFullSentence:
          'By lunchtime, the hungry squirrels had eaten every single sunflower seed.',
        targetAnswer: 'eaten',
        choices: ['ate', 'eated', 'eat', 'eaten'],
        correctIndex: 3,
        ruleTip:
          "Use 'ate' by itself, and use 'eaten' after 'has,' 'have,' or 'had'!",
      },
    ],
  },
  {
    id: 'en-gram-t3-3',
    tier: 3,
    categoryTag: 'Conjunctions',
    title: 'Conjunctions & Compound Sentences',
    subtitle: 'Join ideas smoothly with FANBOYS and subordinating conjunctions',
    emblemCollectibleId: 'magic-quill-sprite',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    questions: [
      {
        id: 'en-gq-41',
        emoji: '🎹',
        promptSentence:
          'Maya practiced the piano all ___ she still felt butterflies onstage.',
        spokenFullSentence:
          'Maya practiced the piano all week, but she still felt butterflies onstage.',
        targetAnswer: 'week, but',
        choices: ['week, but', 'week but', 'week, so', 'week; but'],
        correctIndex: 0,
        ruleTip:
          "Put a comma before 'but' when joining two complete sentences with contrast!",
      },
      {
        id: 'en-gq-42',
        emoji: '🌉',
        promptSentence:
          'The wooden bridge was slippery after the ___ we took the paved footpath.',
        spokenFullSentence:
          'The wooden bridge was slippery after the rain, so we took the paved footpath.',
        targetAnswer: 'rain, so',
        choices: ['rain so', 'rain, but', 'rain, so', 'rain, or'],
        correctIndex: 2,
        ruleTip:
          "Use a comma + 'so' to connect a cause to its result between two sentences!",
      },
      {
        id: 'en-gq-43',
        emoji: '🧇',
        promptSentence:
          'Leo mixed the blueberry ___ his sister preheated the waffle iron.',
        spokenFullSentence:
          'Leo mixed the blueberry batter, and his sister preheated the waffle iron.',
        targetAnswer: 'batter, and',
        choices: ['batter and', 'batter, and', 'batter, yet', 'batter, or'],
        correctIndex: 1,
        ruleTip:
          "When 'and' joins two full sentences with their own subjects, add a comma!",
      },
      {
        id: 'en-gq-44',
        emoji: '⛈️',
        promptSentence:
          'We moved the picnic under the gazebo ___ dark storm clouds rolled in.',
        spokenFullSentence:
          'We moved the picnic under the gazebo because dark storm clouds rolled in.',
        targetAnswer: 'because',
        choices: ['but', 'so', 'although', 'because'],
        correctIndex: 3,
        ruleTip:
          "Use 'because' to introduce the reason why something happened!",
      },
      {
        id: 'en-gq-45',
        emoji: '🥾',
        promptSentence:
          '___ the hike was steep and muddy, the waterfall view made it worth it.',
        spokenFullSentence:
          'Although the hike was steep and muddy, the waterfall view made it worth it.',
        targetAnswer: 'Although',
        choices: ['Although', 'Because', 'And', 'So'],
        correctIndex: 0,
        ruleTip:
          "Start with 'Although' to show a surprising contrast—then add a comma!",
      },
    ],
  },

  // ═══════════ TIER 4: GRADE 5 BRIDGE & POLISH (3 sets · 15 questions) ═══════════
  {
    id: 'en-gram-t4-1',
    tier: 4,
    categoryTag: 'Word Choice',
    title: 'Tricky Confusables',
    subtitle: 'Conquer affect/effect, accept/except, loose/lose, then/than, fewer/less',
    emblemCollectibleId: 'magic-teacup-potion',
    accentHex: '#9333EA',
    bgHex: '#FAF5FF',
    questions: [
      {
        id: 'en-gq-46',
        emoji: '🌸',
        promptSentence:
          'Heavy frost overnight can ___ the tender buds on our cherry tree.',
        spokenFullSentence:
          'Heavy frost overnight can affect the tender buds on our cherry tree.',
        targetAnswer: 'affect',
        choices: ['effect', 'affect', 'effects', 'affects'],
        correctIndex: 1,
        ruleTip:
          'RAVEN trick: Remember Affect = Verb (action), Effect = Noun (result)!',
      },
      {
        id: 'en-gq-47',
        emoji: '🪐',
        promptSentence:
          'Every planet in our quiz game was easy to name ___ Neptune.',
        spokenFullSentence:
          'Every planet in our quiz game was easy to name except Neptune.',
        targetAnswer: 'except',
        choices: ['except', 'accept', 'expect', 'access'],
        correctIndex: 0,
        ruleTip:
          "'Except' starts with 'ex-' for 'exclude'; 'accept' means to welcome or take!",
      },
      {
        id: 'en-gq-48',
        emoji: '🧭',
        promptSentence:
          'Zip your backpack pocket tightly so you do not ___ your brass compass.',
        spokenFullSentence:
          'Zip your backpack pocket tightly so you do not lose your brass compass.',
        targetAnswer: 'lose',
        choices: ['loose', 'loss', 'lost', 'lose'],
        correctIndex: 3,
        ruleTip:
          "'Lose' lost an 'o' (verb: misplace); 'loose' has two 'o's like a roomy shoe!",
      },
      {
        id: 'en-gq-49',
        emoji: '🐆',
        promptSentence:
          'A cheetah can sprint much faster ___ any other land mammal on Earth.',
        spokenFullSentence:
          'A cheetah can sprint much faster than any other land mammal on Earth.',
        targetAnswer: 'than',
        choices: ['then', 'that', 'than', 'when'],
        correctIndex: 2,
        ruleTip:
          "Use 'than' with an 'a' to compAre; use 'then' with an 'e' for timE!",
      },
      {
        id: 'en-gq-50',
        emoji: '🌲',
        promptSentence:
          'This quiet trail had ___ hikers today than the busy lakeside path.',
        spokenFullSentence:
          'This quiet trail had fewer hikers today than the busy lakeside path.',
        targetAnswer: 'fewer',
        choices: ['less', 'fewer', 'fewest', 'lesser'],
        correctIndex: 1,
        ruleTip:
          "Use 'fewer' for things you can count (hikers), and 'less' for amounts (water)!",
      },
    ],
  },
  {
    id: 'en-gram-t4-2',
    tier: 4,
    categoryTag: 'Apostrophes',
    title: 'Apostrophe Patrol',
    subtitle: 'Nail singular possessives, plural possessives, and contractions',
    emblemCollectibleId: 'magic-bookworm-cat',
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    questions: [
      {
        id: 'en-gq-51',
        emoji: '🐕',
        promptSentence:
          'Dad filled that sleepy ___ water bowl before our evening walk.',
        spokenFullSentence:
          "Dad filled that sleepy dog's water bowl before our evening walk.",
        targetAnswer: "dog's",
        choices: ['dogs', "dogs'", "dog's", "dog's'"],
        correctIndex: 2,
        ruleTip:
          "For ONE owner ('that dog'), add apostrophe + s to show ownership: dog's!",
      },
      {
        id: 'en-gq-52',
        emoji: '⚽',
        promptSentence:
          'The coach washed all twelve of the ___ soccer jerseys before the big tournament.',
        spokenFullSentence:
          "The coach washed all twelve of the girls' soccer jerseys before the big tournament.",
        targetAnswer: "girls'",
        choices: ["girl's", 'girls', "girls's", "girls'"],
        correctIndex: 3,
        ruleTip:
          "For a plural noun already ending in -s ('girls'), put the apostrophe AFTER the s!",
      },
      {
        id: 'en-gq-53',
        emoji: '📚',
        promptSentence:
          'The sunny corner of the library holds shelves of ___ picture books.',
        spokenFullSentence:
          "The sunny corner of the library holds shelves of children's picture books.",
        targetAnswer: "children's",
        choices: ["children's", "childrens'", 'childrens', "children'"],
        correctIndex: 0,
        ruleTip:
          "Irregular plurals without -s (like 'children') add apostrophe + s: children's!",
      },
      {
        id: 'en-gq-54',
        emoji: '👟',
        promptSentence:
          'Lucas ___ realize his shoelace was untied until he reached the porch.',
        spokenFullSentence:
          "Lucas didn't realize his shoelace was untied until he reached the porch.",
        targetAnswer: "didn't",
        choices: ["did'nt", "didn't", 'didnt', "didnt'"],
        correctIndex: 1,
        ruleTip:
          "In 'didn't,' put the apostrophe where the missing letter 'o' from 'not' went!",
      },
      {
        id: 'en-gq-55',
        emoji: '🏕️',
        promptSentence:
          'I cannot believe ___ been three whole months since summer camp ended!',
        spokenFullSentence:
          "I cannot believe it's been three whole months since summer camp ended!",
        targetAnswer: "it's",
        choices: ['its', "its'", "it's", 'is'],
        correctIndex: 2,
        ruleTip:
          "'It's' can mean 'it is' OR 'it has'—here it stands for 'it has been'!",
      },
    ],
  },
  {
    id: 'en-gram-t4-3',
    tier: 4,
    categoryTag: 'Sentence Craft',
    title: 'Sentence Polish Pro',
    subtitle: 'Use relative pronouns, progressive tense, and clean sentence structure',
    emblemCollectibleId: 'magic-lantern-bat',
    accentHex: '#0F766E',
    bgHex: '#F0FDFA',
    questions: [
      {
        id: 'en-gq-56',
        emoji: '🎻',
        promptSentence:
          'The violinist ___ won the youth concerto prize is only ten years old.',
        spokenFullSentence:
          'The violinist who won the youth concerto prize is only ten years old.',
        targetAnswer: 'who',
        choices: ['which', 'what', 'whose', 'who'],
        correctIndex: 3,
        ruleTip: "Use 'who' (not 'which') when referring to a person!",
      },
      {
        id: 'en-gq-57',
        emoji: '⛵',
        promptSentence:
          'We applauded the inventor ___ solar-powered boat crossed the pond in ten seconds.',
        spokenFullSentence:
          'We applauded the inventor whose solar-powered boat crossed the pond in ten seconds.',
        targetAnswer: 'whose',
        choices: ['whose', "who's", 'which', 'whom'],
        correctIndex: 0,
        ruleTip:
          "Use relative pronoun 'whose' to show ownership—never confuse it with 'who's'!",
      },
      {
        id: 'en-gq-58',
        emoji: '🧭',
        promptSentence:
          "My grandmother's vintage compass, ___ still points true north, sits on my desk.",
        spokenFullSentence:
          "My grandmother's vintage compass, which still points true north, sits on my desk.",
        targetAnswer: 'which',
        choices: ['who', 'which', 'that', 'whose'],
        correctIndex: 1,
        ruleTip:
          "Use 'which' after a comma to add extra detail about an object or thing!",
      },
      {
        id: 'en-gq-59',
        emoji: '🔭',
        promptSentence:
          "At eight o'clock tomorrow night, our astronomy club ___ the lunar eclipse through telescopes.",
        spokenFullSentence:
          "At eight o'clock tomorrow night, our astronomy club will be watching the lunar eclipse through telescopes.",
        targetAnswer: 'will be watching',
        choices: [
          'was watching',
          'watched',
          'will be watching',
          'will watching',
        ],
        correctIndex: 2,
        ruleTip:
          "Future progressive uses 'will be' + an '-ing' verb for ongoing future action!",
      },
      {
        id: 'en-gq-60',
        emoji: '🎢',
        promptSentence:
          'Because the wooden roller coaster climbed so ___',
        spokenFullSentence:
          'Because the wooden roller coaster climbed so high, everyone gasped before the big drop.',
        targetAnswer: 'high, everyone gasped before the big drop.',
        choices: [
          'high into the bright blue summer sky.',
          'high, gripping the lap bar tightly.',
          'high and creaking loudly at the top.',
          'high, everyone gasped before the big drop.',
        ],
        correctIndex: 3,
        ruleTip:
          "A clause starting with 'Because' needs a full main clause to avoid a fragment!",
      },
    ],
  },
];

export function getEnglishGrammarSetsByTier(
  tier: DifficultyTier,
): GrammarRepairSet[] {
  return ENGLISH_GRAMMAR_SETS.filter((set) => set.tier === tier);
}

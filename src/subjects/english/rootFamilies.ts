import type { DifficultyTier } from '../../core/types';
import type { EnglishRootFamily } from './rootsGrammarTypes';

/**
 * Phase 4A English Roots & Affixes Builder (詞根詞綴工坊)
 * 16 curated families × 5 unique words = 80 words (4 families per tier, Tiers 1–4).
 * Aligned with CCSS Grade 4 → Grade 5 morphology standards (L.4.4.b / L.5.4.b).
 */
export const ENGLISH_ROOT_FAMILIES: EnglishRootFamily[] = [
  // =========================================================================
  // TIER 1 · HIGH-FREQUENCY PREFIXES (4 Families · 20 Words)
  // =========================================================================
  {
    id: 'en-root-t1-1',
    kind: 'prefix',
    tier: 1,
    morpheme: 're-',
    morphemeMeaning: 'again / back',
    title: 'Prefix re- · Do It Again!',
    subtitle: 'Add re- to the front of a verb to mean doing something again.',
    emblemCollectibleId: 'space-moon-rock',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    items: [
      {
        word: 'rebuild',
        morpheme: 're-',
        basePart: 'build',
        order: 'morpheme-first',
        meaning: 'to build something again after it fell down or broke',
        formula: 're- (again) + build = build again',
        exampleSentence:
          'When our giant block castle tumbled over, we cheered and started to rebuild it even taller.',
        sprintSentence:
          'After the strong storm knocked down the wooden treehouse, the neighbors pitched in to ___ the whole fort.',
      },
      {
        word: 'replay',
        morpheme: 're-',
        basePart: 'play',
        order: 'morpheme-first',
        meaning: 'to play a game, song, or video again',
        formula: 're- (again) + play = play again',
        exampleSentence:
          'Aria loved the final dance scene so much that she hit the button to replay the clip.',
        sprintSentence:
          'Because that catchy ukulele chorus was everyone’s favorite part, the music teacher agreed to ___ the track.',
      },
      {
        word: 'rewrite',
        morpheme: 're-',
        basePart: 'write',
        order: 'morpheme-first',
        meaning: 'to write something again to make it neater or stronger',
        formula: 're- (again) + write = write again',
        exampleSentence:
          'Before turning in her adventure story, Zoe decided to rewrite the ending with extra sparkle.',
        sprintSentence:
          'Raindrops smudged the ink on Sam’s messy poem, so he grabbed a clean sheet to ___ every stanza neatly.',
      },
      {
        word: 'reheat',
        morpheme: 're-',
        basePart: 'heat',
        order: 'morpheme-first',
        meaning: 'to warm up food that has cooled down',
        formula: 're- (again) + heat = heat again',
        exampleSentence:
          'Dad helped me reheat the leftover tomato soup on the stove until tiny bubbles appeared.',
        sprintSentence:
          'When we got home from soccer practice, Mom put the chilly pizza slices in the toaster oven to ___ them.',
      },
      {
        word: 'refill',
        morpheme: 're-',
        basePart: 'fill',
        order: 'morpheme-first',
        meaning: 'to fill an empty container back up again',
        formula: 're- (again) + fill = fill again',
        exampleSentence:
          'During the hike, we stopped at the cool drinking fountain to refill our water bottles.',
        sprintSentence:
          'Once the hummingbirds drank the last drop of sweet nectar, Grandpa went outside to ___ the glass feeder.',
      },
    ],
  },
  {
    id: 'en-root-t1-2',
    kind: 'prefix',
    tier: 1,
    morpheme: 'un-',
    morphemeMeaning: 'not / opposite of',
    title: 'Prefix un- · Flip the Meaning!',
    subtitle: 'Snap un- onto a base word to mean “not” or to undo an action.',
    emblemCollectibleId: 'space-star-slime',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    items: [
      {
        word: 'unfair',
        morpheme: 'un-',
        basePart: 'fair',
        order: 'morpheme-first',
        meaning: 'not fair or not treating everyone equally',
        formula: 'un- (not) + fair = not fair',
        exampleSentence:
          'Giving one team ten extra turns in the board game would be completely unfair.',
        sprintSentence:
          'The kids agreed it was ___ for one player to take three giant slices of cake while everyone else got half a slice.',
      },
      {
        word: 'unhappy',
        morpheme: 'un-',
        basePart: 'happy',
        order: 'morpheme-first',
        meaning: 'sad or not feeling cheerful',
        formula: 'un- (not) + happy = not happy',
        exampleSentence:
          'Milo looked unhappy when heavy rain canceled our trip to the butterfly garden.',
        sprintSentence:
          'Chloe felt ___ and wiped away a tear after she accidentally dropped her rainbow popsicle on the sidewalk.',
      },
      {
        word: 'unlock',
        morpheme: 'un-',
        basePart: 'lock',
        order: 'morpheme-first',
        meaning: 'to open a lock using a key or secret code',
        formula: 'un- (opposite of) + lock = open a lock',
        exampleSentence:
          'Lily turned the brass key twice to unlock the painted wooden treasure chest.',
        sprintSentence:
          'At eight o’clock sharp, the librarian slid her silver key into the front door to ___ the library for visitors.',
      },
      {
        word: 'untie',
        morpheme: 'un-',
        basePart: 'tie',
        order: 'morpheme-first',
        meaning: 'to loosen and undo a knot or bow',
        formula: 'un- (opposite of) + tie = undo a knot',
        exampleSentence:
          'My muddy sneaker laces were knotted so tightly that I needed two hands to untie them.',
        sprintSentence:
          'Before hopping into bed, Leo sat on the rug to ___ the silky ribbon wrapped around his birthday gift.',
      },
      {
        word: 'unsafe',
        morpheme: 'un-',
        basePart: 'safe',
        order: 'morpheme-first',
        meaning: 'not safe; likely to cause harm or danger',
        formula: 'un- (not) + safe = not safe',
        exampleSentence:
          'Riding a scooter without a helmet on a busy street is unsafe.',
        sprintSentence:
          'The park ranger closed the icy cliff trail because slippery rocks made hiking there ___ for families.',
      },
    ],
  },
  {
    id: 'en-root-t1-3',
    kind: 'prefix',
    tier: 1,
    morpheme: 'pre-',
    morphemeMeaning: 'before',
    title: 'Prefix pre- · Ahead of Time!',
    subtitle: 'Spot pre- at the start of words that happen before the main event.',
    emblemCollectibleId: 'space-astro-corgi',
    accentHex: '#0891B2',
    bgHex: '#ECFEFF',
    items: [
      {
        word: 'preview',
        morpheme: 'pre-',
        basePart: 'view',
        order: 'morpheme-first',
        meaning: 'to look at or watch a sneak peek before the full show begins',
        formula: 'pre- (before) + view = see before',
        exampleSentence:
          'We watched a two-minute preview of the new animated space movie before it arrived in theaters.',
        sprintSentence:
          'Before reading the whole chapter, Ms. Chen asked us to ___ the headings and colorful maps on each page.',
      },
      {
        word: 'preheat',
        morpheme: 'pre-',
        basePart: 'heat',
        order: 'morpheme-first',
        meaning: 'to warm an oven to the right temperature before baking',
        formula: 'pre- (before) + heat = heat before',
        exampleSentence:
          'Step one on the blueberry muffin recipe says to preheat the oven to 350 degrees.',
        sprintSentence:
          'While Maya mixes the chocolate chip cookie dough, her dad turns the dial to ___ the empty oven.',
      },
      {
        word: 'prepay',
        morpheme: 'pre-',
        basePart: 'pay',
        order: 'morpheme-first',
        meaning: 'to pay money for something before you receive or use it',
        formula: 'pre- (before) + pay = pay before',
        exampleSentence:
          'Families can prepay for science museum tickets online so they skip the long ticket line.',
        sprintSentence:
          'Mom went to the bakery website on Monday to ___ for Friday’s strawberry cake ahead of pickup.',
      },
      {
        word: 'preschool',
        morpheme: 'pre-',
        basePart: 'school',
        order: 'morpheme-first',
        meaning: 'a school for young children before they enter kindergarten',
        formula: 'pre- (before) + school = school before kindergarten',
        exampleSentence:
          'My three-year-old sister loves painting dinosaurs and singing ABC songs at preschool.',
        sprintSentence:
          'Before starting kindergarten next autumn, four-year-old Noah spends his mornings finger-painting at ___.',
      },
      {
        word: 'pretest',
        morpheme: 'pre-',
        basePart: 'test',
        order: 'morpheme-first',
        meaning: 'a short practice quiz taken before learning a new unit',
        formula: 'pre- (before) + test = quiz taken before',
        exampleSentence:
          'Our spelling pretest helped Mr. Ortiz see which tricky words we already knew on Monday.',
        sprintSentence:
          'At the start of the fractions unit, our teacher handed out a quick five-question ___ that did not count for a grade.',
      },
    ],
  },
  {
    id: 'en-root-t1-4',
    kind: 'prefix',
    tier: 1,
    morpheme: 'mis-',
    morphemeMeaning: 'wrongly / badly',
    title: 'Prefix mis- · Oops, Wrong Way!',
    subtitle: 'When mis- leads a word, an action happens wrongly or by mistake.',
    emblemCollectibleId: 'space-saturn-cat',
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    items: [
      {
        word: 'misspell',
        morpheme: 'mis-',
        basePart: 'spell',
        order: 'morpheme-first',
        meaning: 'to spell a word with the wrong letters',
        formula: 'mis- (wrongly) + spell = spell wrongly',
        exampleSentence:
          'I used to misspell the word “because” until I learned a silly rhyme for the letters.',
        sprintSentence:
          'Before turning in his essay, Evan checked the silent “k” carefully so he would not ___ “knowledge.”',
      },
      {
        word: 'misplace',
        morpheme: 'mis-',
        basePart: 'place',
        order: 'morpheme-first',
        meaning: 'to put something in the wrong spot and forget where it is',
        formula: 'mis- (wrongly) + place = put in the wrong spot',
        exampleSentence:
          'Grandpa keeps a bright orange clip on his glasses so he will never misplace them.',
        sprintSentence:
          'Put your library card right inside your backpack pocket so you do not ___ it before book return day.',
      },
      {
        word: 'misunderstand',
        morpheme: 'mis-',
        basePart: 'understand',
        order: 'morpheme-first',
        meaning: 'to get the wrong idea about what someone meant',
        formula: 'mis- (wrongly) + understand = understand wrongly',
        exampleSentence:
          'Because the gym was noisy, Owen did not want to misunderstand the referee’s whistle signal.',
        sprintSentence:
          'Please repeat the treasure-hunt clue slowly so our team does not ___ what the riddle means.',
      },
      {
        word: 'misbehave',
        morpheme: 'mis-',
        basePart: 'behave',
        order: 'morpheme-first',
        meaning: 'to act badly or break the rules',
        formula: 'mis- (badly) + behave = act badly',
        exampleSentence:
          'Our mischievous puppy likes to misbehave by chewing on slippers whenever nobody is looking.',
        sprintSentence:
          'The playful kitten started to ___ by knocking pencils off the desk and climbing the living-room curtains.',
      },
      {
        word: 'misread',
        morpheme: 'mis-',
        basePart: 'read',
        order: 'morpheme-first',
        meaning: 'to read a word, number, or direction incorrectly',
        formula: 'mis- (wrongly) + read = read wrongly',
        exampleSentence:
          'Look closely at the baking chart so you do not misread a teaspoon as a tablespoon!',
        sprintSentence:
          'In the dim hallway light, Hannah hurried and happened to ___ the room number 208 as 280.',
      },
    ],
  },

  // =========================================================================
  // TIER 2 · HIGH-FREQUENCY SUFFIXES & PREFIXES (4 Families · 20 Words)
  // =========================================================================
  {
    id: 'en-root-t2-1',
    kind: 'suffix',
    tier: 2,
    morpheme: '-ful',
    morphemeMeaning: 'full of',
    title: 'Suffix -ful · Packed to the Brim!',
    subtitle: 'Attach -ful to the end of a base word to describe being full of a quality.',
    emblemCollectibleId: 'space-comet-whale',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    items: [
      {
        word: 'cheerful',
        morpheme: '-ful',
        basePart: 'cheer',
        order: 'base-first',
        meaning: 'full of happiness, smiles, and bright energy',
        formula: 'cheer + -ful (full of) = full of cheer',
        exampleSentence:
          'Our cheerful bus driver greets every student with a big wave and a joke each morning.',
        sprintSentence:
          'Even on a gloomy Monday, Sofia’s sunny smile and bubbly laugh kept the whole table feeling ___.',
      },
      {
        word: 'helpful',
        morpheme: '-ful',
        basePart: 'help',
        order: 'base-first',
        meaning: 'kind and eager to give assistance to others',
        formula: 'help + -ful (full of) = ready to help',
        exampleSentence:
          'A helpful classmate walked the new student all the way to the art studio.',
        sprintSentence:
          'It was very ___ of Lucas to hold the heavy door open and carry the extra stacks of library books.',
      },
      {
        word: 'colorful',
        morpheme: '-ful',
        basePart: 'color',
        order: 'base-first',
        meaning: 'full of bright, varied colors',
        formula: 'color + -ful (full of) = full of color',
        exampleSentence:
          'A colorful parrot with red, turquoise, and gold feathers perched on the branch.',
        sprintSentence:
          'The spring parade floated down Main Street with giant balloons and ___ paper streamers in every shade of the rainbow.',
      },
      {
        word: 'careful',
        morpheme: '-ful',
        basePart: 'care',
        order: 'base-first',
        meaning: 'paying close attention so nothing breaks or goes wrong',
        formula: 'care + -ful (full of) = full of care',
        exampleSentence:
          'Be careful when carrying that steaming mug of hot cocoa across the rug.',
        sprintSentence:
          'Nora took slow, ___ steps across the wet stepping-stones so she would not slip into the creek.',
      },
      {
        word: 'thankful',
        morpheme: '-ful',
        basePart: 'thank',
        order: 'base-first',
        meaning: 'feeling grateful and appreciative for something good',
        formula: 'thank + -ful (full of) = full of thanks',
        exampleSentence:
          'I am thankful for my friends who brought me homemade soup when I had a cold.',
        sprintSentence:
          'Around the autumn dinner table, each family member shared one blessing they felt deeply ___ for this year.',
      },
    ],
  },
  {
    id: 'en-root-t2-2',
    kind: 'suffix',
    tier: 2,
    morpheme: '-less',
    morphemeMeaning: 'without',
    title: 'Suffix -less · Zero Left Behind!',
    subtitle: 'Add -less to the end of a noun to show something has none of it.',
    emblemCollectibleId: 'space-nebula-axolotl',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    items: [
      {
        word: 'fearless',
        morpheme: '-less',
        basePart: 'fear',
        order: 'base-first',
        meaning: 'without fear; brave in the face of danger or challenges',
        formula: 'fear + -less (without) = without fear',
        exampleSentence:
          'The fearless astronaut floated outside the space station to repair the solar wing.',
        sprintSentence:
          'The ___ firefighter climbed the tall rescue ladder into the smoke without hesitating for a second.',
      },
      {
        word: 'careless',
        morpheme: '-less',
        basePart: 'care',
        order: 'base-first',
        meaning: 'not paying enough attention; rushing and making avoidable mistakes',
        formula: 'care + -less (without) = without care',
        exampleSentence:
          'Rushing through math problems led to a careless addition mistake on the final line.',
        sprintSentence:
          'Leaving the paint jar wide open on the edge of the wobbly table was a ___ move that caused a blue splash.',
      },
      {
        word: 'harmless',
        morpheme: '-less',
        basePart: 'harm',
        order: 'base-first',
        meaning: 'unable to hurt or injure anyone',
        formula: 'harm + -less (without) = without harm',
        exampleSentence:
          'That tiny green garden snake looks surprising at first, but it is completely harmless to humans.',
        sprintSentence:
          'The science guide assured us that the spotted ladybug crawling on my sleeve is gentle and ___.',
      },
      {
        word: 'endless',
        morpheme: '-less',
        basePart: 'end',
        order: 'base-first',
        meaning: 'seeming to stretch on forever without stopping',
        formula: 'end + -less (without) = without an end',
        exampleSentence:
          'From the airplane window, the fluffy white clouds looked like an endless snowy sea.',
        sprintSentence:
          'As we drove across the flat desert highway, golden sand dunes rolled on in an ___ line to the horizon.',
      },
      {
        word: 'spotless',
        morpheme: '-less',
        basePart: 'spot',
        order: 'base-first',
        meaning: 'completely clean without a single stain or speck of dirt',
        formula: 'spot + -less (without) = without a spot',
        exampleSentence:
          'After we scrubbed the stove and swept the floor, the kitchen looked spotless.',
        sprintSentence:
          'Liam polished his white sneakers with soapy water until not a single mud smudge remained and they shone ___.',
      },
    ],
  },
  {
    id: 'en-root-t2-3',
    kind: 'prefix',
    tier: 2,
    morpheme: 'dis-',
    morphemeMeaning: 'not / opposite / away',
    title: 'Prefix dis- · Reverse & Vanish!',
    subtitle: 'Prefix dis- reverses an action or turns a meaning into its opposite.',
    emblemCollectibleId: 'space-nova-phoenix',
    accentHex: '#E11D48',
    bgHex: '#FFF1F2',
    items: [
      {
        word: 'disagree',
        morpheme: 'dis-',
        basePart: 'agree',
        order: 'morpheme-first',
        meaning: 'to hold a different opinion from someone else',
        formula: 'dis- (not) + agree = not agree',
        exampleSentence:
          'Good friends can disagree about the best ice-cream flavor and still laugh together.',
        sprintSentence:
          'Maya thinks summer is the greatest season, while her brother and cousin politely ___ because they love snow.',
      },
      {
        word: 'disappear',
        morpheme: 'dis-',
        basePart: 'appear',
        order: 'morpheme-first',
        meaning: 'to vanish from sight so you can no longer see it',
        formula: 'dis- (opposite of) + appear = go out of sight',
        exampleSentence:
          'The magician tapped her top hat, and the shiny silver coin seemed to disappear into thin air.',
        sprintSentence:
          'As the morning sun warmed the meadow, the thick gray fog began to ___ until the hills stood clear.',
      },
      {
        word: 'dishonest',
        morpheme: 'dis-',
        basePart: 'honest',
        order: 'morpheme-first',
        meaning: 'not truthful; willing to lie or cheat',
        formula: 'dis- (not) + honest = not honest',
        exampleSentence:
          'Blaming your little brother for a broken lamp you knocked over would be dishonest.',
        sprintSentence:
          'Peeking at the answer key during a solo quiz is ___ and keeps you from truly learning.',
      },
      {
        word: 'dislike',
        morpheme: 'dis-',
        basePart: 'like',
        order: 'morpheme-first',
        meaning: 'to not enjoy or not be fond of something',
        formula: 'dis- (not) + like = not like',
        exampleSentence:
          'Most house cats dislike getting their paws wet in a bubbly bathtub.',
        sprintSentence:
          'Even though Ethan loves sweet strawberries, he happens to ___ sour pickles on his sandwich.',
      },
      {
        word: 'disobey',
        morpheme: 'dis-',
        basePart: 'obey',
        order: 'morpheme-first',
        meaning: 'to refuse to follow a rule, sign, or command',
        formula: 'dis- (not) + obey = not obey',
        exampleSentence:
          'Our dog trainer taught Buster never to disobey the “stay” hand signal near the curb.',
        sprintSentence:
          'Swimmers must not ___ the lifeguard’s whistle when thunderclouds roll toward the pool.',
      },
    ],
  },
  {
    id: 'en-root-t2-4',
    kind: 'suffix',
    tier: 2,
    morpheme: '-able',
    morphemeMeaning: 'can be',
    title: 'Suffix -able · Ready & Possible!',
    subtitle: 'Add -able to a verb to describe something that can be done.',
    emblemCollectibleId: 'space-chroma-narwhal',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    items: [
      {
        word: 'washable',
        morpheme: '-able',
        basePart: 'wash',
        order: 'base-first',
        meaning: 'able to be washed clean with soap and water',
        formula: 'wash + -able (can be) = can be washed',
        exampleSentence:
          'Our art teacher buys washable markers so stray purple doodles rinse right off our hands.',
        sprintSentence:
          'Mom picked a ___ canvas tote bag so we can rinse off any mud or berry juice after our picnic.',
      },
      {
        word: 'breakable',
        morpheme: '-able',
        basePart: 'break',
        order: 'base-first',
        meaning: 'fragile and able to crack or shatter easily',
        formula: 'break + -able (can be) = can be broken',
        exampleSentence:
          'We wrapped the glass snow globe in bubble wrap because it is super breakable.',
        sprintSentence:
          'Mom placed the delicate porcelain teacup on the high shelf so our bouncing puppy wouldn’t bump something so ___.',
      },
      {
        word: 'readable',
        morpheme: '-able',
        basePart: 'read',
        order: 'base-first',
        meaning: 'clear and neat enough to be read easily',
        formula: 'read + -able (can be) = can be read',
        exampleSentence:
          'Printing slowly with wide spaces between words made Ava’s science poster super readable.',
        sprintSentence:
          'The faded treasure map had smudged corners, yet the bold ink directions were still clear and ___.',
      },
      {
        word: 'enjoyable',
        morpheme: '-able',
        basePart: 'enjoy',
        order: 'base-first',
        meaning: 'fun, pleasant, and easy to enjoy',
        formula: 'enjoy + -able (can be) = can be enjoyed',
        exampleSentence:
          'Playing board games by the fireplace made the snowy afternoon wonderfully enjoyable.',
        sprintSentence:
          'Cool breezes, crunchy apples, and friendly laughter made our autumn orchard trip truly ___.',
      },
      {
        word: 'predictable',
        morpheme: '-able',
        basePart: 'predict',
        order: 'base-first',
        meaning: 'easy to guess or know ahead of time',
        formula: 'predict + -able (can be) = can be predicted',
        exampleSentence:
          'The mystery cartoon felt a little predictable because I guessed the sneaky villain in minute two.',
        sprintSentence:
          'Because the geyser erupts right on schedule every ninety minutes, its next spray is very ___.',
      },
    ],
  },

  // =========================================================================
  // TIER 3 · CORE SUFFIXES & ROOTS (4 Families · 20 Words)
  // =========================================================================
  {
    id: 'en-root-t3-1',
    kind: 'suffix',
    tier: 3,
    morpheme: '-ment',
    morphemeMeaning: 'result / state of',
    title: 'Suffix -ment · Action Into Noun!',
    subtitle: 'Suffix -ment turns an action verb into the result or feeling it creates.',
    emblemCollectibleId: 'ocean-pearl-clam',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    items: [
      {
        word: 'movement',
        morpheme: '-ment',
        basePart: 'move',
        order: 'base-first',
        meaning: 'the act or result of changing position or motion',
        formula: 'move + -ment (result/state) = the act of moving',
        exampleSentence:
          'The wildlife photographer stayed completely still until she spotted a tiny movement in the tall grass.',
        sprintSentence:
          'Our class watched the slow ___ of the caterpillar as it inched across the milkweed leaf.',
      },
      {
        word: 'agreement',
        morpheme: '-ment',
        basePart: 'agree',
        order: 'base-first',
        meaning: 'a shared promise or decision that both sides accept',
        formula: 'agree + -ment (result/state) = a shared deal',
        exampleSentence:
          'The two sisters reached an agreement to trade chores so one washed dishes while the other walked the dog.',
        sprintSentence:
          'After ten minutes of calm discussion, both captains shook hands on a fair ___ about the playground rules.',
      },
      {
        word: 'improvement',
        morpheme: '-ment',
        basePart: 'improve',
        order: 'base-first',
        meaning: 'a change that makes something noticeably better than before',
        formula: 'improve + -ment (result/state) = getting better',
        exampleSentence:
          'Practicing piano scales for fifteen minutes each day brought a huge improvement in Chloe’s recital piece.',
        sprintSentence:
          'Comparing his September and April essays, Marco felt proud of the steady ___ in his vocabulary and neatness.',
      },
      {
        word: 'measurement',
        morpheme: '-ment',
        basePart: 'measure',
        order: 'base-first',
        meaning: 'the exact size, length, weight, or amount found by measuring',
        formula: 'measure + -ment (result/state) = result of measuring',
        exampleSentence:
          'Before sawing the wooden plank for our birdhouse, Grandpa checked the ruler measurement twice.',
        sprintSentence:
          'Record each centimeter ___ carefully in your science notebook so our bean-plant growth chart stays accurate.',
      },
      {
        word: 'excitement',
        morpheme: '-ment',
        basePart: 'excite',
        order: 'base-first',
        meaning: 'a lively, thrilled feeling of eager anticipation',
        formula: 'excite + -ment (result/state) = state of being excited',
        exampleSentence:
          'The fourth-grade hallway buzzed with excitement on the morning of the aquarium field trip.',
        sprintSentence:
          'Popcorn popped and cheers echoed across the gym as ___ grew before the championship robotics match.',
      },
    ],
  },
  {
    id: 'en-root-t3-2',
    kind: 'prefix',
    tier: 3,
    morpheme: 'sub-',
    morphemeMeaning: 'under / below',
    title: 'Prefix sub- · Dive Down Below!',
    subtitle: 'Latin prefix sub- signals something positioned underneath or below.',
    emblemCollectibleId: 'ocean-bubble-turtle',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    items: [
      {
        word: 'submarine',
        morpheme: 'sub-',
        basePart: 'marine',
        order: 'morpheme-first',
        meaning: 'a special ship built to dive and travel deep underwater',
        formula: 'sub- (under) + marine (sea) = vessel under the sea',
        exampleSentence:
          'Marine scientists rode a yellow research submarine down to film glowing jellyfish in the deep trench.',
        sprintSentence:
          'Through the round glass window of the ___, the explorers spotted giant squid gliding far beneath the ocean waves.',
      },
      {
        word: 'subway',
        morpheme: 'sub-',
        basePart: 'way',
        order: 'morpheme-first',
        meaning: 'an underground city train system running through tunnels',
        formula: 'sub- (under) + way (road) = underground transit way',
        exampleSentence:
          'When we visited New York City, we rode the fast subway beneath the busy streets.',
        sprintSentence:
          'We walked down the station stairs into the tiled tunnel to catch the express ___ heading downtown.',
      },
      {
        word: 'subzero',
        morpheme: 'sub-',
        basePart: 'zero',
        order: 'morpheme-first',
        meaning: 'freezing cold temperatures that drop below zero degrees',
        formula: 'sub- (below) + zero = colder than zero degrees',
        exampleSentence:
          'Emperor penguins huddle tightly together to stay warm during Antarctica’s subzero winter winds.',
        sprintSentence:
          'Arctic explorers wear thick insulated parkas and thermal mittens whenever the thermometer plunges to ___ temperatures.',
      },
      {
        word: 'subtitle',
        morpheme: 'sub-',
        basePart: 'title',
        order: 'morpheme-first',
        meaning: 'printed text shown below a movie screen or beneath a main book title',
        formula: 'sub- (under) + title = words printed below a title',
        exampleSentence:
          'We turned on the English subtitle line at the bottom of the screen while watching a Japanese cartoon.',
        sprintSentence:
          'Right beneath the book’s bold main heading, the smaller ___ explained that the guide covers fifty wild birds.',
      },
      {
        word: 'submerge',
        morpheme: 'sub-',
        basePart: 'merge',
        order: 'morpheme-first',
        meaning: 'to sink, dip, or plunge completely underneath water',
        formula: 'sub- (under) + merge (dip/plunge) = dip underwater',
        exampleSentence:
          'Hippos love to submerge almost their entire bodies in cool muddy rivers with only their nostrils peeking out.',
        sprintSentence:
          'To wash off all the beach sand, Maya chose to ___ her plastic bucket completely under the clear pool water.',
      },
    ],
  },
  {
    id: 'en-root-t3-3',
    kind: 'root',
    tier: 3,
    morpheme: 'tele',
    morphemeMeaning: 'far / distant',
    title: 'Greek Root tele · Across the Miles!',
    subtitle: 'The Greek root tele means “far away”—connecting sights, sounds, and messages.',
    emblemCollectibleId: 'ocean-coral-seahorse',
    accentHex: '#9333EA',
    bgHex: '#FAF5FF',
    items: [
      {
        word: 'telescope',
        morpheme: 'tele',
        basePart: 'scope',
        order: 'morpheme-first',
        meaning: 'an optical tool that lets you see faraway stars and planets closely',
        formula: 'tele (far) + scope (look/see) = tool to see far away',
        exampleSentence:
          'Peering through our backyard telescope, I counted four bright moons circling Jupiter.',
        sprintSentence:
          'On the clear desert hilltop, the astronomer aimed her giant ___ at Saturn’s sparkling icy rings.',
      },
      {
        word: 'telephone',
        morpheme: 'tele',
        basePart: 'phone',
        order: 'morpheme-first',
        meaning: 'a device that carries spoken voices across far distances',
        formula: 'tele (far) + phone (sound/voice) = voice from far away',
        exampleSentence:
          'Every Sunday evening, we call Grandma on the telephone to tell her about our week.',
        sprintSentence:
          'Alexander Graham Bell amazed listeners in 1876 when the very first ___ carried his voice to another room.',
      },
      {
        word: 'television',
        morpheme: 'tele',
        basePart: 'vision',
        order: 'morpheme-first',
        meaning: 'a screen that receives and shows moving pictures broadcast from far away',
        formula: 'tele (far) + vision (sight) = pictures from far away',
        exampleSentence:
          'Our family gathered on the couch to watch a live space-rocket launch on television.',
        sprintSentence:
          'After finishing her homework, Elena switched on the living-room ___ to catch a nature documentary about coral reefs.',
      },
      {
        word: 'teleport',
        morpheme: 'tele',
        basePart: 'port',
        order: 'morpheme-first',
        meaning: 'to travel instantly across a great distance in science-fiction stories',
        formula: 'tele (far) + port (carry) = carry instantly across distance',
        exampleSentence:
          'In my favorite sci-fi comic, the space captain presses her wristband to teleport onto a distant moon.',
        sprintSentence:
          'If a magical doorway really existed, I would ___ straight from my bedroom to a sunny Hawaiian beach in one blink!',
      },
      {
        word: 'telegraph',
        morpheme: 'tele',
        basePart: 'graph',
        order: 'morpheme-first',
        meaning: 'a historic machine that sent coded messages long distances along wires',
        formula: 'tele (far) + graph (write) = send written signals far away',
        exampleSentence:
          'In the 1800s, operators tapped dots and dashes on a telegraph to send urgent news across the country.',
        sprintSentence:
          'Before phones or email existed, train stations relied on clicks from a wired ___ machine using Morse code.',
      },
    ],
  },
  {
    id: 'en-root-t3-4',
    kind: 'root',
    tier: 3,
    morpheme: 'bio',
    morphemeMeaning: 'life',
    title: 'Greek Root bio · All About Life!',
    subtitle: 'Whenever you see bio, think of living organisms, nature, and life stories.',
    emblemCollectibleId: 'ocean-jelly-dancer',
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    items: [
      {
        word: 'biology',
        morpheme: 'bio',
        basePart: 'logy',
        order: 'morpheme-first',
        meaning: 'the branch of science that studies living plants, animals, and cells',
        formula: 'bio (life) + logy (study of) = study of life',
        exampleSentence:
          'In our elementary biology lab, we observed tadpoles growing tiny back legs.',
        sprintSentence:
          'Students who love learning how rainforest frogs and towering redwood trees grow often enjoy studying ___.',
      },
      {
        word: 'biologist',
        morpheme: 'bio',
        basePart: 'logist',
        order: 'morpheme-first',
        meaning: 'a scientist who studies living creatures and ecosystems',
        formula: 'bio (life) + logist (scientist) = scientist who studies life',
        exampleSentence:
          'A marine biologist visited our school and showed real sea-turtle shells and whale photos.',
        sprintSentence:
          'Wearing waders in the marsh, the wildlife ___ carefully counted migrating cranes with her binoculars.',
      },
      {
        word: 'biography',
        morpheme: 'bio',
        basePart: 'graphy',
        order: 'morpheme-first',
        meaning: 'the true written story of a real person’s life',
        formula: 'bio (life) + graphy (writing) = written life story',
        exampleSentence:
          'I checked out a picture-book biography about how Amelia Earhart learned to fly airplanes.',
        sprintSentence:
          'For our hero project, Devon read a fascinating ___ describing mathematician Katherine Johnson’s life at NASA.',
      },
      {
        word: 'biosphere',
        morpheme: 'bio',
        basePart: 'sphere',
        order: 'morpheme-first',
        meaning: 'every part of Earth’s land, water, and air where living things exist',
        formula: 'bio (life) + sphere (globe/zone) = Earth’s zone of life',
        exampleSentence:
          'From deep coral reefs to snowy mountain peaks, all habitats connect inside Earth’s biosphere.',
        sprintSentence:
          'In fourth-grade Earth science, we drew a diagram showing how oceans, forests, and soils form our planet’s ___.',
      },
      {
        word: 'biofuel',
        morpheme: 'bio',
        basePart: 'fuel',
        order: 'morpheme-first',
        meaning: 'renewable fuel made from living plants or natural organic materials',
        formula: 'bio (life) + fuel = energy made from living plants',
        exampleSentence:
          'Some eco-friendly city buses run on clean biofuel made from corn and soybean oil.',
        sprintSentence:
          'Engineers are testing green ___ created from fast-growing ocean algae to power delivery trucks.',
      },
    ],
  },

  // =========================================================================
  // TIER 4 · GREEK & LATIN ACADEMIC ROOTS (4 Families · 20 Words)
  // =========================================================================
  {
    id: 'en-root-t4-1',
    kind: 'root',
    tier: 4,
    morpheme: 'graph',
    morphemeMeaning: 'write / draw',
    title: 'Greek Root graph · Write & Draw!',
    subtitle: 'Spot graph in academic words connected to writing, spelling, and images.',
    emblemCollectibleId: 'ocean-dolphin-scout',
    accentHex: '#6366F1',
    bgHex: '#EEF2FF',
    items: [
      {
        word: 'autograph',
        morpheme: 'graph',
        basePart: 'auto',
        order: 'base-first',
        meaning: 'a person’s own handwritten signature, often collected as a keepsake',
        formula: 'auto (self) + graph (write) = write your own signature',
        exampleSentence:
          'After the book reading, the children’s author smiled and signed her autograph inside my novel.',
        sprintSentence:
          'Fans lined up beside the stadium fence with baseballs and markers hoping to get the pitcher’s ___.',
      },
      {
        word: 'photograph',
        morpheme: 'graph',
        basePart: 'photo',
        order: 'base-first',
        meaning: 'a real-life picture captured by a camera using light',
        formula: 'photo (light) + graph (draw/write) = picture drawn with light',
        exampleSentence:
          'Grandma keeps a framed photograph of our whole family smiling in front of the redwood trees.',
        sprintSentence:
          'Click! The wildlife ranger snapped a crisp ___ of the red fox right as it peeked over the log.',
      },
      {
        word: 'paragraph',
        morpheme: 'graph',
        basePart: 'para',
        order: 'base-first',
        meaning: 'a group of connected sentences written together about one main idea',
        formula: 'para (beside) + graph (write) = marked section of writing',
        exampleSentence:
          'Each paragraph in a strong report begins with a clear topic sentence and an indented first line.',
        sprintSentence:
          'Your opening ___ introduces the rainforest well—now start a new section to describe the tree frogs.',
      },
      {
        word: 'homograph',
        morpheme: 'graph',
        basePart: 'homo',
        order: 'base-first',
        meaning: 'a word spelled the exact same way as another word but with a different meaning',
        formula: 'homo (same) + graph (write) = written the same way',
        exampleSentence:
          'The word “bat” is a homograph because it can mean a flying mammal or a wooden baseball stick.',
        sprintSentence:
          'In ELA class, we learned that “bow” is a ___: the same letters can name a hair ribbon or the front of a ship.',
      },
      {
        word: 'graphic',
        morpheme: 'graph',
        basePart: 'ic',
        order: 'morpheme-first',
        meaning: 'relating to vivid drawings, illustrations, or visual art',
        formula: 'graph (draw) + -ic (related to) = filled with drawings',
        exampleSentence:
          'Every week, Clara checks out a new graphic novel filled with speech bubbles and colorful comic panels.',
        sprintSentence:
          'Our school newspaper hired a student ___ designer to illustrate bold posters and cartoon headers.',
      },
    ],
  },
  {
    id: 'en-root-t4-2',
    kind: 'root',
    tier: 4,
    morpheme: 'struct',
    morphemeMeaning: 'build',
    title: 'Latin Root struct · Master Builders!',
    subtitle: 'Latin root struct powers words about building bridges, skills, and designs.',
    emblemCollectibleId: 'ocean-glow-octopus',
    accentHex: '#B45309',
    bgHex: '#FFFBEB',
    items: [
      {
        word: 'construct',
        morpheme: 'struct',
        basePart: 'con',
        order: 'base-first',
        meaning: 'to build or assemble something carefully from parts',
        formula: 'con- (together) + struct (build) = build together',
        exampleSentence:
          'For our STEM challenge, we used popsicle sticks and tape to construct a bridge that held ten dictionaries.',
        sprintSentence:
          'Beavers work together in the creek to ___ brand-new sturdy lodges out of mud, stones, and chewed branches.',
      },
      {
        word: 'instruct',
        morpheme: 'struct',
        basePart: 'in',
        order: 'base-first',
        meaning: 'to teach or guide someone step by step so they build a skill',
        formula: 'in- (into) + struct (build) = build knowledge in someone',
        exampleSentence:
          'Coach Rivera will instruct the beginner swimmers on how to breathe smoothly during freestyle.',
        sprintSentence:
          'Tomorrow a visiting ceramic artist will ___ our class on how to pinch and shape clay bowls.',
      },
      {
        word: 'obstruct',
        morpheme: 'struct',
        basePart: 'ob',
        order: 'base-first',
        meaning: 'to block a path, view, or opening by getting in the way',
        formula: 'ob- (in the way) + struct (build) = build a barrier in the way',
        exampleSentence:
          'Please tuck your backpacks under the desks so they do not obstruct the aisle.',
        sprintSentence:
          'After the windstorm, a tangled pile of fallen oak branches threatened to ___ the narrow bike path for morning riders.',
      },
      {
        word: 'reconstruct',
        morpheme: 'struct',
        basePart: 'recon',
        order: 'base-first',
        meaning: 'to build something again from scattered pieces or earlier plans',
        formula: 're- (again) + con- (together) + struct (build) = build again',
        exampleSentence:
          'Paleontologists carefully reconstruct full dinosaur skeletons from fossil bones discovered in rock.',
        sprintSentence:
          'After an earthquake cracked the historic stone arch, engineers used old blueprints to ___ it piece by piece.',
      },
      {
        word: 'structure',
        morpheme: 'struct',
        basePart: 'ure',
        order: 'morpheme-first',
        meaning: 'a built object like a tower, bridge, or organized framework',
        formula: 'struct (build) + -ure (result/thing) = something built',
        exampleSentence:
          'The Golden Gate Bridge is a famous steel structure stretching across San Francisco Bay.',
        sprintSentence:
          'Honeybees build a six-sided honeycomb ___ that is both super lightweight and amazingly strong.',
      },
    ],
  },
  {
    id: 'en-root-t4-3',
    kind: 'root',
    tier: 4,
    morpheme: 'spect',
    morphemeMeaning: 'look / see',
    title: 'Latin Root spect · Sharp Eyes!',
    subtitle: 'Track Latin root spect in words about watching, checking, and dazzling sights.',
    emblemCollectibleId: 'ocean-koi-dragon',
    accentHex: '#C026D3',
    bgHex: '#FDF4FF',
    items: [
      {
        word: 'inspect',
        morpheme: 'spect',
        basePart: 'in',
        order: 'base-first',
        meaning: 'to look closely and carefully at something to check every detail',
        formula: 'in- (into) + spect (look) = look closely into',
        exampleSentence:
          'Before takeoff, the safety crew will inspect every wing bolt and tire on the airplane.',
        sprintSentence:
          'Using a magnifying glass, Maya leaned down to ___ the tiny veins on the monarch butterfly’s wing.',
      },
      {
        word: 'respect',
        morpheme: 'spect',
        basePart: 're',
        order: 'base-first',
        meaning: 'kindness, honor, and high regard shown toward someone (or to treat with honor)',
        formula: 're- (back) + spect (look) = look back at with honor',
        exampleSentence:
          'We show respect to guest speakers by listening quietly and raising our hands to ask questions.',
        sprintSentence:
          'Good sportsmanship means showing ___ to both your teammates and the opposing players after every game.',
      },
      {
        word: 'spectator',
        morpheme: 'spect',
        basePart: 'ator',
        order: 'morpheme-first',
        meaning: 'a person who watches a sports match, parade, or live show',
        formula: 'spect (look) + -ator (person who) = person watching',
        exampleSentence:
          'Every spectator in the front row jumped up and cheered when the gymnast stuck her landing.',
        sprintSentence:
          'Waving a blue foam finger from the bleachers, each ___ applauded as the runners sprinted across the finish line.',
      },
      {
        word: 'spectacle',
        morpheme: 'spect',
        basePart: 'acle',
        order: 'morpheme-first',
        meaning: 'an eye-catching, unforgettable sight or grand display',
        formula: 'spect (look) + -acle (sight/thing) = amazing sight to see',
        exampleSentence:
          'Hundreds of glowing lanterns drifting into the night sky created an unforgettable spectacle.',
        sprintSentence:
          'When fifty colorful hot-air balloons lifted off at sunrise, the valley sky turned into a breathtaking ___.',
      },
      {
        word: 'spectacular',
        morpheme: 'spect',
        basePart: 'acular',
        order: 'morpheme-first',
        meaning: 'extraordinary, thrilling, and amazing to look at',
        formula: 'spect (look) + -acular (worthy of seeing) = amazing to see',
        exampleSentence:
          'From the top of Yosemite’s overlook, we gazed at a spectacular waterfall crashing into the valley.',
        sprintSentence:
          'The grand finale of the July fireworks painted a ___ burst of gold and turquoise sparkles above the lake.',
      },
    ],
  },
  {
    id: 'en-root-t4-4',
    kind: 'root',
    tier: 4,
    morpheme: 'port',
    morphemeMeaning: 'carry',
    title: 'Latin Root port · Carry It Far!',
    subtitle: 'Latin root port means “carry”—from cargo ships to handy art folders.',
    emblemCollectibleId: 'ocean-chroma-leviathan',
    accentHex: '#0F766E',
    bgHex: '#F0FDFA',
    items: [
      {
        word: 'transport',
        morpheme: 'port',
        basePart: 'trans',
        order: 'base-first',
        meaning: 'to carry people or goods across from one place to another',
        formula: 'trans- (across) + port (carry) = carry across',
        exampleSentence:
          'Long cargo trains transport fresh grain and lumber across the mountains to busy harbors.',
        sprintSentence:
          'Yellow school buses safely ___ hundreds of students across town to their classrooms every morning.',
      },
      {
        word: 'export',
        morpheme: 'port',
        basePart: 'ex',
        order: 'base-first',
        meaning: 'to carry or ship goods out to be sold in another country',
        formula: 'ex- (out) + port (carry) = carry out to other lands',
        exampleSentence:
          'Orchards in California export crates of sweet almonds to grocery stores around the world.',
        sprintSentence:
          'Sunny tropical farms ___ ripe pineapples and cocoa beans to be sold in overseas markets.',
      },
      {
        word: 'import',
        morpheme: 'port',
        basePart: 'im',
        order: 'base-first',
        meaning: 'to carry or bring goods into a country from abroad',
        formula: 'im- (into) + port (carry) = carry into a country',
        exampleSentence:
          'Cold northern countries import fresh mangoes from warm climates during winter.',
        sprintSentence:
          'Local craft shops ___ handmade paper lanterns from overseas in Kyoto so families here can hang them for festivals.',
      },
      {
        word: 'portable',
        morpheme: 'port',
        basePart: 'able',
        order: 'morpheme-first',
        meaning: 'light and compact enough to be carried easily anywhere',
        formula: 'port (carry) + -able (can be) = can be carried easily',
        exampleSentence:
          'Dad packed a small portable speaker so we could listen to campfire tunes on our picnic.',
        sprintSentence:
          'Because the folding stool weighs less than two pounds, it is super ___ for sketching outdoors in the park.',
      },
      {
        word: 'portfolio',
        morpheme: 'port',
        basePart: 'folio',
        order: 'morpheme-first',
        meaning: 'a flat folder or case used to carry drawings, photos, or schoolwork',
        formula: 'port (carry) + folio (sheets) = case that carries sheets',
        exampleSentence:
          'Sora tucked all twelve of her watercolor cat paintings into a neat black art portfolio.',
        sprintSentence:
          'At parent-teacher night, Hannah opened her writing ___ to show off her favorite poems and science sketches.',
      },
    ],
  },
];

export function getEnglishRootFamiliesByTier(tier: DifficultyTier): EnglishRootFamily[] {
  return ENGLISH_ROOT_FAMILIES.filter((family) => family.tier === tier);
}

export function getEnglishRootFamilyById(id: string): EnglishRootFamily | undefined {
  return ENGLISH_ROOT_FAMILIES.find((family) => family.id === id);
}

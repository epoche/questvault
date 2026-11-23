import type { DifficultyTier } from '../../core/types';
import type { SpellingSet } from './spellingTypes';

export const ENGLISH_SPELLING_SETS: SpellingSet[] = [
  // ═══════════ TIER 1: FOUNDATIONAL SPELLING PATTERNS (4 sets · 20 words) ═══════════
  {
    id: 'en-spell-t1-01',
    tier: 1,
    title: 'Silent Letters I',
    subtitle: 'Spot sneaky quiet letters in everyday words',
    badge: 'Silent K / B / S / W / T',
    emblemCollectibleId: 'critter-sprout-bunny',
    items: [
      {
        id: 'sp-01',
        word: 'knight',
        ruleTag: 'Silent kn',
        trickyPart: 'kn',
        definition: 'A brave armored warrior who served a king or queen long ago.',
        contextSentence:
          'The silver ___ rode across the drawbridge to guard the royal gate.',
        memoryTip:
          'A knight carries a silent K like a shiny sword right in front of "night"!',
      },
      {
        id: 'sp-02',
        word: 'thumb',
        ruleTag: 'Silent mb',
        trickyPart: 'mb',
        definition: 'The short, thick inner finger on your hand that helps you grip things.',
        contextSentence:
          'Leo accidentally bumped his left ___ while hammering the birdhouse roof.',
        memoryTip:
          'Words ending in -mb like thumb, lamb, and climb hide a silent B at the end.',
      },
      {
        id: 'sp-03',
        word: 'island',
        ruleTag: 'Silent s',
        trickyPart: 'sl',
        definition: 'A piece of land completely surrounded by water on every side.',
        contextSentence:
          'Our ferry sailed past a tiny green ___ with a white lighthouse on top.',
        memoryTip:
          'Remember: an i-s-land "IS land" surrounded by water—never drop the silent S!',
      },
      {
        id: 'sp-04',
        word: 'wrist',
        ruleTag: 'Silent wr',
        trickyPart: 'wr',
        definition: 'The flexible joint that connects your hand to your lower arm.',
        contextSentence:
          'Chloe tied a colorful friendship bracelet neatly around her right ___.',
        memoryTip:
          'Think of WRist, WRite, and WRap—the W is silent whenever it bends before R!',
      },
      {
        id: 'sp-05',
        word: 'castle',
        ruleTag: 'Silent t',
        trickyPart: 'stle',
        definition: 'A huge stone fortress with tall towers where royalty once lived.',
        contextSentence:
          'At the beach, we built a giant sand ___ complete with four turret towers and a moat.',
        memoryTip:
          'Hide the silent T inside the stone walls of cas-tle, just like whistle and nestle!',
      },
    ],
  },
  {
    id: 'en-spell-t1-02',
    tier: 1,
    title: 'Double Consonants I',
    subtitle: 'Spot twin letters hiding inside everyday words',
    badge: 'Twin Letters',
    emblemCollectibleId: 'critter-acorn-hedgehog',
    items: [
      {
        id: 'sp-06',
        word: 'balloon',
        ruleTag: 'Double l & o',
        trickyPart: 'lloo',
        definition: 'A stretchy rubber bag filled with air or helium that floats at parties.',
        contextSentence:
          'A bright purple helium ___ floated all the way up to the gym ceiling.',
        memoryTip:
          'A ba-LL-OO-n has two L\'s for long strings and two O\'s shaped like round bubbles!',
      },
      {
        id: 'sp-07',
        word: 'squirrel',
        ruleTag: 'Double r + qu',
        trickyPart: 'rr',
        definition: 'A small, bushy-tailed forest rodent that climbs trees and gathers acorns.',
        contextSentence:
          'A playful gray ___ scampered up the oak tree with an acorn in its cheeks.',
        memoryTip:
          'Picture a squi-RR-el\'s two R\'s racing up a tree trunk, followed by -el at the end!',
      },
      {
        id: 'sp-08',
        word: 'kitten',
        ruleTag: 'Double t',
        trickyPart: 'tt',
        definition: 'A very young baby cat that loves to chase yarn and take sunny naps.',
        contextSentence:
          'The tiny orange ___ curled up inside the laundry basket and began to purr.',
        memoryTip: 'Short I needs twin T\'s—ki-TT-en—just like mitten!',
      },
      {
        id: 'sp-09',
        word: 'rabbit',
        ruleTag: 'Double b',
        trickyPart: 'bb',
        definition: 'A furry hopping animal with long upright ears and a fluffy short tail.',
        contextSentence:
          'A white ___ hopped across the clover patch and twitched its pink nose.',
        memoryTip:
          'A ra-BB-it has two tall B\'s sticking up just like its two long ears!',
      },
      {
        id: 'sp-10',
        word: 'sudden',
        ruleTag: 'Double d',
        trickyPart: 'dd',
        definition: 'Happening very quickly and without any warning.',
        contextSentence:
          'A ___ clap of thunder made everyone jump during our afternoon picnic.',
        memoryTip:
          'Double the D in su-DD-en so the U stays short ("suh-den", not "soo-den")!',
      },
    ],
  },
  {
    id: 'en-spell-t1-03',
    tier: 1,
    title: 'Long Vowel Teams',
    subtitle: 'Letter teams that work together to say a long vowel',
    badge: 'Vowel Teams',
    emblemCollectibleId: 'sweet-honey-toast',
    items: [
      {
        id: 'sp-11',
        word: 'beach',
        ruleTag: 'ea vowel team',
        trickyPart: 'ea',
        definition: 'A sandy or pebbly shore right next to the ocean or a large lake.',
        contextSentence:
          'We collected smooth seashells along the sunny ___ before the tide came in.',
        memoryTip:
          'The sea meets the b-EA-ch—both "sea" and "beach" share the EA vowel team!',
      },
      {
        id: 'sp-12',
        word: 'toast',
        ruleTag: 'oa vowel team',
        trickyPart: 'oa',
        definition: 'Sliced bread heated until it turns warm, crisp, and golden brown.',
        contextSentence:
          'Dad spread strawberry jam over a warm slice of cinnamon ___ for breakfast.',
        memoryTip: 'When O and A go walking in t-OA-st, the O does the talking!',
      },
      {
        id: 'sp-13',
        word: 'float',
        ruleTag: 'oa vowel team',
        trickyPart: 'oa',
        definition: 'To rest gently on top of water or drift smoothly through the air.',
        contextSentence:
          'Rubber ducks always ___ happily on top of the bubble bath water.',
        memoryTip:
          'A b-OA-t can fl-OA-t—both words use the OA team for the long O sound!',
      },
      {
        id: 'sp-14',
        word: 'bright',
        ruleTag: 'igh vowel team',
        trickyPart: 'igh',
        definition: 'Giving off lots of shining light, or vivid and glowing with color.',
        contextSentence:
          'We wore sunglasses because the morning sun was extra ___ over the snow.',
        memoryTip:
          'The silent GH hides inside br-IGH-t to make the I shine long and strong, just like light!',
      },
      {
        id: 'sp-15',
        word: 'coach',
        ruleTag: 'oa vowel team',
        trickyPart: 'oa',
        definition: 'A leader who trains and encourages athletes or players on a sports team.',
        contextSentence:
          'Our soccer ___ blew her whistle and cheered as we practiced corner kicks.',
        memoryTip:
          'A c-OA-ch helps you score a g-OA-l—both use the OA vowel team!',
      },
    ],
  },
  {
    id: 'en-spell-t1-04',
    tier: 1,
    title: 'Tricky -ck & -dge',
    subtitle: 'Protect short vowels with -ck and -dge endings',
    badge: '-ck / -dge',
    emblemCollectibleId: 'critter-otter-mage',
    items: [
      {
        id: 'sp-16',
        word: 'bridge',
        ruleTag: 'Short vowel + dge',
        trickyPart: 'dge',
        definition: 'A structure built over a river, valley, or road so people and cars can cross.',
        contextSentence:
          'We paused halfway across the wooden ___ to watch red koi fish swimming below.',
        memoryTip:
          'Right after a short vowel, the /j/ sound wears a D guard: bri-DGE!',
      },
      {
        id: 'sp-17',
        word: 'badge',
        ruleTag: 'Short vowel + dge',
        trickyPart: 'dge',
        definition: 'A small pin, patch, or emblem worn to show an achievement or group membership.',
        contextSentence:
          'After learning to tie five knots, Emma sewed a new scouting ___ onto her sash.',
        memoryTip: 'Short A needs a D to guard the G—ba-DGE, never "bage"!',
      },
      {
        id: 'sp-18',
        word: 'clock',
        ruleTag: 'Short vowel + ck',
        trickyPart: 'ck',
        definition: 'A device with numbers and moving hands or digits that tells the time of day.',
        contextSentence:
          'Everyone glanced up at the classroom wall ___ as recess time approached.',
        memoryTip:
          'Right after a short O in a one-syllable word, use CK together: clo-CK!',
      },
      {
        id: 'sp-19',
        word: 'jacket',
        ruleTag: 'Short vowel + ck',
        trickyPart: 'ck',
        definition: 'A short coat with sleeves worn to stay warm or dry outside.',
        contextSentence:
          'Zoe zipped up her waterproof rain ___ before walking to the school bus stop.',
        memoryTip:
          'Short A in the first syllable calls for CK—ja-CK-et—just like packet and rocket!',
      },
      {
        id: 'sp-20',
        word: 'pocket',
        ruleTag: 'Short vowel + ck',
        trickyPart: 'ck',
        definition: 'A small fabric pouch sewn into pants, a coat, or a bag for carrying little items.',
        contextSentence:
          'I tucked my lucky quartz pebble safely inside my jeans ___ before gym class.',
        memoryTip:
          'Short O pairs with CK in po-CK-et, rhyming with locket and rocket!',
      },
    ],
  },

  // ═══════════ TIER 2: SUFFIXES, SILENT GH & HOMOPHONES (4 sets · 20 words) ═══════════
  {
    id: 'en-spell-t2-01',
    tier: 2,
    title: '-tion & -sion',
    subtitle: 'Master the two classic /shun/ and /zhun/ endings',
    badge: '-tion / -sion',
    emblemCollectibleId: 'space-astro-corgi',
    items: [
      {
        id: 'sp-21',
        word: 'station',
        ruleTag: '-tion ending',
        trickyPart: 'tion',
        definition: 'A place where trains, buses, or emergency vehicles stop and operate.',
        contextSentence:
          'Our commuter train rolled smoothly into the downtown ___ right on schedule.',
        memoryTip:
          'Hear /shun/ at the end of sta-TION? Most everyday /shun/ words end in T-I-O-N!',
      },
      {
        id: 'sp-22',
        word: 'vacation',
        ruleTag: '-tion ending',
        trickyPart: 'tion',
        definition: 'A special break from school or work spent relaxing or traveling.',
        contextSentence:
          'Our family packed snorkel gear for a weeklong summer ___ in Hawaii.',
        memoryTip: 'Break it into three clean beats: va-ca-TION—ends with T-I-O-N!',
      },
      {
        id: 'sp-23',
        word: 'direction',
        ruleTag: '-tion ending',
        trickyPart: 'tion',
        definition: 'The path or way in which someone or something moves or points.',
        contextSentence:
          'The compass needle pointed north to show us which ___ to hike next.',
        memoryTip:
          'Build it straight from the base word "direct" + "-ion" = direc-TION!',
      },
      {
        id: 'sp-24',
        word: 'decision',
        ruleTag: '-sion ending',
        trickyPart: 'sion',
        definition: 'A final choice made after thinking carefully about your options.',
        contextSentence:
          'Choosing between art club and robotics was a tough ___ for Sofia.',
        memoryTip:
          'Listen for the buzzy /zhun/ sound—deci-SION comes from "decide" and uses S-I-O-N!',
      },
      {
        id: 'sp-25',
        word: 'mission',
        ruleTag: '-ssion ending',
        trickyPart: 'ssion',
        definition: 'An important goal or special assignment that a person or team sets out to complete.',
        contextSentence:
          'NASA engineers cheered as the lunar rover began its science ___ on the Moon.',
        memoryTip:
          'Snap the letters "miss" + "-ion" to remember the twin S\'s: mi-SSION!',
      },
    ],
  },
  {
    id: 'en-spell-t2-02',
    tier: 2,
    title: '-igh & -ought',
    subtitle: 'Tame silent GH patterns in action and time words',
    badge: 'Silent GH',
    emblemCollectibleId: 'critter-moon-owl',
    items: [
      {
        id: 'sp-26',
        word: 'flight',
        ruleTag: '-igh pattern',
        trickyPart: 'igh',
        definition: 'A trip through the sky on an airplane, or the act of flying with wings.',
        contextSentence:
          'Our evening ___ to Seattle landed ten minutes ahead of schedule.',
        memoryTip:
          'FL + IGHT = fl-IGH-t! The silent GH helps I say its own name.',
      },
      {
        id: 'sp-27',
        word: 'midnight',
        ruleTag: '-igh pattern',
        trickyPart: 'igh',
        definition: '12:00 a.m., the exact middle of the dark hours when one day ends and the next begins.',
        contextSentence:
          'On New Year\'s Eve, we stayed awake until ___ to watch the fireworks sparkle.',
        memoryTip:
          'Mid + night = midn-IGH-t—keep the silent GH tucked inside "night"!',
      },
      {
        id: 'sp-28',
        word: 'thought',
        ruleTag: '-ought pattern',
        trickyPart: 'ought',
        definition: 'An idea in your mind, or the past tense of using your brain to consider something.',
        contextSentence:
          'Hannah ___ carefully about the riddle before raising her hand with the answer.',
        memoryTip:
          'Think turns into th-OUGHT! Use O-U-G-H-T, just like bought and fought.',
      },
      {
        id: 'sp-29',
        word: 'brought',
        ruleTag: '-ought pattern',
        trickyPart: 'ought',
        definition: 'Carried or took someone or something along to a place in the past.',
        contextSentence:
          'Grandma ___ a basket of warm blueberry muffins to our weekend soccer game.',
        memoryTip:
          'BRing turns into BR-OUGHT! Both start with BR, and "brought" uses O-U-G-H-T.',
      },
      {
        id: 'sp-30',
        word: 'caught',
        ruleTag: '-aught pattern',
        trickyPart: 'aught',
        definition: 'Grabbed and held onto something moving through the air in the past.',
        contextSentence:
          'The outfielder leaped high and ___ the fly ball right before it hit the fence.',
        memoryTip:
          'CAtch has an A, so c-AUGHT keeps the A too (unlike brought and thought)!',
      },
    ],
  },
  {
    id: 'en-spell-t2-03',
    tier: 2,
    title: 'Soft C & G',
    subtitle: 'Spot when C sounds like /s/ and G sounds like /j/',
    badge: 'Soft C / G',
    emblemCollectibleId: 'critter-red-panda',
    items: [
      {
        id: 'sp-31',
        word: 'pencil',
        ruleTag: 'Soft c before i',
        trickyPart: 'ci',
        definition: 'A slender wooden writing tool with a graphite core and an eraser on top.',
        contextSentence:
          'Before the math quiz began, I sharpened my favorite yellow ___ to a neat point.',
        memoryTip:
          'C softens to /s/ right before E, I, or Y—so pen-CI-l uses C-I, never S!',
      },
      {
        id: 'sp-32',
        word: 'bicycle',
        ruleTag: 'Soft c before y',
        trickyPart: 'cy',
        definition: 'A two-wheeled vehicle powered by pedaling with your feet.',
        contextSentence:
          'Liam strapped on his helmet and rode his blue ___ along the park trail.',
        memoryTip:
          '"Bi" means two wheels, and "cycle" starts with soft C before Y: bi-CY-cle!',
      },
      {
        id: 'sp-33',
        word: 'giraffe',
        ruleTag: 'Soft g + double f',
        trickyPart: 'gi',
        definition: 'The tallest land mammal on Earth, famous for its long spotted neck.',
        contextSentence:
          'At the zoo, a tall ___ stretched its neck to nibble fresh leaves from the treetop.',
        memoryTip:
          'G turns soft like /j/ before I in GI-raffe—and don\'t forget the two F\'s and silent E at the end!',
      },
      {
        id: 'sp-34',
        word: 'gentle',
        ruleTag: 'Soft g before e',
        trickyPart: 'ge',
        definition: 'Calm, kind, and careful, using a soft touch without being rough.',
        contextSentence:
          'Be extra ___ when holding the newly hatched baby chick in your palms.',
        memoryTip:
          'G sounds like /j/ right before E—GE-ntle ends in -tle just like turtle!',
      },
      {
        id: 'sp-35',
        word: 'circle',
        ruleTag: 'Soft c + hard c',
        trickyPart: 'ci',
        definition: 'A perfectly round flat shape with no corners or straight sides.',
        contextSentence:
          'Our class sat together in a wide ___ on the rug for story time.',
        memoryTip:
          'The first C is soft before I (CI-r), and the second C is hard before L (-cle): CI-r-cle!',
      },
    ],
  },
  {
    id: 'en-spell-t2-04',
    tier: 2,
    title: 'Homophones I',
    subtitle: 'Sound-alike twins that mean totally different things',
    badge: 'Sound-Alikes',
    emblemCollectibleId: 'sweet-matcha-mochi',
    items: [
      {
        id: 'sp-36',
        word: 'weather',
        ruleTag: 'Homophone (ea)',
        trickyPart: 'ea',
        definition: 'Outdoor conditions like sunshine, rain, snow, wind, and temperature.',
        contextSentence:
          'We checked the morning ___ forecast to see if it would rain during field day.',
        memoryTip:
          'Remember w-EA-ther has EA like "h-EA-t"—both describe sunny or stormy skies!',
      },
      {
        id: 'sp-37',
        word: 'whether',
        ruleTag: 'Homophone (wh)',
        trickyPart: 'wh',
        definition: 'A connecting word used when choosing between two possibilities or options.',
        contextSentence:
          'Nora couldn\'t decide ___ to paint a glowing galaxy or a coral reef for art class.',
        memoryTip:
          'WH-ether starts with WH like the question words "what," "which," and "where"—use it for choices!',
      },
      {
        id: 'sp-38',
        word: 'piece',
        ruleTag: 'Homophone (ie)',
        trickyPart: 'ie',
        definition: 'A single portion, slice, or part separated from a larger whole.',
        contextSentence:
          'May I please have one more ___ of apple pie with vanilla ice cream?',
        memoryTip:
          'Want a PIE-ce of PIE? The word "pie" is hiding right inside p-IE-ce!',
      },
      {
        id: 'sp-39',
        word: 'peace',
        ruleTag: 'Homophone (ea)',
        trickyPart: 'ea',
        definition: 'A calm, quiet state of harmony with no fighting, anger, or loud noise.',
        contextSentence:
          'After the noisy parade ended, the quiet garden felt full of calm and ___.',
        memoryTip:
          'Picture eating sweet p-EA-s in p-EA-ce and quiet—both use E-A!',
      },
      {
        id: 'sp-40',
        word: 'heard',
        ruleTag: 'Homophone (ear)',
        trickyPart: 'ear',
        definition: 'Listened to or noticed a sound in the past.',
        contextSentence:
          'We ___ the cheerful chime of the ice cream truck rolling down our street.',
        memoryTip:
          'You listen with your EAR—and the word "ear" is tucked right inside h-EAR-d (not a "herd" of cows)!',
      },
    ],
  },

  // ═══════════ TIER 3: MULTI-SYLLABLE & ADVANCED RULES (4 sets · 20 words) ═══════════
  {
    id: 'en-spell-t3-01',
    tier: 3,
    title: 'Double Consonants II',
    subtitle: 'Spot which consonants double in longer words',
    badge: 'Double Patrol',
    emblemCollectibleId: 'sweet-boba-bear',
    items: [
      {
        id: 'sp-41',
        word: 'beginning',
        ruleTag: 'Double n',
        trickyPart: 'nn',
        definition: 'The very start or opening part of a story, event, or journey.',
        contextSentence:
          'From the very ___ of the mystery novel, Ava suspected the butler hid the key.',
        memoryTip:
          'Start with "begin" and double the N before adding -ing: begi-NN-ing!',
      },
      {
        id: 'sp-42',
        word: 'different',
        ruleTag: 'Double f + er',
        trickyPart: 'ff',
        definition: 'Not the same as another person, place, or thing.',
        contextSentence:
          'Every snowflake under the microscope has a completely ___ six-sided crystal pattern.',
        memoryTip:
          'Don\'t skip the middle syllable: di-FF-er-ent has two F\'s and "er" right in the center!',
      },
      {
        id: 'sp-43',
        word: 'tomorrow',
        ruleTag: 'One m, double r',
        trickyPart: 'morr',
        definition: 'The calendar day that comes directly after today.',
        contextSentence:
          'Our science museum field trip starts at eight o\'clock sharp ___ morning.',
        memoryTip:
          'Tom + or + row = to-MORR-ow! Only ONE M, and TWO R\'s!',
      },
      {
        id: 'sp-44',
        word: 'disappear',
        ruleTag: 'One s, double p',
        trickyPart: 'pp',
        definition: 'To vanish suddenly from sight so no one can see you anymore.',
        contextSentence:
          'With a swirl of her purple cape, the stage magician made the silver coin ___.',
        memoryTip:
          'Snap two clean parts together: DIS (just one S) + APPEAR (two P\'s) = disa-PP-ear!',
      },
      {
        id: 'sp-45',
        word: 'impossible',
        ruleTag: 'Double s + -ible',
        trickyPart: 'ss',
        definition: 'Not able to happen or be done under any circumstances.',
        contextSentence:
          'Without a flashlight, it was almost ___ to spot the tiny brass key in the dark attic.',
        memoryTip:
          'Snap IM + POSSIBLE together—remember the twin S\'s and -ible: impo-SS-ible!',
      },
    ],
  },
  {
    id: 'en-spell-t3-02',
    tier: 3,
    title: 'Silent Letters II',
    subtitle: 'Uncover sneaky silent letters in G4–5 vocabulary',
    badge: 'Stealth Letters',
    emblemCollectibleId: 'critter-crystal-fox',
    items: [
      {
        id: 'sp-46',
        word: 'answer',
        ruleTag: 'Silent w',
        trickyPart: 'sw',
        definition: 'A reply to a question, or the correct solution to a problem.',
        contextSentence:
          'After double-checking her multiplication, Mia wrote the final ___ on the whiteboard.',
        memoryTip:
          'Say it like a robot in your head to remember the silent W: "an-SW-er"!',
      },
      {
        id: 'sp-47',
        word: 'honest',
        ruleTag: 'Silent h',
        trickyPart: 'ho',
        definition: 'Always telling the truth and acting fairly without cheating or lying.',
        contextSentence:
          'Everyone trusted Elena because she was always ___ even when admitting a mistake.',
        memoryTip:
          'HO-nest starts with a silent H just like "hour" and "honor"—that\'s why we say "an honest friend"!',
      },
      {
        id: 'sp-48',
        word: 'autumn',
        ruleTag: 'Silent n',
        trickyPart: 'mn',
        definition: 'The cool fall season between summer and winter when tree leaves change color.',
        contextSentence:
          'Crisp ___ breezes sent red and gold maple leaves swirling across the playground.',
        memoryTip:
          'The silent N hides at the end of autu-MN—hear it wake up in the cousin word "autumnal"!',
      },
      {
        id: 'sp-49',
        word: 'rhythm',
        ruleTag: 'Silent h + y',
        trickyPart: 'rhy',
        definition: 'A steady, repeating beat or pattern of sounds in music or poetry.',
        contextSentence:
          'Our marching band drummers clapped together to keep a steady ___ during the parade.',
        memoryTip:
          'Chant "Rhythm Helps Your Two Hips Move!"—notice R-H-Y-T-H-M has Y as its only vowel!',
      },
      {
        id: 'sp-50',
        word: 'column',
        ruleTag: 'Silent n',
        trickyPart: 'mn',
        definition: 'A tall upright pillar supporting a building, or a vertical line of numbers in a chart.',
        contextSentence:
          'Line up the ones digits in the right-hand ___ before adding the two big numbers.',
        memoryTip:
          'Just like autumn, colu-MN ends with a silent N after M—you can hear it in "columnist"!',
      },
    ],
  },
  {
    id: 'en-spell-t3-03',
    tier: 3,
    title: '-able & -ible',
    subtitle: 'Choose the right suffix for "can be" describing words',
    badge: '-able / -ible',
    emblemCollectibleId: 'sweet-mint-gelato',
    items: [
      {
        id: 'sp-51',
        word: 'comfortable',
        ruleTag: '-able suffix',
        trickyPart: 'able',
        definition: 'Soft, cozy, and pleasant to wear, sit on, or relax in.',
        contextSentence:
          'After hiking three miles, I slipped into my most ___ fuzzy slippers at home.',
        memoryTip:
          '"Comfort" is a full word on its own, so attach -ABLE: comfort-ABLE!',
      },
      {
        id: 'sp-52',
        word: 'incredible',
        ruleTag: '-ible suffix',
        trickyPart: 'ible',
        definition: 'So amazing, surprising, or extraordinary that it is hard to believe.',
        contextSentence:
          'The gymnasts pulled off an ___ triple flip that brought the whole crowd to its feet.',
        memoryTip:
          '"Incred" isn\'t a standalone word, so it takes -IBLE: incred-IBLE!',
      },
      {
        id: 'sp-53',
        word: 'invisible',
        ruleTag: '-ible suffix',
        trickyPart: 'ible',
        definition: 'Unable to be seen with your eyes, as if completely hidden from view.',
        contextSentence:
          'We wrote secret spy notes with lemon juice that stayed ___ until held near a warm lamp.',
        memoryTip:
          'Just like "visible," the Latin root vis- takes -IBLE: invis-IBLE!',
      },
      {
        id: 'sp-54',
        word: 'valuable',
        ruleTag: 'Drop e + -able',
        trickyPart: 'uable',
        definition: 'Worth a great deal of money, or deeply important and useful.',
        contextSentence:
          'The museum kept the ancient golden crown inside a locked glass case because it was so ___.',
        memoryTip:
          'Take "value," drop the silent E, and add -ABLE: val-UABLE!',
      },
      {
        id: 'sp-55',
        word: 'responsible',
        ruleTag: '-ible suffix',
        trickyPart: 'ible',
        definition: 'Trustworthy and dependable about taking care of duties and promises.',
        contextSentence:
          'As class pet helper, Marcus was ___ for giving the guinea pig fresh water every morning.',
        memoryTip:
          '"Respons" isn\'t a complete word without its E, so snap on -IBLE: respons-IBLE!',
      },
    ],
  },
  {
    id: 'en-spell-t3-04',
    tier: 3,
    title: 'Homophones & Look-Alikes',
    subtitle: 'Conquer famous G4 sound-alike and look-alike traps with context clues',
    badge: 'Trap Boss',
    emblemCollectibleId: 'sweet-berry-shortcake',
    items: [
      {
        id: 'sp-56',
        word: 'through',
        ruleTag: 'Homophone (ough)',
        trickyPart: 'ough',
        definition: 'Moving in one side of a space or tunnel and coming out the other side.',
        contextSentence:
          'The bright yellow subway train zoomed ___ the underground tunnel toward the city.',
        memoryTip:
          'Thr-OUGH goes all the way through a long tunnel of letters—O-U-G-H!',
      },
      {
        id: 'sp-57',
        word: 'threw',
        ruleTag: 'Homophone (ew)',
        trickyPart: 'ew',
        definition: 'Tossed or launched something into the air with your arm in the past.',
        contextSentence:
          'The pitcher wound up and ___ a fastball straight across home plate.',
        memoryTip:
          'Throw becomes thr-EW! It shares the -EW ending with "blew," "flew," and "grew"—all past actions!',
      },
      {
        id: 'sp-58',
        word: 'desert',
        ruleTag: 'One s (dry land)',
        trickyPart: 'ser',
        definition: 'A vast, dry region of sand or rock that gets very little rainfall.',
        contextSentence:
          'Tall saguaro cacti store rainwater to survive in the scorching Arizona ___.',
        memoryTip:
          'A hot de-SER-t has only ONE S, just like one lonely cactus in the Sand!',
      },
      {
        id: 'sp-59',
        word: 'dessert',
        ruleTag: 'Double s (sweet)',
        trickyPart: 'ss',
        definition: 'A sweet treat such as cake, fruit tart, or ice cream served after a meal.',
        contextSentence:
          'After finishing our spaghetti dinner, we shared warm brownies and ice cream for ___.',
        memoryTip:
          'De-SS-ert has two S\'s because you always want Seconds of something Sweet!',
      },
      {
        id: 'sp-60',
        word: 'principal',
        ruleTag: 'Ends in -pal',
        trickyPart: 'pal',
        definition: 'The head leader who runs an elementary, middle, or high school.',
        contextSentence:
          'Our school ___ announced the spelling bee winners over the morning loudspeaker.',
        memoryTip:
          'Your school princi-PAL is your PAL! ("Principle" with -le means a rule.)',
      },
    ],
  },

  // ═══════════ TIER 4: SPELLING BEE FINALS & ACADEMIC G4–5 (4 sets · 20 words) ═══════════
  {
    id: 'en-spell-t4-01',
    tier: 4,
    title: '-ough & -eigh',
    subtitle: 'Decode English\'s trickiest silent-GH vowel teams',
    badge: '-ough / -eigh',
    emblemCollectibleId: 'space-saturn-cat',
    items: [
      {
        id: 'sp-61',
        word: 'neighbor',
        ruleTag: '-eigh says /ay/',
        trickyPart: 'eigh',
        definition: 'A person who lives in a house or apartment right next door or on your street.',
        contextSentence:
          'Our friendly next-door ___ watered our garden flowers while we visited Grandma.',
        memoryTip:
          '"I before E, except when sounded as A, as in n-EIGH-bor and weigh"—plus -or at the end!',
      },
      {
        id: 'sp-62',
        word: 'weight',
        ruleTag: '-eigh says /ay/',
        trickyPart: 'eigh',
        definition: 'How heavy a person, animal, or object is when measured on a scale.',
        contextSentence:
          'The veterinarian checked our puppy\'s ___ on the clinic scale before her checkup.',
        memoryTip:
          'W-EIGH-t comes from "weigh" + T, using E-I-G-H for the long A sound (unlike "wait" in line)!',
      },
      {
        id: 'sp-63',
        word: 'thorough',
        ruleTag: '-ough says /oh/',
        trickyPart: 'ough',
        definition: 'Careful and complete, checking every single detail without missing anything.',
        contextSentence:
          'Before turning in her book report, Claire did a ___ proofread of every paragraph.',
        memoryTip:
          'Think "THOR-OUGH"—it adds an O after H compared to "through," and ends with O-U-G-H sounding like /oh/!',
      },
      {
        id: 'sp-64',
        word: 'although',
        ruleTag: 'One l + -ough',
        trickyPart: 'ough',
        definition: 'In spite of the fact that; a connecting word showing a surprising contrast between two ideas.',
        contextSentence:
          'We still went kayaking on the calm lake ___ a cool gray mist hovered overhead.',
        memoryTip:
          'Drop one L from "all" and add "though": al-th-OUGH (just one L, then O-U-G-H)!',
      },
      {
        id: 'sp-65',
        word: 'enough',
        ruleTag: '-ough says /uff/',
        trickyPart: 'ough',
        definition: 'As much or as many as needed, with nothing lacking.',
        contextSentence:
          'Did we pack ___ granola bars and water bottles for everyone on the trail?',
        memoryTip:
          'In en-OUGH, rough, and tough, O-U-G-H surprises you by sounding like /uff/!',
      },
    ],
  },
  {
    id: 'en-spell-t4-02',
    tier: 4,
    title: '-cious & -tious',
    subtitle: 'Build vivid adjectives with -cious, -tious, and -ious',
    badge: '-ious Squad',
    emblemCollectibleId: 'sweet-macaron-unicorn',
    items: [
      {
        id: 'sp-66',
        word: 'delicious',
        ruleTag: '-cious ending',
        trickyPart: 'cious',
        definition: 'Tasting or smelling wonderfully good and enjoyable to eat.',
        contextSentence:
          'The freshly made mango sorbet tasted so ___ that we asked the chef for the recipe.',
        memoryTip:
          'Say "de-li-CIOUS"—use C-I-O-U-S for the /shus/ ending, just like "precious"!',
      },
      {
        id: 'sp-67',
        word: 'curious',
        ruleTag: '-ious ending',
        trickyPart: 'ious',
        definition: 'Eager to explore, ask questions, and learn new things.',
        contextSentence:
          'The ___ puppy poked its nose into every cardboard box on moving day.',
        memoryTip:
          'No C or T needed before -IOUS here—just cur-IOUS (say "cure-ee-us")!',
      },
      {
        id: 'sp-68',
        word: 'ambitious',
        ruleTag: '-tious ending',
        trickyPart: 'tious',
        definition: 'Determined to work hard and reach big, challenging goals.',
        contextSentence:
          'Building a solar-powered model racecar in two weeks was an ___ science fair project.',
        memoryTip:
          'Link it to "ambi-TION"! Words from -tion nouns swap -tion for -TIOUS: ambi-TIOUS!',
      },
      {
        id: 'sp-69',
        word: 'cautious',
        ruleTag: '-tious ending',
        trickyPart: 'tious',
        definition: 'Careful to look out for danger and avoid risky mistakes.',
        contextSentence:
          'Be ___ when stepping across the wet mossy rocks near the creek.',
        memoryTip:
          'Link it to "cau-TION"! Swap -tion for -TIOUS to spell cau-TIOUS!',
      },
      {
        id: 'sp-70',
        word: 'precious',
        ruleTag: '-cious ending',
        trickyPart: 'cious',
        definition: 'Rare, cherished, or worth a great deal of care and love.',
        contextSentence:
          'Grandma kept her mother\'s ___ pearl locket wrapped in soft velvet.',
        memoryTip:
          'Pre-CIOUS uses C-I-O-U-S just like "delicious"—picture a treasure C-hest full of gems!',
      },
    ],
  },
  {
    id: 'en-spell-t4-03',
    tier: 4,
    title: 'Academic G4–5',
    subtitle: 'Power-up science and social studies report words',
    badge: 'Academic Star',
    emblemCollectibleId: 'critter-sun-phoenix',
    items: [
      {
        id: 'sp-71',
        word: 'environment',
        ruleTag: 'Keep n in -ron-',
        trickyPart: 'ron',
        definition: 'The natural world of air, water, land, plants, and animals around us.',
        contextSentence:
          'Recycling plastic bottles and planting trees helps protect our local ___ for wildlife.',
        memoryTip:
          'Find the word "IRON" hiding inside env-IRON-ment so you never drop the N!',
      },
      {
        id: 'sp-72',
        word: 'experiment',
        ruleTag: '-peri- + -ment',
        trickyPart: 'peri',
        definition: 'A carefully planned scientific test done to discover or prove how something works.',
        contextSentence:
          'Our class tested how fast ice melts in salt water during Friday\'s lab ___.',
        memoryTip:
          'Break it into four clear beats: ex-PER-i-ment—keep E-R-I in the middle, just like "experience"!',
      },
      {
        id: 'sp-73',
        word: 'government',
        ruleTag: 'Keep n in govern',
        trickyPart: 'ern',
        definition: 'The elected leaders and system of laws that guide a city, state, or country.',
        contextSentence:
          'In social studies, we learned how the three branches of the U.S. ___ share power.',
        memoryTip:
          'Start with the full verb "GOVERN" and add -ment: gov-ERN-ment—never skip that sneaky N!',
      },
      {
        id: 'sp-74',
        word: 'temperature',
        ruleTag: 'Hidden -era- syllable',
        trickyPart: 'era',
        definition: 'A measurement of how hot or cold something is, usually in degrees.',
        contextSentence:
          'The outdoor thermometer showed the afternoon ___ had climbed to eighty-two degrees.',
        memoryTip:
          'Don\'t swallow the middle! Say all four beats: tem-p-ERA-ture—it hides "ERA" inside!',
      },
      {
        id: 'sp-75',
        word: 'celebration',
        ruleTag: 'Soft c + -bration',
        trickyPart: 'celeb',
        definition: 'A joyful gathering or special event to honor a happy achievement or holiday.',
        contextSentence:
          'Everyone cheered with glowing paper lanterns during the Lunar New Year ___ downtown.',
        memoryTip:
          'Think "CELEB + RATION" = CELEB-ration! Soft C starts it, and -TION finishes the party!',
      },
    ],
  },
  {
    id: 'en-spell-t4-04',
    tier: 4,
    title: 'Spelling Bee Finals',
    subtitle: 'Beat the top five champion-level spelling traps',
    badge: 'Bee Champion',
    emblemCollectibleId: 'critter-chroma-dragon',
    items: [
      {
        id: 'sp-76',
        word: 'necessary',
        ruleTag: 'One c, double s',
        trickyPart: 'cess',
        definition: 'Truly needed or essential in order to do something properly.',
        contextSentence:
          'A sturdy helmet and bright bike lights are ___ for riding safely at dusk.',
        memoryTip:
          'Think of a shirt: 1 Collar and 2 Sleeves = 1 C and 2 S\'s in ne-CESS-ary!',
      },
      {
        id: 'sp-77',
        word: 'separate',
        ruleTag: '"a rat" in middle',
        trickyPart: 'arat',
        definition: 'To divide or keep things apart from one another, or not joined together.',
        contextSentence:
          'Please ___ the white laundry from the bright red sweaters before starting the washer.',
        memoryTip:
          'There is "A RAT" hiding right in the middle of sep-ARAT-e: sep-a-rat-e!',
      },
      {
        id: 'sp-78',
        word: 'calendar',
        ruleTag: 'Ends in -ar',
        trickyPart: 'dar',
        definition: 'A chart showing all the days, weeks, and months of a year.',
        contextSentence:
          'I circled my birthday and the spring concert in purple ink on our kitchen wall ___.',
        memoryTip:
          'A calen-DAR ends in -DAR, not -der—remember A-E-A for the vowels in cAlEndAr!',
      },
      {
        id: 'sp-79',
        word: 'restaurant',
        ruleTag: 'Tricky -au- in middle',
        trickyPart: 'aur',
        definition: 'A place where chefs cook meals and servers bring food to customers at tables.',
        contextSentence:
          'To celebrate Grandpa\'s retirement, our whole family ate noodles at his favorite Thai ___.',
        memoryTip:
          'Break it into three parts: REST + AU + RANT = rest-AUR-ant (watch that sneaky AU)!',
      },
      {
        id: 'sp-80',
        word: 'library',
        ruleTag: 'Two r\'s (-brary)',
        trickyPart: 'brary',
        definition: 'A quiet building or room filled with books and media that people can read or borrow.',
        contextSentence:
          'Every Saturday morning, I check out three graphic novels from our neighborhood ___.',
        memoryTip:
          'Say BOTH R\'s clearly—li-BRARY, never "liberry"! Think of two R\'s for Reading!',
      },
    ],
  },
];

export function getSpellingSetsByTier(tier: DifficultyTier): SpellingSet[] {
  return ENGLISH_SPELLING_SETS.filter((set) => set.tier === tier);
}

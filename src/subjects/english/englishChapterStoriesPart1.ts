import type { EnglishChapterSeries } from './englishChapterTypes';

export const ENGLISH_CHAPTER_SERIES_PART1: EnglishChapterSeries[] = [
  // ═══════════ SERIES 1 (TIER 1): THE LOCKER-ROOM MYSTERY CLUB ═══════════
  {
    id: 'en-ch-mystery',
    tier: 1,
    title: 'The Locker-Room Mystery Club',
    subtitle: 'Case of the Missing Golden Metronome',
    genreTag: 'School Mystery',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    emblemCollectibleId: 'critter-crystal-fox',
    synopsis:
      'Fourth-graders Maya and Zoe launch a detective mission when the music room’s shiny golden metronome vanishes right before the spring concert.',
    episodes: [
      {
        id: 'en-ch-mystery-ep1',
        episodeNumber: 1,
        title: 'The Silent Music Room',
        cliffhanger:
          'Who at Maplewood Elementary puts purple star stickers on sheet music? Maya and Zoe follow the paper trail down the hall!',
        paragraphs: [
          'On Thursday afternoon, fourth-grader Maya Chen and her best friend Zoe Patel hurried into Room 104 to help Mr. Ortiz set up music stands for tomorrow’s spring concert. Usually, the music room hummed with cheerful songs, but today Mr. Ortiz stood frozen beside the grand piano.',
          'The dark blue velvet box on top of the piano was completely empty. Maplewood Elementary’s prized golden metronome—the brass ticker that kept the whole choir on a steady beat—had vanished since lunchtime. Mr. Ortiz checked under the piano bench and inside his desk drawer, yet he found nothing.',
          'Maya knelt near the carpet and spotted three tiny torn scraps of sheet music forming a neat line toward the hallway door. Every scrap had a shiny purple star sticker pressed into its top corner.',
          'Zoe clicked her favorite green pen and flipped open her spiral notebook. "We have our first real clue," she whispered. "The Locker-Room Mystery Club is officially on the case!"',
        ],
        keyVocab: [
          {
            word: 'prized',
            meaning: 'valued very highly and treated as special',
          },
          {
            word: 'metronome',
            meaning: 'a clicking device that helps musicians keep a steady beat',
          },
          {
            word: 'scraps',
            meaning: 'small torn pieces left over from something larger',
          },
        ],
        questions: [
          {
            id: 'en-ch-mystery-ep1-q1',
            skillTag: 'Detail',
            prompt: 'Where was the golden metronome supposed to be stored?',
            choices: [
              'Inside a cardboard box in the hallway closet',
              'Inside the dark blue velvet box on top of the piano',
              'On the bottom shelf of Zoe’s school locker',
              'Behind the stack of folded music stands',
            ],
            correctIndex: 1,
            explanation:
              'Paragraph 2 states that the dark blue velvet box on top of the piano was completely empty because the golden metronome had vanished.',
          },
          {
            id: 'en-ch-mystery-ep1-q2',
            skillTag: 'Vocabulary',
            prompt: 'In the second paragraph, what does the word "prized" mean?',
            choices: [
              'Broken and too old to use',
              'Hidden deep underground',
              'Borrowed from a different town',
              'Valued very highly and treated as special',
            ],
            correctIndex: 3,
            explanation:
              'The school kept the golden metronome in a velvet box to guide the whole choir, showing that "prized" means valued very highly and treated as special.',
          },
          {
            id: 'en-ch-mystery-ep1-q3',
            skillTag: 'Inference',
            prompt: 'Why are Maya and Zoe excited to find the torn scraps of sheet music?',
            choices: [
              'The scraps form a trail leaving the room and may lead to whoever took the metronome',
              'They need extra paper to write a new song for the spring concert',
              'Mr. Ortiz promised a pizza party to anyone who collects purple stickers',
              'The scraps have the name of the thief written in bold ink',
            ],
            correctIndex: 0,
            explanation:
              'The scraps with purple star stickers lead straight from the music room toward the hallway door, making them a real clue about who left with the metronome.',
          },
        ],
      },
      {
        id: 'en-ch-mystery-ep2',
        episodeNumber: 2,
        title: 'Footprints in Blue Chalk',
        cliffhanger:
          'The powder-blue footprints lead straight into the gym locker hallway—where a strange clicking sound echoes from behind a metal locker door!',
        paragraphs: [
          'Maya and Zoe followed the purple-star scraps past the fourth-grade water fountain until the paper trail ended right outside Ms. Lin’s art studio. Zoe scanned the polished floor and let out a soft gasp.',
          'Faint powder-blue chalk footprints marched across the hallway tiles, turning the corner toward the gym locker hallway. Maya crouched down to study the zigzag tread stamped in the blue dust, then carefully sketched the shoe pattern inside Zoe’s notebook.',
          'The two friends peeked into the art studio and asked Ms. Lin whether anyone had used blue sidewalk chalk today. Ms. Lin smiled while rinsing paintbrushes at the sink. "Oh, yes! Leo Morales stopped by during recess to borrow blue chalk for the spring concert banner," she replied. "He was so excited about his squeaky new sneakers that he nearly hopped out the door."',
          'Maya traded a puzzled glance with Zoe. The auditorium was down the south hall, so why were Leo’s chalky footprints heading straight for the gym lockers?',
        ],
        keyVocab: [
          {
            word: 'faint',
            meaning: 'light, pale, and slightly hard to see',
          },
          {
            word: 'tread',
            meaning: 'the raised grip pattern on the bottom of a shoe',
          },
          {
            word: 'banner',
            meaning: 'a long paper or cloth sign showing a message',
          },
        ],
        questions: [
          {
            id: 'en-ch-mystery-ep2-q1',
            skillTag: 'Detail',
            prompt: 'What new clue do Maya and Zoe discover outside the art studio?',
            choices: [
              'A spilled bucket of yellow poster paint',
              'A torn red ribbon tied to the doorknob',
              'Faint powder-blue chalk footprints on the hallway tiles',
              'A shiny brass key lying next to the water fountain',
            ],
            correctIndex: 2,
            explanation:
              'Paragraph 2 directly states that Maya and Zoe spot faint powder-blue chalk footprints marching across the hallway tiles outside the art studio.',
          },
          {
            id: 'en-ch-mystery-ep2-q2',
            skillTag: 'Character',
            prompt: 'What does sketching the zigzag shoe tread show about Maya?',
            choices: [
              'She is a careful observer who records small details',
              'She wants to design new sneakers for Ms. Lin',
              'She forgot why they were searching the hallway',
              'She is afraid to walk past the fourth-grade lockers',
            ],
            correctIndex: 0,
            explanation:
              'Crouching to examine the zigzag tread and drawing it in the notebook shows that Maya pays close attention to small clues.',
          },
          {
            id: 'en-ch-mystery-ep2-q3',
            skillTag: 'Main Idea',
            prompt: 'What is this episode mainly about?',
            choices: [
              'Ms. Lin teaching fourth-graders how to wash paintbrushes',
              'Zoe losing her favorite notebook near the water fountain',
              'Leo painting a colorful banner inside the auditorium',
              'Maya and Zoe discovering blue chalk footprints that point toward Leo',
            ],
            correctIndex: 3,
            explanation:
              'The episode centers on Maya and Zoe finding blue chalk footprints and learning from Ms. Lin that Leo borrowed blue chalk before the trail headed toward the gym lockers.',
          },
        ],
      },
      {
        id: 'en-ch-mystery-ep3',
        episodeNumber: 3,
        title: 'Tick-Tock Behind Locker 18',
        cliffhanger:
          'Leo is innocent! Who carried something gleaming and gold up toward the school broadcast booth, and why?',
        paragraphs: [
          'Maya and Zoe tiptoed into the quiet gym locker hallway. The blue chalk footprints stopped squarely in front of Locker 18, which had Leo’s name taped to the top. Even stranger, a crisp, rhythmic tick-tock echoed right through the metal air vents.',
          '"Aha! We caught the culprit!" Zoe whispered, certain that the golden metronome was ticking inside. Maya hesitated and shook her head. Leo was always honest and loved helping the school choir—stealing did not sound like him at all.',
          'Just then, Leo jogged around the corner holding a rolled-up concert banner. Looking surprised to see two detectives by his locker, he spun the dial and swung the door wide open. Resting beside his lunchbox was not a metronome, but a round plastic kitchen timer! "I use that to time my jump-rope sprints," Leo laughed.',
          'Leo explained that his loose choir binder had shed torn purple-star sheet-music scraps all the way from Room 104 to the art studio when he went to borrow blue chalk. "Wait," he added thoughtfully, "right after lunch, I saw someone carrying something gleaming and gold upstairs toward the broadcast booth!"',
        ],
        keyVocab: [
          {
            word: 'rhythmic',
            meaning: 'sounding or moving with a regular, repeated beat',
          },
          {
            word: 'certain',
            meaning: 'completely sure without any doubt',
          },
          {
            word: 'sprints',
            meaning: 'short bursts of fast running or exercise',
          },
        ],
        questions: [
          {
            id: 'en-ch-mystery-ep3-q1',
            skillTag: 'Detail',
            prompt: 'What was actually making the ticking sound inside Locker 18?',
            choices: [
              'The school’s missing golden metronome',
              'A round plastic kitchen timer that Leo uses for jump-rope sprints',
              'A broken wristwatch hidden under a gym towel',
              'Mr. Ortiz’s alarm clock from the music room',
            ],
            correctIndex: 1,
            explanation:
              'When Leo opens Locker 18 in Paragraph 3, the girls see a round plastic kitchen timer that Leo uses to time his jump-rope sprints.',
          },
          {
            id: 'en-ch-mystery-ep3-q2',
            skillTag: 'Character',
            prompt: 'How is Maya’s reaction outside Locker 18 different from Zoe’s?',
            choices: [
              'Maya wants to run back to class, while Zoe wants to jump rope',
              'Maya opens the locker by herself, while Zoe waits outside',
              'Zoe immediately assumes Leo is guilty, while Maya doubts it because Leo is honest',
              'Zoe thinks the noise is a timer, while Maya insists it is a choir song',
            ],
            correctIndex: 2,
            explanation:
              'Paragraph 2 shows Zoe whispering that they caught the culprit, whereas Maya hesitates because she knows Leo is always honest.',
          },
          {
            id: 'en-ch-mystery-ep3-q3',
            skillTag: 'Vocabulary',
            prompt: 'In the first paragraph, what does the word "rhythmic" mean?',
            choices: [
              'Having a regular, repeated beat',
              'Too quiet for anyone to hear',
              'Rusty and squeaky like an old door',
              'Spinning rapidly in circles',
            ],
            correctIndex: 0,
            explanation:
              'The steady tick-tock sound coming from the locker vents shows that "rhythmic" means having a regular, repeated beat.',
          },
        ],
      },
      {
        id: 'en-ch-mystery-ep4',
        episodeNumber: 4,
        title: 'Clue in the Broadcast Booth',
        cliffhanger:
          'Someone is backstage with a shiny brass trumpet! Maya, Zoe, and Leo race across the courtyard to crack the case!',
        paragraphs: [
          'Maya, Zoe, and Leo hurried up the stairs to the tiny glass-walled broadcast booth where students read the morning announcements. The wooden door stood slightly ajar, and the twin microphones were switched off.',
          'On the narrow counter beside the sound mixer sat a silver thermos and a crumpled yellow sticky note. Maya smoothed the paper flat and read the handwriting aloud: "Practicing steady beat for tomorrow’s opening fanfare—needed a quieter spot than the hallway! —Mr. G."',
          'Zoe blinked in amazement. "Hold on! Mr. Garcia is our school principal! Why would Principal Garcia walk off with Mr. Ortiz’s golden metronome?"',
          'Before Maya could answer, Leo tapped the booth window and pointed across the sunny courtyard toward the open auditorium doors. Through the tall glass, they spotted a familiar figure standing behind the red stage curtains, raising a gleaming brass trumpet to his lips.',
        ],
        keyVocab: [
          {
            word: 'ajar',
            meaning: 'slightly open rather than closed tightly',
          },
          {
            word: 'fanfare',
            meaning: 'a short, lively tune played to introduce a special event',
          },
          {
            word: 'courtyard',
            meaning: 'an open outdoor area surrounded by school buildings',
          },
        ],
        questions: [
          {
            id: 'en-ch-mystery-ep4-q1',
            skillTag: 'Detail',
            prompt: 'What two items do the kids find beside the sound mixer in the broadcast booth?',
            choices: [
              'A velvet box and a purple star sticker',
              'A blue chalk box and a set of headphones',
              'A brass trumpet and a choir folder',
              'A silver thermos and a crumpled yellow sticky note',
            ],
            correctIndex: 3,
            explanation:
              'Paragraph 2 states that on the counter beside the sound mixer sat a silver thermos and a crumpled yellow sticky note.',
          },
          {
            id: 'en-ch-mystery-ep4-q2',
            skillTag: 'Vocabulary',
            prompt: 'What does the word "ajar" mean in the first paragraph?',
            choices: [
              'Locked with a heavy padlock',
              'Slightly open',
              'Painted bright silver',
              'Blocked by a stack of chairs',
            ],
            correctIndex: 1,
            explanation:
              'The kids were able to look and walk into the booth because the wooden door stood slightly ajar, meaning slightly open.',
          },
          {
            id: 'en-ch-mystery-ep4-q3',
            skillTag: 'Inference',
            prompt:
              'Based on the sticky note and what Leo sees across the courtyard, why did Principal Garcia borrow the metronome?',
            choices: [
              'He wanted to sell it at a school fundraiser',
              'He planned to record the morning weather report with it',
              'He was practicing keeping a steady beat on his trumpet for the concert fanfare',
              'He wanted to hide it from the fourth-grade art class',
            ],
            correctIndex: 2,
            explanation:
              'The note signed "Mr. G." mentions practicing a steady beat for tomorrow’s opening fanfare, and Leo spots him behind the stage curtains holding a brass trumpet.',
          },
        ],
      },
      {
        id: 'en-ch-mystery-ep5',
        episodeNumber: 5,
        title: 'The Golden Surprise',
        paragraphs: [
          'Maya, Zoe, and Leo pushed open the auditorium doors just as a bright, cheerful trumpet melody floated from behind the red curtains. Stepping backstage, they found Principal Garcia lowering his brass trumpet. Right beside his music stand sat the missing golden metronome, ticking steadily back and forth.',
          'Principal Garcia laughed sheepishly when he saw three determined fourth-graders holding a detective notebook. "Busted!" he chuckled. "I wanted to surprise the choir by playing the opening fanfare at tomorrow’s concert. After lunch, I asked a student helper to tell Mr. Ortiz that I borrowed his metronome—I guess the message never arrived!"',
          'Together, the four of them marched back to Room 104. A very relieved Mr. Ortiz beamed when he saw both the golden metronome and his secret guest trumpeter.',
          'Before dismissal, Principal Garcia clipped shiny honorary "Eagle-Eye Detective" badges onto Maya, Zoe, and Leo. The Locker-Room Mystery Club celebrated its very first solved case with a joyful concert rehearsal.',
        ],
        keyVocab: [
          {
            word: 'sheepishly',
            meaning: 'in a slightly embarrassed or shy way after a small mistake',
          },
          {
            word: 'relieved',
            meaning: 'feeling calm and happy once a worry is gone',
          },
          {
            word: 'honorary',
            meaning: 'given as a special award or title to show appreciation',
          },
        ],
        questions: [
          {
            id: 'en-ch-mystery-ep5-q1',
            skillTag: 'Detail',
            prompt: 'Why did Mr. Ortiz not know that Principal Garcia had borrowed the metronome?',
            choices: [
              'The student helper never delivered Principal Garcia’s message to Mr. Ortiz',
              'Principal Garcia emailed the wrong school by mistake',
              'Mr. Ortiz had already left Maplewood Elementary for the day',
              'The note fell into the gym locker hallway',
            ],
            correctIndex: 0,
            explanation:
              'In Paragraph 2, Principal Garcia explains that he asked a student helper to tell Mr. Ortiz, but the message never arrived.',
          },
          {
            id: 'en-ch-mystery-ep5-q2',
            skillTag: 'Main Idea',
            prompt: 'What is the main idea of the final episode?',
            choices: [
              'Principal Garcia decides to cancel tomorrow’s spring concert',
              'Leo learns how to play the brass trumpet backstage',
              'Mr. Ortiz buys a brand-new velvet box for Room 104',
              'The kids discover Principal Garcia borrowed the metronome for a concert surprise, solving the mix-up happily',
            ],
            correctIndex: 3,
            explanation:
              'The episode wraps up the mystery by revealing Principal Garcia’s harmless concert surprise, returning the metronome to a relieved Mr. Ortiz, and rewarding the young detectives.',
          },
          {
            id: 'en-ch-mystery-ep5-q3',
            skillTag: 'Vocabulary',
            prompt: 'Why does Principal Garcia laugh "sheepishly" in the second paragraph?',
            choices: [
              'He is angry that the students interrupted his practice',
              'He feels a little embarrassed about accidentally causing a big mystery',
              'He is pretending to imitate a farm animal for the choir',
              'He forgot how to read the notes on his music stand',
            ],
            correctIndex: 1,
            explanation:
              'Saying "Busted!" after realizing his message never reached Mr. Ortiz shows that "sheepishly" means feeling slightly embarrassed about an accidental mix-up.',
          },
        ],
      },
    ],
  },

  // ═══════════ SERIES 2 (TIER 2): SECRET OF THE WHISPERING LIBRARY ═══════════
  {
    id: 'en-ch-library',
    tier: 2,
    title: 'Secret of the Whispering Library',
    subtitle: 'Quest for the Four Star Pages',
    genreTag: 'Fantasy Adventure',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    emblemCollectibleId: 'critter-moon-owl',
    synopsis:
      'When Clara discovers a glowing atlas in her town library’s attic, a tiny bookmark sprite asks her to recover four lost Star Pages from enchanted book realms.',
    episodes: [
      {
        id: 'en-ch-library-ep1',
        episodeNumber: 1,
        title: 'The Glowing Atlas in the Attic',
        cliffhanger:
          'The first map line shimmers bright blue like sunlit seawater—Clara steps straight into the Ocean Realm!',
        paragraphs: [
          'On a rainy Saturday afternoon, ten-year-old Clara Bennett helped her grandmother shelve donated books in the wooden attic of Willow Creek Library. Raindrops tapped gently against the round window as Clara dusted a tall corner shelf.',
          'Tucked behind a row of heavy encyclopedias sat a leather-bound atlas with silver edges that hummed warmly beneath Clara’s fingertips. The instant she opened its cover, bright golden dust swirled upward and folded itself into Pip, a tiny bookmark sprite stitched from royal-blue ribbon.',
          'Pip bowed politely and pointed at four blank spaces in the book. "A mischievous gust blew four glowing Star Pages out of our Master Atlas," Pip explained urgently. "If we do not return them before sunset, every storybook in this library will lose its ending!"',
          'Across the open map, four glowing paths sparked to life—Ocean, Jungle, Mountain, and Space. Clara’s heart raced, yet she squared her shoulders, gripped the satchel on her arm, and nodded. "Show me the first path, Pip."',
        ],
        keyVocab: [
          {
            word: 'donated',
            meaning: 'given freely to help a library, school, or community',
          },
          {
            word: 'atlas',
            meaning: 'a book filled with maps of real or imaginary places',
          },
          {
            word: 'swirled',
            meaning: 'moved quickly in a twisting, circular motion',
          },
        ],
        questions: [
          {
            id: 'en-ch-library-ep1-q1',
            skillTag: 'Detail',
            prompt:
              'According to Pip, what will happen by sunset if the four Star Pages are not returned?',
            choices: [
              'The library attic will fill up with rainwater',
              'Pip will turn back into an encyclopedia',
              'Every storybook in the library will lose its ending',
              'All the library shelves will lock for a whole year',
            ],
            correctIndex: 2,
            explanation:
              'In Paragraph 3, Pip warns that if the four Star Pages are not returned before sunset, every storybook in the library will lose its ending.',
          },
          {
            id: 'en-ch-library-ep1-q2',
            skillTag: 'Vocabulary',
            prompt: 'In the first paragraph, what does the word "donated" mean?',
            choices: [
              'Given freely for the library to share with readers',
              'Written in secret silver ink',
              'Checked out past the due date',
              'Damaged by a heavy rainstorm',
            ],
            correctIndex: 0,
            explanation:
              'Clara is helping her grandmother shelve books that people gave to Willow Creek Library, which means "donated" means given freely.',
          },
          {
            id: 'en-ch-library-ep1-q3',
            skillTag: 'Character',
            prompt: 'What does Clara’s reaction in the final paragraph reveal about her?',
            choices: [
              'She wants to close the atlas and run downstairs right away',
              'She does not believe Pip is telling the truth',
              'She only cares about visiting the Space path',
              'She is brave and willing to help even though she feels nervous',
            ],
            correctIndex: 3,
            explanation:
              'Even though her heart races, Clara squares her shoulders and tells Pip to show her the first path, proving she is brave and eager to help.',
          },
        ],
      },
      {
        id: 'en-ch-library-ep2',
        episodeNumber: 2,
        title: 'The Lighthouse of Paper Waves',
        cliffhanger:
          'One Star Page glows safely in Clara’s satchel—now emerald vines curl out from the atlas toward the Jungle Realm!',
        paragraphs: [
          'Stepping through the blue shimmer, Clara and Pip landed on a sturdy wooden pier surrounded by rustling waves folded from crisp newspaper. Origami seagulls soared above a red-and-white lighthouse built atop a towering stack of sea-adventure novels.',
          'At the very top of the lighthouse, Star Page #1 beamed inside a glass lantern. Beside the latch sat a grumpy red crab wearing round brass spectacles. "No traveler takes my bright page without solving a nautical riddle!" the crab declared, snapping his claws.',
          '"I point north through every roaring storm, yet I never lift a single finger. What am I?" asked the crab. Clara paused, picturing the ship captains in her favorite ocean books, and answered clearly, "A compass!"',
          'Surprised, the crab tipped his brass spectacles in respect and clicked the lantern door open. Star Page #1 drifted gently into Clara’s satchel, and the first star on Pip’s map blazed bright gold.',
        ],
        keyVocab: [
          {
            word: 'pier',
            meaning: 'a wooden walkway built out over the water',
          },
          {
            word: 'nautical',
            meaning: 'having to do with ships, sailors, or the sea',
          },
          {
            word: 'satchel',
            meaning: 'a small bag carried with a strap over the shoulder',
          },
        ],
        questions: [
          {
            id: 'en-ch-library-ep2-q1',
            skillTag: 'Detail',
            prompt: 'How does Clara convince the crab to unlock the glass lantern?',
            choices: [
              'She trades him a folded origami seagull',
              'She solves his riddle by answering "a compass"',
              'She climbs around the outside of the paper lighthouse',
              'She asks Pip to tie the crab’s claws with blue ribbon',
            ],
            correctIndex: 1,
            explanation:
              'In Paragraphs 3 and 4, Clara correctly answers "A compass!" to the crab’s riddle, and he clicks the lantern door open.',
          },
          {
            id: 'en-ch-library-ep2-q2',
            skillTag: 'Vocabulary',
            prompt: 'In the second paragraph, what does the word "nautical" mean?',
            choices: [
              'Very funny and silly',
              'Easy to solve in one second',
              'Hidden inside a dark cave',
              'Related to ships, sailors, or the sea',
            ],
            correctIndex: 3,
            explanation:
              'The lighthouse, crab, sea-adventure novels, and compass riddle all connect to the ocean, showing that "nautical" means related to ships, sailors, or the sea.',
          },
          {
            id: 'en-ch-library-ep2-q3',
            skillTag: 'Inference',
            prompt: 'Why does the crab tip his spectacles after Clara gives her answer?',
            choices: [
              'He respects her cleverness for solving his riddle',
              'His glasses are slipping off in the strong ocean wind',
              'He wants to challenge Pip to a second riddle',
              'He is upset that the paper waves stopped rustling',
            ],
            correctIndex: 0,
            explanation:
              'Paragraph 4 explains that the surprised crab tips his spectacles "in respect" and opens the lantern, showing he admires her clever answer.',
          },
        ],
      },
      {
        id: 'en-ch-library-ep3',
        episodeNumber: 3,
        title: 'Bridges of the Emerald Canopy',
        cliffhanger:
          'A frosty breeze whistles from the open atlas—the third Star Page waits high on a snowy mountain ridge!',
        paragraphs: [
          'Twisting green vines carried Clara and Pip into the Jungle Realm, where tall library shelves had sprouted into giant emerald trees. High in the leafy canopy, Star Page #2 fluttered from a vine bridge hanging above a rushing river of dark blue ink.',
          'Clara stepped onto the bridge and stopped short. Three wooden planks were missing right in the middle, leaving a wide gap! On a nearby branch perched a bright scarlet parrot clutching three spare cedar boards in its claws.',
          'Pip whispered close to Clara’s ear, "Careful! That parrot refuses to help travelers who grab or rush." Remembering Pip’s advice, Clara sat calmly on the edge of the bridge and asked politely, "Excuse me, could you tell me about the tallest tree in your jungle?"',
          'Delighted to meet such a patient listener, the scarlet parrot puffed its feathers, shared a lively tale about the ancient Oak of Tales, and dropped all three cedar boards neatly into the gap. Clara crossed safely and tucked Star Page #2 into her satchel.',
        ],
        keyVocab: [
          {
            word: 'canopy',
            meaning: 'the high, leafy roof formed by tree branches in a forest',
          },
          {
            word: 'perched',
            meaning: 'landed and rested on a high branch or narrow edge',
          },
          {
            word: 'patient',
            meaning: 'able to wait calmly without rushing or getting upset',
          },
        ],
        questions: [
          {
            id: 'en-ch-library-ep3-q1',
            skillTag: 'Detail',
            prompt: 'What stops Clara from walking straight across the vine bridge?',
            choices: [
              'A heavy rainstorm washes away the entire jungle shelf',
              'The river of dark blue ink floods over the canopy',
              'Three wooden planks are missing from the middle of the bridge',
              'Pip drops the Master Atlas into the tall grass',
            ],
            correctIndex: 2,
            explanation:
              'Paragraph 2 clearly states that three wooden planks were missing right in the middle of the bridge, leaving a wide gap.',
          },
          {
            id: 'en-ch-library-ep3-q2',
            skillTag: 'Character',
            prompt: 'How does Clara earn the scarlet parrot’s help?',
            choices: [
              'She offers the parrot a shiny golden coin from her pocket',
              'She sits calmly and listens politely to the parrot’s story',
              'She climbs the tallest tree to prove she is fast',
              'She leaps across the gap before the parrot notices',
            ],
            correctIndex: 1,
            explanation:
              'Clara follows Pip’s tip by sitting calmly and asking about the tallest tree, which makes the parrot happy to drop the boards into place.',
          },
          {
            id: 'en-ch-library-ep3-q3',
            skillTag: 'Main Idea',
            prompt: 'What lesson helps Clara succeed in the Jungle Realm?',
            choices: [
              'Being polite and patient works better than rushing or grabbing',
              'Parrots are always afraid of travelers who carry satchels',
              'Vine bridges are safer to cross than wooden piers',
              'Every jungle shelf grows taller when watered with ink',
            ],
            correctIndex: 0,
            explanation:
              'The episode centers on Clara choosing calm patience and good listening instead of rushing, which earns the parrot’s help to repair the bridge.',
          },
        ],
      },
      {
        id: 'en-ch-library-ep4',
        episodeNumber: 4,
        title: 'Echoes on Frostpeak Ridge',
        cliffhanger:
          'Only minutes remain before sunset! The fourth and final Star Page floats deep inside the silent Space Realm!',
        paragraphs: [
          'Clara buttoned her warm purple coat as she and Pip stepped onto Frostpeak Ridge, a steep mountain sculpted from crisp white winter-tale books. High above them, Star Page #3 snapped in the breeze beneath an icy archway, while a thick snowdrift buried the narrow footpath.',
          'Pip shivered as tiny crystals of frost dusted his blue ribbon edges. Neither of them could tell which snowy ledge led safely upward through the blinding white hillside.',
          'First, Clara gently tucked Pip inside her warm coat pocket so only his bright eyes peeked out. Then she knelt close to the ground and noticed a secret trail: whenever the wind shook Star Page #3, tiny golden sparks drifted down and glowed softly beneath the fresh snow.',
          'Following the winding trail of golden sparks step by step, Clara climbed steadily to the icy archway and caught Star Page #3 just before another gust swept past. Three stars now shone on the atlas, leaving only the velvet-black Space Realm ahead.',
        ],
        keyVocab: [
          {
            word: 'sculpted',
            meaning: 'shaped or carved carefully into a specific form',
          },
          {
            word: 'snowdrift',
            meaning: 'a deep mound of snow piled up by the wind',
          },
          {
            word: 'winding',
            meaning: 'curving and twisting instead of going straight',
          },
        ],
        questions: [
          {
            id: 'en-ch-library-ep4-q1',
            skillTag: 'Inference',
            prompt:
              'How is Clara able to find the safe path up Frostpeak Ridge even though a snowdrift hides it?',
            choices: [
              'The scarlet parrot flies over from the jungle to guide her',
              'She melts the entire mountain using the lighthouse lantern',
              'Pip reads trail signs printed on the icy archway',
              'She follows the faint golden sparks glowing under the snow from Star Page #3',
            ],
            correctIndex: 3,
            explanation:
              'Paragraphs 3 and 4 explain that Star Page #3 sheds tiny golden sparks into the snow, creating a glowing trail that Clara follows safely to the top.',
          },
          {
            id: 'en-ch-library-ep4-q2',
            skillTag: 'Character',
            prompt: 'What does tucking Pip inside her warm coat pocket show about Clara?',
            choices: [
              'She wants to hide Pip so no mountain creatures see him',
              'She is annoyed that Pip cannot fly in cold weather',
              'She is thoughtful and takes care of her friend',
              'She forgot to pack a winter coat for herself',
            ],
            correctIndex: 2,
            explanation:
              'Seeing Pip shiver with frost on his ribbon, Clara immediately warms him in her coat pocket before climbing, showing she is caring and thoughtful.',
          },
          {
            id: 'en-ch-library-ep4-q3',
            skillTag: 'Vocabulary',
            prompt: 'In the first paragraph, what does the word "sculpted" mean?',
            choices: [
              'Stacked carelessly in a messy heap',
              'Shaped or carved carefully into a form',
              'Hidden behind a wooden attic door',
              'Frozen overnight by a sudden rainstorm',
            ],
            correctIndex: 1,
            explanation:
              'Frostpeak Ridge is described as a mountain made out of winter-tale books shaped into a steep slope, showing that "sculpted" means shaped carefully into a form.',
          },
        ],
      },
      {
        id: 'en-ch-library-ep5',
        episodeNumber: 5,
        title: 'Constellation of Stories',
        paragraphs: [
          'With the attic sunset only moments away, Clara and Pip floated weightlessly into the Space Realm. Silver stars drifted lazily between curved bookshelves painted like midnight skies. Just ahead, Star Page #4 orbited slowly around a glowing paper moon—inches beyond Clara’s outstretched fingers.',
          'Each time Clara kicked her sneakers to swim closer in zero gravity, she spun helplessly backward! Thinking fast, Pip unrolled his long royal-blue ribbon to its full length and anchored one end tightly around a brass constellation post. "Grab my ribbon and pull, Clara!" Pip called.',
          'Hand over hand, Clara glided smoothly forward, snagged Star Page #4 out of its orbit, and pressed all four glowing pages back into the Master Atlas. A warm musical chime rippled through the Whispering Library as every story’s ending locked safely back in place.',
          'In a gentle blink, Clara stood in the quiet attic beside her grandmother’s book cart as golden sunlight faded outside. Resting neatly on her sleeve was a tiny blue ribbon bookmark, and a soft breeze whispered, "Thank you, keeper of stories."',
        ],
        keyVocab: [
          {
            word: 'orbited',
            meaning: 'traveled in a curved path around a moon, planet, or star',
          },
          {
            word: 'anchored',
            meaning: 'fastened or held something firmly in place',
          },
          {
            word: 'chime',
            meaning: 'a clear, musical ringing sound like a small bell',
          },
        ],
        questions: [
          {
            id: 'en-ch-library-ep5-q1',
            skillTag: 'Detail',
            prompt: 'How do Clara and Pip reach Star Page #4 in zero gravity?',
            choices: [
              'Pip anchors his unrolled ribbon to a post so Clara can pull herself forward',
              'Clara throws her satchel to knock the page off the paper moon',
              'They ride an origami seagull across the midnight shelves',
              'The paper moon floats straight down into Clara’s hands',
            ],
            correctIndex: 0,
            explanation:
              'Paragraphs 2 and 3 state that Pip unrolls and anchors his ribbon to a constellation post so Clara can pull herself forward hand over hand to grab Star Page #4.',
          },
          {
            id: 'en-ch-library-ep5-q2',
            skillTag: 'Vocabulary',
            prompt: 'In the second paragraph, what does the word "anchored" mean?',
            choices: [
              'Folded neatly inside a pocket',
              'Dropped into the deep ocean',
              'Fastened or held firmly in place',
              'Painted bright silver and gold',
            ],
            correctIndex: 2,
            explanation:
              'Pip ties one end of his ribbon tightly around a brass post so it will not move while Clara pulls on it, meaning "anchored" means fastened firmly in place.',
          },
          {
            id: 'en-ch-library-ep5-q3',
            skillTag: 'Main Idea',
            prompt: 'What is the main idea of this final episode?',
            choices: [
              'Zero gravity makes reading books in space impossible',
              'Clara’s grandmother discovers Pip hiding inside the book cart',
              'Pip decides to stay on the glowing paper moon forever',
              'Clara and Pip use teamwork to recover the final Star Page and save the library’s story endings',
            ],
            correctIndex: 3,
            explanation:
              'The final episode highlights Clara and Pip working together with Pip’s ribbon to catch Star Page #4, restore the Master Atlas, and protect every story’s ending before sunset.',
          },
        ],
      },
    ],
  },
];

import type { EnglishChapterSeries } from './englishChapterTypes';

export const ENGLISH_CHAPTER_SERIES_PART2: EnglishChapterSeries[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SERIES 3 · Tier 3 · Cozy Baking Adventure (5 episodes / 15 questions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'en-ch-bakery',
    tier: 3,
    title: 'Paws & Pastries Bakery',
    subtitle: 'Can Lily and her puppy mascot bake an award-winning treat when kitchen disasters strike?',
    genreTag: 'Cozy Baking',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    emblemCollectibleId: 'sweet-boba-bear',
    synopsis:
      'Lily and her best friend Maya enter the Willow Creek Charity Bake Sale to raise money for the local animal shelter—with golden puppy Biscuit cheering them on. When a tripped circuit and a blueberry-jam spill ruin their original recipe, Lily must invent a brand-new treat before the judges arrive.',
    episodes: [
      {
        id: 'en-ch-bakery-ep1',
        episodeNumber: 1,
        title: 'The Golden Whisk Challenge',
        cliffhanger:
          'With the bake sale opening at nine o’clock tomorrow morning, how can Lily and Maya bake a single muffin if the oven will not turn on?',
        paragraphs: [
          'On Friday evening, Lily tied on her bright pink apron and lined up mixing bowls across the kitchen counter. Tomorrow was the Willow Creek Charity Bake Sale, and every dollar earned at her club’s booth would buy warm fleece blankets and chew toys for the Maple Street Animal Shelter.',
          'Behind the low wooden pet gate, Lily’s golden retriever puppy, Biscuit, wagged his tail proudly in a tiny polka-dot bandana. Lily’s best friend, Maya, opened a spiral notebook filled with neat sketches. “Grandma’s honey-blueberry muffins are unbeatable,” Lily said. “If we nail the golden crust, we might even win the Most Creative Treat Award!”',
          'Soon, the sweet aroma of warmed honey and vanilla filled the room. Lily slid the first test tray into the countertop convection oven while Maya popped a mug of butter into the microwave beside it.',
          'Suddenly, Biscuit let out a sharp bark and stared toward the wall outlet. The kitchen ceiling lights flickered twice, a dull pop echoed from the hallway, and the convection oven clicked completely silent.',
        ],
        keyVocab: [
          {
            word: 'charity',
            meaning: 'an organization or event that raises money or goods to help people or animals in need',
          },
          {
            word: 'aroma',
            meaning: 'a pleasant, noticeable smell, especially from food or baking',
          },
          {
            word: 'flickered',
            meaning: 'shone unsteadily, blinking on and off quickly',
          },
        ],
        questions: [
          {
            id: 'en-ch-bakery-ep1-q1',
            skillTag: 'Detail',
            prompt: 'What will Lily and Maya do with the money they earn at the charity bake sale?',
            choices: [
              'Buy a brand-new countertop oven for Lily’s kitchen',
              'Enter Biscuit into a weekend dog-training contest',
              'Buy blankets and toys for the Maple Street Animal Shelter',
              'Pay for baking classes with Lily’s grandmother',
            ],
            correctIndex: 2,
            explanation:
              'Paragraph 1 states that every dollar earned at their booth will buy warm fleece blankets and chew toys for the Maple Street Animal Shelter.',
          },
          {
            id: 'en-ch-bakery-ep1-q2',
            skillTag: 'Vocabulary',
            prompt: 'In the final paragraph, what does the word "flickered" mean?',
            choices: [
              'Blinked on and off unsteadily',
              'Shone brighter than usual',
              'Changed from white to yellow',
              'Buzzed loudly across the room',
            ],
            correctIndex: 0,
            explanation:
              'The ceiling lights flickered right before the power cut off, showing that "flickered" means blinked on and off unsteadily.',
          },
          {
            id: 'en-ch-bakery-ep1-q3',
            skillTag: 'Character',
            prompt: 'What do Lily’s preparations at the start of the story show about her?',
            choices: [
              'She dislikes sharing kitchen space with Maya',
              'She only cares about winning a shiny trophy',
              'She forgets to keep Biscuit safely out of the kitchen',
              'She is organized and cares deeply about helping shelter animals',
            ],
            correctIndex: 3,
            explanation:
              'Lily lines up her bowls carefully, keeps Biscuit safely behind the pet gate, plans ahead the night before, and bakes to support the animal shelter.',
          },
        ],
      },
      {
        id: 'en-ch-bakery-ep2',
        episodeNumber: 2,
        title: 'The Blueberry Blot Disaster',
        cliffhanger:
          'Will Lily guess the missing measurements and risk flat muffins, or can those surprise pantry ingredients spark a bolder recipe?',
        paragraphs: [
          'Lily’s mom hurried in with a flashlight and checked the breaker panel in the hallway. “Running the countertop oven and the microwave on the same kitchen circuit overloaded it,” she explained calmly. After she unplugged the microwave and flipped the switch, the lights glowed steady and the oven hummed back to life.',
          'Lily sighed with relief—until she glanced down at the counter. When the lights had gone dark, her elbow had bumped a glass jar of warm blueberry jam. A thick purple puddle had seeped straight across Grandma’s handwritten recipe page!',
          'Maya gently blotted the sticky jam with a paper towel, but the bottom half of the page was hopelessly smudged. The baking powder amount and the secret crumb-topping instructions had vanished into dark blue streaks.',
          '“At least the top ingredients are still readable,” Maya murmured, pointing to flour, eggs, milk, and honey. Just then, Lily opened the pantry for clean napkins and spotted two unexpected treasures on the middle shelf: a shiny waffle iron and an unopened bag of brown-sugar boba pearls from her aunt’s tea shop.',
        ],
        keyVocab: [
          {
            word: 'circuit',
            meaning: 'a closed path that carries electrical power to outlets and appliances',
          },
          {
            word: 'smudged',
            meaning: 'blurred or smeared by a dirty or wet mark',
          },
          {
            word: 'readable',
            meaning: 'clear enough to read and understand',
          },
        ],
        questions: [
          {
            id: 'en-ch-bakery-ep2-q1',
            skillTag: 'Detail',
            prompt: 'Why did the kitchen power shut off?',
            choices: [
              'A rainstorm knocked down power lines in Willow Creek',
              'Running the countertop oven and microwave together overloaded the circuit',
              'Biscuit accidentally bumped the hallway breaker switch',
              'The countertop oven was broken and needed new wiring',
            ],
            correctIndex: 1,
            explanation:
              'Lily’s mom explains that running the countertop oven and the microwave on the same kitchen circuit overloaded it.',
          },
          {
            id: 'en-ch-bakery-ep2-q2',
            skillTag: 'Vocabulary',
            prompt: 'Which word is closest in meaning to "smudged" as used in paragraph 3?',
            choices: [
              'Folded',
              'Torn',
              'Highlighted',
              'Smeared',
            ],
            correctIndex: 3,
            explanation:
              'The blueberry jam blurred the handwritten ink into dark blue streaks, so "smudged" means smeared.',
          },
          {
            id: 'en-ch-bakery-ep2-q3',
            skillTag: 'Inference',
            prompt: 'Why does the author call the waffle iron and boba pearls "unexpected treasures"?',
            choices: [
              'They might help Lily create an inventive new treat to replace the ruined recipe',
              'Lily’s aunt had lost them and promised a cash reward',
              'They can be sold directly at the bake sale instead of baked goods',
              'They will help remove the purple blueberry stain from the notebook',
            ],
            correctIndex: 0,
            explanation:
              'Because the muffin recipe is ruined, calling the waffle iron and boba pearls "treasures" hints that Lily can use them to invent a creative replacement.',
          },
        ],
      },
      {
        id: 'en-ch-bakery-ep3',
        episodeNumber: 3,
        title: 'Boba Waffle Experiments',
        cliffhanger:
          'The warm boba waffles taste wonderful inside the cozy kitchen—but will the chewy pearls harden once they reach the chilly park?',
        paragraphs: [
          'At six-thirty on Saturday morning, Lily made a bold choice. Guessing Grandma’s missing baking-powder measurement could leave them with flat, rubbery muffins. Instead, she decided to improvise using her favorite crisp waffle batter, fragrant vanilla milk-tea flavor, and the glossy brown-sugar boba pearls.',
          'Her first test did not go as planned. Lily stirred the cooked tapioca pearls straight into the raw batter and closed the hot waffle iron. Three minutes later, the melted brown-sugar glaze stuck stubbornly to the metal plates, tearing the waffle into gooey pieces.',
          'Rather than panicking, Lily studied the messy griddle like a scientist. “The heat caramelized the syrup right onto the iron,” she told Maya. “Let’s cook the milk-tea waffle by itself first, then spoon warm pearls into the pockets and add a light drizzle of blueberry honey on top!”',
          'Batch two came out golden and crisp. Maya took a bite and grinned from ear to ear. The contrast in texture—crunchy waffle edges, soft chewy boba, and tangy berry honey—was unforgettable. Behind the gate, Biscuit sniffed the toasted vanilla air and thumped his tail in approval.',
        ],
        keyVocab: [
          {
            word: 'improvise',
            meaning: 'to invent or make something on the spot using whatever is available',
          },
          {
            word: 'drizzle',
            meaning: 'a thin, light stream of liquid poured over food',
          },
          {
            word: 'texture',
            meaning: 'how something feels in your hands or mouth, such as crunchy, smooth, or chewy',
          },
        ],
        questions: [
          {
            id: 'en-ch-bakery-ep3-q1',
            skillTag: 'Main Idea',
            prompt: 'What is the main idea of this episode?',
            choices: [
              'Biscuit helps Lily choose the best waffle iron from the pantry',
              'Maya convinces Lily to give up on baking and sell tea instead',
              'Lily tests and adjusts a new boba-waffle recipe until it turns out delicious',
              'Making waffles takes much longer than baking Grandma’s blueberry muffins',
            ],
            correctIndex: 2,
            explanation:
              'The episode centers on Lily improvising a new boba waffle, learning from her sticky first attempt, and perfecting the second batch.',
          },
          {
            id: 'en-ch-bakery-ep3-q2',
            skillTag: 'Inference',
            prompt: 'Why did Lily’s second waffle batch succeed when the first one tore apart?',
            choices: [
              'She left out the milk-tea flavor and used plain water',
              'She baked the waffle plain first so the sugary pearls would not stick to the hot iron',
              'She cooked the second waffle at a freezing temperature',
              'She added extra baking powder from Grandma’s notebook',
            ],
            correctIndex: 1,
            explanation:
              'In batch one, mixing sugary pearls into the batter made the glaze stick to the hot metal; adding them after baking kept the waffle crisp and intact.',
          },
          {
            id: 'en-ch-bakery-ep3-q3',
            skillTag: 'Vocabulary',
            prompt: 'What does "improvise" mean in paragraph 1?',
            choices: [
              'Copy a famous recipe word for word',
              'Order finished desserts from a local bakery',
              'Practice the same step ten times without changes',
              'Create a new solution on the spot with what you have',
            ],
            correctIndex: 3,
            explanation:
              'Because the original muffin recipe was ruined, Lily had to invent a brand-new treat using the batter, waffle iron, and boba pearls on hand.',
          },
        ],
      },
      {
        id: 'en-ch-bakery-ep4',
        episodeNumber: 4,
        title: 'Rush Hour at Booth Seven',
        cliffhanger:
          'With the head judge standing right in front of Booth Seven and almost no batter left, can Lily pull off one final showstopping waffle?',
        paragraphs: [
          'By nine o’clock, Willow Creek Park buzzed with colorful tents and cheerful music. Lily and Maya hung a pink paw-print banner across Booth Seven and placed a clear donation jar beside the register. Right next to the booth, Biscuit sat politely on his plaid mascot bed, offering gentle paw shakes to passing children.',
          'Because cooked tapioca pearls turn firm when they get cold, Lily had packed them inside an insulated thermos filled with warm brown-sugar syrup. Whenever someone ordered, she ladled fresh batter onto the iron for a warm waffle and topped it with soft, warm pearls on the spot.',
          'At first, most visitors walked straight toward the towering frosted cupcakes at Booth Six. Seeing the quiet line, Maya thought quickly. She snipped one hot waffle into bite-sized squares, added tiny pearl toppings, and held out a sample tray. Within minutes, the sweet toasted scent drew a crowd of curious shoppers straight to Booth Seven!',
          'Business boomed for two exciting hours. Suddenly, Judge Ms. Rivera stepped up to the table, tapping her pen against her clipboard. Lily peered nervously into her bowls—only one ladle of batter and a few spoonfuls of blueberry honey remained.',
        ],
        keyVocab: [
          {
            word: 'insulated',
            meaning: 'lined with special material that keeps heat in or cold out',
          },
          {
            word: 'curious',
            meaning: 'eager to learn, see, or try something new',
          },
          {
            word: 'clipboard',
            meaning: 'a flat board with a clip at the top used to hold papers while writing',
          },
        ],
        questions: [
          {
            id: 'en-ch-bakery-ep4-q1',
            skillTag: 'Detail',
            prompt: 'How did Lily keep the boba pearls from turning hard in the cool outdoor air?',
            choices: [
              'She stored them in an insulated thermos filled with warm syrup',
              'She froze them overnight and thawed them in the sun',
              'She baked them inside the waffles before leaving home',
              'She covered the bowl with pink paper napkins',
            ],
            correctIndex: 0,
            explanation:
              'Paragraph 2 explains that Lily packed the pearls in an insulated thermos of warm brown-sugar syrup so they stayed soft and warm.',
          },
          {
            id: 'en-ch-bakery-ep4-q2',
            skillTag: 'Character',
            prompt: 'What does Maya’s decision to hand out bite-sized waffle samples show about her?',
            choices: [
              'She was worried the waffles tasted too sour to sell',
              'She wanted to finish early so she could visit Booth Six',
              'She is a clever problem-solver who knows how to attract customers',
              'She forgot to put price signs on the table',
            ],
            correctIndex: 2,
            explanation:
              'When shoppers initially walked past toward the cupcakes, Maya thought quickly and used warm samples to draw a crowd to Booth Seven.',
          },
          {
            id: 'en-ch-bakery-ep4-q3',
            skillTag: 'Inference',
            prompt: 'Why did Lily feel nervous when Ms. Rivera approached the booth?',
            choices: [
              'Biscuit had wandered away from his plaid mascot bed',
              'They had almost run out of batter and drizzle right when the judge arrived',
              'The waffle iron had stopped working at the park',
              'Ms. Rivera announced that boba toppings were not allowed',
            ],
            correctIndex: 1,
            explanation:
              'Lily peered into her bowls and realized she only had one ladle of batter and a few spoonfuls of blueberry honey left for the judge’s waffle.',
          },
        ],
      },
      {
        id: 'en-ch-bakery-ep5',
        episodeNumber: 5,
        title: 'The Sweetest Ribbon',
        paragraphs: [
          'Lily took a slow, steady breath and poured the very last ladle of batter onto the hot iron. She watched the timer closely until the edges turned crisp and golden. With careful hands, she nestled glossy brown-sugar pearls into the center squares and painted a neat spiral with the final drops of blueberry honey.',
          'Ms. Rivera lifted a warm bite, listening to the delicate crunch. Her eyebrows rose in pleasant surprise as the toasted vanilla, chewy pearls, and tangy berry honey blended together. “What inspired such an original combination?” she asked, jotting notes across her sheet.',
          'Lily smiled and told the whole honest story—from the tripped kitchen circuit and jam-stained notebook to the sticky first waffle trial. “We learned that a mistake can point you toward an even better idea,” Lily said.',
          'An hour later, the donation jar overflowed with bills and coins—enough to buy twenty cozy fleece blankets for the shelter! Stepping onto the park gazebo, Ms. Rivera awarded Paws & Pastries Bakery the Most Creative Treat ribbon. Lily high-fived Maya and handed Biscuit a crunchy peanut-butter dog biscuit to celebrate their sweetest victory.',
        ],
        keyVocab: [
          {
            word: 'glossy',
            meaning: 'smooth and shiny on the surface',
          },
          {
            word: 'tangy',
            meaning: 'having a bright, slightly tart and lively flavor',
          },
          {
            word: 'victory',
            meaning: 'a win or proud success after working hard through a challenge',
          },
        ],
        questions: [
          {
            id: 'en-ch-bakery-ep5-q1',
            skillTag: 'Main Idea',
            prompt: 'What is the overall lesson of the Paws & Pastries Bakery story?',
            choices: [
              'Fancy frosted cupcakes always outsell homemade waffles',
              'You should never write recipes inside a spiral notebook',
              'Outdoor bake sales are too chilly for warm desserts',
              'Staying calm and creative can turn unexpected mistakes into a proud success',
            ],
            correctIndex: 3,
            explanation:
              'Even after a power trip, ruined recipe, and sticky first trial, Lily and Maya adapted creatively, raised money for the shelter, and won the award.',
          },
          {
            id: 'en-ch-bakery-ep5-q2',
            skillTag: 'Character',
            prompt: 'What does Lily’s conversation with Ms. Rivera reveal about her character?',
            choices: [
              'She is honest and proud of what she learned from her mistakes',
              'She tries to hide the kitchen accidents so the judge will not know',
              'She takes all the credit without mentioning Maya’s help',
              'She regrets entering the charity bake sale',
            ],
            correctIndex: 0,
            explanation:
              'Lily openly shares the full story of the circuit trip, jam spill, and sticky test batch, saying "we learned" from those mistakes.',
          },
          {
            id: 'en-ch-bakery-ep5-q3',
            skillTag: 'Detail',
            prompt: 'How many fleece blankets could the money in their donation jar buy for the shelter?',
            choices: [
              'Seven blankets',
              'Twelve blankets',
              'Twenty blankets',
              'Fifty blankets',
            ],
            correctIndex: 2,
            explanation:
              'Paragraph 4 states that the overflowing donation jar held enough money to buy twenty cozy fleece blankets for the shelter.',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIES 4 · Tier 4 · STEM Space Adventure (5 episodes / 15 questions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'en-ch-orbit',
    tier: 4,
    title: 'Orbit Camp: Moon Rover Crew',
    subtitle: 'Can Nora and Sam use real engineering to guide their solar rover through Shadow Crater?',
    genreTag: 'STEM Adventure',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    emblemCollectibleId: 'space-astro-corgi',
    synopsis:
      'At Starlight Orbit Camp, Nora and her teammate Sam build a miniature solar-powered moon rover named Scout-4 for the Simulated Crater Mission. To collect the ice-core marker and return to Base Camp, they must solve real science challenges involving solar angles, friction, balance, and radio signals.',
    episodes: [
      {
        id: 'en-ch-orbit-ep1',
        episodeNumber: 1,
        title: 'Launch Day at Crater Hall',
        cliffhanger:
          'Practice time closes in ten minutes—can Nora and Sam figure out how to boost Scout-4’s solar power before the whistle blows?',
        paragraphs: [
          'Inside Starlight Orbit Camp’s testing dome, Crater Hall, a huge pit of powdery gray sand mimics the rugged surface of the Moon. Towering over one side of the hall, a bright Sun Lamp shines at a low slant, recreating the angled sunlight near the Moon’s south pole.',
          'Coach Vega tapped a stopwatch and briefed the crews. “Tomorrow’s mission gives your solar rover five minutes to climb the crater ridge, roll down into Shadow Crater, scoop up a blue ice-core marker, and return to Base Camp.”',
          'Nora and her teammate Sam placed their shoebox-sized rover, Scout-4, on the tiled launch pad. Sam flipped the power switch so the rover’s rooftop solar panel could drive the motors and charge its backup battery. Instead of zooming ahead, Scout-4 gave a sluggish whine and barely crept forward two inches.',
          'Frowning, Nora checked the voltage meter clipped to the frame—the needle hovered near zero. Then she followed the slanted beam of the Sun Lamp down to Scout-4’s solar panel, which lay completely flat on the rover’s roof.',
        ],
        keyVocab: [
          {
            word: 'mimics',
            meaning: 'copies or imitates the look or behavior of something else',
          },
          {
            word: 'rugged',
            meaning: 'rough, rocky, and uneven across the surface',
          },
          {
            word: 'sluggish',
            meaning: 'moving very slowly and lacking normal energy or power',
          },
        ],
        questions: [
          {
            id: 'en-ch-orbit-ep1-q1',
            skillTag: 'Detail',
            prompt: 'What must Scout-4 collect inside Shadow Crater during the official mission?',
            choices: [
              'A miniature solar lamp',
              'A blue ice-core marker',
              'A cup of powdery gray sand',
              'A metal wrench from Coach Vega',
            ],
            correctIndex: 1,
            explanation:
              'In paragraph 2, Coach Vega explains that each rover must scoop up a blue ice-core marker inside Shadow Crater and return to Base Camp.',
          },
          {
            id: 'en-ch-orbit-ep1-q2',
            skillTag: 'Inference',
            prompt: 'Based on the final paragraph, what is the most likely reason Scout-4 moved so slowly?',
            choices: [
              'The Sun Lamp was turned completely off during the test',
              'The rover’s wheels were glued to the floor tiles',
              'Sam forgot to flip the power switch on',
              'The flat solar panel was not angled well to catch the slanted Sun Lamp beam',
            ],
            correctIndex: 3,
            explanation:
              'Nora sees the voltage near zero and notices that the Sun Lamp shines at a low slant while Scout-4’s solar panel lies completely flat.',
          },
          {
            id: 'en-ch-orbit-ep1-q3',
            skillTag: 'Vocabulary',
            prompt: 'What does "sluggish" mean in paragraph 3?',
            choices: [
              'Slow and lacking power',
              'Loud and energetic',
              'Smooth and silent',
              'Spinning wildly out of control',
            ],
            correctIndex: 0,
            explanation:
              'Scout-4 barely crept forward two inches with low voltage, showing that "sluggish" means slow and lacking power.',
          },
        ],
      },
      {
        id: 'en-ch-orbit-ep2',
        episodeNumber: 2,
        title: 'Chasing the Ninety-Degree Beam',
        cliffhanger:
          'Scout-4 finally has full solar power—so why is the powdery lunar sand trapping its wheels in place?',
        paragraphs: [
          '“Look at the angle!” Sam said, snapping his fingers. “We learned in energy lab that a solar panel captures the most electricity when light hits it at a perpendicular, ninety-degree angle. When rays strike a flat panel from the side, the light spreads out thinly and delivers much less power.”',
          'Nora immediately grabbed two lightweight plastic hinges from their tool tray. Together, they mounted the solar panel on a tiltable bracket and angled its dark blue cells straight toward the glowing Sun Lamp. Instantly, the voltage meter leaped into the bright green zone, and the backup battery indicator began charging.',
          'When Sam tapped the controller, Scout-4 zipped briskly across the smooth floor tiles. High-fiving in victory, the teammates carried their rover to the edge of the simulated lunar terrain for its first sand trial.',
          'The moment Scout-4’s narrow, smooth plastic wheels touched the powdery gray dust, trouble struck again. The tires spun furiously, spraying dusty plumes behind them, yet the rover only sank deeper into twin ruts without rolling forward a single foot.',
        ],
        keyVocab: [
          {
            word: 'perpendicular',
            meaning: 'meeting a surface straight on to form a right, ninety-degree angle',
          },
          {
            word: 'briskly',
            meaning: 'quickly, smoothly, and full of energy',
          },
          {
            word: 'terrain',
            meaning: 'a stretch of land or ground with specific physical features like hills, rocks, or sand',
          },
        ],
        questions: [
          {
            id: 'en-ch-orbit-ep2-q1',
            skillTag: 'Detail',
            prompt: 'What happened right after Nora and Sam tilted the solar panel toward the Sun Lamp?',
            choices: [
              'The hinges broke under the heat of the lamp',
              'The backup battery stopped working completely',
              'The voltage meter jumped into the green zone and Scout-4 drove briskly on the tiles',
              'Coach Vega paused the Sun Lamp to cool the dome',
            ],
            correctIndex: 2,
            explanation:
              'Paragraphs 2 and 3 explain that tilting the panel straight toward the Sun Lamp pushed the voltage into the green zone and let Scout-4 zip briskly across the tiles.',
          },
          {
            id: 'en-ch-orbit-ep2-q2',
            skillTag: 'Inference',
            prompt: 'Why does a solar panel generate more electricity when sunlight hits it at a 90-degree angle instead of a shallow slant?',
            choices: [
              'Angled light bounces off the floor tiles and heats the wheels',
              'Direct light concentrates more energy onto the panel instead of spreading thinly',
              'Tilted panels weigh less than flat panels',
              'Solar panels only turn on when tilted sideways',
            ],
            correctIndex: 1,
            explanation:
              'Sam explains that rays striking at a slant spread out thinly and deliver less power, whereas perpendicular (90-degree) light hits straight on to deliver maximum energy.',
          },
          {
            id: 'en-ch-orbit-ep2-q3',
            skillTag: 'Vocabulary',
            prompt: 'In paragraph 3, what does the word "terrain" refer to?',
            choices: [
              'The simulated lunar ground inside the testing pit',
              'The plastic hinges on the rover’s roof',
              'The handheld controller Sam used to steer',
              'The voltage meter attached to the frame',
            ],
            correctIndex: 0,
            explanation:
              'They carried the rover off the smooth tiles to the edge of the powdery gray sand pit, which is the simulated lunar terrain (ground surface).',
          },
        ],
      },
      {
        id: 'en-ch-orbit-ep3',
        episodeNumber: 3,
        title: 'Treads, Friction, and a Tipping Point',
        cliffhanger:
          'Mission Day starts tomorrow morning—how can Nora and Sam redesign Scout-4 so it climbs the crater wall without flipping over?',
        paragraphs: [
          'Nora knelt beside the deep ruts in the gray dust. “Smooth tires slip because they do not create enough friction against loose sand,” she explained. “And because these wheels are narrow, all of Scout-4’s weight presses down on a tiny patch, making it sink.”',
          'Back at the workbench, the crew swapped in wide wheels wrapped with ridged rubber treads. The wider shape spread Scout-4’s weight over a larger area of sand, while the raised ridges gripped the loose dust grains to provide strong friction. Moments later, Scout-4 rolled steadily across the flat sandbox without digging in!',
          '“Time for the ridge test!” Sam cheered, steering Scout-4 up the steep twenty-five-degree crater ramp. Halfway to the top, the rover’s front wheels lifted off the slope, its frame wobbled, and Scout-4 tumbled backward onto its roof.',
          'Nora gently lifted the overturned rover and tapped the heavy rechargeable battery pack strapped near the top of its tall plastic frame. “Look how high that weight sits,” she murmured. “Our center of gravity is way too high for a steep hill.”',
        ],
        keyVocab: [
          {
            word: 'friction',
            meaning: 'the gripping force between two surfaces that resists slipping when they rub against each other',
          },
          {
            word: 'steadily',
            meaning: 'in a smooth, even, and reliable way without sudden stops',
          },
          {
            word: 'overturned',
            meaning: 'flipped upside down or tipped onto its back',
          },
        ],
        questions: [
          {
            id: 'en-ch-orbit-ep3-q1',
            skillTag: 'Main Idea',
            prompt: 'What is the main focus of Episode 3?',
            choices: [
              'Nora and Sam argue about who should steer the rover on Mission Day',
              'Coach Vega teaches the camp how to build a steeper crater ramp',
              'Scout-4 runs out of battery power before reaching the sandbox',
              'The team fixes Scout-4’s traction in sand, then uncovers a balance problem on the steep ramp',
            ],
            correctIndex: 3,
            explanation:
              'First, Nora and Sam solve the sand-sinking issue with wider ridged wheels; next, they discover that a high center of gravity causes Scout-4 to tip on the ramp.',
          },
          {
            id: 'en-ch-orbit-ep3-q2',
            skillTag: 'Detail',
            prompt: 'How did the new wide, ridged rubber wheels help Scout-4 cross the loose sand?',
            choices: [
              'They made the rover light enough to hover above the dust',
              'They spread out the rover’s weight and gave the tires better friction to grip the sand',
              'They blocked bright light from reflecting off the gray grains',
              'They spun twice as fast as the narrow plastic wheels',
            ],
            correctIndex: 1,
            explanation:
              'Paragraph 2 explains that wider wheels spread the weight over more sand so Scout-4 sank less, and ridged treads increased friction to grip the dust.',
          },
          {
            id: 'en-ch-orbit-ep3-q3',
            skillTag: 'Inference',
            prompt: 'Why did strapping the heavy battery pack high on the frame cause Scout-4 to flip on the ramp?',
            choices: [
              'The battery cables tangled around the rubber treads',
              'The battery shaded the front wheels from the Sun Lamp',
              'Putting heavy weight high up raised the center of gravity, making the rover top-heavy and easy to tip',
              'Heavy batteries cannot work on slopes steeper than ten degrees',
            ],
            correctIndex: 2,
            explanation:
              'A high center of gravity makes a vehicle top-heavy, so when Scout-4 tilted backward on the 25-degree ramp, the high weight pulled it over.',
          },
        ],
      },
      {
        id: 'en-ch-orbit-ep4',
        episodeNumber: 4,
        title: 'Silence in Shadow Crater',
        cliffhanger:
          'Only three minutes remain on the clock—how can Nora and Sam reach Scout-4 behind a solid ridge without breaking the rules by touching the rover?',
        paragraphs: [
          'Early on Mission Day, Nora and Sam redesigned Scout-4’s chassis. They unbolted the heavy battery pack from the upper frame and secured it low and centered right between the four wheel axles. Lowering the center of gravity worked wonders: during final warm-ups, Scout-4 climbed the twenty-five-degree ramp without a single wobble.',
          'The five-minute countdown began! Under the angled Sun Lamp, Scout-4’s tilted panel topped off its battery as the ridged wheels carried it across the dust. The rover reached the summit, smoothly crested the crater rim, and rolled down into dim Shadow Crater, switching seamlessly to battery power.',
          'Two feet from the glowing blue ice-core marker, Sam’s control tablet flashed crimson: SIGNAL LOST. Scout-4 froze completely still on the crater floor.',
          'Instead of tapping random buttons, Nora crouched at eye level and traced an imaginary straight line from their controller at Base Camp toward the pit. A thick, metal-lined boulder ridge stood right in the middle of that path, blocking their straight-line radio signal from reaching the rover.',
        ],
        keyVocab: [
          {
            word: 'chassis',
            meaning: 'the main base frame that supports a vehicle’s wheels, motors, and parts',
          },
          {
            word: 'crested',
            meaning: 'reached and passed over the very top of a hill or ridge',
          },
          {
            word: 'imaginary',
            meaning: 'pictured in your mind rather than physically visible',
          },
        ],
        questions: [
          {
            id: 'en-ch-orbit-ep4-q1',
            skillTag: 'Detail',
            prompt: 'What change to Scout-4’s chassis stopped it from wobbling on the steep ramp?',
            choices: [
              'Moving the heavy battery pack low and centered between the wheel axles',
              'Removing the solar panel before climbing the ridge',
              'Making the plastic frame twice as tall',
              'Adding two extra scoops to the rear bumper',
            ],
            correctIndex: 0,
            explanation:
              'Paragraph 1 states that securing the heavy battery pack low and centered between the four axles lowered the center of gravity and eliminated wobbling.',
          },
          {
            id: 'en-ch-orbit-ep4-q2',
            skillTag: 'Inference',
            prompt: 'Why did Sam’s tablet display "SIGNAL LOST" after Scout-4 drove into Shadow Crater?',
            choices: [
              'Scout-4’s backup battery ran out of charge in the dark crater',
              'The ridged rubber wheels disconnected the antenna wires',
              'The Sun Lamp overheated the handheld tablet',
              'The thick metal-lined ridge stood in the way and blocked the straight-line radio signal',
            ],
            correctIndex: 3,
            explanation:
              'Nora traces the straight path from Base Camp to the crater floor and realizes the thick metal-lined ridge is blocking their radio signal.',
          },
          {
            id: 'en-ch-orbit-ep4-q3',
            skillTag: 'Character',
            prompt: 'How does Nora’s reaction to the "SIGNAL LOST" warning show strong scientific thinking?',
            choices: [
              'She rushes into the pit to push the rover by hand',
              'She stays calm and carefully checks what is blocking the signal’s path',
              'She blames Sam for steering too quickly down the rim',
              'She shuts off the tablet and asks Coach Vega to restart the clock',
            ],
            correctIndex: 1,
            explanation:
              'Rather than panicking or randomly tapping buttons, Nora crouches down and traces the radio signal’s line of sight to diagnose the exact obstacle.',
          },
        ],
      },
      {
        id: 'en-ch-orbit-ep5',
        episodeNumber: 5,
        title: 'Mission Accomplished',
        paragraphs: [
          '“Wait—remember the mission rulebook!” Sam exclaimed, pointing to their equipment crate. Every crew was allowed to deploy one portable signal relay along the outer perimeter of Crater Hall, just as real lunar satellites relay messages between Earth and craters hidden on the Moon’s far side.',
          'Sam handed Nora the control tablet, grabbed the lightweight relay tripod, sprinted up the observation walkway beside the rim, and aimed the small dish downward. From that elevated spot, the relay had an unobstructed line of sight to both Base Camp and the shadowed pit. Two seconds later, Nora’s tablet chimed bright green: SIGNAL RESTORED!',
          'With ninety seconds left, Nora eased Scout-4 forward, slid its front scoop neatly beneath the blue ice-core marker, and turned toward the exit slope. Powered by its charged battery on the shaded climb and then its angled solar panel across the sunlit ridge, the balanced, wide-wheeled rover never slipped or tipped once.',
          'Scout-4 rolled triumphantly across the Base Camp finish line with nineteen seconds to spare! Coach Vega pinned the Emerald Orbit Patch onto Nora and Sam’s jackets, praising how real science—and steady teamwork—had conquered every single obstacle.',
        ],
        keyVocab: [
          {
            word: 'perimeter',
            meaning: 'the outer boundary or edge around an area',
          },
          {
            word: 'unobstructed',
            meaning: 'completely clear and open, with nothing blocking the view or path',
          },
          {
            word: 'obstacle',
            meaning: 'a problem or physical barrier that stands in the way of reaching a goal',
          },
        ],
        questions: [
          {
            id: 'en-ch-orbit-ep5-q1',
            skillTag: 'Main Idea',
            prompt: 'What is the main theme of the Orbit Camp: Moon Rover Crew series?',
            choices: [
              'Building the fastest wheels matters more than following camp rules',
              'Solar rovers can only operate on flat indoor floor tiles',
              'Using scientific thinking and teamwork helps engineers overcome one challenge after another',
              'Only teams with the largest batteries can win the Emerald Orbit Patch',
            ],
            correctIndex: 2,
            explanation:
              'Across all five episodes, Nora and Sam diagnose and solve problems with solar angles, friction, center of gravity, and radio line of sight through teamwork and science.',
          },
          {
            id: 'en-ch-orbit-ep5-q2',
            skillTag: 'Detail',
            prompt: 'How did Sam restore communication between Base Camp and Scout-4?',
            choices: [
              'He set up a portable signal relay on the high walkway where it had a clear path to both Base Camp and the crater',
              'He moved the Sun Lamp directly over Shadow Crater',
              'He walked into the sand pit and attached a longer wire to Scout-4',
              'He swapped out Nora’s control tablet for a louder radio',
            ],
            correctIndex: 0,
            explanation:
              'Paragraphs 1 and 2 explain that Sam placed the portable relay tripod on the elevated rim walkway so it had an unobstructed line of sight to Base Camp and the crater floor.',
          },
          {
            id: 'en-ch-orbit-ep5-q3',
            skillTag: 'Vocabulary',
            prompt: 'In paragraph 2, what does the word "unobstructed" mean?',
            choices: [
              'Powered by solar energy',
              'Curved around a steep corner',
              'Weakened by thick metal walls',
              'Completely clear with nothing blocking the way',
            ],
            correctIndex: 3,
            explanation:
              'Raising the relay dish on the high walkway gave it a clear, open path—an unobstructed line of sight—around the boulder ridge.',
          },
        ],
      },
    ],
  },
];

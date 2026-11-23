import type { Collectible, MysteryPack, PackCategory, PackId, Rarity, RarityConfig } from './types';

export const PACK_COST = 25;

export const PACK_CATEGORIES: { id: 'all' | PackCategory; label: string }[] = [
  { id: 'all', label: 'All 30' },
  { id: 'holidays', label: 'Holidays' },
  { id: 'pets', label: 'Cute Animals' },
  { id: 'squishy', label: 'Squishy & Fairytale' },
  { id: 'classic', label: 'Classic' },
  { id: 'food', label: 'Food & Café' },
  { id: 'nature', label: 'Nature' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'arts', label: 'Arts & Gems' },
];

export const RARITY_ORDER: Rarity[] = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'chroma',
];

export const RARITY_CONFIGS: Record<Rarity, RarityConfig> = {
  common: {
    id: 'common',
    label: 'Common',
    weight: 48,
    resaleTokens: 5,
    colorHex: '#64748B',
    bgTintHex: '#F1F5F9',
  },
  uncommon: {
    id: 'uncommon',
    label: 'Uncommon',
    weight: 28,
    resaleTokens: 10,
    colorHex: '#059669',
    bgTintHex: '#ECFDF5',
  },
  rare: {
    id: 'rare',
    label: 'Rare',
    weight: 14,
    resaleTokens: 20,
    colorHex: '#2563EB',
    bgTintHex: '#EFF6FF',
  },
  epic: {
    id: 'epic',
    label: 'Epic',
    weight: 6.5,
    resaleTokens: 35,
    colorHex: '#7C3AED',
    bgTintHex: '#F5F3FF',
  },
  legendary: {
    id: 'legendary',
    label: 'Legendary',
    weight: 2.7,
    resaleTokens: 75,
    colorHex: '#D97706',
    bgTintHex: '#FFFBEB',
  },
  chroma: {
    id: 'chroma',
    label: 'Chroma',
    weight: 0.8,
    resaleTokens: 150,
    colorHex: '#DB2777',
    bgTintHex: '#FDF2F8',
  },
};

export const MYSTERY_PACKS: MysteryPack[] = [
  // CLASSIC 6
  {
    id: 'critter',
    name: 'Critter Pack',
    subtitle: 'Mythic foxes, otter mages & prismatic dragons',
    category: 'classic',
    cost: PACK_COST,
    accentHex: '#EA580C',
    surfaceHex: '#FFF7ED',
  },
  {
    id: 'sweet',
    name: 'Sweet Pack',
    subtitle: 'Boba bears, berry cakes & aurora sundaes',
    category: 'classic',
    cost: PACK_COST,
    accentHex: '#DB2777',
    surfaceHex: '#FDF2F8',
  },
  {
    id: 'space',
    name: 'Space Pack',
    subtitle: 'Astro corgis, comet whales & chroma narwhals',
    category: 'classic',
    cost: PACK_COST,
    accentHex: '#2563EB',
    surfaceHex: '#EFF6FF',
  },
  {
    id: 'ocean',
    name: 'Ocean Pack',
    subtitle: 'Pearl clams, coral seahorses & tide leviathans',
    category: 'classic',
    cost: PACK_COST,
    accentHex: '#0284C7',
    surfaceHex: '#F0F9FF',
  },
  {
    id: 'dino',
    name: 'Dino Pack',
    subtitle: 'Baby triceras, amber raptors & starlight brontos',
    category: 'classic',
    cost: PACK_COST,
    accentHex: '#15803D',
    surfaceHex: '#F0FDF4',
  },
  {
    id: 'magic',
    name: 'Magic Pack',
    subtitle: 'Quill sprites, spellbook foxes & archmage unicorns',
    category: 'classic',
    cost: PACK_COST,
    accentHex: '#7C3AED',
    surfaceHex: '#F5F3FF',
  },

  // FOOD & CAFÉ (3 NEW)
  {
    id: 'boba',
    name: 'Boba & Café Pack',
    subtitle: 'Pearl tea cats, matcha frogs & galaxy latte sprites',
    category: 'food',
    cost: PACK_COST,
    accentHex: '#B45309',
    surfaceHex: '#FFFBEB',
  },
  {
    id: 'bakery',
    name: 'Bakery Pack',
    subtitle: 'Croissant bears, pretzel pups & rainbow layer cakes',
    category: 'food',
    cost: PACK_COST,
    accentHex: '#D97706',
    surfaceHex: '#FEF3C7',
  },
  {
    id: 'sushi',
    name: 'Sushi & Bento Pack',
    subtitle: 'Onigiri kittens, salmon shibas & golden bento dragons',
    category: 'food',
    cost: PACK_COST,
    accentHex: '#E11D48',
    surfaceHex: '#FFF1F2',
  },

  // NATURE (3 NEW)
  {
    id: 'botanical',
    name: 'Botanical Garden Pack',
    subtitle: 'Sakura bunnies, succulent hedgehogs & moon orchid fairies',
    category: 'nature',
    cost: PACK_COST,
    accentHex: '#16A34A',
    surfaceHex: '#F0FDF4',
  },
  {
    id: 'arctic',
    name: 'Arctic & Snow Pack',
    subtitle: 'Penguin knights, snow fox royalty & aurora polar bears',
    category: 'nature',
    cost: PACK_COST,
    accentHex: '#0EA5E9',
    surfaceHex: '#F0F9FF',
  },
  {
    id: 'butterfly',
    name: 'Butterfly Meadow Pack',
    subtitle: 'Ladybug scouts, firefly lanterns & prism morpho butterflies',
    category: 'nature',
    cost: PACK_COST,
    accentHex: '#9333EA',
    surfaceHex: '#FAF5FF',
  },

  // ADVENTURE & FESTIVAL (3 NEW)
  {
    id: 'safari',
    name: 'Safari Jungle Pack',
    subtitle: 'Cloud sloths, giraffe explorers & golden savanna lions',
    category: 'adventure',
    cost: PACK_COST,
    accentHex: '#CA8A04',
    surfaceHex: '#FEFCE8',
  },
  {
    id: 'festival',
    name: 'Festival & Lantern Pack',
    subtitle: 'Moon rabbits, lucky maneki cats & prism sky dragons',
    category: 'adventure',
    cost: PACK_COST,
    accentHex: '#DC2626',
    surfaceHex: '#FEF2F2',
  },
  {
    id: 'mythology',
    name: 'Mythology Pack',
    subtitle: 'Baby pegasus, kitsune sages & celestial prism griffins',
    category: 'adventure',
    cost: PACK_COST,
    accentHex: '#4F46E5',
    surfaceHex: '#EEF2FF',
  },

  // ARTS & GEMS (3 NEW)
  {
    id: 'music',
    name: 'Music & Art Pack',
    subtitle: 'Guitar cats, ballet swans & rainbow DJ unicorns',
    category: 'arts',
    cost: PACK_COST,
    accentHex: '#EC4899',
    surfaceHex: '#FDF2F8',
  },
  {
    id: 'arcade',
    name: 'Retro Arcade Pack',
    subtitle: '8-bit slimes, pixel bots & chroma joystick champions',
    category: 'arts',
    cost: PACK_COST,
    accentHex: '#0D9488',
    surfaceHex: '#F0FDFA',
  },
  {
    id: 'crystal',
    name: 'Crystal & Gems Pack',
    subtitle: 'Quartz kittens, sapphire turtles & prism diamond spirits',
    category: 'arts',
    cost: PACK_COST,
    accentHex: '#6366F1',
    surfaceHex: '#EEF2FF',
  },

  // HOLIDAYS (5 NEW)
  {
    id: 'halloween',
    name: 'Halloween Spooky Pack',
    subtitle: 'Pumpkin kitties, candy ghosts & midnight prism pumpkins',
    category: 'holidays',
    cost: PACK_COST,
    accentHex: '#EA580C',
    surfaceHex: '#FFF7ED',
  },
  {
    id: 'lunar',
    name: 'Lunar New Year Pack',
    subtitle: 'Lion pups, red-envelope bunnies & jade cloud dragons',
    category: 'holidays',
    cost: PACK_COST,
    accentHex: '#DC2626',
    surfaceHex: '#FEF2F2',
  },
  {
    id: 'winter',
    name: 'Winter Holiday Pack',
    subtitle: 'Gingerbread bears, cocoa fawns & aurora snow angels',
    category: 'holidays',
    cost: PACK_COST,
    accentHex: '#0284C7',
    surfaceHex: '#F0F9FF',
  },
  {
    id: 'midautumn',
    name: 'Mid-Autumn Moon Pack',
    subtitle: 'Jade mochi rabbits, pomelo capybaras & harvest moon deer',
    category: 'holidays',
    cost: PACK_COST,
    accentHex: '#D97706',
    surfaceHex: '#FFFBEB',
  },
  {
    id: 'easter',
    name: 'Spring & Easter Pack',
    subtitle: 'Painted-egg bunnies, tulip chicks & prism blossom fairies',
    category: 'holidays',
    cost: PACK_COST,
    accentHex: '#EC4899',
    surfaceHex: '#FDF2F8',
  },

  // CUTE ANIMALS (3 NEW)
  {
    id: 'catcafe',
    name: 'Cat Café Pack',
    subtitle: 'Toast tabbies, calico lattes & nebula fortune cats',
    category: 'pets',
    cost: PACK_COST,
    accentHex: '#C2410C',
    surfaceHex: '#FFF7ED',
  },
  {
    id: 'capybara',
    name: 'Capybara & Otter Pack',
    subtitle: 'Yuzu capybaras, pearl sea otters & aurora hot-spring kings',
    category: 'pets',
    cost: PACK_COST,
    accentHex: '#0D9488',
    surfaceHex: '#F0FDFA',
  },
  {
    id: 'forest',
    name: 'Forest Friends Pack',
    subtitle: 'Red pandas, snow titmice, flying squirrels & jade stags',
    category: 'pets',
    cost: PACK_COST,
    accentHex: '#15803D',
    surfaceHex: '#F0FDF4',
  },

  // SQUISHY & ORIGINAL FAIRYTALE (4 NEW)
  {
    id: 'mochi',
    name: 'Mochi Squishy Pack',
    subtitle: 'Soft strawberry daifuku, pudding kitties & aurora mochis',
    category: 'squishy',
    cost: PACK_COST,
    accentHex: '#E11D48',
    surfaceHex: '#FFF1F2',
  },
  {
    id: 'cloudsquishy',
    name: 'Cloud Squishy Pack',
    subtitle: 'Marshmallow lambs, starry plush bears & galaxy whale pillows',
    category: 'squishy',
    cost: PACK_COST,
    accentHex: '#7C3AED',
    surfaceHex: '#F5F3FF',
  },
  {
    id: 'fairytale',
    name: 'Fairytale Castle Pack',
    subtitle: 'Glass-slipper bunnies, pumpkin carriages & crystal castle dragons',
    category: 'squishy',
    cost: PACK_COST,
    accentHex: '#2563EB',
    surfaceHex: '#EFF6FF',
  },
  {
    id: 'fairyland',
    name: 'Starlight Fairyland Pack',
    subtitle: 'Dewdrop pixies, mushroom sprites & eternal aurora fairy queens',
    category: 'squishy',
    cost: PACK_COST,
    accentHex: '#9333EA',
    surfaceHex: '#FAF5FF',
  },
];

export const COLLECTIBLES: Collectible[] = [
  // 1. CRITTER PACK (8)
  { id: 'critter-sprout-bunny', name: 'Clover Bunny', packId: 'critter', rarity: 'common', tagline: 'Hops through every chapter with lucky ears.', accentHex: '#65A30D', bgHex: '#ECFCCB' },
  { id: 'critter-acorn-hedgehog', name: 'Acorn Hedgehog', packId: 'critter', rarity: 'common', tagline: 'Collects crisp new words under autumn leaves.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'critter-otter-mage', name: 'Otter Mage', packId: 'critter', rarity: 'uncommon', tagline: 'Casts spelling charms with a river-stone wand.', accentHex: '#0D9488', bgHex: '#CCFBF1' },
  { id: 'critter-red-panda', name: 'Lantern Red Panda', packId: 'critter', rarity: 'uncommon', tagline: 'Night-owl reader with a glowing scarf.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'critter-crystal-fox', name: 'Crystal Fox', packId: 'critter', rarity: 'rare', tagline: 'Her prism tail sparkles on every Combo.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'critter-moon-owl', name: 'Moonlight Owl', packId: 'critter', rarity: 'epic', tagline: 'Keeper of the midnight vocabulary library.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'critter-sun-phoenix', name: 'Solar Phoenix', packId: 'critter', rarity: 'legendary', tagline: 'Rises in golden sparks when a sentence shines.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'critter-chroma-dragon', name: 'Prism Cloud Dragon', packId: 'critter', rarity: 'chroma', tagline: 'Ultra-rare rainbow guardian of QuestVault.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 2. SWEET PACK (8)
  { id: 'sweet-honey-toast', name: 'Honey Toast', packId: 'sweet', rarity: 'common', tagline: 'Warm, crunchy, and always ready for a quick Run.', accentHex: '#CA8A04', bgHex: '#FEF9C3' },
  { id: 'sweet-matcha-mochi', name: 'Matcha Mochi', packId: 'sweet', rarity: 'common', tagline: 'Squishy studio buddy with a calm smile.', accentHex: '#16A34A', bgHex: '#DCFCE7' },
  { id: 'sweet-boba-bear', name: 'Brown Sugar Boba Bear', packId: 'sweet', rarity: 'uncommon', tagline: 'Powered by tapioca pearls and bonus Combos.', accentHex: '#92400E', bgHex: '#FEF3C7' },
  { id: 'sweet-berry-shortcake', name: 'Berry Cake Cat', packId: 'sweet', rarity: 'uncommon', tagline: 'Topped with fresh strawberries and neat writing.', accentHex: '#E11D48', bgHex: '#FFE4E6' },
  { id: 'sweet-mint-gelato', name: 'Frost Swirl Penguin', packId: 'sweet', rarity: 'rare', tagline: 'Stays super chill even on tricky words.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'sweet-macaron-unicorn', name: 'Starlight Macaron', packId: 'sweet', rarity: 'epic', tagline: 'Layered with lavender cream and sparkly verbs.', accentHex: '#9333EA', bgHex: '#F3E8FF' },
  { id: 'sweet-golden-croissant', name: 'Royal Crown Waffle', packId: 'sweet', rarity: 'legendary', tagline: 'Drizzled in pure golden syrup from the Token Chest.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'sweet-chroma-parfait', name: 'Aurora Sundae Spirit', packId: 'sweet', rarity: 'chroma', tagline: 'Shimmering cosmic dessert seen once in a blue moon.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 3. SPACE PACK (8)
  { id: 'space-moon-rock', name: 'Crater Pup', packId: 'space', rarity: 'common', tagline: 'Barks across low-gravity craters looking for clues.', accentHex: '#475569', bgHex: '#F1F5F9' },
  { id: 'space-star-slime', name: 'Starlight Jelly', packId: 'space', rarity: 'common', tagline: 'Bouncy glow-buddy drifting past Saturn.', accentHex: '#0891B2', bgHex: '#CFFAFE' },
  { id: 'space-astro-corgi', name: 'Astro Corgi', packId: 'space', rarity: 'uncommon', tagline: 'Short legs, giant leaps across every Tier.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'space-saturn-cat', name: 'Ringed Saturn Cat', packId: 'space', rarity: 'uncommon', tagline: 'Balances glowing hoops while purring.', accentHex: '#0D9488', bgHex: '#CCFBF1' },
  { id: 'space-comet-whale', name: 'Comet Whale', packId: 'space', rarity: 'rare', tagline: 'Swims through stardust leaving glittering trails.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'space-nebula-axolotl', name: 'Nebula Axolotl', packId: 'space', rarity: 'epic', tagline: 'Floats in violet clouds collecting vivid adjectives.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'space-nova-phoenix', name: 'Supernova Griffin', packId: 'space', rarity: 'legendary', tagline: 'Flies faster than light between star systems.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'space-chroma-narwhal', name: 'Celestial Chroma Narwhal', packId: 'space', rarity: 'chroma', tagline: 'Its rainbow horn unlocks galaxies of rare words.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 4. OCEAN PACK (8)
  { id: 'ocean-pearl-clam', name: 'Pearl Clam', packId: 'ocean', rarity: 'common', tagline: 'Guards shiny new vocabulary pearls on the reef.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'ocean-bubble-turtle', name: 'Bubbles Sea Turtle', packId: 'ocean', rarity: 'common', tagline: 'Cruises calm currents at a steady learning pace.', accentHex: '#059669', bgHex: '#D1FAE5' },
  { id: 'ocean-coral-seahorse', name: 'Coral Seahorse', packId: 'ocean', rarity: 'uncommon', tagline: 'Tucks into coral reefs to read adventure tales.', accentHex: '#FB7185', bgHex: '#FFE4E6' },
  { id: 'ocean-jelly-dancer', name: 'Glow Jellyfish', packId: 'ocean', rarity: 'uncommon', tagline: 'Lights up twilight waves with gentle pulses.', accentHex: '#06B6D4', bgHex: '#CFFAFE' },
  { id: 'ocean-dolphin-scout', name: 'Wave Dolphin', packId: 'ocean', rarity: 'rare', tagline: 'Leaps over cresting waves on clean Combos.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'ocean-glow-octopus', name: 'Starry Octopus', packId: 'ocean', rarity: 'epic', tagline: 'Writes eight clever sentences all at once.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'ocean-koi-dragon', name: 'Golden Koi Dragon', packId: 'ocean', rarity: 'legendary', tagline: 'Swims up waterfalls to claim legendary mastery.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'ocean-chroma-leviathan', name: 'Chroma Tide Leviathan', packId: 'ocean', rarity: 'chroma', tagline: 'Prismatic deep-sea sovereign shimmering with reef light.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 5. DINO PACK (8)
  { id: 'dino-baby-tricera', name: 'Hatchling Tricera', packId: 'dino', rarity: 'common', tagline: 'Fresh out of the shell and eager to learn.', accentHex: '#16A34A', bgHex: '#DCFCE7' },
  { id: 'dino-leaf-stego', name: 'Leaf Stego', packId: 'dino', rarity: 'common', tagline: 'Munches fern snacks while practicing context clues.', accentHex: '#65A30D', bgHex: '#ECFCCB' },
  { id: 'dino-amber-raptor', name: 'Amber Raptor', packId: 'dino', rarity: 'uncommon', tagline: 'Zips through Word Sprints at lightning speed.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'dino-fossil-rex', name: 'Museum Fossil Rex', packId: 'dino', rarity: 'uncommon', tagline: 'Uncovered in a Grade 4 science expedition.', accentHex: '#64748B', bgHex: '#F1F5F9' },
  { id: 'dino-cloud-ptero', name: 'Sky Pterodactyl', packId: 'dino', rarity: 'rare', tagline: 'Glides above canyons spotting vivid verbs.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'dino-crystal-ankylo', name: 'Crystal Ankylo', packId: 'dino', rarity: 'epic', tagline: 'Armored in amethyst spikes against tricky words.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'dino-volcanic-rex', name: 'Volcanic Rex King', packId: 'dino', rarity: 'legendary', tagline: 'Crowned champion of the Jurassic word arena.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'dino-chroma-bronto', name: 'Chroma Starlight Bronto', packId: 'dino', rarity: 'chroma', tagline: 'Tall enough to pluck rainbow words from the clouds.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 6. MAGIC PACK (8)
  { id: 'magic-quill-sprite', name: 'Quill Sprite', packId: 'magic', rarity: 'common', tagline: 'Dips its feather in ink whenever you write.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'magic-teacup-potion', name: 'Teacup Potion', packId: 'magic', rarity: 'common', tagline: 'Brews cozy mint sparks for focus and calm.', accentHex: '#0D9488', bgHex: '#CCFBF1' },
  { id: 'magic-bookworm-cat', name: 'Library Cat', packId: 'magic', rarity: 'uncommon', tagline: 'Naps atop tall stacks of mystery novels.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'magic-lantern-bat', name: 'Lantern Bat', packId: 'magic', rarity: 'uncommon', tagline: 'Carries a tiny golden lamp down secret hallways.', accentHex: '#6D28D9', bgHex: '#EDE9FE' },
  { id: 'magic-spellbook-fox', name: 'Spellbook Fox', packId: 'magic', rarity: 'rare', tagline: 'Flips enchanted pages to reveal hidden definitions.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'magic-crystal-owl', name: 'Crystal Ball Owl', packId: 'magic', rarity: 'epic', tagline: 'Predicts every tough question before it arrives.', accentHex: '#7C3AED', bgHex: '#F3E8FF' },
  { id: 'magic-phoenix-tome', name: 'Phoenix Grimoire', packId: 'magic', rarity: 'legendary', tagline: 'An ancient golden book that cheers every sentence.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'magic-chroma-unicorn', name: 'Chroma Archmage Unicorn', packId: 'magic', rarity: 'chroma', tagline: 'Master of all words and prismatic spells.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 7. BOBA & CAFÉ PACK (8)
  { id: 'boba-milk-cat', name: 'Pearl Tea Cat', packId: 'boba', rarity: 'common', tagline: 'Sips brown-sugar milk tea after every quest.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'boba-matcha-frog', name: 'Matcha Latte Frog', packId: 'boba', rarity: 'common', tagline: 'Whisks foamy green tea in a cozy mug.', accentHex: '#16A34A', bgHex: '#DCFCE7' },
  { id: 'boba-taro-bunny', name: 'Taro Cream Bunny', packId: 'boba', rarity: 'uncommon', tagline: 'Sweet violet clouds topped with chewy pearls.', accentHex: '#9333EA', bgHex: '#F3E8FF' },
  { id: 'boba-berry-fox', name: 'Strawberry Milk Fox', packId: 'boba', rarity: 'uncommon', tagline: 'Blends fresh berries for speedy Math Sprints.', accentHex: '#E11D48', bgHex: '#FFE4E6' },
  { id: 'boba-pudding-shiba', name: 'Caramel Pudding Shiba', packId: 'boba', rarity: 'rare', tagline: 'Wiggles happily whenever you hit a 5× Combo.', accentHex: '#D97706', bgHex: '#FEF9C3' },
  { id: 'boba-espresso-owl', name: 'Barista Cocoa Owl', packId: 'boba', rarity: 'epic', tagline: 'Draws leafy latte art while reviewing flashcards.', accentHex: '#78350F', bgHex: '#FFEDD5' },
  { id: 'boba-golden-teapot', name: 'Royal Honey Teapot', packId: 'boba', rarity: 'legendary', tagline: 'Pours shimmering gold tea for Daily Champions.', accentHex: '#CA8A04', bgHex: '#FEF3C7' },
  { id: 'boba-chroma-latte', name: 'Galaxy Pearl Spirit', packId: 'boba', rarity: 'chroma', tagline: 'Swirling cosmic boba bursting with starlight pearls.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 8. BAKERY PACK (8)
  { id: 'bakery-croissant-bear', name: 'Croissant Bear', packId: 'bakery', rarity: 'common', tagline: 'Flaky, golden, and fresh out of the oven.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'bakery-pretzel-pup', name: 'Pretzel Pup', packId: 'bakery', rarity: 'common', tagline: 'Twisted ears and a sprinkle of sea salt.', accentHex: '#B45309', bgHex: '#FFEDD5' },
  { id: 'bakery-donut-cat', name: 'Glazed Donut Cat', packId: 'bakery', rarity: 'uncommon', tagline: 'Wears pink frosting and rainbow sprinkles.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'bakery-cinnamon-bunny', name: 'Cinnamon Roll Bunny', packId: 'bakery', rarity: 'uncommon', tagline: 'Swirled with cozy spice and sweet icing.', accentHex: '#A16207', bgHex: '#FEF9C3' },
  { id: 'bakery-baguette-dachshund', name: 'Baguette Pup', packId: 'bakery', rarity: 'rare', tagline: 'Long crusty loaf delivering warm study snacks.', accentHex: '#CA8A04', bgHex: '#FEF3C7' },
  { id: 'bakery-cupcake-fox', name: 'Frosting Swirl Fox', packId: 'bakery', rarity: 'epic', tagline: 'Crowned with a ruby cherry and star dust.', accentHex: '#9333EA', bgHex: '#F3E8FF' },
  { id: 'bakery-golden-tart', name: 'Royal Berry Tart', packId: 'bakery', rarity: 'legendary', tagline: 'Prize-winning pastry from the Grand Bake-Off.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'bakery-chroma-cake', name: 'Prism Layer Cake', packId: 'bakery', rarity: 'chroma', tagline: 'Seven rainbow tiers celebrating total mastery.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 9. SUSHI & BENTO PACK (8)
  { id: 'sushi-onigiri-cat', name: 'Onigiri Kitten', packId: 'sushi', rarity: 'common', tagline: 'Wrapped snug in a crispy seaweed belt.', accentHex: '#0F172A', bgHex: '#F1F5F9' },
  { id: 'sushi-tamago-chick', name: 'Tamago Chick', packId: 'sushi', rarity: 'common', tagline: 'Fluffy sweet egg rolled into a sunny pillow.', accentHex: '#EAB308', bgHex: '#FEF9C3' },
  { id: 'sushi-salmon-shiba', name: 'Salmon Nigiri Shiba', packId: 'sushi', rarity: 'uncommon', tagline: 'Balances bright salmon on a tidy rice cushion.', accentHex: '#F97316', bgHex: '#FFEDD5' },
  { id: 'sushi-shrimp-bunny', name: 'Tempura Shrimp Bunny', packId: 'sushi', rarity: 'uncommon', tagline: 'Extra crunchy tail with a cheerful grin.', accentHex: '#EA580C', bgHex: '#FEE2E2' },
  { id: 'sushi-ramen-panda', name: 'Ramen Bowl Panda', packId: 'sushi', rarity: 'rare', tagline: 'Relaxes in a warm noodle bowl with naruto swirls.', accentHex: '#DC2626', bgHex: '#FFE4E6' },
  { id: 'sushi-maki-otter', name: 'Avocado Maki Otter', packId: 'sushi', rarity: 'epic', tagline: 'Rolls tidy sushi wheels while solving fractions.', accentHex: '#059669', bgHex: '#D1FAE5' },
  { id: 'sushi-golden-bento', name: 'Emperor Bento Box', packId: 'sushi', rarity: 'legendary', tagline: 'Lacquered gold lunchbox packed with rare treats.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'sushi-chroma-dragonroll', name: 'Chroma Dragon Roll', packId: 'sushi', rarity: 'chroma', tagline: 'Shimmering rainbow roll guarded by sushi masters.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 10. BOTANICAL GARDEN PACK (8)
  { id: 'botanical-sprout-frog', name: 'Dewdrop Leaf Frog', packId: 'botanical', rarity: 'common', tagline: 'Hops from lily pad to lily pad after rain.', accentHex: '#16A34A', bgHex: '#DCFCE7' },
  { id: 'botanical-succulent-hog', name: 'Succulent Hedgehog', packId: 'botanical', rarity: 'common', tagline: 'Grows tiny jade rosettes on its cozy back.', accentHex: '#0D9488', bgHex: '#CCFBF1' },
  { id: 'botanical-sunflower-corgi', name: 'Sunflower Corgi', packId: 'botanical', rarity: 'uncommon', tagline: 'Bright golden petals framing a sunny smile.', accentHex: '#EAB308', bgHex: '#FEF9C3' },
  { id: 'botanical-mushroom-owl', name: 'Toadstool Owl', packId: 'botanical', rarity: 'uncommon', tagline: 'Wears a spotted crimson cap under tall pines.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'botanical-sakura-bunny', name: 'Sakura Blossom Bunny', packId: 'botanical', rarity: 'rare', tagline: 'Drifts through spring petals reading poetry.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'botanical-lavender-fox', name: 'Lavender Dew Fox', packId: 'botanical', rarity: 'epic', tagline: 'Smells like calm purple gardens at dusk.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'botanical-golden-bonsai', name: 'Golden Bonsai Spirit', packId: 'botanical', rarity: 'legendary', tagline: 'Centuries of wisdom blooming in golden leaves.', accentHex: '#CA8A04', bgHex: '#FEF3C7' },
  { id: 'botanical-chroma-orchid', name: 'Prism Moon Orchid', packId: 'botanical', rarity: 'chroma', tagline: 'Blooms only when every petal shines in rainbow light.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 11. ARCTIC & SNOW PACK (8)
  { id: 'arctic-seal-mochi', name: 'Snowball Seal', packId: 'arctic', rarity: 'common', tagline: 'Slides across icy hills without a single slip.', accentHex: '#64748B', bgHex: '#F1F5F9' },
  { id: 'arctic-puffin-pal', name: 'Scarf Puffin', packId: 'arctic', rarity: 'common', tagline: 'Bright orange beak and a cozy knitted scarf.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'arctic-penguin-knight', name: 'Penguin Knight', packId: 'arctic', rarity: 'uncommon', tagline: 'Defends the ice castle with a snowball shield.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'arctic-snow-owl', name: 'Blizzard Snowy Owl', packId: 'arctic', rarity: 'uncommon', tagline: 'Glides silently across glittering snowdrifts.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'arctic-polar-bear', name: 'Glacier Polar Bear', packId: 'arctic', rarity: 'rare', tagline: 'Loves chilly math puzzles and starry skies.', accentHex: '#0891B2', bgHex: '#CFFAFE' },
  { id: 'arctic-snow-fox', name: 'Frost Crown Fox', packId: 'arctic', rarity: 'epic', tagline: 'Leaves tiny snowflake prints on every page.', accentHex: '#6366F1', bgHex: '#E0E7FF' },
  { id: 'arctic-ice-reindeer', name: 'Starlight Reindeer', packId: 'arctic', rarity: 'legendary', tagline: 'Golden antlers glowing like northern beacons.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'arctic-chroma-narwhal', name: 'Aurora Crystal Bear', packId: 'arctic', rarity: 'chroma', tagline: 'Paints the arctic sky with northern lights.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 12. BUTTERFLY MEADOW PACK (8)
  { id: 'butterfly-ladybug-scout', name: 'Polka Ladybug', packId: 'butterfly', rarity: 'common', tagline: 'Counts spots like a champion mathematician.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'butterfly-honey-bee', name: 'Honeycomb Bee', packId: 'butterfly', rarity: 'common', tagline: 'Buzzes between blooms gathering sweet words.', accentHex: '#EAB308', bgHex: '#FEF9C3' },
  { id: 'butterfly-firefly-jar', name: 'Lantern Firefly', packId: 'butterfly', rarity: 'uncommon', tagline: 'Lights up evening reading with a warm glow.', accentHex: '#65A30D', bgHex: '#ECFCCB' },
  { id: 'butterfly-monarch-wing', name: 'Monarch Glider', packId: 'butterfly', rarity: 'uncommon', tagline: 'Flies thousands of miles with steady grace.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'butterfly-blue-morpho', name: 'Cobalt Morpho', packId: 'butterfly', rarity: 'rare', tagline: 'Dazzling sapphire wings shimmering in sunlight.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'butterfly-luna-moth', name: 'Moonbeam Luna Moth', packId: 'butterfly', rarity: 'epic', tagline: 'Mint-emerald wings fluttering beneath crescent moons.', accentHex: '#0D9488', bgHex: '#CCFBF1' },
  { id: 'butterfly-golden-beetle', name: 'Sunburst Scarab', packId: 'butterfly', rarity: 'legendary', tagline: 'Polished gold armor prized across the meadow.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'butterfly-chroma-swallowtail', name: 'Prism Swallowtail', packId: 'butterfly', rarity: 'chroma', tagline: 'Scatters rainbow stardust with every wingbeat.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 13. SAFARI JUNGLE PACK (8)
  { id: 'safari-cloud-sloth', name: 'Cloud Sloth', packId: 'safari', rarity: 'common', tagline: 'Takes its time and never rushes a careful answer.', accentHex: '#78716C', bgHex: '#F5F5F4' },
  { id: 'safari-meerkat-scout', name: 'Meerkat Lookout', packId: 'safari', rarity: 'common', tagline: 'Stands tall on tiptoes spotting context clues.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'safari-giraffe-explorer', name: 'Giraffe Explorer', packId: 'safari', rarity: 'uncommon', tagline: 'Reaches the highest branches for tricky vocab.', accentHex: '#CA8A04', bgHex: '#FEF9C3' },
  { id: 'safari-chameleon-artist', name: 'Palette Chameleon', packId: 'safari', rarity: 'uncommon', tagline: 'Changes colors to match every arcade tile.', accentHex: '#16A34A', bgHex: '#DCFCE7' },
  { id: 'safari-toucan-singer', name: 'Tropic Toucan', packId: 'safari', rarity: 'rare', tagline: 'Bright rainbow beak cheering every clean streak.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'safari-jade-panther', name: 'Emerald Panther', packId: 'safari', rarity: 'epic', tagline: 'Leaps swiftly through timed Blitz challenges.', accentHex: '#4F46E5', bgHex: '#E0E7FF' },
  { id: 'safari-golden-lion', name: 'Sunmane Lion King', packId: 'safari', rarity: 'legendary', tagline: 'Crowned guardian of the golden savanna.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'safari-chroma-elephant', name: 'Prism Jungle Elephant', packId: 'safari', rarity: 'chroma', tagline: 'Remembers every single word it has ever heard.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 14. FESTIVAL & LANTERN PACK (8)
  { id: 'festival-tangyuan-duo', name: 'Sweet Tangyuan', packId: 'festival', rarity: 'common', tagline: 'Warm round rice dumpling full of sweet sesame.', accentHex: '#F43F5E', bgHex: '#FFE4E6' },
  { id: 'festival-zongzi-buddy', name: 'Bamboo Zongzi', packId: 'festival', rarity: 'common', tagline: 'Cozy triangle wrapped in fragrant green bamboo.', accentHex: '#15803D', bgHex: '#DCFCE7' },
  { id: 'festival-moon-rabbit', name: 'Mid-Autumn Moon Rabbit', packId: 'festival', rarity: 'uncommon', tagline: 'Shares mooncakes beneath a glowing harvest moon.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'festival-sky-lantern', name: 'Wish Sky Lantern', packId: 'festival', rarity: 'uncommon', tagline: 'Floats upward carrying bright learning wishes.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'festival-lucky-cat', name: 'Lucky Maneki Cat', packId: 'festival', rarity: 'rare', tagline: 'Waves a golden paw to summon bonus Tokens.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'festival-lion-dancer', name: 'Crimson Lion Dancer', packId: 'festival', rarity: 'epic', tagline: 'Dances to festive drums on every quest clear.', accentHex: '#E11D48', bgHex: '#FFE4E6' },
  { id: 'festival-golden-dragon', name: 'Imperial Parade Dragon', packId: 'festival', rarity: 'legendary', tagline: 'Soars through golden sparks bringing good fortune.', accentHex: '#CA8A04', bgHex: '#FEF9C3' },
  { id: 'festival-chroma-phoenix', name: 'Prism Lantern Phoenix', packId: 'festival', rarity: 'chroma', tagline: 'Radiant festival spirit shining across all seasons.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 15. MYTHOLOGY PACK (8)
  { id: 'mythology-baby-pegasus', name: 'Cloud Pegasus', packId: 'mythology', rarity: 'common', tagline: 'Flutters tiny feathered wings over Mount Olympus.', accentHex: '#3B82F6', bgHex: '#DBEAFE' },
  { id: 'mythology-mini-yeti', name: 'Cozy Mini Yeti', packId: 'mythology', rarity: 'common', tagline: 'Friendly mountain legend who loves storytime.', accentHex: '#0891B2', bgHex: '#CFFAFE' },
  { id: 'mythology-kitsune-pup', name: 'Starlight Kitsune', packId: 'mythology', rarity: 'uncommon', tagline: 'Clever multi-tailed fox who adores riddles.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'mythology-sphinx-kitten', name: 'Riddle Sphinx Cat', packId: 'mythology', rarity: 'uncommon', tagline: 'Loves clever word puzzles and golden crowns.', accentHex: '#CA8A04', bgHex: '#FEF9C3' },
  { id: 'mythology-mercat-pearl', name: 'Tide Mercat', packId: 'mythology', rarity: 'rare', tagline: 'Half kitten, half shimmering sea legend.', accentHex: '#0D9488', bgHex: '#CCFBF1' },
  { id: 'mythology-thunder-kirin', name: 'Storm Kirin', packId: 'mythology', rarity: 'epic', tagline: 'Gentle mythic guardian wreathed in violet sparks.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'mythology-sun-griffin', name: 'Golden Sun Griffin', packId: 'mythology', rarity: 'legendary', tagline: 'Soars above ancient libraries guarding gold chests.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'mythology-chroma-hydra', name: 'Celestial Prism Hydra', packId: 'mythology', rarity: 'chroma', tagline: 'Three cheerful rainbow heads with triple brainpower.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 16. MUSIC & ART PACK (8)
  { id: 'music-palette-otter', name: 'Paint Palette Otter', packId: 'music', rarity: 'common', tagline: 'Splashes bright watercolors across every page.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'music-guitar-cat', name: 'Acoustic Guitar Cat', packId: 'music', rarity: 'common', tagline: 'Strums happy chords after every correct streak.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'music-piano-panda', name: 'Piano Keys Panda', packId: 'music', rarity: 'uncommon', tagline: 'Black and white fur matching a grand piano.', accentHex: '#334155', bgHex: '#F1F5F9' },
  { id: 'music-ballet-swan', name: 'Ribbon Ballet Swan', packId: 'music', rarity: 'uncommon', tagline: 'Twirls gracefully across a sunlit stage.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'music-origami-crane', name: 'Origami Paper Crane', packId: 'music', rarity: 'rare', tagline: 'Folded with precision and a dash of magic.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'music-star-violin', name: 'Starlight Violin Fox', packId: 'music', rarity: 'epic', tagline: 'Plays glowing melodies beneath starry curtains.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'music-golden-harp', name: 'Royal Golden Harp', packId: 'music', rarity: 'legendary', tagline: 'Sings triumphant fanfares for chest unlocks.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'music-chroma-dj', name: 'Rainbow DJ Unicorn', packId: 'music', rarity: 'chroma', tagline: 'Spins neon beats with headphones glowing in prism hues.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 17. RETRO ARCADE PACK (8)
  { id: 'arcade-pixel-slime', name: '8-Bit Mint Slime', packId: 'arcade', rarity: 'common', tagline: 'Bouncy retro buddy straight from level 1-1.', accentHex: '#10B981', bgHex: '#D1FAE5' },
  { id: 'arcade-beep-bot', name: 'Beep-Boop Bot', packId: 'arcade', rarity: 'common', tagline: 'Calculates multiplication facts in milliseconds.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'arcade-coin-ghost', name: 'Neon Pixel Ghost', packId: 'arcade', rarity: 'uncommon', tagline: 'Chases high scores through glowing mazes.', accentHex: '#9333EA', bgHex: '#F3E8FF' },
  { id: 'arcade-star-cartridge', name: 'Turbo Cartridge Pup', packId: 'arcade', rarity: 'uncommon', tagline: 'Loaded with secret bonus stages and combos.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'arcade-pixel-dragon', name: 'Voxel Fire Dragon', packId: 'arcade', rarity: 'rare', tagline: 'Breathes blocky sparks during Endless Blitz.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'arcade-cyber-cat', name: 'Synthwave Visor Cat', packId: 'arcade', rarity: 'epic', tagline: 'Wears glowing retro shades for speedruns.', accentHex: '#DB2777', bgHex: '#FCE7F3' },
  { id: 'arcade-golden-trophy', name: 'Golden Joystick Champ', packId: 'arcade', rarity: 'legendary', tagline: 'Top of the arcade leaderboard every single week.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'arcade-chroma-cabinet', name: 'Prism Arcade Legend', packId: 'arcade', rarity: 'chroma', tagline: 'Glittering holographic hero of the pixel realm.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 18. CRYSTAL & GEMS PACK (8)
  { id: 'crystal-rose-quartz', name: 'Rose Quartz Kitten', packId: 'crystal', rarity: 'common', tagline: 'Soft blush crystal radiating calm study vibes.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'crystal-citrine-pup', name: 'Sun Citrine Pup', packId: 'crystal', rarity: 'common', tagline: 'Sunny yellow gemstone sparkling with energy.', accentHex: '#EAB308', bgHex: '#FEF9C3' },
  { id: 'crystal-jade-turtle', name: 'Emerald Jade Turtle', packId: 'crystal', rarity: 'uncommon', tagline: 'Polished green shell symbolizing steady growth.', accentHex: '#059669', bgHex: '#D1FAE5' },
  { id: 'crystal-amethyst-owl', name: 'Amethyst Geode Owl', packId: 'crystal', rarity: 'uncommon', tagline: 'Hides a glittering purple cave beneath its wings.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'crystal-sapphire-fox', name: 'Sapphire Prism Fox', packId: 'crystal', rarity: 'rare', tagline: 'Deep ocean-blue facets gleaming with cleverness.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'crystal-ruby-dragon', name: 'Ruby Crown Dragon', packId: 'crystal', rarity: 'epic', tagline: 'Blazing crimson gem guarding the secret vault.', accentHex: '#E11D48', bgHex: '#FFE4E6' },
  { id: 'crystal-opal-unicorn', name: 'Moonstone Opal Unicorn', packId: 'crystal', rarity: 'legendary', tagline: 'Shimmers with pearly blue and gold fire.', accentHex: '#6366F1', bgHex: '#E0E7FF' },
  { id: 'crystal-chroma-diamond', name: 'Prism Diamond Spirit', packId: 'crystal', rarity: 'chroma', tagline: 'The rarest jewel in QuestVault refracting every color.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 19. HALLOWEEN SPOOKY PACK (8)
  { id: 'halloween-pumpkin-cat', name: 'Pumpkin Patch Kitty', packId: 'halloween', rarity: 'common', tagline: 'Pops out of a carved pumpkin with a cozy grin.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'halloween-candy-ghost', name: 'Candy Corn Ghost', packId: 'halloween', rarity: 'common', tagline: 'Floats around sharing sweet treats and gentle boos.', accentHex: '#F59E0B', bgHex: '#FEF3C7' },
  { id: 'halloween-witch-kitty', name: 'Starry Witch Cat', packId: 'halloween', rarity: 'uncommon', tagline: 'Wears a pointed violet hat dusted with gold stars.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'halloween-berry-bat', name: 'Berry Gummy Bat', packId: 'halloween', rarity: 'uncommon', tagline: 'Flutters upside down memorizing spooky idioms.', accentHex: '#9333EA', bgHex: '#F3E8FF' },
  { id: 'halloween-broom-fox', name: 'Broomstick Fox', packId: 'halloween', rarity: 'rare', tagline: 'Zooms past the harvest moon on a lucky broom.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'halloween-moon-owl', name: 'Midnight Moon Owl', packId: 'halloween', rarity: 'epic', tagline: 'Watches over glowing lanterns from an autumn oak.', accentHex: '#4F46E5', bgHex: '#E0E7FF' },
  { id: 'halloween-star-vampire', name: 'Velvet Cape Bat', packId: 'halloween', rarity: 'legendary', tagline: 'A polite little count who adores classic mysteries.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'halloween-chroma-pumpkin', name: 'Prism Harvest King', packId: 'halloween', rarity: 'chroma', tagline: 'Glows with rainbow candlelight on Halloween night.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 20. LUNAR NEW YEAR PACK (8)
  { id: 'lunar-lion-pup', name: 'Baby Lion Dancer Pup', packId: 'lunar', rarity: 'common', tagline: 'Bobs to cheerful drums bringing good luck all year.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'lunar-hongbao-bunny', name: 'Red Envelope Bunny', packId: 'lunar', rarity: 'common', tagline: 'Carries lucky gold greetings for every study streak.', accentHex: '#E11D48', bgHex: '#FFE4E6' },
  { id: 'lunar-ingot-cat', name: 'Gold Ingot Kitten', packId: 'lunar', rarity: 'uncommon', tagline: 'Naps atop a gleaming golden yuanbao treasure.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'lunar-niangao-bear', name: 'Sweet Rice Cake Bear', packId: 'lunar', rarity: 'uncommon', tagline: 'Wishes you higher and higher scores every new year.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'lunar-lantern-fish', name: 'Lantern Goldfish', packId: 'lunar', rarity: 'rare', tagline: 'Swims through warm red lantern light for abundance.', accentHex: '#F43F5E', bgHex: '#FFE4E6' },
  { id: 'lunar-spark-fox', name: 'Firecracker Kitsune', packId: 'lunar', rarity: 'epic', tagline: 'Lights up the courtyard with festive golden sparks.', accentHex: '#B91C1C', bgHex: '#FEE2E2' },
  { id: 'lunar-jade-dragon', name: 'Cloud Jade Dragon', packId: 'lunar', rarity: 'legendary', tagline: 'Soars gracefully above rosy spring festival clouds.', accentHex: '#059669', bgHex: '#D1FAE5' },
  { id: 'lunar-chroma-koi', name: 'Prism Imperial Koi', packId: 'lunar', rarity: 'chroma', tagline: 'Leaps the rainbow waterfall to become a radiant dragon.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 21. WINTER HOLIDAY PACK (8)
  { id: 'winter-ginger-bear', name: 'Gingerbread Cub', packId: 'winter', rarity: 'common', tagline: 'Frosted with white icing smiles and gumdrop buttons.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'winter-cocoa-fawn', name: 'Hot Cocoa Fawn', packId: 'winter', rarity: 'common', tagline: 'Topped with fluffy mini marshmallows after snow play.', accentHex: '#92400E', bgHex: '#FEF3C7' },
  { id: 'winter-snow-penguin', name: 'Snowman Penguin', packId: 'winter', rarity: 'uncommon', tagline: 'Bundles up in a striped red scarf and top hat.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'winter-peppermint-bunny', name: 'Candy Cane Bunny', packId: 'winter', rarity: 'uncommon', tagline: 'Minty red-and-white stripes bringing cozy cheer.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'winter-pinecone-owl', name: 'Evergreen Snowy Owl', packId: 'winter', rarity: 'rare', tagline: 'Perches beside twinkling holiday tree lights.', accentHex: '#15803D', bgHex: '#DCFCE7' },
  { id: 'winter-sleigh-husky', name: 'Jingle Sleigh Husky', packId: 'winter', rarity: 'epic', tagline: 'Races through silver snow with cheerful sleigh bells.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'winter-aurora-reindeer', name: 'Northern Star Reindeer', packId: 'winter', rarity: 'legendary', tagline: 'Guides winter gift sleighs across the starry pole.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'winter-chroma-snowflake', name: 'Prism Snow Angel', packId: 'winter', rarity: 'chroma', tagline: 'Crystallizes rainbow starlight in every winter flurry.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 22. MID-AUTUMN MOON PACK (8)
  { id: 'midautumn-mochi-rabbit', name: 'Jade Mochi Rabbit', packId: 'midautumn', rarity: 'common', tagline: 'Pounds sweet rice cakes under a glowing full moon.', accentHex: '#F59E0B', bgHex: '#FEF3C7' },
  { id: 'midautumn-mooncake-cat', name: 'Mooncake Kitty', packId: 'midautumn', rarity: 'common', tagline: 'Golden pastry crust stamped with a lucky blossom.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'midautumn-pomelo-capy', name: 'Pomelo Hat Capybara', packId: 'midautumn', rarity: 'uncommon', tagline: 'Balances a fresh green pomelo peel hat with calm joy.', accentHex: '#65A30D', bgHex: '#ECFCCB' },
  { id: 'midautumn-osmanthus-fawn', name: 'Osmanthus Blossom Fawn', packId: 'midautumn', rarity: 'uncommon', tagline: 'Carries the sweet autumn scent of tiny golden flowers.', accentHex: '#CA8A04', bgHex: '#FEF9C3' },
  { id: 'midautumn-lantern-squirrel', name: 'Paper Lantern Squirrel', packId: 'midautumn', rarity: 'rare', tagline: 'Carries a glowing amber lantern along twilight trails.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'midautumn-star-fox', name: 'Crescent Moon Fox', packId: 'midautumn', rarity: 'epic', tagline: 'Leaps across silver clouds to visit the moon palace.', accentHex: '#4F46E5', bgHex: '#E0E7FF' },
  { id: 'midautumn-palace-bunny', name: 'Moon Palace Rabbit', packId: 'midautumn', rarity: 'legendary', tagline: 'Royal keeper of golden tea and autumn poetry.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'midautumn-chroma-deer', name: 'Prism Harvest Moon Deer', packId: 'midautumn', rarity: 'chroma', tagline: 'Antlers cradling a shimmering rainbow full moon.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 23. SPRING & EASTER PACK (8)
  { id: 'easter-egg-bunny', name: 'Painted Egg Bunny', packId: 'easter', rarity: 'common', tagline: 'Hides pastel polka-dot eggs across sunny gardens.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'easter-tulip-chick', name: 'Tulip Sprout Chick', packId: 'easter', rarity: 'common', tagline: 'Peeks right out of a bright spring tulip cup.', accentHex: '#EAB308', bgHex: '#FEF9C3' },
  { id: 'easter-honey-bear', name: 'Clover Honey Cub', packId: 'easter', rarity: 'uncommon', tagline: 'Wears a tiny daisy crown on sunny morning picnics.', accentHex: '#F59E0B', bgHex: '#FEF3C7' },
  { id: 'easter-blossom-lamb', name: 'Flower Wreath Lamb', packId: 'easter', rarity: 'uncommon', tagline: 'Fluffy wool braided with lavender and pink blooms.', accentHex: '#A855F7', bgHex: '#F3E8FF' },
  { id: 'easter-ribbon-duck', name: 'Ribbon Puddle Duckling', packId: 'easter', rarity: 'rare', tagline: 'Splashes through warm spring rain wearing a satin bow.', accentHex: '#0EA5E9', bgHex: '#E0F2FE' },
  { id: 'easter-sakura-squirrel', name: 'Cherry Petal Squirrel', packId: 'easter', rarity: 'epic', tagline: 'Gathers drifting pink blossoms in a woven basket.', accentHex: '#F43F5E', bgHex: '#FFE4E6' },
  { id: 'easter-rainbow-pixie', name: 'Sunshower Bloom Sprite', packId: 'easter', rarity: 'legendary', tagline: 'Paints double rainbows after every April shower.', accentHex: '#10B981', bgHex: '#D1FAE5' },
  { id: 'easter-chroma-bunny', name: 'Prism Spring Hare', packId: 'easter', rarity: 'chroma', tagline: 'Trails glittering pastel stardust wherever it hops.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 24. CAT CAFÉ PACK (8)
  { id: 'catcafe-toast-tabby', name: 'Butter Toast Tabby', packId: 'catcafe', rarity: 'common', tagline: 'Warm golden stripes smelling just like morning toast.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'catcafe-calico-latte', name: 'Calico Foam Latte', packId: 'catcafe', rarity: 'common', tagline: 'Three cozy colors swirled into sweet steamed milk.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'catcafe-ragdoll-cream', name: 'Whipped Cream Ragdoll', packId: 'catcafe', rarity: 'uncommon', tagline: 'Sapphire blue eyes and cloud-soft fluffy cheeks.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'catcafe-donut-blackcat', name: 'Glazed Donut Kitty', packId: 'catcafe', rarity: 'uncommon', tagline: 'Sleek midnight fur topped with rainbow sprinkles.', accentHex: '#334155', bgHex: '#F1F5F9' },
  { id: 'catcafe-matcha-stripe', name: 'Matcha Whisker Cat', packId: 'catcafe', rarity: 'rare', tagline: 'Whisks frothy green tea for quiet reading afternoons.', accentHex: '#16A34A', bgHex: '#DCFCE7' },
  { id: 'catcafe-macaron-siamese', name: 'Macaron Siamese', packId: 'catcafe', rarity: 'epic', tagline: 'Elegant café host balancing a pastel berry tray.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'catcafe-royal-persian', name: 'Crown Persian Queen', packId: 'catcafe', rarity: 'legendary', tagline: 'Lounges on velvet cushions grading top sentences.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'catcafe-chroma-maneki', name: 'Nebula Fortune Cat', packId: 'catcafe', rarity: 'chroma', tagline: 'Cosmic café guardian shimmering with starry luck.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 25. CAPYBARA & OTTER PACK (8)
  { id: 'capybara-yuzu-chill', name: 'Yuzu Capybara', packId: 'capybara', rarity: 'common', tagline: 'Balances a bright yellow citrus with total zen.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'capybara-shell-otter', name: 'Scallop Sea Otter', packId: 'capybara', rarity: 'common', tagline: 'Holds its favorite lucky shell while floating happily.', accentHex: '#0D9488', bgHex: '#CCFBF1' },
  { id: 'capybara-onsen-steam', name: 'Hot Spring Capybara', packId: 'capybara', rarity: 'uncommon', tagline: 'Relaxes with a folded warm towel right on its head.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'capybara-ducky-pal', name: 'Ducky Buddy Capybara', packId: 'capybara', rarity: 'uncommon', tagline: 'Always gives its tiny yellow duck friend a piggyback.', accentHex: '#EAB308', bgHex: '#FEF9C3' },
  { id: 'capybara-starfish-otter', name: 'Starfish River Otter', packId: 'capybara', rarity: 'rare', tagline: 'Tumbles through sparkling waves chasing sea stars.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'capybara-berry-capy', name: 'Strawberry Capybara', packId: 'capybara', rarity: 'epic', tagline: 'Tucks a sweet garden berry beside its rosy ear.', accentHex: '#E11D48', bgHex: '#FFE4E6' },
  { id: 'capybara-pearl-otter', name: 'Pearl Crown Otter', packId: 'capybara', rarity: 'legendary', tagline: 'Guards a gleaming ocean pearl in a kelp palace.', accentHex: '#4F46E5', bgHex: '#E0E7FF' },
  { id: 'capybara-chroma-king', name: 'Aurora Onsen Capybara', packId: 'capybara', rarity: 'chroma', tagline: 'Radiates peaceful rainbow mist across the whole vault.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 26. FOREST FRIENDS PACK (8)
  { id: 'forest-red-panda', name: 'Cinnamon Red Panda', packId: 'forest', rarity: 'common', tagline: 'Fluffy striped tail curling around maple branches.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'forest-snow-tit', name: 'Snow Puff Titmouse', packId: 'forest', rarity: 'common', tagline: 'A tiny round winter bird soft as a cotton ball.', accentHex: '#64748B', bgHex: '#F1F5F9' },
  { id: 'forest-glider-squirrel', name: 'Leaf Glider Squirrel', packId: 'forest', rarity: 'uncommon', tagline: 'Soars gently from pine to pine with wide bright eyes.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'forest-berry-hog', name: 'Blueberry Hedgehog', packId: 'forest', rarity: 'uncommon', tagline: 'Carries sweet wild berries back to its mossy den.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'forest-cherry-fawn', name: 'Spotted Meadow Fawn', packId: 'forest', rarity: 'rare', tagline: 'Tiptoes silently through sunlit ferns and clover.', accentHex: '#16A34A', bgHex: '#DCFCE7' },
  { id: 'forest-acorn-fox', name: 'Acorn Cap Fox', packId: 'forest', rarity: 'epic', tagline: 'Clever woodland scout wearing a tiny oak beret.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'forest-moon-wolf', name: 'Silver Moon Wolf', packId: 'forest', rarity: 'legendary', tagline: 'Gentle guardian howling softly beneath northern pines.', accentHex: '#4F46E5', bgHex: '#E0E7FF' },
  { id: 'forest-chroma-stag', name: 'Emerald Prism Stag', packId: 'forest', rarity: 'chroma', tagline: 'Blooming crystal antlers lighting the ancient woods.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 27. MOCHI SQUISHY PACK (8)
  { id: 'mochi-ichigo-daifuku', name: 'Strawberry Daifuku', packId: 'mochi', rarity: 'common', tagline: 'Ultra-squishy pink mochi hugging a juicy red berry.', accentHex: '#E11D48', bgHex: '#FFE4E6' },
  { id: 'mochi-mango-puff', name: 'Mango Cream Mochi', packId: 'mochi', rarity: 'common', tagline: 'Sunny slow-rising squishy filled with tropical cream.', accentHex: '#F59E0B', bgHex: '#FEF3C7' },
  { id: 'mochi-pudding-cat', name: 'Caramel Pudding Kitty', packId: 'mochi', rarity: 'uncommon', tagline: 'Jiggles cheerfully with a glossy caramel hat.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'mochi-boba-squish', name: 'Boba Cup Squishy', packId: 'mochi', rarity: 'uncommon', tagline: 'Pinchable milk-tea plush with chewy pearl cheeks.', accentHex: '#B45309', bgHex: '#FEF3C7' },
  { id: 'mochi-cloud-souffle', name: 'Cloud Soufflé Bear', packId: 'mochi', rarity: 'rare', tagline: 'Fluffy pancake stack topped with melting golden butter.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'mochi-macaron-cub', name: 'Berry Macaron Cub', packId: 'mochi', rarity: 'epic', tagline: 'Pastel lavender shells sandwiching sweet vanilla cream.', accentHex: '#9333EA', bgHex: '#F3E8FF' },
  { id: 'mochi-sundae-bunny', name: 'Rainbow Sundae Bunny', packId: 'mochi', rarity: 'legendary', tagline: 'Triple-scoop squishy crowned with a shiny cherry.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'mochi-chroma-star', name: 'Aurora Diamond Mochi', packId: 'mochi', rarity: 'chroma', tagline: 'Bounces back in dazzling pastel rainbow sparkles.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 28. CLOUD SQUISHY PACK (8)
  { id: 'cloudsquishy-marshmallow-lamb', name: 'Marshmallow Lamb', packId: 'cloudsquishy', rarity: 'common', tagline: 'Puffy pillow-soft fleece ready for cozy study breaks.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'cloudsquishy-star-bear', name: 'Starry Pillow Bear', packId: 'cloudsquishy', rarity: 'common', tagline: 'Hugs a glowing golden star against pastel sky fur.', accentHex: '#EAB308', bgHex: '#FEF9C3' },
  { id: 'cloudsquishy-moon-seal', name: 'Crescent Plush Seal', packId: 'cloudsquishy', rarity: 'uncommon', tagline: 'Round sleepy mochi seal drifting on silver clouds.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'cloudsquishy-peach-penguin', name: 'Peach Puff Penguin', packId: 'cloudsquishy', rarity: 'uncommon', tagline: 'Pastel coral tummy as squishy as a warm marshmallow.', accentHex: '#F97316', bgHex: '#FFEDD5' },
  { id: 'cloudsquishy-mint-dino', name: 'Mint Marshmallow Dino', packId: 'cloudsquishy', rarity: 'rare', tagline: 'Tiny rounded spikes and the gentlest squishy hugs.', accentHex: '#10B981', bgHex: '#D1FAE5' },
  { id: 'cloudsquishy-lavender-uni', name: 'Lavender Plush Unicorn', packId: 'cloudsquishy', rarity: 'epic', tagline: 'Dreamy lilac mane sparkling with sleepy stardust.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'cloudsquishy-galaxy-whale', name: 'Galaxy Whale Pillow', packId: 'cloudsquishy', rarity: 'legendary', tagline: 'Sails across nebula clouds carrying bedtime stories.', accentHex: '#2563EB', bgHex: '#DBEAFE' },
  { id: 'cloudsquishy-chroma-cloud', name: 'Prism Nebula Squishy', packId: 'cloudsquishy', rarity: 'chroma', tagline: 'The squishiest rainbow cloud creature ever imagined.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 29. FAIRYTALE CASTLE PACK (8 — 100% Original Public-Domain Folklore Inspired)
  { id: 'fairytale-slipper-bunny', name: 'Glass Slipper Bunny', packId: 'fairytale', rarity: 'common', tagline: 'Dances to midnight chimes wearing shimmering crystal bows.', accentHex: '#0284C7', bgHex: '#E0F2FE' },
  { id: 'fairytale-rose-teacup', name: 'Enchanted Rose Kitty', packId: 'fairytale', rarity: 'common', tagline: 'Perches beside a blooming crimson rose in a library.', accentHex: '#E11D48', bgHex: '#FFE4E6' },
  { id: 'fairytale-carriage-mouse', name: 'Pumpkin Coach Mouse', packId: 'fairytale', rarity: 'uncommon', tagline: 'Steers a golden storybook carriage down starlit lanes.', accentHex: '#EA580C', bgHex: '#FFEDD5' },
  { id: 'fairytale-lamp-fox', name: 'Golden Lamp Fox', packId: 'fairytale', rarity: 'uncommon', tagline: 'Grants three clever word wishes from swirling starlight.', accentHex: '#D97706', bgHex: '#FEF3C7' },
  { id: 'fairytale-shell-mermaid', name: 'Pearl Shell Seahorse', packId: 'fairytale', rarity: 'rare', tagline: 'Sings coral ballads beneath sunlit ocean arches.', accentHex: '#0D9488', bgHex: '#CCFBF1' },
  { id: 'fairytale-frost-swan', name: 'Snow Crystal Swan', packId: 'fairytale', rarity: 'epic', tagline: 'Glides across an icy mirror lake in a silver tiara.', accentHex: '#3B82F6', bgHex: '#DBEAFE' },
  { id: 'fairytale-harp-pegasus', name: 'Golden Harp Pegasus', packId: 'fairytale', rarity: 'legendary', tagline: 'Climbs giant beanstalk clouds to celestial castles.', accentHex: '#CA8A04', bgHex: '#FEF9C3' },
  { id: 'fairytale-chroma-dragon', name: 'Prism Castle Dragon', packId: 'fairytale', rarity: 'chroma', tagline: 'Protects every happily-ever-after in shimmering turrets.', accentHex: '#DB2777', bgHex: '#FCE7F3' },

  // 30. STARLIGHT FAIRYLAND PACK (8 — 100% Original Fairyland Fantasy)
  { id: 'fairyland-dewdrop-pixie', name: 'Dewdrop Petal Pixie', packId: 'fairyland', rarity: 'common', tagline: 'Collects morning raindrops in tiny bellflower cups.', accentHex: '#0EA5E9', bgHex: '#E0F2FE' },
  { id: 'fairyland-mushroom-cat', name: 'Toadstool Sprite Cat', packId: 'fairyland', rarity: 'common', tagline: 'Naps beneath a glowing spotted fairy-ring umbrella.', accentHex: '#DC2626', bgHex: '#FEE2E2' },
  { id: 'fairyland-firefly-fawn', name: 'Glow-Lantern Fawn', packId: 'fairyland', rarity: 'uncommon', tagline: 'Guides lost fireflies home through twilight meadows.', accentHex: '#65A30D', bgHex: '#ECFCCB' },
  { id: 'fairyland-rainbow-foal', name: 'Pastel Rainbow Foal', packId: 'fairyland', rarity: 'uncommon', tagline: 'Gallops along prism bridges above misty waterfalls.', accentHex: '#EC4899', bgHex: '#FCE7F3' },
  { id: 'fairyland-wand-owl', name: 'Starwand Owl', packId: 'fairyland', rarity: 'rare', tagline: 'Traces sparkling constellations in the evening sky.', accentHex: '#7C3AED', bgHex: '#EDE9FE' },
  { id: 'fairyland-moon-butterfly', name: 'Moonbeam Fairy Moth', packId: 'fairyland', rarity: 'epic', tagline: 'Dusts storybooks with gentle silver wing-shimmer.', accentHex: '#4F46E5', bgHex: '#E0E7FF' },
  { id: 'fairyland-dream-pegasus', name: 'Cloudspire Alicorn', packId: 'fairyland', rarity: 'legendary', tagline: 'Weaves glowing dreams from moonbeams and cloud fluff.', accentHex: '#9333EA', bgHex: '#F3E8FF' },
  { id: 'fairyland-chroma-queen', name: 'Aurora Fairy Sovereign', packId: 'fairyland', rarity: 'chroma', tagline: 'Crowned in northern lights across the entire starlight realm.', accentHex: '#DB2777', bgHex: '#FCE7F3' },
];

export const STARTER_COLLECTIBLE_ID = 'critter-sprout-bunny';

export function getCollectibleById(id: string): Collectible | undefined {
  return COLLECTIBLES.find((item) => item.id === id);
}

export function getCollectiblesByPack(packId: PackId): Collectible[] {
  return COLLECTIBLES.filter((item) => item.packId === packId);
}

export function getPackById(packId: PackId): MysteryPack | undefined {
  return MYSTERY_PACKS.find((pack) => pack.id === packId);
}

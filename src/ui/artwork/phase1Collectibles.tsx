import React from 'react';

type HeadShape =
  | 'square'
  | 'cup'
  | 'onigiri'
  | 'dome'
  | 'gem'
  | 'pixel'
  | 'lantern'
  | 'cake'
  | 'bowl'
  | 'butterfly';

type TopperKind =
  | 'cat-ears'
  | 'bunny-ears'
  | 'bear-ears'
  | 'fox-ears'
  | 'owl-tufts'
  | 'frog-eyes'
  | 'boba-straw'
  | 'croissant-horns'
  | 'frosting-cherry'
  | 'leaf-sprout'
  | 'flower-petals'
  | 'mushroom-cap'
  | 'crown'
  | 'antlers'
  | 'wings'
  | 'antennae'
  | 'lion-mane'
  | 'lantern-tassel'
  | 'dragon-horns'
  | 'unicorn-horn'
  | 'headphones'
  | 'pixel-antenna'
  | 'gem-crown'
  | 'elephant-ears'
  | 'giraffe-ossicones'
  | 'teapot-lid'
  | 'pretzel-loops'
  | 'succulent-rosette'
  | 'knight-helmet'
  | 'none';

type DetailKind =
  | 'boba-pearls'
  | 'sprinkles'
  | 'nori-belt'
  | 'scarf'
  | 'belly-patch'
  | 'spots'
  | 'stripes'
  | 'visor'
  | 'whiskers'
  | 'gem-core'
  | 'ribbon'
  | 'piano-keys'
  | 'gold-coin'
  | 'snowflake'
  | 'palette-dots'
  | 'naruto-swirl'
  | 'none';

type MouthKind = 'smile' | 'cat' | 'beak' | 'happy' | 'pixel' | 'snout';

interface CollectibleSpec {
  shape: HeadShape;
  topper: TopperKind;
  detail: DetailKind;
  mouth: MouthKind;
  body: string;
  secondary: string;
  accent: string;
  cheek?: string;
  chroma?: [string, string, string];
}

const SPECS: Record<string, CollectibleSpec> = {
  // 7. BOBA & CAFÉ PACK (8)
  'boba-milk-cat': { shape: 'cup', topper: 'cat-ears', detail: 'boba-pearls', mouth: 'cat', body: '#FDE68A', secondary: '#92400E', accent: '#B45309', cheek: '#FDA4AF' },
  'boba-matcha-frog': { shape: 'cup', topper: 'frog-eyes', detail: 'boba-pearls', mouth: 'smile', body: '#86EFAC', secondary: '#166534', accent: '#16A34A', cheek: '#FCA5A5' },
  'boba-taro-bunny': { shape: 'cup', topper: 'bunny-ears', detail: 'boba-pearls', mouth: 'cat', body: '#E9D5FF', secondary: '#7E22CE', accent: '#9333EA', cheek: '#F9A8D4' },
  'boba-berry-fox': { shape: 'cup', topper: 'fox-ears', detail: 'boba-pearls', mouth: 'smile', body: '#FECDD3', secondary: '#BE123C', accent: '#E11D48', cheek: '#FB7185' },
  'boba-pudding-shiba': { shape: 'dome', topper: 'fox-ears', detail: 'belly-patch', mouth: 'happy', body: '#FDE047', secondary: '#92400E', accent: '#D97706', cheek: '#FDBA74' },
  'boba-espresso-owl': { shape: 'square', topper: 'owl-tufts', detail: 'scarf', mouth: 'beak', body: '#A16207', secondary: '#FEF3C7', accent: '#78350F', cheek: '#FDBA74' },
  'boba-golden-teapot': { shape: 'dome', topper: 'teapot-lid', detail: 'gold-coin', mouth: 'happy', body: '#FACC15', secondary: '#FEF08A', accent: '#CA8A04', cheek: '#FDBA74' },
  'boba-chroma-latte': { shape: 'cup', topper: 'boba-straw', detail: 'boba-pearls', mouth: 'happy', body: '#F472B6', secondary: '#FFFFFF', accent: '#DB2777', chroma: ['#EC4899', '#8B5CF6', '#38BDF8'] },

  // 8. BAKERY PACK (8)
  'bakery-croissant-bear': { shape: 'square', topper: 'croissant-horns', detail: 'belly-patch', mouth: 'snout', body: '#F59E0B', secondary: '#FEF3C7', accent: '#B45309', cheek: '#FDBA74' },
  'bakery-pretzel-pup': { shape: 'square', topper: 'pretzel-loops', detail: 'spots', mouth: 'snout', body: '#B45309', secondary: '#FDE68A', accent: '#FFFBEB', cheek: '#FDBA74' },
  'bakery-donut-cat': { shape: 'dome', topper: 'cat-ears', detail: 'sprinkles', mouth: 'cat', body: '#FDE68A', secondary: '#F472B6', accent: '#EC4899', cheek: '#FDA4AF' },
  'bakery-cinnamon-bunny': { shape: 'square', topper: 'bunny-ears', detail: 'naruto-swirl', mouth: 'smile', body: '#FCD34D', secondary: '#FFFBEB', accent: '#92400E', cheek: '#FDBA74' },
  'bakery-baguette-dachshund': { shape: 'square', topper: 'bear-ears', detail: 'stripes', mouth: 'snout', body: '#D97706', secondary: '#FEF3C7', accent: '#92400E', cheek: '#FDBA74' },
  'bakery-cupcake-fox': { shape: 'cake', topper: 'frosting-cherry', detail: 'sprinkles', mouth: 'happy', body: '#E9D5FF', secondary: '#C084FC', accent: '#DC2626', cheek: '#F9A8D4' },
  'bakery-golden-tart': { shape: 'cake', topper: 'crown', detail: 'sprinkles', mouth: 'happy', body: '#FBBF24', secondary: '#E11D48', accent: '#B45309', cheek: '#FDA4AF' },
  'bakery-chroma-cake': { shape: 'cake', topper: 'frosting-cherry', detail: 'sprinkles', mouth: 'happy', body: '#F472B6', secondary: '#FFFFFF', accent: '#DB2777', chroma: ['#F43F5E', '#F59E0B', '#38BDF8'] },

  // 9. SUSHI & BENTO PACK (8)
  'sushi-onigiri-cat': { shape: 'onigiri', topper: 'cat-ears', detail: 'nori-belt', mouth: 'cat', body: '#FAF7F2', secondary: '#1E293B', accent: '#0F172A', cheek: '#FDA4AF' },
  'sushi-tamago-chick': { shape: 'square', topper: 'none', detail: 'nori-belt', mouth: 'beak', body: '#FDE047', secondary: '#1E293B', accent: '#EA580C', cheek: '#FDBA74' },
  'sushi-salmon-shiba': { shape: 'square', topper: 'fox-ears', detail: 'stripes', mouth: 'snout', body: '#FB923C', secondary: '#FAF7F2', accent: '#FFEDD5', cheek: '#FDA4AF' },
  'sushi-shrimp-bunny': { shape: 'square', topper: 'bunny-ears', detail: 'stripes', mouth: 'happy', body: '#FED7AA', secondary: '#F97316', accent: '#EA580C', cheek: '#FDA4AF' },
  'sushi-ramen-panda': { shape: 'bowl', topper: 'bear-ears', detail: 'naruto-swirl', mouth: 'smile', body: '#FAF7F2', secondary: '#DC2626', accent: '#1C1917', cheek: '#FDA4AF' },
  'sushi-maki-otter': { shape: 'square', topper: 'bear-ears', detail: 'nori-belt', mouth: 'snout', body: '#86EFAC', secondary: '#1E293B', accent: '#059669', cheek: '#FDBA74' },
  'sushi-golden-bento': { shape: 'square', topper: 'crown', detail: 'gold-coin', mouth: 'happy', body: '#F59E0B', secondary: '#DC2626', accent: '#FEF3C7', cheek: '#FDBA74' },
  'sushi-chroma-dragonroll': { shape: 'onigiri', topper: 'dragon-horns', detail: 'nori-belt', mouth: 'happy', body: '#F472B6', secondary: '#1E293B', accent: '#DB2777', chroma: ['#10B981', '#06B6D4', '#EC4899'] },

  // 10. BOTANICAL GARDEN PACK (8)
  'botanical-sprout-frog': { shape: 'dome', topper: 'leaf-sprout', detail: 'belly-patch', mouth: 'smile', body: '#4ADE80', secondary: '#DCFCE7', accent: '#15803D', cheek: '#FDA4AF' },
  'botanical-succulent-hog': { shape: 'square', topper: 'succulent-rosette', detail: 'belly-patch', mouth: 'snout', body: '#99F6E4', secondary: '#FDE68A', accent: '#0D9488', cheek: '#FDBA74' },
  'botanical-sunflower-corgi': { shape: 'square', topper: 'flower-petals', detail: 'belly-patch', mouth: 'happy', body: '#FDBA74', secondary: '#FEF3C7', accent: '#FACC15', cheek: '#FB7185' },
  'botanical-mushroom-owl': { shape: 'square', topper: 'mushroom-cap', detail: 'spots', mouth: 'beak', body: '#FEF3C7', secondary: '#DC2626', accent: '#FFFFFF', cheek: '#FDA4AF' },
  'botanical-sakura-bunny': { shape: 'square', topper: 'bunny-ears', detail: 'ribbon', mouth: 'cat', body: '#FBCFE8', secondary: '#FDF2F8', accent: '#EC4899', cheek: '#F472B6' },
  'botanical-lavender-fox': { shape: 'square', topper: 'fox-ears', detail: 'belly-patch', mouth: 'smile', body: '#C4B5FD', secondary: '#F5F3FF', accent: '#7C3AED', cheek: '#F9A8D4' },
  'botanical-golden-bonsai': { shape: 'dome', topper: 'leaf-sprout', detail: 'gold-coin', mouth: 'happy', body: '#FBBF24', secondary: '#FEF3C7', accent: '#92400E', cheek: '#FDBA74' },
  'botanical-chroma-orchid': { shape: 'square', topper: 'flower-petals', detail: 'gem-core', mouth: 'happy', body: '#EC4899', secondary: '#FFFFFF', accent: '#A855F7', chroma: ['#F472B6', '#A855F7', '#34D399'] },

  // 11. ARCTIC & SNOW PACK (8)
  'arctic-seal-mochi': { shape: 'dome', topper: 'none', detail: 'whiskers', mouth: 'cat', body: '#F1F5F9', secondary: '#CBD5E1', accent: '#64748B', cheek: '#FDA4AF' },
  'arctic-puffin-pal': { shape: 'square', topper: 'none', detail: 'scarf', mouth: 'beak', body: '#334155', secondary: '#FAF7F2', accent: '#EA580C', cheek: '#FDBA74' },
  'arctic-penguin-knight': { shape: 'square', topper: 'knight-helmet', detail: 'belly-patch', mouth: 'beak', body: '#1E3A8A', secondary: '#EFF6FF', accent: '#60A5FA', cheek: '#93C5FD' },
  'arctic-snow-owl': { shape: 'square', topper: 'owl-tufts', detail: 'snowflake', mouth: 'beak', body: '#F8FAFC', secondary: '#E0F2FE', accent: '#0284C7', cheek: '#BAE6FD' },
  'arctic-polar-bear': { shape: 'square', topper: 'bear-ears', detail: 'scarf', mouth: 'snout', body: '#F0F9FF', secondary: '#FFFFFF', accent: '#0EA5E9', cheek: '#93C5FD' },
  'arctic-snow-fox': { shape: 'square', topper: 'fox-ears', detail: 'snowflake', mouth: 'smile', body: '#E0E7FF', secondary: '#FFFFFF', accent: '#6366F1', cheek: '#C7D2FE' },
  'arctic-ice-reindeer': { shape: 'square', topper: 'antlers', detail: 'scarf', mouth: 'snout', body: '#FDE68A', secondary: '#FFFBEB', accent: '#D97706', cheek: '#F87171' },
  'arctic-chroma-narwhal': { shape: 'square', topper: 'bear-ears', detail: 'snowflake', mouth: 'happy', body: '#38BDF8', secondary: '#FFFFFF', accent: '#EC4899', chroma: ['#22D3EE', '#818CF8', '#F472B6'] },

  // 12. BUTTERFLY MEADOW PACK (8)
  'butterfly-ladybug-scout': { shape: 'dome', topper: 'antennae', detail: 'spots', mouth: 'smile', body: '#EF4444', secondary: '#1C1917', accent: '#1C1917', cheek: '#FCA5A5' },
  'butterfly-honey-bee': { shape: 'dome', topper: 'antennae', detail: 'stripes', mouth: 'happy', body: '#FACC15', secondary: '#1C1917', accent: '#FEF08A', cheek: '#FDBA74' },
  'butterfly-firefly-jar': { shape: 'lantern', topper: 'antennae', detail: 'belly-patch', mouth: 'happy', body: '#BEF264', secondary: '#ECFCCB', accent: '#65A30D', cheek: '#FDE047' },
  'butterfly-monarch-wing': { shape: 'butterfly', topper: 'antennae', detail: 'spots', mouth: 'smile', body: '#F97316', secondary: '#1C1917', accent: '#FED7AA', cheek: '#FDBA74' },
  'butterfly-blue-morpho': { shape: 'butterfly', topper: 'antennae', detail: 'gem-core', mouth: 'smile', body: '#2563EB', secondary: '#1E3A8A', accent: '#93C5FD', cheek: '#BAE6FD' },
  'butterfly-luna-moth': { shape: 'butterfly', topper: 'antennae', detail: 'snowflake', mouth: 'happy', body: '#5EEAD4', secondary: '#0F766E', accent: '#CCFBF1', cheek: '#99F6E4' },
  'butterfly-golden-beetle': { shape: 'dome', topper: 'crown', detail: 'gem-core', mouth: 'smile', body: '#F59E0B', secondary: '#FEF3C7', accent: '#92400E', cheek: '#FDE68A' },
  'butterfly-chroma-swallowtail': { shape: 'butterfly', topper: 'antennae', detail: 'gem-core', mouth: 'happy', body: '#EC4899', secondary: '#1C1917', accent: '#F472B6', chroma: ['#EC4899', '#A855F7', '#06B6D4'] },

  // 13. SAFARI JUNGLE PACK (8)
  'safari-cloud-sloth': { shape: 'square', topper: 'none', detail: 'belly-patch', mouth: 'happy', body: '#A8A29E', secondary: '#F5F5F4', accent: '#57534E', cheek: '#FDA4AF' },
  'safari-meerkat-scout': { shape: 'square', topper: 'bear-ears', detail: 'belly-patch', mouth: 'snout', body: '#D97706', secondary: '#FEF3C7', accent: '#78350F', cheek: '#FDBA74' },
  'safari-giraffe-explorer': { shape: 'square', topper: 'giraffe-ossicones', detail: 'spots', mouth: 'smile', body: '#FDE047', secondary: '#B45309', accent: '#CA8A04', cheek: '#FDBA74' },
  'safari-chameleon-artist': { shape: 'dome', topper: 'leaf-sprout', detail: 'stripes', mouth: 'happy', body: '#22C55E', secondary: '#86EFAC', accent: '#15803D', cheek: '#FDE047' },
  'safari-toucan-singer': { shape: 'square', topper: 'none', detail: 'scarf', mouth: 'beak', body: '#1E293B', secondary: '#FACC15', accent: '#0284C7', cheek: '#FB923C' },
  'safari-jade-panther': { shape: 'square', topper: 'cat-ears', detail: 'gem-core', mouth: 'cat', body: '#312E81', secondary: '#6366F1', accent: '#10B981', cheek: '#818CF8' },
  'safari-golden-lion': { shape: 'square', topper: 'lion-mane', detail: 'belly-patch', mouth: 'cat', body: '#FBBF24', secondary: '#B45309', accent: '#D97706', cheek: '#FDBA74' },
  'safari-chroma-elephant': { shape: 'square', topper: 'elephant-ears', detail: 'gem-core', mouth: 'happy', body: '#A855F7', secondary: '#FFFFFF', accent: '#EC4899', chroma: ['#F59E0B', '#EC4899', '#6366F1'] },

  // 14. FESTIVAL & LANTERN PACK (8)
  'festival-tangyuan-duo': { shape: 'dome', topper: 'none', detail: 'ribbon', mouth: 'happy', body: '#FFF1F2', secondary: '#FDA4AF', accent: '#F43F5E', cheek: '#FB7185' },
  'festival-zongzi-buddy': { shape: 'onigiri', topper: 'leaf-sprout', detail: 'ribbon', mouth: 'smile', body: '#4ADE80', secondary: '#15803D', accent: '#FACC15', cheek: '#FDA4AF' },
  'festival-moon-rabbit': { shape: 'square', topper: 'bunny-ears', detail: 'gold-coin', mouth: 'cat', body: '#FEF9C3', secondary: '#FDE68A', accent: '#D97706', cheek: '#FDA4AF' },
  'festival-sky-lantern': { shape: 'lantern', topper: 'lantern-tassel', detail: 'gold-coin', mouth: 'happy', body: '#FB923C', secondary: '#FDE047', accent: '#DC2626', cheek: '#FCA5A5' },
  'festival-lucky-cat': { shape: 'square', topper: 'cat-ears', detail: 'gold-coin', mouth: 'cat', body: '#FAF7F2', secondary: '#DC2626', accent: '#FACC15', cheek: '#FCA5A5' },
  'festival-lion-dancer': { shape: 'square', topper: 'lion-mane', detail: 'gold-coin', mouth: 'happy', body: '#EF4444', secondary: '#FACC15', accent: '#FDE047', cheek: '#FDBA74' },
  'festival-golden-dragon': { shape: 'square', topper: 'dragon-horns', detail: 'whiskers', mouth: 'happy', body: '#FACC15', secondary: '#DC2626', accent: '#CA8A04', cheek: '#FCA5A5' },
  'festival-chroma-phoenix': { shape: 'square', topper: 'wings', detail: 'gold-coin', mouth: 'beak', body: '#F43F5E', secondary: '#FDE047', accent: '#DB2777', chroma: ['#EF4444', '#F59E0B', '#EC4899'] },

  // 15. MYTHOLOGY PACK (8)
  'mythology-baby-pegasus': { shape: 'square', topper: 'wings', detail: 'belly-patch', mouth: 'happy', body: '#EFF6FF', secondary: '#93C5FD', accent: '#2563EB', cheek: '#F9A8D4' },
  'mythology-mini-yeti': { shape: 'square', topper: 'dragon-horns', detail: 'scarf', mouth: 'smile', body: '#CFFAFE', secondary: '#67E8F9', accent: '#0891B2', cheek: '#FDA4AF' },
  'mythology-kitsune-pup': { shape: 'square', topper: 'fox-ears', detail: 'gem-core', mouth: 'cat', body: '#FEF2F2', secondary: '#EF4444', accent: '#DC2626', cheek: '#FCA5A5' },
  'mythology-sphinx-kitten': { shape: 'square', topper: 'crown', detail: 'stripes', mouth: 'cat', body: '#FDE68A', secondary: '#2563EB', accent: '#CA8A04', cheek: '#FDBA74' },
  'mythology-mercat-pearl': { shape: 'square', topper: 'cat-ears', detail: 'gem-core', mouth: 'cat', body: '#5EEAD4', secondary: '#CCFBF1', accent: '#0D9488', cheek: '#F9A8D4' },
  'mythology-thunder-kirin': { shape: 'square', topper: 'antlers', detail: 'gem-core', mouth: 'happy', body: '#C4B5FD', secondary: '#FDE047', accent: '#7C3AED', cheek: '#F9A8D4' },
  'mythology-sun-griffin': { shape: 'square', topper: 'wings', detail: 'gold-coin', mouth: 'beak', body: '#FBBF24', secondary: '#FEF3C7', accent: '#B45309', cheek: '#FDBA74' },
  'mythology-chroma-hydra': { shape: 'square', topper: 'dragon-horns', detail: 'gem-core', mouth: 'happy', body: '#8B5CF6', secondary: '#FFFFFF', accent: '#EC4899', chroma: ['#6366F1', '#EC4899', '#14B8A6'] },

  // 16. MUSIC & ART PACK (8)
  'music-palette-otter': { shape: 'square', topper: 'bear-ears', detail: 'palette-dots', mouth: 'snout', body: '#D6D3D1', secondary: '#FAF7F2', accent: '#2563EB', cheek: '#FDA4AF' },
  'music-guitar-cat': { shape: 'square', topper: 'cat-ears', detail: 'scarf', mouth: 'cat', body: '#FDBA74', secondary: '#FFF7ED', accent: '#EA580C', cheek: '#FDA4AF' },
  'music-piano-panda': { shape: 'square', topper: 'bear-ears', detail: 'piano-keys', mouth: 'smile', body: '#FAF7F2', secondary: '#1C1917', accent: '#334155', cheek: '#FDA4AF' },
  'music-ballet-swan': { shape: 'square', topper: 'crown', detail: 'ribbon', mouth: 'beak', body: '#FDF2F8', secondary: '#F9A8D4', accent: '#EC4899', cheek: '#F472B6' },
  'music-origami-crane': { shape: 'gem', topper: 'wings', detail: 'none', mouth: 'beak', body: '#BAE6FD', secondary: '#E0F2FE', accent: '#0284C7', cheek: '#93C5FD' },
  'music-star-violin': { shape: 'square', topper: 'fox-ears', detail: 'ribbon', mouth: 'happy', body: '#DDD6FE', secondary: '#92400E', accent: '#7C3AED', cheek: '#F9A8D4' },
  'music-golden-harp': { shape: 'dome', topper: 'crown', detail: 'stripes', mouth: 'happy', body: '#FDE047', secondary: '#FEF9C3', accent: '#B45309', cheek: '#FDBA74' },
  'music-chroma-dj': { shape: 'square', topper: 'headphones', detail: 'gem-core', mouth: 'happy', body: '#F472B6', secondary: '#FFFFFF', accent: '#2563EB', chroma: ['#EC4899', '#F59E0B', '#3B82F6'] },

  // 17. RETRO ARCADE PACK (8)
  'arcade-pixel-slime': { shape: 'pixel', topper: 'none', detail: 'belly-patch', mouth: 'pixel', body: '#34D399', secondary: '#A7F3D0', accent: '#059669', cheek: '#6EE7B7' },
  'arcade-beep-bot': { shape: 'pixel', topper: 'pixel-antenna', detail: 'visor', mouth: 'pixel', body: '#38BDF8', secondary: '#0284C7', accent: '#FDE047', cheek: '#7DD3FC' },
  'arcade-coin-ghost': { shape: 'pixel', topper: 'none', detail: 'gold-coin', mouth: 'pixel', body: '#C084FC', secondary: '#F3E8FF', accent: '#7E22CE', cheek: '#F0ABFC' },
  'arcade-star-cartridge': { shape: 'pixel', topper: 'bear-ears', detail: 'stripes', mouth: 'pixel', body: '#60A5FA', secondary: '#DBEAFE', accent: '#1D4ED8', cheek: '#93C5FD' },
  'arcade-pixel-dragon': { shape: 'pixel', topper: 'dragon-horns', detail: 'belly-patch', mouth: 'pixel', body: '#FB923C', secondary: '#FEF3C7', accent: '#C2410C', cheek: '#FDBA74' },
  'arcade-cyber-cat': { shape: 'pixel', topper: 'cat-ears', detail: 'visor', mouth: 'pixel', body: '#F472B6', secondary: '#1E1B4B', accent: '#22D3EE', cheek: '#F9A8D4' },
  'arcade-golden-trophy': { shape: 'pixel', topper: 'crown', detail: 'gold-coin', mouth: 'pixel', body: '#FACC15', secondary: '#FEF9C3', accent: '#B45309', cheek: '#FDE047' },
  'arcade-chroma-cabinet': { shape: 'pixel', topper: 'pixel-antenna', detail: 'visor', mouth: 'pixel', body: '#14B8A6', secondary: '#1E1B4B', accent: '#EC4899', chroma: ['#22D3EE', '#A855F7', '#F43F5E'] },

  // 18. CRYSTAL & GEMS PACK (8)
  'crystal-rose-quartz': { shape: 'gem', topper: 'cat-ears', detail: 'gem-core', mouth: 'cat', body: '#F9A8D4', secondary: '#FCE7F3', accent: '#DB2777', cheek: '#F472B6' },
  'crystal-citrine-pup': { shape: 'gem', topper: 'bear-ears', detail: 'gem-core', mouth: 'happy', body: '#FDE047', secondary: '#FEF9C3', accent: '#CA8A04', cheek: '#FDBA74' },
  'crystal-jade-turtle': { shape: 'gem', topper: 'none', detail: 'gem-core', mouth: 'smile', body: '#34D399', secondary: '#A7F3D0', accent: '#047857', cheek: '#6EE7B7' },
  'crystal-amethyst-owl': { shape: 'gem', topper: 'owl-tufts', detail: 'gem-core', mouth: 'beak', body: '#A78BFA', secondary: '#EDE9FE', accent: '#6D28D9', cheek: '#C4B5FD' },
  'crystal-sapphire-fox': { shape: 'gem', topper: 'fox-ears', detail: 'gem-core', mouth: 'smile', body: '#60A5FA', secondary: '#DBEAFE', accent: '#1D4ED8', cheek: '#93C5FD' },
  'crystal-ruby-dragon': { shape: 'gem', topper: 'dragon-horns', detail: 'gem-core', mouth: 'happy', body: '#FB7185', secondary: '#FFE4E6', accent: '#BE123C', cheek: '#FDA4AF' },
  'crystal-opal-unicorn': { shape: 'gem', topper: 'unicorn-horn', detail: 'gem-core', mouth: 'happy', body: '#C7D2FE', secondary: '#EEF2FF', accent: '#4F46E5', cheek: '#F9A8D4' },
  'crystal-chroma-diamond': { shape: 'gem', topper: 'gem-crown', detail: 'gem-core', mouth: 'happy', body: '#E879F9', secondary: '#FFFFFF', accent: '#DB2777', chroma: ['#38BDF8', '#E879F9', '#FDE047'] },
};

// Fix sun-griffin detail cleanly
SPECS['mythology-sun-griffin'].detail = 'gold-coin';

function renderTopper(topper: TopperKind, body: string, secondary: string, accent: string) {
  switch (topper) {
    case 'cat-ears':
      return (
        <g>
          <polygon points="20,40 24,14 42,30" fill={body} stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="25,35 27,21 37,30" fill={secondary} />
          <polygon points="80,40 76,14 58,30" fill={body} stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="75,35 73,21 63,30" fill={secondary} />
        </g>
      );
    case 'bunny-ears':
      return (
        <g>
          <rect x="27" y="8" width="13" height="32" rx="6.5" fill={body} stroke="#1C1917" strokeWidth="3" />
          <rect x="31" y="13" width="5" height="20" rx="2.5" fill="#FBCFE8" />
          <rect x="60" y="8" width="13" height="32" rx="6.5" fill={body} stroke="#1C1917" strokeWidth="3" />
          <rect x="64" y="13" width="5" height="20" rx="2.5" fill="#FBCFE8" />
        </g>
      );
    case 'bear-ears':
      return (
        <g>
          <circle cx="24" cy="28" r="11" fill={body} stroke="#1C1917" strokeWidth="3.2" />
          <circle cx="24" cy="28" r="5" fill={secondary} />
          <circle cx="76" cy="28" r="11" fill={body} stroke="#1C1917" strokeWidth="3.2" />
          <circle cx="76" cy="28" r="5" fill={secondary} />
        </g>
      );
    case 'fox-ears':
      return (
        <g>
          <polygon points="18,44 21,10 43,30" fill={body} stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="23,36 25,18 37,30" fill="#FFFFFF" opacity="0.85" />
          <polygon points="82,44 79,10 57,30" fill={body} stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="77,36 75,18 63,30" fill="#FFFFFF" opacity="0.85" />
        </g>
      );
    case 'owl-tufts':
      return (
        <g>
          <polygon points="18,36 16,15 36,27" fill={accent} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="82,36 84,15 64,27" fill={accent} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
        </g>
      );
    case 'frog-eyes':
      return (
        <g>
          <circle cx="30" cy="26" r="11" fill={body} stroke="#1C1917" strokeWidth="3" />
          <circle cx="70" cy="26" r="11" fill={body} stroke="#1C1917" strokeWidth="3" />
          <circle cx="30" cy="25" r="4.5" fill="#1C1917" />
          <circle cx="70" cy="25" r="4.5" fill="#1C1917" />
        </g>
      );
    case 'boba-straw':
      return (
        <g>
          <rect x="44" y="6" width="12" height="28" rx="4" fill={accent} stroke="#1C1917" strokeWidth="3" />
          <path d="M 20 34 Q 50 18 80 34" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
        </g>
      );
    case 'croissant-horns':
      return (
        <g>
          <path d="M 12 42 Q 16 14 38 28" fill="#D97706" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 88 42 Q 84 14 62 28" fill="#D97706" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" />
        </g>
      );
    case 'pretzel-loops':
      return (
        <g>
          <circle cx="24" cy="28" r="12" fill="none" stroke="#92400E" strokeWidth="6" />
          <circle cx="76" cy="28" r="12" fill="none" stroke="#92400E" strokeWidth="6" />
          <circle cx="24" cy="28" r="12" fill="none" stroke="#1C1917" strokeWidth="1.8" />
          <circle cx="76" cy="28" r="12" fill="none" stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'frosting-cherry':
      return (
        <g>
          <path d="M 22 36 Q 35 16 50 22 Q 65 16 78 36 Z" fill={secondary} stroke="#1C1917" strokeWidth="3" />
          <circle cx="50" cy="17" r="8" fill="#E11D48" stroke="#1C1917" strokeWidth="2.8" />
          <path d="M 52 10 Q 59 6 62 12" stroke="#15803D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'leaf-sprout':
      return (
        <g>
          <path d="M 50 32 L 50 18" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="41" cy="18" rx="9" ry="5" transform="rotate(-24 41 18)" fill="#4ADE80" stroke="#1C1917" strokeWidth="2.4" />
          <ellipse cx="59" cy="18" rx="9" ry="5" transform="rotate(24 59 18)" fill="#22C55E" stroke="#1C1917" strokeWidth="2.4" />
        </g>
      );
    case 'succulent-rosette':
      return (
        <g>
          <ellipse cx="34" cy="28" rx="10" ry="6" transform="rotate(-28 34 28)" fill="#14B8A6" stroke="#1C1917" strokeWidth="2.4" />
          <ellipse cx="66" cy="28" rx="10" ry="6" transform="rotate(28 66 28)" fill="#14B8A6" stroke="#1C1917" strokeWidth="2.4" />
          <ellipse cx="50" cy="21" rx="9" ry="7" fill="#2DD4BF" stroke="#1C1917" strokeWidth="2.4" />
        </g>
      );
    case 'flower-petals':
      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx={50 + Math.cos((deg * Math.PI) / 180) * 34}
              cy={54 + Math.sin((deg * Math.PI) / 180) * 34}
              rx="10"
              ry="10"
              fill={accent}
              stroke="#1C1917"
              strokeWidth="2.4"
            />
          ))}
        </g>
      );
    case 'mushroom-cap':
      return (
        <g>
          <path d="M 10 42 C 12 10 88 10 90 42 Z" fill={secondary} stroke="#1C1917" strokeWidth="3.4" />
          <circle cx="32" cy="26" r="5" fill="#FFFFFF" />
          <circle cx="52" cy="19" r="6" fill="#FFFFFF" />
          <circle cx="71" cy="28" r="4.5" fill="#FFFFFF" />
        </g>
      );
    case 'crown':
      return (
        <polygon
          points="26,34 30,13 42,24 50,10 58,24 70,13 74,34"
          fill="#FACC15"
          stroke="#1C1917"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      );
    case 'antlers':
      return (
        <g stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M 32 32 L 24 12 M 26 20 L 18 16 M 28 24 L 34 17" />
          <path d="M 68 32 L 76 12 M 74 20 L 82 16 M 72 24 L 66 17" />
        </g>
      );
    case 'wings':
      return (
        <g>
          <path d="M 20 56 Q 4 36 16 24 Q 24 34 26 48 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.8" />
          <path d="M 80 56 Q 96 36 84 24 Q 76 34 74 48 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.8" />
        </g>
      );
    case 'antennae':
      return (
        <g stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M 38 30 Q 32 14 24 14" />
          <path d="M 62 30 Q 68 14 76 14" />
          <circle cx="24" cy="14" r="3.5" fill={accent} />
          <circle cx="76" cy="14" r="3.5" fill={accent} />
        </g>
      );
    case 'lion-mane':
      return (
        <g>
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
            <circle
              key={deg}
              cx={50 + Math.cos((deg * Math.PI) / 180) * 33}
              cy={54 + Math.sin((deg * Math.PI) / 180) * 31}
              r="11"
              fill={secondary}
              stroke="#1C1917"
              strokeWidth="2.4"
            />
          ))}
        </g>
      );
    case 'lantern-tassel':
      return (
        <g>
          <rect x="34" y="16" width="32" height="10" rx="4" fill="#DC2626" stroke="#1C1917" strokeWidth="2.8" />
          <line x1="50" y1="8" x2="50" y2="16" stroke="#1C1917" strokeWidth="3" />
          <line x1="50" y1="84" x2="50" y2="96" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'dragon-horns':
      return (
        <g>
          <path d="M 28 32 Q 16 14 32 12 L 38 28 Z" fill="#FDE047" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M 72 32 Q 84 14 68 12 L 62 28 Z" fill="#FDE047" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
        </g>
      );
    case 'unicorn-horn':
      return (
        <polygon points="43,30 50,6 57,30" fill="#FDE047" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
      );
    case 'headphones':
      return (
        <g>
          <path d="M 16 54 A 34 34 0 0 1 84 54" fill="none" stroke="#1C1917" strokeWidth="5.5" strokeLinecap="round" />
          <rect x="8" y="42" width="12" height="24" rx="6" fill={accent} stroke="#1C1917" strokeWidth="2.8" />
          <rect x="80" y="42" width="12" height="24" rx="6" fill={accent} stroke="#1C1917" strokeWidth="2.8" />
        </g>
      );
    case 'pixel-antenna':
      return (
        <g>
          <rect x="47" y="12" width="6" height="16" fill="#1C1917" />
          <rect x="42" y="6" width="16" height="10" fill={accent} stroke="#1C1917" strokeWidth="2.4" />
        </g>
      );
    case 'gem-crown':
      return (
        <g>
          <polygon points="50,6 60,22 50,30 40,22" fill="#38BDF8" stroke="#1C1917" strokeWidth="2.6" />
          <polygon points="30,14 38,26 26,30" fill="#F472B6" stroke="#1C1917" strokeWidth="2.4" />
          <polygon points="70,14 62,26 74,30" fill="#FDE047" stroke="#1C1917" strokeWidth="2.4" />
        </g>
      );
    case 'elephant-ears':
      return (
        <g>
          <ellipse cx="14" cy="54" rx="12" ry="20" fill={body} stroke="#1C1917" strokeWidth="3.2" />
          <ellipse cx="86" cy="54" rx="12" ry="20" fill={body} stroke="#1C1917" strokeWidth="3.2" />
        </g>
      );
    case 'giraffe-ossicones':
      return (
        <g>
          <line x1="34" y1="30" x2="30" y2="14" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="30" cy="13" r="5" fill="#78350F" stroke="#1C1917" strokeWidth="2.2" />
          <line x1="66" y1="30" x2="70" y2="14" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="70" cy="13" r="5" fill="#78350F" stroke="#1C1917" strokeWidth="2.2" />
        </g>
      );
    case 'teapot-lid':
      return (
        <g>
          <circle cx="50" cy="16" r="6" fill={accent} stroke="#1C1917" strokeWidth="2.8" />
          <path d="M 18 54 Q 6 44 10 34" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M 82 44 Q 94 52 82 64" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case 'knight-helmet':
      return (
        <g>
          <path d="M 22 36 A 28 24 0 0 1 78 36 Z" fill="#94A3B8" stroke="#1C1917" strokeWidth="3" />
          <path d="M 46 14 L 54 14 L 52 6 L 48 6 Z" fill="#EF4444" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'none':
    default:
      return null;
  }
}

function renderBaseShape(shape: HeadShape, fillRef: string, secondary: string) {
  switch (shape) {
    case 'cup':
      return (
        <g>
          <rect x="20" y="30" width="60" height="58" rx="14" fill={fillRef} stroke="#1C1917" strokeWidth="3.4" />
          <rect x="16" y="28" width="68" height="10" rx="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
        </g>
      );
    case 'onigiri':
      return (
        <path
          d="M 50 18 C 64 18 86 64 84 80 C 82 88 18 88 16 80 C 14 64 36 18 50 18 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.4"
        />
      );
    case 'dome':
      return (
        <path
          d="M 16 74 C 16 26 32 22 50 22 C 68 22 84 26 84 74 C 84 84 74 88 50 88 C 26 88 16 84 16 74 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.4"
        />
      );
    case 'gem':
      return (
        <polygon
          points="50,18 82,38 74,84 26,84 18,38"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
      );
    case 'pixel':
      return (
        <g>
          <rect x="18" y="26" width="64" height="60" rx="6" fill={fillRef} stroke="#1C1917" strokeWidth="3.6" />
          <rect x="24" y="32" width="12" height="6" fill="#FFFFFF" opacity="0.45" />
        </g>
      );
    case 'lantern':
      return (
        <rect x="22" y="24" width="56" height="62" rx="24" fill={fillRef} stroke="#1C1917" strokeWidth="3.4" />
      );
    case 'cake':
      return (
        <g>
          <rect x="18" y="34" width="64" height="52" rx="14" fill={fillRef} stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 19 48 Q 30 56 40 48 Q 50 56 60 48 Q 70 56 81 48 L 81 36 Q 81 34 72 34 L 28 34 Q 19 34 19 36 Z" fill={secondary} />
        </g>
      );
    case 'bowl':
      return (
        <g>
          <rect x="20" y="28" width="60" height="44" rx="18" fill={fillRef} stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 14 58 L 86 58 C 84 82 70 88 50 88 C 30 88 16 82 14 58 Z" fill={secondary} stroke="#1C1917" strokeWidth="3.4" />
        </g>
      );
    case 'butterfly':
      return (
        <g>
          <ellipse cx="22" cy="44" rx="18" ry="20" fill={fillRef} stroke="#1C1917" strokeWidth="3" />
          <ellipse cx="78" cy="44" rx="18" ry="20" fill={fillRef} stroke="#1C1917" strokeWidth="3" />
          <ellipse cx="26" cy="70" rx="14" ry="15" fill={fillRef} stroke="#1C1917" strokeWidth="3" />
          <ellipse cx="74" cy="70" rx="14" ry="15" fill={fillRef} stroke="#1C1917" strokeWidth="3" />
          <rect x="34" y="28" width="32" height="54" rx="16" fill={secondary} stroke="#1C1917" strokeWidth="3.2" />
        </g>
      );
    case 'square':
    default:
      return (
        <rect x="18" y="28" width="64" height="58" rx="18" fill={fillRef} stroke="#1C1917" strokeWidth="3.4" />
      );
  }
}

function renderDetail(detail: DetailKind, secondary: string, accent: string) {
  switch (detail) {
    case 'boba-pearls':
      return (
        <g fill="#1C1917">
          <circle cx="32" cy="79" r="4.8" />
          <circle cx="44" cy="81" r="4.8" />
          <circle cx="56" cy="81" r="4.8" />
          <circle cx="68" cy="79" r="4.8" />
        </g>
      );
    case 'sprinkles':
      return (
        <g strokeWidth="3" strokeLinecap="round">
          <line x1="30" y1="38" x2="35" y2="41" stroke="#EF4444" />
          <line x1="65" y1="38" x2="70" y2="41" stroke="#3B82F6" />
          <line x1="48" y1="35" x2="53" y2="37" stroke="#10B981" />
        </g>
      );
    case 'nori-belt':
      return <rect x="34" y="72" width="32" height="16" rx="3" fill="#1E293B" stroke="#1C1917" strokeWidth="2.4" />;
    case 'scarf':
      return (
        <g>
          <rect x="20" y="74" width="60" height="11" rx="5.5" fill={accent} stroke="#1C1917" strokeWidth="2.6" />
          <rect x="36" y="74" width="8" height="11" fill="#FDE047" />
        </g>
      );
    case 'belly-patch':
      return <ellipse cx="50" cy="72" rx="18" ry="11" fill={secondary} opacity="0.85" />;
    case 'spots':
      return (
        <g fill={secondary} opacity="0.7">
          <circle cx="28" cy="40" r="4.5" />
          <circle cx="72" cy="42" r="5" />
          <circle cx="70" cy="74" r="4" />
        </g>
      );
    case 'stripes':
      return (
        <g stroke={secondary} strokeWidth="3.5" strokeLinecap="round" opacity="0.75">
          <line x1="34" y1="34" x2="34" y2="42" />
          <line x1="50" y1="32" x2="50" y2="42" />
          <line x1="66" y1="34" x2="66" y2="42" />
        </g>
      );
    case 'visor':
      return (
        <rect x="24" y="44" width="52" height="16" rx="5" fill="#1E1B4B" stroke={accent} strokeWidth="2.6" />
      );
    case 'whiskers':
      return (
        <g stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round">
          <line x1="16" y1="60" x2="28" y2="62" />
          <line x1="16" y1="67" x2="28" y2="67" />
          <line x1="84" y1="60" x2="72" y2="62" />
          <line x1="84" y1="67" x2="72" y2="67" />
        </g>
      );
    case 'gem-core':
      return (
        <polygon points="50,31 56,39 50,47 44,39" fill="#FFFFFF" stroke={accent} strokeWidth="2.4" opacity="0.9" />
      );
    case 'ribbon':
      return (
        <g>
          <polygon points="50,78 38,72 38,84" fill={accent} stroke="#1C1917" strokeWidth="2" />
          <polygon points="50,78 62,72 62,84" fill={accent} stroke="#1C1917" strokeWidth="2" />
          <circle cx="50" cy="78" r="3.5" fill="#FDE047" stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'piano-keys':
      return (
        <g>
          <rect x="24" y="72" width="52" height="13" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.2" />
          <rect x="32" y="72" width="6" height="8" fill="#1C1917" />
          <rect x="44" y="72" width="6" height="8" fill="#1C1917" />
          <rect x="58" y="72" width="6" height="8" fill="#1C1917" />
        </g>
      );
    case 'gold-coin':
      return (
        <g>
          <circle cx="50" cy="77" r="8" fill="#FACC15" stroke="#1C1917" strokeWidth="2.2" />
          <rect x="47.5" y="74.5" width="5" height="5" fill="#FEF9C3" stroke="#92400E" strokeWidth="1.2" />
        </g>
      );
    case 'snowflake':
      return (
        <g stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round">
          <line x1="50" y1="31" x2="50" y2="43" />
          <line x1="44" y1="37" x2="56" y2="37" />
        </g>
      );
    case 'palette-dots':
      return (
        <g>
          <circle cx="32" cy="78" r="3.8" fill="#EF4444" />
          <circle cx="44" cy="80" r="3.8" fill="#FACC15" />
          <circle cx="56" cy="80" r="3.8" fill="#22C55E" />
          <circle cx="68" cy="78" r="3.8" fill="#3B82F6" />
        </g>
      );
    case 'naruto-swirl':
      return (
        <g>
          <circle cx="50" cy="75" r="7" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <path d="M 47 75 Q 50 71 53 75 Q 50 79 48 76" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'none':
    default:
      return null;
  }
}

export function renderPhase1Collectible(id: string): React.ReactNode | null {
  const spec = SPECS[id];
  if (!spec) return null;

  const gradId = `qv-p1-grad-${id}`;
  const fillRef = spec.chroma ? `url(#${gradId})` : spec.body;
  const eyeColor = spec.detail === 'visor' ? '#22D3EE' : '#1C1917';
  const eyeY = spec.shape === 'bowl' ? 46 : spec.shape === 'onigiri' ? 56 : 54;
  const spread = spec.shape === 'butterfly' ? 8 : 14;
  const mouthY = eyeY + 8;

  return (
    <g>
      {spec.chroma && (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={spec.chroma[0]} />
            <stop offset="50%" stopColor={spec.chroma[1]} />
            <stop offset="100%" stopColor={spec.chroma[2]} />
          </linearGradient>
        </defs>
      )}

      {renderTopper(spec.topper, spec.body, spec.secondary, spec.accent)}
      {renderBaseShape(spec.shape, fillRef, spec.secondary)}
      {renderDetail(spec.detail, spec.secondary, spec.accent)}

      {/* Eyes */}
      {spec.topper !== 'frog-eyes' && (
        spec.mouth === 'pixel' ? (
          <g fill={eyeColor}>
            <rect x={50 - spread - 4} y={eyeY - 4} width="8" height="8" rx="1" />
            <rect x={50 + spread - 4} y={eyeY - 4} width="8" height="8" rx="1" />
            <rect x={50 - spread - 2} y={eyeY - 3} width="2.5" height="2.5" fill="#FFFFFF" />
            <rect x={50 + spread - 2} y={eyeY - 3} width="2.5" height="2.5" fill="#FFFFFF" />
          </g>
        ) : (
          <g>
            <circle cx={50 - spread} cy={eyeY} r="4.8" fill={eyeColor} />
            <circle cx={50 - spread + 1.6} cy={eyeY - 1.6} r="1.7" fill="#FFFFFF" />
            <circle cx={50 + spread} cy={eyeY} r="4.8" fill={eyeColor} />
            <circle cx={50 + spread + 1.6} cy={eyeY - 1.6} r="1.7" fill="#FFFFFF" />
          </g>
        )
      )}

      {/* Cheeks */}
      {spec.cheek && spec.shape !== 'butterfly' && (
        <g opacity="0.72">
          <ellipse cx={50 - spread - 8} cy={eyeY + 7} rx="4.8" ry="2.8" fill={spec.cheek} />
          <ellipse cx={50 + spread + 8} cy={eyeY + 7} rx="4.8" ry="2.8" fill={spec.cheek} />
        </g>
      )}

      {/* Mouth / Beak / Snout */}
      {spec.mouth === 'beak' && (
        <polygon points={`45,${mouthY - 2} 55,${mouthY - 2} 50,${mouthY + 6}`} fill="#F59E0B" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
      )}
      {spec.mouth === 'cat' && (
        <path d={`M 44 ${mouthY} Q 47 ${mouthY + 4} 50 ${mouthY} Q 53 ${mouthY + 4} 56 ${mouthY}`} stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      )}
      {spec.mouth === 'snout' && (
        <g>
          <ellipse cx="50" cy={mouthY} rx="4.5" ry="3" fill="#1C1917" />
          <path d={`M 45 ${mouthY + 5} Q 50 ${mouthY + 9} 55 ${mouthY + 5}`} stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      )}
      {spec.mouth === 'happy' && (
        <path d={`M 44 ${mouthY - 1} Q 50 ${mouthY + 7} 56 ${mouthY - 1}`} stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      )}
      {spec.mouth === 'smile' && (
        <path d={`M 45 ${mouthY} Q 50 ${mouthY + 5} 55 ${mouthY}`} stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      )}
      {spec.mouth === 'pixel' && (
        <rect x="44" y={mouthY + 1} width="12" height="3.5" rx="1" fill="#1C1917" />
      )}
    </g>
  );
}

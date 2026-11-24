import React from 'react';

type P2Shape =
  | 'square'
  | 'pumpkin'
  | 'ghost'
  | 'egg'
  | 'mochi'
  | 'cloud'
  | 'pillow'
  | 'capy'
  | 'fish'
  | 'teacup'
  | 'castle'
  | 'lantern';

type P2Topper =
  | 'witch-hat'
  | 'pumpkin-stem'
  | 'bat-wings'
  | 'lion-crest'
  | 'hongbao-flap'
  | 'ingot-hat'
  | 'santa-hat'
  | 'snow-tophat'
  | 'reindeer-antlers'
  | 'pomelo-hat'
  | 'moon-halo'
  | 'bunny-ears'
  | 'flower-crown'
  | 'cat-ears'
  | 'yuzu-top'
  | 'towel-top'
  | 'ducky-top'
  | 'bear-ears'
  | 'fox-ears'
  | 'owl-tufts'
  | 'acorn-cap'
  | 'strawberry-top'
  | 'pudding-cap'
  | 'cherry-whip'
  | 'star-crown'
  | 'tiara'
  | 'fairy-wings'
  | 'mushroom-cap'
  | 'unicorn-horn'
  | 'dragon-horns'
  | 'whale-spout'
  | 'none';

type P2Detail =
  | 'jack-ribs'
  | 'candy-stripe'
  | 'vampire-cape'
  | 'gold-fu'
  | 'lantern-ribs'
  | 'icing-buttons'
  | 'scarf'
  | 'snowflake'
  | 'mooncake-stamp'
  | 'egg-polka'
  | 'whiskers'
  | 'calico-patch'
  | 'latte-swirl'
  | 'shell-hold'
  | 'belly-patch'
  | 'spots'
  | 'stripes'
  | 'glossy-squish'
  | 'boba-pearls'
  | 'macaron-seam'
  | 'ribbon-bow'
  | 'rose-emblem'
  | 'glass-sparkle'
  | 'star-hug'
  | 'firefly-glow'
  | 'none';

type P2Eyes = 'round' | 'happy' | 'chill' | 'starry';
type P2Mouth = 'smile' | 'cat' | 'happy' | 'snout' | 'beak' | 'fangs';

interface P2Spec {
  shape: P2Shape;
  topper: P2Topper;
  detail: P2Detail;
  eyes: P2Eyes;
  mouth: P2Mouth;
  body: string;
  secondary: string;
  accent: string;
  cheek: string;
  chroma?: [string, string, string];
}

export const PHASE2_COLLECTIBLE_SPECS: Record<string, P2Spec> = {
  // 19. HALLOWEEN SPOOKY PACK (8)
  'halloween-pumpkin-cat': { shape: 'pumpkin', topper: 'cat-ears', detail: 'jack-ribs', eyes: 'happy', mouth: 'cat', body: '#FB923C', secondary: '#FED7AA', accent: '#15803D', cheek: '#F43F5E' },
  'halloween-candy-ghost': { shape: 'ghost', topper: 'none', detail: 'candy-stripe', eyes: 'round', mouth: 'happy', body: '#FFFBEB', secondary: '#FDE047', accent: '#F97316', cheek: '#FDA4AF' },
  'halloween-witch-kitty': { shape: 'square', topper: 'witch-hat', detail: 'whiskers', eyes: 'round', mouth: 'cat', body: '#334155', secondary: '#A855F7', accent: '#FACC15', cheek: '#F472B6' },
  'halloween-berry-bat': { shape: 'square', topper: 'bat-wings', detail: 'belly-patch', eyes: 'round', mouth: 'fangs', body: '#9333EA', secondary: '#E9D5FF', accent: '#581C87', cheek: '#F9A8D4' },
  'halloween-broom-fox': { shape: 'square', topper: 'fox-ears', detail: 'scarf', eyes: 'happy', mouth: 'smile', body: '#EA580C', secondary: '#FEF3C7', accent: '#7C3AED', cheek: '#FB7185' },
  'halloween-moon-owl': { shape: 'square', topper: 'owl-tufts', detail: 'star-hug', eyes: 'round', mouth: 'beak', body: '#312E81', secondary: '#C7D2FE', accent: '#FDE047', cheek: '#F9A8D4' },
  'halloween-star-vampire': { shape: 'square', topper: 'bat-wings', detail: 'vampire-cape', eyes: 'starry', mouth: 'fangs', body: '#1E293B', secondary: '#DC2626', accent: '#FACC15', cheek: '#FDA4AF' },
  'halloween-chroma-pumpkin': { shape: 'pumpkin', topper: 'star-crown', detail: 'jack-ribs', eyes: 'starry', mouth: 'happy', body: '#F97316', secondary: '#FFFFFF', accent: '#DB2777', cheek: '#FDE047', chroma: ['#F97316', '#A855F7', '#EC4899'] },

  // 20. LUNAR NEW YEAR PACK (8)
  'lunar-lion-pup': { shape: 'square', topper: 'lion-crest', detail: 'gold-fu', eyes: 'happy', mouth: 'snout', body: '#EF4444', secondary: '#FEF08A', accent: '#FACC15', cheek: '#FDA4AF' },
  'lunar-hongbao-bunny': { shape: 'square', topper: 'hongbao-flap', detail: 'gold-fu', eyes: 'round', mouth: 'cat', body: '#DC2626', secondary: '#FDE047', accent: '#F59E0B', cheek: '#FDA4AF' },
  'lunar-ingot-cat': { shape: 'mochi', topper: 'ingot-hat', detail: 'whiskers', eyes: 'happy', mouth: 'cat', body: '#FEF3C7', secondary: '#FACC15', accent: '#D97706', cheek: '#FDA4AF' },
  'lunar-niangao-bear': { shape: 'mochi', topper: 'bear-ears', detail: 'glossy-squish', eyes: 'round', mouth: 'snout', body: '#FDBA74', secondary: '#FFF7ED', accent: '#DC2626', cheek: '#FB7185' },
  'lunar-lantern-fish': { shape: 'fish', topper: 'moon-halo', detail: 'lantern-ribs', eyes: 'round', mouth: 'smile', body: '#F43F5E', secondary: '#FDE047', accent: '#DC2626', cheek: '#FECDD3' },
  'lunar-spark-fox': { shape: 'lantern', topper: 'fox-ears', detail: 'lantern-ribs', eyes: 'starry', mouth: 'happy', body: '#DC2626', secondary: '#FEF08A', accent: '#F59E0B', cheek: '#FDBA74' },
  'lunar-jade-dragon': { shape: 'square', topper: 'dragon-horns', detail: 'gold-fu', eyes: 'starry', mouth: 'happy', body: '#10B981', secondary: '#D1FAE5', accent: '#FACC15', cheek: '#FDA4AF' },
  'lunar-chroma-koi': { shape: 'fish', topper: 'star-crown', detail: 'glass-sparkle', eyes: 'starry', mouth: 'happy', body: '#EC4899', secondary: '#FEF08A', accent: '#DB2777', cheek: '#FDE047', chroma: ['#EF4444', '#F59E0B', '#EC4899'] },

  // 21. WINTER HOLIDAY PACK (8)
  'winter-ginger-bear': { shape: 'square', topper: 'bear-ears', detail: 'icing-buttons', eyes: 'happy', mouth: 'snout', body: '#B45309', secondary: '#FFFFFF', accent: '#EF4444', cheek: '#FCA5A5' },
  'winter-cocoa-fawn': { shape: 'teacup', topper: 'reindeer-antlers', detail: 'spots', eyes: 'round', mouth: 'smile', body: '#B45309', secondary: '#FEF3C7', accent: '#FFFFFF', cheek: '#FDA4AF' },
  'winter-snow-penguin': { shape: 'mochi', topper: 'snow-tophat', detail: 'scarf', eyes: 'happy', mouth: 'beak', body: '#E0F2FE', secondary: '#0284C7', accent: '#DC2626', cheek: '#FDA4AF' },
  'winter-peppermint-bunny': { shape: 'square', topper: 'bunny-ears', detail: 'candy-stripe', eyes: 'round', mouth: 'cat', body: '#FFF1F2', secondary: '#DC2626', accent: '#16A34A', cheek: '#FDA4AF' },
  'winter-pinecone-owl': { shape: 'square', topper: 'santa-hat', detail: 'snowflake', eyes: 'round', mouth: 'beak', body: '#15803D', secondary: '#DCFCE7', accent: '#DC2626', cheek: '#FDA4AF' },
  'winter-sleigh-husky': { shape: 'square', topper: 'fox-ears', detail: 'scarf', eyes: 'round', mouth: 'snout', body: '#94A3B8', secondary: '#FFFFFF', accent: '#2563EB', cheek: '#FDA4AF' },
  'winter-aurora-reindeer': { shape: 'square', topper: 'reindeer-antlers', detail: 'snowflake', eyes: 'starry', mouth: 'snout', body: '#D97706', secondary: '#FEF3C7', accent: '#DC2626', cheek: '#FB7185' },
  'winter-chroma-snowflake': { shape: 'cloud', topper: 'tiara', detail: 'snowflake', eyes: 'starry', mouth: 'happy', body: '#38BDF8', secondary: '#FFFFFF', accent: '#818CF8', cheek: '#F9A8D4', chroma: ['#38BDF8', '#A855F7', '#F472B6'] },

  // 22. MID-AUTUMN MOON PACK (8)
  'midautumn-mochi-rabbit': { shape: 'mochi', topper: 'bunny-ears', detail: 'glossy-squish', eyes: 'happy', mouth: 'cat', body: '#FAF7F2', secondary: '#FBCFE8', accent: '#F59E0B', cheek: '#FDA4AF' },
  'midautumn-mooncake-cat': { shape: 'square', topper: 'cat-ears', detail: 'mooncake-stamp', eyes: 'round', mouth: 'cat', body: '#D97706', secondary: '#FEF3C7', accent: '#92400E', cheek: '#FDA4AF' },
  'midautumn-pomelo-capy': { shape: 'capy', topper: 'pomelo-hat', detail: 'belly-patch', eyes: 'chill', mouth: 'snout', body: '#B45309', secondary: '#FDE68A', accent: '#65A30D', cheek: '#FDBA74' },
  'midautumn-osmanthus-fawn': { shape: 'square', topper: 'flower-crown', detail: 'spots', eyes: 'round', mouth: 'smile', body: '#FDE047', secondary: '#FEF9C3', accent: '#CA8A04', cheek: '#FDBA74' },
  'midautumn-lantern-squirrel': { shape: 'lantern', topper: 'bear-ears', detail: 'lantern-ribs', eyes: 'round', mouth: 'happy', body: '#FB923C', secondary: '#FEF3C7', accent: '#EA580C', cheek: '#FDA4AF' },
  'midautumn-star-fox': { shape: 'square', topper: 'moon-halo', detail: 'star-hug', eyes: 'starry', mouth: 'smile', body: '#4F46E5', secondary: '#E0E7FF', accent: '#FDE047', cheek: '#F9A8D4' },
  'midautumn-palace-bunny': { shape: 'square', topper: 'bunny-ears', detail: 'ribbon-bow', eyes: 'starry', mouth: 'cat', body: '#FEF9C3', secondary: '#FDE047', accent: '#D97706', cheek: '#FDA4AF' },
  'midautumn-chroma-deer': { shape: 'square', topper: 'reindeer-antlers', detail: 'glass-sparkle', eyes: 'starry', mouth: 'happy', body: '#F59E0B', secondary: '#FEF3C7', accent: '#EC4899', cheek: '#F9A8D4', chroma: ['#F59E0B', '#EC4899', '#6366F1'] },

  // 23. SPRING & EASTER PACK (8)
  'easter-egg-bunny': { shape: 'egg', topper: 'bunny-ears', detail: 'egg-polka', eyes: 'happy', mouth: 'cat', body: '#FBCFE8', secondary: '#FDE047', accent: '#EC4899', cheek: '#F472B6' },
  'easter-tulip-chick': { shape: 'egg', topper: 'flower-crown', detail: 'belly-patch', eyes: 'round', mouth: 'beak', body: '#FEF08A', secondary: '#FFFFFF', accent: '#F43F5E', cheek: '#FDBA74' },
  'easter-honey-bear': { shape: 'square', topper: 'flower-crown', detail: 'belly-patch', eyes: 'happy', mouth: 'snout', body: '#FCD34D', secondary: '#FFFBEB', accent: '#F59E0B', cheek: '#FDA4AF' },
  'easter-blossom-lamb': { shape: 'cloud', topper: 'flower-crown', detail: 'ribbon-bow', eyes: 'round', mouth: 'smile', body: '#FAF5FF', secondary: '#E9D5FF', accent: '#A855F7', cheek: '#F9A8D4' },
  'easter-ribbon-duck': { shape: 'mochi', topper: 'ducky-top', detail: 'ribbon-bow', eyes: 'happy', mouth: 'beak', body: '#BAE6FD', secondary: '#FEF08A', accent: '#0EA5E9', cheek: '#FDA4AF' },
  'easter-sakura-squirrel': { shape: 'square', topper: 'bear-ears', detail: 'ribbon-bow', eyes: 'round', mouth: 'happy', body: '#FECDD3', secondary: '#FFF1F2', accent: '#F43F5E', cheek: '#FB7185' },
  'easter-rainbow-pixie': { shape: 'square', topper: 'fairy-wings', detail: 'egg-polka', eyes: 'starry', mouth: 'happy', body: '#A7F3D0', secondary: '#FEF08A', accent: '#10B981', cheek: '#FDA4AF' },
  'easter-chroma-bunny': { shape: 'egg', topper: 'bunny-ears', detail: 'glass-sparkle', eyes: 'starry', mouth: 'cat', body: '#F472B6', secondary: '#FFFFFF', accent: '#A855F7', cheek: '#FDE047', chroma: ['#F9A8D4', '#FDE047', '#67E8F9'] },

  // 24. CAT CAFÉ PACK (8)
  'catcafe-toast-tabby': { shape: 'square', topper: 'cat-ears', detail: 'stripes', eyes: 'happy', mouth: 'cat', body: '#FDBA74', secondary: '#9A3412', accent: '#EA580C', cheek: '#FDA4AF' },
  'catcafe-calico-latte': { shape: 'teacup', topper: 'cat-ears', detail: 'calico-patch', eyes: 'round', mouth: 'cat', body: '#FFFBEB', secondary: '#EA580C', accent: '#1C1917', cheek: '#FDA4AF' },
  'catcafe-ragdoll-cream': { shape: 'mochi', topper: 'cat-ears', detail: 'whiskers', eyes: 'round', mouth: 'cat', body: '#F8FAFC', secondary: '#94A3B8', accent: '#0284C7', cheek: '#FDA4AF' },
  'catcafe-donut-blackcat': { shape: 'square', topper: 'cat-ears', detail: 'whiskers', eyes: 'happy', mouth: 'cat', body: '#1E293B', secondary: '#F472B6', accent: '#FDE047', cheek: '#F472B6' },
  'catcafe-matcha-stripe': { shape: 'teacup', topper: 'cat-ears', detail: 'latte-swirl', eyes: 'chill', mouth: 'cat', body: '#86EFAC', secondary: '#15803D', accent: '#DCFCE7', cheek: '#FDA4AF' },
  'catcafe-macaron-siamese': { shape: 'square', topper: 'cat-ears', detail: 'ribbon-bow', eyes: 'round', mouth: 'cat', body: '#FEF3C7', secondary: '#78350F', accent: '#EC4899', cheek: '#F9A8D4' },
  'catcafe-royal-persian': { shape: 'cloud', topper: 'tiara', detail: 'whiskers', eyes: 'starry', mouth: 'cat', body: '#FFFFFF', secondary: '#FEF08A', accent: '#D97706', cheek: '#FDA4AF' },
  'catcafe-chroma-maneki': { shape: 'square', topper: 'cat-ears', detail: 'gold-fu', eyes: 'starry', mouth: 'cat', body: '#EC4899', secondary: '#FDE047', accent: '#DB2777', cheek: '#FDE047', chroma: ['#F472B6', '#818CF8', '#38BDF8'] },

  // 25. CAPYBARA & OTTER PACK (8)
  'capybara-yuzu-chill': { shape: 'capy', topper: 'yuzu-top', detail: 'belly-patch', eyes: 'chill', mouth: 'snout', body: '#B45309', secondary: '#FDE68A', accent: '#FACC15', cheek: '#FDBA74' },
  'capybara-shell-otter': { shape: 'square', topper: 'bear-ears', detail: 'shell-hold', eyes: 'happy', mouth: 'snout', body: '#78716C', secondary: '#F5F5F4', accent: '#14B8A6', cheek: '#FDA4AF' },
  'capybara-onsen-steam': { shape: 'capy', topper: 'towel-top', detail: 'belly-patch', eyes: 'chill', mouth: 'snout', body: '#B45309', secondary: '#FEF3C7', accent: '#38BDF8', cheek: '#FB7185' },
  'capybara-ducky-pal': { shape: 'capy', topper: 'ducky-top', detail: 'belly-patch', eyes: 'chill', mouth: 'snout', body: '#B45309', secondary: '#FDE68A', accent: '#FACC15', cheek: '#FDBA74' },
  'capybara-starfish-otter': { shape: 'square', topper: 'bear-ears', detail: 'star-hug', eyes: 'round', mouth: 'snout', body: '#64748B', secondary: '#E2E8F0', accent: '#EC4899', cheek: '#FDA4AF' },
  'capybara-berry-capy': { shape: 'capy', topper: 'strawberry-top', detail: 'belly-patch', eyes: 'chill', mouth: 'snout', body: '#B45309', secondary: '#FFE4E6', accent: '#E11D48', cheek: '#FB7185' },
  'capybara-pearl-otter': { shape: 'square', topper: 'tiara', detail: 'shell-hold', eyes: 'starry', mouth: 'snout', body: '#0D9488', secondary: '#CCFBF1', accent: '#FACC15', cheek: '#FDA4AF' },
  'capybara-chroma-king': { shape: 'capy', topper: 'star-crown', detail: 'glass-sparkle', eyes: 'chill', mouth: 'snout', body: '#EC4899', secondary: '#FFFFFF', accent: '#DB2777', cheek: '#FDE047', chroma: ['#34D399', '#38BDF8', '#F472B6'] },

  // 26. FOREST FRIENDS PACK (8)
  'forest-red-panda': { shape: 'square', topper: 'fox-ears', detail: 'stripes', eyes: 'happy', mouth: 'snout', body: '#EA580C', secondary: '#FFF7ED', accent: '#7C2D12', cheek: '#FDA4AF' },
  'forest-snow-tit': { shape: 'mochi', topper: 'none', detail: 'belly-patch', eyes: 'round', mouth: 'beak', body: '#FFFFFF', secondary: '#CBD5E1', accent: '#475569', cheek: '#FDA4AF' },
  'forest-glider-squirrel': { shape: 'square', topper: 'bear-ears', detail: 'belly-patch', eyes: 'round', mouth: 'happy', body: '#D97706', secondary: '#FEF3C7', accent: '#92400E', cheek: '#FDBA74' },
  'forest-berry-hog': { shape: 'square', topper: 'acorn-cap', detail: 'spots', eyes: 'round', mouth: 'snout', body: '#93C5FD', secondary: '#1D4ED8', accent: '#2563EB', cheek: '#FDA4AF' },
  'forest-cherry-fawn': { shape: 'square', topper: 'flower-crown', detail: 'spots', eyes: 'round', mouth: 'smile', body: '#FDBA74', secondary: '#FFFBEB', accent: '#16A34A', cheek: '#FDA4AF' },
  'forest-acorn-fox': { shape: 'square', topper: 'acorn-cap', detail: 'scarf', eyes: 'happy', mouth: 'smile', body: '#F97316', secondary: '#FEF3C7', accent: '#92400E', cheek: '#FDA4AF' },
  'forest-moon-wolf': { shape: 'square', topper: 'fox-ears', detail: 'star-hug', eyes: 'starry', mouth: 'snout', body: '#CBD5E1', secondary: '#F8FAFC', accent: '#4F46E5', cheek: '#C4B5FD' },
  'forest-chroma-stag': { shape: 'square', topper: 'reindeer-antlers', detail: 'glass-sparkle', eyes: 'starry', mouth: 'happy', body: '#10B981', secondary: '#D1FAE5', accent: '#EC4899', cheek: '#FDE047', chroma: ['#10B981', '#06B6D4', '#A855F7'] },

  // 27. MOCHI SQUISHY PACK (8)
  'mochi-ichigo-daifuku': { shape: 'mochi', topper: 'strawberry-top', detail: 'glossy-squish', eyes: 'happy', mouth: 'cat', body: '#FBCFE8', secondary: '#FFFFFF', accent: '#E11D48', cheek: '#F43F5E' },
  'mochi-mango-puff': { shape: 'mochi', topper: 'none', detail: 'glossy-squish', eyes: 'happy', mouth: 'smile', body: '#FDE047', secondary: '#FEF9C3', accent: '#F59E0B', cheek: '#FB923C' },
  'mochi-pudding-cat': { shape: 'mochi', topper: 'pudding-cap', detail: 'whiskers', eyes: 'happy', mouth: 'cat', body: '#FEF08A', secondary: '#92400E', accent: '#D97706', cheek: '#FDBA74' },
  'mochi-boba-squish': { shape: 'mochi', topper: 'cherry-whip', detail: 'boba-pearls', eyes: 'round', mouth: 'happy', body: '#FDE68A', secondary: '#78350F', accent: '#B45309', cheek: '#FDA4AF' },
  'mochi-cloud-souffle': { shape: 'mochi', topper: 'bear-ears', detail: 'glossy-squish', eyes: 'chill', mouth: 'snout', body: '#FED7AA', secondary: '#FFFBEB', accent: '#EA580C', cheek: '#FB7185' },
  'mochi-macaron-cub': { shape: 'mochi', topper: 'bear-ears', detail: 'macaron-seam', eyes: 'happy', mouth: 'smile', body: '#DDD6FE', secondary: '#FFFFFF', accent: '#9333EA', cheek: '#F9A8D4' },
  'mochi-sundae-bunny': { shape: 'mochi', topper: 'cherry-whip', detail: 'ribbon-bow', eyes: 'starry', mouth: 'cat', body: '#FCE7F3', secondary: '#FFFFFF', accent: '#EC4899', cheek: '#F472B6' },
  'mochi-chroma-star': { shape: 'mochi', topper: 'star-crown', detail: 'glossy-squish', eyes: 'starry', mouth: 'happy', body: '#F472B6', secondary: '#FFFFFF', accent: '#DB2777', cheek: '#FDE047', chroma: ['#F9A8D4', '#A78BFA', '#67E8F9'] },

  // 28. CLOUD SQUISHY PACK (8)
  'cloudsquishy-marshmallow-lamb': { shape: 'cloud', topper: 'none', detail: 'glossy-squish', eyes: 'happy', mouth: 'smile', body: '#FFF1F2', secondary: '#FBCFE8', accent: '#EC4899', cheek: '#F9A8D4' },
  'cloudsquishy-star-bear': { shape: 'pillow', topper: 'bear-ears', detail: 'star-hug', eyes: 'happy', mouth: 'snout', body: '#E0F2FE', secondary: '#FFFFFF', accent: '#EAB308', cheek: '#FDA4AF' },
  'cloudsquishy-moon-seal': { shape: 'mochi', topper: 'moon-halo', detail: 'glossy-squish', eyes: 'chill', mouth: 'cat', body: '#E0F2FE', secondary: '#FFFFFF', accent: '#0284C7', cheek: '#F9A8D4' },
  'cloudsquishy-peach-penguin': { shape: 'pillow', topper: 'none', detail: 'belly-patch', eyes: 'happy', mouth: 'beak', body: '#FED7AA', secondary: '#FFF7ED', accent: '#F97316', cheek: '#FB7185' },
  'cloudsquishy-mint-dino': { shape: 'pillow', topper: 'dragon-horns', detail: 'belly-patch', eyes: 'happy', mouth: 'smile', body: '#A7F3D0', secondary: '#ECFDF5', accent: '#10B981', cheek: '#FDA4AF' },
  'cloudsquishy-lavender-uni': { shape: 'cloud', topper: 'unicorn-horn', detail: 'glossy-squish', eyes: 'chill', mouth: 'smile', body: '#EDE9FE', secondary: '#FFFFFF', accent: '#7C3AED', cheek: '#F9A8D4' },
  'cloudsquishy-galaxy-whale': { shape: 'pillow', topper: 'whale-spout', detail: 'star-hug', eyes: 'starry', mouth: 'happy', body: '#3B82F6', secondary: '#DBEAFE', accent: '#FDE047', cheek: '#F9A8D4' },
  'cloudsquishy-chroma-cloud': { shape: 'cloud', topper: 'star-crown', detail: 'glass-sparkle', eyes: 'starry', mouth: 'happy', body: '#C084FC', secondary: '#FFFFFF', accent: '#DB2777', cheek: '#FDE047', chroma: ['#F9A8D4', '#C084FC', '#38BDF8'] },

  // 29. FAIRYTALE CASTLE PACK (8 — 100% Original Public-Domain Folklore Inspired)
  'fairytale-slipper-bunny': { shape: 'square', topper: 'bunny-ears', detail: 'glass-sparkle', eyes: 'round', mouth: 'cat', body: '#BAE6FD', secondary: '#FFFFFF', accent: '#0284C7', cheek: '#F9A8D4' },
  'fairytale-rose-teacup': { shape: 'teacup', topper: 'cat-ears', detail: 'rose-emblem', eyes: 'happy', mouth: 'cat', body: '#FFE4E6', secondary: '#FFFFFF', accent: '#E11D48', cheek: '#FB7185' },
  'fairytale-carriage-mouse': { shape: 'pumpkin', topper: 'bear-ears', detail: 'ribbon-bow', eyes: 'happy', mouth: 'smile', body: '#FDBA74', secondary: '#FEF3C7', accent: '#EA580C', cheek: '#FDA4AF' },
  'fairytale-lamp-fox': { shape: 'square', topper: 'fox-ears', detail: 'star-hug', eyes: 'round', mouth: 'smile', body: '#FACC15', secondary: '#FEF9C3', accent: '#7C3AED', cheek: '#FDBA74' },
  'fairytale-shell-mermaid': { shape: 'fish', topper: 'tiara', detail: 'shell-hold', eyes: 'round', mouth: 'happy', body: '#5EEAD4', secondary: '#CCFBF1', accent: '#0D9488', cheek: '#FDA4AF' },
  'fairytale-frost-swan': { shape: 'cloud', topper: 'tiara', detail: 'snowflake', eyes: 'starry', mouth: 'beak', body: '#E0F2FE', secondary: '#FFFFFF', accent: '#3B82F6', cheek: '#F9A8D4' },
  'fairytale-harp-pegasus': { shape: 'square', topper: 'fairy-wings', detail: 'ribbon-bow', eyes: 'starry', mouth: 'happy', body: '#FEF08A', secondary: '#FFFFFF', accent: '#CA8A04', cheek: '#FDA4AF' },
  'fairytale-chroma-dragon': { shape: 'castle', topper: 'dragon-horns', detail: 'glass-sparkle', eyes: 'starry', mouth: 'happy', body: '#60A5FA', secondary: '#FFFFFF', accent: '#DB2777', cheek: '#F9A8D4', chroma: ['#60A5FA', '#C084FC', '#F472B6'] },

  // 30. STARLIGHT FAIRYLAND PACK (8 — 100% Original Fairyland Fantasy)
  'fairyland-dewdrop-pixie': { shape: 'mochi', topper: 'fairy-wings', detail: 'glass-sparkle', eyes: 'happy', mouth: 'smile', body: '#BAE6FD', secondary: '#E0F2FE', accent: '#0EA5E9', cheek: '#F9A8D4' },
  'fairyland-mushroom-cat': { shape: 'square', topper: 'mushroom-cap', detail: 'whiskers', eyes: 'round', mouth: 'cat', body: '#FEF3C7', secondary: '#DC2626', accent: '#FFFFFF', cheek: '#FDA4AF' },
  'fairyland-firefly-fawn': { shape: 'square', topper: 'flower-crown', detail: 'firefly-glow', eyes: 'round', mouth: 'smile', body: '#BEF264', secondary: '#ECFCCB', accent: '#65A30D', cheek: '#FDBA74' },
  'fairyland-rainbow-foal': { shape: 'square', topper: 'unicorn-horn', detail: 'ribbon-bow', eyes: 'happy', mouth: 'smile', body: '#FBCFE8', secondary: '#FFFFFF', accent: '#EC4899', cheek: '#F472B6' },
  'fairyland-wand-owl': { shape: 'square', topper: 'owl-tufts', detail: 'star-hug', eyes: 'round', mouth: 'beak', body: '#C4B5FD', secondary: '#F5F3FF', accent: '#7C3AED', cheek: '#F9A8D4' },
  'fairyland-moon-butterfly': { shape: 'square', topper: 'fairy-wings', detail: 'firefly-glow', eyes: 'starry', mouth: 'happy', body: '#A5B4FC', secondary: '#E0E7FF', accent: '#4F46E5', cheek: '#F9A8D4' },
  'fairyland-dream-pegasus': { shape: 'cloud', topper: 'unicorn-horn', detail: 'star-hug', eyes: 'starry', mouth: 'happy', body: '#E9D5FF', secondary: '#FFFFFF', accent: '#9333EA', cheek: '#F9A8D4' },
  'fairyland-chroma-queen': { shape: 'square', topper: 'tiara', detail: 'firefly-glow', eyes: 'starry', mouth: 'happy', body: '#EC4899', secondary: '#FFFFFF', accent: '#DB2777', cheek: '#FDE047', chroma: ['#EC4899', '#A855F7', '#22D3EE'] },
};

function hexLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0.5;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function renderP2BackTopper(topper: P2Topper, body: string, secondary: string, accent: string): React.ReactNode {
  switch (topper) {
    case 'pumpkin-stem':
      return (
        <path d="M 46 30 Q 48 14 58 14 Q 56 24 54 30 Z" fill={accent} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
      );
    case 'bat-wings':
      return (
        <g fill={accent} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round">
          <path d="M 22 44 L 5 30 L 8 54 L 16 49 L 22 58 Z" />
          <path d="M 78 44 L 95 30 L 92 54 L 84 49 L 78 58 Z" />
          <polygon points="28,36 22,18 40,28" fill={body} />
          <polygon points="72,36 78,18 60,28" fill={body} />
        </g>
      );
    case 'lion-crest':
      return (
        <g>
          <circle cx="50" cy="24" r="14" fill={accent} stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="30" cy="30" r="9" fill={secondary} stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="70" cy="30" r="9" fill={secondary} stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="50" cy="22" r="6" fill="#DC2626" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'hongbao-flap':
      return (
        <g>
          <rect x="28" y="9" width="12" height="24" rx="6" fill="#FAF7F2" stroke="#1C1917" strokeWidth="2.8" />
          <rect x="60" y="9" width="12" height="24" rx="6" fill="#FAF7F2" stroke="#1C1917" strokeWidth="2.8" />
        </g>
      );
    case 'ingot-hat':
      return (
        <g>
          <path d="M 26 30 Q 50 14 74 30 L 68 38 L 32 38 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="50" cy="23" rx="11" ry="7" fill="#FEF08A" stroke="#1C1917" strokeWidth="2.4" />
        </g>
      );
    case 'snow-tophat':
      return (
        <g>
          <rect x="33" y="10" width="34" height="22" rx="4" fill="#1E293B" stroke="#1C1917" strokeWidth="2.8" />
          <rect x="24" y="29" width="52" height="7" rx="3.5" fill="#1E293B" stroke="#1C1917" strokeWidth="2.8" />
          <rect x="34" y="24" width="32" height="5" fill={accent} />
        </g>
      );
    case 'reindeer-antlers':
      return (
        <g stroke="#78350F" strokeWidth="4.2" strokeLinecap="round" fill="none">
          <path d="M 34 34 L 24 14 M 29 24 L 18 22 M 27 18 L 34 12" />
          <path d="M 66 34 L 76 14 M 71 24 L 82 22 M 73 18 L 66 12" />
        </g>
      );
    case 'moon-halo':
      return (
        <path
          d="M 55 9 A 10 10 0 1 0 55 27 A 7.4 7.4 0 1 1 55 9 Z"
          fill="#FDE047"
          stroke="#1C1917"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      );
    case 'bunny-ears':
      return (
        <g>
          <rect x="27" y="8" width="13" height="28" rx="6.5" fill={body} stroke="#1C1917" strokeWidth="3" />
          <rect x="31" y="13" width="5" height="17" rx="2.5" fill="#FBCFE8" />
          <rect x="60" y="8" width="13" height="28" rx="6.5" fill={body} stroke="#1C1917" strokeWidth="3" />
          <rect x="64" y="13" width="5" height="17" rx="2.5" fill="#FBCFE8" />
        </g>
      );
    case 'cat-ears':
      return (
        <g>
          <polygon points="22,40 24,14 44,30" fill={body} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="26,34 27,21 38,30" fill="#FBCFE8" />
          <polygon points="78,40 76,14 56,30" fill={body} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="74,34 73,21 62,30" fill="#FBCFE8" />
        </g>
      );
    case 'yuzu-top':
      return (
        <g>
          <circle cx="50" cy="23" r="10.5" fill={accent} stroke="#1C1917" strokeWidth="2.6" />
          <ellipse cx="56" cy="14" rx="5.5" ry="2.8" transform="rotate(-20 56 14)" fill="#22C55E" stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'towel-top':
      return (
        <g>
          <rect x="31" y="21" width="38" height="12" rx="4" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.6" />
          <line x1="35" y1="27" x2="65" y2="27" stroke={accent} strokeWidth="2.4" />
        </g>
      );
    case 'ducky-top':
      return (
        <g>
          <circle cx="50" cy="23" r="9.5" fill="#FDE047" stroke="#1C1917" strokeWidth="2.4" />
          <circle cx="47" cy="22" r="1.4" fill="#1C1917" />
          <circle cx="53" cy="22" r="1.4" fill="#1C1917" />
          <polygon points="48,25 52,25 50,28" fill="#F97316" />
        </g>
      );
    case 'bear-ears':
      return (
        <g>
          <circle cx="27" cy="30" r="10" fill={body} stroke="#1C1917" strokeWidth="3" />
          <circle cx="27" cy="30" r="5" fill={secondary} />
          <circle cx="73" cy="30" r="10" fill={body} stroke="#1C1917" strokeWidth="3" />
          <circle cx="73" cy="30" r="5" fill={secondary} />
        </g>
      );
    case 'fox-ears':
      return (
        <g>
          <polygon points="20,40 19,12 44,29" fill={body} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="24,34 24,19 37,29" fill="#FFFFFF" />
          <polygon points="80,40 81,12 56,29" fill={body} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="76,34 76,19 63,29" fill="#FFFFFF" />
        </g>
      );
    case 'owl-tufts':
      return (
        <g fill={accent} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round">
          <polygon points="24,36 18,16 38,26" />
          <polygon points="76,36 82,16 62,26" />
        </g>
      );
    case 'strawberry-top':
      return (
        <g>
          <path d="M 38 30 Q 50 10 62 30 Q 50 36 38 30 Z" fill="#E11D48" stroke="#1C1917" strokeWidth="2.6" />
          <path d="M 42 29 L 50 33 L 58 29" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'star-crown':
      return (
        <polygon
          points="30,32 34,14 43,23 50,10 57,23 66,14 70,32"
          fill="#FACC15"
          stroke="#1C1917"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      );
    case 'tiara':
      return (
        <g>
          <path d="M 30 33 L 36 18 L 44 26 L 50 13 L 56 26 L 64 18 L 70 33 Z" fill="#FDE047" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="50" cy="24" r="3" fill={accent} />
        </g>
      );
    case 'fairy-wings':
      return (
        <g fill="#E0F2FE" stroke="#1C1917" strokeWidth="2.4" opacity="0.92">
          <ellipse cx="15" cy="46" rx="11" ry="15" transform="rotate(-22 15 46)" />
          <ellipse cx="85" cy="46" rx="11" ry="15" transform="rotate(22 85 46)" />
          <ellipse cx="18" cy="64" rx="8" ry="10" transform="rotate(15 18 64)" fill="#FBCFE8" />
          <ellipse cx="82" cy="64" rx="8" ry="10" transform="rotate(-15 82 64)" fill="#FBCFE8" />
        </g>
      );
    case 'unicorn-horn':
      return (
        <g>
          <polygon points="44,32 50,8 56,32" fill="#FDE047" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <circle cx="30" cy="30" r="7" fill={body} stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="70" cy="30" r="7" fill={body} stroke="#1C1917" strokeWidth="2.6" />
        </g>
      );
    case 'dragon-horns':
      return (
        <g>
          <path d="M 30 34 Q 20 14 34 12 Q 36 22 40 32" fill="#FACC15" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M 70 34 Q 80 14 66 12 Q 64 22 60 32" fill="#FACC15" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
        </g>
      );
    case 'whale-spout':
      return (
        <g stroke="#38BDF8" strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M 50 30 Q 48 16 38 14" />
          <path d="M 50 30 Q 52 16 62 14" />
        </g>
      );
    case 'none':
    default:
      return null;
  }
}

function renderP2FrontTopper(topper: P2Topper, secondary: string, accent: string): React.ReactNode {
  switch (topper) {
    case 'witch-hat':
      return (
        <g>
          <polygon points="50,5 25,35 75,35" fill={secondary} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="50" cy="35" rx="34" ry="7" fill={secondary} stroke="#1C1917" strokeWidth="3" />
          <rect x="34" y="27" width="32" height="6" rx="2" fill={accent} stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'hongbao-flap':
      return (
        <path d="M 22 36 L 50 47 L 78 36" fill="none" stroke={secondary} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      );
    case 'santa-hat':
      return (
        <g>
          <path d="M 26 34 Q 44 6 76 22 L 70 34 Z" fill={accent} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <rect x="23" y="30" width="54" height="9" rx="4.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="77" cy="22" r="6" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.4" />
        </g>
      );
    case 'pomelo-hat':
      return (
        <g>
          <path d="M 24 38 Q 50 10 76 38 Z" fill={accent} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="50" cy="18" rx="6" ry="3.5" fill="#BEF264" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'flower-crown':
      return (
        <g>
          <circle cx="32" cy="30" r="7.5" fill={accent} stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="32" cy="30" r="2.8" fill="#FEF08A" />
          <circle cx="50" cy="26" r="8.5" fill="#F472B6" stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="50" cy="26" r="3.2" fill="#FEF08A" />
          <circle cx="68" cy="30" r="7.5" fill="#A855F7" stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="68" cy="30" r="2.8" fill="#FEF08A" />
        </g>
      );
    case 'acorn-cap':
      return (
        <g>
          <path d="M 22 36 Q 50 12 78 36 Z" fill="#92400E" stroke="#1C1917" strokeWidth="2.8" />
          <line x1="50" y1="14" x2="50" y2="21" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" />
        </g>
      );
    case 'pudding-cap':
      return (
        <path d="M 24 44 Q 32 28 50 28 Q 68 28 76 44 Q 68 48 60 44 Q 50 49 40 44 Q 32 48 24 44 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.8" />
      );
    case 'cherry-whip':
      return (
        <g>
          <ellipse cx="50" cy="31" rx="18" ry="8" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="50" cy="19" r="7" fill="#E11D48" stroke="#1C1917" strokeWidth="2.4" />
          <circle cx="48" cy="17" r="2" fill="#FFFFFF" />
        </g>
      );
    case 'mushroom-cap':
      return (
        <g>
          <path d="M 18 39 Q 50 6 82 39 Z" fill={secondary} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="38" cy="26" r="4.2" fill="#FFFFFF" />
          <circle cx="58" cy="22" r="4.8" fill="#FFFFFF" />
          <circle cx="67" cy="33" r="3.4" fill="#FFFFFF" />
        </g>
      );
    default:
      return null;
  }
}

function renderP2Shape(shape: P2Shape, fillRef: string, secondary: string): React.ReactNode {
  switch (shape) {
    case 'pumpkin':
      return (
        <g>
          <ellipse cx="32" cy="59" rx="18" ry="26" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
          <ellipse cx="68" cy="59" rx="18" ry="26" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
          <ellipse cx="50" cy="59" rx="22" ry="28" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
        </g>
      );
    case 'ghost':
      return (
        <path
          d="M 22 52 Q 22 20 50 20 Q 78 20 78 52 L 78 82 Q 70 74 62 82 Q 54 74 50 82 Q 46 74 38 82 Q 30 74 22 82 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      );
    case 'egg':
      return (
        <path
          d="M 50 24 C 72 24 80 48 78 68 C 76 82 65 88 50 88 C 35 88 24 82 22 68 C 20 48 28 24 50 24 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
        />
      );
    case 'mochi':
      return (
        <path
          d="M 20 66 Q 20 32 50 32 Q 80 32 80 66 Q 82 86 50 86 Q 18 86 20 66 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
        />
      );
    case 'cloud':
      return (
        <path
          d="M 26 78 Q 14 76 16 62 Q 14 46 28 42 Q 34 26 50 28 Q 66 26 72 42 Q 86 46 84 62 Q 86 76 74 78 Q 64 86 50 84 Q 36 86 26 78 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      );
    case 'pillow':
      return (
        <rect x="16" y="32" width="68" height="54" rx="26" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
      );
    case 'capy':
      return (
        <g>
          <circle cx="24" cy="40" r="7" fill={fillRef} stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="76" cy="40" r="7" fill={fillRef} stroke="#1C1917" strokeWidth="2.8" />
          <rect x="17" y="34" width="66" height="52" rx="22" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
        </g>
      );
    case 'fish':
      return (
        <g>
          <polygon points="18,58 6,44 10,72" fill={secondary} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <polygon points="82,58 94,44 90,72" fill={secondary} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="50" cy="58" rx="32" ry="26" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
        </g>
      );
    case 'teacup':
      return (
        <g>
          <path d="M 76 48 Q 92 48 90 62 Q 88 74 74 72" fill="none" stroke="#1C1917" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M 20 36 L 80 36 L 75 76 Q 73 86 50 86 Q 27 86 25 76 Z" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <ellipse cx="50" cy="36" rx="30" ry="6" fill={secondary} stroke="#1C1917" strokeWidth="2.8" />
        </g>
      );
    case 'castle':
      return (
        <g>
          <rect x="20" y="28" width="14" height="58" rx="4" fill={secondary} stroke="#1C1917" strokeWidth="3" />
          <rect x="66" y="28" width="14" height="58" rx="4" fill={secondary} stroke="#1C1917" strokeWidth="3" />
          <rect x="24" y="34" width="52" height="52" rx="14" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
        </g>
      );
    case 'lantern':
      return (
        <g>
          <rect x="36" y="26" width="28" height="8" rx="3" fill={secondary} stroke="#1C1917" strokeWidth="2.6" />
          <rect x="36" y="82" width="28" height="7" rx="3" fill={secondary} stroke="#1C1917" strokeWidth="2.6" />
          <ellipse cx="50" cy="58" rx="32" ry="26" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
        </g>
      );
    case 'square':
    default:
      return (
        <rect x="19" y="32" width="62" height="54" rx="19" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
      );
  }
}

function renderP2Detail(
  detail: P2Detail,
  secondary: string,
  accent: string,
  isDarkBody: boolean,
  isLightBody: boolean,
): React.ReactNode {
  switch (detail) {
    case 'jack-ribs':
      return (
        <g stroke="#1C1917" strokeWidth="1.6" opacity="0.22" fill="none">
          <path d="M 36 33 Q 30 59 36 85" />
          <path d="M 64 33 Q 70 59 64 85" />
        </g>
      );
    case 'candy-stripe':
      return (
        <g opacity="0.85">
          <path d="M 24 72 L 76 72" stroke={secondary} strokeWidth="6" strokeLinecap="round" />
          <path d="M 28 79 L 72 79" stroke={accent} strokeWidth="4.5" strokeLinecap="round" />
        </g>
      );
    case 'vampire-cape':
      return (
        <g>
          <polygon points="22,74 50,86 78,74 74,88 26,88" fill={secondary} stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="50" cy="77" r="4" fill={accent} stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'gold-fu':
      return (
        <g>
          <polygon points="50,69 59,77 50,85 41,77" fill="#FACC15" stroke="#1C1917" strokeWidth="2" />
          <circle cx="50" cy="77" r="2.2" fill="#DC2626" />
        </g>
      );
    case 'lantern-ribs':
      return (
        <g stroke={secondary} strokeWidth="2" opacity="0.55" fill="none">
          <ellipse cx="50" cy="58" rx="18" ry="24" />
        </g>
      );
    case 'icing-buttons':
      return (
        <g>
          <circle cx="43" cy="76" r="3.4" fill={accent} stroke="#1C1917" strokeWidth="1.4" />
          <circle cx="57" cy="76" r="3.4" fill="#16A34A" stroke="#1C1917" strokeWidth="1.4" />
        </g>
      );
    case 'scarf':
      return (
        <g>
          <rect x="20" y="73" width="60" height="10" rx="5" fill={accent} stroke="#1C1917" strokeWidth="2.4" />
          <rect x="37" y="73" width="8" height="10" fill="#FFFFFF" />
        </g>
      );
    case 'snowflake':
      return (
        <g stroke={isLightBody ? accent : '#FFFFFF'} strokeWidth="2.2" strokeLinecap="round">
          <line x1="50" y1="71" x2="50" y2="83" />
          <line x1="44" y1="77" x2="56" y2="77" />
          <line x1="46" y1="73" x2="54" y2="81" />
          <line x1="54" y1="73" x2="46" y2="81" />
        </g>
      );
    case 'mooncake-stamp':
      return (
        <g stroke={secondary} strokeWidth="2" fill="none" opacity="0.75">
          <circle cx="50" cy="76" r="7" />
          <circle cx="50" cy="76" r="3" fill={secondary} />
        </g>
      );
    case 'egg-polka':
      return (
        <g fill={secondary} opacity="0.88">
          <circle cx="32" cy="74" r="4.2" />
          <circle cx="50" cy="79" r="4.5" />
          <circle cx="68" cy="74" r="4.2" />
        </g>
      );
    case 'whiskers':
      return (
        <g stroke={isDarkBody ? '#F8FAFC' : '#1C1917'} strokeWidth="2.1" strokeLinecap="round">
          <line x1="15" y1="60" x2="27" y2="62" />
          <line x1="15" y1="67" x2="27" y2="67" />
          <line x1="85" y1="60" x2="73" y2="62" />
          <line x1="85" y1="67" x2="73" y2="67" />
        </g>
      );
    case 'calico-patch':
      return (
        <g opacity="0.85">
          <circle cx="28" cy="46" r="7" fill={secondary} />
          <circle cx="71" cy="73" r="6" fill={accent} />
        </g>
      );
    case 'latte-swirl':
      return (
        <path d="M 42 76 Q 50 68 58 76 Q 50 83 45 77" fill="none" stroke={accent} strokeWidth="2.6" strokeLinecap="round" />
      );
    case 'shell-hold':
      return (
        <path d="M 41 78 Q 50 67 59 78 Q 50 85 41 78 Z" fill="#FDE68A" stroke="#1C1917" strokeWidth="2.2" />
      );
    case 'belly-patch':
      return <ellipse cx="50" cy="74" rx="17" ry="9" fill={secondary} opacity="0.85" />;
    case 'spots':
      return (
        <g fill={secondary} opacity="0.75">
          <circle cx="29" cy="43" r="4" />
          <circle cx="71" cy="44" r="4.5" />
          <circle cx="68" cy="75" r="3.6" />
        </g>
      );
    case 'stripes':
      return (
        <g stroke={secondary} strokeWidth="3.2" strokeLinecap="round" opacity="0.8">
          <line x1="35" y1="35" x2="35" y2="42" />
          <line x1="50" y1="33" x2="50" y2="42" />
          <line x1="65" y1="35" x2="65" y2="42" />
        </g>
      );
    case 'glossy-squish':
      return (
        <ellipse cx="33" cy="43" rx="7" ry="3.5" transform="rotate(-24 33 43)" fill="#FFFFFF" opacity="0.72" />
      );
    case 'boba-pearls':
      return (
        <g fill="#292524">
          <circle cx="34" cy="77" r="3.8" />
          <circle cx="45" cy="79" r="3.8" />
          <circle cx="56" cy="79" r="3.8" />
          <circle cx="66" cy="77" r="3.8" />
        </g>
      );
    case 'macaron-seam':
      return (
        <rect x="22" y="72" width="56" height="8" rx="4" fill={secondary} stroke="#1C1917" strokeWidth="2" />
      );
    case 'ribbon-bow':
      return (
        <g>
          <polygon points="50,77 38,71 38,83" fill={accent} stroke="#1C1917" strokeWidth="2" />
          <polygon points="50,77 62,71 62,83" fill={accent} stroke="#1C1917" strokeWidth="2" />
          <circle cx="50" cy="77" r="3.2" fill="#FDE047" stroke="#1C1917" strokeWidth="1.6" />
        </g>
      );
    case 'rose-emblem':
      return (
        <g>
          <circle cx="50" cy="76" r="6.5" fill={accent} stroke="#1C1917" strokeWidth="2" />
          <path d="M 47 76 Q 50 72 53 76 Q 50 79 48 77" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        </g>
      );
    case 'glass-sparkle':
      return (
        <g fill="#FFFFFF" stroke={accent} strokeWidth="1.4">
          <polygon points="50,69 52.5,74.5 58,77 52.5,79.5 50,85 47.5,79.5 42,77 47.5,74.5" />
        </g>
      );
    case 'star-hug':
      return (
        <polygon
          points="50,68 52.8,74 59,74.6 54.2,78.6 55.6,84.8 50,81.5 44.4,84.8 45.8,78.6 41,74.6 47.2,74"
          fill="#FDE047"
          stroke="#1C1917"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      );
    case 'firefly-glow':
      return (
        <g stroke="#B45309" strokeWidth="1.3">
          <circle cx="28" cy="74" r="3.6" fill="#FDE047" />
          <circle cx="72" cy="73" r="4" fill="#FDE047" />
          <circle cx="50" cy="79" r="3.2" fill="#FEF08A" />
        </g>
      );
    case 'none':
    default:
      return null;
  }
}

export function renderPhase2Collectible(id: string, uid = 'p2'): React.ReactNode | null {
  const spec = PHASE2_COLLECTIBLE_SPECS[id];
  if (!spec) return null;

  const gradId = `${uid}-qv-p2-grad-${id}`;
  const fillRef = spec.chroma ? `url(#${gradId})` : spec.body;
  const lum = hexLuminance(spec.body);
  const isDarkBody = !spec.chroma && lum < 0.28;
  const isLightBody = !spec.chroma && lum > 0.72;
  const faceStroke = isDarkBody ? '#F8FAFC' : '#1C1917';
  const eyeY = spec.shape === 'ghost' ? 49 : spec.shape === 'teacup' ? 56 : 55;
  const spread = 14;
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

      {renderP2BackTopper(spec.topper, spec.body, spec.secondary, spec.accent)}
      {renderP2Shape(spec.shape, fillRef, spec.secondary)}
      {renderP2Detail(spec.detail, spec.secondary, spec.accent, isDarkBody, isLightBody)}
      {renderP2FrontTopper(spec.topper, spec.secondary, spec.accent)}

      {/* Eyes */}
      {spec.eyes === 'happy' && (
        <g stroke={faceStroke} strokeWidth="3.4" strokeLinecap="round" fill="none">
          <path d={`M ${50 - spread - 5} ${eyeY + 1} Q ${50 - spread} ${eyeY - 5} ${50 - spread + 5} ${eyeY + 1}`} />
          <path d={`M ${50 + spread - 5} ${eyeY + 1} Q ${50 + spread} ${eyeY - 5} ${50 + spread + 5} ${eyeY + 1}`} />
        </g>
      )}
      {spec.eyes === 'chill' && (
        <g stroke={faceStroke} strokeWidth="3.2" strokeLinecap="round" fill="none">
          <line x1={50 - spread - 5} y1={eyeY} x2={50 - spread + 5} y2={eyeY} />
          <line x1={50 + spread - 5} y1={eyeY} x2={50 + spread + 5} y2={eyeY} />
        </g>
      )}
      {(spec.eyes === 'round' || spec.eyes === 'starry') && (
        isDarkBody ? (
          <g>
            <circle cx={50 - spread} cy={eyeY} r="5.5" fill="#FEF9C3" stroke="#1C1917" strokeWidth="1.2" />
            <circle cx={50 - spread} cy={eyeY} r="3.2" fill="#1C1917" />
            <circle cx={50 - spread + 1.4} cy={eyeY - 1.4} r="1.4" fill="#FFFFFF" />
            <circle cx={50 + spread} cy={eyeY} r="5.5" fill="#FEF9C3" stroke="#1C1917" strokeWidth="1.2" />
            <circle cx={50 + spread} cy={eyeY} r="3.2" fill="#1C1917" />
            <circle cx={50 + spread + 1.4} cy={eyeY - 1.4} r="1.4" fill="#FFFFFF" />
          </g>
        ) : (
          <g>
            <circle cx={50 - spread} cy={eyeY} r="4.8" fill="#1C1917" />
            <circle cx={50 - spread + 1.6} cy={eyeY - 1.6} r="1.8" fill="#FFFFFF" />
            <circle cx={50 + spread} cy={eyeY} r="4.8" fill="#1C1917" />
            <circle cx={50 + spread + 1.6} cy={eyeY - 1.6} r="1.8" fill="#FFFFFF" />
            {spec.eyes === 'starry' && (
              <>
                <circle cx={50 - spread - 1.6} cy={eyeY + 1.8} r="1.1" fill="#FEF08A" />
                <circle cx={50 + spread - 1.6} cy={eyeY + 1.8} r="1.1" fill="#FEF08A" />
              </>
            )}
          </g>
        )
      )}

      {/* Cheeks */}
      <g opacity="0.78">
        <ellipse cx={50 - spread - 8} cy={eyeY + 7} rx="4.8" ry="2.8" fill={spec.cheek} />
        <ellipse cx={50 + spread + 8} cy={eyeY + 7} rx="4.8" ry="2.8" fill={spec.cheek} />
      </g>

      {/* Mouth */}
      {spec.mouth === 'beak' && (
        <polygon points={`45,${mouthY - 2} 55,${mouthY - 2} 50,${mouthY + 6}`} fill="#F59E0B" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
      )}
      {spec.mouth === 'cat' && (
        <path d={`M 44 ${mouthY} Q 47 ${mouthY + 4} 50 ${mouthY} Q 53 ${mouthY + 4} 56 ${mouthY}`} stroke={faceStroke} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      )}
      {spec.mouth === 'snout' && (
        <g>
          <ellipse cx="50" cy={mouthY - 1} rx="4.4" ry="2.8" fill={faceStroke} />
          <path d={`M 45 ${mouthY + 4} Q 50 ${mouthY + 8} 55 ${mouthY + 4}`} stroke={faceStroke} strokeWidth="2.3" strokeLinecap="round" fill="none" />
        </g>
      )}
      {spec.mouth === 'happy' && (
        <path d={`M 44 ${mouthY - 1} Q 50 ${mouthY + 7} 56 ${mouthY - 1}`} stroke={faceStroke} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      )}
      {spec.mouth === 'smile' && (
        <path d={`M 45 ${mouthY} Q 50 ${mouthY + 5} 55 ${mouthY}`} stroke={faceStroke} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      )}
      {spec.mouth === 'fangs' && (
        <g>
          <path d={`M 43 ${mouthY} Q 50 ${mouthY + 6} 57 ${mouthY}`} stroke={faceStroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <polygon points={`45,${mouthY + 1} 47.5,${mouthY + 1} 46.2,${mouthY + 5}`} fill="#FFFFFF" />
          <polygon points={`52.5,${mouthY + 1} 55,${mouthY + 1} 53.8,${mouthY + 5}`} fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
}

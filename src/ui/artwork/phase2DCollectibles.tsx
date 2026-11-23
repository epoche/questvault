import React from 'react';

type P2DShape =
  | 'square'
  | 'heart'
  | 'zongzi'
  | 'egg'
  | 'boat'
  | 'pie'
  | 'jelly'
  | 'octo'
  | 'blob'
  | 'nautilus'
  | 'whale'
  | 'fluffy'
  | 'pudding'
  | 'canele'
  | 'layered'
  | 'roll-cake'
  | 'toast-brick'
  | 'sundae-cup'
  | 'teapot'
  | 'pinecone'
  | 'cottage'
  | 'cloud'
  | 'pony';

type P2DBack =
  | 'none'
  | 'cupid-wings'
  | 'swan-wings'
  | 'bunny-ears'
  | 'bear-ears'
  | 'cat-ears'
  | 'fox-ears'
  | 'owl-tufts'
  | 'tiger-ears'
  | 'dragon-crest'
  | 'boat-oars'
  | 'turkey-feathers'
  | 'flap-fins'
  | 'sea-bunny-ears'
  | 'angler-lure'
  | 'squid-cape'
  | 'corgi-ears'
  | 'shiba-ears'
  | 'poodle-ears'
  | 'samoyed-ears'
  | 'floppy-ears'
  | 'husky-ears'
  | 'bichon-puff'
  | 'fern-wings'
  | 'bird-wings'
  | 'gold-antlers'
  | 'pony-ears'
  | 'pegasus-wings'
  | 'sea-fins';

type P2DFront =
  | 'none'
  | 'ribbon-bow-top'
  | 'love-seal'
  | 'rose-crown'
  | 'heart-crown'
  | 'zongzi-knot'
  | 'sachet-knot'
  | 'straw-hat'
  | 'drum-band'
  | 'pilgrim-hat'
  | 'whip-swirl'
  | 'maple-crown'
  | 'berry-top'
  | 'star-crown'
  | 'tiara'
  | 'fire-hat'
  | 'caramel-drip'
  | 'butter-pat'
  | 'cocoa-dust'
  | 'boba-straw'
  | 'icecream-scoop'
  | 'mushroom-lid'
  | 'moss-cap'
  | 'acorn-chef'
  | 'leaf-roof'
  | 'flower-crown'
  | 'unicorn-horn'
  | 'rainbow-mane'
  | 'pearl-horn'
  | 'eclipse-crown'
  | 'diamond-crown';

type P2DDetail =
  | 'none'
  | 'macaron-seam'
  | 'choco-ruffle'
  | 'heart-gem'
  | 'envelope-fold'
  | 'zongzi-twine'
  | 'tiger-stripes'
  | 'wave-trim'
  | 'dragon-scales'
  | 'pie-crust'
  | 'maple-scarf'
  | 'cider-steam'
  | 'blob-nose'
  | 'sea-bunny-spots'
  | 'angler-teeth'
  | 'nautilus-spiral'
  | 'whale-stars'
  | 'corgi-chest'
  | 'shiba-kerchief'
  | 'dalmatian-spots'
  | 'sweater-stripe'
  | 'tennis-ball'
  | 'husky-mask'
  | 'souffle-seam'
  | 'canele-flutes'
  | 'tiramisu-layers'
  | 'crepe-layers'
  | 'boba-pearls'
  | 'swiss-swirl'
  | 'honey-grid'
  | 'pine-scales'
  | 'post-bag'
  | 'cottage-door'
  | 'whiskers'
  | 'spots'
  | 'glossy-squish'
  | 'meteor-trail'
  | 'aurora-ribbon'
  | 'diamond-facets'
  | 'galaxy-stars'
  | 'star-hug';

type P2DEyes = 'round' | 'happy' | 'chill' | 'starry' | 'blue';
type P2DMouth = 'smile' | 'cat' | 'happy' | 'snout' | 'beak' | 'fangs';

interface P2DSpec {
  shape: P2DShape;
  back: P2DBack;
  front: P2DFront;
  detail: P2DDetail;
  eyes: P2DEyes;
  mouth: P2DMouth;
  body: string;
  secondary: string;
  accent: string;
  cheek: string;
  chroma?: [string, string, string];
}

export const PHASE2D_COLLECTIBLE_SPECS: Record<string, P2DSpec> = {
  // 31. VALENTINE SWEETS (6)
  'valentine-heart-macaron': {
    shape: 'heart',
    back: 'none',
    front: 'berry-top',
    detail: 'macaron-seam',
    eyes: 'happy',
    mouth: 'smile',
    body: '#F9A8D4',
    secondary: '#FFF1F2',
    accent: '#E11D48',
    cheek: '#FB7185',
  },
  'valentine-choco-bear': {
    shape: 'square',
    back: 'bear-ears',
    front: 'ribbon-bow-top',
    detail: 'choco-ruffle',
    eyes: 'round',
    mouth: 'snout',
    body: '#5C2D0C',
    secondary: '#FDE68A',
    accent: '#E11D48',
    cheek: '#FDA4AF',
  },
  'valentine-cupid-bunny': {
    shape: 'square',
    back: 'cupid-wings',
    front: 'heart-crown',
    detail: 'heart-gem',
    eyes: 'happy',
    mouth: 'cat',
    body: '#FFF1F2',
    secondary: '#FECDD3',
    accent: '#F43F5E',
    cheek: '#FB7185',
  },
  'valentine-love-letter': {
    shape: 'square',
    back: 'owl-tufts',
    front: 'love-seal',
    detail: 'envelope-fold',
    eyes: 'round',
    mouth: 'beak',
    body: '#FFFBEB',
    secondary: '#FECDD3',
    accent: '#E11D48',
    cheek: '#FDA4AF',
  },
  'valentine-rose-swan': {
    shape: 'cloud',
    back: 'swan-wings',
    front: 'rose-crown',
    detail: 'heart-gem',
    eyes: 'starry',
    mouth: 'beak',
    body: '#FFFFFF',
    secondary: '#FFE4E6',
    accent: '#BE123C',
    cheek: '#FDA4AF',
  },
  'valentine-chroma-heart': {
    shape: 'heart',
    back: 'cupid-wings',
    front: 'tiara',
    detail: 'diamond-facets',
    eyes: 'starry',
    mouth: 'happy',
    body: '#EC4899',
    secondary: '#FFFFFF',
    accent: '#DB2777',
    cheek: '#FDE047',
    chroma: ['#F472B6', '#C084FC', '#38BDF8'],
  },

  // 32. DRAGON BOAT CREW (6)
  'dragonboat-bamboo-zongzi': {
    shape: 'zongzi',
    back: 'none',
    front: 'zongzi-knot',
    detail: 'zongzi-twine',
    eyes: 'happy',
    mouth: 'smile',
    body: '#22C55E',
    secondary: '#15803D',
    accent: '#FEF08A',
    cheek: '#FDA4AF',
  },
  'dragonboat-sachet-tiger': {
    shape: 'square',
    back: 'tiger-ears',
    front: 'sachet-knot',
    detail: 'tiger-stripes',
    eyes: 'happy',
    mouth: 'cat',
    body: '#FB923C',
    secondary: '#FEF3C7',
    accent: '#DC2626',
    cheek: '#F43F5E',
  },
  'dragonboat-egg-chick': {
    shape: 'egg',
    back: 'bird-wings',
    front: 'straw-hat',
    detail: 'spots',
    eyes: 'round',
    mouth: 'beak',
    body: '#FEF08A',
    secondary: '#FDE047',
    accent: '#EA580C',
    cheek: '#FB923C',
  },
  'dragonboat-paddle-otter': {
    shape: 'boat',
    back: 'boat-oars',
    front: 'drum-band',
    detail: 'wave-trim',
    eyes: 'happy',
    mouth: 'snout',
    body: '#92400E',
    secondary: '#FDE68A',
    accent: '#DC2626',
    cheek: '#FDA4AF',
  },
  'dragonboat-river-dragon': {
    shape: 'boat',
    back: 'dragon-crest',
    front: 'star-crown',
    detail: 'dragon-scales',
    eyes: 'starry',
    mouth: 'happy',
    body: '#059669',
    secondary: '#A7F3D0',
    accent: '#FACC15',
    cheek: '#FDA4AF',
  },
  'dragonboat-chroma-dragon': {
    shape: 'boat',
    back: 'dragon-crest',
    front: 'diamond-crown',
    detail: 'wave-trim',
    eyes: 'starry',
    mouth: 'happy',
    body: '#06B6D4',
    secondary: '#FFFFFF',
    accent: '#DB2777',
    cheek: '#FDE047',
    chroma: ['#10B981', '#06B6D4', '#EC4899'],
  },

  // 33. HARVEST FEAST (8)
  'thanksgiving-pumpkin-pie': {
    shape: 'pie',
    back: 'floppy-ears',
    front: 'whip-swirl',
    detail: 'pie-crust',
    eyes: 'happy',
    mouth: 'snout',
    body: '#EA580C',
    secondary: '#FDE68A',
    accent: '#FFFFFF',
    cheek: '#FB7185',
  },
  'thanksgiving-maple-fox': {
    shape: 'square',
    back: 'fox-ears',
    front: 'maple-crown',
    detail: 'maple-scarf',
    eyes: 'happy',
    mouth: 'smile',
    body: '#DC2626',
    secondary: '#FEF3C7',
    accent: '#F59E0B',
    cheek: '#FDBA74',
  },
  'thanksgiving-cranberry-bear': {
    shape: 'square',
    back: 'bear-ears',
    front: 'berry-top',
    detail: 'glossy-squish',
    eyes: 'round',
    mouth: 'snout',
    body: '#9F1239',
    secondary: '#FECDD3',
    accent: '#16A34A',
    cheek: '#FDA4AF',
  },
  'thanksgiving-acorn-turkey': {
    shape: 'square',
    back: 'turkey-feathers',
    front: 'pilgrim-hat',
    detail: 'spots',
    eyes: 'happy',
    mouth: 'beak',
    body: '#92400E',
    secondary: '#F59E0B',
    accent: '#DC2626',
    cheek: '#FB7185',
  },
  'thanksgiving-cornucopia-cat': {
    shape: 'square',
    back: 'cat-ears',
    front: 'maple-crown',
    detail: 'whiskers',
    eyes: 'chill',
    mouth: 'cat',
    body: '#F59E0B',
    secondary: '#FEF3C7',
    accent: '#EA580C',
    cheek: '#FDA4AF',
  },
  'thanksgiving-cider-owl': {
    shape: 'teapot',
    back: 'owl-tufts',
    front: 'whip-swirl',
    detail: 'cider-steam',
    eyes: 'round',
    mouth: 'beak',
    body: '#B45309',
    secondary: '#FDE68A',
    accent: '#DC2626',
    cheek: '#FDBA74',
  },
  'thanksgiving-golden-turkey': {
    shape: 'square',
    back: 'turkey-feathers',
    front: 'star-crown',
    detail: 'star-hug',
    eyes: 'starry',
    mouth: 'beak',
    body: '#CA8A04',
    secondary: '#FEF08A',
    accent: '#EA580C',
    cheek: '#FB7185',
  },
  'thanksgiving-chroma-harvest': {
    shape: 'cloud',
    back: 'turkey-feathers',
    front: 'maple-crown',
    detail: 'galaxy-stars',
    eyes: 'starry',
    mouth: 'happy',
    body: '#F97316',
    secondary: '#FEF08A',
    accent: '#DB2777',
    cheek: '#FDE047',
    chroma: ['#F97316', '#EAB308', '#EC4899'],
  },

  // 34. DEEP SEA CUTIES (9)
  'deepsea-blobfish-blush': {
    shape: 'blob',
    back: 'none',
    front: 'none',
    detail: 'blob-nose',
    eyes: 'chill',
    mouth: 'smile',
    body: '#FBCFE8',
    secondary: '#F9A8D4',
    accent: '#EC4899',
    cheek: '#F472B6',
  },
  'deepsea-flap-octo': {
    shape: 'octo',
    back: 'flap-fins',
    front: 'none',
    detail: 'glossy-squish',
    eyes: 'round',
    mouth: 'smile',
    body: '#FDBA74',
    secondary: '#FFEDD5',
    accent: '#EA580C',
    cheek: '#FB7185',
  },
  'deepsea-glass-jelly': {
    shape: 'jelly',
    back: 'none',
    front: 'none',
    detail: 'glossy-squish',
    eyes: 'happy',
    mouth: 'smile',
    body: '#7DD3FC',
    secondary: '#E0F2FE',
    accent: '#0284C7',
    cheek: '#F9A8D4',
  },
  'deepsea-sea-bunny': {
    shape: 'fluffy',
    back: 'sea-bunny-ears',
    front: 'none',
    detail: 'sea-bunny-spots',
    eyes: 'happy',
    mouth: 'cat',
    body: '#FAF7F2',
    secondary: '#E2E8F0',
    accent: '#1E293B',
    cheek: '#FDA4AF',
  },
  'deepsea-lantern-angler': {
    shape: 'square',
    back: 'angler-lure',
    front: 'none',
    detail: 'angler-teeth',
    eyes: 'round',
    mouth: 'fangs',
    body: '#1E3A8A',
    secondary: '#60A5FA',
    accent: '#FDE047',
    cheek: '#F472B6',
  },
  'deepsea-nautilus-pal': {
    shape: 'nautilus',
    back: 'none',
    front: 'none',
    detail: 'nautilus-spiral',
    eyes: 'round',
    mouth: 'smile',
    body: '#FEF3C7',
    secondary: '#D97706',
    accent: '#92400E',
    cheek: '#FDBA74',
  },
  'deepsea-vampire-squid': {
    shape: 'octo',
    back: 'squid-cape',
    front: 'none',
    detail: 'galaxy-stars',
    eyes: 'starry',
    mouth: 'fangs',
    body: '#3B0764',
    secondary: '#C084FC',
    accent: '#22D3EE',
    cheek: '#F472B6',
  },
  'deepsea-abyss-whale': {
    shape: 'whale',
    back: 'none',
    front: 'star-crown',
    detail: 'whale-stars',
    eyes: 'starry',
    mouth: 'happy',
    body: '#1E293B',
    secondary: '#38BDF8',
    accent: '#FDE047',
    cheek: '#F472B6',
  },
  'deepsea-chroma-jelly': {
    shape: 'jelly',
    back: 'none',
    front: 'tiara',
    detail: 'galaxy-stars',
    eyes: 'starry',
    mouth: 'happy',
    body: '#22D3EE',
    secondary: '#FFFFFF',
    accent: '#DB2777',
    cheek: '#FDE047',
    chroma: ['#22D3EE', '#A855F7', '#EC4899'],
  },

  // 35. PUPPY PARK (10)
  'puppypark-corgi-loaf': {
    shape: 'square',
    back: 'corgi-ears',
    front: 'none',
    detail: 'corgi-chest',
    eyes: 'happy',
    mouth: 'snout',
    body: '#F59E0B',
    secondary: '#FFFBEB',
    accent: '#EA580C',
    cheek: '#FDA4AF',
  },
  'puppypark-shiba-smile': {
    shape: 'square',
    back: 'shiba-ears',
    front: 'none',
    detail: 'shiba-kerchief',
    eyes: 'happy',
    mouth: 'snout',
    body: '#FDBA74',
    secondary: '#FFFBEB',
    accent: '#DC2626',
    cheek: '#FB7185',
  },
  'puppypark-poodle-puff': {
    shape: 'fluffy',
    back: 'poodle-ears',
    front: 'ribbon-bow-top',
    detail: 'glossy-squish',
    eyes: 'round',
    mouth: 'snout',
    body: '#FBCFE8',
    secondary: '#FCE7F3',
    accent: '#EC4899',
    cheek: '#F472B6',
  },
  'puppypark-samoyed-cloud': {
    shape: 'cloud',
    back: 'samoyed-ears',
    front: 'none',
    detail: 'glossy-squish',
    eyes: 'happy',
    mouth: 'snout',
    body: '#FFFFFF',
    secondary: '#E0F2FE',
    accent: '#0EA5E9',
    cheek: '#FDA4AF',
  },
  'puppypark-dalmatian-spot': {
    shape: 'square',
    back: 'floppy-ears',
    front: 'fire-hat',
    detail: 'dalmatian-spots',
    eyes: 'round',
    mouth: 'snout',
    body: '#F8FAFC',
    secondary: '#1E293B',
    accent: '#DC2626',
    cheek: '#FDA4AF',
  },
  'puppypark-dachshund-hotdog': {
    shape: 'square',
    back: 'floppy-ears',
    front: 'none',
    detail: 'sweater-stripe',
    eyes: 'round',
    mouth: 'snout',
    body: '#78350F',
    secondary: '#FDE68A',
    accent: '#16A34A',
    cheek: '#FDA4AF',
  },
  'puppypark-golden-fetch': {
    shape: 'square',
    back: 'floppy-ears',
    front: 'none',
    detail: 'tennis-ball',
    eyes: 'happy',
    mouth: 'snout',
    body: '#FCD34D',
    secondary: '#FEF3C7',
    accent: '#84CC16',
    cheek: '#FDBA74',
  },
  'puppypark-husky-breeze': {
    shape: 'square',
    back: 'husky-ears',
    front: 'none',
    detail: 'husky-mask',
    eyes: 'blue',
    mouth: 'snout',
    body: '#64748B',
    secondary: '#F8FAFC',
    accent: '#38BDF8',
    cheek: '#FDA4AF',
  },
  'puppypark-bichon-cotton': {
    shape: 'cloud',
    back: 'bichon-puff',
    front: 'star-crown',
    detail: 'glossy-squish',
    eyes: 'starry',
    mouth: 'snout',
    body: '#FFFFFF',
    secondary: '#FEF9C3',
    accent: '#F59E0B',
    cheek: '#FDA4AF',
  },
  'puppypark-chroma-hound': {
    shape: 'square',
    back: 'corgi-ears',
    front: 'diamond-crown',
    detail: 'galaxy-stars',
    eyes: 'starry',
    mouth: 'snout',
    body: '#A855F7',
    secondary: '#FFFFFF',
    accent: '#DB2777',
    cheek: '#FDE047',
    chroma: ['#38BDF8', '#A855F7', '#F472B6'],
  },

  // 36. SWEET SQUISHY 2 (9)
  'dessertsquishy-caramel-pudding': {
    shape: 'pudding',
    back: 'none',
    front: 'caramel-drip',
    detail: 'glossy-squish',
    eyes: 'happy',
    mouth: 'smile',
    body: '#FEF08A',
    secondary: '#78350F',
    accent: '#E11D48',
    cheek: '#FDBA74',
  },
  'dessertsquishy-fluffy-souffle': {
    shape: 'fluffy',
    back: 'none',
    front: 'butter-pat',
    detail: 'souffle-seam',
    eyes: 'chill',
    mouth: 'smile',
    body: '#FDE68A',
    secondary: '#FFFBEB',
    accent: '#F59E0B',
    cheek: '#FDA4AF',
  },
  'dessertsquishy-canele-bear': {
    shape: 'canele',
    back: 'bear-ears',
    front: 'none',
    detail: 'canele-flutes',
    eyes: 'round',
    mouth: 'snout',
    body: '#451A03',
    secondary: '#B45309',
    accent: '#FEF3C7',
    cheek: '#FDBA74',
  },
  'dessertsquishy-tiramisu-cat': {
    shape: 'layered',
    back: 'cat-ears',
    front: 'cocoa-dust',
    detail: 'tiramisu-layers',
    eyes: 'happy',
    mouth: 'cat',
    body: '#FEF3C7',
    secondary: '#78350F',
    accent: '#B45309',
    cheek: '#FDA4AF',
  },
  'dessertsquishy-berry-crepe': {
    shape: 'layered',
    back: 'none',
    front: 'berry-top',
    detail: 'crepe-layers',
    eyes: 'happy',
    mouth: 'smile',
    body: '#FFF1F2',
    secondary: '#FB7185',
    accent: '#E11D48',
    cheek: '#F9A8D4',
  },
  'dessertsquishy-boba-sundae': {
    shape: 'sundae-cup',
    back: 'none',
    front: 'boba-straw',
    detail: 'boba-pearls',
    eyes: 'round',
    mouth: 'happy',
    body: '#FDE68A',
    secondary: '#FFFFFF',
    accent: '#EC4899',
    cheek: '#FDA4AF',
  },
  'dessertsquishy-matcha-roll': {
    shape: 'roll-cake',
    back: 'none',
    front: 'berry-top',
    detail: 'swiss-swirl',
    eyes: 'chill',
    mouth: 'smile',
    body: '#86EFAC',
    secondary: '#FFFBEB',
    accent: '#15803D',
    cheek: '#FDA4AF',
  },
  'dessertsquishy-honey-brick': {
    shape: 'toast-brick',
    back: 'none',
    front: 'icecream-scoop',
    detail: 'honey-grid',
    eyes: 'starry',
    mouth: 'happy',
    body: '#F59E0B',
    secondary: '#FEF3C7',
    accent: '#D97706',
    cheek: '#FB7185',
  },
  'dessertsquishy-chroma-souffle': {
    shape: 'fluffy',
    back: 'cupid-wings',
    front: 'star-crown',
    detail: 'souffle-seam',
    eyes: 'starry',
    mouth: 'happy',
    body: '#F472B6',
    secondary: '#FFFFFF',
    accent: '#DB2777',
    cheek: '#FDE047',
    chroma: ['#F9A8D4', '#FDE047', '#67E8F9'],
  },

  // 37. WOODLAND COTTAGE (10)
  'fairycottage-mushroom-teapot': {
    shape: 'teapot',
    back: 'none',
    front: 'mushroom-lid',
    detail: 'spots',
    eyes: 'happy',
    mouth: 'smile',
    body: '#FEF3C7',
    secondary: '#DC2626',
    accent: '#FFFFFF',
    cheek: '#FDA4AF',
  },
  'fairycottage-pinecone-sprite': {
    shape: 'pinecone',
    back: 'none',
    front: 'maple-crown',
    detail: 'pine-scales',
    eyes: 'round',
    mouth: 'smile',
    body: '#78350F',
    secondary: '#B45309',
    accent: '#22C55E',
    cheek: '#FDBA74',
  },
  'fairycottage-moss-postman': {
    shape: 'square',
    back: 'bear-ears',
    front: 'moss-cap',
    detail: 'post-bag',
    eyes: 'happy',
    mouth: 'smile',
    body: '#86EFAC',
    secondary: '#15803D',
    accent: '#F59E0B',
    cheek: '#FDA4AF',
  },
  'fairycottage-acorn-baker': {
    shape: 'egg',
    back: 'none',
    front: 'acorn-chef',
    detail: 'spots',
    eyes: 'happy',
    mouth: 'smile',
    body: '#D97706',
    secondary: '#FFFFFF',
    accent: '#78350F',
    cheek: '#FDBA74',
  },
  'fairycottage-fern-fairy': {
    shape: 'square',
    back: 'fern-wings',
    front: 'flower-crown',
    detail: 'star-hug',
    eyes: 'round',
    mouth: 'happy',
    body: '#A7F3D0',
    secondary: '#10B981',
    accent: '#059669',
    cheek: '#FDA4AF',
  },
  'fairycottage-dew-hummingbird': {
    shape: 'egg',
    back: 'bird-wings',
    front: 'flower-crown',
    detail: 'glossy-squish',
    eyes: 'round',
    mouth: 'beak',
    body: '#14B8A6',
    secondary: '#99F6E4',
    accent: '#EC4899',
    cheek: '#FDA4AF',
  },
  'fairycottage-hollow-owl': {
    shape: 'cottage',
    back: 'owl-tufts',
    front: 'leaf-roof',
    detail: 'cottage-door',
    eyes: 'round',
    mouth: 'beak',
    body: '#78350F',
    secondary: '#FEF08A',
    accent: '#15803D',
    cheek: '#FDBA74',
  },
  'fairycottage-goldleaf-deer': {
    shape: 'square',
    back: 'gold-antlers',
    front: 'flower-crown',
    detail: 'spots',
    eyes: 'starry',
    mouth: 'smile',
    body: '#FCD34D',
    secondary: '#FFFBEB',
    accent: '#CA8A04',
    cheek: '#FDBA74',
  },
  'fairycottage-moon-cottage': {
    shape: 'cottage',
    back: 'none',
    front: 'leaf-roof',
    detail: 'cottage-door',
    eyes: 'starry',
    mouth: 'happy',
    body: '#312E81',
    secondary: '#FDE047',
    accent: '#10B981',
    cheek: '#F9A8D4',
  },
  'fairycottage-chroma-king': {
    shape: 'square',
    back: 'gold-antlers',
    front: 'diamond-crown',
    detail: 'galaxy-stars',
    eyes: 'starry',
    mouth: 'happy',
    body: '#10B981',
    secondary: '#FFFFFF',
    accent: '#DB2777',
    cheek: '#FDE047',
    chroma: ['#10B981', '#38BDF8', '#A855F7'],
  },

  // 38. STARLIGHT UNICORN (12)
  'starunicorn-cloud-pony': {
    shape: 'cloud',
    back: 'pony-ears',
    front: 'none',
    detail: 'glossy-squish',
    eyes: 'happy',
    mouth: 'smile',
    body: '#E0F2FE',
    secondary: '#FFFFFF',
    accent: '#38BDF8',
    cheek: '#F9A8D4',
  },
  'starunicorn-rainbow-mane': {
    shape: 'pony',
    back: 'pony-ears',
    front: 'rainbow-mane',
    detail: 'star-hug',
    eyes: 'happy',
    mouth: 'smile',
    body: '#FFFFFF',
    secondary: '#FBCFE8',
    accent: '#EC4899',
    cheek: '#F9A8D4',
  },
  'starunicorn-sakura-pegasus': {
    shape: 'pony',
    back: 'pegasus-wings',
    front: 'flower-crown',
    detail: 'spots',
    eyes: 'round',
    mouth: 'smile',
    body: '#FCE7F3',
    secondary: '#F9A8D4',
    accent: '#EC4899',
    cheek: '#F472B6',
  },
  'starunicorn-mint-unicorn': {
    shape: 'pony',
    back: 'pony-ears',
    front: 'unicorn-horn',
    detail: 'glossy-squish',
    eyes: 'happy',
    mouth: 'smile',
    body: '#A7F3D0',
    secondary: '#ECFDF5',
    accent: '#10B981',
    cheek: '#FDA4AF',
  },
  'starunicorn-pearl-seauni': {
    shape: 'pony',
    back: 'sea-fins',
    front: 'pearl-horn',
    detail: 'wave-trim',
    eyes: 'round',
    mouth: 'smile',
    body: '#BAE6FD',
    secondary: '#FFFFFF',
    accent: '#0284C7',
    cheek: '#F9A8D4',
  },
  'starunicorn-meteor-pony': {
    shape: 'pony',
    back: 'pony-ears',
    front: 'unicorn-horn',
    detail: 'meteor-trail',
    eyes: 'starry',
    mouth: 'happy',
    body: '#FEF08A',
    secondary: '#FDBA74',
    accent: '#F59E0B',
    cheek: '#FB7185',
  },
  'starunicorn-aurora-unicorn': {
    shape: 'pony',
    back: 'pony-ears',
    front: 'unicorn-horn',
    detail: 'aurora-ribbon',
    eyes: 'starry',
    mouth: 'smile',
    body: '#C4B5FD',
    secondary: '#5EEAD4',
    accent: '#7C3AED',
    cheek: '#F9A8D4',
  },
  'starunicorn-solar-pegasus': {
    shape: 'pony',
    back: 'pegasus-wings',
    front: 'star-crown',
    detail: 'meteor-trail',
    eyes: 'starry',
    mouth: 'happy',
    body: '#FCD34D',
    secondary: '#FEF9C3',
    accent: '#EA580C',
    cheek: '#FB7185',
  },
  'starunicorn-nebula-pegasus': {
    shape: 'pony',
    back: 'pegasus-wings',
    front: 'unicorn-horn',
    detail: 'galaxy-stars',
    eyes: 'starry',
    mouth: 'happy',
    body: '#3B0764',
    secondary: '#C084FC',
    accent: '#F472B6',
    cheek: '#F472B6',
  },
  'starunicorn-diamond-unicorn': {
    shape: 'pony',
    back: 'pony-ears',
    front: 'diamond-crown',
    detail: 'diamond-facets',
    eyes: 'starry',
    mouth: 'happy',
    body: '#DBEAFE',
    secondary: '#FFFFFF',
    accent: '#2563EB',
    cheek: '#F9A8D4',
  },
  'starunicorn-eclipse-pegasus': {
    shape: 'pony',
    back: 'pegasus-wings',
    front: 'eclipse-crown',
    detail: 'galaxy-stars',
    eyes: 'starry',
    mouth: 'happy',
    body: '#1E1B4B',
    secondary: '#FDE047',
    accent: '#818CF8',
    cheek: '#F472B6',
  },
  'starunicorn-chroma-galaxy': {
    shape: 'pony',
    back: 'pegasus-wings',
    front: 'rainbow-mane',
    detail: 'galaxy-stars',
    eyes: 'starry',
    mouth: 'happy',
    body: '#A855F7',
    secondary: '#FFFFFF',
    accent: '#DB2777',
    cheek: '#FDE047',
    chroma: ['#EC4899', '#8B5CF6', '#22D3EE'],
  },
};

function hexLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0.5;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const r = toLinear(parseInt(clean.slice(0, 2), 16) / 255);
  const g = toLinear(parseInt(clean.slice(2, 4), 16) / 255);
  const b = toLinear(parseInt(clean.slice(4, 6), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function renderP2DBackTopper(
  back: P2DBack,
  body: string,
  secondary: string,
  accent: string,
): React.ReactNode {
  switch (back) {
    case 'cupid-wings':
      return (
        <g fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round">
          <path d="M 22 48 Q 4 32 8 52 Q 4 64 20 62 Z" />
          <path d="M 78 48 Q 96 32 92 52 Q 96 64 80 62 Z" />
        </g>
      );
    case 'swan-wings':
      return (
        <g fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round">
          <path d="M 22 44 Q 4 24 8 56 Q 12 72 24 68 Z" />
          <path d="M 78 44 Q 96 24 92 56 Q 88 72 76 68 Z" />
        </g>
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
    case 'bear-ears':
      return (
        <g>
          <circle cx="27" cy="30" r="10" fill={body} stroke="#1C1917" strokeWidth="3" />
          <circle cx="27" cy="30" r="5" fill={secondary} />
          <circle cx="73" cy="30" r="10" fill={body} stroke="#1C1917" strokeWidth="3" />
          <circle cx="73" cy="30" r="5" fill={secondary} />
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
    case 'tiger-ears':
      return (
        <g>
          <circle cx="26" cy="30" r="9.5" fill={body} stroke="#1C1917" strokeWidth="3" />
          <circle cx="26" cy="30" r="4.5" fill={secondary} />
          <circle cx="74" cy="30" r="9.5" fill={body} stroke="#1C1917" strokeWidth="3" />
          <circle cx="74" cy="30" r="4.5" fill={secondary} />
          {/* Sachet hanging tassel at bottom */}
          <line x1="50" y1="84" x2="50" y2="94" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="88" r="3" fill="#FACC15" stroke="#1C1917" strokeWidth="1.5" />
        </g>
      );
    case 'dragon-crest':
      return (
        <g>
          {/* Golden dragon horns */}
          <path d="M 30 34 Q 18 14 32 10 Q 35 20 40 32" fill="#FACC15" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M 70 34 Q 82 14 68 10 Q 65 20 60 32" fill="#FACC15" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          {/* Festive side fins / whiskers */}
          <path d="M 20 50 Q 6 44 10 62 Q 16 64 22 60" fill={accent} stroke="#1C1917" strokeWidth="2.4" />
          <path d="M 80 50 Q 94 44 90 62 Q 84 64 78 60" fill={accent} stroke="#1C1917" strokeWidth="2.4" />
        </g>
      );
    case 'boat-oars':
      return (
        <g>
          <circle cx="28" cy="32" r="8.5" fill={body} stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="72" cy="32" r="8.5" fill={body} stroke="#1C1917" strokeWidth="2.8" />
          {/* Crossed wooden dragon-boat paddles */}
          <line x1="22" y1="64" x2="8" y2="84" stroke="#78350F" strokeWidth="3.8" strokeLinecap="round" />
          <ellipse cx="7" cy="85" rx="4.5" ry="7" transform="rotate(32 7 85)" fill="#F59E0B" stroke="#1C1917" strokeWidth="2" />
          <line x1="78" y1="64" x2="92" y2="84" stroke="#78350F" strokeWidth="3.8" strokeLinecap="round" />
          <ellipse cx="93" cy="85" rx="4.5" ry="7" transform="rotate(-32 93 85)" fill="#F59E0B" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'turkey-feathers':
      return (
        <g stroke="#1C1917" strokeWidth="2.4">
          <ellipse cx="20" cy="48" rx="10" ry="20" transform="rotate(-48 20 48)" fill="#DC2626" />
          <ellipse cx="32" cy="32" rx="10" ry="22" transform="rotate(-24 32 32)" fill="#F97316" />
          <ellipse cx="50" cy="26" rx="10" ry="23" fill="#FACC15" />
          <ellipse cx="68" cy="32" rx="10" ry="22" transform="rotate(24 68 32)" fill="#16A34A" />
          <ellipse cx="80" cy="48" rx="10" ry="20" transform="rotate(48 80 48)" fill="#EA580C" />
        </g>
      );
    case 'flap-fins':
      return (
        <g>
          {/* Iconic oversized round ear-fins */}
          <ellipse cx="16" cy="46" rx="13" ry="10" transform="rotate(-18 16 46)" fill={body} stroke="#1C1917" strokeWidth="3" />
          <ellipse cx="16" cy="46" rx="7" ry="5" transform="rotate(-18 16 46)" fill={secondary} />
          <ellipse cx="84" cy="46" rx="13" ry="10" transform="rotate(18 84 46)" fill={body} stroke="#1C1917" strokeWidth="3" />
          <ellipse cx="84" cy="46" rx="7" ry="5" transform="rotate(18 84 46)" fill={secondary} />
        </g>
      );
    case 'sea-bunny-ears':
      return (
        <g>
          {/* Rhinophores (cute dark bunny-like sea slug ears) */}
          <rect x="30" y="13" width="9" height="22" rx="4.5" transform="rotate(-12 34 24)" fill="#1E293B" stroke="#1C1917" strokeWidth="2.4" />
          <rect x="61" y="13" width="9" height="22" rx="4.5" transform="rotate(12 65 24)" fill="#1E293B" stroke="#1C1917" strokeWidth="2.4" />
        </g>
      );
    case 'angler-lure':
      return (
        <g>
          {/* Side fins */}
          <ellipse cx="14" cy="58" rx="8" ry="11" transform="rotate(-20 14 58)" fill={secondary} stroke="#1C1917" strokeWidth="2.6" />
          <ellipse cx="86" cy="58" rx="8" ry="11" transform="rotate(20 86 58)" fill={secondary} stroke="#1C1917" strokeWidth="2.6" />
          {/* Curved glowing head-lamp esca */}
          <path d="M 50 32 Q 52 10 68 14" fill="none" stroke="#93C5FD" strokeWidth="3.4" strokeLinecap="round" />
          <circle cx="71" cy="18" r="8.5" fill="#FEF08A" opacity="0.45" />
          <circle cx="71" cy="18" r="5.2" fill={accent} stroke="#1C1917" strokeWidth="2.2" />
        </g>
      );
    case 'squid-cape':
      return (
        <g>
          {/* Midnight violet cape & ear fins */}
          <path d="M 22 40 L 6 58 L 16 74 L 24 68 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M 78 40 L 94 58 L 84 74 L 76 68 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <ellipse cx="24" cy="34" rx="10" ry="6" transform="rotate(-30 24 34)" fill={body} stroke="#1C1917" strokeWidth="2.6" />
          <ellipse cx="76" cy="34" rx="10" ry="6" transform="rotate(30 76 34)" fill={body} stroke="#1C1917" strokeWidth="2.6" />
        </g>
      );
    case 'corgi-ears':
      return (
        <g>
          {/* Giant perky corgi triangle ears */}
          <polygon points="18,42 15,10 43,31" fill={body} stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="22,35 21,18 36,30" fill="#FBCFE8" />
          <polygon points="82,42 85,10 57,31" fill={body} stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="78,35 79,18 64,30" fill="#FBCFE8" />
        </g>
      );
    case 'shiba-ears':
      return (
        <g>
          <polygon points="21,39 24,14 42,31" fill={body} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="25,34 27,21 36,30" fill={secondary} />
          <polygon points="79,39 76,14 58,31" fill={body} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="75,34 73,21 64,30" fill={secondary} />
        </g>
      );
    case 'poodle-ears':
      return (
        <g fill={body} stroke="#1C1917" strokeWidth="3">
          {/* Curly pom-pom ears on both sides */}
          <circle cx="15" cy="46" r="10" />
          <circle cx="13" cy="60" r="9" />
          <circle cx="85" cy="46" r="10" />
          <circle cx="87" cy="60" r="9" />
        </g>
      );
    case 'samoyed-ears':
      return (
        <g>
          <polygon points="22,39 25,14 43,31" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="27,34 28,21 38,31" fill="#FECDD3" />
          <polygon points="78,39 75,14 57,31" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="73,34 72,21 62,31" fill="#FECDD3" />
        </g>
      );
    case 'floppy-ears':
      return (
        <g>
          {/* Adorable drooping dog ears */}
          <ellipse cx="16" cy="54" rx="9" ry="18" transform="rotate(14 16 54)" fill={secondary === '#1E293B' ? '#1E293B' : body} stroke="#1C1917" strokeWidth="3" />
          <ellipse cx="84" cy="54" rx="9" ry="18" transform="rotate(-14 84 54)" fill={secondary === '#1E293B' ? '#1E293B' : body} stroke="#1C1917" strokeWidth="3" />
        </g>
      );
    case 'husky-ears':
      return (
        <g>
          <polygon points="20,40 22,12 43,31" fill="#475569" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="25,34 26,20 37,30" fill="#F8FAFC" />
          <polygon points="80,40 78,12 57,31" fill="#475569" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="75,34 74,20 63,30" fill="#F8FAFC" />
        </g>
      );
    case 'bichon-puff':
      return (
        <g fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.8">
          <circle cx="22" cy="38" r="12" />
          <circle cx="78" cy="38" r="12" />
        </g>
      );
    case 'fern-wings':
      return (
        <g fill="#10B981" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M 22 48 Q 4 28 7 54 Q 10 68 22 64 Z" />
          <path d="M 78 48 Q 96 28 93 54 Q 90 68 78 64 Z" />
          <path d="M 21 54 L 10 46 M 79 54 L 90 46" stroke="#DCFCE7" strokeWidth="2" />
        </g>
      );
    case 'bird-wings':
      return (
        <g fill={secondary} stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round">
          <path d="M 24 54 Q 5 38 9 62 Q 16 70 25 66 Z" />
          <path d="M 76 54 Q 95 38 91 62 Q 84 70 75 66 Z" />
        </g>
      );
    case 'gold-antlers':
      return (
        <g stroke="#CA8A04" strokeWidth="4.2" strokeLinecap="round" fill="none">
          <path d="M 33 34 L 22 12 M 28 24 L 16 21 M 26 17 L 34 11" />
          <path d="M 67 34 L 78 12 M 72 24 L 84 21 M 74 17 L 66 11" />
          <circle cx="22" cy="12" r="3" fill="#FDE047" stroke="#1C1917" strokeWidth="1.4" />
          <circle cx="78" cy="12" r="3" fill="#FDE047" stroke="#1C1917" strokeWidth="1.4" />
        </g>
      );
    case 'pony-ears':
      return (
        <g>
          <polygon points="22,38 25,15 41,30" fill={body} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <polygon points="27,33 28,22 36,30" fill="#FBCFE8" />
          <polygon points="78,38 75,15 59,30" fill={body} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <polygon points="73,33 72,22 64,30" fill="#FBCFE8" />
        </g>
      );
    case 'pegasus-wings':
      return (
        <g>
          {/* Feathered pegasus wings */}
          <path d="M 22 46 Q 3 22 7 50 Q 4 64 16 68 L 24 62 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M 78 46 Q 97 22 93 50 Q 96 64 84 68 L 76 62 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          {/* Pony ears */}
          <polygon points="24,36 27,16 40,30" fill={body} stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points="76,36 73,16 60,30" fill={body} stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
        </g>
      );
    case 'sea-fins':
      return (
        <g>
          {/* Pearlescent hippocampus fins */}
          <path d="M 22 46 Q 6 36 10 58 Q 14 70 24 64 Z" fill="#67E8F9" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M 78 46 Q 94 36 90 58 Q 86 70 76 64 Z" fill="#67E8F9" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points="25,36 28,17 40,30" fill={body} stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points="75,36 72,17 60,30" fill={body} stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
        </g>
      );
    case 'none':
    default:
      return null;
  }
}

function renderP2DFrontTopper(
  front: P2DFront,
  secondary: string,
  accent: string,
): React.ReactNode {
  switch (front) {
    case 'ribbon-bow-top':
      return (
        <g>
          <polygon points="50,31 32,20 34,36" fill={accent} stroke="#1C1917" strokeWidth="2.4" strokeLinejoin="round" />
          <polygon points="50,31 68,20 66,36" fill={accent} stroke="#1C1917" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="50" cy="30" r="5" fill="#FDE047" stroke="#1C1917" strokeWidth="2.2" />
        </g>
      );
    case 'love-seal':
      return (
        <g>
          <path d="M 22 36 L 50 47 L 78 36" fill="none" stroke={accent} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 50 41 C 46 36 40 40 44 45 L 50 50 L 56 45 C 60 40 54 36 50 41 Z" fill={accent} stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'rose-crown':
      return (
        <g>
          <path d="M 32 32 L 38 19 L 50 25 L 62 19 L 68 32 Z" fill="#FDE047" stroke="#1C1917" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="50" cy="24" r="7" fill={accent} stroke="#1C1917" strokeWidth="2.2" />
          <path d="M 47 24 Q 50 20 53 24 Q 50 27 48 25" fill="none" stroke="#FFE4E6" strokeWidth="1.6" />
        </g>
      );
    case 'heart-crown':
      return (
        <path
          d="M 50 22 C 45 13 33 17 38 27 L 50 37 L 62 27 C 67 17 55 13 50 22 Z"
          fill={accent}
          stroke="#1C1917"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      );
    case 'zongzi-knot':
      return (
        <g>
          <path d="M 43 24 Q 50 13 57 24" fill="none" stroke="#15803D" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="50" cy="24" r="4.2" fill={accent} stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'sachet-knot':
      return (
        <g>
          <circle cx="50" cy="20" r="6" fill="none" stroke={accent} strokeWidth="3" />
          <rect x="44" y="26" width="12" height="6" rx="3" fill="#FACC15" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'straw-hat':
      return (
        <g>
          <path d="M 30 33 Q 50 12 70 33 Z" fill="#FDE047" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <ellipse cx="50" cy="33" rx="30" ry="6" fill="#FACC15" stroke="#1C1917" strokeWidth="2.6" />
          <path d="M 32 30 Q 50 33 68 30" fill="none" stroke="#DC2626" strokeWidth="3.5" />
        </g>
      );
    case 'drum-band':
      return (
        <g>
          <rect x="20" y="34" width="60" height="8" rx="4" fill={accent} stroke="#1C1917" strokeWidth="2.4" />
          <circle cx="50" cy="38" r="4.5" fill="#FDE047" stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'pilgrim-hat':
      return (
        <g>
          <path d="M 31 32 L 35 12 L 65 12 L 69 32 Z" fill="#1E293B" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="50" cy="33" rx="32" ry="6" fill="#1E293B" stroke="#1C1917" strokeWidth="2.8" />
          <rect x="33" y="24" width="34" height="6" fill="#D97706" />
          <rect x="44" y="22" width="12" height="10" rx="2" fill="#FACC15" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'whip-swirl':
      return (
        <g>
          <path d="M 34 36 Q 50 14 66 36 Q 58 41 50 38 Q 42 41 34 36 Z" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <circle cx="50" cy="18" r="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.2" />
        </g>
      );
    case 'maple-crown':
      return (
        <g>
          <polygon
            points="50,11 54,21 65,18 59,27 66,33 54,32 50,37 46,32 34,33 41,27 35,18 46,21"
            fill={accent}
            stroke="#1C1917"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
        </g>
      );
    case 'berry-top':
      return (
        <g>
          <path d="M 39 30 Q 50 12 61 30 Q 50 36 39 30 Z" fill="#E11D48" stroke="#1C1917" strokeWidth="2.5" />
          <path d="M 42 29 L 50 33 L 58 29" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <circle cx="47" cy="23" r="1.2" fill="#FEF08A" />
          <circle cx="53" cy="24" r="1.2" fill="#FEF08A" />
        </g>
      );
    case 'star-crown':
      return (
        <polygon
          points="30,33 34,15 43,24 50,11 57,24 66,15 70,33"
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
    case 'fire-hat':
      return (
        <g>
          <path d="M 24 34 Q 50 10 76 34 Z" fill="#DC2626" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="50" cy="34" rx="33" ry="6" fill="#B91C1C" stroke="#1C1917" strokeWidth="2.6" />
          <polygon points="50,16 56,28 44,28" fill="#FACC15" stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'caramel-drip':
      return (
        <g>
          <path
            d="M 25 41 Q 33 27 50 27 Q 67 27 75 41 Q 68 47 60 41 Q 50 48 40 41 Q 32 47 25 41 Z"
            fill={secondary}
            stroke="#1C1917"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="21" r="6" fill={accent} stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="48" cy="19" r="1.8" fill="#FFFFFF" />
        </g>
      );
    case 'butter-pat':
      return (
        <g>
          <rect x="38" y="21" width="24" height="14" rx="4" transform="rotate(-5 50 28)" fill="#FACC15" stroke="#1C1917" strokeWidth="2.6" />
          <path d="M 32 34 Q 50 42 68 34" fill="none" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case 'cocoa-dust':
      return (
        <g>
          <rect x="22" y="29" width="56" height="8" rx="4" fill="#78350F" stroke="#1C1917" strokeWidth="2.4" />
          <circle cx="36" cy="26" r="2.2" fill="#92400E" />
          <circle cx="50" cy="24" r="2.5" fill="#92400E" />
          <circle cx="64" cy="26" r="2.2" fill="#92400E" />
        </g>
      );
    case 'boba-straw':
      return (
        <g>
          <rect x="44" y="8" width="12" height="24" rx="3" fill={accent} stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="38" cy="32" r="10" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="62" cy="32" r="10" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="50" cy="27" r="11" fill="#FFFBEB" stroke="#1C1917" strokeWidth="2.6" />
        </g>
      );
    case 'icecream-scoop':
      return (
        <g>
          <circle cx="41" cy="25" r="10" fill="#FBCFE8" stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="59" cy="25" r="10" fill="#FEF9C3" stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="50" cy="17" r="5" fill="#E11D48" stroke="#1C1917" strokeWidth="2.2" />
        </g>
      );
    case 'mushroom-lid':
      return (
        <g>
          <path d="M 18 39 Q 50 7 82 39 Z" fill={secondary} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="37" cy="26" r="4.2" fill="#FFFFFF" />
          <circle cx="57" cy="22" r="4.8" fill="#FFFFFF" />
          <circle cx="67" cy="33" r="3.4" fill="#FFFFFF" />
        </g>
      );
    case 'moss-cap':
      return (
        <g>
          <path d="M 20 37 Q 50 13 80 37 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <circle cx="50" cy="18" r="4.5" fill="#4ADE80" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'acorn-chef':
      return (
        <g>
          {/* Puffy white chef toque tucked over acorn cap rim */}
          <circle cx="38" cy="22" r="9" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
          <circle cx="50" cy="18" r="10" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
          <circle cx="62" cy="22" r="9" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
          <rect x="28" y="28" width="44" height="9" rx="4" fill="#92400E" stroke="#1C1917" strokeWidth="2.6" />
        </g>
      );
    case 'leaf-roof':
      return (
        <g>
          <rect x="64" y="14" width="9" height="16" rx="2" fill="#92400E" stroke="#1C1917" strokeWidth="2.4" />
          <polygon points="15,40 50,12 85,40" fill={accent} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="28" r="5" fill="#FEF08A" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'flower-crown':
      return (
        <g>
          <circle cx="32" cy="31" r="7" fill={accent} stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="32" cy="31" r="2.6" fill="#FEF08A" />
          <circle cx="50" cy="27" r="8" fill="#F472B6" stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="50" cy="27" r="3" fill="#FEF08A" />
          <circle cx="68" cy="31" r="7" fill="#A855F7" stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="68" cy="31" r="2.6" fill="#FEF08A" />
        </g>
      );
    case 'unicorn-horn':
      return (
        <g>
          {/* Spiral golden unicorn horn + soft pastel forelock */}
          <polygon points="44,33 50,7 56,33" fill="#FDE047" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <line x1="46" y1="25" x2="54" y2="21" stroke="#D97706" strokeWidth="2.2" />
          <line x1="47" y1="17" x2="53" y2="14" stroke="#D97706" strokeWidth="2.2" />
          <path d="M 33 34 Q 42 26 50 35 Q 58 26 67 34" fill={secondary} stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
        </g>
      );
    case 'rainbow-mane':
      return (
        <g>
          {/* Spiral rainbow horn */}
          <polygon points="44,33 50,6 56,33" fill="#FDE047" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <line x1="46" y1="25" x2="54" y2="21" stroke="#EC4899" strokeWidth="2.4" />
          <line x1="47" y1="17" x2="53" y2="14" stroke="#06B6D4" strokeWidth="2.4" />
          {/* Three colorful rainbow bangs */}
          <ellipse cx="36" cy="33" rx="8" ry="5" fill="#F472B6" stroke="#1C1917" strokeWidth="2" />
          <ellipse cx="50" cy="34" rx="8" ry="5" fill="#FDE047" stroke="#1C1917" strokeWidth="2" />
          <ellipse cx="64" cy="33" rx="8" ry="5" fill="#38BDF8" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'pearl-horn':
      return (
        <g>
          <polygon points="45,33 50,8 55,33" fill="#F8FAFC" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="38" cy="33" r="4.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <circle cx="50" cy="34" r="5.2" fill="#E0F2FE" stroke="#1C1917" strokeWidth="2" />
          <circle cx="62" cy="33" r="4.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'eclipse-crown':
      return (
        <g>
          <polygon points="45,33 50,11 55,33" fill="#FDE047" stroke="#1C1917" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M 55 12 A 9 9 0 1 0 55 29 A 6.6 6.6 0 1 1 55 12 Z" fill="#FACC15" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'diamond-crown':
      return (
        <g>
          <polygon points="50,8 58,21 50,33 42,21" fill="#BAE6FD" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="34,33 38,19 46,28" fill="#E0F2FE" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="66,33 62,19 54,28" fill="#E0F2FE" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
        </g>
      );
    case 'none':
    default:
      return null;
  }
}

function renderP2DShape(shape: P2DShape, fillRef: string, secondary: string): React.ReactNode {
  switch (shape) {
    case 'heart':
      return (
        <path
          d="M 50 86 C 24 72 14 54 18 39 C 22 25 39 24 50 36 C 61 24 78 25 82 39 C 86 54 76 72 50 86 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      );
    case 'zongzi':
      return (
        <path
          d="M 50 22 Q 56 22 60 30 L 82 72 Q 86 84 74 86 L 26 86 Q 14 84 18 72 L 40 30 Q 44 22 50 22 Z"
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
    case 'boat':
      return (
        <g>
          {/* Main character head/body inside a festive dragon boat hull */}
          <rect x="20" y="32" width="60" height="44" rx="18" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
          <path
            d="M 10 68 Q 50 74 90 68 L 80 86 Q 50 90 20 86 Z"
            fill="#DC2626"
            stroke="#1C1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M 18 76 Q 50 81 82 76" fill="none" stroke="#FACC15" strokeWidth="2.8" />
        </g>
      );
    case 'pie':
      return (
        <g>
          {/* Scalloped pie crust rim */}
          <circle cx="50" cy="58" r="34" fill={secondary} stroke="#1C1917" strokeWidth="3.2" />
          <circle cx="50" cy="58" r="27" fill={fillRef} stroke="#1C1917" strokeWidth="2.6" />
        </g>
      );
    case 'jelly':
      return (
        <g>
          {/* Flowing glowing tentacles */}
          <g stroke={secondary} strokeWidth="5.5" strokeLinecap="round" fill="none">
            <path d="M 30 62 Q 26 76 32 88" />
            <path d="M 43 64 Q 40 78 46 90" />
            <path d="M 57 64 Q 60 78 54 90" />
            <path d="M 70 62 Q 74 76 68 88" />
          </g>
          <g stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M 30 62 Q 26 76 32 88" />
            <path d="M 43 64 Q 40 78 46 90" />
            <path d="M 57 64 Q 60 78 54 90" />
            <path d="M 70 62 Q 74 76 68 88" />
          </g>
          {/* Translucent bell dome */}
          <path
            d="M 18 58 Q 18 24 50 24 Q 82 24 82 58 Q 74 66 64 60 Q 50 67 36 60 Q 26 66 18 58 Z"
            fill={fillRef}
            stroke="#1C1917"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </g>
      );
    case 'octo':
      return (
        <g>
          {/* Cute little curved octopus tentacles at bottom */}
          <circle cx="24" cy="80" r="8" fill={fillRef} stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="41" cy="83" r="8" fill={fillRef} stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="59" cy="83" r="8" fill={fillRef} stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="76" cy="80" r="8" fill={fillRef} stroke="#1C1917" strokeWidth="2.8" />
          <path
            d="M 20 62 Q 20 26 50 26 Q 80 26 80 62 Q 80 80 50 80 Q 20 80 20 62 Z"
            fill={fillRef}
            stroke="#1C1917"
            strokeWidth="3.2"
          />
        </g>
      );
    case 'blob':
      return (
        <path
          d="M 14 68 C 14 40 28 28 50 28 C 72 28 86 40 86 68 C 86 84 70 86 50 86 C 30 86 14 84 14 68 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
        />
      );
    case 'nautilus':
      return (
        <g>
          <path
            d="M 20 60 C 18 34 34 22 56 24 C 76 26 86 42 84 62 C 82 78 68 86 50 86 C 30 86 21 76 20 60 Z"
            fill={fillRef}
            stroke="#1C1917"
            strokeWidth="3.2"
          />
        </g>
      );
    case 'whale':
      return (
        <g>
          {/* Tail fluke */}
          <path d="M 78 62 L 95 46 L 89 64 L 94 76 L 74 74 Z" fill={secondary} stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <rect x="14" y="32" width="68" height="52" rx="24" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
          <path d="M 16 70 Q 48 61 80 70 L 78 78 Q 72 84 48 84 Q 24 84 18 78 Z" fill="#E0F2FE" opacity="0.9" />
        </g>
      );
    case 'fluffy':
      return (
        <path
          d="M 20 66 Q 18 32 50 32 Q 82 32 80 66 Q 82 86 50 86 Q 18 86 20 66 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
        />
      );
    case 'pudding':
      return (
        <path
          d="M 27 36 Q 50 28 73 36 L 82 78 Q 82 87 50 87 Q 18 87 18 78 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      );
    case 'canele':
      return (
        <path
          d="M 28 32 Q 50 24 72 32 L 77 78 Q 77 87 50 87 Q 23 87 23 78 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      );
    case 'layered':
      return (
        <rect x="19" y="31" width="62" height="55" rx="14" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
      );
    case 'roll-cake':
      return (
        <circle cx="50" cy="58" r="32" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
      );
    case 'toast-brick':
      return (
        <g>
          <rect x="18" y="32" width="64" height="54" rx="12" fill="#B45309" stroke="#1C1917" strokeWidth="3.2" />
          <rect x="24" y="37" width="52" height="44" rx="9" fill={fillRef} />
        </g>
      );
    case 'sundae-cup':
      return (
        <g>
          <path d="M 22 36 L 78 36 L 71 84 Q 50 90 29 84 Z" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <rect x="19" y="33" width="62" height="8" rx="4" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.6" />
        </g>
      );
    case 'teapot':
      return (
        <g>
          {/* Spout on left, handle on right */}
          <path d="M 22 54 Q 8 48 11 40 Q 17 44 25 46" fill={fillRef} stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 76 46 Q 92 46 90 61 Q 88 73 74 71" fill="none" stroke="#1C1917" strokeWidth="4.2" strokeLinecap="round" />
          <ellipse cx="50" cy="60" rx="30" ry="26" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
        </g>
      );
    case 'pinecone':
      return (
        <path
          d="M 50 26 C 72 26 82 48 78 68 C 74 84 62 88 50 88 C 38 88 26 84 22 68 C 18 48 28 26 50 26 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
        />
      );
    case 'cottage':
      return (
        <path
          d="M 22 38 L 78 38 L 76 82 Q 76 87 50 87 Q 24 87 24 82 Z"
          fill={fillRef}
          stroke="#1C1917"
          strokeWidth="3.2"
          strokeLinejoin="round"
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
    case 'pony':
      return (
        <rect x="20" y="32" width="60" height="54" rx="22" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
      );
    case 'square':
    default:
      return (
        <rect x="19" y="32" width="62" height="54" rx="19" fill={fillRef} stroke="#1C1917" strokeWidth="3.2" />
      );
  }
}

function renderP2DDetail(
  detail: P2DDetail,
  secondary: string,
  accent: string,
  isDarkBody: boolean,
): React.ReactNode {
  switch (detail) {
    case 'macaron-seam':
      return (
        <rect x="24" y="68" width="52" height="8" rx="4" fill={secondary} stroke="#1C1917" strokeWidth="2" />
      );
    case 'choco-ruffle':
      return (
        <path
          d="M 20 74 Q 28 84 36 74 Q 44 84 50 74 Q 56 84 64 74 Q 72 84 80 74 L 78 86 L 22 86 Z"
          fill={accent}
          stroke="#1C1917"
          strokeWidth="2.2"
        />
      );
    case 'heart-gem':
      return (
        <path
          d="M 50 73 C 47 68 41 71 44 76 L 50 82 L 56 76 C 59 71 53 68 50 73 Z"
          fill={accent}
          stroke="#1C1917"
          strokeWidth="1.8"
        />
      );
    case 'envelope-fold':
      return (
        <g stroke={secondary} strokeWidth="2.4" fill="none">
          <path d="M 22 82 L 42 68" />
          <path d="M 78 82 L 58 68" />
        </g>
      );
    case 'zongzi-twine':
      return (
        <g>
          {/* Bamboo leaf cross-twine wrap */}
          <path d="M 29 52 L 71 52" stroke="#FEF08A" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M 50 26 L 50 48" stroke="#15803D" strokeWidth="2.4" opacity="0.65" />
          <path d="M 25 76 L 75 76" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'tiger-stripes':
      return (
        <g stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round">
          {/* Traditional "王" tiger forehead mark */}
          <line x1="42" y1="36" x2="58" y2="36" />
          <line x1="44" y1="41" x2="56" y2="41" />
          <line x1="50" y1="35" x2="50" y2="44" />
        </g>
      );
    case 'wave-trim':
      return (
        <path d="M 24 76 Q 32 70 40 76 Q 50 70 60 76 Q 68 70 76 76" fill="none" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
      );
    case 'dragon-scales':
      return (
        <g stroke={secondary} strokeWidth="2.2" fill="none" opacity="0.85">
          <path d="M 32 69 Q 38 74 44 69" />
          <path d="M 44 69 Q 50 74 56 69" />
          <path d="M 56 69 Q 62 74 68 69" />
        </g>
      );
    case 'pie-crust':
      return (
        <g fill="#FEF08A" opacity="0.75">
          <circle cx="31" cy="75" r="2.2" />
          <circle cx="50" cy="79" r="2.2" />
          <circle cx="69" cy="75" r="2.2" />
        </g>
      );
    case 'maple-scarf':
      return (
        <g>
          <rect x="20" y="73" width="60" height="10" rx="5" fill={accent} stroke="#1C1917" strokeWidth="2.4" />
          <rect x="38" y="73" width="8" height="10" fill="#FEF3C7" />
          <rect x="54" y="73" width="8" height="10" fill="#FEF3C7" />
        </g>
      );
    case 'cider-steam':
      return (
        <g stroke="#FDE68A" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M 34 75 Q 50 82 66 75" />
        </g>
      );
    case 'blob-nose':
      return (
        <ellipse cx="50" cy="64" rx="10" ry="7.5" fill={secondary} stroke="#1C1917" strokeWidth="2.4" />
      );
    case 'sea-bunny-spots':
      return (
        <g fill="#1E293B">
          <circle cx="28" cy="44" r="2.6" />
          <circle cx="72" cy="43" r="2.8" />
          <circle cx="29" cy="74" r="2.5" />
          <circle cx="71" cy="74" r="2.5" />
          <circle cx="50" cy="79" r="2.4" />
        </g>
      );
    case 'angler-teeth':
      return (
        <g fill="#FDE047" opacity="0.85">
          <circle cx="27" cy="44" r="2" />
          <circle cx="73" cy="44" r="2" />
          <circle cx="30" cy="76" r="2.2" />
          <circle cx="70" cy="76" r="2.2" />
        </g>
      );
    case 'nautilus-spiral':
      return (
        <path
          d="M 50 72 A 14 14 0 1 1 64 58 A 9 9 0 1 1 55 67"
          fill="none"
          stroke={secondary}
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.55"
        />
      );
    case 'whale-stars':
      return (
        <g fill="#FEF08A">
          <circle cx="26" cy="43" r="2.2" />
          <circle cx="48" cy="39" r="1.8" />
          <circle cx="70" cy="44" r="2.4" />
          <polygon points="50,72 51.8,76 56,77 51.8,78 50,82 48.2,78 44,77 48.2,76" fill="#FDE047" />
        </g>
      );
    case 'corgi-chest':
      return (
        <path d="M 32 74 Q 50 66 68 74 Q 60 86 50 86 Q 40 86 32 74 Z" fill={secondary} />
      );
    case 'shiba-kerchief':
      return (
        <g>
          {/* Classic Shiba cream eyebrow dots + red park bandana */}
          <ellipse cx="36" cy="44" rx="4.2" ry="2.6" fill={secondary} />
          <ellipse cx="64" cy="44" rx="4.2" ry="2.6" fill={secondary} />
          <polygon points="24,74 76,74 50,88" fill={accent} stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
        </g>
      );
    case 'dalmatian-spots':
      return (
        <g fill="#1E293B">
          <circle cx="28" cy="44" r="4.5" />
          <circle cx="72" cy="45" r="3.8" />
          <circle cx="31" cy="76" r="4.8" />
          <circle cx="69" cy="75" r="4" />
        </g>
      );
    case 'sweater-stripe':
      return (
        <g>
          <rect x="20" y="72" width="60" height="13" rx="6" fill={accent} stroke="#1C1917" strokeWidth="2.4" />
          <line x1="23" y1="78" x2="77" y2="78" stroke="#FACC15" strokeWidth="3.5" />
        </g>
      );
    case 'tennis-ball':
      return (
        <g>
          <circle cx="50" cy="77" r="7.5" fill="#A3E635" stroke="#1C1917" strokeWidth="2.2" />
          <path d="M 44 74 Q 50 77 44 80 M 56 74 Q 50 77 56 80" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        </g>
      );
    case 'husky-mask':
      return (
        <path
          d="M 22 60 Q 24 44 37 44 Q 47 44 50 52 Q 53 44 63 44 Q 76 44 78 60 L 78 76 Q 76 85 50 85 Q 24 85 22 76 Z"
          fill={secondary}
        />
      );
    case 'souffle-seam':
      return (
        <path d="M 22 72 Q 50 76 78 72" fill="none" stroke="#D97706" strokeWidth="2.4" opacity="0.6" strokeLinecap="round" />
      );
    case 'canele-flutes':
      return (
        <g stroke={secondary} strokeWidth="2.2" opacity="0.7" strokeLinecap="round">
          <line x1="33" y1="36" x2="31" y2="82" />
          <line x1="67" y1="36" x2="69" y2="82" />
        </g>
      );
    case 'tiramisu-layers':
      return (
        <g>
          <rect x="21" y="71" width="58" height="6" fill={secondary} opacity="0.85" />
          <rect x="21" y="78" width="58" height="5" fill={accent} opacity="0.7" />
        </g>
      );
    case 'crepe-layers':
      return (
        <g stroke={secondary} strokeWidth="2.2">
          <line x1="21" y1="42" x2="79" y2="42" />
          <line x1="21" y1="71" x2="79" y2="71" />
          <line x1="21" y1="77" x2="79" y2="77" />
          <line x1="21" y1="82" x2="79" y2="82" />
        </g>
      );
    case 'boba-pearls':
      return (
        <g fill="#292524">
          <circle cx="35" cy="78" r="4" />
          <circle cx="45" cy="80" r="4" />
          <circle cx="56" cy="80" r="4" />
          <circle cx="65" cy="78" r="4" />
        </g>
      );
    case 'swiss-swirl':
      return (
        <circle cx="50" cy="58" r="24" fill={secondary} stroke={accent} strokeWidth="2.4" />
      );
    case 'honey-grid':
      return (
        <g stroke={accent} strokeWidth="2" opacity="0.55">
          <line x1="38" y1="39" x2="38" y2="79" />
          <line x1="62" y1="39" x2="62" y2="79" />
          <line x1="26" y1="72" x2="74" y2="72" />
        </g>
      );
    case 'pine-scales':
      return (
        <g stroke={secondary} strokeWidth="2.2" fill="none" opacity="0.8">
          <path d="M 32 72 Q 41 78 50 72 Q 59 78 68 72" />
          <path d="M 36 80 Q 50 86 64 80" />
        </g>
      );
    case 'post-bag':
      return (
        <g>
          <line x1="25" y1="70" x2="75" y2="82" stroke="#92400E" strokeWidth="3.2" />
          <rect x="41" y="72" width="18" height="12" rx="2.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <path d="M 41 72 L 50 79 L 59 72" fill="none" stroke="#DC2626" strokeWidth="1.8" />
        </g>
      );
    case 'cottage-door':
      return (
        <path
          d="M 41 86 L 41 74 A 9 9 0 0 1 59 74 L 59 86 Z"
          fill={secondary}
          stroke="#1C1917"
          strokeWidth="2.4"
        />
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
    case 'spots':
      return (
        <g fill={secondary} opacity="0.78">
          <circle cx="29" cy="44" r="3.8" />
          <circle cx="71" cy="44" r="4.2" />
          <circle cx="68" cy="75" r="3.5" />
        </g>
      );
    case 'glossy-squish':
      return (
        <ellipse cx="33" cy="43" rx="7" ry="3.5" transform="rotate(-24 33 43)" fill="#FFFFFF" opacity="0.72" />
      );
    case 'meteor-trail':
      return (
        <g>
          <path d="M 24 76 Q 42 70 54 78" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <polygon points="62,72 64.2,76 68.5,76.6 65.2,79.4 66,83.5 62,81.4 58,83.5 58.8,79.4 55.5,76.6 59.8,76" fill="#FDE047" stroke="#1C1917" strokeWidth="1.4" />
        </g>
      );
    case 'aurora-ribbon':
      return (
        <path
          d="M 22 74 Q 36 66 50 74 Q 64 82 78 73"
          fill="none"
          stroke={secondary}
          strokeWidth="5.5"
          strokeLinecap="round"
          opacity="0.88"
        />
      );
    case 'diamond-facets':
      return (
        <g fill="#FFFFFF" stroke={accent} strokeWidth="1.3" opacity="0.9">
          <polygon points="50,69 53,75 59,77 53,79 50,85 47,79 41,77 47,75" />
          <polygon points="30,42 34,46 30,50 26,46" />
          <polygon points="70,42 74,46 70,50 66,46" />
        </g>
      );
    case 'galaxy-stars':
      return (
        <g fill="#FEF08A">
          <polygon points="30,72 31.8,75.5 35.5,76.5 31.8,77.5 30,81 28.2,77.5 24.5,76.5 28.2,75.5" />
          <polygon points="70,71 71.5,74.5 75,75.5 71.5,76.5 70,80 68.5,76.5 65,75.5 68.5,74.5" />
          <circle cx="50" cy="79" r="2.2" fill="#FFFFFF" />
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
    case 'none':
    default:
      return null;
  }
}

export function renderPhase2DCollectible(id: string, uid?: string): React.ReactNode | null {
  const spec = PHASE2D_COLLECTIBLE_SPECS[id];
  if (!spec) return null;

  const gradId = uid ? `qv-p2d-grad-${id}-${uid}` : `qv-p2d-grad-${id}`;
  const fillRef = spec.chroma ? `url(#${gradId})` : spec.body;
  const lum = hexLuminance(spec.body);
  // Protect eyes/mouth readability on dark bodies (WCAG relative luminance < 0.14 covers deep navy, midnight violet, dark cocoa/brown #92400E)
  // Note: husky-mask paints a bright white lower-face mask behind the eyes, so husky stays dark-ink on white.
  const isDarkBody = !spec.chroma && lum < 0.14 && spec.detail !== 'husky-mask';
  const faceStroke = isDarkBody ? '#F8FAFC' : '#1C1917';

  let eyeY = 55;
  let spread = 14;
  if (spec.shape === 'zongzi') {
    eyeY = 62;
    spread = 11;
  } else if (spec.shape === 'jelly') {
    eyeY = 46;
    spread = 13;
  } else if (spec.shape === 'pudding' || spec.shape === 'canele') {
    eyeY = 60;
    spread = 12;
  } else if (spec.shape === 'heart') {
    eyeY = 52;
    spread = 13;
  } else if (spec.shape === 'boat') {
    eyeY = 51;
    spread = 13;
  } else if (spec.shape === 'cottage') {
    eyeY = 52;
    spread = 13;
  } else if (spec.shape === 'teapot' || spec.shape === 'roll-cake' || spec.shape === 'pie') {
    eyeY = 57;
    spread = 13;
  } else if (spec.shape === 'octo') {
    eyeY = 53;
    spread = 13;
  } else if (spec.shape === 'blob') {
    eyeY = 54;
    spread = 16;
  } else if (spec.shape === 'sundae-cup') {
    eyeY = 56;
    spread = 13;
  }

  const mouthY = spec.detail === 'blob-nose' ? eyeY + 18 : eyeY + 8;

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

      {/* 1. Background accessories (ears, wings, tail feathers, paddles, lures) */}
      {renderP2DBackTopper(spec.back, spec.body, spec.secondary, spec.accent)}

      {/* 2. Body silhouette */}
      {renderP2DShape(spec.shape, fillRef, spec.secondary)}

      {/* 3. Surface details (stripes, spots, layers, scarves, mask, stars) */}
      {renderP2DDetail(spec.detail, spec.secondary, spec.accent, isDarkBody)}

      {/* 4. Foreground toppers (hats, crowns, horns, bows, drips — always in front of body!) */}
      {renderP2DFrontTopper(spec.front, spec.secondary, spec.accent)}

      {/* 5. Eyes */}
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
      {spec.eyes === 'blue' && (
        <g>
          <circle cx={50 - spread} cy={eyeY} r="5.4" fill="#38BDF8" stroke="#1C1917" strokeWidth="1.6" />
          <circle cx={50 - spread} cy={eyeY} r="2.6" fill="#1C1917" />
          <circle cx={50 - spread + 1.5} cy={eyeY - 1.5} r="1.5" fill="#FFFFFF" />
          <circle cx={50 + spread} cy={eyeY} r="5.4" fill="#38BDF8" stroke="#1C1917" strokeWidth="1.6" />
          <circle cx={50 + spread} cy={eyeY} r="2.6" fill="#1C1917" />
          <circle cx={50 + spread + 1.5} cy={eyeY - 1.5} r="1.5" fill="#FFFFFF" />
        </g>
      )}
      {(spec.eyes === 'round' || spec.eyes === 'starry') &&
        (isDarkBody ? (
          <g>
            <circle cx={50 - spread} cy={eyeY} r="5.6" fill="#FEF9C3" stroke="#1C1917" strokeWidth="1.2" />
            <circle cx={50 - spread} cy={eyeY} r="3.2" fill="#1C1917" />
            <circle cx={50 - spread + 1.4} cy={eyeY - 1.4} r="1.5" fill="#FFFFFF" />
            <circle cx={50 + spread} cy={eyeY} r="5.6" fill="#FEF9C3" stroke="#1C1917" strokeWidth="1.2" />
            <circle cx={50 + spread} cy={eyeY} r="3.2" fill="#1C1917" />
            <circle cx={50 + spread + 1.4} cy={eyeY - 1.4} r="1.5" fill="#FFFFFF" />
            {spec.eyes === 'starry' && (
              <>
                <circle cx={50 - spread - 1.5} cy={eyeY + 1.6} r="1.1" fill="#FDE047" />
                <circle cx={50 + spread - 1.5} cy={eyeY + 1.6} r="1.1" fill="#FDE047" />
              </>
            )}
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
        ))}

      {/* 6. Cheeks */}
      <g opacity="0.78">
        <ellipse cx={50 - spread - 7} cy={eyeY + 7} rx="4.6" ry="2.7" fill={spec.cheek} />
        <ellipse cx={50 + spread + 7} cy={eyeY + 7} rx="4.6" ry="2.7" fill={spec.cheek} />
      </g>

      {/* 7. Mouth */}
      {spec.mouth === 'beak' && (
        <polygon
          points={`45,${mouthY - 2} 55,${mouthY - 2} 50,${mouthY + 6}`}
          fill="#F59E0B"
          stroke="#1C1917"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      )}
      {spec.mouth === 'cat' && (
        <path
          d={`M 44 ${mouthY} Q 47 ${mouthY + 4} 50 ${mouthY} Q 53 ${mouthY + 4} 56 ${mouthY}`}
          stroke={faceStroke}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {spec.mouth === 'snout' && (
        <g>
          <ellipse cx="50" cy={mouthY - 1} rx="4.4" ry="2.8" fill={faceStroke} />
          <path
            d={`M 45 ${mouthY + 4} Q 50 ${mouthY + 8} 55 ${mouthY + 4}`}
            stroke={faceStroke}
            strokeWidth="2.3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}
      {spec.mouth === 'happy' && (
        <path
          d={`M 44 ${mouthY - 1} Q 50 ${mouthY + 7} 56 ${mouthY - 1}`}
          stroke={faceStroke}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {spec.mouth === 'smile' && (
        <path
          d={`M 45 ${mouthY} Q 50 ${mouthY + 5} 55 ${mouthY}`}
          stroke={faceStroke}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {spec.mouth === 'fangs' && (
        <g>
          <path
            d={`M 43 ${mouthY} Q 50 ${mouthY + 6} 57 ${mouthY}`}
            stroke={faceStroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points={`45,${mouthY + 1} 47.5,${mouthY + 1} 46.2,${mouthY + 5}`} fill="#FFFFFF" />
          <polygon points={`52.5,${mouthY + 1} 55,${mouthY + 1} 53.8,${mouthY + 5}`} fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
}

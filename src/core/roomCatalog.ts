import type { CritterRoomThemeId } from './types';

export const CRITTER_ROOM_MAX_DECOR = 6;

export interface CritterRoomThemeMeta {
  id: CritterRoomThemeId;
  name: string;
  zhName: string;
  emoji: string;
  accentHex: string;
  borderHex: string;
  badgeBg: string;
}

export const CRITTER_ROOM_THEMES: CritterRoomThemeMeta[] = [
  {
    id: 'strawberry-cafe',
    name: 'Strawberry Boba Café',
    zhName: '草莓珍珠咖啡廳',
    emoji: '🍓',
    accentHex: '#DB2777',
    borderHex: '#F9A8D4',
    badgeBg: '#FDF2F8',
  },
  {
    id: 'starlight-attic',
    name: 'Starlight Attic',
    zhName: '星光閣樓秘密基地',
    emoji: '🌙',
    accentHex: '#4F46E5',
    borderHex: '#A5B4FC',
    badgeBg: '#EEF2FF',
  },
  {
    id: 'boba-beach',
    name: 'Sunset Boba Beach',
    zhName: '夕陽珍珠海灘',
    emoji: '🏖️',
    accentHex: '#EA580C',
    borderHex: '#FDBA74',
    badgeBg: '#FFF7ED',
  },
  {
    id: 'fairy-treehouse',
    name: 'Fairy Treehouse',
    zhName: '奇幻森林樹屋',
    emoji: '🌿',
    accentHex: '#059669',
    borderHex: '#6EE7B7',
    badgeBg: '#ECFDF5',
  },
  {
    id: 'sakura-teahouse',
    name: 'Sakura Teahouse',
    zhName: '櫻花和室茶屋',
    emoji: '🌸',
    accentHex: '#EC4899',
    borderHex: '#FBCFE8',
    badgeBg: '#FDF2F8',
  },
  {
    id: 'rainbow-cloud-castle',
    name: 'Rainbow Cloud Castle',
    zhName: '雲端彩虹城堡',
    emoji: '🌈',
    accentHex: '#7C3AED',
    borderHex: '#DDD6FE',
    badgeBg: '#F5F3FF',
  },
  {
    id: 'coral-pearl-palace',
    name: 'Coral Pearl Palace',
    zhName: '深海珍珠宮殿',
    emoji: '🐚',
    accentHex: '#0D9488',
    borderHex: '#99F6E4',
    badgeBg: '#F0FDFA',
  },
  {
    id: 'winter-cocoa-igloo',
    name: 'Winter Cocoa Igloo',
    zhName: '冬日可可雪屋',
    emoji: '❄️',
    accentHex: '#0284C7',
    borderHex: '#BAE6FD',
    badgeBg: '#F0F9FF',
  },
];

export const VALID_CRITTER_ROOM_THEME_IDS: ReadonlySet<CritterRoomThemeId> = new Set(
  CRITTER_ROOM_THEMES.map((t) => t.id),
);

export interface RoomDecorItem {
  id: string;
  name: string;
  zhName: string;
  emoji: string;
  /** Center X in the 800x450 SVG coordinate space (chosen to avoid the 8 critter slots). */
  x: number;
  /** Center Y in the 800x450 SVG coordinate space (chosen to avoid the 8 critter slots). */
  y: number;
}

/**
 * 12 free cute original SVG furniture & decor stickers for My Critter Room.
 * Coordinates are deliberately placed in open scenic zones clear of the 8 critter slots:
 * Critter slots are at x≈128/312/496/672, y≈148 (upper) and y≈330–342 (lower).
 */
export const ROOM_DECOR_ITEMS: readonly RoomDecorItem[] = [
  { id: 'decor-boba-lamp', name: 'Boba Desk Lamp', zhName: '珍珠小檯燈', emoji: '🧋', x: 60, y: 244 },
  { id: 'decor-star-mobile', name: 'Starry Mobile', zhName: '星星吊飾', emoji: '⭐', x: 224, y: 62 },
  { id: 'decor-sakura-bonsai', name: 'Sakura Bonsai', zhName: '櫻花小盆栽', emoji: '🌸', x: 736, y: 246 },
  { id: 'decor-plush-cushion', name: 'Cloud Cushion', zhName: '雲朵抱枕', emoji: '☁️', x: 404, y: 406 },
  { id: 'decor-mini-bookshelf', name: 'Storybook Shelf', zhName: '迷你繪本架', emoji: '📚', x: 222, y: 244 },
  { id: 'decor-tea-set', name: 'Cozy Tea Set', zhName: '下午茶組', emoji: '🫖', x: 404, y: 256 },
  { id: 'decor-rainbow-banner', name: 'Rainbow Bunting', zhName: '彩虹掛旗', emoji: '🌈', x: 400, y: 42 },
  { id: 'decor-music-box', name: 'Star Music Box', zhName: '星星音樂盒', emoji: '🎵', x: 584, y: 246 },
  { id: 'decor-lantern-pair', name: 'Night Lanterns', zhName: '夜市小燈籠', emoji: '🏮', x: 582, y: 62 },
  { id: 'decor-shell-fountain', name: 'Pearl Shell Lamp', zhName: '珍珠貝殼燈', emoji: '🐚', x: 222, y: 406 },
  { id: 'decor-cocoa-mug', name: 'Warm Cocoa Mug', zhName: '熱可可杯', emoji: '☕', x: 586, y: 406 },
  { id: 'decor-flower-garland', name: 'Flower Garland', zhName: '四季花環', emoji: '💐', x: 400, y: 120 },
];

export const VALID_ROOM_DECOR_IDS: ReadonlySet<string> = new Set(
  ROOM_DECOR_ITEMS.map((d) => d.id),
);

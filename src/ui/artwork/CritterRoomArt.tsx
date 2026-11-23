import React from 'react';
import {
  CRITTER_ROOM_THEMES,
  ROOM_DECOR_ITEMS,
  type CritterRoomThemeMeta,
  type RoomDecorItem,
} from '../../core/roomCatalog';
import type { CritterRoomThemeId } from '../../core/types';

export { CRITTER_ROOM_THEMES, ROOM_DECOR_ITEMS };
export type { CritterRoomThemeMeta, RoomDecorItem };

/**
 * Eight well-spaced slot anchor coordinates (% inside the 16:9 / 16:10 room stage).
 * Designed to avoid overlaps across mobile, iPad, and desktop screens.
 */
export const ROOM_SLOT_POSITIONS: ReadonlyArray<{
  slotIndex: number;
  label: string;
  leftPct: number;
  topPct: number;
}> = [
  { slotIndex: 0, label: 'Upper Left Shelf', leftPct: 16, topPct: 33 },
  { slotIndex: 1, label: 'Center Left Perch', leftPct: 39, topPct: 31 },
  { slotIndex: 2, label: 'Center Right Perch', leftPct: 62, topPct: 31 },
  { slotIndex: 3, label: 'Upper Right Shelf', leftPct: 84, topPct: 33 },
  { slotIndex: 4, label: 'Front Left Spot', leftPct: 16, topPct: 73 },
  { slotIndex: 5, label: 'Front Center-Left', leftPct: 39, topPct: 76 },
  { slotIndex: 6, label: 'Front Center-Right', leftPct: 62, topPct: 76 },
  { slotIndex: 7, label: 'Front Right Spot', leftPct: 84, topPct: 73 },
];

function renderDecorStickerSvg(id: string): React.ReactNode {
  switch (id) {
    case 'decor-boba-lamp':
      return (
        <g>
          <rect x="-12" y="16" width="24" height="7" rx="3.5" fill="#92400E" stroke="#1C1917" strokeWidth="2.2" />
          <path d="M-11 16 L-14 -12 L14 -12 L11 16 Z" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="-16" y="-16" width="32" height="6" rx="3" fill="#F472B6" stroke="#1C1917" strokeWidth="2" />
          <rect x="-3" y="-26" width="6" height="10" rx="2" fill="#EC4899" stroke="#1C1917" strokeWidth="1.8" />
          <circle cx="-5" cy="10" r="3" fill="#292524" />
          <circle cx="3" cy="11" r="3" fill="#292524" />
          <circle cx="7" cy="5" r="2.5" fill="#292524" />
          <circle cx="0" cy="-2" r="9" fill="#FDE047" opacity="0.32" />
        </g>
      );
    case 'decor-star-mobile':
      return (
        <g>
          <line x1="0" y1="-26" x2="0" y2="-6" stroke="#94A3B8" strokeWidth="2" />
          <line x1="-20" y1="-6" x2="20" y2="-6" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="-16" y1="-6" x2="-16" y2="8" stroke="#94A3B8" strokeWidth="1.6" />
          <line x1="0" y1="-6" x2="0" y2="14" stroke="#94A3B8" strokeWidth="1.6" />
          <line x1="16" y1="-6" x2="16" y2="8" stroke="#94A3B8" strokeWidth="1.6" />
          <polygon points="0,4 3,11 10,11 4.5,15.5 6.5,22 0,18 -6.5,22 -4.5,15.5 -10,11 -3,11" fill="#FDE047" stroke="#1C1917" strokeWidth="1.8" />
          <circle cx="-16" cy="12" r="5.5" fill="#93C5FD" stroke="#1C1917" strokeWidth="1.8" />
          <circle cx="16" cy="12" r="5.5" fill="#F9A8D4" stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'decor-sakura-bonsai':
      return (
        <g>
          <path d="M-16 8 L16 8 L12 22 L-12 22 Z" fill="#C2410C" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M0 8 Q-4 -4 -10 -10 M0 8 Q5 -2 10 -8" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle cx="-12" cy="-12" r="10" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.8" />
          <circle cx="10" cy="-10" r="10" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.8" />
          <circle cx="0" cy="-18" r="11" fill="#FCE7F3" stroke="#EC4899" strokeWidth="1.8" />
          <circle cx="-4" cy="-16" r="2.5" fill="#F472B6" />
          <circle cx="6" cy="-12" r="2.5" fill="#F472B6" />
        </g>
      );
    case 'decor-plush-cushion':
      return (
        <g>
          <circle cx="-16" cy="2" r="12" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="16" cy="2" r="12" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.2" />
          <circle cx="0" cy="-6" r="15" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.2" />
          <rect x="-18" y="-2" width="36" height="16" rx="8" fill="#FFFFFF" />
          <path d="M-24 12 Q0 18 24 12" stroke="#1C1917" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="-7" cy="2" r="2.2" fill="#1C1917" />
          <circle cx="7" cy="2" r="2.2" fill="#1C1917" />
          <ellipse cx="-13" cy="6" rx="3.2" ry="1.8" fill="#FDA4AF" />
          <ellipse cx="13" cy="6" rx="3.2" ry="1.8" fill="#FDA4AF" />
          <path d="M-3 6 Q0 9 3 6" stroke="#1C1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'decor-mini-bookshelf':
      return (
        <g>
          <rect x="-24" y="-14" width="48" height="34" rx="5" fill="#D97706" stroke="#1C1917" strokeWidth="2.2" />
          <rect x="-20" y="-10" width="40" height="26" rx="3" fill="#FEF3C7" />
          <rect x="-17" y="-8" width="8" height="22" rx="1.5" fill="#EC4899" stroke="#1C1917" strokeWidth="1.5" />
          <rect x="-8" y="-5" width="8" height="19" rx="1.5" fill="#3B82F6" stroke="#1C1917" strokeWidth="1.5" />
          <rect x="1" y="-9" width="8" height="23" rx="1.5" fill="#10B981" stroke="#1C1917" strokeWidth="1.5" />
          <rect x="10" y="-6" width="8" height="20" rx="1.5" fill="#F59E0B" stroke="#1C1917" strokeWidth="1.5" />
        </g>
      );
    case 'decor-tea-set':
      return (
        <g>
          <ellipse cx="0" cy="14" rx="28" ry="6" fill="#FBCFE8" stroke="#1C1917" strokeWidth="2" />
          <circle cx="-8" cy="2" r="11" fill="#F472B6" stroke="#1C1917" strokeWidth="2.2" />
          <path d="M-19 2 Q-25 -3 -20 -8" stroke="#1C1917" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M3 0 Q9 -4 6 5" stroke="#1C1917" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="-8" cy="-10" r="3.5" fill="#FDE047" stroke="#1C1917" strokeWidth="1.8" />
          <rect x="9" y="2" width="12" height="10" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <circle cx="15" cy="7" r="2.2" fill="#EC4899" />
        </g>
      );
    case 'decor-rainbow-banner':
      return (
        <g>
          <path d="M-64 -6 Q0 14 64 -6" stroke="#1C1917" strokeWidth="2.2" fill="none" />
          {[
            { x: -46, c: '#FB7185' },
            { x: -23, c: '#FBBF24' },
            { x: 0, c: '#34D399' },
            { x: 23, c: '#38BDF8' },
            { x: 46, c: '#A78BFA' },
          ].map((flag) => (
            <polygon
              key={flag.x}
              points={`${flag.x - 9},${flag.x === 0 ? 4 : Math.abs(flag.x) === 23 ? 2 : -2} ${flag.x + 9},${flag.x === 0 ? 4 : Math.abs(flag.x) === 23 ? 2 : -2} ${flag.x},${flag.x === 0 ? 22 : Math.abs(flag.x) === 23 ? 19 : 15}`}
              fill={flag.c}
              stroke="#1C1917"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          ))}
        </g>
      );
    case 'decor-music-box':
      return (
        <g>
          <rect x="-18" y="-2" width="36" height="22" rx="5" fill="#A855F7" stroke="#1C1917" strokeWidth="2.2" />
          <rect x="-14" y="4" width="28" height="10" rx="3" fill="#F3E8FF" />
          <polygon points="0,-20 3,-12 11,-12 4.5,-7 7,0 0,-4 -7,0 -4.5,-7 -11,-12 -3,-12" fill="#FDE047" stroke="#1C1917" strokeWidth="1.8" />
          <circle cx="22" cy="9" r="4" fill="#FACC15" stroke="#1C1917" strokeWidth="1.8" />
        </g>
      );
    case 'decor-lantern-pair':
      return (
        <g>
          <line x1="-16" y1="-24" x2="-16" y2="-12" stroke="#1C1917" strokeWidth="2" />
          <line x1="16" y1="-24" x2="16" y2="-10" stroke="#1C1917" strokeWidth="2" />
          <ellipse cx="-16" cy="0" rx="11" ry="13" fill="#EF4444" stroke="#1C1917" strokeWidth="2.2" />
          <ellipse cx="-16" cy="0" rx="5" ry="12" fill="none" stroke="#FDE047" strokeWidth="1.6" />
          <line x1="-16" y1="13" x2="-16" y2="22" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="16" cy="2" rx="11" ry="13" fill="#F97316" stroke="#1C1917" strokeWidth="2.2" />
          <ellipse cx="16" cy="2" rx="5" ry="12" fill="none" stroke="#FEF08A" strokeWidth="1.6" />
          <line x1="16" y1="15" x2="16" y2="24" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'decor-shell-fountain':
      return (
        <g>
          <path d="M-22 10 Q-20 -16 0 -18 Q20 -16 22 10 Z" fill="#F9A8D4" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M-12 10 L-8 -12 M0 10 L0 -15 M12 10 L8 -12" stroke="#DB2777" strokeWidth="1.8" />
          <circle cx="0" cy="4" r="7.5" fill="#FFFDF8" stroke="#1C1917" strokeWidth="2" />
          <circle cx="-2" cy="2" r="2.2" fill="#BAE6FD" />
          <ellipse cx="0" cy="14" rx="24" ry="6" fill="#67E8F9" stroke="#1C1917" strokeWidth="2" />
        </g>
      );
    case 'decor-cocoa-mug':
      return (
        <g>
          <path d="M-6 -12 Q-9 -18 -5 -22 M4 -12 Q1 -18 5 -22" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.9" />
          <rect x="-15" y="-8" width="28" height="26" rx="6" fill="#EA580C" stroke="#1C1917" strokeWidth="2.2" />
          <path d="M13 -3 Q22 -3 22 5 Q22 13 13 13" fill="none" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="-1" cy="-6" rx="11" ry="4" fill="#78350F" />
          <circle cx="-5" cy="-6" r="3" fill="#FFFFFF" />
          <circle cx="2" cy="-5" r="3" fill="#FFFFFF" />
          <circle cx="-1" cy="6" r="4" fill="#FEF3C7" />
        </g>
      );
    case 'decor-flower-garland':
      return (
        <g>
          <circle cx="0" cy="0" r="18" fill="none" stroke="#16A34A" strokeWidth="5.5" />
          {[
            [0, -18, '#F472B6'],
            [16, -8, '#FBBF24'],
            [16, 10, '#38BDF8'],
            [0, 18, '#A78BFA'],
            [-16, 10, '#FB7185'],
            [-16, -8, '#34D399'],
          ].map(([cx, cy, fill], i) => (
            <g key={i}>
              <circle cx={cx as number} cy={cy as number} r="5.5" fill={fill as string} stroke="#1C1917" strokeWidth="1.5" />
              <circle cx={cx as number} cy={cy as number} r="2" fill="#FEF08A" />
            </g>
          ))}
        </g>
      );
    default:
      return null;
  }
}

export const CritterRoomBackdrop: React.FC<{
  themeId: CritterRoomThemeId;
  decorIds?: string[];
}> = ({ themeId, decorIds = [] }) => {
  const activeDecorItems = ROOM_DECOR_ITEMS.filter((d) => decorIds.includes(d.id));

  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {themeId === 'strawberry-cafe' && (
        <g>
          {/* Pastel pink café wallpaper with soft stripes */}
          <rect width="800" height="450" fill="#FFF1F5" />
          {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720].map((x) => (
            <rect key={x} x={x} y="0" width="40" height="270" fill="#FFE4EE" fillOpacity="0.65" />
          ))}
          {/* Café awning */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <path
              key={i}
              d={`M ${i * 80} 0 L ${(i + 1) * 80} 0 L ${(i + 1) * 80} 42 Q ${i * 80 + 40} 58 ${i * 80} 42 Z`}
              fill={i % 2 === 0 ? '#F472B6' : '#FFFDF8'}
              stroke="#EC4899"
              strokeWidth="2"
            />
          ))}
          {/* Arched café window */}
          <path
            d="M320 190 L320 112 A80 62 0 0 1 480 112 L480 190 Z"
            fill="#E0F2FE"
            stroke="#F9A8D4"
            strokeWidth="8"
          />
          <line x1="400" y1="54" x2="400" y2="190" stroke="#F9A8D4" strokeWidth="5" />
          <line x1="320" y1="130" x2="480" y2="130" stroke="#F9A8D4" strokeWidth="5" />
          {/* Display shelves */}
          <rect x="44" y="182" width="225" height="16" rx="8" fill="#FDBA74" stroke="#C2410C" strokeWidth="2.5" />
          <rect x="531" y="182" width="225" height="16" rx="8" fill="#FDBA74" stroke="#C2410C" strokeWidth="2.5" />
          <rect x="275" y="186" width="250" height="14" rx="7" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2.5" />
          {/* Warm wooden floor */}
          <rect x="0" y="270" width="800" height="180" fill="#FDE68A" />
          <line x1="0" y1="270" x2="800" y2="270" stroke="#D97706" strokeWidth="4" />
          {/* Cute strawberry rug */}
          <ellipse cx="400" cy="368" rx="280" ry="52" fill="#FCE7F3" stroke="#F472B6" strokeWidth="5" strokeDasharray="12 8" />
          <ellipse cx="400" cy="368" rx="230" ry="38" fill="#FFFDF8" fillOpacity="0.65" />
        </g>
      )}

      {themeId === 'starlight-attic' && (
        <g>
          {/* Deep starry indigo wall */}
          <rect width="800" height="450" fill="#1E1B4B" />
          {/* Twinkling stars */}
          {[
            [68, 56, 3],
            [142, 82, 2.5],
            [248, 46, 3.5],
            [560, 54, 3],
            [668, 76, 2.5],
            [738, 48, 3.5],
            [196, 128, 2],
            [610, 120, 2],
          ].map(([cx, cy, r], idx) => (
            <circle key={idx} cx={cx} cy={cy} r={r} fill="#FDE047" />
          ))}
          {/* Round observatory moon window */}
          <circle cx="400" cy="118" r="68" fill="#312E81" stroke="#A5B4FC" strokeWidth="8" />
          <path d="M388 76 A36 36 0 1 0 434 128 A28 28 0 1 1 388 76 Z" fill="#FDE047" />
          {/* Fairy lights */}
          <path d="M0 32 Q200 72 400 32 Q600 72 800 32" stroke="#C7D2FE" strokeWidth="2.5" fill="none" />
          {[90, 180, 270, 530, 620, 710].map((x) => (
            <circle key={x} cx={x} cy={50} r="6" fill="#FDE68A" />
          ))}
          {/* Floating moon shelves */}
          <rect x="46" y="182" width="224" height="15" rx="7.5" fill="#4338CA" stroke="#A5B4FC" strokeWidth="2.5" />
          <rect x="530" y="182" width="224" height="15" rx="7.5" fill="#4338CA" stroke="#A5B4FC" strokeWidth="2.5" />
          <rect x="285" y="186" width="230" height="14" rx="7" fill="#3730A3" stroke="#818CF8" strokeWidth="2.5" />
          {/* Cozy attic floorboards */}
          <rect x="0" y="272" width="800" height="178" fill="#312E81" />
          <line x1="0" y1="272" x2="800" y2="272" stroke="#818CF8" strokeWidth="4" />
          {/* Star rug */}
          <ellipse cx="400" cy="368" rx="285" ry="52" fill="#4338CA" stroke="#FDE047" strokeWidth="4" strokeDasharray="10 10" />
          <ellipse cx="400" cy="368" rx="220" ry="34" fill="#4F46E5" />
        </g>
      )}

      {themeId === 'boba-beach' && (
        <g>
          {/* Warm sunset sky */}
          <rect width="800" height="190" fill="#FFEDD5" />
          <rect y="95" width="800" height="95" fill="#FED7AA" />
          {/* Sunset sun */}
          <circle cx="400" cy="148" r="54" fill="#FBBF24" />
          <circle cx="400" cy="148" r="68" fill="#FDE68A" fillOpacity="0.35" />
          {/* Ocean waves */}
          <rect y="180" width="800" height="92" fill="#38BDF8" />
          <path d="M0 205 Q100 190 200 205 T400 205 T600 205 T800 205" stroke="#E0F2FE" strokeWidth="5" fill="none" />
          <path d="M0 242 Q120 228 240 242 T480 242 T720 242 T800 242" stroke="#BAE6FD" strokeWidth="4" fill="none" />
          {/* Wooden pier deck shelves */}
          <rect x="44" y="182" width="225" height="16" rx="8" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
          <rect x="531" y="182" width="225" height="16" rx="8" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
          <rect x="282" y="186" width="236" height="14" rx="7" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
          {/* Golden beach sand */}
          <rect y="272" width="800" height="178" fill="#FEF3C7" />
          <path d="M0 272 Q200 258 400 272 T800 272 L800 292 L0 292 Z" fill="#FDE68A" />
          {/* Striped beach mat */}
          <rect x="115" y="322" width="570" height="96" rx="26" fill="#FB923C" stroke="#EA580C" strokeWidth="4" />
          <rect x="155" y="336" width="490" height="68" rx="18" fill="#FFF7ED" />
          <line x1="155" y1="358" x2="645" y2="358" stroke="#FDBA74" strokeWidth="8" />
          <line x1="155" y1="382" x2="645" y2="382" stroke="#38BDF8" strokeWidth="8" />
        </g>
      )}

      {themeId === 'fairy-treehouse' && (
        <g>
          {/* Enchanted mint forest sky */}
          <rect width="800" height="450" fill="#ECFDF5" />
          {/* Canopy leaves */}
          <circle cx="80" cy="30" r="76" fill="#34D399" />
          <circle cx="210" cy="18" r="64" fill="#10B981" />
          <circle cx="590" cy="18" r="68" fill="#10B981" />
          <circle cx="725" cy="32" r="78" fill="#34D399" />
          {/* Treehouse wood walls */}
          <rect x="26" y="74" width="748" height="202" rx="24" fill="#FEF3C7" stroke="#92400E" strokeWidth="6" />
          {/* Round forest window */}
          <circle cx="400" cy="134" r="52" fill="#D1FAE5" stroke="#059669" strokeWidth="7" />
          <circle cx="384" cy="122" r="10" fill="#A7F3D0" />
          <circle cx="418" cy="144" r="14" fill="#6EE7B7" />
          {/* Branch shelves */}
          <rect x="46" y="182" width="224" height="16" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <rect x="530" y="182" width="224" height="16" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <rect x="284" y="186" width="232" height="14" rx="7" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
          {/* Mossy wooden floor */}
          <rect y="272" width="800" height="178" fill="#A7F3D0" />
          <line x1="0" y1="272" x2="800" y2="272" stroke="#059669" strokeWidth="4" />
          {/* Flower meadow rug */}
          <ellipse cx="400" cy="368" rx="284" ry="52" fill="#D1FAE5" stroke="#10B981" strokeWidth="5" />
          <circle cx="170" cy="370" r="8" fill="#FDE047" />
          <circle cx="630" cy="370" r="8" fill="#F9A8D4" />
          <circle cx="400" cy="332" r="7" fill="#FDE047" />
        </g>
      )}

      {themeId === 'sakura-teahouse' && (
        <g>
          {/* Warm cream shoji wall */}
          <rect width="800" height="450" fill="#FFFBEB" />
          {/* Wooden beams */}
          <rect x="0" y="0" width="800" height="22" fill="#B45309" />
          <rect x="0" y="22" width="20" height="250" fill="#B45309" />
          <rect x="780" y="22" width="20" height="250" fill="#B45309" />
          {/* Round Japanese window viewing cherry blossoms */}
          <circle cx="400" cy="120" r="72" fill="#E0F2FE" stroke="#92400E" strokeWidth="9" />
          <path d="M338 112 Q378 96 426 118 Q448 128 466 106" stroke="#78350F" strokeWidth="5" fill="none" strokeLinecap="round" />
          {[
            [364, 102, 13],
            [394, 96, 15],
            [424, 114, 14],
            [448, 102, 12],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#FBCFE8" stroke="#F472B6" strokeWidth="1.8" />
          ))}
          {/* Shoji lattice side panels */}
          <rect x="52" y="48" width="120" height="120" fill="#FFFDF8" stroke="#D97706" strokeWidth="4" />
          <line x1="112" y1="48" x2="112" y2="168" stroke="#D97706" strokeWidth="2.5" />
          <line x1="52" y1="108" x2="172" y2="108" stroke="#D97706" strokeWidth="2.5" />
          <rect x="628" y="48" width="120" height="120" fill="#FFFDF8" stroke="#D97706" strokeWidth="4" />
          <line x1="688" y1="48" x2="688" y2="168" stroke="#D97706" strokeWidth="2.5" />
          <line x1="628" y1="108" x2="748" y2="108" stroke="#D97706" strokeWidth="2.5" />
          {/* Cedar display shelves */}
          <rect x="44" y="182" width="225" height="16" rx="6" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <rect x="531" y="182" width="225" height="16" rx="6" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <rect x="278" y="186" width="244" height="14" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
          {/* Tatami floor */}
          <rect y="272" width="800" height="178" fill="#DCFCE7" />
          <line x1="0" y1="272" x2="800" y2="272" stroke="#15803D" strokeWidth="5" />
          <line x1="266" y1="272" x2="266" y2="450" stroke="#86EFAC" strokeWidth="4" />
          <line x1="534" y1="272" x2="534" y2="450" stroke="#86EFAC" strokeWidth="4" />
          {/* Sakura blossom rug */}
          <ellipse cx="400" cy="368" rx="284" ry="52" fill="#FCE7F3" stroke="#EC4899" strokeWidth="5" />
          <ellipse cx="400" cy="368" rx="236" ry="36" fill="#FFF1F2" />
        </g>
      )}

      {themeId === 'rainbow-cloud-castle' && (
        <g>
          {/* Pastel sky */}
          <rect width="800" height="450" fill="#EFF6FF" />
          <rect y="0" width="800" height="150" fill="#F5F3FF" />
          {/* Pastel 5-band rainbow arch */}
          <path d="M120 260 A280 220 0 0 1 680 260" fill="none" stroke="#FDA4AF" strokeWidth="18" />
          <path d="M138 260 A262 204 0 0 1 662 260" fill="none" stroke="#FDE047" strokeWidth="18" />
          <path d="M156 260 A244 188 0 0 1 644 260" fill="none" stroke="#86EFAC" strokeWidth="18" />
          <path d="M174 260 A226 172 0 0 1 626 260" fill="none" stroke="#93C5FD" strokeWidth="18" />
          <path d="M192 260 A208 156 0 0 1 608 260" fill="none" stroke="#DDD6FE" strokeWidth="18" />
          {/* Twin fairytale castle turrets */}
          <rect x="64" y="92" width="60" height="90" fill="#FFFFFF" stroke="#A78BFA" strokeWidth="3" />
          <polygon points="56,92 94,38 132,92" fill="#F472B6" stroke="#7C3AED" strokeWidth="3" strokeLinejoin="round" />
          <rect x="676" y="92" width="60" height="90" fill="#FFFFFF" stroke="#A78BFA" strokeWidth="3" />
          <polygon points="668,92 706,38 744,92" fill="#F472B6" stroke="#7C3AED" strokeWidth="3" strokeLinejoin="round" />
          {/* Fluffy cloud shelves */}
          <rect x="44" y="182" width="225" height="18" rx="9" fill="#FFFFFF" stroke="#A78BFA" strokeWidth="2.8" />
          <rect x="531" y="182" width="225" height="18" rx="9" fill="#FFFFFF" stroke="#A78BFA" strokeWidth="2.8" />
          <rect x="278" y="186" width="244" height="16" rx="8" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2.8" />
          {/* Cloud meadow floor */}
          <rect y="272" width="800" height="178" fill="#EDE9FE" />
          <path d="M0 274 Q80 250 160 274 T320 274 T480 274 T640 274 T800 274 L800 296 L0 296 Z" fill="#FFFFFF" />
          {/* Starry cloud carpet */}
          <ellipse cx="400" cy="368" rx="286" ry="52" fill="#FDF2F8" stroke="#A855F7" strokeWidth="5" strokeDasharray="12 8" />
          <ellipse cx="400" cy="368" rx="224" ry="34" fill="#FFFFFF" />
        </g>
      )}

      {themeId === 'coral-pearl-palace' && (
        <g>
          {/* Deep luminous lagoon wall */}
          <rect width="800" height="450" fill="#0F766E" />
          <rect y="0" width="800" height="180" fill="#0D9488" />
          {/* Shimmering light rays */}
          <polygon points="180,0 260,0 320,270 140,270" fill="#99F6E4" fillOpacity="0.14" />
          <polygon points="480,0 580,0 650,270 460,270" fill="#99F6E4" fillOpacity="0.14" />
          {/* Giant pearl arch window */}
          <path
            d="M312 192 L312 114 A88 68 0 0 1 488 114 L488 192 Z"
            fill="#164E63"
            stroke="#99F6E4"
            strokeWidth="8"
          />
          {[332, 366, 400, 434, 468].map((x, idx) => (
            <circle key={idx} cx={x} cy={idx === 2 ? 50 : idx === 1 || idx === 3 ? 60 : 82} r="7" fill="#FFFDF8" />
          ))}
          {/* Floating bubbles */}
          {[
            [92, 64, 9],
            [114, 92, 6],
            [698, 58, 10],
            [676, 94, 6],
            [400, 118, 8],
            [424, 140, 5],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#CCFBF1" fillOpacity="0.45" stroke="#FFFFFF" strokeWidth="1.5" />
          ))}
          {/* Pearlescent coral shelves */}
          <rect x="44" y="182" width="225" height="16" rx="8" fill="#FB7185" stroke="#FFF1F2" strokeWidth="2.5" />
          <rect x="531" y="182" width="225" height="16" rx="8" fill="#FB7185" stroke="#FFF1F2" strokeWidth="2.5" />
          <rect x="278" y="186" width="244" height="14" rx="7" fill="#5EEAD4" stroke="#CCFBF1" strokeWidth="2.5" />
          {/* Aqua palace tile floor */}
          <rect y="272" width="800" height="178" fill="#14B8A6" />
          <line x1="0" y1="272" x2="800" y2="272" stroke="#99F6E4" strokeWidth="4" />
          {/* Shell mosaic rug */}
          <ellipse cx="400" cy="368" rx="286" ry="52" fill="#CCFBF1" stroke="#0F766E" strokeWidth="5" />
          <ellipse cx="400" cy="368" rx="228" ry="34" fill="#F0FDFA" />
        </g>
      )}

      {themeId === 'winter-cocoa-igloo' && (
        <g>
          {/* Ice-dome wall */}
          <rect width="800" height="450" fill="#E0F2FE" />
          {/* Soft igloo block seams */}
          <line x1="0" y1="70" x2="800" y2="70" stroke="#BAE6FD" strokeWidth="3" />
          <line x1="0" y1="140" x2="800" y2="140" stroke="#BAE6FD" strokeWidth="3" />
          <line x1="0" y1="210" x2="800" y2="210" stroke="#BAE6FD" strokeWidth="3" />
          {/* Aurora night sky window */}
          <path
            d="M316 190 L316 112 A84 62 0 0 1 484 112 L484 190 Z"
            fill="#1E3A8A"
            stroke="#7DD3FC"
            strokeWidth="8"
          />
          <path d="M326 114 Q370 86 410 108 T474 96" stroke="#34D399" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M332 132 Q382 112 426 130 T476 122" stroke="#A78BFA" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.65" />
          {/* Snowflakes */}
          {[
            [110, 52],
            [220, 96],
            [590, 88],
            [700, 52],
          ].map(([cx, cy], i) => (
            <g key={i} stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round">
              <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} />
              <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} />
            </g>
          ))}
          {/* Frosted pine shelves */}
          <rect x="44" y="182" width="225" height="16" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="531" y="182" width="225" height="16" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="278" y="186" width="244" height="14" rx="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" />
          {/* Warm cabin wood floor inside igloo */}
          <rect y="272" width="800" height="178" fill="#FDE68A" />
          <line x1="0" y1="272" x2="800" y2="272" stroke="#0284C7" strokeWidth="4" />
          {/* Cozy cocoa tartan rug */}
          <ellipse cx="400" cy="368" rx="284" ry="52" fill="#FB7185" stroke="#9F1239" strokeWidth="5" />
          <ellipse cx="400" cy="368" rx="236" ry="36" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="3" strokeDasharray="10 6" />
        </g>
      )}

      {/* Optional Free Cute Furniture & Decor Stickers Layer (curated non-overlapping coordinates) */}
      {activeDecorItems.length > 0 && (
        <g>
          {activeDecorItems.map((decor) => (
            <g key={decor.id} transform={`translate(${decor.x}, ${decor.y})`}>
              {renderDecorStickerSvg(decor.id)}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};

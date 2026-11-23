import React from 'react';
import type { CritterRoomThemeId } from '../../core/types';

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
];

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

export const CritterRoomBackdrop: React.FC<{ themeId: CritterRoomThemeId }> = ({ themeId }) => {
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
    </svg>
  );
};

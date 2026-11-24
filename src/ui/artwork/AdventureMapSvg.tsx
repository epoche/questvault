import React, { useId } from 'react';
import type { AdventureDayCell } from '../../core/adventureMap';

interface AdventureMapSvgProps {
  days: AdventureDayCell[];
  isZh: boolean;
  makeupAvailable: boolean;
  onSelectMakeupDate?: (dateKey: string) => void;
}

const STOP_COORDS: readonly { x: number; y: number }[] = [
  { x: 74, y: 126 },
  { x: 168, y: 82 },
  { x: 266, y: 132 },
  { x: 364, y: 78 },
  { x: 462, y: 130 },
  { x: 556, y: 86 },
  { x: 646, y: 112 },
];

export const AdventureMapSvg: React.FC<AdventureMapSvgProps> = ({
  days,
  isZh,
  makeupAvailable,
  onSelectMakeupDate,
}) => {
  const uid = useId().replace(/:/g, '');
  const seaGradId = `adv-sea-${uid}`;
  const sandGradId = `adv-sand-${uid}`;
  const goldGradId = `adv-gold-${uid}`;

  const trailPath =
    'M 74 126 Q 118 76 168 82 Q 218 88 266 132 Q 316 146 364 78 Q 412 58 462 130 Q 510 144 556 86 Q 604 64 646 112';

  return (
    <svg
      viewBox="0 0 720 205"
      role="img"
      aria-label={isZh ? '本週 7 天尋寶冒險島地圖' : 'Weekly 7-Day Treasure Adventure Map'}
      className="w-full h-auto rounded-2xl border-2 border-[#1C1917] select-none"
    >
      <defs>
        <linearGradient id={seaGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
        <linearGradient id={sandGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id={goldGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Tropical Sea Backdrop */}
      <rect x="0" y="0" width="720" height="205" fill={`url(#${seaGradId})`} />

      {/* Gentle Ocean Waves */}
      <path d="M 18 32 Q 34 25 50 32 T 82 32" fill="none" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
      <path d="M 604 28 Q 620 21 636 28 T 668 28" fill="none" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
      <path d="M 28 184 Q 44 177 60 184 T 92 184" fill="none" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
      <path d="M 594 182 Q 610 175 626 182 T 658 182" fill="none" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />

      {/* Treasure Island Silhouette */}
      <path
        d="M 34 128 C 26 76, 98 34, 198 42 C 282 28, 378 26, 466 42 C 556 30, 686 52, 692 114 C 698 164, 622 184, 520 174 C 420 186, 304 186, 204 174 C 102 184, 40 166, 34 128 Z"
        fill={`url(#${sandGradId})`}
        stroke="#D97706"
        strokeWidth="3"
      />
      {/* Lush Green Meadow Patches */}
      <ellipse cx="144" cy="112" rx="68" ry="34" fill="#BBF7D0" opacity="0.7" />
      <ellipse cx="368" cy="108" rx="92" ry="40" fill="#BBF7D0" opacity="0.65" />
      <ellipse cx="586" cy="112" rx="76" ry="36" fill="#BBF7D0" opacity="0.7" />

      {/* Decorative Palm Tree (left) & Starry Camp Flag (top center) */}
      <g transform="translate(86, 54)">
        <path d="M 0 26 Q -4 14 2 2" fill="none" stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 2 3 Q -12 -6 -16 4 Q -6 2 2 3 Z" fill="#16A34A" />
        <path d="M 2 3 Q 16 -6 18 5 Q 8 2 2 3 Z" fill="#15803D" />
        <path d="M 2 3 Q 0 -13 10 -10 Q 6 -2 2 3 Z" fill="#22C55E" />
      </g>
      <g transform="translate(526, 44)">
        <line x1="0" y1="0" x2="0" y2="24" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="0,1 16,6 0,12" fill="#EC4899" />
      </g>

      {/* Winding Treasure Trail */}
      <path
        d={trailPath}
        fill="none"
        stroke="#B45309"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="10 9"
        opacity="0.45"
      />

      {/* 7 Daily Checkpoints (Mon–Sun) */}
      {days.map((day, idx) => {
        const pt = STOP_COORDS[idx] ?? STOP_COORDS[0];
        const isFinalDay = idx === 6;
        const canMakeupClick = makeupAvailable && day.isPast && !day.stamped && Boolean(onSelectMakeupDate);
        const radius = isFinalDay ? 25 : 21;

        const fillColor = day.stamped
          ? isFinalDay
            ? `url(#${goldGradId})`
            : '#10B981'
          : canMakeupClick
            ? '#FEF3C7'
            : day.isToday
              ? '#EFF6FF'
              : '#FFFFFF';

        const strokeColor = day.stamped
          ? '#1C1917'
          : canMakeupClick
            ? '#D97706'
            : day.isToday
              ? '#2563EB'
              : '#A8A29E';

        return (
          <g
            key={day.dateKey}
            transform={`translate(${pt.x}, ${pt.y})`}
            style={canMakeupClick ? { cursor: 'pointer' } : undefined}
            onClick={canMakeupClick ? () => onSelectMakeupDate?.(day.dateKey) : undefined}
          >
            {/* Today / Makeup glow ring */}
            {(day.isToday || canMakeupClick) && !day.stamped && (
              <circle
                cx="0"
                cy="0"
                r={radius + 6}
                fill="none"
                stroke={canMakeupClick ? '#F59E0B' : '#3B82F6'}
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            )}

            <circle
              cx="0"
              cy="0"
              r={radius}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={day.stamped || day.isToday ? 3 : 2}
            />

            {/* Checkpoint Icon */}
            {day.stamped ? (
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fontSize={isFinalDay ? '20' : '17'}
                fontWeight="800"
                fill={isFinalDay ? '#78350F' : '#FFFFFF'}
              >
                {isFinalDay ? '👑' : '★'}
              </text>
            ) : canMakeupClick ? (
              <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="800" fill="#B45309">
                +★
              </text>
            ) : isFinalDay ? (
              <text x="0" y="6" textAnchor="middle" fontSize="16" fill="#92400E">
                🎁
              </text>
            ) : (
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill={day.isToday ? '#1D4ED8' : '#78716C'}
              >
                {idx + 1}
              </text>
            )}

            {/* Day Pill Label beneath circle */}
            <rect
              x="-24"
              y={radius + 5}
              width="48"
              height="19"
              rx="9"
              fill={day.isToday ? '#1D4ED8' : day.stamped ? '#047857' : '#FFFFFF'}
              stroke="#1C1917"
              strokeWidth="1.2"
              opacity="0.96"
            />
            <text
              x="0"
              y={radius + 18}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="800"
              fill={day.isToday || day.stamped ? '#FFFFFF' : '#44403C'}
            >
              {isZh ? day.shortZh : day.shortEn}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

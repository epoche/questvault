import React from 'react';
import { getCollectibleById } from '../../core/packs';
import type { TowerSlotState, TowerWaveDefinition } from '../../core/towerDefenseEngine';

interface TowerDefenseSvgProps {
  slots: readonly TowerSlotState[];
  shinyVault?: Record<string, boolean>;
  currentWave: TowerWaveDefinition;
  selectedSlotIndex: number | null;
  volleyActive: boolean;
  onSelectSlot: (slotIndex: number) => void;
}

const PAD_COORDS: { x: number; y: number }[] = [
  { x: 118, y: 56 },
  { x: 242, y: 172 },
  { x: 322, y: 56 },
  { x: 404, y: 172 },
  { x: 488, y: 56 },
  { x: 536, y: 172 },
];

const MONSTER_POSITIONS = [
  { x: 86, y: 122 },
  { x: 164, y: 116 },
  { x: 274, y: 112 },
  { x: 368, y: 114 },
  { x: 452, y: 112 },
];

/**
 * Original copyright-safe SVG meadow tower defense battlefield:
 * Winding sunlit road, 6 interactive critter tower pads, 5 cute monster waves,
 * castle goal, and golden Shiny star projectiles during volley bursts.
 */
export const TowerDefenseSvg: React.FC<TowerDefenseSvgProps> = ({
  slots,
  shinyVault = {},
  currentWave,
  selectedSlotIndex,
  volleyActive,
  onSelectSlot,
}) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const grassGradId = `${uid}-td-grass`;
  const activeMonsters = MONSTER_POSITIONS.slice(0, currentWave.monsterCount);

  return (
    <div className="w-full overflow-hidden rounded-2xl border-2 border-[#1C1917] bg-[#ECFDF5]">
      <svg
        viewBox="0 0 640 226"
        className="w-full h-auto block"
        role="img"
        aria-label={`Critter Tower Defense meadow battlefield for wave ${currentWave.waveNumber}`}
      >
        {/* Sunlit Meadow Backdrop */}
        <defs>
          <linearGradient id={grassGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="640" height="226" fill={`url(#${grassGradId})`} />

        {/* Decorative Meadow Hills & Flowers */}
        <circle cx="52" cy="36" r="22" fill="#6EE7B7" opacity="0.5" />
        <circle cx="595" cy="34" r="26" fill="#6EE7B7" opacity="0.45" />
        <circle cx="195" cy="34" r="4" fill="#FDE047" />
        <circle cx="445" cy="32" r="4" fill="#F472B6" />
        <circle cx="96" cy="198" r="4" fill="#FB923C" />
        <circle cx="332" cy="202" r="4" fill="#60A5FA" />

        {/* Winding Cobblestone Path */}
        <path
          d="M 28 124 C 110 124, 130 112, 200 112 C 270 112, 290 122, 360 114 C 430 106, 470 116, 578 112"
          fill="none"
          stroke="#D6C7B2"
          strokeWidth="38"
          strokeLinecap="round"
        />
        <path
          d="M 28 124 C 110 124, 130 112, 200 112 C 270 112, 290 122, 360 114 C 430 106, 470 116, 578 112"
          fill="none"
          stroke="#F5EFE6"
          strokeWidth="30"
          strokeLinecap="round"
        />
        <path
          d="M 28 124 C 110 124, 130 112, 200 112 C 270 112, 290 122, 360 114 C 430 106, 470 116, 578 112"
          fill="none"
          stroke="#D6C7B2"
          strokeWidth="2"
          strokeDasharray="8 10"
        />

        {/* Left Monster Portal */}
        <g transform="translate(30, 122)">
          <ellipse cx="0" cy="0" rx="18" ry="28" fill="#4C1D95" stroke="#1C1917" strokeWidth="2.5" />
          <ellipse cx="0" cy="0" rx="10" ry="18" fill="#A855F7" opacity="0.85" />
          <circle cx="0" cy="0" r="4" fill="#FEF08A" />
        </g>

        {/* Right QuestVault Castle */}
        <g transform="translate(572, 68)">
          <rect x="6" y="22" width="48" height="58" rx="6" fill="#FFFDF8" stroke="#1C1917" strokeWidth="2.5" />
          <rect x="2" y="12" width="16" height="16" rx="2" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
          <rect x="22" y="12" width="16" height="16" rx="2" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
          <rect x="42" y="12" width="16" height="16" rx="2" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
          <path d="M 20 80 L 20 56 A 10 10 0 0 1 40 56 L 40 80 Z" fill="#92400E" stroke="#1C1917" strokeWidth="2" />
          <polygon points="30,0 44,12 16,12" fill="#EF4444" stroke="#1C1917" strokeWidth="2" />
        </g>

        {/* Cute Vector Monsters Marching Along Path */}
        {activeMonsters.map((pos, idx) => (
          <g key={`m-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
            <ellipse cx="0" cy="14" rx="13" ry="4" fill="#065F46" opacity="0.22" />
            {currentWave.monsterKind === 'slime' ? (
              <path
                d="M -14 10 C -14 -10, 14 -10, 14 10 Z"
                fill={currentWave.accentHex}
                stroke="#1C1917"
                strokeWidth="2"
              />
            ) : currentWave.monsterKind === 'cloud-boo' ? (
              <path
                d="M -13 10 L -13 -4 A 13 13 0 0 1 13 -4 L 13 10 L 7 6 L 0 10 L -7 6 Z"
                fill="#EEF2FF"
                stroke="#1C1917"
                strokeWidth="2"
              />
            ) : currentWave.monsterKind === 'cookie-bot' ? (
              <rect
                x="-13"
                y="-11"
                width="26"
                height="22"
                rx="6"
                fill="#FDBA74"
                stroke="#1C1917"
                strokeWidth="2"
              />
            ) : currentWave.monsterKind === 'star-bat' ? (
              <g>
                <path d="M -20 -4 L -10 2 L -12 -10 Z M 20 -4 L 10 2 L 12 -10 Z" fill="#A855F7" stroke="#1C1917" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="12" fill="#7C3AED" stroke="#1C1917" strokeWidth="2" />
              </g>
            ) : (
              <g>
                <path
                  d="M -15 11 C -15 -11, 15 -11, 15 11 Z"
                  fill="#F472B6"
                  stroke="#1C1917"
                  strokeWidth="2"
                />
                <polygon points="-8,-7 -4,-15 0,-9 4,-15 8,-7" fill="#FACC15" stroke="#1C1917" strokeWidth="1.5" />
              </g>
            )}
            {/* Cute Eyes */}
            <circle cx="-4.5" cy="0" r="2.2" fill="#1C1917" />
            <circle cx="4.5" cy="0" r="2.2" fill="#1C1917" />
            <circle cx="-5.2" cy="-0.8" r="0.8" fill="#FFFFFF" />
            <circle cx="3.8" cy="-0.8" r="0.8" fill="#FFFFFF" />
          </g>
        ))}

        {/* Projectile Beams During Wave Volley */}
        {volleyActive &&
          slots.map((slot, idx) => {
            if (!slot.collectibleId) return null;
            const pad = PAD_COORDS[idx];
            const target = activeMonsters[idx % activeMonsters.length] ?? activeMonsters[0];
            if (!pad || !target) return null;
            const isShiny = Boolean(shinyVault[slot.collectibleId]);
            return (
              <g key={`beam-${idx}`}>
                <line
                  x1={pad.x}
                  y1={pad.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isShiny ? '#F59E0B' : '#3B82F6'}
                  strokeWidth={isShiny ? 4.5 : 3}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
                <circle cx={target.x} cy={target.y} r={isShiny ? 10 : 7} fill={isShiny ? '#FDE047' : '#93C5FD'} opacity="0.85" />
              </g>
            );
          })}

        {/* 6 Interactive Critter Tower Pads */}
        {slots.map((slot, idx) => {
          const pad = PAD_COORDS[idx];
          if (!pad) return null;
          const critter = slot.collectibleId ? getCollectibleById(slot.collectibleId) : undefined;
          const isShiny = Boolean(slot.collectibleId && shinyVault[slot.collectibleId]);
          const isSelected = selectedSlotIndex === idx;

          return (
            <g
              key={`pad-${idx}`}
              transform={`translate(${pad.x}, ${pad.y})`}
              onClick={() => onSelectSlot(idx)}
              style={{ cursor: 'pointer' }}
            >
              {/* Shiny Golden Halo */}
              {isShiny && (
                <circle
                  cx="0"
                  cy="0"
                  r="31"
                  fill="#FEF08A"
                  opacity="0.55"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              )}

              {/* Pad Base */}
              <circle
                cx="0"
                cy="0"
                r="25"
                fill={critter ? critter.bgHex : '#FFFFFF'}
                stroke={isSelected ? '#2563EB' : '#1C1917'}
                strokeWidth={isSelected ? 4 : 2.5}
              />

              {critter ? (
                <>
                  {/* Stylized Critter Emblem Badge */}
                  <circle cx="0" cy="-2" r="14" fill={critter.accentHex} stroke="#1C1917" strokeWidth="1.8" />
                  <circle cx="-4.5" cy="-4" r="2" fill="#FFFFFF" />
                  <circle cx="4.5" cy="-4" r="2" fill="#FFFFFF" />
                  <path d="M -3.5 2 Q 0 5.5 3.5 2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Level Pill */}
                  <rect x="-18" y="14" width="36" height="14" rx="7" fill={isShiny ? '#F59E0B' : '#1C1917'} />
                  <text
                    x="0"
                    y="24"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="900"
                    fill="#FFFFFF"
                    fontFamily="system-ui, sans-serif"
                  >
                    {isShiny ? `✨L${slot.level}` : `Lv.${slot.level}`}
                  </text>
                </>
              ) : (
                <>
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="900"
                    fill="#94A3B8"
                    fontFamily="system-ui, sans-serif"
                  >
                    +
                  </text>
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="800"
                    fill="#64748B"
                    fontFamily="system-ui, sans-serif"
                  >
                    Pad {idx + 1}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

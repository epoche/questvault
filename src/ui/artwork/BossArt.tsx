import React from 'react';
import type { BossId } from '../../core/bossBattleEngine';

interface BossArtProps {
  bossId: BossId;
  size?: number;
  isHit?: boolean;
  isDefeated?: boolean;
  className?: string;
}

export const BossArt: React.FC<BossArtProps> = ({
  bossId,
  size = 132,
  isHit = false,
  isDefeated = false,
  className = '',
}) => {
  const renderEyes = (cx1: number, cx2: number, cy: number, color = '#1C1917') => {
    if (isDefeated) {
      return (
        <g stroke={color} strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d={`M ${cx1 - 5} ${cy - 5} L ${cx1 + 5} ${cy + 5} M ${cx1 + 5} ${cy - 5} L ${cx1 - 5} ${cy + 5}`} />
          <path d={`M ${cx2 - 5} ${cy - 5} L ${cx2 + 5} ${cy + 5} M ${cx2 + 5} ${cy - 5} L ${cx2 - 5} ${cy + 5}`} />
        </g>
      );
    }
    if (isHit) {
      return (
        <g stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d={`M ${cx1 - 6} ${cy - 4} L ${cx1 + 4} ${cy} L ${cx1 - 6} ${cy + 4}`} />
          <path d={`M ${cx2 + 6} ${cy - 4} L ${cx2 - 4} ${cy} L ${cx2 + 6} ${cy + 4}`} />
        </g>
      );
    }
    return (
      <g>
        <circle cx={cx1} cy={cy} r="6.5" fill={color} />
        <circle cx={cx2} cy={cy} r="6.5" fill={color} />
        <circle cx={cx1 - 2} cy={cy - 2} r="2.2" fill="#FFFFFF" />
        <circle cx={cx2 - 2} cy={cy - 2} r="2.2" fill="#FFFFFF" />
        <path d={`M ${cx1 - 7} ${cy - 9} L ${cx1 + 6} ${cy - 5}`} stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${cx2 + 7} ${cy - 9} L ${cx2 - 6} ${cy - 5}`} stroke={color} strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${isHit ? 'scale-95' : ''} transition-transform duration-150 ${className}`}
      aria-hidden="true"
    >
      {/* Ground shadow */}
      <ellipse cx="70" cy="126" rx="44" ry="8" fill="#1C1917" fillOpacity="0.12" />

      {bossId === 'slime-king' && (
        <g>
          {/* Floating memory bubbles */}
          <circle cx="24" cy="46" r="6" fill="#A7F3D0" stroke="#059669" strokeWidth="2" />
          <circle cx="117" cy="52" r="5" fill="#6EE7B7" stroke="#059669" strokeWidth="2" />
          {/* Jelly body */}
          <path
            d="M24 98 C24 58 44 40 70 40 C96 40 116 58 116 98 C116 116 100 122 70 122 C40 122 24 116 24 98 Z"
            fill="#34D399"
            stroke="#065F46"
            strokeWidth="3.5"
          />
          {/* Inner glossy highlight */}
          <path
            d="M38 78 C40 58 54 49 70 49"
            stroke="#ECFDF5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <circle cx="96" cy="96" r="7" fill="#A7F3D0" fillOpacity="0.65" />
          <circle cx="44" cy="102" r="5" fill="#A7F3D0" fillOpacity="0.65" />
          {/* Golden King Crown */}
          <path
            d="M46 42 L50 18 L62 30 L70 14 L78 30 L90 18 L94 42 Z"
            fill="#FBBF24"
            stroke="#92400E"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="70" cy="31" r="4" fill="#EF4444" />
          <circle cx="56" cy="34" r="2.8" fill="#38BDF8" />
          <circle cx="84" cy="34" r="2.8" fill="#38BDF8" />
          {/* Face */}
          {renderEyes(54, 86, 78, '#064E3B')}
          <ellipse cx="42" cy="88" rx="6" ry="3.5" fill="#FDA4AF" fillOpacity="0.7" />
          <ellipse cx="98" cy="88" rx="6" ry="3.5" fill="#FDA4AF" fillOpacity="0.7" />
          <path
            d={isDefeated ? 'M58 97 Q70 90 82 97' : 'M57 93 Q70 104 83 93'}
            stroke="#064E3B"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {bossId === 'typo-kraken' && (
        <g>
          {/* Tentacles */}
          <path
            d="M32 95 C14 96 14 118 28 118 C36 118 39 109 42 104"
            fill="#A78BFA"
            stroke="#4C1D95"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M108 95 C126 96 126 118 112 118 C104 118 101 109 98 104"
            fill="#A78BFA"
            stroke="#4C1D95"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M48 104 C44 122 56 124 62 110"
            fill="#8B5CF6"
            stroke="#4C1D95"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M92 104 C96 122 84 124 78 110"
            fill="#8B5CF6"
            stroke="#4C1D95"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Giant Red Pencil Wand */}
          <g transform="rotate(-18 112 52)">
            <rect x="106" y="28" width="12" height="44" rx="3" fill="#FDE047" stroke="#92400E" strokeWidth="2.5" />
            <rect x="106" y="22" width="12" height="9" rx="2" fill="#FDA4AF" stroke="#9D174D" strokeWidth="2.5" />
            <polygon points="106,72 118,72 112,84" fill="#FDBA74" stroke="#92400E" strokeWidth="2.5" />
            <polygon points="110,79 114,79 112,84" fill="#1C1917" />
          </g>
          {/* Head */}
          <path
            d="M34 72 C34 36 50 22 70 22 C90 22 106 36 106 72 C106 98 92 108 70 108 C48 108 34 98 34 72 Z"
            fill="#8B5CF6"
            stroke="#4C1D95"
            strokeWidth="3.5"
          />
          {/* Spots */}
          <circle cx="48" cy="40" r="5" fill="#C4B5FD" />
          <circle cx="90" cy="44" r="6" fill="#C4B5FD" />
          <circle cx="70" cy="32" r="4" fill="#DDD6FE" />
          {/* Face */}
          {renderEyes(54, 86, 68, '#1E1B4B')}
          <ellipse cx="42" cy="79" rx="5.5" ry="3.2" fill="#F9A8D4" fillOpacity="0.8" />
          <ellipse cx="98" cy="79" rx="5.5" ry="3.2" fill="#F9A8D4" fillOpacity="0.8" />
          {/* Squiggly typo wave mouth */}
          <path
            d={isDefeated ? 'M58 88 Q70 81 82 88' : 'M54 85 Q62 93 70 85 Q78 93 86 85'}
            stroke="#1E1B4B"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {bossId === 'chaos-dragon' && (
        <g>
          {/* Back clockwork gear halo */}
          <circle cx="70" cy="64" r="40" fill="none" stroke="#FDBA74" strokeWidth="6" strokeDasharray="9 7" />
          {/* Wings */}
          <path
            d="M36 68 L12 46 L22 78 L16 94 L42 88 Z"
            fill="#F97316"
            stroke="#7C2D12"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M104 68 L128 46 L118 78 L124 94 L98 88 Z"
            fill="#F97316"
            stroke="#7C2D12"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Horns */}
          <path d="M48 36 L38 14 L58 30 Z" fill="#FDE047" stroke="#7C2D12" strokeWidth="3" strokeLinejoin="round" />
          <path d="M92 36 L102 14 L82 30 Z" fill="#FDE047" stroke="#7C2D12" strokeWidth="3" strokeLinejoin="round" />
          {/* Body & Head */}
          <rect x="34" y="32" width="72" height="84" rx="30" fill="#FB923C" stroke="#7C2D12" strokeWidth="3.5" />
          {/* Belly shield */}
          <path
            d="M48 84 C48 76 92 76 92 84 L88 112 C88 116 52 116 52 112 Z"
            fill="#FEF3C7"
            stroke="#92400E"
            strokeWidth="2.5"
          />
          <line x1="54" y1="93" x2="86" y2="93" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="56" y1="103" x2="84" y2="103" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          {/* Face */}
          {renderEyes(54, 86, 58, '#431407')}
          {/* Cute fangs */}
          <path d="M54 71 Q70 79 86 71" stroke="#431407" strokeWidth="3" strokeLinecap="round" fill="none" />
          {!isDefeated && (
            <>
              <polygon points="58,73 63,74 60,80" fill="#FFFFFF" stroke="#431407" strokeWidth="1.5" />
              <polygon points="82,73 77,74 80,80" fill="#FFFFFF" stroke="#431407" strokeWidth="1.5" />
            </>
          )}
        </g>
      )}

      {bossId === 'ink-owl' && (
        <g>
          {/* Floating sparkle stars */}
          <circle cx="22" cy="36" r="4" fill="#FDE047" />
          <circle cx="118" cy="40" r="3.5" fill="#93C5FD" />
          {/* Wizard Hat */}
          <path
            d="M36 42 L70 10 L104 42 Z"
            fill="#1D4ED8"
            stroke="#1E3A8A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <ellipse cx="70" cy="42" rx="40" ry="7" fill="#2563EB" stroke="#1E3A8A" strokeWidth="3" />
          <circle cx="70" cy="27" r="4.5" fill="#FDE047" />
          {/* Wings */}
          <path
            d="M34 62 C16 74 18 102 36 106 Z"
            fill="#3B82F6"
            stroke="#1E3A8A"
            strokeWidth="3"
          />
          <path
            d="M106 62 C124 74 122 102 104 106 Z"
            fill="#3B82F6"
            stroke="#1E3A8A"
            strokeWidth="3"
          />
          {/* Round Owl Body */}
          <ellipse cx="70" cy="80" rx="38" ry="38" fill="#1E40AF" stroke="#172554" strokeWidth="3.5" />
          {/* Feather belly */}
          <ellipse cx="70" cy="94" rx="24" ry="20" fill="#DBEAFE" />
          <path d="M58 92 Q62 97 66 92 M74 92 Q78 97 82 92 M66 102 Q70 107 74 102" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Spectacle rings */}
          <circle cx="55" cy="68" r="13" fill="#EFF6FF" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="85" cy="68" r="13" fill="#EFF6FF" stroke="#F59E0B" strokeWidth="3" />
          <line x1="68" y1="68" x2="72" y2="68" stroke="#F59E0B" strokeWidth="3" />
          {renderEyes(55, 85, 68, '#172554')}
          {/* Beak */}
          <polygon points="65,75 75,75 70,84" fill="#F59E0B" stroke="#92400E" strokeWidth="2" strokeLinejoin="round" />
        </g>
      )}

      {/* Defeated Dizzy Stars */}
      {isDefeated && (
        <g fill="#FBBF24" stroke="#B45309" strokeWidth="1.5">
          <polygon points="36,24 39,30 45,31 40,35 41,41 36,38 31,41 32,35 27,31 33,30" />
          <polygon points="104,24 107,30 113,31 108,35 109,41 104,38 99,41 100,35 95,31 101,30" />
        </g>
      )}
    </svg>
  );
};

import React from 'react';
import type { CafeFoodId } from '../../core/cafeEngine';

interface CafeFoodArtProps {
  foodId: CafeFoodId;
  size?: number;
  className?: string;
}

export const CafeFoodArt: React.FC<CafeFoodArtProps> = ({
  foodId,
  size = 44,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {foodId === 'boba' && (
        <g>
          {/* Wide straw */}
          <rect x="28" y="4" width="8" height="20" rx="2.5" fill="#F472B6" stroke="#1C1917" strokeWidth="2.4" />
          {/* Cup body */}
          <path d="M 16 22 L 48 22 L 44 56 Q 43.5 59 40 59 L 24 59 Q 20.5 59 20 56 Z" fill="#FDE68A" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          {/* Brown sugar tiger stripes */}
          <path d="M 18 36 Q 26 42 34 38 Q 40 35 46 40 L 44 56 Q 43.5 59 40 59 L 24 59 Q 20.5 59 20 56 Z" fill="#D97706" opacity="0.45" />
          {/* Lid */}
          <rect x="13" y="17" width="38" height="7" rx="3.5" fill="#FFFBEB" stroke="#1C1917" strokeWidth="2.4" />
          {/* Tapioca pearls */}
          <circle cx="25" cy="52" r="3.2" fill="#292524" />
          <circle cx="32" cy="54" r="3.2" fill="#292524" />
          <circle cx="39" cy="52" r="3.2" fill="#292524" />
          <circle cx="29" cy="47" r="2.8" fill="#292524" />
          <circle cx="36" cy="47" r="2.8" fill="#292524" />
          {/* Kawaii eyes */}
          <circle cx="26" cy="34" r="2.2" fill="#1C1917" />
          <circle cx="38" cy="34" r="2.2" fill="#1C1917" />
          <path d="M 29.5 37 Q 32 40 34.5 37" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}

      {foodId === 'mochi' && (
        <g>
          {/* Soft pink mochi */}
          <ellipse cx="32" cy="40" rx="22" ry="17" fill="#FBCFE8" stroke="#1C1917" strokeWidth="2.6" />
          {/* Fresh strawberry perched on top */}
          <path d="M 23 26 Q 32 10 41 26 Q 32 34 23 26 Z" fill="#E11D48" stroke="#1C1917" strokeWidth="2.4" strokeLinejoin="round" />
          {/* Berry leaf */}
          <path d="M 26 17 L 32 21 L 38 17 L 35 13 L 32 16 L 29 13 Z" fill="#16A34A" stroke="#1C1917" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="29" cy="24" r="1.1" fill="#FEF08A" />
          <circle cx="35" cy="24" r="1.1" fill="#FEF08A" />
          {/* Cute face */}
          <circle cx="24" cy="41" r="2.4" fill="#1C1917" />
          <circle cx="40" cy="41" r="2.4" fill="#1C1917" />
          <ellipse cx="19" cy="45" rx="3" ry="1.8" fill="#F472B6" opacity="0.7" />
          <ellipse cx="45" cy="45" rx="3" ry="1.8" fill="#F472B6" opacity="0.7" />
          <path d="M 29 44 Q 32 47 35 44" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}

      {foodId === 'pudding' && (
        <g>
          {/* Plate */}
          <ellipse cx="32" cy="54" rx="25" ry="6" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.4" />
          {/* Custard dome */}
          <path d="M 14 52 L 19 24 Q 20 18 32 18 Q 44 18 45 24 L 50 52 Z" fill="#FDE047" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          {/* Glossy caramel cap */}
          <path d="M 19 24 Q 20 17 32 17 Q 44 17 45 24 L 46 30 Q 42 35 38 30 Q 34 36 30 30 Q 25 35 20 30 Z" fill="#92400E" stroke="#1C1917" strokeWidth="2.4" strokeLinejoin="round" />
          {/* Cherry on top */}
          <circle cx="32" cy="14" r="5" fill="#EF4444" stroke="#1C1917" strokeWidth="2.2" />
          {/* Face */}
          <circle cx="25" cy="41" r="2.3" fill="#1C1917" />
          <circle cx="39" cy="41" r="2.3" fill="#1C1917" />
          <path d="M 29.5 44 Q 32 47 34.5 44" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}

      {foodId === 'souffle' && (
        <g>
          <ellipse cx="32" cy="55" rx="25" ry="5.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.4" />
          {/* Bottom fluffy pancake */}
          <rect x="13" y="38" width="38" height="15" rx="7.5" fill="#FDBA74" stroke="#1C1917" strokeWidth="2.5" />
          {/* Top fluffy pancake */}
          <rect x="16" y="24" width="32" height="16" rx="8" fill="#FED7AA" stroke="#1C1917" strokeWidth="2.5" />
          {/* Melting butter pat */}
          <rect x="26" y="17" width="12" height="8" rx="2.5" fill="#FEF08A" stroke="#1C1917" strokeWidth="2.2" />
          {/* Syrup drip */}
          <path d="M 22 25 Q 25 33 28 25" fill="#B45309" />
          {/* Happy eyes */}
          <path d="M 23 33 Q 25.5 30 28 33" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 36 33 Q 38.5 30 41 33" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 30 35 Q 32 37.5 34 35" stroke="#1C1917" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        </g>
      )}

      {foodId === 'matcha' && (
        <g>
          {/* Roll cake cylinder */}
          <rect x="12" y="18" width="40" height="34" rx="14" fill="#4ADE80" stroke="#1C1917" strokeWidth="2.6" />
          {/* Cream swirl center */}
          <circle cx="32" cy="35" r="12" fill="#FEFCE8" stroke="#1C1917" strokeWidth="2.2" />
          <path d="M 32 28 A 7 7 0 1 1 25 35 A 4.5 4.5 0 1 1 32 39" fill="none" stroke="#15803D" strokeWidth="2.4" strokeLinecap="round" />
          {/* Matcha dusting leaf */}
          <ellipse cx="44" cy="17" rx="5" ry="3" transform="rotate(-20 44 17)" fill="#16A34A" stroke="#1C1917" strokeWidth="2" />
          {/* Cute eyes */}
          <circle cx="27" cy="34" r="2" fill="#1C1917" />
          <circle cx="37" cy="34" r="2" fill="#1C1917" />
        </g>
      )}

      {foodId === 'toast' && (
        <g>
          {/* Golden thick honey toast cube */}
          <rect x="13" y="23" width="38" height="32" rx="7" fill="#F59E0B" stroke="#1C1917" strokeWidth="2.6" />
          <rect x="18" y="28" width="28" height="22" rx="4" fill="#FEF3C7" />
          {/* Ice cream scoop on top */}
          <circle cx="32" cy="20" r="10" fill="#FDF2F8" stroke="#1C1917" strokeWidth="2.4" />
          {/* Berry on scoop */}
          <circle cx="37" cy="12" r="4" fill="#E11D48" stroke="#1C1917" strokeWidth="2" />
          {/* Honey drizzle */}
          <path d="M 22 28 Q 25 36 28 28 Q 32 34 36 28" fill="none" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" />
          {/* Cute face */}
          <circle cx="26" cy="40" r="2.2" fill="#1C1917" />
          <circle cx="38" cy="40" r="2.2" fill="#1C1917" />
          <path d="M 29.5 43 Q 32 46 34.5 43" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}
    </svg>
  );
};

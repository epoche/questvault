import React, { useId } from 'react';
import type { StarSeaCatchId } from '../../core/fishingEngine';

interface FishingArtProps {
  speciesId: StarSeaCatchId;
  size?: number;
  className?: string;
}

/**
 * 14 original kawaii Blooket-style Star Sea creature SVGs for Fishing Frenzy (星海釣魚).
 * Strictly offline inline SVG, square 64x64 viewBox.
 */
export const FishingArt: React.FC<FishingArtProps> = ({
  speciesId,
  size = 64,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const chromaGradId = `chromaSeaGrad-${uid}`;
  const renderCreature = () => {
    switch (speciesId) {
      case 'star-clownfish':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#FFF7ED" />
            <path d="M46 32 L58 22 L56 42 Z" fill="#F97316" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <ellipse cx="29" cy="33" rx="18" ry="13" fill="#FB923C" stroke="#1C1917" strokeWidth="2.5" />
            <path d="M27 20 C24 28 24 38 27 46 L33 45 C30 37 30 28 33 21 Z" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
            <circle cx="19" cy="30" r="2.6" fill="#1C1917" />
            <circle cx="18.2" cy="29.2" r="0.9" fill="#FFFFFF" />
            <path d="M16 36 Q19 38 22 36" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 14 L14 10 L16 14 L20 16 L16 18 L14 22 L12 18 L8 16 Z" fill="#FACC15" />
          </>
        );
      case 'boba-jelly':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#FDF2F8" />
            <path d="M18 35 Q18 14 32 14 Q46 14 46 35 Z" fill="#F472B6" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M22 35 Q20 45 23 52 M29 35 Q31 46 28 54 M36 35 Q34 46 37 54 M42 35 Q44 45 41 52" fill="none" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
            <circle cx="26" cy="27" r="2.2" fill="#1C1917" />
            <circle cx="38" cy="27" r="2.2" fill="#1C1917" />
            <path d="M29 30 Q32 33 35 30" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
            <circle cx="25" cy="19" r="2.5" fill="#451A03" opacity="0.65" />
            <circle cx="34" cy="18" r="2.5" fill="#451A03" opacity="0.65" />
            <circle cx="40" cy="22" r="2.2" fill="#451A03" opacity="0.65" />
          </>
        );
      case 'mochi-puffer':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#FFFBEB" />
            <path d="M32 10 L35 16 M48 16 L44 21 M54 32 L48 32 M48 48 L44 43 M32 54 L32 48 M16 48 L20 43 M10 32 L16 32 M16 16 L20 21" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="32" r="17" fill="#FDE68A" stroke="#1C1917" strokeWidth="2.5" />
            <ellipse cx="32" cy="39" rx="12" ry="7" fill="#FFFBEB" />
            <circle cx="25" cy="29" r="2.5" fill="#1C1917" />
            <circle cx="39" cy="29" r="2.5" fill="#1C1917" />
            <circle cx="21" cy="34" r="3" fill="#FDA4AF" opacity="0.7" />
            <circle cx="43" cy="34" r="3" fill="#FDA4AF" opacity="0.7" />
            <ellipse cx="32" cy="35" rx="2.5" ry="2" fill="#F43F5E" />
          </>
        );
      case 'lantern-shrimp':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#FFF1F2" />
            <path d="M44 46 C54 40 54 24 42 18 C32 13 18 18 16 30 C14 39 22 44 30 42 C25 38 25 30 31 28 C37 26 42 32 39 39 Z" fill="#FB7185" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="23" cy="26" r="2.4" fill="#1C1917" />
            <circle cx="15" cy="18" r="4" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
            <path d="M18 22 Q16 18 15 18" stroke="#1C1917" strokeWidth="1.8" fill="none" />
          </>
        );
      case 'moon-seahorse':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#F0F9FF" />
            <path d="M22 22 C22 14 34 12 38 19 C42 26 35 32 38 40 C41 48 33 54 27 51 C23 49 24 44 28 44 C31 44 31 47 29 48" fill="#38BDF8" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 21 L14 23 L15 26 L23 26 Z" fill="#38BDF8" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="29" cy="20" r="2.3" fill="#1C1917" />
            <path d="M39 27 L46 24 L45 33 L38 32 Z" fill="#BAE6FD" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round" />
            <path d="M48 13 A6 6 0 1 0 54 19 A4.5 4.5 0 1 1 48 13 Z" fill="#FACC15" />
          </>
        );
      case 'coral-turtle':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#ECFDF5" />
            <ellipse cx="18" cy="38" rx="7" ry="4" fill="#34D399" stroke="#1C1917" strokeWidth="2" />
            <ellipse cx="46" cy="38" rx="7" ry="4" fill="#34D399" stroke="#1C1917" strokeWidth="2" />
            <path d="M18 38 C18 20 46 20 46 38 Z" fill="#10B981" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M27 25 L37 25 L41 34 L23 34 Z" fill="#059669" opacity="0.55" />
            <circle cx="51" cy="32" r="6.5" fill="#6EE7B7" stroke="#1C1917" strokeWidth="2.3" />
            <circle cx="53" cy="30.5" r="1.9" fill="#1C1917" />
            <path d="M29 19 L27 12 M32 18 L32 10 M35 19 L37 13" stroke="#FB7185" strokeWidth="2.8" strokeLinecap="round" />
          </>
        );
      case 'crystal-octopus':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#F5F3FF" />
            <path d="M20 40 Q14 48 18 53 M27 42 Q24 51 28 54 M37 42 Q40 51 36 54 M44 40 Q50 48 46 53" fill="none" stroke="#8B5CF6" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="32" cy="28" r="15" fill="#A78BFA" stroke="#1C1917" strokeWidth="2.5" />
            <polygon points="32,12 36,18 32,22 28,18" fill="#E0E7FF" stroke="#4C1D95" strokeWidth="1.5" />
            <circle cx="26" cy="29" r="2.5" fill="#1C1917" />
            <circle cx="38" cy="29" r="2.5" fill="#1C1917" />
            <path d="M29 34 Q32 37 35 34" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'prism-ray':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#EFF6FF" />
            <path d="M32 14 L54 32 L32 46 L10 32 Z" fill="#60A5FA" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M32 46 Q35 53 31 58" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
            <polygon points="32,22 40,31 32,38 24,31" fill="#DBEAFE" opacity="0.8" />
            <circle cx="26" cy="29" r="2.2" fill="#1C1917" />
            <circle cx="38" cy="29" r="2.2" fill="#1C1917" />
            <path d="M30 33 Q32 35 34 33" fill="none" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
          </>
        );
      case 'aurora-dolphin':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#ECFEFF" />
            <path d="M12 36 C16 20 34 14 46 24 C50 28 53 34 55 40 L48 39 C44 33 36 32 28 36 C22 39 16 40 12 36 Z" fill="#22D3EE" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M30 19 L34 11 L38 20 Z" fill="#06B6D4" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="22" cy="28" r="2.3" fill="#1C1917" />
            <path d="M14 15 Q32 8 50 15" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          </>
        );
      case 'comet-koi':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#FEF3C7" />
            <path d="M44 32 L57 20 L54 32 L57 44 Z" fill="#F59E0B" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
            <ellipse cx="29" cy="32" rx="17" ry="12" fill="#FBBF24" stroke="#1C1917" strokeWidth="2.5" />
            <circle cx="30" cy="27" r="5" fill="#EF4444" opacity="0.85" />
            <circle cx="20" cy="30" r="2.5" fill="#1C1917" />
            <path d="M15 35 Q12 38 10 37" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            <path d="M46 13 L48 9 L50 13 L54 15 L50 17 L48 21 L46 17 L42 15 Z" fill="#F59E0B" />
          </>
        );
      case 'nebula-narwhal':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#EDE9FE" />
            <polygon points="18,29 5,22 17,34" fill="#FDE047" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round" />
            <ellipse cx="35" cy="34" rx="18" ry="13" fill="#8B5CF6" stroke="#1C1917" strokeWidth="2.5" />
            <path d="M51 34 L59 26 L57 41 Z" fill="#7C3AED" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="25" cy="32" r="2.4" fill="#1C1917" />
            <circle cx="40" cy="27" r="2" fill="#FDE68A" />
            <circle cx="45" cy="34" r="1.5" fill="#FDE68A" />
          </>
        );
      case 'treasure-clam':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#FEF3C7" />
            <path d="M14 34 C14 16 50 16 50 34 Z" fill="#F472B6" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M12 36 C16 50 48 50 52 36 Z" fill="#EC4899" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="32" cy="34" r="8.5" fill="#FFFBEB" stroke="#D97706" strokeWidth="2.2" />
            <circle cx="29.5" cy="31.5" r="2.5" fill="#FFFFFF" />
            <path d="M48 14 L50 10 L52 14 L56 16 L52 18 L50 22 L48 18 L44 16 Z" fill="#F59E0B" />
          </>
        );
      case 'celestial-whale':
        return (
          <>
            <rect width="64" height="64" rx="16" fill="#DBEAFE" />
            <path d="M10 36 C10 20 34 18 44 28 C48 32 52 28 56 23 L54 36 C50 44 38 48 24 47 C15 46 10 42 10 36 Z" fill="#2563EB" stroke="#1C1917" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M14 41 Q26 45 38 41" fill="none" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="33" r="2.5" fill="#1C1917" />
            <circle cx="32" cy="27" r="2" fill="#FDE047" />
            <circle cx="39" cy="32" r="1.5" fill="#FDE047" />
            <path d="M26 16 Q24 10 20 12 M26 16 Q29 10 33 12" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'chroma-leviathan':
        return (
          <>
            <defs>
              <linearGradient id={chromaGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="#FAE8FF" />
            <path d="M12 40 C14 22 28 16 38 22 C46 27 42 39 52 38 C56 38 57 32 54 28" fill="none" stroke={`url(#${chromaGradId})`} strokeWidth="11" strokeLinecap="round" />
            <path d="M12 40 C14 22 28 16 38 22 C46 27 42 39 52 38 C56 38 57 32 54 28" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22" cy="24" r="8" fill={`url(#${chromaGradId})`} stroke="#1C1917" strokeWidth="2.2" />
            <polygon points="18,16 21,9 24,16" fill="#FACC15" stroke="#1C1917" strokeWidth="1.5" />
            <circle cx="20" cy="23" r="2" fill="#FFFFFF" />
            <circle cx="20" cy="23" r="1" fill="#1C1917" />
            <path d="M48 13 L50 9 L52 13 L56 15 L52 17 L50 21 L48 17 L44 15 Z" fill="#FACC15" />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`shrink-0 rounded-2xl ${className}`}
      role="img"
      aria-label={speciesId}
    >
      {renderCreature()}
    </svg>
  );
};

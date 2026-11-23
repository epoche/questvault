import React from 'react';
import { getCollectibleById } from '../../core/packs';
import { PHASE2D_ENVELOPE_THEMES } from '../../core/packsPhase2D';
import type { PackId } from '../../core/types';
import { renderExtraCollectible } from './extraCollectibles';
import { renderPhase1Collectible } from './phase1Collectibles';
import { renderPhase2Collectible } from './phase2Collectibles';
import { renderPhase2DCollectible } from './phase2DCollectibles';

interface CollectibleArtProps {
  id: string;
  size?: number;
  silhouette?: boolean;
  shiny?: boolean;
  className?: string;
}

function Eyes({
  y = 54,
  spread = 15,
  happy = false,
  eyeColor = '#1C1917',
}: {
  y?: number;
  spread?: number;
  happy?: boolean;
  eyeColor?: string;
}) {
  if (happy) {
    return (
      <g stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d={`M ${50 - spread - 5} ${y} Q ${50 - spread} ${y - 6} ${50 - spread + 5} ${y}`} />
        <path d={`M ${50 + spread - 5} ${y} Q ${50 + spread} ${y - 6} ${50 + spread + 5} ${y}`} />
      </g>
    );
  }
  return (
    <g>
      <circle cx={50 - spread} cy={y} r="5.2" fill={eyeColor} />
      <circle cx={50 - spread + 1.8} cy={y - 1.8} r="1.8" fill="#FFFFFF" />
      <circle cx={50 + spread} cy={y} r="5.2" fill={eyeColor} />
      <circle cx={50 + spread + 1.8} cy={y - 1.8} r="1.8" fill="#FFFFFF" />
    </g>
  );
}

function Cheeks({ y = 63, spread = 23, color = '#FDA4AF' }: { y?: number; spread?: number; color?: string }) {
  return (
    <g opacity="0.72">
      <ellipse cx={50 - spread} cy={y} rx="5.5" ry="3.2" fill={color} />
      <ellipse cx={50 + spread} cy={y} rx="5.5" ry="3.2" fill={color} />
    </g>
  );
}

function renderCharacter(id: string): React.ReactNode {
  switch (id) {
    // ────────── CRITTER PACK ──────────
    case 'critter-sprout-bunny':
      return (
        <g>
          {/* Ears */}
          <rect x="27" y="10" width="14" height="34" rx="7" fill="#FAF7F2" stroke="#1C1917" strokeWidth="3.2" />
          <rect x="31" y="15" width="6" height="22" rx="3" fill="#FBCFE8" />
          <rect x="59" y="10" width="14" height="34" rx="7" fill="#FAF7F2" stroke="#1C1917" strokeWidth="3.2" />
          <rect x="63" y="15" width="6" height="22" rx="3" fill="#FBCFE8" />
          {/* Square Blooket-style head */}
          <rect x="18" y="34" width="64" height="54" rx="18" fill="#FAF7F2" stroke="#1C1917" strokeWidth="3.4" />
          {/* Lucky clover leaf on head */}
          <circle cx="50" cy="31" r="5.5" fill="#65A30D" stroke="#1C1917" strokeWidth="2.4" />
          <circle cx="44" cy="35" r="5" fill="#84CC16" stroke="#1C1917" strokeWidth="2.4" />
          <circle cx="56" cy="35" r="5" fill="#84CC16" stroke="#1C1917" strokeWidth="2.4" />
          <Eyes y={58} />
          <Cheeks y={66} />
          <path d="M 46 64 Q 50 68 54 64" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="50" cy="61" rx="3.2" ry="2.2" fill="#F472B6" />
        </g>
      );

    case 'critter-acorn-hedgehog':
      return (
        <g>
          {/* Spikes */}
          <path
            d="M 16 58 L 10 44 L 22 38 L 22 22 L 38 26 L 50 14 L 62 26 L 78 22 L 78 38 L 90 44 L 84 58 Z"
            fill="#92400E"
            stroke="#1C1917"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <rect x="20" y="36" width="60" height="50" rx="18" fill="#FDE68A" stroke="#1C1917" strokeWidth="3.4" />
          <circle cx="23" cy="40" r="6" fill="#F59E0B" stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="77" cy="40" r="6" fill="#F59E0B" stroke="#1C1917" strokeWidth="2.8" />
          <Eyes y={57} />
          <Cheeks y={66} color="#FDBA74" />
          <circle cx="50" cy="63" r="4.2" fill="#1C1917" />
          <path d="M 45 71 Q 50 75 55 71" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'critter-otter-mage':
      return (
        <g>
          {/* Body/face */}
          <rect x="19" y="36" width="62" height="52" rx="18" fill="#B45309" stroke="#1C1917" strokeWidth="3.4" />
          <ellipse cx="50" cy="68" rx="22" ry="15" fill="#FDE68A" />
          {/* Wizard Hat */}
          <path d="M 22 40 L 50 9 L 78 40 Z" fill="#0F766E" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <ellipse cx="50" cy="40" rx="34" ry="7" fill="#14B8A6" stroke="#1C1917" strokeWidth="3.2" />
          <polygon points="50,20 52.5,26 59,26 53.8,30 55.8,36 50,32.5 44.2,36 46.2,30 41,26 47.5,26" fill="#FDE047" />
          <Eyes y={58} />
          <ellipse cx="50" cy="64" rx="5" ry="3.5" fill="#1C1917" />
          <path d="M 44 71 Q 50 75 56 71" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'critter-red-panda':
      return (
        <g>
          <polygon points="20,42 24,18 42,32" fill="#EA580C" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="80,42 76,18 58,32" fill="#EA580C" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <rect x="18" y="30" width="64" height="56" rx="18" fill="#EA580C" stroke="#1C1917" strokeWidth="3.4" />
          {/* Cream eyebrows & muzzle */}
          <ellipse cx="35" cy="46" rx="6" ry="3.5" fill="#FFF7ED" />
          <ellipse cx="65" cy="46" rx="6" ry="3.5" fill="#FFF7ED" />
          <ellipse cx="50" cy="68" rx="18" ry="13" fill="#FFF7ED" />
          {/* Cozy scarf */}
          <rect x="22" y="76" width="56" height="12" rx="6" fill="#DC2626" stroke="#1C1917" strokeWidth="2.8" />
          <rect x="34" y="76" width="8" height="12" fill="#FDE047" />
          <rect x="58" y="76" width="8" height="12" fill="#FDE047" />
          <Eyes y={56} />
          <ellipse cx="50" cy="63" rx="4.5" ry="3.2" fill="#1C1917" />
        </g>
      );

    case 'critter-crystal-fox':
      return (
        <g>
          {/* Tall fox ears */}
          <polygon points="18,46 24,12 44,32" fill="#3B82F6" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="24,38 27,20 38,32" fill="#BAE6FD" />
          <polygon points="82,46 76,12 56,32" fill="#3B82F6" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="76,38 73,20 62,32" fill="#BAE6FD" />
          <rect x="18" y="32" width="64" height="54" rx="18" fill="#60A5FA" stroke="#1C1917" strokeWidth="3.4" />
          {/* White fox cheek sweep */}
          <path d="M 19 64 Q 34 56 50 72 Q 66 56 81 64 L 81 74 Q 81 85 64 85 L 36 85 Q 19 85 19 74 Z" fill="#EFF6FF" />
          {/* Forehead crystal */}
          <polygon points="50,37 56,45 50,53 44,45" fill="#E0F2FE" stroke="#1D4ED8" strokeWidth="2.4" />
          <Eyes y={58} />
          <polygon points="46,66 54,66 50,71" fill="#1C1917" />
        </g>
      );

    case 'critter-moon-owl':
      return (
        <g>
          {/* Ear tufts */}
          <polygon points="20,38 18,18 36,28" fill="#6D28D9" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="80,38 82,18 64,28" fill="#6D28D9" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <rect x="18" y="26" width="64" height="60" rx="20" fill="#7C3AED" stroke="#1C1917" strokeWidth="3.4" />
          {/* Facial disc */}
          <circle cx="37" cy="54" r="15" fill="#EDE9FE" stroke="#1C1917" strokeWidth="2.6" />
          <circle cx="63" cy="54" r="15" fill="#EDE9FE" stroke="#1C1917" strokeWidth="2.6" />
          {/* Crescent moon */}
          <path d="M 52 33 A 7 7 0 1 0 52 44 A 5 5 0 1 1 52 33 Z" fill="#FDE047" />
          <Eyes y={54} spread={13} />
          <polygon points="45,62 55,62 50,70" fill="#F59E0B" stroke="#1C1917" strokeWidth="2.4" strokeLinejoin="round" />
        </g>
      );

    case 'critter-sun-phoenix':
      return (
        <g>
          {/* Flame crest */}
          <path
            d="M 32 32 Q 34 14 44 22 Q 50 6 56 22 Q 66 14 68 32 Z"
            fill="#F59E0B"
            stroke="#1C1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Wings */}
          <path d="M 18 52 L 6 42 L 10 64 L 18 68 Z" fill="#EF4444" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 82 52 L 94 42 L 90 64 L 82 68 Z" fill="#EF4444" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="30" width="64" height="56" rx="18" fill="#FBBF24" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 24 68 Q 50 56 76 68 L 76 80 Q 76 85 64 85 L 36 85 Q 24 85 24 80 Z" fill="#FEF3C7" />
          <Eyes y={54} />
          <polygon points="44,61 56,61 50,70" fill="#EA580C" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <circle cx="50" cy="40" r="4" fill="#FFFBEB" />
        </g>
      );

    case 'critter-chroma-dragon':
      return (
        <g>
          <defs>
            <linearGradient id="chromaDragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="35%" stopColor="#A78BFA" />
              <stop offset="70%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
          {/* Dragon horns */}
          <path d="M 28 32 L 18 12 L 38 26 Z" fill="#FDE047" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 72 32 L 82 12 L 62 26 Z" fill="#FDE047" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          {/* Little wings */}
          <path d="M 18 52 L 5 38 L 12 66 Z" fill="#38BDF8" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 82 52 L 95 38 L 88 66 Z" fill="#F472B6" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="28" width="64" height="58" rx="18" fill="url(#chromaDragonGrad)" stroke="#1C1917" strokeWidth="3.4" />
          <ellipse cx="50" cy="72" rx="22" ry="11" fill="#FFFFFF" opacity="0.88" />
          <Eyes y={54} />
          <circle cx="44" cy="66" r="2.2" fill="#1C1917" />
          <circle cx="56" cy="66" r="2.2" fill="#1C1917" />
          <path d="M 42 74 Q 50 79 58 74" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <polygon points="50,35 53,41 59,41 54,45 56,51 50,47 44,51 46,45 41,41 47,41" fill="#FFFFFF" />
        </g>
      );

    // ────────── SWEET PACK ──────────
    case 'sweet-honey-toast':
      return (
        <g>
          <path
            d="M 20 38 C 14 22 32 16 50 18 C 68 16 86 22 80 38 L 80 80 C 80 85 75 88 68 88 L 32 88 C 25 88 20 85 20 80 Z"
            fill="#B45309"
            stroke="#1C1917"
            strokeWidth="3.4"
          />
          <path
            d="M 26 40 C 22 28 36 24 50 25 C 64 24 78 28 74 40 L 74 78 C 74 81 71 82 66 82 L 34 82 C 29 82 26 81 26 78 Z"
            fill="#FEF3C7"
          />
          {/* Melted butter pat */}
          <rect x="40" y="31" width="20" height="14" rx="4" fill="#FACC15" stroke="#1C1917" strokeWidth="2.6" transform="rotate(-6 50 38)" />
          <Eyes y={59} happy />
          <Cheeks y={67} />
          <path d="M 45 66 Q 50 71 55 66" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'sweet-matcha-mochi':
      return (
        <g>
          <rect x="16" y="34" width="68" height="52" rx="24" fill="#86EFAC" stroke="#1C1917" strokeWidth="3.4" />
          {/* Matcha leaf */}
          <path d="M 50 34 Q 58 18 70 24 Q 62 36 50 34 Z" fill="#16A34A" stroke="#1C1917" strokeWidth="2.6" />
          <Eyes y={58} />
          <Cheeks y={66} />
          <path d="M 46 65 Q 50 69 54 65" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'sweet-boba-bear':
      return (
        <g>
          {/* Wide boba straw */}
          <rect x="44" y="8" width="12" height="24" rx="3" fill="#EC4899" stroke="#1C1917" strokeWidth="3" />
          {/* Bear ears on lid */}
          <circle cx="28" cy="30" r="8" fill="#D97706" stroke="#1C1917" strokeWidth="3" />
          <circle cx="72" cy="30" r="8" fill="#D97706" stroke="#1C1917" strokeWidth="3" />
          {/* Cup body */}
          <path d="M 22 32 L 78 32 L 72 86 C 72 88 68 89 50 89 C 32 89 28 88 28 86 Z" fill="#FDE68A" stroke="#1C1917" strokeWidth="3.4" strokeLinejoin="round" />
          {/* Lid rim */}
          <rect x="18" y="28" width="64" height="9" rx="4.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
          {/* Tapioca pearls */}
          <circle cx="36" cy="79" r="5" fill="#292524" />
          <circle cx="50" cy="80" r="5" fill="#292524" />
          <circle cx="64" cy="79" r="5" fill="#292524" />
          <circle cx="43" cy="72" r="4.5" fill="#292524" />
          <circle cx="57" cy="72" r="4.5" fill="#292524" />
          <Eyes y={52} />
          <Cheeks y={59} color="#FDBA74" />
          <path d="M 46 58 Q 50 62 54 58" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'sweet-berry-shortcake':
      return (
        <g>
          {/* Cat ears */}
          <polygon points="22,38 26,18 42,30" fill="#FFF1F2" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="78,38 74,18 58,30" fill="#FFF1F2" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          {/* Cake block */}
          <rect x="18" y="30" width="64" height="56" rx="16" fill="#FFF1F2" stroke="#1C1917" strokeWidth="3.4" />
          {/* Strawberry frosting drip */}
          <path d="M 19 42 Q 30 52 40 42 Q 50 52 60 42 Q 70 52 81 42 L 81 36 Q 81 30 70 30 L 30 30 Q 19 30 19 36 Z" fill="#FB7185" />
          {/* Berry on top */}
          <circle cx="50" cy="24" r="8" fill="#E11D48" stroke="#1C1917" strokeWidth="2.8" />
          <path d="M 46 17 L 50 13 L 54 17" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" fill="none" />
          <Eyes y={60} />
          <Cheeks y={68} />
          <path d="M 46 66 Q 50 70 54 66" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'sweet-mint-gelato':
      return (
        <g>
          {/* Swirl scoop hat */}
          <path d="M 30 34 Q 50 8 70 34 Z" fill="#67E8F9" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="20" y="30" width="60" height="56" rx="20" fill="#0284C7" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 27 46 Q 50 38 73 46 L 73 78 Q 73 84 62 84 L 38 84 Q 27 84 27 78 Z" fill="#FFFFFF" />
          <Eyes y={56} />
          <Cheeks y={64} color="#BAE6FD" />
          <polygon points="44,61 56,61 50,69" fill="#F59E0B" stroke="#1C1917" strokeWidth="2.4" strokeLinejoin="round" />
        </g>
      );

    case 'sweet-macaron-unicorn':
      return (
        <g>
          {/* Golden unicorn horn */}
          <polygon points="44,28 50,8 56,28" fill="#FDE047" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          {/* Top macaron shell */}
          <rect x="16" y="26" width="68" height="24" rx="12" fill="#C084FC" stroke="#1C1917" strokeWidth="3.2" />
          {/* Cream filling */}
          <rect x="19" y="48" width="62" height="14" rx="6" fill="#FEF08A" stroke="#1C1917" strokeWidth="2.8" />
          {/* Bottom shell */}
          <rect x="16" y="60" width="68" height="24" rx="12" fill="#A855F7" stroke="#1C1917" strokeWidth="3.2" />
          <Eyes y={40} eyeColor="#1C1917" />
          <Cheeks y={46} color="#F9A8D4" />
          <path d="M 46 55 Q 50 59 54 55" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'sweet-golden-croissant':
      return (
        <g>
          {/* Royal Crown */}
          <polygon points="32,32 36,14 50,24 64,14 68,32" fill="#FACC15" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          {/* Waffle square */}
          <rect x="18" y="30" width="64" height="56" rx="16" fill="#F59E0B" stroke="#1C1917" strokeWidth="3.4" />
          {/* Grid lines */}
          <g stroke="#B45309" strokeWidth="2.2" opacity="0.45">
            <line x1="38" y1="32" x2="38" y2="84" />
            <line x1="62" y1="32" x2="62" y2="84" />
            <line x1="20" y1="50" x2="80" y2="50" />
            <line x1="20" y1="70" x2="80" y2="70" />
          </g>
          <Eyes y={56} />
          <Cheeks y={65} color="#FED7AA" />
          <path d="M 44 65 Q 50 71 56 65" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'sweet-chroma-parfait':
      return (
        <g>
          <defs>
            <linearGradient id="chromaSundaeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>
          {/* Star cherry */}
          <polygon points="50,8 53,16 62,16 55,21 57,29 50,24 43,29 45,21 38,16 47,16" fill="#FDE047" stroke="#1C1917" strokeWidth="2.4" />
          {/* Whipped cloud */}
          <circle cx="36" cy="36" r="14" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
          <circle cx="64" cy="36" r="14" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
          <circle cx="50" cy="31" r="16" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
          {/* Parfait prism bowl */}
          <path d="M 20 42 L 80 42 L 70 84 Q 50 90 30 84 Z" fill="url(#chromaSundaeGrad)" stroke="#1C1917" strokeWidth="3.4" strokeLinejoin="round" />
          <Eyes y={60} />
          <Cheeks y={68} color="#FFFFFF" />
          <path d="M 45 68 Q 50 73 55 68" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    // ────────── SPACE PACK ──────────
    case 'space-moon-rock':
      return (
        <g>
          <circle cx="24" cy="34" r="9" fill="#94A3B8" stroke="#1C1917" strokeWidth="3" />
          <circle cx="76" cy="34" r="9" fill="#94A3B8" stroke="#1C1917" strokeWidth="3" />
          <rect x="18" y="30" width="64" height="56" rx="18" fill="#CBD5E1" stroke="#1C1917" strokeWidth="3.4" />
          <circle cx="30" cy="44" r="5" fill="#94A3B8" />
          <circle cx="71" cy="72" r="6" fill="#94A3B8" />
          <Eyes y={56} />
          <ellipse cx="50" cy="63" rx="4.5" ry="3.2" fill="#1C1917" />
          <path d="M 45 70 Q 50 74 55 70" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'space-star-slime':
      return (
        <g>
          <path
            d="M 18 68 C 18 36 32 24 50 24 C 68 24 82 36 82 68 C 82 82 72 86 50 86 C 28 86 18 82 18 68 Z"
            fill="#22D3EE"
            stroke="#1C1917"
            strokeWidth="3.4"
          />
          <polygon points="50,33 52,39 58,39 53,43 55,49 50,45 45,49 47,43 42,39 48,39" fill="#FEF08A" />
          <Eyes y={60} />
          <Cheeks y={68} color="#A5F3FC" />
          <path d="M 46 68 Q 50 72 54 68" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'space-astro-corgi':
      return (
        <g>
          {/* Helmet dome */}
          <circle cx="50" cy="52" r="39" fill="#E0F2FE" fillOpacity="0.65" stroke="#1C1917" strokeWidth="3.2" />
          {/* Corgi ears inside */}
          <polygon points="24,44 27,20 43,34" fill="#F97316" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="76,44 73,20 57,34" fill="#F97316" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="23" y="34" width="54" height="46" rx="16" fill="#FB923C" stroke="#1C1917" strokeWidth="3" />
          <ellipse cx="50" cy="64" rx="18" ry="13" fill="#FFF7ED" />
          <Eyes y={54} spread={13} />
          <ellipse cx="50" cy="60" rx="4.2" ry="3" fill="#1C1917" />
          <path d="M 45 66 Q 50 71 55 66" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          {/* Visor highlight */}
          <path d="M 24 30 A 30 30 0 0 1 42 19" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'space-saturn-cat':
      return (
        <g>
          <polygon points="24,38 28,18 42,30" fill="#14B8A6" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="76,38 72,18 58,30" fill="#14B8A6" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <rect x="22" y="28" width="56" height="54" rx="18" fill="#2DD4BF" stroke="#1C1917" strokeWidth="3.4" />
          {/* Saturn ring */}
          <ellipse
            cx="50"
            cy="64"
            rx="44"
            ry="11"
            fill="none"
            stroke="#FDE047"
            strokeWidth="6"
            transform="rotate(-12 50 64)"
          />
          <ellipse
            cx="50"
            cy="64"
            rx="44"
            ry="11"
            fill="none"
            stroke="#1C1917"
            strokeWidth="2.2"
            transform="rotate(-12 50 64)"
          />
          <Eyes y={50} spread={13} />
          <path d="M 46 57 Q 50 61 54 57" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'space-comet-whale':
      return (
        <g>
          {/* Comet tail */}
          <path d="M 78 62 L 95 46 L 88 64 L 94 74 L 74 74 Z" fill="#60A5FA" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="14" y="30" width="68" height="54" rx="22" fill="#2563EB" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 16 66 Q 48 56 80 66 L 78 76 Q 74 84 48 84 Q 22 84 18 76 Z" fill="#DBEAFE" />
          {/* Star spout */}
          <path d="M 46 30 Q 42 16 32 18" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 46 30 Q 50 14 60 18" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" fill="none" />
          <Eyes y={52} spread={14} eyeColor="#FFFFFF" />
          <circle cx="37" cy="52" r="2.6" fill="#1C1917" />
          <circle cx="65" cy="52" r="2.6" fill="#1C1917" />
        </g>
      );

    case 'space-nebula-axolotl':
      return (
        <g>
          {/* External gills */}
          <g stroke="#EC4899" strokeWidth="5" strokeLinecap="round">
            <line x1="18" y1="42" x2="7" y2="34" />
            <line x1="16" y1="54" x2="5" y2="54" />
            <line x1="18" y1="66" x2="7" y2="74" />
            <line x1="82" y1="42" x2="93" y2="34" />
            <line x1="84" y1="54" x2="95" y2="54" />
            <line x1="82" y1="66" x2="93" y2="74" />
          </g>
          <rect x="18" y="30" width="64" height="54" rx="20" fill="#A855F7" stroke="#1C1917" strokeWidth="3.4" />
          <circle cx="32" cy="41" r="2.5" fill="#FDE047" />
          <circle cx="66" cy="39" r="2" fill="#E0F2FE" />
          <Eyes y={56} />
          <Cheeks y={64} color="#F472B6" />
          <path d="M 43 66 Q 50 72 57 66" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'space-nova-phoenix':
      return (
        <g>
          {/* Golden wing tips */}
          <path d="M 18 48 L 4 32 L 10 64 Z" fill="#F59E0B" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 82 48 L 96 32 L 90 64 Z" fill="#F59E0B" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="24,38 22,16 40,28" fill="#FDE047" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="76,38 78,16 60,28" fill="#FDE047" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="28" width="64" height="58" rx="18" fill="#FEF08A" stroke="#1C1917" strokeWidth="3.4" />
          <Eyes y={52} />
          <polygon points="44,60 56,60 50,70" fill="#D97706" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points="50,33 53,39 59,39 54,43 56,49 50,45 44,49 46,43 41,39 47,39" fill="#F59E0B" />
        </g>
      );

    case 'space-chroma-narwhal':
    default:
      return (
        <g>
          <defs>
            <linearGradient id="chromaNarwhalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="45%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          {/* Rainbow spiral horn */}
          <polygon points="44,32 50,4 56,32" fill="#FDE047" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <line x1="46" y1="24" x2="54" y2="20" stroke="#EC4899" strokeWidth="2.6" />
          <line x1="47" y1="16" x2="53" y2="13" stroke="#06B6D4" strokeWidth="2.6" />
          <rect x="16" y="30" width="68" height="56" rx="22" fill="url(#chromaNarwhalGrad)" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 18 68 Q 50 58 82 68 L 80 78 Q 74 86 50 86 Q 26 86 20 78 Z" fill="#FFFFFF" opacity="0.9" />
          <Eyes y={54} />
          <Cheeks y={62} color="#F9A8D4" />
          <path d="M 45 64 Q 50 69 55 64" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
  }
}

export const CollectibleArt: React.FC<CollectibleArtProps> = ({
  id,
  size = 88,
  silhouette = false,
  shiny = false,
  className = '',
}) => {
  const rawUid = React.useId();
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '');
  const item = getCollectibleById(id);
  const bg = silhouette ? '#E7E2D8' : (item?.bgHex ?? '#F3EFE7');
  const showShiny = shiny && !silhouette;
  const foilGradId = `qv-foil-${id}-${uid}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        ...(showShiny
          ? {
              boxShadow: '0 0 0 2.5px #F59E0B, 0 0 12px rgba(245, 158, 11, 0.45)',
            }
          : undefined),
      }}
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={silhouette ? 'brightness-0 opacity-22' : ''}
        aria-hidden="true"
      >
        {showShiny && (
          <defs>
            <linearGradient id={foilGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.52" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.32" />
            </linearGradient>
          </defs>
        )}
        {renderPhase2DCollectible(id, uid) ?? renderPhase2Collectible(id) ?? renderPhase1Collectible(id) ?? renderExtraCollectible(id) ?? renderCharacter(id)}
        {showShiny && (
          <g>
            <rect x="0" y="0" width="100" height="100" fill={`url(#${foilGradId})`} />
            <polygon points="16,10 18,15 23,17 18,19 16,24 14,19 9,17 14,15" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
            <polygon points="84,14 85.6,18 89.6,19.6 85.6,21.2 84,25.2 82.4,21.2 78.4,19.6 82.4,18" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
};

export const PackEnvelopeArt: React.FC<{ packId: PackId; size?: number }> = ({
  packId,
  size = 112,
}) => {
  const rawUid = React.useId();
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '');
  const palette: Record<PackId, { main: string; top: string; accent: string; emblem: string }> = {
    critter: { main: '#EA580C', top: '#FDBA74', accent: '#FEF3C7', emblem: 'critter-crystal-fox' },
    sweet: { main: '#DB2777', top: '#F9A8D4', accent: '#FCE7F3', emblem: 'sweet-boba-bear' },
    space: { main: '#2563EB', top: '#93C5FD', accent: '#DBEAFE', emblem: 'space-astro-corgi' },
    ocean: { main: '#0284C7', top: '#7DD3FC', accent: '#E0F2FE', emblem: 'ocean-dolphin-scout' },
    dino: { main: '#15803D', top: '#86EFAC', accent: '#DCFCE7', emblem: 'dino-amber-raptor' },
    magic: { main: '#7C3AED', top: '#C4B5FD', accent: '#EDE9FE', emblem: 'magic-spellbook-fox' },
    boba: { main: '#B45309', top: '#FDE68A', accent: '#FEF3C7', emblem: 'boba-milk-cat' },
    bakery: { main: '#D97706', top: '#FCD34D', accent: '#FFFBEB', emblem: 'bakery-croissant-bear' },
    sushi: { main: '#E11D48', top: '#FDA4AF', accent: '#FFF1F2', emblem: 'sushi-onigiri-cat' },
    botanical: { main: '#16A34A', top: '#86EFAC', accent: '#F0FDF4', emblem: 'botanical-sakura-bunny' },
    arctic: { main: '#0EA5E9', top: '#BAE6FD', accent: '#F0F9FF', emblem: 'arctic-penguin-knight' },
    butterfly: { main: '#9333EA', top: '#D8B4FE', accent: '#FAF5FF', emblem: 'butterfly-blue-morpho' },
    safari: { main: '#CA8A04', top: '#FEF08A', accent: '#FEFCE8', emblem: 'safari-golden-lion' },
    festival: { main: '#DC2626', top: '#FCA5A5', accent: '#FEF2F2', emblem: 'festival-lucky-cat' },
    mythology: { main: '#4F46E5', top: '#A5B4FC', accent: '#EEF2FF', emblem: 'mythology-baby-pegasus' },
    music: { main: '#EC4899', top: '#F9A8D4', accent: '#FDF2F8', emblem: 'music-guitar-cat' },
    arcade: { main: '#0D9488', top: '#5EEAD4', accent: '#F0FDFA', emblem: 'arcade-beep-bot' },
    crystal: { main: '#6366F1', top: '#C7D2FE', accent: '#EEF2FF', emblem: 'crystal-sapphire-fox' },
    halloween: { main: '#EA580C', top: '#A855F7', accent: '#FFF7ED', emblem: 'halloween-pumpkin-cat' },
    lunar: { main: '#DC2626', top: '#FACC15', accent: '#FEF2F2', emblem: 'lunar-lion-pup' },
    winter: { main: '#0284C7', top: '#BAE6FD', accent: '#F0F9FF', emblem: 'winter-snow-penguin' },
    midautumn: { main: '#D97706', top: '#FDE68A', accent: '#FFFBEB', emblem: 'midautumn-mochi-rabbit' },
    easter: { main: '#EC4899', top: '#FBCFE8', accent: '#FDF2F8', emblem: 'easter-egg-bunny' },
    catcafe: { main: '#C2410C', top: '#FDBA74', accent: '#FFF7ED', emblem: 'catcafe-toast-tabby' },
    capybara: { main: '#0D9488', top: '#99F6E4', accent: '#F0FDFA', emblem: 'capybara-yuzu-chill' },
    forest: { main: '#15803D', top: '#86EFAC', accent: '#F0FDF4', emblem: 'forest-red-panda' },
    mochi: { main: '#E11D48', top: '#FDA4AF', accent: '#FFF1F2', emblem: 'mochi-ichigo-daifuku' },
    cloudsquishy: { main: '#7C3AED', top: '#DDD6FE', accent: '#F5F3FF', emblem: 'cloudsquishy-marshmallow-lamb' },
    fairytale: { main: '#2563EB', top: '#93C5FD', accent: '#EFF6FF', emblem: 'fairytale-slipper-bunny' },
    fairyland: { main: '#9333EA', top: '#E9D5FF', accent: '#FAF5FF', emblem: 'fairyland-dewdrop-pixie' },
    ...PHASE2D_ENVELOPE_THEMES,
  };

  const p = palette[packId];

  return (
    <div
      style={{ width: size, height: Math.round(size * 1.18) }}
      className="relative inline-flex items-center justify-center select-none"
    >
      <svg viewBox="0 0 120 142" className="w-full h-full drop-shadow-sm" aria-hidden="true">
        <path
          d="M 14 8 L 22 4 L 30 8 L 38 4 L 46 8 L 54 4 L 62 8 L 70 4 L 78 8 L 86 4 L 94 8 L 106 8 L 106 134 L 94 138 L 86 134 L 78 138 L 70 134 L 62 138 L 54 134 L 46 138 L 38 134 L 30 138 L 22 134 L 14 138 Z"
          fill={p.main}
          stroke="#1C1917"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <rect x="16" y="12" width="88" height="14" fill={p.top} opacity="0.85" />
        <rect x="16" y="116" width="88" height="14" fill={p.top} opacity="0.6" />
        <rect x="26" y="34" width="68" height="68" rx="16" fill={p.accent} stroke="#1C1917" strokeWidth="3" />
        <g transform="translate(26, 34) scale(0.68)">
          {renderPhase2DCollectible(p.emblem, uid) ?? renderPhase2Collectible(p.emblem) ?? renderPhase1Collectible(p.emblem) ?? renderExtraCollectible(p.emblem) ?? renderCharacter(p.emblem)}
        </g>
        <circle cx="28" cy="112" r="3" fill="#FFFFFF" opacity="0.85" />
        <circle cx="92" cy="112" r="3" fill="#FFFFFF" opacity="0.85" />
      </svg>
    </div>
  );
};

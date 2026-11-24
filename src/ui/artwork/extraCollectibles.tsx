import React from 'react';

function Eyes({ y = 54, spread = 15, col = '#1C1917' }: { y?: number; spread?: number; col?: string }) {
  return (
    <g>
      <circle cx={50 - spread} cy={y} r="5.2" fill={col} />
      <circle cx={50 - spread + 1.8} cy={y - 1.8} r="1.8" fill="#FFFFFF" />
      <circle cx={50 + spread} cy={y} r="5.2" fill={col} />
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

export function renderExtraCollectible(id: string, uid = 'ex'): React.ReactNode | null {
  switch (id) {
    // ────────── OCEAN PACK (8) ──────────
    case 'ocean-pearl-clam':
      return (
        <g>
          <path d="M 16 58 Q 16 20 50 20 Q 84 20 84 58 Z" fill="#38BDF8" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 16 58 Q 50 74 84 58 L 80 80 Q 50 90 20 80 Z" fill="#0284C7" stroke="#1C1917" strokeWidth="3.4" />
          <circle cx="50" cy="54" r="14" fill="#FFFBEB" stroke="#1C1917" strokeWidth="3" />
          <circle cx="45" cy="49" r="3.5" fill="#FFFFFF" />
          <Eyes y={54} spread={7} />
        </g>
      );
    case 'ocean-bubble-turtle':
      return (
        <g>
          <circle cx="14" cy="54" r="9" fill="#34D399" stroke="#1C1917" strokeWidth="3" />
          <circle cx="86" cy="54" r="9" fill="#34D399" stroke="#1C1917" strokeWidth="3" />
          <rect x="18" y="26" width="64" height="58" rx="22" fill="#10B981" stroke="#1C1917" strokeWidth="3.4" />
          <polygon points="50,32 64,42 58,56 42,56 36,42" fill="#047857" opacity="0.4" />
          <Eyes y={56} />
          <Cheeks y={65} color="#A7F3D0" />
          <path d="M 45 66 Q 50 71 55 66" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <circle cx="76" cy="22" r="5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
        </g>
      );
    case 'ocean-coral-seahorse':
      return (
        <g>
          <path d="M 32 28 Q 22 14 38 14 Q 44 10 52 16 Q 60 12 64 24" fill="#FB7185" stroke="#1C1917" strokeWidth="3" />
          <rect x="20" y="26" width="60" height="58" rx="20" fill="#FDA4AF" stroke="#1C1917" strokeWidth="3.4" />
          <rect x="64" y="54" width="22" height="12" rx="6" fill="#FB7185" stroke="#1C1917" strokeWidth="3" />
          <Eyes y={50} spread={13} />
          <Cheeks y={60} spread={20} color="#F43F5E" />
          <path d="M 44 64 Q 50 69 56 64" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'ocean-jelly-dancer':
      return (
        <g>
          <g stroke="#22D3EE" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path d="M 28 66 Q 24 78 30 88" />
            <path d="M 43 68 Q 39 80 45 90" />
            <path d="M 57 68 Q 61 80 55 90" />
            <path d="M 72 66 Q 76 78 70 88" />
          </g>
          <path d="M 16 64 C 16 26 32 18 50 18 C 68 18 84 26 84 64 Z" fill="#67E8F9" stroke="#1C1917" strokeWidth="3.4" />
          <Eyes y={46} />
          <Cheeks y={54} color="#F9A8D4" />
          <path d="M 45 54 Q 50 58 55 54" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'ocean-dolphin-scout':
      return (
        <g>
          <path d="M 44 26 Q 54 10 64 26 Z" fill="#2563EB" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="16" y="26" width="68" height="58" rx="22" fill="#3B82F6" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 18 64 Q 50 54 82 64 L 80 76 Q 74 84 50 84 Q 26 84 20 76 Z" fill="#DBEAFE" />
          <Eyes y={50} />
          <Cheeks y={59} color="#93C5FD" />
          <path d="M 43 61 Q 50 67 57 61" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'ocean-glow-octopus':
      return (
        <g>
          <circle cx="24" cy="82" r="8" fill="#8B5CF6" stroke="#1C1917" strokeWidth="3" />
          <circle cx="42" cy="84" r="8" fill="#8B5CF6" stroke="#1C1917" strokeWidth="3" />
          <circle cx="58" cy="84" r="8" fill="#8B5CF6" stroke="#1C1917" strokeWidth="3" />
          <circle cx="76" cy="82" r="8" fill="#8B5CF6" stroke="#1C1917" strokeWidth="3" />
          <rect x="18" y="20" width="64" height="60" rx="24" fill="#A78BFA" stroke="#1C1917" strokeWidth="3.4" />
          <circle cx="34" cy="34" r="3" fill="#FDE047" />
          <circle cx="66" cy="32" r="2.5" fill="#FDE047" />
          <Eyes y={52} />
          <Cheeks y={60} color="#F472B6" />
          <path d="M 46 61 Q 50 66 54 61" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'ocean-koi-dragon':
      return (
        <g>
          <path d="M 18 46 L 6 34 L 10 62 Z" fill="#F59E0B" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 82 46 L 94 34 L 90 62 Z" fill="#F59E0B" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="26" width="64" height="58" rx="20" fill="#FEF3C7" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 22 30 Q 44 46 32 62 L 19 52 Z" fill="#EF4444" />
          <path d="M 78 34 Q 58 44 68 60 L 81 52 Z" fill="#F59E0B" />
          <Eyes y={54} />
          <path d="M 44 66 Q 50 71 56 66" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'ocean-chroma-leviathan':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-oceanChroma`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <polygon points="34,26 42,8 50,24 58,8 66,26" fill="#FDE047" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="16" y="24" width="68" height="62" rx="20" fill={`url(#${uid}-oceanChroma)`} stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 18 68 Q 50 56 82 68 L 80 78 Q 74 86 50 86 Q 26 86 20 78 Z" fill="#FFFFFF" opacity="0.88" />
          <Eyes y={52} />
          <path d="M 43 65 Q 50 71 57 65" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );

    // ────────── DINO PACK (8) ──────────
    case 'dino-baby-tricera':
      return (
        <g>
          <circle cx="50" cy="40" r="32" fill="#4ADE80" stroke="#1C1917" strokeWidth="3.2" />
          <polygon points="34,28 28,12 42,24" fill="#FEF9C3" stroke="#1C1917" strokeWidth="2.6" />
          <polygon points="66,28 72,12 58,24" fill="#FEF9C3" stroke="#1C1917" strokeWidth="2.6" />
          <rect x="20" y="34" width="60" height="52" rx="18" fill="#86EFAC" stroke="#1C1917" strokeWidth="3.4" />
          <polygon points="46,60 54,60 50,50" fill="#FEF9C3" stroke="#1C1917" strokeWidth="2.4" />
          <Eyes y={56} />
          <Cheeks y={66} color="#FDBA74" />
          <path d="M 44 72 Q 50 76 56 72" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'dino-leaf-stego':
      return (
        <g>
          <polygon points="24,34 32,14 42,32" fill="#84CC16" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <polygon points="42,32 50,10 58,32" fill="#65A30D" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <polygon points="58,32 68,14 76,34" fill="#84CC16" stroke="#1C1917" strokeWidth="2.8" strokeLinejoin="round" />
          <rect x="18" y="30" width="64" height="56" rx="20" fill="#A3E635" stroke="#1C1917" strokeWidth="3.4" />
          <Eyes y={56} />
          <Cheeks y={65} color="#FEF08A" />
          <path d="M 44 68 Q 50 73 56 68" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'dino-amber-raptor':
      return (
        <g>
          <path d="M 28 30 L 34 14 L 46 28 L 54 12 L 64 28" fill="#EA580C" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="28" width="64" height="58" rx="18" fill="#FB923C" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 19 42 L 34 46 L 19 52 Z" fill="#C2410C" />
          <path d="M 81 42 L 66 46 L 81 52 Z" fill="#C2410C" />
          <Eyes y={54} />
          <path d="M 40 68 L 45 73 L 50 68 L 55 73 L 60 68" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );
    case 'dino-fossil-rex':
      return (
        <g>
          <rect x="18" y="24" width="64" height="62" rx="18" fill="#F8FAFC" stroke="#1C1917" strokeWidth="3.4" />
          <circle cx="35" cy="50" r="9" fill="#334155" />
          <circle cx="65" cy="50" r="9" fill="#334155" />
          <circle cx="37" cy="48" r="3" fill="#38BDF8" />
          <circle cx="67" cy="48" r="3" fill="#38BDF8" />
          <path d="M 32 70 L 38 76 L 44 70 L 50 76 L 56 70 L 62 76 L 68 70" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );
    case 'dino-cloud-ptero':
      return (
        <g>
          <path d="M 18 48 L 4 30 L 12 64 Z" fill="#38BDF8" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 82 48 L 96 30 L 88 64 Z" fill="#38BDF8" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="44,30 50,8 62,30" fill="#0284C7" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="28" width="64" height="56" rx="18" fill="#7DD3FC" stroke="#1C1917" strokeWidth="3.4" />
          <Eyes y={52} />
          <polygon points="43,60 57,60 50,72" fill="#F59E0B" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" />
        </g>
      );
    case 'dino-crystal-ankylo':
      return (
        <g>
          <polygon points="22,36 14,18 34,26" fill="#C084FC" stroke="#1C1917" strokeWidth="2.8" />
          <polygon points="50,28 50,8 60,26" fill="#A855F7" stroke="#1C1917" strokeWidth="2.8" />
          <polygon points="78,36 86,18 66,26" fill="#C084FC" stroke="#1C1917" strokeWidth="2.8" />
          <rect x="18" y="28" width="64" height="58" rx="18" fill="#8B5CF6" stroke="#1C1917" strokeWidth="3.4" />
          <rect x="24" y="66" width="52" height="16" rx="8" fill="#EDE9FE" />
          <Eyes y={52} />
          <path d="M 44 74 Q 50 78 56 74" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'dino-volcanic-rex':
      return (
        <g>
          <polygon points="32,30 38,10 50,22 62,10 68,30" fill="#FACC15" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="28" width="64" height="58" rx="18" fill="#EA580C" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 22 68 Q 50 58 78 68 L 78 80 Q 78 86 64 86 L 36 86 Q 22 86 22 80 Z" fill="#FDE047" />
          <Eyes y={52} />
          <path d="M 38 70 L 44 76 L 50 70 L 56 76 L 62 70" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );
    case 'dino-chroma-bronto':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-dinoChroma`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
          <rect x="34" y="10" width="32" height="34" rx="14" fill={`url(#${uid}-dinoChroma)`} stroke="#1C1917" strokeWidth="3.2" />
          <rect x="16" y="34" width="68" height="52" rx="22" fill={`url(#${uid}-dinoChroma)`} stroke="#1C1917" strokeWidth="3.4" />
          <circle cx="30" cy="48" r="5" fill="#FEF08A" />
          <circle cx="70" cy="52" r="4" fill="#FFFFFF" />
          <Eyes y={28} spread={8} />
          <path d="M 45 36 Q 50 40 55 36" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>
      );

    // ────────── MAGIC PACK (8) ──────────
    case 'magic-quill-sprite':
      return (
        <g>
          <path d="M 52 10 Q 82 14 78 46 Q 66 56 50 52 Q 40 34 52 10 Z" fill="#3B82F6" stroke="#1C1917" strokeWidth="3.2" />
          <rect x="20" y="34" width="60" height="52" rx="20" fill="#EFF6FF" stroke="#1C1917" strokeWidth="3.4" />
          <Eyes y={58} />
          <Cheeks y={66} color="#93C5FD" />
          <path d="M 45 66 Q 50 71 55 66" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'magic-teacup-potion':
      return (
        <g>
          <path d="M 78 48 C 92 48 92 70 78 70" fill="none" stroke="#1C1917" strokeWidth="4" />
          <rect x="18" y="34" width="62" height="52" rx="18" fill="#CCFBF1" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 20 50 Q 35 42 50 50 Q 65 58 78 50 L 78 76 Q 78 84 64 84 L 34 84 Q 20 84 20 76 Z" fill="#2DD4BF" />
          <circle cx="42" cy="22" r="4.5" fill="#5EEAD4" stroke="#1C1917" strokeWidth="2" />
          <circle cx="58" cy="18" r="6" fill="#A7F3D0" stroke="#1C1917" strokeWidth="2" />
          <Eyes y={62} />
          <path d="M 46 71 Q 50 75 54 71" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'magic-bookworm-cat':
      return (
        <g>
          <polygon points="22,38 26,18 42,30" fill="#F59E0B" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="78,38 74,18 58,30" fill="#F59E0B" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <rect x="18" y="28" width="64" height="58" rx="18" fill="#FDE68A" stroke="#1C1917" strokeWidth="3.4" />
          {/* Cute reading glasses */}
          <circle cx="35" cy="54" r="11" fill="#FFFFFF" fillOpacity="0.55" stroke="#1C1917" strokeWidth="2.8" />
          <circle cx="65" cy="54" r="11" fill="#FFFFFF" fillOpacity="0.55" stroke="#1C1917" strokeWidth="2.8" />
          <line x1="46" y1="54" x2="54" y2="54" stroke="#1C1917" strokeWidth="2.8" />
          <Eyes y={54} />
          <path d="M 46 68 Q 50 72 54 68" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'magic-lantern-bat':
      return (
        <g>
          <path d="M 18 48 L 4 32 L 8 64 L 18 58 Z" fill="#4C1D95" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 82 48 L 96 32 L 92 64 L 82 58 Z" fill="#4C1D95" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="24,36 26,14 42,28" fill="#6D28D9" stroke="#1C1917" strokeWidth="3" />
          <polygon points="76,36 74,14 58,28" fill="#6D28D9" stroke="#1C1917" strokeWidth="3" />
          <rect x="18" y="28" width="64" height="56" rx="20" fill="#7C3AED" stroke="#1C1917" strokeWidth="3.4" />
          <Eyes y={54} col="#FEF08A" />
          <polygon points="44,66 47,72 50,66" fill="#FFFFFF" />
          <polygon points="50,66 53,72 56,66" fill="#FFFFFF" />
        </g>
      );
    case 'magic-spellbook-fox':
      return (
        <g>
          <polygon points="20,42 24,14 44,30" fill="#EA580C" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <polygon points="80,42 76,14 56,30" fill="#EA580C" stroke="#1C1917" strokeWidth="3.2" strokeLinejoin="round" />
          <rect x="18" y="30" width="64" height="56" rx="18" fill="#FB923C" stroke="#1C1917" strokeWidth="3.4" />
          <rect x="30" y="68" width="40" height="18" rx="4" fill="#6D28D9" stroke="#1C1917" strokeWidth="2.8" />
          <polygon points="50,71 52,75 56,75 53,78 54,82 50,79 46,82 47,78 44,75 48,75" fill="#FDE047" />
          <Eyes y={52} />
        </g>
      );
    case 'magic-crystal-owl':
      return (
        <g>
          <circle cx="50" cy="52" r="36" fill="#E9D5FF" stroke="#7C3AED" strokeWidth="3.4" />
          <rect x="24" y="28" width="52" height="48" rx="18" fill="#A855F7" stroke="#1C1917" strokeWidth="3.2" />
          <circle cx="38" cy="50" r="11" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.4" />
          <circle cx="62" cy="50" r="11" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.4" />
          <Eyes y={50} spread={12} />
          <polygon points="46,58 54,58 50,65" fill="#FACC15" stroke="#1C1917" strokeWidth="2.2" />
        </g>
      );
    case 'magic-phoenix-tome':
      return (
        <g>
          <rect x="16" y="20" width="68" height="66" rx="12" fill="#B45309" stroke="#1C1917" strokeWidth="3.4" />
          <rect x="24" y="26" width="54" height="54" rx="8" fill="#F59E0B" stroke="#1C1917" strokeWidth="2.6" />
          <polygon points="50,32 54,42 64,42 56,48 59,58 50,52 41,58 44,48 36,42 46,42" fill="#FEF08A" stroke="#1C1917" strokeWidth="2.2" />
          <Eyes y={66} spread={12} />
        </g>
      );
    case 'magic-chroma-unicorn':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-magicChroma`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <polygon points="44,30 50,4 56,30" fill="#FDE047" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="22,38 26,18 40,30" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
          <polygon points="78,38 74,18 60,30" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
          <rect x="18" y="28" width="64" height="58" rx="20" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
          <path d="M 20 34 Q 50 48 80 34 L 78 28 Q 50 22 22 28 Z" fill={`url(#${uid}-magicChroma)`} />
          <Eyes y={56} />
          <Cheeks y={65} color="#F472B6" />
          <path d="M 44 68 Q 50 73 56 68" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      );
    default:
      return null;
  }
}

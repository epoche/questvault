import React from 'react';

const INK = '#1C1917';

type EyeStyle = 'round' | 'happy' | 'starry';
type MouthStyle = 'smile' | 'cat' | 'snout' | 'beak' | 'happy';
type EarKind = 'bear' | 'bunny' | 'cat' | 'pup' | 'fox' | 'otter' | 'mouse' | 'owl' | 'pony';
type GidFn = (suffix: string) => string;

function Grad({
  id,
  stops,
  diag = false,
}: {
  id: string;
  stops: [string, string, ...string[]];
  diag?: boolean;
}) {
  return (
    <linearGradient
      id={id}
      x1="0%"
      y1="0%"
      x2={diag ? '100%' : '0%'}
      y2="100%"
    >
      {stops.map((c, i) => (
        <stop
          key={i}
          offset={`${Math.round((i / (stops.length - 1)) * 100)}%`}
          stopColor={c}
        />
      ))}
    </linearGradient>
  );
}

function PrismDefs({ gid }: { gid: GidFn }) {
  return (
    <defs>
      <Grad
        id={gid('prism')}
        stops={['#F472B6', '#FBBF24', '#34D399', '#38BDF8', '#A78BFA']}
        diag
      />
      <Grad
        id={gid('prism-soft')}
        stops={['#FBCFE8', '#FEF08A', '#A7F3D0', '#BAE6FD', '#DDD6FE']}
        diag
      />
    </defs>
  );
}

function Sparkles({ items }: { items: [number, number, number, string?][] }) {
  return (
    <g>
      {items.map(([x, y, s, fill = '#FEF08A'], i) => (
        <path
          key={i}
          d={`M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`}
          fill={fill}
          stroke={INK}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function Ears({
  kind,
  fill,
  inner = '#FDA4AF',
  y = 26,
}: {
  kind: EarKind;
  fill: string;
  inner?: string;
  y?: number;
}) {
  switch (kind) {
    case 'bear':
      return (
        <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <circle cx="28" cy={y} r="9.5" fill={fill} />
          <circle cx="28" cy={y} r="4.8" fill={inner} stroke="none" />
          <circle cx="72" cy={y} r="9.5" fill={fill} />
          <circle cx="72" cy={y} r="4.8" fill={inner} stroke="none" />
        </g>
      );
    case 'mouse':
      return (
        <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <circle cx="25" cy={y} r="12" fill={fill} />
          <circle cx="25" cy={y + 0.5} r="6.8" fill={inner} stroke="none" />
          <circle cx="75" cy={y} r="12" fill={fill} />
          <circle cx="75" cy={y + 0.5} r="6.8" fill={inner} stroke="none" />
        </g>
      );
    case 'otter':
      return (
        <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
          <circle cx="26" cy={y + 4} r="7.5" fill={fill} />
          <circle cx="26" cy={y + 4} r="3.6" fill={inner} stroke="none" />
          <circle cx="74" cy={y + 4} r="7.5" fill={fill} />
          <circle cx="74" cy={y + 4} r="3.6" fill={inner} stroke="none" />
        </g>
      );
    case 'bunny':
      return (
        <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <ellipse cx="36" cy={y - 7} rx="7.2" ry="16" transform={`rotate(-10 36 ${y - 7})`} fill={fill} />
          <ellipse cx="36" cy={y - 6} rx="3.4" ry="10.5" transform={`rotate(-10 36 ${y - 6})`} fill={inner} stroke="none" />
          <ellipse cx="64" cy={y - 7} rx="7.2" ry="16" transform={`rotate(10 64 ${y - 7})`} fill={fill} />
          <ellipse cx="64" cy={y - 6} rx="3.4" ry="10.5" transform={`rotate(10 64 ${y - 6})`} fill={inner} stroke="none" />
        </g>
      );
    case 'cat':
      return (
        <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <path d={`M 24 ${y + 12} L 22 ${y - 10} L 42 ${y + 2} Z`} fill={fill} />
          <path d={`M 26.5 ${y + 7} L 25.5 ${y - 4.5} L 36.5 ${y + 2} Z`} fill={inner} stroke="none" />
          <path d={`M 76 ${y + 12} L 78 ${y - 10} L 58 ${y + 2} Z`} fill={fill} />
          <path d={`M 73.5 ${y + 7} L 74.5 ${y - 4.5} L 63.5 ${y + 2} Z`} fill={inner} stroke="none" />
        </g>
      );
    case 'fox':
      return (
        <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <path d={`M 21 ${y + 12} L 18 ${y - 13} L 42 ${y + 2} Z`} fill={fill} />
          <path d={`M 24.5 ${y + 8} L 22.5 ${y - 6} L 36 ${y + 2.5} Z`} fill={inner} stroke="none" />
          <path d={`M 79 ${y + 12} L 82 ${y - 13} L 58 ${y + 2} Z`} fill={fill} />
          <path d={`M 75.5 ${y + 8} L 77.5 ${y - 6} L 64 ${y + 2.5} Z`} fill={inner} stroke="none" />
        </g>
      );
    case 'pup':
      return (
        <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <path d={`M 26 ${y + 4} Q 11 ${y + 6} 13 ${y + 24} Q 15 ${y + 32} 24 ${y + 26} Q 29 ${y + 18} 28 ${y + 8} Z`} fill={fill} />
          <path d={`M 74 ${y + 4} Q 89 ${y + 6} 87 ${y + 24} Q 85 ${y + 32} 76 ${y + 26} Q 71 ${y + 18} 72 ${y + 8} Z`} fill={fill} />
        </g>
      );
    case 'owl':
      return (
        <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <path d={`M 25 ${y + 10} L 18 ${y - 7} L 37 ${y + 1} Z`} fill={fill} />
          <path d={`M 75 ${y + 10} L 82 ${y - 7} L 63 ${y + 1} Z`} fill={fill} />
        </g>
      );
    case 'pony':
      return (
        <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
          <path d={`M 26 ${y + 10} Q 21 ${y - 6} 31 ${y - 9} Q 39 ${y - 3} 38 ${y + 9} Z`} fill={fill} />
          <path d={`M 29 ${y + 6} Q 27 ${y - 3} 32 ${y - 4.5} Q 35.5 ${y - 1} 35 ${y + 6} Z`} fill={inner} stroke="none" />
          <path d={`M 74 ${y + 10} Q 79 ${y - 6} 69 ${y - 9} Q 61 ${y - 3} 62 ${y + 9} Z`} fill={fill} />
          <path d={`M 71 ${y + 6} Q 73 ${y - 3} 68 ${y - 4.5} Q 64.5 ${y - 1} 65 ${y + 6} Z`} fill={inner} stroke="none" />
        </g>
      );
  }
}

function Face({
  eyeY = 55,
  spread = 13,
  eyes = 'round',
  mouth = 'smile',
  cheek = '#FDA4AF',
  dark = false,
  whiskers = false,
}: {
  eyeY?: number;
  spread?: number;
  eyes?: EyeStyle;
  mouth?: MouthStyle;
  cheek?: string;
  dark?: boolean;
  whiskers?: boolean;
}) {
  const stroke = dark ? '#FFFBEB' : INK;
  const my = eyeY + 7.5;
  return (
    <g>
      {/* Eyes */}
      {eyes === 'happy' ? (
        <g stroke={stroke} strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d={`M ${50 - spread - 4.8} ${eyeY + 1} Q ${50 - spread} ${eyeY - 5} ${50 - spread + 4.8} ${eyeY + 1}`} />
          <path d={`M ${50 + spread - 4.8} ${eyeY + 1} Q ${50 + spread} ${eyeY - 5} ${50 + spread + 4.8} ${eyeY + 1}`} />
        </g>
      ) : dark ? (
        <g>
          <circle cx={50 - spread} cy={eyeY} r="5.3" fill="#FEF9C3" stroke={INK} strokeWidth="1.2" />
          <circle cx={50 - spread} cy={eyeY} r="3" fill={INK} />
          <circle cx={50 - spread + 1.4} cy={eyeY - 1.4} r="1.4" fill="#FFFFFF" />
          <circle cx={50 + spread} cy={eyeY} r="5.3" fill="#FEF9C3" stroke={INK} strokeWidth="1.2" />
          <circle cx={50 + spread} cy={eyeY} r="3" fill={INK} />
          <circle cx={50 + spread + 1.4} cy={eyeY - 1.4} r="1.4" fill="#FFFFFF" />
          {eyes === 'starry' && (
            <>
              <circle cx={50 - spread - 1.4} cy={eyeY + 1.5} r="1.1" fill="#FDE047" />
              <circle cx={50 + spread - 1.4} cy={eyeY + 1.5} r="1.1" fill="#FDE047" />
            </>
          )}
        </g>
      ) : (
        <g>
          <circle cx={50 - spread} cy={eyeY} r="4.6" fill={INK} />
          <circle cx={50 - spread + 1.5} cy={eyeY - 1.5} r="1.7" fill="#FFFFFF" />
          <circle cx={50 + spread} cy={eyeY} r="4.6" fill={INK} />
          <circle cx={50 + spread + 1.5} cy={eyeY - 1.5} r="1.7" fill="#FFFFFF" />
          {eyes === 'starry' && (
            <>
              <circle cx={50 - spread - 1.5} cy={eyeY + 1.7} r="1.1" fill="#FEF08A" />
              <circle cx={50 + spread - 1.5} cy={eyeY + 1.7} r="1.1" fill="#FEF08A" />
            </>
          )}
        </g>
      )}
      {/* Cheeks */}
      <g opacity="0.78">
        <ellipse cx={50 - spread - 6.5} cy={eyeY + 6.5} rx="4.4" ry="2.6" fill={cheek} />
        <ellipse cx={50 + spread + 6.5} cy={eyeY + 6.5} rx="4.4" ry="2.6" fill={cheek} />
      </g>
      {/* Whiskers */}
      {whiskers && (
        <g stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
          <line x1="20" y1={eyeY + 4} x2="29" y2={eyeY + 5.5} />
          <line x1="21" y1={eyeY + 9} x2="29" y2={eyeY + 8.5} />
          <line x1="80" y1={eyeY + 4} x2="71" y2={eyeY + 5.5} />
          <line x1="79" y1={eyeY + 9} x2="71" y2={eyeY + 8.5} />
        </g>
      )}
      {/* Mouth */}
      {mouth === 'beak' && (
        <polygon
          points={`45.5,${my - 2} 54.5,${my - 2} 50,${my + 5.5}`}
          fill="#F59E0B"
          stroke={INK}
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
      )}
      {mouth === 'cat' && (
        <path
          d={`M 44 ${my} Q 47 ${my + 4} 50 ${my} Q 53 ${my + 4} 56 ${my}`}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mouth === 'snout' && (
        <g>
          <ellipse cx="50" cy={my - 1} rx="4.1" ry="2.7" fill={stroke} />
          <path
            d={`M 45.5 ${my + 3.5} Q 50 ${my + 7.5} 54.5 ${my + 3.5}`}
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}
      {mouth === 'happy' && (
        <path
          d={`M 44 ${my - 1} Q 50 ${my + 6.8} 56 ${my - 1}`}
          stroke={stroke}
          strokeWidth="2.7"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mouth === 'smile' && (
        <path
          d={`M 45.5 ${my} Q 50 ${my + 4.8} 54.5 ${my}`}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
}

function SpiralHorn({ fill = '#FDE047', yBase = 26 }: { fill?: string; yBase?: number }) {
  return (
    <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
      <path d={`M 44 ${yBase} L 50 ${yBase - 20} L 56 ${yBase} Z`} fill={fill} />
      <path d={`M 46.2 ${yBase - 5} L 54.3 ${yBase - 7.5}`} strokeWidth="1.7" />
      <path d={`M 47.6 ${yBase - 10.5} L 53 ${yBase - 12.5}`} strokeWidth="1.7" />
    </g>
  );
}

function ChefToque({ y = 24, tilt = 0 }: { y?: number; tilt?: number }) {
  return (
    <g transform={tilt ? `rotate(${tilt} 50 ${y})` : undefined} stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
      <path
        d={`M 35 ${y} C 29 ${y - 6} 33 ${y - 16} 42 ${y - 14} C 45 ${y - 21} 55 ${y - 21} 58 ${y - 14} C 67 ${y - 16} 71 ${y - 6} 65 ${y} Z`}
        fill="#FFFFFF"
      />
      <rect x="35" y={y - 3} width="30" height="7" rx="2.5" fill="#F8FAFC" />
      <line x1="44" y1={y - 12} x2="44" y2={y - 4} stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="56" y1={y - 12} x2="56" y2={y - 4} stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function FairyWings({ fill, vein = '#FFFFFF', double = false }: { fill: string; vein?: string; double?: boolean }) {
  return (
    <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
      {/* Upper wings */}
      <path d="M 32 48 C 12 22 4 38 14 54 C 18 60 27 59 34 55 Z" fill={fill} fillOpacity="0.88" />
      <path d="M 68 48 C 88 22 96 38 86 54 C 82 60 73 59 66 55 Z" fill={fill} fillOpacity="0.88" />
      {/* Lower wings */}
      <path d="M 34 58 C 16 62 11 78 23 82 C 31 84 37 74 39 65 Z" fill={fill} fillOpacity="0.82" />
      <path d="M 66 58 C 84 62 89 78 77 82 C 69 84 63 74 61 65 Z" fill={fill} fillOpacity="0.82" />
      {double && (
        <g stroke={vein} strokeWidth="1.7" fill="none" opacity="0.85">
          <path d="M 27 49 Q 17 41 13 44" />
          <path d="M 73 49 Q 83 41 87 44" />
          <circle cx="17" cy="48" r="2.2" fill={vein} stroke="none" />
          <circle cx="83" cy="48" r="2.2" fill={vein} stroke="none" />
        </g>
      )}
    </g>
  );
}

function MermaidTail({ fill, finFill }: { fill: string; finFill: string }) {
  return (
    <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
      <path d="M 30 68 C 28 84 44 92 66 87 C 75 85 81 80 82 74 C 76 74 71 76 64 76 C 51 76 47 71 45 66 Z" fill={fill} />
      {/* Forked caudal fin */}
      <path d="M 77 76 C 85 65 95 66 92 76 C 95 85 86 92 76 83 Z" fill={finFill} />
      <path d="M 42 79 Q 47 83 52 79 M 54 81 Q 59 85 64 81" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
    </g>
  );
}

function UnicornBase({
  bodyFill,
  maneFill,
  hornFill = '#FDE047',
  eyeStyle = 'round',
  cheek = '#FDA4AF',
  dark = false,
  wings,
  backExtra,
  frontExtra,
}: {
  bodyFill: string;
  maneFill: string;
  hornFill?: string;
  eyeStyle?: EyeStyle;
  cheek?: string;
  dark?: boolean;
  wings?: React.ReactNode;
  backExtra?: React.ReactNode;
  frontExtra?: React.ReactNode;
}) {
  return (
    <g>
      {backExtra}
      {wings}
      <Ears kind="pony" fill={bodyFill} inner="#FBCFE8" y={28} />
      {/* Flowing side mane */}
      <path
        d="M 22 36 C 11 42 10 62 19 72 C 25 69 27 59 25 46 Z"
        fill={maneFill}
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Blooket pony torso/head */}
      <rect x="21" y="29" width="58" height="53" rx="22" fill={bodyFill} stroke={INK} strokeWidth="3.2" />
      {/* Little hooves */}
      <rect x="30" y="76" width="12" height="10" rx="5" fill={maneFill} stroke={INK} strokeWidth="2.6" />
      <rect x="58" y="76" width="12" height="10" rx="5" fill={maneFill} stroke={INK} strokeWidth="2.6" />
      {/* Forelock curl */}
      <path
        d="M 32 31 C 39 21 57 22 65 32 C 57 36 47 36 39 39 C 35 40 31 36 32 31 Z"
        fill={maneFill}
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <SpiralHorn fill={hornFill} yBase={29} />
      {frontExtra}
      <Face eyeY={55} spread={13} eyes={eyeStyle} mouth="smile" cheek={cheek} dark={dark} />
    </g>
  );
}

const PHASE6_RENDERERS: Record<string, (gid: GidFn) => React.ReactNode> = {
  // =========================================================================
  // 39. TAIWAN NIGHT MARKET PACK (8)
  // =========================================================================
  'nightmarket-pearl-boba': (gid) => (
    <g>
      <defs>
        <Grad id={gid('tea')} stops={['#FDE68A', '#D97706']} />
      </defs>
      {/* Thick striped boba straw */}
      <path d="M 55 8 L 63 9 L 58 32 L 50 31 Z" fill="#EC4899" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <line x1="53" y1="15" x2="61" y2="16" stroke="#FFFFFF" strokeWidth="2.2" />
      <line x1="52" y1="22" x2="59.5" y2="23" stroke="#FFFFFF" strokeWidth="2.2" />
      <Ears kind="bear" fill="#B45309" inner="#FDE68A" y={27} />
      {/* Cup silhouette */}
      <path d="M 24 31 L 76 31 L 69 86 Q 68 91 62 91 L 38 91 Q 32 91 31 86 Z" fill={`url(#${gid('tea')})`} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      {/* Brown sugar tiger stripes */}
      <path d="M 27 48 Q 37 52 34 61 Q 31 68 29 74" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M 73 46 Q 63 52 67 62 Q 69 68 70 73" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
      {/* Tapioca pearls at bottom */}
      <g fill="#292524">
        <circle cx="38" cy="83" r="4.5" />
        <circle cx="48" cy="85" r="4.5" />
        <circle cx="58" cy="84" r="4.5" />
        <circle cx="43" cy="77" r="4" />
        <circle cx="53" cy="78" r="4" />
        <circle cx="63" cy="79" r="3.8" />
      </g>
      {/* Sealed dome rim */}
      <rect x="20" y="27" width="60" height="8" rx="4" fill="#FFFBEB" stroke={INK} strokeWidth="2.8" />
      <Face eyeY={53} spread={12} eyes="happy" mouth="snout" cheek="#FB7185" />
    </g>
  ),

  'nightmarket-scallion-pancake': (gid) => (
    <g>
      <defs>
        <Grad id={gid('crust')} stops={['#FEF08A', '#F59E0B', '#D97706']} diag />
      </defs>
      <Ears kind="pup" fill="#B45309" y={29} />
      {/* Crispy flaky pancake disc */}
      <circle cx="50" cy="54" r="32" fill={`url(#${gid('crust')})`} stroke={INK} strokeWidth="3.2" />
      {/* Spiral flaky crust lines */}
      <path d="M 32 34 Q 50 26 68 35" stroke="#B45309" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 28 71 Q 50 81 72 71" stroke="#B45309" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Green chopped scallion flecks */}
      <g fill="#16A34A" stroke={INK} strokeWidth="1.2">
        <rect x="33" y="34" width="7" height="3.6" rx="1.6" transform="rotate(-18 36 36)" />
        <rect x="57" y="32" width="7.5" height="3.6" rx="1.6" transform="rotate(22 60 34)" />
        <rect x="25" y="55" width="6.5" height="3.4" rx="1.5" transform="rotate(15 28 57)" />
        <rect x="68" y="57" width="7" height="3.5" rx="1.5" transform="rotate(-24 71 59)" />
        <rect x="46" y="74" width="8" height="3.6" rx="1.6" transform="rotate(8 50 76)" />
      </g>
      <Face eyeY={52} spread={13} eyes="round" mouth="snout" cheek="#FDA4AF" />
    </g>
  ),

  'nightmarket-sweet-potato-ball': (gid) => (
    <g>
      <defs>
        <Grad id={gid('ball')} stops={['#FDE047', '#FB923C', '#EA580C']} diag />
      </defs>
      {/* Side mini sweet potato balls */}
      <circle cx="20" cy="74" r="10.5" fill="#FB923C" stroke={INK} strokeWidth="2.8" />
      <circle cx="80" cy="74" r="10.5" fill="#FBBF24" stroke={INK} strokeWidth="2.8" />
      {/* Chick head tuft */}
      <path d="M 46 23 Q 44 12 51 16 Q 56 10 56 23" fill="#FDE047" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Plump puffed golden ball */}
      <ellipse cx="50" cy="54" rx="31" ry="30" fill={`url(#${gid('ball')})`} stroke={INK} strokeWidth="3.2" />
      {/* Crispy gloss highlight */}
      <ellipse cx="37" cy="36" rx="8" ry="4.2" transform="rotate(-24 37 36)" fill="#FFFBEB" opacity="0.65" />
      {/* Tiny flapping chick wings */}
      <path d="M 21 52 Q 11 54 14 63 Q 20 66 24 60" fill="#FDE047" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M 79 52 Q 89 54 86 63 Q 80 66 76 60" fill="#FDE047" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <Face eyeY={51} spread={12} eyes="happy" mouth="beak" cheek="#FB7185" />
    </g>
  ),

  'nightmarket-pepper-bun': (gid) => (
    <g>
      <defs>
        <Grad id={gid('bun')} stops={['#FDE68A', '#D97706', '#92400E']} />
      </defs>
      {/* Cozy steam curls */}
      <path d="M 42 18 Q 39 12 43 8 M 58 18 Q 61 12 57 8" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <Ears kind="cat" fill="#B45309" inner="#FDE68A" y={28} />
      {/* Baked clay-oven dome bun */}
      <path d="M 18 62 C 18 33 32 25 50 25 C 68 25 82 33 82 62 C 82 79 71 85 50 85 C 29 85 18 79 18 62 Z" fill={`url(#${gid('bun')})`} stroke={INK} strokeWidth="3.2" />
      {/* Toasted sesame seeds */}
      <g fill="#FEF9C3" stroke={INK} strokeWidth="0.9">
        <ellipse cx="38" cy="34" rx="3" ry="1.6" transform="rotate(-20 38 34)" />
        <ellipse cx="50" cy="31" rx="3" ry="1.6" />
        <ellipse cx="62" cy="34" rx="3" ry="1.6" transform="rotate(20 62 34)" />
        <ellipse cx="44" cy="40" rx="2.6" ry="1.4" transform="rotate(10 44 40)" />
        <ellipse cx="57" cy="40" rx="2.6" ry="1.4" transform="rotate(-12 57 40)" />
      </g>
      <Face eyeY={58} spread={13} eyes="round" mouth="cat" cheek="#FDA4AF" whiskers />
    </g>
  ),

  'nightmarket-wheel-pie': (gid) => (
    <g>
      <defs>
        <Grad id={gid('pie')} stops={['#FDE68A', '#F59E0B']} />
      </defs>
      <Ears kind="bunny" fill="#FEF3C7" inner="#FDA4AF" y={27} />
      {/* Wheel pie top & bottom biscuit with custard center band */}
      <rect x="20" y="34" width="60" height="49" rx="18" fill={`url(#${gid('pie')})`} stroke={INK} strokeWidth="3.2" />
      {/* Vanilla custard oozing band */}
      <path d="M 20 65 Q 32 72 42 66 Q 52 73 63 66 Q 72 72 80 65 L 80 73 Q 70 81 50 81 Q 30 81 20 73 Z" fill="#FEF9C3" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* Stamped clover mark on forehead */}
      <g fill="#16A34A" stroke={INK} strokeWidth="1.2">
        <circle cx="48" cy="41" r="2.6" />
        <circle cx="52" cy="41" r="2.6" />
        <circle cx="50" cy="38.5" r="2.6" />
        <line x1="50" y1="43" x2="50" y2="46" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <Face eyeY={54} spread={13} eyes="happy" mouth="cat" cheek="#FB7185" />
    </g>
  ),

  'nightmarket-mango-ice': (gid) => (
    <g>
      <defs>
        <Grad id={gid('bowl')} stops={['#38BDF8', '#0284C7']} />
        <Grad id={gid('mango')} stops={['#FDE047', '#F59E0B']} diag />
      </defs>
      {/* Fluffy snow-ice dome */}
      <path d="M 22 61 C 20 33 34 22 50 22 C 66 22 80 33 78 61 Z" fill="#FFFBEB" stroke={INK} strokeWidth="3" />
      {/* Golden mango cubes + mint leaf crown */}
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="33" y="21" width="12" height="10" rx="2.5" transform="rotate(-14 39 26)" fill={`url(#${gid('mango')})`} />
        <rect x="54" y="20" width="12" height="10" rx="2.5" transform="rotate(14 60 25)" fill={`url(#${gid('mango')})`} />
        <rect x="44" y="16" width="12" height="10" rx="2.5" fill="#FACC15" />
        <path d="M 55 17 Q 65 9 69 16 Q 62 21 55 17 Z" fill="#22C55E" />
      </g>
      {/* Penguin flippers */}
      <path d="M 21 53 Q 11 58 14 68 Q 20 69 24 62" fill="#334155" stroke={INK} strokeWidth="2.6" />
      <path d="M 79 53 Q 89 58 86 68 Q 80 69 76 62" fill="#334155" stroke={INK} strokeWidth="2.6" />
      {/* Penguin slate hood arc */}
      <path d="M 24 58 C 24 38 35 32 50 32 C 65 32 76 38 76 58 L 70 58 C 68 45 59 42 50 44 C 41 42 32 45 30 58 Z" fill="#334155" stroke={INK} strokeWidth="2.4" />
      {/* Shaved-ice bowl */}
      <path d="M 19 60 L 81 60 C 79 79 68 87 50 87 C 32 87 21 79 19 60 Z" fill={`url(#${gid('bowl')})`} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      <rect x="36" y="85" width="28" height="6" rx="3" fill="#0369A1" stroke={INK} strokeWidth="2.6" />
      <Face eyeY={50} spread={11} eyes="round" mouth="beak" cheek="#FDA4AF" />
    </g>
  ),

  'nightmarket-lantern-dragon': (gid) => (
    <g>
      <defs>
        <Grad id={gid('lantern')} stops={['#F87171', '#DC2626', '#991B1B']} />
      </defs>
      {/* Dragon golden horns & scalloped ears */}
      <path d="M 30 28 Q 20 14 28 10 Q 34 16 37 26 Z" fill="#FACC15" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M 70 28 Q 80 14 72 10 Q 66 16 63 26 Z" fill="#FACC15" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* Flowing golden tassels */}
      <path d="M 46 82 L 43 94 M 50 82 L 50 95 M 54 82 L 57 94" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      {/* Red glowing lantern body */}
      <ellipse cx="50" cy="53" rx="32" ry="27" fill={`url(#${gid('lantern')})`} stroke={INK} strokeWidth="3.2" />
      {/* Lantern ribs */}
      <path d="M 35 28 Q 27 53 35 78 M 65 28 Q 73 53 65 78" stroke="#991B1B" strokeWidth="2.2" fill="none" opacity="0.65" />
      {/* Top & bottom gold caps */}
      <rect x="36" y="21" width="28" height="8" rx="3" fill="#FACC15" stroke={INK} strokeWidth="2.6" />
      <rect x="38" y="76" width="24" height="7" rx="3" fill="#FACC15" stroke={INK} strokeWidth="2.6" />
      {/* Dragon whisker curls */}
      <path d="M 22 60 Q 12 63 14 70 M 78 60 Q 88 63 86 70" stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <Face eyeY={52} spread={13} eyes="starry" mouth="happy" cheek="#FDE047" dark />
    </g>
  ),

  'nightmarket-chroma-feast': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      {/* Radiant starlight halo */}
      <circle cx="50" cy="54" r="39" fill={`url(#${gid('prism-soft')})`} opacity="0.55" />
      {/* Orbiting mini treats: boba + lantern */}
      <circle cx="17" cy="40" r="7" fill="#FDE047" stroke={INK} strokeWidth="2.2" />
      <circle cx="83" cy="40" r="7" fill="#FB7185" stroke={INK} strokeWidth="2.2" />
      {/* Main rainbow feast spirit */}
      <rect x="22" y="29" width="56" height="53" rx="22" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="3.2" />
      {/* Golden lantern crown */}
      <path d="M 34 30 L 39 14 L 50 22 L 61 14 L 66 30 Z" fill="#FACC15" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="50" cy="23" r="3.2" fill="#EC4899" stroke={INK} strokeWidth="1.4" />
      {/* Glossy shimmer band */}
      <path d="M 30 70 Q 50 78 70 70" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
      <Face eyeY={53} spread={13} eyes="starry" mouth="happy" cheek="#FEF08A" />
      <Sparkles items={[[16, 22, 6, '#FEF08A'], [84, 24, 5.5, '#BAE6FD'], [82, 78, 5, '#FBCFE8']]} />
    </g>
  ),

  // =========================================================================
  // 40. DREAMY STATIONERY PACK (8)
  // =========================================================================
  'stationery-pastel-eraser': (gid) => (
    <g>
      <defs>
        <Grad id={gid('sleeve')} stops={['#F9A8D4', '#EC4899']} />
      </defs>
      <Ears kind="bunny" fill="#FFFFFF" inner="#FBCFE8" y={25} />
      {/* White rubber eraser block */}
      <rect x="23" y="27" width="54" height="59" rx="12" fill="#FFFDF9" stroke={INK} strokeWidth="3.2" />
      {/* Pastel pink paper sleeve on lower half */}
      <path d="M 23 58 L 77 58 L 77 76 Q 77 86 67 86 L 33 86 Q 23 86 23 76 Z" fill={`url(#${gid('sleeve')})`} stroke={INK} strokeWidth="3" />
      <line x1="25" y1="65" x2="75" y2="65" stroke="#FFFFFF" strokeWidth="2.8" />
      {/* Tiny strawberry emblem on sleeve */}
      <circle cx="50" cy="75" r="4.5" fill="#FFF1F2" stroke={INK} strokeWidth="1.6" />
      <Face eyeY={43} spread={12} eyes="happy" mouth="cat" cheek="#F9A8D4" />
    </g>
  ),

  'stationery-washi-cat': (gid) => (
    <g>
      <defs>
        <Grad id={gid('tape')} stops={['#BAE6FD', '#38BDF8', '#0EA5E9']} diag />
      </defs>
      {/* Unfurling starry washi tape ribbon */}
      <path d="M 67 74 L 93 74 L 89 81 L 93 88 L 54 88 Z" fill="#FBCFE8" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="80" cy="81" r="2.2" fill="#FEF08A" />
      <Ears kind="cat" fill="#7DD3FC" inner="#FBCFE8" y={28} />
      {/* Round washi tape roll */}
      <circle cx="48" cy="54" r="30" fill={`url(#${gid('tape')})`} stroke={INK} strokeWidth="3.2" />
      {/* Inner cream tape core ring */}
      <circle cx="48" cy="54" r="19" fill="#FFFBEB" stroke={INK} strokeWidth="2.6" />
      <Face eyeY={52} spread={9.5} eyes="round" mouth="cat" cheek="#FDA4AF" whiskers />
      <Sparkles items={[[25, 42, 4, '#FEF08A'], [70, 44, 4, '#FFFFFF']]} />
    </g>
  ),

  'stationery-fountain-fox': (gid) => (
    <g>
      <defs>
        <Grad id={gid('nib')} stops={['#93C5FD', '#2563EB']} />
      </defs>
      {/* Floating cobalt ink drop */}
      <path d="M 84 22 Q 91 31 84 36 Q 77 31 84 22 Z" fill="#2563EB" stroke={INK} strokeWidth="2.2" />
      <Ears kind="fox" fill="#2563EB" inner="#DBEAFE" y={27} />
      {/* Fountain pen nib / fox silhouette */}
      <path d="M 24 34 Q 50 22 76 34 L 74 66 L 50 90 L 26 66 Z" fill={`url(#${gid('nib')})`} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      {/* Cream fox face mask */}
      <path d="M 27 48 Q 50 38 73 48 L 69 65 L 50 82 L 31 65 Z" fill="#EFF6FF" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* Golden nib slit & breather hole */}
      <line x1="50" y1="88" x2="50" y2="75" stroke="#D97706" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="50" cy="74" r="2.8" fill="#FACC15" stroke={INK} strokeWidth="1.5" />
      <Face eyeY={54} spread={12} eyes="round" mouth="smile" cheek="#93C5FD" />
    </g>
  ),

  'stationery-sticker-bear': (gid) => (
    <g>
      <defs>
        <Grad id={gid('sheet')} stops={['#FEF9C3', '#FDE047']} diag />
      </defs>
      <Ears kind="bear" fill="#FACC15" inner="#FFFBEB" y={26} />
      {/* Sticker body with peeled bottom-right corner */}
      <path d="M 22 29 L 78 29 L 78 68 L 62 84 L 22 84 Z" fill={`url(#${gid('sheet')})`} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      {/* Curled peel triangle */}
      <path d="M 62 84 L 62 68 L 78 68 Z" fill="#F59E0B" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* Gold star stickers on forehead */}
      <Sparkles items={[[34, 37, 4.5, '#F59E0B'], [66, 37, 4.5, '#F59E0B'], [50, 35, 5.5, '#EC4899']]} />
      <Face eyeY={54} spread={13} eyes="happy" mouth="snout" cheek="#FB7185" />
    </g>
  ),

  'stationery-gel-pen-otter': (gid) => (
    <g>
      <defs>
        <Grad id={gid('gel')} stops={['#99F6E4', '#14B8A6', '#0D9488']} />
      </defs>
      {/* Silver pen clip on side */}
      <path d="M 76 34 L 85 34 Q 88 34 88 40 L 88 64 Q 88 68 84 68 L 77 68" fill="none" stroke="#94A3B8" strokeWidth="4.2" strokeLinecap="round" />
      <Ears kind="otter" fill="#0D9488" inner="#CCFBF1" y={27} />
      {/* Rounded gel-pen barrel otter */}
      <rect x="23" y="28" width="54" height="56" rx="22" fill={`url(#${gid('gel')})`} stroke={INK} strokeWidth="3.2" />
      {/* Cream otter belly/face patch */}
      <ellipse cx="50" cy="57" rx="20" ry="18" fill="#F0FDFA" />
      {/* Glitter gel pen held at bottom */}
      <path d="M 32 76 Q 50 84 68 74" stroke="#F472B6" strokeWidth="3.8" strokeLinecap="round" fill="none" />
      <Face eyeY={54} spread={11} eyes="round" mouth="snout" cheek="#FDA4AF" />
      <Sparkles items={[[31, 36, 3.8, '#FFFFFF'], [67, 38, 4.2, '#FEF08A'], [72, 74, 4, '#FFFFFF']]} />
    </g>
  ),

  'stationery-sketchbook-owl': (gid) => (
    <g>
      <defs>
        <Grad id={gid('owl')} stops={['#EDE9FE', '#A78BFA', '#7C3AED']} />
      </defs>
      {/* Diagonal artist paintbrush behind */}
      <line x1="16" y1="84" x2="84" y2="16" stroke="#D97706" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M 79 19 L 90 10 Q 92 18 83 24 Z" fill="#EC4899" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <Ears kind="owl" fill="#7C3AED" y={28} />
      {/* Painter palette owl silhouette */}
      <path d="M 22 52 C 22 31 35 26 50 26 C 68 26 80 35 80 54 C 80 74 66 84 48 84 C 31 84 22 72 22 52 Z" fill={`url(#${gid('owl')})`} stroke={INK} strokeWidth="3.2" />
      {/* Cream owl facial disc */}
      <ellipse cx="50" cy="50" rx="21" ry="14" fill="#F5F3FF" />
      {/* 4 vivid watercolor paint wells along belly */}
      <circle cx="34" cy="72" r="4.5" fill="#F472B6" stroke={INK} strokeWidth="1.6" />
      <circle cx="45" cy="75" r="4.5" fill="#FACC15" stroke={INK} strokeWidth="1.6" />
      <circle cx="56" cy="75" r="4.5" fill="#34D399" stroke={INK} strokeWidth="1.6" />
      <circle cx="66" cy="71" r="4.5" fill="#38BDF8" stroke={INK} strokeWidth="1.6" />
      <Face eyeY={49} spread={11} eyes="round" mouth="beak" cheek="#F9A8D4" />
    </g>
  ),

  'stationery-pencilcase-whale': (gid) => (
    <g>
      <defs>
        <Grad id={gid('whale')} stops={['#60A5FA', '#2563EB', '#1D4ED8']} />
      </defs>
      {/* Colorful pencil tips spouting from whale blowhole */}
      <polygon points="44,27 40,12 49,25" fill="#FACC15" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <polygon points="55,27 60,11 50,25" fill="#F472B6" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* Whale tail fin */}
      <path d="M 74 66 C 85 58 93 48 87 43 C 82 47 78 52 74 56 C 81 52 92 56 90 65 C 84 68 78 68 74 66 Z" fill="#2563EB" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      {/* Plump whale pencilcase body */}
      <path d="M 14 58 C 14 34 32 28 52 28 C 70 28 80 40 80 58 C 80 76 66 84 46 84 C 24 84 14 75 14 58 Z" fill={`url(#${gid('whale')})`} stroke={INK} strokeWidth="3.2" />
      {/* Cream belly */}
      <path d="M 18 68 Q 46 64 74 68 Q 64 82 46 82 Q 26 82 18 68 Z" fill="#EFF6FF" stroke={INK} strokeWidth="2.2" />
      {/* Silver zipper teeth & gold pull tab */}
      <line x1="22" y1="39" x2="72" y2="39" stroke="#E2E8F0" strokeWidth="3.2" strokeDasharray="3 3" strokeLinecap="round" />
      <rect x="70" y="35" width="9" height="7" rx="2.5" fill="#FACC15" stroke={INK} strokeWidth="2" />
      <Face eyeY={54} spread={13} eyes="happy" mouth="smile" cheek="#93C5FD" dark />
    </g>
  ),

  'stationery-chroma-prism-pen': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      {/* Sweeping rainbow feather plume behind */}
      <path d="M 24 72 C 12 48 22 14 64 10 C 78 14 82 28 74 44 C 66 58 46 66 32 76 Z" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 24 74 Q 48 44 68 18" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.85" />
      {/* Plump cute sprite head & gold calligraphy nib base */}
      <circle cx="52" cy="55" r="24" fill={`url(#${gid('prism-soft')})`} stroke={INK} strokeWidth="3" />
      <polygon points="44,76 60,76 52,92" fill="#FACC15" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <Face eyeY={54} spread={10} eyes="starry" mouth="happy" cheek="#F472B6" />
      <Sparkles items={[[18, 26, 5.5, '#FEF08A'], [84, 58, 5, '#BAE6FD'], [78, 82, 4.5, '#F9A8D4']]} />
    </g>
  ),

  // =========================================================================
  // 41. ZODIAC UNICORNS PACK (8)
  // =========================================================================
  'unicorns-dawn-foal': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#FFF1F2', '#FBCFE8']} />
        <Grad id={gid('mane')} stops={['#F472B6', '#FB923C']} diag />
      </defs>
      <UnicornBase
        bodyFill={`url(#${gid('body')})`}
        maneFill={`url(#${gid('mane')})`}
        cheek="#FB7185"
        backExtra={
          <path d="M 12 82 Q 16 71 27 75 Q 35 68 46 76 Q 58 68 70 76 Q 82 71 88 82 Q 86 91 50 91 Q 14 91 12 82 Z" fill="#FEF3C7" stroke={INK} strokeWidth="2.4" />
        }
      />
      <Sparkles items={[[17, 25, 4.5, '#FDE047'], [83, 30, 5, '#F472B6']]} />
    </g>
  ),

  'unicorns-clover-pony': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#F0FDF4', '#BBF7D0']} />
        <Grad id={gid('mane')} stops={['#34D399', '#16A34A']} diag />
      </defs>
      <UnicornBase
        bodyFill={`url(#${gid('body')})`}
        maneFill={`url(#${gid('mane')})`}
        eyeStyle="happy"
        cheek="#86EFAC"
        frontExtra={
          <g fill="#16A34A" stroke={INK} strokeWidth="1.4">
            <circle cx="67" cy="40" r="3.4" />
            <circle cx="72" cy="40" r="3.4" />
            <circle cx="67" cy="45" r="3.4" />
            <circle cx="72" cy="45" r="3.4" />
          </g>
        }
      />
      <Sparkles items={[[18, 28, 4.5, '#4ADE80'], [83, 66, 4.5, '#FEF08A']]} />
    </g>
  ),

  'unicorns-comet-filly': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#F0F9FF', '#BAE6FD']} />
        <Grad id={gid('mane')} stops={['#38BDF8', '#0284C7']} diag />
      </defs>
      <UnicornBase
        bodyFill={`url(#${gid('body')})`}
        maneFill={`url(#${gid('mane')})`}
        hornFill="#E0F2FE"
        cheek="#7DD3FC"
        backExtra={
          <path d="M 68 38 C 86 24 95 26 92 42 C 88 54 78 64 70 66 Z" fill="#7DD3FC" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        }
      />
      <Sparkles items={[[84, 22, 6, '#FEF08A'], [17, 26, 4.5, '#BAE6FD'], [86, 56, 4, '#FFFFFF']]} />
    </g>
  ),

  'unicorns-peach-pegasus': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#FFF7ED', '#FED7AA']} />
        <Grad id={gid('mane')} stops={['#FB923C', '#F472B6']} diag />
      </defs>
      <UnicornBase
        bodyFill={`url(#${gid('body')})`}
        maneFill={`url(#${gid('mane')})`}
        eyeStyle="happy"
        cheek="#FDA4AF"
        wings={
          <g fill="#FFFFFF" stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
            <path d="M 24 48 C 6 32 4 50 14 58 C 8 64 16 70 25 63 Z" />
            <path d="M 76 48 C 94 32 96 50 86 58 C 92 64 84 70 75 63 Z" />
          </g>
        }
      />
    </g>
  ),

  'unicorns-sapphire-mane': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#60A5FA', '#2563EB', '#1E3A8A']} />
        <Grad id={gid('mane')} stops={['#38BDF8', '#4F46E5']} diag />
      </defs>
      <UnicornBase
        bodyFill={`url(#${gid('body')})`}
        maneFill={`url(#${gid('mane')})`}
        hornFill="#FEF08A"
        eyeStyle="starry"
        cheek="#93C5FD"
        dark
        frontExtra={
          <g stroke="#FEF08A" strokeWidth="1.4" fill="#FFFFFF">
            <line x1="34" y1="70" x2="46" y2="73" />
            <line x1="46" y1="73" x2="62" y2="69" />
            <circle cx="34" cy="70" r="1.8" />
            <circle cx="46" cy="73" r="1.8" />
            <circle cx="62" cy="69" r="1.8" />
          </g>
        }
      />
      <Sparkles items={[[19, 22, 4.5, '#FEF08A'], [82, 24, 5, '#BAE6FD']]} />
    </g>
  ),

  'unicorns-moonbeam-steed': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#7C3AED', '#5B21B6', '#3B0764']} />
        <Grad id={gid('mane')} stops={['#C4B5FD', '#4C1D95']} diag />
      </defs>
      <UnicornBase
        bodyFill={`url(#${gid('body')})`}
        maneFill={`url(#${gid('mane')})`}
        hornFill="#E2E8F0"
        eyeStyle="starry"
        cheek="#F9A8D4"
        dark
        backExtra={
          <path d="M 72 11 A 15 15 0 1 1 72 35 A 13 13 0 1 0 72 11 Z" fill="#FEF08A" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        }
      />
      <Sparkles items={[[18, 22, 5, '#FEF08A'], [84, 72, 4.5, '#E9D5FF']]} />
    </g>
  ),

  'unicorns-solar-alicorn': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#FEF08A', '#F59E0B', '#D97706']} />
        <Grad id={gid('mane')} stops={['#FB923C', '#DC2626']} diag />
      </defs>
      <UnicornBase
        bodyFill={`url(#${gid('body')})`}
        maneFill={`url(#${gid('mane')})`}
        hornFill="#FFFBEB"
        eyeStyle="starry"
        cheek="#FDBA74"
        backExtra={
          <g>
            <circle cx="50" cy="36" r="26" fill="#FDE047" opacity="0.4" />
            <circle cx="50" cy="36" r="22" fill="none" stroke="#F59E0B" strokeWidth="2.6" strokeDasharray="5 4" />
          </g>
        }
        wings={
          <g fill="#FEF08A" stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
            <path d="M 24 46 C 4 24 2 48 13 58 C 7 66 15 74 26 65 Z" />
            <path d="M 76 46 C 96 24 98 48 87 58 C 93 66 85 74 74 65 Z" />
          </g>
        }
      />
      <Sparkles items={[[16, 18, 5, '#FEF08A'], [84, 18, 5, '#FEF08A']]} />
    </g>
  ),

  'unicorns-chroma-zodiac': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      <UnicornBase
        bodyFill={`url(#${gid('prism')})`}
        maneFill={`url(#${gid('prism-soft')})`}
        hornFill="#FEF08A"
        eyeStyle="starry"
        cheek="#FEF08A"
        backExtra={
          <path d="M 16 40 A 35 35 0 0 1 84 40" fill="none" stroke="#FACC15" strokeWidth="2.6" strokeDasharray="3 5" />
        }
        wings={
          <g fill={`url(#${gid('prism-soft')})`} stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
            <path d="M 23 48 C 5 26 4 50 14 59 C 9 67 17 74 26 65 Z" />
            <path d="M 77 48 C 95 26 96 50 86 59 C 91 67 83 74 74 65 Z" />
          </g>
        }
      />
      <Sparkles items={[[18, 22, 5.5, '#FEF08A'], [50, 8, 5, '#F472B6'], [82, 22, 5.5, '#38BDF8']]} />
    </g>
  ),

  // =========================================================================
  // 42. CORAL REEF MERMAIDS PACK (8)
  // =========================================================================
  'mermaids-pearl-fin': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#E0F2FE', '#38BDF8']} />
        <Grad id={gid('tail')} stops={['#2DD4BF', '#0284C7']} diag />
      </defs>
      <MermaidTail fill={`url(#${gid('tail')})`} finFill="#7DD3FC" />
      <Ears kind="cat" fill="#7DD3FC" inner="#FBCFE8" y={25} />
      <rect x="23" y="27" width="52" height="45" rx="20" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3.2" />
      {/* Pearl hair clip & floating bubbles */}
      <circle cx="64" cy="30" r="5" fill="#FFFDF9" stroke={INK} strokeWidth="2" />
      <circle cx="15" cy="32" r="4.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
      <circle cx="85" cy="36" r="3.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.8" />
      <Face eyeY={49} spread={12} eyes="happy" mouth="cat" cheek="#F9A8D4" whiskers />
    </g>
  ),

  'mermaids-kelp-bunny': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#D1FAE5', '#34D399']} />
        <Grad id={gid('tail')} stops={['#10B981', '#047857']} diag />
      </defs>
      {/* Waving emerald kelp ribbons */}
      <path d="M 15 84 Q 9 64 17 48 Q 22 36 15 24" stroke="#059669" strokeWidth="5" strokeLinecap="round" fill="none" />
      <MermaidTail fill={`url(#${gid('tail')})`} finFill="#6EE7B7" />
      <Ears kind="bunny" fill="#A7F3D0" inner="#FBCFE8" y={25} />
      <rect x="23" y="28" width="52" height="44" rx="20" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3.2" />
      <Face eyeY={49} spread={12} eyes="round" mouth="cat" cheek="#FDA4AF" />
    </g>
  ),

  'mermaids-coral-otter': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#FFE4E6', '#FB7185']} />
        <Grad id={gid('tail')} stops={['#FDA4AF', '#E11D48']} diag />
      </defs>
      <MermaidTail fill={`url(#${gid('tail')})`} finFill="#FBCFE8" />
      {/* Branching pink coral crown */}
      <path d="M 42 29 L 38 14 M 40 21 L 32 17 M 50 28 L 50 11 M 58 29 L 62 14 M 60 21 L 68 17" stroke="#F43F5E" strokeWidth="4.2" strokeLinecap="round" />
      <Ears kind="otter" fill="#FB7185" inner="#FFE4E6" y={26} />
      <rect x="23" y="28" width="52" height="44" rx="20" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3.2" />
      <ellipse cx="49" cy="53" rx="18" ry="13" fill="#FFF1F2" />
      <Face eyeY={49} spread={11} eyes="happy" mouth="snout" cheek="#FDA4AF" />
    </g>
  ),

  'mermaids-starfish-pup': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#FEF3C7', '#FBBF24']} />
        <Grad id={gid('tail')} stops={['#38BDF8', '#0D9488']} diag />
      </defs>
      <MermaidTail fill={`url(#${gid('tail')})`} finFill="#FDE047" />
      <Ears kind="pup" fill="#D97706" y={27} />
      <rect x="23" y="28" width="52" height="44" rx="20" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3.2" />
      {/* Sunny 5-point starfish clip */}
      <polygon
        points="68,18 70.5,24 77,24.5 72,28.5 73.5,35 68,31.5 62.5,35 64,28.5 59,24.5 65.5,24"
        fill="#F97316"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Face eyeY={49} spread={12} eyes="round" mouth="snout" cheek="#FB7185" />
    </g>
  ),

  'mermaids-shell-harp': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#CCFBF1', '#14B8A6']} />
        <Grad id={gid('tail')} stops={['#0D9488', '#0F766E']} diag />
      </defs>
      <MermaidTail fill={`url(#${gid('tail')})`} finFill="#5EEAD4" />
      {/* Scalloped shell crown */}
      <path d="M 36 29 C 36 16 64 16 64 29 Z" fill="#FDE68A" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <line x1="44" y1="20" x2="46" y2="29" stroke={INK} strokeWidth="1.6" />
      <line x1="56" y1="20" x2="54" y2="29" stroke={INK} strokeWidth="1.6" />
      <rect x="23" y="28" width="52" height="44" rx="20" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3.2" />
      {/* Pearly conch harp on side */}
      <path d="M 10 50 C 8 34 24 30 24 44 L 24 64 L 12 62 Z" fill="#FEF3C7" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <line x1="15" y1="40" x2="15" y2="61" stroke="#F59E0B" strokeWidth="1.5" />
      <line x1="19" y1="39" x2="19" y2="62" stroke="#F59E0B" strokeWidth="1.5" />
      <Face eyeY={49} spread={12} eyes="starry" mouth="smile" cheek="#FDA4AF" />
    </g>
  ),

  'mermaids-moon-jelly': (gid) => (
    <g>
      <defs>
        <Grad id={gid('jelly')} stops={['#E9D5FF', '#A855F7', '#7C3AED']} />
      </defs>
      <MermaidTail fill="#7C3AED" finFill="#C4B5FD" />
      {/* Glowing moon-jellyfish parasol bell above */}
      <path d="M 18 35 C 18 11 82 11 82 35 Q 66 39 50 35 Q 34 39 18 35 Z" fill={`url(#${gid('jelly')})`} stroke={INK} strokeWidth="2.8" fillOpacity="0.9" />
      <path d="M 24 36 Q 21 50 25 60 M 76 36 Q 79 50 75 60" stroke="#C084FC" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <rect x="26" y="33" width="46" height="40" rx="18" fill="#F5F3FF" stroke={INK} strokeWidth="3" />
      <Face eyeY={52} spread={11} eyes="starry" mouth="smile" cheek="#C084FC" />
      <Sparkles items={[[15, 22, 4.5, '#FEF08A'], [86, 24, 4.5, '#DDD6FE']]} />
    </g>
  ),

  'mermaids-trench-empress': (gid) => (
    <g>
      <defs>
        <Grad id={gid('sapphire')} stops={['#3B82F6', '#1D4ED8', '#1E3A8A']} />
      </defs>
      <MermaidTail fill="#1E3A8A" finFill="#60A5FA" />
      {/* Regal sapphire pearl crown */}
      <path d="M 32 29 L 36 12 L 45 21 L 50 9 L 55 21 L 64 12 L 68 29 Z" fill="#FACC15" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="50" cy="21" r="4" fill="#EFF6FF" stroke={INK} strokeWidth="1.5" />
      <rect x="23" y="28" width="52" height="44" rx="20" fill={`url(#${gid('sapphire')})`} stroke={INK} strokeWidth="3.2" />
      <Face eyeY={49} spread={12} eyes="starry" mouth="smile" cheek="#93C5FD" dark />
      <Sparkles items={[[16, 26, 5, '#FEF08A'], [84, 28, 5, '#93C5FD']]} />
    </g>
  ),

  'mermaids-chroma-aurora-tide': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      {/* Sweeping aurora wave ribbons */}
      <path d="M 8 56 Q 28 18 54 34 Q 76 48 92 24" stroke={`url(#${gid('prism')})`} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.65" />
      <MermaidTail fill={`url(#${gid('prism')})`} finFill={`url(#${gid('prism-soft')})`} />
      {/* Crystal shell tiara */}
      <path d="M 35 28 L 42 13 L 50 22 L 58 13 L 65 28 Z" fill={`url(#${gid('prism-soft')})`} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="23" y="27" width="52" height="45" rx="20" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="3.2" />
      <Face eyeY={49} spread={12} eyes="starry" mouth="happy" cheek="#FEF08A" />
      <Sparkles items={[[16, 24, 5.5, '#FEF08A'], [84, 24, 5, '#BAE6FD'], [84, 62, 4.5, '#FBCFE8']]} />
    </g>
  ),

  // =========================================================================
  // 43. MAGIC PATISSERIE PACK (8)
  // =========================================================================
  'patisserie-berry-tart': (gid) => (
    <g>
      <defs>
        <Grad id={gid('crust')} stops={['#FDE68A', '#D97706']} />
      </defs>
      <Ears kind="mouse" fill="#FFE4E6" inner="#FB7185" y={29} />
      {/* Glossy strawberries & mint atop cream */}
      <circle cx="40" cy="30" r="8" fill="#E11D48" stroke={INK} strokeWidth="2.4" />
      <circle cx="60" cy="30" r="8" fill="#E11D48" stroke={INK} strokeWidth="2.4" />
      <circle cx="50" cy="25" r="8.5" fill="#F43F5E" stroke={INK} strokeWidth="2.4" />
      <path d="M 55 19 Q 65 12 68 19 Q 61 23 55 19 Z" fill="#22C55E" stroke={INK} strokeWidth="2" />
      {/* Whipped cream ruffle */}
      <path d="M 22 40 Q 30 33 40 38 Q 50 32 60 38 Q 70 33 78 40 L 76 49 L 24 49 Z" fill="#FFFDF9" stroke={INK} strokeWidth="2.6" />
      {/* Pleated golden tart crust */}
      <path d="M 21 46 L 79 46 L 72 82 Q 70 86 64 86 L 36 86 Q 30 86 28 82 Z" fill={`url(#${gid('crust')})`} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      <Face eyeY={63} spread={12} eyes="happy" mouth="smile" cheek="#FB7185" />
    </g>
  ),

  'patisserie-eclair-pup': (gid) => (
    <g>
      <defs>
        <Grad id={gid('pastry')} stops={['#FEF3C7', '#F59E0B']} />
      </defs>
      <Ears kind="pup" fill="#78350F" y={34} />
      <ChefToque y={30} />
      {/* Oblong éclair pastry body */}
      <rect x="18" y="34" width="64" height="48" rx="22" fill={`url(#${gid('pastry')})`} stroke={INK} strokeWidth="3.2" />
      {/* Silky dark chocolate glaze top */}
      <path d="M 20 50 C 20 35 32 34 50 34 C 68 34 80 35 80 50 Q 70 55 62 49 Q 50 56 38 49 Q 30 55 20 50 Z" fill="#5C2D0C" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* White icing zigzag */}
      <path d="M 30 42 L 38 45 L 46 41 L 54 45 L 62 41 L 70 44" stroke="#FFFBEB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Face eyeY={63} spread={13} eyes="round" mouth="snout" cheek="#FDA4AF" />
    </g>
  ),

  'patisserie-crepe-cat': (gid) => (
    <g>
      <defs>
        <Grad id={gid('crepe')} stops={['#FEF08A', '#FBBF24']} />
      </defs>
      <Ears kind="cat" fill="#FFFDF9" inner="#F9A8D4" y={24} />
      {/* Fluffy cream & strawberries inside cone */}
      <circle cx="35" cy="29" r="8.5" fill="#E11D48" stroke={INK} strokeWidth="2.4" />
      <circle cx="65" cy="29" r="8.5" fill="#E11D48" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="50" cy="40" rx="27" ry="18" fill="#FFFDF9" stroke={INK} strokeWidth="3" />
      {/* Folded triangular crêpe cone & pink paper wrap */}
      <path d="M 20 52 L 80 52 L 50 93 Z" fill={`url(#${gid('crepe')})`} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M 30 65 L 70 65 L 50 93 Z" fill="#F472B6" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <Face eyeY={38} spread={11} eyes="happy" mouth="cat" cheek="#F9A8D4" />
    </g>
  ),

  'patisserie-mille-fox': (gid) => (
    <g>
      <defs>
        <Grad id={gid('caramel')} stops={['#FBBF24', '#D97706']} />
      </defs>
      <Ears kind="fox" fill="#D97706" inner="#FEF3C7" y={25} />
      <ChefToque y={26} />
      {/* Crisp multi-layered mille-feuille stack with spacious center cream band for face */}
      <rect x="20" y="32" width="60" height="11" rx="5" fill={`url(#${gid('caramel')})`} stroke={INK} strokeWidth="2.8" />
      <rect x="22" y="43" width="56" height="22" rx="4" fill="#FFFBEB" stroke={INK} strokeWidth="2.6" />
      <rect x="20" y="65" width="60" height="10" rx="5" fill={`url(#${gid('caramel')})`} stroke={INK} strokeWidth="2.8" />
      <rect x="22" y="75" width="56" height="10" rx="4" fill="#FEF3C7" stroke={INK} strokeWidth="2.6" />
      {/* Caramel feathered glaze on top layer */}
      <path d="M 28 37.5 L 72 37.5" stroke="#FFFBEB" strokeWidth="2.4" strokeDasharray="6 4" strokeLinecap="round" />
      <Face eyeY={52} spread={12} eyes="round" mouth="smile" cheek="#FDBA74" />
    </g>
  ),

  'patisserie-macaron-tower': (gid) => (
    <g>
      <defs>
        <Grad id={gid('lav')} stops={['#E9D5FF', '#C084FC']} />
        <Grad id={gid('mint')} stops={['#A7F3D0', '#34D399']} />
        <Grad id={gid('rose')} stops={['#FBCFE8', '#F472B6']} />
      </defs>
      <Ears kind="bunny" fill="#F3E8FF" inner="#F9A8D4" y={24} />
      {/* Bottom macaron (blush pink) */}
      <rect x="19" y="67" width="62" height="20" rx="10" fill={`url(#${gid('rose')})`} stroke={INK} strokeWidth="3" />
      <line x1="21" y1="77" x2="79" y2="77" stroke="#FFF1F2" strokeWidth="4" strokeLinecap="round" />
      {/* Middle macaron (mint) */}
      <rect x="23" y="45" width="54" height="22" rx="10" fill={`url(#${gid('mint')})`} stroke={INK} strokeWidth="3" />
      <line x1="25" y1="59" x2="75" y2="59" stroke="#ECFDF5" strokeWidth="3.2" strokeLinecap="round" opacity="0.65" />
      {/* Top macaron (lavender) */}
      <rect x="28" y="26" width="44" height="19" rx="9.5" fill={`url(#${gid('lav')})`} stroke={INK} strokeWidth="3" />
      <line x1="30" y1="35.5" x2="70" y2="35.5" stroke="#FAF5FF" strokeWidth="3.2" strokeLinecap="round" />
      <Face eyeY={52} spread={11} eyes="happy" mouth="cat" cheek="#FDA4AF" />
      <Sparkles items={[[18, 34, 4, '#FEF08A'], [82, 42, 4, '#FBCFE8']]} />
    </g>
  ),

  'patisserie-choco-swan': (gid) => (
    <g>
      <defs>
        <Grad id={gid('choco')} stops={['#9A3412', '#7C2D12', '#431407']} />
      </defs>
      {/* Spun-sugar cream swan wings */}
      <path d="M 28 54 C 7 32 6 62 20 74 C 26 76 31 70 32 62 Z" fill="#FFFBEB" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M 72 54 C 93 32 94 62 80 74 C 74 76 69 70 68 62 Z" fill="#FFFBEB" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      {/* Golden spun-sugar crown */}
      <path d="M 38 30 L 43 16 L 50 23 L 57 16 L 62 30 Z" fill="#FACC15" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* Velvet chocolate mousse body */}
      <ellipse cx="50" cy="56" rx="26" ry="27" fill={`url(#${gid('choco')})`} stroke={INK} strokeWidth="3.2" />
      {/* Cream swirl collar */}
      <path d="M 30 74 Q 40 69 50 74 Q 60 69 70 74" stroke="#FEF3C7" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <Face eyeY={53} spread={11} eyes="starry" mouth="beak" cheek="#FDBA74" dark />
    </g>
  ),

  'patisserie-golden-souffle': (gid) => (
    <g>
      <defs>
        <Grad id={gid('souffle')} stops={['#FEF9C3', '#FACC15', '#D97706']} />
      </defs>
      <Ears kind="bear" fill="#F59E0B" inner="#FEF9C3" y={23} />
      {/* Cloud-tall golden baked soufflé top */}
      <path d="M 24 54 C 22 24 34 18 50 18 C 66 18 78 24 76 54 Z" fill={`url(#${gid('souffle')})`} stroke={INK} strokeWidth="3.2" />
      {/* Fluted white porcelain ramekin */}
      <path d="M 21 53 L 79 53 L 74 84 Q 72 88 66 88 L 34 88 Q 28 88 26 84 Z" fill="#FFFDF9" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      <line x1="35" y1="57" x2="37" y2="83" stroke="#CBD5E1" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="50" y1="57" x2="50" y2="83" stroke="#CBD5E1" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="65" y1="57" x2="63" y2="83" stroke="#CBD5E1" strokeWidth="2.4" strokeLinecap="round" />
      {/* Gold ribbon band */}
      <rect x="21" y="51" width="58" height="6" rx="2.5" fill="#FACC15" stroke={INK} strokeWidth="2.2" />
      <Face eyeY={39} spread={11} eyes="starry" mouth="snout" cheek="#FB7185" />
      <Sparkles items={[[18, 28, 4.5, '#FEF08A'], [83, 28, 5, '#FEF08A']]} />
    </g>
  ),

  'patisserie-chroma-gateau': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      {/* Multi-tier celebration rainbow cake */}
      <rect x="16" y="64" width="68" height="22" rx="8" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="3" />
      <rect x="24" y="42" width="52" height="23" rx="8" fill={`url(#${gid('prism-soft')})`} stroke={INK} strokeWidth="3" />
      <rect x="33" y="24" width="34" height="19" rx="7" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="2.8" />
      {/* Piped buttercream swags */}
      <path d="M 26 46 Q 34 52 42 46 Q 50 52 58 46 Q 66 52 74 46" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M 18 68 Q 28 74 38 68 Q 50 74 62 68 Q 72 74 82 68" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* Golden topper star */}
      <Sparkles items={[[50, 14, 7.5, '#FACC15'], [17, 32, 4.5, '#F472B6'], [84, 34, 4.5, '#38BDF8']]} />
      <Face eyeY={54} spread={11} eyes="starry" mouth="happy" cheek="#F472B6" />
    </g>
  ),

  // =========================================================================
  // 44. FOUR-SEASON FAIRIES PACK (8)
  // =========================================================================
  'fairies-sakura-petal': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing')} stops={['#FCE7F3', '#F472B6']} diag />
      </defs>
      <FairyWings fill={`url(#${gid('wing')})`} double />
      <rect x="26" y="29" width="48" height="50" rx="22" fill="#FFF1F2" stroke={INK} strokeWidth="3.2" />
      {/* Pink sakura hair & 5-petal blossom crown */}
      <path d="M 27 42 Q 38 25 50 32 Q 62 25 73 42 Q 66 24 50 24 Q 34 24 27 42 Z" fill="#F472B6" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <g fill="#FBCFE8" stroke={INK} strokeWidth="1.8">
        <circle cx="43" cy="24" r="5" />
        <circle cx="57" cy="24" r="5" />
        <circle cx="50" cy="19" r="5.5" />
      </g>
      <circle cx="50" cy="23" r="3" fill="#FDE047" stroke={INK} strokeWidth="1.4" />
      <Face eyeY={53} spread={11} eyes="happy" mouth="smile" cheek="#F9A8D4" />
    </g>
  ),

  'fairies-daisy-dew': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing')} stops={['#FEF9C3', '#BAE6FD']} diag />
      </defs>
      <FairyWings fill={`url(#${gid('wing')})`} />
      {/* White daisy petals ringing the head */}
      <g fill="#FFFFFF" stroke={INK} strokeWidth="2.4">
        <ellipse cx="50" cy="19" rx="5.5" ry="9" />
        <ellipse cx="36" cy="23" rx="5.5" ry="9" transform="rotate(-30 36 23)" />
        <ellipse cx="64" cy="23" rx="5.5" ry="9" transform="rotate(30 64 23)" />
      </g>
      <rect x="26" y="30" width="48" height="49" rx="22" fill="#FEF9C3" stroke={INK} strokeWidth="3.2" />
      {/* Sparkling morning dewdrop */}
      <path d="M 80 18 Q 86 27 80 32 Q 74 27 80 18 Z" fill="#38BDF8" stroke={INK} strokeWidth="2" />
      <Face eyeY={54} spread={11} eyes="round" mouth="smile" cheek="#FDBA74" />
    </g>
  ),

  'fairies-sunflower-bee': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing')} stops={['#FEF08A', '#FB923C']} diag />
      </defs>
      <FairyWings fill={`url(#${gid('wing')})`} />
      {/* Sunny sunflower petal bonnet */}
      <g fill="#FACC15" stroke={INK} strokeWidth="2.2">
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
          <ellipse key={deg} cx="50" cy="21" rx="5.2" ry="9.5" transform={`rotate(${deg} 50 53)`} />
        ))}
      </g>
      <circle cx="50" cy="53" r="24" fill="#FEF3C7" stroke={INK} strokeWidth="3.2" />
      <Face eyeY={52} spread={11} eyes="happy" mouth="happy" cheek="#FB923C" />
    </g>
  ),

  'fairies-lotus-pond': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing')} stops={['#CCFBF1', '#2DD4BF']} diag />
      </defs>
      {/* Green lily pad base */}
      <ellipse cx="50" cy="83" rx="34" ry="8" fill="#16A34A" stroke={INK} strokeWidth="2.8" />
      <FairyWings fill={`url(#${gid('wing')})`} />
      {/* Layered pink lotus crown */}
      <path d="M 34 32 Q 36 16 50 22 Q 64 16 66 32 Z" fill="#F472B6" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M 43 30 Q 50 12 57 30 Z" fill="#FBCFE8" stroke={INK} strokeWidth="2.2" />
      <rect x="27" y="30" width="46" height="48" rx="21" fill="#E6FFFA" stroke={INK} strokeWidth="3.2" />
      {/* Floating glowing lotus lantern */}
      <circle cx="81" cy="70" r="7.5" fill="#F9A8D4" stroke={INK} strokeWidth="2.2" />
      <circle cx="81" cy="70" r="3" fill="#FEF08A" />
      <Face eyeY={53} spread={11} eyes="round" mouth="smile" cheek="#F9A8D4" />
    </g>
  ),

  'fairies-maple-breeze': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing')} stops={['#FDE047', '#F97316', '#DC2626']} diag />
      </defs>
      <FairyWings fill={`url(#${gid('wing')})`} double />
      {/* Autumn maple leaf crown */}
      <path d="M 50 10 L 55 21 L 66 17 L 60 27 L 68 31 L 32 31 L 40 27 L 34 17 L 45 21 Z" fill="#DC2626" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="26" y="30" width="48" height="49" rx="22" fill="#FFEDD5" stroke={INK} strokeWidth="3.2" />
      {/* Autumn scarf */}
      <path d="M 30 71 Q 50 78 70 71" stroke="#EA580C" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <Face eyeY={53} spread={11} eyes="happy" mouth="smile" cheek="#FB923C" />
      <Sparkles items={[[16, 24, 4.5, '#F97316'], [84, 26, 4.5, '#FACC15']]} />
    </g>
  ),

  'fairies-camellia-frost': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing')} stops={['#E0F2FE', '#38BDF8', '#0284C7']} diag />
      </defs>
      <FairyWings fill={`url(#${gid('wing')})`} double />
      <rect x="26" y="30" width="48" height="49" rx="22" fill="#F0F9FF" stroke={INK} strokeWidth="3.2" />
      {/* Rosy winter camellia flower perched on hair */}
      <g stroke={INK} strokeWidth="2">
        <circle cx="62" cy="27" r="7.5" fill="#E11D48" />
        <circle cx="56" cy="24" r="6" fill="#FB7185" />
        <circle cx="66" cy="32" r="5.5" fill="#F43F5E" />
        <circle cx="61" cy="27" r="3" fill="#FDE047" />
      </g>
      {/* Crystal snowflakes */}
      <Sparkles items={[[18, 22, 6, '#BAE6FD'], [84, 24, 5.5, '#FFFFFF'], [82, 74, 5, '#7DD3FC']]} />
      <Face eyeY={54} spread={11} eyes="starry" mouth="smile" cheek="#FDA4AF" />
    </g>
  ),

  'fairies-solstice-muse': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing')} stops={['#FDE047', '#C084FC', '#7C3AED']} diag />
      </defs>
      {/* Golden solstice wheel halo */}
      <circle cx="50" cy="44" r="36" fill="none" stroke="#FACC15" strokeWidth="3" strokeDasharray="6 4" />
      <FairyWings fill={`url(#${gid('wing')})`} double />
      <rect x="26" y="30" width="48" height="49" rx="22" fill="#EDE9FE" stroke={INK} strokeWidth="3.2" />
      {/* Solstice sun-and-crescent crown */}
      <path d="M 35 30 L 42 15 L 50 23 L 58 15 L 65 30 Z" fill="#FACC15" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="50" cy="22" r="3.5" fill="#7C3AED" stroke={INK} strokeWidth="1.4" />
      <Face eyeY={54} spread={11} eyes="starry" mouth="happy" cheek="#C084FC" />
      <Sparkles items={[[16, 18, 5, '#FEF08A'], [84, 18, 5, '#FEF08A']]} />
    </g>
  ),

  'fairies-chroma-four-seasons': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      <FairyWings fill={`url(#${gid('prism')})`} double />
      <rect x="26" y="30" width="48" height="49" rx="22" fill={`url(#${gid('prism-soft')})`} stroke={INK} strokeWidth="3.2" />
      {/* Four-season crown: sakura pink, sun gold, maple red, frost blue */}
      <g stroke={INK} strokeWidth="2">
        <circle cx="35" cy="28" r="5" fill="#F472B6" />
        <circle cx="45" cy="22" r="5.5" fill="#FACC15" />
        <circle cx="55" cy="22" r="5.5" fill="#EF4444" />
        <circle cx="65" cy="28" r="5" fill="#38BDF8" />
      </g>
      <Face eyeY={54} spread={11} eyes="starry" mouth="happy" cheek="#F472B6" />
      <Sparkles items={[[15, 22, 5.5, '#FEF08A'], [85, 22, 5.5, '#BAE6FD'], [50, 10, 5, '#F472B6']]} />
    </g>
  ),
};

export function renderPhase6Collectible(id: string, uid?: string): React.ReactNode | null {
  const renderer = PHASE6_RENDERERS[id];
  if (!renderer) return null;
  const safeUid = uid ?? 'p6';
  const gid: GidFn = (suffix) => `qv-p6-${id}-${safeUid}-${suffix}`;
  return renderer(gid);
}

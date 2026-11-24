import React from 'react';

const INK = '#1C1917';

type EyeStyle = 'round' | 'happy' | 'starry' | 'visor';
type MouthStyle = 'smile' | 'cat' | 'snout' | 'beak' | 'happy' | 'none';
type GidFn = (suffix: string) => string;

function Grad({
  id,
  stops,
  diag = false,
  horiz = false,
}: {
  id: string;
  stops: [string, string, ...string[]];
  diag?: boolean;
  horiz?: boolean;
}) {
  return (
    <linearGradient
      id={id}
      x1="0%"
      y1="0%"
      x2={diag || horiz ? '100%' : '0%'}
      y2={horiz ? '0%' : '100%'}
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
      <Grad
        id={gid('prism-deep')}
        stops={['#DB2777', '#F59E0B', '#10B981', '#2563EB', '#7C3AED']}
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

function Face({
  cx = 50,
  eyeY = 55,
  spread = 12,
  eyes = 'round',
  mouth = 'smile',
  cheek = '#FDA4AF',
  dark = false,
  whiskers = false,
}: {
  cx?: number;
  eyeY?: number;
  spread?: number;
  eyes?: EyeStyle;
  mouth?: MouthStyle;
  cheek?: string;
  dark?: boolean;
  whiskers?: boolean;
}) {
  const stroke = dark ? '#FFFBEB' : INK;
  const my = eyeY + 7.2;
  return (
    <g>
      {eyes === 'happy' ? (
        <g stroke={stroke} strokeWidth="3" strokeLinecap="round" fill="none">
          <path d={`M ${cx - spread - 4.4} ${eyeY + 1} Q ${cx - spread} ${eyeY - 4.6} ${cx - spread + 4.4} ${eyeY + 1}`} />
          <path d={`M ${cx + spread - 4.4} ${eyeY + 1} Q ${cx + spread} ${eyeY - 4.6} ${cx + spread + 4.4} ${eyeY + 1}`} />
        </g>
      ) : eyes === 'visor' ? (
        <g>
          <circle cx={cx - spread} cy={eyeY} r="4.2" fill="#38BDF8" />
          <circle cx={cx - spread + 1.2} cy={eyeY - 1.2} r="1.5" fill="#FFFFFF" />
          <circle cx={cx + spread} cy={eyeY} r="4.2" fill="#38BDF8" />
          <circle cx={cx + spread + 1.2} cy={eyeY - 1.2} r="1.5" fill="#FFFFFF" />
        </g>
      ) : dark ? (
        <g>
          <circle cx={cx - spread} cy={eyeY} r="4.9" fill="#FEF9C3" stroke={INK} strokeWidth="1.2" />
          <circle cx={cx - spread} cy={eyeY} r="2.7" fill={INK} />
          <circle cx={cx - spread + 1.3} cy={eyeY - 1.3} r="1.3" fill="#FFFFFF" />
          <circle cx={cx + spread} cy={eyeY} r="4.9" fill="#FEF9C3" stroke={INK} strokeWidth="1.2" />
          <circle cx={cx + spread} cy={eyeY} r="2.7" fill={INK} />
          <circle cx={cx + spread + 1.3} cy={eyeY - 1.3} r="1.3" fill="#FFFFFF" />
          {eyes === 'starry' && (
            <>
              <circle cx={cx - spread - 1.3} cy={eyeY + 1.4} r="1.1" fill="#FDE047" />
              <circle cx={cx + spread - 1.3} cy={eyeY + 1.4} r="1.1" fill="#FDE047" />
            </>
          )}
        </g>
      ) : (
        <g>
          <circle cx={cx - spread} cy={eyeY} r="4.3" fill={INK} />
          <circle cx={cx - spread + 1.4} cy={eyeY - 1.4} r="1.6" fill="#FFFFFF" />
          <circle cx={cx + spread} cy={eyeY} r="4.3" fill={INK} />
          <circle cx={cx + spread + 1.4} cy={eyeY - 1.4} r="1.6" fill="#FFFFFF" />
          {eyes === 'starry' && (
            <>
              <circle cx={cx - spread - 1.4} cy={eyeY + 1.6} r="1.1" fill="#FEF08A" />
              <circle cx={cx + spread - 1.4} cy={eyeY + 1.6} r="1.1" fill="#FEF08A" />
            </>
          )}
        </g>
      )}
      <g opacity="0.78">
        <ellipse cx={cx - spread - 5.8} cy={eyeY + 5.8} rx="4" ry="2.3" fill={cheek} />
        <ellipse cx={cx + spread + 5.8} cy={eyeY + 5.8} rx="4" ry="2.3" fill={cheek} />
      </g>
      {whiskers && (
        <g stroke={stroke} strokeWidth="1.7" strokeLinecap="round" opacity="0.78">
          <line x1={cx - 28} y1={eyeY + 3.5} x2={cx - 19} y2={eyeY + 5} />
          <line x1={cx - 27} y1={eyeY + 8.5} x2={cx - 19} y2={eyeY + 8} />
          <line x1={cx + 28} y1={eyeY + 3.5} x2={cx + 19} y2={eyeY + 5} />
          <line x1={cx + 27} y1={eyeY + 8.5} x2={cx + 19} y2={eyeY + 8} />
        </g>
      )}
      {mouth === 'beak' && (
        <polygon
          points={`${cx - 4.2},${my - 2} ${cx + 4.2},${my - 2} ${cx},${my + 4.8}`}
          fill="#F59E0B"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}
      {mouth === 'cat' && (
        <path
          d={`M ${cx - 5.6} ${my} Q ${cx - 2.8} ${my + 3.8} ${cx} ${my} Q ${cx + 2.8} ${my + 3.8} ${cx + 5.6} ${my}`}
          stroke={stroke}
          strokeWidth="2.3"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mouth === 'snout' && (
        <g>
          <ellipse cx={cx} cy={my - 1} rx="3.8" ry="2.5" fill={stroke} />
          <path
            d={`M ${cx - 4.2} ${my + 3.2} Q ${cx} ${my + 6.8} ${cx + 4.2} ${my + 3.2}`}
            stroke={stroke}
            strokeWidth="2.1"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}
      {mouth === 'happy' && (
        <path
          d={`M ${cx - 5.5} ${my - 0.8} Q ${cx} ${my + 6.2} ${cx + 5.5} ${my - 0.8}`}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mouth === 'smile' && (
        <path
          d={`M ${cx - 4.2} ${my} Q ${cx} ${my + 4.4} ${cx + 4.2} ${my}`}
          stroke={stroke}
          strokeWidth="2.3"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
}

function LuckyStar({
  cx,
  cy,
  r,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}) {
  const ir = r * 0.48;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (-90 + i * 36) * (Math.PI / 180);
    const rad = i % 2 === 0 ? r : ir;
    pts.push(`${(cx + Math.cos(angle) * rad).toFixed(1)},${(cy + Math.sin(angle) * rad).toFixed(1)}`);
  }
  return (
    <polygon
      points={pts.join(' ')}
      fill={fill}
      stroke={INK}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  );
}

const PHASE8_RENDERERS: Record<string, (gid: GidFn) => React.ReactNode> = {
  // =========================================================================
  // 45. GEOMETRY SPRITES PACK (8)
  // =========================================================================
  'geometry-cube-cub': (gid) => (
    <g>
      <defs>
        <Grad id={gid('front')} stops={['#EDE9FE', '#C4B5FD']} />
        <Grad id={gid('top')} stops={['#F5F3FF', '#DDD6FE']} horiz />
        <Grad id={gid('side')} stops={['#8B5CF6', '#6D28D9']} />
      </defs>
      {/* Bear ears perched on top isometric plane */}
      <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
        <circle cx="34" cy="24" r="8.5" fill="#A78BFA" />
        <circle cx="34" cy="24" r="4.2" fill="#F5F3FF" stroke="none" />
        <circle cx="67" cy="21" r="8.5" fill="#7C3AED" />
        <circle cx="67" cy="21" r="4.2" fill="#DDD6FE" stroke="none" />
      </g>
      {/* Top isometric face */}
      <polygon
        points="20,36 36,22 82,22 66,36"
        fill={`url(#${gid('top')})`}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Right isometric depth face */}
      <polygon
        points="66,36 82,22 82,69 66,83"
        fill={`url(#${gid('side')})`}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Front cube face */}
      <rect
        x="20"
        y="36"
        width="46"
        height="47"
        rx="4"
        fill={`url(#${gid('front')})`}
        stroke={INK}
        strokeWidth="3.1"
        strokeLinejoin="round"
      />
      {/* Subtle cube unit grid lines on top & right face */}
      <g stroke="#7C3AED" strokeWidth="1.4" opacity="0.45">
        <line x1="43" y1="36" x2="59" y2="22" />
        <line x1="28" y1="29" x2="74" y2="29" />
      </g>
      <g stroke="#EDE9FE" strokeWidth="1.4" opacity="0.45">
        <line x1="66" y1="60" x2="82" y2="46" />
        <line x1="74" y1="29" x2="74" y2="76" />
      </g>
      {/* Little block feet */}
      <rect x="25" y="81" width="12" height="7" rx="2.5" fill="#8B5CF6" stroke={INK} strokeWidth="2.4" />
      <rect x="49" y="81" width="12" height="7" rx="2.5" fill="#7C3AED" stroke={INK} strokeWidth="2.4" />
      {/* Mini floating isometric cube */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <polygon points="14,76 19,73 24,76 19,79" fill="#FDE047" />
        <polygon points="14,76 19,79 19,85 14,82" fill="#F59E0B" />
        <polygon points="24,76 19,79 19,85 24,82" fill="#D97706" />
      </g>
      <Face cx={43} eyeY={56} spread={10.5} eyes="happy" mouth="snout" cheek="#F472B6" />
    </g>
  ),

  'geometry-cone-kitten': (gid) => (
    <g>
      <defs>
        <Grad id={gid('fur')} stops={['#FFF5F7', '#FBCFE8']} />
        <Grad id={gid('cone')} stops={['#F472B6', '#DB2777']} diag />
        <clipPath id={gid('cone-clip')}>
          <polygon points="40,34 80,12 72,48" />
        </clipPath>
      </defs>
      {/* Left cat ear */}
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M 24 44 L 22 22 L 42 34 Z" fill="#FBCFE8" />
        <path d="M 26.5 39 L 25.5 27.5 L 36.5 34.5 Z" fill="#F472B6" stroke="none" />
        {/* Right cat ear peeking under tilted cone */}
        <path d="M 75 46 L 78 27 L 60 36 Z" fill="#FBCFE8" />
      </g>
      {/* Chubby kitten head */}
      <rect x="20" y="34" width="60" height="50" rx="22" fill={`url(#${gid('fur')})`} stroke={INK} strokeWidth="3.2" />
      {/* 45-degree angle arc indicator */}
      <path d="M 15 26 L 34 26 L 23 15" fill="none" stroke="#EC4899" strokeWidth="1.9" strokeLinecap="round" strokeDasharray="3 2.5" />
      <path d="M 27 26 A 7 7 0 0 0 29 21" fill="none" stroke="#EC4899" strokeWidth="1.9" />
      {/* Striped geometric party cone tilted at ~45 deg */}
      <g clipPath={`url(#${gid('cone-clip')})`}>
        <polygon points="40,34 80,12 72,48" fill={`url(#${gid('cone')})`} />
        <path d="M 46 25 L 78 39" stroke="#FEF08A" strokeWidth="5.5" />
        <path d="M 55 18 L 83 31" stroke="#38BDF8" strokeWidth="4.8" />
        <path d="M 65 13 L 85 22" stroke="#FFFFFF" strokeWidth="3.8" />
      </g>
      <polygon points="40,34 80,12 72,48" fill="none" stroke={INK} strokeWidth="2.9" strokeLinejoin="round" />
      {/* Elliptical cone base rim */}
      <ellipse
        cx="56"
        cy="41"
        rx="17.5"
        ry="4.2"
        transform="rotate(24 56 41)"
        fill="#FEF08A"
        stroke={INK}
        strokeWidth="2.5"
      />
      {/* Fluffy pom-pom at cone apex */}
      <circle cx="80" cy="12" r="5" fill="#FDE047" stroke={INK} strokeWidth="2.3" />
      {/* Cute little paws */}
      <ellipse cx="35" cy="84" rx="7.5" ry="4.8" fill="#F9A8D4" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="65" cy="84" rx="7.5" ry="4.8" fill="#F9A8D4" stroke={INK} strokeWidth="2.5" />
      <Face cx={50} eyeY={58} spread={12.5} eyes="round" mouth="cat" cheek="#F472B6" whiskers />
    </g>
  ),

  'geometry-hex-bee': (gid) => (
    <g>
      <defs>
        <Grad id={gid('gold')} stops={['#FEF08A', '#FACC15', '#D97706']} />
        <clipPath id={gid('hex-clip')}>
          <polygon points="50,22 76,37 76,67 50,82 24,67 24,37" />
        </clipPath>
      </defs>
      {/* Translucent geometric wings with hex veins */}
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <polygon points="27,42 9,28 9,50 25,58" fill="#E0F2FE" fillOpacity="0.9" />
        <polygon points="73,42 91,28 91,50 75,58" fill="#E0F2FE" fillOpacity="0.9" />
        <path d="M 14 36 L 20 43 L 14 48" fill="none" stroke="#38BDF8" strokeWidth="1.6" />
        <path d="M 86 36 L 80 43 L 86 48" fill="none" stroke="#38BDF8" strokeWidth="1.6" />
      </g>
      {/* Cute bobble antennae */}
      <g stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M 42 25 Q 37 14 31 15" />
        <path d="M 58 25 Q 63 14 69 15" />
      </g>
      <circle cx="30" cy="15" r="3.6" fill="#F59E0B" stroke={INK} strokeWidth="2.2" />
      <circle cx="70" cy="15" r="3.6" fill="#F59E0B" stroke={INK} strokeWidth="2.2" />
      {/* Tiny stinger triangle */}
      <polygon points="45,81 55,81 50,90" fill="#451A03" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* Hexagonal honeybee body + stripes */}
      <g clipPath={`url(#${gid('hex-clip')})`}>
        <polygon points="50,22 76,37 76,67 50,82 24,67 24,37" fill={`url(#${gid('gold')})`} />
        <rect x="20" y="62" width="60" height="7" fill="#451A03" />
        <rect x="20" y="73" width="60" height="7" fill="#451A03" />
        <rect x="20" y="22" width="60" height="9" fill="#451A03" />
      </g>
      <polygon points="50,22 76,37 76,67 50,82 24,67 24,37" fill="none" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      {/* Mini tessellated honeycomb cells */}
      <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <polygon points="82,66 88,69.5 88,76.5 82,80 76,76.5 76,69.5" fill="#FDE047" />
        <polygon points="88,76.5 94,80 94,87 88,90.5 82,87 82,80" fill="#F59E0B" />
        <polygon points="76,76.5 82,80 82,87 76,90.5 70,87 70,80" fill="#FBBF24" />
      </g>
      <Face cx={50} eyeY={46} spread={11} eyes="happy" mouth="smile" cheek="#FB7185" />
    </g>
  ),

  'geometry-tangram-fox': (gid) => (
    <g>
      <defs>
        <Grad id={gid('t1')} stops={['#FB923C', '#EA580C']} diag />
        <Grad id={gid('t2')} stops={['#FDBA74', '#F97316']} />
      </defs>
      {/* Piece 7: Parallelogram fluffy tail + cream tip */}
      <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
        <polygon points="62,74 84,56 91,68 69,86" fill="#EA580C" />
        <polygon points="78,61 84,56 91,68 83,70" fill="#FFF7ED" />
      </g>
      {/* Pieces 1 & 2: Two ear triangles */}
      <polygon points="22,42 20,14 44,30" fill="#EA580C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <polygon points="78,42 80,14 56,30" fill="#C2410C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* Piece 3: Central square/diamond forehead */}
      <polygon points="50,24 68,42 50,60 32,42" fill={`url(#${gid('t1')})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* Pieces 4 & 5: Left and right cheek medium triangles */}
      <polygon points="16,52 32,42 50,60 28,70" fill={`url(#${gid('t2')})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <polygon points="84,52 68,42 50,60 72,70" fill="#FB923C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* Piece 6: Large cream snout/chin triangle + chest triangle */}
      <polygon points="28,70 50,60 72,70 50,86" fill="#FFF7ED" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* Accent internal tangram seam */}
      <line x1="50" y1="60" x2="50" y2="86" stroke={INK} strokeWidth="1.6" opacity="0.35" />
      <polygon points="45,67 55,67 50,74" fill={INK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Expressive eyes & rosy cheeks */}
      <circle cx="38" cy="52" r="4.2" fill={INK} />
      <circle cx="39.3" cy="50.6" r="1.5" fill="#FFFFFF" />
      <circle cx="62" cy="52" r="4.2" fill={INK} />
      <circle cx="63.3" cy="50.6" r="1.5" fill="#FFFFFF" />
      <ellipse cx="29" cy="59" rx="3.8" ry="2.2" fill="#FB7185" opacity="0.8" />
      <ellipse cx="71" cy="59" rx="3.8" ry="2.2" fill="#FB7185" opacity="0.8" />
    </g>
  ),

  'geometry-compass-owl': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#3B82F6', '#1D4ED8']} />
        <Grad id={gid('brass')} stops={['#FEF08A', '#D97706']} diag />
      </defs>
      {/* Dashed blueprint circle arc behind owl */}
      <circle cx="50" cy="54" r="39" fill="none" stroke="#60A5FA" strokeWidth="2.4" strokeDasharray="5 4" />
      {/* Brass compass crown hinge at top */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <rect x="47" y="9" width="6" height="9" rx="2" fill={`url(#${gid('brass')})`} />
        <circle cx="50" cy="21" r="6" fill={`url(#${gid('brass')})`} />
        <circle cx="50" cy="21" r="2.2" fill="#1E3A8A" stroke="none" />
      </g>
      {/* Brass drafting compass legs acting as wings/pins */}
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M 27 42 L 13 78 L 21 80 L 32 54 Z" fill={`url(#${gid('brass')})`} />
        <path d="M 73 42 L 87 78 L 79 80 L 68 54 Z" fill={`url(#${gid('brass')})`} />
        {/* Sharp needle tip left, pencil tip right */}
        <polygon points="13,78 17,79 12,89" fill="#E2E8F0" />
        <polygon points="87,78 83,79 88,89" fill="#FDE047" />
      </g>
      {/* Owl ear tufts */}
      <polygon points="27,36 22,20 39,29" fill="#1D4ED8" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points="73,36 78,20 61,29" fill="#1D4ED8" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      {/* Round owl body */}
      <ellipse cx="50" cy="56" rx="26" ry="29" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3.2" />
      {/* Protractor semicircular belly with degree ticks */}
      <path d="M 32 71 A 18 16 0 0 1 68 71 Z" fill="#DBEAFE" stroke={INK} strokeWidth="2.2" />
      <g stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round">
        <line x1="50" y1="56" x2="50" y2="61" />
        <line x1="40" y1="59" x2="43" y2="63" />
        <line x1="60" y1="59" x2="57" y2="63" />
      </g>
      {/* Big brass-rimmed owl eyes */}
      <circle cx="39" cy="45" r="9" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.6" />
      <circle cx="61" cy="45" r="9" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.6" />
      <circle cx="39.5" cy="45" r="4.5" fill={INK} />
      <circle cx="41" cy="43.4" r="1.6" fill="#FFFFFF" />
      <circle cx="60.5" cy="45" r="4.5" fill={INK} />
      <circle cx="62" cy="43.4" r="1.6" fill="#FFFFFF" />
      {/* Cute beak */}
      <polygon points="46,51 54,51 50,58" fill="#F59E0B" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <Sparkles items={[[16, 22, 4, '#FEF08A'], [84, 24, 4, '#93C5FD']]} />
    </g>
  ),

  'geometry-spiral-snail': (gid) => (
    <g>
      <defs>
        <Grad id={gid('shell')} stops={['#FEF08A', '#F59E0B', '#059669']} diag />
        <Grad id={gid('body')} stops={['#A7F3D0', '#34D399']} />
      </defs>
      {/* Golden Fibonacci shell */}
      <circle cx="41" cy="47" r="28" fill={`url(#${gid('shell')})`} stroke={INK} strokeWidth="3.2" />
      {/* Subtle Fibonacci golden rectangle subdivisions */}
      <g stroke="#065F46" strokeWidth="1.4" opacity="0.45" fill="none">
        <rect x="21" y="27" width="40" height="40" rx="6" />
        <line x1="45" y1="27" x2="45" y2="67" />
        <line x1="45" y1="45" x2="61" y2="45" />
      </g>
      {/* Glowing golden logarithmic spiral */}
      <path
        d="M 42 47 C 42 43 47 43 47 47 C 47 53 38 54 36 47 C 34 38 46 33 54 39 C 62 46 58 61 44 64 C 28 67 18 52 22 36 C 26 22 44 17 57 24"
        fill="none"
        stroke="#FFFBEB"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M 42 47 C 42 43 47 43 47 47 C 47 53 38 54 36 47 C 34 38 46 33 54 39 C 62 46 58 61 44 64 C 28 67 18 52 22 36"
        fill="none"
        stroke="#B45309"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Cute snail body extending to the right */}
      <path
        d="M 15 79 Q 16 70 30 70 L 62 70 Q 67 52 79 52 Q 90 52 90 66 Q 90 83 72 83 L 22 83 Q 15 83 15 79 Z"
        fill={`url(#${gid('body')})`}
        stroke={INK}
        strokeWidth="3.1"
        strokeLinejoin="round"
      />
      {/* Snail eye stalks */}
      <g stroke={INK} strokeWidth="2.6" strokeLinecap="round">
        <line x1="74" y1="53" x2="70" y2="39" />
        <line x1="83" y1="54" x2="86" y2="40" />
      </g>
      <circle cx="69" cy="36" r="5.5" fill="#FFFFFF" stroke={INK} strokeWidth="2.4" />
      <circle cx="70" cy="36" r="2.7" fill={INK} />
      <circle cx="71" cy="34.8" r="1" fill="#FFFFFF" />
      <circle cx="86" cy="37" r="5.5" fill="#FFFFFF" stroke={INK} strokeWidth="2.4" />
      <circle cx="87" cy="37" r="2.7" fill={INK} />
      <circle cx="88" cy="35.8" r="1" fill="#FFFFFF" />
      {/* Snail smile & blush */}
      <ellipse cx="72" cy="68" rx="3.8" ry="2.2" fill="#FDA4AF" opacity="0.85" />
      <path d="M 75 68 Q 80 73 85 68" fill="none" stroke={INK} strokeWidth="2.3" strokeLinecap="round" />
      <Sparkles items={[[18, 22, 4.5, '#FEF08A'], [64, 20, 4, '#A7F3D0']]} />
    </g>
  ),

  'geometry-icosa-dragon': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing')} stops={['#38BDF8', '#6366F1']} diag />
        <Grad id={gid('core')} stops={['#A5B4FC', '#4F46E5', '#312E81']} diag />
      </defs>
      {/* Faceted crystal wings */}
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <polygon points="27,48 8,28 11,52 25,62" fill={`url(#${gid('wing')})`} />
        <polygon points="27,48 8,28 21,41" fill="#BAE6FD" opacity="0.7" />
        <polygon points="73,48 92,28 89,52 75,62" fill={`url(#${gid('wing')})`} />
        <polygon points="73,48 92,28 79,41" fill="#BAE6FD" opacity="0.7" />
      </g>
      {/* Crystal geometric horns */}
      <polygon points="34,28 26,10 44,23" fill="#38BDF8" stroke={INK} strokeWidth="2.7" strokeLinejoin="round" />
      <polygon points="66,28 74,10 56,23" fill="#38BDF8" stroke={INK} strokeWidth="2.7" strokeLinejoin="round" />
      {/* Outer icosahedron D20 silhouette */}
      <polygon
        points="50,18 76,34 76,68 50,86 24,68 24,34"
        fill={`url(#${gid('core')})`}
        stroke={INK}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Faceted D20 inner triangular plates */}
      <g stroke={INK} strokeWidth="1.9" strokeLinejoin="round">
        <polygon points="50,18 66,38 34,38" fill="#818CF8" />
        <polygon points="24,34 34,38 24,68" fill="#6366F1" />
        <polygon points="76,34 66,38 76,68" fill="#3730A3" />
        <polygon points="34,38 66,38 50,70" fill="#6366F1" />
        <polygon points="24,68 34,38 50,70" fill="#4F46E5" />
        <polygon points="76,68 66,38 50,70" fill="#4338CA" />
        <polygon points="24,68 50,70 50,86" fill="#3730A3" />
        <polygon points="76,68 50,70 50,86" fill="#312E81" />
      </g>
      {/* Glowing crown gem facet on forehead */}
      <polygon points="50,23 55,31 50,36 45,31" fill="#FEF08A" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Cute dragon face on central facet */}
      <Face cx={50} eyeY={51} spread={11} eyes="starry" mouth="happy" cheek="#F472B6" dark />
      <Sparkles items={[[15, 18, 4.5, '#FEF08A'], [85, 18, 4.5, '#38BDF8'], [50, 91, 3.8, '#C7D2FE']]} />
    </g>
  ),

  'geometry-chroma-prism': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      {/* Seven symmetric rainbow light beams fanning out */}
      <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round" opacity="0.9">
        <polygon points="50,50 14,18 24,12" fill="#F43F5E" />
        <polygon points="50,50 8,42 10,30" fill="#FB923C" />
        <polygon points="50,50 14,72 9,60" fill="#FACC15" />
        <polygon points="50,50 44,91 56,91" fill="#22C55E" />
        <polygon points="50,50 86,72 91,60" fill="#06B6D4" />
        <polygon points="50,50 92,42 90,30" fill="#6366F1" />
        <polygon points="50,50 86,18 76,12" fill="#A855F7" />
      </g>
      {/* Floating prismatic octahedron spirit body */}
      <polygon
        points="50,15 78,48 50,84 22,48"
        fill={`url(#${gid('prism')})`}
        stroke={INK}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Crystalline internal prism facets */}
      <polygon points="50,15 65,48 35,48" fill="#FFFFFF" fillOpacity="0.34" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <polygon points="35,48 65,48 50,84" fill={`url(#${gid('prism-soft')})`} fillOpacity="0.6" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Tiny orbiting geometric charms */}
      <circle cx="19" cy="28" r="4" fill="#FDE047" stroke={INK} strokeWidth="1.8" />
      <rect x="78" y="24" width="7" height="7" rx="1.2" transform="rotate(18 81 27)" fill="#38BDF8" stroke={INK} strokeWidth="1.8" />
      <polygon points="82,78 88,87 76,87" fill="#F472B6" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <Face cx={50} eyeY={49} spread={10.5} eyes="starry" mouth="happy" cheek="#F472B6" />
      <Sparkles items={[[50, 10.5, 4.2, '#FEF08A'], [18, 82, 4.2, '#A7F3D0']]} />
    </g>
  ),

  // =========================================================================
  // 46. SCIENCE LAB PALS PACK (8)
  // =========================================================================
  'sciencelab-beaker-bear': (gid) => (
    <g>
      <defs>
        <Grad id={gid('fur')} stops={['#FDE68A', '#D97706']} />
        <Grad id={gid('potion')} stops={['#38BDF8', '#F472B6']} horiz />
      </defs>
      {/* Bear ears */}
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <circle cx="27" cy="24" r="9.5" fill="#B45309" />
        <circle cx="27" cy="24" r="4.8" fill="#FDE68A" stroke="none" />
        <circle cx="73" cy="24" r="9.5" fill="#B45309" />
        <circle cx="73" cy="24" r="4.8" fill="#FDE68A" stroke="none" />
      </g>
      {/* Bear head & white lab coat shoulders */}
      <rect x="21" y="24" width="58" height="48" rx="21" fill={`url(#${gid('fur')})`} stroke={INK} strokeWidth="3.2" />
      <path d="M 24 68 L 76 68 L 80 88 Q 80 91 75 91 L 25 91 Q 20 91 20 88 Z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 41 68 L 50 78 L 59 68" fill="#0EA5E9" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* Oversized safety goggles strap & rims */}
      <rect x="19" y="38" width="62" height="7" rx="3" fill="#0284C7" stroke={INK} strokeWidth="2.2" />
      <rect x="25" y="33" width="23" height="19" rx="7" fill="#E0F2FE" stroke={INK} strokeWidth="2.8" />
      <rect x="52" y="33" width="23" height="19" rx="7" fill="#E0F2FE" stroke={INK} strokeWidth="2.8" />
      {/* Eyes inside goggles */}
      <circle cx="37" cy="43" r="4.2" fill={INK} />
      <circle cx="38.4" cy="41.5" r="1.5" fill="#FFFFFF" />
      <circle cx="63" cy="43" r="4.2" fill={INK} />
      <circle cx="64.4" cy="41.5" r="1.5" fill="#FFFFFF" />
      {/* Goggle glare */}
      <line x1="29" y1="38" x2="33" y2="36" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="56" y1="38" x2="60" y2="36" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      {/* Cute bear snout */}
      <ellipse cx="50" cy="59" rx="8.5" ry="6.2" fill="#FFFBEB" />
      <ellipse cx="50" cy="57" rx="3.6" ry="2.4" fill={INK} />
      <path d="M 46 61.5 Q 50 65 54 61.5" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="29" cy="56" rx="3.8" ry="2.2" fill="#FB7185" opacity="0.75" />
      <ellipse cx="71" cy="56" rx="3.8" ry="2.2" fill="#FB7185" opacity="0.75" />
      {/* Bubbling graduated beaker held on right */}
      <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M 65 65 L 87 65 L 85 89 Q 85 92 81 92 L 71 92 Q 67 92 67 89 Z" fill="#E0F2FE" />
        <path d="M 66.5 76 Q 76 73 85.5 76 L 85 89 Q 85 91 81 91 L 71 91 Q 67 91 67 89 Z" fill={`url(#${gid('potion')})`} stroke="none" />
        <line x1="69" y1="73" x2="74" y2="73" strokeWidth="1.6" />
        <line x1="69" y1="80" x2="74" y2="80" strokeWidth="1.6" />
        <line x1="69" y1="86" x2="74" y2="86" strokeWidth="1.6" />
        <circle cx="74" cy="60" r="3.4" fill="#38BDF8" />
        <circle cx="81" cy="55" r="2.6" fill="#F472B6" />
        <circle cx="77" cy="49" r="2" fill="#FEF08A" />
      </g>
    </g>
  ),

  'sciencelab-magnet-mouse': (gid) => (
    <g>
      <defs>
        <Grad id={gid('red')} stops={['#FB7185', '#E11D48', '#BE123C']} />
        <Grad id={gid('mouse')} stops={['#F8FAFC', '#CBD5E1']} />
      </defs>
      {/* Giant U-shaped horseshoe magnet framing the mouse */}
      <path
        d="M 16 26 L 16 58 A 34 32 0 0 0 84 58 L 84 26 L 71 26 L 71 57 A 21 20 0 0 1 29 57 L 29 26 Z"
        fill={`url(#${gid('red')})`}
        stroke={INK}
        strokeWidth="3.1"
        strokeLinejoin="round"
      />
      {/* Gleaming silver magnetic pole tips */}
      <rect x="16" y="16" width="13" height="13" rx="2" fill="#E2E8F0" stroke={INK} strokeWidth="2.8" />
      <rect x="71" y="16" width="13" height="13" rx="2" fill="#E2E8F0" stroke={INK} strokeWidth="2.8" />
      {/* Magnetic field arcs & floating paperclips */}
      <path d="M 32 14 Q 50 7 68 14" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3.5 3" strokeLinecap="round" />
      <g stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round">
        <rect x="10" y="9" width="7" height="3.6" rx="1.8" transform="rotate(-24 13 11)" stroke="#64748B" />
        <rect x="82" y="9" width="7" height="3.6" rx="1.8" transform="rotate(24 85 11)" stroke="#64748B" />
      </g>
      {/* Cute mouse peeking snugly inside the horseshoe */}
      <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
        <circle cx="35" cy="36" r="10" fill="#CBD5E1" />
        <circle cx="35" cy="36" r="5.5" fill="#FDA4AF" stroke="none" />
        <circle cx="65" cy="36" r="10" fill="#CBD5E1" />
        <circle cx="65" cy="36" r="5.5" fill="#FDA4AF" stroke="none" />
      </g>
      <ellipse cx="50" cy="54" rx="21" ry="19" fill={`url(#${gid('mouse')})`} stroke={INK} strokeWidth="3" />
      {/* Tiny pink mouse nose */}
      <ellipse cx="50" cy="59" rx="3.4" ry="2.3" fill="#F43F5E" stroke={INK} strokeWidth="1.5" />
      <Face cx={50} eyeY={52} spread={9.5} eyes="round" mouth="smile" cheek="#FDA4AF" whiskers />
      <Sparkles items={[[50, 12, 4, '#FEF08A']]} />
    </g>
  ),

  'sciencelab-microscope-owl': (gid) => (
    <g>
      <defs>
        <Grad id={gid('owl')} stops={['#38BDF8', '#0284C7']} />
        <Grad id={gid('metal')} stops={['#F8FAFC', '#94A3B8']} diag />
      </defs>
      {/* Microscope base & slide stage at bottom */}
      <rect x="20" y="83" width="60" height="8" rx="4" fill="#334155" stroke={INK} strokeWidth="2.8" />
      <rect x="29" y="76" width="42" height="5" rx="2" fill="#BAE6FD" stroke={INK} strokeWidth="2" />
      {/* Owl ear tufts */}
      <polygon points="27,32 22,16 39,25" fill="#0369A1" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points="73,32 78,16 61,25" fill="#0369A1" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      {/* Owl body */}
      <rect x="24" y="24" width="52" height="54" rx="22" fill={`url(#${gid('owl')})`} stroke={INK} strokeWidth="3.2" />
      {/* Crisp white lab belly */}
      <ellipse cx="50" cy="64" rx="16" ry="11" fill="#F0F9FF" />
      {/* Brass side focus knob */}
      <circle cx="80" cy="56" r="6" fill="#FACC15" stroke={INK} strokeWidth="2.4" />
      <circle cx="80" cy="56" r="2.2" fill="#B45309" />
      {/* Left regular owl eye */}
      <circle cx="38" cy="45" r="9.5" fill="#FFFFFF" stroke={INK} strokeWidth="2.6" />
      <circle cx="38.5" cy="45" r="4.5" fill={INK} />
      <circle cx="40" cy="43.5" r="1.6" fill="#FFFFFF" />
      {/* Right zoomed 400x microscope objective lens eye! */}
      <rect x="52" y="33" width="22" height="24" rx="9" fill={`url(#${gid('metal')})`} stroke={INK} strokeWidth="2.8" />
      <circle cx="63" cy="45" r="8.2" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.4" />
      {/* Tiny sparkling snowflake/cell zoomed inside the lens */}
      <g stroke="#7DD3FC" strokeWidth="1.6" strokeLinecap="round">
        <line x1="63" y1="40" x2="63" y2="50" />
        <line x1="58.5" y1="42.5" x2="67.5" y2="47.5" />
        <line x1="67.5" y1="42.5" x2="58.5" y2="47.5" />
      </g>
      <circle cx="63" cy="45" r="2" fill="#FEF08A" />
      {/* Cute orange owl beak */}
      <polygon points="46,52 54,52 50,59" fill="#F59E0B" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <Sparkles items={[[15, 24, 4, '#BAE6FD'], [86, 26, 4.2, '#FEF08A']]} />
    </g>
  ),

  'sciencelab-prism-bunny': (gid) => (
    <g>
      <defs>
        <Grad id={gid('fur')} stops={['#FFFFFF', '#EDE9FE']} />
        <Grad id={gid('glass')} stops={['#E0F2FE', '#C084FC', '#FFFFFF']} diag />
      </defs>
      {/* Incoming white light beam from left */}
      <polygon points="8,62 42,67 42,72 8,69" fill="#FEF08A" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Outgoing split rainbow spectrum on right */}
      <g stroke={INK} strokeWidth="1.1" strokeLinejoin="round">
        <polygon points="58,66 92,55 92,61 58,69" fill="#F43F5E" />
        <polygon points="58,68 92,61 92,67 58,71" fill="#FACC15" />
        <polygon points="58,70 92,67 92,73 58,73" fill="#22C55E" />
        <polygon points="58,72 92,73 92,79 58,75" fill="#38BDF8" />
        <polygon points="58,74 92,79 92,85 58,77" fill="#A855F7" />
      </g>
      {/* Tall bunny ears */}
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <ellipse cx="37" cy="24" rx="7" ry="15" transform="rotate(-10 37 24)" fill="#F5F3FF" />
        <ellipse cx="37" cy="25" rx="3.4" ry="9.5" transform="rotate(-10 37 25)" fill="#F9A8D4" stroke="none" />
        <ellipse cx="63" cy="24" rx="7" ry="15" transform="rotate(10 63 24)" fill="#F5F3FF" />
        <ellipse cx="63" cy="25" rx="3.4" ry="9.5" transform="rotate(10 63 25)" fill="#F9A8D4" stroke="none" />
      </g>
      {/* Plump bunny head/body */}
      <rect x="23" y="33" width="54" height="51" rx="22" fill={`url(#${gid('fur')})`} stroke={INK} strokeWidth="3.2" />
      <Face cx={50} eyeY={50} spread={12} eyes="starry" mouth="cat" cheek="#F472B6" />
      {/* Equilateral crystal optics prism held by bunny paws */}
      <polygon
        points="50,59 64,83 36,83"
        fill={`url(#${gid('glass')})`}
        fillOpacity="0.92"
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <line x1="50" y1="64" x2="43" y2="79" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      {/* Cute little paws gripping prism */}
      <circle cx="36" cy="76" r="5" fill="#EDE9FE" stroke={INK} strokeWidth="2.4" />
      <circle cx="64" cy="76" r="5" fill="#EDE9FE" stroke={INK} strokeWidth="2.4" />
    </g>
  ),

  'sciencelab-flask-frog': (gid) => (
    <g>
      <defs>
        <Grad id={gid('frog')} stops={['#86EFAC', '#22C55E']} />
        <Grad id={gid('glow')} stops={['#6EE7B7', '#10B981', '#047857']} />
      </defs>
      {/* Glowing Erlenmeyer flask silhouette behind/around lower body */}
      <path
        d="M 40 16 L 60 16 L 60 33 L 84 78 Q 87 86 78 88 L 22 88 Q 13 86 16 78 L 40 33 Z"
        fill="#ECFDF5"
        stroke={INK}
        strokeWidth="3.1"
        strokeLinejoin="round"
      />
      {/* Swirling emerald potion inside flask */}
      <path
        d="M 27 59 Q 39 54 50 59 Q 61 64 73 59 L 83 78 Q 85 85 77 86 L 23 86 Q 15 85 17 78 Z"
        fill={`url(#${gid('glow')})`}
      />
      {/* Flask rim lip */}
      <rect x="36" y="12" width="28" height="6" rx="3" fill="#A7F3D0" stroke={INK} strokeWidth="2.6" />
      {/* Floating glowing bubbles */}
      <g stroke={INK} strokeWidth="1.9">
        <circle cx="24" cy="28" r="5" fill="#6EE7B7" />
        <circle cx="77" cy="30" r="4.2" fill="#A7F3D0" />
        <circle cx="72" cy="18" r="3" fill="#FEF08A" />
      </g>
      {/* Cute frog perched & peeking right in the center of the flask! */}
      <g stroke={INK} strokeWidth="2.8">
        <circle cx="36" cy="40" r="8.5" fill={`url(#${gid('frog')})`} />
        <circle cx="64" cy="40" r="8.5" fill={`url(#${gid('frog')})`} />
      </g>
      <ellipse cx="50" cy="58" rx="24" ry="19" fill={`url(#${gid('frog')})`} stroke={INK} strokeWidth="3" />
      <ellipse cx="50" cy="65" rx="15" ry="9.5" fill="#DCFCE7" />
      {/* Big glossy frog eyes */}
      <circle cx="36" cy="40" r="4.5" fill={INK} />
      <circle cx="37.4" cy="38.5" r="1.6" fill="#FFFFFF" />
      <circle cx="64" cy="40" r="4.5" fill={INK} />
      <circle cx="65.4" cy="38.5" r="1.6" fill="#FFFFFF" />
      {/* Wide frog smile & rosy cheeks */}
      <path d="M 38 58 Q 50 67 62 58" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <ellipse cx="32" cy="56" rx="4.2" ry="2.4" fill="#FDA4AF" opacity="0.82" />
      <ellipse cx="68" cy="56" rx="4.2" ry="2.4" fill="#FDA4AF" opacity="0.82" />
      {/* Glass glare stripe */}
      <line x1="25" y1="67" x2="21" y2="79" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    </g>
  ),

  'sciencelab-atom-cat': (gid) => (
    <g>
      <defs>
        <Grad id={gid('velvet')} stops={['#3B82F6', '#1E3A8A']} />
      </defs>
      {/* Back orbital rings */}
      <g fill="none" stroke="#38BDF8" strokeWidth="2.4" opacity="0.9">
        <ellipse cx="50" cy="52" rx="41" ry="15" transform="rotate(-32 50 52)" />
        <ellipse cx="50" cy="52" rx="41" ry="15" transform="rotate(32 50 52)" />
        <ellipse cx="50" cy="52" rx="16" ry="39" />
      </g>
      {/* Velvet cat ears */}
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M 28 42 L 25 20 L 44 33 Z" fill="#1E40AF" />
        <path d="M 30 37 L 28.5 25.5 L 39 33 Z" fill="#60A5FA" stroke="none" />
        <path d="M 72 42 L 75 20 L 56 33 Z" fill="#1E40AF" />
        <path d="M 70 37 L 71.5 25.5 L 61 33 Z" fill="#60A5FA" stroke="none" />
      </g>
      {/* Velvet kitty head */}
      <rect x="25" y="32" width="50" height="44" rx="20" fill={`url(#${gid('velvet')})`} stroke={INK} strokeWidth="3.1" />
      {/* Glowing nucleus gem on forehead */}
      <circle cx="50" cy="39" r="3.6" fill="#FDE047" stroke={INK} strokeWidth="1.5" />
      <Face cx={50} eyeY={53} spread={11} eyes="starry" mouth="cat" cheek="#F472B6" dark whiskers />
      {/* Three glowing orbiting electrons */}
      <g stroke={INK} strokeWidth="2.2">
        <circle cx="15" cy="34" r="5" fill="#38BDF8" />
        <circle cx="85" cy="34" r="5" fill="#F472B6" />
        <circle cx="50" cy="89" r="5" fill="#FDE047" />
      </g>
      <circle cx="16.5" cy="32.5" r="1.5" fill="#FFFFFF" />
      <circle cx="86.5" cy="32.5" r="1.5" fill="#FFFFFF" />
      <circle cx="51.5" cy="87.5" r="1.5" fill="#FFFFFF" />
    </g>
  ),

  'sciencelab-telescope-wolf': (gid) => (
    <g>
      <defs>
        <Grad id={gid('sky')} stops={['#1E1B4B', '#4338CA']} />
        <Grad id={gid('wolf')} stops={['#6366F1', '#312E81']} />
        <Grad id={gid('brass')} stops={['#FEF08A', '#D97706']} diag />
      </defs>
      {/* Midnight observatory dome arch backdrop */}
      <path d="M 12 84 A 38 38 0 0 1 88 84 Z" fill={`url(#${gid('sky')})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* Dome brass slit trim */}
      <path d="M 48 46 Q 55 24 66 20" fill="none" stroke="#FACC15" strokeWidth="2.2" opacity="0.7" />
      {/* Little ringed planet in the dome sky */}
      <circle cx="72" cy="24" r="5.5" fill="#F472B6" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="72" cy="24" rx="10" ry="2.6" transform="rotate(-18 72 24)" fill="none" stroke="#FDE047" strokeWidth="1.9" />
      {/* Wolf ears */}
      <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
        <polygon points="24,44 21,21 39,34" fill="#312E81" />
        <polygon points="26,39 24.5,26.5 34.5,34" fill="#A5B4FC" stroke="none" />
        <polygon points="56,44 59,21 41,34" fill="#312E81" />
        <polygon points="54,39 55.5,26.5 45.5,34" fill="#A5B4FC" stroke="none" />
      </g>
      {/* Star wolf head & fluffy cheek ruff */}
      <path
        d="M 19 58 Q 16 34 40 34 Q 64 34 61 58 L 65 65 L 57 71 Q 51 82 40 82 Q 29 82 23 71 L 15 65 Z"
        fill={`url(#${gid('wolf')})`}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Silver-white muzzle & forehead crescent */}
      <ellipse cx="40" cy="69" rx="13" ry="9" fill="#E0E7FF" />
      <path d="M 40 40 A 4.2 4.2 0 1 0 43.5 46 A 3.4 3.4 0 1 1 40 40 Z" fill="#FDE047" />
      <Face cx={40} eyeY={56} spread={9.5} eyes="starry" mouth="snout" cheek="#818CF8" dark />
      {/* Brass rooftop telescope on mini tripod */}
      <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
        <line x1="72" y1="68" x2="64" y2="87" />
        <line x1="72" y1="68" x2="80" y2="87" />
        <polygon points="62,67 86,44 91,51 67,73" fill={`url(#${gid('brass')})`} />
        <ellipse cx="88.5" cy="47.5" rx="3" ry="5.5" transform="rotate(-40 88.5 47.5)" fill="#BAE6FD" />
      </g>
      <Sparkles items={[[18, 18, 4, '#FEF08A'], [86, 15, 3.8, '#BAE6FD']]} />
    </g>
  ),

  'sciencelab-chroma-nebula': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      {/* Swirling stardust aura behind alchemist */}
      <circle cx="50" cy="54" r="37" fill={`url(#${gid('prism-soft')})`} opacity="0.55" />
      <circle cx="50" cy="54" r="37" fill="none" stroke={`url(#${gid('prism')})`} strokeWidth="2.8" strokeDasharray="6 4" />
      {/* Alchemist critter body/cloak */}
      <path d="M 24 54 Q 24 38 50 38 Q 76 38 76 54 L 78 83 Q 78 88 70 88 L 30 88 Q 22 88 22 83 Z" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="3.1" strokeLinejoin="round" />
      {/* Soft inner face hood */}
      <ellipse cx="50" cy="58" rx="20" ry="17" fill="#FFFBEB" stroke={INK} strokeWidth="2.6" />
      {/* Pointed prismatic alchemist hat */}
      <path d="M 24 41 L 50 9 L 76 41 Z" fill={`url(#${gid('prism-deep')})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="50" cy="41" rx="31" ry="6.5" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="2.8" />
      {/* Brass lab goggles perched on hat brim */}
      <circle cx="42" cy="36" r="5.5" fill="#BAE6FD" stroke="#D97706" strokeWidth="2.3" />
      <circle cx="58" cy="36" r="5.5" fill="#FBCFE8" stroke="#D97706" strokeWidth="2.3" />
      {/* Glowing rainbow round-bottom potion flask at front */}
      <g stroke={INK} strokeWidth="2.3" strokeLinejoin="round">
        <rect x="46" y="70" width="8" height="6" rx="1.5" fill="#E0F2FE" />
        <circle cx="50" cy="82" r="8.5" fill={`url(#${gid('prism')})`} />
        <circle cx="47.5" cy="80" r="2.2" fill="#FFFFFF" stroke="none" opacity="0.7" />
      </g>
      <Face cx={50} eyeY={57} spread={9.5} eyes="starry" mouth="happy" cheek="#F472B6" />
      <Sparkles items={[[15, 24, 5, '#FEF08A'], [85, 24, 5, '#38BDF8'], [16, 76, 4.2, '#F472B6'], [84, 76, 4.2, '#34D399']]} />
    </g>
  ),

  // =========================================================================
  // 47. POCKET ROBO SQUAD PACK (8)
  // =========================================================================
  'robosquad-pixel-pup': (gid) => (
    <g>
      <defs>
        <Grad id={gid('teal')} stops={['#5EEAD4', '#0D9488']} />
        <Grad id={gid('brass')} stops={['#FEF08A', '#D97706']} diag />
      </defs>
      {/* Gleaming brass gear tail wagging on the right */}
      <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
        <circle cx="83" cy="64" r="9" fill={`url(#${gid('brass')})`} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="81"
            y="52"
            width="4"
            height="4"
            rx="0.8"
            transform={`rotate(${deg} 83 64)`}
            fill="#F59E0B"
          />
        ))}
        <circle cx="83" cy="64" r="3.4" fill="#CCFBF1" />
      </g>
      {/* Hinged mechanical floppy puppy ears with rivets */}
      <g stroke={INK} strokeWidth="2.9" strokeLinejoin="round">
        <rect x="12" y="34" width="13" height="28" rx="6" fill="#0F766E" />
        <circle cx="18.5" cy="40" r="2.4" fill="#FACC15" strokeWidth="1.4" />
        <rect x="69" y="34" width="13" height="28" rx="6" fill="#0F766E" />
        <circle cx="75.5" cy="40" r="2.4" fill="#FACC15" strokeWidth="1.4" />
      </g>
      {/* Antenna */}
      <line x1="47" y1="24" x2="47" y2="15" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="47" cy="13" r="4.2" fill="#FACC15" stroke={INK} strokeWidth="2.2" />
      {/* Square Blooket robo-puppy chassis */}
      <rect x="21" y="24" width="52" height="54" rx="16" fill={`url(#${gid('teal')})`} stroke={INK} strokeWidth="3.2" />
      {/* Dark glossy LED visor faceplate */}
      <rect x="28" y="34" width="38" height="22" rx="9" fill="#0F172A" stroke={INK} strokeWidth="2.4" />
      {/* Glowing cyan LED eyes */}
      <Face cx={47} eyeY={45} spread={9.5} eyes="visor" mouth="none" cheek="#2DD4BF" />
      {/* Cute metallic puppy snout & bolt collar */}
      <ellipse cx="47" cy="63" rx="9" ry="6.2" fill="#F0FDFA" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="47" cy="61" rx="3.4" ry="2.2" fill={INK} />
      <path d="M 43 65 Q 47 68 51 65" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <rect x="29" y="75" width="36" height="7" rx="3.5" fill="#F59E0B" stroke={INK} strokeWidth="2.3" />
      <circle cx="47" cy="83" r="4.2" fill="#FDE047" stroke={INK} strokeWidth="2.1" />
    </g>
  ),

  'robosquad-solar-cat': (gid) => (
    <g>
      <defs>
        <Grad id={gid('sun')} stops={['#FEF9C3', '#FACC15']} />
        <Grad id={gid('panel')} stops={['#1D4ED8', '#1E3A8A']} diag />
      </defs>
      {/* Sun rays halo behind */}
      <g stroke="#F59E0B" strokeWidth="2.6" strokeLinecap="round">
        <line x1="50" y1="9" x2="50" y2="16" />
        <line x1="16" y1="24" x2="22" y2="28" />
        <line x1="84" y1="24" x2="78" y2="28" />
        <line x1="11" y1="50" x2="17" y2="50" />
        <line x1="89" y1="50" x2="83" y2="50" />
      </g>
      {/* Grid-lined blue solar panel ears */}
      <g stroke={INK} strokeWidth="2.9" strokeLinejoin="round">
        <polygon points="24,42 20,17 44,31" fill={`url(#${gid('panel')})`} />
        <polygon points="76,42 80,17 56,31" fill={`url(#${gid('panel')})`} />
      </g>
      {/* Crisp white photovoltaic grid lines on ears */}
      <g stroke="#93C5FD" strokeWidth="1.3">
        <line x1="25" y1="27" x2="38" y2="33" />
        <line x1="29" y1="23" x2="29" y2="38" />
        <line x1="75" y1="27" x2="62" y2="33" />
        <line x1="71" y1="23" x2="71" y2="38" />
      </g>
      {/* Sleek robo-kitty body */}
      <rect x="21" y="30" width="58" height="55" rx="20" fill={`url(#${gid('sun')})`} stroke={INK} strokeWidth="3.2" />
      {/* White face panel */}
      <rect x="27" y="36" width="46" height="28" rx="12" fill="#FFFFFF" stroke={INK} strokeWidth="2.2" />
      <Face cx={50} eyeY={49} spread={11} eyes="happy" mouth="cat" cheek="#FB923C" whiskers />
      {/* Glowing 3-bar full green battery gauge on chest */}
      <rect x="34" y="69" width="29" height="11" rx="3" fill="#0F172A" stroke={INK} strokeWidth="2.3" />
      <rect x="63" y="72" width="4" height="5" rx="1" fill="#64748B" stroke={INK} strokeWidth="1.8" />
      <rect x="37" y="71.5" width="6.5" height="6" rx="1" fill="#4ADE80" />
      <rect x="45.2" y="71.5" width="6.5" height="6" rx="1" fill="#4ADE80" />
      <rect x="53.5" y="71.5" width="6.5" height="6" rx="1" fill="#4ADE80" />
    </g>
  ),

  'robosquad-hover-duck': (gid) => (
    <g>
      <defs>
        <Grad id={gid('duck')} stops={['#FEF08A', '#FACC15', '#EAB308']} />
        <Grad id={gid('jet')} stops={['#67E8F9', '#0284C7']} />
      </defs>
      {/* Twin glowing turquoise hover air cushions underneath */}
      <ellipse cx="30" cy="87" rx="14" ry="4" fill="#67E8F9" stroke="#0284C7" strokeWidth="2" />
      <ellipse cx="70" cy="87" rx="14" ry="4" fill="#67E8F9" stroke="#0284C7" strokeWidth="2" />
      <polygon points="22,71 38,71 34,84 26,84" fill="#A5F3FC" opacity="0.85" />
      <polygon points="62,71 78,71 74,84 66,84" fill="#A5F3FC" opacity="0.85" />
      {/* Twin side hover-jet thruster pods */}
      <rect x="12" y="48" width="16" height="24" rx="6" fill={`url(#${gid('jet')})`} stroke={INK} strokeWidth="2.8" />
      <rect x="72" y="48" width="16" height="24" rx="6" fill={`url(#${gid('jet')})`} stroke={INK} strokeWidth="2.8" />
      <line x1="15" y1="56" x2="25" y2="56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="56" x2="85" y2="56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      {/* Aerodynamic robo-crest */}
      <path d="M 44 25 L 50 11 L 58 25 Z" fill="#0284C7" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* Cute round metallic duckling body */}
      <rect x="24" y="23" width="52" height="52" rx="22" fill={`url(#${gid('duck')})`} stroke={INK} strokeWidth="3.2" />
      {/* Sky-blue helmet stripe */}
      <path d="M 32 27 Q 50 21 68 27" fill="none" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" />
      {/* Bright eyes & blush */}
      <circle cx="39" cy="46" r="4.6" fill={INK} />
      <circle cx="40.5" cy="44.5" r="1.6" fill="#FFFFFF" />
      <circle cx="61" cy="46" r="4.6" fill={INK} />
      <circle cx="62.5" cy="44.5" r="1.6" fill="#FFFFFF" />
      <ellipse cx="32" cy="53" rx="3.8" ry="2.2" fill="#FB7185" opacity="0.75" />
      <ellipse cx="68" cy="53" rx="3.8" ry="2.2" fill="#FB7185" opacity="0.75" />
      {/* Wide glossy orange duck bill */}
      <ellipse cx="50" cy="57" rx="11.5" ry="5.5" fill="#F97316" stroke={INK} strokeWidth="2.6" />
      <path d="M 42 57 Q 50 61 58 57" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  ),

  'robosquad-code-hamster': (gid) => (
    <g>
      <defs>
        <Grad id={gid('ham')} stops={['#FDBA74', '#EA580C']} />
      </defs>
      {/* Metallic hamster ears */}
      <g stroke={INK} strokeWidth="2.9">
        <circle cx="25" cy="26" r="9.5" fill="#EA580C" />
        <circle cx="25" cy="26" r="4.8" fill="#E2E8F0" stroke="none" />
        <circle cx="75" cy="26" r="9.5" fill="#EA580C" />
        <circle cx="75" cy="26" r="4.8" fill="#E2E8F0" stroke="none" />
      </g>
      {/* Plump chubby robo-hamster body */}
      <rect x="17" y="25" width="66" height="60" rx="25" fill={`url(#${gid('ham')})`} stroke={INK} strokeWidth="3.2" />
      {/* Cream belly & puffed binary cheeks */}
      <ellipse cx="50" cy="64" rx="25" ry="18" fill="#FFF7ED" />
      {/* Glowing dark pixel screen on forehead/belly */}
      <rect x="29" y="61" width="42" height="17" rx="5" fill="#0F172A" stroke={INK} strokeWidth="2.4" />
      {/* Crisp vector binary digits: 1 0 1 0 */}
      <g stroke="#4ADE80" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* 1 */}
        <line x1="36" y1="65" x2="36" y2="74" />
        {/* 0 */}
        <rect x="42" y="65" width="6" height="9" rx="2.5" />
        {/* 1 */}
        <line x1="54" y1="65" x2="54" y2="74" />
        {/* 0 */}
        <rect x="60" y="65" width="6" height="9" rx="2.5" />
      </g>
      {/* Cute hamster eyes, tiny pink nose & puffed cheek pouches */}
      <circle cx="37" cy="44" r="4.5" fill={INK} />
      <circle cx="38.5" cy="42.5" r="1.6" fill="#FFFFFF" />
      <circle cx="63" cy="44" r="4.5" fill={INK} />
      <circle cx="64.5" cy="42.5" r="1.6" fill="#FFFFFF" />
      <ellipse cx="26" cy="52" rx="6.5" ry="4.5" fill="#FDA4AF" opacity="0.85" />
      <ellipse cx="74" cy="52" rx="6.5" ry="4.5" fill="#FDA4AF" opacity="0.85" />
      <polygon points="47,49 53,49 50,53" fill="#F43F5E" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M 45 55 Q 50 58.5 55 55" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  ),

  'robosquad-radar-panda': (gid) => (
    <g>
      <defs>
        <Grad id={gid('white')} stops={['#FFFFFF', '#E2E8F0']} />
        <Grad id={gid('dish')} stops={['#DCFCE7', '#86EFAC']} />
      </defs>
      {/* Parabolic satellite dish mounted on top */}
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <line x1="50" y1="34" x2="50" y2="24" strokeWidth="3.2" />
        <path d="M 32 24 Q 50 32 68 24 Q 64 13 50 13 Q 36 13 32 24 Z" fill={`url(#${gid('dish')})`} />
        <line x1="50" y1="22" x2="50" y2="11" />
        <circle cx="50" cy="10" r="3" fill="#22C55E" />
      </g>
      {/* Green radar signal waves */}
      <g fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round">
        <path d="M 62 12 Q 70 12 73 19" />
        <path d="M 67 8 Q 78 9 82 19" />
      </g>
      {/* Classic dark steel panda ears */}
      <circle cx="26" cy="36" r="9.5" fill="#1E293B" stroke={INK} strokeWidth="3" />
      <circle cx="74" cy="36" r="9.5" fill="#1E293B" stroke={INK} strokeWidth="3" />
      {/* Round white robo-panda chassis */}
      <rect x="20" y="34" width="60" height="51" rx="22" fill={`url(#${gid('white')})`} stroke={INK} strokeWidth="3.2" />
      {/* Dark metallic panda eye patches */}
      <ellipse cx="37" cy="56" rx="9" ry="7.2" transform="rotate(-14 37 56)" fill="#1E293B" stroke={INK} strokeWidth="2" />
      <ellipse cx="63" cy="56" rx="9" ry="7.2" transform="rotate(14 63 56)" fill="#1E293B" stroke={INK} strokeWidth="2" />
      {/* Glowing emerald LED pupils */}
      <circle cx="38" cy="56" r="3.6" fill="#4ADE80" />
      <circle cx="39.2" cy="54.8" r="1.3" fill="#FFFFFF" />
      <circle cx="62" cy="56" r="3.6" fill="#4ADE80" />
      <circle cx="63.2" cy="54.8" r="1.3" fill="#FFFFFF" />
      {/* Panda snout & cute metallic cheek bolts */}
      <ellipse cx="50" cy="65" rx="4.2" ry="2.7" fill={INK} />
      <path d="M 45.5 70 Q 50 74 54.5 70" fill="none" stroke={INK} strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="27" cy="65" r="3.2" fill="#86EFAC" stroke={INK} strokeWidth="1.6" />
      <circle cx="73" cy="65" r="3.2" fill="#86EFAC" stroke={INK} strokeWidth="1.6" />
    </g>
  ),

  'robosquad-laser-penguin': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#4F46E5', '#1E1B4B']} />
        <Grad id={gid('visor')} stops={['#67E8F9', '#818CF8']} horiz />
        <Grad id={gid('beam')} stops={['#67E8F9', '#A5B4FC']} horiz />
      </defs>
      {/* Projected holographic star-map beam to the right */}
      <polygon points="62,40 93,20 93,64 62,50" fill={`url(#${gid('beam')})`} fillOpacity="0.34" />
      <g stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.85">
        <line x1="74" y1="36" x2="84" y2="30" />
        <line x1="84" y1="30" x2="88" y2="45" />
        <line x1="74" y1="36" x2="79" y2="51" />
        <line x1="79" y1="51" x2="88" y2="45" />
      </g>
      <Sparkles items={[[84, 30, 3.6, '#FEF08A'], [74, 36, 3.2, '#67E8F9'], [88, 45, 3.4, '#C4B5FD'], [79, 51, 3, '#FEF08A']]} />
      {/* Penguin flippers */}
      <ellipse cx="18" cy="60" rx="7" ry="15" transform="rotate(18 18 60)" fill="#312E81" stroke={INK} strokeWidth="2.8" />
      <ellipse cx="66" cy="60" rx="7" ry="15" transform="rotate(-18 66 60)" fill="#312E81" stroke={INK} strokeWidth="2.8" />
      {/* Penguin feet */}
      <ellipse cx="32" cy="86" rx="8.5" ry="4.5" fill="#F97316" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="52" cy="86" rx="8.5" ry="4.5" fill="#F97316" stroke={INK} strokeWidth="2.5" />
      {/* Sleek cyber penguin body */}
      <rect x="20" y="22" width="44" height="63" rx="22" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3.2" />
      {/* Frosty white belly */}
      <ellipse cx="42" cy="66" rx="15" ry="16" fill="#F8FAFC" />
      {/* Wrap-around glowing holo-visor */}
      <rect x="22" y="36" width="42" height="15" rx="7.5" fill={`url(#${gid('visor')})`} stroke={INK} strokeWidth="2.7" />
      {/* Visor glossy gleam */}
      <line x1="28" y1="41" x2="38" y2="41" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      {/* Cute orange robo beak */}
      <polygon points="37,52 47,52 42,59" fill="#F59E0B" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="29" cy="56" rx="3.4" ry="2" fill="#F472B6" opacity="0.75" />
      <ellipse cx="55" cy="56" rx="3.4" ry="2" fill="#F472B6" opacity="0.75" />
    </g>
  ),

  'robosquad-mecha-griffin': (gid) => (
    <g>
      <defs>
        <Grad id={gid('silver')} stops={['#F8FAFC', '#CBD5E1', '#64748B']} diag />
        <Grad id={gid('violet')} stops={['#A78BFA', '#6D28D9']} />
      </defs>
      {/* Articulated silver mecha feather wings */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <polygon points="28,46 8,24 14,42 26,52" fill={`url(#${gid('silver')})`} />
        <polygon points="26,54 9,46 15,61 27,62" fill="#CBD5E1" />
        <polygon points="28,62 15,66 22,76 31,70" fill="#A78BFA" />
        <polygon points="72,46 92,24 86,42 74,52" fill={`url(#${gid('silver')})`} />
        <polygon points="74,54 91,46 85,61 73,62" fill="#CBD5E1" />
        <polygon points="72,62 85,66 78,76 69,70" fill="#A78BFA" />
      </g>
      {/* Armored tufted ears */}
      <polygon points="30,34 24,14 43,26" fill={`url(#${gid('violet')})`} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points="70,34 76,14 57,26" fill={`url(#${gid('violet')})`} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      {/* Armored titanium head & chest */}
      <rect x="26" y="25" width="48" height="54" rx="18" fill={`url(#${gid('silver')})`} stroke={INK} strokeWidth="3.1" />
      {/* Forehead V-crest */}
      <polygon points="39,25 50,35 61,25" fill={`url(#${gid('violet')})`} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* Glowing violet logic core on chest */}
      <polygon points="50,65 56,71 50,77 44,71" fill="#C4B5FD" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* Armored paws */}
      <rect x="30" y="77" width="12" height="9" rx="4" fill="#94A3B8" stroke={INK} strokeWidth="2.5" />
      <rect x="58" y="77" width="12" height="9" rx="4" fill="#94A3B8" stroke={INK} strokeWidth="2.5" />
      {/* Expressive eyes & gleaming golden cyber beak */}
      <circle cx="39" cy="47" r="4.6" fill="#4C1D95" />
      <circle cx="40.4" cy="45.5" r="1.6" fill="#FFFFFF" />
      <circle cx="61" cy="47" r="4.6" fill="#4C1D95" />
      <circle cx="62.4" cy="45.5" r="1.6" fill="#FFFFFF" />
      <polygon points="45,53 55,53 50,61" fill="#FACC15" stroke={INK} strokeWidth="2.3" strokeLinejoin="round" />
      <ellipse cx="32" cy="54" rx="3.4" ry="2" fill="#C084FC" opacity="0.8" />
      <ellipse cx="68" cy="54" rx="3.4" ry="2" fill="#C084FC" opacity="0.8" />
      <Sparkles items={[[18, 16, 4, '#FEF08A'], [82, 16, 4, '#C4B5FD']]} />
    </g>
  ),

  'robosquad-chroma-core': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      {/* Prismatic gyroscopic quantum rings */}
      <ellipse cx="50" cy="52" rx="39" ry="14" transform="rotate(-24 50 52)" fill="none" stroke={`url(#${gid('prism')})`} strokeWidth="3.4" />
      <ellipse cx="50" cy="52" rx="39" ry="14" transform="rotate(24 50 52)" fill="none" stroke={`url(#${gid('prism-deep')})`} strokeWidth="2.8" />
      {/* Floating detached hover-antennas */}
      <polygon points="27,25 22,12 35,20" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <polygon points="73,25 78,12 65,20" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* Sleek pearl-white spherical quantum droid chassis */}
      <circle cx="50" cy="52" r="27" fill="#FFFFFF" stroke={INK} strokeWidth="3.2" />
      {/* Iridescent trim arc */}
      <path d="M 27 42 A 26 26 0 0 1 73 42" fill="none" stroke={`url(#${gid('prism')})`} strokeWidth="4.5" strokeLinecap="round" />
      {/* Dark glass digital faceplate */}
      <rect x="30" y="39" width="40" height="22" rx="10" fill="#0F172A" stroke={INK} strokeWidth="2.4" />
      {/* Rainbow starry digital eyes */}
      <circle cx="41" cy="50" r="4.5" fill="#F472B6" />
      <circle cx="42.4" cy="48.5" r="1.6" fill="#FFFFFF" />
      <circle cx="59" cy="50" r="4.5" fill="#38BDF8" />
      <circle cx="60.4" cy="48.5" r="1.6" fill="#FFFFFF" />
      <path d="M 46 54 Q 50 58 54 54" fill="none" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" />
      {/* Glowing rainbow quantum core at base */}
      <polygon points="50,65 56,71 50,77 44,71" fill={`url(#${gid('prism')})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* Floating prismatic qubits */}
      <rect x="12" y="25" width="7" height="7" rx="1.5" transform="rotate(20 15 28)" fill="#38BDF8" stroke={INK} strokeWidth="1.8" />
      <rect x="81" y="72" width="7" height="7" rx="1.5" transform="rotate(-18 84 75)" fill="#F472B6" stroke={INK} strokeWidth="1.8" />
      <Sparkles items={[[50, 14, 4.8, '#FEF08A'], [15, 76, 4.2, '#34D399'], [85, 22, 4.2, '#F472B6']]} />
    </g>
  ),

  // =========================================================================
  // 48. ORIGAMI CRITTERS PACK (8)
  // =========================================================================
  'origami-sakura-crane': (gid) => (
    <g>
      <defs>
        <Grad id={gid('wing-l')} stops={['#FDF2F8', '#FBCFE8']} diag />
        <Grad id={gid('wing-r')} stops={['#FBCFE8', '#F472B6']} diag />
        <Grad id={gid('body')} stops={['#F9A8D4', '#EC4899']} />
      </defs>
      {/* Left outstretched origami wing */}
      <polygon points="44,54 9,25 24,62" fill={`url(#${gid('wing-l')})`} stroke={INK} strokeWidth="2.9" strokeLinejoin="round" />
      <line x1="44" y1="54" x2="17" y2="43" stroke="#EC4899" strokeWidth="1.5" opacity="0.55" />
      {/* Right outstretched origami wing */}
      <polygon points="56,54 91,25 76,62" fill={`url(#${gid('wing-r')})`} stroke={INK} strokeWidth="2.9" strokeLinejoin="round" />
      <line x1="56" y1="54" x2="83" y2="43" stroke="#BE185D" strokeWidth="1.5" opacity="0.45" />
      {/* Upward-folded origami tail */}
      <polygon points="58,64 81,22 72,72" fill="#F472B6" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      {/* Upward-folded neck & pointed crane head */}
      <polygon points="42,64 26,22 36,20 48,54" fill="#FBCFE8" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points="26,22 14,31 31,32" fill="#EC4899" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* Central diamond faceted crane body */}
      <polygon points="50,42 66,64 50,82 34,64" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <polygon points="50,42 66,64 50,64" fill="#FDF2F8" fillOpacity="0.45" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Tiny sakura blossom pattern printed on wing & body */}
      <g fill="#FFFFFF" stroke="#DB2777" strokeWidth="1">
        <circle cx="23" cy="46" r="2.4" />
        <circle cx="77" cy="46" r="2.4" />
        <circle cx="50" cy="70" r="2.8" />
      </g>
      {/* Cute glossy eye & blush on crane head */}
      <circle cx="29" cy="26" r="2.5" fill={INK} />
      <circle cx="29.8" cy="25.2" r="0.9" fill="#FFFFFF" />
      <ellipse cx="32" cy="30" rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.8" />
      <Sparkles items={[[50, 16, 4.2, '#FBCFE8'], [14, 72, 3.8, '#FEF08A']]} />
    </g>
  ),

  'origami-paper-frog': (gid) => (
    <g>
      <defs>
        <Grad id={gid('mint')} stops={['#DCFCE7', '#4ADE80']} />
        <Grad id={gid('dark')} stops={['#22C55E', '#15803D']} />
      </defs>
      {/* Accordion-folded Z-spring back legs */}
      <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
        <polygon points="28,68 11,64 17,84 35,80" fill={`url(#${gid('dark')})`} />
        <polygon points="11,64 25,75 17,84" fill="#86EFAC" />
        <polygon points="72,68 89,64 83,84 65,80" fill={`url(#${gid('dark')})`} />
        <polygon points="89,64 75,75 83,84" fill="#86EFAC" />
      </g>
      {/* Front pointed folded legs */}
      <polygon points="33,44 13,44 25,58" fill="#4ADE80" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points="67,44 87,44 75,58" fill="#4ADE80" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      {/* Diamond origami frog torso */}
      <polygon points="50,18 74,48 64,82 36,82 26,48" fill={`url(#${gid('mint')})`} stroke={INK} strokeWidth="3.1" strokeLinejoin="round" />
      {/* Crisp origami paper crease facets */}
      <polygon points="50,18 74,48 50,62" fill="#22C55E" fillOpacity="0.45" stroke={INK} strokeWidth="1.9" strokeLinejoin="round" />
      <polygon points="50,18 26,48 50,62" fill="#BBF7D0" fillOpacity="0.65" stroke={INK} strokeWidth="1.9" strokeLinejoin="round" />
      <polygon points="36,82 50,62 64,82" fill="#16A34A" stroke={INK} strokeWidth="2.1" strokeLinejoin="round" />
      {/* Spring motion arrows */}
      <path d="M 45 12 L 50 7 L 55 12" fill="none" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Cute glossy frog eyes & rosy cheeks */}
      <circle cx="38" cy="40" r="4.3" fill={INK} />
      <circle cx="39.3" cy="38.6" r="1.5" fill="#FFFFFF" />
      <circle cx="62" cy="40" r="4.3" fill={INK} />
      <circle cx="63.3" cy="38.6" r="1.5" fill="#FFFFFF" />
      <ellipse cx="32" cy="48" rx="3.8" ry="2.1" fill="#FDA4AF" opacity="0.82" />
      <ellipse cx="68" cy="48" rx="3.8" ry="2.1" fill="#FDA4AF" opacity="0.82" />
      <path d="M 45 48 Q 50 53 55 48" fill="none" stroke={INK} strokeWidth="2.3" strokeLinecap="round" />
    </g>
  ),

  'origami-kite-fox': (gid) => (
    <g>
      <defs>
        <Grad id={gid('org')} stops={['#FDBA74', '#EA580C']} diag />
      </defs>
      {/* Folded triangular seated body */}
      <polygon points="50,52 76,86 24,86" fill="#EA580C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* Angled origami tail folded around the right */}
      <polygon points="62,72 88,58 82,86 58,86" fill="#F97316" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points="77,64 88,58 86,73" fill="#FFF7ED" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* Tall diamond-creased tangerine origami ears */}
      <polygon points="24,42 20,11 45,28" fill="#F97316" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <polygon points="24,42 20,11 33,31" fill="#EA580C" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points="76,42 80,11 55,28" fill="#F97316" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <polygon points="76,42 80,11 67,31" fill="#C2410C" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Iconic origami kite-base fox head */}
      <polygon points="50,23 80,44 50,67 20,44" fill={`url(#${gid('org')})`} stroke={INK} strokeWidth="3.1" strokeLinejoin="round" />
      {/* Crisp white paper folded cheek flaps */}
      <polygon points="20,44 38,50 50,67" fill="#FFF7ED" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <polygon points="80,44 62,50 50,67" fill="#FFEDD5" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* Central vertical paper fold crease */}
      <line x1="50" y1="23" x2="50" y2="61" stroke={INK} strokeWidth="1.6" opacity="0.35" />
      {/* Cute eyes, rosy cheeks & pointed nose */}
      <circle cx="38" cy="43" r="4" fill={INK} />
      <circle cx="39.3" cy="41.7" r="1.4" fill="#FFFFFF" />
      <circle cx="62" cy="43" r="4" fill={INK} />
      <circle cx="63.3" cy="41.7" r="1.4" fill="#FFFFFF" />
      <ellipse cx="32" cy="50" rx="3.4" ry="2" fill="#FB7185" opacity="0.8" />
      <ellipse cx="68" cy="50" rx="3.4" ry="2" fill="#FB7185" opacity="0.8" />
      <polygon points="46.5,62 53.5,62 50,67" fill={INK} />
    </g>
  ),

  'origami-star-whale': (gid) => (
    <g>
      <defs>
        <Grad id={gid('whale')} stops={['#60A5FA', '#2563EB']} diag />
      </defs>
      {/* Spout lines + puffed origami lucky stars */}
      <path d="M 41 44 Q 36 28 24 22" fill="none" stroke="#93C5FD" strokeWidth="2.4" strokeDasharray="3.5 3" strokeLinecap="round" />
      <path d="M 44 44 Q 48 25 60 18" fill="none" stroke="#93C5FD" strokeWidth="2.4" strokeDasharray="3.5 3" strokeLinecap="round" />
      <LuckyStar cx={21} cy={20} r={6.8} fill="#F9A8D4" />
      <LuckyStar cx={42} cy={15} r={7.5} fill="#FEF08A" />
      <LuckyStar cx={62} cy={18} r={6.5} fill="#A7F3D0" />
      <LuckyStar cx={78} cy={28} r={5.4} fill="#DDD6FE" />
      {/* Folded origami whale tail flukes */}
      <polygon points="71,68 89,44 82,66" fill="#2563EB" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points="71,68 92,62 80,76" fill="#1D4ED8" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      {/* Faceted blue origami whale body */}
      <polygon points="12,62 24,42 56,42 76,66 56,82 22,82" fill={`url(#${gid('whale')})`} stroke={INK} strokeWidth="3.1" strokeLinejoin="round" />
      {/* Crisp origami paper crease facets */}
      <polygon points="24,42 56,42 46,66" fill="#93C5FD" fillOpacity="0.55" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      {/* White folded belly triangle */}
      <polygon points="12,62 48,66 56,82 22,82" fill="#EFF6FF" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* Side origami flipper */}
      <polygon points="44,67 60,73 48,86" fill="#3B82F6" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* Cute whale eye, cheek & smile */}
      <circle cx="29" cy="58" r="4.2" fill={INK} />
      <circle cx="30.3" cy="56.6" r="1.5" fill="#FFFFFF" />
      <ellipse cx="36" cy="65" rx="3.8" ry="2.2" fill="#FDA4AF" opacity="0.82" />
      <path d="M 16 70 Q 25 76 34 71" fill="none" stroke={INK} strokeWidth="2.3" strokeLinecap="round" />
    </g>
  ),

  'origami-fan-peacock': (gid) => (
    <g>
      <defs>
        <Grad id={gid('body')} stops={['#2DD4BF', '#0F766E']} />
      </defs>
      {/* Accordion-pleated origami fan tail (7 alternating crisp folds) */}
      <g stroke={INK} strokeWidth="2.3" strokeLinejoin="round">
        <polygon points="50,64 11,48 16,32" fill="#0D9488" />
        <polygon points="50,64 16,32 29,20" fill="#2DD4BF" />
        <polygon points="50,64 29,20 43,14" fill="#0F766E" />
        <polygon points="50,64 43,14 57,14" fill="#2DD4BF" />
        <polygon points="50,64 57,14 71,20" fill="#0F766E" />
        <polygon points="50,64 71,20 84,32" fill="#2DD4BF" />
        <polygon points="50,64 84,32 89,48" fill="#0D9488" />
      </g>
      {/* Gold & cobalt origami diamond feather-eyes on the pleated fan */}
      <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
        <polygon points="21,36 25,31 27,37 23,41" fill="#FACC15" />
        <polygon points="36,24 40,20 42,26 38,30" fill="#FACC15" />
        <polygon points="50,19 54,24 50,29 46,24" fill="#FACC15" />
        <polygon points="64,24 60,20 58,26 62,30" fill="#FACC15" />
        <polygon points="79,36 75,31 73,37 77,41" fill="#FACC15" />
      </g>
      {/* Folded peacock crest */}
      <polygon points="45,42 41,31 49,39" fill="#FACC15" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <polygon points="55,42 59,31 51,39" fill="#FACC15" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* Faceted origami peacock body */}
      <polygon points="50,37 68,58 59,86 41,86 32,58" fill={`url(#${gid('body')})`} stroke={INK} strokeWidth="3.1" strokeLinejoin="round" />
      <polygon points="50,37 68,58 50,70" fill="#5EEAD4" fillOpacity="0.45" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Folded wing facets */}
      <polygon points="32,58 43,72 35,82" fill="#0F766E" stroke={INK} strokeWidth="2.3" strokeLinejoin="round" />
      <polygon points="68,58 57,72 65,82" fill="#0F766E" stroke={INK} strokeWidth="2.3" strokeLinejoin="round" />
      {/* Cute eyes, blush & golden origami beak */}
      <circle cx="42" cy="53" r="3.8" fill={INK} />
      <circle cx="43.2" cy="51.8" r="1.3" fill="#FFFFFF" />
      <circle cx="58" cy="53" r="3.8" fill={INK} />
      <circle cx="59.2" cy="51.8" r="1.3" fill="#FFFFFF" />
      <ellipse cx="37" cy="59" rx="3" ry="1.8" fill="#FDA4AF" opacity="0.82" />
      <ellipse cx="63" cy="59" rx="3" ry="1.8" fill="#FDA4AF" opacity="0.82" />
      <polygon points="46,58 54,58 50,65" fill="#F59E0B" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </g>
  ),

  'origami-lotus-swan': (gid) => (
    <g>
      <defs>
        <Grad id={gid('lotus')} stops={['#FFFFFF', '#E9D5FF', '#C084FC']} />
        <Grad id={gid('swan')} stops={['#FFFFFF', '#F3E8FF']} diag />
      </defs>
      {/* Back folded lotus petals */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <polygon points="14,72 28,50 42,74" fill="#E9D5FF" />
        <polygon points="86,72 72,50 58,74" fill="#E9D5FF" />
        <polygon points="24,82 10,64 38,70" fill="#D8B4FE" />
        <polygon points="76,82 90,64 62,70" fill="#D8B4FE" />
      </g>
      {/* Layered origami swan wings */}
      <polygon points="42,64 85,38 74,72" fill={`url(#${gid('swan')})`} stroke={INK} strokeWidth="2.9" strokeLinejoin="round" />
      <polygon points="48,66 78,48 70,74" fill="#F3E8FF" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* Graceful angular origami S-neck & swan head */}
      <polygon points="33,66 23,30 34,20 43,29 38,34 45,64" fill="#FFFFFF" stroke={INK} strokeWidth="2.9" strokeLinejoin="round" />
      {/* Tiny golden origami beak */}
      <polygon points="23,30 14,34 25,36" fill="#FACC15" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* Cute serene eye & lavender blush */}
      <circle cx="29" cy="28" r="2.6" fill={INK} />
      <circle cx="29.8" cy="27.2" r="0.9" fill="#FFFFFF" />
      <ellipse cx="33" cy="31.5" rx="2.4" ry="1.4" fill="#F472B6" opacity="0.8" />
      {/* Front crisp white & lilac folded lotus blossom base */}
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <polygon points="22,78 36,61 50,84" fill={`url(#${gid('lotus')})`} />
        <polygon points="78,78 64,61 50,84" fill={`url(#${gid('lotus')})`} />
        <polygon points="34,84 50,62 66,84" fill="#FFFFFF" />
      </g>
      <Sparkles items={[[18, 18, 4.2, '#E9D5FF'], [82, 22, 4.5, '#FEF08A']]} />
    </g>
  ),

  'origami-gold-koi': (gid) => (
    <g>
      <defs>
        <Grad id={gid('gold1')} stops={['#FFFBEB', '#FDE047', '#D97706']} diag />
        <Grad id={gid('gold2')} stops={['#FEF08A', '#F59E0B', '#B45309']} />
      </defs>
      {/* Dramatic pleated fan-folded origami koi tail */}
      <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
        <polygon points="68,66 91,48 84,68" fill={`url(#${gid('gold1')})`} />
        <polygon points="68,66 92,72 80,84" fill={`url(#${gid('gold2')})`} />
        <polygon points="68,66 86,60 88,73" fill="#FEF08A" />
      </g>
      {/* Crisp origami pectoral fins */}
      <polygon points="37,48 16,34 28,58" fill="#F59E0B" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <polygon points="44,70 30,87 52,80" fill="#D97706" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* Arched gilded foil koi body made of overlapping chevron pleats */}
      <polygon points="14,56 32,32 58,36 74,64 56,76 28,74" fill={`url(#${gid('gold1')})`} stroke={INK} strokeWidth="3.1" strokeLinejoin="round" />
      {/* Overlapping origami foil pleat creases */}
      <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <polygon points="32,32 46,52 28,74" fill="#FDE047" fillOpacity="0.65" />
        <polygon points="45,34 59,54 42,75" fill="#F59E0B" fillOpacity="0.55" />
        <polygon points="58,36 74,64 56,76" fill="#D97706" fillOpacity="0.65" />
      </g>
      {/* Auspicious crimson paper diamond mark on forehead */}
      <polygon points="24,44 30,48 25,53 19,49" fill="#EF4444" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Cute glossy koi eye & whisker */}
      <circle cx="24" cy="59" r="3.8" fill={INK} />
      <circle cx="25.2" cy="57.8" r="1.4" fill="#FFFFFF" />
      <path d="M 14 58 Q 10 66 15 72" fill="none" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" />
      <Sparkles items={[[18, 22, 4.6, '#FEF08A'], [74, 24, 4.4, '#FFFBEB'], [66, 86, 3.8, '#FDE047']]} />
    </g>
  ),

  'origami-chroma-phoenix': (gid) => (
    <g>
      <PrismDefs gid={gid} />
      {/* Sweeping ribbon-like folded origami tail feathers */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <polygon points="44,68 28,90 42,84" fill={`url(#${gid('prism-deep')})`} />
        <polygon points="50,70 50,92 58,82" fill={`url(#${gid('prism')})`} />
        <polygon points="56,68 72,90 58,84" fill={`url(#${gid('prism-deep')})`} />
      </g>
      {/* Razor-sharp multi-layered holographic origami wings */}
      <g stroke={INK} strokeWidth="2.7" strokeLinejoin="round">
        <polygon points="40,52 8,18 22,56" fill={`url(#${gid('prism')})`} />
        <polygon points="38,58 11,48 26,68" fill={`url(#${gid('prism-soft')})`} />
        <polygon points="60,52 92,18 78,56" fill={`url(#${gid('prism')})`} />
        <polygon points="62,58 89,48 74,68" fill={`url(#${gid('prism-soft')})`} />
      </g>
      {/* Three-plume folded origami phoenix crest */}
      <g stroke={INK} strokeWidth="2.3" strokeLinejoin="round">
        <polygon points="46,29 36,11 50,24" fill="#F472B6" />
        <polygon points="50,26 50,8 55,24" fill="#FACC15" />
        <polygon points="54,29 64,11 50,24" fill="#38BDF8" />
      </g>
      {/* Faceted iridescent origami phoenix body */}
      <polygon points="50,24 66,48 50,78 34,48" fill={`url(#${gid('prism-soft')})`} stroke={INK} strokeWidth="3.1" strokeLinejoin="round" />
      <polygon points="50,24 66,48 50,54" fill="#FFFFFF" fillOpacity="0.45" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <polygon points="34,48 50,54 50,78" fill={`url(#${gid('prism')})`} fillOpacity="0.6" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Starry eyes & sharp golden origami beak */}
      <circle cx="43" cy="43" r="3.7" fill={INK} />
      <circle cx="44.2" cy="41.8" r="1.3" fill="#FFFFFF" />
      <circle cx="41.8" cy="44.2" r="0.9" fill="#FEF08A" />
      <circle cx="57" cy="43" r="3.7" fill={INK} />
      <circle cx="58.2" cy="41.8" r="1.3" fill="#FFFFFF" />
      <circle cx="55.8" cy="44.2" r="0.9" fill="#FEF08A" />
      <polygon points="46.5,48 53.5,48 50,54" fill="#FACC15" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <Sparkles items={[[18, 14, 4.6, '#FEF08A'], [82, 14, 4.6, '#BAE6FD'], [16, 78, 4, '#F472B6'], [84, 78, 4, '#34D399']]} />
    </g>
  ),
};

export function renderPhase8Collectible(id: string, uid = 'p8'): React.ReactNode | null {
  const renderer = PHASE8_RENDERERS[id];
  if (!renderer) return null;
  const gid: GidFn = (suffix) => `${uid}-p8-${id}-${suffix}`;
  return renderer(gid);
}

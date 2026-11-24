import React from 'react';
import type { FoldHole, PatternTile, SpatialVisualSpec } from '../../subjects/logic/logicTypes';

interface SpatialVisualProps {
  spec: SpatialVisualSpec;
  compact?: boolean;
  isZh?: boolean;
}

function renderPatternTile(tile: PatternTile, cx: number, cy: number, r: number): React.ReactNode {
  const stroke = '#1C1917';
  const sw = r > 12 ? 2.4 : 1.8;
  switch (tile.shape) {
    case 'circle':
      return <circle cx={cx} cy={cy} r={r} fill={tile.color} stroke={stroke} strokeWidth={sw} />;
    case 'square':
      return (
        <rect
          x={cx - r * 0.88}
          y={cy - r * 0.88}
          width={r * 1.76}
          height={r * 1.76}
          rx={r * 0.28}
          fill={tile.color}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
    case 'diamond':
      // Strictly equal horizontal & vertical half-axes (100% D4 invariant!)
      return (
        <polygon
          points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
          fill={tile.color}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case 'plus': {
      const arm = r * 0.36;
      const len = r * 0.96;
      return (
        <polygon
          points={[
            `${cx - arm},${cy - len}`,
            `${cx + arm},${cy - len}`,
            `${cx + arm},${cy - arm}`,
            `${cx + len},${cy - arm}`,
            `${cx + len},${cy + arm}`,
            `${cx + arm},${cy + arm}`,
            `${cx + arm},${cy + len}`,
            `${cx - arm},${cy + len}`,
            `${cx - arm},${cy + arm}`,
            `${cx - len},${cy + arm}`,
            `${cx - len},${cy - arm}`,
            `${cx - arm},${cy - arm}`,
          ].join(' ')}
          fill={tile.color}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    }
    case 'star4': {
      // Strictly symmetric 4-pointed star (100% D4 invariant under all rotations & flips!)
      const inner = r * 0.4;
      const outer = r * 1.05;
      return (
        <polygon
          points={[
            `${cx},${cy - outer}`,
            `${cx + inner},${cy - inner}`,
            `${cx + outer},${cy}`,
            `${cx + inner},${cy + inner}`,
            `${cx},${cy + outer}`,
            `${cx - inner},${cy + inner}`,
            `${cx - outer},${cy}`,
            `${cx - inner},${cy - inner}`,
          ].join(' ')}
          fill={tile.color}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    }
  }
}

function renderHoleShape(hole: FoldHole, cx: number, cy: number, r: number): React.ReactNode {
  if (hole.shape === 'diamond') {
    return (
      <polygon
        points={`${cx},${cy - r * 1.1} ${cx + r * 0.95},${cy} ${cx},${cy + r * 1.1} ${cx - r * 0.95},${cy}`}
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    );
  }
  return <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.2" />;
}

export const SpatialVisual: React.FC<SpatialVisualProps> = ({
  spec,
  compact = false,
  isZh = true,
}) => {
  if (spec.kind === 'pattern-grid') {
    const sizePx = compact ? 116 : 168;
    const pad = 16;
    const cell = 44;
    const gridW = cell * 3;
    const vb = gridW + pad * 2;
    return (
      <svg
        viewBox={`0 0 ${vb} ${vb}`}
        width={sizePx}
        height={sizePx}
        className="mx-auto block shrink-0 select-none"
        aria-hidden="true"
      >
        <rect
          x={pad - 4}
          y={pad - 4}
          width={gridW + 8}
          height={gridW + 8}
          rx="12"
          fill="#FFFDF9"
          stroke="#1C1917"
          strokeWidth="3"
        />
        {spec.cells.map((row, r) =>
          row.map((tile, c) => {
            const x = pad + c * cell;
            const y = pad + r * cell;
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x + 1.5}
                  y={y + 1.5}
                  width={cell - 3}
                  height={cell - 3}
                  rx="7"
                  fill={(r + c) % 2 === 0 ? '#F8FAFC' : '#F1F5F9'}
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
                {tile && renderPatternTile(tile, x + cell / 2, y + cell / 2, 13)}
              </g>
            );
          }),
        )}
        {spec.mirrorAxis === 'vertical' && (
          <line
            x1={vb / 2}
            y1={4}
            x2={vb / 2}
            y2={vb - 4}
            stroke="#EC4899"
            strokeWidth="3.2"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        )}
        {spec.mirrorAxis === 'horizontal' && (
          <line
            x1={4}
            y1={vb / 2}
            x2={vb - 4}
            y2={vb / 2}
            stroke="#EC4899"
            strokeWidth="3.2"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }

  if (spec.kind === 'iso-cubes') {
    const dx = 32;
    const dy = 17;
    const dz = 28;
    const ox = 130;
    const oy = 112;

    const project = (r: number, c: number, z: number): [number, number] => [
      ox + (c - r) * dx,
      oy + (c + r) * dy - z * dz,
    ];

    const layerColors = [
      { top: '#5EEAD4', left: '#14B8A6', right: '#0F766E' }, // Layer 1 (z=0)
      { top: '#93C5FD', left: '#3B82F6', right: '#1D4ED8' }, // Layer 2 (z=1)
      { top: '#FDE047', left: '#F59E0B', right: '#B45309' }, // Layer 3 (z=2)
    ];

    // Draw base 3x3 isometric floor grid first so empty cells are crystal clear
    const floorTiles: React.ReactNode[] = [];
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        const [x0, y0] = project(r, c, 0);
        const [x1, y1] = project(r, c + 1, 0);
        const [x2, y2] = project(r + 1, c + 1, 0);
        const [x3, y3] = project(r + 1, c, 0);
        floorTiles.push(
          <polygon
            key={`floor-${r}-${c}`}
            points={`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />,
        );
      }
    }

    // Painter's algorithm: draw back-to-front by (r + c), then bottom-to-top by z
    const cubes: React.ReactNode[] = [];
    for (let sum = 0; sum <= 4; sum += 1) {
      for (let r = 0; r < 3; r += 1) {
        const c = sum - r;
        if (c < 0 || c >= 3) continue;
        const h = spec.heights[r][c];
        for (let z = 0; z < h; z += 1) {
          const pal = layerColors[Math.min(z, layerColors.length - 1)];
          const [tx0, ty0] = project(r, c, z + 1);
          const [tx1, ty1] = project(r, c + 1, z + 1);
          const [tx2, ty2] = project(r + 1, c + 1, z + 1);
          const [tx3, ty3] = project(r + 1, c, z + 1);

          const [bx1, by1] = project(r, c + 1, z);
          const [bx2, by2] = project(r + 1, c + 1, z);
          const [bx3, by3] = project(r + 1, c, z);

          cubes.push(
            <g key={`cube-${r}-${c}-${z}`}>
              {/* Left-front visible face (+r side) */}
              <polygon
                points={`${tx3},${ty3} ${tx2},${ty2} ${bx2},${by2} ${bx3},${by3}`}
                fill={pal.left}
                stroke="#1C1917"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Right-front visible face (+c side) */}
              <polygon
                points={`${tx1},${ty1} ${tx2},${ty2} ${bx2},${by2} ${bx1},${by1}`}
                fill={pal.right}
                stroke="#1C1917"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Top face */}
              <polygon
                points={`${tx0},${ty0} ${tx1},${ty1} ${tx2},${ty2} ${tx3},${ty3}`}
                fill={pal.top}
                stroke="#1C1917"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </g>,
          );
        }

        if (spec.showHeights && h > 0) {
          const [cx, cy] = project(r + 0.5, c + 0.5, h);
          cubes.push(
            <text
              key={`lbl-${r}-${c}`}
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="900"
              fill="#1C1917"
            >
              {h}
            </text>,
          );
        }
      }
    }

    // Front (+r) edge reference label at bottom-left edge of floor
    const [flx, fly] = project(3.25, 1.5, 0);
    const [frx, fry] = project(1.5, 3.3, 0);

    return (
      <svg
        viewBox="0 0 260 230"
        width={compact ? 170 : 250}
        height={compact ? 150 : 220}
        className="mx-auto block shrink-0 select-none"
        aria-hidden="true"
      >
        {floorTiles}
        {cubes}
        <text x={flx - 16} y={fly + 8} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0F766E">
          {isZh ? '前 Front' : 'Front'}
        </text>
        <text x={frx + 14} y={fry + 8} textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          {isZh ? '右 Right' : 'Right'}
        </text>
      </svg>
    );
  }

  if (spec.kind === 'top-view-grid') {
    const sizePx = compact ? 114 : 156;
    const cell = 38;
    const padX = 24;
    const padTop = 14;
    const gridW = cell * 3;
    return (
      <svg
        viewBox="0 0 162 152"
        width={sizePx}
        height={Math.round(sizePx * (152 / 162))}
        className="mx-auto block shrink-0 select-none"
        aria-hidden="true"
      >
        <rect
          x={padX - 3}
          y={padTop - 3}
          width={gridW + 6}
          height={gridW + 6}
          rx="10"
          fill="#FFFDF9"
          stroke="#1C1917"
          strokeWidth="2.8"
        />
        {spec.filled.map((row, r) =>
          row.map((on, c) => (
            <rect
              key={`${r}-${c}`}
              x={padX + c * cell + 2}
              y={padTop + r * cell + 2}
              width={cell - 4}
              height={cell - 4}
              rx="6"
              fill={on ? '#14B8A6' : '#F1F5F9'}
              stroke={on ? '#1C1917' : '#CBD5E1'}
              strokeWidth={on ? 2.2 : 1.4}
            />
          )),
        )}
        <text x={padX + gridW / 2} y={padTop + gridW + 18} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0F766E">
          {isZh ? '▲ 前 Front' : '▲ Front'}
        </text>
      </svg>
    );
  }

  if (spec.kind === 'cube-net') {
    const maxR = Math.max(...spec.cells.map((c) => c.r));
    const maxC = Math.max(...spec.cells.map((c) => c.c));
    const cols = maxC + 1;
    const rows = maxR + 1;
    const cell = 44;
    const pad = 12;
    const vbW = cols * cell + pad * 2;
    const vbH = rows * cell + pad * 2;
    const maxDim = compact ? 132 : 240;
    const scale = Math.min(maxDim / vbW, (compact ? 94 : 168) / vbH);

    return (
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        width={Math.round(vbW * scale)}
        height={Math.round(vbH * scale)}
        className="mx-auto block shrink-0 select-none"
        aria-hidden="true"
      >
        {spec.cells.map((item, idx) => {
          const x = pad + item.c * cell;
          const y = pad + item.r * cell;
          const isHighlight =
            spec.highlightCoord &&
            spec.highlightCoord.r === item.r &&
            spec.highlightCoord.c === item.c;
          const faceText = isZh ? item.faceLabelZh : item.faceLabelEn;
          return (
            <g key={idx}>
              <rect
                x={x + 1.5}
                y={y + 1.5}
                width={cell - 3}
                height={cell - 3}
                rx="6"
                fill={item.color ?? '#EDE9FE'}
                stroke={isHighlight ? '#DB2777' : '#1C1917'}
                strokeWidth={isHighlight ? 3.8 : 2.6}
              />
              {item.symbol && (
                <text
                  x={x + cell / 2}
                  y={y + (spec.showFaceLabels && faceText ? cell * 0.52 : cell * 0.65)}
                  textAnchor="middle"
                  fontSize={spec.showFaceLabels && faceText ? '17' : '22'}
                >
                  {item.symbol}
                </text>
              )}
              {spec.showFaceLabels && faceText && (
                <text
                  x={x + cell / 2}
                  y={y + (item.symbol ? cell * 0.86 : cell * 0.6)}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="900"
                  fill={isHighlight ? '#BE185D' : '#4C1D95'}
                >
                  {faceText}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // kind === 'paper-fold'
  const sizePx = compact ? 116 : 168;
  const pad = 16;
  const cell = 34;
  const sheetW = cell * 4;
  const vb = sheetW + pad * 2;
  const hasV = spec.folds.includes('vertical');
  const hasH = spec.folds.includes('horizontal');

  // Active folded region overlay when unfolded === false
  const activeX = !spec.unfolded && hasV ? pad + cell * 2 : pad;
  const activeY = !spec.unfolded && hasH ? pad + cell * 2 : pad;
  const activeW = !spec.unfolded && hasV ? cell * 2 : sheetW;
  const activeH = !spec.unfolded && hasH ? cell * 2 : sheetW;

  return (
    <svg
      viewBox={`0 0 ${vb} ${vb}`}
      width={sizePx}
      height={sizePx}
      className="mx-auto block shrink-0 select-none"
      aria-hidden="true"
    >
      {/* Full sheet silhouette */}
      <rect
        x={pad}
        y={pad}
        width={sheetW}
        height={sheetW}
        rx="10"
        fill={spec.unfolded ? '#FBCFE8' : '#F8FAFC'}
        stroke={spec.unfolded ? '#1C1917' : '#CBD5E1'}
        strokeWidth={spec.unfolded ? 3 : 2}
        strokeDasharray={spec.unfolded ? undefined : '6 4'}
      />

      {/* Folded active paper layer */}
      {!spec.unfolded && (
        <rect
          x={activeX}
          y={activeY}
          width={activeW}
          height={activeH}
          rx="8"
          fill="#F9A8D4"
          stroke="#1C1917"
          strokeWidth="3"
        />
      )}

      {/* Subtle 4x4 guide dots */}
      {[0, 1, 2, 3].map((gx) =>
        [0, 1, 2, 3].map((gy) => (
          <circle
            key={`dot-${gx}-${gy}`}
            cx={pad + gx * cell + cell / 2}
            cy={pad + gy * cell + cell / 2}
            r="1.8"
            fill="#BE185D"
            opacity="0.22"
          />
        )),
      )}

      {/* Dashed fold symmetry creases */}
      {spec.showAxes && hasV && (
        <line
          x1={pad + cell * 2}
          y1={pad - 6}
          x2={pad + cell * 2}
          y2={pad + sheetW + 6}
          stroke="#BE185D"
          strokeWidth="2.8"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />
      )}
      {spec.showAxes && hasH && (
        <line
          x1={pad - 6}
          y1={pad + cell * 2}
          x2={pad + sheetW + 6}
          y2={pad + cell * 2}
          stroke="#BE185D"
          strokeWidth="2.8"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />
      )}

      {/* Punched / Unfolded holes */}
      {spec.holes.map((h, idx) => (
        <g key={idx}>
          {renderHoleShape(h, pad + h.x * cell + cell / 2, pad + h.y * cell + cell / 2, 9.5)}
        </g>
      ))}
    </svg>
  );
};

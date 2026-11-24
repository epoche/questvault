import React, { useId } from 'react';
import { formatRobotCmd } from '../../subjects/logic/logicReasoningEngine';
import type {
  BalanceScaleRow,
  LogicGridEntity,
  LogicGridSolutionRow,
  LogicVisualSpec,
  MatrixCellSpec,
  RobotCmd,
  RobotDir,
  RobotFlagMarker,
  ScaleIconItem,
  ScalePanItem,
} from '../../subjects/logic/logicTypes';
import { SpatialVisual } from './SpatialVisual';

interface LogicVisualProps {
  spec: LogicVisualSpec;
  compact?: boolean;
  isZh?: boolean;
  /** Interactive scratchpad state for logic-grid ('none' | 'x' | 'check') */
  scratchpad?: Record<string, 'x' | 'check'>;
  onToggleScratchpad?: (key: string) => void;
}

// ── 1. Balance Scale SVG ──
const BalanceScaleVisual: React.FC<{
  scales: BalanceScaleRow[];
  askItems: ScaleIconItem[];
  revealedValues?: { emoji: string; nameEn: string; nameZh: string; value: number }[];
  isZh: boolean;
}> = ({ scales, askItems, revealedValues, isZh }) => {
  const rowH = 92;
  const svgW = 360;
  const svgH = scales.length * rowH + 8;

  const renderPanItems = (items: ScalePanItem[], centerX: number, baseY: number) => {
    const count = items.length;
    const spacing = count >= 4 ? 26 : 30;
    const itemR = count >= 4 ? 11.5 : 13;
    const startX = centerX - ((count - 1) * spacing) / 2;

    return items.map((item, idx) => {
      const x = startX + idx * spacing;
      if (item.kind === 'weight') {
        return (
          <g key={`w-${idx}`}>
            <rect
              x={x - 28}
              y={baseY - 30}
              width={56}
              height={28}
              rx={8}
              fill="#FEF3C7"
              stroke="#1C1917"
              strokeWidth={2.2}
            />
            <text
              x={x}
              y={baseY - 11}
              textAnchor="middle"
              fontSize={16}
              fontWeight={900}
              fill="#92400E"
            >
              {item.value}
            </text>
          </g>
        );
      }
      return (
        <g key={`i-${idx}`}>
          <circle
            cx={x}
            cy={baseY - 16}
            r={itemR}
            fill="#FFFFFF"
            stroke={item.color}
            strokeWidth={2}
          />
          <text
            x={x}
            y={baseY - 10.5}
            textAnchor="middle"
            fontSize={count >= 4 ? 14.5 : 16}
          >
            {item.emoji}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-[380px] h-auto"
        role="img"
        aria-label={isZh ? '平衡天平題圖' : 'Balanced scales diagram'}
      >
        {scales.map((scale, sIdx) => {
          const topY = sIdx * rowH + 6;
          const beamY = topY + 54;
          const panY = topY + 48;
          const leftX = 96;
          const rightX = 264;
          const midX = 180;

          return (
            <g key={sIdx}>
              {/* Subtle card background per scale */}
              <rect
                x={6}
                y={topY}
                width={svgW - 12}
                height={rowH - 10}
                rx={16}
                fill="#FFFFFF"
                stroke="#E7E2D8"
                strokeWidth={1.8}
              />
              {/* Scale badge */}
              <circle cx={24} cy={topY + 18} r={10} fill="#FFFBEB" stroke="#F59E0B" strokeWidth={1.5} />
              <text x={24} y={topY + 22} textAnchor="middle" fontSize={11} fontWeight={800} fill="#B45309">
                {sIdx + 1}
              </text>

              {/* Fulcrum triangle + base */}
              <polygon
                points={`${midX},${beamY} ${midX - 15},${beamY + 22} ${midX + 15},${beamY + 22}`}
                fill="#F59E0B"
                stroke="#1C1917"
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <line
                x1={midX - 24}
                y1={beamY + 22}
                x2={midX + 24}
                y2={beamY + 22}
                stroke="#1C1917"
                strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Horizontal beam */}
              <line
                x1={leftX}
                y1={beamY}
                x2={rightX}
                y2={beamY}
                stroke="#1C1917"
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              {/* Equal sign badge on pivot */}
              <circle cx={midX} cy={beamY} r={10} fill="#1C1917" />
              <text x={midX} y={beamY + 4} textAnchor="middle" fontSize={12} fontWeight={900} fill="#FFFFFF">
                =
              </text>

              {/* Left & right pans */}
              <line x1={leftX - 54} y1={panY} x2={leftX + 54} y2={panY} stroke="#1C1917" strokeWidth={3} strokeLinecap="round" />
              <line x1={leftX} y1={panY} x2={leftX} y2={beamY} stroke="#1C1917" strokeWidth={2.5} />
              <line x1={rightX - 54} y1={panY} x2={rightX + 54} y2={panY} stroke="#1C1917" strokeWidth={3} strokeLinecap="round" />
              <line x1={rightX} y1={panY} x2={rightX} y2={beamY} stroke="#1C1917" strokeWidth={2.5} />

              {renderPanItems(scale.left, leftX, panY - 2)}
              {renderPanItems(scale.right, rightX, panY - 2)}
            </g>
          );
        })}
      </svg>

      {/* Target expression pill */}
      <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] px-4 py-1.5 text-sm font-extrabold text-[#1C1917]">
        {askItems.map((it, i) => (
          <React.Fragment key={`${it.iconId}-${i}`}>
            {i > 0 && <span className="text-[#D97706]">+</span>}
            <span>
              {it.emoji} {isZh ? it.nameZh : it.nameEn}
            </span>
          </React.Fragment>
        ))}
        <span className="text-[#D97706]">=</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#D97706] text-white font-black">
          ?
        </span>
      </div>

      {/* Feedback revealed values */}
      {revealedValues && revealedValues.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {revealedValues.map((rv, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-full border border-[#10B981] bg-[#ECFDF5] px-3 py-0.5 text-xs font-extrabold text-[#065F46]"
            >
              <span>{rv.emoji}</span>
              <span>= {rv.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ── 2. Pattern Matrix & Single Cell SVG ──
const MatrixShapeGlyph: React.FC<{
  cell: MatrixCellSpec;
  cx: number;
  cy: number;
  r: number;
  stripeId: string;
}> = ({ cell, cx, cy, r, stripeId }) => {
  const fillVal =
    cell.fill === 'solid'
      ? cell.color
      : cell.fill === 'outline'
        ? '#FFFFFF'
        : `url(#${stripeId})`;
  const strokeVal = cell.fill === 'outline' ? cell.color : '#1C1917';
  const strokeW = cell.fill === 'outline' ? 3 : 2;

  switch (cell.shape) {
    case 'circle':
      return <circle cx={cx} cy={cy} r={r} fill={fillVal} stroke={strokeVal} strokeWidth={strokeW} />;
    case 'square':
      return (
        <rect
          x={cx - r * 0.88}
          y={cy - r * 0.88}
          width={r * 1.76}
          height={r * 1.76}
          rx={3}
          fill={fillVal}
          stroke={strokeVal}
          strokeWidth={strokeW}
        />
      );
    case 'diamond':
      return (
        <polygon
          points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
          fill={fillVal}
          stroke={strokeVal}
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />
      );
    case 'triangle':
      return (
        <polygon
          points={`${cx},${cy - r} ${cx + r},${cy + r * 0.82} ${cx - r},${cy + r * 0.82}`}
          fill={fillVal}
          stroke={strokeVal}
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />
      );
    case 'star4': {
      const inner = r * 0.42;
      const pts = [
        [cx, cy - r],
        [cx + inner, cy - inner],
        [cx + r, cy],
        [cx + inner, cy + inner],
        [cx, cy + r],
        [cx - inner, cy + inner],
        [cx - r, cy],
        [cx - inner, cy - inner],
      ]
        .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
        .join(' ');
      return <polygon points={pts} fill={fillVal} stroke={strokeVal} strokeWidth={strokeW} strokeLinejoin="round" />;
    }
  }
};

const MatrixCellContents: React.FC<{
  cell: MatrixCellSpec;
  x: number;
  y: number;
  size: number;
  uid: string;
}> = ({ cell, x, y, size, uid }) => {
  const stripeId = `${uid}-st-${cell.color.replace('#', '')}`;
  const cx = x + size / 2;
  const cy = y + size / 2;

  const positions: { x: number; y: number; r: number }[] =
    cell.count === 1
      ? [{ x: cx, y: cy, r: size * 0.31 }]
      : cell.count === 2
        ? [
            { x: cx - size * 0.21, y: cy, r: size * 0.18 },
            { x: cx + size * 0.21, y: cy, r: size * 0.18 },
          ]
        : [
            { x: cx, y: cy - size * 0.21, r: size * 0.16 },
            { x: cx - size * 0.22, y: cy + size * 0.18, r: size * 0.16 },
            { x: cx + size * 0.22, y: cy + size * 0.18, r: size * 0.16 },
          ];

  return (
    <g>
      {cell.fill === 'striped' && (
        <defs>
          <pattern
            id={stripeId}
            width={6}
            height={6}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width={6} height={6} fill="#FFFFFF" />
            <rect x={0} y={0} width={3} height={6} fill={cell.color} />
          </pattern>
        </defs>
      )}
      {positions.map((pos, idx) => (
        <MatrixShapeGlyph
          key={idx}
          cell={cell}
          cx={pos.x}
          cy={pos.y}
          r={pos.r}
          stripeId={stripeId}
        />
      ))}
    </g>
  );
};

const PatternMatrixVisual: React.FC<{
  cells: (MatrixCellSpec | null)[][];
  highlightMissing?: boolean;
  solvedCell?: MatrixCellSpec;
  isZh: boolean;
}> = ({ cells, highlightMissing, solvedCell, isZh }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const cellSize = 62;
  const gap = 8;
  const pad = 12;
  const total = pad * 2 + cellSize * 3 + gap * 2;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      className="w-[216px] h-[216px] sm:w-[232px] sm:h-[232px]"
      role="img"
      aria-label={isZh ? '3×3 圖形矩陣規律題' : '3 by 3 pattern matrix'}
    >
      <rect x={2} y={2} width={total - 4} height={total - 4} rx={18} fill="#FFFFFF" stroke="#1C1917" strokeWidth={2.5} />
      {cells.map((row, r) =>
        row.map((cell, c) => {
          const x = pad + c * (cellSize + gap);
          const y = pad + r * (cellSize + gap);
          const isMissing = cell === null;
          const displayCell = isMissing && solvedCell ? solvedCell : cell;

          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={12}
                fill={
                  isMissing
                    ? solvedCell
                      ? '#ECFDF5'
                      : '#EEF2FF'
                    : '#F8FAFC'
                }
                stroke={
                  isMissing
                    ? solvedCell
                      ? '#059669'
                      : highlightMissing
                        ? '#4F46E5'
                        : '#94A3B8'
                    : '#CBD5E1'
                }
                strokeWidth={isMissing ? 2.5 : 1.6}
                strokeDasharray={isMissing && !solvedCell ? '5 4' : undefined}
              />
              {displayCell ? (
                <MatrixCellContents
                  cell={displayCell}
                  x={x}
                  y={y}
                  size={cellSize}
                  uid={`${uid}-${r}-${c}`}
                />
              ) : (
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2 + 10}
                  textAnchor="middle"
                  fontSize={28}
                  fontWeight={900}
                  fill="#4F46E5"
                >
                  ?
                </text>
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
};

const SingleMatrixCellVisual: React.FC<{ cell: MatrixCellSpec; compact?: boolean }> = ({
  cell,
  compact,
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const size = 76;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={compact ? 'w-[76px] h-[76px]' : 'w-[92px] h-[92px]'}
      aria-hidden="true"
    >
      <rect x={3} y={3} width={size - 6} height={size - 6} rx={14} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={2} />
      <MatrixCellContents cell={cell} x={3} y={3} size={size - 6} uid={uid} />
    </svg>
  );
};

// ── 3. Interactive 3×3 Logic Deduction Grid ──
const LogicGridVisual: React.FC<{
  people: LogicGridEntity[];
  attrA: LogicGridEntity[];
  attrB: LogicGridEntity[];
  attrATitleEn: string;
  attrATitleZh: string;
  attrBTitleEn: string;
  attrBTitleZh: string;
  cluesEn: string[];
  cluesZh: string[];
  solution?: LogicGridSolutionRow[];
  isZh: boolean;
  scratchpad?: Record<string, 'x' | 'check'>;
  onToggleScratchpad?: (key: string) => void;
}> = ({
  people,
  attrA,
  attrB,
  attrATitleEn,
  attrATitleZh,
  attrBTitleEn,
  attrBTitleZh,
  cluesEn,
  cluesZh,
  solution,
  isZh,
  scratchpad,
  onToggleScratchpad,
}) => {
  const clues = isZh ? cluesZh : cluesEn;

  return (
    <div className="w-full space-y-3">
      {/* Detective Clue List */}
      <div className="rounded-2xl border-2 border-[#D6D3D1] bg-white p-3.5 space-y-2">
        <div className="text-xs font-extrabold uppercase tracking-wider text-[#059669]">
          {isZh ? '🔎 偵探線索（每一條都為真）' : '🔎 Detective Clues (All True)'}
        </div>
        <ul className="space-y-1.5">
          {clues.map((clue, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs sm:text-sm font-bold text-[#1C1917] leading-snug"
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-extrabold text-[#047857]">
                {idx + 1}
              </span>
              <span>{clue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Scratchpad or Revealed Solution Table */}
      <div className="rounded-2xl border-2 border-[#E5DFD3] bg-white p-3 overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold text-[#57534E]">
            {solution
              ? isZh
                ? '✅ 唯一正解配對表'
                : '✅ Verified Unique Solution Table'
              : isZh
                ? '📝 互動推理筆記（點擊格子切換 ✗ / ✓）'
                : '📝 Detective Scratchpad (Tap cells: ✗ / ✓)'}
          </span>
        </div>

        <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="p-1.5 text-left font-extrabold text-[#78716C] border-b border-[#E5DFD3]">
                {isZh ? '角色' : 'Friend'}
              </th>
              <th
                colSpan={3}
                className="p-1 font-extrabold text-[#2563EB] bg-[#EFF6FF] border-b border-l border-[#E5DFD3]"
              >
                {isZh ? attrATitleZh : attrATitleEn}
              </th>
              <th
                colSpan={3}
                className="p-1 font-extrabold text-[#D97706] bg-[#FFFBEB] border-b border-l border-[#E5DFD3]"
              >
                {isZh ? attrBTitleZh : attrBTitleEn}
              </th>
            </tr>
            <tr className="border-b border-[#E5DFD3]">
              <th className="p-1" />
              {attrA.map((a) => (
                <th key={a.id} className="p-1 font-bold text-[#1C1917] border-l border-[#F1EDE5]" title={isZh ? a.labelZh : a.labelEn}>
                  <div className="text-base leading-none">{a.emoji}</div>
                  <div className="text-[10px] font-extrabold text-[#57534E] truncate max-w-[54px] mx-auto">
                    {isZh ? a.labelZh : a.labelEn.split(' ')[0]}
                  </div>
                </th>
              ))}
              {attrB.map((b) => (
                <th key={b.id} className="p-1 font-bold text-[#1C1917] border-l border-[#F1EDE5]" title={isZh ? b.labelZh : b.labelEn}>
                  <div className="text-base leading-none">{b.emoji}</div>
                  <div className="text-[10px] font-extrabold text-[#57534E] truncate max-w-[54px] mx-auto">
                    {isZh ? b.labelZh : b.labelEn.split(' ')[0]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((person, pIdx) => {
              const solRow = solution?.find((row) => row.personIdx === pIdx);
              return (
                <tr key={person.id} className="border-b last:border-b-0 border-[#F1EDE5]">
                  <td className="p-1 sm:p-1.5 text-left font-extrabold text-[#1C1917] whitespace-nowrap">
                    {person.emoji} {isZh ? person.labelZh : person.labelEn}
                  </td>
                  {attrA.map((a, aIdx) => {
                    const key = `a-${pIdx}-${aIdx}`;
                    const mark = solution
                      ? solRow?.aIdx === aIdx
                        ? 'check'
                        : 'x'
                      : scratchpad?.[key];
                    return (
                      <td key={a.id} className="p-0.5 sm:p-1 border-l border-[#F1EDE5]">
                        <button
                          type="button"
                          disabled={Boolean(solution)}
                          onClick={() => onToggleScratchpad?.(key)}
                          aria-label={isZh ? `${person.labelZh} ${a.labelZh}` : `${person.labelEn} ${a.labelEn}`}
                          className={`mx-auto flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border text-sm font-black transition-colors ${
                            mark === 'check'
                              ? 'border-[#10B981] bg-[#ECFDF5] text-[#059669]'
                              : mark === 'x'
                                ? 'border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48]'
                                : 'border-[#E5DFD3] bg-[#FAF8F4] text-[#A8A29E] hover:bg-[#F5F5F4]'
                          }`}
                        >
                          {mark === 'check' ? '✓' : mark === 'x' ? '✗' : '·'}
                        </button>
                      </td>
                    );
                  })}
                  {attrB.map((b, bIdx) => {
                    const key = `b-${pIdx}-${bIdx}`;
                    const mark = solution
                      ? solRow?.bIdx === bIdx
                        ? 'check'
                        : 'x'
                      : scratchpad?.[key];
                    return (
                      <td key={b.id} className="p-0.5 sm:p-1 border-l border-[#F1EDE5]">
                        <button
                          type="button"
                          disabled={Boolean(solution)}
                          onClick={() => onToggleScratchpad?.(key)}
                          aria-label={isZh ? `${person.labelZh} ${b.labelZh}` : `${person.labelEn} ${b.labelEn}`}
                          className={`mx-auto flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border text-sm font-black transition-colors ${
                            mark === 'check'
                              ? 'border-[#10B981] bg-[#ECFDF5] text-[#059669]'
                              : mark === 'x'
                                ? 'border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48]'
                                : 'border-[#E5DFD3] bg-[#FAF8F4] text-[#A8A29E] hover:bg-[#F5F5F4]'
                          }`}
                        >
                          {mark === 'check' ? '✓' : mark === 'x' ? '✗' : '·'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── 4. 5×5 Robot Block Coding SVG ──
const DIR_ROTATION: Record<RobotDir, number> = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
};

const DIR_LABEL_EN: Record<RobotDir, string> = {
  N: 'Facing Up (North)',
  E: 'Facing Right (East)',
  S: 'Facing Down (South)',
  W: 'Facing Left (West)',
};

const DIR_LABEL_ZH: Record<RobotDir, string> = {
  N: '朝上（北）',
  E: '朝右（東）',
  S: '朝下（南）',
  W: '朝左（西）',
};

const RobotGridVisual: React.FC<{
  size: 5;
  start: { r: number; c: number; dir: RobotDir };
  obstacles: { r: number; c: number }[];
  star?: { r: number; c: number };
  flags?: RobotFlagMarker[];
  program?: RobotCmd[];
  trail?: { r: number; c: number }[];
  highlightEnd?: { r: number; c: number };
  isZh: boolean;
}> = ({ size, start, obstacles, star, flags, program, trail, highlightEnd, isZh }) => {
  const cell = 44;
  const pad = 12;
  const boardPx = pad * 2 + size * cell;
  const obsSet = new Set(obstacles.map((o) => `${o.r},${o.c}`));

  const centerOf = (r: number, c: number) => ({
    x: pad + c * cell + cell / 2,
    y: pad + r * cell + cell / 2,
  });

  const startCenter = centerOf(start.r, start.c);
  const trailPoints =
    trail && trail.length > 1
      ? trail
          .map((pt) => {
            const p = centerOf(pt.r, pt.c);
            return `${p.x},${p.y}`;
          })
          .join(' ')
      : null;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-0.5 text-xs font-extrabold text-[#0369A1]">
        <span>🤖</span>
        <span>{isZh ? `起點方向：${DIR_LABEL_ZH[start.dir]}` : `Start: ${DIR_LABEL_EN[start.dir]}`}</span>
      </div>

      <svg
        viewBox={`0 0 ${boardPx} ${boardPx}`}
        className="w-[236px] h-[236px] sm:w-[252px] sm:h-[252px]"
        role="img"
        aria-label={isZh ? '5×5 機器人寶藏地圖' : '5 by 5 robot treasure board'}
      >
        <rect
          x={2}
          y={2}
          width={boardPx - 4}
          height={boardPx - 4}
          rx={16}
          fill="#FFFFFF"
          stroke="#1C1917"
          strokeWidth={2.5}
        />

        {/* Grid tiles */}
        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((__, c) => {
            const x = pad + c * cell;
            const y = pad + r * cell;
            const isObs = obsSet.has(`${r},${c}`);
            const isEnd = highlightEnd?.r === r && highlightEnd?.c === c;
            const isStart = start.r === r && start.c === c;
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={cell - 4}
                  height={cell - 4}
                  rx={8}
                  fill={
                    isEnd
                      ? '#DCFCE7'
                      : isStart
                        ? '#E0F2FE'
                        : isObs
                          ? '#E7E5E4'
                          : (r + c) % 2 === 0
                            ? '#FAF8F4'
                            : '#F5F2EB'
                  }
                  stroke={isEnd ? '#16A34A' : isStart ? '#0284C7' : '#D6D3D1'}
                  strokeWidth={isEnd || isStart ? 2.2 : 1.2}
                />
                {isObs && (
                  <text x={x + cell / 2} y={y + cell / 2 + 7} textAnchor="middle" fontSize={20}>
                    🪨
                  </text>
                )}
              </g>
            );
          }),
        )}

        {/* Feedback Trail */}
        {trailPoints && (
          <polyline
            points={trailPoints}
            fill="none"
            stroke="#0284C7"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 5"
          />
        )}

        {/* Star Target */}
        {star && (
          <text
            x={centerOf(star.r, star.c).x}
            y={centerOf(star.r, star.c).y + 8}
            textAnchor="middle"
            fontSize={24}
          >
            ⭐
          </text>
        )}

        {/* Flags A/B/C/D */}
        {flags?.map((fl) => {
          const p = centerOf(fl.r, fl.c);
          return (
            <g key={fl.badge}>
              <circle cx={p.x} cy={p.y} r={14} fill={fl.color} stroke="#1C1917" strokeWidth={2} />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF">
                {fl.badge}
              </text>
            </g>
          );
        })}

        {/* Robot Sprite with unambiguous directional nose/arrow */}
        <g transform={`translate(${startCenter.x}, ${startCenter.y}) rotate(${DIR_ROTATION[start.dir]})`}>
          {/* Directional arrow nose pointing UP (North in local frame) */}
          <polygon
            points="0,-20 7,-11 -7,-11"
            fill="#F59E0B"
            stroke="#1C1917"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          {/* Robot body */}
          <rect x={-11} y={-10} width={22} height={20} rx={6} fill="#38BDF8" stroke="#1C1917" strokeWidth={2} />
          {/* Eyes facing forward (top) */}
          <circle cx={-4.5} cy={-3.5} r={2.3} fill="#1C1917" />
          <circle cx={4.5} cy={-3.5} r={2.3} fill="#1C1917" />
          {/* Cute smile */}
          <line x1={-4} y1={4} x2={4} y2={4} stroke="#1C1917" strokeWidth={1.8} strokeLinecap="round" />
        </g>
      </svg>

      {/* Command Program Strip */}
      {program && program.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-white px-3 py-2">
          {program.map((cmd, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-xs font-black text-[#A8A29E]">→</span>}
              <span
                className={`inline-flex items-center rounded-xl border px-2.5 py-1 text-xs font-extrabold ${
                  cmd === 'LOOP2_FWD'
                    ? 'border-[#C4B5FD] bg-[#F5F3FF] text-[#6D28D9]'
                    : cmd === 'FWD'
                      ? 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]'
                      : 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]'
                }`}
              >
                {formatRobotCmd(cmd, isZh)}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Dispatcher ──
export const LogicVisual: React.FC<LogicVisualProps> = ({
  spec,
  compact = false,
  isZh = true,
  scratchpad,
  onToggleScratchpad,
}) => {
  switch (spec.kind) {
    case 'balance-scale':
      return (
        <BalanceScaleVisual
          scales={spec.scales}
          askItems={spec.askItems}
          revealedValues={spec.revealedValues}
          isZh={isZh}
        />
      );
    case 'pattern-matrix':
      return (
        <PatternMatrixVisual
          cells={spec.cells}
          highlightMissing={spec.highlightMissing}
          solvedCell={spec.solvedCell}
          isZh={isZh}
        />
      );
    case 'matrix-cell':
      return <SingleMatrixCellVisual cell={spec.cell} compact={compact} />;
    case 'logic-grid':
      return (
        <LogicGridVisual
          people={spec.people}
          attrA={spec.attrA}
          attrB={spec.attrB}
          attrATitleEn={spec.attrATitleEn}
          attrATitleZh={spec.attrATitleZh}
          attrBTitleEn={spec.attrBTitleEn}
          attrBTitleZh={spec.attrBTitleZh}
          cluesEn={spec.cluesEn}
          cluesZh={spec.cluesZh}
          solution={spec.solution}
          isZh={isZh}
          scratchpad={scratchpad}
          onToggleScratchpad={onToggleScratchpad}
        />
      );
    case 'robot-grid':
      return (
        <RobotGridVisual
          size={spec.size}
          start={spec.start}
          obstacles={spec.obstacles}
          star={spec.star}
          flags={spec.flags}
          program={spec.program}
          trail={spec.trail}
          highlightEnd={spec.highlightEnd}
          isZh={isZh}
        />
      );
    default:
      return <SpatialVisual spec={spec} compact={compact} isZh={isZh} />;
  }
};

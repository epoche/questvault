import React from 'react';
import type { BarModelSpec } from '../../subjects/math/barModelEngine';

interface BarModelSvgProps {
  spec: BarModelSpec;
  revealed: boolean;
}

/**
 * Original Singapore Math Tape Diagram / Bar Model SVG renderer.
 * Respects anti-spoiler mode: unknown quantities render as "?" until revealed=true.
 */
export const BarModelSvg: React.FC<BarModelSvgProps> = ({ spec, revealed }) => {
  const hasSecond = Boolean(spec.secondaryRow);
  const isComparison = spec.layout === 'comparison';
  const svgHeight = hasSecond ? 186 : 114;

  const renderRow = (
    segments: BarModelSpec['segments'],
    y: number,
    barHeight: number,
    rowTitle?: string,
  ) => {
    const startX = 24;
    const totalW = isComparison ? 496 : 552;
    const defaultRatio = 1 / Math.max(1, segments.length);
    let cursorX = startX;

    return (
      <g>
        {rowTitle && (
          <text
            x={startX}
            y={y - 7}
            fontSize="12"
            fontWeight="800"
            fill="#57534E"
            fontFamily="system-ui, sans-serif"
          >
            {rowTitle}
          </text>
        )}
        {segments.map((seg, idx) => {
          const minW = Math.min(46, totalW / Math.max(1, segments.length));
          const segW = Math.max(minW, totalW * (seg.widthRatio ?? defaultRatio));
          const x = cursorX;
          cursorX += segW;
          const displayVal = seg.hidden && !revealed ? '?' : seg.value;
          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={segW}
                height={barHeight}
                rx={idx === 0 || idx === segments.length - 1 ? 8 : 2}
                fill={seg.color}
                fillOpacity={seg.hidden && !revealed ? 0.28 : 0.88}
                stroke="#1C1917"
                strokeWidth="2.5"
              />
              <text
                x={x + segW / 2}
                y={y + barHeight / 2 - 4}
                textAnchor="middle"
                fontSize="15"
                fontWeight="900"
                fill={seg.hidden && !revealed ? '#1C1917' : '#FFFFFF'}
                fontFamily="system-ui, sans-serif"
              >
                {displayVal}
              </text>
              <text
                x={x + segW / 2}
                y={y + barHeight / 2 + 13}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill={seg.hidden && !revealed ? '#44403C' : '#FFFDF8'}
                fontFamily="system-ui, sans-serif"
              >
                {seg.label}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const topBracketText =
    spec.totalHidden && !revealed ? `${spec.totalLabel}: ?` : `${spec.totalLabel}: ${spec.totalValue}`;

  return (
    <div className="w-full overflow-hidden rounded-2xl border-2 border-[#E5DFD3] bg-[#FFFDF8] p-2.5">
      <svg
        viewBox={`0 0 600 ${svgHeight}`}
        className="mx-auto w-full max-w-[560px] h-auto"
        role="img"
        aria-label={`Bar model diagram for ${spec.totalLabel}`}
      >
        {isComparison ? (
          <>
            {/* Top summary pill + right-side combined brace spanning BOTH rows */}
            <rect x="175" y="6" width="250" height="24" rx="12" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
            <text
              x="300"
              y="22"
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill="#92400E"
              fontFamily="system-ui, sans-serif"
            >
              {topBracketText}
            </text>
            <path
              d="M 530 46 L 544 46 L 544 170 L 530 170 M 544 108 L 556 108"
              fill="none"
              stroke="#1C1917"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text
              x="574"
              y="113"
              textAnchor="middle"
              fontSize="15"
              fontWeight="900"
              fill="#92400E"
              fontFamily="system-ui, sans-serif"
            >
              {spec.totalHidden && !revealed ? '?' : spec.totalValue}
            </text>
          </>
        ) : (
          <>
            {/* Top Total Bracket */}
            <path
              d="M 24 34 L 24 24 L 576 24 L 576 34"
              fill="none"
              stroke="#1C1917"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect x="175" y="6" width="250" height="24" rx="12" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
            <text
              x="300"
              y="22"
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill="#92400E"
              fontFamily="system-ui, sans-serif"
            >
              {topBracketText}
            </text>
          </>
        )}

        {/* Primary Bar */}
        {renderRow(spec.segments, 46, 54)}

        {/* Optional Secondary Comparison / Split Bar */}
        {spec.secondaryRow &&
          renderRow(spec.secondaryRow.segments, 122, 48, spec.secondaryRow.title)}
      </svg>
    </div>
  );
};

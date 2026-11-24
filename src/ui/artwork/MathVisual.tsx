import React, { useId } from 'react';
import type { MathVisualSpec } from '../../subjects/math/types';

interface MathVisualProps {
  spec: MathVisualSpec;
  className?: string;
}

export const MathVisual: React.FC<MathVisualProps> = ({ spec, className = '' }) => {
  const uid = useId().replace(/:/g, '');
  switch (spec.kind) {
    case 'array': {
      const gap = 22;
      const padX = 24;
      const padY = 20;
      const w = padX * 2 + (spec.cols - 1) * gap;
      const viewW = Math.max(w, 160);
      const startX = (viewW - w) / 2 + padX;
      const h = padY * 2 + (spec.rows - 1) * gap + (spec.caption ? 18 : 0);
      const col = spec.color ?? '#2563EB';
      return (
        <svg
          viewBox={`0 0 ${viewW} ${h}`}
          className={`mx-auto max-h-40 w-auto ${className}`}
          role="img"
          aria-label={`${spec.rows} by ${spec.cols} array`}
        >
          {Array.from({ length: spec.rows }).map((_, r) =>
            Array.from({ length: spec.cols }).map((__, c) => (
              <circle
                key={`${r}-${c}`}
                cx={startX + c * gap}
                cy={padY + r * gap}
                r={7}
                fill={col}
                stroke="#1C1917"
                strokeWidth={1.6}
              />
            )),
          )}
          {spec.caption && (
            <text
              x={viewW / 2}
              y={h - 4}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill="#1C1917"
            >
              {spec.caption}
            </text>
          )}
        </svg>
      );
    }

    case 'fraction-bar': {
      const barW = 280;
      const barH = 38;
      const segW = barW / spec.denominator;
      const col = spec.color ?? '#0D9488';
      return (
        <svg
          viewBox="0 0 320 74"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`Fraction bar ${spec.numerator} out of ${spec.denominator}`}
        >
          <rect
            x="20"
            y="10"
            width={barW}
            height={barH}
            rx="10"
            fill="#F3EFE7"
            stroke="#1C1917"
            strokeWidth="2"
          />
          {Array.from({ length: spec.denominator }).map((_, i) => (
            <rect
              key={i}
              x={20 + i * segW}
              y="10"
              width={segW}
              height={barH}
              rx={i === 0 || i === spec.denominator - 1 ? 4 : 0}
              fill={i < spec.numerator ? col : '#FFFFFF'}
              stroke="#1C1917"
              strokeWidth="1.5"
            />
          ))}
          {spec.label && (
            <text
              x="160"
              y="66"
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill="#1C1917"
            >
              {spec.label}
            </text>
          )}
        </svg>
      );
    }

    case 'fraction-compare': {
      const barW = 230;
      const leftSeg = barW / spec.leftDen;
      const rightSeg = barW / spec.rightDen;
      return (
        <svg
          viewBox="0 0 320 96"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`Compare ${spec.leftNum}/${spec.leftDen} and ${spec.rightNum}/${spec.rightDen}`}
        >
          <text x="16" y="33" fontSize="14" fontWeight="800" fill="#1D4ED8">
            {spec.leftNum}/{spec.leftDen}
          </text>
          {Array.from({ length: spec.leftDen }).map((_, i) => (
            <rect
              key={`l-${i}`}
              x={64 + i * leftSeg}
              y="12"
              width={leftSeg}
              height="30"
              fill={i < spec.leftNum ? '#2563EB' : '#FFFFFF'}
              stroke="#1C1917"
              strokeWidth="1.5"
            />
          ))}

          <text x="16" y="75" fontSize="14" fontWeight="800" fill="#0F766E">
            {spec.rightNum}/{spec.rightDen}
          </text>
          {Array.from({ length: spec.rightDen }).map((_, i) => (
            <rect
              key={`r-${i}`}
              x={64 + i * rightSeg}
              y="54"
              width={rightSeg}
              height="30"
              fill={i < spec.rightNum ? '#0D9488' : '#FFFFFF'}
              stroke="#1C1917"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      );
    }

    case 'fraction-op': {
      const barW = 280;
      const segW = barW / spec.denominator;
      const result = spec.op === '+' ? spec.aNum + spec.bNum : Math.max(0, spec.aNum - spec.bNum);
      return (
        <svg
          viewBox="0 0 320 76"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`${spec.aNum}/${spec.denominator} ${spec.op} ${spec.bNum}/${spec.denominator}`}
        >
          {Array.from({ length: spec.denominator }).map((_, i) => {
            let fill = '#FFFFFF';
            if (spec.op === '+') {
              if (i < spec.aNum) fill = '#2563EB';
              else if (i < spec.aNum + spec.bNum) fill = '#F59E0B';
            } else {
              if (i < result) fill = '#7C3AED';
              else if (i < spec.aNum) fill = '#FECDD3';
            }
            return (
              <rect
                key={i}
                x={20 + i * segW}
                y="12"
                width={segW}
                height="36"
                fill={fill}
                stroke="#1C1917"
                strokeWidth="1.5"
              />
            );
          })}
          <text x="160" y="68" textAnchor="middle" fontSize="13" fontWeight="800" fill="#44403C">
            {spec.aNum}/{spec.denominator} {spec.op} {spec.bNum}/{spec.denominator}
          </text>
        </svg>
      );
    }

    case 'area-grid': {
      const unit = spec.unit ?? 'u';
      if (spec.showMissing) {
        // Unpartitioned bounding rectangle with dual-bound aspect scaling and caption below
        const maxW = 160;
        const maxH = 84;
        const safeW = Math.max(1, spec.width);
        const safeH = Math.max(1, spec.height);
        const scale = Math.min(maxW / safeW, maxH / safeH);
        const rectW = Math.max(54, Math.round(safeW * scale));
        const rectH = Math.max(48, Math.round(safeH * scale));
        const ox = (280 - rectW) / 2;
        const oy = 26;
        return (
          <svg
            viewBox={`0 0 280 ${oy + rectH + 34}`}
            className={`mx-auto max-h-40 w-auto ${className}`}
            role="img"
            aria-label={`Rectangle with area ${spec.width * spec.height} square ${unit}`}
          >
            <text x="140" y="17" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1D4ED8">
              {spec.showMissing === 'width' ? '?' : `${spec.width} ${unit}`}
            </text>
            <text
              x={ox - 10}
              y={oy + rectH / 2 + 4}
              textAnchor="end"
              fontSize="13"
              fontWeight="800"
              fill="#0F766E"
            >
              {spec.showMissing === 'height' ? '?' : `${spec.height} ${unit}`}
            </text>
            <rect
              x={ox}
              y={oy}
              width={rectW}
              height={rectH}
              rx="6"
              fill="#DBEAFE"
              stroke="#1C1917"
              strokeWidth="2.5"
            />
            <text
              x="140"
              y={oy + rectH + 22}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill="#1E3A8A"
            >
              Area = {spec.width * spec.height} sq {unit}
            </text>
          </svg>
        );
      }

      const cols = Math.min(spec.width, 9);
      const rows = Math.min(spec.height, 9);
      const cell = Math.min(24, Math.floor(176 / Math.max(cols, rows)));
      const gridW = cols * cell;
      const gridH = rows * cell;
      const ox = (280 - gridW) / 2;
      const oy = 26;
      return (
        <svg
          viewBox={`0 0 280 ${oy + gridH + 22}`}
          className={`mx-auto max-h-44 w-auto ${className}`}
          role="img"
          aria-label={`Area grid ${spec.width} by ${spec.height} ${unit}`}
        >
          <text x="140" y="17" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1D4ED8">
            {`${spec.width} ${unit}`}
          </text>
          <text
            x={ox - 10}
            y={oy + gridH / 2 + 4}
            textAnchor="end"
            fontSize="13"
            fontWeight="800"
            fill="#0F766E"
          >
            {`${spec.height} ${unit}`}
          </text>
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={ox + c * cell}
                y={oy + r * cell}
                width={cell}
                height={cell}
                fill="#DBEAFE"
                stroke="#1C1917"
                strokeWidth="1.3"
              />
            )),
          )}
        </svg>
      );
    }

    case 'dual-area-grid': {
      const cell = 18;
      const lw = spec.leftW * cell;
      const lh = spec.leftH * cell;
      const rw = spec.rightW * cell;
      const rh = spec.rightH * cell;
      const maxH = Math.max(lh, rh);
      return (
        <svg
          viewBox={`0 0 320 ${maxH + 46}`}
          className={`mx-auto max-h-40 w-full max-w-xs ${className}`}
          role="img"
          aria-label={`${spec.leftCaption} compared to ${spec.rightCaption}`}
        >
          {Array.from({ length: spec.leftH }).map((_, r) =>
            Array.from({ length: spec.leftW }).map((__, c) => (
              <rect
                key={`l-${r}-${c}`}
                x={22 + c * cell}
                y={12 + (maxH - lh) / 2 + r * cell}
                width={cell}
                height={cell}
                fill="#DBEAFE"
                stroke="#1C1917"
                strokeWidth="1.2"
              />
            )),
          )}
          <text x={22 + lw / 2} y={maxH + 34} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1D4ED8">
            {spec.leftCaption}
          </text>

          {Array.from({ length: spec.rightH }).map((_, r) =>
            Array.from({ length: spec.rightW }).map((__, c) => (
              <rect
                key={`r-${r}-${c}`}
                x={198 + c * cell}
                y={12 + (maxH - rh) / 2 + r * cell}
                width={cell}
                height={cell}
                fill="#CCFBF1"
                stroke="#1C1917"
                strokeWidth="1.2"
              />
            )),
          )}
          <text x={198 + rw / 2} y={maxH + 34} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0F766E">
            {spec.rightCaption}
          </text>
        </svg>
      );
    }

    case 'dual-factor-pairs': {
      return (
        <svg
          viewBox="0 0 340 100"
          className={`mx-auto max-w-sm w-full ${className}`}
          role="img"
          aria-label={`${spec.leftValue} ${spec.leftTag} vs ${spec.rightValue} ${spec.rightTag}`}
        >
          <rect x="44" y="6" width="76" height="26" rx="13" fill="#059669" stroke="#1C1917" strokeWidth="1.8" />
          <text x="82" y="24" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#FFFFFF">
            {spec.leftValue} · {spec.leftTag}
          </text>
          {spec.leftPairs.map(([a, b], i) => (
            <g key={`lp-${i}`}>
              <rect x={50 + i * 64} y="50" width="64" height="28" rx="10" fill="#ECFDF5" stroke="#059669" strokeWidth="1.6" />
              <text x={82 + i * 64} y="69" textAnchor="middle" fontSize="13" fontWeight="800" fill="#065F46">
                {a} × {b}
              </text>
            </g>
          ))}

          <line x1="168" y1="10" x2="168" y2="88" stroke="#E5DFD3" strokeWidth="2" strokeDasharray="4 4" />

          <rect x="200" y="6" width="112" height="26" rx="13" fill="#7C3AED" stroke="#1C1917" strokeWidth="1.8" />
          <text x="256" y="24" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#FFFFFF">
            {spec.rightValue} · {spec.rightTag}
          </text>
          {spec.rightPairs.map(([a, b], i) => (
            <g key={`rp-${i}`}>
              <rect x={186 + i * 74} y="50" width="66" height="28" rx="10" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.6" />
              <text x={219 + i * 74} y="69" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4C1D95">
                {a} × {b}
              </text>
            </g>
          ))}
        </svg>
      );
    }

    case 'perimeter-rect': {
      const unit = spec.unit ?? 'ft';
      const isSquare = spec.width === spec.height;
      let w: number;
      let h: number;
      if (isSquare) {
        // True 1:1 geometric square
        w = 88;
        h = 88;
      } else {
        const maxW = 168;
        const maxH = 88;
        const ratio = spec.width / Math.max(spec.height, 1);
        if (ratio >= maxW / maxH) {
          w = maxW;
          h = Math.max(46, Math.round(maxW / ratio));
        } else if (ratio >= 1) {
          h = maxH;
          w = Math.min(maxW, Math.round(maxH * ratio));
        } else {
          h = maxH;
          w = Math.max(46, Math.round(maxH * ratio));
        }
      }
      const ox = (280 - w) / 2;
      const oy = 26;
      return (
        <svg
          viewBox={`0 0 280 ${oy + h + 28}`}
          className={`mx-auto max-h-36 w-auto ${className}`}
          role="img"
          aria-label={`${isSquare ? 'Square' : 'Rectangle'} ${spec.width} by ${spec.height} ${unit}`}
        >
          <rect
            x={ox}
            y={oy}
            width={w}
            height={h}
            rx="6"
            fill="#FEF3C7"
            stroke="#EA580C"
            strokeWidth="3.5"
          />
          <text x="140" y="18" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1C1917">
            {spec.width} {unit}
          </text>
          <text x="140" y={oy + h + 18} textAnchor="middle" fontSize="13" fontWeight="800" fill="#1C1917">
            {spec.width} {unit}
          </text>
          <text x={ox - 8} y={oy + h / 2 + 4} textAnchor="end" fontSize="13" fontWeight="800" fill="#C2410C">
            {spec.unknownSide ? '?' : `${spec.height} ${unit}`}
          </text>
          <text x={ox + w + 8} y={oy + h / 2 + 4} textAnchor="start" fontSize="13" fontWeight="800" fill="#C2410C">
            {spec.unknownSide ? '?' : `${spec.height} ${unit}`}
          </text>
        </svg>
      );
    }

    case 'factor-pairs': {
      return (
        <svg
          viewBox="0 0 320 90"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`Factor pairs of ${spec.value}`}
        >
          <rect x="130" y="6" width="60" height="28" rx="14" fill="#7C3AED" stroke="#1C1917" strokeWidth="2" />
          <text x="160" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill="#FFFFFF">
            {spec.value}
          </text>
          {spec.pairs.map(([a, b], idx) => {
            const spacing = 300 / Math.max(spec.pairs.length, 1);
            const cx = 10 + spacing * idx + spacing / 2;
            return (
              <g key={`${a}-${b}`}>
                <line x1="160" y1="34" x2={cx} y2="54" stroke="#A78BFA" strokeWidth="2" />
                <rect
                  x={cx - 30}
                  y="54"
                  width="60"
                  height="28"
                  rx="10"
                  fill="#F5F3FF"
                  stroke="#7C3AED"
                  strokeWidth="1.8"
                />
                <text x={cx} y="73" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4C1D95">
                  {a} × {b}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    case 'area-model': {
      const totalBoxW = 228;
      const rawRatio = spec.tens / Math.max(spec.tens + spec.ones, 1);
      // Proportionally reflect tens vs ones while keeping ones box readable
      const tensW = Math.round(totalBoxW * Math.min(0.75, Math.max(0.58, rawRatio)));
      const onesW = totalBoxW - tensW;
      const startX = 48;
      const tensCx = startX + tensW / 2;
      const onesCx = startX + tensW + onesW / 2;
      return (
        <svg
          viewBox="0 0 300 106"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`Area model ${spec.tens + spec.ones} times ${spec.multiplier}`}
        >
          <text x={tensCx} y="18" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1D4ED8">
            {spec.tens}
          </text>
          <text x={onesCx} y="18" textAnchor="middle" fontSize="14" fontWeight="800" fill="#D97706">
            + {spec.ones}
          </text>
          <text x="36" y="64" textAnchor="end" fontSize="15" fontWeight="800" fill="#1C1917">
            × {spec.multiplier}
          </text>
          <rect x={startX} y="26" width={tensW} height="62" rx="6" fill="#DBEAFE" stroke="#1C1917" strokeWidth="2" />
          <rect x={startX + tensW} y="26" width={onesW} height="62" rx="6" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
          <text x={tensCx} y="62" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1E3A8A">
            {spec.tens} × {spec.multiplier}
          </text>
          <text x={onesCx} y="62" textAnchor="middle" fontSize={onesW < 64 ? '12.5' : '14'} fontWeight="800" fill="#92400E">
            {spec.ones} × {spec.multiplier}
          </text>
        </svg>
      );
    }

    case 'bar-model': {
      const barW = 280;
      const totalWeight = spec.parts.reduce((s, p) => s + (p.weight ?? 1), 0) || 1;
      return (
        <svg
          viewBox="0 0 320 76"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={spec.totalLabel}
        >
          <text x="160" y="16" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1C1917">
            {spec.totalLabel}
          </text>
          {(() => {
            const rawWidths = spec.parts.map((p) => (barW * Math.max(0.05, p.weight ?? 1)) / totalWeight);
            const minSeg = spec.parts.length <= 3 ? 58 : 34;
            const adjusted = [...rawWidths];
            if (spec.parts.length <= 4) {
              let deficit = 0;
              let flexSum = 0;
              for (let i = 0; i < adjusted.length; i += 1) {
                if (adjusted[i] < minSeg) {
                  deficit += minSeg - adjusted[i];
                  adjusted[i] = minSeg;
                } else {
                  flexSum += adjusted[i] - minSeg;
                }
              }
              if (deficit > 0 && flexSum > 0) {
                for (let i = 0; i < adjusted.length; i += 1) {
                  if (adjusted[i] > minSeg) {
                    const share = ((adjusted[i] - minSeg) / flexSum) * deficit;
                    adjusted[i] = Math.max(minSeg, adjusted[i] - share);
                  }
                }
              }
            }
            let cx = 20;
            return spec.parts.map((part, idx) => {
              const segW = adjusted[idx];
              const x = cx;
              cx += segW;
              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y="26"
                    width={segW}
                    height="38"
                    fill={part.color}
                    stroke="#1C1917"
                    strokeWidth="1.8"
                  />
                  <text
                    x={x + segW / 2}
                    y="50"
                    textAnchor="middle"
                    fontSize={spec.parts.length > 4 || segW < 64 ? '10.5' : '12'}
                    fontWeight="800"
                    fill={part.color === '#E5DFD3' ? '#1C1917' : '#FFFFFF'}
                  >
                    {segW < 50 && part.label.includes('?') ? '?' : part.label}
                  </text>
                </g>
              );
            });
          })()}
        </svg>
      );
    }

    case 'decimal-grid': {
      const cell = 11;
      const ox = 85;
      const oy = 8;
      return (
        <svg
          viewBox="0 0 280 140"
          className={`mx-auto max-h-36 w-auto ${className}`}
          role="img"
          aria-label={spec.label}
        >
          {Array.from({ length: 10 }).map((_, r) =>
            Array.from({ length: 10 }).map((__, c) => {
              const idx = c * 10 + r;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={ox + c * cell}
                  y={oy + r * cell}
                  width={cell}
                  height={cell}
                  fill={idx < spec.shaded ? '#F59E0B' : '#FFFFFF'}
                  stroke="#1C1917"
                  strokeWidth="0.8"
                />
              );
            }),
          )}
          <text x="140" y="134" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1C1917">
            {spec.label}
          </text>
        </svg>
      );
    }

    case 'angle-view': {
      const deg = Math.max(10, Math.min(175, spec.degrees));
      const rad = (deg * Math.PI) / 180;
      const vx = 140;
      const vy = 104;
      const rayLen = 84;
      const x2 = vx + Math.cos(rad) * rayLen;
      const y2 = vy - Math.sin(rad) * rayLen;
      const arcR = 28;
      const ax = vx + Math.cos(rad) * arcR;
      const ay = vy - Math.sin(rad) * arcR;
      const color = deg === 90 ? '#059669' : deg < 90 ? '#2563EB' : '#EA580C';
      const labelRad = rad / 2;
      const lx = vx + Math.cos(labelRad) * 46;
      const ly = vy - Math.sin(labelRad) * 46;
      const ariaLabel = spec.label
        ? spec.label
        : spec.showDegrees
          ? `Angle measuring ${deg} degrees`
          : 'Angle diagram';
      return (
        <svg
          viewBox="0 0 280 130"
          className={`mx-auto max-h-36 w-auto ${className}`}
          role="img"
          aria-label={ariaLabel}
        >
          {/* Protractor faint guide */}
          <path
            d={`M ${vx - 76} ${vy} A 76 76 0 0 1 ${vx + 76} ${vy}`}
            fill="none"
            stroke="#E7E2D8"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {deg === 90 ? (
            <rect
              x={vx}
              y={vy - 18}
              width="18"
              height="18"
              fill="#ECFDF5"
              stroke={color}
              strokeWidth="2.4"
            />
          ) : (
            <path
              d={`M ${vx + arcR} ${vy} A ${arcR} ${arcR} 0 0 0 ${ax.toFixed(1)} ${ay.toFixed(1)}`}
              fill="none"
              stroke={color}
              strokeWidth="3"
            />
          )}
          {/* Horizontal base ray */}
          <line x1={vx} y1={vy} x2={vx + rayLen} y2={vy} stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" />
          {/* Second ray */}
          <line x1={vx} y1={vy} x2={x2} y2={y2} stroke={color} strokeWidth="3.4" strokeLinecap="round" />
          <circle cx={vx} cy={vy} r="4.5" fill="#1C1917" />
          {spec.showDegrees && (
            <text x={lx} y={ly} textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>
              {deg}°
            </text>
          )}
          {spec.label && (
            <text x="140" y="124" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#44403C">
              {spec.label}
            </text>
          )}
        </svg>
      );
    }

    case 'line-relation': {
      return (
        <svg
          viewBox="0 0 280 112"
          className={`mx-auto max-h-32 w-auto ${className}`}
          role="img"
          aria-label={spec.label ?? 'Line pair diagram'}
        >
          {spec.relation === 'parallel' && (
            <g stroke="#2563EB" strokeWidth="3.4" strokeLinecap="round">
              <line x1="48" y1="34" x2="232" y2="34" />
              <line x1="48" y1="68" x2="232" y2="68" />
              <polyline points="134,28 144,34 134,40" fill="none" stroke="#1D4ED8" strokeWidth="2.4" />
              <polyline points="134,62 144,68 134,74" fill="none" stroke="#1D4ED8" strokeWidth="2.4" />
            </g>
          )}
          {spec.relation === 'perpendicular' && (
            <g>
              <line x1="56" y1="54" x2="224" y2="54" stroke="#1C1917" strokeWidth="3.4" strokeLinecap="round" />
              <line x1="140" y1="14" x2="140" y2="90" stroke="#059669" strokeWidth="3.4" strokeLinecap="round" />
              <rect x="140" y="38" width="16" height="16" fill="#ECFDF5" stroke="#059669" strokeWidth="2.4" />
            </g>
          )}
          {spec.relation === 'intersecting' && (
            <g strokeLinecap="round" strokeWidth="3.4">
              <line x1="54" y1="78" x2="226" y2="26" stroke="#EA580C" />
              <line x1="54" y1="28" x2="226" y2="76" stroke="#7C3AED" />
              <circle cx="140" cy="52" r="4.5" fill="#1C1917" />
            </g>
          )}
          {spec.label && (
            <text x="140" y="106" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#44403C">
              {spec.label}
            </text>
          )}
        </svg>
      );
    }

    case 'rectangle-angles': {
      const rx = 64;
      const ry = 18;
      const rw = 152;
      const rh = 72;
      const sq = 13;
      return (
        <svg
          viewBox="0 0 280 116"
          className={`mx-auto max-h-36 w-auto ${className}`}
          role="img"
          aria-label={spec.label ?? 'Rectangle with 4 right angles and 2 pairs of parallel sides'}
        >
          <rect x={rx} y={ry} width={rw} height={rh} fill="#F8FAFC" />
          {/* 4 green 90° right-angle corner squares */}
          <rect x={rx} y={ry} width={sq} height={sq} fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
          <rect x={rx + rw - sq} y={ry} width={sq} height={sq} fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
          <rect x={rx} y={ry + rh - sq} width={sq} height={sq} fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
          <rect x={rx + rw - sq} y={ry + rh - sq} width={sq} height={sq} fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
          {/* Top & bottom parallel pair (blue) */}
          <line x1={rx} y1={ry} x2={rx + rw} y2={ry} stroke="#2563EB" strokeWidth="3.2" strokeLinecap="round" />
          <line x1={rx} y1={ry + rh} x2={rx + rw} y2={ry + rh} stroke="#2563EB" strokeWidth="3.2" strokeLinecap="round" />
          <polyline points="136,13 144,18 136,23" fill="none" stroke="#1D4ED8" strokeWidth="2.2" />
          <polyline points="136,85 144,90 136,95" fill="none" stroke="#1D4ED8" strokeWidth="2.2" />
          {/* Left & right parallel pair (teal) */}
          <line x1={rx} y1={ry} x2={rx} y2={ry + rh} stroke="#0D9488" strokeWidth="3.2" strokeLinecap="round" />
          <line x1={rx + rw} y1={ry} x2={rx + rw} y2={ry + rh} stroke="#0D9488" strokeWidth="3.2" strokeLinecap="round" />
          <polyline points="59,58 64,50 69,58" fill="none" stroke="#0F766E" strokeWidth="2.2" />
          <polyline points="211,58 216,50 221,58" fill="none" stroke="#0F766E" strokeWidth="2.2" />
          {spec.label && (
            <text x="140" y="110" textAnchor="middle" fontSize="12" fontWeight="800" fill="#44403C">
              {spec.label}
            </text>
          )}
        </svg>
      );
    }

    case 'number-line-round': {
      const span = Math.max(1, spec.high - spec.low);
      const frac = Math.max(0, Math.min(1, (spec.value - spec.low) / span));
      const x1 = 36;
      const x2 = 284;
      const px = x1 + frac * (x2 - x1);
      const mx = (x1 + x2) / 2;
      return (
        <svg
          viewBox="0 0 320 82"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`Number line from ${spec.low} to ${spec.high} showing ${spec.value}`}
        >
          <line x1={x1} y1="46" x2={x2} y2="46" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
          <line x1={x1} y1="38" x2={x1} y2="54" stroke="#1C1917" strokeWidth="2.5" />
          <line x1={x2} y1="38" x2={x2} y2="54" stroke="#1C1917" strokeWidth="2.5" />
          {spec.showMid !== false && (
            <g>
              <line x1={mx} y1="40" x2={mx} y2="52" stroke="#78716C" strokeWidth="2" />
              <text x={mx} y="72" textAnchor="middle" fontSize="11" fontWeight="700" fill="#78716C">
                {spec.mid.toLocaleString()}
              </text>
            </g>
          )}
          <text x={x1} y="72" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1C1917">
            {spec.low.toLocaleString()}
          </text>
          <text x={x2} y="72" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1C1917">
            {spec.high.toLocaleString()}
          </text>
          <circle cx={px} cy="46" r="6.5" fill="#2563EB" stroke="#1C1917" strokeWidth="2" />
          <rect x={px - 28} y="10" width="56" height="22" rx="8" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.6" />
          <text x={px} y="25" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1D4ED8">
            {spec.value.toLocaleString()}
          </text>
        </svg>
      );
    }

    case 'place-value': {
      const raw = String(Math.max(0, Math.floor(spec.value)));
      const digits = raw.length < 3 ? raw.padStart(3, '0') : raw.length > 5 ? raw.slice(-5) : raw;
      const allPlaces: { key: 'ten-thousands' | 'thousands' | 'hundreds' | 'tens' | 'ones'; label: string }[] = [
        { key: 'ten-thousands', label: 'TTh' },
        { key: 'thousands', label: 'Th' },
        { key: 'hundreds', label: 'H' },
        { key: 'tens', label: 'T' },
        { key: 'ones', label: 'O' },
      ];
      const activePlaces = allPlaces.slice(allPlaces.length - digits.length);
      const cols = activePlaces.map((p, idx) => ({ ...p, digit: digits[idx] }));
      const boxW = cols.length === 5 ? 54 : 60;
      const gap = cols.length === 5 ? 6 : 8;
      const totalW = cols.length * boxW + (cols.length - 1) * gap;
      const startX = (320 - totalW) / 2;
      return (
        <svg
          viewBox="0 0 320 84"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`Place value chart for ${spec.value}`}
        >
          {cols.map((c, idx) => {
            const x = startX + idx * (boxW + gap);
            const active = c.key === spec.highlightPlace;
            return (
              <g key={c.key}>
                <rect
                  x={x}
                  y="10"
                  width={boxW}
                  height="64"
                  rx="12"
                  fill={active ? '#FEF3C7' : '#FAF7F2'}
                  stroke={active ? '#D97706' : '#D8D0C1'}
                  strokeWidth={active ? '2.6' : '1.8'}
                />
                <text x={x + boxW / 2} y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill={active ? '#B45309' : '#78716C'}>
                  {c.label}
                </text>
                <text x={x + boxW / 2} y="60" textAnchor="middle" fontSize="24" fontWeight="800" fill="#1C1917">
                  {c.digit}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    case 'time-jump': {
      const count = Math.max(1, spec.jumps.length);
      const xStart = 36;
      const xEnd = 284;
      const step = (xEnd - xStart) / count;
      return (
        <svg
          viewBox="0 0 320 86"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`Time jumps starting at ${spec.startLabel}`}
        >
          <line x1={xStart} y1="54" x2={xEnd} y2="54" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" />
          {spec.jumps.map((jmp, i) => {
            const a = xStart + i * step;
            const b = xStart + (i + 1) * step;
            const mid = (a + b) / 2;
            return (
              <g key={i}>
                <path
                  d={`M ${a} 54 Q ${mid} 16 ${b} 54`}
                  fill="none"
                  stroke={i % 2 === 0 ? '#2563EB' : '#0D9488'}
                  strokeWidth="2.8"
                />
                <text x={mid} y="24" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={i % 2 === 0 ? '#1D4ED8' : '#0F766E'}>
                  {jmp}
                </text>
                <circle cx={a} cy="54" r="4" fill="#1C1917" />
              </g>
            );
          })}
          <circle cx={xEnd} cy="54" r="4.5" fill="#EA580C" stroke="#1C1917" strokeWidth="1.5" />
          <text x={xStart} y="76" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1C1917">
            {spec.startLabel}
          </text>
          <text x={xEnd} y="76" textAnchor="middle" fontSize="12" fontWeight="800" fill="#C2410C">
            {spec.endLabel ?? '?'}
          </text>
        </svg>
      );
    }

    case 'line-plot': {
      const n = Math.max(1, spec.marks.length);
      const x1 = 36;
      const x2 = 284;
      const step = n > 1 ? (x2 - x1) / (n - 1) : 0;
      const maxStack = Math.max(1, ...spec.marks.map((m) => m.count));
      const baseLineY = 26 + maxStack * 16 + 10;
      return (
        <svg
          viewBox={`0 0 320 ${baseLineY + 26}`}
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={spec.title}
        >
          <text x="160" y="15" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1C1917">
            {spec.title}
          </text>
          <line x1="22" y1={baseLineY} x2="298" y2={baseLineY} stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
          {spec.marks.map((m, idx) => {
            const cx = n > 1 ? x1 + idx * step : 160;
            return (
              <g key={m.label}>
                <line x1={cx} y1={baseLineY - 4} x2={cx} y2={baseLineY + 5} stroke="#1C1917" strokeWidth="2" />
                <text x={cx} y={baseLineY + 19} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#44403C">
                  {m.label}
                </text>
                {Array.from({ length: m.count }).map((_, k) => (
                  <text
                    key={k}
                    x={cx}
                    y={baseLineY - 10 - k * 15}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="900"
                    fill="#2563EB"
                  >
                    ✕
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      );
    }

    case 'symmetry-shape': {
      const cx = 140;
      const cy = 62;
      const showLines = spec.showLines !== false;
      const renderShape = () => {
        switch (spec.shape) {
          case 'square':
            return (
              <g>
                <rect x={cx - 42} y={cy - 42} width="84" height="84" rx="4" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="3" />
                {showLines && (
                  <g stroke="#E11D48" strokeWidth="2.2" strokeDasharray="5 4">
                    <line x1={cx} y1={cy - 52} x2={cx} y2={cy + 52} />
                    <line x1={cx - 52} y1={cy} x2={cx + 52} y2={cy} />
                    <line x1={cx - 50} y1={cy - 50} x2={cx + 50} y2={cy + 50} />
                    <line x1={cx - 50} y1={cy + 50} x2={cx + 50} y2={cy - 50} />
                  </g>
                )}
              </g>
            );
          case 'rectangle':
            return (
              <g>
                <rect x={cx - 60} y={cy - 34} width="120" height="68" rx="4" fill="#DCFCE7" stroke="#15803D" strokeWidth="3" />
                {showLines && (
                  <g stroke="#E11D48" strokeWidth="2.2" strokeDasharray="5 4">
                    <line x1={cx} y1={cy - 46} x2={cx} y2={cy + 46} />
                    <line x1={cx - 72} y1={cy} x2={cx + 72} y2={cy} />
                  </g>
                )}
              </g>
            );
          case 'equilateral-triangle': {
            const r = 48;
            const pts = [0, 1, 2].map((i) => {
              const ang = (-90 + i * 120) * (Math.PI / 180);
              return [cx + r * Math.cos(ang), cy + 6 + r * Math.sin(ang)] as const;
            });
            return (
              <g>
                <polygon
                  points={pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}
                  fill="#FEF3C7"
                  stroke="#D97706"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {showLines && (
                  <g stroke="#E11D48" strokeWidth="2.2" strokeDasharray="5 4">
                    {pts.map((p, i) => {
                      const opp1 = pts[(i + 1) % 3];
                      const opp2 = pts[(i + 2) % 3];
                      const mx = (opp1[0] + opp2[0]) / 2;
                      const my = (opp1[1] + opp2[1]) / 2;
                      return <line key={i} x1={p[0]} y1={p[1]} x2={mx} y2={my} />;
                    })}
                  </g>
                )}
              </g>
            );
          }
          case 'isosceles-triangle':
            return (
              <g>
                <polygon
                  points={`${cx},${cy - 44} ${cx - 32},${cy + 42} ${cx + 32},${cy + 42}`}
                  fill="#F3E8FF"
                  stroke="#7C3AED"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {showLines && (
                  <line x1={cx} y1={cy - 52} x2={cx} y2={cy + 50} stroke="#E11D48" strokeWidth="2.4" strokeDasharray="5 4" />
                )}
              </g>
            );
          case 'regular-hexagon': {
            const r = 44;
            const pts = Array.from({ length: 6 }, (_, i) => {
              const ang = (-90 + i * 60) * (Math.PI / 180);
              return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)] as const;
            });
            return (
              <g>
                <polygon
                  points={pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}
                  fill="#CCFBF1"
                  stroke="#0D9488"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {showLines && (
                  <g stroke="#E11D48" strokeWidth="2" strokeDasharray="4 4">
                    {[0, 1, 2].map((i) => (
                      <line key={`v-${i}`} x1={pts[i][0]} y1={pts[i][1]} x2={pts[i + 3][0]} y2={pts[i + 3][1]} />
                    ))}
                    {[0, 1, 2].map((i) => {
                      const m1x = (pts[i][0] + pts[(i + 1) % 6][0]) / 2;
                      const m1y = (pts[i][1] + pts[(i + 1) % 6][1]) / 2;
                      const m2x = (pts[i + 3][0] + pts[(i + 4) % 6][0]) / 2;
                      const m2y = (pts[i + 3][1] + pts[(i + 4) % 6][1]) / 2;
                      return <line key={`m-${i}`} x1={m1x} y1={m1y} x2={m2x} y2={m2y} />;
                    })}
                  </g>
                )}
              </g>
            );
          }
          case 'heart':
          default:
            return (
              <g>
                <path
                  d={`M ${cx} ${cy + 40} C ${cx - 56} ${cy + 6} ${cx - 46} ${cy - 44} ${cx} ${cy - 18} C ${cx + 46} ${cy - 44} ${cx + 56} ${cy + 6} ${cx} ${cy + 40} Z`}
                  fill="#FCE7F3"
                  stroke="#DB2777"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {showLines && (
                  <line x1={cx} y1={cy - 44} x2={cx} y2={cy + 48} stroke="#E11D48" strokeWidth="2.4" strokeDasharray="5 4" />
                )}
              </g>
            );
        }
      };

      return (
        <svg
          viewBox="0 0 280 134"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={
            spec.showLines
              ? `Symmetry diagram of ${spec.shape}`
              : 'Polygon symmetry diagram'
          }
        >
          {renderShape()}
          {spec.label && (
            <text x="140" y="126" textAnchor="middle" fontSize="12" fontWeight="800" fill="#44403C">
              {spec.label}
            </text>
          )}
        </svg>
      );
    }

    case 'area-model-2x2': {
      const p11 = spec.aTens * spec.bTens;
      const p12 = spec.aOnes * spec.bTens;
      const p21 = spec.aTens * spec.bOnes;
      const p22 = spec.aOnes * spec.bOnes;
      const hide = Boolean(spec.hideProducts);
      return (
        <svg
          viewBox="0 0 320 148"
          className={`mx-auto max-w-xs w-full ${className}`}
          role="img"
          aria-label={`2x2 area model for ${spec.aTens + spec.aOnes} times ${spec.bTens + spec.bOnes}`}
        >
          {/* Top headers */}
          <text x="128" y="20" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1D4ED8">
            {spec.aTens}
          </text>
          <text x="197" y="20" textAnchor="middle" fontSize="13" fontWeight="800" fill="#78716C">
            +
          </text>
          <text x="242" y="20" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0D9488">
            {spec.aOnes}
          </text>

          {/* Left headers */}
          <text x="42" y="64" textAnchor="end" fontSize="13" fontWeight="800" fill="#D97706">
            {spec.bTens}
          </text>
          <text x="42" y="114" textAnchor="end" fontSize="13" fontWeight="800" fill="#9333EA">
            {spec.bOnes}
          </text>

          {/* 4 boxes */}
          <rect x="54" y="30" width="146" height="52" fill="#EFF6FF" stroke="#1C1917" strokeWidth="2.4" />
          <rect x="200" y="30" width="84" height="52" fill="#F0FDFA" stroke="#1C1917" strokeWidth="2.4" />
          <rect x="54" y="82" width="146" height="46" fill="#FFFBEB" stroke="#1C1917" strokeWidth="2.4" />
          <rect x="200" y="82" width="84" height="46" fill="#FAF5FF" stroke="#1C1917" strokeWidth="2.4" />

          <text x="127" y="61" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1E3A8A">
            {hide ? `${spec.bTens}×${spec.aTens}` : p11.toLocaleString('en-US')}
          </text>
          <text x="242" y="61" textAnchor="middle" fontSize="14" fontWeight="800" fill="#115E59">
            {hide ? `${spec.bTens}×${spec.aOnes}` : p12.toLocaleString('en-US')}
          </text>
          <text x="127" y="110" textAnchor="middle" fontSize="14" fontWeight="800" fill="#92400E">
            {hide ? `${spec.bOnes}×${spec.aTens}` : p21.toLocaleString('en-US')}
          </text>
          <text x="242" y="110" textAnchor="middle" fontSize="14" fontWeight="800" fill="#6B21A8">
            {hide ? `${spec.bOnes}×${spec.aOnes}` : p22.toLocaleString('en-US')}
          </text>
        </svg>
      );
    }

    case 'coord-grid': {
      const maxC = Math.max(4, Math.min(8, spec.maxCoord));
      const padLeft = 36;
      const padTop = 18;
      const gridSize = 144; // True 1:1 square grid!
      const step = gridSize / maxC;
      const toX = (x: number) => padLeft + x * step;
      const toY = (y: number) => padTop + gridSize - y * step;
      const [px, py] = spec.point;
      return (
        <svg
          viewBox="0 0 216 196"
          className={`mx-auto max-w-[230px] w-full ${className}`}
          role="img"
          aria-label={
            spec.showCoords
              ? `Coordinate grid showing point (${px}, ${py})`
              : 'Coordinate grid with point A'
          }
        >
          {/* Grid lines */}
          {Array.from({ length: maxC + 1 }, (_, i) => {
            const gx = toX(i);
            const gy = toY(i);
            return (
              <g key={i}>
                <line x1={gx} y1={padTop} x2={gx} y2={padTop + gridSize} stroke="#E5DFD3" strokeWidth="1.4" />
                <line x1={padLeft} y1={gy} x2={padLeft + gridSize} y2={gy} stroke="#E5DFD3" strokeWidth="1.4" />
                <text x={gx} y={padTop + gridSize + 15} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#57534E">
                  {i}
                </text>
                {i > 0 && (
                  <text x={padLeft - 10} y={gy + 4} textAnchor="end" fontSize="10.5" fontWeight="800" fill="#57534E">
                    {i}
                  </text>
                )}
              </g>
            );
          })}

          {/* Axes */}
          <line x1={padLeft} y1={padTop + gridSize} x2={padLeft + gridSize + 8} y2={padTop + gridSize} stroke="#1C1917" strokeWidth="2.4" />
          <line x1={padLeft} y1={padTop - 8} x2={padLeft} y2={padTop + gridSize} stroke="#1C1917" strokeWidth="2.4" />
          <text x={padLeft + gridSize + 14} y={padTop + gridSize + 4} fontSize="11" fontWeight="900" fill="#2563EB">
            x
          </text>
          <text x={padLeft - 2} y={padTop - 10} textAnchor="middle" fontSize="11" fontWeight="900" fill="#DB2777">
            y
          </text>

          {/* Optional second point & Manhattan guide */}
          {spec.secondPoint && (() => {
            const [bx, by] = spec.secondPoint;
            const bLabelX = toX(bx) > padLeft + gridSize - 38 ? toX(bx) - 8 : toX(bx) + 8;
            const bAnchor = toX(bx) > padLeft + gridSize - 38 ? 'end' : 'start';
            return (
              <g>
                <polyline
                  points={`${toX(px)},${toY(py)} ${toX(bx)},${toY(py)} ${toX(bx)},${toY(by)}`}
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="2.2"
                  strokeDasharray="4 3"
                />
                <circle cx={toX(bx)} cy={toY(by)} r="6" fill="#0D9488" stroke="#1C1917" strokeWidth="2" />
                <text
                  x={bLabelX}
                  y={Math.max(padTop + 12, toY(by) - 8)}
                  textAnchor={bAnchor}
                  fontSize="11"
                  fontWeight="900"
                  fill="#0F766E"
                >
                  {spec.showCoords ? `B (${bx}, ${by})` : 'B'}
                </text>
              </g>
            );
          })()}

          {/* Primary Point */}
          <circle cx={toX(px)} cy={toY(py)} r="6.5" fill="#E11D48" stroke="#1C1917" strokeWidth="2" />
          <text
            x={toX(px) > padLeft + gridSize - 42 ? toX(px) - 9 : toX(px) + 9}
            textAnchor={toX(px) > padLeft + gridSize - 42 ? 'end' : 'start'}
            y={Math.max(padTop + 12, toY(py) - 8)}
            fontSize="11"
            fontWeight="900"
            fill="#BE123C"
          >
            {spec.showCoords ? `A (${px}, ${py})` : 'A'}
          </text>

          {spec.label && (
            <text x="108" y="191" textAnchor="middle" fontSize="11" fontWeight="800" fill="#44403C">
              {spec.label}
            </text>
          )}
        </svg>
      );
    }

    case 'us-money': {
      const bills = spec.bills ?? [];
      const coins = spec.coins ?? [];
      const width = 360;
      const headerH = 30;
      const billW = 84;
      const billH = 40;
      const billGap = 12;
      const billCols = 3;
      const billRows = bills.length > 0 ? Math.ceil(bills.length / billCols) : 0;
      const billsSectionH = billRows > 0 ? billRows * (billH + 10) + 6 : 0;

      const coinPitchX = 54;
      const coinPitchY = 52;
      const coinCols = 6;
      const coinRows = coins.length > 0 ? Math.ceil(coins.length / coinCols) : 0;
      const coinsSectionH = coinRows > 0 ? coinRows * coinPitchY + 8 : 0;

      const height = Math.max(92, headerH + billsSectionH + coinsSectionH + 14);
      const billsTopY = headerH + 8;
      const coinsTopY = billsTopY + billsSectionH + (billRows > 0 && coinRows > 0 ? 4 : 0);

      const coinStyle = (c: 'quarter' | 'dime' | 'nickel' | 'penny') => {
        switch (c) {
          case 'quarter':
            return { r: 22, label: '25¢', sub: 'Q', fill: `url(#${uid}-silver)`, rim: '#64748B', text: '#1E293B', fs: 11.5 };
          case 'nickel':
            return { r: 19, label: '5¢', sub: 'N', fill: `url(#${uid}-silver)`, rim: '#64748B', text: '#1E293B', fs: 11 };
          case 'penny':
            return { r: 17.5, label: '1¢', sub: 'P', fill: `url(#${uid}-copper)`, rim: '#92400E', text: '#451A03', fs: 10.5 };
          case 'dime':
            return { r: 15.5, label: '10¢', sub: 'D', fill: `url(#${uid}-silver)`, rim: '#64748B', text: '#1E293B', fs: 9.5 };
        }
      };

      const ariaDesc =
        spec.mode === 'change'
          ? `U.S. money payment visual with ${bills.length} bill${bills.length === 1 ? '' : 's'}${spec.priceLabel ? ` for price ${spec.priceLabel}` : ''}`
          : `U.S. money counting visual with ${bills.length} bill${bills.length === 1 ? '' : 's'} and ${coins.length} coin${coins.length === 1 ? '' : 's'}`;

      return (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={`mx-auto max-w-md w-full h-auto select-none ${className}`}
          role="img"
          aria-label={ariaDesc}
        >
          <defs>
            <radialGradient id={`${uid}-silver`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="60%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </radialGradient>
            <radialGradient id={`${uid}-copper`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="55%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
            <linearGradient id={`${uid}-bill`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DCFCE7" />
              <stop offset="50%" stopColor="#BBF7D0" />
              <stop offset="100%" stopColor="#86EFAC" />
            </linearGradient>
          </defs>

          {/* Outer Tray */}
          <rect
            x="2"
            y="2"
            width={width - 4}
            height={height - 4}
            rx="16"
            fill="#FFFFFF"
            stroke="#E5DFD3"
            strokeWidth="1.8"
          />

          {/* Top Banner (Zero Spoiler) */}
          <rect x="10" y="8" width={width - 20} height="22" rx="11" fill="#FEF3C7" />
          <text
            x={width / 2}
            y="22.5"
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill="#92400E"
          >
            {spec.mode === 'change' && spec.priceLabel
              ? `Item Price: ${spec.priceLabel}   ·   Paid With:`
              : 'Count the U.S. Bills & Coins'}
          </text>

          {/* U.S. Bills */}
          {bills.map((denom, idx) => {
            const row = Math.floor(idx / billCols);
            const col = idx % billCols;
            const rowItems = Math.min(billCols, bills.length - row * billCols);
            const rowTotalW = rowItems * billW + (rowItems - 1) * billGap;
            const x = (width - rowTotalW) / 2 + col * (billW + billGap);
            const y = billsTopY + row * (billH + 10);
            return (
              <g key={`bill-${idx}`}>
                <rect
                  x={x}
                  y={y}
                  width={billW}
                  height={billH}
                  rx="6"
                  fill={`url(#${uid}-bill)`}
                  stroke="#166534"
                  strokeWidth="1.8"
                />
                <rect
                  x={x + 4}
                  y={y + 4}
                  width={billW - 8}
                  height={billH - 8}
                  rx="3"
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="1"
                  strokeDasharray="2 1.5"
                />
                <ellipse
                  cx={x + billW / 2}
                  cy={y + billH / 2}
                  rx="16"
                  ry="12"
                  fill="#F0FDF4"
                  stroke="#15803D"
                  strokeWidth="1.2"
                />
                <text
                  x={x + billW / 2}
                  y={y + billH / 2 + 4.5}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="900"
                  fill="#14532D"
                >
                  ${denom}
                </text>
                <text x={x + 8} y={y + 13} fontSize="8" fontWeight="800" fill="#166534">
                  ${denom}
                </text>
                <text
                  x={x + billW - 8}
                  y={y + billH - 7}
                  textAnchor="end"
                  fontSize="8"
                  fontWeight="800"
                  fill="#166534"
                >
                  ${denom}
                </text>
              </g>
            );
          })}

          {/* U.S. Coins */}
          {coins.map((c, idx) => {
            const st = coinStyle(c);
            const row = Math.floor(idx / coinCols);
            const col = idx % coinCols;
            const rowItems = Math.min(coinCols, coins.length - row * coinCols);
            const rowW = (rowItems - 1) * coinPitchX;
            const cx = width / 2 - rowW / 2 + col * coinPitchX;
            const cy = coinsTopY + 24 + row * coinPitchY;
            return (
              <g key={`coin-${idx}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={st.r}
                  fill={st.fill}
                  stroke={st.rim}
                  strokeWidth="1.8"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={st.r - 3}
                  fill="none"
                  stroke={st.rim}
                  strokeWidth="0.8"
                  opacity="0.55"
                />
                <text
                  x={cx}
                  y={cy + 1.5}
                  textAnchor="middle"
                  fontSize={st.fs}
                  fontWeight="900"
                  fill={st.text}
                >
                  {st.label}
                </text>
                <text
                  x={cx}
                  y={cy + 10.5}
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="800"
                  fill={st.text}
                  opacity="0.75"
                >
                  {st.sub}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }
  }
};

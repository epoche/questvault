import React, { useId } from 'react';
import type { Learning14DayTrend } from '../../core/analytics';

interface ParentTrendSvgProps {
  trend: Learning14DayTrend;
}

/**
 * Pure original, zero-dependency SVG chart showing 14-day daily completed runs (bars)
 * and daily average accuracy % (smooth line + dots), with full useId() isolation.
 */
export const ParentTrendSvg: React.FC<ParentTrendSvgProps> = ({ trend }) => {
  const uid = useId().replace(/:/g, '');
  const width = 640;
  const height = 224;
  const padLeft = 42;
  const padRight = 40;
  const padTop = 32;
  const padBottom = 38;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const days = trend.days;
  const count = Math.max(1, days.length);
  const slotW = plotW / count;
  const barW = Math.min(24, slotW * 0.56);
  const maxRuns = Math.max(3, trend.maxDailyRuns);

  const accPoints: { x: number; y: number; pct: number; idx: number }[] = [];
  days.forEach((d, idx) => {
    if (d.avgAccuracyPct !== null) {
      const cx = padLeft + slotW * (idx + 0.5);
      const cy = padTop + plotH * (1 - d.avgAccuracyPct / 100);
      accPoints.push({ x: cx, y: cy, pct: d.avgAccuracyPct, idx });
    }
  });

  const linePath = accPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto select-none"
      role="img"
      aria-label={`14-day learning trend: ${trend.totalRuns14d} quests across ${trend.activeDays14d} active days`}
    >
      <defs>
        <linearGradient id={`${uid}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Chart Background */}
      <rect
        x="2"
        y="2"
        width={width - 4}
        height={height - 4}
        rx="18"
        fill="#FFFFFF"
        stroke="#E5DFD3"
        strokeWidth="1.6"
      />

      {/* Legend (top-right, cleanly inside padTop) */}
      <g transform={`translate(${width - 236}, 16)`}>
        <rect x="0" y="-7" width="11" height="11" rx="3" fill={`url(#${uid}-bar)`} />
        <text x="16" y="2" fontSize="10.5" fontWeight="800" fill="#44403C">
          每日闖關數
        </text>
        <circle cx="96" cy="-1.5" r="4" fill="#059669" />
        <line x1="87" y1="-1.5" x2="105" y2="-1.5" stroke="#059669" strokeWidth="2.4" />
        <text x="111" y="2" fontSize="10.5" fontWeight="800" fill="#047857">
          平均正確率 (%)
        </text>
      </g>

      {/* Horizontal Gridlines (0%, 50%, 100%) */}
      {[0, 50, 100].map((pct) => {
        const y = padTop + plotH * (1 - pct / 100);
        return (
          <g key={pct}>
            <line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke={pct === 0 ? '#CBD5E1' : '#F1F5F9'}
              strokeWidth={pct === 0 ? 1.6 : 1.2}
              strokeDasharray={pct === 0 ? undefined : '4 4'}
            />
            <text
              x={width - padRight + 6}
              y={y + 3.5}
              fontSize="9.5"
              fontWeight="800"
              fill="#059669"
            >
              {pct}%
            </text>
          </g>
        );
      })}

      {/* Left Y-axis ticks (0 and maxRuns, aligned to barMaxH) */}
      <text
        x={padLeft - 8}
        y={padTop + 18 + 4}
        textAnchor="end"
        fontSize="9.5"
        fontWeight="800"
        fill="#2563EB"
      >
        {maxRuns}關
      </text>
      <text x={padLeft - 8} y={padTop + plotH + 4} textAnchor="end" fontSize="9.5" fontWeight="800" fill="#78716C">
        0
      </text>

      {/* Daily Run Bars */}
      {days.map((d, idx) => {
        const cx = padLeft + slotW * (idx + 0.5);
        const barMaxH = plotH - 18;
        const barH = d.runs > 0 ? Math.max(8, (d.runs / maxRuns) * barMaxH) : 0;
        const barY = padTop + plotH - barH;
        const accY =
          d.avgAccuracyPct !== null ? padTop + plotH * (1 - d.avgAccuracyPct / 100) : null;
        const labelAboveY = barY - 5;
        const collidesWithDot = accY !== null && Math.abs(labelAboveY - accY) < 15;
        const placeInsideBar = collidesWithDot && barH >= 20;
        const showLabel = idx === days.length - 1 || idx % 2 === 1;
        return (
          <g key={d.dateKey}>
            {d.runs > 0 ? (
              <>
                <rect
                  x={cx - barW / 2}
                  y={barY}
                  width={barW}
                  height={barH}
                  rx="6"
                  fill={`url(#${uid}-bar)`}
                  opacity="0.88"
                />
                <text
                  x={cx}
                  y={placeInsideBar ? padTop + plotH - 6 : labelAboveY}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="900"
                  fill={placeInsideBar ? '#FFFFFF' : '#1D4ED8'}
                >
                  {d.runs}
                </text>
              </>
            ) : (
              <rect
                x={cx - barW / 2}
                y={padTop + plotH - 3}
                width={barW}
                height="3"
                rx="1.5"
                fill="#E7E5E4"
              />
            )}

            {showLabel && (
              <text
                x={cx}
                y={height - 14}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight={idx === days.length - 1 ? '900' : '700'}
                fill={idx === days.length - 1 ? '#1C1917' : '#78716C'}
              >
                {idx === days.length - 1 ? '今天' : d.shortLabel}
              </text>
            )}
          </g>
        );
      })}

      {/* Accuracy Polyline + Dots */}
      {accPoints.length >= 2 && (
        <path
          d={linePath}
          fill="none"
          stroke="#059669"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {accPoints.map((pt) => (
        <g key={`acc-${pt.idx}`}>
          <circle
            cx={pt.x}
            cy={pt.y}
            r="4.5"
            fill="#FFFFFF"
            stroke="#059669"
            strokeWidth="2.5"
          />
        </g>
      ))}

      {/* Empty-state friendly callout */}
      {trend.totalRuns14d === 0 && (
        <text
          x={width / 2}
          y={padTop + plotH / 2 + 4}
          textAnchor="middle"
          fontSize="12.5"
          fontWeight="800"
          fill="#78716C"
        >
          近 14 天尚無闖關紀錄，完成第 1 關後這裡會自動畫出成長曲線！
        </text>
      )}
    </svg>
  );
};

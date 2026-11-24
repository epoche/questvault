import React, { useId } from 'react';
import {
  computeClockHandAngles,
  formatClockTime,
  formatMixedQuarterInches,
  type ClockMeasureVisualSpec,
} from '../../subjects/math/clockMeasureEngine';

interface ClockMeasureSvgProps {
  spec: ClockMeasureVisualSpec;
  /** When true (post-answer feedback), reveals pedagogical helper overlays (hour sector, drop lines, equation) */
  revealed?: boolean;
  /** Override clock hands for interactive 'set-clock' questions */
  interactiveClock?: { hour: number; minute: number };
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function describeSectorPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const [x1, y1] = polarToCartesian(cx, cy, r, startDeg);
  const [x2, y2] = polarToCartesian(cx, cy, r, endDeg);
  const sweep = ((endDeg - startDeg) % 360 + 360) % 360;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function describeArcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const sweep = ((endDeg - startDeg) % 360 + 360) % 360;
  if (sweep <= 0.1) return '';
  const clamped = Math.min(sweep, 359.5);
  const [x1, y1] = polarToCartesian(cx, cy, r, startDeg);
  const [x2, y2] = polarToCartesian(cx, cy, r, startDeg + clamped);
  const largeArc = clamped > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const AnalogClockFace: React.FC<{
  cx: number;
  cy: number;
  radius: number;
  hour: number;
  minute: number;
  meridiem?: 'AM' | 'PM';
  showMinuteGuide?: boolean;
  revealed?: boolean;
  label?: string;
  gradId: string;
}> = ({
  cx,
  cy,
  radius,
  hour,
  minute,
  meridiem,
  showMinuteGuide = false,
  revealed = false,
  label,
  gradId,
}) => {
  const { hourDeg, minuteDeg } = computeClockHandAngles(hour, minute);
  const normH = ((hour - 1) % 12 + 12) % 12 + 1;
  const hourZoneStartDeg = (normH % 12) * 30;
  const hourZoneEndDeg = hourZoneStartDeg + 30;

  const [hx, hy] = polarToCartesian(cx, cy, radius * 0.52, hourDeg);
  const [mx, my] = polarToCartesian(cx, cy, radius * 0.76, minuteDeg);

  return (
    <g>
      {/* Subtle drop shadow */}
      <circle cx={cx} cy={cy + 4} r={radius + 5} fill="#1C1917" opacity="0.1" />
      {/* Outer colorful bezel */}
      <circle
        cx={cx}
        cy={cy}
        r={radius + 5}
        fill={`url(#${gradId})`}
        stroke="#1C1917"
        strokeWidth="3"
      />
      {/* Crisp white clock face */}
      <circle cx={cx} cy={cy} r={radius - 3} fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />

      {/* Pedagogical Hour-Zone Wedge on Feedback (proves why 2:55 is still in the 2 zone!) */}
      {revealed && (
        <path
          d={describeSectorPath(cx, cy, radius - 5, hourZoneStartDeg, hourZoneEndDeg)}
          fill="#FEF08A"
          opacity="0.65"
        />
      )}

      {/* Pedagogical Minute Arc on Feedback */}
      {revealed && minute > 0 && (
        <path
          d={describeArcPath(cx, cy, radius - 10, 0, minuteDeg)}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.65"
        />
      )}

      {/* 60 Minute Ticks */}
      {Array.from({ length: 60 }, (_, i) => {
        const isHourTick = i % 5 === 0;
        const innerR = isHourTick ? radius - 14 : radius - 9;
        const outerR = radius - 4;
        const [x1, y1] = polarToCartesian(cx, cy, innerR, i * 6);
        const [x2, y2] = polarToCartesian(cx, cy, outerR, i * 6);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isHourTick ? '#1C1917' : '#94A3B8'}
            strokeWidth={isHourTick ? 2.6 : 1.2}
            strokeLinecap="round"
          />
        );
      })}

      {/* 1..12 Hour Numerals */}
      {Array.from({ length: 12 }, (_, idx) => {
        const num = idx === 0 ? 12 : idx;
        const [nx, ny] = polarToCartesian(cx, cy, radius - 25, idx * 30);
        return (
          <text
            key={num}
            x={nx}
            y={ny + 5}
            textAnchor="middle"
            fontSize={radius >= 78 ? '15' : '12'}
            fontWeight="900"
            fill="#1C1917"
          >
            {num}
          </text>
        );
      })}

      {/* Outer :05 :10 :15 guide badges (shown on feedback or Tier 1 interactive set-clock) */}
      {(revealed || showMinuteGuide) &&
        Array.from({ length: 12 }, (_, idx) => {
          const minVal = idx * 5;
          const [gx, gy] = polarToCartesian(cx, cy, radius + 16, idx * 30);
          return (
            <text
              key={minVal}
              x={gx}
              y={gy + 3.5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#2563EB"
            >
              :{String(minVal).padStart(2, '0')}
            </text>
          );
        })}

      {/* Short Thick Red HOUR Hand */}
      <line
        x1={cx}
        y1={cy}
        x2={hx}
        y2={hy}
        stroke="#E11D48"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* Long Slim Blue MINUTE Hand */}
      <line
        x1={cx}
        y1={cy}
        x2={mx}
        y2={my}
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Center Cap */}
      <circle cx={cx} cy={cy} r="5.5" fill="#F59E0B" stroke="#1C1917" strokeWidth="2" />

      {/* AM / PM Sky Pill positioned cleanly outside outer :05 guide */}
      {meridiem && (
        <g transform={`translate(${cx + radius + 22}, ${cy - radius - 8})`}>
          <rect
            x="-24"
            y="-12"
            width="48"
            height="22"
            rx="11"
            fill={meridiem === 'AM' ? '#FEF3C7' : '#EDE9FE'}
            stroke="#1C1917"
            strokeWidth="2"
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="900"
            fill={meridiem === 'AM' ? '#B45309' : '#6D28D9'}
          >
            {meridiem === 'AM' ? '☀ AM' : '🌙 PM'}
          </text>
        </g>
      )}

      {/* Optional Caption Label positioned cleanly below outer :30 tick */}
      {label && (
        <text
          x={cx}
          y={cy + radius + 34}
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="#44403C"
        >
          {label}
        </text>
      )}
    </g>
  );
};

export const ClockMeasureSvg: React.FC<ClockMeasureSvgProps> = ({
  spec,
  revealed = false,
  interactiveClock,
}) => {
  const uid = useId().replace(/:/g, '');

  if (spec.kind === 'analog-clock') {
    const h = interactiveClock ? interactiveClock.hour : spec.hour;
    const m = interactiveClock ? interactiveClock.minute : spec.minute;
    return (
      <svg
        viewBox="0 0 308 282"
        className="mx-auto w-full max-w-[290px] h-auto select-none"
        role="img"
        aria-label={`Analog clock${spec.meridiem ? ` (${spec.meridiem})` : ''}`}
      >
        <defs>
          <linearGradient id={`${uid}-bezel`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <AnalogClockFace
          cx={154}
          cy={122}
          radius={84}
          hour={h}
          minute={m}
          meridiem={spec.meridiem}
          showMinuteGuide={spec.showMinuteGuide}
          revealed={revealed}
          label={spec.label}
          gradId={`${uid}-bezel`}
        />
        {/* Hand Color Legend cleanly below label */}
        <g transform="translate(154, 266)">
          <rect x="-112" y="-12" width="106" height="19" rx="9" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1.2" />
          <circle cx="-98" cy="-2.5" r="3.5" fill="#E11D48" />
          <text x="-89" y="1" fontSize="9.5" fontWeight="800" fill="#BE123C">
            Short = Hour
          </text>
          <rect x="6" y="-12" width="106" height="19" rx="9" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.2" />
          <circle cx="20" cy="-2.5" r="3.5" fill="#2563EB" />
          <text x="29" y="1" fontSize="9.5" fontWeight="800" fill="#1D4ED8">
            Long = Min
          </text>
        </g>
      </svg>
    );
  }

  if (spec.kind === 'dual-clock') {
    return (
      <svg
        viewBox="0 0 560 250"
        className="mx-auto w-full max-w-[540px] h-auto select-none"
        role="img"
        aria-label="Start and end analog clocks"
      >
        <defs>
          <linearGradient id={`${uid}-c1`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id={`${uid}-c2`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        <AnalogClockFace
          cx={126}
          cy={110}
          radius={74}
          hour={spec.startHour}
          minute={spec.startMinute}
          meridiem={spec.startMeridiem}
          revealed={revealed}
          label={revealed ? `Start: ${formatClockTime(spec.startHour, spec.startMinute)}` : 'Start Clock'}
          gradId={`${uid}-c1`}
        />

        {/* Center Elapsed Arrow */}
        <g transform="translate(280, 110)">
          <line x1="-42" y1="0" x2="32" y2="0" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
          <polygon points="44,0 28,-9 28,9" fill="#1C1917" />
          <rect
            x="-48"
            y="-34"
            width="96"
            height="24"
            rx="12"
            fill={revealed ? '#ECFDF5' : '#FEF3C7'}
            stroke="#1C1917"
            strokeWidth="2"
          />
          <text
            x="0"
            y="-18"
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="900"
            fill={revealed ? '#047857' : '#B45309'}
          >
            {revealed ? `+ ${spec.elapsedLabel}` : 'How long?'}
          </text>
        </g>

        <AnalogClockFace
          cx={434}
          cy={110}
          radius={74}
          hour={spec.endHour}
          minute={spec.endMinute}
          meridiem={spec.endMeridiem}
          revealed={revealed}
          label={revealed ? `End: ${formatClockTime(spec.endHour, spec.endMinute)}` : 'End Clock'}
          gradId={`${uid}-c2`}
        />
      </svg>
    );
  }

  if (spec.kind === 'ruler') {
    const padX = 36;
    const width = 520;
    const usableW = width - padX * 2;
    const pxPerUnit = usableW / spec.maxUnits;
    const xOf = (val: number) => padX + val * pxPerUnit;

    const objX1 = xOf(spec.startVal);
    const objX2 = xOf(spec.endVal);
    const objW = Math.max(8, objX2 - objX1);
    const rulerTopY = 98;
    const subDivs = spec.unit === 'in' ? 4 : 2;
    const totalTicks = spec.maxUnits * subDivs;

    const startLabel =
      spec.unit === 'in'
        ? formatMixedQuarterInches(Math.round(spec.startVal * 4))
        : `${spec.startVal} cm`;
    const endLabel =
      spec.unit === 'in'
        ? formatMixedQuarterInches(Math.round(spec.endVal * 4))
        : `${spec.endVal} cm`;

    return (
      <svg
        viewBox="0 0 520 185"
        className="mx-auto w-full max-w-[520px] h-auto select-none"
        role="img"
        aria-label={`Ruler measuring ${spec.objectName} in ${spec.unit}`}
      >
        {/* Dashed vertical alignment guide lines from object edges down to ruler ticks */}
        <line
          x1={objX1}
          y1={42}
          x2={objX1}
          y2={rulerTopY}
          stroke={revealed ? '#059669' : '#94A3B8'}
          strokeWidth={revealed ? 2.4 : 1.5}
          strokeDasharray="4 3"
        />
        <line
          x1={objX2}
          y1={42}
          x2={objX2}
          y2={rulerTopY}
          stroke={revealed ? '#059669' : '#94A3B8'}
          strokeWidth={revealed ? 2.4 : 1.5}
          strokeDasharray="4 3"
        />

        {/* Measured Object Graphic */}
        {spec.objectShape === 'pencil' ? (
          <g>
            {/* Eraser + ferrule */}
            <rect x={objX1} y={48} width={Math.min(18, objW * 0.14)} height={28} rx="4" fill="#FDA4AF" stroke="#1C1917" strokeWidth="2.2" />
            {/* Pencil body */}
            <rect
              x={objX1 + Math.min(14, objW * 0.12)}
              y={48}
              width={Math.max(10, objW - Math.min(14, objW * 0.12) - Math.min(20, objW * 0.16))}
              height={28}
              fill={spec.objectColor}
              stroke="#1C1917"
              strokeWidth="2.2"
            />
            {/* Sharpened wood tip */}
            <polygon
              points={`${objX2 - Math.min(20, objW * 0.16)},48 ${objX2},62 ${objX2 - Math.min(20, objW * 0.16)},76`}
              fill="#FDE68A"
              stroke="#1C1917"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon
              points={`${objX2 - 7},57 ${objX2},62 ${objX2 - 7},67`}
              fill="#1C1917"
            />
          </g>
        ) : spec.objectShape === 'crayon' ? (
          <g>
            <rect x={objX1} y={48} width={Math.max(12, objW - 16)} height={28} rx="5" fill={spec.objectColor} stroke="#1C1917" strokeWidth="2.2" />
            <polygon
              points={`${objX2 - 16},49 ${objX2},57 ${objX2},67 ${objX2 - 16},75`}
              fill={spec.objectColor}
              stroke="#1C1917"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <rect x={objX1 + 14} y={48} width={10} height={28} fill="#1C1917" opacity="0.25" />
            <rect x={Math.max(objX1 + 26, objX2 - 34)} y={48} width={10} height={28} fill="#1C1917" opacity="0.25" />
          </g>
        ) : (
          <g>
            <rect x={objX1} y={48} width={objW} height={28} rx="8" fill={spec.objectColor} stroke="#1C1917" strokeWidth="2.4" />
            <line x1={objX1 + 10} y1={56} x2={objX2 - 10} y2={56} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
          </g>
        )}

        {/* Reveal Span Bracket on Feedback */}
        {revealed && (
          <g>
            <line x1={objX1} y1={28} x2={objX2} y2={28} stroke="#059669" strokeWidth="2.8" />
            <line x1={objX1} y1={22} x2={objX1} y2={34} stroke="#059669" strokeWidth="2.8" />
            <line x1={objX2} y1={22} x2={objX2} y2={34} stroke="#059669" strokeWidth="2.8" />
            <rect x={(objX1 + objX2) / 2 - 58} y={8} width="116" height="20" rx="10" fill="#ECFDF5" stroke="#059669" strokeWidth="1.6" />
            <text
              x={(objX1 + objX2) / 2}
              y={22}
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill="#047857"
            >
              {spec.startVal > 0 ? `${endLabel} − ${startLabel}` : endLabel}
            </text>
          </g>
        )}

        {/* Wooden / Pastel Ruler Body */}
        <rect
          x={padX - 14}
          y={rulerTopY}
          width={usableW + 28}
          height={64}
          rx="10"
          fill="#FEF3C7"
          stroke="#1C1917"
          strokeWidth="2.6"
        />

        {/* Ruler Ticks */}
        {Array.from({ length: totalTicks + 1 }, (_, i) => {
          const val = i / subDivs;
          const tx = xOf(val);
          const isWhole = i % subDivs === 0;
          const isHalf = !isWhole && subDivs === 4 && i % 2 === 0;
          const tickH = isWhole ? 28 : isHalf ? 20 : 13;
          return (
            <g key={i}>
              <line
                x1={tx}
                y1={rulerTopY}
                x2={tx}
                y2={rulerTopY + tickH}
                stroke="#1C1917"
                strokeWidth={isWhole ? 2.4 : isHalf ? 1.8 : 1.3}
              />
              {isWhole && (
                <text
                  x={tx}
                  y={rulerTopY + 46}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="900"
                  fill="#1C1917"
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}

        {/* Unit Tag */}
        <text
          x={padX + usableW + 6}
          y={rulerTopY + 56}
          textAnchor="end"
          fontSize="11"
          fontWeight="900"
          fill="#92400E"
        >
          {spec.unit === 'in' ? 'INCHES (1/4 in ticks)' : 'CENTIMETERS (cm)'}
        </text>
      </svg>
    );
  }

  if (spec.kind === 'beaker') {
    const cupX = 95;
    const cupY = 26;
    const cupW = 130;
    const cupH = 166;
    const innerBottom = cupY + cupH - 8;
    const innerTop = cupY + 18;
    const innerH = innerBottom - innerTop;
    const yOf = (v: number) => innerBottom - (v / spec.maxVal) * innerH;

    const liquidY = yOf(spec.currentVal);
    const liquidH = innerBottom - liquidY;
    const totalAfterAdd = spec.addVal ? Math.min(spec.maxVal, spec.currentVal + spec.addVal) : spec.currentVal;
    const addTopY = yOf(totalAfterAdd);

    const stepCount = spec.unit === 'mL' ? 20 : 8; // 50 mL ticks or 0.5 cup ticks
    const stepVal = spec.maxVal / stepCount;

    return (
      <svg
        viewBox="0 0 320 212"
        className="mx-auto w-full max-w-[300px] h-auto select-none"
        role="img"
        aria-label={`Measuring beaker in ${spec.unit}`}
      >
        <defs>
          <clipPath id={`${uid}-beaker-clip`}>
            <rect x={cupX + 4} y={cupY + 4} width={cupW - 8} height={cupH - 8} rx="12" />
          </clipPath>
        </defs>

        {/* Glass Body */}
        <rect
          x={cupX}
          y={cupY}
          width={cupW}
          height={cupH}
          rx="14"
          fill="#F8FAFC"
          stroke="#1C1917"
          strokeWidth="3"
        />
        {/* Spout lip */}
        <path
          d={`M ${cupX - 10} ${cupY + 2} Q ${cupX - 2} ${cupY + 2} ${cupX} ${cupY + 14}`}
          fill="none"
          stroke="#1C1917"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Liquid fill */}
        <g clipPath={`url(#${uid}-beaker-clip)`}>
          <rect
            x={cupX + 4}
            y={liquidY}
            width={cupW - 8}
            height={Math.max(4, liquidH)}
            fill={spec.liquidColor}
            opacity="0.72"
          />
          <line
            x1={cupX + 4}
            y1={liquidY}
            x2={cupX + cupW - 4}
            y2={liquidY}
            stroke="#1C1917"
            strokeWidth="2.2"
          />
          {/* Feedback overlay for added liquid */}
          {revealed && spec.addVal && spec.addVal > 0 && (
            <rect
              x={cupX + 4}
              y={addTopY}
              width={cupW - 8}
              height={Math.max(2, liquidY - addTopY)}
              fill={spec.liquidColor}
              opacity="0.32"
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
          )}
        </g>

        {/* Tick marks & labels */}
        {Array.from({ length: stepCount + 1 }, (_, i) => {
          const val = i * stepVal;
          if (val === 0) return null;
          const ty = yOf(val);
          const isMajor = Math.abs(val % spec.majorStep) < 0.001;
          const isMid = !isMajor && spec.unit === 'mL' && Math.abs(val % 100) < 0.001;
          const tickLen = isMajor ? 28 : isMid ? 20 : 12;
          return (
            <g key={i}>
              <line
                x1={cupX + cupW - tickLen}
                y1={ty}
                x2={cupX + cupW}
                y2={ty}
                stroke="#1C1917"
                strokeWidth={isMajor ? 2.2 : 1.3}
              />
              {isMajor && (
                <text
                  x={cupX + cupW + 8}
                  y={ty + 4}
                  fontSize="11.5"
                  fontWeight="900"
                  fill="#1C1917"
                >
                  {spec.unit === 'cups' && val === 1 ? '1 cup' : `${val} ${spec.unit}`}
                </text>
              )}
            </g>
          );
        })}

        {/* Label */}
        <text x={160} y={206} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#57534E">
          {spec.liquidLabel} ({spec.unit === 'mL' ? 'small tick = 50 mL' : 'small tick = 1/2 cup'})
        </text>
      </svg>
    );
  }

  if (spec.kind === 'dial-scale') {
    const cx = 140;
    const cy = 146;
    const r = 68;
    const needleDeg = (spec.value / spec.maxVal) * 360;
    const [nx, ny] = polarToCartesian(cx, cy, r - 18, needleDeg);
    const majorCount = Math.round(spec.maxVal / spec.majorStep);
    const totalTicks = majorCount * 2;

    return (
      <svg
        viewBox="0 0 280 232"
        className="mx-auto w-full max-w-[270px] h-auto select-none"
        role="img"
        aria-label={`Dial scale weighing ${spec.itemLabel} in ${spec.unit}`}
      >
        {/* Top Weighing Pan + Item */}
        <text x={cx} y={38} textAnchor="middle" fontSize="34">
          {spec.itemEmoji}
        </text>
        <path
          d={`M ${cx - 56} 46 L ${cx + 56} 46 L ${cx + 44} 58 L ${cx - 44} 58 Z`}
          fill="#CBD5E1"
          stroke="#1C1917"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect x={cx - 8} y={58} width="16" height="16" fill="#94A3B8" stroke="#1C1917" strokeWidth="2.2" />

        {/* Scale Housing */}
        <rect x={54} y={74} width="172" height="148" rx="28" fill="#FDE68A" stroke="#1C1917" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.4" />

        {/* Dial Ticks */}
        {Array.from({ length: totalTicks }, (_, i) => {
          const deg = (i / totalTicks) * 360;
          const isMajor = i % 2 === 0;
          const [x1, y1] = polarToCartesian(cx, cy, isMajor ? r - 13 : r - 8, deg);
          const [x2, y2] = polarToCartesian(cx, cy, r - 3, deg);
          const majorVal = (i / 2) * spec.majorStep;
          const [lx, ly] = polarToCartesian(cx, cy, r - 24, deg);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1C1917" strokeWidth={isMajor ? 2.2 : 1.2} />
              {isMajor && (
                <text
                  x={lx}
                  y={ly + 3.5}
                  textAnchor="middle"
                  fontSize={spec.maxVal >= 1000 ? '9' : '11'}
                  fontWeight="900"
                  fill="#1C1917"
                >
                  {majorVal === 0 ? '0' : majorVal}
                </text>
              )}
            </g>
          );
        })}

        {/* Unit tag inside dial */}
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize="11" fontWeight="900" fill="#78716C">
          {spec.unit}
        </text>

        {/* Pointer Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#E11D48" strokeWidth="4.2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5.5" fill="#1C1917" />
      </svg>
    );
  }

  if (spec.kind === 'unit-sense-card') {
    const badgeColor =
      spec.system === 'US Customary' ? { bg: '#EFF6FF', border: '#93C5FD', text: '#1D4ED8' } : { bg: '#ECFDF5', border: '#6EE7B7', text: '#047857' };
    const titleSize = spec.itemName.length > 22 ? 14 : spec.itemName.length > 16 ? 17 : 21;
    return (
      <svg
        viewBox="0 0 420 155"
        className="mx-auto w-full max-w-[400px] h-auto select-none"
        role="img"
        aria-label={`${spec.itemName} unit estimation card`}
      >
        <rect x="8" y="8" width="404" height="139" rx="22" fill="#FFFDF8" stroke="#1C1917" strokeWidth="2.8" />
        <rect x="24" y="22" width="128" height="24" rx="12" fill={badgeColor.bg} stroke={badgeColor.border} strokeWidth="1.6" />
        <text x="88" y="38" textAnchor="middle" fontSize="11" fontWeight="900" fill={badgeColor.text}>
          {spec.system}
        </text>
        <rect x="294" y="22" width="102" height="24" rx="12" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1.6" />
        <text x="345" y="38" textAnchor="middle" fontSize="11" fontWeight="900" fill="#B45309">
          {spec.measureHint}
        </text>

        <circle cx="96" cy="94" r="36" fill="#F3EFE7" stroke="#1C1917" strokeWidth="2.2" />
        <text x="96" y="107" textAnchor="middle" fontSize="38">
          {spec.itemEmoji}
        </text>

        <text x="150" y="86" fontSize={titleSize} fontWeight="900" fill="#1C1917">
          {spec.itemName}
        </text>
        <text x="150" y="112" fontSize="12.5" fontWeight="700" fill="#57534E">
          Pick the most reasonable {spec.measureHint.toLowerCase()}!
        </text>
      </svg>
    );
  }

  // conversion-ladder
  return (
    <svg
      viewBox="0 0 460 158"
      className="mx-auto w-full max-w-[440px] h-auto select-none"
      role="img"
      aria-label={`Unit conversion from ${spec.fromLabel} to ${spec.toUnit}`}
    >
      <rect x="8" y="8" width="444" height="142" rx="22" fill="#FFFBEB" stroke="#1C1917" strokeWidth="2.6" />
      <rect x="22" y="20" width="122" height="22" rx="11" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="83" y="35" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#92400E">
        {spec.system}
      </text>

      {/* Left Starting Box */}
      <rect x="24" y="56" width="156" height="54" rx="14" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.4" />
      <text x="102" y="89" textAnchor="middle" fontSize="20" fontWeight="900" fill="#1C1917">
        {spec.fromLabel}
      </text>

      {/* Middle Arrow */}
      <line x1="188" y1="83" x2="262" y2="83" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
      <polygon points="274,83 258,74 258,92" fill="#D97706" />
      <text x="230" y="69" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#B45309">
        {revealed ? spec.ruleFormula : 'Big → Small'}
      </text>

      {/* Right Target Box */}
      <rect
        x="280"
        y="56"
        width="156"
        height="54"
        rx="14"
        fill={revealed ? '#ECFDF5' : '#EEF2FF'}
        stroke={revealed ? '#059669' : '#4F46E5'}
        strokeWidth="2.4"
      />
      <text
        x="358"
        y="89"
        textAnchor="middle"
        fontSize="20"
        fontWeight="900"
        fill={revealed ? '#047857' : '#4338CA'}
      >
        ? {spec.toUnit}
      </text>

      {/* Bottom Formula Strip (revealed on feedback!) */}
      <text
        x="230"
        y="134"
        textAnchor="middle"
        fontSize="12.5"
        fontWeight="900"
        fill={revealed ? '#047857' : '#78716C'}
      >
        {revealed ? `✅ ${spec.equationReveal}` : 'Big unit → Small unit = MULTIPLY!'}
      </text>
    </svg>
  );
};

import type { DifficultyTier } from '../../core/types';

export type ClockMeasureUnitId =
  | 'clock-basic'
  | 'clock-exact'
  | 'clock-elapsed'
  | 'clock-schedule'
  | 'measure-ruler'
  | 'measure-unit-sense'
  | 'measure-beaker-scale'
  | 'measure-conversions';

export type ClockMeasureCategory = 'clock' | 'measure';

export interface ClockMeasureUnitMeta {
  id: ClockMeasureUnitId;
  category: ClockMeasureCategory;
  tier: DifficultyTier;
  title: string;
  zhTitle: string;
  shortTag: string;
  emoji: string;
  accentHex: string;
  bgHex: string;
  emblemCollectibleId: string;
  description: string;
  zhDescription: string;
}

export type ClockMeasureVisualSpec =
  | {
      kind: 'analog-clock';
      hour: number; // 1..12
      minute: number; // 0..59
      meridiem?: 'AM' | 'PM';
      showMinuteGuide?: boolean;
      label?: string;
    }
  | {
      kind: 'dual-clock';
      startHour: number;
      startMinute: number;
      endHour: number;
      endMinute: number;
      startMeridiem?: 'AM' | 'PM';
      endMeridiem?: 'AM' | 'PM';
      elapsedLabel: string;
    }
  | {
      kind: 'ruler';
      unit: 'in' | 'cm';
      maxUnits: number;
      /** Start value in exact unit fractions (quarter-inch for 'in', whole/half for 'cm') */
      startVal: number;
      endVal: number;
      objectName: string;
      objectColor: string;
      objectShape: 'pencil' | 'crayon' | 'ribbon' | 'marker' | 'bar';
    }
  | {
      kind: 'beaker';
      unit: 'mL' | 'cups';
      maxVal: number;
      majorStep: number;
      currentVal: number;
      addVal?: number;
      liquidColor: string;
      liquidLabel: string;
    }
  | {
      kind: 'dial-scale';
      unit: 'g' | 'kg' | 'lb' | 'oz';
      maxVal: number;
      majorStep: number;
      value: number;
      itemEmoji: string;
      itemLabel: string;
    }
  | {
      kind: 'unit-sense-card';
      domain: 'length' | 'weight' | 'capacity';
      system: 'US Customary' | 'Metric';
      itemEmoji: string;
      itemName: string;
      measureHint: string;
    }
  | {
      kind: 'conversion-ladder';
      system: 'US Customary' | 'Metric';
      fromLabel: string;
      toUnit: string;
      ruleFormula: string;
      equationReveal: string;
    };

export interface ClockMeasureQuestion {
  id: string;
  unitId: ClockMeasureUnitId;
  skillKey: string;
  inputKind: 'mcq' | 'set-clock';
  prompt: string;
  zhHint: string;
  visual: ClockMeasureVisualSpec;
  /** For MCQ questions */
  choices: string[];
  correctChoice: string;
  /** For interactive 'set-clock' questions */
  targetHour?: number; // 1..12
  targetMinute?: number; // 0..59
  initialHour?: number;
  initialMinute?: number;
  minuteStep?: 1 | 5;
  explanation: string;
  zhExplanation: string;
  conversionTip?: string;
}

export const CLOCK_MEASURE_RUN_SIZE = 5;

export const CLOCK_MEASURE_UNITS: readonly ClockMeasureUnitMeta[] = [
  {
    id: 'clock-basic',
    category: 'clock',
    tier: 1,
    title: 'Read the Clock (5-Min & Quarters)',
    zhTitle: '指針鐘面基礎（5分＆刻鐘）',
    shortTag: 'Analog Clock',
    emoji: '🕐',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    emblemCollectibleId: 'critter-moon-owl',
    description: 'Master hour vs. minute hands, quarter past, half past, quarter to & set the hands!',
    zhDescription: '專治長短針混淆與刻鐘判讀，含動手撥指針互動題！',
  },
  {
    id: 'clock-exact',
    category: 'clock',
    tier: 2,
    title: 'Exact Minute Detective',
    zhTitle: '精準 1 分鐘刻度偵探',
    shortTag: '1-Min Ticks',
    emoji: '🔎',
    accentHex: '#4F46E5',
    bgHex: '#EEF2FF',
    emblemCollectibleId: 'space-saturn-cat',
    description: 'Read exact 1-minute ticks and beat tricky :45–:59 hour-hand traps!',
    zhDescription: '60 格鐘面精細讀數，攻克差幾分到整點的短針陷阱！',
  },
  {
    id: 'clock-elapsed',
    category: 'clock',
    tier: 2,
    title: 'Elapsed Time (Clock to Clock)',
    zhTitle: '雙鐘面經過時間推算',
    shortTag: 'Elapsed Time',
    emoji: '⏳',
    accentHex: '#0284C7',
    bgHex: '#F0F9FF',
    emblemCollectibleId: 'ocean-pearl-clam',
    description: 'Compare two analog clocks or jump forward and backward across the hour.',
    zhDescription: '看類比鐘面推算經過幾分鐘，跨整點也不怕！',
  },
  {
    id: 'clock-schedule',
    category: 'clock',
    tier: 3,
    title: 'AM/PM & Daily Schedules',
    zhTitle: 'AM/PM 與日常時間表',
    shortTag: 'AM / PM',
    emoji: '📅',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    emblemCollectibleId: 'critter-sun-phoenix',
    description: 'Solve real school schedule problems including tricky 11 AM → 12 PM noon flips!',
    zhDescription: '美國校園日常情境題，練熟跨中午 AM↔PM 轉換！',
  },
  {
    id: 'measure-ruler',
    category: 'measure',
    tier: 1,
    title: 'Read the Ruler (Inches & cm)',
    zhTitle: '直尺量長度（吋＆公分）',
    shortTag: 'Ruler',
    emoji: '📏',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    emblemCollectibleId: 'critter-sprout-bunny',
    description: 'Measure objects to 1/2 in, 1/4 in & cm — including shifted non-zero starts!',
    zhDescription: '練習看公分與 1/4 吋刻度，包含不從 0 開始量的考題陷阱！',
  },
  {
    id: 'measure-unit-sense',
    category: 'measure',
    tier: 1,
    title: 'Best Unit Match (US & Metric)',
    zhTitle: '生活量感選單位（美制＋公制）',
    shortTag: 'Unit Sense',
    emoji: '🧭',
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    emblemCollectibleId: 'sweet-boba-bear',
    description: 'Build real-life intuition for in/ft/yd/mi, oz/lb, cup/gal & cm/m/g/kg/mL/L!',
    zhDescription: '用生活物品建立長度、重量、容量的美制與公制直覺！',
  },
  {
    id: 'measure-beaker-scale',
    category: 'measure',
    tier: 2,
    title: 'Beaker & Scale Reader',
    zhTitle: '量杯＆磅秤視覺讀數',
    shortTag: 'Beaker & Scale',
    emoji: '⚖️',
    accentHex: '#EA580C',
    bgHex: '#FFF7ED',
    emblemCollectibleId: 'sweet-matcha-mochi',
    description: 'Read liquid volume on measuring beakers (mL/cups) and weight on dial scales!',
    zhDescription: '直接看量杯液面刻度與磅秤指針，含加減變化題！',
  },
  {
    id: 'measure-conversions',
    category: 'measure',
    tier: 3,
    title: 'Unit Conversion Ladder',
    zhTitle: '美制＆公制單位換算階梯',
    shortTag: 'Conversions',
    emoji: '🪜',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    emblemCollectibleId: 'space-astro-corgi',
    description: 'Master ft↔in, yd↔ft, lb↔oz, gal↔qt↔cup, m↔cm, kg↔g & L↔mL!',
    zhDescription: '視覺化換算階梯，含複合單位（如 2 ft 5 in）與記憶口訣！',
  },
] as const;

export const VALID_CLOCK_MEASURE_UNIT_IDS: ReadonlySet<string> = new Set(
  CLOCK_MEASURE_UNITS.map((u) => u.id),
);

/** Deterministic PRNG helper for tests & varied sessions */
export function makeSeededRng(seed: number): () => number {
  let s = (Math.floor(Math.abs(seed)) || 1) % 2147483647;
  if (s <= 0) s = 1;
  return () => {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  const idx = Math.floor(rng() * arr.length) % arr.length;
  return arr[idx];
}

function pickInt(min: number, max: number, rng: () => number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function formatClockTime(hour: number, minute: number): string {
  const normH = ((hour - 1) % 12 + 12) % 12 + 1;
  const normM = ((minute % 60) + 60) % 60;
  return `${normH}:${String(normM).padStart(2, '0')}`;
}

/**
 * Exact analog clock angles (0° = 12 o'clock, increasing clockwise).
 * Exported for mathematical verification in tests and SVG rendering.
 */
export function computeClockHandAngles(hour: number, minute: number): {
  hourDeg: number;
  minuteDeg: number;
} {
  const normH = ((hour % 12) + 12) % 12;
  const normM = ((minute % 60) + 60) % 60;
  return {
    hourDeg: (normH + normM / 60) * 30,
    minuteDeg: normM * 6,
  };
}

/** Adds signed delta minutes to a 12-hour AM/PM clock time cleanly. */
export function addMinutes12h(
  hour: number,
  minute: number,
  meridiem: 'AM' | 'PM',
  deltaMinutes: number,
): { hour: number; minute: number; meridiem: 'AM' | 'PM' } {
  const base24Hour = (hour % 12) + (meridiem === 'PM' ? 12 : 0);
  const total = (((base24Hour * 60 + minute + deltaMinutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const nextMeridiem: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
  const nextHour = h24 % 12 === 0 ? 12 : h24 % 12;
  return { hour: nextHour, minute: m, meridiem: nextMeridiem };
}

export function formatDuration(totalMinutes: number): string {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs === 0) return `${mins} minutes`;
  if (mins === 0) return hrs === 1 ? '1 hour' : `${hrs} hours`;
  return `${hrs} hr ${mins} min`;
}

export function formatMixedQuarterInches(quarters: number): string {
  const whole = Math.floor(quarters / 4);
  const rem = quarters % 4;
  if (rem === 0) return `${whole} in`;
  const frac = rem === 2 ? '1/2' : `${rem}/4`;
  return whole === 0 ? `${frac} in` : `${whole} ${frac} in`;
}

function buildUniqueChoices(correct: string, candidates: string[], rng: () => number): string[] {
  const set = new Set<string>([correct]);
  for (const c of candidates) {
    if (c && c !== correct) set.add(c);
    if (set.size >= 4) break;
  }
  return shuffle(Array.from(set), rng);
}

// ─── Unit 1: Read the Clock (5-Min & Quarters) ─────────────────────────────
function genClockBasic(idx: number, rng: () => number, allowInteractive: boolean): ClockMeasureQuestion {
  const hour = pickInt(1, 12, rng);
  const fiveMins = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0];
  // Weight quarters & tricky 40-55 min slots
  const minute = rng() < 0.45 ? pick([15, 30, 45, 50, 55], rng) : pick(fiveMins, rng);
  const timeStr = formatClockTime(hour, minute);
  const nextHour = (hour % 12) + 1;

  // Interactive Set-the-Clock on question #3 (idx === 2) when allowed
  if (allowInteractive && idx === 2) {
    const startH = ((hour + pickInt(2, 5, rng) - 1) % 12) + 1;
    const startM = minute === 0 ? 30 : 0;
    const phrase =
      minute === 15
        ? `quarter past ${hour} (${timeStr})`
        : minute === 30
          ? `half past ${hour} (${timeStr})`
          : minute === 45
            ? `quarter to ${nextHour} (${timeStr})`
            : timeStr;
    return {
      id: `cm-clock-basic-set-${idx}-${hour}-${minute}`,
      unitId: 'clock-basic',
      skillKey: `Clock: Set ${timeStr}`,
      inputKind: 'set-clock',
      prompt: `Move the clock hands to show ${phrase}!`,
      zhHint: `請用下方按鈕把時鐘撥到 ${timeStr}（紅短針看小時、藍長針看分鐘）！`,
      visual: { kind: 'analog-clock', hour: startH, minute: startM, showMinuteGuide: true },
      choices: [],
      correctChoice: timeStr,
      targetHour: hour,
      targetMinute: minute,
      initialHour: startH,
      initialMinute: startM,
      minuteStep: 5,
      explanation: `At ${timeStr}, the short red hour hand is ${minute === 0 ? `pointing right at ${hour}` : `between ${hour} and ${nextHour}`}, and the long blue minute hand points to ${minute === 0 ? '12 (00)' : `${minute / 5} (${minute} min)`}.`,
      zhExplanation: `${timeStr} 時，紅色短針在 ${hour} ${minute === 0 ? '正上方' : `與 ${nextHour} 之間`}，藍色長針指向數字 ${minute === 0 ? 12 : minute / 5}（${minute} 分）。`,
      conversionTip: 'Each number on the clock = 5 minutes (count by 5s!)',
    };
  }

  // Quarter-phrase question variant when minute is 15, 30, or 45
  if ((minute === 15 || minute === 30 || minute === 45) && rng() < 0.4) {
    const correctPhrase =
      minute === 15
        ? `Quarter past ${hour}`
        : minute === 30
          ? `Half past ${hour}`
          : `Quarter to ${nextHour}`;
    const distractors = [
      `Quarter to ${hour}`,
      `Quarter past ${nextHour}`,
      `Half past ${nextHour}`,
      `Quarter to ${((nextHour % 12) + 1)}`,
      `Half past ${hour}`,
      `Quarter past ${hour}`,
    ];
    return {
      id: `cm-clock-basic-phrase-${idx}-${hour}-${minute}`,
      unitId: 'clock-basic',
      skillKey: `Clock: ${correctPhrase}`,
      inputKind: 'mcq',
      prompt: 'Which way matches the time shown on this clock?',
      zhHint: 'Quarter past = 過 15 分、Half past = 半點（30 分）、Quarter to = 差 15 分到下一點！',
      visual: { kind: 'analog-clock', hour, minute },
      choices: buildUniqueChoices(correctPhrase, distractors, rng),
      correctChoice: correctPhrase,
      explanation: `The clock shows ${timeStr}, which is "${correctPhrase}"!`,
      zhExplanation: `鐘面時間是 ${timeStr}，英文說法是「${correctPhrase}」。`,
      conversionTip: 'Quarter = 15 min · Half = 30 min · Quarter to = :45',
    };
  }

  const swappedH = minute === 0 ? 12 : minute / 5;
  const swappedM = (hour % 12) * 5;
  const distractors = [
    formatClockTime(nextHour, minute), // classic hour-hand trap!
    formatClockTime(hour, (minute + 5) % 60),
    formatClockTime(hour, (minute + 55) % 60),
    formatClockTime(swappedH, swappedM),
    formatClockTime(hour === 1 ? 12 : hour - 1, minute),
  ];

  return {
    id: `cm-clock-basic-${idx}-${hour}-${minute}`,
    unitId: 'clock-basic',
    skillKey: `Clock: Read ${timeStr}`,
    inputKind: 'mcq',
    prompt: 'What time does the clock show?',
    zhHint: '先看紅色短針在哪兩個數字之間（選較小的數字），再 5 分 5 分數藍色長針！',
    visual: { kind: 'analog-clock', hour, minute },
    choices: buildUniqueChoices(timeStr, distractors, rng),
    correctChoice: timeStr,
    explanation: `The short red hour hand is ${minute === 0 ? `on ${hour}` : `past ${hour} (not yet ${nextHour})`}. The long blue minute hand is at ${minute === 0 ? '12 (:00)' : `${minute / 5} (${minute} min)`} → ${timeStr}!`,
    zhExplanation: `紅色短針還在 ${hour} 的區間（還沒真正到 ${nextHour}），藍色長針指著 ${minute} 分，所以是 ${timeStr}！`,
    conversionTip: `Short hand = Hour · Long hand = Minutes (×5 per number)`,
  };
}

// ─── Unit 2: Exact Minute Detective (1-Min Ticks) ──────────────────────────
function genClockExact(idx: number, rng: () => number, allowInteractive: boolean): ClockMeasureQuestion {
  const hour = pickInt(1, 12, rng);
  // 65% tricky :41–:59 to conquer the classic hour-hand-near-next-number confusion
  let minute: number;
  if (rng() < 0.65) {
    const pool = [41, 42, 43, 44, 46, 47, 48, 49, 51, 52, 53, 54, 56, 57, 58, 59];
    minute = pick(pool, rng);
  } else {
    const nonFive: number[] = [];
    for (let m = 1; m <= 39; m += 1) {
      if (m % 5 !== 0) nonFive.push(m);
    }
    minute = pick(nonFive, rng);
  }
  const timeStr = formatClockTime(hour, minute);
  const nextHour = (hour % 12) + 1;
  const anchorFive = Math.floor(minute / 5);
  const extraTicks = minute % 5;

  if (allowInteractive && idx === 3) {
    const startH = ((hour + 3 - 1) % 12) + 1;
    const startM = anchorFive * 5;
    return {
      id: `cm-clock-exact-set-${idx}-${hour}-${minute}`,
      unitId: 'clock-exact',
      skillKey: `Clock 1-Min: Set ${timeStr}`,
      inputKind: 'set-clock',
      prompt: `Set the clock to exactly ${timeStr}!`,
      zhHint: `先用 +5m 撥到 ${anchorFive * 5} 分，再用 +1m 微調 ${extraTicks} 格到 ${timeStr}！`,
      visual: { kind: 'analog-clock', hour: startH, minute: startM, showMinuteGuide: false },
      choices: [],
      correctChoice: timeStr,
      targetHour: hour,
      targetMinute: minute,
      initialHour: startH,
      initialMinute: startM,
      minuteStep: 1,
      explanation: `Count by 5s to ${anchorFive * 5}, then count ${extraTicks} small tick${extraTicks === 1 ? '' : 's'} to ${minute}. Hour hand stays in the ${hour} zone → ${timeStr}!`,
      zhExplanation: `先 5 分跳數到 ${anchorFive * 5} 分，再加 ${extraTicks} 小格就是 ${minute} 分，短針在 ${hour} 區間 → ${timeStr}！`,
      conversionTip: `Between ${hour} and ${nextHour} = ALWAYS ${hour}:__!`,
    };
  }

  const distractors = [
    formatClockTime(nextHour, minute), // Hour-hand trap!
    formatClockTime(hour, (minute + 1) % 60),
    formatClockTime(hour, (minute + 59) % 60),
    formatClockTime(hour, (minute + 5) % 60),
    formatClockTime(hour, (minute + 55) % 60),
  ];

  return {
    id: `cm-clock-exact-${idx}-${hour}-${minute}`,
    unitId: 'clock-exact',
    skillKey: `Clock 1-Min: Read ${timeStr}`,
    inputKind: 'mcq',
    prompt: 'Look closely at the 1-minute ticks! What exact time is shown?',
    zhHint: '特別小心：只要短針還沒過下一個數字，小時就還是前面那個數字喔！',
    visual: { kind: 'analog-clock', hour, minute },
    choices: buildUniqueChoices(timeStr, distractors, rng),
    correctChoice: timeStr,
    explanation: `The short hand is still between ${hour} and ${nextHour} (so it’s ${hour}:__). Minute hand is ${extraTicks} tick${extraTicks === 1 ? '' : 's'} past ${anchorFive === 0 ? '12 (00)' : `${anchorFive} (${anchorFive * 5})`} → ${timeStr}!`,
    zhExplanation: `短針仍在 ${hour} 與 ${nextHour} 之間（還沒到 ${nextHour} 點），長針超過數字 ${anchorFive === 0 ? 12 : anchorFive}（${anchorFive * 5} 分）多 ${extraTicks} 小格 → ${timeStr}！`,
    conversionTip: `Trap Check: ${hour}:55 is STILL ${hour}, NOT ${nextHour}!`,
  };
}

// ─── Unit 3: Elapsed Time (Clock to Clock) ─────────────────────────────────
function genClockElapsed(idx: number, rng: () => number): ClockMeasureQuestion {
  const startH = pickInt(1, 11, rng);
  const startM = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50], rng);
  const delta = pick([20, 25, 30, 35, 40, 45, 50, 55, 65, 75, 80, 90], rng);
  const end = addMinutes12h(startH, startM, 'AM', delta);
  const startStr = formatClockTime(startH, startM);
  const endStr = formatClockTime(end.hour, end.minute);
  const mode = idx % 2 === 0 ? 'dual' : rng() < 0.65 ? 'forward' : 'backward';

  if (mode === 'dual') {
    const ans = formatDuration(delta);
    const distractors = [
      formatDuration(Math.max(10, delta - 10)),
      formatDuration(delta + 10),
      formatDuration(delta + 15),
      formatDuration(Math.max(15, delta - 15)),
      formatDuration(delta + 60),
    ];
    return {
      id: `cm-elapsed-dual-${idx}-${startH}-${startM}-${delta}`,
      unitId: 'clock-elapsed',
      skillKey: `Elapsed: ${startStr} to ${endStr}`,
      inputKind: 'mcq',
      prompt: 'How much time passed from the Start clock to the End clock?',
      zhHint: '先把開始鐘面跳到下一個整點，再把剩下的分鐘加起來！',
      visual: {
        kind: 'dual-clock',
        startHour: startH,
        startMinute: startM,
        endHour: end.hour,
        endMinute: end.minute,
        elapsedLabel: ans,
      },
      choices: buildUniqueChoices(ans, distractors, rng),
      correctChoice: ans,
      explanation: `Start is ${startStr} and End is ${endStr}. Jump from ${startStr} → ${endStr} = ${ans}!`,
      zhExplanation: `左邊開始是 ${startStr}，右邊結束是 ${endStr}，總共經過了 ${ans}！`,
      conversionTip: 'Bridge to the next :00 hour first, then add remaining minutes!',
    };
  }

  if (mode === 'forward') {
    const distractors = [
      formatClockTime(end.hour, (end.minute + 10) % 60),
      formatClockTime(end.hour, (end.minute + 50) % 60),
      formatClockTime((end.hour % 12) + 1, end.minute),
      formatClockTime(startH, (startM + delta) % 60),
    ];
    return {
      id: `cm-elapsed-fwd-${idx}-${startH}-${startM}-${delta}`,
      unitId: 'clock-elapsed',
      skillKey: `Elapsed: +${delta}m from ${startStr}`,
      inputKind: 'mcq',
      prompt: `What time will it be ${formatDuration(delta)} AFTER the time on this clock?`,
      zhHint: `先讀出鐘面現在的時間，再往後加上 ${formatDuration(delta)}！`,
      visual: { kind: 'analog-clock', hour: startH, minute: startM, label: 'Start Time' },
      choices: buildUniqueChoices(endStr, distractors, rng),
      correctChoice: endStr,
      explanation: `The clock shows ${startStr}. Add ${formatDuration(delta)} → ${endStr}!`,
      zhExplanation: `鐘面顯示 ${startStr}，往後加 ${formatDuration(delta)} 就是 ${endStr}！`,
      conversionTip: '60 minutes = 1 full loop around the clock (+1 hour)!',
    };
  }

  // Backward elapsed time (given End clock, subtract delta)
  const backDelta = pick([15, 20, 25, 30, 35, 40, 45], rng);
  const earlier = addMinutes12h(startH, startM, 'PM', -backDelta);
  const earlierStr = formatClockTime(earlier.hour, earlier.minute);
  const distractors = [
    formatClockTime(startH, (startM + backDelta) % 60), // added instead of subtracted
    formatClockTime(earlier.hour, (earlier.minute + 10) % 60),
    formatClockTime((earlier.hour % 12) + 1, earlier.minute),
    formatClockTime(earlier.hour, (earlier.minute + 50) % 60),
  ];
  return {
    id: `cm-elapsed-back-${idx}-${startH}-${startM}-${backDelta}`,
    unitId: 'clock-elapsed',
    skillKey: `Elapsed: -${backDelta}m before ${startStr}`,
    inputKind: 'mcq',
    prompt: `What time was it ${backDelta} minutes BEFORE the time on this clock?`,
    zhHint: `先讀出鐘面時間，再「往前倒退」${backDelta} 分鐘（小心跨整點小時會減 1）！`,
    visual: { kind: 'analog-clock', hour: startH, minute: startM, label: 'Now' },
    choices: buildUniqueChoices(earlierStr, distractors, rng),
    correctChoice: earlierStr,
    explanation: `The clock shows ${startStr}. Count backward ${backDelta} minutes → ${earlierStr}!`,
    zhExplanation: `鐘面現在是 ${startStr}，往前倒推 ${backDelta} 分鐘是 ${earlierStr}！`,
    conversionTip: 'Going BEFORE :00? Drop the hour by 1 and count back from 60!',
  };
}

// ─── Unit 4: AM/PM & Daily Schedules ───────────────────────────────────────
interface ScheduleScenario {
  activity: string;
  zhActivity: string;
  startHours: number[];
  meridiem: 'AM' | 'PM';
  durations: number[];
  crossesNoon?: boolean;
}

const SCHEDULE_SCENARIOS: readonly ScheduleScenario[] = [
  {
    activity: 'School lunch and recess',
    zhActivity: '學校午餐與下課時間',
    startHours: [11],
    meridiem: 'AM',
    durations: [45, 50, 55, 65],
    crossesNoon: true,
  },
  {
    activity: 'Art class before lunch',
    zhActivity: '午餐前的美術課',
    startHours: [11],
    meridiem: 'AM',
    durations: [40, 50, 60, 75],
    crossesNoon: true,
  },
  {
    activity: 'Science museum field trip tour',
    zhActivity: '科學博物館校外教學導覽',
    startHours: [11],
    meridiem: 'AM',
    durations: [50, 65, 75, 90],
    crossesNoon: true,
  },
  {
    activity: 'After-school soccer practice',
    zhActivity: '放學後的足球練習',
    startHours: [3, 4],
    meridiem: 'PM',
    durations: [45, 50, 65, 75],
  },
  {
    activity: 'Piano lesson and warm-up',
    zhActivity: '鋼琴課與暖手練習',
    startHours: [4, 5],
    meridiem: 'PM',
    durations: [35, 45, 50, 60],
  },
  {
    activity: 'Morning math workshop',
    zhActivity: '早上的數學工作坊',
    startHours: [8, 9, 10],
    meridiem: 'AM',
    durations: [40, 45, 55, 70],
  },
  {
    activity: 'Baking strawberry cupcakes',
    zhActivity: '烤草莓杯子蛋糕',
    startHours: [2, 3],
    meridiem: 'PM',
    durations: [35, 45, 55, 65],
  },
  {
    activity: 'Library reading club',
    zhActivity: '圖書館閱讀社團',
    startHours: [12, 1],
    meridiem: 'PM',
    durations: [40, 50, 65, 75],
  },
];

function genClockSchedule(idx: number, rng: () => number): ClockMeasureQuestion {
  // Guarantee at least 2 noon-crossing AM→PM scenarios per session!
  const pool =
    idx % 2 === 0
      ? SCHEDULE_SCENARIOS.filter((s) => s.crossesNoon)
      : SCHEDULE_SCENARIOS;
  const sc = pick(pool, rng);
  const startH = pick(sc.startHours, rng);
  const startM = sc.crossesNoon ? pick([25, 30, 35, 40, 45, 50], rng) : pick([10, 15, 20, 25, 35, 40, 45], rng);
  const dur = pick(sc.durations, rng);
  const end = addMinutes12h(startH, startM, sc.meridiem, dur);

  const startFull = `${formatClockTime(startH, startM)} ${sc.meridiem}`;
  const endFull = `${formatClockTime(end.hour, end.minute)} ${end.meridiem}`;
  const wrongMeridiem: 'AM' | 'PM' = end.meridiem === 'AM' ? 'PM' : 'AM';

  const distractors = [
    `${formatClockTime(end.hour, end.minute)} ${wrongMeridiem}`, // AM/PM flip trap!
    `${formatClockTime(end.hour, (end.minute + 10) % 60)} ${end.meridiem}`,
    `${formatClockTime((end.hour % 12) + 1, end.minute)} ${end.meridiem}`,
    `${formatClockTime(end.hour, (end.minute + 50) % 60)} ${end.meridiem}`,
  ];

  return {
    id: `cm-schedule-${idx}-${startH}-${startM}-${dur}`,
    unitId: 'clock-schedule',
    skillKey: `AM/PM: ${startFull} + ${dur}m`,
    inputKind: 'mcq',
    prompt: `${sc.activity} starts at the time shown (${sc.meridiem}) and lasts ${formatDuration(dur)}. When does it end?`,
    zhHint: `${sc.zhActivity}在鐘面時間（${sc.meridiem}）開始，持續 ${formatDuration(dur)}；跨過中午 12:00 會從 AM 變成 PM 喔！`,
    visual: {
      kind: 'analog-clock',
      hour: startH,
      minute: startM,
      meridiem: sc.meridiem,
      label: `Starts (${sc.meridiem})`,
    },
    choices: buildUniqueChoices(endFull, distractors, rng),
    correctChoice: endFull,
    explanation: `Starts at ${startFull} + ${formatDuration(dur)} = ${endFull}.${
      sc.meridiem !== end.meridiem ? ' Notice it crossed 12:00 noon, so AM flipped to PM!' : ''
    }`,
    zhExplanation: `從 ${startFull} 加上 ${formatDuration(dur)} 等於 ${endFull}。${
      sc.meridiem !== end.meridiem ? '（因為跨過中午 12:00，所以 AM 變成 PM！）' : ''
    }`,
    conversionTip: '11:59 AM → 12:00 PM (Noon switches AM to PM!)',
  };
}

// ─── Unit 5: Read the Ruler (Inches & cm) ──────────────────────────────────
const RULER_OBJECTS: readonly {
  name: string;
  zhName: string;
  color: string;
  shape: 'pencil' | 'crayon' | 'ribbon' | 'marker' | 'bar';
}[] = [
  { name: 'crayon', zhName: '蠟筆', color: '#F97316', shape: 'crayon' },
  { name: 'pencil', zhName: '鉛筆', color: '#EAB308', shape: 'pencil' },
  { name: 'ribbon', zhName: '緞帶', color: '#EC4899', shape: 'ribbon' },
  { name: 'marker', zhName: '彩色筆', color: '#2563EB', shape: 'marker' },
  { name: 'craft stick', zhName: '冰棒棍', color: '#10B981', shape: 'bar' },
];

function genMeasureRuler(idx: number, rng: () => number): ClockMeasureQuestion {
  const obj = pick(RULER_OBJECTS, rng);
  const useInches = idx % 2 === 0;
  // Make questions #3 (inches) and #4 (cm) start at a non-zero tick so BOTH systems practice shifted starts!
  const shiftedStart = idx === 2 || idx === 3;

  if (useInches) {
    const maxUnits = 6;
    const startQ = shiftedStart ? pick([4, 6, 8], rng) : 0; // 1 in, 1 1/2 in, or 2 in
    const maxLenQ = maxUnits * 4 - startQ - 1;
    const lenQ = pickInt(5, Math.min(16, maxLenQ), rng); // 1 1/4 in .. 4 in
    const endQ = startQ + lenQ;

    const correctStr = formatMixedQuarterInches(lenQ);
    const distractors = [
      // Classic trap: reading the end tick instead of subtracting start!
      ...(shiftedStart ? [formatMixedQuarterInches(endQ)] : []),
      formatMixedQuarterInches(lenQ + 1),
      formatMixedQuarterInches(Math.max(1, lenQ - 1)),
      formatMixedQuarterInches(lenQ + 2),
      formatMixedQuarterInches(Math.max(1, lenQ - 2)),
    ];

    return {
      id: `cm-ruler-in-${idx}-${startQ}-${endQ}`,
      unitId: 'measure-ruler',
      skillKey: `Ruler (in): ${shiftedStart ? 'Shifted' : 'Zero'} ${correctStr}`,
      inputKind: 'mcq',
      prompt: `How long is this ${obj.name} to the nearest 1/4 inch?`,
      zhHint: shiftedStart
        ? `小心！這支${obj.zhName}沒有從 0 開始量，要用「終點刻度 − 起點刻度」喔！`
        : `數清楚每 1 吋分成 4 小格（每小格是 1/4 吋、中間長線是 1/2 吋）！`,
      visual: {
        kind: 'ruler',
        unit: 'in',
        maxUnits,
        startVal: startQ / 4,
        endVal: endQ / 4,
        objectName: obj.name,
        objectColor: obj.color,
        objectShape: obj.shape,
      },
      choices: buildUniqueChoices(correctStr, distractors, rng),
      correctChoice: correctStr,
      explanation: shiftedStart
        ? `Starts at ${formatMixedQuarterInches(startQ)} and ends at ${formatMixedQuarterInches(endQ)}. Subtract: ${formatMixedQuarterInches(endQ)} − ${formatMixedQuarterInches(startQ)} = ${correctStr}!`
        : `Starts at 0 and ends at ${correctStr}!`,
      zhExplanation: shiftedStart
        ? `起點在 ${formatMixedQuarterInches(startQ)}、終點在 ${formatMixedQuarterInches(endQ)}，相減得到長度為 ${correctStr}！`
        : `從 0 對齊量到 ${correctStr}！`,
      conversionTip: 'Always check where it STARTS! Length = End − Start',
    };
  }

  // Metric cm ruler (up to 12 cm, supporting whole & .5 cm)
  const maxUnits = 12;
  const startHalf = shiftedStart ? pick([2, 4, 6], rng) : 0; // 1, 2, or 3 cm
  const lenHalf = pickInt(6, Math.min(15, maxUnits * 2 - startHalf - 1), rng); // 3 cm .. 7.5 cm
  const endHalf = startHalf + lenHalf;
  const fmtCm = (h: number) => (h % 2 === 0 ? `${h / 2} cm` : `${(h / 2).toFixed(1)} cm`);
  const correctStr = fmtCm(lenHalf);

  const distractors = [
    ...(shiftedStart ? [fmtCm(endHalf)] : []),
    fmtCm(lenHalf + 1),
    fmtCm(Math.max(2, lenHalf - 1)),
    fmtCm(lenHalf + 2),
    fmtCm(Math.max(2, lenHalf - 2)),
  ];

  return {
    id: `cm-ruler-cm-${idx}-${startHalf}-${endHalf}`,
    unitId: 'measure-ruler',
    skillKey: `Ruler (cm): ${shiftedStart ? 'Shifted' : 'Zero'} ${correctStr}`,
    inputKind: 'mcq',
    prompt: `How long is this ${obj.name} in centimeters (cm)?`,
    zhHint: shiftedStart
      ? `注意起點不是 0！記得用「終點公分 − 起點公分」算出真正長度！`
      : `看刻度：每兩個公分數字中間那條半長線是 0.5 cm！`,
    visual: {
      kind: 'ruler',
      unit: 'cm',
      maxUnits,
      startVal: startHalf / 2,
      endVal: endHalf / 2,
      objectName: obj.name,
      objectColor: obj.color,
      objectShape: obj.shape,
    },
    choices: buildUniqueChoices(correctStr, distractors, rng),
    correctChoice: correctStr,
    explanation: shiftedStart
      ? `Starts at ${fmtCm(startHalf)} and ends at ${fmtCm(endHalf)}. Length = ${fmtCm(endHalf)} − ${fmtCm(startHalf)} = ${correctStr}!`
      : `Starts at 0 cm and reaches ${correctStr}!`,
    zhExplanation: shiftedStart
      ? `起點 ${fmtCm(startHalf)}、終點 ${fmtCm(endHalf)}，相減得 ${correctStr}！`
      : `從 0 量到 ${correctStr}！`,
    conversionTip: '1 cm = 10 mm · Halfway between two cm marks = 0.5 cm',
  };
}

// ─── Unit 6: Best Unit Match (36 Curated Real-World US + Metric Bank) ──────
interface UnitSenseEntry {
  id: string;
  domain: 'length' | 'weight' | 'capacity';
  system: 'US Customary' | 'Metric';
  itemEmoji: string;
  itemName: string;
  measureHint: string;
  prompt: string;
  zhHint: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
  zhExplanation: string;
}

export const UNIT_SENSE_BANK: readonly UnitSenseEntry[] = [
  // US Customary — Length
  { id: 'us-len-1', domain: 'length', system: 'US Customary', itemEmoji: '✏️', itemName: 'New Pencil', measureHint: 'Length', prompt: 'Which measurement is most reasonable for the length of a new pencil?', zhHint: '想想一支新鉛筆握在手裡的大小，哪一個長度單位最合理？', correct: '7 inches', distractors: ['7 feet', '7 yards', '7 miles'], explanation: 'A pencil is about 7 inches long (7 feet would be taller than a doorway!).', zhExplanation: '一支鉛筆大約 7 吋（約 18 公分）；7 英尺比門還高！' },
  { id: 'us-len-2', domain: 'length', system: 'US Customary', itemEmoji: '🚪', itemName: 'Classroom Door', measureHint: 'Height', prompt: 'Which is the best estimate for the height of a classroom door?', zhHint: '教室門的高度大約比一個高個子大人再高一點點，選最適合的長度單位！', correct: '7 feet', distractors: ['7 inches', '7 yards', '7 miles'], explanation: 'A standard door is about 7 feet tall (around 2 meters).', zhExplanation: '標準教室門高約 7 英尺（約 2.1 公尺）。' },
  { id: 'us-len-3', domain: 'length', system: 'US Customary', itemEmoji: '🏈', itemName: 'Football Field', measureHint: 'Length', prompt: 'Which US unit is best for measuring the length of a football field?', zhHint: '想想看大型運動球場的長度，要用哪一個美制長度單位？', correct: 'yards (yd)', distractors: ['inches (in)', 'miles (mi)', 'ounces (oz)'], explanation: 'A football field is 100 yards long!', zhExplanation: '美式足球場長 100 碼（yards），1 碼大約跨一大步。' },
  { id: 'us-len-4', domain: 'length', system: 'US Customary', itemEmoji: '🚗', itemName: 'Drive to Another City', measureHint: 'Distance', prompt: 'Which unit measures the driving distance between two cities?', zhHint: '高速公路上兩個城市之間的長距離用哪一個單位？', correct: 'miles (mi)', distractors: ['inches (in)', 'feet (ft)', 'yards (yd)'], explanation: 'Long road distances in the US are measured in miles.', zhExplanation: '長途行車距離在美國都用英里（miles）。' },
  { id: 'us-len-5', domain: 'length', system: 'US Customary', itemEmoji: '🐞', itemName: 'Ladybug', measureHint: 'Length', prompt: 'A tiny ladybug is best measured in which US unit?', zhHint: '小小的瓢蟲比指尖還小，要選最小的美制長度單位！', correct: 'inches (about 1/4 in)', distractors: ['feet (ft)', 'yards (yd)', 'miles (mi)'], explanation: 'Small bugs are measured in fractions of an inch.', zhExplanation: '小昆蟲非常小，用英吋（約 1/4 吋）最合理。' },
  { id: 'us-len-6', domain: 'length', system: 'US Customary', itemEmoji: '🛏️', itemName: 'Kids Bed', measureHint: 'Length', prompt: 'About how long is a twin bed?', zhHint: '一張單人床大約多長？比教室門稍微短一點點。', correct: '6 feet', distractors: ['6 inches', '6 yards', '6 miles'], explanation: 'A twin bed is about 6 feet (72 inches) long.', zhExplanation: '單人床長約 6 英尺（約 183 公分）。' },
  // US Customary — Weight
  { id: 'us-wt-1', domain: 'weight', system: 'US Customary', itemEmoji: '🍓', itemName: 'One Strawberry', measureHint: 'Weight', prompt: 'Which weight is most reasonable for one strawberry?', zhHint: '一顆草莓拿起來超級輕，應該選最小的美制重量單位！', correct: '1 ounce (oz)', distractors: ['1 pound (lb)', '10 pounds (lb)', '1 ton'], explanation: 'Light snacks like a strawberry weigh about 1 ounce (16 oz = 1 lb).', zhExplanation: '一顆草莓很輕，大約 1 盎司（1 磅 = 16 盎司）。' },
  { id: 'us-wt-2', domain: 'weight', system: 'US Customary', itemEmoji: '🐶', itemName: 'Golden Retriever', measureHint: 'Weight', prompt: 'About how much does a full-grown Golden Retriever weigh?', zhHint: '一隻成年大型黃金獵犬抱起來很重，比小小孩還重一點喔！', correct: '65 pounds (lb)', distractors: ['65 ounces (oz)', '65 tons', '6 pounds (lb)'], explanation: 'A large dog weighs around 60–70 pounds (65 oz is only ~4 lb!).', zhExplanation: '大型犬約 65 磅（約 30 公斤）；65 盎司只有約 4 磅太輕了！' },
  { id: 'us-wt-3', domain: 'weight', system: 'US Customary', itemEmoji: '🐘', itemName: 'African Elephant', measureHint: 'Weight', prompt: 'Which US unit is best for weighing a giant elephant or a school bus?', zhHint: '大象或校車超級重，比好幾千磅還重，要用最大的重量單位！', correct: 'tons (T)', distractors: ['ounces (oz)', 'inches (in)', 'cups (c)'], explanation: 'Very heavy objects (2,000 lb = 1 ton) are measured in tons.', zhExplanation: '1 噸（ton）= 2,000 磅，專門衡量大象或卡車！' },
  { id: 'us-wt-4', domain: 'weight', system: 'US Customary', itemEmoji: '🎒', itemName: 'School Backpack', measureHint: 'Weight', prompt: 'Which is a reasonable weight for a 4th grader’s backpack with books?', zhHint: '裝書的國小書包背在肩上有份量，但不會像大人一樣重！', correct: '8 pounds (lb)', distractors: ['8 ounces (oz)', '80 pounds (lb)', '8 tons'], explanation: 'A packed school backpack weighs around 6–10 pounds.', zhExplanation: '裝書的書包大約 8 磅（約 3.6 公斤）。' },
  { id: 'us-wt-5', domain: 'weight', system: 'US Customary', itemEmoji: '✉️', itemName: 'Birthday Card', measureHint: 'Weight', prompt: 'Which US weight unit is best for mailing a single birthday card?', zhHint: '一張薄薄的生日卡片非常輕，郵局寄信時用哪個單位計重？', correct: 'ounces (oz)', distractors: ['pounds (lb)', 'tons (T)', 'gallons (gal)'], explanation: 'A letter or card weighs around 1 ounce.', zhExplanation: '一封信大約 1 盎司（約 28 公克）。' },
  { id: 'us-wt-6', domain: 'weight', system: 'US Customary', itemEmoji: '🍉', itemName: 'Whole Watermelon', measureHint: 'Weight', prompt: 'About how much does a big whole watermelon weigh?', zhHint: '一顆大西瓜兩手抱起來沉甸甸的，大約比裝書的書包再重一點！', correct: '15 pounds (lb)', distractors: ['15 ounces (oz)', '15 tons', '1 pound (lb)'], explanation: 'A large watermelon typically weighs 12–20 pounds.', zhExplanation: '大西瓜大約 15 磅（約 7 公斤）。' },
  // US Customary — Capacity
  { id: 'us-cap-1', domain: 'capacity', system: 'US Customary', itemEmoji: '🥛', itemName: 'Glass of Milk', measureHint: 'Liquid Volume', prompt: 'About how much milk fits in one small breakfast glass?', zhHint: '一小杯早餐牛奶大約是一個人一次喝完的份量！', correct: '1 cup (8 fl oz)', distractors: ['1 gallon', '10 quarts', '1 ton'], explanation: 'A standard drinking cup holds about 1 cup (8 fluid ounces).', zhExplanation: '一杯早餐牛奶大約 1 cup（約 240 毫升）。' },
  { id: 'us-cap-2', domain: 'capacity', system: 'US Customary', itemEmoji: '🧴', itemName: 'Large Milk Jug', measureHint: 'Liquid Volume', prompt: 'A big family jug of milk from a US grocery store holds about:', zhHint: '美國超市那種全家人喝好幾天、有手把的超大桶牛奶瓶！', correct: '1 gallon (gal)', distractors: ['1 cup (c)', '1 fluid ounce', '100 gallons'], explanation: 'A large US family milk jug is 1 gallon (= 4 quarts = 16 cups)!', zhExplanation: '美國大桶牛奶就是 1 加侖（1 gallon = 4 quarts = 16 cups）。' },
  { id: 'us-cap-3', domain: 'capacity', system: 'US Customary', itemEmoji: '🛁', itemName: 'Bathtub of Water', measureHint: 'Liquid Volume', prompt: 'Which US unit is best for measuring all the water in a bathtub?', zhHint: '整個浴缸裝滿水非常多，要用最大的美制液體容量單位！', correct: 'gallons (gal)', distractors: ['fluid ounces (fl oz)', 'cups (c)', 'inches (in)'], explanation: 'A bathtub holds about 40–50 gallons of water.', zhExplanation: '浴缸大約能裝 40～50 加侖的水。' },
  { id: 'us-cap-4', domain: 'capacity', system: 'US Customary', itemEmoji: '🍨', itemName: 'Small Ice Cream Tub', measureHint: 'Liquid Volume', prompt: 'A classic small round tub of ice cream (like Ben & Jerry’s) holds:', zhHint: '比一杯牛奶大一倍、但比家庭號大桶小很多的小圓筒冰淇淋！', correct: '1 pint (2 cups)', distractors: ['1 gallon', '10 quarts', '1 fluid ounce'], explanation: 'A classic small ice cream tub is 1 pint (= 2 cups)!', zhExplanation: '小圓筒冰淇淋就是 1 品脫（1 pint = 2 cups）。' },
  { id: 'us-cap-5', domain: 'capacity', system: 'US Customary', itemEmoji: '🧃', itemName: 'Juice Box', measureHint: 'Liquid Volume', prompt: 'About how much juice is inside a lunchbox juice box?', zhHint: '一小盒餐袋鋁箔包果汁比一杯（1 cup）稍微少一點點，選最小的液體單位！', correct: '6 fluid ounces (fl oz)', distractors: ['6 cups', '6 quarts', '6 gallons'], explanation: 'A kid’s juice box holds about 6 fluid ounces (a little less than 1 cup).', zhExplanation: '小朋友鋁箔包果汁大約 6 液體盎司（約 180～200 毫升）。' },
  { id: 'us-cap-6', domain: 'capacity', system: 'US Customary', itemEmoji: '🍲', itemName: 'Medium Soup Pot', measureHint: 'Liquid Volume', prompt: 'A tall carton of chicken broth or medium soup pitcher is about:', zhHint: '超市那種長方盒高湯，大小剛好介於小圓筒與超大加侖桶之間！', correct: '1 quart (4 cups)', distractors: ['1 fluid ounce', '10 gallons', '1 cup'], explanation: '1 quart = 4 cups (one-quarter of a gallon!).', zhExplanation: '1 夸脫（quart）= 4 cups，剛好是 1 加侖的四分之一！' },
  // Metric — Length
  { id: 'met-len-1', domain: 'length', system: 'Metric', itemEmoji: '🐜', itemName: 'Tiny Ant', measureHint: 'Length', prompt: 'Which metric unit is best for measuring the width of a tiny ant or fingernail thickness?', zhHint: '小螞蟻非常微小，要選比公分還小的公制長度單位！', correct: 'millimeters (mm)', distractors: ['meters (m)', 'kilometers (km)', 'liters (L)'], explanation: 'Millimeters (10 mm = 1 cm) measure tiny things like ants.', zhExplanation: '毫米（mm）是公制裡量微小物品的單位（10 mm = 1 cm）。' },
  { id: 'met-len-2', domain: 'length', system: 'Metric', itemEmoji: '📘', itemName: 'Chapter Book', measureHint: 'Length', prompt: 'About how tall is a regular chapter book?', zhHint: '一本普通故事書的高度比你的手掌稍微長一些！', correct: '20 centimeters (cm)', distractors: ['20 meters (m)', '20 kilometers (km)', '2 centimeters (cm)'], explanation: 'A paperback book is about 20 cm tall (20 m is a 6-story building!).', zhExplanation: '故事書大約 20 公分高（20 公尺大約六層樓高！）。' },
  { id: 'met-len-3', domain: 'length', system: 'Metric', itemEmoji: '🏊', itemName: 'Swimming Pool', measureHint: 'Length', prompt: 'Which metric unit measures the length of a swimming pool or classroom?', zhHint: '游泳池或教室長度比手掌大很多，但還沒到城市間那麼遠！', correct: 'meters (m)', distractors: ['millimeters (mm)', 'grams (g)', 'kilometers (km)'], explanation: 'A standard lap pool is 25 or 50 meters long.', zhExplanation: '標準泳池長 25 或 50 公尺（meters）。' },
  { id: 'met-len-4', domain: 'length', system: 'Metric', itemEmoji: '🚴', itemName: 'Bike Trail Between Towns', measureHint: 'Distance', prompt: 'Which metric unit is best for a long bike trail between two towns?', zhHint: '跨城鎮的長距離自行車道，要用最大的公制長度單位！', correct: 'kilometers (km)', distractors: ['centimeters (cm)', 'millimeters (mm)', 'milliliters (mL)'], explanation: 'Long travel distances in metric use kilometers (1 km = 1,000 m).', zhExplanation: '長距離用公里（km），1 公里 = 1,000 公尺。' },
  { id: 'met-len-5', domain: 'length', system: 'Metric', itemEmoji: '👆', itemName: 'Pinky Finger Width', measureHint: 'Width', prompt: 'The width of your pinky fingernail is a great benchmark for:', zhHint: '小朋友小指指甲的寬度剛好是哪一個常見基準長度？', correct: '1 centimeter (cm)', distractors: ['1 meter (m)', '1 kilometer (km)', '10 centimeters (cm)'], explanation: 'Your pinky finger width is right around 1 cm!', zhExplanation: '小指寬度大約就是 1 公分（cm），超好記的身體尺！' },
  { id: 'met-len-6', domain: 'length', system: 'Metric', itemEmoji: '🦒', itemName: 'Adult Giraffe', measureHint: 'Height', prompt: 'About how tall is an adult giraffe?', zhHint: '成年長頸鹿大約有兩層樓那麼高，選最適合的公制長度單位！', correct: '5 meters (m)', distractors: ['5 centimeters (cm)', '5 kilometers (km)', '5 millimeters (mm)'], explanation: 'An adult giraffe stands about 5 meters tall!', zhExplanation: '長頸鹿大約 5 公尺（約兩層樓高）！' },
  // Metric — Mass
  { id: 'met-wt-1', domain: 'weight', system: 'Metric', itemEmoji: '📎', itemName: 'Metal Paperclip', measureHint: 'Mass', prompt: 'A single small metal paperclip has a mass of about:', zhHint: '一根小小的迴紋針輕到幾乎沒感覺，是哪個經典基準重量？', correct: '1 gram (g)', distractors: ['1 kilogram (kg)', '100 grams (g)', '1 liter (L)'], explanation: 'One paperclip ≈ 1 gram is the classic metric benchmark!', zhExplanation: '一根迴紋針大約就是 1 公克（g），超經典基準物！' },
  { id: 'met-wt-2', domain: 'weight', system: 'Metric', itemEmoji: '🍎', itemName: 'Medium Apple', measureHint: 'Mass', prompt: 'Which mass is most reasonable for one medium apple?', zhHint: '一顆中蘋果握在手心剛剛好，比一整公斤輕很多！', correct: '180 grams (g)', distractors: ['180 kilograms (kg)', '2 grams (g)', '18 kilograms (kg)'], explanation: 'A medium apple has a mass of about 150–200 grams.', zhExplanation: '一顆蘋果大約 150～200 公克（180 公斤比大人還重兩倍！）。' },
  { id: 'met-wt-3', domain: 'weight', system: 'Metric', itemEmoji: '🐈', itemName: 'House Cat', measureHint: 'Mass', prompt: 'About how much mass does an adult house cat have?', zhHint: '抱起一隻成年家貓很有份量，跟幾本厚字典差不多重！', correct: '4 kilograms (kg)', distractors: ['4 grams (g)', '400 kilograms (kg)', '40 grams (g)'], explanation: 'An average house cat weighs about 4 kilograms (4,000 g).', zhExplanation: '一般家貓大約 4 公斤（kg）。' },
  { id: 'met-wt-4', domain: 'weight', system: 'Metric', itemEmoji: '🚲', itemName: 'Kids Bicycle', measureHint: 'Mass', prompt: 'Which metric unit is best for measuring the mass of a bicycle?', zhHint: '腳踏車比較重，該選較大的還是較小的公制質量單位？', correct: 'kilograms (kg)', distractors: ['grams (g)', 'milliliters (mL)', 'centimeters (cm)'], explanation: 'A kids bicycle has a mass of around 10–12 kilograms.', zhExplanation: '腳踏車重約 10～12 公斤，用公斤（kg）最合適。' },
  { id: 'met-wt-5', domain: 'weight', system: 'Metric', itemEmoji: '🍪', itemName: 'Chocolate Chip Cookie', measureHint: 'Mass', prompt: 'Which mass best fits one homemade chocolate chip cookie?', zhHint: '一片餅乾比一根迴紋針重一些，但遠比一顆蘋果輕！', correct: '30 grams (g)', distractors: ['30 kilograms (kg)', '1 gram (g)', '3 kilograms (kg)'], explanation: 'One cookie is around 25–35 grams.', zhExplanation: '一片餅乾大約 30 公克（g）。' },
  { id: 'met-wt-6', domain: 'weight', system: 'Metric', itemEmoji: '📚', itemName: 'Thick Dictionary', measureHint: 'Mass', prompt: 'A thick hardcover dictionary has a mass of about:', zhHint: '一本厚厚的精裝字典拿在手裡頗有重量，是一大單位還是小單位？', correct: '1 kilogram (kg)', distractors: ['1 gram (g)', '100 kilograms (kg)', '10 grams (g)'], explanation: 'A thick hardcover book is a great benchmark for 1 kilogram (1,000 g)!', zhExplanation: '一本厚字典大約就是 1 公斤（1,000 公克）！' },
  // Metric — Capacity
  { id: 'met-cap-1', domain: 'capacity', system: 'Metric', itemEmoji: '🥄', itemName: 'Medicine Dropper / Spoon', measureHint: 'Liquid Volume', prompt: 'A small teaspoon of cough syrup holds about:', zhHint: '一小茶匙感冒糖漿只有幾口滴管那麼少，選最小的容量！', correct: '5 milliliters (mL)', distractors: ['5 liters (L)', '500 milliliters (mL)', '5 kilograms (kg)'], explanation: 'One teaspoon = 5 mL (very tiny compared to 1 liter!).', zhExplanation: '一茶匙大約 5 毫升（mL）。' },
  { id: 'met-cap-2', domain: 'capacity', system: 'Metric', itemEmoji: '🧋', itemName: 'Boba Milk Tea Cup', measureHint: 'Liquid Volume', prompt: 'About how much boba milk tea is in a regular medium cup?', zhHint: '一杯手搖珍珠奶茶大約是運動大水壺的一半容量！', correct: '500 milliliters (mL)', distractors: ['500 liters (L)', '5 milliliters (mL)', '50 liters (L)'], explanation: 'A medium boba tea or water bottle is about 500 mL (= half a liter)!', zhExplanation: '一杯中杯珍奶或一瓶礦泉水大約 500 毫升（0.5 公升）。' },
  { id: 'met-cap-3', domain: 'capacity', system: 'Metric', itemEmoji: '🥤', itemName: 'Large Reusable Water Bottle', measureHint: 'Liquid Volume', prompt: 'A large sports water bottle holds about:', zhHint: '大支運動水壺比一杯中杯珍奶大一倍，容量剛好是一個整數大單位！', correct: '1 liter (L)', distractors: ['1 milliliter (mL)', '100 liters (L)', '10 milliliters (mL)'], explanation: 'A large sports water bottle holds about 1 liter (1,000 mL).', zhExplanation: '大運動水壺約 1 公升（1,000 mL）。' },
  { id: 'met-cap-4', domain: 'capacity', system: 'Metric', itemEmoji: '🐠', itemName: 'Classroom Fish Tank', measureHint: 'Liquid Volume', prompt: 'Which metric unit is best for measuring water in a large fish tank?', zhHint: '水族箱裝了很多水，要用較大的公制液體容量單位！', correct: 'liters (L)', distractors: ['milliliters (mL)', 'grams (g)', 'meters (m)'], explanation: 'Large amounts of liquid like fish tanks are measured in liters.', zhExplanation: '水族箱水量很大，用公升（L）最合適！' },
  { id: 'met-cap-5', domain: 'capacity', system: 'Metric', itemEmoji: '💧', itemName: 'Eyedropper', measureHint: 'Liquid Volume', prompt: 'About 20 tiny drops of water from an eyedropper equal:', zhHint: '滴管擠出的幾滴小水滴非常微小，是最小的公制容量基準！', correct: '1 milliliter (mL)', distractors: ['1 liter (L)', '100 milliliters (mL)', '10 liters (L)'], explanation: '1 mL is tiny — about 20 drops of water!', zhExplanation: '20 滴水大約就是 1 毫升（mL）！' },
  { id: 'met-cap-6', domain: 'capacity', system: 'Metric', itemEmoji: '🪣', itemName: 'Mop Bucket', measureHint: 'Liquid Volume', prompt: 'About how much water fills a full cleaning bucket?', zhHint: '一整桶拖地水桶大約能裝十支大運動水壺的水量！', correct: '10 liters (L)', distractors: ['10 milliliters (mL)', '100 milliliters (mL)', '1,000 liters (L)'], explanation: 'A standard bucket holds about 10 liters of water.', zhExplanation: '一般水桶大約可裝 10 公升（L）的水。' },
];

function genMeasureUnitSense(idx: number, rng: () => number, usedIds: Set<string>): ClockMeasureQuestion {
  const available = UNIT_SENSE_BANK.filter((e) => !usedIds.has(e.id));
  const entry = available.length > 0 ? pick(available, rng) : pick(UNIT_SENSE_BANK, rng);
  usedIds.add(entry.id);

  return {
    id: `cm-sense-${idx}-${entry.id}`,
    unitId: 'measure-unit-sense',
    skillKey: `Unit Sense: ${entry.itemName}`,
    inputKind: 'mcq',
    prompt: entry.prompt,
    zhHint: entry.zhHint,
    visual: {
      kind: 'unit-sense-card',
      domain: entry.domain,
      system: entry.system,
      itemEmoji: entry.itemEmoji,
      itemName: entry.itemName,
      measureHint: entry.measureHint,
    },
    choices: buildUniqueChoices(entry.correct, [...entry.distractors], rng),
    correctChoice: entry.correct,
    explanation: entry.explanation,
    zhExplanation: entry.zhExplanation,
    conversionTip:
      entry.system === 'US Customary'
        ? 'US: 12 in = 1 ft · 16 oz = 1 lb · 16 cups = 1 gal'
        : 'Metric: 100 cm = 1 m · 1,000 g = 1 kg · 1,000 mL = 1 L',
  };
}

// ─── Unit 7: Beaker & Scale Reader ─────────────────────────────────────────
function genMeasureBeakerScale(idx: number, rng: () => number): ClockMeasureQuestion {
  const isBeaker = idx % 2 === 0;

  if (isBeaker) {
    const useMetric = rng() < 0.65;
    if (useMetric) {
      const currentVal = pick([150, 200, 250, 300, 350, 400, 450, 550, 600, 650, 700], rng);
      const isAdd = idx === 2 || idx === 4;
      const addVal = isAdd ? pick([150, 200, 250, 300], rng) : 0;
      const safeAdd = currentVal + addVal <= 1000 ? addVal : 150;
      const ansNum = isAdd ? currentVal + safeAdd : currentVal;
      const ansStr = `${ansNum} mL`;
      const drink = pick(
        [
          { label: 'Mango Juice', color: '#F59E0B' },
          { label: 'Berry Punch', color: '#EC4899' },
          { label: 'Blue Lemonade', color: '#38BDF8' },
          { label: 'Matcha Milk', color: '#10B981' },
        ],
        rng,
      );

      const distractors = [
        `${ansNum + 50} mL`,
        `${Math.max(50, ansNum - 50)} mL`,
        `${ansNum + 100} mL`,
        ...(isAdd ? [`${currentVal} mL`] : [`${Math.max(50, ansNum - 100)} mL`]),
      ];

      return {
        id: `cm-beaker-ml-${idx}-${currentVal}-${safeAdd}`,
        unitId: 'measure-beaker-scale',
        skillKey: `Beaker (mL): ${ansStr}`,
        inputKind: 'mcq',
        prompt: isAdd
          ? `Read the beaker, then pour in ${safeAdd} mL more ${drink.label}. How much liquid will be in the beaker?`
          : `How much ${drink.label} is in this measuring beaker?`,
        zhHint: isAdd
          ? `先看懂現在液面在幾 mL（標數字大格 200 mL、中線 100 mL、最細小格 50 mL），再加上倒入的 ${safeAdd} mL！`
          : '仔細看量杯刻度：標數字的大格是 200 mL、中線是 100 mL、最細短線是 50 mL！',
        visual: {
          kind: 'beaker',
          unit: 'mL',
          maxVal: 1000,
          majorStep: 200,
          currentVal,
          ...(isAdd ? { addVal: safeAdd } : {}),
          liquidColor: drink.color,
          liquidLabel: drink.label,
        },
        choices: buildUniqueChoices(ansStr, distractors, rng),
        correctChoice: ansStr,
        explanation: isAdd
          ? `The beaker starts at ${currentVal} mL. Adding ${safeAdd} mL gives ${currentVal} + ${safeAdd} = ${ansStr}!`
          : `The liquid line sits right at ${ansStr}!`,
        zhExplanation: isAdd
          ? `量杯原本有 ${currentVal} mL，再倒入 ${safeAdd} mL，共 ${ansStr}！`
          : `液面對齊在 ${ansStr} 刻度！`,
        conversionTip: '1,000 mL = 1 Liter (halfway = 500 mL)',
      };
    }

    // US Cups beaker (0..4 cups in 1/2 cup ticks)
    const halfCups = pick([3, 4, 5, 6, 7], rng); // 1.5 .. 3.5 cups
    const fmtCup = (h: number) => {
      const w = Math.floor(h / 2);
      const rem = h % 2;
      if (rem === 0) return w === 1 ? '1 cup' : `${w} cups`;
      return w === 0 ? '1/2 cup' : `${w} 1/2 cups`;
    };
    const ansStr = fmtCup(halfCups);
    const distractors = [
      fmtCup(halfCups + 1),
      fmtCup(Math.max(1, halfCups - 1)),
      fmtCup(halfCups + 2),
      fmtCup(Math.max(1, halfCups - 2)),
    ];
    return {
      id: `cm-beaker-cup-${idx}-${halfCups}`,
      unitId: 'measure-beaker-scale',
      skillKey: `Beaker (cups): ${ansStr}`,
      inputKind: 'mcq',
      prompt: 'How much milk is in this measuring cup?',
      zhHint: '每兩個整數杯中間的短刻度是 1/2 cup（半杯）！',
      visual: {
        kind: 'beaker',
        unit: 'cups',
        maxVal: 4,
        majorStep: 1,
        currentVal: halfCups / 2,
        liquidColor: '#60A5FA',
        liquidLabel: 'Milk',
      },
      choices: buildUniqueChoices(ansStr, distractors, rng),
      correctChoice: ansStr,
      explanation: `The level reaches ${ansStr} on the measuring cup!`,
      zhExplanation: `液面對齊在 ${ansStr} 刻度！`,
      conversionTip: '2 cups = 1 pint · 4 cups = 1 quart',
    };
  }

  // Dial kitchen scale (g or lb)
  const useMetricScale = rng() < 0.55;
  if (useMetricScale) {
    // 0..1000 g scale, majorStep 100 g, pointer on multiples of 50 g
    const val = pick([150, 200, 250, 350, 400, 450, 550, 600, 650, 750, 800, 850], rng);
    const ansStr = `${val} g`;
    const item = pick(
      [
        { emoji: '🍎', label: 'Bag of Apples' },
        { emoji: '🍓', label: 'Basket of Berries' },
        { emoji: '🧁', label: 'Box of Cupcakes' },
        { emoji: '🍊', label: 'Oranges' },
      ],
      rng,
    );
    const distractors = [
      `${val + 50} g`,
      `${Math.max(50, val - 50)} g`,
      `${val + 100} g`,
      `${Math.max(50, val - 100)} g`,
    ];
    return {
      id: `cm-scale-g-${idx}-${val}`,
      unitId: 'measure-beaker-scale',
      skillKey: `Scale (g): ${ansStr}`,
      inputKind: 'mcq',
      prompt: `What is the mass of the ${item.label.toLowerCase()} on the scale?`,
      zhHint: '看圓形磅秤的紅色指針指在幾公克（每個大數字相差 100 g，中間短線是 50 g）！',
      visual: {
        kind: 'dial-scale',
        unit: 'g',
        maxVal: 1000,
        majorStep: 100,
        value: val,
        itemEmoji: item.emoji,
        itemLabel: item.label,
      },
      choices: buildUniqueChoices(ansStr, distractors, rng),
      correctChoice: ansStr,
      explanation: `The scale needle points directly to ${ansStr}!`,
      zhExplanation: `磅秤指針指在 ${ansStr} 的位置！`,
      conversionTip: '1,000 g = 1 kg (500 g = half a kilogram)',
    };
  }

  // US lb scale (0..10 lb, majorStep 1 lb, pointer on whole/half lb)
  const halfLb = pick([3, 4, 5, 6, 7, 9, 11, 13, 15, 17], rng); // 1.5 .. 8.5 lb
  const fmtLb = (h: number) => {
    const w = Math.floor(h / 2);
    if (h % 2 === 0) return `${w} lb`;
    return w === 0 ? '1/2 lb' : `${w} 1/2 lb`;
  };
  const ansStr = fmtLb(halfLb);
  const item = pick(
    [
      { emoji: '🎃', label: 'Pumpkin' },
      { emoji: '🍉', label: 'Mini Watermelon' },
      { emoji: '📦', label: 'Book Parcel' },
    ],
    rng,
  );
  const distractors = [
    fmtLb(halfLb + 1),
    fmtLb(Math.max(1, halfLb - 1)),
    fmtLb(halfLb + 2),
    fmtLb(Math.max(1, halfLb - 2)),
  ];
  return {
    id: `cm-scale-lb-${idx}-${halfLb}`,
    unitId: 'measure-beaker-scale',
    skillKey: `Scale (lb): ${ansStr}`,
    inputKind: 'mcq',
    prompt: `How much does the ${item.label.toLowerCase()} weigh on this pound scale?`,
    zhHint: '紅色指針指向每兩個磅數中間短刻度代表 1/2 lb（半磅）！',
    visual: {
      kind: 'dial-scale',
      unit: 'lb',
      maxVal: 10,
      majorStep: 1,
      value: halfLb / 2,
      itemEmoji: item.emoji,
      itemLabel: item.label,
    },
    choices: buildUniqueChoices(ansStr, distractors, rng),
    correctChoice: ansStr,
    explanation: `The pointer sits at ${ansStr}!`,
    zhExplanation: `磅秤指針指在 ${ansStr}！`,
    conversionTip: '1 lb = 16 oz · 1/2 lb = 8 oz',
  };
}

// ─── Unit 8: Unit Conversion Ladder (US Customary + Metric) ────────────────
interface ConversionRule {
  id: string;
  system: 'US Customary' | 'Metric';
  fromSingular: string;
  fromPlural: string;
  toUnit: string;
  factor: number;
  minN: number;
  maxN: number;
  compoundExtraMax?: number;
  ruleFormula: string;
  zhRule: string;
}

const CONVERSION_RULES: readonly ConversionRule[] = [
  { id: 'ft-in', system: 'US Customary', fromSingular: 'ft', fromPlural: 'ft', toUnit: 'in', factor: 12, minN: 2, maxN: 8, compoundExtraMax: 9, ruleFormula: '1 ft = 12 in', zhRule: '1 英尺 = 12 吋（大轉小用乘 ×12）' },
  { id: 'yd-ft', system: 'US Customary', fromSingular: 'yd', fromPlural: 'yd', toUnit: 'ft', factor: 3, minN: 3, maxN: 12, compoundExtraMax: 2, ruleFormula: '1 yd = 3 ft', zhRule: '1 碼 = 3 英尺（×3）' },
  { id: 'lb-oz', system: 'US Customary', fromSingular: 'lb', fromPlural: 'lb', toUnit: 'oz', factor: 16, minN: 2, maxN: 5, compoundExtraMax: 10, ruleFormula: '1 lb = 16 oz', zhRule: '1 磅 = 16 盎司（×16）' },
  { id: 'gal-qt', system: 'US Customary', fromSingular: 'gal', fromPlural: 'gal', toUnit: 'qt', factor: 4, minN: 2, maxN: 9, compoundExtraMax: 3, ruleFormula: '1 gal = 4 qt', zhRule: '1 加侖 = 4 夸脫（×4）' },
  { id: 'qt-cup', system: 'US Customary', fromSingular: 'qt', fromPlural: 'qt', toUnit: 'cups', factor: 4, minN: 2, maxN: 7, ruleFormula: '1 qt = 4 cups', zhRule: '1 夸脫 = 4 杯（×4）' },
  { id: 'hr-min', system: 'US Customary', fromSingular: 'hr', fromPlural: 'hr', toUnit: 'min', factor: 60, minN: 2, maxN: 5, compoundExtraMax: 35, ruleFormula: '1 hr = 60 min', zhRule: '1 小時 = 60 分鐘（×60）' },
  { id: 'm-cm', system: 'Metric', fromSingular: 'm', fromPlural: 'm', toUnit: 'cm', factor: 100, minN: 2, maxN: 9, compoundExtraMax: 75, ruleFormula: '1 m = 100 cm', zhRule: '1 公尺 = 100 公分（×100）' },
  { id: 'km-m', system: 'Metric', fromSingular: 'km', fromPlural: 'km', toUnit: 'm', factor: 1000, minN: 2, maxN: 8, ruleFormula: '1 km = 1,000 m', zhRule: '1 公里 = 1,000 公尺（×1,000）' },
  { id: 'kg-g', system: 'Metric', fromSingular: 'kg', fromPlural: 'kg', toUnit: 'g', factor: 1000, minN: 2, maxN: 7, compoundExtraMax: 500, ruleFormula: '1 kg = 1,000 g', zhRule: '1 公斤 = 1,000 公克（×1,000）' },
  { id: 'l-ml', system: 'Metric', fromSingular: 'L', fromPlural: 'L', toUnit: 'mL', factor: 1000, minN: 2, maxN: 6, compoundExtraMax: 450, ruleFormula: '1 L = 1,000 mL', zhRule: '1 公升 = 1,000 毫升（×1,000）' },
];

function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

function genMeasureConversions(idx: number, rng: () => number, usedRuleIds: Set<string>): ClockMeasureQuestion {
  // Alternate US Customary & Metric so both systems get balanced practice
  const wantSystem = idx % 2 === 0 ? 'US Customary' : 'Metric';
  const pool = CONVERSION_RULES.filter((r) => r.system === wantSystem && !usedRuleIds.has(r.id));
  const rule =
    pool.length > 0
      ? pick(pool, rng)
      : pick(CONVERSION_RULES.filter((r) => r.system === wantSystem), rng);
  usedRuleIds.add(rule.id);

  const n = pickInt(rule.minN, rule.maxN, rng);
  const useCompound = Boolean(rule.compoundExtraMax) && (idx === 2 || idx === 3);
  const extra = useCompound && rule.compoundExtraMax ? pickInt(2, rule.compoundExtraMax, rng) : 0;
  const answerVal = n * rule.factor + extra;
  const fromLabel = useCompound ? `${n} ${rule.fromPlural} ${extra} ${rule.toUnit}` : `${n} ${rule.fromPlural}`;
  const ansStr = `${fmtNum(answerVal)} ${rule.toUnit}`;

  const equationReveal = useCompound
    ? `(${n} × ${fmtNum(rule.factor)}) + ${extra} = ${fmtNum(answerVal)} ${rule.toUnit}`
    : `${n} × ${fmtNum(rule.factor)} = ${fmtNum(answerVal)} ${rule.toUnit}`;

  const distractors = [
    `${fmtNum(answerVal + rule.factor)} ${rule.toUnit}`,
    `${fmtNum(Math.max(1, answerVal - rule.factor))} ${rule.toUnit}`,
    ...(useCompound
      ? [`${fmtNum(n * rule.factor)} ${rule.toUnit}`] // forgot to add extra
      : [`${fmtNum(n + rule.factor)} ${rule.toUnit}`]), // added instead of multiplied
    `${fmtNum(rule.factor >= 100 ? n * (rule.factor / 10) : answerVal + 2)} ${rule.toUnit}`,
  ];

  return {
    id: `cm-conv-${idx}-${rule.id}-${n}-${extra}`,
    unitId: 'measure-conversions',
    skillKey: `Convert: ${rule.ruleFormula}`,
    inputKind: 'mcq',
    prompt: `Convert ${fromLabel} into ${rule.toUnit}:`,
    zhHint: `大單位轉小單位用「乘法」！提示：${rule.zhRule}`,
    visual: {
      kind: 'conversion-ladder',
      system: rule.system,
      fromLabel,
      toUnit: rule.toUnit,
      ruleFormula: rule.ruleFormula,
      equationReveal,
    },
    choices: buildUniqueChoices(ansStr, distractors, rng),
    correctChoice: ansStr,
    explanation: `Since ${rule.ruleFormula}, compute ${equationReveal}!`,
    zhExplanation: `因為 ${rule.ruleFormula}，所以 ${equationReveal}！`,
    conversionTip: `Big → Small = MULTIPLY! (${rule.ruleFormula})`,
  };
}

export function generateClockMeasureQuestion(
  unitId: ClockMeasureUnitId,
  idx: number,
  rng: () => number,
  options?: { allowInteractive?: boolean; usedIds?: Set<string> },
): ClockMeasureQuestion {
  const allowInteractive = options?.allowInteractive ?? true;
  const usedIds = options?.usedIds ?? new Set<string>();
  switch (unitId) {
    case 'clock-basic':
      return genClockBasic(idx, rng, allowInteractive);
    case 'clock-exact':
      return genClockExact(idx, rng, allowInteractive);
    case 'clock-elapsed':
      return genClockElapsed(idx, rng);
    case 'clock-schedule':
      return genClockSchedule(idx, rng);
    case 'measure-ruler':
      return genMeasureRuler(idx, rng);
    case 'measure-unit-sense':
      return genMeasureUnitSense(idx, rng, usedIds);
    case 'measure-beaker-scale':
      return genMeasureBeakerScale(idx, rng);
    case 'measure-conversions':
      return genMeasureConversions(idx, rng, usedIds);
  }
}

export function buildClockMeasureSession(
  unitId: ClockMeasureUnitId,
  count = CLOCK_MEASURE_RUN_SIZE,
  seed: number = Date.now(),
): ClockMeasureQuestion[] {
  const rng = makeSeededRng(seed);
  const usedIds = new Set<string>();
  const seenPrompts = new Set<string>();
  const session: ClockMeasureQuestion[] = [];
  let guard = 0;

  while (session.length < count && guard < count * 8) {
    const q = generateClockMeasureQuestion(unitId, session.length, rng, {
      allowInteractive: true,
      usedIds,
    });
    const dedupKey = `${q.inputKind}|${q.prompt}|${q.correctChoice}`;
    if (!seenPrompts.has(dedupKey)) {
      seenPrompts.add(dedupKey);
      session.push({ ...q, id: `${q.id}-r${session.length}` });
    }
    guard += 1;
  }
  return session;
}

export function calculateClockMeasureTokens(
  firstTryCorrect: number,
  total = CLOCK_MEASURE_RUN_SIZE,
): number {
  const safeTotal = Math.max(1, total);
  const safeCorrect = Math.max(0, Math.min(safeTotal, Math.floor(firstTryCorrect)));
  const base = 10 + safeCorrect * 3;
  const perfectBonus = safeCorrect === safeTotal ? 5 : 0;
  return base + perfectBonus; // max 30 Tokens on 5/5 first try
}

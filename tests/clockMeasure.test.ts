import { describe, expect, it } from 'vitest';
import { createInitialPlayerState } from '../src/core/economy';
import { getCollectibleById } from '../src/core/packs';
import { completeQuestRun } from '../src/core/questCompletion';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  addMinutes12h,
  buildClockMeasureSession,
  calculateClockMeasureTokens,
  CLOCK_MEASURE_RUN_SIZE,
  CLOCK_MEASURE_UNITS,
  computeClockHandAngles,
  formatClockTime,
  formatMixedQuarterInches,
  UNIT_SENSE_BANK,
} from '../src/subjects/math/clockMeasureEngine';

describe('Clock & Measure Lab — Layer 1 Mathematical & Geometric Verification (1,600+ Fuzz)', () => {
  it('computes exact analog clock angles and 12-hour AM/PM arithmetic across noon/midnight', () => {
    // 2:55 -> hour hand is strictly inside [60°, 90°): 2*30 + 55/60*30 = 87.5°, NOT 90°!
    const a255 = computeClockHandAngles(2, 55);
    expect(a255.hourDeg).toBeCloseTo(87.5, 5);
    expect(a255.minuteDeg).toBe(330);
    expect(a255.hourDeg).toBeGreaterThanOrEqual(60);
    expect(a255.hourDeg).toBeLessThan(90);

    // 12:00 -> 0°, 0°
    expect(computeClockHandAngles(12, 0)).toEqual({ hourDeg: 0, minuteDeg: 0 });
    // 3:30 -> 105°, 180°
    expect(computeClockHandAngles(3, 30)).toEqual({ hourDeg: 105, minuteDeg: 180 });

    // Noon crossing: 11:45 AM + 35 min = 12:20 PM
    expect(addMinutes12h(11, 45, 'AM', 35)).toEqual({ hour: 12, minute: 20, meridiem: 'PM' });
    // Midnight crossing: 11:30 PM + 45 min = 12:15 AM
    expect(addMinutes12h(11, 30, 'PM', 45)).toEqual({ hour: 12, minute: 15, meridiem: 'AM' });
    // Backward across noon: 12:10 PM - 25 min = 11:45 AM
    expect(addMinutes12h(12, 10, 'PM', -25)).toEqual({ hour: 11, minute: 45, meridiem: 'AM' });
    // Backward across 1 PM: 1:10 PM - 25 min = 12:45 PM
    expect(addMinutes12h(1, 10, 'PM', -25)).toEqual({ hour: 12, minute: 45, meridiem: 'PM' });
  });

  it('ships 8 unique Clock & Measure units with valid emblems and 36 distinct unit-sense items', () => {
    expect(CLOCK_MEASURE_UNITS).toHaveLength(8);
    expect(new Set(CLOCK_MEASURE_UNITS.map((u) => u.id)).size).toBe(8);
    expect(CLOCK_MEASURE_UNITS.filter((u) => u.category === 'clock')).toHaveLength(4);
    expect(CLOCK_MEASURE_UNITS.filter((u) => u.category === 'measure')).toHaveLength(4);

    for (const unit of CLOCK_MEASURE_UNITS) {
      expect(getCollectibleById(unit.emblemCollectibleId), `Invalid emblem ${unit.emblemCollectibleId}`).toBeTruthy();
    }

    expect(UNIT_SENSE_BANK.length).toBeGreaterThanOrEqual(36);
    expect(new Set(UNIT_SENSE_BANK.map((e) => e.id)).size).toBe(UNIT_SENSE_BANK.length);
  });

  it('fuzz-verifies 200+ seeds × 8 units (8,000 generated items) with independent mathematical reverse-checks', () => {
    let totalChecked = 0;

    for (const unit of CLOCK_MEASURE_UNITS) {
      for (let seed = 1; seed <= 200; seed += 1) {
        const session = buildClockMeasureSession(unit.id, CLOCK_MEASURE_RUN_SIZE, seed * 97 + 13);
        expect(session).toHaveLength(CLOCK_MEASURE_RUN_SIZE);

        for (const q of session) {
          totalChecked += 1;
          expect(q.prompt.trim().length).toBeGreaterThan(5);
          expect(q.zhHint.trim().length).toBeGreaterThan(3);

          if (q.inputKind === 'mcq') {
            expect(q.choices).toHaveLength(4);
            expect(new Set(q.choices).size).toBe(4);
            expect(q.choices).toContain(q.correctChoice);
          } else {
            expect(q.targetHour).toBeGreaterThanOrEqual(1);
            expect(q.targetHour).toBeLessThanOrEqual(12);
            expect(q.targetMinute).toBeGreaterThanOrEqual(0);
            expect(q.targetMinute).toBeLessThanOrEqual(59);
            expect(formatClockTime(q.targetHour!, q.targetMinute!)).toBe(q.correctChoice);
          }

          // Independent reverse-verification by visual kind
          if (q.visual.kind === 'ruler') {
            expect(q.visual.startVal).toBeGreaterThanOrEqual(0);
            expect(q.visual.endVal).toBeGreaterThan(q.visual.startVal);
            expect(q.visual.endVal).toBeLessThanOrEqual(q.visual.maxUnits);
            const diff = q.visual.endVal - q.visual.startVal;
            if (q.visual.unit === 'in') {
              const quarters = Math.round(diff * 4);
              expect(q.correctChoice).toBe(formatMixedQuarterInches(quarters));
            } else {
              const half = Math.round(diff * 2);
              const expectedCm = half % 2 === 0 ? `${half / 2} cm` : `${(half / 2).toFixed(1)} cm`;
              expect(q.correctChoice).toBe(expectedCm);
            }
          }

          if (q.visual.kind === 'beaker') {
            const expectedTotal = q.visual.currentVal + (q.visual.addVal ?? 0);
            expect(q.visual.currentVal).toBeGreaterThan(0);
            expect(expectedTotal).toBeLessThanOrEqual(q.visual.maxVal);
            if (q.visual.unit === 'mL') {
              expect(q.correctChoice).toBe(`${expectedTotal} mL`);
            }
          }

          if (q.visual.kind === 'dial-scale') {
            expect(q.visual.value).toBeGreaterThan(0);
            expect(q.visual.value).toBeLessThanOrEqual(q.visual.maxVal);
            if (q.visual.unit === 'g') {
              expect(q.correctChoice).toBe(`${q.visual.value} g`);
            }
          }

          if (q.visual.kind === 'conversion-ladder') {
            // Verify equationReveal ends with exact correctChoice
            expect(q.visual.equationReveal.endsWith(q.correctChoice)).toBe(true);
          }
        }
      }
    }

    expect(totalChecked).toBe(8 * 200 * CLOCK_MEASURE_RUN_SIZE);
  });

  it('integrates with completeQuestRun, stamps Daily Math + Adventure Map, and round-trips v1 JSON safely', () => {
    expect(calculateClockMeasureTokens(5, 5)).toBe(30);
    expect(calculateClockMeasureTokens(0, 5)).toBe(10);

    let state = createInitialPlayerState('Chloe');
    const res = completeQuestRun(state, {
      subjectId: 'math',
      kind: 'math',
      questSetId: 'clock-basic',
      questSetTitle: 'Clock & Measure: Read the Clock (5-Min & Quarters)',
      completionField: 'completedClockMeasureIds',
      rawTokensEarned: 30,
      accuracyPct: 100,
      todayKey: '2026-11-24',
      wordOutcomes: [{ word: 'Clock: Read 2:55', subjectId: 'math', tier: 1, outcome: 'missed' }],
    });
    state = res.state;

    expect(state.completedClockMeasureIds).toContain('clock-basic');
    expect(state.dailyQuest?.completedSubjects).toContain('math');
    expect(state.weeklyAdventure?.stampedDates).toContain('2026-11-24');
    expect(Object.values(state.wordMastery).some((r) => r.word === 'Clock: Read 2:55' && r.missed === 1)).toBe(true);

    // Round-trip v1 JSON + strip unknown unit IDs
    const parsed = JSON.parse(exportPlayerStateJson(state));
    parsed.completedClockMeasureIds.push('fake-invalid-unit');
    const imported = importPlayerStateJson(JSON.stringify(parsed));
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.state.completedClockMeasureIds).toEqual(['clock-basic']);
    }
  });
});

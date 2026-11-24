import { describe, expect, it } from 'vitest';
import { awardMixedWarmupCompletion, createInitialPlayerState } from '../src/core/economy';
import {
  FOCUS_TRACK_CATALOG,
  MAX_WEEKLY_FOCUS_TRACKS,
  pickFocusRecommendation,
  sanitizeFocusTracks,
  toggleFocusTrack,
} from '../src/core/focusPlanner';
import { recordWordOutcome } from '../src/core/mastery';
import {
  buildDailyMixedWarmup,
  buildMistakeClinicSession,
  countClinicPatients,
  matchClockMeasureUnitFromSkillKey,
} from '../src/core/mixedWarmupEngine';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { CLOCK_MEASURE_UNITS } from '../src/subjects/math/clockMeasureEngine';

describe('Phase 10B — Weekly Focus Auto-Pilot & Clock/Measure Mistake Clinic Loop', () => {
  it('enforces max-2 track selection, sliding-window toggle, and strict whitelist sanitization + v1 JSON compat', () => {
    expect(FOCUS_TRACK_CATALOG).toHaveLength(5);
    expect(MAX_WEEKLY_FOCUS_TRACKS).toBe(2);

    // Toggle sequence: [] -> [clock-measure] -> [clock-measure, chinese-reading] -> [chinese-reading, logic-spatial]
    let tracks = toggleFocusTrack(undefined, 'clock-measure');
    expect(tracks).toEqual(['clock-measure']);
    tracks = toggleFocusTrack(tracks, 'chinese-reading');
    expect(tracks).toEqual(['clock-measure', 'chinese-reading']);
    tracks = toggleFocusTrack(tracks, 'logic-spatial');
    expect(tracks).toEqual(['chinese-reading', 'logic-spatial']);
    // Unselecting removes cleanly
    tracks = toggleFocusTrack(tracks, 'chinese-reading');
    expect(tracks).toEqual(['logic-spatial']);

    // Sanitizer strips invalid, duplicate, non-string, and >2 entries
    expect(
      sanitizeFocusTracks(['clock-measure', 'bogus-id', 'clock-measure', 'math-bar', 'english-ela', 123]),
    ).toEqual(['clock-measure', 'math-bar']);

    // Repository JSON export/import round-trip + v1 JSON backward compat
    const player = createInitialPlayerState('Chloe');
    player.weeklyFocusTracks = ['clock-measure', 'chinese-reading'];
    const imported = importPlayerStateJson(exportPlayerStateJson(player));
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.state.weeklyFocusTracks).toEqual(['clock-measure', 'chinese-reading']);
    }

    // Tampered JSON with invalid/excess tracks is sanitized strictly to max 2 valid
    const tampered = JSON.parse(exportPlayerStateJson(player));
    tampered.weeklyFocusTracks = ['bad', 'math-bar', 'math-bar', 'logic-spatial', 'english-ela'];
    const cleaned = importPlayerStateJson(JSON.stringify(tampered));
    expect(cleaned.ok).toBe(true);
    if (cleaned.ok) {
      expect(cleaned.state.weeklyFocusTracks).toEqual(['math-bar', 'logic-spatial']);
    }

    // Legacy v1 JSON without weeklyFocusTracks imports cleanly with undefined
    const legacy = JSON.parse(exportPlayerStateJson(player));
    delete legacy.weeklyFocusTracks;
    const restoredLegacy = importPlayerStateJson(JSON.stringify(legacy));
    expect(restoredLegacy.ok).toBe(true);
    if (restoredLegacy.ok) {
      expect(restoredLegacy.state.weeklyFocusTracks).toBeUndefined();
    }
  });

  it('picks deterministic uncompleted or least-recently-played focus quests across all 5 tracks', () => {
    const player = createInitialPlayerState('Chloe');
    expect(pickFocusRecommendation(player, 'english')).toBeNull();

    // 2 focus tracks: clock-measure + chinese-reading
    player.weeklyFocusTracks = ['clock-measure', 'chinese-reading'];
    // On math tab -> prefers clock-measure (1st uncompleted unit: clock-basic)
    const mathRec = pickFocusRecommendation(player, 'math');
    expect(mathRec?.trackId).toBe('clock-measure');
    expect(mathRec?.action.kind).toBe('clock-measure');
    if (mathRec?.action.kind === 'clock-measure') {
      expect(mathRec.action.unit.id).toBe('clock-basic');
    }

    // On chinese tab -> prefers chinese-reading
    const zhRec = pickFocusRecommendation(player, 'chinese');
    expect(zhRec?.trackId).toBe('chinese-reading');
    expect(zhRec?.action.kind).toBe('chinese-reading');

    // On english tab (neither selected track is english) -> picks 1st configured track (clock-measure)
    const enFallback = pickFocusRecommendation(player, 'english');
    expect(enFallback?.trackId).toBe('clock-measure');

    // Completing clock-basic advances recommendation to clock-exact
    player.completedClockMeasureIds = ['clock-basic'];
    const nextClock = pickFocusRecommendation(player, 'math');
    expect(nextClock?.action.kind).toBe('clock-measure');
    if (nextClock?.action.kind === 'clock-measure') {
      expect(nextClock.action.unit.id).toBe('clock-exact');
    }

    // Completing ALL 8 clock-measure units falls back to least-recently-played
    player.completedClockMeasureIds = CLOCK_MEASURE_UNITS.map((u) => u.id);
    player.runHistory = CLOCK_MEASURE_UNITS.filter((u) => u.id !== 'measure-ruler').map((u, idx) => ({
      id: `r-${idx}`,
      subjectId: 'math',
      questSetId: u.id,
      questSetTitle: u.title,
      completedAt: new Date(2026, 2, 1 + idx, 12, 0, 0).toISOString(),
      accuracyPct: 100,
      maxCombo: 5,
      tokensEarned: 25,
    }));
    const lrpClock = pickFocusRecommendation(player, 'math');
    expect(lrpClock?.action.kind).toBe('clock-measure');
    if (lrpClock?.action.kind === 'clock-measure') {
      expect(lrpClock.action.unit.id).toBe('measure-ruler');
    }

    // Remaining tracks: math-bar, english-ela, logic-spatial all produce valid actions
    for (const tid of ['math-bar', 'english-ela', 'logic-spatial'] as const) {
      player.weeklyFocusTracks = [tid];
      const rec = pickFocusRecommendation(player, 'english');
      expect(rec).not.toBeNull();
      expect(rec?.trackId).toBe(tid);
      expect(rec?.badgeZh).toBe('🎯 本週重點');
    }
  });

  it('closes the Clock & Measure Mistake Clinic loop: detects, generates visual MCQ, and heals mastery on correct answer', () => {
    // 1. All 8 Clock & Measure skillKey families map cleanly to their exact unitId
    expect(matchClockMeasureUnitFromSkillKey('Clock: Read 3:15')).toBe('clock-basic');
    expect(matchClockMeasureUnitFromSkillKey('Clock 1-Min: Set 7:23')).toBe('clock-exact');
    expect(matchClockMeasureUnitFromSkillKey('Elapsed: 2:10 to 3:05')).toBe('clock-elapsed');
    expect(matchClockMeasureUnitFromSkillKey('AM/PM: 11:30 AM + 45m')).toBe('clock-schedule');
    expect(matchClockMeasureUnitFromSkillKey('Ruler (in): Shifted 3 1/2 in')).toBe('measure-ruler');
    expect(matchClockMeasureUnitFromSkillKey('Unit Sense: Classroom Door')).toBe('measure-unit-sense');
    expect(matchClockMeasureUnitFromSkillKey('Beaker (mL): 350 mL')).toBe('measure-beaker-scale');
    expect(matchClockMeasureUnitFromSkillKey('Scale (lb): 4 1/2 lb')).toBe('measure-beaker-scale');
    expect(matchClockMeasureUnitFromSkillKey('Convert: 1 ft = 12 in')).toBe('measure-conversions');
    expect(matchClockMeasureUnitFromSkillKey('Unknown Skill')).toBeNull();

    // 2. Missed Clock & Measure skills show up in countClinicPatients & Mistake Clinic with ClockMeasureSvg spec
    let player = createInitialPlayerState('Chloe');
    player.wordMastery = recordWordOutcome(player.wordMastery, {
      word: 'Clock: Read 3:45',
      subjectId: 'math',
      tier: 1,
      outcome: 'missed',
    });
    player.wordMastery = recordWordOutcome(player.wordMastery, {
      word: 'Convert: 1 ft = 12 in',
      subjectId: 'math',
      tier: 3,
      outcome: 'missed',
    });

    expect(countClinicPatients(player)).toBe(2);

    const clinicItems = buildMistakeClinicSession(player, 20260305, 6);
    expect(clinicItems).toHaveLength(2);
    for (const item of clinicItems) {
      expect(item.subjectTag).toBe('math');
      expect(item.clockMeasureVisual).toBeDefined();
      expect(item.choices).toHaveLength(4);
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThan(4);
      expect(item.masteryRef?.kind).toBe('word');
    }

    // 3. Also surfaces in Daily Mixed Warmup
    const warmup = buildDailyMixedWarmup(player, 20260305);
    expect(warmup.some((i) => Boolean(i.clockMeasureVisual))).toBe(true);

    // Invalid trackId passed at runtime is safely ignored by toggleFocusTrack
    expect(toggleFocusTrack(['clock-measure'], 'bogus' as never)).toEqual(['clock-measure']);

    // Malformed runHistory does not throw when falling back to least-recently-played
    const malformedPlayer = createInitialPlayerState('Chloe');
    malformedPlayer.weeklyFocusTracks = ['clock-measure'];
    malformedPlayer.completedClockMeasureIds = CLOCK_MEASURE_UNITS.map((u) => u.id);
    (malformedPlayer as unknown as { runHistory: unknown }).runHistory = [null, { questSetId: 123 }];
    expect(() => pickFocusRecommendation(malformedPlayer, 'math')).not.toThrow();

    // Verify measure-conversions Mistake Clinic item never leaks conversion multiplier in subHint
    const convItem = clinicItems.find((i) => i.masteryRef?.kind === 'word' && i.masteryRef.word.startsWith('Convert:'));
    expect(convItem).toBeDefined();
    expect(convItem?.subHint).not.toMatch(/×\s*\d+|=\s*\d+/);

    // 4. Answering both clinic questions correctly advances correctFirstTry and graduates them out of 'tricky' once clean >= missed + 2
    let current = player;
    for (let round = 1; round <= 3; round += 1) {
      const healed = awardMixedWarmupCompletion(
        current,
        'mistake-clinic',
        clinicItems.map((item) => ({ correct: true, masteryRef: item.masteryRef })),
        `2026-03-0${4 + round}`,
      );
      expect(healed.passed).toBe(true);
      expect(healed.healedCount).toBe(2);
      current = healed.state;
    }
    expect(countClinicPatients(current)).toBe(0);
  });
});

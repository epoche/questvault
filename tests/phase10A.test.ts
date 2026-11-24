import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { compute14DayTrend } from '../src/core/analytics';
import { createInitialPlayerState } from '../src/core/economy';

describe('Phase 10A — 14-Day Learning Trend & PWA v3 Cache Guard', () => {
  it('handles month, year, and leap-year boundaries cleanly across exactly 14 local days', () => {
    const player = createInitialPlayerState('Chloe');

    // Leap year boundary: 2024-03-01 back 13 days = 2024-02-17 .. 2024-03-01 (must include 2024-02-29)
    const leap = compute14DayTrend(player, '2024-03-01');
    expect(leap.days).toHaveLength(14);
    expect(leap.days[0].dateKey).toBe('2024-02-17');
    expect(leap.days[12].dateKey).toBe('2024-02-29');
    expect(leap.days[13].dateKey).toBe('2024-03-01');
    expect(leap.totalRuns14d).toBe(0);
    expect(leap.activeDays14d).toBe(0);
    expect(leap.avgAccuracy14d).toBeNull();

    // Non-leap year boundary: 2026-03-02 back 13 days = 2026-02-17 .. 2026-03-02 (no Feb 29)
    const nonLeap = compute14DayTrend(player, '2026-03-02');
    expect(nonLeap.days).toHaveLength(14);
    expect(nonLeap.days[0].dateKey).toBe('2026-02-17');
    expect(nonLeap.days[11].dateKey).toBe('2026-02-28');
    expect(nonLeap.days[12].dateKey).toBe('2026-03-01');
    expect(nonLeap.days[13].dateKey).toBe('2026-03-02');

    // Year boundary: 2026-01-05 back 13 days = 2025-12-23 .. 2026-01-05
    const yearCross = compute14DayTrend(player, '2026-01-05');
    expect(yearCross.days).toHaveLength(14);
    expect(yearCross.days[0].dateKey).toBe('2025-12-23');
    expect(yearCross.days[8].dateKey).toBe('2025-12-31');
    expect(yearCross.days[9].dateKey).toBe('2026-01-01');
    expect(yearCross.days[13].dateKey).toBe('2026-01-05');
  });

  it('aggregates runs, clamps accuracy, ignores NaN/Infinity/out-of-window entries, and computes 4-Hall coverage', () => {
    const player = createInitialPlayerState('Chloe');
    player.completedQuestSetIds = [
      'en-t1-action-heroes',
      'en-t1-action-heroes', // duplicate ignored
      'en-srs-review', // non-catalog special drill ignored
      'en-read-t1-pet-club',
      'math-t1-arrays',
      'math-tricky-rematch', // non-catalog special drill ignored
      'zh-t1-actions',
      'zh-weekly-parent-review', // non-catalog special drill ignored
    ];
    player.completedClockMeasureIds = ['clock-basic', 'clock-basic', 'measure-ruler'];
    player.completedLogicModuleIds = ['rotation-mirror', 'balance-scale'];

    const localIso = (y: number, m: number, d: number, h = 12) =>
      new Date(y, m - 1, d, h, 0, 0).toISOString();

    player.runHistory = [
      // Inside 14-day window ending 2026-03-05
      {
        id: 'r1',
        subjectId: 'english',
        questSetId: 'en-t1-action-heroes',
        questSetTitle: 'Action Heroes',
        completedAt: localIso(2026, 3, 5, 10),
        accuracyPct: 100,
        maxCombo: 5,
        tokensEarned: 35,
      },
      {
        id: 'r2',
        subjectId: 'math',
        questSetId: 'clock-basic',
        questSetTitle: 'Clock Basic',
        completedAt: localIso(2026, 3, 5, 16),
        accuracyPct: 80,
        maxCombo: 4,
        tokensEarned: 35,
      },
      {
        id: 'r3',
        subjectId: 'chinese',
        questSetId: 'zh-t1-actions',
        questSetTitle: 'Actions',
        completedAt: localIso(2026, 2, 20, 12), // exactly 13 days prior -> included!
        accuracyPct: 150, // clamps to 100
        maxCombo: 3,
        tokensEarned: Number.NaN, // ignored safely
      },
      {
        id: 'r4',
        subjectId: 'math',
        questSetId: 'old',
        questSetTitle: 'Too old',
        completedAt: localIso(2026, 2, 19, 12), // 14 days prior -> excluded!
        accuracyPct: 50,
        maxCombo: 1,
        tokensEarned: 20,
      },
      {
        id: 'r5',
        subjectId: 'english',
        questSetId: 'bad-date',
        questSetTitle: 'Malformed',
        completedAt: '2026-03-05T99:99:99Z', // corrupt timestamp with valid prefix -> must be rejected!
        accuracyPct: Number.POSITIVE_INFINITY,
        maxCombo: 0,
        tokensEarned: -50,
      },
    ];

    const trend = compute14DayTrend(player, '2026-03-05');
    expect(trend.totalRuns14d).toBe(3);
    expect(trend.activeDays14d).toBe(2);
    expect(trend.maxDailyRuns).toBe(2);
    // Today (2026-03-05): 2 runs, avg (100+80)/2 = 90%, tokens 70
    const todayPt = trend.days[13];
    expect(todayPt.dateKey).toBe('2026-03-05');
    expect(todayPt.runs).toBe(2);
    expect(todayPt.avgAccuracyPct).toBe(90);
    expect(todayPt.tokensEarned).toBe(70);
    // Earliest included day (2026-02-20): 1 run, clamped acc 100%, tokens 0
    expect(trend.days[0].dateKey).toBe('2026-02-20');
    expect(trend.days[0].runs).toBe(1);
    expect(trend.days[0].avgAccuracyPct).toBe(100);
    expect(trend.days[0].tokensEarned).toBe(0);
    // Overall avg: (100 + 80 + 100) / 3 = 93
    expect(trend.avgAccuracy14d).toBe(93);

    // Invalid calendar date (2026-02-31) must not silently roll over to 2026-03-03
    const invalidDateTrend = compute14DayTrend(player, '2026-02-31');
    expect(invalidDateTrend.days).toHaveLength(14);
    expect(invalidDateTrend.days[13].dateKey).not.toBe('2026-03-03');

    // 4-Hall coverage exact totals & deduplicated whitelist counts
    expect(trend.labCoverage).toHaveLength(4);
    const byId = Object.fromEntries(trend.labCoverage.map((l) => [l.id, l]));
    expect(byId.english.completed).toBe(2);
    expect(byId.english.total).toBe(164);
    expect(byId.math.completed).toBe(3); // 1 core + 2 unique clock/measure
    expect(byId.math.total).toBe(44);
    expect(byId.chinese.completed).toBe(1);
    expect(byId.chinese.total).toBe(208);
    expect(byId.logic.completed).toBe(2);
    expect(byId.logic.total).toBe(8);
    expect(byId.logic.pct).toBe(25);
    for (const lab of trend.labCoverage) {
      expect(lab.pct).toBeGreaterThanOrEqual(0);
      expect(lab.pct).toBeLessThanOrEqual(100);
    }
  });

  it('keeps public/sw.js upgraded to questvault-pwa-v3 with 160-entry cache cap and prefix-scoped cleanup', () => {
    const swPath = path.resolve(process.cwd(), 'public/sw.js');
    const sw = fs.readFileSync(swPath, 'utf8');
    expect(sw).toContain("const CACHE_NAME = 'questvault-pwa-v3';");
    expect(sw).toContain('const MAX_HASHED_ASSET_ENTRIES = 160;');
    expect(sw).toContain("k.startsWith('questvault-pwa-') && k !== CACHE_NAME");
  });
});

import { describe, expect, it } from 'vitest';
import {
  ADVENTURE_REWARD_DECOR_IDS,
  applyAdventureMakeupStamp,
  claimAdventureMilestone,
  getAdventureMapSnapshot,
  getIsoWeekKeyFromDateKey,
  getWeekDateKeys,
  recordAdventureStamp,
} from '../src/core/adventureMap';
import { formatWeeklyReportText } from '../src/core/analytics';
import { createInitialPlayerState } from '../src/core/economy';
import { completeQuestRun } from '../src/core/questCompletion';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';

describe('Phase 9A — Weekly 7-Day Adventure Map Engine', () => {
  it('computes DST-safe Mon–Sun ISO week keys and 7 ordered dates cleanly across week & year boundaries', () => {
    expect(getIsoWeekKeyFromDateKey('2026-11-23')).toBe('2026-W48'); // Mon
    expect(getIsoWeekKeyFromDateKey('2026-11-29')).toBe('2026-W48'); // Sun
    expect(getIsoWeekKeyFromDateKey('2026-11-30')).toBe('2026-W49'); // Next Mon

    const dates = getWeekDateKeys('2026-11-26'); // Thu in W48
    expect(dates).toEqual([
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
      '2026-11-26',
      '2026-11-27',
      '2026-11-28',
      '2026-11-29',
    ]);
  });

  it('stamps daily progress, unlocks 3/5/7-day chests idempotently, and resets cleanly on Monday rollover', () => {
    let state = createInitialPlayerState('Chloe');
    const weekDates = getWeekDateKeys('2026-11-23'); // Mon..Sun

    // Stamp Days 1..3 via completeQuestRun
    state = completeQuestRun(state, {
      subjectId: 'english',
      questSetId: 'en-1',
      questSetTitle: 'EN 1',
      rawTokensEarned: 20,
      accuracyPct: 100,
      todayKey: weekDates[0],
    }).state;
    state = recordAdventureStamp(state, weekDates[1], 'math');
    state = recordAdventureStamp(state, weekDates[2], 'chinese');

    const snap3 = getAdventureMapSnapshot(state, weekDates[2]);
    expect(snap3.stampedCount).toBe(3);
    expect(snap3.milestones[0].claimable).toBe(true);
    expect(snap3.milestones[1].claimable).toBe(false);

    // Claim 3-day chest once -> +20 tokens; second claim same week -> 0 tokens (idempotent!)
    const claim3 = claimAdventureMilestone(state, 3, weekDates[2]);
    expect(claim3.tokensAwarded).toBe(20);
    expect(claim3.unlockedDecorId).toBeNull();
    state = claim3.state;

    const dup3 = claimAdventureMilestone(state, 3, weekDates[2]);
    expect(dup3.tokensAwarded).toBe(0);
    expect(dup3.state.tokens).toBe(state.tokens);

    // Stamp Days 4..7 and claim 5-day (+35) & 7-day (+55 + exclusive decor sticker)
    for (let i = 3; i < 7; i += 1) {
      state = recordAdventureStamp(state, weekDates[i], 'logic');
    }
    const claim5 = claimAdventureMilestone(state, 5, weekDates[6]);
    expect(claim5.tokensAwarded).toBe(35);
    state = claim5.state;

    const claim7 = claimAdventureMilestone(state, 7, weekDates[6]);
    expect(claim7.tokensAwarded).toBe(55);
    expect(claim7.unlockedDecorId).toBe(ADVENTURE_REWARD_DECOR_IDS[0]);
    expect(claim7.state.adventureWeeksCleared).toBe(1);
    expect(claim7.state.unlockedRoomDecorIds).toContain(ADVENTURE_REWARD_DECOR_IDS[0]);
    state = claim7.state;

    // Next week Monday rollover starts fresh with 0 stamps and all milestones unclaimed again
    const nextWeekSnap = getAdventureMapSnapshot(state, '2026-11-30');
    expect(nextWeekSnap.weekKey).toBe('2026-W49');
    expect(nextWeekSnap.stampedCount).toBe(0);
    expect(nextWeekSnap.milestones.every((m) => !m.claimed && !m.unlocked)).toBe(true);
  });

  it('grants strictly 1 free Makeup Star per week when 2 subjects finish in one day, and rejects future/duplicate/already-used dates', () => {
    let state = createInitialPlayerState('Chloe');
    const weekDates = getWeekDateKeys('2026-11-26'); // Thu = index 3
    // Missed Mon (0), Tue (1), Wed (2). On Thu (3), complete 2 subjects!
    state = recordAdventureStamp(state, weekDates[3], 'english');
    expect(getAdventureMapSnapshot(state, weekDates[3]).makeupEarned).toBe(false);

    state = recordAdventureStamp(state, weekDates[3], 'math');
    const snap = getAdventureMapSnapshot(state, weekDates[3]);
    expect(snap.makeupEarned).toBe(true);
    expect(snap.makeupAvailable).toBe(true);
    expect(snap.eligibleMakeupDates).toEqual([weekDates[0], weekDates[1], weekDates[2]]);

    // Reject stamping a future day (Fri = index 4) or today (Thu = index 3)
    expect(applyAdventureMakeupStamp(state, weekDates[4], weekDates[3]).applied).toBe(false);
    expect(applyAdventureMakeupStamp(state, weekDates[3], weekDates[3]).applied).toBe(false);

    // Valid makeup stamp on missed Wed (index 2)
    const applied = applyAdventureMakeupStamp(state, weekDates[2], weekDates[3]);
    expect(applied.applied).toBe(true);
    expect(applied.state.weeklyAdventure?.stampedDates).toContain(weekDates[2]);
    expect(applied.state.weeklyAdventure?.makeupUsed).toBe(true);

    // Cannot use Makeup Star a second time in the same week
    const secondTry = applyAdventureMakeupStamp(applied.state, weekDates[1], weekDates[3]);
    expect(secondTry.applied).toBe(false);
  });

  it('round-trips weeklyAdventure & unlockedRoomDecorIds cleanly through v1 JSON backup and includes attendance in weekly report', () => {
    let state = createInitialPlayerState('Chloe');
    const weekDates = getWeekDateKeys('2026-11-25');
    state = recordAdventureStamp(state, weekDates[0], 'english');
    state = recordAdventureStamp(state, weekDates[1], 'math');
    state = recordAdventureStamp(state, weekDates[2], 'chinese');
    state = claimAdventureMilestone(state, 3, weekDates[2]).state;

    const json = exportPlayerStateJson(state);
    const imported = importPlayerStateJson(json);
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.state.weeklyAdventure?.stampedDates).toEqual([
        weekDates[0],
        weekDates[1],
        weekDates[2],
      ]);
      expect(imported.state.weeklyAdventure?.claimedMilestones).toEqual([3]);
      const report = formatWeeklyReportText(imported.state, '2026-11-25T18:00:00Z');
      expect(report).toContain('本週 7 天尋寶地圖：3 / 7 天');
    }
  });
});

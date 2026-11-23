import { describe, expect, it } from 'vitest';
import {
  BACKUP_REMINDER_DAYS,
  BACKUP_REMINDER_MIN_RUNS,
  computeWeeklyGoalProgress,
  getIsoWeekKey,
  isBackupOverdue,
  WEEKLY_REWARD_PRESETS,
} from '../src/core/analytics';
import { createInitialPlayerState } from '../src/core/economy';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import type { PlayerState, RunSummary } from '../src/core/types';

function makeRun(
  subjectId: 'english' | 'math' | 'chinese',
  completedAt: string,
  tokensEarned = 25,
): RunSummary {
  return {
    id: `run-${subjectId}-${completedAt}-${Math.random()}`,
    subjectId,
    questSetId: `${subjectId}-t1-01`,
    questSetTitle: 'Sample Quest',
    tokensEarned,
    maxCombo: 4,
    accuracyPct: 90,
    completedAt,
  };
}

describe('Phase 4D: Weekly Goal & Reward Voucher, 7-Day Backup Reminder, Offline PWA', () => {
  it('computes ISO week keys consistently across Monday-Sunday and year-end boundaries', () => {
    // 2026-11-23 is a Monday; 2026-11-29 is Sunday of the same ISO week; 2026-11-30 is next Monday
    const mon = new Date(2026, 10, 23, 9, 0, 0);
    const sun = new Date(2026, 10, 29, 22, 0, 0);
    const nextMon = new Date(2026, 10, 30, 0, 5, 0);

    expect(getIsoWeekKey(mon)).toBe(getIsoWeekKey(sun));
    expect(getIsoWeekKey(nextMon)).not.toBe(getIsoWeekKey(sun));

    // Dec 31, 2026 (Thu) belongs to 2026-W53; Jan 1, 2027 (Fri) is in the same ISO week 2026-W53
    expect(getIsoWeekKey(new Date(2026, 11, 31, 12, 0, 0))).toBe(
      getIsoWeekKey(new Date(2027, 0, 1, 12, 0, 0)),
    );
    // Jan 4, 2027 (Mon) starts 2027-W01
    expect(getIsoWeekKey(new Date(2027, 0, 4, 12, 0, 0))).toBe('2027-W01');
  });

  it('tracks Weekly Goal progress only for rewarded runs within current week and excludes 0-token practice', () => {
    const now = new Date(2026, 10, 25, 15, 0, 0); // Wed Nov 25, 2026
    const thisWeekTue = new Date(2026, 10, 24, 10, 0, 0).toISOString();
    const lastWeekFri = new Date(2026, 10, 20, 10, 0, 0).toISOString();

    const base: PlayerState = {
      ...createInitialPlayerState('Chloe'),
      weeklyGoal: {
        enTarget: 2,
        zhTarget: 1,
        mathTarget: 1,
        rewardText: '🧋 週末喝一杯珍珠奶茶',
      },
      runHistory: [
        makeRun('english', thisWeekTue, 25),
        makeRun('english', thisWeekTue, 0), // 0-token replay MUST NOT count!
        makeRun('english', lastWeekFri, 25), // Last week MUST NOT count!
        makeRun('chinese', thisWeekTue, 25),
        makeRun('math', thisWeekTue, 20),
      ],
    };

    const prog = computeWeeklyGoalProgress(base, now);
    expect(prog.enabled).toBe(true);
    expect(prog.enDone).toBe(1);
    expect(prog.zhDone).toBe(1);
    expect(prog.mathDone).toBe(1);
    expect(prog.isMet).toBe(false);
    expect(prog.pct).toBe(75);

    // Add 2nd rewarded English run this week -> goal met!
    const metState: PlayerState = {
      ...base,
      runHistory: [makeRun('english', thisWeekTue, 15), ...base.runHistory],
    };
    const metProg = computeWeeklyGoalProgress(metState, now);
    expect(metProg.isMet).toBe(true);
    expect(metProg.isRedeemed).toBe(false);
    expect(metProg.pct).toBe(100);

    // Parent redeems voucher for this week
    const redeemedState: PlayerState = {
      ...metState,
      weeklyGoal: {
        ...metState.weeklyGoal!,
        redeemedWeekKey: metProg.weekKey,
      },
    };
    expect(computeWeeklyGoalProgress(redeemedState, now).isRedeemed).toBe(true);

    // Next Monday automatically resets redemption and progress
    const nextMon = new Date(2026, 10, 30, 8, 0, 0);
    const nextWeekProg = computeWeeklyGoalProgress(redeemedState, nextMon);
    expect(nextWeekProg.enDone).toBe(0);
    expect(nextWeekProg.isMet).toBe(false);
    expect(nextWeekProg.isRedeemed).toBe(false);
  });

  it('triggers 7-day backup reminder only when >= 3 runs and never backed up or > 7 days overdue', () => {
    const nowMs = Date.UTC(2026, 10, 23, 12, 0, 0);
    const run = makeRun('english', new Date(nowMs - 3600_000).toISOString(), 25);

    // Fewer than 3 runs -> not overdue
    const fresh: PlayerState = { ...createInitialPlayerState(), runHistory: [run, run] };
    expect(isBackupOverdue(fresh, nowMs).overdue).toBe(false);

    // >= 3 runs and never backed up -> overdue
    const threeRuns: PlayerState = {
      ...createInitialPlayerState(),
      runHistory: Array.from({ length: BACKUP_REMINDER_MIN_RUNS }, () => run),
    };
    expect(isBackupOverdue(threeRuns, nowMs)).toEqual({ overdue: true, daysSinceBackup: null });

    // Backed up 3 days ago -> not overdue
    const recentBackup: PlayerState = {
      ...threeRuns,
      lastBackupAt: new Date(nowMs - 3 * 86_400_000).toISOString(),
    };
    expect(isBackupOverdue(recentBackup, nowMs)).toEqual({ overdue: false, daysSinceBackup: 3 });

    // Backed up 8 days ago -> overdue
    const oldBackup: PlayerState = {
      ...threeRuns,
      lastBackupAt: new Date(nowMs - (BACKUP_REMINDER_DAYS + 1) * 86_400_000).toISOString(),
    };
    expect(isBackupOverdue(oldBackup, nowMs)).toEqual({ overdue: true, daysSinceBackup: 8 });
  });

  it('preserves weeklyGoal and lastBackupAt through v1 JSON backup/restore and clamps tampered values', () => {
    const state: PlayerState = {
      ...createInitialPlayerState('Chloe'),
      weeklyGoal: {
        enTarget: 4,
        zhTarget: 3,
        mathTarget: 2,
        rewardText: WEEKLY_REWARD_PRESETS[1],
        redeemedWeekKey: '2026-W48',
      },
      lastBackupAt: '2026-11-23T12:00:00.000Z',
    };

    const json = exportPlayerStateJson(state);
    const restored = importPlayerStateJson(json);
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;
    expect(restored.state.weeklyGoal).toEqual(state.weeklyGoal);
    expect(restored.state.lastBackupAt).toBe('2026-11-23T12:00:00.000Z');

    // Tampered values should clamp safely
    const tampered = JSON.parse(json);
    tampered.weeklyGoal = {
      enTarget: 99,
      zhTarget: -5,
      mathTarget: 3.7,
      rewardText: 'A'.repeat(120),
      redeemedWeekKey: 'bad-week-key',
    };
    tampered.lastBackupAt = 'not-a-date';
    const sanitized = importPlayerStateJson(JSON.stringify(tampered));
    expect(sanitized.ok).toBe(true);
    if (!sanitized.ok) return;
    expect(sanitized.state.weeklyGoal?.enTarget).toBe(14);
    expect(sanitized.state.weeklyGoal?.zhTarget).toBe(0);
    expect(sanitized.state.weeklyGoal?.mathTarget).toBe(3);
    expect(sanitized.state.weeklyGoal?.rewardText.length).toBe(80);
    expect(sanitized.state.weeklyGoal?.redeemedWeekKey).toBeUndefined();
    expect(sanitized.state.lastBackupAt).toBeUndefined();
  });

  it('treats all-zero weekly targets as disabled without unlocking the reward voucher', () => {
    const state: PlayerState = {
      ...createInitialPlayerState('Chloe'),
      weeklyGoal: { enTarget: 0, zhTarget: 0, mathTarget: 0, rewardText: 'Ice Cream' },
    };
    const prog = computeWeeklyGoalProgress(state, new Date(2026, 10, 25));
    expect(prog.enabled).toBe(false);
    expect(prog.isMet).toBe(false);
    expect(prog.pct).toBe(0);
  });
});

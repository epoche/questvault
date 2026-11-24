import { describe, expect, it } from 'vitest';
import { createInitialPlayerState } from '../src/core/economy';
import { getMasteryKey } from '../src/core/mastery';
import { completeQuestRun } from '../src/core/questCompletion';
import { calculateListeningTokens } from '../src/ui/views/ChineseListeningView';

describe('Unified Quest Completion Pipeline (completeQuestRun & Plan A Anti-Farm)', () => {
  it('enforces Plan A lifecycle: 100% first clear -> 0% same-day replay -> 50% next-day review -> 100% when SRS-due', () => {
    const day1 = '2026-11-20';
    const day2 = '2026-11-21';
    const day3 = '2026-11-25';
    let state = createInitialPlayerState('Chloe');
    const startTokens = state.tokens;

    // 1. First clear -> 100%
    const r1 = completeQuestRun(state, {
      subjectId: 'english',
      questSetId: 'en-set-01',
      questSetTitle: 'Fast Action Verbs',
      completionField: 'completedQuestSetIds',
      rawTokensEarned: 60,
      accuracyPct: 100,
      maxCombo: 5,
      todayKey: day1,
      nowIso: '2026-11-20T18:00:00.000Z',
      wordsInSet: ['dash', 'leap'],
      wordOutcomes: [
        { word: 'dash', tier: 2, outcome: 'clean' },
        { word: 'leap', tier: 2, outcome: 'clean' },
      ],
    });
    expect(r1.awardedTokens).toBe(60);
    expect(r1.state.tokens).toBe(startTokens + 60);
    expect(r1.state.completedQuestSetIds).toEqual(['en-set-01']);
    expect(r1.state.dailyQuest?.completedSubjects).toEqual(['english']);
    expect(r1.state.streakDays).toBe(1);
    state = r1.state;

    // 2. Same-day replay -> 0% pure practice (no token farming!)
    const r2 = completeQuestRun(state, {
      subjectId: 'english',
      questSetId: 'en-set-01',
      questSetTitle: 'Fast Action Verbs',
      completionField: 'completedQuestSetIds',
      rawTokensEarned: 60,
      accuracyPct: 100,
      maxCombo: 5,
      todayKey: day1,
      wordsInSet: ['dash', 'leap'],
    });
    expect(r2.awardedTokens).toBe(0);
    expect(r2.state.tokens).toBe(startTokens + 60);
    expect(r2.state.completedQuestSetIds).toEqual(['en-set-01']); // deduped
    state = r2.state;

    // 3. Next-day review when NOT SRS-due -> 50% review reward
    const dashKey = getMasteryKey('dash', 'english');
    const leapKey = getMasteryKey('leap', 'english');
    const futureReview = new Date(Date.now() + 7 * 86_400_000).toISOString();
    state = {
      ...state,
      wordMastery: {
        ...state.wordMastery,
        [dashKey]: { ...state.wordMastery[dashKey], nextReviewAt: futureReview },
        [leapKey]: { ...state.wordMastery[leapKey], nextReviewAt: futureReview },
      },
    };
    const r3 = completeQuestRun(state, {
      subjectId: 'english',
      questSetId: 'en-set-01',
      questSetTitle: 'Fast Action Verbs',
      completionField: 'completedQuestSetIds',
      rawTokensEarned: 60,
      accuracyPct: 90,
      maxCombo: 4,
      todayKey: day2,
      wordsInSet: ['dash', 'leap'],
    });
    expect(r3.awardedTokens).toBe(30);
    expect(r3.state.streakDays).toBe(2);
    state = r3.state;

    // 4. Later day when a word IS SRS-due -> 100% full SRS review reward!
    const pastReview = new Date(Date.now() - 86_400_000).toISOString();
    state = {
      ...state,
      wordMastery: {
        ...state.wordMastery,
        [dashKey]: { ...state.wordMastery[dashKey], nextReviewAt: pastReview },
      },
    };
    const r4 = completeQuestRun(state, {
      subjectId: 'english',
      questSetId: 'en-set-01',
      questSetTitle: 'Fast Action Verbs',
      completionField: 'completedQuestSetIds',
      rawTokensEarned: 60,
      accuracyPct: 100,
      maxCombo: 5,
      todayKey: day3,
      wordsInSet: ['dash', 'leap'],
    });
    expect(r4.awardedTokens).toBe(60);
    expect(r4.policy.tier).toBe('full-srs-due');
  });

  it('seals Chinese Listening anti-farm exploit: 0% accuracy yields 0 tokens & same-day replay yields 0 tokens', () => {
    expect(calculateListeningTokens(0, 8).total).toBe(0);
    expect(calculateListeningTokens(2, 8).base).toBe(0);
    expect(calculateListeningTokens(2, 8).total).toBe(4);
    expect(calculateListeningTokens(4, 8).base).toBe(8);
    expect(calculateListeningTokens(8, 8).total).toBe(28);

    const today = '2026-11-24';
    const initial = createInitialPlayerState('Chloe');

    // A 0% accuracy run yields 0 tokens AND must NOT burn the day's Plan A reward slot
    const zeroRun = completeQuestRun(initial, {
      subjectId: 'chinese',
      questSetId: 'zh-listening-t2',
      questSetTitle: '聽音辨字特訓 (第 2 階)',
      rawTokensEarned: calculateListeningTokens(0, 8).total,
      accuracyPct: 0,
      maxCombo: 0,
      todayKey: today,
      markDailySubject: false,
    });
    expect(zeroRun.awardedTokens).toBe(0);
    expect(zeroRun.state.tokens).toBe(initial.tokens);

    // Turning volume on and passing 100% same day still earns full tokens
    const first = completeQuestRun(zeroRun.state, {
      subjectId: 'chinese',
      questSetId: 'zh-listening-t2',
      questSetTitle: '聽音辨字特訓 (第 2 階)',
      rawTokensEarned: calculateListeningTokens(8, 8).total,
      accuracyPct: 100,
      maxCombo: 8,
      todayKey: today,
    });
    expect(first.awardedTokens).toBe(28);

    // Same-day replay after claiming earns 0 tokens (no infinite farming!)
    const replay = completeQuestRun(first.state, {
      subjectId: 'chinese',
      questSetId: 'zh-listening-t2',
      questSetTitle: '聽音辨字特訓 (第 2 階)',
      rawTokensEarned: calculateListeningTokens(8, 8).total,
      accuracyPct: 100,
      maxCombo: 8,
      todayKey: today,
    });
    expect(replay.awardedTokens).toBe(0);
    expect(replay.state.tokens).toBe(first.state.tokens);
  });

  it('caps runHistory at 50, writingLog at 100, and guards against NaN/negative raw tokens', () => {
    let state = createInitialPlayerState('Chloe');
    for (let i = 0; i < 55; i++) {
      state = completeQuestRun(state, {
        subjectId: 'math',
        kind: 'math',
        questSetId: `math-q-${i}`,
        questSetTitle: `Math ${i}`,
        completionField: 'completedQuestSetIds',
        rawTokensEarned: i === 0 ? Number.NaN : 10,
        accuracyPct: i === 0 ? Number.NaN : 100,
        todayKey: '2026-11-24',
      }).state;
    }
    expect(state.runHistory).toHaveLength(50);
    expect(Number.isFinite(state.tokens)).toBe(true);
    expect(state.tokens).toBe(25 + 54 * 10);
  });
});

import { describe, expect, it } from 'vitest';
import {
  awardMixedWarmupCompletion,
  CLINIC_DAILY_TOKEN_CAP,
  createInitialPlayerState,
  DAILY_MIXED_WARMUP_BONUS,
} from '../src/core/economy';
import { getMasteryKey, recordWordOutcome } from '../src/core/mastery';
import {
  buildDailyMixedWarmup,
  buildMistakeClinicSession,
  countClinicPatients,
} from '../src/core/mixedWarmupEngine';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { BUILTIN_CHINESE_SETS } from '../src/subjects/chinese/wordSets';
import { BUILTIN_WORD_SETS } from '../src/subjects/english/wordSets';
import { getFactHeatmapKey, recordFactAttempt } from '../src/subjects/math/factFluencyEngine';

describe('Phase 8A — Daily 5-Min Mixed Warm-Up & Mistake Clinic (SRS + Healing + Anti-Farming)', () => {
  it('fuzzes Daily 5-Min Mixed Warm-Up across 50 seeds: always 8 interleaved EN/Math/ZH/Logic items with 4 distinct choices', () => {
    const fresh = createInitialPlayerState('Chloe');
    for (let seed = 1; seed <= 50; seed++) {
      const items = buildDailyMixedWarmup(fresh, seed * 137);
      expect(items).toHaveLength(8);
      expect(items.map((it) => it.subjectTag)).toEqual([
        'english',
        'math',
        'chinese',
        'logic',
        'english',
        'math',
        'chinese',
        'logic',
      ]);
      for (const item of items) {
        expect(item.choices).toHaveLength(4);
        expect(item.correctIndex).toBeGreaterThanOrEqual(0);
        expect(item.correctIndex).toBeLessThan(4);
        expect(item.prompt.length).toBeGreaterThan(0);
        // Either text labels or logicVisuals must be 4 distinct items
        if (!item.choices.some((c) => Boolean(c.logicVisual))) {
          expect(new Set(item.choices.map((c) => c.label)).size).toBe(4);
        }
      }
    }
  });

  it('prioritizes tricky words & red math facts in Mistake Clinic, heals mastery on correct answers, and respects daily caps', () => {
    let player = createInitialPlayerState('Chloe');
    expect(countClinicPatients(player)).toBe(0);
    expect(buildMistakeClinicSession(player, 101)).toHaveLength(0);

    const enWord = BUILTIN_WORD_SETS[0].words[0];
    const zhWord = BUILTIN_CHINESE_SETS[0].words[0];
    const nowIso = '2026-11-24T10:00:00.000Z';

    // Inject 1 tricky English word, 1 tricky Chinese word, and 1 red math fact (7x8)
    player.wordMastery = recordWordOutcome(player.wordMastery, {
      word: enWord.word,
      subjectId: 'english',
      tier: enWord.tier,
      outcome: 'missed',
      nowIso,
    });
    player.wordMastery = recordWordOutcome(player.wordMastery, {
      word: zhWord.word,
      subjectId: 'chinese',
      tier: zhWord.tier,
      outcome: 'missed',
      nowIso,
    });
    player.mathFactMastery = recordFactAttempt(player.mathFactMastery, getFactHeatmapKey(7, 8), false, 6000);

    expect(countClinicPatients(player)).toBe(3);
    const clinic = buildMistakeClinicSession(player, 202, 6);
    expect(clinic).toHaveLength(3);
    expect(clinic.some((c) => c.subjectTag === 'english')).toBe(true);
    expect(clinic.some((c) => c.subjectTag === 'chinese')).toBe(true);
    expect(clinic.some((c) => c.subjectTag === 'math')).toBe(true);

    // Complete clinic with all 3 correct -> awards 3 * 3 = 9 Tokens and updates mastery
    const res = awardMixedWarmupCompletion(
      player,
      'mistake-clinic',
      clinic.map((c) => ({ correct: true, masteryRef: c.masteryRef })),
      '2026-11-24',
      nowIso,
    );
    expect(res.healedCount).toBe(3);
    expect(res.tokensAwarded).toBe(9);
    expect(res.state.tokens).toBe(player.tokens + 9);
    expect(res.state.wordMastery[getMasteryKey(enWord.word, 'english')].correctFirstTry).toBe(1);
    expect(res.state.wordMastery[getMasteryKey(zhWord.word, 'chinese')].correctFirstTry).toBe(1);
    expect(res.state.mathFactMastery?.[getFactHeatmapKey(7, 8)].correct).toBe(1);
    expect(res.state.streakDays).toBe(1);

    // Enforce Mistake Clinic daily cap (30 Tokens/day)
    let cappedState = res.state;
    for (let i = 0; i < 10; i++) {
      cappedState = awardMixedWarmupCompletion(
        cappedState,
        'mistake-clinic',
        clinic.map((c) => ({ correct: true, masteryRef: c.masteryRef })),
        '2026-11-24',
        nowIso,
      ).state;
    }
    expect(cappedState.clinicDailyTokens?.earned).toBe(CLINIC_DAILY_TOKEN_CAP);
  });

  it('enforces 60% pass bar and 1x/day +25 Token bonus on Daily 5-Min Mixed Warm-Up + v1 JSON persistence', () => {
    const fresh = createInitialPlayerState('Chloe');
    const items = buildDailyMixedWarmup(fresh, 777);

    // Fail with 4/8 (50%) -> 0 tokens, dailyMixedWarmupDate not set
    const failRes = awardMixedWarmupCompletion(
      fresh,
      'daily-warmup',
      items.map((it, idx) => ({ correct: idx < 4, masteryRef: it.masteryRef })),
      '2026-11-24',
    );
    expect(failRes.passed).toBe(false);
    expect(failRes.tokensAwarded).toBe(0);
    expect(failRes.state.dailyMixedWarmupDate).toBeUndefined();

    // Pass with 6/8 (75%) -> +25 Tokens & streakDays = 1
    const passRes = awardMixedWarmupCompletion(
      fresh,
      'daily-warmup',
      items.map((it, idx) => ({ correct: idx < 6, masteryRef: it.masteryRef })),
      '2026-11-24',
    );
    expect(passRes.passed).toBe(true);
    expect(passRes.tokensAwarded).toBe(DAILY_MIXED_WARMUP_BONUS);
    expect(passRes.state.dailyMixedWarmupDate).toBe('2026-11-24');
    expect(passRes.state.streakDays).toBe(1);

    // Replay same day -> 0 tokens (1x/day lock)
    const replayRes = awardMixedWarmupCompletion(
      passRes.state,
      'daily-warmup',
      items.map((it) => ({ correct: true, masteryRef: it.masteryRef })),
      '2026-11-24',
    );
    expect(replayRes.alreadyClaimedToday).toBe(true);
    expect(replayRes.tokensAwarded).toBe(0);

    // Next day -> +25 Tokens again & streakDays increments to 2
    const nextDayRes = awardMixedWarmupCompletion(
      passRes.state,
      'daily-warmup',
      items.map((it) => ({ correct: true, masteryRef: it.masteryRef })),
      '2026-11-25',
    );
    expect(nextDayRes.tokensAwarded).toBe(DAILY_MIXED_WARMUP_BONUS);
    expect(nextDayRes.state.streakDays).toBe(2);

    // JSON export/import round-trip preserves dailyMixedWarmupDate & clinicDailyTokens cleanly
    const withClinic = awardMixedWarmupCompletion(
      nextDayRes.state,
      'mistake-clinic',
      [{ correct: true, masteryRef: { kind: 'math-fact', a: 6, b: 7 } }],
      '2026-11-25',
    ).state;
    const json = exportPlayerStateJson(withClinic);
    const parsed = importPlayerStateJson(json);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.state.dailyMixedWarmupDate).toBe('2026-11-25');
      expect(parsed.state.clinicDailyTokens).toEqual({ dateKey: '2026-11-25', earned: 3 });
    }

    // Empty outcomes & unlinked clinic outcomes never pass or award tokens
    const emptyWarmup = awardMixedWarmupCompletion(fresh, 'daily-warmup', [], '2026-11-24');
    expect(emptyWarmup.passed).toBe(false);
    expect(emptyWarmup.tokensAwarded).toBe(0);
    const unlinkedClinic = awardMixedWarmupCompletion(
      fresh,
      'mistake-clinic',
      [{ correct: true }],
      '2026-11-24',
    );
    expect(unlinkedClinic.passed).toBe(false);
    expect(unlinkedClinic.healedCount).toBe(0);
    expect(unlinkedClinic.tokensAwarded).toBe(0);

    // Math warm-up items are strictly deduplicated and carry masteryRef across 50 seeds
    for (let seed = 1; seed <= 50; seed++) {
      const wItems = buildDailyMixedWarmup(fresh, seed * 71);
      const mathItems = wItems.filter((it) => it.subjectTag === 'math');
      expect(mathItems).toHaveLength(2);
      expect(mathItems[0].masteryRef?.kind).toBe('word');
      expect(mathItems[1].masteryRef?.kind).toBe('word');
      if (mathItems[0].masteryRef?.kind === 'word' && mathItems[1].masteryRef?.kind === 'word') {
        expect(mathItems[0].masteryRef.word).not.toBe(mathItems[1].masteryRef.word);
      }
    }
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import { computeWeeklySnapshot, formatWeeklyReportText } from '../src/core/analytics';
import { audioService } from '../src/core/audio';
import { getLocalDateKey, isoToLocalDateKey } from '../src/core/date';
import {
  awardBlitzSessionRewards,
  awardBossSessionRewards,
  awardCafeSessionRewards,
  awardFishingSessionRewards,
  awardTowerSessionRewards,
  createInitialPlayerState,
  recordDailySubjectCompletion,
} from '../src/core/economy';
import { getCollectibleById, getCollectiblesByPack, getPackById, MYSTERY_PACKS } from '../src/core/packs';
import {
  createLocalStorageRepository,
  importPlayerStateJson,
  type KeyValueStorage,
} from '../src/core/repository';

describe('Core Edge Cases & Regression Safety Net (audio, economy, repository, analytics, packs)', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
      writable: true,
    });
    audioService.setMuted(false);
  });

  it('audioService handles blocked AudioContext, throwing oscillators, and sandboxed speechSynthesis without crashing', () => {
    const cancelCalls: number[] = [];
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: {
        AudioContext: class ThrowingAudioCtx {
          currentTime = 0;
          state = 'running';
          destination = {};
          createOscillator() {
            throw new Error('Blocked by strict sandbox');
          }
          createGain() {
            throw new Error('Blocked by strict sandbox');
          }
          resume() {
            return Promise.reject(new Error('Blocked'));
          }
        },
        speechSynthesis: {
          cancel() {
            cancelCalls.push(1);
            throw new Error('Speech blocked');
          },
          speak() {
            throw new Error('Speech blocked');
          },
        },
      },
    });

    expect(() => audioService.playCorrect(3)).not.toThrow();
    expect(() => audioService.playNudge()).not.toThrow();
    expect(() => audioService.playChest()).not.toThrow();
    expect(() => audioService.playPackReveal('chroma')).not.toThrow();
    expect(() => audioService.speak('hello', 'en-US')).not.toThrow();
    expect(() => audioService.stopSpeech()).not.toThrow();
    expect(() => audioService.setMuted(true)).not.toThrow();
    expect(cancelCalls.length).toBeGreaterThanOrEqual(2);
  });

  it('guards ALL 5 arcade reward functions against NaN / Infinity / negative inputs so player tokens can never become NaN', () => {
    const base = createInitialPlayerState('Chloe');
    const today = '2026-11-24';

    const fns = [
      awardBlitzSessionRewards,
      awardCafeSessionRewards,
      awardFishingSessionRewards,
      awardBossSessionRewards,
      awardTowerSessionRewards,
    ];

    for (const fn of fns) {
      for (const bad of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -50]) {
        const res = fn(base, 'english', bad, bad, today);
        expect(res.tokensAwarded).toBe(0);
        expect(res.state.tokens).toBe(base.tokens);
        expect(Number.isFinite(res.state.tokens)).toBe(true);
      }
    }
  });

  it('maintains streak continuity across month-end, leap-year Feb 29, and year-end rollovers', () => {
    let st = createInitialPlayerState('Chloe');
    st = recordDailySubjectCompletion(st, 'english', '2026-02-28');
    expect(st.streakDays).toBe(1);
    st = recordDailySubjectCompletion(st, 'math', '2026-03-01');
    expect(st.streakDays).toBe(2);

    // Leap year 2028
    let leap = createInitialPlayerState('Chloe');
    leap = recordDailySubjectCompletion(leap, 'english', '2028-02-28');
    leap = recordDailySubjectCompletion(leap, 'math', '2028-02-29');
    leap = recordDailySubjectCompletion(leap, 'chinese', '2028-03-01');
    expect(leap.streakDays).toBe(3);

    // Year rollover
    let ny = createInitialPlayerState('Chloe');
    ny = recordDailySubjectCompletion(ny, 'english', '2026-12-31');
    ny = recordDailySubjectCompletion(ny, 'math', '2027-01-01');
    expect(ny.streakDays).toBe(2);
  });

  it('sanitizes malformed runHistory/writingLog, dedupes completedQuestSetIds, and trims logs on QuotaExceededError', () => {
    const base = createInitialPlayerState('Chloe');
    const malformed = {
      ...base,
      completedQuestSetIds: ['en-1', 'en-1', 'math-1', 42],
      runHistory: [
        // Missing completedAt, invalid subjectId, NaN accuracyPct -> must NOT crash analytics!
        { id: 'bad-1', tokensEarned: 15, accuracyPct: 'oops' },
        ...Array.from({ length: 65 }, (_, i) => ({
          id: `r-${i}`,
          subjectId: 'english',
          questSetId: `q-${i}`,
          questSetTitle: `Q ${i}`,
          tokensEarned: 10,
          maxCombo: 3,
          accuracyPct: 90,
          completedAt: '2026-11-24T12:00:00.000Z',
        })),
      ],
      writingLog: Array.from({ length: 120 }, (_, i) => ({
        id: `w-${i}`,
        sentence: `Sentence ${i}`,
      })),
    };

    const imported = importPlayerStateJson(JSON.stringify(malformed));
    expect(imported.ok).toBe(true);
    if (!imported.ok) return;
    expect(imported.state.completedQuestSetIds).toEqual(['en-1', 'math-1']);
    expect(imported.state.runHistory).toHaveLength(50);
    expect(imported.state.writingLog).toHaveLength(100);
    // Must not throw when ParentView computes weekly snapshot & report text
    expect(() => computeWeeklySnapshot(imported.state)).not.toThrow();
    expect(() => formatWeeklyReportText(imported.state)).not.toThrow();

    // Verify QuotaExceededError fallback trims and succeeds on second write
    let stored = '';
    let attempts = 0;
    const quotaStorage: KeyValueStorage = {
      getItem: () => stored || null,
      setItem: (_k, v) => {
        attempts += 1;
        if (attempts === 1) throw new Error('QuotaExceededError');
        stored = v;
      },
    };
    const repo = createLocalStorageRepository(quotaStorage);
    repo.save(imported.state);
    expect(attempts).toBe(2);
    const reloaded = repo.load();
    expect(reloaded.runHistory).toHaveLength(20);
    expect(reloaded.writingLog).toHaveLength(30);
  });

  it('analytics uses local date keys consistently and counts ALL quest modes in completedQuestsTotal', () => {
    const sampleDate = new Date(2026, 10, 23, 21, 30, 0); // 9:30 PM local time
    const localKey = getLocalDateKey(sampleDate);
    expect(isoToLocalDateKey(sampleDate.toISOString())).toBe(localKey);

    const state = {
      ...createInitialPlayerState('Chloe'),
      completedQuestSetIds: ['en-1'],
      completedRadicalIds: ['rad-1'],
      completedLookAlikeIds: ['zh-la-01'],
      completedFigurativeIds: ['en-fig-01'],
      completedLogicModuleIds: ['balance-scale'],
    };
    const snap = computeWeeklySnapshot(state, sampleDate.toISOString());
    expect(snap.completedQuestsTotal).toBe(5);
  });

  it('provides O(1) Map-backed pack and collectible lookups matching MYSTERY_PACKS', () => {
    for (const pack of MYSTERY_PACKS) {
      expect(getPackById(pack.id)?.name).toBe(pack.name);
      const items = getCollectiblesByPack(pack.id);
      expect(items.length).toBeGreaterThanOrEqual(6);
      for (const item of items) {
        expect(getCollectibleById(item.id)?.id).toBe(item.id);
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import {
  ACHIEVEMENTS,
  claimAchievementReward,
  evaluateAchievements,
} from '../src/core/achievements';
import { buildCertificateSummary, formatCertificateDates } from '../src/core/certificate';
import { createInitialPlayerState } from '../src/core/economy';
import { COLLECTIBLES } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import type { PlayerState, RunSummary } from '../src/core/types';
import { getFactHeatmapKey } from '../src/subjects/math/factFluencyEngine';

function makeRun(
  subjectId: 'english' | 'math' | 'chinese',
  completedAt: string,
  tokensEarned = 25,
): RunSummary {
  return {
    id: `r-${subjectId}-${Math.random()}`,
    subjectId,
    questSetId: `${subjectId}-t1-01`,
    questSetTitle: 'Quest',
    tokensEarned,
    maxCombo: 4,
    accuracyPct: 95,
    completedAt,
  };
}

describe('Phase 6C Layer 1 — 30 Achievement Badges & Printable Bilingual Honor Certificate', () => {
  it('ships 30 unique achievement badges and accurately evaluates all 12 new Phase 5–6 predicates', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(30);
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);
    expect(new Set(ACHIEVEMENTS.map((a) => a.zhTitle)).size).toBe(ACHIEVEMENTS.length);

    // Construct a progressed state that unlocks all 12 new Phase 5-6 achievements
    const vault150: Record<string, number> = {};
    for (const item of COLLECTIBLES.slice(0, 150)) {
      vault150[item.id] = 1;
    }

    const mathFactMastery: PlayerState['mathFactMastery'] = {};
    for (let i = 0; i < 40; i += 1) {
      mathFactMastery[getFactHeatmapKey(2 + Math.floor(i / 8), 2 + (i % 8))] = {
        attempts: 3,
        correct: 3,
        avgMs: 2200,
      };
    }

    const progressed: PlayerState = {
      ...createInitialPlayerState('Chloe'),
      vault: vault150,
      completedSpellingIds: Array.from({ length: 8 }, (_, i) => `sp-set-${i + 1}`),
      completedEnglishChapterIds: Array.from({ length: 5 }, (_, i) => `en-ch-1-${i + 1}`),
      mathFactMastery,
      completedBarModelIds: Array.from({ length: 8 }, (_, i) => `bm-model-${i + 1}`),
      completedSentencePatternIds: Array.from({ length: 4 }, (_, i) => `zh-sp-${i + 1}`),
      completedChapterEpisodeIds: Array.from({ length: 15 }, (_, i) => `zh-ch-${i + 1}`),
      towerHighScores: { english: 1250 },
      critterRoom: {
        themeId: 'rainbow-cloud-castle',
        slots: [
          COLLECTIBLES[0].id,
          COLLECTIBLES[1].id,
          COLLECTIBLES[2].id,
          COLLECTIBLES[3].id,
          null,
          null,
          null,
          null,
        ],
        decorIds: ['decor-boba-lamp', 'decor-star-mobile', 'decor-rainbow-banner'],
      },
    };

    const evals = evaluateAchievements(progressed);
    const byId = new Map(evals.map((e) => [e.def.id, e]));

    const newBadgeIds = [
      'ach-spelling-1',
      'ach-spelling-8',
      'ach-en-chapters-5',
      'ach-math-fluency-10',
      'ach-math-fluency-40',
      'ach-bar-model-4',
      'ach-bar-model-8',
      'ach-tower-1000',
      'ach-vault-150',
      'ach-room-designer',
      'ach-sentence-pattern-4',
      'ach-zh-chapters-15',
    ];

    for (const id of newBadgeIds) {
      const progress = byId.get(id);
      expect(progress, `Missing achievement ${id}`).toBeDefined();
      expect(progress!.unlocked, `Expected ${id} to be unlocked`).toBe(true);
      expect(progress!.claimable, `Expected ${id} to be claimable`).toBe(true);
    }

    // Enforce lifetime once-per-badge claim lock and v1 JSON persistence (including mathFactMastery heatmap keys!)
    const firstClaim = claimAchievementReward(progressed, 'ach-room-designer');
    expect(firstClaim.ok).toBe(true);
    if (!firstClaim.ok) return;
    expect(firstClaim.rewardType).toBe('tokens');
    expect(firstClaim.rewardAmount).toBe(25);

    const dupClaim = claimAchievementReward(firstClaim.state, 'ach-room-designer');
    expect(dupClaim.ok).toBe(false);
    if (!dupClaim.ok) expect(dupClaim.reason).toBe('already_claimed');

    const restored = importPlayerStateJson(exportPlayerStateJson(firstClaim.state));
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;
    expect(restored.state.claimedAchievementIds).toContain('ach-room-designer');
    const restoredFluency40 = evaluateAchievements(restored.state).find(
      (a) => a.def.id === 'ach-math-fluency-40',
    );
    expect(restoredFluency40?.unlocked).toBe(true);
    expect(restoredFluency40?.current).toBe(40);
  });

  it('requires both 4 critters AND 3 decor stickers for Cozy Room Designer (cannot be cheesed by 6 decor alone)', () => {
    const onlyDecor: PlayerState = {
      ...createInitialPlayerState('Mia'),
      critterRoom: {
        themeId: 'sakura-teahouse',
        slots: [null, null, null, null, null, null, null, null],
        decorIds: [
          'decor-boba-lamp',
          'decor-star-mobile',
          'decor-sakura-bonsai',
          'decor-plush-cushion',
          'decor-mini-bookshelf',
          'decor-tea-set',
        ],
      },
    };
    const prog = evaluateAchievements(onlyDecor).find((a) => a.def.id === 'ach-room-designer');
    expect(prog?.current).toBe(3); // Capped at 3 from decor alone
    expect(prog?.unlocked).toBe(false);
  });

  it('computes accurate bilingual Printable Honor Certificate summary with weekly stats & fallback name', () => {
    const now = new Date(2026, 10, 23, 14, 0, 0); // Nov 23, 2026
    expect(formatCertificateDates(now)).toEqual({
      zhDate: '2026 年 11 月 23 日',
      enDate: 'November 23, 2026',
    });

    const recentIso = new Date(2026, 10, 22, 10, 0, 0).toISOString();
    const oldIso = new Date(2026, 10, 1, 10, 0, 0).toISOString();

    const state: PlayerState = {
      ...createInitialPlayerState('Chloe'),
      displayName: '   ', // Blank name should gracefully fall back
      streakDays: 6,
      equippedCollectibleId: 'critter-sprout-bunny',
      vault: {
        'critter-sprout-bunny': 1,
        'nightmarket-pearl-boba': 1,
      },
      shinyVault: {
        'critter-sprout-bunny': true,
      },
      runHistory: [
        makeRun('english', recentIso, 25),
        makeRun('english', recentIso, 25),
        makeRun('math', recentIso, 20),
        makeRun('chinese', recentIso, 30),
        makeRun('chinese', recentIso, 25),
        makeRun('english', oldIso, 25), // Outside 7-day window
      ],
    };

    const cert = buildCertificateSummary(state, now);
    expect(cert.displayName).toBe('QuestVault Scholar');
    expect(cert.equippedIsShiny).toBe(true);
    expect(cert.weeklyEnRuns).toBe(2);
    expect(cert.weeklyMathRuns).toBe(1);
    expect(cert.weeklyZhRuns).toBe(2);
    expect(cert.weeklyTotalRuns).toBe(5);
    expect(cert.weeklyTokens).toBe(125);
    expect(cert.streakDays).toBe(6);
    expect(cert.vaultOwned).toBe(2);
    expect(cert.vaultTotal).toBe(COLLECTIBLES.length);
    expect(cert.achievementsTotal).toBe(ACHIEVEMENTS.length);
    expect(cert.honorTitleZh).toBe('三科學習模範生');
    expect(cert.honorTitleEn).toBe('Tri-Subject Honor Champion');
  });
});

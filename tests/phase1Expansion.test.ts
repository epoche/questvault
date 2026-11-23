import { describe, expect, it } from 'vitest';
import {
  awardBlitzSessionRewards,
  BLITZ_DAILY_TOKEN_CAP,
  claimDailyTriSubjectReward,
  craftShinyCollectible,
  createInitialPlayerState,
  DAILY_TRI_SUBJECT_BONUS,
  recordDailySubjectCompletion,
} from '../src/core/economy';
import { getDueReviewItems, recordWordOutcome, SRS_INTERVAL_DAYS } from '../src/core/mastery';
import { COLLECTIBLES, getCollectibleById, MYSTERY_PACKS, PACK_CATEGORIES } from '../src/core/packs';
import {
  exportPlayerStateJson,
  importPlayerStateJson,
} from '../src/core/repository';
import type { WordMasteryRecord } from '../src/core/types';
import { parseCustomChineseList } from '../src/subjects/chinese/chineseCustomParser';
import { buildChineseSrsReviewSet } from '../src/subjects/chinese/chineseEngine';
import { BUILTIN_CHINESE_SETS } from '../src/subjects/chinese/wordSets';
import { buildEnglishRun, buildEnglishSrsReviewSet } from '../src/subjects/english/runEngine';
import { BUILTIN_WORD_SETS } from '../src/subjects/english/wordSets';
import { evaluateWritingSubmission } from '../src/subjects/english/writingChecks';
import { buildMathRun, buildMathSrsReviewSet } from '../src/subjects/math/mathEngine';
import { hydrateDynamicMathSet, validateMathItemInvariants } from '../src/subjects/math/mathGenerator';
import { BUILTIN_MATH_SETS } from '../src/subjects/math/questSets';

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

describe('Layer 1: Math 28-Unit Infinite Dynamic Fuzz Suite (1,400+ generated runs / 5,600+ problems)', () => {
  it('generates 1,400 dynamic unit runs (28 units × 50 seeds = 5,600 items) with zero math/visual/choice invariant violations', () => {
    expect(BUILTIN_MATH_SETS).toHaveLength(28);
    const allErrors: string[] = [];
    let totalGeneratedItems = 0;

    for (let u = 0; u < BUILTIN_MATH_SETS.length; u += 1) {
      const unit = BUILTIN_MATH_SETS[u];
      expect(getCollectibleById(unit.emblemCollectibleId)).toBeDefined();

      const promptSignatures = new Set<string>();
      for (let s = 0; s < 50; s += 1) {
        const rng = createSeededRng((u + 1) * 10007 + (s + 1) * 7919);
        const hydrated = hydrateDynamicMathSet(unit, rng);
        promptSignatures.add(hydrated.items.map((i) => i.sprintPrompt).join(' | '));

        for (const item of hydrated.items) {
          totalGeneratedItems += 1;
          const errs = validateMathItemInvariants(item);
          if (errs.length > 0) {
            allErrors.push(`[${unit.id} seed=${s}] ${errs.join('; ')}`);
          }
        }
      }

      // Every single unit must genuinely produce varied dynamic problems across 50 seeds
      expect(promptSignatures.size).toBeGreaterThanOrEqual(4);
    }

    expect(totalGeneratedItems).toBe(5600);
    expect(allErrors).toEqual([]);
  });

  it('produces fresh Math runs when replaying the same unit with different RNG seeds', () => {
    const unit = BUILTIN_MATH_SETS[0];
    const runA = buildMathRun(unit, createSeededRng(101));
    const runB = buildMathRun(unit, createSeededRng(9999));
    const promptsA = runA.sprintQuestions.map((q) => q.promptText).sort().join('|');
    const promptsB = runB.sprintQuestions.map((q) => q.promptText).sort().join('|');
    expect(promptsA).not.toBe(promptsB);
  });
});

describe('Layer 1: 600-Word Full-Catalog Quality Gate (300 English + 300 Traditional Chinese)', () => {
  it('validates all 60 English sets (300 unique words): zero duplicates, fresh transfer sentences, zero leakage, multi-word idiom writing match', () => {
    expect(BUILTIN_WORD_SETS).toHaveLength(60);
    const seenWords = new Set<string>();
    const seenSetIds = new Set<string>();

    for (const set of BUILTIN_WORD_SETS) {
      expect(seenSetIds.has(set.id)).toBe(false);
      seenSetIds.add(set.id);
      expect(getCollectibleById(set.emblemCollectibleId)).toBeDefined();
      expect(set.words).toHaveLength(5);

      for (const w of set.words) {
        const key = w.word.toLowerCase();
        expect(seenWords.has(key), `Duplicate English word: ${w.word}`).toBe(false);
        seenWords.add(key);

        expect(w.contextSentence).toContain('___');
        expect(w.sprintSentence).toBeTruthy();
        expect(w.sprintSentence!).toContain('___');
        expect(w.sprintSentence).not.toBe(w.contextSentence);

        // Zero target word leakage inside blanked sentences (for single words >= 4 chars)
        if (!key.includes(' ') && key.length >= 4) {
          const leakRe = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          expect(leakRe.test(w.contextSentence), `Context leaks ${w.word}`).toBe(false);
          expect(leakRe.test(w.sprintSentence!), `Sprint leaks ${w.word}`).toBe(false);
        }
      }
    }

    expect(seenWords.size).toBe(300);

    // Every 5-word English set exposes all 5 words in Stage 3 Story Forge chips & checklist
    for (const set of BUILTIN_WORD_SETS) {
      const run = buildEnglishRun(set);
      expect(run.forgePrompt.targetWords).toHaveLength(set.words.length);
      for (const w of set.words) {
        expect(run.forgePrompt.targetWords).toContain(w.word);
      }
    }

    // Multi-word idioms and apostrophe homophones match cleanly in Stage 3 writing evaluation
    expect(
      evaluateWritingSubmission(
        'After studying all week, the math quiz felt like a piece of cake!',
        ['piece of cake', 'on cloud nine'],
      ).allPassed,
    ).toBe(true);
    expect(
      evaluateWritingSubmission(
        "My cousins called because they're coming over for pizza tonight!",
        ['their', 'there', "they're"],
      ).allPassed,
    ).toBe(true);
  });

  it('validates all 60 Traditional Chinese sets (300 unique words): legal MOE Zhuyin, char alignment, zero leakage, and auto-fill importer', () => {
    expect(BUILTIN_CHINESE_SETS).toHaveLength(60);
    const seenWords = new Set<string>();
    const seenSetIds = new Set<string>();
    // Legal Taiwan MOE Zhuyin syllable: optional neutral dot, 1-3 Bopomofo symbols, optional tone mark
    const validZhuyinSyllable = /^˙?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/;
    // Common Simplified-only characters that must NEVER appear in Taiwan Traditional Chinese text
    const simplifiedLeak = /[国学发欢会时为这来进对动说点让给样觉题认谢]/;

    for (const set of BUILTIN_CHINESE_SETS) {
      expect(seenSetIds.has(set.id)).toBe(false);
      seenSetIds.add(set.id);
      expect(getCollectibleById(set.emblemCollectibleId)).toBeDefined();
      expect(set.words).toHaveLength(5);

      for (const w of set.words) {
        expect(seenWords.has(w.word), `Duplicate Chinese word: ${w.word}`).toBe(false);
        seenWords.add(w.word);

        const chars = Array.from(w.word);
        const syllables = w.zhuyin.trim().split(/\s+/);
        expect(syllables.length, `Zhuyin char mismatch for ${w.word}: ${w.zhuyin}`).toBe(chars.length);
        for (const syl of syllables) {
          expect(validZhuyinSyllable.test(syl), `Invalid Zhuyin syllable "${syl}" in ${w.word}`).toBe(true);
        }

        expect(w.contextSentence).toContain('___');
        expect(w.sprintSentence).toContain('___');
        expect(w.sprintSentence).not.toBe(w.contextSentence);

        // For 2+ character words, verify sentence never leaks the full word
        if (chars.length >= 2) {
          expect(w.contextSentence.includes(w.word), `Context leaks ${w.word}`).toBe(false);
          expect(w.sprintSentence.includes(w.word), `Sprint leaks ${w.word}`).toBe(false);
        }

        // Zero Simplified Chinese character leaks
        const combined = `${w.word}${w.plainBridge}${w.contextSentence}${w.sprintSentence}${w.upgradeBefore ?? ''}${w.upgradePlainSpan ?? ''}${w.upgradeAfter ?? ''}`;
        expect(simplifiedLeak.test(combined), `Simplified leak in ${w.word}: ${combined}`).toBe(false);
      }
    }

    expect(seenWords.size).toBe(300);

    // Parent Chinese Importer auto-fills from the expanded 300-word dictionary!
    const imported = parseCustomChineseList('本週成語', '畫龍點睛、蝴蝶、分辨');
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.record.words[0].zhuyin).toBe('ㄏㄨㄚˋ ㄌㄨㄥˊ ㄉㄧㄢˇ ㄐㄧㄥ');
      expect(imported.record.words[1].zhuyin).toBe('ㄏㄨˊ ㄉㄧㄝˊ');
      expect(imported.record.words[2].zhuyin).toBe('ㄈㄣ ㄅㄧㄢˋ');
    }
  });
});

describe('Layer 1: 30 Mystery Packs (240 Collectibles), Shiny 3-to-1 Craft, SRS, Daily Quest, Blitz Cap & v1 Compat', () => {
  it('ships 30 unique packs (240 unique collectibles) across valid categories and enforces 3-to-1 Shiny crafting', () => {
    expect(MYSTERY_PACKS).toHaveLength(30);
    expect(COLLECTIBLES).toHaveLength(240);
    const validCategories = new Set(PACK_CATEGORIES.map((c) => c.id));
    const seenIds = new Set<string>();

    for (const pack of MYSTERY_PACKS) {
      expect(validCategories.has(pack.category)).toBe(true);
      const items = COLLECTIBLES.filter((c) => c.packId === pack.id);
      expect(items).toHaveLength(8);
      for (const item of items) {
        expect(seenIds.has(item.id)).toBe(false);
        seenIds.add(item.id);
      }
    }

    let state = createInitialPlayerState('Luna');
    const targetId = 'boba-milk-cat';
    state = { ...state, vault: { ...state.vault, [targetId]: 2 } };
    expect(craftShinyCollectible(state, targetId)).toEqual({
      ok: false,
      reason: 'insufficient_copies',
    });

    state = { ...state, vault: { ...state.vault, [targetId]: 3 } };
    const crafted = craftShinyCollectible(state, targetId);
    expect(crafted.ok).toBe(true);
    if (crafted.ok) {
      // Consumes 2 extra copies, keeps 1 copy owned, unlocks Shiny permanently
      expect(crafted.state.vault[targetId]).toBe(1);
      expect(crafted.state.shinyVault?.[targetId]).toBe(true);
      // Cannot craft Shiny a second time even with 5 copies
      const retry = craftShinyCollectible(
        { ...crafted.state, vault: { ...crafted.state.vault, [targetId]: 5 } },
        targetId,
      );
      expect(retry).toEqual({ ok: false, reason: 'already_shiny' });
    }
  });

  it('schedules SRS spaced repetition (1→3→7→21 days) and builds SRS Review decks for all 3 subjects', () => {
    expect(SRS_INTERVAL_DAYS).toEqual([1, 3, 7, 21]);
    let mastery: Record<string, WordMasteryRecord> = {};
    const t0 = '2026-11-01T10:00:00.000Z';

    mastery = recordWordOutcome(mastery, { word: 'whisper', subjectId: 'english', tier: 1, outcome: 'clean', nowIso: t0 });
    expect(mastery['whisper'].srsLevel).toBe(1);
    expect(mastery['whisper'].nextReviewAt?.slice(0, 10)).toBe('2026-11-02');

    mastery = recordWordOutcome(mastery, { word: 'whisper', subjectId: 'english', tier: 1, outcome: 'clean', nowIso: '2026-11-02T10:00:00.000Z' });
    expect(mastery['whisper'].srsLevel).toBe(2);
    expect(mastery['whisper'].nextReviewAt?.slice(0, 10)).toBe('2026-11-05');

    mastery = recordWordOutcome(mastery, { word: 'whisper', subjectId: 'english', tier: 1, outcome: 'clean', nowIso: '2026-11-05T10:00:00.000Z' });
    expect(mastery['whisper'].srsLevel).toBe(3);
    expect(mastery['whisper'].nextReviewAt?.slice(0, 10)).toBe('2026-11-12');

    mastery = recordWordOutcome(mastery, { word: 'whisper', subjectId: 'english', tier: 1, outcome: 'clean', nowIso: '2026-11-12T10:00:00.000Z' });
    expect(mastery['whisper'].srsLevel).toBe(4);
    expect(mastery['whisper'].nextReviewAt?.slice(0, 10)).toBe('2026-12-03');

    // Missed resets SRS back to level 0 (immediately due for review)
    mastery = recordWordOutcome(mastery, { word: 'whisper', subjectId: 'english', tier: 1, outcome: 'missed', nowIso: '2026-11-05T10:00:00.000Z' });
    expect(mastery['whisper'].srsLevel).toBe(0);
    expect(mastery['whisper'].nextReviewAt?.slice(0, 10)).toBe('2026-11-05');

    // Seed 3 due items per subject and verify all 3 SRS builders trigger cleanly
    for (const w of ['rescue', 'peek', 'tumble']) {
      mastery = recordWordOutcome(mastery, { word: w, subjectId: 'english', tier: 1, outcome: 'clean', nowIso: t0 });
    }
    for (const m of ['6 × 4', '6 × 7', '9 × Facts']) {
      mastery = recordWordOutcome(mastery, { word: m, subjectId: 'math', tier: 1, outcome: 'clean', nowIso: t0 });
    }
    for (const z of ['發現', '保護', '幫忙']) {
      mastery = recordWordOutcome(mastery, { word: z, subjectId: 'chinese', tier: 1, outcome: 'clean', nowIso: t0 });
    }

    const futureIso = '2026-11-10T10:00:00.000Z';
    expect(getDueReviewItems(mastery, 'english', futureIso).length).toBeGreaterThanOrEqual(3);
    expect(buildEnglishSrsReviewSet(mastery, BUILTIN_WORD_SETS, futureIso)?.words.length).toBeGreaterThanOrEqual(3);
    expect(buildMathSrsReviewSet(mastery, BUILTIN_MATH_SETS, futureIso)?.items.length).toBeGreaterThanOrEqual(3);
    expect(buildChineseSrsReviewSet(mastery, BUILTIN_CHINESE_SETS, futureIso)?.words.length).toBeGreaterThanOrEqual(3);
  });

  it('enforces Daily Tri-Subject Quest idempotency, streak progression, Blitz 120-Token daily cap, and v1 JSON backward compat', () => {
    let state = createInitialPlayerState('Mina');
    const day1 = '2026-11-20';
    const day2 = '2026-11-21';

    state = recordDailySubjectCompletion(state, 'english', day1);
    expect(state.streakDays).toBe(1);
    expect(claimDailyTriSubjectReward(state, day1)).toEqual({ ok: false, reason: 'incomplete' });

    state = recordDailySubjectCompletion(state, 'math', day1);
    state = recordDailySubjectCompletion(state, 'chinese', day1);
    expect(state.streakDays).toBe(1); // same day does not double-increment streak

    const claimed = claimDailyTriSubjectReward(state, day1);
    expect(claimed.ok).toBe(true);
    if (claimed.ok) {
      expect(claimed.bonusTokens).toBe(DAILY_TRI_SUBJECT_BONUS);
      expect(claimed.state.tokens).toBe(state.tokens + DAILY_TRI_SUBJECT_BONUS);
      // Cannot double-claim on same day!
      expect(claimDailyTriSubjectReward(claimed.state, day1)).toEqual({
        ok: false,
        reason: 'already_claimed',
      });
      state = claimed.state;
    }

    // Consecutive day increments streak to 2!
    state = recordDailySubjectCompletion(state, 'english', day2);
    expect(state.streakDays).toBe(2);

    // Endless Blitz daily Token cap enforcement (120/day)
    const b1 = awardBlitzSessionRewards(state, 'math', 240, 80, day2);
    expect(b1.tokensAwarded).toBe(80);
    expect(b1.remainingDailyCap).toBe(40);
    expect(b1.state.blitzHighScores?.math).toBe(240);

    const b2 = awardBlitzSessionRewards(b1.state, 'math', 180, 90, day2);
    expect(b2.tokensAwarded).toBe(40); // Clamped to 120 daily cap!
    expect(b2.remainingDailyCap).toBe(0);
    expect(b2.state.blitzHighScores?.math).toBe(240); // Preserves higher score

    const b3 = awardBlitzSessionRewards(b2.state, 'english', 300, 50, day2);
    expect(b3.tokensAwarded).toBe(0); // Cross-subject shared daily cap!
    expect(b3.state.blitzHighScores?.english).toBe(300);
    expect(b3.state.blitzDailyTokens?.earned).toBe(BLITZ_DAILY_TOKEN_CAP);

    // Full Phase 1 JSON backup round-trip
    const roundTrip = importPlayerStateJson(exportPlayerStateJson(b3.state));
    expect(roundTrip.ok).toBe(true);
    if (roundTrip.ok) {
      expect(roundTrip.state.streakDays).toBe(2);
      expect(roundTrip.state.blitzHighScores?.math).toBe(240);
      expect(roundTrip.state.blitzDailyTokens?.earned).toBe(120);
    }

    // Legacy v1 JSON save (missing all Phase 1 & multi-subject fields) imports with 100% backward compat
    const legacyV1Json = JSON.stringify({
      version: 1,
      displayName: 'LegacyKid',
      tokens: 175,
      activeTier: 3,
      placementCompleted: true,
      equippedCollectibleId: 'critter-sprout-bunny',
      vault: { 'critter-sprout-bunny': 4 },
      wordMastery: {
        whisper: { word: 'whisper', tier: 1, seen: 2, cleanCount: 2, missCount: 0, writingUses: 1, lastSeenAt: '2026-10-01T00:00:00Z' },
      },
      completedQuestSetIds: ['en-t1-action-heroes'],
      customWordSets: [],
      runHistory: [],
      writingLog: [],
      muted: false,
    });
    const importedLegacy = importPlayerStateJson(legacyV1Json);
    expect(importedLegacy.ok).toBe(true);
    if (importedLegacy.ok) {
      expect(importedLegacy.state.displayName).toBe('LegacyKid');
      expect(importedLegacy.state.tokens).toBe(175);
      expect(importedLegacy.state.vault['critter-sprout-bunny']).toBe(4);
      expect(importedLegacy.state.shinyVault).toEqual({});
      expect(importedLegacy.state.streakDays).toBe(0);
    }
  });
});

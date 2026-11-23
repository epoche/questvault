import { describe, expect, it } from 'vitest';
import { getClaimableAchievementCount } from '../src/core/achievements';
import {
  createInitialPlayerState,
  getQuestRewardPolicy,
  recordDailyQuestClaim,
} from '../src/core/economy';
import { getCollectibleById } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  ENGLISH_GRAMMAR_SETS,
  getEnglishGrammarSetsByTier,
} from '../src/subjects/english/grammarSets';
import {
  buildEnglishRootBuilderQuestions,
  buildEnglishRootSprintQuestions,
  calculateEnglishRootRunTokens,
} from '../src/subjects/english/rootEngine';
import {
  ENGLISH_ROOT_FAMILIES,
  getEnglishRootFamiliesByTier,
} from '../src/subjects/english/rootFamilies';

describe('Phase 4B Layer 1: English Word Roots & Prefixes Lab (16 Families / 80 Words)', () => {
  it('contains 16 balanced families (4 per tier) totaling 80 unique words with valid emblems and exact morpheme assembly', () => {
    expect(ENGLISH_ROOT_FAMILIES).toHaveLength(16);
    for (const tier of [1, 2, 3, 4] as const) {
      expect(getEnglishRootFamiliesByTier(tier)).toHaveLength(4);
    }

    const seenFamilyIds = new Set<string>();
    const seenWords = new Set<string>();

    for (const fam of ENGLISH_ROOT_FAMILIES) {
      expect(seenFamilyIds.has(fam.id)).toBe(false);
      seenFamilyIds.add(fam.id);
      expect(getCollectibleById(fam.emblemCollectibleId)).toBeTruthy();
      expect(fam.items).toHaveLength(5);

      // Unique baseParts within each family so Stage 1 builder choices are always distinct
      expect(new Set(fam.items.map((it) => it.basePart.toLowerCase())).size).toBe(5);

      for (const it of fam.items) {
        const lowerWord = it.word.toLowerCase();
        expect(seenWords.has(lowerWord)).toBe(false);
        seenWords.add(lowerWord);

        const cleanMorph = it.morpheme.replace(/-/g, '').toLowerCase();
        const cleanBase = it.basePart.replace(/-/g, '').toLowerCase();
        const combined =
          it.order === 'morpheme-first' ? cleanMorph + cleanBase : cleanBase + cleanMorph;
        expect(combined).toBe(lowerWord);

        // Fresh transfer sprint sentence: single blank, zero answer leak
        expect(it.sprintSentence.split('___')).toHaveLength(2);
        expect(it.sprintSentence.toLowerCase()).not.toContain(lowerWord);
        expect(it.sprintSentence).not.toBe(it.exampleSentence);
      }

      // Stage 1 & Stage 2 engine builders produce 5 valid 4-choice questions each
      const buildQs = buildEnglishRootBuilderQuestions(fam);
      const sprintQs = buildEnglishRootSprintQuestions(fam);
      expect(buildQs).toHaveLength(5);
      expect(sprintQs).toHaveLength(5);
      for (const q of buildQs) {
        expect(q.choices).toHaveLength(4);
        expect(q.choices.filter((c) => c.isCorrect)).toHaveLength(1);
        expect(new Set(q.choices.map((c) => c.basePart)).size).toBe(4);
      }
      for (const q of sprintQs) {
        expect(q.choices).toHaveLength(4);
        expect(q.choices.filter((c) => c.isCorrect)).toHaveLength(1);
        expect(new Set(q.choices.map((c) => c.word)).size).toBe(4);
      }
    }

    expect(seenWords.size).toBe(80);
    expect(calculateEnglishRootRunTokens(10, 10)).toBe(50);
    expect(calculateEnglishRootRunTokens(10, 5)).toBe(40);
  });
});

describe('Phase 4B Layer 1: English Grammar Repair Lab (12 Sets / 60 Questions)', () => {
  it('contains 12 balanced sets (3 per tier) totaling 60 spotless questions with 4 unique choices and zero leak', () => {
    expect(ENGLISH_GRAMMAR_SETS).toHaveLength(12);
    for (const tier of [1, 2, 3, 4] as const) {
      expect(getEnglishGrammarSetsByTier(tier)).toHaveLength(3);
    }

    const seenSetIds = new Set<string>();
    const seenQIds = new Set<string>();

    for (const set of ENGLISH_GRAMMAR_SETS) {
      expect(seenSetIds.has(set.id)).toBe(false);
      seenSetIds.add(set.id);
      expect(getCollectibleById(set.emblemCollectibleId)).toBeTruthy();
      expect(set.questions).toHaveLength(5);

      for (const q of set.questions) {
        expect(seenQIds.has(q.id)).toBe(false);
        seenQIds.add(q.id);
        expect(q.promptSentence.split('___')).toHaveLength(2);
        expect(q.spokenFullSentence).toBe(q.promptSentence.replace('___', q.targetAnswer));
        expect(q.choices).toHaveLength(4);
        expect(new Set(q.choices).size).toBe(4);
        expect(q.choices[q.correctIndex]).toBe(q.targetAnswer);
        expect(q.ruleTip.length).toBeGreaterThan(5);
      }
    }

    expect(seenQIds.size).toBe(60);
  });

  it('integrates Phase 4B roots & grammar with Plan A anti-farming, achievements, and v1 JSON backups', () => {
    const day1 = '2026-11-23';
    const rootId = ENGLISH_ROOT_FAMILIES[0].id;
    const gramId = ENGLISH_GRAMMAR_SETS[0].id;

    let state = createInitialPlayerState('Maya');
    expect(
      getQuestRewardPolicy(state, {
        questSetId: rootId,
        kind: 'static',
        subjectId: 'english',
        todayKey: day1,
        completedIds: state.completedEnglishRootIds ?? [],
      }).multiplier,
    ).toBe(1);

    state = recordDailyQuestClaim(
      {
        ...state,
        completedEnglishRootIds: [rootId],
        completedGrammarIds: [gramId],
      },
      rootId,
      day1,
    );

    // Same-day repeat is 0% Practice Mode
    expect(
      getQuestRewardPolicy(state, {
        questSetId: rootId,
        kind: 'static',
        subjectId: 'english',
        todayKey: day1,
        completedIds: state.completedEnglishRootIds ?? [],
      }).multiplier,
    ).toBe(0);

    // Completing first quest unlocks ach-first-quest
    expect(getClaimableAchievementCount(state)).toBeGreaterThanOrEqual(1);

    // Survives v1 JSON export/import cleanly
    const json = exportPlayerStateJson(state);
    const imported = importPlayerStateJson(json);
    expect(imported.ok).toBe(true);
    if (!imported.ok) return;
    expect(imported.state.completedEnglishRootIds).toEqual([rootId]);
    expect(imported.state.completedGrammarIds).toEqual([gramId]);
  });
});

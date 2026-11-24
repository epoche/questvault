import {
  applyQuestRewardMultiplier,
  getQuestRewardPolicy,
  recordDailyQuestClaim,
  recordDailySubjectCompletion,
  type QuestRewardPolicy,
} from './economy';
import { recordWordOutcome, type WordOutcomeInput } from './mastery';
import type { PlayerState, RunSummary, SubjectId, WritingEntry } from './types';

export type QuestCompletionListField =
  | 'completedQuestSetIds'
  | 'completedRadicalIds'
  | 'completedMeasureIds'
  | 'completedEnglishRootIds'
  | 'completedGrammarIds'
  | 'completedSpellingIds'
  | 'completedEnglishChapterIds'
  | 'completedBarModelIds'
  | 'completedSentencePatternIds'
  | 'completedLookAlikeIds'
  | 'completedFigurativeIds'
  | 'completedChapterEpisodeIds';

export interface QuestCompletionInput {
  subjectId: SubjectId;
  questSetId: string;
  questSetTitle: string;
  /** 'static' (default) or 'math' for dynamic math generators. */
  kind?: 'static' | 'math';
  /** Which PlayerState completed*Ids array should record questSetId (omit to skip). */
  completionField?: QuestCompletionListField;
  /** Raw un-multiplied tokens before Plan A replay policy. */
  rawTokensEarned: number;
  accuracyPct: number;
  maxCombo?: number;
  todayKey: string;
  nowIso?: string;
  /** Optional prefix for the generated RunSummary id (defaults to 'run'). */
  runIdPrefix?: string;
  /** Optional pre-built RunSummary (tokensEarned will be overwritten with awardedTokens). */
  existingSummary?: RunSummary;
  /** Optional word/skill mastery outcomes to record. */
  wordOutcomes?: WordOutcomeInput[];
  /** Optional word keys used by Plan A SRS-due 100% check. */
  wordsInSet?: string[];
  /** Optional pre-built WritingEntry to prepend (capped at 100). */
  writingEntry?: WritingEntry;
  /** If true, records today's Boss Rematch date for this subject. */
  isBossRematch?: boolean;
  /** If true, skips completionField recording. */
  skipCompletionRecord?: boolean;
  /** Defaults to true: applies Plan A replay policy and records daily quest claim. */
  applyPlanA?: boolean;
  /** Defaults to true: marks today's tri-subject quest + streak for subjectId. */
  markDailySubject?: boolean;
}

export interface QuestCompletionResult {
  state: PlayerState;
  awardedTokens: number;
  policy: QuestRewardPolicy;
}

/**
 * Pure, deterministic quest completion pipeline shared across all QuestVault learning modes.
 * Single source of truth for Plan A anti-farming multiplier, SRS mastery updates,
 * deduplicated completion tracking, bounded runHistory/writingLog, and daily streak sync.
 */
export function completeQuestRun(
  prev: PlayerState,
  input: QuestCompletionInput,
): QuestCompletionResult {
  const nowIso = input.nowIso ?? new Date().toISOString();
  const safeRaw = Number.isFinite(input.rawTokensEarned)
    ? Math.max(0, Math.round(input.rawTokensEarned))
    : 0;
  const safeAcc = Number.isFinite(input.accuracyPct)
    ? Math.max(0, Math.min(100, Math.round(input.accuracyPct)))
    : 0;
  const safeCombo =
    typeof input.maxCombo === 'number' && Number.isFinite(input.maxCombo)
      ? Math.max(0, Math.floor(input.maxCombo))
      : 0;

  const completedList = input.completionField ? (prev[input.completionField] ?? []) : undefined;
  const policy = getQuestRewardPolicy(prev, {
    questSetId: input.questSetId,
    kind: input.kind ?? 'static',
    subjectId: input.subjectId,
    todayKey: input.todayKey,
    ...(completedList ? { completedIds: completedList } : {}),
    ...(input.wordsInSet ? { words: input.wordsInSet } : {}),
  });

  const usePlanA = input.applyPlanA !== false;
  const awardedTokens = usePlanA
    ? applyQuestRewardMultiplier(safeRaw, policy.multiplier)
    : safeRaw;

  let nextMastery = prev.wordMastery;
  if (input.wordOutcomes && input.wordOutcomes.length > 0) {
    for (const outcome of input.wordOutcomes) {
      nextMastery = recordWordOutcome(nextMastery, {
        ...outcome,
        subjectId: outcome.subjectId ?? input.subjectId,
      });
    }
  }

  const nextFieldPatch: Partial<PlayerState> = {};
  if (input.completionField && !input.skipCompletionRecord) {
    const existing = prev[input.completionField] ?? [];
    if (!existing.includes(input.questSetId)) {
      nextFieldPatch[input.completionField] = [...existing, input.questSetId];
    }
  }

  const runSummary: RunSummary = input.existingSummary
    ? { ...input.existingSummary, tokensEarned: awardedTokens }
    : {
        id: `${input.runIdPrefix ?? 'run'}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        subjectId: input.subjectId,
        questSetId: input.questSetId,
        questSetTitle: input.questSetTitle,
        tokensEarned: awardedTokens,
        maxCombo: safeCombo,
        accuracyPct: safeAcc,
        completedAt: nowIso,
      };

  const nextWritingLog =
    input.writingEntry && input.writingEntry.sentence.trim().length > 0
      ? [input.writingEntry, ...prev.writingLog].slice(0, 100)
      : prev.writingLog;

  let nextState: PlayerState = {
    ...prev,
    ...nextFieldPatch,
    tokens: prev.tokens + awardedTokens,
    wordMastery: nextMastery,
    runHistory: [runSummary, ...prev.runHistory].slice(0, 50),
    writingLog: nextWritingLog,
    ...(input.isBossRematch
      ? {
          ...(input.subjectId === 'english' ? { lastBossRematchDate: input.todayKey } : {}),
          subjectBossRematchDate: {
            ...prev.subjectBossRematchDate,
            [input.subjectId]: input.todayKey,
          },
        }
      : {}),
  };

  if (usePlanA && awardedTokens > 0) {
    nextState = recordDailyQuestClaim(nextState, input.questSetId, input.todayKey);
  }
  if (input.markDailySubject !== false) {
    nextState = recordDailySubjectCompletion(nextState, input.subjectId, input.todayKey);
  }

  return {
    state: nextState,
    awardedTokens,
    policy,
  };
}

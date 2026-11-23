import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Coins,
  Flame,
  Lightbulb,
  RotateCcw,
  ShoppingBag,
  Volume2,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  applyQuestRewardMultiplier,
  calculateQuestionTokens,
  type QuestRewardPolicy,
} from '../../core/economy';
import type { WordOutcomeInput } from '../../core/mastery';
import { PACK_COST } from '../../core/packs';
import type { RunSummary } from '../../core/types';
import { buildMathRun } from '../../subjects/math/mathEngine';
import type {
  MathChallengeQuestion,
  MathQuestSet,
  MathSprintQuestion,
  MathVisualSpec,
} from '../../subjects/math/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { MathVisual } from '../artwork/MathVisual';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';

type MathStage = 'concept' | 'sprint' | 'challenge' | 'complete';

export interface MathCompletionPayload {
  summary: RunSummary;
  wordOutcomes: WordOutcomeInput[];
  rawTokensEarned?: number;
}

interface MathRunViewProps {
  questSet: MathQuestSet;
  equippedCollectibleId: string;
  currentTotalTokens: number;
  rewardPolicy?: QuestRewardPolicy;
  onExit: () => void;
  onRecordPartialMastery?: (outcomes: WordOutcomeInput[]) => void;
  onCompleteRun: (payload: MathCompletionPayload) => void;
  onGoToMarket: () => void;
}

const CHOICE_KEYS = ['1', '2', '3', '4'];
const ARCADE_TILES = [
  { bg: '#2563EB', border: '#1E40AF' },
  { bg: '#0D9488', border: '#115E59' },
  { bg: '#EA580C', border: '#9A3412' },
  { bg: '#9333EA', border: '#6B21A8' },
];

export const MathRunView: React.FC<MathRunViewProps> = ({
  questSet,
  equippedCollectibleId,
  currentTotalTokens,
  rewardPolicy,
  onExit,
  onRecordPartialMastery,
  onCompleteRun,
  onGoToMarket,
}) => {
  const prefersReduced = useReducedMotion();
  const plan = useMemo(() => buildMathRun(questSet), [questSet]);
  const multiplier = questSet.tokenMultiplier ?? 1;
  const [lockedPolicy] = useState<QuestRewardPolicy | undefined>(() => rewardPolicy);
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [stage, setStage] = useState<MathStage>('concept');
  const [conceptIdx, setConceptIdx] = useState(0);
  const awardedConceptRef = useRef<Set<number>>(new Set());
  const partialSavedRef = useRef(false);
  const completedRef = useRef(false);
  const answeringRef = useRef(false);

  const [sprintQueue, setSprintQueue] = useState<
    { question: MathSprintQuestion; requeued: boolean }[]
  >(() => plan.sprintQuestions.map((question) => ({ question, requeued: false })));

  const [challengeQueue, setChallengeQueue] = useState<
    { question: MathChallengeQuestion; requeued: boolean }[]
  >(() => plan.challengeQuestions.map((question) => ({ question, requeued: false })));

  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [cleanCount, setCleanCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [outcomes, setOutcomes] = useState<WordOutcomeInput[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [chestTokens, setChestTokens] = useState(0);

  const [feedback, setFeedback] = useState<{
    kind: 'correct' | 'requeue';
    stageKind: 'sprint' | 'challenge';
    answer: string;
    explanation: string;
    visual?: MathVisualSpec;
    gain: number;
    canContinue: boolean;
  } | null>(null);

  const currentConcept = plan.conceptItems[conceptIdx];
  const currentSprint = sprintQueue[0];
  const currentChallenge = challengeQueue[0];

  const handleExitWithMastery = () => {
    if (stage !== 'complete' && outcomes.length > 0 && !partialSavedRef.current) {
      partialSavedRef.current = true;
      onRecordPartialMastery?.(outcomes);
    }
    onExit();
  };

  const finishMathRun = (
    finalRunningTokens: number,
    finalMaxCombo: number,
    finalClean: number,
    finalAttempts: number,
    finalOutcomes: WordOutcomeInput[],
  ) => {
    if (completedRef.current) return;
    completedRef.current = true;
    partialSavedRef.current = true;
    const bonus = Math.round(25 * multiplier);
    const rawTotal = finalRunningTokens + bonus;
    const awardedTotal = applyQuestRewardMultiplier(rawTotal, policyMult);
    const awardedChest = applyQuestRewardMultiplier(bonus, policyMult);
    const accuracyPct = finalAttempts > 0 ? Math.round((finalClean / finalAttempts) * 100) : 100;
    const nowIso = new Date().toISOString();

    setChestTokens(awardedChest);
    setTokensEarned(rawTotal);
    audioService.playChest();

    onCompleteRun({
      summary: {
        id: `mrun-${Date.now().toString(36)}`,
        subjectId: 'math',
        questSetId: questSet.id,
        questSetTitle: questSet.title,
        tokensEarned: awardedTotal,
        maxCombo: finalMaxCombo,
        accuracyPct,
        completedAt: nowIso,
      },
      wordOutcomes: finalOutcomes,
      rawTokensEarned: rawTotal,
    });

    setStage('complete');
  };

  const handleConceptNext = (idx: number = conceptIdx) => {
    if (awardedConceptRef.current.has(idx)) return;
    awardedConceptRef.current.add(idx);
    audioService.playToken();
    setTokensEarned((t) => t + Math.round(1 * multiplier));
    if (idx + 1 < plan.conceptItems.length) {
      setConceptIdx(idx + 1);
    } else {
      setStage('sprint');
    }
  };

  const handleAdvanceAfterMiss = () => {
    if (!feedback || feedback.kind !== 'requeue' || !feedback.canContinue || !answeringRef.current) return;
    const stageKind = feedback.stageKind;
    answeringRef.current = false;
    setFeedback(null);
    setShowHint(false);
    if (stageKind === 'sprint') {
      setSprintQueue((prev) => {
        const [head, ...rest] = prev;
        if (!head) return prev;
        return [...rest, { question: head.question, requeued: true }];
      });
    } else {
      setChallengeQueue((prev) => {
        const [head, ...rest] = prev;
        if (!head) return prev;
        return [...rest, { question: head.question, requeued: true }];
      });
    }
  };

  const handleSprintPick = (choice: string) => {
    if (!currentSprint || feedback || answeringRef.current) return;
    answeringRef.current = true;
    const { question, requeued } = currentSprint;
    const isCorrect = choice === question.correctAnswer;
    const nextAttempts = attemptCount + 1;
    setAttemptCount(nextAttempts);

    if (isCorrect) {
      const nextCombo = requeued ? 0 : combo + 1;
      const gain = Math.round(calculateQuestionTokens(requeued ? 2 : 5, nextCombo) * multiplier);
      setCombo(nextCombo);
      setMaxCombo((m) => Math.max(m, nextCombo));
      setTokensEarned((t) => t + gain);
      if (!requeued) {
        setCleanCount((n) => n + 1);
        setOutcomes((prev) => [
          ...prev,
          {
            word: question.item.skillLabel,
            subjectId: 'math',
            tier: question.item.tier,
            outcome: 'clean',
          },
        ]);
      }
      audioService.playCorrect(nextCombo);
      setFeedback({
        kind: 'correct',
        stageKind: 'sprint',
        answer: question.correctAnswer,
        explanation: question.explanation,
        gain,
        canContinue: false,
      });

      window.setTimeout(() => {
        answeringRef.current = false;
        setFeedback(null);
        setSprintQueue((prev) => {
          const rest = prev.slice(1);
          if (rest.length === 0) setStage('challenge');
          return rest;
        });
      }, 720);
    } else {
      setCombo(0);
      setOutcomes((prev) => [
        ...prev,
        {
          word: question.item.skillLabel,
          subjectId: 'math',
          tier: question.item.tier,
          outcome: 'missed',
        },
      ]);
      audioService.playNudge();
      setFeedback({
        kind: 'requeue',
        stageKind: 'sprint',
        answer: question.correctAnswer,
        explanation: question.explanation,
        visual: question.visual,
        gain: 0,
        canContinue: false,
      });

      window.setTimeout(() => {
        setFeedback((cur) => (cur ? { ...cur, canContinue: true } : null));
      }, 800);
    }
  };

  const handleChallengePick = (choice: string) => {
    if (!currentChallenge || feedback || answeringRef.current) return;
    answeringRef.current = true;
    const { question, requeued } = currentChallenge;
    const isCorrect = choice === question.correctAnswer;
    const nextAttempts = attemptCount + 1;
    setAttemptCount(nextAttempts);

    if (isCorrect) {
      const nextCombo = requeued ? 0 : combo + 1;
      const nextMaxCombo = Math.max(maxCombo, nextCombo);
      const gain = Math.round(calculateQuestionTokens(requeued ? 3 : 6, nextCombo) * multiplier);
      const nextTokens = tokensEarned + gain;
      const nextClean = requeued ? cleanCount : cleanCount + 1;
      const nextOutcomes: WordOutcomeInput[] = requeued
        ? outcomes
        : [
            ...outcomes,
            {
              word: question.item.skillLabel,
              subjectId: 'math',
              tier: question.item.tier,
              outcome: 'clean',
            },
          ];

      setCombo(nextCombo);
      setMaxCombo(nextMaxCombo);
      setTokensEarned(nextTokens);
      setCleanCount(nextClean);
      setOutcomes(nextOutcomes);
      audioService.playCorrect(nextCombo);
      setFeedback({
        kind: 'correct',
        stageKind: 'challenge',
        answer: question.correctAnswer,
        explanation: question.stepHint,
        gain,
        canContinue: false,
      });

      const isLast = challengeQueue.length <= 1;
      window.setTimeout(() => {
        answeringRef.current = false;
        setFeedback(null);
        setShowHint(false);
        if (isLast) {
          setChallengeQueue([]);
          finishMathRun(nextTokens, nextMaxCombo, nextClean, nextAttempts, nextOutcomes);
        } else {
          setChallengeQueue((prev) => prev.slice(1));
        }
      }, 800);
    } else {
      setCombo(0);
      setOutcomes((prev) => [
        ...prev,
        {
          word: question.item.skillLabel,
          subjectId: 'math',
          tier: question.item.tier,
          outcome: 'missed',
        },
      ]);
      audioService.playNudge();
      setFeedback({
        kind: 'requeue',
        stageKind: 'challenge',
        answer: question.correctAnswer,
        explanation: question.stepHint,
        visual: question.visual,
        gain: 0,
        canContinue: false,
      });

      window.setTimeout(() => {
        setFeedback((cur) => (cur ? { ...cur, canContinue: true } : null));
      }, 800);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (stage === 'complete') return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (feedback?.kind === 'requeue' && feedback.canContinue && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleAdvanceAfterMiss();
        return;
      }

      if (feedback) return;

      if (stage === 'concept' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleConceptNext(conceptIdx);
        return;
      }

      const idx = CHOICE_KEYS.indexOf(e.key);
      if (idx === -1) return;

      if (stage === 'sprint' && currentSprint?.question.choices[idx]) {
        e.preventDefault();
        handleSprintPick(currentSprint.question.choices[idx]);
      } else if (stage === 'challenge' && currentChallenge?.question.choices[idx]) {
        e.preventDefault();
        handleChallengePick(currentChallenge.question.choices[idx]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const stageStep = stage === 'concept' ? 0 : stage === 'sprint' ? 1 : stage === 'challenge' ? 2 : 3;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Compact Arcade HUD */}
      <div className="qv-surface rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleExitWithMastery}
          className="qv-btn inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#57534E] hover:bg-[#F3EFE7]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-extrabold">
          {[
            { num: 0, label: 'Visuals' },
            { num: 1, label: 'Sprint' },
            { num: 2, label: 'Word Probs' },
          ].map((s) => (
            <span
              key={s.num}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                stageStep === s.num
                  ? 'bg-[#2563EB] text-white'
                  : stageStep > s.num
                    ? 'bg-[#ECFDF5] text-[#047857]'
                    : 'bg-[#F3EFE7] text-[#78716C]'
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 tabular-nums">
          {multiplier > 1 && (
            <span className="rounded-full bg-[#E11D48] px-2 py-0.5 text-xs font-extrabold text-white">
              {multiplier}×
            </span>
          )}
          {combo >= 2 && (
            <motion.span
              key={combo}
              initial={prefersReduced ? false : { scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#F97316] px-2.5 py-1 text-xs font-extrabold text-[#C2410C]"
            >
              <Flame className="h-3.5 w-3.5 fill-current text-[#EA580C]" />
              {combo}×
            </motion.span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#1C1917] px-3 py-1 text-sm font-extrabold">
            <Coins className="h-3.5 w-3.5 text-[#D97706]" />
            +{applyQuestRewardMultiplier(tokensEarned, policyMult)}
          </span>
        </div>
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang="en" />

      <AnimatePresence mode="wait">
        {/* STAGE 0: VISUAL CONCEPT CARD (TEACH FIRST) */}
        {stage === 'concept' && currentConcept && (
          <motion.section
            key={`mc-${conceptIdx}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.12 }}
            className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5"
          >
            <div className="flex items-center justify-between text-xs font-extrabold text-[#57534E] tabular-nums">
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[#1D4ED8]">
                Visual Trick · {conceptIdx + 1}/{plan.conceptItems.length}
              </span>
              <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[#B45309]">
                +{Math.round(1 * multiplier)} Token
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
                {currentConcept.conceptTitle}
              </h1>

              <div className="rounded-2xl border-2 border-[#E7E2D8] bg-[#FAF7F2] p-4">
                <MathVisual spec={currentConcept.visual} />
              </div>

              <span className="inline-block rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] px-5 py-2 font-display text-lg sm:text-xl font-extrabold text-[#92400E] tabular-nums">
                {currentConcept.conceptFormula}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleConceptNext(conceptIdx)}
              className="qv-arcade-btn inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-8 py-4 font-display text-lg font-extrabold text-white"
              style={{ borderBottomColor: '#065F46' }}
            >
              <span>
                {conceptIdx + 1 < plan.conceptItems.length ? 'Got It! Next Trick' : 'Ready! Start Sprint!'}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.section>
        )}

        {/* STAGE 1: MATH SPRINT */}
        {stage === 'sprint' && currentSprint && (
          <motion.section
            key={`${currentSprint.question.id}-${sprintQueue.length}-${currentSprint.requeued}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.12 }}
            className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={feedback?.kind === 'correct' ? 'qv-hop' : 'qv-float'}>
                  <CollectibleArt
                    id={equippedCollectibleId}
                    size={52}
                    className="border-2 border-[#1C1917]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-lg font-extrabold">Math Sprint</h1>
                    {currentSprint.requeued && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309]">
                        <RotateCcw className="h-3 w-3" />
                        Retry
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#57534E] tabular-nums">
                    {sprintQueue.length} left
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => audioService.speak(currentSprint.question.promptText, 'en-US')}
                aria-label="Read math problem aloud"
                className="qv-btn inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#E7E2D8] bg-[#FAF7F2] text-[#2563EB]"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-[#FAF7F2] border-2 border-[#E7E2D8] p-5 space-y-4">
              <p className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-snug tabular-nums">
                {currentSprint.question.promptText}
              </p>

              {(() => {
                const sprintVisualToShow = feedback
                  ? currentSprint.question.visual
                  : currentSprint.question.revealVisualOnFeedback
                    ? undefined
                    : currentSprint.question.visual;
                if (!sprintVisualToShow) return null;
                return (
                  <div className="rounded-xl bg-white border border-[#E7E2D8] p-3">
                    <MathVisual spec={sprintVisualToShow} />
                  </div>
                );
              })()}

              {feedback && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-extrabold tabular-nums ${
                      feedback.kind === 'correct'
                        ? 'bg-[#ECFDF5] text-[#047857]'
                        : 'bg-[#FFF1F2] text-[#BE123C]'
                    }`}
                  >
                    {feedback.kind === 'correct'
                      ? `+${feedback.gain} Tokens!`
                      : `${feedback.answer} · ${feedback.explanation}`}
                  </div>

                  {feedback.kind === 'requeue' && (
                    <button
                      type="button"
                      disabled={!feedback.canContinue}
                      onClick={handleAdvanceAfterMiss}
                      className="qv-arcade-btn inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-4 py-2 text-sm font-extrabold text-white disabled:opacity-45"
                    >
                      <span>Got It, Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentSprint.question.choices.map((choice, idx) => {
                const theme = ARCADE_TILES[idx % ARCADE_TILES.length];
                const isAnswer = feedback && choice === currentSprint.question.correctAnswer;
                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={Boolean(feedback)}
                    onClick={() => handleSprintPick(choice)}
                    className="qv-arcade-btn flex items-center justify-between gap-3 rounded-2xl border-2 border-[#1C1917] px-5 py-4 text-left font-display text-xl font-extrabold text-white tabular-nums disabled:cursor-default"
                    style={{
                      backgroundColor: isAnswer ? '#059669' : theme.bg,
                      borderBottomColor: isAnswer ? '#065F46' : theme.border,
                      opacity: feedback && !isAnswer ? 0.45 : 1,
                    }}
                  >
                    <span>{choice}</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                      {CHOICE_KEYS[idx]}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* STAGE 2: WORD PROBLEM CHALLENGE */}
        {stage === 'challenge' && currentChallenge && (
          <motion.section
            key={`${currentChallenge.question.id}-${challengeQueue.length}-${currentChallenge.requeued}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
            className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={feedback?.kind === 'correct' ? 'qv-hop' : 'qv-float'}>
                  <CollectibleArt
                    id={equippedCollectibleId}
                    size={52}
                    className="border-2 border-[#1C1917]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-lg font-extrabold">Word Problem Boss!</h1>
                    {currentChallenge.requeued && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309]">
                        <RotateCcw className="h-3 w-3" />
                        Retry
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#57534E] tabular-nums">
                    {challengeQueue.length} left · +{Math.round(25 * multiplier)} Chest ahead
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#F59E0B] bg-[#FFFBEB] px-3 py-1.5 text-xs font-extrabold text-[#B45309]"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Hint</span>
                </button>
                <button
                  type="button"
                  onClick={() => audioService.speak(currentChallenge.question.promptText, 'en-US')}
                  aria-label="Read word problem aloud"
                  className="qv-btn inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E7E2D8] bg-[#FAF7F2] text-[#2563EB]"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#EFF6FF] border-2 border-[#BFDBFE] p-5 space-y-4">
              <p className="font-display text-lg sm:text-xl font-extrabold text-[#1E3A8A] leading-snug">
                {currentChallenge.question.promptText}
              </p>

              {currentChallenge.question.visual && (
                <div className="rounded-xl bg-white border border-[#BFDBFE] p-3">
                  <MathVisual spec={currentChallenge.question.visual} />
                </div>
              )}

              {showHint && !feedback && (
                <div className="rounded-xl bg-[#FFFBEB] border border-[#FCD34D] px-3.5 py-2 text-xs font-bold text-[#92400E]">
                  Step Hint: {currentChallenge.question.stepHint}
                </div>
              )}

              {feedback && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-extrabold tabular-nums ${
                      feedback.kind === 'correct'
                        ? 'bg-[#ECFDF5] text-[#047857]'
                        : 'bg-[#FFF1F2] text-[#BE123C]'
                    }`}
                  >
                    {feedback.kind === 'correct'
                      ? `Solved! +${feedback.gain} Tokens`
                      : `${feedback.answer} · ${feedback.explanation}`}
                  </div>

                  {feedback.kind === 'requeue' && (
                    <button
                      type="button"
                      disabled={!feedback.canContinue}
                      onClick={handleAdvanceAfterMiss}
                      className="qv-arcade-btn inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-4 py-2 text-sm font-extrabold text-white disabled:opacity-45"
                    >
                      <span>Got It, Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentChallenge.question.choices.map((choice, idx) => {
                const theme = ARCADE_TILES[idx % ARCADE_TILES.length];
                const isAnswer = feedback && choice === currentChallenge.question.correctAnswer;
                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={Boolean(feedback)}
                    onClick={() => handleChallengePick(choice)}
                    className="qv-arcade-btn flex items-center justify-between gap-3 rounded-2xl border-2 border-[#1C1917] px-5 py-4 text-left font-display text-lg sm:text-xl font-extrabold text-white tabular-nums disabled:cursor-default"
                    style={{
                      backgroundColor: isAnswer ? '#059669' : theme.bg,
                      borderBottomColor: isAnswer ? '#065F46' : theme.border,
                      opacity: feedback && !isAnswer ? 0.45 : 1,
                    }}
                  >
                    <span>{choice}</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                      {CHOICE_KEYS[idx]}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* STAGE 3: RUN COMPLETE */}
        {stage === 'complete' && (
          <motion.section
            key="m-complete"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="qv-float rounded-3xl border-2 border-[#1C1917] bg-[#FEF3C7] p-2">
                <CollectibleArt id={equippedCollectibleId} size={112} />
              </div>
            </div>

            <div>
              <h1 className="font-display text-3xl font-extrabold">Math Quest Complete!</h1>
              <p className="mt-1 text-base font-bold text-[#D97706] tabular-nums">
                +{chestTokens} Chest Bonus · +{applyQuestRewardMultiplier(tokensEarned, policyMult)} Total Tokens!
              </p>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-3 gap-3 tabular-nums">
              <div className="rounded-2xl bg-[#FEF3C7] p-3">
                <div className="text-xs font-bold text-[#92400E]">Tokens</div>
                <div className="font-display text-2xl font-extrabold">
                  +{applyQuestRewardMultiplier(tokensEarned, policyMult)}
                </div>
              </div>
              <div className="rounded-2xl bg-[#FFF7ED] p-3">
                <div className="text-xs font-bold text-[#9A3412]">Max Combo</div>
                <div className="font-display text-2xl font-extrabold">{maxCombo}×</div>
              </div>
              <div className="rounded-2xl bg-[#ECFDF5] p-3">
                <div className="text-xs font-bold text-[#065F46]">Packs Ready</div>
                <div className="font-display text-2xl font-extrabold">
                  {Math.floor(currentTotalTokens / PACK_COST)}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onGoToMarket}
                className="qv-arcade-btn inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-6 py-3.5 font-display text-base font-extrabold text-white"
                style={{ borderBottomColor: '#1E3A8A' }}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Open Packs!</span>
              </button>
              <button
                type="button"
                onClick={onExit}
                className="qv-btn w-full sm:w-auto rounded-2xl border-2 border-[#E7E2D8] bg-white px-5 py-3.5 text-sm font-extrabold text-[#57534E]"
              >
                Back to Quests
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coins,
  Flame,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  applyQuestRewardMultiplier,
  calculateForgeChestTokens,
  calculateQuestionTokens,
  type QuestRewardPolicy,
} from '../../core/economy';
import type { WordOutcomeInput } from '../../core/mastery';
import { PACK_COST } from '../../core/packs';
import type { RunSummary, WritingEntry } from '../../core/types';
import { buildEnglishRun } from '../../subjects/english/runEngine';
import type { SprintQuestion, UpgradeQuestion, WordSet } from '../../subjects/english/types';
import { deterministicWritingEvaluator } from '../../subjects/english/writingChecks';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { useKeyboardSafeArea } from '../hooks/useKeyboardSafeArea';

type RunStage = 'spotlight' | 'sprint' | 'upgrade' | 'forge' | 'complete';

export interface RunCompletionPayload {
  summary: RunSummary;
  writingEntry: WritingEntry;
  wordOutcomes: WordOutcomeInput[];
  rawTokensEarned?: number;
}

interface RunViewProps {
  wordSet: WordSet;
  equippedCollectibleId: string;
  currentTotalTokens: number;
  rewardPolicy?: QuestRewardPolicy;
  onExit: () => void;
  onRecordPartialMastery?: (outcomes: WordOutcomeInput[]) => void;
  onCompleteRun: (payload: RunCompletionPayload) => void;
  onGoToMarket: () => void;
}

const CHOICE_KEYS = ['1', '2', '3', '4'];
const ARCADE_TILES = [
  { bg: '#2563EB', border: '#1E40AF' },
  { bg: '#0D9488', border: '#115E59' },
  { bg: '#EA580C', border: '#9A3412' },
  { bg: '#9333EA', border: '#6B21A8' },
];

export const RunView: React.FC<RunViewProps> = ({
  wordSet,
  equippedCollectibleId,
  currentTotalTokens,
  rewardPolicy,
  onExit,
  onRecordPartialMastery,
  onCompleteRun,
  onGoToMarket,
}) => {
  const prefersReduced = useReducedMotion();
  const plan = useMemo(() => buildEnglishRun(wordSet), [wordSet]);
  const multiplier = wordSet.tokenMultiplier ?? 1;
  const [lockedPolicy] = useState<QuestRewardPolicy | undefined>(() => rewardPolicy);
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [stage, setStage] = useState<RunStage>('spotlight');
  const [spotIdx, setSpotIdx] = useState(0);
  const awardedSpotRef = useRef<Set<number>>(new Set());
  const partialSavedRef = useRef(false);
  const completedRef = useRef(false);
  const answeringRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const unmountedRef = useRef(false);

  const scheduleTimeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      if (unmountedRef.current) return;
      fn();
    }, ms);
    timersRef.current.push(id);
  };

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      audioService.stopSpeech();
    };
  }, []);

  // Mastery Queue (anti-brute-force: missed items move to back of queue!)
  const [sprintQueue, setSprintQueue] = useState<
    { question: SprintQuestion; requeued: boolean }[]
  >(() => plan.sprintQuestions.map((question) => ({ question, requeued: false })));

  const [upgradeQueue, setUpgradeQueue] = useState<
    { question: UpgradeQuestion; requeued: boolean }[]
  >(() => plan.upgradeQuestions.map((question) => ({ question, requeued: false })));

  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [cleanCount, setCleanCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [outcomes, setOutcomes] = useState<WordOutcomeInput[]>([]);

  // Feedback lock (prevents spam-clicking; missed cards advance via explicit "Got It, Next" button)
  const [feedback, setFeedback] = useState<{
    kind: 'correct' | 'requeue';
    stageKind: 'sprint' | 'upgrade';
    word: string;
    bridge: string;
    gain: number;
    canContinue: boolean;
  } | null>(null);

  // Stage 3: Writer's Forge
  const [sentence, setSentence] = useState('');
  const [inspectedWord, setInspectedWord] = useState<string | null>(
    plan.forgePrompt.targetWords[0] ?? null,
  );
  const [chestTokens, setChestTokens] = useState(0);
  const [finalSentence, setFinalSentence] = useState('');
  const forgeTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    bottomPaddingPx: forgeBottomPad,
    handleFocus: handleForgeFocus,
    handleBlur: handleForgeBlur,
  } = useKeyboardSafeArea();

  const currentSpot = plan.spotlightWords[spotIdx];
  const currentSprintItem = sprintQueue[0];
  const currentUpgradeItem = upgradeQueue[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [stage]);

  const writingEval = useMemo(
    () =>
      deterministicWritingEvaluator.evaluate(
        sentence,
        plan.forgePrompt.targetWords,
        plan.forgePrompt.scenario,
        plan.forgePrompt.starterChips,
      ),
    [
      sentence,
      plan.forgePrompt.targetWords,
      plan.forgePrompt.scenario,
      plan.forgePrompt.starterChips,
    ],
  );

  const handleExitWithMastery = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    audioService.stopSpeech();
    if (stage !== 'complete' && outcomes.length > 0 && !partialSavedRef.current) {
      partialSavedRef.current = true;
      onRecordPartialMastery?.(outcomes);
    }
    onExit();
  };

  // Stage 0: Word Spotlight (Teach First!)
  const handleSpotlightNext = (idx: number = spotIdx) => {
    if (awardedSpotRef.current.has(idx)) return;
    awardedSpotRef.current.add(idx);
    audioService.playToken();
    setTokensEarned((t) => t + Math.round(1 * multiplier));
    if (idx + 1 < plan.spotlightWords.length) {
      setSpotIdx(idx + 1);
    } else {
      setStage('sprint');
    }
  };

  const handleAdvanceAfterMiss = () => {
    if (!feedback || feedback.kind !== 'requeue' || !feedback.canContinue || !answeringRef.current) return;
    const stageKind = feedback.stageKind;
    answeringRef.current = false;
    setFeedback(null);
    if (stageKind === 'sprint') {
      setSprintQueue((prev) => {
        const [head, ...rest] = prev;
        if (!head) return prev;
        return [...rest, { question: head.question, requeued: true }];
      });
    } else {
      setUpgradeQueue((prev) => {
        const [head, ...rest] = prev;
        if (!head) return prev;
        return [...rest, { question: head.question, requeued: true }];
      });
    }
  };

  // Stage 1: Word Sprint with Anti-Brute-Force Mastery Queue
  const handleSprintPick = (choice: string) => {
    if (!currentSprintItem || feedback || answeringRef.current) return;
    answeringRef.current = true;
    const { question, requeued } = currentSprintItem;
    const isCorrect = choice === question.correctWord;
    setAttemptCount((n) => n + 1);

    if (isCorrect) {
      const nextCombo = requeued ? 0 : combo + 1;
      const gain = Math.round(calculateQuestionTokens(requeued ? 2 : 4, nextCombo) * multiplier);
      setCombo(nextCombo);
      setMaxCombo((m) => Math.max(m, nextCombo));
      setTokensEarned((t) => t + gain);
      if (!requeued) {
        setCleanCount((n) => n + 1);
        setOutcomes((prev) => [
          ...prev,
          { word: question.correctWord, tier: question.targetWord.tier, outcome: 'clean' },
        ]);
      }
      audioService.playCorrect(nextCombo);
      setFeedback({
        kind: 'correct',
        stageKind: 'sprint',
        word: question.correctWord,
        bridge: question.targetWord.plainBridge,
        gain,
        canContinue: false,
      });

      scheduleTimeout(() => {
        answeringRef.current = false;
        setFeedback(null);
        setSprintQueue((prev) => {
          const rest = prev.slice(1);
          if (rest.length === 0) setStage('upgrade');
          return rest;
        });
      }, 720);
    } else {
      // Missed: lock answer buttons, teach word = plainBridge, require explicit "Got It, Next" tap, move to back of Mastery Queue!
      setCombo(0);
      setOutcomes((prev) => [
        ...prev,
        { word: question.correctWord, tier: question.targetWord.tier, outcome: 'missed' },
      ]);
      audioService.playNudge();
      setFeedback({
        kind: 'requeue',
        stageKind: 'sprint',
        word: question.correctWord,
        bridge: question.targetWord.plainBridge,
        gain: 0,
        canContinue: false,
      });

      scheduleTimeout(() => {
        setFeedback((cur) => (cur ? { ...cur, canContinue: true } : null));
      }, 800);
    }
  };

  // Stage 2: Sentence Upgrade with Anti-Brute-Force Mastery Queue
  const handleUpgradePick = (choice: string) => {
    if (!currentUpgradeItem || feedback || answeringRef.current) return;
    answeringRef.current = true;
    const { question, requeued } = currentUpgradeItem;
    const isCorrect = choice === question.correctWord;
    setAttemptCount((n) => n + 1);

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
          { word: question.correctWord, tier: question.targetWord.tier, outcome: 'clean' },
        ]);
      }
      audioService.playCorrect(nextCombo);
      setFeedback({
        kind: 'correct',
        stageKind: 'upgrade',
        word: question.correctWord,
        bridge: question.targetWord.plainBridge,
        gain,
        canContinue: false,
      });

      scheduleTimeout(() => {
        answeringRef.current = false;
        setFeedback(null);
        setUpgradeQueue((prev) => {
          const rest = prev.slice(1);
          if (rest.length === 0) setStage('forge');
          return rest;
        });
      }, 850);
    } else {
      setCombo(0);
      setOutcomes((prev) => [
        ...prev,
        { word: question.correctWord, tier: question.targetWord.tier, outcome: 'missed' },
      ]);
      audioService.playNudge();
      setFeedback({
        kind: 'requeue',
        stageKind: 'upgrade',
        word: question.correctWord,
        bridge: question.targetWord.plainBridge,
        gain: 0,
        canContinue: false,
      });

      scheduleTimeout(() => {
        setFeedback((cur) => (cur ? { ...cur, canContinue: true } : null));
      }, 800);
    }
  };

  // Keyboard shortcuts (1-4 & Enter) for Chromebook — guarded against focused inputs
  const onKeyDownRef = useRef<(e: KeyboardEvent) => void>(() => {});
  onKeyDownRef.current = (e: KeyboardEvent) => {
    if (stage === 'forge' || stage === 'complete') return;
    const tag = (document.activeElement as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (feedback?.kind === 'requeue' && feedback.canContinue && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleAdvanceAfterMiss();
      return;
    }

    if (feedback) return;

    if (stage === 'spotlight' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleSpotlightNext(spotIdx);
      return;
    }

    const idx = CHOICE_KEYS.indexOf(e.key);
    if (idx === -1) return;

    if (stage === 'sprint' && currentSprintItem?.question.choices[idx]) {
      e.preventDefault();
      handleSprintPick(currentSprintItem.question.choices[idx]);
    } else if (stage === 'upgrade' && currentUpgradeItem?.question.choices[idx]) {
      e.preventDefault();
      handleUpgradePick(currentUpgradeItem.question.choices[idx]);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => onKeyDownRef.current(e);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleForgeSubmit = () => {
    if (!writingEval.canUnlockChest || completedRef.current) return;
    completedRef.current = true;
    partialSavedRef.current = true;

    const bonus = Math.round(
      calculateForgeChestTokens(writingEval.passedCount, writingEval.totalCount) * multiplier,
    );
    const rawTotalRunTokens = tokensEarned + bonus;
    const awardedRunTokens = applyQuestRewardMultiplier(rawTotalRunTokens, policyMult);
    const awardedChestTokens = applyQuestRewardMultiplier(bonus, policyMult);
    const accuracyPct =
      attemptCount > 0 ? Math.round((cleanCount / attemptCount) * 100) : 100;
    const nowIso = new Date().toISOString();

    const writingOutcomes: WordOutcomeInput[] = writingEval.matchedWords.map((w) => ({
      word: w,
      tier: wordSet.tier,
      outcome: 'writing',
      nowIso,
    }));

    setChestTokens(awardedChestTokens);
    setTokensEarned(rawTotalRunTokens);
    setFinalSentence(sentence.trim());
    audioService.playChest();

    onCompleteRun({
      summary: {
        id: `run-${Date.now().toString(36)}`,
        subjectId: 'english',
        questSetId: wordSet.id,
        questSetTitle: wordSet.title,
        tokensEarned: awardedRunTokens,
        maxCombo,
        accuracyPct,
        completedAt: nowIso,
      },
      writingEntry: {
        id: `write-${Date.now().toString(36)}`,
        subjectId: 'english',
        questSetId: wordSet.id,
        questSetTitle: wordSet.title,
        targetWords: writingEval.matchedWords,
        sentence: sentence.trim(),
        createdAt: nowIso,
      },
      wordOutcomes: [...outcomes, ...writingOutcomes],
      rawTokensEarned: rawTotalRunTokens,
    });

    setStage('complete');
  };

  const insertWordIntoSentence = (word: string) => {
    setSentence((prev) => {
      if (!prev.trim()) return `${word} `;
      const needsSpace = !/\s$/.test(prev);
      return `${prev}${needsSpace ? ' ' : ''}${word} `;
    });
  };

  const displayedTokens = applyQuestRewardMultiplier(tokensEarned, policyMult);
  const stageStep =
    stage === 'spotlight' ? 0 : stage === 'sprint' ? 1 : stage === 'upgrade' ? 2 : stage === 'forge' ? 3 : 4;
  const inspectedEntry = plan.forgePrompt.wordGlossary.find((w) => w.word === inspectedWord);

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
            { num: 0, label: 'Learn' },
            { num: 1, label: 'Sprint' },
            { num: 2, label: 'Upgrade' },
            { num: 3, label: 'Write' },
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
            +{displayedTokens}
          </span>
        </div>
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang="en" />

      <AnimatePresence mode="wait">
        {/* STAGE 0: WORD SPOTLIGHT (TEACH FIRST!) */}
        {stage === 'spotlight' && currentSpot && (
          <motion.section
            key={`spot-${spotIdx}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.12 }}
            className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-6"
          >
            <div className="flex items-center justify-between text-xs font-extrabold text-[#57534E] tabular-nums">
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[#1D4ED8]">
                Learn First · {spotIdx + 1}/{plan.spotlightWords.length}
              </span>
              <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[#B45309]">
                +{Math.round(1 * multiplier)} Token
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 py-2">
              <div className="qv-float">
                <CollectibleArt
                  id={wordSet.emblemCollectibleId}
                  size={74}
                  className="border-2 border-[#1C1917]"
                />
              </div>

              <div className="flex items-center gap-3">
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#1C1917]">
                  {currentSpot.word}
                </h1>
                <button
                  type="button"
                  onClick={() => audioService.speak(currentSpot.word, 'en-US')}
                  aria-label={`Hear ${currentSpot.word}`}
                  className="qv-btn inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1C1917] bg-[#EFF6FF] text-[#2563EB]"
                >
                  <Volume2 className="h-6 w-6" />
                </button>
              </div>

              <span className="inline-block rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] px-5 py-2 font-display text-xl font-extrabold text-[#92400E]">
                = {currentSpot.plainBridge}
              </span>

              <p className="max-w-lg text-base sm:text-lg font-semibold text-[#44403C] leading-snug pt-1">
                “{currentSpot.contextSentence.replace('___', currentSpot.word)}”
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSpotlightNext(spotIdx)}
              className="qv-arcade-btn inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-8 py-4 font-display text-lg font-extrabold text-white"
              style={{ borderBottomColor: '#065F46' }}
            >
              <span>
                {spotIdx + 1 < plan.spotlightWords.length ? 'Got It! Next Word' : 'Ready! Start Sprint!'}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.section>
        )}

        {/* STAGE 1: WORD SPRINT (BLOOKET 4-COLOR TILES + MASTERY QUEUE) */}
        {stage === 'sprint' && currentSprintItem && (
          <motion.section
            key={`${currentSprintItem.question.id}-${sprintQueue.length}-${currentSprintItem.requeued}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.12 }}
            className="qv-surface rounded-3xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={feedback?.kind === 'correct' ? 'qv-hop' : 'qv-float'}>
                  <CollectibleArt
                    id={equippedCollectibleId}
                    size={54}
                    className="border-2 border-[#1C1917]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-lg font-extrabold">Word Sprint</h1>
                    {currentSprintItem.requeued && (
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
                onClick={() =>
                  audioService.speak(
                    currentSprintItem.question.promptText.replace('___', 'blank'),
                    'en-US',
                  )
                }
                aria-label="Hear sentence"
                className="qv-btn inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#E7E2D8] bg-[#FAF7F2] text-[#2563EB]"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-[#FAF7F2] border-2 border-[#E7E2D8] p-5 sm:p-6">
              <p className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-snug">
                {currentSprintItem.question.promptText.split('___').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span
                        className={`mx-1.5 inline-block rounded-xl px-3 py-0.5 border-2 ${
                          feedback?.kind === 'correct'
                            ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                            : feedback?.kind === 'requeue'
                              ? 'border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]'
                              : 'border-dashed border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                        }`}
                      >
                        {feedback ? feedback.word : '_____'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>

              {feedback && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-extrabold tabular-nums ${
                      feedback.kind === 'correct'
                        ? 'bg-[#ECFDF5] text-[#047857]'
                        : 'bg-[#FFF1F2] text-[#BE123C]'
                    }`}
                  >
                    {feedback.kind === 'correct' ? (
                      <span>+{feedback.gain} Tokens!</span>
                    ) : (
                      <span>
                        {feedback.word} = {feedback.bridge} · We’ll try it again soon!
                      </span>
                    )}
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

            {/* Blooket-Style 4-Color Chunky Arcade Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentSprintItem.question.choices.map((choice, idx) => {
                const theme = ARCADE_TILES[idx % ARCADE_TILES.length];
                const isAnswer = feedback && choice === currentSprintItem.question.correctWord;
                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={Boolean(feedback)}
                    onClick={() => handleSprintPick(choice)}
                    className="qv-arcade-btn flex items-center justify-between gap-3 rounded-2xl border-2 border-[#1C1917] px-5 py-4 text-left font-display text-xl font-extrabold text-white disabled:cursor-default"
                    style={{
                      backgroundColor: isAnswer ? '#059669' : theme.bg,
                      borderBottomColor: isAnswer ? '#065F46' : theme.border,
                      opacity: feedback && !isAnswer ? 0.45 : 1,
                    }}
                  >
                    <span>{choice}</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold tabular-nums">
                      {CHOICE_KEYS[idx]}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* STAGE 2: SENTENCE UPGRADE (WITH MASTERY QUEUE) */}
        {stage === 'upgrade' && currentUpgradeItem && (
          <motion.section
            key={`${currentUpgradeItem.question.id}-${upgradeQueue.length}-${currentUpgradeItem.requeued}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
            className="qv-surface rounded-3xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={feedback?.kind === 'correct' ? 'qv-hop' : 'qv-float'}>
                  <CollectibleArt
                    id={equippedCollectibleId}
                    size={54}
                    className="border-2 border-[#1C1917]"
                  />
                </div>
                <div>
                  <h1 className="font-display text-lg font-extrabold">Upgrade the Sentence!</h1>
                  <div className="text-xs font-bold text-[#57534E] tabular-nums">
                    {upgradeQueue.length} left
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAF7F2] border-2 border-[#E7E2D8] p-5 sm:p-6">
              <p className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-relaxed">
                {currentUpgradeItem.question.sentenceBefore}
                {feedback ? (
                  <span className="mx-1 inline-block rounded-xl border-2 border-[#059669] bg-[#ECFDF5] px-3 py-0.5 text-[#047857]">
                    {feedback.word}
                  </span>
                ) : (
                  <span className="mx-1 inline-block rounded-xl border-2 border-dashed border-[#D97706] bg-[#FEF3C7] px-3 py-0.5 text-[#92400E]">
                    {currentUpgradeItem.question.plainSpan}
                  </span>
                )}
                {currentUpgradeItem.question.sentenceAfter}
              </p>

              {feedback && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-extrabold tabular-nums ${
                      feedback.kind === 'correct'
                        ? 'bg-[#ECFDF5] text-[#047857]'
                        : 'bg-[#FFF1F2] text-[#BE123C]'
                    }`}
                  >
                    {feedback.kind === 'correct'
                      ? `Upgraded! +${feedback.gain} Tokens`
                      : `${feedback.word} = ${feedback.bridge} · Retry soon!`}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {currentUpgradeItem.question.choices.map((choice, idx) => {
                const theme = ARCADE_TILES[idx % ARCADE_TILES.length];
                const isAnswer = feedback && choice === currentUpgradeItem.question.correctWord;
                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={Boolean(feedback)}
                    onClick={() => handleUpgradePick(choice)}
                    className="qv-arcade-btn rounded-2xl border-2 border-[#1C1917] px-4 py-4 font-display text-xl font-extrabold text-white disabled:cursor-default"
                    style={{
                      backgroundColor: isAnswer ? '#059669' : theme.bg,
                      borderBottomColor: isAnswer ? '#065F46' : theme.border,
                      opacity: feedback && !isAnswer ? 0.45 : 1,
                    }}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* STAGE 3: WRITER'S FORGE (iPad keyboard-safe high textarea layout) */}
        {stage === 'forge' && (
          <div
            key="forge-wrap"
            style={forgeBottomPad > 0 ? { paddingBottom: `${forgeBottomPad}px` } : undefined}
          >
            <motion.section
              key="forge"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="qv-surface rounded-3xl p-4 sm:p-6 space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <CollectibleArt
                    id={equippedCollectibleId}
                    size={42}
                    className="border-2 border-[#1C1917] shrink-0"
                  />
                  <div>
                    <h1 className="font-display text-lg sm:text-2xl font-extrabold leading-tight">
                      Write 1 Original Sentence!
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-[#1E3A8A]">
                      {plan.forgePrompt.scenario}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#FEF3C7] border border-[#1C1917] px-3 py-1 text-xs font-extrabold text-[#92400E] tabular-nums">
                  +{Math.round(25 * multiplier)} Chest
                </span>
              </div>

              {/* Compact Target Word Pills (tap for meaning + insert) */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {plan.forgePrompt.wordGlossary.map((item) => {
                    const used = writingEval.matchedWords.includes(item.word);
                    const selected = inspectedWord === item.word;
                    return (
                      <button
                        key={item.word}
                        type="button"
                        onClick={() => {
                          setInspectedWord(item.word);
                          audioService.speak(item.word, 'en-US');
                        }}
                        className={`qv-btn inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs sm:text-sm font-extrabold ${
                          used
                            ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                            : selected
                              ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                              : 'border-[#E7E2D8] bg-white'
                        }`}
                      >
                        {used ? <Check className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 opacity-70" />}
                        <span>{item.word}</span>
                      </button>
                    );
                  })}
                </div>

                {inspectedEntry && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#57534E]">
                    <span>
                      <strong className="text-[#1C1917]">{inspectedEntry.word}</strong> = {inspectedEntry.plainBridge}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        insertWordIntoSentence(inspectedEntry.word);
                        forgeTextareaRef.current?.focus();
                        try {
                          window.requestAnimationFrame(() => {
                            const el = forgeTextareaRef.current;
                            if (!el) return;
                            const len = el.value.length;
                            el.setSelectionRange?.(len, len);
                          });
                        } catch {
                          // Ignore sandbox rAF limitations
                        }
                      }}
                      className="qv-btn rounded-lg bg-white border border-[#E7E2D8] px-2.5 py-1 font-extrabold text-[#2563EB]"
                    >
                      + Insert
                    </button>
                  </div>
                )}
              </div>

              {/* Writing Input Box positioned HIGH in the card so iPad keyboard never covers it */}
              <div className="space-y-2.5">
                <div className="relative">
                  <textarea
                    ref={forgeTextareaRef}
                    data-testid="forge-textarea"
                    rows={2}
                    value={sentence}
                    autoCapitalize="sentences"
                    onFocus={(e) => handleForgeFocus(e.currentTarget)}
                    onBlur={handleForgeBlur}
                    onChange={(e) => setSentence(e.target.value)}
                    placeholder="Type a complete sentence using 1 Target Word above..."
                    style={{ scrollMarginTop: '88px', scrollMarginBottom: '260px' }}
                    className="w-full rounded-2xl border-2 border-[#D8D0C1] bg-white p-3.5 pr-12 text-base font-medium focus:border-[#2563EB] focus:outline-none"
                  />
                  {sentence.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => audioService.speak(sentence.trim(), 'en-US')}
                      aria-label="Hear my sentence aloud"
                      title="Hear my sentence aloud"
                      className="qv-btn absolute right-2.5 top-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Live Guidance & 4-Check Progress Bubbles */}
                <p
                  data-testid="forge-encouragement"
                  className={`rounded-xl px-3 py-1.5 text-xs font-extrabold ${
                    writingEval.allPassed
                      ? 'bg-[#ECFDF5] text-[#047857]'
                      : 'bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  {writingEval.encouragement}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {writingEval.checks.map((check) => (
                    <div
                      key={check.id}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-extrabold ${
                        check.passed
                          ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]'
                          : 'border-[#E7E2D8] bg-[#FAF7F2] text-[#57534E]'
                      }`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          check.passed ? 'bg-[#059669] text-white' : 'bg-[#E7E2D8] text-[#78716C]'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="tabular-nums">{check.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleForgeSubmit}
                  disabled={!writingEval.canUnlockChest}
                  className={`qv-arcade-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-5 py-3 font-display text-lg font-extrabold tabular-nums ${
                    writingEval.allPassed
                      ? 'border-[#1C1917] bg-[#F59E0B] text-[#1C1917]'
                      : 'border-[#D8D0C1] bg-[#F3EFE7] text-[#A8A29E] cursor-not-allowed'
                  }`}
                  style={
                    writingEval.allPassed
                      ? { borderBottomColor: '#B45309' }
                      : undefined
                  }
                >
                  <Sparkles className="h-5 w-5" />
                  <span>
                    {writingEval.allPassed
                      ? `Open Chest! +${Math.round(25 * multiplier)} Tokens`
                      : `Finish All 4 Checks (${writingEval.passedCount}/4)`}
                  </span>
                </button>

                {/* Optional Quick-Start Inspiration Chips (swaps starter cleanly; does not count as student's own words) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#F0EAE0]">
                  <span className="text-[11px] font-bold text-[#78716C]">
                    Need a starter? (add 4+ own words after):
                  </span>
                  {plan.forgePrompt.starterChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const chipText = chip.endsWith(' ') ? chip : `${chip} `;
                        setSentence((prev) => {
                          const trimmedPrev = prev.trimStart();
                          const existing = plan.forgePrompt.starterChips.find((c) =>
                            trimmedPrev.toLowerCase().startsWith(c.trim().toLowerCase()),
                          );
                          if (existing) {
                            const rest = trimmedPrev.slice(existing.trim().length).trimStart();
                            return rest ? `${chipText}${rest}` : chipText;
                          }
                          return trimmedPrev.length === 0 ? chipText : `${chipText}${trimmedPrev}`;
                        });
                        forgeTextareaRef.current?.focus();
                        try {
                          window.requestAnimationFrame(() => {
                            const el = forgeTextareaRef.current;
                            if (!el) return;
                            const len = el.value.length;
                            el.setSelectionRange?.(len, len);
                          });
                        } catch {
                          // Ignore sandbox rAF limitations
                        }
                      }}
                      className="qv-btn rounded-full border border-[#D8D0C1] bg-white px-2.5 py-1 text-xs font-bold text-[#44403C] hover:border-[#2563EB] hover:text-[#1D4ED8]"
                    >
                      + “{chip.trim()}…”
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        )}

        {/* STAGE 4: RUN COMPLETE */}
        {stage === 'complete' && (
          <motion.section
            key="complete"
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
              <h1 className="font-display text-3xl font-extrabold">Run Complete!</h1>
              <p className="mt-1 text-base font-bold text-[#D97706] tabular-nums">
                {policyMult === 0
                  ? 'Practice Mode Complete! Try a new quest for 100% Tokens!'
                  : `+${chestTokens} Chest Bonus · +${displayedTokens} Total Tokens!`}
              </p>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-3 gap-3 tabular-nums">
              <div className="rounded-2xl bg-[#FEF3C7] p-3">
                <div className="text-xs font-bold text-[#92400E]">Tokens</div>
                <div className="font-display text-2xl font-extrabold">+{displayedTokens}</div>
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

            {finalSentence && (
              <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E2D8] bg-[#FAF7F2] p-4 text-base font-semibold">
                “{finalSentence}”
              </div>
            )}

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

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
import { buildChineseRun } from '../../subjects/chinese/chineseEngine';
import { evaluateChineseWriting } from '../../subjects/chinese/chineseWritingChecks';
import type {
  ChineseSprintQuestion,
  ChineseUpgradeQuestion,
  ChineseWordSet,
} from '../../subjects/chinese/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { RubyWord } from '../components/RubyWord';
import { useKeyboardSafeArea } from '../hooks/useKeyboardSafeArea';

type ChineseStage = 'spotlight' | 'sprint' | 'upgrade' | 'forge' | 'complete';

export interface ChineseCompletionPayload {
  summary: RunSummary;
  writingEntry: WritingEntry;
  wordOutcomes: WordOutcomeInput[];
  rawTokensEarned?: number;
}

interface ChineseRunViewProps {
  wordSet: ChineseWordSet;
  equippedCollectibleId: string;
  currentTotalTokens: number;
  showZhuyin: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onToggleZhuyin: () => void;
  onExit: () => void;
  onRecordPartialMastery?: (outcomes: WordOutcomeInput[]) => void;
  onCompleteRun: (payload: ChineseCompletionPayload) => void;
  onGoToMarket: () => void;
}

const CHOICE_KEYS = ['1', '2', '3', '4'];
const ARCADE_TILES = [
  { bg: '#2563EB', border: '#1E40AF' },
  { bg: '#0D9488', border: '#115E59' },
  { bg: '#EA580C', border: '#9A3412' },
  { bg: '#9333EA', border: '#6B21A8' },
];

export const ChineseRunView: React.FC<ChineseRunViewProps> = ({
  wordSet,
  equippedCollectibleId,
  currentTotalTokens,
  showZhuyin,
  rewardPolicy,
  onToggleZhuyin,
  onExit,
  onRecordPartialMastery,
  onCompleteRun,
  onGoToMarket,
}) => {
  const prefersReduced = useReducedMotion();
  const plan = useMemo(() => buildChineseRun(wordSet), [wordSet]);
  const multiplier = wordSet.tokenMultiplier ?? 1;
  const [lockedPolicy] = useState<QuestRewardPolicy | undefined>(() => rewardPolicy);
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [stage, setStage] = useState<ChineseStage>('spotlight');
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

  const [sprintQueue, setSprintQueue] = useState<
    { question: ChineseSprintQuestion; requeued: boolean }[]
  >(() => plan.sprintQuestions.map((question) => ({ question, requeued: false })));

  const [upgradeQueue, setUpgradeQueue] = useState<
    { question: ChineseUpgradeQuestion; requeued: boolean }[]
  >(() => plan.upgradeQuestions.map((question) => ({ question, requeued: false })));

  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [cleanCount, setCleanCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [outcomes, setOutcomes] = useState<WordOutcomeInput[]>([]);

  const [feedback, setFeedback] = useState<{
    kind: 'correct' | 'requeue';
    stageKind: 'sprint' | 'upgrade';
    word: string;
    zhuyin: string;
    bridge: string;
    gain: number;
    canContinue: boolean;
  } | null>(null);

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
      evaluateChineseWriting(
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

  const handleSprintPick = (choiceWord: string) => {
    if (!currentSprintItem || feedback || answeringRef.current) return;
    answeringRef.current = true;
    const { question, requeued } = currentSprintItem;
    const isCorrect = choiceWord === question.correctWord;
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
          {
            word: question.correctWord,
            subjectId: 'chinese',
            tier: question.targetWord.tier,
            outcome: 'clean',
          },
        ]);
      }
      audioService.playCorrect(nextCombo);
      setFeedback({
        kind: 'correct',
        stageKind: 'sprint',
        word: question.correctWord,
        zhuyin: question.targetWord.zhuyin,
        bridge: `${question.targetWord.plainBridge} (${question.targetWord.englishBridge})`,
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
      setCombo(0);
      setOutcomes((prev) => [
        ...prev,
        {
          word: question.correctWord,
          subjectId: 'chinese',
          tier: question.targetWord.tier,
          outcome: 'missed',
        },
      ]);
      audioService.playNudge();
      setFeedback({
        kind: 'requeue',
        stageKind: 'sprint',
        word: question.correctWord,
        zhuyin: question.targetWord.zhuyin,
        bridge: `${question.targetWord.plainBridge} (${question.targetWord.englishBridge})`,
        gain: 0,
        canContinue: false,
      });

      scheduleTimeout(() => {
        setFeedback((cur) => (cur ? { ...cur, canContinue: true } : null));
      }, 800);
    }
  };

  const handleUpgradePick = (choiceWord: string) => {
    if (!currentUpgradeItem || feedback || answeringRef.current) return;
    answeringRef.current = true;
    const { question, requeued } = currentUpgradeItem;
    const isCorrect = choiceWord === question.correctWord;
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
          {
            word: question.correctWord,
            subjectId: 'chinese',
            tier: question.targetWord.tier,
            outcome: 'clean',
          },
        ]);
      }
      audioService.playCorrect(nextCombo);
      setFeedback({
        kind: 'correct',
        stageKind: 'upgrade',
        word: question.correctWord,
        zhuyin: question.targetWord.zhuyin,
        bridge: `${question.targetWord.plainBridge} (${question.targetWord.englishBridge})`,
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
        {
          word: question.correctWord,
          subjectId: 'chinese',
          tier: question.targetWord.tier,
          outcome: 'missed',
        },
      ]);
      audioService.playNudge();
      setFeedback({
        kind: 'requeue',
        stageKind: 'upgrade',
        word: question.correctWord,
        zhuyin: question.targetWord.zhuyin,
        bridge: `${question.targetWord.plainBridge} (${question.targetWord.englishBridge})`,
        gain: 0,
        canContinue: false,
      });

      scheduleTimeout(() => {
        setFeedback((cur) => (cur ? { ...cur, canContinue: true } : null));
      }, 800);
    }
  };

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
      handleSprintPick(currentSprintItem.question.choices[idx].word);
    } else if (stage === 'upgrade' && currentUpgradeItem?.question.choices[idx]) {
      e.preventDefault();
      handleUpgradePick(currentUpgradeItem.question.choices[idx].word);
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
      subjectId: 'chinese',
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
        id: `zhrun-${Date.now().toString(36)}`,
        subjectId: 'chinese',
        questSetId: wordSet.id,
        questSetTitle: wordSet.title,
        tokensEarned: awardedRunTokens,
        maxCombo,
        accuracyPct,
        completedAt: nowIso,
      },
      writingEntry: {
        id: `zhwrite-${Date.now().toString(36)}`,
        subjectId: 'chinese',
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
    setSentence((prev) => `${prev}${word}`);
  };

  const displayedTokens = applyQuestRewardMultiplier(tokensEarned, policyMult);
  const stageStep =
    stage === 'spotlight' ? 0 : stage === 'sprint' ? 1 : stage === 'upgrade' ? 2 : stage === 'forge' ? 3 : 4;
  const inspectedEntry = plan.forgePrompt.wordGlossary.find((w) => w.word === inspectedWord);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Compact Arcade HUD + One-Tap Zhuyin Toggle */}
      <div className="qv-surface rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExitWithMastery}
            className="qv-btn inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#57534E] hover:bg-[#F3EFE7]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>離開</span>
          </button>

          <button
            type="button"
            onClick={onToggleZhuyin}
            className={`qv-btn rounded-full border-2 px-2.5 py-1 text-xs font-extrabold transition-colors ${
              showZhuyin
                ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                : 'border-[#E7E2D8] bg-white text-[#57534E]'
            }`}
          >
            注音 {showZhuyin ? '開' : '關'}
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs font-extrabold">
          {[
            { num: 0, label: '認詞' },
            { num: 1, label: '快選' },
            { num: 2, label: '升級' },
            { num: 3, label: '造句' },
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

      <RewardPolicyBanner policy={lockedPolicy} lang="zh" />

      <AnimatePresence mode="wait">
        {/* STAGE 0: WORD SPOTLIGHT (TEACH FIRST) */}
        {stage === 'spotlight' && currentSpot && (
          <motion.section
            key={`zhspot-${spotIdx}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.12 }}
            className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5"
          >
            <div className="flex items-center justify-between text-xs font-extrabold text-[#57534E] tabular-nums">
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[#1D4ED8]">
                先認詞再闖關 · {spotIdx + 1}/{plan.spotlightWords.length}
              </span>
              <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[#B45309]">
                +{Math.round(1 * multiplier)} 代幣
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 py-1">
              <div className="qv-float">
                <CollectibleArt
                  id={wordSet.emblemCollectibleId}
                  size={70}
                  className="border-2 border-[#1C1917]"
                />
              </div>

              <div className="flex items-center gap-3">
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#1C1917]">
                  <RubyWord
                    word={currentSpot.word}
                    zhuyin={currentSpot.zhuyin}
                    showZhuyin={showZhuyin}
                    zhuyinClassName="text-[#2563EB]"
                  />
                </h1>
                <button
                  type="button"
                  onClick={() => audioService.speak(currentSpot.word, 'zh-TW')}
                  aria-label={`朗讀 ${currentSpot.word}`}
                  className="qv-btn inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1C1917] bg-[#EFF6FF] text-[#2563EB]"
                >
                  <Volume2 className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-block rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] px-4 py-1.5 font-display text-lg font-extrabold text-[#92400E]">
                  = {currentSpot.plainBridge}
                </span>
                <span className="inline-block rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] px-3.5 py-1.5 text-sm font-extrabold text-[#1D4ED8]">
                  {currentSpot.englishBridge}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-lg">
                <p className="text-base sm:text-lg font-semibold text-[#44403C] leading-relaxed">
                  「{currentSpot.contextSentence.replace('___', currentSpot.word)}」
                </p>
                <button
                  type="button"
                  onClick={() =>
                    audioService.speak(
                      currentSpot.contextSentence.replace('___', currentSpot.word),
                      'zh-TW',
                    )
                  }
                  aria-label="朗讀例句"
                  className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#E7E2D8] bg-[#FAF7F2] px-2.5 py-1 text-xs font-extrabold text-[#2563EB]"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>聽例句</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSpotlightNext(spotIdx)}
              className="qv-arcade-btn inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-8 py-4 font-display text-lg font-extrabold text-white"
              style={{ borderBottomColor: '#065F46' }}
            >
              <span>
                {spotIdx + 1 < plan.spotlightWords.length ? '記住了！下一個詞' : '準備好了！開始快選！'}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.section>
        )}

        {/* STAGE 1: SPRINT */}
        {stage === 'sprint' && currentSprintItem && (
          <motion.section
            key={`${currentSprintItem.question.id}-${sprintQueue.length}-${currentSprintItem.requeued}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.12 }}
            className="qv-surface rounded-3xl p-5 sm:p-8 space-y-5"
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
                    <h1 className="font-display text-lg font-extrabold">語境選詞快打</h1>
                    {currentSprintItem.requeued && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309]">
                        <RotateCcw className="h-3 w-3" />
                        再試一次
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#57534E] tabular-nums">
                    剩餘 {sprintQueue.length} 題
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  audioService.speak(
                    currentSprintItem.question.promptText.includes('點右上角 🔊')
                      ? currentSprintItem.question.correctWord
                      : currentSprintItem.question.promptText.replace('___', '空格'),
                    'zh-TW',
                  )
                }
                aria-label="朗讀題目"
                className="qv-btn inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#E7E2D8] bg-[#FAF7F2] text-[#2563EB]"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-[#FAF7F2] border-2 border-[#E7E2D8] p-5 sm:p-6">
              <p className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-relaxed">
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
                      <span>+{feedback.gain} 代幣！</span>
                    ) : (
                      <span>
                        {feedback.word} = {feedback.bridge} · 等一下再考一次！
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
                      <span>懂了，下一題</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentSprintItem.question.choices.map((choice, idx) => {
                const theme = ARCADE_TILES[idx % ARCADE_TILES.length];
                const isAnswer = feedback && choice.word === currentSprintItem.question.correctWord;
                return (
                  <button
                    key={choice.word}
                    type="button"
                    disabled={Boolean(feedback)}
                    onClick={() => handleSprintPick(choice.word)}
                    className="qv-arcade-btn flex items-center justify-between gap-3 rounded-2xl border-2 border-[#1C1917] px-5 py-4 text-left font-display text-xl font-extrabold text-white disabled:cursor-default"
                    style={{
                      backgroundColor: isAnswer ? '#059669' : theme.bg,
                      borderBottomColor: isAnswer ? '#065F46' : theme.border,
                      opacity: feedback && !isAnswer ? 0.45 : 1,
                    }}
                  >
                    <RubyWord
                      word={choice.word}
                      zhuyin={choice.zhuyin}
                      showZhuyin={showZhuyin}
                      zhuyinClassName="text-white/90"
                    />
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold tabular-nums">
                      {CHOICE_KEYS[idx]}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* STAGE 2: WORD UPGRADE */}
        {stage === 'upgrade' && currentUpgradeItem && (
          <motion.section
            key={`${currentUpgradeItem.question.id}-${upgradeQueue.length}-${currentUpgradeItem.requeued}`}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.12 }}
            className="qv-surface rounded-3xl p-5 sm:p-8 space-y-5"
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
                  <h1 className="font-display text-lg font-extrabold">
                    {wordSet.shortTag === '易錯辨析'
                      ? '錯字抓抓樂！把框起來的錯字換成正確的字'
                      : '詞語升級！把口語變精彩'}
                  </h1>
                  <div className="text-xs font-bold text-[#57534E] tabular-nums">
                    剩餘 {upgradeQueue.length} 題
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  audioService.speak(
                    `${currentUpgradeItem.question.sentenceBefore}${currentUpgradeItem.question.plainSpan}${currentUpgradeItem.question.sentenceAfter}`,
                    'zh-TW',
                  )
                }
                aria-label="朗讀升級例句"
                className="qv-btn inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#E7E2D8] bg-[#FAF7F2] text-[#2563EB]"
              >
                <Volume2 className="h-5 w-5" />
              </button>
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
                      ? `升級成功！+${feedback.gain} 代幣`
                      : `${feedback.word} = ${feedback.bridge}`}
                  </div>

                  {feedback.kind === 'requeue' && (
                    <button
                      type="button"
                      disabled={!feedback.canContinue}
                      onClick={handleAdvanceAfterMiss}
                      className="qv-arcade-btn inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-4 py-2 text-sm font-extrabold text-white disabled:opacity-45"
                    >
                      <span>懂了，下一題</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {currentUpgradeItem.question.choices.map((choice, idx) => {
                const theme = ARCADE_TILES[idx % ARCADE_TILES.length];
                const isAnswer = feedback && choice.word === currentUpgradeItem.question.correctWord;
                return (
                  <button
                    key={choice.word}
                    type="button"
                    disabled={Boolean(feedback)}
                    onClick={() => handleUpgradePick(choice.word)}
                    className="qv-arcade-btn rounded-2xl border-2 border-[#1C1917] px-4 py-4 font-display text-xl font-extrabold text-white disabled:cursor-default"
                    style={{
                      backgroundColor: isAnswer ? '#059669' : theme.bg,
                      borderBottomColor: isAnswer ? '#065F46' : theme.border,
                      opacity: feedback && !isAnswer ? 0.45 : 1,
                    }}
                  >
                    <RubyWord
                      word={choice.word}
                      zhuyin={choice.zhuyin}
                      showZhuyin={showZhuyin}
                      zhuyinClassName="text-white/90"
                    />
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* STAGE 3: CHINESE WRITER'S FORGE (iPad keyboard-safe high textarea layout) */}
        {stage === 'forge' && (
          <div
            key="zhforge-wrap"
            style={forgeBottomPad > 0 ? { paddingBottom: `${forgeBottomPad}px` } : undefined}
          >
            <motion.section
              key="zhforge"
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
                      寫一句精彩中文！
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-[#1E3A8A]">
                      {plan.forgePrompt.scenario}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#FEF3C7] border border-[#1C1917] px-3 py-1 text-xs font-extrabold text-[#92400E] tabular-nums">
                  +{Math.round(25 * multiplier)} 寶箱
                </span>
              </div>

              {/* Compact Target Word Pills */}
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
                          audioService.speak(item.word, 'zh-TW');
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
                        <RubyWord word={item.word} zhuyin={item.zhuyin} showZhuyin={showZhuyin} />
                      </button>
                    );
                  })}
                </div>

                {inspectedEntry && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#57534E]">
                    <span>
                      <strong className="text-[#1C1917]">{inspectedEntry.word}</strong> ={' '}
                      {inspectedEntry.plainBridge}（{inspectedEntry.englishBridge}）
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
                      + 插入詞語
                    </button>
                  </div>
                )}
              </div>

              {/* Writing Input Box positioned HIGH in the card so iPad keyboard never covers it */}
              <div className="space-y-2.5">
                <div className="relative">
                  <textarea
                    ref={forgeTextareaRef}
                    data-testid="zh-forge-textarea"
                    rows={2}
                    value={sentence}
                    onFocus={(e) => handleForgeFocus(e.currentTarget)}
                    onBlur={handleForgeBlur}
                    onChange={(e) => setSentence(e.target.value)}
                    placeholder="直接寫一句完整的繁體中文句子（記得加上句號 。）"
                    style={{ scrollMarginTop: '88px', scrollMarginBottom: '260px' }}
                    className="w-full rounded-2xl border-2 border-[#D8D0C1] bg-white p-3.5 pr-12 text-base font-medium focus:border-[#2563EB] focus:outline-none"
                  />
                  {sentence.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => audioService.speak(sentence.trim(), 'zh-TW')}
                      aria-label="聽聽我寫的句子"
                      title="聽聽我寫的句子"
                      className="qv-btn absolute right-2.5 top-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p
                  data-testid="zh-forge-encouragement"
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
                      ? `開啟寶箱！+${Math.round(25 * multiplier)} 代幣`
                      : `完成全部 4 項檢查就能開寶箱（${writingEval.passedCount}/4）`}
                  </span>
                </button>

                {/* Quick-Start Inspiration Chips (swaps cleanly; starter chars don't count as own chars) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#F0EAE0]">
                  <span className="text-[11px] font-bold text-[#78716C]">
                    快速開頭（不算字數，請自己接著寫完）：
                  </span>
                  {plan.forgePrompt.starterChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setSentence((prev) => {
                          const trimmedPrev = prev.trimStart();
                          const existing = plan.forgePrompt.starterChips.find((c) =>
                            trimmedPrev.startsWith(c),
                          );
                          if (existing) {
                            const rest = trimmedPrev.slice(existing.length);
                            return `${chip}${rest}`;
                          }
                          return trimmedPrev.length === 0 ? chip : `${chip}${trimmedPrev}`;
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
                      + 「{chip}…」
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        )}

        {/* STAGE 4: COMPLETE */}
        {stage === 'complete' && (
          <motion.section
            key="zhcomplete"
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
              <h1 className="font-display text-3xl font-extrabold">中文關卡完成！</h1>
              <p className="mt-1 text-base font-bold text-[#D97706] tabular-nums">
                {policyMult === 0
                  ? '純練習模式完成！去挑戰還沒破的新關卡拿 100% 代幣吧！'
                  : `+${chestTokens} 寶箱獎勵 · 共獲得 +${displayedTokens} 代幣！`}
              </p>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-3 gap-3 tabular-nums">
              <div className="rounded-2xl bg-[#FEF3C7] p-3">
                <div className="text-xs font-bold text-[#92400E]">獲得代幣</div>
                <div className="font-display text-2xl font-extrabold">+{displayedTokens}</div>
              </div>
              <div className="rounded-2xl bg-[#FFF7ED] p-3">
                <div className="text-xs font-bold text-[#9A3412]">最高連擊</div>
                <div className="font-display text-2xl font-extrabold">{maxCombo}×</div>
              </div>
              <div className="rounded-2xl bg-[#ECFDF5] p-3">
                <div className="text-xs font-bold text-[#065F46]">可抽盲盒</div>
                <div className="font-display text-2xl font-extrabold">
                  {Math.floor(currentTotalTokens / PACK_COST)}
                </div>
              </div>
            </div>

            {finalSentence && (
              <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E2D8] bg-[#FAF7F2] p-4 text-base font-semibold">
                「{finalSentence}」
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
                <span>去抽盲盒！</span>
              </button>
              <button
                type="button"
                onClick={onExit}
                className="qv-btn w-full sm:w-auto rounded-2xl border-2 border-[#E7E2D8] bg-white px-5 py-3.5 text-sm font-extrabold text-[#57534E]"
              >
                回到中文關卡
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

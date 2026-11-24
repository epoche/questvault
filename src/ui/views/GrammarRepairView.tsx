import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Flame,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trophy,
  Volume2,
  Wrench,
  X,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  applyQuestRewardMultiplier,
  calculateQuestionTokens,
  type QuestRewardPolicy,
} from '../../core/economy';
import type { GrammarRepairQuestion, GrammarRepairSet } from '../../subjects/english/rootsGrammarTypes';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { BLOOKET_CHOICE_PALETTE as CHOICE_STYLES } from '../theme/choicePalette';

export interface GrammarRepairCompletionPayload {
  setId: string;
  setTitle: string;
  tier: GrammarRepairSet['tier'];
  tokensEarned: number;
  rawTokensEarned: number;
  maxCombo: number;
  accuracyPct: number;
  wordOutcomes: { word: string; firstTryCorrect: boolean }[];
}

interface GrammarRepairViewProps {
  questSet: GrammarRepairSet;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onComplete: (payload: GrammarRepairCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

export const GrammarRepairView: React.FC<GrammarRepairViewProps> = ({
  questSet,
  equippedCollectibleId,
  isAvatarShiny = false,
  rewardPolicy,
  onComplete,
  onExit,
  onGoToMarket,
}) => {
  const [lockedPolicy, setLockedPolicy] = useState<QuestRewardPolicy | undefined>(
    () => rewardPolicy,
  );
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [queue, setQueue] = useState<GrammarRepairQuestion[]>(() => [...questSet.questions]);
  const [missedIds, setMissedIds] = useState<Record<string, boolean>>({});
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [rawTokens, setRawTokens] = useState(0);
  const [correctBanner, setCorrectBanner] = useState<string | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosenIdx: number } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [finalAwardedTokens, setFinalAwardedTokens] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);

  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const completedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // Ignore sandbox speech errors
      }
    };
  }, [clearTimer]);

  const currentQ = queue[0] ?? null;
  const totalUnique = questSet.questions.length;
  const doneCount = Math.max(0, totalUnique - queue.length);

  const finishQuest = useCallback(
    (
      finalRawRunning: number,
      finalMaxCombo: number,
      finalFirstTry: number,
      finalMissedMap: Record<string, boolean>,
    ) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const chestBonus = 15;
      const totalRaw = finalRawRunning + chestBonus;
      const awarded = applyQuestRewardMultiplier(totalRaw, policyMult);
      const accuracyPct = Math.round((finalFirstTry / Math.max(1, totalUnique)) * 100);
      setRawTokens(totalRaw);
      setFinalAwardedTokens(awarded);
      setFinalAccuracy(accuracyPct);
      setCompleted(true);
      audioService.playChest();

      onComplete({
        setId: questSet.id,
        setTitle: questSet.title,
        tier: questSet.tier,
        tokensEarned: awarded,
        rawTokensEarned: totalRaw,
        maxCombo: finalMaxCombo,
        accuracyPct,
        wordOutcomes: questSet.questions.map((q) => ({
          word: q.targetAnswer,
          firstTryCorrect: !finalMissedMap[q.id],
        })),
      });
    },
    [onComplete, policyMult, questSet.id, questSet.questions, questSet.tier, questSet.title, totalUnique],
  );

  const advanceAfterWrong = useCallback(() => {
    if (advancingRef.current || !currentQ) return;
    advancingRef.current = true;
    clearTimer();
    setWrongFeedback(null);
    setCorrectBanner(null);
    setQueue((prev) => (prev.length <= 1 ? prev : [...prev.slice(1), prev[0]]));
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [clearTimer, currentQ]);

  const handlePickChoice = useCallback(
    (idx: number) => {
      if (completed || !currentQ || answeringRef.current || wrongFeedback) return;
      answeringRef.current = true;

      if (idx === currentQ.correctIndex) {
        const nextCombo = combo + 1;
        const nextMaxCombo = Math.max(maxCombo, nextCombo);
        const alreadyMissed = Boolean(missedIds[currentQ.id]);
        const nextFirstTry = alreadyMissed ? firstTryRight : firstTryRight + 1;
        const gain = alreadyMissed ? 2 : calculateQuestionTokens(5, nextCombo);
        const nextRaw = rawTokens + gain;

        setCombo(nextCombo);
        setMaxCombo(nextMaxCombo);
        if (!alreadyMissed) setFirstTryRight(nextFirstTry);
        setRawTokens(nextRaw);
        audioService.playCorrect(nextCombo);
        setCorrectBanner(`✅ Nice fix! ${currentQ.ruleTip}`);

        const isLast = queue.length <= 1;
        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;
          setCorrectBanner(null);
          if (isLast) {
            setQueue([]);
            finishQuest(nextRaw, nextMaxCombo, nextFirstTry, missedIds);
          } else {
            setQueue((prev) => prev.slice(1));
            answeringRef.current = false;
          }
        }, 850);
      } else {
        setCombo(0);
        audioService.playNudge();
        setMissedIds((prev) => ({ ...prev, [currentQ.id]: true }));
        setWrongFeedback({ chosenIdx: idx });
      }
    },
    [combo, completed, currentQ, finishQuest, firstTryRight, maxCombo, missedIds, queue.length, rawTokens, wrongFeedback],
  );

  const handleRestart = () => {
    clearTimer();
    completedRef.current = false;
    answeringRef.current = false;
    advancingRef.current = false;
    setLockedPolicy(rewardPolicy);
    setQueue([...questSet.questions]);
    setMissedIds({});
    setFirstTryRight(0);
    setCombo(0);
    setMaxCombo(0);
    setRawTokens(0);
    setCorrectBanner(null);
    setWrongFeedback(null);
    setCompleted(false);
  };

  useEffect(() => {
    if (completed) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (wrongFeedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceAfterWrong();
        }
        return;
      }
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx >= 0 && currentQ?.choices[idx]) {
        e.preventDefault();
        handlePickChoice(idx);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advanceAfterWrong, completed, currentQ, handlePickChoice, wrongFeedback]);

  const displayedHudTokens = applyQuestRewardMultiplier(rawTokens, policyMult);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Top Bar */}
      <div className="qv-surface rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white px-3 py-1.5 text-xs font-extrabold text-[#57534E]"
          >
            <X className="h-3.5 w-3.5" />
            <span>Exit</span>
          </button>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold text-white"
            style={{ backgroundColor: questSet.accentHex }}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>{questSet.title}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 tabular-nums">
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-1 text-xs font-extrabold text-[#57534E]">
            {completed ? 'Repaired!' : `Q ${Math.min(doneCount + 1, totalUnique)}/${totalUnique}`}
          </span>
          {combo >= 2 && !completed && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-1 text-xs font-extrabold text-[#C2410C]">
              <Flame className="h-3.5 w-3.5 fill-current" />
              {combo}×
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#1C1917] px-2.5 py-1 text-xs font-extrabold text-[#92400E]">
            <Coins className="h-3.5 w-3.5 text-[#D97706]" />+{displayedHudTokens}
          </span>
        </div>
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang="en" />

      {!completed && currentQ && (
        <section className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold"
              style={{ backgroundColor: questSet.bgHex, color: questSet.accentHex }}
            >
              <span>{currentQ.emoji}</span>
              <span>{questSet.categoryTag} · Fix the Sentence</span>
            </span>

            <button
              type="button"
              onClick={() =>
                audioService.speak(
                  correctBanner || wrongFeedback
                    ? currentQ.spokenFullSentence
                    : currentQ.promptSentence.replace('___', 'blank'),
                  'en-US',
                )
              }
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#EFF6FF] px-3 py-1.5 text-xs font-extrabold text-[#1D4ED8]"
            >
              <Volume2 className="h-4 w-4" />
              <span>Read Aloud</span>
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF7F2] p-5 text-center space-y-3">
            <div className="text-3xl" aria-hidden="true">
              {currentQ.emoji}
            </div>
            <p className="font-display text-lg sm:text-2xl font-extrabold leading-relaxed text-[#1C1917]">
              {currentQ.promptSentence.split('___')[0]}
              <span
                className={`mx-1 inline-block rounded-xl border-2 px-2.5 py-0.5 ${
                  correctBanner || wrongFeedback
                    ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                    : 'border-dashed border-[#EA580C] bg-[#FFF7ED] text-[#C2410C]'
                }`}
              >
                {correctBanner || wrongFeedback ? currentQ.targetAnswer : '_____'}
              </span>
              {currentQ.promptSentence.split('___').slice(1).join('___')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.choices.map((choice, idx) => {
              const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isWrong = wrongFeedback?.chosenIdx === idx;
              const isRightReveal = Boolean(wrongFeedback || correctBanner) && idx === currentQ.correctIndex;
              return (
                <button
                  key={`${currentQ.id}-${choice}`}
                  type="button"
                  disabled={Boolean(wrongFeedback || correctBanner)}
                  onClick={() => handlePickChoice(idx)}
                  className={`qv-arcade-btn min-h-[68px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 font-display text-base sm:text-lg font-extrabold text-white text-left ${
                    isWrong ? 'opacity-45 scale-95' : isRightReveal ? 'ring-4 ring-[#FDE047]' : ''
                  }`}
                  style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs">
                      {st.shape}
                    </span>
                    <span className="leading-snug">{choice}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {correctBanner && (
            <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-3 text-sm font-extrabold text-[#065F46]">
              {correctBanner}
            </div>
          )}

          {wrongFeedback && (
            <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 text-left">
                <div className="text-xs font-extrabold text-[#B45309]">
                  Grammar Tip! (We’ll retry this sentence once more)
                </div>
                <p className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                  Correct: “{currentQ.targetAnswer}” — {currentQ.ruleTip}
                </p>
              </div>
              <button
                type="button"
                onClick={advanceAfterWrong}
                className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              >
                <span>Got It, Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {completed && (
        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <CollectibleArt
                id={equippedCollectibleId}
                size={64}
                shiny={isAvatarShiny}
                className="border-2 border-[#1C1917]"
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7]">
                <Trophy className="h-8 w-8 text-[#D97706]" />
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              🎉 {questSet.title} Repaired!
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              {policyMult === 0
                ? 'Practice Mode Complete! Try a new Grammar Lab for 100% Tokens!'
                : 'Your editing radar is super sharp!'}
            </p>
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
              <div className="text-xs font-bold text-[#92400E]">Tokens Earned</div>
              <div className="mt-0.5 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#1C1917] tabular-nums">
                <Coins className="h-5 w-5 text-[#D97706]" />+{finalAwardedTokens}
              </div>
            </div>
            <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-3.5">
              <div className="text-xs font-bold text-[#047857]">First-Try Accuracy</div>
              <div className="mt-0.5 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#047857] tabular-nums">
                <CheckCircle2 className="h-5 w-5" />
                {finalAccuracy}%
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleRestart}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#EA580C] px-5 py-2.5 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#9A3412' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Practice Again</span>
            </button>
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
              style={{ borderBottomColor: '#D97706' }}
            >
              <ShoppingBag className="h-4 w-4 text-[#D97706]" />
              <span>Open Packs!</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border border-[#E5DFD3] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#57534E]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Back to Quests</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

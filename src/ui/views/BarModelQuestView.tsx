import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Coins,
  Lightbulb,
  ShoppingBag,
  Trophy,
  X,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import { applyQuestRewardMultiplier, type QuestRewardPolicy } from '../../core/economy';
import {
  BAR_MODEL_RUN_SIZE,
  buildBarModelSession,
  calculateBarModelTokens,
  type BarModelQuestion,
  type BarModelUnitMeta,
} from '../../subjects/math/barModelEngine';
import { BarModelSvg } from '../artwork/BarModelSvg';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { BLOOKET_CHOICE_PALETTE as CHOICE_STYLES } from '../theme/choicePalette';

export interface BarModelCompletionPayload {
  unitId: BarModelUnitMeta['id'];
  unitTitle: string;
  tier: BarModelUnitMeta['tier'];
  tokensEarned: number;
  rawTokensEarned: number;
  accuracyPct: number;
}

interface BarModelQuestViewProps {
  unit: BarModelUnitMeta;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onComplete: (payload: BarModelCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

export const BarModelQuestView: React.FC<BarModelQuestViewProps> = ({
  unit,
  equippedCollectibleId,
  isAvatarShiny = false,
  rewardPolicy,
  onComplete,
  onExit,
  onGoToMarket,
}) => {
  const [lockedPolicy] = useState<QuestRewardPolicy | undefined>(() => rewardPolicy);
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [queue, setQueue] = useState<BarModelQuestion[]>(() =>
    buildBarModelSession(unit.id, BAR_MODEL_RUN_SIZE),
  );
  const [showStep1Hint, setShowStep1Hint] = useState(false);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosen: string } | null>(null);
  const [correctFeedback, setCorrectFeedback] = useState<string | null>(null);
  const [missedIds, setMissedIds] = useState<Record<string, boolean>>({});
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [finished, setFinished] = useState(false);
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

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    if (!wrongFeedback) {
      advancingRef.current = false;
    }
  }, [wrongFeedback]);

  const currentQ = queue[0] ?? null;

  const finishRun = useCallback(
    (finalFirstTry: number) => {
      if (completedRef.current) return;
      completedRef.current = true;
      clearTimer();

      const raw = calculateBarModelTokens(finalFirstTry, BAR_MODEL_RUN_SIZE);
      const awarded = applyQuestRewardMultiplier(raw, policyMult);
      const acc = Math.round((finalFirstTry / BAR_MODEL_RUN_SIZE) * 100);
      setFinalAwardedTokens(awarded);
      setFinalAccuracy(acc);

      onComplete({
        unitId: unit.id,
        unitTitle: unit.title,
        tier: unit.tier,
        tokensEarned: awarded,
        rawTokensEarned: raw,
        accuracyPct: acc,
      });
      if (awarded > 0) audioService.playChest();
      else audioService.playCorrect(3);
      setFinished(true);
    },
    [clearTimer, onComplete, policyMult, unit],
  );

  const handleSelectChoice = (choice: string) => {
    if (!currentQ || answeringRef.current || wrongFeedback || correctFeedback || finished) return;
    answeringRef.current = true;

    if (choice === currentQ.correctChoice) {
      const wasMissed = Boolean(missedIds[currentQ.id]);
      const nextFirstTry = wasMissed ? firstTryRight : firstTryRight + 1;
      const nextCompleted = completedCount + 1;
      setFirstTryRight(nextFirstTry);
      setCompletedCount(nextCompleted);
      setCorrectFeedback(
        `✅ Step 1: ${currentQ.step1Equation} → Step 2: ${currentQ.step2Equation}`,
      );
      audioService.playCorrect(nextCompleted);

      timerRef.current = window.setTimeout(() => {
        const remaining = queue.slice(1);
        if (remaining.length === 0) {
          finishRun(nextFirstTry);
        } else {
          setQueue(remaining);
          setCorrectFeedback(null);
          setShowStep1Hint(false);
          answeringRef.current = false;
        }
      }, 1150);
    } else {
      setMissedIds((prev) => ({ ...prev, [currentQ.id]: true }));
      setWrongFeedback({ chosen: choice });
      audioService.playNudge();
    }
  };

  const handleGotItAfterWrong = () => {
    if (!currentQ || !wrongFeedback || advancingRef.current) return;
    advancingRef.current = true;
    audioService.playToken();
    setQueue([...queue.slice(1), currentQ]);
    setWrongFeedback(null);
    setShowStep1Hint(false);
    answeringRef.current = false;
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 shadow-[0_6px_0_#1C1917] text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#10B981] px-3.5 py-1 text-xs font-extrabold text-[#047857]">
            <Trophy className="h-4 w-4" />
            BAR MODEL LAB COMPLETE!
          </span>
          <div className="flex flex-col items-center gap-2">
            <CollectibleArt id={equippedCollectibleId} size={86} shiny={isAvatarShiny} />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              📊 {unit.title} Solved!
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              Every round creates fresh numbers—your two-step problem-solving skills are leveling up!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3.5">
              <p className="text-xs font-bold text-[#065F46]">First-Try Accuracy</p>
              <p className="font-display text-2xl font-extrabold text-[#059669] tabular-nums">
                {finalAccuracy}%
              </p>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3.5">
              <p className="text-xs font-bold text-[#92400E]">Tokens Earned</p>
              <p className="font-display text-2xl font-extrabold text-[#D97706] tabular-nums inline-flex items-center gap-1">
                <Coins className="h-5 w-5" />+{finalAwardedTokens}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Open Mystery Packs</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#1C1917] font-display text-sm font-extrabold"
            >
              Back to Math
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const isRevealed = Boolean(wrongFeedback) || Boolean(correctFeedback);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            clearTimer();
            onExit();
          }}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#57534E]"
        >
          <X className="h-4 w-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className="rounded-full border px-3 py-1 text-xs font-extrabold"
            style={{ backgroundColor: unit.bgHex, borderColor: unit.accentHex, color: unit.accentHex }}
          >
            📊 {unit.title} · {unit.ccssTag}
          </span>
          <span className="rounded-full bg-[#F3EFE7] px-3 py-1 text-xs font-extrabold text-[#1C1917] tabular-nums">
            {completedCount} / {BAR_MODEL_RUN_SIZE} Solved
          </span>
        </div>
      </div>

      {lockedPolicy && <RewardPolicyBanner policy={lockedPolicy} />}

      <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-4">
        <p className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] leading-snug">
          {currentQ.storyPrompt}
        </p>

        {/* Original Singapore Math Tape Diagram (Anti-spoiler until answered) */}
        <BarModelSvg spec={currentQ.visual} revealed={isRevealed} />

        {!isRevealed && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowStep1Hint((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#2563EB] hover:underline"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>{showStep1Hint ? 'Hide Step 1 Strategy' : 'Need a Step 1 Strategy Hint?'}</span>
            </button>
            {showStep1Hint && (
              <p className="mt-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-2 text-xs font-bold text-[#1D4ED8]">
                🧭 {currentQ.step1Question}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {currentQ.choices.map((choice, idx) => {
            const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
            const isRight = choice === currentQ.correctChoice;
            const isWrongChosen = wrongFeedback?.chosen === choice;
            const dimmed =
              (Boolean(wrongFeedback) && !isRight && !isWrongChosen) ||
              (Boolean(correctFeedback) && !isRight);

            return (
              <button
                key={`${currentQ.id}-${choice}`}
                type="button"
                disabled={isRevealed}
                onClick={() => handleSelectChoice(choice)}
                className={`qv-btn min-h-[58px] rounded-2xl border-b-4 px-4 py-3 text-white font-display text-base sm:text-lg font-extrabold flex items-center justify-center gap-2 transition-opacity ${
                  dimmed ? 'opacity-45' : ''
                } ${wrongFeedback && isRight ? 'ring-4 ring-[#10B981] ring-offset-2' : ''}`}
                style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
              >
                <span className="text-xs opacity-80">{st.shape}</span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {correctFeedback && (
          <div className="rounded-2xl border-2 border-[#10B981] bg-[#ECFDF5] p-3.5 text-sm font-extrabold text-[#047857]">
            {correctFeedback}
          </div>
        )}

        {wrongFeedback && (
          <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 space-y-3">
            <div className="space-y-1">
              <p className="font-display text-sm font-extrabold text-[#B45309]">
                🧭 Two-Step Bar Model Solution:
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#1C1917]">
                • Step 1: <span className="font-extrabold">{currentQ.step1Equation}</span>
                <br />• Step 2: <span className="font-extrabold">{currentQ.step2Equation}</span>
              </p>
              <p className="text-xs font-semibold text-[#57534E]">{currentQ.explanation}</p>
            </div>
            <button
              type="button"
              onClick={handleGotItAfterWrong}
              className="qv-btn min-h-[44px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 text-sm font-extrabold text-white inline-flex items-center gap-1.5"
            >
              <span>Got It, Try Again Later</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

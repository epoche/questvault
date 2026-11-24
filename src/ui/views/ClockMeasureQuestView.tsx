import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Languages,
  Lightbulb,
  ShoppingBag,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import { applyQuestRewardMultiplier, type QuestRewardPolicy } from '../../core/economy';
import type { WordOutcomeInput } from '../../core/mastery';
import {
  buildClockMeasureSession,
  calculateClockMeasureTokens,
  CLOCK_MEASURE_RUN_SIZE,
  formatClockTime,
  type ClockMeasureQuestion,
  type ClockMeasureUnitMeta,
} from '../../subjects/math/clockMeasureEngine';
import { ClockMeasureSvg } from '../artwork/ClockMeasureSvg';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { BLOOKET_CHOICE_PALETTE as CHOICE_STYLES } from '../theme/choicePalette';

export interface ClockMeasureCompletionPayload {
  unitId: ClockMeasureUnitMeta['id'];
  unitTitle: string;
  tier: ClockMeasureUnitMeta['tier'];
  tokensEarned: number;
  rawTokensEarned: number;
  accuracyPct: number;
  wordOutcomes: WordOutcomeInput[];
}

interface ClockMeasureQuestViewProps {
  unit: ClockMeasureUnitMeta;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onComplete: (payload: ClockMeasureCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

export const ClockMeasureQuestView: React.FC<ClockMeasureQuestViewProps> = ({
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

  const [queue, setQueue] = useState<ClockMeasureQuestion[]>(() =>
    buildClockMeasureSession(unit.id, CLOCK_MEASURE_RUN_SIZE),
  );
  const [showZhHint, setShowZhHint] = useState(false);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosen: string } | null>(null);
  const [correctFeedback, setCorrectFeedback] = useState<string | null>(null);
  const [missedIds, setMissedIds] = useState<Record<string, boolean>>({});
  const [outcomesMap, setOutcomesMap] = useState<Record<string, boolean>>({});
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalAwardedTokens, setFinalAwardedTokens] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);

  // Interactive Set-the-Clock local hand state
  const currentQ = queue[0] ?? null;
  const [clockHour, setClockHour] = useState<number>(() => currentQ?.initialHour ?? 12);
  const [clockMinute, setClockMinute] = useState<number>(() => currentQ?.initialMinute ?? 0);

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
      audioService.stopSpeech();
    };
  }, [clearTimer]);

  // Reset interactive clock hands whenever the active question changes
  useEffect(() => {
    if (currentQ?.inputKind === 'set-clock') {
      setClockHour(currentQ.initialHour ?? 12);
      setClockMinute(currentQ.initialMinute ?? 0);
    }
  }, [currentQ?.id, currentQ?.inputKind, currentQ?.initialHour, currentQ?.initialMinute]);

  useEffect(() => {
    if (!wrongFeedback) {
      advancingRef.current = false;
    }
  }, [wrongFeedback]);

  const finishRun = useCallback(
    (finalFirstTry: number, finalOutcomes: Record<string, boolean>) => {
      if (completedRef.current) return;
      completedRef.current = true;
      clearTimer();

      const raw = calculateClockMeasureTokens(finalFirstTry, CLOCK_MEASURE_RUN_SIZE);
      const awarded = applyQuestRewardMultiplier(raw, policyMult);
      const acc = Math.round((finalFirstTry / CLOCK_MEASURE_RUN_SIZE) * 100);
      setFinalAwardedTokens(awarded);
      setFinalAccuracy(acc);

      const wordOutcomes: WordOutcomeInput[] = Object.entries(finalOutcomes).map(
        ([word, correctFirstTry]) => ({
          word,
          subjectId: 'math',
          tier: unit.tier,
          outcome: correctFirstTry ? 'clean' : 'missed',
        }),
      );

      onComplete({
        unitId: unit.id,
        unitTitle: unit.title,
        tier: unit.tier,
        tokensEarned: awarded,
        rawTokensEarned: raw,
        accuracyPct: acc,
        wordOutcomes,
      });
      if (awarded > 0) audioService.playChest();
      else audioService.playCorrect(3);
      setFinished(true);
    },
    [clearTimer, onComplete, policyMult, unit],
  );

  const recordAnswer = (chosenLabel: string, isCorrect: boolean) => {
    if (!currentQ || answeringRef.current || wrongFeedback || correctFeedback || finished) return;
    answeringRef.current = true;

    const wasMissed = Boolean(missedIds[currentQ.id]);
    const nextOutcomes = {
      ...outcomesMap,
      [currentQ.skillKey]: outcomesMap[currentQ.skillKey] === false ? false : isCorrect && !wasMissed,
    };
    setOutcomesMap(nextOutcomes);

    if (isCorrect) {
      const nextFirstTry = wasMissed ? firstTryRight : firstTryRight + 1;
      const nextCompleted = completedCount + 1;
      setFirstTryRight(nextFirstTry);
      setCompletedCount(nextCompleted);
      setCorrectFeedback(currentQ.explanation);
      audioService.playCorrect(nextCompleted);

      clearTimer();
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setCorrectFeedback(null);
        const remaining = queue.slice(1);
        setQueue(remaining);
        answeringRef.current = false;
        if (remaining.length === 0) {
          finishRun(nextFirstTry, nextOutcomes);
        }
      }, 1050);
      return;
    }

    // Wrong answer: keep visual revealed so student sees hour-zone wedge / drop lines / formula!
    setMissedIds((prev) => ({ ...prev, [currentQ.id]: true }));
    setWrongFeedback({ chosen: chosenLabel });
    audioService.playNudge();
  };

  const handleAdvanceAfterWrong = () => {
    if (!currentQ || !wrongFeedback || advancingRef.current) return;
    advancingRef.current = true;
    if (currentQ.inputKind === 'set-clock') {
      setClockHour(currentQ.initialHour ?? 12);
      setClockMinute(currentQ.initialMinute ?? 0);
    }
    const rest = queue.slice(1);
    const reinsertAt = Math.min(2, rest.length);
    const nextQueue = [...rest.slice(0, reinsertAt), currentQ, ...rest.slice(reinsertAt)];
    setQueue(nextQueue);
    setWrongFeedback(null);
    answeringRef.current = false;
  };

  const adjustClock = (deltaHours: number, deltaMinutes: number) => {
    if (answeringRef.current || wrongFeedback || correctFeedback || finished) return;
    const totalMins = ((clockHour % 12) * 60 + clockMinute + deltaHours * 60 + deltaMinutes + 720 * 10) % 720;
    const nextH = Math.floor(totalMins / 60);
    const nextM = totalMins % 60;
    setClockHour(nextH === 0 ? 12 : nextH);
    setClockMinute(nextM);
    audioService.playToken();
  };

  const handleCheckSetClock = () => {
    if (!currentQ || currentQ.inputKind !== 'set-clock') return;
    const chosenStr = formatClockTime(clockHour, clockMinute);
    const isRight =
      clockHour === currentQ.targetHour && clockMinute === currentQ.targetMinute;
    recordAnswer(chosenStr, isRight);
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border-3 border-[#1C1917] bg-white p-6 sm:p-8 shadow-[0_8px_0_#1C1917] text-center space-y-5">
        <div className="mx-auto flex justify-center">
          <CollectibleArt id={equippedCollectibleId} size={86} shiny={isAvatarShiny} />
        </div>
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309]">
            <Trophy className="h-3.5 w-3.5" /> Clock & Measure Master!
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
            {unit.emoji} {unit.title}
          </h1>
          <p className="text-sm font-bold text-[#57534E]">
            {unit.zhTitle} · 第一遍答對率 {finalAccuracy}% ({firstTryRight}/{CLOCK_MEASURE_RUN_SIZE})
          </p>
        </div>

        <div className="mx-auto inline-flex items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-5 py-2.5 font-display text-xl font-extrabold text-[#B45309] tabular-nums">
          <Coins className="h-5 w-5 text-[#D97706]" />
          <span>+{finalAwardedTokens} Tokens</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn min-h-[46px] rounded-2xl border-2 border-[#1C1917] bg-[#FAF7F2] px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
          >
            Back to Clock & Measure
          </button>
          <button
            type="button"
            onClick={onGoToMarket}
            className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] px-5 py-2.5 font-display text-sm font-extrabold text-white"
            style={{ borderBottomColor: '#B45309' }}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Open Packs!</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const isRevealed = Boolean(wrongFeedback || correctFeedback);
  const progressPct = Math.round((completedCount / CLOCK_MEASURE_RUN_SIZE) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Top Session Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3.5 py-1.5 text-xs font-extrabold text-[#57534E]"
        >
          <X className="h-4 w-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowZhHint((v) => !v)}
            aria-pressed={showZhHint}
            className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 px-3 py-1 text-xs font-extrabold ${
              showZhHint
                ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                : 'border-[#E5DFD3] bg-white text-[#57534E]'
            }`}
          >
            <Languages className="h-3.5 w-3.5" />
            <span>繁中提示：{showZhHint ? '開' : '關'}</span>
          </button>

          <span className="rounded-full bg-white border-2 border-[#E5DFD3] px-3 py-1 text-xs font-extrabold text-[#1C1917] tabular-nums">
            {completedCount} / {CLOCK_MEASURE_RUN_SIZE}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 w-full overflow-hidden rounded-full border-2 border-[#1C1917] bg-white">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%`, backgroundColor: unit.accentHex }}
        />
      </div>

      {lockedPolicy && <RewardPolicyBanner policy={lockedPolicy} />}

      {/* Main Question Card */}
      <section className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold"
              style={{ backgroundColor: unit.bgHex, color: unit.accentHex }}
            >
              <span>{unit.emoji}</span>
              <span>{unit.title}</span>
            </span>
            <h1 className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] leading-snug">
              {currentQ.prompt}
            </h1>
            {showZhHint && (
              <p className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-3 py-1.5 text-xs font-bold text-[#92400E]">
                <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                <span>{currentQ.zhHint}</span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => audioService.speak(currentQ.prompt, 'en-US')}
            aria-label="Read question aloud"
            className="qv-btn inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#E5DFD3] bg-[#FAF7F2] text-[#2563EB]"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Visual Stage */}
        <div className="rounded-2xl border-2 border-[#F3EFE7] bg-[#FAF8F4] p-3 sm:p-4">
          <ClockMeasureSvg
            spec={currentQ.visual}
            revealed={isRevealed}
            interactiveClock={
              currentQ.inputKind === 'set-clock'
                ? {
                    hour: wrongFeedback && currentQ.targetHour ? currentQ.targetHour : clockHour,
                    minute:
                      wrongFeedback && currentQ.targetMinute !== undefined
                        ? currentQ.targetMinute
                        : clockMinute,
                  }
                : undefined
            }
          />
        </div>

        {/* Input Mode 1: Interactive Set-the-Clock Hands */}
        {currentQ.inputKind === 'set-clock' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={isRevealed}
                onClick={() => adjustClock(-1, 0)}
                className="qv-btn min-h-[42px] rounded-xl border-2 border-[#FDA4AF] bg-[#FFF1F2] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#BE123C] disabled:opacity-45"
              >
                −1 hr
              </button>
              <button
                type="button"
                disabled={isRevealed}
                onClick={() => adjustClock(1, 0)}
                className="qv-btn min-h-[42px] rounded-xl border-2 border-[#E11D48] bg-[#FFE4E6] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#BE123C] disabled:opacity-45"
              >
                +1 hr
              </button>
              <button
                type="button"
                disabled={isRevealed}
                onClick={() => adjustClock(0, -5)}
                className="qv-btn min-h-[42px] rounded-xl border-2 border-[#93C5FD] bg-[#EFF6FF] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#1D4ED8] disabled:opacity-45"
              >
                −5 min
              </button>
              <button
                type="button"
                disabled={isRevealed}
                onClick={() => adjustClock(0, 5)}
                className="qv-btn min-h-[42px] rounded-xl border-2 border-[#2563EB] bg-[#DBEAFE] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#1D4ED8] disabled:opacity-45"
              >
                +5 min
              </button>
              <button
                type="button"
                disabled={isRevealed}
                onClick={() => adjustClock(0, 15)}
                className="qv-btn min-h-[42px] rounded-xl border-2 border-[#6366F1] bg-[#EEF2FF] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#4338CA] disabled:opacity-45"
              >
                +15 min
              </button>
              {currentQ.minuteStep === 1 && (
                <>
                  <button
                    type="button"
                    disabled={isRevealed}
                    onClick={() => adjustClock(0, -1)}
                    className="qv-btn min-h-[42px] rounded-xl border-2 border-[#6EE7B7] bg-[#ECFDF5] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#047857] disabled:opacity-45"
                  >
                    −1 min
                  </button>
                  <button
                    type="button"
                    disabled={isRevealed}
                    onClick={() => adjustClock(0, 1)}
                    className="qv-btn min-h-[42px] rounded-xl border-2 border-[#059669] bg-[#D1FAE5] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#047857] disabled:opacity-45"
                  >
                    +1 min
                  </button>
                </>
              )}
            </div>

            {!isRevealed && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleCheckSetClock}
                  className="qv-arcade-btn inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-7 py-2.5 font-display text-base font-extrabold text-white"
                  style={{ borderBottomColor: '#065F46' }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Check Clock! 核對指針</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Input Mode 2: Blooket 4-Color Big Choice Buttons */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.choices.map((choice, idx) => {
              const palette = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isCorrectChoice = choice === currentQ.correctChoice;
              const isWrongPicked = wrongFeedback?.chosen === choice;
              return (
                <button
                  key={`${currentQ.id}-${choice}`}
                  type="button"
                  disabled={isRevealed}
                  onClick={() => recordAnswer(choice, isCorrectChoice)}
                  className={`qv-arcade-btn min-h-[58px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 font-display text-base sm:text-lg font-extrabold text-white transition-all flex items-center justify-center gap-2 ${
                    !isRevealed
                      ? ''
                      : isCorrectChoice
                        ? 'ring-4 ring-[#10B981] scale-[1.01]'
                        : isWrongPicked
                          ? 'opacity-65 ring-4 ring-[#F43F5E]'
                          : 'opacity-40'
                  }`}
                  style={{
                    backgroundColor: palette.bg,
                    borderBottomColor: palette.border,
                  }}
                >
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Correct Feedback Banner */}
        {correctFeedback && (
          <div className="rounded-2xl border-2 border-[#10B981] bg-[#ECFDF5] p-3.5 space-y-1">
            <div className="font-display text-sm font-extrabold text-[#047857]">
              🎉 Awesome! {correctFeedback}
            </div>
            <p className="text-xs font-bold text-[#065F46]">{currentQ.zhExplanation}</p>
          </div>
        )}

        {/* Wrong Answer Mastery-Queue Feedback Banner */}
        {wrongFeedback && (
          <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 space-y-2.5">
            <div className="space-y-1">
              <p className="font-display text-sm sm:text-base font-extrabold text-[#92400E]">
                💡 Good try! Answer: <span className="text-[#047857]">{currentQ.correctChoice}</span>
                {currentQ.inputKind === 'set-clock' && ` (You set ${wrongFeedback.chosen})`}
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#44403C]">{currentQ.explanation}</p>
              <p className="text-xs font-bold text-[#78350F]">{currentQ.zhExplanation}</p>
              {currentQ.conversionTip && (
                <div className="inline-block rounded-lg bg-white border border-[#FCD34D] px-2.5 py-1 text-[11px] font-extrabold text-[#B45309]">
                  📌 Quick Tip: {currentQ.conversionTip}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleAdvanceAfterWrong}
              className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#F59E0B] px-5 py-2 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#B45309' }}
            >
              <span>Got It, Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

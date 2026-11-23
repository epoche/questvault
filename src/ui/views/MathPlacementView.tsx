import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Coins, ShoppingBag, Sparkles, Volume2 } from 'lucide-react';
import { audioService } from '../../core/audio';
import type { DifficultyTier } from '../../core/types';
import {
  createMathPlacementSession,
  MATH_PLACEMENT_BONUS_TOKENS,
  submitMathPlacementAnswer,
} from '../../subjects/math/mathPlacement';
import { BUILTIN_MATH_SETS, MATH_TIER_META } from '../../subjects/math/questSets';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { MathVisual } from '../artwork/MathVisual';

const TILE_THEMES = [
  { bg: '#2563EB', border: '#1D4ED8' },
  { bg: '#0D9488', border: '#0F766E' },
  { bg: '#EA580C', border: '#C2410C' },
  { bg: '#9333EA', border: '#7E22CE' },
];

interface MathPlacementViewProps {
  equippedCollectibleId: string;
  alreadyCompleted?: boolean;
  onExit: () => void;
  onComplete: (recommendedTier: DifficultyTier) => void;
  onGoToMarket: () => void;
}

export const MathPlacementView: React.FC<MathPlacementViewProps> = ({
  equippedCollectibleId,
  alreadyCompleted = false,
  onExit,
  onComplete,
  onGoToMarket,
}) => {
  const prefersReduced = useReducedMotion();
  const [session, setSession] = useState(() => createMathPlacementSession(BUILTIN_MATH_SETS));
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    choice: string;
    answer: string;
    explanation: string;
    canContinue: boolean;
  } | null>(null);
  const [savedResult, setSavedResult] = useState(false);

  const q = session.currentQuestion;
  const [bonusAmount] = useState(() => (alreadyCompleted ? 0 : MATH_PLACEMENT_BONUS_TOKENS));
  const [wasFirstRun] = useState(() => !alreadyCompleted);

  useEffect(() => {
    if (session.completed && !savedResult) {
      setSavedResult(true);
      audioService.playChest();
      onComplete(session.recommendedTier);
    }
  }, [session.completed, session.recommendedTier, savedResult, onComplete]);

  const advanceAfterWrong = () => {
    if (!feedback || feedback.correct || !feedback.canContinue) return;
    const picked = feedback.choice;
    setFeedback(null);
    setSession((prev) => submitMathPlacementAnswer(prev, picked));
  };

  const handlePick = (choice: string) => {
    if (!q || feedback) return;
    const isCorrect = choice === q.correctAnswer;
    if (isCorrect) {
      audioService.playCorrect(2);
      setFeedback({
        correct: true,
        choice,
        answer: q.correctAnswer,
        explanation: q.explanation,
        canContinue: false,
      });
      window.setTimeout(() => {
        setFeedback(null);
        setSession((prev) => submitMathPlacementAnswer(prev, choice));
      }, 650);
    } else {
      audioService.playNudge();
      setFeedback({
        correct: false,
        choice,
        answer: q.correctAnswer,
        explanation: q.explanation,
        canContinue: false,
      });
      window.setTimeout(() => {
        setFeedback((cur) => (cur ? { ...cur, canContinue: true } : null));
      }, 750);
    }
  };

  if (session.completed) {
    const tierInfo = MATH_TIER_META[session.recommendedTier];
    const score = session.history.filter((h) => h.correct).length;
    return (
      <div className="mx-auto max-w-2xl">
        <motion.section
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="qv-surface rounded-3xl p-7 text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="qv-float rounded-3xl border-2 border-[#1C1917] bg-[#FEF3C7] p-2">
              <CollectibleArt id={equippedCollectibleId} size={112} />
            </div>
          </div>

          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-sm font-extrabold text-white"
              style={{ backgroundColor: tierInfo.colorHex }}
            >
              <Sparkles className="h-4 w-4" />
              Recommended: {tierInfo.label}
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1C1917]">
              Math Warm-Up Complete!
            </h1>
            <p className="mt-2 text-base font-semibold text-[#44403C]">
              {session.recommendationReason}
            </p>
            <p className="mt-1.5 text-sm font-bold text-[#57534E] tabular-nums">
              {score}/{session.totalQuestions} clean hits ·{' '}
              {wasFirstRun ? (
                <>
                  Unlocked <strong className="text-[#D97706]">+{bonusAmount} Tokens</strong> (2 Mystery Packs!)
                </>
              ) : (
                <span>Level updated! (Recheck · +0 Tokens)</span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn qv-arcade-btn inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-6 py-3.5 font-display text-base font-extrabold text-white"
              style={{ borderBottomColor: '#1E3A8A' }}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>{wasFirstRun ? 'Open 2 Packs Now!' : 'Visit Pack Market'}</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn w-full sm:w-auto rounded-2xl border-2 border-[#E7E2D8] bg-white px-5 py-3.5 text-sm font-extrabold text-[#57534E]"
            >
              Start {tierInfo.shortLabel} Math Quests
            </button>
          </div>
        </motion.section>
      </div>
    );
  }

  if (!q) return null;
  const tierInfo = MATH_TIER_META[q.tier];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="qv-surface rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="qv-btn inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#57534E] hover:bg-[#F3EFE7]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: session.totalQuestions }).map((_, i) => {
            const rec = session.history[i];
            const isCurrent = i === q.index;
            return (
              <span
                key={i}
                className={`h-2.5 rounded-full transition-all ${
                  isCurrent ? 'w-7 bg-[#2563EB]' : 'w-2.5'
                } ${
                  rec
                    ? rec.correct
                      ? 'bg-[#059669]'
                      : 'bg-[#F59E0B]'
                    : !isCurrent
                      ? 'bg-[#E7E2D8]'
                      : ''
                }`}
              />
            );
          })}
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#1C1917] px-3 py-1 text-xs font-extrabold tabular-nums">
          <Coins className="h-3.5 w-3.5 text-[#D97706]" />
          +{bonusAmount}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={q.index}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.18 }}
          className="qv-surface rounded-3xl p-5 sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={feedback?.correct ? 'qv-hop' : 'qv-float'}>
                <CollectibleArt
                  id={equippedCollectibleId}
                  size={52}
                  className="border-2 border-[#1C1917]"
                />
              </div>
              <div>
                <span
                  className="inline-block rounded-full px-3 py-0.5 text-xs font-extrabold text-white"
                  style={{ backgroundColor: tierInfo.colorHex }}
                >
                  {tierInfo.label}
                </span>
                <div className="mt-0.5 text-xs font-bold text-[#57534E] tabular-nums">
                  Math Warm-Up {q.index + 1} of {session.totalQuestions}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => audioService.speak(q.promptText, 'en-US')}
              aria-label="Read math problem aloud"
              className="qv-btn inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#E7E2D8] bg-[#FAF7F2] text-[#2563EB]"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-2xl bg-[#FAF7F2] border-2 border-[#E7E2D8] p-5 space-y-4">
            <p className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-snug tabular-nums">
              {q.promptText}
            </p>
            {q.visual && (
              <div className="rounded-xl bg-white border border-[#E7E2D8] p-3">
                <MathVisual spec={q.visual} />
              </div>
            )}
            {feedback && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-extrabold ${
                    feedback.correct
                      ? 'bg-[#ECFDF5] text-[#047857]'
                      : 'bg-[#FEF3C7] text-[#92400E]'
                  }`}
                >
                  {feedback.correct ? 'Nice!' : `${feedback.answer} · ${feedback.explanation}`}
                </span>

                {!feedback.correct && (
                  <button
                    type="button"
                    disabled={!feedback.canContinue}
                    onClick={advanceAfterWrong}
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
            {q.choices.map((choice, idx) => {
              const theme = TILE_THEMES[idx % TILE_THEMES.length];
              const isAnswer = feedback && choice === q.correctAnswer;
              return (
                <button
                  key={choice}
                  type="button"
                  disabled={Boolean(feedback)}
                  onClick={() => handlePick(choice)}
                  className="qv-arcade-btn rounded-2xl border-2 border-[#1C1917] px-5 py-4 font-display text-xl font-extrabold text-white tabular-nums shadow-sm disabled:cursor-default"
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
      </AnimatePresence>
    </div>
  );
};

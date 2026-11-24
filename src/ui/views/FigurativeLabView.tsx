import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageSquareQuote,
  Volume2,
  XCircle,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import { applyQuestRewardMultiplier, type QuestRewardPolicy } from '../../core/economy';
import type { FigurativeQuestSet } from '../../subjects/english/figurativeTypes';
import { QuestSummaryCard } from '../components/QuestSummaryCard';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { LETTER_CHOICE_PALETTE as CHOICE_COLORS } from '../theme/choicePalette';

export interface FigurativeCompletionPayload {
  setId: string;
  title: string;
  correctCount: number;
  totalQuestions: number;
  rawTokensEarned: number;
  wordOutcomes: { word: string; tier: FigurativeQuestSet['tier']; outcome: 'clean' | 'missed' }[];
}

interface FigurativeLabViewProps {
  questSet: FigurativeQuestSet;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  rewardPolicy: QuestRewardPolicy;
  onComplete: (payload: FigurativeCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

function renderHighlightedPassage(passage: string, highlightPhrase?: string) {
  if (!highlightPhrase || !highlightPhrase.trim()) return passage;
  const idx = passage.toLowerCase().indexOf(highlightPhrase.toLowerCase());
  if (idx < 0) return passage;
  const before = passage.slice(0, idx);
  const match = passage.slice(idx, idx + highlightPhrase.length);
  const after = passage.slice(idx + highlightPhrase.length);
  return (
    <>
      {before}
      <mark className="rounded-lg bg-[#FEF08A] px-1.5 py-0.5 text-[#1C1917] underline decoration-[#D97706] decoration-2 underline-offset-4">
        {match}
      </mark>
      {after}
    </>
  );
}

export const FigurativeLabView: React.FC<FigurativeLabViewProps> = ({
  questSet,
  equippedCollectibleId,
  isAvatarShiny = false,
  rewardPolicy,
  onComplete,
  onExit,
  onGoToMarket,
}) => {
  const [lockedPolicy, setLockedPolicy] = useState<QuestRewardPolicy>(() => rewardPolicy);
  const [qIndex, setQIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [finalAwarded, setFinalAwarded] = useState(0);

  const answeringRef = useRef(false);
  const settledRef = useRef(false);
  const outcomesRef = useRef<FigurativeCompletionPayload['wordOutcomes']>([]);
  const correctCountRef = useRef(0);

  useEffect(() => () => audioService.stopSpeech(), []);

  const handleRestart = () => {
    audioService.stopSpeech();
    setLockedPolicy(rewardPolicy);
    answeringRef.current = false;
    settledRef.current = false;
    outcomesRef.current = [];
    correctCountRef.current = 0;
    setQIndex(0);
    setSelectedChoice(null);
    setCorrectCount(0);
    setDone(false);
    setFinalAwarded(0);
  };

  const handleChoose = (idx: number) => {
    if (answeringRef.current || selectedChoice !== null || settledRef.current) return;
    const q = questSet.questions[qIndex];
    if (!q) return;

    answeringRef.current = true;
    setSelectedChoice(idx);

    const isRight = idx === q.correctIndex;
    const keyLabel = q.highlightPhrase?.trim() || q.choices[q.correctIndex];
    outcomesRef.current = [
      ...outcomesRef.current,
      { word: keyLabel, tier: questSet.tier, outcome: isRight ? 'clean' : 'missed' },
    ];
    if (isRight) {
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
      audioService.playCorrect(correctCountRef.current);
    } else {
      audioService.playNudge();
    }
  };

  const handleNext = () => {
    if (!answeringRef.current || selectedChoice === null || settledRef.current) return;
    audioService.stopSpeech();
    const nextIdx = qIndex + 1;
    if (nextIdx >= questSet.questions.length) {
      settledRef.current = true;
      const rawTokens =
        15 +
        correctCountRef.current * 4 +
        (correctCountRef.current === questSet.questions.length ? 5 : 0);
      const awarded = applyQuestRewardMultiplier(rawTokens, lockedPolicy.multiplier);
      setFinalAwarded(awarded);
      onComplete({
        setId: questSet.id,
        title: `Figurative Lab: ${questSet.title}`,
        correctCount: correctCountRef.current,
        totalQuestions: questSet.questions.length,
        rawTokensEarned: rawTokens,
        wordOutcomes: outcomesRef.current,
      });
      setDone(true);
      audioService.playChest();
      return;
    }

    answeringRef.current = false;
    setQIndex(nextIdx);
    setSelectedChoice(null);
  };

  if (done) {
    const acc = Math.round((correctCount / Math.max(1, questSet.questions.length)) * 100);
    return (
      <QuestSummaryCard
        equippedCollectibleId={equippedCollectibleId}
        isAvatarShiny={isAvatarShiny}
        emblemCollectibleId={questSet.emblemCollectibleId}
        title={`💬 ${questSet.title} Clear!`}
        subtitle={`Scored ${correctCount} / ${questSet.questions.length} (${acc}% accuracy)`}
        tokensAwarded={finalAwarded}
        primaryBgHex="#2563EB"
        primaryBorderBottomHex="#1E3A8A"
        retryLabel="Practice Again"
        exitLabel="Back to Quests"
        marketLabel="Open Packs!"
        onRetry={handleRestart}
        onExit={onExit}
        onGoToMarket={onGoToMarket}
      />
    );
  }

  const q = questSet.questions[qIndex];
  if (!q) return null;
  const answered = selectedChoice !== null;
  const isCorrect = answered && selectedChoice === q.correctIndex;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold tabular-nums"
            style={{ backgroundColor: questSet.bgHex, color: questSet.accentHex }}
          >
            <MessageSquareQuote className="h-3.5 w-3.5" />
            <span>
              {questSet.categoryTag} · {qIndex + 1} / {questSet.questions.length}
            </span>
          </span>
          <span className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-extrabold text-[#047857] tabular-nums">
            ✓ {correctCount}
          </span>
        </div>
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang="en" />

      <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#57534E]">
              {q.emoji} {questSet.title}
            </span>
            <button
              type="button"
              onClick={() => audioService.speak(q.spokenText, 'en-US')}
              className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#E5DFD3] bg-[#FAF7F2] px-3 py-1 text-xs font-extrabold text-[#1C1917]"
            >
              <Volume2 className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>Read Aloud</span>
            </button>
          </div>

          {/* Literary Passage Box */}
          <div className="rounded-2xl border-2 border-[#E7E2D8] bg-[#FAF8F4] px-5 py-4 text-center">
            <p className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] leading-relaxed">
              “{renderHighlightedPassage(q.passage, q.highlightPhrase)}”
            </p>
          </div>

          <h2 className="text-center font-display text-base sm:text-lg font-extrabold text-[#1E3A8A]">
            {q.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.choices.map((choice, idx) => {
            const style = CHOICE_COLORS[idx % CHOICE_COLORS.length];
            const isSelected = selectedChoice === idx;
            const isRightChoice = idx === q.correctIndex;
            const btnBg = !answered
              ? style.bg
              : isRightChoice
                ? '#059669'
                : isSelected
                  ? '#E11D48'
                  : '#CBD5E1';
            const btnBorder = !answered
              ? style.border
              : isRightChoice
                ? '#065F46'
                : isSelected
                  ? '#9F1239'
                  : '#94A3B8';

            return (
              <button
                key={`${q.id}-opt-${idx}`}
                type="button"
                disabled={answered}
                onClick={() => handleChoose(idx)}
                className="qv-arcade-btn min-h-[64px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 font-display text-sm sm:text-base font-extrabold text-white flex items-center gap-2.5 text-left transition-all"
                style={{ backgroundColor: btnBg, borderBottomColor: btnBorder }}
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                  {style.badge}
                </span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isCorrect ? 'border-[#10B981] bg-[#ECFDF5]' : 'border-[#FB7185] bg-[#FFF1F2]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#059669] mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 text-[#E11D48] mt-0.5" />
              )}
              <div className="space-y-1">
                <p
                  className={`font-display text-sm font-extrabold ${
                    isCorrect ? 'text-[#065F46]' : 'text-[#9F1239]'
                  }`}
                >
                  {isCorrect
                    ? 'Awesome! Sharp literary thinking!'
                    : `The best answer is Option ${CHOICE_COLORS[q.correctIndex].badge}:`}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#1C1917] leading-snug">
                  {q.explanationEn}
                </p>
                <p className="text-xs font-semibold text-[#57534E] leading-snug">
                  💡 {q.explanationZh}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#000000' }}
            >
              <span>{qIndex + 1 >= questSet.questions.length ? 'Finish Quest' : 'Got It, Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Coins,
  Gift,
  Lock,
  Play,
  ShoppingBag,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import { applyQuestRewardMultiplier, type QuestRewardPolicy } from '../../core/economy';
import {
  calculateEnglishChapterTokens,
  EN_CHAPTER_SERIES_CHEST_BONUS,
  getEnglishSeriesCompletedCount,
  isEnglishEpisodeUnlocked,
  isEnglishSeriesFullyCompleted,
  type EnglishChapterEpisode,
  type EnglishChapterQuestion,
  type EnglishChapterSeries,
} from '../../subjects/english/englishChapterStories';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { BLOOKET_CHOICE_PALETTE as CHOICE_STYLES } from '../theme/choicePalette';

export interface EnglishChapterEpisodeCompletionPayload {
  seriesId: string;
  seriesTitle: string;
  episodeId: string;
  episodeNumber: 1 | 2 | 3 | 4 | 5;
  episodeTitle: string;
  tier: EnglishChapterSeries['tier'];
  tokensEarned: number;
  rawTokensEarned: number;
  accuracyPct: number;
}

interface EnglishChapterSeriesViewProps {
  series: EnglishChapterSeries;
  completedEpisodeIds: string[];
  claimedSeriesIds: string[];
  getEpisodeRewardPolicy?: (episodeId: string) => QuestRewardPolicy;
  onCompleteEpisode: (payload: EnglishChapterEpisodeCompletionPayload) => void;
  onClaimSeriesChest: (series: EnglishChapterSeries) => boolean;
  onExit: () => void;
  onGoToMarket: () => void;
}

export const EnglishChapterSeriesView: React.FC<EnglishChapterSeriesViewProps> = ({
  series,
  completedEpisodeIds,
  claimedSeriesIds,
  getEpisodeRewardPolicy,
  onCompleteEpisode,
  onClaimSeriesChest,
  onExit,
  onGoToMarket,
}) => {
  const [activeEpisode, setActiveEpisode] = useState<EnglishChapterEpisode | null>(null);
  const [activeEpisodePolicy, setActiveEpisodePolicy] = useState<QuestRewardPolicy | undefined>(
    undefined,
  );
  const [step, setStep] = useState<'read' | 'quiz' | 'episodeClear'>('read');

  const [quizQueue, setQuizQueue] = useState<EnglishChapterQuestion[]>([]);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosenIndex: number } | null>(null);
  const [correctBanner, setCorrectBanner] = useState<string | null>(null);
  const [missedIds, setMissedIds] = useState<Record<string, boolean>>({});
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [lastEarnedTokens, setLastEarnedTokens] = useState(0);
  const [chestJustClaimed, setChestJustClaimed] = useState(false);

  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const completedEpRef = useRef(false);
  const claimingChestRef = useRef(false);
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

  useEffect(() => {
    claimingChestRef.current = false;
    setChestJustClaimed(false);
  }, [series.id]);

  useEffect(() => {
    if (!wrongFeedback) {
      advancingRef.current = false;
    }
  }, [wrongFeedback]);

  const closeEpisode = useCallback(() => {
    clearTimer();
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // Ignore sandbox speech errors
    }
    answeringRef.current = false;
    advancingRef.current = false;
    setActiveEpisode(null);
  }, [clearTimer]);

  const completedCount = getEnglishSeriesCompletedCount(series, completedEpisodeIds);
  const seriesDone = isEnglishSeriesFullyCompleted(series, completedEpisodeIds);
  const chestClaimed = claimedSeriesIds.includes(series.id);

  const openEpisode = (ep: EnglishChapterEpisode) => {
    clearTimer();
    answeringRef.current = false;
    advancingRef.current = false;
    completedEpRef.current = false;
    setActiveEpisode(ep);
    setActiveEpisodePolicy(getEpisodeRewardPolicy?.(ep.id));
    setStep('read');
    setQuizQueue([...ep.questions]);
    setWrongFeedback(null);
    setCorrectBanner(null);
    setMissedIds({});
    setFirstTryRight(0);
    audioService.playToken();
  };

  const handleReadAloud = (paragraphs: string[]) => {
    audioService.speak(paragraphs.join(' '), 'en-US', 0.92);
  };

  const handleAnswerChoice = (choiceIdx: number) => {
    if (!activeEpisode || step !== 'quiz' || answeringRef.current || wrongFeedback || correctBanner) {
      return;
    }
    const q = quizQueue[0];
    if (!q) return;
    answeringRef.current = true;

    if (choiceIdx === q.correctIndex) {
      const wasMissed = Boolean(missedIds[q.id]);
      const nextFirstTry = wasMissed ? firstTryRight : firstTryRight + 1;
      setFirstTryRight(nextFirstTry);
      setCorrectBanner(`✨ Correct! ${q.explanation}`);
      audioService.playCorrect(nextFirstTry);

      timerRef.current = window.setTimeout(() => {
        const remaining = quizQueue.slice(1);
        if (remaining.length === 0) {
          if (!completedEpRef.current) {
            completedEpRef.current = true;
            const totalQ = activeEpisode.questions.length;
            const rawTokens = calculateEnglishChapterTokens(nextFirstTry, totalQ);
            const mult = activeEpisodePolicy?.multiplier ?? 1;
            const awarded = applyQuestRewardMultiplier(rawTokens, mult);
            const acc = Math.round((nextFirstTry / Math.max(1, totalQ)) * 100);
            setLastEarnedTokens(awarded);
            onCompleteEpisode({
              seriesId: series.id,
              seriesTitle: series.title,
              episodeId: activeEpisode.id,
              episodeNumber: activeEpisode.episodeNumber,
              episodeTitle: activeEpisode.title,
              tier: series.tier,
              tokensEarned: awarded,
              rawTokensEarned: rawTokens,
              accuracyPct: acc,
            });
            if (awarded > 0) audioService.playChest();
          }
          setStep('episodeClear');
          setCorrectBanner(null);
          answeringRef.current = false;
        } else {
          setQuizQueue(remaining);
          setCorrectBanner(null);
          answeringRef.current = false;
        }
      }, 850);
    } else {
      setMissedIds((prev) => ({ ...prev, [q.id]: true }));
      setWrongFeedback({ chosenIndex: choiceIdx });
      audioService.playNudge();
    }
  };

  const handleContinueAfterWrong = () => {
    if (advancingRef.current || !wrongFeedback) return;
    advancingRef.current = true;
    const q = quizQueue[0];
    if (q) {
      setQuizQueue([...quizQueue.slice(1), q]);
    }
    setWrongFeedback(null);
    answeringRef.current = false;
    audioService.playToken();
  };

  const handleClaimChest = () => {
    if (claimingChestRef.current || !seriesDone || chestClaimed) return;
    claimingChestRef.current = true;
    const ok = onClaimSeriesChest(series);
    if (ok) {
      setChestJustClaimed(true);
      audioService.playChest();
    } else {
      claimingChestRef.current = false;
    }
  };

  // Series Overview & Episode Map
  if (!activeEpisode) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3.5 py-2 text-xs sm:text-sm font-extrabold text-[#57534E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Quests</span>
          </button>
          <span
            className="rounded-full border px-3 py-1 text-xs font-extrabold"
            style={{
              backgroundColor: series.bgHex,
              borderColor: series.accentHex,
              color: series.accentHex,
            }}
          >
            📖 {series.genreTag} · Tier {series.tier}
          </span>
        </div>

        {/* Series Hero Card */}
        <div
          className="rounded-3xl border-3 border-[#1C1917] p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-4"
          style={{ backgroundColor: series.bgHex }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="rounded-2xl border-2 border-[#1C1917] bg-white p-2 shrink-0">
              <CollectibleArt id={series.emblemCollectibleId} size={78} />
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
                {series.title}
              </h1>
              <p className="text-xs sm:text-sm font-extrabold" style={{ color: series.accentHex }}>
                {series.subtitle}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#57534E]">{series.synopsis}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#1C1917]/15 bg-white/90 px-4 py-2.5">
            <span className="text-xs sm:text-sm font-extrabold text-[#1C1917] tabular-nums">
              Progress: {completedCount} / {series.episodes.length} Chapters Completed
            </span>
            {seriesDone && !chestClaimed ? (
              <button
                type="button"
                onClick={handleClaimChest}
                className="qv-arcade-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#F59E0B] px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold text-white"
                style={{ borderBottomColor: '#B45309' }}
              >
                <Gift className="h-4 w-4" />
                <span>Claim +{EN_CHAPTER_SERIES_CHEST_BONUS} Series Chest!</span>
              </button>
            ) : chestClaimed || chestJustClaimed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#10B981] px-3 py-1 text-xs font-extrabold text-[#047857]">
                <Trophy className="h-3.5 w-3.5" />
                Series Chest Claimed!
              </span>
            ) : (
              <span className="text-xs font-extrabold text-[#B45309]">
                🎁 Finish all 5 chapters for +{EN_CHAPTER_SERIES_CHEST_BONUS} Bonus Tokens!
              </span>
            )}
          </div>
        </div>

        {/* 5 Episodes List */}
        <div className="space-y-3">
          {series.episodes.map((ep) => {
            const unlocked = isEnglishEpisodeUnlocked(series, ep.episodeNumber, completedEpisodeIds);
            const done = completedEpisodeIds.includes(ep.id);
            return (
              <button
                key={ep.id}
                type="button"
                disabled={!unlocked}
                onClick={() => openEpisode(ep)}
                className={`qv-btn w-full rounded-2xl border-2 p-4 text-left flex items-center justify-between gap-3 transition-all ${
                  unlocked
                    ? 'border-[#1C1917] bg-white shadow-[0_3px_0_#1C1917]'
                    : 'border-[#E5DFD3] bg-[#F5F2EB] opacity-65 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#1C1917] font-display text-sm font-extrabold"
                    style={{
                      backgroundColor: done ? '#ECFDF5' : unlocked ? series.bgHex : '#E5DFD3',
                      color: done ? '#047857' : '#1C1917',
                    }}
                  >
                    {done ? <CheckCircle2 className="h-5 w-5" /> : unlocked ? `Ch.${ep.episodeNumber}` : <Lock className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base font-extrabold text-[#1C1917] truncate">
                      Chapter {ep.episodeNumber}: {ep.title}
                    </p>
                    <p className="text-xs font-semibold text-[#57534E]">
                      {done
                        ? 'Completed · Tap to re-read'
                        : unlocked
                          ? 'Ready to read · 3 comprehension questions'
                          : `Complete Chapter ${ep.episodeNumber - 1} to unlock`}
                    </p>
                  </div>
                </div>
                {unlocked && (
                  <span
                    className="shrink-0 inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold text-white"
                    style={{ backgroundColor: series.accentHex }}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{done ? 'Replay' : 'Read'}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Episode Clear Screen
  if (step === 'episodeClear') {
    const nextEp = series.episodes.find((e) => e.episodeNumber === activeEpisode.episodeNumber + 1);
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 shadow-[0_6px_0_#1C1917] text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#10B981] px-3.5 py-1 text-xs font-extrabold text-[#047857]">
            <Trophy className="h-4 w-4" />
            CHAPTER {activeEpisode.episodeNumber} COMPLETE!
          </span>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
            {activeEpisode.title}
          </h1>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#FEF3C7] border border-[#F59E0B] px-5 py-2.5 font-display text-xl font-extrabold text-[#D97706] tabular-nums">
            <Coins className="h-5 w-5" />+{lastEarnedTokens} Tokens
          </div>

          {activeEpisode.cliffhanger && (
            <div className="rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF] p-4 text-sm font-bold text-[#3730A3]">
              ✨ Next Chapter Teaser: “{activeEpisode.cliffhanger}”
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {nextEp ? (
              <button
                type="button"
                onClick={() => openEpisode(nextEp)}
                className="qv-arcade-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
                style={{ borderBottomColor: '#1E3A8A' }}
              >
                <span>Read Chapter {nextEp.episodeNumber}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={closeEpisode}
                className="qv-arcade-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
                style={{ borderBottomColor: '#B45309' }}
              >
                <Gift className="h-4 w-4" />
                <span>Claim Series Chest!</span>
              </button>
            )}
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#1C1917] font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Open Packs</span>
            </button>
          </div>

          <button
            type="button"
            onClick={closeEpisode}
            className="text-xs font-extrabold text-[#57534E] underline"
          >
            Back to Chapter List
          </button>
        </div>
      </div>
    );
  }

  // Reading or Quiz view
  const currentQ = quizQueue[0];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={closeEpisode}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#57534E]"
        >
          <X className="h-4 w-4" />
          <span>Chapters</span>
        </button>
        <span className="rounded-full bg-[#F3EFE7] px-3 py-1 text-xs font-extrabold text-[#1C1917]">
          {series.title} · Chapter {activeEpisode.episodeNumber}
        </span>
      </div>

      {activeEpisodePolicy && <RewardPolicyBanner policy={activeEpisodePolicy} />}

      {step === 'read' ? (
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-7 shadow-[0_6px_0_#1C1917] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold" style={{ color: series.accentHex }}>
                <BookOpen className="h-3.5 w-3.5" />
                Chapter {activeEpisode.episodeNumber} of 5
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
                {activeEpisode.title}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => handleReadAloud(activeEpisode.paragraphs)}
              className="qv-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#EFF6FF] px-4 py-2 text-xs sm:text-sm font-extrabold text-[#1D4ED8]"
            >
              <Volume2 className="h-4 w-4" />
              <span>Read Aloud</span>
            </button>
          </div>

          <div className="space-y-3.5 text-base sm:text-lg font-medium text-[#1C1917] leading-relaxed">
            {activeEpisode.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Key Vocabulary Spotlight */}
          <div className="rounded-2xl border-2 border-[#F3EFE7] bg-[#FAF8F4] p-4 space-y-2">
            <p className="inline-flex items-center gap-1 text-xs font-extrabold text-[#B45309]">
              <Sparkles className="h-3.5 w-3.5" />
              Key Story Words
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeEpisode.keyVocab.map((v) => (
                <div key={v.word} className="rounded-xl bg-white border border-[#E5DFD3] p-2.5">
                  <p className="font-display text-sm font-extrabold text-[#1C1917]">{v.word}</p>
                  <p className="text-xs font-semibold text-[#57534E]">{v.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStep('quiz');
              audioService.playToken();
            }}
            className="qv-arcade-btn w-full min-h-[52px] rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] text-white font-display text-base sm:text-lg font-extrabold inline-flex items-center justify-center gap-2"
            style={{ borderBottomColor: '#1E3A8A' }}
          >
            <span>Start 3-Question Check!</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : (
        currentQ && (
          <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#EEF2FF] border border-[#C7D2FE] px-3 py-1 text-xs font-extrabold text-[#4338CA]">
                {currentQ.skillTag}
              </span>
              <span className="text-xs font-extrabold text-[#78716C] tabular-nums">
                {quizQueue.length} {quizQueue.length === 1 ? 'question' : 'questions'} left
              </span>
            </div>

            <h2 className="font-display text-lg sm:text-2xl font-extrabold text-[#1C1917] leading-snug">
              {currentQ.prompt}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.choices.map((choice, idx) => {
                const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
                const isCorrect = idx === currentQ.correctIndex;
                const isChosenWrong = wrongFeedback?.chosenIndex === idx;
                const dimmed =
                  (Boolean(wrongFeedback) && !isCorrect && !isChosenWrong) ||
                  (Boolean(correctBanner) && !isCorrect);

                return (
                  <button
                    key={`${currentQ.id}-${idx}`}
                    type="button"
                    disabled={Boolean(wrongFeedback) || Boolean(correctBanner)}
                    onClick={() => handleAnswerChoice(idx)}
                    className={`qv-btn min-h-[60px] rounded-2xl border-b-4 px-4 py-3 text-left text-white font-display text-sm sm:text-base font-extrabold flex items-center gap-3 transition-opacity ${
                      dimmed ? 'opacity-45' : ''
                    } ${
                      wrongFeedback && isCorrect
                        ? 'ring-4 ring-[#10B981] ring-offset-2'
                        : isChosenWrong
                          ? 'ring-4 ring-[#1C1917] ring-offset-2'
                          : ''
                    }`}
                    style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
                  >
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs">
                      {st.shape}
                    </span>
                    <span className="flex-1 leading-snug">{choice}</span>
                  </button>
                );
              })}
            </div>

            {correctBanner && (
              <div className="rounded-2xl border-2 border-[#10B981] bg-[#ECFDF5] p-3.5 text-sm font-extrabold text-[#047857]">
                {correctBanner}
              </div>
            )}

            {wrongFeedback && (
              <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 space-y-3">
                <p className="text-sm font-extrabold text-[#B45309]">
                  💡 {currentQ.explanation}
                </p>
                <button
                  type="button"
                  onClick={handleContinueAfterWrong}
                  className="qv-btn min-h-[44px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 text-sm font-extrabold text-white inline-flex items-center gap-1.5"
                >
                  <span>Got It, Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

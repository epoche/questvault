import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Coins,
  Gift,
  Languages,
  Lock,
  Play,
  ShoppingBag,
  Sparkles,
  Square,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  calculateChapterEpisodeTokens,
  CHAPTER_SERIES_CHEST_BONUS,
  getSeriesCompletedCount,
  isEpisodeUnlocked,
  isSeriesFullyCompleted,
  type ChapterEpisode,
  type ChapterQuestion,
  type ChapterSeries,
} from '../../subjects/chinese/chapterStories';
import { CollectibleArt } from '../artwork/CollectibleArt';
import {
  applyQuestRewardMultiplier,
  type QuestRewardPolicy,
} from '../../core/economy';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { RubySentence } from '../components/RubySentence';
import { RubyWord } from '../components/RubyWord';
import { useChineseReadAlong } from '../hooks/useChineseReadAlong';
import { BLOOKET_CHOICE_PALETTE as CHOICE_STYLES } from '../theme/choicePalette';

export interface ChapterEpisodeCompletionPayload {
  seriesId: string;
  seriesTitle: string;
  episodeId: string;
  episodeNumber: 1 | 2 | 3 | 4 | 5;
  episodeTitle: string;
  tier: ChapterSeries['tier'];
  tokensEarned: number;
  rawTokensEarned?: number;
  accuracyPct: number;
}

interface ChapterSeriesViewProps {
  series: ChapterSeries;
  completedEpisodeIds: string[];
  claimedSeriesIds: string[];
  showZhuyin: boolean;
  getEpisodeRewardPolicy?: (episodeId: string) => QuestRewardPolicy;
  onToggleZhuyin: () => void;
  onCompleteEpisode: (payload: ChapterEpisodeCompletionPayload) => void;
  onClaimSeriesChest: (series: ChapterSeries) => boolean;
  onExit: () => void;
  onGoToMarket: () => void;
}

export const ChapterSeriesView: React.FC<ChapterSeriesViewProps> = ({
  series,
  completedEpisodeIds,
  claimedSeriesIds,
  showZhuyin,
  getEpisodeRewardPolicy,
  onToggleZhuyin,
  onCompleteEpisode,
  onClaimSeriesChest,
  onExit,
  onGoToMarket,
}) => {
  const [activeEpisode, setActiveEpisode] = useState<ChapterEpisode | null>(null);
  const [activeEpisodePolicy, setActiveEpisodePolicy] = useState<QuestRewardPolicy | undefined>(
    undefined,
  );
  const [step, setStep] = useState<'read' | 'quiz' | 'episodeClear'>('read');
  const [showEnglishGist, setShowEnglishGist] = useState(false);

  const [quizQueue, setQuizQueue] = useState<ChapterQuestion[]>([]);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosenIndex: number } | null>(null);
  const [correctBanner, setCorrectBanner] = useState<string | null>(null);
  const [missedIds, setMissedIds] = useState<Record<string, boolean>>({});
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [lastEarnedTokens, setLastEarnedTokens] = useState(0);
  const [chestJustClaimed, setChestJustClaimed] = useState(false);

  // Synchronous re-entry locks
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const completedEpRef = useRef(false);
  const claimingChestRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const clearPendingTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const {
    activeSentenceIdx,
    isAutoReading,
    speakSentence,
    toggleAutoReadAlong,
    stopReadAlong,
  } = useChineseReadAlong(
    activeEpisode?.sentences ?? [],
    `${activeEpisode?.id ?? 'hub'}-${step}`,
    Boolean(activeEpisode) && step === 'read',
  );

  useEffect(() => {
    return () => {
      clearPendingTimer();
      audioService.stopSpeech();
    };
  }, [clearPendingTimer]);

  const openEpisode = (ep: ChapterEpisode) => {
    clearPendingTimer();
    stopReadAlong();
    answeringRef.current = false;
    advancingRef.current = false;
    completedEpRef.current = false;
    setActiveEpisode(ep);
    setActiveEpisodePolicy(getEpisodeRewardPolicy?.(ep.id));
    setStep('read');
    setShowEnglishGist(false);
    setQuizQueue([...ep.questions]);
    setWrongFeedback(null);
    setCorrectBanner(null);
    setMissedIds({});
    setFirstTryRight(0);
    setLastEarnedTokens(0);
  };

  const handleBackToHub = () => {
    clearPendingTimer();
    stopReadAlong();
    setActiveEpisode(null);
    setActiveEpisodePolicy(undefined);
    setStep('read');
  };

  const handleClaimChestClick = () => {
    if (claimingChestRef.current) return;
    claimingChestRef.current = true;
    const ok = onClaimSeriesChest(series);
    if (ok) {
      audioService.playChest();
      setChestJustClaimed(true);
    }
    window.setTimeout(() => {
      claimingChestRef.current = false;
    }, 0);
  };

  const currentQ = quizQueue[0] ?? null;

  const advanceAfterWrong = useCallback(() => {
    if (advancingRef.current || !currentQ) return;
    advancingRef.current = true;
    clearPendingTimer();
    setWrongFeedback(null);
    setCorrectBanner(null);
    setQuizQueue((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [clearPendingTimer, currentQ]);

  const handlePickChoice = useCallback(
    (idx: number) => {
      if (!activeEpisode || step !== 'quiz' || !currentQ || answeringRef.current || wrongFeedback) {
        return;
      }
      answeringRef.current = true;

      if (idx === currentQ.correctIndex) {
        audioService.playCorrect(3);
        const alreadyMissed = Boolean(missedIds[currentQ.id]);
        const nextFirstTry = alreadyMissed ? firstTryRight : firstTryRight + 1;
        if (!alreadyMissed) {
          setFirstTryRight(nextFirstTry);
        }
        setCorrectBanner(`✅ 答對了！${currentQ.explanation}`);

        const isLast = quizQueue.length <= 1;
        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;
          setCorrectBanner(null);
          if (isLast) {
            if (!completedEpRef.current) {
              completedEpRef.current = true;
              const rawTokens = calculateChapterEpisodeTokens(
                nextFirstTry,
                activeEpisode.questions.length,
              );
              const awardedTokens = applyQuestRewardMultiplier(
                rawTokens,
                activeEpisodePolicy?.multiplier ?? 1,
              );
              const accuracyPct = Math.round(
                (nextFirstTry / Math.max(1, activeEpisode.questions.length)) * 100,
              );
              setLastEarnedTokens(awardedTokens);
              audioService.playChest();
              onCompleteEpisode({
                seriesId: series.id,
                seriesTitle: series.title,
                episodeId: activeEpisode.id,
                episodeNumber: activeEpisode.episodeNumber,
                episodeTitle: activeEpisode.title,
                tier: series.tier,
                tokensEarned: awardedTokens,
                rawTokensEarned: rawTokens,
                accuracyPct,
              });
            }
            setQuizQueue([]);
            setStep('episodeClear');
          } else {
            setQuizQueue((prev) => prev.slice(1));
            answeringRef.current = false;
          }
        }, 850);
      } else {
        audioService.playNudge();
        setMissedIds((prev) => ({ ...prev, [currentQ.id]: true }));
        setWrongFeedback({ chosenIndex: idx });
      }
    },
    [
      activeEpisode,
      activeEpisodePolicy,
      currentQ,
      firstTryRight,
      missedIds,
      onCompleteEpisode,
      quizQueue.length,
      series.id,
      series.tier,
      series.title,
      step,
      wrongFeedback,
    ],
  );

  // Keyboard shortcuts during quiz
  useEffect(() => {
    if (!activeEpisode || step !== 'quiz') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (wrongFeedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceAfterWrong();
        }
        return;
      }
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx >= 0 && currentQ && idx < currentQ.choices.length) {
        e.preventDefault();
        handlePickChoice(idx);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeEpisode, advanceAfterWrong, currentQ, handlePickChoice, step, wrongFeedback]);

  const completedCount = getSeriesCompletedCount(series, completedEpisodeIds);
  const allFiveDone = isSeriesFullyCompleted(series, completedEpisodeIds);
  const chestClaimed = claimedSeriesIds.includes(series.id);

  // ═══════════ SERIES HUB VIEW ═══════════
  if (!activeEpisode) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="qv-surface rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white px-3 py-1.5 text-xs font-extrabold text-[#57534E]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>回首頁</span>
          </button>

          <button
            type="button"
            onClick={onToggleZhuyin}
            className={`qv-btn min-h-[36px] rounded-xl border px-2.5 py-1 text-xs font-extrabold ${
              showZhuyin
                ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                : 'border-[#E5DFD3] bg-white text-[#57534E]'
            }`}
          >
            注音 {showZhuyin ? '開' : '關'}
          </button>
        </div>

        {/* Series Cover Card */}
        <section
          className="qv-surface rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-[#1C1917]"
          style={{ backgroundColor: series.bgHex }}
        >
          <div className="flex items-center gap-4">
            <CollectibleArt
              id={series.emblemCollectibleId}
              size={76}
              className="border-2 border-[#1C1917] shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                  style={{ backgroundColor: series.accentHex }}
                >
                  {series.genreTag} · 共 5 集
                </span>
                <span className="rounded-full bg-white/90 border border-[#E5DFD3] px-2.5 py-0.5 text-xs font-extrabold text-[#1C1917] tabular-nums">
                  進度 {completedCount}/5 集
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
                《{series.title}》
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#57534E]">{series.tagline}</p>
            </div>
          </div>
        </section>

        {/* Series Completion Chest Banner (+40 Tokens!) */}
        <section className="qv-surface rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-2 border-[#F59E0B] bg-[#FFFBEB]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7]">
              <Gift className="h-6 w-6 text-[#D97706]" />
            </div>
            <div>
              <div className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                全系列 5 集通關寶箱（+{CHAPTER_SERIES_CHEST_BONUS} Tokens）
              </div>
              <div className="text-xs font-semibold text-[#92400E]">
                {chestClaimed
                  ? '🎉 太棒了！你已領取本系列的通關大寶箱！'
                  : allFiveDone
                    ? '5 集全部讀完囉！立刻點擊右側開啟大寶箱！'
                    : `再完成 ${5 - completedCount} 集即可開啟專屬通關寶箱！`}
              </div>
            </div>
          </div>

          {chestClaimed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1.5 text-xs font-extrabold text-[#047857]">
              <CheckCircle2 className="h-4 w-4" />
              {chestJustClaimed ? `已領取 +${CHAPTER_SERIES_CHEST_BONUS}！` : '寶箱已領取'}
            </span>
          ) : (
            <button
              type="button"
              disabled={!allFiveDone}
              onClick={handleClaimChestClick}
              className={`qv-arcade-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border-2 px-4 py-2 font-display text-xs sm:text-sm font-extrabold ${
                allFiveDone
                  ? 'border-[#1C1917] bg-[#F59E0B] text-white'
                  : 'border-[#DDD5C7] bg-[#EFECE4] text-[#9A948A] cursor-not-allowed'
              }`}
              style={allFiveDone ? { borderBottomColor: '#B45309' } : undefined}
            >
              <Coins className="h-4 w-4" />
              <span>開啟 +{CHAPTER_SERIES_CHEST_BONUS} 寶箱</span>
            </button>
          )}
        </section>

        {/* Sequential Episode Cards (EP1 -> EP5) */}
        <div className="space-y-3">
          {series.episodes.map((ep) => {
            const done = completedEpisodeIds.includes(ep.id);
            const unlocked = isEpisodeUnlocked(series, ep.episodeNumber, completedEpisodeIds);
            return (
              <div
                key={ep.id}
                className={`qv-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 transition-opacity ${
                  unlocked ? 'opacity-100' : 'opacity-70 bg-[#F7F4ED]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 font-display text-sm font-extrabold ${
                      done
                        ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                        : unlocked
                          ? 'border-[#1C1917] bg-white text-[#1C1917]'
                          : 'border-[#D8D0C1] bg-[#EFECE4] text-[#78716C]'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : unlocked ? (
                      `EP${ep.episodeNumber}`
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold text-[#57534E]">
                      第 {ep.episodeNumber} 集 · 3 題劇情挑戰
                    </div>
                    <h2 className="font-display text-base sm:text-lg font-extrabold text-[#1C1917] truncate">
                      <RubyWord word={ep.title} zhuyin={ep.titleZhuyin} showZhuyin={showZhuyin} />
                    </h2>
                  </div>
                </div>

                {unlocked ? (
                  <button
                    type="button"
                    onClick={() => openEpisode(ep)}
                    className={`qv-arcade-btn inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#1C1917] px-4 py-2 font-display text-xs sm:text-sm font-extrabold ${
                      done ? 'bg-white text-[#1C1917]' : 'text-white'
                    }`}
                    style={
                      done
                        ? { borderBottomColor: '#1C1917' }
                        : { backgroundColor: series.accentHex, borderBottomColor: '#1C1917' }
                    }
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{done ? '重讀這集' : '開始閱讀'}</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-xl bg-[#EFECE4] px-3 py-2 text-xs font-extrabold text-[#78716C]">
                    <Lock className="h-3.5 w-3.5" />
                    <span>先讀完第 {ep.episodeNumber - 1} 集</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const nextEpisode = series.episodes.find(
    (e) => e.episodeNumber === activeEpisode.episodeNumber + 1,
  );

  // ═══════════ ACTIVE EPISODE VIEW (READ -> QUIZ -> CLEAR) ═══════════
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="qv-surface rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBackToHub}
            className="qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white px-3 py-1.5 text-xs font-extrabold text-[#57534E]"
          >
            <X className="h-3.5 w-3.5" />
            <span>回劇集目錄</span>
          </button>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold text-white"
            style={{ backgroundColor: series.accentHex }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              《{series.title}》第 {activeEpisode.episodeNumber} 集
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleZhuyin}
          className={`qv-btn min-h-[36px] rounded-xl border px-2.5 py-1 text-xs font-extrabold ${
            showZhuyin
              ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
              : 'border-[#E5DFD3] bg-white text-[#57534E]'
          }`}
        >
          注音 {showZhuyin ? '開' : '關'}
        </button>
      </div>

      <RewardPolicyBanner policy={activeEpisodePolicy} lang="zh" />

      {/* STEP 1: READ EPISODE */}
      {step === 'read' && (
        <section className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5">
          {activeEpisode.prevRecap && (
            <div className="rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#5B21B6]">
              📖 上集回顧：{activeEpisode.prevRecap}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              <RubySentence
                text={activeEpisode.title}
                zhuyin={activeEpisode.titleZhuyin}
                showZhuyin={showZhuyin}
                zhuyinClassName="text-[#BE185D]"
              />
            </h1>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                data-testid="zh-chapter-readalong-toggle"
                onClick={toggleAutoReadAlong}
                className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
                  isAutoReading
                    ? 'bg-[#F59E0B] text-[#1C1917]'
                    : 'bg-[#EFF6FF] text-[#1D4ED8]'
                }`}
              >
                {isAutoReading ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-current" />
                    <span>停止跟讀</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>逐句自動跟讀</span>
                  </>
                )}
              </button>
              {activeSentenceIdx !== null && !isAutoReading && (
                <button
                  type="button"
                  onClick={stopReadAlong}
                  className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white px-2.5 py-1 text-xs font-extrabold text-[#57534E]"
                >
                  <Square className="h-3 w-3 fill-current" />
                  <span>清除高亮</span>
                </button>
              )}
            </div>
          </div>

          {/* Story Sentences with 1:1 Taiwan MOE RubySentence + Tap-to-Read Highlight */}
          <div className="rounded-3xl border-2 border-[#E7E2D8] bg-[#FAF7F2] p-4 sm:p-5 space-y-2.5">
            <div className="text-[11px] font-extrabold text-[#78716C]">
              👆 點任一句就會唸出來＋暖黃高亮，或點「逐句自動跟讀」逐句跟著聽！
            </div>
            {activeEpisode.sentences.map((sent, sIdx) => {
              const isActive = activeSentenceIdx === sIdx;
              return (
                <button
                  key={sIdx}
                  type="button"
                  data-testid={`zh-chapter-sentence-btn-${sIdx}`}
                  aria-pressed={isActive}
                  onClick={() => speakSentence(sIdx)}
                  className={`w-full text-left flex items-start gap-2.5 rounded-2xl border-2 px-3 py-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#F59E0B] bg-[#FEF08A] ring-2 ring-[#FDE047]'
                      : 'border-transparent bg-transparent hover:border-[#FDE68A] hover:bg-[#FFFBEB]'
                  }`}
                >
                  <Volume2
                    className={`mt-2 h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#B45309]' : 'text-[#A8A29E]'
                    }`}
                  />
                  <span className="text-lg sm:text-xl font-bold text-[#1C1917] leading-loose">
                    <RubySentence
                      text={sent}
                      zhuyin={activeEpisode.sentencesZhuyin[sIdx]}
                      showZhuyin={showZhuyin}
                      zhuyinClassName="text-[#92400E]"
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Spotlight Vocabulary Chips */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-[#57534E]">✨ 本集重點詞語</div>
            <div className="flex flex-wrap gap-2">
              {activeEpisode.spotlightVocab.map((v) => (
                <div
                  key={v.word}
                  className="rounded-xl border border-[#E5DFD3] bg-white px-3 py-2 text-xs"
                >
                  <RubyWord
                    word={v.word}
                    zhuyin={v.zhuyin}
                    showZhuyin={showZhuyin}
                    className="font-display text-sm font-extrabold text-[#1C1917]"
                    zhuyinClassName="text-[#BE185D]"
                  />
                  <span className="ml-2 font-semibold text-[#57534E]">{v.hint}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible English Gist Helper */}
          <div>
            <button
              type="button"
              onClick={() => setShowEnglishGist((v) => !v)}
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-1.5 text-xs font-extrabold text-[#57534E]"
            >
              <Languages className="h-4 w-4 text-[#2563EB]" />
              <span>{showEnglishGist ? '隱藏英文劇情大意' : '需要幫忙？看英文劇情大意'}</span>
            </button>
            {showEnglishGist && (
              <p className="mt-2 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-xs sm:text-sm font-semibold text-[#1E3A8A]">
                {activeEpisode.englishGist}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              answeringRef.current = false;
              setStep('quiz');
            }}
            className="qv-arcade-btn flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] px-6 py-3 font-display text-base sm:text-lg font-extrabold text-white"
            style={{ backgroundColor: series.accentHex, borderBottomColor: '#1C1917' }}
          >
            <span>讀完了！開始 3 題劇情挑戰</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>
      )}

      {/* STEP 2: 3-QUESTION COMPREHENSION QUIZ */}
      {step === 'quiz' && currentQ && (
        <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1 text-xs font-extrabold text-[#92400E]">
              {currentQ.skillTag}
            </span>
            <span className="text-xs font-extrabold text-[#57534E] tabular-nums">
              剩餘 {quizQueue.length} 題
            </span>
          </div>

          {correctBanner && (
            <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-2.5 text-center font-display text-sm font-extrabold text-[#047857]">
              {correctBanner}
            </div>
          )}

          <div className="rounded-2xl border border-[#E7E2D8] bg-[#FAF7F2] p-5 text-center space-y-2">
            <p className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917]">
              {currentQ.prompt}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.choices.map((ch, idx) => {
              const style = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isCorrectChoice = idx === currentQ.correctIndex;
              const isWrongPicked = wrongFeedback?.chosenIndex === idx;
              const dimmed = Boolean(wrongFeedback) && !isCorrectChoice && !isWrongPicked;

              return (
                <button
                  key={`${currentQ.id}-${idx}`}
                  type="button"
                  disabled={Boolean(wrongFeedback) || Boolean(correctBanner)}
                  onClick={() => handlePickChoice(idx)}
                  className={`qv-arcade-btn min-h-[64px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 text-white flex items-center justify-between gap-2 text-left transition-opacity ${
                    dimmed ? 'opacity-40' : 'opacity-100'
                  } ${
                    wrongFeedback && isCorrectChoice ? 'ring-4 ring-[#10B981]' : ''
                  } ${isWrongPicked ? 'ring-4 ring-[#1C1917]' : ''}`}
                  style={{ backgroundColor: style.bg, borderBottomColor: style.border }}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                      {style.shape}
                    </span>
                    <span className="font-display text-sm sm:text-base font-extrabold leading-snug">
                      {ch}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {wrongFeedback && (
            <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 text-left">
                <div className="text-xs font-extrabold text-[#B45309]">
                  再讀一下線索！（稍後會再練習這題）
                </div>
                <p className="font-display text-sm font-extrabold text-[#1C1917]">
                  {currentQ.explanation}
                </p>
              </div>
              <button
                type="button"
                onClick={advanceAfterWrong}
                className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              >
                <span>記住了，下一題</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* STEP 3: EPISODE CLEAR */}
      {step === 'episodeClear' && (
        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7]">
              <Trophy className="h-8 w-8 text-[#D97706]" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              🎉 第 {activeEpisode.episodeNumber} 集讀完啦！
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              《{series.title}》· {activeEpisode.title}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] px-5 py-2.5 font-display text-xl font-extrabold text-[#92400E] tabular-nums">
            <Coins className="h-5 w-5 text-[#D97706]" />+{lastEarnedTokens} Tokens
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {nextEpisode ? (
              <button
                type="button"
                onClick={() => openEpisode(nextEpisode)}
                className="qv-arcade-btn inline-flex min-h-[48px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] px-6 py-2.5 font-display text-sm sm:text-base font-extrabold text-white"
                style={{ backgroundColor: series.accentHex, borderBottomColor: '#1C1917' }}
              >
                <Sparkles className="h-4 w-4" />
                <span>接著看第 {nextEpisode.episodeNumber} 集 →</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBackToHub}
                className="qv-arcade-btn inline-flex min-h-[48px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] px-6 py-2.5 font-display text-sm sm:text-base font-extrabold text-white"
                style={{ borderBottomColor: '#B45309' }}
              >
                <Gift className="h-4 w-4" />
                <span>回目錄領取 +{CHAPTER_SERIES_CHEST_BONUS} 全系列寶箱！</span>
              </button>
            )}

            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-arcade-btn inline-flex min-h-[48px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
              style={{ borderBottomColor: '#D97706' }}
            >
              <ShoppingBag className="h-4 w-4 text-[#D97706]" />
              <span>去抽盲盒！</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Coins,
  Flame,
  Headphones,
  Lightbulb,
  Sparkles,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import type { DifficultyTier } from '../../core/types';
import {
  buildChineseListeningSession,
  type ChineseListeningChoice,
} from '../../subjects/chinese/listeningEngine';
import { CHINESE_TIER_META } from '../../subjects/chinese/wordSets';
import { RubyWord } from '../components/RubyWord';

export interface ChineseListeningCompletionPayload {
  tier: DifficultyTier;
  correctCount: number;
  totalCount: number;
  tokensEarned: number;
  wordOutcomes: { word: string; correct: boolean }[];
}

interface ChineseListeningViewProps {
  tier: DifficultyTier;
  showZhuyin: boolean;
  onToggleZhuyin: () => void;
  onExit: () => void;
  onComplete: (payload: ChineseListeningCompletionPayload) => void;
}

const CHOICE_KEYS = ['1', '2', '3', '4'];

const BLOO_COLORS = [
  { bg: '#2563EB', border: '#1E40AF' },
  { bg: '#0D9488', border: '#115E59' },
  { bg: '#EA580C', border: '#9A3412' },
  { bg: '#9333EA', border: '#6B21A8' },
];

function cancelSpeechSafely(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore blocked speech synthesis in restricted sandboxes
    }
  }
}

function calculateListeningTokens(correctCount: number, totalCount: number): {
  base: number;
  perCorrect: number;
  perfectBonus: number;
  total: number;
} {
  const base = 8;
  const perCorrect = correctCount * 2;
  const perfectBonus = totalCount > 0 && correctCount === totalCount ? 4 : 0;
  return {
    base,
    perCorrect,
    perfectBonus,
    total: base + perCorrect + perfectBonus,
  };
}

export const ChineseListeningView: React.FC<ChineseListeningViewProps> = ({
  tier,
  showZhuyin,
  onToggleZhuyin,
  onExit,
  onComplete,
}) => {
  const prefersReduced = useReducedMotion();
  const session = useMemo(() => buildChineseListeningSession(tier), [tier]);
  const tierMeta = CHINESE_TIER_META[tier];

  const [phase, setPhase] = useState<'playing' | 'summary'>('playing');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wordOutcomes, setWordOutcomes] = useState<{ word: string; correct: boolean }[]>([]);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    pickedWord: string;
  } | null>(null);
  const [claimed, setClaimed] = useState(false);

  // Synchronous anti-cheat re-entry locks
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const completedRef = useRef(false);

  const totalCount = session.questions.length;
  const currentQuestion = session.questions[questionIdx];
  const correctCount = wordOutcomes.filter((item) => item.correct).length;
  const reward = calculateListeningTokens(correctCount, totalCount);

  // Reset locks cleanly whenever question or phase transitions
  useEffect(() => {
    answeringRef.current = false;
    advancingRef.current = false;
  }, [questionIdx, phase]);

  // Auto-speak the target word whenever a new question appears
  useEffect(() => {
    if (phase !== 'playing' || !currentQuestion) return;
    audioService.speak(currentQuestion.targetWord.word, 'zh-TW', 0.92);
  }, [phase, questionIdx, currentQuestion]);

  // Cancel any ongoing speech synthesis when leaving the view
  useEffect(() => {
    return () => {
      cancelSpeechSafely();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } catch {
        // Ignore in restricted environments
      }
    }
  }, [phase]);

  const speakNormal = () => {
    if (!currentQuestion) return;
    audioService.speak(currentQuestion.targetWord.word, 'zh-TW', 0.92);
  };

  const speakSlow = () => {
    if (!currentQuestion) return;
    audioService.speak(currentQuestion.targetWord.word, 'zh-TW', 0.65);
  };

  const speakContextSentence = () => {
    if (!currentQuestion) return;
    const fullSentence = currentQuestion.targetWord.contextSentence.replace(
      '___',
      currentQuestion.targetWord.word,
    );
    audioService.speak(fullSentence, 'zh-TW', 0.88);
  };

  const handleExit = () => {
    cancelSpeechSafely();
    onExit();
  };

  const handlePickChoice = (choice: ChineseListeningChoice) => {
    if (phase !== 'playing' || !currentQuestion || feedback || answeringRef.current || completedRef.current) {
      return;
    }
    answeringRef.current = true;

    const isCorrect = choice.isTarget;
    if (isCorrect) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
      audioService.playCorrect(nextCombo);
    } else {
      setCombo(0);
      audioService.playNudge();
    }

    setWordOutcomes((prev) => [
      ...prev,
      { word: currentQuestion.targetWord.word, correct: isCorrect },
    ]);
    setFeedback({
      isCorrect,
      pickedWord: choice.word,
    });
  };

  const handleNextQuestion = () => {
    if (phase !== 'playing' || !feedback || advancingRef.current || completedRef.current) return;
    advancingRef.current = true;
    cancelSpeechSafely();

    setFeedback(null);
    setShowHint(false);

    if (questionIdx + 1 < totalCount) {
      setQuestionIdx((idx) => idx + 1);
    } else {
      setPhase('summary');
      audioService.playChest();
    }
  };

  const handleClaimReward = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setClaimed(true);
    cancelSpeechSafely();
    audioService.playToken();

    onComplete({
      tier,
      correctCount,
      totalCount,
      tokensEarned: reward.total,
      wordOutcomes,
    });
  };

  // Keyboard shortcuts (1-4 to pick, Enter/Space to advance, R to replay)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'playing' || !currentQuestion) return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (feedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        speakNormal();
        return;
      }

      const idx = CHOICE_KEYS.indexOf(e.key);
      if (idx !== -1 && currentQuestion.choices[idx]) {
        e.preventDefault();
        handlePickChoice(currentQuestion.choices[idx]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const progressPct =
    phase === 'summary'
      ? 100
      : totalCount > 0
        ? Math.round(((questionIdx + (feedback ? 1 : 0)) / totalCount) * 100)
        : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Top Arcade HUD */}
      <div className="qv-surface rounded-2xl px-4 py-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExit}
              className="qv-btn inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#57534E] hover:bg-[#F3EFE7]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>離開</span>
            </button>

            <span
              className="rounded-full px-2.5 py-1 text-xs font-extrabold"
              style={{ backgroundColor: tierMeta.bgHex, color: tierMeta.colorHex }}
            >
              {tierMeta.shortLabel}
            </span>

            <span className="rounded-full bg-[#F3EFE7] px-2.5 py-1 text-xs font-extrabold text-[#1C1917] tabular-nums">
              {phase === 'summary'
                ? `完成 ${totalCount} / ${totalCount} 題`
                : `第 ${questionIdx + 1} / ${totalCount} 題`}
            </span>
          </div>

          <div className="flex items-center gap-2 tabular-nums">
            {combo >= 2 && phase === 'playing' && (
              <motion.span
                key={combo}
                initial={prefersReduced ? false : { scale: 0.8 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#F97316] px-2.5 py-1 text-xs font-extrabold text-[#C2410C]"
              >
                <Flame className="h-3.5 w-3.5 fill-current text-[#EA580C]" />
                {combo}× 連擊
              </motion.span>
            )}

            <button
              type="button"
              onClick={onToggleZhuyin}
              className={`qv-btn rounded-full border-2 px-2.5 py-1 text-xs font-extrabold transition-colors ${
                showZhuyin
                  ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                  : 'border-[#E7E2D8] bg-white text-[#57534E]'
              }`}
            >
              注音：{showZhuyin ? '開' : '關'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F3EFE7] border border-[#E7E2D8]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#0D9488] to-[#059669] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* PLAYING PHASE */}
        {phase === 'playing' && currentQuestion && (
          <motion.section
            key={currentQuestion.id}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.14 }}
            className="qv-surface rounded-3xl p-5 sm:p-8 space-y-5"
          >
            {/* Central Earphone & Audio Controls */}
            <div className="rounded-3xl bg-gradient-to-b from-[#EFF6FF] to-[#FAF7F2] border-2 border-[#BFDBFE] p-5 sm:p-6 text-center space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#1C1917] bg-[#2563EB] text-white shadow-sm">
                  <Headphones className="h-8 w-8" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917]">
                  👂 聽音辨字特訓
                </h1>
                <p className="text-sm font-bold text-[#44403C]">
                  先聽聲音，選出正確的繁體字詞！
                </p>
              </div>

              {/* Primary + Secondary Speech Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={speakNormal}
                  className="qv-arcade-btn inline-flex items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-6 py-3.5 font-display text-base sm:text-lg font-extrabold text-white"
                  style={{ borderBottomColor: '#1E3A8A' }}
                >
                  <Volume2 className="h-5 w-5" />
                  <span>重聽詞語</span>
                </button>

                <button
                  type="button"
                  onClick={speakSlow}
                  className="qv-btn inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-4 py-3 text-sm font-extrabold text-[#92400E]"
                >
                  <span>🐢 慢速朗讀</span>
                </button>

                <button
                  type="button"
                  onClick={speakContextSentence}
                  className="qv-btn inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#ECFDF5] px-4 py-3 text-sm font-extrabold text-[#065F46]"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>聽例句</span>
                </button>
              </div>

              {/* Optional English Hint Toggle */}
              <div className="pt-1 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className={`qv-btn inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
                    showHint
                      ? 'border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]'
                      : 'border-[#D8D0C1] bg-white text-[#57534E]'
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{showHint ? '收合英文提示' : '英文提示'}</span>
                </button>

                {showHint && (
                  <div className="w-full max-w-md rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2.5 text-sm font-bold text-[#78350F]">
                    <div className="text-[#1D4ED8] font-extrabold">
                      English Meaning: {currentQuestion.targetWord.englishBridge}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4 Blooket-Style Choice Tiles (Zhuyin intentionally hidden before answering) */}
            <div className="space-y-2">
              {!feedback && (
                <div className="flex items-center justify-between px-1 text-xs font-bold text-[#78716C]">
                  <span>點擊正確的繁體字詞（或按鍵盤 1–4）</span>
                  {showZhuyin && <span>作答後會在解析卡顯示完整注音</span>}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQuestion.choices.map((choice, idx) => {
                  const palette = BLOO_COLORS[idx % BLOO_COLORS.length];
                  const isCorrectChoice = Boolean(feedback && choice.isTarget);
                  const isWrongPicked = Boolean(
                    feedback && !feedback.isCorrect && feedback.pickedWord === choice.word,
                  );

                  let bgColor = palette.bg;
                  let borderBottomColor = palette.border;
                  let opacity = 1;

                  if (feedback) {
                    if (isCorrectChoice) {
                      bgColor = '#059669';
                      borderBottomColor = '#065F46';
                    } else if (isWrongPicked) {
                      bgColor = '#E11D48';
                      borderBottomColor = '#9F1239';
                    } else {
                      opacity = 0.42;
                    }
                  }

                  return (
                    <button
                      key={choice.word}
                      type="button"
                      disabled={Boolean(feedback)}
                      onClick={() => handlePickChoice(choice)}
                      className="qv-arcade-btn flex items-center justify-between gap-3 rounded-2xl border-2 border-[#1C1917] px-5 py-4 text-left font-display text-2xl font-extrabold text-white disabled:cursor-default transition-opacity"
                      style={{
                        backgroundColor: bgColor,
                        borderBottomColor,
                        opacity,
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {feedback ? (
                          <RubyWord
                            word={choice.word}
                            zhuyin={choice.zhuyin}
                            showZhuyin={showZhuyin && Boolean(choice.zhuyin)}
                            zhuyinClassName="text-white/90"
                          />
                        ) : (
                          <span>{choice.word}</span>
                        )}
                        {feedback && !choice.zhuyin && !choice.isTarget && (
                          <span className="rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-bold">
                            常見錯字
                          </span>
                        )}
                      </span>

                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold tabular-nums">
                        {CHOICE_KEYS[idx]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post-Answer Teaching & Explanation Card */}
            {feedback && (
              <motion.div
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl border-2 p-5 space-y-4 ${
                  feedback.isCorrect
                    ? 'border-[#059669] bg-[#ECFDF5]'
                    : 'border-[#F59E0B] bg-[#FFFBEB]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {feedback.isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-[#059669] shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-[#E11D48] shrink-0" />
                    )}
                    <span
                      className={`font-display text-lg font-extrabold ${
                        feedback.isCorrect ? 'text-[#065F46]' : 'text-[#92400E]'
                      }`}
                    >
                      {feedback.isCorrect
                        ? '太棒了！聽得超準！'
                        : '差一點點！一起看清楚字形和讀音吧！'}
                    </span>
                  </div>

                  {!feedback.isCorrect && (
                    <span className="rounded-full bg-[#FFF1F2] border border-[#FECDD3] px-3 py-1 text-xs font-extrabold text-[#BE123C]">
                      你選了：{feedback.pickedWord}
                    </span>
                  )}
                </div>

                {/* Correct Word with Full MOE Zhuyin + Bridges */}
                <div className="rounded-2xl bg-white border border-[#E7E2D8] p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="font-display text-3xl font-extrabold text-[#1C1917]">
                        <RubyWord
                          word={currentQuestion.targetWord.word}
                          zhuyin={currentQuestion.targetWord.zhuyin}
                          showZhuyin={true}
                          zhuyinClassName="text-[#2563EB]"
                        />
                      </div>
                      <span className="rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 text-xs sm:text-sm font-extrabold text-[#1D4ED8]">
                        {currentQuestion.targetWord.englishBridge}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={speakNormal}
                      aria-label={`重聽 ${currentQuestion.targetWord.word}`}
                      className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-xs font-extrabold text-[#1D4ED8]"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>再聽一次</span>
                    </button>
                  </div>

                  <p className="text-sm font-bold text-[#44403C]">
                    意思：{currentQuestion.targetWord.plainBridge}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#FAF7F2] px-3.5 py-2.5">
                    <p className="text-sm sm:text-base font-semibold text-[#1C1917] leading-relaxed">
                      例句：「
                      {currentQuestion.targetWord.contextSentence.split('___').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="mx-0.5 rounded-md bg-[#FEF3C7] px-1.5 py-0.5 font-extrabold text-[#92400E]">
                              {currentQuestion.targetWord.word}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                      」
                    </p>
                    <button
                      type="button"
                      onClick={speakContextSentence}
                      className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#E7E2D8] bg-white px-2.5 py-1 text-xs font-extrabold text-[#2563EB] shrink-0"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>朗讀例句</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="qv-arcade-btn inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-6 py-3 font-display text-base font-extrabold text-white"
                    style={{ borderBottomColor: '#000000' }}
                  >
                    <span>{questionIdx + 1 < totalCount ? '下一題' : '開啟成績寶箱'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* SUMMARY / CHEST REWARD PHASE */}
        {phase === 'summary' && (
          <motion.section
            key="listening-summary"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-6"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="qv-float inline-flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-[#1C1917] bg-[#FEF3C7] text-[#D97706]">
                <Trophy className="h-11 w-11" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
                🏆 聽音辨字大成功！
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#57534E]">
                基礎 +{reward.base} · 答對 +{reward.perCorrect}
                {reward.perfectBonus > 0 ? ` · 🌟 完美全對 +${reward.perfectBonus}` : ''}
              </p>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-3 gap-3 tabular-nums">
              <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
                <div className="text-xs font-bold text-[#065F46]">答對題數</div>
                <div className="font-display text-2xl font-extrabold text-[#047857]">
                  {correctCount} / {totalCount}
                </div>
              </div>
              <div className="rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] p-3">
                <div className="text-xs font-bold text-[#9A3412]">最高連擊</div>
                <div className="font-display text-2xl font-extrabold text-[#C2410C]">
                  {maxCombo}×
                </div>
              </div>
              <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3">
                <div className="text-xs font-bold text-[#92400E]">寶箱代幣</div>
                <div className="font-display text-2xl font-extrabold text-[#B45309]">
                  +{reward.total}
                </div>
              </div>
            </div>

            {/* Learned Words List */}
            <div className="text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-extrabold text-[#1C1917]">
                  本次特訓詞語清單（點喇叭可再複習發音）
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {session.questions.map((q, idx) => {
                  const outcome = wordOutcomes[idx];
                  const isCorrect = outcome?.correct ?? false;
                  return (
                    <div
                      key={q.id}
                      className={`flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 ${
                        isCorrect
                          ? 'border-[#A7F3D0] bg-[#ECFDF5]/60'
                          : 'border-[#FECDD3] bg-[#FFF1F2]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669]" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-[#E11D48]" />
                        )}
                        <div className="min-w-0">
                          <div className="font-display text-lg font-extrabold text-[#1C1917]">
                            <RubyWord
                              word={q.targetWord.word}
                              zhuyin={q.targetWord.zhuyin}
                              showZhuyin={showZhuyin}
                              zhuyinClassName="text-[#2563EB]"
                            />
                          </div>
                          <div className="truncate text-xs font-semibold text-[#57534E]">
                            {q.targetWord.englishBridge}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => audioService.speak(q.targetWord.word, 'zh-TW', 0.92)}
                        aria-label={`朗讀 ${q.targetWord.word}`}
                        className="qv-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7E2D8] bg-white text-[#2563EB]"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-1 flex justify-center">
              <button
                type="button"
                disabled={claimed}
                onClick={handleClaimReward}
                className="qv-arcade-btn inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] px-8 py-4 font-display text-lg font-extrabold text-[#1C1917] tabular-nums disabled:opacity-50"
                style={{ borderBottomColor: '#B45309' }}
              >
                <Sparkles className="h-5 w-5" />
                <Coins className="h-5 w-5" />
                <span>{claimed ? '已領取獎勵！' : `領取 +${reward.total} 代幣`}</span>
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

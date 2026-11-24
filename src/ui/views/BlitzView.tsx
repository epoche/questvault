import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Coins,
  Flame,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Timer,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { type ArcadeQuestion, generateArcadeQuestion } from '../../core/arcadeQuestions';
import { audioService } from '../../core/audio';
import { BLITZ_DAILY_TOKEN_CAP } from '../../core/economy';
import type { DifficultyTier, SubjectId } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { MathVisual } from '../artwork/MathVisual';
import { RubyWord } from '../components/RubyWord';
import { BLOOKET_CHOICE_PALETTE as CHOICE_STYLES } from '../theme/choicePalette';

export interface BlitzCompletionPayload {
  subjectId: SubjectId;
  score: number;
  correctCount: number;
  attemptsCount: number;
  bestStreak: number;
  rawTokensEarned: number;
}

interface BlitzViewProps {
  subjectId: SubjectId;
  activeTier: DifficultyTier;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  highScore: number;
  dailyTokensEarnedSoFar: number;
  showZhuyin: boolean;
  onToggleZhuyin: () => void;
  onCompleteBlitz: (payload: BlitzCompletionPayload) => { tokensAwarded: number; remainingDailyCap: number };
  onExit: () => void;
  onGoToMarket: () => void;
}

type BlitzQuestion = ArcadeQuestion;

const BLITZ_DURATION_SEC = 60;

function generateQuestion(subjectId: SubjectId, activeTier: DifficultyTier, seq: number): BlitzQuestion {
  return generateArcadeQuestion(subjectId, activeTier, seq);
}

export const BlitzView: React.FC<BlitzViewProps> = ({
  subjectId,
  activeTier,
  equippedCollectibleId,
  isAvatarShiny = false,
  highScore,
  dailyTokensEarnedSoFar,
  showZhuyin,
  onToggleZhuyin,
  onCompleteBlitz,
  onExit,
  onGoToMarket,
}) => {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'summary'>('ready');
  const [secondsLeft, setSecondsLeft] = useState(BLITZ_DURATION_SEC);
  const [seq, setSeq] = useState(1);
  const [question, setQuestion] = useState<BlitzQuestion>(() =>
    generateQuestion(subjectId, activeTier, 0),
  );
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosen: string } | null>(null);
  const [correctFlash, setCorrectFlash] = useState<string | null>(null);
  const [endedEarly, setEndedEarly] = useState(false);

  const [awardResult, setAwardResult] = useState<{
    tokensAwarded: number;
    remainingDailyCap: number;
    isNewBest: boolean;
  } | null>(null);

  const settledRef = useRef(false);
  const answeringRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const statsRef = useRef({ score: 0, correctCount: 0, attemptsCount: 0, bestStreak: 0 });
  statsRef.current = { score, correctCount, attemptsCount, bestStreak };

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
      audioService.stopSpeech();
    };
  }, []);

  const finalizeRun = useCallback((early = false) => {
    if (settledRef.current) return;
    settledRef.current = true;
    answeringRef.current = false;
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setEndedEarly(early);
    const { score: s, correctCount: c, attemptsCount: a, bestStreak: bs } = statsRef.current;
    const baseTokens = c > 0 ? Math.min(40, Math.floor(c * 2.5 + Math.floor(bs / 3) * 2)) : 0;
    const rawTokens =
      baseTokens === 0 ? 0 : a >= 5 && c / a < 0.5 ? Math.max(1, Math.floor(baseTokens * 0.5)) : baseTokens;

    const result = onCompleteBlitz({
      subjectId,
      score: s,
      correctCount: c,
      attemptsCount: a,
      bestStreak: bs,
      rawTokensEarned: rawTokens,
    });
    setAwardResult({
      tokensAwarded: result.tokensAwarded,
      remainingDailyCap: result.remainingDailyCap,
      isNewBest: s > highScore && s > 0,
    });
    if (result.tokensAwarded > 0) {
      audioService.playChest();
    }
    setPhase('summary');
  }, [highScore, onCompleteBlitz, subjectId]);

  useEffect(() => {
    if (phase !== 'playing' || wrongFeedback) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, wrongFeedback]);

  useEffect(() => {
    if (phase === 'playing' && secondsLeft === 0) {
      finalizeRun(false);
    }
  }, [phase, secondsLeft, finalizeRun]);

  const startSession = () => {
    settledRef.current = false;
    answeringRef.current = false;
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setEndedEarly(false);
    setScore(0);
    setCorrectCount(0);
    setAttemptsCount(0);
    setStreak(0);
    setBestStreak(0);
    setWrongFeedback(null);
    setCorrectFlash(null);
    setAwardResult(null);
    setSecondsLeft(BLITZ_DURATION_SEC);
    const nextSeq = seq + 1;
    setSeq(nextSeq);
    setQuestion(generateQuestion(subjectId, activeTier, nextSeq));
    setPhase('playing');
  };

  const advanceNext = () => {
    if (!answeringRef.current) return;
    answeringRef.current = false;
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    const nextSeq = seq + 1;
    setSeq(nextSeq);
    setQuestion(generateQuestion(subjectId, activeTier, nextSeq));
    setWrongFeedback(null);
    setCorrectFlash(null);
  };

  const handleChoose = (choiceLabel: string) => {
    if (phase !== 'playing' || wrongFeedback || correctFlash || answeringRef.current) return;
    answeringRef.current = true;
    setAttemptsCount((a) => a + 1);

    if (choiceLabel === question.correctAnswer) {
      const nextStreak = streak + 1;
      const pts = 10 + Math.min(nextStreak * 2, 10);
      setScore((s) => s + pts);
      setCorrectCount((c) => c + 1);
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setCorrectFlash(choiceLabel);
      audioService.playCorrect(nextStreak);
      advanceTimerRef.current = window.setTimeout(() => {
        advanceTimerRef.current = null;
        advanceNext();
      }, 280);
    } else {
      setStreak(0);
      setWrongFeedback({ chosen: choiceLabel });
      audioService.playNudge();
    }
  };

  const isChinese = subjectId === 'chinese';
  const remainingCapBefore = Math.max(0, BLITZ_DAILY_TOKEN_CAP - dailyTokensEarnedSoFar);

  const subjectLabel =
    subjectId === 'english' ? 'English' : subjectId === 'math' ? 'Math' : '繁體中文';

  // ═══════════ READY SCREEN ═══════════
  if (phase === 'ready') {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-sm font-bold text-[#57534E]"
          >
            <X className="h-4 w-4" />
            <span>{isChinese ? '返回首頁' : 'Back'}</span>
          </button>

          {isChinese && (
            <button
              type="button"
              onClick={onToggleZhuyin}
              className={`qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-xl border-2 px-3 py-1.5 font-display text-xs font-extrabold ${
                showZhuyin
                  ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                  : 'border-[#E7E2D8] bg-white text-[#57534E]'
              }`}
            >
              注音：{showZhuyin ? '開' : '關'}
            </button>
          )}
        </div>

        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5 border-2 border-[#1C1917]">
          <div className="flex justify-center">
            <CollectibleArt
              id={equippedCollectibleId}
              size={92}
              shiny={isAvatarShiny}
              className="border-2 border-[#1C1917]"
            />
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7C3AED] px-3 py-1 text-xs font-extrabold text-white">
              <Zap className="h-3.5 w-3.5 fill-current" />
              {isChinese ? `60 秒無盡街機・${subjectLabel}` : `60-SECOND ENDLESS BLITZ · ${subjectLabel.toUpperCase()}`}
            </span>
            <h1 className="font-display text-3xl font-extrabold text-[#1C1917]">
              {isChinese ? '限時連擊衝分賽！' : 'Fast Combo Blitz!'}
            </h1>
            <p className="text-sm font-semibold text-[#57534E] max-w-md mx-auto">
              {isChinese
                ? '60 秒內連續答對拿連擊加分！答錯會先鎖定看解析，避免亂猜。'
                : 'Answer as many mixed questions as you can in 60 seconds! Build streaks for bonus points — wrong picks pause briefly to show the answer.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
            <div className="rounded-2xl border border-[#E5DFD3] bg-[#FAF7F2] p-3">
              <div className="text-[11px] font-bold uppercase text-[#78716C]">
                {isChinese ? '個人最高分' : 'Best Score'}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                <Trophy className="h-4 w-4 text-[#D97706]" />
                {highScore}
              </div>
            </div>
            <div className="rounded-2xl border border-[#E5DFD3] bg-[#FAF7F2] p-3">
              <div className="text-[11px] font-bold uppercase text-[#78716C]">
                {isChinese ? '今日 Blitz 獎金上限' : 'Daily Token Cap'}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                <Coins className="h-4 w-4 text-[#D97706]" />
                {dailyTokensEarnedSoFar}/{BLITZ_DAILY_TOKEN_CAP}
              </div>
            </div>
          </div>

          {remainingCapBefore === 0 && (
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#F59E0B] px-4 py-2 text-xs font-bold text-[#92400E]">
              {isChinese
                ? '今天的 Blitz 代幣上限（120）已領滿！還是可以繼續挑戰刷新最高分！'
                : 'Daily Blitz Token cap (120) reached today — you can still play to beat your High Score!'}
            </div>
          )}

          <button
            type="button"
            onClick={startSession}
            className="qv-arcade-btn inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#7C3AED] px-8 py-3 font-display text-lg font-extrabold text-white"
            style={{ borderBottomColor: '#4C1D95' }}
          >
            <Zap className="h-5 w-5 fill-current" />
            <span>{isChinese ? '開始 60 秒衝分！' : 'Start 60s Blitz!'}</span>
          </button>
        </section>
      </div>
    );
  }

  // ═══════════ SUMMARY SCREEN ═══════════
  if (phase === 'summary') {
    const accuracy = attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 0;
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5 border-2 border-[#1C1917]">
          <div className="flex justify-center">
            <CollectibleArt
              id={equippedCollectibleId}
              size={92}
              shiny={isAvatarShiny}
              className="border-2 border-[#1C1917]"
            />
          </div>

          <div className="space-y-1">
            {awardResult?.isNewBest && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-extrabold text-white">
                <Sparkles className="h-3.5 w-3.5" />
                {isChinese ? '新紀錄！NEW HIGH SCORE!' : 'NEW HIGH SCORE!'}
              </span>
            )}
            <h1 className="font-display text-3xl font-extrabold text-[#1C1917]">
              {endedEarly
                ? isChinese
                  ? '街機結算完成！'
                  : 'Blitz Complete!'
                : isChinese
                  ? '時間到！街機結算'
                  : "Time's Up! Blitz Complete"}
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] p-3">
              <div className="text-[11px] font-bold text-[#6D28D9]">{isChinese ? '分數' : 'SCORE'}</div>
              <div className="font-display text-2xl font-extrabold text-[#1C1917] tabular-nums">{score}</div>
            </div>
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
              <div className="text-[11px] font-bold text-[#047857]">{isChinese ? '答對' : 'CORRECT'}</div>
              <div className="font-display text-2xl font-extrabold text-[#1C1917] tabular-nums">
                {correctCount}/{attemptsCount}
              </div>
            </div>
            <div className="rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] p-3">
              <div className="text-[11px] font-bold text-[#C2410C]">{isChinese ? '最高連擊' : 'BEST STREAK'}</div>
              <div className="font-display text-2xl font-extrabold text-[#1C1917] tabular-nums">
                {bestStreak}×
              </div>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3">
              <div className="text-[11px] font-bold text-[#B45309]">{isChinese ? '獲得代幣' : 'TOKENS'}</div>
              <div className="font-display text-2xl font-extrabold text-[#B45309] tabular-nums">
                +{awardResult?.tokensAwarded ?? 0}
              </div>
            </div>
          </div>

          <p className="text-xs font-bold text-[#57534E] tabular-nums">
            {isChinese
              ? `正確率 ${accuracy}% · 今日剩餘 Blitz 獎金額度：${awardResult?.remainingDailyCap ?? 0} / ${BLITZ_DAILY_TOKEN_CAP}`
              : `Accuracy ${accuracy}% · Remaining Daily Blitz Token Cap: ${awardResult?.remainingDailyCap ?? 0} / ${BLITZ_DAILY_TOKEN_CAP}`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={startSession}
              className="qv-arcade-btn inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#7C3AED] px-5 py-2.5 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#4C1D95' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isChinese ? '再玩一局' : 'Play Again'}</span>
            </button>
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-arcade-btn inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
              style={{ borderBottomColor: '#D97706' }}
            >
              <ShoppingBag className="h-4 w-4 text-[#D97706]" />
              <span>{isChinese ? '去抽盲盒' : 'Open Packs'}</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[48px] items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#57534E]"
            >
              <span>{isChinese ? '回首頁' : 'Back Home'}</span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ═══════════ PLAYING SCREEN ═══════════
  const showVisualNow =
    Boolean(question.visual) && (!question.revealVisualOnFeedback || Boolean(wrongFeedback));

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#1C1917] bg-white px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => finalizeRun(true)}
            aria-label="Finish Blitz early"
            className="qv-btn inline-flex h-9 items-center gap-1 rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] px-2.5 text-xs font-bold text-[#57534E]"
          >
            <X className="h-3.5 w-3.5" />
            <span>{isChinese ? '結束' : 'Finish'}</span>
          </button>

          {isChinese && (
            <button
              type="button"
              onClick={onToggleZhuyin}
              className={`qv-btn inline-flex h-9 items-center rounded-xl border px-2.5 text-xs font-extrabold ${
                showZhuyin
                  ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                  : 'border-[#E7E2D8] bg-white text-[#57534E]'
              }`}
            >
              注音：{showZhuyin ? '開' : '關'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 tabular-nums">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-display text-sm font-extrabold ${
              secondsLeft <= 10
                ? 'bg-[#FEE2E2] text-[#B91C1C]'
                : 'bg-[#F3EFE7] text-[#1C1917]'
            }`}
          >
            <Timer className="h-4 w-4" />
            {secondsLeft}s
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] px-3 py-1 font-display text-sm font-extrabold text-[#C2410C]">
            <Flame className="h-4 w-4 fill-current" />
            {streak}×
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F3FF] px-3 py-1 font-display text-sm font-extrabold text-[#6D28D9]">
            <Trophy className="h-4 w-4" />
            {score}
          </span>
        </div>
      </div>

      {/* Question Stage */}
      <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            {question.subHint && (
              <span className="inline-block rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-xs font-bold text-[#57534E]">
                {question.subHint}
              </span>
            )}
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-snug">
              {question.prompt}
            </h2>
          </div>

          {question.speakText && (
            <button
              type="button"
              onClick={() => audioService.speak(question.speakText!, question.speakLang)}
              aria-label="Read question aloud"
              className="qv-btn shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#EFF6FF] text-[#2563EB]"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {showVisualNow && question.visual && (
          <div className="flex justify-center rounded-2xl bg-[#FAF7F2] p-3 border border-[#E5DFD3]">
            <MathVisual spec={question.visual} />
          </div>
        )}

        {/* 2x2 Blooket 4-Color Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {question.choices.map((choice, idx) => {
            const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
            const isCorrectTarget = choice.label === question.correctAnswer;
            const isChosenWrong = wrongFeedback?.chosen === choice.label;
            const isCorrectPicked = correctFlash === choice.label;

            let opacityClass = '';
            if (wrongFeedback) {
              opacityClass = isCorrectTarget
                ? 'ring-4 ring-[#10B981]'
                : isChosenWrong
                  ? 'opacity-65'
                  : 'opacity-40';
            } else if (correctFlash) {
              opacityClass = isCorrectPicked ? 'ring-4 ring-[#10B981] scale-[1.01]' : 'opacity-45';
            }

            return (
              <button
                key={`${question.id}-${choice.label}`}
                type="button"
                disabled={Boolean(wrongFeedback || correctFlash)}
                onClick={() => handleChoose(choice.label)}
                className={`qv-arcade-btn min-h-[64px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 text-left text-white font-display text-lg font-extrabold flex items-center gap-3 transition-all ${opacityClass}`}
                style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/15 text-sm">
                  {st.shape}
                </span>
                <span className="leading-tight">
                  {choice.zhuyin ? (
                    <RubyWord
                      word={choice.label}
                      zhuyin={choice.zhuyin}
                      showZhuyin={showZhuyin}
                      zhuyinClassName="text-white/95"
                    />
                  ) : (
                    choice.label
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wrong-answer anti-mash lock with explanation */}
        {wrongFeedback && (
          <div className="rounded-2xl border-2 border-[#E11D48] bg-[#FFF1F2] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm font-bold text-[#881337]">
              <span className="font-extrabold">
                {isChinese ? `正解：${question.correctAnswer}` : `Answer: ${question.correctAnswer}`}
              </span>
              {' — '}
              {question.explanation}
            </div>
            <button
              type="button"
              onClick={advanceNext}
              className="qv-arcade-btn shrink-0 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-4 py-2 font-display text-sm font-extrabold text-white"
            >
              <span>{isChinese ? '懂了，下一題' : 'Got It, Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

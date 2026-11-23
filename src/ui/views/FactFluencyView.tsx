import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Coins,
  Flame,
  Grid3X3,
  Play,
  RotateCcw,
  ShoppingBag,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import type { FactMasteryEntry } from '../../core/types';
import {
  buildFactFluencyRound,
  calculateFactFluencyRawTokens,
  classifyHeatmapCell,
  FACT_FLUENCY_DAILY_TOKEN_CAP,
  FACT_FLUENCY_ROUND_SIZE,
  getFactHeatmapKey,
  recordFactAttempt,
  type FactFluencyQuestion,
  type FactOperationMode,
} from '../../subjects/math/factFluencyEngine';

export interface FactFluencyCompletionPayload {
  mode: FactOperationMode;
  correctCount: number;
  totalCount: number;
  avgMs: number;
  rawTokensEarned: number;
  updatedMastery: Record<string, FactMasteryEntry>;
}

interface FactFluencyViewProps {
  factMastery?: Record<string, FactMasteryEntry>;
  fluencyTokensToday: number;
  onComplete: (
    payload: FactFluencyCompletionPayload,
  ) => { tokensAwarded: number; remainingDailyCap: number };
  onExit: () => void;
  onGoToMarket: () => void;
}

const CHOICE_STYLES = [
  { bg: '#EF4444', border: '#991B1B', shape: '▲' },
  { bg: '#2563EB', border: '#1E3A8A', shape: '◆' },
  { bg: '#F59E0B', border: '#B45309', shape: '●' },
  { bg: '#059669', border: '#065F46', shape: '■' },
];

const MODE_OPTIONS: { id: FactOperationMode; label: string; badge: string; desc: string }[] = [
  { id: 'multiplication', label: '× Times Tables', badge: '2–12 × 2–12', desc: 'Adaptive weak-spot focus' },
  { id: 'division', label: '÷ Clean Division', badge: 'Inverse Facts', desc: 'Zero remainders' },
  { id: 'addition', label: '+ Mental Add', badge: '2-Digit Carry', desc: 'Make-10 speed drills' },
  { id: 'subtraction', label: '− Mental Sub', badge: 'Regrouping', desc: 'Fast difference checks' },
];

export const FactFluencyView: React.FC<FactFluencyViewProps> = ({
  factMastery,
  fluencyTokensToday,
  onComplete,
  onExit,
  onGoToMarket,
}) => {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'summary'>('setup');
  const [mode, setMode] = useState<FactOperationMode>('multiplication');
  const [showHeatmap, setShowHeatmap] = useState(true);

  const [questions, setQuestions] = useState<FactFluencyQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalMs, setTotalMs] = useState(0);
  const [sessionMastery, setSessionMastery] = useState<Record<string, FactMasteryEntry>>(
    () => ({ ...(factMastery ?? {}) }),
  );
  const [wrongFeedback, setWrongFeedback] = useState<{ chosen: number } | null>(null);
  const [correctFlash, setCorrectFlash] = useState<string | null>(null);
  const [awardResult, setAwardResult] = useState<{
    tokensAwarded: number;
    remainingDailyCap: number;
  } | null>(null);

  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const settledRef = useRef(false);
  const qStartRef = useRef<number>(Date.now());
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

  const heatmapStats = useMemo(() => {
    let mastered = 0;
    let building = 0;
    let focus = 0;
    for (let a = 2; a <= 12; a += 1) {
      for (let b = 2; b <= 12; b += 1) {
        const st = classifyHeatmapCell(sessionMastery[getFactHeatmapKey(a, b)]);
        if (st === 'mastered') mastered += 1;
        else if (st === 'building') building += 1;
        else if (st === 'needs-focus') focus += 1;
      }
    }
    return { mastered, building, focus, total: 121 };
  }, [sessionMastery]);

  const startRound = (targetMode: FactOperationMode = mode) => {
    clearTimer();
    const round = buildFactFluencyRound(targetMode, sessionMastery, FACT_FLUENCY_ROUND_SIZE);
    setMode(targetMode);
    setQuestions(round);
    setQIdx(0);
    setCorrectCount(0);
    setStreak(0);
    setTotalMs(0);
    setWrongFeedback(null);
    setCorrectFlash(null);
    setAwardResult(null);
    answeringRef.current = false;
    advancingRef.current = false;
    settledRef.current = false;
    qStartRef.current = Date.now();
    audioService.playToken();
    setPhase('playing');
  };

  const finishRound = useCallback(
    (finalCorrect: number, finalTotalMs: number, finalMastery: Record<string, FactMasteryEntry>) => {
      if (settledRef.current) return;
      settledRef.current = true;
      clearTimer();
      const rawTokens = calculateFactFluencyRawTokens(finalCorrect, questions.length);
      const avgMs = Math.round(finalTotalMs / Math.max(1, questions.length));
      const res = onComplete({
        mode,
        correctCount: finalCorrect,
        totalCount: questions.length,
        avgMs,
        rawTokensEarned: rawTokens,
        updatedMastery: finalMastery,
      });
      setAwardResult(res);
      if (res.tokensAwarded > 0) audioService.playChest();
      else audioService.playCorrect(3);
      setPhase('summary');
    },
    [clearTimer, mode, onComplete, questions.length],
  );

  const advanceQuestion = useCallback(
    (nextCorrect: number, nextTotalMs: number, nextMastery: Record<string, FactMasteryEntry>) => {
      if (qIdx + 1 >= questions.length) {
        finishRound(nextCorrect, nextTotalMs, nextMastery);
      } else {
        setQIdx((i) => i + 1);
        setWrongFeedback(null);
        setCorrectFlash(null);
        answeringRef.current = false;
        qStartRef.current = Date.now();
      }
    },
    [finishRound, qIdx, questions.length],
  );

  const currentQ = questions[qIdx];

  const handleSelectChoice = (val: number) => {
    if (phase !== 'playing' || !currentQ || answeringRef.current || wrongFeedback || correctFlash) {
      return;
    }
    answeringRef.current = true;
    const elapsed = Math.max(250, Date.now() - qStartRef.current);
    const nextTotalMs = totalMs + elapsed;
    setTotalMs(nextTotalMs);

    const isRight = val === currentQ.correctAnswer;
    const shouldTrackHeatmap = currentQ.mode === 'multiplication' || currentQ.mode === 'division';
    const nextMastery = shouldTrackHeatmap
      ? recordFactAttempt(sessionMastery, currentQ.factKey, isRight, elapsed)
      : sessionMastery;
    setSessionMastery(nextMastery);

    if (isRight) {
      const nextCorrect = correctCount + 1;
      const nextStreak = streak + 1;
      setCorrectCount(nextCorrect);
      setStreak(nextStreak);
      setCorrectFlash(`⚡ ${(elapsed / 1000).toFixed(1)}s · Correct!`);
      audioService.playCorrect(nextStreak);

      timerRef.current = window.setTimeout(() => {
        advanceQuestion(nextCorrect, nextTotalMs, nextMastery);
      }, 450);
    } else {
      setStreak(0);
      setWrongFeedback({ chosen: val });
      audioService.playNudge();
    }
  };

  const handleGotItAfterWrong = () => {
    if (advancingRef.current || !wrongFeedback) return;
    advancingRef.current = true;
    audioService.playToken();
    advanceQuestion(correctCount, totalMs, sessionMastery);
  };

  const remainingCap = Math.max(0, FACT_FLUENCY_DAILY_TOKEN_CAP - fluencyTokensToday);

  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3.5 py-2 text-xs sm:text-sm font-extrabold text-[#57534E]"
          >
            <X className="h-4 w-4" />
            <span>Back</span>
          </button>
          <span className="rounded-full bg-[#ECFDF5] border border-[#6EE7B7] px-3 py-1 text-xs font-extrabold text-[#047857] tabular-nums">
            Daily Dojo Pool: {fluencyTokensToday} / {FACT_FLUENCY_DAILY_TOKEN_CAP} ({remainingCap} left)
          </span>
        </div>

        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-5">
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309]">
              <Zap className="h-3.5 w-3.5" />
              Grade 4 Mental Math Speed & Fluency
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              ⚡ Fact Fluency Dojo 心算閃電道場
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              10 rapid-fire questions! Red & yellow spots on your 12×12 heatmap automatically appear more often until they turn bright green.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MODE_OPTIONS.map((opt) => {
              const active = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMode(opt.id);
                    audioService.playToken();
                  }}
                  className={`qv-btn rounded-2xl border-2 p-3 text-left transition-all ${
                    active
                      ? 'border-[#1C1917] bg-[#ECFDF5] shadow-[0_3px_0_#1C1917]'
                      : 'border-[#E5DFD3] bg-[#FAF8F4]'
                  }`}
                >
                  <p className="font-display text-sm font-extrabold text-[#1C1917]">{opt.label}</p>
                  <p className="text-[11px] font-extrabold text-[#059669]">{opt.badge}</p>
                  <p className="text-[10px] font-semibold text-[#78716C] mt-0.5">{opt.desc}</p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => startRound(mode)}
            className="qv-arcade-btn w-full min-h-[52px] rounded-2xl border-2 border-[#1C1917] bg-[#059669] text-white font-display text-base sm:text-lg font-extrabold inline-flex items-center justify-center gap-2"
            style={{ borderBottomColor: '#065F46' }}
          >
            <Play className="h-5 w-5 fill-current" />
            <span>Start 10-Fact Lightning Round!</span>
          </button>

          {/* 12x12 Multiplication Heatmap */}
          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowHeatmap((v) => !v)}
                className="inline-flex items-center gap-1.5 font-display text-sm font-extrabold text-[#1C1917]"
              >
                <Grid3X3 className="h-4 w-4 text-[#059669]" />
                <span>12×12 Multiplication Mastery Heatmap ({heatmapStats.mastered}/121 Mastered)</span>
              </button>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#57534E]">
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-[#10B981] inline-block" /> Mastered
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-[#FBBF24] inline-block" /> Building
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-[#F87171] inline-block" /> Focus
                </span>
              </div>
            </div>

            {showHeatmap && (
              <div className="overflow-x-auto">
                <div className="inline-grid grid-cols-12 gap-1 min-w-[330px] w-full">
                  <div className="h-6 flex items-center justify-center text-[10px] font-extrabold text-[#78716C]">
                    ×
                  </div>
                  {Array.from({ length: 11 }, (_, i) => i + 2).map((col) => (
                    <div
                      key={`h-${col}`}
                      className="h-6 flex items-center justify-center text-[10px] font-extrabold text-[#57534E] tabular-nums"
                    >
                      {col}
                    </div>
                  ))}
                  {Array.from({ length: 11 }, (_, rIdx) => rIdx + 2).map((row) => (
                    <React.Fragment key={`r-${row}`}>
                      <div className="h-6 flex items-center justify-center text-[10px] font-extrabold text-[#57534E] tabular-nums">
                        {row}
                      </div>
                      {Array.from({ length: 11 }, (_, cIdx) => cIdx + 2).map((col) => {
                        const key = getFactHeatmapKey(row, col);
                        const status = classifyHeatmapCell(sessionMastery[key]);
                        const bg =
                          status === 'mastered'
                            ? 'bg-[#10B981] text-white'
                            : status === 'building'
                              ? 'bg-[#FBBF24] text-[#1C1917]'
                              : status === 'needs-focus'
                                ? 'bg-[#F87171] text-white'
                                : 'bg-white text-[#A8A29E] border border-[#E5DFD3]';
                        return (
                          <div
                            key={key}
                            title={`${row} × ${col} = ${row * col} (${status})`}
                            className={`h-6 rounded flex items-center justify-center text-[9px] font-extrabold tabular-nums ${bg}`}
                          >
                            {row * col}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'summary') {
    const acc = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    const avgSec = (totalMs / Math.max(1, questions.length) / 1000).toFixed(1);
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 shadow-[0_6px_0_#1C1917] text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#10B981] px-3.5 py-1 text-xs font-extrabold text-[#047857]">
            <Trophy className="h-4 w-4" />
            DOJO ROUND COMPLETE!
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
            ⚡ Lightning Math Finished!
          </h1>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
              <p className="text-[11px] font-bold text-[#065F46]">Accuracy</p>
              <p className="font-display text-xl font-extrabold text-[#059669] tabular-nums">{acc}%</p>
            </div>
            <div className="rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] p-3">
              <p className="text-[11px] font-bold text-[#1D4ED8]">Avg Speed</p>
              <p className="font-display text-xl font-extrabold text-[#2563EB] tabular-nums">
                {avgSec}s
              </p>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3">
              <p className="text-[11px] font-bold text-[#92400E]">Tokens</p>
              <p className="font-display text-xl font-extrabold text-[#D97706] tabular-nums inline-flex items-center gap-0.5">
                <Coins className="h-4 w-4" />+{awardResult?.tokensAwarded ?? 0}
              </p>
              <p className="text-[10px] font-bold text-[#B45309]">
                Cap left: {awardResult?.remainingDailyCap ?? 0}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => startRound(mode)}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#059669] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Again</span>
            </button>
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Open Packs</span>
            </button>
            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#1C1917] font-display text-sm font-extrabold"
            >
              View Heatmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            clearTimer();
            answeringRef.current = false;
            advancingRef.current = false;
            setSessionMastery({ ...(factMastery ?? {}) });
            setPhase('setup');
          }}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#57534E]"
        >
          <X className="h-4 w-4" />
          <span>Dojo</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FDBA74] px-3 py-1 text-xs font-extrabold text-[#C2410C] tabular-nums">
            <Flame className="h-3.5 w-3.5" />
            Streak {streak}
          </span>
          <span className="rounded-full bg-[#ECFDF5] border border-[#6EE7B7] px-3 py-1 text-xs font-extrabold text-[#047857] tabular-nums">
            Q {qIdx + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 shadow-[0_6px_0_#1C1917] space-y-5 text-center">
        <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#1C1917] tabular-nums py-2">
          {currentQ.prompt}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {currentQ.choices.map((choice, idx) => {
            const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
            const isRight = choice === currentQ.correctAnswer;
            const isWrongChosen = wrongFeedback?.chosen === choice;
            const dimmed =
              (Boolean(wrongFeedback) && !isRight && !isWrongChosen) ||
              (Boolean(correctFlash) && !isRight);

            return (
              <button
                key={`${currentQ.id}-${choice}`}
                type="button"
                disabled={Boolean(wrongFeedback) || Boolean(correctFlash)}
                onClick={() => handleSelectChoice(choice)}
                className={`qv-btn min-h-[64px] rounded-2xl border-b-4 px-4 py-3 text-white font-display text-2xl font-extrabold tabular-nums flex items-center justify-center gap-2 transition-opacity ${
                  dimmed ? 'opacity-40' : ''
                } ${wrongFeedback && isRight ? 'ring-4 ring-[#10B981] ring-offset-2' : ''}`}
                style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
              >
                <span className="text-sm opacity-80">{st.shape}</span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {correctFlash && (
          <div className="rounded-2xl border-2 border-[#10B981] bg-[#ECFDF5] p-3 font-display text-sm font-extrabold text-[#047857]">
            {correctFlash}
          </div>
        )}

        {wrongFeedback && (
          <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 text-left space-y-3">
            <p className="text-sm font-extrabold text-[#B45309]">
              💡 {currentQ.hint}
            </p>
            <button
              type="button"
              onClick={handleGotItAfterWrong}
              className="qv-btn min-h-[44px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 text-sm font-extrabold text-white inline-flex items-center gap-1.5"
            >
              <span>Got It, Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

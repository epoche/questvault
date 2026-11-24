import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  HeartPulse,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle,
  Zap,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  DAILY_MIXED_WARMUP_BONUS,
  type MixedWarmupOutcomeInput,
} from '../../core/economy';
import {
  buildDailyMixedWarmup,
  buildMistakeClinicSession,
  type MixedWarmupItem,
  type MixedWarmupMode,
  type MixedWarmupSubjectTag,
} from '../../core/mixedWarmupEngine';
import type { PlayerState } from '../../core/types';
import { getLocalDateKey } from '../../subjects/english/runEngine';
import { ClockMeasureSvg } from '../artwork/ClockMeasureSvg';
import { LogicVisual } from '../artwork/LogicVisual';
import { MathVisual } from '../artwork/MathVisual';
import { RubyWord } from '../components/RubyWord';
import { LETTER_CHOICE_PALETTE as CHOICE_COLORS } from '../theme/choicePalette';

interface MixedWarmupViewProps {
  mode: MixedWarmupMode;
  player: PlayerState;
  showZhuyin: boolean;
  onToggleZhuyin: () => void;
  onComplete: (
    mode: MixedWarmupMode,
    outcomes: MixedWarmupOutcomeInput[],
  ) => {
    tokensAwarded: number;
    healedCount: number;
    alreadyClaimedToday: boolean;
    passed: boolean;
  };
  onSwitchMode: (nextMode: MixedWarmupMode) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

const SUBJECT_BADGE: Record<
  MixedWarmupSubjectTag,
  { bg: string; text: string; emoji: string }
> = {
  english: { bg: '#EFF6FF', text: '#1D4ED8', emoji: '📘' },
  math: { bg: '#ECFDF5', text: '#047857', emoji: '📐' },
  chinese: { bg: '#FDF2F8', text: '#BE185D', emoji: '🏮' },
  logic: { bg: '#F5F3FF', text: '#6D28D9', emoji: '🧠' },
};

export const MixedWarmupView: React.FC<MixedWarmupViewProps> = ({
  mode,
  player,
  showZhuyin,
  onToggleZhuyin,
  onComplete,
  onSwitchMode,
  onExit,
  onGoToMarket,
}) => {
  const [roundNonce, setRoundNonce] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [scratchpad, setScratchpad] = useState<Record<string, 'x' | 'check'>>({});
  const [summary, setSummary] = useState<{
    correctCount: number;
    total: number;
    tokensAwarded: number;
    healedCount: number;
    alreadyClaimedToday: boolean;
    passed: boolean;
  } | null>(null);

  const answeringRef = useRef(false);
  const settledRef = useRef(false);
  const outcomesRef = useRef<MixedWarmupOutcomeInput[]>([]);

  useEffect(() => () => audioService.stopSpeech(), []);

  const isClinic = mode === 'mistake-clinic';
  const todayKey = getLocalDateKey();
  const alreadyClaimedWarmupToday = player.dailyMixedWarmupDate === todayKey;

  // Build questions once per mode/roundNonce (frozen for the session so mastery updates don't reshuffle mid-round)
  const items: MixedWarmupItem[] = useMemo(() => {
    const seed = (Date.now() ^ (roundNonce * 2654435761)) >>> 0;
    return isClinic
      ? buildMistakeClinicSession(player, seed, 6)
      : buildDailyMixedWarmup(player, seed, new Date().toISOString(), true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, roundNonce]);

  const handleRestart = () => {
    audioService.stopSpeech();
    answeringRef.current = false;
    settledRef.current = false;
    outcomesRef.current = [];
    setQIndex(0);
    setSelectedChoice(null);
    setCorrectCount(0);
    setScratchpad({});
    setSummary(null);
    setRoundNonce((n) => n + 1);
    audioService.playToken();
  };

  const handleToggleScratchpad = (key: string) => {
    setScratchpad((prev) => {
      const cur = prev[key];
      const next = { ...prev };
      if (!cur) next[key] = 'x';
      else if (cur === 'x') next[key] = 'check';
      else delete next[key];
      return next;
    });
  };

  const handleSpeak = (item: MixedWarmupItem) => {
    if (!item.speakText) return;
    audioService.speak(item.speakText, item.speakLang ?? 'en-US');
  };

  const handleChoose = (choiceIdx: number) => {
    if (answeringRef.current || selectedChoice !== null || settledRef.current) return;
    const current = items[qIndex];
    if (!current) return;

    answeringRef.current = true;
    setSelectedChoice(choiceIdx);

    const isRight = choiceIdx === current.correctIndex;
    outcomesRef.current = [
      ...outcomesRef.current,
      { correct: isRight, masteryRef: current.masteryRef },
    ];

    if (isRight) {
      setCorrectCount((c) => {
        const next = c + 1;
        audioService.playCorrect(next);
        return next;
      });
    } else {
      audioService.playNudge();
    }
  };

  const handleNext = () => {
    if (!answeringRef.current || selectedChoice === null || settledRef.current) return;
    audioService.stopSpeech();
    const nextIdx = qIndex + 1;
    if (nextIdx >= items.length) {
      settledRef.current = true;
      const res = onComplete(mode, outcomesRef.current);
      setSummary({
        correctCount: outcomesRef.current.filter((o) => o.correct).length,
        total: items.length,
        tokensAwarded: res.tokensAwarded,
        healedCount: res.healedCount,
        alreadyClaimedToday: res.alreadyClaimedToday,
        passed: res.passed,
      });
      if (res.passed) {
        audioService.playChest();
      } else {
        audioService.playNudge();
      }
      return;
    }

    answeringRef.current = false;
    setQIndex(nextIdx);
    setSelectedChoice(null);
    setScratchpad({});
  };

  // ── 1. Empty Mistake Clinic Celebration Screen ──
  if (isClinic && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl space-y-5 py-4">
        <button
          type="button"
          onClick={onExit}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回首頁</span>
        </button>

        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 sm:p-8 text-center shadow-[0_6px_0_#1C1917] space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-[#1C1917] bg-[#ECFDF5] text-3xl">
            🩺
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
            錯題診所全綠燈！
          </h1>
          <p className="text-sm font-semibold text-[#57534E] leading-relaxed">
            太棒了！目前沒有需要急救修補的英、數、中常錯詞或心算弱點題。
            <br />
            要不要來一場 5 分鐘四科綜合暖身賽保持手感？
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                answeringRef.current = false;
                settledRef.current = false;
                outcomesRef.current = [];
                setQIndex(0);
                setSelectedChoice(null);
                setCorrectCount(0);
                setSummary(null);
                onSwitchMode('daily-warmup');
              }}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
              style={{ borderBottomColor: '#B45309' }}
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>開始 5 分鐘混合暖身賽</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
            >
              <span>回學習主頁</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Completion Summary Screen ──
  if (summary) {
    const acc = Math.round((summary.correctCount / Math.max(1, summary.total)) * 100);
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 sm:p-8 text-center shadow-[0_6px_0_#1C1917] space-y-5">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-[#1C1917] text-3xl"
            style={{ backgroundColor: isClinic && summary.healedCount > 0 ? '#ECFDF5' : '#FEF3C7' }}
          >
            {isClinic ? (summary.healedCount > 0 ? '💚' : '💪') : summary.passed ? '⚡' : '💪'}
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {isClinic
                ? summary.healedCount > 0
                  ? `錯題急救完成！修補了 ${summary.healedCount} 個弱點`
                  : '這次當作熱身，再挑戰一次就能治癒弱點！'
                : summary.passed
                  ? '每日 5 分鐘混合暖身通關！'
                  : '暖身完成，再試一次拿寶箱！'}
            </h1>
            <p className="text-sm font-bold text-[#57534E] tabular-nums">
              答對 {summary.correctCount} / {summary.total} 題（正確率 {acc}%）
              {summary.healedCount > 0 ? ` · 已更新 ${summary.healedCount} 筆記憶熟練度` : ''}
            </p>
          </div>

          <div className="mx-auto inline-flex items-center gap-2 rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] px-5 py-2.5 font-display text-lg font-extrabold text-[#B45309] tabular-nums">
            <Coins className="h-5 w-5 text-[#D97706]" />
            <span>+{summary.tokensAwarded} Tokens</span>
          </div>

          <p className="text-xs font-semibold text-[#78716C]">
            {isClinic
              ? summary.alreadyClaimedToday
                ? '今日診所獎勵已達 30 Tokens 上限，但記憶熟練度與 SRS 復原依然持續累積！'
                : '每成功修補 1 題弱點即獲得 +3 Tokens（每日上限 30 Tokens），並同步降低錯題紅燈！'
              : summary.alreadyClaimedToday
                ? '今日 +25 Tokens 混合暖身寶箱已經領過囉，明天再來挑戰新題組！'
                : summary.passed
                  ? `已領取每日一次的 +${DAILY_MIXED_WARMUP_BONUS} Tokens 暖身寶箱並延續連勝紀錄！`
                  : '答對 5 / 8 題以上（60%）就能開啟每日一次的 +25 Tokens 暖身寶箱喔！'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-2.5 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#1E3A8A' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isClinic ? '繼續修補更多錯題' : '再來一輪新題組'}</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
            >
              <span>返回首頁</span>
            </button>
            {summary.tokensAwarded > 0 && (
              <button
                type="button"
                onClick={onGoToMarket}
                className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#F59E0B] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#92400E]"
              >
                <Sparkles className="h-4 w-4" />
                <span>去抽盲盒！</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 3. Active Question Runner ──
  const current = items[qIndex];
  if (!current) return null;

  const answered = selectedChoice !== null;
  const isCorrect = answered && selectedChoice === current.correctIndex;
  const hasVisualChoices = current.choices.some((c) => Boolean(c.logicVisual));
  const badge = SUBJECT_BADGE[current.subjectTag];
  const progressPct = Math.round(((qIndex + (answered ? 1 : 0)) / Math.max(1, items.length)) * 100);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回首頁</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-extrabold tabular-nums"
            style={{
              backgroundColor: isClinic ? '#ECFDF5' : '#FFFBEB',
              borderColor: isClinic ? '#10B981' : '#F59E0B',
              color: isClinic ? '#065F46' : '#B45309',
            }}
          >
            {isClinic ? <HeartPulse className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
            <span>
              {isClinic ? '錯題急救診所' : '每日 5 分鐘暖身'} · {qIndex + 1}/{items.length}
            </span>
          </span>
          <span className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-extrabold text-[#047857] tabular-nums">
            ✓ {correctCount}
          </span>
          {current.subjectTag === 'chinese' && (
            <button
              type="button"
              onClick={onToggleZhuyin}
              className={`qv-btn rounded-xl border px-2.5 py-1 text-xs font-extrabold ${
                showZhuyin
                  ? 'border-[#DB2777] bg-[#FDF2F8] text-[#BE185D]'
                  : 'border-[#E5DFD3] bg-white text-[#57534E]'
              }`}
            >
              注音：{showZhuyin ? '開' : '關'}
            </button>
          )}
        </div>
      </div>

      {/* Healing / Warmup Progress Bar */}
      <div className="rounded-2xl border border-[#E5DFD3] bg-white px-4 py-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#57534E] tabular-nums">
          <span>
            {isClinic
              ? `🩺 診所復原進度（已治癒 ${correctCount} / ${items.length}）`
              : alreadyClaimedWarmupToday
                ? '⚡ 跨科混合熱身（今日 +25 寶箱已領，練習模式）'
                : `⚡ 跨科混合熱身（過關解鎖 +${DAILY_MIXED_WARMUP_BONUS} Tokens 寶箱）`}
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1EDE5]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              backgroundColor: isClinic ? '#10B981' : '#F59E0B',
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-extrabold"
              style={{ backgroundColor: badge.bg, color: badge.text }}
            >
              <span>{badge.emoji}</span>
              <span>{current.sourceLabelZh}</span>
            </span>
            {current.speakText && (
              <button
                type="button"
                onClick={() => handleSpeak(current)}
                className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#E5DFD3] bg-[#FAF7F2] px-2.5 py-0.5 text-xs font-extrabold text-[#1C1917]"
              >
                <Volume2 className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>朗讀題目</span>
              </button>
            )}
          </div>

          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] leading-snug max-w-2xl">
            {current.prompt}
          </h2>

          {current.subHint && (
            <p className="text-xs sm:text-sm font-bold text-[#78716C]">{current.subHint}</p>
          )}
        </div>

        {/* Math Visual */}
        {current.mathVisual && (!current.revealMathVisualOnFeedback || answered) && (
          <div className="rounded-2xl border-2 border-[#E7E2D8] bg-[#FAF8F4] p-4 flex justify-center">
            <MathVisual spec={current.mathVisual} />
          </div>
        )}

        {/* Clock & Measure Visual (Phase 10B Mistake Clinic Closed Loop) */}
        {current.clockMeasureVisual && (
          <div
            data-testid="clinic-clock-measure-visual"
            className="rounded-2xl border-2 border-[#E7E2D8] bg-[#FAF8F4] p-4 flex justify-center"
          >
            <ClockMeasureSvg spec={current.clockMeasureVisual} revealed={answered} />
          </div>
        )}

        {/* Logic / Spatial Visual */}
        {((answered && current.logicFeedbackVisual) || current.logicVisual) && (
          <div className="rounded-2xl border-2 border-[#E7E2D8] bg-[#FAF8F4] p-4 flex flex-col items-center justify-center gap-2">
            <LogicVisual
              spec={answered && current.logicFeedbackVisual ? current.logicFeedbackVisual : current.logicVisual!}
              isZh={true}
              scratchpad={scratchpad}
              onToggleScratchpad={handleToggleScratchpad}
            />
          </div>
        )}

        {/* 4 Choices Grid */}
        <div
          className={`grid gap-3 ${
            !hasVisualChoices && current.choices.some((c) => c.label.length > 18)
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-2'
          }`}
        >
          {current.choices.map((choice, idx) => {
            const style = CHOICE_COLORS[idx % CHOICE_COLORS.length];
            const isSelected = selectedChoice === idx;
            const isRightChoice = idx === current.correctIndex;

            if (hasVisualChoices && choice.logicVisual) {
              const stateCls = !answered
                ? 'border-[#1C1917] bg-white hover:bg-[#FAF7F2]'
                : isRightChoice
                  ? 'border-[#059669] bg-[#ECFDF5] ring-2 ring-[#10B981]'
                  : isSelected
                    ? 'border-[#E11D48] bg-[#FFF1F2] ring-2 ring-[#F43F5E]'
                    : 'border-[#E5DFD3] bg-[#FAF8F4] opacity-55';
              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={answered}
                  onClick={() => handleChoose(idx)}
                  aria-label={`Option ${style.badge}`}
                  className={`qv-btn relative flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${stateCls}`}
                >
                  <span
                    className="absolute left-2.5 top-2.5 inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-extrabold text-white"
                    style={{ backgroundColor: style.bg }}
                  >
                    {style.badge}
                  </span>
                  <div className="pt-3">
                    <LogicVisual spec={choice.logicVisual} compact isZh={true} />
                  </div>
                </button>
              );
            }

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
                key={choice.id}
                type="button"
                disabled={answered}
                onClick={() => handleChoose(idx)}
                className={`qv-arcade-btn min-h-[64px] rounded-2xl border-2 border-[#1C1917] px-3.5 py-3 font-display font-extrabold text-white flex items-center justify-center gap-2 transition-all ${
                  choice.label.length > 18 ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'
                }`}
                style={{ backgroundColor: btnBg, borderBottomColor: btnBorder }}
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                  {style.badge}
                </span>
                <span>
                  {choice.zhuyin ? (
                    <RubyWord
                      word={choice.label}
                      zhuyin={choice.zhuyin}
                      showZhuyin={showZhuyin}
                      zhuyinClassName="text-white/90"
                    />
                  ) : (
                    choice.label
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {answered && (
          <div
            className={`rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isCorrect
                ? 'border-[#10B981] bg-[#ECFDF5]'
                : 'border-[#FB7185] bg-[#FFF1F2]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#059669] mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 text-[#E11D48] mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p
                  className={`font-display text-sm font-extrabold ${
                    isCorrect ? 'text-[#065F46]' : 'text-[#9F1239]'
                  }`}
                >
                  {isCorrect
                    ? isClinic
                      ? '💚 成功治癒這題弱點！'
                      : '⚡ 答對了！手感滿分！'
                    : `正解是選項 ${CHOICE_COLORS[current.correctIndex].badge}，記起來喔：`}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#1C1917] leading-snug">
                  {current.explanation}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#000000' }}
            >
              <span>{qIndex + 1 >= items.length ? '看結算寶箱' : '我知道了，下一題'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

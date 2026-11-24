import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Coins,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import { getTodayLogicTokensEarned, LOGIC_DAILY_TOKEN_CAP } from '../../core/economy';
import type { PlayerState } from '../../core/types';
import { getLocalDateKey } from '../../subjects/english/runEngine';
import {
  LOGIC_REASONING_MODULES,
  SPATIAL_MODULES,
  type LogicModuleId,
  type LogicModuleMeta,
  type LogicQuestion,
  type LogicReasoningModuleId,
  type SpatialModuleId,
} from '../../subjects/logic/logicTypes';
import { buildLogicReasoningSession } from '../../subjects/logic/logicReasoningEngine';
import { buildSpatialSession } from '../../subjects/logic/spatialEngine';
import { LogicVisual } from '../artwork/LogicVisual';

interface LogicLabViewProps {
  player: PlayerState;
  onCompleteModule: (
    moduleId: LogicModuleId,
    correctCount: number,
    totalQuestions: number,
  ) => { tokensAwarded: number; remainingDailyCap: number };
  onExit: () => void;
  onGoToMarket: () => void;
}

const CHOICE_COLORS = [
  { bg: '#2563EB', border: '#1E3A8A', badge: 'A' },
  { bg: '#059669', border: '#065F46', badge: 'B' },
  { bg: '#D97706', border: '#92400E', badge: 'C' },
  { bg: '#DB2777', border: '#9D174D', badge: 'D' },
];

export const LogicLabView: React.FC<LogicLabViewProps> = ({
  player,
  onCompleteModule,
  onExit,
  onGoToMarket,
}) => {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [activeModule, setActiveModule] = useState<LogicModuleMeta | null>(null);
  const [questions, setQuestions] = useState<LogicQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [scratchpad, setScratchpad] = useState<Record<string, 'x' | 'check'>>({});
  const [sessionSummary, setSessionSummary] = useState<{
    correctCount: number;
    total: number;
    tokensAwarded: number;
    remainingDailyCap: number;
  } | null>(null);

  const answeringRef = useRef(false);
  const settledRef = useRef(false);
  const correctCountRef = useRef(0);

  const isZh = lang === 'zh';
  const todayKey = getLocalDateKey();
  const todayEarned = getTodayLogicTokensEarned(player, todayKey);
  const remainingToday = Math.max(0, LOGIC_DAILY_TOKEN_CAP - todayEarned);
  const completedIds = useMemo(
    () => new Set(player.completedLogicModuleIds ?? []),
    [player.completedLogicModuleIds],
  );

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

  const startModule = (mod: LogicModuleMeta) => {
    const seed = Date.now() ^ (mod.id.length * 2654435761);
    const qs =
      mod.category === 'spatial'
        ? buildSpatialSession(mod.id as SpatialModuleId, seed, 5)
        : buildLogicReasoningSession(mod.id as LogicReasoningModuleId, seed, 5);
    answeringRef.current = false;
    settledRef.current = false;
    correctCountRef.current = 0;
    setActiveModule(mod);
    setQuestions(qs);
    setQIndex(0);
    setSelectedChoice(null);
    setCorrectCount(0);
    setScratchpad({});
    setSessionSummary(null);
    audioService.playToken();
  };

  const handleChoose = (choiceIdx: number) => {
    if (!activeModule || answeringRef.current || selectedChoice !== null) return;
    const current = questions[qIndex];
    if (!current) return;

    answeringRef.current = true;
    setSelectedChoice(choiceIdx);

    const isRight = choiceIdx === current.correctIndex;
    if (isRight) {
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
      audioService.playCorrect(correctCountRef.current);
    } else {
      audioService.playNudge();
    }
  };

  const handleNext = () => {
    if (!activeModule || !answeringRef.current || selectedChoice === null || settledRef.current) return;
    const nextIdx = qIndex + 1;
    if (nextIdx >= questions.length) {
      settledRef.current = true;
      const result = onCompleteModule(
        activeModule.id,
        correctCountRef.current,
        questions.length,
      );
      setSessionSummary({
        correctCount: correctCountRef.current,
        total: questions.length,
        tokensAwarded: result.tokensAwarded,
        remainingDailyCap: result.remainingDailyCap,
      });
      audioService.playChest();
      return;
    }

    answeringRef.current = false;
    setQIndex(nextIdx);
    setSelectedChoice(null);
    setScratchpad({});
  };

  const handleBackToHub = () => {
    answeringRef.current = false;
    settledRef.current = false;
    setActiveModule(null);
    setQuestions([]);
    setSelectedChoice(null);
    setScratchpad({});
    setSessionSummary(null);
  };

  // ── 1. Summary Screen ──
  if (activeModule && sessionSummary) {
    const accuracyPct = Math.round((sessionSummary.correctCount / Math.max(1, sessionSummary.total)) * 100);
    const passed = accuracyPct >= 60;

    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 sm:p-8 text-center shadow-[0_6px_0_#1C1917] space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-[#1C1917] bg-[#FEF3C7] text-3xl">
            {passed ? '🏆' : '💪'}
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {passed
                ? isZh
                  ? `${activeModule.zhTitle} 過關！`
                  : `${activeModule.enTitle} Clear!`
                : isZh
                  ? '再試一次就成功！'
                  : 'Nice Warm-Up — Try Again!'}
            </h1>
            <p className="text-sm font-bold text-[#57534E]">
              {isZh
                ? `答對 ${sessionSummary.correctCount} / ${sessionSummary.total} 題（正確率 ${accuracyPct}%）`
                : `Scored ${sessionSummary.correctCount} / ${sessionSummary.total} (${accuracyPct}% accuracy)`}
            </p>
          </div>

          <div className="mx-auto inline-flex items-center gap-2 rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] px-5 py-2.5 font-display text-lg font-extrabold text-[#B45309] tabular-nums">
            <Coins className="h-5 w-5 text-[#D97706]" />
            <span>
              +{sessionSummary.tokensAwarded} Tokens
            </span>
          </div>

          <p className="text-xs font-semibold text-[#78716C] tabular-nums">
            {passed
              ? isZh
                ? `今日邏輯與空間館剩餘可領額度：${sessionSummary.remainingDailyCap} / ${LOGIC_DAILY_TOKEN_CAP} Tokens`
                : `Today’s Logic & Spatial cap remaining: ${sessionSummary.remainingDailyCap} / ${LOGIC_DAILY_TOKEN_CAP} Tokens`
              : isZh
                ? '答對 3 題以上（60%）即可領取盲盒代幣與通關徽章喔！'
                : 'Score at least 3/5 (60%) to earn tokens & clear the module!'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => startModule(activeModule)}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-2.5 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#1E3A8A' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isZh ? '再玩一組新題目' : 'Play Fresh Round'}</span>
            </button>
            <button
              type="button"
              onClick={handleBackToHub}
              className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
            >
              <Brain className="h-4 w-4" />
              <span>{isZh ? '回邏輯空間館' : 'Back to Lab'}</span>
            </button>
            {sessionSummary.tokensAwarded > 0 && (
              <button
                type="button"
                onClick={onGoToMarket}
                className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#F59E0B] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#92400E]"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isZh ? '去抽盲盒！' : 'Open Packs!'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Active Question Screen ──
  if (activeModule && questions[qIndex]) {
    const q = questions[qIndex];
    const answered = selectedChoice !== null;
    const isCorrect = answered && selectedChoice === q.correctIndex;
    const hasVisualChoices = q.choices.some((c) => Boolean(c.visual));

    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleBackToHub}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isZh ? '回模組列表' : 'Modules'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#E5DFD3] bg-white px-3 py-1 text-xs font-extrabold text-[#1C1917] tabular-nums">
              {activeModule.emoji} {qIndex + 1} / {questions.length}
            </span>
            <span className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-extrabold text-[#047857] tabular-nums">
              ✓ {correctCount}
            </span>
            <div className="inline-flex rounded-xl border border-[#E5DFD3] bg-white p-0.5">
              <button
                type="button"
                onClick={() => setLang('zh')}
                className={`qv-btn rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                  isZh ? 'bg-[#1C1917] text-white' : 'text-[#57534E]'
                }`}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`qv-btn rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                  !isZh ? 'bg-[#1C1917] text-white' : 'text-[#57534E]'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-4">
          <div className="space-y-1 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-extrabold" style={{ backgroundColor: activeModule.bgHex, color: activeModule.accentHex }}>
              <span>{activeModule.emoji}</span>
              <span>{isZh ? activeModule.zhTitle : activeModule.enTitle}</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] leading-snug">
              {isZh ? q.promptZh : q.promptEn}
            </h2>
          </div>

          {/* Prompt or Feedback Visual */}
          {(answered && q.feedbackVisual) || q.promptVisual ? (
            <div className="rounded-2xl border-2 border-[#E7E2D8] bg-[#FAF8F4] p-4 flex flex-col items-center justify-center gap-2">
              <LogicVisual
                spec={answered && q.feedbackVisual ? q.feedbackVisual : q.promptVisual!}
                isZh={isZh}
                scratchpad={scratchpad}
                onToggleScratchpad={handleToggleScratchpad}
              />
              {answered && q.feedbackVisual && (
                <span className="rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-0.5 text-[11px] font-extrabold text-[#047857]">
                  {isZh ? '✨ 答案圖解（含標註／路徑／推理表）' : '✨ Visual Solution Guide'}
                </span>
              )}
            </div>
          ) : null}

          {/* 4 Choices Grid */}
          <div
            className={`grid gap-3 ${
              !hasVisualChoices &&
              q.choices.some((c) => ((isZh ? c.labelZh : c.labelEn) ?? '').length > 16)
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-2'
            }`}
          >
            {q.choices.map((choice, idx) => {
              const style = CHOICE_COLORS[idx % CHOICE_COLORS.length];
              const isSelected = selectedChoice === idx;
              const isRightChoice = idx === q.correctIndex;

              if (hasVisualChoices && choice.visual) {
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
                      <LogicVisual spec={choice.visual} compact isZh={isZh} />
                    </div>
                  </button>
                );
              }

              // Text/Number Blooket 4-color big button
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

              const labelText = (isZh ? choice.labelZh : choice.labelEn) ?? '';
              const isLongLabel = labelText.length > 18;

              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={answered}
                  onClick={() => handleChoose(idx)}
                  className={`qv-arcade-btn min-h-[64px] rounded-2xl border-2 border-[#1C1917] px-3.5 py-3 font-display font-extrabold text-white flex items-center justify-center gap-2 transition-all text-left sm:text-center ${
                    isLongLabel ? 'text-xs sm:text-sm leading-snug' : 'text-base sm:text-lg'
                  }`}
                  style={{ backgroundColor: btnBg, borderBottomColor: btnBorder }}
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                    {style.badge}
                  </span>
                  <span>{labelText}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Banner + Got It, Next -> */}
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
                      ? isZh
                        ? '太厲害了！邏輯推理完全正確！'
                        : 'Spot on! Brilliant logical thinking!'
                      : isZh
                        ? `答案是選項 ${CHOICE_COLORS[q.correctIndex].badge}，看看圖解原因：`
                        : `The correct answer is Option ${CHOICE_COLORS[q.correctIndex].badge}:`}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#1C1917] leading-snug">
                    {isZh ? q.explanationZh : q.explanationEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
                style={{ borderBottomColor: '#000000' }}
              >
                <span>
                  {qIndex + 1 >= questions.length
                    ? isZh
                      ? '看結算寶箱'
                      : 'Finish Round'
                    : isZh
                      ? '我知道了，下一題'
                      : 'Got It, Next'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 3. Logic & Spatial Lab Hub ──
  const renderModuleCard = (mod: LogicModuleMeta) => {
    const cleared = completedIds.has(mod.id);
    const stat = player.logicStats?.[mod.id];
    const acc =
      stat && stat.totalQuestions > 0
        ? Math.round((stat.totalCorrect / stat.totalQuestions) * 100)
        : null;
    return (
      <button
        key={mod.id}
        type="button"
        onClick={() => startModule(mod)}
        className="qv-surface qv-hover-lift rounded-3xl p-5 text-left flex flex-col justify-between gap-3 border-2 border-[#1C1917]"
        style={{ backgroundColor: mod.bgHex }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-white text-2xl shadow-sm">
              {mod.emoji}
            </span>
            <div>
              <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
                {isZh ? mod.zhTitle : mod.enTitle}
              </h3>
              <p className="text-xs font-bold text-[#57534E]">
                {isZh ? mod.enTitle : mod.zhTitle}
              </p>
            </div>
          </div>
          {cleared && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#10B981] px-2.5 py-0.5 text-[11px] font-extrabold text-[#047857] shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isZh ? '已通關' : 'Cleared'}</span>
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[#44403C] leading-snug">
          {isZh ? mod.zhSubtitle : mod.enSubtitle}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-extrabold text-[#57534E] tabular-nums">
            {acc !== null
              ? isZh
                ? `累計 ${stat!.runs} 回合 · 正確率 ${acc}%`
                : `${stat!.runs} runs · ${acc}% accuracy`
              : isZh
                ? '5 題動態挑戰 · 最高 +30 Tokens'
                : '5 dynamic puzzles · Up to +30 Tokens'}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 font-display text-xs font-extrabold text-white"
            style={{ backgroundColor: mod.accentHex }}
          >
            <span>{isZh ? '開始挑戰' : 'Start'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isZh ? '返回首頁' : 'Home'}</span>
          </button>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917] flex items-center gap-2">
              <span>🧠</span>
              <span>{isZh ? '邏輯與空間思維館' : 'Logic & Spatial Lab'}</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#57534E]">
              {isZh
                ? '8 大動態視覺與邏輯推演引擎，每一題都經過數學求解器與模擬器驗證唯一正解！'
                : '8 dynamic spatial & logic engines — every single puzzle mathematically verified for one unique answer!'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3 py-1.5 text-xs font-extrabold text-[#B45309] tabular-nums">
            <Coins className="h-3.5 w-3.5 text-[#D97706]" />
            <span>
              {isZh
                ? `今日剩餘獎勵 ${remainingToday}/${LOGIC_DAILY_TOKEN_CAP}`
                : `Daily cap: ${remainingToday}/${LOGIC_DAILY_TOKEN_CAP}`}
            </span>
          </span>
          <div className="inline-flex rounded-xl border border-[#E5DFD3] bg-white p-0.5">
            <button
              type="button"
              onClick={() => setLang('zh')}
              className={`qv-btn rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                isZh ? 'bg-[#1C1917] text-white' : 'text-[#57534E]'
              }`}
            >
              中文
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`qv-btn rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                !isZh ? 'bg-[#1C1917] text-white' : 'text-[#57534E]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Spatial Reasoning (4 Modules) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-[#1C1917] flex items-center gap-2">
            <span>📐</span>
            <span>{isZh ? '空間視覺推理（Spatial Reasoning · 4 大動態模組）' : 'Spatial Reasoning Lab · 4 Dynamic Modules'}</span>
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] px-2.5 py-0.5 text-xs font-extrabold text-[#4338CA] tabular-nums">
            <Trophy className="h-3.5 w-3.5" />
            <span>
              {SPATIAL_MODULES.filter((m) => completedIds.has(m.id)).length} / {SPATIAL_MODULES.length}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SPATIAL_MODULES.map(renderModuleCard)}
        </div>
      </section>

      {/* Section 2: Logic, Pattern & Coding (4 Modules) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-[#1C1917] flex items-center gap-2">
            <span>🧩</span>
            <span>{isZh ? '邏輯推演與運算思維（Logic & Coding · 4 大唯一解模組）' : 'Logic, Pattern & Coding Lab · 4 Unique-Solution Modules'}</span>
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 text-xs font-extrabold text-[#047857] tabular-nums">
            <Trophy className="h-3.5 w-3.5" />
            <span>
              {LOGIC_REASONING_MODULES.filter((m) => completedIds.has(m.id)).length} / {LOGIC_REASONING_MODULES.length}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LOGIC_REASONING_MODULES.map(renderModuleCard)}
        </div>
      </section>
    </div>
  );
};

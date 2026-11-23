import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Puzzle,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  applyQuestRewardMultiplier,
  type QuestRewardPolicy,
} from '../../core/economy';
import {
  buildRadicalBuilderQuestions,
  buildRadicalSprintQuestions,
  calculateRadicalRunTokens,
  type RadicalBuilderQuestion,
  type RadicalSprintQuestion,
} from '../../subjects/chinese/radicalEngine';
import type { RadicalFamily, RadicalLayout } from '../../subjects/chinese/radicalTypes';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { RubyWord } from '../components/RubyWord';

export interface RadicalCompletionPayload {
  familyId: string;
  familyTitle: string;
  tier: RadicalFamily['tier'];
  tokensEarned: number;
  rawTokensEarned?: number;
  accuracyPct: number;
  masteredChars: { char: string; firstTryCorrect: boolean }[];
}

interface RadicalQuestViewProps {
  family: RadicalFamily;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  showZhuyin: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onToggleZhuyin: () => void;
  onCompleteRadical: (payload: RadicalCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

const CHOICE_STYLES = [
  { bg: '#EF4444', border: '#991B1B', shape: '▲' },
  { bg: '#2563EB', border: '#1E3A8A', shape: '◆' },
  { bg: '#F59E0B', border: '#B45309', shape: '●' },
  { bg: '#059669', border: '#065F46', shape: '■' },
];

function layoutLabel(layout: RadicalLayout): string {
  if (layout === 'left-right' || layout === 'right-left') return '左右結構';
  if (layout === 'top-bottom' || layout === 'bottom-top') return '上下結構';
  return '包圍結構';
}

export const RadicalQuestView: React.FC<RadicalQuestViewProps> = ({
  family,
  equippedCollectibleId,
  isAvatarShiny = false,
  showZhuyin,
  rewardPolicy,
  onToggleZhuyin,
  onCompleteRadical,
  onExit,
  onGoToMarket,
}) => {
  const [lockedPolicy, setLockedPolicy] = useState<QuestRewardPolicy | undefined>(
    () => rewardPolicy,
  );
  const policyMult = lockedPolicy?.multiplier ?? 1;
  const [stage, setStage] = useState<'learn' | 'build' | 'sprint' | 'summary'>('learn');
  const [learnIdx, setLearnIdx] = useState(0);

  // Stage 1: Radical Block Builder queue
  const [buildQueue, setBuildQueue] = useState<RadicalBuilderQuestion[]>(() =>
    buildRadicalBuilderQuestions(family),
  );
  const [buildCorrectBanner, setBuildCorrectBanner] = useState<string | null>(null);
  const [buildWrong, setBuildWrong] = useState<{ chosenId: string } | null>(null);
  const [buildMissedIds, setBuildMissedIds] = useState<Record<string, boolean>>({});
  const [buildFirstTryRight, setBuildFirstTryRight] = useState(0);

  // Stage 2: Same-Family Sprint queue
  const [sprintQueue, setSprintQueue] = useState<RadicalSprintQuestion[]>(() =>
    buildRadicalSprintQuestions(family),
  );
  const [sprintCorrectBanner, setSprintCorrectBanner] = useState<string | null>(null);
  const [sprintWrong, setSprintWrong] = useState<{ chosenChar: string } | null>(null);
  const [sprintMissedChars, setSprintMissedChars] = useState<Record<string, boolean>>({});
  const [sprintFirstTryRight, setSprintFirstTryRight] = useState(0);

  const [finalTokens, setFinalTokens] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);

  // Synchronous re-entry locks (AGENTS.md Iron Rule #3)
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const completedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const clearPendingTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearPendingTimer();
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // Ignore sandbox speech errors
      }
    };
  }, [clearPendingTimer]);

  const currentLearnItem = family.items[learnIdx] ?? family.items[0];
  const currentBuildQ = buildQueue[0] ?? null;
  const currentSprintQ = sprintQueue[0] ?? null;

  const totalUniqueQs = family.items.length * 2;
  const buildDoneCount = useMemo(
    () => Math.max(0, family.items.length - buildQueue.length),
    [family.items.length, buildQueue.length],
  );
  const sprintDoneCount = useMemo(
    () => Math.max(0, family.items.length - sprintQueue.length),
    [family.items.length, sprintQueue.length],
  );

  const finishRun = useCallback(
    (finalBuildFirstTry: number, finalSprintFirstTry: number, missedMap: Record<string, boolean>) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const totalFirstTry = finalBuildFirstTry + finalSprintFirstTry;
      const rawTokens = calculateRadicalRunTokens(totalUniqueQs, totalFirstTry);
      const awardedTokens = applyQuestRewardMultiplier(rawTokens, policyMult);
      const accuracyPct = Math.round((totalFirstTry / Math.max(1, totalUniqueQs)) * 100);
      setFinalTokens(awardedTokens);
      setFinalAccuracy(accuracyPct);
      audioService.playChest();
      onCompleteRadical({
        familyId: family.id,
        familyTitle: family.title,
        tier: family.tier,
        tokensEarned: awardedTokens,
        rawTokensEarned: rawTokens,
        accuracyPct,
        masteredChars: family.items.map((it) => ({
          char: it.char,
          firstTryCorrect: !missedMap[it.char],
        })),
      });
      setStage('summary');
    },
    [family.id, family.items, family.tier, family.title, onCompleteRadical, policyMult, totalUniqueQs],
  );

  const advanceBuildAfterWrong = useCallback(() => {
    if (advancingRef.current || !currentBuildQ) return;
    advancingRef.current = true;
    clearPendingTimer();
    setBuildWrong(null);
    setBuildCorrectBanner(null);
    // Mastery Queue: push missed item to the back so learner masters it before advancing
    setBuildQueue((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [clearPendingTimer, currentBuildQ]);

  const handlePickBuildChoice = useCallback(
    (choiceId: string) => {
      if (stage !== 'build' || !currentBuildQ || answeringRef.current || buildWrong) return;
      answeringRef.current = true;
      const picked = currentBuildQ.choices.find((c) => c.id === choiceId);
      if (!picked) {
        answeringRef.current = false;
        return;
      }

      if (picked.isCorrect) {
        audioService.playCorrect(2);
        const alreadyMissed = Boolean(buildMissedIds[currentBuildQ.item.char]);
        if (!alreadyMissed) {
          setBuildFirstTryRight((n) => n + 1);
        }
        setBuildCorrectBanner(
          `✨ 拼字成功！${currentBuildQ.item.radical} ＋ ${currentBuildQ.item.component} ＝ ${currentBuildQ.item.char}（${currentBuildQ.item.sampleWord}）`,
        );
        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;
          setBuildCorrectBanner(null);
          setBuildQueue((prev) => {
            const next = prev.slice(1);
            if (next.length === 0) {
              setStage('sprint');
            }
            return next;
          });
          answeringRef.current = false;
        }, 720);
      } else {
        audioService.playNudge();
        setBuildMissedIds((prev) => ({ ...prev, [currentBuildQ.item.char]: true }));
        setBuildWrong({ chosenId: choiceId });
      }
    },
    [buildMissedIds, buildWrong, currentBuildQ, stage],
  );

  const advanceSprintAfterWrong = useCallback(() => {
    if (advancingRef.current || !currentSprintQ) return;
    advancingRef.current = true;
    clearPendingTimer();
    setSprintWrong(null);
    setSprintCorrectBanner(null);
    setSprintQueue((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [clearPendingTimer, currentSprintQ]);

  const handlePickSprintChoice = useCallback(
    (char: string) => {
      if (stage !== 'sprint' || !currentSprintQ || answeringRef.current || sprintWrong) return;
      answeringRef.current = true;
      const picked = currentSprintQ.choices.find((c) => c.char === char);
      if (!picked) {
        answeringRef.current = false;
        return;
      }

      if (picked.isCorrect) {
        audioService.playCorrect(3);
        const alreadyMissed = Boolean(sprintMissedChars[currentSprintQ.item.char]);
        const nextSprintFirstTry = alreadyMissed ? sprintFirstTryRight : sprintFirstTryRight + 1;
        if (!alreadyMissed) {
          setSprintFirstTryRight(nextSprintFirstTry);
        }
        setSprintCorrectBanner(
          `✅ 答對了！${currentSprintQ.item.char}（${currentSprintQ.item.radical}＋${currentSprintQ.item.component}）· ${currentSprintQ.item.sampleWord}`,
        );

        const isLast = sprintQueue.length <= 1;
        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;
          setSprintCorrectBanner(null);
          if (isLast) {
            setSprintQueue([]);
            const combinedMissed: Record<string, boolean> = {
              ...buildMissedIds,
              ...sprintMissedChars,
            };
            finishRun(buildFirstTryRight, nextSprintFirstTry, combinedMissed);
          } else {
            setSprintQueue((prev) => prev.slice(1));
            answeringRef.current = false;
          }
        }, 720);
      } else {
        audioService.playNudge();
        setSprintMissedChars((prev) => ({ ...prev, [currentSprintQ.item.char]: true }));
        setSprintWrong({ chosenChar: char });
      }
    },
    [
      buildFirstTryRight,
      buildMissedIds,
      currentSprintQ,
      finishRun,
      sprintFirstTryRight,
      sprintMissedChars,
      sprintQueue.length,
      sprintWrong,
      stage,
    ],
  );

  const handleRestart = () => {
    clearPendingTimer();
    completedRef.current = false;
    answeringRef.current = false;
    advancingRef.current = false;
    setLockedPolicy(rewardPolicy);
    setLearnIdx(0);
    setBuildQueue(buildRadicalBuilderQuestions(family));
    setBuildCorrectBanner(null);
    setBuildWrong(null);
    setBuildMissedIds({});
    setBuildFirstTryRight(0);
    setSprintQueue(buildRadicalSprintQuestions(family));
    setSprintCorrectBanner(null);
    setSprintWrong(null);
    setSprintMissedChars({});
    setSprintFirstTryRight(0);
    setStage('learn');
  };

  // Keyboard shortcuts for Stage 1 & Stage 2
  useEffect(() => {
    if (stage !== 'build' && stage !== 'sprint') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (stage === 'build') {
        if (buildWrong) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            advanceBuildAfterWrong();
          }
          return;
        }
        const idx = ['1', '2', '3', '4'].indexOf(e.key);
        if (idx >= 0 && currentBuildQ?.choices[idx]) {
          e.preventDefault();
          handlePickBuildChoice(currentBuildQ.choices[idx].id);
        }
      } else if (stage === 'sprint') {
        if (sprintWrong) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            advanceSprintAfterWrong();
          }
          return;
        }
        const idx = ['1', '2', '3', '4'].indexOf(e.key);
        if (idx >= 0 && currentSprintQ?.choices[idx]) {
          e.preventDefault();
          handlePickSprintChoice(currentSprintQ.choices[idx].char);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    advanceBuildAfterWrong,
    advanceSprintAfterWrong,
    buildWrong,
    currentBuildQ,
    currentSprintQ,
    handlePickBuildChoice,
    handlePickSprintChoice,
    sprintWrong,
    stage,
  ]);

  const stageLabel =
    stage === 'learn'
      ? `步驟 1/3：部件拆解 (${learnIdx + 1}/${family.items.length})`
      : stage === 'build'
        ? `步驟 2/3：拼字積木 (${buildDoneCount}/${family.items.length})`
        : stage === 'sprint'
          ? `步驟 3/3：同家族辨字 (${sprintDoneCount}/${family.items.length})`
          : '通關寶箱！';

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Top Bar */}
      <div className="qv-surface rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white px-3 py-1.5 text-xs font-extrabold text-[#57534E]"
          >
            <X className="h-3.5 w-3.5" />
            <span>離開</span>
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] px-2.5 py-1 text-xs font-extrabold text-[#BE185D]">
            <Puzzle className="h-3.5 w-3.5" />
            <span>{family.title}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-1 text-xs font-extrabold text-[#57534E] tabular-nums">
            {stageLabel}
          </span>
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
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang="zh" />

      {/* ═══════════ STAGE 0: VISUAL RADICAL DECOMPOSITION ═══════════ */}
      {stage === 'learn' && currentLearnItem && (
        <section className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CollectibleArt
                id={family.emblemCollectibleId}
                size={44}
                className="border-2 border-[#1C1917]"
              />
              <div>
                <div className="text-xs font-extrabold text-[#BE185D]">
                  {family.kind === 'phonetic' ? '同聲旁拆字魔法' : '同部首家族祕密'} ·{' '}
                  {layoutLabel(currentLearnItem.layout)}
                </div>
                <h2 className="font-display text-base sm:text-lg font-extrabold text-[#1C1917]">
                  {family.subtitle}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                audioService.speak(
                  `${currentLearnItem.char}，${currentLearnItem.sampleWord}`,
                  'zh-TW',
                )
              }
              aria-label="朗讀這個字與例詞"
              className="qv-btn inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#1C1917] bg-[#EFF6FF] text-[#2563EB]"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>

          {/* Color-coded Radical Equation */}
          <div className="rounded-3xl border-2 border-[#E7E2D8] bg-[#FAF7F2] p-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-center">
            {currentLearnItem.layout === 'right-left' || currentLearnItem.layout === 'bottom-top' ? (
              <>
                <div className="rounded-2xl border-2 border-[#D97706] bg-[#FFFBEB] px-4 py-3 min-w-[92px]">
                  <div className="text-[11px] font-extrabold text-[#B45309]">部件／聲旁</div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#92400E] mt-0.5">
                    {currentLearnItem.component}
                  </div>
                </div>
                <span className="font-display text-2xl font-extrabold text-[#78716C]">＋</span>
                <div className="rounded-2xl border-2 border-[#2563EB] bg-[#EFF6FF] px-4 py-3 min-w-[108px]">
                  <div className="text-[11px] font-extrabold text-[#1D4ED8]">
                    部首 · {currentLearnItem.radicalName}
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E40AF] mt-0.5">
                    {currentLearnItem.radical}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border-2 border-[#2563EB] bg-[#EFF6FF] px-4 py-3 min-w-[108px]">
                  <div className="text-[11px] font-extrabold text-[#1D4ED8]">
                    部首 · {currentLearnItem.radicalName}
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E40AF] mt-0.5">
                    {currentLearnItem.radical}
                  </div>
                </div>
                <span className="font-display text-2xl font-extrabold text-[#78716C]">＋</span>
                <div className="rounded-2xl border-2 border-[#D97706] bg-[#FFFBEB] px-4 py-3 min-w-[92px]">
                  <div className="text-[11px] font-extrabold text-[#B45309]">部件／聲旁</div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#92400E] mt-0.5">
                    {currentLearnItem.component}
                  </div>
                </div>
              </>
            )}

            <span className="font-display text-2xl font-extrabold text-[#78716C]">＝</span>

            <div className="rounded-2xl border-2 border-[#1C1917] bg-white px-5 py-3 min-w-[104px] shadow-xs">
              <RubyWord
                word={currentLearnItem.char}
                zhuyin={currentLearnItem.zhuyin}
                showZhuyin={showZhuyin}
                className="font-display text-4xl sm:text-5xl font-extrabold text-[#1C1917]"
                zhuyinClassName="text-[#BE185D]"
              />
            </div>
          </div>

          {/* Meaning & Memory Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#DBEAFE] bg-[#F0F9FF] p-3.5 space-y-1">
              <div className="text-xs font-extrabold text-[#0369A1]">
                部首線索：{currentLearnItem.radical}（{currentLearnItem.radicalName}）
              </div>
              <p className="text-sm font-bold text-[#1C1917]">{currentLearnItem.radicalMeaning}</p>
            </div>
            <div className="rounded-2xl border border-[#FCE7F3] bg-[#FDF2F8] p-3.5 space-y-1">
              <div className="text-xs font-extrabold text-[#BE185D]">常見例詞 · English</div>
              <div className="flex flex-wrap items-center gap-2">
                <RubyWord
                  word={currentLearnItem.sampleWord}
                  zhuyin={currentLearnItem.sampleWordZhuyin}
                  showZhuyin={showZhuyin}
                  className="font-display text-lg font-extrabold text-[#1C1917]"
                  zhuyinClassName="text-[#92400E]"
                />
                <span className="text-xs font-bold text-[#57534E]">
                  ({currentLearnItem.englishMeaning})
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm font-bold text-[#92400E]">
            💡 記憶小口訣：{currentLearnItem.memoryTip}
          </div>

          {/* Card Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center justify-center gap-1.5 order-1 sm:order-2">
              {family.items.map((it, idx) => (
                <button
                  key={it.char}
                  type="button"
                  onClick={() => setLearnIdx(idx)}
                  className={`h-8 w-8 rounded-full font-display text-xs font-extrabold border transition-colors ${
                    idx === learnIdx
                      ? 'border-[#1C1917] bg-[#DB2777] text-white'
                      : 'border-[#E5DFD3] bg-white text-[#57534E]'
                  }`}
                >
                  {it.char}
                </button>
              ))}
            </div>

            <div className="flex w-full sm:w-auto items-center justify-between gap-2 order-2 sm:order-1 sm:contents">
              <button
                type="button"
                disabled={learnIdx === 0}
                onClick={() => setLearnIdx((i) => Math.max(0, i - 1))}
                className={`qv-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 px-4 py-2 font-display text-sm font-extrabold sm:order-1 ${
                  learnIdx === 0
                    ? 'border-[#E5DFD3] bg-[#F3EFE7] text-[#A8A29E] cursor-not-allowed'
                    : 'border-[#1C1917] bg-white text-[#1C1917]'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>上一字</span>
              </button>

              {learnIdx < family.items.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setLearnIdx((i) => Math.min(family.items.length - 1, i + 1))}
                  className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-2 font-display text-sm font-extrabold text-white sm:order-3"
                  style={{ borderBottomColor: '#1E3A8A' }}
                >
                  <span>下一字</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    answeringRef.current = false;
                    setStage('build');
                  }}
                  className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#DB2777] px-5 py-2 font-display text-sm font-extrabold text-white sm:order-3"
                  style={{ borderBottomColor: '#9D174D' }}
                >
                  <Puzzle className="h-4 w-4" />
                  <span>開始拼字積木！</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ STAGE 1: RADICAL BLOCK BUILDER ═══════════ */}
      {stage === 'build' && currentBuildQ && (
        <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
          {buildCorrectBanner && (
            <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-2.5 text-center font-display text-sm sm:text-base font-extrabold text-[#047857]">
              {buildCorrectBanner}
            </div>
          )}

          {/* Blueprint Assembly Box */}
          <div className="rounded-3xl border-2 border-[#E7E2D8] bg-[#FAF7F2] p-5 text-center space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {currentBuildQ.item.layout === 'right-left' ||
              currentBuildQ.item.layout === 'bottom-top' ? (
                <>
                  <div className="rounded-2xl border-2 border-[#D97706] bg-[#FFFBEB] px-4 py-2.5 min-w-[78px]">
                    <div className="text-[10px] font-extrabold text-[#B45309]">部件</div>
                    <div className="font-display text-3xl font-extrabold text-[#92400E]">
                      {currentBuildQ.item.component}
                    </div>
                  </div>
                  <span className="font-display text-xl font-extrabold text-[#78716C]">＋</span>
                  <div className="rounded-2xl border-2 border-dashed border-[#2563EB] bg-[#EFF6FF] px-4 py-2.5 min-w-[78px]">
                    <div className="text-[10px] font-extrabold text-[#1D4ED8]">部首？</div>
                    <div className="font-display text-3xl font-extrabold text-[#2563EB]">
                      {buildWrong || buildCorrectBanner ? currentBuildQ.item.radical : '？'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border-2 border-dashed border-[#2563EB] bg-[#EFF6FF] px-4 py-2.5 min-w-[78px]">
                    <div className="text-[10px] font-extrabold text-[#1D4ED8]">部首？</div>
                    <div className="font-display text-3xl font-extrabold text-[#2563EB]">
                      {buildWrong || buildCorrectBanner ? currentBuildQ.item.radical : '？'}
                    </div>
                  </div>
                  <span className="font-display text-xl font-extrabold text-[#78716C]">＋</span>
                  <div className="rounded-2xl border-2 border-[#D97706] bg-[#FFFBEB] px-4 py-2.5 min-w-[78px]">
                    <div className="text-[10px] font-extrabold text-[#B45309]">部件</div>
                    <div className="font-display text-3xl font-extrabold text-[#92400E]">
                      {currentBuildQ.item.component}
                    </div>
                  </div>
                </>
              )}

              <span className="font-display text-xl font-extrabold text-[#78716C]">＝</span>
              <div className="rounded-2xl border-2 border-[#1C1917] bg-white px-4 py-2.5 min-w-[74px]">
                <div className="text-[10px] font-extrabold text-[#57534E]">
                  {currentBuildQ.maskedSampleWord}
                </div>
                <div className="font-display text-3xl font-extrabold text-[#1C1917]">
                  {buildWrong || buildCorrectBanner ? currentBuildQ.item.char : '□'}
                </div>
              </div>
            </div>

            <p className="font-display text-base sm:text-lg font-extrabold text-[#1C1917]">
              {currentBuildQ.promptZh}
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#57534E]">
              提示：{currentBuildQ.item.englishMeaning}
            </p>
          </div>

          {/* 4 Blooket-Style Radical Choices */}
          <div className="grid grid-cols-2 gap-3">
            {currentBuildQ.choices.map((ch, idx) => {
              const style = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isWrongPicked = buildWrong?.chosenId === ch.id;
              const dimmed = Boolean(buildWrong) && !ch.isCorrect && !isWrongPicked;

              return (
                <button
                  key={ch.id}
                  type="button"
                  disabled={Boolean(buildWrong) || Boolean(buildCorrectBanner)}
                  onClick={() => handlePickBuildChoice(ch.id)}
                  className={`qv-arcade-btn min-h-[68px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 text-white flex items-center justify-between gap-2 transition-opacity ${
                    dimmed ? 'opacity-40' : 'opacity-100'
                  } ${
                    buildWrong && ch.isCorrect ? 'ring-4 ring-[#10B981]' : ''
                  } ${isWrongPicked ? 'ring-4 ring-[#1C1917]' : ''}`}
                  style={{ backgroundColor: style.bg, borderBottomColor: style.border }}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                      {style.shape}
                    </span>
                    <span className="text-left">
                      <span className="block font-display text-2xl font-extrabold leading-none">
                        {ch.radical}
                      </span>
                      <span className="block text-[11px] font-bold opacity-95 mt-0.5">
                        {ch.radicalName}
                      </span>
                    </span>
                  </span>
                  <span className="hidden sm:inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/20 text-[11px] font-extrabold">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {buildWrong && (
            <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 text-left">
                <div className="text-xs font-extrabold text-[#B45309]">
                  再記一次！（稍後會再練習這題）
                </div>
                <p className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                  {currentBuildQ.item.radical}（{currentBuildQ.item.radicalName}）＋{' '}
                  {currentBuildQ.item.component} ＝ {currentBuildQ.item.char}（
                  {currentBuildQ.item.sampleWord}）
                </p>
                <p className="text-xs font-semibold text-[#57534E]">
                  {currentBuildQ.item.memoryTip}
                </p>
              </div>
              <button
                type="button"
                onClick={advanceBuildAfterWrong}
                className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              >
                <span>記住了，下一題</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* ═══════════ STAGE 2: SAME-FAMILY CONTEXT SPRINT ═══════════ */}
      {stage === 'sprint' && currentSprintQ && (
        <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
          {sprintCorrectBanner && (
            <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-2.5 text-center font-display text-sm sm:text-base font-extrabold text-[#047857]">
              {sprintCorrectBanner}
            </div>
          )}

          <div className="rounded-3xl border-2 border-[#E7E2D8] bg-[#FAF7F2] p-5 space-y-3 text-center">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 text-xs font-extrabold text-[#92400E]">
                同家族語境辨字
              </span>
              <button
                type="button"
                onClick={() => audioService.speak(currentSprintQ.speakText, 'zh-TW')}
                aria-label="朗讀題目"
                className="qv-btn inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DFD3] bg-white text-[#2563EB]"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>

            <p className="font-display text-lg sm:text-2xl font-extrabold text-[#1C1917] leading-relaxed">
              {currentSprintQ.prompt}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#57534E]">
              {currentSprintQ.hintEn}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentSprintQ.choices.map((ch, idx) => {
              const style = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isWrongPicked = sprintWrong?.chosenChar === ch.char;
              const dimmed = Boolean(sprintWrong) && !ch.isCorrect && !isWrongPicked;

              return (
                <button
                  key={ch.char}
                  type="button"
                  disabled={Boolean(sprintWrong) || Boolean(sprintCorrectBanner)}
                  onClick={() => handlePickSprintChoice(ch.char)}
                  className={`qv-arcade-btn min-h-[72px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 text-white flex items-center justify-between gap-2 transition-opacity ${
                    dimmed ? 'opacity-40' : 'opacity-100'
                  } ${
                    sprintWrong && ch.isCorrect ? 'ring-4 ring-[#10B981]' : ''
                  } ${isWrongPicked ? 'ring-4 ring-[#1C1917]' : ''}`}
                  style={{ backgroundColor: style.bg, borderBottomColor: style.border }}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                      {style.shape}
                    </span>
                    <RubyWord
                      word={ch.char}
                      zhuyin={ch.zhuyin}
                      showZhuyin={showZhuyin}
                      className="font-display text-2xl sm:text-3xl font-extrabold text-white"
                      zhuyinClassName="text-white/95"
                    />
                  </span>
                  <span className="hidden sm:inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/20 text-[11px] font-extrabold">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {sprintWrong && (
            <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 text-left">
                <div className="text-xs font-extrabold text-[#B45309]">
                  小提醒：用部首分辨這兩個字！
                </div>
                <p className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                  正確答案是「{currentSprintQ.item.char}」（{currentSprintQ.item.radical}
                  {currentSprintQ.item.radicalName} ＋ {currentSprintQ.item.component}）·{' '}
                  {currentSprintQ.item.sampleWord}
                </p>
                <p className="text-xs font-semibold text-[#57534E]">
                  {currentSprintQ.item.memoryTip}
                </p>
              </div>
              <button
                type="button"
                onClick={advanceSprintAfterWrong}
                className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              >
                <span>記住了，下一題</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* ═══════════ STAGE 3: SUMMARY CHEST ═══════════ */}
      {stage === 'summary' && (
        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <CollectibleArt
                id={equippedCollectibleId}
                size={64}
                shiny={isAvatarShiny}
                className="border-2 border-[#1C1917]"
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7]">
                <Trophy className="h-8 w-8 text-[#D97706]" />
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              🎉 {family.title} 解鎖完成！
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              你一次掌握了這 5 個同家族漢字的部首與部件祕密！
            </p>
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
              <div className="text-xs font-bold text-[#92400E]">獲得代幣</div>
              <div className="mt-0.5 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#1C1917] tabular-nums">
                <Coins className="h-5 w-5 text-[#D97706]" />+{finalTokens}
              </div>
            </div>
            <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-3.5">
              <div className="text-xs font-bold text-[#047857]">一次答對率</div>
              <div className="mt-0.5 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#047857] tabular-nums">
                <CheckCircle2 className="h-5 w-5" />
                {finalAccuracy}%
              </div>
            </div>
          </div>

          {/* Mini 5-Character Trophy Gallery */}
          <div className="grid grid-cols-5 gap-2">
            {family.items.map((it) => (
              <div
                key={it.char}
                className="rounded-2xl border border-[#E5DFD3] bg-[#FAF7F2] px-1.5 py-2.5 flex flex-col items-center gap-0.5"
              >
                <RubyWord
                  word={it.char}
                  zhuyin={it.zhuyin}
                  showZhuyin={showZhuyin}
                  className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917]"
                  zhuyinClassName="text-[#BE185D]"
                />
                <span className="text-[10px] font-extrabold text-[#2563EB]">
                  {it.radical}＋{it.component}
                </span>
                <span className="text-[10px] font-bold text-[#57534E] truncate max-w-full">
                  {it.sampleWord}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleRestart}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#DB2777] px-5 py-2.5 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#9D174D' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>再練一次</span>
            </button>
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
              style={{ borderBottomColor: '#D97706' }}
            >
              <ShoppingBag className="h-4 w-4 text-[#D97706]" />
              <span>去抽盲盒！</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border border-[#E5DFD3] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#57534E]"
            >
              <Sparkles className="h-4 w-4" />
              <span>回到關卡</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

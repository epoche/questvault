import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Flame,
  RotateCcw,
  Ruler,
  ShoppingBag,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  applyQuestRewardMultiplier,
  calculateQuestionTokens,
  type QuestRewardPolicy,
} from '../../core/economy';
import type { MeasureIdiomQuestion, MeasureIdiomSet } from '../../subjects/chinese/measureIdiomTypes';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { RubyWord } from '../components/RubyWord';

export interface MeasureIdiomCompletionPayload {
  setId: string;
  setTitle: string;
  kind: MeasureIdiomSet['kind'];
  tier: MeasureIdiomSet['tier'];
  tokensEarned: number;
  rawTokensEarned: number;
  maxCombo: number;
  accuracyPct: number;
  wordOutcomes: { word: string; firstTryCorrect: boolean }[];
}

interface MeasureIdiomQuestViewProps {
  questSet: MeasureIdiomSet;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  showZhuyin: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onToggleZhuyin: () => void;
  onComplete: (payload: MeasureIdiomCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

const CHOICE_STYLES = [
  { bg: '#EF4444', border: '#991B1B', shape: '▲' },
  { bg: '#2563EB', border: '#1E3A8A', shape: '◆' },
  { bg: '#F59E0B', border: '#B45309', shape: '●' },
  { bg: '#059669', border: '#065F46', shape: '■' },
];

export const MeasureIdiomQuestView: React.FC<MeasureIdiomQuestViewProps> = ({
  questSet,
  equippedCollectibleId,
  isAvatarShiny = false,
  showZhuyin,
  rewardPolicy,
  onToggleZhuyin,
  onComplete,
  onExit,
  onGoToMarket,
}) => {
  const [lockedPolicy, setLockedPolicy] = useState<QuestRewardPolicy | undefined>(
    () => rewardPolicy,
  );
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [queue, setQueue] = useState<MeasureIdiomQuestion[]>(() => [...questSet.questions]);
  const [missedIds, setMissedIds] = useState<Record<string, boolean>>({});
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [rawTokens, setRawTokens] = useState(0);
  const [correctBanner, setCorrectBanner] = useState<string | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosenIdx: number } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [finalAwardedTokens, setFinalAwardedTokens] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);

  // Synchronous anti-cheat re-entry locks
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const completedRef = useRef(false);
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

  const currentQ = queue[0] ?? null;
  const totalUnique = questSet.questions.length;
  const doneCount = Math.max(0, totalUnique - queue.length);

  const finishQuest = useCallback(
    (
      finalRawRunning: number,
      finalMaxCombo: number,
      finalFirstTry: number,
      finalMissedMap: Record<string, boolean>,
    ) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const chestBonus = 15;
      const totalRaw = finalRawRunning + chestBonus;
      const awarded = applyQuestRewardMultiplier(totalRaw, policyMult);
      const accuracyPct = Math.round((finalFirstTry / Math.max(1, totalUnique)) * 100);
      setRawTokens(totalRaw);
      setFinalAwardedTokens(awarded);
      setFinalAccuracy(accuracyPct);
      setCompleted(true);
      audioService.playChest();

      onComplete({
        setId: questSet.id,
        setTitle: questSet.title,
        kind: questSet.kind,
        tier: questSet.tier,
        tokensEarned: awarded,
        rawTokensEarned: totalRaw,
        maxCombo: finalMaxCombo,
        accuracyPct,
        wordOutcomes: questSet.questions.map((q) => ({
          word: q.targetAnswer,
          firstTryCorrect: !finalMissedMap[q.id],
        })),
      });
    },
    [onComplete, policyMult, questSet.id, questSet.kind, questSet.questions, questSet.tier, questSet.title, totalUnique],
  );

  const advanceAfterWrong = useCallback(() => {
    if (advancingRef.current || !currentQ) return;
    advancingRef.current = true;
    clearTimer();
    setWrongFeedback(null);
    setCorrectBanner(null);
    setQueue((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [clearTimer, currentQ]);

  const handlePickChoice = useCallback(
    (idx: number) => {
      if (completed || !currentQ || answeringRef.current || wrongFeedback) return;
      answeringRef.current = true;

      if (idx === currentQ.correctIndex) {
        const nextCombo = combo + 1;
        const nextMaxCombo = Math.max(maxCombo, nextCombo);
        const alreadyMissed = Boolean(missedIds[currentQ.id]);
        const nextFirstTry = alreadyMissed ? firstTryRight : firstTryRight + 1;
        const gain = alreadyMissed ? 2 : calculateQuestionTokens(5, nextCombo);
        const nextRawTokens = rawTokens + gain;

        setCombo(nextCombo);
        setMaxCombo(nextMaxCombo);
        if (!alreadyMissed) setFirstTryRight(nextFirstTry);
        setRawTokens(nextRawTokens);
        audioService.playCorrect(nextCombo);
        setCorrectBanner(`✅ 答對了！${currentQ.explanation}`);

        const isLast = queue.length <= 1;
        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;
          setCorrectBanner(null);
          if (isLast) {
            setQueue([]);
            finishQuest(nextRawTokens, nextMaxCombo, nextFirstTry, missedIds);
          } else {
            setQueue((prev) => prev.slice(1));
            answeringRef.current = false;
          }
        }, 850);
      } else {
        setCombo(0);
        audioService.playNudge();
        setMissedIds((prev) => ({ ...prev, [currentQ.id]: true }));
        setWrongFeedback({ chosenIdx: idx });
      }
    },
    [combo, completed, currentQ, finishQuest, firstTryRight, maxCombo, missedIds, queue.length, rawTokens, wrongFeedback],
  );

  const handleRestart = () => {
    clearTimer();
    completedRef.current = false;
    answeringRef.current = false;
    advancingRef.current = false;
    setLockedPolicy(rewardPolicy);
    setQueue([...questSet.questions]);
    setMissedIds({});
    setFirstTryRight(0);
    setCombo(0);
    setMaxCombo(0);
    setRawTokens(0);
    setCorrectBanner(null);
    setWrongFeedback(null);
    setCompleted(false);
  };

  useEffect(() => {
    if (completed) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (wrongFeedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceAfterWrong();
        }
        return;
      }
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx >= 0 && currentQ?.choices[idx]) {
        e.preventDefault();
        handlePickChoice(idx);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advanceAfterWrong, completed, currentQ, handlePickChoice, wrongFeedback]);

  const displayedHudTokens = applyQuestRewardMultiplier(rawTokens, policyMult);
  const isMeasure = questSet.kind === 'measure';

  const renderPromptWithBlank = (q: MeasureIdiomQuestion) => {
    const parts = q.promptSentence.split('___');
    if (parts.length < 2) return <span>{q.promptSentence}</span>;
    const showFilled = Boolean(correctBanner || wrongFeedback);
    return (
      <span>
        {parts[0]}
        <span
          className={`mx-1 inline-flex items-center rounded-xl border-2 px-2.5 py-0.5 font-display font-extrabold align-baseline ${
            showFilled
              ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
              : 'border-dashed border-[#4F46E5] bg-[#EEF2FF] text-[#4338CA]'
          }`}
        >
          {showFilled ? (
            <RubyWord
              word={q.targetAnswer}
              zhuyin={q.targetZhuyin}
              showZhuyin={showZhuyin}
              zhuyinClassName="text-[#047857]"
            />
          ) : (
            '＿＿'
          )}
        </span>
        {parts.slice(1).join('___')}
      </span>
    );
  };

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
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold text-white"
            style={{ backgroundColor: questSet.accentHex }}
          >
            <Ruler className="h-3.5 w-3.5" />
            <span>{questSet.title}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 tabular-nums">
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-1 text-xs font-extrabold text-[#57534E]">
            {completed ? '通關完成' : `第 ${Math.min(doneCount + 1, totalUnique)}/${totalUnique} 題`}
          </span>

          {combo >= 2 && !completed && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-1 text-xs font-extrabold text-[#C2410C]">
              <Flame className="h-3.5 w-3.5 fill-current" />
              {combo}×
            </span>
          )}

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

          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#1C1917] px-2.5 py-1 text-xs font-extrabold text-[#92400E]">
            <Coins className="h-3.5 w-3.5 text-[#D97706]" />+{displayedHudTokens}
          </span>
        </div>
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang="zh" />

      {/* QUESTION CARD */}
      {!completed && currentQ && (
        <section className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold"
              style={{ backgroundColor: questSet.bgHex, color: questSet.accentHex }}
            >
              <span>{currentQ.visualEmoji}</span>
              <span>{isMeasure ? '選出最正確的量詞' : '選出最貼切的詞語／成語'}</span>
            </span>

            <button
              type="button"
              onClick={() =>
                audioService.speak(
                  correctBanner || wrongFeedback
                    ? currentQ.spokenFullSentence
                    : currentQ.promptSentence.replace('___', '什麼'),
                  'zh-TW',
                )
              }
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#EFF6FF] px-3 py-1.5 text-xs font-extrabold text-[#1D4ED8]"
            >
              <Volume2 className="h-4 w-4" />
              <span>唸唸看</span>
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF7F2] p-5 text-center space-y-3">
            <div className="text-4xl" aria-hidden="true">
              {currentQ.visualEmoji}
            </div>
            <p className="font-display text-xl sm:text-2xl font-extrabold leading-relaxed text-[#1C1917]">
              {renderPromptWithBlank(currentQ)}
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#57534E]">
              💡 {currentQ.englishBridge}
            </p>
          </div>

          {/* 4-Color Blooket-Style Answer Grid */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.choices.map((choice, idx) => {
              const style = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isWrongChosen = wrongFeedback?.chosenIdx === idx;
              const isCorrectReveal = Boolean(wrongFeedback || correctBanner) && idx === currentQ.correctIndex;
              return (
                <button
                  key={`${currentQ.id}-${choice}`}
                  type="button"
                  disabled={Boolean(wrongFeedback || correctBanner)}
                  onClick={() => handlePickChoice(idx)}
                  className={`qv-arcade-btn min-h-[76px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 text-white transition-transform ${
                    isWrongChosen
                      ? 'opacity-45 scale-95'
                      : isCorrectReveal
                        ? 'ring-4 ring-[#FDE047]'
                        : ''
                  }`}
                  style={{
                    backgroundColor: style.bg,
                    borderBottomColor: style.border,
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                      {style.shape}
                    </span>
                    <RubyWord
                      word={choice}
                      zhuyin={currentQ.choiceZhuyins[idx]}
                      showZhuyin={showZhuyin}
                      className="font-display text-xl sm:text-2xl font-extrabold text-white"
                      zhuyinClassName="text-[#FEF08A]"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {correctBanner && (
            <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-3 text-sm font-extrabold text-[#065F46]">
              {correctBanner}
            </div>
          )}

          {wrongFeedback && (
            <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 text-left">
                <div className="text-xs font-extrabold text-[#B45309]">
                  再記一下！（這題稍後會再出現一次）
                </div>
                <p className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                  正解：「{currentQ.targetAnswer}」— {currentQ.explanation}
                </p>
                <button
                  type="button"
                  onClick={() => audioService.speak(currentQ.spokenFullSentence, 'zh-TW')}
                  className="mt-1 inline-flex items-center gap-1 rounded-lg bg-white border border-[#E5DFD3] px-2.5 py-1 text-xs font-extrabold text-[#1D4ED8]"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>聽完整句子</span>
                </button>
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

      {/* VICTORY SCREEN */}
      {completed && (
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
              🎉 {questSet.title} 完成！
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              {policyMult === 0
                ? '純練習模式完成！去挑戰還沒破的新關卡拿 100% 代幣吧！'
                : '中文語感大升級！這 5 題全部收進記憶庫了！'}
            </p>
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
              <div className="text-xs font-bold text-[#92400E]">獲得代幣</div>
              <div className="mt-0.5 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#1C1917] tabular-nums">
                <Coins className="h-5 w-5 text-[#D97706]" />+{finalAwardedTokens}
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

          {/* 5-Item Recap Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            {questSet.questions.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-[#E5DFD3] bg-[#FAF7F2] px-3.5 py-2.5 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-display text-sm font-extrabold text-[#1C1917]">
                    <span>{q.visualEmoji}</span>
                    <RubyWord
                      word={q.targetAnswer}
                      zhuyin={q.targetZhuyin}
                      showZhuyin={showZhuyin}
                      zhuyinClassName="text-[#4F46E5]"
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#57534E] truncate">
                    {q.spokenFullSentence}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => audioService.speak(q.spokenFullSentence, 'zh-TW')}
                  aria-label={`朗讀 ${q.targetAnswer}`}
                  className="qv-btn shrink-0 rounded-xl border border-[#E5DFD3] bg-white p-2 text-[#1D4ED8]"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleRestart}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#4F46E5] px-5 py-2.5 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#3730A3' }}
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

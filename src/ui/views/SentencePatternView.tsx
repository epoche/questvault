import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import { applyQuestRewardMultiplier, type QuestRewardPolicy } from '../../core/economy';
import {
  SENTENCE_PATTERN_BASE_TOKENS,
  SENTENCE_PATTERN_PERFECT_BONUS,
  type SentencePatternItem,
  type SentencePatternSet,
} from '../../subjects/chinese/sentencePatternTypes';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { RubySentence } from '../components/RubySentence';

export interface SentencePatternCompletionPayload {
  setId: string;
  setTitle: string;
  tier: SentencePatternSet['tier'];
  tokensEarned: number;
  rawTokensEarned: number;
  accuracyPct: number;
  maxCombo: number;
}

interface SentencePatternViewProps {
  questSet: SentencePatternSet;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  showZhuyin: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onToggleZhuyin: () => void;
  onComplete: (payload: SentencePatternCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

const CHOICE_STYLES = [
  { bg: '#EF4444', border: '#991B1B', shape: '▲' },
  { bg: '#2563EB', border: '#1E3A8A', shape: '◆' },
  { bg: '#F59E0B', border: '#B45309', shape: '●' },
  { bg: '#059669', border: '#065F46', shape: '■' },
];

function shuffleChoices(choices: readonly string[], seed: number): string[] {
  const arr = [...choices];
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (1664525 * s + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildScrambledChunkIndices(length: number, seed: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  if (length <= 1) return indices;
  let s = seed >>> 0;
  for (let i = indices.length - 1; i > 0; i -= 1) {
    s = (1664525 * s + 1013904223) >>> 0;
    const j = s % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  // Ensure scrambled order is never identical to [0, 1, 2, ...]
  if (indices.every((v, idx) => v === idx)) {
    [indices[0], indices[length - 1]] = [indices[length - 1], indices[0]];
  }
  return indices;
}

function safeSpeakZh(text: string): void {
  try {
    audioService.speak(text, 'zh-TW');
  } catch {
    // Sandbox safe no-op
  }
}

function safeCancelSpeech(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Sandbox safe no-op
  }
}

export const SentencePatternView: React.FC<SentencePatternViewProps> = ({
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
  const [lockedPolicy] = useState<QuestRewardPolicy | undefined>(() => rewardPolicy);
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [stage, setStage] = useState<'fill' | 'reorder' | 'summary'>('fill');
  const [fillQueue, setFillQueue] = useState<SentencePatternItem[]>(() => [...questSet.items]);
  const [reorderQueue, setReorderQueue] = useState<SentencePatternItem[]>(() => [...questSet.items]);
  const [fillDoneCount, setFillDoneCount] = useState(0);
  const [reorderDoneCount, setReorderDoneCount] = useState(0);

  const [choiceMap] = useState<Record<string, string[]>>(() => {
    const out: Record<string, string[]> = {};
    questSet.items.forEach((it, idx) => {
      out[it.id] = shuffleChoices(it.fillChoices, idx * 97 + it.id.length * 31 + 17);
    });
    return out;
  });

  const [scrambleMap] = useState<Record<string, number[]>>(() => {
    const out: Record<string, number[]> = {};
    questSet.items.forEach((it, idx) => {
      out[it.id] = buildScrambledChunkIndices(it.reorderChunks.length, idx * 131 + it.id.length * 19 + 7);
    });
    return out;
  });

  const [pickedChunkIndices, setPickedChunkIndices] = useState<number[]>([]);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosenText: string } | null>(null);
  const [correctFlash, setCorrectFlash] = useState<string | null>(null);

  const [missedKeys, setMissedKeys] = useState<Record<string, boolean>>({});
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [finalAwardedTokens, setFinalAwardedTokens] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);

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
      safeCancelSpeech();
    };
  }, [clearTimer]);

  useEffect(() => {
    if (!wrongFeedback) {
      advancingRef.current = false;
    }
  }, [wrongFeedback]);

  const totalSteps = questSet.items.length * 2;
  const currentFillItem = fillQueue[0] ?? null;
  const currentReorderItem = reorderQueue[0] ?? null;

  const finishQuest = useCallback(
    (finalFirstTry: number, bestCombo: number) => {
      if (completedRef.current) return;
      completedRef.current = true;
      clearTimer();

      const raw =
        SENTENCE_PATTERN_BASE_TOKENS +
        (finalFirstTry >= totalSteps ? SENTENCE_PATTERN_PERFECT_BONUS : 0);
      const awarded = applyQuestRewardMultiplier(raw, policyMult);
      const acc = Math.round((finalFirstTry / Math.max(1, totalSteps)) * 100);
      setFinalAwardedTokens(awarded);
      setFinalAccuracy(acc);

      onComplete({
        setId: questSet.id,
        setTitle: questSet.title,
        tier: questSet.tier,
        tokensEarned: awarded,
        rawTokensEarned: raw,
        accuracyPct: acc,
        maxCombo: bestCombo,
      });
      if (awarded > 0) audioService.playChest();
      else audioService.playCorrect(3);
      setStage('summary');
    },
    [clearTimer, onComplete, policyMult, questSet, totalSteps],
  );

  // Stage 1: Conjunction / Pattern Fill-In handler
  const handleSelectFillChoice = (choice: string) => {
    if (
      stage !== 'fill' ||
      !currentFillItem ||
      answeringRef.current ||
      wrongFeedback ||
      correctFlash
    ) {
      return;
    }
    answeringRef.current = true;
    const missKey = `fill:${currentFillItem.id}`;

    if (choice === currentFillItem.fillAnswer) {
      const wasMissed = Boolean(missedKeys[missKey]);
      const nextFirstTry = wasMissed ? firstTryCorrect : firstTryCorrect + 1;
      const nextCombo = combo + 1;
      const nextBest = Math.max(maxCombo, nextCombo);
      setFirstTryCorrect(nextFirstTry);
      setCombo(nextCombo);
      setMaxCombo(nextBest);
      setFillDoneCount((c) => c + 1);
      setCorrectFlash(`✅ 答對了！完整例句：${currentFillItem.reorderTarget}`);
      audioService.playCorrect(nextCombo);
      safeSpeakZh(currentFillItem.reorderTarget);

      timerRef.current = window.setTimeout(() => {
        const remaining = fillQueue.slice(1);
        setCorrectFlash(null);
        answeringRef.current = false;
        if (remaining.length === 0) {
          setStage('reorder');
          setPickedChunkIndices([]);
        } else {
          setFillQueue(remaining);
        }
      }, 1050);
    } else {
      setMissedKeys((prev) => ({ ...prev, [missKey]: true }));
      setCombo(0);
      setWrongFeedback({ chosenText: choice });
      audioService.playNudge();
    }
  };

  // Stage 2: Sentence Block Reorder handlers
  const handleTapAvailableChunk = (chunkIdx: number) => {
    if (
      stage !== 'reorder' ||
      !currentReorderItem ||
      answeringRef.current ||
      wrongFeedback ||
      correctFlash
    ) {
      return;
    }
    audioService.playToken();
    setPickedChunkIndices((prev) => (prev.includes(chunkIdx) ? prev : [...prev, chunkIdx]));
  };

  const handleRemovePickedChunk = (chunkIdx: number) => {
    if (answeringRef.current || wrongFeedback || correctFlash) return;
    setPickedChunkIndices((prev) => prev.filter((id) => id !== chunkIdx));
  };

  const handleCheckReorder = () => {
    if (
      stage !== 'reorder' ||
      !currentReorderItem ||
      answeringRef.current ||
      wrongFeedback ||
      correctFlash
    ) {
      return;
    }
    if (pickedChunkIndices.length !== currentReorderItem.reorderChunks.length) return;
    answeringRef.current = true;

    const assembled = pickedChunkIndices
      .map((i) => currentReorderItem.reorderChunks[i])
      .join('');
    const missKey = `reorder:${currentReorderItem.id}`;

    if (assembled === currentReorderItem.reorderTarget) {
      const wasMissed = Boolean(missedKeys[missKey]);
      const nextFirstTry = wasMissed ? firstTryCorrect : firstTryCorrect + 1;
      const nextCombo = combo + 1;
      const nextBest = Math.max(maxCombo, nextCombo);
      setFirstTryCorrect(nextFirstTry);
      setCombo(nextCombo);
      setMaxCombo(nextBest);
      setReorderDoneCount((c) => c + 1);
      setCorrectFlash(`🎉 句子積木拼對了！${currentReorderItem.reorderTarget}`);
      audioService.playCorrect(nextCombo);
      safeSpeakZh(currentReorderItem.reorderTarget);

      timerRef.current = window.setTimeout(() => {
        const remaining = reorderQueue.slice(1);
        setCorrectFlash(null);
        setPickedChunkIndices([]);
        answeringRef.current = false;
        if (remaining.length === 0) {
          finishQuest(nextFirstTry, nextBest);
        } else {
          setReorderQueue(remaining);
        }
      }, 1150);
    } else {
      setMissedKeys((prev) => ({ ...prev, [missKey]: true }));
      setCombo(0);
      setWrongFeedback({ chosenText: assembled });
      audioService.playNudge();
    }
  };

  const handleGotItAfterWrong = () => {
    if (!wrongFeedback || advancingRef.current) return;
    advancingRef.current = true;
    safeCancelSpeech();
    audioService.playToken();
    if (stage === 'fill' && currentFillItem) {
      setFillQueue([...fillQueue.slice(1), currentFillItem]);
    } else if (stage === 'reorder' && currentReorderItem) {
      setReorderQueue([...reorderQueue.slice(1), currentReorderItem]);
      setPickedChunkIndices([]);
    }
    setWrongFeedback(null);
    answeringRef.current = false;
  };

  if (stage === 'summary') {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 shadow-[0_6px_0_#1C1917] text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF2F8] border border-[#F472B6] px-3.5 py-1 text-xs font-extrabold text-[#BE185D]">
            <Trophy className="h-4 w-4" />
            句型魔方通關！
          </span>
          <div className="flex flex-col items-center gap-2">
            <CollectibleArt id={equippedCollectibleId} size={86} shiny={isAvatarShiny} />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              🧱 {questSet.title} 完成！
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              你已經掌握了「{questSet.patternBadge}」的關聯詞與語序重組技巧！
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3.5">
              <p className="text-xs font-bold text-[#065F46]">首次答對率</p>
              <p className="font-display text-2xl font-extrabold text-[#059669] tabular-nums">
                {finalAccuracy}%
              </p>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3.5">
              <p className="text-xs font-bold text-[#92400E]">獲得代幣</p>
              <p className="font-display text-2xl font-extrabold text-[#D97706] tabular-nums inline-flex items-center gap-1">
                <Coins className="h-5 w-5" />+{finalAwardedTokens}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>去抽盲盒！</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#1C1917] font-display text-sm font-extrabold"
            >
              返回中文主頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            clearTimer();
            safeCancelSpeech();
            onExit();
          }}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#57534E]"
        >
          <X className="h-4 w-4" />
          <span>離開</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleZhuyin}
            className={`qv-btn min-h-[38px] rounded-2xl border-2 px-3 py-1 text-xs font-extrabold ${
              showZhuyin
                ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                : 'border-[#E5DFD3] bg-white text-[#57534E]'
            }`}
          >
            注音：{showZhuyin ? '開' : '關'}
          </button>
          <span
            className="rounded-full border px-3 py-1 text-xs font-extrabold"
            style={{
              backgroundColor: questSet.bgHex,
              borderColor: questSet.accentHex,
              color: questSet.accentHex,
            }}
          >
            {stage === 'fill' ? '關卡 1/2 · 選關聯詞填空' : '關卡 2/2 · 句型積木重組'}
          </span>
          <span className="rounded-full bg-[#F3EFE7] px-3 py-1 text-xs font-extrabold text-[#1C1917] tabular-nums">
            {stage === 'fill'
              ? `${fillDoneCount} / ${questSet.items.length}`
              : `${reorderDoneCount} / ${questSet.items.length}`}
          </span>
        </div>
      </div>

      {lockedPolicy && <RewardPolicyBanner policy={lockedPolicy} lang="zh" />}

      {/* Stage 1: Fill-in-the-blank MCQ */}
      {stage === 'fill' && currentFillItem && (
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 text-xs font-extrabold text-[#1D4ED8]">
              <Sparkles className="h-3.5 w-3.5" />
              English Bridge: {currentFillItem.englishBridge}
            </span>
            <button
              type="button"
              onClick={() =>
                safeSpeakZh(currentFillItem.fillPrompt.replace(/（　+）/g, '，空格，'))
              }
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#FEF3C7] px-3 py-1 text-xs font-extrabold text-[#92400E]"
            >
              <Volume2 className="h-4 w-4" />
              <span>念題目</span>
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] p-5 text-center">
            <p className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-loose">
              <RubySentence
                text={currentFillItem.fillPrompt}
                zhuyin={currentFillItem.fillPromptZhuyin}
                showZhuyin={showZhuyin}
                className="justify-center"
              />
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(choiceMap[currentFillItem.id] ?? currentFillItem.fillChoices).map((choice, idx) => {
              const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isRight = choice === currentFillItem.fillAnswer;
              const isWrongChosen = wrongFeedback?.chosenText === choice;
              const dimmed =
                (Boolean(wrongFeedback) && !isRight && !isWrongChosen) ||
                (Boolean(correctFlash) && !isRight);

              return (
                <button
                  key={`${currentFillItem.id}-${choice}`}
                  type="button"
                  disabled={Boolean(wrongFeedback) || Boolean(correctFlash)}
                  onClick={() => handleSelectFillChoice(choice)}
                  className={`qv-btn min-h-[60px] rounded-2xl border-b-4 px-4 py-3 text-white font-display text-lg font-extrabold flex items-center justify-center gap-2 transition-opacity ${
                    dimmed ? 'opacity-40' : ''
                  } ${wrongFeedback && isRight ? 'ring-4 ring-[#10B981] ring-offset-2' : ''}`}
                  style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
                >
                  <span className="text-xs opacity-80">{st.shape}</span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {correctFlash && (
            <div className="rounded-2xl border-2 border-[#10B981] bg-[#ECFDF5] p-3.5 text-sm font-extrabold text-[#047857]">
              {correctFlash}
            </div>
          )}

          {wrongFeedback && (
            <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 space-y-3">
              <div className="space-y-1">
                <p className="font-display text-sm font-extrabold text-[#B45309]">
                  💡 正確關聯詞／句型：{currentFillItem.fillAnswer}
                </p>
                <p className="text-sm font-extrabold text-[#1C1917] leading-relaxed">
                  完整句：
                  <RubySentence
                    text={currentFillItem.reorderTarget}
                    zhuyin={currentFillItem.reorderTargetZhuyin}
                    showZhuyin={showZhuyin}
                  />
                </p>
                <p className="text-xs font-semibold text-[#57534E]">
                  {currentFillItem.explanation}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => safeSpeakZh(currentFillItem.reorderTarget)}
                  className="qv-btn min-h-[42px] rounded-2xl border-2 border-[#1C1917] bg-white px-4 py-2 text-xs font-extrabold text-[#1C1917] inline-flex items-center gap-1"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>聽完整句</span>
                </button>
                <button
                  type="button"
                  onClick={handleGotItAfterWrong}
                  className="qv-btn min-h-[42px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 text-sm font-extrabold text-white inline-flex items-center gap-1.5"
                >
                  <span>我知道了，等一下再試</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stage 2: Sentence Block Reorder */}
      {stage === 'reorder' && currentReorderItem && (
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] px-3 py-1 text-xs font-extrabold text-[#6D28D9]">
              🧱 句型提示：{currentReorderItem.patternLabel}
            </span>
            <span className="text-xs font-bold text-[#57534E]">
              {currentReorderItem.englishBridge}
            </span>
          </div>

          <p className="text-sm font-bold text-[#57534E]">
            請依序點擊下方積木，拼出通順完整的繁體中文句子（點擊上方已選積木可移回）：
          </p>

          {/* Answer Tray */}
          <div className="min-h-[84px] rounded-2xl border-2 border-dashed border-[#1C1917] bg-[#FFFDF8] p-3.5 flex flex-wrap items-center gap-2">
            {pickedChunkIndices.length === 0 ? (
              <span className="text-xs sm:text-sm font-bold text-[#A8A29E]">
                點擊下方積木開始造句⋯⋯
              </span>
            ) : (
              pickedChunkIndices.map((chunkIdx) => (
                <button
                  key={`picked-${chunkIdx}`}
                  type="button"
                  disabled={Boolean(wrongFeedback) || Boolean(correctFlash)}
                  onClick={() => handleRemovePickedChunk(chunkIdx)}
                  className="qv-btn rounded-xl border-2 border-[#1C1917] bg-[#FEF3C7] px-3.5 py-2 font-display text-base sm:text-lg font-extrabold text-[#1C1917] leading-relaxed"
                >
                  <RubySentence
                    text={currentReorderItem.reorderChunks[chunkIdx]}
                    zhuyin={currentReorderItem.reorderChunksZhuyin[chunkIdx]}
                    showZhuyin={showZhuyin}
                  />
                </button>
              ))
            )}
          </div>

          {/* Scrambled Chunk Bank */}
          <div className="flex flex-wrap gap-2.5">
            {(scrambleMap[currentReorderItem.id] ?? currentReorderItem.reorderChunks.map((_, i) => i)).map(
              (chunkIdx) => {
                const used = pickedChunkIndices.includes(chunkIdx);
                return (
                  <button
                    key={`bank-${currentReorderItem.id}-${chunkIdx}`}
                    type="button"
                    disabled={used || Boolean(wrongFeedback) || Boolean(correctFlash)}
                    onClick={() => handleTapAvailableChunk(chunkIdx)}
                    className={`qv-btn min-h-[50px] rounded-2xl border-2 px-4 py-2 font-display text-base sm:text-lg font-extrabold leading-relaxed transition-all ${
                      used
                        ? 'border-[#E5DFD3] bg-[#F5F5F4] text-[#A8A29E] opacity-40'
                        : 'border-[#1C1917] bg-[#EFF6FF] text-[#1E3A8A] shadow-[0_3px_0_#1C1917]'
                    }`}
                  >
                    <RubySentence
                      text={currentReorderItem.reorderChunks[chunkIdx]}
                      zhuyin={currentReorderItem.reorderChunksZhuyin[chunkIdx]}
                      showZhuyin={showZhuyin}
                    />
                  </button>
                );
              },
            )}
          </div>

          {/* Action Row */}
          {!wrongFeedback && !correctFlash && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={pickedChunkIndices.length === 0}
                onClick={() => {
                  if (answeringRef.current || wrongFeedback || correctFlash) return;
                  setPickedChunkIndices([]);
                }}
                className="qv-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-white px-4 py-2 text-xs sm:text-sm font-extrabold text-[#57534E] disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" />
                <span>清空重排</span>
              </button>
              <button
                type="button"
                disabled={pickedChunkIndices.length !== currentReorderItem.reorderChunks.length}
                onClick={handleCheckReorder}
                className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-6 py-2 font-display text-sm sm:text-base font-extrabold text-white disabled:opacity-40"
                style={{ borderBottomColor: '#065F46' }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>檢查句子！</span>
              </button>
            </div>
          )}

          {correctFlash && (
            <div className="rounded-2xl border-2 border-[#10B981] bg-[#ECFDF5] p-3.5 text-sm font-extrabold text-[#047857]">
              {correctFlash}
            </div>
          )}

          {wrongFeedback && (
            <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 space-y-3">
              <div className="space-y-1">
                <p className="font-display text-sm font-extrabold text-[#B45309]">
                  💡 正確語序示範：
                </p>
                <p className="text-base font-extrabold text-[#1C1917] leading-loose">
                  <RubySentence
                    text={currentReorderItem.reorderTarget}
                    zhuyin={currentReorderItem.reorderTargetZhuyin}
                    showZhuyin={showZhuyin}
                  />
                </p>
                <p className="text-xs font-semibold text-[#57534E]">
                  {currentReorderItem.explanation}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => safeSpeakZh(currentReorderItem.reorderTarget)}
                  className="qv-btn min-h-[42px] rounded-2xl border-2 border-[#1C1917] bg-white px-4 py-2 text-xs font-extrabold text-[#1C1917] inline-flex items-center gap-1"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>聽正確句子</span>
                </button>
                <button
                  type="button"
                  onClick={handleGotItAfterWrong}
                  className="qv-btn min-h-[42px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 text-sm font-extrabold text-white inline-flex items-center gap-1.5"
                >
                  <span>我知道了，等一下再試</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

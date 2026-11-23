import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Delete,
  Keyboard,
  Lightbulb,
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
  buildSpellingLetterTiles,
  calculateSpellingRunTokens,
  type SpellingItem,
  type SpellingSet,
} from '../../subjects/english/spellingTypes';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';

export interface SpellingBeeCompletionPayload {
  setId: string;
  setTitle: string;
  tier: SpellingSet['tier'];
  tokensEarned: number;
  rawTokensEarned: number;
  accuracyPct: number;
  wordOutcomes: { word: string; firstTryCorrect: boolean }[];
}

interface SpellingBeeViewProps {
  questSet: SpellingSet;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onComplete: (payload: SpellingBeeCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

export const SpellingBeeView: React.FC<SpellingBeeViewProps> = ({
  questSet,
  equippedCollectibleId,
  isAvatarShiny = false,
  rewardPolicy,
  onComplete,
  onExit,
  onGoToMarket,
}) => {
  const [lockedPolicy] = useState<QuestRewardPolicy | undefined>(() => rewardPolicy);
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [queue, setQueue] = useState<SpellingItem[]>(() => [...questSet.items]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [inputMode, setInputMode] = useState<'tiles' | 'keyboard'>('tiles');
  const [typedText, setTypedText] = useState('');
  const [pickedTileIndices, setPickedTileIndices] = useState<number[]>([]);
  const [showRuleHint, setShowRuleHint] = useState(false);

  const [wrongFeedback, setWrongFeedback] = useState<{ attempt: string } | null>(null);
  const [correctBanner, setCorrectBanner] = useState<string | null>(null);
  const [missedIds, setMissedIds] = useState<Record<string, boolean>>({});
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalAwardedTokens, setFinalAwardedTokens] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);

  const submittingRef = useRef(false);
  const advancingRef = useRef(false);
  const completedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const currentItem = queue[0] ?? null;
  const tiles = useMemo(
    () => (currentItem ? buildSpellingLetterTiles(currentItem.word, roundIdx + 1) : []),
    [currentItem, roundIdx],
  );

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
    if (!wrongFeedback) {
      advancingRef.current = false;
    }
  }, [wrongFeedback]);

  const speakWord = useCallback((word: string, slow = false) => {
    audioService.speak(word, 'en-US', slow ? 0.68 : 0.92);
  }, []);

  const speakSentence = useCallback((item: SpellingItem) => {
    const fullSentence = item.contextSentence.replace(/___/g, item.word);
    audioService.speak(fullSentence, 'en-US', 0.9);
  }, []);

  const currentAnswer =
    inputMode === 'tiles'
      ? pickedTileIndices.map((idx) => tiles[idx] ?? '').join('')
      : typedText.trim().toLowerCase();

  const resetInputs = () => {
    setTypedText('');
    setPickedTileIndices([]);
    setShowRuleHint(false);
    setWrongFeedback(null);
    setCorrectBanner(null);
  };

  const finishRun = useCallback(
    (finalFirstTry: number, finalMissedMap: Record<string, boolean>) => {
      if (completedRef.current) return;
      completedRef.current = true;
      clearTimer();

      const total = questSet.items.length;
      const rawTokens = calculateSpellingRunTokens(finalFirstTry, total);
      const awarded = applyQuestRewardMultiplier(rawTokens, policyMult);
      const acc = Math.round((finalFirstTry / Math.max(1, total)) * 100);
      setFinalAwardedTokens(awarded);
      setFinalAccuracy(acc);

      onComplete({
        setId: questSet.id,
        setTitle: questSet.title,
        tier: questSet.tier,
        tokensEarned: awarded,
        rawTokensEarned: rawTokens,
        accuracyPct: acc,
        wordOutcomes: questSet.items.map((it) => ({
          word: it.word,
          firstTryCorrect: !finalMissedMap[it.id],
        })),
      });
      if (awarded > 0) audioService.playChest();
      else audioService.playCorrect(3);
      setFinished(true);
    },
    [clearTimer, onComplete, policyMult, questSet],
  );

  const handleSubmitSpelling = () => {
    if (!currentItem || submittingRef.current || wrongFeedback || correctBanner || finished) return;
    const candidate = currentAnswer.trim().toLowerCase();
    if (!candidate) return;
    submittingRef.current = true;

    if (candidate === currentItem.word.toLowerCase()) {
      const wasMissedBefore = Boolean(missedIds[currentItem.id]);
      const nextFirstTry = wasMissedBefore ? firstTryRight : firstTryRight + 1;
      const nextCompleted = completedCount + 1;

      setFirstTryRight(nextFirstTry);
      setCompletedCount(nextCompleted);
      setCorrectBanner(`🐝 Spot-on! "${currentItem.word}" (${currentItem.ruleTag})`);
      audioService.playCorrect(nextCompleted);

      timerRef.current = window.setTimeout(() => {
        const remaining = queue.slice(1);
        if (remaining.length === 0) {
          finishRun(nextFirstTry, missedIds);
        } else {
          setQueue(remaining);
          setRoundIdx((r) => r + 1);
          resetInputs();
          submittingRef.current = false;
        }
      }, 720);
    } else {
      const nextMissed = { ...missedIds, [currentItem.id]: true };
      setMissedIds(nextMissed);
      setWrongFeedback({ attempt: candidate });
      audioService.playNudge();
      // Keep submittingRef locked until user explicitly clicks Got It
    }
  };

  const handleGotItAfterWrong = () => {
    if (!currentItem || !wrongFeedback || advancingRef.current) return;
    advancingRef.current = true;
    audioService.playToken();
    const requeued = [...queue.slice(1), currentItem];
    setQueue(requeued);
    setRoundIdx((r) => r + 1);
    resetInputs();
    submittingRef.current = false;
  };

  const handleTapTile = (tileIdx: number) => {
    if (wrongFeedback || correctBanner || pickedTileIndices.includes(tileIdx)) return;
    if (!currentItem || pickedTileIndices.length >= currentItem.word.length + 2) return;
    setPickedTileIndices((prev) => [...prev, tileIdx]);
    audioService.playToken();
  };

  const handleUndoTile = () => {
    if (wrongFeedback || correctBanner || pickedTileIndices.length === 0) return;
    setPickedTileIndices((prev) => prev.slice(0, -1));
  };

  const handleClearTiles = () => {
    if (wrongFeedback || correctBanner) return;
    setPickedTileIndices([]);
    setTypedText('');
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 shadow-[0_6px_0_#1C1917] text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3.5 py-1 text-xs font-extrabold text-[#B45309]">
            <Trophy className="h-4 w-4" />
            <span>SPELLING BEE COMPLETE!</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <CollectibleArt id={equippedCollectibleId} size={86} shiny={isAvatarShiny} />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              🐝 {questSet.title} Mastered!
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              You spelled all {questSet.items.length} tricky Grade 4–5 words accurately!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3.5">
              <p className="text-xs font-bold text-[#065F46]">First-Try Accuracy</p>
              <p className="font-display text-2xl font-extrabold text-[#059669] tabular-nums">
                {finalAccuracy}%
              </p>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3.5">
              <p className="text-xs font-bold text-[#92400E]">Tokens Earned</p>
              <p className="font-display text-2xl font-extrabold text-[#D97706] tabular-nums inline-flex items-center gap-1">
                <Coins className="h-5 w-5" />+{finalAwardedTokens}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DFD3] bg-[#FAF8F4] p-3.5 text-left space-y-1.5">
            <p className="text-xs font-extrabold text-[#57534E]">Words Spelled This Round:</p>
            <div className="flex flex-wrap gap-1.5">
              {questSet.items.map((it) => (
                <span
                  key={it.id}
                  className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E5DFD3] px-2.5 py-1 text-xs font-extrabold text-[#1C1917]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                  {it.word}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Open Mystery Packs</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#1C1917] font-display text-sm font-extrabold"
            >
              Back to Quests
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  const progressPct = Math.round((completedCount / Math.max(1, questSet.items.length)) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#57534E]"
        >
          <X className="h-4 w-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309] tabular-nums">
            🐝 {completedCount} / {questSet.items.length} Spelled
          </span>
          <button
            type="button"
            onClick={() => {
              setInputMode((m) => (m === 'tiles' ? 'keyboard' : 'tiles'));
              setPickedTileIndices([]);
              setTypedText('');
            }}
            className="qv-btn inline-flex min-h-[36px] items-center gap-1 rounded-full border-2 border-[#1C1917] bg-white px-3 py-1 text-xs font-extrabold text-[#1C1917]"
          >
            <Keyboard className="h-3.5 w-3.5" />
            <span>{inputMode === 'tiles' ? 'Switch to Keyboard' : 'Switch to Letter Tiles'}</span>
          </button>
        </div>
      </div>

      {lockedPolicy && <RewardPolicyBanner policy={lockedPolicy} />}

      {/* Progress Bar */}
      <div className="h-3 w-full overflow-hidden rounded-full border-2 border-[#1C1917] bg-white">
        <div
          className="h-full rounded-full bg-[#F59E0B] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Spelling Card */}
      <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 text-xs font-extrabold text-[#1D4ED8]">
            <Sparkles className="h-3.5 w-3.5" />
            {questSet.title}
          </span>
          <span className="text-xs font-extrabold text-[#78716C] tabular-nums">
            {currentItem.word.length} letters
          </span>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => speakWord(currentItem.word, false)}
            className="qv-arcade-btn inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-2.5 font-display text-sm sm:text-base font-extrabold text-white"
            style={{ borderBottomColor: '#1E3A8A' }}
          >
            <Volume2 className="h-5 w-5" />
            <span>Listen to Word</span>
          </button>
          <button
            type="button"
            onClick={() => speakWord(currentItem.word, true)}
            className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2 text-xs sm:text-sm font-extrabold text-[#1D4ED8]"
          >
            <Volume2 className="h-4 w-4" />
            <span>Slow 0.7×</span>
          </button>
          <button
            type="button"
            onClick={() => speakSentence(currentItem)}
            className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] px-4 py-2 text-xs sm:text-sm font-extrabold text-[#57534E]"
          >
            <Volume2 className="h-4 w-4" />
            <span>Hear Sentence</span>
          </button>
        </div>

        {/* Meaning & Masked Context Clue */}
        <div className="rounded-2xl border-2 border-[#F3EFE7] bg-[#FAF8F4] p-4 space-y-2 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#B45309]">
            Meaning: <span className="normal-case text-[#1C1917]">{currentItem.definition}</span>
          </p>
          <p className="font-display text-base sm:text-lg font-extrabold text-[#1C1917] leading-relaxed">
            “{currentItem.contextSentence}”
          </p>
          <button
            type="button"
            onClick={() => setShowRuleHint((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#2563EB] hover:underline"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>{showRuleHint ? 'Hide First-Letter Clue' : 'Show First-Letter Clue'}</span>
          </button>
          {showRuleHint && (
            <p className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-3 py-2 text-xs font-bold text-[#92400E]">
              💡 Starts with <strong className="uppercase">{currentItem.word[0]}</strong> ·{' '}
              {currentItem.word.length} letters total (full memory tip unlocks after you check!)
            </p>
          )}
        </div>

        {/* Spelling Input Area: Letter Tiles (iPad) or Keyboard */}
        {inputMode === 'tiles' ? (
          <div className="space-y-4">
            {/* Answer Letter Slots */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[54px] rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3">
              {Array.from({ length: Math.max(currentItem.word.length, pickedTileIndices.length) }).map(
                (_, slotIdx) => {
                  const pickedIdx = pickedTileIndices[slotIdx];
                  const ch = pickedIdx !== undefined ? tiles[pickedIdx] : '';
                  return (
                    <span
                      key={slotIdx}
                      className={`inline-flex h-11 w-9 sm:h-12 sm:w-10 items-center justify-center rounded-xl border-2 font-display text-xl font-extrabold uppercase ${
                        ch
                          ? 'border-[#1C1917] bg-[#FEF3C7] text-[#1C1917]'
                          : 'border-[#CBD5E1] bg-white text-[#94A3B8]'
                      }`}
                    >
                      {ch || '_'}
                    </span>
                  );
                },
              )}
            </div>

            {/* Tappable Letter Tiles */}
            <div className="flex flex-wrap justify-center gap-2">
              {tiles.map((ch, idx) => {
                const used = pickedTileIndices.includes(idx);
                return (
                  <button
                    key={`${roundIdx}-${idx}-${ch}`}
                    type="button"
                    disabled={used || Boolean(wrongFeedback) || Boolean(correctBanner)}
                    onClick={() => handleTapTile(idx)}
                    className={`qv-btn h-12 w-12 rounded-2xl border-2 font-display text-xl font-extrabold uppercase transition-all ${
                      used
                        ? 'border-[#E5DFD3] bg-[#F3EFE7] text-[#CBD5E1] opacity-40'
                        : 'border-[#1C1917] bg-white text-[#1C1917] shadow-[0_3px_0_#1C1917]'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={pickedTileIndices.length === 0 || Boolean(wrongFeedback)}
                onClick={handleUndoTile}
                className="qv-btn inline-flex min-h-[42px] items-center gap-1 rounded-xl border-2 border-[#E5DFD3] bg-[#FAF8F4] px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
              >
                <Delete className="h-4 w-4" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                disabled={pickedTileIndices.length === 0 || Boolean(wrongFeedback)}
                onClick={handleClearTiles}
                className="qv-btn inline-flex min-h-[42px] items-center gap-1 rounded-xl border-2 border-[#E5DFD3] bg-[#FAF8F4] px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear</span>
              </button>
              <button
                type="button"
                disabled={!currentAnswer || Boolean(wrongFeedback) || Boolean(correctBanner)}
                onClick={handleSubmitSpelling}
                className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-6 py-2 font-display text-sm sm:text-base font-extrabold text-white disabled:opacity-50"
                style={{ borderBottomColor: '#065F46' }}
              >
                <span>Check Spelling</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={Boolean(wrongFeedback) || Boolean(correctBanner)}
              value={typedText}
              onChange={(e) => setTypedText(e.target.value.replace(/[^a-zA-Z]/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitSpelling();
              }}
              placeholder="Type the word here..."
              aria-label="Type spelling answer"
              className="w-full rounded-2xl border-3 border-[#1C1917] bg-[#FAF8F4] px-4 py-3.5 text-center font-display text-2xl font-extrabold tracking-widest text-[#1C1917] focus:bg-white focus:outline-none"
            />
            <button
              type="button"
              disabled={!currentAnswer || Boolean(wrongFeedback) || Boolean(correctBanner)}
              onClick={handleSubmitSpelling}
              className="qv-arcade-btn w-full min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#059669] font-display text-base font-extrabold text-white disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              style={{ borderBottomColor: '#065F46' }}
            >
              <span>Check Spelling</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Correct Banner */}
        {correctBanner && (
          <div className="rounded-2xl border-2 border-[#10B981] bg-[#ECFDF5] p-3.5 text-center font-display text-base font-extrabold text-[#047857]">
            {correctBanner}
          </div>
        )}

        {/* Wrong Feedback Mastery Queue Lock */}
        {wrongFeedback && (
          <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 space-y-3">
            <div className="space-y-1">
              <p className="font-display text-sm font-extrabold text-[#B45309]">
                Almost! You spelled “<span className="line-through text-[#DC2626]">{wrongFeedback.attempt}</span>” → Correct spelling:{' '}
                <span className="text-lg text-[#047857] tracking-wide">{currentItem.word}</span>
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#57534E]">
                💡 Tip ({currentItem.trickyPart}): {currentItem.memoryTip}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGotItAfterWrong}
              className="qv-btn w-full sm:w-auto min-h-[44px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 text-sm font-extrabold text-white inline-flex items-center justify-center gap-1.5"
            >
              <span>Got It, Practice Again Later</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Dna,
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
  buildEnglishRootBuilderQuestions,
  buildEnglishRootSprintQuestions,
  calculateEnglishRootRunTokens,
  type EnglishRootBuilderQuestion,
  type EnglishRootSprintQuestion,
} from '../../subjects/english/rootEngine';
import type { EnglishRootFamily, EnglishRootItem } from '../../subjects/english/rootsGrammarTypes';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { BLOOKET_CHOICE_PALETTE as CHOICE_STYLES } from '../theme/choicePalette';

export interface EnglishRootCompletionPayload {
  familyId: string;
  familyTitle: string;
  tier: EnglishRootFamily['tier'];
  tokensEarned: number;
  rawTokensEarned: number;
  accuracyPct: number;
  wordOutcomes: { word: string; firstTryCorrect: boolean }[];
}

interface EnglishRootQuestViewProps {
  family: EnglishRootFamily;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onComplete: (payload: EnglishRootCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

export const EnglishRootQuestView: React.FC<EnglishRootQuestViewProps> = ({
  family,
  equippedCollectibleId,
  isAvatarShiny = false,
  rewardPolicy,
  onComplete,
  onExit,
  onGoToMarket,
}) => {
  const [lockedPolicy, setLockedPolicy] = useState<QuestRewardPolicy | undefined>(
    () => rewardPolicy,
  );
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [stage, setStage] = useState<'learn' | 'build' | 'sprint' | 'summary'>('learn');
  const [learnIdx, setLearnIdx] = useState(0);

  // Stage 1: Root Block Builder
  const [buildQueue, setBuildQueue] = useState<EnglishRootBuilderQuestion[]>(() =>
    buildEnglishRootBuilderQuestions(family),
  );
  const [buildBanner, setBuildBanner] = useState<string | null>(null);
  const [buildWrong, setBuildWrong] = useState<{ chosenId: string } | null>(null);
  const [buildMissed, setBuildMissed] = useState<Record<string, boolean>>({});
  const [buildFirstTry, setBuildFirstTry] = useState(0);

  // Stage 2: Same-Family Context Sprint
  const [sprintQueue, setSprintQueue] = useState<EnglishRootSprintQuestion[]>(() =>
    buildEnglishRootSprintQuestions(family),
  );
  const [sprintBanner, setSprintBanner] = useState<string | null>(null);
  const [sprintWrong, setSprintWrong] = useState<{ chosenWord: string } | null>(null);
  const [sprintMissed, setSprintMissed] = useState<Record<string, boolean>>({});
  const [sprintFirstTry, setSprintFirstTry] = useState(0);

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
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // Ignore sandbox speech errors
      }
    };
  }, [clearTimer]);

  const currentLearn = family.items[learnIdx] ?? family.items[0];
  const currentBuild = buildQueue[0] ?? null;
  const currentSprint = sprintQueue[0] ?? null;
  const totalUniqueQs = family.items.length * 2;
  const buildDone = Math.max(0, family.items.length - buildQueue.length);
  const sprintDone = Math.max(0, family.items.length - sprintQueue.length);

  const finishRun = useCallback(
    (bRight: number, sRight: number, missedMap: Record<string, boolean>) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const totalRight = bRight + sRight;
      const rawTokens = calculateEnglishRootRunTokens(totalUniqueQs, totalRight);
      const awarded = applyQuestRewardMultiplier(rawTokens, policyMult);
      const accuracyPct = Math.round((totalRight / Math.max(1, totalUniqueQs)) * 100);
      setFinalAwardedTokens(awarded);
      setFinalAccuracy(accuracyPct);
      audioService.playChest();
      onComplete({
        familyId: family.id,
        familyTitle: family.title,
        tier: family.tier,
        tokensEarned: awarded,
        rawTokensEarned: rawTokens,
        accuracyPct,
        wordOutcomes: family.items.map((it) => ({
          word: it.word,
          firstTryCorrect: !missedMap[it.word],
        })),
      });
      setStage('summary');
    },
    [family.id, family.items, family.tier, family.title, onComplete, policyMult, totalUniqueQs],
  );

  const advanceBuildAfterWrong = useCallback(() => {
    if (advancingRef.current || !currentBuild) return;
    advancingRef.current = true;
    clearTimer();
    setBuildWrong(null);
    setBuildBanner(null);
    setBuildQueue((prev) => (prev.length <= 1 ? prev : [...prev.slice(1), prev[0]]));
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [clearTimer, currentBuild]);

  const handlePickBuild = useCallback(
    (choiceId: string) => {
      if (stage !== 'build' || !currentBuild || answeringRef.current || buildWrong) return;
      answeringRef.current = true;
      const picked = currentBuild.choices.find((c) => c.id === choiceId);
      if (!picked) {
        answeringRef.current = false;
        return;
      }

      if (picked.isCorrect) {
        audioService.playCorrect(3);
        const alreadyMissed = Boolean(buildMissed[currentBuild.item.word]);
        const nextRight = alreadyMissed ? buildFirstTry : buildFirstTry + 1;
        if (!alreadyMissed) setBuildFirstTry(nextRight);
        setBuildBanner(`✅ ${currentBuild.item.word} — ${currentBuild.item.formula}`);
        const isLast = buildQueue.length <= 1;
        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;
          setBuildBanner(null);
          if (isLast) {
            setBuildQueue([]);
            setStage('sprint');
          } else {
            setBuildQueue((prev) => prev.slice(1));
          }
          answeringRef.current = false;
        }, 760);
      } else {
        audioService.playNudge();
        setBuildMissed((prev) => ({ ...prev, [currentBuild.item.word]: true }));
        setBuildWrong({ chosenId: choiceId });
      }
    },
    [buildFirstTry, buildMissed, buildQueue.length, buildWrong, currentBuild, stage],
  );

  const advanceSprintAfterWrong = useCallback(() => {
    if (advancingRef.current || !currentSprint) return;
    advancingRef.current = true;
    clearTimer();
    setSprintWrong(null);
    setSprintBanner(null);
    setSprintQueue((prev) => (prev.length <= 1 ? prev : [...prev.slice(1), prev[0]]));
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [clearTimer, currentSprint]);

  const handlePickSprint = useCallback(
    (word: string) => {
      if (stage !== 'sprint' || !currentSprint || answeringRef.current || sprintWrong) return;
      answeringRef.current = true;
      const picked = currentSprint.choices.find((c) => c.word === word);
      if (!picked) {
        answeringRef.current = false;
        return;
      }

      if (picked.isCorrect) {
        audioService.playCorrect(4);
        const alreadyMissed = Boolean(sprintMissed[currentSprint.item.word]);
        const nextRight = alreadyMissed ? sprintFirstTry : sprintFirstTry + 1;
        if (!alreadyMissed) setSprintFirstTry(nextRight);
        setSprintBanner(`✅ ${currentSprint.item.word}: ${currentSprint.item.meaning}`);
        const isLast = sprintQueue.length <= 1;
        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;
          setSprintBanner(null);
          if (isLast) {
            setSprintQueue([]);
            finishRun(buildFirstTry, nextRight, { ...buildMissed, ...sprintMissed });
          } else {
            setSprintQueue((prev) => prev.slice(1));
            answeringRef.current = false;
          }
        }, 760);
      } else {
        audioService.playNudge();
        setSprintMissed((prev) => ({ ...prev, [currentSprint.item.word]: true }));
        setSprintWrong({ chosenWord: word });
      }
    },
    [
      buildFirstTry,
      buildMissed,
      currentSprint,
      finishRun,
      sprintFirstTry,
      sprintMissed,
      sprintQueue.length,
      sprintWrong,
      stage,
    ],
  );

  const handleRestart = () => {
    clearTimer();
    completedRef.current = false;
    answeringRef.current = false;
    advancingRef.current = false;
    setLockedPolicy(rewardPolicy);
    setLearnIdx(0);
    setBuildQueue(buildEnglishRootBuilderQuestions(family));
    setBuildBanner(null);
    setBuildWrong(null);
    setBuildMissed({});
    setBuildFirstTry(0);
    setSprintQueue(buildEnglishRootSprintQuestions(family));
    setSprintBanner(null);
    setSprintWrong(null);
    setSprintMissed({});
    setSprintFirstTry(0);
    setStage('learn');
  };

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
        if (idx >= 0 && currentBuild?.choices[idx]) {
          e.preventDefault();
          handlePickBuild(currentBuild.choices[idx].id);
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
        if (idx >= 0 && currentSprint?.choices[idx]) {
          e.preventDefault();
          handlePickSprint(currentSprint.choices[idx].word);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    advanceBuildAfterWrong,
    advanceSprintAfterWrong,
    buildWrong,
    currentBuild,
    currentSprint,
    handlePickBuild,
    handlePickSprint,
    sprintWrong,
    stage,
  ]);

  const renderBlocks = (item: EnglishRootItem, hideBase: boolean = false) => {
    const morphChip = (
      <span className="rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-4 py-2 font-display text-xl sm:text-2xl font-extrabold text-white shadow-xs">
        {item.morpheme}
      </span>
    );
    const baseChip = (
      <span
        className={`rounded-2xl border-2 px-4 py-2 font-display text-xl sm:text-2xl font-extrabold shadow-xs ${
          hideBase
            ? 'border-dashed border-[#DB2777] bg-[#FDF2F8] text-[#BE185D]'
            : 'border-[#1C1917] bg-[#DB2777] text-white'
        }`}
      >
        {hideBase ? '???' : item.basePart}
      </span>
    );
    return (
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {item.order === 'morpheme-first' ? (
          <>
            {morphChip}
            <span className="font-display text-2xl font-extrabold text-[#78716C]">+</span>
            {baseChip}
          </>
        ) : (
          <>
            {baseChip}
            <span className="font-display text-2xl font-extrabold text-[#78716C]">+</span>
            {morphChip}
          </>
        )}
      </div>
    );
  };

  const stageLabel =
    stage === 'learn'
      ? `Step 1/3 · Decode (${learnIdx + 1}/${family.items.length})`
      : stage === 'build'
        ? `Step 2/3 · Build (${buildDone}/${family.items.length})`
        : stage === 'sprint'
          ? `Step 3/3 · Context Sprint (${sprintDone}/${family.items.length})`
          : 'Lab Complete!';

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
            <span>Exit</span>
          </button>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold text-white"
            style={{ backgroundColor: family.accentHex }}
          >
            <Dna className="h-3.5 w-3.5" />
            <span>{family.title}</span>
          </span>
        </div>

        <span className="rounded-full bg-[#F3EFE7] px-3 py-1 text-xs font-extrabold text-[#57534E] tabular-nums">
          {stageLabel}
        </span>
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang="en" />

      {/* STAGE 0: MORPHEME COLOR-BLOCK DECODE */}
      {stage === 'learn' && currentLearn && (
        <section className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5 text-center">
          <div className="flex items-center justify-between gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-extrabold"
              style={{ backgroundColor: family.bgHex, color: family.accentHex }}
            >
              {family.morpheme} = “{family.morphemeMeaning}”
            </span>
            <button
              type="button"
              onClick={() => audioService.speak(`${currentLearn.word}. ${currentLearn.exampleSentence}`, 'en-US')}
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#EFF6FF] px-3 py-1.5 text-xs font-extrabold text-[#1D4ED8]"
            >
              <Volume2 className="h-4 w-4" />
              <span>Listen</span>
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF7F2] p-5 space-y-4">
            {renderBlocks(currentLearn, false)}
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#1C1917]">
              = {currentLearn.word}
            </div>
            <p className="text-sm sm:text-base font-extrabold text-[#2563EB]">
              {currentLearn.formula}
            </p>
            <p className="text-sm font-bold text-[#44403C]">{currentLearn.meaning}</p>
            <p className="rounded-xl bg-white border border-[#E5DFD3] px-4 py-2.5 text-sm font-semibold text-[#57534E]">
              “{currentLearn.exampleSentence}”
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {family.items.map((it, idx) => (
                <span
                  key={it.word}
                  className={`h-2.5 w-6 rounded-full ${
                    idx <= learnIdx ? 'bg-[#2563EB]' : 'bg-[#E5DFD3]'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                audioService.playToken();
                if (learnIdx + 1 < family.items.length) {
                  setLearnIdx(learnIdx + 1);
                } else {
                  setStage('build');
                }
              }}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-6 py-2.5 font-display text-sm sm:text-base font-extrabold text-white"
              style={{ borderBottomColor: '#1E3A8A' }}
            >
              <span>{learnIdx + 1 < family.items.length ? 'Next Word' : 'Start Block Builder!'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 1: ROOT BLOCK BUILDER */}
      {stage === 'build' && currentBuild && (
        <section className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5 text-center">
          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF7F2] p-5 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#57534E]">
              Pick the missing piece to match this meaning
            </div>
            {renderBlocks(currentBuild.item, !buildBanner && !buildWrong)}
            <p className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917]">
              “{currentBuild.item.meaning}”
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentBuild.choices.map((ch, idx) => {
              const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isWrong = buildWrong?.chosenId === ch.id;
              const isRightReveal = Boolean(buildWrong || buildBanner) && ch.isCorrect;
              return (
                <button
                  key={ch.id}
                  type="button"
                  disabled={Boolean(buildWrong || buildBanner)}
                  onClick={() => handlePickBuild(ch.id)}
                  className={`qv-arcade-btn min-h-[72px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 font-display text-lg sm:text-xl font-extrabold text-white ${
                    isWrong ? 'opacity-45 scale-95' : isRightReveal ? 'ring-4 ring-[#FDE047]' : ''
                  }`}
                  style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-black/20 text-xs">
                      {st.shape}
                    </span>
                    <span>{ch.basePart}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {buildBanner && (
            <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-3 text-sm font-extrabold text-[#065F46]">
              {buildBanner}
            </div>
          )}

          {buildWrong && (
            <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div>
                <div className="text-xs font-extrabold text-[#B45309]">
                  Lock it in! (This word will come back once more)
                </div>
                <p className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                  {currentBuild.item.word}: {currentBuild.item.formula}
                </p>
              </div>
              <button
                type="button"
                onClick={advanceBuildAfterWrong}
                className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              >
                <span>Got It, Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* STAGE 2: SAME-FAMILY CONTEXT SPRINT */}
      {stage === 'sprint' && currentSprint && (
        <section className="qv-surface rounded-3xl p-5 sm:p-7 space-y-5 text-center">
          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF7F2] p-5 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#57534E]">
              Choose the best {family.morpheme} word for this sentence
            </div>
            <p className="font-display text-lg sm:text-2xl font-extrabold leading-relaxed text-[#1C1917]">
              {currentSprint.item.sprintSentence.split('___')[0]}
              <span className="mx-1 inline-block rounded-xl border-2 border-dashed border-[#2563EB] bg-[#EFF6FF] px-3 py-0.5 text-[#1D4ED8]">
                {sprintBanner || sprintWrong ? currentSprint.item.word : '_____'}
              </span>
              {currentSprint.item.sprintSentence.split('___').slice(1).join('___')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentSprint.choices.map((ch, idx) => {
              const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isWrong = sprintWrong?.chosenWord === ch.word;
              const isRightReveal = Boolean(sprintWrong || sprintBanner) && ch.isCorrect;
              return (
                <button
                  key={`${currentSprint.id}-${ch.word}`}
                  type="button"
                  disabled={Boolean(sprintWrong || sprintBanner)}
                  onClick={() => handlePickSprint(ch.word)}
                  className={`qv-arcade-btn min-h-[72px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 font-display text-lg sm:text-xl font-extrabold text-white ${
                    isWrong ? 'opacity-45 scale-95' : isRightReveal ? 'ring-4 ring-[#FDE047]' : ''
                  }`}
                  style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-black/20 text-xs">
                      {st.shape}
                    </span>
                    <span>{ch.word}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {sprintBanner && (
            <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-3 text-sm font-extrabold text-[#065F46]">
              {sprintBanner}
            </div>
          )}

          {sprintWrong && (
            <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div>
                <div className="text-xs font-extrabold text-[#B45309]">
                  Check the clue! (We’ll practice this word once more)
                </div>
                <p className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                  Answer: <strong>{currentSprint.item.word}</strong> — {currentSprint.item.meaning}
                </p>
              </div>
              <button
                type="button"
                onClick={advanceSprintAfterWrong}
                className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              >
                <span>Got It, Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* VICTORY SCREEN */}
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
              🎉 {family.title} Mastered!
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              {policyMult === 0
                ? 'Practice Mode Complete! Try a new Root Lab for 100% Tokens!'
                : `You decoded all 5 “${family.morpheme}” words!`}
            </p>
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
              <div className="text-xs font-bold text-[#92400E]">Tokens Earned</div>
              <div className="mt-0.5 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#1C1917] tabular-nums">
                <Coins className="h-5 w-5 text-[#D97706]" />+{finalAwardedTokens}
              </div>
            </div>
            <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-3.5">
              <div className="text-xs font-bold text-[#047857]">First-Try Accuracy</div>
              <div className="mt-0.5 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#047857] tabular-nums">
                <CheckCircle2 className="h-5 w-5" />
                {finalAccuracy}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            {family.items.map((it) => (
              <div
                key={it.word}
                className="rounded-2xl border border-[#E5DFD3] bg-[#FAF7F2] px-3.5 py-2.5 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-display text-sm font-extrabold text-[#1C1917]">
                    {it.word}
                  </div>
                  <div className="text-xs font-semibold text-[#57534E] truncate">{it.formula}</div>
                </div>
                <button
                  type="button"
                  onClick={() => audioService.speak(it.word, 'en-US')}
                  aria-label={`Speak ${it.word}`}
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
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-2.5 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#1E3A8A' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Practice Again</span>
            </button>
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
              style={{ borderBottomColor: '#D97706' }}
            >
              <ShoppingBag className="h-4 w-4 text-[#D97706]" />
              <span>Open Packs!</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border border-[#E5DFD3] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#57534E]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Back to Quests</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

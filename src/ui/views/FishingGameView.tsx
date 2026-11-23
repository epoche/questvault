import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Fish,
  Flame,
  RotateCcw,
  Scale,
  ShoppingBag,
  Sparkles,
  Trophy,
  Volume2,
  Waves,
  X,
} from 'lucide-react';
import { type ArcadeQuestion, generateArcadeQuestion } from '../../core/arcadeQuestions';
import { audioService } from '../../core/audio';
import { ARCADE_DAILY_TOKEN_CAP } from '../../core/economy';
import {
  calculateFishingRawTokens,
  createInitialFishingState,
  FISHING_TOTAL_CASTS,
  getLureFrenzyMultiplier,
  resolveFishingCast,
  type FishingCatchRecord,
  type FishingGameState,
} from '../../core/fishingEngine';
import { RARITY_CONFIGS } from '../../core/packs';
import type { DifficultyTier, SubjectId } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { FishingArt } from '../artwork/FishingArt';
import { MathVisual } from '../artwork/MathVisual';
import { RubyWord } from '../components/RubyWord';

export interface FishingCompletionPayload {
  subjectId: SubjectId;
  totalLbs: number;
  correctCount: number;
  attemptsCount: number;
  bestStreak: number;
  rawTokensEarned: number;
}

interface FishingGameViewProps {
  subjectId: SubjectId;
  activeTier: DifficultyTier;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  vault: Record<string, number>;
  shinyVault?: Record<string, boolean>;
  favoriteCollectibleIds?: string[];
  highScoreLbs: number;
  arcadeTokensEarnedToday: number;
  showZhuyin: boolean;
  onToggleZhuyin: () => void;
  onCompleteFishing: (
    payload: FishingCompletionPayload,
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

export const FishingGameView: React.FC<FishingGameViewProps> = ({
  subjectId,
  activeTier,
  equippedCollectibleId,
  isAvatarShiny = false,
  vault,
  shinyVault = {},
  favoriteCollectibleIds = [],
  highScoreLbs,
  arcadeTokensEarnedToday,
  showZhuyin,
  onToggleZhuyin,
  onCompleteFishing,
  onExit,
  onGoToMarket,
}) => {
  const isZh = subjectId === 'chinese';

  const [phase, setPhase] = useState<'ready' | 'playing' | 'summary'>('ready');
  const [game, setGame] = useState<FishingGameState>(() => createInitialFishingState());
  const [question, setQuestion] = useState<ArcadeQuestion>(() =>
    generateArcadeQuestion(subjectId, activeTier, 0),
  );
  const [catchReveal, setCatchReveal] = useState<FishingCatchRecord | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosen: string } | null>(null);
  const [awardResult, setAwardResult] = useState<{
    tokensAwarded: number;
    remainingDailyCap: number;
    isNewBest: boolean;
  } | null>(null);

  const gameRef = useRef<FishingGameState>(game);
  gameRef.current = game;
  const seqRef = useRef(1);
  const settledRef = useRef(false);
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const revealTimerRef = useRef<number | null>(null);

  const clearPendingTimer = useCallback(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
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

  const finalizeTrip = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    answeringRef.current = false;
    clearPendingTimer();

    const snap = gameRef.current;
    const rawTokens = calculateFishingRawTokens(snap);
    const res = onCompleteFishing({
      subjectId,
      totalLbs: snap.totalLbs,
      correctCount: snap.correctAnswers,
      attemptsCount: snap.attemptsCount,
      bestStreak: snap.bestStreak,
      rawTokensEarned: rawTokens,
    });
    setAwardResult({
      tokensAwarded: res.tokensAwarded,
      remainingDailyCap: res.remainingDailyCap,
      isNewBest: snap.totalLbs > highScoreLbs && snap.totalLbs > 0,
    });
    if (res.tokensAwarded > 0) {
      audioService.playChest();
    }
    setPhase('summary');
  }, [clearPendingTimer, highScoreLbs, onCompleteFishing, subjectId]);

  const startNewTrip = () => {
    clearPendingTimer();
    settledRef.current = false;
    answeringRef.current = false;
    advancingRef.current = false;
    const fresh = createInitialFishingState();
    gameRef.current = fresh;
    setGame(fresh);
    seqRef.current = 1;
    setQuestion(generateArcadeQuestion(subjectId, activeTier, 1));
    setCatchReveal(null);
    setWrongFeedback(null);
    setAwardResult(null);
    setPhase('playing');
    audioService.playToken();
  };

  const advanceToNextCast = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    clearPendingTimer();
    setCatchReveal(null);
    setWrongFeedback(null);

    if (gameRef.current.castsUsed >= gameRef.current.totalCasts) {
      finalizeTrip();
      window.setTimeout(() => {
        advancingRef.current = false;
      }, 0);
      return;
    }

    const nextSeq = seqRef.current + 1;
    seqRef.current = nextSeq;
    setQuestion(generateArcadeQuestion(subjectId, activeTier, nextSeq));
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [activeTier, clearPendingTimer, finalizeTrip, subjectId]);

  const handlePickChoice = useCallback(
    (label: string) => {
      if (phase !== 'playing' || answeringRef.current || wrongFeedback || catchReveal) return;
      answeringRef.current = true;

      const isCorrect = label === question.correctAnswer;
      const res = resolveFishingCast(
        gameRef.current,
        isCorrect,
        vault,
        shinyVault,
        favoriteCollectibleIds,
      );
      gameRef.current = res.state;
      setGame(res.state);

      if (isCorrect && res.catchRecord) {
        if (
          res.catchRecord.rarity === 'epic' ||
          res.catchRecord.rarity === 'legendary' ||
          res.catchRecord.rarity === 'chroma'
        ) {
          audioService.playChest();
        } else {
          audioService.playCorrect(res.state.streak);
        }
        setCatchReveal(res.catchRecord);
        revealTimerRef.current = window.setTimeout(() => {
          revealTimerRef.current = null;
          advanceToNextCast();
        }, 1250);
      } else {
        audioService.playNudge();
        setWrongFeedback({ chosen: label });
      }
    },
    [
      advanceToNextCast,
      catchReveal,
      favoriteCollectibleIds,
      phase,
      question.correctAnswer,
      shinyVault,
      vault,
      wrongFeedback,
    ],
  );

  // Keyboard shortcuts during Fishing casts
  useEffect(() => {
    if (phase !== 'playing') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (wrongFeedback || catchReveal) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceToNextCast();
        }
        return;
      }
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx >= 0 && question.choices[idx]) {
        e.preventDefault();
        handlePickChoice(question.choices[idx].label);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advanceToNextCast, catchReveal, handlePickChoice, phase, question.choices, wrongFeedback]);

  const remainingCapBefore = Math.max(0, ARCADE_DAILY_TOKEN_CAP - arcadeTokensEarnedToday);
  const subjectLabel =
    subjectId === 'english' ? 'English' : subjectId === 'math' ? 'Math' : '中文・繁體';
  const frenzyMult = getLureFrenzyMultiplier(game.streak);
  const bestCatch =
    game.catches.length > 0
      ? game.catches.reduce((best, cur) => (cur.lbs > best.lbs ? cur : best), game.catches[0])
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Top Bar */}
      <div className="qv-surface rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (phase === 'playing' && game.castsUsed > 0) {
                finalizeTrip();
              } else {
                onExit();
              }
            }}
            className="qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white px-3 py-1.5 text-xs font-extrabold text-[#57534E]"
          >
            <X className="h-3.5 w-3.5" />
            <span>
              {phase === 'playing'
                ? isZh
                  ? '提前收竿'
                  : 'End Trip'
                : isZh
                  ? '離開'
                  : 'Exit'}
            </span>
          </button>

          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFEFF] border border-[#67E8F9] px-2.5 py-1 text-xs font-extrabold text-[#0E7490]">
            <Fish className="h-3.5 w-3.5" />
            <span>{isZh ? '星海釣魚' : 'Star Sea Fishing'} · {subjectLabel}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isZh && (
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
          )}

          {phase === 'playing' && (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] border border-[#93C5FD] px-2.5 py-1 text-xs font-extrabold text-[#1D4ED8] tabular-nums">
                <Waves className="h-3.5 w-3.5" />
                {isZh
                  ? `第 ${Math.min(game.castsUsed + 1, game.totalCasts)}/${game.totalCasts} 竿`
                  : `Cast ${Math.min(game.castsUsed + 1, game.totalCasts)}/${game.totalCasts}`}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-2.5 py-1 text-xs font-extrabold text-[#92400E] tabular-nums">
                <Scale className="h-3.5 w-3.5 text-[#D97706]" />
                {game.totalLbs.toLocaleString()} lbs
              </span>
              {frenzyMult > 1 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF2F8] border border-[#F472B6] px-2.5 py-1 text-xs font-extrabold text-[#BE185D] tabular-nums">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  {frenzyMult}× {isZh ? '狂熱魚餌' : 'FRENZY'}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* ═══════════ READY SCREEN ═══════════ */}
      {phase === 'ready' && (
        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5 bg-gradient-to-b from-[#F0F9FF] to-white">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <CollectibleArt
                id={equippedCollectibleId}
                size={88}
                shiny={isAvatarShiny}
                className="border-2 border-[#1C1917] shadow-sm"
              />
              <FishingArt
                speciesId="celestial-whale"
                size={88}
                className="border-2 border-[#1C1917] shadow-sm"
              />
            </div>

            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {isZh ? '🎣 星海釣魚大賽（Fishing Frenzy）' : '🎣 Star Sea Fishing Frenzy!'}
            </h1>
            <p className="max-w-lg text-sm font-semibold text-[#57534E]">
              {isZh
                ? '答對題目就拉竿起魚！連勝 3 題以上觸發「狂熱魚餌」1.5×～2× 重量加倍，還有機會釣到傳說星海神龍與你的盲盒夥伴驚喜客串喔！'
                : 'Answer fast to reel in rare Star Sea creatures! Hit a 3+ streak for 1.5×–2× Lure Frenzy weight bonuses, plus surprise Vault Buddy cameos!'}
            </p>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-[#ECFEFF] border border-[#A5F3FC] p-3">
              <div className="text-[11px] font-bold text-[#0E7490]">{isZh ? '每局竿數' : 'Casts'}</div>
              <div className="font-display text-lg font-extrabold text-[#1C1917] tabular-nums">
                {FISHING_TOTAL_CASTS}
              </div>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3">
              <div className="text-[11px] font-bold text-[#92400E]">{isZh ? '最高總重' : 'Best Haul'}</div>
              <div className="font-display text-lg font-extrabold text-[#1C1917] tabular-nums">
                {highScoreLbs.toLocaleString()} lbs
              </div>
            </div>
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
              <div className="text-[11px] font-bold text-[#047857]">{isZh ? '今日街機額度' : 'Arcade Cap'}</div>
              <div className="font-display text-lg font-extrabold text-[#1C1917] tabular-nums">
                {arcadeTokensEarnedToday}/{ARCADE_DAILY_TOKEN_CAP}
              </div>
            </div>
          </div>

          {remainingCapBefore === 0 && (
            <p className="text-xs font-bold text-[#B45309]">
              {isZh
                ? `今日街機代幣額度（${ARCADE_DAILY_TOKEN_CAP}）已領滿！還是可以下竿挑戰傳說級巨鯨刷新紀錄喔！`
                : `Daily Arcade Token cap (${ARCADE_DAILY_TOKEN_CAP}) reached today — you can still fish to beat your Best Haul!`}
            </p>
          )}

          <button
            type="button"
            onClick={startNewTrip}
            className="qv-arcade-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#0891B2] px-8 py-3 font-display text-lg font-extrabold text-white"
            style={{ borderBottomColor: '#155E75' }}
          >
            <Fish className="h-5 w-5" />
            <span>
              {isZh
                ? `下竿出發！（${FISHING_TOTAL_CASTS} 竿）`
                : `Cast Line! (${FISHING_TOTAL_CASTS} Casts)`}
            </span>
          </button>
        </section>
      )}

      {/* ═══════════ PLAYING SCREEN ═══════════ */}
      {phase === 'playing' && (
        <div className="space-y-4">
          {/* Catch Reveal Spotlight OR Question Stage */}
          {catchReveal ? (
            <section
              className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-4 border-2 border-[#1C1917]"
              style={{ backgroundColor: catchReveal.bgHex }}
            >
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#1C1917] bg-white px-3 py-1 text-xs font-extrabold">
                <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
                <span style={{ color: RARITY_CONFIGS[catchReveal.rarity].colorHex }}>
                  {RARITY_CONFIGS[catchReveal.rarity].label.toUpperCase()}
                </span>
                {catchReveal.frenzyMultiplier > 1 && (
                  <span className="text-[#BE185D]">· {catchReveal.frenzyMultiplier}× FRENZY!</span>
                )}
              </div>

              <div className="flex justify-center">
                {catchReveal.kind === 'cameo' && catchReveal.collectibleId ? (
                  <CollectibleArt
                    id={catchReveal.collectibleId}
                    size={112}
                    shiny={catchReveal.isShinyCameo}
                    className="border-2 border-[#1C1917] shadow-md"
                  />
                ) : (
                  <FishingArt
                    speciesId={catchReveal.speciesId ?? 'star-clownfish'}
                    size={112}
                    className="border-2 border-[#1C1917] shadow-md"
                  />
                )}
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
                  {isZh ? catchReveal.nameZh : catchReveal.nameEn}
                </h2>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white border-2 border-[#1C1917] px-4 py-1 font-display text-lg font-extrabold text-[#0E7490] tabular-nums">
                  <Scale className="h-4 w-4" />+{catchReveal.lbs.toLocaleString()} lbs!
                </div>
              </div>

              <button
                type="button"
                onClick={advanceToNextCast}
                className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-6 py-2 font-display text-sm font-extrabold text-white"
              >
                <span>
                  {game.castsUsed >= game.totalCasts
                    ? isZh
                      ? '看總漁獲結算！'
                      : 'See Final Haul!'
                    : isZh
                      ? '繼續下一竿 →'
                      : 'Next Cast →'}
                </span>
              </button>
            </section>
          ) : (
            <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] p-4 sm:p-5 space-y-3 text-center">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white border border-[#BAE6FD] px-2.5 py-0.5 text-xs font-extrabold text-[#0369A1]">
                    {isZh ? '答對立刻收線起魚！' : 'Answer to Reel In!'}
                  </span>
                  {question.speakText && question.speakLang && (
                    <button
                      type="button"
                      onClick={() => audioService.speak(question.speakText!, question.speakLang!)}
                      aria-label="Read question aloud"
                      className="qv-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#BAE6FD] bg-white text-[#0284C7]"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] leading-snug">
                  {question.prompt}
                </p>
                {question.subHint && (
                  <p className="text-xs sm:text-sm font-semibold text-[#57534E]">
                    {question.subHint}
                  </p>
                )}
                {question.visual && (!question.revealVisualOnFeedback || Boolean(wrongFeedback)) && (
                  <div className="pt-1">
                    <MathVisual spec={question.visual} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.choices.map((ch, idx) => {
                  const style = CHOICE_STYLES[idx % CHOICE_STYLES.length];
                  const isCorrectChoice = ch.label === question.correctAnswer;
                  const isWrongPicked = wrongFeedback?.chosen === ch.label;
                  const dimmed = Boolean(wrongFeedback) && !isCorrectChoice && !isWrongPicked;

                  return (
                    <button
                      key={`${ch.label}-${idx}`}
                      type="button"
                      disabled={Boolean(wrongFeedback)}
                      onClick={() => handlePickChoice(ch.label)}
                      className={`qv-arcade-btn qv-tile min-h-[64px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 text-white flex items-center justify-between gap-2 transition-opacity ${
                        dimmed ? 'opacity-40' : 'opacity-100'
                      } ${
                        wrongFeedback && isCorrectChoice ? 'ring-4 ring-[#10B981]' : ''
                      } ${isWrongPicked ? 'ring-4 ring-[#1C1917]' : ''}`}
                      style={{ backgroundColor: style.bg, borderBottomColor: style.border }}
                    >
                      <span className="inline-flex items-center gap-2.5 text-left">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                          {style.shape}
                        </span>
                        {isZh && ch.zhuyin ? (
                          <RubyWord
                            word={ch.label}
                            zhuyin={ch.zhuyin}
                            showZhuyin={showZhuyin}
                            className="font-display text-lg sm:text-xl font-extrabold text-white"
                            zhuyinClassName="text-white/95"
                          />
                        ) : (
                          <span className="font-display text-base sm:text-lg font-extrabold">
                            {ch.label}
                          </span>
                        )}
                      </span>
                      <span className="hidden sm:inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/20 text-[11px] font-extrabold">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {wrongFeedback && (
                <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 text-left">
                    <div className="text-xs font-extrabold text-[#B45309]">
                      {isZh ? '哎呀，魚兒溜走了！看看正確答案：' : 'Splash! The fish got away — check the answer:'}
                    </div>
                    <p className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                      {question.explanation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={advanceToNextCast}
                    className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
                  >
                    <span>
                      {game.castsUsed >= game.totalCasts
                        ? isZh
                          ? '看總結'
                          : 'Summary'
                        : isZh
                          ? '繼續下一竿'
                          : 'Next Cast'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Live Catch Bucket */}
          {game.catches.length > 0 && (
            <section className="qv-surface rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#57534E]">
                <span>{isZh ? `本次魚簍（${game.catches.length} 隻）` : `Catch Bucket (${game.catches.length})`}</span>
                <span className="tabular-nums text-[#0E7490]">{game.totalLbs.toLocaleString()} lbs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {game.catches.map((c) => (
                  <div
                    key={c.uid}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] px-2.5 py-1.5 text-xs font-extrabold text-[#1C1917]"
                  >
                    {c.kind === 'cameo' && c.collectibleId ? (
                      <CollectibleArt id={c.collectibleId} size={26} shiny={c.isShinyCameo} />
                    ) : (
                      <FishingArt speciesId={c.speciesId ?? 'star-clownfish'} size={26} />
                    )}
                    <span className="truncate max-w-[110px]">{isZh ? c.nameZh : c.nameEn}</span>
                    <span className="text-[#0E7490] tabular-nums">{c.lbs}lb</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ═══════════ SUMMARY SCREEN ═══════════ */}
      {phase === 'summary' && awardResult && (
        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#ECFEFF]">
              <Trophy className="h-8 w-8 text-[#0891B2]" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {isZh ? '🎣 滿載而歸！星海釣魚結算' : '🎣 Fishing Trip Complete!'}
            </h1>
            {awardResult.isNewBest && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-0.5 text-xs font-extrabold text-[#B45309]">
                <Sparkles className="h-3.5 w-3.5" />
                {isZh ? '刷新最高總重量紀錄！' : 'NEW BEST HAUL!'}
              </span>
            )}
          </div>

          <div className="mx-auto grid max-w-lg grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-2xl bg-[#ECFEFF] border border-[#A5F3FC] p-3">
              <div className="text-[11px] font-bold text-[#0E7490]">{isZh ? '總漁獲重量' : 'Total Haul'}</div>
              <div className="font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                {game.totalLbs.toLocaleString()} lbs
              </div>
            </div>
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
              <div className="text-[11px] font-bold text-[#047857]">{isZh ? '答對題數' : 'Quiz Right'}</div>
              <div className="font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                {game.correctAnswers}/{game.attemptsCount}
              </div>
            </div>
            <div className="rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] p-3">
              <div className="text-[11px] font-bold text-[#C2410C]">{isZh ? '最高連勝' : 'Best Streak'}</div>
              <div className="font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                {game.bestStreak}×
              </div>
            </div>
            <div className="rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] p-3">
              <div className="text-[11px] font-bold text-[#BE185D]">{isZh ? '獲得代幣' : 'Tokens Won'}</div>
              <div className="font-display text-xl font-extrabold text-[#BE185D] tabular-nums">
                +{awardResult.tokensAwarded}
              </div>
            </div>
          </div>

          {bestCatch && (
            <div className="mx-auto max-w-sm rounded-2xl border-2 border-[#1C1917] bg-[#FAF7F2] p-3.5 flex items-center justify-center gap-3">
              {bestCatch.kind === 'cameo' && bestCatch.collectibleId ? (
                <CollectibleArt id={bestCatch.collectibleId} size={52} shiny={bestCatch.isShinyCameo} />
              ) : (
                <FishingArt speciesId={bestCatch.speciesId ?? 'star-clownfish'} size={52} />
              )}
              <div className="text-left">
                <div className="text-[11px] font-extrabold text-[#0E7490]">
                  {isZh ? '🏆 本趟最大漁獲' : '🏆 Biggest Catch'}
                </div>
                <div className="font-display text-base font-extrabold text-[#1C1917]">
                  {isZh ? bestCatch.nameZh : bestCatch.nameEn}
                </div>
                <div className="text-xs font-extrabold text-[#B45309] tabular-nums">
                  {bestCatch.lbs.toLocaleString()} lbs
                </div>
              </div>
            </div>
          )}

          <p className="text-xs font-bold text-[#57534E] tabular-nums">
            {isZh
              ? `今日剩餘街機代幣額度：${awardResult.remainingDailyCap} / ${ARCADE_DAILY_TOKEN_CAP}`
              : `Remaining Daily Arcade Token Cap: ${awardResult.remainingDailyCap} / ${ARCADE_DAILY_TOKEN_CAP}`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={startNewTrip}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#0891B2] px-5 py-2.5 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#155E75' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isZh ? '再釣一趟' : 'Fish Again'}</span>
            </button>
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
              style={{ borderBottomColor: '#D97706' }}
            >
              <ShoppingBag className="h-4 w-4 text-[#D97706]" />
              <span>{isZh ? '去抽盲盒！' : 'Open Packs!'}</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border border-[#E5DFD3] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#57534E]"
            >
              <span>{isZh ? '回到關卡' : 'Back to Quests'}</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

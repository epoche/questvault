import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Coins,
  Flame,
  Lock,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  Trophy,
  TrendingUp,
  UtensilsCrossed,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { type ArcadeQuestion, generateArcadeQuestion } from '../../core/arcadeQuestions';
import { audioService } from '../../core/audio';
import {
  CAFE_DURATION_SEC,
  CAFE_MAX_LEVEL,
  CAFE_MENU,
  calculateCafeRawTokens,
  createInitialCafeState,
  getFoodPrice,
  getFoodUpgradeCost,
  restockFromAnswer,
  serveCustomerAtSeat,
  tickCafeSecond,
  upgradeOrUnlockMenuItem,
  type CafeFoodId,
  type CafeGameState,
} from '../../core/cafeEngine';
import { ARCADE_DAILY_TOKEN_CAP } from '../../core/economy';
import type { DifficultyTier, SubjectId } from '../../core/types';
import { CafeFoodArt } from '../artwork/CafeFoodArt';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { MathVisual } from '../artwork/MathVisual';
import { RubyWord } from '../components/RubyWord';
import { BLOOKET_CHOICE_PALETTE as CHOICE_STYLES } from '../theme/choicePalette';

export interface CafeCompletionPayload {
  subjectId: SubjectId;
  coinsScore: number;
  servedCount: number;
  correctCount: number;
  attemptsCount: number;
  bestStreak: number;
  rawTokensEarned: number;
}

interface CafeGameViewProps {
  subjectId: SubjectId;
  activeTier: DifficultyTier;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  vault: Record<string, number>;
  shinyVault?: Record<string, boolean>;
  favoriteCollectibleIds?: string[];
  highScore: number;
  arcadeTokensEarnedToday: number;
  showZhuyin: boolean;
  onToggleZhuyin: () => void;
  onCompleteCafe: (
    payload: CafeCompletionPayload,
  ) => { tokensAwarded: number; remainingDailyCap: number };
  onExit: () => void;
  onGoToMarket: () => void;
}

function formatClock(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const CafeGameView: React.FC<CafeGameViewProps> = ({
  subjectId,
  activeTier,
  equippedCollectibleId,
  isAvatarShiny = false,
  vault,
  shinyVault = {},
  favoriteCollectibleIds = [],
  highScore,
  arcadeTokensEarnedToday,
  showZhuyin,
  onToggleZhuyin,
  onCompleteCafe,
  onExit,
  onGoToMarket,
}) => {
  const isZh = subjectId === 'chinese';

  const [phase, setPhase] = useState<'ready' | 'playing' | 'summary'>('ready');
  const [mode, setMode] = useState<'counter' | 'quiz'>('counter');
  const [cafe, setCafe] = useState<CafeGameState>(() =>
    createInitialCafeState(vault, shinyVault, favoriteCollectibleIds, equippedCollectibleId),
  );
  const seqRef = useRef(1);
  const [question, setQuestion] = useState<ArcadeQuestion>(() =>
    generateArcadeQuestion(subjectId, activeTier, 0),
  );
  const [wrongFeedback, setWrongFeedback] = useState<{ chosen: string } | null>(null);
  const [correctBanner, setCorrectBanner] = useState<string | null>(null);
  const [counterToast, setCounterToast] = useState<string | null>(null);
  const [endedEarly, setEndedEarly] = useState(false);

  const [awardResult, setAwardResult] = useState<{
    tokensAwarded: number;
    remainingDailyCap: number;
    isNewBest: boolean;
  } | null>(null);

  const cafeRef = useRef<CafeGameState>(cafe);
  cafeRef.current = cafe;
  const settledRef = useRef(false);
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setCounterToast(msg);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setCounterToast(null);
      toastTimerRef.current = null;
    }, 1500);
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) window.clearTimeout(advanceTimerRef.current);
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // Ignore sandbox speech errors
      }
    };
  }, []);

  const finalizeShift = useCallback(
    (early = false) => {
      if (settledRef.current) return;
      settledRef.current = true;
      answeringRef.current = false;
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      setEndedEarly(early);
      const snap = cafeRef.current;
      const rawTokens = calculateCafeRawTokens(snap);
      const res = onCompleteCafe({
        subjectId,
        coinsScore: snap.totalEarnedCoins,
        servedCount: snap.servedCount,
        correctCount: snap.correctAnswers,
        attemptsCount: snap.attemptsCount,
        bestStreak: snap.bestStreak,
        rawTokensEarned: rawTokens,
      });
      setAwardResult({
        tokensAwarded: res.tokensAwarded,
        remainingDailyCap: res.remainingDailyCap,
        isNewBest: snap.totalEarnedCoins > highScore && snap.totalEarnedCoins > 0,
      });
      if (res.tokensAwarded > 0) {
        audioService.playChest();
      }
      setPhase('summary');
    },
    [highScore, onCompleteCafe, subjectId],
  );

  // Shift clock & customer patience tick — pauses cleanly while answering Restock Quiz or reading wrong explanation!
  useEffect(() => {
    if (phase !== 'playing' || mode === 'quiz' || wrongFeedback) return;
    const timer = window.setInterval(() => {
      const next = tickCafeSecond(
        cafeRef.current,
        vault,
        shinyVault,
        favoriteCollectibleIds,
        equippedCollectibleId,
      );
      cafeRef.current = next;
      setCafe(next);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, mode, wrongFeedback, vault, shinyVault, favoriteCollectibleIds, equippedCollectibleId]);

  useEffect(() => {
    if (phase === 'playing' && cafe.secondsLeft <= 0) {
      finalizeShift(false);
    }
  }, [phase, cafe.secondsLeft, finalizeShift]);

  const startNewShift = () => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    settledRef.current = false;
    answeringRef.current = false;
    const fresh = createInitialCafeState(
      vault,
      shinyVault,
      favoriteCollectibleIds,
      equippedCollectibleId,
    );
    cafeRef.current = fresh;
    setCafe(fresh);
    seqRef.current = 1;
    setQuestion(generateArcadeQuestion(subjectId, activeTier, 1));
    setMode('counter');
    setWrongFeedback(null);
    setCorrectBanner(null);
    setCounterToast(null);
    setEndedEarly(false);
    setAwardResult(null);
    setPhase('playing');
    audioService.playToken();
  };

  const handleServeSeat = (seatIndex: number) => {
    if (phase !== 'playing' || mode !== 'counter') return;
    const res = serveCustomerAtSeat(
      cafeRef.current,
      seatIndex,
      vault,
      shinyVault,
      favoriteCollectibleIds,
      equippedCollectibleId,
    );
    if (!res.ok) {
      audioService.playNudge();
      showToast(isZh ? '食材不夠！點下方「答題補貨」喔！' : 'Out of stock! Tap Answer Quiz to Restock!');
      return;
    }
    cafeRef.current = res.state;
    setCafe(res.state);
    if (res.customerCompleted) {
      audioService.playCorrect(3);
      showToast(
        isZh
          ? `+$${res.coinsEarned} 小費！${res.wasVip ? '⭐ VIP 滿意離開！' : '顧客超滿意！'}`
          : `+$${res.coinsEarned} Coins! ${res.wasVip ? '⭐ VIP Happy!' : 'Order Complete!'}`,
      );
    } else {
      audioService.playToken();
      showToast(isZh ? `已上菜 +$${res.coinsEarned}！` : `Served +$${res.coinsEarned}!`);
    }
  };

  const handleUpgradeDish = (foodId: CafeFoodId) => {
    if (phase !== 'playing' || mode !== 'counter') return;
    const res = upgradeOrUnlockMenuItem(cafeRef.current, foodId);
    if (!res.ok) return;
    cafeRef.current = res.state;
    setCafe(res.state);
    audioService.playChest();
    const spec = CAFE_MENU.find((m) => m.id === foodId)!;
    const dishName = isZh ? spec.nameZh : spec.nameEn;
    showToast(
      res.unlockedNew
        ? isZh
          ? `🎉 解鎖新甜點「${dishName}」並附贈 2 份！`
          : `🎉 Unlocked ${dishName} (+2 free stock)!`
        : isZh
          ? `⬆️ ${dishName} 升到 Lv.${res.newLevel}！`
          : `⬆️ ${dishName} upgraded to Lv.${res.newLevel}!`,
    );
  };

  const loadNextQuizQuestion = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    const nextSeq = seqRef.current + 1;
    seqRef.current = nextSeq;
    setQuestion(generateArcadeQuestion(subjectId, activeTier, nextSeq));
    setWrongFeedback(null);
    setCorrectBanner(null);
    answeringRef.current = false;
    window.setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [activeTier, subjectId]);

  const handlePickQuizChoice = useCallback(
    (label: string) => {
      if (phase !== 'playing' || mode !== 'quiz' || answeringRef.current || wrongFeedback) return;
      answeringRef.current = true;

      const isCorrect = label === question.correctAnswer;
      const res = restockFromAnswer(cafeRef.current, isCorrect);
      cafeRef.current = res.state;
      setCafe(res.state);

      if (isCorrect) {
        audioService.playCorrect(res.state.streak);
        const names = res.restockedItems
          .map((fid) => {
            const sp = CAFE_MENU.find((m) => m.id === fid);
            return isZh ? sp?.nameZh : sp?.nameEn;
          })
          .filter(Boolean)
          .join(' + ');
        setCorrectBanner(
          isZh
            ? `✅ 補貨成功！+${res.restockedItems.length} 份（${names}）`
            : `✅ Restocked +${res.restockedItems.length}! (${names})`,
        );
        advanceTimerRef.current = window.setTimeout(() => {
          advanceTimerRef.current = null;
          loadNextQuizQuestion();
        }, 620);
      } else {
        audioService.playNudge();
        setWrongFeedback({ chosen: label });
      }
    },
    [isZh, loadNextQuizQuestion, mode, phase, question.correctAnswer, wrongFeedback],
  );

  // Keyboard shortcuts during Restock Quiz
  useEffect(() => {
    if (phase !== 'playing' || mode !== 'quiz') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (wrongFeedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          loadNextQuizQuestion();
        }
        return;
      }
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx >= 0 && question.choices[idx]) {
        e.preventDefault();
        handlePickQuizChoice(question.choices[idx].label);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePickQuizChoice, loadNextQuizQuestion, mode, phase, question.choices, wrongFeedback]);

  const remainingCapBefore = Math.max(0, ARCADE_DAILY_TOKEN_CAP - arcadeTokensEarnedToday);
  const subjectLabel =
    subjectId === 'english' ? 'English' : subjectId === 'math' ? 'Math' : '中文・繁體';
  const totalStock = Object.values(cafe.stock).reduce((sum, n) => sum + n, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Top Bar */}
      <div className="qv-surface rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (phase === 'playing' && (cafe.correctAnswers > 0 || cafe.servedCount > 0)) {
                finalizeShift(true);
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
                  ? '提前打烊'
                  : 'End Shift'
                : isZh
                  ? '離開'
                  : 'Exit'}
            </span>
          </button>

          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FDBA74] px-2.5 py-1 text-xs font-extrabold text-[#C2410C]">
            <ChefHat className="h-3.5 w-3.5" />
            <span>{isZh ? 'Boba Café 盲盒小店' : 'Boba Café'} · {subjectLabel}</span>
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
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-2.5 py-1 text-xs font-extrabold text-[#92400E] tabular-nums">
                <Coins className="h-3.5 w-3.5 text-[#D97706]" />
                ${cafe.cafeCoins}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#6EE7B7] px-2.5 py-1 text-xs font-extrabold text-[#047857] tabular-nums">
                <UtensilsCrossed className="h-3.5 w-3.5 text-[#059669]" />
                <span>{cafe.servedCount}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-1 font-display text-xs sm:text-sm font-extrabold tabular-nums ${
                  cafe.secondsLeft <= 20
                    ? 'border-[#DC2626] bg-[#FEE2E2] text-[#B91C1C]'
                    : 'border-[#1C1917] bg-[#FFFBEB] text-[#1C1917]'
                }`}
              >
                <Timer className="h-3.5 w-3.5" />
                {formatClock(cafe.secondsLeft)}
                {mode === 'quiz' && (
                  <span className="text-[10px] font-bold text-[#7C3AED]">
                    ({isZh ? '暫停中' : 'PAUSED'})
                  </span>
                )}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ═══════════ READY SCREEN ═══════════ */}
      {phase === 'ready' && (
        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <CollectibleArt
                id={equippedCollectibleId}
                size={96}
                shiny={isAvatarShiny}
                className="border-2 border-[#1C1917] shadow-sm"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#1C1917] bg-[#FEF3C7] px-2.5 py-0.5 text-[11px] font-extrabold text-[#92400E]">
                {isZh ? '店長出動！' : 'Café Chef!'}
              </span>
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {isZh ? '🧋 Boba Café 盲盒甜品小店' : '🧋 Boba Café Dash!'}
            </h1>
            <p className="max-w-lg text-sm font-semibold text-[#57534E]">
              {isZh
                ? '答題幫廚房補貨、點擊幫排隊的盲盒顧客上菜！你的「最愛 6 格展示架」夥伴會變身 VIP 貴賓，多給 +25% 小費喔！'
                : 'Answer quick questions to restock boba & desserts, serve your collectible Vault guests, and upgrade your menu! Favorite Shelf buddies visit as +25% VIPs!'}
            </p>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-3">
              <div className="text-[11px] font-bold text-[#92400E]">{isZh ? '營業時限' : 'Shift Time'}</div>
              <div className="font-display text-lg font-extrabold text-[#1C1917] tabular-nums">
                {formatClock(CAFE_DURATION_SEC)}
              </div>
            </div>
            <div className="rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] p-3">
              <div className="text-[11px] font-bold text-[#6D28D9]">{isZh ? '最高營業額' : 'Best Coins'}</div>
              <div className="font-display text-lg font-extrabold text-[#1C1917] tabular-nums">
                ${highScore}
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
                ? `今日街機代幣額度（${ARCADE_DAILY_TOKEN_CAP}）已領滿！還是可以繼續開店刷新最高營業額喔！`
                : `Daily Arcade Token cap (${ARCADE_DAILY_TOKEN_CAP}) reached today — you can still play to beat your High Score!`}
            </p>
          )}

          <button
            type="button"
            onClick={startNewShift}
            className="qv-arcade-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#EA580C] px-8 py-3 font-display text-lg font-extrabold text-white"
            style={{ borderBottomColor: '#9A3412' }}
          >
            <ChefHat className="h-5 w-5" />
            <span>{isZh ? '開張營業！（2 分鐘）' : 'Open Café! (2 Min)'}</span>
          </button>
        </section>
      )}

      {/* ═══════════ PLAYING: COUNTER MODE ═══════════ */}
      {phase === 'playing' && mode === 'counter' && (
        <div className="space-y-4">
          {counterToast && (
            <div className="rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-4 py-2 text-center font-display text-sm font-extrabold text-[#92400E] shadow-xs">
              {counterToast}
            </div>
          )}

          {/* Customer Counter Stage (3 Collectible Guests) */}
          <section className="qv-surface rounded-3xl p-4 sm:p-5 space-y-3 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EE]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CollectibleArt
                  id={equippedCollectibleId}
                  size={34}
                  shiny={isAvatarShiny}
                  className="border border-[#1C1917]"
                />
                <h2 className="font-display text-base sm:text-lg font-extrabold text-[#1C1917]">
                  {isZh ? '櫃檯點餐區（點擊上菜！）' : 'Café Counter — Tap to Serve!'}
                </h2>
              </div>
              <span className="rounded-full bg-[#F3EFE7] px-3 py-1 text-xs font-extrabold text-[#57534E] tabular-nums">
                {isZh ? `廚房存貨：${totalStock} 份` : `Kitchen Stock: ${totalStock}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cafe.customers.map((cust) => {
                const patiencePct = Math.max(0, Math.min(100, Math.round((cust.patience / cust.maxPatience) * 100)));
                const nextServeableFood = cust.order.find((f) => cafe.stock[f] > 0);
                const canServeNow = Boolean(nextServeableFood);
                const barColor =
                  patiencePct > 50 ? '#10B981' : patiencePct > 25 ? '#F59E0B' : '#EF4444';

                return (
                  <div
                    key={cust.uid}
                    className={`rounded-2xl border-2 p-3.5 flex flex-col items-center justify-between gap-2.5 text-center transition-colors ${
                      cust.isVip
                        ? 'border-[#F59E0B] bg-[#FFFDF5]'
                        : 'border-[#E5DFD3] bg-white'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between gap-1 text-[11px] font-extrabold">
                      <span className="truncate text-[#1C1917]">{cust.name}</span>
                      {cust.isVip && (
                        <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] text-[#B45309]">
                          <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                          VIP +25%
                        </span>
                      )}
                    </div>

                    {/* Guest Collectible Avatar */}
                    <CollectibleArt id={cust.collectibleId} size={74} shiny={cust.isShiny} />

                    {/* Patience Bar */}
                    <div className="w-full h-2 rounded-full bg-[#ECE7DC] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${patiencePct}%`, backgroundColor: barColor }}
                      />
                    </div>

                    {/* Order Speech Bubble */}
                    <div className="w-full rounded-xl bg-[#FAF7F2] border border-[#E5DFD3] px-2.5 py-2 flex items-center justify-center gap-2 flex-wrap">
                      {cust.order.map((fid, idx) => {
                        const spec = CAFE_MENU.find((m) => m.id === fid)!;
                        const hasStock = cafe.stock[fid] > 0;
                        return (
                          <div
                            key={`${fid}-${idx}`}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-extrabold ${
                              hasStock
                                ? 'border-[#10B981] bg-[#ECFDF5] text-[#047857]'
                                : 'border-[#E5DFD3] bg-white text-[#78716C]'
                            }`}
                          >
                            <CafeFoodArt foodId={fid} size={24} />
                            <span>{isZh ? spec.nameZh : spec.nameEn.split(' ').slice(-1)[0]}</span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleServeSeat(cust.seatIndex)}
                      className={`qv-arcade-btn inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2 font-display text-sm font-extrabold ${
                        canServeNow
                          ? 'border-[#1C1917] bg-[#059669] text-white'
                          : 'border-[#D8D0C1] bg-[#F3EFE7] text-[#78716C]'
                      }`}
                      style={canServeNow ? { borderBottomColor: '#065F46' } : undefined}
                    >
                      <span>
                        {canServeNow
                          ? isZh
                            ? '上菜！'
                            : 'Serve Dish!'
                          : isZh
                            ? '缺貨（去補貨）'
                            : 'Need Stock'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Big Restock CTA */}
          <button
            type="button"
            onClick={() => {
              setWrongFeedback(null);
              setCorrectBanner(null);
              answeringRef.current = false;
              setMode('quiz');
            }}
            className="qv-arcade-btn flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-6 py-3.5 font-display text-base sm:text-lg font-extrabold text-white"
            style={{ borderBottomColor: '#1E3A8A' }}
          >
            <Zap className="h-5 w-5 fill-current" />
            <span>
              {isZh
                ? '答題補貨！（答對 +2～3 份餐點，答題時顧客耐心暫停）'
                : 'Answer Quiz to Restock! (+2–3 Dishes · Timer Pauses)'}
            </span>
          </button>

          {/* Kitchen Stock & Menu Upgrade Shop */}
          <section className="qv-surface rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-[#7C3AED]" />
                <h3 className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                  {isZh ? '廚房庫存與菜單升級（用 Café 小費升級單價！）' : 'Kitchen Stock & Menu Upgrades'}
                </h3>
              </div>
              <span className="font-display text-xs sm:text-sm font-extrabold text-[#B45309] tabular-nums">
                💰 ${cafe.cafeCoins}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CAFE_MENU.map((item) => {
                const lvl = cafe.menuLevels[item.id];
                const unlocked = lvl > 0;
                const stock = cafe.stock[item.id];
                const price = getFoodPrice(item.id, lvl);
                const upgradeCost = getFoodUpgradeCost(item.id, lvl);
                const canAffordUpgrade = upgradeCost !== null && cafe.cafeCoins >= upgradeCost;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border-2 p-3 flex flex-col justify-between gap-2 ${
                      unlocked ? 'border-[#E5DFD3] bg-white' : 'border-dashed border-[#D8D0C1] bg-[#F7F4ED]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CafeFoodArt foodId={item.id} size={38} className={unlocked ? '' : 'opacity-45'} />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate font-display text-xs sm:text-sm font-extrabold text-[#1C1917]">
                          {isZh ? item.nameZh : item.nameEn}
                        </div>
                        {unlocked ? (
                          <div className="flex items-center gap-1.5 text-[11px] font-extrabold tabular-nums">
                            <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[#92400E]">
                              Lv.{lvl} · ${price}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.5 ${
                                stock > 0
                                  ? 'bg-[#ECFDF5] text-[#047857]'
                                  : 'bg-[#FEE2E2] text-[#B91C1C]'
                              }`}
                            >
                              ×{stock}
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#78716C]">
                            <Lock className="h-3 w-3" />
                            <span>{isZh ? '尚未解鎖' : 'Locked'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {upgradeCost !== null ? (
                      <button
                        type="button"
                        disabled={!canAffordUpgrade}
                        onClick={() => handleUpgradeDish(item.id)}
                        className={`qv-btn min-h-[34px] w-full rounded-xl border px-2.5 py-1 text-xs font-extrabold tabular-nums ${
                          canAffordUpgrade
                            ? 'border-[#1C1917] bg-[#7C3AED] text-white'
                            : 'border-[#DDD5C7] bg-[#EFECE4] text-[#9A948A] cursor-not-allowed'
                        }`}
                      >
                        {unlocked
                          ? isZh
                            ? `升級 Lv.${lvl + 1} ($${upgradeCost})`
                            : `Lv.${lvl + 1} ($${upgradeCost})`
                          : isZh
                            ? `解鎖菜單 ($${upgradeCost})`
                            : `Unlock ($${upgradeCost})`}
                      </button>
                    ) : (
                      <div className="rounded-xl bg-[#FEF3C7] py-1 text-center text-[11px] font-extrabold text-[#B45309]">
                        ★ MAX Lv.{CAFE_MAX_LEVEL}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ═══════════ PLAYING: RESTOCK QUIZ MODE ═══════════ */}
      {phase === 'playing' && mode === 'quiz' && (
        <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                const wasAnsweredOrRevealed =
                  answeringRef.current ||
                  Boolean(wrongFeedback) ||
                  Boolean(correctBanner) ||
                  advanceTimerRef.current !== null;
                if (advanceTimerRef.current !== null) {
                  window.clearTimeout(advanceTimerRef.current);
                  advanceTimerRef.current = null;
                }
                if (wasAnsweredOrRevealed) {
                  const nextSeq = seqRef.current + 1;
                  seqRef.current = nextSeq;
                  setQuestion(generateArcadeQuestion(subjectId, activeTier, nextSeq));
                }
                setWrongFeedback(null);
                setCorrectBanner(null);
                answeringRef.current = false;
                setMode('counter');
              }}
              className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#FEF3C7] px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-[#92400E]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isZh ? `回櫃檯上菜（存貨 ${totalStock} 份）` : `Back to Counter (${totalStock} Stock)`}</span>
            </button>

            <div className="flex items-center gap-2">
              {cafe.streak >= 2 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FDBA74] px-2.5 py-1 text-xs font-extrabold text-[#C2410C] tabular-nums">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  {cafe.streak}×
                </span>
              )}
              {question.speakText && question.speakLang && (
                <button
                  type="button"
                  onClick={() => audioService.speak(question.speakText!, question.speakLang!)}
                  aria-label="Read question aloud"
                  className="qv-btn inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DFD3] bg-white text-[#2563EB]"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {correctBanner && (
            <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-2 text-center font-display text-sm font-extrabold text-[#047857]">
              {correctBanner}
            </div>
          )}

          {/* Question Card */}
          <div className="rounded-2xl border border-[#E7E2D8] bg-[#FAF7F2] p-4 sm:p-5 space-y-3 text-center">
            <p className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] leading-snug">
              {question.prompt}
            </p>
            {question.subHint && (
              <p className="text-xs sm:text-sm font-semibold text-[#57534E]">{question.subHint}</p>
            )}
            {question.visual && (!question.revealVisualOnFeedback || Boolean(wrongFeedback)) && (
              <div className="pt-1">
                <MathVisual spec={question.visual} />
              </div>
            )}
          </div>

          {/* 4 Blooket-Style Answer Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.choices.map((ch, idx) => {
              const style = CHOICE_STYLES[idx % CHOICE_STYLES.length];
              const isCorrectChoice = ch.label === question.correctAnswer;
              const isWrongPicked = wrongFeedback?.chosen === ch.label;
              let bg = style.bg;
              let border = style.border;
              let opacity = 1;
              if (wrongFeedback) {
                if (isCorrectChoice) {
                  bg = '#059669';
                  border = '#065F46';
                } else if (isWrongPicked) {
                  bg = '#E11D48';
                  border = '#9F1239';
                } else {
                  opacity = 0.4;
                }
              }

              return (
                <button
                  key={`${question.id}-${ch.label}`}
                  type="button"
                  disabled={Boolean(wrongFeedback) || Boolean(correctBanner)}
                  onClick={() => handlePickQuizChoice(ch.label)}
                  className="qv-arcade-btn qv-tile flex min-h-[60px] items-center justify-between gap-2 rounded-2xl border-2 border-[#1C1917] px-4 py-3 text-left font-display text-base sm:text-lg font-extrabold text-white transition-opacity"
                  style={{ backgroundColor: bg, borderBottomColor: border, opacity }}
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/20 text-xs">
                      {style.shape}
                    </span>
                    {isZh && ch.zhuyin ? (
                      <RubyWord
                        word={ch.label}
                        zhuyin={ch.zhuyin}
                        showZhuyin={showZhuyin}
                        zhuyinClassName="text-white/90"
                      />
                    ) : (
                      <span>{ch.label}</span>
                    )}
                  </span>
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/20 text-xs tabular-nums">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {wrongFeedback && (
            <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm font-bold text-[#78350F]">
                <span className="font-extrabold text-[#B45309]">
                  {isZh ? '沒關係！看清楚解析：' : 'Nice try! '}
                </span>
                {question.explanation}
              </div>
              <button
                type="button"
                onClick={loadNextQuizQuestion}
                className="qv-arcade-btn inline-flex shrink-0 min-h-[42px] items-center justify-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-4 py-2 font-display text-sm font-extrabold text-white"
              >
                <span>{isZh ? '懂了，下一題' : 'Got It, Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* ═══════════ SUMMARY SCREEN ═══════════ */}
      {phase === 'summary' && (
        <section className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] text-[#D97706]">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {endedEarly
                ? isZh
                  ? '🧋 小店提前打烊結算！'
                  : '🧋 Café Shift Wrapped Up!'
                : isZh
                  ? '🎉 Boba Café 營業大成功！'
                  : '🎉 Boba Café Shift Complete!'}
            </h1>
            {awardResult?.isNewBest && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309]">
                <Sparkles className="h-3.5 w-3.5" />
                {isZh ? '刷新最高營業額紀錄！' : 'NEW HIGH SCORE!'}
              </span>
            )}
          </div>

          <div className="mx-auto grid max-w-lg grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-3">
              <div className="text-[11px] font-bold text-[#92400E]">{isZh ? '總營業額' : 'Café Coins'}</div>
              <div className="font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                ${cafe.totalEarnedCoins}
              </div>
            </div>
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
              <div className="text-[11px] font-bold text-[#047857]">{isZh ? '服務顧客' : 'Served'}</div>
              <div className="font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                {cafe.servedCount}
              </div>
            </div>
            <div className="rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] p-3">
              <div className="text-[11px] font-bold text-[#1D4ED8]">{isZh ? '補貨答對' : 'Quiz Right'}</div>
              <div className="font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                {cafe.correctAnswers}/{cafe.attemptsCount}
              </div>
            </div>
            <div className="rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] p-3">
              <div className="text-[11px] font-bold text-[#BE185D]">{isZh ? '獲得代幣' : 'Tokens Won'}</div>
              <div className="font-display text-xl font-extrabold text-[#DB2777] tabular-nums">
                +{awardResult?.tokensAwarded ?? 0}
              </div>
            </div>
          </div>

          <p className="text-xs font-bold text-[#57534E]">
            {isZh
              ? `今日剩餘街機代幣額度：${awardResult?.remainingDailyCap ?? 0} / ${ARCADE_DAILY_TOKEN_CAP}`
              : `Remaining Daily Arcade Token Cap: ${awardResult?.remainingDailyCap ?? 0} / ${ARCADE_DAILY_TOKEN_CAP}`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={startNewShift}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#EA580C] px-5 py-2.5 font-display text-base font-extrabold text-white"
              style={{ borderBottomColor: '#9A3412' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isZh ? '再開一局' : 'Play Again'}</span>
            </button>
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-5 py-2.5 font-display text-base font-extrabold text-[#92400E]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{isZh ? '去抽盲盒！' : 'Open Packs!'}</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[46px] items-center gap-2 rounded-2xl border border-[#E5DFD3] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#57534E]"
            >
              <span>{isZh ? '回首頁' : 'Back to Quests'}</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

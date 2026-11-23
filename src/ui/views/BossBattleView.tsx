import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Flame,
  RotateCcw,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Swords,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { type ArcadeQuestion, generateArcadeQuestion } from '../../core/arcadeQuestions';
import { audioService } from '../../core/audio';
import {
  BOSS_ROSTER,
  type BossDefinition,
  calculateBossAttackDamage,
  calculateBossVictoryTokens,
  getDefaultBossForTier,
  resolveDefaultBossSquad,
} from '../../core/bossBattleEngine';
import { ARCADE_DAILY_TOKEN_CAP } from '../../core/economy';
import { getCollectibleById } from '../../core/packs';
import type { DifficultyTier, SubjectId } from '../../core/types';
import { BossArt } from '../artwork/BossArt';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { MathVisual } from '../artwork/MathVisual';
import { RubyWord } from '../components/RubyWord';

export interface BossBattleCompletionPayload {
  subjectId: SubjectId;
  bossId: BossDefinition['id'];
  score: number;
  correctCount: number;
  attemptsCount: number;
  bestStreak: number;
  rawTokensEarned: number;
}

interface BossBattleViewProps {
  subjectId: SubjectId;
  activeTier: DifficultyTier;
  vault: Record<string, number>;
  shinyVault?: Record<string, boolean>;
  favoriteCollectibleIds?: string[];
  highScore: number;
  arcadeTokensEarnedToday: number;
  showZhuyin: boolean;
  onToggleZhuyin: () => void;
  onCompleteBossBattle: (
    payload: BossBattleCompletionPayload,
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

export const BossBattleView: React.FC<BossBattleViewProps> = ({
  subjectId,
  activeTier,
  vault,
  shinyVault = {},
  favoriteCollectibleIds = [],
  highScore,
  arcadeTokensEarnedToday,
  showZhuyin,
  onToggleZhuyin,
  onCompleteBossBattle,
  onExit,
  onGoToMarket,
}) => {
  const isZh = subjectId === 'chinese';
  const ownedIds = useMemo(
    () => Object.entries(vault).filter(([id, count]) => count > 0 && Boolean(getCollectibleById(id))).map(([id]) => id),
    [vault],
  );

  const [phase, setPhase] = useState<'ready' | 'playing' | 'summary'>('ready');
  const [selectedBossId, setSelectedBossId] = useState<BossDefinition['id']>(
    () => getDefaultBossForTier(activeTier).id,
  );
  const [squadIds, setSquadIds] = useState<string[]>(() =>
    resolveDefaultBossSquad(vault, favoriteCollectibleIds),
  );
  const [editingSquadSlot, setEditingSquadSlot] = useState<number | null>(null);

  const activeBoss = useMemo(
    () => BOSS_ROSTER.find((b) => b.id === selectedBossId) ?? BOSS_ROSTER[0],
    [selectedBossId],
  );

  const shinySquadCount = useMemo(
    () => squadIds.filter((id) => Boolean(shinyVault[id]) && (vault[id] ?? 0) > 0).length,
    [squadIds, shinyVault, vault],
  );

  const [bossHp, setBossHp] = useState<number>(() => activeBoss.maxHp);
  const [combo, setCombo] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [totalDamage, setTotalDamage] = useState(0);
  const [question, setQuestion] = useState<ArcadeQuestion>(() =>
    generateArcadeQuestion(subjectId, activeTier, 0),
  );
  const [hitBanner, setHitBanner] = useState<{
    damage: number;
    isUltimate: boolean;
    shinyBonus: number;
  } | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<{ chosen: string } | null>(null);
  const [awardResult, setAwardResult] = useState<{
    tokensAwarded: number;
    remainingDailyCap: number;
    score: number;
    isNewBest: boolean;
  } | null>(null);

  const seqRef = useRef(1);
  const settledRef = useRef(false);
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const hitTimerRef = useRef<number | null>(null);

  const clearPendingTimer = useCallback(() => {
    if (hitTimerRef.current !== null) {
      window.clearTimeout(hitTimerRef.current);
      hitTimerRef.current = null;
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

  const speakPrompt = useCallback((text?: string, lang?: 'en-US' | 'zh-TW') => {
    if (!text) return;
    audioService.speak(text, lang ?? 'en-US', lang === 'zh-TW' ? 0.9 : 0.94);
  }, []);

  const startBattle = () => {
    clearPendingTimer();
    settledRef.current = false;
    answeringRef.current = false;
    advancingRef.current = false;
    setEditingSquadSlot(null);
    setBossHp(activeBoss.maxHp);
    setCombo(0);
    setBestStreak(0);
    setCorrectCount(0);
    setAttemptsCount(0);
    setTotalDamage(0);
    setHitBanner(null);
    setWrongFeedback(null);
    setAwardResult(null);
    seqRef.current += 1;
    setQuestion(generateArcadeQuestion(subjectId, activeTier, seqRef.current));
    audioService.playToken();
    setPhase('playing');
  };

  const finishVictory = useCallback(
    (finalCorrect: number, finalAttempts: number, finalBestStreak: number, finalDamage: number) => {
      if (settledRef.current) return;
      settledRef.current = true;
      answeringRef.current = false;
      clearPendingTimer();

      const rawTokens = calculateBossVictoryTokens(activeBoss, finalCorrect, finalAttempts);
      const accuracyBonus = finalAttempts > 0 ? Math.round((finalCorrect / finalAttempts) * 100) : 100;
      const score = finalDamage + finalBestStreak * 20 + accuracyBonus;
      const res = onCompleteBossBattle({
        subjectId,
        bossId: activeBoss.id,
        score,
        correctCount: finalCorrect,
        attemptsCount: finalAttempts,
        bestStreak: finalBestStreak,
        rawTokensEarned: rawTokens,
      });
      setAwardResult({
        tokensAwarded: res.tokensAwarded,
        remainingDailyCap: res.remainingDailyCap,
        score,
        isNewBest: score > highScore && score > 0,
      });
      if (res.tokensAwarded > 0) {
        audioService.playChest();
      } else {
        audioService.playCorrect(3);
      }
      setPhase('summary');
    },
    [activeBoss, clearPendingTimer, highScore, onCompleteBossBattle, subjectId],
  );

  const loadNextQuestion = useCallback(() => {
    seqRef.current += 1;
    setQuestion(generateArcadeQuestion(subjectId, activeTier, seqRef.current));
    setHitBanner(null);
    setWrongFeedback(null);
    answeringRef.current = false;
    advancingRef.current = false;
  }, [activeTier, subjectId]);

  const handleAnswer = (choiceLabel: string) => {
    if (phase !== 'playing' || answeringRef.current || settledRef.current || wrongFeedback) return;
    answeringRef.current = true;

    const nextAttempts = attemptsCount + 1;
    setAttemptsCount(nextAttempts);

    if (choiceLabel === question.correctAnswer) {
      const nextCombo = combo + 1;
      const nextBest = Math.max(bestStreak, nextCombo);
      const nextCorrect = correctCount + 1;
      const strike = calculateBossAttackDamage(nextCombo, shinySquadCount);
      const nextHp = Math.max(0, bossHp - strike.damage);
      const nextTotalDamage = totalDamage + strike.damage;

      setCombo(nextCombo);
      setBestStreak(nextBest);
      setCorrectCount(nextCorrect);
      setBossHp(nextHp);
      setTotalDamage(nextTotalDamage);
      setHitBanner(strike);

      if (strike.isUltimate) {
        audioService.playChest();
      } else {
        audioService.playCorrect(nextCombo);
      }

      hitTimerRef.current = window.setTimeout(() => {
        if (nextHp <= 0) {
          finishVictory(nextCorrect, nextAttempts, nextBest, nextTotalDamage);
        } else {
          loadNextQuestion();
        }
      }, strike.isUltimate ? 850 : 620);
    } else {
      setCombo(0);
      setWrongFeedback({ chosen: choiceLabel });
      audioService.playNudge();
    }
  };

  const handleContinueAfterWrong = () => {
    if (advancingRef.current || !wrongFeedback) return;
    advancingRef.current = true;
    audioService.playToken();
    loadNextQuestion();
  };

  const handleReplaceSquadMember = (slotIndex: number, collectibleId: string) => {
    setSquadIds((prev) => {
      const next = [...prev];
      const existingIdx = next.indexOf(collectibleId);
      if (existingIdx !== -1 && existingIdx !== slotIndex) {
        next[existingIdx] = next[slotIndex];
      }
      next[slotIndex] = collectibleId;
      return next;
    });
    setEditingSquadSlot(null);
    audioService.playToken();
  };

  const remainingCap = Math.max(0, ARCADE_DAILY_TOKEN_CAP - arcadeTokensEarnedToday);
  const subjectLabel =
    subjectId === 'english' ? 'English ELA' : subjectId === 'math' ? 'Math' : '中文・繁體';
  const hpPercent = Math.max(0, Math.min(100, Math.round((bossHp / activeBoss.maxHp) * 100)));
  const chargePips = combo % 3;
  const ultimateLabel = hitBanner?.isUltimate
    ? 'MAX!'
    : chargePips === 2
      ? '2/3 · READY!'
      : `${chargePips}/3`;

  // Ready / Squad Setup screen
  if (phase === 'ready') {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3.5 py-2 text-sm font-extrabold text-[#57534E]"
          >
            <X className="h-4 w-4" />
            <span>Back</span>
          </button>
          <span className="rounded-full bg-[#FEF2F2] border border-[#FCA5A5] px-3 py-1 text-xs font-extrabold text-[#B91C1C]">
            ⚔️ {subjectLabel} · Tier {activeTier}
          </span>
        </div>

        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-5">
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309]">
              <Swords className="h-3.5 w-3.5" />
              Blooket-Style Squad Battle
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              ⚔️ Critter Boss Battle 夥伴打魔王
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              Answer questions to power up your 3-critter squad! Hit a <strong className="text-[#D97706]">3× Combo</strong> to unleash a <strong className="text-[#DC2626]">2× Team Ultimate</strong>!
            </p>
          </div>

          {/* Boss Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-extrabold text-[#1C1917]">
                1. Choose Your Boss 選擇大魔王
              </h2>
              <span className="text-xs font-bold text-[#78716C]">
                Best Score: <strong className="text-[#1C1917] tabular-nums">{highScore}</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BOSS_ROSTER.map((boss) => {
                const isSelected = boss.id === activeBoss.id;
                return (
                  <button
                    key={boss.id}
                    type="button"
                    onClick={() => {
                      setSelectedBossId(boss.id);
                      audioService.playToken();
                    }}
                    className={`qv-btn rounded-2xl border-2 p-2.5 text-center transition-all ${
                      isSelected
                        ? 'border-[#1C1917] shadow-[0_3px_0_#1C1917]'
                        : 'border-[#E5DFD3] bg-[#FAF8F4]'
                    }`}
                    style={isSelected ? { backgroundColor: boss.bgHex } : undefined}
                  >
                    <div className="mx-auto flex justify-center">
                      <BossArt bossId={boss.id} size={64} />
                    </div>
                    <p className="mt-1 font-display text-xs font-extrabold text-[#1C1917] leading-tight">
                      {boss.zhName}
                    </p>
                    <p className="text-[11px] font-bold" style={{ color: boss.accentHex }}>
                      {boss.maxHp} HP
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Critter Squad */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-sm font-extrabold text-[#1C1917]">
                2. Your 3-Critter Squad 出戰夥伴戰隊
              </h2>
              {shinySquadCount > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-2.5 py-0.5 text-[11px] font-extrabold text-[#B45309]">
                  <Sparkles className="h-3 w-3" />
                  Shiny Bonus: +{shinySquadCount * 4} ATK
                </span>
              ) : (
                <span className="text-[11px] font-bold text-[#78716C]">
                  {ownedIds.length > 0 ? 'Tap a buddy to swap' : 'Guest buddies ready!'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {squadIds.map((id, idx) => {
                const item = getCollectibleById(id);
                const isOwned = (vault[id] ?? 0) > 0;
                const isShiny = isOwned && Boolean(shinyVault[id]);
                return (
                  <button
                    key={`${idx}-${id}`}
                    type="button"
                    onClick={() => {
                      if (ownedIds.length > 0) {
                        setEditingSquadSlot(editingSquadSlot === idx ? null : idx);
                      }
                    }}
                    className={`qv-btn relative rounded-2xl border-2 p-2.5 text-center ${
                      isShiny
                        ? 'border-[#F59E0B] bg-[#FFFBEB] shadow-[0_0_0_2px_rgba(245,158,11,0.2)]'
                        : 'border-[#E5DFD3] bg-[#FAF8F4]'
                    }`}
                  >
                    {isShiny && (
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-[#F59E0B] px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                        ★ +4
                      </span>
                    )}
                    <div className="mx-auto flex justify-center">
                      <CollectibleArt id={id} size={58} shiny={isShiny} />
                    </div>
                    <p className="mt-1 truncate text-xs font-extrabold text-[#1C1917]">
                      {item?.name ?? id}
                    </p>
                    <p className="text-[10px] font-bold text-[#78716C]">
                      {isOwned ? 'Tap to swap' : 'Guest Buddy'}
                    </p>
                  </button>
                );
              })}
            </div>

            {editingSquadSlot !== null && ownedIds.length > 0 && (
              <div className="rounded-2xl border-2 border-[#C7D2FE] bg-[#EEF2FF] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#3730A3]">
                    Choose a Critter for Slot #{editingSquadSlot + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingSquadSlot(null)}
                    className="text-xs font-extrabold text-[#4F46E5] underline"
                  >
                    Close
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {ownedIds.map((cid) => {
                    const item = getCollectibleById(cid);
                    const isShiny = Boolean(shinyVault[cid]);
                    return (
                      <button
                        key={cid}
                        type="button"
                        onClick={() => handleReplaceSquadMember(editingSquadSlot, cid)}
                        className="qv-btn inline-flex items-center gap-1.5 rounded-xl border-2 border-white bg-white px-2.5 py-1.5 text-xs font-extrabold text-[#1C1917]"
                      >
                        <CollectibleArt id={cid} size={28} shiny={isShiny} />
                        <span>{item?.name}</span>
                        {isShiny && <span className="text-[#D97706]">★</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Shared daily cap notice + Launch CTA */}
          <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs font-bold text-[#92400E]">
            <span>Daily Arcade Token Pool 今日街機共用上限</span>
            <span className="font-extrabold tabular-nums">
              {arcadeTokensEarnedToday} / {ARCADE_DAILY_TOKEN_CAP} ({remainingCap} left)
            </span>
          </div>

          <button
            type="button"
            onClick={startBattle}
            className="qv-btn w-full min-h-[54px] rounded-2xl border-3 border-[#1C1917] bg-[#EF4444] text-white font-display text-lg font-extrabold shadow-[0_5px_0_#1C1917] inline-flex items-center justify-center gap-2"
          >
            <Swords className="h-5 w-5" />
            <span>Battle {activeBoss.zhName}! 開始打魔王</span>
          </button>
        </div>
      </div>
    );
  }

  // Victory Summary screen
  if (phase === 'summary') {
    const accuracy = attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 100;
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 shadow-[0_6px_0_#1C1917] text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3.5 py-1 text-xs font-extrabold text-[#B45309]">
            <Trophy className="h-4 w-4" />
            <span>BOSS DEFEATED! 魔王擊倒成功！</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <BossArt bossId={activeBoss.id} size={118} isDefeated />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {activeBoss.zhName} Defeated!
            </h1>
            <p className="text-sm font-bold text-[#57534E] italic">“{activeBoss.defeatLine}”</p>
          </div>

          {/* Squad victory row */}
          <div className="flex items-center justify-center gap-3">
            {squadIds.map((id, i) => {
              const isShiny = (vault[id] ?? 0) > 0 && Boolean(shinyVault[id]);
              return (
                <div
                  key={`${i}-${id}`}
                  className={`rounded-2xl border-2 p-2 ${
                    isShiny ? 'border-[#F59E0B] bg-[#FFFBEB]' : 'border-[#E5DFD3] bg-[#FAF8F4]'
                  }`}
                >
                  <CollectibleArt id={id} size={48} shiny={isShiny} />
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] p-3">
              <p className="text-[11px] font-bold text-[#9A3412]">Score 總分</p>
              <p className="font-display text-xl font-extrabold text-[#EA580C] tabular-nums">
                {awardResult?.score ?? totalDamage}
              </p>
              {awardResult?.isNewBest && (
                <span className="text-[10px] font-extrabold text-[#D97706]">★ NEW BEST!</span>
              )}
            </div>
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
              <p className="text-[11px] font-bold text-[#065F46]">Accuracy 命中率</p>
              <p className="font-display text-xl font-extrabold text-[#059669] tabular-nums">
                {accuracy}%
              </p>
              <p className="text-[10px] font-bold text-[#047857]">
                {correctCount}/{attemptsCount} hits
              </p>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3">
              <p className="text-[11px] font-bold text-[#92400E]">Tokens 獲得</p>
              <p className="font-display text-xl font-extrabold text-[#D97706] tabular-nums">
                +{awardResult?.tokensAwarded ?? 0}
              </p>
              <p className="text-[10px] font-bold text-[#B45309]">
                Cap left: {awardResult?.remainingDailyCap ?? 0}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setPhase('ready')}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#EF4444] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
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
              onClick={onExit}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#1C1917] font-display text-sm font-extrabold"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Battle screen
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#57534E]"
        >
          <X className="h-4 w-4" />
          <span>Exit</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FDBA74] px-3 py-1 text-xs font-extrabold text-[#C2410C] tabular-nums">
            <Flame className="h-3.5 w-3.5 text-[#EA580C]" />
            Combo {combo}×
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309]">
            <Zap className="h-3.5 w-3.5" />
            Ultimate: {ultimateLabel}
          </span>
          {isZh && (
            <button
              type="button"
              onClick={onToggleZhuyin}
              className="qv-btn min-h-[34px] rounded-full border-2 border-[#0D9488] bg-[#F0FDFA] px-3 py-1 text-xs font-extrabold text-[#0F766E]"
            >
              注音：{showZhuyin ? '開' : '關'}
            </button>
          )}
        </div>
      </div>

      {/* Battle Arena Stage */}
      <div
        className="relative overflow-hidden rounded-3xl border-3 border-[#1C1917] p-4 sm:p-5 shadow-[0_5px_0_#1C1917]"
        style={{ backgroundColor: activeBoss.bgHex }}
      >
        {/* Boss HP bar */}
        <div className="mb-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
              👾 {activeBoss.zhName} <span className="text-xs font-bold text-[#57534E]">({activeBoss.name})</span>
            </span>
            <span className="font-display text-sm font-extrabold tabular-nums" style={{ color: activeBoss.accentHex }}>
              {bossHp} / {activeBoss.maxHp} HP
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full border-2 border-[#1C1917] bg-white">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${hpPercent}%`, backgroundColor: hpPercent > 35 ? activeBoss.accentHex : '#EF4444' }}
            />
          </div>
        </div>

        {/* Squad vs Boss visual row */}
        <div className="flex items-center justify-between gap-3">
          {/* 3-Critter Squad */}
          <div className="flex items-end gap-1.5 sm:gap-2.5">
            {squadIds.map((id, idx) => {
              const isShiny = (vault[id] ?? 0) > 0 && Boolean(shinyVault[id]);
              return (
                <div
                  key={`${idx}-${id}`}
                  className={`rounded-2xl border-2 bg-white/90 p-1.5 sm:p-2 transition-transform duration-150 ${
                    hitBanner ? 'translate-x-2 -translate-y-1' : ''
                  } ${
                    isShiny
                      ? 'border-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.45)]'
                      : 'border-[#E5DFD3]'
                  }`}
                >
                  <CollectibleArt id={id} size={52} shiny={isShiny} />
                </div>
              );
            })}
          </div>

          {/* Center Strike Callout */}
          <div className="flex-1 text-center px-1">
            {hitBanner ? (
              <div
                className={`inline-flex flex-col items-center rounded-2xl border-2 px-3 py-1.5 font-display font-extrabold ${
                  hitBanner.isUltimate
                    ? 'border-[#B91C1C] bg-[#FEE2E2] text-[#B91C1C]'
                    : 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                }`}
              >
                <span className="text-base sm:text-xl tabular-nums">-{hitBanner.damage} HP!</span>
                <span className="text-[11px]">
                  {hitBanner.isUltimate
                    ? '⚡ 2× TEAM ULTIMATE 合體必殺技!'
                    : hitBanner.shinyBonus > 0
                      ? `✨ Direct Hit (+${hitBanner.shinyBonus} Shiny)`
                      : '💥 Direct Hit!'}
                </span>
              </div>
            ) : wrongFeedback ? (
              <div className="inline-flex items-center gap-1 rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] px-3 py-1.5 text-xs font-extrabold text-[#B45309]">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Shielded! Review & Strike Back</span>
              </div>
            ) : (
              <p className="text-xs font-bold text-[#57534E] hidden sm:block">
                “{activeBoss.taunt}”
              </p>
            )}
          </div>

          {/* Boss Art */}
          <div className="shrink-0">
            <BossArt bossId={activeBoss.id} size={104} isHit={Boolean(hitBanner)} isDefeated={bossHp <= 0} />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-4 sm:p-6 shadow-[0_5px_0_#1C1917] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            {question.subHint && (
              <span className="inline-block rounded-full bg-[#F3EFE7] px-3 py-0.5 text-xs font-extrabold text-[#57534E]">
                {question.subHint}
              </span>
            )}
            <p className="font-display text-lg sm:text-2xl font-extrabold text-[#1C1917] leading-snug">
              {question.prompt}
            </p>
          </div>
          {question.speakText && (
            <button
              type="button"
              onClick={() => speakPrompt(question.speakText, question.speakLang)}
              aria-label="Read question aloud"
              className="qv-btn shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#1C1917]"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {question.visual &&
          (!question.revealVisualOnFeedback || Boolean(wrongFeedback) || Boolean(hitBanner)) && (
            <div className="flex justify-center">
              <MathVisual spec={question.visual} />
            </div>
          )}

        {/* 4 Blooket-style Answer Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.choices.map((choice, idx) => {
            const style = CHOICE_STYLES[idx % CHOICE_STYLES.length];
            const isCorrectChoice = choice.label === question.correctAnswer;
            const isChosenWrong = wrongFeedback?.chosen === choice.label;
            const dimmed =
              (Boolean(wrongFeedback) && !isCorrectChoice && !isChosenWrong) ||
              (Boolean(hitBanner) && !isCorrectChoice);

            return (
              <button
                key={`${question.id}-${idx}-${choice.label}`}
                type="button"
                disabled={Boolean(wrongFeedback) || Boolean(hitBanner)}
                onClick={() => handleAnswer(choice.label)}
                className={`qv-btn min-h-[58px] rounded-2xl border-b-4 px-4 py-3 text-left text-white font-display text-base sm:text-lg font-extrabold flex items-center gap-3 transition-opacity ${
                  dimmed ? 'opacity-45' : ''
                } ${
                  wrongFeedback && isCorrectChoice
                    ? 'ring-4 ring-[#10B981] ring-offset-2'
                    : isChosenWrong
                      ? 'ring-4 ring-[#1C1917] ring-offset-2'
                      : ''
                }`}
                style={{ backgroundColor: style.bg, borderBottomColor: style.border }}
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/20 text-sm">
                  {style.shape}
                </span>
                <span className="flex-1 leading-snug">
                  {isZh && choice.zhuyin ? (
                    <RubyWord
                      word={choice.label}
                      zhuyin={choice.zhuyin}
                      showZhuyin={showZhuyin}
                      className="text-white"
                      zhuyinClassName="text-white/95"
                    />
                  ) : (
                    choice.label
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wrong Answer Shield Lock Feedback */}
        {wrongFeedback && (
          <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 space-y-3">
            <div className="space-y-1">
              <p className="font-display text-sm font-extrabold text-[#B45309]">
                🛡️ Boss Blocked That Strike! Correct Answer:{' '}
                <span className="text-[#1C1917]">{question.correctAnswer}</span>
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#57534E]">{question.explanation}</p>
            </div>
            <button
              type="button"
              onClick={handleContinueAfterWrong}
              className="qv-btn w-full sm:w-auto min-h-[46px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2.5 text-sm font-extrabold text-white inline-flex items-center justify-center gap-1.5"
            >
              <span>Got It, Next Strike</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

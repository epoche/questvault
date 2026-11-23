import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Castle,
  Coins,
  Flame,
  Heart,
  RotateCcw,
  Shield,
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
import { ARCADE_DAILY_TOKEN_CAP } from '../../core/economy';
import { getCollectibleById } from '../../core/packs';
import {
  calculateQuizEnergyGain,
  calculateTowerRawTokens,
  createInitialTowerSlots,
  getTotalDefensePower,
  getTowerPower,
  getTowerUpgradeCost,
  resolveAvailableTowerRoster,
  resolveTowerWave,
  TOWER_DEPLOY_COST,
  TOWER_MAX_CASTLE_HP,
  TOWER_STARTING_ENERGY,
  TOWER_WAVES,
  type TowerSlotState,
  type TowerWaveResolution,
} from '../../core/towerDefenseEngine';
import type { DifficultyTier, SubjectId } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { MathVisual } from '../artwork/MathVisual';
import { TowerDefenseSvg } from '../artwork/TowerDefenseSvg';
import { RubyWord } from '../components/RubyWord';

export interface TowerDefenseCompletionPayload {
  subjectId: SubjectId;
  score: number;
  wavesCleared: number;
  victory: boolean;
  correctCount: number;
  rawTokensEarned: number;
}

interface TowerDefenseViewProps {
  subjectId: SubjectId;
  activeTier: DifficultyTier;
  vault: Record<string, number>;
  shinyVault?: Record<string, boolean>;
  favoriteCollectibleIds?: string[];
  highScore: number;
  arcadeTokensEarnedToday: number;
  showZhuyin: boolean;
  onToggleZhuyin: () => void;
  onCompleteTowerDefense: (
    payload: TowerDefenseCompletionPayload,
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

export const TowerDefenseView: React.FC<TowerDefenseViewProps> = ({
  subjectId,
  activeTier,
  vault,
  shinyVault = {},
  favoriteCollectibleIds = [],
  highScore,
  arcadeTokensEarnedToday,
  showZhuyin,
  onToggleZhuyin,
  onCompleteTowerDefense,
  onExit,
  onGoToMarket,
}) => {
  const isZh = subjectId === 'chinese';
  const rosterIds = useMemo(
    () => resolveAvailableTowerRoster(vault, favoriteCollectibleIds, shinyVault),
    [vault, favoriteCollectibleIds, shinyVault],
  );

  const [phase, setPhase] = useState<'playing' | 'summary'>('playing');
  const [slots, setSlots] = useState<TowerSlotState[]>(() => createInitialTowerSlots());
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(0);
  const [selectedCritterId, setSelectedCritterId] = useState<string>(() => rosterIds[0]);

  const [waveIdx, setWaveIdx] = useState(0);
  const [wavesCleared, setWavesCleared] = useState(0);
  const [castleHp, setCastleHp] = useState(TOWER_MAX_CASTLE_HP);
  const [energy, setEnergy] = useState(TOWER_STARTING_ENERGY);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [victory, setVictory] = useState(false);

  const [question, setQuestion] = useState<ArcadeQuestion>(() =>
    generateArcadeQuestion(subjectId, activeTier, 1),
  );
  const [wrongFeedback, setWrongFeedback] = useState<{ chosen: string } | null>(null);
  const [correctFlash, setCorrectFlash] = useState<string | null>(null);
  const [volleyActive, setVolleyActive] = useState(false);
  const [lastWaveBanner, setLastWaveBanner] = useState<TowerWaveResolution | null>(null);
  const [awardResult, setAwardResult] = useState<{
    tokensAwarded: number;
    remainingDailyCap: number;
    isNewRecord: boolean;
  } | null>(null);

  // Synchronous ref mirrors to prevent same-tick double-deploy, wave-launch races, and stale closures
  const slotsRef = useRef<TowerSlotState[]>(slots);
  const energyRef = useRef<number>(TOWER_STARTING_ENERGY);
  const scoreRef = useRef<number>(0);
  const castleHpRef = useRef<number>(TOWER_MAX_CASTLE_HP);
  const streakRef = useRef<number>(0);
  const correctCountRef = useRef<number>(0);
  const wavesClearedRef = useRef<number>(0);
  const waveIdxRef = useRef<number>(0);
  const qSeqRef = useRef<number>(1);
  const preRunHighScoreRef = useRef<number>(highScore);

  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const waveLockRef = useRef(false);
  const settledRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const waveTimerRef = useRef<number | null>(null);

  const cancelSpeech = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // Sandbox safe no-op
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (waveTimerRef.current !== null) {
      window.clearTimeout(waveTimerRef.current);
      waveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      cancelSpeech();
    };
  }, [clearTimers, cancelSpeech]);

  useEffect(() => {
    if (!wrongFeedback) {
      advancingRef.current = false;
    }
  }, [wrongFeedback]);

  const nextQuestion = useCallback(() => {
    qSeqRef.current += 1;
    setQuestion(generateArcadeQuestion(subjectId, activeTier, qSeqRef.current));
  }, [activeTier, subjectId]);

  const currentWave = TOWER_WAVES[Math.min(TOWER_WAVES.length - 1, waveIdx)];
  const totalDefensePower = useMemo(
    () => getTotalDefensePower(slots, shinyVault),
    [slots, shinyVault],
  );
  const deployedCount = useMemo(
    () => slots.filter((s) => Boolean(s.collectibleId)).length,
    [slots],
  );
  const waveTotalHp = currentWave.monsterCount * currentWave.hpPerMonster;

  const finishGame = useCallback(
    (finalScore: number, finalWaves: number, isVictory: boolean, finalCorrect: number) => {
      if (settledRef.current) return;
      settledRef.current = true;
      clearTimers();
      cancelSpeech();
      const isNewRecord = finalScore > preRunHighScoreRef.current && finalScore > 0;
      const rawTokens = calculateTowerRawTokens(finalCorrect, finalWaves, isVictory);
      const res = onCompleteTowerDefense({
        subjectId,
        score: finalScore,
        wavesCleared: finalWaves,
        victory: isVictory,
        correctCount: finalCorrect,
        rawTokensEarned: rawTokens,
      });
      setVictory(isVictory);
      setWavesCleared(finalWaves);
      setScore(finalScore);
      setAwardResult({ ...res, isNewRecord });
      if (isVictory || res.tokensAwarded > 0) audioService.playChest();
      else audioService.playNudge();
      setPhase('summary');
    },
    [cancelSpeech, clearTimers, onCompleteTowerDefense, subjectId],
  );

  const restartGame = () => {
    clearTimers();
    cancelSpeech();
    qSeqRef.current += 1;
    preRunHighScoreRef.current = highScore;
    const freshSlots = createInitialTowerSlots();
    slotsRef.current = freshSlots;
    energyRef.current = TOWER_STARTING_ENERGY;
    scoreRef.current = 0;
    castleHpRef.current = TOWER_MAX_CASTLE_HP;
    streakRef.current = 0;
    correctCountRef.current = 0;
    wavesClearedRef.current = 0;
    waveIdxRef.current = 0;

    setSlots(freshSlots);
    setSelectedSlotIdx(0);
    setSelectedCritterId(rosterIds[0]);
    setWaveIdx(0);
    setWavesCleared(0);
    setCastleHp(TOWER_MAX_CASTLE_HP);
    setEnergy(TOWER_STARTING_ENERGY);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setVictory(false);
    setWrongFeedback(null);
    setCorrectFlash(null);
    setVolleyActive(false);
    setLastWaveBanner(null);
    setAwardResult(null);
    setQuestion(generateArcadeQuestion(subjectId, activeTier, qSeqRef.current));
    answeringRef.current = false;
    advancingRef.current = false;
    waveLockRef.current = false;
    settledRef.current = false;
    setPhase('playing');
  };

  const handleSelectChoice = (choiceLabel: string) => {
    if (
      phase !== 'playing' ||
      settledRef.current ||
      answeringRef.current ||
      waveLockRef.current ||
      wrongFeedback ||
      correctFlash
    ) {
      return;
    }
    answeringRef.current = true;
    cancelSpeech();

    if (choiceLabel === question.correctAnswer) {
      const nextStreak = streakRef.current + 1;
      const gain = calculateQuizEnergyGain(nextStreak);
      const nextEnergy = energyRef.current + gain;
      const nextScore = scoreRef.current + 100 + Math.min(50, (nextStreak - 1) * 15);
      const nextCorrect = correctCountRef.current + 1;

      streakRef.current = nextStreak;
      energyRef.current = nextEnergy;
      scoreRef.current = nextScore;
      correctCountRef.current = nextCorrect;

      setStreak(nextStreak);
      setCorrectCount(nextCorrect);
      setEnergy(nextEnergy);
      setScore(nextScore);
      setCorrectFlash(
        isZh
          ? `⚡ 答對了！獲得 +${gain} 能量（連擊 ${nextStreak}×）`
          : `⚡ Correct! +${gain} Energy (${nextStreak}× Streak)`,
      );
      audioService.playCorrect(nextStreak);

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        if (settledRef.current) return;
        nextQuestion();
        setCorrectFlash(null);
        answeringRef.current = false;
      }, 650);
    } else {
      streakRef.current = 0;
      setStreak(0);
      setWrongFeedback({ chosen: choiceLabel });
      audioService.playNudge();
    }
  };

  const handleGotItAfterWrong = () => {
    if (!wrongFeedback || advancingRef.current || waveLockRef.current || settledRef.current) return;
    advancingRef.current = true;
    cancelSpeech();
    audioService.playToken();
    nextQuestion();
    setWrongFeedback(null);
    answeringRef.current = false;
  };

  const handleDeployOrUpgrade = (slotIndex: number) => {
    if (phase !== 'playing' || waveLockRef.current || settledRef.current) return;
    const currentSlots = slotsRef.current;
    const slot = currentSlots[slotIndex];
    if (!slot) return;
    const cost = getTowerUpgradeCost(slot);
    if (cost === null || energyRef.current < cost) return;

    const nextEnergy = energyRef.current - cost;
    let nextSlots: TowerSlotState[];
    if (!slot.collectibleId) {
      const critterToPlace = selectedCritterId || rosterIds[0];
      nextSlots = currentSlots.map((s) =>
        s.slotIndex === slotIndex ? { ...s, collectibleId: critterToPlace, level: 1 } : s,
      );
      audioService.playToken();
    } else if (slot.level < 3) {
      const nextLv = (slot.level + 1) as 2 | 3;
      nextSlots = currentSlots.map((s) =>
        s.slotIndex === slotIndex ? { ...s, level: nextLv } : s,
      );
      audioService.playCorrect(nextLv + 1);
    } else {
      return;
    }

    energyRef.current = nextEnergy;
    slotsRef.current = nextSlots;
    setEnergy(nextEnergy);
    setSlots(nextSlots);
  };

  const handleLaunchWave = () => {
    if (
      phase !== 'playing' ||
      waveLockRef.current ||
      settledRef.current ||
      answeringRef.current ||
      timerRef.current !== null ||
      Boolean(correctFlash) ||
      Boolean(wrongFeedback) ||
      slotsRef.current.every((s) => !s.collectibleId)
    ) {
      return;
    }
    waveLockRef.current = true;
    cancelSpeech();
    setVolleyActive(true);
    audioService.playCorrect(4);

    const resolution = resolveTowerWave(slotsRef.current, waveIdxRef.current, shinyVault);

    waveTimerRef.current = window.setTimeout(() => {
      waveTimerRef.current = null;
      if (settledRef.current) return;
      setVolleyActive(false);
      setLastWaveBanner(resolution);
      const nextHp = Math.max(0, castleHpRef.current - resolution.castleDamage);
      const nextScore = scoreRef.current + resolution.scoreGained;
      const nextEnergy = energyRef.current + resolution.energyGained;
      const nextWavesCleared = nextHp > 0 ? wavesClearedRef.current + 1 : wavesClearedRef.current;

      castleHpRef.current = nextHp;
      scoreRef.current = nextScore;
      energyRef.current = nextEnergy;
      wavesClearedRef.current = nextWavesCleared;

      setCastleHp(nextHp);
      setScore(nextScore);
      setEnergy(nextEnergy);
      setWavesCleared(nextWavesCleared);

      if (nextHp <= 0) {
        waveLockRef.current = false;
        finishGame(nextScore, nextWavesCleared, false, correctCountRef.current);
      } else if (waveIdxRef.current + 1 >= TOWER_WAVES.length) {
        waveLockRef.current = false;
        finishGame(nextScore + nextHp * 40, TOWER_WAVES.length, true, correctCountRef.current);
      } else {
        waveIdxRef.current += 1;
        setWaveIdx(waveIdxRef.current);
        waveLockRef.current = false;
      }
    }, 850);
  };

  const activeSlot = selectedSlotIdx !== null ? slots[selectedSlotIdx] : null;
  const activeSlotCost = activeSlot ? getTowerUpgradeCost(activeSlot) : null;
  const remainingCapToday = Math.max(0, ARCADE_DAILY_TOKEN_CAP - arcadeTokensEarnedToday);

  if (phase === 'summary') {
    const newRecord = Boolean(awardResult?.isNewRecord);
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 shadow-[0_6px_0_#1C1917] text-center space-y-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-extrabold ${
              victory
                ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857]'
                : 'bg-[#FFFBEB] border-[#F59E0B] text-[#B45309]'
            }`}
          >
            <Trophy className="h-4 w-4" />
            {victory
              ? isZh
                ? '🏰 全 5 波防線守護成功！'
                : '🏰 ALL 5 WAVES DEFENDED!'
              : isZh
                ? '🏰 夥伴塔防結算'
                : '🏰 TOWER DEFENSE COMPLETE'}
          </span>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
            {victory
              ? isZh
                ? '恭喜守住 QuestVault 城堡！'
                : 'Castle Victory!'
              : isZh
                ? `成功守住 ${wavesCleared} / 5 波進攻！`
                : `Cleared ${wavesCleared} / 5 Waves!`}
          </h1>

          {newRecord && score > 0 && (
            <p className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-extrabold text-[#B45309]">
              <Sparkles className="h-3.5 w-3.5" />
              {isZh ? '破個人最高分紀錄！' : 'New Personal High Score!'}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] p-3">
              <p className="text-[11px] font-bold text-[#1D4ED8]">{isZh ? '總分' : 'Score'}</p>
              <p className="font-display text-xl font-extrabold text-[#1E3A8A] tabular-nums">
                {score.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
              <p className="text-[11px] font-bold text-[#065F46]">{isZh ? '答對題數' : 'Correct'}</p>
              <p className="font-display text-xl font-extrabold text-[#059669] tabular-nums">
                {correctCount}
              </p>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] p-3">
              <p className="text-[11px] font-bold text-[#92400E]">{isZh ? '獲得代幣' : 'Tokens'}</p>
              <p className="font-display text-xl font-extrabold text-[#D97706] tabular-nums inline-flex items-center gap-0.5">
                <Coins className="h-4 w-4" />+{awardResult?.tokensAwarded ?? 0}
              </p>
              <p className="text-[10px] font-bold text-[#B45309]">
                {isZh ? `今日剩餘上限 ${awardResult?.remainingDailyCap ?? 0}` : `Daily cap left: ${awardResult?.remainingDailyCap ?? 0}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={restartGame}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#059669] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isZh ? '再戰一場' : 'Play Again'}</span>
            </button>
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] text-white font-display text-sm font-extrabold inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{isZh ? '去抽盲盒' : 'Open Packs'}</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn min-h-[48px] rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#1C1917] font-display text-sm font-extrabold"
            >
              {isZh ? '返回首頁' : 'Back Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            clearTimers();
            cancelSpeech();
            onExit();
          }}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border-2 border-[#E5DFD3] bg-white px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#57534E]"
        >
          <X className="h-4 w-4" />
          <span>{isZh ? '離開' : 'Exit'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {isZh && (
            <button
              type="button"
              onClick={onToggleZhuyin}
              className={`qv-btn min-h-[36px] rounded-xl border-2 px-2.5 py-1 text-xs font-extrabold ${
                showZhuyin
                  ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                  : 'border-[#E5DFD3] bg-white text-[#57534E]'
              }`}
            >
              注音：{showZhuyin ? '開' : '關'}
            </button>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 text-xs font-extrabold text-[#DC2626] tabular-nums">
            <Heart className="h-3.5 w-3.5 fill-current" />
            {castleHp}/{TOWER_MAX_CASTLE_HP}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-1 text-xs font-extrabold text-[#B45309] tabular-nums">
            <Zap className="h-3.5 w-3.5 fill-current" />
            {energy}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-xs font-extrabold text-[#1D4ED8] tabular-nums">
            <Castle className="h-3.5 w-3.5" />
            Wave {currentWave.waveNumber}/5
          </span>
          <span className="rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 text-xs font-extrabold text-[#047857] tabular-nums">
            {isZh ? `街機餘額 ${remainingCapToday}` : `Cap ${remainingCapToday}`}
          </span>
        </div>
      </div>

      {/* Meadow Battlefield + Tower Control Bar */}
      <section className="rounded-3xl border-3 border-[#1C1917] bg-white p-4 sm:p-5 shadow-[0_6px_0_#1C1917] space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917]">
              🏰 {isZh ? `第 ${currentWave.waveNumber} 波：${currentWave.zhName}` : `Wave ${currentWave.waveNumber}: ${currentWave.enName}`}
            </h1>
            <p className="text-xs font-bold text-[#57534E] tabular-nums">
              {isZh
                ? `我方總戰力 ${totalDefensePower} vs 怪獸總血量 ${waveTotalHp}（${currentWave.monsterCount} 隻）`
                : `Your Power ${totalDefensePower} vs Wave HP ${waveTotalHp} (${currentWave.monsterCount} monsters)`}
            </p>
          </div>

          <button
            type="button"
            disabled={
              deployedCount === 0 ||
              volleyActive ||
              Boolean(correctFlash) ||
              Boolean(wrongFeedback)
            }
            onClick={handleLaunchWave}
            className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#EF4444] px-4 py-2 font-display text-sm font-extrabold text-white disabled:opacity-45"
            style={{ borderBottomColor: '#991B1B' }}
          >
            <Swords className="h-4 w-4" />
            <span>
              {volleyActive
                ? isZh
                  ? '夥伴齊射中！'
                  : 'Firing Volley!'
                : isZh
                  ? `迎擊第 ${currentWave.waveNumber} 波！`
                  : `Defend Wave ${currentWave.waveNumber}!`}
            </span>
          </button>
        </div>

        <TowerDefenseSvg
          slots={slots}
          shinyVault={shinyVault}
          currentWave={currentWave}
          selectedSlotIndex={selectedSlotIdx}
          volleyActive={volleyActive}
          onSelectSlot={(idx) => setSelectedSlotIdx(idx)}
        />

        {lastWaveBanner && (
          <div
            className={`rounded-2xl border-2 px-3.5 py-2 text-xs sm:text-sm font-extrabold ${
              lastWaveBanner.perfectClear
                ? 'border-[#10B981] bg-[#ECFDF5] text-[#047857]'
                : 'border-[#F59E0B] bg-[#FFFBEB] text-[#B45309]'
            }`}
          >
            {lastWaveBanner.perfectClear
              ? isZh
                ? `✨ 完美攔截第 ${lastWaveBanner.wave.waveNumber} 波！擊退全數 ${lastWaveBanner.defeatedMonsters} 隻，獲得 +${lastWaveBanner.energyGained} 能量＆+${lastWaveBanner.scoreGained} 分！`
                : `✨ Perfect Wave ${lastWaveBanner.wave.waveNumber} Clear! Defeated all ${lastWaveBanner.defeatedMonsters} monsters (+${lastWaveBanner.energyGained} Energy, +${lastWaveBanner.scoreGained} pts)!`
              : isZh
                ? `🛡️ 第 ${lastWaveBanner.wave.waveNumber} 波擊退 ${lastWaveBanner.defeatedMonsters} 隻、漏掉 ${lastWaveBanner.leakedMonsters} 隻（城堡 -${lastWaveBanner.castleDamage} ❤️），快答題存能量升級夥伴！`
                : `🛡️ Wave ${lastWaveBanner.wave.waveNumber}: Defeated ${lastWaveBanner.defeatedMonsters}, ${lastWaveBanner.leakedMonsters} slipped past (-${lastWaveBanner.castleDamage} ❤️). Answer questions to upgrade towers!`}
          </div>
        )}

        {/* Selected Pad Deployment & Upgrade Dock */}
        {activeSlot && (
          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF8F4] p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#2563EB]" />
                <span className="font-display text-sm font-extrabold text-[#1C1917]">
                  {isZh ? `塔位 #${activeSlot.slotIndex + 1}` : `Tower Pad #${activeSlot.slotIndex + 1}`}
                  {activeSlot.collectibleId && (
                    <span className="ml-1.5 text-xs font-bold text-[#059669]">
                      · Lv.{activeSlot.level} ({getTowerPower(activeSlot, shinyVault)} PWR
                      {shinyVault[activeSlot.collectibleId] ? ' ✨+25%' : ''})
                    </span>
                  )}
                </span>
              </div>

              {activeSlotCost !== null ? (
                <button
                  type="button"
                  disabled={energy < activeSlotCost || volleyActive}
                  onClick={() => handleDeployOrUpgrade(activeSlot.slotIndex)}
                  className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#2563EB] px-3.5 py-1.5 text-xs font-extrabold text-white disabled:opacity-40"
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>
                    {!activeSlot.collectibleId
                      ? isZh
                        ? `部署夥伴 (-${TOWER_DEPLOY_COST} ⚡)`
                        : `Deploy Critter (-${TOWER_DEPLOY_COST} ⚡)`
                      : isZh
                        ? `升級 Lv.${activeSlot.level + 1} (-${activeSlotCost} ⚡)`
                        : `Upgrade Lv.${activeSlot.level + 1} (-${activeSlotCost} ⚡)`}
                  </span>
                </button>
              ) : (
                <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-extrabold text-[#B45309]">
                  ✨ MAX Lv.3
                </span>
              )}
            </div>

            {!activeSlot.collectibleId && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {rosterIds.slice(0, 12).map((cid) => {
                  const item = getCollectibleById(cid);
                  if (!item) return null;
                  const isShiny = Boolean(shinyVault[cid]);
                  const picked = selectedCritterId === cid;
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setSelectedCritterId(cid)}
                      className={`qv-btn shrink-0 flex items-center gap-1.5 rounded-xl border-2 px-2.5 py-1.5 text-left ${
                        picked
                          ? 'border-[#1C1917] bg-[#EFF6FF] shadow-xs'
                          : 'border-[#E5DFD3] bg-white'
                      }`}
                    >
                      <CollectibleArt id={cid} size={32} shiny={isShiny} />
                      <div className="leading-tight">
                        <p className="text-[11px] font-extrabold text-[#1C1917] max-w-[84px] truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold text-[#B45309]">
                          {isShiny ? '✨ +25% PWR' : '24 PWR'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Answer Questions to Charge Energy */}
      <section className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 shadow-[0_6px_0_#1C1917] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FDBA74] px-3 py-1 text-xs font-extrabold text-[#C2410C] tabular-nums">
            <Flame className="h-3.5 w-3.5" />
            {isZh ? `答題充能 · 連擊 ${streak}×` : `Answer to Charge Energy · ${streak}× Streak`}
          </span>
          {question.speakText && (
            <button
              type="button"
              onClick={() => {
                try {
                  audioService.speak(question.speakText!, question.speakLang ?? 'en-US');
                } catch {
                  // Sandbox safe
                }
              }}
              className="qv-btn inline-flex min-h-[36px] items-center gap-1 rounded-xl border-2 border-[#1C1917] bg-[#FEF3C7] px-3 py-1 text-xs font-extrabold text-[#92400E]"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>{isZh ? '朗讀' : 'Listen'}</span>
            </button>
          )}
        </div>

        <div className="text-center space-y-2">
          <p className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917]">
            {question.prompt}
          </p>
          {question.subHint && (
            <p className="text-xs font-bold text-[#57534E]">{question.subHint}</p>
          )}
          {question.visual &&
            (!question.revealVisualOnFeedback || Boolean(wrongFeedback) || Boolean(correctFlash)) && (
              <div className="mx-auto max-w-sm">
                <MathVisual spec={question.visual} />
              </div>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.choices.map((choice, idx) => {
            const st = CHOICE_STYLES[idx % CHOICE_STYLES.length];
            const isRight = choice.label === question.correctAnswer;
            const isWrongChosen = wrongFeedback?.chosen === choice.label;
            const dimmed =
              (Boolean(wrongFeedback) && !isRight && !isWrongChosen) ||
              (Boolean(correctFlash) && !isRight);

            return (
              <button
                key={`${question.id}-${choice.label}`}
                type="button"
                disabled={Boolean(wrongFeedback) || Boolean(correctFlash) || volleyActive}
                onClick={() => handleSelectChoice(choice.label)}
                className={`qv-btn min-h-[56px] rounded-2xl border-b-4 px-4 py-3 text-white font-display text-base sm:text-lg font-extrabold flex items-center justify-center gap-2 transition-opacity ${
                  dimmed ? 'opacity-40' : ''
                } ${wrongFeedback && isRight ? 'ring-4 ring-[#10B981] ring-offset-2' : ''}`}
                style={{ backgroundColor: st.bg, borderBottomColor: st.border }}
              >
                <span className="text-xs opacity-80">{st.shape}</span>
                {choice.zhuyin && isZh ? (
                  <RubyWord
                    word={choice.label}
                    zhuyin={choice.zhuyin}
                    showZhuyin={showZhuyin}
                    zhuyinClassName="text-white/95"
                  />
                ) : (
                  <span>{choice.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {correctFlash && (
          <div className="rounded-2xl border-2 border-[#10B981] bg-[#ECFDF5] p-3 text-center text-sm font-extrabold text-[#047857]">
            {correctFlash}
          </div>
        )}

        {wrongFeedback && (
          <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4 space-y-2.5">
            <p className="font-display text-sm font-extrabold text-[#B45309]">
              🛡️ {isZh ? `護盾詳解：正確答案是「${question.correctAnswer}」` : `Shield Tip: Correct answer is "${question.correctAnswer}"`}
            </p>
            {question.explanation && (
              <p className="text-xs font-semibold text-[#57534E]">{question.explanation}</p>
            )}
            <button
              type="button"
              disabled={volleyActive}
              onClick={handleGotItAfterWrong}
              className="qv-btn min-h-[42px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 text-sm font-extrabold text-white inline-flex items-center gap-1.5 disabled:opacity-45"
            >
              <span>{isZh ? '我知道了，下一題' : 'Got It, Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

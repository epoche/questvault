import React from 'react';
import {
  Brain,
  Castle,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Coins,
  Fish,
  Gamepad2,
  Headphones,
  HeartPulse,
  Play,
  Sparkles,
  Swords,
  Zap,
} from 'lucide-react';
import {
  ARCADE_DAILY_TOKEN_CAP,
  DAILY_MIXED_WARMUP_BONUS,
} from '../../core/economy';
import type { MixedWarmupMode } from '../../core/mixedWarmupEngine';
import type { PlayerState, SubjectId } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';

export interface HeroStageProps {
  player: PlayerState;
  activeSubjectId: SubjectId;
  todayKey: string;
  heroTitle: string;
  packsReady: number;
  placementCompleted: boolean;
  warmUpBonus: number;
  clinicCount: number;
  arcadeEarnedToday: number;
  showArcadeDrawer: boolean;
  onToggleArcadeDrawer: () => void;
  onHeroPlay: () => void;
  onStartPlacement: () => void;
  onGoToMarket: () => void;
  onStartBlitz: (subjectId: SubjectId) => void;
  onStartCafe: (subjectId: SubjectId) => void;
  onStartFishing: (subjectId: SubjectId) => void;
  onStartBossBattle: (subjectId: SubjectId) => void;
  onStartTowerDefense?: (subjectId: SubjectId) => void;
  onOpenLogicLab?: () => void;
  onOpenMixedWarmup?: (mode: MixedWarmupMode) => void;
  onStartFactFluency?: () => void;
  onStartChineseListening: () => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({
  player,
  activeSubjectId,
  todayKey,
  heroTitle,
  packsReady,
  placementCompleted,
  warmUpBonus,
  clinicCount,
  arcadeEarnedToday,
  showArcadeDrawer,
  onToggleArcadeDrawer,
  onHeroPlay,
  onStartPlacement,
  onGoToMarket,
  onStartBlitz,
  onStartCafe,
  onStartFishing,
  onStartBossBattle,
  onStartTowerDefense,
  onOpenLogicLab,
  onOpenMixedWarmup,
  onStartFactFluency,
  onStartChineseListening,
}) => {
  const isZh = activeSubjectId === 'chinese';

  const arcadeGames: {
    id: string;
    label: string;
    sub: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[] = [
    {
      id: 'blitz',
      label: isZh ? '60秒無盡衝分' : '60s Blitz',
      sub: isZh ? '極速答題連擊' : 'Fast streak rush',
      bg: '#7C3AED',
      border: '#4C1D95',
      icon: <Zap className="h-4 w-4 fill-current" />,
      onClick: () => onStartBlitz(activeSubjectId),
    },
    {
      id: 'cafe',
      label: isZh ? 'Boba Café 小店' : 'Boba Café',
      sub: isZh ? '出餐賺金幣升級' : 'Serve & upgrade',
      bg: '#EA580C',
      border: '#9A3412',
      icon: <ChefHat className="h-4 w-4" />,
      onClick: () => onStartCafe(activeSubjectId),
    },
    {
      id: 'fishing',
      label: isZh ? '星海釣魚' : 'Star Fishing',
      sub: isZh ? '釣稀有星海大魚' : 'Catch rare fish',
      bg: '#0891B2',
      border: '#155E75',
      icon: <Fish className="h-4 w-4" />,
      onClick: () => onStartFishing(activeSubjectId),
    },
    {
      id: 'boss',
      label: isZh ? '夥伴打魔王' : 'Boss Battle',
      sub: isZh ? '盲盒戰隊合體技' : 'Critter team combo',
      bg: '#EF4444',
      border: '#991B1B',
      icon: <Swords className="h-4 w-4" />,
      onClick: () => onStartBossBattle(activeSubjectId),
    },
    ...(onStartTowerDefense
      ? [
          {
            id: 'tower',
            label: isZh ? '夥伴塔防' : 'Tower Defense',
            sub: isZh ? '排兵佈陣守城堡' : 'Defend the waves',
            bg: '#4F46E5',
            border: '#312E81',
            icon: <Castle className="h-4 w-4" />,
            onClick: () => onStartTowerDefense(activeSubjectId),
          },
        ]
      : []),
  ];

  return (
    <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
      {/* Tier 1: Primary Hero Row (Single semantic <h1>, clean 2–3 core actions + Level Finder) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
          <div className="qv-float shrink-0">
            <CollectibleArt
              id={player.equippedCollectibleId}
              size={80}
              shiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              className="border-2 border-[#1C1917] shadow-sm"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {isZh ? `嗨，${player.displayName}！` : `Hi, ${player.displayName}!`}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onHeroPlay}
                className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-2.5 font-display text-base font-extrabold text-white"
                style={{ borderBottomColor: '#1E3A8A' }}
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{heroTitle}</span>
              </button>

              {onOpenMixedWarmup && (
                <button
                  type="button"
                  onClick={() => onOpenMixedWarmup('daily-warmup')}
                  className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] px-4 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
                  style={{ borderBottomColor: '#B45309' }}
                >
                  <Zap className="h-4 w-4 fill-current" />
                  <span>{isZh ? '5分鐘混合暖身' : '5-Min Warm-Up'}</span>
                  <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-extrabold text-[#92400E] tabular-nums">
                    {player.dailyMixedWarmupDate === todayKey
                      ? '✓'
                      : `+${DAILY_MIXED_WARMUP_BONUS}`}
                  </span>
                </button>
              )}

              {packsReady > 0 && (
                <button
                  type="button"
                  onClick={onGoToMarket}
                  className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-4 py-2.5 font-display text-sm font-extrabold text-[#1C1917] tabular-nums"
                  style={{ borderBottomColor: '#D97706' }}
                >
                  <Sparkles className="h-4 w-4 text-[#D97706]" />
                  <span>
                    {isZh
                      ? `抽 ${packsReady} 包盲盒！`
                      : `Open ${packsReady} ${packsReady === 1 ? 'Pack' : 'Packs'}!`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3-Minute Level Finder Pill */}
        <button
          type="button"
          onClick={onStartPlacement}
          className={`qv-btn qv-hover-lift flex items-center justify-between md:flex-col md:items-end gap-1.5 rounded-2xl border-2 px-4 py-2.5 text-left md:text-right shrink-0 ${
            placementCompleted
              ? 'border-[#E7E2D8] bg-[#FAF7F2] text-[#57534E]'
              : 'min-h-[48px] border-[#1C1917] bg-[#FFFBEB] text-[#1C1917]'
          }`}
        >
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold tabular-nums ${
              placementCompleted
                ? 'bg-[#E7E2D8] text-[#57534E]'
                : 'bg-[#F59E0B] text-white'
            }`}
          >
            <Coins className="h-3 w-3" />
            {placementCompleted
              ? isZh
                ? '重新測等級'
                : 'Re-check Level'
              : isZh
                ? `+${warmUpBonus} 獎勵！`
                : `+${warmUpBonus} Bonus!`}
          </span>
          <span className="font-display text-xs sm:text-sm font-extrabold">
            {isZh
              ? '3 分鐘中文分級暖身 →'
              : activeSubjectId === 'math'
                ? '3-Min Math Warm-Up →'
                : '3-Min Level Warm-Up →'}
          </span>
        </button>
      </div>

      {/* Tier 2: Calm Quick-Launch Dock + Collapsible Arcade Hall (5 Games) */}
      <div className="rounded-2xl border border-[#EBE5D9] bg-[#FAF7F2] p-2.5 sm:p-3 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-expanded={showArcadeDrawer}
            onClick={onToggleArcadeDrawer}
            className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
              showArcadeDrawer
                ? 'border-[#1C1917] bg-[#1C1917] text-white'
                : 'border-[#DDD6FE] bg-white text-[#5B21B6] hover:border-[#7C3AED]'
            }`}
          >
            <Gamepad2 className="h-4 w-4" />
            <span>
              {isZh ? `街機大廳 (${arcadeGames.length})` : `Arcade Games (${arcadeGames.length})`}
            </span>
            {showArcadeDrawer ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {onOpenLogicLab && (
            <button
              type="button"
              onClick={onOpenLogicLab}
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#DDD6FE] bg-white px-3 py-1.5 font-display text-xs sm:text-sm font-extrabold text-[#6D28D9] hover:border-[#7C3AED]"
            >
              <Brain className="h-4 w-4" />
              <span>{isZh ? '邏輯空間館' : 'Logic & Spatial'}</span>
            </button>
          )}

          {onOpenMixedWarmup && (
            <button
              type="button"
              onClick={() => onOpenMixedWarmup('mistake-clinic')}
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#99F6E4] bg-white px-3 py-1.5 font-display text-xs sm:text-sm font-extrabold text-[#0F766E] hover:border-[#0D9488]"
            >
              <HeartPulse className="h-4 w-4" />
              <span>{isZh ? '錯題急救診所' : 'Mistake Clinic'}</span>
              {clinicCount > 0 && (
                <span className="rounded-full bg-[#F43F5E] px-1.5 py-0.5 text-[10px] font-extrabold text-white tabular-nums">
                  {clinicCount}
                </span>
              )}
            </button>
          )}

          {activeSubjectId === 'math' && onStartFactFluency && (
            <button
              type="button"
              onClick={onStartFactFluency}
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#A7F3D0] bg-white px-3 py-1.5 font-display text-xs sm:text-sm font-extrabold text-[#047857] hover:border-[#059669]"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Fact Fluency Dojo</span>
            </button>
          )}

          {activeSubjectId === 'chinese' && (
            <button
              type="button"
              onClick={onStartChineseListening}
              className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#FBCFE8] bg-white px-3 py-1.5 font-display text-xs sm:text-sm font-extrabold text-[#BE185D] hover:border-[#DB2777]"
            >
              <Headphones className="h-4 w-4" />
              <span>聽音辨字</span>
            </button>
          )}
        </div>

        {showArcadeDrawer && (
          <div className="pt-2 border-t border-[#E7E2D8] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-extrabold text-[#57534E]">
              <span>
                {isZh
                  ? '🎮 選擇一款小遊戲邊玩邊複習：'
                  : '🎮 Pick a fast arcade game to practice & earn Tokens:'}
              </span>
              <span className="rounded-full bg-white border border-[#E7E2D8] px-2.5 py-0.5 text-[#92400E] tabular-nums">
                {isZh
                  ? `今日街機代幣 ${arcadeEarnedToday} / ${ARCADE_DAILY_TOKEN_CAP}`
                  : `Today’s Arcade Cap: ${arcadeEarnedToday} / ${ARCADE_DAILY_TOKEN_CAP}`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {arcadeGames.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={game.onClick}
                  className="qv-arcade-btn flex flex-col items-start justify-between gap-1 rounded-2xl border-2 border-[#1C1917] px-3.5 py-2.5 text-left text-white"
                  style={{ backgroundColor: game.bg, borderBottomColor: game.border }}
                >
                  <div className="flex items-center gap-1.5 font-display text-sm font-extrabold">
                    {game.icon}
                    <span>{game.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-white/85">{game.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

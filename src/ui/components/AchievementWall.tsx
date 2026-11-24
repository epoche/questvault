import React, { useRef, useState } from 'react';
import { CheckCircle2, Coins, Gift, Sparkles, Trophy } from 'lucide-react';
import {
  ACHIEVEMENTS,
  evaluateAchievements,
  type AchievementCategory,
  type AchievementProgress,
} from '../../core/achievements';
import type { PlayerState } from '../../core/types';

interface AchievementWallProps {
  player: PlayerState;
  onClaimAchievement: (achievementId: string) => boolean;
}

const CATEGORY_TABS: { id: 'all' | AchievementCategory; label: string }[] = [
  { id: 'all', label: `全部 ${ACHIEVEMENTS.length}` },
  { id: 'learning', label: '學習里程碑' },
  { id: 'streak', label: '連勝毅力' },
  { id: 'collection', label: '盲盒收藏' },
  { id: 'chinese', label: '中文與閱讀' },
  { id: 'logic', label: '🧠 邏輯空間' },
];

export const AchievementWall: React.FC<AchievementWallProps> = ({
  player,
  onClaimAchievement,
}) => {
  const [cat, setCat] = useState<'all' | AchievementCategory>('all');
  const [banner, setBanner] = useState<string | null>(null);
  const claimingRef = useRef(false);

  const items = evaluateAchievements(player);
  const unlockedCount = items.filter((a) => a.unlocked).length;
  const claimableCount = items.filter((a) => a.claimable).length;

  const filtered = (cat === 'all' ? items : items.filter((a) => a.def.category === cat)).sort(
    (a, b) => {
      if (a.claimable !== b.claimable) return a.claimable ? -1 : 1;
      if (a.claimed !== b.claimed) return a.claimed ? 1 : -1;
      return b.pct - a.pct;
    },
  );

  const handleClaim = (item: AchievementProgress) => {
    if (!item.claimable || claimingRef.current) return;
    claimingRef.current = true;
    const ok = onClaimAchievement(item.def.id);
    if (ok) {
      const rewardText =
        item.def.rewardType === 'tokens'
          ? `+${item.def.rewardAmount} Tokens`
          : `+${item.def.rewardAmount} 星塵 Star Dust`;
      setBanner(`🎉 已領取「${item.def.zhTitle}」成就獎勵：${rewardText}！`);
    }
    window.setTimeout(() => {
      claimingRef.current = false;
    }, 0);
  };

  return (
    <section className="space-y-4">
      <div className="qv-surface rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7]">
            <Trophy className="h-6 w-6 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-[#1C1917]">
              成就徽章牆 · Achievement Wall
            </h2>
            <p className="text-xs font-semibold text-[#57534E]">
              已達成 {unlockedCount} / {items.length} 個里程碑
              {claimableCount > 0 ? ` · 有 ${claimableCount} 個獎勵等你領取！` : ' · 每個徽章終身可領 1 次獎勵'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setCat(t.id)}
              className={`qv-btn min-h-[36px] rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
                cat === t.id
                  ? 'border-[#1C1917] bg-[#1C1917] text-white'
                  : 'border-[#E5DFD3] bg-white text-[#57534E]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {banner && (
        <div className="rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] px-4 py-3 text-sm font-extrabold text-[#065F46]">
          {banner}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((item) => {
          const { def } = item;
          const isDust = def.rewardType === 'starDust';
          return (
            <div
              key={def.id}
              className={`qv-surface rounded-3xl p-4 flex flex-col justify-between gap-3 border-2 ${
                item.claimable
                  ? 'border-[#F59E0B] bg-[#FFFBEB]'
                  : item.claimed
                    ? 'border-[#A7F3D0] bg-white'
                    : 'border-[#E5DFD3] bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1C1917] text-2xl"
                  style={{ backgroundColor: def.bgHex }}
                >
                  {def.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-extrabold text-[#1C1917] truncate">
                      {def.zhTitle}
                    </h3>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold tabular-nums ${
                        isDust
                          ? 'bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]'
                          : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                      }`}
                    >
                      {isDust ? <Sparkles className="h-3 w-3" /> : <Coins className="h-3 w-3" />}
                      +{def.rewardAmount}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#78716C]">{def.title}</div>
                  <p className="mt-1 text-xs font-semibold text-[#57534E]">{def.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold tabular-nums text-[#57534E]">
                  <span>
                    進度 {item.current} / {item.target}
                  </span>
                  <span>{item.pct}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EFECE4]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.unlocked ? '#059669' : def.accentHex,
                    }}
                  />
                </div>

                {item.claimable ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(item)}
                    className="qv-arcade-btn w-full min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#F59E0B] px-3 py-2 font-display text-sm font-extrabold text-white"
                    style={{ borderBottomColor: '#B45309' }}
                  >
                    <Gift className="h-4 w-4" />
                    <span>
                      領取 +{def.rewardAmount} {isDust ? '星塵' : 'Tokens'}！
                    </span>
                  </button>
                ) : item.claimed ? (
                  <div className="inline-flex w-full min-h-[38px] items-center justify-center gap-1 rounded-xl bg-[#ECFDF5] px-3 py-1.5 text-xs font-extrabold text-[#047857]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>已領取獎勵</span>
                  </div>
                ) : (
                  <div className="inline-flex w-full min-h-[38px] items-center justify-center rounded-xl bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#78716C]">
                    繼續加油解鎖中
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

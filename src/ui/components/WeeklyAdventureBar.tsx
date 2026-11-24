import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Coins, Gift, Map, Sparkles, Star } from 'lucide-react';
import { ADVENTURE_REWARD_DECOR_IDS, getAdventureMapSnapshot } from '../../core/adventureMap';
import type { AdventureMilestoneDays, PlayerState } from '../../core/types';
import { AdventureMapSvg } from '../artwork/AdventureMapSvg';

export interface WeeklyAdventureBarProps {
  player: PlayerState;
  todayKey: string;
  isZh: boolean;
  onClaimMilestone: (
    days: AdventureMilestoneDays,
  ) => { tokensAwarded: number; unlockedDecorId: string | null } | void;
  onApplyMakeup: (targetDateKey: string) => boolean | void;
}

export const WeeklyAdventureBar: React.FC<WeeklyAdventureBarProps> = ({
  player,
  todayKey,
  isZh,
  onClaimMilestone,
  onApplyMakeup,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const actionLockRef = useRef(false);
  const lockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current !== null) {
        window.clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    };
  }, []);

  const snap = useMemo(
    () => getAdventureMapSnapshot(player, todayKey),
    [player, todayKey],
  );
  const hasRemainingSticker = useMemo(
    () => ADVENTURE_REWARD_DECOR_IDS.some((id) => !(player.unlockedRoomDecorIds ?? []).includes(id)),
    [player.unlockedRoomDecorIds],
  );

  const releaseLockSoon = () => {
    if (lockTimerRef.current !== null) {
      window.clearTimeout(lockTimerRef.current);
    }
    lockTimerRef.current = window.setTimeout(() => {
      actionLockRef.current = false;
      lockTimerRef.current = null;
    }, 250);
  };

  const handleClaim = (days: AdventureMilestoneDays, tokens: number, unlocksDecor?: boolean) => {
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    const res = onClaimMilestone(days);
    if (!res || res.tokensAwarded > 0) {
      const gotTokens = res ? res.tokensAwarded : tokens;
      const gotSticker = res ? Boolean(res.unlockedDecorId) : Boolean(unlocksDecor && hasRemainingSticker);
      setNotice(
        isZh
          ? `🎉 領取成功！獲得 +${gotTokens} Tokens${gotSticker ? ' ＋ 解鎖限定小屋貼紙！' : '！'}`
          : `🎉 Claimed +${gotTokens} Tokens${gotSticker ? ' + Exclusive Room Sticker!' : '!'}`,
      );
    }
    releaseLockSoon();
  };

  const handleMakeup = (dateKey: string) => {
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    const ok = onApplyMakeup(dateKey);
    if (ok !== false) {
      setNotice(
        isZh
          ? `⭐ 補簽成功！已點亮 ${dateKey.slice(5)} 的尋寶印章！`
          : `⭐ Makeup Star used! Stamped ${dateKey.slice(5)} on your map!`,
      );
    }
    releaseLockSoon();
  };

  return (
    <section className="qv-surface rounded-2xl border-2 border-[#BAE6FD] bg-gradient-to-r from-[#F0F9FF] via-[#FFFDF8] to-[#FEFCE8] px-4 py-3 sm:px-5 space-y-3">
      {/* Compact Collapsed Header Row (keeps HomeView clean) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-wrap items-center gap-2.5 text-left min-w-0 group"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38BDF8] bg-[#E0F2FE] px-2.5 py-1 font-display text-xs font-extrabold text-[#0369A1]">
            <Map className="h-3.5 w-3.5" />
            <span>{isZh ? '7 天尋寶地圖' : '7-Day Adventure Map'}</span>
          </span>

          {/* 7 Mini Mon-Sun Dots */}
          <div className="flex items-center gap-1" aria-label="Weekly adventure stamps">
            {snap.days.map((d) => (
              <span
                key={d.dateKey}
                title={`${isZh ? d.shortZh : d.shortEn} (${d.dateKey})`}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-extrabold transition-colors ${
                  d.stamped
                    ? d.dayIndex === 6
                      ? 'border-[#B45309] bg-[#F59E0B] text-white'
                      : 'border-[#059669] bg-[#10B981] text-white'
                    : d.isToday
                      ? 'border-[#2563EB] bg-white text-[#2563EB]'
                      : 'border-[#D6D3D1] bg-white/80 text-[#A8A29E]'
                }`}
              >
                {d.stamped ? (d.dayIndex === 6 ? '👑' : '★') : d.dayIndex + 1}
              </span>
            ))}
          </div>

          <span className="text-xs font-extrabold text-[#1C1917] tabular-nums">
            {snap.stampedCount}/7 {isZh ? '天' : 'days'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {snap.claimableCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="qv-arcade-btn inline-flex min-h-[34px] items-center gap-1 rounded-xl border-2 border-[#1C1917] bg-[#F59E0B] px-3 py-1 font-display text-xs font-extrabold text-white"
              style={{ borderBottomColor: '#B45309' }}
            >
              <Gift className="h-3.5 w-3.5" />
              <span>
                {isZh ? `${snap.claimableCount} 個寶箱可領！` : `${snap.claimableCount} Chest Ready!`}
              </span>
            </button>
          )}

          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="qv-btn inline-flex min-h-[34px] items-center gap-1 rounded-xl border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs font-extrabold text-[#334155] hover:border-[#1C1917]"
          >
            <span>{expanded ? (isZh ? '收合地圖' : 'Hide Map') : isZh ? '展開地圖' : 'Open Map'}</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Island Treasure Map + 3 Milestone Chests + 1/Week Free Makeup Star */}
      {expanded && (
        <div className="pt-2 border-t border-[#E0F2FE] space-y-3">
          <p className="text-xs font-bold text-[#475569]">
            {isZh
              ? '每天完成任 1 關（英文、數學、中文、邏輯空間或 5 分鐘暖身）即可點亮當日探險印章，集滿 3 / 5 / 7 天開寶箱！'
              : 'Complete any 1 quest each day (English, Math, Chinese, Logic Lab, or 5-Min Warm-Up) to light up your island map and open chests at 3, 5, and 7 days!'}
          </p>

          <AdventureMapSvg
            days={snap.days}
            isZh={isZh}
            makeupAvailable={snap.makeupAvailable}
            onSelectMakeupDate={handleMakeup}
          />

          {notice && (
            <div className="rounded-xl border border-[#6EE7B7] bg-[#ECFDF5] px-3 py-2 text-xs font-extrabold text-[#047857]">
              {notice}
            </div>
          )}

          {/* 3 Milestone Chests */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {snap.milestones.map((m) => (
              <div
                key={m.days}
                className={`rounded-2xl border-2 p-3 flex items-center justify-between gap-2 ${
                  m.claimed
                    ? 'border-[#A7F3D0] bg-[#ECFDF5]'
                    : m.claimable
                      ? 'border-[#1C1917] bg-[#FFFBEB] shadow-[0_3px_0_#1C1917]'
                      : 'border-[#E5DFD3] bg-white'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-display text-xs sm:text-sm font-extrabold text-[#1C1917]">
                    <span>{m.emoji}</span>
                    <span className="truncate">{isZh ? `${m.days} 天 · ${m.zhLabel}` : `${m.days} Days · ${m.label}`}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] font-extrabold text-[#B45309] tabular-nums">
                    <Coins className="h-3 w-3 text-[#D97706]" />
                    <span>
                      +{m.tokens}
                      {m.unlocksDecor && hasRemainingSticker
                        ? isZh
                          ? ' ＋ 限定貼紙'
                          : ' + Sticker'
                        : ''}
                    </span>
                  </div>
                </div>

                {m.claimed ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white border border-[#6EE7B7] px-2.5 py-1 text-[11px] font-extrabold text-[#047857]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isZh ? '已領取' : 'Claimed'}
                  </span>
                ) : m.claimable ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(m.days, m.tokens, m.unlocksDecor)}
                    className="qv-arcade-btn shrink-0 inline-flex min-h-[36px] items-center gap-1 rounded-xl border-2 border-[#1C1917] bg-[#F59E0B] px-3 py-1 font-display text-xs font-extrabold text-white"
                    style={{ borderBottomColor: '#B45309' }}
                  >
                    <Gift className="h-3.5 w-3.5" />
                    <span>{isZh ? '領寶箱！' : 'Claim!'}</span>
                  </button>
                ) : (
                  <span className="shrink-0 rounded-full bg-[#F3EFE7] px-2.5 py-1 text-[11px] font-extrabold text-[#78716C] tabular-nums">
                    {snap.stampedCount}/{m.days}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* 1/Week Free Makeup Star Strip */}
          <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFDF2] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#78350F]">
              <Star className="h-4 w-4 fill-[#F59E0B] text-[#D97706] shrink-0" />
              {snap.makeupUsed ? (
                <span>
                  {isZh
                    ? '本週補簽星章已使用完畢，繼續保持連勝喔！'
                    : 'Weekly Makeup Star used this week — keep your streak shining!'}
                </span>
              ) : snap.makeupAvailable ? (
                <span>
                  {isZh
                    ? '✨ 補簽星章已解鎖！點選本週漏掉的一天立即補蓋印章：'
                    : '✨ Makeup Star unlocked! Tap a missed day this week to stamp it:'}
                </span>
              ) : snap.makeupEarned ? (
                <span>
                  {isZh
                    ? '✨ 你已解鎖每週 1 次補簽星章（目前本週沒有漏掉的過去日期喔！）'
                    : '✨ Weekly Makeup Star unlocked (no missed past days this week!)'}
                </span>
              ) : (
                <span>
                  {isZh
                    ? '漏掉一天沒關係！本週任一天完成 2 個不同科目，免費送 1 顆「⭐ 補簽星章」！'
                    : 'Missed a day? Finish 2 different subjects in one day to unlock 1 free Makeup Star!'}
                </span>
              )}
            </div>

            {snap.makeupAvailable && (
              <div className="flex flex-wrap items-center gap-1.5">
                {snap.eligibleMakeupDates.map((dk) => {
                  const cell = snap.days.find((d) => d.dateKey === dk);
                  return (
                    <button
                      key={dk}
                      type="button"
                      onClick={() => handleMakeup(dk)}
                      className="qv-btn inline-flex min-h-[32px] items-center gap-1 rounded-xl border-2 border-[#D97706] bg-[#FEF3C7] px-2.5 py-1 text-xs font-extrabold text-[#92400E]"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>
                        {isZh ? `補簽 ${cell?.shortZh ?? dk.slice(5)}` : `Stamp ${cell?.shortEn ?? dk.slice(5)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

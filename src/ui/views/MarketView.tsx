import React, { useState } from 'react';
import { BookOpen, Coins, Crown, Info, Sparkles, Star, X } from 'lucide-react';
import {
  getCollectiblesByPack,
  getPackById,
  MYSTERY_PACKS,
  PACK_CATEGORIES,
  PACK_COST,
  RARITY_CONFIGS,
  RARITY_ORDER,
} from '../../core/packs';
import type { PackCategory, PackId, PlayerState } from '../../core/types';
import { PackEnvelopeArt } from '../artwork/CollectibleArt';

interface MarketViewProps {
  player: PlayerState;
  onOpenPack: (packId: PackId) => void;
  onGoToQuests: () => void;
  onToggleWishlistPack?: (packId: PackId) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  player,
  onOpenPack,
  onGoToQuests,
  onToggleWishlistPack,
}) => {
  const [showOdds, setShowOdds] = useState(false);
  const [category, setCategory] = useState<'all' | PackCategory>('all');
  const minPackCost = Math.min(...MYSTERY_PACKS.map((p) => p.cost));
  const canAffordAny = player.tokens >= minPackCost;
  const pinnedPack = player.pinnedWishlistPackId ? getPackById(player.pinnedWishlistPackId) : undefined;

  const visiblePacks =
    category === 'all'
      ? MYSTERY_PACKS
      : MYSTERY_PACKS.filter((p) => p.category === category);

  const completedPackCount = MYSTERY_PACKS.filter((pack) => {
    const items = getCollectiblesByPack(pack.id);
    return items.every((item) => (player.vault[item.id] ?? 0) > 0);
  }).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
            Pack Market · {MYSTERY_PACKS.length} Themes
          </h1>
          {completedPackCount > 0 && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-extrabold text-[#B45309]">
              <Crown className="h-3.5 w-3.5 text-[#D97706]" />
              {completedPackCount}/{MYSTERY_PACKS.length} Packs Completed
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOdds((v) => !v)}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border border-[#E7E2D8] bg-white px-3 py-2 text-xs font-bold text-[#57534E]"
          >
            <Info className="h-3.5 w-3.5" />
            <span>{showOdds ? 'Hide Odds' : 'Drop Rates'}</span>
          </button>
        </div>
      </div>

      {/* ⭐ Pinned Wishlist Pack Goal Banner */}
      {pinnedPack && (() => {
        const remaining = Math.max(0, pinnedPack.cost - player.tokens);
        const pct = Math.max(0, Math.min(100, Math.round((player.tokens / Math.max(1, pinnedPack.cost)) * 100)));
        const ready = remaining === 0;
        return (
          <div className="rounded-3xl border-2 border-[#F59E0B] bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <PackEnvelopeArt packId={pinnedPack.id} size={46} />
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#B45309]">
                  <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#D97706]" />
                  <span>願望目標卡包 · Wishlist Goal</span>
                </div>
                <div className="font-display text-base sm:text-lg font-extrabold text-[#1C1917] truncate">
                  {pinnedPack.name}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2.5 w-32 sm:w-44 overflow-hidden rounded-full bg-white/90 border border-[#FCD34D]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: ready ? '#059669' : '#F59E0B' }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-[#92400E] tabular-nums">
                    {ready
                      ? '🎉 夠抽了！'
                      : `還差 ${remaining} Tokens (${player.tokens}/${pinnedPack.cost})`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ready ? (
                <button
                  type="button"
                  onClick={() => onOpenPack(pinnedPack.id)}
                  className="qv-arcade-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-4 py-2 font-display text-xs sm:text-sm font-extrabold text-white"
                  style={{ borderBottomColor: '#065F46' }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Open Now · {pinnedPack.cost}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onGoToQuests}
                  className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-3.5 py-2 text-xs font-extrabold text-white"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>賺代幣去</span>
                </button>
              )}
              {onToggleWishlistPack && (
                <button
                  type="button"
                  aria-label="Unpin wishlist pack"
                  onClick={() => onToggleWishlistPack(pinnedPack.id)}
                  className="qv-btn inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#FCD34D] bg-white text-[#92400E]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {PACK_CATEGORIES.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`qv-btn min-h-[38px] rounded-2xl border-2 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold transition-colors ${
                active
                  ? 'border-[#1C1917] bg-[#1C1917] text-white'
                  : 'border-[#E7E2D8] bg-white text-[#57534E]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {showOdds && (
        <div className="qv-surface rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-6 gap-2">
          {RARITY_ORDER.map((r) => {
            const cfg = RARITY_CONFIGS[r];
            const isChroma = r === 'chroma';
            return (
              <div key={r} className="rounded-xl px-2.5 py-2 text-center" style={{ backgroundColor: cfg.bgTintHex }}>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white ${isChroma ? 'qv-chroma-bg' : ''}`}
                  style={!isChroma ? { backgroundColor: cfg.colorHex } : undefined}
                >
                  {cfg.label}
                </span>
                <div className="mt-1 font-display text-sm font-extrabold tabular-nums">{cfg.weight}%</div>
                <div className="text-[11px] font-semibold text-[#57534E] tabular-nums">Sell +{cfg.resaleTokens}</div>
              </div>
            );
          })}
        </div>
      )}

      {!canAffordAny && (
        <div className="rounded-3xl border-2 border-[#E7E2D8] bg-[#F3EFE7] p-4 flex flex-wrap items-center justify-between gap-3">
          <span className="font-display text-base font-extrabold tabular-nums">
            Need {minPackCost - player.tokens} more Tokens for a Mini Pack!
          </span>
          <button
            type="button"
            onClick={onGoToQuests}
            className="qv-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-4 py-2 text-sm font-extrabold text-white"
          >
            <BookOpen className="h-4 w-4" />
            <span>Play Quests</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visiblePacks.map((pack) => {
          const items = getCollectiblesByPack(pack.id);
          const ownedCount = items.filter((item) => (player.vault[item.id] ?? 0) > 0).length;
          const isComplete = ownedCount === items.length;
          const isPinned = player.pinnedWishlistPackId === pack.id;
          const canAffordPack = player.tokens >= pack.cost;
          const sizeBadge =
            pack.cost < PACK_COST
              ? { label: `Mini · ${items.length}`, cls: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]' }
              : pack.cost > PACK_COST
                ? { label: `Deluxe · ${items.length}`, cls: 'bg-[#FAF5FF] text-[#7C3AED] border-[#DDD6FE]' }
                : items.length !== 8
                  ? { label: `${items.length} Cards`, cls: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]' }
                  : null;

          return (
            <div
              key={pack.id}
              className={`qv-surface qv-hover-lift rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-3.5 ${
                isPinned
                  ? 'ring-2 ring-[#F59E0B] bg-[#FFFDF7]'
                  : isComplete
                    ? 'ring-2 ring-[#F59E0B]'
                    : ''
              }`}
            >
              <div className="w-full flex items-center justify-between gap-1.5 text-xs font-extrabold text-[#57534E] tabular-nums">
                <span className={isComplete ? 'inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[#B45309]' : ''}>
                  {isComplete && <Crown className="h-3.5 w-3.5 text-[#D97706]" />}
                  {ownedCount}/{items.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {sizeBadge && (
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${sizeBadge.cls}`}>
                      {sizeBadge.label}
                    </span>
                  )}
                  {onToggleWishlistPack && (
                    <button
                      type="button"
                      onClick={() => onToggleWishlistPack(pack.id)}
                      aria-label={isPinned ? `Unpin ${pack.name} wishlist` : `Pin ${pack.name} as wishlist`}
                      className={`qv-btn inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold transition-colors ${
                        isPinned
                          ? 'border-[#D97706] bg-[#FEF3C7] text-[#92400E]'
                          : 'border-[#E7E2D8] bg-white text-[#78716C] hover:border-[#F59E0B] hover:text-[#B45309]'
                      }`}
                    >
                      <Star className={`h-3 w-3 ${isPinned ? 'fill-[#F59E0B] text-[#D97706]' : ''}`} />
                      <span>{isPinned ? '願望中' : '願望'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="qv-float">
                <PackEnvelopeArt packId={pack.id} size={114} />
              </div>

              <div>
                <h2 className="font-display text-xl font-extrabold text-[#1C1917]">
                  {pack.name}
                </h2>
                <p className="mt-0.5 text-xs font-medium text-[#57534E] line-clamp-2">
                  {pack.subtitle}
                </p>
              </div>

              <button
                type="button"
                disabled={!canAffordPack}
                onClick={() => onOpenPack(pack.id)}
                className={`qv-arcade-btn inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 py-2.5 font-display text-base font-extrabold tabular-nums ${
                  canAffordPack
                    ? 'border-[#1C1917] text-white'
                    : 'border-[#D8D0C1] bg-[#F3EFE7] text-[#A8A29E] cursor-not-allowed'
                }`}
                style={canAffordPack ? { backgroundColor: pack.accentHex, borderBottomColor: '#1C1917' } : undefined}
              >
                <Coins className="h-4 w-4" />
                <span>Open · {pack.cost}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

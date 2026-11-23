import React, { useState } from 'react';
import { Check, Coins, Crown, Lock, Sparkles, UserCheck } from 'lucide-react';
import { SHINY_CRAFT_COPIES_REQUIRED } from '../../core/economy';
import {
  COLLECTIBLES,
  getCollectiblesByPack,
  MYSTERY_PACKS,
  PACK_CATEGORIES,
  RARITY_CONFIGS,
} from '../../core/packs';
import type { PackCategory, PackId, PlayerState } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';

interface VaultViewProps {
  player: PlayerState;
  onEquipAvatar: (collectibleId: string) => void;
  onSellDuplicate: (collectibleId: string) => void;
  onCraftShiny: (collectibleId: string) => void;
}

type PackFilter = 'all' | 'owned' | 'shiny' | PackId;

export const VaultView: React.FC<VaultViewProps> = ({
  player,
  onEquipAvatar,
  onSellDuplicate,
  onCraftShiny,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | PackCategory>('all');
  const [filter, setFilter] = useState<PackFilter>('all');

  const categoryPacks =
    categoryFilter === 'all'
      ? MYSTERY_PACKS
      : MYSTERY_PACKS.filter((p) => p.category === categoryFilter);

  const visibleItems =
    filter === 'shiny'
      ? COLLECTIBLES.filter((item) => Boolean(player.shinyVault?.[item.id]))
      : filter === 'owned'
        ? COLLECTIBLES.filter((item) => (player.vault[item.id] ?? 0) > 0)
        : filter === 'all'
          ? categoryFilter === 'all'
            ? COLLECTIBLES
            : COLLECTIBLES.filter((item) => categoryPacks.some((p) => p.id === item.packId))
          : COLLECTIBLES.filter((item) => item.packId === filter);

  const totalDiscovered = COLLECTIBLES.filter((c) => (player.vault[c.id] ?? 0) > 0).length;
  const totalShiny = COLLECTIBLES.filter((c) => Boolean(player.shinyVault?.[c.id])).length;
  const showPackSubPills =
    categoryFilter !== 'all' && filter !== 'shiny' && filter !== 'owned';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
            Vault
          </h1>
          <span className="rounded-full bg-[#F3EFE7] px-3 py-1 text-sm font-extrabold text-[#57534E] tabular-nums">
            {totalDiscovered} / {COLLECTIBLES.length}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309] tabular-nums">
            <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
            {totalShiny} Shiny
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PACK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategoryFilter(cat.id);
                setFilter('all');
              }}
              className={`qv-btn min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
                categoryFilter === cat.id && filter !== 'shiny' && filter !== 'owned'
                  ? 'border-[#1C1917] bg-[#1C1917] text-white'
                  : 'border-[#E5DFD3] bg-white text-[#57534E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFilter('owned')}
            className={`qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
              filter === 'owned'
                ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                : 'border-[#E5DFD3] bg-white text-[#047857]'
            }`}
          >
            <span>Owned ({totalDiscovered})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('shiny')}
            className={`qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
              filter === 'shiny'
                ? 'border-[#D97706] bg-[#FEF3C7] text-[#92400E]'
                : 'border-[#E5DFD3] bg-white text-[#B45309]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Shiny ({totalShiny})</span>
          </button>
        </div>
      </div>

      {/* Category-scoped pack sub-pills (compact & hidden on All 18 / Owned / Shiny to prevent mobile pill wall) */}
      {showPackSubPills && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`qv-btn shrink-0 min-h-[36px] rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
              filter === 'all'
                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                : 'border-[#E5DFD3] bg-white text-[#57534E]'
            }`}
          >
            All Shown
          </button>
          {categoryPacks.map((pack) => {
            const packItems = getCollectiblesByPack(pack.id);
            const ownedInPack = packItems.filter((i) => (player.vault[i.id] ?? 0) > 0).length;
            const complete = ownedInPack === packItems.length;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => setFilter(pack.id)}
                className={`qv-btn shrink-0 inline-flex min-h-[36px] items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
                  filter === pack.id
                    ? 'border-[#1C1917] bg-[#1C1917] text-white'
                    : 'border-[#E5DFD3] bg-white text-[#57534E]'
                }`}
              >
                {complete && <Crown className="h-3 w-3 text-[#F59E0B]" />}
                <span>{pack.name.replace(' Pack', '')}</span>
                <span className="opacity-70 tabular-nums">{ownedInPack}/{packItems.length}</span>
              </button>
            );
          })}
        </div>
      )}

      {visibleItems.length === 0 ? (
        <div className="qv-surface rounded-3xl p-8 text-center space-y-2">
          <Sparkles className="mx-auto h-8 w-8 text-[#D97706]" />
          <h2 className="font-display text-lg font-extrabold text-[#1C1917]">
            No Shiny Foils Crafted Yet!
          </h2>
          <p className="text-sm font-medium text-[#57534E]">
            Collect 3 copies of any character to craft its gleaming Shiny Foil edition (3 → 1).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleItems.map((item) => {
            const count = player.vault[item.id] ?? 0;
            const owned = count > 0;
            const isShiny = Boolean(player.shinyVault?.[item.id]);
            const canCraftShiny = owned && !isShiny && count >= SHINY_CRAFT_COPIES_REQUIRED;
            const equipped = player.equippedCollectibleId === item.id;
            const rarity = RARITY_CONFIGS[item.rarity];
            const isChroma = item.rarity === 'chroma';

            return (
              <div
                key={item.id}
                className={`qv-surface rounded-3xl p-4 flex flex-col items-center text-center justify-between gap-3 ${
                  !owned ? 'opacity-80 bg-[#F7F4ED]' : isShiny ? 'ring-2 ring-[#F59E0B] bg-[#FFFDF5]' : ''
                }`}
              >
                <div className="w-full flex items-center justify-between gap-1">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold text-white ${
                      isChroma ? 'qv-chroma-bg' : ''
                    }`}
                    style={!isChroma ? { backgroundColor: rarity.colorHex } : undefined}
                  >
                    {rarity.label}
                  </span>
                  {owned ? (
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#57534E] tabular-nums">
                      {isShiny && <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />}
                      ×{count}
                    </span>
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-[#A8A29E]" />
                  )}
                </div>

                <CollectibleArt id={item.id} size={92} silhouette={!owned} shiny={isShiny} />

                <div>
                  <h3 className="font-display text-base font-extrabold text-[#1C1917]">
                    {owned ? (isShiny ? `✨ ${item.name}` : item.name) : '???'}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#57534E] leading-snug min-h-[2rem]">
                    {owned
                      ? item.tagline
                      : `Found in ${MYSTERY_PACKS.find((p) => p.id === item.packId)?.name}`}
                  </p>
                </div>

                {owned ? (
                  <div className="w-full flex flex-col gap-1.5">
                    <button
                      type="button"
                      disabled={equipped}
                      onClick={() => onEquipAvatar(item.id)}
                      className={`qv-btn inline-flex min-h-[38px] w-full items-center justify-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-extrabold ${
                        equipped
                          ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                          : 'border-[#1C1917] bg-white text-[#1C1917]'
                      }`}
                    >
                      {equipped ? <Check className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                      <span>{equipped ? 'Equipped' : 'Equip Avatar'}</span>
                    </button>

                    {canCraftShiny && (
                      <button
                        type="button"
                        onClick={() => onCraftShiny(item.id)}
                        className="qv-btn inline-flex min-h-[36px] w-full items-center justify-center gap-1 rounded-xl border-2 border-[#D97706] bg-gradient-to-r from-[#FEF08A] to-[#FDE047] px-3 py-1.5 text-xs font-extrabold text-[#78350F]"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#B45309]" />
                        <span>Craft Shiny (3→1)</span>
                      </button>
                    )}

                    {count > 1 && (
                      <button
                        type="button"
                        onClick={() => onSellDuplicate(item.id)}
                        className="qv-btn inline-flex min-h-[36px] w-full items-center justify-center gap-1 rounded-xl border border-[#F59E0B] bg-[#FEF3C7] px-3 py-1.5 text-xs font-extrabold text-[#92400E] tabular-nums"
                      >
                        <Coins className="h-3.5 w-3.5 text-[#D97706]" />
                        <span>Sell 1 (+{rarity.resaleTokens})</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full rounded-xl bg-[#ECE7DC] py-2 text-xs font-bold text-[#78716C]">
                    Undiscovered
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

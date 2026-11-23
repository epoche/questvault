import React, { useState } from 'react';
import {
  Check,
  Coins,
  Crown,
  Dices,
  Home,
  Lock,
  Sparkles,
  Star,
  Trophy,
  UserCheck,
  Wand2,
  X,
} from 'lucide-react';
import { getClaimableAchievementCount } from '../../core/achievements';
import {
  FUSE_COPIES_REQUIRED,
  FUSE_NEXT_RARITY,
  getExtraDuplicateCountByRarity,
  MAX_FAVORITE_COLLECTIBLES,
  SHINY_CRAFT_COPIES_REQUIRED,
  STAR_DUST_MELT_VALUE,
  STAR_DUST_WISH_COST,
} from '../../core/economy';
import {
  COLLECTIBLES,
  getCollectibleById,
  getCollectiblesByPack,
  MYSTERY_PACKS,
  PACK_CATEGORIES,
  RARITY_CONFIGS,
} from '../../core/packs';
import type {
  Collectible,
  CritterRoomThemeId,
  PackCategory,
  PackId,
  PlayerState,
  Rarity,
} from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { AchievementWall } from '../components/AchievementWall';
import { CritterRoomPanel } from '../components/CritterRoomPanel';

interface VaultViewProps {
  player: PlayerState;
  onEquipAvatar: (collectibleId: string) => void;
  onSellDuplicate: (collectibleId: string) => void;
  onCraftShiny: (collectibleId: string) => void;
  onMeltForStarDust: (collectibleId: string) => void;
  onWishUnlock: (collectibleId: string) => boolean;
  onFuseFiveUp: (sourceRarity: Rarity) => { awarded: Collectible; isNew: boolean } | null;
  onToggleFavorite: (collectibleId: string) => void;
  onClaimAchievement?: (achievementId: string) => boolean;
  onUpdateRoomTheme?: (themeId: CritterRoomThemeId) => void;
  onPlaceRoomCritter?: (slotIndex: number, collectibleId: string | null) => void;
}

type PackFilter = 'all' | 'owned' | 'shiny' | 'unowned' | PackId;

const FUSE_SOURCE_RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic'];

export const VaultView: React.FC<VaultViewProps> = ({
  player,
  onEquipAvatar,
  onSellDuplicate,
  onCraftShiny,
  onMeltForStarDust,
  onWishUnlock,
  onFuseFiveUp,
  onToggleFavorite,
  onClaimAchievement,
  onUpdateRoomTheme,
  onPlaceRoomCritter,
}) => {
  const [vaultSection, setVaultSection] = useState<'collection' | 'room' | 'achievements'>('collection');
  const [categoryFilter, setCategoryFilter] = useState<'all' | PackCategory>('all');
  const [filter, setFilter] = useState<PackFilter>('all');
  const [studioBanner, setStudioBanner] = useState<string | null>(null);
  const claimableAchievements = getClaimableAchievementCount(player);

  const starDust = player.starDust ?? 0;
  const favoriteIds = player.favoriteCollectibleIds ?? [];
  const favoriteItems = favoriteIds
    .map((id) => getCollectibleById(id))
    .filter((c): c is Collectible => Boolean(c && (player.vault[c.id] ?? 0) > 0));

  const categoryPacks =
    categoryFilter === 'all'
      ? MYSTERY_PACKS
      : MYSTERY_PACKS.filter((p) => p.category === categoryFilter);

  const visibleItems =
    filter === 'shiny'
      ? COLLECTIBLES.filter((item) => Boolean(player.shinyVault?.[item.id]))
      : filter === 'owned'
        ? COLLECTIBLES.filter((item) => (player.vault[item.id] ?? 0) > 0)
        : filter === 'unowned'
          ? COLLECTIBLES.filter((item) => (player.vault[item.id] ?? 0) === 0)
          : filter === 'all'
            ? categoryFilter === 'all'
              ? COLLECTIBLES
              : COLLECTIBLES.filter((item) => categoryPacks.some((p) => p.id === item.packId))
            : COLLECTIBLES.filter((item) => item.packId === filter);

  const totalDiscovered = COLLECTIBLES.filter((c) => (player.vault[c.id] ?? 0) > 0).length;
  const totalShiny = COLLECTIBLES.filter((c) => Boolean(player.shinyVault?.[c.id])).length;
  const showPackSubPills =
    categoryFilter !== 'all' && filter !== 'shiny' && filter !== 'owned' && filter !== 'unowned';

  const handleFuseClick = (sourceRarity: Rarity) => {
    const res = onFuseFiveUp(sourceRarity);
    if (!res) return;
    const rarityLabel = RARITY_CONFIGS[res.awarded.rarity].label;
    setStudioBanner(
      res.isNew
        ? `🎉 Fused 5→1! NEW ${rarityLabel} unlocked: ${res.awarded.name}!`
        : `🎉 Fused 5→1! Received ${rarityLabel}: ${res.awarded.name}!`,
    );
  };

  const handleWishClick = (item: Collectible) => {
    const ok = onWishUnlock(item.id);
    if (!ok) return;
    setStudioBanner(`✨ Star Dust Wish granted! Unlocked ${item.name} (${RARITY_CONFIGS[item.rarity].label})!`);
  };

  return (
    <div className="space-y-4">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F3FF] border border-[#8B5CF6] px-3 py-1 text-xs font-extrabold text-[#6D28D9] tabular-nums">
            <Wand2 className="h-3.5 w-3.5 text-[#7C3AED]" />
            {starDust} Star Dust
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setVaultSection('collection')}
            className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 px-3.5 py-1.5 font-display text-xs sm:text-sm font-extrabold ${
              vaultSection === 'collection'
                ? 'border-[#1C1917] bg-[#1C1917] text-white'
                : 'border-[#E5DFD3] bg-white text-[#57534E]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>盲盒收藏</span>
          </button>
          <button
            type="button"
            onClick={() => setVaultSection('room')}
            className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 px-3.5 py-1.5 font-display text-xs sm:text-sm font-extrabold ${
              vaultSection === 'room'
                ? 'border-[#1C1917] bg-[#DB2777] text-white'
                : 'border-[#E5DFD3] bg-white text-[#57534E]'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>盲盒小屋</span>
          </button>
          <button
            type="button"
            onClick={() => setVaultSection('achievements')}
            className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 px-3.5 py-1.5 font-display text-xs sm:text-sm font-extrabold ${
              vaultSection === 'achievements'
                ? 'border-[#1C1917] bg-[#F59E0B] text-white'
                : 'border-[#E5DFD3] bg-white text-[#57534E]'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>成就徽章</span>
            {claimableAchievements > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E11D48] px-1.5 text-[11px] font-extrabold text-white tabular-nums">
                {claimableAchievements}
              </span>
            )}
          </button>
        </div>
      </div>

      {vaultSection === 'achievements' ? (
        <AchievementWall
          player={player}
          onClaimAchievement={(id) => onClaimAchievement?.(id) ?? false}
        />
      ) : vaultSection === 'room' ? (
        <CritterRoomPanel
          player={player}
          onUpdateRoomTheme={(themeId) => onUpdateRoomTheme?.(themeId)}
          onPlaceRoomCritter={(slotIdx, cid) => onPlaceRoomCritter?.(slotIdx, cid)}
        />
      ) : (
        <>
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
                categoryFilter === cat.id &&
                filter !== 'shiny' &&
                filter !== 'owned' &&
                filter !== 'unowned'
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
            onClick={() => setFilter('unowned')}
            className={`qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
              filter === 'unowned'
                ? 'border-[#7C3AED] bg-[#F5F3FF] text-[#6D28D9]'
                : 'border-[#E5DFD3] bg-white text-[#6D28D9]'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Wish List ({COLLECTIBLES.length - totalDiscovered})</span>
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

      {/* ⭐ My Favorite 6-Slot Showcase Shelf */}
      <section className="qv-surface rounded-3xl p-4 sm:p-5 space-y-3 border-2 border-[#E7E2D8]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#F59E0B] fill-[#F59E0B]" />
            <h2 className="font-display text-lg font-extrabold text-[#1C1917]">
              My Favorite Shelf
            </h2>
            <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#92400E] tabular-nums">
              {favoriteItems.length} / {MAX_FAVORITE_COLLECTIBLES}
            </span>
          </div>
          <p className="text-xs font-semibold text-[#78716C]">
            Tap ★ on any owned card to showcase your Top 6!
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {Array.from({ length: MAX_FAVORITE_COLLECTIBLES }, (_, idx) => {
            const fav = favoriteItems[idx];
            if (!fav) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#DDD5C7] bg-[#FAF7F2] py-4 px-2 text-center min-h-[112px]"
                >
                  <Star className="h-5 w-5 text-[#D6CFC2]" />
                  <span className="mt-1 text-[11px] font-bold text-[#A8A29E]">Slot {idx + 1}</span>
                </div>
              );
            }
            const isShiny = Boolean(player.shinyVault?.[fav.id]);
            return (
              <div
                key={fav.id}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-2.5 text-center min-h-[112px] ${
                  isShiny
                    ? 'border-[#F59E0B] bg-[#FFFDF5]'
                    : 'border-[#1C1917] bg-white'
                }`}
              >
                <button
                  type="button"
                  aria-label={`Remove ${fav.name} from favorites`}
                  onClick={() => onToggleFavorite(fav.id)}
                  className="qv-btn absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F3EFE7] text-[#57534E] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                >
                  <X className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onEquipAvatar(fav.id)}
                  title={`Equip ${fav.name}`}
                  className="flex flex-col items-center"
                >
                  <CollectibleArt id={fav.id} size={58} shiny={isShiny} />
                  <span className="mt-1 text-[11px] font-extrabold text-[#1C1917] line-clamp-1">
                    {fav.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ✨ Duplicate Crafting Studio: Star Dust Wish Pool + 5-to-1 Fuse Upgrader */}
      <section className="qv-surface rounded-3xl p-4 sm:p-5 space-y-3 bg-gradient-to-br from-[#FAF5FF] to-[#FFFDF9] border-2 border-[#DDD6FE]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Dices className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="font-display text-base sm:text-lg font-extrabold text-[#1C1917]">
              Duplicate Studio · 5→1 Fuse &amp; Star Dust Wish
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#7C3AED] px-3 py-1 text-xs font-extrabold text-white tabular-nums">
            <Wand2 className="h-3.5 w-3.5" />
            {starDust} Star Dust
          </span>
        </div>

        <p className="text-xs font-semibold text-[#57534E]">
          Fuse <strong>5 extra duplicates</strong> of the same rarity into 1 higher-rarity card, or melt duplicates into <strong>Star Dust</strong> to pity-unlock ANY unowned card (even Chroma)!
        </p>

        {studioBanner && (
          <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-[#7C3AED] bg-white px-3.5 py-2 text-xs sm:text-sm font-extrabold text-[#5B21B6]">
            <span>{studioBanner}</span>
            <button
              type="button"
              onClick={() => setStudioBanner(null)}
              aria-label="Dismiss banner"
              className="qv-btn rounded-lg p-1 text-[#7C3AED]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FUSE_SOURCE_RARITIES.map((srcRarity) => {
            const nextRarity = FUSE_NEXT_RARITY[srcRarity]!;
            const extras = getExtraDuplicateCountByRarity(player, srcRarity);
            const ready = extras >= FUSE_COPIES_REQUIRED;
            const srcCfg = RARITY_CONFIGS[srcRarity];
            const dstCfg = RARITY_CONFIGS[nextRarity];
            return (
              <button
                key={srcRarity}
                type="button"
                disabled={!ready}
                onClick={() => handleFuseClick(srcRarity)}
                className={`qv-btn flex flex-col items-center justify-center rounded-2xl border-2 px-2.5 py-2 text-center transition-colors ${
                  ready
                    ? 'border-[#1C1917] bg-white hover:bg-[#F5F3FF] cursor-pointer shadow-xs'
                    : 'border-[#E5DFD3] bg-[#F7F4ED] opacity-70 cursor-not-allowed'
                }`}
              >
                <span className="text-[11px] font-extrabold text-[#1C1917]">
                  5 {srcCfg.label} →{' '}
                  <span style={{ color: dstCfg.colorHex }}>{dstCfg.label}</span>
                </span>
                <span
                  className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold tabular-nums ${
                    ready ? 'bg-[#7C3AED] text-white' : 'bg-[#E5DFD3] text-[#57534E]'
                  }`}
                >
                  {ready ? `Fuse Now! (${extras})` : `${extras}/${FUSE_COPIES_REQUIRED} extras`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Category-scoped pack sub-pills */}
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
            {filter === 'unowned'
              ? 'Amazing! You collected every single character!'
              : 'No Shiny Foils Crafted Yet!'}
          </h2>
          <p className="text-sm font-medium text-[#57534E]">
            {filter === 'unowned'
              ? 'Your entire QuestVault collection is 100% complete!'
              : 'Collect 3 copies of any character to craft its gleaming Shiny Foil edition (3 → 1).'}
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
            const isFavorite = favoriteIds.includes(item.id);
            const canPinMore = isFavorite || favoriteIds.length < MAX_FAVORITE_COLLECTIBLES;
            const rarity = RARITY_CONFIGS[item.rarity];
            const isChroma = item.rarity === 'chroma';
            const meltDust = STAR_DUST_MELT_VALUE[item.rarity];
            const wishCost = STAR_DUST_WISH_COST[item.rarity];
            const canWish = !owned && starDust >= wishCost;

            return (
              <div
                key={item.id}
                className={`qv-surface rounded-3xl p-4 flex flex-col items-center text-center justify-between gap-3 ${
                  !owned ? 'opacity-90 bg-[#F7F4ED]' : isShiny ? 'ring-2 ring-[#F59E0B] bg-[#FFFDF5]' : ''
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
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={!canPinMore}
                        onClick={() => onToggleFavorite(item.id)}
                        aria-label={isFavorite ? `Unpin ${item.name} from favorites` : `Pin ${item.name} to favorites`}
                        title={
                          isFavorite
                            ? 'Pinned on Favorite Shelf'
                            : canPinMore
                              ? 'Pin to Favorite Shelf'
                              : 'Favorite Shelf full (6/6)'
                        }
                        className={`qv-btn inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                          isFavorite
                            ? 'border-[#F59E0B] bg-[#FEF3C7] text-[#D97706]'
                            : canPinMore
                              ? 'border-[#E5DFD3] bg-white text-[#A8A29E] hover:text-[#D97706]'
                              : 'border-[#E5DFD3] bg-[#F3EFE7] text-[#D6CFC2] cursor-not-allowed'
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <span className="inline-flex items-center gap-0.5 text-xs font-extrabold text-[#57534E] tabular-nums">
                        {isShiny && <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />}
                        ×{count}
                      </span>
                    </div>
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
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSellDuplicate(item.id)}
                          className="qv-btn inline-flex min-h-[36px] items-center justify-center gap-1 rounded-xl border border-[#F59E0B] bg-[#FEF3C7] px-2 py-1.5 text-[11px] font-extrabold text-[#92400E] tabular-nums"
                        >
                          <Coins className="h-3 w-3 text-[#D97706] shrink-0" />
                          <span>+{rarity.resaleTokens}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onMeltForStarDust(item.id)}
                          className="qv-btn inline-flex min-h-[36px] items-center justify-center gap-1 rounded-xl border border-[#8B5CF6] bg-[#F5F3FF] px-2 py-1.5 text-[11px] font-extrabold text-[#6D28D9] tabular-nums"
                        >
                          <Wand2 className="h-3 w-3 text-[#7C3AED] shrink-0" />
                          <span>+{meltDust} Dust</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!canWish}
                    onClick={() => handleWishClick(item)}
                    className={`qv-btn inline-flex min-h-[38px] w-full items-center justify-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-extrabold tabular-nums transition-colors ${
                      canWish
                        ? 'border-[#1C1917] bg-[#7C3AED] text-white'
                        : 'border-[#DDD5C7] bg-[#ECE7DC] text-[#78716C] cursor-not-allowed'
                    }`}
                  >
                    <Wand2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{canWish ? `Wish · ${wishCost} Dust` : `Wish (${wishCost} Dust)`}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
};

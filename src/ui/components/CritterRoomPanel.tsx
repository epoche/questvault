import React, { useMemo, useState } from 'react';
import { Home, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { audioService } from '../../core/audio';
import { CRITTER_ROOM_SLOT_COUNT } from '../../core/economy';
import { COLLECTIBLES, getCollectibleById } from '../../core/packs';
import type { CritterRoomThemeId, PlayerState } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import {
  CRITTER_ROOM_THEMES,
  CritterRoomBackdrop,
  ROOM_SLOT_POSITIONS,
} from '../artwork/CritterRoomArt';

interface CritterRoomPanelProps {
  player: PlayerState;
  onUpdateRoomTheme: (themeId: CritterRoomThemeId) => void;
  onPlaceRoomCritter: (slotIndex: number, collectibleId: string | null) => void;
}

const CHEER_LINES = [
  'Yay! Ready for a Quest! 一起去冒險吧！',
  'Boba break time! 珍珠奶茶補充能量！',
  'You are a superstar! 你今天超棒的！',
  'Let’s collect more Shiny buddies! 收集更多閃卡吧！',
  'High-five! 擊掌加油，答題一定全對！',
  'Cozy room! 我最喜歡這個秘密基地了！',
];

export const CritterRoomPanel: React.FC<CritterRoomPanelProps> = ({
  player,
  onUpdateRoomTheme,
  onPlaceRoomCritter,
}) => {
  const room = player.critterRoom ?? {
    themeId: 'strawberry-cafe' as CritterRoomThemeId,
    slots: Array.from({ length: CRITTER_ROOM_SLOT_COUNT }, () => null),
  };

  const [pickingSlot, setPickingSlot] = useState<number | null>(null);
  const [cheerBubble, setCheerBubble] = useState<{
    slotIndex: number;
    name: string;
    line: string;
    tick: number;
  } | null>(null);

  const ownedItems = useMemo(
    () => COLLECTIBLES.filter((c) => (player.vault[c.id] ?? 0) > 0),
    [player.vault],
  );

  const placedCount = room.slots.filter(Boolean).length;
  const activeTheme =
    CRITTER_ROOM_THEMES.find((t) => t.id === room.themeId) ?? CRITTER_ROOM_THEMES[0];

  const handleTapPlacedCritter = (slotIndex: number, collectibleId: string) => {
    const item = getCollectibleById(collectibleId);
    const nextTick = (cheerBubble?.tick ?? 0) + 1;
    const line = CHEER_LINES[(slotIndex + nextTick) % CHEER_LINES.length];
    setPickingSlot(null);
    setCheerBubble({
      slotIndex,
      name: item?.name ?? collectibleId,
      line,
      tick: nextTick,
    });
    audioService.playCorrect(1);
  };

  const handleSelectCritter = (collectibleId: string) => {
    if (pickingSlot === null) return;
    onPlaceRoomCritter(pickingSlot, collectibleId);
    const item = getCollectibleById(collectibleId);
    setCheerBubble({
      slotIndex: pickingSlot,
      name: item?.name ?? collectibleId,
      line: 'Home sweet home! 搬進新房間好開心！',
      tick: (cheerBubble?.tick ?? 0) + 1,
    });
    setPickingSlot(null);
    audioService.playChest();
  };

  return (
    <div className="space-y-4">
      {/* Header + Theme Switcher */}
      <div className="rounded-3xl border-2 border-[#E5DFD3] bg-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] flex items-center gap-2">
              <Home className="h-5 w-5 text-[#DB2777]" />
              <span>🏠 My Critter Room 我的盲盒小屋</span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#57534E]">
              Tap any empty <strong className="text-[#1C1917]">+</strong> spot to place your critters, or tap a critter to make it jump & cheer!
            </p>
          </div>
          <span className="rounded-full bg-[#FDF2F8] border border-[#F9A8D4] px-3 py-1 text-xs font-extrabold text-[#BE185D] tabular-nums">
            {placedCount} / {CRITTER_ROOM_SLOT_COUNT} Placed
          </span>
        </div>

        {/* 4 Free Dreamy Room Themes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CRITTER_ROOM_THEMES.map((theme) => {
            const isSelected = theme.id === activeTheme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onUpdateRoomTheme(theme.id);
                  audioService.playToken();
                }}
                className={`qv-btn min-h-[44px] rounded-2xl border-2 px-3 py-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#1C1917] shadow-[0_3px_0_#1C1917]'
                    : 'border-[#E5DFD3] bg-[#FAF8F4]'
                }`}
                style={isSelected ? { backgroundColor: theme.badgeBg } : undefined}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{theme.emoji}</span>
                  <span className="font-display text-xs font-extrabold text-[#1C1917] truncate">
                    {theme.zhName}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-[#78716C] truncate">{theme.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Room Stage */}
      <div className="relative overflow-hidden rounded-3xl border-3 border-[#1C1917] shadow-[0_6px_0_#1C1917] aspect-[16/10] sm:aspect-[16/9] select-none">
        <CritterRoomBackdrop themeId={activeTheme.id} />

        {/* Cheer Speech Bubble */}
        {cheerBubble && (
          <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 w-[90%] max-w-md">
            <div className="rounded-2xl border-2 border-[#1C1917] bg-white/95 px-3.5 py-2 shadow-[0_3px_0_#1C1917] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#DB2777] truncate">
                  ✨ {cheerBubble.name} says:
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#1C1917] leading-snug">
                  {cheerBubble.line}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPickingSlot(cheerBubble.slotIndex)}
                  className="qv-btn rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-extrabold text-[#4338CA]"
                >
                  Swap 換隻
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPlaceRoomCritter(cheerBubble.slotIndex, null);
                    setCheerBubble(null);
                    audioService.playToken();
                  }}
                  aria-label="Remove critter from slot"
                  className="qv-btn rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-1.5 text-[#DC2626]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8 Interactive Placement Slots */}
        {ROOM_SLOT_POSITIONS.map((pos) => {
          const cid = room.slots[pos.slotIndex] ?? null;
          const item = cid ? getCollectibleById(cid) : null;
          const isShiny = Boolean(cid && (player.vault[cid] ?? 0) > 0 && player.shinyVault?.[cid]);
          const isBouncing = cheerBubble?.slotIndex === pos.slotIndex;
          const isPickingThis = pickingSlot === pos.slotIndex;

          return (
            <button
              key={pos.slotIndex}
              type="button"
              onClick={() => {
                if (cid && item) {
                  handleTapPlacedCritter(pos.slotIndex, cid);
                } else {
                  setCheerBubble(null);
                  setPickingSlot(pos.slotIndex);
                  audioService.playToken();
                }
              }}
              aria-label={
                item
                  ? `${item.name} in ${pos.label}`
                  : `Place critter in slot ${pos.slotIndex + 1}`
              }
              style={{
                left: `${pos.leftPct}%`,
                top: `${pos.topPct}%`,
              }}
              className={`absolute -translate-x-1/2 z-10 flex flex-col items-center justify-center transition-transform duration-200 ${
                isBouncing ? 'scale-110 -translate-y-[60%]' : '-translate-y-1/2 hover:scale-105'
              }`}
            >
              {cid && item ? (
                <div
                  className={`relative rounded-2xl p-1 ${
                    isShiny
                      ? 'bg-[#FFFBEB]/85 ring-2 ring-[#F59E0B] shadow-[0_0_16px_rgba(251,191,36,0.65)]'
                      : 'bg-white/55 backdrop-blur-[1px]'
                  }`}
                >
                  <CollectibleArt id={cid} size={58} shiny={isShiny} />
                  {isShiny && (
                    <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-[#F59E0B] fill-[#FDE047]" />
                  )}
                </div>
              ) : (
                <div
                  className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
                    isPickingThis
                      ? 'border-[#1C1917] bg-[#FEF3C7] text-[#1C1917]'
                      : 'border-white/90 bg-black/20 text-white hover:bg-black/35'
                  }`}
                >
                  <Plus className="h-5 w-5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tap-to-Place Critter Drawer */}
      {pickingSlot !== null && (
        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-4 sm:p-5 shadow-[0_5px_0_#1C1917] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-extrabold text-[#1C1917]">
                Choose a Critter for Spot #{pickingSlot + 1} 選擇要放入的盲盒夥伴
              </h3>
              <p className="text-xs font-semibold text-[#78716C]">
                Tap any owned critter below to place or move it here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPickingSlot(null)}
              className="qv-btn inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#E5DFD3] bg-[#FAF8F4] text-[#57534E]"
              aria-label="Close critter picker"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {ownedItems.length === 0 ? (
            <div className="rounded-2xl bg-[#FAF8F4] border border-[#E5DFD3] p-4 text-center text-sm font-bold text-[#78716C]">
              You haven’t collected any critters yet! Open Mystery Packs in the Market first 🎁
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {ownedItems.map((item) => {
                const isShiny = Boolean(player.shinyVault?.[item.id]);
                const alreadyInSlot = room.slots.indexOf(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCritter(item.id)}
                    className={`qv-btn rounded-2xl border-2 p-2.5 text-center ${
                      isShiny
                        ? 'border-[#F59E0B] bg-[#FFFBEB]'
                        : 'border-[#E5DFD3] bg-[#FAF8F4]'
                    }`}
                  >
                    <div className="mx-auto flex justify-center">
                      <CollectibleArt id={item.id} size={48} shiny={isShiny} />
                    </div>
                    <p className="mt-1 truncate text-xs font-extrabold text-[#1C1917]">
                      {item.name}
                    </p>
                    {alreadyInSlot !== -1 && (
                      <span className="inline-block mt-0.5 rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-extrabold text-[#4338CA]">
                        Spot #{alreadyInSlot + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

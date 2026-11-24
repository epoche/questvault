import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Coins,
  Cookie,
  Heart,
  HelpCircle,
  Home,
  Lock,
  Plus,
  Sparkles,
  Trash2,
  Volume2,
  X,
  XCircle,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  buildCritterPopQuiz,
  getDailyRoomStatus,
  getFriendshipProgress,
  ROOM_TREATS,
  type CritterCareResult,
  type CritterPopQuiz,
  type RoomTreatItem,
} from '../../core/critterCare';
import { getLocalDateKey } from '../../core/date';
import {
  CRITTER_ROOM_MAX_DECOR,
  CRITTER_ROOM_SLOT_COUNT,
} from '../../core/economy';
import { COLLECTIBLES, getCollectibleById } from '../../core/packs';
import type { CritterRoomThemeId, PlayerState } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import {
  CRITTER_ROOM_THEMES,
  CritterRoomBackdrop,
  ROOM_DECOR_ITEMS,
  ROOM_SLOT_POSITIONS,
} from '../artwork/CritterRoomArt';
import { RubyWord } from './RubyWord';

interface CritterRoomPanelProps {
  player: PlayerState;
  showZhuyin?: boolean;
  onToggleZhuyin?: () => void;
  onUpdateRoomTheme: (themeId: CritterRoomThemeId) => void;
  onPlaceRoomCritter: (slotIndex: number, collectibleId: string | null) => void;
  onToggleRoomDecor?: (decorId: string) => void;
  onPetCritter?: (collectibleId: string) => CritterCareResult | null;
  onFeedCritterTreat?: (
    collectibleId: string,
    treatId: RoomTreatItem['id'],
  ) => CritterCareResult | null;
  onAnswerRoomPopQuiz?: (
    collectibleId: string,
    isCorrect: boolean,
  ) => CritterCareResult | null;
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
  showZhuyin = false,
  onToggleZhuyin,
  onUpdateRoomTheme,
  onPlaceRoomCritter,
  onToggleRoomDecor,
  onPetCritter,
  onFeedCritterTreat,
  onAnswerRoomPopQuiz,
}) => {
  const room = player.critterRoom ?? {
    themeId: 'strawberry-cafe' as CritterRoomThemeId,
    slots: Array.from({ length: CRITTER_ROOM_SLOT_COUNT }, () => null),
    decorIds: [],
  };
  const activeDecorIds = room.decorIds ?? [];
  const unlockedRewardSet = useMemo(
    () => new Set(player.unlockedRoomDecorIds ?? []),
    [player.unlockedRoomDecorIds],
  );
  const todayKey = getLocalDateKey();
  const dailyStatus = useMemo(() => getDailyRoomStatus(player, todayKey), [player, todayKey]);

  const [pickingSlot, setPickingSlot] = useState<number | null>(null);
  const [selectedBuddy, setSelectedBuddy] = useState<{
    slotIndex: number;
    collectibleId: string;
    name: string;
    line: string;
    tick: number;
  } | null>(null);
  const [careNotice, setCareNotice] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<CritterPopQuiz | null>(null);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [localZhuyin, setLocalZhuyin] = useState(showZhuyin);

  const careLockRef = useRef(false);
  const quizLockRef = useRef(false);
  const lockTimerRef = useRef<number | null>(null);
  const quizSeedRef = useRef(1);

  useEffect(() => {
    setLocalZhuyin(showZhuyin);
  }, [showZhuyin]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current !== null) {
        window.clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
      audioService.stopSpeech();
    };
  }, []);

  const ownedItems = useMemo(
    () => COLLECTIBLES.filter((c) => (player.vault[c.id] ?? 0) > 0),
    [player.vault],
  );

  const placedCount = room.slots.filter(Boolean).length;
  const activeTheme =
    CRITTER_ROOM_THEMES.find((t) => t.id === room.themeId) ?? CRITTER_ROOM_THEMES[0];

  const releaseCareLockSoon = () => {
    if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      careLockRef.current = false;
      lockTimerRef.current = null;
    }, 220);
  };

  const handleTapPlacedCritter = (slotIndex: number, collectibleId: string) => {
    const item = getCollectibleById(collectibleId);
    const nextTick = (selectedBuddy?.tick ?? 0) + 1;
    const line = CHEER_LINES[(slotIndex + nextTick) % CHEER_LINES.length];
    setPickingSlot(null);
    setCareNotice(null);
    setActiveQuiz(null);
    setQuizSelected(null);
    setQuizFeedback(null);
    quizLockRef.current = false;
    setSelectedBuddy({
      slotIndex,
      collectibleId,
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
    setActiveQuiz(null);
    setQuizSelected(null);
    setQuizFeedback(null);
    setCareNotice(null);
    setSelectedBuddy({
      slotIndex: pickingSlot,
      collectibleId,
      name: item?.name ?? collectibleId,
      line: 'Home sweet home! 搬進新房間好開心！',
      tick: (selectedBuddy?.tick ?? 0) + 1,
    });
    setPickingSlot(null);
    audioService.playChest();
  };

  const handlePet = () => {
    if (!selectedBuddy || careLockRef.current || !onPetCritter) return;
    careLockRef.current = true;
    const res = onPetCritter(selectedBuddy.collectibleId);
    if (res && res.ok) {
      if (res.leveledUp) {
        audioService.playChest();
        setCareNotice(
          `💖 親密度升級到 Lv.${res.newLevel}！${res.tokensAwarded > 0 ? ` 獲得慶祝獎勵 +${res.tokensAwarded} Tokens！` : '（今日小屋代幣上限已達）'}`,
        );
      } else if (res.xpGained > 0) {
        audioService.playCorrect(2);
        setCareNotice(`💛 摸摸頭好開心！親密度 +${res.xpGained} ♥`);
      } else {
        audioService.playToken();
        setCareNotice(`💛 ${selectedBuddy.name} 搖尾巴撒嬌！（今天已經獲得過摸摸親密度囉，試試餵點心或玩小考吧！）`);
      }
    }
    releaseCareLockSoon();
  };

  const handleFeed = (treat: RoomTreatItem) => {
    if (!selectedBuddy || careLockRef.current || !onFeedCritterTreat) return;
    if (dailyStatus.treatsRemaining <= 0) return;
    careLockRef.current = true;
    const res = onFeedCritterTreat(selectedBuddy.collectibleId, treat.id);
    if (res && res.ok) {
      if (res.leveledUp) {
        audioService.playChest();
        setCareNotice(
          `${treat.emoji} 餵了${treat.zhName}！親密度 +${res.xpGained} ♥ 並升級到 Lv.${res.newLevel}！${res.tokensAwarded > 0 ? ` +${res.tokensAwarded} Tokens！` : ''}`,
        );
      } else {
        audioService.playCorrect(3);
        setCareNotice(`${treat.emoji} ${selectedBuddy.name} 超愛${treat.zhName}！親密度 +${res.xpGained} ♥`);
      }
    }
    releaseCareLockSoon();
  };

  const startPopQuiz = () => {
    if (!selectedBuddy) return;
    quizSeedRef.current += 1;
    const q = buildCritterPopQuiz(player, Date.now() + quizSeedRef.current * 37);
    quizLockRef.current = false;
    setActiveQuiz(q);
    setQuizSelected(null);
    setQuizFeedback(null);
    setCareNotice(null);
    audioService.playToken();
  };

  const handleAnswerPopQuiz = (choiceIdx: number) => {
    if (!selectedBuddy || !activeQuiz || quizLockRef.current) return;
    quizLockRef.current = true;
    setQuizSelected(choiceIdx);
    const isCorrect = choiceIdx === activeQuiz.correctIndex;
    const res = onAnswerRoomPopQuiz?.(selectedBuddy.collectibleId, isCorrect) ?? null;

    if (isCorrect) {
      audioService.playCorrect(3);
      const tokenText =
        res && res.tokensAwarded > 0
          ? ` ＋${res.tokensAwarded} Tokens！`
          : '（今日小屋代幣上限 25 已滿，親密度照常增加！）';
      const lvlText = res?.leveledUp ? ` 🎉 升級 Lv.${res.newLevel}！` : '';
      setQuizFeedback(`✅ 答對了！親密度 +2 ♥${tokenText}${lvlText} ${activeQuiz.tip}`);
    } else {
      audioService.playNudge();
      setQuizFeedback(`💡 沒關係，記起來喔：${activeQuiz.tip}`);
    }
  };

  const activeBuddyFriendship = selectedBuddy
    ? getFriendshipProgress(player.critterFriendship?.[selectedBuddy.collectibleId]?.xp ?? 0)
    : null;

  return (
    <div className="space-y-4">
      {/* Header + Daily Room Care Status + Theme Switcher */}
      <div className="rounded-3xl border-2 border-[#E5DFD3] bg-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917] flex items-center gap-2">
              <Home className="h-5 w-5 text-[#DB2777]" />
              <span>🏠 My Critter Room 我的盲盒小屋 2.0</span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#57534E]">
              點選小屋夥伴可以 <strong className="text-[#DB2777]">摸摸頭、餵每日免費點心、玩雙語隨堂小考</strong> 提升親密度 Lv.1→Lv.5！
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FDBA74] px-3 py-1 text-xs font-extrabold text-[#C2410C] tabular-nums">
              <Cookie className="h-3.5 w-3.5" />
              點心 {dailyStatus.treatsRemaining}/{dailyStatus.treatsTotal}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309] tabular-nums">
              <Coins className="h-3.5 w-3.5 text-[#D97706]" />
              今日獎勵 {dailyStatus.tokensEarnedToday}/{dailyStatus.dailyTokenCap}
            </span>
            <span className="rounded-full bg-[#FDF2F8] border border-[#F9A8D4] px-3 py-1 text-xs font-extrabold text-[#BE185D] tabular-nums">
              {placedCount} / {CRITTER_ROOM_SLOT_COUNT} Placed
            </span>
          </div>
        </div>

        {/* 8 Free Dreamy Room Themes */}
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

      {/* Interactive Buddy Care & Bilingual Pop-Quiz Card (above the stage so nothing is covered) */}
      {selectedBuddy && activeBuddyFriendship && (
        <div className="rounded-3xl border-2 border-[#1C1917] bg-white p-4 shadow-[0_4px_0_#1C1917] space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2.5">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-base font-extrabold text-[#1C1917]">
                  ✨ {selectedBuddy.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#F9A8D4] bg-[#FDF2F8] px-2.5 py-0.5 text-xs font-extrabold text-[#BE185D] tabular-nums">
                  <Heart className="h-3 w-3 fill-[#EC4899] text-[#EC4899]" />
                  Lv.{activeBuddyFriendship.level}
                  {activeBuddyFriendship.isMax
                    ? ' MAX'
                    : ` (${activeBuddyFriendship.xp}/${activeBuddyFriendship.nextThreshold})`}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#57534E] leading-snug">
                “{selectedBuddy.line}”
              </p>
              {/* Friendship progress bar */}
              <div className="h-2 w-44 sm:w-56 overflow-hidden rounded-full bg-[#FCE7F3] border border-[#F9A8D4]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#F59E0B] transition-all"
                  style={{ width: `${activeBuddyFriendship.pct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setPickingSlot(selectedBuddy.slotIndex)}
                className="qv-btn rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] px-2.5 py-1.5 text-[11px] font-extrabold text-[#4338CA]"
              >
                Swap 換隻
              </button>
              <button
                type="button"
                onClick={() => {
                  onPlaceRoomCritter(selectedBuddy.slotIndex, null);
                  setSelectedBuddy(null);
                  setActiveQuiz(null);
                  audioService.playToken();
                }}
                aria-label="Remove critter from slot"
                className="qv-btn rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-1.5 text-[#DC2626]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Care Action Row: Pet, 3 Daily Treats, Pop-Quiz */}
          <div className="flex flex-wrap items-center gap-2">
            {onPetCritter && (
              <button
                type="button"
                onClick={handlePet}
                className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#F472B6] bg-[#FDF2F8] px-3 py-1.5 text-xs font-extrabold text-[#BE185D]"
              >
                <Heart className="h-3.5 w-3.5 fill-current" />
                <span>摸摸頭 Pet</span>
              </button>
            )}

            {onFeedCritterTreat &&
              ROOM_TREATS.map((treat) => (
                <button
                  key={treat.id}
                  type="button"
                  disabled={dailyStatus.treatsRemaining <= 0}
                  onClick={() => handleFeed(treat)}
                  className="qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl border-2 border-[#FDBA74] bg-[#FFF7ED] px-2.5 py-1.5 text-xs font-extrabold text-[#9A3412] disabled:opacity-45"
                >
                  <span>{treat.emoji}</span>
                  <span>餵{treat.zhName}</span>
                </button>
              ))}

            {onAnswerRoomPopQuiz && (
              <button
                type="button"
                onClick={startPopQuiz}
                className="qv-arcade-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#2563EB] px-3.5 py-1.5 font-display text-xs font-extrabold text-white"
                style={{ borderBottomColor: '#1E3A8A' }}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>🎯 夥伴出題考我！ (+5)</span>
              </button>
            )}
          </div>

          {careNotice && (
            <div className="rounded-xl border border-[#FBCFE8] bg-[#FFF1F5] px-3 py-2 text-xs font-extrabold text-[#9D174D]">
              {careNotice}
            </div>
          )}

          {/* Inline 2-Choice Bilingual Pop-Quiz Bubble */}
          {activeQuiz && (
            <div className="rounded-2xl border-2 border-[#93C5FD] bg-[#EFF6FF] p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#2563EB] px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                    {activeQuiz.subject === 'english' ? '📘 英文驚喜小考' : '🏮 中文驚喜小考'}
                  </span>
                  <span className="font-display text-base sm:text-lg font-extrabold text-[#1C1917]">
                    {activeQuiz.subject === 'chinese' && activeQuiz.zhuyin ? (
                      <RubyWord
                        word={activeQuiz.word}
                        zhuyin={activeQuiz.zhuyin}
                        showZhuyin={localZhuyin}
                      />
                    ) : (
                      activeQuiz.word
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => audioService.speak(activeQuiz.speakText, activeQuiz.speakLang)}
                    aria-label="Speak quiz word"
                    className="qv-btn inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#93C5FD] bg-white text-[#1D4ED8]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                {activeQuiz.subject === 'chinese' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onToggleZhuyin) onToggleZhuyin();
                      else setLocalZhuyin((v) => !v);
                    }}
                    className="qv-btn rounded-lg border border-[#BFDBFE] bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#1E40AF]"
                  >
                    注音：{localZhuyin ? '開' : '關'}
                  </button>
                )}
              </div>

              <p className="text-xs font-bold text-[#1E3A8A]">{activeQuiz.prompt}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeQuiz.choices.map((choice, idx) => {
                  const answered = quizSelected !== null;
                  const isRight = idx === activeQuiz.correctIndex;
                  const isPicked = idx === quizSelected;
                  return (
                    <button
                      key={`${activeQuiz.id}-${idx}`}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswerPopQuiz(idx)}
                      className={`qv-btn min-h-[44px] rounded-xl border-2 px-3 py-2 text-left text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-between gap-2 ${
                        !answered
                          ? 'border-[#1C1917] bg-white text-[#1C1917] hover:bg-[#FEF3C7]'
                          : isRight
                            ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                            : isPicked
                              ? 'border-[#E11D48] bg-[#FFF1F2] text-[#BE123C]'
                              : 'border-[#E5DFD3] bg-white/60 text-[#78716C]'
                      }`}
                    >
                      <span>{choice}</span>
                      {answered && isRight && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                      {answered && isPicked && !isRight && <XCircle className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {quizFeedback && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white border border-[#BFDBFE] px-3 py-2">
                  <span className="text-xs font-extrabold text-[#1C1917]">{quizFeedback}</span>
                  <button
                    type="button"
                    onClick={startPopQuiz}
                    className="qv-btn shrink-0 rounded-lg border border-[#1C1917] bg-[#FEF3C7] px-2.5 py-1 text-xs font-extrabold text-[#92400E]"
                  >
                    再來一題 →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Interactive Room Stage */}
      <div className="relative overflow-hidden rounded-3xl border-3 border-[#1C1917] shadow-[0_6px_0_#1C1917] aspect-[16/10] sm:aspect-[16/9] select-none">
        <CritterRoomBackdrop themeId={activeTheme.id} decorIds={activeDecorIds} />

        {/* 8 Interactive Placement Slots */}
        {ROOM_SLOT_POSITIONS.map((pos) => {
          const cid = room.slots[pos.slotIndex] ?? null;
          const item = cid ? getCollectibleById(cid) : null;
          const isShiny = Boolean(cid && (player.vault[cid] ?? 0) > 0 && player.shinyVault?.[cid]);
          const isBouncing = selectedBuddy?.slotIndex === pos.slotIndex;
          const isPickingThis = pickingSlot === pos.slotIndex;
          const buddyLvl = cid
            ? getFriendshipProgress(player.critterFriendship?.[cid]?.xp ?? 0).level
            : 1;

          return (
            <button
              key={pos.slotIndex}
              type="button"
              onClick={() => {
                if (cid && item) {
                  handleTapPlacedCritter(pos.slotIndex, cid);
                } else {
                  setSelectedBuddy(null);
                  setActiveQuiz(null);
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
                isBouncing
                  ? 'scale-95 sm:scale-110 -translate-y-[60%]'
                  : 'scale-[0.82] sm:scale-100 -translate-y-1/2 hover:scale-90 sm:hover:scale-105'
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
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[#1C1917] bg-[#FDF2F8] px-1.5 py-0.2 text-[9px] font-extrabold text-[#BE185D] whitespace-nowrap">
                    ♥Lv.{buddyLvl}
                  </span>
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
                const lvl = getFriendshipProgress(player.critterFriendship?.[item.id]?.xp ?? 0).level;
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
                    <div className="mt-0.5 flex items-center justify-center gap-1">
                      <span className="rounded-full bg-[#FDF2F8] px-1.5 py-0.5 text-[10px] font-extrabold text-[#BE185D]">
                        ♥Lv.{lvl}
                      </span>
                      {alreadyInSlot !== -1 && (
                        <span className="rounded-full bg-[#EEF2FF] px-1.5 py-0.5 text-[10px] font-extrabold text-[#4338CA]">
                          #{alreadyInSlot + 1}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Furniture & Decor Stickers Drawer (16 items, max 6 active) */}
      <div className="rounded-3xl border-2 border-[#E5DFD3] bg-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-extrabold text-[#1C1917]">
              ✨ Room Decor 小屋擺飾貼紙（{ROOM_DECOR_ITEMS.length} 件）
            </h3>
            <p className="text-xs font-semibold text-[#78716C]">
              Tap to place or remove up to {CRITTER_ROOM_MAX_DECOR} cute stickers in your room (including 4 Adventure Map exclusive designs!).
            </p>
          </div>
          <span className="rounded-full bg-[#EEF2FF] border border-[#C7D2FE] px-2.5 py-0.5 text-xs font-extrabold text-[#4338CA] tabular-nums">
            {activeDecorIds.length} / {CRITTER_ROOM_MAX_DECOR}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {ROOM_DECOR_ITEMS.map((decor) => {
            const isPlaced = activeDecorIds.includes(decor.id);
            const isLockedExclusive = Boolean(decor.adventureReward && !unlockedRewardSet.has(decor.id));
            const isAtLimit = !isPlaced && activeDecorIds.length >= CRITTER_ROOM_MAX_DECOR;
            const hasCrownUnlock = Boolean(decor.adventureReward && unlockedRewardSet.has(decor.id));
            return (
              <button
                key={decor.id}
                type="button"
                disabled={isLockedExclusive || isAtLimit}
                title={isLockedExclusive ? '完成 7 天尋寶冒險地圖全勤即可解鎖！' : undefined}
                onClick={() => {
                  if (isLockedExclusive) return;
                  onToggleRoomDecor?.(decor.id);
                  audioService.playToken();
                }}
                className={`qv-btn min-h-[42px] rounded-2xl border-2 px-2.5 py-1.5 text-left transition-all disabled:opacity-55 ${
                  isLockedExclusive
                    ? 'border-dashed border-[#D6D3D1] bg-[#F5F5F4]'
                    : isPlaced
                      ? 'border-[#1C1917] bg-[#EEF2FF] shadow-[0_2px_0_#1C1917]'
                      : hasCrownUnlock
                        ? 'border-[#F59E0B] bg-[#FFFBEB]'
                        : 'border-[#E5DFD3] bg-[#FAF8F4]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base shrink-0">{decor.emoji}</span>
                    <span className="font-display text-xs font-extrabold text-[#1C1917] truncate">
                      {decor.zhName}
                    </span>
                  </span>
                  {isLockedExclusive ? (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#E7E5E4] px-1.5 py-0.5 text-[9px] font-extrabold text-[#57534E] shrink-0">
                      <Lock className="h-2.5 w-2.5" />
                      <span>7天</span>
                    </span>
                  ) : isPlaced ? (
                    <span className="rounded-full bg-[#4338CA] px-1.5 py-0.5 text-[9px] font-extrabold text-white shrink-0">
                      ON
                    </span>
                  ) : hasCrownUnlock ? (
                    <span className="rounded-full bg-[#F59E0B] px-1.5 py-0.5 text-[9px] font-extrabold text-white shrink-0">
                      👑
                    </span>
                  ) : null}
                </div>
                <p className="text-[10px] font-bold text-[#78716C] truncate">
                  {isLockedExclusive ? '7天尋寶全勤解鎖' : decor.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

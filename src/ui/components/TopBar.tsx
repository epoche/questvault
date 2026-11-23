import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  Coins,
  Grid2x2,
  KeyRound,
  NotebookPen,
  Pencil,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { COLLECTIBLES, PACK_COST } from '../../core/packs';
import { getSubjectById, SUBJECTS } from '../../core/registry';
import type { PlayerState, SubjectId } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';

export type NavTab = 'quests' | 'market' | 'vault' | 'writing';

interface TopBarProps {
  player: PlayerState;
  activeTab: NavTab;
  activeSubjectId: SubjectId;
  hideMobileNav?: boolean;
  onSelectTab: (tab: NavTab) => void;
  onSelectSubject: (subjectId: SubjectId) => void;
  onToggleMute: () => void;
  onRenamePlayer: (name: string) => void;
  onOpenParent: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'quests', label: 'Quests', icon: BookOpen },
  { id: 'market', label: 'Packs', icon: ShoppingBag },
  { id: 'vault', label: 'Vault', icon: Grid2x2 },
  { id: 'writing', label: 'Progress', icon: NotebookPen },
];

export const TopBar: React.FC<TopBarProps> = ({
  player,
  activeTab,
  activeSubjectId,
  hideMobileNav = false,
  onSelectTab,
  onSelectSubject,
  onToggleMute,
  onRenamePlayer,
  onOpenParent,
}) => {
  const [subjectMenuOpen, setSubjectMenuOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(player.displayName);

  const activeSubject = getSubjectById(activeSubjectId);

  const commitName = () => {
    const cleaned = draftName.trim();
    if (cleaned) {
      onRenamePlayer(cleaned);
    } else {
      setDraftName(player.displayName);
    }
    setEditingName(false);
  };

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b border-[#E5DFD3] bg-[#FAF7F2]/95 backdrop-blur-sm"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-1.5 sm:gap-3 px-2.5 py-2 sm:px-6 sm:py-3">
          {/* Left: Avatar + Brand + Subject Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onSelectTab('vault')}
              title="Open Vault to switch avatar"
              className="qv-btn relative rounded-2xl border-2 border-[#1C1917] p-0.5 bg-white shrink-0"
            >
              <CollectibleArt
                id={player.equippedCollectibleId}
                size={36}
                shiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
                className="rounded-xl"
              />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                {editingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      aria-label="Player name"
                      value={draftName}
                      maxLength={18}
                      onChange={(e) => setDraftName(e.target.value)}
                      onBlur={commitName}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitName();
                        if (e.key === 'Escape') {
                          setDraftName(player.displayName);
                          setEditingName(false);
                        }
                      }}
                      className="w-28 sm:w-36 rounded-lg border-2 border-[#2563EB] bg-white px-2 py-0.5 font-display text-base font-bold text-[#1C1917] focus:outline-none"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        commitName();
                      }}
                      aria-label="Save player name"
                      className="qv-btn inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelectTab('quests')}
                      className="font-display text-sm sm:text-lg font-extrabold text-[#1C1917] whitespace-nowrap hover:text-[#2563EB] transition-colors"
                      title="Go to Quests Home"
                    >
                      QuestVault
                    </button>

                    {/* Subject Selector Pill (ADR-0006 multi-subject seam) */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setSubjectMenuOpen((v) => !v)}
                        className="qv-btn inline-flex min-h-[32px] sm:min-h-[36px] items-center gap-0.5 sm:gap-1 rounded-full border border-[#D8D0C1] bg-white px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-[#1C1917] whitespace-nowrap"
                      >
                        <span>{activeSubject.shortLabel}</span>
                        <span className="hidden lg:inline text-[#57534E] font-semibold">
                          · {activeSubject.gradeTag}
                        </span>
                        <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#57534E]" />
                      </button>

                      {subjectMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setSubjectMenuOpen(false)}
                          />
                          <div className="qv-surface fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:left-0 sm:top-auto sm:mt-2 z-40 sm:w-64 rounded-2xl p-2">
                            {SUBJECTS.map((subj) => {
                              const isActive = subj.id === activeSubjectId;
                              return (
                                <button
                                  key={subj.id}
                                  type="button"
                                  disabled={subj.status !== 'active'}
                                  onClick={() => {
                                    onSelectSubject(subj.id);
                                    setSubjectMenuOpen(false);
                                  }}
                                  className={`flex w-full items-start justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
                                    isActive
                                      ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                                      : subj.status === 'active'
                                        ? 'text-[#1C1917] hover:bg-[#F3EFE7]'
                                        : 'text-[#57534E] opacity-70 cursor-not-allowed'
                                  }`}
                                >
                                  <div>
                                    <div className="text-sm font-bold">{subj.label}</div>
                                    <div className="text-xs leading-snug opacity-85">
                                      {subj.description}
                                    </div>
                                  </div>
                                  <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold border ${
                                      isActive
                                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                        : 'bg-white border-[#E5DFD3] text-[#57534E]'
                                    }`}
                                  >
                                    {isActive ? 'Active' : subj.status === 'active' ? 'Play' : 'Soon'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#57534E] whitespace-nowrap truncate tabular-nums">
                <button
                  type="button"
                  onClick={() => {
                    setDraftName(player.displayName);
                    setEditingName(true);
                  }}
                  aria-label="Edit player name"
                  title="Edit player name"
                  className="inline-flex items-center gap-1 hover:text-[#2563EB] transition-colors"
                >
                  <span>{player.displayName}</span>
                  <Pencil className="h-3 w-3 opacity-70" />
                </button>
                <span>· {Object.keys(player.vault).length}/{COLLECTIBLES.length} Vault</span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 rounded-2xl border border-[#E5DFD3] bg-[#F3EFE7] p-1 shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`qv-btn inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#2563EB]' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Token Pill + Parent Corner + Mute */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectTab('market')}
              className="qv-btn inline-flex min-h-[36px] sm:min-h-[38px] items-center gap-1 sm:gap-1.5 rounded-full border-2 border-[#1C1917] bg-[#FEF3C7] px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-display text-xs sm:text-sm font-extrabold text-[#1C1917] tabular-nums whitespace-nowrap"
              title="Spend Tokens in Packs"
            >
              <Coins className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#D97706]" />
              <span>{player.tokens}</span>
              {player.tokens >= PACK_COST && (
                <Sparkles className="hidden sm:inline h-3.5 w-3.5 text-[#D97706]" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenParent}
              aria-label="Parent Corner"
              title="家長檢視室 Parent Corner"
              className="qv-btn inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#E5DFD3] bg-white text-[#57534E] hover:text-[#1C1917]"
            >
              <KeyRound className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              aria-label={player.muted ? 'Unmute audio' : 'Mute audio'}
              className="qv-btn inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#E5DFD3] bg-white text-[#57534E] hover:text-[#1C1917]"
            >
              {player.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Portrait Tablet Bottom Tab Bar — hidden during active Quests / Warm-Up */}
      {!hideMobileNav && (
        <nav
          className="fixed bottom-0 inset-x-0 z-30 flex lg:hidden items-center justify-around border-t border-[#E5DFD3] bg-[#FAF7F2]/96 backdrop-blur-sm px-2 pt-1.5"
          style={{ paddingBottom: 'calc(0.45rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`qv-btn flex min-h-[44px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 text-xs font-bold ${
                  isActive ? 'text-[#2563EB]' : 'text-[#57534E]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
};

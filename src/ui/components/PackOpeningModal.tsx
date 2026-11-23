import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Coins, RefreshCw, Sparkles, UserCheck, X } from 'lucide-react';
import { audioService } from '../../core/audio';
import { getPackById, PACK_COST, RARITY_CONFIGS } from '../../core/packs';
import type { Collectible, PackId } from '../../core/types';
import { CollectibleArt, PackEnvelopeArt } from '../artwork/CollectibleArt';

export interface PackPullViewData {
  packId: PackId;
  collectible: Collectible;
  isNew: boolean;
  newCount: number;
}

interface PackOpeningModalProps {
  pull: PackPullViewData | null;
  tokensRemaining: number;
  isEquipped: boolean;
  onClose: () => void;
  onOpenAnother: (packId: PackId) => void;
  onEquip: (collectibleId: string) => void;
  onSellDuplicate: (collectibleId: string) => void;
}

export const PackOpeningModal: React.FC<PackOpeningModalProps> = ({
  pull,
  tokensRemaining,
  isEquipped,
  onClose,
  onOpenAnother,
  onEquip,
  onSellDuplicate,
}) => {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<'shaking' | 'revealed'>('shaking');
  const [soldThisPull, setSoldThisPull] = useState(false);
  const timerRef = React.useRef<number | null>(null);

  const revealNow = React.useCallback(
    (rarity: Collectible['rarity']) => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setPhase((current) => {
        if (current === 'revealed') return current;
        audioService.playPackReveal(rarity);
        return 'revealed';
      });
    },
    [],
  );

  useEffect(() => {
    if (!pull) return;
    setSoldThisPull(false);

    if (prefersReduced) {
      setPhase('revealed');
      audioService.playPackReveal(pull.collectible.rarity);
      return;
    }

    setPhase('shaking');
    audioService.playPackShake();

    timerRef.current = window.setTimeout(() => {
      revealNow(pull.collectible.rarity);
    }, 520);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pull, prefersReduced, revealNow]);

  useEffect(() => {
    if (!pull) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'revealed') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pull, phase, onClose]);

  if (!pull) return null;

  const rarityInfo = RARITY_CONFIGS[pull.collectible.rarity];
  const packCost = getPackById(pull.packId)?.cost ?? PACK_COST;
  const isHighRarity =
    pull.collectible.rarity === 'epic' ||
    pull.collectible.rarity === 'legendary' ||
    pull.collectible.rarity === 'chroma';
  const isChroma = pull.collectible.rarity === 'chroma';

  return (
    <AnimatePresence>
      <motion.div
        key="pack-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/65 backdrop-blur-xs p-4"
        onClick={() => {
          if (phase === 'revealed') onClose();
        }}
      >
        <motion.div
          key="pack-stage"
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border-2 border-[#1C1917] bg-[#FAF7F2] p-6 text-center shadow-2xl overflow-hidden"
        >
          {/* Close button always accessible once revealed */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reveal"
            className="qv-btn absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DFD3] bg-white text-[#57534E] hover:text-[#1C1917]"
          >
            <X className="h-4 w-4" />
          </button>

          {phase === 'shaking' ? (
            <div className="py-10 flex flex-col items-center">
              <motion.div
                animate={{
                  rotate: [0, -7, 7, -9, 9, 0],
                  scale: [1, 1.04, 1.06, 1.09, 1.12, 1.16],
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                onClick={() => revealNow(pull.collectible.rarity)}
                className="cursor-pointer"
              >
                <PackEnvelopeArt packId={pull.packId} size={142} />
              </motion.div>
              <p className="mt-5 font-display text-xl font-extrabold text-[#1C1917]">
                Ripping open pack...
              </p>
            </div>
          ) : (
            <div className="pt-2 flex flex-col items-center">
              {/* Soft rarity burst ring behind Collectible */}
              <div className="relative flex items-center justify-center my-2">
                {!prefersReduced && isHighRarity && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0.9 }}
                    animate={{ scale: 1.45, opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`pointer-events-none absolute h-36 w-36 rounded-full ${
                      isChroma ? 'qv-chroma-bg' : ''
                    }`}
                    style={!isChroma ? { backgroundColor: rarityInfo.colorHex } : undefined}
                  />
                )}

                <motion.div
                  initial={prefersReduced ? { opacity: 0 } : { scale: 0.55, y: 18, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  className={`rounded-3xl p-1.5 ${
                    isChroma ? 'qv-chroma-bg' : ''
                  }`}
                  style={
                    !isChroma
                      ? {
                          backgroundColor: rarityInfo.bgTintHex,
                          border: `2.5px solid ${rarityInfo.colorHex}`,
                        }
                      : undefined
                  }
                >
                  <div className="rounded-[20px] bg-white p-2">
                    <CollectibleArt id={pull.collectible.id} size={136} />
                  </div>
                </motion.div>
              </div>

              {/* Rarity + New/Duplicate pills arrive together */}
              <motion.div
                initial={prefersReduced ? { opacity: 0 } : { y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: prefersReduced ? 0 : 0.14, duration: 0.25 }}
                className="mt-3 flex flex-wrap items-center justify-center gap-2"
              >
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white ${
                    isChroma ? 'qv-chroma-bg' : ''
                  }`}
                  style={!isChroma ? { backgroundColor: rarityInfo.colorHex } : undefined}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {rarityInfo.label}
                </span>

                {pull.isNew ? (
                  <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-extrabold text-[#047857]">
                    NEW IN VAULT
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center rounded-full bg-[#F3EFE7] px-3 py-1 text-xs font-bold text-[#57534E] tabular-nums">
                      Owned ×{soldThisPull ? Math.max(1, pull.newCount - 1) : pull.newCount}
                    </span>
                    {!soldThisPull && (
                      <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-extrabold text-[#B45309] tabular-nums">
                        {pull.newCount >= 3 ? '✨ Ready for Shiny in Vault!' : `${pull.newCount}/3 toward ✨ Shiny`}
                      </span>
                    )}
                  </>
                )}
              </motion.div>

              <motion.h2
                initial={prefersReduced ? { opacity: 0 } : { y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: prefersReduced ? 0 : 0.18, duration: 0.25 }}
                className="mt-3 font-display text-3xl font-extrabold text-[#1C1917]"
              >
                {pull.collectible.name}
              </motion.h2>

              <p className="mt-1 max-w-xs text-sm text-[#57534E]">
                {pull.collectible.tagline}
              </p>

              {/* Immediate interactive actions */}
              <div className="mt-6 flex w-full flex-col gap-2.5">
                {!pull.isNew && !soldThisPull ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      disabled={isEquipped}
                      onClick={() => onEquip(pull.collectible.id)}
                      className={`qv-btn inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 text-sm font-bold ${
                        isEquipped
                          ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                          : 'border-[#1C1917] bg-white text-[#1C1917]'
                      }`}
                    >
                      {isEquipped ? <Check className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      <span>{isEquipped ? 'Equipped' : 'Set Avatar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSellDuplicate(pull.collectible.id);
                        setSoldThisPull(true);
                      }}
                      className="qv-btn inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-3 py-2.5 text-sm font-bold text-[#1C1917] tabular-nums"
                    >
                      <Coins className="h-4 w-4 text-[#D97706]" />
                      <span>Sell +{rarityInfo.resaleTokens}</span>
                    </button>
                    {tokensRemaining >= packCost && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="qv-btn col-span-2 inline-flex items-center justify-center rounded-2xl border border-[#E5DFD3] bg-white px-3 py-2 text-xs font-bold text-[#57534E] hover:border-[#1C1917] hover:text-[#1C1917]"
                      >
                        Keep Duplicate &amp; Done
                      </button>
                    )}
                  </div>
                ) : tokensRemaining >= packCost ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      disabled={isEquipped}
                      onClick={() => onEquip(pull.collectible.id)}
                      className={`qv-btn inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 text-sm font-bold ${
                        isEquipped
                          ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                          : 'border-[#1C1917] bg-white text-[#1C1917]'
                      }`}
                    >
                      {isEquipped ? <Check className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      <span>{isEquipped ? 'Equipped' : 'Set Avatar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="qv-btn inline-flex items-center justify-center rounded-2xl border-2 border-[#E5DFD3] bg-white px-3 py-2.5 text-sm font-bold text-[#57534E]"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isEquipped}
                    onClick={() => onEquip(pull.collectible.id)}
                    className={`qv-btn inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold ${
                      isEquipped
                        ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                        : 'border-[#1C1917] bg-white text-[#1C1917]'
                    }`}
                  >
                    {isEquipped ? <Check className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    <span>{isEquipped ? 'Equipped as Avatar' : 'Set Avatar'}</span>
                  </button>
                )}

                {tokensRemaining >= packCost ? (
                  <button
                    type="button"
                    onClick={() => onOpenAnother(pull.packId)}
                    className="qv-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-4 py-3 font-display text-base font-extrabold text-white tabular-nums"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Open Another ({packCost} Tokens)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="qv-btn w-full rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-4 py-3 font-display text-base font-extrabold text-white"
                  >
                    Back to Market
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

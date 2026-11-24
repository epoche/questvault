import React from 'react';
import { Coins, RotateCcw, Sparkles } from 'lucide-react';
import { CollectibleArt } from '../artwork/CollectibleArt';

export interface QuestSummaryCardProps {
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  emblemCollectibleId: string;
  title: string;
  subtitle: string;
  tokensAwarded: number;
  tokensLabel?: string;
  primaryBgHex?: string;
  primaryBorderBottomHex?: string;
  retryLabel: string;
  exitLabel: string;
  marketLabel: string;
  onRetry: () => void;
  onExit: () => void;
  onGoToMarket: () => void;
  extra?: React.ReactNode;
}

export const QuestSummaryCard: React.FC<QuestSummaryCardProps> = ({
  equippedCollectibleId,
  isAvatarShiny = false,
  emblemCollectibleId,
  title,
  subtitle,
  tokensAwarded,
  tokensLabel,
  primaryBgHex = '#2563EB',
  primaryBorderBottomHex = '#1E3A8A',
  retryLabel,
  exitLabel,
  marketLabel,
  onRetry,
  onExit,
  onGoToMarket,
  extra,
}) => {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-6 sm:p-8 text-center shadow-[0_6px_0_#1C1917] space-y-5">
        <div className="mx-auto flex items-center justify-center gap-3">
          <CollectibleArt id={equippedCollectibleId} size={64} shiny={isAvatarShiny} />
          <CollectibleArt id={emblemCollectibleId} size={64} />
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
            {title}
          </h1>
          <p className="text-sm font-bold text-[#57534E] tabular-nums">{subtitle}</p>
        </div>

        <div className="mx-auto inline-flex items-center gap-2 rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] px-5 py-2.5 font-display text-lg font-extrabold text-[#B45309] tabular-nums">
          <Coins className="h-5 w-5 text-[#D97706]" />
          <span>{tokensLabel ?? `+${tokensAwarded} Tokens`}</span>
        </div>

        {extra}

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-white px-5 py-2.5 font-display text-sm font-extrabold text-[#1C1917]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{retryLabel}</span>
          </button>
          <button
            type="button"
            onClick={onExit}
            className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] px-5 py-2.5 font-display text-sm font-extrabold text-white"
            style={{ backgroundColor: primaryBgHex, borderBottomColor: primaryBorderBottomHex }}
          >
            <span>{exitLabel}</span>
          </button>
          {tokensAwarded > 0 && (
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-btn inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl border-2 border-[#F59E0B] bg-[#FEF3C7] px-5 py-2.5 font-display text-sm font-extrabold text-[#92400E]"
            >
              <Sparkles className="h-4 w-4" />
              <span>{marketLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

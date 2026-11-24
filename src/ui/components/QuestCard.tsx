import React from 'react';
import { CheckCircle2, Coins, Sparkles } from 'lucide-react';
import type { QuestRewardPolicy } from '../../core/economy';
import { CollectibleArt } from '../artwork/CollectibleArt';

export function renderDoneRewardBadge(
  policy: QuestRewardPolicy,
  isZh: boolean,
  defaultLabel: string,
): React.ReactNode {
  if (policy.tier === 'practice-0') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#475569]">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#64748B]" />
        {isZh ? '今日已領 · +0' : 'Claimed · +0'}
      </span>
    );
  }
  if (policy.tier === 'full-srs-due') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#059669] px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
        <Sparkles className="h-3.5 w-3.5" />
        {isZh ? 'SRS 複習 100%' : 'SRS Due · 100%'}
      </span>
    );
  }
  if (policy.tier === 'review-50') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309]">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#047857]" />
        {isZh ? '複習 50%' : 'Review 50%'}
      </span>
    );
  }
  if (policy.tier === 'math-diminished') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309]">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#047857]" />
        30% Practice
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {defaultLabel}
    </span>
  );
}

export interface QuestCardProps {
  emblemCollectibleId: string;
  emblemSize?: number;
  emblemExtra?: React.ReactNode;
  bgHex: string;
  accentHex: string;
  tag: React.ReactNode;
  statusBadge?: React.ReactNode;
  rewardRange?: string;
  done?: boolean;
  policy?: QuestRewardPolicy;
  isZh?: boolean;
  doneDefaultLabel?: string;
  title: React.ReactNode;
  titleSize?: 'lg' | 'xl';
  subtitle?: React.ReactNode;
  onClick: () => void;
  children?: React.ReactNode;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  emblemCollectibleId,
  emblemSize = 60,
  emblemExtra,
  bgHex,
  accentHex,
  tag,
  statusBadge,
  rewardRange,
  done = false,
  policy,
  isZh = false,
  doneDefaultLabel = 'Cleared',
  title,
  titleSize = 'lg',
  subtitle,
  onClick,
  children,
}) => {
  const resolvedBadge =
    statusBadge !== undefined ? (
      statusBadge
    ) : done && policy ? (
      renderDoneRewardBadge(policy, isZh, doneDefaultLabel)
    ) : rewardRange ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
        <Coins className="h-3.5 w-3.5" />
        {rewardRange}
      </span>
    ) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
    >
      <div
        className="px-5 py-4 flex items-center justify-between gap-3"
        style={{ backgroundColor: bgHex }}
      >
        {emblemExtra ? (
          <div className="flex items-center gap-3">
            <CollectibleArt
              id={emblemCollectibleId}
              size={emblemSize}
              className="border-2 border-[#1C1917]"
            />
            {emblemExtra}
          </div>
        ) : (
          <CollectibleArt
            id={emblemCollectibleId}
            size={emblemSize}
            className="border-2 border-[#1C1917]"
          />
        )}
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
            style={{ backgroundColor: accentHex }}
          >
            {tag}
          </span>
          {resolvedBadge}
        </div>
      </div>
      <div className="p-5 space-y-2.5">
        <h3
          className={`font-display ${titleSize === 'xl' ? 'text-xl' : 'text-lg'} font-extrabold text-[#1C1917]`}
        >
          {title}
        </h3>
        {subtitle && <p className="text-xs font-semibold text-[#57534E]">{subtitle}</p>}
        {children}
      </div>
    </button>
  );
};

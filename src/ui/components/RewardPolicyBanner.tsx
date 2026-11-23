import React from 'react';
import { RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import type { QuestRewardPolicy } from '../../core/economy';

interface RewardPolicyBannerProps {
  policy?: QuestRewardPolicy;
  lang?: 'en' | 'zh';
  compact?: boolean;
}

export const RewardPolicyBanner: React.FC<RewardPolicyBannerProps> = ({
  policy,
  lang = 'en',
  compact = false,
}) => {
  if (!policy) return null;
  if (
    policy.tier === 'full-new' ||
    policy.tier === 'full-special' ||
    policy.tier === 'full-math'
  ) {
    return null;
  }

  const isZh = lang === 'zh';

  if (policy.tier === 'full-srs-due') {
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] font-extrabold text-[#065F46] ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-xs sm:text-sm'
        }`}
      >
        <Sparkles className="h-4 w-4 shrink-0 text-[#059669]" />
        <span>
          {isZh
            ? `遺忘曲線到期複習（${policy.dueWordCount} 詞到期）· 享 100% 全額代幣！`
            : `SRS Review Due (${policy.dueWordCount} words due) · 100% Full Tokens!`}
        </span>
      </div>
    );
  }

  if (policy.tier === 'review-50') {
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-[#D97706] bg-[#FFFBEB] font-extrabold text-[#92400E] ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-xs sm:text-sm'
        }`}
      >
        <RefreshCw className="h-4 w-4 shrink-0 text-[#D97706]" />
        <span>
          {isZh
            ? '舊關卡複習模式：本次領取 50% 複習代幣（挑戰新關卡可拿 100%！）'
            : 'Review Mode: 50% Review Tokens on completed quests (try a new quest for 100%!)'}
        </span>
      </div>
    );
  }

  if (policy.tier === 'math-diminished') {
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-[#D97706] bg-[#FFFBEB] font-extrabold text-[#92400E] ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-xs sm:text-sm'
        }`}
      >
        <RefreshCw className="h-4 w-4 shrink-0 text-[#D97706]" />
        <span>
          {isZh
            ? '本單元今日已領 2 次全額，第 3 次起享 30% 練習代幣（換其他單元可拿 100%！）'
            : '3rd+ run on this unit today: 30% Practice Tokens (pick another unit for 100%!)'}
        </span>
      </div>
    );
  }

  // practice-0
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-[#64748B] bg-[#F1F5F9] font-extrabold text-[#334155] ${
        compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-xs sm:text-sm'
      }`}
    >
      <ShieldCheck className="h-4 w-4 shrink-0 text-[#475569]" />
      <span>
        {isZh
          ? '今日已領過本關獎勵 · 純練習模式（+0 代幣，去挑戰還沒破的新關卡拿 100% 吧！）'
          : 'Already claimed today · Practice Mode (+0 Tokens — try a new quest for 100%!)'}
      </span>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Search,
  Volume2,
  XCircle,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import { applyQuestRewardMultiplier, type QuestRewardPolicy } from '../../core/economy';
import type { LookAlikeHanziSet } from '../../subjects/chinese/lookAlikeTypes';
import { QuestSummaryCard } from '../components/QuestSummaryCard';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { RubySentence } from '../components/RubySentence';
import { RubyWord } from '../components/RubyWord';
import { LETTER_CHOICE_PALETTE as CHOICE_COLORS } from '../theme/choicePalette';

export interface LookAlikeCompletionPayload {
  setId: string;
  title: string;
  correctCount: number;
  totalQuestions: number;
  rawTokensEarned: number;
  wordOutcomes: { word: string; tier: LookAlikeHanziSet['tier']; outcome: 'clean' | 'missed' }[];
}

interface LookAlikeHanziViewProps {
  questSet: LookAlikeHanziSet;
  equippedCollectibleId: string;
  isAvatarShiny?: boolean;
  showZhuyin: boolean;
  rewardPolicy: QuestRewardPolicy;
  onToggleZhuyin: () => void;
  onComplete: (payload: LookAlikeCompletionPayload) => void;
  onExit: () => void;
  onGoToMarket: () => void;
}

export const LookAlikeHanziView: React.FC<LookAlikeHanziViewProps> = ({
  questSet,
  equippedCollectibleId,
  isAvatarShiny = false,
  showZhuyin,
  rewardPolicy,
  onToggleZhuyin,
  onComplete,
  onExit,
  onGoToMarket,
}) => {
  const [lockedPolicy, setLockedPolicy] = useState<QuestRewardPolicy>(() => rewardPolicy);
  const [stage, setStage] = useState<'compare' | 'sprint' | 'done'>('compare');
  const [qIndex, setQIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finalAwarded, setFinalAwarded] = useState(0);

  const answeringRef = useRef(false);
  const settledRef = useRef(false);
  const outcomesRef = useRef<LookAlikeCompletionPayload['wordOutcomes']>([]);
  const correctCountRef = useRef(0);

  useEffect(() => () => audioService.stopSpeech(), []);

  const handleRestart = () => {
    audioService.stopSpeech();
    setLockedPolicy(rewardPolicy);
    answeringRef.current = false;
    settledRef.current = false;
    outcomesRef.current = [];
    correctCountRef.current = 0;
    setStage('compare');
    setQIndex(0);
    setSelectedChoice(null);
    setCorrectCount(0);
    setFinalAwarded(0);
  };

  const handleChoose = (idx: number) => {
    if (answeringRef.current || selectedChoice !== null || settledRef.current) return;
    const q = questSet.questions[qIndex];
    if (!q) return;

    answeringRef.current = true;
    setSelectedChoice(idx);

    const isRight = idx === q.correctIndex;
    outcomesRef.current = [
      ...outcomesRef.current,
      { word: q.targetChar, tier: questSet.tier, outcome: isRight ? 'clean' : 'missed' },
    ];
    if (isRight) {
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
      audioService.playCorrect(correctCountRef.current);
    } else {
      audioService.playNudge();
    }
  };

  const handleNext = () => {
    if (!answeringRef.current || selectedChoice === null || settledRef.current) return;
    audioService.stopSpeech();
    const nextIdx = qIndex + 1;
    if (nextIdx >= questSet.questions.length) {
      settledRef.current = true;
      const rawTokens = 15 + correctCountRef.current * 4 + (correctCountRef.current === questSet.questions.length ? 5 : 0);
      const awarded = applyQuestRewardMultiplier(rawTokens, lockedPolicy.multiplier);
      setFinalAwarded(awarded);
      onComplete({
        setId: questSet.id,
        title: `形近字：${questSet.title}`,
        correctCount: correctCountRef.current,
        totalQuestions: questSet.questions.length,
        rawTokensEarned: rawTokens,
        wordOutcomes: outcomesRef.current,
      });
      setStage('done');
      audioService.playChest();
      return;
    }

    answeringRef.current = false;
    setQIndex(nextIdx);
    setSelectedChoice(null);
  };

  // ── Stage 3: Completion Summary ──
  if (stage === 'done') {
    const acc = Math.round((correctCount / Math.max(1, questSet.questions.length)) * 100);
    return (
      <QuestSummaryCard
        equippedCollectibleId={equippedCollectibleId}
        isAvatarShiny={isAvatarShiny}
        emblemCollectibleId={questSet.emblemCollectibleId}
        title={`🔍 ${questSet.title} 辨字通關！`}
        subtitle={`答對 ${correctCount} / ${questSet.questions.length} 題（正確率 ${acc}%）`}
        tokensAwarded={finalAwarded}
        primaryBgHex="#DB2777"
        primaryBorderBottomHex="#9D174D"
        retryLabel="再複習一次"
        exitLabel="回學習主頁"
        marketLabel="去抽盲盒！"
        onRetry={handleRestart}
        onExit={onExit}
        onGoToMarket={onGoToMarket}
      />
    );
  }

  // ── Stage 1: Side-by-Side Twin Visual Diff Lab ──
  if (stage === 'compare') {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回首頁</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#FBCFE8] bg-[#FDF2F8] px-3 py-1 text-xs font-extrabold text-[#BE185D]">
              Stage 1 · 雙胞胎放大鏡對比
            </span>
            <button
              type="button"
              onClick={onToggleZhuyin}
              className={`qv-btn rounded-xl border px-3 py-1 text-xs font-extrabold ${
                showZhuyin
                  ? 'border-[#DB2777] bg-[#FDF2F8] text-[#BE185D]'
                  : 'border-[#E5DFD3] bg-white text-[#57534E]'
              }`}
            >
              注音：{showZhuyin ? '開' : '關'}
            </button>
          </div>
        </div>

        <RewardPolicyBanner policy={lockedPolicy} lang="zh" />

        <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-5">
          <div className="text-center space-y-1">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-extrabold"
              style={{ backgroundColor: questSet.bgHex, color: questSet.accentHex }}
            >
              <Search className="h-3.5 w-3.5" />
              <span>形近字雙胞胎辨析館 · Tier {questSet.tier}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {questSet.title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#57534E]">
              {questSet.subtitle}（點擊單字卡聽台灣國語朗讀）
            </p>
          </div>

          <div
            className={`grid gap-3 ${
              questSet.twins.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : questSet.twins.length === 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {questSet.twins.map((twin) => (
              <button
                key={twin.char}
                type="button"
                onClick={() => audioService.speak(`${twin.char}，${twin.sampleWord}`, 'zh-TW')}
                className="qv-surface qv-hover-lift rounded-2xl border-2 border-[#1C1917] bg-[#FAF8F4] p-4 text-left space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-white text-3xl font-black text-[#1C1917]">
                      <RubyWord
                        word={twin.char}
                        zhuyin={twin.zhuyin}
                        showZhuyin={showZhuyin}
                        zhuyinClassName="text-[#DB2777]"
                      />
                    </span>
                    <div>
                      <span className="inline-block rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 text-[11px] font-extrabold text-[#92400E]">
                        {twin.radicalCue}
                      </span>
                      <div className="mt-1 font-display text-base font-extrabold text-[#1C1917]">
                        詞例：
                        <RubyWord
                          word={twin.sampleWord}
                          zhuyin={twin.sampleZhuyin}
                          showZhuyin={showZhuyin}
                          zhuyinClassName="text-[#BE185D]"
                        />
                      </div>
                    </div>
                  </div>
                  <Volume2 className="h-4 w-4 text-[#2563EB] shrink-0" />
                </div>

                <p className="text-xs font-bold text-[#44403C] leading-snug">{twin.diffTipZh}</p>
                <p className="text-[11px] font-semibold text-[#78716C]">{twin.diffTipEn}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => {
                audioService.playToken();
                setStage('sprint');
              }}
              className="qv-arcade-btn inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#DB2777] px-6 py-3 font-display text-base font-extrabold text-white"
              style={{ borderBottomColor: '#9D174D' }}
            >
              <span>我看懂差別了！開始 5 題辨字衝刺</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Stage 2: Context Fill-in-the-Blank Sprint ──
  const q = questSet.questions[qIndex];
  if (!q) return null;
  const answered = selectedChoice !== null;
  const isCorrect = answered && selectedChoice === q.correctIndex;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setStage('compare')}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>回雙胞胎對照卡</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#FBCFE8] bg-[#FDF2F8] px-3 py-1 text-xs font-extrabold text-[#BE185D] tabular-nums">
            🔍 {qIndex + 1} / {questSet.questions.length}
          </span>
          <span className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-extrabold text-[#047857] tabular-nums">
            ✓ {correctCount}
          </span>
          <button
            type="button"
            onClick={onToggleZhuyin}
            className={`qv-btn rounded-xl border px-3 py-1 text-xs font-extrabold ${
              showZhuyin
                ? 'border-[#DB2777] bg-[#FDF2F8] text-[#BE185D]'
                : 'border-[#E5DFD3] bg-white text-[#57534E]'
            }`}
          >
            注音：{showZhuyin ? '開' : '關'}
          </button>
        </div>
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang="zh" />

      <div className="rounded-3xl border-3 border-[#1C1917] bg-white p-5 sm:p-6 shadow-[0_6px_0_#1C1917] space-y-5">
        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{q.emoji}</span>
            <button
              type="button"
              onClick={() =>
                audioService.speak(
                  answered ? q.spokenFullSentence : q.promptSentence.replace(/___/g, '，空格，'),
                  'zh-TW',
                )
              }
              className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#E5DFD3] bg-[#FAF7F2] px-3 py-1 text-xs font-extrabold text-[#1C1917]"
            >
              <Volume2 className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>{answered ? '聽完整句子' : '朗讀題目'}</span>
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#E7E2D8] bg-[#FAF8F4] px-4 py-5">
            <div className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-relaxed">
              <RubySentence
                text={q.promptSentence}
                zhuyin={q.promptZhuyin}
                showZhuyin={showZhuyin}
                zhuyinClassName="text-[#BE185D]"
              />
            </div>
            <p className="mt-2 text-xs sm:text-sm font-bold text-[#78716C]">
              English Cue: {q.englishBridge}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {q.choices.map((ch, idx) => {
            const style = CHOICE_COLORS[idx % CHOICE_COLORS.length];
            const isSelected = selectedChoice === idx;
            const isRightChoice = idx === q.correctIndex;
            const btnBg = !answered
              ? style.bg
              : isRightChoice
                ? '#059669'
                : isSelected
                  ? '#E11D48'
                  : '#CBD5E1';
            const btnBorder = !answered
              ? style.border
              : isRightChoice
                ? '#065F46'
                : isSelected
                  ? '#9F1239'
                  : '#94A3B8';

            return (
              <button
                key={`${q.id}-opt-${idx}`}
                type="button"
                disabled={answered}
                onClick={() => handleChoose(idx)}
                className="qv-arcade-btn min-h-[68px] rounded-2xl border-2 border-[#1C1917] px-4 py-3 font-display text-2xl font-extrabold text-white flex items-center justify-center gap-3 transition-all"
                style={{ backgroundColor: btnBg, borderBottomColor: btnBorder }}
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-black/20 text-xs font-extrabold">
                  {style.badge}
                </span>
                <RubyWord
                  word={ch}
                  zhuyin={q.choiceZhuyins[idx]}
                  showZhuyin={showZhuyin}
                  zhuyinClassName="text-white/95"
                />
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isCorrect ? 'border-[#10B981] bg-[#ECFDF5]' : 'border-[#FB7185] bg-[#FFF1F2]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#059669] mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 text-[#E11D48] mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p
                  className={`font-display text-sm font-extrabold ${
                    isCorrect ? 'text-[#065F46]' : 'text-[#9F1239]'
                  }`}
                >
                  {isCorrect
                    ? `答對了！就是「${q.targetChar}」`
                    : showZhuyin
                      ? `正解是「${q.targetChar}」（${q.targetZhuyin}）`
                      : `正解是「${q.targetChar}」`}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#1C1917] leading-snug">
                  {q.explanation}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] px-5 py-2 font-display text-sm font-extrabold text-white"
              style={{ borderBottomColor: '#000000' }}
            >
              <span>{qIndex + 1 >= questSet.questions.length ? '看結算寶箱' : '我知道了，下一題'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

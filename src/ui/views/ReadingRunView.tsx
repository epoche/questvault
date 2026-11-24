import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Coins,
  Flame,
  Languages,
  ShoppingBag,
  Sparkles,
  Square,
  Volume2,
  XCircle,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  applyQuestRewardMultiplier,
  calculateQuestionTokens,
  type QuestRewardPolicy,
} from '../../core/economy';
import type { ReadingQuestSet } from '../../core/readingTypes';
import type { RunSummary } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RewardPolicyBanner } from '../components/RewardPolicyBanner';
import { RubySentence } from '../components/RubySentence';
import { RubyWord } from '../components/RubyWord';
import { useChineseReadAlong } from '../hooks/useChineseReadAlong';

export interface ReadingCompletionPayload {
  summary: RunSummary;
  rawTokensEarned?: number;
}

interface ReadingRunViewProps {
  questSet: ReadingQuestSet;
  equippedCollectibleId: string;
  showZhuyin: boolean;
  rewardPolicy?: QuestRewardPolicy;
  onToggleZhuyin: () => void;
  onExit: () => void;
  onCompleteReading: (payload: ReadingCompletionPayload) => void;
  onGoToMarket: () => void;
}

const TILE_PALETTE = [
  { bg: '#2563EB', borderBottom: '#1E3A8A', badge: '#1D4ED8' },
  { bg: '#0D9488', borderBottom: '#115E59', badge: '#0F766E' },
  { bg: '#EA580C', borderBottom: '#9A3412', badge: '#C2410C' },
  { bg: '#9333EA', borderBottom: '#581C87', badge: '#7E22CE' },
];

export const ReadingRunView: React.FC<ReadingRunViewProps> = ({
  questSet,
  equippedCollectibleId,
  showZhuyin,
  rewardPolicy,
  onToggleZhuyin,
  onExit,
  onCompleteReading,
  onGoToMarket,
}) => {
  const isZh = questSet.subjectId === 'chinese';
  const speechLang = isZh ? 'zh-TW' : 'en-US';
  const [lockedPolicy] = useState<QuestRewardPolicy | undefined>(() => rewardPolicy);
  const policyMult = lockedPolicy?.multiplier ?? 1;

  const [passageIdx, setPassageIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [showGist, setShowGist] = useState(false);

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Synchronous anti-cheat re-entry locks
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  const completedRef = useRef(false);
  const autoTimerRef = useRef<number | null>(null);

  const passage = questSet.passages[passageIdx];
  const question = passage.questions[questionIdx];
  const totalQuestions = questSet.passages.reduce((sum, p) => sum + p.questions.length, 0);
  const currentOverallIndex = passageIdx * 3 + questionIdx + 1;

  const {
    activeSentenceIdx,
    isAutoReading,
    speakSentence,
    toggleAutoReadAlong,
    stopReadAlong,
  } = useChineseReadAlong(
    passage.sentences,
    `${passage.id}-${completed ? 'done' : 'active'}`,
    isZh && !completed,
  );

  useEffect(() => {
    return () => {
      if (autoTimerRef.current !== null) {
        window.clearTimeout(autoTimerRef.current);
      }
      audioService.stopSpeech();
    };
  }, []);

  const speakPassage = () => {
    const fullText = `${passage.title}${isZh ? '。' : '. '}${passage.sentences.join(isZh ? '' : ' ')}`;
    audioService.speak(fullText, speechLang);
  };

  const finishQuest = (finalTokens: number, finalMaxCombo: number, finalCorrect: number) => {
    if (completedRef.current) return;
    completedRef.current = true;
    const chestBonus = 15;
    const rawTotalTokens = finalTokens + chestBonus;
    const awardedTokens = applyQuestRewardMultiplier(rawTotalTokens, policyMult);
    const accuracyPct = Math.round((finalCorrect / Math.max(1, totalQuestions)) * 100);
    setTokensEarned(rawTotalTokens);
    setCompleted(true);
    audioService.playChest();

    onCompleteReading({
      summary: {
        id: `read-${questSet.id}-${Date.now()}`,
        subjectId: questSet.subjectId,
        questSetId: questSet.id,
        questSetTitle: questSet.title,
        tokensEarned: awardedTokens,
        maxCombo: finalMaxCombo,
        accuracyPct,
        completedAt: new Date().toISOString(),
      },
      rawTokensEarned: rawTotalTokens,
    });
  };

  const advanceNext = (nextTokens: number, nextMaxCombo: number, nextCorrect: number) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    setSelectedChoice(null);
    setFeedback(null);

    if (questionIdx + 1 < passage.questions.length) {
      setQuestionIdx((q) => q + 1);
    } else if (passageIdx + 1 < questSet.passages.length) {
      setPassageIdx((p) => p + 1);
      setQuestionIdx(0);
      setShowGist(false);
    } else {
      finishQuest(nextTokens, nextMaxCombo, nextCorrect);
    }

    answeringRef.current = false;
    advancingRef.current = false;
  };

  const handleSelectChoice = (idx: number) => {
    if (answeringRef.current || completedRef.current) return;
    answeringRef.current = true;
    setSelectedChoice(idx);

    const isRight = idx === question.correctIndex;
    if (isRight) {
      const nextCombo = combo + 1;
      const nextMax = Math.max(maxCombo, nextCombo);
      const earned = calculateQuestionTokens(6, nextCombo);
      const nextTokens = tokensEarned + earned;
      const nextCorrect = firstTryCorrect + 1;

      setCombo(nextCombo);
      setMaxCombo(nextMax);
      setTokensEarned(nextTokens);
      setFirstTryCorrect(nextCorrect);
      setFeedback('correct');
      audioService.playCorrect(nextCombo);

      autoTimerRef.current = window.setTimeout(() => {
        advanceNext(nextTokens, nextMax, nextCorrect);
      }, 950);
    } else {
      setCombo(0);
      setFeedback('wrong');
      audioService.playNudge();
    }
  };

  if (completed) {
    const accuracyPct = Math.round((firstTryCorrect / Math.max(1, totalQuestions)) * 100);
    return (
      <div className="mx-auto max-w-xl space-y-5 py-4">
        <div className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div className="mx-auto flex justify-center">
            <div className="qv-hop">
              <CollectibleArt
                id={questSet.emblemCollectibleId}
                size={104}
                className="border-2 border-[#1C1917] shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isZh ? '短篇閱讀通關寶箱！' : 'Story Quest Chest Unlocked!'}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {questSet.title}
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-3">
              <div className="text-xs font-bold text-[#92400E]">{isZh ? '獲得代幣' : 'Tokens'}</div>
              <div className="mt-1 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#B45309] tabular-nums">
                <Coins className="h-5 w-5" />+{applyQuestRewardMultiplier(tokensEarned, policyMult)}
              </div>
            </div>
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3">
              <div className="text-xs font-bold text-[#047857]">{isZh ? '正確率' : 'Accuracy'}</div>
              <div className="mt-1 font-display text-2xl font-extrabold text-[#047857] tabular-nums">
                {accuracyPct}%
              </div>
            </div>
            <div className="rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] p-3">
              <div className="text-xs font-bold text-[#1D4ED8]">{isZh ? '最高連擊' : 'Max Combo'}</div>
              <div className="mt-1 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-[#1D4ED8] tabular-nums">
                <Flame className="h-5 w-5" />
                {maxCombo}×
              </div>
            </div>
          </div>

          <RewardPolicyBanner policy={lockedPolicy} lang={isZh ? 'zh' : 'en'} compact />

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onGoToMarket}
              className="qv-arcade-btn inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] px-5 py-2.5 font-display text-sm sm:text-base font-extrabold text-white"
              style={{ borderBottomColor: '#B45309' }}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{isZh ? '去開盲盒！' : 'Open Packs!'}</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="qv-btn inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-2 border-[#E5DFD3] bg-white px-5 py-2.5 font-display text-sm sm:text-base font-extrabold text-[#1C1917]"
            >
              <span>{isZh ? '回到關卡地圖' : 'Back to Quests'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Top Session Bar */}
      <div className="qv-surface rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white px-3 py-1.5 text-xs font-extrabold text-[#57534E]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isZh ? '離開' : 'Exit'}</span>
          </button>

          {isZh && (
            <button
              type="button"
              onClick={onToggleZhuyin}
              className={`qv-btn inline-flex min-h-[38px] items-center gap-1 rounded-xl border-2 px-3 py-1 text-xs font-extrabold ${
                showZhuyin
                  ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                  : 'border-[#E5DFD3] bg-white text-[#57534E]'
              }`}
            >
              <span>注音 {showZhuyin ? '開' : '關'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-extrabold text-[#57534E] tabular-nums">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-[#1D4ED8]">
            <BookOpen className="h-3.5 w-3.5" />
            {isZh
              ? `短文 ${passageIdx + 1}/${questSet.passages.length} · 第 ${currentOverallIndex}/${totalQuestions} 題`
              : `Story ${passageIdx + 1}/${questSet.passages.length} · Q ${currentOverallIndex}/${totalQuestions}`}
          </span>

          {combo >= 2 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-1 text-[#C2410C]">
              <Flame className="h-3.5 w-3.5 fill-current" />
              {combo}×
            </span>
          )}

          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-2.5 py-1 text-[#92400E]">
            <Coins className="h-3.5 w-3.5" />+{applyQuestRewardMultiplier(tokensEarned, policyMult)}
          </span>
        </div>
      </div>

      <RewardPolicyBanner policy={lockedPolicy} lang={isZh ? 'zh' : 'en'} />

      {/* Story Passage Card */}
      <section
        className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4 border-2"
        style={{ borderColor: questSet.accentHex, backgroundColor: '#FFFFFF' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <CollectibleArt
              id={questSet.emblemCollectibleId}
              size={48}
              className="border-2 border-[#1C1917] shrink-0"
            />
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#57534E]">
                {questSet.title} · {isZh ? `短文 ${passageIdx + 1}` : `Story ${passageIdx + 1}`}
              </div>
              <h1 className="font-display text-lg sm:text-xl font-extrabold text-[#1C1917]">
                {isZh ? (
                  <RubySentence
                    text={passage.title}
                    zhuyin={passage.titleZhuyin}
                    showZhuyin={showZhuyin}
                  />
                ) : (
                  passage.title
                )}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isZh ? (
              <button
                type="button"
                data-testid="zh-readalong-toggle"
                onClick={toggleAutoReadAlong}
                className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold transition-colors ${
                  isAutoReading
                    ? 'border-[#1C1917] bg-[#F59E0B] text-[#1C1917]'
                    : 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                }`}
              >
                {isAutoReading ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-current" />
                    <span>停止跟讀</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>逐句自動跟讀</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={speakPassage}
                className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 border-[#2563EB] bg-[#EFF6FF] px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-[#1D4ED8]"
              >
                <Volume2 className="h-4 w-4" />
                <span>Read Aloud</span>
              </button>
            )}

            {isZh && activeSentenceIdx !== null && !isAutoReading && (
              <button
                type="button"
                onClick={stopReadAlong}
                className="qv-btn inline-flex min-h-[40px] items-center gap-1 rounded-2xl border border-[#E5DFD3] bg-white px-2.5 py-1 text-xs font-extrabold text-[#57534E]"
              >
                <Square className="h-3 w-3 fill-current" />
                <span>清除高亮</span>
              </button>
            )}

            {isZh && passage.englishGist && (
              <button
                type="button"
                onClick={() => setShowGist((v) => !v)}
                className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 px-3 py-1.5 text-xs font-extrabold ${
                  showGist
                    ? 'border-[#DB2777] bg-[#FDF2F8] text-[#9D174D]'
                    : 'border-[#E5DFD3] bg-[#FAF7F2] text-[#57534E]'
                }`}
              >
                <Languages className="h-3.5 w-3.5" />
                <span>{showGist ? '隱藏英文大意' : '英文大意提示'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Passage Sentences */}
        <div className="rounded-2xl border-2 border-[#E7E2D8] bg-[#FAF7F2] p-4 sm:p-5 space-y-2.5">
          {isZh && (
            <div className="text-[11px] font-extrabold text-[#78716C]">
              👆 點哪句就會唸哪句＋暖黃高亮，也可以點右上角「逐句自動跟讀」！
            </div>
          )}
          {passage.sentences.map((sent, sIdx) => {
            if (!isZh) {
              return (
                <p
                  key={`${passage.id}-s-${sIdx}`}
                  className="font-display font-bold text-[#1C1917] text-base sm:text-lg leading-relaxed"
                >
                  {sent}
                </p>
              );
            }
            const isActive = activeSentenceIdx === sIdx;
            return (
              <button
                key={`${passage.id}-s-${sIdx}`}
                type="button"
                data-testid={`zh-sentence-btn-${sIdx}`}
                aria-pressed={isActive}
                onClick={() => speakSentence(sIdx)}
                className={`w-full text-left flex items-start gap-2.5 rounded-2xl border-2 px-3 py-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#F59E0B] bg-[#FEF08A] ring-2 ring-[#FDE047]'
                    : 'border-transparent bg-transparent hover:border-[#FDE68A] hover:bg-[#FFFBEB]'
                }`}
              >
                <Volume2
                  className={`mt-1.5 h-4 w-4 shrink-0 ${
                    isActive ? 'text-[#B45309]' : 'text-[#A8A29E]'
                  }`}
                />
                <span
                  className={`font-display font-bold text-[#1C1917] ${
                    showZhuyin ? 'text-lg sm:text-xl leading-loose' : 'text-lg sm:text-xl leading-relaxed'
                  }`}
                >
                  <RubySentence
                    text={sent}
                    zhuyin={passage.sentencesZhuyin?.[sIdx]}
                    showZhuyin={showZhuyin}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Optional English Gist Hint (Chinese Story Quests) */}
        {isZh && showGist && passage.englishGist && (
          <div className="rounded-2xl border border-[#FBCFE8] bg-[#FDF2F8] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#831843]">
            <span className="font-extrabold">English Gist: </span>
            {passage.englishGist}
          </div>
        )}

        {/* Spotlight Vocab Chips — automatically mask hints if current question tests that word */}
        {passage.spotlightVocab.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-[#57534E]">
              {isZh ? '關鍵詞：' : 'Key Words:'}
            </span>
            {passage.spotlightVocab.map((sv) => {
              const isSpoiler =
                feedback === null &&
                question.prompt.toLowerCase().includes(sv.word.toLowerCase());
              return (
                <span
                  key={sv.word}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] px-2.5 py-1 text-xs font-bold text-[#1C1917]"
                >
                  <strong className="font-extrabold text-[#2563EB]">
                    {isZh ? (
                      <RubyWord
                        word={sv.word}
                        zhuyin={sv.zhuyin}
                        showZhuyin={showZhuyin}
                      />
                    ) : (
                      sv.word
                    )}
                  </strong>
                  <span className="text-[#57534E]">
                    · {isSpoiler ? (isZh ? '從短文找線索！' : 'Use story clues!') : sv.hint}
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </section>

      {/* Blooket 4-Color Question Area */}
      <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <CollectibleArt
              id={equippedCollectibleId}
              size={40}
              className="border-2 border-[#1C1917] shrink-0"
            />
            <div>
              <span className="inline-block rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-extrabold text-[#1D4ED8]">
                {question.skillTag}
              </span>
              <h2 className="mt-1 font-display text-base sm:text-xl font-extrabold text-[#1C1917]">
                {question.prompt}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isZh) stopReadAlong();
              audioService.speak(question.prompt, speechLang);
            }}
            aria-label={isZh ? '朗讀題目' : 'Read question aloud'}
            className="qv-btn inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5DFD3] bg-[#FAF7F2] text-[#2563EB]"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.choices.map((choice, cIdx) => {
            const pal = TILE_PALETTE[cIdx % TILE_PALETTE.length];
            const isSelected = selectedChoice === cIdx;
            const isCorrectChoice = cIdx === question.correctIndex;
            const revealed = feedback !== null;

            let bg = pal.bg;
            let borderBottom = pal.borderBottom;
            let opacityClass = '';
            if (revealed) {
              if (isCorrectChoice) {
                bg = '#059669';
                borderBottom = '#065F46';
              } else if (isSelected) {
                bg = '#DC2626';
                borderBottom = '#991B1B';
              } else {
                opacityClass = 'opacity-45';
              }
            }

            return (
              <button
                key={`${question.id}-c-${cIdx}`}
                type="button"
                disabled={revealed}
                onClick={() => handleSelectChoice(cIdx)}
                className={`qv-tile qv-arcade-btn flex min-h-[60px] items-center justify-between gap-3 rounded-2xl border-2 border-[#1C1917] px-4 py-3 text-left font-display text-sm sm:text-base font-extrabold text-white transition-opacity ${opacityClass}`}
                style={{ backgroundColor: bg, borderBottomColor: borderBottom }}
              >
                <span className="leading-snug">
                  {isZh && question.choiceZhuyin?.[cIdx] ? (
                    <RubySentence
                      text={choice}
                      zhuyin={question.choiceZhuyin[cIdx]}
                      showZhuyin={showZhuyin}
                      zhuyinClassName="text-[#FEF08A]"
                    />
                  ) : (
                    choice
                  )}
                </span>
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white/95"
                  style={{ backgroundColor: 'rgba(0,0,0,0.22)' }}
                >
                  {cIdx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Panel */}
        {feedback && (
          <div
            className={`rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              feedback === 'correct'
                ? 'border-[#059669] bg-[#ECFDF5] text-[#065F46]'
                : 'border-[#DC2626] bg-[#FEF2F2] text-[#991B1B]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {feedback === 'correct' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#059669]" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-[#DC2626]" />
              )}
              <div className="text-sm font-bold leading-snug">
                <div className="font-extrabold">
                  {feedback === 'correct'
                    ? isZh
                      ? '答對了！超厲害！'
                      : 'Spot on! Great reading!'
                    : isZh
                      ? `正解是：${question.choices[question.correctIndex]}`
                      : `Best answer: ${question.choices[question.correctIndex]}`}
                </div>
                <div className="mt-0.5 opacity-90">{question.explanation}</div>
              </div>
            </div>

            {feedback === 'wrong' && (
              <button
                type="button"
                onClick={() => advanceNext(tokensEarned, maxCombo, firstTryCorrect)}
                className="qv-arcade-btn inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#1C1917] px-4 py-2 font-display text-xs sm:text-sm font-extrabold text-white"
                style={{ borderBottomColor: '#000000' }}
              >
                <span>{isZh ? '懂了，下一題' : 'Got It, Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

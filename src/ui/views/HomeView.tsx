import React, { useState } from 'react';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  BookText,
  Brain,
  Calculator,
  Castle,
  CheckCircle2,
  ChefHat,
  Coins,
  Dna,
  Fish,
  Flame,
  Gift,
  Headphones,
  HeartPulse,
  Languages,
  Play,
  Plus,
  Puzzle,
  Ruler,
  Sparkles,
  Swords,
  Target,
  Trash2,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { computeWeeklyGoalProgress } from '../../core/analytics';
import {
  DAILY_MIXED_WARMUP_BONUS,
  DAILY_TRI_SUBJECT_BONUS,
  getQuestRewardPolicy,
  type QuestRewardPolicy,
} from '../../core/economy';
import { getDueReviewItems, getTrickyWords } from '../../core/mastery';
import { countClinicPatients, type MixedWarmupMode } from '../../core/mixedWarmupEngine';
import { MIN_PACK_COST } from '../../core/packs';
import type { ReadingQuestSet } from '../../core/readingTypes';
import type { DifficultyTier, PlayerState, SubjectId } from '../../core/types';
import {
  BUILTIN_CHAPTER_SERIES,
  getSeriesCompletedCount,
  isSeriesFullyCompleted,
  type ChapterSeries,
} from '../../subjects/chinese/chapterStories';
import { customChineseRecordToWordSet } from '../../subjects/chinese/chineseCustomParser';
import {
  buildChineseSrsReviewSet,
  buildChineseTrickyRematchSet,
} from '../../subjects/chinese/chineseEngine';
import { CHINESE_PLACEMENT_BONUS_TOKENS } from '../../subjects/chinese/chinesePlacement';
import {
  getMeasureIdiomSetsByTier,
  type MeasureIdiomSet,
} from '../../subjects/chinese/measureIdiomSets';
import {
  getRadicalFamiliesByTier,
  type RadicalFamily,
} from '../../subjects/chinese/radicalFamilies';
import { getChineseReadingByTier } from '../../subjects/chinese/readingQuests';
import {
  getSentencePatternSetsByTier,
  type SentencePatternSet,
} from '../../subjects/chinese/sentencePatternSets';
import type { ChineseWordSet } from '../../subjects/chinese/types';
import {
  BUILTIN_CHINESE_SETS,
  CHINESE_TIER_META,
  getChineseSetsByTier,
} from '../../subjects/chinese/wordSets';
import { customRecordToWordSet } from '../../subjects/english/customParser';
import {
  BUILTIN_ENGLISH_CHAPTER_SERIES,
  getEnglishSeriesCompletedCount,
  isEnglishSeriesFullyCompleted,
  type EnglishChapterSeries,
} from '../../subjects/english/englishChapterStories';
import { getEnglishGrammarSetsByTier } from '../../subjects/english/grammarSets';
import { PLACEMENT_BONUS_TOKENS } from '../../subjects/english/placement';
import { getEnglishReadingByTier } from '../../subjects/english/readingQuests';
import { getEnglishRootFamiliesByTier } from '../../subjects/english/rootFamilies';
import type {
  EnglishRootFamily,
  GrammarRepairSet,
} from '../../subjects/english/rootsGrammarTypes';
import {
  buildEnglishSrsReviewSet,
  buildTrickyRematchWordSet,
  getLocalDateKey,
} from '../../subjects/english/runEngine';
import { getSpellingSetsByTier } from '../../subjects/english/spellingSets';
import type { SpellingSet } from '../../subjects/english/spellingTypes';
import type { WordSet } from '../../subjects/english/types';
import { BUILTIN_WORD_SETS, getWordSetsByTier, TIER_META } from '../../subjects/english/wordSets';
import { BAR_MODEL_UNITS, type BarModelUnitMeta } from '../../subjects/math/barModelEngine';
import { buildMathSrsReviewSet, buildMathTrickyRematchSet } from '../../subjects/math/mathEngine';
import { MATH_PLACEMENT_BONUS_TOKENS } from '../../subjects/math/mathPlacement';
import { BUILTIN_MATH_SETS, getMathSetsByTier, MATH_TIER_META } from '../../subjects/math/questSets';
import type { MathQuestSet } from '../../subjects/math/types';
import { CollectibleArt } from '../artwork/CollectibleArt';
import { RubyWord } from '../components/RubyWord';

interface HomeViewProps {
  player: PlayerState;
  activeSubjectId: SubjectId;
  activeTier: DifficultyTier;
  placementCompleted: boolean;
  showZhuyin: boolean;
  onSelectSubject: (subjectId: SubjectId) => void;
  onSelectTier: (tier: DifficultyTier) => void;
  onToggleZhuyin: () => void;
  onStartPlacement: () => void;
  onStartBlitz: (subjectId: SubjectId) => void;
  onStartCafe: (subjectId: SubjectId) => void;
  onStartFishing: (subjectId: SubjectId) => void;
  onStartBossBattle: (subjectId: SubjectId) => void;
  onStartTowerDefense?: (subjectId: SubjectId) => void;
  onOpenLogicLab?: () => void;
  onOpenMixedWarmup?: (mode: MixedWarmupMode) => void;
  onClaimDailyQuest: () => void;
  onStartEnglishRun: (wordSet: WordSet) => void;
  onStartEnglishRootFamily: (family: EnglishRootFamily) => void;
  onStartGrammarRepairSet: (set: GrammarRepairSet) => void;
  onStartSpellingSet?: (set: SpellingSet) => void;
  onStartEnglishChapterSeries?: (series: EnglishChapterSeries) => void;
  onStartMathRun: (questSet: MathQuestSet) => void;
  onStartFactFluency?: () => void;
  onStartBarModelUnit?: (unit: BarModelUnitMeta) => void;
  onStartChineseRun: (wordSet: ChineseWordSet) => void;
  onStartChineseListening: () => void;
  onStartRadicalFamily: (family: RadicalFamily) => void;
  onStartMeasureIdiomSet: (set: MeasureIdiomSet) => void;
  onStartSentencePatternSet?: (set: SentencePatternSet) => void;
  onStartChapterSeries: (series: ChapterSeries) => void;
  onStartReadingRun: (questSet: ReadingQuestSet) => void;
  onOpenCustomImporter: (subjectId: 'english' | 'chinese') => void;
  onDeleteCustomSet: (id: string) => void;
  onGoToMarket: () => void;
}

const SUBJECT_TABS: {
  id: SubjectId;
  label: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'english', label: 'English', accent: '#2563EB', icon: BookOpen },
  { id: 'math', label: 'Math', accent: '#059669', icon: Calculator },
  { id: 'chinese', label: '中文', accent: '#DB2777', icon: Languages },
];

export const HomeView: React.FC<HomeViewProps> = ({
  player,
  activeSubjectId,
  activeTier,
  placementCompleted,
  showZhuyin,
  onSelectSubject,
  onSelectTier,
  onToggleZhuyin,
  onStartPlacement,
  onStartBlitz,
  onStartCafe,
  onStartFishing,
  onStartBossBattle,
  onStartTowerDefense,
  onOpenLogicLab,
  onOpenMixedWarmup,
  onClaimDailyQuest,
  onStartEnglishRun,
  onStartEnglishRootFamily,
  onStartGrammarRepairSet,
  onStartSpellingSet,
  onStartEnglishChapterSeries,
  onStartMathRun,
  onStartFactFluency,
  onStartBarModelUnit,
  onStartChineseRun,
  onStartChineseListening,
  onStartRadicalFamily,
  onStartMeasureIdiomSet,
  onStartSentencePatternSet,
  onStartChapterSeries,
  onStartReadingRun,
  onOpenCustomImporter,
  onDeleteCustomSet,
  onGoToMarket,
}) => {
  const [questMode, setQuestMode] = useState<
    | 'words'
    | 'stories'
    | 'roots'
    | 'grammar'
    | 'spelling'
    | 'enChapters'
    | 'radicals'
    | 'measures'
    | 'patterns'
    | 'chapters'
    | 'barModels'
  >('words');
  const [voucherOpen, setVoucherOpen] = useState(false);
  const effectiveQuestMode =
    activeSubjectId === 'math'
      ? questMode === 'barModels'
        ? 'barModels'
        : 'words'
      : activeSubjectId === 'chinese' &&
          (questMode === 'roots' ||
            questMode === 'grammar' ||
            questMode === 'spelling' ||
            questMode === 'enChapters' ||
            questMode === 'barModels')
        ? 'words'
        : activeSubjectId === 'english' &&
            (questMode === 'radicals' ||
              questMode === 'measures' ||
              questMode === 'patterns' ||
              questMode === 'chapters' ||
              questMode === 'barModels')
          ? 'words'
          : questMode;
  const packsReady = Math.floor(player.tokens / MIN_PACK_COST);
  const todayKey = getLocalDateKey();
  const weeklyGoalProgress = computeWeeklyGoalProgress(player);

  const renderDoneRewardBadge = (policy: QuestRewardPolicy, isZh: boolean, defaultLabel: string) => {
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
  };

  const enSets = getWordSetsByTier(activeTier);
  const enRootFamilies = getEnglishRootFamiliesByTier(activeTier);
  const enGrammarSets = getEnglishGrammarSetsByTier(activeTier);
  const enSpellingSets = getSpellingSetsByTier(activeTier);
  const mathSets = getMathSetsByTier(activeTier);
  const zhSets = getChineseSetsByTier(activeTier);
  const zhRadicalFamilies = getRadicalFamiliesByTier(activeTier);
  const zhMeasureIdiomSets = getMeasureIdiomSetsByTier(activeTier);
  const zhSentencePatterns = getSentencePatternSetsByTier(activeTier);
  const enReadingSets = getEnglishReadingByTier(activeTier);
  const zhReadingSets = getChineseReadingByTier(activeTier);

  const enCustomSets = player.customWordSets
    .filter((s) => (s.subjectId ?? 'english') === 'english')
    .map(customRecordToWordSet);
  const zhCustomSets = player.customWordSets
    .filter((s) => s.subjectId === 'chinese')
    .map(customChineseRecordToWordSet);

  const bossDate =
    player.subjectBossRematchDate?.[activeSubjectId] ??
    (activeSubjectId === 'english' ? player.lastBossRematchDate : undefined);

  const enRematch =
    activeSubjectId === 'english'
      ? buildTrickyRematchWordSet(player.wordMastery, BUILTIN_WORD_SETS, bossDate)
      : null;
  const mathRematch =
    activeSubjectId === 'math'
      ? buildMathTrickyRematchSet(player.wordMastery, BUILTIN_MATH_SETS, bossDate)
      : null;
  const zhRematch =
    activeSubjectId === 'chinese'
      ? buildChineseTrickyRematchSet(player.wordMastery, BUILTIN_CHINESE_SETS, bossDate)
      : null;

  const enSrs =
    activeSubjectId === 'english'
      ? buildEnglishSrsReviewSet(player.wordMastery, BUILTIN_WORD_SETS)
      : null;
  const mathSrs =
    activeSubjectId === 'math'
      ? buildMathSrsReviewSet(player.wordMastery, BUILTIN_MATH_SETS)
      : null;
  const zhSrs =
    activeSubjectId === 'chinese'
      ? buildChineseSrsReviewSet(player.wordMastery, BUILTIN_CHINESE_SETS)
      : null;

  const dueSrsCount = getDueReviewItems(player.wordMastery, activeSubjectId).length;
  const trickyCount = getTrickyWords(player.wordMastery, activeSubjectId).length;

  const dailySubjects =
    player.dailyQuest?.dateKey === todayKey ? player.dailyQuest.completedSubjects : [];
  const dailyClaimed =
    player.dailyQuest?.dateKey === todayKey && Boolean(player.dailyQuest.rewardClaimed);
  const dailyAllDone =
    dailySubjects.includes('english') &&
    dailySubjects.includes('math') &&
    dailySubjects.includes('chinese');
  const streakDays = player.streakDays ?? 0;
  const streakBonus = Math.min(15, Math.max(0, (Math.max(1, streakDays) - 1) * 3));
  const dailyRewardAmount = DAILY_TRI_SUBJECT_BONUS + streakBonus;

  const nextEn = enSets.find((s) => !player.completedQuestSetIds.includes(s.id)) ?? enSets[0];
  const nextMath = mathSets.find((s) => !player.completedQuestSetIds.includes(s.id)) ?? mathSets[0];
  const nextZh = zhSets.find((s) => !player.completedQuestSetIds.includes(s.id)) ?? zhSets[0];

  const heroTitle =
    activeSubjectId === 'english'
      ? `Play ${nextEn.title}`
      : activeSubjectId === 'math'
        ? `Play ${nextMath.title}`
        : `開始 ${nextZh.title}`;

  const handleHeroPlay = () => {
    if (activeSubjectId === 'english') onStartEnglishRun(nextEn);
    else if (activeSubjectId === 'math') onStartMathRun(nextMath);
    else onStartChineseRun(nextZh);
  };

  const tierMeta =
    activeSubjectId === 'english'
      ? TIER_META
      : activeSubjectId === 'math'
        ? MATH_TIER_META
        : CHINESE_TIER_META;

  const warmUpBonus =
    activeSubjectId === 'english'
      ? PLACEMENT_BONUS_TOKENS
      : activeSubjectId === 'math'
        ? MATH_PLACEMENT_BONUS_TOKENS
        : CHINESE_PLACEMENT_BONUS_TOKENS;

  return (
    <div className="space-y-6">
      {/* Subject Quick Switcher Strip (English / Math / 中文) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-[#F3EFE7] p-1">
          {SUBJECT_TABS.map((subj) => {
            const Icon = subj.icon;
            const active = activeSubjectId === subj.id;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => onSelectSubject(subj.id)}
                className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-sm font-extrabold transition-colors ${
                  active ? 'text-white shadow-xs' : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
                style={active ? { backgroundColor: subj.accent } : undefined}
              >
                <Icon className="h-4 w-4" />
                <span>{subj.label}</span>
              </button>
            );
          })}
        </div>

        {activeSubjectId === 'chinese' && (
          <button
            type="button"
            onClick={onToggleZhuyin}
            className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border-2 px-3.5 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
              showZhuyin
                ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                : 'border-[#E7E2D8] bg-white text-[#57534E]'
            }`}
          >
            <span>注音顯示：{showZhuyin ? '開' : '關'}</span>
          </button>
        )}
      </div>

      {/* Visual-First Arcade Hero Stage */}
      <section className="qv-surface rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="qv-float shrink-0">
            <CollectibleArt
              id={player.equippedCollectibleId}
              size={84}
              shiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              className="border-2 border-[#1C1917] shadow-sm"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              {activeSubjectId === 'chinese'
                ? `嗨，${player.displayName}！`
                : `Hi, ${player.displayName}!`}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleHeroPlay}
                className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-3 font-display text-base font-extrabold text-white"
                style={{ borderBottomColor: '#1E3A8A' }}
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{heroTitle}</span>
              </button>

              <button
                type="button"
                onClick={() => onStartBlitz(activeSubjectId)}
                className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#7C3AED] px-4 py-3 font-display text-sm font-extrabold text-white"
                style={{ borderBottomColor: '#4C1D95' }}
              >
                <Zap className="h-4 w-4 fill-current" />
                <span>{activeSubjectId === 'chinese' ? '60秒無盡衝分' : '60s Blitz'}</span>
              </button>

              <button
                type="button"
                onClick={() => onStartCafe(activeSubjectId)}
                className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#EA580C] px-4 py-3 font-display text-sm font-extrabold text-white"
                style={{ borderBottomColor: '#9A3412' }}
              >
                <ChefHat className="h-4 w-4" />
                <span>{activeSubjectId === 'chinese' ? 'Boba Café 小店' : 'Boba Café'}</span>
              </button>

              <button
                type="button"
                onClick={() => onStartFishing(activeSubjectId)}
                className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#0891B2] px-4 py-3 font-display text-sm font-extrabold text-white"
                style={{ borderBottomColor: '#155E75' }}
              >
                <Fish className="h-4 w-4" />
                <span>{activeSubjectId === 'chinese' ? '星海釣魚' : 'Star Fishing'}</span>
              </button>

              <button
                type="button"
                onClick={() => onStartBossBattle(activeSubjectId)}
                className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#EF4444] px-4 py-3 font-display text-sm font-extrabold text-white"
                style={{ borderBottomColor: '#991B1B' }}
              >
                <Swords className="h-4 w-4" />
                <span>{activeSubjectId === 'chinese' ? '夥伴打魔王' : 'Boss Battle'}</span>
              </button>

              {onStartTowerDefense && (
                <button
                  type="button"
                  onClick={() => onStartTowerDefense(activeSubjectId)}
                  className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#4F46E5] px-4 py-3 font-display text-sm font-extrabold text-white"
                  style={{ borderBottomColor: '#312E81' }}
                >
                  <Castle className="h-4 w-4" />
                  <span>{activeSubjectId === 'chinese' ? '夥伴塔防' : 'Tower Defense'}</span>
                </button>
              )}

              {onOpenLogicLab && (
                <button
                  type="button"
                  onClick={onOpenLogicLab}
                  className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#7C3AED] px-4 py-3 font-display text-sm font-extrabold text-white"
                  style={{ borderBottomColor: '#4C1D95' }}
                >
                  <Brain className="h-4 w-4" />
                  <span>{activeSubjectId === 'chinese' ? '邏輯空間館' : 'Logic & Spatial'}</span>
                </button>
              )}

              {onOpenMixedWarmup && (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenMixedWarmup('daily-warmup')}
                    className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] px-4 py-3 font-display text-sm font-extrabold text-[#1C1917]"
                    style={{ borderBottomColor: '#B45309' }}
                  >
                    <Zap className="h-4 w-4 fill-current" />
                    <span>
                      {activeSubjectId === 'chinese' ? '5分鐘混合暖身' : '5-Min Warm-Up'}
                    </span>
                    <span className="rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-extrabold text-[#92400E] tabular-nums">
                      {player.dailyMixedWarmupDate === todayKey
                        ? '✓'
                        : `+${DAILY_MIXED_WARMUP_BONUS}`}
                    </span>
                  </button>

                  {(() => {
                    const clinicCount = countClinicPatients(player);
                    return (
                      <button
                        type="button"
                        onClick={() => onOpenMixedWarmup('mistake-clinic')}
                        className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#0D9488] px-4 py-3 font-display text-sm font-extrabold text-white"
                        style={{ borderBottomColor: '#115E59' }}
                      >
                        <HeartPulse className="h-4 w-4" />
                        <span>
                          {activeSubjectId === 'chinese' ? '錯題急救診所' : 'Mistake Clinic'}
                        </span>
                        {clinicCount > 0 && (
                          <span className="rounded-full bg-[#F43F5E] px-2 py-0.5 text-[11px] font-extrabold text-white tabular-nums">
                            {clinicCount}
                          </span>
                        )}
                      </button>
                    );
                  })()}
                </>
              )}

              {activeSubjectId === 'math' && onStartFactFluency && (
                <button
                  type="button"
                  onClick={onStartFactFluency}
                  className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-4 py-3 font-display text-sm font-extrabold text-white"
                  style={{ borderBottomColor: '#065F46' }}
                >
                  <Zap className="h-4 w-4 fill-current" />
                  <span>Fact Fluency Dojo</span>
                </button>
              )}

              {activeSubjectId === 'chinese' && (
                <>
                  <button
                    type="button"
                    onClick={onStartChineseListening}
                    className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#DB2777] px-4 py-3 font-display text-sm font-extrabold text-white"
                    style={{ borderBottomColor: '#9D174D' }}
                  >
                    <Headphones className="h-4 w-4" />
                    <span>聽音辨字</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextRad =
                        zhRadicalFamilies.find(
                          (f) => !(player.completedRadicalIds ?? []).includes(f.id),
                        ) ?? zhRadicalFamilies[0];
                      if (nextRad) onStartRadicalFamily(nextRad);
                    }}
                    className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#0D9488] px-4 py-3 font-display text-sm font-extrabold text-white"
                    style={{ borderBottomColor: '#115E59' }}
                  >
                    <Puzzle className="h-4 w-4" />
                    <span>偏旁工廠</span>
                  </button>
                </>
              )}

              {packsReady > 0 && (
                <button
                  type="button"
                  onClick={onGoToMarket}
                  className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] px-4 py-3 font-display text-sm font-extrabold text-[#1C1917] tabular-nums"
                  style={{ borderBottomColor: '#D97706' }}
                >
                  <Sparkles className="h-4 w-4 text-[#D97706]" />
                  <span>
                    {activeSubjectId === 'chinese'
                      ? `抽 ${packsReady} 包盲盒！`
                      : `Open ${packsReady} ${packsReady === 1 ? 'Pack' : 'Packs'}!`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3-Minute Warm-Up Level Finder Pill */}
        <button
          type="button"
          onClick={onStartPlacement}
          className="qv-btn qv-hover-lift flex min-h-[48px] items-center justify-between md:flex-col md:items-end gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#FFFBEB] px-4 py-3 text-left md:text-right shrink-0"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-2.5 py-0.5 text-xs font-extrabold text-white tabular-nums">
            <Coins className="h-3.5 w-3.5" />
            {placementCompleted
              ? activeSubjectId === 'chinese'
                ? '重新測等級'
                : 'Re-check Level'
              : activeSubjectId === 'chinese'
                ? `+${warmUpBonus} 獎勵！`
                : `+${warmUpBonus} Bonus!`}
          </span>
          <span className="font-display text-sm font-extrabold text-[#1C1917]">
            {activeSubjectId === 'chinese'
              ? '3 分鐘中文分級暖身 →'
              : activeSubjectId === 'math'
                ? '3-Min Math Warm-Up →'
                : '3-Min Level Warm-Up →'}
          </span>
        </button>
      </section>

      {/* Daily Tri-Subject Quest + Streak Chest Strip */}
      <section className="qv-surface rounded-2xl px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-1 font-display text-xs font-extrabold text-[#C2410C] tabular-nums">
            <Flame className="h-3.5 w-3.5 fill-current" />
            {activeSubjectId === 'chinese'
              ? `連勝 ${streakDays} 天`
              : `${streakDays}-Day Streak`}
          </span>

          <span className="font-display text-xs sm:text-sm font-extrabold text-[#1C1917]">
            {activeSubjectId === 'chinese' ? '今日三科任務：' : 'Daily 3-Subject Quest:'}
          </span>

          <div className="flex items-center gap-1.5">
            {(['english', 'math', 'chinese'] as SubjectId[]).map((sid) => {
              const done = dailySubjects.includes(sid);
              const label = sid === 'english' ? 'EN' : sid === 'math' ? 'Math' : '中文';
              return (
                <button
                  key={sid}
                  type="button"
                  onClick={() => onSelectSubject(sid)}
                  className={`qv-btn inline-flex min-h-[36px] items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-colors ${
                    done
                      ? 'border-[#059669] bg-[#ECFDF5] text-[#047857]'
                      : 'border-[#E5DFD3] bg-white text-[#78716C] hover:border-[#1C1917]'
                  }`}
                >
                  {done && <CheckCircle2 className="h-3 w-3" />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {dailyClaimed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 text-xs font-extrabold text-[#047857]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {activeSubjectId === 'chinese' ? '今日三科寶箱已領取！' : 'Daily Chest Claimed!'}
            </span>
          ) : dailyAllDone ? (
            <button
              type="button"
              onClick={onClaimDailyQuest}
              className="qv-arcade-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#F59E0B] px-3.5 py-1.5 font-display text-xs sm:text-sm font-extrabold text-white tabular-nums"
              style={{ borderBottomColor: '#B45309' }}
            >
              <Gift className="h-4 w-4" />
              <span>
                {activeSubjectId === 'chinese'
                  ? `領取 +${dailyRewardAmount} 三科寶箱！`
                  : `Claim +${dailyRewardAmount} Daily Chest!`}
              </span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-extrabold text-[#B45309] tabular-nums">
              <Gift className="h-3.5 w-3.5" />
              {activeSubjectId === 'chinese'
                ? `完成三科領 +${dailyRewardAmount}`
                : `Complete all 3 for +${dailyRewardAmount}`}
            </span>
          )}
        </div>
      </section>

      {/* Phase 4D: Weekly Goal Progress Bar & Real-World Reward Voucher */}
      {weeklyGoalProgress.enabled && (
        <section className="qv-surface rounded-2xl px-4 py-3 sm:px-5 border-2 border-[#FDE68A] bg-[#FFFDF8] space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-2.5 py-0.5 font-display text-xs font-extrabold text-[#B45309]">
                <Target className="h-3.5 w-3.5" />
                {activeSubjectId === 'chinese' ? '本週目標' : 'Weekly Goal'}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#1C1917] tabular-nums">
                {weeklyGoalProgress.enTarget > 0 && `EN ${weeklyGoalProgress.enDone}/${weeklyGoalProgress.enTarget}`}
                {weeklyGoalProgress.enTarget > 0 && (weeklyGoalProgress.zhTarget > 0 || weeklyGoalProgress.mathTarget > 0) ? ' · ' : ''}
                {weeklyGoalProgress.zhTarget > 0 && `中文 ${weeklyGoalProgress.zhDone}/${weeklyGoalProgress.zhTarget}`}
                {weeklyGoalProgress.zhTarget > 0 && weeklyGoalProgress.mathTarget > 0 ? ' · ' : ''}
                {weeklyGoalProgress.mathTarget > 0 && `Math ${weeklyGoalProgress.mathDone}/${weeklyGoalProgress.mathTarget}`}
              </span>
            </div>

            {weeklyGoalProgress.isMet && !weeklyGoalProgress.isRedeemed ? (
              <button
                type="button"
                onClick={() => setVoucherOpen(true)}
                className="qv-arcade-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#F59E0B] px-3.5 py-1.5 font-display text-xs sm:text-sm font-extrabold text-white"
                style={{ borderBottomColor: '#B45309' }}
              >
                <Gift className="h-4 w-4" />
                <span>🎉 打開本週真實獎勵券！</span>
              </button>
            ) : weeklyGoalProgress.isMet && weeklyGoalProgress.isRedeemed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#10B981] px-3 py-1 text-xs font-extrabold text-[#047857]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                🏆 本週獎勵已兌換！
              </span>
            ) : (
              <span className="text-xs font-bold text-[#92400E] truncate max-w-[260px]">
                🎁 {weeklyGoalProgress.rewardText}
              </span>
            )}
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${weeklyGoalProgress.pct}%`,
                backgroundColor: weeklyGoalProgress.isMet ? '#10B981' : '#F59E0B',
              }}
            />
          </div>
        </section>
      )}

      {/* Real-World Reward Voucher Modal (Kid celebrates; Parent Corner redeems) */}
      {voucherOpen && weeklyGoalProgress.isMet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Weekly Real-World Reward Voucher"
          onClick={(e) => {
            if (e.target === e.currentTarget) setVoucherOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/65 p-4"
        >
          <div className="relative w-full max-w-md rounded-3xl border-3 border-[#1C1917] bg-[#FFFDF8] p-6 shadow-[0_8px_0_#1C1917] text-center space-y-4">
            <button
              type="button"
              onClick={() => setVoucherOpen(false)}
              aria-label="Close reward voucher"
              className="qv-btn absolute right-3.5 top-3.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#E5DFD3] bg-white text-[#57534E]"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3.5 py-1 text-xs font-extrabold text-[#B45309]">
              <Gift className="h-4 w-4" />
              OFFICIAL REWARD VOUCHER · {weeklyGoalProgress.weekKey}
            </span>

            <div className="space-y-1">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
                🎉 {player.displayName} 達標成功！
              </h2>
              <p className="text-xs font-bold text-[#57534E]">
                You finished all your weekly quests! Show this golden voucher to Mom or Dad!
              </p>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-[#F59E0B] bg-[#FFFBEB] p-5 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#B45309]">
                本週真實獎勵 Real-World Reward
              </p>
              <p className="font-display text-xl sm:text-2xl font-extrabold text-[#1C1917]">
                {weeklyGoalProgress.rewardText}
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-1.5 text-xs font-extrabold text-[#047857]">
                {weeklyGoalProgress.enTarget > 0 && (
                  <span className="rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5">
                    ✓ EN {weeklyGoalProgress.enDone}/{weeklyGoalProgress.enTarget}
                  </span>
                )}
                {weeklyGoalProgress.zhTarget > 0 && (
                  <span className="rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5">
                    ✓ 中文 {weeklyGoalProgress.zhDone}/{weeklyGoalProgress.zhTarget}
                  </span>
                )}
                {weeklyGoalProgress.mathTarget > 0 && (
                  <span className="rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5">
                    ✓ Math {weeklyGoalProgress.mathDone}/{weeklyGoalProgress.mathTarget}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs font-semibold text-[#78716C]">
              🔒 請由爸爸媽媽進入右上角「家長檢視室」核銷此兌換券。
            </p>

            <button
              type="button"
              onClick={() => setVoucherOpen(false)}
              className="qv-btn w-full min-h-[46px] rounded-2xl border-2 border-[#1C1917] bg-[#1C1917] text-white font-display text-sm font-extrabold"
            >
              Yay! Close Voucher
            </button>
          </div>
        </div>
      )}

      {/* Spaced-Repetition (SRS) Daily Memory Review Banner */}
      {(enSrs || mathSrs || zhSrs) && (
        <button
          type="button"
          onClick={() => {
            if (enSrs) onStartEnglishRun(enSrs);
            else if (mathSrs) onStartMathRun(mathSrs);
            else if (zhSrs) onStartChineseRun(zhSrs);
          }}
          className="qv-arcade-btn w-full rounded-3xl border-2 border-[#1C1917] bg-[#F0F9FF] p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
          style={{ borderBottomColor: '#0284C7' }}
        >
          <div className="flex items-center gap-4">
            <CollectibleArt
              id={(enSrs ?? mathSrs ?? zhSrs)!.emblemCollectibleId}
              size={60}
              className="border-2 border-[#1C1917]"
            />
            <div>
              <div className="inline-flex items-center gap-1 rounded-full bg-[#0284C7] px-2.5 py-0.5 text-xs font-extrabold text-white">
                <Brain className="h-3.5 w-3.5" />
                {activeSubjectId === 'chinese' ? '記憶曲線每日複習' : 'SRS MEMORY REVIEW DUE'}
              </div>
              <h2 className="mt-1 font-display text-lg sm:text-xl font-extrabold text-[#1C1917] tabular-nums">
                {activeSubjectId === 'chinese'
                  ? `今天有 ${dueSrsCount} 個詞語到期複習，鎖進長期記憶！`
                  : activeSubjectId === 'math'
                    ? `${dueSrsCount} Math Skills Ready for Memory Review!`
                    : `${dueSrsCount} Words Due for Memory Review Today!`}
              </h2>
            </div>
          </div>
          <span className="shrink-0 rounded-2xl border-2 border-[#1C1917] bg-[#0284C7] px-4 py-2.5 font-display text-sm font-extrabold text-white">
            {activeSubjectId === 'chinese' ? '複習 →' : 'Review →'}
          </span>
        </button>
      )}

      {/* Subject-Scoped 1.5x Daily Boss Rematch Banner */}
      {(enRematch || mathRematch || zhRematch) && (
        <button
          type="button"
          onClick={() => {
            if (enRematch) onStartEnglishRun(enRematch);
            else if (mathRematch) onStartMathRun(mathRematch);
            else if (zhRematch) onStartChineseRun(zhRematch);
          }}
          className="qv-arcade-btn w-full rounded-3xl border-2 border-[#1C1917] bg-[#FFF1F2] p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
          style={{ borderBottomColor: '#E11D48' }}
        >
          <div className="flex items-center gap-4">
            <CollectibleArt
              id={(enRematch ?? mathRematch ?? zhRematch)!.emblemCollectibleId}
              size={60}
              className="border-2 border-[#1C1917]"
            />
            <div>
              <div className="inline-flex items-center gap-1 rounded-full bg-[#E11D48] px-2.5 py-0.5 text-xs font-extrabold text-white">
                <Flame className="h-3.5 w-3.5 fill-current" />
                {activeSubjectId === 'chinese' ? '1.5× 每日錯詞魔王戰' : '1.5× DAILY BOSS REMATCH'}
              </div>
              <h2 className="mt-1 font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                {activeSubjectId === 'chinese'
                  ? `擊敗你的 ${trickyCount} 個常錯詞語！`
                  : activeSubjectId === 'math'
                    ? `Beat Your ${trickyCount} Tricky Math Skills!`
                    : `Beat Your ${trickyCount} Tricky Words!`}
              </h2>
            </div>
          </div>
          <span className="shrink-0 rounded-2xl border-2 border-[#1C1917] bg-[#E11D48] px-4 py-2.5 font-display text-sm font-extrabold text-white">
            {activeSubjectId === 'chinese' ? '挑戰 →' : 'Battle →'}
          </span>
        </button>
      )}

      {/* Visual 4-Tier Selector + Single School Words Import Button */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {([1, 2, 3, 4] as DifficultyTier[]).map((t) => {
              const meta = tierMeta[t];
              const active = activeTier === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onSelectTier(t)}
                  className={`qv-btn min-h-[42px] rounded-2xl border-2 px-3.5 py-2 font-display text-sm font-extrabold transition-colors ${
                    active ? 'border-[#1C1917] text-white' : 'border-[#E7E2D8] bg-white text-[#57534E]'
                  }`}
                  style={active ? { backgroundColor: meta.colorHex } : undefined}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>

          {activeSubjectId !== 'math' && (
            <button
              type="button"
              onClick={() => onOpenCustomImporter(activeSubjectId)}
              className="qv-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl border-2 border-[#0D9488] bg-[#F0FDFA] px-4 py-2 text-xs sm:text-sm font-extrabold text-[#0F766E]"
            >
              <Plus className="h-4 w-4" />
              <span>
                {activeSubjectId === 'chinese' ? '匯入中文生字表' : 'Import School Words'}
              </span>
            </button>
          )}
        </div>

        {/* Mode Switcher for English & Chinese: Word Quests vs Radical Builder (ZH) vs Story Quests vs Chapter Series (ZH) */}
        {activeSubjectId !== 'math' && (
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-[#F3EFE7] p-1">
            <button
              type="button"
              onClick={() => setQuestMode('words')}
              className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                effectiveQuestMode === 'words'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <BookOpen className="h-4 w-4 text-[#2563EB]" />
              <span>
                {activeSubjectId === 'chinese'
                  ? `詞彙關卡 (${zhSets.length})`
                  : `Word Quests (${enSets.length})`}
              </span>
            </button>
            {activeSubjectId === 'chinese' && (
              <>
                <button
                  type="button"
                  onClick={() => setQuestMode('radicals')}
                  className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                    effectiveQuestMode === 'radicals'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Puzzle className="h-4 w-4 text-[#0D9488]" />
                  <span>偏旁工廠 ({zhRadicalFamilies.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuestMode('measures')}
                  className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                    effectiveQuestMode === 'measures'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Ruler className="h-4 w-4 text-[#4F46E5]" />
                  <span>量詞與成語 ({zhMeasureIdiomSets.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuestMode('patterns')}
                  className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                    effectiveQuestMode === 'patterns'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-[#EA580C]" />
                  <span>句型魔方 ({zhSentencePatterns.length})</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setQuestMode('stories')}
              className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                effectiveQuestMode === 'stories'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <BookText className="h-4 w-4 text-[#DB2777]" />
              <span>
                {activeSubjectId === 'chinese'
                  ? `短篇閱讀 (${zhReadingSets.length})`
                  : `Story Quests (${enReadingSets.length})`}
              </span>
            </button>
            {activeSubjectId === 'english' && (
              <>
                <button
                  type="button"
                  onClick={() => setQuestMode('roots')}
                  className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                    effectiveQuestMode === 'roots'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Dna className="h-4 w-4 text-[#2563EB]" />
                  <span>Word Roots ({enRootFamilies.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuestMode('grammar')}
                  className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                    effectiveQuestMode === 'grammar'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Wrench className="h-4 w-4 text-[#EA580C]" />
                  <span>Grammar Lab ({enGrammarSets.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuestMode('spelling')}
                  className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                    effectiveQuestMode === 'spelling'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-[#D97706]" />
                  <span>Spelling Bee ({enSpellingSets.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuestMode('enChapters')}
                  className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                    effectiveQuestMode === 'enChapters'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <BookMarked className="h-4 w-4 text-[#7C3AED]" />
                  <span>Chapter Books ({BUILTIN_ENGLISH_CHAPTER_SERIES.length})</span>
                </button>
              </>
            )}
            {activeSubjectId === 'chinese' && (
              <button
                type="button"
                onClick={() => setQuestMode('chapters')}
                className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                  effectiveQuestMode === 'chapters'
                    ? 'bg-white text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <BookMarked className="h-4 w-4 text-[#7C3AED]" />
                <span>章節小說 ({BUILTIN_CHAPTER_SERIES.length})</span>
              </button>
            )}
          </div>
        )}

        {/* Phase 5B: Math Mode Switcher (Math Quests vs Bar Model Lab) */}
        {activeSubjectId === 'math' && (
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-[#F3EFE7] p-1">
            <button
              type="button"
              onClick={() => setQuestMode('words')}
              className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                effectiveQuestMode === 'words'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Calculator className="h-4 w-4 text-[#059669]" />
              <span>Math Quests ({mathSets.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setQuestMode('barModels')}
              className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                effectiveQuestMode === 'barModels'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <BarChart3 className="h-4 w-4 text-[#2563EB]" />
              <span>Bar Model Lab ({BAR_MODEL_UNITS.length})</span>
            </button>
          </div>
        )}

        {/* Saved Custom School Word Sets — Surfaced ABOVE built-in cards for instant access */}
        {activeSubjectId === 'english' && effectiveQuestMode === 'words' && enCustomSets.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="font-display text-base font-extrabold text-[#0F766E]">
              My School Word Sets ({enCustomSets.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {enCustomSets.map((set) => (
                <div
                  key={set.id}
                  className="qv-surface rounded-3xl p-4 flex items-center justify-between gap-3 border-[#0D9488]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CollectibleArt
                      id={set.emblemCollectibleId}
                      size={52}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-extrabold truncate">
                        {set.title}
                      </h3>
                      <span className="text-xs font-bold text-[#0F766E] tabular-nums">
                        {set.words.length} words
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStartEnglishRun(set)}
                      className="qv-btn min-h-[42px] rounded-xl border-2 border-[#1C1917] bg-[#0D9488] px-3.5 py-2 text-xs font-extrabold text-white"
                    >
                      Play
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomSet(set.id)}
                      aria-label={`Delete ${set.title}`}
                      className="qv-btn inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl text-[#78716C] hover:text-[#E11D48]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubjectId === 'chinese' && effectiveQuestMode === 'words' && zhCustomSets.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="font-display text-base font-extrabold text-[#0F766E]">
              我的中文學校生字表 ({zhCustomSets.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {zhCustomSets.map((set) => (
                <div
                  key={set.id}
                  className="qv-surface rounded-3xl p-4 flex items-center justify-between gap-3 border-[#0D9488]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CollectibleArt
                      id={set.emblemCollectibleId}
                      size={52}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-extrabold truncate">
                        {set.title}
                      </h3>
                      <span className="text-xs font-bold text-[#0F766E] tabular-nums">
                        {set.words.length} 個生詞
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStartChineseRun(set)}
                      className="qv-btn min-h-[42px] rounded-xl border-2 border-[#1C1917] bg-[#0D9488] px-3.5 py-2 text-xs font-extrabold text-white"
                    >
                      開始
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomSet(set.id)}
                      aria-label={`刪除 ${set.title}`}
                      className="qv-btn inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl text-[#78716C] hover:text-[#E11D48]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chinese Chapter Story Series Grid (4 series x 5 episodes = 20 episodes) */}
        {activeSubjectId === 'chinese' && effectiveQuestMode === 'chapters' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BUILTIN_CHAPTER_SERIES.map((series) => {
              const epDone = getSeriesCompletedCount(
                series,
                player.completedChapterEpisodeIds ?? [],
              );
              const allDone = isSeriesFullyCompleted(
                series,
                player.completedChapterEpisodeIds ?? [],
              );
              const claimed = (player.claimedChapterSeriesIds ?? []).includes(series.id);
              return (
                <button
                  key={series.id}
                  type="button"
                  onClick={() => onStartChapterSeries(series)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: series.bgHex }}
                  >
                    <CollectibleArt
                      id={series.emblemCollectibleId}
                      size={68}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: series.accentHex }}
                      >
                        Tier {series.tier} · {series.genreTag}
                      </span>
                      {allDone && !claimed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-2.5 py-0.5 text-xs font-extrabold text-white">
                          <Gift className="h-3.5 w-3.5" />
                          +40 寶箱可領！
                        </span>
                      ) : claimed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          全 5 集通關！
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#1C1917] tabular-nums">
                          已讀 {epDone}/5 集
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-xl font-extrabold text-[#1C1917]">
                      《{series.title}》
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">{series.tagline}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {series.episodes.map((ep) => {
                        const done = (player.completedChapterEpisodeIds ?? []).includes(ep.id);
                        return (
                          <span
                            key={ep.id}
                            className={`rounded-lg px-2 py-0.5 text-[11px] font-extrabold tabular-nums ${
                              done
                                ? 'bg-[#ECFDF5] text-[#047857] border border-[#6EE7B7]'
                                : 'bg-[#F3EFE7] text-[#57534E]'
                            }`}
                          >
                            EP{ep.episodeNumber}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Chinese Radical Builder Grid */}
        {activeSubjectId === 'chinese' && effectiveQuestMode === 'radicals' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zhRadicalFamilies.map((fam) => {
              const done = (player.completedRadicalIds ?? []).includes(fam.id);
              const isPhonetic = fam.kind === 'phonetic';
              const policy = getQuestRewardPolicy(player, {
                questSetId: fam.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                completedIds: player.completedRadicalIds ?? [],
                words: fam.items.map((it) => it.char),
              });
              return (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => onStartRadicalFamily(fam)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: isPhonetic ? '#F0FDFA' : '#FDF2F8' }}
                  >
                    <div className="flex items-center gap-3">
                      <CollectibleArt
                        id={fam.emblemCollectibleId}
                        size={58}
                        className="border-2 border-[#1C1917]"
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-white font-display text-2xl font-extrabold text-[#1C1917] shadow-xs">
                        {fam.anchor}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: isPhonetic ? '#0D9488' : '#DB2777' }}
                      >
                        {isPhonetic ? '同聲旁家族' : '同部首家族'}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, true, '已解鎖')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +25–30
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
                      {fam.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">{fam.subtitle}</p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {fam.items.map((it) => (
                        <span
                          key={it.char}
                          className="rounded-lg bg-[#F3EFE7] px-2.5 py-1 text-sm font-extrabold text-[#1C1917]"
                        >
                          <RubyWord word={it.char} zhuyin={it.zhuyin} showZhuyin={showZhuyin} />
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase 4A: Chinese Measure Words & Idiom Context Grid */}
        {activeSubjectId === 'chinese' && effectiveQuestMode === 'measures' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zhMeasureIdiomSets.map((ms) => {
              const done = (player.completedMeasureIds ?? []).includes(ms.id);
              const isMeasure = ms.kind === 'measure';
              const policy = getQuestRewardPolicy(player, {
                questSetId: ms.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                completedIds: player.completedMeasureIds ?? [],
                words: ms.questions.map((q) => q.targetAnswer),
              });
              return (
                <button
                  key={ms.id}
                  type="button"
                  onClick={() => onStartMeasureIdiomSet(ms)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: ms.bgHex }}
                  >
                    <CollectibleArt
                      id={ms.emblemCollectibleId}
                      size={60}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: isMeasure ? '#4F46E5' : '#EA580C' }}
                      >
                        {isMeasure ? '📏 量詞大作戰' : '💡 易混詞／成語'}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, true, '已完成')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +45–60
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
                      {ms.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">{ms.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {ms.questions.map((q) => (
                        <span
                          key={q.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EFE7] text-base"
                          aria-hidden="true"
                        >
                          {q.visualEmoji}
                        </span>
                      ))}
                      <span className="rounded-lg bg-[#F3EFE7] px-2 py-1 text-[11px] font-extrabold text-[#57534E]">
                        5 題挑戰
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase 5C: Chinese Sentence Pattern Lab Grid */}
        {activeSubjectId === 'chinese' && effectiveQuestMode === 'patterns' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zhSentencePatterns.map((sp) => {
              const done = (player.completedSentencePatternIds ?? []).includes(sp.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: sp.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                completedIds: player.completedSentencePatternIds ?? [],
              });
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => onStartSentencePatternSet?.(sp)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: sp.bgHex }}
                  >
                    <CollectibleArt
                      id={sp.emblemCollectibleId}
                      size={60}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: sp.accentHex }}
                      >
                        🧱 {sp.patternBadge}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, true, '已過關')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +35–50
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
                      {sp.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">{sp.subtitle}</p>
                    <p className="text-[11px] font-extrabold text-[#EA580C]">
                      ✨ 關聯詞填空 ＋ 句型積木重組（5 題雙關卡）
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Story Quests Grid (English & Traditional Chinese) */}
        {activeSubjectId !== 'math' && effectiveQuestMode === 'stories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeSubjectId === 'chinese' ? zhReadingSets : enReadingSets).map((rq) => {
              const done = player.completedQuestSetIds.includes(rq.id);
              const isZh = activeSubjectId === 'chinese';
              const policy = getQuestRewardPolicy(player, {
                questSetId: rq.id,
                kind: 'static',
                subjectId: rq.subjectId,
                todayKey,
              });
              return (
                <button
                  key={rq.id}
                  type="button"
                  onClick={() => onStartReadingRun(rq)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: rq.bgHex }}
                  >
                    <CollectibleArt
                      id={rq.emblemCollectibleId}
                      size={68}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: rq.accentHex }}
                      >
                        {rq.shortTag}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, isZh, isZh ? '已讀完' : 'Read')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +50–65
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-display text-xl font-extrabold text-[#1C1917]">
                      {rq.title}
                    </h3>
                    <div className="space-y-1">
                      {rq.passages.map((p, idx) => (
                        <div
                          key={p.id}
                          className="text-xs font-bold text-[#57534E] flex items-center gap-1.5"
                        >
                          <BookText className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                          <span className="truncate">
                            {isZh ? `短文 ${idx + 1}：${p.title}` : `Story ${idx + 1}: ${p.title}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase 4B: English Word Roots & Prefixes Lab Grid */}
        {activeSubjectId === 'english' && effectiveQuestMode === 'roots' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enRootFamilies.map((fam) => {
              const done = (player.completedEnglishRootIds ?? []).includes(fam.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: fam.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                completedIds: player.completedEnglishRootIds ?? [],
                words: fam.items.map((it) => it.word),
              });
              return (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => onStartEnglishRootFamily(fam)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: fam.bgHex }}
                  >
                    <div className="flex items-center gap-3">
                      <CollectibleArt
                        id={fam.emblemCollectibleId}
                        size={58}
                        className="border-2 border-[#1C1917]"
                      />
                      <span className="rounded-2xl border-2 border-[#1C1917] bg-white px-3 py-1.5 font-display text-xl font-extrabold text-[#1C1917]">
                        {fam.morpheme}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: fam.accentHex }}
                      >
                        {fam.kind === 'prefix'
                          ? 'Prefix'
                          : fam.kind === 'suffix'
                            ? 'Suffix'
                            : 'Root'}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, false, 'Mastered')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +35–50
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
                      {fam.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">
                      “{fam.morpheme}” = {fam.morphemeMeaning}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {fam.items.map((it) => (
                        <span
                          key={it.word}
                          className="rounded-lg bg-[#F3EFE7] px-2 py-0.5 text-xs font-bold text-[#44403C]"
                        >
                          {it.word}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase 4B: English Grammar Repair Lab Grid */}
        {activeSubjectId === 'english' && effectiveQuestMode === 'grammar' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enGrammarSets.map((gs) => {
              const done = (player.completedGrammarIds ?? []).includes(gs.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: gs.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                completedIds: player.completedGrammarIds ?? [],
                words: gs.questions.map((q) => q.targetAnswer),
              });
              return (
                <button
                  key={gs.id}
                  type="button"
                  onClick={() => onStartGrammarRepairSet(gs)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: gs.bgHex }}
                  >
                    <CollectibleArt
                      id={gs.emblemCollectibleId}
                      size={60}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: gs.accentHex }}
                      >
                        {gs.categoryTag}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, false, 'Repaired')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +45–60
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
                      {gs.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">{gs.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {gs.questions.map((q) => (
                        <span
                          key={q.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EFE7] text-base"
                          aria-hidden="true"
                        >
                          {q.emoji}
                        </span>
                      ))}
                      <span className="rounded-lg bg-[#F3EFE7] px-2 py-1 text-[11px] font-extrabold text-[#57534E]">
                        5 Fixes
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase 5A: English Spelling Bee Lab Grid */}
        {activeSubjectId === 'english' && effectiveQuestMode === 'spelling' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enSpellingSets.map((sp) => {
              const done = (player.completedSpellingIds ?? []).includes(sp.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: sp.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                completedIds: player.completedSpellingIds ?? [],
                words: sp.items.map((it) => it.word),
              });
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => onStartSpellingSet?.(sp)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div className="px-5 py-4 flex items-center justify-between gap-3 bg-[#FFFBEB]">
                    <CollectibleArt
                      id={sp.emblemCollectibleId}
                      size={60}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="rounded-full bg-[#D97706] px-2.5 py-0.5 text-xs font-extrabold text-white">
                        🐝 {sp.badge}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, false, 'Spelled')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +25–35
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
                      {sp.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">{sp.subtitle}</p>
                    <p className="text-[11px] font-extrabold text-[#B45309]">
                      🔊 5 Audio Spelling Challenges · Tiles & Keyboard
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase 5A: English Chapter Story Series Grid */}
        {activeSubjectId === 'english' && effectiveQuestMode === 'enChapters' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BUILTIN_ENGLISH_CHAPTER_SERIES.map((series) => {
              const epDone = getEnglishSeriesCompletedCount(
                series,
                player.completedEnglishChapterIds ?? [],
              );
              const fullDone = isEnglishSeriesFullyCompleted(
                series,
                player.completedEnglishChapterIds ?? [],
              );
              return (
                <button
                  key={series.id}
                  type="button"
                  onClick={() => onStartEnglishChapterSeries?.(series)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: series.bgHex }}
                  >
                    <CollectibleArt
                      id={series.emblemCollectibleId}
                      size={66}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: series.accentHex }}
                      >
                        {series.genreTag} · Tier {series.tier}
                      </span>
                      {fullDone ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          All 5 Chapters Done!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#1C1917] tabular-nums">
                          {epDone}/5 Chapters
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-xl font-extrabold text-[#1C1917]">
                      {series.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">{series.subtitle}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {series.episodes.map((ep) => {
                        const done = (player.completedEnglishChapterIds ?? []).includes(ep.id);
                        return (
                          <span
                            key={ep.id}
                            className={`rounded-lg px-2 py-0.5 text-[11px] font-extrabold tabular-nums ${
                              done
                                ? 'bg-[#ECFDF5] text-[#047857] border border-[#6EE7B7]'
                                : 'bg-[#F3EFE7] text-[#57534E]'
                            }`}
                          >
                            Ch.{ep.episodeNumber}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Quest Cards Grid per Active Subject */}
        {activeSubjectId === 'english' && effectiveQuestMode === 'words' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enSets.map((ws) => {
              const done = player.completedQuestSetIds.includes(ws.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: ws.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                words: ws.words.map((w) => w.word),
              });
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => onStartEnglishRun(ws)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: ws.bgHex }}
                  >
                    <CollectibleArt
                      id={ws.emblemCollectibleId}
                      size={68}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: ws.accentHex }}
                      >
                        {ws.shortTag}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, false, 'Cleared')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +55–75
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-display text-xl font-extrabold text-[#1C1917]">
                      {ws.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {ws.words.map((w) => (
                        <span
                          key={w.word}
                          className="rounded-lg bg-[#F3EFE7] px-2 py-0.5 text-xs font-bold text-[#44403C]"
                        >
                          {w.word}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase 5B: Math Two-Step Bar Model Lab Grid */}
        {activeSubjectId === 'math' && effectiveQuestMode === 'barModels' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BAR_MODEL_UNITS.map((unit) => {
              const done = (player.completedBarModelIds ?? []).includes(unit.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: unit.id,
                kind: 'math',
                subjectId: 'math',
                todayKey,
                completedIds: player.completedBarModelIds ?? [],
              });
              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => onStartBarModelUnit?.(unit)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: unit.bgHex }}
                  >
                    <CollectibleArt
                      id={unit.emblemCollectibleId}
                      size={64}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: unit.accentHex }}
                      >
                        Tier {unit.tier} · {unit.ccssTag}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, false, 'Solved')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +30–40
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
                      📊 {unit.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#57534E]">{unit.subtitle}</p>
                    <p className="text-[11px] font-extrabold text-[#2563EB]">
                      ♾️ Fresh Dynamic Numbers · Tape Diagram Guide
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeSubjectId === 'math' && effectiveQuestMode === 'words' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mathSets.map((ms) => {
              const done = player.completedQuestSetIds.includes(ms.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: ms.id,
                kind: 'math',
                subjectId: 'math',
                todayKey,
              });
              return (
                <button
                  key={ms.id}
                  type="button"
                  onClick={() => onStartMathRun(ms)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: ms.bgHex }}
                  >
                    <CollectibleArt
                      id={ms.emblemCollectibleId}
                      size={68}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: ms.accentHex }}
                      >
                        {ms.shortTag}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, false, 'Cleared')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +60–80
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-display text-xl font-extrabold text-[#1C1917]">
                      {ms.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {ms.items.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-lg bg-[#F3EFE7] px-2 py-0.5 text-xs font-bold text-[#44403C]"
                        >
                          {item.skillLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeSubjectId === 'chinese' && effectiveQuestMode === 'words' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zhSets.map((ws) => {
              const done = player.completedQuestSetIds.includes(ws.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: ws.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                words: ws.words.map((w) => w.word),
              });
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => onStartChineseRun(ws)}
                  className="qv-surface qv-btn qv-hover-lift text-left rounded-3xl overflow-hidden flex flex-col"
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: ws.bgHex }}
                  >
                    <CollectibleArt
                      id={ws.emblemCollectibleId}
                      size={68}
                      className="border-2 border-[#1C1917]"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                        style={{ backgroundColor: ws.accentHex }}
                      >
                        {ws.shortTag}
                      </span>
                      {done ? (
                        renderDoneRewardBadge(policy, true, '已過關')
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-extrabold text-[#B45309] tabular-nums">
                          <Coins className="h-3.5 w-3.5" />
                          +55–75
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-display text-xl font-extrabold text-[#1C1917]">
                      {ws.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {ws.words.map((w) => (
                        <span
                          key={w.word}
                          className="rounded-lg bg-[#F3EFE7] px-2 py-0.5 text-xs font-bold text-[#44403C]"
                        >
                          <RubyWord word={w.word} zhuyin={w.zhuyin} showZhuyin={showZhuyin} />
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

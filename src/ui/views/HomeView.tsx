import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  BookText,
  Brain,
  Calculator,
  CheckCircle2,
  Dna,
  Flame,
  Gift,
  Languages,
  MessageSquareQuote,
  Plus,
  Puzzle,
  Ruler,
  Search,
  Sparkles,
  Star,
  Target,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { computeWeeklyGoalProgress } from '../../core/analytics';
import {
  DAILY_TRI_SUBJECT_BONUS,
  getQuestRewardPolicy,
  getTodayArcadeTokensEarned,
} from '../../core/economy';
import { getDueReviewItems, getTrickyWords } from '../../core/mastery';
import { countClinicPatients, type MixedWarmupMode } from '../../core/mixedWarmupEngine';
import { getPackById, MIN_PACK_COST } from '../../core/packs';
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
  getLookAlikeSetsByTier,
  type LookAlikeHanziSet,
} from '../../subjects/chinese/lookAlikeSets';
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
import {
  getFigurativeSetsByTier,
  type FigurativeQuestSet,
} from '../../subjects/english/figurativeSets';
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
import { CollectibleArt, PackEnvelopeArt } from '../artwork/CollectibleArt';
import { HeroStage } from '../components/HeroStage';
import { QuestCard } from '../components/QuestCard';
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
  onStartFigurativeSet?: (set: FigurativeQuestSet) => void;
  onStartMathRun: (questSet: MathQuestSet) => void;
  onStartFactFluency?: () => void;
  onStartBarModelUnit?: (unit: BarModelUnitMeta) => void;
  onStartChineseRun: (wordSet: ChineseWordSet) => void;
  onStartChineseListening: () => void;
  onStartRadicalFamily: (family: RadicalFamily) => void;
  onStartMeasureIdiomSet: (set: MeasureIdiomSet) => void;
  onStartSentencePatternSet?: (set: SentencePatternSet) => void;
  onStartLookAlikeSet?: (set: LookAlikeHanziSet) => void;
  onStartChapterSeries: (series: ChapterSeries) => void;
  onStartReadingRun: (questSet: ReadingQuestSet) => void;
  onOpenCustomImporter: (subjectId: 'english' | 'chinese') => void;
  onDeleteCustomSet: (id: string) => void;
  onGoToMarket: () => void;
  onClearWishlistPack?: () => void;
}

type QuestMode =
  | 'words'
  | 'stories'
  | 'roots'
  | 'grammar'
  | 'spelling'
  | 'enChapters'
  | 'figurative'
  | 'radicals'
  | 'measures'
  | 'patterns'
  | 'lookAlike'
  | 'chapters'
  | 'barModels';

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
  onStartFigurativeSet,
  onStartMathRun,
  onStartFactFluency,
  onStartBarModelUnit,
  onStartChineseRun,
  onStartChineseListening,
  onStartRadicalFamily,
  onStartMeasureIdiomSet,
  onStartSentencePatternSet,
  onStartLookAlikeSet,
  onStartChapterSeries,
  onStartReadingRun,
  onOpenCustomImporter,
  onDeleteCustomSet,
  onGoToMarket,
  onClearWishlistPack,
}) => {
  const [questMode, setQuestMode] = useState<QuestMode>('words');
  const [showArcadeDrawer, setShowArcadeDrawer] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);

  const isZh = activeSubjectId === 'chinese';
  const todayKey = getLocalDateKey();

  useEffect(() => {
    if (!voucherOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVoucherOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [voucherOpen]);

  const effectiveQuestMode: QuestMode =
    activeSubjectId === 'math'
      ? questMode === 'barModels'
        ? 'barModels'
        : 'words'
      : activeSubjectId === 'chinese' &&
          (questMode === 'roots' ||
            questMode === 'grammar' ||
            questMode === 'spelling' ||
            questMode === 'enChapters' ||
            questMode === 'figurative' ||
            questMode === 'barModels')
        ? 'words'
        : activeSubjectId === 'english' &&
            (questMode === 'radicals' ||
              questMode === 'measures' ||
              questMode === 'patterns' ||
              questMode === 'lookAlike' ||
              questMode === 'chapters' ||
              questMode === 'barModels')
          ? 'words'
          : questMode;

  const packsReady = Math.floor(player.tokens / MIN_PACK_COST);
  const weeklyGoalProgress = useMemo(() => computeWeeklyGoalProgress(player), [player]);
  const clinicCount = useMemo(() => countClinicPatients(player), [player]);
  const arcadeEarnedToday = useMemo(
    () => getTodayArcadeTokensEarned(player, todayKey),
    [player, todayKey],
  );

  const enSets = useMemo(() => getWordSetsByTier(activeTier), [activeTier]);
  const enRootFamilies = useMemo(() => getEnglishRootFamiliesByTier(activeTier), [activeTier]);
  const enGrammarSets = useMemo(() => getEnglishGrammarSetsByTier(activeTier), [activeTier]);
  const enSpellingSets = useMemo(() => getSpellingSetsByTier(activeTier), [activeTier]);
  const enFigurativeSets = useMemo(() => getFigurativeSetsByTier(activeTier), [activeTier]);
  const mathSets = useMemo(() => getMathSetsByTier(activeTier), [activeTier]);
  const zhSets = useMemo(() => getChineseSetsByTier(activeTier), [activeTier]);
  const zhRadicalFamilies = useMemo(() => getRadicalFamiliesByTier(activeTier), [activeTier]);
  const zhMeasureIdiomSets = useMemo(() => getMeasureIdiomSetsByTier(activeTier), [activeTier]);
  const zhSentencePatterns = useMemo(() => getSentencePatternSetsByTier(activeTier), [activeTier]);
  const zhLookAlikeSets = useMemo(() => getLookAlikeSetsByTier(activeTier), [activeTier]);
  const enReadingSets = useMemo(() => getEnglishReadingByTier(activeTier), [activeTier]);
  const zhReadingSets = useMemo(() => getChineseReadingByTier(activeTier), [activeTier]);

  const enCustomSets = useMemo(
    () =>
      player.customWordSets
        .filter((s) => (s.subjectId ?? 'english') === 'english')
        .map(customRecordToWordSet),
    [player.customWordSets],
  );
  const zhCustomSets = useMemo(
    () =>
      player.customWordSets
        .filter((s) => s.subjectId === 'chinese')
        .map(customChineseRecordToWordSet),
    [player.customWordSets],
  );

  const bossDate =
    player.subjectBossRematchDate?.[activeSubjectId] ??
    (activeSubjectId === 'english' ? player.lastBossRematchDate : undefined);

  const { enRematch, mathRematch, zhRematch, enSrs, mathSrs, zhSrs, dueSrsCount, trickyCount } =
    useMemo(
      () => ({
        enRematch:
          activeSubjectId === 'english'
            ? buildTrickyRematchWordSet(player.wordMastery, BUILTIN_WORD_SETS, bossDate)
            : null,
        mathRematch:
          activeSubjectId === 'math'
            ? buildMathTrickyRematchSet(player.wordMastery, BUILTIN_MATH_SETS, bossDate)
            : null,
        zhRematch:
          activeSubjectId === 'chinese'
            ? buildChineseTrickyRematchSet(player.wordMastery, BUILTIN_CHINESE_SETS, bossDate)
            : null,
        enSrs:
          activeSubjectId === 'english'
            ? buildEnglishSrsReviewSet(player.wordMastery, BUILTIN_WORD_SETS)
            : null,
        mathSrs:
          activeSubjectId === 'math'
            ? buildMathSrsReviewSet(player.wordMastery, BUILTIN_MATH_SETS)
            : null,
        zhSrs:
          activeSubjectId === 'chinese'
            ? buildChineseSrsReviewSet(player.wordMastery, BUILTIN_CHINESE_SETS)
            : null,
        dueSrsCount: getDueReviewItems(player.wordMastery, activeSubjectId).length,
        trickyCount: getTrickyWords(player.wordMastery, activeSubjectId).length,
      }),
      [player.wordMastery, activeSubjectId, bossDate],
    );

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

  const pinnedPack = player.pinnedWishlistPackId
    ? getPackById(player.pinnedWishlistPackId)
    : undefined;

  const modeTabClass = (mode: QuestMode) =>
    `qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
      effectiveQuestMode === mode
        ? 'bg-white text-[#1C1917] shadow-xs'
        : 'text-[#57534E] hover:text-[#1C1917]'
    }`;

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

        {isZh && (
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

      {/* Visual-First Arcade Hero Stage (Clean 2-Tier Hierarchy + Collapsible Arcade Hall) */}
      <HeroStage
        player={player}
        activeSubjectId={activeSubjectId}
        todayKey={todayKey}
        heroTitle={heroTitle}
        packsReady={packsReady}
        placementCompleted={placementCompleted}
        warmUpBonus={warmUpBonus}
        clinicCount={clinicCount}
        arcadeEarnedToday={arcadeEarnedToday}
        showArcadeDrawer={showArcadeDrawer}
        onToggleArcadeDrawer={() => setShowArcadeDrawer((v) => !v)}
        onHeroPlay={handleHeroPlay}
        onStartPlacement={onStartPlacement}
        onGoToMarket={onGoToMarket}
        onStartBlitz={onStartBlitz}
        onStartCafe={onStartCafe}
        onStartFishing={onStartFishing}
        onStartBossBattle={onStartBossBattle}
        onStartTowerDefense={onStartTowerDefense}
        onOpenLogicLab={onOpenLogicLab}
        onOpenMixedWarmup={onOpenMixedWarmup}
        onStartFactFluency={onStartFactFluency}
        onStartChineseListening={onStartChineseListening}
      />

      {/* ⭐ Pinned Wishlist Pack Progress Strip (Bilingual) */}
      {pinnedPack &&
        (() => {
          const remaining = Math.max(0, pinnedPack.cost - player.tokens);
          const pct = Math.max(
            0,
            Math.min(100, Math.round((player.tokens / Math.max(1, pinnedPack.cost)) * 100)),
          );
          const ready = remaining === 0;
          return (
            <section className="rounded-2xl border-2 border-[#F59E0B] bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <PackEnvelopeArt packId={pinnedPack.id} size={38} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-extrabold text-[#92400E]">
                    <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#D97706] shrink-0" />
                    <span>
                      {isZh ? `願望卡包：${pinnedPack.name}` : `Wishlist Pack: ${pinnedPack.name}`}
                    </span>
                    <span className="tabular-nums text-[#B45309]">
                      ({Math.min(player.tokens, pinnedPack.cost)}/{pinnedPack.cost} Tokens)
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-28 sm:w-40 overflow-hidden rounded-full bg-white/90 border border-[#FCD34D]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: ready ? '#059669' : '#F59E0B' }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#78350F] tabular-nums">
                      {ready
                        ? isZh
                          ? '🎉 代幣夠抽了！'
                          : '🎉 Ready to open!'
                        : isZh
                          ? `還差 ${remaining} Tokens 就能抽！`
                          : `${remaining} more Tokens to open!`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGoToMarket}
                  className="qv-btn inline-flex min-h-[36px] items-center gap-1 rounded-xl border-2 border-[#1C1917] bg-white px-3 py-1 text-xs font-extrabold text-[#1C1917]"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
                  <span>
                    {ready
                      ? isZh
                        ? '去開願望盒 →'
                        : 'Open Wishlist Pack →'
                      : isZh
                        ? '看卡包 →'
                        : 'View Packs →'}
                  </span>
                </button>
                {onClearWishlistPack && (
                  <button
                    type="button"
                    aria-label="Clear pinned wishlist pack"
                    onClick={onClearWishlistPack}
                    className="qv-btn inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#FCD34D] bg-white/80 text-[#92400E]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </section>
          );
        })()}

      {/* Daily Tri-Subject Quest + Streak Chest Strip */}
      <section className="qv-surface rounded-2xl px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-1 font-display text-xs font-extrabold text-[#C2410C] tabular-nums">
            <Flame className="h-3.5 w-3.5 fill-current" />
            {isZh ? `連勝 ${streakDays} 天` : `${streakDays}-Day Streak`}
          </span>

          <span className="font-display text-xs sm:text-sm font-extrabold text-[#1C1917]">
            {isZh ? '今日三科任務：' : 'Daily 3-Subject Quest:'}
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
              {isZh ? '今日三科寶箱已領取！' : 'Daily Chest Claimed!'}
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
                {isZh
                  ? `領取 +${dailyRewardAmount} 三科寶箱！`
                  : `Claim +${dailyRewardAmount} Daily Chest!`}
              </span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-extrabold text-[#B45309] tabular-nums">
              <Gift className="h-3.5 w-3.5" />
              {isZh ? `完成三科領 +${dailyRewardAmount}` : `Complete all 3 for +${dailyRewardAmount}`}
            </span>
          )}
        </div>
      </section>

      {/* Weekly Goal Progress Bar & Real-World Reward Voucher (Bilingual) */}
      {weeklyGoalProgress.enabled && (
        <section className="qv-surface rounded-2xl px-4 py-3 sm:px-5 border-2 border-[#FDE68A] bg-[#FFFDF8] space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-2.5 py-0.5 font-display text-xs font-extrabold text-[#B45309]">
                <Target className="h-3.5 w-3.5" />
                {isZh ? '本週目標' : 'Weekly Goal'}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#1C1917] tabular-nums">
                {weeklyGoalProgress.enTarget > 0 &&
                  `EN ${weeklyGoalProgress.enDone}/${weeklyGoalProgress.enTarget}`}
                {weeklyGoalProgress.enTarget > 0 &&
                (weeklyGoalProgress.zhTarget > 0 || weeklyGoalProgress.mathTarget > 0)
                  ? ' · '
                  : ''}
                {weeklyGoalProgress.zhTarget > 0 &&
                  `中文 ${weeklyGoalProgress.zhDone}/${weeklyGoalProgress.zhTarget}`}
                {weeklyGoalProgress.zhTarget > 0 && weeklyGoalProgress.mathTarget > 0 ? ' · ' : ''}
                {weeklyGoalProgress.mathTarget > 0 &&
                  `Math ${weeklyGoalProgress.mathDone}/${weeklyGoalProgress.mathTarget}`}
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
                <span>{isZh ? '🎉 打開本週真實獎勵券！' : '🎉 Open Weekly Reward Voucher!'}</span>
              </button>
            ) : weeklyGoalProgress.isMet && weeklyGoalProgress.isRedeemed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#10B981] px-3 py-1 text-xs font-extrabold text-[#047857]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isZh ? '🏆 本週獎勵已兌換！' : '🏆 Weekly Reward Redeemed!'}
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

      {/* Real-World Reward Voucher Modal */}
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
                {isZh ? '記憶曲線每日複習' : 'SRS MEMORY REVIEW DUE'}
              </div>
              <h2 className="mt-1 font-display text-lg sm:text-xl font-extrabold text-[#1C1917] tabular-nums">
                {isZh
                  ? `今天有 ${dueSrsCount} 個詞語到期複習，鎖進長期記憶！`
                  : activeSubjectId === 'math'
                    ? `${dueSrsCount} Math Skills Ready for Memory Review!`
                    : `${dueSrsCount} Words Due for Memory Review Today!`}
              </h2>
            </div>
          </div>
          <span className="shrink-0 rounded-2xl border-2 border-[#1C1917] bg-[#0284C7] px-4 py-2.5 font-display text-sm font-extrabold text-white">
            {isZh ? '複習 →' : 'Review →'}
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
                {isZh ? '1.5× 每日錯詞魔王戰' : '1.5× DAILY BOSS REMATCH'}
              </div>
              <h2 className="mt-1 font-display text-xl font-extrabold text-[#1C1917] tabular-nums">
                {isZh
                  ? `擊敗你的 ${trickyCount} 個常錯詞語！`
                  : activeSubjectId === 'math'
                    ? `Beat Your ${trickyCount} Tricky Math Skills!`
                    : `Beat Your ${trickyCount} Tricky Words!`}
              </h2>
            </div>
          </div>
          <span className="shrink-0 rounded-2xl border-2 border-[#1C1917] bg-[#E11D48] px-4 py-2.5 font-display text-sm font-extrabold text-white">
            {isZh ? '挑戰 →' : 'Battle →'}
          </span>
        </button>
      )}

      {/* Visual 4-Tier Selector + School Words Import + Quest Mode Grids */}
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
              <span>{isZh ? '匯入中文生字表' : 'Import School Words'}</span>
            </button>
          )}
        </div>

        {/* Mode Switcher */}
        {activeSubjectId !== 'math' ? (
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-[#F3EFE7] p-1">
            <button type="button" onClick={() => setQuestMode('words')} className={modeTabClass('words')}>
              <BookOpen className="h-4 w-4 text-[#2563EB]" />
              <span>{isZh ? `詞彙關卡 (${zhSets.length})` : `Word Quests (${enSets.length})`}</span>
            </button>
            {isZh && (
              <>
                <button type="button" onClick={() => setQuestMode('radicals')} className={modeTabClass('radicals')}>
                  <Puzzle className="h-4 w-4 text-[#0D9488]" />
                  <span>偏旁工廠 ({zhRadicalFamilies.length})</span>
                </button>
                <button type="button" onClick={() => setQuestMode('measures')} className={modeTabClass('measures')}>
                  <Ruler className="h-4 w-4 text-[#4F46E5]" />
                  <span>量詞與成語 ({zhMeasureIdiomSets.length})</span>
                </button>
                <button type="button" onClick={() => setQuestMode('patterns')} className={modeTabClass('patterns')}>
                  <Sparkles className="h-4 w-4 text-[#EA580C]" />
                  <span>句型魔方 ({zhSentencePatterns.length})</span>
                </button>
                <button type="button" onClick={() => setQuestMode('lookAlike')} className={modeTabClass('lookAlike')}>
                  <Search className="h-4 w-4 text-[#DB2777]" />
                  <span>形近字館 ({zhLookAlikeSets.length})</span>
                </button>
              </>
            )}
            <button type="button" onClick={() => setQuestMode('stories')} className={modeTabClass('stories')}>
              <BookText className="h-4 w-4 text-[#DB2777]" />
              <span>{isZh ? `短篇閱讀 (${zhReadingSets.length})` : `Story Quests (${enReadingSets.length})`}</span>
            </button>
            {activeSubjectId === 'english' && (
              <>
                <button type="button" onClick={() => setQuestMode('roots')} className={modeTabClass('roots')}>
                  <Dna className="h-4 w-4 text-[#2563EB]" />
                  <span>Word Roots ({enRootFamilies.length})</span>
                </button>
                <button type="button" onClick={() => setQuestMode('grammar')} className={modeTabClass('grammar')}>
                  <Wrench className="h-4 w-4 text-[#EA580C]" />
                  <span>Grammar Lab ({enGrammarSets.length})</span>
                </button>
                <button type="button" onClick={() => setQuestMode('spelling')} className={modeTabClass('spelling')}>
                  <Sparkles className="h-4 w-4 text-[#D97706]" />
                  <span>Spelling Bee ({enSpellingSets.length})</span>
                </button>
                <button type="button" onClick={() => setQuestMode('figurative')} className={modeTabClass('figurative')}>
                  <MessageSquareQuote className="h-4 w-4 text-[#0D9488]" />
                  <span>Figurative Lab ({enFigurativeSets.length})</span>
                </button>
                <button type="button" onClick={() => setQuestMode('enChapters')} className={modeTabClass('enChapters')}>
                  <BookMarked className="h-4 w-4 text-[#7C3AED]" />
                  <span>Chapter Books ({BUILTIN_ENGLISH_CHAPTER_SERIES.length})</span>
                </button>
              </>
            )}
            {isZh && (
              <button type="button" onClick={() => setQuestMode('chapters')} className={modeTabClass('chapters')}>
                <BookMarked className="h-4 w-4 text-[#7C3AED]" />
                <span>章節小說 ({BUILTIN_CHAPTER_SERIES.length})</span>
              </button>
            )}
          </div>
        ) : (
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-[#F3EFE7] p-1">
            <button type="button" onClick={() => setQuestMode('words')} className={modeTabClass('words')}>
              <Calculator className="h-4 w-4 text-[#059669]" />
              <span>Math Quests ({mathSets.length})</span>
            </button>
            <button type="button" onClick={() => setQuestMode('barModels')} className={modeTabClass('barModels')}>
              <BarChart3 className="h-4 w-4 text-[#2563EB]" />
              <span>Bar Model Lab ({BAR_MODEL_UNITS.length})</span>
            </button>
          </div>
        )}

        {/* Saved Custom School Word Sets */}
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
                    <CollectibleArt id={set.emblemCollectibleId} size={52} className="border-2 border-[#1C1917]" />
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-extrabold truncate">{set.title}</h3>
                      <span className="text-xs font-bold text-[#0F766E] tabular-nums">{set.words.length} words</span>
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

        {isZh && effectiveQuestMode === 'words' && zhCustomSets.length > 0 && (
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
                    <CollectibleArt id={set.emblemCollectibleId} size={52} className="border-2 border-[#1C1917]" />
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-extrabold truncate">{set.title}</h3>
                      <span className="text-xs font-bold text-[#0F766E] tabular-nums">{set.words.length} 個生詞</span>
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

        {/* Chinese Chapter Story Series Grid */}
        {isZh && effectiveQuestMode === 'chapters' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BUILTIN_CHAPTER_SERIES.map((series) => {
              const epDone = getSeriesCompletedCount(series, player.completedChapterEpisodeIds ?? []);
              const allDone = isSeriesFullyCompleted(series, player.completedChapterEpisodeIds ?? []);
              const claimed = (player.claimedChapterSeriesIds ?? []).includes(series.id);
              const badge =
                allDone && !claimed ? (
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
                );
              return (
                <QuestCard
                  key={series.id}
                  emblemCollectibleId={series.emblemCollectibleId}
                  emblemSize={68}
                  bgHex={series.bgHex}
                  accentHex={series.accentHex}
                  tag={`Tier ${series.tier} · ${series.genreTag}`}
                  statusBadge={badge}
                  title={`《${series.title}》`}
                  titleSize="xl"
                  subtitle={series.tagline}
                  onClick={() => onStartChapterSeries(series)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* Chinese Radical Builder Grid */}
        {isZh && effectiveQuestMode === 'radicals' && (
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
                <QuestCard
                  key={fam.id}
                  emblemCollectibleId={fam.emblemCollectibleId}
                  emblemSize={58}
                  emblemExtra={
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-white font-display text-2xl font-extrabold text-[#1C1917] shadow-xs">
                      {fam.anchor}
                    </div>
                  }
                  bgHex={isPhonetic ? '#F0FDFA' : '#FDF2F8'}
                  accentHex={isPhonetic ? '#0D9488' : '#DB2777'}
                  tag={isPhonetic ? '同聲旁家族' : '同部首家族'}
                  done={done}
                  policy={policy}
                  isZh
                  doneDefaultLabel="已解鎖"
                  rewardRange="+25–30"
                  title={fam.title}
                  subtitle={fam.subtitle}
                  onClick={() => onStartRadicalFamily(fam)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* Chinese Measure Words & Idiom Context Grid */}
        {isZh && effectiveQuestMode === 'measures' && (
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
                <QuestCard
                  key={ms.id}
                  emblemCollectibleId={ms.emblemCollectibleId}
                  bgHex={ms.bgHex}
                  accentHex={isMeasure ? '#4F46E5' : '#EA580C'}
                  tag={isMeasure ? '📏 量詞大作戰' : '💡 易混詞／成語'}
                  done={done}
                  policy={policy}
                  isZh
                  doneDefaultLabel="已完成"
                  rewardRange="+45–60"
                  title={ms.title}
                  subtitle={ms.subtitle}
                  onClick={() => onStartMeasureIdiomSet(ms)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* Chinese Sentence Pattern Lab Grid */}
        {isZh && effectiveQuestMode === 'patterns' && (
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
                <QuestCard
                  key={sp.id}
                  emblemCollectibleId={sp.emblemCollectibleId}
                  bgHex={sp.bgHex}
                  accentHex={sp.accentHex}
                  tag={`🧱 ${sp.patternBadge}`}
                  done={done}
                  policy={policy}
                  isZh
                  doneDefaultLabel="已過關"
                  rewardRange="+35–50"
                  title={sp.title}
                  subtitle={sp.subtitle}
                  onClick={() => onStartSentencePatternSet?.(sp)}
                >
                  <p className="text-[11px] font-extrabold text-[#EA580C]">
                    ✨ 關聯詞填空 ＋ 句型積木重組（5 題雙關卡）
                  </p>
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* Chinese Look-Alike Hanzi Lab Grid */}
        {isZh && effectiveQuestMode === 'lookAlike' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zhLookAlikeSets.map((la) => {
              const done = (player.completedLookAlikeIds ?? []).includes(la.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: la.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                completedIds: player.completedLookAlikeIds ?? [],
                words: la.questions.map((q) => q.targetChar),
              });
              return (
                <QuestCard
                  key={la.id}
                  emblemCollectibleId={la.emblemCollectibleId}
                  bgHex={la.bgHex}
                  accentHex={la.accentHex}
                  tag={`🔍 ${la.shortTag}`}
                  done={done}
                  policy={policy}
                  isZh
                  doneDefaultLabel="已過關"
                  rewardRange="+15–40"
                  title={la.title}
                  subtitle={la.subtitle}
                  onClick={() => onStartLookAlikeSet?.(la)}
                >
                  <p className="text-[11px] font-extrabold text-[#DB2777]">
                    🔎 雙胞胎放大鏡對比 ＋ 5 題情境辨字衝刺
                  </p>
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* Story Quests Grid (English & Traditional Chinese) */}
        {activeSubjectId !== 'math' && effectiveQuestMode === 'stories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(isZh ? zhReadingSets : enReadingSets).map((rq) => {
              const done = player.completedQuestSetIds.includes(rq.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: rq.id,
                kind: 'static',
                subjectId: rq.subjectId,
                todayKey,
              });
              return (
                <QuestCard
                  key={rq.id}
                  emblemCollectibleId={rq.emblemCollectibleId}
                  emblemSize={68}
                  bgHex={rq.bgHex}
                  accentHex={rq.accentHex}
                  tag={rq.shortTag}
                  done={done}
                  policy={policy}
                  isZh={isZh}
                  doneDefaultLabel={isZh ? '已讀完' : 'Read'}
                  rewardRange="+50–65"
                  title={rq.title}
                  titleSize="xl"
                  onClick={() => onStartReadingRun(rq)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* English Word Roots & Prefixes Lab Grid */}
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
                <QuestCard
                  key={fam.id}
                  emblemCollectibleId={fam.emblemCollectibleId}
                  emblemSize={58}
                  emblemExtra={
                    <span className="rounded-2xl border-2 border-[#1C1917] bg-white px-3 py-1.5 font-display text-xl font-extrabold text-[#1C1917]">
                      {fam.morpheme}
                    </span>
                  }
                  bgHex={fam.bgHex}
                  accentHex={fam.accentHex}
                  tag={fam.kind === 'prefix' ? 'Prefix' : fam.kind === 'suffix' ? 'Suffix' : 'Root'}
                  done={done}
                  policy={policy}
                  doneDefaultLabel="Mastered"
                  rewardRange="+35–50"
                  title={fam.title}
                  subtitle={`“${fam.morpheme}” = ${fam.morphemeMeaning}`}
                  onClick={() => onStartEnglishRootFamily(fam)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* English Grammar Repair Lab Grid */}
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
                <QuestCard
                  key={gs.id}
                  emblemCollectibleId={gs.emblemCollectibleId}
                  bgHex={gs.bgHex}
                  accentHex={gs.accentHex}
                  tag={gs.categoryTag}
                  done={done}
                  policy={policy}
                  doneDefaultLabel="Repaired"
                  rewardRange="+45–60"
                  title={gs.title}
                  subtitle={gs.subtitle}
                  onClick={() => onStartGrammarRepairSet(gs)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* English Spelling Bee Lab Grid */}
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
                <QuestCard
                  key={sp.id}
                  emblemCollectibleId={sp.emblemCollectibleId}
                  bgHex="#FFFBEB"
                  accentHex="#D97706"
                  tag={`🐝 ${sp.badge}`}
                  done={done}
                  policy={policy}
                  doneDefaultLabel="Spelled"
                  rewardRange="+25–35"
                  title={sp.title}
                  subtitle={sp.subtitle}
                  onClick={() => onStartSpellingSet?.(sp)}
                >
                  <p className="text-[11px] font-extrabold text-[#B45309]">
                    🔊 5 Audio Spelling Challenges · Tiles & Keyboard
                  </p>
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* English Figurative Language & Context Clues Lab Grid */}
        {activeSubjectId === 'english' && effectiveQuestMode === 'figurative' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enFigurativeSets.map((fg) => {
              const done = (player.completedFigurativeIds ?? []).includes(fg.id);
              const policy = getQuestRewardPolicy(player, {
                questSetId: fg.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                completedIds: player.completedFigurativeIds ?? [],
              });
              return (
                <QuestCard
                  key={fg.id}
                  emblemCollectibleId={fg.emblemCollectibleId}
                  bgHex={fg.bgHex}
                  accentHex={fg.accentHex}
                  tag={`💬 ${fg.categoryTag}`}
                  done={done}
                  policy={policy}
                  doneDefaultLabel="Mastered"
                  rewardRange="+15–40"
                  title={fg.title}
                  subtitle={fg.subtitle}
                  onClick={() => onStartFigurativeSet?.(fg)}
                >
                  <p className="text-[11px] font-extrabold text-[#0D9488]">
                    ✨ 5 Literary & Context Clue Quests · Bilingual Tips
                  </p>
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* English Chapter Story Series Grid (with +40 Series Chest Badge) */}
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
              const claimed = (player.claimedEnglishChapterSeriesIds ?? []).includes(series.id);
              const badge =
                fullDone && !claimed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-2.5 py-0.5 text-xs font-extrabold text-white">
                    <Gift className="h-3.5 w-3.5" />
                    +40 Chest Ready!
                  </span>
                ) : fullDone ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All 5 Chapters Done!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#1C1917] tabular-nums">
                    {epDone}/5 Chapters
                  </span>
                );
              return (
                <QuestCard
                  key={series.id}
                  emblemCollectibleId={series.emblemCollectibleId}
                  emblemSize={66}
                  bgHex={series.bgHex}
                  accentHex={series.accentHex}
                  tag={`${series.genreTag} · Tier ${series.tier}`}
                  statusBadge={badge}
                  title={series.title}
                  titleSize="xl"
                  subtitle={series.subtitle}
                  onClick={() => onStartEnglishChapterSeries?.(series)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* English Word Quests Grid */}
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
                <QuestCard
                  key={ws.id}
                  emblemCollectibleId={ws.emblemCollectibleId}
                  emblemSize={68}
                  bgHex={ws.bgHex}
                  accentHex={ws.accentHex}
                  tag={ws.shortTag}
                  done={done}
                  policy={policy}
                  doneDefaultLabel="Cleared"
                  rewardRange="+55–75"
                  title={ws.title}
                  titleSize="xl"
                  onClick={() => onStartEnglishRun(ws)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* Math Two-Step Bar Model Lab Grid */}
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
                <QuestCard
                  key={unit.id}
                  emblemCollectibleId={unit.emblemCollectibleId}
                  emblemSize={64}
                  bgHex={unit.bgHex}
                  accentHex={unit.accentHex}
                  tag={`Tier ${unit.tier} · ${unit.ccssTag}`}
                  done={done}
                  policy={policy}
                  doneDefaultLabel="Solved"
                  rewardRange="+30–40"
                  title={`📊 ${unit.title}`}
                  subtitle={unit.subtitle}
                  onClick={() => onStartBarModelUnit?.(unit)}
                >
                  <p className="text-[11px] font-extrabold text-[#2563EB]">
                    ♾️ Fresh Dynamic Numbers · Tape Diagram Guide
                  </p>
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* Math Quests Grid */}
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
                <QuestCard
                  key={ms.id}
                  emblemCollectibleId={ms.emblemCollectibleId}
                  emblemSize={68}
                  bgHex={ms.bgHex}
                  accentHex={ms.accentHex}
                  tag={ms.shortTag}
                  done={done}
                  policy={policy}
                  doneDefaultLabel="Cleared"
                  rewardRange="+60–80"
                  title={ms.title}
                  titleSize="xl"
                  onClick={() => onStartMathRun(ms)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}

        {/* Chinese Word Quests Grid */}
        {isZh && effectiveQuestMode === 'words' && (
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
                <QuestCard
                  key={ws.id}
                  emblemCollectibleId={ws.emblemCollectibleId}
                  emblemSize={68}
                  bgHex={ws.bgHex}
                  accentHex={ws.accentHex}
                  tag={ws.shortTag}
                  done={done}
                  policy={policy}
                  isZh
                  doneDefaultLabel="已過關"
                  rewardRange="+55–75"
                  title={ws.title}
                  titleSize="xl"
                  onClick={() => onStartChineseRun(ws)}
                >
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
                </QuestCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

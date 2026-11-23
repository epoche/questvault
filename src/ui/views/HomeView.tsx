import React, { useState } from 'react';
import {
  BookOpen,
  BookText,
  Brain,
  Calculator,
  CheckCircle2,
  Coins,
  Flame,
  Gift,
  Headphones,
  Languages,
  Play,
  Plus,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { DAILY_TRI_SUBJECT_BONUS } from '../../core/economy';
import { getDueReviewItems, getTrickyWords } from '../../core/mastery';
import { PACK_COST } from '../../core/packs';
import type { ReadingQuestSet } from '../../core/readingTypes';
import type { DifficultyTier, PlayerState, SubjectId } from '../../core/types';
import { customChineseRecordToWordSet } from '../../subjects/chinese/chineseCustomParser';
import {
  buildChineseSrsReviewSet,
  buildChineseTrickyRematchSet,
} from '../../subjects/chinese/chineseEngine';
import { CHINESE_PLACEMENT_BONUS_TOKENS } from '../../subjects/chinese/chinesePlacement';
import { getChineseReadingByTier } from '../../subjects/chinese/readingQuests';
import type { ChineseWordSet } from '../../subjects/chinese/types';
import {
  BUILTIN_CHINESE_SETS,
  CHINESE_TIER_META,
  getChineseSetsByTier,
} from '../../subjects/chinese/wordSets';
import { customRecordToWordSet } from '../../subjects/english/customParser';
import { PLACEMENT_BONUS_TOKENS } from '../../subjects/english/placement';
import { getEnglishReadingByTier } from '../../subjects/english/readingQuests';
import {
  buildEnglishSrsReviewSet,
  buildTrickyRematchWordSet,
  getLocalDateKey,
} from '../../subjects/english/runEngine';
import type { WordSet } from '../../subjects/english/types';
import { BUILTIN_WORD_SETS, getWordSetsByTier, TIER_META } from '../../subjects/english/wordSets';
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
  onClaimDailyQuest: () => void;
  onStartEnglishRun: (wordSet: WordSet) => void;
  onStartMathRun: (questSet: MathQuestSet) => void;
  onStartChineseRun: (wordSet: ChineseWordSet) => void;
  onStartChineseListening: () => void;
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
  onClaimDailyQuest,
  onStartEnglishRun,
  onStartMathRun,
  onStartChineseRun,
  onStartChineseListening,
  onStartReadingRun,
  onOpenCustomImporter,
  onDeleteCustomSet,
  onGoToMarket,
}) => {
  const [questMode, setQuestMode] = useState<'words' | 'stories'>('words');
  const packsReady = Math.floor(player.tokens / PACK_COST);
  const todayKey = getLocalDateKey();

  const enSets = getWordSetsByTier(activeTier);
  const mathSets = getMathSetsByTier(activeTier);
  const zhSets = getChineseSetsByTier(activeTier);
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

              {activeSubjectId === 'chinese' && (
                <button
                  type="button"
                  onClick={onStartChineseListening}
                  className="qv-arcade-btn inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#DB2777] px-4 py-3 font-display text-sm font-extrabold text-white"
                  style={{ borderBottomColor: '#9D174D' }}
                >
                  <Headphones className="h-4 w-4" />
                  <span>聽音辨字</span>
                </button>
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

        {/* Mode Switcher for English & Chinese: Word Quests vs Story Quests */}
        {activeSubjectId !== 'math' && (
          <div className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#E5DFD3] bg-[#F3EFE7] p-1">
            <button
              type="button"
              onClick={() => setQuestMode('words')}
              className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                questMode === 'words'
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
            <button
              type="button"
              onClick={() => setQuestMode('stories')}
              className={`qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold transition-colors ${
                questMode === 'stories'
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
          </div>
        )}

        {/* Saved Custom School Word Sets — Surfaced ABOVE built-in cards for instant access */}
        {activeSubjectId === 'english' && questMode === 'words' && enCustomSets.length > 0 && (
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

        {activeSubjectId === 'chinese' && questMode === 'words' && zhCustomSets.length > 0 && (
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

        {/* Story Quests Grid (English & Traditional Chinese) */}
        {activeSubjectId !== 'math' && questMode === 'stories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeSubjectId === 'chinese' ? zhReadingSets : enReadingSets).map((rq) => {
              const done = player.completedQuestSetIds.includes(rq.id);
              const isZh = activeSubjectId === 'chinese';
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {isZh ? '已讀完' : 'Read'}
                        </span>
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

        {/* Quest Cards Grid per Active Subject */}
        {activeSubjectId === 'english' && questMode === 'words' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enSets.map((ws) => {
              const done = player.completedQuestSetIds.includes(ws.id);
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Cleared
                        </span>
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

        {activeSubjectId === 'math' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mathSets.map((ms) => {
              const done = player.completedQuestSetIds.includes(ms.id);
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Cleared
                        </span>
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

        {activeSubjectId === 'chinese' && questMode === 'words' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zhSets.map((ws) => {
              const done = player.completedQuestSetIds.includes(ws.id);
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#047857]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          已過關
                        </span>
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

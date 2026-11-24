import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { claimAchievementReward } from './core/achievements';
import {
  applyAdventureMakeupStamp,
  claimAdventureMilestone,
  recordAdventureStamp,
} from './core/adventureMap';
import { hashParentPin } from './core/analytics';
import { audioService } from './core/audio';
import {
  feedCritterTreat,
  petCritter,
  recordCritterPopQuizResult,
  type RoomTreatItem,
} from './core/critterCare';
import { getLocalDateKey } from './core/date';
import {
  awardBlitzSessionRewards,
  awardBossSessionRewards,
  awardCafeSessionRewards,
  awardFishingSessionRewards,
  awardLogicModuleRewards,
  awardMathFluencyRewards,
  awardMixedWarmupCompletion,
  awardTowerSessionRewards,
  type MixedWarmupOutcomeInput,
  claimChapterSeriesChest,
  claimDailyTriSubjectReward,
  claimEnglishChapterSeriesChest,
  craftShinyCollectible,
  equipCollectibleAvatar,
  fuseFiveDuplicatesUp,
  getQuestRewardPolicy,
  getTodayArcadeTokensEarned,
  meltDuplicateForStarDust,
  openMysteryPack,
  placeCritterInRoomSlot,
  recordDailySubjectCompletion,
  sellDuplicateCollectible,
  setPinnedWishlistPack,
  toggleCritterRoomDecor,
  toggleFavoriteCollectible,
  updateCritterRoomTheme,
  wishUnlockWithStarDust,
} from './core/economy';
import { recordWordOutcome, type WordOutcomeInput } from './core/mastery';
import type { MixedWarmupMode } from './core/mixedWarmupEngine';
import { completeQuestRun } from './core/questCompletion';
import type { ReadingQuestSet } from './core/readingTypes';
import { createLocalStorageRepository } from './core/repository';
import type {
  Collectible,
  CritterRoomThemeId,
  CustomWordSetRecord,
  DifficultyTier,
  PackId,
  PlayerState,
  Rarity,
  SubjectId,
} from './core/types';
import {
  CHAPTER_SERIES_CHEST_BONUS,
  type ChapterSeries,
} from './subjects/chinese/chapterStories';
import { customChineseRecordToWordSet } from './subjects/chinese/chineseCustomParser';
import { CHINESE_PLACEMENT_BONUS_TOKENS } from './subjects/chinese/chinesePlacement';
import type { LookAlikeHanziSet } from './subjects/chinese/lookAlikeTypes';
import type { MeasureIdiomSet } from './subjects/chinese/measureIdiomSets';
import type { RadicalFamily } from './subjects/chinese/radicalFamilies';
import type { SentencePatternSet } from './subjects/chinese/sentencePatternTypes';
import type { ChineseWordSet } from './subjects/chinese/types';
import { customRecordToWordSet } from './subjects/english/customParser';
import {
  EN_CHAPTER_SERIES_CHEST_BONUS,
  type EnglishChapterSeries,
} from './subjects/english/englishChapterStories';
import type { FigurativeQuestSet } from './subjects/english/figurativeTypes';
import { PLACEMENT_BONUS_TOKENS } from './subjects/english/placement';
import type {
  EnglishRootFamily,
  GrammarRepairSet,
} from './subjects/english/rootsGrammarTypes';
import type { SpellingSet } from './subjects/english/spellingTypes';
import type { WordSet } from './subjects/english/types';
import type { LogicModuleId } from './subjects/logic/logicTypes';
import type { BarModelUnitMeta } from './subjects/math/barModelEngine';
import type { ClockMeasureUnitMeta } from './subjects/math/clockMeasureEngine';
import { MATH_PLACEMENT_BONUS_TOKENS } from './subjects/math/mathPlacement';
import type { MathQuestSet } from './subjects/math/types';
import { CustomWordSetDrawer } from './ui/components/CustomWordSetDrawer';
import {
  PackOpeningModal,
  type PackPullViewData,
} from './ui/components/PackOpeningModal';
import { type NavTab, TopBar } from './ui/components/TopBar';
import { HomeView } from './ui/views/HomeView';

import type { BarModelCompletionPayload } from './ui/views/BarModelQuestView';
import type { BlitzCompletionPayload } from './ui/views/BlitzView';
import type { BossBattleCompletionPayload } from './ui/views/BossBattleView';
import type { CafeCompletionPayload } from './ui/views/CafeGameView';
import type { ChapterEpisodeCompletionPayload } from './ui/views/ChapterSeriesView';
import type { ChineseListeningCompletionPayload } from './ui/views/ChineseListeningView';
import type { ChineseCompletionPayload } from './ui/views/ChineseRunView';
import type { ClockMeasureCompletionPayload } from './ui/views/ClockMeasureQuestView';
import type { EnglishChapterEpisodeCompletionPayload } from './ui/views/EnglishChapterSeriesView';
import type { EnglishRootCompletionPayload } from './ui/views/EnglishRootQuestView';
import type { FactFluencyCompletionPayload } from './ui/views/FactFluencyView';
import type { FigurativeCompletionPayload } from './ui/views/FigurativeLabView';
import type { FishingCompletionPayload } from './ui/views/FishingGameView';
import type { GrammarRepairCompletionPayload } from './ui/views/GrammarRepairView';
import type { LookAlikeCompletionPayload } from './ui/views/LookAlikeHanziView';
import type { MathCompletionPayload } from './ui/views/MathRunView';
import type { MeasureIdiomCompletionPayload } from './ui/views/MeasureIdiomQuestView';
import type { RadicalCompletionPayload } from './ui/views/RadicalQuestView';
import type { ReadingCompletionPayload } from './ui/views/ReadingRunView';
import type { RunCompletionPayload } from './ui/views/RunView';
import type { SentencePatternCompletionPayload } from './ui/views/SentencePatternView';
import type { SpellingBeeCompletionPayload } from './ui/views/SpellingBeeView';
import type { TowerDefenseCompletionPayload } from './ui/views/TowerDefenseView';

// Lazy-loaded secondary views so Vite code-splitting keeps first paint fast
// (vite-plugin-singlefile automatically inlines these for npm run build:single)
const BarModelQuestView = lazy(() =>
  import('./ui/views/BarModelQuestView').then((m) => ({ default: m.BarModelQuestView })),
);
const ClockMeasureQuestView = lazy(() =>
  import('./ui/views/ClockMeasureQuestView').then((m) => ({ default: m.ClockMeasureQuestView })),
);
const BlitzView = lazy(() =>
  import('./ui/views/BlitzView').then((m) => ({ default: m.BlitzView })),
);
const BossBattleView = lazy(() =>
  import('./ui/views/BossBattleView').then((m) => ({ default: m.BossBattleView })),
);
const CafeGameView = lazy(() =>
  import('./ui/views/CafeGameView').then((m) => ({ default: m.CafeGameView })),
);
const ChapterSeriesView = lazy(() =>
  import('./ui/views/ChapterSeriesView').then((m) => ({ default: m.ChapterSeriesView })),
);
const ChineseListeningView = lazy(() =>
  import('./ui/views/ChineseListeningView').then((m) => ({ default: m.ChineseListeningView })),
);
const ChinesePlacementView = lazy(() =>
  import('./ui/views/ChinesePlacementView').then((m) => ({ default: m.ChinesePlacementView })),
);
const ChineseRunView = lazy(() =>
  import('./ui/views/ChineseRunView').then((m) => ({ default: m.ChineseRunView })),
);
const EnglishChapterSeriesView = lazy(() =>
  import('./ui/views/EnglishChapterSeriesView').then((m) => ({
    default: m.EnglishChapterSeriesView,
  })),
);
const EnglishRootQuestView = lazy(() =>
  import('./ui/views/EnglishRootQuestView').then((m) => ({ default: m.EnglishRootQuestView })),
);
const FactFluencyView = lazy(() =>
  import('./ui/views/FactFluencyView').then((m) => ({ default: m.FactFluencyView })),
);
const FigurativeLabView = lazy(() =>
  import('./ui/views/FigurativeLabView').then((m) => ({ default: m.FigurativeLabView })),
);
const FishingGameView = lazy(() =>
  import('./ui/views/FishingGameView').then((m) => ({ default: m.FishingGameView })),
);
const GrammarRepairView = lazy(() =>
  import('./ui/views/GrammarRepairView').then((m) => ({ default: m.GrammarRepairView })),
);
const LogicLabView = lazy(() =>
  import('./ui/views/LogicLabView').then((m) => ({ default: m.LogicLabView })),
);
const LookAlikeHanziView = lazy(() =>
  import('./ui/views/LookAlikeHanziView').then((m) => ({ default: m.LookAlikeHanziView })),
);
const MarketView = lazy(() =>
  import('./ui/views/MarketView').then((m) => ({ default: m.MarketView })),
);
const MathPlacementView = lazy(() =>
  import('./ui/views/MathPlacementView').then((m) => ({ default: m.MathPlacementView })),
);
const MathRunView = lazy(() =>
  import('./ui/views/MathRunView').then((m) => ({ default: m.MathRunView })),
);
const MeasureIdiomQuestView = lazy(() =>
  import('./ui/views/MeasureIdiomQuestView').then((m) => ({ default: m.MeasureIdiomQuestView })),
);
const MixedWarmupView = lazy(() =>
  import('./ui/views/MixedWarmupView').then((m) => ({ default: m.MixedWarmupView })),
);
const ParentView = lazy(() =>
  import('./ui/views/ParentView').then((m) => ({ default: m.ParentView })),
);
const PlacementView = lazy(() =>
  import('./ui/views/PlacementView').then((m) => ({ default: m.PlacementView })),
);
const RadicalQuestView = lazy(() =>
  import('./ui/views/RadicalQuestView').then((m) => ({ default: m.RadicalQuestView })),
);
const ReadingRunView = lazy(() =>
  import('./ui/views/ReadingRunView').then((m) => ({ default: m.ReadingRunView })),
);
const RunView = lazy(() =>
  import('./ui/views/RunView').then((m) => ({ default: m.RunView })),
);
const SentencePatternView = lazy(() =>
  import('./ui/views/SentencePatternView').then((m) => ({ default: m.SentencePatternView })),
);
const SpellingBeeView = lazy(() =>
  import('./ui/views/SpellingBeeView').then((m) => ({ default: m.SpellingBeeView })),
);
const TowerDefenseView = lazy(() =>
  import('./ui/views/TowerDefenseView').then((m) => ({ default: m.TowerDefenseView })),
);
const VaultView = lazy(() =>
  import('./ui/views/VaultView').then((m) => ({ default: m.VaultView })),
);
const WritingLogView = lazy(() =>
  import('./ui/views/WritingLogView').then((m) => ({ default: m.WritingLogView })),
);

/** Single discriminated union guarantees mutually exclusive active sessions (zero stuck-mode bugs). */
export type ActiveSession =
  | { kind: 'parent' }
  | { kind: 'reading'; set: ReadingQuestSet }
  | { kind: 'zh-chapter'; series: ChapterSeries }
  | { kind: 'logic-lab' }
  | { kind: 'mixed-warmup'; mode: MixedWarmupMode }
  | { kind: 'tower'; subjectId: SubjectId }
  | { kind: 'boss'; subjectId: SubjectId }
  | { kind: 'fishing'; subjectId: SubjectId }
  | { kind: 'cafe'; subjectId: SubjectId }
  | { kind: 'blitz'; subjectId: SubjectId }
  | { kind: 'placement'; subjectId: SubjectId }
  | { kind: 'english-run'; set: WordSet }
  | { kind: 'math-run'; set: MathQuestSet }
  | { kind: 'chinese-run'; set: ChineseWordSet }
  | { kind: 'radical'; family: RadicalFamily }
  | { kind: 'measure'; set: MeasureIdiomSet }
  | { kind: 'english-root'; family: EnglishRootFamily }
  | { kind: 'grammar'; set: GrammarRepairSet }
  | { kind: 'spelling'; set: SpellingSet }
  | { kind: 'en-chapter'; series: EnglishChapterSeries }
  | { kind: 'math-fluency' }
  | { kind: 'bar-model'; unit: BarModelUnitMeta }
  | { kind: 'clock-measure'; unit: ClockMeasureUnitMeta }
  | { kind: 'sentence-pattern'; set: SentencePatternSet }
  | { kind: 'look-alike'; set: LookAlikeHanziSet }
  | { kind: 'figurative'; set: FigurativeQuestSet }
  | { kind: 'zh-listening' };

function getSessionKey(session: ActiveSession): string {
  switch (session.kind) {
    case 'parent':
    case 'logic-lab':
    case 'math-fluency':
    case 'zh-listening':
      return session.kind;
    case 'mixed-warmup':
      return `${session.kind}:${session.mode}`;
    case 'tower':
    case 'boss':
    case 'fishing':
    case 'cafe':
    case 'blitz':
    case 'placement':
      return `${session.kind}:${session.subjectId}`;
    case 'reading':
    case 'english-run':
    case 'math-run':
    case 'chinese-run':
    case 'measure':
    case 'grammar':
    case 'spelling':
    case 'sentence-pattern':
    case 'look-alike':
    case 'figurative':
      return `${session.kind}:${session.set.id}`;
    case 'zh-chapter':
    case 'en-chapter':
      return `${session.kind}:${session.series.id}`;
    case 'radical':
    case 'english-root':
      return `${session.kind}:${session.family.id}`;
    case 'bar-model':
    case 'clock-measure':
      return `${session.kind}:${session.unit.id}`;
  }
}

const ViewLoadingFallback: React.FC = () => (
  <div className="mx-auto max-w-xl py-16 text-center space-y-3">
    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E7E2D8] border-t-[#2563EB]" />
    <p className="font-display text-sm font-extrabold text-[#57534E]">Loading quest…</p>
  </div>
);

export const App: React.FC = () => {
  const repository = useMemo(() => createLocalStorageRepository(), []);
  const [player, setPlayer] = useState<PlayerState>(() => repository.load());
  const playerRef = useRef<PlayerState>(player);
  const hasMountedRef = useRef(false);

  /** Single synchronous commit path: playerRef.current is NEVER out of sync with React state. */
  const commitPlayer = useCallback(
    (updater: (prev: PlayerState) => PlayerState): PlayerState => {
      const next = updater(playerRef.current);
      if (next !== playerRef.current) {
        playerRef.current = next;
        setPlayer(next);
      }
      return next;
    },
    [],
  );

  const [activeTab, setActiveTab] = useState<NavTab>('quests');
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [activePull, setActivePull] = useState<PackPullViewData | null>(null);
  const [importerSubject, setImporterSubject] = useState<'english' | 'chinese' | null>(null);

  // Live local date key that automatically rolls over after midnight / iPad PWA wake
  const [todayKey, setTodayKey] = useState<string>(() => getLocalDateKey());
  useEffect(() => {
    const syncToday = () => {
      const nextKey = getLocalDateKey();
      setTodayKey((prev) => (prev === nextKey ? prev : nextKey));
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') syncToday();
    };
    const timer = window.setInterval(syncToday, 60_000);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', syncToday);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', syncToday);
    };
  }, []);

  const activeSubjectId: SubjectId = player.activeSubjectId ?? 'english';
  const activeTier: DifficultyTier =
    player.subjectTiers?.[activeSubjectId] ??
    (activeSubjectId === 'english' ? player.activeTier : 2);
  const placementCompleted =
    player.subjectPlacementCompleted?.[activeSubjectId] ??
    (activeSubjectId === 'english' ? player.placementCompleted : false);
  const showZhuyin = Boolean(player.showZhuyin);
  const inActiveSession = session !== null;

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    repository.save(player);
  }, [player, repository]);

  useEffect(() => {
    audioService.setMuted(player.muted);
  }, [player.muted]);

  useEffect(() => {
    audioService.setSpeechRateMode(player.speechRateMode === 'slow' ? 'slow' : 'normal');
  }, [player.speechRateMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeTab, activeSubjectId, session]);

  const clearActiveSession = useCallback(() => {
    audioService.stopSpeech();
    setSession(null);
  }, []);

  const goToMarket = useCallback(() => {
    audioService.stopSpeech();
    setSession(null);
    setActiveTab('market');
  }, []);

  const handleSelectSubject = (subjectId: SubjectId) => {
    clearActiveSession();
    setActiveTab('quests');
    commitPlayer((prev) => ({
      ...prev,
      activeSubjectId: subjectId,
    }));
  };

  const handleSelectTier = (tier: DifficultyTier) => {
    commitPlayer((prev) => {
      const subj = prev.activeSubjectId ?? 'english';
      const nextTiers = {
        english: prev.subjectTiers?.english ?? prev.activeTier,
        math: prev.subjectTiers?.math ?? 2,
        chinese: prev.subjectTiers?.chinese ?? 2,
        [subj]: tier,
      };
      return {
        ...prev,
        activeTier: nextTiers.english,
        subjectTiers: nextTiers,
      };
    });
  };

  const handleToggleZhuyin = () => {
    commitPlayer((prev) => ({ ...prev, showZhuyin: !prev.showZhuyin }));
  };

  const handleOpenPack = (packId: PackId) => {
    const result = openMysteryPack(playerRef.current, packId);
    if (!result.ok) return;
    commitPlayer(() => result.state);
    setActivePull({
      packId,
      collectible: result.collectible,
      isNew: result.isNew,
      newCount: result.newCount,
    });
  };

  const handleEquipAvatar = (collectibleId: string) => {
    commitPlayer((prev) => equipCollectibleAvatar(prev, collectibleId));
    audioService.playToken();
  };

  const handleSellDuplicate = (collectibleId: string) => {
    const res = sellDuplicateCollectible(playerRef.current, collectibleId);
    if (!res.ok) return;
    commitPlayer(() => res.state);
    audioService.playToken();
  };

  const handleCraftShiny = (collectibleId: string) => {
    const res = craftShinyCollectible(playerRef.current, collectibleId);
    if (!res.ok) return;
    commitPlayer(() => res.state);
    audioService.playChest();
  };

  const handleMeltForStarDust = (collectibleId: string) => {
    const res = meltDuplicateForStarDust(playerRef.current, collectibleId);
    if (!res.ok) return;
    commitPlayer(() => res.state);
    audioService.playToken();
  };

  const handleWishUnlock = (collectibleId: string): boolean => {
    const res = wishUnlockWithStarDust(playerRef.current, collectibleId);
    if (!res.ok) return false;
    commitPlayer(() => res.state);
    audioService.playPackReveal(res.collectible.rarity);
    return true;
  };

  const handleFuseFiveUp = (
    sourceRarity: Rarity,
  ): { awarded: Collectible; isNew: boolean } | null => {
    const res = fuseFiveDuplicatesUp(playerRef.current, sourceRarity);
    if (!res.ok) return null;
    commitPlayer(() => res.state);
    audioService.playPackReveal(res.awarded.rarity);
    return { awarded: res.awarded, isNew: res.isNew };
  };

  const handleToggleFavorite = (collectibleId: string) => {
    const res = toggleFavoriteCollectible(playerRef.current, collectibleId);
    if (!res.ok) return;
    commitPlayer(() => res.state);
    audioService.playToken();
  };

  const handleToggleWishlistPack = (packId: PackId) => {
    commitPlayer((prev) =>
      setPinnedWishlistPack(prev, prev.pinnedWishlistPackId === packId ? undefined : packId),
    );
    audioService.playToken();
  };

  const handleClaimDailyQuest = () => {
    const res = claimDailyTriSubjectReward(playerRef.current, getLocalDateKey());
    if (!res.ok) return;
    commitPlayer(() => res.state);
    audioService.playChest();
  };

  const handleCompleteBlitz = (payload: BlitzCompletionPayload) => {
    const res = awardBlitzSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.score,
      payload.rawTokensEarned,
      getLocalDateKey(),
    );
    commitPlayer(() => res.state);
    return { tokensAwarded: res.tokensAwarded, remainingDailyCap: res.remainingDailyCap };
  };

  const handleCompleteCafe = (payload: CafeCompletionPayload) => {
    const res = awardCafeSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.coinsScore,
      payload.rawTokensEarned,
      getLocalDateKey(),
    );
    commitPlayer(() => res.state);
    return { tokensAwarded: res.tokensAwarded, remainingDailyCap: res.remainingDailyCap };
  };

  const handleCompleteFishing = (payload: FishingCompletionPayload) => {
    const res = awardFishingSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.totalLbs,
      payload.rawTokensEarned,
      getLocalDateKey(),
    );
    commitPlayer(() => res.state);
    return { tokensAwarded: res.tokensAwarded, remainingDailyCap: res.remainingDailyCap };
  };

  const handleCompleteBossBattle = (payload: BossBattleCompletionPayload) => {
    const res = awardBossSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.score,
      payload.rawTokensEarned,
      getLocalDateKey(),
    );
    commitPlayer(() => res.state);
    return { tokensAwarded: res.tokensAwarded, remainingDailyCap: res.remainingDailyCap };
  };

  const handleCompleteTowerDefense = (payload: TowerDefenseCompletionPayload) => {
    const res = awardTowerSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.score,
      payload.rawTokensEarned,
      getLocalDateKey(),
    );
    commitPlayer(() => res.state);
    return { tokensAwarded: res.tokensAwarded, remainingDailyCap: res.remainingDailyCap };
  };

  const handleUpdateRoomTheme = (themeId: CritterRoomThemeId) => {
    commitPlayer((prev) => updateCritterRoomTheme(prev, themeId));
  };

  const handlePlaceRoomCritter = (slotIndex: number, collectibleId: string | null) => {
    commitPlayer((prev) => placeCritterInRoomSlot(prev, slotIndex, collectibleId));
  };

  const handleToggleRoomDecor = (decorId: string) => {
    commitPlayer((prev) => toggleCritterRoomDecor(prev, decorId));
  };

  const handlePetCritter = (collectibleId: string) => {
    const res = petCritter(playerRef.current, collectibleId, getLocalDateKey());
    if (res.ok) commitPlayer(() => res.state);
    return res;
  };

  const handleFeedCritterTreat = (collectibleId: string, treatId: RoomTreatItem['id']) => {
    const res = feedCritterTreat(playerRef.current, collectibleId, treatId, getLocalDateKey());
    if (res.ok) commitPlayer(() => res.state);
    return res;
  };

  const handleAnswerRoomPopQuiz = (collectibleId: string, isCorrect: boolean) => {
    const res = recordCritterPopQuizResult(
      playerRef.current,
      collectibleId,
      isCorrect,
      getLocalDateKey(),
    );
    if (res.ok) commitPlayer(() => res.state);
    return res;
  };

  const handleCompleteLogicModule = (
    moduleId: LogicModuleId,
    correctCount: number,
    totalQuestions: number,
  ) => {
    const todayKeyNow = getLocalDateKey();
    const res = awardLogicModuleRewards(
      playerRef.current,
      moduleId,
      correctCount,
      totalQuestions,
      todayKeyNow,
    );
    const logicPassed = totalQuestions > 0 && correctCount / totalQuestions >= 0.6;
    const nextState = logicPassed
      ? recordAdventureStamp(res.state, todayKeyNow, 'logic')
      : res.state;
    commitPlayer(() => nextState);
    return { tokensAwarded: res.tokensAwarded, remainingDailyCap: res.remainingDailyCap };
  };

  const handleCompleteMixedWarmup = (
    mode: MixedWarmupMode,
    outcomes: MixedWarmupOutcomeInput[],
  ) => {
    const todayKeyNow = getLocalDateKey();
    const res = awardMixedWarmupCompletion(
      playerRef.current,
      mode,
      outcomes,
      todayKeyNow,
    );
    const nextState = res.passed
      ? recordAdventureStamp(res.state, todayKeyNow, 'warmup')
      : res.state;
    commitPlayer(() => nextState);
    return {
      tokensAwarded: res.tokensAwarded,
      healedCount: res.healedCount,
      alreadyClaimedToday: res.alreadyClaimedToday,
      passed: res.passed,
    };
  };

  const handleClaimAdventureMilestone = (days: 3 | 5 | 7) => {
    const res = claimAdventureMilestone(playerRef.current, days, getLocalDateKey());
    if (res.tokensAwarded <= 0) {
      return { tokensAwarded: 0, unlockedDecorId: null };
    }
    commitPlayer(() => res.state);
    audioService.playChest();
    return { tokensAwarded: res.tokensAwarded, unlockedDecorId: res.unlockedDecorId };
  };

  const handleApplyAdventureMakeup = (targetDateKey: string) => {
    const res = applyAdventureMakeupStamp(playerRef.current, targetDateKey, getLocalDateKey());
    if (!res.applied) return false;
    commitPlayer(() => res.state);
    audioService.playToken();
    return true;
  };

  const handleCompleteEnglishRun = (payload: RunCompletionPayload) => {
    const wordsInSet =
      session?.kind === 'english-run' ? session.set.words.map((w) => w.word) : undefined;
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'english',
          questSetId: payload.summary.questSetId,
          questSetTitle: payload.summary.questSetTitle,
          completionField: 'completedQuestSetIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.summary.tokensEarned,
          accuracyPct: payload.summary.accuracyPct,
          maxCombo: payload.summary.maxCombo,
          todayKey: getLocalDateKey(),
          existingSummary: payload.summary,
          wordOutcomes: payload.wordOutcomes.map((out) => ({ ...out, subjectId: 'english' })),
          wordsInSet,
          writingEntry: payload.writingEntry,
          isBossRematch: payload.summary.questSetId === 'en-tricky-rematch',
        }).state,
    );
  };

  const handleCompleteMathRun = (payload: MathCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'math',
          kind: 'math',
          questSetId: payload.summary.questSetId,
          questSetTitle: payload.summary.questSetTitle,
          completionField: 'completedQuestSetIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.summary.tokensEarned,
          accuracyPct: payload.summary.accuracyPct,
          maxCombo: payload.summary.maxCombo,
          todayKey: getLocalDateKey(),
          existingSummary: payload.summary,
          wordOutcomes: payload.wordOutcomes.map((out) => ({ ...out, subjectId: 'math' })),
          isBossRematch: payload.summary.questSetId === 'math-tricky-rematch',
        }).state,
    );
  };

  const handleCompleteChineseRun = (payload: ChineseCompletionPayload) => {
    const wordsInSet =
      session?.kind === 'chinese-run' ? session.set.words.map((w) => w.word) : undefined;
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'chinese',
          questSetId: payload.summary.questSetId,
          questSetTitle: payload.summary.questSetTitle,
          completionField: 'completedQuestSetIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.summary.tokensEarned,
          accuracyPct: payload.summary.accuracyPct,
          maxCombo: payload.summary.maxCombo,
          todayKey: getLocalDateKey(),
          existingSummary: payload.summary,
          wordOutcomes: payload.wordOutcomes.map((out) => ({ ...out, subjectId: 'chinese' })),
          wordsInSet,
          writingEntry: payload.writingEntry,
          isBossRematch: payload.summary.questSetId === 'zh-tricky-rematch',
        }).state,
    );
  };

  const handleCompletePlacement = (subjectId: SubjectId, recommendedTier: DifficultyTier) => {
    commitPlayer((prev) => {
      const prevDone =
        prev.subjectPlacementCompleted?.[subjectId] ??
        (subjectId === 'english' ? prev.placementCompleted : false);
      const fullBonus =
        subjectId === 'english'
          ? PLACEMENT_BONUS_TOKENS
          : subjectId === 'math'
            ? MATH_PLACEMENT_BONUS_TOKENS
            : CHINESE_PLACEMENT_BONUS_TOKENS;
      const bonus = prevDone ? 0 : fullBonus;

      const nextTiers = {
        english: prev.subjectTiers?.english ?? prev.activeTier,
        math: prev.subjectTiers?.math ?? 2,
        chinese: prev.subjectTiers?.chinese ?? 2,
        [subjectId]: recommendedTier,
      };
      const nextCompleted = {
        english: prev.subjectPlacementCompleted?.english ?? prev.placementCompleted,
        math: prev.subjectPlacementCompleted?.math ?? false,
        chinese: prev.subjectPlacementCompleted?.chinese ?? false,
        [subjectId]: true,
      };

      return {
        ...prev,
        activeTier: nextTiers.english,
        subjectTiers: nextTiers,
        placementCompleted: nextCompleted.english,
        subjectPlacementCompleted: nextCompleted,
        tokens: prev.tokens + bonus,
      };
    });
  };

  const handleRecordPartialMastery = (
    subjectId: SubjectId,
    wordOutcomes: WordOutcomeInput[],
  ) => {
    if (wordOutcomes.length === 0) return;
    commitPlayer((prev) => {
      let nextMastery = prev.wordMastery;
      for (const out of wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, { ...out, subjectId });
      }
      return { ...prev, wordMastery: nextMastery };
    });
  };

  const handleCompleteReadingRun = (payload: ReadingCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: payload.summary.subjectId,
          questSetId: payload.summary.questSetId,
          questSetTitle: payload.summary.questSetTitle,
          completionField: 'completedQuestSetIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.summary.tokensEarned,
          accuracyPct: payload.summary.accuracyPct,
          maxCombo: payload.summary.maxCombo,
          todayKey: getLocalDateKey(),
          existingSummary: payload.summary,
        }).state,
    );
  };

  const handleCompleteChineseListening = (payload: ChineseListeningCompletionPayload) => {
    const accuracyPct =
      payload.totalCount > 0
        ? Math.round((payload.correctCount / payload.totalCount) * 100)
        : 0;
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'chinese',
          questSetId: `zh-listening-t${payload.tier}`,
          questSetTitle: `聽音辨字特訓 (第 ${payload.tier} 階)`,
          rawTokensEarned: payload.rawTokensEarned,
          accuracyPct,
          maxCombo: payload.correctCount,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'zh-listen',
          wordOutcomes: payload.wordOutcomes.map((out) => ({
            word: out.word,
            subjectId: 'chinese',
            tier: payload.tier,
            outcome: out.correct ? 'clean' : 'missed',
          })),
          markDailySubject: payload.correctCount > 0,
        }).state,
    );
    setSession(null);
  };

  const handleCompleteRadical = (payload: RadicalCompletionPayload) => {
    const wordsInSet =
      session?.kind === 'radical' ? session.family.items.map((it) => it.char) : undefined;
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'chinese',
          questSetId: payload.familyId,
          questSetTitle: `偏旁工廠：${payload.familyTitle}`,
          completionField: 'completedRadicalIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: payload.masteredChars.filter((c) => c.firstTryCorrect).length,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'zh-rad',
          wordsInSet,
          wordOutcomes: payload.masteredChars.map((ch) => ({
            word: ch.char,
            subjectId: 'chinese',
            tier: payload.tier,
            outcome: ch.firstTryCorrect ? 'clean' : 'missed',
          })),
        }).state,
    );
  };

  const handleCompleteChapterEpisode = (payload: ChapterEpisodeCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'chinese',
          questSetId: payload.episodeId,
          questSetTitle: `章節小說：《${payload.seriesTitle}》第 ${payload.episodeNumber} 集`,
          completionField: 'completedChapterEpisodeIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: 3,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'zh-chap',
        }).state,
    );
  };

  const handleClaimChapterSeriesChest = (series: ChapterSeries): boolean => {
    const res = claimChapterSeriesChest(
      playerRef.current,
      series.id,
      series.episodes.map((e) => e.id),
      CHAPTER_SERIES_CHEST_BONUS,
    );
    if (!res.ok) return false;
    commitPlayer(() => res.state);
    return true;
  };

  const handleCompleteMeasureIdiom = (payload: MeasureIdiomCompletionPayload) => {
    const wordsInSet =
      session?.kind === 'measure'
        ? session.set.questions.map((q) => q.targetAnswer)
        : undefined;
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'chinese',
          questSetId: payload.setId,
          questSetTitle: `${payload.kind === 'measure' ? '量詞大作戰' : '易混詞成語'}：${payload.setTitle}`,
          completionField: 'completedMeasureIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: payload.maxCombo,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'zh-meas',
          wordsInSet,
          wordOutcomes: payload.wordOutcomes.map((out) => ({
            word: out.word,
            subjectId: 'chinese',
            tier: payload.tier,
            outcome: out.firstTryCorrect ? 'clean' : 'missed',
          })),
        }).state,
    );
  };

  const handleClaimAchievement = (achievementId: string): boolean => {
    const res = claimAchievementReward(playerRef.current, achievementId);
    if (!res.ok) return false;
    commitPlayer(() => res.state);
    audioService.playChest();
    return true;
  };

  const handleCompleteEnglishRoot = (payload: EnglishRootCompletionPayload) => {
    const wordsInSet =
      session?.kind === 'english-root' ? session.family.items.map((it) => it.word) : undefined;
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'english',
          questSetId: payload.familyId,
          questSetTitle: `Word Roots: ${payload.familyTitle}`,
          completionField: 'completedEnglishRootIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: payload.wordOutcomes.filter((o) => o.firstTryCorrect).length,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'en-root',
          wordsInSet,
          wordOutcomes: payload.wordOutcomes.map((out) => ({
            word: out.word,
            subjectId: 'english',
            tier: payload.tier,
            outcome: out.firstTryCorrect ? 'clean' : 'missed',
          })),
        }).state,
    );
  };

  const handleCompleteGrammarRepair = (payload: GrammarRepairCompletionPayload) => {
    const wordsInSet =
      session?.kind === 'grammar'
        ? session.set.questions.map((q) => q.targetAnswer)
        : undefined;
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'english',
          questSetId: payload.setId,
          questSetTitle: `Grammar Lab: ${payload.setTitle}`,
          completionField: 'completedGrammarIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: payload.maxCombo,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'en-gram',
          wordsInSet,
        }).state,
    );
  };

  const handleCompleteSpelling = (payload: SpellingBeeCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'english',
          questSetId: payload.setId,
          questSetTitle: `Spelling Bee: ${payload.setTitle}`,
          completionField: 'completedSpellingIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: payload.wordOutcomes.filter((w) => w.firstTryCorrect).length,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'en-spell',
          wordsInSet: payload.wordOutcomes.map((w) => w.word),
          wordOutcomes: payload.wordOutcomes.map((out) => ({
            word: out.word,
            subjectId: 'english',
            tier: payload.tier,
            outcome: out.firstTryCorrect ? 'clean' : 'missed',
          })),
        }).state,
    );
  };

  const handleCompleteEnglishChapterEpisode = (
    payload: EnglishChapterEpisodeCompletionPayload,
  ) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'english',
          questSetId: payload.episodeId,
          questSetTitle: `${payload.seriesTitle} Ch.${payload.episodeNumber}: ${payload.episodeTitle}`,
          completionField: 'completedEnglishChapterIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: 3,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'en-ch',
        }).state,
    );
  };

  const handleClaimEnglishChapterChest = (series: EnglishChapterSeries): boolean => {
    const res = claimEnglishChapterSeriesChest(
      playerRef.current,
      series.id,
      series.episodes.map((e) => e.id),
      EN_CHAPTER_SERIES_CHEST_BONUS,
    );
    if (!res.ok) return false;
    commitPlayer(() => res.state);
    return true;
  };

  const handleCompleteMathFluency = (payload: FactFluencyCompletionPayload) => {
    const todayKeyNow = getLocalDateKey();
    const res = awardMathFluencyRewards(
      playerRef.current,
      payload.rawTokensEarned,
      todayKeyNow,
      payload.updatedMastery,
    );
    const acc = Math.round((payload.correctCount / Math.max(1, payload.totalCount)) * 100);
    const summary = {
      id: `math-ff-${Date.now()}`,
      subjectId: 'math' as const,
      questSetId: `math-fluency-${payload.mode}`,
      questSetTitle: `Fact Fluency Dojo (${payload.mode})`,
      tokensEarned: res.tokensAwarded,
      maxCombo: payload.correctCount,
      accuracyPct: acc,
      completedAt: new Date().toISOString(),
    };
    const withHistory: PlayerState = {
      ...res.state,
      runHistory: [summary, ...res.state.runHistory].slice(0, 50),
    };
    const finalState =
      acc >= 50
        ? recordAdventureStamp(
            recordDailySubjectCompletion(withHistory, 'math', todayKeyNow),
            todayKeyNow,
            'math',
          )
        : withHistory;
    commitPlayer(() => finalState);
    return { tokensAwarded: res.tokensAwarded, remainingDailyCap: res.remainingDailyCap };
  };

  const handleCompleteBarModel = (payload: BarModelCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'math',
          kind: 'math',
          questSetId: payload.unitId,
          questSetTitle: `Bar Model Lab: ${payload.unitTitle}`,
          completionField: 'completedBarModelIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: 4,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'math-bm',
        }).state,
    );
  };

  const handleCompleteClockMeasure = (payload: ClockMeasureCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'math',
          kind: 'math',
          questSetId: payload.unitId,
          questSetTitle: `Clock & Measure: ${payload.unitTitle}`,
          completionField: 'completedClockMeasureIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: 5,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'math-cm',
          wordOutcomes: payload.wordOutcomes,
        }).state,
    );
  };

  const handleCompleteSentencePattern = (payload: SentencePatternCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'chinese',
          questSetId: payload.setId,
          questSetTitle: `句型魔方：${payload.setTitle}`,
          completionField: 'completedSentencePatternIds',
          rawTokensEarned: payload.rawTokensEarned ?? payload.tokensEarned,
          accuracyPct: payload.accuracyPct,
          maxCombo: payload.maxCombo,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'zh-sp',
        }).state,
    );
  };

  const handleCompleteLookAlike = (payload: LookAlikeCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'chinese',
          questSetId: payload.setId,
          questSetTitle: payload.title,
          completionField: 'completedLookAlikeIds',
          rawTokensEarned: payload.rawTokensEarned,
          accuracyPct: Math.round(
            (payload.correctCount / Math.max(1, payload.totalQuestions)) * 100,
          ),
          maxCombo: payload.correctCount,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'zh-la',
          wordsInSet: payload.wordOutcomes.map((w) => w.word),
          wordOutcomes: payload.wordOutcomes.map((out) => ({ ...out, subjectId: 'chinese' })),
        }).state,
    );
  };

  const handleCompleteFigurative = (payload: FigurativeCompletionPayload) => {
    commitPlayer(
      (prev) =>
        completeQuestRun(prev, {
          subjectId: 'english',
          questSetId: payload.setId,
          questSetTitle: payload.title,
          completionField: 'completedFigurativeIds',
          rawTokensEarned: payload.rawTokensEarned,
          accuracyPct: Math.round(
            (payload.correctCount / Math.max(1, payload.totalQuestions)) * 100,
          ),
          maxCombo: payload.correctCount,
          todayKey: getLocalDateKey(),
          runIdPrefix: 'en-fig',
        }).state,
    );
  };

  const handleSaveCustomSet = (record: CustomWordSetRecord) => {
    commitPlayer((prev) => ({
      ...prev,
      customWordSets: [record, ...prev.customWordSets].slice(0, 50),
    }));
    setImporterSubject(null);
    if (record.subjectId === 'chinese') {
      setSession({ kind: 'chinese-run', set: customChineseRecordToWordSet(record) });
    } else {
      setSession({ kind: 'english-run', set: customRecordToWordSet(record) });
    }
  };

  const handleDeleteCustomSet = (id: string) => {
    commitPlayer((prev) => ({
      ...prev,
      customWordSets: prev.customWordSets.filter((s) => s.id !== id),
    }));
  };

  const blitzDailyEarned =
    player.blitzDailyTokens?.dateKey === todayKey ? player.blitzDailyTokens.earned : 0;
  const mathFluencyDailyEarned =
    player.mathFluencyDailyTokens?.dateKey === todayKey
      ? player.mathFluencyDailyTokens.earned
      : 0;

  const getSubjectTier = (subj: SubjectId): DifficultyTier =>
    player.subjectTiers?.[subj] ?? (subj === 'english' ? player.activeTier : 2);

  const getSubjectPlacementCompleted = (subj: SubjectId): boolean =>
    player.subjectPlacementCompleted?.[subj] ??
    (subj === 'english' ? player.placementCompleted : false);

  const renderActiveSession = (active: ActiveSession): React.ReactNode => {
    const key = getSessionKey(active);
    const isAvatarShiny = Boolean(player.shinyVault?.[player.equippedCollectibleId]);

    switch (active.kind) {
      case 'parent':
        return (
          <ParentView
            key={key}
            player={player}
            onExit={clearActiveSession}
            onStartEnglishRun={(set) => setSession({ kind: 'english-run', set })}
            onStartChineseRun={(set) => setSession({ kind: 'chinese-run', set })}
            onOpenCustomImporter={(subj) => setImporterSubject(subj)}
            onDeleteCustomSet={handleDeleteCustomSet}
            onSetParentPin={(pin) =>
              commitPlayer((prev) => {
                const next: PlayerState = { ...prev };
                if (pin && /^\d{4}$/.test(pin)) {
                  next.parentPinHash = hashParentPin(pin);
                } else {
                  delete next.parentPinHash;
                }
                return next;
              })
            }
            onUpdateWeeklyGoal={(goal) =>
              commitPlayer((prev) => ({ ...prev, weeklyGoal: goal }))
            }
            onRedeemWeeklyReward={(weekKey) =>
              commitPlayer((prev) => ({
                ...prev,
                weeklyGoal: {
                  enTarget: prev.weeklyGoal?.enTarget ?? 0,
                  zhTarget: prev.weeklyGoal?.zhTarget ?? 0,
                  mathTarget: prev.weeklyGoal?.mathTarget ?? 0,
                  rewardText: prev.weeklyGoal?.rewardText ?? '',
                  redeemedWeekKey: weekKey,
                },
              }))
            }
            onRecordBackup={() =>
              commitPlayer((prev) => ({ ...prev, lastBackupAt: new Date().toISOString() }))
            }
            onImportState={(nextState) => commitPlayer(() => nextState)}
            onChangeSpeechRateMode={(mode) =>
              commitPlayer((prev) => ({
                ...prev,
                speechRateMode: mode === 'slow' ? 'slow' : 'normal',
              }))
            }
          />
        );
      case 'reading':
        return (
          <ReadingRunView
            key={key}
            questSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            showZhuyin={showZhuyin}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: active.set.subjectId,
              todayKey,
            })}
            onToggleZhuyin={handleToggleZhuyin}
            onExit={clearActiveSession}
            onCompleteReading={handleCompleteReadingRun}
            onGoToMarket={goToMarket}
          />
        );
      case 'zh-chapter':
        return (
          <ChapterSeriesView
            key={key}
            series={active.series}
            completedEpisodeIds={player.completedChapterEpisodeIds ?? []}
            claimedSeriesIds={player.claimedChapterSeriesIds ?? []}
            showZhuyin={showZhuyin}
            getEpisodeRewardPolicy={(episodeId) =>
              getQuestRewardPolicy(player, {
                questSetId: episodeId,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                completedIds: player.completedChapterEpisodeIds ?? [],
              })
            }
            onToggleZhuyin={handleToggleZhuyin}
            onCompleteEpisode={handleCompleteChapterEpisode}
            onClaimSeriesChest={handleClaimChapterSeriesChest}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'logic-lab':
        return (
          <LogicLabView
            key={key}
            player={player}
            onCompleteModule={handleCompleteLogicModule}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'mixed-warmup':
        return (
          <MixedWarmupView
            key={key}
            mode={active.mode}
            player={player}
            showZhuyin={showZhuyin}
            onToggleZhuyin={handleToggleZhuyin}
            onComplete={handleCompleteMixedWarmup}
            onSwitchMode={(nextMode) => setSession({ kind: 'mixed-warmup', mode: nextMode })}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'tower':
        return (
          <TowerDefenseView
            key={key}
            subjectId={active.subjectId}
            activeTier={getSubjectTier(active.subjectId)}
            vault={player.vault}
            shinyVault={player.shinyVault}
            favoriteCollectibleIds={player.favoriteCollectibleIds}
            highScore={player.towerHighScores?.[active.subjectId] ?? 0}
            arcadeTokensEarnedToday={getTodayArcadeTokensEarned(player, todayKey)}
            showZhuyin={showZhuyin}
            onToggleZhuyin={handleToggleZhuyin}
            onCompleteTowerDefense={handleCompleteTowerDefense}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'boss':
        return (
          <BossBattleView
            key={key}
            subjectId={active.subjectId}
            activeTier={getSubjectTier(active.subjectId)}
            vault={player.vault}
            shinyVault={player.shinyVault}
            favoriteCollectibleIds={player.favoriteCollectibleIds}
            highScore={player.bossHighScores?.[active.subjectId] ?? 0}
            arcadeTokensEarnedToday={getTodayArcadeTokensEarned(player, todayKey)}
            showZhuyin={showZhuyin}
            onToggleZhuyin={handleToggleZhuyin}
            onCompleteBossBattle={handleCompleteBossBattle}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'fishing':
        return (
          <FishingGameView
            key={key}
            subjectId={active.subjectId}
            activeTier={getSubjectTier(active.subjectId)}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            vault={player.vault}
            shinyVault={player.shinyVault}
            favoriteCollectibleIds={player.favoriteCollectibleIds}
            highScoreLbs={player.fishingHighScores?.[active.subjectId] ?? 0}
            arcadeTokensEarnedToday={getTodayArcadeTokensEarned(player, todayKey)}
            showZhuyin={showZhuyin}
            onToggleZhuyin={handleToggleZhuyin}
            onCompleteFishing={handleCompleteFishing}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'cafe':
        return (
          <CafeGameView
            key={key}
            subjectId={active.subjectId}
            activeTier={getSubjectTier(active.subjectId)}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            vault={player.vault}
            shinyVault={player.shinyVault}
            favoriteCollectibleIds={player.favoriteCollectibleIds}
            highScore={player.cafeHighScores?.[active.subjectId] ?? 0}
            arcadeTokensEarnedToday={getTodayArcadeTokensEarned(player, todayKey)}
            showZhuyin={showZhuyin}
            onToggleZhuyin={handleToggleZhuyin}
            onCompleteCafe={handleCompleteCafe}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'blitz':
        return (
          <BlitzView
            key={key}
            subjectId={active.subjectId}
            activeTier={getSubjectTier(active.subjectId)}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            highScore={player.blitzHighScores?.[active.subjectId] ?? 0}
            dailyTokensEarnedSoFar={blitzDailyEarned}
            showZhuyin={showZhuyin}
            onToggleZhuyin={handleToggleZhuyin}
            onCompleteBlitz={handleCompleteBlitz}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'placement':
        if (active.subjectId === 'english') {
          return (
            <PlacementView
              key={key}
              equippedCollectibleId={player.equippedCollectibleId}
              alreadyCompleted={getSubjectPlacementCompleted('english')}
              onExit={clearActiveSession}
              onComplete={(tier) => handleCompletePlacement('english', tier)}
              onGoToMarket={goToMarket}
            />
          );
        }
        if (active.subjectId === 'math') {
          return (
            <MathPlacementView
              key={key}
              equippedCollectibleId={player.equippedCollectibleId}
              alreadyCompleted={getSubjectPlacementCompleted('math')}
              onExit={clearActiveSession}
              onComplete={(tier) => handleCompletePlacement('math', tier)}
              onGoToMarket={goToMarket}
            />
          );
        }
        return (
          <ChinesePlacementView
            key={key}
            equippedCollectibleId={player.equippedCollectibleId}
            alreadyCompleted={getSubjectPlacementCompleted('chinese')}
            showZhuyin={showZhuyin}
            onToggleZhuyin={handleToggleZhuyin}
            onExit={clearActiveSession}
            onComplete={(tier) => handleCompletePlacement('chinese', tier)}
            onGoToMarket={goToMarket}
          />
        );
      case 'english-run':
        return (
          <RunView
            key={key}
            wordSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            currentTotalTokens={player.tokens}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: 'english',
              todayKey,
              words: active.set.words.map((w) => w.word),
            })}
            onExit={clearActiveSession}
            onRecordPartialMastery={(outs) => handleRecordPartialMastery('english', outs)}
            onCompleteRun={handleCompleteEnglishRun}
            onGoToMarket={goToMarket}
          />
        );
      case 'math-run':
        return (
          <MathRunView
            key={key}
            questSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            currentTotalTokens={player.tokens}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'math',
              subjectId: 'math',
              todayKey,
            })}
            onExit={clearActiveSession}
            onRecordPartialMastery={(outs) => handleRecordPartialMastery('math', outs)}
            onCompleteRun={handleCompleteMathRun}
            onGoToMarket={goToMarket}
          />
        );
      case 'chinese-run':
        return (
          <ChineseRunView
            key={key}
            wordSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            currentTotalTokens={player.tokens}
            showZhuyin={showZhuyin}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: 'chinese',
              todayKey,
              words: active.set.words.map((w) => w.word),
            })}
            onToggleZhuyin={handleToggleZhuyin}
            onExit={clearActiveSession}
            onRecordPartialMastery={(outs) => handleRecordPartialMastery('chinese', outs)}
            onCompleteRun={handleCompleteChineseRun}
            onGoToMarket={goToMarket}
          />
        );
      case 'radical':
        return (
          <RadicalQuestView
            key={key}
            family={active.family}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            showZhuyin={showZhuyin}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.family.id,
              kind: 'static',
              subjectId: 'chinese',
              todayKey,
              completedIds: player.completedRadicalIds ?? [],
              words: active.family.items.map((it) => it.char),
            })}
            onToggleZhuyin={handleToggleZhuyin}
            onCompleteRadical={handleCompleteRadical}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'measure':
        return (
          <MeasureIdiomQuestView
            key={key}
            questSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            showZhuyin={showZhuyin}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: 'chinese',
              todayKey,
              completedIds: player.completedMeasureIds ?? [],
              words: active.set.questions.map((q) => q.targetAnswer),
            })}
            onToggleZhuyin={handleToggleZhuyin}
            onComplete={handleCompleteMeasureIdiom}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'english-root':
        return (
          <EnglishRootQuestView
            key={key}
            family={active.family}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.family.id,
              kind: 'static',
              subjectId: 'english',
              todayKey,
              completedIds: player.completedEnglishRootIds ?? [],
              words: active.family.items.map((it) => it.word),
            })}
            onComplete={handleCompleteEnglishRoot}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'grammar':
        return (
          <GrammarRepairView
            key={key}
            questSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: 'english',
              todayKey,
              completedIds: player.completedGrammarIds ?? [],
              words: active.set.questions.map((q) => q.targetAnswer),
            })}
            onComplete={handleCompleteGrammarRepair}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'spelling':
        return (
          <SpellingBeeView
            key={key}
            questSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: 'english',
              todayKey,
              completedIds: player.completedSpellingIds ?? [],
              words: active.set.items.map((it) => it.word),
            })}
            onComplete={handleCompleteSpelling}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'en-chapter':
        return (
          <EnglishChapterSeriesView
            key={key}
            series={active.series}
            completedEpisodeIds={player.completedEnglishChapterIds ?? []}
            claimedSeriesIds={player.claimedEnglishChapterSeriesIds ?? []}
            getEpisodeRewardPolicy={(episodeId) =>
              getQuestRewardPolicy(player, {
                questSetId: episodeId,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                completedIds: player.completedEnglishChapterIds ?? [],
              })
            }
            onCompleteEpisode={handleCompleteEnglishChapterEpisode}
            onClaimSeriesChest={handleClaimEnglishChapterChest}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'math-fluency':
        return (
          <FactFluencyView
            key={key}
            factMastery={player.mathFactMastery}
            fluencyTokensToday={mathFluencyDailyEarned}
            onComplete={handleCompleteMathFluency}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'bar-model':
        return (
          <BarModelQuestView
            key={key}
            unit={active.unit}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.unit.id,
              kind: 'math',
              subjectId: 'math',
              todayKey,
              completedIds: player.completedBarModelIds ?? [],
            })}
            onComplete={handleCompleteBarModel}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'clock-measure':
        return (
          <ClockMeasureQuestView
            key={key}
            unit={active.unit}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.unit.id,
              kind: 'math',
              subjectId: 'math',
              todayKey,
              completedIds: player.completedClockMeasureIds ?? [],
            })}
            onComplete={handleCompleteClockMeasure}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'sentence-pattern':
        return (
          <SentencePatternView
            key={key}
            questSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            showZhuyin={showZhuyin}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: 'chinese',
              todayKey,
              completedIds: player.completedSentencePatternIds ?? [],
            })}
            onToggleZhuyin={handleToggleZhuyin}
            onComplete={handleCompleteSentencePattern}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'look-alike':
        return (
          <LookAlikeHanziView
            key={key}
            questSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            showZhuyin={showZhuyin}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: 'chinese',
              todayKey,
              completedIds: player.completedLookAlikeIds ?? [],
              words: active.set.questions.map((q) => q.targetChar),
            })}
            onToggleZhuyin={handleToggleZhuyin}
            onComplete={handleCompleteLookAlike}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'figurative':
        return (
          <FigurativeLabView
            key={key}
            questSet={active.set}
            equippedCollectibleId={player.equippedCollectibleId}
            isAvatarShiny={isAvatarShiny}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: active.set.id,
              kind: 'static',
              subjectId: 'english',
              todayKey,
              completedIds: player.completedFigurativeIds ?? [],
            })}
            onComplete={handleCompleteFigurative}
            onExit={clearActiveSession}
            onGoToMarket={goToMarket}
          />
        );
      case 'zh-listening': {
        const zhTier = getSubjectTier('chinese');
        return (
          <ChineseListeningView
            key={`${key}:${zhTier}`}
            tier={zhTier}
            showZhuyin={showZhuyin}
            rewardPolicy={getQuestRewardPolicy(player, {
              questSetId: `zh-listening-t${zhTier}`,
              kind: 'static',
              subjectId: 'chinese',
              todayKey,
            })}
            onToggleZhuyin={handleToggleZhuyin}
            onExit={clearActiveSession}
            onComplete={handleCompleteChineseListening}
          />
        );
      }
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] flex flex-col bg-[#FAF7F2] text-[#1C1917]">
        <TopBar
          player={player}
          activeTab={activeTab}
          activeSubjectId={activeSubjectId}
          hideMobileNav={inActiveSession}
          onSelectTab={(tab) => {
            clearActiveSession();
            setActiveTab(tab);
          }}
          onSelectSubject={handleSelectSubject}
          onToggleMute={() => commitPlayer((prev) => ({ ...prev, muted: !prev.muted }))}
          onRenamePlayer={(displayName) => commitPlayer((prev) => ({ ...prev, displayName }))}
          onOpenParent={() => {
            audioService.stopSpeech();
            setSession({ kind: 'parent' });
          }}
        />

        <main
          className={`mx-auto w-full max-w-5xl flex-1 px-4 pt-5 sm:px-6 sm:pt-6 ${
            inActiveSession ? 'pb-8' : 'pb-24 lg:pb-12'
          }`}
        >
          <Suspense fallback={<ViewLoadingFallback />}>
            {session ? (
              renderActiveSession(session)
            ) : activeTab === 'quests' ? (
              <HomeView
                player={player}
                activeSubjectId={activeSubjectId}
                activeTier={activeTier}
                placementCompleted={placementCompleted}
                showZhuyin={showZhuyin}
                onSelectSubject={handleSelectSubject}
                onSelectTier={handleSelectTier}
                onToggleZhuyin={handleToggleZhuyin}
                onStartPlacement={() =>
                  setSession({ kind: 'placement', subjectId: activeSubjectId })
                }
                onStartBlitz={(subjectId) => setSession({ kind: 'blitz', subjectId })}
                onStartCafe={(subjectId) => setSession({ kind: 'cafe', subjectId })}
                onStartFishing={(subjectId) => setSession({ kind: 'fishing', subjectId })}
                onStartBossBattle={(subjectId) => setSession({ kind: 'boss', subjectId })}
                onStartTowerDefense={(subjectId) => setSession({ kind: 'tower', subjectId })}
                onOpenLogicLab={() => setSession({ kind: 'logic-lab' })}
                onOpenMixedWarmup={(mode) => setSession({ kind: 'mixed-warmup', mode })}
                onClaimDailyQuest={handleClaimDailyQuest}
                onStartEnglishRun={(set) => setSession({ kind: 'english-run', set })}
                onStartEnglishRootFamily={(family) => setSession({ kind: 'english-root', family })}
                onStartGrammarRepairSet={(set) => setSession({ kind: 'grammar', set })}
                onStartSpellingSet={(set) => setSession({ kind: 'spelling', set })}
                onStartEnglishChapterSeries={(series) =>
                  setSession({ kind: 'en-chapter', series })
                }
                onStartFigurativeSet={(set) => setSession({ kind: 'figurative', set })}
                onStartMathRun={(set) => setSession({ kind: 'math-run', set })}
                onStartFactFluency={() => setSession({ kind: 'math-fluency' })}
                onStartBarModelUnit={(unit) => setSession({ kind: 'bar-model', unit })}
                onStartClockMeasureUnit={(unit) => setSession({ kind: 'clock-measure', unit })}
                onStartChineseRun={(set) => setSession({ kind: 'chinese-run', set })}
                onStartChineseListening={() => setSession({ kind: 'zh-listening' })}
                onStartRadicalFamily={(family) => setSession({ kind: 'radical', family })}
                onStartMeasureIdiomSet={(set) => setSession({ kind: 'measure', set })}
                onStartSentencePatternSet={(set) =>
                  setSession({ kind: 'sentence-pattern', set })
                }
                onStartLookAlikeSet={(set) => setSession({ kind: 'look-alike', set })}
                onStartChapterSeries={(series) => setSession({ kind: 'zh-chapter', series })}
                onStartReadingRun={(set) => setSession({ kind: 'reading', set })}
                onOpenCustomImporter={(subj) => setImporterSubject(subj)}
                onDeleteCustomSet={handleDeleteCustomSet}
                onGoToMarket={() => setActiveTab('market')}
                onClearWishlistPack={() => {
                  commitPlayer((prev) => setPinnedWishlistPack(prev, undefined));
                  audioService.playToken();
                }}
                onClaimAdventureMilestone={handleClaimAdventureMilestone}
                onApplyAdventureMakeup={handleApplyAdventureMakeup}
                onGoToProgress={() => setActiveTab('writing')}
              />
            ) : activeTab === 'market' ? (
              <MarketView
                player={player}
                onOpenPack={handleOpenPack}
                onGoToQuests={() => setActiveTab('quests')}
                onToggleWishlistPack={handleToggleWishlistPack}
              />
            ) : activeTab === 'vault' ? (
              <VaultView
                player={player}
                showZhuyin={showZhuyin}
                onToggleZhuyin={handleToggleZhuyin}
                onEquipAvatar={handleEquipAvatar}
                onSellDuplicate={handleSellDuplicate}
                onCraftShiny={handleCraftShiny}
                onMeltForStarDust={handleMeltForStarDust}
                onWishUnlock={handleWishUnlock}
                onFuseFiveUp={handleFuseFiveUp}
                onToggleFavorite={handleToggleFavorite}
                onClaimAchievement={handleClaimAchievement}
                onUpdateRoomTheme={handleUpdateRoomTheme}
                onPlaceRoomCritter={handlePlaceRoomCritter}
                onToggleRoomDecor={handleToggleRoomDecor}
                onPetCritter={handlePetCritter}
                onFeedCritterTreat={handleFeedCritterTreat}
                onAnswerRoomPopQuiz={handleAnswerRoomPopQuiz}
              />
            ) : (
              <WritingLogView
                player={player}
                activeSubjectId={activeSubjectId}
                onSelectSubject={(subj) =>
                  commitPlayer((prev) => ({ ...prev, activeSubjectId: subj }))
                }
                onImportState={(nextState) => commitPlayer(() => nextState)}
                onRecordBackup={() =>
                  commitPlayer((prev) => ({ ...prev, lastBackupAt: new Date().toISOString() }))
                }
                onChangeSpeechRateMode={(mode) =>
                  commitPlayer((prev) => ({
                    ...prev,
                    speechRateMode: mode === 'slow' ? 'slow' : 'normal',
                  }))
                }
                onStartEnglishRun={(set) => setSession({ kind: 'english-run', set })}
                onStartMathRun={(set) => setSession({ kind: 'math-run', set })}
                onStartChineseRun={(set) => setSession({ kind: 'chinese-run', set })}
                onGoToQuests={() => setActiveTab('quests')}
              />
            )}
          </Suspense>
        </main>

        <PackOpeningModal
          pull={activePull}
          tokensRemaining={player.tokens}
          isEquipped={
            Boolean(activePull) &&
            player.equippedCollectibleId === activePull?.collectible.id
          }
          onClose={() => setActivePull(null)}
          onOpenAnother={handleOpenPack}
          onEquip={handleEquipAvatar}
          onSellDuplicate={handleSellDuplicate}
        />

        <CustomWordSetDrawer
          open={Boolean(importerSubject)}
          subjectId={importerSubject ?? 'english'}
          onClose={() => setImporterSubject(null)}
          onSaveAndPlay={handleSaveCustomSet}
        />
      </div>
    </MotionConfig>
  );
};

export default App;

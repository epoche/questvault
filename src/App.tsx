import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { claimAchievementReward } from './core/achievements';
import { hashParentPin } from './core/analytics';
import { audioService } from './core/audio';
import {
  applyQuestRewardMultiplier,
  awardBlitzSessionRewards,
  awardBossSessionRewards,
  awardCafeSessionRewards,
  awardFishingSessionRewards,
  awardLogicModuleRewards,
  awardMathFluencyRewards,
  awardTowerSessionRewards,
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
  recordDailyQuestClaim,
  recordDailySubjectCompletion,
  sellDuplicateCollectible,
  toggleCritterRoomDecor,
  toggleFavoriteCollectible,
  updateCritterRoomTheme,
  wishUnlockWithStarDust,
} from './core/economy';
import { recordWordOutcome } from './core/mastery';
import { createLocalStorageRepository } from './core/repository';
import type { ReadingQuestSet } from './core/readingTypes';
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
import type { MeasureIdiomSet } from './subjects/chinese/measureIdiomSets';
import type { RadicalFamily } from './subjects/chinese/radicalFamilies';
import type { SentencePatternSet } from './subjects/chinese/sentencePatternTypes';
import type { ChineseWordSet } from './subjects/chinese/types';
import { customRecordToWordSet } from './subjects/english/customParser';
import { PLACEMENT_BONUS_TOKENS } from './subjects/english/placement';
import {
  EN_CHAPTER_SERIES_CHEST_BONUS,
  type EnglishChapterSeries,
} from './subjects/english/englishChapterStories';
import type {
  EnglishRootFamily,
  GrammarRepairSet,
} from './subjects/english/rootsGrammarTypes';
import { getLocalDateKey } from './subjects/english/runEngine';
import type { SpellingSet } from './subjects/english/spellingTypes';
import type { WordSet } from './subjects/english/types';
import type { BarModelUnitMeta } from './subjects/math/barModelEngine';
import { MATH_PLACEMENT_BONUS_TOKENS } from './subjects/math/mathPlacement';
import type { MathQuestSet } from './subjects/math/types';
import { CustomWordSetDrawer } from './ui/components/CustomWordSetDrawer';
import {
  PackOpeningModal,
  type PackPullViewData,
} from './ui/components/PackOpeningModal';
import { type NavTab, TopBar } from './ui/components/TopBar';
import {
  type BarModelCompletionPayload,
  BarModelQuestView,
} from './ui/views/BarModelQuestView';
import { type BlitzCompletionPayload, BlitzView } from './ui/views/BlitzView';
import {
  type BossBattleCompletionPayload,
  BossBattleView,
} from './ui/views/BossBattleView';
import { type CafeCompletionPayload, CafeGameView } from './ui/views/CafeGameView';
import {
  type ChapterEpisodeCompletionPayload,
  ChapterSeriesView,
} from './ui/views/ChapterSeriesView';
import {
  type ChineseListeningCompletionPayload,
  ChineseListeningView,
} from './ui/views/ChineseListeningView';
import { ChinesePlacementView } from './ui/views/ChinesePlacementView';
import { type ChineseCompletionPayload, ChineseRunView } from './ui/views/ChineseRunView';
import {
  type EnglishChapterEpisodeCompletionPayload,
  EnglishChapterSeriesView,
} from './ui/views/EnglishChapterSeriesView';
import {
  type EnglishRootCompletionPayload,
  EnglishRootQuestView,
} from './ui/views/EnglishRootQuestView';
import {
  type FactFluencyCompletionPayload,
  FactFluencyView,
} from './ui/views/FactFluencyView';
import { type FishingCompletionPayload, FishingGameView } from './ui/views/FishingGameView';
import {
  type GrammarRepairCompletionPayload,
  GrammarRepairView,
} from './ui/views/GrammarRepairView';
import { HomeView } from './ui/views/HomeView';
import { LogicLabView } from './ui/views/LogicLabView';
import { MarketView } from './ui/views/MarketView';
import type { SpatialModuleId } from './subjects/logic/logicTypes';
import { MathPlacementView } from './ui/views/MathPlacementView';
import { type MathCompletionPayload, MathRunView } from './ui/views/MathRunView';
import {
  type MeasureIdiomCompletionPayload,
  MeasureIdiomQuestView,
} from './ui/views/MeasureIdiomQuestView';
import { ParentView } from './ui/views/ParentView';
import { PlacementView } from './ui/views/PlacementView';
import {
  type RadicalCompletionPayload,
  RadicalQuestView,
} from './ui/views/RadicalQuestView';
import { type ReadingCompletionPayload, ReadingRunView } from './ui/views/ReadingRunView';
import { type RunCompletionPayload, RunView } from './ui/views/RunView';
import {
  type SentencePatternCompletionPayload,
  SentencePatternView,
} from './ui/views/SentencePatternView';
import {
  type SpellingBeeCompletionPayload,
  SpellingBeeView,
} from './ui/views/SpellingBeeView';
import {
  type TowerDefenseCompletionPayload,
  TowerDefenseView,
} from './ui/views/TowerDefenseView';
import { VaultView } from './ui/views/VaultView';
import { WritingLogView } from './ui/views/WritingLogView';

export const App: React.FC = () => {
  const repository = useMemo(() => createLocalStorageRepository(), []);
  const [player, setPlayer] = useState<PlayerState>(() => repository.load());
  const playerRef = useRef<PlayerState>(player);
  playerRef.current = player;
  const [activeTab, setActiveTab] = useState<NavTab>('quests');

  const [activeEnglishSet, setActiveEnglishSet] = useState<WordSet | null>(null);
  const [activeEnglishRootFamily, setActiveEnglishRootFamily] =
    useState<EnglishRootFamily | null>(null);
  const [activeGrammarSet, setActiveGrammarSet] = useState<GrammarRepairSet | null>(null);
  const [activeSpellingSet, setActiveSpellingSet] = useState<SpellingSet | null>(null);
  const [activeEnglishChapterSeries, setActiveEnglishChapterSeries] =
    useState<EnglishChapterSeries | null>(null);
  const [activeMathSet, setActiveMathSet] = useState<MathQuestSet | null>(null);
  const [activeMathFluency, setActiveMathFluency] = useState(false);
  const [activeBarModelUnit, setActiveBarModelUnit] = useState<BarModelUnitMeta | null>(null);
  const [activeChineseSet, setActiveChineseSet] = useState<ChineseWordSet | null>(null);
  const [activeChineseListening, setActiveChineseListening] = useState(false);
  const [activeRadicalFamily, setActiveRadicalFamily] = useState<RadicalFamily | null>(null);
  const [activeMeasureSet, setActiveMeasureSet] = useState<MeasureIdiomSet | null>(null);
  const [activeSentencePatternSet, setActiveSentencePatternSet] =
    useState<SentencePatternSet | null>(null);
  const [activeChapterSeries, setActiveChapterSeries] = useState<ChapterSeries | null>(null);
  const [activeReadingSet, setActiveReadingSet] = useState<ReadingQuestSet | null>(null);
  const [placementSubject, setPlacementSubject] = useState<SubjectId | null>(null);
  const [activeBlitzSubject, setActiveBlitzSubject] = useState<SubjectId | null>(null);
  const [activeCafeSubject, setActiveCafeSubject] = useState<SubjectId | null>(null);
  const [activeFishingSubject, setActiveFishingSubject] = useState<SubjectId | null>(null);
  const [activeBossSubject, setActiveBossSubject] = useState<SubjectId | null>(null);
  const [activeTowerSubject, setActiveTowerSubject] = useState<SubjectId | null>(null);
  const [logicLabOpen, setLogicLabOpen] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);

  const [activePull, setActivePull] = useState<PackPullViewData | null>(null);
  const [importerSubject, setImporterSubject] = useState<'english' | 'chinese' | null>(null);

  const activeSubjectId: SubjectId = player.activeSubjectId ?? 'english';
  const activeTier: DifficultyTier =
    player.subjectTiers?.[activeSubjectId] ??
    (activeSubjectId === 'english' ? player.activeTier : 2);
  const placementCompleted =
    player.subjectPlacementCompleted?.[activeSubjectId] ??
    (activeSubjectId === 'english' ? player.placementCompleted : false);
  const showZhuyin = Boolean(player.showZhuyin);

  const inActiveSession = Boolean(
    activeEnglishSet ||
      activeEnglishRootFamily ||
      activeGrammarSet ||
      activeSpellingSet ||
      activeEnglishChapterSeries ||
      activeMathSet ||
      activeMathFluency ||
      activeBarModelUnit ||
      activeChineseSet ||
      activeChineseListening ||
      activeRadicalFamily ||
      activeMeasureSet ||
      activeSentencePatternSet ||
      activeChapterSeries ||
      activeReadingSet ||
      placementSubject ||
      activeBlitzSubject ||
      activeCafeSubject ||
      activeFishingSubject ||
      activeBossSubject ||
      activeTowerSubject ||
      logicLabOpen ||
      parentOpen,
  );

  useEffect(() => {
    repository.save(player);
  }, [player, repository]);

  useEffect(() => {
    audioService.setMuted(player.muted);
  }, [player.muted]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [
    activeTab,
    activeSubjectId,
    activeEnglishSet,
    activeEnglishRootFamily,
    activeGrammarSet,
    activeSpellingSet,
    activeEnglishChapterSeries,
    activeMathSet,
    activeMathFluency,
    activeBarModelUnit,
    activeChineseSet,
    activeChineseListening,
    activeRadicalFamily,
    activeMeasureSet,
    activeSentencePatternSet,
    activeChapterSeries,
    activeReadingSet,
    placementSubject,
    activeBlitzSubject,
    activeCafeSubject,
    activeFishingSubject,
    activeBossSubject,
    activeTowerSubject,
    logicLabOpen,
    parentOpen,
  ]);

  const clearActiveSession = () => {
    setActiveEnglishSet(null);
    setActiveEnglishRootFamily(null);
    setActiveGrammarSet(null);
    setActiveSpellingSet(null);
    setActiveEnglishChapterSeries(null);
    setActiveMathSet(null);
    setActiveMathFluency(false);
    setActiveBarModelUnit(null);
    setActiveChineseSet(null);
    setActiveChineseListening(false);
    setActiveRadicalFamily(null);
    setActiveMeasureSet(null);
    setActiveSentencePatternSet(null);
    setActiveChapterSeries(null);
    setActiveReadingSet(null);
    setPlacementSubject(null);
    setActiveBlitzSubject(null);
    setActiveCafeSubject(null);
    setActiveFishingSubject(null);
    setActiveBossSubject(null);
    setActiveTowerSubject(null);
    setLogicLabOpen(false);
    setParentOpen(false);
  };

  const handleSelectSubject = (subjectId: SubjectId) => {
    clearActiveSession();
    setActiveTab('quests');
    setPlayer((prev) => ({
      ...prev,
      activeSubjectId: subjectId,
    }));
  };

  const handleSelectTier = (tier: DifficultyTier) => {
    setPlayer((prev) => {
      const nextTiers = {
        english: prev.subjectTiers?.english ?? prev.activeTier,
        math: prev.subjectTiers?.math ?? 2,
        chinese: prev.subjectTiers?.chinese ?? 2,
        [activeSubjectId]: tier,
      };
      return {
        ...prev,
        activeTier: nextTiers.english,
        subjectTiers: nextTiers,
      };
    });
  };

  const handleToggleZhuyin = () => {
    setPlayer((prev) => ({ ...prev, showZhuyin: !prev.showZhuyin }));
  };

  const handleOpenPack = (packId: PackId) => {
    const result = openMysteryPack(playerRef.current, packId);
    if (!result.ok) return;
    playerRef.current = result.state;
    setPlayer(result.state);
    setActivePull({
      packId,
      collectible: result.collectible,
      isNew: result.isNew,
      newCount: result.newCount,
    });
  };

  const handleEquipAvatar = (collectibleId: string) => {
    const next = equipCollectibleAvatar(playerRef.current, collectibleId);
    playerRef.current = next;
    setPlayer(next);
    audioService.playToken();
  };

  const handleSellDuplicate = (collectibleId: string) => {
    const res = sellDuplicateCollectible(playerRef.current, collectibleId);
    if (!res.ok) return;
    playerRef.current = res.state;
    setPlayer(res.state);
    audioService.playToken();
  };

  const handleCraftShiny = (collectibleId: string) => {
    const res = craftShinyCollectible(playerRef.current, collectibleId);
    if (!res.ok) return;
    playerRef.current = res.state;
    setPlayer(res.state);
    audioService.playChest();
  };

  const handleMeltForStarDust = (collectibleId: string) => {
    const res = meltDuplicateForStarDust(playerRef.current, collectibleId);
    if (!res.ok) return;
    playerRef.current = res.state;
    setPlayer(res.state);
    audioService.playToken();
  };

  const handleWishUnlock = (collectibleId: string): boolean => {
    const res = wishUnlockWithStarDust(playerRef.current, collectibleId);
    if (!res.ok) return false;
    playerRef.current = res.state;
    setPlayer(res.state);
    audioService.playPackReveal(res.collectible.rarity);
    return true;
  };

  const handleFuseFiveUp = (
    sourceRarity: Rarity,
  ): { awarded: Collectible; isNew: boolean } | null => {
    const res = fuseFiveDuplicatesUp(playerRef.current, sourceRarity);
    if (!res.ok) return null;
    playerRef.current = res.state;
    setPlayer(res.state);
    audioService.playPackReveal(res.awarded.rarity);
    return { awarded: res.awarded, isNew: res.isNew };
  };

  const handleToggleFavorite = (collectibleId: string) => {
    const res = toggleFavoriteCollectible(playerRef.current, collectibleId);
    if (!res.ok) return;
    playerRef.current = res.state;
    setPlayer(res.state);
    audioService.playToken();
  };

  const handleClaimDailyQuest = () => {
    const todayKey = getLocalDateKey();
    setPlayer((prev) => {
      const res = claimDailyTriSubjectReward(prev, todayKey);
      if (!res.ok) return prev;
      audioService.playChest();
      return res.state;
    });
  };

  const handleCompleteBlitz = (
    payload: BlitzCompletionPayload,
  ): { tokensAwarded: number; remainingDailyCap: number } => {
    const todayKey = getLocalDateKey();
    const res = awardBlitzSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.score,
      payload.rawTokensEarned,
      todayKey,
    );
    playerRef.current = res.state;
    setPlayer(res.state);
    return {
      tokensAwarded: res.tokensAwarded,
      remainingDailyCap: res.remainingDailyCap,
    };
  };

  const handleCompleteCafe = (
    payload: CafeCompletionPayload,
  ): { tokensAwarded: number; remainingDailyCap: number } => {
    const todayKey = getLocalDateKey();
    const res = awardCafeSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.coinsScore,
      payload.rawTokensEarned,
      todayKey,
    );
    playerRef.current = res.state;
    setPlayer(res.state);
    return {
      tokensAwarded: res.tokensAwarded,
      remainingDailyCap: res.remainingDailyCap,
    };
  };

  const handleCompleteFishing = (
    payload: FishingCompletionPayload,
  ): { tokensAwarded: number; remainingDailyCap: number } => {
    const todayKey = getLocalDateKey();
    const res = awardFishingSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.totalLbs,
      payload.rawTokensEarned,
      todayKey,
    );
    playerRef.current = res.state;
    setPlayer(res.state);
    return {
      tokensAwarded: res.tokensAwarded,
      remainingDailyCap: res.remainingDailyCap,
    };
  };

  const handleCompleteBossBattle = (
    payload: BossBattleCompletionPayload,
  ): { tokensAwarded: number; remainingDailyCap: number } => {
    const todayKey = getLocalDateKey();
    const res = awardBossSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.score,
      payload.rawTokensEarned,
      todayKey,
    );
    playerRef.current = res.state;
    setPlayer(res.state);
    return {
      tokensAwarded: res.tokensAwarded,
      remainingDailyCap: res.remainingDailyCap,
    };
  };

  const handleCompleteTowerDefense = (
    payload: TowerDefenseCompletionPayload,
  ): { tokensAwarded: number; remainingDailyCap: number } => {
    const todayKeyNow = getLocalDateKey();
    const res = awardTowerSessionRewards(
      playerRef.current,
      payload.subjectId,
      payload.score,
      payload.rawTokensEarned,
      todayKeyNow,
    );
    playerRef.current = res.state;
    setPlayer(res.state);
    return {
      tokensAwarded: res.tokensAwarded,
      remainingDailyCap: res.remainingDailyCap,
    };
  };

  const handleUpdateRoomTheme = (themeId: CritterRoomThemeId) => {
    const next = updateCritterRoomTheme(playerRef.current, themeId);
    playerRef.current = next;
    setPlayer(next);
  };

  const handlePlaceRoomCritter = (slotIndex: number, collectibleId: string | null) => {
    const next = placeCritterInRoomSlot(playerRef.current, slotIndex, collectibleId);
    playerRef.current = next;
    setPlayer(next);
  };

  const handleToggleRoomDecor = (decorId: string) => {
    const next = toggleCritterRoomDecor(playerRef.current, decorId);
    playerRef.current = next;
    setPlayer(next);
  };

  const handleCompleteLogicModule = (
    moduleId: SpatialModuleId,
    correctCount: number,
    totalQuestions: number,
  ) => {
    const res = awardLogicModuleRewards(
      playerRef.current,
      moduleId,
      correctCount,
      totalQuestions,
      getLocalDateKey(),
    );
    playerRef.current = res.state;
    setPlayer(res.state);
    return {
      tokensAwarded: res.tokensAwarded,
      remainingDailyCap: res.remainingDailyCap,
    };
  };

  const handleCompleteEnglishRun = (payload: RunCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.summary.questSetId,
        kind: 'static',
        subjectId: 'english',
        todayKey,
        words: activeEnglishSet?.words.map((w) => w.word),
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.summary.tokensEarned,
        policy.multiplier,
      );
      const summary = { ...payload.summary, tokensEarned: awardedTokens };

      const completedSet = prev.completedQuestSetIds.includes(payload.summary.questSetId)
        ? prev.completedQuestSetIds
        : [...prev.completedQuestSetIds, payload.summary.questSetId];

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, { ...out, subjectId: 'english' });
      }

      const isRematch = payload.summary.questSetId === 'en-tricky-rematch';

      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        wordMastery: nextMastery,
        completedQuestSetIds: completedSet,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
        writingLog: [payload.writingEntry, ...prev.writingLog].slice(0, 100),
        ...(isRematch
          ? {
              lastBossRematchDate: todayKey,
              subjectBossRematchDate: { ...prev.subjectBossRematchDate, english: todayKey },
            }
          : {}),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.summary.questSetId, todayKey),
        'english',
        todayKey,
      );
    });
  };

  const handleCompleteMathRun = (payload: MathCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.summary.questSetId,
        kind: 'math',
        subjectId: 'math',
        todayKey,
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.summary.tokensEarned,
        policy.multiplier,
      );
      const summary = { ...payload.summary, tokensEarned: awardedTokens };

      const completedSet = prev.completedQuestSetIds.includes(payload.summary.questSetId)
        ? prev.completedQuestSetIds
        : [...prev.completedQuestSetIds, payload.summary.questSetId];

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, { ...out, subjectId: 'math' });
      }

      const isRematch = payload.summary.questSetId === 'math-tricky-rematch';

      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        wordMastery: nextMastery,
        completedQuestSetIds: completedSet,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
        ...(isRematch
          ? {
              subjectBossRematchDate: { ...prev.subjectBossRematchDate, math: todayKey },
            }
          : {}),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.summary.questSetId, todayKey),
        'math',
        todayKey,
      );
    });
  };

  const handleCompleteChineseRun = (payload: ChineseCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.summary.questSetId,
        kind: 'static',
        subjectId: 'chinese',
        todayKey,
        words: activeChineseSet?.words.map((w) => w.word),
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.summary.tokensEarned,
        policy.multiplier,
      );
      const summary = { ...payload.summary, tokensEarned: awardedTokens };

      const completedSet = prev.completedQuestSetIds.includes(payload.summary.questSetId)
        ? prev.completedQuestSetIds
        : [...prev.completedQuestSetIds, payload.summary.questSetId];

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, { ...out, subjectId: 'chinese' });
      }

      const isRematch = payload.summary.questSetId === 'zh-tricky-rematch';

      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        wordMastery: nextMastery,
        completedQuestSetIds: completedSet,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
        writingLog: [payload.writingEntry, ...prev.writingLog].slice(0, 100),
        ...(isRematch
          ? {
              subjectBossRematchDate: { ...prev.subjectBossRematchDate, chinese: todayKey },
            }
          : {}),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.summary.questSetId, todayKey),
        'chinese',
        todayKey,
      );
    });
  };

  const handleCompletePlacement = (subjectId: SubjectId, recommendedTier: DifficultyTier) => {
    setPlayer((prev) => {
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
    wordOutcomes: import('./core/mastery').WordOutcomeInput[],
  ) => {
    if (wordOutcomes.length === 0) return;
    setPlayer((prev) => {
      let nextMastery = prev.wordMastery;
      for (const out of wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, { ...out, subjectId });
      }
      return {
        ...prev,
        wordMastery: nextMastery,
      };
    });
  };

  const handleCompleteReadingRun = (payload: ReadingCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.summary.questSetId,
        kind: 'static',
        subjectId: payload.summary.subjectId,
        todayKey,
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.summary.tokensEarned,
        policy.multiplier,
      );
      const summary = { ...payload.summary, tokensEarned: awardedTokens };

      const completedSet = prev.completedQuestSetIds.includes(payload.summary.questSetId)
        ? prev.completedQuestSetIds
        : [...prev.completedQuestSetIds, payload.summary.questSetId];
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedQuestSetIds: completedSet,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.summary.questSetId, todayKey),
        payload.summary.subjectId,
        todayKey,
      );
    });
  };

  const handleCompleteChineseListening = (payload: ChineseListeningCompletionPayload) => {
    setPlayer((prev) => {
      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, {
          word: out.word,
          subjectId: 'chinese',
          tier: payload.tier,
          outcome: out.correct ? 'clean' : 'missed',
        });
      }
      const todayKey = getLocalDateKey();
      const accuracyPct =
        payload.totalCount > 0
          ? Math.round((payload.correctCount / payload.totalCount) * 100)
          : 100;
      const summary = {
        id: `zh-listen-${Date.now()}`,
        subjectId: 'chinese' as const,
        questSetId: `zh-listening-t${payload.tier}`,
        questSetTitle: `聽音辨字特訓 (第 ${payload.tier} 階)`,
        tokensEarned: payload.tokensEarned,
        maxCombo: payload.correctCount,
        accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + payload.tokensEarned,
        wordMastery: nextMastery,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(updated, 'chinese', todayKey);
    });
    setActiveChineseListening(false);
  };

  const handleCompleteRadical = (payload: RadicalCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const prevRadicals = prev.completedRadicalIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.familyId,
        kind: 'static',
        subjectId: 'chinese',
        todayKey,
        completedIds: prevRadicals,
        words: activeRadicalFamily?.items.map((it) => it.char),
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );

      const nextRadicals = prevRadicals.includes(payload.familyId)
        ? prevRadicals
        : [...prevRadicals, payload.familyId];

      let nextMastery = prev.wordMastery;
      for (const ch of payload.masteredChars) {
        nextMastery = recordWordOutcome(nextMastery, {
          word: ch.char,
          subjectId: 'chinese',
          tier: payload.tier,
          outcome: ch.firstTryCorrect ? 'clean' : 'missed',
        });
      }

      const summary = {
        id: `zh-rad-${Date.now()}`,
        subjectId: 'chinese' as const,
        questSetId: payload.familyId,
        questSetTitle: `偏旁工廠：${payload.familyTitle}`,
        tokensEarned: awardedTokens,
        maxCombo: payload.masteredChars.filter((c) => c.firstTryCorrect).length,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedRadicalIds: nextRadicals,
        wordMastery: nextMastery,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.familyId, todayKey),
        'chinese',
        todayKey,
      );
    });
  };

  const handleCompleteChapterEpisode = (payload: ChapterEpisodeCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const prevEps = prev.completedChapterEpisodeIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.episodeId,
        kind: 'static',
        subjectId: 'chinese',
        todayKey,
        completedIds: prevEps,
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );

      const nextEps = prevEps.includes(payload.episodeId)
        ? prevEps
        : [...prevEps, payload.episodeId];
      const summary = {
        id: `zh-chap-${Date.now()}`,
        subjectId: 'chinese' as const,
        questSetId: payload.episodeId,
        questSetTitle: `章節小說：《${payload.seriesTitle}》第 ${payload.episodeNumber} 集`,
        tokensEarned: awardedTokens,
        maxCombo: 3,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedChapterEpisodeIds: nextEps,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.episodeId, todayKey),
        'chinese',
        todayKey,
      );
    });
  };

  const handleClaimChapterSeriesChest = (series: ChapterSeries): boolean => {
    const res = claimChapterSeriesChest(
      playerRef.current,
      series.id,
      series.episodes.map((e) => e.id),
      CHAPTER_SERIES_CHEST_BONUS,
    );
    if (!res.ok) return false;
    playerRef.current = res.state;
    setPlayer(res.state);
    return true;
  };

  const handleCompleteMeasureIdiom = (payload: MeasureIdiomCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const prevMeasures = prev.completedMeasureIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.setId,
        kind: 'static',
        subjectId: 'chinese',
        todayKey,
        completedIds: prevMeasures,
        words: activeMeasureSet?.questions.map((q) => q.targetAnswer),
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );

      const nextMeasures = prevMeasures.includes(payload.setId)
        ? prevMeasures
        : [...prevMeasures, payload.setId];

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, {
          word: out.word,
          subjectId: 'chinese',
          tier: payload.tier,
          outcome: out.firstTryCorrect ? 'clean' : 'missed',
        });
      }

      const summary = {
        id: `zh-meas-${Date.now()}`,
        subjectId: 'chinese' as const,
        questSetId: payload.setId,
        questSetTitle: `${payload.kind === 'measure' ? '量詞大作戰' : '易混詞成語'}：${payload.setTitle}`,
        tokensEarned: awardedTokens,
        maxCombo: payload.maxCombo,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedMeasureIds: nextMeasures,
        wordMastery: nextMastery,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.setId, todayKey),
        'chinese',
        todayKey,
      );
    });
  };

  const handleClaimAchievement = (achievementId: string): boolean => {
    const res = claimAchievementReward(playerRef.current, achievementId);
    if (!res.ok) return false;
    playerRef.current = res.state;
    setPlayer(res.state);
    audioService.playChest();
    return true;
  };

  const handleCompleteEnglishRoot = (payload: EnglishRootCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const prevRoots = prev.completedEnglishRootIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.familyId,
        kind: 'static',
        subjectId: 'english',
        todayKey,
        completedIds: prevRoots,
        words: activeEnglishRootFamily?.items.map((it) => it.word),
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );

      const nextRoots = prevRoots.includes(payload.familyId)
        ? prevRoots
        : [...prevRoots, payload.familyId];

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, {
          word: out.word,
          subjectId: 'english',
          tier: payload.tier,
          outcome: out.firstTryCorrect ? 'clean' : 'missed',
        });
      }

      const summary = {
        id: `en-root-${Date.now()}`,
        subjectId: 'english' as const,
        questSetId: payload.familyId,
        questSetTitle: `Word Roots: ${payload.familyTitle}`,
        tokensEarned: awardedTokens,
        maxCombo: payload.wordOutcomes.filter((o) => o.firstTryCorrect).length,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedEnglishRootIds: nextRoots,
        wordMastery: nextMastery,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.familyId, todayKey),
        'english',
        todayKey,
      );
    });
  };

  const handleCompleteGrammarRepair = (payload: GrammarRepairCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const prevGrammar = prev.completedGrammarIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.setId,
        kind: 'static',
        subjectId: 'english',
        todayKey,
        completedIds: prevGrammar,
        words: activeGrammarSet?.questions.map((q) => q.targetAnswer),
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );

      const nextGrammar = prevGrammar.includes(payload.setId)
        ? prevGrammar
        : [...prevGrammar, payload.setId];

      const summary = {
        id: `en-gram-${Date.now()}`,
        subjectId: 'english' as const,
        questSetId: payload.setId,
        questSetTitle: `Grammar Lab: ${payload.setTitle}`,
        tokensEarned: awardedTokens,
        maxCombo: payload.maxCombo,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedGrammarIds: nextGrammar,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.setId, todayKey),
        'english',
        todayKey,
      );
    });
  };

  const handleCompleteSpelling = (payload: SpellingBeeCompletionPayload) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const prevSpelling = prev.completedSpellingIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.setId,
        kind: 'static',
        subjectId: 'english',
        todayKey,
        completedIds: prevSpelling,
        words: payload.wordOutcomes.map((w) => w.word),
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, {
          word: out.word,
          subjectId: 'english',
          tier: payload.tier,
          outcome: out.firstTryCorrect ? 'clean' : 'missed',
        });
      }

      const nextSpelling = prevSpelling.includes(payload.setId)
        ? prevSpelling
        : [...prevSpelling, payload.setId];

      const summary = {
        id: `en-spell-${Date.now()}`,
        subjectId: 'english' as const,
        questSetId: payload.setId,
        questSetTitle: `Spelling Bee: ${payload.setTitle}`,
        tokensEarned: awardedTokens,
        maxCombo: payload.wordOutcomes.filter((w) => w.firstTryCorrect).length,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedSpellingIds: nextSpelling,
        wordMastery: nextMastery,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.setId, todayKey),
        'english',
        todayKey,
      );
    });
  };

  const handleCompleteEnglishChapterEpisode = (
    payload: EnglishChapterEpisodeCompletionPayload,
  ) => {
    setPlayer((prev) => {
      const todayKey = getLocalDateKey();
      const prevEps = prev.completedEnglishChapterIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.episodeId,
        kind: 'static',
        subjectId: 'english',
        todayKey,
        completedIds: prevEps,
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );

      const nextEps = prevEps.includes(payload.episodeId)
        ? prevEps
        : [...prevEps, payload.episodeId];

      const summary = {
        id: `en-ch-${Date.now()}`,
        subjectId: 'english' as const,
        questSetId: payload.episodeId,
        questSetTitle: `${payload.seriesTitle} Ch.${payload.episodeNumber}: ${payload.episodeTitle}`,
        tokensEarned: awardedTokens,
        maxCombo: 3,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedEnglishChapterIds: nextEps,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.episodeId, todayKey),
        'english',
        todayKey,
      );
    });
  };

  const handleClaimEnglishChapterChest = (series: EnglishChapterSeries): boolean => {
    const reqIds = series.episodes.map((e) => e.id);
    const res = claimEnglishChapterSeriesChest(
      playerRef.current,
      series.id,
      reqIds,
      EN_CHAPTER_SERIES_CHEST_BONUS,
    );
    if (!res.ok) return false;
    playerRef.current = res.state;
    setPlayer(res.state);
    return true;
  };

  const handleCompleteMathFluency = (
    payload: FactFluencyCompletionPayload,
  ): { tokensAwarded: number; remainingDailyCap: number } => {
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
        ? recordDailySubjectCompletion(withHistory, 'math', todayKeyNow)
        : withHistory;
    playerRef.current = finalState;
    setPlayer(finalState);
    return {
      tokensAwarded: res.tokensAwarded,
      remainingDailyCap: res.remainingDailyCap,
    };
  };

  const handleCompleteBarModel = (payload: BarModelCompletionPayload) => {
    setPlayer((prev) => {
      const todayKeyNow = getLocalDateKey();
      const prevBm = prev.completedBarModelIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.unitId,
        kind: 'math',
        subjectId: 'math',
        todayKey: todayKeyNow,
        completedIds: prevBm,
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );
      const nextBm = prevBm.includes(payload.unitId)
        ? prevBm
        : [...prevBm, payload.unitId];

      const summary = {
        id: `math-bm-${Date.now()}`,
        subjectId: 'math' as const,
        questSetId: payload.unitId,
        questSetTitle: `Bar Model Lab: ${payload.unitTitle}`,
        tokensEarned: awardedTokens,
        maxCombo: 4,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedBarModelIds: nextBm,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.unitId, todayKeyNow),
        'math',
        todayKeyNow,
      );
    });
  };

  const handleCompleteSentencePattern = (payload: SentencePatternCompletionPayload) => {
    setPlayer((prev) => {
      const todayKeyNow = getLocalDateKey();
      const prevPatterns = prev.completedSentencePatternIds ?? [];
      const policy = getQuestRewardPolicy(prev, {
        questSetId: payload.setId,
        kind: 'static',
        subjectId: 'chinese',
        todayKey: todayKeyNow,
        completedIds: prevPatterns,
      });
      const awardedTokens = applyQuestRewardMultiplier(
        payload.rawTokensEarned ?? payload.tokensEarned,
        policy.multiplier,
      );
      const nextPatterns = prevPatterns.includes(payload.setId)
        ? prevPatterns
        : [...prevPatterns, payload.setId];

      const summary = {
        id: `zh-sp-${Date.now()}`,
        subjectId: 'chinese' as const,
        questSetId: payload.setId,
        questSetTitle: `句型魔方：${payload.setTitle}`,
        tokensEarned: awardedTokens,
        maxCombo: payload.maxCombo,
        accuracyPct: payload.accuracyPct,
        completedAt: new Date().toISOString(),
      };
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + awardedTokens,
        completedSentencePatternIds: nextPatterns,
        runHistory: [summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(
        recordDailyQuestClaim(updated, payload.setId, todayKeyNow),
        'chinese',
        todayKeyNow,
      );
    });
  };

  const handleSaveCustomSet = (record: CustomWordSetRecord) => {
    setPlayer((prev) => ({
      ...prev,
      customWordSets: [record, ...prev.customWordSets],
    }));
    setImporterSubject(null);
    setParentOpen(false);
    if (record.subjectId === 'chinese') {
      setActiveChineseSet(customChineseRecordToWordSet(record));
    } else {
      setActiveEnglishSet(customRecordToWordSet(record));
    }
  };

  const handleDeleteCustomSet = (id: string) => {
    setPlayer((prev) => ({
      ...prev,
      customWordSets: prev.customWordSets.filter((s) => s.id !== id),
    }));
  };

  const todayKey = getLocalDateKey();
  const blitzDailyEarned =
    player.blitzDailyTokens?.dateKey === todayKey ? player.blitzDailyTokens.earned : 0;
  const mathFluencyDailyEarned =
    player.mathFluencyDailyTokens?.dateKey === todayKey
      ? player.mathFluencyDailyTokens.earned
      : 0;

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
          onToggleMute={() =>
            setPlayer((prev) => ({ ...prev, muted: !prev.muted }))
          }
          onRenamePlayer={(displayName) =>
            setPlayer((prev) => ({ ...prev, displayName }))
          }
          onOpenParent={() => {
            clearActiveSession();
            setParentOpen(true);
          }}
        />

        <main
          className={`mx-auto w-full max-w-5xl flex-1 px-4 pt-5 sm:px-6 sm:pt-6 ${
            inActiveSession ? 'pb-8' : 'pb-24 lg:pb-12'
          }`}
        >
          {parentOpen ? (
            <ParentView
              player={player}
              onExit={() => setParentOpen(false)}
              onStartEnglishRun={(set) => {
                setParentOpen(false);
                setActiveEnglishSet(set);
              }}
              onStartChineseRun={(set) => {
                setParentOpen(false);
                setActiveChineseSet(set);
              }}
              onOpenCustomImporter={(subj) => setImporterSubject(subj)}
              onDeleteCustomSet={handleDeleteCustomSet}
              onSetParentPin={(pin) =>
                setPlayer((prev) => {
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
                setPlayer((prev) => ({
                  ...prev,
                  weeklyGoal: goal,
                }))
              }
              onRedeemWeeklyReward={(weekKey) =>
                setPlayer((prev) => ({
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
                setPlayer((prev) => ({
                  ...prev,
                  lastBackupAt: new Date().toISOString(),
                }))
              }
            />
          ) : activeReadingSet ? (
            <ReadingRunView
              questSet={activeReadingSet}
              equippedCollectibleId={player.equippedCollectibleId}
              showZhuyin={showZhuyin}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeReadingSet.id,
                kind: 'static',
                subjectId: activeReadingSet.subjectId,
                todayKey,
              })}
              onToggleZhuyin={handleToggleZhuyin}
              onExit={() => setActiveReadingSet(null)}
              onCompleteReading={handleCompleteReadingRun}
              onGoToMarket={() => {
                setActiveReadingSet(null);
                setActiveTab('market');
              }}
            />
          ) : activeChapterSeries ? (
            <ChapterSeriesView
              series={activeChapterSeries}
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
              onExit={() => setActiveChapterSeries(null)}
              onGoToMarket={() => {
                setActiveChapterSeries(null);
                setActiveTab('market');
              }}
            />
          ) : logicLabOpen ? (
            <LogicLabView
              player={player}
              onCompleteModule={handleCompleteLogicModule}
              onExit={() => setLogicLabOpen(false)}
              onGoToMarket={() => {
                setLogicLabOpen(false);
                setActiveTab('market');
              }}
            />
          ) : activeTowerSubject ? (
            <TowerDefenseView
              key={activeTowerSubject}
              subjectId={activeTowerSubject}
              activeTier={
                player.subjectTiers?.[activeTowerSubject] ??
                (activeTowerSubject === 'english' ? player.activeTier : 2)
              }
              vault={player.vault}
              shinyVault={player.shinyVault}
              favoriteCollectibleIds={player.favoriteCollectibleIds}
              highScore={player.towerHighScores?.[activeTowerSubject] ?? 0}
              arcadeTokensEarnedToday={getTodayArcadeTokensEarned(player, todayKey)}
              showZhuyin={showZhuyin}
              onToggleZhuyin={handleToggleZhuyin}
              onCompleteTowerDefense={handleCompleteTowerDefense}
              onExit={() => setActiveTowerSubject(null)}
              onGoToMarket={() => {
                setActiveTowerSubject(null);
                setActiveTab('market');
              }}
            />
          ) : activeBossSubject ? (
            <BossBattleView
              subjectId={activeBossSubject}
              activeTier={
                player.subjectTiers?.[activeBossSubject] ??
                (activeBossSubject === 'english' ? player.activeTier : 2)
              }
              vault={player.vault}
              shinyVault={player.shinyVault}
              favoriteCollectibleIds={player.favoriteCollectibleIds}
              highScore={player.bossHighScores?.[activeBossSubject] ?? 0}
              arcadeTokensEarnedToday={getTodayArcadeTokensEarned(player, todayKey)}
              showZhuyin={showZhuyin}
              onToggleZhuyin={handleToggleZhuyin}
              onCompleteBossBattle={handleCompleteBossBattle}
              onExit={() => setActiveBossSubject(null)}
              onGoToMarket={() => {
                setActiveBossSubject(null);
                setActiveTab('market');
              }}
            />
          ) : activeFishingSubject ? (
            <FishingGameView
              subjectId={activeFishingSubject}
              activeTier={
                player.subjectTiers?.[activeFishingSubject] ??
                (activeFishingSubject === 'english' ? player.activeTier : 2)
              }
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              vault={player.vault}
              shinyVault={player.shinyVault}
              favoriteCollectibleIds={player.favoriteCollectibleIds}
              highScoreLbs={player.fishingHighScores?.[activeFishingSubject] ?? 0}
              arcadeTokensEarnedToday={getTodayArcadeTokensEarned(player, todayKey)}
              showZhuyin={showZhuyin}
              onToggleZhuyin={handleToggleZhuyin}
              onCompleteFishing={handleCompleteFishing}
              onExit={() => setActiveFishingSubject(null)}
              onGoToMarket={() => {
                setActiveFishingSubject(null);
                setActiveTab('market');
              }}
            />
          ) : activeCafeSubject ? (
            <CafeGameView
              subjectId={activeCafeSubject}
              activeTier={
                player.subjectTiers?.[activeCafeSubject] ??
                (activeCafeSubject === 'english' ? player.activeTier : 2)
              }
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              vault={player.vault}
              shinyVault={player.shinyVault}
              favoriteCollectibleIds={player.favoriteCollectibleIds}
              highScore={player.cafeHighScores?.[activeCafeSubject] ?? 0}
              arcadeTokensEarnedToday={getTodayArcadeTokensEarned(player, todayKey)}
              showZhuyin={showZhuyin}
              onToggleZhuyin={handleToggleZhuyin}
              onCompleteCafe={handleCompleteCafe}
              onExit={() => setActiveCafeSubject(null)}
              onGoToMarket={() => {
                setActiveCafeSubject(null);
                setActiveTab('market');
              }}
            />
          ) : activeBlitzSubject ? (
            <BlitzView
              subjectId={activeBlitzSubject}
              activeTier={
                player.subjectTiers?.[activeBlitzSubject] ??
                (activeBlitzSubject === 'english' ? player.activeTier : 2)
              }
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              highScore={player.blitzHighScores?.[activeBlitzSubject] ?? 0}
              dailyTokensEarnedSoFar={blitzDailyEarned}
              showZhuyin={showZhuyin}
              onToggleZhuyin={handleToggleZhuyin}
              onCompleteBlitz={handleCompleteBlitz}
              onExit={() => setActiveBlitzSubject(null)}
              onGoToMarket={() => {
                setActiveBlitzSubject(null);
                setActiveTab('market');
              }}
            />
          ) : placementSubject === 'english' ? (
            <PlacementView
              equippedCollectibleId={player.equippedCollectibleId}
              alreadyCompleted={placementCompleted}
              onExit={() => setPlacementSubject(null)}
              onComplete={(tier) => handleCompletePlacement('english', tier)}
              onGoToMarket={() => {
                setPlacementSubject(null);
                setActiveTab('market');
              }}
            />
          ) : placementSubject === 'math' ? (
            <MathPlacementView
              equippedCollectibleId={player.equippedCollectibleId}
              alreadyCompleted={placementCompleted}
              onExit={() => setPlacementSubject(null)}
              onComplete={(tier) => handleCompletePlacement('math', tier)}
              onGoToMarket={() => {
                setPlacementSubject(null);
                setActiveTab('market');
              }}
            />
          ) : placementSubject === 'chinese' ? (
            <ChinesePlacementView
              equippedCollectibleId={player.equippedCollectibleId}
              alreadyCompleted={placementCompleted}
              showZhuyin={showZhuyin}
              onToggleZhuyin={handleToggleZhuyin}
              onExit={() => setPlacementSubject(null)}
              onComplete={(tier) => handleCompletePlacement('chinese', tier)}
              onGoToMarket={() => {
                setPlacementSubject(null);
                setActiveTab('market');
              }}
            />
          ) : activeEnglishSet ? (
            <RunView
              wordSet={activeEnglishSet}
              equippedCollectibleId={player.equippedCollectibleId}
              currentTotalTokens={player.tokens}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeEnglishSet.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                words: activeEnglishSet.words.map((w) => w.word),
              })}
              onExit={() => setActiveEnglishSet(null)}
              onRecordPartialMastery={(outs) => handleRecordPartialMastery('english', outs)}
              onCompleteRun={handleCompleteEnglishRun}
              onGoToMarket={() => {
                setActiveEnglishSet(null);
                setActiveTab('market');
              }}
            />
          ) : activeMathSet ? (
            <MathRunView
              questSet={activeMathSet}
              equippedCollectibleId={player.equippedCollectibleId}
              currentTotalTokens={player.tokens}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeMathSet.id,
                kind: 'math',
                subjectId: 'math',
                todayKey,
              })}
              onExit={() => setActiveMathSet(null)}
              onRecordPartialMastery={(outs) => handleRecordPartialMastery('math', outs)}
              onCompleteRun={handleCompleteMathRun}
              onGoToMarket={() => {
                setActiveMathSet(null);
                setActiveTab('market');
              }}
            />
          ) : activeChineseSet ? (
            <ChineseRunView
              wordSet={activeChineseSet}
              equippedCollectibleId={player.equippedCollectibleId}
              currentTotalTokens={player.tokens}
              showZhuyin={showZhuyin}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeChineseSet.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                words: activeChineseSet.words.map((w) => w.word),
              })}
              onToggleZhuyin={handleToggleZhuyin}
              onExit={() => setActiveChineseSet(null)}
              onRecordPartialMastery={(outs) => handleRecordPartialMastery('chinese', outs)}
              onCompleteRun={handleCompleteChineseRun}
              onGoToMarket={() => {
                setActiveChineseSet(null);
                setActiveTab('market');
              }}
            />
          ) : activeRadicalFamily ? (
            <RadicalQuestView
              family={activeRadicalFamily}
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              showZhuyin={showZhuyin}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeRadicalFamily.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                completedIds: player.completedRadicalIds ?? [],
                words: activeRadicalFamily.items.map((it) => it.char),
              })}
              onToggleZhuyin={handleToggleZhuyin}
              onCompleteRadical={handleCompleteRadical}
              onExit={() => setActiveRadicalFamily(null)}
              onGoToMarket={() => {
                setActiveRadicalFamily(null);
                setActiveTab('market');
              }}
            />
          ) : activeMeasureSet ? (
            <MeasureIdiomQuestView
              questSet={activeMeasureSet}
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              showZhuyin={showZhuyin}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeMeasureSet.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                completedIds: player.completedMeasureIds ?? [],
                words: activeMeasureSet.questions.map((q) => q.targetAnswer),
              })}
              onToggleZhuyin={handleToggleZhuyin}
              onComplete={handleCompleteMeasureIdiom}
              onExit={() => setActiveMeasureSet(null)}
              onGoToMarket={() => {
                setActiveMeasureSet(null);
                setActiveTab('market');
              }}
            />
          ) : activeEnglishRootFamily ? (
            <EnglishRootQuestView
              family={activeEnglishRootFamily}
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeEnglishRootFamily.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                completedIds: player.completedEnglishRootIds ?? [],
                words: activeEnglishRootFamily.items.map((it) => it.word),
              })}
              onComplete={handleCompleteEnglishRoot}
              onExit={() => setActiveEnglishRootFamily(null)}
              onGoToMarket={() => {
                setActiveEnglishRootFamily(null);
                setActiveTab('market');
              }}
            />
          ) : activeGrammarSet ? (
            <GrammarRepairView
              questSet={activeGrammarSet}
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeGrammarSet.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                completedIds: player.completedGrammarIds ?? [],
                words: activeGrammarSet.questions.map((q) => q.targetAnswer),
              })}
              onComplete={handleCompleteGrammarRepair}
              onExit={() => setActiveGrammarSet(null)}
              onGoToMarket={() => {
                setActiveGrammarSet(null);
                setActiveTab('market');
              }}
            />
          ) : activeSpellingSet ? (
            <SpellingBeeView
              questSet={activeSpellingSet}
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeSpellingSet.id,
                kind: 'static',
                subjectId: 'english',
                todayKey,
                completedIds: player.completedSpellingIds ?? [],
                words: activeSpellingSet.items.map((it) => it.word),
              })}
              onComplete={handleCompleteSpelling}
              onExit={() => setActiveSpellingSet(null)}
              onGoToMarket={() => {
                setActiveSpellingSet(null);
                setActiveTab('market');
              }}
            />
          ) : activeEnglishChapterSeries ? (
            <EnglishChapterSeriesView
              series={activeEnglishChapterSeries}
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
              onExit={() => setActiveEnglishChapterSeries(null)}
              onGoToMarket={() => {
                setActiveEnglishChapterSeries(null);
                setActiveTab('market');
              }}
            />
          ) : activeMathFluency ? (
            <FactFluencyView
              factMastery={player.mathFactMastery}
              fluencyTokensToday={mathFluencyDailyEarned}
              onComplete={handleCompleteMathFluency}
              onExit={() => setActiveMathFluency(false)}
              onGoToMarket={() => {
                setActiveMathFluency(false);
                setActiveTab('market');
              }}
            />
          ) : activeBarModelUnit ? (
            <BarModelQuestView
              unit={activeBarModelUnit}
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeBarModelUnit.id,
                kind: 'math',
                subjectId: 'math',
                todayKey,
                completedIds: player.completedBarModelIds ?? [],
              })}
              onComplete={handleCompleteBarModel}
              onExit={() => setActiveBarModelUnit(null)}
              onGoToMarket={() => {
                setActiveBarModelUnit(null);
                setActiveTab('market');
              }}
            />
          ) : activeSentencePatternSet ? (
            <SentencePatternView
              key={activeSentencePatternSet.id}
              questSet={activeSentencePatternSet}
              equippedCollectibleId={player.equippedCollectibleId}
              isAvatarShiny={Boolean(player.shinyVault?.[player.equippedCollectibleId])}
              showZhuyin={showZhuyin}
              rewardPolicy={getQuestRewardPolicy(player, {
                questSetId: activeSentencePatternSet.id,
                kind: 'static',
                subjectId: 'chinese',
                todayKey,
                completedIds: player.completedSentencePatternIds ?? [],
              })}
              onToggleZhuyin={handleToggleZhuyin}
              onComplete={handleCompleteSentencePattern}
              onExit={() => setActiveSentencePatternSet(null)}
              onGoToMarket={() => {
                setActiveSentencePatternSet(null);
                setActiveTab('market');
              }}
            />
          ) : activeChineseListening ? (
            <ChineseListeningView
              tier={player.subjectTiers?.chinese ?? 2}
              showZhuyin={showZhuyin}
              onToggleZhuyin={handleToggleZhuyin}
              onExit={() => setActiveChineseListening(false)}
              onComplete={handleCompleteChineseListening}
            />
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
              onStartPlacement={() => setPlacementSubject(activeSubjectId)}
              onStartBlitz={(subj) => setActiveBlitzSubject(subj)}
              onStartCafe={(subj) => setActiveCafeSubject(subj)}
              onStartFishing={(subj) => setActiveFishingSubject(subj)}
              onStartBossBattle={(subj) => setActiveBossSubject(subj)}
              onStartTowerDefense={(subj) => setActiveTowerSubject(subj)}
              onOpenLogicLab={() => setLogicLabOpen(true)}
              onClaimDailyQuest={handleClaimDailyQuest}
              onStartEnglishRun={(set) => setActiveEnglishSet(set)}
              onStartEnglishRootFamily={(fam) => setActiveEnglishRootFamily(fam)}
              onStartGrammarRepairSet={(set) => setActiveGrammarSet(set)}
              onStartSpellingSet={(set) => setActiveSpellingSet(set)}
              onStartEnglishChapterSeries={(series) => setActiveEnglishChapterSeries(series)}
              onStartMathRun={(set) => setActiveMathSet(set)}
              onStartFactFluency={() => setActiveMathFluency(true)}
              onStartBarModelUnit={(unit) => setActiveBarModelUnit(unit)}
              onStartChineseRun={(set) => setActiveChineseSet(set)}
              onStartChineseListening={() => setActiveChineseListening(true)}
              onStartRadicalFamily={(fam) => setActiveRadicalFamily(fam)}
              onStartMeasureIdiomSet={(set) => setActiveMeasureSet(set)}
              onStartSentencePatternSet={(set) => setActiveSentencePatternSet(set)}
              onStartChapterSeries={(series) => setActiveChapterSeries(series)}
              onStartReadingRun={(set) => setActiveReadingSet(set)}
              onOpenCustomImporter={(subj) => setImporterSubject(subj)}
              onDeleteCustomSet={handleDeleteCustomSet}
              onGoToMarket={() => setActiveTab('market')}
            />
          ) : activeTab === 'market' ? (
            <MarketView
              player={player}
              onOpenPack={handleOpenPack}
              onGoToQuests={() => setActiveTab('quests')}
            />
          ) : activeTab === 'vault' ? (
            <VaultView
              player={player}
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
            />
          ) : (
            <WritingLogView
              player={player}
              activeSubjectId={activeSubjectId}
              onSelectSubject={(subj) =>
                setPlayer((prev) => ({ ...prev, activeSubjectId: subj }))
              }
              onImportState={(nextState) => setPlayer(nextState)}
              onRecordBackup={() =>
                setPlayer((prev) => ({
                  ...prev,
                  lastBackupAt: new Date().toISOString(),
                }))
              }
              onStartEnglishRun={(set) => setActiveEnglishSet(set)}
              onStartMathRun={(set) => setActiveMathSet(set)}
              onStartChineseRun={(set) => setActiveChineseSet(set)}
              onGoToQuests={() => setActiveTab('quests')}
            />
          )}
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

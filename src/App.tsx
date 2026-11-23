import React, { useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { audioService } from './core/audio';
import {
  awardBlitzSessionRewards,
  claimDailyTriSubjectReward,
  craftShinyCollectible,
  equipCollectibleAvatar,
  openMysteryPack,
  recordDailySubjectCompletion,
  sellDuplicateCollectible,
} from './core/economy';
import { recordWordOutcome } from './core/mastery';
import { createLocalStorageRepository } from './core/repository';
import type { ReadingQuestSet } from './core/readingTypes';
import type {
  CustomWordSetRecord,
  DifficultyTier,
  PackId,
  PlayerState,
  SubjectId,
} from './core/types';
import { customChineseRecordToWordSet } from './subjects/chinese/chineseCustomParser';
import { CHINESE_PLACEMENT_BONUS_TOKENS } from './subjects/chinese/chinesePlacement';
import type { ChineseWordSet } from './subjects/chinese/types';
import { customRecordToWordSet } from './subjects/english/customParser';
import { PLACEMENT_BONUS_TOKENS } from './subjects/english/placement';
import { getLocalDateKey } from './subjects/english/runEngine';
import type { WordSet } from './subjects/english/types';
import { MATH_PLACEMENT_BONUS_TOKENS } from './subjects/math/mathPlacement';
import type { MathQuestSet } from './subjects/math/types';
import { CustomWordSetDrawer } from './ui/components/CustomWordSetDrawer';
import {
  PackOpeningModal,
  type PackPullViewData,
} from './ui/components/PackOpeningModal';
import { type NavTab, TopBar } from './ui/components/TopBar';
import { type BlitzCompletionPayload, BlitzView } from './ui/views/BlitzView';
import {
  type ChineseListeningCompletionPayload,
  ChineseListeningView,
} from './ui/views/ChineseListeningView';
import { ChinesePlacementView } from './ui/views/ChinesePlacementView';
import { type ChineseCompletionPayload, ChineseRunView } from './ui/views/ChineseRunView';
import { HomeView } from './ui/views/HomeView';
import { MarketView } from './ui/views/MarketView';
import { MathPlacementView } from './ui/views/MathPlacementView';
import { type MathCompletionPayload, MathRunView } from './ui/views/MathRunView';
import { ParentView } from './ui/views/ParentView';
import { PlacementView } from './ui/views/PlacementView';
import { type ReadingCompletionPayload, ReadingRunView } from './ui/views/ReadingRunView';
import { type RunCompletionPayload, RunView } from './ui/views/RunView';
import { VaultView } from './ui/views/VaultView';
import { WritingLogView } from './ui/views/WritingLogView';

export const App: React.FC = () => {
  const repository = useMemo(() => createLocalStorageRepository(), []);
  const [player, setPlayer] = useState<PlayerState>(() => repository.load());
  const [activeTab, setActiveTab] = useState<NavTab>('quests');

  const [activeEnglishSet, setActiveEnglishSet] = useState<WordSet | null>(null);
  const [activeMathSet, setActiveMathSet] = useState<MathQuestSet | null>(null);
  const [activeChineseSet, setActiveChineseSet] = useState<ChineseWordSet | null>(null);
  const [activeChineseListening, setActiveChineseListening] = useState(false);
  const [activeReadingSet, setActiveReadingSet] = useState<ReadingQuestSet | null>(null);
  const [placementSubject, setPlacementSubject] = useState<SubjectId | null>(null);
  const [activeBlitzSubject, setActiveBlitzSubject] = useState<SubjectId | null>(null);
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
      activeMathSet ||
      activeChineseSet ||
      activeChineseListening ||
      activeReadingSet ||
      placementSubject ||
      activeBlitzSubject ||
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
    activeMathSet,
    activeChineseSet,
    activeChineseListening,
    activeReadingSet,
    placementSubject,
    activeBlitzSubject,
    parentOpen,
  ]);

  const clearActiveSession = () => {
    setActiveEnglishSet(null);
    setActiveMathSet(null);
    setActiveChineseSet(null);
    setActiveChineseListening(false);
    setActiveReadingSet(null);
    setPlacementSubject(null);
    setActiveBlitzSubject(null);
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
    const result = openMysteryPack(player, packId);
    if (!result.ok) return;
    setPlayer(result.state);
    setActivePull({
      packId,
      collectible: result.collectible,
      isNew: result.isNew,
      newCount: result.newCount,
    });
  };

  const handleEquipAvatar = (collectibleId: string) => {
    setPlayer((prev) => equipCollectibleAvatar(prev, collectibleId));
    audioService.playToken();
  };

  const handleSellDuplicate = (collectibleId: string) => {
    setPlayer((prev) => {
      const res = sellDuplicateCollectible(prev, collectibleId);
      if (!res.ok) return prev;
      audioService.playToken();
      return res.state;
    });
  };

  const handleCraftShiny = (collectibleId: string) => {
    setPlayer((prev) => {
      const res = craftShinyCollectible(prev, collectibleId);
      if (!res.ok) return prev;
      audioService.playChest();
      return res.state;
    });
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
    const preview = awardBlitzSessionRewards(
      player,
      payload.subjectId,
      payload.score,
      payload.rawTokensEarned,
      todayKey,
    );
    setPlayer((prev) => {
      const updated = awardBlitzSessionRewards(
        prev,
        payload.subjectId,
        payload.score,
        payload.rawTokensEarned,
        todayKey,
      );
      return updated.state;
    });
    return {
      tokensAwarded: preview.tokensAwarded,
      remainingDailyCap: preview.remainingDailyCap,
    };
  };

  const handleCompleteEnglishRun = (payload: RunCompletionPayload) => {
    setPlayer((prev) => {
      const completedSet = prev.completedQuestSetIds.includes(payload.summary.questSetId)
        ? prev.completedQuestSetIds
        : [...prev.completedQuestSetIds, payload.summary.questSetId];

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, { ...out, subjectId: 'english' });
      }

      const isRematch = payload.summary.questSetId === 'en-tricky-rematch';
      const todayKey = getLocalDateKey();

      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + payload.summary.tokensEarned,
        wordMastery: nextMastery,
        completedQuestSetIds: completedSet,
        runHistory: [payload.summary, ...prev.runHistory].slice(0, 50),
        writingLog: [payload.writingEntry, ...prev.writingLog].slice(0, 100),
        ...(isRematch
          ? {
              lastBossRematchDate: todayKey,
              subjectBossRematchDate: { ...prev.subjectBossRematchDate, english: todayKey },
            }
          : {}),
      };
      return recordDailySubjectCompletion(updated, 'english', todayKey);
    });
  };

  const handleCompleteMathRun = (payload: MathCompletionPayload) => {
    setPlayer((prev) => {
      const completedSet = prev.completedQuestSetIds.includes(payload.summary.questSetId)
        ? prev.completedQuestSetIds
        : [...prev.completedQuestSetIds, payload.summary.questSetId];

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, { ...out, subjectId: 'math' });
      }

      const isRematch = payload.summary.questSetId === 'math-tricky-rematch';
      const todayKey = getLocalDateKey();

      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + payload.summary.tokensEarned,
        wordMastery: nextMastery,
        completedQuestSetIds: completedSet,
        runHistory: [payload.summary, ...prev.runHistory].slice(0, 50),
        ...(isRematch
          ? {
              subjectBossRematchDate: { ...prev.subjectBossRematchDate, math: todayKey },
            }
          : {}),
      };
      return recordDailySubjectCompletion(updated, 'math', todayKey);
    });
  };

  const handleCompleteChineseRun = (payload: ChineseCompletionPayload) => {
    setPlayer((prev) => {
      const completedSet = prev.completedQuestSetIds.includes(payload.summary.questSetId)
        ? prev.completedQuestSetIds
        : [...prev.completedQuestSetIds, payload.summary.questSetId];

      let nextMastery = prev.wordMastery;
      for (const out of payload.wordOutcomes) {
        nextMastery = recordWordOutcome(nextMastery, { ...out, subjectId: 'chinese' });
      }

      const isRematch = payload.summary.questSetId === 'zh-tricky-rematch';
      const todayKey = getLocalDateKey();

      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + payload.summary.tokensEarned,
        wordMastery: nextMastery,
        completedQuestSetIds: completedSet,
        runHistory: [payload.summary, ...prev.runHistory].slice(0, 50),
        writingLog: [payload.writingEntry, ...prev.writingLog].slice(0, 100),
        ...(isRematch
          ? {
              subjectBossRematchDate: { ...prev.subjectBossRematchDate, chinese: todayKey },
            }
          : {}),
      };
      return recordDailySubjectCompletion(updated, 'chinese', todayKey);
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
      const bonus = prevDone ? 15 : fullBonus;

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
      const completedSet = prev.completedQuestSetIds.includes(payload.summary.questSetId)
        ? prev.completedQuestSetIds
        : [...prev.completedQuestSetIds, payload.summary.questSetId];
      const todayKey = getLocalDateKey();
      const updated: PlayerState = {
        ...prev,
        tokens: prev.tokens + payload.summary.tokensEarned,
        completedQuestSetIds: completedSet,
        runHistory: [payload.summary, ...prev.runHistory].slice(0, 50),
      };
      return recordDailySubjectCompletion(updated, payload.summary.subjectId, todayKey);
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
            />
          ) : activeReadingSet ? (
            <ReadingRunView
              questSet={activeReadingSet}
              equippedCollectibleId={player.equippedCollectibleId}
              showZhuyin={showZhuyin}
              onToggleZhuyin={handleToggleZhuyin}
              onExit={() => setActiveReadingSet(null)}
              onCompleteReading={handleCompleteReadingRun}
              onGoToMarket={() => {
                setActiveReadingSet(null);
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
              onToggleZhuyin={handleToggleZhuyin}
              onExit={() => setActiveChineseSet(null)}
              onRecordPartialMastery={(outs) => handleRecordPartialMastery('chinese', outs)}
              onCompleteRun={handleCompleteChineseRun}
              onGoToMarket={() => {
                setActiveChineseSet(null);
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
              onClaimDailyQuest={handleClaimDailyQuest}
              onStartEnglishRun={(set) => setActiveEnglishSet(set)}
              onStartMathRun={(set) => setActiveMathSet(set)}
              onStartChineseRun={(set) => setActiveChineseSet(set)}
              onStartChineseListening={() => setActiveChineseListening(true)}
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
            />
          ) : (
            <WritingLogView
              player={player}
              activeSubjectId={activeSubjectId}
              onSelectSubject={(subj) =>
                setPlayer((prev) => ({ ...prev, activeSubjectId: subj }))
              }
              onImportState={(nextState) => setPlayer(nextState)}
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

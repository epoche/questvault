// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { exportPlayerStateJson } from '../../src/core/repository';
import { createInitialPlayerState, getQuestRewardPolicy } from '../../src/core/economy';
import { COLLECTIBLES, MYSTERY_PACKS } from '../../src/core/packs';
import { BUILTIN_LOOK_ALIKE_SETS } from '../../src/subjects/chinese/lookAlikeSets';
import { CHINESE_READING_QUESTS } from '../../src/subjects/chinese/readingQuests';
import { BUILTIN_FIGURATIVE_SETS } from '../../src/subjects/english/figurativeSets';
import { BUILTIN_MATH_SETS } from '../../src/subjects/math/questSets';
import { CLOCK_MEASURE_UNITS } from '../../src/subjects/math/clockMeasureEngine';
import { audioService } from '../../src/core/audio';
import { MathVisual } from '../../src/ui/artwork/MathVisual';
import { ClockMeasureQuestView } from '../../src/ui/views/ClockMeasureQuestView';
import { FigurativeLabView } from '../../src/ui/views/FigurativeLabView';
import { HomeView } from '../../src/ui/views/HomeView';
import { LookAlikeHanziView } from '../../src/ui/views/LookAlikeHanziView';
import { MarketView } from '../../src/ui/views/MarketView';
import { MathRunView } from '../../src/ui/views/MathRunView';
import { MixedWarmupView } from '../../src/ui/views/MixedWarmupView';
import { PlacementView } from '../../src/ui/views/PlacementView';
import { ReadingRunView } from '../../src/ui/views/ReadingRunView';
import { VaultView } from '../../src/ui/views/VaultView';
import { WritingLogView } from '../../src/ui/views/WritingLogView';
import { getWeekDateKeys, recordAdventureStamp } from '../../src/core/adventureMap';
import { compute14DayTrend } from '../../src/core/analytics';
import { feedCritterTreat, petCritter, recordCritterPopQuizResult } from '../../src/core/critterCare';
import { recordWordOutcome } from '../../src/core/mastery';
import { ParentTrendSvg } from '../../src/ui/artwork/ParentTrendSvg';
import { CritterRoomPanel } from '../../src/ui/components/CritterRoomPanel';
import { DeviceVoiceSyncPanel } from '../../src/ui/components/DeviceVoiceSyncPanel';
import { TopBar } from '../../src/ui/components/TopBar';
import { WeeklyAdventureBar } from '../../src/ui/components/WeeklyAdventureBar';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const FULL_POLICY = getQuestRewardPolicy(createInitialPlayerState('Chloe'), {
  questSetId: 'test-set-new',
  kind: 'static',
  subjectId: 'english',
  todayKey: '2026-11-24',
});

describe('UI Component Regressions (happy-dom + React Testing Library)', () => {
  it('enforces synchronous re-entry locks in FigurativeLabView: rapid double-clicks never double-complete', () => {
    const questSet = BUILTIN_FIGURATIVE_SETS[0];
    const onComplete = vi.fn();

    render(
      <FigurativeLabView
        questSet={questSet}
        equippedCollectibleId="fox-01"
        rewardPolicy={FULL_POLICY}
        onComplete={onComplete}
        onExit={vi.fn()}
        onGoToMarket={vi.fn()}
      />,
    );

    for (let i = 0; i < questSet.questions.length; i++) {
      const q = questSet.questions[i];
      const correctBtn = screen.getByRole('button', { name: new RegExp(q.choices[q.correctIndex].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
      // Rapid double-click on choice in the same tick
      fireEvent.click(correctBtn);
      fireEvent.click(correctBtn);

      const isLast = i === questSet.questions.length - 1;
      const nextBtn = screen.getByRole('button', {
        name: isLast ? /Finish Quest/i : /Got It, Next/i,
      });
      // Rapid double-click on Next / Finish
      fireEvent.click(nextBtn);
      fireEvent.click(nextBtn);
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0].correctCount).toBe(questSet.questions.length);
  });

  it('enforces re-entry lock & respects showZhuyin=false on wrong answers in LookAlikeHanziView', () => {
    const questSet = BUILTIN_LOOK_ALIKE_SETS[0];
    const onComplete = vi.fn();

    const { container } = render(
      <LookAlikeHanziView
        questSet={questSet}
        equippedCollectibleId="fox-01"
        showZhuyin={false}
        rewardPolicy={FULL_POLICY}
        onToggleZhuyin={vi.fn()}
        onComplete={onComplete}
        onExit={vi.fn()}
        onGoToMarket={vi.fn()}
      />,
    );

    // Advance from Stage 1 compare to Stage 2 sprint
    const startSprintBtn = screen.getByRole('button', { name: /開始 5 題辨字衝刺/i });
    fireEvent.click(startSprintBtn);

    // Intentionally miss question 0 to verify wrong-answer banner hides <rt> zhuyin when showZhuyin=false
    const q0 = questSet.questions[0];
    const wrongIdx = q0.correctIndex === 0 ? 1 : 0;
    const wrongBtn = screen.getByRole('button', { name: new RegExp(q0.choices[wrongIdx]) });
    fireEvent.click(wrongBtn);
    fireEvent.click(wrongBtn);
    expect(container.querySelectorAll('rt').length).toBe(0);

    // Advance through remaining questions with rapid double-clicks
    for (let i = 0; i < questSet.questions.length; i++) {
      if (i > 0) {
        const q = questSet.questions[i];
        const btn = screen.getByRole('button', { name: new RegExp(q.choices[q.correctIndex]) });
        fireEvent.click(btn);
        fireEvent.click(btn);
      }
      const isLast = i === questSet.questions.length - 1;
      const nextBtn = screen.getByRole('button', {
        name: isLast ? /看結算寶箱/i : /我知道了，下一題/i,
      });
      fireEvent.click(nextBtn);
      fireEvent.click(nextBtn);
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0].correctCount).toBe(questSet.questions.length - 1);
  });

  it('enforces re-entry lock in PlacementView against same-tick double-clicks', () => {
    const onComplete = vi.fn();
    render(
      <PlacementView
        equippedCollectibleId="fox-01"
        onExit={vi.fn()}
        onComplete={onComplete}
        onGoToMarket={vi.fn()}
      />,
    );

    // Warm-Up 1 of N should be displayed initially
    expect(screen.getByText(/Warm-Up 1 of \d+/i)).toBeTruthy();

    // Find all 4 choice buttons inside the grid and double-click rapidly
    const allButtons = screen.getAllByRole('button');
    const choiceButtons = allButtons.filter(
      (b) => !/Exit|Hear Word|Skip/i.test(b.textContent ?? ''),
    );
    expect(choiceButtons.length).toBeGreaterThanOrEqual(4);
    fireEvent.click(choiceButtons[0]);
    fireEvent.click(choiceButtons[1]);

    // Should still be on Warm-Up 1 (not skipped ahead) and never fired onComplete
    expect(screen.getByText(/Warm-Up 1 of \d+/i)).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('prevents ghost completion in MathRunView when exiting early while timers are pending', () => {
    vi.useFakeTimers();
    const onExit = vi.fn();
    const onCompleteRun = vi.fn();
    const mathSet = BUILTIN_MATH_SETS[0];

    const { unmount } = render(
      <MathRunView
        questSet={mathSet}
        equippedCollectibleId="fox-01"
        currentTotalTokens={50}
        rewardPolicy={FULL_POLICY}
        onExit={onExit}
        onCompleteRun={onCompleteRun}
        onGoToMarket={vi.fn()}
      />,
    );

    // Click Exit during Stage 0 concept card
    const exitBtn = screen.getByRole('button', { name: /Exit/i });
    fireEvent.click(exitBtn);
    expect(onExit).toHaveBeenCalledTimes(1);

    // Unmount and flush any lingering timers for 3 seconds
    unmount();
    vi.advanceTimersByTime(3000);
    expect(onCompleteRun).not.toHaveBeenCalled();
  });

  it('filters VaultView live search ("Origami"), Craftable/Favorites pills, and resets empty search', () => {
    const player = createInitialPlayerState('Chloe');
    const firstItem = COLLECTIBLES[0];
    player.vault[firstItem.id] = 3; // Craftable Shiny
    player.vault['music-origami-crane'] = 1; // Unlocked Origami Paper Crane
    player.favoriteCollectibleIds = [firstItem.id];

    render(
      <VaultView
        player={player}
        onEquipAvatar={vi.fn()}
        onSellDuplicate={vi.fn()}
        onCraftShiny={vi.fn()}
        onMeltForStarDust={vi.fn()}
        onWishUnlock={() => true}
        onFuseFiveUp={() => null}
        onToggleFavorite={vi.fn()}
      />,
    );

    const searchInput = screen.getByLabelText('Search Vault collectibles') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Origami' } });
    expect(screen.getByText(/Origami Paper Crane/i)).toBeTruthy();

    // Nonexistent query shows reset button and clears search
    fireEvent.change(searchInput, { target: { value: 'zzzz_no_such_critter' } });
    const resetBtn = screen.getByRole('button', { name: /顯示全部/i });
    fireEvent.click(resetBtn);
    expect(searchInput.value).toBe('');

    // Craftable filter pill shows our 3x item
    const craftableBtn = screen.getByRole('button', { name: /可 3→1 合成/i });
    fireEvent.click(craftableBtn);
    expect(screen.getAllByText(firstItem.name).length).toBeGreaterThanOrEqual(1);
  }, 15_000);

  it('supports MarketView Pinned Wishlist Pack: progress when short, Open Now when affordable, and unpin', () => {
    const pack = MYSTERY_PACKS[0];
    const onOpenPack = vi.fn();
    const onToggleWishlistPack = vi.fn();

    // Case 1: Insufficient tokens
    const poorPlayer = createInitialPlayerState('Chloe');
    poorPlayer.tokens = Math.max(0, pack.cost - 10);
    poorPlayer.pinnedWishlistPackId = pack.id;

    const { rerender } = render(
      <MarketView
        player={poorPlayer}
        onOpenPack={onOpenPack}
        onGoToQuests={vi.fn()}
        onToggleWishlistPack={onToggleWishlistPack}
      />,
    );

    expect(screen.getByText(/還差 10 Tokens/i)).toBeTruthy();

    // Case 2: Affordable tokens -> shows Open Now button and fires onOpenPack
    const richPlayer = { ...poorPlayer, tokens: pack.cost + 20 };
    rerender(
      <MarketView
        player={richPlayer}
        onOpenPack={onOpenPack}
        onGoToQuests={vi.fn()}
        onToggleWishlistPack={onToggleWishlistPack}
      />,
    );

    const openNowBtn = screen.getByRole('button', { name: new RegExp(`Open Now · ${pack.cost}`) });
    fireEvent.click(openNowBtn);
    expect(onOpenPack).toHaveBeenCalledWith(pack.id);

    // Unpin wishlist pack
    const unpinBtn = screen.getByRole('button', { name: 'Unpin wishlist pack' });
    fireEvent.click(unpinBtn);
    expect(onToggleWishlistPack).toHaveBeenCalledWith(pack.id);
  });

  it('handles WritingLogView JSON Backup Restore: rejects corrupt JSON safely and imports valid JSON', async () => {
    const player = createInitialPlayerState('Chloe');
    const onImportState = vi.fn();

    const { container } = render(
      <WritingLogView
        player={player}
        activeSubjectId="english"
        onSelectSubject={vi.fn()}
        onImportState={onImportState}
        onStartEnglishRun={vi.fn()}
        onStartMathRun={vi.fn()}
        onStartChineseRun={vi.fn()}
        onGoToQuests={vi.fn()}
      />,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    // 1. Corrupt JSON -> shows error without calling onImportState
    const badFile = new File(['{not valid json'], 'bad.json', { type: 'application/json' });
    Object.defineProperty(badFile, 'text', { value: async () => '{not valid json' });
    fireEvent.change(fileInput, { target: { files: [badFile] } });
    await vi.waitFor(() => {
      expect(screen.getByText(/valid QuestVault JSON|JSON/i)).toBeTruthy();
    });
    expect(onImportState).not.toHaveBeenCalled();

    // 2. Valid exported JSON -> calls onImportState with restored displayName
    const backupPlayer = createInitialPlayerState('Mia');
    backupPlayer.tokens = 180;
    const validJson = exportPlayerStateJson(backupPlayer);
    const goodFile = new File([validJson], 'backup.json', { type: 'application/json' });
    Object.defineProperty(goodFile, 'text', { value: async () => validJson });
    fireEvent.change(fileInput, { target: { files: [goodFile] } });
    await vi.waitFor(() => {
      expect(onImportState).toHaveBeenCalledTimes(1);
    });
    expect(onImportState.mock.calls[0][0].displayName).toBe('Mia');
    expect(onImportState.mock.calls[0][0].tokens).toBe(180);
  });

  it('renders strictly one <h1> in HomeView, toggles Arcade Hall, and closes TopBar menu on Escape', () => {
    const player = createInitialPlayerState('Chloe');

    const { container } = render(
      <>
        <TopBar
          player={player}
          activeTab="quests"
          activeSubjectId="english"
          onSelectTab={vi.fn()}
          onSelectSubject={vi.fn()}
          onToggleMute={vi.fn()}
          onRenamePlayer={vi.fn()}
          onOpenParent={vi.fn()}
        />
        <HomeView
          player={player}
          activeSubjectId="english"
          activeTier={1}
          placementCompleted={false}
          showZhuyin={false}
          onSelectSubject={vi.fn()}
          onSelectTier={vi.fn()}
          onToggleZhuyin={vi.fn()}
          onStartPlacement={vi.fn()}
          onStartBlitz={vi.fn()}
          onStartCafe={vi.fn()}
          onStartFishing={vi.fn()}
          onStartBossBattle={vi.fn()}
          onStartTowerDefense={vi.fn()}
          onOpenLogicLab={vi.fn()}
          onOpenMixedWarmup={vi.fn()}
          onClaimDailyQuest={vi.fn()}
          onStartEnglishRun={vi.fn()}
          onStartEnglishRootFamily={vi.fn()}
          onStartGrammarRepairSet={vi.fn()}
          onStartMathRun={vi.fn()}
          onStartChineseRun={vi.fn()}
          onStartChineseListening={vi.fn()}
          onStartRadicalFamily={vi.fn()}
          onStartMeasureIdiomSet={vi.fn()}
          onStartChapterSeries={vi.fn()}
          onStartReadingRun={vi.fn()}
          onOpenCustomImporter={vi.fn()}
          onDeleteCustomSet={vi.fn()}
          onGoToMarket={vi.fn()}
        />
      </>,
    );

    // Strictly 1 semantic <h1>
    expect(container.querySelectorAll('h1').length).toBe(1);
    // Zero <form> or type="submit"
    expect(container.querySelectorAll('form, [type="submit"]').length).toBe(0);

    // Arcade Hall drawer toggles cleanly
    const arcadeBtn = screen.getByRole('button', { name: /Arcade Games \(5\)/i });
    expect(arcadeBtn.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(arcadeBtn);
    expect(arcadeBtn.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Tower Defense')).toBeTruthy();

    // TopBar subject menu opens and closes on Escape
    const subjectBtn = container.querySelector('header button[aria-haspopup="menu"]') as HTMLButtonElement;
    expect(subjectBtn.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(subjectBtn);
    expect(subjectBtn.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('keeps WeeklyAdventureBar collapsed by default, expands SVG island map, and enforces chest claim re-entry lock', () => {
    const weekDates = getWeekDateKeys('2026-11-25');
    let player = createInitialPlayerState('Chloe');
    player = recordAdventureStamp(player, weekDates[0], 'english');
    player = recordAdventureStamp(player, weekDates[1], 'math');
    player = recordAdventureStamp(player, weekDates[2], 'chinese');
    const onClaim = vi.fn();

    render(
      <WeeklyAdventureBar
        player={player}
        todayKey={weekDates[2]}
        isZh={false}
        onClaimMilestone={onClaim}
        onApplyMakeup={vi.fn()}
      />,
    );

    // Collapsed by default: no island SVG yet
    expect(screen.queryByRole('img', { name: /Treasure Adventure Map/i })).toBeNull();

    // Expand map
    fireEvent.click(screen.getByRole('button', { name: /Open Map/i }));
    expect(screen.getByRole('img', { name: /Treasure Adventure Map/i })).toBeTruthy();

    // Rapid double-click on 3-day Claim! chest fires onClaim strictly ONCE
    const claimBtn = screen.getByRole('button', { name: /^Claim!$/i });
    fireEvent.click(claimBtn);
    fireEvent.click(claimBtn);
    expect(onClaim).toHaveBeenCalledTimes(1);
    expect(onClaim).toHaveBeenCalledWith(3);
  });

  it('supports CritterRoomPanel 2.0 pet, treat feeding, bilingual pop-quiz re-entry lock, and 16 room stickers', () => {
    let player = createInitialPlayerState('Chloe');
    const starterId = player.equippedCollectibleId;
    player.vault[starterId] = 1;
    player.critterRoom = {
      themeId: 'strawberry-cafe',
      slots: [starterId, null, null, null, null, null, null, null],
      decorIds: [],
    };
    const todayKey = '2026-11-24';

    const onPet = vi.fn((cid: string) => {
      const res = petCritter(player, cid, todayKey);
      player = res.state;
      return res;
    });
    const onFeed = vi.fn((cid: string, treatId: 'boba' | 'daifuku' | 'cookie') => {
      const res = feedCritterTreat(player, cid, treatId, todayKey);
      player = res.state;
      return res;
    });
    const onPopQuiz = vi.fn((cid: string, isCorrect: boolean) => {
      const res = recordCritterPopQuizResult(player, cid, isCorrect, todayKey);
      player = res.state;
      return res;
    });

    const { container } = render(
      <CritterRoomPanel
        player={player}
        showZhuyin={false}
        onToggleZhuyin={vi.fn()}
        onUpdateRoomTheme={vi.fn()}
        onPlaceRoomCritter={vi.fn()}
        onToggleRoomDecor={vi.fn()}
        onPetCritter={onPet}
        onFeedCritterTreat={onFeed}
        onAnswerRoomPopQuiz={onPopQuiz}
      />,
    );

    // Zero <form> and displays 16 room decor stickers
    expect(container.querySelectorAll('form, [type="submit"]').length).toBe(0);
    expect(screen.getByText(/小屋擺飾貼紙（16 件）/)).toBeTruthy();

    // Tap placed critter in slot 0
    const placedSlotBtn = screen.getByRole('button', { name: /in Upper Left Shelf/i });
    fireEvent.click(placedSlotBtn);

    // Same-tick double-click on Pet fires strictly ONCE
    const petBtn = screen.getByRole('button', { name: /摸摸頭 Pet/i });
    fireEvent.click(petBtn);
    fireEvent.click(petBtn);
    expect(onPet).toHaveBeenCalledTimes(1);

    // Open bilingual pop-quiz bubble and double-click first choice -> fires strictly ONCE
    const quizBtn = screen.getByRole('button', { name: /夥伴出題考我/i });
    fireEvent.click(quizBtn);
    const quizContainer = screen.getByText(/驚喜小考/).closest('div')?.parentElement?.parentElement;
    expect(quizContainer).toBeTruthy();
    const choiceBtns = Array.from(quizContainer!.querySelectorAll('button')).filter(
      (b) => !/注音|再來一題/.test(b.textContent ?? '') && b.getAttribute('aria-label') !== 'Speak quiz word',
    );
    expect(choiceBtns.length).toBe(2);
    fireEvent.click(choiceBtns[0]);
    fireEvent.click(choiceBtns[0]);
    expect(onPopQuiz).toHaveBeenCalledTimes(1);
    expect(onFeed).toHaveBeenCalledTimes(0);
  });

  it('supports DeviceVoiceSyncPanel speech rate toggle, QV1 sync code generate/restore, and invalid code rejection with zero <form>', async () => {
    const player = createInitialPlayerState('Mia');
    player.tokens = 320;
    const onImportState = vi.fn();
    const onRecordBackup = vi.fn();
    const onChangeRate = vi.fn();

    const { container } = render(
      <DeviceVoiceSyncPanel
        player={player}
        onImportState={onImportState}
        onRecordBackup={onRecordBackup}
        onChangeSpeechRateMode={onChangeRate}
      />,
    );

    expect(container.querySelectorAll('form, [type="submit"]').length).toBe(0);

    // Toggle slow speech rate
    fireEvent.click(screen.getByRole('button', { name: /慢速練習 0\.82×/ }));
    expect(onChangeRate).toHaveBeenCalledWith('slow');

    // Generate portable sync code
    fireEvent.click(screen.getByRole('button', { name: /產生／複製同步短碼/ }));
    const codeBox = (await vi.waitFor(() =>
      screen.getByLabelText('Generated QuestVault sync code'),
    )) as HTMLTextAreaElement;
    expect(codeBox.value).toMatch(/^QV1[ZR]:[0-9a-f]{8}:/);
    expect(onRecordBackup).toHaveBeenCalledTimes(1);
    const validCode = codeBox.value;

    // Open restore box & reject invalid code safely
    fireEvent.click(screen.getByRole('button', { name: /貼上同步短碼還原/ }));
    const pasteBox = screen.getByLabelText('Paste QuestVault sync code') as HTMLTextAreaElement;
    fireEvent.change(pasteBox, { target: { value: 'QV1R:00000000:corrupted' } });
    fireEvent.click(screen.getByRole('button', { name: /立即驗證並還原進度/ }));
    await vi.waitFor(() => {
      expect(screen.getByText(/校驗失敗|格式不正確|損毀/)).toBeTruthy();
    });
    expect(onImportState).not.toHaveBeenCalled();

    // Paste valid generated code -> restores player cleanly & clears stale generated code box
    fireEvent.change(pasteBox, { target: { value: validCode } });
    fireEvent.click(screen.getByRole('button', { name: /立即驗證並還原進度/ }));
    await vi.waitFor(() => {
      expect(onImportState).toHaveBeenCalledTimes(1);
    });
    expect(onImportState.mock.calls[0][0].displayName).toBe('Mia');
    expect(onImportState.mock.calls[0][0].tokens).toBe(320);
    expect(screen.queryByLabelText('Generated QuestVault sync code')).toBeNull();
  });

  it('renders ClockMeasureQuestView with analog clock SVG, Zh hint toggle, re-entry lock, and zero <form>', () => {
    const unit = CLOCK_MEASURE_UNITS[0]; // clock-basic
    const onComplete = vi.fn();

    const { container } = render(
      <ClockMeasureQuestView
        unit={unit}
        equippedCollectibleId="critter-sprout-bunny"
        rewardPolicy={FULL_POLICY}
        onComplete={onComplete}
        onExit={vi.fn()}
        onGoToMarket={vi.fn()}
      />,
    );

    expect(container.querySelectorAll('form, [type="submit"]').length).toBe(0);
    expect(container.querySelectorAll('h1').length).toBe(1);
    expect(screen.getByRole('img', { name: /Analog clock/i })).toBeTruthy();

    // Toggle Traditional Chinese helper hint on/off
    const hintBtn = screen.getByRole('button', { name: /繁中提示：關/ });
    fireEvent.click(hintBtn);
    expect(screen.getByRole('button', { name: /繁中提示：開/ })).toBeTruthy();

    // Same-tick double-click on choice button triggers single answer evaluation (never double-completes)
    const choiceBtns = Array.from(container.querySelectorAll('section button')).filter(
      (b) => b.getAttribute('aria-label') !== 'Read question aloud',
    );
    expect(choiceBtns.length).toBe(4);
    fireEvent.click(choiceBtns[0]);
    fireEvent.click(choiceBtns[1]);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('renders ParentTrendSvg with isolated useId defs and DeviceVoiceSyncPanel sandbox-safe offline badge', () => {
    const emptyPlayer = createInitialPlayerState('Chloe');
    const emptyTrend = compute14DayTrend(emptyPlayer, '2026-03-05');

    const activePlayer = createInitialPlayerState('Chloe');
    activePlayer.runHistory = [
      {
        id: 'r1',
        subjectId: 'math',
        questSetId: 'clock-basic',
        questSetTitle: 'Clock Basic',
        completedAt: new Date(2026, 2, 5, 11, 0, 0).toISOString(),
        accuracyPct: 90,
        maxCombo: 5,
        tokensEarned: 35,
      },
      {
        id: 'r2',
        subjectId: 'english',
        questSetId: 'en-t1-action-heroes',
        questSetTitle: 'Action Heroes',
        completedAt: new Date(2026, 2, 4, 15, 0, 0).toISOString(),
        accuracyPct: 100,
        maxCombo: 6,
        tokensEarned: 35,
      },
    ];
    const activeTrend = compute14DayTrend(activePlayer, '2026-03-05');

    const { container } = render(
      <>
        <ParentTrendSvg trend={emptyTrend} />
        <ParentTrendSvg trend={activeTrend} />
        <DeviceVoiceSyncPanel player={activePlayer} />
      </>,
    );

    expect(container.querySelectorAll('form, [type="submit"]').length).toBe(0);
    // Two charts rendered concurrently must have distinct linearGradient IDs (zero static SVG ID collision)
    const gradIds = Array.from(container.querySelectorAll('linearGradient')).map((g) => g.id);
    expect(gradIds.length).toBe(2);
    expect(new Set(gradIds).size).toBe(2);
    // Empty state callout shows on empty chart, polyline shows on populated chart
    expect(screen.getByText(/近 14 天尚無闖關紀錄/)).toBeTruthy();
    expect(container.querySelectorAll('svg path').length).toBeGreaterThanOrEqual(1);
    // Offline badge safely degrades in happy-dom / strict sandbox without throwing
    expect(screen.getByTestId('pwa-offline-status-badge').textContent).toContain('離線');
  });

  it('auto-pilots HomeView Hero CTA with Weekly Focus badge and renders ClockMeasureSvg in Mistake Clinic', () => {
    const player = createInitialPlayerState('Chloe');
    player.weeklyFocusTracks = ['clock-measure'];
    player.wordMastery = recordWordOutcome(player.wordMastery, {
      word: 'Clock: Read 3:15',
      subjectId: 'math',
      tier: 1,
      outcome: 'missed',
    });

    const onStartClockMeasure = vi.fn();
    const { unmount } = render(
      <HomeView
        player={player}
        activeSubjectId="english"
        activeTier={1}
        placementCompleted={false}
        showZhuyin={false}
        onSelectSubject={vi.fn()}
        onSelectTier={vi.fn()}
        onToggleZhuyin={vi.fn()}
        onStartPlacement={vi.fn()}
        onStartBlitz={vi.fn()}
        onStartCafe={vi.fn()}
        onStartFishing={vi.fn()}
        onStartBossBattle={vi.fn()}
        onStartTowerDefense={vi.fn()}
        onOpenLogicLab={vi.fn()}
        onOpenMixedWarmup={vi.fn()}
        onClaimDailyQuest={vi.fn()}
        onStartEnglishRun={vi.fn()}
        onStartEnglishRootFamily={vi.fn()}
        onStartGrammarRepairSet={vi.fn()}
        onStartMathRun={vi.fn()}
        onStartClockMeasureUnit={onStartClockMeasure}
        onStartChineseRun={vi.fn()}
        onStartChineseListening={vi.fn()}
        onStartRadicalFamily={vi.fn()}
        onStartMeasureIdiomSet={vi.fn()}
        onStartChapterSeries={vi.fn()}
        onStartReadingRun={vi.fn()}
        onOpenCustomImporter={vi.fn()}
        onDeleteCustomSet={vi.fn()}
        onGoToMarket={vi.fn()}
      />,
    );

    const badge = screen.getByTestId('hero-focus-badge');
    expect(badge.textContent).toContain('Weekly Focus');
    fireEvent.click(badge.closest('button') as HTMLButtonElement);
    expect(onStartClockMeasure).toHaveBeenCalledTimes(1);
    expect(onStartClockMeasure.mock.calls[0][0].id).toBe('clock-basic');
    unmount();

    // Mistake Clinic renders ClockMeasureSvg for missed Clock & Measure skill
    const { container } = render(
      <MixedWarmupView
        mode="mistake-clinic"
        player={player}
        showZhuyin={false}
        onToggleZhuyin={vi.fn()}
        onComplete={vi.fn(() => ({
          tokensAwarded: 15,
          healedCount: 1,
          alreadyClaimedToday: false,
          passed: true,
        }))}
        onSwitchMode={vi.fn()}
        onExit={vi.fn()}
        onGoToMarket={vi.fn()}
      />,
    );

    expect(container.querySelectorAll('form, [type="submit"]').length).toBe(0);
    expect(screen.getByTestId('clinic-clock-measure-visual')).toBeTruthy();
  });

  it('renders us-money SVG with unique useId defs and supports Chinese tap-to-read highlight & stopSpeech cleanup', () => {
    // 1. Concurrent us-money SVGs must have isolated useId gradient IDs and zero spoiler total
    const moneySpec = {
      kind: 'us-money' as const,
      bills: [1, 5] as (1 | 5 | 10)[],
      coins: ['quarter', 'nickel', 'penny', 'dime'] as ('quarter' | 'dime' | 'nickel' | 'penny')[],
      mode: 'count' as const,
    };
    const { container: moneyContainer, unmount: unmountMoney } = render(
      <>
        <MathVisual spec={moneySpec} />
        <MathVisual spec={moneySpec} />
      </>,
    );
    const defsIds = Array.from(
      moneyContainer.querySelectorAll('radialGradient, linearGradient'),
    ).map((el) => el.id);
    expect(defsIds.length).toBe(6);
    expect(new Set(defsIds).size).toBe(6);
    expect(moneyContainer.textContent).toContain('$5');
    expect(moneyContainer.textContent).toContain('25¢');
    expect(moneyContainer.textContent).not.toContain('$6.41'); // zero spoiler!
    unmountMoney();

    // 2. Chinese ReadingRunView tap-any-sentence warm-yellow highlight + auto read-along + unmount cleanup
    vi.useFakeTimers();
    const speakSpy = vi
      .spyOn(audioService, 'speak')
      .mockImplementation((_text, _lang, _rate, callbacks) => {
        callbacks?.onEnd?.();
      });
    const stopSpy = vi.spyOn(audioService, 'stopSpeech').mockImplementation(() => {});

    try {
      const zhSet = CHINESE_READING_QUESTS[0];
      const { container, unmount } = render(
        <ReadingRunView
          questSet={zhSet}
          equippedCollectibleId="critter-sprout-bunny"
          showZhuyin={false}
          rewardPolicy={FULL_POLICY}
          onToggleZhuyin={vi.fn()}
          onExit={vi.fn()}
          onCompleteReading={vi.fn()}
          onGoToMarket={vi.fn()}
        />,
      );

      expect(container.querySelectorAll('form, [type="submit"]').length).toBe(0);
      expect(container.querySelectorAll('h1').length).toBe(1);

      // Tap sentence 0 when speech does NOT immediately end -> warm yellow highlight stays active
      speakSpy.mockImplementationOnce(() => {});
      const s0 = screen.getByTestId('zh-sentence-btn-0');
      fireEvent.click(s0);
      expect(s0.getAttribute('aria-pressed')).toBe('true');
      expect(s0.className).toContain('bg-[#FEF08A]');
      expect(speakSpy).toHaveBeenCalledWith(
        zhSet.passages[0].sentences[0],
        'zh-TW',
        0.94,
        expect.any(Object),
      );

      // Start sequential auto read-along -> advances from sentence 0 to sentence 1 after 260ms pause
      const toggleBtn = screen.getByTestId('zh-readalong-toggle');
      fireEvent.click(toggleBtn);
      expect(toggleBtn.textContent).toContain('停止跟讀');
      vi.advanceTimersByTime(300);
      expect(speakSpy.mock.calls.some((c) => c[0] === zhSet.passages[0].sentences[1])).toBe(true);

      // Clicking Read Question during active auto read-along must stop read-along cleanly (never stuck!)
      fireEvent.click(screen.getByRole('button', { name: '朗讀題目' }));
      expect(toggleBtn.textContent).toContain('逐句自動跟讀');
      expect(s0.getAttribute('aria-pressed')).toBe('false');

      // Unmount triggers audioService.stopSpeech() cleanly
      stopSpy.mockClear();
      unmount();
      expect(stopSpy).toHaveBeenCalled();
    } finally {
      speakSpy.mockRestore();
      stopSpy.mockRestore();
    }
  });
});







// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { exportPlayerStateJson } from '../../src/core/repository';
import { createInitialPlayerState, getQuestRewardPolicy } from '../../src/core/economy';
import { COLLECTIBLES, MYSTERY_PACKS } from '../../src/core/packs';
import { BUILTIN_LOOK_ALIKE_SETS } from '../../src/subjects/chinese/lookAlikeSets';
import { BUILTIN_FIGURATIVE_SETS } from '../../src/subjects/english/figurativeSets';
import { BUILTIN_MATH_SETS } from '../../src/subjects/math/questSets';
import { FigurativeLabView } from '../../src/ui/views/FigurativeLabView';
import { HomeView } from '../../src/ui/views/HomeView';
import { LookAlikeHanziView } from '../../src/ui/views/LookAlikeHanziView';
import { MarketView } from '../../src/ui/views/MarketView';
import { MathRunView } from '../../src/ui/views/MathRunView';
import { PlacementView } from '../../src/ui/views/PlacementView';
import { VaultView } from '../../src/ui/views/VaultView';
import { WritingLogView } from '../../src/ui/views/WritingLogView';
import { getWeekDateKeys, recordAdventureStamp } from '../../src/core/adventureMap';
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
});

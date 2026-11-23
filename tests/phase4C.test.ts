import { describe, expect, it } from 'vitest';
import {
  BOSS_ROSTER,
  calculateBossAttackDamage,
  calculateBossVictoryTokens,
  getDefaultBossForTier,
  resolveDefaultBossSquad,
} from '../src/core/bossBattleEngine';
import {
  ARCADE_DAILY_TOKEN_CAP,
  awardBossSessionRewards,
  awardCafeSessionRewards,
  CRITTER_ROOM_SLOT_COUNT,
  createInitialPlayerState,
  placeCritterInRoomSlot,
  updateCritterRoomTheme,
} from '../src/core/economy';
import { COLLECTIBLES } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { CRITTER_ROOM_THEMES, ROOM_SLOT_POSITIONS } from '../src/ui/artwork/CritterRoomArt';

describe('Phase 4C: Critter Boss Battle & My Critter Room', () => {
  it('defines 4 unique original bosses mapped across Tiers 1-4', () => {
    expect(BOSS_ROSTER).toHaveLength(4);
    const ids = new Set(BOSS_ROSTER.map((b) => b.id));
    expect(ids.size).toBe(4);
    expect(getDefaultBossForTier(1).id).toBe('slime-king');
    expect(getDefaultBossForTier(2).id).toBe('typo-kraken');
    expect(getDefaultBossForTier(3).id).toBe('chaos-dragon');
    expect(getDefaultBossForTier(4).id).toBe('ink-owl');
  });

  it('resolves 3-critter battle squad from favorites -> owned -> guest buddies without duplicates', () => {
    const c1 = COLLECTIBLES[0].id;
    const c2 = COLLECTIBLES[1].id;
    const c3 = COLLECTIBLES[2].id;
    const c4 = COLLECTIBLES[3].id;

    // Empty vault falls back to 3 distinct guest buddies
    const guestSquad = resolveDefaultBossSquad({}, []);
    expect(guestSquad).toHaveLength(3);
    expect(new Set(guestSquad).size).toBe(3);

    // Favorites prioritized, then owned vault
    const squad = resolveDefaultBossSquad(
      { [c1]: 1, [c2]: 2, [c3]: 1, [c4]: 1 },
      [c3, c1],
    );
    expect(squad[0]).toBe(c3);
    expect(squad[1]).toBe(c1);
    expect(squad).toHaveLength(3);
    expect(new Set(squad).size).toBe(3);
  });

  it('computes Boss Battle damage with Shiny bonus and 2x Team Ultimate on every 3rd combo hit', () => {
    const hit1 = calculateBossAttackDamage(1, 0);
    expect(hit1.damage).toBe(24);
    expect(hit1.isUltimate).toBe(false);

    const hit2Shiny = calculateBossAttackDamage(2, 2);
    expect(hit2Shiny.shinyBonus).toBe(8);
    expect(hit2Shiny.damage).toBe(24 + 3 + 8);
    expect(hit2Shiny.isUltimate).toBe(false);

    const hit3Ult = calculateBossAttackDamage(3, 3);
    expect(hit3Ult.isUltimate).toBe(true);
    expect(hit3Ult.shinyBonus).toBe(12);
    // (24 + 6 + 12) * 2 = 84
    expect(hit3Ult.damage).toBe(84);

    const hit6Ult = calculateBossAttackDamage(6, 0);
    expect(hit6Ult.isUltimate).toBe(true);
    // comboBonus capped at 12 -> (24 + 12) * 2 = 72
    expect(hit6Ult.damage).toBe(72);
  });

  it('bounds Boss Victory raw tokens between 20 and 50 and enforces shared daily 150-token arcade cap', () => {
    for (const boss of BOSS_ROSTER) {
      const perfect = calculateBossVictoryTokens(boss, 8, 8);
      const rough = calculateBossVictoryTokens(boss, 5, 20);
      expect(perfect).toBeGreaterThanOrEqual(20);
      expect(perfect).toBeLessThanOrEqual(50);
      expect(rough).toBeGreaterThanOrEqual(20);
      expect(rough).toBeLessThanOrEqual(perfect);
    }

    const today = '2026-11-23';
    let state = createInitialPlayerState();
    // Spend 130 tokens of the shared arcade daily pool via Boba Café first
    const cafeRes = awardCafeSessionRewards(state, 'english', 200, 130, today);
    expect(cafeRes.tokensAwarded).toBe(130);
    state = cafeRes.state;

    // Boss Battle tries to award 45, should be capped to remaining 20
    const bossRes = awardBossSessionRewards(state, 'math', 420, 45, today);
    expect(bossRes.tokensAwarded).toBe(ARCADE_DAILY_TOKEN_CAP - 130);
    expect(bossRes.remainingDailyCap).toBe(0);
    expect(bossRes.state.bossHighScores?.math).toBe(420);

    // Another Boss Battle on the same day awards 0 tokens, but still tracks higher score
    const bossRes2 = awardBossSessionRewards(bossRes.state, 'math', 510, 40, today);
    expect(bossRes2.tokensAwarded).toBe(0);
    expect(bossRes2.state.bossHighScores?.math).toBe(510);
  });

  it('supports My Critter Room themes, 8 tap-to-place slots, moving without duplicates, and rejects unowned critters', () => {
    expect(CRITTER_ROOM_THEMES).toHaveLength(8);
    expect(ROOM_SLOT_POSITIONS).toHaveLength(CRITTER_ROOM_SLOT_COUNT);

    const ownedA = COLLECTIBLES[0].id;
    const ownedB = COLLECTIBLES[1].id;
    const unownedC = COLLECTIBLES[2].id;

    let state = createInitialPlayerState();
    state = { ...state, vault: { [ownedA]: 1, [ownedB]: 2 } };

    // Theme switch
    state = updateCritterRoomTheme(state, 'starlight-attic');
    expect(state.critterRoom?.themeId).toBe('starlight-attic');

    // Reject unowned critter (returns unchanged state)
    const rejected = placeCritterInRoomSlot(state, 0, unownedC);
    expect(rejected).toBe(state);
    expect(rejected.critterRoom?.slots[0]).toBeNull();

    // Place ownedA in slot 0 and ownedB in slot 4
    const p1 = placeCritterInRoomSlot(state, 0, ownedA);
    const p2 = placeCritterInRoomSlot(p1, 4, ownedB);
    expect(p2.critterRoom?.slots[0]).toBe(ownedA);
    expect(p2.critterRoom?.slots[4]).toBe(ownedB);

    // Moving ownedA from slot 0 -> slot 7 vacates slot 0
    const moved = placeCritterInRoomSlot(p2, 7, ownedA);
    expect(moved.critterRoom?.slots[0]).toBeNull();
    expect(moved.critterRoom?.slots[7]).toBe(ownedA);

    // Removing ownedB from slot 4 sets it to null
    const cleared = placeCritterInRoomSlot(moved, 4, null);
    expect(cleared.critterRoom?.slots[4]).toBeNull();
  });

  it('preserves Boss Battle scores & Critter Room through v1 JSON backup/restore and sanitizes invalid room data', () => {
    const ownedA = COLLECTIBLES[0].id;
    const unownedB = COLLECTIBLES[5].id;

    let state = createInitialPlayerState();
    state = { ...state, vault: { [ownedA]: 1 } };
    state = updateCritterRoomTheme(state, 'fairy-treehouse');
    state = placeCritterInRoomSlot(state, 2, ownedA);
    state = awardBossSessionRewards(state, 'chinese', 640, 35, '2026-11-23').state;

    const json = exportPlayerStateJson(state);
    const restored = importPlayerStateJson(json);
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;

    expect(restored.state.bossHighScores?.chinese).toBe(640);
    expect(restored.state.critterRoom?.themeId).toBe('fairy-treehouse');
    expect(restored.state.critterRoom?.slots[2]).toBe(ownedA);

    // Tampered payload with unowned critter, duplicate critter, and invalid theme should sanitize cleanly
    const parsed = JSON.parse(json);
    parsed.critterRoom = {
      themeId: 'non-existent-theme',
      slots: [ownedA, ownedA, unownedB, null, null, null, null, null, ownedA],
    };
    const sanitized = importPlayerStateJson(JSON.stringify(parsed));
    expect(sanitized.ok).toBe(true);
    if (!sanitized.ok) return;
    expect(sanitized.state.critterRoom?.themeId).toBe('strawberry-cafe');
    expect(sanitized.state.critterRoom?.slots).toHaveLength(8);
    expect(sanitized.state.critterRoom?.slots[0]).toBe(ownedA);
    expect(sanitized.state.critterRoom?.slots[1]).toBeNull(); // duplicate stripped
    expect(sanitized.state.critterRoom?.slots[2]).toBeNull(); // unowned stripped
  });
});

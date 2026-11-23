import { describe, expect, it } from 'vitest';
import {
  craftShinyCollectible,
  CRITTER_ROOM_MAX_DECOR,
  createInitialPlayerState,
  openMysteryPack,
  placeCritterInRoomSlot,
  toggleCritterRoomDecor,
  updateCritterRoomTheme,
} from '../src/core/economy';
import {
  COLLECTIBLES,
  getCollectiblesByPack,
  MYSTERY_PACKS,
  PACK_CATEGORIES,
} from '../src/core/packs';
import {
  PHASE6_COLLECTIBLES,
  PHASE6_ENVELOPE_THEMES,
  PHASE6_PACK_IDS,
  PHASE6_PACKS,
} from '../src/core/packsPhase6';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { CRITTER_ROOM_THEMES, ROOM_DECOR_ITEMS } from '../src/core/roomCatalog';
import type { PlayerState } from '../src/core/types';
import { ROOM_SLOT_POSITIONS } from '../src/ui/artwork/CritterRoomArt';
import { renderPhase6Collectible } from '../src/ui/artwork/phase6Collectibles';

const FORBIDDEN_IP_RE =
  /\b(pokemon|pikachu|sanrio|hello\s*kitty|kuromi|cinnamoroll|disney|elsa|mickey|barbie|minecraft|roblox|squishmallow|labubu|pop\s*mart)\b/i;

describe('Phase 6B Layer 1 — +6 Original Mystery Packs (48 SVGs, 44 Packs / 358 Total) & Room Upgrade', () => {
  it('ships 6 new original packs (48 collectibles -> 44 packs / 358 total) with full rarity curves and 0 IP risks', () => {
    expect(PHASE6_PACKS).toHaveLength(6);
    expect(PHASE6_COLLECTIBLES).toHaveLength(48);
    expect(MYSTERY_PACKS).toHaveLength(44);
    expect(COLLECTIBLES).toHaveLength(358);
    expect(PACK_CATEGORIES.find((c) => c.id === 'all')?.label).toBe('All 44');

    const allIds = new Set(COLLECTIBLES.map((c) => c.id));
    expect(allIds.size).toBe(358);
    // Ensure all Phase 6B collectible names are unique against the entire 358-item catalog
    const allNames = new Set(COLLECTIBLES.map((c) => c.name.trim().toLowerCase()));
    expect(allNames.size).toBe(358);

    const validCategories = new Set(PACK_CATEGORIES.map((c) => c.id));
    for (const packId of PHASE6_PACK_IDS) {
      const pack = PHASE6_PACKS.find((p) => p.id === packId);
      expect(pack).toBeDefined();
      expect(validCategories.has(pack!.category)).toBe(true);
      expect(PHASE6_ENVELOPE_THEMES[packId]).toBeDefined();
      expect(FORBIDDEN_IP_RE.test(`${pack!.name} ${pack!.subtitle}`)).toBe(false);

      const items = getCollectiblesByPack(packId);
      expect(items, `Pack ${packId} must have 8 collectibles`).toHaveLength(8);
      expect(items.filter((i) => i.rarity === 'common')).toHaveLength(2);
      expect(items.filter((i) => i.rarity === 'uncommon')).toHaveLength(2);
      expect(items.filter((i) => i.rarity === 'rare')).toHaveLength(1);
      expect(items.filter((i) => i.rarity === 'epic')).toHaveLength(1);
      expect(items.filter((i) => i.rarity === 'legendary')).toHaveLength(1);
      expect(items.filter((i) => i.rarity === 'chroma')).toHaveLength(1);

      for (const item of items) {
        expect(FORBIDDEN_IP_RE.test(`${item.name} ${item.tagline}`)).toBe(false);
        expect(renderPhase6Collectible(item.id, 'qa')).not.toBeNull();
      }
    }

    expect(renderPhase6Collectible('non-existent-id', 'qa')).toBeNull();
  });

  it('supports opening all 6 new packs and crafting Shiny variants on Phase 6B critters', () => {
    let state = { ...createInitialPlayerState('Mia'), tokens: 500 };

    for (const packId of PHASE6_PACK_IDS) {
      const openRes = openMysteryPack(state, packId, () => 0.12);
      expect(openRes.ok).toBe(true);
      if (!openRes.ok) continue;
      expect(openRes.collectible.packId).toBe(packId);
      state = openRes.state;
    }

    // Craft Shiny on a Phase 6B critter once 3 copies are owned
    const bobaId = 'nightmarket-pearl-boba';
    state = { ...state, vault: { ...state.vault, [bobaId]: 3 } };
    const shinyRes = craftShinyCollectible(state, bobaId);
    expect(shinyRes.ok).toBe(true);
    if (!shinyRes.ok) return;
    expect(shinyRes.state.shinyVault?.[bobaId]).toBe(true);
  });

  it('expands My Critter Room to 8 free themes and 12 non-overlapping decor stickers (max 6 active) with v1 JSON roundtrip', () => {
    expect(CRITTER_ROOM_THEMES).toHaveLength(8);
    expect(ROOM_DECOR_ITEMS).toHaveLength(12);
    expect(new Set(ROOM_DECOR_ITEMS.map((d) => d.id)).size).toBe(12);

    // Verify every decor coordinate maintains clear separation from all 8 critter slot centers
    // AND fits safely inside the mobile 16:10 visible SVG slice [40, 760] with margin
    for (const decor of ROOM_DECOR_ITEMS) {
      expect(decor.x).toBeGreaterThanOrEqual(58);
      expect(decor.x).toBeLessThanOrEqual(740);
      expect(decor.y).toBeGreaterThanOrEqual(36);
      expect(decor.y).toBeLessThanOrEqual(420);
      for (const slot of ROOM_SLOT_POSITIONS) {
        const sx = (slot.leftPct / 100) * 800;
        const sy = (slot.topPct / 100) * 450;
        const dist = Math.hypot(decor.x - sx, decor.y - sy);
        expect(
          dist,
          `Decor ${decor.id} (${decor.x},${decor.y}) too close to slot ${slot.slotIndex} (${sx},${sy})`,
        ).toBeGreaterThanOrEqual(75);
      }
    }

    const ownedId = 'nightmarket-pearl-boba';
    let state: PlayerState = {
      ...createInitialPlayerState('Mia'),
      vault: { 'critter-sprout-bunny': 1, [ownedId]: 1 },
    };

    // Switch across the 4 brand-new themes
    for (const newTheme of [
      'sakura-teahouse',
      'rainbow-cloud-castle',
      'coral-pearl-palace',
      'winter-cocoa-igloo',
    ] as const) {
      state = updateCritterRoomTheme(state, newTheme);
      expect(state.critterRoom?.themeId).toBe(newTheme);
    }

    // Place a critter and toggle 6 decor stickers on
    state = placeCritterInRoomSlot(state, 0, ownedId);
    for (let i = 0; i < CRITTER_ROOM_MAX_DECOR; i += 1) {
      state = toggleCritterRoomDecor(state, ROOM_DECOR_ITEMS[i].id);
    }
    expect(state.critterRoom?.decorIds).toHaveLength(CRITTER_ROOM_MAX_DECOR);

    // 7th decor is ignored while at cap; invalid ID is ignored
    const atCap = toggleCritterRoomDecor(state, ROOM_DECOR_ITEMS[6].id);
    expect(atCap.critterRoom?.decorIds).toHaveLength(CRITTER_ROOM_MAX_DECOR);
    const badDecor = toggleCritterRoomDecor(state, 'decor-hacked');
    expect(badDecor.critterRoom?.decorIds).toHaveLength(CRITTER_ROOM_MAX_DECOR);

    // Theme switch & slot placement preserve decorIds
    state = updateCritterRoomTheme(state, 'sakura-teahouse');
    expect(state.critterRoom?.decorIds).toHaveLength(CRITTER_ROOM_MAX_DECOR);
    state = placeCritterInRoomSlot(state, 1, 'critter-sprout-bunny');
    expect(state.critterRoom?.decorIds).toHaveLength(CRITTER_ROOM_MAX_DECOR);

    // Toggling an active decor off removes it cleanly
    state = toggleCritterRoomDecor(state, ROOM_DECOR_ITEMS[0].id);
    expect(state.critterRoom?.decorIds).toHaveLength(CRITTER_ROOM_MAX_DECOR - 1);

    // v1 JSON backup/restore preserves theme, slots, and decorIds and sanitizes tampered payloads
    const json = exportPlayerStateJson(state);
    const restored = importPlayerStateJson(json);
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;
    expect(restored.state.critterRoom?.themeId).toBe('sakura-teahouse');
    expect(restored.state.critterRoom?.slots[0]).toBe(ownedId);
    expect(restored.state.critterRoom?.decorIds).toEqual(state.critterRoom?.decorIds);

    // Legacy v1 JSON without decorIds or without critterRoom restores cleanly
    const legacyNoDecor = JSON.parse(json);
    delete legacyNoDecor.critterRoom.decorIds;
    const restoredNoDecor = importPlayerStateJson(JSON.stringify(legacyNoDecor));
    expect(restoredNoDecor.ok).toBe(true);
    if (!restoredNoDecor.ok) return;
    expect(restoredNoDecor.state.critterRoom?.decorIds).toBeUndefined();

    const legacyNoRoom = JSON.parse(json);
    delete legacyNoRoom.critterRoom;
    const restoredNoRoom = importPlayerStateJson(JSON.stringify(legacyNoRoom));
    expect(restoredNoRoom.ok).toBe(true);
    if (!restoredNoRoom.ok) return;
    expect(restoredNoRoom.state.critterRoom).toBeUndefined();

    // Tampered payload with duplicates, >6 items, invalid IDs & invalid theme falls back cleanly
    const tampered = JSON.parse(json);
    tampered.critterRoom = {
      themeId: 'invalid-room',
      slots: [ownedId, null, null, null, null, null, null, null],
      decorIds: [
        'decor-boba-lamp',
        'decor-boba-lamp',
        'decor-bad',
        ...ROOM_DECOR_ITEMS.map((d) => d.id),
      ],
    };
    const sanitized = importPlayerStateJson(JSON.stringify(tampered));
    expect(sanitized.ok).toBe(true);
    if (!sanitized.ok) return;
    expect(sanitized.state.critterRoom?.themeId).toBe('strawberry-cafe');
    expect(sanitized.state.critterRoom?.decorIds).toHaveLength(CRITTER_ROOM_MAX_DECOR);
    expect(sanitized.state.critterRoom?.decorIds).not.toContain('decor-bad');
  });
});

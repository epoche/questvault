import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  createInitialPlayerState,
  openMysteryPack,
  setPinnedWishlistPack,
} from '../src/core/economy';
import {
  COLLECTIBLES,
  getCollectiblesByPack,
  MYSTERY_PACKS,
  PACK_CATEGORIES,
} from '../src/core/packs';
import {
  PHASE8_COLLECTIBLES,
  PHASE8_ENVELOPE_THEMES,
  PHASE8_PACK_IDS,
  PHASE8_PACKS,
} from '../src/core/packsPhase8';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { renderPhase8Collectible } from '../src/ui/artwork/phase8Collectibles';

const FORBIDDEN_IP_RE =
  /pokemon|pikachu|sanrio|hello kitty|kuromi|cinnamoroll|disney|elsa|frozen|marvel|spiderman|harry potter|minecraft|roblox|barbie|lego|nintendo|mario|kirby/i;

describe('Phase 8C Layer 1 — +4 Science & Logic Packs (32 SVGs -> 48 Packs / 390 Total) + Pinned Wishlist Pack', () => {
  it('ships 4 new original packs (32 collectibles -> 48 packs / 390 total) with globally unique IDs & names, full rarity curves, and 0 IP risks', () => {
    expect(PHASE8_PACKS).toHaveLength(4);
    expect(PHASE8_COLLECTIBLES).toHaveLength(32);
    expect(MYSTERY_PACKS).toHaveLength(48);
    expect(COLLECTIBLES).toHaveLength(390);
    expect(PACK_CATEGORIES.find((c) => c.id === 'all')?.label).toBe('All 48');

    const allIds = new Set(COLLECTIBLES.map((c) => c.id));
    expect(allIds.size).toBe(390);

    const allNames = new Set(COLLECTIBLES.map((c) => c.name.trim().toLowerCase()));
    expect(allNames.size).toBe(390);

    for (const packId of PHASE8_PACK_IDS) {
      const items = getCollectiblesByPack(packId);
      expect(items).toHaveLength(8);
      const counts = items.reduce<Record<string, number>>((acc, item) => {
        acc[item.rarity] = (acc[item.rarity] ?? 0) + 1;
        return acc;
      }, {});
      expect(counts).toEqual({
        common: 2,
        uncommon: 2,
        rare: 1,
        epic: 1,
        legendary: 1,
        chroma: 1,
      });

      const theme = PHASE8_ENVELOPE_THEMES[packId];
      expect(theme).toBeDefined();
      expect(items.some((i) => i.id === theme.emblem)).toBe(true);
    }

    for (const item of PHASE8_COLLECTIBLES) {
      expect(FORBIDDEN_IP_RE.test(item.name)).toBe(false);
      expect(FORBIDDEN_IP_RE.test(item.tagline)).toBe(false);
    }
  });

  it('renders valid SVG markup for all 32 Phase 8C collectibles with uid-scoped def IDs, zero dangling url(#...) refs, and zero external URLs', () => {
    const uid = 'uidcheck8c';
    for (const item of PHASE8_COLLECTIBLES) {
      const node = renderPhase8Collectible(item.id, uid);
      expect(node).not.toBeNull();
      const markup = renderToStaticMarkup(React.createElement('svg', { viewBox: '0 0 100 100' }, node));
      expect(markup.length).toBeGreaterThan(60);
      expect(/<form|type="submit"|https?:\/\//i.test(markup)).toBe(false);

      const definedIds = new Set<string>();
      for (const m of markup.matchAll(/\bid="([^"]+)"/g)) {
        const defId = m[1];
        expect(defId.startsWith(uid), `${item.id}: def id "${defId}" must be uid-scoped`).toBe(true);
        expect(definedIds.has(defId), `${item.id}: duplicate def id "${defId}"`).toBe(false);
        definedIds.add(defId);
      }

      for (const m of markup.matchAll(/url\(#([^)]+)\)/g)) {
        const refId = m[1];
        expect(definedIds.has(refId), `${item.id}: dangling url(#${refId})`).toBe(true);
      }
    }
    expect(renderPhase8Collectible('unknown-id-999', uid)).toBeNull();
  });

  it('opens all 4 new Phase 8C packs cleanly and persists pinnedWishlistPackId with v1 JSON backward compatibility', () => {
    let state = { ...createInitialPlayerState('Chloe'), tokens: 200 };

    for (const packId of PHASE8_PACK_IDS) {
      const res = openMysteryPack(state, packId, () => 0.42);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.collectible.packId).toBe(packId);
        state = res.state;
      }
    }

    // Pin & persist valid pack
    const pinned = setPinnedWishlistPack(state, 'sciencelab');
    expect(pinned.pinnedWishlistPackId).toBe('sciencelab');

    const json = exportPlayerStateJson(pinned);
    const parsed = importPlayerStateJson(json);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.state.pinnedWishlistPackId).toBe('sciencelab');
    }

    // Invalid pack ID in imported JSON is safely stripped
    const tampered = JSON.parse(json);
    tampered.pinnedWishlistPackId = 'fake-pack-xyz';
    const reparsed = importPlayerStateJson(JSON.stringify(tampered));
    expect(reparsed.ok).toBe(true);
    if (reparsed.ok) {
      expect(reparsed.state.pinnedWishlistPackId).toBeUndefined();
    }

    // Unpin removes field cleanly
    const unpinned = setPinnedWishlistPack(pinned, undefined);
    expect(unpinned.pinnedWishlistPackId).toBeUndefined();
  });
});

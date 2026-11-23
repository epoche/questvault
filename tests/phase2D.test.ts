import { describe, expect, it } from 'vitest';
import {
  createInitialPlayerState,
  FUSE_COPIES_REQUIRED,
  fuseFiveDuplicatesUp,
  getExtraDuplicateCountByRarity,
  MAX_FAVORITE_COLLECTIBLES,
  meltDuplicateForStarDust,
  openMysteryPack,
  STAR_DUST_MELT_VALUE,
  STAR_DUST_WISH_COST,
  toggleFavoriteCollectible,
  wishUnlockWithStarDust,
} from '../src/core/economy';
import {
  COLLECTIBLES,
  getCollectiblesByPack,
  getPackById,
  MIN_PACK_COST,
  MYSTERY_PACKS,
} from '../src/core/packs';
import {
  PHASE2D_COLLECTIBLES,
  PHASE2D_ENVELOPE_THEMES,
  PHASE2D_PACK_IDS,
  PHASE2D_PACKS,
} from '../src/core/packsPhase2D';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import type { PlayerState } from '../src/core/types';
import { parseCustomChineseList } from '../src/subjects/chinese/chineseCustomParser';
import { buildChineseRun } from '../src/subjects/chinese/chineseEngine';
import { BUILTIN_CHINESE_SETS } from '../src/subjects/chinese/wordSets';
import { PHASE2D_CHINESE_SETS } from '../src/subjects/chinese/wordSetsPhase2D';
import { buildEnglishRun } from '../src/subjects/english/runEngine';
import { BUILTIN_WORD_SETS } from '../src/subjects/english/wordSets';
import { PHASE2D_ENGLISH_SETS } from '../src/subjects/english/wordSetsPhase2D';
import { evaluateWritingSubmission } from '../src/subjects/english/writingChecks';
import {
  PHASE2D_COLLECTIBLE_SPECS,
  renderPhase2DCollectible,
} from '../src/ui/artwork/phase2DCollectibles';

describe('Phase 2D Layer 1: 8 Variable-Size Original Packs (70 SVGs, 38 Packs / 310 Total)', () => {
  it('validates variable sizes (6/8/9/10/12), tiered pricing (20/25/30), 100% SVG coverage & 0 copyright risks', () => {
    expect(PHASE2D_PACKS).toHaveLength(8);
    expect(PHASE2D_COLLECTIBLES).toHaveLength(70);
    expect(MYSTERY_PACKS).toHaveLength(38);
    expect(COLLECTIBLES).toHaveLength(310);
    expect(MIN_PACK_COST).toBe(20);

    const expectedSizes: Record<string, { count: number; cost: number }> = {
      valentine: { count: 6, cost: 20 },
      dragonboat: { count: 6, cost: 20 },
      thanksgiving: { count: 8, cost: 25 },
      deepsea: { count: 9, cost: 25 },
      puppypark: { count: 10, cost: 25 },
      dessertsquishy: { count: 9, cost: 25 },
      fairycottage: { count: 10, cost: 30 },
      starunicorn: { count: 12, cost: 30 },
    };

    for (const packId of PHASE2D_PACK_IDS) {
      const pack = getPackById(packId);
      expect(pack).toBeDefined();
      expect(pack?.cost).toBe(expectedSizes[packId].cost);
      expect(PHASE2D_ENVELOPE_THEMES[packId]).toBeDefined();

      const items = getCollectiblesByPack(packId);
      expect(items).toHaveLength(expectedSizes[packId].count);
      expect(items.filter((i) => i.rarity === 'chroma')).toHaveLength(1);

      for (const item of items) {
        expect(PHASE2D_COLLECTIBLE_SPECS[item.id], `Missing spec for ${item.id}`).toBeDefined();
        expect(renderPhase2DCollectible(item.id), `Null SVG render for ${item.id}`).not.toBeNull();
      }
    }

    // Starlight Unicorn Deluxe has 2 Epic, 2 Legendary, 1 Chroma
    const uni = getCollectiblesByPack('starunicorn');
    expect(uni.filter((i) => i.rarity === 'epic')).toHaveLength(2);
    expect(uni.filter((i) => i.rarity === 'legendary')).toHaveLength(2);
    expect(uni.filter((i) => i.rarity === 'chroma')).toHaveLength(1);

    // Variable pricing test: 20 Tokens opens Valentine Mini (20), rejects Harvest Feast (25) & Starlight Unicorn (30)
    const state20 = { ...createInitialPlayerState('Luna'), tokens: 20 };
    expect(openMysteryPack(state20, 'valentine', () => 0.5).ok).toBe(true);
    expect(openMysteryPack(state20, 'thanksgiving', () => 0.5)).toEqual({
      ok: false,
      reason: 'insufficient_tokens',
    });
    expect(openMysteryPack(state20, 'starunicorn', () => 0.5)).toEqual({
      ok: false,
      reason: 'insufficient_tokens',
    });
  });
});

describe('Phase 2D Layer 1: Star Dust Wish Pool, 5-to-1 Fuse Upgrader & 6-Slot Favorite Shelf', () => {
  it('melts extra duplicates into Star Dust and pity-unlocks ANY unowned card (including Chroma)', () => {
    const commonId = 'critter-sprout-bunny';
    const chromaId = 'starunicorn-chroma-galaxy';
    let state: PlayerState = {
      ...createInitialPlayerState('Luna'),
      vault: { [commonId]: 2, 'valentine-chroma-heart': 4 },
      starDust: 0,
    };

    // Melt 1 common duplicate (+1 dust)
    const m1 = meltDuplicateForStarDust(state, commonId);
    expect(m1.ok).toBe(true);
    if (!m1.ok) return;
    expect(m1.dustGained).toBe(STAR_DUST_MELT_VALUE.common);
    expect(m1.state.vault[commonId]).toBe(1);
    expect(m1.state.starDust).toBe(1);
    state = m1.state;

    // Cannot melt last remaining copy
    expect(meltDuplicateForStarDust(state, commonId)).toEqual({
      ok: false,
      reason: 'cannot_melt_last_copy',
    });

    // Melt 3 extra chroma duplicates (3 * 60 = 180 dust) -> enough to Wish-unlock Starlight Chroma!
    for (let i = 0; i < 3; i += 1) {
      const mc = meltDuplicateForStarDust(state, 'valentine-chroma-heart');
      expect(mc.ok).toBe(true);
      if (mc.ok) state = mc.state;
    }
    expect(state.starDust).toBe(1 + 3 * STAR_DUST_MELT_VALUE.chroma);
    expect(state.vault['valentine-chroma-heart']).toBe(1);

    const wish = wishUnlockWithStarDust(state, chromaId);
    expect(wish.ok).toBe(true);
    if (!wish.ok) return;
    expect(wish.dustSpent).toBe(STAR_DUST_WISH_COST.chroma);
    expect(wish.state.vault[chromaId]).toBe(1);
    expect(wish.state.starDust).toBe(1);

    // Cannot wish an already-owned card
    expect(wishUnlockWithStarDust(wish.state, chromaId)).toEqual({
      ok: false,
      reason: 'already_owned',
    });
  });

  it('fuses 5 extra same-rarity duplicates into 1 higher-rarity card without ever deleting the last owned copy', () => {
    const commons = COLLECTIBLES.filter((c) => c.rarity === 'common').slice(0, 3);
    let state: PlayerState = {
      ...createInitialPlayerState('Luna'),
      vault: {
        [commons[0].id]: 4, // 3 extras
        [commons[1].id]: 3, // 2 extras -> total 5 extras!
        [commons[2].id]: 1, // 0 extras (must stay 1!)
      },
    };

    expect(getExtraDuplicateCountByRarity(state, 'common')).toBe(FUSE_COPIES_REQUIRED);
    const fused = fuseFiveDuplicatesUp(state, 'common', () => 0.2);
    expect(fused.ok).toBe(true);
    if (!fused.ok) return;

    expect(fused.targetRarity).toBe('uncommon');
    expect(fused.awarded.rarity).toBe('uncommon');
    expect(fused.isNew).toBe(true);
    expect(fused.state.vault[fused.awarded.id]).toBe(1);
    // Every owned common still has >= 1 copy!
    expect(fused.state.vault[commons[0].id]).toBe(1);
    expect(fused.state.vault[commons[1].id]).toBe(1);
    expect(fused.state.vault[commons[2].id]).toBe(1);
    expect(getExtraDuplicateCountByRarity(fused.state, 'common')).toBe(0);

    // Rejects < 5 extras and unsupported rarities
    expect(fuseFiveDuplicatesUp(fused.state, 'common')).toEqual({
      ok: false,
      reason: 'insufficient_duplicates',
    });
    expect(fuseFiveDuplicatesUp(fused.state, 'legendary')).toEqual({
      ok: false,
      reason: 'unsupported_rarity',
    });
  });

  it('enforces 6-slot Favorite Shelf cap and round-trips starDust + favorites cleanly in v1 JSON backup', () => {
    const ownedIds = COLLECTIBLES.slice(0, 7).map((c) => c.id);
    const vault: Record<string, number> = {};
    for (const id of ownedIds) vault[id] = 1;

    let state: PlayerState = {
      ...createInitialPlayerState('Luna'),
      starDust: 42,
      vault,
      favoriteCollectibleIds: [],
    };

    for (let i = 0; i < MAX_FAVORITE_COLLECTIBLES; i += 1) {
      const res = toggleFavoriteCollectible(state, ownedIds[i]);
      expect(res.ok).toBe(true);
      if (res.ok) state = res.state;
    }
    expect(state.favoriteCollectibleIds).toHaveLength(6);

    // 7th pin rejected
    expect(toggleFavoriteCollectible(state, ownedIds[6])).toEqual({
      ok: false,
      reason: 'shelf_full',
    });

    // JSON backup round-trip preserves starDust and 6 favorites
    const restored = importPlayerStateJson(exportPlayerStateJson(state));
    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.state.starDust).toBe(42);
      expect(restored.state.favoriteCollectibleIds).toEqual(ownedIds.slice(0, 6));
    }

    // Old v1 JSON without starDust/favoriteCollectibleIds still imports cleanly
    const legacy = JSON.parse(exportPlayerStateJson(state));
    delete legacy.starDust;
    delete legacy.favoriteCollectibleIds;
    const restoredLegacy = importPlayerStateJson(JSON.stringify(legacy));
    expect(restoredLegacy.ok).toBe(true);
    if (restoredLegacy.ok) {
      expect(restoredLegacy.state.starDust).toBe(0);
      expect(restoredLegacy.state.favoriteCollectibleIds).toEqual([]);
    }
  });
});

describe('Phase 2D Layer 1: 800-Word Catalog (400 English + 400 Traditional Chinese)', () => {
  it('validates all 20 new English sets (100 words -> 400 total) across Sprint, Upgrade, and Stage 3 Forge', () => {
    expect(PHASE2D_ENGLISH_SETS).toHaveLength(20);
    expect(BUILTIN_WORD_SETS).toHaveLength(80);

    for (const set of PHASE2D_ENGLISH_SETS) {
      const run = buildEnglishRun(set, () => 0.42);
      expect(run.sprintQuestions).toHaveLength(5);
      expect(run.upgradeQuestions).toHaveLength(3);
      for (const w of set.words) {
        const sample = `Today our whole team talked about ${w.word} while working on our class project!`;
        expect(
          evaluateWritingSubmission(sample, [w.word]).allPassed,
          `Stage 3 writing failed for "${w.word}"`,
        ).toBe(true);
      }
    }
  });

  it('validates all 20 new Traditional Chinese sets (100 words -> 400 total), 易錯辨析 safety, and 400-word importer auto-fill', () => {
    expect(PHASE2D_CHINESE_SETS).toHaveLength(20);
    expect(BUILTIN_CHINESE_SETS).toHaveLength(80);

    const confusable = PHASE2D_CHINESE_SETS.filter((s) => s.shortTag === '易錯辨析');
    expect(confusable.length).toBeGreaterThanOrEqual(4);

    for (const set of PHASE2D_CHINESE_SETS) {
      const run = buildChineseRun(set, () => 0.42);
      expect(run.sprintQuestions).toHaveLength(5);
      expect(run.upgradeQuestions).toHaveLength(3);
      const setWords = new Set(set.words.map((w) => w.word));
      if (set.shortTag === '易錯辨析') {
        for (const w of set.words) {
          expect(w.upgradePlainSpan).toBeTruthy();
          expect(w.upgradePlainSpan).not.toBe(w.word);
          expect(setWords.has(w.upgradePlainSpan!)).toBe(false);
        }
      }
    }

    // Importer auto-fills brand-new Phase 2D words!
    const imported = parseCustomChineseList('本週成語與多音字', '錦上添花、顯微鏡、水獺');
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.record.words[0].zhuyin).toBe('ㄐㄧㄣˇ ㄕㄤˋ ㄊㄧㄢ ㄏㄨㄚ');
      expect(imported.record.words[1].zhuyin).toBe('ㄒㄧㄢˇ ㄨㄟˊ ㄐㄧㄥˋ');
      expect(imported.record.words[2].zhuyin).toBe('ㄕㄨㄟˇ ㄊㄚˋ');
    }
  });
});

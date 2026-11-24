import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from '../src/core/achievements';
import { COLLECTIBLES, getCollectiblesByPack, MYSTERY_PACKS, PACK_CATEGORIES } from '../src/core/packs';
import { BUILTIN_CHAPTER_SERIES } from '../src/subjects/chinese/chapterStories';
import { BUILTIN_ENGLISH_CHAPTER_SERIES } from '../src/subjects/english/englishChapterStories';
import { ALL_LOGIC_MODULES } from '../src/subjects/logic/logicTypes';

/**
 * Single Source of Truth for global catalog totals & cross-catalog structural invariants.
 * When adding future packs/achievements/series, update ONLY this file (not 6 old phase files!).
 */
describe('Global Catalog Invariants (Single Source of Truth)', () => {
  it('maintains exact global catalog counts and dynamic All-N category label', () => {
    expect(MYSTERY_PACKS).toHaveLength(48);
    expect(COLLECTIBLES).toHaveLength(390);
    expect(PACK_CATEGORIES.find((c) => c.id === 'all')?.label).toBe(`All ${MYSTERY_PACKS.length}`);
    expect(ACHIEVEMENTS).toHaveLength(38);
    expect(BUILTIN_CHAPTER_SERIES).toHaveLength(8);
    expect(BUILTIN_ENGLISH_CHAPTER_SERIES).toHaveLength(4);
    expect(ALL_LOGIC_MODULES).toHaveLength(8);
  });

  it('guarantees globally unique pack IDs, collectible IDs, collectible names, and achievement IDs', () => {
    expect(new Set(MYSTERY_PACKS.map((p) => p.id)).size).toBe(MYSTERY_PACKS.length);
    expect(new Set(COLLECTIBLES.map((c) => c.id)).size).toBe(COLLECTIBLES.length);
    expect(new Set(COLLECTIBLES.map((c) => c.name.trim().toLowerCase())).size).toBe(
      COLLECTIBLES.length,
    );
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);

    for (const pack of MYSTERY_PACKS) {
      const items = getCollectiblesByPack(pack.id);
      expect(items.length).toBeGreaterThanOrEqual(6);
      expect(items.filter((i) => i.rarity === 'chroma')).toHaveLength(1);
    }
  });
});

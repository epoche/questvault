import { describe, expect, it } from 'vitest';
import {
  calculateForgeChestTokens,
  calculateQuestionTokens,
  createInitialPlayerState,
  equipCollectibleAvatar,
  openMysteryPack,
  sellDuplicateCollectible,
} from '../src/core/economy';
import { PACK_COST, STARTER_COLLECTIBLE_ID } from '../src/core/packs';

describe('QuestVault Economy Seam', () => {
  it('calculates escalating Token payouts with Combo streaks up to a cap', () => {
    expect(calculateQuestionTokens(4, 0)).toBe(4);
    expect(calculateQuestionTokens(4, 1)).toBe(5);
    expect(calculateQuestionTokens(4, 3)).toBe(7);
    expect(calculateQuestionTokens(4, 10)).toBe(9);
  });

  it('awards a generous Writer Forge Token Chest on completed checks', () => {
    expect(calculateForgeChestTokens(4, 4)).toBe(25);
    expect(calculateForgeChestTokens(3, 4)).toBe(15);
    expect(calculateForgeChestTokens(0, 4)).toBe(0);
  });

  it('opens a Mystery Pack, deducts 25 Tokens, and records a new Collectible in the Vault', () => {
    const start = { ...createInitialPlayerState('Maya'), tokens: 30 };
    // rng = 0.995 falls in the Chroma slice (top 0.8%)
    const outcome = openMysteryPack(start, 'critter', () => 0.995);

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    expect(outcome.state.tokens).toBe(30 - PACK_COST);
    expect(outcome.collectible.packId).toBe('critter');
    expect(outcome.collectible.rarity).toBe('chroma');
    expect(outcome.isNew).toBe(true);
    expect(outcome.state.vault[outcome.collectible.id]).toBe(1);
  });

  it('rejects opening a Mystery Pack when Tokens are below PACK_COST', () => {
    const broke = { ...createInitialPlayerState('Maya'), tokens: 10 };
    const outcome = openMysteryPack(broke, 'sweet', () => 0.2);

    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.reason).toBe('insufficient_tokens');
  });

  it('marks repeat pulls as duplicates and allows selling only extra copies', () => {
    const start = {
      ...createInitialPlayerState('Maya'),
      tokens: 50,
      vault: {
        [STARTER_COLLECTIBLE_ID]: 1,
        'critter-sun-phoenix': 2,
      },
    };

    const sold = sellDuplicateCollectible(start, 'critter-sun-phoenix');
    expect(sold.ok).toBe(true);
    if (!sold.ok) return;
    expect(sold.tokensRefunded).toBe(75);
    expect(sold.state.tokens).toBe(125);
    expect(sold.state.vault['critter-sun-phoenix']).toBe(1);

    // Attempting to sell the last remaining copy is blocked
    const blocked = sellDuplicateCollectible(sold.state, 'critter-sun-phoenix');
    expect(blocked.ok).toBe(false);
  });

  it('equips only owned Collectibles as the Player avatar', () => {
    const start = {
      ...createInitialPlayerState('Maya'),
      vault: {
        [STARTER_COLLECTIBLE_ID]: 1,
        'space-astro-corgi': 1,
      },
    };

    const equipped = equipCollectibleAvatar(start, 'space-astro-corgi');
    expect(equipped.equippedCollectibleId).toBe('space-astro-corgi');

    const unchanged = equipCollectibleAvatar(equipped, 'space-chroma-narwhal');
    expect(unchanged.equippedCollectibleId).toBe('space-astro-corgi');
  });

  it('guarantees the very first Mystery Pack pull is always a brand-new Collectible (never starter Clover Bunny)', () => {
    const fresh = { ...createInitialPlayerState('Maya'), tokens: 25 };
    // rng = 0 normally hits the first common item in Critter Pack (Clover Bunny)
    const outcome = openMysteryPack(fresh, 'critter', () => 0);

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    expect(outcome.isNew).toBe(true);
    expect(outcome.collectible.id).not.toBe(STARTER_COLLECTIBLE_ID);
    expect(outcome.state.vault[outcome.collectible.id]).toBe(1);
  });
});

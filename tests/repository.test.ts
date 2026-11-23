import { describe, expect, it } from 'vitest';
import { createInitialPlayerState } from '../src/core/economy';
import {
  createLocalStorageRepository,
  exportPlayerStateJson,
  importPlayerStateJson,
  type KeyValueStorage,
} from '../src/core/repository';

function createMemoryStorage(): KeyValueStorage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
}

describe('PlayerRepository Seam', () => {
  it('returns starter PlayerState when storage is empty', () => {
    const repo = createLocalStorageRepository(createMemoryStorage());
    const state = repo.load();
    expect(state.version).toBe(1);
    expect(state.tokens).toBe(25);
    expect(state.vault[state.equippedCollectibleId]).toBe(1);
  });

  it('persists and reloads PlayerState cleanly', () => {
    const storage = createMemoryStorage();
    const repo = createLocalStorageRepository(storage);
    const updated = {
      ...createInitialPlayerState('Chloe'),
      tokens: 140,
      vault: {
        'critter-sprout-bunny': 1,
        'critter-chroma-dragon': 1,
      },
    };

    repo.save(updated);
    const reloaded = repo.load();
    expect(reloaded.displayName).toBe('Chloe');
    expect(reloaded.tokens).toBe(140);
    expect(reloaded.vault['critter-chroma-dragon']).toBe(1);
  });

  it('round-trips JSON export and import, and rejects corrupted payloads', () => {
    const original = {
      ...createInitialPlayerState('Chloe'),
      tokens: 85,
    };

    const json = exportPlayerStateJson(original);
    const imported = importPlayerStateJson(json);
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.state.displayName).toBe('Chloe');
      expect(imported.state.tokens).toBe(85);
    }

    const badJson = importPlayerStateJson('{not valid json');
    expect(badJson.ok).toBe(false);

    const wrongShape = importPlayerStateJson(JSON.stringify({ hello: 'world' }));
    expect(wrongShape.ok).toBe(false);
  });

  it('survives sandboxed iframes where accessing window.localStorage throws SecurityError', () => {
    const originalWindow = (globalThis as { window?: unknown }).window;
    const throwingWindow = {};
    Object.defineProperty(throwingWindow, 'localStorage', {
      get() {
        throw new DOMException(
          "Failed to read the 'localStorage' property from 'Window': The document is sandboxed.",
          'SecurityError',
        );
      },
    });
    (globalThis as { window?: unknown }).window = throwingWindow;

    try {
      const repo = createLocalStorageRepository();
      const initial = repo.load();
      expect(initial.tokens).toBe(25);
      repo.save({ ...initial, tokens: 99 });
      expect(repo.load().tokens).toBe(99);
    } finally {
      (globalThis as { window?: unknown }).window = originalWindow;
    }
  });
});

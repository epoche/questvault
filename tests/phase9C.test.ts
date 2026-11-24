import { describe, expect, it } from 'vitest';
import { hashParentPin } from '../src/core/analytics';
import {
  computeEffectiveSpeechRate,
  selectPreferredVoice,
  type VoiceLike,
} from '../src/core/audio';
import { createInitialPlayerState } from '../src/core/economy';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  computeFnv1aHex,
  decodeSyncCode,
  encodeSyncCode,
  SYNC_CODE_GZIP_PREFIX,
  SYNC_CODE_RAW_PREFIX,
} from '../src/core/syncCode';

describe('Phase 9C — iPad Voice Selection, Speech Rate & Serverless Portable Sync Code', () => {
  it('selects natural iPad/Safari zh-TW and en-US voices and avoids zh-CN when zh-TW exists', () => {
    const ipadVoices: VoiceLike[] = [
      { name: 'Ting-Ting', lang: 'zh-CN', localService: true },
      { name: 'Sin-ji', lang: 'zh-HK', localService: true },
      { name: 'Mei-Jia', lang: 'zh-TW', localService: true },
      { name: 'Daniel', lang: 'en-GB', localService: true },
      { name: 'Alex', lang: 'en-US', localService: true },
      { name: 'Samantha', lang: 'en-US', localService: true },
    ];

    expect(selectPreferredVoice(ipadVoices, 'zh-TW')?.name).toBe('Mei-Jia');
    expect(selectPreferredVoice(ipadVoices, 'en-US')?.name).toBe('Samantha');

    const chromeVoices: VoiceLike[] = [
      { name: 'Google 普通话（中国大陆）', lang: 'zh-CN', localService: false },
      { name: 'Google 國語（臺灣）', lang: 'zh-TW', localService: false },
      { name: 'Google US English', lang: 'en-US', localService: false },
    ];
    expect(selectPreferredVoice(chromeVoices, 'zh-TW')?.name).toBe('Google 國語（臺灣）');
    expect(selectPreferredVoice(chromeVoices, 'en-US')?.name).toBe('Google US English');

    // Empty or unavailable voice list returns null safely
    expect(selectPreferredVoice([], 'zh-TW')).toBeNull();
    expect(selectPreferredVoice([], 'en-US')).toBeNull();
  });

  it('computes safely clamped speech rates for normal (1.0x) and slow (0.82x) modes', () => {
    expect(computeEffectiveSpeechRate(0.94, 'normal')).toBe(0.94);
    expect(computeEffectiveSpeechRate(0.94, 'slow')).toBe(0.77);
    expect(computeEffectiveSpeechRate(0.5, 'slow')).toBe(0.55); // floor clamped
    expect(computeEffectiveSpeechRate(5, 'normal')).toBe(1.3); // ceiling clamped
    expect(computeEffectiveSpeechRate(Number.NaN, 'slow')).toBe(0.77);
  });

  it('round-trips PlayerState via both QV1Z (gzip) and QV1R (raw fallback), strips parentPinHash, and tolerates whitespace', async () => {
    const state = createInitialPlayerState('Chloe');
    state.tokens = 245;
    state.starDust = 60;
    state.speechRateMode = 'slow';
    state.parentPinHash = hashParentPin('1234');
    state.critterFriendship = { [state.equippedCollectibleId]: { xp: 14, lastPetDate: '2026-11-24' } };

    // 1. Compressed QV1Z (when CompressionStream is available in Node 22)
    const gzipCode = await encodeSyncCode(state);
    expect(gzipCode.startsWith(`${SYNC_CODE_GZIP_PREFIX}:`)).toBe(true);
    // Insert line breaks & spaces like Line/iMessage copy-paste
    const wrapped = `${gzipCode.slice(0, 20)}\n  ${gzipCode.slice(20, 60)}\t${gzipCode.slice(60)}`;
    const decodedGzip = await decodeSyncCode(wrapped);
    expect(decodedGzip.ok).toBe(true);
    if (decodedGzip.ok) {
      expect(decodedGzip.format).toBe('gzip');
      expect(decodedGzip.state.displayName).toBe('Chloe');
      expect(decodedGzip.state.tokens).toBe(245);
      expect(decodedGzip.state.speechRateMode).toBe('slow');
      expect(decodedGzip.state.critterFriendship?.[state.equippedCollectibleId]?.xp).toBe(14);
      // Security: parentPinHash must NEVER leak into portable sync code
      expect(decodedGzip.state.parentPinHash).toBeUndefined();
    }

    // 2. Uncompressed fallback QV1R
    const rawCode = await encodeSyncCode(state, { forceRaw: true });
    expect(rawCode.startsWith(`${SYNC_CODE_RAW_PREFIX}:`)).toBe(true);
    const decodedRaw = await decodeSyncCode(rawCode);
    expect(decodedRaw.ok).toBe(true);
    if (decodedRaw.ok) {
      expect(decodedRaw.format).toBe('raw');
      expect(decodedRaw.state.tokens).toBe(245);
      expect(decodedRaw.state.parentPinHash).toBeUndefined();
    }
  });

  it('strictly rejects tampered checksums, corrupted payloads, and invalid speechRateMode values', async () => {
    const state = createInitialPlayerState('Chloe');
    const rawCode = await encodeSyncCode(state, { forceRaw: true });
    const [prefix, checksum, payload] = rawCode.split(':');

    // Tamper checksum
    const badChecksum = checksum === '00000000' ? '11111111' : '00000000';
    const res1 = await decodeSyncCode(`${prefix}:${badChecksum}:${payload}`);
    expect(res1.ok).toBe(false);

    // Tamper payload character
    const flippedChar = payload[0] === 'A' ? 'B' : 'A';
    const res2 = await decodeSyncCode(`${prefix}:${checksum}:${flippedChar}${payload.slice(1)}`);
    expect(res2.ok).toBe(false);

    // Corrupted gzip stream with valid-looking prefix & checksum format
    const res3 = await decodeSyncCode(`${SYNC_CODE_GZIP_PREFIX}:deadbeef:notvalidgzipdata`);
    expect(res3.ok).toBe(false);

    // Garbage / empty / wrong prefix
    expect((await decodeSyncCode('')).ok).toBe(false);
    expect((await decodeSyncCode('QV2:deadbeef:abc')).ok).toBe(false);
    expect((await decodeSyncCode('hello world')).ok).toBe(false);

    // Checksum determinism
    expect(computeFnv1aHex('questvault')).toMatch(/^[0-9a-f]{8}$/);

    // Repository sanitization for speechRateMode (v1 backward compat + invalid value rejection)
    const exported = JSON.parse(exportPlayerStateJson(state));
    exported.speechRateMode = 'turbo-invalid';
    const imported = importPlayerStateJson(JSON.stringify(exported));
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.state.speechRateMode).toBeUndefined();
    }
  });
});

import { exportPlayerStateJson, importPlayerStateJson } from './repository';
import type { PlayerState } from './types';

export const SYNC_CODE_GZIP_PREFIX = 'QV1Z';
export const SYNC_CODE_RAW_PREFIX = 'QV1R';
const MAX_SYNC_CODE_LENGTH = 260_000;
const MAX_DECOMPRESSED_BYTES = 1_200_000;
const CHECKSUM_RE = /^[0-9a-f]{8}$/;

/**
 * Computes an 8-hex-character FNV-1a 32-bit checksum over UTF-8 bytes of `input`.
 */
export function computeFnv1aHex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i += 1) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(b64url: string): Uint8Array | null {
  if (!b64url || !/^[A-Za-z0-9_-]+$/.test(b64url)) return null;
  try {
    const padLen = (4 - (b64url.length % 4)) % 4;
    const base64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLen);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

async function gzipBytes(bytes: Uint8Array): Promise<Uint8Array | null> {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    const cs = new CompressionStream('gzip');
    const writer = cs.writable.getWriter();
    const writePromise = writer.write(bytes as unknown as BufferSource).then(() => writer.close());
    const reader = cs.readable.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        total += value.byteLength;
      }
    }
    await writePromise;
    const out = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      out.set(c, offset);
      offset += c.byteLength;
    }
    return out;
  } catch {
    return null;
  }
}

async function gunzipBytes(bytes: Uint8Array): Promise<Uint8Array | null> {
  if (typeof DecompressionStream === 'undefined') return null;
  try {
    const ds = new DecompressionStream('gzip');
    const writer = ds.writable.getWriter();
    const writePromise = writer
      .write(bytes as unknown as BufferSource)
      .then(() => writer.close())
      .catch(() => {});
    const reader = ds.readable.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > MAX_DECOMPRESSED_BYTES) {
          await reader.cancel().catch(() => {});
          return null;
        }
        chunks.push(value);
      }
    }
    await writePromise;
    const out = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      out.set(c, offset);
      offset += c.byteLength;
    }
    return out;
  } catch {
    return null;
  }
}

/**
 * Encodes a PlayerState into a serverless portable sync code (`QV1Z:...` gzip or `QV1R:...` fallback).
 * Always strips `parentPinHash` via `exportPlayerStateJson` and attaches an FNV-1a integrity checksum.
 */
export async function encodeSyncCode(
  state: PlayerState,
  options?: { forceRaw?: boolean },
): Promise<string> {
  // Compact JSON (exportPlayerStateJson strips parentPinHash cleanly)
  const prettyJson = exportPlayerStateJson(state);
  const compactJson = JSON.stringify(JSON.parse(prettyJson));
  const checksum = computeFnv1aHex(compactJson);
  const utf8Bytes = new TextEncoder().encode(compactJson);

  if (!options?.forceRaw) {
    const compressed = await gzipBytes(utf8Bytes);
    if (compressed && compressed.byteLength < utf8Bytes.byteLength) {
      return `${SYNC_CODE_GZIP_PREFIX}:${checksum}:${bytesToBase64Url(compressed)}`;
    }
  }
  return `${SYNC_CODE_RAW_PREFIX}:${checksum}:${bytesToBase64Url(utf8Bytes)}`;
}

export type SyncCodeDecodeResult =
  | { ok: true; state: PlayerState; format: 'gzip' | 'raw' }
  | { ok: false; error: string };

/**
 * Decodes and strictly verifies a QuestVault portable sync code (`QV1Z:...` or `QV1R:...`).
 * Verifies prefix, Base64URL syntax, gzip stream, FNV-1a checksum BEFORE parsing JSON,
 * and runs full `importPlayerStateJson` sanitization for v1 backward compatibility.
 */
export async function decodeSyncCode(rawInput: string): Promise<SyncCodeDecodeResult> {
  if (typeof rawInput !== 'string') {
    return { ok: false, error: '請貼上有效的 QuestVault 同步短碼（QV1Z:... 或 QV1R:...）。' };
  }
  const cleaned = rawInput.replace(/\s+/g, '');
  if (!cleaned) {
    return { ok: false, error: '同步短碼是空的，請先貼上完整短碼再按還原。' };
  }
  if (cleaned.length > MAX_SYNC_CODE_LENGTH) {
    return { ok: false, error: '同步短碼長度超過安全上限，請確認沒有貼到多餘文字。' };
  }

  const parts = cleaned.split(':');
  if (parts.length !== 3) {
    return {
      ok: false,
      error: '同步短碼格式不正確，開頭應為 QV1Z: 或 QV1R:（共 3 段以冒號分隔）。',
    };
  }

  const [prefix, expectedChecksum, payloadB64] = parts;
  if (prefix !== SYNC_CODE_GZIP_PREFIX && prefix !== SYNC_CODE_RAW_PREFIX) {
    return { ok: false, error: '不支援的同步短碼版本，請確認開頭為 QV1Z: 或 QV1R:。' };
  }
  if (!CHECKSUM_RE.test(expectedChecksum)) {
    return { ok: false, error: '同步短碼校驗碼格式不正確，可能未完整複製。' };
  }

  const payloadBytes = base64UrlToBytes(payloadB64);
  if (!payloadBytes || payloadBytes.byteLength === 0) {
    return { ok: false, error: '同步短碼內容損毀或字元不完整，請重新複製完整短碼。' };
  }

  let jsonBytes: Uint8Array;
  let format: 'gzip' | 'raw';

  if (prefix === SYNC_CODE_GZIP_PREFIX) {
    const decompressed = await gunzipBytes(payloadBytes);
    if (!decompressed || decompressed.byteLength === 0) {
      return {
        ok: false,
        error: '無法解壓縮同步短碼（短碼可能不完整，或此瀏覽器不支援 gzip 解壓）。',
      };
    }
    jsonBytes = decompressed;
    format = 'gzip';
  } else {
    if (payloadBytes.byteLength > MAX_DECOMPRESSED_BYTES) {
      return { ok: false, error: '同步短碼資料量超過上限，已拒絕匯入。' };
    }
    jsonBytes = payloadBytes;
    format = 'raw';
  }

  let jsonText: string;
  try {
    jsonText = new TextDecoder('utf-8', { fatal: true }).decode(jsonBytes);
  } catch {
    return { ok: false, error: '同步短碼字元編碼損毀，請重新複製完整短碼。' };
  }

  const actualChecksum = computeFnv1aHex(jsonText);
  if (actualChecksum !== expectedChecksum) {
    return {
      ok: false,
      error: '同步短碼校驗失敗（可能漏字或被修改），已取消還原以保護現有進度。',
    };
  }

  const imported = importPlayerStateJson(jsonText);
  if (!imported.ok) {
    return { ok: false, error: `同步短碼內容無法還原：${imported.error}` };
  }

  return { ok: true, state: imported.state, format };
}

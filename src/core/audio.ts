import type { Rarity, SpeechRateMode } from './types';

export const SPEECH_RATE_MULTIPLIER: Record<SpeechRateMode, number> = {
  normal: 1.0,
  slow: 0.82,
};

export interface VoiceLike {
  name: string;
  lang: string;
  default?: boolean;
  localService?: boolean;
}

const ZH_TW_PREFERRED_NAMES = [
  'meijia',
  'mei-jia',
  'yating',
  'google 國語（臺灣）',
  'google 國語(臺灣)',
  'google 國語',
  'hsiaochen',
  'hsiaoyu',
  'han-han',
  'hanhan',
  'zhiwei',
];

const EN_US_PREFERRED_NAMES = [
  'samantha',
  'ava',
  'allison',
  'nicky',
  'zoe',
  'google us english',
  'aria',
  'jenny',
];

function normalizeLangTag(lang: string): string {
  return lang.trim().toLowerCase().replace(/_/g, '-');
}

function isTaiwanMandarinVoice(v: VoiceLike): boolean {
  const lang = normalizeLangTag(v.lang);
  const name = v.name.toLowerCase();
  if (lang === 'zh-tw' || lang.startsWith('zh-tw-') || lang.startsWith('zh-hant-tw')) {
    return true;
  }
  if (
    lang.startsWith('zh-hant') &&
    !lang.includes('hk') &&
    !lang.includes('mo') &&
    !name.includes('cantonese') &&
    !name.includes('sinji') &&
    !name.includes('sin-ji')
  ) {
    return true;
  }
  return (
    lang.startsWith('zh') &&
    (name.includes('taiwan') || name.includes('臺灣') || name.includes('台灣') || name.includes('meijia') || name.includes('mei-jia'))
  );
}

/**
 * Deterministically ranks available Web Speech API voices for iPad / Safari / Chrome.
 * - `zh-TW`: prioritizes Meijia / Mei-Jia / Yating / Google 國語（臺灣） and avoids zh-CN when any zh-TW voice exists.
 * - `en-US`: prioritizes Samantha / Ava / Allison / Nicky / Google US English.
 */
export function selectPreferredVoice<T extends VoiceLike>(
  voices: readonly T[],
  targetLang: string,
): T | null {
  if (!voices || voices.length === 0) return null;
  const normTarget = normalizeLangTag(targetLang);

  if (normTarget.startsWith('zh')) {
    const twVoices = voices.filter(isTaiwanMandarinVoice);
    if (twVoices.length > 0) {
      for (const kw of ZH_TW_PREFERRED_NAMES) {
        const hit = twVoices.find((v) => v.name.toLowerCase().includes(kw));
        if (hit) return hit;
      }
      return twVoices.find((v) => v.localService) ?? twVoices[0];
    }
    const anyZh = voices.filter((v) => normalizeLangTag(v.lang).startsWith('zh'));
    if (anyZh.length > 0) {
      return anyZh.find((v) => v.localService) ?? anyZh[0];
    }
    return null;
  }

  if (normTarget.startsWith('en')) {
    const usVoices = voices.filter((v) => {
      const l = normalizeLangTag(v.lang);
      return l === 'en-us' || l.startsWith('en-us-');
    });
    if (usVoices.length > 0) {
      for (const kw of EN_US_PREFERRED_NAMES) {
        const hit = usVoices.find((v) => v.name.toLowerCase().includes(kw));
        if (hit) return hit;
      }
      return usVoices.find((v) => v.localService) ?? usVoices[0];
    }
    const anyEn = voices.filter((v) => normalizeLangTag(v.lang).startsWith('en'));
    if (anyEn.length > 0) {
      return anyEn.find((v) => v.localService) ?? anyEn[0];
    }
    return null;
  }

  const exact = voices.find((v) => normalizeLangTag(v.lang) === normTarget);
  return exact ?? null;
}

/**
 * Computes final Web Speech utterance rate with safe clamping [0.55, 1.3].
 */
export function computeEffectiveSpeechRate(baseRate: number, mode: SpeechRateMode): number {
  const safeBase = Number.isFinite(baseRate) && baseRate > 0 ? baseRate : 0.94;
  const mult = SPEECH_RATE_MULTIPLIER[mode] ?? 1.0;
  const raw = safeBase * mult;
  return Math.max(0.55, Math.min(1.3, Math.round(raw * 100) / 100));
}

export interface SpeakCallbacks {
  onEnd?: () => void;
  onError?: () => void;
  onCancel?: () => void;
}

export interface AudioService {
  setMuted(muted: boolean): void;
  setSpeechRateMode(mode: SpeechRateMode): void;
  getSpeechRateMode(): SpeechRateMode;
  speak(text: string, lang?: string, rate?: number, callbacks?: SpeakCallbacks): void;
  stopSpeech(): void;
  playCorrect(combo: number): void;
  playNudge(): void;
  playChest(): void;
  playPackShake(): void;
  playPackReveal(rarity: Rarity): void;
  playToken(): void;
}

class BrowserAudioService implements AudioService {
  private ctx: AudioContext | null = null;
  private muted = false;
  private speechRateMode: SpeechRateMode = 'normal';
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private voicesListenerAttached = false;
  private speechToken = 0;
  private activeCancelHandler: (() => void) | null = null;

  constructor() {
    this.ensureVoicesLoaded();
  }

  private flushActiveCancel(): void {
    const cancel = this.activeCancelHandler;
    this.activeCancelHandler = null;
    if (!cancel) return;
    try {
      cancel();
    } catch {
      // Ignore callback error
    }
  }

  private ensureVoicesLoaded(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const synth = window.speechSynthesis;
      const list = synth.getVoices();
      if (Array.isArray(list) && list.length > 0) {
        this.cachedVoices = list;
      }
      if (!this.voicesListenerAttached) {
        this.voicesListenerAttached = true;
        const onVoicesChanged = () => {
          try {
            const next = window.speechSynthesis.getVoices();
            if (Array.isArray(next) && next.length > 0) {
              this.cachedVoices = next;
            }
          } catch {
            // Ignore restricted speechSynthesis reads
          }
        };
        if (typeof synth.addEventListener === 'function') {
          synth.addEventListener('voiceschanged', onVoicesChanged);
        } else if ('onvoiceschanged' in synth) {
          synth.onvoiceschanged = onVoicesChanged;
        }
      }
    } catch {
      // Ignore blocked speechSynthesis in strict sandboxes
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stopSpeech();
    }
  }

  setSpeechRateMode(mode: SpeechRateMode): void {
    this.speechRateMode = mode === 'slow' ? 'slow' : 'normal';
  }

  getSpeechRateMode(): SpeechRateMode {
    return this.speechRateMode;
  }

  stopSpeech(): void {
    this.speechToken += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore blocked speech synthesis in restricted sandboxes
      }
    }
    this.flushActiveCancel();
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    try {
      if (this.ctx && this.ctx.state === 'closed') {
        this.ctx = null;
      }
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private tone(
    freq: number,
    durationSec: number,
    type: OscillatorType = 'triangle',
    gainLevel = 0.12,
    delaySec = 0,
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore already-disconnected nodes
        }
      };

      osc.start(now);
      osc.stop(now + durationSec + 0.02);
    } catch {
      // Fail silently in strict sandboxes or when AudioContext rejects scheduling
    }
  }

  speak(text: string, lang = 'en-US', rate = 0.94, callbacks?: SpeakCallbacks): void {
    this.speechToken += 1;
    const myToken = this.speechToken;
    this.flushActiveCancel();
    if (
      this.muted ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      try {
        callbacks?.onError?.();
      } catch {
        // Ignore callback error
      }
      return;
    }
    try {
      this.ensureVoicesLoaded();
      const synth = window.speechSynthesis;
      const liveVoices = synth.getVoices();
      const pool = Array.isArray(liveVoices) && liveVoices.length > 0 ? liveVoices : this.cachedVoices;
      const preferred = selectPreferredVoice(pool, lang);

      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = preferred?.lang || lang;
      if (preferred) {
        utterance.voice = preferred;
      }
      utterance.rate = computeEffectiveSpeechRate(rate, this.speechRateMode);
      utterance.pitch = 1.02;
      let settled = false;
      utterance.onend = () => {
        if (settled || this.speechToken !== myToken) return;
        settled = true;
        this.activeCancelHandler = null;
        try {
          callbacks?.onEnd?.();
        } catch {
          // Ignore callback error
        }
      };
      utterance.onerror = () => {
        if (settled || this.speechToken !== myToken) return;
        settled = true;
        this.activeCancelHandler = null;
        try {
          callbacks?.onError?.();
        } catch {
          // Ignore callback error
        }
      };
      this.activeCancelHandler = callbacks?.onCancel ?? null;
      synth.speak(utterance);
    } catch {
      this.activeCancelHandler = null;
      try {
        callbacks?.onError?.();
      } catch {
        // Ignore callback error
      }
    }
  }

  playCorrect(combo: number): void {
    const lift = Math.min(combo, 6) * 32;
    this.tone(523.25 + lift, 0.12, 'triangle', 0.13, 0);
    this.tone(659.25 + lift, 0.18, 'triangle', 0.14, 0.075);
  }

  playNudge(): void {
    this.tone(240, 0.14, 'sine', 0.09, 0);
    this.tone(210, 0.16, 'sine', 0.07, 0.08);
  }

  playToken(): void {
    this.tone(987.77, 0.08, 'sine', 0.1, 0);
    this.tone(1318.51, 0.16, 'sine', 0.11, 0.06);
  }

  playChest(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.tone(n, 0.22, 'triangle', 0.13, idx * 0.075);
    });
  }

  playPackShake(): void {
    this.tone(280, 0.07, 'triangle', 0.08, 0);
    this.tone(330, 0.07, 'triangle', 0.09, 0.11);
    this.tone(392, 0.09, 'triangle', 0.1, 0.22);
  }

  playPackReveal(rarity: Rarity): void {
    if (rarity === 'chroma' || rarity === 'legendary') {
      const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      fanfare.forEach((n, i) => {
        this.tone(n, 0.3, 'triangle', 0.14, i * 0.065);
      });
      return;
    }
    if (rarity === 'epic' || rarity === 'rare') {
      const arpeggio = [440, 554.37, 659.25, 880];
      arpeggio.forEach((n, i) => {
        this.tone(n, 0.24, 'triangle', 0.13, i * 0.065);
      });
      return;
    }
    this.tone(440, 0.14, 'triangle', 0.11, 0);
    this.tone(587.33, 0.2, 'triangle', 0.12, 0.07);
  }
}

export const audioService: AudioService = new BrowserAudioService();

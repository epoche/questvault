import type { Rarity } from './types';

export interface AudioService {
  setMuted(muted: boolean): void;
  speak(text: string, lang?: string): void;
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

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore blocked speech synthesis in restricted sandboxes
      }
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    try {
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

    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  speak(text: string, lang = 'en-US'): void {
    if (this.muted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.94;
      utterance.pitch = 1.02;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fail silently if speech synthesis is blocked
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

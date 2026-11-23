---
status: accepted
---

# Use Web Audio SFX and Web Speech Pronunciation Behind an Audio Seam

We will synthesize snappy arcade and Mystery Pack sound effects with the Web Audio API and pronounce Grade 4 Target Words and example sentences via the browser's Web Speech API (`speechSynthesis`), hidden behind a single `AudioService` interface. Unlike K–2 isolated phonemes, Grade 4 multisyllabic words (such as *reluctant*, *enormous*, *peculiar*) are pronounced reliably by modern browser voices, and Web Speech works automatically for parent-imported Custom Word Sets with zero pre-recorded audio authoring.

## Considered Options

- **Pre-recorded static MP3s for every word**: Higher voice warmth, but breaks dynamic pronunciation for parent-pasted weekly school Custom Word Sets.
- **Real-time cloud TTS API**: Adds API keys, backend proxy, ongoing cost, and breaks offline PWA use.

## Consequences

- Audio must degrade gracefully when `speechSynthesis` is unavailable or muted, and unlock Web Audio cleanly on first user interaction.
- Swapping in curated static MP3s or cloud TTS later requires changing only the `AudioService` implementation.

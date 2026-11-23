---
status: accepted
---

# Use Teach-First Word Spotlight, Miss-Requeue Mastery Queue, and Gamified Adaptive Placement

We will structure every English Run around four stages — `Word Spotlight` (teach first) → `Word Sprint` → `Sentence Upgrade` → `Writer's Forge` — enforce a `Mastery Queue` that pauses briefly to teach on any miss and moves the item to the back of the queue with zero Tokens, and calibrate Difficulty Tier (Tier 1–4) through an 8-question adaptive `Placement Quest` (+50 Token bonus) rather than a formal diagnostic exam. Playtesting revealed that testing unfamiliar Tier 2 words without prior teaching invites blind guessing, allowing in-place retries lets clever 4th graders brute-force click every button for Tokens, and a formal i-Ready-style diagnostic screen would immediately feel like school testing rather than a game.

## Considered Options

- **Formal 20-question Diagnostic Exam**: Gives a detailed placement score, but triggers strong "school test" aversion in US elementary students before they ever experience the Pack Market loop.
- **Lives / Game Over penalty for wrong clicks**: Stops button-mashing, but causes frustration and abandonment when a learner genuinely doesn't know a word yet.

## Consequences

- Every missed word is recorded in `PlayerState.wordMastery`, automatically unlocking double-Token `Tricky Word Rematch` Runs and a parent-facing mastery dashboard.
- `WritingEvaluator` enforces distinct non-repeated words in addition to total word count so Players cannot stuff repeated words to unlock the Forge Chest.

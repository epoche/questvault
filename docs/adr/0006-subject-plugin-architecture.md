---
status: accepted
---

# Separate Shared Economy Core from Pluggable Subject Modules

We will structure QuestVault into a subject-agnostic core (`src/core/` — Tokens, Pack Market, Mystery Packs, Vault, Player persistence, AudioService with multi-language `speak(text, lang)`, and Subject registry) and isolated Subject modules (`src/subjects/english/`, with future `src/subjects/math/` and `src/subjects/chinese/`). Tokens and Collectibles are shared across all Subjects so practicing any subject fuels the same Vault collection, while each Subject owns its own curriculum data and Run stages without forcing a lowest-common-denominator generic quiz editor.

## Considered Options

- **English-only monolith**: Slightly fewer directories today, but couples Token payouts, storage schemas, and navigation directly to English vocabulary types, making future Math or Chinese support a painful rewrite.
- **Generic universal quiz CMS engine**: Over-engineers the MVP and weakens subject-specific mechanics like English Sentence Upgrade and Writer's Forge (or future Math step-solvers and Chinese stroke/idiom games).

## Consequences

- Every persisted Quest Set, Run history record, and Writing/Activity log entry carries a `subjectId` (`'english' | 'math' | 'chinese'`).
- Adding Math or Chinese later requires creating a new folder under `src/subjects/` and registering it in `src/core/registry.ts`, with zero changes to the economy, Pack Market, or Vault.

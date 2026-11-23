# QuestVault

A Blooket-inspired Grade 4 English (ELA) vocabulary & writing studio built around a cross-subject Token, Mystery Pack, and Collectible Vault economy.

## Quick Start

```bash
npm install
npm run dev          # Local dev server
npm test             # Run Vitest domain TDD suite
npm run build        # Production PWA build
npm run build:single # Single-file self-contained HTML build
```

## Architecture

- [`GLOSSARY.md`](./GLOSSARY.md) — Canonical domain vocabulary
- [`DESIGN.md`](./DESIGN.md) — Visual world, palette, rarity tiers, and motion choreography
- [`docs/adr/`](./docs/adr/) — Architectural Decision Records (`0001`–`0006`)
- `src/core/` — Subject-agnostic economy (`Tokens`, `Mystery Packs`, `Vault`), `PlayerRepository` (`localStorage` + JSON backup), `AudioService` (Web Audio SFX + multi-lang Web Speech), and Subject registry
- `src/subjects/english/` — Grade 4 Tier 2 `Word Sets` (36 words), 3-stage `Run` engine (`Word Sprint` → `Sentence Upgrade` → `Writer's Forge`), deterministic `WritingEvaluator`, and parent weekly list importer

## Adding Future Subjects (Math / Chinese)

Per [ADR-0006](./docs/adr/0006-subject-plugin-architecture.md), create a new folder under `src/subjects/<subject>/` and register it in `src/core/registry.ts`. All Tokens earned across Subjects feed directly into the shared Pack Market and Vault.

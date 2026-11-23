---
status: accepted
---

# Store Player Progress Locally Without Accounts Plus JSON Backup

We will store Player profiles, Token balances, Vault collections, Writing Log entries, and Custom Word Sets locally in `localStorage` with zero login or cloud backend, complemented by a simple JSON export/import backup button. This eliminates onboarding friction for home play, collects zero child PII (naturally COPPA-friendly), and protects rare Legendary/Chroma Vault pulls against accidental browser clearing or switching devices.

## Considered Options

- **Parent login + cloud database (Supabase/Firebase)**: Enables automatic cross-device sync, but introduces auth, hosting, and child-data compliance overhead before the core loop is proven.
- **Local storage without backup**: Risks heartbreaking loss of a child's Legendary/Chroma Collectibles if browser storage is cleared.

## Consequences

- All persistence goes through a `PlayerRepository` interface so swapping in cloud sync later requires zero domain or UI rewrites.

---
status: accepted
---

# Use Vite + React + TypeScript Static PWA Over Next.js

We will build WordVault as a static client-side SPA/PWA with Vite, React, TypeScript, Tailwind CSS, Motion, and Vitest rather than Next.js. Because the MVP has no backend APIs, persists all Player state locally, and relies heavily on snappy client-side animations (Blooket-style Combo popups and Mystery Pack reveals), Vite keeps builds, Vitest TDD loops, and static preview exports fast and self-contained.

## Considered Options

- **Next.js (App Router)**: Adds SSR/RSC server complexity with no benefit for an offline-capable local PWA.

## Consequences

- Domain modules (`word-sets`, `run-engine`, `writing-checks`, `pack-market`, `repository`) live as pure, React-free TypeScript tested directly with Vitest.

---
status: accepted
---

# Target Responsive Web / PWA Over Native Mobile App for MVP

We are building WordVault as a responsive Web / PWA (optimized for Chromebook and iPad) rather than a native iOS/Android or React Native app. US 4th graders already play Blooket in the browser on school Chromebooks and home iPads, and a Web / PWA lets us share builds immediately with zero App Store review friction while supporting full-screen home-screen installation and crisp touch/keyboard controls.

## Considered Options

- **React Native / Expo**: Strong native packaging, but adds App Store / TestFlight overhead before gameplay and Token-pack tuning are validated with a real 4th grader.

## Consequences

- Typing in Writer's Forge must feel smooth on both iPad on-screen keyboards and Chromebook hardware keyboards.
- Core domain logic (Run engine, Pack drop tables, Writing Checks, repository) stays pure TypeScript so a future Capacitor or React Native wrapper remains straightforward.

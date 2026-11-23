# QuestVault Design System (DESIGN.md)

## Visual World & Surface Mode

- **Surface Mode**: Operate + Tactile Arcade-Collectible Studio.
- **Audience**: 9–10 year old US 4th grader who loves Blooket's crisp, snappy reward loops and collectible rarity thrill — confident, bright, tactile, and modern, never preschool/pastel-babyish.
- **Lighting & Canvas**: Warm sunlit studio parchment (`#FAF7F2`) with crisp elevated white cards (`#FFFFFF`), grounded by deep espresso-ink typography (`#1C1917`) and vibrant arcade accents. High readability on iPad and Chromebook screens under home/classroom lighting.

## Palette

| Role | Hex | Usage |
| :--- | :--- | :--- |
| Canvas | `#FAF7F2` | App background, warm paper surface |
| Surface | `#FFFFFF` | Cards, Run stage panels, inputs |
| Surface Subtle | `#F3EFE7` | Secondary trays, disabled slots, Vault silhouettes |
| Ink Primary | `#1C1917` | Headings, body copy, high-contrast labels |
| Ink Secondary | `#57534E` | Definitions, helper text, secondary metadata |
| Border Subtle | `#E7E2D8` | Crisp 1.5px structural outlines |
| Primary Cobalt | `#2563EB` | Primary CTA, active Subject/Nav, Run focus |
| Token Gold | `#F59E0B` | Token currency badge, Chest glow, Combo heat |
| Mastery Emerald | `#059669` | Correct answers, completed Writing Checks |
| Gentle Coral | `#E11D48` | Soft retry nudge (never harsh alarm red) |

### Rarity Tiers (6 Tiers)

| Rarity | Drop Rate | Badge / Glow Color | Resale Tokens |
| :--- | :--- | :--- | :--- |
| Common | 48% | `#64748B` (Slate) | 5 |
| Uncommon | 28% | `#059669` (Emerald) | 10 |
| Rare | 14% | `#2563EB` (Cobalt) | 20 |
| Epic | 6.5% | `#7C3AED` (Violet) | 35 |
| Legendary | 2.7% | `#D97706` (Solar Gold) | 75 |
| Chroma | 0.8% | Iridescent Prismatic Foil (`#EC4899` → `#06B6D4` → `#F59E0B`) | 150 |

## Typography

- **Display / Headings**: `Bricolage Grotesque` (700–800) — crisp, playful character without feeling childish; tracking `-0.025em`.
- **Body / Controls**: `Plus Jakarta Sans` (400–700) — clear open counters for 4th-grade reading fluency and long words (`enormous`, `reluctant`, `peculiar`).
- **Tabular Numerals**: `font-variant-numeric: tabular-nums` on Token balances, Combo counters, progress counters, and drop percentages.
- **Input Minimum**: `16px` minimum on all `<input>` and `<textarea>` elements (prevents iOS Safari zoom).

## Depth, Craft Floor & Browser Surfaces

- **Soft Offset Elevation**: `0 2px 0 #E7E2D8, 0 8px 24px -12px rgba(28, 25, 23, 0.14)` on interactive tiles; press compresses cleanly (`translateY(1px) scale(0.985)`).
- **No Anti-Patterns**: No eyebrow kickers above headings, no emoji icons (use `lucide-react` + bespoke SVG Collectibles), no gradient text, no one-sided colored border strips, no nested cards.
- **Themed Browser Surfaces**: Custom text selection (`#DBEAFE` / `#1E3A8A`), focus-visible ring (`2px solid #2563EB` with `2px` offset), caret color (`#2563EB`), clean subtle scrollbars.

## Authored Motion Choreography

1. **Mystery Pack Opening (Hero Moment)**:
   - Pack anticipation wobble + press charge (0–380ms)
   - Foil flash burst + scale pop (380–520ms)
   - Collectible card rises with spring physics + rarity halo (520–860ms)
   - Rarity banner + NEW / Duplicate Token pill settles together (740–960ms)
   - Clickable immediately once revealed; respects `prefers-reduced-motion: reduce`.
2. **Word Sprint & Sentence Upgrade**:
   - Instant pointer-down press feedback (100ms `ease-out`).
   - Combo badge pops on correct streak; upgraded Target Word morphs into place with warm emerald highlight.
3. **Mobile-Native Baseline**:
   - `100dvh` app shell, `viewport-fit=cover`, `-webkit-tap-highlight-color: transparent`, `overscroll-behavior: none`, `touch-action: manipulation` on controls, `@media (hover: hover) and (pointer: fine)` gated hover transforms.

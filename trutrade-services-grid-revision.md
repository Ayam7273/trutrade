# TruTrade Services Page — ServicesGrid Revision Prompt

## Context
Targeted fix to the `ServicesGrid` component on the live Services page (`/services`) — the mixed navy/teal/light card backgrounds read as inconsistent, and the icon sits stacked above the pill badge on each card instead of sitting beside it. This is a scoped visual fix only — do not touch any other section of the Services page or any other page.

**File:** `ServicesGrid.jsx`, `ServicesGrid.module.css`

## Change 1 — One uniform card background
Remove the alternating `--color-navy-dark` / `--color-card-light-bg` / `--color-teal-mid` backgrounds. Every one of the 6 cards uses **`--color-navy-dark`** as its background, with no border (drop the light-card border treatment entirely — it no longer applies since no card is light anymore).

Since every card is now dark, every `PillBadge` in this grid uses the **`"light"`** variant only (white background, dark text) — remove the `"teal"` variant usage from this component; it's no longer needed here now that no card has a light background to contrast against. Icon circles keep their existing `--color-teal-mid` background with a white `lucide-react` icon inside — that part already reads fine and doesn't change.

## Change 2 — Icon and badge aligned horizontally
Currently the icon circle sits above the pill badge, stacked vertically. Change this to a horizontal row: icon circle on the left, pill badge immediately to its right, vertically centered against each other — both sitting on the same line, above the card's paragraph copy (which stays below, full-width, as it already is).

```
[ icon ]  [ Pill Badge Heading ]
Paragraph copy continues below, full width...
```

Use `display: flex; align-items: center; gap: <spacing>;` on the wrapper containing the icon and badge — don't use absolute positioning to achieve the alignment.

## Constraints
- Do not change the 6 cards' copy, icons, or grid layout (2×2 desktop / stacked mobile stays as-is) — only background color and the icon/badge alignment change.
- Do not touch `ServicesHero`, `HowItWorks`, `ServicesTestimonials`, `CtaBanner`, or any other page's use of `PillBadge` — this fix is scoped to `ServicesGrid` only.
- No new design tokens needed — this only removes usages of `--color-card-light-bg` / `--color-card-light-border` / `--color-badge-teal-bg` / `--color-badge-teal-text` from this one component, it doesn't delete those tokens from `variables.css` since other pages (Store) still use them.

## Acceptance Criteria
- [ ] All 6 ServicesGrid cards render with the same `--color-navy-dark` background, no border
- [ ] Every badge in this grid uses the light (white bg / dark text) `PillBadge` variant
- [ ] Icon circle and pill badge sit side-by-side on the same horizontal line, vertically centered, on every card
- [ ] Layout still stacks cleanly at 375px and 768px

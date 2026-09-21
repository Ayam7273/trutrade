# TruTrade - Homepage Build Prompt (React + Supabase)

## Context
TruTrade is a secure escrow & payment SaaS platform for the UK ⇄ Nigeria trade corridor, serving marketplaces, e-commerce sellers, and businesses. This prompt covers **project scaffolding from an empty repo, plus the public marketing homepage** - no auth, dashboard, or live Supabase data wiring yet.

**The repo is currently empty of source code** (only config files exist: `.env.example`, `.gitignore`, `eslint.config.js`, `index.html`, `package.json`, `vite.config.js`). Real image, icon, and logo assets have already been placed under `public/assets/` (see Asset Manifest below) - **use these exact files. Do not invent, generate, or describe placeholder graphics for anything listed in the manifest.**

## Phase 0 - Project Scaffolding (do this first)
1. Initialize a Vite + React project in the repo root using npm:
   ```
   npm create vite@latest . -- --template react
   npm install
   ```
2. Install project dependencies via npm:
   ```
   npm install @supabase/supabase-js lucide-react react-router-dom
   ```
3. Create the base folder structure under `src/` (see Files to Create/Touch below). **Do not create a new `assets` folder under `src/` - all real assets already live in `public/assets/` and are referenced by absolute URL path (e.g. `/assets/images/homepage-img1.png`), not by import.**
4. **Font setup:**
   - Unzip the Moanslight font file and copy these exact files into `public/fonts/moanslight/` (each weight ships as both `.otf` and `.ttf` - keep both, browsers will pick whichever `@font-face` lists first):
     ```
     moanslight-thin.otf         moanslight-thin.ttf
     moanslight-extralight.otf   moanslight-extralight.ttf
     moanslight-light.otf        moanslight-light.ttf
     moanslight-regular.otf      moanslight-regular.ttf
     moanslight-medium.otf       moanslight-medium.ttf
     moanslight-semibold.otf     moanslight-semibold.ttf
     moanslight-bold.otf         moanslight-bold.ttf
     ```
   - In `src/styles/variables.css`, declare one `@font-face` block per weight, exactly as below (all reference the single family name `'Moanslight'`, distinguished by `font-weight`):
     ```css
     @font-face {
       font-family: 'Moanslight';
       src: url('/fonts/moanslight/moanslight-thin.otf') format('opentype'),
            url('/fonts/moanslight/moanslight-thin.ttf') format('truetype');
       font-weight: 100;
       font-style: normal;
       font-display: swap;
     }
     @font-face {
       font-family: 'Moanslight';
       src: url('/fonts/moanslight/moanslight-extralight.otf') format('opentype'),
            url('/fonts/moanslight/moanslight-extralight.ttf') format('truetype');
       font-weight: 200;
       font-style: normal;
       font-display: swap;
     }
     @font-face {
       font-family: 'Moanslight';
       src: url('/fonts/moanslight/moanslight-light.otf') format('opentype'),
            url('/fonts/moanslight/moanslight-light.ttf') format('truetype');
       font-weight: 300;
       font-style: normal;
       font-display: swap;
     }
     @font-face {
       font-family: 'Moanslight';
       src: url('/fonts/moanslight/moanslight-regular.otf') format('opentype'),
            url('/fonts/moanslight/moanslight-regular.ttf') format('truetype');
       font-weight: 400;
       font-style: normal;
       font-display: swap;
     }
     @font-face {
       font-family: 'Moanslight';
       src: url('/fonts/moanslight/moanslight-medium.otf') format('opentype'),
            url('/fonts/moanslight/moanslight-medium.ttf') format('truetype');
       font-weight: 500;
       font-style: normal;
       font-display: swap;
     }
     @font-face {
       font-family: 'Moanslight';
       src: url('/fonts/moanslight/moanslight-semibold.otf') format('opentype'),
            url('/fonts/moanslight/moanslight-semibold.ttf') format('truetype');
       font-weight: 600;
       font-style: normal;
       font-display: swap;
     }
     @font-face {
       font-family: 'Moanslight';
       src: url('/fonts/moanslight/moanslight-bold.otf') format('opentype'),
            url('/fonts/moanslight/moanslight-bold.ttf') format('truetype');
       font-weight: 700;
       font-style: normal;
       font-display: swap;
     }
     ```
   - Load **Inter** via Google Fonts in `index.html` (`<link>` tag) - do not self-host it.
   - Define two font tokens: `--font-heading: 'Moanslight', sans-serif;` and `--font-body: 'Inter', sans-serif;`.
   - Headings should use `font-weight: 600` (semibold) by default per the reference design's bold look - component-level overrides can dial into `500`/`700` where a specific heading needs it.
   - **Every heading element (`h1`–`h6`) uses `--font-heading`, regardless of what font appears in the reference screenshot. All body copy, labels, nav links, and buttons use `--font-body`.** This overrides the visual reference - do not match the screenshot's heading font.
5. Set up a global stylesheet at `src/styles/variables.css` containing the design tokens as CSS custom properties (see Design Tokens below), imported once in `src/main.jsx`.
6. Create a minimal Supabase client stub at `src/lib/supabaseClient.js`:
   ```js
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```
   `.env.example` already exists in the repo root - confirm it has `VITE_SUPABASE_URL=` and `VITE_SUPABASE_ANON_KEY=` placeholders, add them if missing. This client is not called from the homepage yet - it just needs to exist for future wiring.
7. Set up basic routing with `react-router-dom`, single route `/` pointing to `src/pages/Home.jsx`.
8. Set the favicon in `index.html` to `/assets/icons/trutrade-favicon.svg` (fall back to the `.png` version if the SVG doesn't render correctly in the browser).
9. Confirm the dev server runs cleanly (`npm run dev`) with a blank placeholder page before moving to Phase 1.

## Tech Stack
- React (functional components + hooks only), scaffolded via Vite
- Plain CSS Modules for styling - one `.module.css` file per component, colocated with the component. No Tailwind, no CSS-in-JS.
- Supabase JS client (stubbed per Phase 0, not called yet)
- Icons: real SVGs from `public/assets/icons/` where listed in the manifest; `lucide-react` only for icons NOT covered by the manifest (e.g. hamburger menu icon, social icons in the footer)
- No CMS - all copy is static/hardcoded for now, but pull it into a `content` object/constants file per section so it's easy to swap for Supabase-driven content later.

## Asset Manifest - Use These Exact Files, Nothing Invented

All paths are relative to `public/`, referenced in code as absolute URLs starting with `/assets/...`.

**Icons** (`public/assets/icons/`)
| File | Use |
|---|---|
| `Arrow left.svg` | Testimonial carousel "previous" control |
| `Arrow right.svg` | Testimonial carousel "next" control |
| `diagonal arrow.svg` | The ↗ icon inside every "Read More" blog link |
| `trutrade-favicon.svg` / `trutrade-favicon.png` | Browser favicon (Phase 0) and the small mark next to the wordmark in the navbar/footer logo lockup, if the logo files don't already include it |

**Images** (`public/assets/images/`)
| File | Use |
|---|---|
| `homepage-img1.png` | Escrow Infrastructure section (teal panel, right side) |
| `homepage-img2.png` | Recent Activity section (dark mobile widget mockup, left side) |
| `homepage-img3.png` | "Keep everyone in the loop" section (Dispute dashboard mockup) |
| `newsletter-img.png` | Decorative graphic cluster on the right side of the Newsletter section |

**Logos** (`public/assets/logos/`)
| File | Use |
|---|---|
| `trutrade-logo-no-bg.png` | Default navbar and footer logo (transparent background, use on white/light sections) |
| `trutrade-logo-bg.jpg` | Only use this version if a logo needs to sit on a dark/colored section and the transparent version doesn't read well - flag to the user before using it, don't assume |

**Not exported / not available** - for these, build CSS-drawn or inline-SVG placeholders exactly as before, and flag them back to the user as still needed:
- The 3 small square feature icons (Secure Escrow Payment / Smart Multi-Currency Wallet / Marketplace Opportunities)
- The decorative starburst shapes in the Hero and FeatureHighlights sections
- Partner/trust logos (Patreon, Airbnb, Fiberplane, Coinbase, Griffin, HelpScout, Plaid) - use text wordmarks as placeholders
- Testimonial star-rating icons - use `lucide-react`'s `Star` icon
- Footer social icons - use `lucide-react` equivalents

## Files to Create/Touch
This is a from-scratch build. Do not add anything outside this structure without flagging it first:

```
src/
  main.jsx
  App.jsx
  styles/
    variables.css
  lib/
    supabaseClient.js
  pages/
    Home.jsx
  components/
    home/
      Navbar.jsx
      Navbar.module.css
      Hero.jsx
      Hero.module.css
      FeatureHighlights.jsx
      FeatureHighlights.module.css
      TrustedByLogos.jsx
      TrustedByLogos.module.css
      InfraSection.jsx
      InfraSection.module.css
      RecentActivitySection.jsx
      RecentActivitySection.module.css
      TestimonialsCarousel.jsx
      TestimonialsCarousel.module.css
      BlogPreview.jsx
      BlogPreview.module.css
      LoopSection.jsx
      LoopSection.module.css
      NewsletterCTA.jsx
      NewsletterCTA.module.css
      Footer.jsx
      Footer.module.css
  data/
    homeContent.js
```

`Home.jsx` composes all section components in order (see Page Structure below) and is the only page routed to `/`.

## Design Tokens
Define these once as CSS custom properties in `src/styles/variables.css`, imported globally - every component's `.module.css` references `var(--token-name)` rather than hardcoding hex values.

```css
--color-navy-dark: #0F3D52;      /* deep navy used in "Why Buyers & Sellers Trust Us" section */
--color-navy-darker: #16202B;    /* near-black panel bg, testimonial card bg */
--color-teal-dark: #0E7C86;      /* primary teal, Infra section bg + accents */
--color-teal-mid: #2FB3AE;       /* secondary teal, "Keep everyone in the loop" section bg */
--color-orange: #F5A623;         /* primary CTA color (Get Started, Subscribe buttons) */
--color-orange-hover: #E0951A;
--color-bg-light: #FFFFFF;
--color-bg-offwhite: #FAFAFA;    /* Newsletter section bg */
--color-text-dark: #14181E;
--color-text-muted: #6B7280;
--color-text-inverse: #FFFFFF;
--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-pill: 999px;
--font-heading: 'Moanslight', sans-serif;   /* every h1–h6, no exceptions */
--font-body: 'Inter', sans-serif;           /* everything else: paragraphs, nav, labels, buttons */
```

Typography scale: H1 ~48px/1.15, H2 ~36px/1.2, body ~16px/1.6, small/label ~13px uppercase tracked (used for section eyebrow badges like "01", "02"). Apply `--font-heading`/`--font-body` at the element level in `variables.css` (e.g. `h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }`) so no component has to set font-family manually.

## Page Structure & Section Specs

Build in this exact top-to-bottom order:

1. **Navbar** - `trutrade-logo-no-bg.png` on the left, center nav links (About, Services, Store, Blogs, Contact), right side "Log in" text link + "Sign up for free" pill button (orange). Sticky, white background, subtle bottom border.

2. **Hero** - centered layout. Decorative starburst shapes flank the headline (not exported - build as inline SVG placeholders per the Asset Manifest note, teal, hide/shrink on mobile). H1 (Moanslight): "Secure Escrow & Payment Platform for Marketplaces". Subtext (Inter): "Escrow for the UK ⇄ Nigeria trade corridor. Building trust, fulfilling needs easily." One orange pill CTA button: "Get Started".

3. **FeatureHighlights** - 3-column row (stack on mobile), each with a placeholder square icon (not exported, build simple colored square/icon placeholder) + label (Inter, bold) + one-line description:
   - Secure Escrow Payment - "Lock in funds until product is delivered, milestones, splits, and safety for both parties."
   - Smart Multi-Currency Wallet - "Hold, receive, and withdraw payments in multiple currencies - securely and instantly."
   - Marketplace Opportunities - "Find & buy product - all backed by secure escrow, verified users, and fast payouts."

4. **TrustedByLogos** - centered stat line "Delivered 10,000+ transactions. Powering 1,000+ businesses." followed by a horizontal row of text-wordmark placeholder logos (Patreon, Airbnb, Fiberplane, Coinbase, Griffin, HelpScout, Plaid) - not exported, plain text styled to look like a logo row.

5. **InfraSection** - two-column layout (stack on mobile). Left: small orange "01" pill badge, H2 "Escrow Infrastructure for Securing Digital Transactions", supporting paragraph. Right: `homepage-img1.png` inside a rounded-corner (`--radius-lg`) container.

6. **RecentActivitySection** - two-column, image LEFT, text RIGHT. Left: `homepage-img2.png` inside a rounded container. Right: orange "02" badge, H2 "Trade, E-commerce, Businesss" [sic - keep as-is unless the user corrects it], supporting paragraph.

7. **TestimonialsCarousel** - full-bleed navy-dark (`--color-navy-dark`) section. Centered H2 "Why Buyers & Sellers Trust Us?" + subtext. Below: a card row of 3 testimonial "speech bubble" cards on a `--color-navy-darker` background (only the center one fully visible, side ones cropped/faded). Each card: quote text, star rating row (`lucide-react` `Star`), name + role. Prev/next controls use `Arrow left.svg` / `Arrow right.svg` from the manifest, plus dot pagination. Implement as a real functional carousel with `useState` for active index.

8. **BlogPreview** - H2 "Blog & Articles" left-aligned with supporting paragraph beside it. Below: 3-column card grid, each card with two small tag pills, bold title, short excerpt, and a "Read More" link that ends with the `diagonal arrow.svg` icon. Below the grid, centered orange pill button "View all posts".

9. **LoopSection** - full-bleed teal (`--color-teal-mid`) section. Centered H2 "Keep everyone in the loop" + subtext about disputes/support. Below: `homepage-img3.png` inside a large rounded container.

10. **NewsletterCTA** - light grey (`--color-bg-offwhite`) rounded card section. Left: H2 "Join Our Newsletter Now" + short paragraph + email input with inline orange "Subscribe" button. Right: `newsletter-img.png`.

11. **Footer** - `trutrade-logo-no-bg.png` + short tagline left, then 3 link columns (Quick Links: About/Services/Blogs/Contact; Legal: Privacy Policy/Safeguarding/Code of Conduct/Acceptable Use; Address: physical address text). Bottom bar: copyright text left, 3 social icons right (`lucide-react`, not exported).

## Responsive Requirements
- Mobile breakpoint < 768px: all multi-column sections stack vertically, decorative starburst placeholders either hide or shrink, nav collapses to a hamburger menu (`useState` toggle, `lucide-react` menu/X icon).
- Test at 375px, 768px, and 1280px widths.

## Constraints - Read Before Writing Code
- **Never fabricate, generate, or describe-as-placeholder any asset that's already in the manifest.** If a section needs `homepage-img1.png`, use that exact file - don't build a styled-div mockup instead.
- **Every heading uses the Moanslight font token; every other text element uses Inter.** This applies even though the reference screenshot shows a different heading font - that's an intentional override, not an oversight to "fix."
- Stick exactly to the folder structure above. No `features/`, no `containers/`, no barrel files.
- Do not install any dependency beyond `@supabase/supabase-js`, `lucide-react`, and `react-router-dom` without flagging it first.
- Every component gets its own colocated `.module.css` file - no shared/global component styles beyond `src/styles/variables.css`.
- All copy strings live in `src/data/homeContent.js`, exported as named objects per section - components import from there, not inline strings.
- Keep every section as its own isolated component with no cross-section state - the carousel's `useState` is local to `TestimonialsCarousel` only.
- Accessibility: semantic headings (one `<h1>` in Hero, `<h2>` per section), meaningful `alt` text on every real image from the manifest, `aria-hidden` on decorative-only placeholders, keyboard-operable carousel controls.
- Once Phase 0 is done and the dev server runs cleanly, do not re-run `npm create vite` or re-scaffold - move straight into building the components.

## Acceptance Criteria
- [ ] `npm run dev` boots a working Vite + React app with routing in place
- [ ] Moanslight font renders on all headings; Inter renders on all body text
- [ ] Supabase client stub exists and imports without throwing (even with empty `.env` values)
- [ ] All 11 homepage sections render in order on `/`, using the real manifest assets where specified
- [ ] Carousel arrows (using the real arrow SVGs) and dots change the visible testimonial
- [ ] Newsletter email input has basic client-side validation (non-empty, contains `@`) before "submitting" (console.log only - no Supabase call yet)
- [ ] Mobile nav toggle works
- [ ] Every component has a colocated CSS Module - no global/inline styles outside `variables.css`
- [ ] Layout matches the attached homepage reference image section-for-section, aside from the intentional heading-font override

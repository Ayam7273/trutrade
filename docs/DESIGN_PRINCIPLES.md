# TruTrade — Design Principles & Conventions

> **Note for this repo (`trutrade-admin`).** This guide was written for the Vite marketing site. The file links below (`../src/…`) point at that project and do not resolve here. The admin app uses a different stack: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui and Hugeicons. The **principles** carry over; the **mechanics** change as follows.
>
> | This guide says | In `trutrade-admin` |
> | --- | --- |
> | Tokens in `variables.css`, used as `var(--…)` | Tokens in `app/globals.css`, exposed to Tailwind through `@theme inline`. Use `bg-navy`, `text-orange`, etc. Never hardcode a hex in a component. |
> | CSS Module per component | Tailwind utility classes in the component. |
> | Shared `Button`, `.srOnly` | shadcn `Button` and Tailwind `sr-only`. |
> | `lucide-react` icons | `@hugeicons/react` with `@hugeicons/core-free-icons`. |
> | Desktop-first, one 767px breakpoint | Tailwind is mobile-first; `md:` (768px) is the single breakpoint. |
> | `src/pages`, `src/components/<surface>` | `app/` routes, `components/admin/`, `components/ui/` (shadcn). |
> | `data/adminContent.js` | `data/adminContent.ts`. Still the only place for static UI copy. |
> | React Router `<Link>` | `next/link`. |
> | `VITE_*` env vars are public | `NEXT_PUBLIC_*` env vars are public. Same rule: never put a service-role key there. |
>
> Sections 1–4 describe the marketing site as it exists. Section 5 is the proposal to follow.

This document describes the design and code conventions **already used** in the TruTrade front end, where the code drifts from them, and how to apply them when building the **admin page**.

Sections 1–4 describe what exists today. Section 5 is a **proposal** for the admin page. Nothing in it exists in the code yet.

---

## 1. Stack snapshot

| Concern | Choice |
| --- | --- |
| Build | Vite 6, React 19 (JSX, no TypeScript) |
| Routing | `react-router-dom` v7, declarative mode (`<BrowserRouter>` + `<Routes>` in [App.jsx](../src/App.jsx)) |
| Styling | Plain CSS: one global token file + one CSS Module per component |
| Icons | `lucide-react` for UI icons, SVG files in `public/assets/icons` for brand icons, Font Awesome CDN for social icons |
| Backend | Supabase client in [supabaseClient.js](../src/lib/supabaseClient.js). **Not used by any component yet.** |
| Lint | ESLint 9 with react-hooks and react-refresh rules |

Only one route exists today: `/` renders `Home`. There is no auth, no admin, and no shared UI component library.

---

## 2. Principles the codebase follows

### 2.1 Content is separated from markup

All copy, links, image paths and alt text live in [homeContent.js](../src/data/homeContent.js) as named exports (`heroContent`, `footerContent`, …). Components import their object and render it.

```jsx
import { newsletterContent } from '../../data/homeContent';
<h2>{newsletterContent.title}</h2>
```

This includes validation messages (`emptyError`, `invalidError`) and aria labels (`prevAria`, `nextAria`). Non-developers can change wording without touching JSX, and one object maps to one section.

**Rule:** no user-visible string literal inside JSX, except trivial accessibility labels tied to logic (for example `Open menu` / `Close menu`).

### 2.2 Design tokens live in one place

[variables.css](../src/styles/variables.css) defines every shared value as a CSS custom property on `:root`:

- **Colour:** `--color-navy-dark`, `--color-teal-mid`, `--color-orange`, `--color-text-muted`, `--color-border`, `--color-error`, …
- **Radius:** `--radius-sm` 8px, `--radius-md` 16px, `--radius-lg` 24px, `--radius-pill` 999px
- **Type:** `--font-heading` (Moanslight), `--font-body` (Inter)
- **Layout:** `--container-max` 1160px, `--nav-max` 1240px, `--section-pad-y` 96px (drops to 56px on mobile)

The same file holds the `@font-face` rules, the CSS reset, and base element styles (`h1`–`h3`, `a`, `button`, `:focus-visible`). It is imported once in [main.jsx](../src/main.jsx).

**Rule:** components reference `var(--…)` and never hardcode a brand value. State changes get their own token (`--color-orange` and `--color-orange-hover`).

### 2.3 Styles are scoped per component (CSS Modules)

Every component has a sibling `Name.module.css`, imported as `styles`. Class names are short and role-based (`.section`, `.inner`, `.card`, `.cta`). Element selectors are used only for content the component owns (`.copy h2`, `.form input`).

There is no CSS-in-JS and no utility framework. State variants are composed by joining class names (`${styles.burst} ${styles.burstLeft}`).

### 2.4 One folder per surface; a page is just composition

```
src/
  pages/        Route-level components. Compose sections, hold no styling.
  components/
    home/       Everything used by the home page, one component + one CSS Module each.
  data/         Static content per surface.
  lib/          Service clients.
  styles/       Global tokens and reset.
```

[Home.jsx](../src/pages/Home.jsx) has no logic. It lists `<Navbar />`, `<main>` with sections in order, then `<Footer />`. Layout chrome is composed **by the page**, not injected globally in `App.jsx`. This matters for admin: an admin route will not get the marketing navbar or footer unless it asks for them.

### 2.5 Sections follow a repeatable layout recipe

Nearly every section uses the same skeleton:

```jsx
<section className={styles.section} id="…" aria-labelledby="…-heading">
  <div className={styles.inner}>…</div>
</section>
```

```css
.section { padding: <y> 24px; }                        /* full-bleed band, gutter */
.inner   { max-width: var(--container-max); margin: 0 auto; }  /* centred content */
```

The outer element carries the background and vertical padding. The inner element constrains width. Full-width colour bands, like the navy testimonials section, therefore come free.

### 2.6 Accessibility is built in, not bolted on

Patterns already present that new code should copy:

- `aria-labelledby` on sections, pointing at the `<h2 id>`
- Decorative images use `alt=""` plus `aria-hidden="true"`
- Form errors use `role="alert"`, `aria-invalid` and `aria-describedby` ([NewsletterCTA.jsx](../src/components/home/NewsletterCTA.jsx))
- Visually hidden labels (`.srOnly`) rather than missing labels
- Icon-only buttons always have `aria-label`
- Disclosure controls use `aria-expanded` and `aria-controls` (mobile menu)
- Carousel: `aria-live`, `role="tablist"`, arrow-key navigation
- A global `:focus-visible` outline in the teal accent
- Landmarks: `<header>`, `<nav aria-label>`, `<main>`, `<footer>`, `<address>`

### 2.7 Responsive approach: desktop-first, one breakpoint

- Layouts are written for desktop, then overridden in `@media (max-width: 767px)`. Twelve files use the 767px breakpoint.
- The only exceptions are the navbar's intermediate `1024px` step and one `min-width: 900px` rule in Hero.
- Multi-column grids collapse to a single column (`grid-template-columns: 1fr`). Decorative elements (bursts, side carousel cards) are hidden on mobile.
- Mobile section padding is reduced (`--section-pad-y` overridden at 767px).
- `html, body` set `overflow-x: hidden` as a guard against horizontal scroll.

Media queries cannot read CSS variables, so `767px` is repeated as a literal. Keep it as the single mobile breakpoint.

### 2.8 Visual language

| Element | Convention |
| --- | --- |
| Primary action | Orange pill (`--color-orange`, `--radius-pill`, white text, 600 weight), darker on hover |
| Brand accents | Navy `#0F3D52` for structure and dark bands, teal `#2FB3AE` for highlights and focus, orange for calls to action |
| Shapes | Pills for buttons and nav, generous radii for cards (24–36px), starburst SVG decorations |
| Type | Moanslight for headings (600), Inter for body, muted grey `--color-text-muted` for secondary copy |
| Surfaces | White page, light-grey cards (`#f3f4f6`), soft shadows (`0 8px 30px rgba(20,24,30,.06)`) |
| Hover | Colour shift only (orange to darker orange, text to orange or teal), no transforms |

### 2.9 Small conventions worth keeping

- Default exports for components, named exports for content objects.
- `.jsx` extension on component imports in pages, extensionless on data imports.
- Keys come from stable ids or labels.
- Small presentational helpers stay in the same file as the component that uses them (`Burst` in Hero).
- Icons are decorative by default and sized in CSS or by a `size` prop.

---

## 3. Where the codebase drifts from its own principles

These are worth knowing before you copy patterns for the admin page. Nothing here is broken, but new code should not repeat them.

1. **Hardcoded colours outside the token file.** [NewsletterCTA.module.css](../src/components/home/NewsletterCTA.module.css) uses `#f3f4f6` and `#cfd6df`, and [BlogPreview.module.css](../src/components/home/BlogPreview.module.css) uses `#cfd8e3`. These are three near-identical greys, so they should probably become one token such as `--color-surface` and `--color-border-input`.
2. **Duplicated `Burst` SVG component.** It is copy-pasted in [Hero.jsx](../src/components/home/Hero.jsx) and [FeatureHighlights.jsx](../src/components/home/FeatureHighlights.jsx), with different fill/stroke.
3. **No shared Button.** The orange pill is re-declared in Hero (`.cta`), Navbar (`.signup`, `.mobileSignup`), NewsletterCTA (`.form button`) and BlogPreview (`.cta`), with slightly different padding and radius.
4. **`.srOnly` is defined inside NewsletterCTA's module.** It is a generic utility and belongs in a shared file.
5. **Radii, shadows and font sizes are not tokenised.** `32px`, `36px`, `28px`, `12px` and many `13/14/15px` font sizes appear as literals. Only the four `--radius-*` values are shared.
6. **Only `--color-error` exists as a status colour.** There is no success, warning or info token.
7. **Navbar uses `<a href="/">` and `#login` / `#signup` hash links.** Nothing uses React Router's `<Link>`, so the logo click does a full page reload. There are no login or signup routes.
8. **Supabase client silently falls back to placeholder values** when the env vars are missing (`https://placeholder.supabase.co`). The app runs but every call would fail, with no clear error.
9. **Newsletter form only `console.log`s.** It validates with `includes('@')` and does not submit anywhere.
10. **Global heading styles are marketing-scale.** `h1` is 48px and `h2` is 36px in `variables.css`. That is fine for the landing page but too large for dense admin screens.
11. **Placeholder content remains** (lorem ipsum, duplicated testimonials, `Tags` placeholders, the typo "Businesss" in `activityContent.title`).

---

## 4. Quick reference: how to build a component here

1. Create `Thing.jsx` and `Thing.module.css` in the right `components/<surface>/` folder.
2. Put any text in a named export in `data/<surface>Content.js`.
3. Root element: `<section>` or another semantic tag with `aria-labelledby` or `aria-label`.
4. Use `var(--…)` for every colour, radius and font, and add a token if one is missing.
5. Write the desktop layout first, then one `@media (max-width: 767px)` block at the bottom.
6. Give every interactive element a visible focus state (inherit the global `:focus-visible`) and every icon-only control an `aria-label`.
7. Export as default. Import in the page.

---

## 5. Admin page — proposed approach

> **Status: proposal.** The repo has no admin code, so this describes how to extend the existing conventions to admin, not an existing design. Adjust once you know the admin's scope (see the open questions at the end).

### 5.1 Security first: the client is not the gatekeeper

- **Client-side route guards are UX only.** Anyone can open dev tools and bypass them. Real protection must come from **Supabase Row Level Security** and a server-verifiable admin role (for example an `admin` claim, or a `profiles.role` column checked in RLS policies).
- **The anon key is public by design** and ships in the bundle. It is safe only because RLS is enforced.
- **Never put the `service_role` key in a `VITE_*` variable.** Anything prefixed `VITE_` is embedded in the browser bundle. Privileged actions belong in Supabase Edge Functions or another server.
- For the admin page, replace the placeholder fallbacks in `supabaseClient.js` with a thrown error when env vars are missing, so a misconfigured deploy fails loudly.

### 5.2 Suggested structure

```
src/
  pages/
    admin/
      AdminLogin.jsx
      AdminDashboard.jsx
      AdminTransactions.jsx        # add pages as needed
  components/
    admin/
      AdminLayout.jsx              # sidebar + topbar + <Outlet />
      AdminLayout.module.css
      RequireAdmin.jsx             # route guard (UX only, see 5.1)
      StatCard.jsx
      DataTable.jsx
      StatusBadge.jsx
    ui/                            # shared primitives, created when the second use appears
      Button.jsx
  data/
    adminContent.js                # labels, column headings, empty and error states
  lib/
    supabaseClient.js
    auth.js                        # session and role helpers
```

This mirrors the existing `pages/` → `components/<surface>/` → `data/` layout. It also keeps the admin out of `components/home/`, which is marketing-only.

### 5.3 Routing

Use a nested layout route so the sidebar and topbar are declared once:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
    <Route index element={<AdminDashboard />} />
    <Route path="transactions" element={<AdminTransactions />} />
  </Route>
</Routes>
```

`AdminLayout` renders `<Outlet />`. This fits the "layout is composed by the page" principle from 2.4. The marketing `Navbar` and `Footer` never appear here because `Home` renders them, not `App`.

### 5.4 Design tokens to add

The admin needs things the marketing site never did. Add them to `variables.css`, not to admin CSS:

```css
/* Status: escrow lifecycle needs more than "error" */
--color-success: …;   --color-success-bg: …;
--color-warning: …;   --color-warning-bg: …;
--color-info: …;      --color-info-bg: …;
--color-error-bg: …;

/* Surfaces and lines */
--color-surface: #f3f4f6;      /* replaces the hardcoded greys in section 3.1 */
--color-border-input: #cfd6df;

/* Spacing and elevation, so dense layouts stay consistent */
--space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px;
--shadow-card: 0 8px 30px rgba(20, 24, 30, 0.06);

/* Layout */
--sidebar-width: 240px;
```

Pick success, warning and info hues that sit well with the navy and teal palette. The teal `--color-teal-dark` (`#0E7C86`) is a natural base for "info" or "success".

### 5.5 Adapting the visual language for dense UI

- **Keep:** the palette, Moanslight headings, Inter body, orange for the single primary action per view, soft shadows, `--radius-*` scale, teal focus ring.
- **Change:** use smaller headings inside admin (override in `AdminLayout.module.css`; do not edit the global `h1`/`h2`). Use tighter padding than `--section-pad-y`, and 8–12px radii (`--radius-sm`) for tables, inputs and badges rather than 24–36px card radii.
- **Avoid:** decorative bursts and full-bleed colour bands. They are marketing devices.
- **Status is never colour alone.** Pair every `StatusBadge` colour with a text label (Pending, Funded, Released, Disputed, Refunded), which is the same accessibility instinct as `aria-label` on icon buttons.

### 5.6 Watch-outs specific to this repo

- **Sticky sidebar.** `html, body { overflow-x: hidden }` in `variables.css` can stop `position: sticky` from working, because `body` becomes its own scroll container. If a sticky sidebar or table header does not stick, test this first. The fix is usually `overflow-x: clip` on `body` or moving the guard to the admin layout wrapper. Verify in a browser rather than assuming.
- **Tables on mobile.** The site collapses to one column at 767px. Tables should scroll horizontally inside their own wrapper (`overflow-x: auto`), not shrink.
- **Data vs content.** `data/adminContent.js` holds *static* text only, such as column headings, empty states and error messages. Fetched records come from Supabase and should not be put in `data/`.
- **Forms.** Copy the `NewsletterCTA` pattern (labelled input, `aria-invalid`, `aria-describedby`, `role="alert"` message), but validate with something stricter than `includes('@')` for admin inputs.
- **Loading, empty and error states** are not modelled anywhere in the current code. Decide on one shared pattern early so every admin table handles them the same way.

### 5.7 Suggested order of work

1. Add the tokens from 5.4 to `variables.css` and make `supabaseClient.js` throw on missing env vars.
2. Build `AdminLayout` (sidebar, topbar, `<Outlet />`) and the route skeleton with a placeholder dashboard.
3. Add login and `RequireAdmin`, and write the matching Supabase RLS policies at the same time.
4. Extract a shared `Button` and `.srOnly` once admin becomes the second consumer (this also cleans up items 3 and 4 in section 3).
5. Build `StatCard`, `StatusBadge` and `DataTable`, then the first real data page.

### 5.8 Open questions to settle before building

- What does the admin manage? Transactions and escrow, disputes, users and KYC, blog posts, newsletter subscribers? This decides the pages and the schema.
- How are admins authenticated: Supabase email and password, magic link, or SSO? Is there a separate `admin` role or table yet?
- Is the UI desktop-only, or does it need to work on phones?
- Does it need light and dark themes, or just light like the marketing site?

---

## 6. Pre-merge checklist

- [ ] No hardcoded colours, or a new token was added.
- [ ] No user-visible strings inline in JSX (unless trivial aria text).
- [ ] Component has its own `.module.css`; global styles were not edited for a local need.
- [ ] Works at 767px and below; nothing scrolls horizontally.
- [ ] Interactive elements are keyboard-reachable with a visible focus state; icon-only buttons have `aria-label`.
- [ ] Status and error states convey meaning by more than colour.
- [ ] `npm run lint` and `npm run build` pass.

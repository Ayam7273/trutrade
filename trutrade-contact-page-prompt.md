# TruTrade Contact Page — Build Prompt (React + Supabase)

## Context
This adds a new **Contact page** (`/contact`) to the existing TruTrade site, matching the aesthetic already established on the homepage and Store page: same design tokens, same font rules (Moanslight headings / Inter body — **this applies regardless of what font the attached Contact page screenshot appears to use**), same component conventions (CSS Modules, `<page>Content.js` content files, real assets over placeholders).

**Reuse, don't rebuild, these existing components as-is:**
- `Navbar.jsx` — same active-route styling pattern already added for the Store page; "Contact" gets the active-orange treatment when on `/contact`.
- `Footer.jsx` — reused unchanged.

Everything else on this page is new.

## Asset Manifest — Contact Page

Path relative to `public/assets/images/`, referenced as an absolute URL. **Use this exact file — do not invent a replacement.**

| File | Use |
|---|---|
| `contact-page-hero-img.png` | Decorative starburst/rays graphic on the right side of the contact form panel |

**Not exported / flag back to the user if needed:** the faint topographic line-pattern background visible behind the "Contact Info" section in the reference screenshot has no exported asset. Skip it for now — render that section on a plain `--color-bg-offwhite` background — and note to the user that a texture asset would be needed to match it exactly.

## Files to Create
```
src/
  pages/
    Contact.jsx
  components/
    contact/
      ContactHero.jsx
      ContactHero.module.css
      ContactInfoSection.jsx
      ContactInfoSection.module.css
      FaqSection.jsx
      FaqSection.module.css
  data/
    contactContent.js
```
Register the `/contact` route alongside the existing `/` and `/store` routes, pointing at `Contact.jsx`. `Contact.jsx` composes: `Navbar` → `ContactHero` → `ContactInfoSection` → `FaqSection` → `Footer`.

## Design Tokens
Reuse existing tokens from `variables.css` (`--color-navy-dark`, `--color-teal-mid`, `--color-orange`, `--color-bg-offwhite`, `--radius-lg`, `--radius-pill`, `--font-heading`, `--font-body`). If `--color-card-light-border` (added during the Store page work) doesn't already exist in `variables.css`, add it now:
```css
--color-card-light-border: #14181E; /* visible dark border on light/inactive cards */
```
No other new tokens are needed for this page.

## Page Sections

### 1. ContactHero
- H1 (Moanslight), two lines as shown in the reference: "Get in touch with us." / "We're here to assist you." — render as a single `<h1>` with a `<br />` or two `<span>` lines, not two separate headings.
- Paragraph (Inter): "Lorem ipsum dolor sit amet consectetur. Ut rhoncus sagittis nisi consectetur. Aliquam condimentum in sit sed a sodales risus."
- Below: a large `--color-bg-offwhite` rounded (`--radius-lg`) panel, two columns (stack on mobile):
  - **Left — the contact form** (build as a real controlled form with `useState`, not just static markup):
    - `Name` — text input, label "Name", placeholder "Name", **not required**
    - `Email*` — email input, label "Email*", placeholder "Email", **required**, basic client-side validation (non-empty, contains `@`)
    - `Message*` — textarea, label "Message*", placeholder "Message", **required**, non-empty validation
    - "Send Message" button — orange, full-width of the form column, reusing `--color-orange` (same token as the Hero/Store CTA buttons). On submit with valid fields, `console.log` the form data for now — no Supabase call yet (flag this as a clear "TODO: wire to Supabase" comment in the code, since contact form storage will come later).
    - Show a simple inline validation message under `Email`/`Message` if the user tries to submit while those are empty or invalid — don't use a browser `alert()`.
  - **Right — decorative graphic:** `contact-page-hero-img.png`, right-aligned, sized to roughly match the height of the form column per the reference. Mark it `aria-hidden="true"` / empty `alt=""` since it's purely decorative.

### 2. ContactInfoSection
Plain `--color-bg-offwhite` background (see Asset Manifest note on the missing texture).
- Small label "Contact Info" (Inter, uppercase-style per reference)
- H2 (Moanslight): "Lorem ipsum dolor sit amet consectetur." (two-line wrap as shown)
- Two columns beside/below the heading (stack on mobile):
  - **Email Address** — heading, a short horizontal rule/dash ("—"), `help@info.com`, then "Assistance hours: Monday - Friday 6 am to 8 pm EST"
  - **Number** — heading, a short horizontal rule/dash ("—"), `(808) 998-34256`, then "Assistance hours: Monday - Friday 6 am to 8 pm EST"

### 3. FaqSection
- Centered H2 (Moanslight): "Frequently Asked Questions"
- Below: a vertical accordion list of 6 items. Build this as a **real interactive accordion** with `useState` tracking the open item index (default: item 1 open, matching the reference where "Question 1" is expanded). Clicking a header toggles that item open/closed; only one item open at a time.
  - **Open item styling:** `--color-navy-dark` background, white text, large bold numeral ("01"), question text, a horizontal divider line, and the answer paragraph below it, a circular minus icon (`lucide-react` `Minus`) on the right.
  - **Closed item styling:** `--color-bg-offwhite` background with `--color-card-light-border` (2px) border, dark text, large bold numeral, question text, a circular plus icon (`lucide-react` `Plus`) on the right, no answer text shown.
  - Content for all 6 items lives in `contactContent.js` as an array of `{ number, question, answer }`. Only Question 1's answer is specified in the reference ("During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements."). Use realistic placeholder Lorem-ipsum-style answers for Questions 2–6 until the user supplies real copy — flag this back to the user rather than inventing real-sounding claims about the business.

### 4. Footer
Reused unchanged.

## Constraints
- Do not modify `Navbar.jsx`'s existing behavior beyond the active-route styling already established for `/store` — extend the same pattern to `/contact`.
- All new copy lives in `src/data/contactContent.js`, exported as named objects/arrays per section, matching the `homeContent.js`/`storeContent.js` pattern already in use.
- Every heading (`h1`, `h2`) uses `var(--font-heading)`; all paragraph/label/body copy uses `var(--font-body)` — applied automatically via the existing global `variables.css` element rules, so no component should set `font-family` manually.
- New CSS Modules only — no global style changes beyond the one token noted above (only if missing).
- Use the real graphic from the manifest — no placeholder shape for the starburst image.
- Form and accordion state stay local to their own components — no shared/global state between sections.

## Acceptance Criteria
- [ ] `/contact` route renders: Navbar (Contact link active) → ContactHero (working form + real decorative image) → ContactInfoSection → FaqSection (working accordion) → Footer
- [ ] Form validates Email and Message as required before allowing submit; Name is optional
- [ ] Form submission is `console.log`-only for now, with a visible TODO comment marking the future Supabase wiring point
- [ ] FAQ accordion opens/closes on click, only one item open at a time, Question 1 open by default
- [ ] Headings render in Moanslight, body copy in Inter, throughout the new page
- [ ] Responsive at 375px, 768px, 1280px — form/graphic columns and Contact Info columns stack cleanly on mobile

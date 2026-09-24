# TruTrade Blog Page — Build Prompt (React + Supabase)

## Context
This adds a new **Blog page** (`/blogs`) to the existing TruTrade site, matching the aesthetic already established on the homepage, Store, and Contact pages: same design tokens, same font rules (Moanslight headings / Inter body — **this applies regardless of what font the attached Blog page screenshot appears to use**), same component conventions (CSS Modules, `<page>Content.js` content files, real assets over placeholders).

**Reuse, don't rebuild, these existing components as-is:**
- `Navbar.jsx` — same active-route styling pattern already used for `/store` and `/contact`; "Blogs" gets the active-orange treatment when on `/blogs`.
- `Footer.jsx` — reused unchanged.
- `FaqSection.jsx` (built for the Contact page) — reused unchanged, just fed different content. This page only shows 3 questions instead of 6, with Question 1 open by default — same interaction, same visual treatment, smaller dataset.

Everything else on this page is new.

## Asset Manifest — Blog Page

Path relative to `public/assets/images/`, referenced as absolute URLs. **Use these exact files, matched to posts in this exact order — do not invent or swap images.**

| File | Post it belongs to |
|---|---|
| `blog-img1.png` | Post 01 — "The Art of Designing Timeless Masterpieces" |
| `blog-img2.png` | Post 02 — "Stay Ahead of the Curve in the Visual World" |
| `blog-img3.png` | Post 03 — "Crafting Emotionally Engaging User Experiences" |
| `blog-img4.png` | Post 04 — "Less is More for Maximum Impact" |

## Files to Create
```
src/
  pages/
    Blog.jsx
  components/
    blog/
      BlogList.jsx
      BlogList.module.css
      BlogPostRow.jsx
      BlogPostRow.module.css
  data/
    blogContent.js
```
Register the `/blogs` route alongside the existing routes, pointing at `Blog.jsx`. `Blog.jsx` composes: `Navbar` → `BlogList` → `FaqSection` (imported from the Contact page's components, passed this page's own FAQ data — see below) → `Footer`.

## Design Tokens
No new tokens needed — reuse everything already defined (`--color-orange`, `--color-bg-offwhite`, `--color-navy-dark`, `--color-card-light-border`, `--radius-lg`, `--radius-pill`, `--font-heading`, `--font-body`).

## Page Sections

### 1. BlogList
A vertical stack of 4 post rows (`BlogPostRow`, mapped from a `posts` array in `blogContent.js` — don't hardcode 4 separate JSX blocks). Each row is a two-column layout, **image always on the left, content always on the right** (unlike the homepage's alternating Infra/Recent-Activity sections — this page does not alternate), stacking to a single column on mobile:

- **Left:** the post's image from the manifest, rounded corners (`--radius-lg`), `alt` text describing the post topic (not just the filename).
- **Right:**
  - A small meta row: bold index number ("01", "02", "03", "04"), a short horizontal rule/divider, then the date (e.g. "24-07-2026")
  - H3 (Moanslight): the post title
  - Paragraph (Inter): the excerpt
  - A "Read More" button — **note this is a bordered pill button here, not the plain text link style used in the homepage's blog preview cards**: white background, `--color-card-light-border` border, `--radius-pill`, containing the label "Read More" plus the `diagonal arrow.svg` icon from `public/assets/icons/` (same icon already used elsewhere on the site). Link target is a placeholder `#` for now — there's no individual blog post detail page yet, so add a `// TODO: link to /blogs/:slug once post detail pages exist` comment rather than building routing for it now.

Post data (`blogContent.js`):
```js
export const blogPosts = [
  {
    number: '01',
    date: '24-07-2026',
    title: 'The Art of Designing Timeless Masterpieces',
    excerpt: 'Dive into the realm of limitless creativity as we explore the techniques and inspirations behind crafting visually stunning and timeless designs that captivate hearts and minds.',
    image: '/assets/images/blog-img1.png',
  },
  {
    number: '02',
    date: '25-07-2026',
    title: 'Stay Ahead of the Curve in the Visual World',
    excerpt: 'Discover the secrets of designing impactful brand experiences that leave a lasting impression on your audience, forging deep connections and driving brand loyalty.',
    image: '/assets/images/blog-img2.png',
  },
  {
    number: '03',
    date: '26-07-2026',
    title: 'Crafting Emotionally Engaging User Experiences',
    excerpt: "Join us on a journey of exploration as we push the boundaries of design, unveiling cutting-edge concepts and techniques that challenge conventional norms and redefine what's possible.",
    image: '/assets/images/blog-img3.png',
  },
  {
    number: '04',
    date: '27-07-2026',
    title: 'Less is More for Maximum Impact',
    excerpt: 'Delve into the fascinating world of design psychology and learn how to create emotionally resonant user experiences that captivate users, evoke desired responses, and drive meaningful engagement.',
    image: '/assets/images/blog-img4.png',
  },
];
```

### 2. FaqSection (reused)
Same accordion component built for the Contact page, fed a smaller dataset specific to this page:
```js
export const blogFaqs = [
  {
    number: '01',
    question: 'Question 1',
    answer: 'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.',
  },
  { number: '02', question: 'Question 2', answer: 'Placeholder answer — replace with real copy.' },
  { number: '03', question: 'Question 3', answer: 'Placeholder answer — replace with real copy.' },
];
```
Item 01 open by default, same open/closed styling already implemented (`--color-navy-dark` open state, `--color-bg-offwhite` + border closed state, `lucide-react` `Plus`/`Minus` icons). Centered H2 (Moanslight) "Frequently Asked Questions" above it, exactly as already built — don't restyle it for this page.

### 3. Footer
Reused unchanged.

## Constraints
- Do not modify `Navbar.jsx`'s existing behavior beyond extending the active-route pattern to `/blogs`.
- Do not duplicate `FaqSection.jsx` — import and reuse it with this page's own data, same as `TestimonialsCarousel` was reused on the Store page.
- All new copy lives in `src/data/blogContent.js`, exported as named arrays, matching the pattern already used in `homeContent.js`/`storeContent.js`/`contactContent.js`.
- Every heading (`h2`, `h3`) uses `var(--font-heading)`; all paragraph/label/body copy uses `var(--font-body)` — applied automatically via the existing global `variables.css` rules, so no component should set `font-family` manually.
- New CSS Modules only — no global style changes, no new design tokens needed for this page.
- Use the 4 real images from the manifest, matched to the correct post — no placeholder graphics.
- `BlogPostRow` renders from the `posts` array via `.map()` — don't write 4 separate hardcoded row components.

## Acceptance Criteria
- [ ] `/blogs` route renders: Navbar (Blogs link active) → BlogList (4 rows, correct images, image-left/content-right on all 4) → FaqSection (reused component, 3 items, Q1 open by default) → Footer
- [ ] Each "Read More" button uses the bordered-pill style with the diagonal arrow icon, distinct from the homepage's plain-text "Read More" links
- [ ] Headings render in Moanslight, body copy in Inter, throughout the new page
- [ ] Responsive at 375px, 768px, 1280px — each post row stacks to a single column (image above content) on mobile

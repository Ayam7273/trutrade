# TruTrade Auth Pages Revision + Supabase Auth Setup

## Context
Four fixes/additions on top of the Login/Sign Up pages just built:
1. Site-wide nav links point to the real auth routes, and those routes get the Navbar too.
2. Spacing fix above the footer on both auth pages.
3. Banner image should bleed to the edges of its panel, not float with padding.
4. A dedicated Supabase auth helper file, wired into both forms for real (replacing the earlier `console.log` + TODO placeholders).

---

## Change 1 — Navbar links to `/login` / `/signup`, and Navbar now appears on both auth pages

**Files:** `Navbar.jsx`, `AuthLayout.jsx`, `AuthLayout.module.css`

- In `Navbar.jsx`, change the "Log in" text link to route (via your router's `Link`, not a plain `<a>`) to `/login`, and the "Sign up for free" button to route to `/signup`. Apply this everywhere `Navbar` is rendered — it's one shared component, so this is a single change that takes effect site-wide.
- `AuthLayout.jsx` previously rendered **no** Navbar (per the original reference screenshots). Reverse that: render `Navbar` at the top of `AuthLayout`, above the two-column split, exactly as it appears on every other page.
- Since `Navbar` is `position: fixed` (from the earlier navbar revision), add top padding to the split-screen container inside `AuthLayout` equal to the navbar's rendered height, so the "Welcome Back!" / "Get Started!" heading isn't hidden underneath it — same fix already applied to the Hero section on other pages.
- `Navbar`'s active-route highlighting doesn't need a new state for `/login`/`/signup` — neither is in the nav link list, so no nav item should show as active on these two pages. No change needed there beyond what already exists.

## Change 2 — Space above the footer

**Files:** `AuthLayout.jsx`, `AuthLayout.module.css`

- Add bottom margin/padding to the split-screen container in `AuthLayout` (a value in the same range as the spacing already used between sections on other pages — roughly 64–96px) so there's visible breathing room between the bottom of the form/banner area and the top of `Footer`. Currently they sit flush against each other.

## Change 3 — Banner image touches the panel's edges

**Files:** `AuthLayout.jsx`, `AuthLayout.module.css`

- Currently the banner image floats centered inside the right panel with padding on all sides (`object-fit: contain`). Change this so the image **fills its panel edge-to-edge**: remove the panel's internal padding, set the image to `width: 100%; height: 100%; object-fit: cover;` so it bleeds to the top, right, and bottom edges of the panel with no visible gutter. (`object-fit: cover` will crop the image slightly to fill the space — that's expected and matches a full-bleed treatment; if it crops off something important like the phone mockup's edge, `object-position` can be adjusted to keep the important content centered.)
- This only changes the auth pages' banner panel — don't touch how images are handled anywhere else on the site (Store, Infra section, etc.).

## Change 4 — Supabase Auth helper file, wired into both forms

**File to create:** `src/lib/supabaseAuth.js`

This sits alongside the existing `src/lib/supabaseClient.js` stub (don't duplicate the client setup — import the existing `supabase` export from there) and centralizes every auth call the app needs, so `LoginForm`/`SignUpForm` (and anything else later — password reset, session checks in protected routes, etc.) call these instead of hitting `supabase.auth.*` directly all over the codebase.

```js
// src/lib/supabaseAuth.js
import { supabase } from './supabaseClient';

/**
 * Creates a new account with email + password, storing extra profile
 * fields (first name, last name, phone) in the user's auth metadata.
 * Supabase sends a confirmation email by default — surface that to the
 * user in the calling component rather than assuming an instant session.
 */
export async function signUpWithEmail({ email, password, firstName, lastName, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone,
      },
    },
  });
  return { data, error };
}

/**
 * Signs in an existing user with email + password.
 */
export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Starts the Google OAuth flow. Supabase redirects the browser away and
 * back — the caller doesn't get a session synchronously, so don't expect
 * to update UI state right after calling this. Wire up an onAuthStateChange
 * listener (below) wherever the app needs to react to the resulting session.
 *
 * `redirectTo` should point at a route in this app that the user lands on
 * after Google redirects back — using `window.location.origin` keeps this
 * correct across local dev and whatever domain the app is deployed to.
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { data, error };
}

/**
 * Signs the current user out.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Fetches the current session (or null if not signed in). Useful for
 * protected-route checks on app load.
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session ?? null, error };
}

/**
 * Subscribes to auth state changes (sign in, sign out, token refresh).
 * Returns the subscription so the caller can unsubscribe in a useEffect
 * cleanup function:
 *
 *   useEffect(() => {
 *     const { unsubscribe } = onAuthStateChange((event, session) => { ... });
 *     return () => unsubscribe();
 *   }, []);
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return { unsubscribe: () => subscription.unsubscribe() };
}
```

### Required Supabase Dashboard configuration (do this manually, not in code)
Add this as a comment block at the top of `supabaseAuth.js` so it isn't missed:
```js
/**
 * SETUP CHECKLIST (do this in the Supabase Dashboard, not in code):
 * 1. Authentication → Providers → Email: confirm "Enable email provider" is on.
 *    Decide whether to require email confirmation before login — if enabled,
 *    signUpWithEmail() above will succeed but the user can't sign in until
 *    they click the confirmation link, so the SignUp form should tell users
 *    to check their email rather than assume an instant logged-in state.
 * 2. Authentication → Providers → Google: enable it, then paste in a Google
 *    Cloud OAuth Client ID + Secret (create one at
 *    https://console.cloud.google.com/apis/credentials if you don't have one).
 * 3. Authentication → URL Configuration: add this app's deployed URL (and
 *    http://localhost:5173 for local dev) to "Redirect URLs", or Google
 *    sign-in will fail after the redirect back from Google.
 */
```

### Wire the forms up for real
**Files:** `LoginForm.jsx`, `SignUpForm.jsx`

Replace the earlier `console.log` + `TODO` placeholders with real calls:

- **`LoginForm.jsx`:**
  - "Continue with Google" button's `onClick` calls `signInWithGoogle()` from `supabaseAuth.js`.
  - On valid form submit, call `signInWithEmail({ email, password })`. If `error` comes back, show it in a simple inline error message above the button (add a small `error` state) rather than an `alert()`. On success, `console.log(data)` for now and add a `// TODO: redirect to the user's dashboard once that route exists` comment — there's no dashboard/protected area built yet, so don't invent a redirect target.
- **`SignUpForm.jsx`:**
  - On valid submit, call `signUpWithEmail({ email, password, firstName, lastName, phone })`. On success, replace the button/form area with a simple confirmation message: "Check your email to confirm your account before signing in." (Supabase's default flow requires email confirmation — don't assume the user is immediately logged in.) On `error`, show it inline the same way as the login form.

Both forms import from `../../lib/supabaseAuth` (adjust the relative path to match where `LoginForm.jsx`/`SignUpForm.jsx` actually live) rather than calling `supabase.auth.*` directly — keeps all auth logic in one place.

## Constraints
- Don't change `supabaseClient.js` itself — `supabaseAuth.js` imports and reuses the existing `supabase` client instance.
- Don't build a dashboard, protected route, or session-persistence UI yet — this only wires the Login/Sign Up forms to real Supabase calls and centralizes the helper functions for later reuse.
- Keep the Google Dashboard setup checklist as a comment in the file — it's a manual step for you to do in the Supabase project settings, not something the IDE model can automate.

## Acceptance Criteria
- [ ] Navbar's "Log in" and "Sign up for free" route to `/login` and `/signup` everywhere `Navbar` is used
- [ ] `/login` and `/signup` both render the fixed Navbar, with correct top padding so the heading isn't hidden underneath it
- [ ] Visible spacing exists between the split-screen area and the Footer on both auth pages
- [ ] The banner image fills its right-side panel edge-to-edge with no padding gutter
- [ ] `src/lib/supabaseAuth.js` exists with the 5 exported functions above and the dashboard setup checklist comment
- [ ] `LoginForm` calls `signInWithEmail` and `signInWithGoogle`; `SignUpForm` calls `signUpWithEmail`; both show real error messages on failure and no longer just `console.log` placeholder TODOs

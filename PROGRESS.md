# TruTrade — Project Progress

**UK–Nigeria cross-border escrow marketplace** · React 19 + Vite · Supabase · react-router-dom v7 · CSS Modules
_Last updated: 2026-10-26_

Escrow holds a buyer's payment until delivery is confirmed, then releases it to the seller. Browsing is public; transactional actions require a verified account.

---

## ✅ Achieved so far

### Authentication & accounts
- Email/password sign-up and login (Supabase Auth).
- Google OAuth sign-in wired in code (callback not yet fully tested).
- `profiles` table with role (`buyer`/`seller`), country (`GB`/`NG`), and `verification_status`, auto-created on signup via DB trigger.
- Security hardening: `role` locked once set; `verification_status` and Smile ID fields are **not** writable from the browser (trigger + column grants).

### Verification wizard (`/verify`)
- 4-step flow: **Role → Country → Phone (collect only) → Done**.
- OTP/SMS removed entirely (`OtpStep` deleted; phone is collected, not verified).
- Unverified users are **no longer signed out** — they can browse and are shown a verify prompt.
- "Browse the marketplace for now" exit link.

### Access & gating model (updated 2026-10-26)
- Storefront routes (`/marketplace`, `/store/:slug`, `/cart`, `/checkout`) are **public to view**.
- Interacting while signed-out (add to cart, favourite, message, checkout) opens a **sign-up pop-up modal** — not a redirect. Once signed in, actions run freely; verification does **not** gate interaction.
- Guards: `/verify` = `RequireAuth`; `/dashboard/*` = `RequireAuth → RequireRole('seller')` (buyers bounced to `/marketplace`). `RequireVerified` retired.
- Login/landing by role: **seller → `/dashboard`, buyer → `/marketplace`**.
- Role chosen at signup and locked (buyer *or* seller, no switching).

### Seller dashboard (UI complete)
- Full dashboard UI built: Overview, Store, Store Edit, Products (list/new/edit), Orders (list/detail), Payments/Withdraw/Transactions, Reviews, Notifications.
- Shared component library: tables, pagination, stat cards, charts, tabs, timeline, badges, dialogs, form fields, etc.
- **Currently backed by in-memory mocks** (`dashboardMock.js`) — see "What's left".

### Marketplace (buyer-facing) — built and wired to Supabase
- `Marketplace.jsx` (merchants list), `StoreFront.jsx` (`/store/:slug`), `Cart.jsx`, `CheckoutPlaceholder.jsx`.
- Marketplace component set: `MarketplaceHeader`, `MarketplaceLayout`, `FilterBar`, `MerchantRow`, `ProductTile`, `ProductCard`, `ProductDetailsModal`, `CartItemRow`, `OrderSummary`, `EmptyState`.
- `marketplaceApi.js` reads/writes **real Supabase data** (stores, products, product_images, store_stats, cart_items, favourite_stores).
- `CartContext` for cart state + header badge; `marketplace.js` with `ESCROW_FEE_RATE = 0.05`, cart grouping and totals.
- Gated actions: Add to Cart, Send a Message (shows "coming soon"), Add as Favourite (real write), quantity ±, delete, Proceed to Checkout.

### Database & formatting
- Authoritative schema designed (`trutrade-schema-v3.sql`) + Supabase setup reference (`supabase.md`): stores, products, images, cart, favourites, orders, order items, wallets/transactions, reviews, notifications, views, RLS, storage buckets.
- GBP-only cleanup done; `formatMoney` shows pence only for non-integer amounts.

---

## 🔲 What's left to achieve

### High priority — makes the app functional end-to-end
1. **Run `trutrade-seller-access.sql` in Supabase** — grants sellers self-service store/product/image access (additive, idempotent) and ensures the `store-assets` + `product-images` buckets exist. Required for store/product saves + uploads to work for unverified sellers.
2. **Wire the seller dashboard to Supabase** — ✅ done for store + products:
   - `storeApi.js` — ✅ reads/updates own store (`store_stats` for live counts), logo/banner upload to `store-assets`, first-run "set up your store" handled.
   - `productsApi.js` — ✅ lists/creates/updates/deletes products + `product_images` upload to `product-images`; `useProductsStatus()` drives loading/empty/error.
   - `ordersApi.js` — 🔲 list orders, items/events, `seller_update_order_status` RPC.
   - `reviewsApi.js` — 🔲 list reviews, reply (only `reply_body` writable).
   - `notificationsApi.js` — 🔲 list + mark read + Realtime.
   - `paymentsApi.js` — 🔲 transactions, balances, withdrawal Edge Function.
3. **`place_order()` Edge Function** — server reads real prices, verifies buyer, computes totals, creates order + items, deducts stock, fires notifications. Browser never sends prices.
4. **Real checkout page** (replace `CheckoutPlaceholder.jsx`) once `place_order()` exists.

### Medium priority — core escrow/commerce loop
5. **Payment provider integration** — charge, payout, refund (Paystack/Flutterwave; NG sellers paid out in £).
6. **Withdrawal Edge Function** + server-side balance computation.
7. **Buyer "confirm delivery"** action that releases escrow to the seller.
8. **Dashboard stat aggregates / charts** (`DashboardOverview`) — needs aggregate queries or an RPC.
9. **Notification triggers** — new order, payment, low stock, new review, payout.

### Identity verification (now via Yoti, off-platform)
10. **Yoti integration** — decided 2026-10-26, replacing Smile ID. Flow: user gets an emailed secure link → Yoti hosted flow collects full name, address, passport/licence + selfie → webhook flips `verification_status`. **Scaffolded** (`/verify` status page, `lib/verificationApi.js`, Edge Function stubs `start-verification` + `yoti-webhook`). **Still needed:** Yoti account + API keys (Edge Function secrets), email sending, deploy the two functions, implement their bodies.

### Polish / smaller gaps
11. Test the **Google OAuth callback** route end-to-end.
12. Decide whether store `email`/`phone` should be hidden from signed-out visitors (currently public).
13. Confirm the actual **escrow fee rate** (currently assumed 5%).
14. Marketing copy in `servicesContent.js` / `contactContent.js` still mentions NGN/USD — update if desired.

---

## 📊 Status at a glance

| Area | Status |
|---|---|
| Auth (email + Google) | ✅ Done (Google callback untested) |
| Verification wizard (no OTP) | ✅ Done |
| Access rules & gating (auth-based + role landing) | ✅ Done |
| Seller dashboard UI | ✅ Done |
| Seller dashboard — store + products (Supabase) | ✅ Wired (real store/products, create & edit, image uploads) |
| Seller dashboard — orders/payments/reviews/notifications/overview | 🔲 Still on mocks (blocked on orders/payments features) |
| Marketplace pages | ✅ Built + wired to Supabase |
| Cart | ✅ Done (checkout is a placeholder) |
| Database schema | ✅ Written — 🔲 confirm applied |
| `place_order()` / checkout | 🔲 Not started |
| Payments / payouts / refunds | 🔲 Not started |
| Escrow release (confirm delivery) | 🔲 Not started |
| Yoti ID verification | 🟡 Scaffolded (needs account/keys/email) |

**Next recommended step:** confirm the v3 schema is live in Supabase, then wire `storeApi.js` + `productsApi.js` to real queries (this creates the data buyers already see in the marketplace).











The real cause of "Invalid credentials"

There are two different emails, and they got conflated:

1. Supabase confirmation email — sent automatically at signup. You must click its link before you can log in. Until you do, login returns "Invalid login credentials." This is why your login failed.
2. Yoti ID-verification email — a separate step that is only scaffolded, not wired up yet, so it will never send anything right now. It's not supposed to arrive at signup.

So you weren't getting the Yoti email (expected — not built), and you couldn't log in because the confirmation email wasn't clicked (or didn't arrive).

What you need to do in Supabase (I can't change these for you)

1. Authentication → URL Configuration: set Site URL to http://localhost:5173, and add http://localhost:5173/** to Redirect URLs (plus your Vercel URL). This is required for confirmation links, Google sign-in, and the new password-reset link to work.
2. Authentication → Providers → Email — pick one:
   - Fastest for dev: turn "Confirm email" OFF. New signups can log in immediately, no email needed.
   - Keep it ON (production-like): then reliable delivery needs custom SMTP (Auth → Emails) — the built-in sender is rate-limited and often lands in spam. Check spam too.
3. Your stuck account: it's unconfirmed. Either use the new "Resend confirmation email" button on the login page and click the link, or delete that user in Authentication → Users and sign up again (simplest if you switch Confirm-email OFF).

What I fixed/added in code

- Clear login errors + recovery: failed logins now show a friendly message, and when the cause is an unconfirmed email, a "Resend confirmation email" button appears right in the error.
- Forgot password (full flow): new "Forgot password?" link on login → /forgot-password (sends a reset link) → /reset-password (sets a new password, then sends you to log in). Both are new public routes using your auth layout.
- Proper alert UI: a reusable Alert component (error / success / info, with icon, accessible role) now replaces the bare red text on Login, Sign Up, and the two new pages.
- Email redirects wired: confirmation and reset links now return to the app (/login, /reset-password), and signup messaging now explains it's the account confirmation email (ID verification is clearly a later, separate step).

Files: components/ui/Alert.*, components/auth/ForgotPasswordForm.jsx + ResetPasswordForm.jsx, pages/ForgotPassword.jsx + ResetPassword.jsx, and edits to LoginForm, SignUpForm, supabaseAuth.js, authContent.js, App.jsx.

My recommendation to unblock yourself in under a minute: turn Confirm-email OFF and set the Site/Redirect URLs (steps 1–2a), then sign up fresh as a seller — you'll land straight on the dashboard and can create your store.

Want me to wire the Yoti verification email for real next (so that step actually sends a link), or move on to checkout/place_order?
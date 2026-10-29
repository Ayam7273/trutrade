# Yoti setup and integration

TruTrade uses [Yoti Identity Verification](https://developers.yoti.com/identity-verification) for the hosted ID check. The person stays in this app until they ask to verify. Yoti then collects their full name, address, passport or driving licence, and a selfie on Yoti’s pages. TruTrade never stores the document or the selfie.

Identity verification is separate from the signup confirmation email. Confirming an email only lets someone sign in. Yoti is what moves `profiles.verification_status` from `unverified` to `pending`, then to `verified` or `rejected`.

The browser cannot write `verification_status`. A database trigger and column grants block that. Only the Edge Functions, using the service-role key, may change it.

## What is already in the project

| Piece | Role |
| --- | --- |
| `src/pages/Verify.jsx` | Signed-in status page at `/verify`. Shows unverified, pending, verified, or rejected. The button calls `startVerification()`. |
| `src/lib/verificationApi.js` | Calls the `start-verification` Edge Function. If the function is missing or returns an error, the page says verification is not switched on yet. |
| `src/components/UnverifiedBanner/UnverifiedBanner.jsx` | Banner for a signed-in user who is not verified, linking to `/verify`. |
| `supabase/functions/start-verification/index.ts` | Scaffold. Checks the caller’s Supabase JWT, then returns HTTP 501 until Yoti is configured. |
| `supabase/functions/yoti-webhook/index.ts` | Scaffold. Accepts Yoti’s POST and does not update the profile yet. |

`/verify` is behind `RequireAuth`. Buyers and sellers can both open it. Verification does not block the marketplace or the seller dashboard.

## 1. Create the Yoti application

1. Sign in at [Yoti Hub](https://hub.yoti.com) and create an Identity Verification application.
2. Note the **Client SDK ID**.
3. Download the **PEM private key**. This key signs requests to Yoti. It never goes in the React app, in a `VITE_` variable, or in git.
4. In the application, turn on the checks this product needs:
   - ID document authenticity (passport and driving licence)
   - ID document text extraction (full name and address)
   - Liveness / face match (the selfie)
5. Add the webhook URL from step 3 below as the session notification endpoint, once the function is deployed. Subscribe it to session completion.

Use Yoti’s sandbox application until a real passport check succeeds end to end.

## 2. Store the secrets

Supabase Dashboard → Edge Functions → Secrets. Names must match the comments in the two function files.

| Secret | Value |
| --- | --- |
| `YOTI_CLIENT_SDK_ID` | Client SDK ID from the Hub |
| `YOTI_API_KEY` | Full PEM private key, including the BEGIN and END lines |
| `YOTI_SESSION_CALLBACK_URL` | Public URL of the deployed `yoti-webhook` function |
| `YOTI_WEBHOOK_AUTH_TOKEN` | Long random string you generate. Send it as the session notification auth token and check it on the webhook. |
| `VERIFICATION_EMAIL_FROM` | From-address on the domain you verify with your email provider |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are already available inside Edge Functions. Do not copy the service-role key into `.env` in this repo.

The built-in Supabase mailer is rate-limited and is a poor fit for this letter. Use Resend, Postmark, or another provider, and put that provider’s API key in a secret such as `RESEND_API_KEY`.

## 3. Deploy the two functions

From this repo, with the [Supabase CLI](https://supabase.com/docs/guides/cli) logged in and linked to the project:

```bash
supabase functions deploy start-verification
supabase functions deploy yoti-webhook --no-verify-jwt
```

`yoti-webhook` is deployed with JWT verification off because Yoti does not send a Supabase JWT. The function must reject any request whose auth token does not match `YOTI_WEBHOOK_AUTH_TOKEN` before it reads a session.

The webhook URL looks like:

```text
https://<project-ref>.supabase.co/functions/v1/yoti-webhook
```

Put that same URL in `YOTI_SESSION_CALLBACK_URL` and in the Yoti Hub notification endpoint.

## 4. What `start-verification` should do

The scaffold already rejects a missing or invalid user JWT. Replace the `501` response with the following, all on the server:

1. Create a Yoti IDV session with the SDK ID and the PEM key. Set the user tracking id to the Supabase user id so the webhook can find the profile.
2. Ask for the document, text extraction, and liveness checks listed above. Set the notification endpoint to `YOTI_SESSION_CALLBACK_URL` and the auth token to `YOTI_WEBHOOK_AUTH_TOKEN`.
3. Email the user the hosted session URL. Do not return that URL only to the browser and hope they stay on the tab. The copy on `/verify` says the link arrives by email.
4. With the service-role client, set `profiles.verification_status` to `pending` for `auth.uid()`.

The hosted session URL has the form:

```text
https://api.yoti.com/idverify/v1/web/index.html?sessionID=<sessionId>&sessionToken=<clientSessionToken>
```

Sandbox host is `https://api.yoti.com/sandbox/idverify/v1`. Keep the base URL in a secret or a constant inside the function, not in React.

After this returns success, `verificationApi.js` resolves `{ configured: true }` and `/verify` shows “We’ve emailed you a secure verification link.”

## 5. What `yoti-webhook` should do

1. Reject any method other than POST, and reject a bad or missing auth token.
2. Read the session id from the notification. Do not trust the notification body for the pass/fail result.
3. Fetch that session from the Yoti API with the SDK ID and PEM key.
4. Map the checks:
   - every required check passed → `verified`
   - otherwise → `rejected`
5. Update `public.profiles` with the service-role client:

```js
await admin
  .from('profiles')
  .update({ verification_status: outcome })
  .eq('id', userId);
```

`userId` is the tracking id stored in step 4, which is the profile id. The browser never writes this column.

The page at `/verify` reads `profile.verification_status` on the next visit. There is no polling loop yet. The banner and the status card update when the profile is loaded again (sign-in, refresh, or `refreshProfile()`).

## 6. Status values

| `verification_status` | What the person sees |
| --- | --- |
| `unverified` | “Verify your identity” and **Start identity verification** |
| `pending` | “Verification in progress” |
| `verified` | “You’re verified”. The unverified banner hides. |
| `rejected` | “We couldn’t verify your identity” and **Try again**, which starts a new session |

Unknown values are shown as unverified.

## 7. Try it

1. Deploy both functions and set the secrets.
2. Sign in as a buyer and as a seller. Open `/verify`.
3. Start verification. Confirm the email arrives and the profile row is `pending`.
4. Finish the hosted flow in Yoti’s sandbox with a test document.
5. Confirm the webhook returns 200 and the profile becomes `verified` or `rejected`.
6. Reload `/verify` and the marketplace. The badge and banner should match the row.
7. Confirm the anon key still cannot `update` `verification_status` from the browser (the request should fail).

## 8. Rules that stay in place

- Do not put the PEM, the webhook token, or the service-role key in frontend code.
- Do not accept a verification result posted from the browser.
- Do not store passport images or selfies in the `verification-documents` bucket for this flow. Yoti holds them.
- A failed or unconfigured function must keep the current behaviour: `/verify` explains that the link is not available yet, and sign-in still works.

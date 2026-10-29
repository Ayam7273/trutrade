import { requireSupabase } from './supabaseClient';

/**
 * Starts identity verification for the signed-in user.
 *
 * In production this calls the `start-verification` Edge Function, which:
 *   1. creates a Yoti identity session (server-side, using the Yoti API key
 *      held in Edge Function secrets),
 *   2. emails the user a secure link to Yoti's hosted flow where they submit
 *      their full name, address, passport/driver's licence and a selfie,
 *   3. sets profiles.verification_status to 'pending'.
 *
 * Yoti then calls our `yoti-webhook` function with the result, which flips
 * verification_status to 'verified' or 'rejected'. None of that touches the
 * browser — the frontend only kicks it off and reads the status.
 *
 * Until the Edge Function + Yoti credentials are configured, invoke() fails
 * and we resolve with { configured: false } so the UI can show a friendly
 * "setup pending" message instead of an error.
 */
export async function startVerification() {
  try {
    const { data, error } = await requireSupabase().functions.invoke('start-verification');
    if (error) return { configured: false, error };
    return { configured: true, data };
  } catch (error) {
    return { configured: false, error };
  }
}

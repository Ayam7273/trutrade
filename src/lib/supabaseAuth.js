/**
 * SETUP CHECKLIST (do this in the Supabase Dashboard, not in code):
 * 1. Authentication → Providers → Email: confirm "Enable email provider" is on.
 *    Decide whether to require email confirmation before login - if enabled,
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
import { getMyProfile } from './profile';
import { requireSupabase } from './supabaseClient';

/**
 * Creates a new account with email + password, storing extra profile
 * fields (first name, last name, phone) in the user's auth metadata.
 * Supabase sends a confirmation email by default - surface that to the
 * user in the calling component rather than assuming an instant session.
 */
export async function signUpWithEmail({ email, password, firstName, lastName, phone }) {
  const { data, error } = await requireSupabase().auth.signUp({
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
  const { data, error } = await requireSupabase().auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Signs in, then checks verification status. If the user isn't verified,
 * signs them back out immediately and returns a specific error so the
 * Login page can show "please verify your account" rather than a
 * generic auth failure.
 */
export async function signInAndCheckVerification({ email, password }) {
  const { data, error } = await signInWithEmail({ email, password });
  if (error) return { data: null, profile: null, error };

  const { profile } = await getMyProfile();

  if (!profile || profile.verification_status !== 'verified') {
    await signOut();
    return {
      data: null,
      profile: null,
      error: { message: 'Please verify your account before logging in.' },
    };
  }

  return { data, profile, error: null };
}

/**
 * Starts the Google OAuth flow. Supabase redirects the browser away and
 * back - the caller doesn't get a session synchronously, so don't expect
 * to update UI state right after calling this. Wire up an onAuthStateChange
 * listener (below) wherever the app needs to react to the resulting session.
 *
 * `redirectTo` should point at a route in this app that the user lands on
 * after Google redirects back - using `window.location.origin` keeps this
 * correct across local dev and whatever domain the app is deployed to.
 */
export async function signInWithGoogle() {
  const { data, error } = await requireSupabase().auth.signInWithOAuth({
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
  const { error } = await requireSupabase().auth.signOut();
  return { error };
}

/**
 * Fetches the current session (or null if not signed in). Useful for
 * protected-route checks on app load.
 */
export async function getCurrentSession() {
  const { data, error } = await requireSupabase().auth.getSession();
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
  const { data: { subscription } } = requireSupabase().auth.onAuthStateChange(callback);
  return { unsubscribe: () => subscription.unsubscribe() };
}

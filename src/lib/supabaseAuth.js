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
/**
 * Supabase returns a user with an empty identities array when the email is
 * already registered, and it does not set `error` (that hides which emails
 * exist). Treat that as "already registered" so the form does not tell the
 * person to confirm an account that was never created.
 */
export function signUpOutcome(data, error) {
  if (error) return { data, error };
  const identities = data?.user?.identities;
  if (data?.user && Array.isArray(identities) && identities.length === 0) {
    return {
      data,
      error: {
        code: 'user_already_exists',
        message: 'An account with this email already exists. Sign in with that password, or use a different email. One email can only be a buyer or a seller, not both.',
      },
    };
  }
  return { data, error: null };
}

/**
 * Buyer or seller chosen at signup. Stored as account_type, not role:
 * a metadata key named role is easy to confuse with the JWT role, and the
 * old signup trigger inserted a store only when it saw role = seller, which
 * rolled back the whole account when the store insert failed.
 */
export function accountTypeFromUser(user) {
  const meta = user?.user_metadata ?? {};
  const value = meta.account_type || meta.role;
  return value === 'buyer' || value === 'seller' ? value : null;
}

export async function signUpWithEmail({ email, password, firstName, lastName, phone, role }) {
  const accountType = role === 'buyer' || role === 'seller' ? role : null;
  const { data, error } = await requireSupabase().auth.signUp({
    email,
    password,
    options: {
      // Where the confirmation link returns the user after they click it.
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        first_name: firstName,
        last_name: lastName,
        phone,
        ...(accountType ? { account_type: accountType } : {}),
      },
    },
  });
  return signUpOutcome(data, error);
}

/**
 * Re-sends the signup confirmation email (for users who never received or lost
 * the original). Harmless if the account is already confirmed.
 */
export async function resendConfirmation(email) {
  const { error } = await requireSupabase().auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/login` },
  });
  return { error };
}

/**
 * Sends a password-reset email. The link returns the user to /reset-password,
 * where a temporary recovery session lets them set a new password.
 */
export async function sendPasswordReset(email) {
  const { error } = await requireSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
}

/**
 * Updates the signed-in (or recovery-session) user's password.
 */
export async function updatePassword(newPassword) {
  const { error } = await requireSupabase().auth.updateUser({ password: newPassword });
  return { error };
}

/**
 * Maps common Supabase auth errors to friendly copy. Returns `needsConfirm`
 * when the failure is an unconfirmed email so the UI can offer a resend.
 */
export function authErrorMessage(error) {
  const raw = (error?.message || '').toLowerCase();
  const code = error?.code || '';
  if (code === 'email_not_confirmed' || raw.includes('not confirmed')) {
    return {
      message: 'Please confirm your email first. Check your inbox for the confirmation link we sent when you signed up.',
      needsConfirm: true,
    };
  }
  if (code === 'invalid_credentials' || raw.includes('invalid login')) {
    return {
      message: "We couldn't sign you in. Use the password for this email, and open the confirmation link if you just signed up. A buyer and a seller cannot share one email — the seller account needs its own email address.",
      needsConfirm: true,
    };
  }
  if (raw.includes('rate limit') || code === 'over_email_send_rate_limit') {
    return { message: 'Too many attempts. Please wait a minute and try again.', needsConfirm: false };
  }
  return { message: error?.message || 'Something went wrong. Please try again.', needsConfirm: false };
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
 * Signs in an existing user and returns their profile regardless of
 * verification status. The caller is responsible for redirecting to /verify
 * if the user is not yet verified.
 */
export async function signInAndCheckVerification({ email, password }) {
  const { data, error } = await signInWithEmail({ email, password });
  if (error) return { data: null, profile: null, error };

  const { profile } = await getMyProfile();
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

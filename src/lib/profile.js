import { requireSupabase } from './supabaseClient';

/**
 * Fetches the signed-in user's profile row. Returns null if there's no
 * session or no matching row (shouldn't happen once the DB trigger from
 * the schema migration is in place, but handle it defensively).
 */
export async function getMyProfile() {
  const supabase = requireSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { profile: null, error: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return { profile: data ?? null, error };
}

/**
 * Sets the user's role (buyer/seller). The database trigger makes this a
 * one-time operation; a second call with a different role fails at the
 * database level, which is intentional.
 */
export async function setMyRole(role) {
  const supabase = requireSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: new Error('Not signed in') };

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', session.user.id)
    .select('role')
    .maybeSingle();

  if (error) return { error };
  if (!data) return { error: new Error('Profile not found') };
  return { error: null };
}

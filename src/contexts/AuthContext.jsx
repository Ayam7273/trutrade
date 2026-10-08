import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { requireSupabase } from '../lib/supabaseClient';
import { getMyProfile } from '../lib/profile';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const { profile: nextProfile } = await getMyProfile();
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  useEffect(() => {
    let isMounted = true;
    let requestId = 0;
    let subscription;

    async function hydrate(nextSession, id) {
      if (!isMounted || id !== requestId) return;
      setSession(nextSession);

      try {
        if (nextSession) {
          const { profile: nextProfile } = await getMyProfile();
          if (!isMounted || id !== requestId) return;
          setProfile(nextProfile);
        } else if (isMounted && id === requestId) {
          setProfile(null);
        }
      } finally {
        if (isMounted && id === requestId) setLoading(false);
      }
    }

    try {
      const supabase = requireSupabase();

      const initialId = ++requestId;
      supabase.auth.getSession().then(({ data: { session: next } }) => {
        hydrate(next, initialId);
      }).catch(() => {
        if (isMounted) setLoading(false);
      });

      const { data } = supabase.auth.onAuthStateChange((_event, next) => {
        const nextId = ++requestId;
        // Defer so the profile query does not run while the auth client holds its lock.
        setTimeout(() => {
          hydrate(next, nextId);
        }, 0);
      });
      subscription = data.subscription;
    } catch {
      setLoading(false);
    }

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

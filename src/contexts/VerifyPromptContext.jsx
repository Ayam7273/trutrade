import { createContext, useCallback, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import VerifyPromptModal from '../components/VerifyPromptModal/VerifyPromptModal.jsx';

const VerifyPromptContext = createContext(undefined);

export function VerifyPromptProvider({ children }) {
  const [open, setOpen] = useState(false);
  const { session, loading } = useAuth();

  // Gate storefront interactions (add to cart, favourite, message, checkout…).
  // Signed-out visitors can browse freely, but any interaction opens the
  // sign-up prompt. Once signed in, actions run with no further restriction
  // (verification status does not block interaction).
  const gate = useCallback(
    (handler) =>
      (...args) => {
        if (loading) return;
        if (!session) {
          const event = args[0];
          event?.preventDefault?.();
          event?.stopPropagation?.();
          setOpen(true);
          return;
        }
        handler(...args);
      },
    [loading, session],
  );

  return (
    <VerifyPromptContext.Provider value={{ gate }}>
      {children}
      <VerifyPromptModal open={open} onClose={() => setOpen(false)} />
    </VerifyPromptContext.Provider>
  );
}

export function useGatedAction() {
  const ctx = useContext(VerifyPromptContext);
  if (ctx === undefined) throw new Error('useGatedAction must be used inside VerifyPromptProvider');
  return ctx.gate;
}

export function useCanInteract() {
  const { session, profile } = useAuth();
  return {
    signedIn: !!session,
    verified: profile?.verification_status === 'verified',
  };
}

import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './VerifyPromptModal.module.css';

export default function VerifyPromptModal({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      dialogRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) onClose();
  }

  const from = location.pathname + location.search;

  function handleSignUp() {
    onClose();
    navigate('/signup', { state: { from } });
  }

  function handleLogIn() {
    onClose();
    navigate('/login', { state: { from } });
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-prompt-title"
        tabIndex={-1}
      >
        <h2 id="verify-prompt-title" className={styles.title}>
          Create an account to continue
        </h2>
        <p className={styles.body}>
          You can browse TruTrade freely. To add items to your cart, contact merchants, or check out, sign up or log in first.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={handleSignUp}>
            Sign up
          </button>
          <button type="button" className={styles.secondary} onClick={handleLogIn}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

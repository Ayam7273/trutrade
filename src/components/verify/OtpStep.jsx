import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requireSupabase } from '../../lib/supabaseClient';
import { maskE164, sendCodeErrorMessage, verifyCodeErrorMessage } from '../../lib/phone';
import styles from './OtpStep.module.css';

const RESEND_SECONDS = 60;

export default function OtpStep({ e164, onChangeNumber }) {
  const { refreshProfile } = useAuth();
  const inputRef = useRef(null);
  const submittingRef = useRef(false);
  const resendingRef = useRef(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const masked = maskE164(e164);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function applyDigits(value) {
    setCode(value.replace(/\D/g, '').slice(0, 6));
    setError('');
  }

  function handleFormKeyDown(event) {
    if (event.key !== 'Enter' || event.target.closest('button')) return;
    if (code.length !== 6 || submittingRef.current || resendingRef.current) return;
    event.preventDefault();
    event.currentTarget.requestSubmit();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (code.length !== 6 || submittingRef.current || resendingRef.current) return;

    submittingRef.current = true;
    setError('');
    setSubmitting(true);
    try {
      const supabase = requireSupabase();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: e164,
        token: code,
        type: 'phone_change',
      });

      if (verifyError) {
        setCode('');
        setError(verifyCodeErrorMessage(verifyError));
        inputRef.current?.focus();
        return;
      }

      let nextProfile = await refreshProfile();
      if (!nextProfile?.phone_verified) {
        await delay(500);
        nextProfile = await refreshProfile();
      }
      if (!nextProfile?.phone_verified) {
        setError('Your code was accepted, but verification has not finished. Refresh the page in a moment.');
      }
    } catch {
      setCode('');
      setError("We couldn't verify that code. Please try again.");
      inputRef.current?.focus();
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (secondsLeft > 0 || resendingRef.current || submittingRef.current) return;

    resendingRef.current = true;
    setError('');
    setResending(true);
    try {
      const supabase = requireSupabase();
      const { error: sendError } = await supabase.auth.updateUser({ phone: e164 });
      if (sendError) {
        setError(sendCodeErrorMessage(sendError));
        return;
      }
      setCode('');
      setSecondsLeft(RESEND_SECONDS);
      inputRef.current?.focus();
    } catch {
      setError("We couldn't send a code. Please try again.");
    } finally {
      resendingRef.current = false;
      setResending(false);
    }
  }

  function handleChangeNumber() {
    if (submittingRef.current || resendingRef.current) return;
    setCode('');
    onChangeNumber();
  }

  const resendLabel = resending
    ? 'Sending…'
    : secondsLeft > 0
      ? `Resend code in ${secondsLeft}s`
      : 'Resend code';

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
      <h1 className={styles.heading}>Enter your code</h1>
      <p id="otp-destination" className={styles.lede}>
        We sent a 6-digit code to {masked || 'your mobile number'}
      </p>

      <input
        id="otp-code"
        ref={inputRef}
        className={styles.code}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        pattern="[0-9]*"
        aria-label="6-digit code"
        aria-describedby="otp-destination"
        aria-invalid={error ? 'true' : 'false'}
        value={code}
        disabled={submitting}
        onChange={(event) => applyDigits(event.target.value)}
        onPaste={(event) => {
          const text = event.clipboardData?.getData('text') ?? '';
          if (!/\d/.test(text)) return;
          event.preventDefault();
          applyDigits(text);
        }}
      />

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className={styles.continue}
        disabled={code.length !== 6 || submitting || resending}
      >
        {submitting ? 'Verifying…' : 'Verify'}
      </button>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.linkButton}
          disabled={secondsLeft > 0 || resending || submitting}
          onClick={handleResend}
        >
          {resendLabel}
        </button>
        <button
          type="button"
          className={styles.linkButton}
          disabled={submitting || resending}
          onClick={handleChangeNumber}
        >
          Change number
        </button>
      </div>
    </form>
  );
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

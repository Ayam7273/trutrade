import { useRef, useState } from 'react';
import { requireSupabase } from '../../lib/supabaseClient';
import { sendCodeErrorMessage, toE164 } from '../../lib/phone';
import styles from './PhoneStep.module.css';

function fromE164(e164) {
  if (typeof e164 !== 'string') return null;
  if (/^\+234\d{10}$/.test(e164)) return { dial: '+234', national: e164.slice(4) };
  if (/^\+44\d{10}$/.test(e164)) return { dial: '+44', national: e164.slice(3) };
  return null;
}

export default function PhoneStep({ country, initialE164 = '', onSent }) {
  const restored = fromE164(initialE164);
  const [dialCode, setDialCode] = useState(restored?.dial ?? (country === 'NG' ? '+234' : '+44'));
  const [national, setNational] = useState(restored?.national ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const e164 = toE164(dialCode, national);

  function handleFormKeyDown(event) {
    if (event.key !== 'Enter' || event.target.tagName === 'SELECT' || event.target.closest('button')) return;
    if (!e164 || submittingRef.current) return;
    event.preventDefault();
    event.currentTarget.requestSubmit();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!e164 || submittingRef.current) return;

    submittingRef.current = true;
    setError('');
    setSubmitting(true);
    try {
      const supabase = requireSupabase();
      const { error: sendError } = await supabase.auth.updateUser({ phone: e164 });
      if (sendError) {
        setError(sendCodeErrorMessage(sendError));
        return;
      }
      onSent(e164);
    } catch {
      setError("We couldn't send a code. Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
      <h1 className={styles.heading}>What&apos;s your mobile number?</h1>
      <p className={styles.lede}>
        We&apos;ll text a 6-digit code to confirm it&apos;s yours.
      </p>

      <div className={styles.phoneRow}>
        <div className={styles.dialField}>
          <label htmlFor="dial-code">Dial code</label>
          <select
            id="dial-code"
            value={dialCode}
            disabled={submitting}
            onChange={(event) => {
              setDialCode(event.target.value);
              setError('');
            }}
          >
            <option value="+44">+44</option>
            <option value="+234">+234</option>
          </select>
        </div>

        <div className={styles.numberField}>
          <label htmlFor="phone-number">Mobile number</label>
          <input
            id="phone-number"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            autoCapitalize="none"
            value={national}
            disabled={submitting}
            onChange={(event) => {
              setNational(event.target.value);
              setError('');
            }}
          />
        </div>
      </div>

      <p className={styles.hint}>10 digits. A leading 0 is fine.</p>
      {e164 ? (
        <p className={styles.preview}>
          Number format: {e164}
        </p>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className={styles.continue}
        disabled={!e164 || submitting}
      >
        {submitting ? 'Sending…' : 'Send code'}
      </button>
    </form>
  );
}

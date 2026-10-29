import { useRef, useState } from 'react';
import { requireSupabase } from '../../lib/supabaseClient';
import { toE164 } from '../../lib/phone';
import { useAuth } from '../../contexts/AuthContext';
import styles from './PhoneStep.module.css';

export default function PhoneStep({ country }) {
  const { session, refreshProfile } = useAuth();
  const [dialCode, setDialCode] = useState(country === 'NG' ? '+234' : '+44');
  const [national, setNational] = useState('');
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
      const { error: saveError } = await supabase
        .from('profiles')
        .update({ phone: e164 })
        .eq('id', session.user.id);
      if (saveError) {
        setError("We couldn't save your number. Please try again.");
        return;
      }
      await refreshProfile();
    } catch {
      setError("We couldn't save your number. Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
      <h1 className={styles.heading}>What&apos;s your mobile number?</h1>
      <p className={styles.lede}>
        We&apos;ll use this to contact you about your orders.
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
        {submitting ? 'Saving…' : 'Continue'}
      </button>
    </form>
  );
}

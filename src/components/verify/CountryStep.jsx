import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requireSupabase } from '../../lib/supabaseClient';
import styles from './CountryStep.module.css';

const COUNTRIES = [
  {
    value: 'GB',
    title: 'United Kingdom',
    description: 'Verify with a UK mobile number (+44).',
  },
  {
    value: 'NG',
    title: 'Nigeria',
    description: 'Verify with a Nigerian mobile number (+234).',
  },
];

export default function CountryStep() {
  const { session, refreshProfile } = useAuth();
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selected || submittingRef.current) return;

    submittingRef.current = true;
    setError('');
    setSubmitting(true);
    try {
      if (!session?.user?.id) {
        setError('Could not save your country. Please try again.');
        return;
      }

      const supabase = requireSupabase();
      const { data, error: saveError } = await supabase
        .from('profiles')
        .update({ country: selected })
        .eq('id', session.user.id)
        .select('country')
        .maybeSingle();

      if (saveError || data?.country !== selected) {
        setError('Could not save your country. Please try again.');
        return;
      }

      await refreshProfile();
    } catch {
      setError('Could not save your country. Please try again.');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function handleFormKeyDown(event) {
    if (event.key !== 'Enter' || event.target.closest('button') || !selected || submittingRef.current) return;
    event.preventDefault();
    event.currentTarget.requestSubmit();
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
      <h1 id="country-heading" className={styles.heading}>Which country are you in?</h1>
      <p className={styles.lede}>
        This sets the dial code we suggest for your mobile number. You can still switch it on the next step.
      </p>

      <div className={styles.cards} role="radiogroup" aria-labelledby="country-heading">
        {COUNTRIES.map((country) => {
          const isSelected = selected === country.value;
          return (
            <label
              key={country.value}
              className={isSelected ? `${styles.card} ${styles.selected}` : styles.card}
            >
              <input
                className={styles.radio}
                type="radio"
                name="country"
                value={country.value}
                checked={isSelected}
                disabled={submitting}
                onChange={() => {
                  setSelected(country.value);
                  setError('');
                }}
              />
              <h2>{country.title}</h2>
              <p>{country.description}</p>
            </label>
          );
        })}
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className={styles.continue}
        disabled={!selected || submitting}
      >
        {submitting ? 'Saving…' : 'Continue'}
      </button>
    </form>
  );
}

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { setMyRole } from '../../lib/profile';
import styles from './RoleStep.module.css';

const ROLES = [
  {
    value: 'buyer',
    title: "I'm a Buyer",
    description: 'Shop verified sellers with escrow protection on every purchase.',
  },
  {
    value: 'seller',
    title: "I'm a Seller",
    description: "List products and get paid safely through TruTrade's escrow system.",
  },
];

export default function RoleStep() {
  const { profile, refreshProfile } = useAuth();
  const savedRole = profile?.role === 'buyer' || profile?.role === 'seller' ? profile.role : null;
  const [picked, setPicked] = useState(null);
  const selected = picked ?? savedRole;
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  async function handleContinue() {
    if (!selected || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const { error: roleError } = await setMyRole(selected);
      if (roleError) {
        setError(roleError.message || 'Could not save your role. Please try again.');
        return;
      }
      await refreshProfile();
      setAdvanced(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (advanced) {
    return (
      <p className={styles.placeholder}>
        Step 2 (country) is coming in the next phase — for now, this confirms role selection is wired correctly.
      </p>
    );
  }

  return (
    <div>
      <h1 id="role-heading" className={styles.heading}>Are you buying or selling?</h1>
      <p className={styles.lede}>
        This can&apos;t be changed later, so pick the one that matches how you&apos;ll mostly use TruTrade.
      </p>

      <div className={styles.cards} role="radiogroup" aria-labelledby="role-heading">
        {ROLES.map((role) => {
          const isSelected = selected === role.value;
          return (
            <label
              key={role.value}
              className={isSelected ? `${styles.card} ${styles.selected}` : styles.card}
            >
              <input
                className={styles.radio}
                type="radio"
                name="role"
                value={role.value}
                checked={isSelected}
                onChange={() => {
                  setPicked(role.value);
                  setError('');
                }}
              />
              <h2>{role.title}</h2>
              <p>{role.description}</p>
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
        type="button"
        className={styles.continue}
        disabled={!selected || submitting}
        onClick={handleContinue}
      >
        {submitting ? 'Saving…' : 'Continue'}
      </button>
    </div>
  );
}

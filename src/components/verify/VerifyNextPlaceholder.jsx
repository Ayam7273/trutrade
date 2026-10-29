import { Link } from 'react-router-dom';
import styles from './VerifyNextPlaceholder.module.css';

export default function VerifyNextPlaceholder() {
  return (
    <section className={styles.card} aria-live="polite">
      <h1 className={styles.heading}>Details saved ✓ — next up: ID verification.</h1>
      <Link
        to="/marketplace"
        style={{
          display: 'inline-block',
          marginTop: '16px',
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          color: 'var(--color-teal-dark)',
          fontWeight: 600,
        }}
      >
        Browse the marketplace for now
      </Link>
    </section>
  );
}

import styles from './VerifyNextPlaceholder.module.css';

export default function VerifyNextPlaceholder() {
  return (
    <section className={styles.card} aria-live="polite">
      <h1 className={styles.heading}>Phone verified ✓ — next up: ID verification.</h1>
    </section>
  );
}

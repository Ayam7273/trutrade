import { useId } from 'react';
import styles from './FormSection.module.css';

/**
 * A titled group of form fields, rendered as a dashboard card.
 */
export default function FormSection({ title, description, children }) {
  const headingId = useId();

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h2 id={headingId}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>
      <div className={styles.fields}>{children}</div>
    </section>
  );
}

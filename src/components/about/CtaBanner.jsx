import { useId } from 'react';
import styles from './CtaBanner.module.css';

export default function CtaBanner({ title, body, cta, ctaHref = '#signup' }) {
  const headingId = useId();

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <h2 id={headingId}>{title}</h2>
        <p className={styles.body}>{body}</p>
        <a href={ctaHref} className={styles.cta}>
          {cta}
        </a>
      </div>
    </section>
  );
}

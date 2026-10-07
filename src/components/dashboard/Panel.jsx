import { useId } from 'react';
import styles from './Panel.module.css';

/**
 * White dashboard card with a titled header. `subtitle` renders under the
 * title; `action` renders on the right (a link, badge, menu or toggle).
 */
export default function Panel({ title, subtitle, action, className = '', children }) {
  const headingId = useId();

  return (
    <section className={`${styles.panel} ${className}`} aria-labelledby={headingId}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2 id={headingId}>{title}</h2>
          {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
        </div>
        {action ? <div className={styles.action}>{action}</div> : null}
      </header>
      {children}
    </section>
  );
}

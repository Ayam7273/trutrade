import { storeStatusContent as content } from '../../../data/dashboardContent';
import styles from './StoreStatusCallout.module.css';

/**
 * Active / inactive store notice. `children` renders under the text
 * (the visibility switch on the Edit Store page).
 */
export default function StoreStatusCallout({ active, children }) {
  const copy = active ? content.active : content.inactive;

  return (
    <section
      className={active ? styles.callout : `${styles.callout} ${styles.inactive}`}
      aria-labelledby="store-status-title"
    >
      <h2 id="store-status-title" className={styles.title}>
        <span className={styles.dot} aria-hidden="true" />
        {copy.title}
      </h2>
      <p className={styles.body}>{copy.body}</p>
      {children ? <div className={styles.extra}>{children}</div> : null}
    </section>
  );
}

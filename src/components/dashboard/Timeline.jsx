import { Check, X } from 'lucide-react';
import utils from '../../styles/utilities.module.css';
import styles from './Timeline.module.css';

/**
 * Vertical progress list.
 * items: [{ id, label, detail?, time?, dateTime?, state: 'done' | 'current' | 'failed' }]
 * stateLabels: { done, current, failed } read out to screen readers.
 */
export default function Timeline({ items, stateLabels }) {
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li key={item.id} className={`${styles.item} ${styles[item.state]}`}>
          <span className={styles.marker} aria-hidden="true">
            {item.state === 'done' ? <Check size={12} strokeWidth={3} /> : null}
            {item.state === 'failed' ? <X size={12} strokeWidth={3} /> : null}
          </span>
          <div className={styles.body}>
            <p className={styles.label}>
              {item.label}
              {stateLabels ? <span className={utils.srOnly}>{` (${stateLabels[item.state]})`}</span> : null}
            </p>
            {item.detail ? <p className={styles.detail}>{item.detail}</p> : null}
            {item.time ? <time className={styles.time} dateTime={item.dateTime}>{item.time}</time> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

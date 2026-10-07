import { useId } from 'react';
import styles from './StatCard.module.css';

/**
 * KPI tile: label, icon, big value and a delta line underneath.
 * `tone` colours the icon tile and `deltaTone` the pill
 * (success, warning, info, accent).
 */
export default function StatCard({ label, value, icon, tone = 'info', delta, deltaTone = 'success', deltaNote }) {
  const labelId = useId();
  const Icon = icon;

  return (
    <article className={styles.card} aria-labelledby={labelId}>
      <div className={styles.top}>
        <h3 id={labelId} className={styles.label}>{label}</h3>
        <span className={`${styles.icon} ${styles[tone]}`} aria-hidden="true">
          <Icon size={20} />
        </span>
      </div>
      <p className={styles.value}>{value}</p>
      {delta ? (
        <p className={styles.delta}>
          <span className={`${styles.deltaPill} ${styles[`pill-${deltaTone}`]}`}>{delta}</span>
          {deltaNote}
        </p>
      ) : null}
    </article>
  );
}

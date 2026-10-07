import styles from './StatusBadge.module.css';

/**
 * Coloured label for a status. Always renders text, never colour alone.
 * Tones: success, warning, info, accent, error, neutral.
 */
export default function StatusBadge({ tone = 'neutral', children }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

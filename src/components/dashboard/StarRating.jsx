import { Star, StarHalf } from 'lucide-react';
import styles from './StarRating.module.css';

/**
 * Row of five stars with half-star support. The visual stars are hidden
 * from assistive tech; `label` carries the rating as text.
 */
export default function StarRating({ value, label, size = 14 }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const remaining = value - index;
    if (remaining >= 1) return 'full';
    if (remaining >= 0.5) return 'half';
    return 'empty';
  });

  return (
    <span className={styles.rating} role="img" aria-label={label}>
      {stars.map((kind, index) => (
        <span key={index} className={styles.star} aria-hidden="true">
          <Star size={size} className={kind === 'full' ? styles.filled : styles.empty} />
          {kind === 'half' ? <StarHalf size={size} className={`${styles.filled} ${styles.half}`} /> : null}
        </span>
      ))}
    </span>
  );
}

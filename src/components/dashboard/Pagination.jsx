import { fill } from '../../lib/format';
import styles from './Pagination.module.css';

const WINDOW = 3;

function visiblePages(page, totalPages) {
  const start = Math.max(1, Math.min(page - 1, totalPages - WINDOW + 1));
  const end = Math.min(totalPages, start + WINDOW - 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * "Showing x–y of z" summary plus Previous / page numbers / Next.
 * `labels` comes from the surface's content file.
 */
export default function Pagination({ page, pageSize, total, onChange, labels, summary }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className={styles.bar}>
      <p className={styles.summary} aria-live="polite">{summary}</p>
      {totalPages > 1 ? (
        <nav aria-label={labels.label}>
          <ul className={styles.pages}>
            <li>
              <button
                type="button"
                className={styles.button}
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
              >
                {labels.previous}
              </button>
            </li>
            {visiblePages(page, totalPages).map((n) => (
              <li key={n}>
                <button
                  type="button"
                  className={n === page ? `${styles.button} ${styles.current}` : styles.button}
                  aria-current={n === page ? 'page' : undefined}
                  aria-label={fill(labels.pageAria, { n })}
                  onClick={() => onChange(n)}
                >
                  {n}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={styles.button}
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
              >
                {labels.next}
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

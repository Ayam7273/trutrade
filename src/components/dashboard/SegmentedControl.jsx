import styles from './SegmentedControl.module.css';

/**
 * A row of mutually exclusive toggle buttons (period pickers).
 * `variant="pill"` is the grey track used at page level; "plain" sits
 * inside a panel header; "chips" is a row of separate filter pills.
 */
export default function SegmentedControl({ label, options, value, onChange, variant = 'pill' }) {
  return (
    <div className={`${styles.group} ${styles[variant]}`} role="group" aria-label={label}>
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            className={selected ? `${styles.option} ${styles.selected}` : styles.option}
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

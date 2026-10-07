import utils from '../../styles/utilities.module.css';
import styles from './FormField.module.css';

/**
 * Label + control + hint/counter + error, wired together for assistive tech.
 * `children` is a render function that receives the props the control
 * needs: ({ id, 'aria-describedby', 'aria-invalid', 'aria-required' }).
 */
export default function FormField({ id, label, required, requiredAria, hint, counter, error, children }) {
  const hintId = hint || counter ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <>
            <span className={styles.required} aria-hidden="true">*</span>
            <span className={utils.srOnly}>{` (${requiredAria})`}</span>
          </>
        ) : null}
      </label>

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required ? 'true' : undefined,
      })}

      {hint || counter ? (
        <p id={hintId} className={styles.hint}>
          <span>{hint}</span>
          {counter ? <span className={styles.counter}>{counter}</span> : null}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

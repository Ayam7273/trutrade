import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './PasswordField.module.css';

/**
 * Password input with a show/hide control. The button is type="button" so it
 * never submits the form.
 */
export default function PasswordField({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  required,
  invalid,
  describedBy,
  name,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrap}>
      <input
        id={id}
        name={name}
        className={styles.input}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        aria-invalid={invalid ? 'true' : 'false'}
        aria-describedby={describedBy}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className={styles.toggle}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        aria-controls={id}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

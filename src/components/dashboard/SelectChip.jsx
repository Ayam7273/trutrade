import { ChevronDown } from 'lucide-react';
import utils from '../../styles/utilities.module.css';
import styles from './SelectChip.module.css';

/**
 * Compact filter dropdown that reads "Prefix: Value" (e.g. "Date: Last 30 Days").
 * Native <select> underneath, so keyboard and screen reader support come free.
 * Variants: "outline" (white with border) and "filled" (grey chip).
 */
export default function SelectChip({ id, label, prefix, value, options, onChange, variant = 'outline' }) {
  return (
    <div className={`${styles.chip} ${styles[variant]}`}>
      <label htmlFor={id} className={utils.srOnly}>{label}</label>
      {prefix ? <span className={styles.prefix} aria-hidden="true">{prefix}</span> : null}
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
      <ChevronDown size={16} aria-hidden="true" className={styles.icon} />
    </div>
  );
}

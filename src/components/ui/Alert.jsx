import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import styles from './Alert.module.css';

const ICONS = { error: AlertCircle, success: CheckCircle2, info: Info };

/**
 * Inline status/alert banner for forms and pages.
 * variant: 'error' | 'success' | 'info'. Errors announce assertively.
 * Pass `onClose` to show a dismiss button, and `action` for a trailing control
 * (e.g. a "Resend email" button).
 */
export default function Alert({ variant = 'info', children, onClose, action, className = '' }) {
  const Icon = ICONS[variant] ?? Info;
  return (
    <div
      className={`${styles.alert} ${styles[variant]} ${className}`.trim()}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon size={18} className={styles.icon} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.message}>{children}</p>
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
      {onClose ? (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Dismiss">
          <X size={16} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

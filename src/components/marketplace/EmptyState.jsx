import styles from './EmptyState.module.css';

export default function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className={styles.wrap}>
      {Icon ? <Icon size={40} className={styles.icon} aria-hidden="true" /> : null}
      <p className={styles.title}>{title}</p>
      {body ? <p className={styles.body}>{body}</p> : null}
      {action ?? null}
    </div>
  );
}

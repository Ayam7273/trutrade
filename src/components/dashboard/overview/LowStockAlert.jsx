import Panel from '../Panel.jsx';
import StatusBadge from '../StatusBadge.jsx';
import Button from '../../ui/Button.jsx';
import { lowStockContent as content } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import styles from './LowStockAlert.module.css';

export default function LowStockAlert({ items }) {
  const hasItems = items.length > 0;

  return (
    <Panel
      title={content.title}
      action={hasItems ? <StatusBadge tone="error">{content.badge}</StatusBadge> : null}
    >
      {hasItems ? (
        <>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span className={styles.left}>{fill(content.leftLabel, { n: item.left })}</span>
              </li>
            ))}
          </ul>
          <Button to={content.ctaHref} variant="outlineOrange" size="sm" block>
            {content.cta}
          </Button>
        </>
      ) : (
        <p className={styles.empty} role="status">{content.empty}</p>
      )}
    </Panel>
  );
}

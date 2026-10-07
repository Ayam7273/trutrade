import Panel from '../Panel.jsx';
import Button from '../../ui/Button.jsx';
import { withdrawalSummaryContent as content } from '../../../data/dashboardContent';
import { formatLongDate, formatMoney } from '../../../lib/format';
import styles from './WithdrawalSummary.module.css';

export default function WithdrawalSummary({ withdrawal }) {
  return (
    <Panel title={content.title}>
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>{content.nextAmount}</dt>
          <dd className={styles.amount}>{formatMoney(withdrawal.nextAmount, withdrawal.currency)}</dd>
        </div>
        <div className={styles.row}>
          <dt>{content.estimatedDate}</dt>
          <dd>{formatLongDate(withdrawal.estimatedDate)}</dd>
        </div>
      </dl>
      <Button to={content.ctaHref} block>{content.cta}</Button>
    </Panel>
  );
}

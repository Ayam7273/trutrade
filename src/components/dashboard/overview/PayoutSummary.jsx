import Panel from '../Panel.jsx';
import Button from '../../ui/Button.jsx';
import { payoutSummaryContent as content } from '../../../data/dashboardContent';
import { formatMoney, formatShortDate } from '../../../lib/format';
import styles from './PayoutSummary.module.css';

export default function PayoutSummary({ payouts }) {
  const { currency } = payouts;

  return (
    <Panel title={content.title}>
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>{content.available}</dt>
          <dd className={styles.available}>{formatMoney(payouts.available, currency)}</dd>
        </div>
        <div className={styles.row}>
          <dt>{content.pending}</dt>
          <dd>{formatMoney(payouts.pending, currency)}</dd>
        </div>
        <div className={styles.row}>
          <dt>{content.next}</dt>
          <dd>
            {formatMoney(payouts.next.amount, currency)}
            {' · '}
            <span className={styles.date}>{formatShortDate(payouts.next.date)}</span>
          </dd>
        </div>
      </dl>
      <Button to={content.ctaHref} size="sm" block>
        {content.cta}
      </Button>
    </Panel>
  );
}

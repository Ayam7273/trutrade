import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Copy } from 'lucide-react';
import PageHeader from '../PageHeader.jsx';
import Panel from '../Panel.jsx';
import StatusBadge from '../StatusBadge.jsx';
import Timeline from '../Timeline.jsx';
import Button from '../../ui/Button.jsx';
import {
  timelineStateLabels,
  transactionDetailContent as content,
  transactionsContent,
  withdrawContent,
} from '../../../data/dashboardContent';
import { fill, formatDateTime, formatLongDate, formatSignedMoney } from '../../../lib/format';
import { useOrders } from '../../../lib/ordersApi';
import { useWithdrawal } from '../../../lib/paymentsApi';
import { mockPayoutSpeedHours } from '../../../lib/dashboardMock';
import styles from './TransactionDetail.module.css';

const STATUS_TONE = { completed: 'success', pending: 'warning', failed: 'error' };

// Steps for the Progress card: every step is done, except that a pending
// transaction's last step is in progress and a failed one's last step failed.
function progressItems(txn) {
  const labels = content.timeline[txn.type]?.[txn.status] ?? [];
  return labels.map((label, index) => {
    const last = index === labels.length - 1;
    let state = 'done';
    if (last && txn.status === 'pending') state = 'current';
    if (last && txn.status === 'failed') state = 'failed';
    return { id: `${txn.id}-${index}`, label, state };
  });
}

export default function TransactionDetail({ txn }) {
  const orders = useOrders();
  const withdrawal = useWithdrawal();
  const { state } = useLocation();
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    if (!copyMessage) return undefined;
    const timer = setTimeout(() => setCopyMessage(''), 2500);
    return () => clearTimeout(timer);
  }, [copyMessage]);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(txn.id);
      setCopyMessage(content.copied);
    } catch {
      setCopyMessage(content.copyFailed);
    }
  }

  const order = txn.orderId ? orders.find((item) => item.id === txn.orderId) : null;
  const description = fill(transactionsContent.descriptions[txn.type], { order: txn.orderId ?? '' });
  const credit = txn.amount > 0;
  const { details } = content;
  const { account } = withdrawal;

  const rows = [
    {
      id: 'id',
      label: details.id,
      value: (
        <span className={styles.idRow}>
          {txn.id}
          <button type="button" className={styles.copy} onClick={copyId}>
            <Copy size={14} aria-hidden="true" />
            {content.copy}
          </button>
        </span>
      ),
    },
    { id: 'type', label: details.type, value: transactionsContent.typeLabels[txn.type] },
    { id: 'description', label: details.description, value: description },
    { id: 'date', label: details.date, value: txn.createdAt ? formatDateTime(txn.createdAt) : formatLongDate(txn.date) },
  ];
  if (order) {
    rows.push({
      id: 'order',
      label: details.order,
      value: <Link to={`/dashboard/orders/${encodeURIComponent(order.id)}`} className={styles.link}>#{order.id}</Link>,
    });
    rows.push({ id: 'customer', label: details.customer, value: order.customer });
  }
  if (txn.type === 'payout') {
    rows.push({ id: 'account', label: details.account, value: fill(details.accountLine, { bank: account.bank, last4: account.last4 }) });
    if (txn.note) rows.push({ id: 'note', label: details.note, value: txn.note });
    if (txn.status === 'pending') {
      rows.push({
        id: 'arrival',
        label: details.arrival,
        value: fill(withdrawContent.summary.arrivalValue, { hours: mockPayoutSpeedHours }),
      });
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={fill(content.title, { id: txn.id })}
        badge={<StatusBadge tone={STATUS_TONE[txn.status]}>{transactionsContent.statusLabels[txn.status]}</StatusBadge>}
        breadcrumbs={{
          label: content.breadcrumbLabel,
          items: [{ label: content.breadcrumbRoot, to: content.breadcrumbRootHref }, { label: txn.id }],
        }}
      />

      <p className={styles.message} role="status">{state?.requested ? content.requested : ''}</p>

      <div className={styles.grid}>
        <div className={styles.column}>
          <section className={styles.summary} aria-label={credit ? content.summary.credit : content.summary.debit}>
            <p className={styles.direction}>{credit ? content.summary.credit : content.summary.debit}</p>
            <p className={credit ? `${styles.amount} ${styles.credit}` : styles.amount}>
              {formatSignedMoney(txn.amount, txn.currency)}
            </p>
            <p className={styles.description}>{description}</p>
          </section>

          <Panel title={details.title}>
            <dl className={styles.details}>
              {rows.map((row) => (
                <div key={row.id} className={styles.row}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.copyMessage} role="status">{copyMessage}</p>
          </Panel>
        </div>

        <div className={styles.column}>
          <Panel title={content.timeline.title}>
            <Timeline items={progressItems(txn)} stateLabels={timelineStateLabels} />
          </Panel>

          {txn.status === 'failed' ? (
            <Panel title={transactionsContent.statusLabels.failed}>
              <p className={styles.help}>{content.help.failed}</p>
              <div className={styles.helpButtons}>
                <Button to={withdrawContent.destination.manageHref} variant="outline" size="sm">
                  {content.help.checkAccount}
                </Button>
                <Button to={content.help.contactHref} variant="outline" size="sm">{content.help.contact}</Button>
              </div>
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  );
}

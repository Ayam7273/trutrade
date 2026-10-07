import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Package } from 'lucide-react';
import ConfirmDialog from '../ConfirmDialog.jsx';
import PageHeader from '../PageHeader.jsx';
import Panel from '../Panel.jsx';
import StatusBadge from '../StatusBadge.jsx';
import Timeline from '../Timeline.jsx';
import Button from '../../ui/Button.jsx';
import { ORDER_STATUS_STYLE } from '../orderStatus';
import {
  orderDetailContent as content,
  orderStatusLabels,
  timelineStateLabels,
  transactionsContent,
} from '../../../data/dashboardContent';
import { fill, formatDateTime, formatLongDate, formatMoney, formatTime, plural } from '../../../lib/format';
import { SELLER_TRANSITIONS, getOrderDetails, getOrderHistory, updateOrderStatus } from '../../../lib/ordersApi';
import { useTransactions } from '../../../lib/paymentsApi';
import controls from '../FormField.module.css';
import styles from './OrderDetail.module.css';

function paymentState(status) {
  if (status === 'cancelled') return 'refunded';
  if (status === 'delivered') return 'released';
  return 'held';
}

function timelineItems(order, history) {
  const items = history.map((entry, index) => {
    let detail = null;
    if (entry.event === 'shipped' && entry.carrier) {
      detail = entry.tracking
        ? fill(content.timeline.tracking, { carrier: entry.carrier, tracking: entry.tracking })
        : fill(content.timeline.carrierOnly, { carrier: entry.carrier });
    }
    if (entry.event === 'cancelled' && entry.reason) detail = fill(content.timeline.reason, { reason: entry.reason });
    return {
      id: `${entry.event}-${index}`,
      label: content.timeline.events[entry.event],
      detail,
      time: formatDateTime(entry.at),
      dateTime: entry.at,
      state: 'done',
    };
  });
  const waiting = content.timeline.waiting[order.status];
  if (waiting) items.push({ id: 'waiting', label: waiting, state: 'current' });
  return items;
}

export default function OrderDetail({ order }) {
  const transactions = useTransactions();
  const details = useMemo(() => getOrderDetails(order), [order]);
  const history = getOrderHistory(order);
  const allowed = SELLER_TRANSITIONS[order.status];

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [carrier, setCarrier] = useState(content.shipForm.carriers[0]);
  const [tracking, setTracking] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState(content.cancelDialog.reasons[0]);
  const carrierRef = useRef(null);

  useEffect(() => {
    if (shipping) carrierRef.current?.focus();
  }, [shipping]);

  async function changeStatus(status, extra) {
    setBusy(true);
    const { error: updateError } = await updateOrderStatus(order.id, status, extra);
    setBusy(false);
    if (updateError) {
      setError(content.messages.failed);
      return false;
    }
    setError('');
    setMessage(content.messages[status]);
    return true;
  }

  async function confirmShipment(event) {
    event.preventDefault();
    const ok = await changeStatus('shipped', { carrier, tracking: tracking.trim() || null });
    if (ok) setShipping(false);
  }

  async function confirmCancel() {
    const ok = await changeStatus('cancelled', { reason });
    if (ok) setCancelOpen(false);
  }

  let action = null;
  if (order.status === 'pending') {
    action = <Button onClick={() => changeStatus('processing')} disabled={busy}>{content.actions.accept}</Button>;
  } else if (order.status === 'processing' && !shipping) {
    action = <Button onClick={() => setShipping(true)} disabled={busy}>{content.actions.ship}</Button>;
  }

  const placedAt = history[0]?.at ?? `${order.date}T09:00:00`;
  const payment = content.payment.states[paymentState(order.status)];
  const relatedTxn = transactions.find((txn) => txn.orderId === order.id
    && txn.type === (order.status === 'cancelled' ? 'refund' : 'sale'));
  const [street, area, city, country] = details.address;

  return (
    <div className={styles.page}>
      <PageHeader
        title={fill(content.title, { id: order.id })}
        subtitle={fill(content.placedOn, { date: formatLongDate(placedAt), time: formatTime(placedAt) })}
        badge={(
          <StatusBadge tone={ORDER_STATUS_STYLE[order.status].tone}>{orderStatusLabels[order.status]}</StatusBadge>
        )}
        breadcrumbs={{
          label: content.breadcrumbLabel,
          items: [{ label: content.breadcrumbRoot, to: content.breadcrumbRootHref }, { label: `#${order.id}` }],
        }}
        action={action}
      />

      <p className={styles.message} role="status">{message}</p>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      <div className={styles.grid}>
        <div className={styles.column}>
          <Panel
            title={content.items.title}
            action={<span className={styles.count}>{plural(content.items.count, order.items)}</span>}
          >
            <ul className={styles.lines}>
              {details.lines.map((line) => (
                <li key={line.productId} className={styles.line}>
                  <span className={styles.thumb} aria-hidden="true"><Package size={20} /></span>
                  <div className={styles.lineText}>
                    <Link to={`/dashboard/products/${encodeURIComponent(line.productId)}/edit`} className={styles.lineName}>
                      {line.name}
                    </Link>
                    <p className={styles.lineMeta}>
                      {fill(content.items.quantity, { n: line.quantity })}
                      {' · '}
                      {fill(content.items.each, { price: formatMoney(line.total / line.quantity, order.currency) })}
                    </p>
                  </div>
                  <span className={styles.lineTotal}>{formatMoney(line.total, order.currency)}</span>
                </li>
              ))}
            </ul>
            <dl className={styles.totals}>
              <div>
                <dt>{content.items.subtotal}</dt>
                <dd>{formatMoney(order.amount, order.currency)}</dd>
              </div>
              <div>
                <dt>{content.items.delivery}</dt>
                <dd>{content.items.deliveryIncluded}</dd>
              </div>
              <div className={styles.grandTotal}>
                <dt>{content.items.total}</dt>
                <dd>{formatMoney(order.amount, order.currency)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title={content.timeline.title}>
            <Timeline items={timelineItems(order, history)} stateLabels={timelineStateLabels} />
          </Panel>
        </div>

        <div className={styles.column}>
          <Panel title={content.nextStep.title}>
            <p className={styles.nextText}>{content.nextStep[order.status]}</p>

            {shipping ? (
              <form className={styles.shipForm} onSubmit={confirmShipment} aria-labelledby="ship-form-title">
                <h3 id="ship-form-title" className={styles.shipTitle}>{content.shipForm.title}</h3>
                <div className={styles.field}>
                  <label htmlFor="ship-carrier">{content.shipForm.carrierLabel}</label>
                  <div className={controls.selectWrap}>
                    <select
                      id="ship-carrier"
                      ref={carrierRef}
                      className={controls.select}
                      value={carrier}
                      onChange={(event) => setCarrier(event.target.value)}
                    >
                      {content.shipForm.carriers.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <ChevronDown size={18} className={controls.selectIcon} aria-hidden="true" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="ship-tracking">{content.shipForm.trackingLabel}</label>
                  <input
                    id="ship-tracking"
                    className={controls.input}
                    type="text"
                    maxLength={40}
                    value={tracking}
                    aria-describedby="ship-tracking-hint"
                    onChange={(event) => setTracking(event.target.value)}
                  />
                  <p id="ship-tracking-hint" className={styles.hint}>{content.shipForm.trackingHint}</p>
                </div>
                <div className={styles.formButtons}>
                  <Button variant="outline" size="sm" onClick={() => setShipping(false)} disabled={busy}>
                    {content.shipForm.cancel}
                  </Button>
                  <Button type="submit" size="sm" disabled={busy}>{content.shipForm.confirm}</Button>
                </div>
              </form>
            ) : null}

            {allowed.includes('cancelled') && !shipping ? (
              <Button variant="outlineDanger" size="sm" block onClick={() => setCancelOpen(true)} disabled={busy}>
                {content.actions.cancel}
              </Button>
            ) : null}
          </Panel>

          <Panel
            title={content.payment.title}
            action={<StatusBadge tone={payment.tone}>{payment.badge}</StatusBadge>}
          >
            <p className={styles.paymentAmount}>{formatMoney(order.amount, order.currency)}</p>
            <p className={styles.paymentBody}>{payment.body}</p>
            {relatedTxn ? (
              <Link
                to={fill(transactionsContent.detailHref, { id: encodeURIComponent(relatedTxn.id) })}
                className={styles.textLink}
              >
                {content.payment.viewTransaction}
              </Link>
            ) : null}
          </Panel>

          <Panel title={content.customer.title}>
            <p className={styles.customerName}>{order.customer}</p>
            <dl className={styles.info}>
              <div>
                <dt>{content.customer.email}</dt>
                <dd><a href={`mailto:${details.email}`}>{details.email}</a></dd>
              </div>
              <div>
                <dt>{content.customer.phone}</dt>
                <dd><a href={`tel:${details.phone.replace(/\s+/g, '')}`}>{details.phone}</a></dd>
              </div>
            </dl>
          </Panel>

          <Panel title={content.delivery.title}>
            <dl className={styles.info}>
              <div>
                <dt>{content.delivery.method}</dt>
                <dd>{details.delivery}</dd>
              </div>
              <div>
                <dt>{content.delivery.address}</dt>
                <dd>
                  <address className={styles.address}>
                    {street}<br />{area}<br />{city}, {country}
                  </address>
                </dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        title={content.cancelDialog.title}
        confirmLabel={content.cancelDialog.confirm}
        cancelLabel={content.cancelDialog.keep}
        onConfirm={confirmCancel}
        onCancel={() => setCancelOpen(false)}
        busy={busy}
      >
        <p>{fill(content.cancelDialog.body, { amount: formatMoney(order.amount, order.currency) })}</p>
        <div className={styles.field}>
          <label htmlFor="cancel-reason">{content.cancelDialog.reasonLabel}</label>
          <div className={controls.selectWrap}>
            <select
              id="cancel-reason"
              className={controls.select}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              {content.cancelDialog.reasons.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <ChevronDown size={18} className={controls.selectIcon} aria-hidden="true" />
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}

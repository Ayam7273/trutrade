import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../DataTable.jsx';
import Pagination from '../Pagination.jsx';
import SelectChip from '../SelectChip.jsx';
import StatusBadge from '../StatusBadge.jsx';
import { transactionsContent as content } from '../../../data/dashboardContent';
import { fill, formatLongDate, formatSignedMoney } from '../../../lib/format';
import utils from '../../../styles/utilities.module.css';
import styles from './TransactionsList.module.css';

const PAGE_SIZE = 10;
const STATUS_TONE = { completed: 'success', pending: 'warning', failed: 'error' };

function Description({ txn }) {
  const template = content.descriptions[txn.type];
  if (!txn.orderId) return template;
  return (
    <Link to={fill(content.orderHref, { id: encodeURIComponent(txn.orderId) })} className={styles.orderLink}>
      {fill(template, { order: txn.orderId })}
    </Link>
  );
}

const COLUMNS = [
  { key: 'id', header: content.columns.id, emphasis: true },
  { key: 'description', header: content.columns.description, render: (txn) => <Description txn={txn} /> },
  { key: 'type', header: content.columns.type, muted: true, render: (txn) => content.typeLabels[txn.type] },
  {
    key: 'amount',
    header: content.columns.amount,
    render: (txn) => (
      <span className={txn.amount > 0 ? `${styles.amount} ${styles.credit}` : styles.amount}>
        {formatSignedMoney(txn.amount, txn.currency)}
      </span>
    ),
  },
  {
    key: 'status',
    header: content.columns.status,
    render: (txn) => <StatusBadge tone={STATUS_TONE[txn.status]}>{content.statusLabels[txn.status]}</StatusBadge>,
  },
  { key: 'date', header: content.columns.date, muted: true, render: (txn) => formatLongDate(txn.date) },
  {
    key: 'action',
    header: content.columns.action,
    align: 'end',
    render: (txn) => (
      <Link
        to={fill(content.detailHref, { id: encodeURIComponent(txn.id) })}
        className={styles.details}
        aria-label={fill(content.detailsAria, { id: txn.id })}
      >
        {content.details}
      </Link>
    ),
  },
];

export default function TransactionsList({ transactions, status = 'ready' }) {
  const [type, setType] = useState('all');
  const [txnStatus, setTxnStatus] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => transactions.filter((txn) => (type === 'all' || txn.type === type)
      && (txnStatus === 'all' || txn.status === txnStatus)),
    [transactions, type, txnStatus],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function changeFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  let summary = content.showingNone;
  if (filtered.length === 1) summary = content.showingOne;
  else if (filtered.length > 1) {
    summary = fill(content.showing, { from: start + 1, to: start + visible.length, total: filtered.length });
  }

  return (
    <section className={styles.card} aria-labelledby="transactions-heading">
      <h2 id="transactions-heading" className={utils.srOnly}>{content.title}</h2>

      <div className={styles.filters}>
        <span className={styles.filterBy}>{content.filterBy}</span>
        <SelectChip
          id="txn-type"
          label={content.typeLabel}
          prefix={content.typePrefix}
          value={type}
          options={content.typeOptions}
          onChange={changeFilter(setType)}
          variant="filled"
        />
        <SelectChip
          id="txn-status"
          label={content.statusLabel}
          prefix={content.statusPrefix}
          value={txnStatus}
          options={content.statusOptions}
          onChange={changeFilter(setTxnStatus)}
          variant="filled"
        />
      </div>

      <DataTable
        columns={COLUMNS}
        rows={visible}
        getRowKey={(txn) => txn.id}
        status={status}
        messages={{
          loading: content.loading,
          error: content.error,
          empty: type !== 'all' || txnStatus !== 'all' ? content.emptyFiltered : content.empty,
        }}
      />

      <Pagination
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onChange={setPage}
        labels={content.pagination}
        summary={summary}
      />
    </section>
  );
}

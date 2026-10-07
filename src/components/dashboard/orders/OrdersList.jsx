import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import DataTable from '../DataTable.jsx';
import Pagination from '../Pagination.jsx';
import SelectChip from '../SelectChip.jsx';
import StatusBadge from '../StatusBadge.jsx';
import Tabs from '../Tabs.jsx';
import Button from '../../ui/Button.jsx';
import { ORDER_STATUS_STYLE } from '../orderStatus';
import {
  orderStatusLabels,
  ordersPageContent as content,
  recentOrdersContent,
} from '../../../data/dashboardContent';
import { downloadCsv, toCsv } from '../../../lib/csv';
import { fill, formatMoney, formatShortDate, localIsoDate, plural } from '../../../lib/format';
import utils from '../../../styles/utilities.module.css';
import styles from './OrdersList.module.css';

const PAGE_SIZE = 10;
const PANEL_ID = 'orders-panel';
const TAB_PREFIX = 'orders-tab';

function cutoffFor(rangeId) {
  const range = content.dateRanges.find((option) => option.id === rangeId);
  if (!range?.days) return null;
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - range.days);
  return localIsoDate(date);
}

const COLUMNS = [
  { key: 'id', header: content.columns.id, emphasis: true, render: (order) => `#${order.id}` },
  { key: 'customer', header: content.columns.customer },
  {
    key: 'items',
    header: content.columns.items,
    muted: true,
    render: (order) => plural(recentOrdersContent.itemCount, order.items),
  },
  {
    key: 'total',
    header: content.columns.total,
    emphasis: true,
    render: (order) => formatMoney(order.amount, order.currency),
  },
  {
    key: 'payment',
    header: content.columns.payment,
    render: (order) => (
      <span className={`${styles.payment} ${styles[`payment-${order.payment}`]}`}>
        {content.paymentLabels[order.payment]}
      </span>
    ),
  },
  {
    key: 'status',
    header: content.columns.status,
    render: (order) => (
      <StatusBadge tone={ORDER_STATUS_STYLE[order.status].tone}>{orderStatusLabels[order.status]}</StatusBadge>
    ),
  },
  { key: 'date', header: content.columns.date, muted: true, render: (order) => formatShortDate(order.date) },
  {
    key: 'action',
    header: content.columns.action,
    align: 'end',
    render: (order) => (
      <Link
        to={fill(content.detailHref, { id: encodeURIComponent(order.id) })}
        className={styles.view}
        aria-label={fill(content.viewAria, { id: order.id })}
      >
        {content.view}
      </Link>
    ),
  },
];

export default function OrdersList({ orders, status = 'ready' }) {
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [range, setRange] = useState(content.defaultDateRange);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase().replace(/^#/, '');
    const cutoff = cutoffFor(range);
    return orders.filter((order) => {
      if (tab !== 'all' && order.status !== tab) return false;
      if (cutoff && order.date < cutoff) return false;
      if (!needle) return true;
      return order.id.toLowerCase().includes(needle) || order.customer.toLowerCase().includes(needle);
    });
  }, [orders, tab, query, range]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const hasFilters = tab !== 'all' || query.trim() !== '' || range !== 'all';

  function changeFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  function handleExport() {
    const rows = filtered.map((order) => [
      `#${order.id}`,
      order.customer,
      order.items,
      order.amount,
      order.currency,
      content.paymentLabels[order.payment],
      orderStatusLabels[order.status],
      order.date,
    ]);
    const today = localIsoDate();
    downloadCsv(fill(content.exportFilename, { date: today }), toCsv(content.csvColumns, rows));
  }

  let summary = content.showingNone;
  if (filtered.length === 1) summary = content.showingOne;
  else if (filtered.length > 1) {
    summary = fill(content.showing, { from: start + 1, to: start + visible.length, total: filtered.length });
  }

  return (
    <section className={styles.card} aria-labelledby="orders-list-heading">
      <h2 id="orders-list-heading" className={utils.srOnly}>{content.title}</h2>

      <Tabs
        label={content.tabsLabel}
        tabs={content.tabs}
        value={tab}
        onChange={changeFilter(setTab)}
        panelId={PANEL_ID}
        idPrefix={TAB_PREFIX}
      />

      <div className={styles.toolbar}>
        <div className={styles.search} role="search">
          <label htmlFor="orders-search" className={utils.srOnly}>{content.searchLabel}</label>
          <Search size={18} aria-hidden="true" className={styles.searchIcon} />
          <input
            id="orders-search"
            type="search"
            placeholder={content.searchPlaceholder}
            value={query}
            onChange={(event) => changeFilter(setQuery)(event.target.value)}
          />
        </div>

        <div className={styles.date}>
          <SelectChip
            id="orders-date"
            label={content.dateLabel}
            prefix={content.datePrefix}
            value={range}
            options={content.dateRanges}
            onChange={changeFilter(setRange)}
          />
        </div>

        <Button
          variant="outline"
          className={styles.export}
          onClick={handleExport}
          disabled={filtered.length === 0}
        >
          {content.exportCsv}
        </Button>
      </div>

      <div id={PANEL_ID} role="tabpanel" aria-labelledby={`${TAB_PREFIX}-${tab}`} className={styles.panel}>
        <DataTable
          columns={COLUMNS}
          rows={visible}
          getRowKey={(order) => order.id}
          status={status}
          messages={{
            loading: content.loading,
            error: content.error,
            empty: hasFilters ? content.emptyFiltered : content.empty,
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
      </div>
    </section>
  );
}

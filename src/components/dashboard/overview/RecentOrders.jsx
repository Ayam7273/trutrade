import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Panel from '../Panel.jsx';
import DataTable from '../DataTable.jsx';
import StatusBadge from '../StatusBadge.jsx';
import { ORDER_STATUS_STYLE } from '../orderStatus';
import { orderStatusLabels, recentOrdersContent as content } from '../../../data/dashboardContent';
import { fill, formatMoney, formatShortDate, plural } from '../../../lib/format';
import styles from './RecentOrders.module.css';

const COLUMNS = [
  { key: 'id', header: content.columns.id, emphasis: true, render: (order) => `#${order.id}` },
  { key: 'customer', header: content.columns.customer },
  { key: 'items', header: content.columns.items, muted: true, render: (order) => plural(content.itemCount, order.items) },
  { key: 'amount', header: content.columns.amount, emphasis: true, render: (order) => formatMoney(order.amount, order.currency) },
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

export default function RecentOrders({ orders, status = 'ready' }) {
  return (
    <Panel
      title={content.title}
      action={(
        <Link to={content.viewAllHref}>
          {content.viewAll}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    >
      <DataTable
        columns={COLUMNS}
        rows={orders}
        getRowKey={(order) => order.id}
        status={status}
        messages={content}
      />
    </Panel>
  );
}

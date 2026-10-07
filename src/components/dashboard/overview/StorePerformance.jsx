import Panel from '../Panel.jsx';
import { storePerformanceContent as content } from '../../../data/dashboardContent';
import { fill, formatMoney, formatNumber } from '../../../lib/format';
import styles from './StorePerformance.module.css';

export default function StorePerformance({ performance }) {
  const rows = [
    {
      id: 'listed',
      label: content.metrics.listed,
      value: formatNumber(performance.listed.value),
      ratio: performance.listed.value / performance.listed.target,
      color: 'var(--color-chart-purple)',
    },
    {
      id: 'sold',
      label: content.metrics.sold,
      value: formatNumber(performance.sold.value),
      ratio: performance.sold.value / performance.sold.target,
      color: 'var(--color-chart-green)',
    },
    {
      id: 'averageOrder',
      label: content.metrics.averageOrder,
      value: formatMoney(performance.averageOrder.amount, performance.averageOrder.currency),
      ratio: performance.averageOrder.amount / performance.averageOrder.target,
      color: 'var(--color-chart-blue)',
    },
    {
      id: 'rating',
      label: content.metrics.rating,
      value: fill(content.ratingValue, { value: performance.rating.value }),
      ratio: performance.rating.value / 5,
      color: 'var(--color-chart-orange)',
    },
  ];

  return (
    <Panel title={content.title}>
      <dl className={styles.list}>
        {rows.map((row) => (
          <div key={row.id} className={styles.row}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
            <span className={styles.track} aria-hidden="true">
              <span
                className={styles.fill}
                style={{ width: `${Math.min(row.ratio, 1) * 100}%`, background: row.color }}
              />
            </span>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

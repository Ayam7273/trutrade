import { Link } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';
import Panel from '../Panel.jsx';
import { ORDER_STATUS_STYLE } from '../orderStatus';
import { orderOverviewContent as content, orderStatusLabels } from '../../../data/dashboardContent';
import { formatNumber } from '../../../lib/format';
import styles from './OrderOverview.module.css';

const RADIUS = 56;
const STROKE = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function OrderOverview({ breakdown }) {
  const total = breakdown.reduce((sum, row) => sum + row.count, 0);

  let offset = 0;
  const segments = breakdown.map((row) => {
    const length = total ? (row.count / total) * CIRCUMFERENCE : 0;
    const segment = { ...row, length, offset };
    offset += length;
    return segment;
  });

  return (
    <Panel
      title={content.title}
      action={(
        <Link to={content.moreHref} className={styles.more} aria-label={content.moreAria}>
          <Ellipsis size={20} aria-hidden="true" />
        </Link>
      )}
    >
      <div className={styles.donut}>
        <svg viewBox="0 0 160 160" aria-hidden="true">
          <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="var(--color-track)" strokeWidth={STROKE} />
          {segments.map((segment) => (
            <circle
              key={segment.status}
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke={ORDER_STATUS_STYLE[segment.status].color}
              strokeWidth={STROKE}
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
              strokeDashoffset={-segment.offset}
              transform="rotate(-90 80 80)"
            />
          ))}
        </svg>
        <p className={styles.center}>
          <span className={styles.total}>{formatNumber(total)}</span>
          <span className={styles.totalLabel}>{content.totalLabel}</span>
        </p>
      </div>

      <ul className={styles.legend} aria-label={content.chartAria}>
        {breakdown.map((row) => (
          <li key={row.status}>
            <span className={styles.dot} style={{ background: ORDER_STATUS_STYLE[row.status].color }} aria-hidden="true" />
            <span className={styles.label}>{orderStatusLabels[row.status]}</span>
            <span className={styles.count}>{formatNumber(row.count)}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

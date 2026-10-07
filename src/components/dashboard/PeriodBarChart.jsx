import { useState } from 'react';
import Panel from './Panel.jsx';
import SegmentedControl from './SegmentedControl.jsx';
import { fill, formatMoney } from '../../lib/format';
import utils from '../../styles/utilities.module.css';
import styles from './PeriodBarChart.module.css';

const GRID_LINES = 4;

/**
 * Money bar chart with a period switcher (Sales Overview, Earnings Overview).
 *
 * series:      { [periodId]: { total, currency, points: [{ label, value }], ... } }
 * content:     { title, periods, periodLabel, chartAria }
 * formatTotal: (formattedMoney) => string shown under the title
 * footer:      (periodData) => node shown under the chart
 */
export default function PeriodBarChart({
  content,
  series,
  defaultPeriod = 'month',
  formatTotal = (total) => total,
  footer,
  showLabels = false,
}) {
  const [period, setPeriod] = useState(defaultPeriod);
  const data = series[period];
  const max = Math.max(...data.points.map((point) => point.value), 1);
  const periodLabel = content.periods.find((option) => option.id === period).label;

  return (
    <Panel
      title={content.title}
      subtitle={<p className={styles.total}>{formatTotal(formatMoney(data.total, data.currency))}</p>}
      action={(
        <SegmentedControl
          label={content.periodLabel}
          options={content.periods}
          value={period}
          onChange={setPeriod}
          variant="plain"
        />
      )}
      className={styles.panel}
    >
      <div className={styles.chart} aria-hidden="true">
        {Array.from({ length: GRID_LINES }, (_, index) => (
          <span key={index} className={styles.gridLine} style={{ bottom: `${((index + 1) / GRID_LINES) * 100}%` }} />
        ))}
        {data.points.map((point) => (
          <span
            key={point.label}
            className={styles.bar}
            style={{ height: `${(point.value / max) * 100}%` }}
            title={`${point.label}: ${formatMoney(point.value, data.currency)}`}
          />
        ))}
      </div>

      {showLabels ? (
        <div className={styles.labels} aria-hidden="true">
          {data.points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      ) : null}

      <ul className={utils.srOnly} aria-label={fill(content.chartAria, { period: periodLabel })}>
        {data.points.map((point) => (
          <li key={point.label}>{`${point.label}: ${formatMoney(point.value, data.currency)}`}</li>
        ))}
      </ul>

      {footer ? <div className={styles.footer}>{footer(data)}</div> : null}
    </Panel>
  );
}

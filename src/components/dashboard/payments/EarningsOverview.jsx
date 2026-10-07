import PeriodBarChart from '../PeriodBarChart.jsx';
import { earningsOverviewContent as content } from '../../../data/dashboardContent';
import { fill, plural } from '../../../lib/format';
import styles from './EarningsOverview.module.css';

export default function EarningsOverview({ series, payoutSpeedHours }) {
  return (
    <PeriodBarChart
      content={content}
      series={series}
      showLabels
      formatTotal={(amount) => fill(content.total, { amount })}
      footer={() => (
        <>
          {content.payoutSpeedLabel}{' '}
          <span className={styles.speed}>{plural(content.payoutSpeedValue, payoutSpeedHours)}</span>
        </>
      )}
    />
  );
}

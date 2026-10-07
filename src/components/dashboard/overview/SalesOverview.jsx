import PeriodBarChart from '../PeriodBarChart.jsx';
import { salesOverviewContent as content } from '../../../data/dashboardContent';
import { formatDelta } from '../../../lib/format';
import styles from './SalesOverview.module.css';

export default function SalesOverview({ series }) {
  return (
    <PeriodBarChart
      content={content}
      series={series}
      footer={(data) => (
        <>
          {content.compareLabel}{' '}
          <span className={styles.compareValue}>
            {formatDelta(data.delta)} {content.compareSuffix}
          </span>
        </>
      )}
    />
  );
}

import SegmentedControl from '../SegmentedControl.jsx';
import { overviewContent as content } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import styles from './OverviewHeader.module.css';

function greetingFor(hour) {
  if (hour < 12) return content.greeting.morning;
  if (hour < 18) return content.greeting.afternoon;
  return content.greeting.evening;
}

export default function OverviewHeader({ storeName, period, onPeriodChange }) {
  const greeting = fill(greetingFor(new Date().getHours()), { name: storeName });

  return (
    <div className={styles.header}>
      <div>
        <h1>
          {greeting} <span aria-hidden="true">{content.greeting.wave}</span>
        </h1>
        <p className={styles.subtitle}>{content.subtitle}</p>
      </div>
      <SegmentedControl
        label={content.periodLabel}
        options={content.periods}
        value={period}
        onChange={onPeriodChange}
      />
    </div>
  );
}

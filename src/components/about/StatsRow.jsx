import { aboutStatsContent } from '../../data/aboutContent';
import styles from './StatsRow.module.css';

export default function StatsRow() {
  return (
    <section className={styles.section} aria-label="TruTrade at a glance">
      <div className={styles.inner}>
        <div className={styles.row}>
          {aboutStatsContent.items.map((item) => (
            <article key={item.label} className={styles.stat}>
              <h3 className={styles.value}>{item.value}</h3>
              <p className={styles.label}>{item.label}</p>
            </article>
          ))}
        </div>
        <p className={styles.footnote}>{aboutStatsContent.footnote}</p>
      </div>
    </section>
  );
}

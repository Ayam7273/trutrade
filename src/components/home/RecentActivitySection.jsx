import { activityContent } from '../../data/homeContent';
import styles from './RecentActivitySection.module.css';

export default function RecentActivitySection() {
  return (
    <section className={styles.section} id="store" aria-labelledby="activity-heading">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <img src={activityContent.image} alt={activityContent.imageAlt} />
        </div>

        <div className={styles.copy}>
          <span className={styles.badge}>{activityContent.badge}</span>
          <h2 id="activity-heading">{activityContent.title}</h2>
          <p>{activityContent.body}</p>
        </div>
      </div>
    </section>
  );
}

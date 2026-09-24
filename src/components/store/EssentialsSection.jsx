import { essentialsContent } from '../../data/storeContent';
import styles from './EssentialsSection.module.css';

export default function EssentialsSection() {
  return (
    <section className={styles.section} aria-labelledby="essentials-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="essentials-heading" className={`${styles.pillBadge} ${styles.teal}`}>
            {essentialsContent.badge}
          </h2>
          <p>{essentialsContent.body}</p>
        </div>

        <div className={styles.panel}>
          {essentialsContent.items.map((item) => (
            <article key={item.title} className={styles.col}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

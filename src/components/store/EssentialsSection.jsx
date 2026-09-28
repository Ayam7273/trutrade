import { essentialsContent } from '../../data/storeContent';
import PillBadge from '../shared/PillBadge.jsx';
import styles from './EssentialsSection.module.css';

export default function EssentialsSection() {
  return (
    <section className={styles.section} aria-labelledby="essentials-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <PillBadge id="essentials-heading" tag="h2" variant="teal">
            {essentialsContent.badge}
          </PillBadge>
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

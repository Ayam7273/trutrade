import { Globe, Handshake, Shield, Zap } from 'lucide-react';
import { aboutValuesContent } from '../../data/aboutContent';
import styles from './ValuesGrid.module.css';

const ICONS = {
  Globe,
  Handshake,
  Shield,
  Zap,
};

export default function ValuesGrid() {
  return (
    <section className={styles.section} aria-labelledby="values-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.badge}>{aboutValuesContent.badge}</span>
          <h2 id="values-heading">{aboutValuesContent.title}</h2>
          <p>{aboutValuesContent.body}</p>
        </div>

        <div className={styles.grid}>
          {aboutValuesContent.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <article key={item.title} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={`${styles.iconWrap} ${styles[item.iconTone]}`} aria-hidden="true">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { BadgeCheck, BarChart3, Lock, Scale, Store, Wallet } from 'lucide-react';
import { servicesGridContent } from '../../data/servicesContent';
import PillBadge from '../shared/PillBadge.jsx';
import styles from './ServicesGrid.module.css';

const ICONS = {
  BadgeCheck,
  BarChart3,
  Lock,
  Scale,
  Store,
  Wallet,
};

export default function ServicesGrid() {
  return (
    <section className={styles.section} aria-labelledby="services-grid-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <h2 id="services-grid-heading">{servicesGridContent.title}</h2>
          <p>{servicesGridContent.body}</p>
        </div>

        <div className={styles.grid}>
          {servicesGridContent.cards.map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <article key={card.id} className={`${styles.card} ${styles[card.tone]}`}>
                <div className={`${styles.iconWrap} ${styles[card.iconTone]}`} aria-hidden="true">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div className={styles.copy}>
                  <PillBadge variant={card.badge}>{card.title}</PillBadge>
                  <p>{card.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

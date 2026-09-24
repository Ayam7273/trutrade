import { whyStoreContent } from '../../data/storeContent';
import styles from './WhyStoreHelps.module.css';

export default function WhyStoreHelps() {
  return (
    <section className={styles.section} aria-labelledby="why-store-heading">
      <div className={styles.grid}>
        <div className={styles.intro}>
          <h2 id="why-store-heading">{whyStoreContent.title}</h2>
          <p>{whyStoreContent.body}</p>
        </div>

        {whyStoreContent.cards.map((card) => (
          <article
            key={card.id}
            className={`${styles.card} ${styles[card.tone]}${card.featured ? ` ${styles.featured}` : ''}`}
          >
            <div className={styles.copy}>
              <h3 className={`${styles.pillBadge} ${styles[card.badge]}`}>{card.title}</h3>
              <p>{card.body}</p>
            </div>
            <div className={styles.art}>
              <img src={card.image} alt={card.imageAlt} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

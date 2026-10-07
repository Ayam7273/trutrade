import Avatar from '../Avatar.jsx';
import StatusBadge from '../StatusBadge.jsx';
import { myStoreContent as content } from '../../../data/dashboardContent';
import { fill, formatCompact, formatNumber, monthsSince, plural } from '../../../lib/format';
import styles from './StoreProfileCard.module.css';

function tenureLabel(joinedAt) {
  const months = Math.max(0, monthsSince(joinedAt));
  if (months < 12) return plural(content.tenure.months, months);
  return plural(content.tenure.years, Math.floor(months / 12));
}

export default function StoreProfileCard({ store }) {
  const stats = [
    { id: 'rating', label: content.stats.rating, value: fill(content.ratingValue, { value: store.rating }) },
    { id: 'products', label: content.stats.products, value: formatNumber(store.productCount) },
    { id: 'followers', label: content.stats.followers, value: formatCompact(store.followers) },
    { id: 'tenure', label: content.stats.tenure, value: tenureLabel(store.joinedAt) },
  ];

  return (
    <section className={styles.card} aria-labelledby="store-profile-name">
      <div className={styles.identity}>
        <Avatar name={store.name} src={store.logoUrl} size="xl" tone="dark" />
        <div className={styles.identityText}>
          <div className={styles.nameRow}>
            <h2 id="store-profile-name" className={styles.name}>{store.name}</h2>
            {store.verified ? <StatusBadge tone="success">{content.verified}</StatusBadge> : null}
          </div>
          <p className={styles.category}>{store.category}</p>
        </div>
      </div>

      <p className={styles.description}>{store.description}</p>

      <dl className={styles.stats} aria-label={content.statsLabel}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.stat}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

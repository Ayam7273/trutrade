import Avatar from '../Avatar.jsx';
import Panel from '../Panel.jsx';
import StatusBadge from '../StatusBadge.jsx';
import Button from '../../ui/Button.jsx';
import StoreBanner from './StoreBanner.jsx';
import { editStoreContent } from '../../../data/dashboardContent';
import { fill, formatCompact, formatNumber } from '../../../lib/format';
import styles from './StorefrontPreviewCard.module.css';

const content = editStoreContent.preview;

/**
 * Storefront header as buyers will see it, updated live from the form.
 */
export default function StorefrontPreviewCard({ store, values }) {
  const stats = [
    { id: 'rating', label: content.stats.rating, value: fill(content.rating, { value: store.rating }) },
    { id: 'products', label: content.stats.products, value: formatNumber(store.productCount) },
    { id: 'followers', label: content.stats.followers, value: formatCompact(store.followers) },
  ];

  return (
    <Panel title={content.title}>
      <div className={styles.frame}>
        <StoreBanner src={values.bannerUrl} alt="" size="sm" />
        <div className={styles.body}>
          <div className={styles.identity}>
            <Avatar name={values.name || '?'} src={values.logoUrl} size="lg" tone="dark" />
            <div className={styles.identityText}>
              <p className={styles.nameRow}>
                <span className={styles.name}>{values.name || content.namePlaceholder}</span>
                {store.verified ? <StatusBadge tone="success">{content.verified}</StatusBadge> : null}
              </p>
              <p className={styles.category}>{values.category}</p>
            </div>
          </div>

          <p className={styles.description}>{values.description || content.descriptionPlaceholder}</p>

          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.id} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>

          <Button variant="outline" block disabled aria-describedby="storefront-hint">
            {content.viewStorefront}
          </Button>
          <p id="storefront-hint" className={styles.hint}>{content.viewStorefrontHint}</p>
        </div>
      </div>
    </Panel>
  );
}

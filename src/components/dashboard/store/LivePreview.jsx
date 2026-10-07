import { Package } from 'lucide-react';
import Avatar from '../Avatar.jsx';
import Panel from '../Panel.jsx';
import StoreBanner from './StoreBanner.jsx';
import { livePreviewContent as content } from '../../../data/dashboardContent';
import { fill, formatMoney, plural } from '../../../lib/format';
import styles from './LivePreview.module.css';

/**
 * A small, non-interactive mock of the public storefront.
 */
export default function LivePreview({ store }) {
  return (
    <Panel title={content.title}>
      <figure className={styles.frame} aria-label={content.previewAria}>
        <StoreBanner src={store.bannerUrl} alt="" size="sm" />
        <div className={styles.body}>
          <div className={styles.identity}>
            <Avatar name={store.name} src={store.logoUrl} tone="dark" />
            <div>
              <p className={styles.name}>{store.name}</p>
              <p className={styles.meta}>
                {fill(content.rating, { value: store.rating })} {plural(content.reviews, store.reviewCount)}
              </p>
            </div>
          </div>

          <ul className={styles.products}>
            {store.featuredProducts.map((product) => (
              <li key={product.id} className={styles.product}>
                {product.imageUrl ? (
                  <img className={styles.image} src={product.imageUrl} alt="" />
                ) : (
                  <span className={styles.image} aria-hidden="true">
                    <Package size={20} />
                  </span>
                )}
                <p className={styles.productName}>{product.name}</p>
                <p className={styles.price}>{formatMoney(product.price, product.currency)}</p>
              </li>
            ))}
          </ul>
        </div>
      </figure>
    </Panel>
  );
}

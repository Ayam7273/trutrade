import { Link } from 'react-router-dom';
import { Check, Plus } from 'lucide-react';
import Avatar from '../dashboard/Avatar.jsx';
import ProductTile from './ProductTile.jsx';
import styles from './MerchantRow.module.css';

export default function MerchantRow({ store, isFavourited, onToggleFavourite }) {
  const activeProducts = (store.products ?? []).filter((p) => p.status === 'active');

  return (
    <div className={styles.row}>
      <div className={styles.storeInfo}>
        <div className={styles.logoWrap}>
          <Avatar
            name={store.name}
            src={store.logo_url ?? undefined}
            size="xl"
            tone="teal"
            alt={store.name}
          />
        </div>
        <div className={styles.meta}>
          <h3 className={styles.name}>{store.name}</h3>
          <p className={styles.handle}>@{store.slug}</p>
        </div>
        <div className={styles.storeActions}>
          <button
            type="button"
            className={isFavourited ? styles.favouritedBtn : styles.favouriteBtn}
            onClick={onToggleFavourite}
            aria-label={isFavourited ? `Remove ${store.name} from favourites` : `Add ${store.name} to favourites`}
          >
            {isFavourited ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
            {isFavourited ? 'Favourited' : 'Add as Favourite'}
          </button>
          <Link to={`/store/${store.slug}`} className={styles.visitBtn}>
            Visit Store
          </Link>
        </div>
      </div>

      {activeProducts.length > 0 ? (
        <div className={styles.productStrip}>
          {activeProducts.slice(0, 6).map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.noProducts}>
          <p className={styles.noProductsText}>No products available</p>
        </div>
      )}
    </div>
  );
}

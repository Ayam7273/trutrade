import { useState } from 'react';
import { formatMoney } from '../../lib/format';
import { productState } from '../../lib/products';
import styles from './ProductCard.module.css';

function firstImage(images) {
  if (!images?.length) return null;
  return [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0]?.url ?? null;
}

export default function ProductCard({ product, onDetails, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const imgUrl = firstImage(product.product_images);
  const state = productState(product);
  const isOutOfStock = state === 'out';

  async function handleAddToCart() {
    if (isOutOfStock) return;
    await onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className={styles.img} />
          : <div className={styles.imgPlaceholder} aria-hidden="true" />
        }
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.type}>Physical Product</p>
        <p className={styles.price}>{formatMoney(product.price, 'GBP')}</p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.detailsBtn} onClick={() => onDetails(product)}>
          Details
        </button>
        {isOutOfStock ? (
          <span className={styles.outOfStock}>Out of stock</span>
        ) : (
          <button type="button" className={styles.addBtn} onClick={handleAddToCart}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}

import { formatMoney } from '../../lib/format';
import styles from './ProductTile.module.css';

function firstImage(images) {
  if (!images?.length) return null;
  return [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0]?.url ?? null;
}

export default function ProductTile({ product }) {
  const imgUrl = firstImage(product.product_images);
  return (
    <div className={styles.tile}>
      <div className={styles.imgWrap}>
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className={styles.img} />
          : <div className={styles.imgPlaceholder} aria-hidden="true" />
        }
      </div>
      <p className={styles.name}>{product.name}</p>
      <p className={styles.type}>Physical Product</p>
      <p className={styles.price}>{formatMoney(product.price, 'GBP')}</p>
    </div>
  );
}

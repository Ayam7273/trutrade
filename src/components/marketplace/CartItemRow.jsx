import { Trash2 } from 'lucide-react';
import { formatMoney } from '../../lib/format';
import { useGatedAction } from '../../contexts/VerifyPromptContext';
import styles from './CartItemRow.module.css';

function firstImage(images) {
  if (!images?.length) return null;
  return [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0]?.url ?? null;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }) {
  const gate = useGatedAction();
  const product = item.products;
  const imgUrl = firstImage(product?.product_images);
  const isUnavailable = !product || product.status !== 'active';
  const lineTotal = (product?.price ?? 0) * item.quantity;

  const variations = item.selected_variations
    ? Object.entries(item.selected_variations).map(([k, v]) => `${k}: ${v}`).join(', ')
    : null;

  return (
    <div className={`${styles.row} ${isUnavailable ? styles.unavailable : ''}`}>
      <div className={styles.imgWrap}>
        {imgUrl
          ? <img src={imgUrl} alt={product?.name ?? 'Product'} className={styles.img} />
          : <div className={styles.imgPlaceholder} aria-hidden="true" />
        }
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{product?.name ?? 'Product removed'}</p>
        {product?.stores?.name ? (
          <p className={styles.soldBy}>Sold by {product.stores.name}</p>
        ) : null}
        <p className={styles.type}>Physical Product</p>
        {product ? <p className={styles.unitPrice}>{formatMoney(product.price, 'GBP')}</p> : null}
        {variations ? <p className={styles.variations}>{variations}</p> : null}
        {isUnavailable ? (
          <span className={styles.unavailableTag}>No longer available</span>
        ) : null}
      </div>

      <div className={styles.right}>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={gate(() => onRemove(item.id))}
          aria-label="Remove item"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>

        {!isUnavailable ? (
          <>
            <div className={styles.stepper}>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={gate(() => onQuantityChange(item.id, Math.max(1, item.quantity - 1)))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className={styles.qty}>{item.quantity}</span>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={gate(() => onQuantityChange(item.id, Math.min(product?.stock ?? 99, item.quantity + 1)))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className={styles.lineTotal}>{formatMoney(lineTotal, 'GBP')}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

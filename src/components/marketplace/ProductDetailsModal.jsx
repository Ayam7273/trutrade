import { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { formatMoney } from '../../lib/format';
import { productState } from '../../lib/products';
import styles from './ProductDetailsModal.module.css';

function firstImage(images) {
  if (!images?.length) return null;
  return [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0]?.url ?? null;
}

export default function ProductDetailsModal({ product, onClose, onAddToCart }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [added, setAdded] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  if (!product) return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId}
      onCancel={(e) => { e.preventDefault(); onClose(); }} />
  );

  const imgUrl = firstImage(product.product_images);
  const state = productState(product);
  const isOutOfStock = state === 'out';
  const variations = product.variations ?? [];

  async function handleAddToCart() {
    if (isOutOfStock) return;
    await onAddToCart(product, Object.keys(selectedVariations).length > 0 ? selectedVariations : null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
    >
      <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
        <X size={18} aria-hidden="true" />
      </button>

      <div className={styles.content}>
        <div className={styles.imgWrap}>
          {imgUrl
            ? <img src={imgUrl} alt={product.name} className={styles.img} />
            : <div className={styles.imgPlaceholder} aria-hidden="true" />
          }
        </div>

        <div className={styles.info}>
          <h2 id={titleId} className={styles.name}>{product.name}</h2>
          <p className={styles.price}>{formatMoney(product.price, 'GBP')}</p>
          {product.description ? (
            <p className={styles.desc}>{product.description}</p>
          ) : null}

          {variations.map((v) => (
            <div key={v.id} className={styles.variationGroup}>
              <label className={styles.varLabel}>{v.name}</label>
              <div className={styles.varOptions}>
                {v.values.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={selectedVariations[v.name] === val ? styles.varChipSelected : styles.varChip}
                    onClick={() => setSelectedVariations((prev) => ({ ...prev, [v.name]: val }))}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {isOutOfStock ? (
            <span className={styles.outOfStock}>Out of stock</span>
          ) : (
            <button type="button" className={styles.addBtn} onClick={handleAddToCart}>
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}

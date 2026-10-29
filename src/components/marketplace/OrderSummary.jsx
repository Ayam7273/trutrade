import { Link } from 'react-router-dom';
import { formatMoney } from '../../lib/format';
import { useGatedAction } from '../../contexts/VerifyPromptContext';
import { cartTotals } from '../../lib/marketplace';
import styles from './OrderSummary.module.css';

export default function OrderSummary({ items, storeName, storeId, hasUnavailable }) {
  const gate = useGatedAction();
  const { subtotal, escrowFee, total } = cartTotals(items);

  function handleCheckout() {
    window.location.href = `/checkout?store=${storeId}`;
  }

  return (
    <div className={styles.summary}>
      <h2 className={styles.heading}>Order Summary</h2>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.label}>Subtotal</span>
          <span className={styles.value}>{formatMoney(subtotal, 'GBP')}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Escrow Fee (5%)</span>
          <span className={styles.value}>{formatMoney(escrowFee, 'GBP')}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Delivery</span>
          <span className={styles.value}>Calculated at checkout</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={`${styles.row} ${styles.totalRow}`}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{formatMoney(total, 'GBP')}</span>
      </div>

      <button
        type="button"
        className={styles.checkoutBtn}
        onClick={gate(handleCheckout)}
        disabled={hasUnavailable}
        aria-label={storeName ? `Checkout with ${storeName}` : 'Proceed to Checkout'}
      >
        {storeName ? `Checkout with ${storeName}` : 'Proceed to Checkout'}
      </button>

      {hasUnavailable ? (
        <p className={styles.unavailableNote}>Remove unavailable items to proceed.</p>
      ) : null}

      <Link to="/marketplace" className={styles.continueLink}>
        Continue Shopping
      </Link>

      <p className={styles.escrowNote}>Secured by TruTrade Escrow</p>
    </div>
  );
}

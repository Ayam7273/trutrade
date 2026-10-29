import { Link } from 'react-router-dom';
import styles from './Placeholder.module.css';

export default function CheckoutPlaceholder() {
  return (
    <main className={styles.page}>
      <h1>Checkout</h1>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', marginTop: '12px' }}>
        Checkout is coming next.{' '}
        <Link to="/cart" style={{ color: 'var(--color-teal-dark)', fontWeight: 600 }}>Back to Cart</Link>
      </p>
    </main>
  );
}

import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { groupCartByStore } from '../lib/marketplace';
import CartItemRow from '../components/marketplace/CartItemRow.jsx';
import OrderSummary from '../components/marketplace/OrderSummary.jsx';
import EmptyState from '../components/marketplace/EmptyState.jsx';
import styles from './Cart.module.css';

export default function Cart() {
  const { profile } = useAuth();
  const { items, loading, updateQuantity, removeItem } = useCart();

  const isVerifiedBuyer = profile?.verification_status === 'verified' && profile?.role === 'buyer';

  if (!isVerifiedBuyer || items.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Your Cart</h1>
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            body="Browse the marketplace and add items to get started."
            action={<Link to="/marketplace" className={styles.shopLink}>Continue Shopping</Link>}
          />
        </div>
      </main>
    );
  }

  const groups = groupCartByStore(items);
  const multipleStores = groups.length > 1;
  const totalItemCount = items.length;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.subtitle}>
            Review your items before checkout · {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.items}>
            {groups.map((group) => {
              const storeItems = group.items;
              const hasUnavailable = storeItems.some(
                (item) => !item.products || item.products.status !== 'active'
              );

              return (
                <div key={group.store?.id ?? 'unknown'} className={styles.group}>
                  {multipleStores && group.store?.name ? (
                    <h2 className={styles.storeName}>{group.store.name}</h2>
                  ) : null}
                  {storeItems.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onQuantityChange={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          <aside className={styles.sidebar}>
            {groups.map((group) => {
              const storeItems = group.items;
              const availableItems = storeItems.filter(
                (item) => item.products && item.products.status === 'active'
              );
              const hasUnavailable = availableItems.length < storeItems.length;

              return (
                <OrderSummary
                  key={group.store?.id ?? 'unknown'}
                  items={availableItems}
                  storeName={multipleStores ? group.store?.name : null}
                  storeId={group.store?.id}
                  hasUnavailable={hasUnavailable}
                />
              );
            })}
          </aside>
        </div>
      </div>
    </main>
  );
}

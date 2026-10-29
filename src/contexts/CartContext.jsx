import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, addToCart as apiAddToCart, setCartQuantity as apiSetQty, removeCartItem as apiRemove } from '../lib/marketplaceApi';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { profile } = useAuth();
  const isVerifiedBuyer = profile?.verification_status === 'verified' && profile?.role === 'buyer';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isVerifiedBuyer) { setItems([]); return; }
    setLoading(true);
    try {
      const data = await fetchCart();
      setItems(data);
    } catch {
      // silently keep previous items
    } finally {
      setLoading(false);
    }
  }, [isVerifiedBuyer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const count = items.length;

  const addToCart = useCallback(async (params) => {
    const result = await apiAddToCart(params);
    await refresh();
    return result;
  }, [refresh]);

  const updateQuantity = useCallback(async (id, qty) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: qty } : item));
    try {
      await apiSetQty(id, qty);
    } catch {
      await refresh();
    }
  }, [refresh]);

  const removeItem = useCallback(async (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await apiRemove(id);
    } catch {
      await refresh();
    }
  }, [refresh]);

  return (
    <CartContext.Provider value={{ items, count, loading, addToCart, updateQuantity, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

// Data access for orders. Kept in memory like storeApi.js so status changes
// show up across the dashboard until the page reloads. When Supabase is
// connected, status changes should go through an RLS-checked update (or an
// Edge Function for cancellations, since they trigger an escrow refund).
import { useSyncExternalStore } from 'react';
import { mockOrderDetails, mockOrderHistory, mockOrders } from './dashboardMock';
import { recordRefund } from './paymentsApi';

let current = mockOrders;
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(next) {
  current = next;
  listeners.forEach((listener) => listener());
}

/**
 * Returns all orders, newest first, and re-renders when they change.
 */
export function useOrders() {
  return useSyncExternalStore(subscribe, () => current);
}

/**
 * Contact, delivery and line-item details for one order.
 */
export function getOrderDetails(order) {
  return mockOrderDetails(order);
}

/**
 * The order's status history, oldest first.
 */
export function getOrderHistory(order) {
  return order.history ?? mockOrderHistory(order);
}

// What a seller is allowed to do from each status. Delivery is confirmed by
// the buyer, which is what releases the escrow funds.
export const SELLER_TRANSITIONS = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: [],
  delivered: [],
  cancelled: [],
};

/**
 * Moves an order to `status`. `extra` is stored on the history event
 * (carrier, tracking, reason). Resolves to { data, error }.
 */
export async function updateOrderStatus(id, status, extra = {}) {
  const order = current.find((item) => item.id === id);
  if (!order) return { data: null, error: new Error('Order not found') };
  if (!SELLER_TRANSITIONS[order.status].includes(status)) {
    return { data: null, error: new Error(`Cannot move an order from ${order.status} to ${status}`) };
  }

  const event = { event: status, at: new Date().toISOString(), ...extra };
  const updated = {
    ...order,
    status,
    payment: status === 'cancelled' ? 'refunded' : order.payment,
    history: [...getOrderHistory(order), event],
  };
  update(current.map((item) => (item.id === id ? updated : item)));
  if (status === 'cancelled') await recordRefund(updated);
  return { data: updated, error: null };
}

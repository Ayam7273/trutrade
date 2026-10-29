export const ESCROW_FEE_RATE = 0.05; // confirm actual rate

export function groupCartByStore(items) {
  const groups = {};
  for (const item of items) {
    const storeId = item.products?.store_id;
    if (!storeId) continue;
    if (!groups[storeId]) groups[storeId] = { store: item.products?.stores, items: [] };
    groups[storeId].items.push(item);
  }
  return Object.values(groups);
}

export function cartTotals(items) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.products?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);
  const escrowFee = Math.round(subtotal * ESCROW_FEE_RATE * 100) / 100;
  const total = Math.round((subtotal + escrowFee) * 100) / 100;
  return { subtotal, escrowFee, total };
}

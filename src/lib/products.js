// Shared product rules, used by the Products page, the Overview and the mocks.

export const LOW_STOCK_THRESHOLD = 6;

/**
 * The single state shown in a product's Status column:
 * 'draft' | 'hidden' (not listed), else 'out' | 'low' | 'active' by stock.
 */
export function productState(product) {
  if (product.status !== 'active') return product.status;
  if (product.stock === 0) return 'out';
  if (product.stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'active';
}

/**
 * Stock bucket for filtering: 'out' | 'low' | 'in'.
 */
export function stockLevel(product) {
  if (product.stock === 0) return 'out';
  if (product.stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'in';
}

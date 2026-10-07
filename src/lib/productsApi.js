// Data access for the seller's products. Kept in memory like storeApi.js;
// swap the bodies for Supabase queries (and Storage uploads for images)
// once the `products` table exists.
import { useSyncExternalStore } from 'react';
import { mockProducts } from './dashboardMock';
import { localIsoDate } from './format';

let current = mockProducts;
let nextId = 1043;
const listeners = new Set();

function getSnapshot() {
  return current;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(next) {
  current = next;
  listeners.forEach((listener) => listener());
}

/**
 * Returns all products, newest first, and re-renders when they change.
 */
export function useProducts() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Adds a product. Resolves to { data, error } like the Supabase client.
 */
export async function createProduct(fields) {
  const product = {
    id: `PRD-${nextId}`,
    currency: 'GBP',
    rating: null,
    dateAdded: localIsoDate(),
    ...fields,
    imageUrl: fields.images?.[0]?.url ?? null,
  };
  nextId += 1;
  update([product, ...current]);
  return { data: product, error: null };
}

/**
 * Updates an existing product. Resolves to { data, error }.
 */
export async function updateProduct(id, fields) {
  const existing = current.find((product) => product.id === id);
  if (!existing) return { data: null, error: new Error('Product not found') };
  const product = { ...existing, ...fields, imageUrl: fields.images?.[0]?.url ?? null };
  update(current.map((item) => (item.id === id ? product : item)));
  return { data: product, error: null };
}

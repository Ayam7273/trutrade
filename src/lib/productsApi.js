// Data access for the seller's products, backed by Supabase (products +
// product_images, with image uploads to the product-images bucket).
//
// Components keep using useProducts() (an array, newest first) and
// createProduct()/updateProduct(); useProductsStatus() exposes
// 'loading' | 'ready' | 'error' for tables and the edit route.
import { useEffect, useSyncExternalStore } from 'react';
import { requireSupabase } from './supabaseClient';
import { localIsoDate } from './format';

let current = [];
let status = 'loading';
let started = false;
let storeId = null;
const listeners = new Set();

function getSnapshot() {
  return current;
}

function getStatus() {
  return status;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function setProducts(next) {
  current = next;
  emit();
}

function setStatus(next) {
  status = next;
  emit();
}

function safeName(name) {
  return String(name || 'file').replace(/[^a-zA-Z0-9.\-_]/g, '-');
}

function sortedImages(images) {
  return Array.isArray(images)
    ? [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    : [];
}

function mapProduct(row) {
  const images = sortedImages(row.product_images).map((img) => ({ id: img.id, url: img.url }));
  const ratings = Array.isArray(row.product_ratings) ? row.product_ratings : [];
  const avg = ratings.length
    ? ratings.reduce((sum, r) => sum + Number(r.rating ?? 0), 0) / ratings.length
    : null;
  return {
    id: row.id,
    code: row.code ?? null,
    displayId: row.code != null ? `PRD-${row.code}` : row.id,
    name: row.name ?? '',
    category: row.category ?? '',
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    discount: row.discount != null ? Number(row.discount) : null,
    currency: row.currency ?? 'GBP',
    stock: Number(row.stock ?? 0),
    status: row.status ?? 'active',
    rating: avg != null ? Math.round(avg * 10) / 10 : null,
    variations: Array.isArray(row.variations) ? row.variations : [],
    dateAdded: row.created_at ? String(row.created_at).slice(0, 10) : localIsoDate(),
    images,
    imageUrl: images[0]?.url ?? null,
  };
}

async function resolveStoreId(supabase, userId) {
  if (storeId) return storeId;
  const { data } = await supabase.from('stores').select('id').eq('owner_id', userId).maybeSingle();
  storeId = data?.id ?? null;
  return storeId;
}

async function load() {
  try {
    const supabase = requireSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      storeId = null;
      setProducts([]);
      setStatus('ready');
      return;
    }
    const id = await resolveStoreId(supabase, session.user.id);
    if (!id) {
      setProducts([]);
      setStatus('ready');
      return;
    }
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(id, url, position), product_ratings(rating)')
      .eq('store_id', id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    setProducts((data ?? []).map(mapProduct));
    setStatus('ready');
  } catch {
    setProducts([]);
    setStatus('error');
  }
}

function ensureLoaded() {
  if (started) return;
  started = true;
  load();
}

/**
 * Returns all products, newest first, and re-renders when they change.
 */
export function useProducts() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  useEffect(() => {
    ensureLoaded();
  }, []);
  return snapshot;
}

/**
 * Returns the load status: 'loading' | 'ready' | 'error'.
 */
export function useProductsStatus() {
  const snapshot = useSyncExternalStore(subscribe, getStatus);
  useEffect(() => {
    ensureLoaded();
  }, []);
  return snapshot;
}

// Uploads picked files, keeps already-saved URLs, and returns the
// product_images rows to insert (in display order; first = main image).
async function buildImageRows(supabase, userId, productId, images) {
  const rows = [];
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    let { url } = image;
    let path = image.path ?? null;
    if (image.file) {
      path = `${userId}/${Date.now()}-${i}-${safeName(image.file.name)}`;
      const { error } = await supabase.storage.from('product-images').upload(path, image.file, { upsert: true });
      if (error) throw error;
      url = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
    } else if (typeof url === 'string' && url.startsWith('blob:')) {
      // A picked image with no File handle can't be persisted — skip it.
      continue;
    }
    rows.push({ product_id: productId, url, path, position: i });
  }
  return rows;
}

function toRow(fields) {
  return {
    category: fields.category || null,
    name: fields.name,
    description: fields.description || null,
    price: fields.price,
    compare_at_price: fields.compareAtPrice ?? null,
    discount: fields.discount ?? null,
    stock: fields.stock,
    status: fields.status,
    variations: fields.variations ?? [],
  };
}

/**
 * Adds a product (and its images). Resolves to { data, error }.
 */
export async function createProduct(fields) {
  try {
    const supabase = requireSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: new Error('Not signed in') };
    const userId = session.user.id;

    const id = await resolveStoreId(supabase, userId);
    if (!id) return { data: null, error: new Error('Set up your store before adding products.') };

    const { data: product, error } = await supabase
      .from('products')
      .insert({ ...toRow(fields), store_id: id })
      .select('id')
      .single();
    if (error) return { data: null, error };

    const imageRows = await buildImageRows(supabase, userId, product.id, fields.images ?? []);
    if (imageRows.length) {
      const { error: imgError } = await supabase.from('product_images').insert(imageRows);
      if (imgError) return { data: null, error: imgError };
    }

    await load();
    return { data: product, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Updates a product (and re-syncs its images). Resolves to { data, error }.
 */
export async function updateProduct(id, fields) {
  try {
    const supabase = requireSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: new Error('Not signed in') };
    const userId = session.user.id;

    const { error } = await supabase.from('products').update(toRow(fields)).eq('id', id);
    if (error) return { data: null, error };

    // Re-sync images: upload new picks, then replace the rows in the new order.
    const imageRows = await buildImageRows(supabase, userId, id, fields.images ?? []);
    const { error: delError } = await supabase.from('product_images').delete().eq('product_id', id);
    if (delError) return { data: null, error: delError };
    if (imageRows.length) {
      const { error: imgError } = await supabase.from('product_images').insert(imageRows);
      if (imgError) return { data: null, error: imgError };
    }

    await load();
    return { data: { id }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Deletes a product. Resolves to { error }.
 */
export async function deleteProduct(id) {
  try {
    const supabase = requireSupabase();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { error };
    await load();
    return { error: null };
  } catch (error) {
    return { error };
  }
}

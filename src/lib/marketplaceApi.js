import { requireSupabase } from './supabaseClient';

export async function fetchMerchants() {
  const { data, error } = await requireSupabase()
    .from('stores')
    .select('id, slug, name, category, location, logo_url, store_stats(*), products(id, code, name, price, status, created_at, product_images(url, position))')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchStoreCategories() {
  const { data, error } = await requireSupabase()
    .from('store_categories')
    .select('name')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []).map((r) => r.name);
}

export async function fetchStoreBySlug(slug) {
  const { data, error } = await requireSupabase()
    .from('stores')
    .select('*, store_stats(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchStoreProducts(storeId) {
  const { data, error } = await requireSupabase()
    .from('products')
    .select('*, product_images(*), product_ratings(*)')
    .eq('store_id', storeId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMyFavourites() {
  const { data, error } = await requireSupabase()
    .from('favourite_stores')
    .select('store_id');
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.store_id));
}

export async function addFavourite(storeId) {
  const { error } = await requireSupabase()
    .from('favourite_stores')
    .insert({ store_id: storeId });
  if (error) throw error;
}

export async function removeFavourite(storeId) {
  const { error } = await requireSupabase()
    .from('favourite_stores')
    .delete()
    .eq('store_id', storeId);
  if (error) throw error;
}

export async function fetchCart() {
  const { data, error } = await requireSupabase()
    .from('cart_items')
    .select('id, quantity, selected_variations, products(id, code, name, price, stock, status, store_id, product_images(url, position), stores(id, name, slug))');
  if (error) throw error;
  return data ?? [];
}

export async function addToCart({ productId, quantity = 1, selectedVariations = null }) {
  const supabase = requireSupabase();
  const query = supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('product_id', productId);
  if (selectedVariations) {
    query.eq('selected_variations', JSON.stringify(selectedVariations));
  } else {
    query.is('selected_variations', null);
  }
  const { data: existing } = await query.maybeSingle();

  if (existing) {
    const newQty = Math.min(99, existing.quantity + quantity);
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', existing.id);
    if (error) throw error;
    return { id: existing.id, quantity: newQty };
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ product_id: productId, quantity, selected_variations: selectedVariations })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setCartQuantity(id, qty) {
  const { error } = await requireSupabase()
    .from('cart_items')
    .update({ quantity: qty })
    .eq('id', id);
  if (error) throw error;
}

export async function removeCartItem(id) {
  const { error } = await requireSupabase()
    .from('cart_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

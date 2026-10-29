// Data access for the seller's store profile, backed by Supabase.
//
// Every seller gets one `stores` row (the schema auto-creates an inactive
// placeholder when the seller role is chosen), so useStore() loads that row by
// owner_id and saveStore() updates it. Components keep using useStore() (an
// always-present store object, with `.loading`/`.exists` flags) and
// saveStore(changes, files) exactly as before.
import { useEffect, useSyncExternalStore } from 'react';
import { requireSupabase } from './supabaseClient';

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY_STORE = {
  id: null,
  ownerId: null,
  exists: false,
  loading: true,
  name: '',
  slug: '',
  category: '',
  description: '',
  email: '',
  phone: '',
  location: '',
  verified: false,
  active: false,
  logoUrl: null,
  bannerUrl: null,
  rating: 0,
  reviewCount: 0,
  productCount: 0,
  followers: 0,
  joinedAt: today(),
  featuredProducts: [],
};

let current = EMPTY_STORE;
let started = false;
const listeners = new Set();

function getSnapshot() {
  return current;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setCurrent(next) {
  current = next;
  listeners.forEach((listener) => listener());
}

function firstStat(stats) {
  return (Array.isArray(stats) ? stats[0] : stats) ?? {};
}

function mainImageUrl(images) {
  if (!Array.isArray(images) || images.length === 0) return null;
  const sorted = [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  return sorted[0]?.url ?? null;
}

function mapRow(row, verified, featuredProducts) {
  const stats = firstStat(row.store_stats);
  return {
    id: row.id,
    ownerId: row.owner_id,
    exists: true,
    loading: false,
    name: row.name ?? '',
    slug: row.slug ?? '',
    category: row.category ?? '',
    description: row.description ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    location: row.location ?? '',
    verified,
    active: !!row.is_active,
    logoUrl: row.logo_url ?? null,
    bannerUrl: row.banner_url ?? null,
    rating: Number(stats.avg_rating ?? stats.rating ?? 0),
    reviewCount: Number(stats.review_count ?? 0),
    productCount: Number(stats.product_count ?? 0),
    followers: Number(stats.follower_count ?? stats.followers ?? 0),
    joinedAt: row.created_at ? String(row.created_at).slice(0, 10) : today(),
    featuredProducts,
  };
}

async function load() {
  try {
    const supabase = requireSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setCurrent({ ...EMPTY_STORE, loading: false });
      return;
    }
    const userId = session.user.id;

    const [storeRes, profileRes] = await Promise.all([
      supabase.from('stores').select('*, store_stats(*)').eq('owner_id', userId).maybeSingle(),
      supabase.from('profiles').select('verification_status').eq('id', userId).maybeSingle(),
    ]);

    const verified = profileRes.data?.verification_status === 'verified';
    const row = storeRes.data;

    if (!row) {
      setCurrent({ ...EMPTY_STORE, loading: false, ownerId: userId, verified });
      return;
    }

    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, currency, product_images(url, position)')
      .eq('store_id', row.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3);

    const featured = (products ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price ?? 0),
      currency: p.currency ?? 'GBP',
      imageUrl: mainImageUrl(p.product_images),
    }));

    setCurrent(mapRow(row, verified, featured));
  } catch {
    setCurrent({ ...EMPTY_STORE, loading: false });
  }
}

function ensureLoaded() {
  if (started) return;
  started = true;
  load();
}

/**
 * Returns the current store profile and re-renders when it loads or is saved.
 */
export function useStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  useEffect(() => {
    ensureLoaded();
  }, []);
  return snapshot;
}

function slugify(name) {
  const base = String(name || 'store')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || 'store'}-${suffix}`;
}

function safeName(name) {
  return String(name || 'file').replace(/[^a-zA-Z0-9.\-_]/g, '-');
}

// Uploads a picked file to the store-assets bucket and returns its public URL.
// With no new file, keeps a previously saved (non-blob) URL, or clears it.
async function resolveImage(supabase, userId, file, currentUrl) {
  if (file) {
    const path = `${userId}/${Date.now()}-${safeName(file.name)}`;
    const { error } = await supabase.storage.from('store-assets').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('store-assets').getPublicUrl(path);
    return data.publicUrl;
  }
  if (typeof currentUrl === 'string' && !currentUrl.startsWith('blob:')) return currentUrl;
  return null;
}

/**
 * Saves changed fields to the seller's store. Pass picked files as
 * { logoFile, bannerFile } to upload them to Storage. Resolves to
 * { data, error } like the Supabase client.
 */
export async function saveStore(changes, files = {}) {
  try {
    const supabase = requireSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: new Error('Not signed in') };
    const userId = session.user.id;

    const logo_url = await resolveImage(supabase, userId, files.logoFile, changes.logoUrl);
    const banner_url = await resolveImage(supabase, userId, files.bannerFile, changes.bannerUrl);

    const payload = {
      name: changes.name,
      category: changes.category || null,
      description: changes.description,
      email: changes.email,
      phone: changes.phone,
      location: changes.location || null,
      logo_url,
      banner_url,
      is_active: !!changes.active,
    };

    let { data, error } = await supabase
      .from('stores')
      .update(payload)
      .eq('owner_id', userId)
      .select('id')
      .maybeSingle();

    // No placeholder row to update — create the store instead.
    if (!error && !data) {
      ({ data, error } = await supabase
        .from('stores')
        .insert({ ...payload, owner_id: userId, slug: slugify(changes.name) })
        .select('id')
        .maybeSingle());
    }

    if (error) return { data: null, error };

    await load();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

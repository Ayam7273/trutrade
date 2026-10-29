import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useGatedAction, useCanInteract } from '../contexts/VerifyPromptContext';
import { fetchMerchants, fetchStoreCategories, fetchMyFavourites, addFavourite, removeFavourite } from '../lib/marketplaceApi';
import FilterBar from '../components/marketplace/FilterBar.jsx';
import MerchantRow from '../components/marketplace/MerchantRow.jsx';
import EmptyState from '../components/marketplace/EmptyState.jsx';
import UnverifiedBanner from '../components/UnverifiedBanner/UnverifiedBanner.jsx';
import styles from './Marketplace.module.css';

function filterStores(stores, { q, location, category, store }) {
  let result = stores;
  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        (s.products ?? []).some((p) => p.name.toLowerCase().includes(lower))
    );
  }
  if (location) result = result.filter((s) => s.location === location);
  if (category) result = result.filter((s) => s.category === category);
  if (store) result = result.filter((s) => s.name === store);
  return result;
}

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gate = useGatedAction();
  const { verified } = useCanInteract();

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favourites, setFavourites] = useState(new Set());
  const [loadingStores, setLoadingStores] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoadingStores(true);
    setError(null);
    try {
      const [storeData, catData] = await Promise.all([fetchMerchants(), fetchStoreCategories()]);
      setStores(storeData);
      setCategories(catData);
    } catch (err) {
      setError(err.message || 'Failed to load merchants.');
    } finally {
      setLoadingStores(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!verified) return;
    fetchMyFavourites().then(setFavourites).catch(() => {});
  }, [verified]);

  const q = searchParams.get('q') ?? '';
  const location = searchParams.get('location') ?? '';
  const category = searchParams.get('category') ?? '';
  const store = searchParams.get('store') ?? '';

  const filtered = filterStores(stores, { q, location, category, store });
  const hasFilters = q || location || category || store;

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  async function toggleFavourite(storeId) {
    const wasFav = favourites.has(storeId);
    setFavourites((prev) => {
      const next = new Set(prev);
      if (wasFav) next.delete(storeId); else next.add(storeId);
      return next;
    });
    try {
      if (wasFav) await removeFavourite(storeId);
      else await addFavourite(storeId);
    } catch {
      setFavourites((prev) => {
        const next = new Set(prev);
        if (wasFav) next.add(storeId); else next.delete(storeId);
        return next;
      });
    }
  }

  const locations = [...new Set(stores.map((s) => s.location).filter(Boolean))];
  const storeNames = stores.map((s) => s.name);

  return (
    <main className={styles.page}>
      <UnverifiedBanner />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <FilterBar locations={locations} categories={categories} storeNames={storeNames} />
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>Verified Merchants</h1>
          <p className={styles.subtitle}>Discover verified stores with secure escrow protection</p>
        </div>

        {loadingStores ? (
          <div className={styles.skeletons}>
            {[1, 2, 3].map((n) => <div key={n} className={styles.skeleton} aria-hidden="true" />)}
          </div>
        ) : error ? (
          <EmptyState
            title="Something went wrong"
            body={error}
            action={
              <button type="button" className={styles.retryBtn} onClick={load}>
                Retry
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No merchants match your filters"
            action={
              hasFilters ? (
                <button type="button" className={styles.clearBtn} onClick={clearFilters}>
                  Clear filters
                </button>
              ) : null
            }
          />
        ) : (
          <div className={styles.list}>
            {filtered.map((s) => (
              <MerchantRow
                key={s.id}
                store={s}
                isFavourited={favourites.has(s.id)}
                onToggleFavourite={gate(() => toggleFavourite(s.id))}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

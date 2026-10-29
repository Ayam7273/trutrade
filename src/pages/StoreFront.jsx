import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageCircle, Heart, Check, BadgeCheck } from 'lucide-react';
import { useGatedAction } from '../contexts/VerifyPromptContext';
import { useCanInteract } from '../contexts/VerifyPromptContext';
import { useCart } from '../contexts/CartContext';
import { fetchStoreBySlug, fetchStoreProducts, fetchMyFavourites, addFavourite, removeFavourite } from '../lib/marketplaceApi';
import { productState } from '../lib/products';
import Avatar from '../components/dashboard/Avatar.jsx';
import ProductCard from '../components/marketplace/ProductCard.jsx';
import ProductDetailsModal from '../components/marketplace/ProductDetailsModal.jsx';
import EmptyState from '../components/marketplace/EmptyState.jsx';
import styles from './StoreFront.module.css';

export default function StoreFront() {
  const { slug } = useParams();
  const gate = useGatedAction();
  const { verified } = useCanInteract();
  const { addToCart } = useCart();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavourited, setIsFavourited] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const storeData = await fetchStoreBySlug(slug);
        if (!storeData) { setError('not_found'); setLoading(false); return; }
        setStore(storeData);
        const productData = await fetchStoreProducts(storeData.id);
        setProducts(productData);
      } catch (err) {
        setError(err.message || 'Failed to load store.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (!verified || !store) return;
    fetchMyFavourites().then((favs) => setIsFavourited(favs.has(store.id))).catch(() => {});
  }, [verified, store]);

  async function toggleFavourite() {
    if (!store) return;
    const wasFav = isFavourited;
    setIsFavourited(!wasFav);
    try {
      if (wasFav) await removeFavourite(store.id);
      else await addFavourite(store.id);
    } catch {
      setIsFavourited(wasFav);
    }
  }

  function handleMessage() {
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  }

  async function handleAddToCart(product, variations) {
    await addToCart({ productId: product.id, quantity: 1, selectedVariations: variations ?? null });
  }

  function handleCardAddToCart(product) {
    if (product.variations?.length) {
      setSelectedProduct(product);
      return;
    }
    return handleAddToCart(product, null);
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.skeletonHero} aria-hidden="true" />
      </main>
    );
  }

  if (error === 'not_found' || !store) {
    return (
      <main className={styles.page}>
        <EmptyState
          title="Store not found"
          body="This store doesn't exist or is no longer active."
          action={<Link to="/marketplace" className={styles.backLink}>Browse all merchants</Link>}
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <EmptyState title="Something went wrong" body={error} />
      </main>
    );
  }

  const productCount = store.store_stats?.product_count ?? products.length;

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.storeInfo}>
            <div className={styles.logoWrap}>
              <Avatar name={store.name} src={store.logo_url ?? undefined} size="xl" tone="teal" alt={store.name} />
            </div>
            <h1 className={styles.storeName}>{store.name}</h1>
            <div className={styles.handleRow}>
              <span className={styles.handle}>@{store.slug}</span>
              <BadgeCheck size={16} className={styles.verifiedIcon} aria-label="Verified seller" />
            </div>
            {store.description ? (
              <p className={styles.description}>{store.description}</p>
            ) : null}
            <div className={styles.storeActions}>
              <button
                type="button"
                className={styles.messageBtn}
                onClick={gate(handleMessage)}
              >
                <MessageCircle size={16} aria-hidden="true" />
                {messageSent ? 'Messaging coming soon' : 'Send a Message'}
              </button>
              <button
                type="button"
                className={isFavourited ? styles.favouritedBtn : styles.favouriteBtn}
                onClick={gate(toggleFavourite)}
              >
                {isFavourited ? <Check size={14} aria-hidden="true" /> : <Heart size={14} aria-hidden="true" />}
                {isFavourited ? 'Favourited' : 'Add as Favourite'}
              </button>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statNumber}>{productCount}</span>
              <span className={styles.statLabel}>Products in Store</span>
            </div>
          </div>
        </div>

        <div
          className={styles.banner}
          style={store.banner_url ? { backgroundImage: `url(${store.banner_url})` } : undefined}
        >
          {!store.banner_url ? (
            <div className={styles.bannerContent}>
              <h2 className={styles.bannerHeadline}>{store.name}</h2>
              {store.description ? (
                <p className={styles.bannerSubtext}>{store.description}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.container}>
        <h2 className={styles.productsHeading}>Explore {store.name} Products</h2>

        {products.length === 0 ? (
          <EmptyState title="No products yet" body="This store hasn't listed any products." />
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDetails={setSelectedProduct}
                onAddToCart={gate((p) => handleCardAddToCart(p))}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={gate((p, v) => handleAddToCart(p, v))}
      />
    </main>
  );
}

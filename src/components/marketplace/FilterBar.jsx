import { useSearchParams } from 'react-router-dom';
import styles from './FilterBar.module.css';

export default function FilterBar({ locations, categories, storeNames }) {
  const [params, setParams] = useSearchParams();

  function set(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <div className={styles.bar}>
      <select
        className={styles.select}
        value={params.get('location') ?? ''}
        onChange={(e) => set('location', e.target.value)}
        aria-label="Filter by location"
      >
        <option value="">Anywhere</option>
        {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
      </select>

      <select
        className={styles.select}
        value={params.get('category') ?? ''}
        onChange={(e) => set('category', e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">Any Category</option>
        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      <select
        className={styles.select}
        value={params.get('store') ?? ''}
        onChange={(e) => set('store', e.target.value)}
        aria-label="Filter by store"
      >
        <option value="">Any Store</option>
        {storeNames.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>
    </div>
  );
}

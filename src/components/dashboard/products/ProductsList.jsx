import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, X } from 'lucide-react';
import DataTable from '../DataTable.jsx';
import Pagination from '../Pagination.jsx';
import SelectChip from '../SelectChip.jsx';
import StatusBadge from '../StatusBadge.jsx';
import { productsPageContent as content } from '../../../data/dashboardContent';
import { fill, formatLongDate, formatMoney } from '../../../lib/format';
import { productState, stockLevel } from '../../../lib/products';
import utils from '../../../styles/utilities.module.css';
import styles from './ProductsList.module.css';

const PAGE_SIZE = 10;
const STATE_TONE = { active: 'success', low: 'warning', out: 'error', draft: 'neutral', hidden: 'neutral' };
const VALID_STOCK = new Set(content.stockOptions.map((option) => option.id));

const SORTERS = {
  recent: (a, b) => b.dateAdded.localeCompare(a.dateAdded),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  name: (a, b) => a.name.localeCompare(b.name),
};

const COLUMNS = [
  {
    key: 'product',
    header: content.columns.product,
    render: (product) => (
      <span className={styles.product}>
        {product.imageUrl ? (
          <img className={styles.thumb} src={product.imageUrl} alt="" />
        ) : (
          <span className={styles.thumb} aria-hidden="true"><Package size={20} /></span>
        )}
        <span className={styles.name}>{product.name}</span>
      </span>
    ),
  },
  { key: 'category', header: content.columns.category },
  {
    key: 'price',
    header: content.columns.price,
    emphasis: true,
    render: (product) => formatMoney(product.price, product.currency),
  },
  {
    key: 'stock',
    header: content.columns.stock,
    muted: true,
    render: (product) => fill(content.stockCount, { n: product.stock }),
  },
  {
    key: 'status',
    header: content.columns.status,
    render: (product) => {
      const state = productState(product);
      return <StatusBadge tone={STATE_TONE[state]}>{content.states[state]}</StatusBadge>;
    },
  },
  {
    key: 'rating',
    header: content.columns.rating,
    render: (product) => (product.rating == null
      ? <span className={styles.noRating}>{content.noRating}</span>
      : (
        <span className={styles.rating} aria-label={fill(content.ratingAria, { value: product.rating })}>
          {fill(content.rating, { value: product.rating.toFixed(1) })}
        </span>
      )),
  },
  { key: 'date', header: content.columns.date, muted: true, render: (product) => formatLongDate(product.dateAdded) },
  {
    key: 'action',
    header: content.columns.action,
    align: 'end',
    render: (product) => (
      <Link
        to={fill(content.editHref, { id: encodeURIComponent(product.id) })}
        className={styles.edit}
        aria-label={fill(content.editAria, { name: product.name })}
      >
        {content.edit}
      </Link>
    ),
  },
];

export default function ProductsList({ products, status = 'ready' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('q') ?? '').trim();
  const initialStock = searchParams.get('stock');

  const [category, setCategory] = useState('all');
  const [listing, setListing] = useState('all');
  const [stock, setStock] = useState(VALID_STOCK.has(initialStock) ? initialStock : 'all');
  const [price, setPrice] = useState('all');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);

  const categoryOptions = useMemo(() => [
    { id: 'all', label: content.categoryAll },
    ...[...new Set(products.map((product) => product.category))].sort().map((name) => ({ id: name, label: name })),
  ], [products]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    const range = content.priceOptions.find((option) => option.id === price);
    return products
      .filter((product) => {
        if (needle && !`${product.name} ${product.category}`.toLowerCase().includes(needle)) return false;
        if (category !== 'all' && product.category !== category) return false;
        if (listing !== 'all' && product.status !== listing) return false;
        if (stock !== 'all' && stockLevel(product) !== stock) return false;
        if (range.min != null && product.price < range.min) return false;
        if (range.max != null && product.price > range.max) return false;
        return true;
      })
      .sort(SORTERS[sort]);
  }, [products, query, category, listing, stock, price, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const hasFilters = query || [category, listing, stock, price].some((value) => value !== 'all');

  function changeFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  function clearSearch() {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next);
    setPage(1);
  }

  let summary = content.showingNone;
  if (filtered.length === 1) summary = content.showingOne;
  else if (filtered.length > 1) {
    summary = fill(content.showing, { from: start + 1, to: start + visible.length, total: filtered.length });
  }

  return (
    <section className={styles.card} aria-labelledby="products-heading">
      <h2 id="products-heading" className={utils.srOnly}>{content.title}</h2>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <span className={styles.filterBy}>{content.filterBy}</span>
          {query ? (
            <span className={styles.searchChip}>
              {fill(content.searchChip, { q: query })}
              <button
                type="button"
                className={styles.clear}
                onClick={clearSearch}
                aria-label={fill(content.clearSearchAria, { q: query })}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </span>
          ) : null}
          <SelectChip
            id="products-category"
            label={content.categoryLabel}
            value={category}
            options={categoryOptions}
            onChange={changeFilter(setCategory)}
            variant="filled"
          />
          <SelectChip
            id="products-status"
            label={content.statusLabel}
            prefix={content.statusPrefix}
            value={listing}
            options={content.statusOptions}
            onChange={changeFilter(setListing)}
            variant="filled"
          />
          <SelectChip
            id="products-stock"
            label={content.stockLabel}
            prefix={content.stockPrefix}
            value={stock}
            options={content.stockOptions}
            onChange={changeFilter(setStock)}
            variant="filled"
          />
          <SelectChip
            id="products-price"
            label={content.priceLabel}
            prefix={content.pricePrefix}
            value={price}
            options={content.priceOptions}
            onChange={changeFilter(setPrice)}
            variant="filled"
          />
        </div>
        <SelectChip
          id="products-sort"
          label={content.sortLabel}
          prefix={content.sortPrefix}
          value={sort}
          options={content.sortOptions}
          onChange={changeFilter(setSort)}
        />
      </div>

      <DataTable
        columns={COLUMNS}
        rows={visible}
        getRowKey={(product) => product.id}
        status={status}
        messages={{
          loading: content.loading,
          error: content.error,
          empty: hasFilters ? content.emptyFiltered : content.empty,
        }}
      />

      <Pagination
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onChange={setPage}
        labels={content.pagination}
        summary={summary}
      />
    </section>
  );
}

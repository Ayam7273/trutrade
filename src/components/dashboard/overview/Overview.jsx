import { useState } from 'react';
import { Box, Coins, ShoppingBag, Star } from 'lucide-react';
import OverviewHeader from './OverviewHeader.jsx';
import StatCard from '../StatCard.jsx';
import SalesOverview from './SalesOverview.jsx';
import OrderOverview from './OrderOverview.jsx';
import RecentOrders from './RecentOrders.jsx';
import StorePerformance from './StorePerformance.jsx';
import QuickActions from './QuickActions.jsx';
import TopProducts from './TopProducts.jsx';
import LowStockAlert from './LowStockAlert.jsx';
import PayoutSummary from './PayoutSummary.jsx';
import RecentReviews from './RecentReviews.jsx';
import { overviewContent as content } from '../../../data/dashboardContent';
import { formatDelta, formatMoney, formatNumber } from '../../../lib/format';
import {
  mockSalesSeries,
  mockStats,
  mockStorePerformance,
  mockTopProducts,
} from '../../../lib/dashboardMock';
import { useStore } from '../../../lib/storeApi';
import { useReviews } from '../../../lib/reviewsApi';
import { useProducts } from '../../../lib/productsApi';
import { stockLevel } from '../../../lib/products';
import { useOrders } from '../../../lib/ordersApi';
import { useBalances, useWithdrawal } from '../../../lib/paymentsApi';
import styles from './Overview.module.css';

const ICONS = { Box, Coins, ShoppingBag, Star };
const BREAKDOWN_ORDER = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Overview() {
  const store = useStore();
  const reviews = useReviews();
  const lowStock = useProducts()
    .filter((product) => product.status === 'active' && stockLevel(product) === 'low')
    .map((product) => ({ id: product.id, name: product.name, left: product.stock }));
  const orders = useOrders();
  const balances = useBalances();
  const withdrawal = useWithdrawal();
  const breakdown = BREAKDOWN_ORDER.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));
  const payouts = {
    currency: balances.currency,
    available: balances.available.amount,
    pending: balances.pending.amount,
    next: { amount: withdrawal.nextAmount, date: withdrawal.estimatedDate },
  };
  const [period, setPeriod] = useState('month');
  const stats = mockStats[period];
  const comparison = content.comparison[period];

  const cards = [
    {
      id: 'sales',
      value: formatMoney(stats.sales.amount, stats.sales.currency),
      delta: formatDelta(stats.sales.delta),
      deltaNote: comparison,
    },
    {
      id: 'orders',
      value: formatNumber(stats.orders.count),
      delta: formatDelta(stats.orders.delta),
      deltaNote: comparison,
    },
    {
      id: 'products',
      value: formatNumber(stats.products.count),
      delta: stats.products.newCount ? `+${stats.products.newCount} ${content.newSuffix}` : null,
      deltaNote: content.newProducts[period],
    },
    {
      id: 'rating',
      value: `${stats.rating.value} ★`,
      delta: stats.rating.delta ? formatDelta(stats.rating.delta, '') : null,
      deltaNote: comparison,
    },
  ];

  return (
    <div className={styles.overview}>
      <OverviewHeader storeName={store.name} period={period} onPeriodChange={setPeriod} />

      <div className={styles.stats}>
        {cards.map((card) => {
          const meta = content.stats[card.id];
          return (
            <StatCard
              key={card.id}
              label={meta.label}
              icon={ICONS[meta.icon]}
              tone={meta.tone}
              value={card.value}
              delta={card.delta}
              deltaNote={card.deltaNote}
            />
          );
        })}
      </div>

      <div className={styles.charts}>
        <SalesOverview series={mockSalesSeries} />
        <OrderOverview breakdown={breakdown} />
      </div>

      <RecentOrders orders={orders.slice(0, 5)} />

      <div className={styles.bottom}>
        <div className={styles.column}>
          <StorePerformance performance={mockStorePerformance} />
          <QuickActions />
        </div>
        <div className={styles.column}>
          <TopProducts products={mockTopProducts} />
        </div>
        <div className={styles.column}>
          <LowStockAlert items={lowStock} />
          <PayoutSummary payouts={payouts} />
          <RecentReviews reviews={reviews.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}

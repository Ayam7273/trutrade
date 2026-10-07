import { CreditCard, ShoppingBag } from 'lucide-react';
import StatCard from '../StatCard.jsx';
import { ordersPageContent as content } from '../../../data/dashboardContent';
import { formatDelta, formatNumber } from '../../../lib/format';
import styles from './OrdersStats.module.css';

const ICONS = { CreditCard, ShoppingBag };

export default function OrdersStats({ orders, trend }) {
  const count = (status) => orders.filter((order) => order.status === status).length;
  const { stats } = content;

  const cards = [
    { id: 'total', value: orders.length, delta: formatDelta(trend.delta), deltaTone: 'success' },
    { id: 'pending', value: count('pending'), delta: stats.pending.badge, deltaTone: 'warning' },
    { id: 'processing', value: count('processing'), delta: stats.processing.badge, deltaTone: 'info' },
    { id: 'shipped', value: count('shipped'), delta: stats.shipped.badge, deltaTone: 'info' },
  ];

  return (
    <div className={styles.stats}>
      {cards.map((card) => {
        const meta = stats[card.id];
        return (
          <StatCard
            key={card.id}
            label={meta.label}
            icon={ICONS[meta.icon]}
            tone={meta.tone}
            value={formatNumber(card.value)}
            delta={card.delta}
            deltaTone={card.deltaTone}
            deltaNote={meta.note}
          />
        );
      })}
    </div>
  );
}

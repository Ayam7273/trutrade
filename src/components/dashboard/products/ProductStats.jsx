import { Box, Store } from 'lucide-react';
import StatCard from '../StatCard.jsx';
import { productsPageContent as content } from '../../../data/dashboardContent';
import { fill, formatNumber, localIsoDate } from '../../../lib/format';
import { stockLevel } from '../../../lib/products';
import styles from './ProductStats.module.css';

const ICONS = { Box, Store };
const NEW_WITHIN_DAYS = 30;

export default function ProductStats({ products }) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NEW_WITHIN_DAYS);
  const cutoffIso = localIsoDate(cutoff);

  const total = products.length;
  const added = products.filter((product) => product.dateAdded >= cutoffIso).length;
  const active = products.filter((product) => product.status === 'active').length;
  const low = products.filter((product) => stockLevel(product) === 'low').length;
  const out = products.filter((product) => stockLevel(product) === 'out').length;
  const pct = total ? ((active / total) * 100).toFixed(1) : '0.0';
  const { stats } = content;

  const cards = [
    { id: 'total', value: total, delta: fill(stats.total.badge, { n: added }), deltaTone: 'success' },
    { id: 'active', value: active, delta: fill(stats.active.badge, { pct }), deltaTone: 'info' },
    { id: 'low', value: low, delta: stats.low.badge, deltaTone: 'warning' },
    { id: 'out', value: out, delta: stats.out.badge, deltaTone: 'error' },
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

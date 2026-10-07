import { Banknote, Clock, HandCoins, Landmark } from 'lucide-react';
import StatCard from '../StatCard.jsx';
import { paymentsPageContent as content } from '../../../data/dashboardContent';
import { formatDelta, formatMoney } from '../../../lib/format';
import styles from './BalanceStats.module.css';

const ICONS = { Banknote, Clock, HandCoins, Landmark };
const ORDER = ['available', 'pending', 'earnings', 'withdrawals'];

export default function BalanceStats({ balances }) {
  return (
    <div className={styles.stats}>
      {ORDER.map((id) => {
        const meta = content.stats[id];
        const stat = balances[id];
        return (
          <StatCard
            key={id}
            label={meta.label}
            icon={ICONS[meta.icon]}
            tone={meta.tone}
            value={formatMoney(stat.amount, balances.currency)}
            delta={formatDelta(stat.delta)}
            deltaNote={content.statNote}
          />
        );
      })}
    </div>
  );
}

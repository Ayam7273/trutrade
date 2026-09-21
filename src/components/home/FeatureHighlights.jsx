import { featuresContent } from '../../data/homeContent';
import styles from './FeatureHighlights.module.css';

function EscrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="14" cy="6" r="2.4" />
      <circle cx="6" cy="14" r="2.4" />
      <circle cx="14" cy="14" r="2.4" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <ellipse cx="10" cy="6.2" rx="6" ry="2.1" />
      <ellipse cx="10" cy="10" rx="6" ry="2.1" />
      <ellipse cx="10" cy="13.8" rx="6" ry="2.1" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.5 8.2 5 4.5h10l1.5 3.7v1.1c0 1.2-1 2.1-2.2 2.1-1 0-1.8-.6-2.1-1.4-.3.8-1.1 1.4-2.2 1.4s-1.9-.6-2.2-1.4c-.3.8-1.1 1.4-2.1 1.4-1.2 0-2.2-.9-2.2-2.1V8.2Z" />
      <path d="M5.2 11.6V16h9.6v-4.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = {
  escrow: EscrowIcon,
  wallet: WalletIcon,
  marketplace: StoreIcon,
};

function Burst({ className, spikes = 12, inner = 0.4 }) {
  const points = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? 48 : 48 * inner;
    const a = i * step - Math.PI / 2;
    points.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`);
  }
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points={points.join(' ')} fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export default function FeatureHighlights() {
  return (
    <section className={styles.section} aria-label="Product highlights">
      <div className={styles.inner}>
        <div className={styles.grid}>
          {featuresContent.items.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <article key={item.id} className={styles.card}>
                <div className={styles.heading}>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon />
                  </span>
                  <p className={styles.title}>{item.title}</p>
                </div>
                <p className={styles.description}>{item.description}</p>
              </article>
            );
          })}
        </div>
        <div className={styles.bursts} aria-hidden="true">
          <Burst className={styles.burst} spikes={10} inner={0.42} />
          <Burst className={`${styles.burst} ${styles.burstRight}`} spikes={16} inner={0.48} />
        </div>
      </div>
    </section>
  );
}

import { featuresContent } from '../../data/homeContent';
import styles from './FeatureHighlights.module.css';

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
          {featuresContent.items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.heading}>
                <img src={item.icon} alt="" aria-hidden="true" className={styles.icon} />
                <p className={styles.title}>{item.title}</p>
              </div>
              <p className={styles.description}>{item.description}</p>
            </article>
          ))}
        </div>
        <div className={styles.bursts} aria-hidden="true">
          <Burst className={styles.burst} spikes={10} inner={0.42} />
          <Burst className={`${styles.burst} ${styles.burstRight}`} spikes={16} inner={0.48} />
        </div>
      </div>
    </section>
  );
}

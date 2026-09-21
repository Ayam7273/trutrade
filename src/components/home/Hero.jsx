import { heroContent } from '../../data/homeContent';
import styles from './Hero.module.css';

function Burst({ className, spikes = 8, inner = 0.42 }) {
  const points = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? 48 : 48 * inner;
    const a = i * step - Math.PI / 2;
    points.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`);
  }
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points={points.join(' ')} />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.inner}>
        <div className={styles.headlineRow}>
          <Burst className={`${styles.burst} ${styles.burstLeft}`} spikes={10} inner={0.38} />
          <h1 id="hero-heading">
            {heroContent.headlineLines.map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>
          <Burst className={`${styles.burst} ${styles.burstRight}`} spikes={8} inner={0.46} />
        </div>
        <p className={styles.subtext}>{heroContent.subtext}</p>
        <a href="#signup" className={styles.cta}>
          {heroContent.cta}
        </a>
      </div>
    </section>
  );
}

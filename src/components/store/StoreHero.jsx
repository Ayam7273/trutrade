import { storeHeroContent } from '../../data/storeContent';
import styles from './StoreHero.module.css';

export default function StoreHero() {
  return (
    <section className={styles.section} aria-labelledby="store-hero-heading">
      <div className={styles.inner}>
        <h1 id="store-hero-heading">{storeHeroContent.title}</h1>
        <p className={styles.subtext}>{storeHeroContent.body}</p>
        <a href={storeHeroContent.ctaHref} className={styles.cta}>
          {storeHeroContent.cta}
        </a>
        <div className={styles.frame}>
          <img src={storeHeroContent.image} alt={storeHeroContent.imageAlt} />
        </div>
      </div>
    </section>
  );
}

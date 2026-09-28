import { servicesHeroContent } from '../../data/servicesContent';
import styles from './ServicesHero.module.css';

export default function ServicesHero() {
  return (
    <section className={styles.section} aria-labelledby="services-hero-heading">
      <div className={styles.inner}>
        <h1 id="services-hero-heading">{servicesHeroContent.title}</h1>
        <p className={styles.subtext}>{servicesHeroContent.body}</p>
      </div>
    </section>
  );
}

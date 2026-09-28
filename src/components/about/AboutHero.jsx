import { aboutHeroContent } from '../../data/aboutContent';
import styles from './AboutHero.module.css';

export default function AboutHero() {
  return (
    <section className={styles.section} aria-labelledby="about-hero-heading">
      <div className={styles.inner}>
        <h1 id="about-hero-heading">{aboutHeroContent.title}</h1>
        <p className={styles.subtext}>{aboutHeroContent.body}</p>
      </div>
    </section>
  );
}

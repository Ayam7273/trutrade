import { trustedByContent } from '../../data/homeContent';
import styles from './TrustedByLogos.module.css';

export default function TrustedByLogos() {
  return (
    <section className={styles.section} id="about" aria-label="Trusted by businesses">
      <div className={styles.inner}>
        <p className={styles.stat}>{trustedByContent.stat}</p>
        <ul className={styles.logos}>
          {trustedByContent.logos.map((logo) => (
            <li key={logo.src} className={styles.logo}>
              <img src={logo.src} alt={logo.alt} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

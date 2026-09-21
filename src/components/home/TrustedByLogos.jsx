import { trustedByContent } from '../../data/homeContent';
import styles from './TrustedByLogos.module.css';

function LogoMark({ name }) {
  switch (name) {
    case 'Patreon':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="10" cy="6.2" r="3.4" />
          <rect x="2.4" y="2.6" width="2.6" height="10.8" rx="0.6" />
        </svg>
      );
    case 'Airbnb':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2.4c1.8 2.4 4.8 6 4.8 8.2A4.8 4.8 0 0 1 8 15.2a4.8 4.8 0 0 1-4.8-4.6C3.2 8.4 6.2 4.8 8 2.4Z" />
        </svg>
      );
    case 'Fiberplane':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="3" />
          <path d="M5 8h6M8 5v6" stroke="#fff" strokeWidth="1.6" fill="none" />
        </svg>
      );
    case 'HelpScout':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4.2 12.8 11.8 3.2" strokeWidth="2.4" stroke="currentColor" fill="none" strokeLinecap="round" />
          <path d="M6.4 12.8 14 3.2" strokeWidth="2.4" stroke="currentColor" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'Plaid':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 2.6 8 5.2 12 2.6 14 6.8 8 10.2 2 6.8 4 2.6Z" />
          <path d="M2 9.2 8 12.8 14 9.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function TrustedByLogos() {
  return (
    <section className={styles.section} id="about" aria-label="Trusted by businesses">
      <div className={styles.inner}>
        <p className={styles.stat}>{trustedByContent.stat}</p>
        <ul className={styles.logos}>
          {trustedByContent.logos.map((name) => (
            <li key={name} className={styles.logo} data-brand={name.toLowerCase()}>
              <LogoMark name={name} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

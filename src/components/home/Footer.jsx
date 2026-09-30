import { footerContent } from '../../data/homeContent';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <a href="/" className={styles.logo}>
            <img src={footerContent.logoSrc} alt={footerContent.logoAlt} />
          </a>
          <p>{footerContent.tagline}</p>
        </div>

        {footerContent.columns.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3>{footerContent.market.title}</h3>
          <p className={styles.market}>{footerContent.market.value}</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>{footerContent.copyright}</p>
      </div>
    </footer>
  );
}

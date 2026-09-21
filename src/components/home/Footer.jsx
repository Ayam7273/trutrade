import { footerContent } from '../../data/homeContent';
import styles from './Footer.module.css';

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 8.5V6.8c0-.7.5-1.3 1.2-1.3H17V3h-2.2C12.3 3 11 4.5 11 6.7v1.8H9v2.7h2V21h3.2v-9.8h2.2l.6-2.7h-2.5Z"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.6 7.4c.5-.3.9-.8 1.1-1.4-.5.3-1.1.5-1.7.6A2.7 2.7 0 0 0 14.3 9c0 .2 0 .4.1.6-2.3-.1-4.3-1.2-5.7-2.9-.2.4-.4.9-.4 1.4 0 .9.5 1.8 1.2 2.3-.4 0-.8-.1-1.2-.3v.1c0 1.3.9 2.4 2.2 2.7-.2.1-.5.1-.7.1-.2 0-.3 0-.5-.1.3 1.1 1.4 1.9 2.6 1.9A5.5 5.5 0 0 1 5 16.6 7.7 7.7 0 0 0 9.2 18c5.1 0 7.9-4.2 7.9-7.9v-.4c.5-.4 1-.9 1.4-1.5-.5.2-1 .4-1.5.4Z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm8 1.6H8A2.4 2.4 0 0 0 5.6 8v8A2.4 2.4 0 0 0 8 18.4h8a2.4 2.4 0 0 0 2.4-2.4V8A2.4 2.4 0 0 0 16 5.6ZM12 8.8A3.2 3.2 0 1 1 8.8 12 3.2 3.2 0 0 1 12 8.8Zm0 1.5A1.7 1.7 0 1 0 13.7 12 1.7 1.7 0 0 0 12 10.3Zm4.1-2.6a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9Z"
      />
    </svg>
  );
}

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
};

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
          <h3>{footerContent.address.title}</h3>
          <address>
            {footerContent.address.lines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </address>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>{footerContent.copyright}</p>
        <div className={styles.social}>
          {footerContent.social.map((item) => {
            const Icon = SOCIAL_ICONS[item.id];
            return (
              <a key={item.id} href={`#${item.id}`} aria-label={item.label} className={styles.socialBtn}>
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

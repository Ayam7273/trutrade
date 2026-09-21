import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navContent } from '../../data/homeContent';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <img src={navContent.logoSrc} alt={navContent.logoAlt} />
        </a>

        <nav className={styles.desktopNav} aria-label="Primary">
          {navContent.links.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.desktopActions}>
          <a href="#login" className={styles.login}>
            {navContent.login}
          </a>
          <a href="#signup" className={styles.signup}>
            {navContent.signup}
          </a>
        </div>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" className={styles.mobileNav} aria-label="Mobile">
          {navContent.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#login" className={styles.mobileLink} onClick={() => setOpen(false)}>
            {navContent.login}
          </a>
          <a href="#signup" className={styles.mobileSignup} onClick={() => setOpen(false)}>
            {navContent.signup}
          </a>
        </nav>
      ) : null}
    </header>
  );
}

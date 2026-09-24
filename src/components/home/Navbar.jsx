import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navContent } from '../../data/homeContent';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  function hrefFor(link) {
    if (pathname !== '/' && link.href.startsWith('#')) return `/${link.href}`;
    return link.href;
  }

  function classFor(link, base) {
    const href = hrefFor(link);
    const active = href === '/store' && pathname === '/store';
    return active ? `${base} ${styles.active}` : base;
  }

  return (
    <>
    <div className={styles.spacer} aria-hidden="true" />
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <img src={navContent.logoSrc} alt={navContent.logoAlt} />
        </a>

        <nav className={styles.desktopNav} aria-label="Primary">
          {navContent.links.map((link) => {
            const href = hrefFor(link);
            const className = classFor(link, styles.navLink);
            if (href.startsWith('/') && !href.includes('#')) {
              return (
                <Link key={link.label} to={href} className={className}>
                  {link.label}
                </Link>
              );
            }
            return (
              <a key={link.label} href={href} className={className}>
                {link.label}
              </a>
            );
          })}
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
          {navContent.links.map((link) => {
            const href = hrefFor(link);
            const className = classFor(link, styles.mobileLink);
            if (href.startsWith('/') && !href.includes('#')) {
              return (
                <Link
                  key={link.label}
                  to={href}
                  className={className}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <a
                key={link.label}
                href={href}
                className={className}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
          <a href="#login" className={styles.mobileLink} onClick={() => setOpen(false)}>
            {navContent.login}
          </a>
          <a href="#signup" className={styles.mobileSignup} onClick={() => setOpen(false)}>
            {navContent.signup}
          </a>
        </nav>
      ) : null}
    </header>
    </>
  );
}

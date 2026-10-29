import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, ChevronDown } from 'lucide-react';
import { navContent } from '../../data/homeContent';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { signOut } from '../../lib/supabaseAuth';
import styles from './MarketplaceHeader.module.css';

export default function MarketplaceHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { session, profile } = useAuth();
  const { count } = useCart();

  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`.trim()
    : session?.user?.email?.split('@')[0] ?? 'Account';

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  useEffect(() => {
    if (!profileOpen) return;
    function handleOutside(e) {
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [profileOpen]);

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query.trim()) params.set('q', query.trim());
    else params.delete('q');
    navigate(`/marketplace?${params.toString()}`);
  }

  function merchantHref() {
    if (!session) return '/signup';
    if (profile?.role === 'seller') return '/dashboard';
    return '/verify';
  }

  function accountHref() {
    if (profile?.role === 'seller') return '/dashboard';
    return '/verify';
  }

  async function handleSignOut() {
    setProfileOpen(false);
    setMenuOpen(false);
    await signOut();
    navigate('/login');
  }

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/marketplace" className={styles.logo}>
            <img src={navContent.logoSrc} alt={navContent.logoAlt} />
          </Link>

          <form className={styles.searchForm} onSubmit={handleSearch} role="search">
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search products or stores"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products or stores"
            />
          </form>

          <div className={styles.actions}>
            <Link to={merchantHref()} className={styles.merchantLink}>
              Become a Merchant
            </Link>

            <Link
              to="/cart"
              className={styles.cartBtn}
              aria-label={`Cart, ${count} item${count !== 1 ? 's' : ''}`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {count > 0 ? <span className={styles.badge}>{count}</span> : null}
            </Link>

            {session ? (
              <div className={styles.profileWrap} ref={profileRef}>
                <button
                  type="button"
                  className={styles.profileBtn}
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  aria-label={`Account menu for ${displayName}`}
                >
                  <span className={styles.profileInitials}>{initials}</span>
                  <span className={styles.profileName}>{displayName}</span>
                  <ChevronDown size={14} aria-hidden="true" className={profileOpen ? styles.chevronUp : ''} />
                </button>

                {profileOpen ? (
                  <div className={styles.dropdown} role="menu">
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{displayName}</p>
                      <p className={styles.dropdownEmail}>{session.user.email}</p>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link
                      to={accountHref()}
                      className={styles.dropdownItem}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      {profile?.role === 'seller' ? 'Dashboard' : 'My Account'}
                    </Link>
                    <button
                      type="button"
                      className={styles.dropdownSignOut}
                      role="menuitem"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link to="/login" className={styles.signInBtn}>
                Sign in
              </Link>
            )}
          </div>

          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen ? (
          <nav className={styles.mobileNav} aria-label="Mobile marketplace menu">
            <form
              className={styles.mobileSearch}
              onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }}
              role="search"
            >
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Search products or stores"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products or stores"
              />
            </form>

            {navContent.links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to={merchantHref()}
              className={styles.mobileMerchant}
              onClick={() => setMenuOpen(false)}
            >
              Become a Merchant
            </Link>

            <div className={styles.mobileDivider} />

            {session ? (
              <>
                <Link
                  to={accountHref()}
                  className={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={15} aria-hidden="true" style={{ marginRight: 8 }} />
                  {displayName}
                </Link>
                <button type="button" className={styles.mobileSignOut} onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className={styles.mobileMerchant} onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </nav>
        ) : null}
      </header>
    </>
  );
}

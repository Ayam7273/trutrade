import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Box,
  ChevronDown,
  CreditCard,
  LayoutGrid,
  LogOut,
  ShoppingBag,
  Star,
  Store,
} from 'lucide-react';
import Avatar from './Avatar.jsx';
import { dashboardNavContent } from '../../data/dashboardContent';
import { signOut } from '../../lib/supabaseAuth';
import styles from './Sidebar.module.css';

const ICONS = { Bell, Box, CreditCard, LayoutGrid, ShoppingBag, Star, Store };

function AccountMenu({ seller }) {
  const { account } = dashboardNavContent;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    setError('');
    try {
      const { error: signOutError } = await signOut();
      if (signOutError) throw signOutError;
      navigate('/login');
    } catch {
      setError(account.signOutError);
    }
  }

  return (
    <div className={styles.account} ref={wrapperRef}>
      {open ? (
        <div className={styles.menu} id="account-menu">
          <Link to={account.viewStoreHref} className={styles.menuItem} onClick={() => setOpen(false)}>
            <Store size={16} aria-hidden="true" />
            {account.viewStore}
          </Link>
          <button type="button" className={styles.menuItem} onClick={handleSignOut}>
            <LogOut size={16} aria-hidden="true" />
            {account.signOut}
          </button>
          {error ? (
            <p className={styles.menuError} role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className={styles.accountButton}
        aria-label={`${account.menuAria}: ${seller.storeName}`}
        aria-expanded={open}
        aria-controls="account-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar name={seller.storeName} src={seller.avatarUrl} tone="dark" />
        <span className={styles.accountText}>
          <span className={styles.accountName}>{seller.storeName}</span>
          <span className={styles.accountRole}>{account.roleLabel}</span>
        </span>
        <ChevronDown size={16} aria-hidden="true" className={open ? styles.chevronOpen : undefined} />
      </button>
    </div>
  );
}

export default function Sidebar({ id, className = '', seller, inert }) {
  return (
    <aside id={id} className={`${styles.sidebar} ${className}`} inert={inert}>
      <Link to={dashboardNavContent.logoHref} className={styles.logo}>
        <img src={dashboardNavContent.logoSrc} alt={dashboardNavContent.logoAlt} />
      </Link>

      <nav aria-label={dashboardNavContent.navLabel} className={styles.nav}>
        <ul>
          {dashboardNavContent.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
                >
                  <Icon size={20} aria-hidden="true" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <AccountMenu seller={seller} />
    </aside>
  );
}

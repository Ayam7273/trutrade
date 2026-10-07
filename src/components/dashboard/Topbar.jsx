import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { dashboardTopbarContent as content } from '../../data/dashboardContent';
import utils from '../../styles/utilities.module.css';
import styles from './Topbar.module.css';

export default function Topbar({ title, seller, sidebarVisible, onToggleSidebar }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`${content.searchHref}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label={sidebarVisible ? content.closeMenu : content.openMenu}
        aria-expanded={sidebarVisible}
        aria-controls="dashboard-sidebar"
        onClick={onToggleSidebar}
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <p className={styles.title}>{title}</p>

      <div className={styles.actions}>
        <form role="search" className={styles.search} onSubmit={handleSearch}>
          <label htmlFor="dashboard-search" className={utils.srOnly}>
            {content.searchLabel}
          </label>
          <Search size={18} aria-hidden="true" className={styles.searchIcon} />
          <input
            id="dashboard-search"
            type="search"
            placeholder={content.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>

        <Link
          to={content.notificationsHref}
          className={`${styles.iconButton} ${styles.bell}`}
          aria-label={seller.hasUnreadNotifications ? content.unreadAria : content.notificationsAria}
        >
          <Bell size={20} aria-hidden="true" />
          {seller.hasUnreadNotifications ? <span className={styles.dot} aria-hidden="true" /> : null}
        </Link>

        <span className={seller.storeActive ? styles.status : `${styles.status} ${styles.statusOff}`}>
          <span className={styles.statusDot} aria-hidden="true" />
          {seller.storeActive ? content.storeActive : content.storeInactive}
        </span>

        <Avatar name={seller.storeName} src={seller.avatarUrl} size="lg" tone="teal" alt={content.avatarAlt} />
      </div>
    </header>
  );
}

import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { dashboardNavContent } from '../../data/dashboardContent';
import { mockSeller } from '../../lib/dashboardMock';
import { useStore } from '../../lib/storeApi';
import { useNotifications } from '../../lib/notificationsApi';
import styles from './DashboardLayout.module.css';

const MOBILE_QUERY = '(max-width: 767px)';

function titleFor(pathname) {
  const match = dashboardNavContent.items.find((item) =>
    item.end ? pathname === item.to || pathname === `${item.to}/` : pathname.startsWith(item.to),
  );
  return match ? match.label : dashboardNavContent.items[0].label;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => setIsMobile(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const store = useStore();
  const notifications = useNotifications();
  const seller = {
    ...mockSeller,
    hasUnreadNotifications: notifications.some((item) => !item.read),
    storeName: store.name,
    storeActive: store.active,
    avatarUrl: store.logoUrl,
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') setMobileOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  function toggleSidebar() {
    if (isMobile) {
      setMobileOpen((open) => !open);
    } else {
      setCollapsed((value) => !value);
    }
  }

  const sidebarVisible = isMobile ? mobileOpen : !collapsed;
  const layoutClass = [
    styles.layout,
    collapsed ? styles.collapsed : '',
    mobileOpen ? styles.mobileOpen : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClass}>
      <Sidebar
        id="dashboard-sidebar"
        className={styles.sidebar}
        seller={seller}
        inert={!sidebarVisible}
      />
      {isMobile && mobileOpen ? (
        <div className={styles.scrim} aria-hidden="true" onClick={() => setMobileOpen(false)} />
      ) : null}

      <div className={styles.main}>
        <Topbar
          title={titleFor(pathname)}
          seller={seller}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={toggleSidebar}
        />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

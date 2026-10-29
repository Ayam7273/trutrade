import { Outlet } from 'react-router-dom';
import MarketplaceHeader from './MarketplaceHeader.jsx';
import styles from './MarketplaceLayout.module.css';

export default function MarketplaceLayout() {
  return (
    <div className={styles.layout}>
      <MarketplaceHeader />
      <Outlet />
    </div>
  );
}

import { ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../PageHeader.jsx';
import Button from '../../ui/Button.jsx';
import StoreProfileCard from './StoreProfileCard.jsx';
import StoreDetails from './StoreDetails.jsx';
import StoreStatusCallout from './StoreStatusCallout.jsx';
import AppearancePreview from './AppearancePreview.jsx';
import LivePreview from './LivePreview.jsx';
import { editStoreContent, myStoreContent as content } from '../../../data/dashboardContent';
import { useStore } from '../../../lib/storeApi';
import styles from './MyStore.module.css';

export default function MyStore() {
  const store = useStore();
  const { state } = useLocation();

  return (
    <div className={styles.page}>
      <PageHeader
        title={content.title}
        subtitle={content.subtitle}
        action={<Button to={content.editHref} icon={ArrowRight}>{content.editCta}</Button>}
      />

      <p className={styles.saved} role="status">
        {state?.saved ? editStoreContent.saved : ''}
      </p>

      <div className={styles.grid}>
        <div className={styles.column}>
          <StoreProfileCard store={store} />
          <StoreDetails store={store} />
        </div>
        <div className={styles.column}>
          <StoreStatusCallout active={store.active} />
          <AppearancePreview store={store} />
          <LivePreview store={store} />
        </div>
      </div>
    </div>
  );
}

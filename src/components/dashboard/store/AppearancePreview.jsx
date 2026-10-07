import { Link } from 'react-router-dom';
import Avatar from '../Avatar.jsx';
import Panel from '../Panel.jsx';
import StoreBanner from './StoreBanner.jsx';
import { appearanceContent as content } from '../../../data/dashboardContent';
import styles from './AppearancePreview.module.css';

export default function AppearancePreview({ store }) {
  return (
    <Panel
      title={content.title}
      action={<Link to={content.editHref} aria-label={content.editAria}>{content.edit}</Link>}
    >
      <StoreBanner src={store.bannerUrl} alt={content.bannerAlt} />
      <div className={styles.logoRow}>
        <Avatar name={store.name} src={store.logoUrl} size="lg" tone="dark" />
        <div>
          <p className={styles.logoTitle}>{content.logoTitle}</p>
          <p className={styles.logoHint}>{content.logoHint}</p>
        </div>
      </div>
    </Panel>
  );
}

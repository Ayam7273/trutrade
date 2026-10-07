import { Upload } from 'lucide-react';
import Avatar from '../Avatar.jsx';
import Button from '../../ui/Button.jsx';
import ImagePicker from './ImagePicker.jsx';
import StoreBanner from './StoreBanner.jsx';
import { editStoreContent as content } from '../../../data/dashboardContent';
import styles from './BrandingFields.module.css';

/**
 * Logo and banner pickers. Selection and validation happen in the parent
 * form; this component only renders the controls and their messages.
 */
export default function BrandingFields({ storeName, logoUrl, bannerUrl, errors, onPick, onRemove }) {
  return (
    <>
      <div className={styles.group} role="group" aria-labelledby="store-logo-label">
        <p id="store-logo-label" className={styles.label}>{content.logo.label}</p>
        <div className={styles.logoRow}>
          <Avatar name={storeName || '?'} src={logoUrl} size="xl" tone="dark" />
          <div className={styles.logoControls}>
            <div className={styles.buttons}>
              <ImagePicker id="store-logo" onSelect={(file) => onPick('logo', file)}>
                {(open) => (
                  <Button size="sm" onClick={open} aria-describedby="store-logo-hint">
                    {content.logo.upload}
                  </Button>
                )}
              </ImagePicker>
              {logoUrl ? (
                <Button size="sm" variant="outline" onClick={() => onRemove('logo')}>
                  {content.logo.remove}
                </Button>
              ) : null}
            </div>
            <p id="store-logo-hint" className={styles.hint}>{content.logo.hint}</p>
            {errors.logo ? <p className={styles.error} role="alert">{errors.logo}</p> : null}
          </div>
        </div>
      </div>

      <div className={`${styles.group} ${styles.divided}`} role="group" aria-labelledby="store-banner-label">
        <p id="store-banner-label" className={styles.label}>{content.banner.label}</p>
        <div className={styles.banner}>
          <StoreBanner src={bannerUrl} alt={content.banner.alt} size="lg" />
          <div className={styles.bannerActions}>
            <ImagePicker id="store-banner" onSelect={(file) => onPick('banner', file)}>
              {(open) => (
                <Button
                  size="sm"
                  variant="outline"
                  icon={Upload}
                  onClick={open}
                  aria-describedby="store-banner-hint"
                >
                  {content.banner.change}
                </Button>
              )}
            </ImagePicker>
            {bannerUrl ? (
              <Button size="sm" variant="outline" onClick={() => onRemove('banner')}>
                {content.banner.remove}
              </Button>
            ) : null}
          </div>
        </div>
        <p id="store-banner-hint" className={styles.hint}>{content.banner.hint}</p>
        {errors.banner ? <p className={styles.error} role="alert">{errors.banner}</p> : null}
      </div>
    </>
  );
}

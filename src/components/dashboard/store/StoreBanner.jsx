import styles from './StoreBanner.module.css';

/**
 * The seller's banner image, or a striped teal placeholder until they
 * upload one. `size="sm"` is the shorter strip used in the live preview.
 */
export default function StoreBanner({ src, alt, size = 'md' }) {
  const className = `${styles.banner} ${styles[size]}`;

  if (src) {
    return <img className={className} src={src} alt={alt} />;
  }

  return <div className={`${className} ${styles.placeholder}`} role="img" aria-label={alt} />;
}

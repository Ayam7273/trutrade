import styles from './Avatar.module.css';

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * Round avatar. Shows the image when there is one, otherwise initials.
 * Decorative by default because the name is always printed next to it.
 */
export default function Avatar({ name, src, size = 'md', tone = 'neutral', alt = '' }) {
  const className = `${styles.avatar} ${styles[size]} ${styles[tone]}`;

  if (src) {
    return <img className={className} src={src} alt={alt} aria-hidden={alt ? undefined : 'true'} />;
  }

  return (
    <span className={className} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
}

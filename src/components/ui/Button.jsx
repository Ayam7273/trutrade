import { Link } from 'react-router-dom';
import styles from './Button.module.css';

/**
 * Shared button. Renders a router <Link> when `to` is given, otherwise a
 * <button>. Variants: "primary" (orange, one per view) and "outline".
 */
export default function Button({
  to,
  variant = 'primary',
  size = 'md',
  block = false,
  icon: Icon,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    block ? styles.block : '',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {Icon ? <Icon size={16} aria-hidden="true" /> : null}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}

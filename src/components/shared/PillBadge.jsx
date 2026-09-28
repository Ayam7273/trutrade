import styles from './PillBadge.module.css';

export default function PillBadge({
  variant = 'teal',
  tag = 'h3',
  className,
  children,
  ...rest
}) {
  const classes = [styles.badge, styles[variant], className].filter(Boolean).join(' ');
  const Heading = tag;

  return (
    <Heading className={classes} {...rest}>
      {children}
    </Heading>
  );
}

import Button from '../ui/Button.jsx';
import { dashboardPlaceholderContent as content } from '../../data/dashboardContent';
import styles from './ComingSoon.module.css';

/**
 * Placeholder for dashboard sections that are not built yet, so every
 * link lands somewhere sensible. `body` overrides the default message.
 */
export default function ComingSoon({ title, body = content.body }) {
  return (
    <section className={styles.section} aria-labelledby="coming-soon-heading">
      <h1 id="coming-soon-heading">{title}</h1>
      <p className={styles.body}>{body}</p>
      <Button to={content.backHref} variant="outline">
        {content.back}
      </Button>
    </section>
  );
}

import { Link } from 'react-router-dom';
import styles from './PageHeader.module.css';

/**
 * Page title row for dashboard sections: optional breadcrumb trail, h1,
 * subtitle, and an optional action (usually the page's one primary button).
 *
 * breadcrumbs: { label, items: [{ label, to? }] }; the last item is the
 * current page and is not a link. `badge` renders beside the title.
 */
export default function PageHeader({ title, subtitle, action, breadcrumbs, badge }) {
  return (
    <div className={styles.header}>
      <div>
        {breadcrumbs ? (
          <nav aria-label={breadcrumbs.label} className={styles.breadcrumbs}>
            <ol>
              {breadcrumbs.items.map((item, index) => {
                const last = index === breadcrumbs.items.length - 1;
                return (
                  <li key={item.label}>
                    {last ? (
                      <span aria-current="page" className={styles.current}>{item.label}</span>
                    ) : (
                      <Link to={item.to}>{item.label}</Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}
        {badge ? (
          <div className={styles.titleRow}>
            <h1>{title}</h1>
            {badge}
          </div>
        ) : (
          <h1>{title}</h1>
        )}
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}

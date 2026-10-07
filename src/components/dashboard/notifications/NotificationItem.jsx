import Button from '../../ui/Button.jsx';
import { notificationsPageContent as content, recentOrdersContent } from '../../../data/dashboardContent';
import { fill, formatLongDate, formatMoney, plural } from '../../../lib/format';
import { markNotificationRead } from '../../../lib/notificationsApi';
import utils from '../../../styles/utilities.module.css';
import styles from './NotificationItem.module.css';

const MINUTE = 60 * 1000;

function timeLabel(isoDate, now = Date.now()) {
  const minutes = Math.max(0, Math.floor((now - new Date(isoDate).getTime()) / MINUTE));
  if (minutes < 1) return content.time.justNow;
  if (minutes < 60) return plural(content.time.minutes, minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return plural(content.time.hours, hours);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (new Date(isoDate).toDateString() === yesterday.toDateString()) return content.time.yesterday;
  return formatLongDate(isoDate);
}

// Turns structured params ({ money, currency } / { count }) into display text.
function resolveParams(params) {
  return Object.fromEntries(Object.entries(params).map(([key, value]) => {
    if (value && typeof value === 'object' && 'money' in value) return [key, formatMoney(value.money, value.currency)];
    if (value && typeof value === 'object' && 'count' in value) return [key, plural(recentOrdersContent.itemCount, value.count)];
    return [key, value];
  }));
}

export default function NotificationItem({ notification }) {
  const type = content.types[notification.type];
  const values = resolveParams(notification.params);
  const title = fill(type.title, values);
  const detail = fill(type.detail, values);
  const unread = !notification.read;

  return (
    <article className={unread ? `${styles.item} ${styles.unread}` : styles.item}>
      {unread ? <span className={styles.bar} aria-hidden="true" /> : null}
      <div className={styles.text}>
        <p className={styles.meta}>
          <span className={styles.badge}>{type.badge}</span>
          <time dateTime={notification.createdAt}>{timeLabel(notification.createdAt)}</time>
        </p>
        <h3 className={styles.title}>
          {unread ? <span className={utils.srOnly}>{`${content.unread} `}</span> : null}
          {title}
        </h3>
        <p className={styles.detail}>{detail}</p>
      </div>
      <Button
        to={notification.link}
        variant="outline"
        size="sm"
        className={styles.action}
        aria-label={fill(content.actionAria, { action: type.action, title })}
        onClick={() => markNotificationRead(notification.id)}
      >
        {type.action}
      </Button>
    </article>
  );
}

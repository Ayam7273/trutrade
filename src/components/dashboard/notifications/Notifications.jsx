import { useState } from 'react';
import PageHeader from '../PageHeader.jsx';
import Tabs from '../Tabs.jsx';
import NotificationItem from './NotificationItem.jsx';
import { notificationsPageContent as content } from '../../../data/dashboardContent';
import { markAllNotificationsRead, useNotifications } from '../../../lib/notificationsApi';
import styles from './Notifications.module.css';

const PANEL_ID = 'notifications-panel';
const TAB_PREFIX = 'notifications-tab';

export default function Notifications() {
  const notifications = useNotifications();
  const [tab, setTab] = useState('all');
  const [status, setStatus] = useState('');
  const hasUnread = notifications.some((item) => !item.read);

  const visible = tab === 'all'
    ? notifications
    : notifications.filter((item) => content.types[item.type].category === tab);

  async function handleMarkAll() {
    await markAllNotificationsRead();
    setStatus(content.allReadStatus);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={content.title}
        subtitle={content.subtitle}
        action={(
          <button type="button" className={styles.markAll} onClick={handleMarkAll} disabled={!hasUnread}>
            {content.markAllRead}
          </button>
        )}
      />
      <p className={styles.status} role="status">{status}</p>

      <section className={styles.card} aria-labelledby={`${TAB_PREFIX}-${tab}`}>
        <Tabs
          label={content.tabsLabel}
          tabs={content.tabs}
          value={tab}
          onChange={setTab}
          panelId={PANEL_ID}
          idPrefix={TAB_PREFIX}
        />

        <div id={PANEL_ID} role="tabpanel" aria-labelledby={`${TAB_PREFIX}-${tab}`}>
          {visible.length === 0 ? (
            <p className={styles.empty}>{tab === 'all' ? content.empty : content.emptyFiltered}</p>
          ) : (
            <ul className={styles.list}>
              {visible.map((notification) => (
                <li key={notification.id}>
                  <NotificationItem notification={notification} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

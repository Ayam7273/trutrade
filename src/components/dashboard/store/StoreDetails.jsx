import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import Panel from '../Panel.jsx';
import { storeDetailsContent as content } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import styles from './StoreDetails.module.css';

function StoreUrl({ slug }) {
  const [message, setMessage] = useState('');
  const display = `${content.storefrontHost}/${slug}`;

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(''), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`https://${display}`);
      setMessage(content.copied);
    } catch {
      setMessage(content.copyError);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.url}
        aria-label={fill(content.copyAria, { url: display })}
        onClick={handleCopy}
      >
        {display}
        <Copy size={14} aria-hidden="true" />
      </button>
      <span className={styles.copyMessage} role="status">{message}</span>
    </>
  );
}

export default function StoreDetails({ store }) {
  const rows = [
    { id: 'name', value: store.name },
    { id: 'category', value: store.category },
    { id: 'description', value: store.description },
    { id: 'email', value: <a href={`mailto:${store.email}`}>{store.email}</a> },
    { id: 'phone', value: <a href={`tel:${store.phone.replace(/\s+/g, '')}`}>{store.phone}</a> },
    { id: 'location', value: store.location },
    { id: 'url', value: <StoreUrl slug={store.slug} /> },
  ];

  return (
    <Panel title={content.title}>
      <dl className={styles.list}>
        {rows.map((row) => (
          <div key={row.id} className={styles.row}>
            <dt>{content.fields[row.id]}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

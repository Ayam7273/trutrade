import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import Panel from '../Panel.jsx';
import StatusBadge from '../StatusBadge.jsx';
import { topProductsContent as content } from '../../../data/dashboardContent';
import { fill, formatMoney } from '../../../lib/format';
import styles from './TopProducts.module.css';

const STOCK_TONE = { in: 'success', low: 'warning', out: 'error' };

export default function TopProducts({ products }) {
  return (
    <Panel title={content.title} action={<Link to={content.viewAllHref}>{content.viewAll}</Link>}>
      {products.length === 0 ? (
        <p className={styles.empty} role="status">{content.empty}</p>
      ) : (
        <ul className={styles.list}>
          {products.map((product) => (
            <li key={product.id} className={styles.item}>
              {product.imageUrl ? (
                <img className={styles.thumb} src={product.imageUrl} alt="" aria-hidden="true" />
              ) : (
                <span className={styles.thumb} aria-hidden="true">
                  <Package size={22} />
                </span>
              )}
              <div className={styles.text}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.meta}>
                  {fill(content.soldLabel, { n: product.sold })}
                  {' · '}
                  <span className={styles.revenue}>{formatMoney(product.revenue, product.currency)}</span>
                </p>
              </div>
              <StatusBadge tone={STOCK_TONE[product.stock]}>{content.stock[product.stock]}</StatusBadge>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

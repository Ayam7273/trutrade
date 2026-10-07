import { Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../PageHeader.jsx';
import Button from '../../ui/Button.jsx';
import ProductStats from './ProductStats.jsx';
import ProductsList from './ProductsList.jsx';
import { productsPageContent as content } from '../../../data/dashboardContent';
import { useProducts } from '../../../lib/productsApi';
import styles from './Products.module.css';

export default function Products() {
  const products = useProducts();
  const { state } = useLocation();

  return (
    <div className={styles.page}>
      <PageHeader
        title={content.title}
        subtitle={content.subtitle}
        action={<Button to={content.addProductHref} icon={Plus}>{content.addProduct}</Button>}
      />
      <p className={styles.saved} role="status">{state?.saved ?? ''}</p>
      <ProductStats products={products} />
      <ProductsList products={products} />
    </div>
  );
}

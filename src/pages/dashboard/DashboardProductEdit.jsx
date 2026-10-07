import { useParams } from 'react-router-dom';
import ComingSoon from '../../components/dashboard/ComingSoon.jsx';
import ProductForm from '../../components/dashboard/products/ProductForm.jsx';
import { productFormContent } from '../../data/dashboardContent';
import { useProducts } from '../../lib/productsApi';

export default function DashboardProductEdit() {
  const { id } = useParams();
  const product = useProducts().find((item) => item.id === id);

  if (!product) {
    return <ComingSoon title={productFormContent.edit.title} body={productFormContent.notFound} />;
  }

  // key resets the form if the route switches to a different product.
  return <ProductForm key={product.id} product={product} />;
}

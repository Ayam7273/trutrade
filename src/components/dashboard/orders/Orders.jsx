import PageHeader from '../PageHeader.jsx';
import OrdersStats from './OrdersStats.jsx';
import OrdersList from './OrdersList.jsx';
import { ordersPageContent as content } from '../../../data/dashboardContent';
import { mockOrdersTrend } from '../../../lib/dashboardMock';
import { useOrders } from '../../../lib/ordersApi';
import styles from './Orders.module.css';

export default function Orders() {
  const orders = useOrders();

  return (
    <div className={styles.page}>
      <PageHeader title={content.title} subtitle={content.subtitle} />
      <OrdersStats orders={orders} trend={mockOrdersTrend} />
      <OrdersList orders={orders} />
    </div>
  );
}

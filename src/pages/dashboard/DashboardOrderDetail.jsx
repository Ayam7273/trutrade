import { useParams } from 'react-router-dom';
import ComingSoon from '../../components/dashboard/ComingSoon.jsx';
import OrderDetail from '../../components/dashboard/orders/OrderDetail.jsx';
import { orderDetailContent } from '../../data/dashboardContent';
import { useOrders } from '../../lib/ordersApi';

export default function DashboardOrderDetail() {
  const { orderId } = useParams();
  const order = useOrders().find((item) => item.id === orderId);

  if (!order) {
    return <ComingSoon title={orderDetailContent.notFoundTitle} body={orderDetailContent.notFound} />;
  }

  // key resets local UI state (open forms, messages) when switching orders.
  return <OrderDetail key={order.id} order={order} />;
}

import { useParams } from 'react-router-dom';
import ComingSoon from '../../components/dashboard/ComingSoon.jsx';
import TransactionDetail from '../../components/dashboard/payments/TransactionDetail.jsx';
import { transactionDetailContent } from '../../data/dashboardContent';
import { useTransactions } from '../../lib/paymentsApi';

export default function DashboardTransactionDetail() {
  const { id } = useParams();
  const txn = useTransactions().find((item) => item.id === id);

  if (!txn) {
    return <ComingSoon title={transactionDetailContent.notFoundTitle} body={transactionDetailContent.notFound} />;
  }

  return <TransactionDetail key={txn.id} txn={txn} />;
}

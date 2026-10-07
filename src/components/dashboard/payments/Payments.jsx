import PageHeader from '../PageHeader.jsx';
import BalanceStats from './BalanceStats.jsx';
import EarningsOverview from './EarningsOverview.jsx';
import WithdrawalSummary from './WithdrawalSummary.jsx';
import WithdrawalAccount from './WithdrawalAccount.jsx';
import TransactionsList from './TransactionsList.jsx';
import { paymentsPageContent as content } from '../../../data/dashboardContent';
import { mockEarningsSeries, mockPayoutSpeedHours } from '../../../lib/dashboardMock';
import { useBalances, useTransactions, useWithdrawal } from '../../../lib/paymentsApi';
import styles from './Payments.module.css';

export default function Payments() {
  const balances = useBalances();
  const transactions = useTransactions();
  const withdrawal = useWithdrawal();

  return (
    <div className={styles.page}>
      <PageHeader title={content.title} subtitle={content.subtitle} />
      <BalanceStats balances={balances} />

      <div className={styles.row}>
        <EarningsOverview series={mockEarningsSeries} payoutSpeedHours={mockPayoutSpeedHours} />
        <div className={styles.column}>
          <WithdrawalSummary withdrawal={withdrawal} />
          <WithdrawalAccount account={withdrawal.account} />
        </div>
      </div>

      <TransactionsList transactions={transactions} />
    </div>
  );
}

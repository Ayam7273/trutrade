import Panel from '../Panel.jsx';
import StatusBadge from '../StatusBadge.jsx';
import Button from '../../ui/Button.jsx';
import { withdrawalAccountContent as content } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import utils from '../../../styles/utilities.module.css';
import styles from './WithdrawalAccount.module.css';

export default function WithdrawalAccount({ account }) {
  const values = { holder: account.holder, last4: account.last4 };

  return (
    <Panel
      title={content.title}
      action={(
        <StatusBadge tone={account.verified ? 'success' : 'warning'}>
          {account.verified ? content.verified : content.unverified}
        </StatusBadge>
      )}
    >
      <p className={styles.bank}>{account.bank}</p>
      <p className={styles.holder}>
        <span aria-hidden="true">{fill(content.accountLine, values)}</span>
        <span className={utils.srOnly}>{fill(content.accountAria, values)}</span>
      </p>
      <Button to={content.ctaHref} variant="outline" block>{content.cta}</Button>
    </Panel>
  );
}

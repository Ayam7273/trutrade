import { CreditCard, Plus, ShoppingBag, Store } from 'lucide-react';
import Panel from '../Panel.jsx';
import Button from '../../ui/Button.jsx';
import { quickActionsContent as content } from '../../../data/dashboardContent';
import styles from './QuickActions.module.css';

const ICONS = { CreditCard, Plus, ShoppingBag, Store };

export default function QuickActions() {
  return (
    <Panel title={content.title}>
      <div className={styles.actions}>
        <Button to={content.primary.href} icon={ICONS[content.primary.icon]} block className={styles.wide}>
          {content.primary.label}
        </Button>
        {content.secondary.map((action) => (
          <Button
            key={action.id}
            to={action.href}
            variant="outline"
            icon={ICONS[action.icon]}
            className={action.wide ? styles.wide : undefined}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </Panel>
  );
}

import { useParams } from 'react-router-dom';
import ComingSoon from '../../components/dashboard/ComingSoon.jsx';
import { fill } from '../../lib/format';

/**
 * Generic "coming soon" route. `title` may contain {param} placeholders
 * that are filled from the route params, e.g. "Transaction {id}".
 */
export default function DashboardPlaceholder({ title }) {
  const params = useParams();
  return <ComingSoon title={fill(title, params)} />;
}

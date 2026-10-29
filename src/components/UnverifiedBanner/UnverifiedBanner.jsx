import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './UnverifiedBanner.module.css';

export default function UnverifiedBanner() {
  const { session, profile } = useAuth();

  if (!session || profile?.verification_status === 'verified') return null;

  const pending = profile?.verification_status === 'pending';

  return (
    <div className={styles.banner} role="status">
      <p className={styles.text}>
        {pending
          ? 'Your identity verification is in review. We’ll email you once it’s complete.'
          : 'Finish verifying your identity to earn your verified badge. Check your email for your secure verification link.'}{' '}
        <Link to="/verify" className={styles.link}>{pending ? 'View status' : 'Verify now'}</Link>
      </p>
    </div>
  );
}

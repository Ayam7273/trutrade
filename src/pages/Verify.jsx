import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/home/Navbar.jsx';
import { useAuth } from '../contexts/AuthContext';
import { startVerification } from '../lib/verificationApi';
import styles from './Verify.module.css';

const STATUS_COPY = {
  verified: {
    badge: 'Verified',
    title: "You're verified",
    body: 'Your identity has been confirmed. You have full access to TruTrade.',
  },
  pending: {
    badge: 'In review',
    title: 'Verification in progress',
    body: "We've received your details and they're being reviewed. We'll email you as soon as it's complete — this usually takes a little while.",
  },
  rejected: {
    badge: 'Action needed',
    title: "We couldn't verify your identity",
    body: "Your last verification attempt didn't go through. You can start again with a new secure link below.",
  },
  unverified: {
    badge: 'Not started',
    title: 'Verify your identity',
    body: 'To keep TruTrade safe, we verify every account with our partner Yoti. We’ll email you a secure link where you submit your full name, address, passport or driver’s licence, and a quick selfie. Everything happens on Yoti — no documents are stored on TruTrade.',
  },
};

export default function Verify() {
  const { profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  const status = ['verified', 'pending', 'rejected'].includes(profile?.verification_status)
    ? profile.verification_status
    : 'unverified';
  const copy = STATUS_COPY[status];
  const canStart = status === 'unverified' || status === 'rejected';

  async function handleStart() {
    setSubmitting(true);
    setNotice('');
    const { configured } = await startVerification();
    setNotice(
      configured
        ? "We've emailed you a secure verification link. Check your inbox to continue."
        : "Identity verification isn't switched on yet. Once our Yoti integration is live, your secure link will arrive here by email.",
    );
    setSubmitting(false);
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          <span className={`${styles.badge} ${styles[`badge_${status}`]}`}>{copy.badge}</span>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.body}>{copy.body}</p>

          {notice ? <p className={styles.notice} role="status">{notice}</p> : null}

          {canStart ? (
            <button type="button" className={styles.primary} onClick={handleStart} disabled={submitting}>
              {submitting ? 'Please wait…' : status === 'rejected' ? 'Try again' : 'Start identity verification'}
            </button>
          ) : null}

          <Link to={profile?.role === 'seller' ? '/dashboard' : '/marketplace'} className={styles.link}>
            {profile?.role === 'seller' ? 'Back to dashboard' : 'Continue to marketplace'}
          </Link>
        </div>
      </main>
    </div>
  );
}

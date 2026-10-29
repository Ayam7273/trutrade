import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordContent as content } from '../../data/authContent';
import { authErrorMessage, sendPasswordReset } from '../../lib/supabaseAuth';
import Alert from '../ui/Alert.jsx';
import styles from './LoginForm.module.css';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError(content.emailError);
      return;
    }
    setError('');
    setFormError('');
    setSubmitting(true);
    try {
      const { error: resetError } = await sendPasswordReset(trimmed);
      if (resetError) {
        setFormError(authErrorMessage(resetError).message);
        return;
      }
      setSent(true);
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.form}>
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <h1>{content.title}</h1>

      {sent ? (
        <Alert variant="success">{content.sent}</Alert>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className={styles.switch} style={{ marginTop: 0, marginBottom: 20, textAlign: 'left' }}>
            {content.intro}
          </p>

          <div className={styles.field}>
            <label htmlFor="forgot-email">{content.emailLabel}</label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={content.emailPlaceholder}
              value={email}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'forgot-email-error' : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              required
            />
            {error ? (
              <p id="forgot-email-error" className={styles.error} role="alert">{error}</p>
            ) : null}
          </div>

          {formError ? <Alert variant="error">{formError}</Alert> : null}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? content.submitting : content.submit}
          </button>
        </form>
      )}

      <p className={styles.switch}>
        {content.backPrompt}{' '}
        <Link to={content.backHref}>{content.backLink}</Link>
      </p>
    </div>
  );
}

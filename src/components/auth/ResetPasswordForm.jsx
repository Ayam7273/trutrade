import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPasswordContent as content } from '../../data/authContent';
import { signOut, updatePassword } from '../../lib/supabaseAuth';
import Alert from '../ui/Alert.jsx';
import PasswordField from './PasswordField.jsx';
import styles from './LoginForm.module.css';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (password.length < 8) nextErrors.password = content.passwordError;
    if (!confirmPassword) nextErrors.confirmPassword = content.confirmRequiredError;
    else if (confirmPassword !== password) nextErrors.confirmPassword = content.confirmMatchError;
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        const raw = (error.message || '').toLowerCase();
        setFormError(raw.includes('session') || raw.includes('auth') ? content.invalidLink : error.message);
        return;
      }
      // Clear the temporary recovery session so they log in fresh.
      await signOut();
      setDone(true);
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

      {done ? (
        <>
          <Alert variant="success">{content.success}</Alert>
          <p className={styles.switch}>
            {content.loginPrompt}{' '}
            <Link to={content.loginHref}>{content.loginLink}</Link>
          </p>
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className={styles.switch} style={{ marginTop: 0, marginBottom: 20, textAlign: 'left' }}>
            {content.intro}
          </p>

          <div className={styles.field}>
            <label htmlFor="reset-password">{content.passwordLabel}</label>
            <PasswordField
              id="reset-password"
              name="password"
              autoComplete="new-password"
              placeholder={content.passwordPlaceholder}
              value={password}
              invalid={Boolean(errors.password)}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((c) => ({ ...c, password: undefined }));
              }}
              required
            />
            {errors.password ? (
              <p className={styles.error} role="alert">{errors.password}</p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="reset-confirm">{content.confirmLabel}</label>
            <PasswordField
              id="reset-confirm"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder={content.confirmPlaceholder}
              value={confirmPassword}
              invalid={Boolean(errors.confirmPassword)}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setErrors((c) => ({ ...c, confirmPassword: undefined }));
              }}
              required
            />
            {errors.confirmPassword ? (
              <p className={styles.error} role="alert">{errors.confirmPassword}</p>
            ) : null}
          </div>

          {formError ? <Alert variant="error">{formError}</Alert> : null}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? content.submitting : content.submit}
          </button>
        </form>
      )}
    </div>
  );
}

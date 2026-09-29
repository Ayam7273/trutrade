import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginContent } from '../../data/authContent';
import { signInWithEmail, signInWithGoogle } from '../../lib/supabaseAuth';
import GoogleIcon from './GoogleIcon.jsx';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function clearError(field) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleGoogleClick() {
    setFormError('');
    setSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) setFormError(error.message);
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      nextErrors.email = loginContent.emailError;
    }
    if (!password) {
      nextErrors.password = loginContent.passwordError;
    }

    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { data, error } = await signInWithEmail({ email: trimmedEmail, password });
      if (error) {
        setFormError(error.message);
        return;
      }
      // TODO: redirect to the user's dashboard once that route exists
      console.log(data);
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.form}>
      <p className={styles.eyebrow}>{loginContent.eyebrow}</p>
      <h1>{loginContent.title}</h1>

      <button type="button" className={styles.google} onClick={handleGoogleClick} disabled={submitting}>
        <GoogleIcon />
        {loginContent.google}
      </button>

      <div className={styles.divider}>
        <span>{loginContent.divider}</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="login-email">{loginContent.emailLabel}</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={loginContent.emailPlaceholder}
            value={email}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError('email');
            }}
            required
          />
          {errors.email ? (
            <p id="login-email-error" className={styles.error} role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="login-password">{loginContent.passwordLabel}</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder={loginContent.passwordPlaceholder}
            value={password}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError('password');
            }}
            required
          />
          {errors.password ? (
            <p id="login-password-error" className={styles.error} role="alert">
              {errors.password}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        ) : null}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {loginContent.submit}
        </button>
      </form>

      <p className={styles.switch}>
        {loginContent.footerPrompt}{' '}
        <Link to={loginContent.footerHref}>{loginContent.footerLink}</Link>
      </p>
    </div>
  );
}

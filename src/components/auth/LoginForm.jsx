import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginContent } from '../../data/authContent';
import GoogleIcon from './GoogleIcon.jsx';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function clearError(field) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleGoogleClick() {
    // TODO: wire to supabase.auth.signInWithOAuth({ provider: 'google' })
    console.log({ provider: 'google' });
  }

  function handleSubmit(event) {
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
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: wire to supabase.auth.signInWithPassword({ email, password })
    console.log({ email: trimmedEmail, password });
  }

  return (
    <div className={styles.form}>
      <p className={styles.eyebrow}>{loginContent.eyebrow}</p>
      <h1>{loginContent.title}</h1>

      <button type="button" className={styles.google} onClick={handleGoogleClick}>
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

        <button type="submit" className={styles.submit}>
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

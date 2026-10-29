import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginContent } from '../../data/authContent';
import { useAuth } from '../../contexts/AuthContext';
import { setMyRole } from '../../lib/profile';
import {
  accountTypeFromUser,
  authErrorMessage,
  resendConfirmation,
  signInAndCheckVerification,
  signInWithGoogle,
} from '../../lib/supabaseAuth';
import { requireSupabase } from '../../lib/supabaseClient';
import Alert from '../ui/Alert.jsx';
import GoogleIcon from './GoogleIcon.jsx';
import PasswordField from './PasswordField.jsx';
import styles from './LoginForm.module.css';

function safeFrom(location) {
  const from = location.state?.from;
  if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) return from;
  return '/marketplace';
}

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading, refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [notice, setNotice] = useState('');
  const [resending, setResending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const routed = useRef(false);
  const pendingRoute = useRef(false);

  // The confirmation link returns here with a session (or token_hash).
  // Sign the person in from that link instead of asking for the password again.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const description = params.get('error_description') || hash.get('error_description');
    if (description) {
      setFormError(description.replace(/\+/g, ' '));
      setCanResend(true);
    }
    if (hash.has('access_token') || params.has('code') || params.has('token_hash')) {
      pendingRoute.current = true;
    }

    const tokenHash = params.get('token_hash');
    const type = params.get('type');
    if (!tokenHash || (type !== 'signup' && type !== 'email')) return undefined;

    let cancelled = false;
    requireSupabase()
      .auth.verifyOtp({ type, token_hash: tokenHash })
      .then(({ error }) => {
        if (cancelled || !error) return;
        const { message, needsConfirm } = authErrorMessage(error);
        setFormError(message);
        setCanResend(needsConfirm);
      })
      .catch((err) => {
        if (!cancelled) setFormError(err.message || 'Could not confirm this email.');
      });

    return () => {
      cancelled = true;
    };
  }, [location.search, location.hash]);

  useEffect(() => {
    if (loading || !session || submitting || routed.current || !pendingRoute.current) return undefined;

    let cancelled = false;
    (async () => {
      const fresh = await refreshProfile();
      if (cancelled || routed.current) return;

      let role = fresh?.role;
      const hinted = accountTypeFromUser(session.user);
      if (!role && hinted) {
        const { error } = await setMyRole(hinted);
        if (cancelled || routed.current) return;
        if (error) {
          const raw = error.message || '';
          setFormError(
            raw.toLowerCase().includes('role cannot be changed')
              ? 'This email is already registered as the other account type. Sign in with it, or create the seller account with a different email.'
              : `${raw || 'Could not save your account type.'} If this is a seller account, run supabase/fix-seller-signup.sql in the Supabase SQL editor, then open your confirmation link again.`,
          );
          return;
        }
        const next = await refreshProfile();
        if (cancelled || routed.current) return;
        role = next?.role || hinted;
      }

      routed.current = true;
      navigate(role === 'seller' ? '/dashboard' : safeFrom(location), { replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, session, submitting, refreshProfile, navigate, location]);

  async function handleResend() {
    setResending(true);
    setNotice('');
    const { error } = await resendConfirmation(email.trim());
    setResending(false);
    if (error) {
      setFormError(authErrorMessage(error).message);
    } else {
      setFormError('');
      setCanResend(false);
      setNotice(loginContent.resendSent);
    }
  }

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
    setNotice('');
    setCanResend(false);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { error } = await signInAndCheckVerification({ email: trimmedEmail, password });
      if (error) {
        const { message, needsConfirm } = authErrorMessage(error);
        setFormError(message);
        setCanResend(needsConfirm);
        return;
      }
      pendingRoute.current = true;
      await refreshProfile();
      // The session effect routes once the profile (and seller role) is ready.
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
          <PasswordField
            id="login-password"
            name="password"
            autoComplete="current-password"
            placeholder={loginContent.passwordPlaceholder}
            value={password}
            invalid={Boolean(errors.password)}
            describedBy={errors.password ? 'login-password-error' : undefined}
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

        <div className={styles.forgotRow}>
          <Link to={loginContent.forgotHref} className={styles.forgot}>{loginContent.forgot}</Link>
        </div>

        {notice ? <Alert variant="success">{notice}</Alert> : null}
        {formError ? (
          <Alert
            variant="error"
            action={canResend ? (
              <button type="button" onClick={handleResend} disabled={resending || !email.trim()}>
                {resending ? 'Sending…' : loginContent.resend}
              </button>
            ) : null}
          >
            {formError}
          </Alert>
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

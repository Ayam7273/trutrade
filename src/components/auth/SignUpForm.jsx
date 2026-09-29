import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUpContent } from '../../data/authContent';
import styles from './SignUpForm.module.css';

export default function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  function clearError(field) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirst) nextErrors.firstName = signUpContent.firstNameError;
    if (!trimmedLast) nextErrors.lastName = signUpContent.lastNameError;
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      nextErrors.email = signUpContent.emailError;
    }
    if (!trimmedPhone) nextErrors.phone = signUpContent.phoneError;
    if (password.length < 8) nextErrors.password = signUpContent.passwordError;
    if (!confirmPassword) {
      nextErrors.confirmPassword = signUpContent.confirmRequiredError;
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = signUpContent.confirmMatchError;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: wire to supabase.auth.signUp({ email, password, options: { data: { first_name, last_name, phone } } })
    console.log({
      email: trimmedEmail,
      password,
      options: {
        data: {
          first_name: trimmedFirst,
          last_name: trimmedLast,
          phone: trimmedPhone,
        },
      },
    });
  }

  return (
    <div className={styles.form}>
      <p className={styles.eyebrow}>{signUpContent.eyebrow}</p>
      <h1>{signUpContent.title}</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.nameRow}>
          <div className={styles.field}>
            <label htmlFor="signup-first-name">{signUpContent.firstNameLabel}</label>
            <input
              id="signup-first-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder={signUpContent.firstNamePlaceholder}
              value={firstName}
              aria-invalid={errors.firstName ? 'true' : 'false'}
              aria-describedby={errors.firstName ? 'signup-first-name-error' : undefined}
              onChange={(event) => {
                setFirstName(event.target.value);
                clearError('firstName');
              }}
              required
            />
            {errors.firstName ? (
              <p id="signup-first-name-error" className={styles.error} role="alert">
                {errors.firstName}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-last-name">{signUpContent.lastNameLabel}</label>
            <input
              id="signup-last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder={signUpContent.lastNamePlaceholder}
              value={lastName}
              aria-invalid={errors.lastName ? 'true' : 'false'}
              aria-describedby={errors.lastName ? 'signup-last-name-error' : undefined}
              onChange={(event) => {
                setLastName(event.target.value);
                clearError('lastName');
              }}
              required
            />
            {errors.lastName ? (
              <p id="signup-last-name-error" className={styles.error} role="alert">
                {errors.lastName}
              </p>
            ) : null}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="signup-email">{signUpContent.emailLabel}</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={signUpContent.emailPlaceholder}
            value={email}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError('email');
            }}
            required
          />
          {errors.email ? (
            <p id="signup-email-error" className={styles.error} role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="signup-phone">{signUpContent.phoneLabel}</label>
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={signUpContent.phonePlaceholder}
            value={phone}
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'signup-phone-error' : undefined}
            onChange={(event) => {
              setPhone(event.target.value);
              clearError('phone');
            }}
            required
          />
          {errors.phone ? (
            <p id="signup-phone-error" className={styles.error} role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="signup-password">{signUpContent.passwordLabel}</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={signUpContent.passwordPlaceholder}
            value={password}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'signup-password-error' : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError('password');
            }}
            required
          />
          {errors.password ? (
            <p id="signup-password-error" className={styles.error} role="alert">
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="signup-confirm">{signUpContent.confirmLabel}</label>
          <input
            id="signup-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder={signUpContent.confirmPlaceholder}
            value={confirmPassword}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'signup-confirm-error' : undefined}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              clearError('confirmPassword');
            }}
            required
          />
          {errors.confirmPassword ? (
            <p id="signup-confirm-error" className={styles.error} role="alert">
              {errors.confirmPassword}
            </p>
          ) : null}
        </div>

        <button type="submit" className={styles.submit}>
          {signUpContent.submit}
        </button>
      </form>

      <p className={styles.switch}>
        {signUpContent.footerPrompt}{' '}
        <Link to={signUpContent.footerHref}>{signUpContent.footerLink}</Link>
      </p>
    </div>
  );
}

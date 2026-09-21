import { useState } from 'react';
import { newsletterContent } from '../../data/homeContent';
import styles from './NewsletterCTA.module.css';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError(newsletterContent.emptyError);
      return;
    }
    if (!value.includes('@')) {
      setError(newsletterContent.invalidError);
      return;
    }
    setError('');
    console.log('newsletter subscribe', value);
  }

  return (
    <section className={styles.section} id="signup" aria-labelledby="newsletter-heading">
      <div className={styles.card}>
        <div className={styles.copy}>
          <h2 id="newsletter-heading">{newsletterContent.title}</h2>
          <p>{newsletterContent.body}</p>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.srOnly} htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletterContent.placeholder}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'newsletter-error' : undefined}
            />
            <button type="submit">{newsletterContent.cta}</button>
          </form>
          {error ? (
            <p id="newsletter-error" className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <div className={styles.art} aria-hidden="true">
          <img src={newsletterContent.image} alt="" />
        </div>
      </div>
    </section>
  );
}

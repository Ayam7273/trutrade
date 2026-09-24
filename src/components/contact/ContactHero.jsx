import { useState } from 'react';
import { contactHeroContent } from '../../data/contactContent';
import styles from './ContactHero.module.css';

export default function ContactHero() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      nextErrors.email = contactHeroContent.emailError;
    }
    if (!trimmedMessage) {
      nextErrors.message = contactHeroContent.messageError;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: wire to Supabase
    console.log({
      name: name.trim(),
      email: trimmedEmail,
      message: trimmedMessage,
    });
  }

  return (
    <section className={styles.section} aria-labelledby="contact-hero-heading">
      <div className={styles.inner}>
        <h1 id="contact-hero-heading">
          {contactHeroContent.titleLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h1>
        <p className={styles.subtext}>{contactHeroContent.body}</p>

        <div className={styles.panel}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="contact-name">{contactHeroContent.nameLabel}</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={contactHeroContent.namePlaceholder}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-email">{contactHeroContent.emailLabel}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={contactHeroContent.emailPlaceholder}
                value={email}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email ? (
                <p id="contact-email-error" className={styles.error} role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message">{contactHeroContent.messageLabel}</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder={contactHeroContent.messagePlaceholder}
                value={message}
                rows={5}
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                onChange={(event) => setMessage(event.target.value)}
              />
              {errors.message ? (
                <p id="contact-message-error" className={styles.error} role="alert">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <button type="submit" className={styles.submit}>
              {contactHeroContent.submit}
            </button>
          </form>

          <div className={styles.art}>
            <img src={contactHeroContent.image} alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

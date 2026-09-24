import { contactInfoContent } from '../../data/contactContent';
import styles from './ContactInfoSection.module.css';

export default function ContactInfoSection() {
  return (
    <section className={styles.section} aria-labelledby="contact-info-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.label}>{contactInfoContent.label}</p>
          <h2 id="contact-info-heading">{contactInfoContent.title}</h2>
        </div>

        <div className={styles.channels}>
          {contactInfoContent.channels.map((channel) => (
            <article key={channel.id}>
              <h3>{channel.title}</h3>
              <span className={styles.rule} aria-hidden="true" />
              <a href={channel.href}>{channel.value}</a>
              <p>{channel.hours}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

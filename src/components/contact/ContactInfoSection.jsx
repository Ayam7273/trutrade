import { contactInfoContent } from '../../data/contactContent';
import styles from './ContactInfoSection.module.css';

export default function ContactInfoSection() {
  return (
    <section className={styles.section} aria-labelledby="contact-info-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.label}>{contactInfoContent.label}</p>
          <h2 id="contact-info-heading">{contactInfoContent.title}</h2>
          <p className={styles.body}>{contactInfoContent.body}</p>
        </div>
      </div>
    </section>
  );
}

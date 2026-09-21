import { infraContent } from '../../data/homeContent';
import styles from './InfraSection.module.css';

export default function InfraSection() {
  return (
    <section className={styles.section} id="services" aria-labelledby="infra-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.badge}>{infraContent.badge}</span>
          <h2 id="infra-heading">{infraContent.title}</h2>
          <p>{infraContent.body}</p>
        </div>
        <div className={styles.panel}>
          <img src={infraContent.image} alt={infraContent.imageAlt} />
        </div>
      </div>
    </section>
  );
}

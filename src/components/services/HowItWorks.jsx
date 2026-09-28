import { howItWorksContent } from '../../data/servicesContent';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
    <section className={styles.section} aria-labelledby="how-it-works-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <h2 id="how-it-works-heading">{howItWorksContent.title}</h2>
          <p>{howItWorksContent.body}</p>
        </div>

        <ol className={styles.steps}>
          {howItWorksContent.steps.map((step) => (
            <li key={step.number}>
              <h3>
                <span className={styles.number}>{step.number}</span>
                <span className={styles.stepTitle}>{step.title}</span>
              </h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

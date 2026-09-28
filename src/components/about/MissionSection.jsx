import { Check } from 'lucide-react';
import { aboutMissionContent } from '../../data/aboutContent';
import PillBadge from '../shared/PillBadge.jsx';
import styles from './MissionSection.module.css';

export default function MissionSection() {
  return (
    <section className={styles.section} aria-labelledby="mission-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.badge}>{aboutMissionContent.badge}</span>
          <h2 id="mission-heading">{aboutMissionContent.title}</h2>
          <p>{aboutMissionContent.body}</p>
        </div>

        <article className={styles.card} aria-labelledby="promise-heading">
          <PillBadge id="promise-heading" variant="light">
            {aboutMissionContent.promiseTitle}
          </PillBadge>
          <ul className={styles.promises}>
            {aboutMissionContent.promises.map((line) => (
              <li key={line}>
                <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

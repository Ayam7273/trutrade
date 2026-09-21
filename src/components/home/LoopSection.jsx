import { loopContent } from '../../data/homeContent';
import styles from './LoopSection.module.css';

export default function LoopSection() {
  return (
    <section className={styles.section} aria-labelledby="loop-heading">
      <div className={styles.inner}>
        <h2 id="loop-heading">{loopContent.title}</h2>
        <p className={styles.subtext}>{loopContent.subtext}</p>

        <div className={styles.frame}>
          <img src={loopContent.image} alt={loopContent.imageAlt} />
        </div>
      </div>
    </section>
  );
}

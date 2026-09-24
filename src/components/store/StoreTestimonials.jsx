import { testimonialsContent } from '../../data/homeContent';
import { storeTestimonialsContent } from '../../data/storeContent';
import TestimonialsCarousel from '../home/TestimonialsCarousel.jsx';
import styles from './StoreTestimonials.module.css';

export default function StoreTestimonials() {
  return (
    <section className={styles.section} aria-labelledby="store-testimonials-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="store-testimonials-heading" className={`${styles.pillBadge} ${styles.teal}`}>
            {storeTestimonialsContent.badge}
          </h2>
          <p>{storeTestimonialsContent.body}</p>
        </div>
        <TestimonialsCarousel showHeader={false} items={testimonialsContent.items} />
      </div>
    </section>
  );
}

import { testimonialsContent } from '../../data/homeContent';
import { storeTestimonialsContent } from '../../data/storeContent';
import TestimonialsCarousel from '../home/TestimonialsCarousel.jsx';
import PillBadge from '../shared/PillBadge.jsx';
import styles from './StoreTestimonials.module.css';

export default function StoreTestimonials() {
  return (
    <section className={styles.section} aria-labelledby="store-testimonials-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <PillBadge id="store-testimonials-heading" tag="h2" variant="teal">
            {storeTestimonialsContent.badge}
          </PillBadge>
          <p>{storeTestimonialsContent.body}</p>
        </div>
        <TestimonialsCarousel showHeader={false} items={testimonialsContent.items} />
      </div>
    </section>
  );
}

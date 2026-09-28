import { testimonialsContent } from '../../data/homeContent';
import { servicesTestimonialsContent } from '../../data/servicesContent';
import TestimonialsCarousel from '../home/TestimonialsCarousel.jsx';
import PillBadge from '../shared/PillBadge.jsx';
import styles from './ServicesTestimonials.module.css';

export default function ServicesTestimonials() {
  return (
    <section className={styles.section} aria-labelledby="services-testimonials-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <PillBadge id="services-testimonials-heading" tag="h2" variant="teal">
            {servicesTestimonialsContent.badge}
          </PillBadge>
          <p>{servicesTestimonialsContent.body}</p>
        </div>
        <TestimonialsCarousel showHeader={false} items={testimonialsContent.items} />
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Star } from 'lucide-react';
import { testimonialsContent } from '../../data/homeContent';
import styles from './TestimonialsCarousel.module.css';

export default function TestimonialsCarousel() {
  const items = testimonialsContent.items;
  const [active, setActive] = useState(1);
  const count = items.length;

  const prevIndex = (active - 1 + count) % count;
  const nextIndex = (active + 1) % count;

  const goPrev = () => setActive((i) => (i - 1 + count) % count);
  const goNext = () => setActive((i) => (i + 1) % count);

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  }

  const cards = [
    { item: items[prevIndex], slot: 'left' },
    { item: items[active], slot: 'center' },
    { item: items[nextIndex], slot: 'right' },
  ];

  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className={styles.inner}>
        <h2 id="testimonials-heading">{testimonialsContent.title}</h2>
        <p className={styles.subtext}>{testimonialsContent.subtext}</p>

        <div className={styles.stage} onKeyDown={handleKeyDown}>
          <div className={styles.track} aria-live="polite">
            {cards.map(({ item, slot }) => (
              <article
                key={`${item.id}-${slot}`}
                className={`${styles.slide} ${styles[slot]}`}
                aria-hidden={slot !== 'center'}
              >
                <div className={styles.bubble}>
                  <p className={styles.quote}>“{item.quote.replace(/^["“]|["”]$/g, '')}”</p>
                </div>
                <div className={styles.meta}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.role}>{item.role}</p>
                  <div className={styles.stars} aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={goPrev}
              aria-label={testimonialsContent.prevAria}
            >
              <img src={testimonialsContent.arrowLeft} alt="" aria-hidden="true" />
            </button>
            <div className={styles.dots} role="tablist" aria-label="Testimonial slides">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show testimonial ${index + 1}`}
                  className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.arrow}
              onClick={goNext}
              aria-label={testimonialsContent.nextAria}
            >
              <img src={testimonialsContent.arrowRight} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

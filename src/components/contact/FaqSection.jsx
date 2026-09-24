import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { faqContent } from '../../data/contactContent';
import styles from './FaqSection.module.css';

export default function FaqSection({
  title = faqContent.title,
  items = faqContent.items,
}) {
  const [openIndex, setOpenIndex] = useState(0);

  function toggle(index) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.inner}>
        <h2 id="faq-heading">{title}</h2>
        <div className={styles.list}>
          {items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${item.number}`;
            return (
              <article key={item.number} className={open ? styles.open : styles.closed}>
                <h3>
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span className={styles.number}>{item.number}</span>
                    <span className={styles.question}>{item.question}</span>
                    <span className={styles.icon} aria-hidden="true">
                      {open ? <Minus size={16} strokeWidth={2.4} /> : <Plus size={16} strokeWidth={2.4} />}
                    </span>
                  </button>
                </h3>
                {open ? (
                  <div id={panelId} role="region" className={styles.panel}>
                    <p>{item.answer}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

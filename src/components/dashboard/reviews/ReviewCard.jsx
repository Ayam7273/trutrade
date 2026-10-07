import { useRef, useState } from 'react';
import Avatar from '../Avatar.jsx';
import StarRating from '../StarRating.jsx';
import Button from '../../ui/Button.jsx';
import ReplyForm from './ReplyForm.jsx';
import { reviewsPageContent as content } from '../../../data/dashboardContent';
import { fill, formatLongDate } from '../../../lib/format';
import styles from './ReviewCard.module.css';

export default function ReviewCard({ review }) {
  const [replying, setReplying] = useState(false);
  const [justPosted, setJustPosted] = useState(false);
  const replyButtonRef = useRef(null);
  const responseRef = useRef(null);
  const headingId = `${review.id}-author`;

  function closeForm() {
    setReplying(false);
    requestAnimationFrame(() => replyButtonRef.current?.focus());
  }

  function handlePosted() {
    setReplying(false);
    setJustPosted(true);
    requestAnimationFrame(() => responseRef.current?.focus());
  }

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <header className={styles.header}>
        <Avatar name={review.author} />
        <div className={styles.who}>
          <h3 id={headingId} className={styles.author}>{review.author}</h3>
          <StarRating value={review.rating} label={fill(content.ratingAria, { value: review.rating })} />
        </div>
        <time className={styles.date} dateTime={review.postedAt}>{formatLongDate(review.postedAt)}</time>
      </header>

      <p className={styles.product}>
        <span className={styles.productLabel}>{content.productLabel}</span> {review.product}
      </p>
      <blockquote className={styles.body}>{`"${review.body}"`}</blockquote>

      {review.reply ? (
        <div className={styles.response} ref={responseRef} tabIndex={-1}>
          <p className={styles.responseLabel}>{content.responseLabel}</p>
          <p className={styles.responseBody}>{`"${review.reply.body}"`}</p>
        </div>
      ) : null}

      <p className={styles.posted} role="status">{justPosted ? content.replyPosted : ''}</p>

      {!review.reply && !replying ? (
        <Button
          size="sm"
          variant="outlineOrange"
          className={styles.replyButton}
          aria-label={fill(content.replyAria, { name: review.author })}
          onClick={() => setReplying(true)}
          ref={replyButtonRef}
        >
          {content.reply}
        </Button>
      ) : null}

      {replying ? <ReplyForm review={review} onClose={closeForm} onPosted={handlePosted} /> : null}
    </article>
  );
}

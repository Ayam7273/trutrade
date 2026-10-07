import { Link } from 'react-router-dom';
import Avatar from '../Avatar.jsx';
import Panel from '../Panel.jsx';
import StarRating from '../StarRating.jsx';
import { recentReviewsContent as content } from '../../../data/dashboardContent';
import { fill, formatTimeAgo } from '../../../lib/format';
import styles from './RecentReviews.module.css';

export default function RecentReviews({ reviews }) {
  return (
    <Panel title={content.title} action={<Link to={content.viewAllHref}>{content.viewAll}</Link>}>
      {reviews.length === 0 ? (
        <p className={styles.empty} role="status">{content.empty}</p>
      ) : (
        <ul className={styles.list}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.item}>
              <div className={styles.top}>
                <Avatar name={review.author} size="sm" />
                <span className={styles.author}>{review.author}</span>
                <time className={styles.time} dateTime={review.postedAt}>
                  {formatTimeAgo(review.postedAt, content.timeAgo)}
                </time>
              </div>
              <StarRating value={review.rating} label={fill(content.ratingAria, { value: review.rating })} />
              <blockquote className={styles.quote}>{`"${review.body}"`}</blockquote>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

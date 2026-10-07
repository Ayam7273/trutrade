import { MessageSquare, Smile, Star, ThumbsUp } from 'lucide-react';
import StatCard from '../StatCard.jsx';
import { reviewsPageContent as content } from '../../../data/dashboardContent';
import { fill, formatDelta, formatNumber } from '../../../lib/format';
import styles from './ReviewStats.module.css';

const ICONS = { MessageSquare, Smile, Star, ThumbsUp };

export default function ReviewStats({ reviews, trend }) {
  const count = (rating) => reviews.filter((review) => review.rating === rating).length;
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const cards = [
    { id: 'rating', value: fill(content.ratingValue, { value: average.toFixed(1) }), delta: formatDelta(trend.rating, '') },
    { id: 'total', value: formatNumber(reviews.length), delta: `+${trend.total}` },
    { id: 'five', value: formatNumber(count(5)), delta: `+${trend.five}` },
    { id: 'four', value: formatNumber(count(4)), delta: `+${trend.four}` },
  ];

  return (
    <div className={styles.stats}>
      {cards.map((card) => {
        const meta = content.stats[card.id];
        return (
          <StatCard
            key={card.id}
            label={meta.label}
            icon={ICONS[meta.icon]}
            tone={meta.tone}
            value={card.value}
            delta={card.delta}
            deltaNote={content.statNote}
          />
        );
      })}
    </div>
  );
}

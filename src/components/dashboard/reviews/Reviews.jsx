import { useState } from 'react';
import PageHeader from '../PageHeader.jsx';
import Pagination from '../Pagination.jsx';
import SegmentedControl from '../SegmentedControl.jsx';
import ReviewStats from './ReviewStats.jsx';
import ReviewCard from './ReviewCard.jsx';
import { reviewsPageContent as content } from '../../../data/dashboardContent';
import { fill } from '../../../lib/format';
import { mockReviewTrend } from '../../../lib/dashboardMock';
import { useReviews } from '../../../lib/reviewsApi';
import utils from '../../../styles/utilities.module.css';
import styles from './Reviews.module.css';

const PAGE_SIZE = 10;

export default function Reviews() {
  const reviews = useReviews();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = filter === 'all'
    ? reviews
    : reviews.filter((review) => review.rating === Number(filter));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  let summary = content.showingNone;
  if (filtered.length === 1) summary = content.showingOne;
  else if (filtered.length > 1) {
    summary = fill(content.showing, { from: start + 1, to: start + visible.length, total: filtered.length });
  }

  function changePage(next) {
    setPage(next);
    document.getElementById('reviews-list')?.scrollIntoView({ block: 'start' });
  }

  return (
    <div className={styles.page}>
      <PageHeader title={content.title} subtitle={content.subtitle} />
      <ReviewStats reviews={reviews} trend={mockReviewTrend} />

      <section id="reviews-list" className={styles.card} aria-labelledby="reviews-list-heading">
        <h2 id="reviews-list-heading" className={utils.srOnly}>{content.listLabel}</h2>

        <SegmentedControl
          label={content.filterLabel}
          options={content.filters}
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setPage(1);
          }}
          variant="chips"
        />

        {visible.length === 0 ? (
          <p className={styles.empty} role="status">
            {filter === 'all' ? content.empty : content.emptyFiltered}
          </p>
        ) : (
          <ul className={styles.list}>
            {visible.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onChange={changePage}
          labels={content.pagination}
          summary={summary}
        />
      </section>
    </div>
  );
}

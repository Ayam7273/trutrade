import { blogListContent } from '../../data/blogContent';
import styles from './BlogPostRow.module.css';

export default function BlogPostRow({ post }) {
  return (
    <article className={styles.row}>
      <div className={styles.media}>
        <img src={post.image} alt={post.imageAlt} />
      </div>
      <div className={styles.copy}>
        <p className={styles.meta}>
          <span className={styles.number}>{post.number}</span>
          <span className={styles.rule} aria-hidden="true" />
          <time dateTime={post.date.split('-').reverse().join('-')}>{post.date}</time>
        </p>
        <h3>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        {/* TODO: link to /blogs/:slug once post detail pages exist */}
        <a href="#" className={styles.readMore}>
          {blogListContent.readMore}
          <img src={blogListContent.arrow} alt="" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

import { blogContent } from '../../data/homeContent';
import styles from './BlogPreview.module.css';

export default function BlogPreview() {
  return (
    <section className={styles.section} id="blog" aria-labelledby="blog-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="blog-heading">{blogContent.title}</h2>
          <p>{blogContent.intro}</p>
        </div>

        <div className={styles.grid}>
          {blogContent.posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <div className={styles.tags}>
                {post.tags.map((tag, i) => (
                  <span key={`${post.id}-${tag}-${i}`} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <a href={`#post-${post.id}`} className={styles.readMore}>
                {blogContent.readMore}
                <img
                  src={blogContent.diagonalArrow}
                  alt=""
                  aria-hidden="true"
                  className={styles.arrow}
                />
              </a>
            </article>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <a href="#blog" className={styles.cta}>
            {blogContent.viewAll}
          </a>
        </div>
      </div>
    </section>
  );
}

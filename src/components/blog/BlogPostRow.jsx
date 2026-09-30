import styles from './BlogPostRow.module.css';

export default function BlogPostRow({ post }) {
  return (
    <article className={styles.row}>
      <div className={styles.media}>
        <img src={post.image} alt={post.imageAlt} />
      </div>
      <div className={styles.copy}>
        <p className={styles.meta}>{post.category}</p>
        <h3>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
      </div>
    </article>
  );
}

import { blogPosts } from '../../data/blogContent';
import BlogPostRow from './BlogPostRow.jsx';
import styles from './BlogList.module.css';

export default function BlogList() {
  return (
    <section className={styles.section} aria-label="Blog posts">
      <div className={styles.list}>
        {blogPosts.map((post) => (
          <BlogPostRow key={post.number} post={post} />
        ))}
      </div>
    </section>
  );
}

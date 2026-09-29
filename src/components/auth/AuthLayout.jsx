import Footer from '../home/Footer.jsx';
import styles from './AuthLayout.module.css';

const BANNER_SRC = '/assets/images/signin-signup-banner.png';

export default function AuthLayout({ children }) {
  return (
    <div className={styles.page}>
      <div className={styles.split}>
        <main className={styles.formPane}>
          <div className={styles.formInner}>{children}</div>
        </main>
        <aside className={styles.bannerPane}>
          <img
            src={BANNER_SRC}
            alt="Laptop and phone showing the TruTrade escrow checkout"
          />
        </aside>
      </div>
      <Footer />
    </div>
  );
}

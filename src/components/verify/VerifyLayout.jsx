import Navbar from '../home/Navbar.jsx';
import styles from './VerifyLayout.module.css';

export default function VerifyLayout({ children, step = 1 }) {
  const current = step >= 1 && step <= 4 ? step : 1;

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <p className={styles.step}>Step {current} of 4</p>
        {children}
      </main>
    </div>
  );
}

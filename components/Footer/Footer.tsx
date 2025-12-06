// components/Footer/Footer.tsx
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <ul>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
          <li>Cookie Policy</li>
          <li>Contact</li>
        </ul>
        
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Blog Application. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
// components/Hero/Hero.tsx
import styles from './Hero.module.scss';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <h1 className={styles.h1}>
            Discover, Share, and Connect Through Blogging
          </h1>
          <p className={styles.p}>
            Join our vibrant community where creators and readers come together. 
            Explore diverse perspectives and connect with passionate writers.
          </p>
        </div>

        <div className={styles.rightContent}>
          <Link href="/posts" className={styles.button}>
            Explore Posts
          </Link>
          
          {/* Optional: Add secondary action */}
          <Link href="/signup" className={`btn btn--outline ${styles.secondaryBtn}`}>
            Get Started
          </Link>
        </div>
      </div>

      {/* Optional: Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <svg viewBox="0 0 24 24">
          <path d="M12 4l-8 8h5v8h6v-8h5z" />
        </svg>
      </div>
    </section>
  );
}
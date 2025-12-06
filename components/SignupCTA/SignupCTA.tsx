'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './SignupCTA.module.scss';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function SignupCTA() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Sign-out error', err);
    }
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.content}>
          <h2 className={styles.title}>Join Our Blogging Community</h2>
          <p className={styles.description}>
            Create an account to start sharing your stories and connecting with others.
          </p>

          <div className={styles.actions}>
            {!user ? (
              <>
                <Link href="/signup" className="btn btn--primary btn--lg">
                  Sign Up
                </Link>
                <Link href="/login" className="btn btn--outline btn--lg">
                  Log In
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile" className="btn btn--primary btn--lg">
                  View Your Posts
                </Link>
                <button onClick={handleSignOut} className="btn btn--outline btn--lg">
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
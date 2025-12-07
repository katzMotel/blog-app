"use client";

import styles from './FeaturedCreators.module.scss';
import AuthorCard from '../AuthorCard/AuthorCard';
import { db } from '@/lib/firebaseConfig';
import { useEffect, useState } from 'react';
import { query, collection, limit, getDocs } from 'firebase/firestore';

export default function FeaturedCreators() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCreators() {
      try {
        const q = query(collection(db, 'users'), limit(3));
        const snap = await getDocs(q);
        const users = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.fullName || data.name || 'Anonymous',
            username: data.username || `user${doc.id.slice(0, 6)}`,
            avatar: data.avatarUrl || data.avatar || '/file.svg',
            bio: data.bio || 'No bio yet.',
          };
        });
        setCreators(users);
      } catch (err) {
        console.error('Failed to load creators:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCreators();
  }, []);

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Meet Our Featured Creators</h2>
          <p className={styles.description}>
            Discover the talented individuals shaping our community. Each creator brings
            a unique perspective and a wealth of knowledge to share.
          </p>
        </div>

        {loading ? (
          <p>Loading creators...</p>
        ) : creators.length === 0 ? (
          <p>No creators yet. Be the first to sign up!</p>
        ) : (
          <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-6">
            {creators.map((creator) => (
              <AuthorCard key={creator.id} {...creator} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
"use client";

import styles from './FeaturedPosts.module.scss';
import BlogPost from '../BlogPost/BlogPost';
import { db } from '@/lib/firebaseConfig';
import { useEffect, useState } from 'react';
import { query, collection, where, orderBy, limit, getDocs } from 'firebase/firestore';

export default function FeaturedPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(
          collection(db, 'posts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snap = await getDocs(q);
        const postsList = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            excerpt: data.excerpt || data.content?.slice(0, 200) || '',
            category: data.category || 'General',
            author: {
              name: data.authorName || 'Anonymous',
              avatar: data.authorAvatar || '/file.svg',
            },
            date: data.createdAt?.seconds 
              ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '',
          };
        });
        setPosts(postsList);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Featured Blog Posts</h2>
          <p className={styles.description}>
            Explore the latest insights and stories from our community of writers.
          </p>
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. Be the first to write something!</p>
        ) : (
          <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-6">
            {posts.map((post) => (
              <BlogPost key={post.id} {...post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
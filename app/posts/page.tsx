"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import BlogPost from "@/components/BlogPost/BlogPost";
import styles from "./page.module.scss";

type PostSummary = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  createdAt?: { seconds: number };
  authorName?: string;
  authorAvatar?: string;
  category?: string;
};

function formatTime(ts?: { seconds: number } | null) {
  if (!ts?.seconds) return "";
  return new Date(ts.seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        if (!mounted) return;
        const items: PostSummary[] = snap.docs.map((d) => ({
          id: d.id,
          title: (d.data().title as string) || "Untitled",
          excerpt: (d.data().excerpt as string) || "",
          content: d.data().content || "",
          createdAt: d.data().createdAt || null,
          authorName: d.data().authorName || "Anonymous",
          authorAvatar: d.data().authorAvatar || "",
          category: d.data().category || "General",
        }));
        setPosts(items);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonDescription}></div>
          </div>
          <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.skeletonCard}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>All Posts</h1>
            <p className={styles.description}>No posts yet. Check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>All Posts</h1>
          <p className={styles.description}>
            Explore {posts.length} {posts.length === 1 ? "story" : "stories"} from our community of writers.
          </p>
        </div>

        <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-6">
          {posts.map((post) => (
            <BlogPost
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt || post.content||"No excerpt available"}
              author={{
                name: post.authorName || "Anonymous",
                avatar: post.authorAvatar,
              }}
              date={formatTime(post.createdAt)}
              category={post.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
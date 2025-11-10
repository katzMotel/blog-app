"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BlogPost from '@/components/BlogPost/BlogPost';
import styles from "./Profile.module.scss";
import { db, auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import ProfileLayout from "./ProfileLayout";
import ProfileActions from "./ProfileActions";

type PostSummary = {
  id: string;
  title: string;
  excerpt?: string;
  createdAt?: { seconds: number } | null;
  authorAvatar?: string;
  likes?: number;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadUserPosts(uid: string) {
      setLoadingPosts(true);
      try {
        const q = query(
          collection(db, "posts"),
          where("authorId", "==", uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        if (!mounted) return;
        const items: PostSummary[] = snap.docs.map((d) => ({
          id: d.id,
          title: (d.data().title as string) || "Untitled",
          excerpt:
            (d.data().excerpt as string) ||
            d.data().content?.slice?.(0, 200) ||
            "",
          createdAt: d.data().createdAt as any,
        }));
        setPosts(items);
      } catch (err) {
        console.error("Failed to load user posts", err);
        setPosts([]);
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    }

    if (user?.uid) {
      loadUserPosts(user.uid);
    } else {
      setPosts(null);
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) return <div className={styles.container}>Loading...</div>;

  const header = (
    <>
      <h1 className={styles.title}>{user.displayName || "N/A"}</h1>
      <p className={styles.info}>{user.email}</p>
    </>
  );
const actions = (
  <ProfileActions
    isOwner
    initialName={user?.displayName ?? ""}
    initialEmail={user?.email ?? ""}
    onCreatePost={() => (window.location.href = "/posts/create")}
  />
);

  return (
    <ProfileLayout header={header} actions={actions}>
      <div className={styles.postsWrap}>
        <h2>Your posts</h2>

        {loadingPosts && <p>Loading your posts…</p>}
        {!loadingPosts && (!posts || posts.length === 0) && (
          <p>No posts yet — write something!</p>
        )}

        <div className={styles.postsList}>
          {posts?.map((p) => (
            <BlogPost
              key={p.id}
              id={p.id}
              title={p.title}
              content={p.excerpt || ''}
              avatarUrl={p.authorAvatar || '/file.svg'}
              time={p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : ''}
              likes={p.likes || 0}
            />
          ))}
        </div>
        <Link href="/posts/create" className={styles.createLink}>
          Create New Post
        </Link>
      </div>
    </ProfileLayout>
  );
};

export default Profile;
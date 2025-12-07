"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.scss";

export default function PostView() {
  const pathname = usePathname();
  const parts = pathname?.split("/") || [];
  const id = parts[parts.length - 1];
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getDoc(doc(db, "posts", id))
      .then((snap) => {
        if (!snap.exists()) {
          setError("Post not found");
          setPost(null);
        } else {
          setPost({ id: snap.id, ...snap.data() });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      if (!user) throw new Error("Not signed in");
      if (post.authorId !== user.uid) throw new Error("Not permitted");
      await deleteDoc(doc(db, "posts", post.id));
      router.push("/posts");
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeletonHeader}></div>
          <div className={styles.skeletonMeta}></div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h1>Oops!</h1>
            <p>{error || "Post not found"}</p>
            <Link href="/posts" className="btn btn--primary">
              Back to Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = user?.uid === post.authorId;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/posts" className={styles.backLink}>
          ← Back to Posts
        </Link>

        <article className={styles.article}>
          {/* Post Header */}
          <header className={styles.header}>
            {post.category && (
              <span className={styles.category}>{post.category}</span>
            )}
            <h1 className={styles.title}>{post.title}</h1>

            <div className={styles.meta}>
              <div className={styles.author}>
                {post.authorAvatar && (
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className={styles.avatar}
                  />
                )}
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>
                    {post.authorName || "Anonymous"}
                  </span>
                  <span className={styles.date}>
                    {post.createdAt?.seconds
                      ? new Date(post.createdAt.seconds * 1000).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
                  </span>
                </div>
              </div>

              {isAuthor && (
                <div className={styles.actions}>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="btn btn--outline btn--sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="btn btn--outline btn--sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </header>
          {/* Featured Image */}
          {post.featuredImage && (
            <div className={styles.featuredImageWrapper}>
              <img 
                src={post.featuredImage}
                alt={post.title}
                className={styles.featuredImage}
              />
            </div>
          )}
          {/* Post Content */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.body || post.content }}
          />

          {/* Post Footer */}
          <footer className={styles.footer}>
            <div className={styles.tags}>
              {post.tags?.map((tag: string) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
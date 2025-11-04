"use client"
import React, { useEffect, useState } from "react"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebaseConfig"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import PostHeader from "@/components/PostHeader/PostHeader"
import styles from "./page.module.scss"
export default function PostView() {
  const pathname = usePathname();
  const parts = pathname?.split("/") || [];
  const id = parts[parts.length - 1];
  const [post, setPost] = useState<any | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className={styles.reader}>
    <article className={styles.container}>
      <PostHeader id={post.id} title={post.title} authorName={post.authorName} time={post.createdAt?.seconds ? new Date(post.createdAt.seconds*1000).toLocaleDateString() : ''} />
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.body }} />
      <div className={styles.actions}>
        <Link className={styles.editButton} href={`/posts/${post.id}/edit`} >Edit Post</Link>
        {auth.currentUser?.uid === post.authorId ? (
          <button
            className={styles.deleteButton}
            onClick={async () => {
              if (!confirm("Delete this post? This cannot be undone.")) return
              try {
                const user = auth.currentUser
                if (!user) throw new Error("Not signed in")
                if (post.authorId !== user.uid) throw new Error("Not permitted")
                await deleteDoc(doc(db, "posts", post.id))
                router.push("/posts")
              } catch (err: any) {
                alert(err?.message || "Delete failed")
              }
            }}
          >
            Delete Post
          </button>
        ) : null}
      </div>
    </article>
    </div>
  );
}

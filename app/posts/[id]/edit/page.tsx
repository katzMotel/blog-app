"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import PostEditor from "@/components/PostEditor/PostEditor";
import Link from "next/link";
import styles from "./page.module.scss";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    async function loadPost() {
      try {
        const postSnap = await getDoc(doc(db, "posts", id));
        if (!postSnap.exists()) {
          setError("Post not found");
          return;
        }

        const postData = postSnap.data();

        // Check if user is author
        if (postData.authorId !== user?.uid) {
          setError("You don't have permission to edit this post");
          return;
        }

        setInitialData({
          title: postData.title || "",
          body: postData.body || postData.content || "",
          excerpt: postData.excerpt || "",
          category: postData.category || "",
          tags: postData.tags || [],
          featuredImage: postData.featuredImage || "",
          published: postData.published ?? true,
        });
      } catch (err) {
        console.error("Failed to load post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id, user]);

  const onSave = async (data: {
    title: string;
    body: string;
    excerpt: string;
    category: string;
    tags: string[];
    featuredImage: string;
    published: boolean;
  }) => {
    await updateDoc(doc(db, "posts", id), {
      title: data.title,
      body: data.body,
      excerpt: data.excerpt,
      content: data.body, // For backwards compatibility
      category: data.category,
      tags: data.tags,
      featuredImage: data.featuredImage,
      published: data.published,
      updatedAt: serverTimestamp(),
    });

    router.push(`/posts/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className={styles.page}>
        <div className="container">
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

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Post</h1>
          <Link href={`/posts/${id}`} className="btn btn--outline">
            Cancel
          </Link>
        </div>

        <PostEditor
          initial={initialData}
          onSave={onSave}
          onCancel={() => router.push(`/posts/${id}`)}
          savingLabel="Update Post"
        />
      </div>
    </div>
  );
}
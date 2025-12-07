"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import PostEditor from "@/components/PostEditor/PostEditor";
import Link from "next/link";
import styles from "./create.module.scss";

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();

  const onSave = async (data: {
    title: string;
    body: string;
    excerpt: string;
    category: string;
    tags: string[];
    featuredImage: string;
    published: boolean;
  }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Not signed in");
    }

    const docRef = await addDoc(collection(db, "posts"), {
      title: data.title,
      body: data.body,
      excerpt: data.excerpt,
      content: data.body, // For backwards compatibility
      category: data.category,
      tags: data.tags,
      featuredImage: data.featuredImage,
      published: data.published,
      authorId: currentUser.uid,
      authorName: currentUser.displayName ?? currentUser.email ?? "Anonymous",
      authorAvatar: user?.photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    router.push(`/posts/${docRef.id}`);
    return docRef.id;
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Post</h1>
          <Link href="/posts" className="btn btn--outline">
            Cancel
          </Link>
        </div>

        <PostEditor
          onSave={onSave}
          onCancel={() => router.push("/posts")}
          savingLabel="Publish Post"
        />
      </div>
    </div>
  );
}
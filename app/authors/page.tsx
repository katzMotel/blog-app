"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AuthorCard from "@/components/AuthorCard/AuthorCard";
import styles from "./page.module.scss";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authorsCollection = collection(db, "users");
        const authorSnapshot = await getDocs(authorsCollection);
        const authorList = authorSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.fullName || data.name || "Anonymous",
            username: data.username || data.handle || `user${doc.id.slice(0, 6)}`,
            avatar: data.avatarUrl || data.avatar || "/file.svg",
            bio: data.bio || "",
          };
        });
        setAuthors(authorList);
      } catch (err) {
        console.error("Failed to load authors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
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

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Our Creators</h1>
          <p className={styles.description}>
            Discover {authors.length} talented {authors.length === 1 ? "writer" : "writers"} sharing their stories and insights.
          </p>
        </div>

        <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-6">
          {authors.map((author) => (
            <AuthorCard
              key={author.id}
              id={author.id}
              name={author.name}
              username={author.username}
              avatar={author.avatar}
              bio={author.bio}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
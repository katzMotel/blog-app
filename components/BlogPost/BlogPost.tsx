"use client";
import React from "react";
import styles from "./BlogPost.module.scss"
import Link from "next/link"
import { useState } from "react"
import { db } from "@/lib/firebaseConfig"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import PostHeader from "@/components/PostHeader/PostHeader"
interface BlogPostProps {
  id: string; // Add id prop
  title: string;
  content: string;
  avatarUrl: string;
  time: string;
  likes: number;
}

const BlogPost: React.FC<BlogPostProps> = ({ id, title, content, avatarUrl, time, likes }) => {
  return (
    <Link href={`/posts/${id}`}>
      <div className={styles.blogPost}>
        <PostHeader id={id} title={title} authorName={undefined} time={time} />
        <p className={styles.content}>{content}</p>
        <div className={styles.footer}>
          <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
          <span className={styles.time}>{time}</span>
          <span className={styles.likes}>{likes} Likes</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPost;

import React from "react";
import styles from "./BlogPost.module.scss";
import {useState} from "react";
import {db} from "@/lib/firebaseConfig";
import{doc, updateDoc, deleteDoc } from "firebase/firestore";
interface BlogPostProps {
  title: string;
  content: string;
  avatarUrl: string;
  time: string;
  likes: number;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content, avatarUrl, time, likes }) => {
  return (
    <div className={styles.blogPost}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.content}>{content}</p>
      <div className={styles.footer}>
        <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
        <span className={styles.time}>{time}</span>
        <span className={styles.likes}>{likes} Likes</span>
      </div>
    </div>
  );
};

export default BlogPost;

"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../../lib/firebaseConfig" // adjust if you use "@/lib/..." in other files
import BlogPost from "@/components/BlogPost/BlogPost"

import styles from "./page.module.scss"
import { time } from "console"

type PostSummary = {
  id: string
  title: string
  excerpt?: string
  createdAt?: { seconds: number }
  authorAvatar?: string
  likes?: number
}
function formatTime(ts?: { seconds: number } | null) {
  if (!ts?.seconds) return ""
  return new Date(ts.seconds * 1000).toLocaleDateString()
}
export default function PostsPage() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
        const snap = await getDocs(q)
        if (!mounted) return
        const items: PostSummary[] = snap.docs.map((d) => ({
          id: d.id,
          title: (d.data().title as string) || "Untitled",
          excerpt: (d.data().excerpt as string) || d.data().content?.slice?.(0, 200) || "",
          createdAt: d.data().createdAt || null,
          authorAvatar: d.data().authorAvatar || "/file.svg",
          likes: d.data().likes || 0,
        }))
        setPosts(items)
      } catch (err) {
        console.error("Failed to load posts:", err)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div ><p>Loading posts...</p></div>

  if (!posts || posts.length === 0) {
    return (
      <div >
        <h1>Posts</h1>
        <p>No posts yet.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Posts</h1>
      <div className={styles.list}>
        {posts.map((p) => (
          <BlogPost
            key={p.id}
            id={p.id}
            title={p.title}
            content={p.excerpt || ""}
            avatarUrl={p.authorAvatar || "/file.svg"}
            time={formatTime(p.createdAt)}
            likes={p.likes || 0}
          />
        ))}
      </div>
    </div>
  )
}

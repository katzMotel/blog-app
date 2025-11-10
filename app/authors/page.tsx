"use client";
import React, { useEffect, useState } from "react"
import Link from "next/link"
import AuthorCard from "@/components/AuthorCard/AuthorCard"
import styles from "./page.module.scss"
import { db } from "@/lib/firebaseConfig"
import { collection, getDocs } from "firebase/firestore"

interface Author {
  id: string
  fullName: string
  username: string
  avatarUrl?: string
  bio?: string
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])

  useEffect(() => {
    const fetchAuthors = async () => {
      const authorsCollection = collection(db, "users")
      const authorSnapshot = await getDocs(authorsCollection)
      const authorList = authorSnapshot.docs.map((doc) => {
        const data = doc.data() as any
        return {
          id: doc.id,
          fullName: data.fullName ?? data.name ?? "",
          username: data.username ?? data.handle ?? "",
          avatarUrl: data.avatarUrl ?? "",
          bio: data.bio ?? "",
        }
      })
      setAuthors(authorList)
    }

    fetchAuthors()
  }, [])

  return (
    <div className={styles.authorsPage}>
      <h1>Authors</h1>
      <div className={styles.authorList}>
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/authors/${author.id}`}
            aria-label={`View ${author.fullName}'s profile`}
          >
            <AuthorCard author={author} />
          </Link>
        ))}
      </div>
    </div>
  )
}
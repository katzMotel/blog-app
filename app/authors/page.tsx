"use client";
import React, { useEffect, useState } from "react"
import Link from "next/link"
import AuthorCard from "@/components/AuthorCard/AuthorCard"
import styles from "./page.module.scss"
import { db } from "@/lib/firebaseConfig"
import { collection, getDocs } from "firebase/firestore"

interface Author {
  id: string
  name: string
  bio: string
  avatarUrl: string
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])

  useEffect(() => {
    const fetchAuthors = async () => {
      const authorsCollection = collection(db, "users")
      const authorSnapshot = await getDocs(authorsCollection)
      const authorList = authorSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Author, "id">),
      }))
      setAuthors(authorList)
    }

    fetchAuthors()
  } , [])

  return (
    <div className={styles.authorsPage}>
      <h1>Authors</h1>
      <div className={styles.authorList}>
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/authors/${author.id}`}
            aria-label={`View ${author.name}'s profile`}
          >
            <AuthorCard author={author} />
          </Link>
        ))}
      </div>
    </div>
  )
}
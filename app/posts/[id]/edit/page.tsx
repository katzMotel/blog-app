"use client"

import React, { useEffect, useState } from "react"
import PostEditor from "@/components/PostEditor/PostEditor"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebaseConfig"
import { useParams, useRouter } from "next/navigation"



export default function EditPostRoute() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const [initial, setInitial] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getDoc(doc(db, "posts", id))
      .then((snap) => {
        if (!snap.exists()) {
          setError("Not found")
          setInitial(null)
        } else {
          setInitial(snap.data())
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const onSave = async (data: { title: string; body: string; published: boolean }) => {
    const user = auth.currentUser
    if (!user) throw new Error("Not signed in")
    const ref = doc(db, "posts", id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error("Post not found")
    const post = snap.data() as any
    if (post.authorId !== user.uid) throw new Error("Not permitted to edit")
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    router.push(`/posts/${id}`)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!initial) return <div>Post not found</div>

  return (
    <div>
      
      <PostEditor initial={initial} onSave={onSave} savingLabel="Update" />
    </div>
  )
}

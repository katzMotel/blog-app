"use client";
import React from "react";
import PostEditor from "@/components/PostEditor/PostEditor";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db, auth} from "@/lib/firebaseConfig";
import {useRouter } from "next/navigation";
import styles from "./create.module.scss"
export default function CreatePostPage(){
    const router = useRouter();
    const onSave = async (data: {title: string; body: string; published: boolean;}) => {
        const user = auth.currentUser;
        if(!user){
            throw new Error('Not signed in')
        }

        const docRef = await addDoc(collection(db, "posts"), {
            title: data.title,
            body: data.body,
            published: data.published,
            authorId: user.uid,
            authorName: user.displayName ?? user.email ?? null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        router.push(`/posts/${docRef.id}`);
        return docRef.id;
    }

    return (
        <div>
            <h1 className = {styles.title}>Create New Post</h1>
            <PostEditor onSave={onSave} savingLabel="Publish"/> 
        </div>
    )
}
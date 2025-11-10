"use client";
import Link from "next/link"
import styles from "./AuthorCard.module.scss"
import Image from "next/image";
import { useState } from "react";


export interface Author{
    id: string
    fullName: string
    username: string
    avatarUrl?: string
    bio?: string
    createdAt?: any
}
type Props = {
    author: Author
    showBio?: boolean
    className?: string
    actions?: React.ReactNode
}
export default function AuthorCard({author, showBio = true, className = "", actions}: Props) {
    // Defensive: if caller accidentally passes undefined, avoid runtime crash
    if (!author) return null;

    // Use the existing file in public/ to avoid renaming assets
    const defaultAvatar = "/defaultAvatarImg.png";
    const initialSrc = author.avatarUrl ?? defaultAvatar;
    const [src, setSrc] = useState(initialSrc);

    const displayName = author.fullName ?? (author as any).name ?? 'Author';
    const username = author.username ?? (author as any).handle ?? '';

    return (
        <article className={`${styles.card} ${className}`}>
            <Image
                src={src}
                alt={`${author?.fullName ?? "Author"}'s avatar`}
                width={64}
                height={64}
                className={styles.avatar}
                onError={() => setSrc(defaultAvatar)}
            />
            <div className={styles.info}>
                <span className={styles.name}>{displayName}</span>
                <span className={styles.username}>@{username}</span>
                {showBio && author.bio ? <p className={styles.bio}>{author.bio}</p> : null}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </article>
    );
}
"use client"

import React from "react"
import styles from "./PostHeader.module.scss"
import Link from "next/link"

type Props = {
  id?: string
  title: string
  authorName?: string
  time?: string
}

export default function PostHeader({ id, title, authorName, time }: Props) {
  return (
    <div className={styles.header}>
      {id ? (
        
          <h2 className={styles.title}>{title}</h2>
        
      ) : (
        <h2 className={styles.title}>{title}</h2>
      )}
      <div className={styles.meta}>
        {authorName ? <span>{authorName}</span> : null}
        {time ? <span style={{ marginLeft: 8 }}>{time}</span> : null}
      </div>
    </div>
  )
}

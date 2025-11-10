"use client";
import React from "react";
import styles from "./Profile.module.scss";

type Props = {
  children: React.ReactNode;
  header?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function ProfileLayout({ children, header, actions }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.header}>{header}</div>
        {actions && <div className={styles.headerActions}>{actions}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

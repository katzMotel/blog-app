import Image from "next/image"; 
import React from "react";
import styles from "./page.module.scss";
import SignupPage from "./signup/page";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      
      <Link href="/signup">=Signup</Link>
      <Link href="/login">=Login</Link>
      
    </main>
  );
}

"use client";
import Image from "next/image"; 
import React from "react";
import styles from "./page.module.scss";
import SignupPage from "../../signup/page";
import Link from "next/link";
import HomePage from "../components/HomePage";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <main className={styles.main}>
        
       <HomePage /> 
       
    </main>
  );
}

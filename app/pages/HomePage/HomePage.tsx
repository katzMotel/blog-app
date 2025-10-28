"use client";
import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';
import MainContent from '../../../components/MainContent/MainContent';
import NavBar from '@/components/NavBar/NavBar';
import Hero from '@/components/Hero/Hero';
import Link from 'next/link';
import UserProfile from '../../../components/UserProfile';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsub();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (err) {
            console.error('Sign-out error', err);
        }
    };

    return (
        
       <>
        
       <Hero />
       <div className={styles.featuredCreatorsSection}>
            <h1 className={styles.sectionTitle}>Meet Our Featured Creators</h1>
            <p>Discover the talented individuals shaping our community. Each creator brings
                a unique perspective and a wealth of knowledge to share. Explore their profiles
                to find inspiration and connect with their content.</p>
            <div className={styles.creatorList}>

                <div className={styles.creatorItem}>

                    <img className={styles.creatorImage} src="https://randomuser.me/api/portraits/men/32.jpg" alt="Jimmy Doe" />
                    <div>
                        <h3 className={styles.creatorName}>Jimmy Doe</h3>
                        <h2 className={styles.cardTitle}>Creator Spotlight</h2>
                        <p className={styles.cardDescription}>Highlighting creativity and passion in every post.</p>
                    </div>
                </div>

                <div className={styles.creatorItem}>

                    <img className={styles.creatorImage} src="https://randomuser.me/api/portraits/women/32.jpg" alt="Jane Smith" />
                    <div>
                        <h3 className={styles.creatorName}>Jane Smith</h3>
                        <h2 className={styles.cardTitle}>Explore Their Stories</h2>
                        <p className={styles.cardDescription}>Dive into their journeys and insights</p>
                    </div>
                </div>
                <div className={styles.creatorItem}>

                    <img className={styles.creatorImage} src="https://randomuser.me/api/portraits/men/45.jpg" alt="Robert Brown" />
                    <div>
                        <h3 className={styles.creatorName}>Robert Brown</h3>
                        <h2 className={styles.cardTitle}>Dive into Their Content</h2>
                        <p className={styles.cardDescription}>Connect with creators and fellow enthusiasts</p>
                    </div>
                </div>
            </div>
            <div className={styles.featuredBlogsSection}>
                <h1 className={styles.sectionTitle}>Featured Blog Posts</h1>
                <p>Explore the latest insights and stories from our community of writers.</p>
                <div className={styles.blogList}>


                    <div className={styles.blogItem}>
                        <h3 className={styles.blogTitle}>Understanding React Hooks</h3>
                        <p className={styles.blogDescription}>A deep dive into the world of React Hooks and how to use them effectively.</p>
                    </div>
                    <div className={styles.blogItem}>
                        <h3>Mastering CSS Grid</h3>
                        <p>Learn how to create responsive layouts with CSS Grid in this comprehensive guide.</p>
                    </div>
                    <div className={styles.blogItem}>
                        <h3>JavaScript ES6 Features</h3>
                        <p>Explore the new features introduced in ES6 and how they can improve your JavaScript code.</p>
                    </div>

                </div>
            </div>
        </div>
            
            <div className={styles.signupSection}>
                <h2 className={styles.signupTitle}>Join Our Blogging Community</h2>
                <p className={styles.signupDescription}>Create an account to start sharing your stories and connecting with others.</p>
                {!user ? (
                    <>
                        <Link href="/signup" className={styles.signupButton}>Sign Up</Link>
                        <Link href="/login" className={styles.signInButton}>Log In</Link>
                    </>
                ) : (
                    <>
                        <Link href="/profile" className={styles.profileButton}>{user.displayName ?? user.email ?? 'Profile'}</Link>
                        <button onClick={handleSignOut} className={styles.signOutButton}>Log Out</button>
                    </>
                )}
            </div></>

    );
}





export default HomePage;
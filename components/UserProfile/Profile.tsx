"use client";
import React, { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsub();
    }, []);

    if (!user) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{user.displayName || 'N/A'}</h1>
            
            <p className={styles.info}>{user.email}</p>
            <ul className={styles.postsList}>

                {/* Fetch and display user's blog posts here */}
                <li className={styles.postItem}>How throwing batteries into a blender can fix your anxiety, and ruin your blender.</li>
                <li className={styles.postItem}>I taught my cat to read and now he's discovered fringe political theory.  Help.</li>
                <li className={styles.postItem}>I got rid of my fedora and suddenly people respect me more</li>
            </ul>
        </div>
    );
};

export default Profile;
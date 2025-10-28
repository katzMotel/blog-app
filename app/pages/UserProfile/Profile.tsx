"use client";
import React, { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

const UserProfile = () => {
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
            <h1 className={styles.title}>User Profile</h1>
            <p className={styles.info}><strong>Name:</strong> {user.displayName || 'N/A'}</p>
            <p className={styles.info}><strong>Email:</strong> {user.email}</p>
        </div>
    );
};

export default UserProfile;
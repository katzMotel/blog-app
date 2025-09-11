'use client';
import React from 'react'    
import styles from './Signup.module.scss'
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db, storage } from '@/lib/firebaseConfig';
const SignUpPage = () =>{
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error ,setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const validateForm = (): boolean => {
        const specialCharRegex = /[^a-zA-Z0-9 ]/;
    const passwordSpecialCharRegex = /[^a-zA-Z0-9]/;
    const passwordUppercaseRegex = /[A-Z]/;
        if (!email || !password || !username || !fullName) {
            setError("All fields are required.");
            return false;
        }
        if (specialCharRegex.test(username)) {
            setError("Username cannot contain special characters.");
            return false;
        }
        if (specialCharRegex.test(fullName)) {
            setError("Full Name cannot contain special characters.");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return false;
        }
        if (!passwordSpecialCharRegex.test(password)) {
            setError("Password must contain at least one special character.");
            return false;
        }
        if (!passwordUppercaseRegex.test(password)) {
            setError("Password must contain at least one uppercase letter.");
            return false;
        }
        setError("");
        return true;
    }
    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: fullName });
            await setDoc(doc(db, "users", user.uid), {
                fullName,
                username,
                email: user.email,
                createdAt: new Date(),
            });
            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                setError("Email is already in use.");
            } else if (error.code === "auth/invalid-email") {
                setError("Invalid email address.");
            } else {
                setError("Failed to create account. Please try again.");
            }
            console.error("Signup error:", error);
        } finally {
            setIsSubmitting(false); 
        }

    };
        return (
            <section className={styles.signupContainer}>
                <div className={styles.logoContainer}>
                    <img src="/favicon.ico" alt="Favicon" width={50} height={50} />
                </div>
                <h1 className={styles.title}>Create Your Own Blog</h1>
                <form onSubmit={handleSignup} className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(event) => setFullName(event?.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) => setUsername(event?.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event?.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event?.target.value)}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing Up..." : "Create Account"}
                    </button>
                </form>
                <p className={styles.footerText}>
                    By signing up, you agree to our{" "}
                    <Link href="#termsofservice" className={styles.link}>
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#privacypolicy" className={styles.link}>
                        Privacy Policy
                    </Link>
                    , including{" "}
                    <Link href="#cookiepolicy" className={styles.link}>
                        Cookie Use
                    </Link>.
                </p>
                <p className={styles.footerText}>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.link}>
                        Log In
                    </Link>
                </p>
            </section>
        );
}

export default SignUpPage;
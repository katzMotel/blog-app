'use client';
import React from 'react';    
import styles from './Login.module.scss';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth, db} from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/Toast';
 const LoginPage = () =>{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error ,setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const router = useRouter();
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        try{
            await signInWithEmailAndPassword(auth, email, password);
            setShowToast(true);
            setTimeout(() => {
                router.push('/');
            }, 1500); // Delay to show toast
        }catch(error){
            setError("Failed to log in. Please check your email and password.");
        }
    }
    return(
        <div className={styles.page}>
        <div className={styles.loginContainer}>
            <div className={styles.logoContainer}>
                <img src="/favicon.ico" alt="Favicon" width={50} height={50} />
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <form onSubmit={handleLogin} className={styles.form}>
                <input 
                    className={styles.input} 
                    type = "email" 
                    placeholder = "Email" 
                    value = {email} 
                    onChange={(event) => setEmail(event?.target.value)}
                    />
                <input 
                    className={styles.input} 
                    type = "password" 
                    placeholder = "Password"
                    value = {password} 
                    onChange={(event) => setPassword(event?.target.value)}
                    />
                {error && <p className={styles.error}>{error}</p>}
                <button 
                    type= 'submit' 
                    className ={styles.button} 
                    disabled = {isSubmitting}> 
                    {isSubmitting ? "Logging In..." : "Log In"}
                </button>
                
            </form>
            <p className={styles.footerText}>
                <Link href="#forgotpassword" className={styles.link}>
                Forgot Password?
                </Link>
            </p>
            <p className={styles.footerText}>
                Don't have an account?{" "}
                <Link href="/signup" className={styles.link}>
                Sign Up
                </Link>
            </p> 
            {showToast && (
                <Toast
                message="Login Successful!"
                onClose={() => setShowToast(false)}
                />
            )}  
        </div>
    </div>
    )
}
export default LoginPage;
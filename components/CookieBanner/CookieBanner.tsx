'use client';
import React, { useState, useEffect } from 'react';
import styles from './CookieBanner.module.scss';
export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    useEffect(() => {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            setIsVisible(true);
        }
    }, []);
    const handleDismiss = () => {
        localStorage.setItem('cookieConsent', 'dismissed');
        setIsVisible(false);

    }
    if (!isVisible) {
        return null;
    }   
    return (
      <div className={styles.CookieBanner}>
        <div className={styles.textContainer}>
            <p className={styles.title}> Welcome to BB!</p>
            <p className={styles.text}> We use cookies to enhance your experience. 
            By continuing to visit this site you agree to our use of cookies. 
            {""}
            <a></a>
            </p>
        </div>
        <div className={styles.actions}>
            <button onClick={handleDismiss} className={styles.closeButton}>Got it!</button>
            <span>&times;</span>
            </div>
      </div>
      
    );
}
export default CookieBanner; 
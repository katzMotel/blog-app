// components/CookieBanner/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './CookieBanner.module.scss';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h3 className={styles.title}>Cookie Notice</h3>
          <div className={styles.text}>
            <p>
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic.
            </p>
            <div className={styles.links}>
              <a href="/privacy" className={styles.link}>
                Privacy Policy
              </a>
              <a href="/cookies" className={styles.link}>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.buttonContainer}>
            <button className={styles.acceptButton} onClick={handleAccept}>
              Accept All
            </button>
            <button className={styles.declineButton} onClick={handleDecline}>
              Decline
            </button>
          </div>

          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close cookie banner"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
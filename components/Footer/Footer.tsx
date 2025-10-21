import styles from './Footer.module.scss';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <ul>
                <li>
                    <Link href="#termsofservice">Terms of Service</Link>
                </li>
                <li>
                    <Link href="#privacypolicy">Privacy Policy</Link>
                </li>
                <li>
                    <Link href="#cookiepolicy">Cookie Policy</Link>
                </li>
            </ul>
        </footer>
    );
}
export default Footer;
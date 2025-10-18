'use client';
import styles from './NavBar.module.scss';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import {useState} from 'react';
const NavBar = () =>{
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return(
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img src="/favicon.ico" alt="Favicon" width={50} height={50} />
                
            </div>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <Link href="#home">Home Feed</Link>
                    </li>
                    <li>
                        <Link href="#featured">Featured Blogs</Link>
                    </li>
                    <li>
                        <Link href="#creators">Creators</Link>
                    </li>
                    
                </ul>
                <div className={styles.menu}>
                    <button onClick={toggleMenu} className={styles.menuButton}>Menu</button>
                    <div className={styles.backdrop} onClick={toggleMenu} />
                    {isMenuOpen && <Sidebar />}
                </div>
            </nav>
        </header>
    )
}
export default NavBar;
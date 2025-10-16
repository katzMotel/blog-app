'use client';
import styles from './NavBar.module.scss';
import Link from 'next/link';
const NavBar = () =>{
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
                    <li>
                        <Link href="#menu">Menu</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
export default NavBar;
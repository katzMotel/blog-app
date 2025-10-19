import React from "react";
import styles from './Hero.module.scss';
import Link from "next/link";
const Hero = () => {
    return(
       
        <div className={styles.hero}>
            <div className={styles.content}>
                <h1>Discover, Share, and Connect Through Blogging</h1>
                <p>Join our vibrant community where creators and readers come together.
                Explore diverse blog posts and connect with your favorite creators effortlessly.</p>
                <Link href="/posts" className={styles.button}>Explore Posts</Link>
            </div>
        </div>
        
    );
};

export default Hero;
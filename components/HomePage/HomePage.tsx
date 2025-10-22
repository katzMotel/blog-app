'use client';
import styles from './HomePage.module.scss';
import MainContent from '../MainContent/MainContent';


const HomePage = () => {
    return (
       <div className={styles.featuredCreatorsSection}>
            <h1 className={styles.sectionTitle}>Meet Our Featured Creators</h1>
            <p>Discover the talented individuals shaping our community. Each creator brings
                a unique perspective and a wealth of knowledge to share. Explore their profiles
                to find inspiration and connect with their content.</p>
            <div className={styles.creatorList}>
            
                <div className={styles.creatorItem}>
            
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Jimmy Doe" />
              <div>
                <h3>Jimmy Doe</h3>
                <h2>Creator Spotlight</h2>
                <p>Highlighting creativity and passion in every post.</p>
            </div>
          </div>
          
        <div className={styles.creatorItem}>
          
            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Jane Smith" />
            <div>
              <h3>Jane Smith</h3>
              <h2>Explore Their Stories</h2>
              <p>Dive into their journeys and insights</p>
            </div>
        </div>
        <div className={styles.creatorItem}>
              
              <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Robert Brown" />
              <div>
                <h3>Robert Brown</h3>
                <h2>Dive into Their Content</h2>
                <p>Connect with creators and fellow enthusiasts</p>
              </div>
            </div>
        </div>
        <div className={styles.featuredBlogsSection}>
          <h2>Explore our Featured Blogs</h2>
          <p>Dive into the latest posts from our community.</p>
          <div className={styles.blogItem}>
            <h3>Understanding React Hooks</h3>
            <p>A deep dive into the world of React Hooks and how to use them effectively.</p>
          </div>
          <div className={styles.blogItem}>
            <h3>Mastering CSS Grid</h3>
            <p>Learn how to create responsive layouts with CSS Grid in this comprehensive guide.</p>
          </div>
        </div>
       </div>
       
    );
}





export default HomePage;
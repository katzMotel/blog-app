import styles from './Sidebar.module.scss';
import { FaSearch } from 'react-icons/fa';
import {fixIcon} from '@/utils/fixIcon';
import Link from 'next/link';
const Sidebar = () => {
    const SearchIcon = fixIcon(FaSearch);
    return(
        <div className={styles.sidebar}>
            <div className={styles.searchBar}>
                <SearchIcon className={styles.searchIcon} />
                <input type="text" 
                placeholder="Search..." 
                className={styles.searchInput} />
            </div>
            <div className={styles.featuredPosts}>
                <h2>Featured Posts</h2>
                <ul>
                    <li>
                        <div className = {styles.postInfo}>
                            <span>Short Stories</span>
                            <h3>
                                A deep dive into Vonnegut
                            </h3>
                        </div>
                        <div className={styles.postInfo}>
                            <span>Poetry</span>
                            <h3>
                                Exploring the works of Pablo Neruda
                            </h3>
                        </div>
                        <div className={styles.postInfo}>
                            <span>Essays</span>
                            <h3>
                                The impact of technology on modern literature
                            </h3>

                        </div>
                    </li>
                </ul>
                <Link className = {styles.viewAll} href = "#viewAll">View All Posts</Link>
            </div>
            <div className={styles.featuredCreators}>
                <h2>Featured Creators</h2>
                <ul className={styles.creatorList}>
                    <li>
                        <div className = {styles.creatorInfo}>
                            <img 
                                src= "https://randomuser.me/api/portraits/men/32.jpg"
                                alt = "Jimmy Doe"
                            />
                            <div>
                                <h3>Jimmy Doe</h3>
                                <span>@jimdoe</span>
                            </div>
                        </div>
                        <button className={styles.followButton}>Follow</button>
                    </li>
                </ul>
                <Link className = {styles.viewAll} href = "#viewAllCreators">View All Creators</Link>
            </div>
            <div className={styles.footerLinks}>
                <Link href="#termsofservice">Terms of Service</Link>
                <Link href="#privacypolicy">Privacy Policy</Link>
                <Link href="#cookiepolicy">Cookie Policy</Link>
                
            </div>

        </div>
    )
}
export default Sidebar;
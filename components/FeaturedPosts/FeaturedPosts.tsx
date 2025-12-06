import styles from './FeaturedPosts.module.scss';
import BlogPost from '../BlogPost/BlogPost';

const featuredPosts = [
  {
    id: '1',
    title: 'Understanding React Hooks',
    excerpt: 'A deep dive into the world of React Hooks and how to use them effectively.',
    category: 'React',
    author: { name: 'Jimmy Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    date: 'Dec 1, 2024'
  },
  {
    id: '2',
    title: 'Mastering CSS Grid',
    excerpt: 'Learn how to create responsive layouts with CSS Grid in this comprehensive guide.',
    category: 'CSS',
    author: { name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    date: 'Nov 28, 2024'
  },
  {
    id: '3',
    title: 'JavaScript ES6 Features',
    excerpt: 'Explore the new features introduced in ES6 and how they can improve your JavaScript code.',
    category: 'JavaScript',
    author: { name: 'Robert Brown', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    date: 'Nov 25, 2024'
  },
];

export default function FeaturedPosts() {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Featured Blog Posts</h2>
          <p className={styles.description}>
            Explore the latest insights and stories from our community of writers.
          </p>
        </div>

        <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-6">
          {featuredPosts.map((post) => (
            <BlogPost key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
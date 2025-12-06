import styles from './FeaturedCreators.module.scss';
import AuthorCard from '../AuthorCard/AuthorCard';

const featuredCreators = [
  {
    id: '1',
    name: 'Jimmy Doe',
    username: 'jimmydoe',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Highlighting creativity and passion in every post.',
    stats: { posts: 45, followers: 1200 }
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    bio: 'Dive into their journeys and insights',
    stats: { posts: 67, followers: 2100 }
  },
  {
    id: '3',
    name: 'Robert Brown',
    username: 'robertbrown',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Connect with creators and fellow enthusiasts',
    stats: { posts: 89, followers: 3400 }
  },
];

export default function FeaturedCreators() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Meet Our Featured Creators</h2>
          <p className={styles.description}>
            Discover the talented individuals shaping our community. Each creator brings
            a unique perspective and a wealth of knowledge to share.
          </p>
        </div>

        <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-6">
          {featuredCreators.map((creator) => (
            <AuthorCard key={creator.id} {...creator} />
          ))}
        </div>
      </div>
    </section>
  );
}
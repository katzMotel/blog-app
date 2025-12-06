// components/AuthorCard/AuthorCard.tsx
import styles from './AuthorCard.module.scss';
import Link from 'next/link';

interface AuthorCardProps {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  stats?: {
    posts?: number;
    followers?: number;
    following?: number;
  };
  isFollowing?: boolean;
  isOnline?: boolean;
  isVerified?: boolean;
  compact?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
}

export default function AuthorCard({
  id,
  name,
  username,
  avatar,
  bio,
  stats,
  isFollowing = false,
  isOnline = false,
  isVerified = false,
  compact = false,
  onFollow,
  onMessage,
}: AuthorCardProps) {
  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.avatarWrapper}>
        <Link href={`/authors/${id}`}>
          <img src={avatar} alt={name} className={styles.avatar} />
        </Link>
        {isOnline && <div className={styles.statusDot} />}
      </div>

      <div className={styles.info}>
        <div>
          <Link href={`/authors/${id}`}>
            <h3 className={styles.name}>
              {name}
              {isVerified && (
                <span className={styles.badge}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Verified
                </span>
              )}
            </h3>
          </Link>
          <p className={styles.username}>{username}</p>
        </div>

        {bio && <p className={styles.bio}>{bio}</p>}

        {stats && (
          <div className={styles.stats}>
            {stats.posts !== undefined && (
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.posts}</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
            )}
            {stats.followers !== undefined && (
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.followers}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
            )}
            {stats.following !== undefined && (
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.following}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
            )}
          </div>
        )}
      </div>

      {(onFollow || onMessage) && (
        <div className={styles.actions}>
          {onFollow && (
            <button className={styles.followButton} onClick={onFollow}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          {onMessage && (
            <button className={styles.messageButton} onClick={onMessage}>
              Message
            </button>
          )}
        </div>
      )}
    </div>
  );
}
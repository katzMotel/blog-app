// components/BlogPost/BlogPost.tsx
import styles from './BlogPost.module.scss';
import Link from 'next/link';

interface BlogPostProps {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  avatarUrl?:string;
  author?: {
    name: string;
    avatar?: string;
  };
  date?: string;
  category?: string;
  image?: string;
}

export default function BlogPost({
  id,
  title,
  excerpt,
  content,
  author,
  date,
  category,
  image,
}: BlogPostProps) {
  return (
    <article className={styles.blogPost}>
      {image && (
        <img src={image} alt={title} className={styles.image} />
      )}

      <Link href={`/posts/${id}`}>
        <h3 className={styles.title}>{title}</h3>
      </Link>

      <p className={styles.excerpt}>{excerpt || content}</p>

      <div className={styles.meta}>
        <div className={styles.author}>
          {author && (
            <>
              {author.avatar && (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className={styles.authorAvatar}
                />
              )}
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{author.name}</span>
                {date && <span className={styles.date}>{date}</span>}
              </div>
            </>
          )}
        </div>

        {category && <span className={styles.category}>{category}</span>}
      </div>

      <Link href={`/posts/${id}`} className={styles.readMore}>
        Read more
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
    </article>
  );
}
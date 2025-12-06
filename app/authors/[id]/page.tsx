"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, query, where, orderBy, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import BlogPost from "@/components/BlogPost/BlogPost";
import Link from "next/link";
import styles from "./page.module.scss";

export default function AuthorProfile() {
  const params = useParams();
  const id = params?.id as string;
  const { user: currentUser } = useAuth();

  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwner = currentUser?.uid === id;

  useEffect(() => {
    if (!id) return;

    async function loadProfile() {
      try {
        const userSnap = await getDoc(doc(db, "users", id));
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        const postsQ = query(
          collection(db, "posts"),
          where("authorId", "==", id),
          orderBy("createdAt", "desc")
        );
        const postsSnap = await getDocs(postsQ);
        const postsList = postsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPosts(postsList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  if (loading) {
    return(
      <div className= {styles.page}>
        <div className={styles.skeletonCover}></div>
        <div className="container">
          <div className={styles.skeletonProfile}></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container">
        <h1>Profile not found</h1>
        <Link href="/authors" className="btn btn--primary">Back to Authors</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.coverSection}>
        {userData.coverImage ? (
          <img src ={userData.coverImage} alt="Cover" className={styles.coverImage} />
        ) : (
          <div className={styles.coverPlaceholder}></div>
        )}
      </div>

      <div className="container">
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <img
              src={userData.avatarUrl || "/file.svg"}
              alt={userData.fullName || "User"}
              className={styles.avatar}
            />
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <div>
                <h1 className={styles.name}>{userData.fullName || "Anonymous"}</h1>
                {userData.username && <p className={styles.username}>{userData.username}</p>}
              </div>

              {isOwner && (
                <Link href="/profile/edit" className="btn btn--outline">Edit Profile</Link>
              )}
            </div>

            {userData.bio && <p className={styles.bio}>{userData.bio}</p>}
            <div className={styles.meta}>
              {userData.location && (
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>📍</span>
                  {userData.location}
                </div>
              )}
              {userData.website && (
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>🔗</span>
                  <a href={userData.website} target="_blank" rel="noopener noreferrer">
                    {userData.website}
                  </a>
                </div>
              )}
            </div>
            {userData.socialLinks && (
              <div className={styles.socialLinks}>
                {userData.socialLinks.github && (
                  <a
                    href={userData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    GitHub
                  </a>
                )}
                {userData.socialLinks.twitter && (
                  <a
                    href={userData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    >
                    Twitter
                    </a>
                )}
                {userData.socialLinks.instagram &&(
                  <a
                    href={userData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    >
                      Instagram
                    </a>
                )}

              </div>
            )}
          </div>
        </div>
        <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{posts.length}</span>
                <span className={styles.statLabel}>{posts.length=== 1 ? "Post" : "Posts"}</span>
              </div>
        </div>
        <div className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>Posts</h2>

          {posts.length === 0 ? (
            <div className={styles.noPosts}>
              <p>No posts yet.</p>
              {isOwner && (
                <Link href="/posts/create" className="btn btn--primary">
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-6">
              {posts.map((post) => (
                <BlogPost
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt || post.content}
                  author={{
                    name: userData.fullName || "Anonymous",
                    avatar: userData.avatarUrl,
                  }}
                  date={post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : ""}
                  category={post.category}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
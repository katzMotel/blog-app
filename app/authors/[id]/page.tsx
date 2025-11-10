import Image from "next/image";
import AuthorCard from "@/components/AuthorCard/AuthorCard";
import { doc, getDoc, query, where, orderBy, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import BlogPost from "@/components/BlogPost/BlogPost";
import styles from "../page.module.scss"; // adjust path if your styles file is elsewhere
import ProfileLayout from '@/components/UserProfile/ProfileLayout';
import ProfileActions from '@/components/UserProfile/ProfileActions';

export default async function AuthorProfile({ params }: { params: { id: string } }) {
  const { id } = params;
  const userSnap = await getDoc(doc(db, "users", id));
  const user = userSnap.exists() ? (userSnap.data() as any) : null;
  const postsQ = query(collection(db, "posts"), where("authorId", "==", id), orderBy("createdAt", "desc"));
  const postsSnap = await getDocs(postsQ);
  const posts = postsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  const header = (
    <>
      <div className={styles.authorName}>{user?.fullName}</div>
      <div className={styles.bio}>{user?.bio}</div>
    </>
  );

  const actions = (
    <ProfileActions isOwner={false} />
  );

  return (
    <ProfileLayout header={header} actions={actions}>
      <div className={styles.postsSection}>
        <h2>Posts by {user?.fullName}</h2>
        <div className={styles.reader}>
          <div className={styles.postList}>
            {posts.map((post) => (
              <BlogPost
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                avatarUrl={user?.avatarUrl || "/file.svg"}
                time={post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : ""}
                likes={post.likes || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}
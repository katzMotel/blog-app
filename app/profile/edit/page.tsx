"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "@/lib/firebaseConfig";
import Link from "next/link";
import styles from "./page.module.scss";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // File upload states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFullName(data.fullName || "");
          setUsername(data.username || "");
          setBio(data.bio || "");
          setLocation(data.location || "");
          setWebsite(data.website || "");
          setGithub(data.socialLinks?.github || "");
          setTwitter(data.socialLinks?.twitter || "");
          setLinkedin(data.socialLinks?.linkedin || "");
          setAvatarUrl(data.avatarUrl || "");
          setCoverImage(data.coverImage || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, router]);

  const uploadFile = async (
    file: File,
    path: string,
    onProgress: (progress: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;
      let finalCoverUrl = coverImage;

      // Upload avatar if file selected
      if (avatarFile) {
        const avatarPath = `avatars/${user.uid}/${Date.now()}_${avatarFile.name}`;
        finalAvatarUrl = await uploadFile(avatarFile, avatarPath, setAvatarUploadProgress);
      }

      // Upload cover if file selected
      if (coverFile) {
        const coverPath = `covers/${user.uid}/${Date.now()}_${coverFile.name}`;
        finalCoverUrl = await uploadFile(coverFile, coverPath, setCoverUploadProgress);
      }

      // Update Auth profile
      if (fullName !== user.displayName) {
        await updateProfile(auth.currentUser!, { displayName: fullName });
      }

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        username,
        bio,
        location,
        website,
        socialLinks: {
          github: github || null,
          twitter: twitter || null,
          linkedin: linkedin || null,
        },
        avatarUrl: finalAvatarUrl,
        coverImage: finalCoverUrl,
        updatedAt: serverTimestamp(),
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        router.push(`/authors/${user.uid}`);
      }, 1500);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
      setAvatarUploadProgress(0);
      setCoverUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Profile</h1>
          <Link href={`/authors/${user?.uid}`} className="btn btn--outline">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Info Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.formGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username *
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bio" className={styles.label}>
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
          </section>

          {/* Images Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Images</h2>

            {/* Avatar Upload */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Avatar</label>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className={styles.fileInput}
                  id="avatarFile"
                />
                <label htmlFor="avatarFile" className={styles.fileLabel}>
                  <span>📷 Choose Image</span>
                  <span className={styles.fileHint}>or drag and drop (max 5MB)</span>
                </label>
              </div>
              {avatarUploadProgress > 0 && avatarUploadProgress < 100 && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${avatarUploadProgress}%` }}
                  ></div>
                </div>
              )}
              {avatarUrl && (
                <div className={styles.imagePreview}>
                  <img src={avatarUrl} alt="Avatar preview" />
                </div>
              )}
              <input
                type="url"
                value={avatarFile ? "" : avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className={styles.input}
                placeholder="Or paste image URL"
                disabled={!!avatarFile}
              />
            </div>

            {/* Cover Upload */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Cover Image</label>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className={styles.fileInput}
                  id="coverFile"
                />
                <label htmlFor="coverFile" className={styles.fileLabel}>
                  <span>🖼️ Choose Image</span>
                  <span className={styles.fileHint}>or drag and drop (max 5MB)</span>
                </label>
              </div>
              {coverUploadProgress > 0 && coverUploadProgress < 100 && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${coverUploadProgress}%` }}
                  ></div>
                </div>
              )}
              {coverImage && (
                <div className={styles.coverPreview}>
                  <img src={coverImage} alt="Cover preview" />
                </div>
              )}
              <input
                type="url"
                value={coverFile ? "" : coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className={styles.input}
                placeholder="Or paste image URL"
                disabled={!!coverFile}
              />
            </div>
          </section>

          {/* Location & Website Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Additional Info</h2>

            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={styles.input}
                placeholder="Memphis, TN"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="website" className={styles.label}>
                Website
              </label>
              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={styles.input}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </section>

          {/* Social Links Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Social Links</h2>

            <div className={styles.formGroup}>
              <label htmlFor="github" className={styles.label}>
                GitHub
              </label>
              <input
                id="github"
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className={styles.input}
                placeholder="https://github.com/username"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="twitter" className={styles.label}>
                Twitter
              </label>
              <input
                id="twitter"
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className={styles.input}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="linkedin" className={styles.label}>
                LinkedIn
              </label>
              <input
                id="linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className={styles.input}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </section>

          {/* Error/Success Messages */}
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Link href={`/authors/${user?.uid}`} className="btn btn--outline btn--lg">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={saving || avatarUploadProgress > 0 || coverUploadProgress > 0}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
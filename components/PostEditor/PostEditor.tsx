"use client";

import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import styles from "./PostEditor.module.scss";

type PostEditorProps = {
  initial?: {
    title?: string;
    body?: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    featuredImage?: string;
    published?: boolean;
  };
  onSave: (data: {
    title: string;
    body: string;
    excerpt: string;
    category: string;
    tags: string[];
    featuredImage: string;
    published: boolean;
  }) => Promise<string | void>;
  onCancel?: () => void;
  savingLabel?: string;
};

const CATEGORIES = [
  "Technology",
  "Design",
  "Business",
  "Marketing",
  "Programming",
  "Lifestyle",
  "Travel",
  "Food",
  "Health",
  "Other",
];

export default function PostEditor({
  initial = {},
  onSave,
  onCancel,
  savingLabel = "Publish",
}: PostEditorProps) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [body, setBody] = useState(initial.body ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [tags, setTags] = useState(initial.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState(initial.featuredImage ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [published, setPublished] = useState(initial.published ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const imagePath = `posts/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, imagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
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

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!body.trim()) {
      setError("Content is required");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = featuredImage;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      await onSave({
        title: title.trim(),
        body: body.trim(),
        excerpt: excerpt.trim() || body.trim().slice(0, 200),
        category: category || "Other",
        tags,
        featuredImage: finalImageUrl,
        published,
      });
    } catch (err: any) {
      setError(err?.message ?? "Save failed. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Title */}
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
          placeholder="Enter your post title..."
          required
        />
        <span className={styles.charCount}>{title.length} characters</span>
      </div>

      {/* Excerpt */}
      <div className={styles.formGroup}>
        <label htmlFor="excerpt" className={styles.label}>
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={styles.textarea}
          rows={3}
          placeholder="Brief summary of your post (optional, auto-generated if empty)..."
          maxLength={300}
        />
        <span className={styles.charCount}>{excerpt.length}/300 characters</span>
      </div>

      {/* Category & Tags Row */}
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.select}
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tags" className={styles.label}>
            Tags
          </label>
          <div className={styles.tagInput}>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
              placeholder="Add tags..."
            />
            <button type="button" onClick={handleAddTag} className={styles.addTagBtn}>
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className={styles.tagList}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Featured Image</label>
        <div className={styles.uploadArea}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className={styles.fileInput}
            id="featuredImage"
          />
          <label htmlFor="featuredImage" className={styles.fileLabel}>
            <span>🖼️ Choose Image</span>
            <span className={styles.fileHint}>or drag and drop (max 5MB)</span>
          </label>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
        {featuredImage && (
          <div className={styles.imagePreview}>
            <img src={featuredImage} alt="Featured preview" />
          </div>
        )}
        <input
          type="url"
          value={imageFile ? "" : featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          className={styles.input}
          placeholder="Or paste image URL"
          disabled={!!imageFile}
        />
      </div>

      {/* Body */}
      <div className={styles.formGroup}>
        <label htmlFor="body" className={styles.label}>
          Content *
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={styles.bodyTextarea}
          rows={20}
          placeholder="Write your post content here..."
          required
        />
        <span className={styles.charCount}>{body.length} characters</span>
      </div>

      {/* Publish Toggle */}
      <div className={styles.publishToggle}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.toggleText}>
            {published ? "Published (visible to everyone)" : "Draft (only you can see)"}
          </span>
        </label>
      </div>

      {/* Error/Success */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Actions */}
      <div className={styles.actions}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn--outline btn--lg">
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={loading || uploadProgress > 0}
        >
          {loading ? "Saving..." : savingLabel}
        </button>
      </div>
    </form>
  );
}
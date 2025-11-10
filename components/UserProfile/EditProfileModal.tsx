"use client";
import React, { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import { db } from "@/lib/firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

type Props = {
  isOpen?: boolean;
  initialName?: string;
  initialEmail?: string;
  onClose?: () => void;
  onSuccess?: (user?: User) => void;
};

export default function EditProfileModal({
  isOpen = true,
  initialName = "",
  initialEmail = "",
  onClose,
  onSuccess,
}: Props) {
  const [displayName, setDisplayName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const needsReauth = () =>
    (email && email !== initialEmail) || (newPassword && newPassword.length > 0);

  const mapAuthError = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Enter a valid email.";
      case "auth/email-already-in-use":
        return "That email is already in use.";
      case "auth/weak-password":
        return "Choose a stronger password (min 6-8 chars).";
      case "auth/wrong-password":
        return "Current password incorrect.";
      case "auth/requires-recent-login":
        return "Please re-enter your current password to continue.";
      default:
        return "An error occurred. Try again.";
    }
  };

  const tryReauth = async (user: User) => {
    if (!currentPassword) throw { code: "auth/wrong-password" };
    const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
    await reauthenticateWithCredential(user, credential);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError("Password too short (min 6 characters).");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("No signed-in user.");
      return;
    }

    setLoading(true);
    try {
      // Reauth if necessary before sensitive changes
      if (needsReauth()) {
        await tryReauth(user);
      }

      // Update displayName in Auth
      if (displayName && displayName !== (user.displayName || "")) {
        await updateProfile(user, { displayName });
      }

      // Update email in Auth
      if (email && email !== (user.email || "")) {
        await updateEmail(user, email);
      }

      // Update password in Auth
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      // Now update Firestore `users/{uid}` doc (merge/update)
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          fullName: displayName,
          email: email,
          updatedAt: serverTimestamp(),
        });
      } catch (fireErr) {
        // Firestore update failure is non-fatal for Auth update, but report it.
        console.warn("Failed to update Firestore user doc:", fireErr);
      }

      setSuccess("Profile updated.");
      onSuccess?.(auth.currentUser ?? user);

      setTimeout(() => {
        setLoading(false);
        onClose?.();
      }, 700);
    } catch (err: any) {
      setLoading(false);
      const code = err?.code || (err && typeof err === "object" && (err as any).message) || "";
      setError(mapAuthError(code));
    }
  };

  return (
    <div style={backdropStyle}>
      <form style={modalStyle} onSubmit={handleSubmit}>
        <h3>Edit Profile</h3>

        <label style={labelStyle}>
          Display name
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle} />
        </label>

        <hr />

        <p style={{ fontSize: 12, color: "#666" }}>
          To change email or password, enter your current password below (reauth required).
        </p>

        <label style={labelStyle}>
          Current password
          <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" style={inputStyle} />
        </label>

        <label style={labelStyle}>
          New password
          <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Confirm new password
          <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" style={inputStyle} />
        </label>

        {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button type="button" onClick={() => onClose?.()} disabled={loading} style={btnStyleSecondary}>
            Cancel
          </button>
          <button type="submit" disabled={loading} style={btnStylePrimary}>
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* minimal inline styles (replace with your CSS if desired) */
const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};
const modalStyle: React.CSSProperties = {
  background: "white",
  padding: 20,
  width: 420,
  borderRadius: 10,
  boxShadow: "0 6px 30px rgba(0,0,0,0.25)",
};
const labelStyle: React.CSSProperties = { display: "block", marginTop: 8, fontSize: 14 };
const inputStyle: React.CSSProperties = { display: "block", width: "100%", padding: "8px 10px", marginTop: 6, boxSizing: "border-box" };
const btnStylePrimary: React.CSSProperties = { padding: "8px 14px", background: "#0069ff", color: "white", border: "none", borderRadius: 6, cursor: "pointer" };
const btnStyleSecondary: React.CSSProperties = { padding: "8px 14px", background: "#eee", color: "#111", border: "none", borderRadius: 6, cursor: "pointer" };
"use client";
import React, { useState } from "react";
import styles from "./Profile.module.scss";
import EditProfileModal from "./EditProfileModal";

type Props = {
  isOwner?: boolean;
  onEdit?: () => void;
  onCreatePost?: () => void;
  initialName?: string;
  initialEmail?: string;
};

export default function ProfileActions({
  isOwner = false,
  onEdit,
  onCreatePost,
  initialName = "",
  initialEmail = "",
}: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <div className={styles.actionsWrap}>
      {isOwner && (
        <>
          <button
            className={styles.actionBtn}
            onClick={() => {
              setEditing(true);
              onEdit?.();
            }}
          >
            Edit Profile
          </button>

          
        </>
      )}

      {editing && (
        <EditProfileModal
          isOpen
          initialName={initialName}
          initialEmail={initialEmail}
          onClose={() => setEditing(false)}
          onSuccess={() => {
            // refresh page or trigger parent refresh callback as needed
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
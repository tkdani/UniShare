"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/hooks/deleteUser";

interface DeleteUserButtonProps {
  userId: string;
  username: string;
  isAdmin: boolean;
}

export function DeleteUserButton({
  userId,
  username,
  isAdmin,
}: DeleteUserButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (isAdmin) return null;

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteUser(userId);
    if (result.error) {
      alert("Hiba: " + result.error);
    }
    setLoading(false);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground">
          Delete: <strong>{username}</strong>?
        </span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded hover:bg-destructive/90 disabled:opacity-50"
        >
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded hover:bg-secondary/80"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Törlés
    </button>
  );
}

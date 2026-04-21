"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function DeleteFileButton({ fileId }: { fileId: string }) {
  const supabase = createClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    const { data: fileData } = await supabase
      .from("user_files")
      .select("url")
      .eq("id", fileId)
      .single();

    const { error } = await supabase
      .from("user_files")
      .delete()
      .eq("id", fileId);

    if (error) {
      setLoading(false);
      return;
    }

    if (fileData?.url) {
      const path = fileData.url.split("/files/")[1];

      await supabase.storage.from("files").remove([path]);
    }

    setDeleted(true);
    setLoading(false);
  };

  if (deleted) {
    return <span className="text-xs text-muted-foreground">Deleted</span>;
  }

  if (showConfirm) {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground">Are you sure?</span>
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
    <Button
      variant="destructive"
      size="sm"
      onClick={() => setShowConfirm(true)}
      disabled={loading}
    >
      {loading ? "..." : "Delete"}
    </Button>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function DeleteFileButton({ fileId }: { fileId: string }) {
  const supabase = createClient();
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Do you want to delete the file?")) return;
    setLoading(true);
    console.log(fileId);

    const { error } = await supabase
      .from("user_files")
      .delete()
      .eq("id", fileId);
    if (error) console.log(error);
    setDeleted(true);
    setLoading(false);
  };

  if (deleted) {
    return <span className="text-xs text-muted-foreground">Deleted</span>;
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "..." : "Delete"}
    </Button>
  );
}

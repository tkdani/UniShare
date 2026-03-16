"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function BanUserButton({
  userId,
  isBanned,
  isAdmin,
}: {
  userId: string;
  isBanned?: boolean;
  isAdmin: boolean;
}) {
  const supabase = createClient();
  const [banned, setBanned] = useState(isBanned ?? false);
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    return <span className="text-xs text-muted-foreground">–</span>;
  }

  const handleToggle = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ is_banned: !banned })
      .eq("id", userId);
    setBanned(!banned);
    setLoading(false);
    if (error) console.log(error);
  };

  return (
    <Button
      variant={banned ? "outline" : "destructive"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "..." : banned ? "Unblock" : "Block"}
    </Button>
  );
}

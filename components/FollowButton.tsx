"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/Button";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  currentUserId: string | null;
  initialFollowing: boolean;
  onFollowChange?: (following: boolean) => void;
}

export function FollowButton({
  targetUserId,
  currentUserId,
  initialFollowing,
  onFollowChange,
}: FollowButtonProps) {
  const supabase = createClient();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  if (!currentUserId || currentUserId === targetUserId) return null;

  const handleFollow = async () => {
    setLoading(true);
    const newFollowing = !following;
    setFollowing(newFollowing);
    onFollowChange?.(newFollowing);

    if (newFollowing) {
      await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: targetUserId,
      });
    } else {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId);
    }

    setLoading(false);
  };

  return (
    <Button
      variant={following ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
      className="gap-2"
    >
      {following ? (
        <>
          <UserMinus className="h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}

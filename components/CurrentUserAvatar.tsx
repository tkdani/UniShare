"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CurrentUserAvatarProps {
  user: User | null;
}

export default function CurrentUserAvatar({ user }: CurrentUserAvatarProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const name = user?.full_name ?? user?.username ?? "?";
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const fetchImage = async () => {
      if (!user?.avatar_url) {
        setProfileImage(null);
        return;
      }
      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(user.avatar_url, 3600);
      setProfileImage(data?.signedUrl ?? null);
    };
    fetchImage();
  }, [user]);

  if (!mounted) {
    return (
      <Avatar>
        <AvatarFallback>{name[0]?.toUpperCase() ?? "?"}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar>
      <AvatarImage src={profileImage ?? undefined} />
      <AvatarFallback>{name[0]?.toUpperCase() ?? "?"}</AvatarFallback>
    </Avatar>
  );
}

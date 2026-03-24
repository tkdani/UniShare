"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CurrentUserAvatarProps {
  profile: User | null;
}

export default function CurrentUserAvatar({ profile }: CurrentUserAvatarProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const name = profile?.full_name ?? profile?.username ?? "?";
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const fetchImage = async () => {
      if (!profile?.avatar_url) {
        setProfileImage(null);
        return;
      }
      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(profile.avatar_url, 3600);
      setProfileImage(data?.signedUrl ?? null);
    };
    fetchImage();
  }, [profile]);

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

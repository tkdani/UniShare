"use client";

import useCurrentUserImage from "@/hooks/useCurrentUserImage";
import useCurrentUserName from "@/hooks/useCurrentUserName";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

export default function CurrentUserAvatar({ user }: { user: any }) {
  const profileImage = useCurrentUserImage();
  const name =
    user?.user_metadata?.full_name ?? user?.user_metadata?.username ?? "?";

  return (
    <Avatar>
      {profileImage && (
        <AvatarImage src={profileImage} alt={name[0].toUpperCase()} />
      )}
      <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

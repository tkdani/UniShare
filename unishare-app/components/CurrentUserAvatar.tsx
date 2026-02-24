"use client";

import useCurrentUserImage from "@/hooks/useCurrentUserImage";
import useCurrentUserName from "@/hooks/useCurrentUserName";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

export default function CurrentUserAvatar() {
  const profileImage = useCurrentUserImage();
  const name = useCurrentUserName();
  const initials = name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  return (
    <Avatar>
      {profileImage && <AvatarImage src={profileImage} alt={initials} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

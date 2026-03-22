"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/Button";
import Link from "next/link";
import CurrentUserAvatar from "./CurrentUserAvatar";
import { useRouter } from "next/navigation";

interface AvatarDropdownProps {
  profile: User | null;
}

export default function AvatarDropdown({ profile }: AvatarDropdownProps) {
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            {" "}
            <CurrentUserAvatar profile={profile} />
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 mr-2 mt-1">
        <DropdownMenuGroup>
          {profile ? (
            <>
              <DropdownMenuItem disabled>{profile.username}</DropdownMenuItem>
              {profile.is_admin && (
                <DropdownMenuItem>
                  <Link href="/admin">Admin</Link>
                  <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          ) : (
            <></>
          )}
          <DropdownMenuItem>
            <Link href={"/docs"}>Docs</Link>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profile ? (
            <DropdownMenuItem
              className="w-full cursor-pointer"
              onClick={logout}
              variant={"destructive"}
            >
              Log out
              <DropdownMenuShortcut>⌘o</DropdownMenuShortcut>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link className="w-full" href="/login">
                Log in
              </Link>
              <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

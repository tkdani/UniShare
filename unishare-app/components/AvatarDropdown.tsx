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
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import Link from "next/link";
import CurrentUserAvatar from "./CurrentUserAvatar";
import useProfile from "@/hooks/useProfile";

export default function AvatarDropdown() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const profile = useProfile();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };
    fetchUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            {" "}
            <CurrentUserAvatar user={user} />
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
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user ? (
            <DropdownMenuItem
              className="w-full"
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

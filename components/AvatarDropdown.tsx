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
import { useUser } from "./UserProvider";

export default function AvatarDropdown() {
  const router = useRouter();
  const supabase = createClient();
  const user = useUser();

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
            <CurrentUserAvatar user={user} />
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 mr-2 mt-1">
        <DropdownMenuGroup>
          {user ? (
            <>
              <DropdownMenuItem disabled>{user.username}</DropdownMenuItem>
              {user.is_admin && (
                <DropdownMenuItem>
                  <Link
                    href="/admin"
                    className="flex justify-between items-center w-full"
                  >
                    Admin
                    <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Link
                  href="/profile"
                  className="flex justify-between items-center w-full"
                >
                  Profile
                  <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <></>
          )}
          <DropdownMenuItem>
            <Link
              href={"/docs"}
              className="flex justify-between items-center w-full"
            >
              Docs
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user ? (
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
              <Link
                href="/login"
                className="flex justify-between items-center w-full"
              >
                Log in
                <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

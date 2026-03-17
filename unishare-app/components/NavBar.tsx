"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import Link from "next/link";
import { Separator } from "./ui/Separator";
import AvatarDropdown from "./AvatarDropdown";
import DarkModeSwitch from "./DarkModeSwitch";
import { SearchBar } from "./SearchBar";

export default function NavBar() {
  return (
    <NavigationMenu className="mb-4">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/">Home</Link>}
          />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/saved">Saved</Link>}
          />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/notes">Notes</Link>}
          />
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <SearchBar />
        </NavigationMenuItem>
        <Separator orientation="vertical" />
        <NavigationMenuItem>
          <DarkModeSwitch />
        </NavigationMenuItem>
        <Separator orientation="vertical" />
        <AvatarDropdown />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

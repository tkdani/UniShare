"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import AvatarDropdown from "./AvatarDropdown";
import SearchBar from "./SearchBar";
import { Separator } from "@/components/ui/separator";

import ModeToggle from "./ModeToggle";
import DarkModeSwitch from "./DarkModeSwitch";

const NavBar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/saved">Saved</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/notes">Notes</Link>
          </NavigationMenuLink>
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
};

export default NavBar;

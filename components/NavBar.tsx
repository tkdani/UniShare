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
import { MobileMenu } from "./MobileMenu";

export default function NavBar() {
  return (
    <NavigationMenu className="mb-4 sticky top-0 z-50 bg-background">
      {/* Desktop menu */}
      <div className="hidden md:flex">
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
              render={<Link href="/statistics">Statistics</Link>}
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
      </div>
      {/* Mobile menu */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
      <NavigationMenuList>
        <NavigationMenuItem>
          <SearchBar />
        </NavigationMenuItem>
        <Separator className="hidden sm:block" orientation="vertical" />
        <div className="hidden sm:block">
          <NavigationMenuItem>
            <DarkModeSwitch />
          </NavigationMenuItem>
        </div>
        <Separator orientation="vertical" />
        <AvatarDropdown />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

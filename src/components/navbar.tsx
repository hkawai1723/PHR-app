import React from "react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuList,
} from "@ui/navigation-menu";
import Link from "next/link";
import { Home } from "lucide-react";
export const Navbar = () => {
  return (
    <div className="w-full border-b-1">
      <NavigationMenu className="p-2 ">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="group " title="Home">
                <Home className="text-blue-700 group-hover:text-blue-400 size-6 m-1" />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/past-medical-history"
                className="text-blue-700 hover:text-blue-400 p-4"
              >
                Past medical history
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/family-history"
                className="text-blue-700 hover:text-blue-400 p-4"
              >
                Family history
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

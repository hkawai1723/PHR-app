import React from "react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuList,
} from "@ui/navigation-menu";
import Link from "next/link";
import { Home } from "lucide-react";
import { NavAvatar } from "@/components/nav-avatar";
export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-18 bg-white border-b-1 z-50">
      <NavigationMenu className="w-full max-w-none p-2">
        <NavigationMenuList className="w-screen flex justify-between px-4">
          <div className="flex items-center space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="p-0">
                <Link href="/" title="Home">
                  <Home
                    className="text-blue-700 hover:text-blue-400 p-3"
                    style={{ width: "48px", height: "48px" }}
                  />
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
          </div>
          <NavAvatar />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

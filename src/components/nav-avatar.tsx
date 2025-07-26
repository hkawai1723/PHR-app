"use client";
import { useGetUser } from "@/features/auth/hooks/use-get-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { LogOut } from "lucide-react";

export const NavAvatar = () => {
  const user = useGetUser();
  const logoutMutation = useLogout();
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="me-4">
        <Avatar className="size-10">
          <AvatarImage src={user?.photoURL ? user.photoURL : undefined} />
          <AvatarFallback className="bg-blue-500 text-white">
            {user?.displayName ? user?.displayName[0] : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white p-6"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xl">
          {user?.displayName || "Guest"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1 bg-gray-400" />

        <Button
          variant="outline"
          size="lg"
          onClick={handleLogout}
          className="mt-4 text-xl"
        >
          <LogOut />
          Logout
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

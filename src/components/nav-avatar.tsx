"use client";
import React from "react";
import { Avatar, AvatarFallback } from "@ui/avatar";
import { useGetUser } from "@/features/auth/hooks/use-get-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@ui/dropdown-menu";
import { Button } from "@ui/button";

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
          <AvatarFallback className="bg-blue-500 text-white">
            {user?.displayName ? user?.displayName[0] : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white p-4"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <DropdownMenuLabel>{user?.displayName || "Guest"}</DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1 bg-gray-400" />
        <DropdownMenuItem>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

"use client";
import { auth } from "@firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const DashboardLayoutClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: (): Promise<User | null> => {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  return user ? <>{children}</> : null;
};

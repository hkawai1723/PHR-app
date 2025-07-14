import { useQuery } from "@tanstack/react-query";
import { auth } from "@firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "@firebase/auth";

export const useAuth = () => {
  return useQuery({
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
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

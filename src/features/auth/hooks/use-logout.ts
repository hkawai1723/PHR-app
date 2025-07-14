import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/firebase/google-provider";
import { auth } from "@firebase";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => logout(auth),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully.");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    },
  });

  return mutation;
};

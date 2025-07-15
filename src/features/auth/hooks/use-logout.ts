import { logout } from "@/lib/firebase/google-provider";
import { auth } from "@firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => logout(auth),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully.");
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    },
  });

  return mutation;
};

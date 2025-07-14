import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginWithGoogle, logout } from "@/lib/firebase/google-provider";
import { auth } from "@firebase";
import { toast } from "sonner";

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => loginWithGoogle(auth),
    onSuccess: (userCredential) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(`Welcome, ${userCredential.user.displayName}!`);
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Failed to log in with Google. Please try again.");
    },
  });

  return mutation;
};

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

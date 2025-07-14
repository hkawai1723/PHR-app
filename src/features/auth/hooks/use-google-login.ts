//google OAuthでログインを行うmutationを提供。
import { loginWithGoogle } from "@/lib/firebase/google-provider";
import { auth } from "@firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useGoogleLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => loginWithGoogle(auth),
    onSuccess: (userCredential) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(`Welcome, ${userCredential.user.displayName}!`);
      router.push("/");
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Failed to log in with Google. Please try again.");
    },
  });

  return mutation;
};

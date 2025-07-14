import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@/features/auth/hooks/use-google-login";

export const LoginForm = () => {
  const mutation = useGoogleLogin();
  return (
    <div className="flex items-center justify-center">
      <Button
        className="w-full"
        variant="outline"
        size="xl"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        <FcGoogle className="size-8" />
        <span className="text-xl">Googleでログイン</span>
      </Button>
    </div>
  );
};

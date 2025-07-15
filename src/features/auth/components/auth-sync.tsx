//認証状態を同期するためのcomponent
"use client";
import { useEffect } from "react";
import { auth } from "@firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";

export const AuthSync = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        queryClient.setQueryData(["auth", "user"], user);
        //ログイン時：セッションクッキーを作成
        const idToken = await user.getIdToken();
        //cookieを作成するAPIを叩く
        await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });
      } else {
        //ログアウト時：cookieを削除
        await fetch("/api/auth/session", {
          method: "DELETE",
        });
      }
    });
    return () => unsubscribe();
  }, [queryClient]);

  return null;
};

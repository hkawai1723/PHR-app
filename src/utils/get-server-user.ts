import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export async function getServerUser(): Promise<DecodedIdToken | null> {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("session")?.value;

    if (!sessionToken) {
      return null;
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionToken);
    return decodedToken;
  } catch (error) {
    console.error("Error getting server user:", error);
    return null;
  }
}

export async function getUserOnServer(): Promise<DecodedIdToken> {
  const user = await getServerUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/firebase-admin";

export async function getUserOnServer() {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("firebase-token")?.value;

    if (!sessionToken) {
      return null;
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionToken);
    return await adminAuth.getUser(decodedToken.uid);
  } catch (error) {
    console.error("Error getting server user:", error);
    return null;
  }
}

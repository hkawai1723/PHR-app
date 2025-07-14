import {
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  browserPopupRedirectResolver,
} from "firebase/auth";
import type { Auth, AuthProvider, UserCredential } from "firebase/auth";

const getGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  provider.setCustomParameters({
    display: "popup",
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });
  return provider;
};

const loginWithProvider = async (auth: Auth, provider: AuthProvider) => {
  try {
    const result = await signInWithPopup(
      auth,
      provider,
      browserPopupRedirectResolver
    );
    return result;
  } catch (error) {
    console.error("Error during login with provider:", error);
    throw error;
  }
};

export const loginWithGoogle = async (auth: Auth): Promise<UserCredential> => {
  const provider = getGoogleProvider();
  return await loginWithProvider(auth, provider);
};

export const logout = async (auth: Auth): Promise<void> => {
  try {
    return signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

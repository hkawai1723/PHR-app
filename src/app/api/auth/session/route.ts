//userの情報をcookieに保存
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 14 * 1000, // 14 days
    });
    const response = NextResponse.json({ success: true });
    response.cookies.set("firebase-token", sessionCookie, {
      maxAge: 60 * 60 * 24 * 14, // 14 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    console.error("Error setting session cookie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set session cookie" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("firebase-token");
    return response;
  } catch (error) {
    console.error("Error deleting session cookie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete session cookie" },
      { status: 500 }
    );
  }
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getUserOnServer } from "@/utils/get-server-user";
import { NextResponse } from "next/server";
import { UserRecord } from "firebase-admin/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
};

export class APIAuthError extends Error {
  constructor(public response: NextResponse, message: string = "API Error") {
    super(message);
    this.name = "APIError";
  }
}

export const checkUserOnAPI = async (): Promise<UserRecord> => {
  try {
    const user = await getUserOnServer();
    if (!user) {
      throw new APIAuthError(
        NextResponse.json(
          {
            success: false,
            error: "Unauthorized: User not authenticated",
          },
          { status: 401 }
        ),
        "User not authenticated"
      );
    }
    return user;
  } catch (error) {
    if (error instanceof APIAuthError) {
      throw error;
    } else {
      throw new APIAuthError(
        NextResponse.json(
          { success: false, error: "Authentication check failed" },
          { status: 500 }
        ),
        "Authentication check failed"
      );
    }
  }
};

export const initializeTextObject = (defaultValue) => {
  const mapped = Object.entries(defaultValue).map(([key, value]) => {
    return [
      key,
      {
        value: value,
        isEditing: false,
      },
    ];
  });

  const formattedEntries = Object.fromEntries(mapped);
  const defaultTextState = {
    ...formattedEntries,
    hasEdited: false, //一度でも編集したならtrueに変更。
  };

  return defaultTextState;
};

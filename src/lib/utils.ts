import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
};

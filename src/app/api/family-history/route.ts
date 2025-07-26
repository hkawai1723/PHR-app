import {
  createFamilyHistory,
  getFamilyHistoryList,
} from "@/features/family-history/api/handlers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return createFamilyHistory(request);
}

export async function GET() {
  return getFamilyHistoryList();
}

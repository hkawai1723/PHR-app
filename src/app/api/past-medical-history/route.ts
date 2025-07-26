import {
  createPMH,
  getPMHList,
} from "@/features/pmh/api/handlers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return createPMH(request);
}

export async function GET() {
  return getPMHList();
}

import {
  deleteFamilyHistory,
  updateFamilyHistory,
} from "@/features/family-history/api/handlers";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return deleteFamilyHistory(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return updateFamilyHistory(request, context);
}


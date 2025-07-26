import {
  deleteFamilyHistory,
  updateFamilyHistory,
} from "@/features/family-history/api/handlers";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return deleteFamilyHistory(request, { params: resolvedParams });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return updateFamilyHistory(request, { params: resolvedParams });
}

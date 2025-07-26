import { deletePMH, updatePMH } from "@/features/pmh/api/handlers";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return deletePMH(request, { params: resolvedParams });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return updatePMH(request, { params: resolvedParams });
}

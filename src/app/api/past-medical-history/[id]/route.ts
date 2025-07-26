import { deletePMH, updatePMH } from "@/features/pmh/api/handlers";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return deletePMH(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return updatePMH(request, context);
}

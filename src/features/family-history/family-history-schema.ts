import { z } from "zod";

export const familyHistorySchema = z.object({
  diseaseName: z.string().min(1, "Disease name is required"),
  relationship: z.string().min(1, "Relationship is required. You can use 'unknown'."),
  notes: z.string().max(1024, "Notes must be less than 1024 characters"),
});


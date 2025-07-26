import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const familyHistorySchema = z.object({
  diseaseName: z.string().min(1, "Disease name is required"),
  relationship: z
    .string()
    .min(1, "Relationship is required. You can use 'unknown'."),
  notes: z.string().max(1024, "Notes must be less than 1024 characters"),
});

export type FamilyHistorySchemaType = z.infer<typeof familyHistorySchema>;

export type FamilyHistoryFieldNames = "diseaseName" | "relationship" | "notes";

export interface FamilyHistoryType {
  diseaseName: string;
  relationship: string;
  notes: string | null;
}
export interface FamilyHistoryRequestType extends FamilyHistoryType {
  userId: string;
}

export interface FamilyHistoryServerType extends FamilyHistoryRequestType {
  writtenBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FamilyHistoryResponseType extends FamilyHistoryServerType {
  id: string;
}

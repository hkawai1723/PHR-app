import { z } from "zod";

//TODO: diagnosisDateの型を検討する。regexなどを使って、format確認。
export const pmhSchema = z.object({
  diseaseName: z.string().min(1, "Disease name is required"),
  diagnosisDate: z.string(),
  primaryCareProvider: z
    .string()
    .max(100, "Primary care provider name must be less than 100 characters"),
  notes: z.string().max(1024, "Notes must be less than 1024 characters"),
});

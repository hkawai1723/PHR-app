import { Timestamp } from "firebase-admin/firestore";
export interface PMHType {
  diseaseName: string;
  diagnosisDate: string | null;
  primaryCareProvider: string | null;
  notes: string | null;
}
export interface PMHRequestType extends PMHType {
  userId: string;
}

export interface PMHServerType extends PMHRequestType {
  writtenBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PMHResponseType extends PMHServerType {
  id: string;
}

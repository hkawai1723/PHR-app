import { Timestamp } from "firebase/firestore";

export interface FamilyHistoryType {
  diseaseName: string;
  relationship: string | null;
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

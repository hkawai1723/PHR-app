import React from "react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FamilyHistoryResponseType } from "../family-history-types";
import { Button } from "@/components/ui/button";
import { useDeleteFamilyHistory } from "@/features/family-history/api/use-delete-family-history";

interface FamilyHistoryRecordDialogProps {
  record: FamilyHistoryResponseType;
  onClose: () => void; // ダイアログを閉じる関数を追加
}

export const FamilyHistoryRecordDialog = ({ record, onClose }: FamilyHistoryRecordDialogProps) => {
  const deleteFamilyHistory = useDeleteFamilyHistory();
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${record.diseaseName}"?\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    await deleteFamilyHistory.mutateAsync(record.id);
    onClose();
  };

  return (
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle>Past Medical History Record</DialogTitle>
      </VisuallyHidden>
      <div className="space-y-4">
        <div>
          <h3>Disease Name</h3>
          <p>{record.diseaseName}</p>
        </div>
        <div>
          <h3>Diagnosis Date</h3>
          <p>{record.diagnosisDate || <br />}</p>
        </div>
        <div>
          <h3>Primary Care Provider</h3>
          <p>{record.primaryCareProvider || <br />}</p>
        </div>
        <div>
          <h3>Notes</h3>
          <p>{record.notes || <br />}</p>
        </div>
      </div>
      <Button onClick={handleDelete}>Delete</Button>
    </DialogContent>
  );
};

import React from "react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PMHResponseType } from "../pmh-types";
import { Button } from "@/components/ui/button";
import { useDeletePMH } from "@/features/pmh/api/use-delete-pmh";

interface PMHRecordDialogProps {
  record: PMHResponseType;
  onClose: () => void; // ダイアログを閉じる関数を追加
}

export const PMHRecordDialog = ({ record, onClose }: PMHRecordDialogProps) => {
  const deletePMH = useDeletePMH();
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${record.diseaseName}"?\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    await deletePMH.mutateAsync(record.id);
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

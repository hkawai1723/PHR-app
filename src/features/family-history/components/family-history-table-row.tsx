import {
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { FamilyHistoryResponseType } from "../family-history-types";
import { FamilyHistoryRecordDialog } from "./family-history-record-dialog";

export const FamilyHistoryTableRow = ({ record }: { record: FamilyHistoryResponseType }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <TableRow>
          <TableCell>{record.diseaseName}</TableCell>
          <TableCell className="hidden lg:table-cell">
            {record.diagnosisDate}
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            {record.primaryCareProvider}
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <FamilyHistoryRecordDialog record={record} onClose={handleCloseDialog} />
    </Dialog>
  );
};

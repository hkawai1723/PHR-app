import {
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { PMHResponseType } from "../pmh-types";
import { PMHRecordDialog } from "./pmh-record-dialog";

export const PMHTableRow = ({ record }: { record: PMHResponseType }) => {
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
      <PMHRecordDialog record={record} onClose={handleCloseDialog} />
    </Dialog>
  );
};

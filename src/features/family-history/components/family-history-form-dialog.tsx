import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Plus } from "lucide-react";
import { FamilyHistoryForm } from "./family-history-form";

type FamilyHistoryFormDialogProps = {
  children: React.ReactNode;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className?: string;
};

export const FamilyHistoryFormDialog = ({
  children,
  variant,
  className,
}: FamilyHistoryFormDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          {children ? children : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Form dialog to register family history.</DialogTitle>
        </VisuallyHidden>
        <FamilyHistoryForm />
      </DialogContent>
    </Dialog>
  );
};

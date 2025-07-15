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
import { PMHForm } from "./pmh-form";

type PMHFormDialogProps = {
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

export const PMHFormDialog = ({
  children,
  variant,
  className,
}: PMHFormDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          {children ? children : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>
            Form dialog to register past medical history.
          </DialogTitle>
        </VisuallyHidden>
        <PMHForm />
      </DialogContent>
    </Dialog>
  );
};

import { useDeletePMH } from "@/features/pmh/api/use-delete-pmh";
import { pmhSchema } from "@/features/pmh/pmh-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@ui/button";
import { DialogClose, DialogContent, DialogTitle } from "@ui/dialog";
import { Input } from "@ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PMHResponseType } from "../pmh-types";

interface PMHRecordDialogProps {
  record: PMHResponseType;
  onClose: () => void; // ダイアログを閉じる関数を追加
}

type TextObjectType = {
  [key: string]: {
    value: string;
    isEditing: boolean;
  };
};

export const PMHRecordDialog = ({ record, onClose }: PMHRecordDialogProps) => {
  const defaultValues: z.infer<typeof pmhSchema> = {
    diseaseName: record.diseaseName,
    diagnosisDate: record.diagnosisDate ?? "",
    primaryCareProvider: record.primaryCareProvider ?? "",
    notes: record.notes ?? "",
  };
  const mapped = Object.entries(defaultValues).map(([key, value]) => {
    return [
      key,
      {
        [key]: value,
        isEditing: false,
      },
    ];
  });
  const defaultTextState: TextObjectType = Object.fromEntries(mapped);

  /* defaultTextStateの例
  {
    diseaseName: {diseaseName: '統合失調症', isEditing: false},
    diagnosisDate: {diagnosisDate: '2025-07-05', isEditing: false},
    primaryCareProvider: {primaryCareProvider: '', isEditing: false},
    notes: {notes: '', isEditing: false},
  }
  */

  const form = useForm<z.infer<typeof pmhSchema>>({
    resolver: zodResolver(pmhSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const [textObject, setTextObject] = useState(defaultTextState);

  const [isEditingAny, setIsEditingAny] = useState(false);

  useEffect(() => {
    //どれか一つでも編集したならsetIsEditingAnyをtrueに変更する。
    const hasEditing = Object.values(textObject as TextObjectType).some(
      (value) => value.isEditing
    );
    setIsEditingAny(hasEditing);
  }, [textObject]);

  const deletePMH = useDeletePMH();

  const handleEditMode = (
    formName: "diseaseName" | "diagnosisDate" | "primaryCareProvider" | "notes"
  ) => {
    const newTextObject = { ...textObject };
    newTextObject[formName].isEditing = !newTextObject[formName].isEditing;
    setTextObject(newTextObject);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${record.diseaseName}"?\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    await deletePMH.mutateAsync(record.id);
    onClose();
  };

  return (
    <DialogContent showCloseButton={false}>
      <VisuallyHidden>
        <DialogTitle>Past Medical History Record</DialogTitle>
      </VisuallyHidden>
      <Form {...form}>
        <form className="space-y-4">
          <div>
            <h3>Disease Name</h3>
            <FormField
              control={form.control}
              name="diseaseName"
              render={({ field }) => (
                <FormItem>
                  {textObject.diseaseName.isEditing ? (
                    <FormControl>
                      <Input
                        {...field}
                        onBlur={() => handleEditMode("diseaseName")}
                        autoFocus
                        onChange={(e) =>
                          handleValueChange("diseaseName", e.target.value)
                        }
                      />
                    </FormControl>
                  ) : (
                    <p onClick={() => handleEditMode("diseaseName")}>
                      {textObject.diseaseName.value}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
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

          <div className="flex items-center justify-between">
            <Button
              className="w-30 bg-blue-500 hover:bg-blue-400"
              disabled={!isEditingAny}
            >
              Save
            </Button>
            <DialogClose asChild>
              <Button
                className="w-30 bg-yellow-400 hover:bg-yellow-300 text-black"
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
          <Button type="button" onClick={handleDelete} className="w-full">
            Delete
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

import { useGetUser } from "@/features/auth/hooks/use-get-user";
import { useDeleteFamilyHistory } from "@/features/family-history/api/use-delete-family-history";
import { useUpdateFamilyHistory } from "@/features/family-history/api/use-update-family-history";
import { initializeTextObject } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@ui/button";
import { DialogContent, DialogTitle } from "@ui/dialog";
import { Form } from "@ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FamilyHistoryFieldNames,
  FamilyHistoryResponseType,
  FamilyHistorySchemaType,
  familyHistorySchema,
} from "../family-history-types-and-schema";
import { DialogFormField } from "./dialog-form-field";
interface FamilyHistoryRecordDialogProps {
  record: FamilyHistoryResponseType;
  onClose: () => void; // ダイアログを閉じる関数
}

//useStateで管理するobjectです。それぞれのfield(diseaseName, relationship, notes)の値と編集状態を管理し、一度でも編集が行われたかどうかをcheckします。
type TextObjectType = {
  [key in FamilyHistoryFieldNames]: {
    value: string;
    isEditing: boolean;
  };
} & {
  hasEdited: boolean;
};

export const FamilyHistoryRecordDialog = ({
  record,
  onClose,
}: FamilyHistoryRecordDialogProps) => {
  //defaultValueはuseFormに渡すための初期値。
  //defaultTextStateはuseStateに渡すための初期値。
  const user = useGetUser();

  //
  const createInitialState = (): FamilyHistorySchemaType => {
    return {
      diseaseName: record.diseaseName,
      relationship: record.relationship,
      notes: record.notes ?? "",
    };
  };

  const defaultTextState = initializeTextObject(createInitialState());
  /* defaultTextStateの例
  {
    diseaseName: {value: '糖尿病', isEditing: false},
    relationship: {value: '母', isEditing: false},
    notes: {value: '2003年診断', isEditing: false},
    hasEdited: false,
  }
  */
  const [textObject, setTextObject] =
    useState<TextObjectType>(defaultTextState);

  useEffect(() => {
    //componentがrenderされたときにtextObjectを初期化する。
    //これがないと、dialogを閉じた後、再度開いた際に前回のtextObjectが保持されている。
    setTextObject(defaultTextState);
  }, []);

  const form = useForm<FamilyHistorySchemaType>({
    resolver: zodResolver(familyHistorySchema),
    defaultValues: createInitialState(),
    mode: "onChange",
  });

  const handleClose = () => {
    if (textObject.hasEdited) {
      const confirmed = window.confirm("Changes will not saved. Are you sure?");
      if (!confirmed) return;
    }
    setTextObject(defaultTextState);
    onClose();
  };

  const updateFamilyHistory = useUpdateFamilyHistory(); //tanstack-query useMutation参照

  const handleSave = async (formData: FamilyHistorySchemaType) => {
    if (!user) {
      throw new Error("Unauthorized user");
    }
    const data = {
      ...formData,
      userId: user.uid,
    };
    await updateFamilyHistory.mutateAsync({ data, id: record.id });
    onClose();
  };

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
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
          <div>
            <h3>Disease Name</h3>
            <DialogFormField
              form={form}
              formName="diseaseName"
              textObject={textObject}
              setTextObject={setTextObject}
            />
          </div>

          <div>
            <h3>Relationship</h3>
            <DialogFormField
              form={form}
              formName="relationship"
              textObject={textObject}
              setTextObject={setTextObject}
            />
          </div>

          <div>
            <h3>Notes</h3>
            <DialogFormField
              form={form}
              formName="notes"
              textObject={textObject}
              setTextObject={setTextObject}
              type="textarea"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              className="w-30 bg-blue-500 hover:bg-blue-400"
              disabled={!textObject.hasEdited}
            >
              Save
            </Button>
            <Button
              className="w-30 bg-yellow-400 hover:bg-yellow-300 text-black"
              type="button"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </form>
      </Form>
      <Button type="button" className="w-full" onClick={handleDelete}>
        Delete
      </Button>
    </DialogContent>
  );
};

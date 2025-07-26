import { useGetUser } from "@/features/auth/hooks/use-get-user";
import { useDeletePMH } from "@/features/pmh/api/use-delete-pmh";
import { useUpdatePMH } from "@/features/pmh/api/use-update-pmh";
import { DialogFormField } from "@/features/pmh/components/dialog-form-field";
import {
  PMHFieldNames,
  PMHResponseType,
  pmhSchema,
  PMHSchemaType,
} from "@/features/pmh/pmh-types-and-schema";
import { initializeTextObject } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@ui/button";
import { DialogContent, DialogTitle } from "@ui/dialog";
import { Form } from "@ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PMHRecordDialogProps {
  record: PMHResponseType;
  onClose: () => void; // ダイアログを閉じる関数を追加
}

//useStateで管理するobjectです。それぞれのfield(diseaseName, diagnosisDate, primaryCareProvider, notes)の値と編集状態を管理し、一度でも編集が行われたかどうかをcheckします。
type TextObjectType = {
  [key in PMHFieldNames]: {
    value: string;
    isEditing: boolean;
  };
} & {
  hasEdited: boolean;
};

export const PMHRecordDialog = ({ record, onClose }: PMHRecordDialogProps) => {
  //defaultValueはuseFormに渡すための初期値。
  //defaultTextStateはuseStateに渡すための初期値。textObjectにより、fieldが編集状態かどうかを管理する。
  const user = useGetUser();
  const createInitialState = (): PMHSchemaType => {
    return {
      diseaseName: record.diseaseName,
      diagnosisDate: record.diagnosisDate ?? "",
      primaryCareProvider: record.primaryCareProvider ?? "",
      notes: record.notes ?? "",
    };
  };
  const defaultTextState = initializeTextObject(createInitialState());
  /* defaultTextStateの例
  {
    diseaseName: {value: '統合失調症', isEditing: false},
    diagnosisDate: {value: '2025-07-05', isEditing: false},
    primaryCareProvider: {value: '広島大学病院', isEditing: false},
    notes: {value: 'オランザピンで使用中', isEditing: false},
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

  const form = useForm<PMHSchemaType>({
    resolver: zodResolver(pmhSchema),
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

  const updatePMH = useUpdatePMH(); //tanstack-query useMutation参照
  const handleSave = async (formData: PMHSchemaType) => {
    if (!user) {
      throw new Error("Unauthorized user");
    }
    const data = {
      ...formData,
      userId: user.uid,
    };
    await updatePMH.mutateAsync({ data, id: record.id });
    onClose();
  };

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
    <DialogContent showCloseButton={false}>
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
            <h3>Diagnosis Date</h3>
            <DialogFormField
              form={form}
              formName="diagnosisDate"
              textObject={textObject}
              setTextObject={setTextObject}
            />
          </div>
          <div>
            <h3>Primary Care Provider</h3>
            <DialogFormField
              form={form}
              formName="primaryCareProvider"
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
      <Button type="button" onClick={handleDelete} className="w-full">
        Delete
      </Button>
    </DialogContent>
  );
};

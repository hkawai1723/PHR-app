import { FamilyHistorySchemaType } from "@/features/family-history/family-history-types-and-schema";
import { FormControl, FormField, FormItem, FormMessage } from "@ui/form";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type FieldState = {
  value: string;
  isEditing: boolean;
};
type TextObjectType = {
  diseaseName: FieldState;
  relationship: FieldState;
  notes: FieldState;
  hasEdited: boolean;
};

interface Props {
  form: UseFormReturn<FamilyHistorySchemaType>;
  formName: keyof FamilyHistorySchemaType;
  textObject: TextObjectType;
  setTextObject: React.Dispatch<React.SetStateAction<TextObjectType>>;
  type?: "text" | "textarea";
}

export const DialogFormField = ({
  form,
  formName,
  textObject,
  setTextObject,
  type = "text",
}: Props) => {
  const handleEditMode = () => {
    setTextObject((prev: TextObjectType) => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        isEditing: !prev[formName].isEditing,
      },
    }));
  };

  const handleValueChange = (formValue: string) => {
    setTextObject((prev: TextObjectType) => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        value: formValue,
      },
      hasEdited: true, // #TODO: 冗長。何回か編集しても毎度hasEditedがtrueに変更される。一度変更したらあとは変更不要ではある。
    }));
    form.setValue(formName, formValue);
  };

  return (
    <FormField
      control={form.control}
      name={formName}
      render={({ field }) => (
        <FormItem>
          {textObject[formName].isEditing ? (
            <FormControl>
              {type === "text" ? (
                <Input
                  {...field}
                  onBlur={() => handleEditMode()}
                  autoFocus
                  onChange={(e) => handleValueChange(e.target.value)}
                  value={textObject[formName].value}
                />
              ) : (
                <Textarea
                  {...field}
                  onBlur={() => handleEditMode()}
                  autoFocus
                  onChange={(e) => handleValueChange(e.target.value)}
                  value={textObject[formName].value}
                />
              )}
            </FormControl>
          ) : (
            <p onClick={() => handleEditMode()}>
              {textObject[formName].value ? textObject[formName].value : <br />}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

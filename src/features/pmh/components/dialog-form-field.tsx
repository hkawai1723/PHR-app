import { PMHSchemaType } from "@/features/pmh/pmh-types-and-schema";
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
  diagnosisDate: FieldState;
  primaryCareProvider: FieldState;
  notes: FieldState;
  hasEdited: boolean; // ✅ booleanのまま
};

interface Props {
  form: UseFormReturn<PMHSchemaType>;
  formName: keyof PMHSchemaType;
  textObject: TextObjectType;
  setTextObject: React.Dispatch<React.SetStateAction<TextObjectType>>;
  type?: "text" | "date" | "textarea";
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
      hasEdited: true,
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

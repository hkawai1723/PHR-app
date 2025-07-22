"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetUser } from "@/features/auth/hooks/use-get-user";
import { useCreateFamilyHistory } from "@/features/family-history/api/use-create-family-history";
import { familyHistorySchema } from "@/features/family-history/family-history-types-and-schema";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FamilyHistoryFormType = z.infer<typeof familyHistorySchema>;
const DEFAULT_VALUES: FamilyHistoryFormType = {
  diseaseName: "",
  relationship: "",
  notes: "",
};

export const FamilyHistoryForm = () => {
  const user = useGetUser();
  const form = useForm<FamilyHistoryFormType>({
    resolver: zodResolver(familyHistorySchema),
    defaultValues: DEFAULT_VALUES,
  });
  const createFamilyHistory = useCreateFamilyHistory();

  const onSubmit = async (data: FamilyHistoryFormType) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const requestData = {
        ...data,
        userId: user.uid, //TODO: 将来的に他人のFamilyHistoryを登録できるようにする。
      };
      createFamilyHistory.mutateAsync(requestData, {
        onSuccess: () => {
          form.reset();
        },
      });
    } catch (error) {
      //useCreateFamilyHistoryのonErrorでtoast表示される。
      console.error("Error submitting FamilyHistory form:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
        noValidate
      >
        <FormField
          control={form.control}
          name="diseaseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Disease</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Relationship</FormLabel>
              <FormControl>
                <Input {...field} placeholder={`Example: "${formatDate()}"`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-4"
          disabled={createFamilyHistory.isPending}
        >
          {createFamilyHistory.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
};

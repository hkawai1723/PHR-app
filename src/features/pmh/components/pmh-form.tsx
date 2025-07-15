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
import { useCreatePMH } from "@/features/pmh/api/use-create-pmh";
import { formatDate, pmhSchema } from "@/features/pmh/pmh-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PMHFormType = z.infer<typeof pmhSchema>;
const DEFAULT_VALUES: PMHFormType = {
  diseaseName: "",
  diagnosisDate: "",
  primaryCareProvider: "",
  notes: "",
};

export const PMHForm = () => {
  const user = useGetUser();
  const form = useForm<PMHFormType>({
    resolver: zodResolver(pmhSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const createPMH = useCreatePMH();

  const onSubmit = async (data: PMHFormType) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const requestData = {
        ...data,
        userId: user.uid, //TODO: 将来的に他人のPMHを登録できるようにする。
      };
      createPMH.mutateAsync(requestData, {
        onSuccess: () => {
          form.reset();
        },
      });
    } catch (error) {
      //useCreatePMHのonErrorでtoast表示される。
      console.error("Error submitting PMH form:", error);
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
          name="diagnosisDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Diagnosis Date</FormLabel>
              <FormControl>
                <Input {...field} placeholder={`Example: "${formatDate()}"`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="primaryCareProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">
                Primary Care Provider for the Disease
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="The place where you go for the disease."
                />
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
        <Button type="submit" className="mt-4" disabled={createPMH.isPending}>
          {createPMH.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
};

import { FamilyHistoryResponseType } from "@/features/family-history/family-history-types-and-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DeleteFamilyHistory = async (id: string) => {
  const response = await fetch(`/api/past-medical-history/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete Past Medical History");
  }
  const data: FamilyHistoryResponseType = await response.json();
  return data;
};

export const useDeleteFamilyHistory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    FamilyHistoryResponseType,
    Error,
    string,
    { previousFamilyHistoryList: FamilyHistoryResponseType[] | undefined }
  >({
    mutationFn: async (id) => {
      const result = await DeleteFamilyHistory(id);
      return result;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["pmh-list"] });
      const previousFamilyHistoryList = queryClient.getQueryData<
        FamilyHistoryResponseType[]
      >(["pmh-list"]);

      //楽観的更新: idが一致するFamilyHistoryを削除
      queryClient.setQueryData<FamilyHistoryResponseType[]>(
        ["pmh-list"],
        (oldFamilyHistoryList) => {
          if (!oldFamilyHistoryList) return [];
          return oldFamilyHistoryList.filter((pmh) => pmh.id !== id);
        }
      );

      return { previousFamilyHistoryList };
    },
    onSuccess: () => {
      toast.success("The past medical history is successfully deleted.");
    },
    onError: (error, deletedId, context) => {
      console.error(error);
      toast.error("Failed to delete the past medical history.");
      if (context?.previousFamilyHistoryList) {
        queryClient.setQueryData(
          ["pmh-list"],
          context.previousFamilyHistoryList
        );
      }
    },
  });
  return mutation;
};

import { FamilyHistoryResponseType } from "@/features/family-history/family-history-types-and-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DeleteFamilyHistory = async (id: string) => {
  const response = await fetch(`/api/family-history/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete family history");
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
      await queryClient.cancelQueries({ queryKey: ["family-history-list"] });
      const previousFamilyHistoryList = queryClient.getQueryData<
        FamilyHistoryResponseType[]
      >(["family-history-list"]);

      //楽観的更新: idが一致するFamilyHistoryを削除
      queryClient.setQueryData<FamilyHistoryResponseType[]>(
        ["family-history-list"],
        (oldFamilyHistoryList) => {
          if (!oldFamilyHistoryList) return [];
          return oldFamilyHistoryList.filter(
            (familyHistory) => familyHistory.id !== id
          );
        }
      );

      return { previousFamilyHistoryList };
    },
    onSuccess: () => {
      toast.success("The family history is successfully deleted.");
    },
    onError: (error, deletedId, context) => {
      console.error(error);
      toast.error("Failed to delete the family history.");
      if (context?.previousFamilyHistoryList) {
        queryClient.setQueryData(
          ["family-history-list"],
          context.previousFamilyHistoryList
        );
      }
    },
  });
  return mutation;
};

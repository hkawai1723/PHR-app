import {
  FamilyHistoryRequestType,
  FamilyHistoryResponseType,
} from "@/features/family-history/family-history-types-and-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const UpdateFamilyHistory = async (
  request: FamilyHistoryRequestType,
  id: string
) => {
  const response = await fetch(`/api/family-history/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error("Failed to update Past Medical History");
  }
  const result = await response.json();
  return result.data;
};

export const useUpdateFamilyHistory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    FamilyHistoryResponseType,
    Error,
    { data: FamilyHistoryRequestType; id: string },
    { previousFamilyHistoryList: FamilyHistoryResponseType[] | undefined }
  >({
    mutationFn: async ({ data, id }) => {
      const result = await UpdateFamilyHistory(data, id);
      return result;
    },
    onMutate: async (newFamilyHistory) => {
      //楽観的更新の実装.
      await queryClient.cancelQueries({ queryKey: ["family-history-list"] });
      const previousFamilyHistoryList = queryClient.getQueryData<
        FamilyHistoryResponseType[]
      >(["family-history-list"]);

      queryClient.setQueryData<FamilyHistoryResponseType[]>(
        ["family-history-list"],
        (oldFamilyHistory) => {
          if (!oldFamilyHistory) return [];
          oldFamilyHistory.map((oldFamilyHistory) => {
            if (oldFamilyHistory.id === newFamilyHistory.id) {
              return {
                ...oldFamilyHistory,
                ...newFamilyHistory.data,
                updatedAt: new Date().toISOString(),
              };
            }
            return oldFamilyHistory;
          });
        }
      );
      return { previousFamilyHistoryList };
    },
    onSuccess: (updatedFamilyHistory) => {
      //成功時, サーバーから正確なデータを取得。
      //引数updatedFamilyHistoryは、サーバーから返された新しいFamilyHistoryのデータ。
      queryClient.setQueryData<FamilyHistoryResponseType[]>(
        ["family-history-list"],
        (oldFamilyHistory) => {
          if (!oldFamilyHistory) return [updatedFamilyHistory];

          return oldFamilyHistory.map((item) =>
            item.id === updatedFamilyHistory.id ? updatedFamilyHistory : item
          );
        }
      );

      toast.success("FamilyHistory updated successfully!");
    },
    onError: (error, newFamilyHistory, context) => {
      console.error("Error updating family history :", error);
      toast.error("Failed to update family history");

      // エラーが発生した場合、楽観的更新を元に戻す
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

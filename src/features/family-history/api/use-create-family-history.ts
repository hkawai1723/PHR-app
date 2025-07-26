import {
  FamilyHistoryRequestType,
  FamilyHistoryResponseType,
} from "@/features/family-history/family-history-types-and-schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";

export const CreateFamilyHistory = async (
  request: FamilyHistoryRequestType
) => {
  const response = await fetch("/api/family-history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error("Failed to create Past Medical History");
  }
  const data: FamilyHistoryResponseType = await response.json();
  return data;
};

export const useCreateFamilyHistory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    FamilyHistoryResponseType,
    Error,
    FamilyHistoryRequestType,
    { previousFamilyHistoryList: FamilyHistoryResponseType[] | undefined }
  >({
    mutationFn: async (data) => {
      const result = await CreateFamilyHistory(data);
      return result;
    },
    onMutate: async (newFamilyHistory) => {
      //onMutateは、ミューテーションが開始される前に呼び出される関数。
      //楽観的更新 Optimistic Updateの実装
      //まず現在のクエリーをキャンセルすることでrefetchで古いデータで上書きされるのを防ぐ。
      await queryClient.cancelQueries({ queryKey: ["family-history-list"] });
      const previousFamilyHistoryList = queryClient.getQueryData<
        FamilyHistoryResponseType[]
      >(["family-history-list"]);
      //楽観的更新：以前のFamilyHistoryListに新しいFamilyHistoryを一時的なIDを付与して追加。それを一時的にキャッシュに保存することで、ユーザーに即座に反映されるようにする。
      //保存に成功すれば、キャッシュを正確なものに更新し、失敗した場合はrollbackする。
      queryClient.setQueryData<FamilyHistoryResponseType[]>(
        ["family-history-list"],
        (oldFamilyHistory) => {
          const tempFamilyHistory: FamilyHistoryResponseType = {
            ...newFamilyHistory,
            id: `temp-id-${Date.now()}`, // 一時的なIDを生成
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            writtenBy: newFamilyHistory.userId,
          };
          return oldFamilyHistory
            ? [tempFamilyHistory, ...oldFamilyHistory]
            : [tempFamilyHistory];
        }
      );

      return { previousFamilyHistoryList };
    },
    onSuccess: (data) => {
      //成功時, サーバーから正確なデータを取得。
      //引数dataは、サーバーから返された新しいFamilyHistoryのデータ。
      //楽観的更新で追加した一時的なIDを持つFamilyHistory、つまりidがtemp-idで始まるものは新しいdataで置き換える。そうでないものはそのまま。
      queryClient.setQueryData(
        ["family-history-list"],
        (old: FamilyHistoryResponseType[] | undefined) => {
          if (!old) return [data];

          // 一時的なIDを持つアイテムを実際のデータに置き換え
          return old.map((item) => {
            if (
              item.id.startsWith("temp-") &&
              item.diseaseName === data.diseaseName
            ) {
              return data;
            }
            return item;
          });
        }
      );

      toast.success("FamilyHistory created successfully!");
    },
    onError: (error, newFamilyHistory, context) => {
      console.error("Error creating FamilyHistory:", error);
      toast.error("Failed to create Past Medical History");

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

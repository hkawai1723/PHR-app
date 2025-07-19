import { PMHRequestType, PMHResponseType } from "@/features/pmh/pmh-types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";

export const CreatePMH = async (request: PMHRequestType) => {
  const response = await fetch("/api/past-medical-history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error("Failed to create Past Medical History");
  }
  const data: PMHResponseType = await response.json();
  return data;
};

export const useCreatePMH = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    PMHResponseType,
    Error,
    PMHRequestType,
    { previousPMHList: PMHResponseType[] | undefined }
  >({
    mutationFn: async (data) => {
      const result = await CreatePMH(data);
      return result;
    },
    onMutate: async (newPMH) => {
      //onMutateは、ミューテーションが開始される前に呼び出される関数。
      //楽観的更新 Optimistic Updateの実装
      //まず現在のクエリーをキャンセルすることでrefetchで古いデータで上書きされるのを防ぐ。
      await queryClient.cancelQueries({ queryKey: ["pmh-list"] });
      const previousPMHList = queryClient.getQueryData<PMHResponseType[]>([
        "pmh-list",
      ]);
      //楽観的更新：以前のPMHListに新しいPMHを一時的なIDを付与して追加。それを一時的にキャッシュに保存することで、ユーザーに即座に反映されるようにする。
      //保存に成功すれば、キャッシュを正確なものに更新し、失敗した場合はrollbackする。
      queryClient.setQueryData<PMHResponseType[]>(["pmh-list"], (oldPMH) => {
        const tempPMH: PMHResponseType = {
          ...newPMH,
          id: `temp-id-${Date.now()}`, // 一時的なIDを生成
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          writtenBy: newPMH.userId,
        };
        return oldPMH ? [tempPMH, ...oldPMH] : [tempPMH];
      });

      return { previousPMHList };
    },
    onSuccess: (data) => {
      //成功時, サーバーから正確なデータを取得。
      //引数dataは、サーバーから返された新しいPMHのデータ。
      //楽観的更新で追加した一時的なIDを持つPMH、つまりidがtemp-idで始まるものは新しいdataで置き換える。そうでないものはそのまま。
      queryClient.setQueryData(
        ["pmh-list"],
        (old: PMHResponseType[] | undefined) => {
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

      toast.success("PMH created successfully!");
    },
    onError: (error, newPMH, context) => {
      console.error("Error creating PMH:", error);
      toast.error("Failed to create Past Medical History");

      // エラーが発生した場合、楽観的更新を元に戻す
      if (context?.previousPMHList) {
        queryClient.setQueryData(["pmh-list"], context.previousPMHList);
      }
    },
  });
  return mutation;
};

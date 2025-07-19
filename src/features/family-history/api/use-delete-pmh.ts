import { PMHResponseType } from "@/features/pmh/pmh-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DeletePMH = async (id: string) => {
  const response = await fetch(`/api/past-medical-history/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete Past Medical History");
  }
  const data: PMHResponseType = await response.json();
  return data;
};

export const useDeletePMH = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    PMHResponseType,
    Error,
    string,
    { previousPMHList: PMHResponseType[] | undefined }
  >({
    mutationFn: async (id) => {
      const result = await DeletePMH(id);
      return result;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["pmh-list"] });
      const previousPMHList = queryClient.getQueryData<PMHResponseType[]>([
        "pmh-list",
      ]);

      //楽観的更新: idが一致するPMHを削除
      queryClient.setQueryData<PMHResponseType[]>(
        ["pmh-list"],
        (oldPMHList) => {
          if (!oldPMHList) return [];
          return oldPMHList.filter((pmh) => pmh.id !== id);
        }
      );

      return { previousPMHList };
    },
    onSuccess: () => {
      toast.success("The past medical history is successfully deleted.");
    },
    onError: (error, deletedId, context) => {
      console.error(error);
      toast.error("Failed to delete the past medical history.");
      if (context?.previousPMHList) {
        queryClient.setQueryData(["pmh-list"], context.previousPMHList);
      }
    },
  });
  return mutation;
};

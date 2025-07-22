import {
    PMHRequestType,
    PMHResponseType,
} from "@/features/pmh/pmh-types-and-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const UpdatePMH = async (request: PMHRequestType, id: string) => {
  const response = await fetch(`/api/past-medical-history/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to update past medical history.");
  }

  const result = await response.json();
  return result.data;
};

export const useUpdatePMH = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    PMHResponseType,
    Error,
    { data: PMHRequestType; id: string },
    { previousPMHList: PMHResponseType[] | undefined }
  >({
    mutationFn: async ({ data, id }) => {
      const result = await UpdatePMH(data, id);
      return result;
    },
    onMutate: async (newPMH) => {
      //楽観的更新の実装
      await queryClient.cancelQueries({ queryKey: ["pmh-list"] });

      const previousPMHList = queryClient.getQueryData<PMHResponseType[]>([
        "pmh-list",
      ]);

      queryClient.setQueryData<PMHResponseType[]>(
        ["pmh-list"],
        (oldPMHList) => {
          if (!oldPMHList) return [];
          oldPMHList?.map((oldPMH) => {
            if (oldPMH.id === newPMH.id) {
              return {
                ...oldPMH,
                ...newPMH.data,
                updatedAt: new Date().toISOString(),
              };
            }
            return oldPMH;
          });
        }
      );

      return { previousPMHList };
    },
    onSuccess: (updatedPMH) => {
      queryClient.setQueryData<PMHResponseType[]>(
        ["pmh-list"],
        (oldPMHList) => {
          if (!oldPMHList) return [updatedPMH];
          return oldPMHList.map((pmh) =>
            pmh.id === updatedPMH.id ? updatedPMH : pmh
          );
        }
      );
      toast.success("Past medical history updated successfully!");
    },
    onError: (error, variables, context) => {
      console.error("Error on updating PMH: ", error);
      toast.error("Failed to update PMH");

      if (context?.previousPMHList) {
        queryClient.setQueryData(["pmh-list"], context.previousPMHList);
      }
    },
  });

  return mutation;
};

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
    throw new Error("Failed to create Family History"); // ✅ メッセージ修正
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
    {
      previousFamilyHistoryList: FamilyHistoryResponseType[] | undefined;
      tempId: string;
    }
  >({
    mutationFn: async (data) => {
      const result = await CreateFamilyHistory(data);
      return result;
    },
    onMutate: async (newFamilyHistory) => {
      await queryClient.cancelQueries({ queryKey: ["family-history-list"] });
      const previousFamilyHistoryList = queryClient.getQueryData<
        FamilyHistoryResponseType[]
      >(["family-history-list"]);

      const tempId = `temp-id-${Date.now()}`;
      const tempFamilyHistory: FamilyHistoryResponseType = {
        ...newFamilyHistory,
        id: tempId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        writtenBy: newFamilyHistory.userId,
      };

      queryClient.setQueryData<FamilyHistoryResponseType[]>(
        ["family-history-list"],
        (oldFamilyHistory) => {
          return oldFamilyHistory
            ? [tempFamilyHistory, ...oldFamilyHistory]
            : [tempFamilyHistory];
        }
      );

      return { previousFamilyHistoryList, tempId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-history-list"] });

      toast.success("Family History created successfully!");
    },
    onError: (error, newFamilyHistory, context) => {
      console.error("Error creating FamilyHistory:", error);
      toast.error("Failed to create Family History"); // ✅ メッセージ修正

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

import { FamilyHistoryResponseType } from "@/features/family-history/family-history-types-and-schema";
import { useQuery } from "@tanstack/react-query";

export const getFamilyHistoryList = async (): Promise<
  FamilyHistoryResponseType[]
> => {
  const result = await fetch("/api/family-history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Response status:", result.status);

  if (!result.ok) {
    const errorText = await result.text();
    console.error(errorText);
    throw new Error("Failed to fetch family history list");
  }
  const response = await result.json();

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.error || "Unknown error");
  }
};

export function useGetFamilyHistoryList() {
  return useQuery({
    queryKey: ["family-history-list"],
    queryFn: getFamilyHistoryList,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
}

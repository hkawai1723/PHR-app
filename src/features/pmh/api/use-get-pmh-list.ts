import { PMHResponseType } from "@/features/pmh/pmh-types-and-schema";
import { useQuery } from "@tanstack/react-query";

export const getPMHList = async (): Promise<PMHResponseType[]> => {
  const result = await fetch("/api/past-medical-history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Response status:", result.status);

  if (!result.ok) {
    const errorText = await result.text();
    console.error(errorText);
    throw new Error("Failed to fetch Past Medical History list");
  }
  const response = await result.json();

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.error || "Unknown error");
  }
};

export function useGetPMHList() {
  return useQuery({
    queryKey: ["pmh-list"],
    queryFn: getPMHList,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
}

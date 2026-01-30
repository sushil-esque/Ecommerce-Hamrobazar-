import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/allCategory";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

import { useQuery } from "@tanstack/react-query";

export const useSchalorships = () => {
  return useQuery({
    queryKey: ["schalorships"],
    queryFn: async () => {
      const response = await fetch("/api/schalorships");
      if (!response.ok) {
        throw new Error("Failed to fetch schalorships");
      }
      return response.json();
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });
};

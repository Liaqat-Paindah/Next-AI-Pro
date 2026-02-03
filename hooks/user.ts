import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      try {
        const response = await axios.get("/api/user");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

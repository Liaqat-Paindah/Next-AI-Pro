import { useQuery } from "@tanstack/react-query";
import axios from 'axios'

export const usescholarships = () => {
  return useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const response = await fetch("/api/scholarships");
      if (!response.ok) {
        throw new Error("Failed to fetch scholarships");
      }
      return response.json();
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};



export const useSearchScholarship = (
  search: string,
  title?: string,
  scholarship_type?: string,
  level?: string,
  country?: string,
  fieldOfStudy?: string
) => {
  return useQuery({
    queryKey: ["SearchScholarship", search, title, scholarship_type, level, country, fieldOfStudy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (title) params.append("title", title);
      if (scholarship_type) params.append("type", scholarship_type);
      if (level) params.append("level", level);
      if (country) params.append("country", country);
      if (fieldOfStudy) params.append("fieldOfStudy", fieldOfStudy);

      const response = await axios.get(`/api/scholarships/search?${params.toString()}`);

      if (!response.data) {
        throw new Error("Failed to fetch scholarships");
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // optional caching
  });
};
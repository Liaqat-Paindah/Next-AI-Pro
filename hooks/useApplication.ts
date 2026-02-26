import { PersonalInfoFormData } from "@/types/application";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const UsePersonalInformation = () => {
  return useMutation({
    mutationKey: ["UsePersonalInformation"],
    mutationFn: async (data: PersonalInfoFormData) => {
      const response = await axios.get(`/api/application`, {
        data,
      });
      if (!response.data) {
        throw new Error("Failed to create applicant information");
      }
      return response.data;
    },
  });
};

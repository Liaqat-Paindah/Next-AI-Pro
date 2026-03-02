import {
  EducationFormDataField,
  PersonalInfoFormData,
} from "@/types/application";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const UsePersonalInformation = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["UsePersonalInformation"],
    mutationFn: async (data: PersonalInfoFormData) => {
      const response = await axios.post(`/api/application`, data);
      if (!response.data) {
        throw new Error("Failed to create applicant information");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Personal information has been successfully saved");
      router.push("/dashboard/applicants/educationStep");
    },
    onError: () => {
      toast.error(`Failed to save personal information`);
    },
  });
};

export const UseEducationInformation = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["UsePersonalInformation"],
    mutationFn: async (data: EducationFormDataField) => {
      const response = await axios.post(`/api/application/education`, data);
      if (!response.data) {
        throw new Error("Failed to create applicant information");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Educational information has been successfully saved");
      router.push("/dashboard/applicants/educationStep");
    },
    onError: () => {
      toast.error(`Failed to save personal information`);
    },
  });
};

export const UseGetApplicants = (id: string | undefined) => {
  return useQuery({
    queryKey: ["UseGetApplicants"],
    queryFn: async () => {
      const response = await axios.get(`/api/application/${id}`);
      if (!response.data) {
        throw new Error("Failed to fetch Applicantion");
      }
      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

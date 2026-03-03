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
      const formData = new FormData();

      const appendText = (key: string, value: unknown) => {
        if (value === undefined || value === null) {
          return;
        }
        formData.append(key, String(value));
      };

      const appendFile = (key: string, value: unknown) => {
        if (value instanceof File && value.size > 0) {
          formData.append(key, value, value.name);
        }
      };

      appendText("userId", data.userId);
      appendText("level", data.level);

      if (data.highSchoolEducation && data.highSchoolEducation.length > 0) {
        data.highSchoolEducation.forEach((item, index) => {
          const prefix = `highSchoolEducation[${index}]`;
          appendText(`${prefix}[fieldOfStudy]`, item.fieldOfStudy);
          appendText(`${prefix}[institutionName]`, item.institutionName);
          appendText(`${prefix}[gpa]`, item.gpa);
          appendText(`${prefix}[academicRank]`, item.academicRank);
          appendText(`${prefix}[academic_gap]`, item.academic_gap);
          appendText(`${prefix}[startDate]`, item.startDate);
          appendText(`${prefix}[graduationDate]`, item.graduationDate);
          appendText(`${prefix}[finalExamYear]`, item.finalExamYear);
          appendText(`${prefix}[finalExamScore]`, item.finalExamScore);
          appendFile(`${prefix}[diplomaFile]`, item.diplomaFile);
          appendFile(`${prefix}[transcriptFile]`, item.transcriptFile);
        });
      }

      if (data.bachelorEducation && data.bachelorEducation.length > 0) {
        data.bachelorEducation.forEach((item, index) => {
          const prefix = `bachelorEducation[${index}]`;
          appendText(`${prefix}[fieldOfStudy]`, item.fieldOfStudy);
          appendText(`${prefix}[institutionName]`, item.institutionName);
          appendText(`${prefix}[gpa]`, item.gpa);
          appendText(`${prefix}[academicRank]`, item.academicRank);
          appendText(`${prefix}[academic_gap]`, item.academic_gap);
          appendText(`${prefix}[startDate]`, item.startDate);
          appendText(`${prefix}[graduationDate]`, item.graduationDate);
          appendText(`${prefix}[thesisTopic]`, item.thesisTopic);
          appendFile(`${prefix}[thesisFile]`, item.thesisFile);
          appendFile(`${prefix}[diplomaFile]`, item.diplomaFile);
          appendFile(`${prefix}[transcriptFile]`, item.transcriptFile);
        });
      }

      if (data.masterEducation) {
        const prefix = "masterEducation";
        appendText(`${prefix}[fieldOfStudy]`, data.masterEducation.fieldOfStudy);
        appendText(
          `${prefix}[institutionName]`,
          data.masterEducation.institutionName,
        );
        appendText(`${prefix}[gpa]`, data.masterEducation.gpa);
        appendText(`${prefix}[academicRank]`, data.masterEducation.academicRank);
        appendText(`${prefix}[startDate]`, data.masterEducation.startDate);
        appendText(
          `${prefix}[graduationDate]`,
          data.masterEducation.graduationDate,
        );
        appendText(`${prefix}[thesisTopic]`, data.masterEducation.thesisTopic);
        appendFile(`${prefix}[thesisFile]`, data.masterEducation.thesisFile);
        appendFile(`${prefix}[diplomaFile]`, data.masterEducation.diplomaFile);
        appendFile(
          `${prefix}[transcriptFile]`,
          data.masterEducation.transcriptFile,
        );
      }

      if (data.phdEducation) {
        const prefix = "phdEducation";
        appendText(`${prefix}[fieldOfStudy]`, data.phdEducation.fieldOfStudy);
        appendText(
          `${prefix}[institutionName]`,
          data.phdEducation.institutionName,
        );
        appendText(`${prefix}[gpa]`, data.phdEducation.gpa);
        appendText(`${prefix}[academicRank]`, data.phdEducation.academicRank);
        appendText(`${prefix}[startDate]`, data.phdEducation.startDate);
        appendText(
          `${prefix}[graduationDate]`,
          data.phdEducation.graduationDate,
        );
        appendText(`${prefix}[thesisTopic]`, data.phdEducation.thesisTopic);
        appendFile(`${prefix}[thesisFile]`, data.phdEducation.thesisFile);
        appendFile(`${prefix}[diplomaFile]`, data.phdEducation.diplomaFile);
        appendFile(
          `${prefix}[transcriptFile]`,
          data.phdEducation.transcriptFile,
        );
      }

      const response = await axios.post(`/api/application/education`, formData);
      
      if (!response.data) {
        throw new Error("Failed to create applicant information");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Educational information has been successfully saved");
      router.push("/dashboard/applicants/academicActivitiesStep");
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error(`Failed to save educational information`);
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

import { ConferencesPayload } from "@/components/dashboard/applicants/academicActivities/conferences";
import { ResearchProjectsPayload } from "@/components/dashboard/applicants/academicActivities/researchProjects";
import {
  AcademicArticlesPayload,
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
        appendText(
          `${prefix}[fieldOfStudy]`,
          data.masterEducation.fieldOfStudy,
        );
        appendText(
          `${prefix}[institutionName]`,
          data.masterEducation.institutionName,
        );
        appendText(`${prefix}[gpa]`, data.masterEducation.gpa);
        appendText(
          `${prefix}[academicRank]`,
          data.masterEducation.academicRank,
        );
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
      router.push("/dashboard/applicants/academicArticales");
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error(`Failed to save educational information ${error}`);
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

export const UseAcademicArticles = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["UseAcademicArticles"],
    mutationFn: async (data: AcademicArticlesPayload) => {
      const response = await axios.post(
        "/api/application/academicActivities",
        data,
      );
      if (!response.data) {
        throw new Error("Failed to save academic articles");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Academic articles saved successfully");
      router.push("/dashboard/applicants/researchProjects");
    },
    onError: (error) => {
      toast.error(`Failed to save academic articles ${error}`);
    },
  });
};

export const UseResearchProjects = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["UseResearchProjects"],
    mutationFn: async (data: ResearchProjectsPayload) => {
      const formData = new FormData();
      formData.append("hasResearchProjects", data.hasResearchProjects);
      formData.append("userId", data.userId || "");
      if (data.hasResearchProjects === "Yes") {
        formData.append(
          "projectsCount",
          data.researchProjects.length.toString(),
        );

        data.researchProjects.forEach((project, index) => {
          formData.append(`projects[${index}][title]`, project.title);
          if (project.file) {
            formData.append(`projects[${index}][file]`, project.file); // must be File object
          }
        });
      }
      const response = await axios.post(
        "/api/application/researchProjects",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!response.data) {
        throw new Error("Failed to save Research Project");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Research Project saved successfully");
      router.push("/dashboard/applicants/conferences");
    },
    onError: () => {
      toast.error("Failed to save Research Project");
    },
  });
};


export const UseConferences = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["UseConferences"],
    mutationFn: async (data: ConferencesPayload) => {
      const formData = new FormData();
      formData.append("hasConferences", data.hasConferences);
      formData.append("userId", data.userId || "");
      if (data.hasConferences === "Yes") {
        formData.append(
          "projectsCount",
          data.Conferences.length.toString(),
        );

        data.Conferences.forEach((project, index) => {
          formData.append(`projects[${index}][title]`, project.title);
          if (project.file) {
            formData.append(`projects[${index}][file]`, project.file); // must be File object
          }
        });
      }
      const response = await axios.post(
        "/api/application/Conferences",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!response.data) {
        throw new Error("Failed to save conference or seminars");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("conference or seminars saved successfully");
      router.push("/dashboard/applicants/conferences");
    },
    onError: () => {
      toast.error("Failed to save conference or seminars");
    },
  });
};

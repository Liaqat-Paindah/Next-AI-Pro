import { AcademicAwardsPayload } from "@/components/dashboard/applicants/academicActivities/academicAwards";
import { ConferencesPayload } from "@/components/dashboard/applicants/academicActivities/conferences";
import { LaboratoryActivitiesPayload } from "@/components/dashboard/applicants/academicActivities/laboratoryActivities";
import { ResearchSkillsPayload } from "@/components/dashboard/applicants/academicActivities/reseachSkills";
import { ResearchProjectsPayload } from "@/components/dashboard/applicants/academicActivities/researchProjects";
import { FinancialInfoPayload } from "@/components/dashboard/applicants/financialInformation/page";
import { HobbiesFormData } from "@/components/dashboard/applicants/hobbies/page";
import { SkillsPayload } from "@/components/dashboard/applicants/skills/page";
import { LanguageFormData } from "@/schema/languageSchema";
import { AcademicPreferencesData } from "@/types/academicPreferences";
import {
  AcademicArticlesPayload,
  EducationFormDataField,
  PersonalInfoFormData,
  SpecialConditionsFormData,
  VisionGoalsFormData,
} from "@/types/application";
import { AddressContactData } from "@/types/contactAddress";
import { StudyRequestData } from "@/types/studyRequest";
import { ActivitiesFormData } from "@/types/workExperience";
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
        formData.append("projectsCount", data.Conferences.length.toString());

        data.Conferences.forEach((project, index) => {
          formData.append(`projects[${index}][title]`, project.title);
          if (project.file) {
            formData.append(`projects[${index}][file]`, project.file); // must be File object
          }
        });
      }
      const response = await axios.post(
        "/api/application/conferences",
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
      router.push("/dashboard/applicants/laboratoryActivities");
    },
    onError: () => {
      toast.error("Failed to save conference or seminars");
    },
  });
};

export const UseLaboratoryActivities = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["UseLaboratoryActivities"],
    mutationFn: async (data: LaboratoryActivitiesPayload) => {
      const formData = new FormData();
      formData.append("hasLaboratoryActivities", data.hasLaboratoryActivities);
      formData.append("userId", data.userId || "");
      if (data.hasLaboratoryActivities === "Yes") {
        formData.append(
          "activitiesCount",
          data.laboratoryActivities.length.toString(),
        );

        data.laboratoryActivities.forEach((activity, index) => {
          formData.append(`activities[${index}][title]`, activity.title);
          if (activity.file) {
            formData.append(`activities[${index}][file]`, activity.file);
          }
        });
      }
      const response = await axios.post(
        "/api/application/laboratoryActivities",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!response.data) {
        throw new Error("Failed to save laboratory activities");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Laboratory activities saved successfully");
      router.push("/dashboard/applicants/researchSkills");
    },
    onError: () => {
      toast.error("Failed to save laboratory activities");
    },
  });
};

export const UseResearchSkills = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["UseResearchSkills"],
    mutationFn: async (data: ResearchSkillsPayload) => {
      const formData = new FormData();
      formData.append("hasResearchSkills", data.hasResearchSkills);
      formData.append("userId", data.userId || "");
      if (data.hasResearchSkills === "Yes") {
        formData.append("skillsCount", data.researchSkills.length.toString());

        data.researchSkills.forEach((skill, index) => {
          formData.append(`skills[${index}][title]`, skill.title);
          if (skill.file) {
            formData.append(`skills[${index}][file]`, skill.file); // must be File object
          }
        });
      }
      const response = await axios.post(
        "/api/application/researchSkills",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!response.data) {
        throw new Error("Failed to save research skills");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Research skills saved successfully");
      router.push("/dashboard/applicants/academicAwards"); // Update this route as needed
    },
    onError: () => {
      toast.error("Failed to save research skills");
    },
  });
};

export const UseAcademicAwards = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["UseAcademicAwards"],
    mutationFn: async (data: AcademicAwardsPayload) => {
      const formData = new FormData();
      formData.append("hasAcademicAwards", data.hasAcademicAwards);
      formData.append("userId", data.userId || "");
      if (data.hasAcademicAwards === "Yes") {
        formData.append("awardsCount", data.academicAwards.length.toString());

        data.academicAwards.forEach((award, index) => {
          formData.append(`awards[${index}][title]`, award.title);
          if (award.file) {
            formData.append(`awards[${index}][file]`, award.file); // must be File object
          }
        });
      }
      const response = await axios.post(
        "/api/application/academicAwards",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!response.data) {
        throw new Error("Failed to save academic awards");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Academic awards saved successfully");
      router.push("/dashboard/applicants/skills"); // Update this route as needed
    },
    onError: () => {
      toast.error("Failed to save academic awards");
    },
  });
};

export const UseSkills = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["UseSkills"],
    mutationFn: async (data: SkillsPayload) => {
      const formData = new FormData();
      formData.append("userId", data.userId);
      formData.append("hasComputerSkills", data.hasComputerSkills);
      formData.append("hasCommunicationSkills", data.hasCommunicationSkills);
      formData.append("hasMediaContentCreation", data.hasMediaContentCreation);
      formData.append("hasTeamworkSkills", data.hasTeamworkSkills);
      formData.append("hasLeadershipSkills", data.hasLeadershipSkills);
      formData.append("hasProblemSolving", data.hasProblemSolving);
      formData.append("hasTimeManagement", data.hasTimeManagement);
      formData.append("hasPresentationSkills", data.hasPresentationSkills);

      if (data.youtubeLink) {
        formData.append("youtubeLink", data.youtubeLink);
      }

      if (data.computerSkillsFile instanceof File) {
        formData.append("computerSkillsFile", data.computerSkillsFile);
      }

      const response = await axios.post("/api/application/skills", formData);

      if (!response.data) {
        throw new Error("Failed to save Professional Skills");
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Professional Skills saved successfully");
      router.push("/dashboard/applicants/language");
    },

    onError: (error) => {
      toast.error(`${error}` || "Failed to save Professional Skills");
    },
  });
};

export const useLanguage = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["useLanguage"],

    mutationFn: async (data: LanguageFormData) => {
      const formData = new FormData();

      formData.append("userId", data.userId || "");
      formData.append("englishLevel", data.englishLevel);
      formData.append("englishTest", data.englishTest || "");
      formData.append("nativeLanguage", data.nativeLanguage);

      if (data.englishTestScore) {
        formData.append("englishTestScore", data.englishTestScore);
      }

      if (data.foreignLanguage) {
        formData.append("foreignLanguage", data.foreignLanguage);
      }

      if (data.foreignLanguageLevel) {
        formData.append("foreignLanguageLevel", data.foreignLanguageLevel);
      }

      if (data.localLanguage) {
        formData.append("localLanguage", data.localLanguage);
      }

      if (data.localLanguageLevel) {
        formData.append("localLanguageLevel", data.localLanguageLevel);
      }

      if (data.studiedLanguage) {
        formData.append("studiedLanguage", data.studiedLanguage);
      }

      if (data.englishCertificate instanceof File) {
        formData.append("englishCertificate", data.englishCertificate);
      }

      const response = await axios.post(
        "/api/application/languageSkills",
        formData,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save language");
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Language information saved successfully");
      router.push("/dashboard/applicants/workExperience");
    },

    onError: (error) => {
      toast.error(error?.message || "Failed to save language information");
    },
  });
};

export const useActivities = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["useActivities"],
    mutationFn: async (data: ActivitiesFormData) => {
      const formData = new FormData();

      formData.append("userId", data.userId);

      data.activities.forEach((activity, index) => {
        formData.append(`activities[${index}][type]`, activity.type);

        if (activity.file) {
          formData.append(`activities[${index}][file]`, activity.file);
        }
      });

      const response = await axios.post(
        "/api/application/activities",
        formData,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save activities");
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Activities saved successfully");
      router.push("/dashboard/applicants/specialConditions");
    },

    onError: (error: Error) => {
      toast.error(error?.message || "Failed to save activities");
    },
  });
};

export const useSpecialConditions = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["useSpecialConditions"],
    mutationFn: async (
      data: SpecialConditionsFormData & { userId: string },
    ) => {
      const formData = new FormData();
      formData.append("userId", data.userId);
      if (data.specialDisease) {
        formData.append("specialDisease", data.specialDisease);
      }
      if (data.physicalDisability) {
        formData.append("physicalDisability", data.physicalDisability);
      }
      const response = await axios.post(
        "/api/application/specialConditions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to save special conditions",
        );
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Special conditions saved successfully");
      router.push("/dashboard/applicants/financialInformation");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to save special conditions");
    },
  });
};

export const useFinancialInfo = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["useFinancialInfo"],

    mutationFn: async (data: FinancialInfoPayload & { userId: string }) => {
      const formData = new FormData();
      formData.append("userId", data.userId);

      if (data.familyIncome) {
        formData.append("familyIncome", data.familyIncome);
      }

      if (data.tuitionAbility) {
        formData.append("tuitionAbility", data.tuitionAbility);
      }

      if (data.transportAbility) {
        formData.append("transportAbility", data.transportAbility);
      }

      const response = await axios.post(
        "/api/application/financialInformation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to save financial information",
        );
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Financial information saved successfully");
      router.push("/dashboard/applicants/hobbies"); // change to your next step
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to save financial information");
    },
  });
};

export const useHobbies = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["useHobbies"],
    mutationFn: async (data: HobbiesFormData & { userId: string }) => {
      const formData = new FormData();
      formData.append("userId", data.userId);
      if (data.favoriteSports) {
        formData.append("favoriteSports", data.favoriteSports);
      }
      if (data.leisureActivities) {
        formData.append("leisureActivities", data.leisureActivities);
      }
      const response = await axios.post("/api/application/hobbies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to save hobbies information",
        );
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Hobbies information saved successfully");
      router.push("/dashboard/applicants/visionGoals");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to save hobbies information");
    },
  });
};

export const useVisionGoals = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["useVisionGoals"],
    mutationFn: async (data: VisionGoalsFormData & { userId: string }) => {
      const formData = new FormData();
      formData.append("userId", data.userId);
      if (data.purposeOfEducation) {
        formData.append("purposeOfEducation", data.purposeOfEducation);
      }
      if (data.postStudyPlan) {
        formData.append("postStudyPlan", data.postStudyPlan);
      }
      const response = await axios.post(
        "/api/application/visionGoals",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save vision goals");
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Vision and Goals saved successfully");
      router.push("/dashboard/applicants/academicPreferences");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to save vision goals");
    },
  });
};

export const useAcademicPreferences = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["useAcademicPreferences"],
    mutationFn: async (data: AcademicPreferencesData & { userId: string }) => {
      const response = await axios.post(
        "/api/application/academicPreferences",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to save academic preferences",
        );
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Academic preferences saved successfully");
      router.push("/dashboard/applicants/addressContact");
    },

    onError: (error: Error) => {
      toast.error(error?.message || "Failed to save academic preferences");
    },
  });
};

export const useAddressContact = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["useAddressContact"],
    mutationFn: async (data: AddressContactData & { userId: string }) => {
      const response = await axios.post(
        "/api/application/addressContact",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to save address & contact information",
        );
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Address & contact information saved successfully");
      router.push("/dashboard/applicants/studyRequest");
    },

    onError: (error: Error) => {
      toast.error(
        error?.message || "Failed to save address & contact information",
      );
    },
  });
};

export const useStudyRequest = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["useStudyRequest"],
    mutationFn: async (data: StudyRequestData & { userId: string }) => {
      const response = await axios.post("/api/application/studyRequest", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to save study request information",
        );
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Study request information saved successfully");
      router.push("/dashboard/applicants/documents");
    },

    onError: (error: Error) => {
      toast.error(error?.message || "Failed to save study request information");
    },
  });
};

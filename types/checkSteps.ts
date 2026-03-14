// types/application.ts
import { Types } from "mongoose";

export interface PersonalInfo {
  age?: number;
  gender?: "Male" | "Female" | "Other";
  maritalStatus?: "Single" | "Married";
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  birthDate?: Date | string;
  nationality?: string;
  nationalId?: string;
  passportId?: string;
  dateofIssue?: Date | string;
  dataofExpire?: Date | string;
}

export interface Education {
  level?: "Master" | "Bachelor" | "PHD" | "High School";
  fieldOfStudy?: string;
  institutionName?: string;
  gpa?: number;
  academicRank?: string;
  startDate?: Date | string;
  graduationDate?: Date | string;
  educationGapExplanation?: string;
  thesisTopic?: string;
  thesisFileUrl?: string;
  diplomaFileUrl?: string;
  transcriptFileUrl?: string;
  finalExamYear?: number;
  finalExamScore?: number;
  majorSubjects?: string[];
  diplomaFile?: string;
  transcriptFile?: string;
  thesisFile?: string;
}

export interface Research {
  steps: string;
  hasArticles?: boolean;
  hasProjects?: boolean;
  hasConferences?: boolean;
  hasLabs?: boolean;
  hasResearchSkills?: boolean;
  hasAcademicAwards?: boolean;
  articles?: Array<{ title?: string; citation?: string; link?: string }>;
  projects?: Array<{ title?: string; fileUrl?: string }>;
  conferences?: Array<{ title?: string; fileUrl?: string }>;
  laboratoryActivities?: Array<{ title?: string; fileUrl?: string }>;
  academicAwards?: Array<{ title?: string; fileUrl?: string }>;
  researchSkills?: Array<{ title?: string; fileUrl?: string }>;
}

export interface Skills {
  steps: string;
  computerSkills?: { hasSkill?: boolean; fileUrl?: string };
  communicationSkills?: boolean;
  mediaContentCreation?: { hasSkill?: boolean; youtubeLink?: string };
  teamworkSkills?: boolean;
  leadershipSkills?: boolean;
  problemSolving?: boolean;
  timeManagement?: boolean;
  presentationSkills?: boolean;
}

export interface Languages {
  nativeLanguage?: string;
  english?: {
    level?: "Basic" | "Intermediate" | "Advanced" | "Fluent";
    test?: "None" | "IELTS" | "TOEFL" | "Duolingo";
    score?: string;
    certificateUrl?: string;
  };
  foreignLanguage?: { language?: string };
  localLanguage?: { language?: string };
}

export interface Activity {
  type?: string;
  fileUrl?: string;
}

export interface Health {
  specialDiseases?: string;
  disabilityNeeds?: string;
}

export interface Financial {
  familyIncome?: number;
  canPayTuition?: string;
  canPayTravel?: string;
}

export interface Hobbies {
  sports?: string;
  freeTimeActivities?: string;
}

export interface Goals {
  purposeOfEducation?: string;
  postStudyPlan?: string;
}

export interface Preferences {
  preferredFields?: string[];
  preferredCountries?: string[];
  preferredUniversities?: string[];
  preferredStudyLevel?: string;
}

export interface SupportingDocuments {
  sop?: boolean;
  recommendationLetter?: boolean;
  cv?: boolean;
  researchProposal?: boolean;
  portfolio?: boolean;
}

export interface Contact {
  permanentAddress?: { province?: string; district?: string; area?: string };
  currentAddress?: { province?: string; district?: string; area?: string };
  detailedAddress?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  relativePhone?: string;
}

export interface StudyType {
  scholarshipOnly?: boolean;
  privateStudyOption?: boolean;
}

export interface Distinction {
  specialSkills?: string;
  achievements?: string;
}

export interface Files {
  cvUrl?: string;
  sopUrl?: string;
  passportUrl?: string;
  tazkiraUrl?: string;
  portfolioUrl?: string;
  researchProposalUrl?: string;
}

export interface ScholarshipApplication {
  _id?: Types.ObjectId | string;
  userId?: string;
  status?: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  personal?: PersonalInfo;
  education?: Education[];
  research?: Research;
  skills?: Skills;
  languages?: Languages;
  activities?: Activity[];
  health?: Health;
  financial?: Financial;
  hobbies?: Hobbies;
  goals?: Goals;
  preferences?: Preferences;
  supportingDocuments?: SupportingDocuments;
  contact?: Contact;
  studyType?: StudyType;
  distinction?: Distinction;
  files?: Files;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

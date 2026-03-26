export interface Education {
  fieldOfStudy?: string;
  institutionName?: string;
  gpa?: number;
  academicRank?: string;
  startDate?: Date;
  level: string;
  graduationDate?: Date;
  educationGapExplanation?: string;
  currentlyStudying: boolean;
  thesisTopic?: string;
  thesisFileUrl?: string;
  diplomaFileUrl?: string;
  transcriptFileUrl?: string;
  finalExamYear?: number;
  finalExamScore?: number;
  majorSubjects?: string[];
}

export interface Article {
  title: string;
  citation: string;
  link: string;
}

export interface Project {
  title: string;
  fileUrl: string;
}

export interface Conference {
  title: string;
  fileUrl: string;
}

export interface LabActivity {
  title: string;
  fileUrl: string;
}

export interface AcademicAward {
  title: string;
  fileUrl: string;
}

export interface ResearchSkill {
  title: string;
  fileUrl: string;
}

export interface Address {
  province?: string;
  district?: string;
  area?: string;
}

export interface Application {
  _id: string;
  userId: string;
  level:string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  stage: string;
  personal: {
    age: number;
    gender: string;
    maritalStatus: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    mother_name: string;
    siblings: string;
    dependents: string;
    children: string;
    birthDate: Date;
    nationality: string;
    nationalId: string;
    passportId: string;
    dateofIssue: Date;
    dataofExpire: Date;
  };
  education: Education[];
  research: {
    steps: string;
    hasArticles: boolean;
    hasProjects: boolean;
    hasConferences: boolean;
    hasLabs: boolean;
    currentlyStudying: boolean;
    hasResearchSkills: boolean;
    hasAcademicAwards: boolean;
    articles: Article[];
    projects: Project[];
    conferences: Conference[];
    laboratoryActivities: LabActivity[];
    academicAwards: AcademicAward[];
    researchSkills: ResearchSkill[];
  };
skills: {
  steps?: string;
  computerSkills: {
    hasSkill: boolean;
    fileUrl?: string;
  };
  communicationSkills: {
    hasSkill: boolean;
    fileUrl?: string;
  };
  mediaContentCreation: {
    hasSkill: boolean;
    youtubeLink?: string;
  };
  teamworkSkills: {
    hasSkill: boolean;
    fileUrl?: string;
  };
  leadershipSkills: {
    hasSkill: boolean;
    fileUrl?: string;
  };
  problemSolving: {
    hasSkill: boolean;
    fileUrl?: string;
  };
  timeManagement: {
    hasSkill: boolean;
    fileUrl?: string;
  };
  presentationSkills: {
    hasSkill: boolean;
    fileUrl?: string;
  };
};
languages: {
  nativeLanguage?: {
    language: string;
    level?: string;
  };
  english?: {
    level?: "Basic" | "Intermediate" | "Advanced" | "Fluent";
    test?: "None" | "IELTS" | "TOEFL" | "Duolingo";
    score?: string;
    certificateUrl?: string;
  };
  foreignLanguage?: {
    language: string;
    level?: "Basic" | "Intermediate" | "Advanced" | "Fluent";
    documentType?: "Certificate" | "Diploma" | "Transcript" | "Other";
    certificateUrl?: string;
  };
  localLanguage?: {
    language: string;
    level?: "Basic" | "Intermediate" | "Advanced" | "Fluent";
  };
};
  activities: Array<{ type: string; fileUrl?: string }>;
  health: {
    specialDiseases?: string;
    disabilityNeeds?: string;
  };
  financial: {
    familyIncome?: number;
    canPayTuition?: string;
    canPayTravel?: string;
  };
  hobbies: {
    sports?: string;
    freeTimeActivities?: string;
  };
  goals: {
    purposeOfEducation?: string;
    postStudyPlan?: string;
  };
  preferences: {
    preferredFields?: string[];
    preferredCountries?: string[];
    preferredUniversities?: string[];
    preferredStudyLevel?: string;
  };
  supportingDocuments: {
    sop: boolean;
    recommendationLetter: boolean;
    cv: boolean;
    researchProposal: boolean;
    portfolio: boolean;
  };
  contact: {
    permanentAddress: Address;
    currentAddress: Address;
    detailedAddress?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    relativePhone?: string;
  };
  studyType: {
    scholarshipOnly: boolean;
    privateStudyOption: boolean;
  };
  distinction: {
    specialSkills?: string;
    achievements?: string;
  };
  files: {
    sopUrl?: string;
    recommendationLettersUrl?: string;
    cvUrl?: string;
    researchProposalUrl?: string;
    portfolioUrl?: string;
    nidUrl?: string;
    passportUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

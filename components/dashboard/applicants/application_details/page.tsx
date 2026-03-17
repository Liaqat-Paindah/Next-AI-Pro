"use client";
import Loading from "@/app/loading";
import { UseGetApplicants } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  User,
  GraduationCap,
  FlaskConical,
  Wrench,
  Languages,
  Heart,
  DollarSign,
  Target,
  FileText,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
} from "lucide-react";

// Define types based on the schema
interface Education {
  level: string;
  fieldOfStudy?: string;
  institutionName?: string;
  gpa?: number;
  academicRank?: string;
  startDate?: Date;
  graduationDate?: Date;
  educationGapExplanation?: string;
  thesisTopic?: string;
  thesisFileUrl?: string;
  diplomaFileUrl?: string;
  transcriptFileUrl?: string;
  finalExamYear?: number;
  finalExamScore?: number;
  majorSubjects?: string[];
}

interface Article {
  title: string;
  citation: string;
  link: string;
}

interface Project {
  title: string;
  fileUrl: string;
}

interface Conference {
  title: string;
  fileUrl: string;
}

interface LabActivity {
  title: string;
  fileUrl: string;
}

interface AcademicAward {
  title: string;
  fileUrl: string;
}

interface ResearchSkill {
  title: string;
  fileUrl: string;
}

interface Address {
  province?: string;
  district?: string;
  area?: string;
}

interface Application {
  _id: string;
  userId: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  stage: string;
  personal: {
    age: number;
    gender: string;
    maritalStatus: string;
    firstName: string;
    lastName: string;
    fatherName: string;
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
    steps: string;
    computerSkills: { hasSkill: boolean; fileUrl?: string };
    communicationSkills: boolean;
    mediaContentCreation: { hasSkill: boolean; youtubeLink?: string };
    teamworkSkills: boolean;
    leadershipSkills: boolean;
    problemSolving: boolean;
    timeManagement: boolean;
    presentationSkills: boolean;
  };
  languages: {
    nativeLanguage?: string;
    english: {
      level?: string;
      test?: string;
      score?: string;
      certificateUrl?: string;
    };
    foreignLanguage?: { language: string };
    localLanguage?: { language: string };
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

const GetApplicationDetails = () => {
  const { data: userSession, status } = useSession();
  const id = userSession?.user._id;
  const { data: NewData, isLoading } = UseGetApplicants(id as string);
  const application = NewData?.data;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">
            No Application Found
          </h2>
          <p className="text-gray-500 mt-2">
            You have not submitted any scholarship application yet.
          </p>
        </div>
      </div>
    );
  }

  const app = application as Application;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "under_review":
        return "text-blue-600 bg-blue-100";
      case "submitted":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5" />;
      case "rejected":
        return <XCircle className="w-5 h-5" />;
      case "under_review":
        return <Clock className="w-5 h-5" />;
      default:
        return <FileCheck className="w-5 h-5" />;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "research", label: "Research", icon: FlaskConical },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "languages", label: "Languages", icon: Languages },
    { id: "health", label: "Health", icon: Heart },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "goals", label: "Goals", icon: Target },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Scholarship Application
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {formatDate(app.createdAt)}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(app.status)}`}
            >
              {getStatusIcon(app.status)}
              <span className="font-medium capitalize">
                {app.status.replace("_", " ")}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(tabs.findIndex((t) => t.id === app.stage) + 1) * 10}%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Current Stage:{" "}
              <span className="font-medium capitalize">
                {app.stage.replace(/_/g, " ")}
              </span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto py-2 px-4 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "personal" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-gray-900">
                      {app.personal.firstName} {app.personal.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Father Name
                    </label>
                    <p className="text-gray-900">{app.personal.fatherName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </label>
                    <p className="text-gray-900">
                      {formatDate(app.personal.birthDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Age
                    </label>
                    <p className="text-gray-900">{app.personal.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Gender
                    </label>
                    <p className="text-gray-900">{app.personal.gender}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Marital Status
                    </label>
                    <p className="text-gray-900">
                      {app.personal.maritalStatus}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Nationality
                    </label>
                    <p className="text-gray-900">{app.personal.nationality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      National ID
                    </label>
                    <p className="text-gray-900">{app.personal.nationalId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Passport ID
                    </label>
                    <p className="text-gray-900">{app.personal.passportId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Passport Expiry
                    </label>
                    <p className="text-gray-900">
                      {formatDate(app.personal.dataofExpire)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Education History
              </h2>
              {app.education.map((edu, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-lg text-blue-600">
                    {edu.level}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {edu.fieldOfStudy && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Field of Study
                        </label>
                        <p className="text-gray-900">{edu.fieldOfStudy}</p>
                      </div>
                    )}
                    {edu.institutionName && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Institution
                        </label>
                        <p className="text-gray-900">{edu.institutionName}</p>
                      </div>
                    )}
                    {edu.gpa && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          GPA
                        </label>
                        <p className="text-gray-900">{edu.gpa}</p>
                      </div>
                    )}
                    {edu.academicRank && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Academic Rank
                        </label>
                        <p className="text-gray-900">{edu.academicRank}</p>
                      </div>
                    )}
                    {edu.startDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Start Date
                        </label>
                        <p className="text-gray-900">
                          {formatDate(edu.startDate)}
                        </p>
                      </div>
                    )}
                    {edu.graduationDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Graduation Date
                        </label>
                        <p className="text-gray-900">
                          {formatDate(edu.graduationDate)}
                        </p>
                      </div>
                    )}
                    {edu.finalExamScore && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Final Exam Score
                        </label>
                        <p className="text-gray-900">{edu.finalExamScore}</p>
                      </div>
                    )}
                  </div>
                  {edu.majorSubjects && edu.majorSubjects.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Major Subjects
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {edu.majorSubjects.map((subject, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "research" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Research & Publications
              </h2>

              {app.research.hasArticles && app.research.articles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Articles</h3>
                  {app.research.articles.map((article, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium">{article.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {article.citation}
                      </p>
                      {article.link && (
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                        >
                          View Article
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {app.research.hasProjects && app.research.projects.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Projects</h3>
                  {app.research.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium">{project.title}</p>
                      {project.fileUrl && (
                        <a
                          href={project.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                        >
                          View Project File
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {app.research.hasConferences &&
                app.research.conferences.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg">Conferences</h3>
                    {app.research.conferences.map((conference, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <p className="font-medium">{conference.title}</p>
                        {conference.fileUrl && (
                          <a
                            href={conference.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                          >
                            View Conference File
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Skills
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Computer Skills
                    </label>
                    <p className="text-gray-900">
                      {app.skills.computerSkills.hasSkill ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Communication Skills
                    </label>
                    <p className="text-gray-900">
                      {app.skills.communicationSkills ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Media Content Creation
                    </label>
                    <p className="text-gray-900">
                      {app.skills.mediaContentCreation.hasSkill ? "Yes" : "No"}
                    </p>
                    {app.skills.mediaContentCreation.youtubeLink && (
                      <a
                        href={app.skills.mediaContentCreation.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline block mt-1"
                      >
                        YouTube Channel
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Teamwork Skills
                    </label>
                    <p className="text-gray-900">
                      {app.skills.teamworkSkills ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Leadership Skills
                    </label>
                    <p className="text-gray-900">
                      {app.skills.leadershipSkills ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Problem Solving
                    </label>
                    <p className="text-gray-900">
                      {app.skills.problemSolving ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Time Management
                    </label>
                    <p className="text-gray-900">
                      {app.skills.timeManagement ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Presentation Skills
                    </label>
                    <p className="text-gray-900">
                      {app.skills.presentationSkills ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "languages" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Language Proficiency
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {app.languages.nativeLanguage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Native Language
                    </label>
                    <p className="text-gray-900">
                      {app.languages.nativeLanguage}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    English Level
                  </label>
                  <p className="text-gray-900">
                    {app.languages.english.level || "Not specified"}
                  </p>
                  {app.languages.english.test !== "None" && (
                    <>
                      <p className="text-sm text-gray-600 mt-1">
                        {app.languages.english.test}:{" "}
                        {app.languages.english.score}
                      </p>
                      {app.languages.english.certificateUrl && (
                        <a
                          href={app.languages.english.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline block mt-1"
                        >
                          View Certificate
                        </a>
                      )}
                    </>
                  )}
                </div>

                {app.languages.foreignLanguage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Foreign Language
                    </label>
                    <p className="text-gray-900">
                      {app.languages.foreignLanguage.language}
                    </p>
                  </div>
                )}

                {app.languages.localLanguage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Local Language
                    </label>
                    <p className="text-gray-900">
                      {app.languages.localLanguage.language}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Health Information
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {app?.health?.specialDiseases && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Special Diseases
                    </label>
                    <p className="text-gray-900">
                      {app.health.specialDiseases}
                    </p>
                  </div>
                )}

                {app?.health?.disabilityNeeds && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Disability Needs
                    </label>
                    <p className="text-gray-900">
                      {app.health.disabilityNeeds}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Financial Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {app.financial.familyIncome && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Family Income
                    </label>
                    <p className="text-gray-900">
                      ${app.financial.familyIncome.toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Can Pay Tuition
                  </label>
                  <p className="text-gray-900 capitalize">
                    {app.financial.canPayTuition}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Can Pay Travel
                  </label>
                  <p className="text-gray-900 capitalize">
                    {app.financial.canPayTravel}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  Study Type
                </label>
                <div className="flex gap-4 mt-1">
                  {app.studyType.scholarshipOnly && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Scholarship Only
                    </span>
                  )}
                  {app.studyType.privateStudyOption && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Private Study Option
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Goals & Preferences
              </h2>

              <div className="space-y-4">
                {app?.goals?.purposeOfEducation && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Purpose of Education
                    </label>
                    <p className="text-gray-900">
                      {app.goals.purposeOfEducation}
                    </p>
                  </div>
                )}

                {app.goals?.postStudyPlan && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Post-Study Plan
                    </label>
                    <p className="text-gray-900">{app.goals.postStudyPlan}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Preferences</h3>

                {app.preferences.preferredFields &&
                  app.preferences.preferredFields.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Preferred Fields
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {app.preferences.preferredFields.map((field, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {app.preferences.preferredCountries &&
                  app.preferences.preferredCountries.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Preferred Countries
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {app.preferences.preferredCountries.map(
                          (country, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                            >
                              {country}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {app.preferences.preferredUniversities &&
                  app.preferences.preferredUniversities.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Preferred Universities
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {app.preferences.preferredUniversities.map(
                          (university, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                            >
                              {university}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {app.preferences.preferredStudyLevel && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Preferred Study Level
                    </label>
                    <p className="text-gray-900">
                      {app.preferences.preferredStudyLevel}
                    </p>
                  </div>
                )}
              </div>

              {app.distinction.specialSkills && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Special Skills
                  </label>
                  <p className="text-gray-900">
                    {app.distinction.specialSkills}
                  </p>
                </div>
              )}

              {app.distinction.achievements && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Achievements
                  </label>
                  <p className="text-gray-900">
                    {app.distinction.achievements}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Supporting Documents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {app?.supportingDocuments?.sop && app.files.sopUrl && (
                  <a
                    href={app.files.sopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Statement of Purpose</span>
                  </a>
                )}

                {app.supportingDocuments?.recommendationLetter &&
                  app.files.recommendationLettersUrl && (
                    <a
                      href={app.files.recommendationLettersUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Recommendation Letters</span>
                    </a>
                  )}

                {app.supportingDocuments?.cv && app.files.cvUrl && (
                  <a
                    href={app.files.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>CV / Resume</span>
                  </a>
                )}

                {app.supportingDocuments?.researchProposal &&
                  app.files.researchProposalUrl && (
                    <a
                      href={app.files.researchProposalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Research Proposal</span>
                    </a>
                  )}

                {app.supportingDocuments?.portfolio &&
                  app.files.portfolioUrl && (
                    <a
                      href={app.files.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Portfolio</span>
                    </a>
                  )}
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-lg mb-3">
                  Identification Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {app.files.nidUrl && (
                    <a
                      href={app.files.nidUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>National ID</span>
                    </a>
                  )}

                  {app.files.passportUrl && (
                    <a
                      href={app.files.passportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Passport</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Contact Details</h3>
                  {app.contact.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="text-gray-900">{app.contact.phone}</p>
                    </div>
                  )}

                  {app.contact.whatsapp && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        WhatsApp
                      </label>
                      <p className="text-gray-900">{app.contact.whatsapp}</p>
                    </div>
                  )}

                  {app.contact.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-gray-900">{app.contact.email}</p>
                    </div>
                  )}

                  {app.contact.relativePhone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Relative Phone
                      </label>
                      <p className="text-gray-900">
                        {app.contact.relativePhone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">
                      Permanent Address
                    </h3>
                    <p className="text-gray-900">
                      {app.contact.permanentAddress?.area && (
                        <span>{app.contact.permanentAddress.area}, </span>
                      )}
                      {app.contact.permanentAddress?.district && (
                        <span>{app.contact.permanentAddress.district}, </span>
                      )}
                      {app.contact.permanentAddress?.province}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2">
                      Current Address
                    </h3>
                    <p className="text-gray-900">
                      {app.contact.currentAddress?.area && (
                        <span>{app.contact.currentAddress?.area}, </span>
                      )}
                      {app.contact.currentAddress?.district && (
                        <span>{app.contact.currentAddress?.district}, </span>
                      )}
                      {app.contact.currentAddress?.province}
                    </p>
                  </div>

                  {app.contact?.detailedAddress && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Detailed Address
                      </label>
                      <p className="text-gray-900">
                        {app.contact.detailedAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetApplicationDetails;

// lib/checkApplicationSteps.ts
import type { ScholarshipApplication } from "@/types/checkSteps";

export interface ApplicationSteps {
  personal: boolean;
  education: boolean;
  research: boolean;
  skills: boolean;
  languages: boolean;
  activities: boolean;
  health: boolean;
  financial: boolean;
  goals: boolean;
  preferences: boolean;
  documents: boolean;
  contact: boolean;
  studyType: boolean;
}

export function checkApplicationSteps(
  app: ScholarshipApplication,
): ApplicationSteps {
  return {
    // Personal: Check required fields from schema
    personal: !!(
      app?.personal?.firstName &&
      app?.personal?.lastName &&
      app?.personal?.fatherName &&
      app?.personal?.gender &&
      app?.personal?.birthDate &&
      app?.personal?.nationality &&
      app?.personal?.nationalId &&
      app?.personal?.passportId
    ),

    // Education: At least one education entry
    education: !!(app?.education && app.education.length > 0),

    // Research: Check if any research section has data
    research: !!(app?.research?.steps === "true"),

    // Skills: At least one skill marked as true
    skills: !!(app?.skills?.steps === "true"),

    // Languages: Native language or English level
    languages: !!(
      app?.languages?.nativeLanguage || app?.languages?.english?.level
    ),

    // Activities: At least one activity
    activities: !!(app?.activities && app.activities.length > 0),

    // Health: Any health info provided
    health: !!(app?.health?.specialDiseases || app?.health?.disabilityNeeds),

    // Financial: Income or tuition payment capability
    financial: !!(
      app?.financial?.familyIncome || app?.financial?.canPayTuition
    ),

    // Goals: Purpose or post-study plan
    goals: !!(app?.goals?.purposeOfEducation || app?.goals?.postStudyPlan),

    // Preferences: Any preferences selected
    preferences: !!(
      app?.preferences?.preferredFields?.length ||
      app?.preferences?.preferredCountries?.length ||
      app?.preferences?.preferredUniversities?.length
    ),

    // Documents: Required files uploaded
    documents: !!(
      app?.files?.cvUrl ||
      app?.files?.sopUrl ||
      app?.files?.passportUrl ||
      app?.files?.tazkiraUrl
    ),

    // Contact: Essential contact info
    contact: !!(app?.contact?.phone && app?.contact?.relativePhone),

    // Study Type: Both options selected
    studyType: !!(
      (app?.studyType?.scholarshipOnly !== false &&
        app?.studyType?.privateStudyOption !== undefined) ||
      app?.studyType?.specialSkills ||
      app?.studyType?.achievements
    ),
  };
}

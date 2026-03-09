export interface LanguagePayload {
  // English
  englishLevel: string;
  englishTest?: "IELTS" | "TOEFL" | "Duolingo" | "None";
  englishTestScore?: string;
  englishCertificate?: File;
  
  // Other Foreign Language
  foreignLanguage?: string;
  foreignLanguageLevel?: "Basic" | "Intermediate" | "Advanced" | "Fluent";
  
  // Native Language
  nativeLanguage: string;
  
  // Local Languages
  localLanguage?: string;
  localLanguageLevel?: "Basic" | "Intermediate" | "Advanced" | "Fluent";
  
  // Study Language
  studiedLanguage?: string;
  studiedLanguageDocument?: File;
  
  userId: string;
}

export type LanguageLevel = "Basic" | "Intermediate" | "Advanced" | "Fluent";
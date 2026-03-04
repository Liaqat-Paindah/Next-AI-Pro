import { z } from "zod";
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import type { ReactNode } from "react";

export const personalInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  fatherName: z.string().min(1, "Father name is required"),
  age: z
    .number({ message: "Age is required" })
    .min(1, "Age must be at least 1"),
  gender: z.string().min(1, "gender is required"),
  maritalStatus: z.string().min(1, "Marital Status is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  nationality: z.string().min(1, "Nationality is required"),
  nationalId: z.string().min(1, "National ID is required"),
  passportId: z.string().min(5, "Passport number is required"),
  dateofIssue: z.string().min(1, "Passport issue date is required"),
  dataofExpire: z.string().min(1, "Passport expiry date is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").min(1, "email is required"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const masterEducationSchema = z.object({
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  institutionName: z.string().min(1, "Institution name is required"),
  gpa: z.number().min(50, "Average Marks must be between 0 and 100"),
  academicRank: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  graduationDate: z.string().min(1, "Graduation date is required"),
  thesisTopic: z.string().optional(),
  thesisFile: z.any().optional(),
  diplomaFile: z.any().optional(),
  transcriptFile: z.any().optional(),
});

export const bachelorEducationSchema = z.object({
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  institutionName: z.string().min(1, "Institution name is required"),
  gpa: z.number().min(50, "Average Marks must be between 0 and 100"),
  academicRank: z.string().optional(),
  academic_gap: z.string().min(1, "Academic Gap is required"),
  thesisTopic: z.string().optional(),
  thesisFile: z.any().optional(),
  startDate: z.string().min(1, "Start date is required"),
  graduationDate: z.string().min(1, "Graduation date is required"),
  diplomaFile: z.any().optional(),
  transcriptFile: z.any().optional(),
});

export const highSchoolEducationSchema = z.object({
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  institutionName: z.string().min(1, "Institution name is required"),
  gpa: z.number().min(50, "Average Marks must be between 0 and 100"),
  academicRank: z.string().optional(),
  academic_gap: z.string().min(1, "Academic Gap is required"),
  startDate: z.string().min(1, "Start date is required"),
  graduationDate: z.string().min(1, "Graduation date is required"),
  finalExamYear: z.number().optional(),
  finalExamScore: z.number().optional(),
  diplomaFile: z.any().optional(),
  transcriptFile: z.any().optional(),
});

export const educationSchema = z.discriminatedUnion("level", [
  // PHD schema
  z.object({
    level: z.literal("PHD"),
    phdEducation: masterEducationSchema,
    masterEducation: masterEducationSchema,
    bachelorEducation: z
      .array(bachelorEducationSchema)
      .min(1, "At least one bachelor education is required"),
    highSchoolEducation: z
      .array(highSchoolEducationSchema)
      .min(1, "High school education is required"),
  }),
  // Master schema
  z.object({
    level: z.literal("Master"),
    masterEducation: masterEducationSchema,
    bachelorEducation: z
      .array(bachelorEducationSchema)
      .min(1, "At least one bachelor education is required"),
    highSchoolEducation: z
      .array(highSchoolEducationSchema)
      .min(1, "High school education is required"),
  }),
  // Bachelor schema
  z.object({
    level: z.literal("Bachelor"),
    bachelorEducation: z.array(bachelorEducationSchema).optional(),
    highSchoolEducation: z
      .array(highSchoolEducationSchema)
      .min(1, "High school education is required"),
  }),
  // HighSchool schema
  z.object({
    level: z.literal("HighSchool"),
    highSchoolEducation: z
      .array(highSchoolEducationSchema)
      .min(1, "High school education is required"),
  }),
]);

export type EducationFormData = z.infer<typeof educationSchema>;
export type MasterEducation = z.infer<typeof masterEducationSchema>;
export type PhdEducation = MasterEducation;
export type BachelorEducation = z.infer<typeof bachelorEducationSchema>;
export type HighSchoolEducation = z.infer<typeof highSchoolEducationSchema>;

export type FormSelectOption = {
  value: string;
  label: string;
};

export interface FormInputProps<T extends FieldValues> {
  label: string;
  type: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  icon?: ReactNode;
  options?: FormSelectOption[];
}

export interface EducationSectionProps<TFields extends FieldValues> {
  prefix: string;
  register: UseFormRegister<EducationFormData>;
  errors?: FieldErrors<TFields>;
  onRemove?: () => void;
}

export interface MasterEducationProps extends EducationSectionProps<EducationFormData> {
  showThesis?: boolean;
}

export type BachelorEducationProps = EducationSectionProps<BachelorEducation>;

export type HighSchoolEducationProps =
  EducationSectionProps<HighSchoolEducation> & {
    showFinalExam?: boolean;
  };

export interface FileUploadProps {
  id: string;
  label: string;
  accept?: Record<string, string[]>;
  onFileAccepted: (file: File) => void;
  onFileRemove?: () => void;
  error?: string | { message?: string };
  icon?: ReactNode;
  currentFile?: File | null;
}

export interface EducationFormDataField {
  userId: string;
  level: "PHD" | "Master" | "Bachelor" | "HighSchool";
  phdEducation?: PhdEducation;
  masterEducation?: MasterEducation;
  bachelorEducation?: BachelorEducation[];
  highSchoolEducation?: HighSchoolEducation[];
}

// Articales

export interface Article {
  title: string;
  apaReference: string;
  link: string;
}

export interface AcademicArticlesPayload {
  hasAcademicArticles: "Yes" | "No";
  academicArticles: Article[];
  userId:string
}

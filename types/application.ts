import { z } from "zod";
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import type { ReactNode } from "react";

export const personalInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  fatherName: z.string().min(1, "Father name is required"),
  mother_name: z.string().min(1, "Mother name is required"),
  gender: z.string().min(1, "gender is required"),
  children: z
    .string()
    .optional().nullable(),
  siblings: z.string().min(1, "Number of Sibilings is required"),
  dependents: z.string().min(1, "Number of Dependents is required"),
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

const optionalBoolean = z.coerce.boolean().optional();

/** Empty HTML number inputs use valueAsNumber → NaN; Zod rejects NaN on z.number() */
const sanitizeNumericInput = (v: unknown): unknown => {
  if (v === "" || v === null || v === undefined) return undefined;
  if (typeof v === "number" && Number.isNaN(v)) return undefined;
  if (typeof v === "string" && v.trim() === "") return undefined;
  return v;
};

const requiredGpaSchema = z.preprocess(
  sanitizeNumericInput,
  z
    .number({ message: "Average marks are required" })
    .min(50, "Average Marks must be between 0 and 100")
    .max(100, "Average Marks must be between 0 and 100"),
);

const optionalNumeric = z.preprocess(
  sanitizeNumericInput,
  z.coerce.number().optional(),
);

const withGraduationRefine = <
  T extends z.ZodRawShape & {
    graduationDate?: z.ZodTypeAny;
    currentlyStudying?: z.ZodTypeAny;
  },
>(
  schema: z.ZodObject<T>,
) =>
  schema.superRefine((data, ctx) => {
    const studying = Boolean(
      (data as { currentlyStudying?: boolean }).currentlyStudying,
    );
    const gd = (data as { graduationDate?: string }).graduationDate;
    if (!studying && (!gd || String(gd).trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Graduation date is required unless currently studying",
        path: ["graduationDate"],
      });
    }
  });

const withSchoolEndRefine = <
  T extends z.ZodRawShape & {
    endDate?: z.ZodTypeAny;
    currentlyStudying?: z.ZodTypeAny;
  },
>(
  schema: z.ZodObject<T>,
) =>
  schema.superRefine((data, ctx) => {
    const studying = Boolean(
      (data as { currentlyStudying?: boolean }).currentlyStudying,
    );
    const ed = (data as { endDate?: string }).endDate;
    if (!studying && (!ed || String(ed).trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required unless currently studying",
        path: ["endDate"],
      });
    }
  });

export const upperSecondaryYearSchema = withSchoolEndRefine(
  z.object({
    yearLabel: z.string().min(1, "Year / grade label is required"),
    institutionName: z.string().min(1, "Institution name is required"),
    fieldOfStudy: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    currentlyStudying: optionalBoolean,
  }),
);

export const masterEducationSchema = withGraduationRefine(
  z.object({
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    institutionName: z.string().min(1, "Institution name is required"),
    gpa: requiredGpaSchema,
    academicRank: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    graduationDate: z.string().optional(),
    currentlyStudying: optionalBoolean,
    thesisTopic: z.string().optional(),
    thesisFile: z.any().optional(),
    diplomaFile: z.any().optional(),
    transcriptFile: z.any().optional(),
  }),
);

export const bachelorEducationSchema = withGraduationRefine(
  z.object({
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    institutionName: z.string().min(1, "Institution name is required"),
    gpa: requiredGpaSchema,
    academicRank: z.string().optional(),
    academic_gap: z.string().min(1, "Academic Gap is required"),
    thesisTopic: z.string().optional(),
    thesisFile: z.any().optional(),
    startDate: z.string().min(1, "Start date is required"),
    graduationDate: z.string().optional(),
    currentlyStudying: optionalBoolean,
    diplomaFile: z.any().optional(),
    transcriptFile: z.any().optional(),
  }),
);

/** Shared shape for primary, middle, and secondary / high school rows */
export const k12SchoolRecordSchema = withGraduationRefine(
  z.object({
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    institutionName: z.string().min(1, "Institution name is required"),
    gpa: requiredGpaSchema,
    academicRank: z.string().optional(),
    academic_gap: z.string().nullable(),
    startDate: z.string().min(1, "Start date is required"),
    graduationDate: z.string().optional(),
    currentlyStudying: optionalBoolean,
    finalExamYear: optionalNumeric,
    finalExamScore: optionalNumeric,
    diplomaFile: z.any().optional(),
    transcriptFile: z.any().optional(),
  }),
);

/** Associate (14th graduation) block: all fields optional (no required validation) */
export const associate14thOptionalRecordSchema = z.object({
  fieldOfStudy: z.string().optional(),
  institutionName: z.string().optional(),
  gpa: optionalNumeric,
  academicRank: z.string().optional(),
  academic_gap: z.string().optional(),
  startDate: z.string().optional(),
  graduationDate: z.string().optional(),
  currentlyStudying: optionalBoolean,
  finalExamYear: optionalNumeric,
  finalExamScore: optionalNumeric,
  diplomaFile: z.any().optional(),
  transcriptFile: z.any().optional(),
});

export const highSchoolEducationSchema = k12SchoolRecordSchema;

export const higherSecondaryEducationSchema = withGraduationRefine(
  z.object({
    fieldOfStudy: z.string().min(1, "Field of study / stream is required"),
    institutionName: z.string().min(1, "Institution name is required"),
    gpa: requiredGpaSchema,
    academicRank: z.string().optional(),
    academic_gap: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    graduationDate: z.string().optional(),
    currentlyStudying: optionalBoolean,
    finalExamYear: optionalNumeric,
    finalExamScore: optionalNumeric,
    diplomaFile: z.any().optional(),
    transcriptFile: z.any().optional(),
  }),
);

/** PHD / Master / Bachelor: always ask yes/no, then optional 14th Grade details */
const graduatePathWithAssociate = {
  hasAssociate14thDegree: z.enum(["yes", "no"]),
  primarySchool: associate14thOptionalRecordSchema,
};

const refineAssociate14WhenYes = (
  data: {
    hasAssociate14thDegree?: "yes" | "no";
    primarySchool?: z.infer<typeof associate14thOptionalRecordSchema>;
  },
  ctx: z.RefinementCtx,
) => {
  if (data.hasAssociate14thDegree !== "yes") {
    return;
  }
  const parsed = k12SchoolRecordSchema.safeParse(data.primarySchool);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      ctx.addIssue({
        ...issue,
        path: ["primarySchool", ...issue.path],
      });
    }
  }
};

export const educationSchema = z.discriminatedUnion("level", [
  z
    .object({
      level: z.literal("PHD"),
      ...graduatePathWithAssociate,
      phdEducation: masterEducationSchema,
      masterEducation: masterEducationSchema,
      bachelorEducation: z
        .array(bachelorEducationSchema)
        .min(1, "At least one bachelor education is required"),
      highSchoolEducation: z
        .array(highSchoolEducationSchema)
        .min(1, "High school education is required"),
    })
    .superRefine(refineAssociate14WhenYes),
  z
    .object({
      level: z.literal("Master"),
      ...graduatePathWithAssociate,
      masterEducation: masterEducationSchema,
      bachelorEducation: z
        .array(bachelorEducationSchema)
        .min(1, "At least one bachelor education is required"),
      highSchoolEducation: z
        .array(highSchoolEducationSchema)
        .min(1, "High school education is required"),
    })
    .superRefine(refineAssociate14WhenYes),
  z
    .object({
      level: z.literal("Bachelor"),
      ...graduatePathWithAssociate,
      bachelorEducation: z
        .array(bachelorEducationSchema)
        .min(1, "At least one bachelor education is required"),
      highSchoolEducation: z
        .array(highSchoolEducationSchema)
        .min(1, "High school education is required"),
    })
    .superRefine(refineAssociate14WhenYes),
  z.object({
    level: z.literal("Associate"),
    associate14thEducation: k12SchoolRecordSchema,
    highSchoolEducation: z
      .array(highSchoolEducationSchema)
      .min(1, "High school education is required"),
  }),
  z.object({
    level: z.literal("HighSchool"),
    highSchoolEducation: z
      .array(highSchoolEducationSchema)
      .min(1, "High school education is required"),
  }),
  z.object({
    level: z.literal("MiddleSchool"),
    primarySchool: k12SchoolRecordSchema,
    secondarySchoolEducation: z
      .array(highSchoolEducationSchema)
      .min(1, "Secondary school education is required"),
  }),
]);

export type EducationFormData = z.infer<typeof educationSchema>;
export type MasterEducation = z.infer<typeof masterEducationSchema>;
export type PhdEducation = MasterEducation;
export type BachelorEducation = z.infer<typeof bachelorEducationSchema>;
export type HighSchoolEducation = z.infer<typeof highSchoolEducationSchema>;
export type K12SchoolRecord = z.infer<typeof k12SchoolRecordSchema>;
export type Associate14thOptionalRecord = z.infer<
  typeof associate14thOptionalRecordSchema
>;
export type HigherSecondaryEducation = z.infer<
  typeof higherSecondaryEducationSchema
>;
export type UpperSecondaryYear = z.infer<typeof upperSecondaryYearSchema>;

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
  watch?: UseFormWatch<EducationFormData>;
}

export interface MasterEducationProps extends EducationSectionProps<MasterEducation> {
  showThesis?: boolean;
}

export type BachelorEducationProps = EducationSectionProps<BachelorEducation>;

export type HighSchoolEducationProps =
  EducationSectionProps<HighSchoolEducation> & {
    showFinalExam?: boolean;
    heading?: string;
    /** Defaults to the standard secondary-school helper text when omitted */
    subheading?: string;
    academicGapRequired?: boolean;
    /** When true, no field is marked required (Associate / 14th graduation block) */
    allFieldsOptional?: boolean;
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
  level: "PHD" | "Master" | "Bachelor" | "HighSchool" | "Associate" | "MiddleSchool";
  hasAssociate14thDegree?: "yes" | "no";
  primarySchool?: Associate14thOptionalRecord | K12SchoolRecord;
  associate14thEducation?: K12SchoolRecord;
  secondarySchoolEducation?: HighSchoolEducation[];
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
  userId: string;
}

export const specialConditionsSchema = z.object({
  specialDisease: z
    .string()
    .min(
      1,
      "Special disease is required. If there is no disease, please write 'No'.",
    ),

  physicalDisability: z
    .string()
    .min(
      1,
      "Physical disability information is required. If there is no disability, please write 'No'.",
    ),
});

export type SpecialConditionsFormData = z.infer<typeof specialConditionsSchema>;

export const visionGoalsSchema = z.object({
  purposeOfEducation: z
    .string()
    .min(100, "Please provide at least 100 characters describing your purpose")
    .max(1000, "Purpose cannot exceed 1000 characters"),

  postStudyPlan: z
    .string()
    .min(
      100,
      "Please provide at least 100 characters describing your post-study plans",
    )
    .max(1000, "Post-study plan cannot exceed 1000 characters"),
});

export type VisionGoalsFormData = z.infer<typeof visionGoalsSchema>;

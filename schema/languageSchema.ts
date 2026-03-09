import { z } from "zod";

export const languageSchema = z
  .object({
    // English
    userId: z.string().optional(),
    englishLevel: z.string().min(1, 'English Level is Required'),
    englishTest: z.enum(["IELTS", "TOEFL", "Duolingo", "None"]).optional(),
    englishTestScore: z.string().optional(),
    englishCertificate: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: "File size must be less than 10MB",
      })
      .optional(),

    // Other Foreign Language
    foreignLanguage: z.string().optional(),
    foreignLanguageLevel: z
      .enum(["Basic", "Intermediate", "Advanced", "Fluent"])
      .optional(),

    // Native Language
    nativeLanguage: z.string().min(1, "Native language is required"),

    // Local Languages
    localLanguage: z.string().optional(),
    localLanguageLevel: z
      .enum(["Basic", "Intermediate", "Advanced", "Fluent"])
      .optional(),

    // Study Language
    studiedLanguage: z.string().optional(),
    studiedLanguageDocument: z
      .instanceof(File)
      .optional(),
  })
  .superRefine((data, ctx) => {
    // If English test is selected (not "None"), score is required
    if (data.englishTest && data.englishTest !== "None" && !data.englishTestScore) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Test score is required",
        path: ["englishTestScore"],
      });
    }

    // If studied language is provided, document is required
    if (data.studiedLanguage && !data.studiedLanguageDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Document is required for studied language",
        path: ["studiedLanguageDocument"],
      });
    }
  });

export type LanguageFormData = z.infer<typeof languageSchema>;
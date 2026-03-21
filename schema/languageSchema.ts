import { z } from "zod";

export const languageSchema = z
  .object({
    // User ID
    userId: z.string().optional(),

    // English Language
    englishLevel: z.string().min(1, "English Level is Required"),
    englishTest: z.enum(["IELTS", "TOEFL", "Duolingo", "None"]).optional(),
    englishTestScore: z.string().optional(),
    englishCertificate: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: "File size must be less than 10MB",
      })
      .optional(),

    // Native Language
    nativeLanguage: z.string().min(1, "Native language is required"),
    nativeLanguageLevel: z
      .string()
      .min(1, "Select the Level of Native Language")
      .optional(),

    // Foreign Language
    foreignLanguage: z.string().optional(),
    foreignLanguageLevel: z.string().optional(),
    foreignDocumentType: z.string().optional(),
    foreignCertificate: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: "File size must be less than 10MB",
      })
      .optional(),
    localLanguage: z.string().optional(),
    localLanguageLevel: z.string().optional(),
    studiedLanguage: z.string().optional(),
    studiedLanguageDocument: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.englishTest && data.englishTest !== "None") {
      if (!data.englishTestScore) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Test score is required",
          path: ["englishTestScore"],
        });
      }

      if (!data.englishCertificate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Certificate is required for English test",
          path: ["englishCertificate"],
        });
      }
    }
    if (data.nativeLanguage && !data.nativeLanguageLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Native language level is required",
        path: ["nativeLanguageLevel"],
      });
    }
    if (data.foreignLanguage) {
      if (!data.foreignLanguageLevel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Foreign language level is required",
          path: ["foreignLanguageLevel"],
        });
      }

      if (!data.foreignDocumentType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select the foreign language document type",
          path: ["foreignDocumentType"],
        });
      }
    }

    // If local language is provided, level is required
    if (data.localLanguage && !data.localLanguageLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Local language level is required",
        path: ["localLanguageLevel"],
      });
    }

    if (data.studiedLanguage && !data.studiedLanguageDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Document is required for studied language",
        path: ["studiedLanguageDocument"],
      });
    }
  });

export type LanguageFormData = z.infer<typeof languageSchema>;

import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";
import { saveFile } from "@/lib/file_upload";

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required",
      });
    }

    // English Language
    const englishLevel = formData.get("englishLevel") as string;
    const englishTest = formData.get("englishTest") as string;
    const englishTestScore = formData.get("englishTestScore") as string;
    const englishCertificate = formData.get("englishCertificate") as File | null;

    // Native Language
    const nativeLanguage = formData.get("nativeLanguage") as string;
    const nativeLanguageLevel = formData.get("nativeLanguageLevel") as string;

    // Foreign Language
    const foreignLanguage = formData.get("foreignLanguage") as string;
    const foreignLanguageLevel = formData.get("foreignLanguageLevel") as string;
    const foreignDocumentType = formData.get("foreignDocumentType") as string;
    const foreignCertificate = formData.get("foreignCertificate") as File | null;

    // Local Language
    const localLanguage = formData.get("localLanguage") as string;
    const localLanguageLevel = formData.get("localLanguageLevel") as string;

    const studiedLanguage = formData.get("studiedLanguage") as string;

    // Upload files
    let englishCertificateUrl: string | undefined;
    let foreignCertificateUrl: string | undefined;

    // English Certificate
    if (englishCertificate && englishCertificate instanceof File) {
      if (englishCertificate.size > 10 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          message: "English certificate file size must be less than 10MB",
        });
      }
      englishCertificateUrl = await saveFile(
        englishCertificate,
        "languageCertificates/english",
      );
    }

    // Foreign Language Certificate
    if (foreignCertificate && foreignCertificate instanceof File) {
      if (foreignCertificate.size > 10 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          message: "Foreign language certificate file size must be less than 10MB",
        });
      }
      foreignCertificateUrl = await saveFile(
        foreignCertificate,
        "languageCertificates/foreign",
      );
    }

    const updateData = {
      languages: {
        english: {
          level: ["Basic", "Intermediate", "Advanced", "Fluent"].includes(
            englishLevel,
          )
            ? englishLevel
            : "Basic",
          test: ["None", "IELTS", "TOEFL", "Duolingo"].includes(englishTest)
            ? englishTest
            : "None",
          score: englishTestScore || null,
          certificateUrl: englishCertificateUrl || null,
        },
        nativeLanguage: nativeLanguage
          ? {
              language: nativeLanguage,
              level: ["Basic", "Intermediate", "Advanced", "Fluent", "Native"].includes(
                nativeLanguageLevel as string,
              )
                ? nativeLanguageLevel
                : "Basic",
            }
          : null,
        foreignLanguage: foreignLanguage
          ? {
              language: foreignLanguage,
              level: ["Basic", "Intermediate", "Advanced", "Fluent"].includes(
                foreignLanguageLevel as string,
              )
                ? foreignLanguageLevel
                : "Basic",
              documentType: foreignDocumentType || null,
              certificateUrl: foreignCertificateUrl || null,
            }
          : null,
        localLanguage: localLanguage
          ? {
              language: localLanguage,
              level: ["Basic", "Intermediate", "Advanced", "Fluent"].includes(
                localLanguageLevel as string,
              )
                ? localLanguageLevel
                : "Basic",
            }
          : null,
        studiedLanguage: studiedLanguage || null,
      },
    };

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: "Language information saved successfully",
    });
  } catch (error) {
    console.error("Language API Error:", error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
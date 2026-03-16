import { ConnectDB } from "@/lib/config";
import Applications from "@/models/Applications";
import { NextResponse } from "next/server";
import { saveFile } from "@/lib/file_upload";

export async function POST(req: Request) {
  try {

    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const type = formData.get("type") as string;
    const file = formData.get("file") as File | null;

    if (!userId || !type || !file) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        message: "File must be less than 10MB",
      });
    }

    const fileUrl = await saveFile(file, "documents");

    const fieldMap: Record<string, string> = {
      sop: "files.sopUrl",
      recommendationLetters: "files.recommendationLettersUrl",
      cv: "files.cvUrl",
      researchProposal: "files.researchProposalUrl",
      portfolio: "files.portfolioUrl",
      nid: "files.nidUrl",
      passport: "files.passportUrl",
    };

    const dbField = fieldMap[type];

    if (!dbField) {
      return NextResponse.json({
        success: false,
        message: "Invalid document type",
      });
    }

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      { $set: { [dbField]: fileUrl } },
      { returnDocument: "after" }
    );

    return NextResponse.json({
      success: true,
      message: "Document uploaded",
      data: updatedApplication,
    });

  } catch (error) {

    console.error("Upload Document Error:", error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
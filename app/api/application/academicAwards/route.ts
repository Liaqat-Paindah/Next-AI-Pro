import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";
import { saveFile } from "@/lib/file_upload";

interface AcademicAward {
  title: string;
  file: string | null;
}

export interface AcademicAwardsPayload {
  hasAcademicAwards: "Yes" | "No";
  academicAwards: AcademicAward[];
  userId: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const hasAcademicAwards = formData.get("hasAcademicAwards") as "Yes" | "No";

    if (!userId) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }

    const payload: AcademicAwardsPayload = {
      hasAcademicAwards,
      userId,
      academicAwards: [],
    };

    if (hasAcademicAwards === "Yes") {
      const awardsCount = Number(formData.get("awardsCount") || 0);

      for (let i = 0; i < awardsCount; i++) {
        const title = formData.get(`awards[${i}][title]`) as string;
        const file = formData.get(`awards[${i}][file]`) as File | null;

        let filePath: string | null = null;

        if (file && file instanceof File) {
          filePath = await saveFile(file, `academicAwards`);
        }

        payload.academicAwards.push({
          title,
          file: filePath,
        });
      }
    }

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        "research.hasAcademicAwards": hasAcademicAwards === "Yes",
        "research.academicAwards": payload.academicAwards.map((award) => ({
          title: award.title,
          fileUrl: award.file, // store file path in fileUrl
        })),
      },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Academic awards saved successfully",
    });
  } catch (error) {
    console.error("Error saving academic awards:", error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
}

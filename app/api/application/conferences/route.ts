import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";
import { saveFile } from "@/lib/file_upload";

interface Conference {
  title: string;
  file: string | null;
}

export interface ConferencesPayload {
  hasConferences: "Yes" | "No";
  Conferences: Conference[];
  userId: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const hasConferences = formData.get("hasConferences") as "Yes" | "No";

    if (!userId) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }

    const payload: ConferencesPayload = {
      hasConferences,
      userId,
      Conferences: [],
    };

    if (hasConferences === "Yes") {
      const projectsCount = Number(formData.get("projectsCount") || 0);

      for (let i = 0; i < projectsCount; i++) {
        const title = formData.get(`projects[${i}][title]`) as string;
        const file = formData.get(`projects[${i}][file]`) as File | null;

        let filePath: string | null = null;

        if (file && file instanceof File) {
          filePath = await saveFile(file, `conferences/${userId}`);
        }

        payload.Conferences.push({
          title,
          file: filePath,
        });
      }
    }

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        "research.hasConferences": hasConferences === "Yes",
        "research.conferences": payload.Conferences.map((c) => ({
          title: c.title,
          fileUrl: c.file,
        })),
      },
      { returnDocument: "after", runValidators: true }
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Conferences saved successfully",
    });
  } catch (error) {
    console.error("Error saving conferences:", error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
}
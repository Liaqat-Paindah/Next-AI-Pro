import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";
import { saveFile } from "@/lib/file_upload";

interface ResearchProject {
  title: string;
  file: string | null; // store file path
}

export interface ResearchProjectsPayload {
  hasResearchProjects: "Yes" | "No";
  researchProjects: ResearchProject[];
  userId: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const hasResearchProjects = formData.get("hasResearchProjects") as
      | "Yes"
      | "No";

    if (!userId) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }

    const payload: ResearchProjectsPayload = {
      hasResearchProjects,
      userId,
      researchProjects: [],
    };

    if (hasResearchProjects === "Yes") {
      const projectsCount = Number(formData.get("projectsCount") || 0);

      for (let i = 0; i < projectsCount; i++) {
        const title = formData.get(`projects[${i}][title]`) as string;
        const file = formData.get(`projects[${i}][file]`) as File | null;

        let filePath: string | null = null;
        if (file && file instanceof File) {
          filePath = await saveFile(file, `researchproject/${userId}`);
        }

        payload.researchProjects.push({ title, file: filePath });
      }
    }

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      { research: payload },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Research Projects saved successfully",
    });
  } catch (error) {
    console.error("Error saving research projects:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
}

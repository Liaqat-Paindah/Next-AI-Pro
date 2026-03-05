import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";
import { saveFile } from "@/lib/file_upload";

interface ResearchSkill {
  title: string;
  file: string | null;
}

export interface ResearchSkillsPayload {
  hasResearchSkills: "Yes" | "No";
  researchSkills: ResearchSkill[];
  userId: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const hasResearchSkills = formData.get("hasResearchSkills") as "Yes" | "No";

    if (!userId) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }

    const payload: ResearchSkillsPayload = {
      hasResearchSkills,
      userId,
      researchSkills: [],
    };

    if (hasResearchSkills === "Yes") {
      const skillsCount = Number(formData.get("skillsCount") || 0);

      for (let i = 0; i < skillsCount; i++) {
        const title = formData.get(`skills[${i}][title]`) as string;
        const file = formData.get(`skills[${i}][file]`) as File | null;

        let filePath: string | null = null;

        if (file && file instanceof File) {
          filePath = await saveFile(file, `researchSkills`);
        }

        payload.researchSkills.push({
          title,
          file: filePath,
        });
      }
    }

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        "research.hasResearchSkills": hasResearchSkills === "Yes",
        "research.researchSkills": payload.researchSkills.map((skill) => ({
          title: skill.title,
          fileUrl: skill.file,
        })),
      },
      { returnDocument: "after", runValidators: true }
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Research skills saved successfully",
    });
  } catch (error) {
    console.error("Error saving research skills:", error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
}
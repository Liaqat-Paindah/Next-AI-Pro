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
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }
    const hasComputerSkills = formData.get("hasComputerSkills") as "Yes" | "No";
    const hasCommunicationSkills = formData.get("hasCommunicationSkills") as
      | "Yes"
      | "No";
    const hasMediaContentCreation = formData.get("hasMediaContentCreation") as
      | "Yes"
      | "No";
    const youtubeLink = formData.get("youtubeLink") as string;
    const hasTeamworkSkills = formData.get("hasTeamworkSkills") as "Yes" | "No";
    const hasLeadershipSkills = formData.get("hasLeadershipSkills") as
      | "Yes"
      | "No";
    const hasProblemSolving = formData.get("hasProblemSolving") as "Yes" | "No";
    const hasTimeManagement = formData.get("hasTimeManagement") as "Yes" | "No";
    const hasPresentationSkills = formData.get("hasPresentationSkills") as
      | "Yes"
      | "No";
    const computerSkillsFile = formData.get(
      "computerSkillsFile",
    ) as File | null;
    if (
      !hasComputerSkills ||
      !hasCommunicationSkills ||
      !hasMediaContentCreation ||
      !hasTeamworkSkills ||
      !hasLeadershipSkills ||
      !hasProblemSolving ||
      !hasTimeManagement ||
      !hasPresentationSkills
    ) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Missing required fields",
      });
    }
    if (hasComputerSkills === "Yes" && !computerSkillsFile) {
      return NextResponse.json({
        status: 400,
        success: false,
        message:
          "Computer skills document is required when computer skills is Yes",
      });
    }

    let computerSkillsFileUrl: string | undefined;
    if (computerSkillsFile && computerSkillsFile instanceof File) {
      try {
        if (computerSkillsFile.size > 10 * 1024 * 1024) {
          return NextResponse.json({
            status: 400,
            success: false,
            message: "File size must be less than 10MB",
          });
        }
        computerSkillsFileUrl = await saveFile(
          computerSkillsFile,
          "skills-documents",
        );
      } catch {
        return NextResponse.json({
          status: 500,
          success: false,
          message: "Failed to upload file",
        });
      }
    }

    // Prepare update data matching your schema structure
    const updateData = {
      skills: {
        computerSkills: {
          hasSkill: hasComputerSkills === "Yes",
          fileUrl: computerSkillsFileUrl || null,
        },
        communicationSkills: hasCommunicationSkills === "Yes",
        mediaContentCreation: {
          hasSkill: hasMediaContentCreation === "Yes",
          youtubeLink: youtubeLink || null,
        },
        teamworkSkills: hasTeamworkSkills === "Yes",
        leadershipSkills: hasLeadershipSkills === "Yes",
        problemSolving: hasProblemSolving === "Yes",
        timeManagement: hasTimeManagement === "Yes",
        presentationSkills: hasPresentationSkills === "Yes",
      },
    };

    // Update or create application
    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Skills saved successfully",
    });
  } catch (error) {
    console.error("Error saving skills:", error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
}

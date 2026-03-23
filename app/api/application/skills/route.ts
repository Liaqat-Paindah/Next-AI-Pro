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

    // Get all skill fields
    const hasComputerSkills = formData.get("hasComputerSkills") as "Yes" | "No";
    const hasCommunicationSkills = formData.get("hasCommunicationSkills") as "Yes" | "No";
    const hasMediaContentCreation = formData.get("hasMediaContentCreation") as "Yes" | "No";
    const youtubeLink = formData.get("youtubeLink") as string;
    const hasTeamworkSkills = formData.get("hasTeamworkSkills") as "Yes" | "No";
    const hasLeadershipSkills = formData.get("hasLeadershipSkills") as "Yes" | "No";
    const hasProblemSolving = formData.get("hasProblemSolving") as "Yes" | "No";
    const hasTimeManagement = formData.get("hasTimeManagement") as "Yes" | "No";
    const hasPresentationSkills = formData.get("hasPresentationSkills") as "Yes" | "No";

    // Get all file fields
    const computerSkillsFile = formData.get("computerSkillsFile") as File | null;
    const communicationSkillsFile = formData.get("communicationSkillsFile") as File | null;
    const teamworkSkillsFile = formData.get("teamworkSkillsFile") as File | null;
    const leadershipSkillsFile = formData.get("leadershipSkillsFile") as File | null;
    const problemSolvingFile = formData.get("problemSolvingFile") as File | null;
    const timeManagementFile = formData.get("timeManagementFile") as File | null;
    const presentationSkillsFile = formData.get("presentationSkillsFile") as File | null;

    // Validate required fields
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

    // Validate Media Content Creation YouTube link
    if (hasMediaContentCreation === "Yes" && !youtubeLink) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "YouTube link is required when Media Content Creation is Yes",
      });
    }

    // Helper function to upload file
    const uploadFile = async (file: File | null, fieldName: string): Promise<string | undefined> => {
      if (file && file instanceof File) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${fieldName} size must be less than 10MB`);
        }
        return await saveFile(file, "skillsDocuments");
      }
      return undefined;
    };

    // Upload files conditionally
    let computerSkillsFileUrl: string | undefined;
    let communicationSkillsFileUrl: string | undefined;
    let teamworkSkillsFileUrl: string | undefined;
    let leadershipSkillsFileUrl: string | undefined;
    let problemSolvingFileUrl: string | undefined;
    let timeManagementFileUrl: string | undefined;
    let presentationSkillsFileUrl: string | undefined;

    try {
      // Only upload if skill is "Yes" and file is provided
      if (hasComputerSkills === "Yes" && computerSkillsFile) {
        computerSkillsFileUrl = await uploadFile(computerSkillsFile, "Computer skills");
      }

      if (hasCommunicationSkills === "Yes" && communicationSkillsFile) {
        communicationSkillsFileUrl = await uploadFile(communicationSkillsFile, "Communication skills");
      }

      if (hasTeamworkSkills === "Yes" && teamworkSkillsFile) {
        teamworkSkillsFileUrl = await uploadFile(teamworkSkillsFile, "Teamwork skills");
      }

      if (hasLeadershipSkills === "Yes" && leadershipSkillsFile) {
        leadershipSkillsFileUrl = await uploadFile(leadershipSkillsFile, "Leadership skills");
      }

      if (hasProblemSolving === "Yes" && problemSolvingFile) {
        problemSolvingFileUrl = await uploadFile(problemSolvingFile, "Problem solving");
      }

      if (hasTimeManagement === "Yes" && timeManagementFile) {
        timeManagementFileUrl = await uploadFile(timeManagementFile, "Time management");
      }

      if (hasPresentationSkills === "Yes" && presentationSkillsFile) {
        presentationSkillsFileUrl = await uploadFile(presentationSkillsFile, "Presentation skills");
      }
    } catch (error) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: error instanceof Error ? error.message : "Failed to upload file",
      });
    }

    // Prepare update data matching the schema structure
    const updateData = {
      skills: {
        steps: "true",
        computerSkills: {
          hasSkill: hasComputerSkills === "Yes",
          fileUrl: computerSkillsFileUrl || null,
        },
        communicationSkills: {
          hasSkill: hasCommunicationSkills === "Yes",
          fileUrl: communicationSkillsFileUrl || null,
        },
        mediaContentCreation: {
          hasSkill: hasMediaContentCreation === "Yes",
          youtubeLink: youtubeLink || null,
        },
        teamworkSkills: {
          hasSkill: hasTeamworkSkills === "Yes",
          fileUrl: teamworkSkillsFileUrl || null,
        },
        leadershipSkills: {
          hasSkill: hasLeadershipSkills === "Yes",
          fileUrl: leadershipSkillsFileUrl || null,
        },
        problemSolving: {
          hasSkill: hasProblemSolving === "Yes",
          fileUrl: problemSolvingFileUrl || null,
        },
        timeManagement: {
          hasSkill: hasTimeManagement === "Yes",
          fileUrl: timeManagementFileUrl || null,
        },
        presentationSkills: {
          hasSkill: hasPresentationSkills === "Yes",
          fileUrl: presentationSkillsFileUrl || null,
        },
      },
    };

    // Update or create application
    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { 
        returnDocument: "after", 
        runValidators: true, 
        upsert: true,
        // Disable strict mode to allow nested object updates
        strict: false
      }
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
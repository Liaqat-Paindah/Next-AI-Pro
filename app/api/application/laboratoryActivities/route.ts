import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";
import { saveFile } from "@/lib/file_upload";

interface LaboratoryActivity {
  title: string;
  file: string | null;
}

export interface LaboratoryActivitiesPayload {
  hasLaboratoryActivities: "Yes" | "No";
  laboratoryActivities: LaboratoryActivity[];
  userId: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const hasLaboratoryActivities = formData.get("hasLaboratoryActivities") as
      | "Yes"
      | "No";

    if (!userId) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }

    const payload: LaboratoryActivitiesPayload = {
      hasLaboratoryActivities,
      userId,
      laboratoryActivities: [],
    };

    if (hasLaboratoryActivities === "Yes") {
      const activitiesCount = Number(formData.get("activitiesCount") || 0);

      for (let i = 0; i < activitiesCount; i++) {
        const title = formData.get(`activities[${i}][title]`) as string;
        const file = formData.get(`activities[${i}][file]`) as File | null;

        let filePath: string | null = null;
        if (file && file instanceof File) {
          filePath = await saveFile(file, `laboratoryActivities`);
        }

        payload.laboratoryActivities.push({
          title,
          file: filePath,
        });
      }
    }

    // Store true/false based on user's choice
    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        "research.hasLaboratoryActivities": hasLaboratoryActivities === "Yes",
        "research.laboratoryActivities": payload.laboratoryActivities.map(
          (p) => ({
            title: p.title,
            fileUrl: p.file,
          }),
        ),
      },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Laboratory activities saved successfully",
    });
  } catch (error) {
    console.error("Error saving laboratory activities:", error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
}

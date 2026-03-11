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

    const activities = [];
    let index = 0;

    while (true) {
      const type = formData.get(`activities[${index}][type]`) as string | null;

      if (!type) break;

      const file = formData.get(`activities[${index}][file]`) as File | null;

      let fileUrl: string | null = null;

      if (file && file instanceof File) {
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({
            success: false,
            message: "File size must be less than 10MB",
          });
        }

        fileUrl = await saveFile(file, "activities");
      }

      activities.push({
        type,
        fileUrl,
      });

      index++;
    }
    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      { $set: { activities } },
      { returnDocument: "after", runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: "Activities saved successfully",
    });
  } catch (error) {
    console.error("Activities API Error:", error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
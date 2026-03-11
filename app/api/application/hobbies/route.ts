import { ConnectDB } from "@/lib/config";
import Applications from "@/models/Applications";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();

    // Get form data
    const formData = await req.formData();
    const userId = formData.get("userId")?.toString();
    const favoriteSports = formData.get("favoriteSports")?.toString();
    const leisureActivities = formData.get("leisureActivities")?.toString();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateData: Record<string, string> = {};
    if (favoriteSports) {
      updateData["hobbies.sports"] = favoriteSports; // Corrected field
    }
    if (leisureActivities) {
      updateData["hobbies.freeTimeActivities"] = leisureActivities; // Corrected field
    }

    // Update the application
    const application = await Applications.findOneAndUpdate(
      { userId },
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    // Handle not found
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Hobbies information saved successfully",
        data: application,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Handle errors
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save hobbies information";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
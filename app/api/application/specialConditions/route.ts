import { ConnectDB } from "@/lib/config";
import Applications from "@/models/Applications";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId")?.toString();
    const specialDisease = formData.get("specialDisease")?.toString();
    const physicalDisability = formData.get("physicalDisability")?.toString();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    const normalizedSpecialDisease = specialDisease?.trim() || "No";
    const normalizedPhysicalDisability = physicalDisability?.trim() || "No";

    const updateData: Record<string, string> = {
      "health.specialDiseases": normalizedSpecialDisease,
      "health.disabilityNeeds": normalizedPhysicalDisability,
    };

    const application = await Applications.findOneAndUpdate(
      { userId },
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Special conditions saved successfully",
        data: application,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to save the special conditions";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}

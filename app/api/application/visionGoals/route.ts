import { ConnectDB } from "@/lib/config";
import Applications from "@/models/Applications";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId")?.toString();
    const purposeOfEducation = formData.get("purposeOfEducation")?.toString();
    const postStudyPlan = formData.get("postStudyPlan")?.toString();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    const updateData: Record<string, string> = {};

    // Map form fields to schema paths
    if (purposeOfEducation) {
      updateData["goals.purposeOfEducation"] = purposeOfEducation;
    }

    if (postStudyPlan) {
      updateData["goals.postStudyPlan"] = postStudyPlan;
    }

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
      console.log("the result is" ,application)

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
        message: "Vision goals saved successfully",
        data: application,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to save the vision goals";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}
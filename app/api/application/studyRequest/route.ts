import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";
import mongoose from "mongoose";

export interface StudyRequestPayload {
  userId: string;
  scholarshipOnly: boolean;
  privateStudyOption: boolean;
  specialSkills: string;
  achievements: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const body: StudyRequestPayload = await req.json();

    const {
      userId,
      scholarshipOnly,
      privateStudyOption,
      specialSkills,
      achievements,
    } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    if (scholarshipOnly === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Scholarship study preference is required",
        },
        { status: 400 },
      );
    }

    if (privateStudyOption === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Private study preference is required",
        },
        { status: 400 },
      );
    }

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        $set: {
          "studyType.scholarshipOnly": scholarshipOnly,
          "studyType.privateStudyOption": privateStudyOption,
          "distinction.specialSkills": specialSkills?.trim() || "",
          "distinction.achievements": achievements?.trim() || "",
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedApplication) {
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
        message: "Study request information saved successfully",
        data: updatedApplication,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving study request information:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}

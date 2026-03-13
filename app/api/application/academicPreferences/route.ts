import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";

export interface AcademicPreferencesPayload {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  preferredCountries: string[];
  preferredUniversities: string[];
  studyLevel: string;
  userId: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();
    const body = await req.json();
    const {
      userId,
      field1,
      field2,
      field3,
      field4,
      preferredCountries,
      preferredUniversities,
      studyLevel,
    } = body;

    if (!userId) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }

    if (!field1 || !field2 || !field3 || !field4) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "All four fields of study are required",
      });
    }

    if (!preferredCountries || preferredCountries.length === 0) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "At least one preferred country is required",
      });
    }

    if (!studyLevel) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Study level is required",
      });
    }

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        preferences: {
          preferredFields: [field1, field2, field3, field4],
          preferredCountries,
          preferredUniversities: preferredUniversities || [],
          preferredStudyLevel: studyLevel,
        },
      },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Academic preferences saved successfully",
    });
  } catch (error) {
    console.error("Error saving academic preferences:", error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
}

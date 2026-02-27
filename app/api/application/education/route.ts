import { ConnectDB } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import Applications from "@/models/Applications";

export async function POST(req: NextRequest) {
  await ConnectDB();

  try {
    const body = await req.json();

    const { userId, proposedLevel, education } = body;
    console.log("the user id is", userId);
    console.log("the proposedLevel id is", proposedLevel);
    console.log("the education id is", education);

    const application = await Applications.findOneAndUpdate(
      { userId },
      {
        level: proposedLevel,
        education,
      },
      { new: true, upsert: true },
    );

    return NextResponse.json({
      success: true,
      message: "Education saved successfully",
      data: application,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error saving education" },
      { status: 500 },
    );
  }
}

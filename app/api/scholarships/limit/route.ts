
import { ConnectDB } from "@/lib/config";
import Schalorships from "@/models/Schalorships";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDB();

    const scholarships = await Schalorships.find().sort({ createdAt: -1 }).limit(6);

    return NextResponse.json(
      {
        success: true,
        data: scholarships,
        message: "Scholarships retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config";
import Scholarship from "@/models/Schalorships";

export async function POST(req: Request) {
  try {
    await ConnectDB();
    const body = await req.json();

    const {
      title,
      slug,
      description,
      type,
      level,
      fieldOfStudy,
      universities,
      country,
      requirements,
      deadline,
      image,
    } = body;

    if (
      !title ||
      !slug ||
      !description ||
      !type ||
      !level ||
      !fieldOfStudy ||
      !universities ||
      !country ||
      !requirements ||
      !deadline ||
      !image
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 },
      );
    }

    const scholarship = await Scholarship.create({
      title,
      slug,
      description,
      type,
      level,
      fieldOfStudy,
      universities,
      country,
      requirements,
      deadline,
      image,
    });

    return NextResponse.json(
      { success: true, data: scholarship },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await ConnectDB();

    const scholarships = await Scholarship.find().sort({ createdAt: -1 });

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
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config";
import Scholarships from "@/models/Schalorships";

export async function GET(req: Request) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search"); // general text
    const title = searchParams.get("title");
    const type = searchParams.get("type");
    const level = searchParams.get("level");
    const country = searchParams.get("country"); // country
    const fieldOfStudy = searchParams.get("fieldOfStudy");

    let query: any = {};
    if (type) query.type = type;
    if (level) query.level = level;
    if (fieldOfStudy) query.fieldOfStudy = { $in: [fieldOfStudy] };
    if (country) query.country = { $in: [country] };
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { requirements: { $regex: search, $options: "i" } },
        { fieldOfStudy: { $in: [search] } },
        { country: { $in: [search] } },
        { universities: { $in: [search] } },
      ];
    }
    const scholarships = await Scholarships.find(query).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        message: "Search completed successfully",
        data: scholarships,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

import { ConnectDB } from "@/lib/config";
import Applications from "@/models/Applications";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  try {
    await ConnectDB();
    const urlParts = req.url.split("/");
    const id = urlParts[urlParts.length - 1];
    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 },
      );
    }
    const ApplicationsList = await Applications.findOne({ userId: id });
    return NextResponse.json(
      {
        success: true,
        data: ApplicationsList,
        message: "Applicationss retrieved successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

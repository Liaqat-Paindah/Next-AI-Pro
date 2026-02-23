import { ConnectDB } from "@/lib/config";
import Schalorships from "@/models/Schalorships";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await ConnectDB();
    // Extract id from the URL path
    const urlParts = req.url.split("/");
    const id = urlParts[urlParts.length - 1];
    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 },
      );
    }
    const response = await Schalorships.findById(id);
    if (!response) {
      return NextResponse.json({
        message: "Not Found",
        success: false,
        response: null,
        status: 404,
      });
    }
    return NextResponse.json({
      message: "Success",
      success: true,
      response,
      status: 200,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

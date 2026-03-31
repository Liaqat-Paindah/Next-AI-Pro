import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config";
import User from "@/models/User";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ConnectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "User retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ConnectDB();
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    // Remove sensitive fields that shouldn't be updated
    const { email, password, ...updateData } = body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ConnectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
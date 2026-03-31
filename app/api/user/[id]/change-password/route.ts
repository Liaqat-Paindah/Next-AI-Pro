import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 },
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          message: "Current password and new password are required",
          success: false,
        },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          message: "New password must be at least 6 characters long",
          success: false,
        },
        { status: 400 },
      );
    }
    ConnectDB();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect", success: false },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(id, { password: hashedNewPassword });

    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

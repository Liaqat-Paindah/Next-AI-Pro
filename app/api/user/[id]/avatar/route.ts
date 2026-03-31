import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config";
import { saveFile } from "@/lib/file_upload";
import User from "@/models/User";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const errorResponse = (
  message: string,
  status: number,
  extra: Record<string, unknown> = {},
) => {
  return NextResponse.json(
    {
      success: false,
      message,
      ...extra,
    },
    { status },
  );
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ConnectDB();
    const { id } = await params;

    if (!id) {
      return errorResponse("User ID is required", 400);
    }

    const user = await User.findById(id).select("_id");
    if (!user) {
      return errorResponse("User not found", 404);
    }

    const formData = await req.formData();
    const avatar = formData.get("avatar");

    if (!(avatar instanceof File)) {
      return errorResponse("Avatar image is required", 400, {
        code: "MISSING_AVATAR_FILE",
        field: "avatar",
      });
    }

    if (!avatar.type.startsWith("image/")) {
      return errorResponse("Avatar must be a valid image file", 400, {
        code: "INVALID_AVATAR_TYPE",
        field: "avatar",
      });
    }

    if (avatar.size > MAX_AVATAR_SIZE) {
      return errorResponse("Avatar file size must be less than 5MB", 400, {
        code: "AVATAR_TOO_LARGE",
        field: "avatar",
      });
    }

    const avatarPath = await saveFile(avatar, `profile`);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { avatar: avatarPath } },
      { returnDocument: "after", runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: "Profile updated successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
}

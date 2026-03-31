import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnectDB } from "@/lib/config";
import User from "@/models/User";

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

const normalizeString = (value: unknown) => {
  return typeof value === "string" ? value.trim() : undefined;
};

const getDuplicateFieldMessage = (field?: string) => {
  if (field === "phone") {
    return "Phone number is already in use";
  }

  if (field === "email") {
    return "Email address is already in use";
  }

  return "A record with this value already exists";
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ConnectDB();
    const { id } = await params;

    if (!id) {
      return errorResponse("User ID is required", 400);
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "User retrieved successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ConnectDB();
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return errorResponse("User ID is required", 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse("Invalid request body", 400, {
        code: "INVALID_REQUEST_BODY",
      });
    }

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return errorResponse("User not found", 404);
    }

    const finalUpdateData: Record<string, string> = {};
    const firstName = normalizeString(body.first_name);
    const lastName = normalizeString(body.last_name);
    const phone = normalizeString(body.phone);
    const avatar = normalizeString(body.avatar);

    if ("first_name" in body) {
      if (!firstName) {
        return errorResponse("First name is required", 400, {
          code: "INVALID_FIRST_NAME",
          field: "first_name",
        });
      }

      finalUpdateData.first_name = firstName;
    }

    if ("last_name" in body) {
      if (!lastName) {
        return errorResponse("Last name is required", 400, {
          code: "INVALID_LAST_NAME",
          field: "last_name",
        });
      }

      finalUpdateData.last_name = lastName;
    }

    if ("avatar" in body && typeof avatar === "string") {
      finalUpdateData.avatar = avatar;
    }

    if ("phone" in body) {
      if (!phone) {
        return errorResponse("Phone number is required", 400, {
          code: "INVALID_PHONE",
          field: "phone",
        });
      }

      if (phone !== currentUser.phone) {
        const existingUser = await User.findOne({
          phone,
          _id: { $ne: id },
        }).select("_id");

        if (existingUser) {
          return errorResponse("Phone number is already in use", 409, {
            code: "PHONE_ALREADY_IN_USE",
            field: "phone",
          });
        }

        finalUpdateData.phone = phone;
      }
    }

    if (Object.keys(finalUpdateData).length === 0) {
      return errorResponse("No valid fields were provided for update", 400, {
        code: "EMPTY_UPDATE_PAYLOAD",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: finalUpdateData },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "User updated successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("User update error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const firstValidationError = Object.values(error.errors)[0];
      return errorResponse(firstValidationError?.message || "Invalid user data", 400, {
        code: "VALIDATION_ERROR",
      });
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      const duplicateField =
        "keyPattern" in error && error.keyPattern && typeof error.keyPattern === "object"
          ? Object.keys(error.keyPattern as Record<string, unknown>)[0]
          : undefined;

      return errorResponse(getDuplicateFieldMessage(duplicateField), 409, {
        code:
          duplicateField === "phone"
            ? "PHONE_ALREADY_IN_USE"
            : "DUPLICATE_FIELD",
        field: duplicateField,
      });
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ConnectDB();
    const { id } = await params;

    if (!id) {
      return errorResponse("User ID is required", 400);
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
}

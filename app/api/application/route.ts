import { ConnectDB } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Applications from "@/models/Applications";
import { PersonalInfoFormData } from "@/types/application";

export async function POST(req: NextRequest) {
  await ConnectDB();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const body = await req.json();
    if (!body?.data) {
      return NextResponse.json(
        { success: false, message: "Request data is required" },
        { status: 400 },
      );
    }
    const formData: PersonalInfoFormData = body.data;
    if (!formData?.email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }
    const {
      email,
      first_name,
      last_name,
      fatherName,
      age,
      gender,
      maritalStatus,
      birthDate,
      nationality,
      nationalId,
      passportId,
      dateofIssue,
      dataofExpire,
      phone,
    } = formData;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { first_name, last_name, phone } },
      { returnDocument: "after", session, runValidators: true },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update user" },
        { status: 500 },
      );
    }
    const application = await Applications.create(
      [
        {
          userId: updatedUser._id.toString(),
          status: "draft",
          personal: {
            firstName: first_name,
            lastName: last_name,
            fatherName,
            age,
            gender,
            maritalStatus,
            birthDate,
            nationality,
            nationalId,
            passportId,
            dateofIssue,
            dataofExpire,
          },
          contact: {
            phone,
            email,
          },
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      application,
      message: "Personal information saved successfully",
    });
  } catch {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      { success: false || "Transaction failed" },
      { status: 500 },
    );
  }
}

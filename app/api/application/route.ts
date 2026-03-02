import { ConnectDB } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

import { PersonalInfoFormData } from "@/types/application";
import Applications from "@/models/Applications";

export async function POST(req: NextRequest) {
  await ConnectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const formData: PersonalInfoFormData = body;
    console.log("Received formData:", formData);

    // Validate required fields
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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Update user basic info
    const emailNormalized = email.trim().toLowerCase();
    const updatedUser = await User.findOneAndUpdate(
      { email: emailNormalized },
      { $set: { first_name, last_name, phone } },
      { returnDocument: "after", session, runValidators: true },
    );
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update user" },
        { status: 500 },
      );
    }

    // Check if an application already exists for this user
    const existingApplication = await Applications.findOne({
      userId: updatedUser._id.toString(),
    }).session(session);

    let application;
    if (existingApplication) {
      // Update existing application
      existingApplication.personal = {
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
      };
      existingApplication.contact = {
        phone,
        email,
      };
      application = await existingApplication.save({ session });
    } else {
      // Create new application
      application = await Applications.create(
        [
          {
            userId: updatedUser._id,
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
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      application,
      message: "Personal information saved successfully",
    });
  } catch (error) {
    console.error("Transaction error:", error);
    await session.abortTransaction();
    session.endSession();

    return NextResponse.json(
      { success: false, message: "Transaction failed", error },
      { status: 500 },
    );
  }
}


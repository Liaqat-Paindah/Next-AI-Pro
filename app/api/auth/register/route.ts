import { ConnectDB } from "@/lib/config";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, first_name, last_name, phone } = body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !phone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Connect to database
    await ConnectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 },
      );
    }
        const ExistPhone = await User.findOne({ phone });
    if (ExistPhone) {
      return NextResponse.json(
        { message: "Phone number already in use" },
        { status: 400 },
      );
    }

    // Create new user
    const newUser = new User({
      email,
      password,
      first_name,
      last_name,
      phone,
    });

    await newUser.save();

    // Return success response (excluding password)
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          _id: newUser._id.toString(),
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          phone: newUser.phone,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

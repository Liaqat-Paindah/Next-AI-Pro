import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";

export interface AddressContactPayload {
  permanentProvince: string;
  permanentDistrict: string;
  permanentArea: string;
  currentProvince: string;
  currentDistrict: string;
  currentArea: string;
  currentFullAddress: string;
  whatsapp: string;
  relativePhone: string;
  userId: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();
    const body = await req.json();
    const {
      userId,
      permanentProvince,
      permanentDistrict,
      permanentArea,
      currentProvince,
      currentDistrict,
      currentArea,
      currentFullAddress,
      whatsapp,
      relativePhone,
    } = body;

    if (!userId) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }

    // Validate required fields
    if (!permanentProvince || !permanentDistrict || !permanentArea) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Permanent address (province, district, area) is required",
      });
    }

    if (!currentProvince || !currentDistrict || !currentArea) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Current address (province, district, area) is required",
      });
    }

    if (!currentFullAddress) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Current full address is required",
      });
    }

    if (!relativePhone) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Relative's phone number is required",
      });
    }

    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        "contact.permanentAddress.province": permanentProvince,
        "contact.permanentAddress.district": permanentDistrict,
        "contact.permanentAddress.area": permanentArea,

        "contact.currentAddress.province": currentProvince,
        "contact.currentAddress.district": currentDistrict,
        "contact.currentAddress.area": currentArea,

        "contact.detailedAddress": currentFullAddress,
        "contact.whatsapp": whatsapp || "",
        "contact.relativePhone": relativePhone,
      },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Address & contact information saved successfully",
    });
  } catch (error) {
    console.error("Error saving address & contact information:", error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
}

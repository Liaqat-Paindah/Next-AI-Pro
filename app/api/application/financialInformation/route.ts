import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import Applications from "@/models/Applications";

export interface FinancialInfoPayload {
  familyIncome: string;
  tuitionAbility: string;
  transportAbility: "Yes" | "No";
  userId: string;
}

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const familyIncome = formData.get("familyIncome") as string;
    const tuitionAbility = formData.get("tuitionAbility") as string;
    const transportAbility = formData.get("transportAbility") as "Yes" | "No";

    // Basic validation
    if (!userId || !familyIncome || !tuitionAbility || !transportAbility) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "All financial information fields are required",
      });
    }

    const familyIncomeNum = Number(familyIncome);
    if (isNaN(familyIncomeNum)) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Family income must be a number",
      });
    }

    // Validate enums
    const tuitionOptions = ["High", "Medium", "Low", "None"];
    if (!tuitionOptions.includes(tuitionAbility)) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Invalid tuition ability",
      });
    }

    if (!["Yes", "No"].includes(transportAbility)) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Invalid transport ability",
      });
    }

    // Update the application document
    const updatedApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        "financial.familyIncome": familyIncomeNum,
        "financial.canPayTuition": tuitionAbility,
        "financial.canPayTravel": transportAbility,
      },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: updatedApplication,
      message: "Financial information saved successfully",
    });
  } catch (error) {
    console.error("Error saving financial information:", error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
}

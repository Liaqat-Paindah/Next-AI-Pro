import { ConnectDB } from "@/lib/config";
import { NextResponse } from "next/server";
import { Article } from "@/types/application";
import Applications from "@/models/Applications";

export async function POST(req: Request) {
  try {
    await ConnectDB();
    const body = await req.json();
    const { hasAcademicArticles, academicArticles, userId } = body;
    const researchData = {
      hasArticles: hasAcademicArticles === "Yes",
      articles: Array.isArray(academicArticles)
        ? academicArticles.map((article: Article) => ({
            title: article.title,
            citation: article.apaReference,
            link: article.link,
          }))
        : [],
    };

    const newApplication = await Applications.findOneAndUpdate(
      { userId },
      {
        research: researchData,
      },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      status: 200,
      success: true,
      data: newApplication,
      message: "Application saved successfully",
    });
  } catch (error) {
    console.error("Error saving application:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
}

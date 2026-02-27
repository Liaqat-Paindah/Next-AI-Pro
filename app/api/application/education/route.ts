import { ConnectDB } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import Applications from "@/models/Applications";

interface EducationInput {
  fieldOfStudy: string;
  institutionName: string;
  gpa: number;
  academicRank?: string;
  startDate: string;
  graduationDate: string;
  educationGapExplanation?: string;
  thesisTopic?: string;
  thesisFileUrl?: string;
  diplomaFileUrl?: string;
  transcriptFileUrl?: string;
  finalExamYear?: number;
  finalExamScore?: number;
  majorSubjects?: string[];
}

type EducationLevel = "HighSchool" | "Bachelor" | "Master";

interface EducationItemDB {
  level: EducationLevel;
  fieldOfStudy: string;
  institutionName: string;
  gpa: number;
  academicRank?: string;
  startDate: Date | null;
  graduationDate: Date | null;
  educationGapExplanation?: string;
  thesisTopic?: string;
  thesisFileUrl?: string;
  diplomaFileUrl?: string;
  transcriptFileUrl?: string;
  finalExamYear?: number;
  finalExamScore?: number;
  majorSubjects?: string[];
}

interface RequestBody {
  userId: string;
  level: EducationLevel | "PHD";
  highSchoolEducation?: EducationInput[];
  bachelorEducation?: EducationInput[];
  masterEducation?: EducationInput | EducationInput[];
}

export async function POST(req: NextRequest) {
  await ConnectDB();

  try {
    const body: RequestBody = await req.json();
    const { userId, level, highSchoolEducation, bachelorEducation, masterEducation } = body;

    const educationArray: EducationItemDB[] = [];

    const processEducation = (items: EducationInput[], eduLevel: EducationLevel) => {
      items.forEach((edu) => {
        const startDate = new Date(edu.startDate);
        const graduationDate = new Date(edu.graduationDate);

        educationArray.push({
          level: eduLevel,
          fieldOfStudy: edu.fieldOfStudy,
          institutionName: edu.institutionName,
          gpa: edu.gpa,
          academicRank: edu.academicRank,
          startDate: isNaN(startDate.getTime()) ? null : startDate,
          graduationDate: isNaN(graduationDate.getTime()) ? null : graduationDate,
          educationGapExplanation: edu.educationGapExplanation,
          thesisTopic: edu.thesisTopic,
          thesisFileUrl: edu.thesisFileUrl,
          diplomaFileUrl: edu.diplomaFileUrl,
          transcriptFileUrl: edu.transcriptFileUrl,
          finalExamYear: edu.finalExamYear,
          finalExamScore: edu.finalExamScore,
          majorSubjects: edu.majorSubjects,
        });
      });
    };

    if (highSchoolEducation?.length) processEducation(highSchoolEducation, "HighSchool");
    if (bachelorEducation?.length) processEducation(bachelorEducation, "Bachelor");

    if (masterEducation) {
      if (Array.isArray(masterEducation)) {
        processEducation(masterEducation, "Master");
      } else {
        processEducation([masterEducation], "Master");
      }
    }

    const application = await Applications.findOneAndUpdate(
      { userId },
      { level, education: educationArray },
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Education saved successfully",
      data: application,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error saving education", error: (error as Error).message },
      { status: 500 }
    );
  }
}
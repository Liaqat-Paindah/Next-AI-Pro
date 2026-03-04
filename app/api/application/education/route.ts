import { ConnectDB } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import Applications from "@/models/Applications";
import fs from "fs";
import path from "path";



// File upload utility
async function saveFile(file: File, subDir: string): Promise<string> {
  const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", subDir);

  // Create directory if it doesn't exist
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate unique filename
  const ext = path.extname(file.name);
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Save file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  fs.writeFileSync(filePath, buffer);

  // Return URL path
  return `/uploads/${subDir}/${fileName}`;
}

export async function POST(req: NextRequest) {
  await ConnectDB();

  try {
    // Parse FormData
    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const level = formData.get("level") as string;

    const educationArray = [];

    // ==================== PROCESS HIGH SCHOOL EDUCATION ====================
    let index = 0;
    while (formData.get(`highSchoolEducation[${index}][fieldOfStudy]`)) {
      const prefix = `highSchoolEducation[${index}]`;

      // Get files
      const diplomaFile = formData.get(`${prefix}[diplomaFile]`) as File;
      const transcriptFile = formData.get(`${prefix}[transcriptFile]`) as File;

      // Upload files
      let diplomaFileUrl = "";
      let transcriptFileUrl = "";

      if (diplomaFile && diplomaFile.size > 0) {
        diplomaFileUrl = await saveFile(diplomaFile, "highschool");
      }

      if (transcriptFile && transcriptFile.size > 0) {
        transcriptFileUrl = await saveFile(transcriptFile, "highschool");
      }

      // Create education object
      educationArray.push({
        level: "High School",
        fieldOfStudy: formData.get(`${prefix}[fieldOfStudy]`) as string,
        institutionName: formData.get(`${prefix}[institutionName]`) as string,
        gpa: parseFloat(formData.get(`${prefix}[gpa]`) as string),
        academicRank: formData.get(`${prefix}[academicRank]`) as string,
        academic_gap: formData.get(`${prefix}[academic_gap]`) as string,
        startDate: formData.get(`${prefix}[startDate]`)
          ? new Date(formData.get(`${prefix}[startDate]`) as string)
          : null,
        graduationDate: formData.get(`${prefix}[graduationDate]`)
          ? new Date(formData.get(`${prefix}[graduationDate]`) as string)
          : null,
        finalExamYear: formData.get(`${prefix}[finalExamYear]`)
          ? parseInt(formData.get(`${prefix}[finalExamYear]`) as string)
          : undefined,
        finalExamScore: formData.get(`${prefix}[finalExamScore]`)
          ? parseInt(formData.get(`${prefix}[finalExamScore]`) as string)
          : undefined,
        diplomaFileUrl,
        transcriptFileUrl,
      });

      index++;
    }

    // ==================== PROCESS BACHELOR EDUCATION (Multiple) ====================
    index = 0;
    while (formData.get(`bachelorEducation[${index}][fieldOfStudy]`)) {
      const prefix = `bachelorEducation[${index}]`;

      // Get files
      const diplomaFile = formData.get(`${prefix}[diplomaFile]`) as File;
      const transcriptFile = formData.get(`${prefix}[transcriptFile]`) as File;
      const thesisFile = formData.get(`${prefix}[thesisFile]`) as File; // Bachelor might have thesis in your data

      // Upload files
      let diplomaFileUrl = "";
      let transcriptFileUrl = "";
      let thesisFileUrl = "";

      if (diplomaFile && diplomaFile.size > 0) {
        diplomaFileUrl = await saveFile(diplomaFile, "bachelor");
      }

      if (transcriptFile && transcriptFile.size > 0) {
        transcriptFileUrl = await saveFile(transcriptFile, "bachelor");
      }

      if (thesisFile && thesisFile.size > 0) {
        thesisFileUrl = await saveFile(thesisFile, "bachelor/theses");
      }

      // Create education object
      educationArray.push({
        level: "Bachelor",
        fieldOfStudy: formData.get(`${prefix}[fieldOfStudy]`) as string,
        institutionName: formData.get(`${prefix}[institutionName]`) as string,
        gpa: parseFloat(formData.get(`${prefix}[gpa]`) as string),
        academicRank: formData.get(`${prefix}[academicRank]`) as string,
        academic_gap: formData.get(`${prefix}[academic_gap]`) as string,
        startDate: formData.get(`${prefix}[startDate]`)
          ? new Date(formData.get(`${prefix}[startDate]`) as string)
          : null,
        graduationDate: formData.get(`${prefix}[graduationDate]`)
          ? new Date(formData.get(`${prefix}[graduationDate]`) as string)
          : null,
        thesisTopic: formData.get(`${prefix}[thesisTopic]`) as string,
        thesisFileUrl,
        diplomaFileUrl,
        transcriptFileUrl,
      });

      index++;
    }

    // ==================== PROCESS MASTER EDUCATION ====================
    index = 0;
    while (formData.get(`masterEducation[${index}][fieldOfStudy]`)) {
      const prefix = `masterEducation[${index}]`;

      const diplomaFile = formData.get(`${prefix}[diplomaFile]`) as File;
      const transcriptFile = formData.get(`${prefix}[transcriptFile]`) as File;
      const thesisFile = formData.get(`${prefix}[thesisFile]`) as File;

      let diplomaFileUrl = "";
      let transcriptFileUrl = "";
      let thesisFileUrl = "";

      if (diplomaFile && diplomaFile.size > 0) {
        diplomaFileUrl = await saveFile(diplomaFile, "master");
      }

      if (transcriptFile && transcriptFile.size > 0) {
        transcriptFileUrl = await saveFile(transcriptFile, "master");
      }

      if (thesisFile && thesisFile.size > 0) {
        thesisFileUrl = await saveFile(thesisFile, "master/theses");
      }

      educationArray.push({
        level: "Master",
        fieldOfStudy: formData.get(`${prefix}[fieldOfStudy]`) as string,
        institutionName: formData.get(`${prefix}[institutionName]`) as string,
        gpa: parseFloat(formData.get(`${prefix}[gpa]`) as string),
        academicRank: formData.get(`${prefix}[academicRank]`) as string,
        academic_gap: formData.get(`${prefix}[academic_gap]`) as string,
        startDate: formData.get(`${prefix}[startDate]`)
          ? new Date(formData.get(`${prefix}[startDate]`) as string)
          : null,
        graduationDate: formData.get(`${prefix}[graduationDate]`)
          ? new Date(formData.get(`${prefix}[graduationDate]`) as string)
          : null,
        thesisTopic: formData.get(`${prefix}[thesisTopic]`) as string,
        thesisFileUrl,
        diplomaFileUrl,
        transcriptFileUrl,
      });

      index++;
    }

    // ==================== PROCESS PHD EDUCATION ====================
    index = 0;
    while (formData.get(`phdEducation[${index}][fieldOfStudy]`)) {
      const prefix = `phdEducation[${index}]`;

      const diplomaFile = formData.get(`${prefix}[diplomaFile]`) as File;
      const transcriptFile = formData.get(`${prefix}[transcriptFile]`) as File;
      const thesisFile = formData.get(`${prefix}[thesisFile]`) as File;

      let diplomaFileUrl = "";
      let transcriptFileUrl = "";
      let thesisFileUrl = "";

      if (diplomaFile && diplomaFile.size > 0) {
        diplomaFileUrl = await saveFile(diplomaFile, "phd");
      }

      if (transcriptFile && transcriptFile.size > 0) {
        transcriptFileUrl = await saveFile(transcriptFile, "phd");
      }

      if (thesisFile && thesisFile.size > 0) {
        thesisFileUrl = await saveFile(thesisFile, "phd/theses");
      }

      educationArray.push({
        level: "PHD",
        fieldOfStudy: formData.get(`${prefix}[fieldOfStudy]`) as string,
        institutionName: formData.get(`${prefix}[institutionName]`) as string,
        gpa: parseFloat(formData.get(`${prefix}[gpa]`) as string),
        academicRank: formData.get(`${prefix}[academicRank]`) as string,
        academic_gap: formData.get(`${prefix}[academic_gap]`) as string,
        startDate: formData.get(`${prefix}[startDate]`)
          ? new Date(formData.get(`${prefix}[startDate]`) as string)
          : null,
        graduationDate: formData.get(`${prefix}[graduationDate]`)
          ? new Date(formData.get(`${prefix}[graduationDate]`) as string)
          : null,
        thesisTopic: formData.get(`${prefix}[thesisTopic]`) as string,
        thesisFileUrl,
        diplomaFileUrl,
        transcriptFileUrl,
      });

      index++;
    }

    // ==================== JSON FALLBACK FOR BACHELOR ====================
    if (
      !educationArray.some((edu) => edu.level === "Bachelor") &&
      formData.get("bachelorEducation")
    ) {
      const bachelorData = JSON.parse(
        formData.get("bachelorEducation") as string,
      );
      if (Array.isArray(bachelorData)) {
        for (const bachelor of bachelorData) {
          educationArray.push({
            level: "Bachelor",
            fieldOfStudy: bachelor.fieldOfStudy || "",
            institutionName: bachelor.institutionName || "",
            gpa: bachelor.gpa ? parseFloat(bachelor.gpa) : 0,
            academicRank: bachelor.academicRank || "",
            academic_gap: bachelor.academic_gap || "",
            startDate: bachelor.startDate ? new Date(bachelor.startDate) : null,
            graduationDate: bachelor.graduationDate
              ? new Date(bachelor.graduationDate)
              : null,
            thesisTopic: bachelor.thesisTopic || "",
            // Files would need to be handled separately
          });
        }
      }
    }

    // ==================== JSON FALLBACK FOR MASTER ====================
    if (
      !educationArray.some((edu) => edu.level === "Master") &&
      formData.get("masterEducation")
    ) {
      const masterData = JSON.parse(formData.get("masterEducation") as string);
      if (Array.isArray(masterData)) {
        for (const master of masterData) {
          educationArray.push({
            level: "Master",
            fieldOfStudy: master.fieldOfStudy || "",
            institutionName: master.institutionName || "",
            gpa: master.gpa ? parseFloat(master.gpa) : 0,
            academicRank: master.academicRank || "",
            academic_gap: master.academic_gap || "",
            startDate: master.startDate ? new Date(master.startDate) : null,
            graduationDate: master.graduationDate
              ? new Date(master.graduationDate)
              : null,
            thesisTopic: master.thesisTopic || "",
          });
        }
      } else if (typeof masterData === "object") {
        // Single master object
        educationArray.push({
          level: "Master",
          fieldOfStudy: masterData.fieldOfStudy || "",
          institutionName: masterData.institutionName || "",
          gpa: masterData.gpa ? parseFloat(masterData.gpa) : 0,
          academicRank: masterData.academicRank || "",
          academic_gap: masterData.academic_gap || "",
          startDate: masterData.startDate
            ? new Date(masterData.startDate)
            : null,
          graduationDate: masterData.graduationDate
            ? new Date(masterData.graduationDate)
            : null,
          thesisTopic: masterData.thesisTopic || "",
        });
      }
    }

    // ==================== JSON FALLBACK FOR PHD ====================
    if (
      !educationArray.some((edu) => edu.level === "PHD") &&
      formData.get("phdEducation")
    ) {
      const phdData = JSON.parse(formData.get("phdEducation") as string);
      if (Array.isArray(phdData)) {
        for (const phd of phdData) {
          educationArray.push({
            level: "PHD",
            fieldOfStudy: phd.fieldOfStudy || "",
            institutionName: phd.institutionName || "",
            gpa: phd.gpa ? parseFloat(phd.gpa) : 0,
            academicRank: phd.academicRank || "",
            academic_gap: phd.academic_gap || "",
            startDate: phd.startDate ? new Date(phd.startDate) : null,
            graduationDate: phd.graduationDate
              ? new Date(phd.graduationDate)
              : null,
            thesisTopic: phd.thesisTopic || "",
          });
        }
      } else if (typeof phdData === "object") {
        // Single phd object
        educationArray.push({
          level: "PHD",
          fieldOfStudy: phdData.fieldOfStudy || "",
          institutionName: phdData.institutionName || "",
          gpa: phdData.gpa ? parseFloat(phdData.gpa) : 0,
          academicRank: phdData.academicRank || "",
          academic_gap: phdData.academic_gap || "",
          startDate: phdData.startDate ? new Date(phdData.startDate) : null,
          graduationDate: phdData.graduationDate
            ? new Date(phdData.graduationDate)
            : null,
          thesisTopic: phdData.thesisTopic || "",
        });
      }
    }

    // ==================== JSON FALLBACK FOR HIGH SCHOOL ====================
    if (
      !educationArray.some((edu) => edu.level === "High School") &&
      formData.get("highSchoolEducation")
    ) {
      const highSchoolData = JSON.parse(
        formData.get("highSchoolEducation") as string,
      );
      if (Array.isArray(highSchoolData)) {
        for (const highSchool of highSchoolData) {
          educationArray.push({
            level: "High School",
            fieldOfStudy: highSchool.fieldOfStudy || "",
            institutionName: highSchool.institutionName || "",
            gpa: highSchool.gpa ? parseFloat(highSchool.gpa) : 0,
            academicRank: highSchool.academicRank || "",
            academic_gap: highSchool.academic_gap || "",
            startDate: highSchool.startDate
              ? new Date(highSchool.startDate)
              : null,
            graduationDate: highSchool.graduationDate
              ? new Date(highSchool.graduationDate)
              : null,
            finalExamYear: highSchool.finalExamYear
              ? parseInt(highSchool.finalExamYear)
              : undefined,
            finalExamScore: highSchool.finalExamScore
              ? parseInt(highSchool.finalExamScore)
              : undefined,
          });
        }
      }
    }

    // ==================== SAVE TO DATABASE ====================
    const application = await Applications.findOneAndUpdate(
      { userId },
      { level, education: educationArray },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      success: true,
      message: "Education saved successfully",
      data: application,
      educationCount: educationArray.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error saving education",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// Add this if you need to handle large files
export const maxDuration = 60; // Increase timeout if needed

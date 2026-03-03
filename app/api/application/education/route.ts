import { ConnectDB } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import Applications from "@/models/Applications";
import fs from 'fs';
import path from 'path';

// Tell Next.js this route should not parse the body
export const config = {
  api: {
    bodyParser: false,
  },
};

// File upload utility
async function saveFile(file: File, subDir: string): Promise<string> {
  const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', subDir);
  
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
    
    const userId = formData.get('userId') as string;
    const level = formData.get('level') as string;
    
    const educationArray = [];

    // Process High School Education
    let index = 0;
    while (formData.get(`highSchoolEducation[${index}][fieldOfStudy]`)) {
      const prefix = `highSchoolEducation[${index}]`;
      
      // Get files
      const diplomaFile = formData.get(`${prefix}[diplomaFile]`) as File;
      const transcriptFile = formData.get(`${prefix}[transcriptFile]`) as File;
      
      // Upload files
      let diplomaFileUrl = '';
      let transcriptFileUrl = '';
      
      if (diplomaFile && diplomaFile.size > 0) {
        diplomaFileUrl = await saveFile(diplomaFile, 'highschool');
      }
      
      if (transcriptFile && transcriptFile.size > 0) {
        transcriptFileUrl = await saveFile(transcriptFile, 'highschool');
      }
      
      // Create education object
      educationArray.push({
        level: 'High School',
        fieldOfStudy: formData.get(`${prefix}[fieldOfStudy]`) as string,
        institutionName: formData.get(`${prefix}[institutionName]`) as string,
        gpa: parseFloat(formData.get(`${prefix}[gpa]`) as string),
        academicRank: formData.get(`${prefix}[academicRank]`) as string,
        startDate: formData.get(`${prefix}[startDate]`) ? new Date(formData.get(`${prefix}[startDate]`) as string) : null,
        graduationDate: formData.get(`${prefix}[graduationDate]`) ? new Date(formData.get(`${prefix}[graduationDate]`) as string) : null,
        finalExamYear: formData.get(`${prefix}[finalExamYear]`) ? parseInt(formData.get(`${prefix}[finalExamYear]`) as string) : undefined,
        finalExamScore: formData.get(`${prefix}[finalExamScore]`) ? parseInt(formData.get(`${prefix}[finalExamScore]`) as string) : undefined,
        diplomaFileUrl,
        transcriptFileUrl
      });
      
      index++;
    }

    // Process Bachelor Education
    index = 0;
    while (formData.get(`bachelorEducation[${index}][fieldOfStudy]`)) {
      const prefix = `bachelorEducation[${index}]`;
      
      const diplomaFile = formData.get(`${prefix}[diplomaFile]`) as File;
      const transcriptFile = formData.get(`${prefix}[transcriptFile]`) as File;
      
      let diplomaFileUrl = '';
      let transcriptFileUrl = '';
      
      if (diplomaFile && diplomaFile.size > 0) {
        diplomaFileUrl = await saveFile(diplomaFile, 'bachelor');
      }
      
      if (transcriptFile && transcriptFile.size > 0) {
        transcriptFileUrl = await saveFile(transcriptFile, 'bachelor');
      }
      
      educationArray.push({
        level: 'Bachelor',
        fieldOfStudy: formData.get(`${prefix}[fieldOfStudy]`) as string,
        institutionName: formData.get(`${prefix}[institutionName]`) as string,
        gpa: parseFloat(formData.get(`${prefix}[gpa]`) as string),
        academicRank: formData.get(`${prefix}[academicRank]`) as string,
        startDate: formData.get(`${prefix}[startDate]`) ? new Date(formData.get(`${prefix}[startDate]`) as string) : null,
        graduationDate: formData.get(`${prefix}[graduationDate]`) ? new Date(formData.get(`${prefix}[graduationDate]`) as string) : null,
        diplomaFileUrl,
        transcriptFileUrl
      });
      
      index++;
    }

    // Process Master Education
    if (formData.get('masterEducation[fieldOfStudy]')) {
      const diplomaFile = formData.get('masterEducation[diplomaFile]') as File;
      const transcriptFile = formData.get('masterEducation[transcriptFile]') as File;
      const thesisFile = formData.get('masterEducation[thesisFile]') as File;
      
      let diplomaFileUrl = '';
      let transcriptFileUrl = '';
      let thesisFileUrl = '';
      
      if (diplomaFile && diplomaFile.size > 0) {
        diplomaFileUrl = await saveFile(diplomaFile, 'master');
      }
      
      if (transcriptFile && transcriptFile.size > 0) {
        transcriptFileUrl = await saveFile(transcriptFile, 'master');
      }
      
      if (thesisFile && thesisFile.size > 0) {
        thesisFileUrl = await saveFile(thesisFile, 'master/theses');
      }
      
      educationArray.push({
        level: 'Master',
        fieldOfStudy: formData.get('masterEducation[fieldOfStudy]') as string,
        institutionName: formData.get('masterEducation[institutionName]') as string,
        gpa: parseFloat(formData.get('masterEducation[gpa]') as string),
        academicRank: formData.get('masterEducation[academicRank]') as string,
        startDate: formData.get('masterEducation[startDate]') ? new Date(formData.get('masterEducation[startDate]') as string) : null,
        graduationDate: formData.get('masterEducation[graduationDate]') ? new Date(formData.get('masterEducation[graduationDate]') as string) : null,
        thesisTopic: formData.get('masterEducation[thesisTopic]') as string,
        thesisFileUrl,
        diplomaFileUrl,
        transcriptFileUrl
      });
    }

    // Process PhD Education
    if (formData.get('phdEducation[fieldOfStudy]')) {
      const diplomaFile = formData.get('phdEducation[diplomaFile]') as File;
      const transcriptFile = formData.get('phdEducation[transcriptFile]') as File;
      const thesisFile = formData.get('phdEducation[thesisFile]') as File;
      
      let diplomaFileUrl = '';
      let transcriptFileUrl = '';
      let thesisFileUrl = '';
      
      if (diplomaFile && diplomaFile.size > 0) {
        diplomaFileUrl = await saveFile(diplomaFile, 'phd');
      }
      
      if (transcriptFile && transcriptFile.size > 0) {
        transcriptFileUrl = await saveFile(transcriptFile, 'phd');
      }
      
      if (thesisFile && thesisFile.size > 0) {
        thesisFileUrl = await saveFile(thesisFile, 'phd/theses');
      }
      
      educationArray.push({
        level: 'PHD',
        fieldOfStudy: formData.get('phdEducation[fieldOfStudy]') as string,
        institutionName: formData.get('phdEducation[institutionName]') as string,
        gpa: parseFloat(formData.get('phdEducation[gpa]') as string),
        academicRank: formData.get('phdEducation[academicRank]') as string,
        startDate: formData.get('phdEducation[startDate]') ? new Date(formData.get('phdEducation[startDate]') as string) : null,
        graduationDate: formData.get('phdEducation[graduationDate]') ? new Date(formData.get('phdEducation[graduationDate]') as string) : null,
        thesisTopic: formData.get('phdEducation[thesisTopic]') as string,
        thesisFileUrl,
        diplomaFileUrl,
        transcriptFileUrl
      });
    }

    // Save to database
    const application = await Applications.findOneAndUpdate(
      { userId },
      { level, education: educationArray },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Education saved successfully",
      data: application
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Error saving education",
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// Add this if you need to handle large files
export const maxDuration = 60; // Increase timeout if needed
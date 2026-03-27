import { ConnectDB } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import Applications from "@/models/Applications";
import { saveFile } from "@/lib/file_upload";
import type { EducationStepKey } from "@/types/application";

type EducationRecord = Record<string, unknown>;
type AssociateDecision = "yes" | "no";
type EducationLevel =
  | "PHD"
  | "Master"
  | "Bachelor"
  | "Associate"
  | "HighSchool"
  | "MiddleSchool";

const EDUCATION_SORT_ORDER: Record<string, number> = {
  PHD: 0,
  Master: 1,
  Bachelor: 2,
  Associate: 3,
  "High School": 4,
  "Secondary School": 5,
  "Primary School": 6,
};

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalNumber(value: FormDataEntryValue | null): number | undefined {
  const text = asString(value);
  if (!text) return undefined;
  const parsed = Number(text);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function asOptionalDate(value: FormDataEntryValue | null): Date | null {
  const text = asString(value);
  return text ? new Date(text) : null;
}

function asBoolean(value: FormDataEntryValue | null): boolean {
  const text = asString(value).toLowerCase();
  return text === "true" || text === "on" || text === "1";
}

function asFile(value: FormDataEntryValue | null): File | null {
  if (value instanceof File && value.size > 0) {
    return value;
  }
  return null;
}

function hasLevel(records: EducationRecord[], level: string): boolean {
  return records.some((record) => record.level === level);
}

function upsertEducationByLevel(
  records: EducationRecord[],
  level: string,
  newRecords: EducationRecord[],
): EducationRecord[] {
  const filtered = records.filter((record) => record.level !== level);
  return [...filtered, ...newRecords];
}

function sortEducation(records: EducationRecord[]): EducationRecord[] {
  return [...records].sort((a, b) => {
    const aLevel = typeof a.level === "string" ? a.level : "";
    const bLevel = typeof b.level === "string" ? b.level : "";
    const aRank = EDUCATION_SORT_ORDER[aLevel] ?? 999;
    const bRank = EDUCATION_SORT_ORDER[bLevel] ?? 999;
    return aRank - bRank;
  });
}

function normalizeAssociateDecision(
  value: FormDataEntryValue | null,
): AssociateDecision | undefined {
  const text = asString(value).toLowerCase();
  if (text === "yes" || text === "no") {
    return text;
  }
  return undefined;
}

function getAllowedSteps(level: EducationLevel): EducationStepKey[] {
  switch (level) {
    case "PHD":
      return [
        "phd",
        "master",
        "bachelor",
        "associate-question",
        "associate",
        "highschool",
      ];
    case "Master":
      return ["master", "bachelor", "associate-question", "associate", "highschool"];
    case "Bachelor":
      return ["bachelor", "associate-question", "associate", "highschool"];
    case "Associate":
      return ["associate", "highschool"];
    case "HighSchool":
      return ["highschool"];
    case "MiddleSchool":
      return ["primary-school", "secondary-school"];
    default:
      return [];
  }
}

function nextStepForLevel(
  level: EducationLevel,
  step: EducationStepKey,
  hasAssociate?: AssociateDecision,
): EducationStepKey | "complete" | null {
  switch (level) {
    case "PHD":
      if (step === "phd") return "master";
      if (step === "master") return "bachelor";
      if (step === "bachelor") return "associate-question";
      if (step === "associate-question") {
        return hasAssociate === "yes" ? "associate" : "highschool";
      }
      if (step === "associate") return "highschool";
      if (step === "highschool") return "complete";
      return null;
    case "Master":
      if (step === "master") return "bachelor";
      if (step === "bachelor") return "associate-question";
      if (step === "associate-question") {
        return hasAssociate === "yes" ? "associate" : "highschool";
      }
      if (step === "associate") return "highschool";
      if (step === "highschool") return "complete";
      return null;
    case "Bachelor":
      if (step === "bachelor") return "associate-question";
      if (step === "associate-question") {
        return hasAssociate === "yes" ? "associate" : "highschool";
      }
      if (step === "associate") return "highschool";
      if (step === "highschool") return "complete";
      return null;
    case "Associate":
      if (step === "associate") return "highschool";
      if (step === "highschool") return "complete";
      return null;
    case "HighSchool":
      if (step === "highschool") return "complete";
      return null;
    case "MiddleSchool":
      if (step === "primary-school") return "secondary-school";
      if (step === "secondary-school") return "complete";
      return null;
    default:
      return null;
  }
}

function validateStepOrder(
  level: EducationLevel,
  step: EducationStepKey,
  education: EducationRecord[],
  associateDecision: AssociateDecision | undefined,
): string | null {
  if (!getAllowedSteps(level).includes(step)) {
    return `Step '${step}' is not allowed for ${level}.`;
  }

  if (level === "PHD") {
    if (step !== "phd" && !hasLevel(education, "PHD")) {
      return "PHD information must be saved first.";
    }
    if (
      (step === "bachelor" ||
        step === "associate-question" ||
        step === "associate" ||
        step === "highschool") &&
      !hasLevel(education, "Master")
    ) {
      return "Master information must be saved before continuing.";
    }
    if (
      (step === "associate-question" || step === "associate" || step === "highschool") &&
      !hasLevel(education, "Bachelor")
    ) {
      return "Bachelor information must be saved before continuing.";
    }
  }

  if (level === "Master") {
    if (step !== "master" && !hasLevel(education, "Master")) {
      return "Master information must be saved first.";
    }
    if (
      (step === "associate-question" || step === "associate" || step === "highschool") &&
      !hasLevel(education, "Bachelor")
    ) {
      return "Bachelor information must be saved before continuing.";
    }
  }

  if (level === "Bachelor") {
    if (step !== "bachelor" && !hasLevel(education, "Bachelor")) {
      return "Bachelor information must be saved first.";
    }
  }

  if (level === "Associate") {
    if (step === "highschool" && !hasLevel(education, "Associate")) {
      return "Associate information must be saved before High School.";
    }
  }

  if (level === "MiddleSchool") {
    if (step === "secondary-school" && !hasLevel(education, "Primary School")) {
      return "Primary school information must be saved first.";
    }
  }

  if (step === "associate" && (level === "PHD" || level === "Master" || level === "Bachelor")) {
    if (associateDecision !== "yes") {
      return "Please confirm Associate Degree availability before this step.";
    }
  }

  if (
    step === "highschool" &&
    (level === "PHD" || level === "Master" || level === "Bachelor") &&
    associateDecision === "yes" &&
    !hasLevel(education, "Associate")
  ) {
    return "Associate information must be saved before High School.";
  }

  return null;
}

async function buildK12Record(
  formData: FormData,
  prefix: string,
  level: string,
  uploadFolder: string,
): Promise<EducationRecord | null> {
  const fieldOfStudy = asString(formData.get(`${prefix}[fieldOfStudy]`));
  if (!fieldOfStudy) {
    return null;
  }

  const diplomaFile = asFile(formData.get(`${prefix}[diplomaFile]`));
  const transcriptFile = asFile(formData.get(`${prefix}[transcriptFile]`));

  const diplomaFileUrl = diplomaFile
    ? await saveFile(diplomaFile, uploadFolder)
    : "";
  const transcriptFileUrl = transcriptFile
    ? await saveFile(transcriptFile, uploadFolder)
    : "";

  return {
    level,
    fieldOfStudy,
    institutionName: asString(formData.get(`${prefix}[institutionName]`)),
    gpa: asOptionalNumber(formData.get(`${prefix}[gpa]`)),
    academicRank: asString(formData.get(`${prefix}[academicRank]`)),
    educationGapExplanation: asString(formData.get(`${prefix}[academic_gap]`)),
    startDate: asOptionalDate(formData.get(`${prefix}[startDate]`)),
    graduationDate: asOptionalDate(formData.get(`${prefix}[graduationDate]`)),
    finalExamYear: asOptionalNumber(formData.get(`${prefix}[finalExamYear]`)),
    finalExamScore: asOptionalNumber(
      formData.get(`${prefix}[finalExamScore]`),
    ),
    currentlyStudying: asBoolean(formData.get(`${prefix}[currentlyStudying]`)),
    diplomaFileUrl,
    transcriptFileUrl,
  };
}

async function buildHigherEducationRecord(
  formData: FormData,
  prefix: string,
  level: string,
  uploadFolder: string,
): Promise<EducationRecord | null> {
  const fieldOfStudy = asString(formData.get(`${prefix}[fieldOfStudy]`));
  if (!fieldOfStudy) {
    return null;
  }

  const diplomaFile = asFile(formData.get(`${prefix}[diplomaFile]`));
  const transcriptFile = asFile(formData.get(`${prefix}[transcriptFile]`));
  const thesisFile = asFile(formData.get(`${prefix}[thesisFile]`));

  const diplomaFileUrl = diplomaFile
    ? await saveFile(diplomaFile, uploadFolder)
    : "";
  const transcriptFileUrl = transcriptFile
    ? await saveFile(transcriptFile, uploadFolder)
    : "";
  const thesisFileUrl = thesisFile
    ? await saveFile(thesisFile, `${uploadFolder}/theses`)
    : "";

  return {
    level,
    fieldOfStudy,
    institutionName: asString(formData.get(`${prefix}[institutionName]`)),
    gpa: asOptionalNumber(formData.get(`${prefix}[gpa]`)),
    academicRank: asString(formData.get(`${prefix}[academicRank]`)),
    educationGapExplanation: asString(formData.get(`${prefix}[academic_gap]`)),
    startDate: asOptionalDate(formData.get(`${prefix}[startDate]`)),
    graduationDate: asOptionalDate(formData.get(`${prefix}[graduationDate]`)),
    currentlyStudying: asBoolean(formData.get(`${prefix}[currentlyStudying]`)),
    thesisTopic: asString(formData.get(`${prefix}[thesisTopic]`)),
    thesisFileUrl,
    diplomaFileUrl,
    transcriptFileUrl,
  };
}

async function collectIndexedK12(
  formData: FormData,
  basePrefix: string,
  level: string,
  folder: string,
): Promise<EducationRecord[]> {
  const records: EducationRecord[] = [];
  let index = 0;
  while (formData.get(`${basePrefix}[${index}][fieldOfStudy]`)) {
    const record = await buildK12Record(
      formData,
      `${basePrefix}[${index}]`,
      level,
      folder,
    );
    if (record) {
      records.push(record);
    }
    index += 1;
  }
  return records;
}

async function collectIndexedHigherEducation(
  formData: FormData,
  basePrefix: string,
  level: string,
  folder: string,
): Promise<EducationRecord[]> {
  const records: EducationRecord[] = [];
  let index = 0;
  while (formData.get(`${basePrefix}[${index}][fieldOfStudy]`)) {
    const record = await buildHigherEducationRecord(
      formData,
      `${basePrefix}[${index}]`,
      level,
      folder,
    );
    if (record) {
      records.push(record);
    }
    index += 1;
  }
  return records;
}

async function parseLegacyEducation(
  formData: FormData,
  applicantLevel: string,
): Promise<EducationRecord[]> {
  const education: EducationRecord[] = [];

  const primaryLevel =
    applicantLevel === "MiddleSchool" ? "Primary School" : "Associate";
  const primaryFolder =
    applicantLevel === "MiddleSchool" ? "primaryschool" : "associate";
  const primaryRecord = await buildK12Record(
    formData,
    "primarySchool",
    primaryLevel,
    primaryFolder,
  );
  if (primaryRecord) {
    education.push(primaryRecord);
  }

  const associate14thRecord = await buildK12Record(
    formData,
    "associate14thEducation",
    "Associate",
    "associate",
  );
  if (associate14thRecord) {
    education.push(associate14thRecord);
  }

  education.push(
    ...(await collectIndexedK12(
      formData,
      "highSchoolEducation",
      "High School",
      "highschool",
    )),
  );
  education.push(
    ...(await collectIndexedK12(
      formData,
      "secondarySchoolEducation",
      "Secondary School",
      "secondaryschool",
    )),
  );

  const bachelorSingle = await buildHigherEducationRecord(
    formData,
    "bachelorEducation",
    "Bachelor",
    "bachelor",
  );
  if (bachelorSingle) {
    education.push(bachelorSingle);
  }
  education.push(
    ...(await collectIndexedHigherEducation(
      formData,
      "bachelorEducation",
      "Bachelor",
      "bachelor",
    )),
  );

  const masterSingle = await buildHigherEducationRecord(
    formData,
    "masterEducation",
    "Master",
    "master",
  );
  if (masterSingle) {
    education.push(masterSingle);
  }
  education.push(
    ...(await collectIndexedHigherEducation(
      formData,
      "masterEducation",
      "Master",
      "master",
    )),
  );

  const phdSingle = await buildHigherEducationRecord(
    formData,
    "phdEducation",
    "PHD",
    "phd",
  );
  if (phdSingle) {
    education.push(phdSingle);
  }
  education.push(
    ...(await collectIndexedHigherEducation(
      formData,
      "phdEducation",
      "PHD",
      "phd",
    )),
  );

  return sortEducation(education);
}

function getMongooseEducationRecords(value: unknown): EducationRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    if (
      entry &&
      typeof entry === "object" &&
      "toObject" in entry &&
      typeof (entry as { toObject?: () => unknown }).toObject === "function"
    ) {
      return (entry as { toObject: () => EducationRecord }).toObject();
    }
    return entry as EducationRecord;
  });
}

function toEducationLevel(value: string): EducationLevel | null {
  if (
    value === "PHD" ||
    value === "Master" ||
    value === "Bachelor" ||
    value === "Associate" ||
    value === "HighSchool" ||
    value === "MiddleSchool"
  ) {
    return value;
  }
  return null;
}

export async function POST(req: NextRequest) {
  await ConnectDB();

  try {
    const formData = await req.formData();
    const userId = asString(formData.get("userId"));
    const levelRaw = asString(formData.get("level"));
    const level = toEducationLevel(levelRaw);
    const rawStep = asString(formData.get("step"));
    const step = (rawStep || undefined) as EducationStepKey | undefined;
    const hasAssociateFromRequest = normalizeAssociateDecision(
      formData.get("hasAssociate14thDegree"),
    );

    if (!userId || !level) {
      return NextResponse.json(
        { success: false, message: "Valid userId and level are required." },
        { status: 400 },
      );
    }

    if (step) {
      const existingApplication = await Applications.findOne({ userId });
      if (!existingApplication) {
        return NextResponse.json(
          { success: false, message: "Application not found for this user." },
          { status: 404 },
        );
      }

      let education = getMongooseEducationRecords(existingApplication.education);
      let associateDecision: AssociateDecision | undefined =
        hasAssociateFromRequest ||
        (existingApplication.hasAssociate14thDegree as AssociateDecision | undefined);

      const guardError = validateStepOrder(
        level,
        step,
        education,
        associateDecision,
      );
      if (guardError) {
        return NextResponse.json(
          { success: false, message: guardError },
          { status: 400 },
        );
      }

      switch (step) {
        case "phd": {
          const phdRecord = await buildHigherEducationRecord(
            formData,
            "phdEducation",
            "PHD",
            "phd",
          );
          if (!phdRecord) {
            return NextResponse.json(
              { success: false, message: "PHD details are required for this step." },
              { status: 400 },
            );
          }
          education = upsertEducationByLevel(education, "PHD", [phdRecord]);
          break;
        }
        case "master": {
          const masterRecord = await buildHigherEducationRecord(
            formData,
            "masterEducation",
            "Master",
            "master",
          );
          if (!masterRecord) {
            return NextResponse.json(
              { success: false, message: "Master details are required for this step." },
              { status: 400 },
            );
          }
          education = upsertEducationByLevel(education, "Master", [masterRecord]);
          break;
        }
        case "bachelor": {
          const bachelorRecord =
            (await buildHigherEducationRecord(
              formData,
              "bachelorEducation[0]",
              "Bachelor",
              "bachelor",
            )) ||
            (await buildHigherEducationRecord(
              formData,
              "bachelorEducation",
              "Bachelor",
              "bachelor",
            ));
          if (!bachelorRecord) {
            return NextResponse.json(
              { success: false, message: "Bachelor details are required for this step." },
              { status: 400 },
            );
          }
          education = upsertEducationByLevel(education, "Bachelor", [bachelorRecord]);
          break;
        }
        case "associate-question": {
          if (!associateDecision) {
            return NextResponse.json(
              {
                success: false,
                message:
                  "Please answer whether you have an Associate Degree (14th Grade).",
              },
              { status: 400 },
            );
          }
          if (associateDecision === "no") {
            education = education.filter((record) => record.level !== "Associate");
          }
          break;
        }
        case "associate": {
          const prefix = level === "Associate" ? "associate14thEducation" : "primarySchool";
          const associateRecord = await buildK12Record(
            formData,
            prefix,
            "Associate",
            "associate",
          );
          if (!associateRecord) {
            return NextResponse.json(
              { success: false, message: "Associate details are required for this step." },
              { status: 400 },
            );
          }
          if (level !== "Associate") {
            associateDecision = "yes";
          }
          education = upsertEducationByLevel(education, "Associate", [associateRecord]);
          break;
        }
        case "highschool": {
          const highSchoolRecord =
            (await buildK12Record(
              formData,
              "highSchoolEducation[0]",
              "High School",
              "highschool",
            )) ||
            (await buildK12Record(
              formData,
              "highSchoolEducation",
              "High School",
              "highschool",
            ));
          if (!highSchoolRecord) {
            return NextResponse.json(
              { success: false, message: "High School details are required for this step." },
              { status: 400 },
            );
          }
          education = upsertEducationByLevel(education, "High School", [highSchoolRecord]);
          break;
        }
        case "primary-school": {
          const primaryRecord = await buildK12Record(
            formData,
            "primarySchool",
            "Primary School",
            "primaryschool",
          );
          if (!primaryRecord) {
            return NextResponse.json(
              {
                success: false,
                message: "Primary School details are required for this step.",
              },
              { status: 400 },
            );
          }
          education = upsertEducationByLevel(education, "Primary School", [
            primaryRecord,
          ]);
          break;
        }
        case "secondary-school": {
          const secondaryRecord =
            (await buildK12Record(
              formData,
              "secondarySchoolEducation[0]",
              "Secondary School",
              "secondaryschool",
            )) ||
            (await buildK12Record(
              formData,
              "secondarySchoolEducation",
              "Secondary School",
              "secondaryschool",
            ));
          if (!secondaryRecord) {
            return NextResponse.json(
              {
                success: false,
                message: "Secondary School details are required for this step.",
              },
              { status: 400 },
            );
          }
          education = upsertEducationByLevel(education, "Secondary School", [
            secondaryRecord,
          ]);
          break;
        }
        default: {
          return NextResponse.json(
            { success: false, message: "Invalid step supplied for education save." },
            { status: 400 },
          );
        }
      }

      education = sortEducation(education);

      const updatePayload: Record<string, unknown> = {
        level,
        education,
      };
      if (associateDecision) {
        updatePayload.hasAssociate14thDegree = associateDecision;
      }

      const updatedApplication = await Applications.findOneAndUpdate(
        { userId },
        updatePayload,
        { returnDocument: "after", runValidators: true },
      );

      return NextResponse.json({
        success: true,
        message: "Education step saved successfully.",
        data: updatedApplication,
        educationCount: education.length,
        nextStep: nextStepForLevel(level, step, associateDecision),
      });
    }

    const education = await parseLegacyEducation(formData, level);
    const updatePayload: Record<string, unknown> = { level, education };
    if (hasAssociateFromRequest) {
      updatePayload.hasAssociate14thDegree = hasAssociateFromRequest;
    }

    const application = await Applications.findOneAndUpdate(
      { userId },
      updatePayload,
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      success: true,
      message: "Education saved successfully",
      data: application,
      educationCount: education.length,
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

export const maxDuration = 60;

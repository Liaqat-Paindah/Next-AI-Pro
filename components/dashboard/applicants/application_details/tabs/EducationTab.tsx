import { Education } from "@/types/application_details";
import {
  GraduationCap,
  BookOpen,
  Building2,
  Star,
  Trophy,
  Calendar,
  CalendarCheck,
  ScrollText,
  FileText,
  FileCheck,
  BookMarked,
  Award,
  FileX,
  AlertCircle,
} from "lucide-react";

interface EducationTabProps {
  data: Education[];
}

const EducationTab = ({ data }: EducationTabProps) => {
  const formatDate = (date: Date | string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  if (baseURL) {
    console.log("Base URL not Provided");
  }

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">
          Education History
        </h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400">
          Academic background and qualifications.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {data.map((edu, index) => (
          <div
            key={index}
            className="border-t border-gray-200 dark:border-white/10 first:border-0"
          >
            <div className="pt-6">
              <div className="px-4 sm:px-0 mb-4">
                <h4 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education #{index + 1}
                </h4>
              </div>

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {/* Column 1 - Basic Information */}
                <div className="divide-y divide-gray-200 dark:divide-white/10">
                  <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                      <BookOpen className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Level
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                      {edu.level || (
                        <span className="italic text-gray-500 dark:text-gray-500">
                          Not provided
                        </span>
                      )}
                    </dd>
                  </div>

                  <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                      <BookMarked className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Field of Study
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                      {edu.fieldOfStudy || (
                        <span className="italic text-gray-500 dark:text-gray-500">
                          Not provided
                        </span>
                      )}
                    </dd>
                  </div>

                  <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                      <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Institution
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                      {edu.institutionName || (
                        <span className="italic text-gray-500 dark:text-gray-500">
                          Not provided
                        </span>
                      )}
                    </dd>
                  </div>

                  <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                      <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Start Date
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                      {edu.startDate ? (
                        formatDate(edu.startDate)
                      ) : (
                        <span className="italic text-gray-500 dark:text-gray-500">
                          Not provided
                        </span>
                      )}
                    </dd>
                  </div>

                  <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                      <CalendarCheck className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Graduation Date
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                      {edu.graduationDate ? (
                        formatDate(edu.graduationDate)
                      ) : (
                        <span className="italic text-gray-500 dark:text-gray-500">
                          Not provided
                        </span>
                      )}
                    </dd>
                  </div>

                  <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                      <Star className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      GPA
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                      {edu.gpa ? (
                        edu.gpa
                      ) : (
                        <span className="italic text-gray-500 dark:text-gray-500">
                          Not provided
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                {/* Column 2 - Additional Information */}
                <div className="divide-y divide-gray-200 dark:divide-white/10">
                  <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                      <Trophy className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Academic Rank
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                      {edu.academicRank ? (
                        edu.academicRank
                      ) : (
                        <span className="italic text-gray-500 dark:text-gray-500">
                          Not provided
                        </span>
                      )}
                    </dd>
                  </div>

                  {/* High School Specific Fields */}
                  {edu.level === "High School" ? (
                    <>
                      <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                          <Award className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          Final Exam Year
                        </dt>
                        <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                          {edu.finalExamYear ? (
                            edu.finalExamYear
                          ) : (
                            <span className="italic text-gray-500 dark:text-gray-500">
                              Not provided
                            </span>
                          )}
                        </dd>
                      </div>

                      <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                          <Award className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          Final Exam Score
                        </dt>
                        <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                          {edu.finalExamScore ? (
                            edu.finalExamScore
                          ) : (
                            <span className="italic text-gray-500 dark:text-gray-500">
                              Not provided
                            </span>
                          )}
                        </dd>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                          <ScrollText className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          Thesis Topic
                        </dt>
                        <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                          {edu.thesisTopic ? (
                            edu.thesisTopic
                          ) : (
                            <span className="italic text-gray-500 dark:text-gray-500">
                              Not provided
                            </span>
                          )}
                        </dd>
                      </div>

                      <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                          <AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          Gap Explanation
                        </dt>
                        <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                          {edu.educationGapExplanation ? (
                            edu.educationGapExplanation
                          ) : (
                            <span className="italic text-gray-500 dark:text-gray-500">
                              Not provided
                            </span>
                          )}
                        </dd>
                      </div>
                    </>
                  )}

                  {/* Major Subjects - Now in column 2 */}
                  <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                      <BookMarked className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Major Subjects
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                      {edu.majorSubjects && edu.majorSubjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {edu.majorSubjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-700"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="italic text-gray-500 dark:text-gray-500">
                          No major subjects provided
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              </dl>

              {/* Files Section - Two Columns for Files */}
              <div className="mt-6 px-4 sm:px-0">
                <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    Attached Documents
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column - Diploma & Transcript */}
                    <div className="space-y-3">
                      {/* Diploma */}
                      <div>
                        <h6 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Diploma
                        </h6>
                        {edu.diplomaFileUrl ? (
                          <FileAttachmentItem
                            icon={
                              <FileText className="h-5 w-5 text-gray-400" />
                            }
                            name="Diploma"
                            fileName={`${baseURL}/${edu.diplomaFileUrl}`}
                            isUrl
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 italic py-2 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                            <FileX className="h-4 w-4" />
                            No diploma file provided
                          </div>
                        )}
                      </div>

                      {/* Transcript */}
                      <div>
                        <h6 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Transcript
                        </h6>
                        {edu.transcriptFileUrl ? (
                          <FileAttachmentItem
                            icon={
                              <FileCheck className="h-5 w-5 text-gray-400" />
                            }
                            name="Transcript"
                            fileName={`${baseURL}/${edu.transcriptFileUrl}`}
                            isUrl
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 italic py-2 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                            <FileX className="h-4 w-4" />
                            No transcript file provided
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Thesis (if applicable) */}
                    <div className="space-y-3">
                      {edu.level !== "High School" && (
                        <div>
                          <h6 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Thesis
                          </h6>
                          {edu.thesisFileUrl ? (
                            <FileAttachmentItem
                              icon={
                                <ScrollText className="h-5 w-5 text-gray-400" />
                              }
                              name="Thesis"
                              fileName={edu.thesisFileUrl}
                              isUrl
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 italic py-2 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                              <FileX className="h-4 w-4" />
                              No thesis file provided
                            </div>
                          )}
                        </div>
                      )}

                      {/* Empty state for right column when no thesis */}
                      {edu.level === "High School" && (
                        <div className="h-full flex items-start">
                          <div className="text-sm text-gray-400 dark:text-gray-600 italic py-2">
                            No additional documents
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Improved FileAttachmentItem component
const FileAttachmentItem = ({
  icon,
  name,
  fileName,
  isUrl = false,
}: {
  icon: React.ReactNode;
  name: string;
  fileName: string;
  isUrl?: boolean;
}) => {
  const displayName = fileName.split("/").pop() || fileName;

  return (
    <div className="flex items-center justify-between py-2 pr-4 pl-4 text-sm/6 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
      <div className="flex w-0 flex-1 items-center">
        {icon}
        <div className="ml-3 flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium text-gray-700 dark:text-white">
            {name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {displayName}
          </span>
        </div>
      </div>
      <div className="ml-4 shrink-0">
        <a
          href={isUrl ? fileName : "#"}
          className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-xs"
          target={isUrl ? "_blank" : undefined}
          rel={isUrl ? "noopener noreferrer" : undefined}
        >
          {isUrl ? "View →" : "Download"}
        </a>
      </div>
    </div>
  );
};

export default EducationTab;

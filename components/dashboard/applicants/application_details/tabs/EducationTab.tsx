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
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

interface EducationTabProps {
  data: Education[];
  EducationLevel: string;
}

const EducationTab = ({ data, EducationLevel }: EducationTabProps) => {
  const formatDate = (date: Date | string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  if (!baseURL) {
    console.log("Base URL not Provided");
  }

  return (
    <div className="w-full">
      {/* Header Section with Professional Spacing */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Education History
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Highest Education Level: {EducationLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Education Items */}
      <div className="divide-y divide-gray-200 dark:border-white/10">
        {data.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            {/* Education Item Container */}
            <div className="px-6 sm:px-8 py-8">
              {/* Education Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    flex h-10 w-10 items-center justify-center rounded-sm
                    ${
                      index === 0
                        ? "bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20"
                        : "bg-gray-100 dark:bg-white/5"
                    }
                  `}
                  >
                    <GraduationCap
                      className={`
                      h-5 w-5 
                      ${
                        index === 0
                          ? "text-[#00A3FF]"
                          : "text-gray-400 dark:text-gray-500"
                      }
                    `}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {edu.level
                        ? edu.level.charAt(0).toUpperCase() +
                          edu.level.slice(1).toLowerCase()
                        : "Education"}
                      {edu.fieldOfStudy && (
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          · {edu.fieldOfStudy}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {edu.institutionName || "Institution not specified"}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                {edu.currentlyStudying ? (
                  <div className="rounded-sm bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    Currently Studying
                  </div>
                ) : edu.graduationDate &&
                  new Date(edu.graduationDate) <= new Date() ? (
                  <div className="rounded-sm bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    Completed
                  </div>
                ) : edu.graduationDate &&
                  new Date(edu.graduationDate) > new Date() ? (
                  <div className="rounded-sm bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                    In Progress
                  </div>
                ) : null}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column - Basic Information */}
                <div className="space-y-4">
                  {/* Level */}
                  {edu.level && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <BookOpen className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Level
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {edu.level
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(" ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Field of Study */}
                  {edu.fieldOfStudy && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <BookMarked className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Field of Study
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {edu.fieldOfStudy
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(" ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Institution */}
                  {edu.institutionName && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <Building2 className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Institution
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {edu.institutionName
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(" ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GPA */}
                  {edu.gpa && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <Star className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          GPA / Average Marks
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {edu.gpa}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Currently Studying */}
                  {edu.currentlyStudying && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <Clock className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Status
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          Currently Enrolled
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Additional Information */}
                <div className="space-y-4">
                  {/* Academic Rank */}
                  {edu.academicRank && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <Trophy className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Academic Rank
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {edu.academicRank
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(" ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Final Exam Year (High School) */}
                  {edu.finalExamYear && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <Award className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Final Exam Year
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {edu.finalExamYear}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Final Exam Score (High School) */}
                  {edu.finalExamScore && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <Award className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Final Exam Score
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {edu.finalExamScore}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Thesis Topic */}
                  {edu.thesisTopic && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <ScrollText className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Thesis Topic
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {edu.thesisTopic
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(" ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Graduation Date */}
                  {edu.graduationDate && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <CalendarCheck className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Graduation Date
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {formatDate(edu.graduationDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Education Gap Explanation */}
                  {edu.educationGapExplanation && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <AlertCircle className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 tracking-wider">
                          Gap Explanation
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                          {edu.educationGapExplanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Start Date */}
                  {edu.startDate && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                        <Calendar className="h-4 w-4 text-[#00A3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                          Start Date
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {formatDate(edu.startDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents Section */}
              {(edu.diplomaFileUrl ||
                edu.transcriptFileUrl ||
                edu.thesisFileUrl) && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-[#00A3FF]" />
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Attached Documents
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Diploma */}
                    {(edu.diplomaFileUrl || edu.diplomaFileUrl) && (
                      <FileAttachmentItem
                        icon={<FileText className="h-4 w-4 text-[#00A3FF]" />}
                        name="Diploma"
                        fileName={
                          edu.diplomaFileUrl || edu.diplomaFileUrl || ""
                        }
                        isUrl
                      />
                    )}

                    {/* Transcript */}
                    {(edu.transcriptFileUrl || edu.transcriptFileUrl) && (
                      <FileAttachmentItem
                        icon={<FileCheck className="h-4 w-4 text-[#00A3FF]" />}
                        name="Transcript"
                        fileName={
                          edu.transcriptFileUrl || edu.transcriptFileUrl || ""
                        }
                        isUrl
                      />
                    )}

                    {/* Thesis */}
                    {(edu.thesisFileUrl || edu.thesisFileUrl) && (
                      <FileAttachmentItem
                        icon={<ScrollText className="h-4 w-4 text-[#00A3FF]" />}
                        name="Thesis"
                        fileName={edu.thesisFileUrl || edu.thesisFileUrl || ""}
                        isUrl
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Subtle Hover Effect */}
            <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Improved FileAttachmentItem component with professional styling
const FileAttachmentItem = ({
  icon,
  name,
  fileName,
}: {
  icon: React.ReactNode;
  name: string;
  fileName: string;
  isUrl?: boolean;
}) => {
  const displayName = fileName.split("/").pop() || fileName;
  const fullUrl = `${process.env.NEXT_PUBLIC_FILE_URL}/${fileName}`;

  return (
    <div className="group relative overflow-hidden rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 transition-all duration-300 hover:border-[#00A3FF]/30 hover:shadow-lg hover:shadow-[#00A3FF]/5">
      <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {displayName}
            </p>
          </div>
        </div>

        <div className="ml-4 shrink-0">
          <a
            href={fullUrl}
            className="inline-flex items-center gap-1 rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] px-3 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#00A3FF]/25"
            target="_blank"
            rel="noopener noreferrer"
          >
            View
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EducationTab;

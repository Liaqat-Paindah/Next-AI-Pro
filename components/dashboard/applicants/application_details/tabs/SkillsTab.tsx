import { Application } from "@/types/application_details";
import {
  Computer,
  Mic2,
  Youtube,
  Users,
  Crown,
  Lightbulb,
  Clock,
  Presentation,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface SkillsTabProps {
  data: Application["skills"];
}

const SkillsTab = ({ data }: SkillsTabProps) => {
  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  if (!baseURL) {
    console.log("Base URL not Provided");
  }

  // Check if there's any skills data to display
  const hasAnySkills =
    data.steps !== "false" ||
    data.computerSkills.hasSkill ||
    data.communicationSkills ||
    data.mediaContentCreation.hasSkill ||
    data.teamworkSkills ||
    data.leadershipSkills ||
    data.problemSolving ||
    data.timeManagement ||
    data.presentationSkills;

  if (!hasAnySkills) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                <Mic2 className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Skills Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not added any skills information yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <Mic2 className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Skills & Competencies
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional skills and technical competencies
            </p>
          </div>
        </div>
      </div>

      {/* Skills Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">
          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Computer Skills */}
              <SkillItem
                icon={<Computer className="h-4 w-4 text-[#00A3FF]" />}
                label="Computer Skills"
                hasSkill={data.computerSkills.hasSkill}
                fileUrl={data.computerSkills.fileUrl}
                fileName="Computer Skills Certificate"
              />

              {/* Communication Skills */}
              <SkillItem
                icon={<Mic2 className="h-4 w-4 text-[#00A3FF]" />}
                label="Communication Skills"
                hasSkill={data.communicationSkills}
              />

              {/* Media Content Creation */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Youtube className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Media Content Creation
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {data.mediaContentCreation.hasSkill ? (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
                        <XCircle className="h-4 w-4" />
                        No
                      </span>
                    )}
                  </div>
                  {data.mediaContentCreation.youtubeLink && (
                    <a
                      href={data.mediaContentCreation.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#00A3FF] hover:text-[#7000FF] transition-colors mt-2"
                    >
                      <Youtube className="h-3 w-3" />
                      YouTube Channel
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Teamwork Skills */}
              <SkillItem
                icon={<Users className="h-4 w-4 text-[#00A3FF]" />}
                label="Teamwork Skills"
                hasSkill={data.teamworkSkills}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Leadership Skills */}
              <SkillItem
                icon={<Crown className="h-4 w-4 text-[#00A3FF]" />}
                label="Leadership Skills"
                hasSkill={data.leadershipSkills}
              />

              {/* Problem Solving */}
              <SkillItem
                icon={<Lightbulb className="h-4 w-4 text-[#00A3FF]" />}
                label="Problem Solving"
                hasSkill={data.problemSolving}
              />

              {/* Time Management */}
              <SkillItem
                icon={<Clock className="h-4 w-4 text-[#00A3FF]" />}
                label="Time Management"
                hasSkill={data.timeManagement}
              />

              {/* Presentation Skills */}
              <SkillItem
                icon={<Presentation className="h-4 w-4 text-[#00A3FF]" />}
                label="Presentation Skills"
                hasSkill={data.presentationSkills}
              />
            </div>
          </div>
        </div>

        {/* Subtle Hover Effect */}
        <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
        </div>
      </motion.div>
    </div>
  );
};

// Skill Item Component
const SkillItem = ({
  icon,
  label,
  hasSkill,
  fileUrl,
  fileName = "Document",
}: {
  icon: React.ReactNode;
  label: string;
  hasSkill: boolean;
  fileUrl?: string;
  fileName?: string;
}) => {

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
          {label}
        </p>
        <div className="mt-1 flex items-center gap-2">
          {hasSkill ? (
            <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Yes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
              <XCircle className="h-4 w-4" />
              No
            </span>
          )}
        </div>

        {/* File Attachment if exists */}
        {fileUrl && hasSkill && (
          <div className="mt-3">
            <FileAttachmentItem
              icon={<FileText className="h-4 w-4 text-[#00A3FF]" />}
              name={fileName}
              fileName={fileUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// FileAttachmentItem Component
const FileAttachmentItem = ({
  icon,
  name,
  fileName,
}: {
  icon: React.ReactNode;
  name: string;
  fileName: string;
}) => {
  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  const displayName = fileName.split("/").pop() || fileName;
  const fileUrl = baseURL ? `${baseURL}/${fileName}` : fileName;

  return (
    <div className="group/file relative overflow-hidden rounded-sm border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 transition-all duration-300 hover:border-[#00A3FF]/30 hover:shadow-lg hover:shadow-[#00A3FF]/5">
      <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 opacity-0 transition-opacity duration-300 group-hover/file:opacity-100" />

      <div className="relative flex items-center justify-between p-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
              {name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {displayName}
            </p>
          </div>
        </div>

        <div className="ml-2 shrink-0">
          <a
            href={fileUrl}
            className="inline-flex items-center gap-1 rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] px-2.5 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#00A3FF]/25"
            target="_blank"
            rel="noopener noreferrer"
          >
            View
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;
